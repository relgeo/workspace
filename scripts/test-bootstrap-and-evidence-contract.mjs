#!/usr/bin/env node

import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import {
  assessEvidenceFreshness,
  createEvidenceEnvelope,
  EVIDENCE_CLASSES,
  EVIDENCE_STATES,
} from "./orchestration-contract.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "relgeo-bootstrap-contract-"));
const reportPath = path.join(tempRoot, "bootstrap.json");

const bootstrap = spawnSync(process.execPath, [
  path.join(root, "scripts", "bootstrap.mjs"),
  "--skip-submodules",
  "--skip-install",
  `--report=${reportPath}`,
], { cwd: root, encoding: "utf8" });
assert.ok([0, 1, 2].includes(bootstrap.status));
const reportText = fs.readFileSync(reportPath, "utf8");
const report = JSON.parse(reportText);
assert.equal(report.contract, "fresh-clone-bootstrap-v1");
assert.ok(Array.isArray(report.submodules));
assert.ok(Array.isArray(report.steps));
assert.ok(report.evidence.testedRevisions);
assert.equal(report.publicBoundary.contract, "public-boundary-v1");
assert.equal(report.publicBoundary.passed, true);
assert.equal(report.publicBoundary.violations.length, 0);
assert.ok(!reportText.includes(root));
assert.ok(!reportText.includes("PRIVATE_KEY"));
assert.ok(!reportText.includes("ACCESS_TOKEN"));

const envelope = createEvidenceEnvelope({
  evidenceClass: "ci-canonical",
  evidenceState: "current",
  workspaceRevision: "root-1",
  baselineName: "baseline-1",
  childRevisions: { core: "child-1" },
  limitations: ["browser unavailable"],
});
assert.ok(EVIDENCE_CLASSES.includes(envelope.evidenceClass));
assert.ok(EVIDENCE_STATES.includes(envelope.evidenceState));
assert.equal(envelope.testedRevisions.children.core, "child-1");
assert.deepEqual(
  assessEvidenceFreshness({
    evidence: envelope,
    workspaceRevision: "root-1",
    baselineName: "baseline-1",
    childRevisions: { core: "child-1" },
  }),
  { current: true, reasons: [] },
);
assert.deepEqual(
  assessEvidenceFreshness({ evidence: { ...envelope, evidenceState: "historical" }, workspaceRevision: "root-1" }).current,
  false,
);
assert.deepEqual(
  assessEvidenceFreshness({ evidence: envelope, workspaceRevision: "root-2" }).reasons,
  ["root-revision-mismatch"],
);

fs.rmSync(tempRoot, { recursive: true, force: true });
console.log("Bootstrap and evidence contract tests passed.");
