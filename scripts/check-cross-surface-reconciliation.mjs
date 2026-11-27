#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const reportArgument = process.argv.find((argument) => argument.startsWith("--report="));
const reportPath = reportArgument
  ? path.resolve(root, reportArgument.slice("--report=".length))
  : path.join(root, "docs", "evidence", "cross-repository-cross-surface-reconciliation-2026-11-27.json");

const checks = [];
const failures = [];

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
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

function parseGitmodules() {
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
  return git(["ls-tree", "HEAD", "--", submodulePath]).match(/^160000\s+commit\s+([0-9a-f]{40})\s+/)?.[1] ?? null;
}

function childState(submodulePath) {
  const childRoot = path.join(root, submodulePath);
  try {
    return {
      revision: git(["rev-parse", "HEAD"], childRoot),
      dirty: Boolean(git(["status", "--porcelain"], childRoot)),
      branch: (() => {
        try { return git(["symbolic-ref", "--short", "-q", "HEAD"], childRoot) || null; } catch { return null; }
      })(),
    };
  } catch (error) {
    return { revision: null, dirty: null, branch: null, error: error.message };
  }
}

function text(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

const baseline = readJson("docs/integration-baseline.json");
const matrix = readJson("docs/compatibility-matrix.json");
const rebaseline = readJson("docs/evidence/cross-repository-rebaseline-2026-11-27.json");
const gitmodules = parseGitmodules();
const baselineByPath = new Map((baseline.submodules ?? []).map((entry) => [entry.path, entry]));
const rootRevision = git(["rev-parse", "HEAD"]);

const rootGitlinks = [];
const childRepositoryCommits = [];
const stalePointers = [];

check("root: current revision readable", /^[0-9a-f]{40}$/.test(rootRevision), rootRevision);
check(".gitmodules: registered child count", gitmodules.length === 12, `${gitmodules.length} registered child repositories`);
check("baseline: root revision", baseline.rootRevision === rootRevision, `${baseline.rootRevision ?? "missing"} != ${rootRevision}`);

for (const entry of gitmodules) {
  const pointer = gitlinkRevision(entry.path);
  const state = childState(entry.path);
  const baselineRevision = baselineByPath.get(entry.path)?.revision ?? null;
  const record = {
    path: entry.path,
    repository: entry.url,
    gitlinkRevision: pointer,
    checkoutRevision: state.revision,
    baselineRevision,
    checkoutClean: state.dirty === false,
    branch: state.branch,
  };
  rootGitlinks.push(record);
  childRepositoryCommits.push({ path: entry.path, revision: state.revision, branch: state.branch, clean: state.dirty === false });
  const aligned = Boolean(pointer) && pointer === state.revision && pointer === baselineRevision && state.dirty === false;
  if (!aligned) stalePointers.push(record);
  check(`${entry.path}: child commit, gitlink, and baseline align`, aligned, `${state.revision ?? "missing"} / ${pointer ?? "missing"} / ${baselineRevision ?? "missing"}`);
}

const expectedIds = new Set([
  ...(matrix.packages ?? []),
  ...(matrix.consumers ?? []),
  ...(matrix.nonNodeConsumers ?? []),
].map((entry) => entry.path));
const partialRows = (rebaseline.dispositions ?? []).filter((row) => row.matrixStatus === "🌗");
const dispositionIds = new Set(partialRows.map((row) => row.id));
const validDispositions = new Set(["✔️", "➖", "⏸️"]);
check("matrix: all registered package paths remain unique", expectedIds.size === (matrix.packages ?? []).length + (matrix.consumers ?? []).length + (matrix.nonNodeConsumers ?? []).length, `${expectedIds.size} unique paths`);
check("rebaseline: all 18 partial rows have dispositions", partialRows.length === 18 && partialRows.every((row) => validDispositions.has(row.disposition) && row.closureTask && row.evidenceLocator?.length), `${partialRows.length} rows with explicit dispositions`);
check("rebaseline: current root revision", rebaseline.testedRootRevision === rootRevision, `${rebaseline.testedRootRevision ?? "missing"} != ${rootRevision}`);

const workflowChecks = [
  ["flutter", "flutter/.github/workflows/flutter-ci.yml", "flutter"],
  ["playground", "playground/.github/workflows/playground-ci.yml", "playground"],
  ["mcp", "mcp/.github/workflows/mcp-ci.yml", "mcp"],
];
for (const [name, relativePath, child] of workflowChecks) {
  const source = text(relativePath);
  check(`${name}: validated dispatch metadata`,
    source.includes(`submodule: '${child}'`) &&
      source.includes(`repository: 'relgeo/${child}'`) &&
      source.includes(`path: '${child}'`) &&
      source.includes("sha: context.sha") &&
      source.includes("run_id: String(context.runId)") &&
      source.includes("workflow:") &&
      source.includes("branch: context.ref"),
    `${relativePath} declares repository/path/SHA/run/workflow/branch metadata`);
}

const mcpRevision = rootGitlinks.find((entry) => entry.path === "mcp")?.gitlinkRevision;
const flutterWorkflow = text("flutter/.github/workflows/flutter-ci.yml");
const flutterDependencyRefs = [...flutterWorkflow.matchAll(/ref:\s*([0-9a-f]{40})/g)].map((match) => match[1]);
check("flutter: MCP dependency ref matches root gitlink", flutterDependencyRefs.includes(mcpRevision), `${flutterDependencyRefs.join(", ") || "missing"} != ${mcpRevision ?? "missing"}`);

const specRevision = rootGitlinks.find((entry) => entry.path === "spec")?.gitlinkRevision;
const specReferenceChecks = [
  ["flutter spec manifest", "flutter/assets/relgeo_spec/v0.5/manifest.json"],
  ["compatibility matrix", "docs/compatibility-matrix.json"],
  ["release record", "docs/releases/0.5.2.json"],
];
const staleContractReferences = [];
for (const [label, relativePath] of specReferenceChecks) {
  const source = text(relativePath);
  const key = relativePath === "flutter/assets/relgeo_spec/v0.5/manifest.json" ? "revision" : "specRevision";
  const revisions = [...source.matchAll(new RegExp(`"${key}"\\s*:\\s*"([0-9a-f]{40})"`, "g"))].map((match) => match[1]);
  const aligned = revisions.length > 0 && revisions.every((revision) => revision === specRevision);
  if (!aligned) staleContractReferences.push({ label, path: relativePath, revisions, expected: specRevision });
  check(`${label}: spec revision matches root gitlink`, aligned, `${revisions.join(", ") || "missing"} != ${specRevision ?? "missing"}`);
}

const report = {
  recordType: "cross-repository-cross-surface-reconciliation",
  schemaVersion: 1,
  capturedAt: new Date().toISOString().slice(0, 10),
  testedRootRevision: rootRevision,
  scope: {
    repositories: gitmodules.map((entry) => entry.url),
    contract: "child commit == root gitlink == generated baseline revision == clean checkout",
    claimLimit: "Local current-head reconciliation only; it does not claim provider CI dispatch, PR merge, registry, deployment, or runtime behavior.",
  },
  summary: {
    status: failures.length === 0 ? "pass" : "fail",
    checks: checks.length,
    passed: checks.length - failures.length,
    failed: failures.length,
    childRepositories: childRepositoryCommits.length,
    stalePointerCount: stalePointers.length,
    staleContractReferenceCount: staleContractReferences.length,
    gitlinkUpdateRequired: false,
  },
  rootGitlinks,
  childRepositoryCommits,
  matrix: {
    expectedPackagePathCount: expectedIds.size,
    partialRows: partialRows.length,
    disposedRows: dispositionIds.size,
    dispositionValues: [...new Set(partialRows.map((row) => row.disposition))],
  },
  stalePointers,
  staleContractReferences,
  checks,
  failures,
};

fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + "\n");
console.log(`Cross-surface reconciliation: ${report.summary.status.toUpperCase()} (${report.summary.passed}/${report.summary.checks} checks; ${report.summary.childRepositories} child commits; stalePointers=${report.summary.stalePointerCount}; staleContractReferences=${report.summary.staleContractReferenceCount}; gitlinkUpdateRequired=${report.summary.gitlinkUpdateRequired})`);
process.exitCode = failures.length === 0 ? 0 : 1;
