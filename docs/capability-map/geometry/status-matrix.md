# Geometry capability status matrix

**Tanggal:** 2026-11-04
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
duplicate, 0 extra; 17 `✔️`, 23 `🌗`, 0 `❌`, 0 row `➖/⏸️/⚠️`.**
`➖` dan `⏸️` tetap tercatat pada findings scope/defect di bawah agar status
scope tidak hilang hanya karena bukan row hasil join. Jika audit berikutnya
menemukan expected capability tanpa implementation/consumer behavior, gunakan ID
yang sama dan tambahkan row `❌` ke matrix serta backlog; jangan ubah menjadi
`➖`.

The current triage for task `triage-remaining-geometry-gaps--9052928134` is
recorded in the [implementation-gap backlog](./implementation-gap-backlog.md#triage-decision--task-triage-remaining-geometry-gaps--9052928134).
That triage does not change the status counts above: it identifies 17
implementation-closable rows, three external-evidence-only rows, and two
scope-deferred rows. The five promoted/required rows are
`GEO-OBJ-001`, `GEO-PRIM-003`, `GEO-PRIM-004`, `GEO-PRIM-005`, and
`GEO-MEASURE-002`.

## Capability matrix

| ID | Capability | Status | Evidence | Gap | Owner | Dependency | Risk | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `GEO-OBJ-001` | Object identity, explicit type, dependency graph, topological evaluation | `🌗` | Audit §3A; `geometry/src/types.ts`; `core/src/graph.ts`; `dependency_v03.test.ts`; core 488 tests; local-pass | Canonical cycle paths and local graph ordering are covered, but full identity/duplicate contract is not closed across consumers | core + geometry contract | object model, diagnostics, graph | H | Preserve local cycle evidence; add cross-consumer duplicate/identity evidence when the boundary is available |
| `GEO-PRIM-001` | Point and line construction | `✔️` | Audit §3A; geometry/core tests; fixtures 10/15 | No current gap at bounded boundary; broader consumer coverage remains ordinary maintenance | geometry + core | typed point/line resolver | M | Keep primitive fixture coverage in release gate |
| `GEO-PRIM-002` | Rect, circle, ellipse, anchors, holes, ClosedShape surface | `✔️` | Audit §3A; fixtures 10/15/16 | Bounded active paths only; no claim for every downstream operation | geometry + core | closed-shape normalization, renderer | M | Preserve fixture coverage and add edge cases when promoted |
| `GEO-PRIM-003` | Arc, quadratic, cubic path segments | `🌗` | Audit §3A; `geometry/src/intersection.ts`; curve contract tests; geometry 91 tests; local-pass | Adaptive curve intersection and degeneracy boundaries are covered locally, but sampled path operations remain bounded | geometry + core | path representation, sampling/tolerance | M | Preserve local tolerance evidence; promote additional pairs only with reviewed cross-consumer fixtures |
| `GEO-PRIM-004` | Path, polygon, text geometry, chaining, close, holes, labels | `🌗` | Audit §3A; core 488 tests; renderer 92 tests; semantic projection tests; conformance 298/298 | Text anchor/content and point-authored closed rings are covered locally, but complete holes/label parity is not evidenced across consumers | core + renderer-svg | path resolver, renderer semantics | M | Add reviewed shared holes/label fixture and current consumer parity evidence |
| `GEO-PRIM-005` | Group, clone, component, parameters/exports, namespace instance | `🌗` | Audit §3A; `component.test.ts`; core 488 tests; local-pass | Component-local parameter scope is covered; clone/export/namespace identity remains incomplete across consumers | core | scope, graph, instance identity | H | Preserve local scope evidence; add clone/export identity fixture when promoted |
| `GEO-MEASURE-001` | Typed geometry dimensions and records | `✔️` | Audit §3B; type-system contract; local-pass | No bounded implementation gap; full consumer misuse matrix remains future coverage | spec + core | type checker, evaluator | M | Keep negative type fixtures current |
| `GEO-MEASURE-002` | Scene units, literals, normalization, conversion | `🌗` | Audit §3B; `parameter_type_validation.test.ts`; core 488 tests; fixture 16/conformance 298/298; local-pass | Typed inch/malformed-literal boundary is covered; full normalization and cross-surface parity remain external evidence | spec + core | evaluator, unit policy, Flutter alignment | H | Preserve local literal evidence; verify normalization and host parity under the declared runtime/consumer boundary |
| `GEO-MEASURE-003` | Arithmetic, comparison, logical, ternary, math, formatting | `✔️` | Audit §3B; `core/src/evaluator.ts`; local-pass | No bounded implementation gap; cross-surface formatting parity is not exhaustive | core | expression evaluator, type safety | M | Keep deterministic expression tests |
| `GEO-MEASURE-004` | Parameters, defaults, constants, derived values, local derived scope | `🌗` | Audit §3B; `component.test.ts`; core 488 tests; local-pass | Component-local dependency order is covered; full derived-cycle and consumer parity evidence remains incomplete | core + spec | dependency graph, evaluator, unit boundary | H | Add derived-cycle and cross-consumer parameter fixture |
| `GEO-MEASURE-005` | Deterministic validation and structured diagnostics | `✔️` | Audit §3B; fixtures 11–13/17–18; fixture-pass | Negative fixtures are active, but the full error catalog is not exhaustive | core + spec | error model, document paths | M | Preserve stable code/path assertions |
| `GEO-XFORM-001` | Ordered translate, rotate, scale, mirror, group transform | `✔️` | Audit §3C; `geometry/src/transforms.ts`; fixtures; local-pass | Composite transform ordering is not fully cross-consumer tested | geometry + core | transform pipeline, bbox | M | Add composite transform semantic snapshot |
| `GEO-XFORM-002` | Mirror, rotate, scale, translate, reverse, split operation objects | `🌗` | Audit §3C; `resolver.test.ts`, `split.test.ts`; core 488 tests; local-pass | Finite transform and chained split lowering are covered; full result/consumer matrix and closed-path behavior remain open | core + geometry | operation result identity, collections | M | Preserve chain evidence; add reviewed closed-path/result-identity consumer fixture |
| `GEO-PLACE-001` | Anchor placement, offset, inside, margin | `🌗` | Audit §3C; `v02_final_verification.test.ts`; core 488 tests; local-pass | Rect-only inside placement and margin errors are covered; conflict/shared consumer coverage remains incomplete | core + spec | anchors, bbox, placement diagnostics | H | Add reviewed placement conflict matrix across consumers |
| `GEO-PLACE-002` | `on.point`, `on.path`, `on.frame` placement | `🌗` | Audit §3C; `frame_placement.test.ts`; core 488 tests; local-pass | Non-finite frame parameters are rejected; broader orientation/consumer parity is not promoted | core + geometry | frameAt, tangent/normal, transforms | M | Extend frame fixture when Node 24/native consumer boundary is available |
| `GEO-ANCH-001` | Standard point, scalar, direction, primitive anchors | `✔️` | Audit §3C; fixture 10; local-pass + fixture-pass | No bounded implementation gap; all primitive-specific anchors not exhaustively sampled | spec + core | primitive bbox/frame | M | Keep standard-anchor fixture coverage |
| `GEO-ANCH-002` | Custom named and operation-result anchors | `🌗` | Audit §3C; `group_custom_anchors.test.ts`; local-pass | Custom anchors exist, but cross-consumer snapshots are incomplete | core + geometry | component scope, operation results | M | Add custom-anchor serialization and renderer fixture |
| `GEO-COLL-001` | Repeat linear, each, grid, polar, along | `🌗` | Audit §3D; `repeat.ts`, `repeat_divide.test.ts`, `repeat_grid_revisi.test.ts`; core 488 tests; local-pass | Runtime boundaries for polar/grid/along modes are covered, but the full mode matrix lacks shared cross-consumer fixtures | core | collection identity, placement | H | Add one reviewed conformance fixture per repeat mode |
| `GEO-COLL-002` | Along distribution, offsets, endpoint and frame policy | `🌗` | Audit §3D; `repeat.ts`, `repeat_divide.test.ts`; core 488 tests; local-pass | Closed-path endpoint and offset validation are covered; fixed-distance/conflict/replay parity remains open | core + spec | path length, frameAt, diagnostics | H | Add fixed-distance and conflict matrix when consumer boundary is available |
| `GEO-COLL-003` | Grid pitch/gap auto-layout and validation | `🌗` | Audit §3D; `repeat_grid_revisi.test.ts`; core 488 tests; local-pass | Finite pitch/gap runtime validation is covered; complete cross-consumer contract remains open | core | dimensions, placement conflict policy | M | Preserve negative fixtures; add shared pitch/gap fixture |
| `GEO-COLL-004` | Divide, split collection, indexing, count/first/last | `🌗` | Audit §3D; `split.test.ts`, `repeat_divide.test.ts`; core 488 tests; local-pass | Count/divide and chained split behavior are covered; public collection semantics remain core-owned | core + geometry | split operation, ordering, selector errors | M | Add reviewed collection identity/indexing fixture |
| `GEO-COLL-005` | Stable collection ordering and repeat identity | `🌗` | Audit §3D; `projection.test.ts`; core 488 tests; local replay-pass | Same-input collection order/IDs serialize identically; cross-runtime replay remains unverified | core | deterministic resolver, IDs | H | Re-run on Node 24/host runtimes before parity promotion |
| `GEO-QUERY-001` | Measurement queries: distance, length, perimeter, area, bbox, extents | `🌗` | Audit §3E; `evaluator.test.ts`; core 488 tests; conformance 298/298; local-pass | Hole-aware rect/closed-shape measurements are covered; every primitive/query consumer combination remains incomplete | core + spec | resolved objects, numeric policy | M | Extend reviewed query coverage by supported primitive |
| `GEO-QUERY-002` | Midpoint, polar, angleBetween, pointAt, tangentAt, normalAt | `🌗` | Audit §3E; `tangent_normal.test.ts`, `frame_placement.test.ts`; core 488 tests; local-pass | Finite domain and degenerate tangent/normal boundaries are covered; broad curve/path tolerance coverage remains open | core + geometry | path sampling, frame semantics | H | Add reviewed curve/path endpoint fixture and host consumer evidence |
| `GEO-QUERY-003` | closestPoint, project, reflect, toWorld, toLocal | `✔️` | Audit §3E; evaluator tests; local-pass | v0.5 overload boundary is tested; broader overloads remain out of scope | core + spec | coordinate spaces, typed targets | M | Preserve overload negative tests |
| `GEO-QUERY-004` | Intersection query selectors and single/multi result context | `✔️` | `geometry/src/__tests__/geometry-contract.fixture.ts`; `intersection.test.ts`; fixture 15; conformance 298/298 | Bounded supported pair/selector contract is explicit; sampled broader pairs remain outside promotion | geometry + core | intersection algorithms, selectors, boolean contract | H | Preserve bounded contract; extend only with approved active boundary |
| `GEO-QUERY-005` | `frameAt` and `tAtLength` | `✔️` | Audit §3E; `frame_placement.test.ts`; local-pass | No bounded implementation gap; shared use by repeat remains partial | core + geometry | path traversal, placement | M | Reuse frame fixture in repeat-along tests |
| `GEO-CONSTRAINT-001` | Equal, parallel, perpendicular, tangent validation | `🌗` | Audit §3F; `constraints_diagnostics.test.ts`; core 488 tests; fixture-pass | Degenerate/non-finite parallel, perpendicular, and tangent inputs now produce structured violations; full valid/invalid relation matrix remains incomplete | core + spec | resolved geometry, tolerance | H | Add complete relation-kind fixture matrix and consumer evidence |
| `GEO-CONSTRAINT-002` | Post-resolve structured violations and no-general-solver policy | `✔️` | Audit §3F; fixture 14; fixture-pass | Post-resolve behavior active; no general solver is intentional scope | core + spec | diagnostic policy, caller severity | M | Keep violation path/code snapshots |
| `GEO-BOOLEAN-001` | ClosedShape union, subtract, intersect, xor | `🌗` | Audit §3G; `geometry/src/boolean/`; fixture 15 | Engine exposes four ops, but active evidence is rectangle intersect/subtract | geometry + core | polygon clipping, result mode | H | Add separately reviewed union/xor and non-rectangle fixtures |
| `GEO-BOOLEAN-002` | Single/multi result mode, holes/topology, empty/multipart behavior | `🌗` | Audit §3G; fixtures 15/19/20; fixture-pass | Empty/multipart errors active; broader topology remains deferred/candidate | core + geometry | normalization, mode policy, diagnostics | H | Add holes/multipart topology acceptance matrix |
| `GEO-NUM-001` | Consistent epsilon/tolerance policy | `✔️` | `geometry/src/tolerance.ts`; intersection/split/path-modifier tests; geometry 91/91 | Low-level tolerance constants and boundaries are frozen; no universal public DSL epsilon claim | geometry + spec | numeric contract, all geometry operations | H | Keep cross-runtime numeric parity separate |
| `GEO-NUM-002` | Winding-independent normalization, holes, even-odd semantics | `✔️` | `normalizeClosedShape.ts`; `boolean.test.ts`; fixture 15; geometry 91/91 | Supported rings canonicalize winding/holes and cleanup; broader topology remains incomplete | geometry + core | polygon normalization, boolean engine | H | Add only separately reviewed topology fixtures |
| `GEO-NUM-003` | Degenerate/invalid input detection and stable error codes | `✔️` | `error.ts`; intersection/boolean/path/split tests; geometry 91/91; core 488/488 | Selected package error codes are stable; cross-consumer diagnostic mapping remains separate | core + geometry | error model, renderer/CLI propagation | H | Preserve selected catalog; expand consumer mapping only when promoted |
| `GEO-DET-001` | Platform/order/time-independent deterministic resolution | `🌗` | Audit §3H; conformance snapshots; local-pass + fixture-pass | Local determinism observed; Node 24, Flutter, and cross-platform replay unverified | core + parity | canonical toolchain, serializer, fixtures | H | Run repeated-process and cross-runtime snapshot gate |
| `GEO-DET-002` | Stable IDs, ordering, anchors, collection order, error paths | `✔️` | `core/src/projection.ts`; core/CLI tests; fixture replay; conformance 298/298 | Bounded local replay comparator is active; universal cross-runtime replay remains unverified | core + spec | graph, collections, diagnostics | H | Keep host/cross-runtime replay as separate evidence |
| `GEO-SER-001` | Deterministic resolved-scene serialization | `✔️` | `core/src/projection.ts`; `cli/src/index.ts`; expected snapshots; CLI 36/36; conformance 298/298 | Versioned canonical projection is consumed by core/CLI; Flutter parity remains unverified | core + parity | serializer, semantic comparator | H | Preserve field/order contract and verify host consumer separately |
| `GEO-SER-002` | Canonical numeric/order/semantic serialization contract | `✔️` | semantic comparator, manifest, projection/CLI tests; conformance 298/298 | 12-decimal numeric/order contract is executable locally; cross-version/host replay remains unverified | spec + core | canonical schema, fixtures, consumers | H | Keep Node 24/Flutter/registry evidence qualified |
| `GEO-PARITY-001` | TypeScript/Flutter semantic geometry parity | `🌗` | Audit §3I; shared conformance; fixture-pass + not-verified | Fixture 15 bounded active; fixture 16 candidate; current Flutter probe unavailable | core + Flutter | Flutter SDK/host, shared fixtures | H | Restore Flutter verification and promote only reviewed fixtures |
| `GEO-PARITY-002` | Semantic SVG projection parity | `🌗` | Audit §3I; Flutter SVG projection; source-only + not-verified | Semantic SVG is in scope; raw bytes/style/viewBox are not parity contract | renderer-svg + Flutter | SVG serializer, semantic comparator | M | Add semantic SVG assertions and keep byte parity out of scope |

## Non-row findings with distinct status

These are not extra expected IDs and therefore do not change the 40-row join.

| Finding | Status | Evidence | Handling |
| --- | --- | --- | --- |
| Stale `v0.3` provenance/error wording | `✔️` resolved locally | Current audit; `geometry/src/intersection.ts`; regression coverage in `geometry/src/__tests__/intersection.test.ts`; package/compatibility line is 0.5 | Keep the regression assertion; consumer-specific wording remains outside the geometry package row join. |
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
