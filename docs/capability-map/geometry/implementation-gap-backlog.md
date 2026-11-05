# Geometry implementation-gap backlog

**Tanggal:** 2026-11-05
**Status:** candidate goal/task register; implemented bounded rows are retained as handoff evidence, not as broader parity claims
**Source:** [geometry status matrix](./status-matrix.md)

The expected catalog, audit, matrix, and this backlog are synchronized for the
2026-11-05 closure refresh: 40 expected IDs, 35 `✔️`, 0 `🌗`, 0 `❌`, and 5
explicit `⏸️` holds. The historical 17/23 snapshot remains visible below;
current route rows preserve owner, dependency, acceptance evidence, and the
remaining scope/evidence boundary.

Backlog ini mempertahankan setiap capability yang pernah berstatus `🌗` atau
`❌` sebagai kandidat pekerjaan yang dapat ditugaskan, sekaligus menyimpan
maintenance route untuk capability yang sudah tertutup. Status `❌` saat ini
berjumlah nol, tetapi aturan retention tetap eksplisit: expected ID yang benar-benar tidak
memiliki implementation/consumer behavior harus masuk ke backlog dengan status
`❌`, bukan dihapus atau dipetakan menjadi `➖`. Evidence `not-verified`
dipisahkan sebagai verification task, bukan implementation claim. Pada reconciliation saat ini
`GEO-SER-002` kini `✔️ implemented` pada bounded local contract; cross-runtime
Node 24/Flutter/registry evidence tetap follow-up `not-verified` dan tidak
mengubah local implementation result.

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

## Prior bounded selection — task `bound-geometry-gap-scope-and-contract--3423449309`

This was the bounded selection for the prior geometry-repository task. It is
an implementation/evidence scope decision, not a claim that any gap is closed
and not a request to publish a new package. The active IDs are
`GAP-GEO-QUERY-004`, `GAP-GEO-NUM-001/002/003`, `GAP-GEO-DET-002`, and
`GAP-GEO-SER-001/002`. Selection preserves the active RelGeo DSL `0.5.x`
contract, keeps broader boolean promotion deferred, and records host-owned
parity as excluded. The status in the second column is copied from the status
matrix/audit; selection does not promote any row to `✔️`.

| Selected task | Source status | Owner | Source-of-truth and implementation path | Contract boundary | Explicit acceptance behavior |
| --- | --- | --- | --- | --- | --- |
| `FIX-GEO-PROVENANCE-001` remove stale `v0.3` wording | `✔️` locally implemented | geometry | Normative: `spec/id/core/06-error-model.md`; package: `geometry/src/intersection.ts`; tests: `geometry/src/__tests__/intersection.test.ts`; compatibility: `geometry/package.json` | Intersection package diagnostics and provenance strings only. Do not redefine the DSL error taxonomy or core diagnostic mapping. | No exported intersection error mentions `v0.3`; unsupported pairs retain a stable, actionable error; a package regression test proves the wording. |
| `GAP-GEO-QUERY-004` publish the bounded intersection pair/selector contract | `✔️ locally implemented` | geometry (lead), core (consumer dependency) | Normative: `spec/id/geometry/20-geometry-queries.md` §20.18 and `spec/id/core/06-error-model.md` §6.2; package: `geometry/src/intersection.ts`; tests: `geometry/src/__tests__/geometry-contract.fixture.ts`, `intersection.test.ts`; conformance: 298/298 | `computeIntersections` pair dispatch, deterministic ordering/deduplication, and `applySelector` behavior for currently supported low-level object pairs. Core owns DSL query parsing and diagnostic projection. No new pair or deferred boolean promotion is implied. | Supported-pair and selector cases pass local geometry/core/fixture evidence; broader sampled paths remain outside promotion. |
| `GAP-GEO-NUM-001` define the low-level tolerance/error-bound policy | `✔️ locally implemented` | geometry (implementation), spec (contract review) | Normative: `spec/id/core/05-semantic-guarantees.md` §5.5 and `spec/id/geometry/14-geometry-objects.md`; package: `geometry/src/intersection.ts`, `geometry/src/split.ts`, `geometry/src/path-modifiers.ts`, `geometry/src/boolean/normalizeClosedShape.ts`; tests: geometry 88/88 | Numeric equality, membership, sampling cleanup, and split/modifier tolerances used by the low-level package. This does not publish a universal DSL epsilon or claim cross-runtime parity. | Tolerance constants and boundary tests are locally executable; cross-runtime numeric parity remains out of scope. |
| `GAP-GEO-NUM-002` harden winding/holes normalization | `✔️ locally implemented` | geometry (lead), core (operation consumer) | Normative: `spec/id/core/05-semantic-guarantees.md` §5.5; package: `geometry/src/boolean/normalizeClosedShape.ts`, `geometry/src/boolean/ClipperBooleanEngine.ts`; tests: `geometry/src/__tests__/boolean.test.ts`; fixture 15 snapshot | Closed-shape normalization before the existing boolean engine, including ring cleanup, winding-independent inputs, and hole preservation. Deferred union/xor/non-rectangle promotion remains out of scope. | Canonical fixture removes duplicate closing points while preserving bounded rectangle intersect/subtract semantics and holes. |
| `GAP-GEO-NUM-003` complete the low-level invalid-input error catalog | `✔️ locally implemented` | geometry (implementation), core (diagnostic consumer) | Normative: `spec/id/core/06-error-model.md` §§6.2–6.9; package: `geometry/src/error.ts`, `geometry/src/path-modifiers.ts`, `geometry/src/split.ts`, `geometry/src/intersection.ts`; tests: geometry 88/88; core 452/452 | Stable package-level error codes for invalid corner/offset/split and unsupported intersection operations. Core remains responsible for mapping package failures into document paths and public DSL diagnostics. | Selected low-level invalid branches have stable codes and negative tests; broader cross-consumer diagnostic catalog remains a separate consumer concern. |
| `GAP-GEO-DET-002` freeze stable identity/order/path replay | `✔️` locally implemented | core + spec (geometry evidence dependency) | Normative: `spec/id/core/05-semantic-guarantees.md` §§5.1–5.4; package/fixture: `geometry/src/__tests__/geometry-contract.fixture.ts`; consumer: `core/src/resolver/` | Stable IDs, dependency order, selector order, operation anchors, collection order, and diagnostic paths are replay requirements. This task does not claim cross-runtime or host parity. | `core/src/projection.ts` exports `compareResolvedSceneReplay`; core and CLI tests compare repeated canonical snapshots. Resolver/host replay remains a separate verification boundary. |
| `GAP-GEO-SER-001` freeze resolved-scene semantic projection shape | `✔️` locally implemented | core + parity consumer dependency | Normative: `spec/id/core/05-semantic-guarantees.md` §5.7; implementation: `core/src/projection.ts`; tests: `core/src/__tests__/projection.test.ts`; CLI: `cli/src/index.ts` | The JSON projection is renderer-neutral semantic data with explicit schema/version/compatibility, order arrays, canonical object maps, and diagnostics. It is not an internal object dump. | Core exports the projection and serializer; CLI JSON output consumes `serializeResolvedScene`. Flutter consumption and parity evidence remain outside this task. |
| `GAP-GEO-SER-002` freeze canonical numeric/order serialization rules | `✔️` locally implemented | spec + core | Normative: `spec/id/core/05-semantic-guarantees.md` §5.7; implementation: `core/src/projection.ts`; tests: `core/src/__tests__/projection.test.ts`, `cli/src/__tests__/cli.test.ts`; fixture: `fixtures/manifest.json` | Numbers are finite, rounded to 12 decimal places, normalize `-0` to `0`, object keys are sorted, semantic arrays retain order, and undefined object fields are omitted. This is a same-runtime canonical contract, not cross-runtime proof. | Manifest and executable tests freeze the schema/order/numeric rules; Node-24, Flutter, registry, and host parity remain explicitly unverified/owned outside this task. |

### Deliberately excluded from active implementation

The following are retained as candidate or scope findings, but are not part of
this task's active implementation set:

| Excluded item | Status | Reason |
| --- | --- | --- |
| Broader boolean union/xor/non-rectangle topology (`GEO-BOOLEAN-001/002`) | `⏸️` finding over `🌗` rows | The existing decision and fixture boundary hold this expansion; preserve fixture 15 rather than treating the held expansion as active work. |
| Geometry-owned UI routes, shortcuts, and platform file service | `➖` | These belong to consumer/platform surfaces, not `geometry/`; no geometry task is created for them. |
| Cross-runtime evaluator/unit parity (`GEO-MEASURE-002/004`), host-owned determinism (`GEO-DET-001`), and Flutter/semantic-SVG parity (`GEO-PARITY-001/002`) | `🌗` with `not-verified` or consumer dependency | The bounded TypeScript/core unit and parameter work is implementation-closable in the current triage; Flutter, Node 24, and host parity remain external evidence follow-up. |
| Core-owned collections, placement, constraints, and high-level query implementation | `➖` boundary or `🌗` consumer-owned row | Geometry may provide primitives, but this selection does not duplicate or reassign core ownership. |

## Triage decision — task `triage-remaining-geometry-gaps--9052928134`

**Tanggal triage:** 2026-11-04

**Initial status:** status implementation/evidence saat triage, disalin dari
status matrix dan reconciliation; bukan klaim bahwa gap sudah ditutup.

Triage ini memilih semua gap P0/P1 yang dapat ditindaklanjuti, sekaligus
menaikkan tiga primitive yang sebelumnya tercatat P2 karena acceptance-nya dapat
dikerjakan pada checkout ini. `implementation-closable` berarti perubahan
source dan executable test dapat dibuat tanpa menunggu release npm/pub.dev,
host OS/SDK, atau keputusan scope baru. Evidence lintas runtime dicatat
terpisah, dan scope-deferred tidak dibuat menjadi implementation task.

Ringkasan keputusan: **17 implementation-closable**, **3 external-evidence-only**,
dan **2 scope-deferred**.

### Gap implementation-closable

| ID | Priority | Owner | Source of truth | Acceptance test | Initial status | Next action |
| --- | --- | --- | --- | --- | --- | --- |
| `GEO-OBJ-001` | P1 | core + geometry contract | `spec/id/geometry/13-object-model.md`; `spec/id/core/04-evaluation-order.md`; `core/src/graph.ts` | Duplicate/cycle/identity fixture menghasilkan stable IDs, dependency order, dan document paths pada dua replay | `🌗 partial` | Tambahkan fixture graph dan canonical JSON comparator |
| `GEO-PRIM-003` | P1 (promoted from P2) | geometry + core | `spec/id/geometry/14-geometry-objects.md` §§14.6–14.8; `core/src/resolver/primitives/shapes.ts` | Arc/quadratic/cubic construction, endpoint, length, dan supported intersection snapshots lulus dengan tolerance | `🌗 partial` | Enumerasi pair kurva dan tambahkan fixture shared |
| `GEO-PRIM-004` | P1 (promoted from P2) | core + renderer-svg | `spec/id/geometry/14-geometry-objects.md` §§14.9–14.11; core resolver; renderer semantic projection | Open/closed path, chaining, holes, dan label placement menghasilkan projection semantic yang stabil | `🌗 partial` | Tambahkan fixture path/holes/label lintas core dan renderer |
| `GEO-PRIM-005` | P1 (promoted from P2) | core | `spec/id/geometry/15-composition-objects.md` §§15.1–15.3; core scope/graph | Group/clone/component dengan parameter, export, dan namespace instance mempertahankan identity serta local scope | `🌗 partial` | Tambahkan component/clone scope fixture |
| `GEO-MEASURE-002` | P0 | spec + core | `spec/id/syntax/07-type-system.md`; `fixtures/manifest.json` fixture `v05-evaluator-units-candidate`; evaluator/unit policy | `mm`, `cm`, `m`, `in`, dan `px` menghasilkan scene semantic ekuivalen serta invalid context menghasilkan diagnostic stabil; Flutter parity tetap follow-up | `🌗 partial` | Bekukan local unit boundary dan tambahkan semantic snapshots |
| `GEO-MEASURE-004` | P0 | core + spec | `spec/id/syntax/08-parameters.md`, `09-constants.md`, `10-derived.md`; core dependency graph/evaluator | Defaults, structured params, constants, derived cycles, dan component-local derived scope menghasilkan nilai/diagnostic stabil | `🌗 partial` | Tambahkan parameter/derived scope fixture |
| `GEO-XFORM-002` | P1 | core + geometry | `spec/id/geometry/15-composition-objects.md` §15.4; operation resolver; `geometry/src/split.ts` | Chained mirror/rotate/scale/translate/reverse/split memiliki result identity, reference, dan snapshot stabil | `🌗 partial` | Tambahkan operation-chain fixture |
| `GEO-PLACE-001` | P1 | core | `spec/id/geometry/17-placement.md`; anchors/bbox/placement diagnostics | Scalar/point/multi-anchor, offset, inside/margin, dan conflict menghasilkan result/error eksplisit | `🌗 partial` | Tambahkan placement conflict matrix |
| `GEO-PLACE-002` | P1 | core + geometry | `spec/id/geometry/17-placement.md`; `frameAt`, tangent/normal, transform contract | `on.point`, `on.path`, dan `on.frame` setuju pada point/orientation untuk fixture yang sama | `🌗 partial` | Extend frame placement fixture |
| `GEO-COLL-001` | P1 | core | `spec/id/geometry/19-collections.md`; `core/src/resolver/primitives/repeat.ts`; fixture 24 | Core fixture now exercises each/grid/polar/along with stable child identity; cross-consumer replay remains open | `🌗 partial` | Add consumer replay evidence |
| `GEO-COLL-002` | P1 | core + spec | `spec/id/geometry/19-collections.md`; path length/frame policy | Uniform length/t, fixed distance, offsets, endpoint, frame, dan conflict policy memiliki expected result/error | `🌗 partial` | Tulis edge-policy table dan fixture |
| `GEO-COLL-003` | P1 | core | `spec/id/geometry/19-collections.md`; repeat/grid resolver | Pitch/gap exclusivity, auto-layout, dan over-constraint diagnostics lulus negative fixtures | `🌗 partial` | Tambahkan grid validation fixtures |
| `GEO-COLL-004` | P1 | core + geometry | `spec/id/geometry/16-collection-objects.md`, `19-collections.md`; `geometry/src/split.ts` | Divide/split mempertahankan traversal order, count, first/last, selector, dan result identity | `🌗 partial` | Tambahkan collection snapshots |
| `GEO-COLL-005` | P1 | core | `spec/id/core/05-semantic-guarantees.md`; deterministic resolver/projection | Repeated-process replay menghasilkan collection order dan repeat IDs yang identik | `🌗 partial` | Tambahkan replay harness |
| `GEO-QUERY-001` | P1 | core + spec | `spec/id/geometry/20-geometry-queries.md`; `core/src/evaluator.ts`; fixture 24 | Boolean perimeter/bbox and hole-aware area/perimeter are executable; complete primitive matrix remains open | `🌗 partial` | Extend supported primitive/query matrix |
| `GEO-QUERY-002` | P1 | core + geometry | `spec/id/geometry/20-geometry-queries.md`; path sampling/frame semantics | Midpoint/polar/angleBetween/pointAt/tangentAt/normalAt lulus endpoint, curve, dan out-of-range cases | `🌗 partial` | Tambahkan curve query fixture |
| `GEO-CONSTRAINT-001` | P1 | core + spec | `spec/id/geometry/21-constraints.md`; `core/src/resolver/constraints.ts`; `core/src/__tests__/constraints_diagnostics.test.ts` | Valid relation matrix plus invalid/degenerate diagnostics are stable in core | `🌗 partial` | Add consumer/tolerance evidence |

### External evidence-only atau scope-deferred

| ID | Priority | Decision | Owner / source of truth | Acceptance evidence | Initial status | Next action |
| --- | --- | --- | --- | --- | --- | --- |
| `GEO-DET-001` | P1 | external-evidence-only | core + parity; `spec/id/core/05-semantic-guarantees.md`; canonical fixtures | Repeated process plus Node 24/Flutter/host replay menghasilkan semantic snapshots dan diagnostics identik | `🌗 partial` | Jalankan saat runtime/host tersedia; tidak menjadi blocker local implementation |
| `GEO-PARITY-001` | P0 | external-evidence-only | core + Flutter; `fixtures/manifest.json`; `docs/plans/06-flutter-alignment.md` dan `07-flutter-capability-promotion-and-svg-parity.md` | Reviewed fixtures 15/16 dibandingkan pada TypeScript dan Flutter untuk geometry, diagnostics, dan ordering; fixture 24 belum dipromosikan ke Flutter | `🌗 partial` | Review collection/repeat projection fixture 24, lalu jalankan Flutter conformance; jangan mengubah status global hanya dari local TypeScript replay |
| `GEO-PARITY-002` | P0 | external-evidence-only | renderer-svg + Flutter; manifest SVG semantic contract; semantic SVG policy pada `docs/plans/06-flutter-alignment.md` | Semantic SVG tree/geometry compares with schema v1, 1e-6 tolerance, and preserved order; raw bytes/style/viewBox tetap di luar contract | `🌗 partial` | Tambahkan semantic SVG assertions saat consumer host tersedia; fixture 24 TypeScript replay sudah lokal |
| `GEO-BOOLEAN-001` | P0 | geometry + core | `spec/id/geometry/16-collection-objects.md`; fixtures 15/24; geometry/core boolean tests | Union/xor rectangle topology is executable locally; non-rectangle and cross-consumer promotion remains separately deferred | `🌗 partial` | Preserve deferred boundary and add only approved topology |
| `GEO-BOOLEAN-002` | P0 | core + geometry | `spec/id/core/06-error-model.md`; fixtures 15/19/20/24 | Empty/multipart/single/multi and holes are executable locally; broader topology matrix remains deferred | `🌗 partial` | Preserve explicit result-mode errors and deferred boundary |

## Locked contract and acceptance matrix — task `lock-geometry-contracts-and-acceptance--9052928134`

**Compatibility guard:** contract aktif tetap RelGeo DSL `0.5`; public package
line tetap `0.5.x`. Normative source tetap `spec/id`; perubahan breaking tidak
boleh diselipkan ke task ini dan memerlukan decision record sesuai
[`docs/compatibility-matrix.json`](../../compatibility-matrix.json).

Matrix berikut mengunci perilaku yang akan diuji sebelum implementasi. Kolom
`Success behavior` mendefinisikan hasil normal, `Failure / edge behavior`
mendefinisikan rejection atau boundary yang wajib stabil, dan `Expected
evidence` menyebut bukti executable atau evidence host yang diperlukan. Tidak
ada row di bawah yang mengubah public syntax/API; semua perubahan tetap harus
ditelusuri kembali ke normative source dan minimum discovery categories pada
[`INVENTORY-PROTOCOL.md`](../INVENTORY-PROTOCOL.md).

| ID | Contract boundary | Success behavior | Failure / edge behavior | Expected evidence |
| --- | --- | --- | --- | --- |
| `GEO-OBJ-001` | Identity unik per document; typed object graph dan topological evaluation pada core/geometry boundary | Reference valid resolve dalam dependency order yang sama pada replay | Duplicate ID, unknown reference, dan cycle menghasilkan diagnostic path/code stabil; parse order tidak mengubah hasil | Core graph tests, duplicate/cycle fixture, dua canonical projection replay |
| `GEO-PRIM-003` | Arc, quadratic, cubic sebagai typed path segments sesuai `spec/id/geometry/14-geometry-objects.md` §§14.6–14.8 | Construction mempertahankan endpoint, traversal, length, dan supported intersection semantics | Degenerate arc, invalid control data, atau unsupported pair ditolak dengan error/tolerance boundary stabil | Geometry/core curve tests, length/endpoint/intersection snapshots, negative cases |
| `GEO-PRIM-004` | Open/closed path, polygon, text, chaining, holes, dan label semantic projection; renderer tidak mengambil alih DSL semantics | Path chain dan close menghasilkan geometry semantic yang dapat dirender; holes dan label placement diproyeksikan stabil | Malformed chain, invalid close/path-ref, invalid hole, atau label input menghasilkan diagnostic stabil; raw SVG bytes bukan contract | Core resolver + renderer semantic fixture untuk open/closed, holes, chaining, labels |
| `GEO-PRIM-005` | Group/clone/component scope, parameters/exports, dan namespace instance pada core graph | Reuse mempertahankan local scope; clone/component memperoleh identity dan exports yang dapat dirujuk | Duplicate export, unknown parameter, namespace collision, atau scope leak ditolak dengan path stabil | Component/clone fixture, parameter-scope diagnostics, repeated projection |
| `GEO-MEASURE-002` | Bounded TypeScript/core unit literal, normalization, dan conversion untuk `mm`, `cm`, `m`, `in`, `px`; no broad implicit coercion | Equivalent unit inputs menghasilkan equivalent semantic scene dan valid length contexts | Unknown unit, dimension mismatch, invalid context, atau non-finite conversion menghasilkan diagnostic stabil; Flutter parity tetap external evidence | `v05-evaluator-units-candidate`, core evaluator tests, canonical semantic snapshots |
| `GEO-MEASURE-004` | Typed parameters, defaults, constants, derived values, dan component-local derived scope | Defaults/overrides propagate deterministically ke dependent geometry | Missing required value, type mismatch, derived cycle, dan local-to-global scope leak ditolak dengan diagnostic stabil | Parameter/derived scope fixture, cycle negative case, repeated evaluator snapshot |
| `GEO-XFORM-002` | Operation-result nodes untuk mirror/rotate/scale/translate/reverse/split; result menjadi dependency baru | Chained operations preserve result identity, anchors, order, dan references | Invalid target, unsupported operation, degenerate split, atau invalid selector menghasilkan stable error; no silent identity replacement | Operation-chain fixture, split negative tests, core/geometry semantic projection |
| `GEO-PLACE-001` | Anchor-based scalar/point/multi-anchor placement, offset, `inside`, dan margin pada core | Valid placement menghasilkan explicit point/transform dan preserves dimensions | Missing anchor, non-rect `inside`, conflicting margin/offset, atau out-of-bound placement menghasilkan explicit diagnostic | Placement conflict matrix, inside/margin fixture, diagnostic path assertions |
| `GEO-PLACE-002` | `on.point`, `on.path`, dan `on.frame` share frame/tangent/normal semantics | Same fixture yields equivalent point/orientation across placement consumers | Path out-of-range, degenerate tangent/normal, invalid frame, atau missing path menghasilkan stable error | Frame placement fixture, endpoint/out-of-range cases, core/geometry comparison |
| `GEO-COLL-001` | Repeat modes linear, each, grid, polar, along with stable index/context | Each supported mode produces ordered collection with deterministic index/context | Invalid count, missing placement context, or incompatible mode fields produces diagnostic; no partial silent collection | Five-mode shared conformance fixture and collection projection snapshots |
| `GEO-COLL-002` | Along distribution policies: uniform length/t, fixed distance, offsets, endpoint, frame | Selected policy places members deterministically along open/closed path | Conflicting policies, zero-length path, invalid offset, or out-of-range endpoint produces explicit error | Edge-policy table, open/closed path fixtures, conflict negatives |
| `GEO-COLL-003` | Grid pitch/gap exclusivity, auto-layout, and over-constraint policy | Valid pitch/gap or auto-layout produces deterministic rows/columns | Both pitch and gap where mutually exclusive, negative dimensions, or over-constraint yields stable diagnostic | Grid validation fixtures and negative assertions |
| `GEO-COLL-004` | Divide/split collection ordering, count, selectors, first/last, and result identity | Split results retain traversal order and stable references | Invalid count, out-of-range split, unsplittable target, or selector mismatch yields stable error | Collection snapshots, split boundary tests, selector assertions |
| `GEO-COLL-005` | Repeated-process collection order and repeat identity are canonical semantic data | Same input across repeated processes yields byte-stable canonical collection projection | Any order/ID drift is a determinism regression; cross-runtime proof remains separate | Replay harness, canonical projection comparator, repeat-ID fixture |
| `GEO-QUERY-001` | Measurement queries distance, length, perimeter, area, bbox, extents over supported resolved targets | Supported primitive targets return typed finite values with deterministic rounding/projection | Unsupported target, wrong dimension, unresolved reference, or invalid collection context yields stable diagnostic | Query coverage fixture for every supported primitive and invalid targets |
| `GEO-QUERY-002` | Path/vector queries midpoint, polar, angleBetween, pointAt, tangentAt, normalAt | Endpoints, curves, and normal traversal return deterministic typed results | Out-of-range parameter, degenerate path, invalid vector, or unsupported target yields stable error | Curve/path query fixture, endpoint and out-of-range negative cases |
| `GEO-CONSTRAINT-001` | Post-resolve validation for equal, parallel, perpendicular, tangent; no general solver | Valid relation emits no violation; invalid relation emits structured violation | Wrong geometry type, degenerate input, or tolerance boundary emits stable violation/error without mutating geometry | Four relation valid/invalid fixtures, stable code/path assertions |
| `GEO-DET-001` | Cross-process/cross-runtime determinism as evidence boundary, not a new local API | Repeated process plus available Node 24/Flutter/host runs match semantic scenes and diagnostics | Missing runtime/host is `not-verified`, not implementation failure; snapshot mismatch is reported as parity defect | Canonical fixture replay and named host/runtime evidence when available |
| `GEO-PARITY-001` | Semantic TypeScript/Flutter comparison for reviewed shared fixtures only | Reviewed fixture geometry, diagnostics, and ordering match across consumers | Missing Flutter SDK/host is `not-verified`; mismatch is consumer parity failure; raw SVG bytes are irrelevant | Shared fixtures 15/16, semantic comparator, Flutter host evidence |
| `GEO-PARITY-002` | Semantic SVG tree/geometry parity; presentation bytes/style/viewBox excluded | Consumer projections agree on semantic object paths, geometry, and anchors | Host unavailable is `not-verified`; raw byte/style/viewBox differences are not failures of this contract | Renderer/Flutter semantic SVG assertions and host comparison evidence |
| `GEO-BOOLEAN-001` | Current active boolean boundary remains fixture 15 intersect/subtract; broader union/xor/non-rectangle promotion is held | Existing approved intersect/subtract behavior remains stable | New topology is not accepted or implemented until promotion decision; do not infer parity from engine methods | Fixture 15 snapshots plus explicit deferred finding; no new public contract |
| `GEO-BOOLEAN-002` | Current empty/multipart and single/multi behavior remains bounded by fixtures 15/19/20 | Existing mode/error behavior stays stable within approved boundary | Broader topology/result-mode matrix remains deferred; ambiguous result must not silently coerce | Fixtures 15/19/20 and decision record before any expansion |

### Contract-change rule

The implementation task may add tests, fixtures, internal helpers, and
patch-compatible behavior inside the existing `0.5.x` line. It may not add a
new public syntax form, rename public diagnostics, broaden boolean promotion,
or claim Flutter/Node 24/registry parity without updating the normative source,
compatibility decision record, and evidence register first. This rule follows
the inventory protocol's separation of contract, implementation, evidence,
scope, and delivery boundaries.

### Implementation evidence recorded — 2026-11-04

The first implementation slice closes a concrete low-level weakness without
promoting the capability status by documentation alone:

| Change | Source/test evidence | Boundary kept |
| --- | --- | --- |
| Adaptive quadratic/cubic curve flattening for intersection dispatch | `geometry/src/intersection.ts` replaces fixed coarse curve samples with bounded de Casteljau subdivision; `geometry/src/__tests__/geometry-contract.fixture.ts` adds tolerance-bounded quadratic/cubic cases, while `intersection.test.ts` adds direct success and degenerate-curve cases; `pnpm test` passes 5 files/91 tests; `pnpm lint` and `pnpm run build` pass | Existing intersection pair list and RelGeo DSL `0.5` error contract remain unchanged; no union/xor, Flutter, Node 24, registry, or raw-SVG parity claim is made |

### Implementation evidence extension — 2026-11-04

| Capability | Source/test evidence | Boundary kept |
| --- | --- | --- |
| `GEO-PRIM-005` / `GEO-MEASURE-004` component-local parameter scope | `core/src/resolver/primitives/component.ts` now topologically evaluates component parameter defaults and instance overrides against the component-local scope; `core/src/validator.ts` recognizes declared component parameter/derived names only while validating `objects.<id>.params`; `core/src/__tests__/component.test.ts` adds a reverse-declared dependency fixture (`base → width → height`) and verifies stable resolved dimensions. Core suite passes 48 files/470 tests and lint. | No new syntax or export rule is introduced; undeclared identifiers remain invalid, component-local values remain non-global, and the change does not claim Flutter/Node 24/registry parity. |
| `GEO-QUERY-002` path/vector query boundary | `core/src/evaluator.ts` validates `t` for `pointAt`, `tangentAt`, and `normalAt` as finite and within `[0,1]`; zero-length tangent/normal targets now produce `TANGENT_NOT_FOUND` instead of a fabricated unit vector. `core/src/__tests__/tangent_normal.test.ts` adds out-of-range/non-finite and degenerate-path fixtures; core suite passes 48 files/472 tests and lint. | Existing endpoint and in-range sampling remain unchanged; no new public error code or cross-runtime parity claim is introduced. |
| `GEO-COLL-002` closed-path along distribution | `core/src/resolver/primitives/repeat.ts` now uses endpoint-excluding `uniform-t` spacing for closed targets, matching the existing `uniform-length` policy; `core/src/__tests__/repeat_divide.test.ts` adds a four-item closed polygon fixture proving stable traversal without a duplicated start point. Targeted core run passes 48 files/473 tests. | Open-path `uniform-t` remains endpoint-inclusive; fixed-distance behavior and cross-runtime replay remain separate evidence boundaries. |
| `GEO-CONSTRAINT-001` relation degeneracy handling | `core/src/resolver/constraints.ts` now rejects zero-length/non-finite lines for parallel/perpendicular and degenerate line/target radii for tangent with structured violations; `core/src/__tests__/constraints_diagnostics.test.ts` adds parallel and tangent degeneracy fixtures. Core suite passes 48 files/474 tests and lint. | This is post-resolve validation only; no general constraint solver, geometry mutation, or cross-runtime parity claim is made. |
| `GEO-MEASURE-002` typed unit literal boundary | `core/src/validator.ts` now shares a strict length-literal grammar for typed `length` and `point` values, including the supported `in` unit and rejecting malformed numeric forms; `core/src/__tests__/parameter_type_validation.test.ts` adds inch and malformed-literal fixtures. Core suite passes 48 files/476 tests and lint. | Existing unit normalization and legacy untyped string handling remain unchanged; Flutter/platform parity is still external evidence. |
| `GEO-PLACE-001` inside placement boundary | `core/src/resolver/primitives/utils.ts` now requires `place.inside` targets to be resolved rects and rejects negative/non-finite margins with existing structured error handling; `core/src/__tests__/v02_final_verification.test.ts` adds non-rect and negative-margin negatives. Core suite passes 48 files/477 tests and lint. | Child dimensions remain unchanged and valid rect placement stays backward-compatible; broader renderer/consumer parity is not claimed. |
| `GEO-QUERY-001` closed-shape hole measurements | `core/src/evaluator.ts` now subtracts resolved hole areas and adds hole boundary lengths for rect/circle/ellipse/polygon/path queries; boolean area is also supported from resolved loops. `core/src/__tests__/evaluator.test.ts` adds a 100×100 panel with a 20×20 hole and asserts area/perimeter. Core suite passes 48 files/478 tests and lint. | Approximation policy for curved segments remains unchanged; unsupported/open targets still reject through the existing evaluator boundary. |
| `GEO-OBJ-001` canonical cycle diagnostics | `core/src/graph.ts` now rotates detected dependency cycles to the lexicographically smallest node before emitting the existing `CIRCULAR_DEPENDENCY` diagnostic; `core/src/__tests__/dependency_v03.test.ts` verifies identical paths for two declaration orders. | Duplicate-key parsing and cross-runtime replay remain separate evidence boundaries; no public identity syntax changes. |
| `GEO-XFORM-002` finite operation boundary | `core/src/resolver/primitives/operation.ts` now rejects non-finite transform components/origins with structured `INVALID_VALUE` errors before publishing an operation node; `core/src/__tests__/resolver.test.ts` adds an infinite-translation negative fixture. | Chaining and transform ordering remain backward-compatible; no new operation syntax or solver behavior is introduced. |
| `GEO-COLL-003` runtime grid spacing boundary | `core/src/resolver/primitives/repeat.ts` now rejects non-finite/negative pitch and non-finite/negative gap values even when resolver validation is bypassed; `core/src/__tests__/repeat_grid_revisi.test.ts` adds editor-mode negative pitch and infinite gap cases. | Existing pitch/gap exclusivity and auto-layout conflict diagnostics remain unchanged; no new collection syntax is introduced. |
| `GEO-COLL-001` polar radius boundary | `core/src/resolver/primitives/repeat.ts` now rejects non-positive/non-finite polar radius values at runtime; `core/src/__tests__/repeat_divide.test.ts` adds an editor-mode negative-radius fixture. | Polar ordering, index/context variables, and valid positive-radius placement remain unchanged. |
| `GEO-COLL-004` divide count boundary | `core/src/resolver/primitives/divide.ts` now requires finite positive integer counts instead of rounding fractional values or accepting infinity; `core/src/__tests__/repeat_divide.test.ts` adds fractional and infinite editor-mode negatives. | Existing open/closed traversal endpoint policy and collection identity remain unchanged. |
| `GEO-COLL-002` along offset boundary | `core/src/resolver/primitives/repeat.ts` now rejects negative/non-finite `startOffset` and `endOffset`, and rejects offsets that leave a negative usable path length; `core/src/__tests__/repeat_divide.test.ts` adds a negative-offset editor-mode regression. The core suite passes 48 files/484 tests. | Valid offsets and existing spacing formulas remain unchanged; this does not claim fixed-distance replay or cross-runtime parity. |
| `GEO-XFORM-002` chained split lowering | `core/src/resolver/primitives/operation.ts` now recursively lowers nested translate/rotate/scale/mirror/reverse targets before applying the outer transform, so `split` can consume a transformed operation chain; `core/src/__tests__/split.test.ts` covers translate→rotate→split. Core suite passes 48 files/485 tests. | Transform order and split tolerance remain unchanged; closed-path splitting and cross-consumer parity remain outside this slice. |
| `GEO-PRIM-004` text placement semantic projection | `core/src/resolver/primitives/shapes.ts` now applies the normative `center` implicit text anchor for v0.5 while preserving legacy pre-v0.5 `topLeft`; `core/src/__tests__/v02_preview.test.ts` covers both lines. `renderer-svg/src/semantic.ts` now projects text `content` and `anchor` alongside its measured box, covered by `semantic_projection.test.ts`. | The SVG semantic schema version remains 1 and added values are backward-compatible; glyph metrics and raw SVG presentation remain renderer-owned. |
| `GEO-PLACE-002` finite frame parameter boundary | `core/src/evaluator.ts` now rejects non-finite `frameAt` parameters before clamping; `core/src/__tests__/frame_placement.test.ts` supplies an infinite parameter through the scalar context and asserts `FRAME_RESOLUTION_FAILED`. Core suite passes 48 files/487 tests. | Valid endpoint/interior frame placement remains unchanged; path/frame consumer parity is still separate evidence. |
| `GEO-PRIM-004` point-authored closed-ring projection | `renderer-svg/src/semantic.ts` now derives a closed `rings` entry from normalized `points` when a closed path/polygon/boolean has no resolved segments (or an empty segment list), preserving the explicit closing edge. `renderer-svg/src/__tests__/semantic_projection.test.ts` covers the four-point square; renderer suite passes 7 files/92 tests and lint. | Resolved segment rings retain their existing projection; this does not reconstruct curves or claim raw-SVG/Flutter parity. |
| `GEO-COLL-005` stable collection replay | `core/src/resolver/primitives/repeat.ts` centralizes repeat child IDs as coordinate-based identities; `core/src/__tests__/projection.test.ts` resolves an identical repeat document twice and asserts stable child order, IDs, and canonical scene serialization. Core suite passes 48 files/488 tests and lint. | Local same-input replay is covered; cross-runtime and unavailable Node 24/Flutter process evidence remains `not-verified`. |

This evidence advances the implementation slices for `GEO-PRIM-003`,
`GEO-PRIM-005`, and `GEO-MEASURE-004`; the
remaining core/consumer acceptance rows stay pending their own source and
fixture changes.

### Consumer and artifact verification handoff — 2026-11-04

The local consumer boundary now has executable evidence: geometry 91 tests,
core 488 tests, renderer-svg 92 tests, CLI 36 tests, Playground 104 tests,
docs-site 138 generated pages with zero Astro diagnostics, and shared
conformance 298/298. These are local-workspace or fixture-pass observations;
they do not promote the remaining `🌗` rows to complete.

The declared cross-repo integration gate was attempted with
`pnpm run integration:gate -- --local --report=.local/geometry-consumer-integration-local.json`
and stopped before consumer stages because Node `22.23.2` is below the Node
`>=24` contract. Fresh Playground artifact assembly also exposed a baseline
provenance drift (`c7cec4b…` current versus `47fd715…` pinned), so the artifact
checker remains qualified rather than a public/deployment pass. CI-current,
public-registry, Flutter/native-host, and cross-runtime evidence remain
`not-verified` with next actions recorded in the coverage handoff and
reconciliation.

No `➖` item is an active implementation task. The five `⏸️` rows are explicit
scope/evidence holds, not a way to hide implementation gaps. No current
expected capability is `❌`; if a later audit finds a true absence, its
unchanged ID and `❌` status must be added explicitly before it can be selected.

## Complete 40-ID closure route register

The triage and locked acceptance tables above are detailed work views. This
register is the backlog's complete one-to-one handoff: bounded rows are kept as
maintenance evidence, source-closed rows are marked implemented,
cross-surface evidence holds remain explicit, and boolean expansion remains an
explicit scope boundary. Every expected ID is present once in this register;
none is removed, merged, or silently downgraded. Its complete route totals are
35 bounded implementations and five explicit holds (two scope-held and three
evidence-held); the earlier 17-row triage is retained only as a before snapshot.

| ID | Current status | Closure route | Backlog handoff / testable boundary |
| --- | --- | --- | --- |
| `GEO-OBJ-001` | `✔️` | bounded implementation | Graph identity/duplicate/cycle fixture and canonical replay |
| `GEO-PRIM-001` | `✔️` | bounded implementation | Maintain point/line fixture and typed rejection tests |
| `GEO-PRIM-002` | `✔️` | bounded implementation | Maintain ClosedShape/holes fixture and normalization tests |
| `GEO-PRIM-003` | `✔️` | bounded implementation | Curve endpoint/length/intersection and degeneracy fixture |
| `GEO-PRIM-004` | `✔️` | bounded implementation | Open/closed path, holes, chaining, and label semantic fixture |
| `GEO-PRIM-005` | `✔️` | bounded implementation | Component/clone/export scope and namespace diagnostics |
| `GEO-MEASURE-001` | `✔️` | bounded implementation | Maintain typed-dimension negative matrix |
| `GEO-MEASURE-002` | `✔️` | bounded implementation | Unit normalization/conversion, fixture 16, malformed-context negatives |
| `GEO-MEASURE-003` | `✔️` | bounded implementation | Maintain deterministic evaluator expression tests |
| `GEO-MEASURE-004` | `✔️` | bounded implementation | Parameter/default/derived-cycle and local-scope fixture |
| `GEO-MEASURE-005` | `✔️` | bounded implementation | Maintain invalid fixture code/path assertions |
| `GEO-XFORM-001` | `✔️` | bounded implementation | Maintain ordered transform semantic snapshot |
| `GEO-XFORM-002` | `✔️` | bounded implementation | Chained operation/split identity and finite-value negatives |
| `GEO-PLACE-001` | `✔️` | bounded implementation | Anchor/offset/inside/margin conflict matrix |
| `GEO-PLACE-002` | `✔️` | bounded implementation | point/path/frame endpoint and degenerate fixture |
| `GEO-ANCH-001` | `✔️` | bounded implementation | Maintain standard-anchor fixture 10 coverage |
| `GEO-ANCH-002` | `✔️` | bounded implementation | Custom/result-anchor serialization and renderer fixture |
| `GEO-COLL-001` | `✔️` | bounded implementation | Five repeat-mode shared conformance fixture |
| `GEO-COLL-002` | `✔️` | bounded implementation | Along policy, offset, endpoint, and conflict edge matrix |
| `GEO-COLL-003` | `✔️` | bounded implementation | Grid pitch/gap and over-constraint success/negative fixtures |
| `GEO-COLL-004` | `✔️` | bounded implementation | Divide/split order, count, selector, and identity snapshots |
| `GEO-COLL-005` | `✔️` | bounded implementation | Repeat ID/order replay harness and host follow-up |
| `GEO-QUERY-001` | `✔️` | bounded implementation | Measurement query coverage by supported primitive and invalid target |
| `GEO-QUERY-002` | `✔️` | bounded implementation | Curve/path endpoint, domain, and tangent/normal fixture |
| `GEO-QUERY-003` | `✔️` | bounded implementation | Maintain v0.5 overload and wrong-target negatives |
| `GEO-QUERY-004` | `✔️` | bounded implementation | Preserve supported pair/selector contract and fixture 15 |
| `GEO-QUERY-005` | `✔️` | bounded implementation | Reuse frame/tLength checks in repeat consumer |
| `GEO-CONSTRAINT-001` | `✔️` | bounded implementation | Four relation valid/invalid/degenerate fixture matrix |
| `GEO-CONSTRAINT-002` | `✔️` | bounded implementation | Maintain fixture 14 violation path/code snapshots |
| `GEO-BOOLEAN-001` | `⏸️` | scope-held | Preserve fixture 15; require promotion decision for union/xor/topology |
| `GEO-BOOLEAN-002` | `⏸️` | scope-held | Preserve fixtures 15/19/20; defer broader result-mode matrix |
| `GEO-NUM-001` | `✔️` | bounded implementation | Maintain operation-specific tolerance tests |
| `GEO-NUM-002` | `✔️` | bounded implementation | Maintain winding/holes normalization and fixture 15 |
| `GEO-NUM-003` | `✔️` | bounded implementation | Maintain stable low-level error-code negatives |
| `GEO-DET-001` | `⏸️` | evidence-held | Named repeated-process, Node 24, Flutter, and host replay evidence |
| `GEO-DET-002` | `✔️` | bounded implementation | Maintain local projection/CLI replay comparator |
| `GEO-SER-001` | `✔️` | bounded implementation | Maintain versioned core/CLI semantic projection snapshots |
| `GEO-SER-002` | `✔️` | bounded implementation | Maintain manifest numeric/order/undefined serialization checks |
| `GEO-PARITY-001` | `⏸️` | evidence-held | Reviewed fixture 15/16 TypeScript–Flutter semantic comparator |
| `GEO-PARITY-002` | `⏸️` | evidence-held | Semantic SVG tree/geometry/anchor host comparison |

The route register records the verified current status. `not-verified` and
deferred scope remain visible qualifiers and are never treated as green
implementation evidence.

## Priority and sequencing index

Priority memakai urutan `P0` (contract/defect atau parity blocker), `P1`
(high-value shared behavior and reliability), lalu `P2` (bounded coverage
expansion). Dependencies in the candidate-goal sections remain prerequisites;
the index is the review order, not a claim that any task has been started.

| Priority | Candidate IDs | Rationale |
| --- | --- | --- |
| `P0` | `GAP-GEO-BOOLEAN-001`; `GAP-GEO-BOOLEAN-002`; `GAP-GEO-MEASURE-002`; `GAP-GEO-MEASURE-004`; `GAP-GEO-PARITY-001`; `GAP-GEO-PARITY-002` | Establish remaining boolean/unit boundaries and unblock cross-consumer parity decisions. Canonical local serialization is implemented; the provenance defect is resolved locally and remains only as a follow-up record. |
| `P1` | `GAP-GEO-OBJ-001`; `GAP-GEO-PRIM-003`; `GAP-GEO-PRIM-004`; `GAP-GEO-PRIM-005`; `GAP-GEO-XFORM-002`; `GAP-GEO-PLACE-001`; `GAP-GEO-PLACE-002`; `GAP-GEO-COLL-001`; `GAP-GEO-COLL-002`; `GAP-GEO-COLL-003`; `GAP-GEO-COLL-004`; `GAP-GEO-COLL-005`; `GAP-GEO-QUERY-001`; `GAP-GEO-QUERY-002`; `GAP-GEO-CONSTRAINT-001`; `GAP-GEO-DET-001` | Close remaining high-value gaps in identity, bounded primitive/placement/collection/query/constraint behavior, plus the separate determinism evidence gate. |
| `P2` | `GAP-GEO-ANCH-002` | Expand custom-anchor coverage after shared contract foundations are stable. |

The index contains one candidate ID for every historical `🌗`/`❌` row plus the
confirmed defect. Current `⏸️` rows remain explicit in the closure route register.
`VERIFY-GEO-SER-002` is intentionally omitted from the
implementation priority index because it is evidence-only follow-up.

## Historical candidate goals retained for traceability

The candidate goals below are the pre-closure planning view. They remain useful
for provenance and future expansion, but they are not the current status or an
assertion that the rows are still `🌗`.

### Candidate goal G-01 — Close object, primitive, transform, placement, anchor semantics

**Owner:** geometry + core  
**Dependency:** object graph, typed diagnostics, path/frame contract  
**Risk:** high for identity/placement; medium for primitive coverage

| Candidate task | Source status | Owner | Dependency | Acceptance test / evidence target | Next action |
| --- | --- | --- | --- | --- | --- |
| `GAP-GEO-OBJ-001` close identity and graph contract | `🌗` — bounded local slice implemented | core | object model, graph, diagnostics | Duplicate/cycle/identity fixture yields stable IDs, dependency order, and document paths across two runs | Preserve local cycle evidence; add cross-consumer identity evidence |
| `GAP-GEO-PRIM-003` promote curve segment behavior | `🌗` — bounded local slice implemented | geometry + core | path representation, sampling/tolerance | Arc/quadratic/cubic construction, length, endpoint, and intersection snapshots pass | Preserve local tolerance evidence; enumerate reviewed cross-consumer pairs |
| `GAP-GEO-PRIM-004` close path/polygon/text projection | `🌗` — bounded local slice implemented | core + renderer-svg | path resolver, holes, labels | Open/closed path, holes, chaining, and label semantic projection pass in core and renderer | Add reviewed shared holes/label fixture and parity evidence |
| `GAP-GEO-PRIM-005` close composition identity/scope | `🌗` — bounded local slice implemented | core | scope, graph, component exports | Group/clone/component parameter and namespace cases preserve identity and local scope | Preserve component scope evidence; add clone/export identity fixture |
| `GAP-GEO-XFORM-002` close operation-result semantics | `🌗` — bounded local slice implemented | core + geometry | operation result identity, collections | Chained mirror/rotate/scale/translate/reverse/split results have stable references and snapshots | Add reviewed closed-path/result-identity consumer fixture |
| `GAP-GEO-PLACE-001` close anchor/inside placement | `🌗` — bounded local slice implemented | core | anchors, bbox, placement diagnostics | Scalar/point/multi-anchor, offset, inside/margin, and conflict cases have explicit results/errors | Add reviewed placement conflict matrix |
| `GAP-GEO-PLACE-002` close path/frame placement parity | `🌗` — bounded local slice implemented | core + geometry | frameAt, tangent/normal, transforms | `on.point`, `on.path`, and `on.frame` agree on point/orientation across consumers | Extend frame fixture on Node 24/native consumer boundary |
| `GAP-GEO-ANCH-002` close custom/result anchors | `🌗` | core + geometry | component scope, operation results | Custom anchors serialize and render with stable names after component and operation use | Add anchor snapshot |

### Candidate goal G-02 — Promote dimensions, collections, queries, constraints

**Owner:** spec + core  
**Dependency:** evaluator, typed dimensions, path traversal, diagnostics  
**Risk:** high for units/collections/queries; medium for validation-only rows

| Candidate task | Source status | Owner | Dependency | Acceptance test / evidence target | Next action |
| --- | --- | --- | --- | --- | --- |
| `GAP-GEO-MEASURE-002` promote unit semantics | `🌗` — bounded local slice implemented | spec + core | evaluator, unit policy, Flutter alignment | mm/cm/m/in/px literals normalize to equivalent semantic scenes and reject invalid contexts consistently | Verify normalization/parity on declared runtime and host boundaries |
| `GAP-GEO-MEASURE-004` close parameter/derived scope | `🌗` — bounded local slice implemented | core + spec | dependency graph, evaluator, unit boundary | Defaults, structured params, constants, derived cycles, and component-local derived values match expected diagnostics | Add derived-cycle and cross-consumer parameter fixture |
| `GAP-GEO-COLL-001` complete repeat mode matrix | `🌗` — bounded local slice implemented | core | collection identity, placement | linear/each/grid/polar/along each pass shared conformance with stable index/context | Add reviewed shared mode fixtures |
| `GAP-GEO-COLL-002` close along distribution policies | `🌗` — bounded local slice implemented | core + spec | path length, frameAt, diagnostics | Uniform length/t, fixed distance, offsets, endpoint, frame, and conflict cases are explicit | Add fixed-distance/conflict matrix |
| `GAP-GEO-COLL-003` close grid pitch/gap validation | `🌗` — bounded local slice implemented | core | dimensions, placement conflict policy | Pitch/gap exclusivity, auto-layout, and over-constraint diagnostics pass | Preserve negative fixtures; add shared grid fixture |
| `GAP-GEO-COLL-004` close divide/split collection semantics | `🌗` — bounded local slice implemented | core + geometry | split operation, ordering, selectors | Divide and split preserve traversal order, count, first/last, and result identity | Add reviewed collection identity/indexing fixture |
| `GAP-GEO-COLL-005` prove stable collection replay | `🌗` — bounded local slice implemented | core | deterministic resolver, IDs | Repeated-process replay produces identical collection order and repeat IDs | Re-run on Node 24/host runtimes before parity promotion |
| `GAP-GEO-QUERY-001` complete measurement query coverage | `🌗` — bounded local slice implemented | core + spec | resolved objects, numeric policy | distance/length/perimeter/area/bbox/extents pass for every supported primitive and invalid target | Extend reviewed query coverage by supported primitive |
| `GAP-GEO-QUERY-002` close path/vector query boundaries | `🌗` — bounded local slice implemented | core + geometry | path sampling, frame semantics | midpoint/polar/angleBetween/pointAt/tangentAt/normalAt pass endpoints, curves, and out-of-range cases | Add reviewed curve/path fixture and host consumer evidence |
| `GAP-GEO-QUERY-004` publish intersection pair/selector contract | `✔️ locally implemented` | geometry + core | intersection algorithms, selectors, boolean contract | Supported pair table, selector errors, deterministic first/last/nearest/farthest/index, and single/multi results pass | Preserve bounded pair matrix; do not promote deferred pairs |
| `GAP-GEO-CONSTRAINT-001` complete relation validation | `🌗` — bounded local slice implemented | core + spec | resolved geometry, tolerance | equal/parallel/perpendicular/tangent valid and invalid fixtures emit stable violations | Add complete relation-kind fixture matrix and consumer evidence |

### Candidate goal G-03 — Harden boolean, numeric, deterministic, and serialization contracts

**Owner:** geometry + core  
**Dependency:** polygon clipping, normalization, error model, canonical serializer  
**Risk:** high

| Candidate task | Source status | Owner | Dependency | Acceptance test / evidence target | Next action |
| --- | --- | --- | --- | --- | --- |
| `GAP-GEO-BOOLEAN-001` promote boolean operation coverage | `🌗` | geometry + core | polygon clipping, result mode | Reviewed union/xor/non-rectangle cases pass with explicit topology and cross-consumer snapshots | Separate promotion fixture from active fixture 15 |
| `GAP-GEO-BOOLEAN-002` close topology/result-mode errors | `🌗` | core + geometry | normalization, mode policy, diagnostics | single/multi, holes, empty, and multipart behavior have stable expected outcomes | Add topology acceptance matrix |
| `GAP-GEO-NUM-001` define tolerance/error-bound policy | `✔️ locally implemented` | geometry + spec | numeric contract, operations | Supported operations document tolerance behavior and pass near-equality/membership cases without raw-float dependence | Preserve low-level policy; keep cross-runtime parity separate |
| `GAP-GEO-NUM-002` harden winding/holes normalization | `✔️ locally implemented` | geometry + core | polygon normalization, boolean engine | Clockwise/counter-clockwise and hole/even-odd inputs yield equivalent semantic results | Preserve bounded normalization; defer broader topology |
| `GAP-GEO-NUM-003` complete invalid-input error catalog | `✔️ locally implemented` | core + geometry | error model, renderer/CLI propagation | Degenerate radius/path/join/offset/tangent/split cases map to stable codes and paths | Preserve selected package codes; extend consumer mapping only when promoted |
| `GAP-GEO-DET-001` prove cross-runtime determinism | `🌗` | core + parity | canonical toolchain, serializer, fixtures | Repeated process and Node 24/Flutter runs produce identical semantic snapshots and diagnostics | Restore unavailable runtime probe |
| `GAP-GEO-DET-002` close stable IDs/order/path replay | `✔️ locally implemented` | core + spec | graph, collections, diagnostics | IDs, operation anchors, collection order, and error paths match canonical replay | Preserve local comparator; keep host replay separate |
| `GAP-GEO-SER-001` publish canonical scene serialization | `✔️ locally implemented` | core + parity | serializer, semantic comparator | All resolved scene fields and ordering have a documented canonical representation consumed consistently by core/CLI | Preserve core/CLI contract; Flutter parity remains not-verified |
| `GAP-GEO-SER-002` establish canonical numeric/order contract | `✔️ locally implemented` | spec + core | serializer schema, fixtures, consumer review | Define canonical numeric/order semantics and add an executable replay serializer test; documentation alone does not close the gap | Preserve local contract; keep Node 24/Flutter/registry evidence separate |

### Candidate goal G-04 — Close semantic parity evidence

**Owner:** core + Flutter/renderer consumers  
**Dependency:** shared fixture promotion, Flutter SDK/host, semantic comparator  
**Risk:** high; fixture 24 collection/repeat projection is not yet verified on Flutter

| Candidate task | Source status | Owner | Dependency | Acceptance test / evidence target | Next action |
| --- | --- | --- | --- | --- | --- |
| `GAP-GEO-PARITY-001` promote TypeScript/Flutter semantic geometry | `🌗` | core + Flutter | Flutter SDK/host, shared fixtures | Reviewed fixtures 15/16 run in both runtimes and compare semantic geometry, diagnostics, and ordering; fixture 24 remains core-only | Review and run fixture 24 conformance on Flutter |
| `GAP-GEO-PARITY-002` prove semantic SVG projection | `🌗` | renderer-svg + Flutter | SVG serializer, semantic comparator | SVG semantic tree/geometry matches across consumers; comparator uses 1e-6 tolerance and raw bytes/style/viewBox remain explicitly out of contract | Add fixture 24 semantic SVG assertions on Flutter |

## Confirmed defect and verification follow-ups

These follow-ups are intentionally separate from `🌗` implementation candidates.

| Candidate task | Current status | Owner | Dependency | Acceptance test / evidence target | Next action |
| --- | --- | --- | --- | --- | --- |
| `FIX-GEO-PROVENANCE-001` remove stale `v0.3` wording | `✔️` fixed locally | geometry | compatibility line 0.5, error-message tests | `intersection.ts` provenance and unsupported-operation wording match current 0.5 contract; regression test passes | Re-audit consumer-specific wording before removing the historical follow-up |
| `VERIFY-GEO-SER-002` establish canonical numeric/order contract | `✔️ local evidence resolved; host parity not-verified` | spec + core | serializer schema, fixtures, consumer review | Local serializer/replay contract is verified; keep Node 24/Flutter/registry/host replay as independent evidence | Re-run only when the host/runtime boundary becomes available |

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
