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

## Capability inventory boundary

`docs/capability-map/INVENTORY-PROTOCOL.md` menetapkan aturan discovery dan
status untuk inventory capability. Matrix capability adalah reporting view
berbasis evidence; ia tidak menggantikan source of truth child repository,
normative spec, package contract, atau deployment workflow. Matrix lama,
roadmap, dan public claim dipakai sebagai historical input, bukan sebagai daftar
capability final.

Inventory wajib mencakup `spec`, `geometry`, `core`, `renderer-svg`,
`language-service`, `cli`, `remark-relgeo`/`remark-relgeo-hl`, `playground`,
`relgeo.github.io`, `flutter`, `mcp`, dan cross-repository orchestration.
Status implementation, evidence, parity, dan scope dilaporkan terpisah;
evidence lokal, CI/canonical, dan public tidak dipromosikan satu sama lain.

Expected Markdown Plugins capability catalog berada di
[`docs/capability-map/markdown-surfaces/expected-capability-catalog.md`](./capability-map/markdown-surfaces/expected-capability-catalog.md).
Katalog ini mendefinisikan target user, workflow integrasi/command package,
preview/embed, source highlighting, website/Pages consumption, roadmap,
kontrak package dan DSL, serta scope boundary sebelum implementation comparison;
capability yang belum ada tetap dicatat sebagai expected-but-missing.

Expected Playground capability catalog berada di
[`docs/capability-map/playground/expected-capability-catalog.md`](./capability-map/playground/expected-capability-catalog.md).
Katalog ini mendefinisikan target user, journey browser IDE, workflow/menu dan
command surface, roadmap/maturation, kontrak DSL serta persistence/viewport,
dan scope boundary sebelum implementation comparison; capability yang belum
dibuat, ditunda, atau masih menunggu keputusan rinci tetap dicatat.

Expected CLI capability catalog berada di
[`docs/capability-map/cli/expected-capability-catalog.md`](./capability-map/cli/expected-capability-catalog.md).
Katalog ini mendefinisikan user journey, target pengguna, command/workflow,
roadmap, kontrak, dan scope boundary CLI sebelum audit implementation; capability
yang belum ada tetap dicatat sebagai expected-but-missing.

Expected catalog orchestration lintas-repository berada di
[`docs/capability-map/cross-repository/expected-capability-catalog.md`](./capability-map/cross-repository/expected-capability-catalog.md).
Katalog tersebut disusun dari requirement/workflow/scope decisions sebelum audit
implementation; kode dan matrix lama hanya menjadi input audit downstream.
Rekonsiliasi one-to-one expected-versus-observed berada di
[`docs/capability-map/cross-repository/reconciliation.md`](./capability-map/cross-repository/reconciliation.md)
dan mempertahankan implementation, evidence, serta scope sebagai status terpisah.
Reporting matrix dan candidate backlog berada di
[`docs/capability-map/cross-repository/status-matrix.md`](./capability-map/cross-repository/status-matrix.md)
dan
[`docs/capability-map/cross-repository/implementation-gap-backlog.md`](./capability-map/cross-repository/implementation-gap-backlog.md);
backlog tersebut adalah rencana kandidat dan tidak menutup gap implementation.
Coverage validation dan unresolved-question handoff berada di
[`docs/capability-map/cross-repository/coverage-validation-handoff.md`](./capability-map/cross-repository/coverage-validation-handoff.md);
coverage tersebut dibatasi pada enumerated orchestration surfaces dan bukan
klaim kelengkapan seluruh surface produk atau runtime provider.

Ledger discovery per surface berada di
`docs/capability-map/SURFACE-DISCOVERY-LEDGER.md`. Ledger tersebut memetakan
source/API, test/fixture, consumer/UI/command, platform/security,
delivery/operations, dan ownership/documentation ke pasangan matrix/audit;
ledger bukan source of truth implementation dan tidak mengubah status evidence.

Expected catalog renderer SVG berada di
[`docs/capability-map/renderer-svg/expected-capability-catalog.md`](./capability-map/renderer-svg/expected-capability-catalog.md).
Katalog ini adalah daftar requirement renderer yang disusun sebelum audit
implementasi, dengan `renderer-svg/` sebagai owner package dan `spec/id/` sebagai
kontrak normatif scene. Command/menu milik CLI dan Playground tetap dicatat
sebagai consumer workflow; renderer hanya memiliki boundary projection dan
tidak mengambil alih parsing, command routing, atau UI state.
Audit implementation per expected ID berada di
[`docs/capability-map/renderer-svg/implementation-audit.md`](./capability-map/renderer-svg/implementation-audit.md);
audit tersebut menyimpan path/evidence untuk setiap row dan memisahkan status
implementation dari keterbatasan environment seperti Node version, browser,
registry, CI, dan deployed runtime.
Rekonsiliasi one-to-one expected-versus-observed berada di
[`docs/capability-map/renderer-svg/reconciliation.md`](./capability-map/renderer-svg/reconciliation.md);
hasilnya memakai legend capability terpisah dari status evidence dan scope.
Reporting matrix yang dipakai untuk review manusia berada di
[`docs/capability-map/renderer-svg/capability-matrix.md`](./capability-map/renderer-svg/capability-matrix.md);
setiap row memuat capability user-facing, status, evidence, gap/risk, owner,
dependency, dan next action.
Backlog implementation kandidat berada di
[`docs/capability-map/renderer-svg/implementation-gap-backlog.md`](./capability-map/renderer-svg/implementation-gap-backlog.md);
backlog tersebut menurunkan gap `🌗`/`❌` satu-per-satu, memberi priority dan
verification target, serta tidak mengklaim bahwa dokumentasi telah
mengimplementasikan feature.
Coverage validation dan handoff berada di
[`docs/capability-map/renderer-svg/coverage-validation-handoff.md`](./capability-map/renderer-svg/coverage-validation-handoff.md);
artefak tersebut membuktikan coverage pada kategori yang dideklarasikan dan
menyimpan limitation/unresolved questions tanpa klaim completeness global.

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
   menyediakan sibling submodule tersebut, dan CI standalone child yang
   tervalidasi untuk Flutter, Playground, dan MCP
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
