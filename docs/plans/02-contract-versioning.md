# Sub-rencana Tahap 2 — Contract Versioning dan Compatibility Matrix

**Status:** Berjalan — matriks, deklarasi, pemeriksaan CI, version acceptance policy, checklist release, release decision record validator, dan candidate patch plan sudah tersedia; atomic publish enforcement serta evidence partial-release nyata masih terbuka
**Induk:** ../MATURATION-MASTER-PLAN.md  
**Tanggal:** 2026-09-15  
**Owner koordinasi:** relgeo/workspace  
**Scope:** spec, package TypeScript publik, Playground, website, dan aturan release lintas-repo

## 1. Tujuan

Membuat hubungan antara kontrak bahasa, versi package, dan consumer menjadi eksplisit serta dapat diperiksa dari fresh checkout. Dokumen ini membedakan tiga hal yang sebelumnya mudah tercampur:

1. **contract version** — versi aturan RelGeo DSL pada `spec`;
2. **package version** — versi distribusi tiap package npm atau aplikasi;
3. **compatibility line** — garis kontrak yang boleh dipakai bersama, saat ini `0.5`.

Package aplikasi tidak harus memiliki nomor versi yang sama dengan DSL. Playground tetap `0.4.0`, tetapi harus menyatakan bahwa dokumen yang dieditnya mengikuti DSL `v0.5`.

## 2. Keputusan kontrak versi

### 2.1 Aturan saat ini

- `RelGeo DSL v0.5` adalah kontrak aktif dan sumber normatifnya berada di `spec/id`.
- Package publik yang mengikuti kontrak tersebut berada pada line `0.5.x`.
- Patch release dapat bergerak mandiri selama tidak mengubah kontrak bahasa atau compatibility surface secara breaking.
- Perubahan kontrak bahasa yang breaking memindahkan family package yang terdampak ke line berikutnya, misalnya `0.6.x`.
- Dependency internal `@relgeo/*` pada line sekarang memakai range `^0.5.0`, sehingga patch release kompatibel tetap dapat diambil tanpa mencampur line `0.6`.
- Peer dependency dan dev dependency yang menunjuk package internal harus memakai line yang sama.
- Website dan Playground menyatakan compatibility line secara terpisah dari versi aplikasi mereka.

### 2.2 Alur sumber kebenaran

~~~mermaid
flowchart LR
  spec["spec: RelGeo DSL v0.5"] --> matrix["compatibility matrix"]
  matrix --> packages["@relgeo/* packages: 0.5.x"]
  matrix --> consumers["Playground and website"]
  packages --> consumers
  matrix --> ci["CI compatibility check"]
  ci --> release["release decision"]
~~~

`docs/compatibility-matrix.json` adalah deklarasi machine-readable untuk hubungan tersebut. `docs/integration-baseline.json` tetap menjadi sumber revision gitlink yang sedang diuji; keduanya sengaja dipisahkan: matrix menjawab “versi apa yang kompatibel”, baseline menjawab “commit mana yang dipin”.

### 2.3 Urutan release konseptual

~~~mermaid
sequenceDiagram
  participant Owner as Release owner
  participant Spec as spec
  participant Lib as Public packages
  participant Apps as Playground and website
  participant Registry as npm registry

  Owner->>Spec: approve contract line and revision
  Spec-->>Owner: publish/tag normative source
  Owner->>Lib: build, test, pack, verify dependency line
  Lib->>Registry: publish compatible package set
  Registry-->>Apps: resolve pinned compatibility line
  Apps->>Apps: build and smoke test
  Apps-->>Owner: report release evidence
~~~

Diagram ini belum berarti publish otomatis. Ia menjadi urutan keputusan yang dipakai bersama release guard Tahap 3.

## 3. Baseline aktual

| Layer | Package/application | Version saat ini | Compatibility line | Status |
| --- | --- | ---: | ---: | --- |
| Contract | `spec` | `0.5` | `0.5` | aktif, revision dipin pada baseline |
| Runtime | `@relgeo/geometry` | `0.5.0` | `0.5` | npm published |
| Runtime | `@relgeo/core` | `0.5.0` | `0.5` | npm published |
| Runtime | `@relgeo/renderer-svg` | `0.5.0` | `0.5` | npm published |
| Language | `@relgeo/language-service` | `0.5.0` | `0.5` | npm published |
| Markdown | `@relgeo/remark-relgeo-hl` | `0.5.0` | `0.5` | npm published |
| Markdown | `@relgeo/remark-relgeo` | `0.5.0` | `0.5` | npm published |
| CLI | `@relgeo/cli` | `0.5.0` | `0.5` | npm published |
| Product | `relgeo-playground` | `0.4.0` | `0.5` | private application, version independent |
| Product | `relgeo-docs-site` | `0.5.0` | `0.5` | private deployment application, version independent |

Audit metadata 2026-09-15 menemukan semua dependency internal aktif memakai `^0.5.0`; tidak ditemukan dependency internal pada line berbeda.

## 4. Deliverable yang sudah dibuat

### 4.1 Matriks referensi

- [x] `docs/compatibility-matrix.json` mencatat contract, policy, package, consumer, dan release order.
- [x] matrix menyimpan revision spec yang harus cocok dengan `docs/integration-baseline.json`.
- [x] matrix membedakan package publik dan aplikasi consumer.
- [x] matrix membedakan package version dari compatibility line.

### 4.2 Pemeriksaan otomatis

- [x] `scripts/check-compatibility.mjs` memeriksa matrix terhadap package.json aktual.
- [x] pemeriksaan memvalidasi nama, versi, baseline package metadata, dan README compatibility statement.
- [x] pemeriksaan memvalidasi dependency, devDependency, dan peerDependency internal agar tetap pada `^0.5.0`.
- [x] pemeriksaan memvalidasi spec revision, release order, package/consumer classification, dan line consistency.
- [x] root script `pnpm run compatibility:check` tersedia.
- [x] CI menjalankan compatibility check sebelum integration gate.

### 4.3 Bukti eksekusi

Command yang menjadi bukti lokal:

~~~bash
pnpm run compatibility:check
~~~

Command harus menghasilkan exit code non-zero ketika package mengubah compatibility line, internal range, README declaration, baseline package version, atau matrix release order tanpa memperbarui kontrak secara sengaja.

## 5. Hal yang belum tertutup

- [x] release record kini diwajibkan menyatakan klasifikasi perubahan, rationale, approval status, dan policy partial-release sesuai matrix; pencegahan publish parsial secara atomik tetap terbuka.
- [x] release record mendukung status `planned`, `partial`, dan `completed` sehingga rencana patch dapat ditinjau tanpa dianggap sebagai publikasi.
- [x] candidate `0.5.1` mencatat propagasi policy parser/schema ke `core` dan `language-service`; verifikasi npm masih menunggu publish manual.
- [x] partial-release record kini memiliki recovery fields yang dapat divalidasi terhadap release order dan compatibility line.
- [x] release checklist operasional yang mencakup spec, package, consumer, docs, tag, dan post-publish evidence tersedia di sub-rencana Tahap 3.
- [x] release decision record template dan validator menjaga package/consumer/order tetap lengkap pada baseline `0.5.0`.
- [x] inventory compatibility behavior disimpan di `docs/compatibility-behavior-audit.md`.
- [x] command read-only `pnpm run compatibility:audit` tersedia untuk mengulang inventory tersebut.
- [x] public historical/future version policy dan negative conformance fixtures sudah ditetapkan serta dijaga parser.
- [x] language-service JSON Schema kini membatasi nilai version pada compatibility history yang dideklarasikan; test schema lulus `66/66`.
- [ ] belum ada automated release transaction atau rollback/forward-fix helper; publish masih manual sesuai keputusan sebelumnya.
- [x] Flutter sudah masuk matrix sebagai non-Node consumer berstatus `partial`; alignment CI dan release posture tetap dikelola pada Tahap 6.
- [ ] metadata compatibility line belum ditambahkan sebagai field standar ke setiap `package.json`; untuk baseline ini deklarasi pusat plus README dan dependency ranges dipilih agar tidak memaksa sembilan repository anak melakukan commit tambahan.

## 6. Exit gate Tahap 2

- [x] satu matriks kompatibilitas menjadi referensi;
- [x] setiap package/application yang relevan menyatakan compatibility line pada README dan matrix;
- [x] CI mendeteksi mismatch versi atau peer dependency sebelum integration gate;
- [x] breaking family membutuhkan decision record eksplisit yang divalidasi sebelum release evidence dianggap lengkap; blocking publish atomik tetap terbuka.
- [x] release checklist lengkap tersedia; pemakaian ulang pada release berikutnya tetap menjadi evidence pemeliharaan Tahap 3.

Tahap 2 belum boleh ditandai selesai sampai dua checkbox terakhir dipindahkan ke release guard Tahap 3 atau mempunyai evidence operasional yang setara.

## 7. Cara pemeliharaan

Jika spec naik dari `0.5` ke `0.6`:

1. buat decision record breaking change dan revisi normatif spec;
2. update `compatibilityLine`, contract version, spec revision, package versions, dependency ranges, dan README declarations sebagai satu perubahan terkoordinasi;
3. jalankan `pnpm run compatibility:check` sebelum integration gate;
4. lakukan release sesuai urutan yang akan diformalisasi pada Tahap 3;
5. update `docs/integration-baseline.json` hanya setelah commit submodule dan consumer benar-benar tersedia.

Jika hanya ada patch release, update package entry dan baseline yang relevan tanpa menaikkan compatibility line, lalu ulangi gate yang sama.

## 8. Log perubahan

| Tanggal | Perubahan | Bukti/status |
| --- | --- | --- |
| 2026-09-15 | Audit metadata package dan consumer dilakukan | seluruh package publik `0.5.0`; Playground `0.4.0`; internal ranges `^0.5.0` |
| 2026-09-15 | Matrix dan compatibility checker dibuat | `docs/compatibility-matrix.json`, `scripts/check-compatibility.mjs` |
| 2026-09-15 | Checker dimasukkan ke workflow Integration | dijalankan sebelum local integration gate; CI berikutnya menjadi evidence runtime |
| 2026-09-15 | Checklist release lintas contract/package/consumer diturunkan ke Tahap 3 | tersedia di `docs/plans/03-npm-release-guard.md`; atomic partial-publish enforcement masih terbuka |
| 2026-09-15 | Release record baseline `0.5.0` ditambahkan | `docs/releases/0.5.0.{md,json}` dan `release:record:check` memvalidasi matrix/order/package/consumer/evidence |
| 2026-09-15 | Audit compatibility behavior dilakukan | coverage historis, parser version handling, fallback, dan mismatch example version dicatat; explicit historical/future version policy masih terbuka |
| 2026-09-15 | Compatibility behavior audit dimasukkan ke workflow Integration | command read-only lulus lokal dengan `7 passed, 9 warnings, 0 failed`; warning policy dan mismatch nama file tetap non-blocking sampai keputusan kontrak dibuat |
| 2026-09-16 | Version acceptance policy ditetapkan dan diuji negatif | matrix/manifest membedakan active `0.5`, supported legacy `0.4`, regression-only `0.1`–`0.3`; parser menolak `0.6`/`1.0` dengan `UNSUPPORTED_SPEC_VERSION`; conformance `228/228` |
| 2026-09-16 | Language-service schema diselaraskan dengan parser version policy | enum string/number `0.1`–`0.5` dan default `0.5` ditambahkan; lint, test `66/66`, dan build lulus; package npm publik masih `0.5.0` sampai release patch manual |
| 2026-09-16 | Decision record enforcement ditambahkan | matrix dan validator memeriksa klasifikasi contract change, rationale, approval status, serta partial-release policy; publish transaction atomik belum diaktifkan |
