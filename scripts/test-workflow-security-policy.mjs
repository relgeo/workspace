#!/usr/bin/env node

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workflowRoot = path.join(root, ".github", "workflows");
const workflowNames = fs.readdirSync(workflowRoot)
  .filter((name) => /\.ya?ml$/i.test(name))
  .sort();

assert.deepEqual(workflowNames, ["integration.yml", "sync-validated-submodule-after-ci.yml"]);

for (const name of workflowNames) {
  const source = fs.readFileSync(path.join(workflowRoot, name), "utf8");
  assert.match(source, /concurrency:[\s\S]*?cancel-in-progress:\s*true/,
    `${name} must cancel superseded runs`);
  assert.match(source, /timeout-minutes:\s*\d+/,
    `${name} must have a bounded job timeout`);

  const checkoutCount = (source.match(/uses:\s*actions\/checkout@/g) ?? []).length;
  const credentialFreeCheckoutCount = (source.match(/persist-credentials:\s*false/g) ?? []).length;
  assert.equal(credentialFreeCheckoutCount, checkoutCount,
    `${name} must disable checkout credential persistence`);
  assert.doesNotMatch(source, /actions:\s*write/,
    `${name} must not request Actions write permission`);
}

const integration = fs.readFileSync(path.join(workflowRoot, "integration.yml"), "utf8");
assert.match(integration, /permissions:\s*\n\s*contents:\s*read/);
assert.doesNotMatch(integration, /pull-requests:\s*write|contents:\s*write/);

const sync = fs.readFileSync(
  path.join(workflowRoot, "sync-validated-submodule-after-ci.yml"),
  "utf8",
);
assert.match(sync, /permissions:\s*\n\s*contents:\s*write\n\s*pull-requests:\s*write\n\s*actions:\s*read/);
assert.match(sync, /persist-credentials:\s*false/);
assert.match(sync, /repository_dispatch:/);
assert.match(sync, /peter-evans\/create-pull-request@v7/);

console.log("Workflow security policy passed: bounded runs, credential-free checkout, and least-privilege permissions.");
