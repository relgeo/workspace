# Flutter Workbench — Implementation Gap Backlog

**Status:** frozen delivery contract; implementation gaps remain open until their
own validation evidence passes
**Date:** 2026-11-03

**Expected source:** [`expected-capability-catalog.md`](./expected-capability-catalog.md) (canonical baseline: [`12-flutter-workbench-capability-baseline.md`](../../plans/12-flutter-workbench-capability-baseline.md))
**Audit source:** [`flutter-workbench/implementation-gap-map.md`](./implementation-gap-map.md)  
**Status matrix:** [`flutter-workbench/status-matrix.md`](./status-matrix.md)  
**Join source:** [`flutter-workbench/reconciliation.md`](./reconciliation.md)  
**Scope context:** [`06-flutter-alignment.md`](../../plans/06-flutter-alignment.md)

> **Current delivery checkpoint — 2026-10-31:** Flutter `60ec76042b369659e4d048b2a53ea3a66a384de3` passed CI run `41184291670`; release run `41184693233` produced unpublished v1.0.1 macOS universal, Linux x64, and Windows x64 bundles with checksums/provenance. These artifacts close the build/upload portion of the platform work, not target-host launch, native picker/export, MCP packaged smoke, signing/notarization, or installation evidence. The source/test details below are from the 2026-10-30 `b21eceb` audit and remain historical unless explicitly linked to the current CI/release run.

## Evidence and scope boundary

| Source | Backlog use |
| --- | --- |
| `flutter@60ec76042b369659e4d048b2a53ea3a66a384de3` | Current root gitlink/release-workflow pointer; current CI and draft artifact evidence is summarized above. |
| `flutter@b21eceb258070133f32fd822b6fd23a4f21b0bbf` | Historical detailed source/test/platform audit dated 2026-10-30; not the current release pointer. |
| [`docs/MATURATION-MASTER-PLAN.md`](../../MATURATION-MASTER-PLAN.md) | Roadmap, compatibility line, desktop delivery gates, and evidence provenance rules. |
| [`docs/REPOSITORY-MAP.md`](../../REPOSITORY-MAP.md) | Ownership boundary for `relgeo/flutter` and `relgeo/workspace`. |
| [`docs/capability-map/INVENTORY-PROTOCOL.md`](../INVENTORY-PROTOCOL.md) and related capability-map artifacts | Expected-but-missing rule, evidence separation, scope handling, and coverage validation. |

Priority is product impact, not execution order: `P0` is an absent
user-facing capability with material authoring/data-loss impact; `P1` is a
partial contract, integration, accessibility, or delivery capability that
needs implementation and/or stronger evidence. Native host or CI unavailability
does not lower an implementation priority and does not count as a fix.

## Frozen authoring contract — 2026-11-03

This section freezes the behavior boundary for `GAP-FW-001` through
`GAP-FW-006`. It is an executable contract for the Flutter boundary, not a
claim that native host evidence is complete. Behavior, local test evidence,
and host evidence remain separate so a missing desktop runtime cannot silently
become either a pass or an implementation failure.

| Gap | Frozen behavior at the Flutter boundary | Local executable evidence | Host/evidence boundary |
| --- | --- | --- | --- |
| `GAP-FW-001` | New/Open/Close/Quit are destructive actions guarded by dirty state. Open picker cancellation has no discard prompt and no document mutation. Save writes the active identity when present; Save As and untitled Save use the host destination boundary. Successful local load/save/new/close clears the recovery record; host lifecycle callbacks remain host-owned and do not claim completion without a result. Dirty editor changes persist one best-effort recovery draft; startup offers `RESTORE` or `DISCARD`. | Lifecycle/file-service tests in `widget_test.dart`; `workbench_file_service_test.dart`; `workbench_document_recovery_test.dart`; recovery restore widget test. | Native picker appearance, permissions, forced process termination, and real relaunch remain `not verified` on this host. |
| `GAP-FW-002` | Active import accepts YAML/RelGeo source through the file service. YAML parse failures and resolver/compiler failures remain distinct and are projected to stable bounded codes `relgeo.yaml.parse` and `relgeo.compile`; full path/phase parity belongs to the cross-consumer promotion gap. | `workbench_import_diagnostics_test.dart`; invalid fixture tests; active fixture/diagnostic widget tests. | Current-pointer cross-consumer promotion and full diagnostic path/phase parity are not claimed by Flutter-local tests. |
| `GAP-FW-003` | Inspector and parameter surfaces consume the active compiled document/selection state. Parameter/profile edits recompile the active source; exhaustive evaluator/profile parity is outside this freeze. | Existing inspector, parameter, document-controller, and widget contract tests. | Full DSL/evaluator parity remains the dependent implementation task. |
| `GAP-FW-004` | Scene graph, canvas hit-testing, and inspector share stable selected-object identity. Empty-canvas hits clear selection; hidden roles are excluded. | Existing scene-graph, selection, viewport, and inspector widget tests. | Physical pointer/keyboard and native accessibility announcement remain host evidence. |
| `GAP-FW-005` | Commands route through the shared registry; focus/activation and dirty close/quit guards are host-neutral contracts. Native menu/window adapters are optional host implementations. | Existing command, keyboard, semantics, window-policy, and window-host tests. | Per-OS shortcut mapping, VoiceOver/screen-reader tree, and native close/quit event evidence remain `not verified`. |
| `GAP-FW-006` | Artifact provenance records source pointer, workflow/artifact identity, platform/architecture, checksum, and verification result as separate observations. Build success does not imply install/launch/MCP/picker/export success. | Current local analyzer/test/build commands and the provenance notes below. | Ubuntu/Windows hosts, signed distribution, and target-host launch/install smoke are unavailable here and remain explicitly open. |

The active implementation additionally freezes numeric parameter metadata (type,
label, bounds, and step) at the document-settings boundary, rejects unknown or
non-finite overrides, and keeps inspector detail rows aligned with resolved
quadratic/cubic/boolean/clone/collection objects. Regression coverage is in
`flutter/test/workbench_document_settings_test.dart`,
`flutter/test/workbench_document_controller_test.dart`,
`flutter/test/widget_test.dart`, and `flutter/test/inspector_panel_test.dart`.
This is local target evidence; native host accessibility and window evidence
remain separate.

### Current verification handoff — 2026-11-03

Current root `2ff198d` and Flutter child `60ec760` have passing local evidence:
`flutter analyze --no-pub`, the full Flutter suite (324 tests), and the focused
shared fixture/invalid boundary/SVG contract suite (45 tests). Canonical fixture
staging copied 23 fixtures. The required conformance runner was also invoked,
but stopped before analyzer/test because the managed Flutter SDK could not write
`flutter/bin/cache/engine.stamp`; the macOS debug build was blocked by the same
environment limitation. No claim is made for macOS launch, picker, export,
accessibility, Linux/Windows runtime, or install behavior. This handoff keeps
target test closure separate from unavailable host evidence.

### Contract invariants

- A failed Open or Save preserves the editor source, document identity, and
  dirty state; the user receives an operation-specific error surface.
- A picker cancellation is a no-op. Dirty confirmation runs only after a
  document has been selected or when a destructive lifecycle action is about
  to replace/close the active document.
- Recovery is best effort and single-draft: missing, empty, or unreadable
  storage is ignored; `RESTORE` loads the draft and consumes it; `DISCARD`
  consumes it without changing the active document.
- The Flutter import adapter exposes bounded MCP diagnostics only. It does not
  derive a source path, phase, or evaluator parity claim from exception text.
- Native picker, assistive technology, window-manager, target-host, signing,
  and distribution results must be recorded as separate evidence classes.

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

The historical local verification result is `flutter analyze --no-pub` passing with no
issues; the 2026-10-30 `flutter test --no-pub --reporter compact` run passed 307 tests.
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
| `GAP-FW-006` | `P1` | Verify target-host operation of the generated desktop releases | `PLAT-01`, `PLAT-02`, `PLAT-03`, `PLAT-04` | In-scope desktop artifact provenance and install/runtime evidence; signed distribution and store publishing remain out of scope | `relgeo/flutter` + `relgeo/workspace` + macOS/Linux/Windows hosts | Draft artifacts from release run `41184693233`; target OS hosts; native file/export smoke | Install and launch each current artifact; record OS/architecture, workflow run, checksum, launch result, native picker/export smoke, and MCP packaged-server smoke where available; retain current root baseline provenance | Build success is mistaken for a working end-user installation | Download and smoke-test draft v1.0.1 on target hosts, prioritizing Windows; record results before publishing |

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
| `HYGIENE-FW-002` | `P2` | Declare the `golden` tag in `dart_test.yaml` or remove the tag | A future current-pointer test run has no undeclared-tag warning; historical 2026-10-30 run emitted this non-failing warning | None; test configuration hygiene only |
| `HYGIENE-FW-003` | `P2` | Keep historical and current evidence provenance separate | Future reports name exact workspace/Flutter pointers and environment | None; provenance clarity only |

`DOC-08` remains a `🌗` partial capability because forced-exit/native storage
evidence is open. `CANVAS-05` and `VIEW-05` are `✔️` at the Flutter boundary,
with host pointer/accessibility and richer contract follow-up still visible.
The backlog groups related work into candidate tasks for planning; grouping does
not erase remaining `🌗`, deferred, or environment-unavailable work.

## Evidence handoff and reproducibility

The historical local implementation/evidence snapshot was taken with workspace `HEAD`
`1cfa86553d7adb18179c6b3e1a33618a179b1414` and Flutter child `HEAD`
`b21eceb258070133f32fd822b6fd23a4f21b0bbf`. The current source/release pointer
is `60ec76042b369659e4d048b2a53ea3a66a384de3`; current CI and release evidence
are linked in the checkpoint above. The local commands listed below describe
the historical checkout only.

> The root documentation workspace has since advanced to `7d02e4c`; its current
> submodule checkout cleanliness is recorded in the cross-repository audit.
> Do not interpret the old dirty-worktree note below as current state.

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
