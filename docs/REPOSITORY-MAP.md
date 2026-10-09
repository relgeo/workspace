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
| `mcp/` | `relgeo/mcp` | pure-Dart MCP contract, tools/resources, and transport adapters |

Root `docs/` dan `scripts/` bukan submodule. Keduanya menjadi bagian dari repository `relgeo/workspace`.

## Boundary MCP dan Flutter

`mcp/` adalah submodule resmi dari `relgeo/mcp`. Package Dart `relgeo_mcp`
memiliki owner teknis MCP dan owner keputusan lintas-repo `Agus Made`,
sedangkan `relgeo/workspace` mengatur orchestration dan evidence lintas-repo.

`relgeo_mcp` boleh bergantung pada kontrak RelGeo yang sudah dipin, tetapi tidak
bergantung pada Flutter, `BuildContext`, widget, filesystem, atau lifecycle
halaman. `flutter/lib/src/mcp/workbench_agent_bridge.dart` adalah satu-satunya
arah integrasi host: ia mengimplementasikan `RelGeoAgentBridge` terhadap
document session/editor/undo. Protocol logic, tool schema, resource URI, token,
dan transport tidak ditempatkan di widget layer.

Compatibility policy:

1. `relgeo_mcp` mengikuti compatibility line DSL `0.5`, tetapi versi Dart
   `0.1.0-dev.1` tetap private/non-publishable selama conformance SDK dan
   transport belum selesai;
2. dependency Flutter adalah path dependency `../mcp`; checkout workspace
   menyediakan sibling submodule tersebut, dan standalone Flutter CI
   meng-checkout `relgeo/mcp` pada sibling path yang sama;
3. package MCP bukan anggota release order npm. Perubahan normatif pada
   `spec/id` memerlukan pembaruan MCP snapshot/provenance sebelum release
   desktop, sedangkan perubahan protocol/transport dapat dirilis independen
   selama DTO contract tetap kompatibel;
4. perubahan `RelGeoAgentBridge` atau `mcp_schema.dart` yang breaking adalah
   compatibility event untuk Flutter host dan harus dicatat bersama matrix.

## Paket npm Publik

Paket TypeScript berikut diterbitkan pada compatibility line `0.5.x`:

| Package | Repository |
| --- | --- |
| `@relgeo/geometry` | `relgeo/geometry` |
| `@relgeo/core` | `relgeo/core` |
| `@relgeo/language-service` | `relgeo/language-service` |
| `@relgeo/renderer-svg` | `relgeo/renderer-svg` |
| `@relgeo/remark-relgeo` | `relgeo/remark-relgeo` |
| `@relgeo/remark-relgeo-hl` | `relgeo/remark-relgeo-hl` |
| `@relgeo/cli` | `relgeo/cli` |

Patch release boleh bergerak mandiri. Perubahan kontrak bahasa yang breaking harus memindahkan seluruh line package secara terkoordinasi ke `0.6.x`.

## Ownership Dokumentasi

1. `relgeo/workspace` memiliki catatan orkestrasi lintas-repo yang tipis;
2. `relgeo/spec` memiliki dokumentasi normatif bahasa;
3. setiap repository package memiliki README, API, development, test, dan release guide-nya sendiri;
4. `relgeo/relgeo.github.io` menyajikan dokumentasi publik dari source yang dimiliki atau dirujuk secara eksplisit.

Website mengambil source spec saat build dan menyajikannya pada `/docs/language-spec/`. Website bukan pemilik kontrak normatif tersebut.

## Aturan Perubahan

Perubahan pada folder submodule harus dilakukan dari repository anak terkait. Root hanya merekam pointer commit submodule setelah baseline anak diverifikasi.
