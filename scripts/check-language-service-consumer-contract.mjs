#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const failures = [];
const checks = [];

async function read(relativePath) {
  return readFile(resolve(root, relativePath), "utf8");
}

async function readJson(relativePath) {
  return JSON.parse(await read(relativePath));
}

function check(condition, message) {
  checks.push({ status: condition ? "PASS" : "FAIL", message });
  if (!condition) failures.push(message);
}

function has(text, pattern, message) {
  check(pattern.test(text), message);
}

const protocol = await read("language-service/src/protocol.ts");
const service = await read("language-service/src/service.ts");
const playgroundTypes = await read("playground/src/types.ts");
const playgroundWorker = await read("playground/src/worker.ts");
const playgroundLifecycle = await read("playground/src/worker-lifecycle.ts");
const highlighter = await read("remark-relgeo-hl/src/index.ts");
const highlighterRender = await read("remark-relgeo-hl/src/render.ts");
const preview = await read("remark-relgeo/src/index.ts");
const cli = await read("cli/src/index.ts");
const coreDiagnostics = await read("core/src/diagnostics.ts");
const mcpSchema = await read("mcp/lib/src/contract/mcp_schema.dart");
const mcpDispatch = await read("mcp/lib/src/adapter/local_dispatch.dart");
const fixtureManifest = await readJson("fixtures/manifest.json");
const fixture = await readJson("fixtures/expected/language-service-protocol.v0.5.json");

has(protocol, /LANGUAGE_SERVICE_PROTOCOL_VERSION\s*=\s*['\"]0\.2['\"]/, "Language Service protocol version is 0.2");
has(protocol, /POSITION_ENCODING\s*=\s*['\"]utf-16['\"]/, "Language Service position encoding is UTF-16");
for (const field of ["documentId", "version", "requestId", "sourceRevision", "provenance"]) {
  has(protocol, new RegExp("\\b" + field + "\\b"), "Language Service protocol exposes " + field);
}
for (const resultKind of ["schema", "tokens", "diagnostics", "validation", "completion", "hover", "metadata", "navigation", "analysis"]) {
  has(protocol, new RegExp("['\"]" + resultKind + "['\"]"), "Language Service protocol exposes " + resultKind + " result family");
}
has(service, /getDiagnostics\(/, "Language Service retains the diagnostic producer");
has(service, /provenance/, "Language Service diagnostic projection preserves provenance");

for (const field of ["documentId", "version", "requestId"]) {
  has(playgroundTypes, new RegExp("\\b" + field + ":"), "Playground worker identity carries " + field);
  has(playgroundWorker, new RegExp("\\b" + field + "\\b"), "Playground worker serializes " + field);
}
for (const field of ["readiness", "recoveryState", "analysis"]) {
  has(playgroundTypes, new RegExp("\\b" + field + ":"), "Playground worker response carries " + field);
}
for (const field of ["sourceRevision", "provenance"]) {
  has(playgroundWorker, new RegExp("\\b" + field + "\\b"), "Playground worker forwards " + field);
}
for (const pattern of [/sameIdentity/, /timeout/, /cancelCurrent/, /onmessageerror/, /terminate\(\)/]) {
  check(pattern.test(playgroundLifecycle), "Playground lifecycle boundary covers " + pattern.source);
}

has(highlighter, /getSemanticTokens/, "Markdown highlighter consumes the stable semantic-token API");
has(highlighter, /failurePolicy/, "Markdown highlighter owns tolerant/strict service-failure behavior");
has(highlighterRender, /token\.start|token\.end/, "Markdown highlighter preserves token source ranges");
check(!highlighter.includes("from '../language-service"), "Markdown highlighter has no relative sibling Language Service import");
check(!preview.includes("from '../language-service"), "Markdown preview has no relative sibling Language Service import");

const cliManifest = await readJson("cli/package.json");
check(!Object.hasOwn(cliManifest.dependencies ?? {}, "@relgeo/language-service"), "CLI does not claim a direct Language Service dependency");
has(cli, /@relgeo\/core/, "CLI remains explicitly a Core consumer");
has(coreDiagnostics, /phase|code|path/, "Core diagnostic authority exposes structured fields consumed by adapters");

for (const field of ["relGeoLanguageServiceProtocolVersion", "relGeoPositionEncoding", "documentId", "requestId", "sourceRevision"]) {
  has(mcpSchema, new RegExp(field), "MCP schema mirrors " + field);
}
for (const guard of ["_guardLanguageServiceIdentity", "_guardProvenance"]) {
  has(mcpDispatch, new RegExp(guard), "MCP dispatch enforces " + guard);
}

check(fixture.schema === "relgeo.language-service-result", "Canonical Language Service fixture declares the result schema");
check(fixture.protocolVersion === "0.2", "Canonical Language Service fixture pins protocol 0.2");
check(fixture.specVersion === "0.5", "Canonical Language Service fixture pins spec 0.5");
check(fixture.positionEncoding === "utf-16", "Canonical Language Service fixture pins UTF-16 positions");
for (const field of ["documentId", "version", "requestId"]) {
  check(Object.hasOwn(fixture.identity, field), "Canonical fixture identity includes " + field);
}
check(fixture.diagnostic.provenance?.[0]?.source === "core", "Canonical fixture records Core diagnostic provenance");
check(fixture.consumerDisposition.staleWhen?.length === 3, "Canonical fixture records all three stale-result guards");
check(fixtureManifest.languageServiceProtocolFixture?.path === "expected/language-service-protocol.v0.5.json", "Fixture manifest points to the canonical Language Service protocol fixture");
check(fixtureManifest.languageServiceProtocolFixture?.schema === fixture.schema, "Fixture manifest and protocol fixture agree on schema");
check(fixtureManifest.languageServiceProtocolFixture?.protocolVersion === fixture.protocolVersion, "Fixture manifest and protocol fixture agree on protocol version");
check(fixtureManifest.languageServiceProtocolFixture?.positionEncoding === fixture.positionEncoding, "Fixture manifest and protocol fixture agree on position encoding");

const nodeConsumerManifests = [
  "cli/package.json",
  "playground/package.json",
  "remark-relgeo/package.json",
  "remark-relgeo-hl/package.json",
  "relgeo.github.io/package.json",
];
for (const manifestPath of nodeConsumerManifests) {
  const manifest = await readJson(manifestPath);
  for (const section of ["dependencies", "devDependencies", "peerDependencies"]) {
    for (const [name, value] of Object.entries(manifest[section] ?? {})) {
      check(typeof value !== "string" || !value.startsWith("../"), manifestPath + ": " + section + "." + name + " uses a package version, not an unauthorized relative sibling dependency");
    }
  }
}

for (const result of checks) console.log(result.status + " " + result.message);
if (failures.length > 0) {
  console.error("Language Service consumer contract failed: " + failures.length + " check(s).");
  process.exitCode = 1;
} else {
  console.log("Language Service consumer contract passed: " + checks.length + " checks.");
}
