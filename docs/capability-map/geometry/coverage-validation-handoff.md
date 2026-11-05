# Geometry coverage validation and handoff

**Tanggal validasi:** 2026-11-04
**Scope:** expected catalog → implementation audit → reconciliation → status matrix → implementation-gap backlog  
**Required context:** [`docs/REPOSITORY-MAP.md`](../../REPOSITORY-MAP.md), [`docs/MATURATION-MASTER-PLAN.md`](../../MATURATION-MASTER-PLAN.md)

## 1. Hasil validasi

Artefak baseline geometry siap untuk review manusia sebagai dokumentasi dan
evidence map. Validasi ini **tidak** menyatakan surface geometry, consumer,
Flutter, atau release pipeline lengkap.

Klaim yang aman:

- expected catalog memiliki **40 capability ID** dari requirement, user
  journey, workflow, contract DSL, roadmap, fixture policy, dan keputusan scope;
- implementation audit memetakan **40/40 ID** ke source/test/fixture/consumer
  evidence pada boundary yang diperiksa;
- reconciliation, status matrix, dan catalog masing-masing memiliki **40 row**
  tanpa missing, extra, atau duplicate ID;
- matrix memuat **17 `✔️`, 23 `🌗`, 0 `❌`, 0 `➖`, 0 `⏸️`, dan 0 `⚠️`**;
  evidence qualifier `not-verified` tetap dipisahkan dari implementation
  status dan tidak menjadi row status tersendiri;
- setiap 23 row `🌗` memiliki satu candidate task di backlog dengan owner,
  dependency, acceptance test/evidence target, dan next action;
- dokumentasi ini dan backlog tidak menutup gap implementasi atau mempromosikan
  local evidence menjadi canonical/public/native-host evidence.

Current `❌` berjumlah nol karena audit menemukan minimal satu observed boundary
untuk setiap expected ID. Jika audit berikutnya menemukan capability tanpa
implementation/consumer behavior, ID tersebut wajib dipertahankan dan diberi
`❌`; tidak boleh disembunyikan atau diubah menjadi `➖`.

## 2. Rantai artefak

| Artefak | Fungsi | Hasil validasi |
| --- | --- | --- |
| [Expected catalog](./expected-capability-catalog.md) | Daftar capability yang diharapkan sebelum audit, dengan outcome, requirement, scope, owner, dan status awal | 40 unique IDs; source register dan scope exclusions tersedia |
| [Implementation audit](./archive/implementation-audit-legacy.md) | Observed source, test, consumer, command/UI, runtime, fixture, dan docs evidence | Coverage ledger tersedia; 40/40 expected IDs diaudit; limitations eksplisit |
| [Reconciliation](./reconciliation.md) | Join satu-ke-satu expected-versus-observed | 40/40 rows; no missing/extra/duplicate; implementation/evidence/scope terpisah |
| [Status matrix](./status-matrix.md) | Reporting view capability-first | 40 rows; kolom status/evidence/gap/owner/dependency/risk/next action lengkap |
| [Implementation-gap backlog](./implementation-gap-backlog.md) | Candidate implementation goals/tasks | 23/23 remaining `🌗` rows memiliki task; bounded serialization/replay evidence dan `FIX-GEO-PROVENANCE-001` memiliki local fix evidence |
| [Historical geometry matrix](./capability-matrix.md) | Historical inventory dan evidence lama | Dipertahankan sebagai historical input, bukan source expected list |

## 3. Checklist coverage dan integrity

| Check | Result | Evidence / interpretation |
| --- | --- | --- |
| Coverage report exists | PASS | Audit §2 mencatat package source, geometry tests, core, renderer, CLI, browser UI, Flutter, fixtures, product/roadmap/contract docs, dan runtime/config/platform. |
| Required discovery source categories recorded | PASS | Audit §2 mencakup source/API, test, consumer/UI/command, fixture, runtime/config/platform, docs/roadmap/contract, dan ownership boundaries. |
| Expected IDs represented | PASS | Catalog, reconciliation, dan status matrix masing-masing 40 unique ID. |
| One reconciliation per expected ID | PASS | 40 expected = 40 reconciled; missing/extra/duplicate = 0. |
| Matrix capability-first | PASS | Row keyed by `GEO-*` capability ID, bukan by source module atau test file. |
| Full status legend | PASS | Matrix menggunakan tepat enam status implementasi: `✔️`, `🌗`, `❌`, `➖`, `⏸️`, dan `⚠️`. `not-verified` adalah evidence state terpisah, bukan status implementasi. |
| Evidence class separated | PASS | Audit memisahkan `local-pass`, `fixture-pass`, `source-only`, dan `not-verified`; local/candidate/historical tidak dipromosikan diam-diam. |
| Scope decisions preserved | PASS | Catalog mempertahankan `IN`, `IN WITH BOUNDARY`, dan `OUT`; matrix memisahkan ownership `➖` serta deferred `⏸️` dari implementation status. |
| Limitation stated | PASS | Node 22 versus root requirement Node >=24, current Flutter SDK permission block, canonical/public/registry refresh, and cross-platform replay limits are recorded. |
| Unresolved questions recorded | PASS | §5 lists serialization, fixture promotion, numeric policy, boolean topology, ownership, runtime refresh, and provenance/error wording questions. |
| Gap handoff separated from implementation | PASS | Backlog says candidate task/evidence target is not implementation and does not start goals or change capability status; documentation-only findings are not counted as feature implementation. |
| Required paths resolve | PASS | `docs/capability-map`, `docs/REPOSITORY-MAP.md`, `docs/MATURATION-MASTER-PLAN.md`, compatibility matrix, plans, and fixture manifest are linked/readable. |

## 4. Discovery coverage boundary

Audit discovery covers the following bounded surface:

1. `geometry/` package exports, types, transforms, utilities, intersections,
   path modifiers, split, boolean normalization/engine, errors, package
   metadata, README, and direct geometry tests;
2. core resolver/evaluator/graph/units/diagnostics and the core test suite;
3. renderer-SVG resolved-object consumption, SVG primitives, semantic
   projection, and renderer tests;
4. CLI command and output consumers: `info`, `compile`, `check`/`validate`,
   JSON/SVG/graph, profile/parameter/unit/sheet options;
5. Playground editor/preview/inspector/graph/parameters/share/export and
   keyboard/gesture assumptions, recorded as consumer ownership rather than
   geometry ownership;
6. Flutter geometry/evaluator/boolean/SVG projection/workbench source and
   tests, with current SDK execution separately qualified;
7. `fixtures/manifest.json`, reference/expected snapshots, active/candidate/
   invalid/runtime-error fixtures, and conformance runner;
8. master plan, compatibility matrix, Flutter alignment/promotion plans,
   `spec/id/geometry`, `spec/id/syntax`, `spec/id/core`, repository map,
   inventory protocol, and surface discovery ledger;
9. runtime/config/platform evidence including package scripts, Node requirement,
   pnpm, Flutter staging flow, and integration baseline.

This is a coverage report for the declared geometry boundary, not a claim that
every browser, registry, CI, native platform, package version, input topology,
or consumer combination has been executed. The expected catalog covers the 40
IDs declared by its scope; verification and implementation remain incomplete,
as shown by the non-green rows and open questions below.

### Capability-category coverage proof

The nine declared capability categories below are present in the expected
catalog, implementation audit, reconciliation, and status matrix. The count is
a coverage count, not a claim that every behavior in the category is complete.

| Category | Expected IDs reviewed | Reconciliation section | Result |
| --- | ---: | --- | --- |
| A. Object model and primitives | 6 | Reconciliation §3.A | PASS |
| B. Dimensions, units, and evaluator | 5 | Reconciliation §3.B | PASS |
| C. Transforms, placement, and anchors | 6 | Reconciliation §3.C | PASS |
| D. Collections and pattern generation | 5 | Reconciliation §3.D | PASS |
| E. Queries and intersections | 5 | Reconciliation §3.E | PASS |
| F. Constraints and diagnostics | 2 | Reconciliation §3.F | PASS |
| G. Boolean operations and closed-shape results | 2 | Reconciliation §3.G | PASS |
| H. Numerical robustness and deterministic behavior | 5 | Reconciliation §3.H | PASS |
| I. Serialization and semantic parity | 4 | Reconciliation §3.I | PASS |
| **Total** | **40** | **40 one-to-one rows** | **PASS** |

### Source-category coverage proof

These are the seven source categories declared by the audit ledger. Each has a
recorded path set and a qualification for unavailable or consumer-owned
evidence.

| Declared audit source category | Evidence path set | Result |
| --- | --- | --- |
| Source and public API | `geometry/src/`, `geometry/package.json`, `geometry/README.md`, `core/src/` | Reviewed; package/core ownership is separated |
| Tests and fixtures | `geometry/src/__tests__/`, `core/src/__tests__/`, `renderer-svg/src/__tests__/`, `fixtures/` | Reviewed; local and fixture results recorded |
| UI, routes, and commands | `cli/src/`, `playground/src/`, `flutter/lib/src/ui/` | Reviewed; consumer-owned surfaces are not claimed as geometry implementation |
| Configuration and build | root `package.json`, `geometry/tsconfig.json`, `geometry/tsup.config.ts`, `flutter/pubspec.yaml` | Reviewed; Node and Flutter environment limits recorded |
| Platform services and security | Flutter workbench services, Playground persistence/clipboard, renderer security tests | Reviewed; platform services remain outside low-level geometry ownership |
| Documentation and ownership | `docs/REPOSITORY-MAP.md`, master plan, capability-map ledger, geometry specs/plans | Reviewed; documentation is evidence/context, not feature implementation |
| Runtime evidence | package/core/renderer tests, lint/build, fixture conformance, Flutter probe | Reviewed; Flutter probe and canonical Node-24 evidence remain not verified |

## 5. Unresolved questions

These questions remain open and must not be silently resolved by the backlog or
by changing a status symbol:

| ID | Question | Affected capability / artefact |
| --- | --- | --- |
| `Q-GEO-001` | Apakah resolved-scene JSON canonical menjadi contract normatif atau hanya serialization contract consumer? | `GEO-SER-001`, `GEO-SER-002`, core, CLI, fixtures |
| `Q-GEO-002` | Apakah fixture 16 evaluator/unit dipromosikan menjadi active 0.5 contract, dan evidence consumer/platform apa yang diwajibkan? | `GEO-MEASURE-002`, `GEO-MEASURE-004`, `GEO-PARITY-001`, Flutter alignment |
| `Q-GEO-003` | Tolerance dan error bound mana yang menjadi public semantic policy versus implementation detail? | `GEO-NUM-001`, `GEO-PRIM-003`, `GEO-QUERY-002`, split/intersection |
| `Q-GEO-004` | Kapan union/xor/non-rectangle topology dianggap active contract, dan apa acceptance matrix single/multi/holes-nya? | `GEO-BOOLEAN-001`, `GEO-BOOLEAN-002`, promotion plan |
| `Q-GEO-005` | Apakah high-level query tetap core-owned atau sebagian low-level query perlu diekstrak sebagai public geometry API? | `GEO-QUERY-001` through `GEO-QUERY-005`, owner boundary |
| `Q-GEO-006` | Kapan current Node >=24, Flutter SDK, registry, CI, dan cross-platform replay dijalankan pada pointer workspace terbaru? | `GEO-DET-001`, `GEO-DET-002`, `GEO-PARITY-001/002`, evidence class |
| `Q-GEO-007` | Wording/provenance/error vocabulary final apa yang harus dipakai setelah stale `v0.3` text diperbaiki? | Resolved at the geometry package boundary by the 0.5 wording fix and regression test; consumer-specific vocabulary remains separate. |

## 6. Implementation handoff

Remaining implementation work remains a separate goal/task concern. The
published backlog records the bounded selected work as locally implemented and
keeps these candidate workstreams open:

1. `G-01` close object, primitive, transform, placement, and anchor semantics;
2. `G-02` promote dimensions, collections, queries, and constraint coverage;
3. `G-03` harden boolean, numeric, deterministic, and serialization contracts;
4. `G-04` close TypeScript/Flutter and semantic SVG parity evidence;
5. `GAP-GEO-DET-001` and `GAP-GEO-PARITY-*` close host/cross-runtime evidence;
6. deferred boolean union/xor/non-rectangle promotion remains held by decision.

Each remaining candidate task remains gated by its stated owner/dependency and
must produce source changes plus executable tests/fixtures/evidence before its
capability can move from `🌗` or `❌`; host evidence stays `not-verified` until
the required environment is available. This handoff does not create, start,
or mark any implementation goal complete.

## 7. Required evidence index

- [`geometry/README.md`](../../../geometry/README.md)
- [`geometry/package.json`](../../../geometry/package.json)
- [`docs/REPOSITORY-MAP.md`](../../REPOSITORY-MAP.md)
- [`docs/MATURATION-MASTER-PLAN.md`](../../MATURATION-MASTER-PLAN.md)
- [`capability-map/README.md`](../README.md)
- [`docs/compatibility-matrix.json`](../../compatibility-matrix.json)
- [`docs/plans/06-flutter-alignment.md`](../../plans/06-flutter-alignment.md)
- [`docs/plans/07-flutter-capability-promotion-and-svg-parity.md`](../../plans/07-flutter-capability-promotion-and-svg-parity.md)
- [`fixtures/manifest.json`](../../../fixtures/manifest.json)
- [`SURFACE-DISCOVERY-LEDGER.md`](../SURFACE-DISCOVERY-LEDGER.md)
- [`INVENTORY-PROTOCOL.md`](../INVENTORY-PROTOCOL.md)

## 8. Direct verification record

The following checks were run against the workspace during this handoff. They
are recorded as evidence, not as a claim that unavailable canonical or native
environments passed.

| Check | Result | Evidence qualification |
| --- | --- | --- |
| `pnpm lint` from `geometry/` | PASS | Local TypeScript static check |
| `pnpm test` from `geometry/` | PASS — 88/88 across 5 files | Fresh local package behavior, including normalization, selectors, tolerance, and stable errors |
| `pnpm build` from `geometry/` | PASS | Local TypeScript/tsup build evidence |
| `pnpm test` from `core/` | PASS — 452/452 across 48 files | Fresh local core consumer/projection/replay evidence; Node 22 qualified |
| `pnpm test` from `cli/` | PASS — 24/24 | CLI canonical JSON/repeated-process evidence; Node 22 qualified |
| `node scripts/run-conformance-fixtures.mjs` | PASS — 298/298 across 23 fixtures | Fixture conformance evidence including updated canonical fixture 15 and manifest replay checks |
| Flutter probe | NOT VERIFIED | Flutter runner was unavailable because `update_engine_version.sh` could not write `cache/engine.stamp` (`Operation not permitted`) |
| Workspace runtime version | QUALIFIED — Node `v22.23.2` | Root package requires Node `>=24`; current local run is not canonical Node-24 evidence |

The direct checks above do not replace registry refresh, CI, native Flutter,
cross-platform replay, or public-contract decisions. Those limitations remain
open under `Q-GEO-002` and `Q-GEO-006`.

### 8.1 Target verification extension — 2026-11-04

The implementation verification task reran the bounded local evidence against
the current working tree. These results supersede the older counts in the
baseline table above; the older record is retained as provenance.

| Exact command | Result | Evidence qualification |
| --- | --- | --- |
| `pnpm test && pnpm lint && pnpm build` from `geometry/` | PASS — 5 files, 91 tests; lint/build pass | Unit, numeric tolerance, intersection, boolean normalization, and low-level error behavior; Node 22 local evidence. |
| `pnpm test && pnpm lint && pnpm build` from `core/` | PASS — 48 files, 488 tests; lint/build pass | Consumer regression, negative diagnostics, deterministic projection/replay, collection identity, units, queries, constraints, and placement; Node 22 local evidence. |
| `pnpm test && pnpm build` from `renderer-svg/` | PASS — 7 files, 92 tests; build pass | Semantic SVG projection, text content/anchor, closed-ring derivation, and SVG safety boundary. |
| `pnpm test && pnpm build` from `cli/` | PASS — 36 tests; build pass | CLI validation/compile/repeated-process serialization surface; dependency links resolved after package dist builds completed. |
| `pnpm run conformance:fixtures` from workspace root | PASS — 298/298 across 23 fixtures | Shared parse/resolve/renderer/language-service/highlighting/preview/CLI conformance, including active, legacy, invalid, runtime-error, and capability fixtures. |
| `pnpm run compatibility:check` from workspace root | QUALIFIED — 280 passed, 3 failed | The failures are pre-existing metadata drift: core package `0.5.2` vs matrix `0.5.1`, playground core dependency `^0.5.2` vs expected `^0.5.0`, and Flutter app `1.0.1+1` vs matrix `1.0.0+1`; this verification task did not change release/config metadata. |
| `pnpm test -- src/__tests__/intersection.test.ts src/__tests__/boolean.test.ts` from `geometry/` | PASS — Vitest executed the configured 5-file suite, 91 tests | Focused invocation covers numeric tolerance/intersection/boolean paths; package test configuration still reports the complete suite. |
| `pnpm test -- src/__tests__/projection.test.ts src/__tests__/dependency_v03.test.ts src/__tests__/repeat_divide.test.ts src/__tests__/structured_errors.test.ts` from `core/` | PASS — Vitest executed the configured 48-file suite, 488 tests | Focused invocation covers deterministic serialization, graph/repeat identity, and structured errors; package test configuration still reports the complete suite. |

Environment boundary remains explicit: Node `v22.23.2` was used while the
workspace declares Node `>=24`; Flutter/native host replay was not rerun. The
Node-24, Flutter, registry, CI, and cross-platform parity rows therefore stay
`not-verified`, not failed.

## 9. Repository and commit boundary

This handoff was produced from the shared workspace without staging or
committing changes. The reproducible boundary is:

| Repository | Observed HEAD | Working-tree boundary | Handoff interpretation |
| --- | --- | --- | --- |
| `relgeo-workspace/` | `1cfa865` (`docs: synchronize remaining project documentation`) | Root capability-map geometry docs and other pre-existing workspace changes are present; no root commit was created for this handoff. | Review the working tree and the listed evidence commands; do not infer a release artifact or clean-tree claim. |
| `relgeo-workspace/geometry/` | `36469fa` (`docs: update post-publication package status`) | Geometry implementation/test changes are uncommitted in `README.md`, `src/error.ts`, `src/index.ts`, `src/intersection.ts`, `src/path-modifiers.ts`, `src/split.ts`, `src/boolean/normalizeClosedShape.ts`, `src/__tests__/intersection.test.ts`, plus new `src/tolerance.ts` and `src/__tests__/boolean.test.ts`. | Package evidence is from this local source boundary; no npm publication or registry refresh was used. |

The handoff did not modify or commit the separately dirty `core/` and
`renderer-svg/` repositories. Their consumer tests were run against the
current shared workspace, and their repository state must be reviewed
independently. No npm/pub.dev publication, production deployment, deferred
Flutter host, or other external release step was used as a prerequisite for
the local package, consumer, or fixture evidence.

## 10. Remaining-gap handoff

The next owner should start from
[implementation-gap-backlog.md](./implementation-gap-backlog.md), preserving
the following handoff order and boundaries:

1. `GAP-GEO-DET-001` and `GAP-GEO-PARITY-*`: restore Node-24/Flutter/host
   evidence before making cross-runtime claims.
2. `GAP-GEO-BOOLEAN-001/002`: preserve deferred union/xor/non-rectangle scope
   until a separate promotion decision and fixture set exist.
3. Remaining `🌗` rows in the backlog: follow owner/dependency order without
   reopening the completed bounded query, numeric, error, replay, or
   serialization contracts.

The `➖` UI/platform ownership findings and `⏸️` broader boolean promotion are
not active implementation work. Each remaining candidate needs source changes
and executable evidence before its status can change; documentation-only
updates do not close a capability.
