# Reference Fixtures

Folder ini menyimpan fixture YAML referensi yang dipakai lintas package sebagai baseline bersama.

Tujuannya:

1. satu scene contoh bisa dipakai oleh resolver TypeScript, renderer SVG TypeScript, dan port Flutter
2. drift implementasi lebih cepat terlihat karena beberapa package membaca sumber fixture yang sama
3. fixture bisa bertambah bertahap tanpa harus langsung mengganti seluruh test inline yang sudah ada

Aturan ringan:

1. fixture di sini harus portable dan tidak boleh bergantung pada path absolut lokal
2. nama file memakai penomoran agar urutan baca tetap stabil
3. satu fixture sebaiknya punya fokus utama yang jelas walau boleh menyentuh beberapa surface bahasa sekaligus

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
