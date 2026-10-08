# Compatibility behavior audit

**Status:** inventory dan parser/version policy selesai. Release decision guard tersedia; npm publish tidak diklaim atomik. Promotion `boolean/intersection` diterapkan pada fixture 15 dan capability matrix untuk boundary terbatas; evaluator/unit tetap candidate.
**Tanggal:** 2026-09-15 (status direkonsiliasi 2026-10-09)
**Scope:** `spec`, `core`, `renderer-svg`, `language-service`, `cli`, Markdown plugins, Playground, website, Flutter, matrix, fixtures, dan test suite

## Ringkasan

Kontrak publik yang dinyatakan saat ini adalah `RelGeo DSL v0.5`. Implementasi dan regression test masih memuat banyak coverage historis `v0.1` sampai `v0.4`. Itu belum otomatis berarti seluruh versi tersebut merupakan public support promise: matrix, manifest, dan parser sekarang memisahkan active, supported legacy, regression-only, serta future/unknown version secara eksplisit.

Kesimpulan audit: tidak ditemukan consumer yang sengaja memakai dependency package dari compatibility line berbeda. Policy versi historis dan batas parser kini eksplisit serta dijaga oleh matrix, manifest, parser, dan negative conformance fixtures.

Inventory ini dapat diulang dengan `pnpm run compatibility:audit`. Command bersifat read-only dan menampilkan warning untuk gap yang memang masih menunggu keputusan kontrak.

## Evidence yang diperiksa

| Area | Evidence | Hasil |
| --- | --- | --- |
| Public contract | `docs/compatibility-matrix.json`, README package, `fixtures/manifest.json` | line publik aktif adalah `0.5` |
| Parser | `core/src/parser.ts` | active `0.5`, supported legacy `0.4`, regression-only `0.1`–`0.3`, omitted version default `0.5`, dan unsupported-version diagnostic eksplisit |
| Runtime regression | test `core` dan `renderer-svg` | test historis menggunakan dokumen `v0.1`, `v0.2`, `v0.3`, dan `v0.4` |
| Language service | `language-service/src/__tests__/language_service.test.ts` | ada coverage `v0.3`, `v0.4`, dan `v0.5` |
| Shared fixture | `fixtures/manifest.json` | 2 active `v0.5` (relational baseline dan boolean/intersection), 9 supported-legacy `v0.4`, 5 invalid (termasuk future/unknown version), 1 runtime-diagnostic `v0.5`, 2 runtime-error `v0.5`, 1 capability candidate `v0.5` (evaluator/unit) |
| Playground examples | `playground/src/examples.ts` dan raw YAML | contoh historis `v0.2`/`v0.3` diberi label historical; nama file aktif sudah diselaraskan ke `v05_*` tanpa mengubah example key internal |
| Intentional fallback | `playground/src/share-code.ts`, `playground/src/clipboard.ts`, UX audit | Base64 legacy dan clipboard fallback sudah diberi alasan serta test/contract coverage |
| Dependency line | `scripts/check-compatibility.mjs` | dependency `@relgeo/*` tetap pada `^0.5.0`; checker lulus `256/256`, termasuk record non-Node Flutter |
| Flutter consumer | `flutter/pubspec.yaml`, Flutter source/tests, shared fixture adapter | workbench non-publishable pada DSL `0.5`; fixture 15 lulus canonical cross-platform CI run 37832260326, evaluator/unit tetap candidate |

## Findings

### F01 — Version acceptance parser sekarang eksplisit

`core/src/parser.ts` sekarang menetapkan versi aktif/default, daftar supported legacy, daftar regression-only, dan diagnostic khusus untuk versi yang tidak dikenal. Future/unknown versions ditolak sebelum validasi semantic lain dijalankan.

**Dampak yang ditutup:** sedang–tinggi. Ketika kontrak `0.6` muncul, parser tidak lagi terlihat menerima header versi baru secara diam-diam.

**Status:** selesai. Parser memakai allowlist eksplisit; future/unknown version menghasilkan `UNSUPPORTED_SPEC_VERSION`. Negative fixture `17-v06-invalid-unsupported-version.yaml` dan `18-v10-invalid-unknown-version.yaml` memastikan behavior ini pada core dan language-service.

### F02 — Regression coverage historis dipisahkan dari public fixture policy

Test package memelihara coverage `v0.1`–`v0.4`, sedangkan fixture canonical hanya memberi status `supported-legacy` untuk `v0.4`. Coverage test historis itu berguna, tetapi statusnya belum dipisahkan secara machine-readable antara “tested for regression” dan “publicly supported”.

**Dampak yang ditutup:** sedang. Status `supported-legacy` dan `regression-only` kini dibedakan machine-readable pada matrix/manifest dan dijelaskan di parser.

**Status:** selesai untuk policy baseline. Test lama dipertahankan sebagai regression coverage; public promise hanya mencakup active `0.5` dan supported legacy `0.4`.

### F03 — Nama file contoh sudah selaras dengan deklarasi DSL

Tujuh contoh aktif sebelumnya memakai prefix `v04_` meskipun mendeklarasikan `version: 0.5`. File sekarang memakai prefix `v05_`; key internal seperti `v04_flange` tetap dipertahankan agar pilihan yang tersimpan di browser tidak hilang.

**Dampak yang ditutup:** rendah–sedang. Nama file sekarang tidak lagi menyesatkan maintainer atau pembaca fixture, sementara state lokal lama tetap kompatibel.

**Status:** selesai. Rename sudah dilakukan dan lint, unit test `85/85`, audit UX, serta production build Playground lulus.

### F04 — Fallback yang memang disengaja sudah terdokumentasi

Decoder share link menerima format Base64URL baru dan Base64 padded lama. Clipboard memiliki fallback gesture-based ketika Clipboard API ditolak. Keduanya tercatat dalam UX/UI audit dan memiliki regression/contract coverage.

**Status:** selesai untuk inventory saat ini.

### F05 — Diagnostic `align` Flutter sempat tidak mengikuti kontrak TypeScript

Fixture `14-v05-runtime-align-violation.yaml` menjadi pembanding yang konkret. TypeScript menghasilkan jarak Euclidean `14.1421`, message `Points are not aligned. Distance: 14.1421`, path `constraints[0]`, dan `involvedObjects: []`. Implementasi Flutter saat ini memproses axis `both` sebagai komponen X/Y, menghasilkan message `X misalignment: 10.000. Y misalignment: 10.000.`, deviation maksimum `10`, path `constraints.align`, dan mengekstrak object IDs.

**Dampak:** tinggi untuk semantic conformance. UI Flutter dapat terlihat benar karena tetap menampilkan violation, tetapi consumer yang membaca diagnostic terstruktur akan memperoleh kontrak berbeda.

**Status:** perbaikan default point alignment sudah diterapkan secara lokal dan regression test inline ditambahkan. Runner Flutter memverifikasi fixture runtime-diagnostic canonical, termasuk index constraint, formula deviation, message, dan aturan `involvedObjects` sesuai baseline TypeScript; job Flutter `Integration #91` juga lulus.

## Yang sudah ditutup oleh audit

- [x] public compatibility line `0.5` teridentifikasi dari matrix, README, dan fixture manifest;
- [x] dependency internal lintas package tidak mencampur line dan diverifikasi oleh checker;
- [x] fallback historis Playground yang disengaja ditemukan dan sudah terdokumentasi;
- [x] regression coverage versi lama diinventarisasi;
- [x] mismatch nama file contoh vs deklarasi versi dicatat agar tidak menjadi asumsi tersembunyi.
- [x] historical/future version policy ditetapkan pada matrix dan manifest, lalu dijaga oleh parser serta negative fixtures.
- [x] inventory dan mismatch dapat dideteksi ulang oleh `pnpm run compatibility:audit`.
- [x] Flutter dicatat sebagai consumer non-Node dan delta diagnostic `align` terhadap TypeScript ditemukan dari source.

## Policy yang disahkan untuk baseline 0.5

Bagian ini adalah policy baseline yang sudah diterapkan pada matrix, manifest, parser, dan conformance runner.

| Version | Status | Makna operasional |
| --- | --- | --- |
| `0.5` | active public line | contract utama untuk package, Playground, website, dan fixture baru |
| `0.4` | supported legacy | tetap diterima pada surface yang sudah memiliki coverage; tidak menerima fitur `0.5` secara diam-diam |
| `0.1`–`0.3` | regression-only | test lama boleh dipertahankan untuk mencegah regresi, tetapi tidak dijanjikan sebagai compatibility target publik |
| `>0.5` seperti `0.6` | unsupported until declared | strict validation gagal dengan diagnostic `UNSUPPORTED_SPEC_VERSION`; editor dapat tetap menampilkan source sebagai teks dengan diagnostic yang jelas |
| version omitted | defaults to active | tetap diperlakukan sebagai `0.5` demi backward-friendly authoring dan perlu dicatat pada dokumentasi |

Implementasi policy ini:

1. `versionAcceptance` pada matrix dan manifest memisahkan active, supported legacy, regression-only, omitted default, dan future policy;
2. parser core menolak future/unknown version dengan diagnostic code khusus;
3. fixture `17` dan `18` mengunci negative behavior pada core dan language-service;
4. conformance terbaru lulus `253 passed, 0 failed across 20 fixtures`, termasuk boundary resolver/CLI `BOOLEAN_EMPTY_RESULT` dan `BOOLEAN_MULTIPART_RESULT`.

Policy versi baseline dan penamaan contoh bukan open item. Tidak ada jaminan transaksi atomik untuk npm multi-package; release decision guard dan recovery planner read-only membantu operator mengelola partial release. Promotion `boolean/intersection` sudah diterapkan pada fixture 15 dan matrix untuk boundary terbatas; evaluator/unit tetap terbuka pada plan 07.

## Status boundary publik

Perubahan policy parser dan schema kemudian dirilis sebagai `@relgeo/core@0.5.1`
dan `@relgeo/language-service@0.5.1`; keduanya tercatat berhasil diverifikasi
dari registry pada 2026-09-18. Catatan pemeriksaan 2026-09-16 yang masih melihat
`core@0.5.0` adalah bukti historis sebelum publish patch, bukan status terkini.
Publish tetap manual sesuai posture release yang disetujui.
