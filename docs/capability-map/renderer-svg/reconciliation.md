# Renderer-SVG Expected-versus-Observed Reconciliation

**Tanggal:** 2026-11-05

**Expected source:** [Renderer-SVG expected capability catalog](./expected-capability-catalog.md)

**Observed source:** [Renderer-SVG implementation audit](./implementation-audit.md)

**Status view:** [Renderer-SVG status matrix](./status-matrix.md)

**Compatibility line:** RelGeo DSL `0.5.x`
**Status:** join selesai; setiap expected ID memiliki tepat satu hasil rekonsiliasi
dan closure boundary dibekukan pada register §0.2

## 0. Contract and acceptance lock

**Lock date:** 2026-11-04. This section freezes the implementation boundary
for the renderer-local P0/P1 rows selected by the triage. It is an
acceptance contract, not an implementation claim and not a public API change.
The shared `GAP-009` and `GAP-013` rows consume the same presentation and safe
serialization rules below; `SVG-INTEG-002` is implemented at the local
consumer boundary while browser/consumer host proof remains evidence-only.

The active compatibility source is
[`docs/compatibility-matrix.json`](../../compatibility-matrix.json): contract
line `0.5`, public package family `0.5.x`, active parser version `0.5`, and
renderer release order after `core`. The inventory rules in
[`INVENTORY-PROTOCOL.md`](../INVENTORY-PROTOCOL.md) remain binding: status,
evidence, parity, and scope are separate axes; local evidence cannot be
promoted to CI/public evidence; and `not verified` is not a target failure.
No public option, semantic schema field, error code, or compatibility version
may change under this lock without first updating its normative source of truth
and the focused acceptance fixture.

| Selected ID | Owner / normative source of truth | Success behavior | Failure / edge behavior | Acceptance evidence expected |
| --- | --- | --- | --- | --- |
| `SVG-SCENE-003` | `relgeo/renderer-svg` with CLI/Playground context owners; `spec/id/presentation/25-views-sheets.md`, catalog §2.2, `renderer-svg/src/types.ts` and `index.ts` | Default and physical render contexts emit valid root `width`/`height`, `viewBox`, and `preserveAspectRatio`; changing context never changes semantic object identity, order, or geometry. | Invalid numeric render options fail with `SVGRenderError(INVALID_RENDER_OPTIONS)`; empty/zero-size scene fallback stays valid and deterministic; non-px physical conversion is explicit and does not mutate `ResolvedScene`. Browser print/layout remains host-owned. | Renderer default/physical sizing regression, viewBox/preserveAspectRatio assertions, semantic immutability check, fixture coverage, and shared conformance. |
| `SVG-STYLE-002` | `relgeo/renderer-svg`; `spec/id/presentation/22-dimension.md`, `23-annotation.md`, Decision 08 §11, `renderer-svg/src/escape.ts` and `utils.ts` | Text, arrows, multiline labels, fallback font/size/baseline, and dynamic style attributes serialize deterministically at the renderer boundary. | Omitted presentation values use bounded fallback; hostile text/font/fill/metadata remain escaped content or attribute values and cannot create `<script>`, `foreignObject`, or `on*` attributes. Exact font metrics/wrapping are not cross-runtime contract. | `security.test.ts`, presentation-escaping fixture, renderer suite, no-executable-markup assertions, and semantic projection invariants. |
| `SVG-DIM-001` | `relgeo/renderer-svg` + core dimension owner; `spec/id/presentation/22-dimension.md`, `renderer-svg/src/primitives.ts`, fixture `v05-presentation-escaping` | Linear, radius, diameter, and angular dimensions preserve resolved kind, target references, endpoints/values, extension/leader placement, label order, and default `dimension` role without changing model geometry. | Missing optional placement uses stable renderer fallback; hostile label/font/fill values are escaped; style or wording changes cannot alter semantic measurement. Resolver meaning and measurement are never recomputed by renderer. | Dimension-kind renderer tests, semantic projection assertions, hostile-input fixture, conformance, and local CLI/Markdown snapshots where available. |
| `SVG-ANNOT-001` | `relgeo/renderer-svg` + Playground consumer; `spec/id/presentation/23-annotation.md`, `renderer-svg/src/primitives.ts`, fixtures 02/06 and presentation-escaping fixture | Target-only, placed, leader, and multiline annotations preserve target/leader endpoints, placement, line order, and annotation-layer semantics while leaving geometry unchanged. | Missing placement gets stable target-based fallback; hostile text/font/fill values remain escaped and cannot add executable SVG nodes/attributes. DOM mounting and exact metrics remain consumer/runtime boundaries. | Annotation renderer tests, semantic projection checks, fixtures 02/06 and hostile-input fixture, no-executable-markup assertions; browser smoke is separate. |
| `SVG-SHEET-001` | `relgeo/renderer-svg` + core/CLI; `spec/id/presentation/25-views-sheets.md`, renderer `renderSheet`, fixtures 02/03/09 | A selected sheet emits page background/border, selected view placement and scale, title block, standard/custom dimensions, and stable SVG sizing without mutating resolved model geometry. | Unknown `sheetId` fails with `MISSING_SHEET`; a sheet placement referencing a missing view fails with `MISSING_VIEW`; invalid sheet structure remains an upstream core diagnostic. No silent skip or model fallback is allowed. | Fixtures 02/03/09 plus renderer selected-sheet/title-block/reuse tests, CLI selected-sheet tests, core sheet resolution tests, and conformance; host visual parity remains separate. |
| `SVG-DET-001` | `relgeo/renderer-svg` + core/parity; `spec/id/core/05-semantic-guarantees.md` §5.7, `spec/id/geometry/19-collections.md`, `renderer-svg/src/semantic.ts`, fixture manifest `semanticSerialization` | Public projection uses schema `relgeo.svg-semantic`, schema version `1`, compatibility line `0.5`, tolerance `1e-6`, stable object order/IDs/kinds/topology/endpoints, and normalized finite numbers. Repeated local replay yields equal semantic output. | Non-finite semantic numbers fail canonical serialization; array semantic order is preserved; raw SVG byte/whitespace/attribute-order/font equality is explicitly not acceptance criteria. Node >=24, Flutter, and cross-host runs remain separate evidence. | `semantic_projection.test.ts`, active fixture 10 JSON/projection replay, conformance, and a repeated-process comparator over the locked fields. |

## 0.1 Consumer and artifact boundary verification — 2026-11-05

The current worktree was checked across the downstream boundaries named by the
integration gate. Results below are local evidence only; historical CI/public
records are not reused as current-pointer evidence.

| Boundary | Command / artifact | Result | Evidence classification and limit |
| --- | --- | --- | --- |
| Renderer package | `npm pack --dry-run --json` in `renderer-svg/` | PASS — `@relgeo/renderer-svg@0.5.0`, 9 files | Local pack boundary; registry install/public release not verified |
| CLI consumer | `pnpm --filter @relgeo/cli test -- --run` | PASS — 38 tests | Local downstream consumer evidence |
| Markdown consumers | `pnpm --filter @relgeo/remark-relgeo test`; `pnpm --filter @relgeo/remark-relgeo-hl test` | PASS — 16 and 10 tests | Local preview/highlighting evidence |
| Playground consumer | `pnpm --filter relgeo-playground test`; `pnpm --filter relgeo-playground build` | PASS — 107 tests and production build | Local worker/build evidence; Node >=24 integration gate remains not verified |
| Shared fixture boundary | `pnpm run conformance:fixtures` | PASS — 298 checks across 23 fixtures | Local fixture, serialization/provenance, CLI, Markdown, and preview evidence |
| Website artifact | `pnpm run check`, `pnpm run build`, `pnpm run test` in `relgeo.github.io/` | PASS — 0 Astro diagnostics; 138 pages built; built-output assertions passed | Local docs artifact; deployed/public smoke not verified |
| Cross-repo integration runner | `pnpm run integration:gate -- --local` | NOT VERIFIED — exit 2 before stages because host Node is 22.23.2 and runner requires Node >=24 | Does not establish consumer parity failure; canonical CI evidence remains tied to its recorded revision |

The renderer, CLI, Playground, Markdown, fixture, and website checks do not
show a downstream consumer regression in the selected local scope. Public
registry, fresh isolated install, canonical CI, browser, and native/Flutter
boundaries remain separate evidence classes.

## 0.2 Frozen closure-boundary register — 2026-11-05

Register ini adalah join operasional untuk lima artefak capability-map. Ia
mempertahankan seluruh 33 expected renderer ID, lalu menambahkan shared
renderer rows `GAP-009` dan `GAP-013` serta row consumer terkait
`MD-DIAG-003`. Tidak ada row yang dikeluarkan karena implementasi belum ada,
evidence sulit dijalankan, atau host tidak tersedia.

`Class` memakai satu dari `renderer-owned`, `shared`, `consumer`, atau
`evidence-only`. `➖` dan `⏸️` hanya dipakai pada boundary findings eksplisit di
bawah register; keduanya bukan cara untuk menghapus expected row. `Current
status` adalah status implementasi/reconciliation saat freeze, sedangkan
`Evidence requirement` menyatakan bukti yang masih harus dipertahankan atau
diperoleh untuk klaim pada boundary tersebut.

| ID | Class | Owner | Source of truth | Closure boundary / remaining boundary | Current status | Evidence requirement | Scope decision |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `SVG-API-001` | renderer-owned | `relgeo/renderer-svg` | `renderer-svg/README.md`; `src/index.ts`; `src/types.ts` | Public resolved-scene API; no private-internals claim | `✔️ implemented` / `verified-local` | dist-boundary test, package test/build | in scope |
| `SVG-API-002` | shared | renderer + browser hosts | `renderer-svg/README.md`; package entrypoint; Playground worker | DOM-free Node renderer plus embeddable SVG; fresh browser runtime remains evidence-only | `✔️ implemented` / `partial-local` | package build and supported-host browser smoke | in scope; host insertion is consumer-owned |
| `SVG-SCENE-001` | renderer-owned | `relgeo/renderer-svg` | `spec/id/core/03-scene.md`; `src/index.ts` | Valid root and deterministic empty-scene fallback | `✔️ implemented` / `partial-local` | renderer root/empty-scene regression; retain dedicated coverage target | in scope |
| `SVG-SCENE-002` | renderer-owned | `relgeo/renderer-svg` | `spec/id/core/03-scene.md`; `src/index.ts` | Bbox, padding, origin, orientation, and viewBox projection | `✔️ implemented` / `verified-local` | renderer semantic/snapshot tests | in scope |
| `SVG-SCENE-003` | shared | renderer + core + CLI/Playground | `spec/id/presentation/25-views-sheets.md`; catalog §2.2; `src/types.ts`/`index.ts` | Root sizing and physical context; browser print/layout stays host-owned | `✔️ implemented` / `verified-local` | default/physical sizing tests, viewBox/preserveAspectRatio assertions, semantic immutability, conformance | in scope with host evidence boundary |
| `SVG-PRIM-001` | renderer-owned | `relgeo/renderer-svg` | `spec/id/geometry/14-geometry-objects.md`; `src/primitives.ts` | Point/line elements preserve resolved coordinates and endpoints | `✔️ implemented` / `verified-local` | primitive tests and fixtures 10/15 | in scope |
| `SVG-PRIM-002` | renderer-owned | `relgeo/renderer-svg` | `spec/id/geometry/14-geometry-objects.md`; `src/primitives.ts` | Rect/circle/ellipse preserve resolved dimensions | `✔️ implemented` / `verified-local` | primitive tests and shared fixtures | in scope |
| `SVG-PRIM-003` | renderer-owned | `spec` + `relgeo/renderer-svg` | `spec/id/geometry/14-geometry-objects.md`; `src/primitives.ts` | Arc/quadratic/cubic semantic curve projection | `✔️ implemented` / `verified-local` | emitter and renderer tests | in scope |
| `SVG-PRIM-004` | renderer-owned | `relgeo/renderer-svg` | `spec/id/geometry/14-geometry-objects.md`; `spec/id/presentation/23-annotation.md` | Polygon/text identity and placement; exact font metrics excluded | `✔️ implemented` / `verified-local` | renderer tests and active fixture 10 | in scope with typography boundary |
| `SVG-PATH-001` | renderer-owned | `relgeo/renderer-svg` | `spec/id/geometry/14-geometry-objects.md`, `16-collection-objects.md`; plan 07 §7 | Open/closed paths, islands, holes, and fill-rule projection | `✔️ implemented` / `verified-local` | path tests, fixture 10/15, semantic topology checks | in scope; upstream topology remains core-owned |
| `SVG-BOOLEAN-001` | shared | renderer + core/geometry | Decision 08; `fixtures/manifest.json` fixture 15 | Only line-line and rectangle intersect/subtract promotion boundary | `✔️ implemented` / `verified-local` | fixture 15 and conformance | in scope with explicit boundary |
| `SVG-BOOLEAN-002` | shared | renderer + core | Decision 08 §3.3; `spec/id/core/06-error-model.md`; fixtures 19/20 | Empty/multipart result errors; no broader boolean expansion | `✔️ implemented` / `verified-local` | fixtures 19/20 and CLI error assertions | in scope with explicit boundary |
| `SVG-COMP-001` | renderer-owned | `relgeo/renderer-svg` | `spec/id/geometry/15-composition-objects.md`; `src/index.ts` | Recursive group/clone/component projection with identity | `✔️ implemented` / `verified-local` | composition fixtures and renderer tests | in scope |
| `SVG-COMP-002` | shared | renderer + core | `spec/id/geometry/16-collection-objects.md`, `19-collections.md` | Stable collection wrappers/order/IDs; broad multi-result promotion remains bounded | `✔️ implemented` / `partial-local` | fixture 06, ordering tests, parity boundary review | in scope with promotion boundary |
| `SVG-TRANS-001` | renderer-owned | `relgeo/renderer-svg` | `spec/id/geometry/13-object-model.md`, `15-composition-objects.md`, `17-placement.md` | Resolved transform chain serialization | `✔️ implemented` / `verified-local` | transform tests | in scope |
| `SVG-LAYER-001` | shared | renderer + host consumers | `spec/id/presentation/24-drawing-roles.md`, `26-metadata.md`; `src/index.ts` | Role filtering/defaults; cross-consumer palette parity is evidence-only | `✔️ implemented` / `partial-local` | role/filter tests and consumer fixture evidence | in scope with consumer boundary |
| `SVG-LAYER-002` | consumer | renderer + Playground | `playground/README.md`; plan 05; `src/index.ts` overlay branches | Inspection hooks/overlays; optional combinations remain bounded by consumer fixtures | `✔️ implemented` / `partial-local` | overlay controls, bounded fixtures, Playground checks | in scope with consumer boundary |
| `SVG-STYLE-001` | renderer-owned | `relgeo/renderer-svg` | `spec/id/presentation/24-drawing-roles.md`, `26-metadata.md`; `src/utils.ts` | Safe stroke/fill/width/opacity/dash/default projection | `✔️ implemented` / `partial-local` | renderer/security tests and no-executable-markup assertions | in scope |
| `SVG-STYLE-002` | shared | renderer + spec | `spec/id/presentation/22-dimension.md`, `23-annotation.md`; Decision 08 §11; `src/escape.ts`/`utils.ts` | Text/arrow/multiline fallback and escaping; exact cross-runtime metrics/wrapping excluded | `✔️ implemented` / `verified-local` | security suite, presentation fixture, renderer suite, semantic invariants | renderer boundary closed; retain host metric boundary |
| `SVG-META-001` | shared | renderer + host consumers | `spec/id/presentation/26-metadata.md`; `renderer-svg/README.md` | Inspection-safe selected metadata; promotion to cross-consumer contract is separate | `✔️ implemented` / `verified-local` | metadata fixtures/tests and explicit promotion review | in scope with boundary |
| `SVG-META-002` | renderer-owned | `relgeo/renderer-svg` + core | `spec/id/presentation/26-metadata.md`; resolved-scene contract | Metadata is downstream and non-authoritative; invariant snapshot remains useful follow-up | `✔️ implemented` / `partial-local` | metadata/geometry non-mutation evidence | in scope |
| `SVG-DIM-001` | shared | renderer + core | `spec/id/presentation/22-dimension.md`; `src/primitives.ts`; presentation fixture | Linear/radius/diameter/angular projection; resolver owns measurement meaning | `✔️ implemented` / `verified-local` | kind/placement tests, multiline labels, hostile-input fixture, conformance, semantic projection | renderer boundary closed; retain host metric boundary |
| `SVG-ANNOT-001` | shared | renderer + Playground | `spec/id/presentation/23-annotation.md`; `src/primitives.ts`; fixtures 02/06 | Target/leader/place/multiline/fallback projection; DOM and exact metrics remain consumer evidence | `✔️ implemented` / `verified-local` | annotation tests, target fallback, semantic checks, hostile-input fixture, browser smoke separately | renderer boundary closed; retain browser boundary |
| `SVG-SHEET-001` | shared | renderer + core/CLI | `spec/id/presentation/25-views-sheets.md`; `renderSheet`; fixtures 02/03/09 | Page/placement/title block/size and selected-sheet projection; browser/print visual parity stays host-owned | `✔️ implemented` / `verified-local` | fixtures 02/03/09, renderer placement/scale/title-block tests, CLI, conformance, geometry non-mutation | in scope with host evidence boundary |
| `SVG-SHEET-002` | shared | renderer + core/CLI | `spec/id/presentation/25-views-sheets.md` §25.5; `spec/id/core/06-error-model.md` | Explicit missing-sheet/view errors; no fallback or silent skip | `✔️ implemented` / `verified-local` | renderer and CLI negative tests | in scope; retain regression |
| `SVG-DET-001` | shared | renderer + core/parity | `spec/id/core/05-semantic-guarantees.md` §5.7; `src/semantic.ts`; manifest semanticSerialization | Schema/version, bbox, order, IDs, kinds, topology, endpoints, transforms, finite numbers; raw SVG bytes and typography excluded | `✔️ implemented` / `verified-local` | typed semantic replay comparator, projection tests, separate-process canonical fixture replay, conformance | in scope; Node >=24/cross-host evidence remains separate |
| `SVG-ERR-001` | shared | renderer + core/CLI | `spec/id/core/06-error-model.md`; `fixtures/manifest.json`; renderer README | Typed invalid-option/shape/target/diagnostic behavior without repair | `✔️ implemented` / `verified-local` | renderer/CLI negative tests and fixtures 11–14/17–20 | in scope; retain regression |
| `SVG-SEC-001` | shared | renderer + Playground | plan 07 §7; `src/escape.ts`; fixture sheet-xml-escaping | Every dynamic XML/text/style/metadata value remains non-executable; DOM proof is separate | `✔️ implemented` / `verified-local` | security tests and conformance; supported-host DOM smoke separately | in scope; retain security regression |
| `SVG-EXPORT-001` | renderer-owned | `relgeo/renderer-svg` | `renderer-svg/README.md`; `cli/README.md`; Decision 07 §5 | Self-contained SVG string for stdout/file/docs/embed; registry/public artifact is not implementation prerequisite | `✔️ implemented` / `partial-local` | package build and local pack boundary | in scope |
| `SVG-INTEG-001` | consumer | renderer + CLI | `cli/README.md`; `docs/REPOSITORY-MAP.md`; renderer README | CLI compile-to-SVG and selected-sheet routing; CLI owns parsing/file I/O | `✔️ implemented` / `verified-local` | CLI suite and conformance | in scope with consumer boundary |
| `SVG-INTEG-002` | evidence-only | Playground + renderer consumer owners | `playground/src/worker.ts`; `Preview.tsx`; plan 05; fixtures 10/14 | Worker→renderer→safe DOM preview and selection/overlay wiring are implemented; browser/E2E proof still needs a host permitting preview-server bind | `✔️ implemented` / `partial-local; browser not-verified` | Playground tests/build plus supported-host browser E2E; `EPERM` is not target failure | in scope; browser evidence-only remainder |
| `SVG-INTEG-003` | consumer | workspace + renderer | `fixtures/manifest.json`; conformance runner; plan 07 | Shared active/legacy/invalid/diagnostic/error fixture participation | `✔️ implemented` / `verified-local` | conformance result and fixture provenance review | in scope with governance boundary |
| `SVG-INTEG-004` | shared | renderer + parity owners | plan 07 §7; Decisions 07/08; `src/semantic.ts`/`types.ts` | Public semantic projection anchors; comparator execution is separate evidence | `✔️ implemented` / `verified-local` | semantic projection tests and consumer comparator when available | in scope with parity boundary |
| `GAP-009` | shared | renderer + core; language-spec owner | `spec/id/presentation/22-dimension.md`, `23-annotation.md`, `26-metadata.md`; language-spec gap row | Escaped dimension/annotation presentation with unchanged semantic placement; renderer boundary is closed | `✔️ implemented at renderer boundary` / `verified-local` | presentation fixture, renderer/security/CLI tests, semantic invariants; Markdown/host review remains separate | shared mapping retained; consumer evidence remains separate |
| `GAP-013` | shared | renderer; Markdown/Playground consumers | presentation fixture; `security.test.ts`; language-spec gap row | Safe semantic SVG serialization for all dynamic values; renderer boundary is closed | `✔️ implemented at renderer boundary` / `verified-local` | security/conformance no-executable-markup checks; consumer/browser/public evidence remains separate | shared mapping retained; host evidence remains separate |
| `MD-DIAG-003` | consumer | `remark-relgeo` + core | runtime-diagnostic fixture 14; Markdown AST contract to be added | Tolerant Markdown diagnostic transport is outside renderer implementation; renderer preview remains an input | `❌ absent` at Markdown boundary | Markdown AST fixture, strict/tolerant tests, structured warning/location assertion | related consumer row; excluded from renderer-owned closure but retained |

Boundary findings that are deliberately not expected renderer IDs:

| Boundary | Class | Status | Owner / source of truth | Decision |
| --- | --- | --- | --- | --- |
| Parsing, validation, dependency resolution, geometry solving | `➖` | not applicable | core/spec | Explicitly outside renderer ownership; keep as a boundary, never as a removed capability. |
| Broad boolean union/xor, non-rectangle operands, topology expansion | `⏸️` | deferred | workspace + core/geometry/Flutter; Decision 08 | Requires promotion decision and fixtures before entering the active renderer boundary. |
| Node `>=24`, browser E2E, registry/public artifact, CI/canonical, Flutter/native checks | `evidence-only` | `? not-verified` | workspace + consumer owners; compatibility matrix | Evidence follow-up only; not an implementation failure and not a reason to remove a row. |

The register is the source for boundary classification. The expected catalog
remains the source for the expected set; the implementation audit remains the
source for observed implementation/evidence findings; the status matrix is the
compact status projection; and the backlog is the action projection. Any
future change must update all five views and preserve the ID join.

### Shared presentation and serialization mappings

`GAP-009` is satisfied at the renderer boundary only when the dimension and
annotation rows above preserve both semantic placement and escaped dynamic
presentation values. `GAP-013` is satisfied at the renderer boundary only when
the safe serialization assertions cover every dynamic text/style/metadata path
that enters SVG. These mappings do not promote the language-specification rows
or close Playground/browser/public evidence by documentation alone.

The lock intentionally preserves the existing public surface: `RenderOptions`,
`SVGRenderErrorCode`, and `SVGSemanticProjection` remain unchanged. Any future
field, error-code, or tolerance change must update the referenced `spec/id/`
source, compatibility review, fixture expectation, and the corresponding
renderer tests before implementation is considered valid.

## 1. Tujuan dan aturan join

Dokumen ini melakukan join berdasarkan **ID capability**. Nama capability,
urutan tabel, atau keberadaan source file tidak dapat menggantikan ID. Setiap
row pada katalog expected dipertahankan, termasuk capability yang belum ada di
implementasi.

Tiga dimensi berikut sengaja dipisahkan:

1. **Status implementasi** — hasil observasi terhadap source, consumer, dan
   runtime boundary.
2. **Status evidence** — seberapa jauh hasil tersebut dapat dijalankan atau
   direproduksi pada environment yang tersedia.
3. **Keputusan scope** — apakah capability aktif di scope renderer, dibatasi
   oleh boundary consumer, atau ditahan oleh keputusan produk.

### Legend hasil rekonsiliasi

| Result | Arti |
| --- | --- |
| `✔️ implemented` | Implementasi ditemukan pada boundary yang diharapkan. |
| `🌗 partial` | Implementasi atau coverage hanya mencakup sebagian contract, consumer, operation, atau evidence. |
| `⚠️ broken` | Defect atau contract mismatch terkonfirmasi pada boundary yang dinilai. |
| `❌ absent` | Capability expected pada boundary tersebut, tetapi audit tidak menemukan implementation/consumer behavior. Row wajib tetap ada. |
| `⏸️ deferred` | Expansion capability ditahan oleh keputusan scope/dependency. |
| `➖ not-applicable` | Boundary bukan tanggung jawab package yang dinilai; bukan sinonim absent. |
`➖` tidak digunakan untuk menghapus atau mengaburkan expected row. Pada join
ini, `SVG-INTEG-004` tetap muncul sebagai expected row dan kini memiliki API
semantic projection renderer-owned. Status `not verified` pada
browser, Node 24, registry, dan platform boundary tetap dicatat sebagai
evidence limitation, bukan diubah menjadi result symbol atau absence. `?` hanya
digunakan pada boundary/evidence notes, bukan sebagai hasil expected-row.

## 2. Coverage dan count

| Check | Result |
| --- | --- |
| Expected catalog rows | 33 |
| Reconciliation rows | 33 |
| Missing expected IDs | 0 |
| Duplicate reconciliation IDs | 0 |
| Extra observed-only IDs | 0 |
| `✔️ implemented` | 33 |
| `🌗 partial` | 0 |
| `⚠️ broken` | 0 |
| `❌ absent` | 0 |
| `⏸️ deferred` / `➖ not-applicable` as expected-row result | 0 |

The audit also records boundary findings outside the expected-ID join:
renderer-owned parsing/validation/resolve is `➖ not-applicable`, broader
boolean expansion is `⏸️ deferred`, and browser/Node 24/registry/public/native
verification is `? unverified`. These findings do not replace any expected row.

## 3. One-to-one reconciliation register

The audit trace below points to the current audit join section. The matching ID
in that audit row is the authoritative observed finding for the corresponding
expected row.

| ID | Expected capability | Result | Status implementasi | Status evidence | Observed implementation finding | Scope decision | Audit trace |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `SVG-API-001` | Public resolved-scene renderer API returns SVG markup. | `✔️ implemented` | `implemented` | `verified-local` | Public `SVGRenderer.render`/`renderToSVG` accepts scene/options; source, tests, and dist boundary cover it. | `in scope` | [audit ID row](./implementation-audit.md#expected-catalog-id-join--current-audit) |
| `SVG-API-002` | Node-safe renderer that can also supply browser-embeddable SVG. | `✔️ implemented` | `implemented` | `partial-local` | No DOM dependency; Node build works; fresh browser runtime is unverified. | `in scope` | [audit ID row](./implementation-audit.md#expected-catalog-id-join--current-audit) |
| `SVG-SCENE-001` | Valid SVG root and deterministic empty-scene result. | `✔️ implemented` | `implemented` | `partial-local` | Valid empty-scene fallback exists; no dedicated empty-scene snapshot. | `in scope` | [audit ID row](./implementation-audit.md#expected-catalog-id-join--current-audit) |
| `SVG-SCENE-002` | Viewport/viewBox derived from scene bounds, padding, origin, and orientation. | `✔️ implemented` | `implemented` | `verified-local` | Bbox, padding, origin, orientation, and viewBox logic are present and tested. | `in scope` | [audit ID row](./implementation-audit.md#expected-catalog-id-join--current-audit) |
| `SVG-SCENE-003` | Width/height and physical/export dimensions preserve semantic geometry. | `✔️ implemented` | `implemented` | `verified-local` | Default/physical sizing, viewBox, preserveAspectRatio, and scene immutability are covered; browser print/layout remains host evidence. | `boundary only` | [audit ID row](./implementation-audit.md#expected-catalog-id-join--current-audit) |
| `SVG-PRIM-001` | Point and line projection preserves coordinates and endpoints. | `✔️ implemented` | `implemented` | `verified-local` | Point and line emitters preserve resolved coordinates/endpoints in fixtures and tests. | `in scope` | [audit ID row](./implementation-audit.md#expected-catalog-id-join--current-audit) |
| `SVG-PRIM-002` | Rect, circle, and ellipse projection preserves resolved dimensions. | `✔️ implemented` | `implemented` | `verified-local` | Rect, circle, and ellipse emitters are covered by source tests and fixtures. | `in scope` | [audit ID row](./implementation-audit.md#expected-catalog-id-join--current-audit) |
| `SVG-PRIM-003` | Arc, quadratic, and cubic projection preserves curve geometry. | `✔️ implemented` | `implemented` | `verified-local` | Arc, quadratic, and cubic path commands are emitted and locally tested. | `in scope` | [audit ID row](./implementation-audit.md#expected-catalog-id-join--current-audit) |
| `SVG-PRIM-004` | Polygon and text projection preserves identity and placement. | `✔️ implemented` | `implemented` | `verified-local` | Polygon and multiline text output are covered by renderer tests and fixture 10. | `in scope` | [audit ID row](./implementation-audit.md#expected-catalog-id-join--current-audit) |
| `SVG-PATH-001` | Open/closed paths, islands, holes, and even-odd fill semantics. | `✔️ implemented` | `implemented` | `verified-local` | Open/closed paths, holes, islands, and even-odd projection are covered. | `in scope` | [audit ID row](./implementation-audit.md#expected-catalog-id-join--current-audit) |
| `SVG-BOOLEAN-001` | Approved line-line and rectangle intersect/subtract SVG boundary. | `✔️ implemented` | `implemented` | `verified-local` | Approved fixture 15 boundary passes conformance; broader booleans remain out of scope. | `boundary only` | [audit ID row](./implementation-audit.md#expected-catalog-id-join--current-audit) |
| `SVG-BOOLEAN-002` | Explicit empty/multipart boolean failure semantics survive rendering. | `✔️ implemented` | `implemented` | `verified-local` | Fixtures 19/20 and CLI preserve empty/multipart upstream error codes. | `boundary only` | [audit ID row](./implementation-audit.md#expected-catalog-id-join--current-audit) |
| `SVG-COMP-001` | Recursive group, clone, component, and nested composition rendering. | `✔️ implemented` | `implemented` | `verified-local` | Recursive composition renders with IDs and metadata. | `in scope` | [audit ID row](./implementation-audit.md#expected-catalog-id-join--current-audit) |
| `SVG-COMP-002` | Collection wrappers and children render in stable order with IDs. | `✔️ implemented` | `implemented` | `partial-local` | Collection wrappers/children render in declared order; broad semantic promotion is inactive. | `boundary only` | [audit ID row](./implementation-audit.md#expected-catalog-id-join--current-audit) |
| `SVG-TRANS-001` | Resolved translate, rotate, scale, mirror, and transform chains. | `✔️ implemented` | `implemented` | `verified-local` | Transform serialization and chains are emitted and tested. | `in scope` | [audit ID row](./implementation-audit.md#expected-catalog-id-join--current-audit) |
| `SVG-LAYER-001` | Role/visibility filtering and final-output role defaults. | `✔️ implemented` | `implemented` | `partial-local` | Role filtering/defaults are wired; cross-consumer palette parity is unverified. | `in scope` | [audit ID row](./implementation-audit.md#expected-catalog-id-join--current-audit) |
| `SVG-LAYER-002` | Inspection hooks for IDs, labels, anchors, bounds, and topology context. | `✔️ implemented` | `implemented` | `partial-local` | Anchors, labels, bbox, and overlays exist; combinations lack full fixture coverage. | `boundary only` | [audit ID row](./implementation-audit.md#expected-catalog-id-join--current-audit) |
| `SVG-STYLE-001` | Safe projection of stroke, fill, width, opacity, dash, and role defaults. | `✔️ implemented` | `implemented` | `partial-local` | Presentation attributes/defaults exist; visual details remain best-effort. | `in scope` | [audit ID row](./implementation-audit.md#expected-catalog-id-join--current-audit) |
| `SVG-STYLE-002` | Text, font, arrow, multiline, and annotation presentation fallback. | `✔️ implemented` | `implemented` | `verified-local` | Finite fallback, multiline order, and safe serialization are covered; exact metrics and cross-runtime typography remain surface-specific. | `boundary only` | [audit ID row](./implementation-audit.md#expected-catalog-id-join--current-audit) |
| `SVG-META-001` | Inspection-safe projection of selected resolved metadata. | `✔️ implemented` | `implemented` | `verified-local` | Role/intent/preset/label map to data attributes; promotion remains boundary-only. | `boundary only` | [audit ID row](./implementation-audit.md#expected-catalog-id-join--current-audit) |
| `SVG-META-002` | Metadata remains non-authoritative for geometry and identity. | `✔️ implemented` | `implemented` | `partial-local` | Metadata is downstream by design; no dedicated mutation/snapshot invariant test. | `in scope` | [audit ID row](./implementation-audit.md#expected-catalog-id-join--current-audit) |
| `SVG-DIM-001` | Linear, radius, diameter, and angular dimension projection. | `✔️ implemented` | `implemented` | `verified-local` | Supported kinds, multiline labels, fallback placement, semantic projection, and hostile presentation escaping are covered; exact font metrics remain renderer-local. | `in scope` | [audit ID row](./implementation-audit.md#expected-catalog-id-join--current-audit) |
| `SVG-ANNOT-001` | Target, leader, placement, multiline, and fallback annotation projection. | `✔️ implemented` | `implemented` | `verified-local` | Target fallback, leader/place projection, multiline order, semantic invariants, and hostile presentation escaping are covered; browser DOM evidence remains separate. | `in scope` | [audit ID row](./implementation-audit.md#expected-catalog-id-join--current-audit) |
| `SVG-SHEET-001` | Page border, view placement/scale, title block, and sheet sizing. | `✔️ implemented` | `implemented` | `verified-local` | Fixtures 02/03/09, renderer regressions, CLI, conformance, and non-mutating scene checks cover the selected-sheet renderer boundary; host visual parity remains separate. | `boundary only` | [audit ID row](./implementation-audit.md#expected-catalog-id-join--current-audit) |
| `SVG-SHEET-002` | Missing/unknown sheet and view selection fails explicitly. | `✔️ implemented` | `implemented` | `verified-local` | Typed missing-sheet/view failures replace model fallback and silent view skips; renderer and CLI regressions pass. | `in scope` | [audit ID row](./implementation-audit.md#expected-catalog-id-join--current-audit) |
| `SVG-DET-001` | Stable ordering, IDs, geometry serialization, and semantic projection. | `✔️ implemented` | `implemented` | `verified-local` | Typed replay comparator covers schema/version, bbox, identity/order/kind, topology, endpoints, transforms, and normalized numbers; separate-process canonical fixture replay passes. Raw SVG byte equality is not used. | `in scope` | [audit ID row](./implementation-audit.md#expected-catalog-id-join--current-audit) |
| `SVG-ERR-001` | Explicit deterministic handling of invalid options, missing views, and unsupported shapes. | `✔️ implemented` | `implemented` | `verified-local` | Typed renderer errors cover invalid padding, unsupported shapes, missing composition targets, missing sheets/views, and upstream diagnostics. | `in scope` | [audit ID row](./implementation-audit.md#expected-catalog-id-join--current-audit) |
| `SVG-SEC-001` | XML/text/attribute escaping prevents executable SVG markup. | `✔️ implemented` | `implemented` | `verified-local` | Current renderer worktree escapes dynamic dimension/annotation font/fill and hostile text/metadata values; browser E2E remains unverified. | `in scope` | [audit ID row](./implementation-audit.md#expected-catalog-id-join--current-audit) |
| `SVG-EXPORT-001` | SVG string export for stdout, files, docs, and lightweight web embedding. | `✔️ implemented` | `implemented` | `partial-local` | SVG string/build/tarball work locally; registry/public artifact is unverified. | `in scope` | [audit ID row](./implementation-audit.md#expected-catalog-id-join--current-audit) |
| `SVG-INTEG-001` | CLI compile-to-SVG and selected-sheet renderer boundary. | `✔️ implemented` | `implemented` | `verified-local` | CLI formats/options/sheet flow are tested and covered by conformance. | `boundary only` | [audit ID row](./implementation-audit.md#expected-catalog-id-join--current-audit) |
| `SVG-INTEG-002` | Playground worker → renderer → browser DOM preview and inspection hooks. | `✔️ implemented` | `implemented` | `partial-local; browser not-verified` | Worker/DOM/sheet/overlay wiring is covered by 107 Playground tests and build; Playwright could not start the preview server because binding `127.0.0.1:4173` returned `EPERM`. | `boundary only` | [audit ID row](./implementation-audit.md#expected-catalog-id-join--current-audit) |
| `SVG-INTEG-003` | Shared fixture/conformance participation across active, legacy, invalid, diagnostic, and capability cases. | `✔️ implemented` | `implemented` | `verified-local` | Root conformance covers 298 checks across all declared statuses and 23 fixtures. | `in scope` | [audit ID row](./implementation-audit.md#expected-catalog-id-join--current-audit) |
| `SVG-INTEG-004` | Renderer-owned semantic projection anchors for parity comparators. | `✔️ implemented` | `implemented` | `verified-local` | Public typed projection exposes schema/version, order/identity/kind, endpoints, segments, rings/holes, normalized geometry, transforms, and tolerance; cross-consumer comparator execution remains separate. | `boundary only` | [audit ID row](./implementation-audit.md#expected-catalog-id-join--current-audit) |

## 4. Findings and downstream handoff

The 2026-11-05 scene/sheet, presentation-safety, semantic-replay, and consumer
closure refreshes are recorded in the
[backlog triage register](./implementation-gap-backlog.md#p0p1-implementation-closability-triage)
and summarized in the [status-matrix handoff](./status-matrix.md#p0p1-triage-handoff).
All 33 expected renderer IDs and shared renderer mappings are now closed at
the observed implementation boundary. `SVG-INTEG-002` retains a browser
evidence qualifier only. `SVG-DET-001`,
`SVG-SCENE-003`, `SVG-SHEET-001`, `SVG-STYLE-002`,
`SVG-DIM-001`, and `SVG-ANNOT-001`
are now locally closed at the renderer boundary; browser/print/Node-24 host
evidence remains separate and does not reopen the implementation status.
local fixed rows remain regression handoffs. This closure does not claim Node
>=24, public, browser-host, Flutter, or native parity evidence.

Confirmed implementation gaps remain explicit in the join:

- `SVG-INTEG-004` is now `✔️ implemented` at the renderer boundary: the public
  typed semantic projection API is covered by focused local tests; consumer
  comparator execution remains separate evidence.
- `SVG-SHEET-002` is now `✔️ implemented`: unknown sheets and missing views
  produce typed errors instead of model fallback or silent skips.
- `SVG-SEC-001` is now `✔️ implemented` in the current renderer worktree:
  dimension/annotation `fontFamily` and `fill` interpolation is escaped and
  hostile-value tests/conformance pass. Playground still inserts SVG through
  `dangerouslySetInnerHTML`, so browser E2E remains unverified.

The current local evidence is 102/102 renderer tests, 298/298 conformance checks,
and 107/107 Playground unit tests plus production build. Browser
E2E is explicitly `not-verified` because the permitted Playwright run could not
bind `127.0.0.1:4173` (`EPERM`). There are no remaining `🌗`, `❌`, or `⚠️`
rows in the expected renderer join. Browser E2E, Node >=24, registry/public
artifact, and native/platform checks remain `? unverified` where noted by the
audit; these evidence qualifiers do not reopen an implemented capability.

Primary evidence:

- [Expected capability catalog](./expected-capability-catalog.md)
- [Implementation audit](./implementation-audit.md)
- [Renderer-SVG capability matrix](./capability-matrix.md)
- [Maturation master plan](../../MATURATION-MASTER-PLAN.md)
- [Compatibility matrix](../../compatibility-matrix.json)
- [Flutter capability promotion and SVG parity](../../plans/07-flutter-capability-promotion-and-svg-parity.md)
- [Fixture manifest](../../../fixtures/manifest.json)
