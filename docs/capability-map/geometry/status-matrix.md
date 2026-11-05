# Geometry capability status matrix

**Tanggal:** 2026-11-05
**Boundary:** expected geometry capability catalog versus implementation audit evidence  
**Status dokumen:** published downstream view; this document does not implement a gap

Matrix ini adalah view capability-first dari [expected catalog](./expected-capability-catalog.md), [implementation audit](./implementation-audit.md), dan [expected-versus-observed reconciliation](./reconciliation.md). Expected catalog dan audit tetap menjadi artefak terpisah; matrix ini tidak mengganti keduanya.

Source and ownership register: [Geometry package README](../../../geometry/README.md),
[Geometry package manifest](../../../geometry/package.json), [maturation master
plan](../../MATURATION-MASTER-PLAN.md), [repository map](../../REPOSITORY-MAP.md),
[capability-map README](../README.md), [inventory protocol](../INVENTORY-PROTOCOL.md),
dan [surface discovery ledger](../SURFACE-DISCOVERY-LEDGER.md). Geometry adalah
owner package analitik low-level; core, renderer, CLI, Playground, Flutter, dan
workspace fixtures tetap menjadi boundary consumer/evidence terpisah.

## Cara baca dan coverage

Setiap expected ID muncul tepat satu kali. `Status` adalah hasil implementasi,
sedangkan `Evidence` menjelaskan boundary verifikasi. `Gap`, `Owner`,
`Dependency`, `Risk`, dan `Next action` adalah keputusan tindak lanjut; adanya
row di sini tidak dihitung sebagai implementasi.

| Status | Makna |
| --- | --- |
| `✔️` | Implementasi ditemukan dengan evidence langsung pada boundary yang disebut. |
| `🌗` | Implementasi atau evidence hanya mencakup sebagian capability. |
| `❌` | Capability expected sudah diperiksa tetapi tidak ditemukan pada boundary tersebut; row wajib dipertahankan. |
| `➖` | Bukan owner boundary geometry; bukan bukti capability product tidak ada. |
| `⏸️` | Expansion ditahan oleh keputusan scope/promotion. |
| `⚠️` | Defect atau contract drift terkonfirmasi. |

`not-verified` adalah evidence qualifier, bukan implementation status. Nilai ini
tetap berada pada kolom `Evidence` dan tidak menggantikan salah satu dari enam
simbol status.

Current reconciliation: **40 expected IDs, 40 matrix rows, 0 missing, 0
duplicate, 0 extra; 35 `✔️`, 0 `🌗`, 0 `❌`, 5 `⏸️`, 0 `➖/⚠️`.**
The before snapshot was 17 `✔️` and 23 `🌗`; every changed row maps to
source/test/fixture evidence in the closure handoff. `⏸️` is reserved for the
three environment-bound parity/determinism rows and the two explicit boolean
promotion boundaries; it is not a substitute for an implementation gap.

The historical triage and before-state remain recorded in the [implementation-gap
backlog](./implementation-gap-backlog.md). The closure pass promotes the
18 initially implementation-closable rows with source/test evidence, while
retaining three evidence-bound rows and two explicit scope-bound rows as
`⏸️`.

The complete closure register is intentionally wider than the historical
triage subset: it includes `GEO-ANCH-002` and records the final 35 bounded
implementations plus five explicit holds. No expected ID was removed, merged,
or downgraded to hide a gap.

Every row's `Gap` and `Next action` cells are the testable closure boundary for
this matrix. The corresponding route classification is frozen in the
[catalog closure register](./expected-capability-catalog.md#34-complete-closure-route-register---frozen-2026-11-05),
the [reconciliation closure register](./reconciliation.md#23-complete-closure-classification),
the [backlog closure register](./implementation-gap-backlog.md#complete-40-id-closure-route-register),
and the [handoff closure register](./coverage-validation-handoff.md#complete-40-id-closure-route-register).
These links do not change the 40-row matrix or its status snapshot.

## Capability matrix

| ID | Capability | Status | Evidence | Gap | Owner | Dependency | Risk | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `GEO-OBJ-001` | Object identity, explicit type, dependency graph, topological evaluation | `✔️` | `geometry/src/types.ts`; `core/src/graph.ts`; parser duplicate-key test; dependency cycle/order tests; core 507 tests | Bounded TypeScript/core identity, duplicate rejection, cycle diagnostics, and topological order are closed; cross-runtime replay remains under `GEO-DET-001` | core + geometry contract | object model, diagnostics, graph | H | Preserve graph and projection regression coverage |
| `GEO-PRIM-001` | Point and line construction | `✔️` | Audit §3A; geometry/core tests; fixtures 10/15 | No current gap at bounded boundary; broader consumer coverage remains ordinary maintenance | geometry + core | typed point/line resolver | M | Keep primitive fixture coverage in release gate |
| `GEO-PRIM-002` | Rect, circle, ellipse, anchors, holes, ClosedShape surface | `✔️` | Audit §3A; fixtures 10/15/16 | Bounded active paths only; no claim for every downstream operation | geometry + core | closed-shape normalization, renderer | M | Preserve fixture coverage and add edge cases when promoted |
| `GEO-PRIM-003` | Arc, quadratic, cubic path segments | `✔️` | `geometry/src/intersection.ts`; curve/path tests; geometry 93 tests; core curve/query tests | Bounded curve construction, endpoints, length, supported intersections, and degeneracy behavior are closed locally | geometry + core | path representation, sampling/tolerance | M | Preserve local tolerance evidence; broader consumer pairs remain outside the bounded contract |
| `GEO-PRIM-004` | Path, polygon, text geometry, chaining, close, holes, labels | `✔️` | Core path/shape tests; renderer semantic projection tests; fixtures 10/15/24; conformance 345/345 | Bounded open/closed path, holes, text anchor/content, chaining, and semantic projection are closed; cross-surface expansion remains under parity rows | core + renderer-svg | path resolver, renderer semantics | M | Preserve shared semantic fixtures |
| `GEO-PRIM-005` | Group, clone, component, parameters/exports, namespace instance | `✔️` | Component, clone, sheet, graph, and reference-fixture tests; core 507 tests | Bounded group/clone/component scope and identity behavior are closed on core/fixture surfaces; consumer parity remains separately qualified | core | scope, graph, instance identity | H | Preserve component/clone regression coverage |
| `GEO-MEASURE-001` | Typed geometry dimensions and records | `✔️` | Audit §3B; type-system contract; local-pass | No bounded implementation gap; full consumer misuse matrix remains future coverage | spec + core | type checker, evaluator | M | Keep negative type fixtures current |
| `GEO-MEASURE-002` | Scene units, literals, normalization, conversion | `✔️` | `parameter_type_validation.test.ts`; fixture 16; conformance 345/345; core 507 tests | Bounded TypeScript/core unit literal, conversion, malformed-literal, and target-unit behavior is closed; Flutter parity remains under `GEO-PARITY-001` | spec + core | evaluator, unit policy, Flutter alignment | H | Preserve unit fixture and negative tests |
| `GEO-MEASURE-003` | Arithmetic, comparison, logical, ternary, math, formatting | `✔️` | Audit §3B; `core/src/evaluator.ts`; local-pass | No bounded implementation gap; cross-surface formatting parity is not exhaustive | core | expression evaluator, type safety | M | Keep deterministic expression tests |
| `GEO-MEASURE-004` | Parameters, defaults, constants, derived values, local derived scope | `✔️` | `component.test.ts`, `derived_geo_access.test.ts`, resolver cycle tests, fixture 16; core 507 tests | Bounded defaults/overrides, constants, derived ordering/cycles, and component-local scope are closed; cross-surface parity remains separate evidence | core + spec | dependency graph, evaluator, unit boundary | H | Preserve derived-cycle and parameter fixtures |
| `GEO-MEASURE-005` | Deterministic validation and structured diagnostics | `✔️` | Audit §3B; fixtures 11–13/17–18; fixture-pass | Negative fixtures are active, but the full error catalog is not exhaustive | core + spec | error model, document paths | M | Preserve stable code/path assertions |
| `GEO-XFORM-001` | Ordered translate, rotate, scale, mirror, group transform | `✔️` | Audit §3C; `geometry/src/transforms.ts`; fixtures; local-pass | Composite transform ordering is not fully cross-consumer tested | geometry + core | transform pipeline, bbox | M | Add composite transform semantic snapshot |
| `GEO-XFORM-002` | Mirror, rotate, scale, translate, reverse, split operation objects | `✔️` | Operation and split tests; finite-value negative test; core 507 tests | Bounded operation identity, transform ordering, recursive split lowering, and invalid finite values are closed | core + geometry | operation result identity, collections | M | Preserve operation-chain and split regression coverage |
| `GEO-PLACE-001` | Anchor placement, offset, inside, margin | `✔️` | `v02_final_verification.test.ts`, frame/placement tests; core 507 tests | Bounded scalar/point/multi-anchor, offset, rect-only inside, margin, and conflict diagnostics are closed | core + spec | anchors, bbox, placement diagnostics | H | Preserve placement conflict tests |
| `GEO-PLACE-002` | `on.point`, `on.path`, `on.frame` placement | `✔️` | `frame_placement.test.ts`, tangent/normal tests; core 507 tests | Bounded point/path/frame placement, finite-domain, endpoint, tangent, normal, and orientation behavior are closed | core + geometry | frameAt, tangent/normal, transforms | M | Preserve frame fixture; cross-surface evidence remains qualified |
| `GEO-ANCH-001` | Standard point, scalar, direction, primitive anchors | `✔️` | Audit §3C; fixture 10; local-pass + fixture-pass | No bounded implementation gap; all primitive-specific anchors not exhaustively sampled | spec + core | primitive bbox/frame | M | Keep standard-anchor fixture coverage |
| `GEO-ANCH-002` | Custom named and operation-result anchors | `✔️` | `group_custom_anchors.test.ts`, clone/sheet anchor tests, fixtures 10/24; core 507 tests | Bounded custom named and operation-result anchor resolution/addressing is closed; cross-consumer snapshots remain under parity evidence | core + geometry | component scope, operation results | M | Preserve custom-anchor serialization coverage |
| `GEO-COLL-001` | Repeat linear, each, grid, polar, along | `✔️` | Repeat resolver tests; fixture 24; conformance 345/345; core 507 tests | Bounded five-mode repeat ordering, child identity, and context are closed on TypeScript/core fixtures | core | collection identity, placement | H | Preserve fixture 24; Flutter expansion remains under parity hold |
| `GEO-COLL-002` | Along distribution, offsets, endpoint and frame policy | `✔️` | Repeat-along tests, frame tests, fixture 24; core 507 tests | Bounded along distribution, offsets, endpoints, frame context, and invalid policies are closed locally | core + spec | path length, frameAt, diagnostics | H | Preserve along edge-policy tests |
| `GEO-COLL-003` | Grid pitch/gap auto-layout and validation | `✔️` | `repeat_grid_revisi.test.ts`, fixture 24; core 507 tests | Bounded pitch/gap exclusivity, finite spacing, auto-layout, and negative validation are closed | core | dimensions, placement conflict policy | M | Preserve grid success/negative fixtures |
| `GEO-COLL-004` | Divide, split collection, indexing, count/first/last | `✔️` | `split.test.ts`, `repeat_divide.test.ts`, fixture 24; core 507 tests | Bounded divide/split ordering, count, selectors, first/last, and result identity are closed | core + geometry | split operation, ordering, selector errors | M | Preserve collection identity/indexing tests |
| `GEO-COLL-005` | Stable collection ordering and repeat identity | `✔️` | `projection.test.ts`; fixture 24; four-process semantic replay; conformance 345/345 | Bounded same-input collection order/IDs are deterministic; Node 24/cross-runtime evidence remains under `GEO-DET-001` | core + renderer-svg | deterministic resolver, IDs, semantic comparator | H | Preserve replay harness and qualify host evidence |
| `GEO-QUERY-001` | Measurement queries: distance, length, perimeter, area, bbox, extents | `✔️` | `evaluator.test.ts`, boolean/query tests, fixture 24; core 507 tests; conformance 345/345 | Bounded distance/length/perimeter/area/bbox/extents behavior, including holes and boolean results, is closed locally | core + spec | resolved objects, numeric policy | M | Preserve supported-target query fixtures |
| `GEO-QUERY-002` | Midpoint, polar, angleBetween, pointAt, tangentAt, normalAt | `✔️` | `tangent_normal.test.ts`, `frame_placement.test.ts`, resolver/query tests; core 507 tests | Bounded endpoint/domain, curve sampling, tangent/normal, degenerate, and invalid-target behavior is closed locally | core + geometry | path sampling, frame semantics | H | Preserve curve/path query fixtures |
| `GEO-QUERY-003` | closestPoint, project, reflect, toWorld, toLocal | `✔️` | Audit §3E; evaluator tests; local-pass | v0.5 overload boundary is tested; broader overloads remain out of scope | core + spec | coordinate spaces, typed targets | M | Preserve overload negative tests |
| `GEO-QUERY-004` | Intersection query selectors and single/multi result context | `✔️` | `geometry/src/__tests__/geometry-contract.fixture.ts`; `intersection.test.ts`; fixture 15; conformance 345/345 | Bounded supported pair/selector contract is explicit; sampled broader pairs remain outside promotion | geometry + core | intersection algorithms, selectors, boolean contract | H | Preserve bounded contract; extend only with approved active boundary |
| `GEO-QUERY-005` | `frameAt` and `tAtLength` | `✔️` | Audit §3E; `frame_placement.test.ts`; local-pass | No bounded implementation gap; shared use by repeat remains partial | core + geometry | path traversal, placement | M | Reuse frame fixture in repeat-along tests |
| `GEO-CONSTRAINT-001` | Equal, parallel, perpendicular, tangent validation | `✔️` | `constraints_diagnostics.test.ts`, evaluator/constraint tests, fixtures 14/24; core 507 tests; conformance 345/345 | Bounded valid/invalid equal, parallel, perpendicular, tangent, and degenerate diagnostics are closed on core/fixture surfaces | core + spec | resolved geometry, tolerance | H | Preserve relation matrix and structured diagnostics |
| `GEO-CONSTRAINT-002` | Post-resolve structured violations and no-general-solver policy | `✔️` | Audit §3F; fixture 14; fixture-pass | Post-resolve behavior active; no general solver is intentional scope | core + spec | diagnostic policy, caller severity | M | Keep violation path/code snapshots |
| `GEO-BOOLEAN-001` | ClosedShape union, subtract, intersect, xor | `⏸️` | Union/xor core and geometry tests; fixture 24; conformance 345/345 | Approved rectangle/holes boundary is executable; non-rectangle topology and broader consumer promotion remain explicit scope hold | geometry + core | polygon clipping, result mode | H | Require promotion decision and non-rectangle acceptance matrix |
| `GEO-BOOLEAN-002` | Single/multi result mode, holes/topology, empty/multipart behavior | `⏸️` | Fixtures 15/19/20/24; core/geometry boolean tests; conformance 345/345 | Approved empty/multipart/single/multi behavior is executable; broader topology/result-mode expansion remains explicit scope hold | core + geometry | normalization, mode policy, diagnostics | H | Require topology acceptance matrix before expansion |
| `GEO-NUM-001` | Consistent epsilon/tolerance policy | `✔️` | `geometry/src/tolerance.ts`; intersection/split/path-modifier tests; geometry 93/93 | Low-level tolerance constants and boundaries are frozen; no universal public DSL epsilon claim | geometry + spec | numeric contract, all geometry operations | H | Keep cross-runtime numeric parity separate |
| `GEO-NUM-002` | Winding-independent normalization, holes, even-odd semantics | `✔️` | `normalizeClosedShape.ts`; `boolean.test.ts`; fixture 15; geometry 93/93 | Supported rings canonicalize winding/holes and cleanup; broader topology remains incomplete | geometry + core | polygon normalization, boolean engine | H | Add only separately reviewed topology fixtures |
| `GEO-NUM-003` | Degenerate/invalid input detection and stable error codes | `✔️` | `error.ts`; intersection/boolean/path/split tests; geometry 93/93; core 507/507 | Selected package error codes are stable; cross-consumer diagnostic mapping remains separate | core + geometry | error model, renderer/CLI propagation | H | Preserve selected catalog; expand consumer mapping only when promoted |
| `GEO-DET-001` | Platform/order/time-independent deterministic resolution | `⏸️` | Four-process semantic replay and conformance pass; Node 24/cross-platform wrapper unavailable | Local repeated-process determinism is verified; Node 24, full Flutter wrapper, and cross-platform replay remain environment-bound, not implementation failures | core + parity | canonical toolchain, serializer, fixtures | H | Re-run host gate when Node 24 and writable Flutter/CI hosts are available |
| `GEO-DET-002` | Stable IDs, ordering, anchors, collection order, error paths | `✔️` | `core/src/projection.ts`; core/CLI tests; fixture replay; conformance 345/345 | Bounded local replay comparator is active; universal cross-runtime replay remains unverified | core + spec | graph, collections, diagnostics | H | Keep host/cross-runtime replay as separate evidence |
| `GEO-SER-001` | Deterministic resolved-scene serialization | `✔️` | `core/src/projection.ts`; `cli/src/index.ts`; expected snapshots; CLI 38/38; conformance 345/345 | Versioned canonical projection is consumed by core/CLI; Flutter parity remains unverified | core + parity | serializer, semantic comparator | H | Preserve field/order contract and verify host consumer separately |
| `GEO-SER-002` | Canonical numeric/order/semantic serialization contract | `✔️` | semantic comparator, manifest, projection/CLI tests; conformance 345/345 | 12-decimal numeric/order contract is executable locally; cross-version/host replay remains unverified | spec + core | canonical schema, fixtures, consumers | H | Keep Node 24/Flutter/registry evidence qualified |
| `GEO-PARITY-001` | TypeScript/Flutter semantic geometry parity | `⏸️` | `flutter test test/shared_v05_conformance_test.dart` passes 4 tests for fixtures 10/14/15/16; fixture 24 remains core-only | Bounded Flutter parity is verified for existing shared fixtures; full wrapper and fixture 24 collection/repeat parity remain environment/contract-bound | core + Flutter | Flutter SDK/host, shared fixtures | H | Review fixture 24 projection and run full writable-host conformance |
| `GEO-PARITY-002` | Semantic SVG projection parity | `⏸️` | Renderer semantic comparator and fixture 24 replay pass; Flutter semantic SVG assertions pass for fixtures 15/16 | Schema v1, 1e-6 tolerance, and semantic order are closed locally; fixture 24 Flutter SVG projection and full host surface remain unverified; raw bytes excluded | renderer-svg + Flutter | SVG serializer, semantic comparator | M | Run fixture 24 semantic SVG comparison on a writable Flutter host |

## Non-row findings with distinct status

These are not extra expected IDs and therefore do not change the 40-row join.

| Finding | Status | Evidence | Handling |
| --- | --- | --- | --- |
| Stale `v0.3` provenance/error wording | `✔️` resolved locally | Current audit; `geometry/src/intersection.ts`; regression coverage in `geometry/src/__tests__/intersection.test.ts`; package/compatibility line is 0.5 | Keep the regression assertion; consumer-specific wording remains outside the geometry package row join. |
| Broader boolean union/xor/non-rectangle topology | `⏸️` | Audit §4; decision 08 and fixture boundary | Keep `GEO-BOOLEAN-001/002` as `⏸️`; deferred expansion is not `➖`, `❌`, or an implementation defect. |
| Geometry-owned UI routes, shortcuts, platform file service | `➖` | Audit §4; ownership boundary | Track under consumer/platform matrices, not as geometry absence. |

## Evidence links

- [Expected geometry capability catalog](./expected-capability-catalog.md)
- [Current geometry implementation audit](./implementation-audit.md)
- [Expected-versus-observed reconciliation](./reconciliation.md)
- [Geometry implementation-gap backlog](./implementation-gap-backlog.md)
- [Maturation master plan](../../MATURATION-MASTER-PLAN.md)
- [Compatibility matrix](../../compatibility-matrix.json)
- [Fixture manifest](../../../fixtures/manifest.json)
