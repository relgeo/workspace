# RelGeo Maturation Master Plan

**Status:** master plan aktif  
**Tanggal baseline:** 2026-09-15  
**Compatibility line saat ini:** RelGeo DSL 0.5.x  
**Pemilik keputusan:** Agus Made  
**Ruang lingkup:** seluruh repository publik RelGeo dan integrasinya sebagai satu ekosistem

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
02-version-and-release-contract.md
~~~

Sub-rencana menjelaskan pekerjaan operasional secara mendalam; dokumen ini tetap menjadi tempat urutan, keputusan, status, dan hubungan antar-tahap.

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

## 3. Gambaran ekosistem saat ini

### 3.1 Repository dan peran

| Layer | Repository | Peran | Kondisi baseline |
| --- | --- | --- | --- |
| Contract | spec | kontrak normatif DSL | aktif pada 0.5, source utama saat ini di id/ |
| Runtime | geometry | matematika geometri 2D | package @relgeo/geometry@0.5.0 |
| Runtime | core | parse, resolve, dan semantic engine | package @relgeo/core@0.5.0 |
| Runtime | renderer-svg | render resolved geometry ke SVG | package @relgeo/renderer-svg@0.5.0 |
| Language | language-service | schema, token, diagnostics, completions | package @relgeo/language-service@0.5.0 |
| Markdown | remark-relgeo-hl | source highlighting pada fenced block | package @relgeo/remark-relgeo-hl@0.5.0 |
| Markdown | remark-relgeo | preview/embed pada Markdown | package @relgeo/remark-relgeo@0.5.0 |
| CLI | cli | command-line surface | package @relgeo/cli@0.5.0 |
| Product | playground | browser IDE publik | baseline publik, package private |
| Product | relgeo.github.io | website, docs, spec presentation, Pages deployment | deployment Pages aktif |
| Product | flutter | workbench Flutter | baseline awal, belum menjadi release gate TypeScript |
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
- [x] Library TypeScript utama memakai MIT dan metadata author yang konsisten.
- [x] Package publik utama sudah berada pada 0.5.0 di npm.
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
- [ ] Uji touch pada perangkat fisik.
- [ ] Validasi screen reader nyata dengan VoiceOver atau TalkBack.

### 4.4 Hal yang belum boleh dianggap selesai

- [ ] Integrasi lintas-repo belum memiliki satu gate resmi dari fresh clone yang menjalankan dependency graph publik secara penuh.
- [ ] Release order, compatibility matrix, dan bump policy belum menjadi satu kontrak operasional yang dijaga otomatis.
- [ ] Publish npm masih dapat dilakukan manual dan belum mempunyai release gate lintas-package yang seragam.
- [ ] Fixture conformance belum menjadi sumber bersama yang diuji oleh seluruh consumer penting.
- [ ] Flutter belum dibawa ke jalur validasi kontrak yang sama dengan consumer TypeScript.

## 5. Prioritas utama yang disepakati

### Prioritas 1 — Reproducible cross-repo integration gate

Ini adalah pekerjaan paling penting berikutnya. Selama setiap repository dapat lulus sendirian tetapi belum diuji sebagai rantai publik dari checkout bersih, kita belum mempunyai bukti bahwa ekosistem benar-benar siap dipelihara.

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

### Prioritas 2 — Compatibility dan release contract

Buat kontrak eksplisit mengenai hubungan spec, package, Playground, website, dan Flutter. 0.5.x harus mempunyai matriks kompatibilitas yang dapat dibaca manusia dan diperiksa script.

### Prioritas 3 — Release automation yang aman

Setelah gate integrasi stabil, standardisasi proses pack, publish, tag, changelog, provenance, dan verifikasi pascapublish. Publish manual tetap boleh sebagai jalur darurat, tetapi bukan satu-satunya proses yang diketahui.

### Prioritas 4 — Shared conformance fixtures

Satukan fixture penting untuk parse, resolve, diagnostics, render, highlighting, Markdown, CLI, Playground, dan website. Satu perubahan kontrak harus terlihat dampaknya pada seluruh consumer.

### Prioritas 5 — Public product hardening

Tutup dua gate eksternal Playground, lanjutkan smoke publik rutin, dan pastikan docs menjelaskan status capability secara jujur.

### Prioritas 6 — Flutter alignment dan feature expansion

Setelah contract/integration gate tersedia, bawa Flutter ke fixture dan compatibility matrix yang sama. Baru setelah itu perluasan fitur besar atau peningkatan surface baru menjadi prioritas utama.

## 6. Tahapan pematangan

Status menggunakan arti berikut:

- Selesai — exit gate telah terpenuhi dan buktinya dicatat.
- Berjalan — pekerjaan sudah dimulai tetapi exit gate belum lengkap.
- Berikutnya — tahap paling tepat untuk diambil setelah tahap sebelumnya selesai.
- Menunggu — sengaja ditahan karena bergantung pada tahap lain atau bukti eksternal.
- Opsional — peningkatan bernilai, tetapi bukan syarat release baseline.

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

**Status:** Berjalan — baseline verifier, local/public integration gate, pack boundary, dan CI hardening sudah disiapkan; runtime evidence masih terbuka.

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

- [ ] satu command atau satu entrypoint documented menjalankan gate dari fresh clone;
- [ ] gate tidak membaca direktori privat atau path komputer operator;
- [ ] gate menggunakan lockfile dan versi/commit yang eksplisit;
- [ ] consumer tidak bergantung pada source sibling melalui relative path untuk mode publik;
- [ ] failure mengembalikan exit code non-zero dan ringkasan actionable;
- [ ] hasil gate menyebut commit submodule, versi package, dan artifact yang diuji;
- [ ] CI dapat menjalankan gate dengan environment yang sama atau subset yang jelas.

**Deliverable sub-rencana:** [docs/plans/01-cross-repo-integration-gate.md](plans/01-cross-repo-integration-gate.md).

### Tahap 2 — Contract versioning dan compatibility matrix

**Status:** Berikutnya setelah Tahap 1.

**Tujuan:** membuat hubungan versi antara spec dan semua consumer menjadi eksplisit.

**Ruang lingkup:**

- definisi apa yang termasuk breaking/non-breaking;
- mapping spec version → package version → Playground/website baseline;
- peer dependency policy;
- release order dan rollback rule;
- compatibility table pada workspace dan README package;
- pemeriksaan otomatis agar package tidak mencampur line yang incompatible.

**Acceptance criteria:**

- [ ] ada satu matriks kompatibilitas yang menjadi referensi;
- [ ] setiap package menyatakan compatibility line-nya;
- [ ] breaking change tidak dapat dipublish sebagian tanpa keputusan eksplisit;
- [ ] release checklist memuat spec, package, consumer, docs, dan tag;
- [ ] CI mendeteksi mismatch versi atau peer dependency sebelum release.

**Deliverable sub-rencana:** docs/plans/02-contract-versioning.md.

### Tahap 3 — Release dan npm publishing guard

**Status:** Berikutnya setelah Tahap 2.

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

- [ ] ada satu release checklist seragam;
- [ ] tarball tidak memuat test, source privat, path lokal, atau file tak diinginkan;
- [ ] semua package yang dirilis dapat di-install oleh consumer bersih;
- [ ] hasil post-publish dicatat;
- [ ] release dapat dihentikan dengan aman di antara package tanpa membuat status membingungkan;
- [ ] automated publishing hanya diaktifkan setelah manual path terbukti stabil.

**Deliverable sub-rencana:** docs/plans/03-npm-release-guard.md.

### Tahap 4 — Shared conformance fixtures dan contract tests

**Status:** Berikutnya setelah Tahap 1; dapat berjalan paralel terbatas dengan Tahap 2.

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

- [ ] fixture memiliki owner, status, dan alasan keberadaannya;
- [ ] semua consumer utama menjalankan subset fixture yang relevan;
- [ ] perubahan output yang disengaja menghasilkan diff yang dapat direview;
- [ ] fixture invalid juga diuji, bukan hanya happy path;
- [ ] tidak ada consumer yang membuat kontrak diam-diam berbeda.

**Deliverable sub-rencana:** docs/plans/04-shared-conformance-fixtures.md.

### Tahap 5 — Public docs, website, dan Playground hardening

**Status:** Baseline sudah kuat; gate eksternal masih terbuka.

**Tujuan:** memastikan public surface mudah dipercaya dan tidak overclaim capability.

**Pekerjaan tersisa:**

- [ ] uji touch pada perangkat fisik: pan, pinch, scroll, drawer, target sentuh;
- [ ] validasi VoiceOver/TalkBack: landmark, dialog, drawer, tabs, errors, graph;
- [ ] catat model perangkat, OS, browser, dan hasilnya pada audit Playground;
- [ ] jalankan smoke publik setelah setiap release yang memengaruhi website/playground;
- [ ] jaga agar docs dan capability status mengikuti package/spec baseline.

**Peningkatan opsional:**

- [ ] evaluasi graph zoom/minimap jika dokumen besar benar-benar membutuhkan;
- [ ] usability review dengan pengguna lain;
- [ ] optimasi font dan visual lintas perangkat.

**Exit gate:** tidak ada blocker aksesibilitas atau alur utama yang diketahui; sisa hanya limitation yang terdokumentasi.

### Tahap 6 — Flutter alignment

**Status:** Menunggu contract/integration gate.

**Tujuan:** menjadikan Flutter consumer yang dapat dibandingkan dengan surface TypeScript, bukan jalur implementasi terpisah tanpa bukti kontrak.

**Ruang lingkup:**

- keputusan binding/runtime yang digunakan Flutter;
- shared fixtures dari Tahap 4;
- parity untuk parse/resolve/render yang memang dijanjikan;
- capability matrix Flutter vs Playground/CLI;
- build/test/analyze dari checkout bersih;
- status eksperimen vs release.

**Acceptance criteria:**

- [ ] Flutter menyatakan capability yang benar-benar didukung;
- [ ] fixture inti dapat diverifikasi pada Flutter atau gap-nya terdokumentasi;
- [ ] build tidak bergantung pada path lokal operator;
- [ ] README Flutter menjelaskan batas integrasi dan status release;
- [ ] workflow tidak mengklaim parity sebelum bukti tersedia.

**Deliverable sub-rencana:** docs/plans/06-flutter-alignment.md.

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

Jangan mulai dari Flutter atau fitur baru. Ambil **Tahap 1 — Cross-repo integration gate** sebagai sub-rencana pertama.

Urutan kerja yang disarankan:

1. inventaris command build/test/lint pada setiap package;
2. tetapkan dependency order dan boundary antara local development dan public consumption;
3. definisikan format manifest baseline: submodule commit, package version, spec revision;
4. buat runner lintas-repo yang aman dari fresh clone;
5. jalankan runner pada macOS lokal;
6. jalankan subset yang sama pada CI;
7. perbaiki mismatch yang ditemukan;
8. simpan laporan dan acceptance evidence;
9. baru tandai Tahap 1 selesai dan turunkan Tahap 2.

## 8. Definition of Done ekosistem

RelGeo dapat disebut matang untuk baseline publik jika seluruh kondisi berikut terpenuhi:

- [ ] fresh clone dapat di-bootstrap dengan instruksi singkat dan deterministik;
- [ ] integrasi penuh dapat diuji tanpa path atau file privat operator;
- [ ] spec, package, Playground, website, dan Flutter memiliki compatibility statement;
- [ ] release package memakai gate tarball dan post-publish verification;
- [ ] fixtures penting dijalankan lintas consumer;
- [ ] website Pages dan public smoke test hijau;
- [ ] Playground memiliki bukti browser, touch, dan assistive technology yang sesuai scope;
- [ ] setiap repository memiliki README/development/release guidance yang tidak bertentangan;
- [ ] perubahan besar mempunyai changelog/decision record dan rollback path;
- [ ] fitur baru tidak mengorbankan reproducibility atau source-of-truth boundary.

## 9. Log perubahan master plan

| Tanggal | Perubahan | Bukti/status |
| --- | --- | --- |
| 2026-09-15 | Master plan dibuat dari hasil audit lintas-repo terbaru | baseline workspace, website, Playground, package metadata |
| 2026-09-15 | Prioritas utama ditetapkan pada reproducible integration gate dan release contract | seluruh package 0.5.0, website Pages aktif, Playground audit sudah ditutup secara lokal |
| 2026-09-15 | Mermaid ditetapkan sebagai format default diagram dokumentasi | dependency graph pada dokumen ini sudah dikonversi; pengecualian visual harus diberi alasan |
| 2026-09-15 | Tahap 1 diturunkan menjadi sub-rencana operasional | Stage A dimulai dengan inventory command dan dependency |
| 2026-09-15 | Stage A selesai secara read-only | command, lockfile, package manager, dependency, dan clean status sudah dicatat pada sub-rencana |

## 10. Catatan pemeliharaan

Setiap kali sebuah tahap dikerjakan:

1. jangan menghapus sejarah keputusan dari dokumen ini;
2. ubah checkbox/status dan tambahkan bukti singkat;
3. tautkan sub-rencana dan commit penting;
4. catat hal yang sengaja belum dikerjakan;
5. jika urutan berubah, jelaskan alasannya pada log perubahan.

Dokumen ini harus tetap tipis pada level keputusan. Detail command, file, fixture, dan langkah troubleshooting berada di sub-rencana atau repository pemiliknya.
