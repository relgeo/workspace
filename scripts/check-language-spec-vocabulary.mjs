#!/usr/bin/env node

import { readdir, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
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
  return [...expected].filter((value) => !observed.has(value));
}

function extractSet(source, startMarker, endMarker = "]);", offset = 0) {
  const start = source.indexOf(startMarker, offset);
  if (start < 0) return new Set();
  const end = source.indexOf(endMarker, start);
  return new Set(quotedValues(source.slice(start, end < 0 ? source.length : end)));
}

const [documentStructure, typeSystem, metadata, parser, types, schema, completions] = await Promise.all([
  readFile(join(root, "spec/id/core/02-document-structure.md"), "utf8"),
  readFile(join(root, "spec/id/syntax/07-type-system.md"), "utf8"),
  readFile(join(root, "spec/id/presentation/26-metadata.md"), "utf8"),
  readFile(join(root, "core/src/parser.ts"), "utf8"),
  readFile(join(root, "core/src/types.ts"), "utf8"),
  readFile(join(root, "language-service/src/schema.ts"), "utf8"),
  readFile(join(root, "language-service/src/completions.ts"), "utf8"),
]);

const rootCodeBlock = documentStructure.match(/```rg\n([\s\S]*?)```/)?.[1] ?? "";
const normativeRootFields = new Set(
  [...rootCodeBlock.matchAll(/^([A-Za-z][A-Za-z0-9]*):\s*$/gm)].map((match) => match[1]),
);
// `styles`/`style` are the documented backward-compatibility aliases.
normativeRootFields.add("styles");

const parserRootFields = extractSet(parser, "const TOP_LEVEL_FIELDS = new Set([");
const schemaRootStart = schema.indexOf('"properties": {');
const schemaRootEnd = schema.indexOf('\n  "definitions": {', schemaRootStart);
const schemaRootFields = new Set(
  [...schema.slice(schemaRootStart, schemaRootEnd).matchAll(/^    "([^"\n]+)":\s*\{/gm)].map((match) => match[1]),
);

check(
  setDifference(normativeRootFields, parserRootFields).length === 0,
  `core parser covers normative root sections${setDifference(normativeRootFields, parserRootFields).length ? `; missing: ${setDifference(normativeRootFields, parserRootFields).join(", ")}` : ""}`,
);
check(
  setDifference(normativeRootFields, schemaRootFields).length === 0,
  `language-service schema covers normative root sections${setDifference(normativeRootFields, schemaRootFields).length ? `; missing: ${setDifference(normativeRootFields, schemaRootFields).join(", ")}` : ""}`,
);

const typeSystemBody = typeSystem.slice(typeSystem.indexOf("## 7.1"), typeSystem.indexOf("## 7.3"));
const normativeParameterTypes = new Set(
  [...typeSystemBody.matchAll(/^### ([A-Za-z][A-Za-z0-9-]*)\s*$/gm)]
    .map((match) => match[1])
    .filter((value) => value !== "ClosedShape"),
);
const parameterTypeBody = types.slice(types.indexOf("export type ParameterType ="), types.indexOf("export interface ParameterDef"));
const coreParameterTypes = new Set(quotedValues(parameterTypeBody));
const schemaParameterTypes = new Set(quotedValues(schema.match(/"type": \{ "enum": \[([^\]]+)\] \}/)?.[1] ?? ""));

check(
  setDifference(normativeParameterTypes, coreParameterTypes).length === 0,
  `core parameter types cover spec scalar/structured types${setDifference(normativeParameterTypes, coreParameterTypes).length ? `; missing: ${setDifference(normativeParameterTypes, coreParameterTypes).join(", ")}` : ""}`,
);
check(
  setDifference(normativeParameterTypes, schemaParameterTypes).length === 0,
  `language-service parameter schema covers spec scalar/structured types${setDifference(normativeParameterTypes, schemaParameterTypes).length ? `; missing: ${setDifference(normativeParameterTypes, schemaParameterTypes).join(", ")}` : ""}`,
);

const requiredAliases = ["metaPresets", "metaPreset", "styles", "style"];
for (const alias of requiredAliases) {
  check(parser.includes(`"${alias}"`), `core parser contains metadata alias ${alias}`);
  check(schema.includes(`"${alias}"`), `language-service schema contains metadata alias ${alias}`);
  check(completions.includes(`label: '${alias}'`), `language-service completions contain metadata alias ${alias}`);
}

check(
  metadata.includes("`styles` / `style` boleh tetap diterima sebagai alias backward compatibility"),
  "normative metadata spec documents styles/style compatibility aliases",
);

const specRoot = join(root, "spec/id");
const documents = [];
for (const section of ["core", "syntax", "geometry", "presentation", "appendix"]) {
  for (const name of await readdir(join(specRoot, section))) {
    if (name.endsWith(".md")) documents.push(join(specRoot, section, name));
  }
}
documents.push(join(specRoot, "README.md"), join(specRoot, "editorial-guide.md"));
const statuses = new Set(["Normative", "Informative", "Informative Index"]);
for (const path of documents) {
  const source = await readFile(path, "utf8");
  const status = source.match(/^Status dokumen:\s*`([^`]+)`/m)?.[1];
  check(statuses.has(status), `${path.replace(`${root}/`, "")} declares a recognized normative/informative status`);
}

if (failures.length > 0) {
  console.error(`\n${failures.length} language-specification vocabulary checks failed.`);
  process.exitCode = 1;
} else {
  console.log(`\nLanguage-specification vocabulary checks passed (${documents.length} spec documents checked).`);
}
