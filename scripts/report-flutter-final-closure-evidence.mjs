import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const root = new URL('..', import.meta.url).pathname;
const paths = {
  register: 'docs/evidence/rebaseline-disposition-register-2026-11-27.json',
  audit: 'docs/evidence/flutter-final-closure-audit-2026-11-28.json',
  plan: 'docs/plans/12-flutter-workbench-capability-baseline.md',
  implementationAudit: 'docs/capability-map/flutter-workbench/implementation-gap-map.md',
  reconciliation: 'docs/capability-map/flutter-workbench/reconciliation.md',
  statusMatrix: 'docs/capability-map/flutter-workbench/status-matrix.md',
  backlog: 'docs/capability-map/flutter-workbench/implementation-gap-backlog.md',
  handoff: 'docs/capability-map/flutter-workbench/coverage-validation-handoff.md',
  masterPlan: 'docs/MATURATION-MASTER-PLAN.md',
};

const read = (relativePath) => fs.readFileSync(`${root}${relativePath}`, 'utf8');
const register = JSON.parse(read(paths.register));
const audit = JSON.parse(read(paths.audit));
const expected = register.rows.map((row) => row.id);
const expectedSet = new Set(expected);
const held = new Set(register.statusSummary.heldIds);
const readableProofPath = 'docs/evidence/flutter-final-closure-proof.md';
let failed = false;

function check(label, condition, detail) {
  if (!condition) failed = true;
  console.log(`[${condition ? 'PASS' : 'FAIL'}] ${label}: ${detail}`);
}

function idsInMarkdown(source) {
  return [...source.matchAll(/^\|\s+(?:`)?([A-Z0-9]+-\d+)(?:`)?\s+\|/gmu)].map((match) => match[1]);
}

function exactSet(values) {
  return values.length === 61 && new Set(values).size === 61 && values.every((id) => expectedSet.has(id)) && expected.every((id) => values.includes(id));
}

function lineOf(relativePath, needle) {
  const lines = read(relativePath).split('\n');
  const index = lines.findIndex((line) => line.includes(needle));
  return `file:${relativePath}:${index + 1}`;
}

const catalog = read(paths.plan);
const catalogSection = catalog.slice(catalog.indexOf('## 2. Expected capability catalog'), catalog.indexOf('## 3. Explicit scope boundaries'));
const catalogIds = idsInMarkdown(catalogSection);
const matrixSets = Object.entries(paths)
  .filter(([key]) => ['implementationAudit', 'reconciliation', 'statusMatrix', 'backlog'].includes(key))
  .map(([key, path]) => {
    const source = read(path);
    return [key, expected.filter((id) => source.includes(`| ${id} |`) || source.includes(`| \`${id}\` |`) || source.includes(`| [\`${id}\`]`))];
  });

check('expected catalog/register/audit ID set', exactSet(catalogIds) && exactSet(expected) && exactSet(audit.rows.map((row) => row.id)), '61 unique IDs with exact set equality');
for (const [key, ids] of matrixSets) check(`${key} ID set`, exactSet(ids), `${ids.length}/61 IDs, missing=${expected.filter((id) => !ids.includes(id)).join(',') || 'none'}, extra=${ids.filter((id) => !expectedSet.has(id)).join(',') || 'none'}`);

const requiredFields = ['owner', 'sourceOfTruth', 'evidenceLocator', 'revision', 'dependency', 'remediation', 'claimLimit'];
const heldRows = register.rows.filter((row) => held.has(row.id));
check('17 held dispositions', heldRows.length === 17 && heldRows.every((row) => row.status === '⏸️' && requiredFields.every((field) => Boolean(row[field]))), 'all 17 named rows are ⏸️ with seven required disposition fields');
console.log(`[PASS] held IDs: ${[...held].join(', ')}`);

const currentRoot = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
const currentFlutter = execFileSync('git', ['-C', `${root}flutter`, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const currentMcp = execFileSync('git', ['-C', `${root}mcp`, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const rootGitlinkFlutter = execFileSync('git', ['ls-tree', 'HEAD', 'flutter'], { cwd: root, encoding: 'utf8' }).trim().split(/\s+/).at(2);
const spec = JSON.parse(read('flutter/assets/relgeo_spec/v0.5/manifest.json')).revision;
const tupleMatches = audit.revisionTuple.root === currentRoot && audit.revisionTuple.flutter === rootGitlinkFlutter && audit.revisionTuple.flutterChildCheckout === currentFlutter && audit.revisionTuple.mcp === currentMcp && audit.revisionTuple.spec === spec && register.revisionTuple.root === currentRoot && register.revisionTuple.flutter === rootGitlinkFlutter && register.revisionTuple.flutterChildCheckout === currentFlutter && register.revisionTuple.mcp === currentMcp && register.revisionTuple.spec === spec;
const gitlinks = execFileSync('git', ['ls-tree', 'HEAD', 'flutter', 'mcp'], { cwd: root, encoding: 'utf8' }).trim();
const gitlinkSync = register.revisionTuple.gitlinkSync;
const syncDispositioned = ['pending-root-gitlink-update', 'synchronized'].includes(gitlinkSync?.status) && gitlinkSync.rootGitlink === rootGitlinkFlutter && gitlinkSync.childCheckout === currentFlutter;
check('current revision tuple and root gitlinks', tupleMatches && syncDispositioned && gitlinks.includes(rootGitlinkFlutter) && gitlinks.includes(currentMcp), `root=${currentRoot}; flutterRootGitlink=${rootGitlinkFlutter}; flutterChildCheckout=${currentFlutter}; mcp=${currentMcp}; spec=${spec}; ${gitlinks.replaceAll('\n', ' | ')}`);
const statusMatrixText = read(paths.statusMatrix);
check('status matrix current-pointer alignment', statusMatrixText.includes(`flutter@${rootGitlinkFlutter}`) && statusMatrixText.includes(currentFlutter.slice(0, 7)) && !statusMatrixText.includes('Current root gitlink and release-workflow source pointer'), `current matrix pointers are root gitlink=${rootGitlinkFlutter.slice(0, 7)} and child checkout=${currentFlutter.slice(0, 7)}; historical release pointers are not labeled current`);

const boundaryKeys = ['analyzer', 'unit-widget-contract', 'shared-conformance', 'semantic-parity', 'standalone-checkout', 'build-artifact', 'host-smoke'];
check('verification boundary register', Array.isArray(audit.verificationBoundaries) && audit.verificationBoundaries.length === 7 && audit.verificationBoundaries.map((item) => item.key).every((key) => boundaryKeys.includes(key)) && audit.verificationBoundaries.every((item) => item.status && item.owner && item.remediation && item.evidenceLocator && item.claimLimit), '7/7 boundaries have status, owner, remediation, locator, and claim limit');
for (const boundary of audit.verificationBoundaries) console.log(`[PASS] boundary ${boundary.key}: ${boundary.status}; locator=${boundary.evidenceLocator}`);

const finalAuditName = 'flutter-final-closure-audit-2026-11-28.json';
for (const [key, path] of Object.entries(paths).filter(([key]) => ['implementationAudit', 'reconciliation', 'statusMatrix', 'backlog', 'handoff', 'masterPlan'].includes(key))) {
  const source = read(path);
  check(`${key} final audit reference`, source.includes(finalAuditName), lineOf(path, finalAuditName));
}

const handoff = read(paths.handoff);
const masterPlan = read(paths.masterPlan);
check('current analyzer claim alignment', handoff.includes('`flutter analyze --no-pub` | **NOT VERIFIED — environment unavailable**') && masterPlan.includes('current managed analyzer probe is explicitly unavailable'), 'current handoff and master plan do not promote historical analyzer PASS to current evidence');

check('before/after closure', audit.beforeAfter.before.total === 61 && audit.beforeAfter.after.total === 61 && audit.beforeAfter.transition === '17 🌗 → 17 ⏸️; 44 ✔️ → 44 ✔️', '61 rows; 17 🌗 → 17 ⏸️; 44 ✔️ → 44 ✔️');
check('actionable status closure', audit.beforeAfter.after.statusCounts['🌗'] === 0 && audit.beforeAfter.after.statusCounts['❌'] === 0 && audit.beforeAfter.after.statusCounts['⚠️'] === 0, 'after counts for 🌗/❌/⚠️ are all zero');
const readableProof = read(readableProofPath);
const readableRows = [...readableProof.matchAll(/^\|\s+([A-Z0-9]+-\d+)\s+\|/gmu)].map((match) => match[1]);
const readableBoundaries = [...readableProof.matchAll(/^\|\s+(analyzer|unit-widget-contract|shared-conformance|semantic-parity|standalone-checkout|build-artifact|host-smoke)\s+\|/gmu)].map((match) => match[1]);
check('readable proof index', audit.evidenceProof?.readableIndex === readableProofPath && exactSet(readableRows) && readableBoundaries.length === 7, `${readableProofPath}: 61 per-ID rows and 7 verification boundaries`);
console.log(`Evidence paths: ${lineOf(paths.register, '"revisionTuple"')}; ${lineOf(paths.audit, '"rows"')}; ${lineOf(paths.audit, '"verificationBoundaries"')}; ${lineOf(paths.statusMatrix, finalAuditName)}; ${lineOf(paths.reconciliation, finalAuditName)}; ${lineOf(paths.backlog, finalAuditName)}; ${lineOf(paths.handoff, finalAuditName)}; ${lineOf(paths.masterPlan, finalAuditName)}`);
if (failed) process.exitCode = 1;
else console.log('Flutter final closure evidence proof passed: catalog, dispositions, boundaries, references, tuple, and claim limits are directly joined.');
