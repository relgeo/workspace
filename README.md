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

Workspace ini sudah menjadi baseline publik dan repository anak sudah terhubung sebagai submodule. Paket TypeScript berada pada compatibility line RelGeo DSL `0.5`; baseline package berada pada `0.5.0`, dengan `@relgeo/core` dan `@relgeo/language-service` sudah memiliki patch `0.5.1` di npm.

Toolchain Node lokal dipin pada `24.21.0` melalui [.node-version](./.node-version). Gunakan nvm, mise, asdf, atau pengelola versi lain yang membaca file tersebut sebelum menjalankan gate.

Untuk integrasi lokal, gunakan `pnpm install --frozen-lockfile`. Untuk konsumsi publik, install paket dari npm setelah memastikan dependency dasarnya sudah tersedia di registry.

Integration gate lintas-repo dapat dijalankan dengan `pnpm run integration:gate -- --local`. Mode ini memakai workspace links untuk iterasi lokal. Untuk menguji consumer tanpa sibling source dan memakai package dari npm, gunakan `pnpm run integration:public`. Keduanya dapat menerima `--report=.local/<nama>.json`; detail helper ada di [scripts/README.md](./scripts/README.md).

Sebelum publish manual, jalankan `pnpm run release:preflight` dari working tree yang bersih. Preflight read-only ini menggabungkan pemeriksaan baseline strict, compatibility matrix, audit tarball, dan integration gate lokal; ia tidak menjalankan `npm publish`.

Lihat [peta repository](./docs/REPOSITORY-MAP.md) untuk ownership dan boundary setiap folder.

Lihat [master plan pematangan](./docs/MATURATION-MASTER-PLAN.md) untuk urutan peningkatan lintas-repo, exit gate, dan cara menurunkan setiap tahap menjadi sub-rencana yang lebih detail.

## MCP full-spec retrieval

RelGeo MCP kini memiliki jalur retrieval spec penuh secara offline pada
desktop: seluruh snapshot Markdown `spec/id/` dibundel ke Flutter, lalu
`relgeo_search_spec` dan `relgeo_get_spec_section` mengembalikan section
normatif dengan provenance, revision, dan digest. Package MCP tetap pure Dart;
Flutter hanya menjadi asset/host bridge. Jalankan `pnpm run spec:snapshot:check`
untuk memeriksa drift snapshot. Evidence deterministik dan batas yang belum
terverifikasi (Inspector, Codex Desktop live smoke, dan loopback HTTP pada
managed runner) dicatat di [MCP conformance runbook](./docs/mcp/03-sdk-conformance-runbook.md)
dan [Plan 14](./docs/plans/14-mcp-full-spec-search.md). Workspace mencatat
commit MCP dan Flutter yang menyediakan jalur tersebut; smoke test langsung
tetap menjadi evidence follow-up.

Release decision record dan snapshot evidence publik ada di [docs/releases](./docs/releases/); validasi baseline dapat dijalankan dengan `pnpm run release:record:check`.
