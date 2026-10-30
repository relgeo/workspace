# Geometry capability status matrix

**Tanggal:** 2026-10-30  
**Boundary:** expected geometry capability catalog versus implementation audit evidence  
**Status dokumen:** published downstream view; this document does not implement a gap

Matrix ini adalah view capability-first dari [expected catalog](./expected-capability-catalog.md), [implementation audit](./archive/implementation-audit-legacy.md), dan [expected-versus-observed reconciliation](./reconciliation.md). Expected catalog dan audit tetap menjadi artefak terpisah; matrix ini tidak mengganti keduanya.

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
duplicate, 0 extra; 10 `✔️`, 30 `🌗`, 0 `❌`, 0 row `➖/⏸️/⚠️`.**
`➖`, `⏸️`, dan `⚠️` tetap tercatat pada findings scope/defect di bawah agar
status tidak hilang hanya karena bukan row hasil join. Jika audit berikutnya
menemukan expected capability tanpa implementation/consumer behavior, gunakan ID
yang sama dan tambahkan row `❌` ke matrix serta backlog; jangan ubah menjadi
`➖`.

## Capability matrix

| ID | Capability | Status | Evidence | Gap | Owner | Dependency | Risk | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `GEO-OBJ-001` | Object identity, explicit type, dependency graph, topological evaluation | `🌗` | Audit §3A; `geometry/src/types.ts`; `core/src/graph.ts`; local-pass | Graph/evaluation exists, but full identity and cycle contract is not closed across consumers | core + geometry contract | object model, diagnostics, graph | H | Add duplicate/cycle/identity fixture and compare JSON paths |
| `GEO-PRIM-001` | Point and line construction | `✔️` | Audit §3A; geometry/core tests; fixtures 10/15 | No current gap at bounded boundary; broader consumer coverage remains ordinary maintenance | geometry + core | typed point/line resolver | M | Keep primitive fixture coverage in release gate |
| `GEO-PRIM-002` | Rect, circle, ellipse, anchors, holes, ClosedShape surface | `✔️` | Audit §3A; fixtures 10/15/16 | Bounded active paths only; no claim for every downstream operation | geometry + core | closed-shape normalization, renderer | M | Preserve fixture coverage and add edge cases when promoted |
| `GEO-PRIM-003` | Arc, quadratic, cubic path segments | `🌗` | Audit §3A; `core/src/resolver/primitives/shapes.ts`; local-pass | Construction exists, but downstream sampled operations are bounded | geometry + core | path representation, sampling/tolerance | M | Add curve intersection/length fixture with tolerance assertions |
| `GEO-PRIM-004` | Path, polygon, text geometry, chaining, close, holes, labels | `🌗` | Audit §3A; core/renderer construction; fixture 10 | High-level construction exists, but complete path/label/holes parity is not evidenced | core + renderer-svg | path resolver, renderer semantics | M | Add closed/open path, holes, and label projection fixture |
| `GEO-PRIM-005` | Group, clone, component, parameters/exports, namespace instance | `🌗` | Audit §3A; fixtures 5–7 | Composition semantics are core-owned and only sampled in current evidence | core | scope, graph, instance identity | H | Add component/clone identity and parameter-scope conformance cases |
| `GEO-MEASURE-001` | Typed geometry dimensions and records | `✔️` | Audit §3B; type-system contract; local-pass | No bounded implementation gap; full consumer misuse matrix remains future coverage | spec + core | type checker, evaluator | M | Keep negative type fixtures current |
| `GEO-MEASURE-002` | Scene units, literals, normalization, conversion | `🌗` | Audit §3B; fixture 16; local-pass | Unit candidate is not promoted as a complete cross-surface contract | spec + core | evaluator, unit policy, Flutter alignment | H | Decide promotion boundary and add mm/cm/in/px semantic snapshots |
| `GEO-MEASURE-003` | Arithmetic, comparison, logical, ternary, math, formatting | `✔️` | Audit §3B; `core/src/evaluator.ts`; local-pass | No bounded implementation gap; cross-surface formatting parity is not exhaustive | core | expression evaluator, type safety | M | Keep deterministic expression tests |
| `GEO-MEASURE-004` | Parameters, defaults, constants, derived values, local derived scope | `🌗` | Audit §3B; fixture 16; local-pass | Evaluator and unit parity are not fully active across consumers | core + spec | dependency graph, evaluator, unit boundary | H | Add parameter/derived cycle and component-local scope fixture |
| `GEO-MEASURE-005` | Deterministic validation and structured diagnostics | `✔️` | Audit §3B; fixtures 11–13/17–18; fixture-pass | Negative fixtures are active, but the full error catalog is not exhaustive | core + spec | error model, document paths | M | Preserve stable code/path assertions |
| `GEO-XFORM-001` | Ordered translate, rotate, scale, mirror, group transform | `✔️` | Audit §3C; `geometry/src/transforms.ts`; fixtures; local-pass | Composite transform ordering is not fully cross-consumer tested | geometry + core | transform pipeline, bbox | M | Add composite transform semantic snapshot |
| `GEO-XFORM-002` | Mirror, rotate, scale, translate, reverse, split operation objects | `🌗` | Audit §3C; split/operation tests; local-pass | Operation objects dispatch, but full result/consumer matrix is absent | core + geometry | operation result identity, collections | M | Add operation chain fixture and result identity assertions |
| `GEO-PLACE-001` | Anchor placement, offset, inside, margin | `🌗` | Audit §3C; fixture 10; local-pass | `inside` and conflict variants lack active shared coverage | core + spec | anchors, bbox, placement diagnostics | H | Add inside/margin/conflict fixture |
| `GEO-PLACE-002` | `on.point`, `on.path`, `on.frame` placement | `🌗` | Audit §3C; `frame_placement.test.ts`; local-pass | Point/path/frame exists, but broader semantic parity is not promoted | core + geometry | frameAt, tangent/normal, transforms | M | Add path orientation and frame consumer snapshots |
| `GEO-ANCH-001` | Standard point, scalar, direction, primitive anchors | `✔️` | Audit §3C; fixture 10; local-pass + fixture-pass | No bounded implementation gap; all primitive-specific anchors not exhaustively sampled | spec + core | primitive bbox/frame | M | Keep standard-anchor fixture coverage |
| `GEO-ANCH-002` | Custom named and operation-result anchors | `🌗` | Audit §3C; `group_custom_anchors.test.ts`; local-pass | Custom anchors exist, but cross-consumer snapshots are incomplete | core + geometry | component scope, operation results | M | Add custom-anchor serialization and renderer fixture |
| `GEO-COLL-001` | Repeat linear, each, grid, polar, along | `🌗` | Audit §3D; `core/src/resolver/primitives/repeat.ts`; local-pass | Repeat exists, but complete mode matrix lacks shared fixture | core | collection identity, placement | H | Add one conformance fixture per repeat mode |
| `GEO-COLL-002` | Along distribution, offsets, endpoint and frame policy | `🌗` | Audit §3D; repeat-along example; local-pass | Edge policies and conflicting placement behavior are incomplete | core + spec | path length, frameAt, diagnostics | H | Add closed/open path and conflict matrix |
| `GEO-COLL-003` | Grid pitch/gap auto-layout and validation | `🌗` | Audit §3D; core repeat/grid tests; local-pass | Grid behavior exists without complete cross-consumer contract | core | dimensions, placement conflict policy | M | Add pitch/gap/mutual-exclusion fixture |
| `GEO-COLL-004` | Divide, split collection, indexing, count/first/last | `🌗` | Audit §3D; `geometry/src/split.ts`; local-pass | Divide/split exist, but public collection semantics remain core-owned | core + geometry | split operation, ordering, selector errors | M | Add collection identity and indexing snapshots |
| `GEO-COLL-005` | Stable collection ordering and repeat identity | `🌗` | Audit §3D; collection/intersection ordering tests; local-pass | Stable ordering is observed in tested paths, not universal replay | core | deterministic resolver, IDs | H | Run repeated-process replay fixture |
| `GEO-QUERY-001` | Measurement queries: distance, length, perimeter, area, bbox, extents | `🌗` | Audit §3E; `core/src/evaluator.ts`; fixture-pass | High-level query service is core-owned; geometry low-level evidence is bounded | core + spec | resolved objects, numeric policy | M | Add query coverage for every supported primitive |
| `GEO-QUERY-002` | Midpoint, polar, angleBetween, pointAt, tangentAt, normalAt | `🌗` | Audit §3E; evaluator/frame tests; local-pass | Query branches exist, but broad path/tolerance coverage is incomplete | core + geometry | path sampling, frame semantics | H | Add curve/path query fixture with endpoint policy |
| `GEO-QUERY-003` | closestPoint, project, reflect, toWorld, toLocal | `✔️` | Audit §3E; evaluator tests; local-pass | v0.5 overload boundary is tested; broader overloads remain out of scope | core + spec | coordinate spaces, typed targets | M | Preserve overload negative tests |
| `GEO-QUERY-004` | Intersection query selectors and single/multi result context | `🌗` | Audit §3E; fixture 15; local-pass + fixture-pass | Line-line and bounded fixture active; broader pairs are partial | geometry + core | intersection algorithms, selectors, boolean contract | H | Publish supported-pair table and add pair fixtures |
| `GEO-QUERY-005` | `frameAt` and `tAtLength` | `✔️` | Audit §3E; `frame_placement.test.ts`; local-pass | No bounded implementation gap; shared use by repeat remains partial | core + geometry | path traversal, placement | M | Reuse frame fixture in repeat-along tests |
| `GEO-CONSTRAINT-001` | Equal, parallel, perpendicular, tangent validation | `🌗` | Audit §3F; `core/src/resolver/constraints.ts`; fixture-pass | Constraint evaluation exists, but coverage of all relation types is incomplete | core + spec | resolved geometry, tolerance | H | Add one valid/invalid fixture per constraint kind |
| `GEO-CONSTRAINT-002` | Post-resolve structured violations and no-general-solver policy | `✔️` | Audit §3F; fixture 14; fixture-pass | Post-resolve behavior active; no general solver is intentional scope | core + spec | diagnostic policy, caller severity | M | Keep violation path/code snapshots |
| `GEO-BOOLEAN-001` | ClosedShape union, subtract, intersect, xor | `🌗` | Audit §3G; `geometry/src/boolean/`; fixture 15 | Engine exposes four ops, but active evidence is rectangle intersect/subtract | geometry + core | polygon clipping, result mode | H | Add separately reviewed union/xor and non-rectangle fixtures |
| `GEO-BOOLEAN-002` | Single/multi result mode, holes/topology, empty/multipart behavior | `🌗` | Audit §3G; fixtures 15/19/20; fixture-pass | Empty/multipart errors active; broader topology remains deferred/candidate | core + geometry | normalization, mode policy, diagnostics | H | Add holes/multipart topology acceptance matrix |
| `GEO-NUM-001` | Consistent epsilon/tolerance policy | `🌗` | Audit §3H; intersection/path tests; local-pass | Tolerance exists as implementation behavior without complete public error bound | geometry + spec | numeric contract, all geometry operations | H | Define supported tolerance/error-bound policy |
| `GEO-NUM-002` | Winding-independent normalization, holes, even-odd semantics | `🌗` | Audit §3H; `normalizeClosedShape.ts`; local-pass | Normalization exists for supported shapes; edge coverage incomplete | geometry + core | polygon normalization, boolean engine | H | Add clockwise/counter-clockwise and holes fixtures |
| `GEO-NUM-003` | Degenerate/invalid input detection and stable error codes | `🌗` | Audit §3H; error tests; fixtures 19/20; fixture-pass | Several invalid boundaries are explicit; complete error catalog is missing | core + geometry | error model, renderer/CLI propagation | H | Publish negative-case catalog and cross-consumer assertions |
| `GEO-DET-001` | Platform/order/time-independent deterministic resolution | `🌗` | Audit §3H; conformance snapshots; local-pass + fixture-pass | Local determinism observed; Node 24, Flutter, and cross-platform replay unverified | core + parity | canonical toolchain, serializer, fixtures | H | Run repeated-process and cross-runtime snapshot gate |
| `GEO-DET-002` | Stable IDs, ordering, anchors, collection order, error paths | `🌗` | Audit §3H; graph/identity/order evidence; fixture-pass | Stable paths appear in tested cases; universal replay absent | core + spec | graph, collections, diagnostics | H | Add canonical replay comparison for IDs/order/paths |
| `GEO-SER-001` | Deterministic resolved-scene serialization | `🌗` | Audit §3I; expected scene snapshots; fixture-pass | Snapshots consumed by CLI/Flutter; all-object canonical contract incomplete | core + parity | serializer, semantic comparator | H | Define canonical field/order contract and snapshot it |
| `GEO-SER-002` | Canonical numeric/order/semantic serialization contract | `🌗` | Audit §3I; semantic comparator/snapshots; source-only + fixture-pass + not-verified | Snapshots/comparator exist, but no standalone canonical contract or cross-version replay evidence was verified | spec + core | canonical schema, fixtures, consumers | H | Decide contract and run independent serialization verification |
| `GEO-PARITY-001` | TypeScript/Flutter semantic geometry parity | `🌗` | Audit §3I; shared conformance; fixture-pass + not-verified | Fixture 15 bounded active; fixture 16 candidate; current Flutter probe unavailable | core + Flutter | Flutter SDK/host, shared fixtures | H | Restore Flutter verification and promote only reviewed fixtures |
| `GEO-PARITY-002` | Semantic SVG projection parity | `🌗` | Audit §3I; Flutter SVG projection; source-only + not-verified | Semantic SVG is in scope; raw bytes/style/viewBox are not parity contract | renderer-svg + Flutter | SVG serializer, semantic comparator | M | Add semantic SVG assertions and keep byte parity out of scope |

## Non-row findings with distinct status

These are not extra expected IDs and therefore do not change the 40-row join.

| Finding | Status | Evidence | Handling |
| --- | --- | --- | --- |
| Stale `v0.3` provenance/error wording | `⚠️` | Audit §4; `geometry/src/intersection.ts` lines 2 and 747; package/compatibility line is 0.5 | Create a defect task in the gap backlog; do not relabel unrelated capability rows. |
| Broader boolean union/xor/non-rectangle topology | `⏸️` | Audit §4; decision 08 and fixture boundary | Keep `GEO-BOOLEAN-001/002` as `🌗`; deferred expansion is not `➖` or implementation. |
| Geometry-owned UI routes, shortcuts, platform file service | `➖` | Audit §4; ownership boundary | Track under consumer/platform matrices, not as geometry absence. |

## Evidence links

- [Expected geometry capability catalog](./expected-capability-catalog.md)
- [Current geometry implementation audit](./archive/implementation-audit-legacy.md)
- [Expected-versus-observed reconciliation](./reconciliation.md)
- [Geometry implementation-gap backlog](./implementation-gap-backlog.md)
- [Maturation master plan](../../MATURATION-MASTER-PLAN.md)
- [Compatibility matrix](../../compatibility-matrix.json)
- [Fixture manifest](../../../fixtures/manifest.json)
