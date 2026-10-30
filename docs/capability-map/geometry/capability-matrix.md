# RelGeo geometry capability matrix

> **Coverage statement — 2026-10-29.** This matrix covers `geometry/` source
> and public boundary through geometry tests, core/renderer consumers, shared
> fixtures, package metadata, and compatibility evidence. It inventories
> primitives, curves, transforms, intersections, boolean operations, numeric
> limits, and ownership boundaries; it does not claim exhaustive mathematical
> or browser parity. CI/canonical, registry/public, and every consumer edge
> case remain `not verified` unless the row names direct evidence; a missing
> row is not evidence of absence.
> See [inventory protocol](../INVENTORY-PROTOCOL.md) for status axes and evidence tiers.

Status dokumen: audit baseline, 2026-10-29  
Surface: `geometry/`  
Owner: `relgeo/geometry`  
Compatibility line: `0.5.x`  
Evidence log: [geometry/archive/implementation-audit-legacy.md](./archive/implementation-audit-legacy.md)

## Status legend

| Status | Arti audit | Tidak berarti |
| --- | --- | --- |
| `✔️` | Capability tersedia pada boundary geometry yang dinilai dan punya evidence langsung. | Semua consumer atau semua input edge case sudah parity. |
| `🌗` | Sebagian implementation/evidence tersedia, tetapi precision, input, consumer, atau active contract masih terbatas. | Capability selesai end-to-end. |
| `❌` | Capability yang seharusnya tersedia pada boundary ini sudah diperiksa dan belum ada. | Boundary consumer lain otomatis gagal. |
| `➖` | Capability bukan tanggung jawab geometry package atau sengaja di luar scope. | Pekerjaan yang tertunda. |
| `⏸️` | Capability ditahan oleh keputusan/promotion dependency. | Capability tidak bisa diimplementasikan. |
| `⚠️` | Mismatch atau masalah terkonfirmasi pada source/consumer boundary. | Evidence yang belum diverifikasi. |

`not verified` adalah state evidence, bukan simbol. Untuk consumer yang tidak direrun, matrix mempertahankan status capability berdasarkan source/fixture yang ada dan menuliskan batas verifikasi secara eksplisit.

## Capability matrix

| Capability | Status | Evidence | Gap / limitation | Consumer | Dependency | Next action |
| --- | --- | --- | --- | --- | --- | --- |
| Public package, exports, and compatibility line `@relgeo/geometry@0.5.0` | `✔️` | `geometry/src/index.ts:1-10`; `geometry/package.json`; `docs/compatibility-matrix.json` package entry | Fresh registry install/release artifact tidak diverifikasi | core, renderer-svg, npm consumers | npm package boundary, same-line policy | Re-run registry/package boundary during release audit |
| Resolved primitive types: point, line, rect, circle, ellipse, arc, quadratic, cubic, path, polygon | `✔️` | `geometry/src/types.ts:56-243`; geometry/core tests | Type declarations do not prove every resolver construction path | core, renderer-svg | core resolver and renderer type consumers | Keep type-to-fixture coverage visible |
| Resolved boolean, collection, component, scene, sheet/view, and violation types | `✔️` | `geometry/src/types.ts:245-365` | Data types exist even where algorithms/semantics are owned by core | core, renderer-svg, Flutter projection | core resolver contract | Document ownership split between type carrier and semantic owner |
| Affine transforms: translate, rotate, scale, mirror; group transform | `✔️` | `geometry/src/transforms.ts:1-61`; `geometry.test.ts:14-58`; renderer reference tests | Transform order is implementation-sensitive and not independently cross-consumer tested for all composites | core, renderer-svg | resolver transform pipeline, SVG renderer | Add composite transform fixture with semantic assertions |
| Sampling utilities for arcs/quadratic/cubic/path-like objects | `✔️` | `geometry/src/utils.ts:24-101`; geometry tests | Sampling is approximation; no public precision/error bound | intersections, bbox, boolean normalization | numeric tolerances and segment representation | Keep sampling constants internal; add tolerance documentation if needed |
| Bounding boxes for objects/groups/clones/transforms | `✔️` | `geometry/src/utils.ts:107-292`; core resolver and renderer imports; core/renderer tests | Empty/default bbox and curved-shape approximation require edge-case coverage | core, renderer-svg | resolved object graph, transforms | Add active bbox fixtures for curves/boolean holes |
| Line-line and bounded line intersection | `✔️` | `geometry/src/intersection.ts:71-115`; intersection tests 17-41; core dispatch tests | Coincident/parallel behavior returns no point; contract context is caller-owned | core evaluator, active fixture 15 | selector/error policy in core | Preserve deterministic ordering and negative tests |
| Line-circle, circle-circle, line-arc, circle-arc, arc-arc intersections | `✔️` | `geometry/src/intersection.ts:121-319`; intersection tests 44-178 | Analytic support exists, but not every pair is in active shared fixture | core evaluator, future authoring | resolved analytic arc/circle data | Add cross-surface fixtures if these pairs become active contract |
| Path/polygon/rect dispatch and path-like intersections | `🌗` | `geometry/src/intersection.ts:432-610,676-747`; tests 252-339 | Quadratic/cubic and mixed path branches approximate with samples; unsupported pairs throw `UNSUPPORTED_FEATURE` | core evaluator, language-service consumers indirectly | segment sampling, path representation | Define supported pair table and numeric boundary |
| Deterministic intersection ordering and deduplication | `✔️` | `geometry/src/intersection.ts:4-6,44-65`; tests 180-198 | Ordering is x then y, but broader semantic contract should live above implementation | core selectors, fixture comparator | tolerance `1e-9` implementation detail | Keep ordering tests; avoid promoting tolerance as DSL API |
| Intersection selectors: first, last, index, nearest, farthest | `✔️` | `geometry/src/intersection.ts:617-665`; tests 200-249 | Invalid index/selector error messages are not a shared cross-consumer fixture | core evaluator | core error mapping | Add selector error fixture if public diagnostics require it |
| Fillet, chamfer, corner modifiers | `✔️` | `geometry/src/path-modifiers.ts:63-308`; tests 14-69; core re-export/use | Geometry functions do not own DSL field validation or placement semantics | core path resolver, renderer output | core resolver path modifier mapping | Maintain function-level tests and core integration cases |
| Polyline offset and self-intersection validation | `✔️` | `geometry/src/path-modifiers.ts:355-483`; tests 73-157; core usage | Offset correctness for complex curves/holes is not fully characterized | core path offset, renderer | path normalization and tolerance | Add closed-path/holes cross-surface fixtures |
| Split open line, arc, quadratic, and cubic by point | `🌗` | `geometry/src/split.ts:43-230`; tests 4-159; core operation use | Closed paths are explicitly rejected; endpoint/off-target behavior is hard-error boundary | core `split` operation | resolved segments, tolerance, collection semantics | Add active fixture for split result identity/collection behavior |
| Boolean engine API: union, subtract, intersect, xor | `🌗` | `geometry/src/boolean/BooleanEngine.ts:1-17`; `ClipperBooleanEngine.ts:22-64` | Engine API is broader than active contract; empty/multipart/operand policy belongs to core | core boolean resolver | polygon-clipping, closed-shape normalization | Keep API available but do not infer active DSL support |
| Closed-shape normalization: rect, circle, polygon, path, boolean, holes, transforms | `🌗` | `geometry/src/boolean/normalizeClosedShape.ts:6-108` | Circle sampling 64 and cleaning `1e-7` are implementation details; degeneracy policy is incomplete | core boolean resolver | path sampler, transforms, polygon-clipping | Add explicit degeneracy/error boundary before broader promotion |
| Active boolean/intersection contract: line-line + rectangle intersect/subtract | `✔️` | fixture 15 manifest/expected snapshots; `docs/decisions/08-boolean-intersection-contract-review.md`; conformance 260/260 | Active evidence is bounded to declared rectangle/line scope despite historical filename | core, renderer-svg, CLI, Flutter semantic projection | Clipper engine, resolver policy, semantic comparator | Preserve active fixture and add only separately reviewed expansions |
| Boolean `union`, `xor`, non-rectangle operands, broader topology promotion | `⏸️` | Decision 08 explicitly keeps these outside first promotion; engine methods exist | Implementation exists but active cross-consumer contract/evidence is not closed | core, renderer, Flutter | additional fixtures and promotion decision | Keep candidate/partial until fresh cross-consumer evidence and decision |
| Empty and multipart boolean error boundaries | `✔️` | fixtures 19/20; manifest expected `BOOLEAN_EMPTY_RESULT` and `BOOLEAN_MULTIPART_RESULT`; conformance passes | Geometry engine returns polygons; core owns conversion to runtime error | core, CLI, language-service structural path | core resolver mode policy | Keep errors in core contract, not geometry package API |
| Collections and collection ordering algorithms | `➖` | `geometry/src/types.ts:277-284` carries type; collection resolution is in core, not geometry exports | No geometry-owned collection evaluator found | core resolver, Flutter | core collection semantics | Track under core matrix; do not duplicate in geometry |
| Constraint evaluation and `ConstraintViolation` production | `➖` | `geometry/src/types.ts:311-323` defines data shape; core validator/resolver evaluates constraints | Geometry package is not the constraint solver/diagnostic owner | core, renderer overlays | core resolver constraint processing | Keep geometry as type carrier; audit behavior under core |
| High-level DSL queries: area, perimeter, closestPoint, project, reflect, frameAt, etc. | `❌` | No corresponding high-level query exports in `geometry/src/index.ts`; core evaluator implements DSL query behavior | Expected geometry package capability is absent at this boundary, while product behavior exists in core | core evaluator, language-service | core expression evaluator and resolved object model | Decide whether to extract reusable query primitives or document core ownership |
| Unsupported/degenerated input policy and numeric error bounds | `🌗` | local error tests cover several invalid operations; `GeometryError` exists; no single policy catalog found | No complete public numeric/error contract for all degeneracy, sampling, or non-finite inputs | core, renderer, CLI | error mapping and spec error model | Add geometry error catalog and cross-consumer negative fixtures |
| Geometry provenance/version wording | `✔️` | `geometry/src/intersection.ts`; `geometry/src/__tests__/intersection.test.ts`; package/compatibility line is 0.5 | Package-local provenance and unsupported-operation wording now match the active line; consumer-specific message snapshots remain separate | core, CLI, docs | package version policy | Keep the regression assertion and refresh consumer snapshots only when their contracts require it |
| Geometry package lint/build and registry artifact verification | `🌗` | package scripts provide `lint`, `build`, `test`; local test passes | This audit did not run fresh build/registry install; dist is consumed by conformance | npm consumers | Node/pnpm toolchain | Run under Node >=24 and include package boundary in release gate |

## Priority order

1. Preserve the narrow active boolean/intersection contract and separate future `union`/`xor`/operand expansions from implementation availability.
2. Keep the resolved 0.5 provenance/error wording covered by regression tests.
3. Define an explicit supported-pair and numeric-precision policy for sampled path intersections.
4. Decide whether high-level query primitives remain core-owned or should be extracted into geometry; document the ownership boundary either way.
5. Add cross-surface fixtures for split, curve/path intersections, boolean holes, bbox/transforms, and degeneracy errors before promotion claims.
