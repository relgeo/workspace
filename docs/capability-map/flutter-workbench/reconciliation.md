# Flutter Workbench — Expected-versus-Observed Reconciliation

> **Coverage statement — 2026-10-30.** Dokumen ini adalah join satu-per-satu
> antara seluruh 61 ID pada [expected capability catalog](../../plans/12-flutter-workbench-capability-baseline.md)
> dan baris observed pada [Flutter implementation audit](./implementation-gap-map.md).
> Ia tidak menambah capability, tidak menghapus expected row, dan tidak
> mengubah capability absent menjadi `➖` hanya karena evidence runtime belum
> tersedia.

**Expected catalog:** [`12-flutter-workbench-capability-baseline.md`](../../plans/12-flutter-workbench-capability-baseline.md)  
**Implementation audit:** [`flutter-workbench/implementation-gap-map.md`](./implementation-gap-map.md)  
**Status matrix:** [`flutter-workbench/status-matrix.md`](./status-matrix.md)  
**Gap backlog:** [`flutter-workbench/implementation-gap-backlog.md`](./implementation-gap-backlog.md)

## Evidence boundary

| Evidence source | Role in this reconciliation |
| --- | --- |
| `flutter@b21eceb258070133f32fd822b6fd23a4f21b0bbf` | Audited implementation boundary, including `flutter/lib/`, `flutter/test/`, platform runners, configuration, and the current local analyzer/test result. |
| [`docs/MATURATION-MASTER-PLAN.md`](../../MATURATION-MASTER-PLAN.md) | Roadmap, active desktop/platform gates, compatibility line, and historical-versus-current evidence rules. |
| [`docs/REPOSITORY-MAP.md`](../../REPOSITORY-MAP.md) | Repository ownership and Flutter surface boundary. |
| [`docs/capability-map/INVENTORY-PROTOCOL.md`](../INVENTORY-PROTOCOL.md) and the capability-map artifacts | Discovery categories, status/evidence separation, expected-but-missing rule, and one-to-one coverage checks. |
| [Flutter implementation audit](./implementation-gap-map.md) | Observed source/test/UI/platform/runtime findings used by each audit trace below; unavailable host evidence remains qualified rather than promoted to implementation status. |

The reconciliation result is assigned exactly once per expected capability. It
is intentionally independent from the evidence qualifier: `✔️`/`🌗`/`❌`/
`➖`/`⏸️`/`⚠️` describes the implementation or scope outcome, while the
Evidence status column describes how that outcome was verified.

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
| DOC-08 | `❌` | absent | source negative evidence | in scope; `relgeo/flutter` owner | [Audit §3.1 DOC-08](./implementation-gap-map.md#31-document-file-dan-recovery) |
| DOC-09 | `✔️` | implemented | source-plus-local | in scope; Flutter document identity/file service | [Audit §3.1 DOC-09](./implementation-gap-map.md#31-document-file-dan-recovery) |
| IO-01 | `🌗` | partial | source-plus-local; native not verified | in scope; Flutter adapter, OS picker evidence pending | [Audit §3.1 IO-01](./implementation-gap-map.md#31-document-file-dan-recovery) |
| IO-02 | `🌗` | partial | bounded-contract | in scope; bounded RelGeo/YAML import | [Audit §3.1 IO-02](./implementation-gap-map.md#31-document-file-dan-recovery) |

### 2. Authoring, compile, diagnostics, dan contract

| ID | Reconciliation result | Implementation status | Evidence status | Scope / owner decision | Audit trace |
| --- | --- | --- | --- | --- | --- |
| EDIT-01 | `✔️` | implemented | source-plus-local | in scope; Flutter editor | [Audit §3.2 EDIT-01](./implementation-gap-map.md#32-authoring-compile-diagnostics-dan-contract) |
| EDIT-02 | `✔️` | implemented | source-plus-local | in scope; Flutter editor/DSL vocabulary | [Audit §3.2 EDIT-02](./implementation-gap-map.md#32-authoring-compile-diagnostics-dan-contract) |
| EDIT-03 | `✔️` | implemented | source-plus-local | in scope; Flutter workbench compile path | [Audit §3.2 EDIT-03](./implementation-gap-map.md#32-authoring-compile-diagnostics-dan-contract) |
| EDIT-04 | `🌗` | partial | bounded-contract | in scope; diagnostic contract shared with DSL/core | [Audit §3.2 EDIT-04](./implementation-gap-map.md#32-authoring-compile-diagnostics-dan-contract) |
| EDIT-05 | `✔️` | implemented | bounded-contract | in scope; Flutter preview recovery behavior | [Audit §3.2 EDIT-05](./implementation-gap-map.md#32-authoring-compile-diagnostics-dan-contract) |
| EDIT-06 | `✔️` | implemented | source-plus-local | in scope; Flutter editor history | [Audit §3.2 EDIT-06](./implementation-gap-map.md#32-authoring-compile-diagnostics-dan-contract) |
| EDIT-07 | `✔️` | implemented | source-plus-local | in scope; Flutter editor history | [Audit §3.2 EDIT-07](./implementation-gap-map.md#32-authoring-compile-diagnostics-dan-contract) |
| EDIT-08 | `✔️` | implemented | source-plus-local | in scope; shared command registry | [Audit §3.2 EDIT-08](./implementation-gap-map.md#32-authoring-compile-diagnostics-dan-contract) |
| CONTRACT-01 | `🌗` | partial | bounded-contract; historical cross-consumer evidence | in scope with DSL `0.5.x` boundary | [Audit §3.2 CONTRACT-01](./implementation-gap-map.md#32-authoring-compile-diagnostics-dan-contract) |
| CONTRACT-02 | `🌗` | partial | bounded-contract; historical CI | in scope only for promoted fixture boundary | [Audit §3.2 CONTRACT-02](./implementation-gap-map.md#32-authoring-compile-diagnostics-dan-contract) |
| CONTRACT-03 | `🌗` | partial | bounded-contract; historical CI | in scope for semantic SVG core, not raw/presentation parity | [Audit §3.2 CONTRACT-03](./implementation-gap-map.md#32-authoring-compile-diagnostics-dan-contract) |

### 3. Canvas, preview, inspection, dan navigation

| ID | Reconciliation result | Implementation status | Evidence status | Scope / owner decision | Audit trace |
| --- | --- | --- | --- | --- | --- |
| CANVAS-01 | `✔️` | implemented | source-plus-local | in scope; Flutter canvas/preview | [Audit §3.3 CANVAS-01](./implementation-gap-map.md#33-canvas-preview-inspection-dan-navigation) |
| CANVAS-02 | `✔️` | implemented | source-plus-local | in scope for model/sheet view | [Audit §3.3 CANVAS-02](./implementation-gap-map.md#33-canvas-preview-inspection-dan-navigation) |
| CANVAS-03 | `🌗` | partial | source-plus-local | in scope; inspector surface parity incomplete | [Audit §3.3 CANVAS-03](./implementation-gap-map.md#33-canvas-preview-inspection-dan-navigation) |
| CANVAS-04 | `🌗` | partial | source-plus-local | in scope conditional; parameter policy remains bounded | [Audit §3.3 CANVAS-04](./implementation-gap-map.md#33-canvas-preview-inspection-dan-navigation) |
| CANVAS-05 | `❌` | absent | source negative evidence | in scope; user-facing graph belongs to Flutter workbench | [Audit §3.3 CANVAS-05](./implementation-gap-map.md#33-canvas-preview-inspection-dan-navigation) |
| CANVAS-06 | `✔️` | implemented | source-plus-local; native AT not verified | in scope; Flutter overlay/role controls | [Audit §3.3 CANVAS-06](./implementation-gap-map.md#33-canvas-preview-inspection-dan-navigation) |
| VIEW-01 | `✔️` | implemented | source-plus-local | in scope; Flutter viewport | [Audit §3.3 VIEW-01](./implementation-gap-map.md#33-canvas-preview-inspection-dan-navigation) |
| VIEW-02 | `✔️` | implemented | source-plus-local; gesture runtime not verified | in scope; Flutter viewport | [Audit §3.3 VIEW-02](./implementation-gap-map.md#33-canvas-preview-inspection-dan-navigation) |
| VIEW-03 | `✔️` | implemented | source-plus-local | in scope; Flutter viewport | [Audit §3.3 VIEW-03](./implementation-gap-map.md#33-canvas-preview-inspection-dan-navigation) |
| VIEW-04 | `✔️` | implemented | source-plus-local | in scope; Flutter viewport | [Audit §3.3 VIEW-04](./implementation-gap-map.md#33-canvas-preview-inspection-dan-navigation) |
| VIEW-05 | `❌` | absent | source/test negative evidence | in scope; object selection belongs to Flutter workbench | [Audit §3.3 VIEW-05](./implementation-gap-map.md#33-canvas-preview-inspection-dan-navigation) |

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
| CMD-03 | `🌗` | partial | source-plus-local; native shortcut not verified | in scope; per-OS shortcut policy pending | [Audit §3.5 CMD-03](./implementation-gap-map.md#35-commands-keyboard-accessibility-dan-window-lifecycle) |
| A11Y-01 | `🌗` | partial | source-plus-local; native AT not verified | in scope; Flutter focus/activation boundary | [Audit §3.5 A11Y-01](./implementation-gap-map.md#35-commands-keyboard-accessibility-dan-window-lifecycle) |
| A11Y-02 | `🌗` | partial | source-plus-local; native AT not verified | in scope; Flutter semantics boundary | [Audit §3.5 A11Y-02](./implementation-gap-map.md#35-commands-keyboard-accessibility-dan-window-lifecycle) |
| A11Y-03 | `✔️` | implemented | source-plus-local; OS preference not verified | in scope; Flutter reduced-motion boundary | [Audit §3.5 A11Y-03](./implementation-gap-map.md#35-commands-keyboard-accessibility-dan-window-lifecycle) |
| WINDOW-01 | `🌗` | partial | source-plus-local; native lifecycle not verified | in scope; Flutter/native host lifecycle | [Audit §3.5 WINDOW-01](./implementation-gap-map.md#35-commands-keyboard-accessibility-dan-window-lifecycle) |
| WINDOW-02 | `✔️` | implemented | source-plus-local; OS enforcement not verified | in scope; Flutter window policy | [Audit §3.5 WINDOW-02](./implementation-gap-map.md#35-commands-keyboard-accessibility-dan-window-lifecycle) |
| WINDOW-03 | `✔️` | implemented | source; native runtime not verified | in scope as native title-bar boundary; custom chrome deferred | [Audit §3.5 WINDOW-03](./implementation-gap-map.md#35-commands-keyboard-accessibility-dan-window-lifecycle) |

### 6. Export dan platform delivery

| ID | Reconciliation result | Implementation status | Evidence status | Scope / owner decision | Audit trace |
| --- | --- | --- | --- | --- | --- |
| EXPORT-01 | `✔️` | implemented | source-plus-local; native write not verified | in scope; Flutter SVG export boundary | [Audit §3.6 EXPORT-01](./implementation-gap-map.md#36-export-dan-platform-delivery) |
| EXPORT-02 | `✔️` | implemented | source-plus-local; native write not verified | in scope; Flutter model/sheet export | [Audit §3.6 EXPORT-02](./implementation-gap-map.md#36-export-dan-platform-delivery) |
| PLAT-01 | `🌗` | partial | historical-only; current build/runtime not verified | in scope; macOS target | [Audit §3.6 PLAT-01](./implementation-gap-map.md#36-export-dan-platform-delivery) |
| PLAT-02 | `🌗` | partial | historical-only; Linux runtime not verified | in scope; Ubuntu/Linux target | [Audit §3.6 PLAT-02](./implementation-gap-map.md#36-export-dan-platform-delivery) |
| PLAT-03 | `🌗` | partial | historical-only; Windows runtime not verified | in scope; Windows 11 target | [Audit §3.6 PLAT-03](./implementation-gap-map.md#36-export-dan-platform-delivery) |
| PLAT-04 | `🌗` | partial | source-plus-historical; current pointer mismatch | in scope; workspace evidence owner | [Audit §3.6 PLAT-04](./implementation-gap-map.md#36-export-dan-platform-delivery) |

## Coverage validation

| Check | Result |
| --- | --- |
| Expected catalog rows | 61 |
| Reconciliation rows | 61 |
| Expected IDs missing from reconciliation | 0 |
| Observed-only IDs added to reconciliation | 0 |
| Duplicate reconciliation IDs | 0 |
| Result counts | 42 `✔️` implemented, 16 `🌗` partial, 3 `❌` absent, 0 `⚠️` broken |
| Implementation/evidence/scope columns present | Yes |
| Audit trace present on every row | Yes |

The absent rows remain explicit: DOC-08 session recovery, CANVAS-05 user-facing
graph, and VIEW-05 object selection. They are not changed to `➖` merely because
some adjacent source/test/runtime evidence is unavailable.

## Scope findings kept separate from capability results

| Finding | Scope decision | Reconciliation handling |
| --- | --- | --- |
| Android/iOS delivery and mobile AT | `deferred` | Not an active desktop capability; keep outside the 61 expected rows. |
| Custom title bar | `deferred` | Native title bar remains the current WINDOW-03 boundary. |
| Raw SVG byte equality/full presentation parity | `not applicable` to active 0.5.x semantic contract | CONTRACT-03 remains `🌗` only for bounded semantic core; no raw-byte gap is invented. |
| pub.dev/signed desktop distribution | `not applicable` to current Flutter posture | PLAT rows cover build/artifact/provenance, not publishing/signing. |
| Native picker/runtime/AT/build evidence unavailable on this host | `in scope`, evidence limitation | Keep implementation status separate; do not turn an evidence limitation into `❌`. |

## Handoff

The reconciliation is a documentation join and does not claim that any gap has
been fixed. Follow-up work should use the expected ID as the stable key and
preserve the three dimensions separately. The current implementation gap map
and this reconciliation both retain historical/current-pointer provenance so
that a future CI or native runtime run can upgrade evidence without rewriting
the expected catalog.
