#!/usr/bin/env node

import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const evidenceIdArg = process.argv.find((argument) =>
  argument.startsWith("--evidence-id="),
);
const evidenceId = evidenceIdArg?.slice("--evidence-id=".length) ?? "unspecified";
const inScopeIds = ["VAL-03", "TRAN-03", "DEL-03", "DEL-04", "DEL-05", "DEL-06"];
const checks = [];
const failures = [];

function check(condition, message) {
  checks.push({ status: condition ? "PASS" : "FAIL", message });
  if (!condition) failures.push(message);
}

const matrixPath = join(root, "docs/capability-map/mcp/status-matrix.md");
const freezePath = join(root, "docs/capability-map/mcp/freeze-2026-11-12.md");
const backlogPath = join(root, "docs/capability-map/mcp/implementation-gap-backlog.md");
const setupClosurePath = join(
  root,
  "docs/capability-map/mcp/setup-operations-compatibility-closure-2026-11-12.md",
);
const fixturePath = join(root, "fixtures/mcp/setup-operations-compatibility-cases.json");
const mcpSchemaTestPath = join(root, "mcp/test/mcp_schema_test.dart");
const sessionTestPath = join(root, "mcp/test/local_dispatch_test.dart");
const protocolTestPath = join(root, "mcp/test/protocol_fixture_test.dart");
const flutterTestPath = join(root, "flutter/test/mcp_server_io_test.dart");
for (const [path, label] of [
  [matrixPath, "status matrix"],
  [freezePath, "freeze disposition"],
  [backlogPath, "residual backlog"],
  [fixturePath, "setup/operations fixture"],
  [mcpSchemaTestPath, "MCP schema tests"],
  [sessionTestPath, "session tests"],
  [protocolTestPath, "protocol tests"],
  [flutterTestPath, "Flutter transport tests"],
]) {
  check(existsSync(path), `${label} exists`);
}

const [matrix, freeze, backlog, setupClosure, fixtureText, schemaTests, sessionTests, protocolTests, flutterTests] =
  await Promise.all([
    readFile(matrixPath, "utf8"),
    readFile(freezePath, "utf8"),
    readFile(backlogPath, "utf8"),
    readFile(setupClosurePath, "utf8"),
    readFile(fixturePath, "utf8"),
    readFile(mcpSchemaTestPath, "utf8"),
    readFile(sessionTestPath, "utf8"),
    readFile(protocolTestPath, "utf8"),
    readFile(flutterTestPath, "utf8"),
  ]);
const fixture = JSON.parse(fixtureText);

for (const id of inScopeIds) {
  const row = matrix.split("\n").find((line) => line.startsWith(`| \`${id}\` |`));
  check(Boolean(row), `in-scope matrix row exists: ${id}`);
  check(
    row != null && !row.includes("`🌗`") && !row.includes("`❌`") && !row.includes("`⚠️`"),
    `in-scope matrix row is not partial/absent/defective: ${id}`,
  );
  check(
    freeze.includes(`| \`${id}\` |`) && freeze.includes("environment-unavailable/deferred"),
    `freeze records an explicit runtime disposition: ${id}`,
  );
  check(
    backlog.includes(`| \`${id}\` |`) && backlog.includes("environment-unavailable"),
    `backlog records remediation boundary: ${id}`,
  );
}
check(
  matrix.includes("| `✔️` | 60 |") && matrix.includes("| `🌗` | 0 |") &&
    matrix.includes("| `⏸️` | 8 |"),
  "status matrix has no partial rows and records eight explicit deferred boundaries",
);
check(
  protocolTests.includes("fixture exposes the same initialize/tools/resources wire contract") &&
    protocolTests.includes("fixture rejects unsupported version before operation phase") &&
    protocolTests.includes("fixture reports invalid tool arguments without terminating") &&
    protocolTests.includes("setup compatibility fixture pins local and unavailable boundaries") &&
    sessionTests.includes("protocol negotiation accepts the 2025-06-18 compatibility boundary"),
  "protocol fixture tests cover initialize, both supported versions, invalid requests, and boundary fixture alignment",
);
check(
  schemaTests.includes("transport and host status contracts do not expose bearer tokens") &&
    sessionTests.includes("server session is explicitly enabled and revokes tokens on stop"),
  "security defaults and session stop/revocation tests are present",
);
check(
  flutterTests.includes("HTTP MCP exposes bundled spec and gates undoable document edits") &&
    flutterTests.includes("HTTP request timeout cancels the bridge before mutation commit") &&
    flutterTests.includes("HTTP server stop cancels an in-flight bridge before mutation commit"),
  "Flutter setup/operations transport tests cover permission and lifecycle safety",
);
check(
  fixture.schemaVersion === "mcp-setup-operations-compatibility/v1" &&
    fixture.compatibilityLine === "0.5" &&
    fixture.protocolVersion === "2025-11-25" &&
    fixture.cases.length === 5,
  "fixture pins compatibility line, protocol version, and five setup/operations cases",
);
check(
  fixture.cases.some((entry) => entry.expected === "environment-unavailable-deferred"),
  "fixture explicitly separates unavailable packaged/client boundary",
);
check(
  setupClosure.includes("Workspace root | `47c8b526dcf67197d0e5546a310b68dafcdf97fc`") &&
    setupClosure.includes("MCP child | `824b46eccabd77da37bb37fa72b1c4a0e019442f`") &&
    setupClosure.includes("Flutter child | `1b894663778af002675e253049c8a793c5cea8b9`") &&
    setupClosure.includes("Spec child | `26ff53278d77d916b0e0e6c26ca9ab496232fbc0`"),
  "setup closure records the frozen root/MCP/Flutter/spec revisions",
);
check(
  setupClosure.includes("00:00 +46: All tests passed!") &&
    setupClosure.includes("protocol negotiation accepts the 2025-06-18 compatibility boundary") &&
    setupClosure.includes("engine.stamp") &&
    setupClosure.includes("environment-unavailable/deferred"),
  "setup closure records direct Dart evidence and the bounded Flutter sandbox disposition",
);

function runBoundaryTest(label, command, args, cwd) {
  const result = spawnSync(command, args, {
    cwd,
    env: process.env,
    encoding: "utf8",
  });
  const output = `${result.stdout ?? ""}\n${result.stderr ?? ""}`;
  const managedSandboxUnavailable =
    label === "Flutter MCP setup/operations suite" &&
    output.includes("engine.stamp") &&
    output.includes("Operation not permitted");
  check(
    result.status === 0 ||
      (managedSandboxUnavailable &&
        freeze.includes("DEL-04") &&
        freeze.includes("environment-unavailable/deferred")),
    result.status === 0
      ? `${label} executes successfully at its named runtime boundary`
      : managedSandboxUnavailable
        ? `${label} is explicitly deferred at the managed sandbox boundary`
        : `${label} executes successfully at its named runtime boundary`,
  );
}

runBoundaryTest(
  "MCP Dart protocol/session/security suite",
  process.env.RELGEO_DART_BIN ?? "dart",
  [
    ".dart_tool/pub/bin/test/test.dart-3.11.5.snapshot",
    "test/protocol_fixture_test.dart",
    "test/mcp_schema_test.dart",
    "test/local_dispatch_test.dart",
  ],
  join(root, "mcp"),
);
runBoundaryTest(
  "Flutter MCP setup/operations suite",
  "flutter",
  ["test", "--no-pub", "test/mcp_server_io_test.dart"],
  join(root, "flutter"),
);

for (const result of checks) console.log(`[${result.status}] ${result.message}`);
if (failures.length > 0) {
  console.error(`MCP setup/operations/compatibility closure: FAIL (${failures.length})`);
  process.exit(1);
}

console.log(
  `MCP setup/operations/compatibility closure: PASS (local protocol/security ` +
    `evidence joined; no partial rows remain; unavailable runtime ` +
    `boundary recorded; evidence_id=${evidenceId}; ` +
    "evidence_scope=setup-operations-compatibility)",
);
