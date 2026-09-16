#!/usr/bin/env node

import { readFile, readdir } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const results = [];
const warnings = [];
const failures = [];

function pass(message) {
  results.push({ status: "PASS", message });
}

function warn(message) {
  warnings.push(message);
  results.push({ status: "WARN", message });
}

function fail(message) {
  failures.push(message);
  results.push({ status: "FAIL", message });
}

function check(condition, message) {
  if (condition) pass(message);
  else fail(message);
}

async function read(path) {
  return readFile(resolve(root, path), "utf8");
}

async function yamlFiles(directory) {
  const absoluteDirectory = resolve(root, directory);
  const files = [];

  async function walk(directoryPath) {
    for (const entry of await readdir(directoryPath, { withFileTypes: true })) {
      const entryPath = resolve(directoryPath, entry.name);
      if (entry.isDirectory()) await walk(entryPath);
      else if (entry.name.endsWith(".yaml")) files.push(entryPath);
    }
  }

  await walk(absoluteDirectory);
  return files;
}

function rootVersion(source) {
  return source.match(/^version:\s*["']?([0-9]+\.[0-9]+)["']?/m)?.[1] ?? null;
}

const matrix = JSON.parse(await read("docs/compatibility-matrix.json"));
const manifest = JSON.parse(await read("fixtures/manifest.json"));
const parser = await read("core/src/parser.ts");
const auditDocument = await read("docs/compatibility-behavior-audit.md");

check(matrix.compatibilityLine === "0.5", "matrix declares public compatibility line 0.5");
check(manifest.compatibilityLine === matrix.compatibilityLine, "fixture manifest and matrix use the same compatibility line");
check(parser.includes('ACTIVE_REL_GEO_SPEC_VERSION = "0.5"'), "parser declares active RelGeo DSL version 0.5");
check(parser.includes("SUPPORTED_REL_GEO_SPEC_VERSIONS"), "parser declares supported public versions");
check(parser.includes("REGRESSION_ONLY_REL_GEO_SPEC_VERSIONS"), "parser declares regression-only versions");
check(parser.includes('UNSUPPORTED_SPEC_VERSION'), "parser declares an actionable unsupported-version diagnostic");
check(auditDocument.includes("Version acceptance parser sekarang eksplisit"), "audit document records the implemented parser version policy");

const testGroups = [
  ["core regression tests", "core/src/__tests__"],
  ["renderer regression tests", "renderer-svg/src/__tests__"],
  ["language-service regression tests", "language-service/src/__tests__"],
];
const observed = new Map();

for (const [label, directory] of testGroups) {
  const files = await yamlFiles(directory).catch(() => []);
  for (const filePath of files) {
    const version = rootVersion(await read(relative(root, filePath)));
    if (!version) continue;
    const labels = observed.get(version) ?? [];
    labels.push(label);
    observed.set(version, labels);
  }
}

const exampleFiles = await yamlFiles("playground/src/assets/examples");
const filenameMismatches = [];
for (const filePath of exampleFiles) {
  const relativePath = relative(root, filePath);
  const version = rootVersion(await read(relativePath));
  if (!version) continue;
  const filenameVersionDigits = relativePath.match(/(?:^|\/)v(0[234])_[^/]+\.yaml$/)?.[1];
  const filenameVersion = filenameVersionDigits ? `0.${filenameVersionDigits[1]}` : null;
  if (filenameVersion && filenameVersion !== version) {
    filenameMismatches.push({ path: relativePath, filenameVersion, declaredVersion: version });
  }
  const labels = observed.get(version) ?? [];
  labels.push("Playground examples");
  observed.set(version, labels);
}

const observedVersions = [...observed.keys()].sort();
check(
  observedVersions.length > 0 && observedVersions.every((version) => /^0\.[1-5]$/.test(version)),
  `observed version inventory is bounded to known 0.x versions (${observedVersions.join(", ")})`,
);
check(observed.has("0.5"), "observed sources include active DSL version 0.5");
check(observed.has("0.4"), "observed sources include supported legacy DSL version 0.4");

if (filenameMismatches.length > 0) {
  warn(`${filenameMismatches.length} Playground example filenames use a v0.4 prefix while declaring DSL v0.5`);
  for (const mismatch of filenameMismatches) {
    warn(`${mismatch.path}: filename v${mismatch.filenameVersion}, declared v${mismatch.declaredVersion}`);
  }
}

const summary = {
  observedVersions,
  filenameMismatches,
  passed: results.filter(({ status }) => status === "PASS").length,
  warnings: warnings.length,
  failed: failures.length,
  failures,
};

console.log("RelGeo compatibility behavior audit");
for (const result of results) console.log(`[${result.status}] ${result.message}`);
console.log(`summary: ${summary.passed} passed, ${summary.warnings} warnings, ${summary.failed} failed`);

process.exitCode = failures.length > 0 ? 1 : 0;
