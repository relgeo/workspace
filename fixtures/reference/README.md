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
15. `15-v05-boolean-intersection-candidate.yaml` — fixture `active` untuk scope contract intersection/subtract dan semantic geometry projection; nama file dipertahankan sebagai historical identifier
16. `16-v05-evaluator-units-candidate.yaml` — candidate capability untuk parameter length, unit conversion, derived placement, dan semantic geometry projection
17. `17-v06-invalid-unsupported-version.yaml` — fixture invalid untuk future-version rejection
18. `18-v10-invalid-unknown-version.yaml` — fixture invalid untuk unknown-version rejection
19. `19-v05-runtime-empty-boolean.yaml` — fixture valid secara struktur yang ditolak saat resolve dengan `BOOLEAN_EMPTY_RESULT`
20. `20-v05-runtime-multipart-boolean.yaml` — fixture valid secara struktur yang ditolak saat resolve dengan `BOOLEAN_MULTIPART_RESULT`
21. `21-v05-invalid-reference-path.yaml` — fixture invalid untuk structured unknown-reference code and path
22. `22-v05-runtime-empty-collection.yaml` — fixture valid secara struktur yang ditolak saat resolve dengan `INVALID_COLLECTION_ACCESS`
23. `23-v05-invalid-incomplete-editor.yaml` — fixture invalid untuk strict diagnostics dan editor recovery
24. `24-v05-collection-boolean-contract.yaml` — candidate capability untuk ordered Boolean collections dan repeat modes
25. `25-v05-invalid-operation-target.yaml` — fixture invalid untuk `INVALID_OPERATION_TARGET`
26. `26-v05-invalid-reverse-target.yaml` — fixture invalid untuk `INVALID_REVERSE_TARGET`
27. `27-v05-invalid-turtle-forward.yaml` — fixture invalid untuk `INVALID_TURTLE_FORWARD`
28. `28-v05-invalid-profile-override.yaml` — fixture invalid untuk profile yang mencoba mengubah constant
29. `29-v05-invalid-structured-type.yaml` — fixture invalid untuk structured type diagnostics
30. `30-v05-metadata-inherit-alias.yaml` — fixture aktif untuk metadata inherit dan alias propagation
31. `31-v05-geometry-composition-placement-query.yaml` — fixture aktif untuk geometry, composition, placement, dan query contracts
32. `32-v05-collection-constraint-contract.yaml` — fixture aktif untuk collection, boolean, repeat, divide/split, access, dan constraint contracts
33. `33-v05-presentation-metadata-serialization.yaml` — fixture aktif untuk dimension, annotation, roles, views/sheets, metadata, dan serialization contracts

Fixture 01–09 adalah coverage presentasional dan sheet pada dokumen `v0.4` yang masih didukung runtime. Fixture 10 menjadi baseline kecil untuk contract line aktif dan target perluasan conformance lintas consumer. Manifest boleh memiliki lebih dari satu fixture `active` agar baseline relasional tetap terjaga ketika capability baru dipromosikan.
Fixture 11 sengaja invalid: object `broken` tidak memiliki field `type`. Fixture ini harus tetap menghasilkan error parser dan diagnostics language service yang stabil.
Fixture 12 sengaja memotong flow collection YAML. Fixture 13 merujuk `missing.center` yang tidak didefinisikan. Keduanya harus menghasilkan error parser dan diagnostics language service yang stabil.
Fixture 14 sengaja memakai dua titik yang tidak sejajar. Parser dan resolver tetap berhasil, tetapi resolver harus menghasilkan satu violation `align` pada `constraints[0]`; snapshot scene dan SVG menjaga bentuk diagnostic serta visual helper tetap dapat direview.
Fixture 19 sengaja memakai dua rectangle yang tidak beririsan. Parser dan language service harus menerima struktur dokumennya, sedangkan resolver dan CLI harus menolak hasil boolean kosong dengan `BOOLEAN_EMPTY_RESULT`.
Fixture 20 sengaja membelah satu rectangle menjadi dua island dengan mode hasil `single`. Parser dan language service harus menerima struktur dokumennya, sedangkan resolver dan CLI harus menolak hasil multipart dengan `BOOLEAN_MULTIPART_RESULT`.
Fixture 21 merujuk path `missing.x` yang tidak didefinisikan dan menjaga code/path
`UNKNOWN_IDENTIFIER` tetap dapat direplay. Fixture 22 menjaga perbedaan antara
empty-collection editor recovery dan strict `INVALID_COLLECTION_ACCESS`. Fixture
23 menjaga strict `MISSING_REQUIRED_FIELD` sekaligus recovery metadata editor.
Fixtures 25–27 adalah invalid Core boundaries baru: operation target harus
merupakan geometry object, reverse target harus memiliki traversal yang dapat
dibalik, dan turtle forward harus finite serta positif. Runner memeriksa code,
phase, path, serta projection ke language-service dan CLI untuk ketiganya.
Fixture 28 menjaga bahwa profile hanya boleh mengoverride parameter yang
terdeklarasi; constant override ditolak dengan `UNKNOWN_FIELD` pada path
`profiles.compact.gap` dan diproyeksikan konsisten ke Core, language service,
dan CLI.
Fixture 15 berstatus `active` pada scope boolean/intersection yang dikunci
Decision Record 08 dan canonical run 37832260326; fixture 16 tetap
`capability`/candidate untuk evaluator/unit. Promosi fixture 15 tidak
menggantikan Fixture 10; beberapa fixture `active` dapat hidup berdampingan
selama masing-masing memiliki snapshot dan evidence yang dapat direview. Fixture
16 memakai `cliUnit: mm` pada manifest karena snapshot CLI harus eksplisit
memakai unit sumber `mm`, sedangkan default CLI tetap `px`.
