# Audit implementasi geometry

> **Audit coverage statement — 2026-10-29.** This evidence log inspects
> `geometry/src/`, package/tests, core and renderer consumers, shared fixtures,
> and compatibility metadata for primitives, curves, transforms, intersections,
> booleans, numeric limits, and ownership. It does not claim exhaustive
> mathematical or consumer parity; CI/canonical, registry/public, and unrun
> edge cases remain `not verified` where stated. See [inventory protocol](../../INVENTORY-PROTOCOL.md).

Status dokumen: audit target, 2026-10-29  
Surface utama: `geometry/`  
Consumer yang diaudit: `core/`, `renderer-svg/`, `fixtures/`, dan compatibility metadata  
Owner package: `relgeo/geometry`  
Owner orkestrasi evidence: `relgeo/workspace`  
Compatibility line: RelGeo DSL `0.5.x`

Dokumen ini adalah evidence log untuk [geometry capability matrix](../capability-matrix.md). Ia memisahkan kemampuan library geometry, kemampuan yang dipanggil oleh core/renderer, dan capability yang benar-benar memiliki active fixture. Ketersediaan method pada source tidak otomatis menjadi jaminan DSL atau promotion contract.

## Scope, owner, source path, dan batas verifikasi

| Area | Owner/source of truth | Source path | Boundary yang diperiksa | Batas verifikasi |
| --- | --- | --- | --- | --- |
| Public geometry API | `relgeo/geometry` | `geometry/src/index.ts`, `geometry/package.json` | exports, package/version, public types | tidak diaudit dari fresh registry install; local checkout dan dist dipakai consumer |
| Primitive/resolved types | `relgeo/geometry` | `geometry/src/types.ts` | point, line, rect, circle, ellipse, arc, curves, path, polygon, boolean, collections, scene | type availability bukan bukti semua resolver construction path |
| Intersections | `relgeo/geometry` | `geometry/src/intersection.ts` | analytic pairs, path-like dispatch, selectors, ordering, unsupported pairs | quadratic/cubic/path-like branches memakai sampling/approximation; tolerance bukan DSL promise |
| Boolean geometry | `relgeo/geometry` | `geometry/src/boolean/BooleanEngine.ts`, `ClipperBooleanEngine.ts`, `normalizeClosedShape.ts` | union/subtract/intersect/xor, holes, normalization | active fixture/decision scope terbatas; engine method existence bukan full active contract |
| Path modifiers | `relgeo/geometry` | `geometry/src/path-modifiers.ts` | fillet, chamfer, offset, self-intersection checks | geometry package tests cover local boundary; full DSL placement/offset semantics remain core-owned |
| Split | `relgeo/geometry` | `geometry/src/split.ts` | open line/arc/quadratic/cubic split by point | closed path explicitly rejected at active boundary; not all split selectors/collection semantics are geometry-owned |
| Transforms and bbox | `relgeo/geometry` | `geometry/src/transforms.ts`, `utils.ts` | affine pipeline, group transform, sampling, bounding boxes | renderer visual parity/browser behavior not proved by package tests |
| Core integration | `relgeo/core` | `core/src/resolver/`, `core/src/evaluator.ts`, core tests | geometry exports used by resolver/evaluator, boolean and split dispatch | core integration test passes locally under Node 22, below root Node >=24 requirement |
| Renderer integration | `relgeo/renderer-svg` | `renderer-svg/src/index.ts`, `primitives.ts`, tests | resolved geometry, bbox, SVG primitives, semantic snapshots | no fresh browser visual test in this audit |
| Shared fixture/evidence | `relgeo/workspace` | `fixtures/manifest.json`, `fixtures/reference/`, `fixtures/expected/`, `scripts/run-conformance-fixtures.mjs` | active/candidate/error fixture status and cross-surface assertions | runner uses current built artifacts; not a fresh child-repository CI or registry proof |
| Compatibility policy | `relgeo/workspace` | `docs/compatibility-matrix.json`, `docs/decisions/08-boolean-intersection-contract-review.md` | version, package ordering, active vs candidate boolean scope | historical decision text is evidence of policy, not new implementation evidence |

## Actual source findings

### Public surface

`geometry/src/index.ts:1-10` exports types, errors, transforms, utilities, intersections, path modifiers, split, boolean engine, Clipper adapter, and closed-shape normalization. `geometry/package.json` identifies `@relgeo/geometry` version `0.5.0`, publishable, and compatibility line `0.5` in `docs/compatibility-matrix.json`.

The resolved type model is broader than the algorithm surface: `types.ts:56-309` includes primitives, operation objects, boolean, dimension, annotation, collection, and component objects; `types.ts:311-365` includes constraint violations, views, sheets, and resolved scene. This means the package is a shared type/utility dependency for core and renderer, not the owner of all DSL semantics represented in those types.

### Primitive and transform implementation

- affine transform pipeline supports translate, rotate, scale, and mirror (`geometry/src/transforms.ts:1-61`);
- utility layer samples quadratic/cubic/arc/path-like shapes and calculates transformed object/group bounding boxes (`geometry/src/utils.ts:1-292`);
- resolved shape types cover point, line, rect, circle, ellipse, arc, quadratic, cubic, path, polygon, and boolean (`geometry/src/types.ts:56-251`);
- tests cover transform operations, angle utilities, curve sampling, and simple bbox behavior (`geometry/src/__tests__/geometry.test.ts:14-112`).

### Intersection implementation

The engine provides exact or analytic handling for line-line, line-circle, circle-circle, line-arc, circle-arc, and arc-arc, with deterministic x/y ordering and deduplication (`geometry/src/intersection.ts:44-65,71-319`). It dispatches path-like cases for rect/path/polygon and supports line, circle, arc, quadratic, and cubic segments (`geometry/src/intersection.ts:405-610,676-747`). Quadratic/cubic and some path-like combinations are approximated through sampled line segments (`geometry/src/intersection.ts:419-430,487-565`); this is an implementation limitation, not a precision guarantee.

Selectors `first`, `last`, `index`, `nearest`, and `farthest` are implemented, while zero/multiple result behavior is explicit through `NO_INTERSECTION` and `MULTIPLE_INTERSECTIONS` (`geometry/src/intersection.ts:617-665`). The geometry tests cover pair behavior, deterministic ordering, selector errors, dispatch, path/polygon cases, and unsupported pair behavior (`geometry/src/__tests__/intersection.test.ts:17-339`).

### Boolean, normalization, and topology

`BooleanEngine` declares `union`, `subtract`, `intersect`, and `xor` (`geometry/src/boolean/BooleanEngine.ts:1-17`). `ClipperBooleanEngine` delegates closed polygon rings and holes to `polygon-clipping`, returning `PolyWithHoles[]` (`geometry/src/boolean/ClipperBooleanEngine.ts:1-64`). Normalization accepts resolved rect, circle, polygon, path, and boolean objects, removes near-duplicate/closing points at `1e-7`, samples circles at 64 segments, and applies transforms (`geometry/src/boolean/normalizeClosedShape.ts:6-108`).

This is a real implementation surface, but current active contract evidence is narrower. Decision 08 defines the first promotion scope as line-line intersection, rectangle `intersect`, and rectangle `subtract`; it explicitly leaves `union`, `xor`, non-rectangle operands, and broader topology as later/candidate scope. The current manifest marks fixture 15 active and fixture 16 evaluator/units as `capability`; the audit does not reinterpret the historical filename `15-v05-boolean-intersection-candidate.yaml` as current status.

### Path modifiers and split

`path-modifiers.ts` exports fillet, chamfer, corner modifier application, polyline offset, and no-self-intersection validation (`geometry/src/path-modifiers.ts:63-483`). The package tests cover successful geometry and error boundaries such as `INVALID_CORNER_OPERATION`, `INVALID_OFFSET`, and `SELF_INTERSECTING_PATH` (`geometry/src/__tests__/path_modifiers.test.ts:14-157`). Core imports and uses these functions in its path resolver (`core/src/resolver/primitives/shapes.ts:30-46,1180-1193`).

`splitPathLikeByPoint` handles open line, arc, quadratic, and cubic targets, rejects closed paths, rejects endpoints/off-target points, and returns two open pieces (`geometry/src/split.ts:43-230`; tests `geometry/src/__tests__/split.test.ts:4-159`). Core uses it from operation resolution (`core/src/resolver/primitives/operation.ts:12-19,180-238`).

## Consumer and evidence boundary

| Consumer | Actual use | Evidence | Status boundary |
| --- | --- | --- | --- |
| `core` | re-exports geometry, uses bbox/transforms/intersections/path modifiers/split/Clipper boolean in resolver/evaluator | `core/src/index.ts:1-8`; resolver imports; core suite `427/427` | direct local integration verified; not a Node >=24 canonical run |
| `renderer-svg` | consumes resolved types and `calculateBoundingBox`; renders primitives and boolean/path geometry | `renderer-svg/src/index.ts:1,202-211`; `primitives.ts`; renderer suite `79/79` | direct local consumer verified; browser visual parity not verified |
| Fixture 10 | validates primitive relational baseline, resolved snapshot, SVG snapshot, CLI/Markdown/plugin paths | `fixtures/manifest.json`; `expected/10-v05-relational-baseline.*` | active baseline verified by conformance |
| Fixture 14 | validates post-resolve align violation and renderer output | `fixtures/manifest.json`; expected scene/SVG | runtime diagnostic boundary verified |
| Fixture 15 | validates line intersection, rectangle intersection/subtraction, resolved scene and semantic SVG across listed surfaces | `fixtures/reference/15-v05-boolean-intersection-candidate.yaml`, expected snapshots, decision 08 | active contract evidence is bounded to declared fixture scope |
| Fixtures 19/20 | validates empty and multipart boolean runtime errors | `fixtures/reference/19-*.yaml`, `20-*.yaml`, manifest expected errors | error boundary verified through core/CLI/conformance |
| Compatibility matrix | records package `@relgeo/geometry@0.5.0`, same-line policy, and release order before core/renderer | `docs/compatibility-matrix.json:1-110` | metadata consistent with local package; not a release publication proof |

## Direct verification recorded in this audit

| Command | Result | What it proves |
| --- | --- | --- |
| `pnpm --filter @relgeo/geometry test` | PASS — 4 files, 66 tests | public geometry implementation tests execute |
| `pnpm --filter @relgeo/core test` | PASS — 44 files, 427 tests | core integration with geometry executes |
| `pnpm --filter @relgeo/renderer-svg test` | PASS — 6 files, 79 tests | renderer consumer of geometry types/utilities executes |
| `pnpm conformance:fixtures` | PASS — 260/260 across 20 fixtures | fixture 10/14/15/19/20 and consumer snapshots/errors execute from built artifacts |

All commands emitted the same environment warning: checkout Node `22.23.2` is below root metadata requirement `>=24`. No command failed due to that warning. Registry install, Flutter current run, browser visual runtime, and remote CI are `not verified` by this audit.

## Audited gaps and risks

1. Geometry API has a broad algorithm surface, but the active boolean/intersection contract is deliberately narrower than the exported engine. Treating all four boolean methods or all operand types as active would overstate evidence.
2. Curve/path intersection branches use sampling for quadratic/cubic and some mixed path-like pairs. The implementation has tests, but no global error bound or DSL precision guarantee was found.
3. High-level DSL query semantics and constraint evaluation are core-owned. Geometry exports types and low-level functions, but it does not expose a complete query/constraint service; that is a boundary decision, not proof of absence in the product.
4. Geometry’s intersection module still contains stale v0.3 provenance/comment/error wording (`geometry/src/intersection.ts:1-6,747`) while the package and compatibility metadata are v0.5. This is a confirmed documentation/diagnostic drift issue and is marked `⚠️` in the matrix.
5. `normalizeClosedShape` uses implementation constants (`1e-7`, 64 circle samples) that must remain implementation details unless a future decision promotes them to a public numeric contract.
