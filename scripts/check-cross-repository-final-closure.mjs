#!/usr/bin/env node

import assert from "node:assert/strict";
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";

const root = process.cwd();
const revision = execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim();
const readJson = (relativePath) => JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
const auditPath = "docs/evidence/cross-repository-final-closure-audit-2026-11-27.json";
const closurePath = "docs/evidence/cross-repository-closure-report-2026-11-27.json";
const audit = readJson(auditPath);
const closure = readJson(closurePath);
const expectedCriteria = [
  "criterion-1-seluruh-18-capability-cross-repository-yang-saat",
  "criterion-2-setiap-disposition-memiliki-owner-source-of-trut",
  "criterion-3-gap-implementasi-dan-automation-yang-nyata-ditut",
  "criterion-4-bootstrap-fresh-checkout-node-24-21-0-pnpm-10-33",
  "criterion-5-validated-child-ci-to-workspace-synchronization-",
  "criterion-6-strict-baseline-compatibility-conformance-local-",
  "criterion-7-perubahan-yang-berdampak-pada-flutter-mcp-playgr",
  "criterion-8-final-closure-audit-membuktikan-before-after-unt"
];
const requiredFiles = [
  auditPath,
  closurePath,
  "docs/evidence/cross-repository-current-verification-2026-11-27.json",
  "docs/evidence/cross-repository-cross-surface-reconciliation-2026-11-27.json",
  "docs/evidence/cross-repository-child-ci-sync-2026-11-27.json",
  "docs/evidence/cross-repository-fresh-checkout-bootstrap-verification-2026-11-27.json"
];
for (const file of requiredFiles) assert.ok(fs.existsSync(path.join(root, file)), `missing final-closure evidence: ${file}`);
assert.equal(audit.testedRootRevision, revision);
assert.equal(closure.testedRootRevision, revision);
assert.deepEqual(audit.criteria.map((criterion) => criterion.id), expectedCriteria);
assert.ok(audit.criteria.every((criterion) => criterion.result === "passed" && criterion.evidence?.length && criterion.basis));
assert.deepEqual(audit.capabilityMap.beforeCounts, closure.before.counts);
assert.deepEqual(audit.capabilityMap.afterCounts, closure.after.counts);
assert.deepEqual(audit.capabilityMap.actionableUnresolved, []);
assert.deepEqual(closure.after.actionableUnresolved, []);
assert.equal(closure.rows.length, 18);
assert.equal(audit.residualDispositions.length, 13);
assert.ok(audit.residualDispositions.every((row) => row.id && row.owner && row.reason && row.claimLimit && row.remediation));
assert.deepEqual(audit.residualDispositions.map((row) => row.id).toSorted(), closure.after.externalEvidenceHeld.toSorted());
assert.equal(audit.compactEvidenceEnvelope.toolchain.node, "v24.21.0");
assert.equal(audit.compactEvidenceEnvelope.toolchain.pnpm, "10.33.3");
assert.match(audit.compactEvidenceEnvelope.gateResults.crossSurface, /25\/25/);
assert.match(audit.compactEvidenceEnvelope.gateResults.documentation, /39 rows/);
assert.equal(audit.runtimeClaim, "not-green-runtime");

console.log(`Cross-repository final closure audit: PASS (criteria=${audit.criteria.length}; beforePartial=${audit.capabilityMap.beforeCounts["🌗"]}; afterActionable=${audit.capabilityMap.actionableUnresolved.length}; held=${audit.residualDispositions.length}; revision=${revision})`);
