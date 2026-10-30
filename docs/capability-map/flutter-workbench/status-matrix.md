# Flutter Workbench — Capability Status Matrix

**Tanggal:** 2026-10-30  
**Baseline:** Flutter desktop authoring workbench; RelGeo DSL `0.5.x` boundary

**Expected catalog:** [`12-flutter-workbench-capability-baseline.md`](../../plans/12-flutter-workbench-capability-baseline.md)  
**Implementation audit:** [`flutter-workbench/implementation-gap-map.md`](./implementation-gap-map.md)  
**Expected-versus-observed join:** [`flutter-workbench/reconciliation.md`](./reconciliation.md)  
**Implementation-gap backlog:** [`flutter-workbench/implementation-gap-backlog.md`](./implementation-gap-backlog.md)

## Evidence boundary

| Source | Matrix use |
| --- | --- |
| `flutter@b21eceb258070133f32fd822b6fd23a4f21b0bbf` | Implementation owner boundary and source/test/platform evidence summarized by each capability row. |
| [`docs/MATURATION-MASTER-PLAN.md`](../../MATURATION-MASTER-PLAN.md) | Roadmap, compatibility, desktop delivery, and evidence provenance context. |
| [`docs/REPOSITORY-MAP.md`](../../REPOSITORY-MAP.md) | Ownership and Flutter workbench surface boundary. |
| [`docs/capability-map/INVENTORY-PROTOCOL.md`](../INVENTORY-PROTOCOL.md) and related capability-map artifacts | Capability-first row rules, evidence separation, scope handling, and coverage expectations. |

Each row is one expected capability, not a source module or aggregate feature
bucket. `Status` is the implementation/scope result; `Evidence` states the
verification strength and limitations. `Gap`, `Owner`, `Dependency`, `Risk`,
and `Next action` are intentionally separate so a missing implementation is
actionable without treating unavailable runtime evidence as proof of absence.

## Cara membaca

Matrix ini adalah reporting view capability-first. Ia tidak menggantikan
expected catalog atau source code, dan dokumentasi gap tidak dihitung sebagai
implementasi. `Status`, `Evidence`, dan `Scope` adalah dimensi yang berbeda.

| Status | Makna |
| --- | --- |
| `✔️` | Capability implemented pada boundary yang diaudit. |
| `🌗` | Partial: source, contract, coverage, parity, atau runtime evidence belum lengkap. |
| `❌` | Capability expected tetapi tidak ditemukan pada implementation user-facing. |
| `➖` | Not applicable terhadap scope yang diputuskan; tidak dipakai untuk evidence yang belum diverifikasi. |
| `⏸️` | Sengaja deferred/ditahan oleh keputusan scope atau promotion. |
| `⚠️` | Broken/mismatch terkonfirmasi pada boundary yang diaudit. |

Current count: **42 `✔️` · 16 `🌗` · 3 `❌` · 0 `➖` · 0 `⏸️` · 0 `⚠️`**.
Runtime/native evidence yang belum tersedia tetap ditulis pada kolom Evidence;
hal itu tidak otomatis menjadi `❌`.

## Matrix

| ID | Capability | Status | Evidence | Gap | Owner | Dependency | Risk | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [`DOC-01`](./reconciliation.md) | New document | `✔️` | source + local tests | No known source gap; native smoke remains separate | `relgeo/flutter` | document session | New flow regresses | Keep command/session regression test |
| [`DOC-02`](./reconciliation.md) | Open document | `✔️` | source + local tests; native picker unverified | Host picker execution not verified | `relgeo/flutter` | file service | Files fail only on host | Run native open smoke |
| [`DOC-03`](./reconciliation.md) | Save document | `✔️` | source + local tests; native write unverified | Host write evidence pending | `relgeo/flutter` | document session, file service | Data loss on host | Add native save evidence |
| [`DOC-04`](./reconciliation.md) | Save As | `✔️` | source + local tests; native write unverified | Destination dialog evidence pending | `relgeo/flutter` | file service | Wrong destination/overwrite | Add save-as host smoke |
| [`DOC-05`](./reconciliation.md) | Recent documents | `✔️` | source + local tests | No known source gap | `relgeo/flutter` | preferences | Stale recent entry | Keep bounded persistence test |
| [`DOC-06`](./reconciliation.md) | Dirty state and close guard | `✔️` | source + local tests | Native close event not verified | `relgeo/flutter` | window lifecycle | Unsaved work lost | Exercise native close guard |
| [`DOC-07`](./reconciliation.md) | Recovery decision on close | `✔️` | source + local tests; host lifecycle unverified | Native prompt/quit evidence pending | `relgeo/flutter` | DOC-06, WINDOW-01 | Quit path diverges | Add native quit transcript |
| [`DOC-08`](./reconciliation.md) | Session/crash recovery | `❌` | source negative evidence | No document recovery store/autosave/session restore | `relgeo/flutter` | document serialization, persistence policy | Crash loses authoring state | Define recovery model, then implement and test restore/crash boundary |
| [`DOC-09`](./reconciliation.md) | Document identity/path state | `✔️` | source + local tests | No known source gap | `relgeo/flutter` | file service | Save targets wrong identity | Preserve identity regression cases |
| [`IO-01`](./reconciliation.md) | Native file picker | `🌗` | adapter source + local tests; native runtime unverified | OS open/save dialogs not proven on target desktop hosts | `relgeo/flutter` | DOC-02..04, platform runners | File workflow unusable in packaged app | Run macOS/Linux/Windows picker smoke |
| [`IO-02`](./reconciliation.md) | RelGeo/YAML import boundary | `🌗` | bounded contract + source | Import vocabulary/invalid-boundary coverage is bounded | `relgeo/flutter` + `relgeo/core` | CONTRACT-01/02, fixtures | Unsupported input gives misleading preview | Expand active import fixtures and diagnostic assertions |
| [`EDIT-01`](./reconciliation.md) | Text editor surface | `✔️` | source + local widget tests | No known source gap | `relgeo/flutter` | editor package | Editing regressions | Keep editor smoke/golden coverage |
| [`EDIT-02`](./reconciliation.md) | DSL vocabulary and editing | `✔️` | source + local tests | Full vocabulary parity remains contract-scoped | `relgeo/flutter` + `relgeo/spec` | CONTRACT-01 | Authoring drift | Keep vocabulary fixture synchronized |
| [`EDIT-03`](./reconciliation.md) | Compile/preview update | `✔️` | source + local tests | Native runtime path not verified | `relgeo/flutter` | compiler boundary | Stale preview | Add host runtime compile smoke |
| [`EDIT-04`](./reconciliation.md) | User-facing diagnostics | `🌗` | bounded diagnostics + local tests | Diagnostic vocabulary and presentation are not full-parity | `relgeo/flutter` + `relgeo/core` | CONTRACT-01, CONTRACT-02 | Users cannot repair input | Define code/path/phase fixture coverage |
| [`EDIT-05`](./reconciliation.md) | Invalid input recovery | `✔️` | bounded contract + local tests | Broad invalid corpus remains limited | `relgeo/flutter` | EDIT-04 | Preview becomes unusable | Add representative recovery fixtures |
| [`EDIT-06`](./reconciliation.md) | Undo | `✔️` | source + local tests | No known source gap | `relgeo/flutter` | editor history | Lost edits | Keep history regression test |
| [`EDIT-07`](./reconciliation.md) | Redo | `✔️` | source + local tests | No known source gap | `relgeo/flutter` | editor history | Lost edits | Keep history regression test |
| [`EDIT-08`](./reconciliation.md) | Command state for edit history | `✔️` | source + local tests | Native menu state unverified | `relgeo/flutter` | command registry | Disabled state diverges | Add menu/native state smoke |
| [`CONTRACT-01`](./reconciliation.md) | Active DSL contract alignment | `🌗` | bounded contract; historical cross-consumer evidence | Current Flutter pointer and full active vocabulary are not jointly proven | `relgeo/spec` + `relgeo/flutter` | shared fixtures, CI | False parity claim | Re-run current-pointer cross-consumer conformance |
| [`CONTRACT-02`](./reconciliation.md) | Fixture/import promotion | `🌗` | bounded contract; historical CI | Promoted fixture boundary does not cover all expected operations | `relgeo/workspace` + `relgeo/flutter` | fixture governance, CI | Candidate treated as active | Define promotion gate and active fixture set |
| [`CONTRACT-03`](./reconciliation.md) | SVG semantic parity | `🌗` | bounded semantic contract; historical CI | Semantic core is bounded; raw/presentation parity is outside current proof | `relgeo/renderer-svg` + `relgeo/flutter` | EXPORT-01/02, fixtures | Renderers appear equal when they are not | Expand semantic comparator and state presentation exclusions |
| [`CANVAS-01`](./reconciliation.md) | Canvas/preview surface | `✔️` | source + local widget tests | Native pointer/resize evidence pending | `relgeo/flutter` | viewport, renderer | Preview unusable at host sizes | Add desktop resize smoke |
| [`CANVAS-02`](./reconciliation.md) | Model/sheet view | `✔️` | source + local tests | No known source gap | `relgeo/flutter` | renderer, document model | Wrong active view | Keep view-switch regression |
| [`CANVAS-03`](./reconciliation.md) | Inspector surface | `🌗` | source + local tests | Inspector coverage/surface parity incomplete | `relgeo/flutter` | CANVAS-02, EDIT-02 | Users cannot inspect/edit all fields | Inventory expected inspector fields and add fixtures |
| [`CANVAS-04`](./reconciliation.md) | Parameters/values inspection | `🌗` | source + local tests | Parameter policy is bounded; full value/profile parity pending | `relgeo/flutter` + `relgeo/core` | CONTRACT-01, CANVAS-03 | Values differ from compile result | Add parameter/profile conformance cases |
| [`CANVAS-05`](./reconciliation.md) | User-facing graph | `❌` | source negative evidence | Core graph exists, but no user-facing graph panel/widget/command | `relgeo/flutter` | graph projection, layout, selection | Users cannot understand dependencies | Define graph UX contract and implement panel/command tests |
| [`CANVAS-06`](./reconciliation.md) | Canvas overlays/roles | `✔️` | source + local tests; native AT unverified | Native semantics and pointer evidence pending | `relgeo/flutter` | CANVAS-01, A11Y-02 | Overlay state unclear | Add overlay semantics/desktop smoke |
| [`VIEW-01`](./reconciliation.md) | Zoom | `✔️` | source + local tests | Native gesture evidence pending | `relgeo/flutter` | viewport controller | Content inaccessible at scale | Add trackpad/mouse smoke |
| [`VIEW-02`](./reconciliation.md) | Pan | `✔️` | source + local tests; gesture runtime unverified | Host gesture evidence pending | `relgeo/flutter` | viewport controller | Navigation fails on desktop | Add pan gesture smoke |
| [`VIEW-03`](./reconciliation.md) | Fit viewport | `✔️` | source + local tests | No known source gap | `relgeo/flutter` | canvas bounds | Content clipped | Keep bounds regression |
| [`VIEW-04`](./reconciliation.md) | Reset viewport | `✔️` | source + local tests | Native shortcut/menu trigger unverified | `relgeo/flutter` | command registry | User cannot recover view | Add reset command smoke |
| [`VIEW-05`](./reconciliation.md) | Object selection/hit-testing | `❌` | source/test negative evidence | No object selection model or hit-test controller | `relgeo/flutter` | canvas scene graph, viewport | Inspector/commands cannot target objects | Define selection contract and implement hit-test/keyboard tests |
| [`LAYOUT-01`](./reconciliation.md) | Panel lifecycle | `✔️` | source + local tests | Native resize/focus evidence pending | `relgeo/flutter` | responsive layout | Panels disappear or trap focus | Add resize/focus smoke |
| [`LAYOUT-02`](./reconciliation.md) | Docking/resizable layout | `✔️` | source + local tests; native pointer unverified | Host pointer behavior pending | `relgeo/flutter` | panel lifecycle | Layout unusable on host | Add pointer resize smoke |
| [`LAYOUT-03`](./reconciliation.md) | Floating panels | `✔️` | source + local tests; native pointer unverified | Host drag/resize evidence pending | `relgeo/flutter` | LAYOUT-02 | Context hidden | Add floating-panel smoke |
| [`LAYOUT-04`](./reconciliation.md) | Layout profiles | `✔️` | source + local tests | No known source gap | `relgeo/flutter` | preferences | Profile state drifts | Keep profile persistence tests |
| [`LAYOUT-05`](./reconciliation.md) | Layout reset/fallback | `✔️` | source + local tests | No known source gap | `relgeo/flutter` | LAYOUT-04 | Corrupt prefs block launch | Keep reset/fallback regression |
| [`LAYOUT-06`](./reconciliation.md) | Layout persistence | `✔️` | source + local tests; native restart unverified | Restart persistence needs host proof | `relgeo/flutter` | shared preferences | Repeated setup cost | Add packaged restart smoke |
| [`LAYOUT-07`](./reconciliation.md) | Responsive layout | `✔️` | source + local tests; native resize unverified | Real window-size coverage pending | `relgeo/flutter` | LAYOUT-01/02 | Small windows clip controls | Add min/default/large resize matrix |
| [`THEME-01`](./reconciliation.md) | System theme | `✔️` | source + local tests; OS transition unverified | Live OS transition pending | `relgeo/flutter` | preferences | Theme does not follow OS | Add OS theme transition smoke |
| [`THEME-02`](./reconciliation.md) | Light theme | `✔️` | source + local tests | No known source gap | `relgeo/flutter` | theme tokens | Contrast regression | Keep theme widget checks |
| [`THEME-03`](./reconciliation.md) | Dark theme | `✔️` | source + local tests | No known source gap | `relgeo/flutter` | theme tokens | Contrast regression | Keep theme widget checks |
| [`THEME-04`](./reconciliation.md) | Theme preference/reset | `✔️` | source + local tests | Host persistence unverified | `relgeo/flutter` | PREF-01/02 | Preference silently resets | Add restart persistence smoke |
| [`PREF-01`](./reconciliation.md) | Preferences storage | `✔️` | source + local tests; host persistence unverified | Packaged storage path pending | `relgeo/flutter` | shared preferences | Settings lost/corrupt | Verify host storage path |
| [`PREF-02`](./reconciliation.md) | Preferences reset/defaults | `✔️` | source + local tests | No known source gap | `relgeo/flutter` | PREF-01 | Bad preference blocks usable defaults | Keep reset regression |
| [`CMD-01`](./reconciliation.md) | Shared command registry | `✔️` | source + local tests; native event unverified | Host event dispatch pending | `relgeo/flutter` | document/editor/viewport controllers | Surfaces invoke different behavior | Add end-to-end command dispatch smoke |
| [`CMD-02`](./reconciliation.md) | Menu/command navigation | `✔️` | source + local tests; native menu unverified | Native menu rendering/action proof pending | `relgeo/flutter` | CMD-01 | Users cannot discover operations | Add native menu smoke |
| [`CMD-03`](./reconciliation.md) | Keyboard shortcuts | `🌗` | source + local tests; native shortcut unverified | Per-OS shortcut map and conflict proof incomplete | `relgeo/flutter` | CMD-01/02, platform runners | Commands inaccessible or conflicting | Publish shortcut matrix and run per-OS smoke |
| [`A11Y-01`](./reconciliation.md) | Keyboard focus/traversal | `🌗` | Flutter focus/activation source + local tests; native AT unverified | Full native traversal not proven | `relgeo/flutter` | CMD-03, responsive layout | Keyboard-only users blocked | Run keyboard traversal script on desktop |
| [`A11Y-02`](./reconciliation.md) | Semantics labels/states | `🌗` | Flutter semantics source + local tests; native AT unverified | VoiceOver/screen-reader tree not proven | `relgeo/flutter` | CANVAS-03, CMD-02 | AT users miss role/state | Capture native accessibility review |
| [`A11Y-03`](./reconciliation.md) | Reduced motion/focus | `✔️` | source + local tests; OS preference unverified | OS preference propagation pending | `relgeo/flutter` | theme/accessibility policy | Motion discomfort/focus loss | Add OS preference smoke |
| [`WINDOW-01`](./reconciliation.md) | Window lifecycle | `🌗` | bridge/policy source + local tests; native lifecycle unverified | Close/quit event integration not proven | `relgeo/flutter` | DOC-06/07, native host | Quit loses state or crashes | Run native close/quit transcript |
| [`WINDOW-02`](./reconciliation.md) | Window size/resize policy | `✔️` | source + local tests; OS enforcement unverified | Host minimum-size enforcement pending | `relgeo/flutter` | LAYOUT-07 | Controls clip below minimum | Verify host min-size behavior |
| [`WINDOW-03`](./reconciliation.md) | Native title bar/controls | `✔️` | source boundary; native runtime unverified | Custom chrome is deferred; native behavior needs smoke | `relgeo/flutter` | platform runners | Window controls inconsistent | Keep native title-bar decision and smoke |
| [`EXPORT-01`](./reconciliation.md) | Export SVG model | `✔️` | source + local tests; native write unverified | Packaged destination write pending | `relgeo/flutter` | CONTRACT-03, IO-01 | Export appears successful but file missing | Add native export smoke |
| [`EXPORT-02`](./reconciliation.md) | Export SVG sheet/view | `✔️` | source + local tests; native write unverified | Active-target host write proof pending | `relgeo/flutter` | CANVAS-02, IO-01 | Wrong view exported | Add model/sheet destination smoke |
| [`PLAT-01`](./reconciliation.md) | macOS delivery | `🌗` | historical CI/source; current build/runtime not verified | Current-pointer build and runtime evidence stale/unavailable | `relgeo/flutter` + CI | current checkout, macOS runner | Release claim based on stale artifact | Run current macOS arm64/universal build and launch smoke |
| [`PLAT-02`](./reconciliation.md) | Ubuntu/Linux delivery | `🌗` | historical CI/source; runtime not verified | Target Wayland/X11 session evidence missing | `relgeo/flutter` + CI | Linux runner, native picker | Linux package unusable | Build and run on target Linux sessions |
| [`PLAT-03`](./reconciliation.md) | Windows 11 delivery | `🌗` | historical CI/source; runtime not verified | Current Windows artifact/launch evidence missing | `relgeo/flutter` + CI | Windows runner, native picker | Windows package fails to launch | Build ZIP and run Windows 11 smoke |
| [`PLAT-04`](./reconciliation.md) | Reproducible artifact provenance | `🌗` | source + historical evidence; pointer mismatch | Current workspace/Flutter/SDK provenance not refreshed | `relgeo/workspace` + CI | PLAT-01..03, release evidence | Cannot trust artifact identity | Generate current provenance report and attach artifacts |

## Coverage and handoff

The matrix contains exactly the 61 capability IDs in the expected catalog. The
five `SCOPE-*` rows in the catalog are scope decisions, not capabilities, and
are therefore reported in the reconciliation scope findings rather than as
additional matrix rows.

The 19 rows marked `❌` or `🌗` are all represented in the
[implementation-gap backlog](./implementation-gap-backlog.md).
The backlog is a candidate plan only: it does not close, promote, or otherwise
change any implementation status in this matrix.
