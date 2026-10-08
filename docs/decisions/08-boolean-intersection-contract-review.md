# Decision Record 08 — Boolean/Intersection Contract Review

**Status keputusan:** disetujui sebagai promotion pertama pada Decision 09. **Status implementasi:** belum dipromosikan ke fixture/matrix active; pekerjaan itu masih terbuka dan Flutter sementara dijeda.
**Tanggal:** 2026-09-18  
**Owner:** relgeo/workspace + relgeo/core + relgeo/geometry + relgeo/flutter  
**Terkait:** [Sub-Rencana 07](../plans/07-flutter-capability-promotion-and-svg-parity.md)

## 1. Tujuan

Dokumen ini memisahkan contract yang sudah tertulis di spec dari perilaku
implementasi yang belum layak dijadikan jaminan publik. Fokusnya adalah
candidate fixture `15-v05-boolean-intersection-candidate`:

- line intersection pada fixture;
- boolean `intersect`;
- boolean `subtract`;
- semantic scene dan SVG projection lintas TypeScript dan Flutter.

Dokumen ini belum mengubah status fixture menjadi `active`. Ia adalah record
otoritatif untuk boundary promosi; activation tetap menunggu evidence gate.

## 2. Evidence saat ini

| Area | Temuan | Klasifikasi |
|---|---|---|
| Spec | Boolean v0.5 mencantumkan `union`, `subtract`, `intersect`, `xor` pada `ClosedShape 2D` dan mode `single`/`multi`. | Normatif yang sudah ada |
| Spec | `intersection(...)` menghasilkan `point` atau `collection<point>` bergantung konteks dan mendukung selector. | Normatif yang sudah ada |
| Fixture 15 | Menguji line-line intersection, rectangle intersection, dan rectangle subtraction. | Candidate evidence |
| TypeScript | `ClipperBooleanEngine` menyediakan empat operasi; resolver memvalidasi operand, empty result, dan multipart result. | Implementasi |
| Flutter | Adapter Clipper2 menyediakan operasi boolean, dan semantic projection candidate memiliki evidence lokal supporting. | Implementasi + supporting/partial; canonical CI terbaru belum tersedia |
| Geometry normalization | Rect, circle, polygon, path, boolean, dan clone dinormalisasi; circle disampling menjadi 64 titik; cleaning memakai ambang `1e-7`. | Detail implementasi |
| Ordering/topology | Output ring/island dan titik penutup dinormalisasi oleh comparator; urutan engine tidak boleh dianggap sebagai contract tanpa keputusan eksplisit. | Gap contract |

Evidence lokal yang konsisten pada `.internal/tmp-test.txt` dan
`.local/integration-manual-evidence.json` cukup untuk memvalidasi candidate
secara supporting/partial pada tahap review ini. Evidence tersebut tidak
mengubah boundary menjadi active contract dan tidak menggantikan canonical CI
atau public gate pada tahap activation.

## 3. Boundary contract yang disetujui untuk promotion pertama

Bagian ini adalah teks boundary normatif untuk fixture yang kelak dipromosikan
menjadi `active`. Ia tidak mengubah status fixture saat ini dan tidak mengubah
implementasi consumer. Active contract hanya berlaku setelah seluruh evidence
lintas consumer dan clean-checkout gate pada Sub-Rencana 07 lulus.

### 3.1 Surface yang dijamin

Promotion pertama menjamin surface berikut:

- `intersection(horizontal, vertical)` untuk dua `line` finite dan
  non-degenerate pada fixture; tanpa selector, hasil wajib satu `point`;
- boolean `intersect` dengan minimal dua operand `rect` closed, finite, dan
  non-degenerate pada field `shapes`;
- boolean `subtract` dengan satu `rect` `base` dan minimal satu `rect` pada
  field `tools`;
- hasil boolean berjenis `boolean`, mempertahankan identity object, bbox,
  anchors yang tersedia, outer ring, dan hole topology pada resolved scene;
- `result.mode: single` (default) hanya menerima satu island; `result.mode:
  multi` mempertahankan seluruh island secara semantik.

`union`, `xor`, operand selain rectangle, selector intersection yang lebih
luas, dan topology yang belum memiliki fixture lintas consumer tetap berada di
luar boundary ini meskipun sebagian sudah didukung oleh implementation.

### 3.2 Topology, ring, dan numerik

- jumlah island dan hubungan outer-ring/hole dibandingkan secara semantik;
- ring dianggap closed setelah normalisasi; duplicate closing endpoint tidak
  dihitung sebagai vertex tambahan;
- arah ring, starting vertex, urutan island, urutan hole, attribute order,
  whitespace, dan formatting SVG bukan contract; comparator melakukan
  canonicalization yang sudah ada;
- acceptance memakai tolerance semantic comparator yang sudah terdokumentasi
  (`1e-6` pada projection fixture); tolerance itu adalah evidence rule, bukan
  parameter DSL yang boleh diperlebar untuk meloloskan fixture;
- cleaning internal (`1e-7`) dan sampling/representasi engine tidak menjadi
  jaminan publik.

Input zero-area, non-finite, self-intersecting, atau closed-shape degenerat
lainnya tidak termasuk contract promotion pertama. Bentuk tersebut harus tetap
candidate/unsupported sampai memiliki decision record dan fixture tersendiri.

### 3.3 Error boundary

Runtime normal wajib mempertahankan error berikut untuk surface yang dijamin:

| Kondisi | Error contract |
|---|---|
| operation tidak dikenal | `INVALID_BOOLEAN_OPERATION` |
| `subtract` tanpa `base` atau `tools` | `INVALID_BOOLEAN_OPERATION` |
| operasi berbasis `shapes` tanpa operand | `INVALID_BOOLEAN_OPERATION` |
| hasil boolean kosong | `BOOLEAN_EMPTY_RESULT` |
| hasil multipart pada mode `single` | `BOOLEAN_MULTIPART_RESULT` |
| line intersection tidak menghasilkan titik pada konteks point | `NO_INTERSECTION` |
| line intersection ambigu tanpa selector | `MULTIPLE_INTERSECTIONS` |

Unknown reference, invalid shape normalization, dan kegagalan engine umum
belum mendapat error code lintas consumer yang cukup stabil; ketiganya tidak
boleh diklaim sebagai bagian dari active boundary ini.

### 3.4 Gate activation

Boundary di atas adalah prasyarat, bukan bukti activation. Fixture 15 tetap
`capability` sampai TypeScript geometry/core/renderer, Flutter conformance,
CLI, Playground, semantic SVG comparator, integration gate lokal, dan public
gate lulus dari checkout bersih. Fixture 16 evaluator/unit tetap `candidate`
dan tidak ikut berubah status.

## 4. Review rationale dan batas perluasan

Rekomendasi saya adalah mempromosikan hanya surface yang benar-benar sudah
memiliki fixture lintas consumer, lalu memperluasnya secara terpisah.

### 4.1 Line intersection

Untuk promosi pertama, jaminan minimum adalah:

1. dua object `line` finite yang tidak degenerat;
2. hasil tunggal yang dipilih dari perpotongan line sesuai selector;
3. hasil tanpa selector mengikuti error model jika jumlah titik bukan satu;
4. hasil yang tidak berpotongan menghasilkan `NO_INTERSECTION` pada konteks
   yang mengharuskan titik;
5. koordinat dibandingkan dengan tolerance numerik yang sudah dipakai oleh
   semantic comparator, bukan exact floating-point equality.

Kemampuan line-circle, circle-circle, arc, path-like, selector kompleks, dan
multi-result tetap boleh didukung implementasi, tetapi tidak ikut diklaim
sebagai bagian dari promotion pertama kecuali fixture-nya ditambahkan.

### 4.2 Boolean intersection dan subtraction

Untuk promotion pertama, jaminan minimum adalah:

1. operand berupa `ClosedShape 2D` yang sudah didukung fixture: rectangle;
2. `intersect` menerima dua atau lebih operand pada field `shapes`;
3. `subtract` menerima satu `base` dan satu atau lebih `tools`;
4. hasil default `single` harus tepat satu island; hasil multipart harus
   ditolak dengan `BOOLEAN_MULTIPART_RESULT`;
5. `result.mode: multi` boleh menghasilkan beberapa island yang deterministik
   secara semantik;
6. hasil memiliki object identity, tipe boolean, ring/holes, bbox, dan anchor
   yang dapat dipakai oleh query/renderer sesuai surface resolved object;
7. hasil kosong pada runtime normal menghasilkan `BOOLEAN_EMPTY_RESULT`;
8. bentuk ring dan titik penutup dibandingkan secara semantik setelah
   normalisasi, bukan berdasarkan urutan vertex atau byte SVG.

`union`, `xor`, circle/polygon/path/clone sebagai operand, dan topology holes
yang lebih luas tetap merupakan perluasan contract berikutnya. Mereka sudah
tersedia pada sebagian implementation surface atau spec, tetapi belum
tercakup oleh fixture promotion pertama.

## 5. Error dan input boundary review

| Kondisi | Keputusan rekomendasi | Status |
|---|---|---|
| operation tidak dikenal | `INVALID_BOOLEAN_OPERATION` | dapat dijamin sekarang |
| `subtract` tanpa `base` atau `tools` | `INVALID_BOOLEAN_OPERATION` | dapat dijamin sekarang |
| operation selain subtract tanpa `shapes` | `INVALID_BOOLEAN_OPERATION` | dapat dijamin sekarang |
| operand ID tidak dikenal | error resolution yang deterministik | perlu fixture/error-code review |
| hasil kosong | `BOOLEAN_EMPTY_RESULT` pada runtime | dapat dijamin sekarang |
| hasil multipart pada mode single | `BOOLEAN_MULTIPART_RESULT` | dapat dijamin sekarang |
| shape tidak tertutup/self-intersecting/degenerate | jangan dipromosikan sampai boundary ditulis | masih terbuka |
| ring orientation dan starting vertex | bukan contract; comparator melakukan normalisasi | rekomendasi siap diterima |
| tolerance dan circle sampling | implementation detail, bukan jaminan geometry | jangan dipromosikan sebagai contract |

## 6. Topology dan determinism

Acceptance comparator sebaiknya memeriksa:

```mermaid
flowchart LR
  source["resolved boolean"] --> normalize["normalize rings and closure"]
  normalize --> islands["compare island count"]
  islands --> outer["compare outer geometry"]
  outer --> holes["compare hole topology"]
  holes --> anchors["compare public anchors"]
  anchors --> pass["semantic pass"]
```

Yang perlu dijamin:

- jumlah island sesuai mode hasil;
- outer ring dan hole topology setara;
- ring boleh berbeda arah atau titik awal setelah normalisasi;
- endpoint penutup tidak dihitung sebagai vertex tambahan;
- ordering hanya dijamin setelah canonicalization comparator;
- tolerance tidak boleh diperlebar diam-diam untuk membuat fixture lulus.

## 7. Scope exclusions yang sudah dikonfirmasi

Keputusan 09 mengonfirmasi pilihan berikut sebagai boundary promotion pertama:

1. **Promosi awal:** line-line intersection + rectangle `intersect` +
   rectangle `subtract`.
2. **Operasi yang belum active:** `union`, `xor`, dan operand non-rectangle
   tetap `partial/candidate` sampai fixture lintas consumer tersedia.
3. **Topology:** mode `single` dan `multi` dipertahankan; multi-island tidak
   boleh disederhanakan menjadi satu path.
4. **Numerik:** tolerance comparator tetap menjadi evidence rule, bukan DSL
   promise; detail `1e-7` cleaning dan 64-sample circle tidak diekspos sebagai
   public contract.
5. **Flutter:** promotion hanya setelah fixture aktif lulus TypeScript,
   Flutter, CLI, Playground, dan CI dari checkout bersih.

## 8. Temuan kesiapan promosi

Review terhadap runner conformance menemukan satu hambatan desain yang harus
diselesaikan sebelum fixture 15 dapat dipromosikan. Manifest memiliki fixture
10 sebagai baseline relasional yang masih diperlukan, sementara promosi
capability tidak boleh menghapus baseline tersebut. Runner kini sudah diubah
agar menerima minimal satu fixture `active`, sehingga beberapa baseline dapat
hidup berdampingan.

```mermaid
flowchart TD
  candidate["Fixture 15 boolean/intersection"] --> promote["Promote to active"]
  promote --> invariant["Runner menerima minimal satu active fixture"]
  invariant --> baseline["Fixture 10 relational baseline sudah active"]
  baseline --> choice{"Pilih kebijakan"}
  choice --> replace["Ganti baseline 10\nberisiko kehilangan baseline"]
  choice --> multi["Pertahankan beberapa active fixture\nrekomendasi"]
  multi --> runner["Runner, docs, dan matrix mendukungnya"]
  runner --> verify["Jalankan full consumer matrix"]
```

Invariant manifest sekarang adalah “minimal satu fixture active; setiap fixture
active wajib memiliki snapshot resolved/output”. Owner canonical tetap berada
di level manifest. Dengan begitu fixture 10 tetap menjadi baseline relasional
dan fixture 15 dapat menjadi baseline capability setelah negative fixture
serta evidence lintas consumer tersedia. Status fixture tetap tidak berubah
secara otomatis hanya karena runner sudah mendukung beberapa active fixture.

## 9. Checklist tindak lanjut

- [x] inventory spec, fixture, resolver, engine, matrix, dan error tests;
- [x] rekomendasi surface promotion pertama ditulis;
- [x] boundary implementation-detail vs contract ditulis;
- [x] arah contract dan promosi bertahap pada bagian 7 disetujui secara prinsip;
- [x] boundary operasi awal, topology, tolerance, error behavior, dan output
  semantics ditetapkan sebagai contract boundary;
- [x] audit kesiapan promosi menemukan invariant single-active-fixture;
- [x] ubah policy runner agar beberapa fixture `active` dapat dipelihara;
- [x] tambahkan negative fixture untuk empty-result dan multipart-result boundaries;
- [ ] ubah fixture 15 menjadi `active` hanya setelah keputusan diterima;
- [ ] jalankan full consumer matrix dan simpan evidence release;
- [ ] perbarui matrix, README, spec reference, dan Sub-Rencana 07.

## 10. Kesimpulan

Secara teknis candidate sudah cukup matang untuk direview, dan boundary
promosi awal sudah diterima secara prinsip. Candidate belum boleh disebut
active sebelum evidence lintas consumer selesai. Negative fixture untuk
`BOOLEAN_EMPTY_RESULT` sekarang menjadi bagian dari conformance workspace;
boundary unsupported/degenerate lain tetap ditahan sampai memiliki contract
dan fixture yang spesifik.
Policy multi-active fixture sudah diterapkan pada runner tanpa mengubah status
candidate secara otomatis. Rekomendasi terbaik tetap promosi kecil dengan tiga
surface di atas, sambil menahan klaim untuk operation dan topology yang belum
memiliki fixture lintas consumer.

## 11. Inventaris presentation SVG

Audit renderer TypeScript dan exporter Flutter menunjukkan empat kelompok
property yang tidak boleh dicampur dengan semantic geometry:

| Property | Rekomendasi | Alasan |
|---|---|---|
| `id`, object kind, primitive/path geometry | semantic core | diperlukan untuk identity, scene projection, dan geometry comparison |
| `data-role`, `data-intent`, `data-label`, visibility/filter role | presentation contract terpilih | dibutuhkan consumer yang mencari metadata atau menyaring role; perlu fixture khusus sebelum dipromosikan |
| `fill`, `stroke`, `stroke-width`, opacity, dash, font family/size | presentation best-effort | renderer boleh punya kebijakan visual berbeda selama semantic geometry sama |
| `viewBox`, width/height, padding, `preserveAspectRatio` | surface-specific | bergantung pada target SVG/export context dan belum cocok menjadi parity inti |
| text metrics, line wrapping, dimension typography | surface-specific | dipengaruhi font/runtime dan tidak stabil lintas TypeScript/Flutter |
| diagnostic overlay dan animasi violation | runtime diagnostic presentation | harus diuji sebagai diagnostic surface terpisah, bukan bagian geometri |
| whitespace, attribute order, path formatting, marker implementation | implementation detail | tidak membawa makna contract |

Kesimpulan inventaris: untuk promotion pertama, tidak perlu memperluas
comparator SVG. Jika kemudian metadata atau diagnostic overlay menjadi public
consumer contract, buat fixture dan comparator presentation terpisah dengan
scope yang sempit.
