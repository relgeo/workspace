#!/usr/bin/env node

import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const fixtureRoot = resolve(root, "fixtures");
const manifestPath = resolve(fixtureRoot, "manifest.json");
const args = process.argv.slice(2);
const outputArg = args.find((arg) => arg.startsWith("--out="));
const statusArg = args.find((arg) => arg.startsWith("--statuses="));

if (!outputArg) {
  console.error("Usage: node scripts/stage-flutter-fixtures.mjs --out=PATH [--statuses=STATUS,...]");
  process.exitCode = 1;
} else {
  const outputRoot = resolve(root, outputArg.slice("--out=".length));
  const requestedStatuses = statusArg
    ? statusArg
        .slice("--statuses=".length)
        .split(",")
        .map((status) => status.trim())
        .filter(Boolean)
    : null;
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  const allowedStatuses = new Set(Object.keys(manifest.statusPolicy ?? {}));
  const selectedFixtures = manifest.fixtures.filter((fixture) => {
    if (!requestedStatuses) return true;
    return requestedStatuses.includes(fixture.status);
  });

  if (requestedStatuses?.some((status) => !allowedStatuses.has(status))) {
    const unknown = requestedStatuses.filter((status) => !allowedStatuses.has(status));
    console.error(`Unknown fixture status: ${unknown.join(", ")}`);
    process.exitCode = 1;
  } else if (selectedFixtures.length === 0) {
    console.error("No fixtures selected for staging.");
    process.exitCode = 1;
  } else {
    mkdirSync(outputRoot, { recursive: true });
    const stagedManifest = {
      ...manifest,
      fixtureRoot: ".",
      staging: {
        target: "relgeo/flutter",
        source: "relgeo/workspace/fixtures",
        statuses: requestedStatuses ?? [...allowedStatuses],
      },
      fixtures: selectedFixtures,
    };

    for (const fixture of selectedFixtures) {
      copyFixtureFile(fixture.path, outputRoot);
      for (const expectedPath of [
        fixture.expectedOutputPath,
        fixture.expectedResolvedPath,
        fixture.expectedHighlightSnapshotPath,
      ]) {
        if (expectedPath) copyFixtureFile(expectedPath, outputRoot);
      }
    }

    const referenceReadme = resolve(fixtureRoot, "reference", "README.md");
    if (existsSync(referenceReadme)) {
      copyFixtureFile("reference/README.md", outputRoot);
    }

    writeFileSync(
      resolve(outputRoot, "manifest.json"),
      `${JSON.stringify(stagedManifest, null, 2)}\n`,
      "utf8",
    );

    const displayedOutput = relative(root, outputRoot) || ".";
    console.log(
      `Staged ${selectedFixtures.length} fixture(s) for Flutter into ${displayedOutput}.`,
    );
    console.log("Set RELGEO_FIXTURE_ROOT to this directory before running shared-fixture tests.");
  }
}

function copyFixtureFile(manifestRelativePath, outputRoot) {
  const source = resolve(fixtureRoot, manifestRelativePath);
  const target = resolve(outputRoot, manifestRelativePath);
  const fixtureRootPrefix = `${fixtureRoot}${sep}`;
  const outputRootPrefix = `${outputRoot}${sep}`;

  if (!source.startsWith(fixtureRootPrefix) || !target.startsWith(outputRootPrefix)) {
    throw new Error(`Fixture path escapes its staging root: ${manifestRelativePath}`);
  }
  if (!existsSync(source)) {
    throw new Error(`Fixture file is missing: ${manifestRelativePath}`);
  }

  mkdirSync(dirname(target), { recursive: true });
  cpSync(source, target);
}
