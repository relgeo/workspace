#!/usr/bin/env node

import { readdir, readFile } from "node:fs/promises";
import { join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const catalogPath = join(
  root,
  "docs/capability-map/language-specification/normative-vocabulary-catalog.json",
);
const failures = [];

function check(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
  } else {
    failures.push(message);
    console.log(`[FAIL] ${message}`);
  }
}

function quotedValues(source) {
  return [...source.matchAll(/"([^"\n]+)"/g)].map((match) => match[1]);
}

function setDifference(expected, observed) {
  return [...new Set(expected)].filter((value) => !observed.has(value));
}

function sequenceDifference(expected, observed) {
  if (expected.length === observed.length && expected.every((value, index) => value === observed[index])) {
    return "";
  }
  return `expected [${expected.join(", ")}] but observed [${observed.join(", ")}]`;
}

function extractSet(source, startMarker, endMarker = "]);", offset = 0) {
  const start = source.indexOf(startMarker, offset);
  if (start < 0) return new Set();
  const end = source.indexOf(endMarker, start);
  return new Set(quotedValues(source.slice(start, end < 0 ? source.length : end)));
}

function expectedStatus(path) {
  const normalized = relative(join(root, "spec/id"), path);
  if (normalized === "README.md") return "Informative Index";
  if (normalized === "editorial-guide.md") return "Informative";
  if (normalized.endsWith("/README.md")) return "Informative Index";
  if (normalized === "appendix/27-summary.md") return "Informative";
  return "Normative";
}

const [catalogSource, documentStructure, typeSystem, metadata, parser, types, schema, completions, expectedCatalog, backlog] =
  await Promise.all([
    readFile(catalogPath, "utf8"),
    readFile(join(root, "spec/id/core/02-document-structure.md"), "utf8"),
    readFile(join(root, "spec/id/syntax/07-type-system.md"), "utf8"),
    readFile(join(root, "spec/id/presentation/26-metadata.md"), "utf8"),
    readFile(join(root, "core/src/parser.ts"), "utf8"),
    readFile(join(root, "core/src/types.ts"), "utf8"),
    readFile(join(root, "language-service/src/schema.ts"), "utf8"),
    readFile(join(root, "language-service/src/completions.ts"), "utf8"),
    readFile(join(root, "docs/capability-map/language-specification/expected-capability-catalog.md"), "utf8"),
    readFile(join(root, "docs/capability-map/language-specification/implementation-gap-backlog.md"), "utf8"),
  ]);
const catalog = JSON.parse(catalogSource);

check(catalog.catalogId === "relgeo-language-vocabulary-v0.5", "active v0.5 vocabulary catalog has a stable ID");
check(catalog.sourceOfTruth === "spec/id", "catalog names spec/id as the semantic source of truth");
check(catalog.catalogKind === "checked-projection", "catalog is explicitly a checked projection, not a second normative source");
check(expectedCatalog.includes(catalog.catalogId), "expected capability catalog references the active vocabulary catalog");
check(backlog.includes("pnpm run language-spec:check"), "implementation-gap backlog records the deterministic drift-check command");

const rootCodeBlock = documentStructure.match(/```rg\n([\s\S]*?)```/)?.[1] ?? "";
const observedRootFields = [...rootCodeBlock.matchAll(/^([A-Za-z][A-Za-z0-9]*):(?:\s.*)?$/gm)].map((match) => match[1]);
const normativeRootFields = new Set(catalog.rootFields);
const observedParserRootFields = extractSet(parser, "const TOP_LEVEL_FIELDS = new Set([");
const schemaRootStart = schema.indexOf('"properties": {');
const schemaRootEnd = schema.indexOf('\n  "definitions": {', schemaRootStart);
const observedSchemaRootFields = new Set(
  [...schema.slice(schemaRootStart, schemaRootEnd).matchAll(/^    "([^"\n]+)":\s*\{/gm)].map((match) => match[1]),
);

check(
  !sequenceDifference(catalog.rootFields, observedRootFields),
  `normative root sections match spec/id/core/02-document-structure.md${sequenceDifference(catalog.rootFields, observedRootFields) ? `; ${sequenceDifference(catalog.rootFields, observedRootFields)}` : ""}`,
);
for (const [observed, label] of [
  [observedParserRootFields, "core parser"],
  [observedSchemaRootFields, "language-service schema"],
]) {
  const missing = setDifference([...normativeRootFields, ...catalog.rootAliases], observed);
  check(missing.length === 0, `${label} covers catalog root fields${missing.length ? `; missing: ${missing.join(", ")}` : ""}`);
}
for (const field of [...catalog.rootFields, ...catalog.rootAliases]) {
  check(completions.includes(`label: '${field}'`), `language-service completions contain root vocabulary ${field}`);
}

const typeSystemBody = typeSystem.slice(typeSystem.indexOf("## 7.1"), typeSystem.indexOf("## 7.3"));
const observedTypes = [...typeSystemBody.matchAll(/^### ([A-Za-z][A-Za-z0-9-]*)\s*$/gm)]
  .map((match) => match[1])
  .filter((value) => value !== "ClosedShape");
const normativeTypes = [...catalog.scalarTypes, ...catalog.structuredTypes];
const parameterTypeBody = types.slice(types.indexOf("export type ParameterType ="), types.indexOf("export interface ParameterDef"));
const observedCoreTypes = new Set(quotedValues(parameterTypeBody));
const observedSchemaTypes = new Set(quotedValues(schema.match(/"type": \{ "enum": \[([^\]]+)\] \}/)?.[1] ?? ""));

check(
  !sequenceDifference(normativeTypes, observedTypes),
  `scalar and structured type headings match spec/id/syntax/07-type-system.md${sequenceDifference(normativeTypes, observedTypes) ? `; ${sequenceDifference(normativeTypes, observedTypes)}` : ""}`,
);
check(
  setDifference(normativeTypes, observedCoreTypes).length === 0,
  `core parameter types cover the catalog${setDifference(normativeTypes, observedCoreTypes).length ? `; missing: ${setDifference(normativeTypes, observedCoreTypes).join(", ")}` : ""}`,
);
check(
  setDifference(normativeTypes, observedSchemaTypes).length === 0,
  `language-service parameter schema covers the catalog${setDifference(normativeTypes, observedSchemaTypes).length ? `; missing: ${setDifference(normativeTypes, observedSchemaTypes).join(", ")}` : ""}`,
);

for (const { alias, canonical } of catalog.aliases) {
  check(parser.includes(`"${alias}"`), `core parser contains compatibility alias ${alias} for ${canonical}`);
  check(schema.includes(`"${alias}"`), `language-service schema contains compatibility alias ${alias} for ${canonical}`);
  check(completions.includes(`label: '${alias}'`), `language-service completions contain compatibility alias ${alias}`);
}
check(
  metadata.includes("`styles` / `style` boleh tetap diterima sebagai alias backward compatibility"),
  "normative metadata spec documents the styles/style compatibility aliases",
);

const specRoot = join(root, "spec/id");
const documents = [];
for (const section of ["core", "syntax", "geometry", "presentation", "appendix"]) {
  for (const name of await readdir(join(specRoot, section))) {
    if (name.endsWith(".md")) documents.push(join(specRoot, section, name));
  }
}
documents.push(join(specRoot, "README.md"), join(specRoot, "editorial-guide.md"));
const allowedStatuses = new Set([...catalog.statusLabels.normative, ...catalog.statusLabels.informative]);
for (const path of documents.sort()) {
  const source = await readFile(path, "utf8");
  const status = source.match(/^Status dokumen:\s*`([^`]+)`/m)?.[1];
  check(allowedStatuses.has(status), `${relative(root, path)} declares a recognized status`);
  check(status === expectedStatus(path), `${relative(root, path)} uses the catalog status classification (${expectedStatus(path)})`);
}

if (failures.length > 0) {
  console.error(`\n${failures.length} language-specification vocabulary checks failed.`);
  process.exitCode = 1;
} else {
  console.log(`\nLanguage-specification vocabulary checks passed (${documents.length} spec documents checked).`);
}
