import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const websiteRoot = resolve(workspaceRoot, 'relgeo.github.io');
const result = spawnSync('npm', ['run', 'build'], {
  cwd: websiteRoot,
  encoding: 'utf8',
  env: { ...process.env, CI: '1' },
});

assert.equal(result.status, 0, result.stderr || result.stdout);
const buildOutput = `${result.stdout}\n${result.stderr}`;
const pageMatch = buildOutput.match(/\[build\] (\d+) page\(s\) built in [^\n]+/);
assert.ok(pageMatch, 'static build must report the generated page count');
assert.match(buildOutput, /\[build\] Complete!/);

console.log(`PASS markdown-static-build-v1 command=npm-run-build pages=${pageMatch[1]} output=Complete`);
