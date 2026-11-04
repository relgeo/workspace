#!/usr/bin/env node

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  BLOCKER_CLASSES,
  DEPENDENCY_STATUSES,
  createEvidenceEnvelope,
  runWithBoundedAttemptsSync,
} from "./orchestration-contract.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const sleeps = [];
let transientAttempts = 0;
const transientResult = runWithBoundedAttemptsSync(() => {
  transientAttempts += 1;
  return transientAttempts === 1
    ? { passed: false, exitCode: 1, output: "fetch failed: ECONNRESET" }
    : { passed: true, exitCode: 0 };
}, { sleep: (milliseconds) => sleeps.push(milliseconds) });

assert.equal(transientResult.passed, true);
assert.equal(transientResult.attempts.length, 2);
assert.equal(transientResult.attempts[0].blockerClass, "transient");
assert.deepEqual(transientResult.retryPolicy, {
  maxAttempts: 2,
  backoffMs: 250,
  attemptsUsed: 2,
  exhausted: false,
});
assert.equal(transientResult.firstFailure.attemptId, "attempt-1");
assert.deepEqual(transientResult.attemptLinks, [
  {
    attemptId: "attempt-1",
    attempt: 1,
    previousAttemptId: null,
    linkedToFirstFailure: "attempt-1",
  },
  {
    attemptId: "attempt-2",
    attempt: 2,
    previousAttemptId: "attempt-1",
    linkedToFirstFailure: "attempt-1",
  },
]);
assert.deepEqual(sleeps, [250]);

let deterministicAttempts = 0;
const deterministicResult = runWithBoundedAttemptsSync(() => {
  deterministicAttempts += 1;
  return { passed: false, exitCode: 1, output: "assertion failed: contract mismatch" };
}, { sleep: () => { throw new Error("deterministic failure was retried"); } });

assert.equal(deterministicResult.passed, false);
assert.equal(deterministicAttempts, 1);
assert.equal(deterministicResult.finalAttempt.blockerClass, "target-defect");
assert.equal(deterministicResult.retryPolicy.attemptsUsed, 1);
assert.equal(deterministicResult.retryPolicy.exhausted, false);
assert.equal(deterministicResult.firstFailure.attemptId, "attempt-1");

const environmentResult = runWithBoundedAttemptsSync(() => ({
  passed: false,
  exitCode: 2,
  error: "RelGeo integration gate requires Node.js 24+",
}));
assert.equal(environmentResult.finalAttempt.blockerClass, "environment-unavailable");
assert.equal(environmentResult.finalAttempt.retryable, false);
assert.equal(environmentResult.finalAttempt.decisionNeeded, false);

const thrownResult = runWithBoundedAttemptsSync(() => {
  throw new Error("contract exception");
}, { sleep: () => { throw new Error("thrown failure was retried"); } });
assert.equal(thrownResult.passed, false);
assert.equal(thrownResult.finalAttempt.blockerClass, "target-defect");
assert.equal(thrownResult.attempts.length, 1);

const envelope = createEvidenceEnvelope({
  evidenceClass: "local-workspace",
  workspaceRevision: "a".repeat(40),
  baselineName: "test-baseline",
  compatibilityLine: "0.5",
  toolchain: { node: "v24.0.0", pnpm: "10.33.3" },
  limitations: ["fixture limitation"],
});
assert.equal(envelope.schemaVersion, 1);
assert.equal(envelope.baseline.compatibilityLine, "0.5");
assert.deepEqual(envelope.limitations, ["fixture limitation"]);
assert.deepEqual(BLOCKER_CLASSES, [
  "target-defect",
  "transient",
  "dependency-unavailable",
  "environment-unavailable",
  "pending-human-decision",
]);
assert.deepEqual(DEPENDENCY_STATUSES, ["ready", "blocked", "not-run", "none"]);

const syncWorkflow = fs.readFileSync(
  path.join(root, ".github", "workflows", "sync-validated-submodule-after-ci.yml"),
  "utf8",
);
assert.match(syncWorkflow, /name: Checkout workspace and submodules[\s\S]*?persist-credentials: false/);
assert.match(syncWorkflow, /permissions:\n  contents: write\n  pull-requests: write\n  actions: read/);

const runnerSources = [
  fs.readFileSync(path.join(root, "scripts", "verify-baseline.mjs"), "utf8"),
  fs.readFileSync(path.join(root, "scripts", "run-integration-gate.mjs"), "utf8"),
  fs.readFileSync(path.join(root, "scripts", "run-release-preflight.mjs"), "utf8"),
];
for (const source of runnerSources) {
  assert.match(source, /createEvidenceEnvelope/);
  assert.match(source, /classifyFailure/);
  assert.match(source, /dependencyStatus/);
  assert.match(source, /firstFailure/);
  assert.match(source, /retryPolicy/);
  assert.match(source, /decisionNeeded/);
}
assert.match(runnerSources[1], /runWithBoundedAttemptsSync/);
assert.match(runnerSources[2], /runWithBoundedAttemptsSync/);

console.log("Orchestration contract tests passed: bounded retry, blocker taxonomy, evidence envelope, and sync checkout policy.");
