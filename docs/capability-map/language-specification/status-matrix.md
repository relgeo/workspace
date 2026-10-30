# Language Specification Capability Status Matrix

**Tanggal:** 2026-10-30
**Baseline:** RelGeo DSL `0.5`
**Expected catalog:** [`language-specification/expected-capability-catalog.md`](./expected-capability-catalog.md)
**Implementation audit:** [`language-specification/implementation-audit.md`](./implementation-audit.md)
**Reconciliation:** [`language-specification/reconciliation.md`](./reconciliation.md)

Implementation candidates: [gap backlog](./implementation-gap-backlog.md).

## Cara membaca

Matrix ini adalah reporting view capability-first. Ia tidak menggantikan
`spec/id/` sebagai source of truth dan tidak menganggap dokumentasi gap sebagai
implementasi. `Status` berasal dari hasil rekonsiliasi; `Evidence` dan `Scope`
adalah dimensi terpisah.

| Status | Makna |
| --- | --- |
| `✔️` | Implemented pada boundary yang diaudit dengan evidence langsung. |
| `🌗` | Partial: source/runtime ada, tetapi coverage, parity, atau promotion belum lengkap. |
| `❌` | Absent setelah boundary implementation diperiksa. Tidak ada row saat ini. |
| `➖` | Not applicable terhadap scope. Tidak dipakai untuk evidence yang belum diverifikasi. |
| `⏸️` | Sengaja deferred/ditahan oleh keputusan scope atau promotion. Tidak ada whole-capability row saat ini. |
| `⚠️` | Broken/mismatch terkonfirmasi pada boundary yang diaudit. |

Current count: **16 `✔️` · 35 `🌗` · 0 `❌` · 0 `➖` · 0 `⏸️` · 2 `⚠️`**.
Evidence `not verified` tetap ditulis di kolom evidence dan tidak otomatis
menjadi `❌` atau `➖`.

## Evidence and matrix contract

The expected surface is grounded in [`spec/id/`](../../../spec/id), the
[`MATURATION-MASTER-PLAN.md`](../../MATURATION-MASTER-PLAN.md), the
[`REPOSITORY-MAP.md`](../../REPOSITORY-MAP.md), and the capability-map
[`INVENTORY-PROTOCOL.md`](../INVENTORY-PROTOCOL.md). The implementation findings
come from the [implementation audit](./implementation-audit.md)
and the result/evidence separation is preserved in the
[reconciliation](./reconciliation.md).

| Column | Contract |
| --- | --- |
| Status | Exactly one implementation result from the legend above. |
| Evidence | Concrete source, test, fixture, UI/route, configuration, platform, or runtime evidence; `not verified` is explicit when unavailable. |
| Gap / finding | The current divergence, limitation, or confirmed defect for this capability. |
| Owner | The source-of-truth or implementation boundary responsible for the next change. |
| Dependency | A prerequisite capability, consumer, contract, or scope decision. |
| Risk | The user/product consequence if the gap remains. |
| Next action | A concrete follow-up that can be assigned and verified. |

The current evidence is local working-tree evidence. Node-based checks ran on
Node `22.23.2` although the repository requires Node `>=24`; MCP/Dart service
evidence, public/browser evidence, and native-host evidence remain
`not verified` where stated by the audit. This limits the verification claim;
it does not remove an expected capability from the matrix.

## Matrix

| ID | Capability | Status | Evidence | Gap / finding | Owner | Dependency | Risk | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `LANG-001` | Text-first YAML authoring | `✔️` | core parser; conformance 260/260 | Grammar catalog tidak generated | `relgeo/spec` | parser consumers | Drift vocabulary | Pertahankan parser/fixture checks |
| `LANG-002` | Relational/deterministic semantics | `🌗` | spec core; graph/resolver tests | Negative no-solver boundary dan full syntax map belum terpusat | `relgeo/spec` + `core` | graph, validator | False parity claim | Tambah contract/drift fixture |
| `DOC-001` | Root document sections | `✔️` | parser/validator; fixture 10 | Generated section schema absent | `relgeo/spec` | core parser | Section drift | Tambah section contract check |
| `DOC-002` | Scene/unit/viewport configuration | `✔️` | scene/unit tests | Combination coverage terbatas | `relgeo/spec` + `core` | units, renderer | Viewport mismatch | Tambah scene conformance cases |
| `DOC-003` | Editorial vocabulary/readability | `🌗` | spec/editorial guide/examples | Index normative/informative labeling inconsistent | `relgeo/spec` | website/docs | Author confusion | Reconcile labels and add docs check |
| `DECL-001` | Typed parameters/defaults/structured params | `🌗` | evaluator; structured parameter tests; fixture 16 | Candidate unit/evaluator not active | `relgeo/core` | evaluator, CLI, Flutter | Unpromoted input semantics | Define promotion gate and active fixture |
| `DECL-002` | Immutable constants | `✔️` | values resolver/tests | Shared override-negative fixture limited | `relgeo/spec` + `core` | graph/evaluator | Silent mutation regression | Add immutable/profile negative fixture |
| `DECL-003` | Read-only derived values/scopes | `✔️` | evaluator; derived access tests | Full cycle/error inventory absent | `relgeo/core` | graph, queries | Hidden dependency errors | Add derived error fixture set |
| `DECL-004` | Parameter profiles | `🌗` | profile option/runtime | Active profile fixture coverage incomplete | `relgeo/core` + `cli` | parameters, CLI, Playground | Surface divergence | Add active profile conformance fixture |
| `TYPE-001` | Scalar types and coercion | `🌗` | type spec; units/evaluator tests | Exhaustive coercion policy not active | `relgeo/spec` + `core` | evaluator, language-service | Numeric/unit ambiguity | Generate type/coercion coverage |
| `TYPE-002` | Structured runtime types | `🌗` | types/eval-context; core tests | frame/bbox/collection/path-ref parity incomplete | `relgeo/core` | anchors, queries | Invalid structured values | Add typed query/collection fixtures |
| `EXPR-001` | Arithmetic/precedence | `✔️` | evaluator tests | Normative function map not generated | `relgeo/core` | evaluator | Function drift | Keep tests; add spec-to-function check |
| `EXPR-002` | Comparison/logical/ternary | `✔️` | evaluator/parser tests | Negative statement-level boundary mostly prose | `relgeo/spec` + `core` | parser | Scope creep | Add explicit reject fixture |
| `EXPR-003` | Symbol/property/index/anchor references | `✔️` | graph/eval-context/reference tests | Some edge errors raw/uncatalogued | `relgeo/core` | graph, anchors | Diagnostic inconsistency | Normalize reference errors |
| `EVAL-001` | Dependency graph/topological order | `✔️` | graph/resolver; cycle tests | Cycle categories not one shared fixture | `relgeo/core` | parser, expressions | Nondeterministic resolution | Add cross-consumer cycle fixture |
| `EVAL-002` | Unit normalization/target-unit evaluation | `🌗` | units tests; CLI `--unit`; fixture 16 | Candidate promotion held | `relgeo/core` | DECL-001, CLI, Flutter | Cross-consumer numeric mismatch | Contract-review fixture 16 |
| `OBJ-001` | Stable object model/identity | `✔️` | parser/resolver/types; snapshots | No generated object schema | `relgeo/spec` + `core` | all object consumers | Object vocabulary drift | Generate/check object type list |
| `GEO-001` | Point modes/intersections | `🌗` | point resolver; geometry/intersection tests | Full anchor/degenerate matrix incomplete | `relgeo/core` + `geometry` | anchors, queries | Geometry edge regressions | Add point mode matrix |
| `GEO-002` | Line construction modes | `🌗` | line resolver/geometry tests | Tangent/direction error and consumer matrix incomplete | `relgeo/core` + `geometry` | anchors, constraints | Wrong relation semantics | Add line mode fixtures |
| `GEO-003` | Rect/circle/ellipse | `🌗` | shape resolver; fixture 10/15 | Holes/placement/property combinations incomplete | `relgeo/core` | renderer, placement | Primitive parity gaps | Expand active primitive fixtures |
| `GEO-004` | Arc/curve/path/polygon/text | `🌗` | shape/path resolver and tests | Active snapshots cover subset | `relgeo/core` + `geometry` | renderer, queries | Unsupported path variants | Add per-object active fixtures |
| `GEO-005` | Closed shapes/holes/topology | `🌗` | path holes/fillet tests | Degenerate/topology parity incomplete | `relgeo/geometry` + `core` | boolean, renderer | Invalid topology/output | Add topology/error fixtures |
| `COMP-001` | Groups/hierarchy/transforms | `🌗` | group resolver/tests; legacy fixtures | Active v0.5/post-transform coverage limited | `relgeo/core` | anchors, renderer | Coordinate-frame mismatch | Promote group fixture subset |
| `COMP-002` | Clone/reuse | `🌗` | clone resolver; fixture 05 | Active identity/metadata coverage limited | `relgeo/core` | metadata, sheets | Clone reference drift | Add active clone fixture |
| `COMP-003` | Components/params/local derived/exports | `🌗` | component resolver/tests | Nested/export behavior not fully active | `relgeo/core` | DECL-001/003, graph | Scope leakage | Add component export conformance |
| `PLACE-001` | Generic placement modes | `🌗` | placement utils/smart placement tests | Multi-anchor/inside/offset coverage incomplete | `relgeo/core` | anchors, types | Placement mismatch | Add placement mode matrix |
| `PLACE-002` | `on.point` | `✔️` | point/anchor placement tests | Consumer parity limited | `relgeo/core` | anchors | Host divergence | Keep focused regression |
| `PLACE-003` | `on.path` | `🌗` | path placement/query tests | Domain/error cases incomplete | `relgeo/core` | QUERY-002, frame | Path parameter errors | Add path-domain fixtures |
| `PLACE-004` | `on.frame` | `✔️` | frame placement/tangent tests | Cross-consumer evidence limited | `relgeo/core` | TYPE-002 | Frame parity | Add semantic fixture projection |
| `ANCH-001` | Named/world anchors | `🌗` | anchors resolver/group tests | Spec vocabulary broader than active fixtures | `relgeo/core` | object model, transforms | Wrong post-transform values | Generate anchor vocabulary check |
| `COLL-001` | Repeat modes/identity | `🌗` | repeat/grid tests | All modes/identity not active | `relgeo/core` | types, placement | Collection ordering drift | Add repeat conformance set |
| `COLL-002` | Divide/split collections | `🌗` | divide/split tests | Result/pick contract incomplete | `relgeo/core` | geometry topology | Downstream collection mismatch | Add result-shape fixtures |
| `COLL-003` | Boolean geometry | `🌗` | fixture 15; runtime-error 19/20 | Active only limited intersection/subtract boundary | `relgeo/geometry` + `core` | decision 07, topology | Overclaim boolean parity | Keep boundary; review next operation |
| `COLL-004` | Collection access/functions | `🌗` | eval-context; collection tests | Empty/index errors not uniform | `relgeo/core` | TYPE-002, diagnostics | Raw error leakage | Normalize collection errors |
| `QUERY-001` | Scalar/bbox geometry queries | `✔️` | evaluator/query tests | No generated function report | `relgeo/core` | geometry | Function drift | Add query inventory check |
| `QUERY-002` | Path/transform queries | `🌗` | evaluator/path tests | Domain/precision/consumer parity incomplete | `relgeo/core` + `geometry` | placement, anchors | Numeric mismatch | Define tolerance/domain fixtures |
| `CON-001` | Directional constraints | `🌗` | constraint resolver/tests | Shared active diagnostics mostly align | `relgeo/core` | geometry, diagnostics | Constraint type gaps | Add equal/parallel/perpendicular/tangent fixtures |
| `CON-002` | Violation payload/no mutation | `🌗` | fixture 14; diagnostic tests | Full code/path/object coverage incomplete | `relgeo/core` | DIAG-001/002 | Consumer diagnostic divergence | Publish error-code fixture map |
| `PRES-001` | Dimension objects | `🌗` | dimension resolver/tests; legacy fixtures | Active v0.5 coverage thin | `relgeo/renderer-svg` + `core` | metadata, serialization | Presentation regression | Add active dimension fixture |
| `PRES-002` | Annotation/leader objects | `🌗` | annotation resolver/tests | Active/escaping coverage incomplete | `relgeo/renderer-svg` + `core` | SER-002 | Unsafe output | Add escaping and active annotation fixture |
| `PRES-003` | Drawing roles/filter/defaults | `🌗` | role spec/renderer | Host parity and combinations incomplete | `relgeo/spec` + renderer | views, metadata | Inconsistent final output | Add role semantic fixture |
| `PRES-004` | Views/sheets composition | `🌗` | sheet resolver/CLI/legacy fixtures | Current v0.5/host evidence incomplete | `relgeo/core` + renderer | placement, PRES-003 | Layout incompatibility | Add active sheet/view fixtures |
| `META-001` | Object/document metadata | `🌗` | metadata resolver/renderer; fixture 10 | Full field/security consumer coverage incomplete | `relgeo/spec` + renderer | SER-002 | Metadata alters output unexpectedly | Add metadata invariance checks |
| `META-002` | Presets/inherit/legacy alias | `🌗` | inherit tests/schema; fixture 07 | Merge provenance and alias cases incomplete | `relgeo/core` | metadata, compatibility | Silent style drift | Add ordered-merge fixtures |
| `DIAG-001` | Phase-specific diagnostics | `🌗` | error model; fixtures 11–14/17–20 | Not every phase/code has shared fixture | `relgeo/core` | parser, resolver, LS, CLI | Recovery/UX inconsistency | Build error-code coverage report |
| `DIAG-002` | Stable error code/path/payload | `⚠️` | raw `Error` paths; error-model spec | Structured model violated by raw throws | `relgeo/core` | DIAG-001, ERR-001 | Broken consumer contract | Normalize all resolver errors |
| `ERR-001` | Error phase/fail-safe modes | `🌗` | tolerant/validation tests; runtime fixtures | Cross-consumer fail-safe coverage incomplete | `relgeo/core` | diagnostics, Playground | Stale/invalid preview confusion | Add mode/last-valid-preview tests |
| `SER-001` | Canonical resolved-scene JSON | `🌗` | CLI JSON; expected JSON snapshots | Shape/order/number/error contract not normative | `relgeo/core` + `cli` | ERR-001, VER-002 | Unstable diffs/API | Decide and lock JSON schema |
| `SER-002` | Safe semantic SVG serialization | `⚠️` | renderer snapshots/security checks | Dimension/annotation escaping defect remains | `relgeo/renderer-svg` | PRES-001/002, META-001 | Unsafe or non-portable output | Fix escaping; add security regressions |
| `VER-001` | Explicit/omitted version | `✔️` | parser/schema/fixtures 17/18 | Policy duplicated | `relgeo/spec` + `core` | LS, manifest | Version drift | Keep negative fixtures |
| `VER-002` | Active/legacy/future compatibility | `✔️` | manifest/parser/checker | Consumer declarations duplicated | `relgeo/workspace` | all consumers | Silent downgrade | Add generated compatibility metadata |
| `VER-003` | Backward aliases/fallbacks | `🌗` | styles/metaPresets resolver/schema | Provenance not centralized | `relgeo/spec` + `core` | META-002 | Legacy semantic drift | Inventory aliases and fixtures |
| `VER-004` | Fixture status/promotion governance | `✔️` | manifest and conformance runner | Candidate promotion remains decision-gated | `relgeo/workspace` | decision 07, CI | Candidate overclaim | Preserve status checks |

## Gap backlog

The implementation candidates derived from `🌗` and `⚠️` are maintained in
[language-specification/implementation-gap-backlog.md](./implementation-gap-backlog.md).
