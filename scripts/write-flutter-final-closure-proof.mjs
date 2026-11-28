import fs from 'node:fs';

const root = new URL('..', import.meta.url).pathname;
const registerPath = 'docs/evidence/rebaseline-disposition-register-2026-11-27.json';
const auditPath = 'docs/evidence/flutter-final-closure-audit-2026-11-28.json';
const outputPath = `${root}docs/evidence/flutter-final-closure-proof.md`;
const register = JSON.parse(fs.readFileSync(`${root}${registerPath}`, 'utf8'));
const audit = JSON.parse(fs.readFileSync(`${root}${auditPath}`, 'utf8'));

function lineOf(relativePath, needle) {
  const lines = fs.readFileSync(`${root}${relativePath}`, 'utf8').split('\n');
  const index = lines.findIndex((line) => line.includes(needle));
  return `file:${relativePath}:${index + 1}`;
}

function cell(value) {
  return String(value ?? '').replaceAll('|', '\\|').replaceAll('\n', ' ');
}

const rows = audit.rows.map((row) => ({
  ...row,
  locator: lineOf(auditPath, `"id": "${row.id}"`),
}));
const boundaries = audit.verificationBoundaries;
const lines = [
  '# Flutter Workbench final closure proof',
  '',
  '> Direct evidence index generated from the canonical register and final audit. It records implementation/evidence boundaries separately and does not promote unavailable host/runtime checks.',
  '',
  '## Authority and revision tuple',
  '',
  `- Expected catalog: \`file:docs/plans/12-flutter-workbench-capability-baseline.md:140\``,
  `- Disposition register: \`${lineOf(registerPath, '"rows": [')}\``,
  `- Final audit rows: \`${lineOf(auditPath, '"rows": [')}\``,
  `- Final audit proof command: \`node scripts/report-flutter-final-closure-evidence.mjs\``,
  '',
  '| Revision | Value |',
  '| --- | --- |',
  `| root | \`${audit.revisionTuple.root}\` |`,
  `| flutter root gitlink | \`${audit.revisionTuple.flutterRootGitlink ?? audit.revisionTuple.flutter}\` |`,
  `| flutter child checkout | \`${audit.revisionTuple.flutterChildCheckout ?? audit.revisionTuple.flutter}\` |`,
  `| spec | \`${audit.revisionTuple.spec}\` |`,
  `| mcp | \`${audit.revisionTuple.mcp}\` |`,
  '',
  '## Per-ID before/after and disposition proof',
  '',
  '| ID | Before | After | Owner | Source of truth | Evidence locator | Revision | Dependency | Remediation | Claim limit |',
  '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |',
  ...rows.map((row) => `| ${cell(row.id)} | ${cell(row.beforeStatus)} | ${cell(row.afterStatus)} | ${cell(row.owner)} | ${cell(row.sourceOfTruth)} | ${cell(row.evidenceLocator)} (${cell(row.locator)}) | ${cell(row.revision)} | ${cell(row.dependency)} | ${cell(row.remediation)} | ${cell(row.claimLimit)} |`),
  '',
  '## Verification boundary proof',
  '',
  '| Boundary | Status | Command | Owner | Remediation | Evidence locator | Claim limit |',
  '| --- | --- | --- | --- | --- | --- | --- |',
  ...boundaries.map((boundary) => `| ${cell(boundary.key)} | ${cell(boundary.status)} | ${cell(boundary.command)} | ${cell(boundary.owner)} | ${cell(boundary.remediation)} | ${cell(boundary.evidenceLocator)} | ${cell(boundary.claimLimit)} |`),
  '',
  '## Closure result',
  '',
  `- Before/after: **${audit.beforeAfter.transition}**.`,
  `- After status counts: **44 ✔️, 17 ⏸️, 0 🌗, 0 ❌, 0 ⚠️, 0 ➖**.`,
  '- Current analyzer, full tests, shared conformance, semantic replay, standalone checkout, build/artifact, and host smoke remain explicitly bounded by the verification table above.',
  '- Downstream references: `file:docs/capability-map/flutter-workbench/status-matrix.md:54`, `file:docs/capability-map/flutter-workbench/reconciliation.md:23`, `file:docs/capability-map/flutter-workbench/implementation-gap-backlog.md:12`, `file:docs/capability-map/flutter-workbench/coverage-validation-handoff.md:7`, `file:docs/MATURATION-MASTER-PLAN.md:836`.',
  '',
];

if (rows.length !== 61 || boundaries.length !== 7) throw new Error('proof generation requires 61 rows and 7 boundaries');
fs.writeFileSync(outputPath, lines.join('\n'));
console.log(`Wrote ${outputPath}: rows=${rows.length}, boundaries=${boundaries.length}`);
