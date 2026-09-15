#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, "..");
const manifestPath = path.join(root, "docs", "integration-baseline.json");
const strict = process.argv.includes("--strict");
const jsonOutput = process.argv.includes("--json");
const writeManifest = process.argv.includes("--write");
const requireMain = process.argv.includes("--require-main");

const failures = [];
const checks = [];

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
    baselineName: previous.baselineName ?? "relgeo-public-0.5-staging",
    capturedAt: new Date().toISOString().slice(0, 10),
    compatibilityLine: previous.compatibilityLine ?? "0.5",
    repository: "relgeo/workspace",
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

function verifyPackage(entry) {
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
  } catch (error) {
    record(entry.path + ": package metadata readable", false, error.message);
  }
}

try {
  const workspaceHead = runGit(["rev-parse", "HEAD"]);
  record("workspace: Git repository", Boolean(workspaceHead), workspaceHead);
  const manifest = writeManifest
    ? buildManifest(fs.existsSync(manifestPath) ? readJson(manifestPath) : {})
    : readJson(manifestPath);
  if (writeManifest) {
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
    record("manifest: regenerated", true, manifestPath);
  }
  record(
    "manifest: compatibility line",
    manifest.compatibilityLine === "0.5",
    String(manifest.compatibilityLine),
  );
  const entries = manifest.submodules;
  record(
    "manifest: submodule list",
    Array.isArray(entries) && entries.length === 11,
    String(entries?.length ?? 0),
  );
  for (const entry of entries ?? []) {
    verifySubmodule(entry);
    verifyPackage(entry);
  }
} catch (error) {
  record("baseline verifier", false, error.message);
}

if (jsonOutput) {
  process.stdout.write(JSON.stringify({ ok: failures.length === 0, strict, checks, failures }, null, 2) + "\n");
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
