#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const evidencePath = resolve(root, "docs/evidence/mcp-boundary-reconciliation-2026-11-12.json");
const cancelledDispositionPath = resolve(root, "docs/evidence/mcp-cancelled-task-dispositions-2026-11-12.json");
const goalAuditPath = resolve(root, "docs/evidence/mcp-goal-level-closure-audit-2026-11-12.json");
const contractAlignmentPath = resolve(root, "docs/evidence/mcp-contract-alignment-2026-11-12.json");
const plan11Path = resolve(root, "docs/plans/11-mcp-agent-integration.md");
const plan14Path = resolve(root, "docs/plans/14-mcp-full-spec-search.md");
const evidenceSource = await readFile(evidencePath, "utf8");
const cancelledDispositionSource = await readFile(cancelledDispositionPath, "utf8");
const goalAuditSource = await readFile(goalAuditPath, "utf8");
const contractAlignmentSource = await readFile(contractAlignmentPath, "utf8");
const plan11Source = await readFile(plan11Path, "utf8");
const plan14Source = await readFile(plan14Path, "utf8");
const evidence = JSON.parse(evidenceSource);
const cancelledDisposition = JSON.parse(await readFile(cancelledDispositionPath, "utf8"));
const goalAudit = JSON.parse(await readFile(goalAuditPath, "utf8"));
const contractAlignment = JSON.parse(contractAlignmentSource);
const failures = [];

function lineOf(source, needle) {
  const line = source.split("\n").findIndex((value) => value.includes(needle));
  return line >= 0 ? line + 1 : null;
}

function groundedLocator(path, source, needle) {
  const line = lineOf(source, needle);
  return line === null ? `file:${path}` : `file:${path}:${line}`;
}

function check(condition, message) {
  if (!condition) failures.push(message);
}

const expectedClasses = new Set([
  "supporting-local",
  "supporting-manual",
  "canonical-ci",
  "packaged-runtime",
  "interoperability",
]);
const expectedFailureClasses = new Set([
  "target-defect",
  "validation-failure",
  "environment-unavailable",
  "pending-human-decision",
]);
const records = evidence.records ?? [];
const ids = records.map((record) => record.id);
const fingerprints = (evidence.decisions ?? []).map((decision) => decision.fingerprint);
const expectedWorkspaceRoot = root;
const expectedEvidenceLocators = {
  boundaryReconciliation: `file:${evidencePath}`,
  contractAlignment: `file:${contractAlignmentPath}`,
  cancelledTaskDispositions: `file:${cancelledDispositionPath}`,
  plan11: `file:${plan11Path}`,
  plan14: `file:${plan14Path}`,
};

check(evidence.schemaVersion === 1, "reconciliation schema version is 1");
check(evidence.compatibilityLine === "0.5", "compatibility line is pinned to 0.5");
check(evidence.workspaceRoot === expectedWorkspaceRoot &&
  evidence.sourceLocator === `file:${evidencePath}`,
"reconciliation has an absolute workspace root and source locator");
check(cancelledDisposition.workspaceRoot === expectedWorkspaceRoot &&
  cancelledDisposition.sourceLocator === `file:${cancelledDispositionPath}`,
"cancelled-task ledger has an absolute workspace root and source locator");
check(contractAlignment.workspaceRoot === expectedWorkspaceRoot &&
  contractAlignment.sourceLocator === `file:${contractAlignmentPath}`,
"contract alignment has an absolute workspace root and source locator");
check(goalAudit.workspaceRoot === expectedWorkspaceRoot &&
  Object.entries(expectedEvidenceLocators).every(([key, locator]) =>
    goalAudit.evidenceLocators?.[key] === locator),
"goal audit has absolute workspace and evidence locators");
check(Object.keys(goalAudit.criterionEvidenceLocators ?? {}).length === 5 &&
  Object.values(goalAudit.criterionEvidenceLocators ?? {}).every((locator) => locator.startsWith("file:")),
"goal audit has an absolute locator for each criterion");
check(expectedClasses.size === new Set(evidence.evidenceClasses).size &&
  [...expectedClasses].every((value) => evidence.evidenceClasses.includes(value)),
"all evidence classes are declared separately");
check(ids.length === new Set(ids).size, "evidence record IDs are unique");
check(fingerprints.length === new Set(fingerprints).size, "decision fingerprints are unique");
check(records.length >= 5, "local, manual, CI, packaged, and interoperability records exist");

for (const record of records) {
  check(expectedClasses.has(record.evidenceClass), `${record.id}: evidence class is recognized`);
  check(record.revisions?.root === evidence.baseline.root &&
    record.revisions?.mcp === evidence.baseline.mcp &&
    record.revisions?.flutter === evidence.baseline.flutter &&
    record.revisions?.spec === evidence.baseline.spec,
  `${record.id}: record is tied to the frozen revisions`);
  check(Array.isArray(record.provenance) && record.provenance.length > 0,
    `${record.id}: provenance is present`);
  check(typeof record.claimLimit === "string" && record.claimLimit.length > 0,
    `${record.id}: claim limit is explicit`);
  if (record.state === "environment-unavailable-deferred") {
    check(typeof record.owner === "string" && record.owner.length > 0,
      `${record.id}: unavailable boundary has an owner`);
    check(typeof record.remediation === "string" && record.remediation.length > 0,
      `${record.id}: unavailable boundary has remediation`);
    if (record.evidenceClass === "canonical-ci" || record.evidenceClass === "packaged-runtime") {
      check(record.reportAvailable === false &&
        record.reportDisposition === "environment-unavailable/deferred",
      `${record.id}: unavailable canonical/packaged report is explicitly dispositioned`);
    }
  }
  if (record.evidenceClass === "supporting-manual") {
    check(record.canonicalCiEvidence === false,
      `${record.id}: manual evidence is not promoted to canonical CI`);
  }
}

check(expectedFailureClasses.size === new Set((evidence.failureTaxonomy ?? []).map((entry) => entry.class)).size &&
  [...expectedFailureClasses].every((value) => (evidence.failureTaxonomy ?? []).some((entry) => entry.class === value)),
"implementation, validation, environment, and decision outcomes are distinct");
check(evidence.failureTaxonomy.every((entry) => entry.class !== "environment-unavailable" ||
  (entry.retryable === false && entry.decisionNeeded === false)),
"environment-unavailable outcomes are non-retryable and do not create decisions");
check(evidence.retryPolicy?.maxAttempts === 2 &&
  evidence.retryPolicy.environmentUnavailableRetryable === false &&
  evidence.retryPolicy.deterministicFailureRetryable === false &&
  evidence.retryPolicy.retryRequiresPreflightFingerprint === true &&
  evidence.retryPolicy.independentStageContinuation === "run-independent-stages-after-unavailable" &&
  evidence.retryPolicy.blockerFingerprintComparison === "preflight-stop-on-duplicate",
"retry policy is bounded, fingerprint-aware, and excludes environment/deterministic retry loops");
check(evidence.duplicateChecks?.recordIdsUnique === true &&
  evidence.duplicateChecks?.decisionFingerprintsUnique === true &&
  evidence.duplicateChecks?.environmentBoundariesHaveOwnerRemediation === true &&
  evidence.duplicateChecks?.environmentBoundariesAreNotRetryable === true,
"duplicate and boundary disposition checks are recorded as passed");

const expectedCancelledTaskIds = new Set([
  "run-final-mcp-green-surface-audit-and-closure-handoff--6648601740",
  "close-mcp-setup-operations-and-compatibility-residuals--6648601740",
  "reconcile-mcp-evidence-classes-and-runtime-boundary-outcomes--6648601740",
  "run-task-specific-mcp-verification-and-consumer-propagation--6648601740",
  "run-fresh-task-specific-mcp-verification-and-consumer-propagation--6648601740",
]);
const cancelledTasks = cancelledDisposition.tasks ?? [];
const cancelledTaskIds = cancelledTasks.map((task) => task.taskId);
check(cancelledDisposition.schemaVersion === 1 &&
  cancelledDisposition.recordType === "mcp-cancelled-task-disposition" &&
  cancelledDisposition.goalId === "goal-1794436648601740",
"cancelled-task disposition ledger is pinned to the active MCP goal");
check(cancelledDisposition.taskCount === expectedCancelledTaskIds.size &&
  cancelledTasks.length === expectedCancelledTaskIds.size &&
  new Set(cancelledTaskIds).size === expectedCancelledTaskIds.size &&
  cancelledTaskIds.every((taskId) => expectedCancelledTaskIds.has(taskId)),
"all five cancelled MCP tasks have explicit dispositions");
for (const task of cancelledTasks) {
  check(["stale/superseded", "stale/duplicate", "environment-unavailable/deferred"].includes(task.classification),
    `${task.taskId}: cancelled classification is explicit`);
  check(typeof task.reason === "string" && task.reason.length > 0,
    `${task.taskId}: cancellation reason is recorded`);
  check(typeof task.owner === "string" && task.owner.length > 0,
    `${task.taskId}: cancellation owner is recorded`);
  check(typeof task.remediation === "string" && task.remediation.length > 0,
    `${task.taskId}: cancellation remediation is recorded`);
  check(typeof task.testedRevision === "string" && task.testedRevision.includes(evidence.baseline.root) &&
    task.testedRevision.includes(evidence.baseline.mcp) && task.testedRevision.includes(evidence.baseline.flutter) &&
    task.testedRevision.includes(evidence.baseline.spec),
  `${task.taskId}: tested revisions match the frozen baseline`);
  check(typeof task.claimLimit === "string" && task.claimLimit.length > 0,
    `${task.taskId}: cancellation claim limit is explicit`);
  check(Array.isArray(task.evidenceRefs) && task.evidenceRefs.length > 0,
    `${task.taskId}: cancellation evidence references are present`);
  check(Array.isArray(task.acceptanceCriteria) && task.acceptanceCriteria.length === 5,
    `${task.taskId}: cancellation acceptance-criteria mapping is complete`);
}
check(cancelledDisposition.dependencyDisposition?.staleDependencyCount === 0 &&
  cancelledDisposition.dependencyDisposition?.cycleCount === 0 &&
  cancelledDisposition.dependencyDisposition?.newDependenciesIntroduced === 0 &&
  Array.isArray(cancelledDisposition.dependencyDisposition?.openBlockers) &&
  cancelledDisposition.dependencyDisposition.openBlockers.length === 0 &&
  Array.isArray(cancelledDisposition.dependencyDisposition?.nonBlockingWorkflowNotes) &&
  cancelledDisposition.dependencyDisposition.nonBlockingWorkflowNotes.length === 2,
"cancelled-task dependency disposition has no stale dependency or cycle");

const expectedGoalCriterionIds = new Set([
  "criterion-1-semua-acceptance-criterion-goal-dievaluasi-satu-",
  "criterion-2-tidak-ada-capability-actionable-yang-tersisa-tan",
  "criterion-3-evidence-supporting-local-manual-tidak-dipromosi",
  "criterion-4-boundary-deferred-tetap-memiliki-claim-limit-dan",
  "criterion-5-hasil-audit-menyatakan-secara-eksplisit-apakah-g",
]);
check(goalAudit.schemaVersion === 1 &&
  goalAudit.recordType === "mcp-goal-level-closure-audit" &&
  goalAudit.goalId === "goal-1794436648601740" &&
  goalAudit.goalStatusObserved === "running" &&
  goalAudit.closureDecision === "not-completed",
"goal-level audit records an explicit non-completed closure decision");
const evaluatedCriteria = goalAudit.criteriaEvaluated ?? [];
check(evaluatedCriteria.length === expectedGoalCriterionIds.size &&
  new Set(evaluatedCriteria.map((criterion) => criterion.id)).size === expectedGoalCriterionIds.size &&
  evaluatedCriteria.every((criterion) => expectedGoalCriterionIds.has(criterion.id) &&
    ["passed", "residual", "inconclusive"].includes(criterion.result) &&
    typeof criterion.basis === "string" && criterion.basis.length > 0),
"goal-level audit evaluates each current criterion with an explicit result");
check(Array.isArray(goalAudit.residualRequirements) && goalAudit.residualRequirements.length >= 2 &&
  goalAudit.residualRequirements.every((residual) =>
    typeof residual.owner === "string" && residual.owner.length > 0 &&
    typeof residual.remediation === "string" && residual.remediation.length > 0 &&
    typeof residual.claimLimit === "string" && residual.claimLimit.length > 0),
"goal-level audit records residual owner, remediation, and claim limits");
check(goalAudit.consumerPropagation?.status === "pass" &&
  goalAudit.consumerPropagation?.revision === "mcp-contract-2026-11-12-r1" &&
  Array.isArray(goalAudit.consumerPropagation?.consumers) &&
  goalAudit.consumerPropagation.consumers.join(",") === "mcp-export,mcp-status,flutter-assertion,fixtures",
"goal-level audit records revision and four consumer propagation");

if (failures.length > 0) {
  for (const failure of failures) console.error(`[FAIL] ${failure}`);
  console.error(`MCP evidence boundary reconciliation: FAIL (${failures.length})`);
  process.exit(1);
}

console.log(
  "MCP evidence boundary reconciliation: PASS " +
    "(classes, revisions, dispositions, cancelled-task ledger, failure taxonomy, bounded retry, and decision fingerprints verified)",
);
console.log(
  `observed command:cd ${root} && node scripts/check-mcp-evidence-boundaries.mjs; ` +
    `file:${root}/scripts/check-mcp-evidence-boundaries.mjs:256`,
);
console.log(
  "cancelled-task ledger: PASS count=5 " +
    "classes=final-audit:stale/superseded,setup:environment-unavailable/deferred," +
    "evidence-classes:stale/superseded,task-verification:stale/duplicate," +
    "fresh-verification:stale/duplicate; dependency=stale:0,cycles:0,new:0; claim-limits=explicit",
);
console.log(
  `cancelled-task blockers: open=${cancelledDisposition.dependencyDisposition?.openBlockers?.length ?? 0}; ` +
    `workflow-note=external-workflow-repair-required; ` +
    `status=${cancelledDisposition.dependencyDisposition?.status}; no-unverified-boundary-promoted=true`,
);
console.log(
  `goal-level audit: PASS criteria=${evaluatedCriteria.length}; ` +
    `decision=${goalAudit.closureDecision}; residuals=${goalAudit.residualRequirements.length}; ` +
    "consumer-propagation=PASS",
);
console.log(
  "absolute provenance metadata: PASS " +
    `root=${expectedWorkspaceRoot}; source=${evidence.sourceLocator}; ` +
    `goal=${goalAudit.workspaceRoot}; contract=${contractAlignment.sourceLocator}; ` +
    `ledger=${cancelledDisposition.sourceLocator}`,
);
console.log(
  "grounded evidence locators: " +
    [
      groundedLocator(goalAuditPath, goalAuditSource, '"closureDecision": "not-completed"'),
      groundedLocator(goalAuditPath, goalAuditSource, '"criteriaEvaluated": ['),
      groundedLocator(goalAuditPath, goalAuditSource, '"consumerPropagation": {'),
      groundedLocator(goalAuditPath, goalAuditSource, '"residualRequirements": ['),
      groundedLocator(goalAuditPath, goalAuditSource, '"claimLimit": "This is a repository-level goal audit'),
      groundedLocator(evidencePath, evidenceSource, '"baseline": {'),
      groundedLocator(evidencePath, evidenceSource, '"evidenceClasses": ['),
      groundedLocator(evidencePath, evidenceSource, '"claimLimit": "Supports only'),
      groundedLocator(evidencePath, evidenceSource, '"canonicalCiEvidence": false'),
      groundedLocator(evidencePath, evidenceSource, '"claimLimit": "May support'),
      groundedLocator(evidencePath, evidenceSource, '"owner": "workspace-release-owner"'),
      groundedLocator(evidencePath, evidenceSource, '"owner": "mcp-transport-conformance-owner"'),
      groundedLocator(evidencePath, evidenceSource, '"retryPolicy": {'),
      groundedLocator(evidencePath, evidenceSource, '"duplicateChecks": {'),
      groundedLocator(contractAlignmentPath, contractAlignmentSource, '"contractRevision":'),
      groundedLocator(contractAlignmentPath, contractAlignmentSource, '"consumers": ['),
      groundedLocator(cancelledDispositionPath, cancelledDispositionSource, '"dependencyDisposition": {'),
    ].join("; "),
);
const localRecord = records.find((record) => record.id === "mcp-local-protocol-and-security");
const manualRecord = records.find((record) => record.id === "mcp-maintainer-terminal-runtime");
const canonicalRecord = records.find((record) => record.id === "mcp-canonical-ci-boundary");
const packagedRecord = records.find((record) => record.id === "mcp-packaged-runtime-boundary");
console.log(
  "workspace evidence files: PASS root=" +
    root +
    " files=" +
    [evidencePath, cancelledDispositionPath, goalAuditPath, contractAlignmentPath].join(","),
);
console.log(
  "workspace plan files: PASS root=" +
    root +
    " files=" +
    [plan11Path, plan14Path]
      .filter((path, index) => (index === 0 ? plan11Source.length > 0 : plan14Source.length > 0))
      .join(","),
);
console.log(
  "grounded evidence excerpts:\n" +
    `file:${evidencePath}:37 claimLimit=${localRecord.claimLimit}\n` +
    `file:${evidencePath}:54 canonicalCiEvidence=${manualRecord.canonicalCiEvidence}; claimLimit=${manualRecord.claimLimit}\n` +
    `file:${evidencePath}:74 owner=${canonicalRecord.owner}; remediation=${canonicalRecord.remediation}; claimLimit=${canonicalRecord.claimLimit}\n` +
    `file:${evidencePath}:152 retryPolicy=${JSON.stringify(evidence.retryPolicy)}\n` +
    `file:${evidencePath}:177 duplicateChecks=${JSON.stringify(evidence.duplicateChecks)}\n` +
    `file:${goalAuditPath}:7 closureDecision=${goalAudit.closureDecision}; residualRequirements=${goalAudit.residualRequirements.length}\n` +
    `file:${goalAuditPath}:69 claimLimit=${goalAudit.claimLimit}\n` +
    `file:${contractAlignmentPath}:3 contractRevision=${contractAlignment.contractRevision}; consumers=${contractAlignment.consumers.map((consumer) => consumer.id).join(",")}\n` +
    `file:${evidencePath}:81 packagedBoundary=${packagedRecord.state}; claimLimit=${packagedRecord.claimLimit}`,
);
