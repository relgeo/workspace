# RelGeo renderer-svg implementation audit

Audit update — 2026-10-30  
Checkout: 1231dadb5ff6902593cb81665f76699bf0548bbb1  
Local toolchain: Node 22.23.2, pnpm 10.33.3; repository requires Node >=24  
Renderer package checkout: `3b667804e88a51544c75df2f76b74184de128262`; the
renderer worktree contains uncommitted changes in `src/index.ts`,
`src/types.ts`, `src/primitives.ts`, `src/semantic.ts`, focused renderer tests,
and presentation-security fixtures. Expected source:
`docs/capability-map/renderer-svg/expected-capability-catalog.md`
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

Status dokumen: audit refreshed, 2026-10-30
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
fill, font attributes, serta text. The current renderer worktree also escapes
dimension/annotation `fontFamily` and `fill` values in `renderDimension` and
`renderAnnotation`, and adds hostile-value tests plus
`src/__tests__/fixtures/v05-presentation-escaping.yaml`. Renderer tests and
shared conformance confirm no executable markup for the exercised paths.

The earlier `⚠️` finding for `SVG-SEC-001` is therefore locally resolved in
this checkout. This is not a published or canonical-runtime claim: the
Playground still uses a DOM HTML insertion boundary, while browser E2E,
canonical Node >=24, and remote CI remain unverified.

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
| `playground/` | `worker.ts:1-110` imports `renderToSVG`; `Preview.tsx:1078-1089` inserts SVG into `.svg-inner-wrapper`; 93 unit tests and production build | Source wiring and current-example worker compilation pass; historical v0.2/v0.3 showcases remain availability-only | Browser E2E attempted but preview-server bind was blocked by sandbox `EPERM` |
| `relgeo.github.io/` | current-capabilities content declares primary SVG renderer; site CSS styles inline SVG canvas | Website documents/presents the renderer surface | No direct package import or current deployment proof found |

## Verification executed

| Command | Result | Interpretation |
| --- | --- | --- |
| `pnpm --filter @relgeo/renderer-svg test` | PASS — 7 files, 88 tests | Source renderer tests, security tests, reference fixtures, semantic tests, and dist boundary passed |
| `pnpm --filter @relgeo/cli test` | PASS — 10 tests | CLI sheet-selection and renderer integration assertions passed |
| `pnpm --filter relgeo-playground test` | PASS — 15 files, 93 tests | Current examples, worker, persistence, and UI contract tests passed |
| `pnpm --filter @relgeo/remark-relgeo test` | PASS — 5 tests | Markdown preview pipeline and explicit render-error fallback passed |
| `pnpm --filter @relgeo/remark-relgeo-hl test` | PASS — 3 tests | Highlighting consumer tests passed |
| `pnpm --filter relgeo-playground test:e2e` | ENVIRONMENT UNAVAILABLE — preview server bind returned `EPERM` | Browser execution was not possible in this sandbox; this is not target-failure evidence |
| `pnpm run conformance:fixtures` | PASS — 260 checks across 20 fixtures | Current workspace fixture/consumer assertions passed, including renderer snapshots and no-executable-markup checks |

Both commands emitted the workspace warning that Node `22.23.2` is below the
repository requirement `>=24`. The pass is therefore local evidence under the
available toolchain; canonical Node >=24, fresh registry installation, current
remote CI, browser smoke, and deployed website artifact remain **not verified**.

## Audit conclusion

The renderer package is a real and tested resolved-scene-to-SVG implementation,
including primitives, metadata, role filtering, sheet/view output, violation
overlays, bounded boolean/path output, and the current presentation escaping
fix. The active cross-surface contract is narrower than the implementation
surface. The selected missing-sheet/error and semantic projection boundaries
now have local implementation evidence; remaining renderer-local work is
bounded typography/placement evidence, while consumer, browser, and broader
boolean promotion remain bounded or deferred contracts.

## Expected-catalog ID join — current audit

Status values are implementation findings: implemented, partial, absent,
broken, deferred, not applicable, or unverified. Evidence status is separate:
verified-local, partial-local, or not-verified. Local passes do not imply
canonical Node 24, CI, registry, or public verification.

Coverage summary for the 33 expected rows: **26 implemented, 7 partial, 0
broken, and 0 absent**. The selected missing-sheet/error and semantic
projection boundaries now have focused local implementation evidence.
Presentation escaping is locally implemented and verified in the current
renderer worktree; typography and exhaustive placement/consumer evidence
remain partial.

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
| SVG-STYLE-002 | partial | verified-local | `renderer-svg/src/primitives.ts` `renderText`/`renderDimension`/`renderAnnotation`; `renderer-svg/src/__tests__/security.test.ts`; `docs/decisions/08-boolean-intersection-contract-review.md` §11 | Typography, arrow sizing, multiline and fallback placement are exercised safely; exact font metrics and cross-runtime typography remain surface-specific. |
| SVG-META-001 | implemented | verified-local | `renderer-svg/src/utils.ts` `getMetadataAttributes`; `renderer-svg/src/index.ts`; `fixtures/reference/07-component-sheet-meta-override.yaml` | Role, intent, preset/style, and label project to data attributes; cross-consumer promotion is still boundary-only. |
| SVG-META-002 | implemented | partial-local | `renderer-svg/src/index.ts` metadata merge/render path; `spec/id/presentation/26-metadata.md` | Metadata is downstream of resolved geometry by design; the non-authoritative invariant lacks a dedicated mutation/snapshot test. |
| SVG-DIM-001 | partial | verified-local | `renderer-svg/src/primitives.ts` `renderDimension`; `renderer-svg/src/__tests__/reference_fixtures.test.ts`; `renderer-svg/src/__tests__/security.test.ts`; presentation-security fixture | Linear, radius, diameter, and angular dimensions render and hostile presentation values are escaped; typography and exhaustive semantic placement coverage prevent full contract status. |
| SVG-ANNOT-001 | partial | verified-local | `renderer-svg/src/primitives.ts` `renderAnnotation`; `renderer-svg/src/__tests__/security.test.ts`; `fixtures/reference/02-mixed-presentational-sheet.yaml`, `06-nested-structural-sheet.yaml` | Target/leader/place/multiline/fallback annotations render and hostile presentation values are escaped; exact text metrics and broader consumer evidence remain partial. |
| SVG-SHEET-001 | partial | partial-local | `renderer-svg/src/index.ts` `renderSheet`; `fixtures/reference/02-mixed-presentational-sheet.yaml` through `09-multi-sheet-title-block.yaml`; `cli/src/index.ts` `--sheet` | Page border, view placement/scale, title block, standard/custom sizing, and CLI sheet flow work; most direct evidence is legacy 0.4. |
| SVG-SHEET-002 | implemented | verified-local | `renderer-svg/src/index.ts` `render` sheet selection and `renderSheet` missing-view branch; `renderer-svg/src/__tests__/renderer.test.ts`; `cli/src/__tests__/cli.test.ts` | Unknown `sheetId` and missing view references now raise typed `SVGRenderError` values instead of falling back or being skipped; CLI asserts `[MISSING_SHEET]`. |
| SVG-DET-001 | partial | partial-local | `renderer-svg/src/index.ts` root ordering/ID set; `renderer-svg/src/__tests__/reference_fixtures.test.ts`; direct repeated-render probe | Snapshots and repeated local render are stable; no dedicated all-object/order/numeric cross-host determinism suite exists. |
| SVG-ERR-001 | implemented | verified-local | `renderer-svg/src/index.ts`; `renderer-svg/src/__tests__/renderer.test.ts`; `cli/src/__tests__/cli.test.ts`; fixtures 11–14, 17–20 | Invalid padding, unsupported shapes, missing composition targets, missing sheet/view targets, and upstream invalid/runtime errors have deterministic typed/error-propagation coverage. |
| SVG-SEC-001 | implemented | verified-local | `renderer-svg/src/escape.ts`; `renderer-svg/src/primitives.ts`; `renderer-svg/src/__tests__/security.test.ts`; `renderer-svg/src/__tests__/fixtures/v05-presentation-escaping.yaml`; `playground/src/components/Preview.tsx` lines 1087–1089 | Current renderer worktree escapes dynamic dimension/annotation font/fill and hostile text/metadata values; focused tests and conformance show no executable markup. Playground still uses `dangerouslySetInnerHTML`, so browser E2E remains unverified. |
| SVG-EXPORT-001 | implemented | partial-local | `renderer-svg/package.json`; `renderer-svg/tsup.config.ts`; `renderer-svg/src/__tests__/dist_boundary.test.ts`; local `npm pack --dry-run --json` | SVG string and 9-file dist tarball work locally; registry/public artifact remains unverified. |
| SVG-INTEG-001 | implemented | verified-local | `cli/src/index.ts`; `cli/src/__tests__/cli.test.ts`; `scripts/run-conformance-fixtures.mjs` | CLI info/compile/check/validate, SVG/JSON/graph, output path, units, profiles, params, and sheet flow are locally tested/conformant. |
| SVG-INTEG-002 | partial | partial-local | `playground/src/worker.ts`; `playground/src/components/Navbar.tsx`; `playground/src/components/Preview.tsx`; `playground/e2e/` | Worker → renderer → DOM insertion, sheet selector, and overlay controls are wired; browser E2E/public runtime is not verified. |
| SVG-INTEG-003 | implemented | verified-local | `fixtures/manifest.json`; `scripts/run-conformance-fixtures.mjs`; `fixtures/reference/` and `fixtures/expected/` | Root conformance exercises active, legacy, invalid, runtime-diagnostic, runtime-error, and capability statuses across 20 fixtures. |
| SVG-INTEG-004 | implemented | verified-local | `renderer-svg/src/semantic.ts`; `renderer-svg/src/types.ts`; `renderer-svg/src/index.ts` exports; `renderer-svg/src/__tests__/semantic_projection.test.ts`; `renderer-svg/README.md` | Public typed semantic projection exposes schema/version, object order/identity/kind, endpoints, segments, rings/holes, normalized geometry, transforms, and `1e-6` evidence tolerance. Cross-consumer comparator execution remains separate evidence. |

## Discovery coverage report — current audit

| Category | Sources inspected | Coverage result |
| --- | --- | --- |
| Source/API | renderer-svg/src index, primitives, utils, escape, types; package and build config; core resolver; CLI; remark packages; Playground worker/Preview | Public API, emitters, options, escaping, resolved-scene handoff, CLI, plugin, and worker imports inspected. |
| Tests/fixtures | 7 renderer test files; core/CLI/Playground/remark tests; fixture reference/expected/manifest; conformance runner | Renderer 88/88, Playground 93/93, CLI 10/10, remark preview 5/5, remark highlight 3/3, conformance 260/260 across 20 fixtures. |
| UI/menu/command/route | CLI info/compile/check/validate/options; Playground worker, navbar sheet selector, preview toolbar, inspector and overlays; DOM insertion | Renderer has no UI/menu/shortcut/route ownership; host controls were inspected and source wiring is present. Browser E2E is not verified. |
| Platform/security/runtime | Node entrypoints, browser worker/DOM path, dangerous HTML insertion, XML escape paths, physical mode, diagnostic overlay | Node local build/test works; current renderer security tests cover hostile presentation values and typed sheet/error handling; browser source path, native/accessibility, and fresh browser runtime are not verified. |
| Delivery/operations | package scripts, dist boundary test, root integration gate, compatibility/release scripts, npm pack dry-run | Build and tarball dry-run pass; tarball contains 9 public files. Registry/public/current CI are not verified. |
| Ownership/documentation | master plan, compatibility matrix, expected catalog, plan 07, decisions 07/08, renderer/CLI/Playground/remark README, fixture manifest, repository map | Ownership, compatibility 0.5, semantic parity policy, fixture status, consumer boundaries, and raw-byte non-goal are traceable. |

Evidence commands executed in this current audit:

| Command | Result |
| --- | --- |
| pnpm --filter @relgeo/renderer-svg test | PASS, 88/88 |
| pnpm --filter @relgeo/renderer-svg build | PASS, CJS/ESM/DTS |
| pnpm run conformance:fixtures | PASS, 260/260 across 20 fixtures |
| pnpm --filter relgeo-playground test | PASS, 93/93 |
| pnpm --filter relgeo-playground build | PASS, Vite production artifact |
| pnpm --filter @relgeo/cli test | PASS, 10/10 |
| pnpm --filter @relgeo/remark-relgeo test | PASS, 5/5 |
| pnpm --filter @relgeo/remark-relgeo-hl test | PASS, 3/3 |
| npm pack --dry-run --json in renderer-svg | PASS, 9 files for @relgeo/renderer-svg@0.5.0 |
| direct repeated-render probe | PASS, same input produced identical output |
| direct missing-sheet probe | PASS after implementation, unknown `sheetId` raises `MISSING_SHEET` and missing views raise `MISSING_VIEW` |
| current presentation-security tests/probe | PASS, hostile dimension/annotation presentation values are escaped |

All local package commands warned that Node 22.23.2 is below the required
Node >=24. These are local evidence only.

### Implementation and consumer verification refresh — 2026-10-30

The following commands were rerun during this audit task from the checkout
listed above:

| Command | Result | Evidence classification |
| --- | --- | --- |
| `pnpm --filter @relgeo/renderer-svg test` | PASS — 7 files, 88 tests | verified-local; engine warning because the host has Node 22.23.2 while the repository requires Node >=24; includes render-error, semantic-projection, and presentation-security tests |
| `pnpm --filter @relgeo/renderer-svg build` | PASS — CJS, ESM, and DTS artifacts | verified-local; same toolchain limitation |
| `pnpm --filter @relgeo/cli test` | PASS — 10 tests | verified-local; includes unknown-sheet CLI regression |
| `pnpm --filter relgeo-playground test` | PASS — 15 files, 93 tests | verified-local; historical v0.2/v0.3 showcase examples remain availability-only, current examples compile |
| `pnpm --filter relgeo-playground build` | PASS — Vite production artifact | verified-local; browser runtime still separate |
| `pnpm --filter @relgeo/remark-relgeo test` | PASS — 5 tests | verified-local; preview pipeline adapts to explicit sheet-selection errors |
| `pnpm --filter @relgeo/remark-relgeo-hl test` | PASS — 3 tests | verified-local |
| `pnpm run conformance:fixtures` | PASS — 260 checks across 20 fixtures | verified-local; same toolchain limitation |
| `pnpm --filter relgeo-playground test:e2e` | ENVIRONMENT UNAVAILABLE — preview server could not bind `127.0.0.1:4173` (`EPERM`) | not-verified; sandbox host binding prevented browser execution, not evidence of a target failure |

The checks were run against the current uncommitted worktree. Canonical Node
>=24, remote CI, registry/public package installation, browser E2E, and
deployed website evidence remain not verified; the browser E2E attempt is
classified as environment unavailable because the sandbox rejected the local
preview-server bind.

## Boundary status outside the expected IDs

| Boundary | Status | Evidence / reason |
| --- | --- | --- |
| Parsing, validation, dependency resolution, and geometry solving inside renderer | not applicable | Core owns parser, validator, graph, evaluator, and resolver; renderer consumes ResolvedScene. |
| Universal raw SVG byte equality, whitespace, attribute order, and path formatting | not applicable | Decision 07/08 explicitly makes raw equality a non-goal. |
| Broader boolean union/xor/non-rectangle/degenerate promotion | deferred | Decision 08 holds it until a new contract, fixture, and consumer evidence exist. |
| Browser E2E/visual parity, canonical Node >=24, fresh registry/public artifact, native host/accessibility runtime | unverified | Unit/build/conformance and consumer evidence pass; browser E2E was attempted but the sandbox rejected the preview-server bind with `EPERM`; canonical/public/native checks remain unavailable. |

## Current audit handoff

This audit now covers all expected IDs and the required discovery categories.
The implementation refresh preserves the 33 IDs, joins implementation,
evidence, parity, and scope axes separately, and records the selected
sheet/error and semantic projection boundaries as locally implemented. The
remaining work is bounded typography/placement evidence plus consumer,
browser, and canonical-runtime validation.

Explicit scope coverage terms: scene rendering, primitives, transforms, styles, dimensions, layers, composition, semantic parity, deterministic output, error handling, export boundary, browser/Node use, and consumer integration.
