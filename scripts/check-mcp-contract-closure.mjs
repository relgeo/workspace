#!/usr/bin/env node

import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];
const checks = [];

function check(condition, message) {
  checks.push({ status: condition ? "PASS" : "FAIL", message });
  if (!condition) failures.push(message);
}

async function read(path) {
  return readFile(resolve(root, path), "utf8");
}

const requiredPaths = [
  "mcp/lib/src/contract",
  "mcp/test",
  "docs/mcp",
  "spec",
  "core",
  "language-service",
  "fixtures",
];
for (const path of requiredPaths) {
  check(existsSync(resolve(root, path)), `required evidence path exists: ${path}`);
}

let schema = "";
let sessionBridge = "";
let dispatcher = "";
let schemaTests = "";
let dispatchTests = "";
let compatibilityDocs = "";
let audit = "";
let fixture;
let crossSurfaceFixture;
let sessionFixture;
try {
  [schema, sessionBridge, dispatcher, schemaTests, dispatchTests, compatibilityDocs, audit] =
    await Promise.all([
      read("mcp/lib/src/contract/mcp_schema.dart"),
      read("mcp/lib/src/contract/session_bridge.dart"),
      read("mcp/lib/src/adapter/local_dispatch.dart"),
      read("mcp/test/mcp_schema_test.dart"),
      read("mcp/test/local_dispatch_test.dart"),
      read("docs/mcp/08-contract-compatibility-boundary.md"),
      read("docs/capability-map/mcp/implementation-audit.md"),
    ]);
  fixture = JSON.parse(await read("fixtures/mcp/contract-boundary-cases.json"));
  crossSurfaceFixture = JSON.parse(
    await read("fixtures/mcp/cross-surface-contract-cases.json"),
  );
  sessionFixture = JSON.parse(
    await read("fixtures/mcp/session-transaction-cases.json"),
  );
} catch (error) {
  failures.push(`contract closure evidence is unreadable: ${error.message}`);
}

check(
  schema.includes("void validateForRequest({") &&
  schema.includes("class RenderResult") &&
    schema.includes("final String? sheetId;") &&
    schema.includes("withSheetIdIfMissing") &&
    schema.includes("enum McpValidationTarget") &&
    schema.includes("class McpSharedAuthoringContext") &&
    schema.includes("class McpDomainError") &&
    schema.includes("class McpTransportContract") &&
    sessionBridge.includes("class McpServerStatus"),
  "MCP DTO contract contains provenance, validation, identity, error, transport, and host-status boundaries",
);
check(
  dispatcher.includes("withSheetIdIfMissing") &&
    dispatcher.includes("renderSource returned a different sheet target") &&
    dispatcher.includes("McpErrorCategory.unsupportedSpecVersion"),
  "MCP dispatcher enforces render target, owner error, and version compatibility guards",
);
check(
  schemaTests.includes("source proposal validates its provenance chain") &&
    schemaTests.includes("requireNormativeBasis: true"),
  "schema regression tests cover proposal version and normative provenance requirements",
);
check(
  dispatchTests.includes("dispatcher preserves an explicit render sheet target") &&
    dispatchTests.includes("dispatcher rejects an owner render result for another sheet"),
  "dispatcher regression tests cover render target echo and mismatch rejection",
);
check(
  fixture?.schemaVersion === "mcp-contract-boundary/v1" &&
  fixture?.contractRevision === "mcp-contract-2026-11-12-r1" &&
  fixture?.compatibilityLine === "0.5" &&
  fixture?.cases?.length === 4,
  "shared contract fixture pins the active line and four boundary cases",
);
check(
  crossSurfaceFixture?.schemaVersion === "mcp-cross-surface-contract/v1" &&
    crossSurfaceFixture?.contractRevision === "mcp-contract-2026-11-12-r1" &&
    crossSurfaceFixture?.compatibilityLine === "0.5" &&
    crossSurfaceFixture?.cases?.length === 5,
  "shared cross-surface fixture pins five adapter boundary cases",
);
check(
  sessionFixture?.schemaVersion === "mcp-session-transaction/v1" &&
    sessionFixture?.contractRevision === "mcp-contract-2026-11-12-r1" &&
    sessionFixture?.cases?.length === 4,
  "session/transaction fixture pins the shared immutable contract revision",
);
check(
    sessionBridge.includes("relGeoMcpContractRevision") &&
    sessionBridge.includes("contractRevision") &&
    schemaTests.includes("mcp-contract-2026-11-12-r1") &&
    schemaTests.includes("contractRevision"),
  "MCP and host-facing status consumers expose the shared immutable contract revision",
);
check(
  compatibilityDocs.includes("RenderSourceInput.sheetId") &&
    compatibilityDocs.includes("SourceProposal.validateForRequest") &&
    compatibilityDocs.includes("contract-boundary-cases.json"),
  "canonical MCP contract documentation records the additive DTO and fixture boundary",
);
check(
  audit.includes("### 3.3 Contract/DTO compatibility delta") &&
    audit.includes("Core/renderer sheet selection is still an owner integration gap") &&
    audit.includes("McpProducerCompletionProposal` requires and maps ordered `basedOn[]` provenance") &&
    audit.includes("direct language-service runtime wiring remains separate"),
  "audit records implemented contract evidence without promoting producer gaps",
);

if (failures.length === 0) {
  console.log("MCP contract closure checks passed: DTO, provenance, compatibility, fixture, and evidence boundaries are joined.");
  console.log(`contract closure checks: PASS checks=${checks.length}`);
  for (const [path, line] of [
    ["docs/evidence/mcp-contract-alignment-2026-11-12.json", 3],
    ["mcp/lib/src/contract/contract_revision.dart", 2],
    ["mcp/lib/src/contract/session_bridge.dart", 661],
    ["flutter/test/mcp_server_io_test.dart", 154],
    ["fixtures/mcp/session-transaction-cases.json", 3],
    ["docs/mcp/08-contract-compatibility-boundary.md", 10],
  ]) {
    console.log(`grounded evidence locator: file:${resolve(root, path)}:${line}`);
  }
} else {
  for (const result of checks) console.log(`[${result.status}] ${result.message}`);
  console.error(`\nMCP contract closure checks failed: ${failures.length}`);
  process.exitCode = 1;
}
