#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import {
  assessEvidenceFreshness,
  createEvidenceEnvelope,
} from "./orchestration-contract.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function option(name, fallback = null) {
  const prefix = `--${name}=`;
  const argument = process.argv.find((value) => value.startsWith(prefix));
  return argument ? argument.slice(prefix.length) : fallback;
}

function options(name) {
  const prefix = `--${name}=`;
  return process.argv.filter((value) => value.startsWith(prefix)).map((value) => value.slice(prefix.length));
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function rootRevision() {
  try {
    return execFileSync("git", ["rev-parse", "HEAD"], {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return "unknown";
  }
}

function currentChildRevisions() {
  return Object.fromEntries((baseline.submodules ?? []).map((entry) => {
    try {
      const line = execFileSync("git", ["ls-tree", "HEAD", entry.path], {
        cwd: root,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      }).trim();
      return [entry.path, line.split(/\s+/)[2] ?? entry.revision];
    } catch {
      return [entry.path, entry.revision];
    }
  }));
}

function relativeCommand(command, args = []) {
  const safeCommand = command === process.execPath || /(?:^|\/)node$/.test(command) ? "node" : command;
  return [safeCommand, ...args].join(" ");
}

const reportArgument = option("report");
const outputPath = path.resolve(root, option("output", ".local/integration-joined-evidence.json"));
const evidenceState = option("evidence-state", "current");
const evidenceClass = option("evidence-class", null);
const runId = option("run-id");
const runUrl = option("run-url");
const artifactId = option("artifact-id");
const artifactUrl = option("artifact-url");
const artifactPath = option("artifact-path");
const currentRootRevision = option("current-root-revision");
const currentBaselineName = option("current-baseline-name");
const currentChildren = Object.fromEntries(
  options("current-child").map((value) => value.split(":", 2)).filter(([name, revision]) => name && revision),
);

if (!reportArgument) {
  console.error("Usage: node scripts/join-integration-evidence.mjs --report=PATH [--output=PATH] [metadata]");
  process.exit(2);
}

const reportPath = path.resolve(root, reportArgument);
const baseline = readJson(path.join(root, "docs", "integration-baseline.json"));
const currentClaimChildren = Object.keys(currentChildren).length > 0
  ? currentChildren
  : currentChildRevisions();
const sourceReport = fs.existsSync(reportPath) ? readJson(reportPath) : null;
const limitations = [];
if (!sourceReport) limitations.push("source integration report unavailable");

const sourceEvidence = sourceReport?.evidence ?? createEvidenceEnvelope({
  evidenceClass: evidenceClass ?? "manual",
  evidenceState: "unverified",
  workspaceRevision: rootRevision(),
  baselineName: baseline.baselineName,
  baselineCapturedAt: baseline.capturedAt ?? null,
  compatibilityLine: baseline.compatibilityLine,
  childRevisions: Object.fromEntries((baseline.submodules ?? []).map((entry) => [entry.path, entry.revision])),
  toolchain: { node: process.version, pnpm: null },
  command: "node scripts/run-integration-gate.mjs",
  limitations,
});
const children = sourceEvidence.testedRevisions?.children
  ?? Object.fromEntries((baseline.submodules ?? []).map((entry) => [entry.path, entry.revision]));
const joinedEvidence = {
  ...sourceEvidence,
  evidenceClass: evidenceClass ?? sourceEvidence.evidenceClass,
  evidenceState,
  run: { id: runId, url: runUrl },
  artifact: { id: artifactId, url: artifactUrl, path: artifactPath },
  limitations: [...new Set([...(sourceEvidence.limitations ?? []), ...limitations])],
};
const freshness = assessEvidenceFreshness({
  evidence: joinedEvidence,
  workspaceRevision: evidenceState === "current" ? (currentRootRevision ?? rootRevision()) : undefined,
  baselineName: evidenceState === "current" ? (currentBaselineName ?? baseline.baselineName) : undefined,
  childRevisions: evidenceState === "current" ? currentClaimChildren : {},
});
const stages = (sourceReport?.results ?? []).map((result) => ({
  label: result.label,
  command: relativeCommand(result.command, result.args),
  passed: result.passed === true,
  environment: result.environment ?? {
    mode: sourceReport?.mode ?? "unknown",
    boundary: sourceReport?.mode === "public-registry" ? "temporary-checkout" : "workspace",
    node: joinedEvidence.toolchain?.node ?? null,
    pnpm: joinedEvidence.toolchain?.pnpm ?? null,
  },
  artifact: result.artifact ?? null,
  limitation: result.limitation ?? result.remediation ?? null,
  blockerClass: result.blockerClass ?? null,
  dependencyStatus: result.dependencyStatus ?? "none",
}));
const stageLimitations = stages.map((stage) => stage.limitation).filter(Boolean);
const joined = {
  schemaVersion: 1,
  contract: "joined-integration-evidence-v1",
  claim: {
    evidenceClass: joinedEvidence.evidenceClass,
    evidenceState,
    currentObservationEligible: freshness.current,
    currentClaimEligible: freshness.current && sourceReport?.passed === true,
    freshnessReasons: freshness.reasons,
    rule: "Historical, revision-mismatched, or failed-gate evidence cannot satisfy a current success claim.",
  },
  root: { repository: baseline.repository ?? "relgeo/workspace", revision: joinedEvidence.testedRevisions?.root ?? "unknown" },
  baseline: {
    id: baseline.baselineId ?? null,
    name: joinedEvidence.baseline?.name ?? baseline.baselineName ?? "unknown",
    capturedAt: joinedEvidence.baseline?.capturedAt ?? baseline.capturedAt ?? null,
    compatibilityLine: joinedEvidence.baseline?.compatibilityLine ?? baseline.compatibilityLine ?? "unknown",
  },
  children,
  toolchain: joinedEvidence.toolchain,
  run: joinedEvidence.run,
  artifact: joinedEvidence.artifact,
  gate: {
    mode: sourceReport?.mode ?? "unavailable",
    passed: sourceReport?.passed === true,
    summary: sourceReport?.summary ?? null,
  },
  stages,
  limitations: [...new Set([...(joinedEvidence.limitations ?? []), ...stageLimitations])],
  capturedAt: joinedEvidence.capturedAt,
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(joined, null, 2) + "\n");
console.log(`Joined evidence ${freshness.current ? "eligible" : "not eligible"} for current claim.`);
console.log("Joined report written; local output path is omitted from evidence.");
process.exitCode = sourceReport && (evidenceState !== "current" || freshness.current) ? 0 : 1;
