# Flutter implementation audit — historical evidence summary

The detailed current audit and gap map is
[implementation-gap-map.md](./implementation-gap-map.md). This companion
document preserves the earlier source/test/evidence summary and must not be
read as a replacement for the current ID-by-ID audit.

> **Audit coverage statement — 2026-10-29.** This evidence log explicitly
> inspects Flutter document lifecycle, editor/workbench, semantic runtime,
> geometry/SVG rendering, persistence, platform, accessibility, and delivery
> through source, tests, fixtures, capability JSON, bridge/workflow plans, and
> available CI evidence. Device/native AT/store/release parity remains `not
> verified` where stated. See [inventory protocol](../INVENTORY-PROTOCOL.md).

## Audit metadata

| Field | Value |
|---|---|
| Surface | `flutter/` workbench, semantic runtime, geometry port, and SVG exporter |
| Audit date | 2026-10-29 |
| Owner boundary | Flutter child repository; workspace owns fixture, compatibility, and integration evidence |
| Source paths | `flutter/lib/`, `flutter/test/`, `flutter/pubspec.yaml`, `flutter/README.md`, `flutter/.github/workflows/`, `docs/flutter-capability-matrix.json`, `fixtures/`, `docs/plans/06-flutter-alignment.md`, `docs/plans/07-flutter-capability-promotion-and-svg-parity.md`, `docs/plans/10-desktop-runtime-smoke-checklist.md`, `flutter/.local/verification/macos-arm64-build-and-debug.md` |
| Intended consumer | Non-publishable desktop/web Flutter workbench and semantic consumer of the RelGeo 0.5 contract |
| Verification boundary | Source and test inventory was inspected in the workspace. Current Flutter execution was not completed: the explicit SDK attempted to write `bin/cache/engine.stamp` outside the writable workspace and was denied. Historical local/CI evidence is therefore recorded as historical, not as a fresh run for this audit. |

## Evidence interpretation

`docs/flutter-capability-matrix.json` is the machine-readable evidence contract. Its
flags describe checks that were run, but its own policy says that flags do not
promote a candidate to the active contract. This audit keeps three questions
separate:

1. apakah source implementation ada;
2. apakah capability sudah masuk contract aktif atau masih candidate;
3. apakah evidence tersebut masih dapat dihubungkan ke pointer yang sedang diaudit.

The current root gitlink is `flutter@b21eceb258070133f32fd822b6fd23a4f21b0bbf`
(`git submodule status flutter`, 2026-10-29). The checked-in integration baseline
still records `f39a913708e28625125ee8b64ccb350250db1d5d`, while the promotion plan
uses canonical run `37832260326` on root `328c869`. This is a provenance mismatch;
it does not prove the current child source fails, but it prevents this audit from
calling the historical CI result a current-pointer verification.

## Required evidence checklist

| Required source | Audit use | Current evidence posture |
|---|---|---|
| `flutter/lib/` | Product runtime, UI, commands, services, platform boundary, and composition wiring | Inspected in the current checkout; source presence is not native-host verification. |
| `flutter/test/` | Unit, widget, golden, fixture, semantics, command, lifecycle, and platform-boundary evidence | Inspected as test source; current Flutter execution is `not verified` in this environment. |
| `flutter/pubspec.yaml` | SDK/dependency and publish/distribution boundary | `publish_to: none`, app version `1.0.0+1`, and Flutter/Dart dependency boundary recorded. |
| `flutter/.github/workflows/` | Canonical quality/build matrix and MCP sibling checkout | Workflow inspected; historical run claims remain historical unless tied to current pointer. |
| `flutter/.local/verification/macos-arm64-build-and-debug.md` | Machine-local macOS ARM64, web, build, signing, and interactive limitations | Supporting local evidence only; ignored machine-local instructions were not executed. |
| `docs/flutter-capability-matrix.json` | Machine-readable capability/evidence policy and candidate/active distinction | Historical/canonical metadata inspected; flags are not promoted to current evidence. |
| `docs/plans/06-flutter-alignment.md` | Contract alignment, fixture boundary, active/candidate policy, historical CI | Plan and linked run records are evidence context, not current execution. |
| `docs/plans/07-flutter-capability-promotion-and-svg-parity.md` | Boolean/intersection promotion and evaluator/SVG parity boundaries | Promotion decisions and non-goals inspected; unchecked work remains held/open. |
| `docs/plans/10-desktop-runtime-smoke-checklist.md` | OS launch, window, keyboard, file, accessibility, and distribution smoke contract | Checklist is explicit; macOS interaction is blocked/partial, Linux/Windows runtime remains not verified. |

## Capability-level lifecycle audit

This table records the requested workbench capabilities separately instead of
folding them into one generic “desktop workbench” row. `Implementation basis`
distinguishes product source/UI, direct tests, test-only support, and historical
or host evidence.

| Capability | Implementation basis | Direct evidence | Status / boundary |
|---|---|---|---|
| New document | Source + UI + widget test; local fallback and host callback | `flutter/lib/src/ui/cad_workbench.dart:197-202`; `flutter/test/widget_test.dart:480-550` | Implemented at Flutter boundary. Native host behavior is `not verified`. |
| Open document | Source + UI + widget/unit tests; file service and picker boundary | `flutter/lib/src/ui/cad_workbench.dart:139-195`; `flutter/lib/src/ui/workbench_file_service.dart:90-136`; `flutter/test/widget_test.dart:319-395`; `flutter/test/workbench_file_service_test.dart:42-71` | Implemented at Flutter boundary. Picker permission and current OS behavior are `not verified`. |
| Save document | Source + UI + widget/unit tests; active identity write and typed host result | `flutter/lib/src/ui/cad_workbench.dart:204-253,261-296`; `flutter/lib/src/ui/workbench_file_service.dart:137-169`; `flutter/test/widget_test.dart:319-361,456-478` | Implemented at Flutter boundary. Disk/permission failure is test-injected; native behavior is `not verified`. |
| Save As and document identity | Source + UI + widget/unit tests; destination picker and identity update | `flutter/lib/src/ui/cad_workbench.dart:204-253,261-309`; `flutter/test/widget_test.dart:193-237,552-611`; `flutter/test/workbench_file_service_test.dart:23-39` | Implemented at Flutter boundary. Native Save As picker acceptance is `not verified`. |
| Recent documents | Source + UI + unit/widget tests; SharedPreferences-backed bounded store, deduplication, removal, and Recent menu | `flutter/lib/src/ui/workbench_recent_documents.dart:6-92`; `flutter/test/workbench_recent_documents_test.dart:69-168`; `flutter/test/widget_test.dart:319-361` | Implemented as best-effort desktop path history. Host path validity and permission behavior remain `not verified`. |
| Dirty state and destructive-action guard | Source + UI + widget tests; session compares current and last saved source and exposes callback | `flutter/lib/src/ui/workbench_document_session.dart:8-102`; `flutter/lib/src/ui/cad_workbench.dart:678-713`; `flutter/test/widget_test.dart:239-282,363-421,502-550` | Implemented for New/Open/Close/Quit flows. Native window-manager close and crash recovery are not proven. |
| Error handling and recovery | Source + UI + widget/fixture tests; failed file operations preserve source, invalid compile keeps last valid canvas | `flutter/lib/src/ui/cad_workbench.dart:254-259,726-777`; `flutter/test/widget_test.dart:423-478,822-852`; `flutter/test/invalid_fixture_boundary_test.dart` | Implemented for operation/compile recovery. Restart/autosave recovery is not implemented or verified. |
| Editor and source authoring | Product feature source + widget/support tests | `flutter/lib/src/features/editor/`; `flutter/lib/src/ui/workbench_editor_controller.dart`; `flutter/test/workbench_feature_surface_test.dart`; `flutter/test/editor_autocomplete_test.dart` | Implemented workbench surface. Full `re_editor` native text/IME behavior is not current-host verified. |
| Undo/redo | Product command/menu wiring + editor unit/widget tests | `flutter/lib/src/ui/cad_workbench.dart:1181-1209`; `flutter/test/workbench_editor_controller_test.dart`; `flutter/test/widget_test.dart:284-317` | Implemented through `re_editor`; document replacement intentionally clears history. Native keyboard mapping remains `not verified`. |
| Viewport/canvas | Product controller, painter, preview widgets + unit/widget/golden tests | `flutter/lib/src/ui/workbench_viewport_controller.dart`; `flutter/lib/src/ui/canvas_painter.dart`; `flutter/test/workbench_viewport_controller_test.dart`; `flutter/test/sheet_preview_golden_test.dart` | Implemented and test-shaped. Physical GPU, gesture, resize, and current desktop interaction remain `not verified`. |
| Inspector and parameters | Product feature source + widget tests; parameter overrides feed recompilation | `flutter/lib/src/features/inspector/`; `flutter/lib/src/features/parameters/`; `flutter/test/inspector_panel_test.dart`; `flutter/test/workbench_feature_surface_test.dart`; `flutter/test/workbench_document_settings_test.dart` | Implemented partial surface. Exhaustive object/property and DSL parameter parity is not established. |
| Diagnostics | Runtime source + inspector/status UI + fixture/widget tests | `flutter/lib/src/core/constraints.dart`; `flutter/test/constraints_diagnostics_test.dart`; `flutter/test/widget_test.dart:794-852`; fixture 14 | Partial: align/runtime and invalid-edit display are direct evidence; full diagnostic vocabulary parity is open. |
| Import/open and export | File service for source import/open; SVG exporter controller for native destination/write boundary | `flutter/lib/src/ui/workbench_file_service.dart`; `flutter/lib/src/ui/workbench_svg_export_controller.dart`; `flutter/test/workbench_svg_export_controller_test.dart`; `flutter/test/reference_fixtures_test.dart` | Source import and SVG export are implemented at injected boundary. Real native dialog/write behavior is `not verified`; no separate archive/project import exists. |
| Preferences and layout persistence | SharedPreferences stores theme/profile/overlay/role settings; versioned layout persistence stores dock tree | `flutter/lib/src/ui/workbench_preferences.dart`; `flutter/lib/src/ui/workbench_layout_persistence.dart`; `flutter/test/workbench_preferences_test.dart`; `flutter/test/workbench_layout_persistence_test.dart`; `flutter/test/widget_test.dart:1198-1317` | Implemented best-effort with safe fallback. Host storage/relaunch behavior is not current-pointer verified. |
| Menu, command registry, context menus, and shortcuts | Product command registry fans into menu, context menu, toolbar, global `Shortcuts`/`Actions`, and macOS `PlatformMenuBar` | `flutter/lib/src/ui/workbench_commands.dart`; `flutter/lib/src/ui/workbench_menu_bar.dart`; `flutter/lib/src/ui/workbench_platform_menu_bar.dart`; `flutter/test/workbench_context_menu_test.dart`; `flutter/test/workbench_platform_menu_bar_test.dart` | Implemented Flutter command surface. OS-specific mapping is only boundary-tested, not native-runtime verified. |
| Keyboard accessibility and semantics | Product FocusableActionDetector/semantic state/reduced-motion controls + semantics/focus tests | `flutter/lib/src/ui/keyboard_activatable.dart`; `flutter/test/keyboard_activatable_test.dart`; `flutter/test/widget_test.dart:659-767`; `flutter/test/workbench_motion_test.dart`; `flutter/test/workbench_composition_shell_test.dart:664-802` | Partial: Flutter semantics/focus/activation are tested; VoiceOver, TalkBack, NVDA, and current native AX tree are `not verified`. |
| Native platform integration | Method-channel window configure/close, platform menu policy, default/minimum sizes, macOS app-menu arrangement | `flutter/lib/src/ui/workbench_method_channel_window_host.dart`; `flutter/lib/src/ui/workbench_window_policy.dart`; `flutter/lib/main.dart`; `flutter/test/workbench_method_channel_window_host_test.dart`; `flutter/test/workbench_window_host_test.dart` | Partial boundary implementation. Current macOS/Linux/Windows runner behavior is not verified. |
| Delivery and distribution | CI quality/desktop matrix, local ARM64/web/build notes, non-publishable pubspec, desktop smoke checklist | `flutter/.github/workflows/flutter-ci.yml`; `flutter/.local/verification/macos-arm64-build-and-debug.md`; `docs/plans/10-desktop-runtime-smoke-checklist.md`; `flutter/pubspec.yaml` | Build evidence is historical/pointer-scoped. Signing, notarization, installer/public distribution, and pub.dev are held or out of scope. |
| Semantic fixture adapter/projection | Test-only support source, not product UI; compares declared JSON/SVG semantic facts | `flutter/test/support/shared_fixture.dart`; `flutter/test/support/semantic_projection.dart`; `flutter/test/support/svg_semantic_projection.dart`; `flutter/test/shared_v05_conformance_test.dart`; `docs/flutter-capability-matrix.json` | Evidence infrastructure is present; it must not be reported as a user-facing capability or automatic promotion. |

## Implementation findings

| Area | Actual implementation inspected | Direct evidence | Boundary / finding |
|---|---|---|---|
| Input and scene resolution | `flutter/lib/src/core/resolver.dart` exports `resolveGeometry`; `flutter/lib/src/ui/cad_workbench.dart` invokes it for workbench documents. `flutter/lib/src/core/graph.dart` provides dependency ordering. | `flutter/test/resolver_test.dart`, `flutter/test/graph_test.dart`, `flutter/test/shared_v05_conformance_test.dart`, fixture 10 and invalid fixtures 11–13. | YAML input and bounded scene resolution exist. This is a Dart port, not a reuse of TypeScript parser code; full parser/diagnostic vocabulary parity is not established. |
| Expression evaluator and units | `flutter/lib/src/core/evaluator.dart` implements typed recursive-descent evaluation; `flutter/lib/src/core/units.dart` implements unit conversion. `SimpleEvalContext.callFunction` intentionally returns null; resolver supplies the richer geometry context. | `flutter/test/evaluator_test.dart`; fixture 16 candidate; plan 07 Stage C remains unchecked. | Candidate coverage exists for signed literals, `in`/`mm`, derived placement, and non-numeric strings. Promotion is held until unit policy and full integration gate are explicitly accepted. |
| Geometry primitives and intersections | `flutter/lib/src/geometry/types.dart`, `intersection.dart`, `transforms.dart`, and `utils.dart`; public exports are assembled by `flutter/lib/relgeo_flutter.dart`. | `flutter/test/clipper_test.dart`, shared fixture 15, machine-readable capability matrix. | Bounded primitive/intersection implementation exists. Active contract is finite, non-degenerate line intersection; circle/arc and degenerate extensions are outside the promoted boundary. |
| Boolean geometry | `flutter/lib/src/geometry/clipper_boolean.dart` exposes `ClipperBooleanEngine`; resolver maps boolean objects to the engine. | `flutter/test/clipper_test.dart`, fixture 15 expected scene/SVG, plan 07 Stage B. | Rectangle `intersect` and `subtract`, single-island topology, ring closure/tolerance, and documented empty/multipart error boundaries are active. `union`, `xor`, non-rectangle operands, degenerate inputs, and multipart policy are not active. |
| Semantic projection | `flutter/test/support/semantic_projection.dart` projects object kind, identity, geometry, metadata, bbox, and violations; canonicalization normalizes closed-ring duplication/rotation. | `flutter/test/shared_v05_conformance_test.dart`, fixtures 10, 14, 15, and 16. | Semantic comparison is the intended parity contract. It does not cover every Flutter object type or every DSL feature; unsupported projection branches throw `UnsupportedError`. |
| SVG semantic export | `flutter/lib/src/ui/svg_exporter.dart` renders primitives, paths, boolean geometry, metadata, sheets, dimensions, and diagnostic presentation. `flutter/test/support/svg_semantic_projection.dart` parses geometry-bearing SVG and ignores non-contract presentation. | `flutter/test/svg_exporter_contract_test.dart`, `flutter/test/reference_fixtures_test.dart`, shared conformance tests. | Geometry-bearing SVG projection is covered for declared fixtures. Raw bytes, attribute order, styles, viewBox, text metrics, metadata, and overlay parity are intentionally separate/non-goal unless a consumer contract is added. |
| Canvas/workbench | `flutter/lib/src/ui/canvas_painter.dart`, `cad_workbench.dart`, document/editor/viewport/layout/preferences/file-service components. `flutter/lib/main.dart` starts the app. | `flutter/test/canvas_painter_test.dart`, widget/workbench tests, `flutter/test/goldens/`, local verification note. | Flutter-specific presentation and desktop workbench exist. They are not a TypeScript parity target. Golden files demonstrate intended UI states, not cross-platform runtime behavior. |
| Runtime diagnostics | `flutter/lib/src/core/constraints.dart` produces `ConstraintViolation`; semantic projection includes type/message/deviation/path/involved objects and optional visual helper. | `flutter/test/constraints_diagnostics_test.dart`, fixture 14, plan 06 history of `align` correction. | Default point-align projection is bounded and tested. Cross-consumer error vocabulary and all constraint types remain partial. |
| Platform/build surface | `flutter/pubspec.yaml` is `publish_to: none`; app version `1.0.0+1` is separate from DSL 0.5. macOS/web build commands are documented in the local verification note. | `flutter/.local/verification/macos-arm64-build-and-debug.md`; historical local 299-test, macOS debug/release, and web-build notes; plan 06/07 CI history. | Historical macOS ARM64/universal and web build evidence exists. Current run, Linux/Windows runtime, mobile physical validation, signing, notarization, and distribution are not verified here. |

## Evidence boundary and suspicious/stale data handling

The repository contains historical execution claims and generated failure images.
They were treated as evidence records, not instructions to execute privileged
commands or change policy. No embedded repository instruction was followed.

The local verification note is intentionally ignored and machine-specific. It is
useful evidence of a prior Mac host, but cannot establish a fresh build in this
workspace. The current attempt confirmed the boundary: `/Users/agusmade/development/flutter/bin/flutter`
was present, but its version command tried to update `bin/cache/engine.stamp` and
was denied by the sandbox. No Flutter test, analyzer, or build result is claimed
for the current checkout.

The root pointer/baseline mismatch is the main audit issue. Before promoting or
regressing any Flutter capability, refresh `docs/integration-baseline.json`, run
the Flutter jobs from a clean checkout at the current root pointer, and record
the resulting child revision in the evidence record.
