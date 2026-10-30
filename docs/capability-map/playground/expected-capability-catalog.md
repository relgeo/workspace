# Playground expected capability catalog

**Status:** expected baseline; prerequisite for implementation audit  
**Surface:** `relgeo/playground`, browser IDE publik ringan  
**Catalog date:** 2026-10-30  
**Owner keputusan:** Agus Made  
**Compatibility line:** RelGeo DSL v0.5.x

## 1. Tujuan dan aturan pembacaan

Dokumen ini menetapkan **apa yang diharapkan pengguna dapat lakukan** pada
Playground sebelum ada perbandingan dengan implementasi. Capability yang belum
pernah dibuat tetap dicatat bila expectation-nya dapat ditelusuri ke task brief,
workflow produk, roadmap/plan yang disetujui, kontrak DSL, atau keputusan scope.

Katalog ini disusun dari sumber requirement dan keputusan berikut, bukan dari
source code, test, atau matrix lama:

| Ref | Requirement / decision source | Peran dalam katalog |
| --- | --- | --- |
| S1 | `README.md` | boundary workspace dan posisi Playground sebagai repository product |
| S1a | `docs/REPOSITORY-MAP.md` | pemetaan `playground/` → `relgeo/playground`, ownership, inventory boundary, dan aturan bahwa catalog mendahului implementation audit |
| S2 | `docs/MATURATION-MASTER-PLAN.md` | owner Playground, public-surface boundary, compatibility line, roadmap/tahap, dan delivery guardrail |
| S3 | `docs/plans/05-public-docs-and-playground-hardening.md` | public workflow, UX, responsive, accessibility, recovery, delivery expectations |
| S4 | `playground/docs/README.md` | positioning browser IDE, editor → resolve → preview → inspect, non-goals |
| S5 | `playground/docs/LOCAL-FILE-WORKSPACE-PLAN.md` | My Files, examples, file operations, IndexedDB, autosave, backup, share semantics |
| S6 | `playground/docs/UX-UI-AUDIT-AND-PLAN.md` | target user journey, viewport/interaction model, keyboard, selection, inspection, menus, feedback |
| S7 | `spec/id/README.md` dan bab normatif `spec/id/core/`, `syntax/`, `geometry/`, `presentation/` | DSL v0.5 contract yang harus menjadi authority untuk authoring/resolve |
| S8 | `docs/decisions/07-cross-repo-open-decisions.md` | keputusan desktop/web/CLI aktif dan mobile/AT yang deferred |
| S9 | task brief SuClos ini | scope minimum eksplisit, termasuk capability yang wajib menjadi row terpisah |

`docs/capability-map/INVENTORY-PROTOCOL.md` dipakai hanya sebagai aturan
pelaporan: family, pemisahan scope, owner, dan status evidence. Ia bukan sumber
daftar capability.

**Verification rule untuk seluruh row di bawah:** `not verified — expected-only`.
Belum ada implementation audit pada task ini. Status tersebut tidak berarti
capability gagal atau tidak ada; pemeriksaan source, test, browser, CI, dan
public artifact dilakukan pada task audit setelah katalog ini disepakati.

Katalog tetap memuat kewajiban yang belum dibuat, ditunda, atau masih menunggu
keputusan rinci. Contohnya adalah workspace backup/restore (`PG-PERSIST-003`),
mode/default/persistensi theme (`PG-THEME-001`), key map shortcut (`PG-KEY-001`),
dan evidence native assistive technology (`PG-A11Y-001`). Row tersebut tidak
boleh dihapus hanya karena implementation audit berikutnya belum menemukan
symbol, test, atau runtime evidence.

### 1.1 Crosswalk sumber wajib → isi katalog

| Input requirement | Evidence yang dibaca | Bagian/row yang dihasilkan |
| --- | --- | --- |
| Surface boundary dan ownership | `playground/`, `docs/REPOSITORY-MAP.md` | Surface header, S1a, owner/source-of-truth pada setiap row |
| Target users | `playground/docs/README.md`, `playground/docs/UX-UI-AUDIT-AND-PLAN.md`, `docs/plans/05-public-docs-and-playground-hardening.md` | §2 target user: learner, RelGeo author, reviewer/maintainer |
| User journeys | `playground/docs/UX-UI-AUDIT-AND-PLAN.md` dan `playground/docs/LOCAL-FILE-WORKSPACE-PLAN.md` | J1–J8 dan linked capability IDs |
| Workflows | `playground/docs/README.md`, `playground/docs/LOCAL-FILE-WORKSPACE-PLAN.md`, `docs/MATURATION-MASTER-PLAN.md` | authoring, local file, viewport, inspect, share, failure/recovery rows |
| Menus/commands | S6 action hierarchy dan keyboard sweep; S5 file actions; §1.2 di bawah | C01–C07 dan `PG-KEY-001` |
| Roadmap/maturation | `docs/MATURATION-MASTER-PLAN.md` Tahap 2/4/5 dan `docs/plans/05-public-docs-and-playground-hardening.md` | compatibility, public delivery, accessibility limitations, optional/deferred scope |
| Contracts | `spec/id/`, S5 persistence model, S6 camera/interaction contract | `PG-DSL-001`, diagnostics, file/persistence, viewport, selection, accessibility rows |
| Scope decisions | S8 dan §3 | in/out-of-scope column, deferred native/device evidence, non-goals |

### 1.2 Expected menu and command surface

Ini adalah daftar aksi yang harus dapat ditemukan melalui menu, toolbar,
accessible control, atau documented keyboard command. Nama UI final boleh
berubah pada implementation audit, tetapi outcome dan capability ID tetap.

| Command group | Expected actions | Catalog rows |
| --- | --- | --- |
| C01 — Workspace | New, Open My File, Open Example, switch active document | `PG-FILE-001`, `PG-FILE-002`, `PG-EXAMPLE-001` |
| C02 — File | Save/autosave, Save as, Rename, Duplicate, Delete, Import, Export/download | `PG-FILE-003`–`PG-FILE-007`, `PG-PERSIST-001`–`PG-PERSIST-003` |
| C03 — Viewport | Zoom in/out, Pan, Fit, Recenter, Reset viewport, Sheet/View, Source/Both/Preview | `PG-CANVAS-002`–`PG-CANVAS-006` |
| C04 — Inspect | Select object, open Inspector, filter/focus Graph, jump back to source/preview | `PG-SELECT-001`, `PG-INSPECT-001`, `PG-INSPECT-002` |
| C05 — Share | Copy/share URL, Save shared source as My File, recover invalid/oversize share | `PG-SHARE-001`, `PG-SHARE-002` |
| C06 — Access | Theme control, surface/drawer switch, keyboard traversal, reduced-motion and non-gesture alternatives | `PG-THEME-001`, `PG-RESP-001`, `PG-KEY-001`, `PG-A11Y-001`, `PG-A11Y-002` |
| C07 — Recovery | Read diagnostics, go to first error, reset/restore, observe loading/storage/resolve/export/share state | `PG-LIFE-002`, `PG-LIFE-004`, `PG-DIAG-001`, `PG-DIAG-002` |

## 2. Target pengguna dan journey yang harus dilayani

Target pengguna baseline adalah:

1. **first-time visitor/learner** yang perlu melihat contoh bekerja tanpa
   memahami seluruh DSL terlebih dahulu;
2. **RelGeo author** yang menulis dan mengiterasi source DSL secara interaktif;
3. **reviewer/maintainer** yang perlu membaca diagnostics, hubungan object, dan
   hasil visual tanpa berpindah ke tool lain.

Journey produk yang menjadi kerangka katalog:

| Journey | Expected outcome |
| --- | --- |
| J1 — First use | Pengguna membuka Playground, memilih atau membuat source valid, lalu melihat status siap dan preview yang ter-fit. |
| J2 — Authoring loop | Pengguna membaca/mengedit source, resolve berjalan, hasil valid terlihat, dan source invalid memberi diagnostics yang dapat dipulihkan. |
| J3 — Inspect and explain | Pengguna memilih object, mengikuti hubungan source/preview/inspector/graph, dan membaca parameter/layer/value yang relevan. |
| J4 — Local file loop | Pengguna membuat, membuka, menyimpan, menyimpan sebagai file lain, mengimpor, mengekspor, dan memulihkan file lokal. |
| J5 — Viewport loop | Pengguna dapat melihat keseluruhan scene, zoom, pan, fit/recenter, reset, serta berpindah sheet/view/surface. |
| J6 — Share loop | Pengguna membagikan source melalui URL/copy dengan feedback yang jujur dan dapat menyimpannya sebagai file pribadi tanpa menimpa file lokal. |
| J7 — Device/access loop | Pengguna memakai alur utama pada layout responsif dan melalui keyboard serta accessibility semantics. |
| J8 — Failure/recovery loop | Loading, resolving, storage, share, dan runtime failure memiliki state yang terlihat, actionable, dan tidak menyamarkan kehilangan data. |

## 3. Keputusan scope yang mengikat katalog

| Keputusan | Scope decision |
| --- | --- |
| Product posture | **In scope:** lightweight browser IDE untuk `source → resolve → preview → inspect`; bukan replika Flutter workbench. |
| DSL authority | **Boundary only:** Playground mengonsumsi dan mempresentasikan RelGeo DSL v0.5; makna grammar/semantics tetap milik `spec/id/`. |
| File model | **In scope:** My Files lokal, Examples read-only, active document, source file exchange, dan local persistence. |
| Persistence boundary | **In scope:** browser-local durable persistence dan backup/restore. **Out of scope:** account, cloud sync, server storage, realtime collaboration, project management, folder hierarchy. |
| Export meaning | **In scope:** export/download source DSL (`.yaml`). Raw SVG/print-workbench export bukan baseline Playground dan membutuhkan keputusan terpisah bila ingin dipromosikan. |
| Share meaning | **In scope:** URL/hash share sebagai transient source sampai pengguna memilih save; tidak boleh diam-diam menimpa active local file. |
| Viewport meaning | **In scope:** model-preview viewport untuk authoring/inspection. Sheet/view preview boleh ada sebagai surface baca, tetapi Playground bukan print workbench penuh. |
| Theme | **In scope sebagai capability user-visible**. Mode tepat (mis. light/dark/system), default, dan persistensi preference perlu ditetapkan sebelum implementation audit ditutup. |
| Keyboard | **In scope sebagai command surface.** Exact shortcut bindings belum ditentukan oleh source requirement; aksi utama tetap harus tersedia lewat keyboard dan menu/accessible controls. |
| Responsive/mobile | Responsive browser layout dan surface switch/drawer termasuk scope aktif. Physical Android/iOS touch, TalkBack, iOS VoiceOver, dan Safari mobile tetap deferred tanpa tanggal sesuai S8. |
| Accessibility | Keyboard/DOM/AX semantics, focus, state announcement, reduced motion, dan target control termasuk expected baseline. Native screen-reader/device evidence adalah verification follow-up, bukan alasan menghapus row. |
| Delivery | Hosted `/playground/` dan consistency antara artifact yang diuji dan yang dipublikasikan adalah delivery guardrail; bukan pengganti capability runtime. |

## 4. Expected capability catalog

Kolom `Requirement basis` merujuk ke sumber S1–S9 di §1. `Owner / source of
truth` memisahkan pemilik boundary dari authority requirement. `Verification
status` sengaja sama untuk semua row sampai implementation audit dimulai.

| ID | Family | Expected capability / user outcome | Requirement basis | Scope decision | Owner / source of truth | Verification status |
| --- | --- | --- | --- | --- | --- | --- |
| PG-LIFE-001 | Authoring and UX | **Open Playground session:** pengguna dapat masuk ke browser IDE dari public Playground entrypoint dan mendapatkan workspace yang dapat dipakai. | S2, S3, S4, S9 | In scope; public route adalah delivery prerequisite. | Owner: `relgeo/playground`; route/delivery: `relgeo/relgeo.github.io`; source: S3/S4. | `not verified — expected-only` |
| PG-LIFE-002 | Authoring and UX | **Loading/startup state:** pengguna tahu apakah app, workspace, example, atau resolver masih loading dan kapan siap berinteraksi. | S3, S5, S9 | In scope; loading tidak boleh tampak seperti empty/error tanpa penjelasan. | Owner: `relgeo/playground`; source: S3/S5 lifecycle decisions. | `not verified — expected-only` |
| PG-LIFE-003 | Authoring and UX | **Product lifecycle:** state `editing → resolving → ready/inspecting → exporting` terlihat dan transisinya tidak kehilangan source atau selection. | S3, S5, S6, S9 | In scope sebagai lifecycle UI; bukan lifecycle desktop/native. | Owner: `relgeo/playground`; source: S3 workstream D, S5 autosave state, S6 journey. | `not verified — expected-only` |
| PG-LIFE-004 | Authoring and UX | **Failure/recovery state:** loading, parse/resolve, storage, share, clipboard, dan export failure memiliki pesan, fallback, dan action pemulihan yang berbeda. | S3, S5, S6, S9 | In scope; environment-unavailable nanti dilaporkan sebagai not verified, bukan product failure. | Owner: `relgeo/playground`; source: S3 recovery principles, S5 fallback, S6 feedback contract. | `not verified — expected-only` |
| PG-EDIT-001 | Authoring and UX | **RelGeo source editor:** pengguna dapat membaca, mengedit, dan mempertahankan cursor/selection pada source DSL. | S4, S6, S7, S9 | In scope; source adalah pusat authoring. | Owner: `relgeo/playground`; DSL authority: `relgeo/spec`; source: S4/S6/S7. | `not verified — expected-only` |
| PG-DSL-001 | Contract | **Resolve against DSL v0.5:** source diedit dan diproses mengikuti kontrak normatif active line, bukan kontrak buatan Playground. | S2, S4, S7, S9 | Boundary only untuk semantics; Playground menyediakan consumer workflow. | Owner: `relgeo/playground` consumer; source of truth: `relgeo/spec/id/` v0.5. | `not verified — expected-only` |
| PG-DIAG-001 | Semantic runtime | **Diagnostics:** syntax, semantic, dan runtime diagnostics dapat dibaca dengan code/message/location yang actionable. | S3, S4, S6, S7, S9 | In scope pada UI; diagnostic semantics didelegasikan ke core/language-service/spec. | Owner: Playground UI; source: `relgeo/spec`, `core`, `language-service`, S3/S6. | `not verified — expected-only` |
| PG-DIAG-002 | Authoring and UX | **Error navigation and valid-preview recovery:** pengguna dapat menuju error pertama/source target, memperbaiki source, reset/restore, dan tetap melihat preview valid terakhir bila sesuai kontrak. | S3, S6, S9 | In scope; fallback preview tidak boleh menyamarkan error aktif. | Owner: `relgeo/playground`; source: S3 workstream D, S6 error recovery. | `not verified — expected-only` |
| PG-FILE-001 | Persistence and interchange | **Create:** pengguna membuat file baru bernama aman dengan starter source yang valid atau template kosong yang dijelaskan. | S5, S9 | In scope; masuk ke My Files dan menjadi active document. | Owner: `relgeo/playground`; source: S5 §3/§7.2. | `not verified — expected-only` |
| PG-FILE-002 | Persistence and interchange | **Open:** pengguna membuka file My Files atau Example dan memperoleh identity/source yang benar. | S5, S6, S9 | In scope; Examples tetap read-only. | Owner: `relgeo/playground`; source: S5 mental model/file picker. | `not verified — expected-only` |
| PG-FILE-003 | Persistence and interchange | **Save:** pengguna menyimpan perubahan pada active My File dan dapat mengetahui kapan save selesai. | S5, S9 | In scope melalui local autosave/lifecycle; tidak ada server save. | Owner: `relgeo/playground`; source: S5 autosave and IndexedDB contract. | `not verified — expected-only` |
| PG-FILE-004 | Persistence and interchange | **Save as:** pengguna membuat salinan pribadi dari Example atau source transient tanpa menimpa origin. | S5, S6, S9 | In scope; required safety boundary for read-only/transient source. | Owner: `relgeo/playground`; source: S5 §4/§7.7. | `not verified — expected-only` |
| PG-FILE-005 | Persistence and interchange | **Import:** pengguna mengimpor source `.yaml`/`.yml` sebagai dokumen baru dengan validasi nama, ukuran, ekstensi, dan collision. | S5, S9 | In scope; import tidak mengganti active file secara diam-diam. | Owner: `relgeo/playground`; source: S5 §7.6. | `not verified — expected-only` |
| PG-FILE-006 | Persistence and interchange | **Export/download source:** pengguna mengunduh source active sebagai `.yaml`, termasuk saat resolve sedang error, dengan feedback sukses/gagal. | S5, S6, S9 | In scope untuk source DSL; SVG/print export out of baseline scope. | Owner: `relgeo/playground`; source: S5 §7.6 and S6 utility hierarchy. | `not verified — expected-only` |
| PG-FILE-007 | Persistence and interchange | **Manage files:** pengguna dapat rename, duplicate bila diperlukan oleh copy flow, dan delete My Files dengan confirmation serta safe post-delete selection. | S5, S9 | In scope; tidak ada delete/rename terhadap Example origin. | Owner: `relgeo/playground`; source: S5 boundary and file picker model. | `not verified — expected-only` |
| PG-EXAMPLE-001 | Authoring and UX | **Examples catalog:** pengguna dapat menemukan dan membuka example bawaan sebagai starting point yang diberi identity read-only. | S4, S5, S6, S9 | In scope; examples bukan source contract baru. | Owner: `relgeo/playground`; source: S4 core capabilities, S5 Examples model. | `not verified — expected-only` |
| PG-EXAMPLE-002 | Authoring and UX | **Example-to-file transition:** pengguna dapat mengedit Example tanpa menimpa bawaan dan mendapat jalur Save as My File yang jelas. | S5, S6, S9 | In scope; provenance originExampleKey boleh dipertahankan sebagai metadata. | Owner: `relgeo/playground`; source: S5 §4/data model. | `not verified — expected-only` |
| PG-PERSIST-001 | Persistence and interchange | **Durable local persistence:** active file, documents, content, metadata, dan active identity dapat dipulihkan setelah reload pada browser origin. | S5, S9 | In scope dengan IndexedDB sebagai canonical store; bukan cloud sync. | Owner: `relgeo/playground`; source: S5 §6 IndexedDB decision. | `not verified — expected-only` |
| PG-PERSIST-002 | Persistence and interchange | **Persistence lifecycle status:** UI membedakan dirty/modified, saving, saved locally, dan save error tanpa mengganggu editor/resolve/focus. | S5, S6, S9 | In scope; storage failure harus jujur dan mempertahankan memory session bila memungkinkan. | Owner: `relgeo/playground`; source: S5 §7.4/startup fallback. | `not verified — expected-only` |
| PG-PERSIST-003 | Persistence and interchange | **Workspace backup/restore:** pengguna dapat export/import JSON workspace versioned dan mendapat validation/confirmation/recovery sebelum replacement. | S5, S9 | In scope sebagai portability/recovery; backup tidak memuat credential/build/browser state. | Owner: `relgeo/playground`; source: S5 §6–§7.8. | `not verified — expected-only` |
| PG-CANVAS-001 | Geometry/rendering | **Live canvas/preview:** pengguna melihat projection visual dari resolved RelGeo source dan dapat membedakan model-preview dari editor. | S3, S4, S6, S7, S9 | In scope; renderer/semantic geometry tetap memiliki owner package masing-masing. | Owner: Playground consumer; source: `renderer-svg`, `core`, `spec`, S3/S4. | `not verified — expected-only` |
| PG-CANVAS-002 | Geometry/rendering | **Zoom viewport:** pengguna memperbesar atau memperkecil canvas dengan control yang dapat dipahami dan batas yang aman. | S4, S6, S9 | In scope sebagai screen viewport zoom, bukan perubahan model/DSL. | Owner: `relgeo/playground`; source: S4 preview semantics, S6 camera contract. | `not verified — expected-only` |
| PG-CANVAS-003 | Geometry/rendering | **Pan viewport:** pengguna menggeser scene pada canvas dengan pointer/touch contract dan alternative non-gesture control. | S3, S6, S8, S9 | In scope pada browser; physical touch evidence deferred sesuai S8. | Owner: `relgeo/playground`; source: S3 gesture contract, S6 U12, S8 mobile decision. | `not verified — expected-only` |
| PG-CANVAS-004 | Geometry/rendering | **Fit/recenter:** pengguna dapat menampilkan bounding box/scene relevan secara utuh atau memusatkannya kembali setelah resolve, resize, atau sheet change. | S3, S6, S9 | In scope; fit dan recenter adalah capability berbeda walau dapat berbagi control group. | Owner: `relgeo/playground`; source: S3 first-run baseline, S6 U01/camera-fit. | `not verified — expected-only` |
| PG-CANVAS-005 | Geometry/rendering | **Reset viewport:** pengguna dapat kembali ke camera/zoom baseline yang deterministik tanpa mengubah source atau file. | S3, S6, S9 | In scope sebagai viewport action; berbeda dari reset draft/example. | Owner: `relgeo/playground`; source: S3 reset flow, S6 camera contract. | `not verified — expected-only` |
| PG-CANVAS-006 | Authoring and UX | **View/sheet/surface selection:** pengguna dapat memilih sheet/view dan berpindah antara Both, Source, Preview serta model/physical presentation bila tersedia. | S3, S4, S6, S9 | In scope pada boundary preview; print-workbench parity tidak dijanjikan. | Owner: `relgeo/playground`; source: S3 baseline, S4 preview semantics, S6 user-flow table. | `not verified — expected-only` |
| PG-SELECT-001 | Authoring and UX | **Selection:** memilih object/anchor pada preview atau context surface memperbarui selected state dan hubungan yang relevan tanpa kehilangan single-selection focus. | S3, S6, S9 | In scope; selection identity mengikuti stable DSL object identity dari spec. | Owner: Playground UI; source: `spec/id/core/05-semantic-guarantees.md`, S3/S6 selection contract. | `not verified — expected-only` |
| PG-INSPECT-001 | Authoring and UX | **Inspector:** pengguna membaca geometry/object metadata, parameters, layers, values, dan BOM/context yang relevan terhadap selection. | S3, S4, S6, S9 | In scope sebagai optional context; bukan layar utama pengganti editor/preview. | Owner: `relgeo/playground`; source: S3/S4/S6 inspector expectations. | `not verified — expected-only` |
| PG-INSPECT-002 | Authoring and UX | **Graph/dependency navigation:** pengguna mencari, memfilter, memfokuskan, dan memilih dependency graph lalu kembali ke object/source/preview. | S3, S4, S6, S9 | In scope untuk graph navigation; graph zoom/minimap ditahan sebagai optional enhancement. | Owner: `relgeo/playground`; source: S3 workstream D, S6 U08/U10/U21. | `not verified — expected-only` |
| PG-THEME-001 | Platform and accessibility | **Theme:** pengguna dapat memakai theme yang menjaga keterbacaan editor, canvas, controls, diagnostics, focus, dan status. | S3 visual/accessibility principles, S6 visual system, S9 explicit scope | In scope; exact modes/default/preference persistence pending product decision. | Owner: `relgeo/playground`; source: S3/S6 visual rules; decision detail required. | `not verified — expected-only` |
| PG-RESP-001 | Platform and accessibility | **Responsive layout:** layout tetap usable pada desktop/tablet/handset; Source, Preview, sidebar/context, sheet, dan error state tetap reachable tanpa page-level overflow. | S3, S6, S8, S9 | In scope untuk browser responsive; physical handset validation deferred, bukan dihapus dari expectation. | Owner: `relgeo/playground`; source: S3 breakpoint matrix, S6 viewport contract, S8 decision. | `not verified — expected-only` |
| PG-KEY-001 | Platform and accessibility | **Keyboard command surface:** aksi utama—open/new/save/save as/import/export, surface switch, selection, fit/reset, diagnostics, drawer/panel, dan confirmation—dapat dijalankan via keyboard; shortcut bindings terdokumentasi bila ditetapkan. | S3, S5, S6, S9 | In scope; exact key map pending decision, tetapi mouse-only primary workflow out of scope. | Owner: `relgeo/playground`; source: S3 keyboard sweep, S5 keyboard file actions, S6 accessibility contract. | `not verified — expected-only` |
| PG-A11Y-001 | Platform and accessibility | **Accessibility semantics:** landmarks, names, roles, focus-visible, selected/expanded/pressed/value state, focus trap/return, error announcement, and source/preview navigation are exposed to assistive technology. | S3, S6, S8, S9 | In scope for web semantics; native VoiceOver/TalkBack evidence deferred/verification follow-up. | Owner: `relgeo/playground`; source: S3 Workstream E, S6 acceptance, S8 QA decision. | `not verified — expected-only` |
| PG-A11Y-002 | Platform and accessibility | **Accessibility preferences and input tolerance:** reduced-motion fallback, usable contrast/focus, minimum control targets, and non-gesture alternatives exist for key actions. | S3, S6, S8, S9 | In scope for web baseline; device-specific validation remains separate evidence. | Owner: `relgeo/playground`; source: S3 visual/interaction rules, S6 U06/U12, S8 scope. | `not verified — expected-only` |
| PG-SHARE-001 | Persistence and interchange | **URL/share:** pengguna dapat copy/share source melalui URL/hash dengan feedback, clipboard fallback, dan batas payload yang jujur. | S3, S5, S6, S9 | In scope untuk source share; account/cloud collaboration out of scope. | Owner: `relgeo/playground`; source: S5 §7.7, S6 share/export contract. | `not verified — expected-only` |
| PG-SHARE-002 | Persistence and interchange | **Transient-share safety:** source dari share URL dibuka sebagai transient document dan hanya masuk My Files setelah explicit Save as; invalid/too-large hash memiliki recovery state yang berbeda dari parser error. | S5, S6, S9 | In scope; tidak boleh menimpa active local file tanpa confirmation. | Owner: `relgeo/playground`; source: S5 share semantics and S6 recovery rules. | `not verified — expected-only` |
| PG-DELIVERY-001 | Delivery and operations | **Public artifact consistency:** hosted `/playground/` menyajikan build Playground yang sama dengan artifact yang diuji, dengan route/title/asset/smoke contract yang dapat ditelusuri. | S2, S3, S8, S9 | Delivery guardrail in scope; bukan runtime capability pengganti row lain. | Owner: `relgeo/relgeo.github.io` delivery + `relgeo/playground` artifact; source: S2/S3 delivery sections. | `not verified — expected-only` |

## 5. Coverage checklist terhadap scope minimum

Checklist ini memastikan capability user-visible tidak digabung menjadi row
generik. Setiap item memiliki ID sendiri di §4:

| Scope minimum | Catalog row |
| --- | --- |
| Create | `PG-FILE-001` |
| Open | `PG-FILE-002` |
| Save | `PG-FILE-003` |
| Save as | `PG-FILE-004` |
| Import | `PG-FILE-005` |
| Export | `PG-FILE-006` |
| Editor | `PG-EDIT-001` |
| Canvas | `PG-CANVAS-001` |
| Zoom | `PG-CANVAS-002` |
| Pan | `PG-CANVAS-003` |
| Fit/recenter | `PG-CANVAS-004` |
| Reset viewport | `PG-CANVAS-005` |
| Theme | `PG-THEME-001` |
| Responsive layout | `PG-RESP-001` |
| Selection | `PG-SELECT-001` |
| Diagnostics | `PG-DIAG-001`, `PG-DIAG-002` |
| Examples | `PG-EXAMPLE-001`, `PG-EXAMPLE-002` |
| Persistence | `PG-PERSIST-001`, `PG-PERSIST-002`, `PG-PERSIST-003` |
| Keyboard/shortcut | `PG-KEY-001` |
| Accessibility | `PG-A11Y-001`, `PG-A11Y-002` |
| URL/share | `PG-SHARE-001`, `PG-SHARE-002` |
| Loading/error state | `PG-LIFE-002`, `PG-LIFE-004` |
| Lifecycle | `PG-LIFE-003` |

## 6. Handoff to implementation audit

Katalog ini selesai sebagai baseline expected. Tahap berikutnya boleh membuat
audit ID-by-ID, tetapi harus mempertahankan tiga hal berikut:

1. jangan menghapus row hanya karena source code atau test belum ditemukan;
2. pisahkan status implementation, evidence, parity, dan scope; `not verified`
   bukan sinonim `absent`;
3. jadikan `PG-DSL-001` boundary contract dan jangan memindahkan ownership
   semantics DSL dari `spec/id/` ke Playground.

Implementation audit berikutnya harus menggunakan katalog ini sebagai daftar
join satu-ke-satu dan boleh menambahkan evidence path, limitation, gap, serta
next action tanpa mengubah expectation secara diam-diam.
