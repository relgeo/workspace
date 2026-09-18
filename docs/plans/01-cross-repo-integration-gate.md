# Sub-rencana Tahap 1 — Cross-repo Integration Gate

**Status:** Selesai — local, public-registry, fresh-checkout, CI, public smoke, dan reproduksi failure CI sudah memiliki evidence; run CI terbaru #129 hijau
**Induk:** ../MATURATION-MASTER-PLAN.md  
**Tanggal:** 2026-09-15  
**Owner koordinasi:** relgeo/workspace  
**Scope:** workspace, package TypeScript publik, Playground, website, dan bukti integrasinya

## 1. Tujuan

Membuat satu gate yang dapat dijalankan dari checkout bersih untuk membuktikan bahwa repository-repository RelGeo bekerja sebagai satu dependency graph publik.

Gate ini tidak menggantikan test detail pada repository anak. Gate ini memeriksa bahwa:

- checkout dan submodule berada pada baseline yang diketahui;
- package dibangun dan diuji menurut dependency order;
- consumer memakai dependency publik yang benar;
- Playground dapat dibangun tanpa path source lokal;
- website dapat mengambil baseline consumer yang benar;
- hasilnya dapat dibaca manusia dan gagal secara tegas ketika ada mismatch.

## 2. Batasan dan prinsip

### 2.1 Yang termasuk

- bootstrap submodule;
- verifikasi Git commit dan branch/tag baseline;
- pemeriksaan package name, version, license, dan dependency line;
- install dengan lockfile;
- build, lint, test, dan pack boundary untuk package yang relevan;
- build Playground;
- build dan artifact assertion website;
- public smoke test website setelah deployment bila dijalankan pada mode release;
- laporan ringkas yang menyebut tahap gagal dan cara memperbaikinya.

### 2.2 Yang tidak termasuk

- menggabungkan semua repository menjadi monorepo;
- menghapus submodule;
- memasukkan source repository sibling ke tarball publik;
- menjalankan deployment production dari command lokal;
- menggantikan test suite detail milik setiap repository;
- membuat release npm otomatis sebelum release guard disepakati;
- menjadikan Flutter prasyarat untuk gate TypeScript tahap pertama.

### 2.3 Local development versus public integration

Local development boleh memakai cara yang nyaman untuk iterasi, termasuk dependency lokal bila diperlukan dan terdokumentasi. Namun mode public integration harus membangun consumer berdasarkan package, commit, tag, atau artifact yang eksplisit. Tidak boleh ada relative import ke folder sibling yang hanya ada di komputer operator.

## 3. Dependency graph

~~~mermaid
flowchart TD
  workspace["workspace: orchestration"] --> spec["spec: language contract"]
  spec --> geometry["geometry: 2D math"]
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
  playground --> website
~~~

Graph ini menunjukkan urutan validasi, bukan berarti semua package harus saling mengimpor source. Dependency aktual harus dibaca dari package metadata dan lockfile.

## 3.1 Status implementasi versus evidence

| Stage | Implementasi | Evidence yang masih diperlukan |
| --- | --- | --- |
| A — Inventory | Selesai | tidak ada blocker desain |
| B — Baseline | Selesai: manifest, strict verifier, compatibility check, failure injection, dan fresh checkout | tidak ada blocker runtime; regenerasi berikutnya tetap menjadi maintenance |
| C — Packages | Selesai: local/public runner, dependency pinning, pack boundary; local dan public gate lulus | tidak ada blocker pada runtime gate |
| D — Consumers | Selesai: isolated consumer checkout, Pages artifact assembly, dan public smoke; local dan public gate lulus | tidak ada blocker runtime |
| E — CI | Selesai: workflow, report artifact, manual dispatch, timeout, concurrency, read-only checkout, run terbaru hijau, dan failure lama tereproduksi lokal | tidak ada blocker runtime |

## 4. Kondisi awal yang perlu dikunci

Baseline saat sub-rencana dibuat:

| Area | Bukti awal | Cara verifikasi |
| --- | --- | --- |
| Workspace | submodule aktif dan clean | git submodule status, git status |
| Spec | repository spec tersedia | submodule revision dan spec README |
| Packages | package line 0.5.0 | package.json dan registry metadata |
| Playground | build/test/lint/audit UX sudah pernah lulus | package scripts dan CI/local evidence |
| Website | custom Pages workflow aktif | workflow, build, artifact assertions |
| Public routes | smoke script tersedia | website smoke script dan workflow output |

Sebelum implementasi runner, status aktual harus dibaca ulang. Jangan meng-hardcode commit lama tanpa alasan release yang terdokumentasi.

## 5. Bentuk deliverable

### 5.1 Runner

Tambahkan runner portable di repository workspace, disarankan:

~~~text
scripts/run-integration-gate.mjs
~~~

Runner harus:

- dijalankan dari root workspace atau menemukan root berdasarkan lokasi script;
- menggunakan Node yang tersedia dan memberi pesan jika versi tidak cukup;
- tidak bergantung pada shell-specific syntax;
- menerima mode yang jelas, minimal --local dan --report;
- tidak menulis ke repository anak kecuali command build memang melakukannya ke direktori ignored;
- mengembalikan exit code non-zero ketika satu stage wajib gagal;
- menampilkan stage, command, durasi, dan ringkasan hasil;
- tidak mencetak token, environment privat, atau isi file privat.

### 5.2 Manifest baseline

Simpan manifest publik yang menjawab baseline apa yang sedang diuji. Lokasi dan format final diputuskan saat implementasi, tetapi harus memuat minimal:

~~~yaml
compatibilityLine: 0.5
spec:
  path: spec
  revision: <git-commit>
packages:
  - name: "@relgeo/geometry"
    path: geometry
    version: 0.5.0
    revision: <git-commit>
...
consumers:
  - name: playground
    path: playground
    revision: <git-commit>
  - name: website
    path: relgeo.github.io
    revision: <git-commit>
~~~

Nilai <git-commit> harus berasal dari checkout aktual dan tidak boleh ditebak. Jika manifest dipakai sebagai release evidence, perubahan manifest harus melalui review biasa.

### 5.3 Laporan

Runner menghasilkan laporan terminal yang cukup untuk diagnosis dan, bila dibutuhkan, file report ignored atau artifact CI. Laporan publik tidak boleh memuat absolute path komputer operator.

Format minimal:

~~~text
RelGeo integration gate
baseline: <workspace commit>
compatibility: 0.5

[PASS] submodule baseline
[PASS] package metadata
[PASS] geometry: lint, test, build
[FAIL] core: test
      reason: ...
[SKIP] public smoke test
summary: 1 failed, 3 passed, 1 skipped
~~~

### 5.4 Evidence inventory Stage A — 2026-09-15

Inventory awal dibaca dari package metadata, lockfile, submodule status, dan isi ignore rule. Semua submodule berada pada branch main dan working tree clean saat inventory dilakukan.

| Repository | Package manager | Lockfile | Command utama | Catatan |
| --- | --- | --- | --- | --- |
| geometry | pnpm 10.33.3 | pnpm-lock.yaml | lint, test, build | baseline lengkap |
| core | pnpm 10.33.3 | belum ada | lint, test, build | dependency runtime ke geometry; dev dependency ke renderer-svg |
| renderer-svg | pnpm 10.33.3 | belum ada | lint, test, test:dist, build | dependency runtime ke geometry; dev dependency ke core |
| language-service | belum dideklarasikan | belum ada | lint, test, build | peer dependency ke core |
| remark-relgeo-hl | belum dideklarasikan | belum ada | lint, test, build | peer dependency ke language-service |
| remark-relgeo | belum dideklarasikan | belum ada | lint, test, build | runtime dependency ke core dan renderer-svg |
| cli | pnpm 10.33.3 | belum ada | test, build | runtime dependency ke core dan renderer-svg |
| playground | pnpm 10.33.3 | pnpm-lock.yaml | lint, test, audit:ux, build, test:e2e | package private; consumer browser |
| relgeo.github.io | belum dideklarasikan | pnpm-lock.yaml | check, build, test, test:pages-artifact | consumer Astro dan Pages |
| flutter | Flutter/Dart | pubspec.lock | ditentukan oleh pubspec | gate terpisah pada Tahap 6 |
| spec | Git/documentation | tidak relevan | tidak ada package command | source contract; perlu validator khusus bila dibutuhkan |

Temuan yang memengaruhi desain runner:

1. package manager dan lockfile belum seragam pada seluruh package; runner tidak boleh mengasumsikan semua repository memiliki lockfile sendiri;
2. website dan Playground memiliki lockfile sendiri, sedangkan package library mengandalkan registry dependency resolution;
3. core dan renderer-svg memiliki cycle pada dev dependency; cycle ini harus dicatat dan tidak boleh diselesaikan dengan relative source import tersembunyi;
4. package manager yang belum dideklarasikan perlu diputuskan apakah akan distandardisasi sebelum CI gate final;
5. command release seperti pack dry-run tetap menjadi gate terpisah dari lint, test, dan build.

## 6. Stage implementasi

### Stage A — Inventory dan command contract

**Output:** tabel command nyata untuk setiap repository.

Checklist:

- [x] baca package.json atau README pemilik;
- [x] catat package manager dan lockfile;
- [x] catat command install, lint, test, build, pack;
- [x] catat dependency upstream/downstream;
- [x] catat bahwa dist/build output memakai ignore rule pada repository yang memiliki output build;
- [x] catat prerequisite seperti npm authentication atau browser; gate install publik tidak memerlukan auth/browser, sedangkan publish dan smoke release tetap memerlukannya;
- [x] bedakan command wajib dari command opsional pada inventory awal.

Acceptance:

- [x] tidak ada command gate yang dibuat berdasarkan asumsi; command awal berasal dari metadata repository;
- [x] setiap stage pada sub-rencana memiliki owner koordinasi workspace atau owner repository consumer;
- [x] cycle dependency dicatat sebagai fakta dan tidak disembunyikan.

### Stage B — Baseline manifest dan submodule verification

**Output:** manifest baseline dan helper verifikasi.

Checklist:

- [x] baca root commit workspace;
- [x] baca commit setiap submodule;
- [x] baca branch/tag yang tersedia;
- [x] baca package name/version untuk setiap package;
- [x] pastikan package version sesuai compatibility line;
- [x] fail jika submodule belum di-initialize atau working tree kotor pada mode strict;
- [x] sediakan mode read-only untuk diagnosis lokal.

Acceptance:

- [x] manifest baseline publik disimpan dan memiliki revision setiap submodule;
- [x] verifikasi tidak membutuhkan akses GitHub API;
- [x] verifier membandingkan gitlink, checkout aktual, dan manifest;
- [x] helper untuk regenerasi manifest dengan opsi `--write` tersedia;
- [x] regenerasi manifest berhasil dijalankan pada runtime Node;
- [x] helper failure injection untuk pointer yang berubah tersedia dan dijalankan sebagai gate.

### Stage C — Package gate dalam dependency order

Urutan awal:

~~~mermaid
flowchart LR
  geometry["geometry"] --> core["core"]
  core --> rendererSvg["renderer-svg"]
  core --> languageService["language-service"]
  rendererSvg --> remarkRelgeo["remark-relgeo"]
  languageService --> remarkHl["remark-relgeo-hl"]
  core --> cli["cli"]
  rendererSvg --> cli
~~~

Checklist:

- [x] runner mendefinisikan geometry: lint, test, build;
- [x] runner mendefinisikan core: lint, test, build;
- [x] runner mendefinisikan renderer-svg: lint, test, build, test:dist;
- [x] runner mendefinisikan language-service: lint, test, build;
- [x] runner mendefinisikan remark-relgeo-hl: lint, test, build;
- [x] runner mendefinisikan remark-relgeo: lint, test, build;
- [x] runner mendefinisikan cli: test, build;
- [x] catat dependency peer yang membutuhkan package registry (`language-service` → `core`, `remark-relgeo-hl` → `language-service`);
- [x] runner public mendefinisikan `npm pack --dry-run` sebagai boundary release, bukan pengganti test.
- [x] runner public memeriksa daftar file pack dan menolak path traversal, path absolute, secret, serta direktori lokal.

Evidence runtime: baseline manifest sekarang konsisten dengan `.gitmodules`; local gate final pada workspace clean lulus `36/36` dengan Node 24.21.0 dan pnpm 10.33.3. Public-registry gate sebelumnya juga lulus `48/48` pada toolchain yang sama.

Acceptance:

- [x] setiap package lulus command gate dari root workspace;
- [x] runner public menyalin package ke temporary checkout tanpa sibling source dan meng-install dari npm registry;
- [x] runner public mem-pin dependency `@relgeo/*` ke versi baseline manifest pada temporary checkout;
- [x] package consumer lulus terhadap package registry publik;
- [x] failure runner menyebut package dan command yang gagal.

### Stage D — Consumer gate

Checklist:

- [x] runner mendefinisikan install dan lint/test/audit UX/build Playground;
- [x] lint, test, audit UX, dan build Playground lulus pada execution terbaru;
- [x] worker Playground terverifikasi memakai package yang terinstall;
- [x] runner public menyalin Playground dan website tanpa sibling source, sehingga alias lokal tidak dapat aktif;
- [x] runner merakit hasil build Playground ke `website/dist/playground` sebelum `test:pages-artifact`, seperti workflow Pages;
- [x] package consumer lulus tanpa workspace link ke source sibling;
- [x] runner mendefinisikan install dan check/build/test/artifact assertion website;
- [x] website check/build/test/artifact assertion lulus pada execution terbaru;
- [x] public smoke test dijalankan setelah deployment yang berhasil.

Evidence public runtime (2026-09-15): `node relgeo.github.io/scripts/smoke-public-site.mjs` terhadap `https://relgeo.github.io` menghasilkan HTTP 200 untuk seluruh 14 route, termasuk `/playground/`, `/sitemap.xml`, `/favicon.svg`, dan `/apple-touch-icon.png`.

Acceptance:

- [x] Playground berhasil tanpa hack path lokal;
- [x] website berhasil tanpa mem-build source sibling secara implisit;
- [x] output website memuat docs/spec/playground route yang diharapkan.

### Stage E — CI integration job

Workflow CI sudah menjalankan runner setelah kontrak Stage A–D dan runner tersedia. Run terbaru yang diverifikasi adalah `Integration #132` untuk commit `321c7b2` pada `relgeo/workspace`; job `flutter`, `flutter-macos`, `verify`, dan `public` semuanya sukses. Baseline ini juga membawa browser smoke Playground deployment-aware melalui `PLAYWRIGHT_BASE_URL` serta guard release-record sebelum integration gate.

Checklist:

- [x] workspace menjadi pemilik workflow integration;
- [x] gunakan Node 24 dan pnpm version yang eksplisit;
- [x] gunakan cache pnpm dengan root lockfile;
- [x] workflow mengonfigurasi artifact report ketika gate gagal atau selesai;
- [x] permission workflow minimal;
- [x] workflow tidak mengubah atau publish repository;
- [x] workflow menampilkan workspace revision dan compatibility line sebagai job summary;
- [x] workflow memiliki job public-registry terpisah dari local-workspace job;
- [x] workflow menyediakan `workflow_dispatch`, timeout per job, dan concurrency cancellation;
- [x] checkout CI tidak menyimpan credential Git dan report artifact memiliki retensi terbatas;
- [x] workflow terbaru menjalankan gate sampai selesai.

Acceptance:

- [x] local dan CI menjalankan entrypoint yang sama atau perbedaan dijelaskan;
- [x] failure CI tertentu dapat direproduksi secara lokal;
- [x] workflow tidak bergantung pada branch atau path yang hanya ada di mesin operator.

## 7. Keputusan yang harus dibuat saat implementasi

Berikut bukan blocker untuk menulis sub-rencana, tetapi harus diputuskan sebelum runner dianggap final:

1. Apakah install harus selalu memakai npm registry publik, atau boleh memakai workspace package/link mode pada mode local?
2. Apakah gate strict mengharuskan semua submodule clean, atau hanya pointer commit yang tepat?
3. Apakah package pack dry-run dijalankan pada setiap PR atau hanya release candidate?
4. Apakah website public smoke menjadi bagian gate lokal, gate Pages, atau keduanya?
5. Apakah manifest baseline di-commit sebagai release snapshot atau selalu digenerate saat CI?
6. Apakah Flutter mempunyai gate terpisah atau dimasukkan setelah capability matrix tersedia?

Default yang disarankan:

- public mode memakai registry dan lockfile;
- strict mode menolak working tree kotor;
- pack dry-run masuk release candidate;
- public smoke tetap menjadi job setelah deploy, sedangkan gate lokal memeriksa built output;
- manifest release di-commit, manifest diagnosis boleh digenerate;
- Flutter tetap gate terpisah pada Tahap 6.

## 8. Risiko dan mitigasi

| Risiko | Dampak | Mitigasi |
| --- | --- | --- |
| package registry belum berisi versi yang dibutuhkan | consumer gagal install | fail fast dengan pesan publish order dan versi |
| lockfile berbeda dari package.json | CI reproducibility rusak | frozen install sebagai default |
| cycle dependency dev | install/build membingungkan | catat cycle; jangan menyelesaikannya dengan source path tersembunyi |
| local relative path tersisa | build publik hanya lulus di satu mesin | grep/audit import dan clean checkout build |
| build menulis file tracked | working tree kotor setelah gate | gunakan dist ignored atau verifikasi lalu bersihkan dengan aman |
| workflow terlalu besar | diagnosis lambat | stage log dan job summary |
| baseline berubah diam-diam | hasil tidak dapat dibandingkan | manifest revision dan commit/tag eksplisit |

## 9. Exit gate Tahap 1

Tahap 1 hanya boleh ditandai selesai jika:

- [x] runner documented tersedia dari root workspace;
- [x] runner berhasil dari fresh checkout lokal;
- [x] semua package wajib lulus dalam dependency order pada checkout kerja lokal;
- [x] Playground lulus tanpa relative source dependency;
- [x] website lulus build dan artifact assertions pada checkout kerja lokal;
- [x] runner menghasilkan report yang menyebut workspace revision, baseline revision setiap submodule, compatibility line, dan versi package;
- [x] minimal satu CI workflow menjalankan gate atau subset yang setara;
- [x] failure injection sederhana terbukti menghasilkan failure yang jelas pada verifier;
- [x] dokumentasi root menjelaskan cara menjalankan gate;
- [x] master plan diperbarui dengan commit implementasi dan bukti runtime local/public/fresh-checkout/CI yang tersedia; public smoke dan reproduksi failure CI tertentu tetap terbuka.

## 10. Rencana eksekusi berikutnya

Implementasi runner sudah tersedia dan telah lulus pada local, public-registry, fresh-checkout, CI, serta public smoke. Failure CI lama juga sudah direproduksi pada checkout bersih dengan environment CI yang sama; Tahap 1 selesai dan pekerjaan berikutnya kembali ke urutan master plan.

Prasyarat runtime:

- Node.js 24 atau lebih baru;
- pnpm 10.33.3;
- checkout workspace dengan seluruh submodule ter-initialize;
- akses network ke npm registry untuk mode public;
- tidak ada perubahan tracked pada submodule ketika memakai mode strict.

Urutan kerja konkret:

1. jalankan `pnpm install --frozen-lockfile` dari root workspace;
2. jalankan `node scripts/verify-baseline.mjs --strict`;
3. jalankan `pnpm run verify:baseline:failure` dan pastikan mismatch revision ditolak;
4. jalankan `pnpm run integration:gate -- --local --report=.local/integration-local.json`;
5. setelah mode local lulus, jalankan `pnpm run integration:public -- --report=.local/integration-public.json`;
6. review report untuk package, Playground, website, dan artifact yang gagal; perbaiki di repository pemiliknya;
7. push workflow workspace, jalankan `Integration` melalui push, pull request, atau `workflow_dispatch`, lalu simpan URL run dan artifact report; **selesai**, `Integration #91` lulus;
8. setelah Pages deployment berhasil, jalankan public smoke test dan catat URL, commit website, serta baseline spec/Playground; **selesai**, 14 route pada `https://relgeo.github.io` mendapat HTTP 200;
9. pilih satu failure CI yang representatif, simpan log ringkasnya, lalu reproduksi dengan failure injection/local command; **selesai**, checkout `fe94149` menghasilkan 30 lulus dan 3 gagal pada package yang sama seperti CI;
10. setelah evidence reproduksi failure tersedia atau diputuskan tidak diperlukan untuk baseline, centang exit gate dan update master plan; **selesai**.

Mode public sengaja menguji versi registry yang dipin ke manifest, sedangkan mode local menguji workspace links. Keduanya diperlukan karena lulusnya satu mode tidak membuktikan mode lainnya.

## 11. Log perubahan sub-rencana

| Tanggal | Perubahan | Status |
| --- | --- | --- |
| 2026-09-15 | Sub-rencana Tahap 1 dibuat berdasarkan dependency graph dan kondisi baseline saat ini | siap untuk Stage A |
| 2026-09-15 | Inventory command, lockfile, package manager, dependency, dan clean status selesai | Stage A read-only selesai; package-manager standardization masih terbuka, sedangkan prerequisite auth/browser sudah dibedakan dari gate |
| 2026-09-15 | Manifest baseline dan verifier read-only ditambahkan | Stage B implementasi selesai; runtime regeneration masih terbuka |
| 2026-09-15 | Local-workspace integration runner dan workflow report ditambahkan | command Stage C/D terhubung; runtime evidence, registry mode, dan CI run masih terbuka |
| 2026-09-15 | Runner public-registry ditambahkan dengan temporary checkout dan pack dry-run | implementasi public mode selesai; runtime npm/CI evidence masih terbuka |
| 2026-09-15 | Failure injection verifier ditambahkan; peer dependency registry boundary dicatat | implementasi guard selesai; runtime gate dan CI evidence masih terbuka |
| 2026-09-15 | Runner diperketat dengan Node 24 check dan perakitan artifact Playground sebelum Pages assertion | implementasi fresh-checkout path lebih dekat dengan workflow Pages; runtime evidence masih terbuka |
| 2026-09-15 | Commit `cb98092` mem-pin versi registry pada temporary public gate | drift patch dependency ditutup secara desain; eksekusi npm/CI masih terbuka |
| 2026-09-15 | Workflow integration ditambah manual dispatch, timeout, dan concurrency cancellation | rerun manual dan proteksi terhadap run menumpuk tersedia; CI execution evidence masih terbuka |
| 2026-09-15 | Checkout CI dibuat read-only dan report artifact diberi retensi 7 hari; instruksi execution evidence diperbarui | hardening implementasi selesai; seluruh bukti runtime masih menunggu eksekusi |
| 2026-09-15 | Public pack boundary membaca output JSON dan menolak material lokal/secret/path traversal | implementasi tarball hygiene selesai; pack runtime masih menunggu CI/npm execution |
| 2026-09-15 | Pack boundary diperluas untuk seluruh file `.env.*`; pin registry dibatasi ke package `@relgeo/*` | hardening static selesai; runtime pack dan public gate masih terbuka |
| 2026-09-15 | Status matrix implementasi-versus-evidence ditambahkan dan master plan diselaraskan | pekerjaan implementasi terpetakan; runtime evidence tetap terbuka |
| 2026-09-15 | Node 24.21.0 dan pnpm 10.33.3 dipakai untuk strict verifier, failure injection, dan local integration gate | strict verifier serta failure injection lulus; local gate 33/33 lulus |
| 2026-09-15 | Public gate pertama menemukan fixture workspace, import sibling, dan urutan build/test yang belum checkout-safe; runner dan test boundary diperbaiki | diagnosis selesai; perubahan renderer-svg dan runner perlu masuk baseline |
| 2026-09-15 | Public-registry gate final dijalankan pada Node 24.21.0/pnpm 10.33.3 dengan package `@relgeo/*` dipin ke manifest | 48/48 stage lulus, termasuk Playground, website, Pages artifact assertion, dan pack boundary |
| 2026-09-15 | Fresh checkout probe dari commit workspace `a65c542` berhasil mengambil 10 submodule lalu berhenti karena commit `renderer-svg@3b66780` belum tersedia pada remote GitHub | blocker diselesaikan dengan push submodule renderer-svg dan root pointer |
| 2026-09-15 | Fresh checkout dari GitHub `workspace@8d54163` diinisialisasi dengan seluruh 11 submodule dan menjalankan strict verifier serta local integration gate | fresh-checkout lulus; strict verifier 81 checks dan integration gate 33/33 lulus |
| 2026-09-15 | Workflow GitHub `Integration #87` pada commit `04960d3` diverifikasi selesai sukses | CI integration gate lulus; public smoke dan reproduksi failure CI tertentu masih terbuka |
| 2026-09-15 | Public smoke test dijalankan terhadap `https://relgeo.github.io` | 14/14 route HTTP 200; public smoke lulus; hanya reproduksi failure CI tertentu yang tersisa |
| 2026-09-15 | Failure run `#85` direproduksi dari checkout bersih `fe94149` dengan `CI=1` | gate lama menghasilkan 30 passed dan 3 failed pada `renderer-svg`, `remark-relgeo`, dan `cli`; akar masalah urutan test sebelum build serta import dist lokal; failure dapat direproduksi dan sudah tertutup oleh baseline baru |
| 2026-09-16 | Local integration gate diperluas dengan automated browser smoke Playground | gate memasang Chromium sesuai environment, menjalankan `test:e2e` setelah build, dan menjaga unit test terpisah dari folder `e2e`; CI pascapush masih diperlukan |
| 2026-09-16 | Baseline revision website, Playground, dan Flutter disegarkan setelah submodule dipush | strict verifier lulus `81/81`; integration gate lokal pada workspace clean lulus `36/36`, termasuk package, E2E, website, Pages artifact, dan conformance `204/204` |
| 2026-09-16 | Official Playground E2E dibuat deployment-aware | `playwright.config.ts` menerima `PLAYWRIGHT_BASE_URL`, `goto('./')` aman untuk base path `/playground/`, dan command yang sama lulus lokal `2/2` serta terhadap `https://relgeo.github.io/playground/` `2/2`; perubahan dipush sebagai `playground@143acf6` |
| 2026-09-16 | CI memverifikasi baseline Playground deployment-aware | root pointer `playground@143acf6` tercatat pada `workspace@9e77d33`; local integration gate lulus `36/36` dan GitHub `Integration #94` sukses pada job `flutter`, `verify`, dan `public` |
| 2026-09-18 | CI memverifikasi release record completed dan Flutter macOS pada baseline terbaru | `Integration #129` pada `workspace@aea1188` sukses pada job `verify`, `flutter`, `flutter-macos`, dan `public`; release record `0.5.0`/`0.5.1`, failure-injection release guard, conformance, serta dua browser smoke tetap lulus |
| 2026-09-18 | Pin Node lokal ditambahkan dan diverifikasi pada CI | root `workspace@321c7b2` memiliki `.node-version` `24.21.0`; `Integration #132` sukses pada job `verify`, `flutter`, `flutter-macos`, dan `public` dengan durasi 3m58s |
