#!/usr/bin/env node

import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const flutterDir = resolve(root, "flutter");
const flutterBinary = process.env.RELGEO_FLUTTER_BIN || "flutter";
const stagingRoot = mkdtempSync(join(tmpdir(), "relgeo-flutter-fixtures-"));
const environment = {
  ...process.env,
  RELGEO_FIXTURE_ROOT: stagingRoot,
};

function run(label, executable, args, options = {}) {
  const result = spawnSync(executable, args, {
    cwd: options.cwd ?? root,
    env: options.env ?? environment,
    encoding: "utf8",
  });

  const output = [result.stdout, result.stderr]
    .filter((part) => typeof part === "string" && part.length > 0)
    .join("");
  if (output) process.stdout.write(output);

  if (result.error) {
    console.error(`[BLOCKED] ${label}: ${result.error.message}`);
    return false;
  }
  if (result.status !== 0) {
    console.error(`[FAIL] ${label}: exited with ${result.status}`);
    return false;
  }

  console.log(`[PASS] ${label}`);
  return true;
}

try {
  const probe = spawnSync(flutterBinary, ["--version"], {
    cwd: flutterDir,
    env: environment,
    encoding: "utf8",
  });

  if (probe.error) {
    console.error(
      `[BLOCKED] Flutter SDK tidak tersedia. Install Flutter atau set RELGEO_FLUTTER_BIN. ${probe.error.message}`,
    );
    process.exitCode = 2;
  } else if (probe.status !== 0) {
    process.stdout.write(probe.stdout ?? "");
    process.stderr.write(probe.stderr ?? "");
    console.error(`[BLOCKED] Flutter probe failed: exited with ${probe.status}`);
    process.exitCode = 2;
  } else if (
    !run(
      "stage canonical fixtures",
      process.execPath,
      [
        resolve(root, "scripts/stage-flutter-fixtures.mjs"),
        `--out=${stagingRoot}`,
      ],
      { cwd: root, env: process.env },
    )
  ) {
    process.exitCode = 1;
  } else if (
    !run(
      "flutter pub get --enforce-lockfile",
      flutterBinary,
      ["pub", "get", "--enforce-lockfile"],
      { cwd: flutterDir },
    )
  ) {
    process.exitCode = 1;
  } else if (
    !run(
      "flutter analyze (non-fatal lint baseline)",
      flutterBinary,
      ["analyze", "--no-fatal-warnings", "--no-fatal-infos"],
      { cwd: flutterDir },
    )
  ) {
    process.exitCode = 1;
  } else if (!run("flutter test", flutterBinary, ["test"], { cwd: flutterDir })) {
    process.exitCode = 1;
  }
} finally {
  rmSync(stagingRoot, { recursive: true, force: true });
}
