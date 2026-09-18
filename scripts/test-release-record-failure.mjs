#!/usr/bin/env node

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, "..");
const sourceRecord = path.join(root, "docs", "releases", "0.5.1.json");
const matrixFile = path.join(root, "docs", "compatibility-matrix.json");
const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), "relgeo-release-record-failure-"));
const mutatedRecord = path.join(temporaryRoot, "0.5.1.json");

try {
  const record = JSON.parse(fs.readFileSync(sourceRecord, "utf8"));
  const matrix = JSON.parse(fs.readFileSync(matrixFile, "utf8"));
  record.releaseVersion = "0.5.2";
  record.baseReleaseVersion = "0.5.0";
  record.status = "partial";
  record.packagePlan = matrix.packages.map((entry) => ({
    path: entry.path,
    name: entry.name,
    fromVersion: entry.version,
    targetVersion: entry.path === "core" ? "0.5.2" : entry.version,
    status: entry.path === "core" ? "planned" : "retained",
  }));
  record.consumers = matrix.consumers.map((entry) => ({ ...entry, status: "pending" }));
  record.recovery = {
    noRepublishSameVersion: true,
    partialReleasePolicy: "stop-and-record-then-forward-fix-next-patch",
    forwardFixVersion: "0.5.2",
    lastPublishedPackage: {
      path: "core",
      name: "@relgeo/core",
      status: "published",
      version: "0.5.2",
    },
    firstFailedPackage: {
      path: "language-service",
      name: "@relgeo/language-service",
      status: "failed",
      version: "0.5.2",
    },
  };
  fs.writeFileSync(mutatedRecord, JSON.stringify(record, null, 2) + "\n");

  const result = spawnSync(
    process.execPath,
    ["scripts/check-release-record.mjs", "0.5.2", `--record-file=${mutatedRecord}`, "--json"],
    { cwd: root, encoding: "utf8" },
  );

  if (result.status === 0) {
    throw new Error("Release record validator unexpectedly accepted an unsafe forward-fix version");
  }

  const report = JSON.parse(result.stdout);
  const forwardFixFailure = report.failures?.find((failure) => failure.includes("forward-fix version is newer"));
  if (!forwardFixFailure) {
    throw new Error("Validator failed, but did not identify the unsafe forward-fix version");
  }

  const orderRecord = JSON.parse(fs.readFileSync(mutatedRecord, "utf8"));
  orderRecord.packagePlan.reverse();
  const orderRecordPath = path.join(temporaryRoot, "0.5.1-order.json");
  fs.writeFileSync(orderRecordPath, JSON.stringify(orderRecord, null, 2) + "\n");
  const orderResult = spawnSync(
    process.execPath,
    ["scripts/check-release-record.mjs", "0.5.2", `--record-file=${orderRecordPath}`, "--json"],
    { cwd: root, encoding: "utf8" },
  );
  if (orderResult.status === 0) {
    throw new Error("Release record validator unexpectedly accepted a reordered package plan");
  }
  const orderReport = JSON.parse(orderResult.stdout);
  if (!orderReport.failures?.some((failure) => failure.includes("package order and bump policy"))) {
    throw new Error("Validator failed, but did not identify the reordered package plan");
  }

  const recoveryPlan = spawnSync(
    process.execPath,
    ["scripts/plan-release-recovery.mjs", `--record-file=${mutatedRecord}`, "--json"],
    { cwd: root, encoding: "utf8" },
  );
  if (recoveryPlan.status !== 0) {
    throw new Error(`Recovery planner unexpectedly failed: ${recoveryPlan.stderr}`);
  }
  const recoveryReport = JSON.parse(recoveryPlan.stdout);
  if (recoveryReport.executed !== false || recoveryReport.firstFailedPackage?.path !== "language-service") {
    throw new Error("Recovery planner did not produce a read-only plan for the partial boundary");
  }

  console.log("Release record failure injection passed: unsafe recovery, reordered package plans, and read-only recovery planning are covered.");
} finally {
  fs.rmSync(temporaryRoot, { recursive: true, force: true });
}
