#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const matrixPath = resolve(root, "docs/compatibility-matrix.json");
const baselinePath = resolve(root, "docs/integration-baseline.json");
const jsonOutput = process.argv.includes("--json");
const failures = [];
const results = [];

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

function pass(message) {
  results.push({ status: "PASS", message });
}

function fail(message) {
  failures.push(message);
  results.push({ status: "FAIL", message });
}

function check(condition, message) {
  if (condition) pass(message);
  else fail(message);
}

function versionLine(version) {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version ?? "");
  return match ? `${match[1]}.${match[2]}` : null;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function allDependencies(packageJson) {
  return ["dependencies", "devDependencies", "peerDependencies"].flatMap((section) =>
    Object.entries(packageJson[section] ?? {}).map(([name, range]) => ({ section, name, range })),
  );
}

const matrix = await readJson(matrixPath);
const baseline = await readJson(baselinePath);
const baselineByPath = new Map(baseline.submodules.map((entry) => [entry.path, entry]));
const entries = [...matrix.packages, ...matrix.consumers];
const entryByPath = new Map(entries.map((entry) => [entry.path, entry]));
const packageByName = new Map(matrix.packages.map((entry) => [entry.name, entry]));

check(matrix.schemaVersion === 1, "matrix schema version is supported");
check(entryByPath.size === entries.length, "matrix entries do not contain duplicate paths");
check(packageByName.size === matrix.packages.length, "matrix packages do not contain duplicate names");
check(matrix.compatibilityLine === baseline.compatibilityLine, "matrix and baseline use the same compatibility line");
check(matrix.contract.version === matrix.compatibilityLine, "contract version matches compatibility line");
check(
  matrix.contract.specRevision === baselineByPath.get(matrix.contract.specPath)?.revision,
  "matrix contract revision matches the pinned spec submodule",
);
check(
  matrix.policy.internalDependencyRange === `^${matrix.compatibilityLine}.0`,
  "internal dependency policy has an explicit current-line lower bound",
);

const expectedReleasePaths = entries.map((entry) => entry.path);
const releasePaths = matrix.policy.releaseOrder;
check(
  new Set(releasePaths).size === releasePaths.length,
  "release order does not contain duplicate repository paths",
);
check(
  releasePaths.length === expectedReleasePaths.length + 1 &&
    releasePaths.every((path, index) => path === ["spec", ...expectedReleasePaths][index]),
  "release order starts with spec and includes every package and consumer exactly once",
);

for (const entry of entries) {
  const packagePath = resolve(root, entry.path, "package.json");
  let packageJson;

  try {
    packageJson = await readJson(packagePath);
  } catch (error) {
    fail(`${entry.path}: package.json is unreadable (${error.message})`);
    continue;
  }

  const baselineEntry = baselineByPath.get(entry.path);
  check(Boolean(baselineEntry), `${entry.path}: path exists in the integration baseline`);
  check(packageJson.name === entry.name, `${entry.path}: package name matches the matrix`);
  check(packageJson.version === entry.version, `${entry.path}: package version matches the matrix`);
  check(Boolean(baselineEntry?.package), `${entry.path}: baseline records package metadata`);
  check(baselineEntry?.package?.name === entry.name, `${entry.path}: baseline package name matches the matrix`);
  check(baselineEntry?.package?.version === entry.version, `${entry.path}: baseline package version matches the matrix`);
  check(
    entry.versionPolicy === "independent" || versionLine(entry.version) === entry.compatibilityLine,
    `${entry.path}: version policy and compatibility line are coherent`,
  );

  const readmePath = resolve(root, entry.path, "README.md");
  try {
    const readme = await readFile(readmePath, "utf8");
    const marker = new RegExp(`(?:v|DSL\\s*)?${escapeRegExp(entry.compatibilityLine)}(?:\\.x)?\\b`);
    check(marker.test(readme), `${entry.path}: README declares compatibility line ${entry.compatibilityLine}`);
  } catch (error) {
    fail(`${entry.path}: README.md is unreadable (${error.message})`);
  }

  for (const dependency of allDependencies(packageJson).filter(({ name }) => name.startsWith("@relgeo/"))) {
    const dependencyEntry = packageByName.get(dependency.name);
    check(
      Boolean(dependencyEntry),
      `${entry.path}: ${dependency.section}.${dependency.name} is present in the matrix`,
    );
    if (!dependencyEntry) continue;
    check(
      dependency.range === matrix.policy.internalDependencyRange,
      `${entry.path}: ${dependency.section}.${dependency.name} uses ${matrix.policy.internalDependencyRange}`,
    );
    check(
      dependencyEntry.compatibilityLine === entry.compatibilityLine,
      `${entry.path}: ${dependency.name} stays on compatibility line ${entry.compatibilityLine}`,
    );
  }
}

for (const packageEntry of matrix.packages) {
  check(packageEntry.publishable === true, `${packageEntry.path}: public package is marked publishable`);
  check(versionLine(packageEntry.version) === matrix.compatibilityLine, `${packageEntry.path}: public package is on ${matrix.compatibilityLine}.x`);
}

for (const consumer of matrix.consumers) {
  check(consumer.publishable === false, `${consumer.path}: consumer is not marked as an npm package`);
  check(consumer.compatibilityLine === matrix.compatibilityLine, `${consumer.path}: consumer follows ${matrix.compatibilityLine}`);
}

const summary = {
  matrix: matrixPath.slice(root.length + 1),
  compatibilityLine: matrix.compatibilityLine,
  passed: results.filter(({ status }) => status === "PASS").length,
  failed: failures.length,
  failures,
};

if (jsonOutput) {
  console.log(JSON.stringify(summary, null, 2));
} else {
  console.log(`RelGeo compatibility matrix (${matrix.compatibilityLine})`);
  for (const result of results) console.log(`[${result.status}] ${result.message}`);
  console.log(`summary: ${summary.passed} passed, ${summary.failed} failed`);
}

process.exitCode = failures.length > 0 ? 1 : 0;
