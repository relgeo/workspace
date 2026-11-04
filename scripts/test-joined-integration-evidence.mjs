#!/usr/bin/env node

import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const integrationWorkflow = fs.readFileSync(
  path.join(root, ".github", "workflows", "integration.yml"),
  "utf8",
);
assert.match(integrationWorkflow, /join-integration-evidence\.mjs[\s\S]*integration-gate-joined-evidence\.json/);
assert.match(integrationWorkflow, /join-integration-evidence\.mjs[\s\S]*integration-public-joined-evidence\.json/);
assert.match(integrationWorkflow, /integration-gate-joined-evidence\.json/);
assert.match(integrationWorkflow, /integration-public-joined-evidence\.json/);
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "relgeo-joined-evidence-"));
const source = path.join(tempRoot, "integration.json");
const output = path.join(tempRoot, "joined.json");
const sourceReport = {
  schemaVersion: 1,
  contract: "integration-gate-v1",
  mode: "public-registry",
  passed: true,
  evidence: {
    schemaVersion: 1,
    evidenceClass: "public-registry",
    evidenceState: "current",
    capturedAt: "2026-11-03T00:00:00.000Z",
    workspaceRevision: "a".repeat(40),
    baseline: { name: "test-baseline", capturedAt: "2026-11-03", compatibilityLine: "0.5" },
    testedRevisions: { root: "a".repeat(40), children: { core: "b".repeat(40) } },
    toolchain: { node: "v24.0.0", pnpm: "10.33.3" },
    limitations: [],
  },
  summary: { total: 1, passed: 1, failed: 0, blocked: 0 },
  results: [{
    label: "core: test",
    command: "pnpm",
    args: ["run", "test"],
    passed: true,
    environment: { mode: "public-registry", boundary: "temporary-checkout", node: "v24.0.0", pnpm: "10.33.3" },
    artifact: { kind: "test-report", identity: "core" },
  }],
};
fs.writeFileSync(source, JSON.stringify(sourceReport, null, 2));

const current = spawnSync(process.execPath, [
  path.join(root, "scripts", "join-integration-evidence.mjs"),
  `--report=${source}`,
  `--output=${output}`,
  "--run-id=123",
  "--run-url=https://github.com/relgeo/workspace/actions/runs/123",
  "--artifact-id=integration-report",
  "--artifact-path=.local/integration.json",
  "--current-root-revision=" + "a".repeat(40),
  "--current-baseline-name=test-baseline",
  "--current-child=core:" + "b".repeat(40),
], { cwd: root, encoding: "utf8" });
assert.equal(current.status, 0);
const currentJoined = JSON.parse(fs.readFileSync(output, "utf8"));
assert.equal(currentJoined.contract, "joined-integration-evidence-v1");
assert.equal(currentJoined.claim.currentClaimEligible, true);
assert.equal(currentJoined.run.id, "123");
assert.equal(currentJoined.artifact.id, "integration-report");
assert.equal(currentJoined.stages[0].environment.boundary, "temporary-checkout");
assert.equal(currentJoined.children.core, "b".repeat(40));

const historical = spawnSync(process.execPath, [
  path.join(root, "scripts", "join-integration-evidence.mjs"),
  `--report=${source}`,
  `--output=${output}`,
  "--evidence-state=historical",
], { cwd: root, encoding: "utf8" });
assert.equal(historical.status, 0);
const historicalJoined = JSON.parse(fs.readFileSync(output, "utf8"));
assert.equal(historicalJoined.claim.currentClaimEligible, false);
assert.ok(historicalJoined.claim.freshnessReasons.includes("historical-evidence"));

assert.ok(!JSON.stringify(currentJoined).includes(tempRoot));
fs.rmSync(tempRoot, { recursive: true, force: true });
console.log("Joined integration evidence tests passed: current revision join and historical rejection.");
