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
const rootPackage = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const bootstrapSource = fs.readFileSync(path.join(root, "scripts", "bootstrap.mjs"), "utf8");
assert.equal(rootPackage.engines.node, ">=24");
assert.equal(rootPackage.packageManager, "pnpm@10.33.3");
assert.match(fs.readFileSync(path.join(root, ".node-version"), "utf8"), /^24\./);
assert.match(bootstrapSource, /git\", \[\"submodule\", \"update\", \"--init\", \"--recursive\"\]/);
assert.match(bootstrapSource, /pnpm\", \[\"install\", \"--frozen-lockfile\"\]/);
assert.match(bootstrapSource, /env: \{ CI: \"true\" \}/);
assert.match(bootstrapSource, /scripts\/verify-baseline\.mjs/);
assert.match(bootstrapSource, /process\.versions\.node === requiredNodeVersion/);
assert.match(bootstrapSource, /gitlinkRevision/);
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "relgeo-bootstrap-contract-"));
const reportPath = path.join(tempRoot, "bootstrap.json");

const bootstrap = spawnSync(process.execPath, [
  path.join(root, "scripts", "bootstrap.mjs"),
  "--skip-submodules",
  "--skip-install",
  `--report=${reportPath}`,
], { cwd: tempRoot, encoding: "utf8" });
assert.ok([0, 1, 2].includes(bootstrap.status));
const reportText = fs.readFileSync(reportPath, "utf8");
const report = JSON.parse(reportText);
assert.equal(report.contract, "fresh-clone-bootstrap-v1");
assert.deepEqual(report.workspaceBoundary.requiredFiles, ["package.json", "pnpm-lock.yaml", ".gitmodules", ".node-version"]);
assert.deepEqual(report.workspaceBoundary.missingFiles, []);
assert.equal(report.workspaceBoundary.siblingSource, false);
assert.ok(report.steps.some((step) => step.id === "toolchain: node"));
assert.ok(report.steps.some((step) => step.id === "toolchain: pnpm"));
assert.ok(Array.isArray(report.submodules));
assert.ok(report.submodules.every((entry) => "gitlinkRevision" in entry && "matchesGitlink" in entry && "dirty" in entry));
assert.ok(Array.isArray(report.steps));
assert.deepEqual(report.requiredToolchain, { node: "24.21.0", pnpm: "10.33.3" });
assert.equal(report.toolchainContract.exactNodeVersion, "24.21.0");
assert.equal(report.toolchainContract.exactPnpmVersion, "10.33.3");
assert.ok(report.evidence.testedRevisions);
assert.equal(report.publicBoundary.contract, "public-boundary-v1");
assert.equal(report.publicBoundary.passed, true);
assert.equal(report.publicBoundary.violations.length, 0);
assert.ok(!reportText.includes(root));
assert.ok(!reportText.includes(tempRoot));
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
