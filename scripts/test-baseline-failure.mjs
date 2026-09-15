#!/usr/bin/env node

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, "..");
const sourceManifest = path.join(root, "docs", "integration-baseline.json");
const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), "relgeo-baseline-failure-"));
const mutatedManifest = path.join(temporaryRoot, "integration-baseline.json");

try {
  const manifest = JSON.parse(fs.readFileSync(sourceManifest, "utf8"));
  const firstEntry = manifest.submodules?.[0];
  if (!firstEntry?.revision) {
    throw new Error("Baseline manifest has no submodule revision to mutate");
  }

  firstEntry.revision = (firstEntry.revision[0] === "0" ? "1" : "0") + firstEntry.revision.slice(1);
  fs.writeFileSync(mutatedManifest, JSON.stringify(manifest, null, 2) + "\n");

  const result = spawnSync(
    process.execPath,
    ["scripts/verify-baseline.mjs", "--manifest=" + mutatedManifest, "--json"],
    { cwd: root, encoding: "utf8" },
  );

  if (result.status === 0) {
    throw new Error("Verifier unexpectedly accepted a mutated baseline revision");
  }

  const report = JSON.parse(result.stdout);
  const revisionFailure = report.failures?.find((failure) =>
    failure.label === firstEntry.path + ": manifest revision matches gitlink",
  );
  if (!revisionFailure) {
    throw new Error("Verifier failed, but did not identify the mutated submodule revision");
  }

  console.log("Baseline failure injection passed: a mutated revision fails with an actionable mismatch.");
} finally {
  fs.rmSync(temporaryRoot, { recursive: true, force: true });
}
