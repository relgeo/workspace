#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const jsonOutput = process.argv.includes("--json");
const baselineArgument = process.argv.find((argument) => argument.startsWith("--baseline="));
const matrixArgument = process.argv.find((argument) => argument.startsWith("--matrix="));
const reportArgument = process.argv.find((argument) => argument.startsWith("--report="));
const baselinePath = baselineArgument
  ? path.resolve(root, baselineArgument.slice("--baseline=".length))
  : path.join(root, "docs", "integration-baseline.json");
const matrixPath = matrixArgument
  ? path.resolve(root, matrixArgument.slice("--matrix=".length))
  : path.join(root, "docs", "compatibility-matrix.json");
const reportPath = reportArgument
  ? path.resolve(root, reportArgument.slice("--report=".length))
  : null;
const checks = [];
const failures = [];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function git(args, cwd = root) {
  return execFileSync("git", args, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function check(id, passed, detail) {
  const result = { id, passed, detail };
  checks.push(result);
  if (!passed) failures.push(result);
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

function gitlinkRevision(submodulePath) {
  const line = git(["ls-files", "-s", "--", submodulePath]);
  return line.match(/^160000\s+([0-9a-f]{40})\s+\d\t/)?.[1] ?? null;
}

function childState(submodulePath) {
  const childRoot = path.join(root, submodulePath);
  try {
    return {
      revision: git(["rev-parse", "HEAD"], childRoot),
      dirty: Boolean(git(["status", "--porcelain"], childRoot)),
      error: null,
    };
  } catch (error) {
    return { revision: null, dirty: null, error: error.message };
  }
}

let baseline;
let matrix;
let rootPackage;
try {
  baseline = readJson(baselinePath);
  matrix = readJson(matrixPath);
  rootPackage = readJson(path.join(root, "package.json"));
} catch (error) {
  check("inputs: readable manifests", false, error.message);
  baseline = {};
  matrix = {};
}

let gitmodules = [];
try {
  gitmodules = readGitmodules();
  check(".gitmodules: unique paths", new Set(gitmodules.map((entry) => entry.path)).size === gitmodules.length, "paths are unique");
  check(".gitmodules: complete entries", gitmodules.every((entry) => entry.path && entry.url), "every entry declares path and url");
} catch (error) {
  check(".gitmodules: readable", false, error.message);
}

let rootRevision = "unknown";
try {
  rootRevision = git(["rev-parse", "HEAD"]);
  check("root: baseline revision", baseline.rootRevision === rootRevision, `${baseline.rootRevision ?? "missing"} != ${rootRevision}`);
} catch (error) {
  check("root: Git repository", false, error.message);
}

let recursiveSubmoduleStatus = "";
try {
  recursiveSubmoduleStatus = git(["submodule", "status", "--recursive"]);
  const lines = recursiveSubmoduleStatus ? recursiveSubmoduleStatus.split(/\r?\n/).filter(Boolean) : [];
  check(
    "submodules: recursive status",
    lines.length === gitmodules.length && lines.every((line) => !/^[+\-U]/.test(line)),
    `${lines.length} entries, ${lines.filter((line) => /^[+\-U]/.test(line)).length} non-clean markers`,
  );
} catch (error) {
  check("submodules: recursive status", false, error.message);
}

const baselineByPath = new Map((baseline.submodules ?? []).map((entry) => [entry.path, entry]));
const gitmodulePaths = new Set(gitmodules.map((entry) => entry.path));
check(
  "baseline: submodule set",
  Array.isArray(baseline.submodules) && baseline.submodules.length === gitmodules.length &&
    baseline.submodules.every((entry) => gitmodulePaths.has(entry.path)),
  `${baseline.submodules?.length ?? 0} manifest entries, ${gitmodules.length} registered submodules`,
);
check("baseline: compatibility line", baseline.compatibilityLine === matrix.compatibilityLine, `${baseline.compatibilityLine ?? "missing"} != ${matrix.compatibilityLine ?? "missing"}`);
check("matrix: baseline locator", matrix.baselineManifest === "docs/integration-baseline.json", matrix.baselineManifest ?? "missing");
check("baseline: captured date", /^\d{4}-\d{2}-\d{2}$/.test(baseline.capturedAt ?? ""), baseline.capturedAt ?? "missing");
const pinnedNodeVersion = fs.readFileSync(path.join(root, ".node-version"), "utf8").trim();
const pinnedPnpmVersion = String(rootPackage?.packageManager ?? "").replace(/^pnpm@/, "");
check("baseline: pinned Node version", baseline.toolchain?.node === pinnedNodeVersion, `${baseline.toolchain?.node ?? "missing"} != ${pinnedNodeVersion}`);
check("baseline: pinned pnpm version", baseline.toolchain?.pnpm === pinnedPnpmVersion, `${baseline.toolchain?.pnpm ?? "missing"} != ${pinnedPnpmVersion}`);

const childRevisions = {};
for (const entry of gitmodules) {
  const submodulePath = entry.path;
  const pointer = (() => {
    try { return gitlinkRevision(submodulePath); } catch { return null; }
  })();
  const state = childState(submodulePath);
  childRevisions[submodulePath] = pointer ?? "unknown";
  check(`${submodulePath}: path exists`, fs.existsSync(path.join(root, submodulePath)), submodulePath);
  check(`${submodulePath}: gitlink`, Boolean(pointer), pointer ?? "missing gitlink");
  check(`${submodulePath}: checkout matches gitlink`, state.revision === pointer, `${state.revision ?? "unavailable"} != ${pointer ?? "missing"}`);
  check(`${submodulePath}: working tree clean`, state.dirty === false, state.error ?? (state.dirty ? "dirty" : "clean"));
  const manifestEntry = baselineByPath.get(submodulePath);
  check(`${submodulePath}: baseline revision matches gitlink`, manifestEntry?.revision === pointer, `${manifestEntry?.revision ?? "missing"} != ${pointer ?? "missing"}`);
  if (manifestEntry?.package) {
    try {
      const packageJson = readJson(path.join(root, submodulePath, "package.json"));
      check(`${submodulePath}: baseline package provenance`, packageJson.name === manifestEntry.package.name && packageJson.version === manifestEntry.package.version, `${packageJson.name}@${packageJson.version}`);
    } catch (error) {
      check(`${submodulePath}: package provenance readable`, false, error.message);
    }
  }
}

const matrixEntries = [...(matrix.packages ?? []), ...(matrix.consumers ?? []), ...(matrix.nonNodeConsumers ?? [])];
check("matrix: unique repository paths", new Set(matrixEntries.map((entry) => entry.path)).size === matrixEntries.length, "paths are unique");
for (const entry of matrixEntries) {
  check(`matrix:${entry.path}: registered`, gitmodulePaths.has(entry.path), entry.path);
  check(`matrix:${entry.path}: baseline provenance`, baselineByPath.has(entry.path), entry.path);
}
const specPath = matrix.contract?.specPath;
let specPointer = null;
try {
  specPointer = specPath ? gitlinkRevision(specPath) : null;
} catch {
  specPointer = null;
}
check("matrix: spec provenance", Boolean(specPath) && matrix.contract.specRevision === specPointer, `${matrix.contract?.specRevision ?? "missing"} != ${specPointer ?? "missing"}`);

const report = {
  schemaVersion: 1,
  contract: "baseline-synchronization-v1",
  ok: failures.length === 0,
  promotion: {
    eligible: failures.length === 0,
    rule: "A baseline is promotable only when .gitmodules, root gitlinks, child HEAD/clean state, baseline revisions, and compatibility provenance all match.",
  },
  provenance: {
    rootRevision,
    baselineRootRevision: baseline.rootRevision ?? null,
    baselineCapturedAt: baseline.capturedAt ?? null,
    compatibilityLine: baseline.compatibilityLine ?? null,
    childRevisions,
  },
  recursiveSubmoduleStatus: recursiveSubmoduleStatus.split(/\r?\n/).filter(Boolean),
  summary: { total: checks.length, passed: checks.length - failures.length, failed: failures.length },
  checks,
  failures,
  inputs: {
    baseline: path.relative(root, baselinePath),
    compatibilityMatrix: path.relative(root, matrixPath),
    gitmodules: ".gitmodules",
  },
};

if (reportPath) {
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + "\n");
}

if (jsonOutput) {
  process.stdout.write(JSON.stringify(report, null, 2) + "\n");
} else {
  console.log("RelGeo baseline synchronization check");
  for (const result of checks) console.log(`${result.passed ? "[PASS]" : "[FAIL]"} ${result.id} — ${result.detail}`);
  console.log(`Summary: ${report.summary.failed} failed, ${report.summary.passed} passed`);
  console.log(`Promotion: ${report.promotion.eligible ? "eligible" : "blocked"}`);
}
process.exitCode = report.ok ? 0 : 1;
