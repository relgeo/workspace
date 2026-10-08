# RelGeo Maturation Master Plan

**Status:** master plan aktif — promotion boolean/intersection fixture 15 selesai; status direkonsiliasi 2026-10-09
**Tanggal baseline:** 2026-10-08
**Compatibility line saat ini:** RelGeo DSL 0.5.x  
**Pemilik keputusan:** Agus Made  
**Ruang lingkup:** seluruh repository publik RelGeo dan integrasinya sebagai satu ekosistem

## 0. Checkpoint evidence — 2026-10-08

Checkpoint ini memisahkan hasil yang benar-benar dijalankan pada workspace HEAD dari
evidence CI historis. Workspace HEAD adalah `d3ec2b0430f12bd95f2be312fa7438b6d97757d6`.
`docs/integration-baseline.json` sudah diregenerasi dari checkout aktual; seluruh 11
gitlink dan checkout submodule bersih, termasuk `playground@ecc1407` dan
`flutter@edc9488952db7edc74dd2caa7fc2064f03ff62f9`.

Dengan Node `24.21.0` dan pnpm `10.33.3`, hasil aktual checkpoint ini adalah:

- strict baseline: `81/81` lulus;
- compatibility checker: `283/283` lulus;
- shared conformance: `253/253` lulus pada 20 fixture;
- local integration runner pertama mencapai `33/36` stage lulus. Tiga failure adalah
  batas environment (purge install tanpa TTY, cache browser Playwright tidak dapat
  dibuat, dan sandbox menolak bind server `127.0.0.1:4173`), bukan failure package
  atau fixture. Rerun current setelah dependency tidak dapat dipulihkan dari registry
  menghasilkan report gap `6/35` (`.local/integration-local-current.json`), bukan
  local gate lulus;
- artefak replay Node `24.21.0` yang tersimpan di
  `.local/integration-local-node24-recovery.json` mencatat `33/36`; package,
  consumer, dan conformance lulus, sedangkan tiga failure yang tercatat adalah
  frozen install, Playwright Chromium, dan Playground E2E akibat batas environment;
- public-registry runner current menghasilkan report gap `2/11`
  (`.local/integration-public-current.json`) karena akses DNS ke
  `registry.npmjs.org` gagal. Evidence public-registry CI terakhir yang valid tetap
  `Integration #151` pada `workspace@21ee21b`.
- Evidence manual terbaru pada `.internal/tmp-test.txt`, dengan command yang sama
  pada Node `24.21.0` dan pnpm `10.33.3`, mencatat local integration `35/35` dan
  public-registry integration `50/50`; `PLAYWRIGHT_EXECUTABLE_PATH` menunjuk system
  Chrome. Transcript yang sama mencatat `flutter:conformance` lulus analyze dan 300
  test. Ini adalah manual workspace evidence, bukan CI canonical; evidence CI
  canonical terbaru tetap `Integration #151`.

Untuk Flutter pointer terbaru, child repository pada `edc9488` memiliki evidence
tertelusur di `flutter/docs/plans/03-docking-tree-and-drop-preview.md` (catatan
2026-10-07): 300 test, analyzer, web build, dan direct Xcode x86_64 Debug build.
Catatan tersebut bukan pengganti integration CI; tidak ada run CI baru yang menguji
pointer ini. `Integration #151` pada `workspace@21ee21b` dipertahankan sebagai evidence
CI historis untuk pointer workspace sebelum `edc9488`.

Replay command executor pada sesi 2026-10-08 tercatat pada
`.local/integration-local-node24-recovery.json` dengan `33/36` dan batas
environment. Transcript manual `.internal/tmp-test.txt` kemudian mencatat local
`35/35`, public `50/50`, dan Flutter conformance lulus pada toolchain yang diminta.
Evidence manual ini dapat dipakai untuk status workspace saat ini, tetapi tidak
mengubah status CI canonical: tidak ada run CI baru untuk pointer Flutter
`edc9488`, dan `Integration #151` adalah evidence CI historis terakhir sebelum
refresh canonical pada 2026-10-09.

Audit read-only 2026-10-09 tidak menemukan canonical evidence baru. Report
terbaru tetap local `33/36`, local-current `6/35`, dan public-current `2/11`;
hasil ini dicatat sebagai evidence gap eksternal, bukan defect source. Retry dari
executor terbatas dihentikan. Supporting `.internal/tmp-test.txt` tetap dipakai
untuk rekonsiliasi status manual, tanpa mengubah fixture 15 dari `capability`
atau `boolean-geometry` dari `partial`.

Checkpoint tersebut kini superseded oleh GitHub Actions run
[37832260326](https://github.com/relgeo/workspace/actions/runs/37832260326) pada
root commit `328c869b2ffe023806c8a85a9e9ccffa8f523145`. Run berstatus `Success`
dengan enam job lulus (`verify`, `public`, `flutter`, `flutter-macos`,
`flutter-linux`, `flutter-windows`) dan lima artifact. Evidence ini menutup gate
canonical lintas-platform untuk baseline tersebut. Fixture 15, capability matrix,
README/docs, dan evidence record kini telah disinkronkan untuk scope
boolean/intersection yang disetujui; evaluator/unit tetap candidate.

## 1. Tujuan dokumen

Dokumen ini adalah dokumen induk untuk mematangkan ekosistem RelGeo setelah pemisahan dari workspace lama menjadi multi-repository publik. Isinya bukan backlog harian dan bukan pengganti dokumentasi detail setiap repository.

Dokumen ini menjawab empat pertanyaan:

1. apa kondisi ekosistem saat ini;
2. peningkatan apa yang paling penting dan mengapa;
3. dalam urutan apa pekerjaan perlu dilakukan;
4. bukti apa yang harus tersedia sebelum suatu tahap dianggap selesai.

### Cara menggunakan dokumen ini

Pekerjaan tidak dilakukan dengan mengerjakan semua checklist sekaligus. Untuk setiap tahap:

1. pilih satu tahap yang statusnya Belum mulai atau Berjalan;
2. buat sub-rencana terpisah yang lebih detail untuk tahap tersebut;
3. implementasikan dan verifikasi sub-rencana itu pada repository pemiliknya;
4. tandai status tahap dan catat bukti, commit, tag, atau run workflow;
5. baru lanjut ke tahap berikutnya jika exit gate tahap tersebut terpenuhi.

Sub-rencana boleh disimpan di folder docs/plans/ pada repository relgeo/workspace. Nama yang disarankan:

~~~text
NN-short-stage-name.md
~~~

Contoh:

~~~text
01-cross-repo-integration-gate.md
02-contract-versioning.md
~~~

Sub-rencana menjelaskan pekerjaan operasional secara mendalam; dokumen ini tetap menjadi tempat urutan, keputusan, status, dan hubungan antar-tahap.

### Sub-rencana dan peta keputusan

Daftar berikut adalah indeks lengkap. `Aktif` berarti masih ada pekerjaan implementasi atau verifikasi; bukan berarti seluruh keputusan masih terbuka.

- [01 — Cross-Repo Integration Gate](./plans/01-cross-repo-integration-gate.md) — implementasi selesai; refresh CI setelah baseline terbaru masih menunggu.
- [02 — Contract Versioning](./plans/02-contract-versioning.md) — policy/guard selesai; skenario partial-release tidak dijalankan sengaja.
- [03 — Release dan npm Publishing Guard](./plans/03-npm-release-guard.md)
- [04 — Shared Conformance Fixtures](./plans/04-shared-conformance-fixtures.md) — infrastruktur fixture selesai; promotion dilacak terpisah.
- [05 — Public Docs dan Playground Hardening](./plans/05-public-docs-and-playground-hardening.md) — implementasi baseline selesai; accessibility runtime masih aktif.
- [06 — Flutter Alignment](./plans/06-flutter-alignment.md) — parsial; promotion dan platform smoke terpisah.
- [07 — Flutter Capability Promotion dan SVG Parity](./plans/07-flutter-capability-promotion-and-svg-parity.md)
- [08 — Desktop Platform Delivery](./plans/08-desktop-platform-delivery.md)
- [09 — Approved Decisions Execution Map](./plans/09-approved-decisions-execution-plan.md)
- [10 — Desktop Runtime Smoke Checklist](./plans/10-desktop-runtime-smoke-checklist.md)
- [11 — MCP Server dan Agent-Assisted RelGeo Authoring](./plans/11-mcp-agent-integration.md)
- [Flutter 02 — Workbench Layout dan Panel System](../flutter/docs/plans/02-workbench-layout-and-panel-system.md)

## 2. Keputusan dan prinsip yang tidak boleh berubah tanpa keputusan baru

### 2.1 Boundary repository

- relgeo/workspace adalah root orkestrasi publik dan hanya menyimpan catatan lintas-repo yang tipis, bootstrap, serta verification script.
- Folder produk/library di root workspace adalah submodule dan dokumentasi detailnya tetap tinggal di repository masing-masing.
- relgeo/spec adalah rumah kontrak normatif bahasa.
- relgeo/relgeo.github.io adalah presentation layer dan deployment website, bukan pemilik kontrak normatif.
- relgeo/playground adalah browser IDE publik.
- relgeo/flutter adalah workbench/aplikasi Flutter dan tidak boleh menjadi prasyarat untuk validasi runtime TypeScript.

### 2.2 Public-surface boundary

Semua yang berada di repository publik harus aman dibaca umum. Data pribadi, kredensial, catatan operator, log lokal, cache, dan eksperimen harus berada di luar tracked tree atau di direktori yang di-ignore secara eksplisit. Root workspace tidak boleh menjadi tempat menyimpan detail internal yang tidak diperlukan untuk orkestrasi publik.

### 2.3 Source of truth

- Spec menentukan kontrak bahasa.
- Implementasi harus diuji terhadap kontrak tersebut, bukan sebaliknya.
- README setiap package menjelaskan cara memakai package itu; root workspace hanya menjelaskan hubungan antar-repo.
- Website dapat mengambil dan merender spec, tetapi tidak menyalin atau mengubah makna normatifnya.
- Fixture conformance harus mempunyai owner dan provenance yang jelas.

### 2.4 Compatibility line

- Seluruh package publik yang mengikuti kontrak DSL saat ini berada pada line 0.5.x.
- Patch release dapat bergerak mandiri jika tidak mematahkan kontrak.
- Perubahan kontrak bahasa yang breaking memindahkan seluruh family package yang terdampak ke line berikutnya, misalnya 0.6.x.
- Tidak boleh ada package yang diam-diam memakai kontrak spec berbeda dari line yang dicantumkan pada metadata dan dokumentasinya.

### 2.5 Kriteria keputusan

Urutan prioritas ditentukan oleh:

1. reproducibility dari fresh clone;
2. konsistensi kontrak antar-layer;
3. keselamatan dan kejelasan public release;
4. kualitas pengalaman pengguna pada surface utama;
5. fitur baru.

Fitur baru tidak boleh mendahului perbaikan yang membuat baseline publik sulit dibangun, diuji, atau dipahami.

### 2.6 Standar diagram dokumentasi

Mermaid menjadi format default untuk diagram baru di seluruh dokumentasi RelGeo, mulai dari dokumen ini dan seterusnya.

Gunakan tipe yang paling sederhana dan sesuai:

- `flowchart` untuk dependency graph, arsitektur ringan, pipeline, dan decision flow;
- `sequenceDiagram` untuk interaksi antar-actor atau antar-layer berdasarkan urutan waktu;
- `stateDiagram-v2` untuk lifecycle dan state transition;
- `erDiagram` untuk relasi data atau model yang memang membutuhkan cardinality;
- `gantt` hanya untuk rencana yang benar-benar membutuhkan sumbu waktu.

Aturannya:

1. source Mermaid harus disimpan langsung di Markdown agar dapat direview dan diubah;
2. diagram harus mencerminkan source code, contract, atau keputusan yang nyata; jangan menambah node/edge hanya untuk membuatnya terlihat lengkap;
3. label yang memiliki karakter khusus harus dikutip dan node id harus sederhana;
4. jangan memakai screenshot statis jika Mermaid sudah cukup jelas;
5. format non-Mermaid hanya menjadi pengecualian jika diagram memerlukan bentuk visual yang sangat unik, anotasi bebas, atau fidelity desain yang tidak dapat diekspresikan dengan baik oleh Mermaid;
6. setiap pengecualian harus menjelaskan alasan singkat dan, jika berguna, tetap menyertakan diagram Mermaid ringkas sebagai peta tekstualnya.

Diagram tidak perlu dibuat di tool eksternal hanya untuk menghasilkan gambar. Tool visual dipakai bila kebutuhan memang melampaui diagram dokumentasi biasa.

Keputusan lintas-repo yang belum ditutup—promosi capability candidate, parity
SVG, desktop artifact QA, serta otomasi publish/recovery npm—
dicatat terpusat di [07-cross-repo-open-decisions.md](./decisions/07-cross-repo-open-decisions.md).
Rekomendasi operasional yang dipadatkan untuk persetujuan maintainer tersedia
di [09-open-work-recommendations.md](./decisions/09-open-work-recommendations.md).
Kedua dokumen itu menjadi rujukan sebelum sub-rencana implementasi berikutnya
dibuat.

## 2.7 Aturan membaca status

Setiap pekerjaan dinilai pada tiga sumbu terpisah:

| Sumbu | Status | Arti |
| --- | --- | --- |
| Implementasi | Selesai | deliverable/behavior yang diminta sudah diterapkan dan scope-nya terpenuhi |
| Implementasi | Parsial / berjalan | sebagian diterapkan; ada item in-scope yang belum |
| Implementasi | Belum mulai | belum ada implementasi yang dapat diverifikasi |
| Verifikasi | Terverifikasi | evidence menyebut revision dan scope yang diuji |
| Verifikasi | Menunggu evidence | implementasi mungkin ada, tetapi CI/perangkat/target belum diuji |
| Keputusan | Disetujui / menunggu keputusan | arah produk/kontrak sudah diterima atau masih membutuhkan pilihan maintainer |
| Prioritas | Ditunda sengaja | eksplisit di luar scope aktif; tidak memblokir exit gate dan tidak punya tanggal otomatis |
| Riwayat | Superseded | pernyataan lama dipertahankan sebagai sejarah, bukan status/aturan aktif |

`docs/integration-baseline.json` menunjuk revision yang akan dipakai sebagai
target gate; mengubah pointer atau `capturedAt` bukan bukti bahwa gate pada
revision itu sudah lulus. `Selesai` tidak berarti tidak akan pernah diuji lagi:
smoke pasca-rilis dan perawatan baseline adalah aktivitas berulang. Tanda `[ ]`
historis juga tidak otomatis berarti keputusan belum dibuat; beri label apakah
item itu pekerjaan aktif, evidence tertunda, atau scope yang sengaja ditunda.

## 3. Gambaran ekosistem saat ini

### 3.1 Repository dan peran

| Layer | Repository | Peran | Kondisi baseline |
| --- | --- | --- | --- |
| Contract | spec | kontrak normatif DSL | aktif pada 0.5, source utama saat ini di id/ |
| Runtime | geometry | matematika geometri 2D | package @relgeo/geometry@0.5.0 |
| Runtime | core | parse, resolve, dan semantic engine | package @relgeo/core@0.5.1 |
| Runtime | renderer-svg | render resolved geometry ke SVG | package @relgeo/renderer-svg@0.5.0 |
| Language | language-service | schema, token, diagnostics, completions | package @relgeo/language-service@0.5.1 |
| Markdown | remark-relgeo-hl | source highlighting pada fenced block | package @relgeo/remark-relgeo-hl@0.5.0 |
| Markdown | remark-relgeo | preview/embed pada Markdown | package @relgeo/remark-relgeo@0.5.0 |
| CLI | cli | command-line surface | package @relgeo/cli@0.5.0 |
| Product | playground | browser IDE publik | baseline publik, package private |
| Product | relgeo.github.io | website, docs, spec presentation, Pages deployment | deployment Pages aktif |
| Product | flutter | workbench Flutter non-publishable | desktop/web scope aktif; Android/iOS sengaja ditunda |
| Orchestration | workspace | submodule map, catatan, script lintas-repo | baseline publik aktif |

### 3.2 Dependency flow yang harus dijaga

~~~mermaid
flowchart TD
  spec["spec: language contract"] --> geometry["geometry: 2D math"]
  geometry --> core["core: parse and resolve"]
  core --> rendererSvg["renderer-svg: SVG renderer"]
  core --> languageService["language-service: diagnostics and completions"]
  core --> cli["cli: command-line surface"]
  rendererSvg --> playground["playground: browser IDE"]
  languageService --> playground
  rendererSvg --> remarkRelgeo["remark-relgeo: Markdown preview"]
  languageService --> remarkHl["remark-relgeo-hl: source highlighting"]
  remarkRelgeo --> website["relgeo.github.io: public docs"]
  remarkHl --> website
  spec --> website
~~~

Diagram ini adalah dependency konseptual, bukan izin untuk menaruh source repository lain ke dalam repository package. Build publik harus mengonsumsi package, tag, atau commit yang dapat direproduksi.

## 4. Baseline yang sudah tercapai

Status berikut menjadi titik awal, bukan pekerjaan yang harus diulang tanpa alasan.

### 4.1 Struktur dan publikasi

- [x] Workspace publik terbentuk dengan submodule dan repository map.
- [x] Repository Wave 1 dan Wave 2 sudah dibuat dan baseline publik sudah dipush.
- [x] Library TypeScript utama memakai MIT dan metadata author yang konsisten; compatibility checker kini menjaga metadata itu tetap konsisten pada package/consumer publik.
- [x] Package publik utama berada pada compatibility line 0.5.x di npm; patch `0.5.1` untuk `core` dan `language-service` sudah diverifikasi.
- [x] Root workspace tidak memuat history repository lama sebagai history publik package anak.

### 4.2 Website dan deployment

- [x] relgeo/relgeo.github.io memakai custom Pages workflow.
- [x] Workflow Pages build dan deploy berhasil pada baseline terbaru.
- [x] Workflow memakai action major yang sudah diselaraskan dengan runner modern.
- [x] Build website, artifact assertion, dan public smoke test tersedia.
- [x] Route utama, docs, language spec, playground, sitemap, favicon, dan apple-touch-icon sudah termasuk smoke coverage.
- [x] Website menunjuk ke hosted Playground /playground/.
- [x] Legacy check pages-build-deployment yang menyisakan historical failure dipahami sebagai check lama; workflow custom adalah jalur deployment aktif.

### 4.3 Playground UX/UI

- [x] Audit UX/UI komprehensif tersimpan di playground/docs/UX-UI-AUDIT-AND-PLAN.md.
- [x] First-run preview, camera fit, surface switch, responsive drawer, inspector, graph, diagnostics, share, reset, dan semantic controls sudah diperbaiki pada baseline lokal.
- [x] Keyboard sweep, AX tree lokal, reduced-motion CSS, layout overflow, production build, lint, dan test suite sudah memiliki bukti.
- [x] CSS sudah memiliki token dan layer yang eksplisit.
- [x] Screenshot baseline dan manifest tersimpan pada repository Playground.
- [x] Browser automation/emulation, responsive surface, dan accessibility-tree baseline telah diverifikasi pada CI yang tercatat.
- [x] Browser accessibility contract dan limitation fresh runtime dicatat pada audit Playground dan sub-rencana Tahap 5; DOM/AX/keyboard automation historis lulus, sedangkan host 2026-10-08 menolak local bind dan browser process berhenti sebelum page creation.
- [~] Validasi keyboard fisik dan VoiceOver nyata pada macOS belum dilakukan; limitation ini tetap terbuka dan tidak digantikan oleh AX tree automation.
- [~] Android/iOS fisik, TalkBack, iOS VoiceOver, dan Safari touch sengaja ditunda tanpa tanggal; bukan blocker scope aktif.

### 4.4 Hal yang belum boleh dianggap selesai

- [x] Integrasi lintas-repo memiliki gate resmi dari fresh clone yang menjalankan dependency graph publik secara penuh.
- [x] Release order dan bump policy menjadi satu kontrak operasional pada compatibility matrix dan divalidasi oleh release-record checker; partial publish tetap harus dihentikan dan dicatat.
- [x] Publish npm memiliki release checklist, tarball audit, registry verifier, dan public integration gate lintas-package; publish tetap manual.
- [x] Fixture conformance menjadi sumber bersama pada workspace dan diuji lintas consumer TypeScript/CLI; fixture 15 boolean/intersection lulus evidence Flutter canonical sebagai active, sedangkan fixture 16 evaluator/unit tetap candidate.
- [x] GitHub Actions run `37832260326` pada root `328c869` adalah evidence lintas-repo canonical terbaru untuk package, Playground, website, public registry, dan Flutter; `Integration #151` dipertahankan sebagai historical predecessor.
- [x] Pointer Flutter pada workspace diverifikasi melalui run canonical `37832260326` pada root `328c869`; seluruh job Flutter dan desktop lulus. Evidence local/manual lama tetap dipisahkan dari canonical record.
- [x] npm `@relgeo/core@0.5.1` dan `@relgeo/language-service@0.5.1` dipublikasikan dan registry-verified pada 2026-09-18.
- [~] Android/iOS mobile QA ditunda berdasarkan keputusan maintainer; tidak masuk acceptance gate aktif.

## 5. Prioritas utama yang disepakati

### Prioritas 1 — Reproducible cross-repo integration gate — implementasi selesai; evidence refresh tertunda

Prioritas ini sudah ditutup sebagai fondasi. Root sekarang memiliki strict baseline, local/public integration runner, fresh-checkout behavior, artifact assertion, browser E2E, dan CI evidence. Tahap ini tetap menjadi gate wajib setiap perubahan lintas-repo, tetapi bukan lagi pekerjaan berikutnya.

Target rantai minimum:

~~~text
spec → geometry → core → renderer-svg → language-service
     → remark-relgeo-hl → remark-relgeo → cli → playground → website
~~~

Gate harus menjawab:

- apakah semua submodule berada pada commit yang diharapkan;
- apakah package yang dipakai consumer sama dengan package yang benar-benar dipublish;
- apakah install fresh dengan lockfile dapat dilakukan;
- apakah build/test package lulus sesuai urutan dependency;
- apakah Playground dapat dibangun tanpa relative path lokal;
- apakah website dapat mengambil baseline Playground dan spec yang benar;
- apakah artifact publik dan route utama tetap valid.

### Prioritas 2 — Compatibility dan release contract — policy/guard selesai

Kontrak `0.5.x` sekarang memiliki matrix, manifest, parser allowlist, language-service schema enum, negative fixtures, dan checker. Patch `0.5.1` sudah dipublikasikan untuk `core` dan `language-service`, diverifikasi dari npm, dan lulus fresh public-registry integration.

### Prioritas 3 — Release automation yang aman — jalur manual selesai; automation ditunda sengaja

Guard, verifikasi registry, dan recovery planner read-only tersedia. Otomasi publish/recovery tidak sedang dikerjakan: keputusan yang diterima meminta dua siklus manual tambahan setelah keputusan 2026-09-23, baru evaluasi OIDC dan environment approval. Hingga tanggal dokumen ini, belum ada evidence dua siklus pascakeputusan tersebut; ini penundaan berprasyarat, bukan kegagalan.

### Prioritas 4 — Shared conformance fixtures — fixture 15 active; evaluator tetap candidate

Fixture dan runner lintas-consumer sudah tersedia. `boolean/intersection` pada
fixture 15 telah menjadi active dalam boundary contract yang disetujui setelah
canonical run 37832260326; `evaluator/unit` pada fixture 16 tetap candidate.
Tidak ada keputusan untuk memperluas SVG presentation pada line 0.5.x; property
tambahan sengaja tidak dimasukkan tanpa kebutuhan consumer.

### Prioritas 5 — Public product hardening — implementasi selesai; evidence desktop/accessibility tercatat dengan limitation

Website/Playground implementation dan browser automation sudah kuat. Evidence web accessibility kini mencatat pass automation historis serta limitation fresh runtime pada host 2026-10-08. Keyboard fisik/VoiceOver macOS dan smoke artifact pada host Ubuntu/Windows tetap terbuka. Android/iOS touch dan assistive technology sengaja ditunda tanpa tanggal, dan bukan blocker tahap ini.

### Prioritas 6 — Flutter alignment dan feature expansion — boolean/intersection active; evaluator dan presentation tetap terbuka

Adapter, runner, CI, dan semantic projection sudah tersedia. Posture Flutter
sebagai workbench non-publishable, baseline stable `3.41.9`, serta target desktop
macOS/Linux/Windows sudah disetujui. Canonical run 37832260326 pada root
`328c869` memverifikasi fixture 15 boolean/intersection di seluruh job Flutter
dan platform desktop; fixture 16 evaluator/unit, native dock/floating QA, smoke
Ubuntu/Windows 11 di luar run, aksesibilitas, dan package release tetap terbuka.
Android/iOS sengaja ditunda. Detail pengerjaan ada di
[Sub-Rencana 07 — Flutter Capability Promotion dan SVG Semantic Parity](./plans/07-flutter-capability-promotion-and-svg-parity.md).

### Urutan kerja yang masih relevan

1. Pertahankan fixture 15 dan matrix sebagai active hanya pada boundary contract yang terdokumentasi; jangan memperluasnya ke evaluator/unit.
2. Tutup Stage C evaluator/unit dan lakukan public smoke hanya bila perubahan menyentuh website/Playground atau release.
3. Saat Flutter dilanjutkan: pertahankan boundary active `boolean/intersection`, lalu evaluasi evaluator/unit dan smoke target desktop secara terpisah; jangan memperlakukan Android/iOS sebagai blocker.
4. Lanjutkan keyboard/VoiceOver macOS dan web accessibility; catat limitation nyata. Mobile tetap ditunda tanpa tanggal.
5. Tetap manual untuk npm; hitung dua rilis tambahan pasca-2026-09-23 sebelum mengevaluasi automation.

## 6. Tahapan pematangan

Status per tahap memakai kosakata pada §2.7. “Menunggu” harus diikuti jenis
ketergantungan: keputusan maintainer, evidence eksternal, atau prerequisite.
“Ditunda sengaja” berarti tidak ada aksi aktif sampai keputusan baru; jangan
menjadikannya checklist overdue.

### Tahap 0 — Baseline, ownership, dan measurement

**Status:** Selesai sebagai baseline; dipelihara secara berkelanjutan.

**Tujuan:** memastikan semua pekerjaan punya owner, boundary, bukti, dan status yang dapat ditelusuri.

**Hasil yang sudah ada:**

- [x] repository map dan ownership;
- [x] aturan dokumentasi publik;
- [x] audit website dan Playground;
- [x] baseline screenshot, smoke test, dan status deployment;
- [x] compatibility line 0.5.x;
- [x] MIT dan author metadata pada package utama.

**Exit gate:** setiap tahap berikutnya mempunyai sub-rencana, owner repository, acceptance criteria, dan bukti yang disimpan.

### Tahap 1 — Cross-repo integration gate

**Status implementasi:** Selesai. **Status verifikasi:** checkpoint workspace HEAD `d3ec2b0` lulus strict baseline, compatibility, dan conformance; transcript manual terbaru mencatat local `35/35`, public `50/50`, dan Flutter conformance lulus. Artefak executor `33/36`, `6/35`, dan `2/11` tetap disimpan sebagai batas diagnostik environment. CI lintas-repo terakhir tetap Integration #151 dan mendahului pointer Flutter `edc9488`. Public smoke terakhir yang tercatat 14/14 route.

**Tujuan:** membuktikan bahwa ekosistem bisa dibangun dan diuji dari fresh checkout dengan dependency publik yang deterministik.

**Ruang lingkup:**

- workspace bootstrap;
- submodule initialization dan commit verification;
- package install/build/test/lint;
- dependency order;
- Playground build tanpa relative path lokal;
- website build dengan pinned dependency;
- artifact dan URL smoke test;
- laporan yang menjelaskan failure pada repository yang tepat.

**Acceptance criteria:**

- [x] satu command atau satu entrypoint documented menjalankan gate dari fresh clone;
- [x] gate tidak membaca direktori privat atau path komputer operator;
- [x] gate menggunakan lockfile dan versi/commit yang eksplisit;
- [x] consumer tidak bergantung pada source sibling melalui relative path untuk mode publik;
- [x] failure mengembalikan exit code non-zero dan ringkasan actionable;
- [x] hasil gate menyebut commit submodule, versi package, dan artifact yang diuji;
- [x] CI dapat menjalankan gate dengan environment yang sama atau subset yang jelas.

**Deliverable sub-rencana:** [docs/plans/01-cross-repo-integration-gate.md](plans/01-cross-repo-integration-gate.md).

### Tahap 2 — Contract versioning dan compatibility matrix

**Status implementasi:** Selesai untuk policy, matrix, dan release-decision guard. **Status verifikasi:** compatibility checker checkpoint workspace HEAD lulus `283/283`; evidence CI lintas-repo terbaru tetap Integration #151. Skenario partial release tidak dijalankan sengaja karena tidak perlu membuat release gagal demi membuktikan recovery policy. Publish automation terpisah dan sengaja ditunda di Tahap 3.

**Tujuan:** membuat hubungan versi antara spec dan semua consumer menjadi eksplisit.

**Ruang lingkup:**

- definisi apa yang termasuk breaking/non-breaking;
- mapping spec version → package version → Playground/website baseline;
- peer dependency policy;
- release order dan rollback rule;
- compatibility table pada workspace dan README package;
- pemeriksaan otomatis agar package tidak mencampur line yang incompatible.

**Acceptance criteria:**

- [x] ada satu matriks kompatibilitas yang menjadi referensi;
- [x] setiap package/application yang relevan menyatakan compatibility line-nya;
- [x] breaking change membutuhkan keputusan eksplisit yang divalidasi pada release record;
- [x] release checklist memuat spec, package, consumer, docs, dan tag;
- [x] CI mendeteksi mismatch versi atau peer dependency sebelum release.
- [x] CI memvalidasi release decision record sebelum integration gate.

**Deliverable sub-rencana:** [docs/plans/02-contract-versioning.md](plans/02-contract-versioning.md).

### Tahap 3 — Release dan npm publishing guard

**Status implementasi:** jalur manual dan recovery planning selesai. **Status otomasi:** sengaja ditunda sampai dua siklus manual tambahan setelah keputusan 2026-09-23; jumlah yang memenuhi syarat saat ini 0/2. Tidak ada partial-release failure yang sengaja dibuat.

**Tujuan:** membuat release publik aman, dapat diulang, dan dapat diverifikasi setelah package masuk registry.

**Ruang lingkup:**

- npm pack --dry-run dan allowlist isi tarball;
- metadata repository/license/author;
- build dari clean checkout;
- publish order berdasarkan dependency;
- tag Git dan changelog;
- post-publish npm view dan consumer install test;
- authentication/2FA/provenance tanpa menaruh token di repository;
- prosedur recovery jika satu package gagal dipublish.

**Acceptance criteria:**

- [x] ada satu release checklist seragam;
- [x] tarball tidak memuat test, source privat, path lokal, atau file tak diinginkan;
- [x] semua package yang dirilis dapat di-install oleh consumer bersih;
- [x] hasil post-publish dicatat untuk baseline `0.5.0`;
- [x] release dapat dihentikan dengan aman di antara package tanpa membuat status membingungkan;
- [x] release preflight read-only menggabungkan clean-tree check, strict baseline, compatibility check, release decision record, tarball audit, dan local integration gate;
- [~] automated publishing sengaja ditunda sampai dua siklus manual tambahan pascakeputusan; belum memenuhi prasyarat.

**Deliverable sub-rencana:** [docs/plans/03-npm-release-guard.md](plans/03-npm-release-guard.md).

### Tahap 4 — Shared conformance fixtures dan contract tests

**Status implementasi:** infrastruktur fixture/runner selesai. **Status verifikasi:** checkpoint workspace HEAD menghasilkan `253/253` fixture checks; Integration #151 tetap menjadi evidence CI terakhir, sehingga status CI pada pointer terbaru masih menunggu refresh. **Pekerjaan terkait namun terpisah:** promosi capability yang disetujui ada di Tahap 6 / plan 07; scope SVG presentation tambahan sengaja tidak masuk contract 0.5.x.

**Tujuan:** memastikan satu bahasa dan satu scene menghasilkan perilaku konsisten pada semua surface.

**Ruang lingkup:**

- fixture source normatif dan status expected;
- parse/diagnostic fixtures;
- resolved geometry fixtures;
- SVG semantic/security fixtures;
- highlighting/Markdown fixtures;
- CLI output fixtures;
- Playground worker fixtures;
- website rendered documentation examples.

**Acceptance criteria:**

- [x] fixture memiliki owner, status, dan alasan keberadaannya;
- [x] consumer utama TypeScript/CLI menjalankan subset fixture yang relevan melalui workspace runner;
- [x] perubahan output SVG pada active fixture menghasilkan diff yang dapat direview;
- [x] active fixture memiliki exact output check pada highlighting, Markdown preview pipeline, dan CLI;
- [x] fixture invalid juga diuji, bukan hanya happy path;
- [x] fixture runtime-diagnostic mengunci violation pasca-resolve pada minimal satu consumer;
- [x] local Playground browser smoke mengonsumsi fixture runtime-diagnostic dan memperlihatkan diagnostic yang diharapkan;
- [x] direct public Playground browser smoke mengonsumsi fixture runtime-diagnostic dan memperlihatkan diagnostic yang diharapkan;
- [x] ownership fixture standalone dicatat machine-readable: canonical di root workspace, child repository tetap standalone;
- [x] package dan consumer TypeScript tervalidasi pada checkout temporary dengan public registry;
- [x] compatibility behavior inventory untuk parser, regression tests, fallback, dan example version naming tersimpan di audit terpisah;
- [x] Pages artifact assertion memverifikasi bundle Playground membawa editor label, state `READY`, tab `Errors`, dan pesan runtime diagnostic;
- [x] automated browser smoke Playground untuk runtime diagnostic dan mobile surface switcher tersedia serta lulus lokal;
- [x] automated browser consumer Playground memiliki test source/preview/diagnostic dan mobile surface;
- [x] automated browser consumer Playground dan Flutter pada CI memiliki evidence fixture yang tervalidasi;
- [x] website runtime berbasis interaksi pada deployment Pages terbaru diverifikasi: Playground mencapai `READY`, preview tetap tampil, tab `Errors` memuat diagnostic expected, dan console browser bersih;
- [x] historical/future version policy dan negative conformance fixtures menjaga parser serta language-service tetap eksplisit;
- [x] runtime-error fixtures mengunci boundary boolean kosong dan multipart pada resolver dan CLI tanpa mengubah status capability candidate;
- [ ] tidak ada consumer yang membuat kontrak diam-diam berbeda.

**Deliverable sub-rencana:** [docs/plans/04-shared-conformance-fixtures.md](plans/04-shared-conformance-fixtures.md).

### Tahap 5 — Public docs, website, dan Playground hardening

**Status implementasi:** baseline website/Playground dan browser QA selesai. **Status verifikasi:** web accessibility automation evidence dan limitation fresh runtime sudah dicatat; keyboard/VoiceOver macOS nyata masih menunggu. Public smoke adalah pemeriksaan berulang pasca-perubahan. Android/iOS mobile QA sengaja ditunda tanpa tanggal dan tidak memblokir exit gate.

**Tujuan:** memastikan public surface mudah dipercaya dan tidak overclaim capability.

**Pekerjaan tersisa:**

- [~] uji keyboard/VoiceOver pada macOS desktop belum dilakukan; browser accessibility web/PWA memiliki automation evidence dan limitation yang terdokumentasi;
- [x] build dan archive artifact Flutter pada macOS, Ubuntu/Linux, dan Windows CI;
- [~] uji artifact Flutter pada macOS, Ubuntu/Linux, dan Windows 11 nyata/VM — macOS evidence dipertahankan; Ubuntu/Linux dan Windows 11 di-defer sampai host/VM tersedia, bukan blocker;
- [x] catat OS, browser/toolchain, commit workspace/submodule, arsitektur, tanggal, dan hasil browser accessibility pada audit Playground dan sub-rencana Tahap 5;
- [~] mobile touch, TalkBack, VoiceOver iOS, dan Safari touch sengaja ditunda tanpa tanggal;
- [~] smoke publik setelah release yang memengaruhi website/Playground adalah maintenance berulang, bukan satu deliverable yang menunggu;
- [ ] jaga agar docs dan capability status mengikuti package/spec baseline.

**Peningkatan opsional:**

- [ ] evaluasi graph zoom/minimap jika dokumen besar benar-benar membutuhkan;
- [ ] usability review dengan pengguna lain;
- [ ] optimasi font dan visual lintas perangkat.

**Exit gate:** tidak ada blocker aksesibilitas atau alur utama yang diketahui; sisa hanya limitation yang terdokumentasi.

**Deliverable sub-rencana:** [docs/plans/05-public-docs-and-playground-hardening.md](plans/05-public-docs-and-playground-hardening.md).

### Tahap 6 — Flutter alignment

**Status implementasi:** parsial. **Keputusan:** non-publishable, stable 3.41.9, desktop macOS/Linux/Windows disetujui; Android/iOS ditunda. **Verifikasi:** canonical run 37832260326 pada root `328c869` lulus job Flutter, macOS, Linux, dan Windows; fixture 15 boolean/intersection active pada scope contract terbatas, sementara evaluator/unit dan desktop presentation QA tetap terbuka. Native dock/floating QA, target Ubuntu/Windows 11 di luar run, accessibility, dan package release bukan bagian promotion ini.

**Tujuan:** menjadikan Flutter consumer yang dapat dibandingkan dengan surface TypeScript, bukan jalur implementasi terpisah tanpa bukti kontrak.

**Ruang lingkup:**

- keputusan binding/runtime yang digunakan Flutter;
- shared fixtures dari Tahap 4;
- parity untuk parse/resolve/render yang memang dijanjikan;
- capability matrix Flutter vs Playground/CLI;
- build/test/analyze dari checkout bersih;
- status eksperimen vs release.

**Acceptance criteria:**

- [x] Flutter menyatakan capability yang benar-benar didukung melalui README dan mapping machine-readable; evidence parity tetap parsial dan promotion pertama sudah disetujui tetapi belum diterapkan;
- [x] active/runtime/invalid fixture inti diverifikasi pada Flutter lokal; checkout terisolasi juga lulus dengan shared-fixture skip yang eksplisit, dan dua candidate capability lulus pada operasi/evaluator serta semantic projection ter-normalisasi; candidate belum menjadi active contract;
- [x] active, runtime-diagnostic, dan candidate SVG Flutter dibandingkan dengan expected SVG TypeScript pada level object/primitive/path geometry; style, viewBox, dan full SVG policy belum menjadi acceptance;
- [x] checkout Flutter terisolasi lokal dapat menjalankan dependency resolution, analyzer non-fatal, dan test tanpa parent workspace atau absolute path operator; fixture canonical tetap opt-in melalui `RELGEO_FIXTURE_ROOT`;
- [x] analyzer Flutter tidak lagi memiliki warning atau style lint; `dart analyze` tersisa `47 INFO` deprecation-only yang tetap dicetak oleh gate CI;
- [x] README Flutter menjelaskan batas integrasi dan status release; posture release disetujui, sementara capability parity yang belum dipromosikan tetap parsial;
- [x] workflow dan matrix tidak mengklaim parity final sebelum bukti capability tersedia.

**Deliverable sub-rencana:** [docs/plans/06-flutter-alignment.md](plans/06-flutter-alignment.md), [docs/plans/07-flutter-capability-promotion-and-svg-parity.md](plans/07-flutter-capability-promotion-and-svg-parity.md), [docs/plans/08-desktop-platform-delivery.md](plans/08-desktop-platform-delivery.md), [docs/plans/10-desktop-runtime-smoke-checklist.md](plans/10-desktop-runtime-smoke-checklist.md), dan [flutter/docs/plans/02-workbench-layout-and-panel-system.md](../flutter/docs/plans/02-workbench-layout-and-panel-system.md).

### Tahap 7 — Release maturity dan perluasan fitur

**Status:** Menunggu Tahap 1–6 yang relevan.

**Tujuan:** baru setelah fondasi stabil, memperluas bahasa, renderer, editor, domain, atau integrasi baru.

**Prinsip:** setiap fitur besar harus datang bersama:

- perubahan spec bila menyentuh kontrak;
- fixture conformance;
- implementasi consumer yang relevan;
- dokumentasi publik;
- release note dan compatibility impact;
- acceptance test pada surface yang terdampak.

## 7. Rencana kerja berikutnya yang direkomendasikan

Tahap 1 sudah selesai dengan evidence lokal, public-registry, fresh-checkout, CI, public smoke, dan reproduksi failure lama. Tahap 4 sudah memiliki fondasi fixture dan strategi ownership yang jelas. Runner Flutter, checkout Flutter terisolasi, serta active/candidate scene dan SVG semantic projection sudah lulus lokal dan pada `Integration #91` tanpa menjadikannya dependency gate TypeScript; browser publik terbaru sudah diverifikasi, sementara capability parity tambahan tetap harus ditutup secara terpisah.

Urutan kerja yang disarankan setelah audit dokumen ini:

1. pelihara `docs/compatibility-matrix.json` bersama perubahan spec dan package;
2. jalankan `pnpm run compatibility:check` sebelum integration gate;
3. jalankan `pnpm run conformance:fixtures` setelah build package selesai;
4. lengkapi keyboard/VoiceOver macOS dan browser accessibility; mobile tidak masuk scope sampai dibuka kembali;
5. pertahankan release manual; evaluasi automation setelah dua siklus manual tambahan pascakeputusan;
6. saat Flutter dilanjutkan, implementasikan promotion `boolean/intersection` yang sudah disetujui; evaluator/unit menunggu promotion itu dan SVG raw/presentation equality bukan target.

## 8. Definition of Done ekosistem

RelGeo dapat disebut matang untuk baseline publik jika seluruh kondisi berikut terpenuhi:

- [x] fresh clone dapat di-bootstrap dengan instruksi singkat dan deterministik;
- [x] integrasi penuh dapat diuji tanpa path atau file privat operator;
- [x] spec, package, Playground, website, dan Flutter memiliki compatibility statement; parity evidence Flutter tetap terpisah dan belum selesai.
- [x] release package memakai gate tarball dan post-publish verification;
- [ ] fixtures penting dijalankan lintas consumer secara penuh, termasuk CI/standalone/browser/Flutter evidence pada revision workspace terbaru;
- [x] website Pages dan public smoke test hijau;
- [ ] Playground memiliki bukti browser, touch, dan assistive technology yang sesuai scope;
- [ ] setiap repository memiliki README/development/release guidance yang tidak bertentangan;
- [ ] perubahan besar mempunyai changelog/decision record dan rollback path;
- [x] public historical-version policy dan future-version handling memiliki negative conformance tests;
- [ ] fitur baru tidak mengorbankan reproducibility atau source-of-truth boundary.

## 9. Log perubahan master plan

| Tanggal | Perubahan | Bukti/status |
| --- | --- | --- |
| 2026-09-15 | Master plan dibuat dari hasil audit lintas-repo terbaru | baseline workspace, website, Playground, package metadata |
| 2026-09-15 | Prioritas utama ditetapkan pada reproducible integration gate dan release contract | seluruh package 0.5.0, website Pages aktif, Playground audit sudah ditutup secara lokal |
| 2026-10-08 | Status master dan sub-plan direkonsiliasi; implementasi, evidence, keputusan, dan penundaan dipisahkan | workspace `d3ec2b0`, Flutter pointer `edc9488`; Integration #151 historis, CI refresh pointer terbaru belum ada |
| 2026-09-15 | Mermaid ditetapkan sebagai format default diagram dokumentasi | dependency graph pada dokumen ini sudah dikonversi; pengecualian visual harus diberi alasan |
| 2026-09-15 | Tahap 1 diturunkan menjadi sub-rencana operasional | Stage A dimulai dengan inventory command dan dependency |
| 2026-09-15 | Stage A selesai secara read-only | command, lockfile, package manager, dependency, dan clean status sudah dicatat pada sub-rencana |
| 2026-09-15 | Local integration evidence Tahap 1 diperoleh pada Node 24.21.0/pnpm 10.33.3 | strict verifier, failure injection, seluruh package, Playground, website, dan Pages artifact assertion lulus; public-registry/CI masih terbuka |
| 2026-09-15 | Public-registry integration evidence Tahap 1 diperoleh pada Node 24.21.0/pnpm 10.33.3 | 48/48 stage lulus setelah runner memakai shared fixtures, package boundary, dan urutan build/test yang checkout-safe; fresh-checkout/CI/smoke masih terbuka |
| 2026-09-15 | Fresh checkout probe Tahap 1 dijalankan dari commit workspace terbaru | clone berhenti pada `renderer-svg@3b66780` karena commit belum dipush ke remote; push submodule dan root pointer masih diperlukan |
| 2026-09-15 | Fresh checkout GitHub Tahap 1 diulang setelah submodule dan root dipush | seluruh 11 submodule ter-initialize; strict verifier 81 checks dan integration gate 33/33 lulus |
| 2026-09-15 | CI Tahap 1 diverifikasi pada `relgeo/workspace` | `Integration #87` untuk commit `04960d3` lulus; public smoke dan reproduksi failure CI tertentu masih terbuka |
| 2026-09-15 | Public smoke Tahap 1 dijalankan terhadap `https://relgeo.github.io` | 14/14 route HTTP 200, termasuk playground, sitemap, favicon, dan apple-touch-icon; hanya reproduksi failure CI tertentu masih terbuka |
| 2026-09-15 | Failure CI lama Tahap 1 direproduksi pada checkout bersih | gate pada baseline `fe94149` menghasilkan 30 passed dan 3 failed pada package yang sama seperti run CI #85; Tahap 1 ditutup secara evidence |
| 2026-09-15 | Tahap 2 dimulai dengan audit metadata versi dan dependency | seluruh package publik `0.5.0`, consumer mengikuti DSL `0.5`, dan internal ranges teramati `^0.5.0` |
| 2026-09-15 | Compatibility matrix dan checker lintas-repo dibuat | `docs/compatibility-matrix.json`, `scripts/check-compatibility.mjs`, dan workflow Integration sebelum gate |
| 2026-09-15 | Tahap 3 diturunkan menjadi release/npm guard | checklist manual, tarball audit, dan post-publish verifier dibuat; publish otomatis tetap ditahan |
| 2026-09-15 | Baseline npm Tahap 3 diverifikasi | tarball audit `106/106` dan registry verification `7/7` untuk seluruh package `0.5.0` |
| 2026-09-15 | Tahap 4 menambahkan runtime-diagnostic fixture untuk constraint `align` dan exact output checks | active/legacy/invalid/runtime-diagnostic tersedia; local runner 147/147; integration gate penuh 34/34; CI evidence setelah push masih diperlukan |
| 2026-09-15 | Tahap 4 menambahkan snapshot highlighting yang human-readable dan menyegarkan integration evidence | `10-v05-relational-baseline.highlight.txt` lulus exact check; conformance 147/147 dan integration gate lokal 34/34 lulus; standalone child-repository, automated/public browser, dan Flutter evidence masih terbuka |
| 2026-09-15 | Public-registry standalone gate Tahap 4 dijalankan | package TypeScript, Playground, dan website dipasang dari registry pada checkout temporary; `48/48` stage lulus; browser runtime publik, CI setelah push, dan Flutter evidence masih terbuka |
| 2026-09-15 | Direct public Playground browser smoke Tahap 4 dijalankan | URL publik mencapai `READY` dengan preview dan diagnostic runtime yang diharapkan; smoke manual selesai, automated browser/website evidence, CI setelah push, dan Flutter evidence masih terbuka |
| 2026-09-15 | Release decision record baseline `0.5.0` ditambahkan | template, machine-readable validator, dan record package/consumer/order/evidence tersedia; automated publish/recovery transaction dan partial-release evidence masih terbuka |
| 2026-09-15 | Compatibility behavior audit Tahap 2/4 diselesaikan | `docs/compatibility-behavior-audit.md` mencatat parser version handling, historical regression coverage, fallback yang disengaja, dan mismatch nama file contoh; policy versi kemudian diformalkan pada 2026-09-16 |
| 2026-09-15 | Compatibility behavior audit dimasukkan ke workflow Integration | command read-only lulus lokal dengan `7 passed, 9 warnings, 0 failed`; evidence CI pascapush masih terbuka |
| 2026-09-15 | Pages artifact assertion diperkuat untuk runtime Playground | bundle terpaket kini wajib memuat editor accessibility label, state `READY`, tab `Errors`, dan pesan diagnostic align; browser interaction evidence masih terbuka |
| 2026-09-16 | Automated browser smoke Playground ditambahkan ke jalur integration gate | Playwright `1.63.0` exact; dua test lokal lulus; unit test dipisahkan dari folder `e2e`; CI pascapush masih menjadi evidence berikutnya |
| 2026-09-16 | Automated browser smoke diverifikasi dalam integration gate penuh | `35/36` stage lulus termasuk Playwright install dan `test:e2e`; satu failure administratif berasal dari strict baseline karena submodule lokal belum clean |
| 2026-09-16 | Automated browser smoke diverifikasi pada public-registry gate | `49/50` stage lulus termasuk Playwright install dan `test:e2e` dengan package npm publik; satu failure administratif berasal dari strict baseline karena submodule lokal belum clean |
| 2026-09-16 | Audit awal Flutter alignment diselesaikan dan sub-rencana Tahap 6 dibuat | Flutter teridentifikasi sebagai workbench non-publishable dengan resolver/renderer/test yang substansial; audit menemukan coupling fixture ke `../fixtures`, compatibility record dan CI Flutter belum tersedia |
| 2026-09-16 | Flutter dicatat sebagai non-Node consumer pada compatibility matrix dan test fixture loader dibuat portable | checker compatibility `160/160`; `RELGEO_FIXTURE_ROOT` tersedia di test Flutter; shared-fixture, semantic parity, clean checkout, dan CI evidence masih terbuka |
| 2026-09-16 | Staging fixture Flutter dibuat dan diuji tanpa SDK Flutter | tool menyalin fixture active/runtime/invalid ke `.local` dengan manifest staging; staging smoke berhasil, eksekusi Flutter tetap terbuka |
| 2026-09-16 | Adapter semantic projection, invalid boundary tests, dan runner Flutter ditambahkan | fixture active/runtime memiliki pembanding semantic snapshot, invalid input memiliki boundary coverage, dan `flutter:conformance` menyediakan urutan gate; evidence Flutter nyata/CI tetap terbuka |
| 2026-09-16 | Capability mapping Flutter–TypeScript ditambahkan | `docs/flutter-capability-matrix.json` dan compatibility checker memetakan capability, source path, support level, serta evidence flags; parity runtime tetap terbuka |
| 2026-09-16 | Flutter workbench diberi widget smoke untuk fixture active dan runtime diagnostic | assertion load, render, status compile, tab diagnostic, dan export surface tersedia; eksekusi Flutter tetap terbuka karena SDK belum tersedia |
| 2026-09-16 | Draft release posture Flutter dicatat | rekomendasi workbench non-publishable dan gate terpisah tersedia di `docs/decisions/06-flutter-release-posture.md`; persetujuan maintainer dan evidence runtime tetap terbuka |
| 2026-09-16 | Flutter local conformance gate dijalankan melalui terminal VS Code | Flutter `3.41.9` / Dart `3.11.5`; staging 15 fixture, `pub get`, analyzer non-fatal, dan 118 test lulus; CI/parity capability tambahan masih terbuka |
| 2026-09-16 | Candidate boolean/intersection v0.5 ditambahkan ke shared fixture set | expected JSON/SVG tersedia, TypeScript conformance `179 passed, 0 failed across 15 fixtures`, dan operasi serta semantic projection ter-normalisasi Flutter lulus lokal; candidate belum active dan CI/SVG parity masih terbuka |
| 2026-09-16 | SVG semantic projection candidate ditambahkan pada Flutter | object ID, primitive, subpath, endpoint, dan geometry path dibandingkan terhadap expected SVG TypeScript; styling/viewBox dikecualikan; lulus lokal, active/full parity dan CI masih terbuka |
| 2026-09-16 | SVG semantic projection active diperluas pada Flutter | fixture active membandingkan rect/circle/polygon-path geometry terhadap expected SVG TypeScript; lulus lokal, full capability/presentation policy dan CI masih terbuka |
| 2026-09-16 | SVG semantic projection runtime-diagnostic diperluas pada Flutter | fixture runtime-diagnostic membandingkan object path geometry terhadap expected SVG TypeScript; lulus lokal, full capability/presentation policy dan CI masih terbuka |
| 2026-09-16 | Checkout Flutter standalone dijalankan ulang setelah parity SVG active/runtime diperluas | tanpa parent workspace, 99 test lulus dan 7 shared-fixture test skip dengan alasan eksplisit; analyzer non-fatal selesai dengan 130 lint/info legacy |
| 2026-09-16 | Checkout Flutter terisolasi diverifikasi tanpa parent workspace | analyzer non-fatal dan `flutter test` lulus; 99 test passed, 7 shared-fixture test skip dengan alasan eksplisit; CI Flutter dan parity capability tambahan masih terbuka |
| 2026-09-16 | Definisi evidence matrix Flutter diperjelas | flag local test/shared fixture/semantic parity/CI dipisahkan dari status active/partial; candidate evidence tidak diperlakukan sebagai promosi active contract; checker compatibility `250/250` dan conformance `179/179` tetap lulus |
| 2026-09-16 | Gap unit/evaluator Flutter diperbaiki secara lokal | dukungan `in`/inch, signed unit literal, `LengthUnit.ip`, dan preservasi string non-numerik ditambahkan; regression evaluator `6/6` lulus, tetapi shared scalar projection dan CI belum tersedia |
| 2026-09-16 | Full Flutter suite diverifikasi setelah patch unit/evaluator | `flutter test --reporter compact` lulus `118 test`; tidak ada regresi pada fixture, widget, golden, renderer, atau conformance tests |
| 2026-09-16 | Candidate evaluator/unit v0.5 ditambahkan ke shared fixture set | fixture ke-16 mencakup parameter length, `in`/`mm`, derived placement, expected scene/SVG, dan explicit CLI target unit; root conformance lulus `199/199` sebelum validator candidate diperketat |
| 2026-09-16 | Official Flutter runner diverifikasi ulang setelah candidate evaluator/unit | staging 16 fixture, `pub get --enforce-lockfile`, analyzer non-fatal, dan `flutter test` lulus `119 test`; CI dan promotion decision tetap terbuka |
| 2026-09-16 | Validator capability candidate diperketat | manifest kini mewajibkan expected scene/output snapshot untuk setiap candidate; conformance terbaru lulus `204/204` across 16 fixtures |
| 2026-09-16 | Integration gate root diulang setelah candidate evaluator/unit | `35 passed, 1 failed, 36 total`; satu failure hanya strict-baseline akibat tiga submodule masih dirty, sementara seluruh package/consumer, E2E, Pages artifact, dan conformance stage lulus |
| 2026-09-16 | Probe build macOS Flutter dilakukan | locale UTF-8 diperlukan agar CocoaPods berjalan; retry mencapai Xcode tetapi terhenti karena disk penuh. Artefak build dibersihkan; source build macOS dan keputusan platform release tetap terbuka |
| 2026-09-16 | Baseline submodule diperbarui setelah tiga commit dipush dan integration gate clean diulang | strict verifier `81/81`; integration gate lokal `36/36`; conformance `204/204`; CI pascapush untuk commit terbaru masih perlu diverifikasi |
| 2026-09-16 | GitHub `Integration #90` diverifikasi selesai | commit `6305b8e` memiliki job `flutter`, `verify`, dan `public` yang semuanya sukses; CI Flutter dan public-registry evidence tersedia, sementara browser deployment publik terbaru, promotion candidate, dan platform release masih terbuka |
| 2026-09-16 | GitHub `Integration #91` diverifikasi selesai | commit `bdfa895` memiliki job `flutter`, `verify`, dan `public` yang semuanya sukses; evidence CI terbaru tetap hijau, browser deployment publik terbaru kemudian diverifikasi, sementara promotion candidate dan platform release masih terbuka |
| 2026-09-16 | Browser smoke deployment publik terbaru dijalankan | `https://relgeo.github.io/playground/` mencapai `READY`, fixture runtime diagnostic menampilkan preview dan tab `Errors` dengan pesan expected; route utama, `/en/`, `/en/docs/`, `/en/docs/language-spec/`, `/playground/`, dan `/sitemap.xml` semuanya HTTP 200, console browser bersih |
| 2026-09-16 | Official Playground E2E dibuat deployment-aware dan dipromosikan ke gate root | `PLAYWRIGHT_BASE_URL=https://relgeo.github.io/playground/ pnpm test:e2e` lulus `2/2`; local mode juga `2/2`; child commit `143acf6`, root pointer `9e77d33`, local gate `36/36`, dan GitHub `Integration #94` sukses |
| 2026-09-16 | Release preflight read-only ditambahkan dan dijalankan | `release:preflight` pada `workspace@3f4b76a` lulus root clean, strict baseline `81/81`, compatibility `250/250`, tarball audit `106/106`, dan integration gate `36/36`; evidence dicatat pada sub-rencana Tahap 3 |
| 2026-09-16 | Sub-rencana Tahap 5 dibuat dan ditautkan | website visual audit, visual rules, Playground UX/UI audit, public smoke, accessibility baseline, dan gate eksternal kini memiliki satu dokumen koordinasi; touch fisik dan assistive technology tetap terbuka |
| 2026-09-16 | Playground menambahkan mobile-device emulation dengan touchscreen tap | `e070cd9`, E2E lokal `2/2`; bukti automation bertambah, sedangkan handset fisik, keyboard fisik, dan VoiceOver/TalkBack tetap terbuka |
| 2026-09-16 | Audit Playground diselaraskan ke baseline `e73b212` dan root gate diulang | root `f953b32`, strict baseline `81/81`, compatibility `250/250`, integration `36/36`; CI pascapush terbaru masih perlu diverifikasi |
| 2026-09-16 | Public version policy diformalkan lintas matrix, manifest, dan parser | active `0.5`, supported legacy `0.4`, regression-only `0.1`–`0.3`, omitted default `0.5`; future/unknown version ditolak dengan `UNSUPPORTED_SPEC_VERSION` |
| 2026-09-16 | Negative conformance version fixtures ditambahkan | fixture `17` (`0.6`) dan `18` (`1.0`); core `427/427`, compatibility `256/256`, conformance `228/228` across 18 fixtures |
| 2026-09-16 | Language-service schema dan root integration gate diselaraskan dengan version policy | schema membatasi version `0.1`–`0.5`; lint/test `66/66`; strict baseline `81/81`; local integration gate `36/36`; release patch manual kemudian disiapkan |
| 2026-09-18 | Policy multi-active conformance fixture diterapkan dan gate lokal diulang | runner berubah dari tepat satu menjadi minimal satu fixture `active`; baseline Fixture 10 tetap dipertahankan; conformance `228/228`; integration gate Node `24.21.0` melalui terminal VS Code lulus `36/36`; candidate 15/16 tetap `capability` sampai negative fixture dan keputusan promosi selesai |
| 2026-09-18 | Negative runtime-error fixtures ditambahkan untuk boolean empty/multipart boundaries | fixture 19 menolak intersect rectangle yang disjoint dengan `BOOLEAN_EMPTY_RESULT`, fixture 20 menolak multipart result pada mode `single` dengan `BOOLEAN_MULTIPART_RESULT`; conformance `253/253` across 20 fixtures dan local integration gate Node `24.21.0` `36/36`; candidate 15/16 tetap `capability` dan promotion lintas consumer masih terbuka |
| 2026-09-16 | GitHub `Integration #105` memverifikasi policy version acceptance terbaru | job `flutter`, `verify`, dan `public` sukses pada `workspace@a866fcc`; dua warning Node 20 dari `actions/upload-artifact@v5` dicatat dan action dinaikkan ke v6 untuk workflow berikutnya |
| 2026-09-16 | GitHub `Integration #106` memverifikasi workflow artifact Node 24 | job `flutter`, `verify`, dan `public` sukses pada `workspace@b3f7bb6`; dua artifact report terbentuk dan warning Node 20 tidak lagi muncul |
| 2026-09-16 | Release record dibuat status-aware dan candidate `0.5.1` diaudit | workspace commit `6d33737`; record candidate `21/21`, audit candidate lokal `36/36`; jalur publish manual kemudian diselesaikan pada 2026-09-18 |
| 2026-09-17 | Recovery partial-release diperketat | validator dan template kini memerlukan last published, first failed, forward-fix yang lebih baru, urutan konsisten, dan larangan republish versi gagal; automated transaction masih terbuka |
| 2026-09-17 | GitHub `Integration #112` memverifikasi failure-injection release guard | job `flutter`, `verify`, dan `public` sukses pada `workspace@0adadf8`; local/public integration summary, artifact report, dan Playwright annotations tersedia |
| 2026-09-17 | GitHub `Integration #113` memverifikasi evidence dokumentasi terbaru | job `flutter`, `verify`, dan `public` sukses pada `workspace@2ba78fb`; local/public integration summary, dua artifact report, dan dua Playwright smoke tersedia |
| 2026-09-17 | GitHub `Integration #114` memverifikasi sinkronisasi evidence lintas rencana | job `flutter`, `verify`, dan `public` sukses pada `workspace@8aab44d`; dua artifact report dan browser smoke lintas local/public tersedia |
| 2026-09-17 | GitHub `Integration #115` memverifikasi refresh evidence terakhir | job `flutter`, `verify`, dan `public` sukses pada `workspace@f380079`; dua artifact report dan browser smoke lintas local/public tersedia |
| 2026-09-17 | Failure-injection release record ditambahkan | `release:record:failure` menolak partial recovery yang memakai ulang versi gagal; publish manual dan recovery nyata tetap terbuka |
| 2026-09-17 | Build Flutter macOS berhasil diverifikasi ulang | `flutter build macos --no-pub` lulus pada child commit `e46f1ad` dan menghasilkan artefak Release `relgeo_flutter.app` 45.2 MB; pointer root dan CI untuk commit tersebut masih perlu diperbarui |
| 2026-09-18 | Baseline Flutter diselaraskan setelah CI menemukan manifest tertinggal | `docs/integration-baseline.json` kini menunjuk ke child commit `e46f1ad`, strict baseline kembali `81/81`, dan local integration gate kembali `36/36`; `Integration #117` tetap dicatat sebagai failure diagnostik pada root commit `225092b`, sementara verifikasi CI untuk perbaikan ini masih menunggu run berikutnya |
| 2026-09-18 | Job build macOS Flutter ditambahkan ke CI | workflow root kini memiliki job `flutter-macos` pada `macos-latest` dengan Flutter stable `3.41.9`, locale UTF-8, lockfile enforcement, dan release build; evidence CI macOS pertama masih terbuka |
| 2026-09-18 | `Integration #119` memverifikasi build macOS Flutter di CI | `workspace@dc40653` sukses untuk job `flutter`, `flutter-macos`, `verify`, dan `public`; macOS runner `macos-latest` menyelesaikan `flutter build macos --no-pub --release`, dua artifact report tersedia, dan kedua Playwright smoke lulus |
| 2026-09-18 | Release guard dan CI evidence diselaraskan pada commit terbaru | `08be7d8` memvalidasi release order/bump policy; `release:record:check` untuk record historis dan completed lulus, candidate audit `36/36`, compatibility `283/283`, strict baseline `81/81`, dan `Integration #129` pada `aea1188` sukses pada `verify`, `flutter`, `flutter-macos`, serta `public`. Patch `0.5.1` sudah selesai; automation publish/recovery dan validasi perangkat fisik tetap terbuka |
| 2026-09-18 | Pin toolchain Node lokal didokumentasikan dan diverifikasi pada CI terbaru | root commit `321c7b2` menambahkan `.node-version` `24.21.0` dan instruksi bootstrap; `Integration #132` sukses pada `verify`, `flutter`, `flutter-macos`, dan `public` dalam 3m58s. Environment lokal yang masih memakai Node `22.23.2` tetap menjadi tindakan operator, bukan kegagalan CI |
| 2026-09-18 | GitHub memverifikasi boundary conformance boolean terbaru | `Integration #142` pada workspace commit `a4ee3aa` sukses pada seluruh job `verify`, `flutter`, `flutter-macos`, dan `public`; fixture 19/20 serta conformance `253/253` kini memiliki evidence CI terbaru |
| 2026-09-23 | Desktop artifact gates ditambahkan dan diverifikasi | commit `791ae33`; `Integration #147` sukses pada `flutter`, `flutter-linux`, `flutter-macos`, `flutter-windows`, `verify`, dan `public`; native build menghasilkan serta meng-assert archive macOS/Linux/Windows. Smoke test pada macOS/Ubuntu/Windows 11 nyata, installer, dan launch/accessibility QA masih terbuka |
| 2026-09-23 | Launch smoke macOS lokal ditutup | MacBook Air arm64/macOS `14.5`; Flutter release app terbuka, diagnostics menunjukkan 0 constraint violations, values dan SVG export terverifikasi, lalu aplikasi keluar bersih. Keyboard traversal penuh dan accessibility review tetap terbuka |
| 2026-09-23 | Baseline analyzer Flutter dibersihkan | child commit `7917d17`; empat warning terakhir dihapus tanpa perubahan kontrak, `dart analyze` menjadi `0 WARNING` dan `108 INFO` non-blocking, `flutter test` tetap lulus 119 test, dan `flutter:conformance` melewati fixture staging, lockfile enforcement, analyzer, serta test gate |
| 2026-09-23 | Safe lint cleanup Flutter dilanjutkan | child commit `89d2e95`; 60 auto-fix dan 4 lint manual diterapkan tanpa perubahan kontrak, `dart analyze` kini `0 WARNING` dan `47 INFO` deprecation-only, serta `flutter test` tetap lulus 119 test |
| 2026-09-23 | Playground E2E dan desktop matrix diverifikasi ulang | Playground child commit `3969d47`; audit UX, lint, unit test `85/85`, build, dan E2E `2/2` lulus dengan browser fallback lokal; `Integration #151` sukses pada `flutter`, `flutter-linux`, `flutter-macos`, `flutter-windows`, `verify`, dan `public` |
| 2026-09-23 | Local integration gate diberi fallback browser yang eksplisit | workspace commit `515bda4`; `PLAYWRIGHT_EXECUTABLE_PATH` mencegah download Chromium saat browser kompatibel sudah tersedia, dan gate lokal lulus `35/35` dengan strict baseline `81/81` |
| 2026-09-27 | Evidence Release macOS dan audit kebersihan source diperbarui | Direct `xcodebuild` melalui `macos/Runner.xcworkspace` pada Flutter berhasil membangun app Release universal (`arm64`/`x86_64`); source audit tidak menemukan path lokal, private key, token, atau pola password. Fresh CI setelah native bridge terbaru, Ubuntu/Windows 11 smoke, dan accessibility runtime tetap terbuka |
| 2026-10-09 | Promotion boolean/intersection fixture 15 ditutup setelah canonical cross-platform CI | root `328c869`; GitHub run `37832260326` berstatus Success pada `verify`, `public`, `flutter`, `flutter-macos`, `flutter-linux`, dan `flutter-windows`, dengan 5 artifact; fixture 15 active, matrix/docs sinkron, fixture 16 evaluator/unit tetap candidate |
| 2026-10-08 | Baseline dan evidence direkonsiliasi pada workspace HEAD | `d3ec2b0`; manifest seluruh 11 gitlink konsisten; strict `81/81`, compatibility `283/283`, conformance `253/253`; transcript manual `.internal/tmp-test.txt` mencatat local `35/35`, public `50/50`, dan Flutter conformance 300 test lulus; artefak executor `33/36`, `6/35`, dan `2/11` dipertahankan sebagai diagnostic history; `Integration #151` tetap menjadi CI evidence terakhir dan tidak digantikan oleh klaim untuk Flutter `edc9488` |
| 2026-10-08 | Browser accessibility/runtime evidence ditutup sebagai evidence dengan limitation | workspace `d3ec2b0`; Playground `ecc1407`; website `5c4576e`; Flutter `edc9488`; macOS `14.5` arm64; Node `22.23.2` (di bawah requirement `>=24`), pnpm `10.33.3`, Playwright `1.63.0`; build/lint/93 unit/audit lulus, local bind `EPERM`, public browser `SIGABRT`/`SIGTRAP`, DNS unavailable; VoiceOver nyata dan mobile tetap terbuka/deferred |
| 2026-10-08 | Keputusan manusia: defer smoke lintas-OS | Ubuntu/Linux dan Windows 11 runtime smoke di-defer karena host/VM/runner belum tersedia; provenance artifact CI dan limitation tetap dicatat, artifact tidak disebut usable, Docker Compose tidak dipakai sebagai pengganti, dan pekerjaan independen tidak diblokir |

## 10. Catatan pemeliharaan

Setiap kali sebuah tahap dikerjakan:

1. jangan menghapus sejarah keputusan dari dokumen ini;
2. ubah checkbox/status dan tambahkan bukti singkat;
3. tautkan sub-rencana dan commit penting;
4. catat hal yang sengaja belum dikerjakan;
5. jika urutan berubah, jelaskan alasannya pada log perubahan.

Dokumen ini harus tetap tipis pada level keputusan. Detail command, file, fixture, dan langkah troubleshooting berada di sub-rencana atau repository pemiliknya.
