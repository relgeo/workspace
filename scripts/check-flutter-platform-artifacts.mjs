import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const root = new URL('..', import.meta.url).pathname;
const artifactRoot = `${root}flutter/build/draft-v1.0.1`;
const artifacts = [
  {
    id: 'PLAT-01',
    platform: 'macOS',
    file: 'RelGeo-macos-universal-v1.0.1.zip',
    required: 'RelGeo.app/Contents/MacOS/RelGeo',
    list: ['unzip', '-Z1'],
  },
  {
    id: 'PLAT-02',
    platform: 'Ubuntu/Linux',
    file: 'RelGeo-linux-x64-v1.0.1.tar.gz',
    required: 'RelGeo/relgeo',
    list: ['tar', '-tzf'],
  },
  {
    id: 'PLAT-03',
    platform: 'Windows 11',
    file: 'RelGeo-windows-x64-v1.0.1.zip',
    required: 'relgeo.exe;flutter_windows.dll;data',
    list: ['unzip', '-Z1'],
  },
];
let failed = false;
function check(label, condition, detail) {
  if (!condition) failed = true;
  console.log(`[${condition ? 'PASS' : 'FAIL'}] ${label}: ${detail}`);
}

for (const artifact of artifacts) {
  const path = `${artifactRoot}/${artifact.file}`;
  const exists = fs.existsSync(path);
  check(`${artifact.id} archive present`, exists, `${artifact.platform}: ${path}`);
  if (!exists) continue;
  const checksum = execFileSync('shasum', ['-a', '256', path], { encoding: 'utf8' }).trim().split(/\s+/)[0];
  const listing = execFileSync(artifact.list[0], [...artifact.list.slice(1), path], { encoding: 'utf8' });
  const required = artifact.required.split(';');
  check(`${artifact.id} bundle structure`, required.every((entry) => listing.includes(entry)), `${artifact.platform}: required members=${artifact.required}`);
  console.log(`[PASS] ${artifact.id} checksum: ${checksum}`);
}
console.log('[INCONCLUSIVE] current-tuple join: local archives are historical draft artifacts without a current release manifest or source-tuple attestation');
console.log('[INCONCLUSIVE] runtime smoke: no packaged launch, picker/MCP, accessibility, or clean-exit transcript is available for these archives');
if (failed) process.exitCode = 1;
