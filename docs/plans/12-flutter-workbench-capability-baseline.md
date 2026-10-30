# Flutter Workbench — Expected Product Capability Catalog

**Status:** expected catalog selesai; belum merupakan audit implementasi
**Tanggal baseline:** 2026-10-30
**Owner koordinasi:** `relgeo/workspace`
**Owner implementasi:** `relgeo/flutter`
**Compatibility line:** RelGeo DSL `0.5.x`

**Downstream audit:** [`flutter-workbench/implementation-gap-map.md`](../capability-map/flutter-workbench/implementation-gap-map.md)  
**Reconciliation:** [`flutter-workbench/reconciliation.md`](../capability-map/flutter-workbench/reconciliation.md)  
**Status matrix:** [`flutter-workbench/status-matrix.md`](../capability-map/flutter-workbench/status-matrix.md)  
**Gap backlog:** [`flutter-workbench/implementation-gap-backlog.md`](../capability-map/flutter-workbench/implementation-gap-backlog.md)

## 1. Tujuan dan aturan pembacaan

Dokumen ini mendefinisikan kemampuan yang diharapkan dari Flutter sebagai
desktop authoring workbench sebelum membandingkannya dengan kode, test, atau
matrix implementasi. Daftar ini disusun dari user journey, target pengguna,
workflow produk, command/menu contract, roadmap, kontrak DSL, dan keputusan
scope yang sudah ada.

`CATALOG-VERIFIED` berarti capability memiliki requirement anchor, scope
decision, dan owner/source of truth yang jelas. Itu **bukan** klaim bahwa
capability sudah diimplementasikan atau sudah lulus runtime smoke. Audit
implementasi harus dibuat sesudah katalog ini disetujui, dengan evidence per
baris dan tanpa mengubah daftar expected secara diam-diam.

### 1.1 Target pengguna dan journey

| Kode | Target pengguna | Journey yang harus didukung |
| --- | --- | --- |
| U1 | Author RelGeo baru | Membuat dokumen, menulis DSL, melihat preview/diagnostic, lalu menyimpan hasil. |
| U2 | Author yang kembali ke pekerjaan lama | Membuka Recent, memulihkan dokumen/layout/preferences, dan melanjutkan tanpa kehilangan perubahan. |
| U3 | Author/reviewer teknis | Memilih object/view, memeriksa inspector/graph, membaca diagnostic, dan mengekspor SVG. |
| U4 | Power user desktop | Menggunakan menu, shortcut, undo/redo, zoom/pan, docking, theme, dan keyboard traversal. |
| U5 | Maintainer/operator delivery | Menjalankan workbench pada macOS, Linux, dan Windows dengan artifact serta evidence yang dapat ditelusuri. |

### 1.2 Source-of-truth legend

| Kode | Source of truth |
| --- | --- |
| MP | `docs/MATURATION-MASTER-PLAN.md` |
| RM | `docs/REPOSITORY-MAP.md` — repository ownership, Flutter boundary, and capability-inventory rules. |
| CM | `docs/capability-map/INVENTORY-PROTOCOL.md`, `docs/capability-map/SURFACE-DISCOVERY-LEDGER.md`, and the Flutter capability-map artifacts. |
| P06 | `docs/plans/06-flutter-alignment.md` |
| P07 | `docs/plans/07-flutter-capability-promotion-and-svg-parity.md` |
| P10 | `docs/plans/10-desktop-runtime-smoke-checklist.md` |
| W01 | `flutter/docs/plans/01-theme-and-modular-workbench.md` |
| W02 | `flutter/docs/plans/02-workbench-layout-and-panel-system.md` |
| W03 | `flutter/docs/plans/03-docking-tree-and-drop-preview.md` |
| D09 | `docs/decisions/09-open-work-recommendations.md` |
| MAC | `flutter/.local/verification/macos-arm64-build-and-debug.md` |
| DSL | Normative RelGeo DSL/spec contract, referenced by P06/P07 and their fixture decisions. |

### 1.3 Required source-dimension crosswalk

The catalog is intentionally requirement-first. The following crosswalk records
how each required discovery dimension contributes expected rows; it is not an
implementation result and does not allow a missing source symbol to remove a
row from the catalog.

| Required dimension | Sources consulted | Catalog consequence |
| --- | --- | --- |
| Surface and ownership boundary | RM, CM, Flutter package/docs | Rows belong to the desktop authoring workbench boundary; delegated DSL semantics remain contract rows and mobile remains an explicit boundary. |
| Target users and user journeys | §1.1 (U1–U5), W01, W02, P10 | Each row names the user outcome and maps it to one or more journeys. |
| Workflows, menus, and commands | W01, W02, W03, P10 | File/Edit/View/Appearance/Document/Workbench/Help, panel, docking, viewport, export, and lifecycle workflows are represented even when their implementation is incomplete or runtime evidence is unavailable. |
| Roadmap and maturation priorities | MP, P06, P07, P10, W01–W03 | Current desktop workbench delivery, active DSL boundaries, evidence gates, and deferred platform work are represented as expected capabilities or scope decisions. |
| Normative and integration contracts | DSL, P06, P07, RM | Compatibility, semantic geometry, SVG semantic export, document identity, and file/workbench boundaries are expected at the stated contract line. |
| Scope and non-goals | MP, D09, W01–W03, CM | Mobile delivery, custom title bars, raw SVG byte equality, signed distribution, and unpromoted DSL surfaces remain explicit boundaries rather than silently becoming gaps. |
| Capability inventory evidence | CM and the Flutter capability-map artifacts | The later audit may compare every ID one-to-one, but the audit/matrix cannot redefine the expected set or turn unavailable evidence into an implementation failure. |

The catalog therefore includes expected capabilities even when current source,
tests, or runtime evidence may not yet prove them. In particular, DOC-08
session recovery, IO-01 native file picker behavior, A11Y-02 assistive
semantics, WINDOW-01 native lifecycle integration, and PLAT-02/PLAT-03 target
runtime delivery remain expected rows regardless of whether their eventual
audit result is partial, absent, or not verified. Their presence is a product
requirement decision, not a claim that the checkout already implements them.

## 2. Expected capability catalog

Status implementasi sengaja tidak diisi pada tahap ini. Kolom terakhir hanya
menunjukkan bahwa baris sudah siap menjadi unit audit berikutnya.

### 2.1 Document, file, dan recovery lifecycle

| ID | Capability expected | User outcome | Requirement basis | Scope decision | Owner / source of truth | Verifikasi katalog |
| --- | --- | --- | --- | --- | --- | --- |
| DOC-01 | New document | U1 dapat memulai dokumen valid tanpa membuat file manual. | W02 menu `File → New`; lifecycle document. | In scope; default minimal document boleh dipakai, tetapi policy isi awal harus stabil. | `relgeo/flutter`; W02, DSL | CATALOG-VERIFIED |
| DOC-02 | Open document | U1/U2 dapat membuka file RelGeo/YAML dari filesystem. | W02 `File → Open`; P10 open smoke. | In scope untuk desktop; native picker/runtime OS masih evidence terpisah. | `relgeo/flutter`; W02, P10 | CATALOG-VERIFIED |
| DOC-03 | Save | Perubahan tersimpan ke identity/path aktif dan sesi menjadi clean setelah sukses. | W02 `File → Save`; dirty-state lifecycle. | In scope; failure/cancel tidak boleh menghapus dirty state. | `relgeo/flutter`; W02, DSL | CATALOG-VERIFIED |
| DOC-04 | Save As | Author dapat menyimpan ke identity/path baru tanpa menimpa dokumen asal secara diam-diam. | W02 `File → Save As`; file service contract. | In scope; picker dan acknowledgement hasil harus eksplisit. | `relgeo/flutter`; W02, P10 | CATALOG-VERIFIED |
| DOC-05 | Recent documents | U2 dapat melihat dan membuka dokumen yang terakhir berhasil dibuka/disimpan. | W02 `File → Recent`; local recent persistence. | In scope; missing/error entry harus aman dan tidak dianggap sebagai file valid. | `relgeo/flutter`; W02 | CATALOG-VERIFIED |
| DOC-06 | Dirty state | Author selalu tahu dokumen memiliki perubahan belum tersimpan. | W02 dirty marker dan `WorkbenchDocumentSession`. | In scope; indikator harus user-visible, bukan state internal saja. | `relgeo/flutter`; W02 | CATALOG-VERIFIED |
| DOC-07 | Unsaved-change guard | New/Open/Close/Quit meminta keputusan save/discard/cancel saat dokumen dirty. | W02 lifecycle guard; P10 clean exit. | In scope; cancel harus mempertahankan dokumen dan perubahan. | `relgeo/flutter`; W02, P10 | CATALOG-VERIFIED |
| DOC-08 | Session recovery after interruption | U2 dapat mengetahui dan memulihkan draft/sesi yang belum sempat disimpan setelah crash/forced exit bila recovery tersedia. | Goal brief mewajibkan recovery; MP recovery/reproducibility principle. | Expected baseline; mekanisme, retention, dan consent masih harus diputuskan sebelum audit perilaku. | `relgeo/flutter`; MP, W02, D09 | CATALOG-VERIFIED (policy-open) |
| DOC-09 | Document identity and encoding | Nama, path, encoding UTF-8, dan identity dokumen konsisten di editor, navbar, Save, dan Recent. | W02 document identity boundary; file service. | In scope untuk RelGeo/YAML desktop. | `relgeo/flutter`; W02, DSL | CATALOG-VERIFIED |
| IO-01 | Native file picker | Dialog OS dipakai untuk Open/Save As sesuai platform dan cancel tetap aman. | W02 native file picker; P10 file path checks. | In scope macOS/Linux/Windows; runtime picker evidence belum boleh diwariskan dari build evidence. | `relgeo/flutter`; W02, P10 | CATALOG-VERIFIED |
| IO-02 | Import RelGeo/YAML | File/input eksternal dapat masuk sebagai dokumen yang dikompilasi oleh DSL line aktif. | P06 DSL input/YAML boundary; W02 Open. | In scope; extension/filter dan error vocabulary harus dikunci pada audit contract. | `relgeo/flutter`; P06, DSL | CATALOG-VERIFIED (format-open) |

### 2.2 Authoring, compile, diagnostics, dan contract

| ID | Capability expected | User outcome | Requirement basis | Scope decision | Owner / source of truth | Verifikasi katalog |
| --- | --- | --- | --- | --- | --- | --- |
| EDIT-01 | DSL source editor | U1 dapat menulis dan mengubah source RelGeo dengan editor yang usable. | P06 workbench editor; W02 Code Editor panel. | In scope; desktop authoring surface. | `relgeo/flutter`; P06, W02, DSL | CATALOG-VERIFIED |
| EDIT-02 | Editor autocomplete | U1/U4 mendapat completion yang relevan dan dapat diaktifkan dengan keyboard. | P06 editor/autocomplete; W02 command/accessibility notes. | In scope; vocabulary harus mengikuti DSL contract, bukan daftar UI ad hoc. | `relgeo/flutter`; P06, W02, DSL | CATALOG-VERIFIED |
| EDIT-03 | Debounced compile and status | Setelah edit, status compile diperbarui tanpa membuat workbench terasa macet. | P06 Stage D; W02 responsiveness. | In scope; timing adalah UX target, bukan DSL contract. | `relgeo/flutter`; P06, W02 | CATALOG-VERIFIED |
| EDIT-04 | Structured diagnostics | Error/violation menampilkan tipe, path, message, dan object context yang dapat ditindaklanjuti. | P06 diagnostic mapping dan `align`; P10 diagnostic fixture; DSL. | In scope; diagnostic vocabulary lintas consumer harus dibedakan dari presentation. | `relgeo/flutter`; P06, P10, DSL | CATALOG-VERIFIED |
| EDIT-05 | Last-valid-preview preservation | Edit invalid menampilkan diagnostic tanpa menghancurkan preview valid terakhir. | P06 Stage D regression requirement. | In scope; stale preview harus diberi state yang jelas. | `relgeo/flutter`; P06, P10 | CATALOG-VERIFIED |
| EDIT-06 | Undo | U4 dapat membatalkan perubahan editor terakhir. | W02 Edit command; editor history requirement. | In scope; scope history per document dan reset saat document berganti. | `relgeo/flutter`; W02 | CATALOG-VERIFIED |
| EDIT-07 | Redo | U4 dapat mengulang perubahan yang dibatalkan. | W02 Edit command; editor history requirement. | In scope; keyboard/menu parity wajib diaudit. | `relgeo/flutter`; W02 | CATALOG-VERIFIED |
| EDIT-08 | Copy source | Author dapat menyalin source dari workbench melalui command yang konsisten. | W02 menu `Edit`; command surface. | In scope sebagai command authoring; bukan export DSL baru. | `relgeo/flutter`; W02 | CATALOG-VERIFIED |
| CONTRACT-01 | DSL 0.5.x compatibility | Input yang didukung mengikuti contract line aktif, bukan versi aplikasi Flutter. | MP compatibility line; P06 active contract statement; DSL. | In scope untuk line `0.5.x`; application version tidak mengubah contract line. | `relgeo/spec` untuk DSL; P06, MP | CATALOG-VERIFIED |
| CONTRACT-02 | Active semantic geometry | Supported geometry/intersection/boolean menghasilkan semantic scene yang dapat dibandingkan lintas consumer. | P06 capability boundary; P07 semantic core; DSL. | In scope hanya boundary active yang diputuskan; bukan full implementation surface. | `relgeo/spec` + `relgeo/flutter`; P07, DSL | CATALOG-VERIFIED |
| CONTRACT-03 | Active SVG semantic export contract | SVG export mempertahankan object identity, primitive/path geometry, subpath, endpoint, ring, dan tolerance semantik. | P07 D1; Decision 08/09 semantic parity. | In scope untuk semantic core; raw bytes, whitespace, attribute order, dan full presentation parity non-goal. | `relgeo/spec` + `relgeo/flutter`; P07, D09 | CATALOG-VERIFIED |

### 2.3 Canvas, preview, inspection, dan navigation

| ID | Capability expected | User outcome | Requirement basis | Scope decision | Owner / source of truth | Verifikasi katalog |
| --- | --- | --- | --- | --- | --- | --- |
| CANVAS-01 | Rendered canvas/preview | U1 dapat melihat hasil DSL pada preview workbench. | P06 CanvasPainter/preview; P10 render smoke. | In scope; golden visual bukan pengganti runtime usability. | `relgeo/flutter`; P06, P10 | CATALOG-VERIFIED |
| CANVAS-02 | Sheet/view selector | U3 dapat berpindah antara model dan sheet/view yang relevan. | P06 sheet/view selector; W02 preview target. | In scope; component target belum menjadi implicit scope. | `relgeo/flutter`; P06, W02 | CATALOG-VERIFIED |
| CANVAS-03 | Inspector | U3 dapat memeriksa object/geometry/constraint information dari scene aktif. | P06 inspector; P10 inspector smoke. | In scope; nilai harus mengikuti resolved scene/diagnostic contract. | `relgeo/flutter`; P06, P10, DSL | CATALOG-VERIFIED |
| CANVAS-04 | Parameters panel | U3 dapat mengubah parameter hanya ketika dokumen memiliki parameter editable. | W02 conditional Parameters panel. | In scope conditional; panel kosong tidak ditampilkan dan layout tidak rusak. | `relgeo/flutter`; W02, DSL | CATALOG-VERIFIED |
| CANVAS-05 | Dependency graph | U3 dapat memahami relasi/dependency object pada dokumen. | P06 graph/resolver capability; P10 graph smoke. | In scope untuk graph yang dapat diturunkan dari DSL; detail visual adalah Flutter-specific. | `relgeo/flutter`; P06, P10, DSL | CATALOG-VERIFIED |
| CANVAS-06 | Role filter and overlays | U3 dapat menyaring role serta mengatur anchor/label/bounds/diagnostic overlays. | P06 role filter/diagnostics; W01 canvas behavior preset. | In scope sebagai presentation control; bukan perubahan semantic scene. | `relgeo/flutter`; P06, W01 | CATALOG-VERIFIED |
| VIEW-01 | Zoom | U4 dapat memperbesar/memperkecil viewport dengan status yang terlihat. | P10 zoom smoke; W02 View command. | In scope; shortcut/menu mapping harus konsisten lintas platform. | `relgeo/flutter`; P10, W02 | CATALOG-VERIFIED |
| VIEW-02 | Pan | U4 dapat menggeser viewport tanpa mengubah dokumen. | P06 viewport; W02 View/viewport interaction. | In scope; transform state terpisah dari document state. | `relgeo/flutter`; P06, W02 | CATALOG-VERIFIED |
| VIEW-03 | Fit to content | U4 dapat menyesuaikan viewport ke content/visible scene. | W02 viewport toolbar; P10 render/navigation smoke. | In scope; fit policy dan visible bounds harus eksplisit. | `relgeo/flutter`; W02, P10 | CATALOG-VERIFIED |
| VIEW-04 | Reset viewport | U4 dapat kembali ke viewport baseline tanpa mengubah source/selection. | P10 reset viewport smoke; W02 View command. | In scope; reset hanya transform/viewport state. | `relgeo/flutter`; P10, W02 | CATALOG-VERIFIED |
| VIEW-05 | Selection and selected-state | U3/U4 dapat memilih object dan melihat selected state yang konsisten di canvas, inspector, dan overlay. | Goal brief selection; W01 selection tokens; P06 Canvas interaction. | In scope; selection bukan bagian dari persisted layout atau source DSL. | `relgeo/flutter`; W01, W02 | CATALOG-VERIFIED |

### 2.4 Workbench layout, theme, preferences, dan persistence

| ID | Capability expected | User outcome | Requirement basis | Scope decision | Owner / source of truth | Verifikasi katalog |
| --- | --- | --- | --- | --- | --- | --- |
| LAYOUT-01 | Panel visibility | U4 dapat show/hide Code Editor, Preview, Inspector, Parameters melalui View → Panels. | W02 panel lifecycle/menu. | In scope; hidden mempertahankan placement dan bounds. | `relgeo/flutter`; W02 | CATALOG-VERIFIED |
| LAYOUT-02 | Dock and undock | U4 dapat memindahkan panel ke region dock yang dipilih. | W02 docking; W03 recursive dock tree. | In scope; drop preview harus jelas dan invalid drop aman. | `relgeo/flutter`; W02, W03 | CATALOG-VERIFIED |
| LAYOUT-03 | Floating move and resize | U4 dapat mengambangkan, memindahkan, dan mengubah ukuran panel tanpa kehilangan kontrol. | W02 floating panel; W03 drag/drop/resize. | In scope; native pointer/runtime evidence terpisah. | `relgeo/flutter`; W02, W03, P10 | CATALOG-VERIFIED |
| LAYOUT-04 | Workbench profiles | U4 dapat memilih Standard, Writing, Preview, Inspect, dan Minimal untuk tujuan kerja berbeda. | W02 preset profiles. | In scope; profile adalah layout snapshot, bukan theme atau document. | `relgeo/flutter`; W02 | CATALOG-VERIFIED |
| LAYOUT-05 | Reset layout | U4 dapat mengembalikan layout/profile ke baseline aman. | W02 reset layout/reset profiles. | In scope; fallback corruption ke Standard. | `relgeo/flutter`; W02, W03 | CATALOG-VERIFIED |
| LAYOUT-06 | Layout persistence | Susunan panel, profile, bounds, dan visibility pulih setelah restart. | W02 autosave; W03 durable tree snapshot/restore. | In scope; schema versioned, debounce, flush, dan corruption fallback wajib. | `relgeo/flutter`; W02, W03 | CATALOG-VERIFIED |
| LAYOUT-07 | Responsive compact/wide layout | Workbench tetap usable pada ukuran sempit dan lebar tanpa overflow atau panel hilang. | W01 window/layout contract; P10 resize smoke. | In scope; target minimum `1024×640`, default mendekati `1440×900`. | `relgeo/flutter`; W01, P10 | CATALOG-VERIFIED |
| THEME-01 | Follow system appearance | Instalasi baru mengikuti brightness OS dan berubah saat OS berubah sebelum override dipilih. | W01 ThemeMode contract; P10 theme smoke. | In scope; internal `system`, bukan pilihan toggle ketiga. | `relgeo/flutter`; W01, P10 | CATALOG-VERIFIED |
| THEME-02 | Light/dark override | U4 dapat memilih Light atau Dark tanpa restart dan melihat chrome konsisten. | W01 application theme and toggle. | In scope; override disimpan sebagai `light`/`dark`. | `relgeo/flutter`; W01 | CATALOG-VERIFIED |
| THEME-03 | Reset to system appearance | U4 dapat menghapus override dan kembali mengikuti system. | W01 reset appearance; W02 Appearance command. | In scope; reset tidak menghapus canvas/profile/layout lain. | `relgeo/flutter`; W01, W02 | CATALOG-VERIFIED |
| THEME-04 | Canvas appearance separation | Canvas CAD/Blueprint/Paper dan app theme dapat dikelola tanpa coupling yang mengejutkan. | W01 three visual layers/canvas profiles. | In scope; canvas appearance bukan app theme dan tidak mengubah semantic scene. | `relgeo/flutter`; W01 | CATALOG-VERIFIED |
| PREF-01 | User preferences | Preference theme, canvas, behavior, layout, dan relevant workbench options tersimpan dengan namespace terpisah. | W01 preferences; W02 persistence boundary. | In scope; preference tidak menyimpan source, parameter, selection, atau compile result. | `relgeo/flutter`; W01, W02 | CATALOG-VERIFIED |
| PREF-02 | Preference reset and safe fallback | User dapat reset preference/layout dan aplikasi pulih ke default saat schema rusak/lebih baru. | W02 reset/fallback policy; W01 reset appearance. | In scope; reset terpisah per domain dan global reset harus terdefinisi. | `relgeo/flutter`; W01, W02 | CATALOG-VERIFIED |

### 2.5 Command, keyboard, accessibility, dan window lifecycle

| ID | Capability expected | User outcome | Requirement basis | Scope decision | Owner / source of truth | Verifikasi katalog |
| --- | --- | --- | --- | --- | --- | --- |
| CMD-01 | Shared command registry | Menu, toolbar, context menu, dan shortcut memanggil command yang sama dengan enabled/checked state yang konsisten. | W01 command registry; W02 command surface. | In scope; callback terpisah yang menggandakan operasi bukan contract target. | `relgeo/flutter`; W01, W02 | CATALOG-VERIFIED |
| CMD-02 | Menu bar and command navigation | U4 dapat menemukan File, Edit, View, Appearance, Document, Workbench, dan Help commands. | W01 menu/chrome; W02 menu structure. | In scope; File menjadi menu pertama dan native macOS adapter memakai registry sama. | `relgeo/flutter`; W01, W02, P10 | CATALOG-VERIFIED |
| CMD-03 | Keyboard shortcuts | U4 dapat menjalankan command utama melalui shortcut desktop yang terlihat dan tidak konflik. | W01 shortcut/menu boundary; W02 keyboard command surface. | In scope; exact shortcut map harus dikunci pada audit per OS. | `relgeo/flutter`; W01, W02 | CATALOG-VERIFIED (map-open) |
| A11Y-01 | Keyboard focus and traversal | U4 dapat mencapai dan mengaktifkan kontrol dengan Tab, Enter, Space, arrow keys, dan Escape sesuai konteks. | P10 accessibility; W02 keyboard traversal. | In scope macOS/Linux/Windows; full native traversal belum dianggap terbukti dari unit test. | `relgeo/flutter`; P10, W02 | CATALOG-VERIFIED |
| A11Y-02 | Semantics labels, values, and states | Screen reader/accessibility tree dapat membaca role, label, value, checked state, focus, panel, theme, filter, dan control status. | P10 accessibility; W01 theme labels; W02 semantics. | In scope; limitation AT harus dipisahkan dari failure fungsional. | `relgeo/flutter`; P10, W01, W02 | CATALOG-VERIFIED |
| A11Y-03 | Reduced motion and non-decorative focus | Pengguna yang mengurangi motion tidak dipaksa menerima transisi yang tidak perlu dan focus tidak masuk dekorasi. | P10 reduced-motion/focus checks. | In scope untuk desktop smoke; policy animation detail dapat dipersempit saat audit. | `relgeo/flutter`; P10 | CATALOG-VERIFIED |
| WINDOW-01 | Window lifecycle | Close/Quit aplikasi menjalankan dirty guard dan dapat menutup bersih tanpa crash. | W02 native lifecycle bridge; P10 clean exit. | In scope desktop; host runner/native event evidence wajib terpisah. | `relgeo/flutter`; W02, P10 | CATALOG-VERIFIED |
| WINDOW-02 | Window size and resize policy | Window memiliki ukuran awal/minimum yang masuk akal dan resize tidak merusak panel. | W01 window contract; P10 window checks. | In scope; minimum `1024×640`, default sekitar `1440×900`. | `relgeo/flutter`; W01, P10 | CATALOG-VERIFIED |
| WINDOW-03 | Native title bar and platform window controls | Workbench memakai native OS chrome dan tetap usable pada multi-monitor/HiDPI/window controls. | W01 title-bar decision; P10 platform smoke. | In scope as current boundary; custom title bar ditunda. | `relgeo/flutter`; W01, P10, D09 | CATALOG-VERIFIED |

### 2.6 Export dan platform delivery

| ID | Capability expected | User outcome | Requirement basis | Scope decision | Owner / source of truth | Verifikasi katalog |
| --- | --- | --- | --- | --- | --- | --- |
| EXPORT-01 | Export SVG model | U3 dapat mengekspor model ke SVG melalui File → Export → SVG → Model. | W02 File menu/export; P06 SVG exporter; P10 export smoke. | In scope; file destination via native picker/service. | `relgeo/flutter`; W02, P06, P10 | CATALOG-VERIFIED |
| EXPORT-02 | Export SVG sheet/view | U3 dapat mengekspor sheet/view aktif ke SVG tanpa tombol export tersembunyi yang hanya ada di Preview. | W02 export target Model/Sheet View. | In scope; target context harus eksplisit. | `relgeo/flutter`; W02, P06 | CATALOG-VERIFIED |
| PLAT-01 | macOS desktop delivery | U5 memperoleh app yang dapat dibangun pada stable Flutter/Dart baseline dan diuji pada macOS arm64/universal artifact. | P10 macOS provenance/smoke; MAC ARM64 build evidence; D09 desktop scope. | In scope; build/artifact evidence bukan runtime usability evidence. | `relgeo/flutter`; P10, MAC, D09 | CATALOG-VERIFIED |
| PLAT-02 | Ubuntu/Linux desktop delivery | U5 memperoleh artifact Linux yang dapat diekstrak, dijalankan, dan diuji pada target session Wayland/X11. | P10 Ubuntu/Linux checklist; D09 platform scope. | In scope; target host smoke masih required. | `relgeo/flutter`; P10, D09 | CATALOG-VERIFIED |
| PLAT-03 | Windows 11 desktop delivery | U5 memperoleh ZIP dengan `.exe`, DLL, dan `data` yang dapat dijalankan pada Windows 11. | P10 Windows checklist; D09 Windows artifact path. | In scope; ZIP dulu, installer/signing hanya setelah smoke target lulus. | `relgeo/flutter`; P10, D09 | CATALOG-VERIFIED |
| PLAT-04 | Reproducible artifact provenance | Setiap artifact menyebut workspace/Flutter commit, SDK, OS, architecture, run, dan tanggal sehingga status dapat ditelusuri. | MP evidence rules; P10 provenance matrix; MAC verification record. | In scope untuk CI/release evidence; tidak sama dengan publish commitment. | `relgeo/workspace`; MP, P10, MAC | CATALOG-VERIFIED |

## 3. Explicit scope boundaries (bukan gap implementasi aktif)

| Boundary ID | Item | Keputusan scope | Dampak pada audit |
| --- | --- | --- | --- |
| SCOPE-01 | Android/iOS delivery dan mobile assistive technology | Ditunda tanpa tanggal sampai desktop/web/CLI matang. | Jangan menandai mobile sebagai missing desktop capability atau blocker desktop. |
| SCOPE-02 | Custom title bar ala VSCode/ChatGPT Desktop | Ditunda; native OS title bar adalah boundary saat ini. | Audit hanya memeriksa native chrome/window controls. |
| SCOPE-03 | Raw SVG byte equality dan full presentation parity | Non-goal; semantic core wajib, presentation hanya bila consumer nyata membutuhkannya. | Jangan membuat whitespace, attribute order, viewBox/style yang belum disepakati menjadi gap contract. |
| SCOPE-04 | pub.dev package dan signed desktop distribution | Flutter tetap non-publishable; build macOS adalah CI confidence gate. | Audit platform delivery memeriksa artifact/build/provenance sesuai scope, bukan release signing. |
| SCOPE-05 | Full promotion seluruh DSL/boolean/evaluator surface | Capability aktif hanya pada boundary contract/fixture yang telah diputuskan. | Jangan mengubah implementation support parsial menjadi expected active contract tanpa decision record. |

## 4. Audit handoff

Sesudah katalog ini mendapat review manusia, audit berikutnya harus membuat satu
baris evidence untuk setiap ID di atas dengan field minimal:

Audit yang sudah dijalankan untuk checkout saat ini tersedia di
[Flutter Workbench Implementation Gap Map](../capability-map/flutter-workbench/implementation-gap-map.md).

`implementation status`, `verification status`, `evidence/revision`, `observed behavior`, `gap`, `severity`, dan `follow-up owner`.

Audit tidak boleh menghapus baris expected hanya karena kode belum ada. Jika
requirement berubah, perubahan harus dicatat sebagai keputusan scope baru dan
versi katalog berikutnya; jika implementasi belum ada, statusnya adalah gap.

### 4.1 Open policy questions yang tidak menghalangi kelengkapan katalog

Katalog sudah lengkap walaupun beberapa detail acceptance masih perlu diputuskan
sebelum audit runtime:

- retention, consent, dan recovery UX untuk DOC-08;
- extension/filter import untuk IO-02;
- exact shortcut map per macOS/Linux/Windows untuk CMD-03;
- toleransi dan semantics selection lintas canvas/inspector untuk VIEW-05;
- platform screen-reader matrix dan reduced-motion test protocol untuk A11Y.

Pertanyaan ini adalah detail verifikasi, bukan alasan untuk menghilangkan
capability dari expected baseline.
