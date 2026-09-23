# Workspace Scripts

Folder ini akan berisi script portable untuk bootstrap dan verification lintas-repo.

Script root harus:

1. menggunakan Git dan command repository umum;
2. tidak bergantung pada aplikasi operator tertentu;
3. aman dijalankan dari fresh clone;
4. menjelaskan dependency dan failure dengan jelas;
5. tidak membaca atau mempublikasikan isi `.local/` dan `private/`.

Integration gate membutuhkan Node.js 24 atau lebih baru dan pnpm 10.33.3; workflow CI mengonfigurasi keduanya secara eksplisit. Root juga mem-pin Node `24.21.0` pada `.node-version` agar local operator tidak menjalankan Node 22 secara tidak sengaja.

Script deployment detail menjadi ownership repository tujuan masing-masing.

## Verifikasi baseline dan integration gate

Baseline submodule dan metadata package dapat diverifikasi dari root workspace dengan:

~~~text
node scripts/verify-baseline.mjs
node scripts/verify-baseline.mjs --strict
node scripts/verify-baseline.mjs --write --strict
node scripts/verify-baseline.mjs --strict --require-main
node scripts/test-baseline-failure.mjs
pnpm run integration:gate -- --local --report=.local/integration-local.json
pnpm run integration:public -- --report=.local/integration-public.json
~~~

Mode `--local` juga memasang Chromium Playwright bila diperlukan dan menjalankan automated browser smoke Playground setelah build. Jika browser Chromium-compatible sudah tersedia tetapi disk tidak cukup untuk cache Playwright, set `PLAYWRIGHT_EXECUTABLE_PATH`; gate akan melewati download hanya pada kondisi itu:

~~~text
PLAYWRIGHT_EXECUTABLE_PATH="/path/to/your/chromium-or-chrome" pnpm run integration:gate -- --local
~~~

Hasil pass/fail dicetak langsung pada log gate; browser trace atau source tidak diunggah otomatis. CI tidak mengatur variabel fallback tersebut dan tetap memasang browser pinned.

Manifest snapshot publik berada di `docs/integration-baseline.json`. Verifier tidak membutuhkan GitHub API; ia membandingkan manifest dengan gitlink workspace, checkout submodule, working tree, dan `package.json` lokal. Opsi `--write` memperbarui snapshot dari checkout saat ini dan hanya boleh dipakai secara sengaja. Opsi `--manifest=PATH` dipakai oleh failure-injection untuk menguji snapshot sementara tanpa mengubah file publik. Opsi `--require-main` hanya untuk validasi lokal; CI submodule checkout biasanya detached.

Mode `--local` menggunakan root pnpm workspace dan workspace links. Mode `--public` menyalin setiap consumer ke direktori temporary tanpa sibling submodule, lalu meng-install dependency dari npm registry dan menjalankan package/consumer checks di sana. Mode public juga menjalankan `npm pack --dry-run --json` untuk package library dan menolak path absolute/parent traversal serta material `node_modules`, `.git`, file `.env`/`.env.*`, secret, dan direktori lokal.

Mode public menambahkan override sementara di checkout temporary agar seluruh dependency `@relgeo/*` tepat pada versi baseline manifest, lalu mengabaikan lockfile temporary. Override dan perubahan package manager ini tidak pernah ditulis kembali ke repository sumber.

Sebelum assertion Pages website, runner menyalin `playground/dist` hasil build ke `relgeo.github.io/dist/playground`. Ini meniru perakitan artifact pada workflow Pages dan menjaga agar `test:pages-artifact` tidak lulus atau gagal karena state `dist` lama.

JSON report integration memuat mode, workspace revision, baseline revision setiap submodule, compatibility line, metadata package, serta hasil tiap command. Report ini aman diunggah sebagai artifact CI karena tidak menyimpan absolute path temporary atau environment privat.

## Compatibility matrix

Jalankan pemeriksaan konsistensi kontrak dan versi dari root workspace:

~~~text
pnpm run compatibility:check
~~~

Checker membaca `docs/compatibility-matrix.json`, lalu membandingkannya dengan baseline gitlink, `package.json` setiap package/application, deklarasi compatibility pada README, dependency internal, dan release order. Checker sengaja memeriksa policy aktif (`@relgeo/*` memakai `^0.5.0`) tanpa melakukan publish.

Workflow Integration menjalankan pemeriksaan ini sebelum local cross-repo gate. Failure berarti compatibility line, metadata package, deklarasi README, internal dependency range, revision spec, atau release order perlu diperbarui secara terkoordinasi.

Untuk inventory behavior historis dan mismatch penamaan contoh, jalankan:

~~~text
pnpm run compatibility:audit
~~~

Command ini bersifat read-only. Audit memisahkan active `v0.5`, supported legacy `v0.4`, regression-only `v0.1`–`v0.3`, dan future/unknown version yang ditolak parser. Warning hanya dipakai untuk behavior yang masih memerlukan keputusan terpisah.

## Shared conformance fixtures

Jalankan fixture lintas surface dari root workspace:

~~~text
pnpm run conformance:fixtures
~~~

Runner membaca `fixtures/manifest.json` dan fixture YAML di `fixtures/reference/`. Fixture
`active` diuji melalui parse, resolve, renderer SVG, language service, highlighting,
Markdown preview, dan CLI. Fixture `supported-legacy` menjaga bukti backwards
compatibility. Fixture `invalid` harus ditolak parser dan menghasilkan diagnostics yang
dapat dibaca language service. Fixture `runtime-diagnostic` harus tetap lolos
parse/resolve, tetapi menghasilkan violation terstruktur yang diharapkan setelah resolve.
Fixture `capability` adalah candidate untuk capability yang belum dipromosikan ke
active contract; runner mewajibkan expected scene/output snapshot dan tetap
melaporkan evidence-nya terpisah dari baseline aktif.

Runner ini adalah gate workspace-level. Repository anak tetap dapat diuji standalone,
tetapi fixture bersama perlu disediakan oleh checkout workspace atau oleh packaging test
yang eksplisit; runner tidak mengubah repository anak secara diam-diam.

Untuk menyiapkan fixture canonical ke staging directory Flutter yang di-ignore:

~~~text
pnpm run fixtures:stage:flutter
RELGEO_FIXTURE_ROOT=.local/flutter-fixtures flutter test test/reference_fixtures_test.dart
~~~

Tool staging tidak mengubah fixture sumber dan tidak menghapus directory output. CI dapat
memberikan `--out=PATH` ke directory temporary yang baru dibuat, lalu meneruskan path yang
sama sebagai `RELGEO_FIXTURE_ROOT`.

Untuk menjalankan seluruh urutan verifikasi Flutter, gunakan runner workspace:

~~~text
pnpm run flutter:conformance
~~~

Runner tersebut men-stage fixture canonical ke directory temporary, lalu menjalankan
`flutter pub get --enforce-lockfile`, `flutter analyze --no-fatal-warnings
--no-fatal-infos`, dan `flutter test` dari repository Flutter. Warning/info analyzer tetap
dicetak sebagai debt yang terlihat, tetapi tidak memblokir baseline conformance sampai
lint debt itu ditangani secara terpisah. Runner berhenti dengan status `2` bila Flutter SDK
tidak tersedia. Gunakan `RELGEO_FLUTTER_BIN` jika executable Flutter tidak bernama
`flutter` atau tidak berada di `PATH`.

Evidence lokal 2026-09-16: Flutter `3.41.9`, Dart `3.11.5`, 18 fixture canonical pada workspace (16 fixture di-stage untuk runner Flutter), dan 119
test Flutter lulus. Checkout Flutter terisolasi juga lulus 99 test dengan 7 shared-fixture
test dilewati secara eksplisit; CI tetap merupakan gate terpisah.

## Release readiness dan post-publish verification

Sebelum menjalankan publish manual, jalankan preflight read-only dari working tree
yang sudah bersih. Preflight tidak menjalankan `npm publish`; ia memeriksa baseline,
compatibility matrix, release decision record, audit tarball, dan integration gate
lokal dalam urutan yang sama dengan release boundary:

~~~text
pnpm run release:preflight
pnpm run release:preflight -- --report=.local/release-preflight.json
pnpm run release:preflight -- --record=0.5.1 --report=.local/release-preflight-0.5.1.json
~~~

Gunakan `--record=<version>` untuk memilih record selain default baseline
`0.5.0`. `release:record:check` dapat memvalidasi record berstatus `planned`
atau `partial` sebagai dokumen rencana, tetapi preflight release final hanya
menerima record berstatus `completed`. Dengan demikian candidate dapat direview
lebih awal tanpa membuatnya terlihat sudah dipublish.

Untuk memeriksa candidate patch terhadap checkout lokal sebelum bump versi, jalankan:

~~~text
pnpm run release:candidate:audit -- --version=0.5.1
~~~

Audit ini tidak mengubah file dan tidak menghubungi npm. Ia memeriksa bahwa candidate
berstatus `planned` atau `partial`, working tree bersih, package yang direncanakan
masih berasal dari versi dasar atau sudah berada pada target, dan revision source
change masih cocok dengan record. Status `INFO` menunjukkan package yang masih perlu
dinaikkan versinya; itu bukan keberhasilan publish.

Jika ada perubahan yang belum di-commit, preflight berhenti sebelum menjalankan gate.
Report opsional hanya berisi status command dan durasi, bukan credential atau output
tarball.

Sebelum publish package, jalankan audit metadata dan isi tarball:

~~~text
pnpm run release:audit
~~~

Audit memeriksa package publik pada matrix, license MIT, author, repository, `package.json.files`, serta output `npm pack --dry-run --json`. File di luar allowlist publik membuat command gagal.

Setelah publish manual, verifikasi bahwa versi yang diharapkan benar-benar tersedia di npm:

~~~text
pnpm run release:verify-published
~~~

Verifier hanya membaca registry dan tidak memerlukan token publish. Checklist urutan publish dan recovery partial release ada di [03-npm-release-guard.md](../docs/plans/03-npm-release-guard.md).

Decision record release lintas-repo disimpan di [`docs/releases/`](../docs/releases/). Validasi snapshot machine-readable baseline dapat dijalankan dengan:

~~~text
pnpm run release:record:check
~~~

Validator memastikan compatibility line, revision `spec`, release order, seluruh package, seluruh consumer, status evidence, dan batasan publik record tetap cocok dengan matrix. Validator tidak menjalankan publish dan tidak menyimpan credential.

Untuk menyusun recovery plan secara read-only dari release record berstatus `partial`:

~~~text
pnpm run release:recovery:plan -- --record-file=docs/releases/<partial-version>.json
pnpm run release:recovery:plan -- --record-file=docs/releases/<partial-version>.json --json
~~~

Planner hanya membaca matrix dan record. Ia tidak menjalankan `git`, `npm publish`, atau
mengubah file apa pun.

Failure-injection release record sengaja membuat candidate `0.5.1` menjadi partial dengan
forward-fix yang sama seperti versi gagal. Command ini harus gagal dan membuktikan bahwa
guard menolak recovery yang mencoba memakai ulang versi npm yang sama:

~~~text
pnpm run release:record:failure
~~~
