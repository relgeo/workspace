# Geometry Expected-versus-Observed Reconciliation

**Tanggal:** 2026-11-03

**Expected source:** [Expected Geometry Capability Catalog](./expected-capability-catalog.md)

**Observed source:** [Geometry implementation audit evidence](./archive/implementation-audit-legacy.md)

**Status:** join selesai; local bounded geometry evidence direkonsiliasi; host parity tetap qualified

## 1. Tujuan dan aturan join

Dokumen ini melakukan join satu-ke-satu berdasarkan **ID capability**, bukan
berdasarkan kemiripan nama, urutan tabel, atau keberadaan source file saja.
Setiap ID pada expected catalog harus muncul tepat sekali di register ini dan
memiliki trace ke row audit yang sesuai.

Tiga dimensi sengaja dipisahkan:

1. **Status implementasi** — apa yang ditemukan pada source/consumer.
2. **Status evidence** — seberapa jauh behavior dapat dijalankan atau
   direproduksi pada boundary tertentu.
3. **Keputusan scope/owner** — apakah capability aktif, dibatasi, ditunda, atau
   bukan tanggung jawab package geometry.

### Reconciliation result

| Result | Arti |
| --- | --- |
| `✔️ implemented` | Implementasi ditemukan dan evidence memadai pada boundary yang disebut. |
| `🌗 partial` | Implementasi hanya mencakup sebagian behavior, consumer, operation, atau evidence. |
| `⚠️ broken` | Defect/drift terkonfirmasi pada capability atau contract behavior. |
| `⏸️ deferred` | Implementasi/expansion ditahan oleh keputusan scope. |
| `➖ not-applicable` | Capability tidak dimiliki oleh boundary/package yang sedang dinilai; bukan berarti absent dari product. |
| `❌ absent` | Expected pada boundary tersebut, tetapi discovery menemukan tidak ada implementation/consumer behavior. Row wajib tetap dipertahankan. |

Setiap row memakai tepat satu result di atas. `not-verified` bukan result
implementasi; ia adalah kualifikasi evidence/verification yang dicatat di
kolom terpisah. Bila ada sebagian implementation atau snapshot evidence tetapi
contract/evidence belum lengkap, result tetap `🌗 partial` dan kolom evidence
memuat `not-verified` atau `source-only` sesuai temuan.

| Status evidence | Arti |
| --- | --- |
| `local-pass` | Command atau test dijalankan pada checkout ini. |
| `fixture-pass` | Shared fixture atau expected snapshot lulus pada boundary yang diuji. |
| `source-only` | Symbol/path ditemukan tanpa proof behavior yang cukup pada boundary terkait. |
| `not-verified` | Pemeriksaan tertahan oleh environment, SDK, CI, registry, atau platform yang tidak tersedia. |

**Hasil absence check:** 40/40 expected rows memiliki minimal satu observed
implementation atau consumer boundary pada audit. Jadi jumlah row `❌ absent`
saat ini adalah **0**. Ini bukan klaim parity penuh: 30 row `🌗 partial`
memuat behavior, boundary, contract, atau evidence yang belum lengkap; satu di
Host-owned rows tetap memiliki evidence `not-verified`; ini tidak menurunkan
bounded local implementation yang sudah memiliki test/fixture pass.

`⏸️ deferred` dan `➖ not-applicable` muncul pada findings scope/ownership,
bukan sebagai penghapus expected capability. Jika audit berikutnya menemukan
capability yang benar-benar belum ada, ID yang sama harus dipertahankan dan
hasilnya diubah menjadi `❌ absent`, bukan `➖`.

## 2. Coverage dan count

| Check | Result |
| --- | --- |
| Expected catalog rows | 40 |
| Reconciliation rows | 40 |
| Missing expected IDs | 0 |
| Extra observed-only IDs | 0 |
| Duplicate reconciliation IDs | 0 |
| `✔️ implemented` | 17 |
| `🌗 partial` | 23 |
| `❌ absent` | 0 |
| `⚠️ broken`, `⏸️ deferred`, `➖ not-applicable` as row result | 0; recorded as separate audit findings where applicable |

Normalization note: `GEO-QUERY-004`, `GEO-NUM-001/002/003`,
`GEO-DET-002`, dan `GEO-SER-001/002` kini `✔️ implemented` pada bounded local
boundary karena source, tests, fixture snapshots, dan replay/conformance
evidence tersedia. Cross-runtime Node 24, Flutter, registry, dan host replay
tetap dipisahkan sebagai `not-verified` evidence pada rows parity/determinism.

Evidence authority yang dipakai untuk join adalah audit current, dengan source
register di catalog/audit, `docs/MATURATION-MASTER-PLAN.md`,
`docs/REPOSITORY-MAP.md`, `docs/capability-map/README.md`,
`docs/capability-map/INVENTORY-PROTOCOL.md`,
`docs/capability-map/SURFACE-DISCOVERY-LEDGER.md`,
`docs/compatibility-matrix.json`, dan `fixtures/manifest.json`. Matrix lama
tidak menambah atau menghapus expected ID.

## 3. One-to-one reconciliation register

### A. Object model dan primitives

| ID | Reconciliation result | Status implementasi | Status evidence | Scope / owner decision | Audit trace |
| --- | --- | --- | --- | --- | --- |
| `GEO-OBJ-001` | `🌗 partial` | `partial` | `local-pass` | IN; types in geometry, graph/topological evaluation in core | Audit §3A `GEO-OBJ-001`; `geometry/src/types.ts`, `core/src/graph.ts` |
| `GEO-PRIM-001` | `✔️ implemented` | `implemented` | `local-pass` + `fixture-pass` | IN; geometry primitives resolved by core and consumed by renderer | Audit §3A `GEO-PRIM-001`; fixture 10/15 |
| `GEO-PRIM-002` | `✔️ implemented` | `implemented` | `local-pass` + `fixture-pass` | IN; rect/circle/ellipse active on bounded consumer paths | Audit §3A `GEO-PRIM-002`; fixture 10/15/16 |
| `GEO-PRIM-003` | `🌗 partial` | `partial` | `local-pass` | IN; primitive construction exists, sampled downstream operations remain bounded | Audit §3A `GEO-PRIM-003`; `core/src/resolver/primitives/shapes.ts` |
| `GEO-PRIM-004` | `🌗 partial` | `partial` | `local-pass` + `fixture-pass` | IN; core/renderer own high-level construction and rendering | Audit §3A `GEO-PRIM-004`; fixture 10 |
| `GEO-PRIM-005` | `🌗 partial` | `partial` | `local-pass` | IN; composition semantics are core-owned, not geometry-package-owned | Audit §3A `GEO-PRIM-005`; fixtures 5–7 |

### B. Dimensions, units, dan evaluator

| ID | Reconciliation result | Status implementasi | Status evidence | Scope / owner decision | Audit trace |
| --- | --- | --- | --- | --- | --- |
| `GEO-MEASURE-001` | `✔️ implemented` | `implemented` | `local-pass` | IN; type/evaluator contract is core/spec-owned | Audit §3B `GEO-MEASURE-001`; `spec/id/syntax/07-type-system.md` |
| `GEO-MEASURE-002` | `🌗 partial` | `partial` | `local-pass` + `fixture-pass` | IN WITH BOUNDARY; unit candidate remains candidate promotion | Audit §3B `GEO-MEASURE-002`; fixture 16 |
| `GEO-MEASURE-003` | `✔️ implemented` | `implemented` | `local-pass` | IN; expression evaluator is core-owned and tested | Audit §3B `GEO-MEASURE-003`; `core/src/evaluator.ts` |
| `GEO-MEASURE-004` | `🌗 partial` | `partial` | `local-pass` + `fixture-pass` | IN WITH BOUNDARY; evaluator/unit parity is not fully active | Audit §3B `GEO-MEASURE-004`; fixture 16 |
| `GEO-MEASURE-005` | `✔️ implemented` | `implemented` | `fixture-pass` | IN; validator and negative fixture diagnostics are active | Audit §3B `GEO-MEASURE-005`; fixtures 11–13/17–18 |

### C. Transforms, placement, dan anchors

| ID | Reconciliation result | Status implementasi | Status evidence | Scope / owner decision | Audit trace |
| --- | --- | --- | --- | --- | --- |
| `GEO-XFORM-001` | `✔️ implemented` | `implemented` | `local-pass` + `fixture-pass` | IN; transform pipeline is shared low-level/core behavior | Audit §3C `GEO-XFORM-001`; `geometry/src/transforms.ts` |
| `GEO-XFORM-002` | `🌗 partial` | `partial` | `local-pass` | IN; operation objects are core-dispatched; full cross-surface matrix absent | Audit §3C `GEO-XFORM-002`; split/operation tests |
| `GEO-PLACE-001` | `🌗 partial` | `partial` | `local-pass` + `fixture-pass` | IN WITH BOUNDARY; `inside` and conflict variants lack active shared coverage | Audit §3C `GEO-PLACE-001`; fixture 10 |
| `GEO-PLACE-002` | `🌗 partial` | `partial` | `local-pass` | IN; point/path/frame placement exists, broader parity is not promoted | Audit §3C `GEO-PLACE-002`; `frame_placement.test.ts` |
| `GEO-ANCH-001` | `✔️ implemented` | `implemented` | `local-pass` + `fixture-pass` | IN; standard anchors appear in active relational baseline | Audit §3C `GEO-ANCH-001`; fixture 10 |
| `GEO-ANCH-002` | `🌗 partial` | `partial` | `local-pass` | IN; custom anchors exist but cross-consumer snapshots are incomplete | Audit §3C `GEO-ANCH-002`; `group_custom_anchors.test.ts` |

### D. Collections

| ID | Reconciliation result | Status implementasi | Status evidence | Scope / owner decision | Audit trace |
| --- | --- | --- | --- | --- | --- |
| `GEO-COLL-001` | `🌗 partial` | `partial` | `local-pass` | IN; core repeat and examples exist, full mode matrix lacks shared fixture | Audit §3D `GEO-COLL-001`; `core/src/resolver/primitives/repeat.ts` |
| `GEO-COLL-002` | `🌗 partial` | `partial` | `local-pass` | IN WITH BOUNDARY; along modes and frame context exist, edge policies incomplete | Audit §3D `GEO-COLL-002`; repeat-along example |
| `GEO-COLL-003` | `🌗 partial` | `partial` | `local-pass` | IN; grid behavior exists but no complete cross-consumer contract | Audit §3D `GEO-COLL-003`; core repeat/grid tests |
| `GEO-COLL-004` | `🌗 partial` | `partial` | `local-pass` | IN; divide/split exist, public collection semantics remain core-owned | Audit §3D `GEO-COLL-004`; `geometry/src/split.ts` |
| `GEO-COLL-005` | `🌗 partial` | `partial` | `local-pass` | IN; stable ordering appears in tested paths, universal replay absent | Audit §3D `GEO-COLL-005`; collection/intersection ordering tests |

### E. Queries dan intersections

| ID | Reconciliation result | Status implementasi | Status evidence | Scope / owner decision | Audit trace |
| --- | --- | --- | --- | --- | --- |
| `GEO-QUERY-001` | `🌗 partial` | `partial` | `local-pass` + `fixture-pass` | IN; high-level query service is core-owned, geometry provides low-level utilities | Audit §3E `GEO-QUERY-001`; `core/src/evaluator.ts` |
| `GEO-QUERY-002` | `🌗 partial` | `partial` | `local-pass` | IN; queries exist, but broad path/tolerance coverage is incomplete | Audit §3E `GEO-QUERY-002`; evaluator/frame tests |
| `GEO-QUERY-003` | `✔️ implemented` | `implemented` | `local-pass` | IN WITH BOUNDARY; v0.5 overload boundaries are tested | Audit §3E `GEO-QUERY-003`; evaluator tests |
| `GEO-QUERY-004` | `✔️ implemented` | `implemented` | `local-pass` + `fixture-pass` | IN WITH BOUNDARY; supported pair/selector matrix, deterministic ordering, and invalid/empty/multiple errors are frozen; sampled broader pairs remain outside promotion | Audit §3E `GEO-QUERY-004`; geometry contract fixture/intersection tests; conformance 298/298 |
| `GEO-QUERY-005` | `✔️ implemented` | `implemented` | `local-pass` | IN; core frame/length parameter queries directly tested | Audit §3E `GEO-QUERY-005`; `frame_placement.test.ts` |

### F. Constraints

| ID | Reconciliation result | Status implementasi | Status evidence | Scope / owner decision | Audit trace |
| --- | --- | --- | --- | --- | --- |
| `GEO-CONSTRAINT-001` | `🌗 partial` | `partial` | `local-pass` + `fixture-pass` | IN; constraint evaluation and diagnostics are core-owned | Audit §3F `GEO-CONSTRAINT-001`; `core/src/resolver/constraints.ts` |
| `GEO-CONSTRAINT-002` | `✔️ implemented` | `implemented` | `fixture-pass` | IN WITH BOUNDARY; post-resolve violation, no general solver | Audit §3F `GEO-CONSTRAINT-002`; fixture 14 |

### G. Boolean operations

| ID | Reconciliation result | Status implementasi | Status evidence | Scope / owner decision | Audit trace |
| --- | --- | --- | --- | --- | --- |
| `GEO-BOOLEAN-001` | `🌗 partial` | `partial` | `local-pass` + `fixture-pass` | IN WITH BOUNDARY; engine has four ops, active evidence is rectangle intersect/subtract | Audit §3G `GEO-BOOLEAN-001`; `geometry/src/boolean/` and fixture 15 |
| `GEO-BOOLEAN-002` | `🌗 partial` | `partial` | `fixture-pass` | IN WITH BOUNDARY; empty/multipart errors active, broader topology deferred/candidate | Audit §3G `GEO-BOOLEAN-002`; fixtures 15/19/20 |

### H. Numerical robustness dan deterministic behavior

| ID | Reconciliation result | Status implementasi | Status evidence | Scope / owner decision | Audit trace |
| --- | --- | --- | --- | --- | --- |
| `GEO-NUM-001` | `✔️ implemented` | `implemented` | `local-pass` + `fixture-pass` | IN WITH BOUNDARY; low-level tolerance policy and boundary tests are frozen; no universal DSL epsilon claim | Audit §3H `GEO-NUM-001`; intersection/path/split tests; geometry lint/test/build |
| `GEO-NUM-002` | `✔️ implemented` | `implemented` | `local-pass` + `fixture-pass` | IN WITH BOUNDARY; supported rings normalize winding/holes; broader boolean topology remains deferred | Audit §3H `GEO-NUM-002`; `normalizeClosedShape.ts`; boolean tests; fixture 15 |
| `GEO-NUM-003` | `✔️ implemented` | `implemented` | `local-pass` + `fixture-pass` | IN WITH BOUNDARY; selected low-level invalid branches expose stable package codes; core maps public paths | Audit §3H `GEO-NUM-003`; error tests; fixtures 19/20 |
| `GEO-DET-001` | `🌗 partial` | `partial` | `local-pass` + `fixture-pass` | IN; deterministic behavior observed locally, Node 24/Flutter/cross-platform unverified | Audit §3H `GEO-DET-001`; conformance snapshots |
| `GEO-DET-002` | `✔️ implemented` | `implemented` | `local-pass` + `fixture-pass` | IN WITH BOUNDARY; stable local identity/order/path replay comparator is active; cross-runtime replay remains separate | Audit §3H `GEO-DET-002`; `core/src/projection.ts`; core/CLI tests; conformance 298/298 |

### I. Serialization dan semantic parity

| ID | Reconciliation result | Status implementasi | Status evidence | Scope / owner decision | Audit trace |
| --- | --- | --- | --- | --- | --- |
| `GEO-SER-001` | `✔️ implemented` | `implemented` | `local-pass` + `fixture-pass` | IN WITH BOUNDARY; versioned canonical projection is consumed by core/CLI; Flutter parity remains unverified | Audit §3I `GEO-SER-001`; `core/src/projection.ts`; `cli/src/index.ts`; CLI tests |
| `GEO-SER-002` | `✔️ implemented` | `implemented` | `local-pass` + `fixture-pass` | IN WITH BOUNDARY; numeric/order/undefined rules and replay comparator are executable locally; cross-version/host proof remains unverified | Audit §3I `GEO-SER-002`; manifest; projection/CLI tests; conformance 298/298 |
| `GEO-PARITY-001` | `🌗 partial` | `partial` | `fixture-pass` + `not-verified` | IN WITH BOUNDARY; fixture 15 bounded active, fixture 16 candidate, current Flutter blocked | Audit §3I `GEO-PARITY-001`; Flutter shared conformance |
| `GEO-PARITY-002` | `🌗 partial` | `partial` | `source-only` + `not-verified` | IN WITH BOUNDARY; semantic SVG only, not raw bytes/style/viewBox | Audit §3I `GEO-PARITY-002`; Flutter SVG projection |

## 4. Scope findings kept separate from capability results

These findings must not be joined into an expected capability row as if they
were implementation absence:

| Finding | Scope/evidence status | Reconciliation handling |
| --- | --- | --- |
| Stale `v0.3` provenance/error wording | `✔️ resolved locally` | The package wording and unsupported-pair message now use the DSL `0.5` boundary; regression coverage remains in the geometry test suite. |
| Broader boolean union/xor/non-rectangle topology | `⏸️ deferred` | Keep `GEO-BOOLEAN-001/002` as `🌗 partial`; do not turn deferred expansion into `➖` or remove it. |
| Geometry-owned UI routes, shortcuts, platform file service | `➖ not-applicable` to geometry package | Keep UI/product behavior in consumer audit; do not mark product capability absent. |
| Current Flutter probe and Node 24/canonical registry | `not-verified` evidence | Keep parity/determinism evidence qualified; do not downgrade implementation to absent solely from unavailable environment. |

### 4.1 Evidence refresh — 2026-11-03

| Check | Result | Boundary / limitation |
| --- | --- | --- |
| `geometry`: `pnpm lint`, `pnpm test`, `pnpm build` | local-pass; 5 files/88 tests | Detected Node `v22.23.2`; root Node >=24 remains not verified |
| `core`: `pnpm test` | local-pass; 48 files/452 tests | Same local runtime boundary |
| `cli`: `pnpm test` | local-pass; 1 file/24 tests | Repeated-process canonical JSON output covered |
| `node scripts/run-conformance-fixtures.mjs` | fixture-pass; 298/298 across 23 fixtures | Shared Node workspace runner, not Flutter/host parity |
| Flutter probe | not-verified | SDK command blocked by permission on `.../flutter/bin/cache/engine.stamp` |
| Registry/public release install | not-verified | No fresh registry artifact check was run in this evidence refresh |

## 5. Downstream handoff

Published downstream views:

1. [Geometry status matrix](./status-matrix.md) has one row per `GEO-*`
   ID and keeps implementation, evidence, scope, owner, dependency, risk, and
   next action visible;
2. [Geometry implementation-gap backlog](./implementation-gap-backlog.md)
   derives every current `🌗` row into a candidate task and keeps resolved
   corrective work, deferred `⏸️`, ownership `➖`, and `not-verified` evidence
   follow-ups separate;
3. any future `❌ absent` row must remain explicit in both views;
4. `docs/compatibility-matrix.json` remains compatibility/release policy, not
   a replacement for this ID-level join.

Primary evidence:

- [`geometry/expected-capability-catalog.md`](./expected-capability-catalog.md)
- [`geometry/archive/implementation-audit-legacy.md`](./archive/implementation-audit-legacy.md)
- [`docs/MATURATION-MASTER-PLAN.md`](../../MATURATION-MASTER-PLAN.md)
- [`docs/REPOSITORY-MAP.md`](../../REPOSITORY-MAP.md)
- [`docs/capability-map/README.md`](../README.md)
- [`docs/capability-map/INVENTORY-PROTOCOL.md`](../INVENTORY-PROTOCOL.md)
- [`docs/capability-map/SURFACE-DISCOVERY-LEDGER.md`](../SURFACE-DISCOVERY-LEDGER.md)
- [`docs/compatibility-matrix.json`](../../compatibility-matrix.json)
- [`fixtures/manifest.json`](../../../fixtures/manifest.json)
