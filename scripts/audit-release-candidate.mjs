#!/usr/bin/env node

import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const versionArgument = process.argv.find((argument) => argument.startsWith("--version="));
const positionalVersion = process.argv.find((argument) => /^\d+\.\d+\.\d+$/.test(argument));
const version = versionArgument?.slice("--version=".length) ?? positionalVersion ?? "0.5.1";
const jsonOutput = process.argv.includes("--json");
const matrixPath = resolve(root, "docs/compatibility-matrix.json");
const recordPath = resolve(root, "docs/releases", `${version}.json`);
const results = [];
const failures = [];

function check(condition, message, details = undefined) {
  const status = condition ? "PASS" : "FAIL";
  results.push({ status, message, ...(details ? { details } : {}) });
  if (!condition) failures.push(message);
}

function info(message) {
  results.push({ status: "INFO", message });
}

function gitRevision(path) {
  const result = spawnSync("git", ["-C", path, "rev-parse", "HEAD"], { encoding: "utf8" });
  return result.status === 0 ? result.stdout.trim() : null;
}

const [matrix, record] = await Promise.all([
  readFile(matrixPath, "utf8").then(JSON.parse),
  readFile(recordPath, "utf8").then(JSON.parse),
]);

check(["planned", "partial"].includes(record.status), `candidate ${version} has a planned or partial status`, record.status);
check(record.baseReleaseVersion === "0.5.0", "candidate uses base release 0.5.0", record.baseReleaseVersion);
check(record.compatibilityLine === matrix.compatibilityLine, "candidate stays on the active compatibility line");
check(
  Array.isArray(record.packagePlan) && record.packagePlan.length === matrix.packages.length,
  "candidate package plan covers every matrix package",
);
check(Array.isArray(record.sourceChanges) && record.sourceChanges.length > 0, "candidate records at least one source change");

const rootStatus = spawnSync("git", ["status", "--porcelain", "--untracked-files=normal"], {
  cwd: root,
  encoding: "utf8",
});
check(rootStatus.status === 0 && rootStatus.stdout.trim() === "", "workspace working tree is clean", rootStatus.stdout.trim());

for (const entry of record.packagePlan ?? []) {
  const packagePath = resolve(root, entry.path);
  const packageJsonPath = resolve(packagePath, "package.json");
  check(existsSync(packageJsonPath), `${entry.path}: package.json exists`);
  if (!existsSync(packageJsonPath)) continue;

  let packageJson;
  try {
    packageJson = JSON.parse(await readFile(packageJsonPath, "utf8"));
  } catch (error) {
    check(false, `${entry.path}: package.json is valid JSON`, error.message);
    continue;
  }

  check(packageJson.name === entry.name, `${entry.path}: package name matches candidate`, packageJson.name);
  check(
    new Set([entry.fromVersion, entry.targetVersion]).has(packageJson.version),
    `${entry.path}: local version is from or target version`,
    packageJson.version,
  );
  check(packageJson.private !== true, `${entry.path}: package is not private`);

  if (entry.targetVersion !== entry.fromVersion && packageJson.version === entry.fromVersion) {
    info(`${entry.path}: needs a version bump to ${entry.targetVersion}`);
  } else if (entry.targetVersion !== entry.fromVersion && packageJson.version === entry.targetVersion) {
    info(`${entry.path}: version bump is prepared at ${entry.targetVersion}`);
  } else {
    info(`${entry.path}: retained at ${entry.fromVersion}`);
  }
}

for (const change of record.sourceChanges ?? []) {
  const actualRevision = gitRevision(resolve(root, change.path));
  check(
    actualRevision !== null && actualRevision.startsWith(change.revision),
    `${change.path}: source revision matches candidate`,
    actualRevision ?? "unavailable",
  );
}

const summary = {
  candidate: `docs/releases/${version}.json`,
  status: record.status,
  passed: results.filter(({ status }) => status === "PASS").length,
  failed: failures.length,
  info: results.filter(({ status }) => status === "INFO").map(({ message }) => message),
  failures,
};

if (jsonOutput) console.log(JSON.stringify(summary, null, 2));
else {
  console.log(`RelGeo release candidate audit (${version})`);
  for (const result of results) {
    console.log(`[${result.status}] ${result.message}${result.details ? ` — ${result.details}` : ""}`);
  }
  console.log(`summary: ${summary.passed} passed, ${summary.failed} failed, ${summary.info.length} info`);
}

process.exitCode = failures.length > 0 ? 1 : 0;
