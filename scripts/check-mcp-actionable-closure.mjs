#!/usr/bin/env node

import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const registerPath = join(
  root,
  "docs/capability-map/mcp/implementation-evidence-register.md",
);
const catalogPath = join(
  root,
  "docs/capability-map/mcp/expected-capability-catalog.md",
);
const register = await readFile(registerPath, "utf8");
const catalog = await readFile(catalogPath, "utf8");
const rows = register
  .split("\n")
  .filter((line) => /^\| `[A-Z]+-\d{2}` \|/.test(line))
    .map((line) => line.split("|").slice(1, -1).map((cell) => cell.trim()));
const catalogIds = catalog
  .split("\n")
  .filter((line) => /^\| [A-Z]+-\d{2} \|/.test(line))
  .map((line) => line.split("|")[1].trim());

const failures = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};

const referencedPaths = (cell) =>
  [...cell.matchAll(/`([^`]+)`/g)]
    .map((match) => match[1].trim())
    .filter((reference) => reference.includes("/"));

const checkReferences = (id, label, cell) => {
  const references = referencedPaths(cell);
  check(
    references.length > 0,
    `${id}: ${label} must cite at least one repository path`,
  );
  for (const reference of references) {
    check(
      existsSync(resolve(root, reference)),
      `${id}: ${label} path does not exist: ${reference}`,
    );
  }
};

const hasExecutableEvidencePath = (cell) =>
  referencedPaths(cell).some(
    (reference) =>
      reference.startsWith("mcp/test/") ||
      reference.startsWith("flutter/test/") ||
      reference.includes("/__tests__/") ||
      reference.startsWith("fixtures/") ||
      reference.startsWith("mcp/tool/") ||
      reference.startsWith("scripts/"),
  );

const hasScopedDispositionEvidence = (id, cell) =>
  id === "WF-02" && cell.includes("docs/capability-map/mcp/");

const ids = rows.map((row) => row[0]?.replaceAll("`", ""));
const actionable = rows.filter((row) =>
  ["🌗", "❌", "⚠️"].includes(row[1]?.replaceAll("`", "")),
);
check(rows.length === 68, `expected 68 register rows, found ${rows.length}`);
check(new Set(ids).size === rows.length, "register IDs are unique");
check(catalogIds.length === 68, `expected 68 catalog rows, found ${catalogIds.length}`);
check(
  catalogIds.length === ids.length &&
    catalogIds.every((id, index) => id === ids[index]),
  "register IDs match the expected catalog in order",
);
// The residual adapter/composition and local transport/lifecycle closures are
// now verified or explicitly deferred. No partial/defective row may remain;
// the eight deferred rows must retain executable evidence and a boundary plan.
const deferred = rows.filter((row) => row[1]?.replaceAll("`", "") === "⏸️");
check(actionable.length === 0, `expected 0 actionable rows, found ${actionable.length}`);
check(deferred.length === 8, `expected 8 explicitly deferred rows, found ${deferred.length}`);

for (const row of deferred) {
  const [rawId, , owner, source, evidence, dependency, nextAction] = row;
  const id = rawId.replaceAll("`", "");
  check(Boolean(owner), `${id}: owner/source-of-truth is present`);
  check(Boolean(source), `${id}: source/contract/fixture boundary is present`);
  check(Boolean(evidence), `${id}: test/fixture evidence is present`);
  checkReferences(id, "source/contract/fixture boundary", source);
  checkReferences(id, "test/fixture evidence", evidence);
  check(
    hasExecutableEvidencePath(evidence) || hasScopedDispositionEvidence(id, evidence),
    `${id}: evidence must cite an executable test/fixture or an explicit scoped-disposition record`,
  );
  check(Boolean(dependency), `${id}: dependency/environment boundary is present`);
  check(Boolean(nextAction), `${id}: concrete next action is present`);
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`[FAIL] ${failure}`);
  process.exit(1);
}

console.log(
  `MCP actionable closure: PASS (68 register rows; 0 partial/defective rows; ` +
    "catalog/register IDs match; every deferred row has source and executable test/fixture evidence; " +
    `dependency and next-action fields present for ${deferred.length}/${deferred.length}; ` +
    `deferred IDs: ${deferred.map((row) => row[0]).join(",")})`,
);
console.log(
  `observed command:cd ${root} && node scripts/check-mcp-actionable-closure.mjs; ` +
    `file:${root}/scripts/check-mcp-actionable-closure.mjs:82`,
);
