import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const root = new URL('..', import.meta.url).pathname;
const manifestPath = 'docs/evidence/flutter-platform-provenance-2026-11-28.json';
const manifest = JSON.parse(fs.readFileSync(`${root}${manifestPath}`, 'utf8'));
const current = {
  root: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
  flutter: execFileSync('git', ['-C', `${root}flutter`, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  mcp: execFileSync('git', ['-C', `${root}mcp`, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  spec: JSON.parse(fs.readFileSync(`${root}flutter/assets/relgeo_spec/v0.5/manifest.json`, 'utf8')).revision,
};
const specManifest = JSON.parse(fs.readFileSync(`${root}flutter/assets/relgeo_spec/v0.5/manifest.json`, 'utf8'));
const rootGitlink = execFileSync('git', ['ls-tree', 'HEAD', 'flutter'], { cwd: root, encoding: 'utf8' }).trim().split(/\s+/).at(2);
let failed = false;
function check(label, condition, detail) {
  if (!condition) failed = true;
  console.log(`[${condition ? 'PASS' : 'FAIL'}] ${label}: ${detail}`);
}

const tuple = manifest.currentRevisionTuple;
check('root baseline tuple', tuple.root === current.root && tuple.flutter === rootGitlink && tuple.mcp === current.mcp && tuple.spec === current.spec, `root=${current.root.slice(0, 7)} gitlinkFlutter=${rootGitlink.slice(0, 7)} mcp=${current.mcp.slice(0, 7)} spec=${current.spec.slice(0, 7)}`);
check('workflow source revision', manifest.workflowSourceRevision === current.flutter && manifest.workflowPins.workflowSourceRevision === current.flutter, `workflow source=${current.flutter}; root gitlink=${rootGitlink}`);
check('root gitlink sync disposition', ['pending-root-gitlink-update', 'synchronized'].includes(manifest.rootGitlinkSync?.status) && manifest.rootGitlinkSync.rootGitlinkFlutter === rootGitlink && manifest.rootGitlinkSync.sourceCheckoutFlutter === current.flutter && Boolean(manifest.rootGitlinkSync.remediation), `root gitlink status=${manifest.rootGitlinkSync?.status ?? 'missing'}; child and root pointers are joined`);
check('workflow MCP pin', manifest.workflowPins.mcpRevision === current.mcp, `workflow MCP=${manifest.workflowPins.mcpRevision}; current MCP=${current.mcp}`);
const workflowText = [
  fs.readFileSync(`${root}flutter/.github/workflows/flutter-ci.yml`, 'utf8'),
  fs.readFileSync(`${root}flutter/.github/workflows/desktop-release.yml`, 'utf8'),
].join('\n');
check('workflow files pin current MCP', workflowText.includes(current.mcp) && !workflowText.includes('109bd599') && !workflowText.includes('b4561c08'), 'Flutter CI and desktop release no longer pin historical MCP revisions');
const releaseWorkflow = fs.readFileSync(root + 'flutter/.github/workflows/desktop-release.yml', 'utf8');
check('release manifest carries spec provenance', releaseWorkflow.includes('specRevision') && releaseWorkflow.includes('specDigest') && releaseWorkflow.includes('specManifestSha256') && releaseWorkflow.includes('specManifestPath'), 'desktop release metadata and manifest join the bundled spec revision, asset digest, manifest checksum, and manifest path');
check('bundled spec asset provenance', manifest.assetProvenance?.manifestPath === 'flutter/assets/relgeo_spec/v0.5/manifest.json' && manifest.assetProvenance.specRevision === specManifest.revision && manifest.assetProvenance.specDigest === specManifest.digest, 'current asset provenance matches the bundled spec manifest revision and declared asset digest');
const expected = new Set(['PLAT-01', 'PLAT-02', 'PLAT-03', 'PLAT-04']);
const targets = manifest.targets ?? [];
check('platform disposition set', targets.length === 4 && new Set(targets.map((target) => target.id)).size === 4 && targets.every((target) => expected.has(target.id)), 'PLAT-01..04 each have one provenance/disposition record');
const required = ['status', 'owner', 'sourceOfTruth', 'evidenceLocator', 'revision', 'dependency', 'remediation', 'claimLimit'];
check('host dispositions', targets.every((target) => required.every((field) => Boolean(target.hostDisposition?.[field]))), 'each target has status, owner, source, locator, revision, dependency, remediation, and claim limit');
check('no unsupported runtime green', targets.every((target) => target.runtimeStatus.includes('not-verified') || target.runtimeStatus.includes('environment-unavailable')), 'all current runtime claims remain not verified or environment unavailable');
check('historical archives separated', targets.every((target) => target.historicalArtifact?.evidenceClass === 'historical' && target.historicalArtifact.flutterRevision !== current.flutter), 'historical archive records are not promoted to the current tuple');
const artifactInspection = manifest.localArtifactInspection;
check('artifact inspection linked', artifactInspection?.record === 'docs/evidence/flutter-platform-artifact-inspection-2026-11-28.json' && artifactInspection?.command === 'node scripts/check-flutter-platform-artifacts.mjs' && fs.existsSync(`${root}${artifactInspection.record}`), 'structural archive inspection is linked without promoting historical artifacts to current runtime evidence');
console.log(`Flutter platform provenance check ${failed ? 'failed' : 'passed'}: tuple, workflow pins, four platform dispositions, and claim limits are synchronized.`);
if (failed) process.exitCode = 1;
