# RelGeo core runtime capability matrix

> **Coverage statement — 2026-11-04.** This matrix covers the `core/` parse,
> validation, graph, evaluator, resolver, units, diagnostics, and consumer
> boundaries using source, unit/integration tests, shared fixtures, package
> metadata, and CLI/language-service/renderer/Playground evidence. It does not
> claim every DSL branch, every error path, or current public-package parity.
> Node 24 canonical, registry, current CI, and platform runtime checks remain
> `not verified` where stated; a missing row is not evidence of absence.
> See [inventory protocol](../INVENTORY-PROTOCOL.md) for status axes and evidence tiers.

Status dokumen: audit baseline refreshed, 2026-11-04
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
expected IDs and 38 matrix rows, with **23 `✔️`, 14 `🌗`, 0 `❌`, and 1 `⚠️`**.
The fourteen P0/P1 implementation-closable IDs are a work queue, not closure.
`CORE-CONSTRAINT-002`, `CORE-DIAG-001`, and `CORE-DIAG-002` remain `🌗`, while
`CORE-ERROR-003` remains `⚠️`.

## Capability matrix

| Capability | Status | Evidence | Gap / limitation | Consumer | Dependency | Next action |
| --- | --- | --- | --- | --- | --- | --- |
| Public core package/API and compatibility line `0.5.x` | `✔️` | `core/src/index.ts:1-8`, `core/package.json`, `docs/integration-baseline.json` | Fresh registry install dan current published artifact tidak diverifikasi; package/matrix metadata drift remains in compatibility check | CLI, language-service, renderer/dev tests, plugins | geometry `0.5.x`, package release order | Run Node >=24 package boundary and reconcile metadata before release audit |
| YAML parse, root/object structural validation, ID injection | `✔️` | `core/src/parser.ts:144-267`; invalid fixtures 11–13 and 21–23; Core 489 tests; full workspace tests pass | Editor mode intentionally tolerant; strict/compile boundary must remain explicit | Playground, language-service, CLI | js-yaml, validator | Keep editor vs compile behavior in consumer docs |
| Version acceptance: active 0.5, legacy 0.4, regression 0.1–0.3, unsupported future | `✔️` | `parser.ts:5-33,161-173`; fixtures 17/18; manifest version policy | Policy duplicated in parser, manifest, language-service schema | all DSL consumers | synchronized compatibility metadata | Add drift check for version declarations |
| Validation of identifiers, parameters, expressions, constraints, scene, views/sheets, components | `✔️` | `core/src/validator.ts:94-129,1392-1665`; validation tests | Not every normative error code has shared fixture | core resolver, language-service | evaluator, object type tables | Generate validator/error coverage report |
| Editor/validate/compile modes | `✔️` | `parser.ts:99-103,140-148`; `tolerant_resolver.test.ts`, `validation_modes.test.ts` | Tolerant editor output can be mistaken for valid compile output | Playground, language-service, CLI | mode propagation through parser/resolver | Keep mode in public API documentation |
| Dependency extraction for objects, derived values, placements, groups, repeats, operations, components | `✔️` | `core/src/graph.ts:51-454`; graph tests; resolver uses `sortUnified` | Complex dependency coverage is distributed across many tests | resolver, CLI graph output | expression parser, object references | Add generated dependency fixture summary |
| Deterministic topological sort and circular dependency errors | `✔️` | `graph.ts:802-973`; `group_cycles.test.ts`, `dependency_v03.test.ts` | No single shared fixture for all cycle categories | core, CLI, language-service | `ResolveError`, dependency chain | Add cross-consumer cycle diagnostic fixture |
| Typed expression evaluator and syntax validation | `✔️` | `core/src/evaluator.ts:42-105,1980-2050`; evaluator tests 422+ coverage; language-service consumes behavior indirectly | Function/type vocabulary is duplicated from spec/language-service | derived values, placement, queries, CLI | units, geometry resolver context | Add spec-to-function drift check |
| Geometry query functions and intersection selectors | `✔️` | evaluator `570-760`; core `v03_integration.test.ts`, `intersection_engine.test.ts` | Some query errors are raw Error; precision/approximation belongs to geometry boundary | core derived values, language-service diagnostics | geometry intersection/path utilities | Normalize query errors and document numeric limits |
| Units and target-unit normalization | `✔️` | `core/src/units.ts:1-120`; `units.test.ts`, `unit_system.test.ts`; fixture 16 uses explicit `cliUnit` | Evaluator/unit candidate remains not active across every consumer | core, CLI, renderer, Flutter candidate | conversion constants, scene unit | Keep candidate status until promotion decision |
| Unified parse → resolve → `ResolvedScene` semantic engine | `✔️` | `core/src/resolver/index.ts:22-46,89-155,174-328`; resolver/reference fixture tests | Broad engine behavior exceeds active fixture coverage | CLI, renderer-svg, Playground, plugins | geometry, graph, evaluator, text metrics | Add capability-to-fixture coverage map |
| Primitive, group, clone, component, repeat, divide, split, operation resolution | `🌗` | `core/src/resolver/primitives/`; core tests for component/repeat/split/operations | Implementation is broad but not all result shapes and error paths are active cross-consumer contract | renderer, CLI, Playground, Flutter | geometry algorithms and graph | Add active fixtures for under-covered operation families |
| Boolean and closed-shape resolution | `🌗` | `resolver/primitives/shapes.ts`; fixture 15 active; fixtures 19/20 errors; geometry Clipper engine | Active contract limited to declared line/rectangle scope; union/xor/non-rect expansion held | renderer, CLI, Flutter semantic projection | geometry boolean engine, result mode policy | Preserve bounded contract; separate future promotion |
| Constraint validation and post-resolve violations | `🌗` | `resolver/constraints.ts:43-186`; `constraints_diagnostics.test.ts`; fixture 14; focused semantic-contract test retains scene and order | Core now emits severity/origin/expected/actual locally; relation/topology coverage and cross-consumer rendering remain open | renderer overlays, language-service, CLI, Playground | resolved geometry and constraint policy | Extend relation matrix and cross-surface comparator coverage |
| Views, sheets, role filters, scale, placements, bbox | `✔️` | `resolver/index.ts:174-328`; `sheet_view.test.ts`; legacy fixtures 02–09 | Most shared presentation fixtures are legacy 0.4; current v0.5 active coverage is smaller | renderer-svg, CLI, website, Flutter | bbox, units, renderer | Add active v0.5 view/sheet fixture set |
| Stable error objects with code/path/object/dependency metadata | `🌗` | `ParseError`, `ValidationError`, `ResolveError`; `core/src/errors.ts`, `diagnostics.ts`; focused semantic-contract tests; fixture invalid/runtime errors | Public boundaries are normalized locally, but raw internal throw/source-range coverage is still bounded | language-service, CLI, Playground | error normalization/catalog | Audit remaining internal raw throws and source-range/nullability paths |
| Error-code catalog parity with actual emitted/runtime errors | `🌗` | `core/src/errors.ts`, `types.ts`, diagnostics tests; fixtures 19/20/22 exercise registered runtime codes; local prefixed-code audit passes | Covered public catalog mismatch is repaired; exhaustive non-prefixed/internal throw inventory and current published parity remain unverified | language-service, CLI, fixtures | central diagnostic catalog | Maintain emitted-code inventory and add regressions for uncovered raw paths |
| Geometry integration | `✔️` | core exports geometry; resolver imports bbox/intersection/path/boolean/split; geometry 66/66 | Geometry approximation and package boundary limitations remain separate | core, renderer-svg | `@relgeo/geometry` | Keep ownership split documented |
| Renderer-ready resolved scene contract | `✔️` | renderer consumes core/geometry types; renderer 79/79; conformance snapshots | Core does not own SVG rendering or browser visual parity | renderer-svg, CLI, Markdown, Playground | renderer package, XML safety | Preserve semantic/snapshot conformance |
| Shared fixture compatibility evidence | `✔️` | manifest 23 fixtures; `node scripts/run-conformance-fixtures.mjs` `298/298`; Core `48` files/`489` tests; fixtures 10/14/15/19–23 | Fixture pass is declared-surface evidence, not exhaustive spec proof; Node 24, CI, browser, and Flutter parity remain unverified here | all listed consumers | built dist artifacts, root runner | Maintain fixture status semantics and keep host evidence separate |
| Integration baseline and pinned cross-repo provenance | `🌗` | `docs/integration-baseline.json:1-59`, core revision/package metadata | Captured 2026-10-09; not proof of current HEAD/remote CI | workspace orchestration, release gates | submodule pointers and CI | Refresh baseline before current release claim |
| General constraint solver / automatic geometry mutation to satisfy constraints | `➖` | spec boundary; core `processConstraints` reports violations after resolve | Explicitly not a core requirement | no consumer required | product contract | Keep as documented non-goal |
| Evaluator/unit promotion from candidate to active compatibility line | `⏸️` | manifest fixture 16 status `capability`; plans/decision keep promotion open | Local core/CLI snapshots pass, but cross-consumer decision/evidence incomplete | core, CLI, Flutter | Flutter parity, promotion decision | Do not promote without explicit decision record |
| Core build/registry/current toolchain verification | `🌗` | package scripts and local tests pass | Node 22 local warning vs required >=24; registry/current CI not verified | npm consumers | Node/pnpm, package artifacts | Run canonical Node >=24 build/lint/test and package audit |

## Priority order

1. Complete the error-code/type catalog inventory and normalize remaining raw evaluator/resolver errors.
2. Add a generated or checked contract map for versions, object fields, functions, anchors, and error codes shared by parser, validator, evaluator, and language-service.
3. Preserve active-vs-candidate boundaries for boolean and evaluator/unit capabilities.
4. Expand active fixtures for under-covered operations, views/sheets, constraints, and query error paths.
5. Refresh current integration baseline and run canonical Node >=24/package boundary validation before release claims.

## Current validation handoff — 2026-11-04

| Boundary | Evidence | Remaining limitation / next action |
| --- | --- | --- |
| Core focused and full suite | 14 focused files/175 tests; 48 full-suite files/489 tests; lint and build pass | Local Node 22 only; keep partial/broken rows until broader contract evidence is complete. |
| Direct TypeScript consumers | Language-service 82 tests, renderer 92 tests plus dist boundary, CLI 36 tests, remark-relgeo 9, remark-relgeo-hl 6; builds pass | Browser, Flutter/native host, CI, and registry evidence remain separate. |
| Shared fixtures | 298 passed/0 failed across 23 fixtures | Local E3 evidence; not public-package or cross-host parity. |
| Integration gate | `pnpm run integration:gate -- --local` stopped before stages because host Node is 22.23.2 and gate requires `>=24` | Environment-unavailable; rerun under Node >=24. |

Remaining implementation gaps and next actions are canonical in the [status
matrix](./status-matrix.md), [implementation-gap backlog](./implementation-gap-backlog.md),
and [coverage handoff](./coverage-validation-handoff.md). No release,
deployment, or public parity claim is made by this matrix.
