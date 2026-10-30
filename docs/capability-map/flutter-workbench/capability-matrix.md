# Flutter capability matrix

> **Coverage statement — 2026-10-30.** This historical aggregate matrix covers Flutter document
> lifecycle, editor/workbench, semantic runtime, geometry/SVG projection,
> persistence, platform, accessibility, and delivery boundaries using
> `flutter/lib/`, `flutter/test/`, fixtures, capability JSON, bridge/workflow
> plans, and available CI evidence. It does not claim current device, native
> accessibility, store, or release parity when those runs are absent. Current
> Flutter toolchain/device/CI/public checks remain `not verified` where stated;
> a missing row is not evidence of absence.
> See [inventory protocol](../INVENTORY-PROTOCOL.md) for status axes and evidence tiers.

## Matrix metadata

| Field | Value |
|---|---|
| Surface | Flutter semantic runtime, geometry/SVG projection, and workbench |
| Audit owner | Flutter child repository + workspace integration owner |
| Source of truth | `flutter/lib/`, `flutter/test/`, `flutter/pubspec.yaml`, `flutter/.github/workflows/`, `flutter/README.md`, `docs/flutter-capability-matrix.json`, active fixtures, and plans 06/07/10 |
| Audit date | 2026-10-29 |
| Evidence freshness | Historical local/CI evidence exists; current Flutter execution is not verified because the SDK cache write was denied. Current gitlink is `b21eceb`; baseline JSON is `f39a913`; plan CI evidence is root `328c869`. |

This aggregate matrix is retained as historical context. The capability-first
status authority is [`status-matrix.md`](./status-matrix.md), joined to the
expected IDs by [`reconciliation.md`](./reconciliation.md); the current local
tranche adds document recovery, dependency graph, and object-selection evidence
there without deleting the aggregate rows or their host/runtime qualifiers.

## Status legend

| Status | Meaning in this matrix |
|---|---|
| ✔️ | Bounded capability is implemented and has an explicit active contract/evidence record. It does not imply every extension is supported. |
| 🌗 | Implementation or evidence exists, but coverage, contract, or current-pointer verification is partial. |
| ❌ | An expected capability claim is not available at this surface/evidence boundary. |
| ➖ | Deliberately not a Flutter responsibility or not an acceptance target. |
| ⏸️ | Capability or release decision is intentionally held pending contract, consumer need, or maintainer decision. |
| ⚠️ | Confirmed problem or evidence inconsistency needs correction before relying on the claim. |

`not verified` is an evidence state, not a seventh status: it is used whenever
the audit did not execute the relevant current checkout, host, or external gate.

## Evidence-basis legend

The evidence column names the basis so a test helper, UI/source implementation,
and host evidence are not silently treated as the same kind of proof:

| Basis label | Meaning |
|---|---|
| `source + UI + test` | Product source is wired to a visible workbench surface and has a direct unit/widget/golden test. |
| `source + test` | The implementation boundary is tested, but no user-facing workbench claim is made by that evidence alone. |
| `test-only support` | A fixture adapter, semantic projection, or comparator exists only under `flutter/test/`; it supports parity evidence but is not a product capability. |
| `source/UI, host not verified` | Flutter code and/or UI wiring exists, but a real native picker, window, device, assistive technology, or OS runtime was not executed at the current pointer. |
| `supporting local/historical` | Local notes, old CI, or plan records support the claim but do not establish current-pointer or public delivery. |

`✔️`/`🌗` describe implementation at the inspected boundary; the basis and
`not verified` qualifier describe evidence strength. A test-only row is not a
claim that the user can invoke the behavior. A UI/source row without a current
host run is not native-runtime proof.

## Capability inventory and priority

| Capability | Status | Evidence | Gap / limitation | Consumer | Dependency | Next action |
|---|---:|---|---|---|---|---|
| New document lifecycle | ✔️ | `source + UI + test`: `cad_workbench.dart:197-202`; `widget_test.dart:480-550` covers the file-service fallback and dirty confirmation | Host callback and local fallback are separate integration modes; current native host not run | Workbench authors | `CADWorkbenchPage`, document session, host callbacks/file service | Re-run on current desktop host and record callback/file-picker behavior |
| Open document and file picker | ✔️ | `source + UI + test`: `cad_workbench.dart:139-195`; `workbench_file_service.dart:90-136`; `widget_test.dart:319-395`; `workbench_file_service_test.dart:42-71` | Picker cancellation is guarded before dirty confirmation; real picker/permission behavior is not verified here | Workbench authors | `file_picker`, host filesystem | Execute current-pointer picker smoke on macOS/Linux/Windows where supported |
| Save current document | ✔️ | `source + UI + test`: `cad_workbench.dart:204-253,261-296`; `workbench_file_service.dart:137-169`; `widget_test.dart:319-361,456-478` | Active path writes without a picker; host callback may own persistence; disk-full/permission paths are test-injected only | Workbench authors | file service, document identity/session | Capture native filesystem error behavior on each supported host |
| Save As and document identity | ✔️ | `source + UI + test`: `cad_workbench.dart:204-253,261-309`; `widget_test.dart:193-237,552-611`; `workbench_file_service_test.dart:23-39` | Save As picker and typed host result are covered through injected boundaries; native picker acceptance is not verified | Workbench authors | file picker, session path/name | Re-run Save As and title/recent update on current hosts |
| Recent documents | ✔️ | `source + UI + test`: `workbench_recent_documents.dart:6-92`; `cad_workbench.dart:166-184,298-307,629`; `workbench_recent_documents_test.dart:69-168` | Shared Preferences persistence is best effort; missing paths are removed, read errors are preserved; native path validity is not verified | Workbench authors | `shared_preferences`, recent file service | Verify path/permission behavior on each desktop host |
| Dirty state and discard guard | ✔️ | `source + UI + test`: `workbench_document_session.dart:8-102`; `cad_workbench.dart:678-713`; `widget_test.dart:239-282,363-421,502-550` | Guard covers New/Open/Close/Quit; native app close/window-manager termination is outside this Flutter widget evidence | Workbench authors and host lifecycle | document session, host confirmation callback | Add native window-close dirty-flow evidence |
| Error handling and recovery | 🌗 | `source + UI + test`: `cad_workbench.dart:194-212,652-688,780-795`; `workbench_document_recovery.dart`; recovery and invalid fixture tests | Failed Open/Save preserves source/dirty state; invalid compile keeps last valid canvas; best-effort dirty-draft restore/discard is wired and locally tested, while forced-exit/native storage remains unverified | Authors and support | YAML parser, resolver, diagnostics surface, persistence policy | Add forced-exit/relaunch and stale/corrupt-draft integration evidence |
| Editor/source authoring | ✔️ | `source + UI + test`: `features/editor/`, `workbench_editor_controller.dart`; `workbench_feature_surface_test.dart`; `editor_autocomplete_test.dart`; widget smoke | Editor is a real workbench feature with injected controller; full editing behavior depends on `re_editor` and native text input | Authors | `re_editor`, command context menu | Add current native text-input/IME evidence if supported |
| Undo/redo history | ✔️ | `source + UI + test`: `workbench_editor_controller.dart:1-52`; command registry `cad_workbench.dart:1181-1209`; `workbench_editor_controller_test.dart`; `widget_test.dart:284-317` | History is delegated to `re_editor`; document replacement clears history and agent replacement preserves one edit boundary | Authors | `re_editor`, Edit menu/shortcuts | Verify native keyboard history on each target host |
| Viewport/canvas navigation | ✔️ | `source + UI + test`: `workbench_viewport_controller.dart`; `canvas_painter.dart`; `workbench_viewport_controller_test.dart`; `workbench_viewport_transform_test.dart`; golden/widget tests | Fit/reset/zoom and canvas rendering are tested; physical GPU/gesture/resize behavior is not current-host verified | Authors | Flutter Canvas, `InteractiveViewer`, scene bbox | Run desktop gesture/resize smoke with current artifact |
| Inspector and parameter workbench | 🌗 | `source + UI + test`: `features/inspector/`, `features/parameters/`, `workbench_document_controller.dart`; `inspector_panel_test.dart`; `workbench_feature_surface_test.dart`; widget parameter/profile tests | UI and state wiring exist; object/property coverage and all DSL parameter semantics are not exhaustive | Authors/debugging | resolved scene, document settings, evaluator | Expand object/parameter coverage only with explicit contract needs |
| Diagnostics and invalid-document display | 🌗 | `source + UI + test`: `constraints.dart`, inspector contract, status badge; `constraints_diagnostics_test.dart`; `widget_test.dart:794-852`; fixture 14 | Runtime align diagnostic and invalid compile recovery are covered; complete diagnostic code/message parity remains partial | Authors and parity runner | resolver constraints, semantic projection | Canonicalize vocabulary across TypeScript and Dart |
| Import/open and SVG export | 🌗 | `source + UI + test`: File → Open uses file service; `workbench_svg_export_controller.dart:1-53`; `workbench_svg_export_controller_test.dart`; SVG exporter contract/reference tests | Import is source-file open, not a separate project/archive format; export picker/write path is injected; current native file dialog/export not verified | Authors and desktop delivery | `file_picker`, filesystem, SVG exporter | Execute current host export and preserve artifact evidence |
| Preferences and layout persistence | ✔️ | `source + UI + test`: `workbench_preferences.dart`, `workbench_layout_persistence.dart`; `workbench_preferences_test.dart`; `workbench_layout_persistence_test.dart`; widget relaunch/reset tests | Shared Preferences/layout persistence is best effort and schema-fallback guarded; browser/native storage behavior varies by host | Workbench authors | `shared_preferences`, serialized layout schema | Record current host persistence/relaunch smoke |
| Menu, command registry, and keyboard shortcuts | ✔️ | `source + UI + test`: `workbench_commands.dart`, `workbench_menu_bar.dart`, `workbench_platform_menu_bar.dart`, `cad_workbench.dart:1031-1369`; `workbench_context_menu_test.dart`; `workbench_platform_menu_bar_test.dart`; `widget_test.dart:193-237` | Common Control shortcuts are declared and routed through one registry; actual OS key mapping is not verified outside Flutter tests | Authors and desktop users | Flutter `Shortcuts`/`Actions`/`PlatformMenuBar` | Run keyboard smoke on current macOS/Linux/Windows artifacts |
| Keyboard accessibility, focus, semantics, reduced motion | 🌗 | `source + UI + test`: `keyboard_activatable.dart`, semantic keys/state, motion/layout controls; `keyboard_activatable_test.dart`; `widget_test.dart:659-767`; `workbench_motion_test.dart`; composition keyboard tests | Widget semantics, focus traversal, activation, and reduced-motion behavior have test evidence; VoiceOver/TalkBack/NVDA and current native AX tree are `not verified` | Authors and assistive-tech users | Flutter semantics/focus, host AT | Execute target AT smoke and archive OS/tool versions |
| Native menu, window policy, and lifecycle bridge | 🌗 | `source + test`: `workbench_platform_menu_bar.dart`, `workbench_window_policy.dart`, `workbench_method_channel_window_host.dart`, `main.dart`; platform/window host tests | macOS native menu policy and method-channel calls are unit/widget tested; actual macOS/Linux/Windows bridge behavior is not verified at current pointer | Desktop hosts | platform runners, method channel | Run target-native menu/window/quit smoke |
| Delivery and distribution boundary | ⏸️ | `supporting local/historical`: `flutter/.github/workflows/flutter-ci.yml`; local macOS ARM64 note; plans 06/07/10; `pubspec.yaml:1-16` | CI/build evidence is historical or pointer-mismatched; signing, notarization, installers, public distribution, and pub.dev are intentionally held/not applicable | Maintainers/release | Flutter SDK 3.41.9, OS runners, Apple identity | Refresh current-pointer CI; handle signing/distribution in a separate approved release task |
| Semantic fixture adapter and projection | 🌗 | `test-only support`: `flutter/test/support/shared_fixture.dart`, `semantic_projection.dart`, `svg_semantic_projection.dart`; `shared_v05_conformance_test.dart`, reference tests; JSON matrix | This is parity evidence infrastructure, not a user-facing Flutter capability; candidate flags do not promote active contract | Workspace conformance | canonical fixtures, TypeScript snapshots | Keep support evidence separate from product capability claims |
| YAML/DSL input and bounded scene resolution | 🌗 | `flutter/lib/src/core/resolver.dart`; tests `resolver_test.dart`, `shared_v05_conformance_test.dart`; fixture 10; JSON matrix flags local/shared/semantic/CI true | Dart implementation is separate from TypeScript parser; diagnostic vocabulary is not canonicalized; current pointer not re-run | Workbench, semantic fixture runner | YAML package; core contract; fixture adapter | Refresh current-pointer CI and define parser/diagnostic parity boundary |
| Scalar evaluator and units | 🌗 | `evaluator.dart`, `units.dart`, `evaluator_test.dart`; fixture 16 scene/SVG projection | Candidate only; Stage C unit/default/parameter policy remains unchecked; `SimpleEvalContext.callFunction` is intentionally empty outside resolver context | Resolver and fixture 16 candidate | Resolver context; unit policy; TypeScript core | Keep held until Stage C contract and clean-checkout gate are approved |
| Dependency graph and resolver integration | 🌗 | `graph.dart`, `resolver.dart`, `graph_test.dart`, active fixture 10 | Active fixture proves only its exercised graph; broad operation and cycle/error coverage are not established | Workbench and semantic projection | Geometry types; evaluator; fixture coverage | Add/verify representative dependency and error fixtures before broad claim |
| Primitive geometry and bounded line intersection | ✔️ | `geometry/types.dart`, `intersection.dart`; `clipper_test.dart`; fixture 15; plan 07 Stage B | Active contract is finite, non-degenerate line intersection; circle/arc and degenerate cases are outside | Resolver, boolean engine, SVG exporter | Geometry contract; tolerance policy | Re-run from current pointer; expand only with explicit contract decision |
| Boolean rectangle intersection/subtraction | ✔️ | `clipper_boolean.dart`; `clipper_test.dart`; fixture 15 expected scene/SVG; plan 07 Stage B | No active claim for union/xor, non-rectangle, degenerate, self-intersecting, or multipart results | Resolver and SVG exporter | Clipper2; geometry topology/tolerance | Preserve bounded contract; create a new decision/fixtures for expansion |
| Semantic scene projection | 🌗 | `test/support/semantic_projection.dart`; fixtures 10/14/15/16; canonicalization and `1e-6` comparison | Projection has an explicit unsupported-object branch; not all DSL/object kinds are covered; current execution not verified | Cross-consumer conformance | Expected JSON snapshots; TypeScript producer | Maintain projection coverage with each promoted capability |
| SVG geometry-semantic export | 🌗 | `svg_exporter.dart`; `svg_semantic_projection.dart`; exporter/reference/shared tests | Semantic geometry only; raw bytes, style, viewBox, metadata, text metrics, and diagnostic overlay are separate/non-goal | Workbench export, fixture comparison | Resolved scene; XML parser; renderer policy | Add presentation comparator/fixtures only for a real consumer requirement |
| Canvas painter and desktop workbench | 🌗 | `canvas_painter.dart`, `cad_workbench.dart`, workbench tests, goldens, local verification note | Flutter-only surface; golden pass is not proof of platform interaction or restore behavior; current host run not verified | Human desktop/web workbench users | Flutter SDK, platform plugins, file service | Re-run analyze/test/build on a permitted Flutter host; keep UI parity separate from semantic parity |
| Runtime constraint diagnostics | 🌗 | `constraints.dart`, `constraints_diagnostics_test.dart`, fixture 14, semantic violation projection | Default point-align path/message/object list is bounded; complete vocabulary and all constraint types remain partial | Workbench diagnostics and SVG overlay | Core constraint semantics; renderer overlay | Canonicalize error vocabulary before claiming full diagnostics parity |
| macOS ARM64/debug and web build | 🌗 | `flutter/.local/verification/macos-arm64-build-and-debug.md` historical 2026-10-07 note; plan 06/07 CI history | Prior artifact/build evidence is machine-local or tied to an older root; current checkout not verified | Desktop/web delivery confidence | Flutter 3.41.9; Xcode; host toolchain | Refresh evidence at `b21eceb` and retain architecture checks |
| Linux/Windows native runtime | 🌗 | Historical CI job names in plan 07 run 37832260326 | No current-pointer run or local host evidence in this audit; UI behavior is not verified | Desktop consumers | Separate Linux/Windows hosts and CI | Execute current-pointer platform jobs and archive logs/artifacts |
| Mobile physical runtime | ➖ | Plan 07 explicitly lists iOS physical validation as not done; plan 06 says mobile delayed | Outside the approved workbench target, not an accidental missing implementation | None in current target | Product decision and physical-device hosts | No action unless scope changes |
| Public Dart/pub.dev package | ➖ | `flutter/pubspec.yaml` has `publish_to: none`; plans explicitly preserve non-publishable posture | Package publication is intentionally excluded from Flutter surface | None in current release boundary | Maintainer release decision | Do not infer public package support from app version `1.0.0+1` |
| Desktop distribution, signing, notarization | ⏸️ | Local note records ad-hoc signature and `spctl` rejection; plans list distribution/signing as not done | Build artifact is not a Gatekeeper-ready release | Release/distribution consumers | Apple identity, credentials, release policy | Separate release task; do not sign/notarize during capability audit |
| Full DSL 0.5 parity across all objects/operations | ❌ | Active fixtures and matrix deliberately cover bounded contracts; unsupported semantic projection branch remains | No complete Flutter conformance claim or full object/operation inventory is evidenced | Any consumer expecting full spec parity | Spec/core/geometry/renderer parity decisions | Keep public claim bounded; enumerate and promote capabilities one by one |
| Automatic candidate promotion from passing tests | ⏸️ | Plan 07 explicitly says promotion is not automatic | Test pass alone cannot change active contract | Maintainers and release gates | Decision record and evidence review | Require explicit contract decision and synchronized matrix/fixtures |
| Raw SVG byte-for-byte parity | ➖ | Plan 07 defines semantic geometry as acceptance contract and raw bytes as non-goal | Formatting/attribute order/style details are not a Flutter parity requirement | None unless a consumer asks for it | Presentation policy decision | Do not add a byte comparator without an explicit consumer requirement |
| Matrix/baseline evidence freshness | ⚠️ | Current gitlink `b21eceb`; `docs/integration-baseline.json` `f39a913`; plan canonical run root `328c869` | Machine-readable baseline and historical CI evidence do not identify the current pointer consistently | All downstream release and compatibility reports | Clean checkout CI and baseline synchronization | Refresh baseline and CI evidence before using `ci=true` as current proof |

## Priority order

1. **P0 — repair evidence provenance:** synchronize the root Flutter gitlink,
   `docs/integration-baseline.json`, and the next clean-checkout CI evidence.
2. **P1 — preserve active boundary:** keep fixture 15 limited to line
   intersection and rectangle `intersect`/`subtract`; do not infer union/xor or
   full geometry support.
3. **P1 — decide evaluator/unit contract:** complete Stage C or explicitly keep
   fixture 16 candidate; document signed literals, units, defaults, parameters,
   and non-numeric strings.
4. **P2 — maintain semantic projection:** add projection coverage only when a
   capability is promoted; keep SVG presentation as a separate contract.
5. **P2 — platform confidence:** rerun macOS/web and current Linux/Windows CI;
   keep mobile and distribution/signing out of scope until separately decided.

## Audit conclusion

Flutter has a real, test-shaped semantic/runtime implementation and a usable
desktop workbench. The source and widget tests support separate claims for New,
Open, Save, Save As, Recent, dirty-state/discard, editor history, viewport,
inspector/parameters, diagnostics, import/export boundaries, preferences,
commands, and accessibility semantics. That does not make native host
interaction, device assistive technology, current-pointer CI, or signed
distribution verified. The bounded active fixture 15 contract remains the
strongest cross-consumer semantic claim; evaluator/unit promotion, broad
operation parity, complete diagnostics parity, mobile runtime, and distribution
remain partial, held, intentionally excluded, or not verified as marked above.
