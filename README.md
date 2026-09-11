# RelGeo Workspace

Root workspace untuk mengoordinasikan repository-repository RelGeo.

Repository ini bukan rumah implementasi utama. Folder pada level root selain `docs/` dan `scripts/` akan menjadi repository anak yang dipasang sebagai submodule.

## Struktur

- `docs/` — catatan koordinasi lintas-repo;
- `scripts/` — bootstrap dan verification lintas-repo;
- `spec/` — source repository spec;
- `relgeo.github.io/` — source website organization site;
- `playground/` — source playground;
- package dan aplikasi lain — repository anak sesuai peta ownership.

## Status

Workspace ini sedang disiapkan sebagai baseline publik. Repository anak belum terhubung sebagai remote atau submodule sampai staging dan verification selesai.

Lihat [peta repository](./docs/REPOSITORY-MAP.md) untuk ownership dan boundary setiap folder.
