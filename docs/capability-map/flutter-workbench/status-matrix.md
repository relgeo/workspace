# Flutter Workbench — Capability Status Matrix

> **Current-head rebaseline — 2026-11-28.** This matrix is synchronized to
> root `4371c5d` and Flutter root gitlink `c93b043`; the checked-out child
> checkout is `c93b043` and matches the root pointer.
> The 17 formerly `🌗` rows are explicit
> `⏸️` dispositions in the [machine-readable register](../../evidence/rebaseline-disposition-register-2026-11-27.json),
> with implementation status and evidence limitations kept separate.

**Tanggal:** 2026-11-27
**Baseline:** Flutter desktop authoring workbench; RelGeo DSL `0.5.x` boundary

**Expected catalog:** [`expected-capability-catalog.md`](./expected-capability-catalog.md)
**Implementation audit:** [`flutter-workbench/implementation-gap-map.md`](./implementation-gap-map.md)
**Expected-versus-observed join:** [`flutter-workbench/reconciliation.md`](./reconciliation.md)
**Implementation-gap backlog:** [`flutter-workbench/implementation-gap-backlog.md`](./implementation-gap-backlog.md)

## Historical release checkpoint — 2026-10-31

Flutter CI [`41184291670`](https://github.com/relgeo/flutter/actions/runs/41184291670) passed at `60ec760`; release run [`41184693233`](https://github.com/relgeo/flutter/actions/runs/41184693233) produced macOS universal, Linux x64, and Windows x64 bundles/checksums as an unpublished v1.0.1 draft. Runtime launch/MCP smoke, signing, and user installation remain unverified.

## Evidence boundary

| Source | Matrix use |
| --- | --- |
| `flutter@c93b0432e12f5ae11d34212d4da467aceaf8ca34` | Current root gitlink, checked-out child, and capability-audit source pointer. The `flutter@60ec76042b369659e4d048b2a53ea3a66a384de3` release checkpoint above is historical and is not the current root pointer. |
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

Current count: **44 `✔️` · 0 `🌗` · 0 `❌` · 0 `➖` · 17 `⏸️` · 0 `⚠️`**.
Runtime/native evidence yang belum tersedia tetap ditulis pada kolom Evidence;
hal itu tidak otomatis menjadi `❌`.

Final closure audit: [`flutter-final-closure-audit-2026-11-28.json`](../../evidence/flutter-final-closure-audit-2026-11-28.json).
Residual classification: [`flutter-residual-gap-classification-2026-11-28.md`](../../evidence/flutter-residual-gap-classification-2026-11-28.md).

## Disposition checkpoint — 2026-11-27

The canonical disposition is recorded in the [machine-readable register](../../evidence/rebaseline-disposition-register-2026-11-27.json)
and mirrored in the [implementation-gap backlog](./implementation-gap-backlog.md).
The implementation status is unchanged by disposition. The diagnostic and
contract subset now has a current bounded evidence envelope in
[`flutter-diagnostics-contract-parity-2026-11-27.json`](../../evidence/flutter-diagnostics-contract-parity-2026-11-27.json);
the remaining holds are dependency or host boundaries, not untracked gaps.
The selected
rows are `DOC-08`, `IO-01`, `IO-02`, `EDIT-04`, `CONTRACT-01`, `CONTRACT-02`,
`CONTRACT-03`, `CANVAS-03`, `CANVAS-04`, `CMD-03`, `A11Y-01`, `A11Y-02`, and
`WINDOW-01`; each has an owner, source of truth, acceptance target, and initial
status in the backlog.

`CANVAS-05` and `VIEW-05` are implemented at the Flutter boundary and retain
evidence-only host follow-up. `PLAT-01` through `PLAT-04` are target-host or
provenance evidence work, not source implementation blockers. Native picker,
forced relaunch, AT, OS shortcut, window-manager, and unavailable-host results
remain `unverified`; mobile, custom title bar, raw SVG presentation parity,
publishing, signing, and deployment remain explicit scope boundaries.

Acceptance behavior for the selected rows is locked in the [backlog contract
matrix](./implementation-gap-backlog.md#contract-and-acceptance-lock--2026-11-04);
the current matrix symbols are `⏸️` until the named evidence or an explicit
scope decision changes them.

## Current verification overlay — 2026-11-05

The latest local evidence is attached to the existing rows without changing
their status symbols:

| Evidence boundary | Result | Matrix interpretation |
| --- | --- | --- |
| Flutter focused Workbench regression/conformance | **PASS — 135 tests** | Supports local source/test evidence for `DOC-08`, `IO-02`, `EDIT-04`, `CONTRACT-01`, `CANVAS-04`, and the existing UI/consumer rows. Native host evidence remains separate. |
| Core Runtime consumer | **PASS — 489 tests** | Supports the shared diagnostic/contract boundary locally; does not establish public or clean-checkout parity. |
| Geometry consumer | **PASS — 91 tests** | Supports the shared type/geometry boundary locally. |
| MCP contract package | **PASS — 42 tests** | Supports protocol/schema/dispatch package behavior; Flutter desktop HTTP transport is separate. |
| Flutter full suite | **PARTIAL — 326 passed, 1 failed** | Existing HTTP MCP failure at `test/mcp_server_io_test.dart:134`; no focused Workbench regression was observed. |
| Native host, packaged artifact, CI/public | **NOT VERIFIED** | SDK cache write failure and unavailable target hosts prevent launch/picker/AT/install claims. |

Current count remains **44 `✔️` · 0 `🌗` · 0 `❌` · 0 `➖` · 17 `⏸️` ·
0 `⚠️`** after the current-head rebaseline. The implementation/evidence gaps
remain visible as explicit held dispositions with bounded remediation.

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
| [`DOC-08`](./reconciliation.md) | Session/crash recovery | `⏸️` | current recovery/widget tests; forced-exit/native storage unverified | Held environment boundary; atomic recovery payload, legacy migration, corruption cleanup, blocked-storage tolerance, and startup RESTORE/DISCARD are wired | `relgeo/flutter` | document serialization, persistence policy | Crash loses authoring state | Run forced-exit/relaunch smoke and stale/corrupt-draft integration coverage |
| [`DOC-09`](./reconciliation.md) | Document identity/path state | `✔️` | source + local tests | No known source gap | `relgeo/flutter` | file service | Save targets wrong identity | Preserve identity regression cases |
| [`IO-01`](./reconciliation.md) | Native file picker | `⏸️` | current adapter/file-service tests; native runtime unverified | Held environment boundary; filtering, cancellation, failure mapping, normalization, and filesystem writes are covered, while OS open/save dialogs are not proven on target hosts | `relgeo/flutter` | DOC-02..04, platform runners | File workflow unusable in packaged app | Run macOS/Linux/Windows picker smoke |
| [`IO-02`](./reconciliation.md) | RelGeo/YAML import boundary | `⏸️` | current bounded fixture and focused tests; cross-consumer replay not verified | Held only for broader cross-consumer policy; `.relgeo`/`.yaml`/`.yml`, malformed bytes, and unsupported-format diagnostics are bounded | `relgeo/flutter` + `relgeo/core` | CONTRACT-01/02, fixtures | Unsupported input gives misleading preview | Re-run cross-consumer import evidence when dependencies are available |
| [`EDIT-01`](./reconciliation.md) | Text editor surface | `✔️` | source + local widget tests | No known source gap | `relgeo/flutter` | editor package | Editing regressions | Keep editor smoke/golden coverage |
| [`EDIT-02`](./reconciliation.md) | DSL vocabulary and editing | `✔️` | source + local tests | Full vocabulary parity remains contract-scoped | `relgeo/flutter` + `relgeo/spec` | CONTRACT-01 | Authoring drift | Keep vocabulary fixture synchronized |
| [`EDIT-03`](./reconciliation.md) | Compile/preview update | `✔️` | source + local tests | Native runtime path not verified | `relgeo/flutter` | compiler boundary | Stale preview | Add host runtime compile smoke |
| [`EDIT-04`](./reconciliation.md) | User-facing diagnostics | `⏸️` | current diagnostic adapter, structured consumer mapping, fixture, and focused Flutter tests | Held only for cross-consumer/runtime execution; code/path/phase/origin/source revision are explicit | `relgeo/flutter` + `relgeo/spec` + `relgeo/core` | CONTRACT-01, CONTRACT-02 | Users cannot repair input | Re-run cross-consumer replay when dependencies are available |
| [`EDIT-05`](./reconciliation.md) | Invalid input recovery | `✔️` | bounded contract + local tests | Broad invalid corpus remains limited | `relgeo/flutter` | EDIT-04 | Preview becomes unusable | Add representative recovery fixtures |
| [`EDIT-06`](./reconciliation.md) | Undo | `✔️` | source + local tests | No known source gap | `relgeo/flutter` | editor history | Lost edits | Keep history regression test |
| [`EDIT-07`](./reconciliation.md) | Redo | `✔️` | source + local tests | No known source gap | `relgeo/flutter` | editor history | Lost edits | Keep history regression test |
| [`EDIT-08`](./reconciliation.md) | Command state for edit history | `✔️` | source + local tests | Native menu state unverified | `relgeo/flutter` | command registry | Disabled state diverges | Add menu/native state smoke |
| [`CONTRACT-01`](./reconciliation.md) | Active DSL contract alignment | `⏸️` | current contract revision, DTO/bridge behavior, diagnostic fixture, and Flutter focused tests; MCP package replay deferred | Held only for current-pointer cross-consumer execution; provenance and bounded Flutter/MCP contract are joined | `relgeo/spec` + `relgeo/flutter` + `relgeo/core` | shared fixtures, dependency graph | False parity claim | Re-run staged current-pointer conformance |
| [`CONTRACT-02`](./reconciliation.md) | Fixture/import promotion | `⏸️` | current manifest/promotion check and 16-test Flutter fixture conformance | Fixtures 15/16 are active and Flutter-promoted; fixture 24 remains explicit non-Flutter scope | `relgeo/workspace` + `relgeo/flutter` | fixture governance, dependency graph | Candidate treated as active | Keep promotion record synchronized; add broader promotion only by evidence |
| [`CONTRACT-03`](./reconciliation.md) | SVG semantic parity | `⏸️` | current Flutter semantic projection/conformance; TypeScript replay deferred | Held only for current-pointer renderer replay; raw/presentation parity remains excluded | `relgeo/renderer-svg` + `relgeo/flutter` | EXPORT-01/02, fixtures, @relgeo/geometry | Renderers appear equal when they are not | Restore package links and rerun semantic replay |
| [`CANVAS-01`](./reconciliation.md) | Canvas/preview surface | `✔️` | source + local widget tests | Native pointer/resize evidence pending | `relgeo/flutter` | viewport, renderer | Preview unusable at host sizes | Add desktop resize smoke |
| [`CANVAS-02`](./reconciliation.md) | Model/sheet view | `✔️` | source + local tests | No known source gap | `relgeo/flutter` | renderer, document model | Wrong active view | Keep view-switch regression |
| [`CANVAS-03`](./reconciliation.md) | Inspector surface | `⏸️` | current bounded source + managed-local tests; host evidence held | Bounded inspector/selection surface is implemented; exhaustive field inventory and native AT remain separate | `relgeo/flutter` | CANVAS-02, EDIT-02 | Users cannot inspect/edit all fields | Inventory expected inspector fields and add fixtures |
| [`CANVAS-04`](./reconciliation.md) | Parameters/values inspection | `⏸️` | current bounded source + managed-local tests; cross-consumer evidence held | Bounded parameter/profile editing is implemented; full evaluator parity remains separate | `relgeo/flutter` + `relgeo/core` | CONTRACT-01, CANVAS-03 | Values differ from compile result | Add parameter/profile conformance cases |
| [`CANVAS-05`](./reconciliation.md) | User-facing graph | `✔️` | graph model/panel + focused local tests; native AT/runtime unverified | Resolved-scene dependency graph is available through View → Panels → Dependency graph; richer relationship semantics and host accessibility remain | `relgeo/flutter` | graph projection, layout, selection | Users cannot understand dependencies | Keep graph identity/semantics tests; add native accessibility smoke when a host is available |
| [`CANVAS-06`](./reconciliation.md) | Canvas overlays/roles | `✔️` | source + local tests; native AT unverified | Native semantics and pointer evidence pending | `relgeo/flutter` | CANVAS-01, A11Y-02 | Overlay state unclear | Add overlay semantics/desktop smoke |
| [`VIEW-01`](./reconciliation.md) | Zoom | `✔️` | source + local tests | Native gesture evidence pending | `relgeo/flutter` | viewport controller | Content inaccessible at scale | Add trackpad/mouse smoke |
| [`VIEW-02`](./reconciliation.md) | Pan | `✔️` | source + local tests; gesture runtime unverified | Host gesture evidence pending | `relgeo/flutter` | viewport controller | Navigation fails on desktop | Add pan gesture smoke |
| [`VIEW-03`](./reconciliation.md) | Fit viewport | `✔️` | source + local tests | No known source gap | `relgeo/flutter` | canvas bounds | Content clipped | Keep bounds regression |
| [`VIEW-04`](./reconciliation.md) | Reset viewport | `✔️` | source + local tests | Native shortcut/menu trigger unverified | `relgeo/flutter` | command registry | User cannot recover view | Add reset command smoke |
| [`VIEW-05`](./reconciliation.md) | Object selection/hit-testing | `✔️` | selection controller, viewport/canvas/inspector wiring + focused local tests; physical pointer unverified | Visible-object bounds hit-testing and shared selected-object state are implemented; richer geometric and physical pointer behavior remain | `relgeo/flutter` | canvas scene graph, viewport | Inspector/commands cannot target objects | Add keyboard-selection and physical pointer smoke coverage |
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
| [`CMD-03`](./reconciliation.md) | Keyboard shortcuts | `⏸️` | current bounded source + managed-local tests; native shortcut unverified | Registry conflict, menu parity, and Command/Control platform mapping are covered; native delivery remains held | `relgeo/flutter` | CMD-01/02, platform runners | Commands inaccessible or conflicting | Publish native shortcut delivery transcript |
| [`A11Y-01`](./reconciliation.md) | Keyboard focus/traversal | `⏸️` | current Flutter focus/activation source + managed-local tests; native AT unverified | Flutter focus/activation/keyboard resize is covered; full native traversal is not proven | `relgeo/flutter` | CMD-03, responsive layout | Keyboard-only users blocked | Run keyboard traversal script on desktop |
| [`A11Y-02`](./reconciliation.md) | Semantics labels/states | `⏸️` | current Flutter semantics source + managed-local tests; native AT unverified | Canvas/control semantics are covered; VoiceOver/screen-reader tree is not proven | `relgeo/flutter` | CANVAS-03, CMD-02 | AT users miss role/state | Capture native accessibility review |
| [`A11Y-03`](./reconciliation.md) | Reduced motion/focus | `✔️` | source + local tests; OS preference unverified | OS preference propagation pending | `relgeo/flutter` | theme/accessibility policy | Motion discomfort/focus loss | Add OS preference smoke |
| [`WINDOW-01`](./reconciliation.md) | Window lifecycle | `⏸️` | current adapter/dirty-guard source + managed-local tests; native lifecycle unverified | Flutter adapter boundary is covered; close/quit event integration is not proven | `relgeo/flutter` | DOC-06/07, native host | Quit loses state or crashes | Run native close/quit transcript |
| [`WINDOW-02`](./reconciliation.md) | Window size/resize policy | `✔️` | source + local tests; OS enforcement unverified | Host minimum-size enforcement pending | `relgeo/flutter` | LAYOUT-07 | Controls clip below minimum | Verify host min-size behavior |
| [`WINDOW-03`](./reconciliation.md) | Native title bar/controls | `✔️` | source boundary; native runtime unverified | Custom chrome is deferred; native behavior needs smoke | `relgeo/flutter` | platform runners | Window controls inconsistent | Keep native title-bar decision and smoke |
| [`EXPORT-01`](./reconciliation.md) | Export SVG model | `✔️` | source + local tests; native write unverified | Packaged destination write pending | `relgeo/flutter` | CONTRACT-03, IO-01 | Export appears successful but file missing | Add native export smoke |
| [`EXPORT-02`](./reconciliation.md) | Export SVG sheet/view | `✔️` | source + local tests; native write unverified | Active-target host write proof pending | `relgeo/flutter` | CANVAS-02, IO-01 | Wrong view exported | Add model/sheet destination smoke |
| [`PLAT-01`](./reconciliation.md) | macOS delivery | `⏸️` | Historical draft archive/checksum is structurally verified; current macOS build stopped at the managed Flutter SDK cache boundary; target launch not verified | Held target-host/toolchain boundary; macOS launch and MCP client smoke not verified | `relgeo/flutter` + CI | macOS host/runtime | Build success may be mistaken for app usability | Restore SDK cache, build a current artifact, then launch and exercise MCP read/write modes |
| [`PLAT-02`](./reconciliation.md) | Ubuntu/Linux delivery | `⏸️` | Historical draft archive/checksum is structurally verified; no current Linux build or target host is available | Held target-host/toolchain boundary; Wayland/X11 launch and native picker unverified | `relgeo/flutter` + CI | Ubuntu/Linux host/runtime | Build success may be mistaken for app usability | Build/extract and smoke on target Ubuntu/Linux sessions |
| [`PLAT-03`](./reconciliation.md) | Windows 11 delivery | `⏸️` | Historical draft archive/checksum is structurally verified; no current Windows build or target host is available | Held target-host/toolchain boundary; extraction/launch, DLL, and MCP smoke unverified | `relgeo/flutter` + CI | Windows 11 host/runtime | Build success may be mistaken for app usability | Build/extract and launch on Windows 11; check dependencies and MCP connection |
| [`PLAT-04`](./reconciliation.md) | Reproducible artifact provenance | `⏸️` | [`flutter-platform-provenance-2026-11-28.json`](../../evidence/flutter-platform-provenance-2026-11-28.json) joins current root/child tuple `c93b043`, bundled spec revision/digest, and release-manifest fields; artifact/runtime proof is not verified | Held provenance/runtime boundary; current integration baseline is joinable, but current artifact evidence is pending | `relgeo/workspace` + CI | PLAT-01..03, baseline manifest | Cannot promote workflow source or historical archives as current artifact baseline | Produce current artifacts with release manifest/checksum and target runtime evidence |

## Coverage and handoff

The matrix contains exactly the 61 capability IDs in the expected catalog. The
five `SCOPE-*` rows in the catalog are scope decisions, not capabilities, and
are therefore reported in the reconciliation scope findings rather than as
additional matrix rows.

The 17 rows marked `⏸️` are all represented in the
[implementation-gap backlog](./implementation-gap-backlog.md).
The backlog and disposition register are explicit holds only: they do not
promote partial implementation, native runtime, or deployment claims.
