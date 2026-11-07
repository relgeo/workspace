#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const catalogPath = join(root, "docs/capability-map/language-specification/expected-capability-catalog.md");
const matrixPath = join(root, "docs/capability-map/language-specification/status-matrix.md");
const specPath = join(root, "spec/id/core/07-closure-contracts.md");

const [catalog, matrix, spec] = await Promise.all([
  readFile(catalogPath, "utf8"),
  readFile(matrixPath, "utf8"),
  readFile(specPath, "utf8"),
]);

const failures = [];
const check = (condition, message) => {
  if (condition) {
    console.log(`[PASS] ${message}`);
  } else {
    failures.push(message);
    console.log(`[FAIL] ${message}`);
  }
};

const collect = (source, pattern) => [...source.matchAll(pattern)].map((match) => match[1]);
const countMap = (values) => new Map(values.map((value) => [value, values.filter((item) => item === value).length]));
const duplicates = (values) => [...countMap(values)].filter(([, count]) => count > 1).map(([id]) => id);
const difference = (left, right) => left.filter((value) => !right.includes(value));
const cells = (line) => line.split("|").slice(1, -1).map((cell) => cell.trim());

const expectedIds = collect(catalog, /^\| `([A-Z]+-[0-9]{3})` \|/gm);
const matrixIds = collect(matrix, /^\| `([A-Z]+-[0-9]{3})` \|/gm);
const contractIds = collect(catalog, /^\| ([A-Z]+-[0-9]{3}) \|/gm);

check(expectedIds.length === 53 && new Set(expectedIds).size === 53, "expected catalog has exactly 53 unique capability rows");
check(matrixIds.length === 53 && new Set(matrixIds).size === 53, "status matrix has exactly 53 unique capability rows");
check(contractIds.length === 53 && new Set(contractIds).size === 53, "catalog has exactly one consumer/acceptance row per capability");
check(duplicates(expectedIds).length === 0, "expected catalog has no duplicate capability IDs");
check(duplicates(matrixIds).length === 0, "status matrix has no duplicate capability IDs");
check(duplicates(contractIds).length === 0, "consumer/acceptance contract has no duplicate capability IDs");
check(difference(expectedIds, matrixIds).length === 0 && difference(matrixIds, expectedIds).length === 0, "catalog and status matrix ID sets are identical");
check(difference(expectedIds, contractIds).length === 0 && difference(contractIds, expectedIds).length === 0, "catalog and consumer/acceptance ID sets are identical");

const expectedRows = catalog.split("\n").filter((line) => /^\| `([A-Z]+-[0-9]{3})` \|/.test(line));
const matrixRows = matrix.split("\n").filter((line) => /^\| `([A-Z]+-[0-9]{3})` \|/.test(line));
const contractRows = catalog.split("\n").filter((line) => /^\| ([A-Z]+-[0-9]{3}) \|/.test(line));

check(expectedRows.every((line) => {
  const row = cells(line);
  return row.length === 7 && row.slice(1, 6).every((value) => value.length > 0) && row[6].startsWith("`PENDING-AUDIT");
}), "every expected row has outcome, requirement, scope, owner/source, and explicit pending-audit status");

const statuses = new Set(["`✔️`", "`🌗`", "`❌`", "`➖`", "`⏸️`", "`⚠️`"]);
check(matrixRows.every((line) => {
  const row = cells(line);
  return row.length === 9 && statuses.has(row[2]) && row.slice(3).every((value) => value.length > 0);
}), "every status row has status, evidence, gap, owner, dependency, risk, and next action");

check(contractRows.every((line) => {
  const row = cells(line);
  return row.length === 3 && row[1].length > 0 && row[2].length >= 30 && !/TBD|TODO/i.test(row[2]);
}), "every capability has a non-empty consumer boundary and measurable acceptance statement");
check(catalog.includes("Boundary ini dibekukan pada **53 capability ID**"), "catalog records the frozen closure boundary and anti-scope-creep rule");
check(matrix.includes("The matrix is a one-to-one reporting view"), "status matrix records the one-to-one frozen boundary");
check(spec.includes("An implementation or consumer must not introduce a new public field") && spec.includes("normative chapter first"), "normative closure contract keeps language ownership ahead of downstream matrices");

if (failures.length > 0) {
  console.error(`\n${failures.length} language-specification capability catalog checks failed.`);
  process.exitCode = 1;
} else {
  console.log("\nLanguage-specification capability catalog checks passed.");
}
