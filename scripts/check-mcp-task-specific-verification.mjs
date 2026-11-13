#!/usr/bin/env node

import { access, readFile } from "node:fs/promises";
import { execFileSync, spawnSync } from "node:child_process";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const manifestPath = "docs/evidence/mcp-task-specific-verification-2026-11-12.json";
const failures = [];

async function exists(relativePath) {
  try {
    await access(join(root, relativePath));
    return true;
  } catch {
    return false;
  }
}

function git(...args) {
  return execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
}

const manifest = JSON.parse(await readFile(join(root, manifestPath), "utf8"));
const contractAlignment = JSON.parse(await readFile(
  join(root, "docs/evidence/mcp-contract-alignment-2026-11-12.json"),
  "utf8",
));
const expectedRevisions = {
  workspace: git("rev-parse", "HEAD"),
  mcp: git("-C", "mcp", "rev-parse", "HEAD"),
  flutter: git("-C", "flutter", "rev-parse", "HEAD"),
  spec: git("-C", "spec", "rev-parse", "HEAD"),
};

for (const [name, revision] of Object.entries(expectedRevisions)) {
  if (manifest.revisions?.[name] !== revision) {
    failures.push(`${name} revision is not pinned to the current checkout`);
  }
}

if (manifest.schemaVersion !== "mcp-task-specific-verification/v1") failures.push("schema version is invalid");
if (manifest.validatorRevision !== "mcp-task-specific-verification-r3") failures.push("validator revision is missing");
if (manifest.taskId !== "run-compact-task-specific-mcp-verification-and-consumer-propagation--6648601740") failures.push("task id is not current");
if (manifest.contractRevision !== "mcp-contract-2026-11-12-r1") failures.push("shared contract revision is missing");
if (
  contractAlignment.schemaVersion !== "mcp-contract-alignment/v1" ||
  contractAlignment.status !== "verified" ||
  contractAlignment.contractRevision !== manifest.contractRevision ||
  contractAlignment.fixtureCount !== 6 ||
  !Array.isArray(contractAlignment.consumers) ||
  !["mcp-export", "mcp-status", "flutter-assertion", "fixtures"].every((id) =>
    contractAlignment.consumers.some((consumer) => consumer.id === id))
) {
  failures.push("root-level contract alignment evidence is incomplete");
}
if (
  manifest.executionRecord?.singleExecution !== true ||
  manifest.executionRecord?.singleValidationRecord !== true ||
  !manifest.executionRecord?.executionRecordId ||
  !manifest.executionRecord?.validationRecordId ||
  manifest.executionRecord?.validatorRevision !== manifest.validatorRevision
) {
  failures.push("execution/validation record linkage is incomplete");
}
const expectedClosureValidators = new Set((manifest.closureRecords ?? []).map((record) => record.validator));
if (expectedClosureValidators.size !== 9 || manifest.closureRecords.some((record) =>
  record.executionRecordId !== manifest.executionRecord.executionRecordId ||
  record.validationRecordId !== manifest.executionRecord.validationRecordId ||
  record.validatorRevision !== manifest.validatorRevision ||
  !record.id || !record.validator
)) {
  failures.push("per-closure execution/validation links are incomplete");
}
if (manifest.verification?.mcpTests?.observedMarker !== "00:00 +46: All tests passed!" ||
    manifest.verification?.mcpTests?.analyzerMarker !== "No issues found!" ||
    !manifest.verification?.mcpTests?.conformanceMarkers?.includes("stdio fixture conformance: PASS") ||
    !manifest.verification?.mcpTests?.conformanceMarkers?.includes("remote bind guard: PASS")) {
  failures.push("MCP analyzer/test/conformance markers are incomplete");
}
const flutter = manifest.verification?.flutterConsumer;
if (flutter?.status !== "environment-unavailable/deferred" || flutter?.claimLimit == null || flutter?.remediation == null) {
  failures.push("Flutter unavailable boundary lacks status, claim limit, or remediation");
}
for (const fixturePath of [
  "fixtures/mcp/contract-boundary-cases.json",
  "fixtures/mcp/cross-surface-contract-cases.json",
  "fixtures/mcp/diagnostics-provenance-cases.json",
  "fixtures/mcp/render-safety-provenance-cases.json",
  "fixtures/mcp/session-transaction-cases.json",
  "fixtures/mcp/setup-operations-compatibility-cases.json",
]) {
  const fixture = JSON.parse(await readFile(join(root, fixturePath), "utf8"));
  if (fixture.contractRevision !== manifest.contractRevision) {
    failures.push(`${fixturePath} does not use the shared contract revision`);
  }
}
const contractConsumers = [
  ["mcp/lib/src/contract/contract_revision.dart", "mcp-contract-2026-11-12-r1"],
  ["mcp/lib/relgeo_mcp.dart", "contract_revision.dart"],
  ["mcp/lib/src/contract/session_bridge.dart", "contractRevision"],
  ["flutter/test/mcp_server_io_test.dart", "relGeoMcpContractRevision"],
];
for (const [consumerPath, marker] of contractConsumers) {
  const consumerSource = await readFile(join(root, consumerPath), "utf8");
  if (!consumerSource.includes(marker)) {
    failures.push(`${consumerPath} does not expose the shared contract revision`);
  }
}
for (const artifact of manifest.artifacts ?? []) {
  if (artifact.endsWith("/")) {
    if (!(await exists(artifact))) failures.push(`artifact directory is missing: ${artifact}`);
  } else if (!(await exists(artifact))) {
    failures.push(`artifact is missing: ${artifact}`);
  }
}

const closureCommands = [
  ["node", ["scripts/check-mcp-actionable-closure.mjs"]],
  ["node", ["scripts/check-mcp-contract-closure.mjs"]],
  ["node", ["scripts/check-mcp-capability-catalog.mjs"]],
  ["node", ["scripts/check-mcp-implementation-audit.mjs"]],
  ["node", ["scripts/check-mcp-diagnostics-provenance-closure.mjs"]],
  ["node", ["scripts/check-mcp-render-safety-closure.mjs"]],
  ["node", ["scripts/check-mcp-evidence-boundaries.mjs"]],
  ["node", ["scripts/check-mcp-residual-audit.mjs", "--evidence-id=suclos-mcp-residual-audit-2026-11-12-r3"]],
  ["node", ["scripts/check-mcp-setup-operations-compatibility-closure.mjs", "--evidence-id=suclos-mcp-setup-operations-2026-11-12-r2"]],
];
for (const [command, args] of closureCommands) {
  const result = spawnSync(command, args, { cwd: root, encoding: "utf8" });
  if (result.status !== 0) failures.push(`${args[1] ?? args[0]} exited ${result.status}`);
}

const dart = process.env.RELGEO_DART_BIN ?? "dart";
const mcpChecks = [
  ["analyzer", ["--suppress-analytics", "analyze"]],
  ["tests", ["--suppress-analytics", "test", "test/protocol_fixture_test.dart", "test/mcp_schema_test.dart", "test/local_dispatch_test.dart"]],
  ["transport conformance", ["--suppress-analytics", "run", "tool/run_transport_conformance.dart", "--stdio-only"]],
];
for (const [label, args] of mcpChecks) {
  const result = spawnSync(dart, args, { cwd: join(root, "mcp"), encoding: "utf8" });
  const output = `${result.stdout ?? ""}\n${result.stderr ?? ""}`;
  if (result.status !== 0) failures.push(`MCP ${label} exited ${result.status}`);
  if (label === "analyzer" && !output.includes("No issues found!")) failures.push("MCP analyzer marker is missing");
  if (label === "tests" && !output.includes("00:00 +46: All tests passed!")) failures.push("MCP test marker is missing");
  if (label === "transport conformance" && (!output.includes("stdio fixture conformance: PASS") || !output.includes("remote bind guard: PASS"))) {
    failures.push("MCP transport conformance markers are missing");
  }
}

if (failures.length) {
  for (const failure of failures) console.error(`[FAIL] ${failure}`);
  process.exit(1);
}

console.log("MCP task-specific verification artifact: PASS");
console.log(`contract alignment: PASS revision=${manifest.contractRevision}; consumers=mcp-export,mcp-status,flutter-assertion,fixtures`);
console.log(`contract evidence source: file:${resolve(root, "docs/evidence/mcp-contract-alignment-2026-11-12.json")}:3; file:${resolve(root, "docs/evidence/mcp-contract-alignment-2026-11-12.json")}:6`);
console.log("validation records: PASS; consumer claim boundary: PASS status=environment-unavailable/deferred; no canonical CI or packaged-runtime pass claimed");
console.log(`validation linkage: execution=${manifest.executionRecord.executionRecordId}; validation=${manifest.executionRecord.validationRecordId}; validatorRevision=${manifest.validatorRevision}; closures=${manifest.closureRecords.length}`);
console.log(`validation linkage source: file:${resolve(root, "docs/evidence/mcp-task-specific-verification-2026-11-12.json")}:6; file:${resolve(root, "docs/evidence/mcp-task-specific-verification-2026-11-12.json")}:45`);
console.log(`claim boundary source: file:${resolve(root, "docs/evidence/mcp-task-specific-verification-2026-11-12.json")}:37; file:${resolve(root, "docs/evidence/mcp-task-specific-verification-2026-11-12.json")}:40; file:${resolve(root, "docs/evidence/mcp-contract-alignment-2026-11-12.json")}:13`);
console.log("MCP contract closure checks passed: DTO, provenance, compatibility, fixture, and evidence boundaries are joined.");
console.log("grounded evidence locators:");
console.log(`file:${resolve(root, "scripts/check-mcp-task-specific-verification.mjs")}:43`);
console.log(`file:${resolve(root, "docs/evidence/mcp-task-specific-verification-2026-11-12.json")}:6`);
console.log(`file:${resolve(root, "docs/evidence/mcp-task-specific-verification-2026-11-12.json")}:45`);
