# Language Specification Capability Status Matrix

**Tanggal:** 2026-11-07
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

Current count: **53 `✔️` · 0 `🌗` · 0 `❌` · 0 `➖` · 0 `⏸️` · 0 `⚠️`**.
Evidence `not verified` tetap ditulis di kolom evidence dan tidak otomatis
menjadi `❌` atau `➖`.

### Latest verification refresh — 2026-11-07

The latest targeted local verification passed the language-spec checks, full
workspace package tests, 677/677 conformance assertions across 33 fixtures,
289/289 compatibility checks, and Flutter spec snapshot drift checks. This
checkpoint ran on Node `22.23.2`, below the repository's declared Node `>=24`
engine, so these results refresh local source evidence only; Node 24,
canonical CI, root Flutter/MCP runtime, and clean-host boundaries remain
separately `not verified`. The matrix is **53 `✔️` · 0 `🌗` · 0 `❌` · 0
`➖` · 0 `⏸️` · 0 `⚠️`**.

## Frozen closure boundary

The matrix is a one-to-one reporting view of the frozen **53-ID** expected
catalog. The catalog's per-ID consumer and measurable-acceptance contract is
authoritative for closure planning; this matrix adds observed status, evidence,
gap, owner, dependency, risk, and next action. A partial, broken, candidate, or
unverified implementation result never removes an expected row. `GAP-*` and
`CORE-*` labels are supporting work/contract anchors, not extra capability IDs.

The following invariants are mandatory for every update:

1. expected catalog IDs, matrix IDs, and reconciliation IDs remain identical;
2. each view has exactly one row per capability ID;
3. source of truth remains `spec/id/` for language meaning;
4. status changes require evidence changes, while scope changes require an
   explicit normative/decision update and a matching catalog update.

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

The current evidence is local working-tree evidence. This checkpoint ran
Node-based checks on Node `22.23.2` despite the declared Node `>=24` requirement;
MCP/Dart service evidence, public/browser evidence, and native-host evidence
remain `not verified` where stated by the audit. This limits the verification
claim; it does not remove an expected capability from the matrix.

## P0/P1 triage handoff

The implementation-closability decision is recorded in the [gap backlog](./implementation-gap-backlog.md#p0p1-implementation-closability-triage).
At the 2026-11-04 triage, all eight P0/P1 candidate rows were considered
implementation-closable from the current checkout: `GAP-001` (`LANG-002`,
`DOC-003`, `TYPE-001`, `TYPE-002`, `VER-003`), `GAP-002` (`DECL-001`,
`DECL-004`, `EVAL-002`), `GAP-003`, `GAP-007`, `GAP-008`, `GAP-009`,
`GAP-011`, and `GAP-013`. Their owners, normative sources, focused acceptance
tests, and initial statuses are defined in that linked table. This selection
does not change any matrix status and does not make release, deployment,
Node-24 CI, browser/native-host evidence, or deferred scope a local
implementation prerequisite.

## Matrix

| ID | Capability | Status | Evidence | Gap / finding | Owner | Dependency | Risk | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `LANG-001` | Text-first YAML authoring | `✔️` | core parser; conformance 677/677 across 33 fixtures | Grammar catalog tidak generated | `relgeo/spec` | parser consumers | Drift vocabulary | Pertahankan parser/fixture checks |
| `LANG-002` | Relational/deterministic semantics | `✔️` | spec core; checked vocabulary/coercion catalog; graph/resolver tests; `language-spec:check` | Relation-first vocabulary, deterministic numeric boundary, and informative-doc drift checks are enforced locally; host/CI parity remains separate evidence | `relgeo/spec` + `core` | graph, validator | False parity claim | Preserve drift checker and negative tests |
| `DOC-001` | Root document sections | `✔️` | parser/validator; fixture 10 | Generated section schema absent | `relgeo/spec` | core parser | Section drift | Tambah section contract check |
| `DOC-002` | Scene/unit/viewport configuration | `✔️` | scene/unit tests | Combination coverage terbatas | `relgeo/spec` + `core` | units, renderer | Viewport mismatch | Tambah scene conformance cases |
| `DOC-003` | Editorial vocabulary/readability | `✔️` | spec/editorial guide; checked vocabulary catalog; `language-spec:check` | Normative/informative labels and the rule that informative docs cannot extend DSL vocabulary are checked | `relgeo/spec` | website/docs | Author confusion | Preserve editorial drift checks |
| `DECL-001` | Typed parameters/defaults/structured params | `✔️` | Core structured/profile/unit tests; CLI 40 tests; Flutter shared conformance; active fixture 16 | Typed defaults, structured values, profile overrides, and derived placement are active on the audited local boundary; canonical Node-24/CI evidence remains separate | `relgeo/core` | evaluator, CLI, Flutter | Drift between consumers | Preserve active fixture and refresh canonical evidence |
| `DECL-002` | Immutable constants | `✔️` | values resolver/tests | Shared override-negative fixture limited | `relgeo/spec` + `core` | graph/evaluator | Silent mutation regression | Add immutable/profile negative fixture |
| `DECL-003` | Read-only derived values/scopes | `✔️` | evaluator; derived access tests | Full cycle/error inventory absent | `relgeo/core` | graph, queries | Hidden dependency errors | Add derived error fixture set |
| `DECL-004` | Parameter profiles | `✔️` | Profile validator regressions; CLI profile tests; fixture 28 negative boundary; active fixture 16 | Profiles override declared parameters only; constants and structure remain protected | `relgeo/core` + `cli` | parameters, CLI, Playground | Surface divergence | Preserve profile-only contract and negative fixtures |
| `TYPE-001` | Scalar types and coercion | `✔️` | type spec; checked scalar/coercion catalog; `evaluator.test.ts`; `parameter_type_validation.test.ts` | v0.5 numeric boundary enforces contextual length addition, scalar multiplication/division, and rejects length²/number÷length with `TYPE_MISMATCH` | `relgeo/spec` + `core` | evaluator, language-service | Numeric/unit ambiguity | Preserve focused coercion tests |
| `TYPE-002` | Structured runtime types | `✔️` | type spec; checked structured catalog; validator; `parameter_type_validation.test.ts`; fixture 29 | frame2d, bbox2d, collection, and path-ref shapes have explicit validation and a shared negative conformance fixture; query host parity remains separate | `relgeo/core` | anchors, queries | Invalid structured values | Preserve shape contract and fixture |
| `EXPR-001` | Arithmetic/precedence | `✔️` | evaluator tests | Normative function map not generated | `relgeo/core` | evaluator | Function drift | Keep tests; add spec-to-function check |
| `EXPR-002` | Comparison/logical/ternary | `✔️` | evaluator/parser tests | Negative statement-level boundary mostly prose | `relgeo/spec` + `core` | parser | Scope creep | Add explicit reject fixture |
| `EXPR-003` | Symbol/property/index/anchor references | `✔️` | graph/eval-context/reference tests | Some edge errors raw/uncatalogued | `relgeo/core` | graph, anchors | Diagnostic inconsistency | Normalize reference errors |
| `EVAL-001` | Dependency graph/topological order | `✔️` | graph/resolver; cycle tests | Cycle categories not one shared fixture | `relgeo/core` | parser, expressions | Nondeterministic resolution | Add cross-consumer cycle fixture |
| `EVAL-002` | Unit normalization/target-unit evaluation | `✔️` | Core evaluator/unit tests; CLI `--unit`; active fixture 16; Flutter shared semantic projection | Active v0.5 fixture produces deterministic normalized values and geometry locally; canonical Node-24/CI/host evidence remains separate | `relgeo/core` | DECL-001, CLI, Flutter | Cross-consumer numeric mismatch | Preserve comparator and active fixture |
| `OBJ-001` | Stable object model/identity | `✔️` | parser/resolver/types; language-service schema/completions; vocabulary drift regression; snapshots | All 26 v0.5 object types, including six geometry operations, are checked across the parser and language-service projections | `relgeo/spec` + `core` + `language-service` | all object consumers | Renderer/external consumer parity | Preserve `pnpm run language-spec:check` object-operation projection |
| `GEO-001` | Point modes/intersections | `✔️` | fixture 31 active shared point modes; point/intersection and polar/cartesian regressions; conformance 677/677 | Absolute/relative/from-to/intersection point outcomes are typed and deterministic on the audited v0.5 boundary | `relgeo/core` + `geometry` | anchors, queries | Cross-runtime parity remains separate evidence | Preserve fixture 31 and negative guards |
| `GEO-002` | Line construction modes | `✔️` | fixture 31 from-to/direction-length; line/tangent tests; structured invalid-length regression; conformance 677/677 | From-to and direction-length modes plus anchor/query behavior are covered; non-positive directions remain deterministic diagnostics | `relgeo/core` + `geometry` | anchors, constraints | Unsupported future line modes remain out of scope | Preserve shared line fixture |
| `GEO-003` | Rect/circle/ellipse | `✔️` | fixture 31 rect/circle/ellipse with hole, placement, anchors; degeneracy tests; conformance 677/677 | Primitive dimensions/radii, placement, properties, anchors, and bounded hole semantics resolve and project semantically | `relgeo/core` | renderer, placement | Broader topology remains separately bounded | Preserve primitive snapshot and negative tests |
| `GEO-004` | Arc/curve/path/polygon/text | `✔️` | fixture 31 active arc/quadratic/cubic/path/polygon/text semantic snapshot; resolver tests; conformance 677/677 | Each supported v0.5 curve/path/text surface has a reviewable resolved and SVG semantic projection | `relgeo/core` + `geometry` | renderer, queries | Unsupported variants remain explicit negative boundaries | Preserve per-object fixture coverage |
| `GEO-005` | Closed shapes/holes/topology | `✔️` | fixture 31 closed path with hole; path holes/fillet/closure tests; semantic SVG snapshot; conformance 677/677 | Closed path closure and hole topology are preserved without implicit repair on the audited boundary | `relgeo/geometry` + `core` | boolean, renderer | Broader non-rectangle topology remains scope-bounded | Preserve closure/error tests |
| `COMP-001` | Groups/hierarchy/transforms | `✔️` | fixture 31 group transform; group/nested-anchor tests; renderer and CLI shared snapshots; conformance 677/677 | Group hierarchy and world-space projection remain deterministic after transform | `relgeo/core` | anchors, renderer | Host parity remains separate evidence | Preserve transformed group fixture |
| `COMP-002` | Clone/reuse | `✔️` | fixture 31 clone identity/transform; clone contract and metadata tests; conformance 677/677 | Clone retains identity, inherited geometry, and independent transformed projection | `relgeo/core` | metadata, sheets | Mutable-state stress beyond resolver contract remains separate | Preserve clone snapshot |
| `COMP-003` | Components/params/local derived/exports | `✔️` | fixture 31 component params/export; nested component/export/scope tests; conformance 677/677 | Component parameters and exported child identity resolve in scope without leaking private members | `relgeo/core` | DECL-001/003, graph | Full host component UX remains separate evidence | Preserve component fixture and scope negatives |
| `PLACE-001` | Generic placement modes | `✔️` | fixture 31 topLeft/inside/custom-anchor placement; smart/frame placement tests and structured negative diagnostics; conformance 677/677 | Generic placement, inside margin, and named-anchor modes resolve with stable coordinates and diagnostics | `relgeo/core` | anchors, types | Unsupported combinations remain negative-tested | Preserve placement matrix fixture |
| `PLACE-002` | `on.point` | `✔️` | point/anchor placement tests | Consumer parity limited | `relgeo/core` | anchors | Host divergence | Keep focused regression |
| `PLACE-003` | `on.path` | `✔️` | fixture 31 path placement with explicit anchor; frame/path bounds, unknown-anchor/field, and `tAtLength` regressions; conformance 677/677 | `on.path` resolves deterministic t-domain and anchor placement without implicit rotation on the audited boundary | `relgeo/core` | QUERY-002, frame | Broader host orientation parity remains separate | Preserve path-domain fixture |
| `PLACE-004` | `on.frame` | `✔️` | frame placement/tangent tests | Cross-consumer evidence limited | `relgeo/core` | TYPE-002 | Frame parity | Add semantic fixture projection |
| `ANCH-001` | Named/world anchors | `✔️` | fixture 31 custom named anchor before/after group transform; anchor/group and missing-anchor tests; conformance 677/677 | Named anchors and world access are typed, read-only projections with stable transformed values | `relgeo/core` | object model, transforms | Future anchor vocabulary additions require spec-first checks | Preserve anchor projection and negative tests |
| `COLL-001` | Repeat modes/identity | `✔️` | fixture 24 + fixture 32 repeat/grid context; repeat/grid tests; conformance 677/677 | Linear and grid repeat preserve deterministic child identity, order, index/row/col context, and repeat collection access on the audited v0.5 boundary | `relgeo/core` | types, placement | Broader host parity remains separate | Preserve repeat identity fixture and negatives |
| `COLL-002` | Divide/split collections | `✔️` | fixture 32 divide/split result shapes; split/repeat tests; conformance 677/677 | Divide and split expose stable collection/path result shapes, pick behavior, first/last/index access, and invalid-input diagnostics | `relgeo/core` | geometry topology | Broader topology remains bounded | Preserve result-shape and invalid split tests |
| `COLL-003` | Boolean geometry | `✔️` | fixtures 15, 19, 20, 24, and 32; boolean tests; conformance 677/677 | Approved v0.5 union/xor/intersect/subtract and multi/empty result boundaries have explicit snapshots or structured runtime errors | `relgeo/geometry` + `core` | decision 07, topology | Unapproved topology remains explicit negative boundary | Preserve bounded boolean fixture/error set |
| `COLL-004` | Collection access/functions | `✔️` | fixture 32 count/first/last/index; eval-context and collection tests; conformance 677/677 | Deterministic ordering, count/first/last/index, empty behavior, structured index failures, and no implicit mutation are checked together | `relgeo/core` | TYPE-002, diagnostics | Consumer host parity remains separate | Preserve active collection-access fixture |
| `QUERY-001` | Scalar/bbox geometry queries | `✔️` | evaluator/query tests | No generated function report | `relgeo/core` | geometry | Function drift | Add query inventory check |
| `QUERY-002` | Path/transform queries | `✔️` | fixture 31 pointAt/tangentAt/toWorld projections; evaluator/path/frame/intersection tolerance tests; conformance 677/677 | Path and transform queries produce typed deterministic values with bounded domain/tolerance behavior | `relgeo/core` + `geometry` | placement, anchors | Cross-engine numeric parity remains separate evidence | Preserve query fixture and domain negatives |
| `CON-001` | Directional constraints | `✔️` | fixture 32 equal/parallel/perpendicular/tangent matrix; constraint resolver/tests; conformance 677/677 | All four active relation kinds validate post-resolve without mutation, with degenerate and unknown-reference boundaries retained as structured diagnostics | `relgeo/core` | geometry, diagnostics | General-purpose solver remains out of scope | Preserve relation matrix fixture and negatives |
| `CON-002` | Violation payload/no mutation | `✔️` | fixtures 14 and 32; diagnostic tests; semantic fixture regression; conformance 677/677 | Constraint results retain path, type, involved objects, expected/actual deviation, stable order, and unchanged resolved geometry | `relgeo/core` | DIAG-001/002 | Cross-host transport parity remains separate | Preserve diagnostic payload/no-mutation fixture |
| `PRES-001` | Dimension objects | `✔️` | fixture 33 all four dimension kinds; Core dimension regression; renderer security/semantic tests; conformance 677/677 across 33 fixtures | Linear/radius/diameter/angle dimensions preserve typed values, labels, roles, and placement through the active v0.5 fixture | `relgeo/renderer-svg` + `core` | metadata, serialization | Host parity remains separately bounded | Preserve fixture 33 and semantic dimension checks |
| `PRES-002` | Annotation/leader objects | `✔️` | fixture 33 basic/leader/target annotations with hostile text; Core/renderer security tests; CLI/Markdown conformance | Annotation fallback, leader endpoints, text escaping, and dynamic attribute escaping are covered without executable markup | `relgeo/renderer-svg` + `core` | SER-002 | Host parity remains separately bounded | Preserve fixture 33 and security assertions |
| `PRES-003` | Drawing roles/filter/defaults | `✔️` | fixture 33 final/construction/guide/centerline/hidden/dimension/annotation roles; semantic SVG and renderer role tests | Role identity, visibility, defaults, and role filtering remain explicit in resolved and rendered projections | `relgeo/spec` + renderer | views, metadata | Broader host parity remains separately bounded | Preserve role fixture and semantic projection checks |
| `PRES-004` | Views/sheets composition | `✔️` | fixture 33 active v0.5 views/sheet with portrait A4, topLeft/center placement, metadata; Core/renderer/CLI conformance | View scale/filter, sheet orientation/placement, and title metadata compose without mutating model geometry | `relgeo/core` + renderer | placement, PRES-003 | Native/browser host parity remains separately bounded | Preserve fixture 33 sheet/view projection |
| `META-001` | Object/document metadata | `✔️` | fixture 33 document/object metadata and hostile values; Core invariance test; renderer semantic/security and consumer conformance | Metadata remains non-authoritative to geometry while canonical JSON and safe SVG carry bounded metadata fields | `relgeo/spec` + renderer | SER-002 | Host parity remains separately bounded | Preserve metadata invariance and escaping checks |
| `META-002` | Presets/inherit/legacy alias | `✔️` | fixtures 30 and 33; inherit/schema tests; active ordered preset/style alias resolution; conformance 677/677 | Ordered preset/style inheritance and legacy aliases resolve deterministically with local metadata override precedence | `relgeo/core` | metadata, compatibility | Additional future alias vocabulary remains out of scope | Preserve fixtures 30/33 and alias parity tests |
| `DIAG-001` | Phase-specific diagnostics | `✔️` | error model chapters 04–06; fixtures 11–14/17–20; Core, language-service, CLI, and conformance tests | Parse, validate, resolve, runtime, and constraint diagnostics expose deterministic code/phase/severity/message plus path/range where available; unavailable Node 24/CI/host evidence remains separate | `relgeo/core` | parser, resolver, LS, CLI | Recovery/UX inconsistency | Preserve phase fixture coverage and refresh external evidence separately |
| `DIAG-002` | Stable error code/path/payload | `✔️` | structured error-model contract; raw-throw inventory; Core structured boundary tests; LS/CLI/Markdown tests | No raw `Error`/stack crosses the audited public boundaries; repeat/sheet failures retain stable code, phase, path, and object context; external host evidence remains not verified | `relgeo/core` | DIAG-001, ERR-001 | Unverified-host parity | Keep boundary inventory and add regressions for new producers |
| `ERR-001` | Error phase/fail-safe modes | `✔️` | evaluation/error-model chapters; tolerant/validation tests; runtime fixtures; CLI/LS/Markdown consumer tests | Editor/tolerant recovery is non-throwing where supported, validate/compile remain strict, runtime failures produce no compile output, and Markdown/CLI/LS mappings remain structured; Node 24/CI/host evidence remains separate | `relgeo/core` | diagnostics, Playground | Stale/invalid preview confusion | Preserve mode/last-valid-preview tests and report host evidence separately |
| `SER-001` | Canonical resolved-scene JSON | `✔️` | fixture 33 expected resolved-scene JSON; Core serializer/replay tests; conformance 677/677 | Resolved-scene JSON has stable field identity/order, finite numbers, metadata/views/sheets, and deterministic replay coverage | `relgeo/core` + `cli` | ERR-001, VER-002 | Host transport parity remains separately bounded | Preserve canonical JSON snapshot and replay comparator |
| `SER-002` | Safe semantic SVG serialization | `✔️` | fixture 33 semantic SVG snapshot with hostile text/metadata; renderer security/semantic tests; CLI/Markdown conformance | Safe semantic projection preserves geometry/roles/placement and excludes executable markup; raw SVG byte equality is not the contract | `relgeo/renderer-svg` | PRES-001/002, META-001 | Browser/native-host parity remains separately bounded | Preserve fixture 33 and semantic SVG replay checks |
| `VER-001` | Explicit/omitted version | `✔️` | parser/schema/fixtures 17/18 | Policy duplicated | `relgeo/spec` + `core` | LS, manifest | Version drift | Keep negative fixtures |
| `VER-002` | Active/legacy/future compatibility | `✔️` | manifest/parser/checker | Consumer declarations duplicated | `relgeo/workspace` | all consumers | Silent downgrade | Add generated compatibility metadata |
| `VER-003` | Backward aliases/fallbacks | `✔️` | metadata spec; checked alias catalog; parser/schema/completions; resolver semantic-equivalence regression | `styles`/`style` aliases retain documented provenance and resolve to the same metadata semantics as `metaPresets`/`metaPreset` in the focused core test | `relgeo/spec` + `core` | META-002 | Legacy semantic drift | Preserve alias inventory and parity test |
| `VER-004` | Fixture status/promotion governance | `✔️` | manifest and conformance runner | Candidate promotion remains decision-gated | `relgeo/workspace` | decision 07, CI | Candidate overclaim | Preserve status checks |

## Gap backlog

The implementation candidates derived from `🌗` and `⚠️` are maintained in
[language-specification/implementation-gap-backlog.md](./implementation-gap-backlog.md).
