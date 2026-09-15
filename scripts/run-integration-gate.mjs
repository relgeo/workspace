#!/usr/bin/env node

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, "..");
const localMode = process.argv.includes("--local");
const publicMode = process.argv.includes("--public");
const reportArgument = process.argv.find((argument) => argument.startsWith("--report="));
const reportPath = reportArgument
  ? path.resolve(root, reportArgument.slice("--report=".length))
  : null;

if (localMode === publicMode) {
  console.error("Usage: node scripts/run-integration-gate.mjs --local|--public [--report=PATH]");
  console.error("Choose exactly one mode.");
  process.exit(2);
}

const results = [];
const temporaryRoots = [];

function runStage(label, command, args, cwd = root, environment = process.env) {
  const startedAt = Date.now();
  console.log("\n==> " + label);
  console.log("$ " + [command, ...args].join(" "));
  const result = spawnSync(command, args, {
    cwd,
    env: environment,
    stdio: "inherit",
  });
  const passed = result.status === 0;
  const entry = {
    label,
    command,
    args,
    passed,
    exitCode: result.status ?? 1,
    durationMs: Date.now() - startedAt,
  };
  if (result.error) entry.error = result.error.message;
  results.push(entry);
  console.log((passed ? "[PASS] " : "[FAIL] ") + label + " (" + entry.durationMs + " ms)");
  return passed;
}

function runWorkspacePackageStage(packageName, scriptName) {
  return runStage(
    packageName + ": " + scriptName,
    "pnpm",
    ["--filter", packageName, "run", scriptName],
  );
}

function copyForPublicGate(repositoryPath) {
  const source = path.join(root, repositoryPath);
  const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), "relgeo-integration-"));
  const target = path.join(temporaryRoot, path.basename(repositoryPath));
  const excluded = new Set([
    ".git",
    "node_modules",
    "dist",
    "dist-ssr",
    "build",
    ".astro",
    ".vite",
    "coverage",
    ".local",
  ]);
  fs.cpSync(source, target, {
    recursive: true,
    filter(sourcePath) {
      const relative = path.relative(source, sourcePath);
      const firstSegment = relative.split(path.sep)[0];
      return !excluded.has(firstSegment);
    },
  });
  temporaryRoots.push(temporaryRoot);
  return target;
}

function runPublicPackage(packageName, repositoryPath, scripts) {
  const cwd = copyForPublicGate(repositoryPath);
  const installed = runStage(
    packageName + ": public registry install",
    "pnpm",
    ["install", "--no-frozen-lockfile", "--registry=https://registry.npmjs.org/"],
    cwd,
  );
  if (!installed) return false;

  for (const scriptName of scripts) {
    runStage(packageName + ": " + scriptName + " (public registry)", "pnpm", ["run", scriptName], cwd);
  }
  runStage(packageName + ": npm pack dry-run", "npm", ["pack", "--dry-run"], cwd);
  return true;
}

function runPublicConsumer(packageName, repositoryPath, scripts) {
  const cwd = copyForPublicGate(repositoryPath);
  let environment = process.env;
  if (repositoryPath === "relgeo.github.io") {
    const specTarget = path.join(cwd, ".ci", "spec");
    fs.mkdirSync(path.dirname(specTarget), { recursive: true });
    fs.cpSync(path.join(root, "spec"), specTarget, {
      recursive: true,
      filter: (sourcePath) => path.basename(sourcePath) !== ".git",
    });
    environment = {
      ...process.env,
      RELGEO_SPEC_PATH: path.join(specTarget, "id"),
    };
  }
  const installed = runStage(
    packageName + ": public registry install",
    "pnpm",
    ["install", "--no-frozen-lockfile", "--registry=https://registry.npmjs.org/"],
    cwd,
    environment,
  );
  if (!installed) return false;

  for (const scriptName of scripts) {
    runStage(packageName + ": " + scriptName + " (public registry)", "pnpm", ["run", scriptName], cwd, environment);
  }
  return true;
}

function cleanupTemporaryRoots() {
  for (const temporaryRoot of temporaryRoots) {
    fs.rmSync(temporaryRoot, { recursive: true, force: true });
  }
}

runStage("baseline: strict verification", process.execPath, [
  "scripts/verify-baseline.mjs",
  "--strict",
]);
runStage("baseline: failure injection", process.execPath, [
  "scripts/test-baseline-failure.mjs",
]);

if (localMode) {
  runStage("workspace: frozen install", "pnpm", ["install", "--frozen-lockfile"]);

  const packageStages = [
    ["@relgeo/geometry", ["lint", "test", "build"]],
    ["@relgeo/core", ["lint", "test", "build"]],
    ["@relgeo/renderer-svg", ["lint", "test", "build", "test:dist"]],
    ["@relgeo/language-service", ["lint", "test", "build"]],
    ["@relgeo/remark-relgeo-hl", ["lint", "test", "build"]],
    ["@relgeo/remark-relgeo", ["lint", "test", "build"]],
    ["@relgeo/cli", ["test", "build"]],
  ];

  for (const [packageName, scripts] of packageStages) {
    for (const scriptName of scripts) {
      runWorkspacePackageStage(packageName, scriptName);
    }
  }

  const consumerStages = [
    ["relgeo-playground", "lint"],
    ["relgeo-playground", "test"],
    ["relgeo-playground", "audit:ux"],
    ["relgeo-playground", "build"],
    ["relgeo-docs-site", "check"],
    ["relgeo-docs-site", "build"],
    ["relgeo-docs-site", "test"],
    ["relgeo-docs-site", "test:pages-artifact"],
  ];

  for (const [packageName, scriptName] of consumerStages) {
    runWorkspacePackageStage(packageName, scriptName);
  }
} else {
  try {
    const packageStages = [
      ["@relgeo/geometry", "geometry", ["lint", "test", "build"]],
      ["@relgeo/core", "core", ["lint", "test", "build"]],
      ["@relgeo/renderer-svg", "renderer-svg", ["lint", "test", "build", "test:dist"]],
      ["@relgeo/language-service", "language-service", ["lint", "test", "build"]],
      ["@relgeo/remark-relgeo-hl", "remark-relgeo-hl", ["lint", "test", "build"]],
      ["@relgeo/remark-relgeo", "remark-relgeo", ["lint", "test", "build"]],
      ["@relgeo/cli", "cli", ["test", "build"]],
    ];

    for (const [packageName, repositoryPath, scripts] of packageStages) {
      runPublicPackage(packageName, repositoryPath, scripts);
    }

    runPublicConsumer("relgeo-playground", "playground", [
      "lint",
      "test",
      "audit:ux",
      "build",
    ]);
    runPublicConsumer("relgeo-docs-site", "relgeo.github.io", [
      "check",
      "build",
      "test",
      "test:pages-artifact",
    ]);
  } finally {
    cleanupTemporaryRoots();
  }
}

const failed = results.filter((result) => !result.passed);
const report = {
  mode: localMode ? "local-workspace" : "public-registry",
  generatedAt: new Date().toISOString(),
  passed: failed.length === 0,
  summary: {
    total: results.length,
    passed: results.length - failed.length,
    failed: failed.length,
  },
  results,
};

if (reportPath) {
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + "\n");
  console.log("\nReport: " + reportPath);
}

console.log(
  "\nIntegration gate summary: " +
    report.summary.passed +
    " passed, " +
    report.summary.failed +
    " failed, " +
    report.summary.total +
    " total",
);

process.exitCode = failed.length ? 1 : 0;
