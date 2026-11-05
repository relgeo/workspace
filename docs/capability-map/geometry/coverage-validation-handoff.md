# Geometry coverage validation and handoff

## Verification refresh — 2026-11-05

Focused package and consumer verification was rerun from the current checkout
after the core resolver diagnostic boundary was corrected. The serial build
order is intentional because package DTS/build outputs are shared by downstream
workspace links.

| Command | Result | Boundary / qualifier |
| --- | --- | --- |
| `pnpm --filter @relgeo/geometry test -- --run && pnpm --filter @relgeo/geometry lint` | PASS — 5 files, 93 tests | Geometry package tests and TypeScript boundary |
| `pnpm --filter @relgeo/core test -- --run && pnpm --filter @relgeo/core lint && pnpm --filter @relgeo/core build` | PASS — 48 files, 507 tests | Core resolver, diagnostics, type boundary, and DTS build |
| `pnpm --filter @relgeo/renderer-svg test -- --run && pnpm --filter @relgeo/renderer-svg lint` | PASS — 7 files, 104 tests | Renderer semantic projection and type boundary |
| `pnpm --filter @relgeo/cli test -- --run` | PASS — 1 file, 38 tests | CLI consumer after serial dependency build |
| `pnpm --filter @relgeo/geometry build && pnpm --filter @relgeo/core build && pnpm --filter @relgeo/renderer-svg build && pnpm --filter @relgeo/cli build` | PASS | Serial package build order; Node 22.23.2 engine warning retained |
| `pnpm conformance:fixtures` | PASS — 345 checks across 24 fixtures | Shared fixture manifest, snapshots, CLI, renderer, diagnostics |
| `node scripts/run-renderer-semantic-replay.mjs` | PASS — 4 separate-process fixtures | Semantic replay covers fixtures 10, 15, 16, and 24; raw SVG bytes excluded |
| `flutter test test/shared_v05_conformance_test.dart` | PASS — 4 tests | Direct focused Flutter semantic conformance for fixtures 10/14/15/16 |
| `pnpm flutter:conformance` | NOT VERIFIED — wrapper blocked by SDK `engine.stamp` permission outside workspace | Direct focused test remains separate evidence; no full Flutter promotion claimed |
| `pnpm integration:gate -- --local` | NOT VERIFIED — requires Node 24+, checkout has Node 22.23.2 | Environment limitation, not target parity failure |
| Geometry one-to-one register check | PASS — expected/audit/reconciliation/backlog/matrix each 40 rows, 40 unique IDs | No catalog truncation or row merging detected |

**Tanggal validasi:** 2026-11-05
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
- snapshot sebelum closure memuat **17 `✔️`, 23 `🌗`, 0 `❌`, 0 `➖`, 0 `⏸️`,
  dan 0 `⚠️`**; current status menjadi **35 `✔️`, 0 `🌗`, 0 `❌`, 0 `⚠️`,
  dan 5 `⏸️`**;
- seluruh 23 row yang berubah memiliki source/test/fixture/evidence route di
  closure report dan complete register di bawah;
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
| [Implementation-gap backlog](./implementation-gap-backlog.md) | Candidate implementation goals/tasks and closure routes | 18 initial `🌗` rows have source/test closure; five explicit holds retain owner, dependency, and evidence/scope boundary |
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

## 4. Closure report and complete 40-ID handoff

### Before/after closure report — 2026-11-05

The initial snapshot was 17 implemented and 23 partial rows. The verified
closure pass added source/test/fixture evidence for 18 rows. Two boolean rows
remain `⏸️ scope-held`, and three cross-surface rows remain `⏸️ evidence-held`:
they are explicit boundaries, not documentation-only promotions. The table
lists every changed ID exactly once.

| ID | Before → after | Source/test/fixture evidence | Cross-surface impact / remaining boundary |
| --- | --- | --- | --- |
| `GEO-OBJ-001` | `🌗` → `✔️` | `core/src/graph.ts`; duplicate/cycle/projection tests; conformance 345/345 | Core identity/order closed; Node 24/host replay remains under `GEO-DET-001`. |
| `GEO-PRIM-003` | `🌗` → `✔️` | Geometry curve/intersection tests; core curve/query tests; geometry 93 + core 507 | Supported curve boundary closed; broader consumer pair enumeration remains outside promotion. |
| `GEO-PRIM-004` | `🌗` → `✔️` | Core path/holes/text tests; renderer semantic tests; fixtures 10/15/24 | Semantic projection closed locally; Flutter fixture 24 remains held. |
| `GEO-PRIM-005` | `🌗` → `✔️` | Core component/clone/sheet/namespace tests | Local scope and identity closed; public/host release evidence is separate. |
| `GEO-MEASURE-002` | `🌗` → `✔️` | `core/src/evaluator.ts`; unit/fixture 16 tests; conformance 345/345 | Bounded TypeScript/core units closed; Flutter parity remains `GEO-PARITY-001`. |
| `GEO-MEASURE-004` | `🌗` → `✔️` | Core parameter/derived dependency and cycle tests; fixture 16 | Core local-scope contract closed; consumer parity remains separately qualified. |
| `GEO-XFORM-002` | `🌗` → `✔️` | Operation/split/reverse tests in geometry/core; finite-value diagnostics | Operation-result identity/order closed on tested surfaces. |
| `GEO-PLACE-001` | `🌗` → `✔️` | Core placement conflict/inside/margin tests; fixture evidence | Rect-only `inside` and anchor placement boundary closed. |
| `GEO-PLACE-002` | `🌗` → `✔️` | Core frame/path placement and tangent/normal tests | Endpoint/degenerate policy closed locally. |
| `GEO-ANCH-002` | `🌗` → `✔️` | Core custom-anchor/clone/sheet tests; projection/renderer assertions | Named/result anchors remain addressable on local semantic surfaces. |
| `GEO-COLL-001` | `🌗` → `✔️` | `core/src/repeat.ts`; repeat-mode tests; fixture 24 | Collection modes/order/context closed locally. |
| `GEO-COLL-002` | `🌗` → `✔️` | Along distribution/frame/endpoint policy tests; fixture 24 | Conflict and edge policies are deterministic on core. |
| `GEO-COLL-003` | `🌗` → `✔️` | Grid pitch/gap/auto-layout negative tests; fixture 24 | Over-constraint diagnostics closed locally. |
| `GEO-COLL-004` | `🌗` → `✔️` | Divide/split/index/selector tests; fixture 24 | Ordering and result identity closed on core/geometry. |
| `GEO-COLL-005` | `🌗` → `✔️` | Projection tests plus four-process semantic replay | Local repeat IDs/order closed; cross-runtime remains `GEO-DET-001`. |
| `GEO-QUERY-001` | `🌗` → `✔️` | Evaluator/boolean measurement tests; fixture 24 | Supported finite query results and invalid targets closed locally. |
| `GEO-QUERY-002` | `🌗` → `✔️` | Curve endpoint/domain/tangent/normal/frame tests | Degenerate and out-of-range behavior closed on tested surfaces. |
| `GEO-CONSTRAINT-001` | `🌗` → `✔️` | `core/src/resolver/constraints.ts`; relation diagnostics; fixtures 14/24 | Post-resolve validator boundary closed; no general solver claimed. |
| `GEO-BOOLEAN-001` | `🌗` → `⏸️` | Geometry/core boolean tests; fixture 15 and fixture 24 conformance | Scope-held: rectangle/holes boundary is executable; union/xor/non-rectangle promotion awaits decision. |
| `GEO-BOOLEAN-002` | `🌗` → `⏸️` | Empty/multipart/single/multi diagnostics; fixtures 15/19/20/24 | Scope-held: broader topology/result-mode matrix remains explicit. |
| `GEO-DET-001` | `🌗` → `⏸️` | Four-process replay; conformance 345/345 | Evidence-held: Node 24, full Flutter wrapper, and host replay unavailable. |
| `GEO-PARITY-001` | `🌗` → `⏸️` | Direct Flutter focused test 4/4 for fixtures 10/14/15/16 | Evidence-held: wrapper/fixture 24 Flutter execution not verified. |
| `GEO-PARITY-002` | `🌗` → `⏸️` | Semantic SVG comparator/replay; Flutter semantic assertions | Evidence-held: fixture 24 Flutter/full host projection not verified; raw SVG bytes excluded. |

### Complete 40-ID closure route register

This is the handoff view of the frozen catalog. It deliberately includes
bounded implementation and explicit scope/evidence-held rows so the next owner
cannot narrow execution to only the current P0/P1 selection. Each expected ID
appears once in this handoff register and carries a testable boundary.

Complete route totals are 35 bounded implementations and five explicit holds
(two scope-held and three evidence-held). This preserves all 40 expected IDs
and is broader than the historical 17-row triage subset.

| ID | Status | Handoff class | Closure evidence to obtain or preserve |
| --- | --- | --- | --- |
| `GEO-OBJ-001` | `✔️` | bounded implementation | Graph identity, duplicate/cycle diagnostics, and canonical replay fixture |
| `GEO-PRIM-001` | `✔️` | bounded implementation | Point/line fixture 10/15 and typed rejection tests |
| `GEO-PRIM-002` | `✔️` | bounded implementation | Rect/circle/ellipse ClosedShape and holes normalization fixtures |
| `GEO-PRIM-003` | `✔️` | bounded implementation | Curve endpoint/length/intersection and degeneracy fixture |
| `GEO-PRIM-004` | `✔️` | bounded implementation | Open/closed path, holes, chaining, labels, and semantic renderer fixture |
| `GEO-PRIM-005` | `✔️` | bounded implementation | Component/clone/export local-scope and namespace diagnostics |
| `GEO-MEASURE-001` | `✔️` | bounded implementation | Typed-dimension valid/invalid matrix |
| `GEO-MEASURE-002` | `✔️` | bounded implementation | Unit normalization/conversion, fixture 16, malformed-context negatives |
| `GEO-MEASURE-003` | `✔️` | bounded implementation | Deterministic evaluator expression tests |
| `GEO-MEASURE-004` | `✔️` | bounded implementation | Parameter/default/derived-cycle and component-local scope fixture |
| `GEO-MEASURE-005` | `✔️` | bounded implementation | Invalid fixture code/path assertions |
| `GEO-XFORM-001` | `✔️` | bounded implementation | Ordered transform semantic snapshot |
| `GEO-XFORM-002` | `✔️` | bounded implementation | Chained operation/split identity and finite-value negatives |
| `GEO-PLACE-001` | `✔️` | bounded implementation | Anchor/offset/inside/margin conflict matrix |
| `GEO-PLACE-002` | `✔️` | bounded implementation | point/path/frame endpoint and degenerate fixture |
| `GEO-ANCH-001` | `✔️` | bounded implementation | Standard-anchor fixture and stable types |
| `GEO-ANCH-002` | `✔️` | bounded implementation | Custom/result-anchor serialization and renderer fixture |
| `GEO-COLL-001` | `✔️` | bounded implementation | Five repeat-mode shared conformance fixture |
| `GEO-COLL-002` | `✔️` | bounded implementation | Along policy, offset, endpoint, and conflict edge matrix |
| `GEO-COLL-003` | `✔️` | bounded implementation | Grid pitch/gap and over-constraint fixtures |
| `GEO-COLL-004` | `✔️` | bounded implementation | Divide/split order, count, selector, and identity snapshots |
| `GEO-COLL-005` | `✔️` | bounded implementation | Repeat ID/order replay harness plus host follow-up |
| `GEO-QUERY-001` | `✔️` | bounded implementation | Measurement coverage by supported primitive and invalid target |
| `GEO-QUERY-002` | `✔️` | bounded implementation | Curve/path endpoint, domain, and tangent/normal fixture |
| `GEO-QUERY-003` | `✔️` | bounded implementation | v0.5 overload and wrong-target negatives |
| `GEO-QUERY-004` | `✔️` | bounded implementation | Supported pair/selector contract and fixture 15 |
| `GEO-QUERY-005` | `✔️` | bounded implementation | Frame/tLength tests reused by repeat consumer |
| `GEO-CONSTRAINT-001` | `✔️` | bounded implementation | Four relation valid/invalid/degenerate fixture matrix |
| `GEO-CONSTRAINT-002` | `✔️` | bounded implementation | Fixture 14 violation path/code snapshots |
| `GEO-BOOLEAN-001` | `⏸️` | scope-held | Fixture 15 intersect/subtract; promotion decision for union/xor/topology |
| `GEO-BOOLEAN-002` | `⏸️` | scope-held | Fixtures 15/19/20; deferred broader result-mode matrix |
| `GEO-NUM-001` | `✔️` | bounded implementation | Operation-specific tolerance tests |
| `GEO-NUM-002` | `✔️` | bounded implementation | Winding/holes normalization and fixture 15 |
| `GEO-NUM-003` | `✔️` | bounded implementation | Stable low-level error-code negatives |
| `GEO-DET-001` | `⏸️` | evidence-held | Repeated-process, Node 24, Flutter, and host replay evidence |
| `GEO-DET-002` | `✔️` | bounded implementation | Local projection/CLI replay comparator |
| `GEO-SER-001` | `✔️` | bounded implementation | Versioned core/CLI semantic projection snapshots |
| `GEO-SER-002` | `✔️` | bounded implementation | Manifest numeric/order/undefined serialization checks |
| `GEO-PARITY-001` | `⏸️` | evidence-held | Reviewed fixture 15/16 TypeScript–Flutter semantic comparator |
| `GEO-PARITY-002` | `⏸️` | evidence-held | Semantic SVG tree/geometry/anchor host comparison |

The handoff preserves `not-verified` host limitations and deferred scope as
separate evidence classes. Neither class is a success claim or a removal from
the expected catalog.

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

### 8.1 Historical target verification extension — superseded

The implementation verification task reran bounded local evidence before the
final closure slice. The record is retained as provenance; the current rerun is
recorded below.

| Exact command | Result | Evidence qualification |
| --- | --- | --- |
| `pnpm test && pnpm lint && pnpm build` from `geometry/` | PASS — 5 files, 91 tests; lint/build pass | Superseded local package evidence; Node 22 local evidence. |
| `pnpm test && pnpm lint && pnpm build` from `core/` | PASS — 48 files, 488 tests; lint/build pass | Superseded local core evidence; Node 22 local evidence. |
| `pnpm test && pnpm build` from `renderer-svg/` | PASS — 7 files, 92 tests; build pass | Superseded semantic SVG evidence. |
| `pnpm test && pnpm build` from `cli/` | PASS — 36 tests; build pass | Superseded CLI evidence. |
| `pnpm run conformance:fixtures` from workspace root | PASS — 298/298 across 23 fixtures | Superseded shared fixture evidence. |
| `pnpm run compatibility:check` from workspace root | QUALIFIED — 280 passed, 3 failed | The failures are pre-existing metadata drift: core package `0.5.2` vs matrix `0.5.1`, playground core dependency `^0.5.2` vs expected `^0.5.0`, and Flutter app `1.0.1+1` vs matrix `1.0.0+1`; this verification task did not change release/config metadata. |
| `pnpm test -- src/__tests__/intersection.test.ts src/__tests__/boolean.test.ts` from `geometry/` | PASS — Vitest executed the configured 5-file suite, 91 tests | Focused invocation covers numeric tolerance/intersection/boolean paths; package test configuration still reports the complete suite. |
| `pnpm test -- src/__tests__/projection.test.ts src/__tests__/dependency_v03.test.ts src/__tests__/repeat_divide.test.ts src/__tests__/structured_errors.test.ts` from `core/` | PASS — Vitest executed the configured 48-file suite, 488 tests | Focused invocation covers deterministic serialization, graph/repeat identity, and structured errors; package test configuration still reports the complete suite. |

Environment boundary remains explicit: Node `v22.23.2` was used while the
workspace declares Node `>=24`; Flutter/native host replay was not rerun. The
Node-24, Flutter, registry, CI, and cross-platform parity rows therefore stay
`not-verified`, not failed.

### 8.2 Current local verification — 2026-11-05

The current checkout was rerun after the Geometry closure changes:

| Exact command | Result |
| --- | --- |
| `pnpm test` from `geometry/` | PASS — 5 files, 93 tests |
| `pnpm test` from `core/` | PASS — 48 files, 507 tests |
| `pnpm test` from `renderer-svg/` | PASS — 7 files, 104 tests |
| `pnpm test` from `cli/` | PASS — 1 file, 38 tests |
| `pnpm run conformance:fixtures` from workspace root | PASS — 345/345 across 24 fixtures |

These are local Node `v22.23.2` results. They support the bounded TypeScript
closure only; Node 24, Flutter/native-host, CI, registry, and cross-platform
parity remain separate evidence boundaries.

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
