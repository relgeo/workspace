#!/usr/bin/env node

import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const {
  validateDispatchMetadata,
  validateWorkflowRun,
  validateSynchronizationCandidate,
  validateProvenance,
} = require("./child-ci-sync-policy.cjs");

const sha = "a".repeat(40);
const validDispatch = validateDispatchMetadata({
  eventType: "submodule_ci_succeeded",
  payloadSubmodule: "mcp",
  payloadRepository: "relgeo/mcp",
  payloadPath: "mcp",
  payloadSha: sha,
  payloadRunId: "12345",
  payloadWorkflow: ".github/workflows/mcp-ci.yml",
  payloadBranch: "refs/heads/main",
});
assert.equal(validDispatch.ok, true);

const validRun = {
  head_sha: sha,
  status: "completed",
  conclusion: "success",
  event: "push",
  head_branch: "main",
  path: ".github/workflows/mcp-ci.yml",
  head_repository: { full_name: "relgeo/mcp" },
};
assert.equal(validateWorkflowRun({
  run: validRun,
  expectedSha: sha,
  expectedWorkflow: ".github/workflows/mcp-ci.yml",
  sourceRepository: "mcp",
}).ok, true);

const rejectedCases = [
  ["stale SHA", validateWorkflowRun({ run: { ...validRun, head_sha: "b".repeat(40) }, expectedSha: sha, expectedWorkflow: validRun.path, sourceRepository: "mcp" })],
  ["unsuccessful CI", validateWorkflowRun({ run: { ...validRun, conclusion: "failure" }, expectedSha: sha, expectedWorkflow: validRun.path, sourceRepository: "mcp" })],
  ["non-main source", validateWorkflowRun({ run: { ...validRun, head_branch: "feature/test" }, expectedSha: sha, expectedWorkflow: validRun.path, sourceRepository: "mcp" })],
  ["wrong workflow", validateWorkflowRun({ run: { ...validRun, path: ".github/workflows/other.yml" }, expectedSha: sha, expectedWorkflow: validRun.path, sourceRepository: "mcp" })],
  ["wrong repository", validateWorkflowRun({ run: { ...validRun, head_repository: { full_name: "attacker/mcp" } }, expectedSha: sha, expectedWorkflow: validRun.path, sourceRepository: "mcp" })],
  ["wrong dispatch branch", validateDispatchMetadata({ eventType: "submodule_ci_succeeded", payloadSubmodule: "mcp", payloadRepository: "relgeo/mcp", payloadPath: "mcp", payloadSha: sha, payloadRunId: "12345", payloadWorkflow: validRun.path, payloadBranch: "refs/heads/feature" })],
  ["wrong fetched object", validateSynchronizationCandidate({ currentSha: "c".repeat(40), requestedSha: sha, fetchedSha: "d".repeat(40), checkoutSha: sha, gitlinkSha: sha })],
  ["dirty child", validateSynchronizationCandidate({ currentSha: "c".repeat(40), requestedSha: sha, fetchedSha: sha, checkoutSha: sha, gitlinkSha: sha, childDirty: true })],
  ["provenance mismatch", validateProvenance({ sourceSha: sha, baselineChildRevision: "e".repeat(40), gitlinkRevision: sha, runConclusion: "success", rootRevision: "root", baselineRootRevision: "root" })],
];
for (const [label, result] of rejectedCases) assert.equal(result.ok, false, `${label} must be rejected`);

assert.equal(validateSynchronizationCandidate({ currentSha: sha, requestedSha: sha }).changed, false);
assert.equal(validateProvenance({ sourceSha: sha, baselineChildRevision: sha, gitlinkRevision: sha, runConclusion: "success", rootRevision: "root", baselineRootRevision: "root" }).ok, true);

console.log(`Child-CI sync failure injection passed: valid dispatch/run accepted; ${rejectedCases.length} stale, unsuccessful, wrong-source, dirty, and provenance-mismatch cases rejected.`);
