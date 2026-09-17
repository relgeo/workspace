# Sub-rencana Tahap 3 — Release dan npm Publishing Guard

**Status:** Berjalan — checklist, tarball audit, post-publish verifier, release decision record validator, machine-checked release order/bump policy, candidate plan `0.5.1`, dan status-aware preflight sudah tersedia; publish manual, automated publish, dan recovery transaction belum selesai
**Induk:** ../MATURATION-MASTER-PLAN.md  
**Tanggal:** 2026-09-15  
**Owner koordinasi:** relgeo/workspace  
**Scope:** tujuh package npm publik RelGeo pada compatibility line `0.5`

## 1. Tujuan

Membuat release package dapat diulang, dapat dihentikan dengan aman, dan dapat dibuktikan setelah publish. Guard ini tidak menyimpan token, tidak mengaktifkan publish otomatis, dan tidak menggantikan keputusan operator ketika npm meminta autentikasi 2FA/passkey.

## 2. Prinsip release

- Build dan audit dilakukan dari checkout bersih dengan Node.js 24 dan pnpm 10.33.3.
- `docs/compatibility-matrix.json` adalah input versi dan urutan; `docs/integration-baseline.json` adalah input revision.
- `npm pack --dry-run` adalah boundary wajib sebelum publish. Yang boleh naik hanya file publik yang dideklarasikan di `package.json.files` plus `package.json`, `README.md`, dan `LICENSE`.
- Publish dilakukan satu package pada satu waktu dalam dependency order. Operator mencatat hasil setiap package sebelum melanjutkan.
- Jika satu package gagal sebelum publish, hentikan proses dan perbaiki package tersebut.
- Jika satu package sudah terpublish lalu package berikutnya gagal, jangan menghapus atau mencoba mengganti versi yang sama. Catat partial release, publish forward-fix dengan versi patch berikutnya setelah perbaikan, lalu update baseline setelah seluruh consumer kembali konsisten.
- `npm publish` tetap manual sampai jalur manual dan recovery path terbukti pada beberapa release.

### 2.1 Release flow

~~~mermaid
flowchart TD
  start["release candidate"] --> matrix["compatibility check"]
  matrix --> gate["integration gate"]
  gate --> audit["tarball and metadata audit"]
  audit --> decision{"all checks pass?"}
  decision -- "no" --> stop["stop and fix"]
  decision -- "yes" --> publish["manual npm publish"]
  publish --> verify["npm registry verification"]
  verify --> consumers["clean consumer install and smoke"]
  consumers --> record["record evidence and update baseline"]
  publish --> partial["package failure after prior publish"]
  partial --> recovery["record partial state and forward-fix"]
  recovery --> verify
~~~

### 2.2 Dependency order

~~~mermaid
flowchart LR
  spec["spec"] --> geometry["@relgeo/geometry"]
  geometry --> core["@relgeo/core"]
  core --> renderer["@relgeo/renderer-svg"]
  core --> language["@relgeo/language-service"]
  language --> highlight["@relgeo/remark-relgeo-hl"]
  core --> remark["@relgeo/remark-relgeo"]
  renderer --> remark
  core --> cli["@relgeo/cli"]
  renderer --> cli
  highlight --> consumers["Playground / website"]
  remark --> consumers
~~~

Urutan operasional lengkap, termasuk consumer, tersimpan di `docs/compatibility-matrix.json`.

## 3. Checklist release manual

### 3.1 Persiapan

- [ ] pastikan branch workspace dan seluruh submodule berada pada commit yang dimaksud;
- [ ] pastikan perubahan spec memiliki decision record dan compatibility impact;
- [ ] update matrix dan baseline secara sengaja;
- [ ] jalankan `pnpm run compatibility:check`;
- [ ] jalankan `pnpm run integration:gate -- --local`;
- [ ] review report dan pastikan tidak ada path lokal, credential, atau file privat.

### 3.2 Audit sebelum publish

- [ ] jalankan `pnpm run release:audit`;
- [ ] review isi tarball yang dihasilkan untuk setiap package;
- [ ] pastikan versi, license MIT, author, repository, dan `files` benar;
- [ ] pastikan package yang dipublish bukan `private`;
- [ ] simpan output audit sebagai evidence release candidate.

### 3.3 Publish dan verifikasi

Untuk setiap package pada urutan matrix:

```bash
cd <package-directory>
npm publish --access public
```

- [ ] tunggu autentikasi npm/2FA selesai;
- [ ] catat package, versi, waktu, dan hasil publish;
- [ ] hentikan urutan jika publish gagal;
- [ ] setelah seluruh package selesai, jalankan `pnpm run release:verify-published`;
- [ ] jalankan `pnpm run integration:public` terhadap registry;
- [ ] jalankan smoke test website jika website/playground terdampak;
- [ ] update `docs/integration-baseline.json` setelah commit consumer yang benar sudah tersedia.

### 3.4 Recovery partial release

- [ ] catat package terakhir yang berhasil dan package pertama yang gagal;
- [ ] jangan republish versi yang sama;
- [ ] identifikasi consumer yang masih dapat menginstall line lama;
- [ ] pilih forward-fix patch atau batalkan release candidate berikutnya secara eksplisit;
- [ ] setelah perbaikan dipush dan dipublish, ulangi registry verification dan public integration;
- [ ] tulis decision record singkat pada release notes atau log workspace.

## 4. Guard yang sudah dibuat

- [x] `scripts/audit-release-readiness.mjs` memeriksa metadata, `package.json.files`, dan isi `npm pack --dry-run` untuk seluruh package publik.
- [x] `scripts/verify-published-packages.mjs` memeriksa versi setiap package langsung dari npm registry tanpa memerlukan token.
- [x] `scripts/run-release-preflight.mjs` menyediakan satu pemeriksaan read-only sebelum publish: root clean, strict baseline, compatibility matrix, release decision record, tarball audit, dan local integration gate; `--record=<version>` mendukung candidate record.
- [x] root script `pnpm run release:audit` dan `pnpm run release:verify-published` tersedia.
- [x] `docs/releases/TEMPLATE.md`, record `0.5.0`, dan `scripts/check-release-record.mjs` tersedia untuk mencegah package/consumer hilang dari ledger release.
- [x] matrix dan release-record validator kini memeriksa klasifikasi contract change, rationale, approval status, serta policy forward-fix untuk record partial.
- [x] matrix mendeklarasikan bump policy `none`, `patch-compatible`, dan `breaking`; validator memeriksa urutan package plan, status retained/changed, serta bump patch untuk candidate patch-compatible.
- [x] validator membedakan record `planned`, `partial`, dan `completed`; candidate plan dapat diperiksa tanpa mengklaim publish sudah terjadi.
- [x] `docs/releases/0.5.1.json` mencatat target patch untuk `core` dan `language-service`, package yang dipertahankan, consumer pending, dan langkah manual berikutnya.
- [x] preflight memerlukan record berstatus `completed` setelah validasi record; candidate `planned` tidak dapat lolos sebagai release final.
- [x] dokumentasi membedakan validasi record candidate dari preflight release final.
- [x] `release:candidate:audit` memeriksa candidate planned/partial, clean tree, local package version, dan source revision tanpa publish atau akses npm.
- [x] validator partial-release memeriksa last published package, first failed package, urutan release, forward-fix version yang lebih baru, dan larangan republish versi gagal.
- [x] failure-injection `release:record:failure` membuktikan validator menolak partial recovery yang memakai ulang versi gagal sebagai forward-fix.
- [x] failure-injection juga membuktikan validator menolak package plan yang urutannya menyimpang dari matrix.
- [x] workflow Integration menjalankan `release:record:check` sebagai gate CI eksplisit sebelum integration gate.
- [x] integration gate yang sudah ada tetap menjadi prasyarat; audit release tidak menggantikannya.
- [x] manual stop/recovery rule terdokumentasi sehingga publish dapat dihentikan tanpa menghapus versi npm.
- [ ] automated publishing belum diaktifkan.
- [ ] automated partial-release transaction/rollback helper belum ada; schema recovery dan validator sudah tersedia.
- [ ] candidate `0.5.1` belum dibump, dipublish, diverifikasi dari npm, atau diuji pada public-registry gate.

## 5. Bukti awal

- `integration:gate --local` lulus `34/34` pada baseline 2026-09-15, termasuk shared conformance fixture stage.
- Public-registry gate lulus `48/48`, termasuk pack boundary dan consumer install pada checkout temporary.
- `release:audit` lulus `106/106` untuk tujuh package pada checkout yang sudah dibuild.
- `release:verify-published` lulus `7/7`; seluruh tujuh package `0.5.0` terkonfirmasi tersedia di npm pada 2026-09-15. Command yang dapat dijalankan ulang:

~~~bash
pnpm run release:verify-published
~~~

Audit tarball lokal pada checkout yang sudah dibuild menjadi evidence tambahan sebelum release berikutnya.

Perubahan policy parser/schema pada 2026-09-16 sudah lulus source-level gate,
tetapi tidak mengubah `@relgeo/core@0.5.0` atau `@relgeo/language-service@0.5.0`
yang immutable di registry. Release patch untuk artefak tersebut masih harus
disiapkan dan dipublish manual sebelum public-registry gate dapat membuktikan
policy baru pada instalasi fresh.

- `pnpm run release:record:check` memvalidasi record machine-readable baseline `0.5.0` terhadap matrix; record memuat urutan, seluruh package, consumer, dan evidence manual/public yang tersedia.

Preflight seragam sebelum publish manual:

~~~bash
pnpm run release:preflight -- --report=.local/release-preflight.json
pnpm run release:preflight -- --record=0.5.1 --report=.local/release-preflight-0.5.1.json
~~~

Command ini read-only terhadap repository dan registry. Ia berhenti bila root working
tree tidak bersih, release decision record tidak sah, atau salah satu gate gagal; ia
tidak menjalankan `npm publish`.

## 6. Exit gate Tahap 3

- [x] satu checklist release seragam tersedia;
- [x] tarball audit dan allowlist tersedia;
- [x] consumer install/public integration sudah menjadi gate yang ada;
- [x] post-publish version verifier tersedia;
- [x] release dapat dihentikan secara manual dengan aturan partial-release yang jelas;
- [x] post-publish evidence untuk baseline `0.5.0` dijalankan dan dicatat;
- [x] decision record template digunakan untuk mencatat baseline `0.5.0` dan divalidasi terhadap matrix;
- [ ] automated publishing diaktifkan setelah jalur manual terbukti stabil;
- [ ] recovery helper transaction terotomasi atau diuji pada partial release nyata.

Tahap 3 belum selesai karena evidence release baru dan automation sengaja belum dilakukan. Implementasi guard dapat dipakai sekarang tanpa menunggu automation.

## 7. Log perubahan

| Tanggal | Perubahan | Bukti/status |
| --- | --- | --- |
| 2026-09-15 | Audit release package dilakukan | seluruh package publik `0.5.0`, MIT, author, repository, dan `files` tersedia |
| 2026-09-15 | Tarball/metadata audit dibuat | `scripts/audit-release-readiness.mjs` |
| 2026-09-15 | Registry post-publish verifier dibuat | `scripts/verify-published-packages.mjs` |
| 2026-09-15 | Audit tarball dan registry dijalankan | `release:audit` 106/106; `release:verify-published` 7/7 untuk versi `0.5.0` |
| 2026-09-15 | Checklist manual dan recovery partial release ditulis | automation publish tetap sengaja belum aktif |
| 2026-09-15 | Release decision record baseline `0.5.0` dibuat dan divalidasi | `docs/releases/0.5.0.{md,json}`, template, dan `release:record:check`; package/consumer/order/evidence konsisten |
| 2026-09-16 | Release preflight read-only ditambahkan | `release:preflight` mengurutkan clean-tree check, strict baseline, compatibility check, tarball audit, dan local integration gate; publish tetap manual |
| 2026-09-16 | Release preflight pertama dijalankan dari commit bersih | root clean; strict baseline `81/81`; compatibility `250/250`; tarball audit `106/106`; integration gate lokal `36/36`; status `passed`; report berada di `.local/release-preflight-2026-09-16.json` |
| 2026-09-16 | Parser dan language-service schema version policy diterapkan pada source-next | core parser menolak future/unknown version, schema editor membatasi history `0.1`–`0.5`; source gate lulus, registry masih berada pada package baseline `0.5.0` sehingga release patch manual tetap terbuka |
| 2026-09-16 | Release decision enforcement diperkuat | matrix mendeklarasikan kondisi record wajib, klasifikasi perubahan yang diizinkan, dan policy forward-fix; `release:record:check` memvalidasi rationale/approval dan partial-release policy |
| 2026-09-16 | Release record dibuat status-aware | `planned`, `partial`, dan `completed` dibedakan; candidate plan tidak dapat dipakai oleh preflight sebelum statusnya `completed` |
| 2026-09-16 | Candidate patch `0.5.1` dicatat | `core` dan `language-service` direncanakan naik dari `0.5.0` ke `0.5.1`; publish/registry/public integration masih menunggu tindakan manual |
| 2026-09-16 | Audit candidate lokal ditambahkan dan dijalankan | `release:candidate:audit` lulus `36/36`; `core` dan `language-service` ditandai perlu bump, package lain retained, source revision cocok, dan working tree bersih |
| 2026-09-16 | Preflight baseline dijalankan setelah guard status-aware | release preflight `0.5.0` lulus strict baseline `81/81`, compatibility `256/256`, release audit, dan integration gate lokal `36/36`; candidate `0.5.1` sengaja berhenti karena masih `planned` |
| 2026-09-17 | Schema recovery partial-release diperketat | validator kini mewajibkan last published, first failed, forward-fix lebih baru, urutan konsisten, dan `noRepublishSameVersion: true`; automated transaction tetap belum diaktifkan |
| 2026-09-17 | Failure-injection release record ditambahkan | `release:record:failure` menolak partial recovery yang memakai ulang versi gagal; publish manual dan recovery nyata tetap terbuka |
| 2026-09-16 | Audit candidate lokal ditambahkan | `release:candidate:audit -- --version=0.5.1` memeriksa status record, clean tree, package version, dan source revision sebelum bump/publish |
