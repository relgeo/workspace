# Renderer-SVG Expected-versus-Observed Reconciliation

**Tanggal:** 2026-10-30

**Expected source:** [Renderer-SVG expected capability catalog](./expected-capability-catalog.md)

**Observed source:** [Renderer-SVG implementation audit](./implementation-audit.md)

**Compatibility line:** RelGeo DSL `0.5.x`
**Status:** join selesai; setiap expected ID memiliki tepat satu hasil rekonsiliasi

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
| `SVG-DIM-001` | Linear, radius, diameter, and angular dimension projection. | `🌗 partial` | `partial` | `verified-local` | Dimension kinds render and hostile presentation values are escaped; typography and exhaustive semantic placement coverage remain partial. | `in scope` | [audit ID row](./implementation-audit.md#expected-catalog-id-join--current-audit) |
| `SVG-ANNOT-001` | Target, leader, placement, multiline, and fallback annotation projection. | `🌗 partial` | `partial` | `verified-local` | Annotation projection and hostile presentation escaping are tested; exact text metrics and broader consumer evidence remain partial. | `in scope` | [audit ID row](./implementation-audit.md#expected-catalog-id-join--current-audit) |
| `SVG-SHEET-001` | Page border, view placement/scale, title block, and sheet sizing. | `🌗 partial` | `partial` | `partial-local` | Sheet layout works, but most direct evidence is legacy 0.4. | `boundary only` | [audit ID row](./implementation-audit.md#expected-catalog-id-join--current-audit) |
| `SVG-SHEET-002` | Missing/unknown sheet and view selection fails explicitly. | `✔️ implemented` | `implemented` | `verified-local` | Typed missing-sheet/view failures replace model fallback and silent view skips; renderer and CLI regressions pass. | `in scope` | [audit ID row](./implementation-audit.md#expected-catalog-id-join--current-audit) |
| `SVG-DET-001` | Stable ordering, IDs, geometry serialization, and semantic projection. | `🌗 partial` | `partial` | `partial-local` | Snapshots/repeated render are stable; no complete cross-host determinism suite. | `in scope` | [audit ID row](./implementation-audit.md#expected-catalog-id-join--current-audit) |
| `SVG-ERR-001` | Explicit deterministic handling of invalid options, missing views, and unsupported shapes. | `✔️ implemented` | `implemented` | `verified-local` | Typed renderer errors cover invalid padding, unsupported shapes, missing composition targets, missing sheets/views, and upstream diagnostics. | `in scope` | [audit ID row](./implementation-audit.md#expected-catalog-id-join--current-audit) |
| `SVG-SEC-001` | XML/text/attribute escaping prevents executable SVG markup. | `✔️ implemented` | `implemented` | `verified-local` | Current renderer worktree escapes dynamic dimension/annotation font/fill and hostile text/metadata values; browser E2E remains unverified. | `in scope` | [audit ID row](./implementation-audit.md#expected-catalog-id-join--current-audit) |
| `SVG-EXPORT-001` | SVG string export for stdout, files, docs, and lightweight web embedding. | `✔️ implemented` | `implemented` | `partial-local` | SVG string/build/tarball work locally; registry/public artifact is unverified. | `in scope` | [audit ID row](./implementation-audit.md#expected-catalog-id-join--current-audit) |
| `SVG-INTEG-001` | CLI compile-to-SVG and selected-sheet renderer boundary. | `✔️ implemented` | `implemented` | `verified-local` | CLI formats/options/sheet flow are tested and covered by conformance. | `boundary only` | [audit ID row](./implementation-audit.md#expected-catalog-id-join--current-audit) |
| `SVG-INTEG-002` | Playground worker → renderer → browser DOM preview and inspection hooks. | `🌗 partial` | `partial` | `partial-local` | Worker/DOM/sheet/overlay wiring exists; browser E2E/public runtime unverified. | `boundary only` | [audit ID row](./implementation-audit.md#expected-catalog-id-join--current-audit) |
| `SVG-INTEG-003` | Shared fixture/conformance participation across active, legacy, invalid, diagnostic, and capability cases. | `✔️ implemented` | `implemented` | `verified-local` | Root conformance covers all declared statuses across 20 fixtures. | `in scope` | [audit ID row](./implementation-audit.md#expected-catalog-id-join--current-audit) |
| `SVG-INTEG-004` | Renderer-owned semantic projection anchors for parity comparators. | `✔️ implemented` | `implemented` | `verified-local` | Public typed projection exposes schema/version, order/identity/kind, endpoints, segments, rings/holes, normalized geometry, transforms, and tolerance; cross-consumer comparator execution remains separate. | `boundary only` | [audit ID row](./implementation-audit.md#expected-catalog-id-join--current-audit) |

## 4. Findings and downstream handoff

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

The remaining `🌗` rows are partial implementation or evidence/consumer
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
