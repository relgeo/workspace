#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const reportArgument = process.argv.find((argument) => argument.startsWith("--report="));
const reportPath = reportArgument ? resolve(root, reportArgument.slice("--report=".length)) : null;
const startedAt = new Date().toISOString();
const steps = [];

function record(name, status, details = {}) {
  steps.push({ name, status, ...details });
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
  console.log(`\n[RUN] ${name}: ${command} ${args.join(" ")}`);
  const started = Date.now();
  const result = spawnSync(command, args, {
    cwd: root,
    env: process.env,
    stdio: "inherit",
  });
  const durationMs = Date.now() - started;
  if (result.status === 0) {
    record(name, "passed", { command: [command, ...args], durationMs });
    console.log(`[PASS] ${name}`);
    return true;
  }
  const details = result.error?.message ?? `process exited with ${result.status}`;
  record(name, "failed", { command: [command, ...args], durationMs, details });
  console.error(`[FAIL] ${name}: ${details}`);
  return false;
}

const ok = checkRootIsClean()
  && runStep("strict baseline", "pnpm", ["run", "verify:baseline:strict"])
  && runStep("compatibility matrix", "pnpm", ["run", "compatibility:check"])
  && runStep("release tarball audit", "pnpm", ["run", "release:audit"])
  && runStep("local integration gate", "pnpm", ["run", "integration:gate", "--", "--local"]);

const summary = {
  schemaVersion: 1,
  status: ok ? "passed" : "failed",
  startedAt,
  finishedAt: new Date().toISOString(),
  steps,
};

if (reportPath) {
  await mkdir(dirname(reportPath), { recursive: true });
  await writeFile(reportPath, `${JSON.stringify(summary, null, 2)}\n`, "utf8");
  console.log(`\nReport: ${reportPath}`);
}

console.log(`\nRelease preflight: ${summary.status}`);
process.exitCode = ok ? 0 : 1;
