#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, "..");
const localMode = process.argv.includes("--local");
const reportArgument = process.argv.find((argument) => argument.startsWith("--report="));
const reportPath = reportArgument
  ? path.resolve(root, reportArgument.slice("--report=".length))
  : null;

if (!localMode) {
  console.error("Usage: node scripts/run-integration-gate.mjs --local [--report=PATH]");
  console.error("Public-registry mode is not implemented yet; do not confuse this with the local workspace gate.");
  process.exit(2);
}

const results = [];

function runStage(label, command, args) {
  const startedAt = Date.now();
  console.log("\n==> " + label);
  console.log("$ " + [command, ...args].join(" "));
  const result = spawnSync(command, args, {
    cwd: root,
    env: process.env,
    stdio: "inherit",
  });
  const passed = result.status === 0;
  const entry = {
    label,
    command,
    args,
    passed,
    exitCode: result.status,
    durationMs: Date.now() - startedAt,
  };
  results.push(entry);
  console.log((passed ? "[PASS] " : "[FAIL] ") + label + " (" + entry.durationMs + " ms)");
  return passed;
}

function runPackageStage(packageName, scriptName) {
  return runStage(
    packageName + ": " + scriptName,
    "pnpm",
    ["--filter", packageName, "run", scriptName],
  );
}

runStage("baseline: strict verification", process.execPath, [
  "scripts/verify-baseline.mjs",
  "--strict",
]);

runStage("workspace: frozen install", "pnpm", ["install", "--frozen-lockfile"]);

const packageStages = [
  ["@relgeo/geometry", ["lint", "test", "build"]],
  ["@relgeo/core", ["lint", "test", "build"]],
  ["@relgeo/renderer-svg", ["lint", "test", "build", "test:dist"]],
  ["@relgeo/language-service", ["lint", "test", "build"]],
  ["@relgeo/remark-relgeo-hl", ["lint", "test", "build"]],
  ["@relgeo/remark-relgeo", ["lint", "test", "build"]],
  ["@relgeo/cli", ["test", "build"]],
];

for (const [packageName, scripts] of packageStages) {
  for (const scriptName of scripts) {
    runPackageStage(packageName, scriptName);
  }
}

const consumerStages = [
  ["relgeo-playground", "lint"],
  ["relgeo-playground", "test"],
  ["relgeo-playground", "audit:ux"],
  ["relgeo-playground", "build"],
  ["relgeo-docs-site", "check"],
  ["relgeo-docs-site", "build"],
  ["relgeo-docs-site", "test"],
  ["relgeo-docs-site", "test:pages-artifact"],
];

for (const [packageName, scriptName] of consumerStages) {
  runPackageStage(packageName, scriptName);
}

const failed = results.filter((result) => !result.passed);
const report = {
  mode: "local-workspace",
  generatedAt: new Date().toISOString(),
  passed: failed.length === 0,
  summary: {
    total: results.length,
    passed: results.length - failed.length,
    failed: failed.length,
  },
  results,
};

if (reportPath) {
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + "\n");
  console.log("\nReport: " + reportPath);
}

console.log(
  "\nIntegration gate summary: " +
    report.summary.passed +
    " passed, " +
    report.summary.failed +
    " failed, " +
    report.summary.total +
    " total",
);

process.exitCode = failed.length ? 1 : 0;
