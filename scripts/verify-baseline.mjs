#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { classifyFailure, createEvidenceEnvelope } from "./orchestration-contract.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, "..");
const manifestArgument = process.argv.find((argument) => argument.startsWith("--manifest="));
const manifestPath = manifestArgument
  ? path.resolve(root, manifestArgument.slice("--manifest=".length))
  : path.join(root, "docs", "integration-baseline.json");
const strict = process.argv.includes("--strict");
const jsonOutput = process.argv.includes("--json");
const writeManifest = process.argv.includes("--write");
const requireMain = process.argv.includes("--require-main");
const reportCommand = [
  "node",
  "scripts/verify-baseline.mjs",
  ...(manifestArgument ? ["--manifest=<provided>"] : []),
  ...(strict ? ["--strict"] : []),
  ...(jsonOutput ? ["--json"] : []),
  ...(writeManifest ? ["--write"] : []),
  ...(requireMain ? ["--require-main"] : []),
].join(" ");

const failures = [];
const checks = [];
let workspaceRevision = "unknown";
let baselineName = "unknown";
let compatibilityLine = "unknown";
let packageManager = null;
let baselineCapturedAt = null;
let childRevisions = {};

function record(label, ok, detail) {
  checks.push({ label, ok, detail });
  if (!ok) failures.push({ label, detail });
}

function runGit(args, cwd = root) {
  return execFileSync("git", args, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function readGitmodules() {
  const source = fs.readFileSync(path.join(root, ".gitmodules"), "utf8");
  const entries = [];
  let current = null;
  for (const line of source.split(/\r?\n/)) {
    const section = line.match(/^\[submodule "(.+)"\]$/);
    if (section) {
      if (current) entries.push(current);
      current = { name: section[1] };
      continue;
    }
    const field = line.match(/^\s*(path|url|branch)\s*=\s*(.+)$/);
    if (field && current) current[field[1]] = field[2].trim();
  }
  if (current) entries.push(current);
  return entries;
}

function buildManifest(previous = {}) {
  const rootRevision = runGit(["rev-parse", "HEAD"]);
  const toolchain = {
    node: ">=24",
    pnpm: "10.33.3",
  };
  const submodules = readGitmodules().map(({ path: submodulePath }) => {
    const entry = {
      path: submodulePath,
      revision: runGit(["rev-parse", "HEAD"], path.join(root, submodulePath)),
    };
    const packagePath = path.join(root, submodulePath, "package.json");
    if (fs.existsSync(packagePath)) {
      const pkg = readJson(packagePath);
      entry.package = { name: pkg.name, version: pkg.version };
    }
    return entry;
  });
  return {
    schemaVersion: 1,
    contract: "integration-baseline-v1",
    baselineId: previous.baselineId ?? "relgeo-public-0.5-staging",
    baselineName: previous.baselineName ?? "relgeo-public-0.5-staging",
    capturedAt: new Date().toISOString().slice(0, 10),
    rootRevision,
    compatibilityLine: previous.compatibilityLine ?? "0.5",
    toolchain,
    repository: "relgeo/workspace",
    evidence: {
      evidenceClass: "baseline-snapshot",
      evidenceState: "current",
      currentRule: "Only exact root gitlink and child checkout revisions captured together may support a current claim.",
      historicalRule: "A prior snapshot remains historical when root or any child revision changes.",
    },
    submodules,
  };
}

function getGitlinkRevision(submodulePath) {
  const line = runGit(["ls-files", "-s", "--", submodulePath]);
  const match = line.match(/^160000\s+([0-9a-f]{40})\s+\d\t/);
  return match?.[1] ?? null;
}

function getWorkingTreeStatus(submodulePath) {
  return runGit(["status", "--porcelain"], path.join(root, submodulePath));
}

function verifySubmodule(entry) {
  const submodulePath = entry.path;
  const expected = entry.revision;
  const absolutePath = path.join(root, submodulePath);
  const gitmodulesEntry = readGitmodules().find((item) => item.path === submodulePath);
  record(submodulePath + ": registered in .gitmodules", Boolean(gitmodulesEntry), "path registration");
  if (!gitmodulesEntry) return;

  let pointer = null;
  try {
    pointer = getGitlinkRevision(submodulePath);
  } catch {
    record(submodulePath + ": gitlink", false, "not tracked as a submodule");
    return;
  }
  record(
    submodulePath + ": manifest revision matches gitlink",
    pointer === expected,
    (pointer ?? "missing") + " != " + expected,
  );

  try {
    const head = runGit(["rev-parse", "HEAD"], absolutePath);
    record(
      submodulePath + ": checkout matches gitlink",
      head === pointer,
      head + " != " + pointer,
    );
    const status = getWorkingTreeStatus(submodulePath);
    record(submodulePath + ": working tree clean", !status, status || "clean");
    if (requireMain) {
      const branch = runGit(["branch", "--show-current"], absolutePath);
      record(submodulePath + ": branch is main", branch === "main", branch || "detached");
    }
  } catch (error) {
    record(submodulePath + ": initialized checkout", false, error.message);
  }
}

function verifyPackage(entry, compatibilityLine) {
  if (!entry.package) return;
  const packagePath = path.join(root, entry.path, "package.json");
  try {
    const pkg = readJson(packagePath);
    record(
      entry.path + ": package name",
      pkg.name === entry.package.name,
      pkg.name + " != " + entry.package.name,
    );
    record(
      entry.path + ": package version",
      pkg.version === entry.package.version,
      pkg.version + " != " + entry.package.version,
    );
    record(
      entry.path + ": license MIT",
      pkg.license === "MIT",
      (pkg.license ?? "missing") + " != MIT",
    );
    if (entry.package.name.startsWith("@relgeo/")) {
      const expectedPrefix = compatibilityLine + ".";
      record(
        entry.path + ": package compatibility line",
        typeof pkg.version === "string" && pkg.version.startsWith(expectedPrefix),
        (pkg.version ?? "missing") + " does not start with " + expectedPrefix,
      );
    }
  } catch (error) {
    record(entry.path + ": package metadata readable", false, error.message);
  }
}

try {
  workspaceRevision = runGit(["rev-parse", "HEAD"]);
  record("workspace: Git repository", Boolean(workspaceRevision), workspaceRevision);
  const rootPackage = readJson(path.join(root, "package.json"));
  packageManager = rootPackage.packageManager ?? null;
  const manifest = writeManifest
    ? buildManifest(fs.existsSync(manifestPath) ? readJson(manifestPath) : {})
    : readJson(manifestPath);
  if (writeManifest) {
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
    record("manifest: regenerated", true, "snapshot updated");
  }
  record(
    "manifest: compatibility line",
    manifest.compatibilityLine === "0.5",
    String(manifest.compatibilityLine),
  );
  baselineName = manifest.baselineName ?? "unknown";
  compatibilityLine = manifest.compatibilityLine ?? "unknown";
  baselineCapturedAt = manifest.capturedAt ?? null;
  childRevisions = Object.fromEntries(
    (manifest.submodules ?? []).map((entry) => [entry.path, entry.revision]),
  );
  const entries = manifest.submodules;
  const registeredSubmoduleCount = readGitmodules().length;
  record(
    "manifest: submodule list",
    Array.isArray(entries) && entries.length === registeredSubmoduleCount,
    `${entries?.length ?? 0} manifest entries, ${registeredSubmoduleCount} registered submodules`,
  );
  for (const entry of entries ?? []) {
    verifySubmodule(entry);
    verifyPackage(entry, manifest.compatibilityLine);
  }
} catch (error) {
  record("baseline verifier", false, error.message);
}

if (jsonOutput) {
  const structuredFailures = failures.map((failure) => {
    const classification = classifyFailure({
      error: failure.detail,
      output: failure.label,
    });
    return {
      ...failure,
      ...classification,
      decisionNeeded: classification.decisionNeeded ?? classification.decisionRequired ?? false,
      owner: "relgeo/workspace",
      repository: "relgeo/workspace",
      surface: failure.label.split(":")[0],
      dependencyImpact: "Dependent stages remain untrusted until this check passes.",
      downstreamImpact: "Dependent stages remain untrusted until this check passes.",
      dependencyStatus: "blocked",
      retryPolicy: { maxAttempts: 1, backoffMs: 0, attemptsUsed: 1, exhausted: true },
      attempts: [{
        attempt: 1,
        attemptId: "attempt-1",
        previousAttemptId: null,
        passed: false,
        blockerClass: classification.blockerClass,
        retryable: classification.retryable,
        remediation: classification.remediation,
        decisionRequired: classification.decisionRequired,
        decisionNeeded: classification.decisionNeeded ?? classification.decisionRequired,
      }],
      attemptLinks: [{
        attemptId: "attempt-1",
        attempt: 1,
        previousAttemptId: null,
        linkedToFirstFailure: "attempt-1",
      }],
      firstFailure: {
        attempt: 1,
        attemptId: "attempt-1",
        previousAttemptId: null,
        passed: false,
        blockerClass: classification.blockerClass,
        retryable: classification.retryable,
        remediation: classification.remediation,
        decisionRequired: classification.decisionRequired,
        decisionNeeded: classification.decisionNeeded ?? classification.decisionRequired,
        owner: "relgeo/workspace",
        repository: "relgeo/workspace",
        surface: failure.label.split(":")[0],
      },
    };
  });
  const report = {
    schemaVersion: 1,
    contract: "baseline-verification-v1",
    ok: failures.length === 0,
    strict,
    evidence: createEvidenceEnvelope({
      evidenceClass: "local-workspace",
      evidenceState: "current",
      capturedAt: new Date().toISOString(),
      workspaceRevision,
      baselineName,
      baselineCapturedAt,
      compatibilityLine,
      toolchain: { node: process.version, pnpm: packageManager },
      childRevisions,
      command: reportCommand,
      limitations: Number(process.versions.node.split(".")[0]) < 24
        ? ["declared Node.js minimum is 24"]
        : [],
    }),
    summary: {
      total: checks.length,
      passed: checks.length - failures.length,
      failed: failures.length,
    },
    checks,
    failures: structuredFailures,
  };
  process.stdout.write(JSON.stringify(report, null, 2) + "\n");
} else {
  console.log("RelGeo baseline verification" + (strict ? " (strict)" : ""));
  for (const check of checks) {
    console.log(
      (check.ok ? "[PASS]" : "[FAIL]") +
        " " +
        check.label +
        (check.detail ? " — " + check.detail : ""),
    );
  }
  console.log(
    "Summary: " +
      failures.length +
      " failed, " +
      (checks.length - failures.length) +
      " passed",
  );
}

process.exitCode = failures.length ? 1 : 0;
