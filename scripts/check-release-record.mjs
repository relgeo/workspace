#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const matrixPath = resolve(root, "docs/compatibility-matrix.json");
const recordVersion = process.argv.find((arg) => /^\d+\.\d+\.\d+$/.test(arg)) ?? "0.5.0";
const recordFileArgument = process.argv.find((arg) => arg.startsWith("--record-file="));
const recordPath = recordFileArgument
  ? resolve(root, recordFileArgument.slice("--record-file=".length))
  : resolve(root, "docs/releases", `${recordVersion}.json`);
const jsonOutput = process.argv.includes("--json");
const results = [];
const failures = [];
let readFailure = false;

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

function check(condition, message) {
  const status = condition ? "PASS" : "FAIL";
  results.push({ status, message });
  if (!condition) failures.push(message);
}

function sameArray(actual, expected) {
  return Array.isArray(actual) && actual.length === expected.length && actual.every((value, index) => value === expected[index]);
}

function entriesMatch(actual, expected, status) {
  return Array.isArray(actual) && actual.length === expected.length && expected.every((entry) => {
    const found = actual.find((candidate) => candidate.path === entry.path);
    return found?.path === entry.path && found.name === entry.name && found.version === entry.version && found.status === status;
  });
}

function planEntriesMatch(actual, expected) {
  const allowedStatuses = new Set(["retained", "planned", "published", "failed", "skipped"]);
  return Array.isArray(actual) && actual.length === expected.length && expected.every((entry) => {
    const found = actual.find((candidate) => candidate.path === entry.path);
    return found?.path === entry.path &&
      found.name === entry.name &&
      found.fromVersion === entry.version &&
      typeof found.targetVersion === "string" &&
      /^\d+\.\d+\.\d+$/.test(found.targetVersion) &&
      allowedStatuses.has(found.status);
  });
}

function versionTuple(value) {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(value ?? "");
  return match ? match.slice(1).map(Number) : null;
}

function patchIncreases(fromVersion, targetVersion) {
  const from = versionTuple(fromVersion);
  const target = versionTuple(targetVersion);
  return Boolean(from && target && target[0] === from[0] && target[1] === from[1] && target[2] > from[2]);
}

function releasePackagePlanMatches(actual, expected, contractChange, bumpPolicy) {
  if (!planEntriesMatch(actual, expected)) return false;
  if (!sameArray(actual.map((entry) => entry.path), expected.map((entry) => entry.path))) return false;

  return actual.every((entry) => {
    const isRetained = entry.targetVersion === entry.fromVersion;
    if (isRetained && entry.status !== "retained") return false;
    if (!isRetained && !["planned", "published", "failed", "skipped"].includes(entry.status)) return false;
    if (contractChange === "none") return isRetained;
    if (contractChange === "patch-compatible") {
      return isRetained || (
        bumpPolicy?.[contractChange]?.sameCompatibilityLine === true &&
        bumpPolicy?.[contractChange]?.targetPatchMustIncrease === true &&
        patchIncreases(entry.fromVersion, entry.targetVersion)
      );
    }
    return true;
  });
}

function consumerPlanMatches(actual, expected) {
  const allowedStatuses = new Set(["pending", "verified", "blocked", "not-run"]);
  return Array.isArray(actual) && actual.length === expected.length && expected.every((entry) => {
    const found = actual.find((candidate) => candidate.path === entry.path);
    return found?.path === entry.path &&
      found.name === entry.name &&
      found.version === entry.version &&
      allowedStatuses.has(found.status);
  });
}

function semverParts(value) {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(value ?? "");
  return match ? match.slice(1).map(Number) : null;
}

function isGreaterVersion(candidate, base) {
  const left = semverParts(candidate);
  const right = semverParts(base);
  if (!left || !right) return false;
  for (let index = 0; index < left.length; index += 1) {
    if (left[index] !== right[index]) return left[index] > right[index];
  }
  return false;
}

let matrix;
let record;
try {
  [matrix, record] = await Promise.all([readJson(matrixPath), readJson(recordPath)]);
} catch (error) {
  readFailure = true;
  console.error(`Could not read release record: ${error.message}`);
}

if (matrix && record) {
  check(record.schemaVersion === 1, "release record schema version is supported");
  check(record.releaseVersion === recordVersion, `record version is ${recordVersion}`);
  check(["planned", "partial", "completed"].includes(record.status), "release record status is supported");
  check(record.compatibilityLine === matrix.compatibilityLine, "record and matrix use the same compatibility line");
  const releaseDecision = matrix.policy?.releaseDecision;
  check(
    Array.isArray(releaseDecision?.requiredWhen) &&
      releaseDecision.requiredWhen.includes("breaking") &&
      releaseDecision.requiredWhen.includes("partial"),
    "matrix declares when a release decision record is required",
  );
  check(
    Array.isArray(releaseDecision?.allowedContractChanges) &&
      releaseDecision.allowedContractChanges.includes(record.decision?.contractChange),
    "record contract-change classification is allowed by the matrix",
  );
  check(
    typeof record.decision?.rationale === "string" && record.decision.rationale.trim().length > 0,
    "record contains a compatibility rationale",
  );
  check(
    ["approved", "rejected", "deferred"].includes(record.decision?.approvalStatus),
    "record contains an explicit approval status",
  );
  check(
    record.status !== "completed" || record.decision?.approvalStatus === "approved",
    "completed release record has approval",
  );
  check(
    record.status !== "partial" ||
      record.decision?.partialReleasePolicy === releaseDecision?.partialReleasePolicy,
    "partial release record follows the matrix forward-fix policy",
  );
  check(record.decision?.specRevision === matrix.contract.specRevision, "record spec revision matches the matrix contract revision");
  check(sameArray(record.releaseOrder, matrix.policy.releaseOrder), "record release order matches the compatibility matrix");
  check(record.publicationMode === "manual-2fa", "publication mode is explicit and does not imply automated publishing");

  if (record.status === "completed") {
    check(entriesMatch(record.packages, matrix.packages, "published"), "every matrix package is recorded as published at the expected version");
    check(entriesMatch(record.consumers, matrix.consumers, "verified"), "every matrix consumer is recorded as verified at the expected version");
  } else {
    check(record.baseReleaseVersion === "0.5.0", "planned or partial record identifies the current base release");
    check(
      releasePackagePlanMatches(record.packagePlan, matrix.packages, record.decision?.contractChange, matrix.policy?.bumpPolicy),
      "candidate package plan follows matrix package order and bump policy",
    );
    check(consumerPlanMatches(record.consumers, matrix.consumers), "candidate consumer plan covers every matrix consumer");

    const changedPackages = record.packagePlan?.filter((entry) => entry.targetVersion !== entry.fromVersion) ?? [];
    check(changedPackages.length > 0, "candidate package plan contains at least one versioned package change");
    check(
      changedPackages.every((entry) => entry.targetVersion.startsWith(`${matrix.compatibilityLine}.`)),
      "candidate package changes stay on the active compatibility line",
    );
    if (record.status === "partial") {
      const recovery = record.recovery;
      const lastPublished = recovery?.lastPublishedPackage;
      const firstFailed = recovery?.firstFailedPackage;
      const releaseOrder = matrix.policy.releaseOrder;
      check(recovery?.noRepublishSameVersion === true, "partial recovery forbids republishing the failed version");
      check(recovery?.partialReleasePolicy === releaseDecision?.partialReleasePolicy, "partial recovery repeats the matrix policy");
      check(typeof recovery?.forwardFixVersion === "string", "partial recovery identifies a forward-fix version");
      check(isGreaterVersion(recovery?.forwardFixVersion, record.releaseVersion), "forward-fix version is newer than the partial release");
      check(recovery?.forwardFixVersion?.startsWith(`${matrix.compatibilityLine}.`), "forward-fix stays on the active compatibility line");
      check(
        typeof lastPublished?.path === "string" &&
          typeof lastPublished?.name === "string" &&
          lastPublished?.status === "published" &&
          lastPublished?.version === record.releaseVersion,
        "partial recovery records the last package published at the failed version",
      );
      check(
        typeof firstFailed?.path === "string" &&
          typeof firstFailed?.name === "string" &&
          firstFailed?.status === "failed" &&
          firstFailed?.version === record.releaseVersion,
        "partial recovery records the first package that failed",
      );
      check(
        releaseOrder.indexOf(lastPublished?.path) >= 0 &&
          releaseOrder.indexOf(firstFailed?.path) > releaseOrder.indexOf(lastPublished?.path),
        "partial recovery package order is coherent",
      );
    }
  }

  const evidence = record.evidence ?? {};
  if (record.status === "completed") {
    for (const [key, label] of [
      ["localIntegration", "local integration evidence"],
      ["publicIntegration", "public integration evidence"],
      ["conformanceFixtures", "conformance fixture evidence"],
      ["releaseAudit", "release audit evidence"],
      ["registryVerification", "registry verification evidence"],
    ]) {
      check(Number.isInteger(evidence[key]?.passed) && evidence[key].passed > 0, `${label} has a positive pass count`);
      check(evidence[key]?.failed === 0, `${label} has zero failures`);
    }
    check(evidence.compatibilityCheck?.status === "passed", "compatibility check evidence is passed");
    check(evidence.publicPlaygroundSmoke?.automated === false, "public Playground smoke is honestly marked as manual");
    check(evidence.publicPlaygroundSmoke?.status === "passed", "public Playground smoke evidence is passed");
    check(typeof evidence.publicPlaygroundSmoke?.url === "string" && evidence.publicPlaygroundSmoke.url.startsWith("https://"), "public Playground smoke records an HTTPS URL");
    check(Array.isArray(evidence.publicPlaygroundSmoke?.checks) && evidence.publicPlaygroundSmoke.checks.length >= 3, "public Playground smoke records actionable checks");
  }

  const serialized = JSON.stringify(record);
  check(!serialized.includes("/Users/") && !serialized.includes("/home/"), "release record contains no operator-specific absolute path");
  check(!/token|password|secret/i.test(serialized), "release record contains no credential-like field or value");
}

const summary = {
  record: recordPath.startsWith(`${root}/`) ? recordPath.slice(root.length + 1) : recordPath,
  compatibilityLine: record?.compatibilityLine ?? null,
  passed: results.filter(({ status }) => status === "PASS").length,
  failed: failures.length,
  failures,
};

if (jsonOutput) console.log(JSON.stringify(summary, null, 2));
else {
  console.log(`RelGeo release record (${summary.compatibilityLine ?? "unknown"})`);
  for (const result of results) console.log(`[${result.status}] ${result.message}`);
  console.log(`summary: ${summary.passed} passed, ${summary.failed} failed`);
}

process.exitCode = readFailure || failures.length > 0 ? 1 : 0;
