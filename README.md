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

Workspace ini sudah menjadi baseline publik dan repository anak sudah terhubung sebagai submodule. Paket TypeScript pada compatibility line RelGeo DSL `0.5` juga sudah dipublikasikan ke npm sebagai `@relgeo/*` versi `0.5.0`.

Untuk integrasi lokal, gunakan `pnpm install --frozen-lockfile`. Untuk konsumsi publik, install paket dari npm setelah memastikan dependency dasarnya sudah tersedia di registry.

Lihat [peta repository](./docs/REPOSITORY-MAP.md) untuk ownership dan boundary setiap folder.

Lihat [master plan pematangan](./docs/MATURATION-MASTER-PLAN.md) untuk urutan peningkatan lintas-repo, exit gate, dan cara menurunkan setiap tahap menjadi sub-rencana yang lebih detail.
