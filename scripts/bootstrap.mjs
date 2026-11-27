#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createEvidenceEnvelope, classifyFailure } from "./orchestration-contract.mjs";
import { inspectPublicEntries } from "./public-boundary.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const requiredNodeVersion = fs.readFileSync(path.join(root, ".node-version"), "utf8").trim();
const rootPackage = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const requiredPnpm = String(rootPackage.packageManager ?? "").replace(/^pnpm@/, "");
const reportArgument = process.argv.find((argument) => argument.startsWith("--report="));
const reportPath = reportArgument
  ? path.resolve(root, reportArgument.slice("--report=".length))
  : path.join(root, ".local", "bootstrap-report.json");
const skipSubmodules = process.argv.includes("--skip-submodules");
const skipInstall = process.argv.includes("--skip-install");

const steps = [];
const limitations = [];
const requiredWorkspaceFiles = ["package.json", "pnpm-lock.yaml", ".gitmodules", ".node-version"];

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
    if (/lock config file|operation not permitted/i.test(output)) {
      step.limitation = "Git metadata write is unavailable at this execution boundary";
    }
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

function readGitlinkRevision(submodulePath) {
  try {
    const line = execFileSync("git", ["ls-tree", "HEAD", "--", submodulePath], {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    return line.match(/^160000 commit ([0-9a-f]{40})\t/)?.[1] ?? null;
  } catch {
    return null;
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
  const entries = (result.stdout ?? "").split(/\r?\n/).filter(Boolean).map((line) => {
    const marker = line[0];
    const parts = line.trim().split(/\s+/);
    const submodulePath = parts[1] ?? "unknown";
    const checkoutRevision = parts[0] ?? "unknown";
    const gitlinkRevision = readGitlinkRevision(submodulePath);
    let dirty = null;
    try {
      dirty = Boolean(execFileSync("git", ["status", "--porcelain"], {
        cwd: path.join(root, submodulePath),
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      }).trim());
    } catch {
      dirty = null;
    }
    return {
      path: submodulePath,
      revision: checkoutRevision,
      gitlinkRevision,
      matchesGitlink: Boolean(gitlinkRevision) && checkoutRevision === gitlinkRevision,
      dirty,
      state: marker === "-" ? "uninitialized" : marker === "+" ? "out-of-date" : marker === "U" ? "conflicted" : "checked-out",
    };
  });
  return { commandPassed: result.status === 0, entries };
}

const baseline = readBaseline();
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
const nodeReady = process.versions.node === requiredNodeVersion;
steps.push({
  id: "toolchain: node",
  command: "node --version",
  passed: nodeReady,
  exitCode: nodeReady ? 0 : 2,
  observedVersion: process.version,
  ...(nodeReady ? {} : {
    blocker: classifyFailure({ prerequisite: true, error: `requires Node.js ${requiredNodeVersion} exactly; found ${process.version}` }),
  }),
});
let pnpmVersion = null;
const pnpmProbe = runStep("toolchain: pnpm", "pnpm", ["--version"], { allowFailure: true });
if (pnpmProbe.passed) pnpmVersion = pnpmProbe.stdout.trim();

const toolchainReady = nodeReady && pnpmVersion === requiredPnpm;
if (!nodeReady) {
  limitations.push(`declared Node.js version is ${requiredNodeVersion}; found ${process.versions.node}`);
}
if (pnpmVersion !== requiredPnpm) {
  limitations.push(`declared pnpm version is ${requiredPnpm}; observed ${pnpmVersion ?? "unavailable"}`);
}

if (workspaceReady && !skipSubmodules) {
  runStep("bootstrap: recursive submodules", "git", ["submodule", "update", "--init", "--recursive"]);
}
if (toolchainReady && !skipInstall) {
  runStep("bootstrap: frozen dependencies", "pnpm", ["install", "--frozen-lockfile"], { env: { CI: "true" } });
}
if (toolchainReady) {
  runStep("baseline: strict submodule report", "node", ["scripts/verify-baseline.mjs", "--strict"]);
}

const submoduleObservation = submoduleState();
const submodules = submoduleObservation.entries;
const submoduleAlignment = submoduleObservation.commandPassed && submodules.length > 0 && submodules.every((entry) => entry.matchesGitlink && entry.dirty === false);
steps.push({
  id: "bootstrap: gitlink alignment",
  command: "git submodule status --recursive",
  passed: submoduleAlignment,
  exitCode: submoduleAlignment ? 0 : 1,
  ...(submoduleObservation.commandPassed ? {} : {
    blocker: classifyFailure({ blockerClass: "environment-unavailable" }),
    limitation: "Git could not read recursive submodule status at this execution boundary",
  }),
  submodules: submodules.map(({ path: submodulePath, revision, gitlinkRevision, matchesGitlink, dirty, state }) => ({
    path: submodulePath,
    revision,
    gitlinkRevision,
    matchesGitlink,
    dirty,
    state,
  })),
});
const failedSteps = steps.filter((step) => !step.passed && !step.allowFailure);
const environmentBlocked = failedSteps.some((step) => step.blocker?.blockerClass === "environment-unavailable");
for (const step of failedSteps) {
  if (step.blocker?.blockerClass === "environment-unavailable") {
    limitations.push(`${step.id}: ${step.limitation ?? step.blocker.remediation}`);
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
  childRevisions: Object.fromEntries(submodules.map((entry) => [entry.path, entry.revision])),
  command: "node scripts/bootstrap.mjs",
  limitations,
});
const report = {
  schemaVersion: 1,
  contract: "fresh-clone-bootstrap-v1",
  outcome: passed ? "passed" : !workspaceReady ? "failed" : !toolchainReady || environmentBlocked ? "blocked" : "failed",
  requiredToolchain: { node: requiredNodeVersion, pnpm: requiredPnpm },
  toolchainContract: {
    nodeVersionSource: ".node-version",
    packageManagerSource: "package.json#packageManager",
    exactNodeVersion: requiredNodeVersion,
    exactPnpmVersion: requiredPnpm,
  },
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
process.exitCode = report.outcome === "passed" ? 0 : report.outcome === "blocked" ? 2 : 1;
