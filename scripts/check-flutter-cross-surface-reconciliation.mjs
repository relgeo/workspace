import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const root = new URL('..', import.meta.url).pathname;
const evidencePath = `${root}docs/evidence/flutter-cross-surface-consumer-reconciliation-2026-11-27.json`;
const evidence = JSON.parse(fs.readFileSync(evidencePath, 'utf8'));

function fail(message) {
  console.error(`[FAIL] ${message}`);
  process.exitCode = 1;
}

function pass(message) {
  console.log(`[PASS] ${message}`);
}

const current = {
  rootHead: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
  flutterChildHead: execFileSync('git', ['-C', 'flutter', 'rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
  mcpChildHead: execFileSync('git', ['-C', 'mcp', 'rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
};

for (const [key, value] of Object.entries(current)) {
  if (evidence.revisionTuple?.[key] !== value) fail(`${key} revision drift: evidence=${evidence.revisionTuple?.[key]} current=${value}`);
}
if (evidence.contractRevision !== 'mcp-contract-2026-11-12-r2') fail('contract revision is not r2');
if (evidence.childRepositories?.find((repo) => repo.path === 'flutter')?.status !== 'committed') fail('Flutter child commit is not recorded as committed');
if (evidence.childRepositories?.find((repo) => repo.path === 'mcp')?.status !== 'committed') fail('MCP child commit is not recorded as committed');
if (evidence.sharedFixtures?.result !== 'passed') fail('shared fixture staging is not passed');
if (!evidence.consumerVerification?.some((entry) => entry.consumer === 'Flutter' && entry.status === 'passed')) fail('Flutter consumer pass is missing');
if (!evidence.consumerVerification?.some((entry) => entry.consumer === 'MCP/root contract' && entry.status === 'passed')) fail('MCP/root structural consumer pass is missing');
if (!evidence.rootGitlinks?.flutter?.indexUpdate?.startsWith('committed-in-root-')) fail('Flutter root gitlink is not recorded as committed');
if (!evidence.rootGitlinks?.mcp?.indexUpdate?.startsWith('committed-in-root-')) fail('MCP root gitlink is not recorded as committed');
if (!evidence.reconciliation?.deferred?.includes('MCP Dart analyzer/tests/transport at managed sandbox boundary')) fail('MCP test boundary is not recorded');

const requiredCoverage = [
  'criterion-1-perubahan-flutter-yang-memerlukan-penyesuaian-li',
  'evidence-1-child-repository-commits-and-updated-root-gitlin',
  'evidence-2-affected-consumer-and-shared-fixture-verificatio',
  'evidence-3-cross-surface-reconciliation-proving-contract-an',
];
const coverage = new Map((evidence.validationCoverage ?? []).map((entry) => [entry.id, entry]));
for (const id of requiredCoverage) {
  const entry = coverage.get(id);
  if (!entry) fail(`validation coverage is missing ${id}`);
  if (!entry?.reason) fail(`validation coverage has no reason for ${id}`);
}
if (evidence.requiredAccess?.status !== 'environment-unavailable') fail('required access disposition is not environment-unavailable');
if (!evidence.requiredAccess?.concreteAction) fail('required access concrete action is missing');
if (!evidence.requiredAccess?.observedFailure) fail('required access observed failure is missing');
if (!evidence.requiredAccess?.claimLimit) fail('required access claim limit is missing');

if (!process.exitCode) {
  pass(`revision tuple: root=${current.rootHead.slice(0, 8)} flutter=${current.flutterChildHead.slice(0, 8)} mcp=${current.mcpChildHead.slice(0, 8)}`);
  pass('Flutter and MCP child commits/gitlinks, contract/fixture consumers, and deferred MCP runtime boundary are explicit');
  for (const id of requiredCoverage) pass(`validation coverage: ${id}=${coverage.get(id).status}`);
  pass(`required access: ${evidence.requiredAccess.status}; blocked operation is explicit`);
  console.log('Flutter cross-surface reconciliation check passed: contract, fixtures, consumers, and provenance are joined.');
}
