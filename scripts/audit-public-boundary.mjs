#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { readFile, readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { inspectPublicEntries, PUBLIC_BOUNDARY_CONTRACT } from "./public-boundary.mjs";

const root = process.cwd();
const reportPath = process.env.PUBLIC_BOUNDARY_REPORT ?? "docs/evidence/public-boundary-audit-2026-11-14.json";
const MACHINE_PATH = /(?:\/Users\/[^\s`"']+|\/home\/[^\s`"']+|[A-Za-z]:\\[^\s`"']+)/g;
const CREDENTIAL_MATERIAL = /-----BEGIN [A-Z ]*PRIVATE KEY-----|\b(?:ghp_|github_pat_|npm_[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|sk-[A-Za-z0-9]{20,})\b/;
const MAX_TEXT_BYTES = 4 * 1024 * 1024;

function git(args) {
  return execFileSync("git", args, { cwd: root, encoding: "utf8" });
}

function rel(file) {
  return relative(root, file).split(sep).join("/");
}

function trackedFiles() {
  return git(["ls-files", "-z"]).split("\0").filter(Boolean);
}

async function readText(relativePath) {
  const file = join(root, relativePath);
  const info = await stat(file);
  if (!info.isFile() || info.size > MAX_TEXT_BYTES) return null;
  const buffer = await readFile(file);
  if (buffer.includes(0)) return null;
  return buffer.toString("utf8");
}

async function walk(directory) {
  const entries = [];
  if (!existsSync(directory)) return entries;
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = join(directory, entry.name);
    if (entry.isDirectory()) entries.push(...await walk(file));
    else if (entry.isFile()) entries.push(file);
  }
  return entries;
}

function machineReferences(text) {
  return [...new Set((text.match(MACHINE_PATH) ?? []).map((value) => value.slice(0, 180)))];
}

async function scanFiles(paths, { artifact = false } = {}) {
  const pathAudit = inspectPublicEntries(paths);
  const credentialLeaks = [];
  const credentialTestFixtures = [];
  const machineSpecificReferences = [];
  let textFiles = 0;
  let skippedBinaryOrLarge = 0;

  for (const filePath of paths) {
    const text = await readText(filePath);
    if (text === null) {
      skippedBinaryOrLarge += 1;
      continue;
    }
    textFiles += 1;
    // The scanner source necessarily contains the detection patterns it is
    // looking for; treating those literals as shipped credentials makes the
    // audit fail on its own implementation rather than on public content.
    const isScannerSource = filePath === "scripts/audit-public-boundary.mjs";
    if (!isScannerSource && CREDENTIAL_MATERIAL.test(text)) {
      if (/(?:^|\/)(?:test-|fixtures\/|__tests__\/)|\.test\./.test(filePath)) credentialTestFixtures.push(filePath);
      else credentialLeaks.push(filePath);
    }
    const references = machineReferences(text);
    if (references.length > 0) {
      machineSpecificReferences.push({
        path: filePath,
        count: references.length,
        scope: artifact ? "public-artifact" : "source-or-evidence-reference",
      });
    }
  }

  return {
    entries: paths.length,
    textFiles,
    skippedBinaryOrLarge,
    pathViolations: pathAudit.violations,
    credentialMaterialFiles: credentialLeaks,
    credentialTestFixtures,
    machineSpecificReferences,
    passed: pathAudit.passed && credentialLeaks.length === 0,
  };
}

async function consumerAudit() {
  const files = [
    "package.json",
    "playground/package.json",
    "relgeo.github.io/package.json",
    "flutter/pubspec.yaml",
    "mcp/pubspec.yaml",
    ".github/workflows/integration.yml",
    ".github/workflows/sync-validated-submodule-after-ci.yml",
    "flutter/.github/workflows/flutter-ci.yml",
  ];
  const missing = files.filter((file) => !existsSync(join(root, file)));
  const publicManifests = ["playground/package.json", "relgeo.github.io/package.json"];
  const localSiblingDependencies = [];
  for (const file of publicManifests) {
    const text = await readText(file);
    if (text && /(?:file:|link:|workspace:|\.\.\/)/.test(text)) localSiblingDependencies.push(file);
  }
  const workflowFiles = [
    ...await walk(join(root, ".github/workflows")),
    ...await walk(join(root, "flutter/.github/workflows")),
    ...await walk(join(root, "mcp/.github/workflows")),
    ...await walk(join(root, "playground/.github/workflows")),
    ...await walk(join(root, "relgeo.github.io/.github/workflows")),
  ].map(rel).filter((file, index, all) => all.indexOf(file) === index);
  const workflowViolations = [];
  for (const file of workflowFiles) {
    const text = await readText(file);
    if (!text) continue;
    if (/persist-credentials:\s*true/i.test(text)) workflowViolations.push({ file, reason: "credential-persistence-enabled" });
    if (/permissions:\s*write-all/i.test(text)) workflowViolations.push({ file, reason: "unbounded-permissions" });
    if (/actions:\s*write/i.test(text)) workflowViolations.push({ file, reason: "actions-write-permission" });
  }
  return {
    requiredFiles: files,
    missingFiles: missing,
    publicManifestsChecked: publicManifests,
    localSiblingDependencies,
    workflowFiles,
    workflowViolations,
    passed: missing.length === 0 && workflowViolations.length === 0,
  };
}

async function main() {
  const tracked = trackedFiles();
  const trackedAudit = await scanFiles(tracked);
  const artifactCandidates = [
    "playground/dist",
    "playground/build",
    "relgeo.github.io/dist",
    "relgeo.github.io/build",
    "dist",
    "build",
    "public",
  ];
  const artifactRoots = artifactCandidates.filter((candidate) => existsSync(join(root, candidate)));
  const missingArtifactRoots = artifactCandidates.filter((candidate) => !artifactRoots.includes(candidate));
  const artifactFiles = [];
  for (const artifactRoot of artifactRoots) artifactFiles.push(...(await walk(join(root, artifactRoot))).map(rel));
  const artifactAudit = await scanFiles(artifactFiles, { artifact: true });
  const consumers = await consumerAudit();
  const rootRevision = git(["rev-parse", "HEAD"]).trim();
  const statusMatrix = await readText("docs/capability-map/cross-repository/status-matrix.md");
  const capabilityIds = ["ORCH-BOOT-004", "ORCH-PUB-001", "ORCH-PUB-002", "ORCH-PUB-003", "ORCH-PUB-004"];
  const capabilityMap = capabilityIds.map((id) => ({
    id,
    present: Boolean(statusMatrix?.includes(`\`${id}\``)),
    status: statusMatrix?.split("\n").find((line) => line.includes(`\`${id}\``))?.match(/\|\s*`([^`]+)`\s*\|/)?.[1] ?? "not-observed",
  }));
  const report = {
    schemaVersion: 1,
    recordType: "public-boundary-audit",
    contract: PUBLIC_BOUNDARY_CONTRACT,
    auditContract: "public-boundary-audit-v1",
    capturedAt: "2026-11-14",
    workspaceRevision: rootRevision,
    claimLimit: "This is local tracked-tree and available-artifact evidence; it is not proof of a deployed public runtime, registry consumer, or provider-side CI artifact.",
    trackedTree: trackedAudit,
    publicArtifacts: {
      candidateRoots: artifactCandidates,
      scannedRoots: artifactRoots,
      unavailableRoots: missingArtifactRoots,
      audit: artifactAudit,
      status: missingArtifactRoots.length === artifactCandidates.length ? "not-available-in-checkout" : "scanned-available-roots",
    },
    consumers,
    capabilityMap: {
      source: "docs/capability-map/cross-repository/status-matrix.md",
      records: capabilityMap,
    },
    disposition: {
      status: trackedAudit.passed && artifactAudit.passed && consumers.passed ? "pass-with-artifact-boundary" : "action-required",
      owner: "relgeo/workspace + affected consumer owners",
      remediation: missingArtifactRoots.length > 0
        ? "Build public consumer artifacts on the declared Node 24/CI boundary, then rerun this audit against those exact output roots."
        : "Remove every reported path or credential-material violation before promotion.",
    },
  };
  await (await import("node:fs/promises")).writeFile(join(root, reportPath), JSON.stringify(report, null, 2) + "\n");
  console.log(JSON.stringify({
    contract: report.auditContract,
    status: report.disposition.status,
    trackedEntries: tracked.length,
    trackedPassed: trackedAudit.passed,
    artifactRootsScanned: artifactRoots.length,
    artifactRootsUnavailable: missingArtifactRoots.length,
    consumerPassed: consumers.passed,
    workflowViolations: consumers.workflowViolations.length,
    reportPath,
  }));
  if (!trackedAudit.passed || !artifactAudit.passed || !consumers.passed) process.exitCode = 1;
}

await main();
