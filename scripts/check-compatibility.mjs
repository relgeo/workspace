#!/usr/bin/env node

import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const matrixPath = resolve(root, "docs/compatibility-matrix.json");
const baselinePath = resolve(root, "docs/integration-baseline.json");
const flutterCapabilityPath = resolve(root, "docs/flutter-capability-matrix.json");
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
let flutterCapabilityMatrix;
try {
  flutterCapabilityMatrix = await readJson(flutterCapabilityPath);
} catch (error) {
  fail(`Flutter capability matrix is unreadable (${error.message})`);
}
const baselineByPath = new Map(baseline.submodules.map((entry) => [entry.path, entry]));
const entries = [...matrix.packages, ...matrix.consumers];
const nonNodeConsumers = matrix.nonNodeConsumers ?? [];
const entryByPath = new Map(entries.map((entry) => [entry.path, entry]));
const packageByName = new Map(matrix.packages.map((entry) => [entry.name, entry]));

check(matrix.schemaVersion === 1, "matrix schema version is supported");
check(entryByPath.size === entries.length, "matrix entries do not contain duplicate paths");
check(packageByName.size === matrix.packages.length, "matrix packages do not contain duplicate names");
check(
  new Set(nonNodeConsumers.map((entry) => entry.path)).size === nonNodeConsumers.length,
  "matrix non-Node consumers do not contain duplicate paths",
);
check(
  nonNodeConsumers.every((entry) => !entryByPath.has(entry.path)),
  "matrix non-Node consumers do not duplicate package or Node consumer paths",
);
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

check(flutterCapabilityMatrix?.schemaVersion === 1, "Flutter capability matrix schema version is supported");
check(
  flutterCapabilityMatrix?.compatibilityLine === matrix.compatibilityLine,
  "Flutter capability matrix follows the current compatibility line",
);
const evidenceDefinitionKeys = [
  "localFlutterTests",
  "sharedFixtures",
  "semanticParity",
  "ci",
  "activeContractBoundary",
];
check(
  evidenceDefinitionKeys.every(
    (key) => typeof flutterCapabilityMatrix?.evidenceDefinitions?.[key] === "string" && flutterCapabilityMatrix.evidenceDefinitions[key].length > 0,
  ),
  "Flutter capability matrix defines the evidence and active-contract boundary",
);
const capabilities = Array.isArray(flutterCapabilityMatrix?.capabilities)
  ? flutterCapabilityMatrix.capabilities
  : [];
check(capabilities.length > 0, "Flutter capability matrix contains capabilities");
check(
  new Set(capabilities.map((capability) => capability.id)).size === capabilities.length,
  "Flutter capability matrix capability ids are unique",
);
const supportLevels = new Set(["verified", "partial", "flutter-only", "unsupported"]);
const evidenceStatuses = new Set(["verified", "partial", "unverified"]);
for (const capability of capabilities) {
  check(typeof capability.id === "string" && capability.id.length > 0, "Flutter capability has an id");
  check(typeof capability.name === "string" && capability.name.length > 0, `${capability.id}: capability has a name`);
  check(supportLevels.has(capability.supportLevel), `${capability.id}: support level is explicit`);
  check(evidenceStatuses.has(capability.evidenceStatus), `${capability.id}: evidence status is explicit`);
  for (const surface of ["typescript", "flutter"]) {
    const mapping = capability[surface];
    check(mapping && Array.isArray(mapping.paths) && Array.isArray(mapping.symbols), `${capability.id}: ${surface} mapping is structured`);
    for (const path of mapping?.paths ?? []) {
      check(existsSync(resolve(root, path)), `${capability.id}: ${surface} source exists at ${path}`);
    }
  }
  const evidence = capability.evidence;
  check(
    evidence &&
      typeof evidence.localFlutterTests === "boolean" &&
      typeof evidence.sharedFixtures === "boolean" &&
      typeof evidence.semanticParity === "boolean" &&
      typeof evidence.ci === "boolean",
    `${capability.id}: evidence flags are explicit`,
  );
}

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

for (const consumer of nonNodeConsumers) {
  const consumerRoot = resolve(root, consumer.path);
  const pubspecPath = resolve(consumerRoot, "pubspec.yaml");
  let pubspec;

  check(Boolean(baselineByPath.get(consumer.path)), `${consumer.path}: path exists in the integration baseline`);
  check(consumer.publishable === false, `${consumer.path}: non-Node consumer is not marked publishable`);
  check(consumer.compatibilityLine === matrix.compatibilityLine, `${consumer.path}: non-Node consumer follows ${matrix.compatibilityLine}`);
  check(consumer.status === "unverified" || consumer.status === "partial" || consumer.status === "verified", `${consumer.path}: non-Node consumer has a supported evidence status`);
  check(
    consumer.verification &&
      typeof consumer.verification.sharedFixtures === "boolean" &&
      typeof consumer.verification.semanticParity === "boolean" &&
      typeof consumer.verification.ci === "boolean",
    `${consumer.path}: non-Node consumer verification flags are explicit`,
  );

  try {
    const rawPubspec = await readFile(pubspecPath, "utf8");
    const nameMatch = /^name:\s*([^\s#]+)/m.exec(rawPubspec);
    const versionMatch = /^version:\s*([^\s#]+)/m.exec(rawPubspec);
    pubspec = { name: nameMatch?.[1], version: versionMatch?.[1] };
  } catch (error) {
    fail(`${consumer.path}: pubspec.yaml is unreadable (${error.message})`);
    continue;
  }

  check(pubspec.name === consumer.name, `${consumer.path}: pubspec name matches the matrix`);
  check(pubspec.version === consumer.applicationVersion, `${consumer.path}: application version matches the matrix`);

  try {
    const readme = await readFile(resolve(consumerRoot, "README.md"), "utf8");
    const marker = new RegExp(`(?:v|DSL\\s*)?${escapeRegExp(consumer.compatibilityLine)}(?:\\.x)?\\b`);
    check(marker.test(readme), `${consumer.path}: README declares compatibility line ${consumer.compatibilityLine}`);
  } catch (error) {
    fail(`${consumer.path}: README.md is unreadable (${error.message})`);
  }
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
