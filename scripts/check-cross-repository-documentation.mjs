#!/usr/bin/env node

import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";

const root = process.cwd();
const revision = execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim();
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
  "docs/evidence/cross-repository-rebaseline-2026-11-27.json",
  "docs/evidence/cross-repository-closure-report-2026-11-27.json",
];
const read = (file) => fs.readFileSync(`${root}/${file}`, "utf8");
for (const file of requiredFiles) assert.ok(fs.existsSync(`${root}/${file}`), `missing required file: ${file}`);

const matrix = read("docs/capability-map/cross-repository/status-matrix.md");
const rebaseline = JSON.parse(read("docs/evidence/cross-repository-rebaseline-2026-11-27.json"));
const closure = JSON.parse(read("docs/evidence/cross-repository-closure-report-2026-11-27.json"));

const rows = [...matrix.matchAll(/^\| \[`(ORCH-[A-Z]+-\d{3})`\][^\n]*\| `(✔️|🌗|❌|➖|⏸️|⚠️)` \|/gm)].map((match) => ({ id: match[1], status: match[2] }));
assert.equal(rows.length, 39, "status matrix must retain the 39 expected capability rows");
const statusCounts = Object.fromEntries(["✔️", "🌗", "❌", "➖", "⏸️", "⚠️"].map((status) => [status, rows.filter((row) => row.status === status).length]));
const countText = `Current count: **${statusCounts["✔️"]} \`✔️\` · ${statusCounts["🌗"]} \`🌗\` · ${statusCounts["❌"]} \`❌\` · ${statusCounts["➖"]} \`➖\` · ${statusCounts["⏸️"]} \`⏸️\` · ${statusCounts["⚠️"]} \`⚠️\`**.`;
assert.ok(matrix.includes(countText), "status matrix count line must match current row statuses");
assert.equal(rebaseline.testedRootRevision, revision, "rebaseline must name current root revision");
assert.deepEqual(rebaseline.matrixSnapshot.observedCounts, { "✔️": 21, "🌗": 18, "❌": 0, "➖": 0, "⏸️": 0, "⚠️": 0 }, "rebaseline snapshot must retain the historical candidate counts");
assert.equal(rebaseline.matrixSnapshot.partialCapabilityIds.length, 18);
const partialIds = rows.filter((row) => row.status === "🌗").map((row) => row.id).sort();
assert.deepEqual(rebaseline.matrixSnapshot.partialCapabilityIds.toSorted(), closure.before.partialCapabilityIds.toSorted(), "closure report must cover every historical partial row");
assert.equal(rebaseline.dispositions.length, 18, "rebaseline must contain 18 dispositions");
assert.ok(rebaseline.dispositions.every((row) => row.matrixStatus === "🌗"));
assert.ok(rebaseline.dispositions.every((row) => ["✔️", "➖", "⏸️"].includes(row.disposition)));
assert.ok(rebaseline.dispositions.every((row) => row.owner && row.sourceOfTruth?.length && row.repositoryPath && row.dependency?.length && row.evidenceLocator?.length && row.testedRevision === revision && row.claimLimit));
assert.ok(rebaseline.dispositions.every((row) => row.closureTask || row.scopeDecision));
assert.equal(closure.testedRootRevision, revision, "closure report must name current root revision");
assert.equal(closure.rows.length, 18, "closure report must contain 18 before/after rows");
assert.deepEqual(closure.after.actionableUnresolved, [], "closure report must contain no actionable unresolved rows");
assert.ok(closure.rows.every((row) => row.beforeStatus === "🌗" && ["✔️", "➖", "⏸️"].includes(row.afterStatus)));
assert.ok(closure.rows.every((row) => row.owner && row.sourceOfTruth?.length && row.repositoryPath && row.dependency?.length && row.evidenceLocator?.length && row.testedRevision === revision && row.claimLimit));
assert.deepEqual(closure.rows.map((row) => row.id).toSorted(), rebaseline.dispositions.map((row) => row.id).toSorted(), "closure rows must match the rebaseline ID set");
for (const disposition of rebaseline.dispositions) {
  const row = closure.rows.find((candidate) => candidate.id === disposition.id);
  assert.equal(row.beforeStatus, disposition.matrixStatus, `${disposition.id} before status must match rebaseline`);
  assert.equal(row.afterStatus, disposition.disposition, `${disposition.id} after status must match rebaseline disposition`);
}
assert.equal(statusCounts["🌗"], 0, "current matrix must not retain partial statuses");
assert.equal(statusCounts["❌"], 0, "current matrix must not retain failed statuses");
assert.equal(statusCounts["⚠️"], 0, "current matrix must not retain warning statuses");
assert.equal(statusCounts["✔️"], closure.after.counts["✔️"], "current green count must match closure report");
assert.equal(statusCounts["⏸️"], closure.after.counts["⏸️"], "current held count must match closure report");
assert.ok(matrix.includes("cross-repository-rebaseline-2026-11-27.json"));
assert.ok(matrix.includes("cross-repository-closure-report-2026-11-27.json"));

console.log(`Cross-repository documentation reconciliation: PASS (requiredFiles=${requiredFiles.length}; rows=${rows.length}; partialDispositions=${rebaseline.dispositions.length}; statusCounts=${statusCounts["✔️"]}/${statusCounts["🌗"]}/${statusCounts["❌"]})`);
