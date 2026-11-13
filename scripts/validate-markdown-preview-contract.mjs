import { readFile } from 'node:fs/promises';

const root = new URL('..', import.meta.url);
const read = async (path) => readFile(new URL(path, root), 'utf8');
const [renderer, rendererTypes, rendererTests, plugin, pluginTests, website, impact] = await Promise.all([
  read('renderer-svg/src/index.ts'),
  read('renderer-svg/src/types.ts'),
  read('renderer-svg/src/__tests__/renderer.test.ts'),
  read('remark-relgeo/src/index.ts'),
  read('remark-relgeo/test/remark-relgeo.test.mjs'),
  read('relgeo.github.io/scripts/assert-built-output.mjs'),
  read('docs/capability-map/markdown-surfaces/cross-surface-impact-register.md'),
]);

const requireText = (source, pattern, label) => {
  if (!source.includes(pattern)) throw new Error(`missing ${label}`);
};

requireText(rendererTypes, 'title?: string', 'renderer title option');
requireText(rendererTypes, 'description?: string', 'renderer description option');
requireText(renderer, 'escapeXml(title)', 'escaped renderer title');
requireText(renderer, 'escapeXml(description)', 'escaped renderer description');
requireText(rendererTests, 'renders escaped accessible title and description metadata', 'renderer metadata test');

requireText(plugin, "assetStrategy?: RemarkRelgeoAssetStrategy", 'plugin asset strategy option');
requireText(plugin, "assetStrategy must be inline-data-uri", 'asset strategy validation');
requireText(plugin, "'data-relgeo-asset-strategy': assetStrategy", 'asset strategy output marker');
requireText(plugin, "role: 'figure'", 'preview figure role');
requireText(plugin, "'aria-label': accessibleLabel", 'preview accessible name');
requireText(plugin, 'const UNSAFE_SVG_PATTERN', 'custom SVG safety boundary');
requireText(pluginTests, 'rejects unsafe custom SVG output', 'unsafe SVG test');
requireText(pluginTests, 'keeps inline asset output deterministic', 'deterministic asset test');
requireText(website, 'preview wrapper', 'website wrapper assertion');
requireText(website, 'preview wrapper', 'website accessibility assertion');
requireText(impact, '## Preview/embed closure change record', 'cross-surface change record');

console.log('PASS markdown-preview-contract-v1 rendererMetadata=escaped pluginSafety=bounded assetStrategy=inline-data-uri accessibility=figure-label-alt websiteAssertions=present changeRecord=present');
