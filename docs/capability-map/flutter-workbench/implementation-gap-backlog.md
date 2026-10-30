# Flutter Workbench — Implementation Gap Backlog

**Status:** candidate backlog; no implementation gap is closed by this document  
**Date:** 2026-10-30

**Expected source:** [`expected-capability-catalog.md`](./expected-capability-catalog.md) (canonical baseline: [`12-flutter-workbench-capability-baseline.md`](../../plans/12-flutter-workbench-capability-baseline.md))
**Audit source:** [`flutter-workbench/implementation-gap-map.md`](./implementation-gap-map.md)  
**Status matrix:** [`flutter-workbench/status-matrix.md`](./status-matrix.md)  
**Join source:** [`flutter-workbench/reconciliation.md`](./reconciliation.md)  
**Scope context:** [`06-flutter-alignment.md`](../../plans/06-flutter-alignment.md)

## Evidence and scope boundary

| Source | Backlog use |
| --- | --- |
| `flutter@b21eceb258070133f32fd822b6fd23a4f21b0bbf` | Current implementation boundary and source/test/platform findings from which the gaps are derived. |
| [`docs/MATURATION-MASTER-PLAN.md`](../../MATURATION-MASTER-PLAN.md) | Roadmap, compatibility line, desktop delivery gates, and evidence provenance rules. |
| [`docs/REPOSITORY-MAP.md`](../../REPOSITORY-MAP.md) | Ownership boundary for `relgeo/flutter` and `relgeo/workspace`. |
| [`docs/capability-map/INVENTORY-PROTOCOL.md`](../INVENTORY-PROTOCOL.md) and related capability-map artifacts | Expected-but-missing rule, evidence separation, scope handling, and coverage validation. |

Priority is product impact, not execution order: `P0` is an absent
user-facing capability with material authoring/data-loss impact; `P1` is a
partial contract, integration, accessibility, or delivery capability that
needs implementation and/or stronger evidence. Native host or CI unavailability
does not lower an implementation priority and does not count as a fix.

## Implementation tranche evidence — 2026-10-30

The Flutter boundary now contains a focused implementation for `DOC-08`,
`CANVAS-05`, and `VIEW-05`:

- `DOC-08`: best-effort dirty-draft persistence and startup RESTORE/DISCARD
  flow in `flutter/lib/src/ui/workbench_document_recovery.dart` and
  `flutter/lib/src/ui/cad_workbench.dart`, covered by
  `flutter/test/workbench_document_recovery_test.dart`.
- `CANVAS-05`: resolved-scene dependency graph model/panel and the View-panel
  command in `flutter/lib/src/ui/workbench_scene_graph.dart`,
  `workbench_scene_graph_panel.dart`, and `cad_workbench.dart`, covered by
  `flutter/test/workbench_scene_graph_test.dart` and
  `workbench_scene_graph_panel_test.dart`.
- `VIEW-05`: visible-object hit-testing and shared canvas/graph/inspector
  selection in `workbench_scene_graph.dart`, `workbench_viewport_panel.dart`,
  `canvas_painter.dart`, and inspector wiring, covered by the graph/selection
  tests.

The local verification result is `flutter analyze --no-pub` passing with no
issues and `flutter test --no-pub --reporter compact` passing all 307 tests.
This evidence is boundary-scoped: native restart, pointer, accessibility, and
window-host behavior remain unverified. The grouped goals below stay visible
until their remaining acceptance behavior is satisfied; this section does not
promote the status matrix or close native-host work.

## Rules

This is a planning/reporting artifact, not implementation. A candidate becomes
done only after source changes, tests, and the stated evidence target pass.
The rows below cover every current `❌` and `🌗` capability in the status
matrix. A missing runtime, host, or CI service is an evidence limitation and
must not be reported as an implementation fix.

`Owner` identifies the implementation boundary. `Dependency` is a real
prerequisite, not a priority ranking. Acceptance targets deliberately include
both tests and the evidence needed to promote a capability beyond local source
coverage.

## Candidate goals/tasks

| ID | Priority | Candidate goal/task | Capability IDs | Scope | Owner | Dependency | Acceptance test / evidence target | Risk | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `GAP-FW-001` | `P0` | Complete document recovery and native file/import workflow | `DOC-08`, `IO-01`, `IO-02` | In-scope desktop authoring lifecycle, native picker boundary, and active RelGeo/YAML import; no archive/project import implied | `relgeo/flutter` + `relgeo/core` | Document serialization contract; platform runners; active import fixtures | Crash/forced-close restore returns the last safe document; autosave/session cleanup is covered; macOS/Linux/Windows open/save/save-as picker smoke passes; active valid/invalid YAML/RelGeo fixtures produce stable diagnostics | Data loss or misleading preview on unsupported input | DOC-08 dirty-draft restore is implemented locally; add forced-exit/relaunch and native picker smoke, then expand import diagnostics |
| `GAP-FW-002` | `P1` | Expand diagnostics and current DSL/SVG contract promotion | `EDIT-04`, `CONTRACT-01`, `CONTRACT-02`, `CONTRACT-03` | In-scope active DSL/semantic SVG boundary; raw SVG bytes and non-promoted evaluator/presentation parity remain excluded | `relgeo/flutter` + `relgeo/spec` + `relgeo/core` + `relgeo/renderer-svg` | Shared fixture governance; current checkout/CI; diagnostic model | Every promoted fixture has expected compile status, code, path, phase, and semantic SVG snapshot; Flutter/core/renderer conformance passes on the current pointer; presentation exclusions remain explicit | False parity claim or unrepairable authoring errors | Publish diagnostic code/path matrix and rerun cross-consumer conformance on current commits |
| `GAP-FW-003` | `P1` | Complete inspector and parameter/value parity | `CANVAS-03`, `CANVAS-04` | In-scope inspector and conditional parameter surfaces; does not promote the full evaluator/profile surface | `relgeo/flutter` + `relgeo/core` | Active document model; parameter/profile contract; selection model decision | Inspector field inventory maps expected model fields; editing a parameter updates compile/preview consistently; profile/default/derived-value fixtures pass in Flutter and core | Users see or edit values that do not match compiled output | Inventory missing inspector fields and choose the minimum active parameter fixture set |
| `GAP-FW-004` | `P0` | Harden user-facing graph and object selection/hit-testing | `CANVAS-05`, `VIEW-05` | In-scope user-facing dependency graph and object targeting; core graph ordering alone is not completion evidence | `relgeo/flutter` | Scene graph projection; viewport transform; inspector/command targeting | Graph panel renders dependencies for an active document; pointer and keyboard hit-testing select the same object; selection updates inspector/overlays and has semantics labels; no selection on empty canvas | Core graph/selection boundary is implemented locally; host pointer/keyboard/AT and richer relationship cases remain | Keep local graph/selection regressions; add keyboard, empty-canvas, physical pointer, and native semantics smoke |
| `GAP-FW-005` | `P1` | Close desktop keyboard, accessibility, and window lifecycle evidence | `CMD-03`, `A11Y-01`, `A11Y-02`, `WINDOW-01` | In-scope desktop keyboard/AT/lifecycle behavior; native host verification is required and cannot be inferred from widget tests | `relgeo/flutter` + native host runners | Shared command registry; native menu/window bridge; target desktop hosts | Per-OS shortcut matrix has no conflicts; keyboard traversal reaches and activates required controls; VoiceOver/screen-reader tree exposes role/label/state; close/quit dirty guard and clean exit pass on desktop | Keyboard-only, AT, or quit workflows fail despite Flutter unit tests passing | Turn the existing command/focus/window contracts into macOS/Linux/Windows smoke scripts |
| `GAP-FW-006` | `P1` | Refresh platform delivery and reproducible artifact evidence | `PLAT-01`, `PLAT-02`, `PLAT-03`, `PLAT-04` | In-scope desktop build/artifact/provenance delivery; signed distribution and store publishing remain out of scope | `relgeo/flutter` + `relgeo/workspace` + CI | Current Flutter pointer; macOS/Linux/Windows runners; artifact provenance format | Current-pointer macOS arm64/universal, Linux, and Windows artifacts build and launch; native file/export smoke is recorded where supported; each report names workspace/Flutter commit, SDK, OS, architecture, run, and date | Historical artifacts are mistaken for current delivery confidence | Run the three current platform jobs and generate one provenance manifest per artifact |

## Coverage check

| Check | Result |
| --- | --- |
| Matrix `❌`/`🌗` capability rows | 17 |
| Backlog capability IDs covered | 17 active rows plus 2 retained implementation-tranche rows (`CANVAS-05`, `VIEW-05`) |
| Capability IDs missing from backlog | 0 |
| Backlog-only capability IDs | 0 |
| Candidate rows | 6 |
| Implementation claimed closed by this document | No; boundary status is recorded by the reconciled matrix, while remaining grouped work stays open |

## Non-feature hygiene follow-ups

These items are intentionally kept outside the capability backlog. They improve
test/provenance documentation but do not implement, promote, or close a
capability and must not change any matrix status.

| ID | Priority | Hygiene item | Evidence target | Capability effect |
| --- | --- | --- | --- |
| `HYGIENE-FW-001` | `P2` | Refresh `docs/integration-baseline.json` or run canonical CI for the current Flutter pointer | Baseline revision equals the claimed child checkout, or a named current CI run is attached | None; does not close `PLAT-*` by itself |
| `HYGIENE-FW-002` | `P2` | Declare the `golden` tag in `dart_test.yaml` or remove the tag | Current 307-test run has no undeclared-tag warning | None; test configuration hygiene only |
| `HYGIENE-FW-003` | `P2` | Keep historical and current evidence provenance separate | Future reports name exact workspace/Flutter pointers and environment | None; provenance clarity only |

`DOC-08` remains a `🌗` partial capability because forced-exit/native storage
evidence is open. `CANVAS-05` and `VIEW-05` are `✔️` at the Flutter boundary,
with host pointer/accessibility and richer contract follow-up still visible.
The backlog groups related work into candidate tasks for planning; grouping does
not erase remaining `🌗`, deferred, or environment-unavailable work.

## Evidence handoff and reproducibility

The implementation/evidence snapshot was taken with workspace `HEAD`
`1cfa86553d7adb18179c6b3e1a33618a179b1414` and Flutter child `HEAD`
`b21eceb258070133f32fd822b6fd23a4f21b0bbf`. Both worktrees are intentionally
dirty because the task changes are uncommitted; these hashes identify the
baseline under test, not a commit containing the changes.

From `flutter/`, the reproducible results are:

- `flutter analyze --no-pub`: pass, no issues.
- The focused recovery/graph/selection, file-service, invalid/reference
  fixture, shared v0.5 conformance, and SVG contract command: 54 tests passed.
- `flutter test --no-pub --reporter compact`: 307 tests passed, with only the
  existing undeclared `golden` tag warning.
- `flutter build web --no-pub`: not verified because the SDK could not write
  `engine.stamp`; this is an environment limitation, not a target defect.

No npm/pub.dev publication, production deployment, signed distribution, or
deferred platform host was required. Remaining work is handed off by candidate
goal: `GAP-FW-001` owns recovery/picker/import follow-up, `GAP-FW-002` owns
cross-consumer diagnostics/contract promotion, `GAP-FW-003` owns inspector and
parameter parity, `GAP-FW-004` owns graph/selection host and richer interaction
follow-up, `GAP-FW-005` owns native keyboard/accessibility/window smoke, and
`GAP-FW-006` owns current-pointer platform provenance. Their owners,
dependencies, acceptance targets, and next actions remain in the candidate
table above; none is silently treated as complete by this handoff.
