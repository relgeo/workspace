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

Integration gate lintas-repo dapat dijalankan dengan `pnpm run integration:gate -- --local`. Mode ini memakai workspace links untuk iterasi lokal. Untuk menguji consumer tanpa sibling source dan memakai package dari npm, gunakan `pnpm run integration:public`. Keduanya dapat menerima `--report=.local/<nama>.json`; detail helper ada di [scripts/README.md](./scripts/README.md).

Sebelum publish manual, jalankan `pnpm run release:preflight` dari working tree yang bersih. Preflight read-only ini menggabungkan pemeriksaan baseline strict, compatibility matrix, audit tarball, dan integration gate lokal; ia tidak menjalankan `npm publish`.

Lihat [peta repository](./docs/REPOSITORY-MAP.md) untuk ownership dan boundary setiap folder.

Lihat [master plan pematangan](./docs/MATURATION-MASTER-PLAN.md) untuk urutan peningkatan lintas-repo, exit gate, dan cara menurunkan setiap tahap menjadi sub-rencana yang lebih detail.

Release decision record dan snapshot evidence publik ada di [docs/releases](./docs/releases/); validasi baseline dapat dijalankan dengan `pnpm run release:record:check`.
