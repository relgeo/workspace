import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const dependencyRequire = createRequire(
  new URL('../relgeo.github.io/node_modules/.pnpm/node_modules/package.json', import.meta.url),
);
const load = (name) => import(pathToFileURL(dependencyRequire.resolve(name)));

const [unifiedModule, parseModule, rehypeModule, stringifyModule, highlighterModule, previewModule] = await Promise.all([
  load('unified'),
  load('remark-parse'),
  load('remark-rehype'),
  load('rehype-stringify'),
  load('@relgeo/remark-relgeo-hl'),
  load('@relgeo/remark-relgeo'),
]);

const { unified } = unifiedModule;
const remarkParse = parseModule.default;
const remarkRehype = rehypeModule.default;
const rehypeStringify = stringifyModule.default;
const remarkRelgeoHl = highlighterModule.remarkRelgeoHl;
const remarkRelgeo = previewModule.remarkRelgeo;

const markdown = `before

\`\`\`js
const untouched = true;
\`\`\`

between

\`\`\`rg
version: 0.5
\`\`\`

\`\`\`relgeo
not valid
\`\`\`

\`\`\`relgeo
version: 0.5
objects:
  panel:
    type: rect
    size: [80, 40]
\`\`\`

after`;

function hasClass(node, className) {
  return Array.isArray(node?.properties?.className)
    && node.properties.className.includes(className);
}

function normalizeRelgeoPreview() {
  function walk(node) {
    if (!node || !Array.isArray(node.children)) return;
    node.children = node.children.map((child) => {
      walk(child);
      if (
        child.type === 'element'
        && child.tagName === 'pre'
        && child.children?.length === 1
        && (hasClass(child.children[0], 'relgeo-preview__canvas')
          || hasClass(child.children[0], 'relgeo-preview__placeholder'))
      ) {
        return child.children[0];
      }
      return child;
    });
  }

  return (tree) => walk(tree);
}

function createProcessor() {
  return unified()
    .use(remarkParse)
    .use(remarkRelgeoHl)
    .use(remarkRelgeo)
    .use(remarkRehype)
    .use(normalizeRelgeoPreview)
    .use(rehypeStringify);
}

const first = String(await createProcessor().process(markdown));
const second = String(await createProcessor().process(markdown));

assert.equal(first, second, 'generic host output must be deterministic');
assert.equal((first.match(/data-relgeo-kind="highlight"/g) ?? []).length, 1);
assert.equal((first.match(/data-relgeo-kind="preview"/g) ?? []).length, 1);
const highlightOffset = first.indexOf('data-relgeo-kind="highlight"');
const previewOffset = first.indexOf('data-relgeo-kind="preview"');
assert.ok(highlightOffset >= 0 && previewOffset > highlightOffset, 'highlight output must precede preview output');
assert.match(first, /data-relgeo-kind="preview-error"/);
assert.match(first, /class="language-js"/);
assert.match(first, /<p>before<\/p>[\s\S]*<p>between<\/p>[\s\S]*<p>after<\/p>/);
assert.doesNotMatch(first, /<pre>\s*<(?:div|figure)[^>]+relgeo-preview__/);
assert.doesNotMatch(first, /window\.|document\./);

const statusMatrix = await readFile(
  new URL('../docs/capability-map/markdown-surfaces/status-matrix.md', import.meta.url),
  'utf8',
);
const hostContract = await readFile(
  new URL('../docs/capability-map/markdown-surfaces/generic-host-contract.md', import.meta.url),
  'utf8',
);
assert.match(statusMatrix, /\| `MD-SSR-001`[^\n]*\| ✔️ \| verified-local \|/);
assert.match(statusMatrix, /\| `MD-SSR-003`[^\n]*\| ✔️ \| verified-local \|/);
assert.match(hostContract, /explicit generic-host adapter contract/);

console.log('PASS markdown-generic-host-v3 harness=scripts/validate-markdown-generic-host.mjs ordering=remark-parse>hl>preview>remark-rehype>host-normalize>stringify relativeOrder=highlight<preview preview=1 highlight=1 failure=isolated noop=preserved deterministic=yes browserGlobals=none statusRows=2 contract=explicit');
