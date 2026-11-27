# Flutter Workbench — Expected-versus-Observed Reconciliation

> **Current-head rebaseline — 2026-11-27.** The canonical one-row-per-ID
> disposition is [`../../evidence/rebaseline-disposition-register-2026-11-27.json`](../../evidence/rebaseline-disposition-register-2026-11-27.json).
> It joins the 61 expected IDs to current root `707843a` and Flutter `20253e8`,
> while retaining implementation status separately from evidence and disposition.
> The former 17 `🌗` rows are now explicit `⏸️` holds with owner, remediation,
> dependency, revision, evidence locator, and claim limit; this is not a claim
> that native/runtime or cross-consumer work passed.

> **Coverage statement — 2026-11-27.** Dokumen ini adalah join satu-per-satu
> antara seluruh 61 ID pada [expected capability catalog](./expected-capability-catalog.md)
> dan baris observed pada [Flutter implementation audit](./implementation-gap-map.md).
> Ia tidak menambah capability, tidak menghapus expected row, dan tidak
> mengubah capability absent menjadi `➖` hanya karena evidence runtime belum
> tersedia.

**Expected catalog:** [`expected-capability-catalog.md`](./expected-capability-catalog.md)
**Implementation audit:** [`flutter-workbench/implementation-gap-map.md`](./implementation-gap-map.md)  
**Status matrix:** [`flutter-workbench/status-matrix.md`](./status-matrix.md)  
**Gap backlog:** [`flutter-workbench/implementation-gap-backlog.md`](./implementation-gap-backlog.md)

## Evidence boundary

| Evidence source | Role in this reconciliation |
| --- | --- |
| `workspace@707843aae50608d48fb0d6ff0fc8780cc961b891` | Current root `HEAD`, captured from the clean root checkout. |
| `flutter@52e5bd2385b019cc3b29e453b6e85ef697bdd62d` | Current Flutter gitlink and child `HEAD`; source audit boundary for this rebaseline. |
| `spec@26ff53278d77d916b0e0e6c26ca9ab496232fbc0`, `mcp@109bd599fc5b4881f3a3ada128da7e9d548ab936` | Current normative spec snapshot and pure-Dart host contract inputs. |
| [`docs/MATURATION-MASTER-PLAN.md`](../../MATURATION-MASTER-PLAN.md) | Roadmap, active desktop/platform gates, compatibility line, and historical-versus-current evidence rules. |
| [`docs/REPOSITORY-MAP.md`](../../REPOSITORY-MAP.md) | Repository ownership and Flutter surface boundary. |
| [`docs/capability-map/INVENTORY-PROTOCOL.md`](../INVENTORY-PROTOCOL.md) and the capability-map artifacts | Discovery categories, status/evidence separation, expected-but-missing rule, and one-to-one coverage checks. |
| [Flutter implementation audit](./implementation-gap-map.md) | Observed source/test/UI/platform/runtime findings used by each audit trace below; unavailable host evidence remains qualified rather than promoted to implementation status. |

The reconciliation result is assigned exactly once per expected capability. It
is intentionally independent from the evidence qualifier: `✔️`/`🌗`/`❌`/
`➖`/`⏸️`/`⚠️` describes the implementation or scope outcome, while the
Evidence status column describes how that outcome was verified.

## Frozen contract and provenance boundary

The six delivery gaps are now bounded by the contract in the [implementation
gap backlog](./implementation-gap-backlog.md#frozen-authoring-contract--2026-11-03).
The join remains unchanged in meaning: freezing behavior does not close a gap
and does not upgrade evidence.

| Evidence class | May establish | Must not be inferred |
| --- | --- | --- |
| Flutter unit/widget/contract tests | Session dirty transitions, New/Open/Save/Save As callback behavior, picker cancellation, recovery-store semantics, bounded import diagnostic codes, and host-neutral command/selection/window contracts. | Native dialog rendering, permissions, process crash/relaunch, physical pointer, OS shortcuts, VoiceOver/NVDA, or window-manager events. |
| Core/renderer/fixture tests | Shared fixture and semantic diagnostic observations for the active contract. | Full Flutter evaluator/presentation parity or current-pointer parity unless the exact consumer run is attached. |
| Local macOS artifact/build notes | Machine/toolchain and binary architecture observations. | Ubuntu/Windows launch/install, signed distribution, or target-host smoke. |
| CI/release artifact metadata | Source/workflow/platform/checksum provenance. | Successful end-user installation, native picker/export, MCP packaged smoke, or notarization. |

The active Flutter import adapter intentionally emits only
`relgeo.yaml.parse` and `relgeo.compile` in the bounded MCP diagnostic shape.
Source path/phase/object parity remains part of `EDIT-04`/`CONTRACT-02` and is
not synthesized from exception strings.

## Current disposition checkpoint — 2026-11-27

The current disposition register records `DOC-08`, `IO-01`, `IO-02`, `EDIT-04`,
`CONTRACT-01`, `CONTRACT-02`, `CONTRACT-03`, `CANVAS-03`, `CANVAS-04`,
`CMD-03`, `A11Y-01`, `A11Y-02`, `WINDOW-01`, and `PLAT-01..04` as `⏸️`.
Their implementation status remains `partial` where source/contract work is
bounded, but the stale `🌗` symbol is no longer used as an actionable queue.

`CANVAS-05` and `VIEW-05` are `implemented at Flutter boundary` with host
evidence still open. `PLAT-01`–`PLAT-04` are evidence-only target-host or
provenance follow-up. This split prevents missing macOS/Linux/Windows,
forced-exit, native picker, OS shortcut, VoiceOver/NVDA, or window-manager
evidence from being misreported as either a source defect or a completed claim.
Deferred/not-applicable scope remains separate: mobile, custom title bar, raw
SVG presentation parity, publication, signing, and deployment.

The detailed success, failure/edge, and evidence contract for these rows is
locked in the [backlog acceptance matrix](./implementation-gap-backlog.md#contract-and-acceptance-lock--2026-11-04).
It is a documentation boundary only; no public contract change or compatibility
line promotion is implied.

## Current target evidence handoff — 2026-11-03

Current root/submodule pointers are `2ff198d` and `flutter@60ec760`. Local
Flutter evidence is `flutter analyze --no-pub` passing, the complete Flutter
suite passing with 324 tests, and the focused shared fixture/invalid-boundary/
SVG contract suite passing with 45 tests. Fixture staging copied 23 canonical
fixtures successfully. Core and renderer evidence is recorded separately and
does not promote unsupported evaluator or presentation parity.

The conformance runner was invoked, but its managed SDK probe/bootstrap was
blocked when Flutter attempted to write `flutter/bin/cache/engine.stamp`.
Likewise, the available macOS debug build could not start for that same cache
permission. These are `not verified` environment observations. No Linux,
Windows, native picker, physical pointer, OS shortcut, VoiceOver/NVDA, or
window-manager smoke is claimed. The missing host evidence does not downgrade
the passing Flutter source/test result or turn unsupported parity into an
implementation failure.

## Current consumer-boundary refresh — 2026-11-05

The local current checkout (`workspace@f42eeaf`, `flutter@9816b477`,
`core@3d9112d`, `geometry@395019d`, `mcp@670121e`) was checked at the direct
consumer boundaries affected by the implementation tranche:

| Consumer boundary | Result | Evidence class / limitation |
| --- | --- | --- |
| Flutter Workbench focused regression/conformance | **PASS — 135 tests** | Local source/widget/fixture evidence; includes current v0.5 semantic projection and invalid-boundary cases. |
| Core Runtime package | **PASS — 489 tests** | Local downstream package evidence; no public-package or fresh-clone claim. |
| Geometry package | **PASS — 91 tests** | Local shared-type/geometry consumer evidence. |
| MCP contract package | **PASS — 42 tests** | Local protocol/schema/dispatch evidence; the Flutter HTTP transport remains a separate integration test. |
| Flutter full suite | **PARTIAL — 326 passed, 1 failed** | Existing `test/mcp_server_io_test.dart:134` cast failure; targeted Workbench tests remain green. |
| Native host/runtime, packaged artifacts, CI/public | **NOT VERIFIED** | Managed Flutter SDK cache write boundary blocked `flutter devices`; historical CI/public records remain scoped to their recorded revisions. |

This refresh verifies that the selected source changes did not regress the
available Core, Geometry, MCP-contract, or focused Flutter consumers. It does
not promote the `EDIT-04`/`CONTRACT-01` rows to full parity, and it does not
convert the isolated HTTP MCP failure or unavailable host into a claim about
the unrelated downstream consumers.

## Aturan rekonsiliasi

Empat dimensi berikut sengaja dipisahkan:

| Dimensi | Nilai | Arti |
| --- | --- | --- |
| Reconciliation result | `✔️`, `🌗`, `❌`, `⚠️`, `⏸️`, `➖` | Hasil join ringkas yang dapat dipindai. |
| Implementation status | `implemented`, `partial`, `absent`, `broken`, `deferred`, `not applicable` | Keberadaan capability pada boundary source yang diaudit. |
| Evidence status | `verified-local`, `source-plus-local`, `bounded-contract`, `historical-only`, `not verified` | Kekuatan dan freshness pemeriksaan; bukan status implementation. |
| Scope / owner decision | `in scope`, `boundary-only`, `deferred`, `not applicable` | Apakah capability memang dimiliki boundary Flutter saat ini. |

Makna penting:

- `❌` berarti capability expected pada boundary Flutter tidak ditemukan pada
  implementation user-facing. Ia tetap explicit walaupun native runtime atau
  CI belum tersedia.
- `🌗` berarti sebagian capability ada atau hanya bounded contract/evidence
  yang tersedia.
- `?` tidak dipakai sebagai pengganti `❌`; keterbatasan evidence dicatat pada
  kolom Evidence status.
- `➖` hanya boleh dipakai untuk scope yang memang diputuskan bukan tanggung
  jawab Flutter. Tidak ada expected row di bawah yang diubah menjadi `➖`.

## Rekonsiliasi 61 expected IDs

### 1. Document, file, dan recovery

| ID | Reconciliation result | Implementation status | Evidence status | Scope / owner decision | Audit trace |
| --- | --- | --- | --- | --- | --- |
| DOC-01 | `✔️` | implemented | source-plus-local | in scope; Flutter document lifecycle | [Audit §3.1 DOC-01](./implementation-gap-map.md#31-document-file-dan-recovery) |
| DOC-02 | `✔️` | implemented | source-plus-local; native not verified | in scope; Flutter file service/host picker boundary | [Audit §3.1 DOC-02](./implementation-gap-map.md#31-document-file-dan-recovery) |
| DOC-03 | `✔️` | implemented | source-plus-local; native not verified | in scope; Flutter file service | [Audit §3.1 DOC-03](./implementation-gap-map.md#31-document-file-dan-recovery) |
| DOC-04 | `✔️` | implemented | source-plus-local; native not verified | in scope; Flutter file service | [Audit §3.1 DOC-04](./implementation-gap-map.md#31-document-file-dan-recovery) |
| DOC-05 | `✔️` | implemented | source-plus-local | in scope; Flutter recent store | [Audit §3.1 DOC-05](./implementation-gap-map.md#31-document-file-dan-recovery) |
| DOC-06 | `✔️` | implemented | source-plus-local | in scope; Flutter document session | [Audit §3.1 DOC-06](./implementation-gap-map.md#31-document-file-dan-recovery) |
| DOC-07 | `✔️` | implemented | source-plus-local; native not verified | in scope; Flutter/host lifecycle boundary | [Audit §3.1 DOC-07](./implementation-gap-map.md#31-document-file-dan-recovery) |
| DOC-08 | `⏸️` | partial | recovery store and focused local tests; forced-exit/native storage not verified | held environment boundary; `relgeo/flutter` owner | [Audit §3.1 DOC-08](./implementation-gap-map.md#31-document-file-dan-recovery) |
| DOC-09 | `✔️` | implemented | source-plus-local | in scope; Flutter document identity/file service | [Audit §3.1 DOC-09](./implementation-gap-map.md#31-document-file-dan-recovery) |
| IO-01 | `⏸️` | partial | source-plus-local; native not verified | held environment boundary; Flutter adapter owner | [Audit §3.1 IO-01](./implementation-gap-map.md#31-document-file-dan-recovery) |
| IO-02 | `⏸️` | implemented-at-bounded-boundary | current diagnostic fixture + focused Flutter tests | held only for broader cross-consumer policy; Flutter + core owners | [Audit §3.1 IO-02](./implementation-gap-map.md#31-document-file-dan-recovery) |

### 2. Authoring, compile, diagnostics, dan contract

| ID | Reconciliation result | Implementation status | Evidence status | Scope / owner decision | Audit trace |
| --- | --- | --- | --- | --- | --- |
| EDIT-01 | `✔️` | implemented | source-plus-local | in scope; Flutter editor | [Audit §3.2 EDIT-01](./implementation-gap-map.md#32-authoring-compile-diagnostics-dan-contract) |
| EDIT-02 | `✔️` | implemented | source-plus-local | in scope; Flutter editor/DSL vocabulary | [Audit §3.2 EDIT-02](./implementation-gap-map.md#32-authoring-compile-diagnostics-dan-contract) |
| EDIT-03 | `✔️` | implemented | source-plus-local | in scope; Flutter workbench compile path | [Audit §3.2 EDIT-03](./implementation-gap-map.md#32-authoring-compile-diagnostics-dan-contract) |
| EDIT-04 | `⏸️` | implemented-at-bounded-boundary | current diagnostic fixture + focused Flutter tests | held only for cross-consumer/runtime execution; Flutter + spec + core owners | [Audit §3.2 EDIT-04](./implementation-gap-map.md#32-authoring-compile-diagnostics-dan-contract) |
| EDIT-05 | `✔️` | implemented | bounded-contract | in scope; Flutter preview recovery behavior | [Audit §3.2 EDIT-05](./implementation-gap-map.md#32-authoring-compile-diagnostics-dan-contract) |
| EDIT-06 | `✔️` | implemented | source-plus-local | in scope; Flutter editor history | [Audit §3.2 EDIT-06](./implementation-gap-map.md#32-authoring-compile-diagnostics-dan-contract) |
| EDIT-07 | `✔️` | implemented | source-plus-local | in scope; Flutter editor history | [Audit §3.2 EDIT-07](./implementation-gap-map.md#32-authoring-compile-diagnostics-dan-contract) |
| EDIT-08 | `✔️` | implemented | source-plus-local | in scope; shared command registry | [Audit §3.2 EDIT-08](./implementation-gap-map.md#32-authoring-compile-diagnostics-dan-contract) |
| CONTRACT-01 | `⏸️` | implemented-at-bounded-boundary | current contract revision + diagnostic fixture; staged replay deferred | held only for current-pointer cross-consumer execution; spec + Flutter + core owners | [Audit §3.2 CONTRACT-01](./implementation-gap-map.md#32-authoring-compile-diagnostics-dan-contract) |
| CONTRACT-02 | `⏸️` | implemented-at-bounded-boundary | current manifest/promotion check | fixtures 15/16 are Flutter-promoted; fixture 24 remains explicit non-Flutter scope; workspace + Flutter owners | [Audit §3.2 CONTRACT-02](./implementation-gap-map.md#32-authoring-compile-diagnostics-dan-contract) |
| CONTRACT-03 | `⏸️` | implemented-at-bounded-boundary | semantic comparator contract + Flutter projection; TS replay deferred | held only for current-pointer renderer replay; raw/presentation excluded; renderer + Flutter owners | [Audit §3.2 CONTRACT-03](./implementation-gap-map.md#32-authoring-compile-diagnostics-dan-contract) |

### 3. Canvas, preview, inspection, dan navigation

| ID | Reconciliation result | Implementation status | Evidence status | Scope / owner decision | Audit trace |
| --- | --- | --- | --- | --- | --- |
| CANVAS-01 | `✔️` | implemented | source-plus-local | in scope; Flutter canvas/preview | [Audit §3.3 CANVAS-01](./implementation-gap-map.md#33-canvas-preview-inspection-dan-navigation) |
| CANVAS-02 | `✔️` | implemented | source-plus-local | in scope for model/sheet view | [Audit §3.3 CANVAS-02](./implementation-gap-map.md#33-canvas-preview-inspection-dan-navigation) |
| CANVAS-03 | `⏸️` | bounded implementation | source-plus-local; host evidence held | bounded inspector/selection boundary; exhaustive field inventory remains separate | [Audit §3.3 CANVAS-03](./implementation-gap-map.md#33-canvas-preview-inspection-dan-navigation) |
| CANVAS-04 | `⏸️` | bounded implementation | source-plus-local; cross-consumer evidence held | bounded parameter/profile editing boundary; full evaluator parity remains separate | [Audit §3.3 CANVAS-04](./implementation-gap-map.md#33-canvas-preview-inspection-dan-navigation) |
| CANVAS-05 | `✔️` | implemented at Flutter boundary | graph model/panel and focused tests; native AT/runtime not verified | in scope; user-facing graph belongs to Flutter workbench | [Audit §3.3 CANVAS-05](./implementation-gap-map.md#33-canvas-preview-inspection-dan-navigation) |
| CANVAS-06 | `✔️` | implemented | source-plus-local; native AT not verified | in scope; Flutter overlay/role controls | [Audit §3.3 CANVAS-06](./implementation-gap-map.md#33-canvas-preview-inspection-dan-navigation) |
| VIEW-01 | `✔️` | implemented | source-plus-local | in scope; Flutter viewport | [Audit §3.3 VIEW-01](./implementation-gap-map.md#33-canvas-preview-inspection-dan-navigation) |
| VIEW-02 | `✔️` | implemented | source-plus-local; gesture runtime not verified | in scope; Flutter viewport | [Audit §3.3 VIEW-02](./implementation-gap-map.md#33-canvas-preview-inspection-dan-navigation) |
| VIEW-03 | `✔️` | implemented | source-plus-local | in scope; Flutter viewport | [Audit §3.3 VIEW-03](./implementation-gap-map.md#33-canvas-preview-inspection-dan-navigation) |
| VIEW-04 | `✔️` | implemented | source-plus-local | in scope; Flutter viewport | [Audit §3.3 VIEW-04](./implementation-gap-map.md#33-canvas-preview-inspection-dan-navigation) |
| VIEW-05 | `✔️` | implemented at Flutter boundary | selection controller, canvas/inspector wiring, and focused tests; physical pointer not verified | in scope; object selection belongs to Flutter workbench | [Audit §3.3 VIEW-05](./implementation-gap-map.md#33-canvas-preview-inspection-dan-navigation) |

### 4. Layout, theme, preferences, persistence

| ID | Reconciliation result | Implementation status | Evidence status | Scope / owner decision | Audit trace |
| --- | --- | --- | --- | --- | --- |
| LAYOUT-01 | `✔️` | implemented | source-plus-local | in scope; Flutter panel lifecycle | [Audit §3.4 LAYOUT-01](./implementation-gap-map.md#34-layout-theme-preferences-persistence) |
| LAYOUT-02 | `✔️` | implemented | source-plus-local; native pointer not verified | in scope; Flutter docking | [Audit §3.4 LAYOUT-02](./implementation-gap-map.md#34-layout-theme-preferences-persistence) |
| LAYOUT-03 | `✔️` | implemented | source-plus-local; native pointer not verified | in scope; Flutter floating panels | [Audit §3.4 LAYOUT-03](./implementation-gap-map.md#34-layout-theme-preferences-persistence) |
| LAYOUT-04 | `✔️` | implemented | source-plus-local | in scope; Flutter workbench profiles | [Audit §3.4 LAYOUT-04](./implementation-gap-map.md#34-layout-theme-preferences-persistence) |
| LAYOUT-05 | `✔️` | implemented | source-plus-local | in scope; Flutter reset/fallback | [Audit §3.4 LAYOUT-05](./implementation-gap-map.md#34-layout-theme-preferences-persistence) |
| LAYOUT-06 | `✔️` | implemented | source-plus-local; native restart not verified | in scope; Flutter layout persistence | [Audit §3.4 LAYOUT-06](./implementation-gap-map.md#34-layout-theme-preferences-persistence) |
| LAYOUT-07 | `✔️` | implemented | source-plus-local; native resize not verified | in scope; Flutter responsive layout | [Audit §3.4 LAYOUT-07](./implementation-gap-map.md#34-layout-theme-preferences-persistence) |
| THEME-01 | `✔️` | implemented | source-plus-local; OS transition not verified | in scope; Flutter follows system by default | [Audit §3.4 THEME-01](./implementation-gap-map.md#34-layout-theme-preferences-persistence) |
| THEME-02 | `✔️` | implemented | source-plus-local | in scope; Flutter Light/Dark override | [Audit §3.4 THEME-02](./implementation-gap-map.md#34-layout-theme-preferences-persistence) |
| THEME-03 | `✔️` | implemented | source-plus-local | in scope; Flutter reset to system | [Audit §3.4 THEME-03](./implementation-gap-map.md#34-layout-theme-preferences-persistence) |
| THEME-04 | `✔️` | implemented | source-plus-local | in scope; canvas/app theme separation | [Audit §3.4 THEME-04](./implementation-gap-map.md#34-layout-theme-preferences-persistence) |
| PREF-01 | `✔️` | implemented | source-plus-local; host persistence not verified | in scope; Flutter preferences | [Audit §3.4 PREF-01](./implementation-gap-map.md#34-layout-theme-preferences-persistence) |
| PREF-02 | `✔️` | implemented | source-plus-local | in scope; Flutter reset/fallback | [Audit §3.4 PREF-02](./implementation-gap-map.md#34-layout-theme-preferences-persistence) |

### 5. Commands, keyboard, accessibility, dan window lifecycle

| ID | Reconciliation result | Implementation status | Evidence status | Scope / owner decision | Audit trace |
| --- | --- | --- | --- | --- | --- |
| CMD-01 | `✔️` | implemented | source-plus-local; native event not verified | in scope; shared Flutter command registry | [Audit §3.5 CMD-01](./implementation-gap-map.md#35-commands-keyboard-accessibility-dan-window-lifecycle) |
| CMD-02 | `✔️` | implemented | source-plus-local; native menu not verified | in scope; Flutter menu/native adapter boundary | [Audit §3.5 CMD-02](./implementation-gap-map.md#35-commands-keyboard-accessibility-dan-window-lifecycle) |
| CMD-03 | `⏸️` | implemented at Flutter boundary | source-plus-local; native shortcut not verified | held host evidence boundary; registry conflict and shortcut parity are tested | [Audit §3.5 CMD-03](./implementation-gap-map.md#35-commands-keyboard-accessibility-dan-window-lifecycle) |
| A11Y-01 | `⏸️` | implemented at Flutter boundary | source-plus-local; native AT not verified | held host evidence boundary; focus/activation paths are tested | [Audit §3.5 A11Y-01](./implementation-gap-map.md#35-commands-keyboard-accessibility-dan-window-lifecycle) |
| A11Y-02 | `⏸️` | implemented at Flutter boundary | source-plus-local; native AT not verified | held host evidence boundary; canvas/graph/control semantics are tested | [Audit §3.5 A11Y-02](./implementation-gap-map.md#35-commands-keyboard-accessibility-dan-window-lifecycle) |
| A11Y-03 | `✔️` | implemented | source-plus-local; OS preference not verified | in scope; Flutter reduced-motion boundary | [Audit §3.5 A11Y-03](./implementation-gap-map.md#35-commands-keyboard-accessibility-dan-window-lifecycle) |
| WINDOW-01 | `⏸️` | implemented at adapter boundary | source-plus-local; native lifecycle not verified | held host evidence boundary; close callback, dirty guard, and method channel are tested | [Audit §3.5 WINDOW-01](./implementation-gap-map.md#35-commands-keyboard-accessibility-dan-window-lifecycle) |
| WINDOW-02 | `✔️` | implemented | source-plus-local; OS enforcement not verified | in scope; Flutter window policy | [Audit §3.5 WINDOW-02](./implementation-gap-map.md#35-commands-keyboard-accessibility-dan-window-lifecycle) |
| WINDOW-03 | `✔️` | implemented | source; native runtime not verified | in scope as native title-bar boundary; custom chrome deferred | [Audit §3.5 WINDOW-03](./implementation-gap-map.md#35-commands-keyboard-accessibility-dan-window-lifecycle) |

### 6. Export dan platform delivery

| ID | Reconciliation result | Implementation status | Evidence status | Scope / owner decision | Audit trace |
| --- | --- | --- | --- | --- | --- |
| EXPORT-01 | `✔️` | implemented | source-plus-local; native write not verified | in scope; Flutter SVG export boundary | [Audit §3.6 EXPORT-01](./implementation-gap-map.md#36-export-dan-platform-delivery) |
| EXPORT-02 | `✔️` | implemented | source-plus-local; native write not verified | in scope; Flutter model/sheet export | [Audit §3.6 EXPORT-02](./implementation-gap-map.md#36-export-dan-platform-delivery) |
| PLAT-01 | `⏸️` | partial | current CI build and v1.0.1 draft archive/checksum verified; target launch not verified | held target-host environment boundary; Flutter + workspace | [Audit §3.6 PLAT-01](./implementation-gap-map.md#36-export-dan-platform-delivery) |
| PLAT-02 | `⏸️` | partial | current CI build and v1.0.1 draft archive/checksum verified; target Linux runtime not verified | held target-host environment boundary; Flutter + workspace | [Audit §3.6 PLAT-02](./implementation-gap-map.md#36-export-dan-platform-delivery) |
| PLAT-03 | `⏸️` | partial | current CI build and v1.0.1 draft archive/checksum verified; Windows runtime not verified | held target-host environment boundary; Flutter + workspace | [Audit §3.6 PLAT-03](./implementation-gap-map.md#36-export-dan-platform-delivery) |
| PLAT-04 | `⏸️` | partial | current baseline tuple refreshed; artifact/runtime proof not verified | held provenance/runtime boundary; workspace owner | [Audit §3.6 PLAT-04](./implementation-gap-map.md#36-export-dan-platform-delivery) |

## Coverage validation

| Check | Result |
| --- | --- |
| Expected catalog rows | 61 |
| Reconciliation rows | 61 |
| Expected IDs missing from reconciliation | 0 |
| Observed-only IDs added to reconciliation | 0 |
| Duplicate reconciliation IDs | 0 |
| Result counts | 44 `✔️` implemented, 0 `🌗` partial, 0 `❌` absent, 17 `⏸️` held, 0 `⚠️` broken |
| Implementation/evidence/scope columns present | Yes |
| Audit trace present on every row | Yes |

DOC-08 remains implementation-partial but is explicitly held because
forced-exit/relaunch and native storage behavior are not verified. CANVAS-05 and
VIEW-05 are implemented at the Flutter boundary, with native
accessibility/pointer and richer contract work still visible in the audit and
backlog. No row is changed to `➖` merely because some adjacent source/test/
runtime evidence is unavailable; all 17 held rows have a disposition record.

## Scope findings kept separate from capability results

| Finding | Scope decision | Reconciliation handling |
| --- | --- | --- |
| Android/iOS delivery and mobile AT | `deferred` | Not an active desktop capability; keep outside the 61 expected rows. |
| Custom title bar | `deferred` | Native title bar remains the current WINDOW-03 boundary. |
| Raw SVG byte equality/full presentation parity | `not applicable` to active 0.5.x semantic contract | CONTRACT-03 remains `⏸️` only for bounded semantic core; no raw-byte gap is invented. |
| pub.dev/signed desktop distribution | `not applicable` to current Flutter posture | PLAT rows cover build/artifact/provenance, not publishing/signing. |
| Native picker/runtime/AT/build evidence unavailable on this host | `in scope`, evidence limitation | Keep implementation status separate; do not turn an evidence limitation into `❌`. |

## Handoff

The reconciliation is a documentation join and does not claim that any gap has
been fixed. Follow-up work should use the expected ID as the stable key and
preserve the three dimensions separately. The current implementation gap map
and this reconciliation both retain historical/current-pointer provenance so
that a future CI or native runtime run can upgrade evidence without rewriting
the expected catalog.
