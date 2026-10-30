# Geometry implementation-gap backlog

**Tanggal:** 2026-10-30  
**Status:** candidate goal/task register; no row in this document counts as implementation  
**Source:** [geometry status matrix](./status-matrix.md)

The expected catalog, audit, matrix, and this backlog are synchronized for the
2026-10-30 evidence refresh: 40 expected IDs, 10 `✔️`, 30 `🌗`, and 0 `❌`.
The candidate rows below preserve owner, dependency, acceptance evidence, and
next action for the remaining partial or unverified work; `➖` and `⏸️` scope
findings remain excluded from active implementation.

Backlog ini menurunkan setiap capability berstatus `🌗` atau `❌` menjadi
kandidat pekerjaan yang dapat ditugaskan. Status `❌` saat ini berjumlah nol,
tetapi aturan retention tetap eksplisit: expected ID yang benar-benar tidak
memiliki implementation/consumer behavior harus masuk ke backlog dengan status
`❌`, bukan dihapus atau dipetakan menjadi `➖`. Evidence `not-verified`
dipisahkan sebagai verification task, bukan implementation claim. Pada reconciliation saat ini
`GEO-SER-002` adalah `🌗 partial` dengan evidence `not-verified`, sehingga ia
memiliki candidate implementation task dan follow-up verification task yang
terpisah.

## Aturan backlog

- `Candidate goal` mengelompokkan pekerjaan menurut owner/dependency; ia bukan
  goal aktif SuClos dan belum menjadi komitmen implementasi.
- `Candidate task` satu row per expected ID, supaya trace matrix → acceptance
  test → next action tidak hilang.
- `Owner` menunjukkan boundary yang harus memimpin; consumer atau evidence
  owner dapat tetap menjadi dependency.
- `Acceptance test / evidence target` adalah bukti yang harus diperoleh, bukan
  bukti yang sudah ada.
- Implementasi, status evidence, dan scope tetap terpisah dari status backlog.
- Perubahan dokumentasi, matrix, atau README saja tidak menutup task; hanya
  source/configuration change yang relevan ditambah executable acceptance
  evidence yang dapat mengubah status implementation.

## Active bounded selection — task `select-and-bound-in-scope-capability-debt--1180446927`

This is the bounded selection for the current geometry-repository task. It is
an implementation/evidence scope decision, not a claim that any gap is closed
and not a request to publish a new package. Selection is limited to behavior
that can be changed or verified at the `geometry/` package boundary while
preserving the active RelGeo DSL `0.5.x` contract. The status in the second
column is copied from the status matrix/audit; selection does not promote any
row to `✔️`.

| Selected task | Source status | Owner | Source-of-truth and implementation path | Contract boundary | Explicit acceptance behavior |
| --- | --- | --- | --- | --- | --- |
| `FIX-GEO-PROVENANCE-001` remove stale `v0.3` wording | `✔️` locally implemented | geometry | Normative: `spec/id/core/06-error-model.md`; package: `geometry/src/intersection.ts`; tests: `geometry/src/__tests__/intersection.test.ts`; compatibility: `geometry/package.json` | Intersection package diagnostics and provenance strings only. Do not redefine the DSL error taxonomy or core diagnostic mapping. | No exported intersection error mentions `v0.3`; unsupported pairs retain a stable, actionable error; a package regression test proves the wording. |
| `GAP-GEO-QUERY-004` publish the bounded intersection pair/selector contract | `🌗` | geometry (lead), core (consumer dependency) | Normative: `spec/id/geometry/20-geometry-queries.md` §20.18 and `spec/id/core/06-error-model.md` §6.2; package: `geometry/src/intersection.ts`; tests: `geometry/src/__tests__/intersection.test.ts` | `computeIntersections` pair dispatch, deterministic ordering/deduplication, and `applySelector` behavior for currently supported low-level object pairs. Core owns DSL query parsing and diagnostic projection. No new pair or deferred boolean promotion is implied. | A supported-pair table and executable tests cover `first`, `last`, `index`, `nearest`, `farthest`, implicit single-result, multiple-result, empty-result, and unsupported-pair behavior; existing fixture-15 semantics remain unchanged. |
| `GAP-GEO-NUM-001` define the low-level tolerance/error-bound policy | `🌗` | geometry (implementation), spec (contract review) | Normative: `spec/id/core/05-semantic-guarantees.md` §5.5 and `spec/id/geometry/14-geometry-objects.md`; package: `geometry/src/intersection.ts`, `geometry/src/split.ts`, `geometry/src/path-modifiers.ts`, `geometry/src/boolean/normalizeClosedShape.ts`; tests: `geometry/src/__tests__/intersection.test.ts`, `split.test.ts`, `path_modifiers.test.ts` | Numeric equality, membership, sampling cleanup, and split/modifier tolerances used by the low-level package. This does not publish a universal DSL epsilon or claim cross-runtime parity. | The supported operations and their tolerance boundaries are documented, near-boundary tests pass deterministically, and no test relies on raw floating-point equality where the package contract requires tolerance. |
| `GAP-GEO-NUM-002` harden winding/holes normalization | `🌗` | geometry (lead), core (operation consumer) | Normative: `spec/id/core/05-semantic-guarantees.md` §5.5; package: `geometry/src/boolean/normalizeClosedShape.ts`, `geometry/src/boolean/ClipperBooleanEngine.ts`; existing tests: `geometry/src/__tests__/geometry.test.ts`; target: `geometry/src/__tests__/boolean.test.ts` | Closed-shape normalization before the existing boolean engine, including ring cleanup, winding-independent inputs, and hole preservation. Deferred union/xor/non-rectangle promotion remains out of scope. | Clockwise and counter-clockwise equivalent inputs produce equivalent normalized topology; holes remain holes after normalization; existing rectangle intersect/subtract and empty/multipart consumer expectations do not regress. |
| `GAP-GEO-NUM-003` complete the low-level invalid-input error catalog | `🌗` | geometry (implementation), core (diagnostic consumer) | Normative: `spec/id/core/06-error-model.md` §§6.2–6.9; package: `geometry/src/error.ts`, `geometry/src/path-modifiers.ts`, `geometry/src/split.ts`, `geometry/src/intersection.ts`; tests: `geometry/src/__tests__/path_modifiers.test.ts`, `split.test.ts`, `intersection.test.ts` | Stable package-level error codes for invalid corner/offset/split and unsupported intersection operations. Core remains responsible for mapping package failures into document paths and public DSL diagnostics. | Every selected low-level invalid branch either raises an existing `GeometryError` code or has an explicit stable package error contract; negative tests cover degenerate radius/path/join/offset/tangent/split and unsupported intersection cases without silently coercing input. |

### Deliberately excluded from active implementation

The following are retained as candidate or scope findings, but are not part of
this task's active implementation set:

| Excluded item | Status | Reason |
| --- | --- | --- |
| Broader boolean union/xor/non-rectangle topology (`GEO-BOOLEAN-001/002`) | `⏸️` finding over `🌗` rows | The existing decision and fixture boundary hold this expansion; preserve fixture 15 rather than treating the held expansion as active work. |
| Geometry-owned UI routes, shortcuts, and platform file service | `➖` | These belong to consumer/platform surfaces, not `geometry/`; no geometry task is created for them. |
| Evaluator/unit promotion (`GEO-MEASURE-002/004`), Flutter parity (`GEO-PARITY-001/002`), and canonical cross-runtime replay (`GEO-DET-001`, `GEO-SER-002`) | `🌗` with `not-verified` or consumer dependency | They require core, Flutter, serializer, or host evidence outside this bounded package task; their candidate rows remain unchanged. |
| Core-owned collections, placement, constraints, and high-level query implementation | `➖` boundary or `🌗` consumer-owned row | Geometry may provide primitives, but this selection does not duplicate or reassign core ownership. |

No `➖` or `⏸️` item is an active implementation task. No current expected
capability is `❌`; if a later audit finds a true absence, its unchanged ID and
`❌` status must be added explicitly before it can be selected.

## Priority and sequencing index

Priority memakai urutan `P0` (contract/defect atau parity blocker), `P1`
(high-value shared behavior and reliability), lalu `P2` (bounded coverage
expansion). Dependencies in the candidate-goal sections remain prerequisites;
the index is the review order, not a claim that any task has been started.

| Priority | Candidate IDs | Rationale |
| --- | --- | --- |
| `P0` | `GAP-GEO-SER-002`; `GAP-GEO-BOOLEAN-001`; `GAP-GEO-BOOLEAN-002`; `GAP-GEO-MEASURE-002`; `GAP-GEO-MEASURE-004`; `GAP-GEO-PARITY-001`; `GAP-GEO-PARITY-002` | Establish canonical serialization, close active boolean/unit boundaries, and unblock cross-consumer parity decisions. The provenance defect is resolved locally and remains only as a follow-up record. |
| `P1` | `GAP-GEO-OBJ-001`; `GAP-GEO-XFORM-002`; `GAP-GEO-PLACE-001`; `GAP-GEO-PLACE-002`; `GAP-GEO-COLL-001`; `GAP-GEO-COLL-002`; `GAP-GEO-COLL-003`; `GAP-GEO-COLL-004`; `GAP-GEO-COLL-005`; `GAP-GEO-QUERY-001`; `GAP-GEO-QUERY-002`; `GAP-GEO-QUERY-004`; `GAP-GEO-CONSTRAINT-001`; `GAP-GEO-NUM-001`; `GAP-GEO-NUM-002`; `GAP-GEO-NUM-003`; `GAP-GEO-DET-001`; `GAP-GEO-DET-002`; `GAP-GEO-SER-001` | Close high-risk gaps in identity, placement, collection semantics, queries, constraints, numerical policy, deterministic replay, and resolved-scene serialization. |
| `P2` | `GAP-GEO-PRIM-003`; `GAP-GEO-PRIM-004`; `GAP-GEO-PRIM-005`; `GAP-GEO-ANCH-002` | Expand bounded curve, path/text, composition, and custom-anchor coverage after shared contract foundations are stable. |

The index contains one candidate ID for every current `🌗`/`❌` row plus the
confirmed defect. `VERIFY-GEO-SER-002` is intentionally omitted from the
implementation priority index because it is evidence-only follow-up.

## Candidate goal G-01 — Close object, primitive, transform, placement, anchor semantics

**Owner:** geometry + core  
**Dependency:** object graph, typed diagnostics, path/frame contract  
**Risk:** high for identity/placement; medium for primitive coverage

| Candidate task | Source status | Owner | Dependency | Acceptance test / evidence target | Next action |
| --- | --- | --- | --- | --- | --- |
| `GAP-GEO-OBJ-001` close identity and graph contract | `🌗` | core | object model, graph, diagnostics | Duplicate/cycle/identity fixture yields stable IDs, dependency order, and document paths across two runs | Define fixture and expected JSON |
| `GAP-GEO-PRIM-003` promote curve segment behavior | `🌗` | geometry + core | path representation, sampling/tolerance | Arc/quadratic/cubic construction, length, endpoint, and intersection snapshots pass | Enumerate supported curve pairs |
| `GAP-GEO-PRIM-004` close path/polygon/text projection | `🌗` | core + renderer-svg | path resolver, holes, labels | Open/closed path, holes, chaining, and label semantic projection pass in core and renderer | Add shared fixture |
| `GAP-GEO-PRIM-005` close composition identity/scope | `🌗` | core | scope, graph, component exports | Group/clone/component parameter and namespace cases preserve identity and local scope | Add component/clone fixture |
| `GAP-GEO-XFORM-002` close operation-result semantics | `🌗` | core + geometry | operation result identity, collections | Chained mirror/rotate/scale/translate/reverse/split results have stable references and snapshots | Add operation-chain test |
| `GAP-GEO-PLACE-001` close anchor/inside placement | `🌗` | core | anchors, bbox, placement diagnostics | Scalar/point/multi-anchor, offset, inside/margin, and conflict cases have explicit results/errors | Add placement conflict matrix |
| `GAP-GEO-PLACE-002` close path/frame placement parity | `🌗` | core + geometry | frameAt, tangent/normal, transforms | `on.point`, `on.path`, and `on.frame` agree on point/orientation across consumers | Extend frame placement fixture |
| `GAP-GEO-ANCH-002` close custom/result anchors | `🌗` | core + geometry | component scope, operation results | Custom anchors serialize and render with stable names after component and operation use | Add anchor snapshot |

## Candidate goal G-02 — Promote dimensions, collections, queries, constraints

**Owner:** spec + core  
**Dependency:** evaluator, typed dimensions, path traversal, diagnostics  
**Risk:** high for units/collections/queries; medium for validation-only rows

| Candidate task | Source status | Owner | Dependency | Acceptance test / evidence target | Next action |
| --- | --- | --- | --- | --- | --- |
| `GAP-GEO-MEASURE-002` promote unit semantics | `🌗` | spec + core | evaluator, unit policy, Flutter alignment | mm/cm/m/in/px literals normalize to equivalent semantic scenes and reject invalid contexts consistently | Decide promotion boundary |
| `GAP-GEO-MEASURE-004` close parameter/derived scope | `🌗` | core + spec | dependency graph, evaluator, unit boundary | Defaults, structured params, constants, derived cycles, and component-local derived values match expected diagnostics | Add parameter scope fixture |
| `GAP-GEO-COLL-001` complete repeat mode matrix | `🌗` | core | collection identity, placement | linear/each/grid/polar/along each pass shared conformance with stable index/context | Add five mode cases |
| `GAP-GEO-COLL-002` close along distribution policies | `🌗` | core + spec | path length, frameAt, diagnostics | Uniform length/t, fixed distance, offsets, endpoint, frame, and conflict cases are explicit | Write edge-policy table |
| `GAP-GEO-COLL-003` close grid pitch/gap validation | `🌗` | core | dimensions, placement conflict policy | Pitch/gap exclusivity, auto-layout, and over-constraint diagnostics pass | Add negative grid fixtures |
| `GAP-GEO-COLL-004` close divide/split collection semantics | `🌗` | core + geometry | split operation, ordering, selectors | Divide and split preserve traversal order, count, first/last, and result identity | Add collection snapshots |
| `GAP-GEO-COLL-005` prove stable collection replay | `🌗` | core | deterministic resolver, IDs | Repeated-process replay produces identical collection order and repeat IDs | Add replay harness |
| `GAP-GEO-QUERY-001` complete measurement query coverage | `🌗` | core + spec | resolved objects, numeric policy | distance/length/perimeter/area/bbox/extents pass for every supported primitive and invalid target | Build query coverage table |
| `GAP-GEO-QUERY-002` close path/vector query boundaries | `🌗` | core + geometry | path sampling, frame semantics | midpoint/polar/angleBetween/pointAt/tangentAt/normalAt pass endpoints, curves, and out-of-range cases | Add curve query fixture |
| `GAP-GEO-QUERY-004` publish intersection pair/selector contract | `🌗` | geometry + core | intersection algorithms, selectors, boolean contract | Supported pair table, selector errors, deterministic first/last/nearest/farthest/index, and single/multi results pass | Draft pair matrix |
| `GAP-GEO-CONSTRAINT-001` complete relation validation | `🌗` | core + spec | resolved geometry, tolerance | equal/parallel/perpendicular/tangent valid and invalid fixtures emit stable violations | Add four relation fixtures |

## Candidate goal G-03 — Harden boolean, numeric, deterministic, and serialization contracts

**Owner:** geometry + core  
**Dependency:** polygon clipping, normalization, error model, canonical serializer  
**Risk:** high

| Candidate task | Source status | Owner | Dependency | Acceptance test / evidence target | Next action |
| --- | --- | --- | --- | --- | --- |
| `GAP-GEO-BOOLEAN-001` promote boolean operation coverage | `🌗` | geometry + core | polygon clipping, result mode | Reviewed union/xor/non-rectangle cases pass with explicit topology and cross-consumer snapshots | Separate promotion fixture from active fixture 15 |
| `GAP-GEO-BOOLEAN-002` close topology/result-mode errors | `🌗` | core + geometry | normalization, mode policy, diagnostics | single/multi, holes, empty, and multipart behavior have stable expected outcomes | Add topology acceptance matrix |
| `GAP-GEO-NUM-001` define tolerance/error-bound policy | `🌗` | geometry + spec | numeric contract, operations | Supported operations document tolerance behavior and pass near-equality/membership cases without raw-float dependence | Inventory current tolerances |
| `GAP-GEO-NUM-002` harden winding/holes normalization | `🌗` | geometry + core | polygon normalization, boolean engine | Clockwise/counter-clockwise and hole/even-odd inputs yield equivalent semantic results | Add winding/holes fixtures |
| `GAP-GEO-NUM-003` complete invalid-input error catalog | `🌗` | core + geometry | error model, renderer/CLI propagation | Degenerate radius/path/join/offset/tangent/split cases map to stable codes and paths | Draft negative-case catalog |
| `GAP-GEO-DET-001` prove cross-runtime determinism | `🌗` | core + parity | canonical toolchain, serializer, fixtures | Repeated process and Node 24/Flutter runs produce identical semantic snapshots and diagnostics | Restore unavailable runtime probe |
| `GAP-GEO-DET-002` close stable IDs/order/path replay | `🌗` | core + spec | graph, collections, diagnostics | IDs, operation anchors, collection order, and error paths match canonical replay | Add canonical replay comparator |
| `GAP-GEO-SER-001` publish canonical scene serialization | `🌗` | core + parity | serializer, semantic comparator | All resolved scene fields and ordering have a documented canonical representation consumed consistently by CLI/Flutter | Define schema and snapshot |
| `GAP-GEO-SER-002` establish canonical numeric/order contract | `🌗` | spec + core | serializer schema, fixtures, consumer review | Define canonical numeric/order semantics and add an executable cross-version/replay serializer test; documentation alone does not close the gap | Review source-only evidence and draft contract test |

## Candidate goal G-04 — Close semantic parity evidence

**Owner:** core + Flutter/renderer consumers  
**Dependency:** shared fixture promotion, Flutter SDK/host, semantic comparator  
**Risk:** high; current host evidence is unavailable for Flutter

| Candidate task | Source status | Owner | Dependency | Acceptance test / evidence target | Next action |
| --- | --- | --- | --- | --- | --- |
| `GAP-GEO-PARITY-001` promote TypeScript/Flutter semantic geometry | `🌗` | core + Flutter | Flutter SDK/host, shared fixtures | Reviewed fixtures 15/16 run in both runtimes and compare semantic geometry, diagnostics, and ordering | Re-run Flutter conformance on writable SDK host |
| `GAP-GEO-PARITY-002` prove semantic SVG projection | `🌗` | renderer-svg + Flutter | SVG serializer, semantic comparator | SVG semantic tree/geometry matches across consumers; raw bytes/style/viewBox remain explicitly out of contract | Add semantic SVG assertions |

## Confirmed defect and verification follow-ups

These follow-ups are intentionally separate from `🌗` implementation candidates.

| Candidate task | Current status | Owner | Dependency | Acceptance test / evidence target | Next action |
| --- | --- | --- | --- | --- | --- |
| `FIX-GEO-PROVENANCE-001` remove stale `v0.3` wording | `✔️` fixed locally | geometry | compatibility line 0.5, error-message tests | `intersection.ts` provenance and unsupported-operation wording match current 0.5 contract; regression test passes | Re-audit consumer-specific wording before removing the historical follow-up |
| `VERIFY-GEO-SER-002` establish canonical numeric/order contract | `not-verified` evidence | spec + core | serializer schema, fixtures, consumer review | After the contract task, run the independent serializer/replay test and update the implementation/evidence axes without inferring absence from unavailable runtime | Review source-only evidence and write test |

## Absent-capability rule

Current `❌` count is **0**. If a future audit discovers an expected ID with no
implementation or consumer behavior, create a row in the status matrix and a
candidate task here with:

1. the unchanged expected ID;
2. status `❌` in the matrix and source-status column here;
3. an owner and real prerequisite dependency;
4. an executable acceptance test/evidence target; and
5. a next action that does not claim the gap is fixed.

`➖` is reserved for an ownership boundary such as geometry-owned UI routes or
platform file services. It must never be used to hide an absent expected
geometry capability.

## Source links

- [Geometry status matrix](./status-matrix.md)
- [Expected geometry capability catalog](./expected-capability-catalog.md)
- [Implementation audit evidence](./archive/implementation-audit-legacy.md)
- [Reconciliation register](./reconciliation.md)
- [Geometry package README](../../../geometry/README.md)
- [Geometry package manifest](../../../geometry/package.json)
- [Maturation master plan](../../MATURATION-MASTER-PLAN.md)
- [Repository map](../../REPOSITORY-MAP.md)
- [Capability-map README](../README.md)
- [Inventory protocol](../INVENTORY-PROTOCOL.md)
- [Surface discovery ledger](../SURFACE-DISCOVERY-LEDGER.md)
- [Compatibility matrix](../../compatibility-matrix.json)
- [Fixture manifest](../../../fixtures/manifest.json)
