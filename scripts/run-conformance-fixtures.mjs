#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const manifestPath = resolve(root, "fixtures/manifest.json");
const results = [];
const failures = [];

function check(condition, message) {
  const status = condition ? "PASS" : "FAIL";
  results.push({ status, message });
  if (!condition) failures.push(message);
}

function fixtureTree(lang, value) {
  return {
    type: "root",
    children: [{ type: "code", lang, meta: null, value }],
  };
}

function projectScene(scene) {
  return {
    unit: scene.unit,
    autoSize: scene.autoSize,
    padding: scene.padding,
    objects: scene.objects,
    bbox: scene.bbox,
    violations: scene.violations ?? [],
  };
}

function humanReadableHighlightSnapshot(source, semanticLines) {
  return source
    .split("\n")
    .map((line, index) => {
      const tokens = (semanticLines[index]?.tokens ?? [])
        .map((token) => `${token.start}:${token.end}:${token.kind}:${line.slice(token.start, token.end)}`)
        .join(" ");
      const renderedLine = `${String(index + 1).padStart(2, "0")} | ${line} |`;
      return tokens ? `${renderedLine} ${tokens}` : renderedLine;
    })
    .join("\n");
}

function loadModule(relativePath) {
  return import(pathToFileURL(resolve(root, relativePath)).href);
}

function cliCompileArgs(fixturePath, fixture) {
  return [
    "cli/bin/relgeo.js",
    "compile",
    fixturePath,
    "--format",
    "svg",
    ...(fixture.cliUnit ? ["--unit", fixture.cliUnit] : []),
  ];
}

const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const core = await loadModule("core/dist/index.mjs");
const renderer = await loadModule("renderer-svg/dist/index.mjs");
const languageService = await loadModule("language-service/dist/index.mjs");
const remarkHighlight = await loadModule("remark-relgeo-hl/dist/index.mjs");
const remarkPreview = await loadModule("remark-relgeo/dist/index.mjs");

check(manifest.schemaVersion === 1, "fixture manifest schema version is supported");
check(manifest.compatibilityLine === "0.5", "fixture manifest follows active compatibility line 0.5");
check(manifest.fixtureRoot === "fixtures", "fixture manifest uses the public fixture root");
check(manifest.owner === "relgeo/workspace", "fixture manifest has an explicit owner");
check(manifest.standaloneStrategy?.canonicalOwner === "relgeo/workspace", "fixture manifest makes the canonical owner explicit");
check(manifest.standaloneStrategy?.childRepositoryPolicy === "standalone-local-tests", "fixture manifest keeps child repositories independently testable");
check(manifest.standaloneStrategy?.distribution === "not-published-as-package", "fixture manifest avoids a new public fixture package surface");
check(manifest.standaloneStrategy?.integrationAuthority === "workspace-root-runner", "fixture manifest assigns cross-repo conformance to the root runner");
check(manifest.statusPolicy?.active && manifest.statusPolicy?.["supported-legacy"] && manifest.statusPolicy?.invalid && manifest.statusPolicy?.["runtime-diagnostic"] && manifest.statusPolicy?.capability, "fixture manifest documents every fixture status policy");
check(manifest.versionAcceptance?.active === manifest.compatibilityLine, "fixture manifest identifies the active version");
check(Array.isArray(manifest.versionAcceptance?.supportedLegacy) && manifest.versionAcceptance.supportedLegacy.length > 0, "fixture manifest declares supported legacy versions");
check(Array.isArray(manifest.versionAcceptance?.regressionOnly) && manifest.versionAcceptance.regressionOnly.length > 0, "fixture manifest declares regression-only versions");
check(manifest.versionAcceptance?.unsupportedFuture === true, "fixture manifest rejects undeclared future versions");
check(manifest.versionAcceptance?.omittedDefaultsTo === manifest.compatibilityLine, "fixture manifest declares the omitted-version default");
check(manifest.versionAcceptance?.parserDiagnosticCode === "UNSUPPORTED_SPEC_VERSION", "fixture manifest declares the parser diagnostic code");
check(Array.isArray(manifest.fixtures) && manifest.fixtures.length === 18, "fixture manifest contains the expected 18-entry baseline set");

const fixtureIds = new Set();
const fixturePaths = new Set();
for (const fixture of manifest.fixtures ?? []) {
  check(!fixtureIds.has(fixture.id), `${fixture.id}: fixture id is unique`);
  check(!fixturePaths.has(fixture.path), `${fixture.id}: fixture path is unique`);
  check(["active", "supported-legacy", "invalid", "runtime-diagnostic", "capability"].includes(fixture.status), `${fixture.id}: fixture status is recognized`);
  check(Array.isArray(fixture.surfaces) && fixture.surfaces.length > 0, `${fixture.id}: fixture declares at least one surface`);
  if (fixture.status === "active") {
    check(typeof fixture.expectedOutputPath === "string" && fixture.expectedOutputPath.length > 0, `${fixture.id}: active fixture declares a reviewable output snapshot`);
    check(typeof fixture.expectedResolvedPath === "string" && fixture.expectedResolvedPath.length > 0, `${fixture.id}: active fixture declares a reviewable resolved-scene snapshot`);
  }
  if (fixture.status === "invalid") {
    check(typeof fixture.expectedDiagnostic === "string" && fixture.expectedDiagnostic.length > 0, `${fixture.id}: invalid fixture declares an expected diagnostic`);
  }
  if (fixture.status === "runtime-diagnostic") {
    check(Array.isArray(fixture.expectedViolations) && fixture.expectedViolations.length > 0, `${fixture.id}: runtime-diagnostic fixture declares expected violations`);
    check(typeof fixture.expectedOutputPath === "string" && fixture.expectedOutputPath.length > 0, `${fixture.id}: runtime-diagnostic fixture declares a reviewable output snapshot`);
    check(typeof fixture.expectedResolvedPath === "string" && fixture.expectedResolvedPath.length > 0, `${fixture.id}: runtime-diagnostic fixture declares a reviewable resolved-scene snapshot`);
  }
  if (fixture.status === "capability") {
    check(
      typeof fixture.expectedOutputPath === "string" && fixture.expectedOutputPath.length > 0,
      `${fixture.id}: capability candidate declares a reviewable output snapshot`,
    );
    check(
      typeof fixture.expectedResolvedPath === "string" && fixture.expectedResolvedPath.length > 0,
      `${fixture.id}: capability candidate declares a reviewable resolved-scene snapshot`,
    );
  }
  if (fixture.cliUnit !== undefined) {
    check(
      ["px", "mm", "cm", "m", "in", "ip"].includes(fixture.cliUnit),
      `${fixture.id}: CLI target unit is recognized`,
    );
  }
  fixtureIds.add(fixture.id);
  fixturePaths.add(fixture.path);
}

const activeFixtures = manifest.fixtures.filter((fixture) => fixture.status === "active");
check(activeFixtures.length >= 1, "fixture manifest has at least one active baseline fixture");
const invalidFixtures = manifest.fixtures.filter((fixture) => fixture.status === "invalid");
check(invalidFixtures.length === 5, "fixture manifest has the five invalid diagnostic fixtures");
const runtimeDiagnosticFixtures = manifest.fixtures.filter((fixture) => fixture.status === "runtime-diagnostic");
check(runtimeDiagnosticFixtures.length === 1, "fixture manifest has one runtime-diagnostic fixture");

for (const fixture of manifest.fixtures) {
  const fixturePath = resolve(root, manifest.fixtureRoot, fixture.path);
  let source;
  try {
    source = await readFile(fixturePath, "utf8");
  } catch (error) {
    check(false, `${fixture.id}: fixture source is readable (${error.message})`);
    continue;
  }

  if (fixture.status === "invalid") {
    const declaredVersion = source.match(/^version:\s*["']?([^"'\s]+)["']?/m)?.[1];
    check(declaredVersion === fixture.contractVersion, `${fixture.id}: declared contract version is ${fixture.contractVersion}`);

    let parseError;
    try {
      core.parseRelGeo(source, { mode: "validate" });
    } catch (error) {
      parseError = error;
    }
    check(Boolean(parseError), `${fixture.id}: parser rejects the invalid fixture`);
    check(parseError?.message.includes(fixture.expectedDiagnostic), `${fixture.id}: parser reports the expected diagnostic`);

    const diagnostics = new languageService.RelGeoLanguageService().getDiagnostics(source);
    check(diagnostics.some((diagnostic) => diagnostic.message.includes(fixture.expectedDiagnostic)), `${fixture.id}: language service exposes the expected diagnostic`);
    continue;
  }

  let doc;
  let scene;
  try {
    doc = core.parseRelGeo(source, fixture.status === "active" ? { mode: "validate" } : undefined);
    scene = core.resolveGeometry(doc, fixture.status === "active" ? { mode: "validate" } : undefined);
    check(String(doc.version) === fixture.contractVersion, `${fixture.id}: parsed contract version is ${fixture.contractVersion}`);
    check(Object.keys(scene.objects ?? {}).length > 0, `${fixture.id}: resolver produces a non-empty scene`);
  } catch (error) {
    check(false, `${fixture.id}: parse and resolve succeed (${error.message})`);
    continue;
  }

  if (fixture.status === "runtime-diagnostic") {
    const expectedViolations = fixture.expectedViolations ?? [];
    check(scene.violations?.length === expectedViolations.length, `${fixture.id}: resolver reports the expected number of runtime violations`);
    for (const [index, expected] of expectedViolations.entries()) {
      const actual = scene.violations?.[index];
      check(actual?.type === expected.type, `${fixture.id}: runtime violation ${index + 1} has type ${expected.type}`);
      check(actual?.path === expected.path, `${fixture.id}: runtime violation ${index + 1} points to ${expected.path}`);
      if (typeof expected.minDeviation === "number") {
        check(typeof actual?.deviation === "number" && actual.deviation >= expected.minDeviation, `${fixture.id}: runtime violation ${index + 1} has the expected deviation`);
      }
    }

    const runtimeService = new languageService.RelGeoLanguageService();
    check(runtimeService.getDiagnostics(source).length === 0, `${fixture.id}: language service accepts the structurally valid runtime-diagnostic fixture`);
    check(runtimeService.getSemanticTokens(source).length > 0, `${fixture.id}: language service emits semantic tokens for the runtime-diagnostic fixture`);

    const runtimeSvg = renderer.renderToSVG(scene);
    check(runtimeSvg.startsWith("<svg"), `${fixture.id}: renderer emits SVG despite the runtime violation`);
    check(!/<script\b/i.test(runtimeSvg) && !/\son[a-z]+\s*=/i.test(runtimeSvg), `${fixture.id}: runtime-diagnostic SVG has no executable markup`);
    if (fixture.expectedOutputPath) {
      const expectedSvg = await readFile(resolve(root, manifest.fixtureRoot, fixture.expectedOutputPath), "utf8");
      check(runtimeSvg === expectedSvg.trimEnd(), `${fixture.id}: renderer output matches the runtime-diagnostic snapshot`);
    }
    if (fixture.expectedResolvedPath) {
      const expectedScene = JSON.parse(await readFile(resolve(root, manifest.fixtureRoot, fixture.expectedResolvedPath), "utf8"));
      check(JSON.stringify(projectScene(scene)) === JSON.stringify(expectedScene), `${fixture.id}: runtime-diagnostic scene matches the reviewable snapshot`);
    }

    const runtimeCli = spawnSync(process.execPath, cliCompileArgs(fixturePath, fixture), {
      cwd: root,
      encoding: "utf8",
      env: process.env,
    });
    check(runtimeCli.status === 0 && runtimeCli.stdout.trimEnd() === runtimeSvg, `${fixture.id}: CLI output exactly matches the runtime-diagnostic SVG`);
    continue;
  }

  if (fixture.status === "capability") {
    for (const objectId of fixture.expectedObjectIds ?? []) {
      check(Boolean(doc.objects?.[objectId]), `${fixture.id}: document contains ${objectId}`);
      check(Boolean(scene.objects?.[objectId]), `${fixture.id}: resolved scene contains ${objectId}`);
    }
    for (const [objectId, type] of Object.entries(fixture.expectedObjectTypes ?? {})) {
      check(doc.objects?.[objectId]?.type === type, `${fixture.id}: ${objectId} is a ${type}`);
    }

    const capabilitySvg = renderer.renderToSVG(scene);
    check(capabilitySvg.startsWith("<svg"), `${fixture.id}: renderer emits SVG`);
    check(!/<script\b/i.test(capabilitySvg) && !/\son[a-z]+\s*=/i.test(capabilitySvg), `${fixture.id}: rendered SVG has no executable markup`);
    if (fixture.expectedOutputPath) {
      const expectedSvg = await readFile(resolve(root, manifest.fixtureRoot, fixture.expectedOutputPath), "utf8");
      check(capabilitySvg === expectedSvg.trimEnd(), `${fixture.id}: renderer output matches the reviewable snapshot`);
    }
    if (fixture.expectedResolvedPath) {
      const expectedScene = JSON.parse(await readFile(resolve(root, manifest.fixtureRoot, fixture.expectedResolvedPath), "utf8"));
      check(JSON.stringify(projectScene(scene)) === JSON.stringify(expectedScene), `${fixture.id}: resolved scene matches the reviewable snapshot`);
    }

    const capabilityCli = spawnSync(process.execPath, cliCompileArgs(fixturePath, fixture), {
      cwd: root,
      encoding: "utf8",
      env: process.env,
    });
    check(capabilityCli.status === 0 && capabilityCli.stdout.trimEnd() === capabilitySvg, `${fixture.id}: CLI output exactly matches the capability SVG`);
    continue;
  }

  if (fixture.status !== "active") continue;

  for (const objectId of fixture.expectedObjectIds ?? []) {
    check(Boolean(doc.objects?.[objectId]), `${fixture.id}: document contains ${objectId}`);
    check(Boolean(scene.objects?.[objectId]), `${fixture.id}: resolved scene contains ${objectId}`);
  }
  for (const [objectId, type] of Object.entries(fixture.expectedObjectTypes ?? {})) {
    check(doc.objects?.[objectId]?.type === type, `${fixture.id}: ${objectId} is a ${type}`);
  }

  const svg = renderer.renderToSVG(scene);
  check(svg.startsWith("<svg"), `${fixture.id}: renderer emits SVG`);
  check(!/<script\b/i.test(svg) && !/\son[a-z]+\s*=/i.test(svg), `${fixture.id}: rendered SVG has no executable markup`);
  if (fixture.expectedOutputPath) {
    const expectedSvg = await readFile(resolve(root, manifest.fixtureRoot, fixture.expectedOutputPath), "utf8");
    check(svg === expectedSvg.trimEnd(), `${fixture.id}: renderer output matches the reviewable snapshot`);
  }
  if (fixture.expectedResolvedPath) {
    const expectedScene = JSON.parse(await readFile(resolve(root, manifest.fixtureRoot, fixture.expectedResolvedPath), "utf8"));
    check(JSON.stringify(projectScene(scene)) === JSON.stringify(expectedScene), `${fixture.id}: resolved scene matches the reviewable snapshot`);
  }

  const service = new languageService.RelGeoLanguageService();
  const diagnostics = service.getDiagnostics(source);
  check(diagnostics.length === 0, `${fixture.id}: language service reports no diagnostics`);
  check(service.getSemanticTokens(source).length > 0, `${fixture.id}: language service emits semantic tokens`);

  const highlightedTree = fixtureTree("rg", source);
  const semanticLines = service.getSemanticTokens(source);
  remarkHighlight.remarkRelgeoHl({ languageService: service })(highlightedTree);
  const highlightedNode = highlightedTree.children[0];
  check(highlightedNode.data?.hName === "pre", `${fixture.id}: highlighting plugin emits pre surface`);
  check(highlightedNode.data?.hProperties?.["data-relgeo-kind"] === "highlight", `${fixture.id}: highlighting plugin marks its surface`);
  if (fixture.expectedHighlightSha256) {
    const actualHighlightSha256 = createHash("sha256").update(JSON.stringify(highlightedNode.data)).digest("hex");
    check(actualHighlightSha256 === fixture.expectedHighlightSha256, `${fixture.id}: serialized highlighting output matches the expected digest`);
  }
  if (fixture.expectedHighlightSnapshotPath) {
    const expectedHighlightSnapshot = await readFile(resolve(root, manifest.fixtureRoot, fixture.expectedHighlightSnapshotPath), "utf8");
    check(
      humanReadableHighlightSnapshot(source, semanticLines) === expectedHighlightSnapshot.trimEnd(),
      `${fixture.id}: human-readable highlighting snapshot matches`
    );
  }

  const previewTree = fixtureTree("relgeo", source);
  remarkPreview.remarkRelgeo()(previewTree);
  const previewNode = previewTree.children[0];
  check(previewNode.data?.hName === "div", `${fixture.id}: preview plugin emits div surface`);
  check(previewNode.data?.hProperties?.["data-relgeo-kind"] === "preview", `${fixture.id}: preview plugin renders successfully`);
  const previewImage = previewNode.data?.hChildren?.[0];
  const previewSource = previewImage?.properties?.src;
  if (typeof previewSource === "string" && previewSource.startsWith("data:image/svg+xml")) {
    const previewSvg = decodeURIComponent(previewSource.split(",", 2)[1]);
    const previewScene = core.compileRelGeo(source, { targetUnit: "px" });
    const expectedPreviewSvg = renderer.renderToSVG(previewScene, { padding: 0 });
    check(previewSvg === expectedPreviewSvg, `${fixture.id}: Markdown preview image exactly matches the preview pipeline SVG`);
  } else {
    check(false, `${fixture.id}: Markdown preview exposes a decodable SVG image`);
  }

  const cli = spawnSync(process.execPath, cliCompileArgs(fixturePath, fixture), {
    cwd: root,
    encoding: "utf8",
    env: process.env,
  });
  check(cli.status === 0 && cli.stdout.trimEnd() === svg, `${fixture.id}: CLI output exactly matches the shared fixture SVG`);
}

const summary = {
  manifest: manifestPath.slice(root.length + 1),
  compatibilityLine: manifest.compatibilityLine,
  fixtures: manifest.fixtures.length,
  passed: results.filter(({ status }) => status === "PASS").length,
  failed: failures.length,
  failures,
};

console.log(`RelGeo conformance fixtures (${summary.compatibilityLine})`);
for (const result of results) console.log(`[${result.status}] ${result.message}`);
console.log(`summary: ${summary.passed} passed, ${summary.failed} failed across ${summary.fixtures} fixtures`);

process.exitCode = failures.length > 0 ? 1 : 0;
