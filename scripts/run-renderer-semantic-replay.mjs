#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";
import { compareSVGSemanticReplay } from "../renderer-svg/dist/index.mjs";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const fixtures = [
  "reference/10-v05-relational-baseline.yaml",
  "reference/15-v05-boolean-intersection-candidate.yaml",
  "reference/16-v05-evaluator-units-candidate.yaml",
  "reference/24-v05-collection-boolean-contract.yaml",
];
const coreEntry = pathToFileURL(resolve(root, "core/dist/index.mjs")).href;
const rendererEntry = pathToFileURL(resolve(root, "renderer-svg/dist/index.mjs")).href;
const childSource = `
  import { readFileSync } from "node:fs";
  import { parseRelGeo, resolveGeometry } from ${JSON.stringify(coreEntry)};
  import { serializeSVGSemanticScene } from ${JSON.stringify(rendererEntry)};
  const source = readFileSync(process.env.RELGEO_FIXTURE_PATH, "utf8");
  const scene = resolveGeometry(parseRelGeo(source));
  process.stdout.write(serializeSVGSemanticScene(scene));
`;

function runChild(fixturePath, run) {
  const result = spawnSync(process.execPath, ["--input-type=module", "-e", childSource], {
    cwd: root,
    encoding: "utf8",
    env: { ...process.env, RELGEO_FIXTURE_PATH: fixturePath, RELGEO_REPLAY_RUN: String(run) },
  });
  if (result.status !== 0) {
    throw new Error(`${fixturePath} run ${run} failed: ${result.stderr.trim()}`);
  }
  return result.stdout;
}

for (const relativeFixture of fixtures) {
  const fixturePath = resolve(root, "fixtures", relativeFixture);
  const first = runChild(fixturePath, 1);
  const second = runChild(fixturePath, 2);
  const comparison = compareSVGSemanticReplay(first, second);
  if (!comparison.equal) {
    throw new Error(`semantic replay mismatch for ${relativeFixture}`);
  }
  const projection = JSON.parse(first);
  if (projection.schema !== "relgeo.svg-semantic" || projection.schemaVersion !== 1) {
    throw new Error(`unexpected semantic schema for ${relativeFixture}`);
  }
  console.log(`PASS ${relativeFixture}: separate-process semantic replay`);
}

console.log(`Renderer semantic replay passed for ${fixtures.length} canonical fixtures; comparison uses semantic tolerance and preserves semantic order.`);
