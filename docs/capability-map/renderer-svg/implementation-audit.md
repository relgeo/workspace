# RelGeo renderer-svg implementation audit

Audit update — 2026-10-30  
Checkout: 1231dadb5ff6902593cb81665f76699bf0548bbb1  
Local toolchain: Node 22.23.2, pnpm 10.33.3; repository requires Node >=24  
Expected source: renderer-svg/expected-capability-catalog.md  
This update joins all 33 expected catalog IDs to direct source, test, fixture,
consumer, packaging, and runtime evidence. The original dated evidence below is
retained as historical context; current claims are separated in the sections
added at the end of this audit.

> **Audit coverage statement — 2026-10-29.** This evidence log inspects the
> `ResolvedScene` → SVG source boundary, renderer tests/security checks, shared
> fixtures, core/CLI/Markdown/Playground consumers, and package evidence. It
> does not claim all presentation combinations or browser visual parity; fresh
> CI/canonical, registry/public, and browser checks remain `not verified` where
> stated. See [inventory protocol](../INVENTORY-PROTOCOL.md).

Status dokumen: audit baseline, 2026-10-29  
Surface: `renderer-svg/`  
Owner: `relgeo/renderer-svg`  
Compatibility line: `0.5.x`  
Consumer evidence: `core/`, `fixtures/`, `playground/`, `relgeo.github.io/`

## Scope, owner, source path, dan batas verifikasi

Audit ini memeriksa implementasi aktual dari resolved scene ke SVG, bukan parser
source DSL. `core/` memiliki parse/resolve; `renderer-svg/` menerima
`ResolvedScene` dan menghasilkan string SVG. Fixture root menjadi evidence
lintas consumer, sedangkan Playground adalah runtime browser yang memuat hasil
renderer ke DOM.

| Boundary | Owner | Source path | Yang diverifikasi | Batas verifikasi |
| --- | --- | --- | --- | --- |
| Public renderer API | `relgeo/renderer-svg` | `renderer-svg/src/index.ts`, `types.ts` | `SVGRenderer`, `renderToSVG`, `RenderOptions`, compatibility line | Fresh registry install dan published artifact tidak dijalankan |
| Primitive and presentation emitters | `relgeo/renderer-svg` | `renderer-svg/src/primitives.ts`, `utils.ts`, `escape.ts` | primitives, paths/holes, roles, metadata, dimensions, annotations, transforms | Tidak semua kombinasi presentation field memiliki fixture active |
| Core boundary | `relgeo/core` → renderer | `core/src/resolver/index.ts`, `core/src/resolver/primitives/` | resolved objects, bbox, violations, sheets/views yang dikonsumsi renderer | Core test pass tidak membuktikan visual browser parity |
| Shared fixture boundary | `relgeo/workspace` | `fixtures/manifest.json`, `fixtures/reference/`, `fixtures/expected/`, `scripts/run-conformance-fixtures.mjs` | output/security snapshots dan active/runtime/capability/error fixture behavior | Runner membuktikan declared fixture scope, bukan seluruh renderer contract |
| Playground runtime | `relgeo/workspace` | `playground/src/worker.ts`, `playground/src/components/Preview.tsx` | worker parse → resolve → render, options, DOM insertion, preview overlays | Browser smoke current checkout belum dijalankan pada audit ini |
| Website surface | `relgeo/relgeo.github.io` | `src/content/site/en/current-capabilities.md`, `src/pages/[lang]/`, `src/styles/site.css` | website menyatakan renderer sebagai capability dan menata inline SVG surface | Website tidak mengimpor renderer package secara langsung; deployment/current artifact tidak diverifikasi |

## Audit findings

### Public API dan scene contract

`SVGRenderer.render(scene, options)` dan `renderToSVG(scene, options)` adalah
entrypoint publik. Renderer menghitung viewBox dari `scene.bbox` dan padding,
menghormati origin `top-left`, `bottom-left`, dan `center`, menangani orientasi
`y-up`, lalu merender root object secara rekursif. `RenderOptions` mencakup
role visibility, anchors, labels, bounding box, sheet selection, hairline,
non-scaling stroke, dan physical mode.

### Primitive, semantic metadata, dan sheets

Emitter tersedia untuk rect, line, circle, ellipse, arc, quadratic, cubic,
point, text, path, polygon, boolean, dimension, dan annotation. Group, clone,
collection, dan component dirender sebagai group SVG dengan ID/metadata.
Closed shapes dengan holes diproyeksikan menjadi path `fill-rule="evenodd"`.
Sheet rendering menghasilkan page border, view placement/scale, viewport label,
dan title block. Reference fixtures 02–09 menguji sheet, clone, grouping,
escaping, dan multi-sheet behavior.

### Security and confirmed issue

`escapeXml` dan `getCommonAttributes` meng-escape ID, role, metadata, stroke,
fill, font attributes, serta text. Security tests dan conformance checks
mengonfirmasi no-executable-markup untuk tested fixtures.

Namun ada masalah source yang terkonfirmasi: `renderDimension` dan
`renderAnnotation` menginterpolasikan `obj.meta.fontFamily`, `obj.meta.fill`,
dan beberapa effective color values langsung ke attributes (`primitives.ts`
sekitar lines 289, 512, dan 526). Jalur ini tidak seluruhnya melewati
`escapeXml`; suite security saat ini menguji common attributes dan text, bukan
metadata font/fill pada dimension/annotation. Ini dicatat sebagai `⚠️`, bukan
sebagai klaim bahwa fixture aktif sudah exploitable, karena input path tersebut
belum diuji dengan malicious fixture.

### Boolean/intersection and semantic parity

Renderer dapat menulis resolved boolean sebagai closed path dan mempertahankan
holes melalui even-odd fill. Fixture 15 memberi evidence active untuk line-line
intersection serta rectangle `intersect`/`subtract`; fixtures 19/20 memberi
runtime-error evidence untuk empty/multipart boolean results. Decision 08
menahan `union`, `xor`, operand non-rectangle, dan topology expansion yang lebih
luas sampai ada contract/evidence baru. Parity policy membandingkan semantic
geometry/object anchors; raw SVG byte equality bukan target umum, walaupun
fixture runner tetap memakai serialized snapshots pada boundary yang disepakati.

### Consumer evidence

| Consumer | Evidence | Result | Limit |
| --- | --- | --- | --- |
| `core/` | resolver produces `ResolvedScene`, bbox, violations, sheets/views; core tests | Renderer boundary is directly exercised | Core does not prove browser rendering |
| `fixtures/` | active 10, runtime 14, active boolean 15, candidate 16, runtime errors 19/20 | `pnpm run conformance:fixtures`: `260/260` | Declared fixture scope only |
| `playground/` | `worker.ts:1-110` imports `renderToSVG`; `Preview.tsx:1078-1089` inserts SVG into `.svg-inner-wrapper` | Source wiring is present; worker supports model/sheet preview and options | Current browser/E2E run not verified in this audit |
| `relgeo.github.io/` | current-capabilities content declares primary SVG renderer; site CSS styles inline SVG canvas | Website documents/presents the renderer surface | No direct package import or current deployment proof found |

## Verification executed

| Command | Result | Interpretation |
| --- | --- | --- |
| `pnpm --filter @relgeo/renderer-svg test` | PASS — 6 files, 79 tests | Source renderer tests, security tests, reference fixtures, semantic tests, and dist boundary passed |
| `pnpm run conformance:fixtures` | PASS — 260 checks across 20 fixtures | Current workspace fixture/consumer assertions passed, including renderer snapshots and no-executable-markup checks |

Both commands emitted the workspace warning that Node `22.23.2` is below the
repository requirement `>=24`. The pass is therefore local evidence under the
available toolchain; canonical Node >=24, fresh registry installation, current
remote CI, browser smoke, and deployed website artifact remain **not verified**.

## Audit conclusion

The renderer package is a real and tested resolved-scene-to-SVG implementation,
including primitives, metadata, role filtering, sheet/view output, violation
overlays, and bounded boolean/path output. The active cross-surface contract is
narrower than the implementation surface. The next concrete renderer work is
to close escaping coverage/fixes for dimension and annotation attributes, then
add semantic fixture coverage only when a capability is promoted beyond the
current rectangle/line boolean boundary.

## Expected-catalog ID join — current audit

Status values are implementation findings: implemented, partial, absent,
broken, deferred, not applicable, or unverified. Evidence status is separate:
verified-local, partial-local, or not-verified. Local passes do not imply
canonical Node 24, CI, registry, or public verification.

Coverage summary for the 33 expected rows: **22 implemented, 8 partial, 2
broken, and 1 absent**. The two broken rows are the missing-sheet behavior and
unsafe dynamic dimension/annotation attributes; the absent row is a
renderer-owned semantic comparator/adapter API.

| ID | Status | Evidence status | Evidence path / reference | Finding / limitation |
| --- | --- | --- | --- | --- |
| SVG-API-001 | implemented | verified-local | `renderer-svg/src/index.ts`; `renderer-svg/src/types.ts`; `renderer-svg/src/__tests__/dist_boundary.test.ts` | `SVGRenderer` and `renderToSVG` are public exports accepting `ResolvedScene` and `RenderOptions`; source, package tests, and dist boundary cover the API. |
| SVG-API-002 | implemented | partial-local | `renderer-svg/src/index.ts`; `renderer-svg/package.json`; `playground/src/worker.ts` | Renderer has no DOM dependency and Node build works; fresh browser runtime remains not verified. |
| SVG-SCENE-001 | implemented | partial-local | `renderer-svg/src/index.ts` empty-scene branch; `renderer-svg/src/__tests__/renderer.test.ts` | Valid empty-scene SVG fallback exists; no dedicated empty-scene snapshot exists. |
| SVG-SCENE-002 | implemented | verified-local | `renderer-svg/src/index.ts` bbox/origin/viewBox logic; `renderer-svg/src/__tests__/renderer.test.ts` | Bbox, padding, origin, orientation, and viewBox are covered by renderer/semantic tests and snapshots. |
| SVG-SCENE-003 | partial | partial-local | `renderer-svg/src/index.ts` physicalMode/sizing logic; `fixtures/reference/02-mixed-presentational-sheet.yaml` | Width/height, physical mode, viewBox, preserveAspectRatio, and sheet sizing exist; print/browser/unit combinations are not exhaustively contracted. |
| SVG-PRIM-001 | implemented | verified-local | `renderer-svg/src/primitives.ts` `renderPoint`/`renderLine`; `fixtures/reference/10-v05-relational-baseline.yaml`; fixture 15 | Point and line emitters preserve resolved coordinates/endpoints; fixtures 10/15 and renderer tests cover the path. |
| SVG-PRIM-002 | implemented | verified-local | `renderer-svg/src/primitives.ts` `renderRect`/`renderCircle`/`renderEllipse`; `renderer-svg/src/__tests__/reference_fixtures.test.ts` | Rect, circle, and ellipse emitters are covered by source tests and shared fixtures. |
| SVG-PRIM-003 | implemented | verified-local | `renderer-svg/src/primitives.ts` `renderArc`/`renderQuadratic`/`renderCubic`; `renderer-svg/src/__tests__/renderer.test.ts` | Arc, quadratic, and cubic path commands are emitted and locally tested. |
| SVG-PRIM-004 | implemented | verified-local | `renderer-svg/src/primitives.ts` `renderText`/polygon dispatch; `fixtures/expected/10-v05-relational-baseline.svg` | Polygon and multiline text output are covered by renderer tests and active fixture 10. |
| SVG-PATH-001 | implemented | verified-local | `renderer-svg/src/primitives.ts` `renderPath`/`segmentsToD`; `fixtures/expected/10-v05-relational-baseline.svg`; fixture 15 snapshot | Open/closed paths, holes, islands, and even-odd projection are covered; topology meaning remains geometry/core-owned. |
| SVG-BOOLEAN-001 | implemented | verified-local | `fixtures/reference/15-v05-boolean-intersection-candidate.yaml`; `fixtures/expected/15-v05-boolean-intersection-candidate.svg`; `scripts/run-conformance-fixtures.mjs` | Approved line-line and rectangle intersect/subtract boundary passes fixture 15 and conformance; broader booleans remain outside scope. |
| SVG-BOOLEAN-002 | implemented | verified-local | `fixtures/reference/19-v05-runtime-empty-boolean.yaml`; `fixtures/reference/20-v05-runtime-multipart-boolean.yaml`; `cli/src/index.ts` | Fixtures 19/20 and CLI assertions preserve empty/multipart error codes upstream. |
| SVG-COMP-001 | implemented | verified-local | `renderer-svg/src/index.ts` `renderRecursive`; `fixtures/reference/04-grouped-sheet-rooting.yaml`, `05-clone-sheet-target.yaml`, `07-component-sheet-meta-override.yaml` | Group, clone, component, and nested composition render recursively with IDs and metadata. |
| SVG-COMP-002 | implemented | partial-local | `renderer-svg/src/index.ts` collection/component dispatch; `spec/id/geometry/16-collection-objects.md`; fixture 06 | Collection wrappers and children render in stable declared order; broad multi-result semantic promotion is not active. |
| SVG-TRANS-001 | implemented | verified-local | `renderer-svg/src/utils.ts` `getTransformString`; `renderer-svg/src/index.ts`; `renderer-svg/src/__tests__/renderer.test.ts` | Translate, rotate, scale, mirror, and transform chains are emitted and tested. |
| SVG-LAYER-001 | implemented | partial-local | `renderer-svg/src/index.ts` `shouldRenderRole`; `renderer-svg/src/utils.ts`; `playground/src/worker.ts` | Role visibility, hidden/construction filtering, classes, and defaults are wired; full cross-consumer palette parity is not verified. |
| SVG-LAYER-002 | implemented | partial-local | `renderer-svg/src/index.ts` debug/anchor/label branches; `playground/src/components/Preview.tsx` overlay controls | Anchors, labels, bbox, and inspection overlays exist; optional overlay combinations are not fully fixture-covered. |
| SVG-STYLE-001 | implemented | partial-local | `renderer-svg/src/utils.ts` `getCommonAttributes`; `renderer-svg/src/__tests__/security.test.ts`; `docs/decisions/08-boolean-intersection-contract-review.md` §11 | Stroke, fill, width, opacity, dash, hairline, and role defaults exist; presentation details remain best-effort. |
| SVG-STYLE-002 | partial | partial-local | `renderer-svg/src/primitives.ts` `renderDimension`/`renderAnnotation`; `docs/decisions/08-boolean-intersection-contract-review.md` §11 | Typography, arrow sizing, multiline and fallback placement exist, but dimension/annotation dynamic attributes have an escaping defect and exact metrics are surface-specific. |
| SVG-META-001 | implemented | verified-local | `renderer-svg/src/utils.ts` `getMetadataAttributes`; `renderer-svg/src/index.ts`; `fixtures/reference/07-component-sheet-meta-override.yaml` | Role, intent, preset/style, and label project to data attributes; cross-consumer promotion is still boundary-only. |
| SVG-META-002 | implemented | partial-local | `renderer-svg/src/index.ts` metadata merge/render path; `spec/id/presentation/26-metadata.md` | Metadata is downstream of resolved geometry by design; the non-authoritative invariant lacks a dedicated mutation/snapshot test. |
| SVG-DIM-001 | partial | partial-local | `renderer-svg/src/primitives.ts` `renderDimension`; `renderer-svg/src/__tests__/reference_fixtures.test.ts`; security probe | Linear, radius, diameter, and angular dimensions render and are tested; escaping and typography prevent full contract status. |
| SVG-ANNOT-001 | partial | partial-local | `renderer-svg/src/primitives.ts` `renderAnnotation`; `fixtures/reference/02-mixed-presentational-sheet.yaml`, `06-nested-structural-sheet.yaml` | Target/leader/place/multiline/fallback annotations render; dynamic font/fill interpolation shares the confirmed security gap. |
| SVG-SHEET-001 | partial | partial-local | `renderer-svg/src/index.ts` `renderSheet`; `fixtures/reference/02-mixed-presentational-sheet.yaml` through `09-multi-sheet-title-block.yaml`; `cli/src/index.ts` `--sheet` | Page border, view placement/scale, title block, standard/custom sizing, and CLI sheet flow work; most direct evidence is legacy 0.4. |
| SVG-SHEET-002 | broken | verified-local | `renderer-svg/src/index.ts` `render` sheet selection and `renderSheet` missing-view branch; direct missing-sheet probe | Unknown `sheetId` silently falls back to model rendering; missing views are skipped instead of producing an explicit error. |
| SVG-DET-001 | partial | partial-local | `renderer-svg/src/index.ts` root ordering/ID set; `renderer-svg/src/__tests__/reference_fixtures.test.ts`; direct repeated-render probe | Snapshots and repeated local render are stable; no dedicated all-object/order/numeric cross-host determinism suite exists. |
| SVG-ERR-001 | partial | partial-local | `renderer-svg/src/index.ts`; `renderer-svg/src/__tests__/reference_fixtures.test.ts`; fixtures 11–14, 17–20 | Upstream invalid/runtime errors are covered; renderer malformed-input and missing-sheet behavior is incomplete. |
| SVG-SEC-001 | broken | verified-local | `renderer-svg/src/escape.ts`; `renderer-svg/src/primitives.ts` lines 289, 509–526; `renderer-svg/src/__tests__/security.test.ts`; `playground/src/components/Preview.tsx` lines 1087–1089 | Common attributes/text/sheet strings escape, but dimension/annotation `fontFamily`/`fill` can emit raw executable markup; Playground uses `dangerouslySetInnerHTML`. |
| SVG-EXPORT-001 | implemented | partial-local | `renderer-svg/package.json`; `renderer-svg/tsup.config.ts`; `renderer-svg/src/__tests__/dist_boundary.test.ts`; local `npm pack --dry-run --json` | SVG string and 9-file dist tarball work locally; registry/public artifact remains unverified. |
| SVG-INTEG-001 | implemented | verified-local | `cli/src/index.ts`; `cli/src/__tests__/cli.test.ts`; `scripts/run-conformance-fixtures.mjs` | CLI info/compile/check/validate, SVG/JSON/graph, output path, units, profiles, params, and sheet flow are locally tested/conformant. |
| SVG-INTEG-002 | partial | partial-local | `playground/src/worker.ts`; `playground/src/components/Navbar.tsx`; `playground/src/components/Preview.tsx`; `playground/e2e/` | Worker → renderer → DOM insertion, sheet selector, and overlay controls are wired; browser E2E/public runtime is not verified. |
| SVG-INTEG-003 | implemented | verified-local | `fixtures/manifest.json`; `scripts/run-conformance-fixtures.mjs`; `fixtures/reference/` and `fixtures/expected/` | Root conformance exercises active, legacy, invalid, runtime-diagnostic, runtime-error, and capability statuses across 20 fixtures. |
| SVG-INTEG-004 | absent | partial-local | `renderer-svg/src/` exports; `scripts/run-conformance-fixtures.mjs`; `docs/decisions/07-cross-repo-open-decisions.md` §5 | No renderer-owned semantic comparator/adapter API was found; current evidence compares resolved JSON and serialized SVG snapshots. |

## Discovery coverage report — current audit

| Category | Sources inspected | Coverage result |
| --- | --- | --- |
| Source/API | renderer-svg/src index, primitives, utils, escape, types; package and build config; core resolver; CLI; remark packages; Playground worker/Preview | Public API, emitters, options, escaping, resolved-scene handoff, CLI, plugin, and worker imports inspected. |
| Tests/fixtures | 6 renderer test files; core/CLI/Playground/remark tests; fixture reference/expected/manifest; conformance runner | Renderer 79/79, Playground 93/93, CLI 9/9, remark preview 5/5, remark highlight 3/3, conformance 260/260 across 20 fixtures. |
| UI/menu/command/route | CLI info/compile/check/validate/options; Playground worker, navbar sheet selector, preview toolbar, inspector and overlays; DOM insertion | Renderer has no UI/menu/shortcut/route ownership; host controls were inspected and source wiring is present. Browser E2E is not verified. |
| Platform/security/runtime | Node entrypoints, browser worker/DOM path, dangerous HTML insertion, XML escape paths, physical mode, diagnostic overlay | Node local build/test works; browser source path exists; native/accessibility and fresh browser runtime are not verified. Two direct defects are confirmed. |
| Delivery/operations | package scripts, dist boundary test, root integration gate, compatibility/release scripts, npm pack dry-run | Build and tarball dry-run pass; tarball contains 9 public files. Registry/public/current CI are not verified. |
| Ownership/documentation | master plan, compatibility matrix, expected catalog, plan 07, decisions 07/08, renderer/CLI/Playground/remark README, fixture manifest, repository map | Ownership, compatibility 0.5, semantic parity policy, fixture status, consumer boundaries, and raw-byte non-goal are traceable. |

Evidence commands executed in this current audit:

| Command | Result |
| --- | --- |
| pnpm --filter @relgeo/renderer-svg test | PASS, 79/79 |
| pnpm --filter @relgeo/renderer-svg build | PASS, CJS/ESM/DTS |
| pnpm run conformance:fixtures | PASS, 260/260 across 20 fixtures |
| pnpm --filter relgeo-playground test | PASS, 93/93 |
| pnpm --filter relgeo-playground build | PASS, Vite production artifact |
| pnpm --filter @relgeo/cli test | PASS, 9/9 |
| pnpm --filter @relgeo/remark-relgeo test | PASS, 5/5 |
| pnpm --filter @relgeo/remark-relgeo-hl test | PASS, 3/3 |
| npm pack --dry-run --json in renderer-svg | PASS, 9 files for @relgeo/renderer-svg@0.5.0 |
| direct repeated-render probe | PASS, same input produced identical output |
| direct missing-sheet probe | CONFIRMED BROKEN, unknown sheetId returned model fallback |
| direct malicious dimension probe | CONFIRMED BROKEN, raw script markup reached dynamic attributes |

All local package commands warned that Node 22.23.2 is below the required
Node >=24. These are local evidence only.

### Independent validation refresh — 2026-10-30

The following commands were rerun during this audit task from the checkout
listed above:

| Command | Result | Evidence classification |
| --- | --- | --- |
| `pnpm --filter @relgeo/renderer-svg test` | PASS — 6 files, 79 tests | verified-local; engine warning because the host has Node 22.23.2 while the repository requires Node >=24 |
| `pnpm --filter @relgeo/renderer-svg build` | PASS — CJS, ESM, and DTS artifacts | verified-local; same toolchain limitation |
| `pnpm run conformance:fixtures` | PASS — 260 checks across 20 fixtures | verified-local; same toolchain limitation |

No source, fixture, or generated artifact changes were made by these checks.
Canonical Node >=24, remote CI, registry/public package installation,
browser E2E, and deployed website evidence remain not verified in this task.

## Boundary status outside the expected IDs

| Boundary | Status | Evidence / reason |
| --- | --- | --- |
| Parsing, validation, dependency resolution, and geometry solving inside renderer | not applicable | Core owns parser, validator, graph, evaluator, and resolver; renderer consumes ResolvedScene. |
| Universal raw SVG byte equality, whitespace, attribute order, and path formatting | not applicable | Decision 07/08 explicitly makes raw equality a non-goal. |
| Broader boolean union/xor/non-rectangle/degenerate promotion | deferred | Decision 08 holds it until a new contract, fixture, and consumer evidence exist. |
| Browser E2E/visual parity, canonical Node >=24, fresh registry/public artifact, native host/accessibility runtime | unverified | Source/build/local test evidence exists, but these environment checks were not run or reproducible in this audit. |

## Current audit handoff

This audit now covers all expected IDs and the required discovery categories
without changing renderer source. The next reconciliation task should preserve
the 33 IDs, join implementation/evidence/parity/scope axes separately, and
split the two confirmed defects from verification-only follow-ups.

Explicit scope coverage terms: scene rendering, primitives, transforms, styles, dimensions, layers, composition, semantic parity, deterministic output, error handling, export boundary, browser/Node use, and consumer integration.
