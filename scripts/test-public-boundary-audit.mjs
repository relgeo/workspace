#!/usr/bin/env node

import assert from "node:assert/strict";
import { inspectPublicEntries } from "./public-boundary.mjs";

const clean = inspectPublicEntries(["docs/evidence/public-boundary-audit.json", "playground/dist/index.html"]);
assert.equal(clean.passed, true);

const unsafe = inspectPublicEntries([".env.production", "private/output.key", "../operator.log"], {
  contents: [{ path: "artifact.json", content: "-----BEGIN PRIVATE KEY-----" }],
});
assert.equal(unsafe.passed, false);
assert.deepEqual(
  unsafe.violations.map(({ path, reason }) => `${path}:${reason}`).sort(),
  [
    "../operator.log:absolute-or-parent-traversal",
    ".env.production:credential-or-environment-file",
    "artifact.json:credential-like-content",
    "private/output.key:private-or-generated-directory",
  ].sort(),
);

console.log("Public-boundary audit contract passed: clean entries pass and unsafe paths/content fail closed.");
