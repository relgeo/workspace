# Flutter Workbench — Implementation Audit and Gap Map

> **Release checkpoint — 2026-10-31:** Current Flutter pointer `60ec76042b369659e4d048b2a53ea3a66a384de3` passed Flutter CI run `41184291670`; release workflow `41184693233` produced a v1.0.1 draft with macOS universal, Linux x64, and Windows x64 archives and checksums. This supersedes the stale claim below that current-pointer builds/artifacts are unavailable. It does not close PLAT-01..03 target runtime smoke or PLAT-04 baseline synchronization: `docs/integration-baseline.json` remains from 2026-10-09. ChatGPT Desktop edit interoperability remains a separate live-client check. The 307-test and analyzer results below describe the 2026-10-30 checkout, not the current release pointer.

> **Coverage statement — 2026-10-30.** Audit ini membandingkan seluruh 61 ID
> capability pada [expected catalog](./expected-capability-catalog.md);
> lima `SCOPE-*` rows di katalog diperlakukan sebagai keputusan scope terpisah,
> bukan capability implementation row. Audit dilakukan terhadap checkout
> `flutter` saat ini. Discovery mencakup source/UI, feature
> screens, menu/command/shortcut, service dan platform boundary, config,
> test/golden/fixture, analyzer/test execution, build workflow, runtime note,
> serta plan dan decision docs. Checkout yang diaudit adalah
> `flutter@b21eceb258070133f32fd822b6fd23a4f21b0bbf`; mobile, signing/store,
> native AT, dan host runtime lintas OS tidak dapat dinyatakan terverifikasi
> dari environment ini. Missing implementation dibedakan dari evidence yang
> belum dapat dijalankan.

**Expected catalog:** [`expected-capability-catalog.md`](./expected-capability-catalog.md)
**Reconciliation:** [`flutter-workbench/reconciliation.md`](./reconciliation.md)  
**Status matrix:** [`flutter-workbench/status-matrix.md`](./status-matrix.md)  
**Gap backlog:** [`flutter-workbench/implementation-gap-backlog.md`](./implementation-gap-backlog.md)

## 1. Audit metadata dan status model

| Field | Nilai |
| --- | --- |
| Surface | Flutter desktop authoring workbench, semantic runtime, geometry/SVG consumer |
| Detailed source audit checkout (2026-10-30) | `flutter@b21eceb258070133f32fd822b6fd23a4f21b0bbf` (`staging-2026-09-11-114-gb21eceb`); the release checkpoint above is the current `60ec760` pointer. |
| Host | macOS `14.5`, `arm64` |
| Flutter/Dart | Flutter stable `3.41.9` / Dart `3.11.5` dari SDK lokal |
| Historical local rerun (2026-10-30) | `flutter analyze --no-pub` — **PASS, No issues found**; `flutter test --no-pub --reporter compact` — **PASS, 307 tests passed**. Golden suites emit a configuration warning because the `golden` tag is not declared in `dart_test.yaml`; this did not fail the run. |
| Analyzer at the 2026-10-30 pointer | `flutter analyze --no-pub` — **No issues found**; historical local evidence only. |
| Flutter tests at the 2026-10-30 pointer | `flutter test --no-pub --reporter compact` — **307 tests passed**; historical local evidence for that checkout. |
| Fresh web build | **Not verified / environment unavailable**: `flutter build web --no-pub` stopped at `/Users/agusmade/development/flutter/bin/internal/update_engine_version.sh:64` because the SDK could not write `/Users/agusmade/development/flutter/bin/cache/engine.stamp` (`Operation not permitted`). This is not classified as a source/build defect. |
| Fresh macOS build | **Not verified** karena blocker SDK yang sama; tidak diklaim sebagai build failure source |
| Historical/canonical CI | Run `37832260326`, root `328c869`, Flutter `ea8e754`; historical, bukan pointer yang sedang diaudit |
| Workspace baseline pointer | `docs/integration-baseline.json` masih mencatat Flutter `f39a913...`; berbeda dari checkout `b21eceb...` |

### 1.1 Status implementation dan evidence

Status implementation menjawab apakah capability ada pada boundary source yang
diaudit. Status evidence menjawab seberapa kuat claim tersebut diverifikasi.

| Label | Arti |
| --- | --- |
| `implemented` | Source/UI/service boundary ada dan unit/widget/static evidence mendukungnya. Tidak otomatis berarti native runtime lulus. |
| `partial` | Hanya subset, boundary terbatas, parity belum lengkap, atau capability tersedia tetapi deliverable user belum lengkap. |
| `absent` | Requirement expected ada, tetapi tidak ditemukan implementation user-facing pada boundary yang diaudit. |
| `broken` | Defect/mismatch terkonfirmasi oleh pemeriksaan yang dijalankan; bukan sekadar tidak ada evidence. |
| `deferred` | Sengaja ditahan oleh keputusan scope/dependency. |
| `not applicable` | Bukan tanggung jawab boundary ini atau dikeluarkan dari scope aktif. |
| `E1` | Source/static inspection. |
| `E2` | Test/golden/fixture yang dijalankan pada checkout saat ini. |
| `E3` | Semantic/conformance evidence pada fixture atau cross-surface contract. |
| `E4` | CI/canonical atau historical build evidence dengan revision yang tercatat. |
| `E5` | Native desktop/runtime/accessibility evidence langsung. Tidak ada E5 baru pada audit ini. |
| `not verified` | Pemeriksaan yang dibutuhkan belum dapat dijalankan atau tidak dapat dihubungkan ke pointer saat ini. |

Tidak ada `broken` yang terkonfirmasi dari pemeriksaan ini. Build web/macOS
yang tertahan oleh write boundary SDK diklasifikasikan sebagai `not verified`,
bukan defect build. `deferred` dan `not applicable` hanya dipakai pada scope
boundary di §4, bukan untuk menyamarkan capability yang belum dibuat.

## 2. Discovery coverage report

| Kategori discovery | Sumber yang diperiksa | Coverage / hasil |
| --- | --- | --- |
| Application entry/composition | `flutter/lib/main.dart`, `flutter/lib/src/ui/cad_workbench.dart`, `workbench_composition_shell.dart`, `workbench_navbar.dart` | App root, lifecycle wiring, panel composition, status/identity, theme/layout wiring tercakup. |
| Feature screens and routes | `flutter/lib/main.dart`, `flutter/lib/src/ui/cad_workbench.dart`, `flutter/lib/src/features/editor/`, `preview/`, `inspector/`, `parameters/`, `workbench_feature_surfaces.dart` | `MaterialApp` composes a single workbench surface; no named `routes`, `onGenerateRoute`, or separate graph screen was found. Editor, preview/canvas, inspector, parameters, overlay/viewport toolbar tercakup. |
| Menu/commands/shortcuts | `workbench_commands.dart`, `workbench_menu_bar.dart`, `workbench_platform_menu_bar.dart`, `workbench_context_menu.dart`, command registry construction in `cad_workbench.dart` | File/Edit/View/Document/Workbench/Help, enabled/checked state, native menu adapter, global `Shortcuts`/`Actions`, context menu tercakup. |
| File/document services | `workbench_file_service.dart`, `workbench_document_session.dart`, `workbench_recent_documents.dart`, document controller/session wiring | New/Open/Save/Save As, identity, dirty, Recent, failure preservation, discard guard tercakup. Crash/session recovery tidak ditemukan. |
| Editor | `editor_panel.dart`, `workbench_editor_controller.dart`, editor contracts, `re_editor` dependency | Source editor, autocomplete, native editor history, compile scheduling, semantics tercakup. |
| Canvas/viewport | `canvas_painter.dart`, `workbench_viewport_panel.dart`, `workbench_viewport_controller.dart`, `workbench_viewport_transform.dart`, overlay/viewport toolbars | Canvas render, InteractiveViewer pan, zoom, fit, reset, target selector, role/overlay controls tercakup. Object hit-test selection tidak ditemukan. |
| Inspector/diagnostics | `inspector_panel.dart`, `workbench_inspector_feature.dart`, `constraints.dart`, status badge, diagnostics tabs | Objects/values/errors/BOM and bounded constraint display tercakup; complete diagnostic vocabulary remains partial. |
| Persistence/preferences | `workbench_preferences.dart`, preferences controller, `workbench_layout_persistence.dart`, layout model/profiles/docking tree | SharedPreferences theme/profile/overlay/recent and versioned layout/dock-tree persistence tercakup. Document crash recovery tidak tercakup. |
| Platform/config | `pubspec.yaml`, `analysis_options.yaml`, `flutter/.github/workflows/flutter-ci.yml`, `macos/`, `linux/`, `windows/`, `workbench_window_policy.dart`, method-channel host | Non-publishable posture, dependency boundary, CI matrix, window policy, native bridge, runner files tercakup. Current artifact build blocked by SDK write boundary. |
| Test/golden/fixture | seluruh `flutter/test/`, `test/goldens/`, support semantic/SVG projection, shared fixture loader | 307 test current lulus; golden suite lulus dengan warning tag `golden` belum dideklarasikan di `dart_test.yaml`; fixture/conformance support tercakup. |
| Runtime/accessibility | `docs/plans/10-desktop-runtime-smoke-checklist.md`, `flutter/.local/verification/macos-arm64-build-and-debug.md`, native bridge tests, semantics/focus tests | Checklist dan boundary tests tercakup; native window, VoiceOver/screen-reader, Linux/Windows runtime masih `not verified`. The local note is historical/supporting evidence and is not promoted to current-pointer E5. |
| Product/contract docs | `docs/MATURATION-MASTER-PLAN.md`, `docs/REPOSITORY-MAP.md`, `docs/capability-map/INVENTORY-PROTOCOL.md`, plans 06/07/10, W01/W02/W03, decisions 09, expected catalog, existing capability-map audit/matrix | Requirement, repository ownership, inventory boundary, contract, promotion, desktop scope, and prior audit claims diperiksa dan dipisahkan dari current evidence. |

## 3. ID-by-ID reconciliation

`Observed evidence` mencantumkan implementation basis dan pemeriksaan terkuat.
`Gap / verification` menyimpan sisa gap tanpa mengubah expected catalog.

### 3.1 Document, file, dan recovery

| ID | Implementation | Evidence | Observed evidence | Gap / verification |
| --- | --- | --- | --- | --- |
| DOC-01 | implemented | E1/E2 | `cad_workbench.dart` menyediakan New callback dan local minimal-document fallback; `widget_test.dart` menguji fallback dan dirty guard. | Host-specific New lifecycle belum E5 diverifikasi. |
| DOC-02 | implemented | E1/E2 | `WorkbenchFileService`/`FilePickerWorkbenchFileService` dan Open command ada; widget/file-service tests lulus. | Dialog/permission native belum E5 diverifikasi. |
| DOC-03 | implemented | E1/E2 | Save active path, typed save acknowledgement, dirty clear, dan failure preservation ada; `widget_test.dart` dan `workbench_file_service_test.dart` lulus. | Native disk/picker runtime belum E5 diverifikasi. |
| DOC-04 | implemented | E1/E2 | Save As destination path dan identity update ada; widget tests menguji typed identity. | Native Save As dialog belum E5 diverifikasi. |
| DOC-05 | implemented | E1/E2 | `WorkbenchRecentDocumentsStore` memakai SharedPreferences, dedup/max list, missing removal; Recent widget tests lulus. | Path validity/permission host belum E5 diverifikasi. |
| DOC-06 | implemented | E1/E2 | `WorkbenchDocumentSession.isDirty`, navbar marker, and session updates ada; dirty tests lulus. | Tidak ada gap implementation; native window visibility belum E5. |
| DOC-07 | implemented | E1/E2 | New/Open/Close/Quit melewati discard callback/guard; destructive-action tests lulus. | Native window-manager close event belum E5 diverifikasi. |
| DOC-08 | partial | E1/E2 | `WorkbenchDocumentRecoveryStore` menyimpan draft source/identity secara best-effort; `cad_workbench.dart` menyimpan dirty edits, menawarkan RESTORE/DISCARD saat startup, dan membersihkan draft setelah lifecycle sukses; focused recovery tests lulus. | Forced-exit/native storage behavior and a real relaunch smoke remain unverified; retain as an active partial gap. |
| DOC-09 | implemented | E1/E2 | `WorkbenchDocumentFile`, path/name, UTF-8 read/write, document session identity tersedia; file-service tests lulus. | Format/encoding error UX lintas OS belum E5. |
| IO-01 | partial | E1/E2; native not verified | `file_picker` adapter dipasang sebagai default untuk Open/Save As dan tests memakai injected boundary. | Native picker appearance/cancel/permission pada macOS/Linux/Windows belum diverifikasi. |
| IO-02 | partial | E1/E2/E3 | Open reads `.yaml`, `.yml`, `.relgeo`; YAML resolver and shared fixture/conformance tests lulus. | Tidak ada archive/project import terpisah; extension/filter and error vocabulary masih open. |

### 3.2 Authoring, compile, diagnostics, dan contract

| ID | Implementation | Evidence | Observed evidence | Gap / verification |
| --- | --- | --- | --- | --- |
| EDIT-01 | implemented | E1/E2 | `EditorPanel`, `WorkbenchEditorFeature`, `re_editor`, widget/workbench tests. | Native IME/text interaction belum E5. |
| EDIT-02 | implemented | E1/E2 | `RelGeoAutocompleteView` dan semantic selection actions; `editor_autocomplete_test.dart` lulus. | Full DSL vocabulary parity belum E3 lengkap. |
| EDIT-03 | implemented | E1/E2 | `cad_workbench.dart` debounce compile path dan targeted listeners; current widget suite lulus. | Timing/performance runtime desktop belum E5 diukur. |
| EDIT-04 | partial | E2/E3 | `ConstraintViolation`, inspector Errors, align fixture, invalid boundary, dan semantic projection tersedia. | Full cross-consumer diagnostic vocabulary/path/object parity belum selesai. |
| EDIT-05 | implemented | E2/E3 | Invalid edit tests mempertahankan valid preview terakhir dan menampilkan error. | Native runtime state transition belum E5. |
| EDIT-06 | implemented | E1/E2 | `re_editor` history, Edit → Undo, controller/widget tests. | Shortcut mapping native per OS belum E5. |
| EDIT-07 | implemented | E1/E2 | `re_editor` redo, Edit → Redo, controller/widget tests. | Shortcut mapping native per OS belum E5. |
| EDIT-08 | implemented | E1/E2 | Copy source command and context menu use shared registry; context-menu/widget tests lulus. | Clipboard permission/behavior native belum E5. |
| CONTRACT-01 | partial | E2/E3/E4 historical | `pubspec.yaml`/README state DSL 0.5; resolver, YAML, shared fixture adapter, and the historical 2026-10-30 307-test suite pass. | Full DSL parser/diagnostic contract parity bukan seluruhnya proven; baseline child pointer differs from canonical docs. |
| CONTRACT-02 | partial | E2/E3/E4 historical | Resolver/graph/geometry/boolean implementations and semantic projection exist; fixture 15 active only on bounded contract; the historical 2026-10-30 307-test suite passes. | Evaluator/unit fixture 16 remains candidate; union/xor/non-rectangle/degenerate surfaces remain outside active contract. |
| CONTRACT-03 | partial | E2/E3/E4 historical | `SvgExporter`, SVG contract tests, semantic SVG projection, fixture snapshots exist. | Semantic core is bounded; raw bytes/style/viewBox/text/metadata/overlay presentation are deliberately not contract. |

### 3.3 Canvas, preview, inspection, dan navigation

| ID | Implementation | Evidence | Observed evidence | Gap / verification |
| --- | --- | --- | --- | --- |
| CANVAS-01 | implemented | E1/E2 | `CanvasPainter`, `WorkbenchViewportPanel`, widget/golden/sheet preview tests. | GPU/window resize/native runtime belum E5. |
| CANVAS-02 | implemented | E1/E2 | `WorkbenchPreviewTarget` supports model/sheet; widget tests switch sheet and back to model. | Component target is declared but renderer support is not active; not part of current expected model/sheet outcome. |
| CANVAS-03 | partial | E1/E2 | `InspectorPanel` tabs Objects/Values/Errors/BOM and inspector tests cover geometry/semantics. | Exhaustive object/property/constraint inspection parity belum established. |
| CANVAS-04 | partial | E1/E2 | `ParametersPanel` is conditional and parameter override/reset tests exist. | Full parameter/evaluator policy remains candidate/partial; no empty-panel regression beyond current covered paths. |
| CANVAS-05 | implemented at Flutter boundary | E1/E2 | `WorkbenchSceneGraph` projects resolved relationships; `WorkbenchSceneGraphPanel` renders selectable nodes; View → Panels → Dependency graph exposes it; focused graph model/panel tests and the full 307-test suite pass. | Native/runtime accessibility and richer relationship semantics remain open; do not promote beyond the Flutter boundary without that evidence. |
| CANVAS-06 | implemented | E1/E2 | Overlay toolbar, role filter, anchors/labels/bounds controls, and widget semantics tests exist. | Native pointer/accessibility announcement remains E5 unverified. |
| VIEW-01 | implemented | E1/E2 | View command, `WorkbenchViewportController.zoomIn/zoomOut`, toolbar, controller/widget tests. | Native keyboard/trackpad behavior not E5 verified. |
| VIEW-02 | implemented | E1/E2 | `InteractiveViewer` uses viewport `TransformationController`; transform/controller tests pass. | Gesture/trackpad pan on target desktop remains E5 unverified. |
| VIEW-03 | implemented | E1/E2 | `fit`, fit scale transform, toolbar command, transform/widget tests pass. | Real window content/resize fit behavior not E5 verified. |
| VIEW-04 | implemented | E1/E2 | `reset`, View command, toolbar, transform tests and current widget suite pass. | Native runtime interaction not E5 verified. |
| VIEW-05 | implemented at Flutter boundary | E1/E2 | `WorkbenchSelectionController` hit-tests visible resolved bounds; viewport tap, canvas highlight, graph selection, and inspector selection share the selected object id; focused selection tests and the full 307-test suite pass. | Physical pointer/gesture behavior and richer geometric hit-testing remain unverified. |

### 3.4 Layout, theme, preferences, persistence

| ID | Implementation | Evidence | Observed evidence | Gap / verification |
| --- | --- | --- | --- | --- |
| LAYOUT-01 | implemented | E1/E2 | Panel enum/controller, View → Panels check state, close/show behavior, widget/golden tests. | Native menu/window interaction not E5. |
| LAYOUT-02 | implemented | E1/E2 | Recursive dock tree, placement commands, drop preview, dock operations tests. | Native pointer drag/drop not E5 verified. |
| LAYOUT-03 | implemented | E1/E2 | Floating panel bounds, title-bar drag, resize handles, placement commands, shell tests. | Native pointer movement/resize and multi-monitor behavior not E5 verified. |
| LAYOUT-04 | implemented | E1/E2 | Standard/Writing/Preview/Inspect/Minimal profiles in layout profiles and golden/widget tests. | Native restart on current pointer not E5 verified. |
| LAYOUT-05 | implemented | E1/E2 | Reset layout command, Standard fallback, persistence/layout tests. | Corrupt real preference store on host not E5 verified. |
| LAYOUT-06 | implemented | E1/E2 | Versioned schema v2 dock-tree snapshot, debounce/flush, restore tests and widget relaunch simulation. | Actual native process restart on current pointer not E5 verified. |
| LAYOUT-07 | implemented | E1/E2 | `WorkbenchWindowPolicy` defines `1440×900`, `1024×640`, compact breakpoint; narrow golden/overflow tests pass. | Real desktop resize/HiDPI behavior not E5 verified. |
| THEME-01 | implemented | E1/E2 | `ThemeMode.system` is root default when nullable override; widget test covers system follow behavior. | OS brightness change on native runtime not E5 verified. |
| THEME-02 | implemented | E1/E2 | Light/Dark preference enum, app themes, View → Appearance commands, theme tests/goldens. | Native display contrast/runtime not E5 verified. |
| THEME-03 | implemented | E1/E2 | Reset/follow-system command removes override; widget semantics/reset tests pass. | Native OS theme transition not E5 verified. |
| THEME-04 | implemented | E1/E2 | `WorkbenchVisualProfile`, `RelGeoThemeExtension`, canvas palette follows brightness without coupling profile/theme; golden/theme tests pass. | Visual audit on all target hosts not E5 verified. |
| PREF-01 | implemented | E1/E2 | `WorkbenchPreferencesStore` persists theme/profile/overlay/role settings with separate keys; preference tests pass. | SharedPreferences host persistence on current native app not E5 verified. |
| PREF-02 | implemented | E1/E2 | Reset clears preference keys; invalid/missing values fall back to defaults; widget tests pass. | Real corrupted-store recovery not E5 verified. |

### 3.5 Commands, keyboard, accessibility, dan window lifecycle

| ID | Implementation | Evidence | Observed evidence | Gap / verification |
| --- | --- | --- | --- | --- |
| CMD-01 | implemented | E1/E2 | `WorkbenchCommandRegistry` is shared by menu, toolbar, context menu, global `Shortcuts`/`Actions`, and native menu adapter; context/menu tests pass. | Native event parity not E5 verified. |
| CMD-02 | implemented | E1/E2 | File/Edit/View/Document/Workbench/Help menu order and commands are defined; platform menu test passes. | Native macOS/Linux/Windows menu runtime not E5 verified. |
| CMD-03 | partial | E1/E2; native not verified | Main commands have shortcut activators and menu labels; shortcut tests/command source exist. | Exact per-platform modifier policy and full traversal/shortcut smoke remain unverified; no confirmed broken mapping is claimed. |
| A11Y-01 | partial | E1/E2; E5 not verified | `FocusableActionDetector`, Enter/Space activation, divider/resize semantics, focus tests, and widget semantics paths exist. | Full Tab/arrow/Escape traversal on native macOS/Linux/Windows remains unverified. |
| A11Y-02 | partial | E1/E2; E5 not verified | Labels, values, checked states, panel/selector semantics, and semantics tests exist. | VoiceOver/AT announcements and current native AX tree were not captured. |
| A11Y-03 | implemented | E1/E2; E5 not verified | `MediaQuery.disableAnimations` maps to zero motion; `workbench_motion_test.dart` passes. | Native reduced-motion preference and full focus exclusion smoke remain unverified. |
| WINDOW-01 | partial | E1/E2; E5 not verified | `WorkbenchWindowLifecycleHost`, method-channel close, dirty guards, and host tests exist. | Native window-manager close/quit and clean exit on current artifact not verified. |
| WINDOW-02 | implemented | E1/E2; E5 not verified | Window policy/default/minimum sizes, compact mode, and host configuration tests exist. | Actual OS enforcement/resize on each target not verified. |
| WINDOW-03 | implemented at boundary | E1; E5 not verified | Native title bar is the explicit current boundary; no custom chrome implementation is required. | Multi-monitor/HiDPI/native controls still require macOS/Linux/Windows runtime smoke. |

### 3.6 Export dan platform delivery

| ID | Implementation | Evidence | Observed evidence | Gap / verification |
| --- | --- | --- | --- | --- |
| EXPORT-01 | implemented at injected boundary | E1/E2/E3 | `WorkbenchSvgExportController`, `SvgExporter`, File → Export → SVG → Model, controller and semantic SVG tests. | Native destination dialog and actual file write on target OS not E5 verified. |
| EXPORT-02 | implemented at injected boundary | E1/E2 | Model/Sheet View export commands and target selector/widget tests exist. | Native dialog/write and all sheet presentation policies not E5 verified. |
| PLAT-01 | partial | E4 current build; E5 runtime not verified | CI run `41184291670` built current Flutter `60ec760`; v1.0.1 universal macOS archive/checksum is in draft run `41184693233`. | Target macOS launch, native window/keyboard/VoiceOver behavior, and packaged MCP smoke remain unverified. |
| PLAT-02 | partial | E4 current build; E5 runtime not verified | CI run `41184291670` built current Flutter `60ec760`; Linux x64 archive/checksum is in draft run `41184693233`. | No target Linux artifact launch/session smoke; Wayland/X11, picker, input, clean exit, and packaged MCP remain unverified. |
| PLAT-03 | partial | E4 current build; E5 runtime not verified | CI run `41184291670` built current Flutter `60ec760`; Windows x64 archive/checksum is in draft run `41184693233`. | Windows 11 extraction/launch/DLL/SmartScreen/input and packaged MCP smoke remain unverified; signing/installer work is separate. |
| PLAT-04 | partial | E4 current artifact provenance; root integration provenance stale | Draft release manifest/checksums identify current Flutter source, workflow, OS, and architecture. | The root baseline manifest remains captured 2026-10-09; publish and join the release tag to a refreshed integration baseline. |

## 4. Scope classifications outside the active implementation rows

| Boundary | Classification | Evidence/decision | Audit treatment |
| --- | --- | --- | --- |
| Android/iOS delivery and mobile AT | `deferred` | D09 and P10 explicitly defer mobile without date. | Not a missing desktop capability and not a blocker for this audit. |
| Custom title bar | `deferred` | W01/D09 retain native OS title bar. | Native chrome is audited; custom chrome is not an expected implementation. |
| Raw SVG byte equality/full presentation parity | `not applicable` to active 0.5.x semantic contract | P07 and D09 make raw bytes/attribute order/non-required presentation non-goal. | Semantic SVG rows remain partial only where active boundary/evidence is bounded. |
| pub.dev/signed desktop distribution | `not applicable` to current Flutter posture | `publish_to: none`, D09 non-publishable decision. | Build/artifact/provenance is audited; signing/notarization/store is not a defect. |

## 5. Gap map and priority

### P0 — expected user capability absent

| Gap | Affected IDs | Why it matters | Next evidence/owner |
| --- | --- | --- | --- |
| Recovery across forced exit/relaunch remains unverified | DOC-08 | A desktop authoring workbench can lose unsaved work after interruption despite the local best-effort recovery flow. | `relgeo/flutter`: verify retention/consent, recovery store, and forced-exit/relaunch behavior on host. |
| Native selection and accessibility evidence remains incomplete | VIEW-05 | Local hit testing connects canvas, graph, and inspector, but physical pointer/keyboard/AT behavior is not proven on target hosts. | `relgeo/flutter`: add keyboard, empty-canvas, physical pointer, and native semantics smoke. |
| Dependency graph host behavior and richer relationship coverage remain open | CANVAS-05 | The Flutter graph panel is implemented at the UI boundary; native accessibility and richer relationship semantics need evidence. | `relgeo/flutter`: retain graph regressions and add native accessibility/relationship smoke. |

### P1 — implemented boundary but product/evidence remains partial

- Complete diagnostic vocabulary and evaluator/unit promotion: `EDIT-04`,
  `CONTRACT-01`, `CONTRACT-02`, `CANVAS-03`, `CANVAS-04`.
- Native file picker and SVG destination/write behavior: `IO-01`, `EXPORT-01`,
  `EXPORT-02`.
- Native keyboard/menu/window/accessibility smoke: `CMD-03`, `A11Y-01`,
  `A11Y-02`, `WINDOW-01`, `WINDOW-02`, `WINDOW-03`.
- Current pointer desktop builds and target-host runtime: `PLAT-01` through
  `PLAT-04`.

### P2 — contract/documentation hygiene

- Refresh `docs/integration-baseline.json` to the child revision actually being
  claimed, or run canonical CI for the current pointer before promotion.
- Declare the `golden` test tag in `dart_test.yaml` or remove the tag so the
  future current-pointer test run has no undeclared-tag configuration warning; the 2026-10-30 run emitted a non-failing warning.
- Keep historical run `37832260326` and current local evidence separate; do not
  use the historical Flutter `ea8e754` or `b21eceb` result as proof for current `60ec760`.

## 6. Verification handoff

This discovery audit is complete for its declared 2026-10-30 source/test/evidence
boundary. The current delivery checkpoint above reflects later Flutter CI and
release evidence; remaining work is target-host and cross-client verification,
not a claim that the historical source inventory was rerun at `60ec760`. Any follow-up matrix must preserve all 61 expected
IDs and add implementation status, evidence tier, observed behavior, gap,
severity, owner, and next action rather than collapsing them into an aggregate
“Flutter parity” row.

The companion `implementation-audit.md` and the earlier
`flutter-workbench/capability-matrix.md` were inspected as supporting evidence
summaries. Their historical claims are only used here when the revision and
evidence boundary are explicitly named; this document remains the current
ID-by-ID audit and gap map.
