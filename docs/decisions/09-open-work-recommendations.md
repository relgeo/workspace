# RelGeo Open Work — Recommendation Record

**Status:** Accepted dengan mobile ditunda; desktop expansion menjadi prioritas
**Tanggal:** 2026-09-23  
**Pemilik keputusan:** Agus Made  
**Ruang lingkup:** Flutter capability, SVG parity, QA perangkat, toolchain, dan release npm  
**Dokumen terkait:**

- [Cross-Repo Open Decisions](07-cross-repo-open-decisions.md)
- [Flutter Capability Promotion dan SVG Parity](../plans/07-flutter-capability-promotion-and-svg-parity.md)
- [Release dan npm Publishing Guard](../plans/03-npm-release-guard.md)
- [Maturation Master Plan](../MATURATION-MASTER-PLAN.md)

Dokumen ini merangkum pekerjaan yang masih terbuka dan memberikan satu
rekomendasi operasional untuk masing-masing. Tujuannya bukan mengaktifkan
perubahan secara otomatis, melainkan menyediakan keputusan yang dapat disetujui
sebelum sub-rencana implementasi berikutnya dibuat.

## 1. Status evidence saat ini

Baseline teknis sudah cukup kuat untuk masuk ke tahap keputusan:

- conformance workspace: `253/253` pada 20 fixture;
- compatibility matrix: `283/283`;
- strict baseline: `81/81`;
- local integration gate Node `24.21.0`: `36/36`;
- GitHub Integration `#142`: `verify`, `flutter`, `flutter-macos`, dan `public`
  semuanya sukses;
- release npm `0.5.1`: selesai secara manual;
- workspace bersih dan tersinkron ke `origin/main`.

Yang tersisa bukan kegagalan baseline, melainkan keputusan acceptance, evidence
eksternal, atau otomasi berisiko.

## 2. Peta keputusan

```mermaid
flowchart TD
  baseline["Baseline 0.5.x hijau"] --> qa["QA perangkat nyata"]
  baseline --> promotion["Promosi capability"]
  promotion --> parity["SVG semantic parity"]
  baseline --> posture["Posture Flutter"]
  baseline --> release["Posture release npm"]
  qa --> stage5["Exit gate website/playground"]
  promotion --> matrix["Update capability matrix"]
  parity --> matrix
  posture --> flutterGate["Flutter CI confidence gate"]
  release --> nextRelease["Release berikutnya"]
```

Urutan yang direkomendasikan adalah menyelesaikan keputusan acceptance terlebih
dahulu, menjalankan evidence yang tersedia, baru kemudian mengotomasi release.

## 3. Ringkasan rekomendasi

| Area | Rekomendasi terbaik | Status rekomendasi |
| --- | --- | --- |
| Promosi capability | Promosikan satu capability per keputusan; mulai dari `boolean/intersection`, lalu `evaluator/unit` | perlu persetujuan maintainer |
| SVG parity | Gunakan semantic parity berlapis; geometry adalah contract inti, presentation hanya bila ada consumer nyata | arah teknis sudah disetujui; scope presentation terbuka |
| Flutter | Tetap workbench non-publishable; pin stable `3.41.9`; build macOS hanya CI confidence gate | sudah disetujui |
| Platform dan QA | Tunda Android/iOS sampai waktu yang belum ditentukan; prioritaskan web/PWA, macOS Flutter, Linux Flutter, Windows Flutter, dan CLI | arah disetujui; desktop evidence dan Windows artifact masih terbuka |
| npm publishing | Pertahankan manual publish untuk minimal dua release berikutnya; siapkan OIDC + environment approval setelah itu | perlu persetujuan timing |
| Recovery npm | Jangan rollback atau republish versi; gunakan partial record dan forward-fix patch | sudah menjadi policy |
| SDK/toolchain | Pertahankan pin CI dan catat revision sebagai evidence bila perlu; jangan buka package pub.dev/desktop release | sudah disetujui |

## 4. Keputusan A — Promosi capability Flutter

### Rekomendasi

Promosikan capability secara berurutan, bukan borongan:

1. `boolean/intersection` menjadi kandidat pertama karena contract-nya lebih
   terlokalisasi;
2. `evaluator/unit` ditinjau setelah capability pertama aktif dan stabil;
3. tidak ada promosi otomatis hanya karena test lulus.

Untuk setiap promosi, maintainer cukup menyetujui contract berikut:

- operasi dan object type yang dijamin;
- topology, ring closure, tolerance, dan degenerate behavior;
- error behavior untuk empty dan multipart result;
- batas implementation detail yang tidak dijamin.

Setelah persetujuan, fixture candidate diubah menjadi `active`, capability
matrix dan dokumentasi diperbarui, lalu full integration gate dijalankan.

### Keputusan yang diperlukan

- [x] setujui `boolean/intersection` sebagai capability pertama yang dipromosikan;
- [x] setujui `evaluator/unit` menunggu hasil promosi pertama;
- [x] setujui bahwa promosi selalu memerlukan decision record dan fixture active.

## 5. Keputusan B — SVG parity

### Rekomendasi

Gunakan tiga lapisan acceptance:

1. **Semantic core — wajib:** object identity, primitive type, path/subpath,
   endpoint, ring, geometry, dan tolerance yang terdokumentasi.
2. **Presentation contract — opsional:** viewBox, style, text metrics, metadata,
   dan diagnostic overlay hanya diuji jika consumer atau release benar-benar
   bergantung padanya.
3. **Raw SVG — non-goal:** urutan atribut, whitespace, formatting, dan byte
   equality tidak menjadi contract.

Untuk line `0.5.x`, rekomendasi terbaik adalah tidak menambah presentation
property ke contract inti. Inventaris boleh tetap ada sebagai daftar kandidat.

### Keputusan yang diperlukan

- [x] setujui bahwa tidak ada property presentation tambahan yang dipromosikan
  pada release `0.5.x` tanpa consumer konkret;
- [x] setujui comparator presentation terpisah hanya bila kebutuhan tersebut
  muncul;
- [x] pertahankan raw SVG byte equality sebagai non-goal.

## 6. Keputusan C — Posture Flutter dan toolchain

### Rekomendasi

Pertahankan Flutter sebagai workbench publik non-publishable:

- stable Flutter `3.41.9` dan Dart `3.11.5` tetap baseline CI;
- build macOS tetap dijalankan di CI sebagai confidence gate;
- tidak ada package pub.dev atau desktop distribution pada line `0.5.x`;
- exact SDK revision dicatat sebagai evidence bila terjadi masalah reproduksi,
  bukan dijadikan kontrak distribusi baru.

Keputusan ini menjaga reproducibility tanpa membuka kewajiban signing,
packaging, support matrix, dan recovery platform.

### Keputusan

- [x] Flutter tetap workbench non-publishable;
- [x] stable `3.41.9` menjadi baseline;
- [x] macOS build adalah CI gate, bukan komitmen desktop release.

## 7. Keputusan D — Scope platform dan QA perangkat

### Rekomendasi

Untuk sementara, Android dan iOS dikeluarkan dari target implementasi dan QA
aktif. Penundaan ini tidak memiliki tanggal akhir; mobile baru diaktifkan lagi
setelah surface utama sudah komprehensif, kokoh, dan benar-benar berguna.

Prioritas implementasi dan evidence menjadi:

1. web/PWA;
2. macOS Flutter;
3. Linux Flutter, minimal Ubuntu;
4. Windows Flutter pada Windows 11;
5. CLI.

QA accessibility yang relevan untuk sekarang adalah keyboard/VoiceOver pada
macOS, browser accessibility pada web/PWA, dan smoke test desktop. Android,
iOS, Safari touch, virtual keyboard mobile, TalkBack, dan VoiceOver iOS tidak
menjadi exit gate line saat ini.

### Strategi Windows dari Mac/Ubuntu

Mac dan Ubuntu tetap menjadi mesin pengembangan utama, tetapi build Windows
sebaiknya dilakukan oleh runner Windows di CI. Flutter secara resmi meminta
environment Windows untuk menyiapkan dan membangun target Windows; karena itu
cross-compile langsung dari Mac atau Ubuntu bukan jalur utama yang perlu
dipelihara.

Tahap distribusinya:

1. **Artifact internal pertama:** GitHub Actions `windows-latest` menjalankan
   `flutter build windows --release` dan mengunggah folder Release sebagai ZIP.
   ZIP harus membawa `.exe`, seluruh DLL, dan folder `data`.
2. **Installer untuk keluarga/pengguna awal:** setelah smoke test pada Windows
   11 lulus, buat MSIX menggunakan `msix` atau installer Windows yang sesuai.
3. **Distribusi publik:** baru pertimbangkan signing certificate, Windows
   Store, atau installer release setelah ada kebutuhan pengguna yang nyata.

Dengan urutan ini, komputer Windows 11 istri dapat menerima artifact dari CI
tanpa mengharuskan Anda memiliki komputer Windows untuk proses build. Namun
artifact tetap harus diuji pada Windows 11 nyata sebelum dianggap usable.

### Format evidence minimum

- model perangkat;
- OS dan versi;
- browser/assistive technology;
- viewport/orientasi;
- tanggal pengujian;
- hasil per skenario;
- issue atau limitation yang ditemukan.

### Keputusan yang dicatat

- [x] Android ditunda tanpa tanggal sampai scope desktop/web/CLI matang;
- [x] iOS ditunda tanpa tanggal sampai scope desktop/web/CLI matang;
- [x] macOS, Linux/Ubuntu, Windows 11, web/PWA, dan CLI menjadi scope utama;
- [ ] siapkan smoke-test Windows 11 pada komputer yang tersedia;
- [ ] tentukan kapan mobile diaktifkan kembali.

## 8. Keputusan E — Jalur artefak Windows

### Rekomendasi

Implementasikan workflow terpisah `flutter-windows` di root workspace dengan
karakteristik berikut:

- runner `windows-latest`;
- Flutter stable yang sama dengan baseline CI;
- `flutter pub get --enforce-lockfile`;
- `flutter analyze` dan `flutter test`;
- `flutter build windows --release`;
- assertion bahwa executable, DLL, dan `data` tersedia;
- packaging ZIP sebagai artifact;
- smoke test manual pada Windows 11 sebelum memilih installer.

Jangan mulai dari MSIX signing. ZIP release lebih sederhana untuk membuktikan
bahwa binary dan dependency benar-benar berjalan. Setelah smoke test stabil,
barulah buat sub-rencana packaging MSIX/installer dan signing.

### Keputusan yang diperlukan

- [x] gunakan Windows CI runner sebagai build authority;
- [x] mulai dengan ZIP artifact, bukan installer bersigning;
- [ ] jalankan smoke test artifact pada Windows 11;
- [ ] setelah smoke test lulus, pilih MSIX atau installer tradisional.

## 9. Keputusan F — npm publishing dan recovery

### Rekomendasi sekarang

Pertahankan publish manual untuk minimal dua release berikutnya. Setiap release
wajib melewati:

```text
release preflight
→ tarball audit
→ npm publish manual dengan 2FA/passkey
→ registry verification
→ public integration
→ update release record dan baseline
```

Alasannya: jalur manual baru terbukti pada release `0.5.1`, sedangkan failure
recovery nyata belum pernah dijalankan. Automation sebelum itu akan menambah
risiko tanpa menghilangkan kebutuhan keputusan operator.

### Target automation setelah dua release stabil

- npm trusted publishing/OIDC, bukan token jangka panjang;
- protected environment dengan approval manual;
- satu package per job atau transaction step yang dapat dihentikan;
- partial-release record wajib dibuat saat package berikutnya gagal;
- forward-fix patch sebagai recovery, bukan delete/rollback/republish versi;
- registry verification dan public integration tetap wajib setelah automation.

### Keputusan yang diperlukan

- [x] setujui minimal dua release manual tambahan sebelum automation;
- [x] setujui forward-fix sebagai satu-satunya recovery normal;
- [x] setujui larangan republish versi npm yang sama;
- [x] setujui OIDC + protected environment sebagai target automation.

## 10. Urutan pengerjaan yang direkomendasikan

```mermaid
sequenceDiagram
  participant M as Maintainer
  participant W as Workspace
  participant QA as Device QA
  participant CI as GitHub CI
  participant N as npm

  M->>W: Setujui boolean/intersection contract
  W->>W: Promote fixture dan matrix
  W->>CI: Jalankan full integration gate
  CI-->>W: Verifikasi clean checkout
  QA->>W: Tambahkan desktop/web evidence
  M->>W: Putuskan scope SVG presentation
  M->>N: Pertahankan publish manual dua release
  N-->>W: Registry verification dan public integration
  M->>W: Evaluasi aktivasi OIDC automation
```

Urutan praktis:

1. Setujui candidate `boolean/intersection`.
2. Promosikan fixture dan matrix secara eksplisit.
3. Jalankan full local dan CI gate.
4. Tambahkan Windows CI artifact dan uji pada Windows 11; lanjutkan QA web/macOS/Linux.
5. Tunda evaluator/unit sampai hasil tahap pertama stabil.
6. Jalankan dua release npm berikutnya secara manual.
7. Setelah dua release tanpa recovery failure, buat sub-rencana automation OIDC.

## 11. Sisa terbuka setelah rekomendasi ini

| Item | Mengapa belum selesai | Tindakan berikutnya |
| --- | --- | --- |
| Promosi boolean/intersection | menunggu persetujuan contract maintainer | setujui B lalu buat sub-rencana promosi |
| Promosi evaluator/unit | sengaja menunggu candidate pertama | jangan dikerjakan sebelum B stabil |
| Presentation SVG | belum ada consumer yang memerlukan | pertahankan semantic-only untuk `0.5.x` |
| Desktop/web QA | Windows artifact dan matrix Linux belum diverifikasi pada perangkat target | buat workflow Windows dan lakukan smoke test |
| Android/iOS QA | sengaja ditunda tanpa tanggal | jangan jadikan blocker; buka kembali setelah scope utama matang |
| Windows packaging | belum ada artifact/installer teruji | mulai dari ZIP, lalu evaluasi MSIX |
| npm automation | jalur manual baru selesai satu patch release | tunggu dua release manual tambahan |
| Recovery transaction automation | belum ada partial-release run nyata | pertahankan planner/validator read-only |

## 12. Exit condition dokumen

Checklist keputusan pada bagian 4, 5, 7, dan 8 telah diterima secara umum oleh
maintainer. Yang masih terbuka hanya pekerjaan eksekusi: promosi capability,
workflow Windows, smoke test Windows 11, dan keputusan kapan scope mobile dibuka
kembali. Detail implementasi harus dipindahkan ke sub-rencana teknis yang
relevan; dokumen ini tetap menjadi ringkasan induk, bukan tempat detail
implementasi.
