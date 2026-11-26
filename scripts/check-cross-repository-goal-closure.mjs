#!/usr/bin/env node

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const auditPath = path.join(root, "docs", "evidence", "cross-repository-goal-level-closure-audit-2026-11-14.json");
const audit = JSON.parse(fs.readFileSync(auditPath, "utf8"));
const currentRevision = execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim();

assert.equal(audit.recordType, "cross-repository-goal-level-closure-audit");
assert.equal(audit.closureDecision, "not-completed");
assert.equal(audit.closureEligible, false);
assert.equal(audit.workspaceRevision, currentRevision);
assert.equal(audit.criteria.length, 8);
assert.ok(audit.criteria.every((criterion) => criterion.id && criterion.result && criterion.summary && criterion.revision));
assert.ok(audit.criteria.every((criterion) => criterion.evidence.length > 0));
assert.ok(audit.residualRequirements.length > 0);
assert.ok(audit.residualRequirements.every((residual) => residual.owner && residual.remediation && residual.claimLimit));
assert.equal(audit.taskExecutionMap.followUps, 0);
assert.equal(audit.taskExecutionMap.pendingDecisions, 0);
assert.equal(audit.integrity.consistent, false);
assert.ok(audit.integrity.findings.some((finding) => finding.code === "missing_typed_timeline_reference"));
assert.ok(audit.statusMatrixSnapshot.observedCounts["🌗"] > 0);

for (const entry of audit.evidenceLocatorRevisionMap) {
  if (entry.locator.startsWith("suclos:")) continue;
  assert.ok(fs.existsSync(path.join(root, entry.locator)), `missing evidence locator: ${entry.locator}`);
}

console.log(`Cross-repository goal closure audit: PASS (decision=${audit.closureDecision}; criteria=${audit.criteria.length}; residuals=${audit.residualRequirements.length}; integrityErrors=${audit.integrity.errorCount})`);
