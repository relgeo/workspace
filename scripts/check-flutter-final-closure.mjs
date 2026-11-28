import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const root = new URL('..', import.meta.url).pathname;
const registerPath = `${root}docs/evidence/rebaseline-disposition-register-2026-11-27.json`;
const auditPath = `${root}docs/evidence/flutter-final-closure-audit-2026-11-28.json`;
const register = JSON.parse(fs.readFileSync(registerPath, 'utf8'));
const audit = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
const expected = register.rows.map((row) => row.id);
const expectedSet = new Set(expected);

function fail(message) {
  console.error(`[FAIL] ${message}`);
  process.exitCode = 1;
}

function pass(message) {
  console.log(`[PASS] ${message}`);
}

function read(relativePath) {
  return fs.readFileSync(`${root}${relativePath}`, 'utf8');
}

function currentRevision(repo = root) {
  return execFileSync('git', ['rev-parse', 'HEAD'], { cwd: repo, encoding: 'utf8' }).trim();
}

if (expected.length !== 61 || expectedSet.size !== 61) fail('register is not exactly 61 unique rows');
else pass('register has 61 unique rows');

const heldIds = register.statusSummary.heldIds;
const expectedHeld = ['DOC-08', 'IO-01', 'IO-02', 'EDIT-04', 'CONTRACT-01', 'CONTRACT-02', 'CONTRACT-03', 'CANVAS-03', 'CANVAS-04', 'CMD-03', 'A11Y-01', 'A11Y-02', 'WINDOW-01', 'PLAT-01', 'PLAT-02', 'PLAT-03', 'PLAT-04'];
if (JSON.stringify(heldIds) !== JSON.stringify(expectedHeld)) fail('held ID list drifted');
if (register.statusSummary.reconciliation['🌗'] || register.statusSummary.reconciliation['❌'] || register.statusSummary.reconciliation['⚠️']) fail('register contains actionable status count');
if (register.statusSummary.reconciliation['✔️'] !== 44 || register.statusSummary.reconciliation['⏸️'] !== 17) fail('register status counts drifted');
else pass('after status: 44 implemented, 17 held, 0 actionable partial/error/warning');

const current = {
  root: currentRevision(),
  flutter: currentRevision(`${root}flutter`),
  mcp: currentRevision(`${root}mcp`),
};
const flutterRootGitlink = execFileSync('git', ['ls-tree', 'HEAD', 'flutter'], { cwd: root, encoding: 'utf8' }).trim().split(/\s+/).at(2);
const spec = JSON.parse(read('flutter/assets/relgeo_spec/v0.5/manifest.json')).revision;
const expectedTuple = { ...current, spec };
const recordedTuple = {
  root: register.revisionTuple.root,
  flutter: register.revisionTuple.flutterChildCheckout ?? register.revisionTuple.flutter,
  mcp: register.revisionTuple.mcp,
  spec: register.revisionTuple.spec,
};
for (const key of ['root', 'flutter', 'mcp', 'spec']) {
  const recorded = recordedTuple[key];
  const rootRevisionIsAncestor = key === 'root' && (() => {
    try {
      execFileSync('git', ['merge-base', '--is-ancestor', recorded, expectedTuple[key]], { cwd: root, stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  })();
  if (recorded !== expectedTuple[key] && !rootRevisionIsAncestor) fail(`${key} revision drift: register=${recorded} current=${expectedTuple[key]}`);
}
const recordedRootGitlink = register.revisionTuple.flutterRootGitlink ?? register.revisionTuple.flutter;
if (recordedRootGitlink !== flutterRootGitlink) fail(`Flutter root gitlink drift: register=${recordedRootGitlink} current=${flutterRootGitlink}`);
if (recordedRootGitlink !== current.flutter) {
  const sync = register.revisionTuple.gitlinkSync;
  if (sync?.status !== 'pending-root-gitlink-update' || sync.rootGitlink !== recordedRootGitlink || sync.childCheckout !== current.flutter) {
    fail('Flutter child/root gitlink drift is not explicitly dispositioned');
  }
}
if (!process.exitCode) pass(`current revision tuple: root=${current.root.slice(0, 8)} flutter=${current.flutter.slice(0, 8)} mcp=${current.mcp.slice(0, 8)} spec=${spec.slice(0, 8)}`);

const plan = read('docs/plans/12-flutter-workbench-capability-baseline.md');
const catalog = plan.slice(plan.indexOf('## 2. Expected capability catalog'), plan.indexOf('## 3. Explicit scope boundaries'));
const planIds = [...catalog.matchAll(/^\|\s+([A-Z0-9]+-\d+)\s+\|/gmu)].map((match) => match[1]);
if (planIds.length !== 61 || new Set(planIds).size !== 61 || planIds.some((id) => !expectedSet.has(id))) fail('plan catalog does not match the 61-ID register');
else pass('plan catalog matches 61-ID register');

for (const [label, relativePath] of Object.entries({
  'implementation audit': 'docs/capability-map/flutter-workbench/implementation-gap-map.md',
  reconciliation: 'docs/capability-map/flutter-workbench/reconciliation.md',
  'status matrix': 'docs/capability-map/flutter-workbench/status-matrix.md',
  backlog: 'docs/capability-map/flutter-workbench/implementation-gap-backlog.md',
})) {
  const source = read(relativePath);
  const represented = expected.filter((id) => source.includes(`| ${id} |`) || source.includes(`| \`${id}\` |`) || source.includes(`| [\`${id}\`]`));
  if (new Set(represented).size !== 61) fail(`${label} does not represent all 61 IDs`);
  else pass(`${label}: 61/61 IDs`);
}

for (const row of register.rows) {
  for (const field of ['owner', 'sourceOfTruth', 'evidenceLocator', 'revision', 'dependency', 'remediation', 'claimLimit']) {
    if (!row[field]) fail(`${row.id} is missing ${field}`);
  }
  if (row.status === '✔️' && /partial|held|deferred|unverified/i.test(`${row.implementationStatus} ${row.evidenceStatus}`) && !/bounded/i.test(row.implementationStatus)) {
    fail(`${row.id} has an unsupported green claim`);
  }
}
if (!process.exitCode) pass('all 61 rows have disposition fields and no unsupported green claims');

const auditRows = audit.rows;
if (!Array.isArray(auditRows) || auditRows.length !== 61 || new Set(auditRows.map((row) => row.id)).size !== 61) {
  fail('final audit does not contain exactly one per-ID before/after row for all 61 IDs');
} else {
  for (const row of register.rows) {
    const auditRow = auditRows.find((candidate) => candidate.id === row.id);
    const expectedBefore = expectedHeld.includes(row.id) ? '🌗' : '✔️';
    const expectedAfter = row.status;
    if (!auditRow || auditRow.beforeStatus !== expectedBefore || auditRow.afterStatus !== expectedAfter) {
      fail(`${row.id} before/after row drifted`);
    }
  }
  if (!process.exitCode) {
    pass('per-ID before/after rows: 61/61; every catalog ID has an explicit transition');
    console.log(`[PASS] per-ID catalog: ${expected.join(', ')}`);
  }
}

if (audit.beforeAfter?.before?.total !== 61 || audit.beforeAfter?.after?.total !== 61) fail('audit before/after totals are not 61');
if (audit.beforeAfter?.transition !== '17 🌗 → 17 ⏸️; 44 ✔️ → 44 ✔️') fail('audit transition statement drifted');
if (audit.claimLimits?.length < 3) fail('compact claim-limit report is incomplete');
const requiredBoundaryKeys = ['analyzer', 'unit-widget-contract', 'shared-conformance', 'semantic-parity', 'standalone-checkout', 'build-artifact', 'host-smoke'];
const boundaryKeys = Array.isArray(audit.verificationBoundaries) ? audit.verificationBoundaries.map((boundary) => boundary.key) : [];
if (boundaryKeys.length !== requiredBoundaryKeys.length || requiredBoundaryKeys.some((key) => !boundaryKeys.includes(key))) {
  fail('verification boundary register does not cover all seven required boundaries');
} else if (audit.verificationBoundaries.some((boundary) => !boundary.status || !boundary.owner || !boundary.remediation || !boundary.evidenceLocator || !boundary.claimLimit)) {
  fail('verification boundary register has an incomplete disposition');
} else pass('verification boundaries: 7/7 classified with owner, remediation, locator, and claim limit');
if (!process.exitCode) {
  pass('before/after: 61 rows; 17 🌗 → 17 ⏸️; 44 ✔️ → 44 ✔️');
  pass('claim limits: implementation, host/runtime, and provenance remain separate');
  console.log('Flutter final closure audit passed: 61 IDs, zero actionable partial/error/warning, explicit holds only.');
}
