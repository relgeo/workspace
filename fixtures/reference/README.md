# Reference Fixtures

Folder ini menyimpan fixture YAML referensi yang dipakai lintas package sebagai baseline bersama. Owner koordinasinya `relgeo/workspace`; daftar machine-readable, status, dan alasan setiap kelas fixture ada di `../manifest.json`.

Tujuannya:

1. satu scene contoh bisa dipakai oleh resolver TypeScript, renderer SVG TypeScript, dan port Flutter
2. drift implementasi lebih cepat terlihat karena beberapa package membaca sumber fixture yang sama
3. fixture bisa bertambah bertahap tanpa harus langsung mengganti seluruh test inline yang sudah ada

Aturan ringan:

1. fixture di sini harus portable dan tidak boleh bergantung pada path absolut lokal
2. nama file memakai penomoran agar urutan baca tetap stabil
3. satu fixture sebaiknya punya fokus utama yang jelas walau boleh menyentuh beberapa surface bahasa sekaligus;
4. fixture `active` mengikuti compatibility line workspace saat ini;
5. fixture `supported-legacy` dipertahankan untuk membuktikan backwards compatibility, bukan sebagai contoh utama authoring baru.

Fixture awal:

1. `01-text-anchor-multiline.yaml`
2. `02-mixed-presentational-sheet.yaml`
3. `03-sheet-title-block.yaml`
4. `04-grouped-sheet-rooting.yaml`
5. `05-clone-sheet-target.yaml`
6. `06-nested-structural-sheet.yaml`
7. `07-component-sheet-meta-override.yaml`
8. `08-sheet-xml-escaping.yaml`
9. `09-multi-sheet-title-block.yaml`
10. `10-v05-relational-baseline.yaml` — fixture aktif lintas surface untuk DSL `v0.5`
11. `11-v05-invalid-missing-type.yaml` — fixture invalid untuk parser dan diagnostics DSL `v0.5`
12. `12-v05-invalid-yaml-syntax.yaml` — fixture invalid untuk YAML syntax diagnostics DSL `v0.5`
13. `13-v05-invalid-unknown-reference.yaml` — fixture invalid untuk unknown-reference diagnostics DSL `v0.5`
14. `14-v05-runtime-align-violation.yaml` — fixture valid secara struktur yang menghasilkan runtime diagnostic `align` setelah resolve DSL `v0.5`
15. `15-v05-boolean-intersection-candidate.yaml` — candidate capability untuk intersection/subtract dan semantic geometry projection
16. `16-v05-evaluator-units-candidate.yaml` — candidate capability untuk parameter length, unit conversion, derived placement, dan semantic geometry projection
17. `19-v05-runtime-empty-boolean.yaml` — fixture valid secara struktur yang ditolak saat resolve dengan `BOOLEAN_EMPTY_RESULT`
18. `20-v05-runtime-multipart-boolean.yaml` — fixture valid secara struktur yang ditolak saat resolve dengan `BOOLEAN_MULTIPART_RESULT`

Fixture 01–09 adalah coverage presentasional dan sheet pada dokumen `v0.4` yang masih didukung runtime. Fixture 10 menjadi baseline kecil untuk contract line aktif dan target perluasan conformance lintas consumer. Manifest boleh memiliki lebih dari satu fixture `active` agar baseline relasional tetap terjaga ketika capability baru dipromosikan.
Fixture 11 sengaja invalid: object `broken` tidak memiliki field `type`. Fixture ini harus tetap menghasilkan error parser dan diagnostics language service yang stabil.
Fixture 12 sengaja memotong flow collection YAML. Fixture 13 merujuk `missing.center` yang tidak didefinisikan. Keduanya harus menghasilkan error parser dan diagnostics language service yang stabil.
Fixture 14 sengaja memakai dua titik yang tidak sejajar. Parser dan resolver tetap berhasil, tetapi resolver harus menghasilkan satu violation `align` pada `constraints[0]`; snapshot scene dan SVG menjaga bentuk diagnostic serta visual helper tetap dapat direview.
Fixture 19 sengaja memakai dua rectangle yang tidak beririsan. Parser dan language service harus menerima struktur dokumennya, sedangkan resolver dan CLI harus menolak hasil boolean kosong dengan `BOOLEAN_EMPTY_RESULT`.
Fixture 20 sengaja membelah satu rectangle menjadi dua island dengan mode hasil `single`. Parser dan language service harus menerima struktur dokumennya, sedangkan resolver dan CLI harus menolak hasil multipart dengan `BOOLEAN_MULTIPART_RESULT`.
Fixture 15 dan 16 berstatus `capability`, bukan active baseline. Keduanya boleh mengunci expected scene/SVG dan evidence lintas consumer, tetapi promosi ke active contract memerlukan keputusan compatibility dan evidence CI. Promosi tidak menggantikan Fixture 10; beberapa fixture `active` dapat hidup berdampingan selama masing-masing memiliki snapshot dan evidence yang dapat direview. Fixture 16 memakai `cliUnit: mm` pada manifest karena snapshot CLI harus eksplisit memakai unit sumber `mm`, sedangkan default CLI tetap `px`.
