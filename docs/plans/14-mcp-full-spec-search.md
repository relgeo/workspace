# Sub-Rencana 14 — Pencarian Penuh Spec melalui MCP

**Status:** rencana implementasi; pencarian desktop saat ini masih terbatas pada aturan `rect`.  
**Owner koordinasi:** `relgeo/workspace`  
**Owner sumber normatif:** `relgeo/spec` (`spec/id/`)  
**Owner implementasi MCP:** `relgeo/mcp` dan `relgeo/flutter` untuk packaging desktop  
**Compatibility line awal:** RelGeo DSL `0.5.x`  
**Terkait:** [Sub-Rencana 11 — MCP Server dan Agent-Assisted RelGeo Authoring](./11-mcp-agent-integration.md)

## 1. Tujuan

Memungkinkan agent menjawab permintaan pengguna dengan menelusuri isi penuh
spec RelGeo, bukan hanya daftar kemampuan MCP, contoh yang dipilih manual, atau
aturan yang dikodekan satu per satu.

Contoh permintaan yang harus terbantu:

- “Bagaimana cara menggambar kotak?”
- “Apa beda `parameters` dan `constants`?”
- “Bagaimana menempatkan titik pada sebuah path?”
- “Aturan apa yang berlaku untuk dimensi dan annotation?”

Pencarian adalah kemampuan baca saja. Rencana ini tidak menambahkan pembuatan
atau pengeditan gambar.

## 2. Keputusan pendekatan

### 2.1 Cari seluruh snapshot Markdown secara lokal

MCP Desktop membawa snapshot semua file Markdown dalam `spec/id/` untuk versi
DSL yang didukung. Snapshot tersedia offline dan tidak memerlukan pengguna
meng-clone repository, mengatur token GitHub, atau mengandalkan koneksi internet.

Snapshot mempertahankan struktur dan teks sumber. MCP membangun indeks
pencarian saat server dimulai dengan memecah file berdasarkan heading Markdown.
Indeks minimal menyimpan:

- relative path, heading, dan section anchor;
- teks bagian dan konteks heading induknya;
- status dokumen (`Normative`, `Informative`, atau status yang tertulis di
  sumber);
- versi DSL dan revision/digest snapshot.

Ini adalah indeks runtime untuk pencarian, bukan katalog semantik baru yang
dirawat manual. Sumber isi tetap file Markdown di `spec/id/`.

### 2.2 Retrieval memakai tool MCP

Resources cocok untuk membaca URI dokumen yang sudah diketahui. Pencarian yang
harus dimulai agent berdasarkan maksud pengguna diekspos sebagai tool yang
terlihat dan dapat dipanggil model. MCP membedakan resources sebagai data yang
dipilih host/client dan tools sebagai fungsi yang dapat dipilih model. Lihat
[MCP TypeScript SDK — Resources](https://ts.sdk.modelcontextprotocol.io/v2/servers/resources).

Kontrak yang dituju:

```text
relgeo_search_spec(query, maxResults)
relgeo_get_spec_section(sectionId)
```

`relgeo_search_spec` mencari semua bab, bukan hanya syntax object. Hasilnya
berisi section ID, judul, cuplikan relevan, status normatif, versi, serta path,
anchor, dan URL sumber. `relgeo_get_spec_section` mengambil isi section lengkap
setelah agent memilih hasil yang tepat. Resource index dan resource section
tetap tersedia untuk host yang ingin membaca URI secara langsung.

Nama dan schema final harus kompatibel dengan kontrak MCP yang sudah ada.
`relgeo_find_syntax` dapat dipertahankan sebagai alias sementara atau diarahkan
ke pencarian yang sama agar konfigurasi client yang sudah tersimpan tidak
langsung rusak.

### 2.3 Peringkat pencarian

Untuk ukuran corpus saat ini, implementasikan pencarian leksikal lokal yang
sederhana dan terukur:

1. normalisasi huruf, tanda baca, dan variasi spasi;
2. cocokkan istilah query pada judul file, heading, dan isi section;
3. beri bobot lebih tinggi untuk kecocokan judul/heading dan frasa utuh;
4. urutkan hasil berdasarkan skor, lalu stabilkan tie-break berdasarkan path
   dan section ID;
5. kembalikan jumlah hasil terbatas dengan cuplikan dari lokasi kecocokan.

Agent diarahkan untuk memperluas query intent menjadi istilah RelGeo terkait
sebelum memanggil tool. Contohnya, “kotak” dapat dicari bersama `rect`,
`rectangle`, dan `square`. Hindari embedding model, vector database, atau
layanan pencarian eksternal pada tahap awal; evaluasi ulang hanya bila corpus
dan evidence penggunaan menunjukkan lexical retrieval tidak memadai.

### 2.4 Normativitas dan provenance

Setiap hasil menyatakan apakah sumbernya normatif atau informatif. Jika sumber
normatif tersedia, agent harus menggunakannya sebagai dasar jawaban tentang
aturan DSL. Bagian informative boleh membantu orientasi, tetapi tidak boleh
disajikan sebagai kontrak bahasa.

Setiap cuplikan dan section penuh menyertakan versi DSL, revision/digest
snapshot, file, heading/anchor, dan URL GitHub yang dapat dibuka. MCP tidak
menulis ulang atau memparafrasekan isi aturan sebagai pengganti teks sumber.

## 3. Packaging snapshot desktop

MCP Desktop harus membawa seluruh Markdown `spec/id/` di dalam aplikasi.
Pengguna tidak perlu mengatur lokasi repository spec. Karena source spec dan
Flutter berada di repository/submodule berbeda, workspace menyediakan proses
sinkronisasi snapshot untuk maintainer:

```text
spec/id/**/*.md
       ↓ sync/check saat development dan release
flutter/assets/relgeo_spec/v0.5/**/*.md
       ↓ Flutter asset bundle
MCP Desktop offline spec corpus
```

Proses tersebut menyalin Markdown sumber dengan struktur path yang sama dan
mencatat versi serta digest sumber. Ia tidak membuat ulang isi atau mengubah
semantik Markdown. Perintah `check` harus gagal jika snapshot desktop tertinggal
dari `spec/id/`. Snapshot hasil sinkronisasi boleh disimpan di repository
Flutter agar `flutter run` dan binary rilis selalu membawa corpus yang sama.

MCP package tetap tidak bergantung pada Flutter API. Flutter memuat asset
snapshot saat server dimulai lalu memasok dokumen ke indeks/pengelola resource
MCP melalui boundary yang typed.

## 4. Alur jawaban agent

1. Pengguna mengajukan pertanyaan terkait RelGeo.
2. Instruksi tool MCP mengarahkan agent mencari spec sebelum menjawab aturan
   atau syntax.
3. Agent mengirim query natural language dan istilah RelGeo yang relevan ke
   `relgeo_search_spec`.
4. Agent memeriksa judul, cuplikan, status normatif, dan provenance hasil.
5. Agent mengambil section penuh melalui `relgeo_get_spec_section` bila cuplikan
   belum cukup.
6. Agent menjawab berdasarkan section normatif dan menautkan sumbernya.
7. Contoh hanya ditambahkan bila membantu menerapkan aturan; contoh tetap
   dilabeli sebagai ilustrasi.

Jika tidak ada hasil yang cukup relevan, agent menyatakan bahwa spec yang
tersedia belum memberi jawaban dan dapat menyebutkan section terdekat. Agent
tidak mengarang aturan dari contoh atau mengklaim bahwa MCP dapat mengedit
dokumen.

## 5. Tahap implementasi

### Tahap 1 — Kontrak dan snapshot

- [ ] kunci schema query, hasil, section ID, dan provenance;
- [ ] inventarisasi seluruh Markdown dalam `spec/id/` beserta status dokumen;
- [ ] implementasikan sinkronisasi/check snapshot untuk Flutter assets;
- [ ] tampilkan versi dan revision/digest snapshot pada capabilities atau index.

**Kriteria selesai:** desktop memiliki semua file Markdown aktif dan drift
snapshot dapat dideteksi secara lokal/CI.

### Tahap 2 — Indeks dan retrieval

- [ ] implementasikan pemecahan section berdasarkan heading Markdown;
- [ ] pertahankan heading induk, status dokumen, path, anchor, dan URL sumber;
- [ ] implementasikan ranking leksikal deterministik;
- [ ] tambah pencarian dan pembacaan section pada server MCP;
- [ ] ganti rule `rect` yang dikodekan manual dengan hasil corpus;
- [ ] expose resource index/section tanpa memuat seluruh spec otomatis ke
  context agent.

**Kriteria selesai:** setiap file dapat dicari dan section hasil dapat dibaca
utuh; hasil tidak bergantung pada koneksi jaringan.

### Tahap 3 — Agent routing dan desktop integration

- [ ] deskripsikan tool agar model menggunakannya untuk pertanyaan natural
  language tentang seluruh RelGeo spec;
- [ ] instruksikan agent mencari aturan normatif dulu dan memakai contoh hanya
  sebagai pelengkap;
- [ ] pertahankan tool alias yang diperlukan untuk client MCP yang sudah
  terkonfigurasi;
- [ ] pastikan capability report menyebut coverage snapshot yang sebenarnya;
- [ ] verifikasi server desktop memuat asset yang terbundel dan tidak membaca
  path repository host.

**Kriteria selesai:** MCP client dapat menemukan dan membaca bagian relevan
berdasarkan permintaan pengguna melalui desktop lokal.

### Tahap 4 — Verifikasi kualitas retrieval

- [ ] siapkan query intent Indonesia dan istilah DSL Inggris untuk setiap area
  spec utama;
- [ ] cek bahwa hasil teratas memuat bab/section normatif yang benar;
- [ ] cek query ambigu menghasilkan beberapa section dengan provenance jelas;
- [ ] cek query tanpa hasil menghasilkan respons kosong yang jujur;
- [ ] cek contoh tidak disajikan sebagai aturan;
- [ ] cek snapshot bekerja offline dan sinkron dengan versi spec yang dibundel.

**Kriteria selesai:** skenario penerimaan di bawah terpenuhi di MCP Inspector
dan Codex Desktop yang terhubung ke server lokal.

## 6. Skenario penerimaan

| Permintaan | Hasil yang diharapkan |
| --- | --- |
| “Bagaimana cara menggambar kotak?” | Pencarian menemukan aturan `rect`/geometry object dan aturan ukuran/placement yang relevan. Agent menjelaskan sintaks berdasarkan spec dan menyebut bahwa persegi memakai lebar serta tinggi sama hanya jika sumber mendukungnya. |
| “Apa beda `parameters` dan `constants`?” | Hasil memuat section kedua kontrak dengan provenance terpisah; agent merangkum perbedaan berdasarkan aturan normatif. |
| “Bagaimana menempatkan titik di path?” | Hasil memuat aturan placement/path/anchor yang relevan, bukan contoh acak yang tidak berkaitan. |
| Pertanyaan untuk bab presentation | Pencarian dapat menemukan section dimension, annotation, roles, views, atau sheets. |
| Query yang tidak tercakup | Agent menyatakan tidak menemukan aturan yang cukup; tidak mengarang syntax. |

## 7. Batas dan keputusan lanjutan

- Pencarian hanya membaca snapshot spec yang dibundel dan tidak mengakses
  dokumen pengguna lain.
- Retrieval tidak membuat, memvalidasi, merender, atau mengubah gambar dengan
  sendirinya.
- Snapshot diperbarui bersama proses sinkronisasi/release aplikasi; remote
  update otomatis bukan bagian tahap awal.
- Bahasa spec dapat bercampur Indonesia dan Inggris. Query expansion oleh
  agent menjadi bagian workflow; alias editorial terstruktur hanya
  dipertimbangkan jika evaluasi retrieval menunjukkan kebutuhan.
- Rencana katalog JSON lintas Language Service dan MCP ditunda dan bukan
  prasyarat rencana ini.
