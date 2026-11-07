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

const [catalogSource, documentStructure, typeSystem, metadata, parser, types, schema, completions, expectedCatalog, backlog, validator, evaluator, aliasParityTest, editorialGuide, manifestSource, objectModel, composition, collections, dimension, annotation] =
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
    readFile(join(root, "core/src/validator.ts"), "utf8"),
    readFile(join(root, "core/src/evaluator.ts"), "utf8"),
    readFile(join(root, "core/src/__tests__/resolver.test.ts"), "utf8"),
    readFile(join(root, "spec/id/editorial-guide.md"), "utf8"),
    readFile(join(root, "fixtures/manifest.json"), "utf8"),
    readFile(join(root, "spec/id/geometry/14-geometry-objects.md"), "utf8"),
    readFile(join(root, "spec/id/geometry/15-composition-objects.md"), "utf8"),
    readFile(join(root, "spec/id/geometry/16-collection-objects.md"), "utf8"),
    readFile(join(root, "spec/id/presentation/22-dimension.md"), "utf8"),
    readFile(join(root, "spec/id/presentation/23-annotation.md"), "utf8"),
  ]);
const catalog = JSON.parse(catalogSource);
const manifest = JSON.parse(manifestSource);
const objectSpec = [objectModel, composition, collections, dimension, annotation].join("\n");

check(catalog.catalogId === "relgeo-language-vocabulary-v0.5", "active v0.5 vocabulary catalog has a stable ID");
check(catalog.sourceOfTruth === "spec/id", "catalog names spec/id as the semantic source of truth");
check(catalog.catalogKind === "checked-projection", "catalog is explicitly a checked projection, not a second normative source");
check(expectedCatalog.includes(catalog.catalogId), "expected capability catalog references the active vocabulary catalog");
check(backlog.includes("pnpm run language-spec:check"), "implementation-gap backlog records the deterministic drift-check command");

const objectTypes = catalog.objectTypes ?? [];
check(objectTypes.length === 26 && new Set(objectTypes).size === objectTypes.length, "catalog has the complete unique v0.5 object-type vocabulary");
for (const objectType of objectTypes) {
  check(objectSpec.includes(`type: ${objectType}`) || objectSpec.includes(`\`${objectType}\``), `normative spec names object type ${objectType}`);
  check(parser.includes(`  ${objectType}: new Set(`), `core parser covers object type ${objectType}`);
  check(schema.includes(`"${objectType}"`), `language-service schema names object type ${objectType}`);
  check(completions.includes(`label: '${objectType}'`), `language-service completions contain object type ${objectType}`);
}
for (const [operation, fields] of Object.entries(catalog.geometryOperationFields ?? {})) {
  check(objectTypes.includes(operation), `catalog keeps geometry operation ${operation} inside object vocabulary`);
  check(fields.every((field) => parser.includes(`${operation}: new Set(["${fields.join('", "')}"])`) || parser.includes(`"${field}"`)), `core parser covers ${operation} operation fields`);
  check(completions.includes(`case '${operation}': return`) && fields.every((field) => completions.includes(`label: '${field}'`)), `language-service completions cover ${operation} operation fields`);
}

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

const structuredContract = catalog.structuredTypeContract ?? {};
for (const type of catalog.structuredTypes) {
  const contract = structuredContract[type];
  check(Boolean(contract?.shape), `structured type ${type} has a checked shape contract`);
  check(typeSystem.includes(`### ${type}`), `structured type ${type} is documented normatively`);
}
check(structuredContract.frame2d?.required?.join(",") === "point,angle", "frame2d contract requires point and angle");
check(structuredContract.bbox2d?.required?.join(",") === "minX,maxX,minY,maxY,width,height", "bbox2d contract requires the six world-space fields");
check(structuredContract.collection?.typeField === "collection", "collection contract fixes its runtime type tag");
check(structuredContract["path-ref"]?.shape === "non-empty-reference-string", "path-ref contract fixes a non-empty reference string");
check(typeSystem.includes("length * length` tidak sah"), "normative type spec rejects length multiplied by length");
check(typeSystem.includes("length / number` sah"), "normative type spec allows length divided by number");
check(typeSystem.includes("coercion implisit ke `string`"), "normative type spec bounds implicit string coercion");
check(
  validator.includes('case "frame2d"') && validator.includes('case "bbox2d"') && validator.includes('case "collection"') && validator.includes('case "path-ref"'),
  "core validator checks every structured type boundary",
);
check(evaluator.includes('result.type === "length" && factor.type === "length"'), "core evaluator rejects length multiplied by length");
check(evaluator.includes('result.type === "number" && factor.type === "length"'), "core evaluator rejects number divided by length");
check(evaluator.includes('result.type === "length" || term.type === "length"'), "core evaluator preserves contextual length addition semantics");
check(aliasParityTest.includes("semantically equivalent") && aliasParityTest.includes("metaPresets") && aliasParityTest.includes("styles"), "core regression test covers canonical and compatibility metadata aliases");
check(editorialGuide.includes("Label status adalah vocabulary editorial yang diperiksa"), "editorial guide makes status labels checked vocabulary");
check(/tidak\s+boleh memperkenalkan field, type, atau semantics/.test(editorialGuide), "editorial guide forbids informative docs from extending DSL vocabulary");
const structuredFixture = manifest.fixtures?.find((fixture) => fixture.id === "v05-invalid-structured-type");
check(structuredFixture?.coreContract?.code === "TYPE_MISMATCH", "conformance manifest registers the structured-type negative boundary");
check(structuredFixture?.coreContract?.path === "parameters.placementFrame.default.point", "structured-type fixture pins the diagnostic path");
for (const [name, values] of Object.entries(catalog.coercionContract ?? {})) {
  check(Array.isArray(values) && values.length > 0, `coercion contract ${name} is non-empty`);
}
check((catalog.coercionContract?.rejected ?? []).includes("length*length"), "coercion catalog retains the length*length negative boundary");
check((catalog.coercionContract?.rejected ?? []).includes("number/length"), "coercion catalog retains the number/length negative boundary");

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
