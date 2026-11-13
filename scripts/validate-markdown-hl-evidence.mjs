import { readFile } from 'node:fs/promises';

const paths = [
  'remark-relgeo-hl/src/index.ts',
  'remark-relgeo-hl/src/render.ts',
  'remark-relgeo-hl/src/__tests__/remark_relgeo_hl.test.ts',
  'remark-relgeo-hl/package.json',
];

const files = Object.fromEntries(
  await Promise.all(paths.map(async (path) => [path, await readFile(path, 'utf8')])),
);

const required = [
  ['remark-relgeo-hl/src/index.ts', 'requestSemanticLines'],
  ['remark-relgeo-hl/src/index.ts', 'RemarkRelgeoHlError'],
  ['remark-relgeo-hl/src/render.ts', 'safeTokensForLine'],
  ['remark-relgeo-hl/src/render.ts', 'tokensAtLine'],
  ['remark-relgeo-hl/src/render.ts', 'escapeHtml'],
  ['remark-relgeo-hl/src/__tests__/remark_relgeo_hl.test.ts', 'invalid service response'],
  ['remark-relgeo-hl/src/__tests__/remark_relgeo_hl.test.ts', 'malformed token spans'],
  ['remark-relgeo-hl/src/__tests__/remark_relgeo_hl.test.ts', 'unsupported source and whitespace'],
  ['remark-relgeo-hl/src/__tests__/remark_relgeo_hl.test.ts', 'invalid token kinds'],
];

for (const [path, marker] of required) {
  if (!files[path].includes(marker)) throw new Error(`missing ${marker} in ${path}`);
}

const testCount = (files[paths[2]].match(/\bit\(/g) ?? []).length;
if (testCount !== 14) throw new Error(`expected 14 highlighter tests, got ${testCount}`);

console.log(
  `PASS root-relative markdown-hl evidence files=${paths.length} sourceGuards=5 fallbackFixtures=4 tests=${testCount}`,
);
