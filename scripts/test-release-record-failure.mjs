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
const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), "relgeo-release-record-failure-"));
const mutatedRecord = path.join(temporaryRoot, "0.5.1.json");

try {
  const record = JSON.parse(fs.readFileSync(sourceRecord, "utf8"));
  record.status = "partial";
  record.recovery = {
    noRepublishSameVersion: true,
    partialReleasePolicy: "stop-and-record-then-forward-fix-next-patch",
    forwardFixVersion: record.releaseVersion,
    lastPublishedPackage: {
      path: "core",
      name: "@relgeo/core",
      status: "published",
      version: record.releaseVersion,
    },
    firstFailedPackage: {
      path: "language-service",
      name: "@relgeo/language-service",
      status: "failed",
      version: record.releaseVersion,
    },
  };
  fs.writeFileSync(mutatedRecord, JSON.stringify(record, null, 2) + "\n");

  const result = spawnSync(
    process.execPath,
    ["scripts/check-release-record.mjs", `--record-file=${mutatedRecord}`, "--json"],
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

  const orderRecord = JSON.parse(fs.readFileSync(sourceRecord, "utf8"));
  orderRecord.packagePlan.reverse();
  const orderRecordPath = path.join(temporaryRoot, "0.5.1-order.json");
  fs.writeFileSync(orderRecordPath, JSON.stringify(orderRecord, null, 2) + "\n");
  const orderResult = spawnSync(
    process.execPath,
    ["scripts/check-release-record.mjs", `--record-file=${orderRecordPath}`, "--json"],
    { cwd: root, encoding: "utf8" },
  );
  if (orderResult.status === 0) {
    throw new Error("Release record validator unexpectedly accepted a reordered package plan");
  }
  const orderReport = JSON.parse(orderResult.stdout);
  if (!orderReport.failures?.some((failure) => failure.includes("package order and bump policy"))) {
    throw new Error("Validator failed, but did not identify the reordered package plan");
  }

  console.log("Release record failure injection passed: unsafe recovery and reordered package plans are rejected.");
} finally {
  fs.rmSync(temporaryRoot, { recursive: true, force: true });
}
