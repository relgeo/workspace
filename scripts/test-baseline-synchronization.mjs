#!/usr/bin/env node

import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceManifest = path.join(root, "docs", "integration-baseline.json");
const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), "relgeo-baseline-sync-"));
const mutatedManifest = path.join(temporaryRoot, "integration-baseline.json");
const mutatedMatrix = path.join(temporaryRoot, "compatibility-matrix.json");

try {
  const current = spawnSync(process.execPath, ["scripts/check-baseline-synchronization.mjs", "--json"], { cwd: root, encoding: "utf8" });
  assert.equal(current.status, 0, current.stderr || current.stdout);
  const currentReport = JSON.parse(current.stdout);
  assert.equal(currentReport.contract, "baseline-synchronization-v1");
  assert.equal(currentReport.ok, true);
  assert.equal(currentReport.promotion.eligible, true);
  assert.equal(currentReport.summary.failed, 0);
  assert.equal(currentReport.provenance.childRevisions.mcp.length, 40);
  assert.equal(currentReport.recursiveSubmoduleStatus.length, 12);

  const mutated = JSON.parse(fs.readFileSync(sourceManifest, "utf8"));
  mutated.submodules[0].revision = (mutated.submodules[0].revision[0] === "0" ? "1" : "0") + mutated.submodules[0].revision.slice(1);
  fs.writeFileSync(mutatedManifest, JSON.stringify(mutated, null, 2) + "\n");
  const failure = spawnSync(process.execPath, ["scripts/check-baseline-synchronization.mjs", `--baseline=${mutatedManifest}`, "--json"], { cwd: root, encoding: "utf8" });
  assert.notEqual(failure.status, 0);
  const failureReport = JSON.parse(failure.stdout);
  assert.equal(failureReport.ok, false);
  assert.equal(failureReport.promotion.eligible, false);
  assert.ok(failureReport.failures.some((entry) => entry.id === `${mutated.submodules[0].path}: baseline revision matches gitlink`));

  const matrix = JSON.parse(fs.readFileSync(path.join(root, "docs", "compatibility-matrix.json"), "utf8"));
  matrix.compatibilityLine = "0.6";
  fs.writeFileSync(mutatedMatrix, JSON.stringify(matrix, null, 2) + "\n");
  const matrixFailure = spawnSync(process.execPath, ["scripts/check-baseline-synchronization.mjs", `--matrix=${mutatedMatrix}`, "--json"], { cwd: root, encoding: "utf8" });
  assert.notEqual(matrixFailure.status, 0);
  const matrixReport = JSON.parse(matrixFailure.stdout);
  assert.ok(matrixReport.failures.some((entry) => entry.id === "baseline: compatibility line"));
  console.log("Baseline synchronization contract tests passed.");
} finally {
  fs.rmSync(temporaryRoot, { recursive: true, force: true });
}
