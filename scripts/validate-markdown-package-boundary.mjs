import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';

const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const localPackageDirs = [
  'geometry',
  'core',
  'renderer-svg',
  'language-service',
  'remark-relgeo',
  'remark-relgeo-hl',
];
const consumerRoot = await mkdtemp('/private/tmp/relgeo-package-consumer-');
const npmCache = join(consumerRoot, '.npm-cache');
const dependencyRequire = createRequire(
  new URL('../relgeo.github.io/node_modules/.pnpm/node_modules/package.json', import.meta.url),
);

function run(command, args, cwd) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: 'utf8',
    env: { ...process.env, npm_config_cache: npmCache },
  });
  assert.equal(result.status, 0, `${command} ${args.join(' ')}\n${result.stdout}\n${result.stderr}`);
  return result.stdout;
}

try {
  const packageRoots = new Map();
  const queue = [];
  for (const packageDir of localPackageDirs) {
    const packageRoot = join(workspaceRoot, packageDir);
    const metadata = JSON.parse(await readFile(join(packageRoot, 'package.json'), 'utf8'));
    packageRoots.set(metadata.name, packageRoot);
    queue.push(metadata.name);
  }

  while (queue.length > 0) {
    const packageId = queue.shift();
    const packageRoot = packageRoots.get(packageId);
    const metadata = JSON.parse(await readFile(join(packageRoot, 'package.json'), 'utf8'));
    const packageRequire = createRequire(join(packageRoot, 'package.json'));
    for (const dependencyId of [
      ...Object.keys(metadata.dependencies ?? {}),
      ...Object.keys(metadata.optionalDependencies ?? {}),
    ]) {
      if (packageRoots.has(dependencyId)) continue;
      let dependencyEntry;
      const dependencyPath = dependencyId.split('/');
      const directDependencyRoots = [
        join(packageRoot, 'node_modules', ...dependencyPath),
        join(workspaceRoot, 'node_modules', ...dependencyPath),
        join(workspaceRoot, 'relgeo.github.io/node_modules/.pnpm/node_modules', ...dependencyPath),
      ];
      const directDependencyRoot = directDependencyRoots.find(root => existsSync(join(root, 'package.json')));
      if (directDependencyRoot) {
        dependencyEntry = join(directDependencyRoot, 'index.js');
      } else {
        try {
          dependencyEntry = packageRequire.resolve(dependencyId);
        } catch {
          dependencyEntry = dependencyRequire.resolve(dependencyId);
        }
      }
      let dependencyRoot = dirname(dependencyEntry);
      while (!existsSync(join(dependencyRoot, 'package.json'))) {
        const parent = dirname(dependencyRoot);
        assert.notEqual(parent, dependencyRoot, `cannot locate package root for ${dependencyId}`);
        dependencyRoot = parent;
      }
      packageRoots.set(dependencyId, dependencyRoot);
      queue.push(dependencyId);
    }
  }

  const packageManifest = {
    name: 'relgeo-fresh-package-consumer',
    private: true,
    type: 'module',
    dependencies: {},
  };
  await writeFile(
    join(consumerRoot, 'package.json'),
    JSON.stringify(packageManifest, null, 2),
  );

  const tarballs = new Map();
  for (const [packageId, packageRoot] of packageRoots) {
    const output = run('npm', ['pack', '--ignore-scripts', '--json', '--pack-destination', consumerRoot], packageRoot);
    const packed = JSON.parse(output)[0];
    const tarball = join(consumerRoot, packed.filename);
    tarballs.set(packageId, tarball);
    packageManifest.dependencies[packageId] = `file:${tarball}`;
  }
  await writeFile(join(consumerRoot, 'package.json'), JSON.stringify(packageManifest, null, 2));

  run('npm', ['install', '--offline', '--ignore-scripts', '--no-save', '--package-lock=false', '--legacy-peer-deps'], consumerRoot);

  const consumerRequire = createRequire(join(consumerRoot, 'package.json'));
  const packageIds = ['@relgeo/remark-relgeo', '@relgeo/remark-relgeo-hl'];
  const installed = [];
  for (const packageId of packageIds) {
    const cjsEntry = consumerRequire.resolve(packageId);
    const packageRoot = dirname(dirname(cjsEntry));
    assert.equal(packageRoot.startsWith(consumerRoot), true);
    const metadata = JSON.parse(await readFile(join(packageRoot, 'package.json'), 'utf8'));
    const esmEntry = join(packageRoot, 'dist/index.mjs');
    const typesEntry = join(packageRoot, 'dist/index.d.ts');
    assert.equal(metadata.exports['.'].import, './dist/index.mjs');
    assert.equal(metadata.exports['.'].require, './dist/index.js');
    assert.equal(metadata.exports['.'].types, './dist/index.d.ts');
    await readFile(typesEntry, 'utf8');
    const esm = await import(pathToFileURL(esmEntry));
    const cjs = consumerRequire(packageId);
    assert.equal(typeof cjs.default, 'function');
    assert.equal(typeof esm.default, 'function');
    installed.push(`${packageId}:esm+cjs+types`);
  }

  console.log(`PASS markdown-package-boundary-v2 consumer=fresh-temp install=offline packages=${installed.join(',')} packedDependencies=${packageRoots.size} siblingSourcePaths=none`);
} finally {
  await rm(consumerRoot, { recursive: true, force: true });
}
