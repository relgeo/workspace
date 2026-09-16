# Compatibility behavior audit

**Status:** Audit inventory selesai; delta diagnostic Flutter, semantic fixture projection, evaluator/unit parity lokal, dan evidence CI `Integration #91` sudah diverifikasi, sedangkan keputusan public-version policy, enforcement, dan promotion capability masih terbuka
**Tanggal:** 2026-09-15 (diperbarui 2026-09-16)  
**Scope:** `spec`, `core`, `renderer-svg`, `language-service`, `cli`, Markdown plugins, Playground, website, Flutter, matrix, fixtures, dan test suite

## Ringkasan

Kontrak publik yang dinyatakan saat ini adalah `RelGeo DSL v0.5`. Implementasi dan regression test masih memuat banyak coverage historis `v0.1` sampai `v0.4`. Itu belum otomatis berarti seluruh versi tersebut merupakan public support promise: parser saat ini tidak memiliki allowlist version yang menolak versi lama atau versi masa depan secara eksplisit.

Kesimpulan audit: tidak ditemukan consumer yang sengaja memakai dependency package dari compatibility line berbeda, tetapi policy versi historis dan batas parser belum cukup eksplisit untuk menutup checklist “tidak ada compatibility behavior tersembunyi”.

Inventory ini dapat diulang dengan `pnpm run compatibility:audit`. Command bersifat read-only dan menampilkan warning untuk gap yang memang masih menunggu keputusan kontrak.

## Evidence yang diperiksa

| Area | Evidence | Hasil |
| --- | --- | --- |
| Public contract | `docs/compatibility-matrix.json`, README package, `fixtures/manifest.json` | line publik aktif adalah `0.5` |
| Parser | `core/src/parser.ts` | `ACTIVE_REL_GEO_SPEC_VERSION = "0.5"`; dokumen tanpa `version` mendapat default `0.5`; tidak ada allowlist version eksplisit di parser |
| Runtime regression | test `core` dan `renderer-svg` | test historis menggunakan dokumen `v0.1`, `v0.2`, `v0.3`, dan `v0.4` |
| Language service | `language-service/src/__tests__/language_service.test.ts` | ada coverage `v0.3`, `v0.4`, dan `v0.5` |
| Shared fixture | `fixtures/manifest.json` | 1 active `v0.5`, 9 supported-legacy `v0.4`, 3 invalid `v0.5`, 1 runtime-diagnostic `v0.5`, 2 capability candidates `v0.5` |
| Playground examples | `playground/src/examples.ts` dan raw YAML | contoh historis `v0.2`/`v0.3` diberi label historical; beberapa file bernama `v04_*` ternyata mendeklarasikan `v0.5` |
| Intentional fallback | `playground/src/share-code.ts`, `playground/src/clipboard.ts`, UX audit | Base64 legacy dan clipboard fallback sudah diberi alasan serta test/contract coverage |
| Dependency line | `scripts/check-compatibility.mjs` | dependency `@relgeo/*` tetap pada `^0.5.0`; checker lulus `250/250`, termasuk record non-Node Flutter |
| Flutter consumer | `flutter/pubspec.yaml`, Flutter source/tests, shared fixture adapter | workbench non-publishable pada DSL `0.5`; active/runtime dan dua candidate memiliki semantic evidence lokal serta CI `Integration #91` |

## Findings

### F01 — Version acceptance parser belum eksplisit

`core/src/parser.ts` menetapkan versi aktif dan default, tetapi tidak mendefinisikan daftar versi yang diterima atau diagnostic khusus untuk versi yang tidak dikenal. Akibatnya, penerimaan dokumen lama lebih banyak ditentukan oleh field/semantic behavior yang kebetulan masih tersedia.

**Dampak:** sedang–tinggi. Ketika kontrak `0.6` muncul, parser dapat terlihat menerima header versi baru meskipun semantics-nya belum benar-benar didukung.

**Status:** terbuka. Perlu keputusan apakah parser akan menolak future version, mempertahankan explicit legacy allowlist, atau menyerahkan version policy ke validator terpisah.

### F02 — Regression coverage historis lebih luas daripada public fixture policy

Test package memelihara coverage `v0.1`–`v0.4`, sedangkan fixture canonical hanya memberi status `supported-legacy` untuk `v0.4`. Coverage test historis itu berguna, tetapi statusnya belum dipisahkan secara machine-readable antara “tested for regression” dan “publicly supported”.

**Dampak:** sedang. Pengguna dapat menarik kesimpulan support yang lebih luas daripada yang ingin dijanjikan.

**Status:** terbuka. Jangan menghapus test lama sebelum keputusan support policy; tambahkan klasifikasi yang jelas terlebih dahulu.

### F03 — Nama file contoh `v04_*` tidak selalu sama dengan deklarasi DSL

Beberapa contoh aktif seperti `v04_architectural_plan.yaml`, `v04_electronic_faceplate.yaml`, `v04_flange.yaml`, `v04_repeat_along_path.yaml`, `v04_full_assembly.yaml`, `v04_technical_drawing_sheets.yaml`, dan `v04_showcase.yaml` mendeklarasikan `version: 0.5`. Ini tampaknya merupakan nama historis, bukan version gate runtime.

**Dampak:** rendah–sedang. Tidak mengubah hasil resolve, tetapi dapat menyesatkan maintainer dan pembaca fixture.

**Status:** terbuka. Rename atau tambahkan metadata “filename legacy / contract v0.5” dalam perubahan Playground terpisah; perhatikan persisted example keys dan share links sebelum rename.

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
- [x] inventory dan mismatch dapat dideteksi ulang oleh `pnpm run compatibility:audit`.
- [x] Flutter dicatat sebagai consumer non-Node dan delta diagnostic `align` terhadap TypeScript ditemukan dari source.

## Keputusan yang masih diperlukan

1. Tetapkan apakah `v0.1`–`v0.4` adalah regression-only, supported legacy, atau public compatibility promise.
2. Tetapkan behavior untuk future version, misalnya `0.6`: fail fast, warning, atau validator capability terpisah.
3. Setelah keputusan, perluas `compatibility-matrix.json`/fixture manifest dan tambahkan negative tests untuk version policy.
4. Rapikan nama file contoh `v04_*` yang sebenarnya v0.5, atau beri metadata yang menjelaskan nama historisnya.
5. Pertahankan evidence regression test dan fixture canonical Flutter setelah perbaikan diagnostic; promotion capability dan policy SVG tetap memerlukan keputusan berikutnya.
6. Jalankan ulang conformance, integration, dan public smoke setelah policy, example metadata, atau adapter berubah.

Sebelum lima keputusan ini dibuat, checklist “tidak ada consumer yang memiliki compatibility behavior tersembunyi” tetap terbuka.

## Proposed policy untuk persetujuan maintainer

Bagian ini adalah usulan kerja, bukan perubahan behavior parser. Tujuannya mempersempit pilihan sebelum negative test dan enforcement dibuat.

| Version | Proposed status | Makna operasional |
| --- | --- | --- |
| `0.5` | active public line | contract utama untuk package, Playground, website, dan fixture baru |
| `0.4` | supported legacy | tetap diterima pada surface yang sudah memiliki coverage; tidak menerima fitur `0.5` secara diam-diam |
| `0.1`–`0.3` | regression-only | test lama boleh dipertahankan untuk mencegah regresi, tetapi tidak dijanjikan sebagai compatibility target publik |
| `>0.5` seperti `0.6` | unsupported until declared | strict validation gagal dengan diagnostic version yang actionable; editor boleh tetap menampilkan source sebagai teks dengan diagnostic yang jelas |
| version omitted | defaults to active | tetap diperlakukan sebagai `0.5` demi backward-friendly authoring dan perlu dicatat pada dokumentasi |

Konsekuensi jika usulan ini disetujui:

1. tambahkan `supportedVersions` dan `regressionOnlyVersions` secara machine-readable pada matrix/manifest;
2. tambahkan negative fixtures untuk unsupported future version dan version yang tidak lagi supported;
3. beri diagnostic code khusus untuk unsupported version sebelum validasi semantic lain dijalankan;
4. ubah nama atau metadata contoh `v04_*` yang sebenarnya memakai contract `0.5`;
5. jalankan ulang conformance, integration, public-registry, dan browser smoke.

Sampai maintainer menyetujui usulan ini, parser tetap pada behavior toleran yang sedang diaudit dan warning audit tidak dinaikkan menjadi failure.
