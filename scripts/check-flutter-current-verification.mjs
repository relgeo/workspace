import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const root = new URL('..', import.meta.url).pathname;
const reportPath = `${root}docs/evidence/flutter-current-verification-2026-11-28.json`;
const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
const current = {
  root: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
  flutterRootGitlink: execFileSync('git', ['ls-tree', 'HEAD', 'flutter'], { cwd: root, encoding: 'utf8' }).trim().split(/\s+/).at(2),
  flutterChildCheckout: execFileSync('git', ['-C', 'flutter', 'rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
  mcp: execFileSync('git', ['-C', 'mcp', 'rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
};
let failed = false;
function check(label, condition, detail) {
  if (!condition) failed = true;
  console.log(`[${condition ? 'PASS' : 'FAIL'}] ${label}: ${detail}`);
}

const tuple = report.revisionTuple;
check('revision tuple', tuple.rootHead === current.root && tuple.flutterRootGitlink === current.flutterRootGitlink && tuple.flutterChildCheckout === current.flutterChildCheckout && tuple.mcp === current.mcp, `root=${current.root.slice(0, 7)} gitlinkFlutter=${current.flutterRootGitlink.slice(0, 7)} childFlutter=${current.flutterChildCheckout.slice(0, 7)} mcp=${current.mcp.slice(0, 7)}`);
check('root gitlink boundary', tuple.rootGitlinkStatus === 'synchronized', 'child checkout and root gitlink are synchronized at the current root tuple');
const entries = new Map((report.verification ?? []).map((entry) => [entry.id, entry]));
for (const id of report.envelope.passed) check(`passed evidence ${id}`, entries.get(id)?.status === 'passed', entries.get(id)?.command ?? 'missing');
for (const id of report.envelope.notVerified) check(`not verified boundary ${id}`, entries.get(id)?.status.includes('not-verified'), entries.get(id)?.boundary ?? 'missing boundary');
for (const id of report.envelope.inconclusive) check(`inconclusive boundary ${id}`, entries.get(id)?.status === 'inconclusive', entries.get(id)?.boundary ?? 'missing boundary');
check('claim separation', typeof report.envelope.claimLimit === 'string' && report.envelope.claimLimit.includes('not promoted'), 'passed evidence is not promoted to runtime or parity claims');
const boundFiles = [
  ...(report.currentSourceBinding?.diagnosticsRecord?.currentSourceFiles ?? []),
  ...(report.currentSourceBinding?.interactionRecord?.currentSourceFiles ?? []),
];
const allBoundFilesExist = boundFiles.every((file) => {
  try {
    execFileSync('git', ['-C', 'flutter', 'cat-file', '-e', `${current.flutterChildCheckout}:${file}`], { cwd: root, stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
});
check('current source binding', report.currentSourceBinding?.childCheckout === current.flutterChildCheckout && report.currentSourceBinding?.semanticComparator?.status.includes('not-verified') && allBoundFilesExist, 'historical records are joined to files present in the current child checkout and current comparator revisions without green execution claims');
check('repair triage', report.repairTriage?.sourceFailureObserved === false && report.repairTriage?.repairApplied === false && report.repairTriage?.rerunStatus === 'not-applicable' && report.repairTriage?.executionRecord === 'node scripts/check-flutter-current-verification.mjs', 'no source repair was claimed because no source failure was proven');
console.log(`Flutter current verification envelope ${failed ? 'failed' : 'passed'}: ${report.envelope.passed.length} passed, ${report.envelope.notVerified.length} not verified, ${report.envelope.inconclusive.length} inconclusive.`);
if (failed) process.exitCode = 1;
