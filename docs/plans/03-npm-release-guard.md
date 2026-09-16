# Sub-rencana Tahap 3 — Release dan npm Publishing Guard

**Status:** Berjalan — checklist, tarball audit, post-publish verifier, dan release decision record validator sudah dibuat serta baseline `0.5.0` sudah dicatat; automated publish dan recovery transaction belum diaktifkan
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
- [x] root script `pnpm run release:audit` dan `pnpm run release:verify-published` tersedia.
- [x] `docs/releases/TEMPLATE.md`, record `0.5.0`, dan `scripts/check-release-record.mjs` tersedia untuk mencegah package/consumer hilang dari ledger release.
- [x] integration gate yang sudah ada tetap menjadi prasyarat; audit release tidak menggantikannya.
- [x] manual stop/recovery rule terdokumentasi sehingga publish dapat dihentikan tanpa menghapus versi npm.
- [ ] automated publishing belum diaktifkan.
- [ ] automated partial-release transaction/rollback helper belum ada.

## 5. Bukti awal

- `integration:gate --local` lulus `34/34` pada baseline 2026-09-15, termasuk shared conformance fixture stage.
- Public-registry gate lulus `48/48`, termasuk pack boundary dan consumer install pada checkout temporary.
- `release:audit` lulus `106/106` untuk tujuh package pada checkout yang sudah dibuild.
- `release:verify-published` lulus `7/7`; seluruh tujuh package `0.5.0` terkonfirmasi tersedia di npm pada 2026-09-15. Command yang dapat dijalankan ulang:

~~~bash
pnpm run release:verify-published
~~~

Audit tarball lokal pada checkout yang sudah dibuild menjadi evidence tambahan sebelum release berikutnya.

- `pnpm run release:record:check` memvalidasi record machine-readable baseline `0.5.0` terhadap matrix; record memuat urutan, seluruh package, consumer, dan evidence manual/public yang tersedia.

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
