# Repository Map

Peta ini menjelaskan boundary publik dan ownership pada root workspace.

| Path root | Repository target | Ownership |
| --- | --- | --- |
| `relgeo.github.io/` | `relgeo/relgeo.github.io` | website dan deployment Pages |
| `playground/` | `relgeo/playground` | aplikasi playground |
| `spec/` | `relgeo/spec` | source normatif bahasa |
| `core/` | `relgeo/core` | runtime core |
| `geometry/` | `relgeo/geometry` | geometri analitik |
| `language-service/` | `relgeo/language-service` | language intelligence |
| `renderer-svg/` | `relgeo/renderer-svg` | renderer SVG |
| `cli/` | `relgeo/cli` | command-line interface |
| `remark-relgeo/` | `relgeo/remark-relgeo` | plugin Markdown preview/embed |
| `remark-relgeo-hl/` | `relgeo/remark-relgeo-hl` | plugin Markdown highlighting |
| `flutter/` | `relgeo/flutter` | workbench Flutter |

Root `docs/` dan `scripts/` bukan submodule. Keduanya menjadi bagian dari repository `relgeo/workspace`.

## Ownership Dokumentasi

1. `relgeo/workspace` memiliki catatan orkestrasi lintas-repo yang tipis;
2. `relgeo/spec` memiliki dokumentasi normatif bahasa;
3. setiap repository package memiliki README, API, development, test, dan release guide-nya sendiri;
4. `relgeo/relgeo.github.io` menyajikan dokumentasi publik dari source yang dimiliki atau dirujuk secara eksplisit.

Website mengambil source spec saat build dan menyajikannya pada `/docs/language-spec/`. Website bukan pemilik kontrak normatif tersebut.

## Aturan Perubahan

Perubahan pada folder submodule harus dilakukan dari repository anak terkait. Root hanya merekam pointer commit submodule setelah baseline anak diverifikasi.
