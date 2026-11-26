#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createEvidenceEnvelope, classifyFailure } from "./orchestration-contract.mjs";
import { inspectPublicEntries } from "./public-boundary.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const requiredNodeMajor = 24;
const requiredPnpm = "10.33.3";
const reportArgument = process.argv.find((argument) => argument.startsWith("--report="));
const reportPath = reportArgument
  ? path.resolve(root, reportArgument.slice("--report=".length))
  : path.join(root, ".local", "bootstrap-report.json");
const skipSubmodules = process.argv.includes("--skip-submodules");
const skipInstall = process.argv.includes("--skip-install");

const steps = [];
const limitations = [];
const requiredWorkspaceFiles = ["package.json", "pnpm-lock.yaml", ".gitmodules"];

function commandLabel(command, args = []) {
  return [command, ...args].join(" ");
}

function runStep(id, command, args = [], { allowFailure = false, env = {} } = {}) {
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, ...env },
  });
  const passed = result.status === 0;
  const output = `${result.stdout ?? ""}\n${result.stderr ?? ""}`;
  const step = {
    id,
    command: commandLabel(command, args),
    passed,
    exitCode: result.status ?? 1,
  };
  if (!passed) {
    step.blocker = classifyFailure({
      error: result.error?.message ?? "",
      output,
      environmentUnavailable: /(?:ENOTFOUND|EAI_AGAIN|could not resolve host|no network)/i.test(output),
    });
  }
  steps.push(step);
  return { ...step, stdout: result.stdout ?? "", stderr: result.stderr ?? "", allowFailure };
}

function readRootRevision() {
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

function readBaseline() {
  try {
    return JSON.parse(fs.readFileSync(path.join(root, "docs", "integration-baseline.json"), "utf8"));
  } catch {
    return {};
  }
}

function workspaceBoundaryState() {
  const missing = requiredWorkspaceFiles.filter((file) => !fs.existsSync(path.join(root, file)));
  return {
    contract: "fresh-clone-workspace-v1",
    requiredFiles: [...requiredWorkspaceFiles],
    checkedFiles: requiredWorkspaceFiles.filter((file) => !missing.includes(file)),
    missingFiles: missing,
    siblingSource: false,
  };
}

function submoduleState() {
  const result = spawnSync("git", ["submodule", "status", "--recursive"], {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  });
  return (result.stdout ?? "").split(/\r?\n/).filter(Boolean).map((line) => {
    const marker = line[0];
    const parts = line.trim().split(/\s+/);
    return {
      path: parts[1] ?? "unknown",
      revision: parts[0] ?? "unknown",
      state: marker === "-" ? "uninitialized" : marker === "+" ? "out-of-date" : marker === "U" ? "conflicted" : "checked-out",
    };
  });
}

const baseline = readBaseline();
const nodeMajor = Number(process.versions.node.split(".")[0]);
const workspaceBoundary = workspaceBoundaryState();
const workspaceReady = workspaceBoundary.missingFiles.length === 0;
steps.push({
  id: "bootstrap: checkout boundary",
  command: "workspace metadata",
  passed: workspaceReady,
  exitCode: workspaceReady ? 0 : 1,
  ...(workspaceReady ? {} : {
    blocker: classifyFailure({ blockerClass: "target-defect" }),
    missingFiles: workspaceBoundary.missingFiles,
  }),
});
const nodeReady = nodeMajor >= requiredNodeMajor;
steps.push({
  id: "toolchain: node",
  command: "node --version",
  passed: nodeReady,
  exitCode: nodeReady ? 0 : 2,
  observedVersion: process.version,
  ...(nodeReady ? {} : {
    blocker: classifyFailure({ prerequisite: true, error: `requires Node.js ${requiredNodeMajor}+; found ${process.version}` }),
  }),
});
let pnpmVersion = null;
const pnpmProbe = runStep("toolchain: pnpm", "pnpm", ["--version"], { allowFailure: true });
if (pnpmProbe.passed) pnpmVersion = pnpmProbe.stdout.trim();

const toolchainReady = nodeReady && pnpmVersion === requiredPnpm;
if (nodeMajor < requiredNodeMajor) {
  limitations.push(`declared Node.js minimum is ${requiredNodeMajor}; found ${process.versions.node}`);
}
if (pnpmVersion !== requiredPnpm) {
  limitations.push(`declared pnpm version is ${requiredPnpm}; observed ${pnpmVersion ?? "unavailable"}`);
}

if (toolchainReady && !skipSubmodules) {
  runStep("bootstrap: recursive submodules", "git", ["submodule", "update", "--init", "--recursive"]);
}
if (toolchainReady && !skipInstall) {
  runStep("bootstrap: frozen dependencies", "pnpm", ["install", "--frozen-lockfile"], { env: { CI: "true" } });
}
if (toolchainReady) {
  runStep("baseline: strict submodule report", "node", ["scripts/verify-baseline.mjs", "--strict"]);
}

const submodules = submoduleState();
const failedSteps = steps.filter((step) => !step.passed && !step.allowFailure);
for (const step of failedSteps) {
  if (step.blocker?.blockerClass === "environment-unavailable") {
    limitations.push(`${step.id}: ${step.blocker.remediation}`);
  }
}
const passed = workspaceReady && toolchainReady && failedSteps.length === 0;
const evidence = createEvidenceEnvelope({
  evidenceClass: "local-workspace",
  evidenceState: "current",
  workspaceRevision: readRootRevision(),
  baselineName: baseline.baselineName ?? "unknown",
  baselineCapturedAt: baseline.capturedAt ?? null,
  compatibilityLine: baseline.compatibilityLine ?? "unknown",
  toolchain: { node: process.version, pnpm: pnpmVersion },
  childRevisions: Object.fromEntries((baseline.submodules ?? []).map((entry) => [entry.path, entry.revision])),
  command: "node scripts/bootstrap.mjs",
  limitations,
});
const report = {
  schemaVersion: 1,
  contract: "fresh-clone-bootstrap-v1",
  outcome: passed ? "passed" : !workspaceReady ? "failed" : !toolchainReady ? "blocked" : "failed",
  requiredToolchain: { node: `>=${requiredNodeMajor}`, pnpm: requiredPnpm },
  observedToolchain: { node: process.version, pnpm: pnpmVersion },
  workspaceBoundary,
  evidence,
  submodules,
  steps,
  limitations,
  currentHistoricalRule: "Only this report's exact root/child revisions are current; later checkout changes make it historical.",
};

const publicBoundary = inspectPublicEntries(
  [{ path: "bootstrap-report.json" }],
  { contents: [{ path: "bootstrap-report.json", content: JSON.stringify(report) }] },
);
steps.push({
  id: "public-boundary:report",
  command: "public-boundary-v1",
  passed: publicBoundary.passed,
  exitCode: publicBoundary.passed ? 0 : 1,
  ...(publicBoundary.passed ? {} : {
    blocker: classifyFailure({ blockerClass: "target-defect" }),
  }),
});
report.publicBoundary = publicBoundary;
if (!publicBoundary.passed) {
  report.outcome = "failed";
  report.limitations.push("public boundary scan rejected the generated bootstrap report");
}

fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + "\n");
console.log(`Bootstrap ${report.outcome}: ${submodules.length} submodule(s) reported`);
console.log("Report written; its evidence omits the local report path.");
process.exitCode = report.outcome === "passed" ? 0 : toolchainReady && workspaceReady ? 1 : 2;
