#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const versionArgument = process.argv.find((arg) => /^\d+\.\d+\.\d+$/.test(arg));
const recordFileArgument = process.argv.find((arg) => arg.startsWith("--record-file="));
const jsonOutput = process.argv.includes("--json");
const recordPath = recordFileArgument
  ? resolve(root, recordFileArgument.slice("--record-file=".length))
  : resolve(root, "docs/releases", `${versionArgument ?? "0.5.0"}.json`);
const matrixPath = resolve(root, "docs/compatibility-matrix.json");

function fail(message) {
  if (jsonOutput) console.log(JSON.stringify({ ok: false, error: message }, null, 2));
  else console.error(`[BLOCKED] ${message}`);
  process.exitCode = 2;
}

function findEntry(entries, path) {
  return entries.find((entry) => entry.path === path);
}

let matrix;
let record;
try {
  [matrix, record] = await Promise.all([
    readFile(matrixPath, "utf8").then(JSON.parse),
    readFile(recordPath, "utf8").then(JSON.parse),
  ]);
} catch (error) {
  fail(`cannot read matrix or release record: ${error.message}`);
}

if (matrix && record && process.exitCode !== 2) {
  const recovery = record.recovery;
  const lastPublished = recovery?.lastPublishedPackage;
  const firstFailed = recovery?.firstFailedPackage;
  const releaseOrder = matrix.policy?.releaseOrder ?? [];
  const lastIndex = releaseOrder.indexOf(lastPublished?.path);
  const failedIndex = releaseOrder.indexOf(firstFailed?.path);

  if (record.status !== "partial") {
    fail(`record ${record.releaseVersion ?? "unknown"} is ${record.status ?? "unknown"}; recovery planning requires status partial`);
  } else if (!recovery || lastIndex < 0 || failedIndex <= lastIndex) {
    fail("partial record has no coherent last-published/first-failed boundary");
  } else if (recovery.noRepublishSameVersion !== true) {
    fail("partial record does not explicitly forbid republishing the failed version");
  } else if (typeof recovery.forwardFixVersion !== "string") {
    fail("partial record does not identify a forward-fix version");
  } else {
    const packages = matrix.packages ?? [];
    const packagesRequiringReview = releaseOrder
      .slice(failedIndex)
      .map((path) => findEntry(packages, path))
      .filter(Boolean)
      .map((entry) => ({ path: entry.path, name: entry.name, currentVersion: entry.version }));
    const relativeRecord = recordPath.startsWith(`${root}/`) ? recordPath.slice(root.length + 1) : recordPath;
    const result = {
      ok: true,
      record: relativeRecord,
      releaseVersion: record.releaseVersion,
      compatibilityLine: record.compatibilityLine,
      lastPublishedPackage: lastPublished,
      firstFailedPackage: firstFailed,
      forwardFixVersion: recovery.forwardFixVersion,
      packagesRequiringForwardFixReview: packagesRequiringReview,
      commands: [
        `pnpm run release:record:check -- --record-file=${relativeRecord}`,
        "create a new release record for the forward-fix version",
        "bump and publish only the failed package with the new forward-fix version",
        "resume dependency order only after that package is verified",
        "run release:verify-published and pnpm run integration:public",
        "record the new completed or partial state; never republish the failed version",
      ],
      executed: false,
    };

    if (jsonOutput) console.log(JSON.stringify(result, null, 2));
    else {
      console.log(`RelGeo partial-release recovery plan (${result.releaseVersion} -> ${result.forwardFixVersion})`);
      console.log(`last published: ${lastPublished.name} (${lastPublished.path})`);
      console.log(`first failed: ${firstFailed.name} (${firstFailed.path})`);
      console.log(`packages requiring forward-fix review: ${packagesRequiringReview.map((entry) => entry.name).join(", ")}`);
      console.log("No registry, git, or package mutation was performed.");
      for (const [index, command] of result.commands.entries()) console.log(`${index + 1}. ${command}`);
    }
  }
}
