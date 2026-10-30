# Geometry coverage validation and handoff

**Tanggal validasi:** 2026-10-30  
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
- matrix mempertahankan **10 `✔️`, 30 `🌗`, 0 `❌`, 0 `➖`, 0 `⏸️`, dan 0 `⚠️`**;
  evidence qualifier `not-verified` tetap dipisahkan dari implementation
  status dan tidak menjadi row status tersendiri;
- setiap 30 row `🌗` memiliki satu candidate task di backlog dengan owner,
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
| [Implementation-gap backlog](./implementation-gap-backlog.md) | Candidate implementation goals/tasks | 30/30 `🌗` rows memiliki task; `VERIFY-GEO-SER-002` adalah follow-up evidence-only dan `FIX-GEO-PROVENANCE-001` adalah corrective documentation/code follow-up |
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
| `Q-GEO-007` | Wording/provenance/error vocabulary final apa yang harus dipakai setelah stale `v0.3` text diperbaiki? | confirmed `⚠️` finding, `GEO-NUM-003`, CLI/docs |

## 6. Implementation handoff

Implementation work remains a separate goal/task concern. The published
backlog proposes, but does not start, these candidate workstreams:

1. `G-01` close object, primitive, transform, placement, and anchor semantics;
2. `G-02` promote dimensions, collections, queries, and constraint coverage;
3. `G-03` harden boolean, numeric, deterministic, and serialization contracts;
4. `G-04` close TypeScript/Flutter and semantic SVG parity evidence;
5. `FIX-GEO-PROVENANCE-001` correct confirmed stale `v0.3` wording;
6. `VERIFY-GEO-SER-002` establish the canonical serialization contract.

Each candidate task remains blocked on its stated owner/dependency and must
produce source changes plus executable tests/fixtures/evidence before its
capability can move from `🌗` or `❌`; an evidence-only `not-verified` finding
must also be resolved before the affected evidence claim is promoted. This
handoff does not create, start,
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
| `pnpm --filter @relgeo/geometry test` | PASS — 66/66 | Local package test evidence |
| `pnpm --filter @relgeo/core test` | PASS — 427/427 | Local core consumer evidence |
| `pnpm --filter @relgeo/renderer-svg test` | PASS — 79/79 | Local renderer consumer evidence |
| `pnpm --filter @relgeo/geometry lint` | PASS | Local static check |
| `pnpm --filter @relgeo/geometry build` | PASS | Local TypeScript/tsup build evidence |
| `pnpm conformance:fixtures` | PASS — 260/260 across 20 fixtures | Fixture conformance evidence |
| `pnpm flutter:conformance` | NOT VERIFIED — exit 2 | Flutter runner was unavailable because `update_engine_version.sh` could not write `cache/engine.stamp` (`Operation not permitted`) |
| Workspace runtime version | QUALIFIED — Node `v22.23.2` | Root package requires Node `>=24`; current local run is not canonical Node-24 evidence |

The direct checks above do not replace registry refresh, CI, native Flutter,
cross-platform replay, or public-contract decisions. Those limitations remain
open under `Q-GEO-002` and `Q-GEO-006`.
