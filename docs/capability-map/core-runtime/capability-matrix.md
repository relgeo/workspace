# RelGeo core runtime capability matrix

> **Coverage statement — 2026-11-05.** This matrix covers the `core/` parse,
> validation, graph, evaluator, resolver, units, diagnostics, and consumer
> boundaries using source, unit/integration tests, shared fixtures, package
> metadata, and CLI/language-service/renderer/Playground evidence. It does not
> claim every DSL branch, every error path, or current public-package parity.
> Node 24 canonical, registry, current CI, and platform runtime checks remain
> `not verified` where stated; a missing row is not evidence of absence.
> See [inventory protocol](../INVENTORY-PROTOCOL.md) for status axes and evidence tiers.

Status dokumen: audit baseline refreshed, 2026-11-05
Surface: `core/`  
Owner: `relgeo/core`  
Compatibility line: `0.5.x`  
Evidence log: [core-runtime/archive/implementation-audit-legacy.md](./archive/implementation-audit-legacy.md)

## Status legend

| Status | Arti audit | Tidak berarti |
| --- | --- | --- |
| `✔️` | Capability tersedia pada core boundary dan punya evidence langsung. | Semua syntax/consumer edge case sudah parity. |
| `🌗` | Implementasi tersedia sebagian atau evidence/consumer scope masih terbatas. | Capability selesai end-to-end. |
| `❌` | Capability yang diharapkan pada core boundary sudah diperiksa dan belum tersedia. | Consumer lain otomatis gagal. |
| `➖` | Capability sengaja bukan tanggung jawab core atau eksplisit tidak diperlukan. | Pekerjaan tertunda. |
| `⏸️` | Capability ditahan oleh keputusan/promotion/dependency. | Capability gagal. |
| `⚠️` | Mismatch atau problem terkonfirmasi pada source, type, atau consumer contract. | Evidence yang belum diverifikasi. |

`not verified` adalah state evidence, bukan simbol. Matrix mencantumkan status core berdasarkan source/test/fixture dan menulis batas current runtime secara terpisah.

## Current reconciled result

The canonical one-to-one join is [`status-matrix.md`](./status-matrix.md): 38
expected IDs and 38 matrix rows, with **38 `✔️`, 0 `🌗`, 0 `❌`, and 0 `⚠️`**.
The former P0/P1 queue and P2 consumer candidate are closed at the local
contract boundary; residual host, registry, CI, and browser evidence is
qualified separately in the [closure report](./closure-report-2026-11-05.md).

## Capability matrix

| Capability | Status | Evidence | Gap / limitation | Consumer | Dependency | Next action |
| --- | --- | --- | --- | --- | --- | --- |
| Public core package/API and compatibility line `0.5.x` | `✔️` | `core/src/index.ts:1-8`, `core/package.json`, `docs/integration-baseline.json` | Fresh registry install dan current published artifact tidak diverifikasi; package/matrix metadata drift remains in compatibility check | CLI, language-service, renderer/dev tests, plugins | geometry `0.5.x`, package release order | Run Node >=24 package boundary and reconcile metadata before release audit |
| YAML parse, root/object structural validation, ID injection | `✔️` | `core/src/parser.ts:144-267`; invalid fixtures 11–13 and 21–23; Core 537 tests; full workspace tests pass | Editor mode intentionally tolerant; strict/compile boundary must remain explicit | Playground, language-service, CLI | js-yaml, validator | Keep editor vs compile behavior in consumer docs |
| Version acceptance: active 0.5, legacy 0.4, regression 0.1–0.3, unsupported future | `✔️` | `parser.ts:5-33,161-173`; fixtures 17/18; manifest version policy | Policy duplicated in parser, manifest, language-service schema | all DSL consumers | synchronized compatibility metadata | Add drift check for version declarations |
| Validation of identifiers, parameters, expressions, constraints, scene, views/sheets, components | `✔️` | `core/src/validator.ts:94-129,1392-1665`; validation tests | Not every normative error code has shared fixture | core resolver, language-service | evaluator, object type tables | Generate validator/error coverage report |
| Editor/validate/compile modes | `✔️` | `parser.ts:99-103,140-148`; `tolerant_resolver.test.ts`, `validation_modes.test.ts` | Tolerant editor output can be mistaken for valid compile output | Playground, language-service, CLI | mode propagation through parser/resolver | Keep mode in public API documentation |
| Dependency extraction for objects, derived values, placements, groups, repeats, operations, components | `✔️` | `core/src/graph.ts:51-454`; graph tests; resolver uses `sortUnified` | Complex dependency coverage is distributed across many tests | resolver, CLI graph output | expression parser, object references | Add generated dependency fixture summary |
| Deterministic topological sort and circular dependency errors | `✔️` | `graph.ts:802-973`; `group_cycles.test.ts`, `dependency_v03.test.ts` | No single shared fixture for all cycle categories | core, CLI, language-service | `ResolveError`, dependency chain | Add cross-consumer cycle diagnostic fixture |
| Typed expression evaluator and syntax validation | `✔️` | `core/src/evaluator.ts:42-105,1980-2050`; evaluator tests 422+ coverage; language-service consumes behavior indirectly | Function/type vocabulary is duplicated from spec/language-service | derived values, placement, queries, CLI | units, geometry resolver context | Add spec-to-function drift check |
| Geometry query functions and intersection selectors | `✔️` | evaluator `570-760`; core `v03_integration.test.ts`, `intersection_engine.test.ts` | Some query errors are raw Error; precision/approximation belongs to geometry boundary | core derived values, language-service diagnostics | geometry intersection/path utilities | Normalize query errors and document numeric limits |
| Units and target-unit normalization | `✔️` | `core/src/units.ts:1-120`; `units.test.ts`, `unit_system.test.ts`; fixture 16 uses explicit `cliUnit` | Evaluator/unit candidate remains not active across every consumer | core, CLI, renderer, Flutter candidate | conversion constants, scene unit | Keep candidate status until promotion decision |
| Unified parse → resolve → `ResolvedScene` semantic engine | `✔️` | `core/src/resolver/index.ts:22-46,89-155,174-328`; resolver/reference fixture tests | Broad engine behavior exceeds active fixture coverage | CLI, renderer-svg, Playground, plugins | geometry, graph, evaluator, text metrics | Add capability-to-fixture coverage map |
| Primitive, group, clone, component, repeat, divide, split, operation resolution | `✔️` | `core/src/resolver/primitives/`; component/repeat/split/operation tests; fixtures 19–27 | Active v0.5 result/error boundaries are covered; future combinations are additive scope | renderer, CLI, Playground, Flutter | geometry algorithms and graph | Maintain supported operation fixtures |
| Boolean and closed-shape resolution | `✔️` | `resolver/primitives/shapes.ts`; fixtures 15, 19, 20, 24–27; geometry topology tests | Declared v0.5 single/multi/closed-shape boundary is executable; broader topology is future scope | renderer, CLI, Flutter semantic projection | geometry boolean engine, result mode policy | Maintain bounded contract and add only promoted modes |
| Constraint validation and post-resolve violations | `✔️` | `resolver/constraints.ts`; `constraints_diagnostics.test.ts`; fixture 14; conformance/Flutter tests retain scene and order | Stable severity/origin/expected/actual schema is closed locally; new relations are additive | renderer overlays, language-service, CLI, Playground | resolved geometry and constraint policy | Maintain relation fixtures; no automatic solver |
| Views, sheets, role filters, scale, placements, bbox | `✔️` | `resolver/index.ts:174-328`; `sheet_view.test.ts`; legacy fixtures 02–09 | Most shared presentation fixtures are legacy 0.4; current v0.5 active coverage is smaller | renderer-svg, CLI, website, Flutter | bbox, units, renderer | Add active v0.5 view/sheet fixture set |
| Stable error objects with code/path/object/dependency metadata | `✔️` | `ParseError`, `ValidationError`, `ResolveError`; `core/src/errors.ts`, `diagnostics.ts`; structured fixtures and catalog test | Production raw-throw inventory is clean; source-range depth remains explicitly bounded | language-service, CLI, Playground | error normalization/catalog | Maintain source-range and consumer projection tests |
| Error-code catalog parity with actual emitted/runtime errors | `✔️` | `core/src/errors.ts`, `types.ts`, `closure_contracts.test.ts`; runtime fixtures 19/20/22/27 | Normative spec-code membership, public union, normalization, and raw-boundary inventory agree | language-service, CLI, fixtures | central diagnostic catalog | Maintain additive emitted-code assertion |
| Geometry integration | `✔️` | core exports geometry; resolver imports bbox/intersection/path/boolean/split; geometry 66/66 | Geometry approximation and package boundary limitations remain separate | core, renderer-svg | `@relgeo/geometry` | Keep ownership split documented |
| Renderer-ready resolved scene contract | `✔️` | renderer consumes core/geometry types; renderer 79/79; conformance snapshots | Core does not own SVG rendering or browser visual parity | renderer-svg, CLI, Markdown, Playground | renderer package, XML safety | Preserve semantic/snapshot conformance |
| Shared fixture compatibility evidence | `✔️` | manifest 27 fixtures; `node scripts/run-conformance-fixtures.mjs` `401/401`; Core `49` files/`537` tests; fixtures 10/14/15/19–27 | Fixture pass is declared-surface evidence, not exhaustive spec proof; Node 24, CI, browser, and Flutter parity remain unverified here | all listed consumers | built dist artifacts, root runner | Maintain fixture status semantics and keep host evidence separate |
| Integration baseline and pinned cross-repo provenance | `✔️` | `docs/integration-baseline.json`, compatibility `283/283`, joined evidence test | Current local metadata and revision joins are checked; strict clean-baseline/remote CI remains external | workspace orchestration, release gates | submodule pointers and CI | Refresh clean canonical baseline when publishing |
| General constraint solver / automatic geometry mutation to satisfy constraints | `➖` | spec boundary; core `processConstraints` reports violations after resolve | Explicitly not a core requirement | no consumer required | product contract | Keep as documented non-goal |
| Evaluator/unit promotion from candidate to active compatibility line | `⏸️` | manifest fixture 16 status `capability`; plans/decision keep promotion open | Local core/CLI snapshots pass, but cross-consumer decision/evidence incomplete | core, CLI, Flutter | Flutter parity, promotion decision | Do not promote without explicit decision record |
| Core build/registry/current toolchain verification | `✔️` | Core test/lint/build, compatibility 283/283, consumer gates | Local Node 22 build is green; canonical Node >=24, registry, and current CI remain unverified evidence | npm consumers | Node/pnpm, package artifacts | Run canonical Node >=24/package audit when environment is available |

## Priority order

1. Maintain emitted-code/spec agreement and source-range/nullability coverage as additive contract work.
2. Add generated or checked maps for versions, object fields, functions, anchors, and error codes as maintenance.
3. Preserve the active-vs-candidate boundary for fixture 16 evaluator/unit promotion.
4. Expand fixtures only for newly promoted operations, views/sheets, constraints, and query error paths.
5. Refresh clean integration baseline and run canonical Node >=24/package boundary validation before release claims.

## Current validation handoff — 2026-11-05

| Boundary | Evidence | Remaining limitation / next action |
| --- | --- | --- |
| Core focused and full suite | 14 focused files/175 tests; 49 full-suite files/537 tests; lint and build pass | Local Node 22 only; canonical Node 24 remains external evidence. |
| Direct TypeScript consumers | Language-service 90 tests, renderer 104 tests, CLI 38 tests, remark-relgeo 16, remark-relgeo-hl 10 + boundary, Playground 107; builds pass | Browser, Flutter/native host, CI, and registry evidence remain separate. |
| Shared fixtures | 401 passed/0 failed across 27 fixtures | Local E3 evidence; structured invalid code/phase/path assertions now replay through Core, language-service, and CLI; not public-package or cross-host parity. |
| Integration gate | `pnpm run integration:gate -- --local` stopped before stages because host Node is 22.23.2 and gate requires `>=24` | Environment-unavailable; rerun under Node >=24. |

Remaining implementation gaps and next actions are canonical in the [status
matrix](./status-matrix.md), [implementation-gap backlog](./implementation-gap-backlog.md),
and [coverage handoff](./coverage-validation-handoff.md). No release,
deployment, or public parity claim is made by this matrix.
