import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const root = new URL('..', import.meta.url).pathname;
const registerPath = `${root}docs/evidence/rebaseline-disposition-register-2026-11-27.json`;
const register = JSON.parse(fs.readFileSync(registerPath, 'utf8'));
const expected = register.rows.map((row) => row.id);
const expectedSet = new Set(expected);

function fail(message) {
  console.error(`[FAIL] ${message}`);
  process.exitCode = 1;
}

function pass(message) {
  console.log(`[PASS] ${message}`);
}

function text(path) {
  return fs.readFileSync(`${root}${path}`, 'utf8');
}

function idsFromTable(source, pattern) {
  return [...source.matchAll(pattern)].map((match) => match[1]);
}

function assertExact(label, actual, expectedValues) {
  const actualSet = new Set(actual);
  const expectedValuesSet = new Set(expectedValues);
  const missing = expectedValues.filter((id) => !actualSet.has(id));
  const extra = actual.filter((id) => !expectedValuesSet.has(id));
  const duplicates = actual.filter((id, index) => actual.indexOf(id) !== index);
  if (missing.length || extra.length || duplicates.length) {
    fail(`${label}: missing=${missing.join(',') || '0'} extra=${extra.join(',') || '0'} duplicates=${[...new Set(duplicates)].join(',') || '0'}`);
  } else {
    pass(`${label}: ${actual.length} rows, missing=0, extra=0, duplicates=0`);
  }
}

if (register.expectedCatalog.count !== 61) fail('register expected catalog count is not 61');
if (expected.length !== 61 || expectedSet.size !== 61) fail('register rows are not 61 unique IDs');
else pass('register: 61 unique expected IDs');

const held = register.rows.filter((row) => row.status === '⏸️').map((row) => row.id);
const implemented = register.rows.filter((row) => row.status === '✔️').map((row) => row.id);
assertExact('held dispositions', held, register.statusSummary.heldIds);
if (held.length !== 17 || implemented.length !== 44) fail(`status counts: implemented=${implemented.length} held=${held.length}`);
else pass('status counts: 44 implemented, 17 held, no actionable partial rows');

const baseline = JSON.parse(text('docs/integration-baseline.json'));
const currentRoot = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
const currentFlutter = execFileSync('git', ['-C', 'flutter', 'rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
function isAncestor(revision) {
  try {
    execFileSync('git', ['merge-base', '--is-ancestor', revision, currentRoot], { cwd: root, stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}
if (!isAncestor(register.revisionTuple.root) || !isAncestor(baseline.rootRevision)) {
  fail(`root revision drift: evidence=${register.revisionTuple.root}, baseline=${baseline.rootRevision}, current=${currentRoot}`);
} else {
  pass(`root revision ancestry: evidence=${register.revisionTuple.root}, baseline=${baseline.rootRevision}, current=${currentRoot}`);
}
const baselineFlutter = baseline.submodules.find((entry) => entry.path === 'flutter')?.revision;
if (currentFlutter !== register.revisionTuple.flutter || currentFlutter !== baselineFlutter) fail(`Flutter revision drift: current=${currentFlutter}`);
else pass(`Flutter revision: ${currentFlutter}`);

const specManifest = JSON.parse(text('flutter/assets/relgeo_spec/v0.5/manifest.json'));
if (specManifest.revision !== register.revisionTuple.spec) fail('spec snapshot revision drift');
else pass(`spec snapshot: ${specManifest.revision}, ${specManifest.fileCount} files`);
const contractSource = text('mcp/lib/src/contract/contract_revision.dart');
const contractRevision = contractSource.match(/'([^']+)'/u)?.[1];
if (contractRevision !== register.contractSnapshot.mcpContractRevision) fail(`MCP contract revision drift: ${contractRevision}`);
else pass(`MCP contract: ${contractRevision}`);

const plan = text('docs/plans/12-flutter-workbench-capability-baseline.md');
const catalogSection = plan.slice(plan.indexOf('## 2. Expected capability catalog'), plan.indexOf('## 3. Explicit scope boundaries'));
assertExact('expected catalog', idsFromTable(catalogSection, /^\|\s+([A-Z0-9]+-\d+)\s+\|/gmu), expected);

const docs = {
  'implementation audit': text('docs/capability-map/flutter-workbench/implementation-gap-map.md'),
  reconciliation: text('docs/capability-map/flutter-workbench/reconciliation.md'),
  'status matrix': text('docs/capability-map/flutter-workbench/status-matrix.md'),
  backlog: text('docs/capability-map/flutter-workbench/implementation-gap-backlog.md'),
};
for (const [label, source] of Object.entries(docs)) {
  const ids = source.split('\n').flatMap((line) => expected.filter((id) => line.includes(`| ${id} |`) || line.includes(`| \`${id}\` |`) || line.includes(`| [\`${id}\`]`)));
  const filtered = ids.filter((id) => expectedSet.has(id));
  if (!filtered.length) fail(`${label}: no expected IDs found`);
  else if (new Set(filtered).size !== expectedSet.size) {
    const missing = expected.filter((id) => !filtered.includes(id));
    fail(`${label}: missing=${missing.join(',')}`);
  } else pass(`${label}: all 61 expected IDs represented`);
}

const statusMatrix = docs['status matrix'];
for (const row of register.rows) {
  const line = statusMatrix.split('\n').find((candidate) => candidate.includes(`| [\`${row.id}\`]`));
  if (!line || !line.includes(`| \`${row.status}\` |`)) fail(`status matrix disposition mismatch: ${row.id}`);
}
if (!process.exitCode) pass('status matrix dispositions match register for all 61 IDs');

if (process.exitCode) process.exit(process.exitCode);
console.log('Flutter Workbench rebaseline check passed');
