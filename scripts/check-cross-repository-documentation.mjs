#!/usr/bin/env node

import assert from "node:assert/strict";
import fs from "node:fs";

const root = process.cwd();
const revision = "63b28c4ebde79a9b7d83faa182fca06387272143";
const requiredFiles = [
  "docs/MATURATION-MASTER-PLAN.md",
  "docs/REPOSITORY-MAP.md",
  "docs/plans/01-cross-repo-integration-gate.md",
  "docs/integration-baseline.json",
  "docs/compatibility-matrix.json",
  "docs/capability-map/cross-repository/expected-catalog.md",
  "docs/capability-map/cross-repository/status-matrix.md",
  "docs/capability-map/cross-repository/implementation-gap-backlog.md",
  "docs/capability-map/cross-repository/reconciliation.md",
  "docs/evidence/cross-repository-goal-level-closure-audit-2026-11-14.json",
  "docs/evidence/cross-repository-canonical-verification-2026-11-14.json",
];
const read = (file) => fs.readFileSync(`${root}/${file}`, "utf8");
for (const file of requiredFiles) assert.ok(fs.existsSync(`${root}/${file}`), `missing required file: ${file}`);

const master = read("docs/MATURATION-MASTER-PLAN.md");
const repositoryMap = read("docs/REPOSITORY-MAP.md");
const integrationPlan = read("docs/plans/01-cross-repo-integration-gate.md");
const matrix = read("docs/capability-map/cross-repository/status-matrix.md");
const closure = JSON.parse(read("docs/evidence/cross-repository-goal-level-closure-audit-2026-11-14.json"));
const canonical = JSON.parse(read("docs/evidence/cross-repository-canonical-verification-2026-11-14.json"));

for (const [label, source] of [
  ["master plan", master],
  ["repository map", repositoryMap],
  ["integration plan", integrationPlan],
]) {
  assert.ok(source.includes(revision), `${label} must name current root revision`);
  assert.ok(source.includes("cross-repository-canonical-verification-2026-11-14.json"), `${label} must link current verification envelope`);
}

const rows = [...matrix.matchAll(/^\| \[`(ORCH-[A-Z]+-\d{3})`\][^\n]*\| `(✔️|🌗|❌|➖|⏸️|⚠️)` \|/gm)].map((match) => ({ id: match[1], status: match[2] }));
assert.equal(rows.length, 39, "status matrix must retain the 39 expected capability rows");
const statusCounts = Object.fromEntries(["✔️", "🌗", "❌", "➖", "⏸️", "⚠️"].map((status) => [status, rows.filter((row) => row.status === status).length]));
const countText = `Current count: **${statusCounts["✔️"]} \`✔️\` · ${statusCounts["🌗"]} \`🌗\` · ${statusCounts["❌"]} \`❌\` · ${statusCounts["➖"]} \`➖\` · ${statusCounts["⏸️"]} \`⏸️\` · ${statusCounts["⚠️"]} \`⚠️\`**.`;
assert.ok(matrix.includes(countText), "status matrix count line must match row statuses");
assert.deepEqual(closure.statusMatrixSnapshot.observedCounts, statusCounts, "closure snapshot must match the current matrix counts");
assert.equal(canonical.workspaceRevision, revision);
assert.equal(canonical.boundary.cleanCheckout, false);
assert.equal(canonical.disposition.status, "not-canonical-green");
assert.equal(closure.closureDecision, "not-completed");
assert.equal(closure.closureEligible, false);
assert.ok(matrix.includes("public-boundary-audit-2026-11-14.json"));

console.log(`Cross-repository documentation reconciliation: PASS (requiredFiles=${requiredFiles.length}; rows=${rows.length}; statusCounts=${statusCounts["✔️"]}/${statusCounts["🌗"]}/${statusCounts["❌"]}; closureEligible=${closure.closureEligible})`);
