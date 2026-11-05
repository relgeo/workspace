#!/usr/bin/env node

import assert from "node:assert/strict";
import { inspectPublicEntries, PUBLIC_BOUNDARY_CONTRACT } from "./public-boundary.mjs";

const clean = inspectPublicEntries(
  ["scripts/bootstrap.mjs", "docs/report.json", "package/dist/index.js"],
  { contents: [{ path: "docs/report.json", content: '{"evidenceClass":"local-workspace"}' }] },
);
assert.equal(clean.contract, PUBLIC_BOUNDARY_CONTRACT);
assert.equal(clean.passed, true);
assert.equal(clean.violations.length, 0);

const unsafe = inspectPublicEntries([
  "../secret.txt",
  "/Users/operator/private/report.json",
  "cache/output.json",
  ".env.production",
  "dist/private.key",
  "node_modules/pkg/index.js",
], {
  contents: [{ path: "docs/report.json", content: "ACCESS_TOKEN=must-not-ship" }],
});
assert.equal(unsafe.passed, false);
assert.deepEqual(
  unsafe.violations.map(({ path, reason }) => `${path}:${reason}`),
  [
    "/Users/operator/private/report.json:absolute-or-parent-traversal",
    "../secret.txt:absolute-or-parent-traversal",
    ".env.production:credential-or-environment-file",
    "cache/output.json:private-or-generated-directory",
    "dist/private.key:credential-or-environment-file",
    "docs/report.json:credential-like-content",
    "node_modules/pkg/index.js:private-or-generated-directory",
  ].sort(),
);

const deterministic = inspectPublicEntries(["b.txt", "a.txt"], {
  contents: [{ path: "a.txt", content: "-----BEGIN PRIVATE KEY-----" }],
});
assert.deepEqual(deterministic.violations, [
  { path: "a.txt", reason: "credential-like-content" },
]);

const unsafeContentPath = inspectPublicEntries([], {
  contents: [{ path: "/tmp/report.json", content: "safe" }],
});
assert.deepEqual(unsafeContentPath.violations, [
  { path: "/tmp/report.json", reason: "absolute-or-parent-traversal" },
]);

console.log("Public-boundary contract tests passed: clean entries pass and unsafe paths/content fail closed.");
