#!/usr/bin/env node

import { access, readdir, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const files = {
  catalog: "docs/capability-map/mcp/expected-capability-catalog.md",
  reconciliation: "docs/capability-map/mcp/reconciliation.md",
  matrix: "docs/capability-map/mcp/status-matrix.md",
  evidence: "docs/capability-map/mcp/implementation-evidence-register.md",
  plan11: "docs/plans/11-mcp-agent-integration.md",
  plan14: "docs/plans/14-mcp-full-spec-search.md",
};

const failures = [];
const check = (condition, message) => {
  if (condition) {
    console.log(`[PASS] ${message}`);
  } else {
    failures.push(message);
    console.log(`[FAIL] ${message}`);
  }
};

const text = {};
for (const [key, relativePath] of Object.entries(files)) {
  try {
    text[key] = await readFile(join(root, relativePath), "utf8");
  } catch (error) {
    failures.push(`${relativePath} is readable`);
    console.log(`[FAIL] ${relativePath} is readable (${error.code ?? error.message})`);
  }
}

const collectIds = (source, pattern) => [...source.matchAll(pattern)].map((match) => match[1]);
const duplicateIds = (ids) => [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
const difference = (left, right) => left.filter((id) => !right.includes(id));
const cells = (line) => line.split("|").slice(1, -1).map((cell) => cell.trim());

const expectedIds = collectIds(text.catalog ?? "", /^\| ([A-Z]+-\d{2}) \|/gm);
const reconciliationIds = collectIds(text.reconciliation ?? "", /^\| `([A-Z]+-\d{2})` \|/gm);
const matrixIds = collectIds(text.matrix ?? "", /^\| `([A-Z]+-\d{2})` \|/gm);
const evidenceIds = collectIds(text.evidence ?? "", /^\| `([A-Z]+-\d{2})` \|/gm);

check(expectedIds.length === 68 && new Set(expectedIds).size === 68, "expected catalog contains exactly 68 unique capability IDs");
check(reconciliationIds.length === 68 && new Set(reconciliationIds).size === 68, "reconciliation contains exactly 68 unique capability IDs");
check(matrixIds.length === 68 && new Set(matrixIds).size === 68, "status matrix contains exactly 68 unique capability IDs");
check(evidenceIds.length === 68 && new Set(evidenceIds).size === 68, "implementation evidence register contains exactly 68 unique capability IDs");
check(duplicateIds(expectedIds).length === 0, "expected catalog has no duplicate IDs");
check(duplicateIds(reconciliationIds).length === 0, "reconciliation has no duplicate IDs");
check(duplicateIds(matrixIds).length === 0, "status matrix has no duplicate IDs");
check(duplicateIds(evidenceIds).length === 0, "implementation evidence register has no duplicate IDs");

for (const [label, ids] of [["reconciliation", reconciliationIds], ["status matrix", matrixIds], ["implementation evidence register", evidenceIds]]) {
  check(difference(expectedIds, ids).length === 0 && difference(ids, expectedIds).length === 0, `${label} ID set exactly matches the frozen catalog`);
}

const expectedRows = (text.catalog ?? "").split("\n").filter((line) => /^\| [A-Z]+-\d{2} \|/.test(line));
check(expectedRows.every((line) => {
  const row = cells(line);
  return row.length === 7 && row.slice(1, 6).every((value) => value.length > 0) && row[6].startsWith("CATALOG-VERIFIED");
}), "every expected row has capability, outcome, requirement, scope, owner, and CATALOG-VERIFIED evidence boundary");

check(
  text.catalog?.includes("Frozen closure metadata contract") &&
    text.catalog.includes("Implementation boundary") &&
    text.catalog.includes("Evidence boundary") &&
    text.catalog.includes("Dependency") &&
    text.catalog.includes("Next action"),
  "catalog declares the stable-ID closure metadata contract",
);
check(
  text.matrix?.includes("| ID | Capability / user outcome | Status | Evidence | Gap | Owner | Dependency | Risk | Next action |") &&
    text.evidence?.includes("| ID | Status | Owner / source of truth | Source path observed | Test / fixture evidence | Dependency or environment boundary | Next action |"),
  "joined status and evidence artifacts expose owner, source, implementation/evidence boundary, dependency, and next-action fields",
);

const statuses = new Set(["✔️", "🌗", "❌", "⚠️", "⏸️", "➖"]);
const matrixRows = (text.matrix ?? "").split("\n").filter((line) => /^\| `[A-Z]+-\d{2}` \|/.test(line));
check(matrixRows.every((line) => {
  const row = cells(line);
  return row.length === 9 && statuses.has(row[2].replaceAll("`", "")) && row.slice(3).every((value) => value.length > 0);
}), "every status row has status, evidence, gap, owner, dependency, risk, and next action");

const matrixStatuses = matrixRows.map((line) => cells(line)[2].replaceAll("`", ""));
const expectedCounts = new Map([["✔️", 60], ["🌗", 0], ["❌", 0], ["⚠️", 0], ["⏸️", 8], ["➖", 0]]);
for (const [status, expectedCount] of expectedCounts) {
  check(matrixStatuses.filter((value) => value === status).length === expectedCount, `status matrix has ${expectedCount} ${status} rows`);
}

check(text.catalog?.includes("Freeze boundary 2026-11-08") && text.catalog.includes("WF-02") && text.catalog.includes("DEL-01"), "catalog records the dated freeze boundary and explicit holds");
check(text.catalog?.includes("Remote MCP/deployment") && text.catalog?.includes("Android/iOS") && text.catalog?.includes("non-goals"), "catalog records remote, mobile, and other non-goal boundaries");
check(text.matrix?.includes("| `WF-02` |") && text.matrix?.includes("| `DEL-01` |") && text.matrix?.includes("`⏸️`"), "status matrix retains both explicit scope holds");
check(text.reconciliation?.includes("| `WF-02` |") && text.reconciliation?.includes("| `DEL-01` |") && text.reconciliation?.includes("verified-scope"), "reconciliation records evidence boundaries for both holds");

for (const relativePath of ["docs/mcp", "docs/capability-map/mcp"]) {
  try {
    const entries = await readdir(join(root, relativePath));
    check(entries.length > 0, `${relativePath} exists and is non-empty`);
  } catch (error) {
    check(false, `${relativePath} exists and is non-empty (${error.code ?? error.message})`);
  }
}

for (const relativePath of [files.plan11, files.plan14, files.catalog, files.reconciliation, files.matrix, files.evidence]) {
  try {
    await access(join(root, relativePath));
    check(true, `${relativePath} is available as canonical evidence`);
  } catch (error) {
    check(false, `${relativePath} is available as canonical evidence (${error.code ?? error.message})`);
  }
}

if (failures.length > 0) {
  console.error(`\n${failures.length} MCP capability catalog checks failed.`);
  process.exitCode = 1;
} else {
  console.log(`\nMCP capability catalog checks passed: 68 frozen IDs joined across catalog, reconciliation, matrix, and evidence register.`);
}
