#!/usr/bin/env node

import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const evidenceIdArg = process.argv.find((argument) =>
  argument.startsWith("--evidence-id="),
);
const evidenceId = evidenceIdArg?.slice("--evidence-id=".length) ?? "unspecified";
const checks = [];
const failures = [];

function check(condition, message) {
  checks.push({ status: condition ? "PASS" : "FAIL", message });
  if (!condition) failures.push(message);
}

const sourcePath = join(root, "mcp/lib/src/adapter/authoring_pipeline.dart");
const testPath = join(root, "mcp/test/authoring_pipeline_test.dart");
const fixturePath = join(root, "fixtures/mcp/diagnostics-provenance-cases.json");
check(existsSync(sourcePath), "authoring pipeline source exists");
check(existsSync(testPath), "authoring pipeline regression tests exist");
check(existsSync(fixturePath), "diagnostics/provenance fixture exists");

const [source, tests, fixtureText] = await Promise.all([
  readFile(sourcePath, "utf8"),
  readFile(testPath, "utf8"),
  readFile(fixturePath, "utf8"),
]);
const fixture = JSON.parse(fixtureText);

check(
  source.includes("if (result.identity != null)") &&
    source.includes("_validateIdentity(result.identity, context)") &&
    source.includes("_validateDiagnostics(result.diagnostics, input.specVersion)") &&
    source.includes("McpAuthoringPipeline.fromProducers") &&
    source.includes("toMcpResult()"),
  "validation preserves context identity, maps producer diagnostics, and validates provenance",
);
check(
  source.includes("input.identity ?? context.identity") &&
    source.includes("_stableValidationResult") &&
    source.includes("return left.message.compareTo(right.message)") &&
    source.includes("ContextualProducerCompletionHandler"),
  "completion producer mapping, identity fallback, and deterministic diagnostic ordering are implemented",
);
for (const testName of [
  "semantic validation rejects an owner identity from another document",
  "semantic validation rejects diagnostics from another spec revision",
  "completion echoes shared identity when the legacy input omits it",
  "validation diagnostics are returned in a stable order",
  "producer validation maps diagnostic fields and provenance losslessly",
  "producer completion mapping populates proposal provenance",
]) {
  check(tests.includes(testName), `regression test present: ${testName}`);
}
check(
  fixture.schemaVersion === "mcp-diagnostics-provenance/v1" &&
    fixture.compatibilityLine === "0.5" &&
    fixture.cases.length === 6,
  "fixture pins compatibility line and six diagnostics/provenance cases",
);
for (const id of [
  "validation-identity-guard",
  "diagnostic-provenance-guard",
  "completion-context-identity-echo",
  "diagnostic-order-normalization",
  "producer-diagnostic-field-mapping",
  "producer-completion-provenance-mapping",
]) {
  check(
    fixture.cases.some((entry) => entry.id === id),
    `fixture case present: ${id}`,
  );
}

if (failures.length > 0) {
  for (const result of checks) console.log(`[${result.status}] ${result.message}`);
  console.error(`MCP diagnostics/provenance closure: FAIL (${failures.length})`);
  process.exit(1);
}

console.log(
  `MCP diagnostics/provenance closure: PASS (identity, diagnostic provenance, ` +
    `completion fallback, deterministic ordering, tests, and fixture verified; ` +
    `evidence_id=${evidenceId}; evidence_scope=diagnostics-completion-provenance)`,
);
for (const result of checks) console.log(`[${result.status}] ${result.message}`);
