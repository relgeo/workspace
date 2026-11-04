#!/usr/bin/env node

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const syncWorkflow = fs.readFileSync(
  path.join(root, ".github", "workflows", "sync-validated-submodule-after-ci.yml"),
  "utf8",
);

assert.match(syncWorkflow, /repository_dispatch:\s*\n\s*types: \[submodule_ci_succeeded, flutter_ci_succeeded\]/);
assert.match(syncWorkflow, /workflow_dispatch:\s*\n\s*inputs:/);
assert.match(syncWorkflow, /concurrency:[\s\S]*?cancel-in-progress: true/);
assert.match(syncWorkflow, /contents: write[\s\S]*?pull-requests: write[\s\S]*?actions: read/);
assert.match(syncWorkflow, /const specs = \{[\s\S]*?flutter:[\s\S]*?playground:[\s\S]*?mcp:/);
assert.match(syncWorkflow, /!\/\^\[0-9a-f\]\{40\}\$\//);
assert.match(syncWorkflow, /!\/\^\\d\+\$\//);
assert.match(syncWorkflow, /payloadRepository && payloadRepository !== expectedRepository/);
assert.match(syncWorkflow, /payloadPath && payloadPath !== spec\.path/);
assert.match(syncWorkflow, /payloadWorkflow && payloadWorkflow !== spec\.workflow/);
assert.match(syncWorkflow, /run\.head_sha !== expectedSha/);
assert.match(syncWorkflow, /run\.conclusion !== 'success'/);
assert.match(syncWorkflow, /run\.event !== 'push' \|\| run\.head_branch !== 'main'/);
assert.match(syncWorkflow, /run\.path !== expectedWorkflow/);
assert.match(syncWorkflow, /run\.head_repository\?\.full_name/);
assert.match(syncWorkflow, /git -C "\$SUBMODULE_PATH" fetch --no-tags origin "\$SUBMODULE_SHA"/);
assert.match(syncWorkflow, /git -C "\$SUBMODULE_PATH" checkout --detach "\$SUBMODULE_SHA"/);
assert.match(syncWorkflow, /git ls-tree HEAD "\$SUBMODULE_PATH" \| awk '\{print \$3\}'/);
assert.match(syncWorkflow, /git add "\$SUBMODULE_PATH"/);
assert.match(syncWorkflow, /changed=false/);
assert.match(syncWorkflow, /node scripts\/verify-baseline\.mjs --write/);
assert.match(syncWorkflow, /pnpm run verify:baseline:strict/);
assert.match(syncWorkflow, /pnpm run compatibility:check/);
assert.match(syncWorkflow, /peter-evans\/create-pull-request@v7/);
assert.match(syncWorkflow, /workflow_id: 'integration\.yml'/);
assert.match(syncWorkflow, /persist-credentials: false/);

const childWorkflows = [
  ["flutter", "flutter/.github/workflows/flutter-ci.yml"],
  ["playground", "playground/.github/workflows/playground-ci.yml"],
  ["mcp", "mcp/.github/workflows/mcp-ci.yml"],
];
for (const [submodule, relativePath] of childWorkflows) {
  const workflow = fs.readFileSync(path.join(root, relativePath), "utf8");
  assert.match(workflow, /permissions:\s*\n\s*contents: read/);
  assert.match(workflow, /concurrency:[\s\S]*?cancel-in-progress: true/);
  assert.match(workflow, /needs\.quality\.result == 'success'/);
  assert.match(workflow, /github\.ref == 'refs\/heads\/main'/);
  assert.match(workflow, /event_type: 'submodule_ci_succeeded'/);
  assert.match(workflow, new RegExp(`submodule: '${submodule}'`));
  assert.match(workflow, new RegExp(`repository: 'relgeo/${submodule}'`));
  assert.match(workflow, new RegExp(`path: '${submodule}'`));
  assert.match(workflow, /sha: context\.sha/);
  assert.match(workflow, /run_id: String\(context\.runId\)/);
  assert.match(workflow, /workflow: '\.github\/workflows\/[a-z-]+-ci\.yml'/);
  assert.match(workflow, /WORKSPACE_DISPATCH_TOKEN/);
}

const verifier = fs.readFileSync(path.join(root, "scripts", "verify-baseline.mjs"), "utf8");
assert.match(verifier, /function buildManifest/);
assert.match(verifier, /if \(writeManifest\)/);
assert.match(verifier, /rootRevision/);
assert.match(verifier, /submodules/);

console.log("Child-CI synchronization contract tests passed: allowlist, exact run validation, concurrency, gitlink staging, baseline regeneration, PR flow, and child dispatch metadata.");
