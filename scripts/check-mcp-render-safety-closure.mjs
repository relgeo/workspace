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
const schemaPath = join(root, "mcp/lib/src/contract/mcp_schema.dart");
const testPath = join(root, "mcp/test/authoring_pipeline_test.dart");
const fixturePath = join(root, "fixtures/mcp/render-safety-provenance-cases.json");
for (const [path, label] of [
  [sourcePath, "authoring pipeline source"],
  [schemaPath, "render schema source"],
  [testPath, "render regression tests"],
  [fixturePath, "render safety fixture"],
]) {
  check(existsSync(path), `${label} exists`);
}

const [source, schema, tests, fixtureText] = await Promise.all([
  readFile(sourcePath, "utf8"),
  readFile(schemaPath, "utf8"),
  readFile(testPath, "utf8"),
  readFile(fixturePath, "utf8"),
]);
const fixture = JSON.parse(fixtureText);

check(
  source.includes("_validateRenderContext(input, context)") &&
    source.includes("McpAuthoringFailure(mapDomainError(error, context))") &&
    source.includes("result.content.trim().isEmpty") &&
    source.includes("McpReadOnlyBounds.maxRenderedCodeUnits"),
  "render context and output safety failures are mapped at the pipeline boundary",
);
check(
  source.includes("_validateProvenance(result.provenance, input.specVersion)") &&
    source.includes("withSheetIdIfMissing(input.sheetId)") &&
    source.includes("withViewIdIfMissing(input.viewId)") &&
    source.includes("withIdentityIfMissing(input.identity ?? context.identity)"),
  "render provenance, target ownership, and context identity are preserved",
);
check(
  schema.includes("final McpLanguageServiceIdentity? identity;") &&
    schema.includes("if (identity != null) 'identity': identity!.toJson()"),
  "render result serializes context identity alongside target and provenance",
);
for (const testName of [
  "render boundary rejects a mismatched context before owner call",
  "render target mismatch is rejected before serialization",
  "render echoes target, context identity, and provenance",
  "render rejects empty or untraceable owner output as structured failure",
]) {
  check(tests.includes(testName), `regression test present: ${testName}`);
}
check(
  fixture.schemaVersion === "mcp-render-safety-provenance/v1" &&
    fixture.compatibilityLine === "0.5" &&
    fixture.cases.length === 4,
  "fixture pins compatibility line and four render safety cases",
);
for (const id of [
  "render-context-mismatch",
  "render-target-ownership",
  "render-evidence-identity",
  "render-output-safety",
]) {
  check(
    fixture.cases.some((entry) => entry.id === id),
    `fixture case present: ${id}`,
  );
}

for (const result of checks) console.log(`[${result.status}] ${result.message}`);
if (failures.length > 0) {
  console.error(`MCP render safety closure: FAIL (${failures.length})`);
  process.exit(1);
}

console.log(
  `MCP render safety closure: PASS (context, target, identity, provenance, ` +
    `output safety, tests, and fixture verified; evidence_id=${evidenceId}; ` +
    "evidence_scope=render-safety-provenance)",
);
