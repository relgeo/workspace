#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const matrixPath = resolve(root, "docs/compatibility-matrix.json");
const jsonOutput = process.argv.includes("--json");
const results = [];
const failures = [];

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

function check(condition, message) {
  const status = condition ? "PASS" : "FAIL";
  results.push({ status, message });
  if (!condition) failures.push(message);
}

function isAllowedPackPath(filePath, declaredFiles) {
  if (["package.json", "README.md", "LICENSE", "LICENCE"].includes(filePath)) return true;
  return declaredFiles.some((declaredFile) => {
    const normalized = declaredFile.replace(/\/$/, "");
    return filePath === normalized || filePath.startsWith(`${normalized}/`);
  });
}

function runPack(repositoryPath) {
  const result = spawnSync("npm", ["pack", "--dry-run", "--json"], {
    cwd: resolve(root, repositoryPath),
    encoding: "utf8",
    env: process.env,
  });
  if (result.status !== 0) {
    return { error: result.error?.message ?? (result.stderr.trim() || `npm exited with ${result.status}`) };
  }
  try {
    return { files: JSON.parse(result.stdout).flatMap((entry) => entry.files ?? []) };
  } catch (error) {
    return { error: `could not parse npm pack JSON: ${error.message}` };
  }
}

const matrix = await readJson(matrixPath);
check(
  matrix.policy?.internalDependencyRange === `^${matrix.compatibilityLine}.0`,
  "release policy has an explicit internal dependency range",
);

for (const entry of matrix.packages) {
  const packageRoot = resolve(root, entry.path);
  let packageJson;
  try {
    packageJson = await readJson(resolve(packageRoot, "package.json"));
  } catch (error) {
    check(false, `${entry.path}: package.json is unreadable (${error.message})`);
    continue;
  }

  check(packageJson.private !== true, `${entry.path}: package is publishable (not private)`);
  check(packageJson.name === entry.name, `${entry.path}: package name matches the matrix`);
  check(packageJson.version === entry.version, `${entry.path}: package version matches the matrix`);
  check(packageJson.license === "MIT", `${entry.path}: license is MIT`);
  check(packageJson.author?.name === "Agus Made", `${entry.path}: author name is present`);
  check(packageJson.author?.email === "krisnaparta@gmail.com", `${entry.path}: author email is present`);
  check(packageJson.author?.url === "https://github.com/agusmade", `${entry.path}: author URL is present`);
  check(
    typeof packageJson.repository?.url === "string" &&
      packageJson.repository.url.includes(`github.com/relgeo/${entry.path}.git`),
    `${entry.path}: repository metadata points to the RelGeo repository`,
  );
  check(
    Array.isArray(packageJson.files) && packageJson.files.includes("dist"),
    `${entry.path}: package files allowlist includes dist`,
  );

  const pack = runPack(entry.path);
  check(
    !pack.error,
    `${entry.path}: npm pack --dry-run succeeds${pack.error ? ` (${pack.error})` : ""}`,
  );
  if (pack.error) continue;
  const filePaths = pack.files.map((file) => file.path);
  const invalidFiles = filePaths.filter((filePath) => !isAllowedPackPath(filePath, packageJson.files ?? []));
  check(
    invalidFiles.length === 0,
    `${entry.path}: tarball contains only declared/public files${invalidFiles.length ? ` (${invalidFiles.join(", ")})` : ""}`,
  );
  check(filePaths.includes("package.json"), `${entry.path}: tarball contains package.json`);
  check(filePaths.includes("README.md"), `${entry.path}: tarball contains README.md`);
  check(filePaths.includes("LICENSE"), `${entry.path}: tarball contains LICENSE`);
  check(filePaths.some((filePath) => filePath.startsWith("dist/")), `${entry.path}: tarball contains built dist output`);
}

const summary = {
  matrix: matrixPath.slice(root.length + 1),
  compatibilityLine: matrix.compatibilityLine,
  packageCount: matrix.packages.length,
  passed: results.filter(({ status }) => status === "PASS").length,
  failed: failures.length,
  failures,
};

if (jsonOutput) {
  console.log(JSON.stringify(summary, null, 2));
} else {
  console.log(`RelGeo release readiness (${matrix.compatibilityLine})`);
  for (const result of results) console.log(`[${result.status}] ${result.message}`);
  console.log(`summary: ${summary.passed} passed, ${summary.failed} failed`);
}

process.exitCode = failures.length > 0 ? 1 : 0;
