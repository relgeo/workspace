# Audit implementasi core runtime

> **Audit coverage statement — 2026-10-29.** This evidence log inspects core
> parser, validator, graph, evaluator, resolver, units, diagnostics, tests,
> fixtures, package metadata, and consumer boundaries. It distinguishes local
> implementation evidence from canonical/CI, registry, and public claims; the
> latter remain `not verified` where stated. See [inventory protocol](../../INVENTORY-PROTOCOL.md);
> the audit is bounded, not a claim that unlisted behavior is absent.

Status dokumen: audit target, 2026-10-29  
Surface utama: `core/`  
Consumer/boundary: `geometry/`, `renderer-svg/`, `fixtures/`, `docs/integration-baseline.json`  
Owner package: `relgeo/core`  
Owner orkestrasi evidence: `relgeo/workspace`  
Compatibility line: RelGeo DSL `0.5.x`

Dokumen ini menjadi evidence log untuk [core runtime capability matrix](../capability-matrix.md). Audit mengikuti urutan aktual parse → validate → dependency graph/evaluate → resolve → post-resolve diagnostics → scene output. Source, fixture, dan roadmap diperlakukan sebagai evidence; tidak ada klaim yang dinaikkan hanya karena ada di dokumentasi.

## Scope, owner, source path, dan batas verifikasi

| Area | Owner/source of truth | Source path | Boundary yang diperiksa | Batas verifikasi |
| --- | --- | --- | --- | --- |
| Public core API | `relgeo/core` | `core/src/index.ts`, `core/package.json` | exports, version policy, package scripts | local checkout; registry/install boundary tidak diverifikasi fresh |
| Parser/version policy | `relgeo/core` | `core/src/parser.ts` | YAML loading, version classification, structural fields, editor/compile modes | parser contract dan language-service schema tetap diduplikasi |
| Validation/error model | `relgeo/core` | `core/src/validator.ts`, `core/src/types.ts` | identifiers, types, expressions, constraints, scene, sheets/views, error code/path | error-code completeness belum automated; raw Error paths masih ada |
| Graph/evaluation | `relgeo/core` | `core/src/graph.ts`, `evaluator.ts`, `resolver/values.ts` | object/derived ordering, expressions, functions, units, cycles | numeric precision/edge cases tidak exhaustively proven |
| Resolver/semantic scene | `relgeo/core` | `core/src/resolver/` | primitives, groups, components, collections, operations, boolean, constraints, views/sheets | all spec combinations tidak memiliki active fixture |
| Geometry integration | `relgeo/geometry` consumer | `core/src/resolver/geometry-utils.ts`, `intersection.ts`, `path-modifiers.ts`, primitive resolvers | bbox, intersections, transforms, modifiers, split, boolean engine | geometry package punya batas dan approximation sendiri; lihat geometry matrix |
| Renderer integration | `relgeo/renderer-svg` consumer/dev dependency | `renderer-svg/src/`, core tests/fixtures | resolved scene shape consumed by SVG renderer | core tidak memiliki renderer runtime dependency dalam public API; browser visual parity di luar audit |
| Shared fixture/integration | `relgeo/workspace` | `fixtures/manifest.json`, `scripts/run-conformance-fixtures.mjs` | active/legacy/invalid/runtime-error coverage | conformance memakai built artifacts; remote CI/current submodule sync tidak fresh |
| Integration baseline | `relgeo/workspace` | `docs/integration-baseline.json` | pinned package revisions and compatibility line | captured `2026-10-09`, historical snapshot, bukan current HEAD proof |

## Actual implementation findings

### Parse and validation pipeline

`parseRelGeo` loads YAML, defaults omitted version to active `0.5`, classifies supported legacy/regression-only versions, rejects unsupported versions with `UNSUPPORTED_SPEC_VERSION`, validates top-level/object fields, injects IDs, and calls `Validator` outside editor mode (`core/src/parser.ts:5-33,144-267`). `parseForEditor` intentionally uses tolerant editor mode (`parser.ts:99-103,140-148`). `Validator.validate()` checks identifiers, parameters, expressions, constraints, scene, sheets/views, and recursively validates component definitions (`core/src/validator.ts:94-129`).

The core type model explicitly includes document sections, object types, constraints, views/sheets, `RelGeoErrorCode`, and `RelGeoError` with optional path/object/dependency metadata (`core/src/types.ts:15-90,492-591,596-651`). This is the central semantic contract consumed by resolver and language-service, but it is not generated from `spec/id/`.

### Graph and evaluator

The graph extracts dependencies from placements, paths, holes, groups, repeats, divides, operations, components, transforms, and expressions (`core/src/graph.ts:51-454`). `sortObjects`, `sortUnified`, and `sortNodes` provide topological order and detect cycles with `ResolveError` (`graph.ts:802-973`). Resolver uses unified ordering for objects plus derived values and preserves declaration order in final scene output (`core/src/resolver/index.ts:89-143`).

The evaluator supports typed scalar/member/index access, arithmetic/logical/comparison/ternary expressions, units, geometry queries, intersections/selectors, and world/local transforms (`core/src/evaluator.ts:1-17,42-105,570-760,1980-2050`). Unit normalization/conversion covers px/mm/cm/m/in and angle handling (`core/src/units.ts:1-120`). Tests cover unit conversion, typed evaluation, geometry queries, derived values, cycles, and invalid expression boundaries.

### Resolve and semantic output

`compileRelGeo` is the high-level parse/validate/resolve entrypoint; `resolveGeometry` validates in `compile`/`validate` modes, resolves values and object/derived nodes, processes constraints after geometry, calculates bbox, resolves views/sheets, and returns a `ResolvedScene` (`core/src/resolver/index.ts:22-46,89-155,174-328`). Core imports geometry utilities and engines through the resolver, while renderer-svg consumes the resulting resolved types and bbox. This establishes a real core → geometry → renderer boundary, but not an automatic guarantee that every spec capability is exposed in every consumer.

Constraint processing returns structured `violations` without changing resolved geometry (`core/src/resolver/constraints.ts:43-186`; `core/src/resolver/index.ts:145-155`). Views filter objects by roles and scale bbox; sheets resolve named sizes, orientation, view placements, and metadata (`resolver/index.ts:174-328`).

### Error and diagnostic behavior

Core has typed `ParseError`, `ValidationError`, and `ResolveError`, with path/code/object metadata in the normal pipeline (`parser.ts:35-45`, `validator.ts:80-91`, `resolver/types.ts:22-33`). However, many evaluator/eval-context/resolver paths still throw raw `Error` strings, while the declared `RelGeoErrorCode` union is not exhaustive. A concrete confirmed example is `fixtures/manifest.json` expecting `BOOLEAN_EMPTY_RESULT` for fixture 19, while `core/src/types.ts:596-643` contains `BOOLEAN_MULTIPART_RESULT` but not `BOOLEAN_EMPTY_RESULT`; evaluator code also emits several codes not present in the union. This is recorded as `⚠️`, not merely `not verified`.

## Consumer and fixture evidence

| Boundary | Actual evidence | What it proves | Limit |
| --- | --- | --- | --- |
| Geometry | `core/src/index.ts:1-8`; resolver imports from `@relgeo/geometry`; geometry suite `66/66` | core is wired to geometry types/utilities/engines | geometry API/precision boundaries remain separate |
| Renderer | renderer imports resolved types/bbox; renderer suite `79/79`; shared snapshots | resolved scene shape is consumable by SVG renderer | no browser visual runtime proof in this audit |
| Active relational baseline | fixture 10, expected JSON/SVG/highlight; conformance | parse, resolve, bbox/scene, renderer/CLI/plugin projections align for declared surface | one fixture is not exhaustive |
| Runtime constraint diagnostic | fixture 14, expected violation and SVG | post-resolve violation survives core and renderer boundary | coverage centers on `align`; other constraint kinds need independent evidence |
| Boolean/intersection | fixture 15 active, fixtures 19/20 runtime errors, decision 08 | bounded boolean/intersection and empty/multipart boundaries are exercised | active scope is narrower than all core/geometry methods |
| Invalid/version diagnostics | fixtures 11–13, 17–18 | parser/language-service paths reject malformed/unknown inputs with expected messages | no complete error-code catalog assertion |
| Integration baseline | `docs/integration-baseline.json:1-59` pins core `0.5.1`, geometry `0.5.0`, renderer `0.5.0`, compatibility `0.5`, and child revisions | historical cross-repo baseline and release order context | captured 2026-10-09; not current revision evidence |

## Direct verification recorded in this audit

| Command | Result | Evidence meaning |
| --- | --- | --- |
| `pnpm --filter @relgeo/core test` | PASS — 44 files, 427 tests | parser, validator, evaluator, graph, resolver, units, constraints, fixture tests execute |
| `pnpm --filter @relgeo/geometry test` | PASS — 4 files, 66 tests | direct geometry dependency boundary executes |
| `pnpm --filter @relgeo/renderer-svg test` | PASS — 6 files, 79 tests | renderer consumer boundary executes |
| `pnpm conformance:fixtures` | PASS — 260/260 across 20 fixtures | active/invalid/runtime-diagnostic/runtime-error and downstream snapshots execute from built artifacts |

All commands ran with Node `22.23.2`, while root metadata requires Node `>=24`; the engine warning did not cause a test failure. Node >=24 canonical execution, registry install, current remote CI, current Flutter run, and browser runtime are `not verified` here.

## Material gaps, dependencies, and confirmed problem

1. `RelGeoErrorCode` and actual emitted error strings have drifted. `BOOLEAN_EMPTY_RESULT` is expected by fixture 19 but missing from the declared union; raw `Error` is used in evaluator and several resolver paths. A stable diagnostic catalog/normalization layer is needed before claiming complete error-model parity.
2. Parser, validator, evaluator, and resolver contain the implementation contract, but no generated contract is derived from the normative spec. Version, fields, functions, anchors, and error codes can drift across core and language-service.
3. Core supports broad geometry/object semantics, but active fixture evidence is intentionally bounded. Passing the evaluator/unit candidate does not promote that capability across all consumers.
4. `docs/integration-baseline.json` is a historical pinned snapshot. It is useful for provenance and release order, but it cannot prove current child repository state.
5. The general constraint solver is intentionally not implemented: core validates explicit relations and reports violations after resolve. This is an explicit `➖` boundary, not a missing runtime feature.
