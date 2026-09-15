#!/usr/bin/env node

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, "..");
const localMode = process.argv.includes("--local");
const publicMode = process.argv.includes("--public");
const minimumNodeMajor = 24;
const reportArgument = process.argv.find((argument) => argument.startsWith("--report="));
const reportPath = reportArgument
  ? path.resolve(root, reportArgument.slice("--report=".length))
  : null;

if (localMode === publicMode) {
  console.error("Usage: node scripts/run-integration-gate.mjs --local|--public [--report=PATH]");
  console.error("Choose exactly one mode.");
  process.exit(2);
}

const nodeMajor = Number(process.versions.node.split(".")[0]);
if (nodeMajor < minimumNodeMajor) {
  console.error(
    `RelGeo integration gate requires Node.js ${minimumNodeMajor}+; found ${process.versions.node}.`,
  );
  process.exit(2);
}

const results = [];
const temporaryRoots = [];
const baselineManifest = JSON.parse(
  fs.readFileSync(path.join(root, "docs", "integration-baseline.json"), "utf8"),
);
const baselinePackageVersions = new Map(
  baselineManifest.submodules
    .filter((entry) => entry.package?.name && entry.package?.version)
    .map((entry) => [entry.package.name, entry.package.version]),
);

function workspaceRevision() {
  return execFileSync("git", ["rev-parse", "HEAD"], {
    cwd: root,
    encoding: "utf8",
  }).trim();
}

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

function runPackBoundaryStage(packageName, cwd) {
  const label = packageName + ": npm pack boundary";
  const startedAt = Date.now();
  const result = spawnSync("npm", ["pack", "--dry-run", "--json"], {
    cwd,
    env: process.env,
    encoding: "utf8",
  });
  let passed = result.status === 0;
  let error = result.error?.message;
  if (passed) {
    try {
      const packReport = JSON.parse(result.stdout);
      const files = packReport.flatMap((entry) => entry.files ?? []);
      const invalidFiles = files
        .map((entry) => entry.path)
        .filter((entry) =>
          typeof entry !== "string" ||
          path.isAbsolute(entry) ||
          entry.startsWith("../") ||
          /(^|\/)(node_modules|\.git|\.local|private|scratch|tmp)(\/|$)/.test(entry) ||
          /(^|\/)(\.env|[^/]+\.(pem|key|secret))$/i.test(entry),
        );
      if (invalidFiles.length > 0) {
        passed = false;
        error = "forbidden pack entries: " + invalidFiles.join(", ");
      }
    } catch (parseError) {
      passed = false;
      error = "could not parse npm pack JSON: " + parseError.message;
    }
  }
  const entry = {
    label,
    command: "npm",
    args: ["pack", "--dry-run", "--json"],
    passed,
    exitCode: result.status ?? 1,
    durationMs: Date.now() - startedAt,
    ...(error ? { error } : {}),
  };
  results.push(entry);
  console.log((passed ? "[PASS] " : "[FAIL] ") + label + " (" + entry.durationMs + " ms)");
  return passed;
}

function copyPlaygroundArtifact(label, source, destination) {
  const startedAt = Date.now();
  let passed = true;
  let error;
  try {
    fs.rmSync(destination, { recursive: true, force: true });
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.cpSync(source, destination, { recursive: true });
  } catch (copyError) {
    passed = false;
    error = copyError.message;
  }
  results.push({
    label,
    command: "copy-built-artifact",
    args: [],
    passed,
    exitCode: passed ? 0 : 1,
    durationMs: Date.now() - startedAt,
    ...(error ? { error } : {}),
  });
  console.log((passed ? "[PASS] " : "[FAIL] ") + label);
  return passed;
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

function pinPublicRegistryVersions(cwd) {
  const packagePath = path.join(cwd, "package.json");
  if (!fs.existsSync(packagePath) || baselinePackageVersions.size === 0) return () => {};

  const original = fs.readFileSync(packagePath, "utf8");
  const packageJson = JSON.parse(original);
  const pnpm = packageJson.pnpm && typeof packageJson.pnpm === "object" ? packageJson.pnpm : {};
  const overrides = pnpm.overrides && typeof pnpm.overrides === "object" ? pnpm.overrides : {};
  packageJson.pnpm = {
    ...pnpm,
    overrides: {
      ...overrides,
      ...Object.fromEntries(baselinePackageVersions),
    },
  };
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + "\n");

  return () => fs.writeFileSync(packagePath, original);
}

function runPublicPackage(packageName, repositoryPath, scripts) {
  const cwd = copyForPublicGate(repositoryPath);
  const restorePackageJson = pinPublicRegistryVersions(cwd);
  try {
    const installed = runStage(
      packageName + ": public registry install",
      "pnpm",
      ["install", "--no-frozen-lockfile", "--lockfile=false", "--registry=https://registry.npmjs.org/"],
      cwd,
    );
    if (!installed) return false;

    for (const scriptName of scripts) {
      runStage(packageName + ": " + scriptName + " (public registry)", "pnpm", ["run", scriptName], cwd);
    }
    runPackBoundaryStage(packageName, cwd);
    return true;
  } finally {
    restorePackageJson();
  }
}

function runPublicConsumer(packageName, repositoryPath, scripts, options = {}) {
  const cwd = copyForPublicGate(repositoryPath);
  const restorePackageJson = pinPublicRegistryVersions(cwd);
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
  try {
    const installed = runStage(
      packageName + ": public registry install",
      "pnpm",
      ["install", "--no-frozen-lockfile", "--lockfile=false", "--registry=https://registry.npmjs.org/"],
      cwd,
      environment,
    );
    if (!installed) return false;

    for (const scriptName of scripts) {
      if (scriptName === "test:pages-artifact" && options.playgroundDist) {
        copyPlaygroundArtifact(
          packageName + ": assemble public Playground artifact",
          options.playgroundDist,
          path.join(cwd, "dist", "playground"),
        );
      }
      runStage(packageName + ": " + scriptName + " (public registry)", "pnpm", ["run", scriptName], cwd, environment);
    }
    return { cwd, installed: true };
  } finally {
    restorePackageJson();
  }
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
    if (packageName === "relgeo-docs-site" && scriptName === "test:pages-artifact") {
      copyPlaygroundArtifact(
        "relgeo-docs-site: assemble workspace Playground artifact",
        path.join(root, "playground", "dist"),
        path.join(root, "relgeo.github.io", "dist", "playground"),
      );
    }
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

    const publicPlayground = runPublicConsumer("relgeo-playground", "playground", [
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
    ], {
      playgroundDist: publicPlayground?.cwd
        ? path.join(publicPlayground.cwd, "dist")
        : null,
    });
  } finally {
    cleanupTemporaryRoots();
  }
}

const failed = results.filter((result) => !result.passed);
const report = {
  mode: localMode ? "local-workspace" : "public-registry",
  generatedAt: new Date().toISOString(),
  passed: failed.length === 0,
  baseline: {
    workspaceRevision: workspaceRevision(),
    name: baselineManifest.baselineName,
    compatibilityLine: baselineManifest.compatibilityLine,
    submodules: baselineManifest.submodules.map((entry) => ({
      path: entry.path,
      revision: entry.revision,
      package: entry.package ?? null,
    })),
  },
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
