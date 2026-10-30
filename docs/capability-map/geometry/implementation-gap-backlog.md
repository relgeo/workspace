# Geometry implementation-gap backlog

**Tanggal:** 2026-10-30  
**Status:** candidate goal/task register; no row in this document counts as implementation  
**Source:** [geometry status matrix](./status-matrix.md)

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

## Priority and sequencing index

Priority memakai urutan `P0` (contract/defect atau parity blocker), `P1`
(high-value shared behavior and reliability), lalu `P2` (bounded coverage
expansion). Dependencies in the candidate-goal sections remain prerequisites;
the index is the review order, not a claim that any task has been started.

| Priority | Candidate IDs | Rationale |
| --- | --- | --- |
| `P0` | `FIX-GEO-PROVENANCE-001`; `GAP-GEO-SER-002`; `GAP-GEO-BOOLEAN-001`; `GAP-GEO-BOOLEAN-002`; `GAP-GEO-MEASURE-002`; `GAP-GEO-MEASURE-004`; `GAP-GEO-PARITY-001`; `GAP-GEO-PARITY-002` | Correct confirmed contract drift, establish canonical serialization, close active boolean/unit boundaries, and unblock cross-consumer parity decisions. |
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
| `FIX-GEO-PROVENANCE-001` remove stale `v0.3` wording | `⚠️` confirmed defect | geometry | compatibility line 0.5, error-message tests | `intersection.ts` provenance and unsupported-operation wording match current neutral/0.5 contract; regression test passes | Patch wording and add assertion |
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
