import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const defaultSourceRoot = join(root, "spec", "id");
const defaultSnapshotRoot = join(root, "flutter", "assets", "relgeo_spec", "v0.5");
const snapshotParent = join(root, "flutter", "assets", "relgeo_spec");
const defaultSpecVersion = "0.5";
const manifestName = "manifest.json";

function parseArgs(argv) {
  const options = {
    mode: argv.includes("--sync") ? "sync" : argv.includes("--check") ? "check" : null,
    json: argv.includes("--json"),
    sourceRoot: defaultSourceRoot,
    snapshotRoot: defaultSnapshotRoot,
    specVersion: defaultSpecVersion,
    sourceRevision: null,
  };
  for (const argument of argv) {
    if (argument.startsWith("--source-root=")) options.sourceRoot = resolve(argument.slice(14));
    if (argument.startsWith("--snapshot-root=")) options.snapshotRoot = resolve(argument.slice(16));
    if (argument.startsWith("--spec-version=")) options.specVersion = argument.slice(15);
    if (argument.startsWith("--source-revision=")) options.sourceRevision = argument.slice(18);
  }
  return options;
}

function usage() {
  console.log(`Usage: node scripts/sync-flutter-spec-snapshot.mjs --sync|--check [options]

Copies the normative spec/id Markdown snapshot to Flutter assets or checks it
without changing files. The generated manifest is deterministic: it excludes
timestamps and records source revision, per-file hashes, and a corpus digest.

Options:
  --source-root=PATH       Override source root (test-only/supporting tooling)
  --snapshot-root=PATH     Override asset root (test-only/supporting tooling)
  --spec-version=VERSION   Compatibility line (default: 0.5)
  --source-revision=REV    Override Git revision (test-only/supporting tooling)
  --json                   Emit a machine-readable result
`);
}

function fail(message) {
  throw new Error(message);
}

function assertSafeDirectory(candidate, label) {
  const resolved = resolve(candidate);
  if (!isAbsolute(resolved) || resolved === root || resolved === "/") {
    fail(`${label} must be a dedicated absolute directory: ${resolved}`);
  }
  return resolved;
}

async function assertSafeSnapshotDirectory(candidate, specVersion) {
  if (!/^[A-Za-z0-9][A-Za-z0-9._+-]*$/.test(specVersion)) {
    fail(`specVersion must be a single safe path component: ${specVersion}`);
  }
  const resolved = resolve(candidate);
  const expected = resolve(snapshotParent, `v${specVersion}`);
  if (resolved !== expected) {
    fail(`snapshotRoot must be the dedicated versioned asset directory: ${expected}`);
  }

  const expectedParent = await fs.realpath(snapshotParent);
  const actualParent = await fs.realpath(dirname(resolved));
  if (actualParent !== expectedParent) {
    fail(`snapshotRoot parent resolves outside the dedicated asset directory: ${actualParent}`);
  }
  try {
    const target = await fs.lstat(resolved);
    if (target.isSymbolicLink()) {
      fail(`snapshotRoot must not be a symbolic link: ${resolved}`);
    }
    if (!target.isDirectory()) {
      fail(`snapshotRoot must be a directory: ${resolved}`);
    }
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  return resolved;
}

async function collectMarkdownFiles(sourceRoot) {
  const files = [];
  async function visit(directory) {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    entries.sort((a, b) => compareCodeUnits(a.name, b.name));
    for (const entry of entries) {
      const absolutePath = join(directory, entry.name);
      if (entry.isDirectory()) {
        await visit(absolutePath);
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
        const path = relative(sourceRoot, absolutePath).split(sep).join("/");
        const bytes = await fs.readFile(absolutePath);
        files.push({
          path,
          bytes,
          bytesLength: bytes.byteLength,
          sha256: createHash("sha256").update(bytes).digest("hex"),
        });
      }
    }
  }
  await visit(sourceRoot);
  files.sort((a, b) => compareCodeUnits(a.path, b.path));
  return files;
}

function compareCodeUnits(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function getGitRevision(sourceRoot) {
  return execFileSync("git", ["-C", sourceRoot, "rev-parse", "HEAD"], {
    cwd: root,
    encoding: "utf8",
  }).trim();
}

function corpusDigest(files) {
  const canonical = files
    .map((file) => `${file.path}\0${file.sha256}\0${file.bytesLength}\n`)
    .join("");
  return `sha256:${createHash("sha256").update(canonical).digest("hex")}`;
}

function buildManifest({ files, specVersion, sourceRevision }) {
  return {
    schemaVersion: 1,
    specVersion,
    sourceDirectory: "spec/id",
    assetDirectory: `assets/relgeo_spec/v${specVersion}`,
    revision: sourceRevision,
    sourceUrl: `https://github.com/relgeo/spec/tree/${sourceRevision}/id`,
    digestAlgorithm: "sha256",
    digest: corpusDigest(files),
    fileCount: files.length,
    files: files.map(({ path, bytesLength, sha256 }) => ({
      path,
      bytes: bytesLength,
      sha256,
    })),
  };
}

function manifestText(manifest) {
  return `${JSON.stringify(manifest, null, 2)}\n`;
}

async function collectSnapshotFiles(snapshotRoot) {
  const files = [];
  async function visit(directory) {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    entries.sort((a, b) => compareCodeUnits(a.name, b.name));
    for (const entry of entries) {
      const absolutePath = join(directory, entry.name);
      if (entry.isDirectory()) {
        await visit(absolutePath);
      } else if (entry.isFile()) {
        files.push(relative(snapshotRoot, absolutePath).split(sep).join("/"));
      }
    }
  }
  await visit(snapshotRoot);
  return files.sort();
}

async function checkSnapshot({ sourceRoot, snapshotRoot, specVersion, sourceRevision }) {
  const errors = [];
  let sourceFiles;
  try {
    sourceFiles = await collectMarkdownFiles(sourceRoot);
  } catch (error) {
    return [`cannot read source corpus: ${error.message}`];
  }

  const expectedManifest = buildManifest({ files: sourceFiles, specVersion, sourceRevision });
  let actualManifest;
  try {
    actualManifest = JSON.parse(await fs.readFile(join(snapshotRoot, manifestName), "utf8"));
  } catch (error) {
    errors.push(`missing or invalid ${manifestName}: ${error.message}`);
    return errors;
  }
  if (manifestText(actualManifest) !== manifestText(expectedManifest)) {
    errors.push("manifest metadata or digest differs from spec/id");
  }

  let snapshotFiles;
  try {
    snapshotFiles = await collectSnapshotFiles(snapshotRoot);
  } catch (error) {
    errors.push(`cannot read snapshot corpus: ${error.message}`);
    return errors;
  }
  const expectedPaths = sourceFiles.map((file) => file.path).concat(manifestName).sort();
  const actualSet = new Set(snapshotFiles);
  const expectedSet = new Set(expectedPaths);
  for (const path of expectedPaths) {
    if (!actualSet.has(path)) errors.push(`missing snapshot file: ${path}`);
  }
  for (const path of snapshotFiles) {
    if (!expectedSet.has(path)) errors.push(`extra snapshot file: ${path}`);
  }
  for (const file of sourceFiles) {
    const snapshotPath = join(snapshotRoot, ...file.path.split("/"));
    try {
      const actual = await fs.readFile(snapshotPath);
      const actualHash = createHash("sha256").update(actual).digest("hex");
      if (actualHash !== file.sha256 || actual.byteLength !== file.bytesLength) {
        errors.push(`content differs from source: ${file.path}`);
      }
    } catch (error) {
      errors.push(`cannot read snapshot file ${file.path}: ${error.message}`);
    }
  }
  return errors;
}

async function syncSnapshot({ sourceRoot, snapshotRoot, specVersion, sourceRevision }) {
  snapshotRoot = await assertSafeSnapshotDirectory(snapshotRoot, specVersion);
  const sourceFiles = await collectMarkdownFiles(sourceRoot);
  if (sourceFiles.length === 0) fail(`no Markdown files found under ${sourceRoot}`);
  const manifest = buildManifest({ files: sourceFiles, specVersion, sourceRevision });
  await fs.rm(snapshotRoot, { recursive: true, force: true });
  await fs.mkdir(snapshotRoot, { recursive: true });
  for (const file of sourceFiles) {
    const destination = join(snapshotRoot, ...file.path.split("/"));
    await fs.mkdir(dirname(destination), { recursive: true });
    await fs.writeFile(destination, file.bytes);
  }
  await fs.writeFile(join(snapshotRoot, manifestName), manifestText(manifest));
  return manifest;
}

export { buildManifest, checkSnapshot, collectMarkdownFiles, corpusDigest, syncSnapshot };

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (process.argv.includes("--help") || !options.mode) {
    usage();
    if (!options.mode) process.exitCode = 2;
    return;
  }
  const sourceRoot = assertSafeDirectory(options.sourceRoot, "sourceRoot");
  const snapshotRoot = resolve(options.snapshotRoot);
  const sourceRevision = options.sourceRevision ?? getGitRevision(sourceRoot);
  if (options.mode === "sync") {
    await assertSafeSnapshotDirectory(snapshotRoot, options.specVersion);
    const result = await syncSnapshot({ sourceRoot, snapshotRoot, specVersion: options.specVersion, sourceRevision });
    const output = {
      mode: "sync",
      snapshotRoot: relative(root, snapshotRoot).split(sep).join("/"),
      fileCount: result.fileCount,
      revision: result.revision,
      digest: result.digest,
    };
    console.log(options.json ? JSON.stringify(output) : `Synced ${result.fileCount} Markdown files (${result.digest})`);
    return;
  }
  assertSafeDirectory(snapshotRoot, "snapshotRoot");
  const errors = await checkSnapshot({ sourceRoot, snapshotRoot, specVersion: options.specVersion, sourceRevision });
  if (errors.length > 0) {
    const output = { mode: "check", ok: false, errors };
    console.error(options.json ? JSON.stringify(output) : errors.map((error) => `ERROR: ${error}`).join("\n"));
    process.exitCode = 1;
    return;
  }
  const manifest = JSON.parse(await fs.readFile(join(snapshotRoot, manifestName), "utf8"));
  const output = { mode: "check", ok: true, fileCount: manifest.fileCount, digest: manifest.digest };
  console.log(options.json ? JSON.stringify(output) : `Snapshot is current: ${manifest.fileCount} Markdown files (${manifest.digest})`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(`ERROR: ${error.message}`);
    process.exitCode = 1;
  });
}
