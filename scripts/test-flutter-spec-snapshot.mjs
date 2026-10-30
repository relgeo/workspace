import { promises as fs } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { checkSnapshot } from "./sync-flutter-spec-snapshot.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = join(root, "spec", "id");
const snapshotRoot = join(root, "flutter", "assets", "relgeo_spec", "v0.5");
const snapshotManifest = JSON.parse(await fs.readFile(join(snapshotRoot, "manifest.json"), "utf8"));
const sourceRevision = process.env.RELGEO_SPEC_SNAPSHOT_REVISION ?? snapshotManifest.revision;
const temporaryRoot = await fs.mkdtemp(join(tmpdir(), "relgeo-spec-snapshot-"));
const temporarySource = join(temporaryRoot, "source");
const temporarySnapshot = join(temporaryRoot, "snapshot");

try {
  await fs.cp(sourceRoot, temporarySource, { recursive: true });
  await fs.cp(snapshotRoot, temporarySnapshot, { recursive: true });

  async function expectErrors(label, mutate, expected) {
    await fs.rm(temporarySnapshot, { recursive: true, force: true });
    await fs.rm(temporarySource, { recursive: true, force: true });
    await fs.cp(snapshotRoot, temporarySnapshot, { recursive: true });
    await fs.cp(sourceRoot, temporarySource, { recursive: true });
    await mutate();
    const errors = await checkSnapshot({ sourceRoot: temporarySource, snapshotRoot: temporarySnapshot, specVersion: "0.5", sourceRevision });
    if (!errors.some((error) => error.includes(expected))) {
      throw new Error(`${label} was not detected: ${errors.join("; ")}`);
    }
  }

  const cleanErrors = await checkSnapshot({ sourceRoot: temporarySource, snapshotRoot: temporarySnapshot, specVersion: "0.5", sourceRevision });
  if (cleanErrors.length !== 0) throw new Error(`clean snapshot failed: ${cleanErrors.join("; ")}`);

  await expectErrors("missing file", async () => {
    await fs.rm(join(temporarySnapshot, "README.md"));
  }, "missing snapshot file: README.md");
  await expectErrors("extra file", async () => {
    await fs.writeFile(join(temporarySnapshot, "extra.md"), "unexpected\n");
  }, "extra snapshot file: extra.md");
  await expectErrors("source change", async () => {
    await fs.appendFile(join(temporarySource, "README.md"), "\nchanged without sync\n");
  }, "manifest metadata or digest differs from spec/id");

  console.log("Flutter spec snapshot drift checks passed (clean, missing, extra, source-change).");
} finally {
  await fs.rm(temporaryRoot, { recursive: true, force: true });
}
