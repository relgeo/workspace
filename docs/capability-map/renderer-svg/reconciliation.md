# Renderer-SVG Expected-versus-Observed Reconciliation

**Tanggal:** 2026-11-03

**Expected source:** [Renderer-SVG expected capability catalog](./expected-capability-catalog.md)

**Observed source:** [Renderer-SVG implementation audit](./implementation-audit.md)

**Status view:** [Renderer-SVG status matrix](./status-matrix.md)

**Compatibility line:** RelGeo DSL `0.5.x`
**Status:** join selesai; setiap expected ID memiliki tepat satu hasil rekonsiliasi

## 0. Contract and acceptance lock

**Lock date:** 2026-11-04. This section freezes the implementation boundary
for the six renderer-local P0/P1 rows selected by the triage. It is an
acceptance contract, not an implementation claim and not a public API change.
The shared `GAP-009` and `GAP-013` rows consume the same presentation and safe
serialization rules below; `SVG-INTEG-002` remains browser/consumer evidence
only.

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
| `SVG-SCENE-003` | `relgeo/renderer-svg` with CLI/Playground context owners; `spec/id/presentation/25-views-sheets.md`, catalog §2.2, `renderer-svg/src/types.ts` and `index.ts` | Default and physical render contexts emit valid root `width`/`height`, `viewBox`, and `preserveAspectRatio`; changing context never changes semantic object identity, order, or geometry. | Invalid numeric render options fail with `SVGRenderError(INVALID_RENDER_OPTIONS)`; empty/zero-size scene fallback stays valid and deterministic; non-px physical conversion is explicit and does not mutate `ResolvedScene`. Browser print/layout remains host-owned. | Focused renderer sizing/origin/physical tests, active v0.5 fixture 10, semantic projection comparison, and shared conformance. |
| `SVG-STYLE-002` | `relgeo/renderer-svg`; `spec/id/presentation/22-dimension.md`, `23-annotation.md`, Decision 08 §11, `renderer-svg/src/escape.ts` and `utils.ts` | Text, arrows, multiline labels, fallback font/size/baseline, and dynamic style attributes serialize deterministically at the renderer boundary. | Omitted presentation values use bounded fallback; hostile text/font/fill/metadata remain escaped content or attribute values and cannot create `<script>`, `foreignObject`, or `on*` attributes. Exact font metrics/wrapping are not cross-runtime contract. | `security.test.ts`, presentation-escaping fixture, renderer suite, no-executable-markup assertions, and semantic projection invariants. |
| `SVG-DIM-001` | `relgeo/renderer-svg` + core dimension owner; `spec/id/presentation/22-dimension.md`, `renderer-svg/src/primitives.ts`, fixture `v05-presentation-escaping` | Linear, radius, diameter, and angular dimensions preserve resolved kind, target references, endpoints/values, extension/leader placement, label order, and default `dimension` role without changing model geometry. | Missing optional placement uses stable renderer fallback; hostile label/font/fill values are escaped; style or wording changes cannot alter semantic measurement. Resolver meaning and measurement are never recomputed by renderer. | Dimension-kind renderer tests, semantic projection assertions, hostile-input fixture, conformance, and local CLI/Markdown snapshots where available. |
| `SVG-ANNOT-001` | `relgeo/renderer-svg` + Playground consumer; `spec/id/presentation/23-annotation.md`, `renderer-svg/src/primitives.ts`, fixtures 02/06 and presentation-escaping fixture | Target-only, placed, leader, and multiline annotations preserve target/leader endpoints, placement, line order, and annotation-layer semantics while leaving geometry unchanged. | Missing placement gets stable target-based fallback; hostile text/font/fill values remain escaped and cannot add executable SVG nodes/attributes. DOM mounting and exact metrics remain consumer/runtime boundaries. | Annotation renderer tests, semantic projection checks, fixtures 02/06 and hostile-input fixture, no-executable-markup assertions; browser smoke is separate. |
| `SVG-SHEET-001` | `relgeo/renderer-svg` + core/CLI; `spec/id/presentation/25-views-sheets.md`, renderer `renderSheet`, fixtures 02/03/09 | An active v0.5 sheet emits page background/border, selected view placement and scale, title block, standard/custom dimensions, and stable SVG sizing without mutating resolved model geometry. | Unknown `sheetId` fails with `MISSING_SHEET`; a sheet placement referencing a missing view fails with `MISSING_VIEW`; invalid sheet structure remains an upstream core diagnostic. No silent skip or model fallback is allowed. | Active v0.5 sheet fixture plus renderer and CLI selected-sheet/negative tests; legacy fixtures remain historical evidence until promoted. |
| `SVG-DET-001` | `relgeo/renderer-svg` + core/parity; `spec/id/core/05-semantic-guarantees.md` §5.7, `spec/id/geometry/19-collections.md`, `renderer-svg/src/semantic.ts`, fixture manifest `semanticSerialization` | Public projection uses schema `relgeo.svg-semantic`, schema version `1`, compatibility line `0.5`, tolerance `1e-6`, stable object order/IDs/kinds/topology/endpoints, and normalized finite numbers. Repeated local replay yields equal semantic output. | Non-finite semantic numbers fail canonical serialization; array semantic order is preserved; raw SVG byte/whitespace/attribute-order/font equality is explicitly not acceptance criteria. Node >=24, Flutter, and cross-host runs remain separate evidence. | `semantic_projection.test.ts`, active fixture 10 JSON/projection replay, conformance, and a repeated-process comparator over the locked fields. |

## 0.1 Consumer and artifact boundary verification — 2026-11-04

The current worktree was checked across the downstream boundaries named by the
integration gate. Results below are local evidence only; historical CI/public
records are not reused as current-pointer evidence.

| Boundary | Command / artifact | Result | Evidence classification and limit |
| --- | --- | --- | --- |
| Renderer package | `npm pack --dry-run --json` in `renderer-svg/` | PASS — `@relgeo/renderer-svg@0.5.0`, 9 files | Local pack boundary; registry install/public release not verified |
| CLI consumer | `pnpm --filter @relgeo/cli test` | PASS — 36 tests | Local downstream consumer evidence |
| Markdown consumers | `pnpm --filter @relgeo/remark-relgeo test`; `pnpm --filter @relgeo/remark-relgeo-hl test` | PASS — 9 and 6 tests | Local preview/highlighting evidence |
| Playground consumer | `pnpm --filter relgeo-playground test`; `pnpm --filter relgeo-playground build` | PASS — 104 tests and production build | Local worker/build evidence; browser E2E remains unavailable because preview-server bind returned `EPERM` |
| Shared fixture boundary | `pnpm run conformance:fixtures` | PASS — 298 checks across 23 fixtures | Local fixture, serialization/provenance, CLI, Markdown, and preview evidence |
| Website artifact | `pnpm run check`, `pnpm run build`, `pnpm run test` in `relgeo.github.io/` | PASS — 0 Astro diagnostics; 138 pages built; built-output assertions passed | Local docs artifact; deployed/public smoke not verified |
| Cross-repo integration runner | `pnpm run integration:gate -- --local` | ENVIRONMENT UNAVAILABLE — exit 2 before stages because host Node is 22.23.2 and runner requires Node >=24 | Does not establish consumer parity failure; canonical CI evidence remains tied to its recorded revision |

The renderer, CLI, Playground, Markdown, fixture, and website checks do not
show a downstream consumer regression in the selected local scope. Public
registry, fresh isolated install, canonical CI, browser, and native/Flutter
boundaries remain separate evidence classes.

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
| `✔️ implemented` | 26 |
| `🌗 partial` | 7 |
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
| `SVG-SCENE-003` | Width/height and physical/export dimensions preserve semantic geometry. | `🌗 partial` | `partial` | `partial-local` | Physical mode and sizing exist; print/browser/unit combinations are not exhaustive. | `boundary only` | [audit ID row](./implementation-audit.md#expected-catalog-id-join--current-audit) |
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
| `SVG-STYLE-002` | Text, font, arrow, multiline, and annotation presentation fallback. | `🌗 partial` | `partial` | `verified-local` | Typography/fallbacks are exercised safely; exact metrics and cross-runtime typography remain surface-specific. | `boundary only` | [audit ID row](./implementation-audit.md#expected-catalog-id-join--current-audit) |
| `SVG-META-001` | Inspection-safe projection of selected resolved metadata. | `✔️ implemented` | `implemented` | `verified-local` | Role/intent/preset/label map to data attributes; promotion remains boundary-only. | `boundary only` | [audit ID row](./implementation-audit.md#expected-catalog-id-join--current-audit) |
| `SVG-META-002` | Metadata remains non-authoritative for geometry and identity. | `✔️ implemented` | `implemented` | `partial-local` | Metadata is downstream by design; no dedicated mutation/snapshot invariant test. | `in scope` | [audit ID row](./implementation-audit.md#expected-catalog-id-join--current-audit) |
| `SVG-DIM-001` | Linear, radius, diameter, and angular dimension projection. | `🌗 partial` | `partial` | `verified-local` | Dimension kinds, endpoints/measurements, semantic placement, and hostile presentation escaping are covered by the 95-test renderer suite; typography and exhaustive consumer placement remain partial. | `in scope` | [audit ID row](./implementation-audit.md#expected-catalog-id-join--current-audit) |
| `SVG-ANNOT-001` | Target, leader, placement, multiline, and fallback annotation projection. | `🌗 partial` | `partial` | `verified-local` | Annotation target/leader/placement projection and hostile presentation escaping are covered by semantic/output tests; exact metrics and broader consumer evidence remain partial. | `in scope` | [audit ID row](./implementation-audit.md#expected-catalog-id-join--current-audit) |
| `SVG-SHEET-001` | Page border, view placement/scale, title block, and sheet sizing. | `🌗 partial` | `partial` | `partial-local` | Sheet layout works, but most direct evidence is legacy 0.4. | `boundary only` | [audit ID row](./implementation-audit.md#expected-catalog-id-join--current-audit) |
| `SVG-SHEET-002` | Missing/unknown sheet and view selection fails explicitly. | `✔️ implemented` | `implemented` | `verified-local` | Typed missing-sheet/view failures replace model fallback and silent view skips; renderer and CLI regressions pass. | `in scope` | [audit ID row](./implementation-audit.md#expected-catalog-id-join--current-audit) |
| `SVG-DET-001` | Stable ordering, IDs, geometry serialization, and semantic projection. | `🌗 partial` | `partial` | `verified-local` | Renderer semantic projection and replay-comparator tests cover deterministic identity/order/geometry; no complete cross-host determinism suite. | `in scope` | [audit ID row](./implementation-audit.md#expected-catalog-id-join--current-audit) |
| `SVG-ERR-001` | Explicit deterministic handling of invalid options, missing views, and unsupported shapes. | `✔️ implemented` | `implemented` | `verified-local` | Typed renderer errors cover invalid padding, unsupported shapes, missing composition targets, missing sheets/views, and upstream diagnostics. | `in scope` | [audit ID row](./implementation-audit.md#expected-catalog-id-join--current-audit) |
| `SVG-SEC-001` | XML/text/attribute escaping prevents executable SVG markup. | `✔️ implemented` | `implemented` | `verified-local` | Current renderer worktree escapes dynamic dimension/annotation font/fill and hostile text/metadata values; browser E2E remains unverified. | `in scope` | [audit ID row](./implementation-audit.md#expected-catalog-id-join--current-audit) |
| `SVG-EXPORT-001` | SVG string export for stdout, files, docs, and lightweight web embedding. | `✔️ implemented` | `implemented` | `partial-local` | SVG string/build/tarball work locally; registry/public artifact is unverified. | `in scope` | [audit ID row](./implementation-audit.md#expected-catalog-id-join--current-audit) |
| `SVG-INTEG-001` | CLI compile-to-SVG and selected-sheet renderer boundary. | `✔️ implemented` | `implemented` | `verified-local` | CLI formats/options/sheet flow are tested and covered by conformance. | `boundary only` | [audit ID row](./implementation-audit.md#expected-catalog-id-join--current-audit) |
| `SVG-INTEG-002` | Playground worker → renderer → browser DOM preview and inspection hooks. | `🌗 partial` | `partial` | `partial-local; browser not-verified` | Worker/DOM/sheet/overlay wiring is covered by 104 Playground tests and build; Playwright could not start the preview server because binding `127.0.0.1:4173` returned `EPERM`. | `boundary only` | [audit ID row](./implementation-audit.md#expected-catalog-id-join--current-audit) |
| `SVG-INTEG-003` | Shared fixture/conformance participation across active, legacy, invalid, diagnostic, and capability cases. | `✔️ implemented` | `implemented` | `verified-local` | Root conformance covers 298 checks across all declared statuses and 23 fixtures. | `in scope` | [audit ID row](./implementation-audit.md#expected-catalog-id-join--current-audit) |
| `SVG-INTEG-004` | Renderer-owned semantic projection anchors for parity comparators. | `✔️ implemented` | `implemented` | `verified-local` | Public typed projection exposes schema/version, order/identity/kind, endpoints, segments, rings/holes, normalized geometry, transforms, and tolerance; cross-consumer comparator execution remains separate. | `boundary only` | [audit ID row](./implementation-audit.md#expected-catalog-id-join--current-audit) |

## 4. Findings and downstream handoff

The 2026-11-04 P0/P1 implementation-closability decision is recorded in the
[backlog triage register](./implementation-gap-backlog.md#p0p1-implementation-closability-triage)
and summarized in the [status-matrix handoff](./status-matrix.md#p0p1-triage-handoff).
The six open renderer-local rows are `SVG-SCENE-003`, `SVG-STYLE-002`,
`SVG-DIM-001`, `SVG-ANNOT-001`, `SVG-SHEET-001`, and `SVG-DET-001`.
`SVG-INTEG-002` remains browser/consumer evidence only; local fixed rows remain
regression handoffs. This selection does not promote any reconciliation status.

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

The current local evidence is 95/95 renderer tests, 298/298 conformance checks,
and 104/104 Playground unit tests plus production build. Browser
E2E is explicitly `not-verified` because the permitted Playwright run could not
bind `127.0.0.1:4173` (`EPERM`). The remaining `🌗` rows are partial implementation or evidence/consumer
coverage, not absent capability. Browser E2E, Node >=24, registry/public
artifact, and native/platform checks remain `? unverified` where noted by the
audit. They must not be converted to `❌` without a failed implementation
observation.

Primary evidence:

- [Expected capability catalog](./expected-capability-catalog.md)
- [Implementation audit](./implementation-audit.md)
- [Renderer-SVG capability matrix](./capability-matrix.md)
- [Maturation master plan](../../MATURATION-MASTER-PLAN.md)
- [Compatibility matrix](../../compatibility-matrix.json)
- [Flutter capability promotion and SVG parity](../../plans/07-flutter-capability-promotion-and-svg-parity.md)
- [Fixture manifest](../../../fixtures/manifest.json)
