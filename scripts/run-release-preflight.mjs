#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import {
  classifyFailure,
  createEvidenceEnvelope,
  evaluateDecisionGate,
  runWithBoundedAttemptsSync,
} from "./orchestration-contract.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const reportArgument = process.argv.find((argument) => argument.startsWith("--report="));
const recordArgument = process.argv.find((argument) => argument.startsWith("--record="));
const reportPath = reportArgument ? resolve(root, reportArgument.slice("--report=".length)) : null;
const recordVersion = recordArgument?.slice("--record=".length) || "0.5.0";
const recordPath = resolve(root, "docs/releases", `${recordVersion}.json`);
const baselineManifest = JSON.parse(readFileSync(resolve(root, "docs/integration-baseline.json"), "utf8"));
const startedAt = new Date().toISOString();
const steps = [];

function record(name, status, details = {}) {
  const failure = status === "passed"
    ? {}
    : classifyFailure({
      blockerClass: details.blockerClass,
      decisionRequired: details.decisionRequired,
      error: details.details,
      output: details.output,
    });
  const { output: _output, ...reportDetails } = details;
  steps.push({
    name,
    status,
    ...reportDetails,
    ...failure,
    owner: details.owner ?? "relgeo/workspace",
    repository: details.repository ?? "relgeo/workspace",
    surface: details.surface ?? name.split(":")[0],
    dependencyImpact: details.dependencyImpact
      ?? (status === "passed"
        ? "none"
        : "Dependent preflight steps remain untrusted until this step passes."),
    downstreamImpact: details.downstreamImpact
      ?? (status === "passed"
        ? "none"
        : "Dependent preflight steps remain untrusted until this step passes."),
    dependencyStatus: details.dependencyStatus
      ?? (status === "passed" ? "ready" : "blocked"),
  });
}

function checkRootIsClean() {
  const result = spawnSync("git", ["status", "--porcelain", "--untracked-files=normal"], {
    cwd: root,
    encoding: "utf8",
    env: process.env,
  });
  const output = result.stdout.trim();
  if (result.status !== 0) {
    record("root working tree is clean", "failed", {
      details: result.error?.message ?? result.stderr.trim() ?? `git exited with ${result.status}`,
    });
    return false;
  }
  if (output) {
    record("root working tree is clean", "failed", { details: output });
    console.error("[FAIL] root working tree is not clean; commit or stash changes before release preflight");
    console.error(output);
    return false;
  }
  record("root working tree is clean", "passed");
  console.log("[PASS] root working tree is clean");
  return true;
}

function runStep(name, command, args) {
  const started = Date.now();
  console.log("\n[RUN] " + name + ": " + command + " " + args.join(" "));
  const execution = runWithBoundedAttemptsSync((attempt) => {
    const result = spawnSync(command, args, {
      cwd: root,
      env: process.env,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
    return {
      passed: result.status === 0,
      exitCode: result.status ?? 1,
      error: result.error?.message,
      output: (result.stdout ?? "") + "\n" + (result.stderr ?? ""),
      durationMs: Date.now() - started,
      attempt,
    };
  });
  const finalAttempt = execution.finalAttempt;
  const durationMs = Date.now() - started;
  const details = finalAttempt.error ?? "process exited with " + finalAttempt.exitCode;
  const blocker = execution.passed ? {} : classifyFailure(finalAttempt);
  const firstFailure = execution.firstFailure;
  record(name, execution.passed ? "passed" : "failed", {
    command: [command, ...args],
    durationMs,
    details,
    ...blocker,
    decisionNeeded: blocker.decisionNeeded ?? blocker.decisionRequired ?? false,
    retryPolicy: execution.retryPolicy,
    attempts: execution.attempts.map((attemptResult) => ({
      attempt: attemptResult.attempt,
      attemptId: attemptResult.attemptId,
      previousAttemptId: attemptResult.previousAttemptId,
      passed: attemptResult.passed,
      exitCode: attemptResult.exitCode ?? 1,
      blockerClass: attemptResult.blockerClass ?? null,
      retryable: attemptResult.retryable ?? false,
      remediation: attemptResult.remediation ?? null,
      decisionRequired: attemptResult.decisionRequired ?? false,
      decisionNeeded: attemptResult.decisionNeeded ?? attemptResult.decisionRequired ?? false,
    })),
    attemptLinks: execution.attemptLinks,
    firstFailure: firstFailure
      ? {
        attempt: firstFailure.attempt,
        attemptId: firstFailure.attemptId,
        previousAttemptId: firstFailure.previousAttemptId,
        passed: false,
        exitCode: firstFailure.exitCode ?? 1,
        blockerClass: firstFailure.blockerClass ?? null,
        retryable: firstFailure.retryable ?? false,
        remediation: firstFailure.remediation ?? null,
        decisionRequired: firstFailure.decisionRequired ?? false,
        decisionNeeded: firstFailure.decisionNeeded ?? firstFailure.decisionRequired ?? false,
      }
      : null,
  });
  console.log((execution.passed ? "[PASS] " : "[FAIL] ") + name);
  return execution.passed;
}

async function checkCompletedReleaseRecord() {
  try {
    const releaseRecord = JSON.parse(await readFile(recordPath, "utf8"));
    const decisionGate = evaluateDecisionGate({
      required: true,
      status: releaseRecord.decision?.approvalStatus ?? "not-required",
    });
    if (!decisionGate.allowed) {
      record("release decision record approval", "failed", {
        details: `record ${recordVersion} has decision state ${decisionGate.decisionState}; explicit maintainer approval is required`,
        ...decisionGate,
      });
      console.error(`[FAIL] release decision record approval: ${decisionGate.decisionState}`);
      return false;
    }
    if (releaseRecord.status !== "completed") {
      record("release decision record is completed", "failed", {
        details: `record ${recordVersion} has status ${releaseRecord.status}; preflight is only valid for a completed release`,
      });
      console.error(`[FAIL] release decision record is completed: ${recordVersion} is ${releaseRecord.status}`);
      return false;
    }
    record("release decision record is completed", "passed");
    console.log(`[PASS] release decision record is completed: ${recordVersion}`);
    return true;
  } catch (error) {
    record("release decision record is completed", "failed", { details: error.message });
    console.error(`[FAIL] release decision record is completed: ${error.message}`);
    return false;
  }
}

const ok = checkRootIsClean()
  && runStep("strict baseline", "pnpm", ["run", "verify:baseline:strict"])
  && runStep("compatibility matrix", "pnpm", ["run", "compatibility:check"])
  && runStep("release decision record", "pnpm", ["run", "release:record:check", recordVersion])
  && await checkCompletedReleaseRecord()
  && runStep("release tarball audit", "pnpm", ["run", "release:audit"])
  && runStep("local integration gate", "pnpm", ["run", "integration:gate", "--", "--local"]);

const summary = {
  schemaVersion: 1,
  contract: "release-preflight-v1",
  status: ok ? "passed" : "failed",
  startedAt,
  finishedAt: new Date().toISOString(),
  evidence: createEvidenceEnvelope({
    evidenceClass: "manual",
    evidenceState: "current",
    workspaceRevision: spawnSync("git", ["rev-parse", "HEAD"], {
      cwd: root,
      encoding: "utf8",
    }).stdout.trim(),
    baselineName: baselineManifest.baselineName,
    baselineCapturedAt: baselineManifest.capturedAt ?? null,
    compatibilityLine: baselineManifest.compatibilityLine,
    childRevisions: Object.fromEntries(
      (baselineManifest.submodules ?? []).map((entry) => [entry.path, entry.revision]),
    ),
    toolchain: { node: process.version },
    command: "node scripts/run-release-preflight.mjs",
    limitations: Number(process.versions.node.split(".")[0]) < 24
      ? ["declared Node.js minimum is 24"]
      : [],
  }),
  summary: {
    total: steps.length,
    passed: steps.filter((step) => step.status === "passed").length,
    failed: steps.filter((step) => step.status === "failed").length,
    blocked: steps.filter((step) => step.blockerClass && step.blockerClass !== "target-defect").length,
  },
  steps,
};

if (reportPath) {
  await mkdir(dirname(reportPath), { recursive: true });
  await writeFile(reportPath, `${JSON.stringify(summary, null, 2)}\n`, "utf8");
  console.log(`\nReport: ${reportPath}`);
}

console.log(`\nRelease preflight: ${summary.status}`);
process.exitCode = ok ? 0 : 1;
