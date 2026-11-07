#!/usr/bin/env node

import { access, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const base = join(root, "docs/capability-map/language-specification");
const paths = {
  expected: join(base, "expected-capability-catalog.md"),
  audit: join(base, "implementation-audit.md"),
  reconciliation: join(base, "reconciliation.md"),
  backlog: join(base, "implementation-gap-backlog.md"),
  matrix: join(base, "status-matrix.md"),
};

const sources = await Promise.all(Object.entries(paths).map(async ([key, path]) => [key, await readFile(path, "utf8")]));
const documents = Object.fromEntries(sources);
const failures = [];
const check = (condition, message) => {
  if (condition) console.log(`[PASS] ${message}`);
  else {
    failures.push(message);
    console.log(`[FAIL] ${message}`);
  }
};

const collect = (source, pattern) => [...source.matchAll(pattern)].map((match) => match[1]);
const unique = (values) => [...new Set(values)];
const diff = (left, right) => left.filter((value) => !right.includes(value));
const duplicates = (values) => unique(values.filter((value, index) => values.indexOf(value) !== index));
const rowCells = (line) => line.split("|").slice(1, -1).map((cell) => cell.trim());
const expectedIds = collect(documents.expected, /^\| `([A-Z]+-[0-9]{3})` \|/gm);
const auditIds = collect(documents.audit, /^\| `([A-Z]+-[0-9]{3})` \|/gm);
const reconciliationIds = collect(documents.reconciliation, /^\| `([A-Z]+-[0-9]{3})` \|/gm);
const matrixIds = collect(documents.matrix, /^\| `([A-Z]+-[0-9]{3})` \|/gm);
const resultStatuses = new Set(["`✔️`", "`🌗`", "`❌`", "`➖`", "`⏸️`", "`⚠️`"]);
const implementationStatuses = new Set(["`implemented`", "`partial`", "`broken`", "`absent`", "`deferred`", "`not applicable`", "`unverified`"]);
const evidenceTiers = new Set(["`direct-local`", "`source+tests`", "`source+tests+fixture`", "`historical/local`", "`not verified`"]);

for (const [label, ids] of [["expected catalog", expectedIds], ["implementation audit", auditIds], ["reconciliation", reconciliationIds], ["status matrix", matrixIds]]) {
  check(ids.length === 53 && unique(ids).length === 53, `${label} has exactly 53 unique capability rows`);
  check(duplicates(ids).length === 0, `${label} has no duplicate capability IDs`);
}
for (const [label, ids] of [["implementation audit", auditIds], ["reconciliation", reconciliationIds], ["status matrix", matrixIds]]) {
  check(diff(expectedIds, ids).length === 0 && diff(ids, expectedIds).length === 0, `${label} ID set matches expected catalog`);
}

const auditRows = documents.audit.split("\n").filter((line) => /^\| `([A-Z]+-[0-9]{3})` \|/.test(line));
const statuses = new Set(["`implemented`", "`partial`", "`broken`", "`absent`", "`deferred`", "`not applicable`", "`unverified`"]);
check(auditRows.every((line) => {
  const row = rowCells(line);
  return row.length === 5 && statuses.has(row[1]) && row[2].length >= 3 && row[3].length >= 20 && row[4].length >= 20;
}), "every audit row has classification, verification tier, source/evidence, and a non-empty gap finding");
check(auditRows.every((line) => rowCells(line)[3].includes("spec/id/")), "every audit row names an explicit spec/id source path or section");
check(auditRows.every((line) => {
  const row = rowCells(line);
  return /(test|fixture|conformance|snapshot|regression|suite|runner|\b\d+\/\d+\b)/i.test(`${row[3]} ${row[4]}`);
}), "every audit row names test, fixture, conformance, snapshot, regression, or suite evidence");
check(!auditRows.some((line) => {
  const row = rowCells(line);
  return row[1] === "`implemented`" && /complete parity|fully complete|no gap/i.test(row[4]);
}), "implemented rows do not claim complete parity solely from documentation");

const reconciliationRows = documents.reconciliation.split("\n").filter((line) => /^\| `([A-Z]+-[0-9]{3})` \|/.test(line));
check(reconciliationRows.every((line) => {
  const row = rowCells(line);
  return row.length === 6 && resultStatuses.has(row[1]) && implementationStatuses.has(row[2]) && evidenceTiers.has(row[3]) && row.slice(4).every((value) => value.length > 0);
}), "every reconciliation row has result, implementation, evidence tier, scope, and audit trace");

const specPaths = unique(documents.audit.match(/spec\/id\/[A-Za-z0-9._/-]+\.md/g) ?? []);
let missingSpecPaths = [];
for (const relativePath of specPaths) {
  try { await access(join(root, relativePath)); } catch { missingSpecPaths.push(relativePath); }
}
check(missingSpecPaths.length === 0, `all ${specPaths.length} cited spec/id paths exist${missingSpecPaths.length ? `; missing: ${missingSpecPaths.join(", ")}` : ""}`);
check(documents.audit.includes("spec/id/**/*.md"), "audit discovery boundary explicitly records the complete spec/id markdown tree");
check(documents.audit.includes("Dokumentasi normatif saja tidak dapat mengubah"), "audit retains the documentation-only closure prohibition");

const nonGreenIds = matrixIds.filter((id, index) => {
  const row = documents.matrix.split("\n").find((line) => line.startsWith(`| \`${id}\` |`));
  return row && !row.includes("| `✔️` |");
});
const backlogIds = unique(collect(documents.backlog, /\b([A-Z]+-[0-9]{3})\b/g));
check(diff(nonGreenIds, backlogIds).length === 0, `backlog retains every non-green capability classification (${nonGreenIds.length}/${nonGreenIds.length})`);

if (failures.length) {
  console.error(`\n${failures.length} language-specification audit checks failed.`);
  process.exitCode = 1;
} else {
  console.log("\nLanguage-specification audit checks passed.");
}
