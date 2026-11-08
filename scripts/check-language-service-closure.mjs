#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const files = {
  catalog: 'docs/capability-map/language-service/expected-capability-catalog.md',
  matrix: 'docs/capability-map/language-service/status-matrix.md',
  reconciliation: 'docs/capability-map/language-service/reconciliation.md',
  report: 'docs/capability-map/language-service/final-closure-report.md',
};

const text = {};
for (const [key, relativePath] of Object.entries(files)) {
  text[key] = await readFile(resolve(root, relativePath), 'utf8');
}

const expectedIds = [...text.catalog.matchAll(/^\| (LS-[A-Z0-9-]+) \|/gm)].map((match) => match[1]);
const rowPattern = /^\| (LS-[A-Z0-9-]+).*?\| (✔️|🌗|❌|⚠️|⏸️|➖) \|/gm;
const matrixRows = [...text.matrix.matchAll(rowPattern)].map((match) => ({ id: match[1], status: match[2] }));
const reconciliationRows = [...text.reconciliation.matchAll(/^\| (LS-[A-Z0-9-]+) \| (✔️|🌗|❌|⚠️|⏸️|➖) /gm)]
  .map((match) => ({ id: match[1], status: match[2] }));
const reportIds = [...new Set(text.report.match(/LS-[A-Z0-9-]+/g) ?? [])];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function indexRows(rows, label) {
  const ids = rows.map((row) => row.id);
  assert(ids.length === new Set(ids).size, `${label} contains duplicate IDs`);
  return new Map(rows.map((row) => [row.id, row.status]));
}

const matrix = indexRows(matrixRows, 'status matrix');
const reconciliation = indexRows(reconciliationRows, 'reconciliation');
const expected = new Set(expectedIds);

assert(expectedIds.length === 33, `expected catalog coverage must be 33 IDs, got ${expectedIds.length}`);
assert(matrix.size === 33, `status matrix coverage must be 33 IDs, got ${matrix.size}`);
assert(reconciliation.size === 33, `reconciliation coverage must be 33 IDs, got ${reconciliation.size}`);
assert(reportIds.filter((id) => expected.has(id)).length === 33, 'closure report must mention every expected ID');

for (const id of expected) {
  assert(matrix.has(id), `status matrix is missing ${id}`);
  assert(reconciliation.has(id), `reconciliation is missing ${id}`);
  assert(matrix.get(id) === reconciliation.get(id), `${id} differs between matrix and reconciliation`);
}

const counts = Object.fromEntries(['✔️', '🌗', '❌', '⚠️', '⏸️', '➖'].map((status) => [
  status,
  [...matrix.values()].filter((value) => value === status).length,
]));
assert(counts['🌗'] === 0, `closure retains ${counts['🌗']} partial rows`);
assert(counts['❌'] === 0, `closure retains ${counts['❌']} absent rows`);
assert(counts['⚠️'] === 0, `closure retains ${counts['⚠️']} broken rows`);
assert(counts['✔️'] === 22, `expected 22 implemented rows, got ${counts['✔️']}`);
assert(counts['⏸️'] === 8, `expected 8 deferred rows, got ${counts['⏸️']}`);
assert(counts['➖'] === 3, `expected 3 host-boundary rows, got ${counts['➖']}`);

const decisionRows = [...matrix.entries()]
  .filter(([, status]) => status === '⏸️' || status === '➖')
  .map(([id]) => id);
for (const id of decisionRows) {
  const matrixLine = text.matrix.split('\n').find((line) => line.startsWith(`| ${id} `));
  assert(matrixLine && /(Hold|held|host-owned|host boundary|Host\/UI responsibility|catalog decision)/i.test(matrixLine), `${id} lacks an explicit hold/host decision`);
}

console.log(JSON.stringify({
  expected: expectedIds.length,
  matrix: matrix.size,
  reconciliation: reconciliation.size,
  counts,
  decisionRows,
}, null, 2));
console.log('Language Service final closure audit passed.');
