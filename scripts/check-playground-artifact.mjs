#!/usr/bin/env node

import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { access, readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const playgroundDist = resolveArgument('--playground-dist', join(root, 'playground', 'dist'));
const websiteDist = resolveArgument('--website-dist', join(root, 'relgeo.github.io', 'dist'));

function resolveArgument(name, fallback) {
  const argument = process.argv.find((value) => value.startsWith(`${name}=`));
  return argument ? resolve(argument.slice(name.length + 1)) : fallback;
}

function gitRevision(repositoryPath) {
  return execFileSync('git', ['-C', repositoryPath, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
}

function assetReferences(html) {
  return [...html.matchAll(/(?:src|href)="\/playground\/(assets\/[^"?#]+)"/g)]
    .map(([, asset]) => asset)
    .sort();
}

async function readEntry(dist) {
  const htmlPath = join(dist, 'index.html');
  await access(htmlPath);
  const html = await readFile(htmlPath, 'utf8');
  assert.match(html, /<title>RelGeo Playground<\/title>/, `${dist}: title`);
  assert.match(html, /\/playground\/assets\//, `${dist}: Playground asset route`);
  return { html, assets: assetReferences(html) };
}

async function digest(path) {
  return createHash('sha256').update(await readFile(path)).digest('hex');
}

const source = await readEntry(playgroundDist);
const assembled = await readEntry(join(websiteDist, 'playground'));
assert.deepEqual(assembled.assets, source.assets, 'assembled entrypoint must use the same asset set');

const sourceProvenance = JSON.parse(await readFile(join(playgroundDist, 'playground-provenance.json'), 'utf8'));
const assembledProvenance = JSON.parse(await readFile(join(websiteDist, 'playground', 'playground-provenance.json'), 'utf8'));
const expectedRevision = gitRevision(join(root, 'playground'));
for (const [label, provenance] of [['source', sourceProvenance], ['assembled', assembledProvenance]]) {
  assert.equal(provenance.artifact, 'relgeo-playground', `${label} artifact provenance kind`);
  assert.equal(provenance.sourcePath, 'playground', `${label} artifact provenance source`);
  assert.equal(provenance.sourceRevision, expectedRevision, `${label} artifact provenance child revision`);
  assert.equal(provenance.entrypoint, 'index.html', `${label} artifact provenance entrypoint`);
}

assert.deepEqual(
  Object.keys(assembledProvenance.fileDigests ?? {}).sort(),
  Object.keys(sourceProvenance.fileDigests ?? {}).sort(),
  'assembled provenance must list the same files as the source build',
);

for (const [file, sourceDigest] of Object.entries(sourceProvenance.fileDigests ?? {})) {
  const assembledPath = join(websiteDist, 'playground', file);
  const assembledDigest = await digest(assembledPath);
  assert.equal(
    assembledDigest,
    sourceDigest,
    `assembled file must match source: ${file}`,
  );
  assert.equal(assembledProvenance.fileDigests[file], assembledDigest, `provenance digest must match assembled file: ${file}`);
}

const baseline = JSON.parse(await readFile(join(root, 'docs', 'integration-baseline.json'), 'utf8'));
const baselinePlayground = baseline.submodules?.find((entry) => entry.path === 'playground')?.revision;
assert.match(baselinePlayground ?? '', /^[0-9a-f]{40}$/, 'integration baseline Playground revision');
assert.equal(baselinePlayground, expectedRevision, 'artifact child revision must match integration baseline');
const workflow = await readFile(join(root, 'relgeo.github.io', '.github', 'workflows', 'pages.yml'), 'utf8');
const workflowPlayground = workflow.match(/name: Checkout playground[\s\S]*?ref:\s*([0-9a-f]{40})/)?.[1];
assert.match(workflowPlayground ?? '', /^[0-9a-f]{40}$/, 'Pages workflow Playground revision');
assert.equal(workflowPlayground, expectedRevision, 'artifact child revision must match Pages workflow pin');
const baselineSpec = baseline.submodules?.find((entry) => entry.path === 'spec')?.revision;
assert.match(baselineSpec ?? '', /^[0-9a-f]{40}$/, 'integration baseline spec revision');
const workflowSpec = workflow.match(/name: Checkout spec[\s\S]*?ref:\s*([0-9a-f]{40})/)?.[1];
assert.match(workflowSpec ?? '', /^[0-9a-f]{40}$/, 'Pages workflow spec revision');
assert.equal(workflowSpec, baselineSpec, 'spec revision must match integration baseline and Pages workflow');

console.log(JSON.stringify({
  artifact: 'relgeo-playground',
  sourceRevision: expectedRevision,
  baselineRevision: baselinePlayground,
  workflowRevision: workflowPlayground,
  specRevision: baselineSpec,
  specWorkflowRevision: workflowSpec,
  assets: source.assets,
  assembled: true,
}, null, 2));
