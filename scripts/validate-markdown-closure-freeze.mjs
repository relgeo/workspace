#!/usr/bin/env node

import { access, readFile } from 'node:fs/promises';

const base = 'docs/capability-map/markdown-surfaces/';
const read = (name) => readFile(base + name, 'utf8');
const fail = (message) => {
  throw new Error(`Markdown closure freeze validation failed: ${message}`);
};

const [catalog, matrix, freeze, impact, snapshot, backlog, finalReport] = await Promise.all([
  read('expected-capability-catalog.md'),
  read('status-matrix.md'),
  read('closure-boundary-freeze.md'),
  read('cross-surface-impact-register.md'),
  read('before-state-snapshot-2026-11-13.md'),
  read('implementation-gap-backlog.md'),
  read('final-green-surface-closure-report-2026-11-13.md'),
]);

const expectedSection = catalog
  .split('## Katalog expected\n')[1]
  ?.split('\n## Expected catalog invariants')[0];
if (!expectedSection) fail('expected catalog section is missing');

const expectedIds = [...expectedSection.matchAll(/^\| `(MD-[A-Z0-9-]+)` \|/gm)]
  .map((match) => match[1]);
if (expectedIds.length !== 38 || new Set(expectedIds).size !== 38) {
  fail(`expected catalog has ${expectedIds.length} rows / ${new Set(expectedIds).size} unique IDs`);
}

const matrixRows = [...matrix.matchAll(
  /^\| `(MD-[A-Z0-9-]+)` [^|]*\| (✔️|🌗|❌|➖|⏸️|⚠️) \|/gm,
)].map((match) => ({ id: match[1], status: match[2] }));
if (matrixRows.length !== 38 || new Set(matrixRows.map((row) => row.id)).size !== 38) {
  fail('status matrix is not a 38-row one-to-one view');
}

const counts = Object.groupBy(matrixRows, (row) => row.status);
const expectedCounts = { '✔️': 27, '🌗': 0, '❌': 0, '➖': 1, '⏸️': 10, '⚠️': 0 };
for (const [status, count] of Object.entries(expectedCounts)) {
  if ((counts[status]?.length ?? 0) !== count) fail(`status ${status} count changed`);
}

const nonGreen = matrixRows.filter((row) => ['🌗', '❌', '⚠️'].includes(row.status));
if (nonGreen.length !== 0) fail(`green-surface status still has ${nonGreen.length} partial/absent/broken rows`);

const held = matrixRows.filter((row) => row.status === '⏸️');
for (const row of held) {
  if (!finalReport.includes(`| \`${row.id}\` |`)) fail(`deferred row ${row.id} has no final scope decision`);
}
if (held.length !== 10) fail(`expected 10 explicit deferred rows, found ${held.length}`);

for (const row of held) {
  const freezeRow = freeze.split('\n').find((line) => line.startsWith(`| \`${row.id}\` |`));
  const fields = freezeRow?.split('|').map((field) => field.trim()) ?? [];
  const owner = fields[3];
  const sourcePath = fields[4];
  const evidenceRequirement = fields[5];
  const disposition = fields[6];
  if (
    !freezeRow
    || !owner
    || !sourcePath
    || !evidenceRequirement
    || !/(MD-TASK-|MD-VERIFY-|⏸️|deferred)/.test(disposition ?? '')
  ) {
    fail(`non-green row ${row.id} has no closure task/disposition`);
  }
}

for (const family of [
  'MD-XI-FENCE', 'MD-XI-PREVIEW', 'MD-XI-HL', 'MD-XI-DIAG', 'MD-XI-OPT',
  'MD-XI-SSR', 'MD-XI-ASSET', 'MD-XI-A11Y', 'MD-XI-ERR', 'MD-XI-WEB', 'MD-XI-REL',
]) {
  if (!impact.includes(`\`${family}\``)) fail(`impact family ${family} is missing`);
}

const inventory = [
  'remark-relgeo/src/index.ts', 'remark-relgeo/test/remark-relgeo.test.mjs', 'remark-relgeo/test/package-boundary.test.mjs', 'remark-relgeo/package.json',
  'remark-relgeo-hl/src/index.ts', 'remark-relgeo-hl/src/render.ts', 'remark-relgeo-hl/src/__tests__/remark_relgeo_hl.test.ts', 'remark-relgeo-hl/test/package-boundary.test.mjs', 'remark-relgeo-hl/package.json',
  'language-service/src/protocol.ts', 'language-service/src/service.ts', 'language-service/src/__tests__/protocol.test.ts', 'language-service/src/__tests__/language_service.test.ts', 'language-service/package.json',
  'renderer-svg/src/escape.ts', 'renderer-svg/src/semantic.ts', 'renderer-svg/src/index.ts', 'renderer-svg/src/__tests__/security.test.ts', 'renderer-svg/src/__tests__/semantic_contract.test.ts', 'renderer-svg/package.json',
  'fixtures/manifest.json', 'scripts/run-conformance-fixtures.mjs', 'relgeo.github.io/astro.config.mjs', 'relgeo.github.io/scripts/assert-built-output.mjs', 'relgeo.github.io/scripts/assert-pages-artifact.mjs', 'relgeo.github.io/package.json', 'relgeo.github.io/.github/workflows/pages.yml',
  'spec/id/core/06-error-model.md', 'spec/id/presentation/25-views-sheets.md', 'spec/id/presentation/26-metadata.md', 'docs/compatibility-matrix.json',
];
await Promise.all(inventory.map((path) => access(path)));

const packageSources = await Promise.all([
  readFile('remark-relgeo/package.json', 'utf8'),
  readFile('remark-relgeo-hl/package.json', 'utf8'),
  readFile('relgeo.github.io/package.json', 'utf8'),
]);
const [previewPackage, highlighterPackage, websitePackage] = packageSources
  .map((source) => JSON.parse(source));
for (const [name, packageJson] of [['remark-relgeo', previewPackage], ['remark-relgeo-hl', highlighterPackage]]) {
  if (!packageJson.exports?.['.']?.types || !packageJson.exports?.['.']?.import || !packageJson.exports?.['.']?.require) {
    fail(`${name} ESM/CJS/types exports are incomplete`);
  }
}
if (!websitePackage.scripts?.build || !websitePackage.scripts?.test) fail('Website/Pages build/test scripts are missing');
if (!snapshot.includes('SHA-256 at capture') || !snapshot.includes('MD-REL-002') || !backlog.includes('MD-VERIFY-002')) {
  fail('before-state snapshot/backlog handoff is incomplete');
}
if (!finalReport.includes('| `🌗` | 0 |') || !finalReport.includes('| `❌` | 0 |') || !finalReport.includes('| `⚠️` | 0 |')) {
  fail('final closure report does not record zero partial/absent/broken rows');
}

console.log(`PASS markdown-freeze-v2 catalog=38 matrix=38 nonGreen=${nonGreen.length} deferred=${held.length} ownerSourceEvidence=10 impactFamilies=11 inventory=${inventory.length} exports=3`);
