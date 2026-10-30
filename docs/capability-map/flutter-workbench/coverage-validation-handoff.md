# Flutter Workbench — Coverage Validation and Handoff

**Tanggal validasi:** 2026-10-30  
**Scope:** expected catalog → implementation audit → reconciliation → status matrix → implementation-gap backlog  
**Required context:** [`docs/REPOSITORY-MAP.md`](../../REPOSITORY-MAP.md), [`docs/MATURATION-MASTER-PLAN.md`](../../MATURATION-MASTER-PLAN.md)

## 1. Hasil validasi

Artefak Flutter Workbench siap untuk review manusia sebagai dokumentasi,
coverage report, dan evidence map pada boundary yang dideklarasikan. Validasi
ini **tidak** menyatakan seluruh Flutter surface, seluruh runtime native,
seluruh DSL, atau seluruh platform delivery sudah lengkap.

Klaim yang aman:

- expected catalog memiliki **61 capability ID** yang diturunkan sebelum audit;
  lima `SCOPE-*` tetap dicatat sebagai scope decision, bukan capability row;
- implementation audit memiliki ID-by-ID section untuk **61/61 capability**
  dan discovery report yang menyebut source/UI, feature screens, menu/command/
  shortcut, service/platform, config, test/golden/fixture, analyzer/test,
  build, runtime/accessibility, dan docs/roadmap/contract;
- reconciliation dan status matrix masing-masing memiliki **61/61 row**,
  tanpa missing, extra, atau duplicate ID;
- status matrix mempertahankan **42 `✔️`, 16 `🌗`, 3 `❌`, 0 `➖`, 0 `⏸️`,
  dan 0 `⚠️`**; legend tetap menjelaskan semua enam status;
- seluruh **19 row `❌`/`🌗`** tercakup backlog melalui enam candidate
  goal/task, masing-masing dengan owner, dependency, acceptance test/evidence
  target, risk, dan next action;
- documentation, reconciliation, atau backlog tidak menutup gap, tidak
  mempromosikan historical/native evidence secara diam-diam, dan tidak
  mengubah capability absent menjadi `➖`.

## 2. Rantai artefak

| Artefak | Fungsi | Hasil validasi |
| --- | --- | --- |
| [Expected catalog](../../plans/12-flutter-workbench-capability-baseline.md) | Daftar expected capability dengan user outcome, requirement basis, scope decision, owner/source of truth, dan status verifikasi awal | 61 unique capability IDs; 5 `SCOPE-*` decisions tetap terpisah |
| [Implementation audit](./implementation-gap-map.md) | Observed source, test, UI/command, service/platform, fixture, build/runtime, dan docs evidence | Discovery coverage report tersedia; 61/61 ID memiliki audit section |
| [Reconciliation](./reconciliation.md) | Join expected-versus-observed satu-banding-satu | 61/61 rows; missing/extra/duplicate = 0; implementation/evidence/scope terpisah |
| [Status matrix](./status-matrix.md) | Reporting view capability-first | 61 rows; status, evidence, gap, owner, dependency, risk, next action tersedia |
| [Implementation-gap backlog](./implementation-gap-backlog.md) | Candidate implementation goals/tasks | 19/19 `❌`/`🌗` IDs tercakup dalam 6 candidate tasks; tidak mengklaim implementasi |
| [Capability-map README](../README.md) | Index dan inventory protocol untuk surface maps | Flutter workbench artifacts terdaftar; matrix lama tetap historical input |

## 3. Checklist coverage dan integrity

| Check | Result | Evidence / interpretation |
| --- | --- | --- |
| Coverage report exists | PASS | Audit §2 mencatat discovery boundary dan batas pemeriksaan. |
| Required discovery categories recorded | PASS | Audit mencakup source/API, screens/widgets, menu/command/shortcut, services/file/document, platform/config, tests/goldens/fixtures, analyzer/conformance, builds, runtime/accessibility, dan docs/roadmap/contract. |
| Expected capability IDs represented | PASS | Catalog = 61 capability IDs; `SCOPE-01..05` dikeluarkan dari capability row secara eksplisit. |
| Reconciliation ID coverage | PASS | Expected = 61, reconciliation = 61, missing = 0, extra = 0, duplicate = 0. |
| Status matrix ID coverage | PASS | Expected = 61, matrix = 61, missing = 0, extra = 0, duplicate = 0. |
| Backlog gap coverage | PASS | Matrix `❌`/`🌗` = 19, backlog IDs = 19, missing = 0, extra = 0. |
| Matrix capability-first | PASS | Row key adalah expected capability ID, bukan source module/test file. |
| Full status legend | PASS | Matrix menjelaskan `✔️`, `🌗`, `❌`, `➖`, `⏸️`, dan `⚠️`; absence, deferral, scope, dan broken dipisahkan. |
| Evidence class separated | PASS | Reconciliation memisahkan implementation status dari evidence status; class yang dipakai meliputi source-plus-local, bounded-contract, historical-only, source-only, dan source-negative evidence dengan qualifier native/runtime. |
| Scope decisions preserved | PASS | Catalog `SCOPE-01..05` dan reconciliation scope findings memisahkan mobile, custom title bar, raw SVG parity, publishing/signing, dan full DSL promotion dari implementation gap. |
| Limitation stated | PASS | Current Flutter pointer mismatch, SDK write-boundary blocker untuk fresh build, native host/runtime/AT limits, historical CI, dan desktop target replay limits tercatat. |
| Unresolved questions recorded | PASS | §5 mencatat recovery policy, import/diagnostic contract, promotion/current-pointer parity, graph/selection UX, native AT/lifecycle, dan current platform provenance. |
| Implementation handoff separated | PASS | §6 menunjuk `GAP-FW-001..006` sebagai candidate workstream; source changes, tests, dan target evidence tetap required. |
| Required paths resolve | PASS | `docs/capability-map/`, `docs/REPOSITORY-MAP.md`, dan `docs/MATURATION-MASTER-PLAN.md` tersedia dan saling menautkan artifact Flutter. |

## 3.1 Declared source/discovery category coverage

The inventory protocol requires each applicable source, test, consumer/UI,
platform, delivery, and provenance category to be inspected or marked
unverified. The audit's §2 discovery report supplies the following explicit
coverage proof for the Flutter boundary:

| Declared category | Audit evidence/path | Handoff result |
| --- | --- | --- |
| Contract and normative intent | `docs/MATURATION-MASTER-PLAN.md`, `docs/REPOSITORY-MAP.md`, `docs/plans/06-flutter-alignment.md`, `docs/plans/07-flutter-capability-promotion-and-svg-parity.md`, expected catalog | Reviewed; active DSL/SVG boundaries and non-goals are preserved. |
| Implementation/source and public API | `flutter/lib/main.dart`, `flutter/lib/src/ui/`, `flutter/lib/src/features/`, `flutter/lib/src/core/`, `flutter/pubspec.yaml` | Reviewed at `flutter@b21eceb`; symbols and user-facing boundaries are recorded in audit §2/§3. |
| Tests, fixtures, snapshots, and negative cases | `flutter/test/`, `flutter/test/support/`, shared fixtures, golden files; current `flutter test --no-pub --reporter compact` | Reviewed; 302 tests passed locally, with undeclared `golden` tag warning recorded as hygiene only. |
| UI, command, worker, host, or consumer wiring | `flutter/lib/src/ui/cad_workbench.dart`, composition shell, feature panels, command/menu/context-menu files, `flutter/lib/src/mcp/` | Reviewed; routes, menus, shortcuts, bridges, and the single-surface `MaterialApp` boundary are explicit. |
| Platform, persistence, accessibility, security, and runtime boundaries | `flutter/macos/`, `flutter/linux/`, `flutter/windows/`, file/preferences/layout services, method-channel host, `docs/plans/10-desktop-runtime-smoke-checklist.md` | Reviewed; native picker/AT/host runtime remains `not verified` where unavailable. |
| Build, CI/canonical, package, release, deployment, and public artifact evidence | `flutter/.github/workflows/`, `flutter/pubspec.yaml`, platform runners, historical run `37832260326`, current `flutter build web --no-pub` blocker | Reviewed; historical evidence is labeled historical and current build/runtime/public claims remain unverified. |
| Provenance, ownership, synchronization, and cross-repository orchestration | `docs/REPOSITORY-MAP.md`, `docs/integration-baseline.json`, `docs/capability-map/INVENTORY-PROTOCOL.md`, current child pointer | Reviewed; pointer mismatch and provenance refresh are recorded as limitations, not silently reconciled. |

No category above is promoted from documentation to implementation evidence. A
category with unavailable environment evidence remains explicitly qualified in
the audit and limitations sections.

## 3.2 Declared capability-category coverage

The expected catalog declares six user-facing capability sections. Each section
has a bounded row count and a matching audit/reconciliation section; the counts
sum to all 61 expected capability IDs. The five `SCOPE-*` decisions are
intentionally outside this capability count.

| Catalog capability category | Expected IDs / count | Audit and reconciliation coverage |
| --- | --- | --- |
| Document, file, and recovery lifecycle | `DOC-01..09`, `IO-01..02` / **11** | Audit §3.1; reconciliation §1; includes DOC-08 absent and IO native-evidence limitation. |
| Authoring, compile, diagnostics, and contract | `EDIT-01..08`, `CONTRACT-01..03` / **11** | Audit §3.2; reconciliation §2; bounded diagnostics and contract rows remain partial where applicable. |
| Canvas, preview, inspection, and navigation | `CANVAS-01..06`, `VIEW-01..05` / **11** | Audit §3.3; reconciliation §3; CANVAS-05 and VIEW-05 remain explicit absent gaps. |
| Layout, theme, preferences, and persistence | `LAYOUT-01..07`, `THEME-01..04`, `PREF-01..02` / **13** | Audit §3.4; reconciliation §4; local persistence evidence is separated from native restart evidence. |
| Commands, keyboard, accessibility, and window lifecycle | `CMD-01..03`, `A11Y-01..03`, `WINDOW-01..03` / **9** | Audit §3.5; reconciliation §5; native shortcut/AT/lifecycle limits remain qualified. |
| Export and platform delivery | `EXPORT-01..02`, `PLAT-01..04` / **6** | Audit §3.6; reconciliation §6; historical/current artifact evidence is kept separate. |
| **Total expected capability IDs** | **61** | Audit, reconciliation, and matrix each validate 61/61 with no missing, extra, or duplicate IDs. |

## 4. Discovery coverage boundary

Audit §2 dan repository map menetapkan boundary berikut sebagai coverage yang
diperiksa:

1. Flutter package/configuration, dependency boundary, platform runners, and
   release/build workflow;
2. screens, widgets, canvas/preview, inspector, parameters, editor, overlays,
   layout, theme, preferences, viewport, and accessibility semantics;
3. menu, command registry, keyboard shortcuts, context actions, routes, and
   native menu/window bridges;
4. document/file services, recent documents, dirty state, save/open/save-as,
   layout persistence, and window lifecycle;
5. compiler/import/diagnostic boundary, DSL contract, semantic geometry/SVG
   projection, fixtures, and conformance evidence;
6. unit/widget/golden/conformance tests, analyzer, current local Flutter test
   run, historical CI/build evidence, and explicit environment blockers;
7. native picker, desktop build/runtime, accessibility/AT, platform delivery,
   provenance, and scope decisions as separate evidence classes;
8. `docs/REPOSITORY-MAP.md`, master plan, Flutter alignment/promotion/runtime
   plans, and capability-map inventory/reconciliation artifacts.

This is coverage for the declared Flutter Workbench boundary. It is not proof
that every device, host OS, window manager, assistive technology, DSL feature,
artifact channel, or consumer combination has been executed.

## 5. Limitations and unresolved questions

| ID | Limitation or unresolved question | Affected capability / artifact |
| --- | --- | --- |
| `Q-FW-001` | Recovery mechanism, retention, consent, cleanup, and crash/forced-exit restore semantics belum diputuskan. | `DOC-08`, catalog policy, `GAP-FW-001` |
| `Q-FW-002` | Import extension/filter policy dan diagnostic code/path/phase vocabulary perlu dikunci lintas Flutter/core. | `IO-02`, `EDIT-04`, `GAP-FW-001/002` |
| `Q-FW-003` | DSL 0.5.x active fixture promotion dan semantic SVG comparator belum dibuktikan pada current pointer; raw/presentation parity tetap scope non-goal. | `CONTRACT-01..03`, `GAP-FW-002` |
| `Q-FW-004` | Graph UX, stable object identity, selection semantics, hit-testing tolerance, dan keyboard selection behavior belum didefinisikan. | `CANVAS-05`, `VIEW-05`, `GAP-FW-004` |
| `Q-FW-005` | Shortcut map per OS, native accessibility tree/VoiceOver/screen reader, dan native close/quit lifecycle belum memiliki current runtime evidence. | `CMD-03`, `A11Y-01/02`, `WINDOW-01`, `GAP-FW-005` |
| `Q-FW-006` | Current checkout `b21eceb...` berbeda dari workspace baseline/historical CI pointers; fresh build juga terhalang SDK write boundary, sehingga build/runtime claim harus tetap `not verified`. | `PLAT-01..04`, audit §1, `GAP-FW-006` |
| `Q-FW-007` | Android/iOS, custom title bar, raw SVG byte equality, signed distribution, dan full DSL promotion adalah deferred/not applicable scope decisions, bukan untracked desktop gaps. | `SCOPE-01..05`, reconciliation scope findings |

Fresh local analyzer/test success is retained as local evidence only; it does
not answer the native runtime, current cross-platform build, AT, or release
provenance questions above.

## 6. Implementation handoff

Implementation work remains a separate goal/task concern. The published
[backlog](./implementation-gap-backlog.md) proposes, but does
not start or complete, these candidate workstreams:

1. `GAP-FW-001` — document recovery, native picker, and import boundary;
2. `GAP-FW-002` — diagnostics plus current DSL/SVG contract promotion;
3. `GAP-FW-003` — inspector and parameter/value parity;
4. `GAP-FW-004` — user-facing graph and object selection/hit-testing;
5. `GAP-FW-005` — keyboard, accessibility, and window lifecycle evidence;
6. `GAP-FW-006` — current macOS/Linux/Windows delivery and artifact provenance.

Each candidate requires source changes where applicable, executable tests, and
the stated runtime/CI/native evidence before its capability can move from
`🌗`/`❌` to `✔️`. This handoff does not create, start, or mark any
implementation goal complete.

## 7. Required evidence index

- [`docs/REPOSITORY-MAP.md`](../../REPOSITORY-MAP.md)
- [`docs/MATURATION-MASTER-PLAN.md`](../../MATURATION-MASTER-PLAN.md)
- [`docs/plans/06-flutter-alignment.md`](../../plans/06-flutter-alignment.md)
- [`docs/plans/07-flutter-capability-promotion-and-svg-parity.md`](../../plans/07-flutter-capability-promotion-and-svg-parity.md)
- [`docs/plans/10-desktop-runtime-smoke-checklist.md`](../../plans/10-desktop-runtime-smoke-checklist.md)
- [`docs/capability-map/README.md`](../README.md)
- [`docs/capability-map/flutter-workbench/implementation-gap-map.md`](./implementation-gap-map.md)
- [`docs/capability-map/flutter-workbench/reconciliation.md`](./reconciliation.md)
- [`docs/capability-map/flutter-workbench/status-matrix.md`](./status-matrix.md)
- [`docs/capability-map/flutter-workbench/implementation-gap-backlog.md`](./implementation-gap-backlog.md)
