import fs from 'node:fs';

const root = new URL('..', import.meta.url).pathname;
const evidencePath = `${root}docs/evidence/flutter-interaction-runtime-accessibility-2026-11-27.json`;
const evidence = JSON.parse(fs.readFileSync(evidencePath, 'utf8'));
const expectedIds = ['CANVAS-03', 'CANVAS-04', 'CMD-03', 'A11Y-01', 'A11Y-02', 'WINDOW-01'];

function fail(message) {
  console.error(`[FAIL] ${message}`);
  process.exitCode = 1;
}

function pass(message) {
  console.log(`[PASS] ${message}`);
}

if (evidence.schemaVersion !== 'flutter-interaction-runtime-accessibility/v1') {
  fail('unexpected evidence schema');
}
if (evidence.focusedVerification?.status !== 'passed') {
  fail('focused verification is not passed');
}
if (!evidence.focusedVerification?.outputExcerpt?.includes('All tests passed!')) {
  fail('focused verification has no exact passing excerpt');
}

const dispositions = evidence.surfaceDisposition ?? [];
const dispositionIds = dispositions.map((row) => row.id);
const uniqueIds = new Set(dispositionIds);
if (dispositionIds.length !== expectedIds.length || uniqueIds.size !== expectedIds.length ||
    expectedIds.some((id) => !uniqueIds.has(id))) {
  fail(`surface dispositions must contain exactly ${expectedIds.join(', ')}`);
} else {
  pass(`surface dispositions: ${dispositionIds.length} affected IDs, unique and complete`);
}

for (const row of dispositions) {
  for (const field of ['status', 'owner', 'sourceOfTruth', 'evidenceLocator', 'dependency', 'remediation', 'claimLimit']) {
    if (typeof row[field] !== 'string' || row[field].length === 0) fail(`${row.id}: missing ${field}`);
  }
}

const hosts = evidence.hostEvidenceEnvelope?.hosts ?? [];
if (hosts.length !== 3) fail('host evidence envelope must have macOS, Linux, and Windows rows');
for (const host of hosts) {
  for (const field of ['host', 'boundary', 'status', 'owner', 'remediation', 'claimLimit']) {
    if (typeof host[field] !== 'string' || host[field].length === 0) fail(`${host.host ?? 'host'}: missing ${field}`);
  }
  if (host.status !== 'deferred') fail(`${host.host}: host status must remain deferred`);
}

if (!process.exitCode) {
  pass('focused interaction, semantics, lifecycle, and host-claim boundaries are joined');
  console.log('Flutter interaction evidence check passed: source, tests, dispositions, and host limits are explicit.');
}
