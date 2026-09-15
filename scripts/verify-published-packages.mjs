#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const matrixPath = resolve(root, "docs/compatibility-matrix.json");
const jsonOutput = process.argv.includes("--json");
const results = [];
const failures = [];

function check(condition, message) {
  const status = condition ? "PASS" : "FAIL";
  results.push({ status, message });
  if (!condition) failures.push(message);
}

const matrix = JSON.parse(await readFile(matrixPath, "utf8"));

for (const entry of matrix.packages) {
  const specifier = `${entry.name}@${entry.version}`;
  const result = spawnSync("npm", ["view", specifier, "version", "--json"], {
    cwd: root,
    encoding: "utf8",
    env: process.env,
  });
  let publishedVersion = null;
  try {
    publishedVersion = JSON.parse(result.stdout);
  } catch {
    publishedVersion = null;
  }
  check(
    result.status === 0 && publishedVersion === entry.version,
    `${specifier}: registry version is ${entry.version}${result.status === 0 ? "" : ` (npm exited with ${result.status})`}`,
  );
}

const summary = {
  matrix: matrixPath.slice(root.length + 1),
  compatibilityLine: matrix.compatibilityLine,
  packageCount: matrix.packages.length,
  passed: results.filter(({ status }) => status === "PASS").length,
  failed: failures.length,
  failures,
};

if (jsonOutput) {
  console.log(JSON.stringify(summary, null, 2));
} else {
  console.log(`RelGeo published package verification (${matrix.compatibilityLine})`);
  for (const result of results) console.log(`[${result.status}] ${result.message}`);
  console.log(`summary: ${summary.passed} passed, ${summary.failed} failed`);
}

process.exitCode = failures.length > 0 ? 1 : 0;
