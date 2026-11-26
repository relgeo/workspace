#!/usr/bin/env node

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const reportPath = path.join(root, "docs/evidence/cross-repository-canonical-verification-2026-11-14.json");
const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
const required = [
  "strict-baseline",
  "baseline-synchronization",
  "compatibility",
  "conformance",
  "bootstrap",
  "local-integration",
  "public-integration",
  "integration-evidence-contract",
  "public-boundary",
];
const checks = new Map(report.checks.map((check) => [check.id, check]));

assert.equal(report.contract, "cross-repository-verification-v1");
assert.equal(report.boundary.cleanCheckout, false);
assert.equal(report.boundary.canonicalCiRunUrl, null);
assert.equal(report.disposition.status, "not-canonical-green");
assert.equal(report.workspaceRevision, "63b28c4ebde79a9b7d83faa182fca06387272143");
for (const id of required) assert.ok(checks.has(id), `missing check: ${id}`);
assert.equal(checks.get("strict-baseline").result, "failed");
assert.equal(checks.get("baseline-synchronization").result, "failed");
assert.equal(checks.get("compatibility").result, "passed");
assert.equal(checks.get("bootstrap").result, "environment-unavailable");
assert.equal(checks.get("local-integration").result, "environment-unavailable");
assert.equal(checks.get("public-integration").result, "environment-unavailable");
assert.ok(report.checks.every((check) => check.outputExcerpt));
assert.ok(report.checks.filter((check) => check.result === "environment-unavailable").every((check) => check.owner && check.remediation));

console.log(`Canonical orchestration evidence: PASS (checks=${report.checks.length}; canonicalGreen=${report.disposition.status === "canonical-green"}; cleanCheckout=${report.boundary.cleanCheckout})`);
