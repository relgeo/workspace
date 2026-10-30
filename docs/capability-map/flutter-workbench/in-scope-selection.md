# Flutter Workbench bounded in-scope selection

**Date:** 2026-10-30  
**Task:** `select-and-bound-in-scope-capability-debt--1184095376`  
**Status:** bounded active selection; this record is not implementation or
completion evidence  
**Owner boundary:** `relgeo/flutter` owns the Flutter workbench UI, document
session, editor, viewport, inspector, preferences, and host-service adapters.
`relgeo/workspace` owns the expected catalog, evidence join, and provenance
record. RelGeo DSL/core remain semantic owners where the contract crosses the
Flutter boundary.

## Decision

This tranche selects eleven actionable gaps from the expected catalog, the
implementation audit/reconciliation, and the implementation-gap backlog. It is
bounded to desktop authoring continuity and interaction: recovery/file
services, inspector/parameter behavior, graph/selection, and keyboard,
accessibility, and window lifecycle contracts.

The tranche does not require pub.dev publication, signed distribution, a
desktop artifact release, or a TypeScript gate. Platform-service rows are
selected only at the Flutter/native adapter contract boundary; host smoke is a
separate evidence target and cannot be inferred from widget tests.

Current status symbols below reflect the reconciled implementation evidence.
Selection itself did not promote a row; the later implementation and verification
tranche changed only the three selected rows with direct Flutter evidence.

## Evidence and selection inputs

| Input | Role in this selection |
| --- | --- |
| [Expected capability catalog](./expected-capability-catalog.md) and its [canonical baseline](../../plans/12-flutter-workbench-capability-baseline.md) | Defines the stable expected IDs, user outcomes, normative owners, source paths, and scope boundaries. |
| [Implementation audit](./implementation-audit.md) | Records the earlier evidence summary and Flutter source/test/platform boundary. |
| [Implementation gap map](./implementation-gap-map.md) and [reconciliation](./reconciliation.md) | Supplies the current implementation status and honest `✔️`/`🌗`/`❌`/`⚠️` symbols. |
| [Status matrix](./status-matrix.md) | Cross-checks the status count and one-to-one capability coverage. |
| [Implementation-gap backlog](./implementation-gap-backlog.md) | Supplies candidate goal/task groupings, owners, dependencies, and acceptance targets. |
| [`flutter/`](../../../flutter/) | Implementation boundary for source, tests, and Flutter host adapters. |

## Bounded active selection

Each row names one expected capability, the backlog candidate that contains it,
the owner, source-of-truth path, observed source/test paths, contract boundary,
and explicit acceptance behavior. Dependencies are sequencing constraints, not
additional scope.

| Selected task / expected ID | Current status | Owner | Source of truth | Observed implementation / test paths | Contract boundary | Explicit acceptance behavior |
| --- | --- | --- | --- | --- | --- | --- |
| `GAP-FW-001` — session recovery (`DOC-08`) | `🌗` | `relgeo/flutter` | [Catalog DOC-08](../../plans/12-flutter-workbench-capability-baseline.md); [audit DOC-08](./implementation-gap-map.md#31-document-file-dan-recovery); backlog `GAP-FW-001` | [`workbench_document_recovery.dart`](../../../flutter/lib/src/ui/workbench_document_recovery.dart), [`cad_workbench.dart`](../../../flutter/lib/src/ui/cad_workbench.dart), [`workbench_document_recovery_test.dart`](../../../flutter/test/workbench_document_recovery_test.dart) | Flutter owns draft/session retention and recovery UX; layout/preferences persistence is not document recovery. Retention, consent, cleanup, and last-safe-document policy remain explicit. | Local dirty-draft save and startup restore/discard are implemented and tested; add forced-exit/relaunch and stale/corrupt-draft host/integration evidence before promoting to `✔️`. |
| `GAP-FW-001` — native picker boundary (`IO-01`) | `🌗` | `relgeo/flutter` | [Catalog IO-01](../../plans/12-flutter-workbench-capability-baseline.md); [audit IO-01](./implementation-gap-map.md#31-document-file-dan-recovery); backlog `GAP-FW-001` | [`workbench_file_service.dart`](../../../flutter/lib/src/ui/workbench_file_service.dart), [`workbench_file_service_test.dart`](../../../flutter/test/workbench_file_service_test.dart), [`widget_test.dart`](../../../flutter/test/widget_test.dart) | Flutter owns Open/Save As adapter wiring, cancellation, typed results, and dirty-state preservation; OS picker UI/permissions remain native-host evidence. | macOS/Linux/Windows adapter smoke shows Open and Save As invoke the OS picker, cancel leaves source/path/dirty state unchanged, and permission/write failures surface a recoverable error without a success claim. |
| `GAP-FW-001` — bounded import behavior (`IO-02`) | `🌗` | `relgeo/flutter` + `relgeo/core` | [Catalog IO-02](../../plans/12-flutter-workbench-capability-baseline.md); [audit IO-02](./implementation-gap-map.md#31-document-file-dan-recovery); backlog `GAP-FW-001` | [`workbench_file_service.dart`](../../../flutter/lib/src/ui/workbench_file_service.dart), [`resolver.dart`](../../../flutter/lib/src/core/resolver.dart), [`reference_fixtures_test.dart`](../../../flutter/test/reference_fixtures_test.dart) | Flutter owns file-to-document handoff and extension/filter policy; core/DSL owns parse/resolve meaning and diagnostic codes. Archive/project import is excluded. | Supported `.yaml`, `.yml`, and `.relgeo` inputs compile through the active line; unsupported extension, malformed input, and read failure produce stable actionable diagnostics and never replace the current document with invalid content. |
| `GAP-FW-003` — inspector coverage (`CANVAS-03`) | `🌗` | `relgeo/flutter` + `relgeo/core` | [Catalog CANVAS-03](../../plans/12-flutter-workbench-capability-baseline.md); [audit CANVAS-03](./implementation-gap-map.md#33-canvas-preview-inspection-dan-navigation); backlog `GAP-FW-003` | [`inspector_panel.dart`](../../../flutter/lib/src/features/inspector/inspector_panel.dart), [`workbench_inspector_feature.dart`](../../../flutter/lib/src/features/inspector/workbench_inspector_feature.dart), [`inspector_panel_test.dart`](../../../flutter/test/inspector_panel_test.dart) | Flutter presents resolved object/geometry/constraint data; core remains authoritative for resolved values and diagnostics. The tranche does not invent unsupported object properties. | The field inventory covers every supported active object/property; values and violations match the resolved scene; missing/unsupported fields are explicit; focused widget tests cover object, value, error, and BOM tabs. |
| `GAP-FW-003` — conditional parameters (`CANVAS-04`) | `🌗` | `relgeo/flutter` + `relgeo/core` | [Catalog CANVAS-04](../../plans/12-flutter-workbench-capability-baseline.md); [audit CANVAS-04](./implementation-gap-map.md#33-canvas-preview-inspection-dan-navigation); backlog `GAP-FW-003` | [`parameters_panel.dart`](../../../flutter/lib/src/features/parameters/parameters_panel.dart), [`workbench_parameters_feature.dart`](../../../flutter/lib/src/features/parameters/workbench_parameters_feature.dart), [`workbench_document_settings.dart`](../../../flutter/lib/src/features/editor/workbench_document_settings.dart), [`workbench_document_settings_test.dart`](../../../flutter/test/workbench_document_settings_test.dart) | Flutter owns conditional visibility and edit/reset interaction; core/DSL owns parameter typing, evaluation, and resolved output. | Parameter edits and reset deterministically recompile and update preview/diagnostics; non-parameter documents do not show a broken or empty panel; defaults, derived values, and invalid values have focused coverage. |
| `GAP-FW-004` — dependency graph (`CANVAS-05`) | `✔️` | `relgeo/flutter` | [Catalog CANVAS-05](../../plans/12-flutter-workbench-capability-baseline.md); [audit CANVAS-05](./implementation-gap-map.md#33-canvas-preview-inspection-dan-navigation); backlog `GAP-FW-004` | [`workbench_scene_graph.dart`](../../../flutter/lib/src/ui/workbench_scene_graph.dart), [`workbench_scene_graph_panel.dart`](../../../flutter/lib/src/ui/workbench_scene_graph_panel.dart), [`cad_workbench.dart`](../../../flutter/lib/src/ui/cad_workbench.dart), [`workbench_scene_graph_test.dart`](../../../flutter/test/workbench_scene_graph_test.dart), [`workbench_scene_graph_panel_test.dart`](../../../flutter/test/workbench_scene_graph_panel_test.dart) | Flutter owns a user-facing graph view and presentation; core graph ordering is input data only. Native AT/runtime remains separate evidence. | Active documents render selectable dependency relationships with stable object identity and semantics labels; local focused tests pass. Add native accessibility smoke and richer relationship cases as follow-up. |
| `GAP-FW-004` — object selection/hit testing (`VIEW-05`) | `✔️` | `relgeo/flutter` | [Catalog VIEW-05](../../plans/12-flutter-workbench-capability-baseline.md); [audit VIEW-05](./implementation-gap-map.md#33-canvas-preview-inspection-dan-navigation); backlog `GAP-FW-004` | [`workbench_scene_graph.dart`](../../../flutter/lib/src/ui/workbench_scene_graph.dart), [`workbench_viewport_panel.dart`](../../../flutter/lib/src/features/preview/workbench_viewport_panel.dart), [`canvas_painter.dart`](../../../flutter/lib/src/ui/canvas_painter.dart), inspector wiring, [`workbench_scene_graph_test.dart`](../../../flutter/test/workbench_scene_graph_test.dart) | Flutter owns hit testing, selection state, viewport-to-scene mapping, and synchronization to inspector/overlays. Selection is transient UI state, not DSL or persisted layout. Physical pointer and richer geometric hit-testing remain unverified. | Visible-object selection, canvas highlight, graph selection, and inspector selection share the selected object id; local tests pass. Add keyboard-selection and physical pointer smoke coverage. |
| `GAP-FW-005` — shortcut policy (`CMD-03`) | `🌗` | `relgeo/flutter` | [Catalog CMD-03](../../plans/12-flutter-workbench-capability-baseline.md); [audit CMD-03](./implementation-gap-map.md#35-commands-keyboard-accessibility-dan-window-lifecycle); backlog `GAP-FW-005` | [`workbench_commands.dart`](../../../flutter/lib/src/ui/workbench_commands.dart), [`workbench_context_menu.dart`](../../../flutter/lib/src/ui/workbench_context_menu.dart), [`workbench_platform_menu_bar.dart`](../../../flutter/lib/src/ui/workbench_platform_menu_bar.dart) | Flutter owns command identity, labels, activators, and conflict policy; OS menu delivery remains host evidence. | A documented macOS/Linux/Windows shortcut matrix has no collisions for required commands; focused tests prove command/menu/context-menu parity and unsupported modifiers do not trigger the wrong command. |
| `GAP-FW-005` — keyboard traversal (`A11Y-01`) | `🌗` | `relgeo/flutter` | [Catalog A11Y-01](../../plans/12-flutter-workbench-capability-baseline.md); [audit A11Y-01](./implementation-gap-map.md#35-commands-keyboard-accessibility-dan-window-lifecycle); backlog `GAP-FW-005` | [`keyboard_activatable.dart`](../../../flutter/lib/src/ui/keyboard_activatable.dart), [`workbench_composition_shell.dart`](../../../flutter/lib/src/ui/workbench_composition_shell.dart), [`keyboard_activatable_test.dart`](../../../flutter/test/keyboard_activatable_test.dart), [`workbench_composition_shell_test.dart`](../../../flutter/test/workbench_composition_shell_test.dart) | Flutter owns focus order, keyboard activation, escape/close behavior, and focus exclusion. Native AT traversal is an evidence target, not inferred from widget tests. | Keyboard-only traversal reaches required editor, viewport, inspector, menu, and close controls in a deterministic order; Enter/Space activate; Escape exits transient UI; native macOS/Linux/Windows smoke records any host-specific deviation. |
| `GAP-FW-005` — semantics/AT contract (`A11Y-02`) | `🌗` | `relgeo/flutter` | [Catalog A11Y-02](../../plans/12-flutter-workbench-capability-baseline.md); [audit A11Y-02](./implementation-gap-map.md#35-commands-keyboard-accessibility-dan-window-lifecycle); backlog `GAP-FW-005` | [`workbench_composition_shell.dart`](../../../flutter/lib/src/ui/workbench_composition_shell.dart), [`workbench_icon_button.dart`](../../../flutter/lib/src/ui/workbench_icon_button.dart), [`workbench_feature_surface_test.dart`](../../../flutter/test/workbench_feature_surface_test.dart) | Flutter owns semantic role/label/value/checked state; VoiceOver/NVDA/AT-SPI/Windows UIA announcements remain native evidence. | Required controls expose stable role, label, value, and state; selected object, dirty state, diagnostics, and panel visibility are announced; native AT smoke captures the current tree without claiming unverified platforms. |
| `GAP-FW-005` — native lifecycle (`WINDOW-01`) | `🌗` | `relgeo/flutter` + native host runners | [Catalog WINDOW-01](../../plans/12-flutter-workbench-capability-baseline.md); [audit WINDOW-01](./implementation-gap-map.md#35-commands-keyboard-accessibility-dan-window-lifecycle); backlog `GAP-FW-005` | [`workbench_window_host.dart`](../../../flutter/lib/src/ui/workbench_window_host.dart), [`workbench_method_channel_window_host.dart`](../../../flutter/lib/src/ui/workbench_method_channel_window_host.dart), [`workbench_window_host_test.dart`](../../../flutter/test/workbench_window_host_test.dart), [`workbench_method_channel_window_host_test.dart`](../../../flutter/test/workbench_method_channel_window_host_test.dart) | Flutter/native adapter owns close/quit request, dirty guard, and clean-exit callback; OS window-manager event delivery is host evidence. | Native close/quit requests invoke save/discard/cancel exactly once; cancel preserves the dirty document; clean exit completes without a stale callback; adapter tests and available desktop smoke agree. |

## Sequencing and dependency boundary

The intended sequence is:

1. Define document recovery and import/picker failure contracts (`DOC-08`,
   `IO-01`, `IO-02`).
2. Define stable object identity and selection, then use it to complete graph,
   inspector, and parameter synchronization (`VIEW-05`, `CANVAS-05`,
   `CANVAS-03`, `CANVAS-04`).
3. Apply the shared command/focus/semantics contract and verify window lifecycle
   behavior (`CMD-03`, `A11Y-01`, `A11Y-02`, `WINDOW-01`).

These are implementation-order constraints only. No cross-repository release,
pub.dev publication, or artifact promotion is a prerequisite.

## Deliberately excluded from active implementation

| Excluded item | Status | Reason |
| --- | --- | --- |
| `GAP-FW-002` — `EDIT-04`, `CONTRACT-01`, `CONTRACT-02`, `CONTRACT-03` | `🌗` | Cross-consumer DSL/SVG promotion requires shared fixture governance and is not needed to bound Flutter authoring debt. |
| `GAP-FW-006` — `PLAT-01` through `PLAT-04` | `🌗` | Current-pointer artifacts and multi-OS distribution evidence are release/CI work; no artifact or publication dependency is introduced here. |
| Remaining `🌗` rows not listed above | `🌗` | Visible candidate work remains in the backlog but is outside this bounded tranche. |
| All `✔️` rows, including New/Open/Save/Save As, dirty state, Recent, viewport/zoom, theme, layout persistence, and reduced motion | `✔️` | Existing source/local evidence describes these as implemented; they are not active debt. Native-runtime limitations remain evidence qualifiers. |
| Any `➖` scope boundary | `➖` | Out of Flutter ownership or explicitly outside the active contract; no implementation task is created. |
| Any `⏸️` held capability | `⏸️` | Requires a separate human/product or contract decision; it is not active implementation. |

No `➖` or `⏸️` item is treated as active implementation work.

## Status accounting

| Check | Result |
| --- | ---: |
| Selected capability IDs | 11 |
| Selected `🌗` rows | 9 (`DOC-08`, `IO-01`, `IO-02`, `CANVAS-03`, `CANVAS-04`, `CMD-03`, `A11Y-01`, `A11Y-02`, `WINDOW-01`) |
| Selected `❌` rows | 0 |
| Selected `⚠️` rows | 0 (none currently reported by the Flutter reconciliation) |
| Selected `➖` or `⏸️` rows | 0 |
| Selected IDs with owner, source path, boundary, and acceptance behavior | 11/11 |

Changing this record or the backlog is not implementation evidence. Each
selected row requires the source/test/host evidence stated above and a fresh
status-matrix, audit, and reconciliation review before its symbol changes.
