# RelGeo release records

Folder ini menyimpan keputusan dan evidence release lintas repository. Record di sini bersifat publik: jangan masukkan token, credential, path komputer operator, atau data internal.

## Aturan penggunaan

1. Salin [`TEMPLATE.md`](TEMPLATE.md) untuk setiap release candidate atau release yang selesai.
2. Tetapkan compatibility line, revision `spec`, release order, package status, consumer status, evidence, dan recovery decision.
3. Simpan snapshot machine-readable dengan nama versi, misalnya `0.5.0.json`.
4. Jalankan `pnpm run release:record:check <version>` sebelum review. Validator membandingkan record dengan compatibility matrix dan memastikan tidak ada package/consumer yang hilang. Status `planned` dan `partial` boleh divalidasi sebagai rencana, sedangkan preflight final hanya menerima status `completed`.
5. Jika publish berhenti setelah sebagian package berhasil, ubah status record menjadi `partial`, catat package terakhir yang berhasil, dan tulis forward-fix version. Jangan menghapus atau mencoba menerbitkan ulang versi npm yang sama.
6. Jalankan validator record setelah recovery diisi. Untuk status `partial`, validator memastikan package order konsisten, forward-fix lebih baru dan masih satu compatibility line, serta `noRepublishSameVersion` bernilai `true`.

Record tidak mengaktifkan publish otomatis. Ia menjadi bukti keputusan dan ledger yang dapat diaudit sebelum atau sesudah operator menjalankan publish manual.

## Baseline yang sudah dicatat

- [`0.5.0.md`](0.5.0.md) — baseline publik `0.5.0`, dipublish manual dan diverifikasi setelah publish.
- [`0.5.0.json`](0.5.0.json) — snapshot machine-readable yang divalidasi oleh `release:record:check`.
- [`0.5.1.json`](0.5.1.json) dan [`0.5.1.md`](0.5.1.md) — patch release selesai; `core` dan `language-service` tersedia sebagai `0.5.1`, seluruh gate registry/CI dicatat, dan snapshot matrix disimpan untuk audit historis.
