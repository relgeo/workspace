#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createEvidenceEnvelope, classifyFailure } from "./orchestration-contract.mjs";

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

function commandLabel(command, args = []) {
  return [command, ...args].join(" ");
}

function runStep(id, command, args = [], { allowFailure = false } = {}) {
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  const passed = result.status === 0;
  const step = {
    id,
    command: commandLabel(command, args),
    passed,
    exitCode: result.status ?? 1,
  };
  if (!passed) {
    step.blocker = classifyFailure({
      error: result.error?.message ?? "",
      output: `${result.stdout ?? ""}\n${result.stderr ?? ""}`,
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
let pnpmVersion = null;
const pnpmProbe = runStep("toolchain: pnpm", "pnpm", ["--version"], { allowFailure: true });
if (pnpmProbe.passed) pnpmVersion = pnpmProbe.stdout.trim();

const toolchainReady = nodeMajor >= requiredNodeMajor && pnpmVersion === requiredPnpm;
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
  runStep("bootstrap: frozen dependencies", "pnpm", ["install", "--frozen-lockfile"]);
}
if (toolchainReady) {
  runStep("baseline: strict submodule report", "node", ["scripts/verify-baseline.mjs", "--strict"]);
}

const submodules = submoduleState();
const failedSteps = steps.filter((step) => !step.passed && !step.allowFailure);
const passed = toolchainReady && failedSteps.length === 0;
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
  outcome: passed ? "passed" : toolchainReady ? "failed" : "blocked",
  requiredToolchain: { node: `>=${requiredNodeMajor}`, pnpm: requiredPnpm },
  observedToolchain: { node: process.version, pnpm: pnpmVersion },
  evidence,
  submodules,
  steps,
  limitations,
  currentHistoricalRule: "Only this report's exact root/child revisions are current; later checkout changes make it historical.",
};

fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + "\n");
console.log(`Bootstrap ${report.outcome}: ${submodules.length} submodule(s) reported`);
console.log("Report written; its evidence omits the local report path.");
process.exitCode = passed ? 0 : toolchainReady ? 1 : 2;
