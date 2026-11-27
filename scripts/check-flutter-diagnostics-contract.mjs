#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(new URL("..", import.meta.url).pathname);
const manifest = JSON.parse(
  readFileSync(resolve(root, "fixtures/manifest.json"), "utf8"),
);
const contract = JSON.parse(
  readFileSync(resolve(root, "fixtures/diagnostics/flutter-import-contract.json"), "utf8"),
);
const failures = [];

function check(condition, message) {
  if (!condition) failures.push(message);
}

const contractMeta = manifest.flutterImportDiagnosticContract;
check(contractMeta?.path === "diagnostics/flutter-import-contract.json", "manifest diagnostic contract path is not canonical");
check(contract.schema === "relgeo.flutter-import-diagnostics", "diagnostic contract schema is invalid");
check(contract.schemaVersion === 1, "diagnostic contract schema version is invalid");
check(contract.compatibilityLine === manifest.compatibilityLine, "diagnostic contract compatibility line drifted");
check(contract.contractRevision === "mcp-contract-2026-11-12-r2", "diagnostic contract revision is not current");
check(contractMeta?.contractRevision === contract.contractRevision, "manifest and diagnostic contract revisions differ");
check(contract.provenance?.source === "spec", "diagnostic contract provenance is not normative spec provenance");
check(typeof contract.provenance?.revision === "string" && contract.provenance.revision.length > 0, "diagnostic contract provenance revision is missing");

const cases = contract.cases ?? [];
const caseIds = cases.map((item) => item.id);
check(cases.length === 4, "diagnostic contract must contain four boundary cases");
check(new Set(caseIds).size === caseIds.length, "diagnostic contract case IDs are duplicated");
for (const item of cases) {
  check(typeof item.id === "string" && item.id.length > 0, "diagnostic contract case has no ID");
  if (item.fixture) {
    check(
      manifest.fixtures.some((fixture) => fixture.path === item.fixture),
      `${item.id}: fixture is not listed in the canonical manifest`,
    );
  }
  for (const field of ["code", "phase", "path", "origin"]) {
    check(typeof item.expected?.[field] === "string", `${item.id}: expected ${field} is missing`);
  }
}

for (const fixtureId of [
  "v05-boolean-intersection-candidate",
  "v05-evaluator-units-candidate",
]) {
  const fixture = manifest.fixtures.find((item) => item.id === fixtureId);
  check(fixture?.status === "active", `${fixtureId}: promotion status is not active`);
  check(fixture?.surfaces?.includes("flutter"), `${fixtureId}: Flutter is not a promoted surface`);
}
const collectionFixture = manifest.fixtures.find(
  (item) => item.id === "v05-collection-boolean-contract",
);
check(collectionFixture?.status === "active", "fixture 24 must remain an active workspace fixture");
check(!collectionFixture?.surfaces?.includes("flutter"), "fixture 24 must not be promoted to Flutter");

if (failures.length > 0) {
  for (const failure of failures) console.error(`[FAIL] ${failure}`);
  process.exit(1);
}

console.log("Flutter diagnostics contract evidence check passed: schema, provenance, cases, and promotion boundaries are joined.");
console.log("promotion boundary: fixtures=15,16 surface=flutter; fixture=24 surface=not-promoted");
console.log(`contract revision: ${contract.contractRevision}`);
