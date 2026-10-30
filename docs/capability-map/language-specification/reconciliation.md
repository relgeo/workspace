# Language Specification Expected-versus-Observed Reconciliation

**Tanggal:** 2026-10-30
**Join source expected:** [`language-specification/expected-capability-catalog.md`](./expected-capability-catalog.md)
**Join source observed:** [`language-specification/implementation-audit.md`](./implementation-audit.md)
**Required context:** [`MATURATION-MASTER-PLAN.md`](../../MATURATION-MASTER-PLAN.md), [`REPOSITORY-MAP.md`](../../REPOSITORY-MAP.md)

Published views: [status matrix](./status-matrix.md) dan
[implementation-gap backlog](./implementation-gap-backlog.md).

## 1. Aturan rekonsiliasi

Rekonsiliasi ini adalah join satu-ke-satu pada ID capability. Setiap ID dari
expected catalog harus memiliki tepat satu row di tabel §3. Tidak ada capability
yang dihapus karena belum ditemukan pada implementation.

Kolom dibedakan sebagai berikut:

- `Result` adalah hasil expected-versus-observed;
- `Implementation` menjelaskan apakah source/runtime ada;
- `Evidence` menjelaskan seberapa kuat pemeriksaan saat ini;
- `Scope decision` mempertahankan keputusan bahasa/produk, bukan menyimpulkan
  dari status implementation.

| Result | Arti |
| --- | --- |
| `✔️` | Expected capability terwujud pada boundary yang diaudit dan evidence langsung tersedia. |
| `🌗` | Sebagian terwujud atau coverage/consumer parity belum lengkap. |
| `⚠️` | Mismatch atau defect terkonfirmasi pada boundary yang diharapkan. |
| `❌` | Capability expected tidak ditemukan pada implementation boundary yang diperiksa. Ini bukan status `not verified`. |
| `⏸️` | Sengaja ditahan/deferred oleh keputusan scope atau promotion policy. |
| `➖` | Not applicable terhadap scope; tidak boleh digunakan untuk capability yang sekadar belum ditemukan. |

`Evidence` memakai `direct-local`, `source+tests`, `historical/local`, atau
`not verified` sesuai audit. `not verified` tidak mengubah `Result` menjadi
`❌` atau `➖` tanpa pemeriksaan boundary yang cukup.

| Dimensi | Kolom rekonsiliasi | Nilai yang diperbolehkan | Makna |
| --- | --- | --- | --- |
| Expected-versus-observed result | `Result` | tepat satu dari `✔️`, `🌗`, `❌`, `➖`, `⏸️`, `⚠️` | Ringkasan status capability pada boundary yang diaudit |
| Implementation finding | `Implementation` | `implemented`, `partial`, `absent`, `broken`, `deferred`, `not applicable`, atau `unverified` | Apakah realization source/runtime ditemukan; terpisah dari kekuatan bukti |
| Verification/evidence | `Evidence` | `direct-local`, `source+tests`, `historical/local`, atau `not verified` | Seberapa langsung dan current pemeriksaan yang mendukung finding |
| Scope | `Scope decision` | keputusan `IN`, `OUT`, `boundary only`, atau `deferred` dari catalog/decision record | Apakah capability memang diharapkan pada boundary ini |

## 2. Reconciliation coverage

| Check | Result |
| --- | --- |
| Expected IDs discovered | 53 |
| Reconciled rows | 53 |
| Expected IDs with exactly one reconciliation row | 53/53 |
| Duplicate expected IDs in reconciliation | 0 |
| Observed audit trace available | 53/53 |
| Current `❌` rows | 0 — semua 53 ID memiliki sebagian source/runtime realization; absence structural dicatat di §4 |
| Current `⚠️` rows | 2 — `DIAG-002`, `SER-002` |
| Current `⏸️` rows | 0 as whole capability; deferred sub-boundaries remain in `EVAL-002`, `COLL-003`, and consumer evidence |

Tidak adanya `❌` pada join ini bukan klaim bahwa seluruh capability selesai.
Expected catalog memang memiliki realization parsial untuk setiap ID. Temuan
`absent` yang terpisah adalah **single generated machine-readable normative
catalog**, yang belum menjadi ID capability dalam katalog bahasa; ia tidak boleh
disamarkan sebagai row capability atau dipakai untuk menghilangkan expected ID.

## 3. One-to-one expected-versus-observed join

### A. Authoring language dan document structure

| ID | Result | Implementation | Evidence | Scope decision | Audit trace / gap |
| --- | --- | --- | --- | --- | --- |
| `LANG-001` | `✔️` | `implemented` | `direct-local` | IN: text-first YAML | `LANG-001` — parser and text contract present; vocabulary not generated |
| `LANG-002` | `🌗` | `partial` | `direct-local` | IN: deterministic relation-first; no solver/control flow | `LANG-002` — runtime deterministic; full negative/non-solver map incomplete |
| `DOC-001` | `✔️` | `implemented` | `direct-local` | IN: root sections | `DOC-001` — parser/validator and fixture 10 |
| `DOC-002` | `✔️` | `implemented` | `direct-local` | IN: 2D scene/unit configuration | `DOC-002` — scene, units, viewport tests |
| `DOC-003` | `🌗` | `partial` | `source+tests` | IN: readable/editorial vocabulary | `DOC-003` — guidance exists; normative/index labels inconsistent |

### B. Declarations, types, expressions, dan evaluation

| ID | Result | Implementation | Evidence | Scope decision | Audit trace / gap |
| --- | --- | --- | --- | --- | --- |
| `DECL-001` | `🌗` | `partial` | `direct-local` | IN: typed parameters; candidate promotion separate | `DECL-001` — parameters exist; fixture 16 remains candidate |
| `DECL-002` | `✔️` | `implemented` | `direct-local` | IN: immutable constants | `DECL-002` — constants resolver/tests; shared immutability negatives limited |
| `DECL-003` | `✔️` | `implemented` | `direct-local` | IN: read-only derived/global/local scope | `DECL-003` — evaluator and derived access tests |
| `DECL-004` | `🌗` | `partial` | `source+tests` | IN: parameter profiles only | `DECL-004` — profile runtime/CLI exists; active fixture coverage incomplete |
| `TYPE-001` | `🌗` | `partial` | `direct-local` | IN: scalar typed values | `TYPE-001` — types/units exist; full coercion matrix not active |
| `TYPE-002` | `🌗` | `partial` | `direct-local` | IN: structured 2D types | `TYPE-002` — runtime types exist; path/frame/bbox/collection parity incomplete |
| `EXPR-001` | `✔️` | `implemented` | `direct-local` | IN: arithmetic/precedence subset | `EXPR-001` — evaluator and tests |
| `EXPR-002` | `✔️` | `implemented` | `direct-local` | IN: comparison/logical/ternary; statements OUT | `EXPR-002` — evaluator/parser validation |
| `EXPR-003` | `✔️` | `implemented` | `direct-local` | IN: symbol/property/index/anchor refs | `EXPR-003` — graph/eval context/reference tests |
| `EVAL-001` | `✔️` | `implemented` | `direct-local` | IN: dependency graph/topological evaluation | `EVAL-001` — graph/resolver/conformance; cycle fixtures not exhaustive |
| `EVAL-002` | `🌗` | `partial` | `direct-local` | IN expected; unit/evaluator promotion held | `EVAL-002` — units/CLI exist; fixture 16 candidate |

### C. Geometry, composition, placement, dan anchors

| ID | Result | Implementation | Evidence | Scope decision | Audit trace / gap |
| --- | --- | --- | --- | --- | --- |
| `OBJ-001` | `✔️` | `implemented` | `direct-local` | IN: stable identity/object model | `OBJ-001` — parser/resolver/types and snapshots |
| `GEO-001` | `🌗` | `partial` | `direct-local` | IN: 2D point modes | `GEO-001` — point/intersection runtime; full field matrix incomplete |
| `GEO-002` | `🌗` | `partial` | `source+tests` | IN: line construction modes | `GEO-002` — line modes exist; full error/consumer matrix incomplete |
| `GEO-003` | `🌗` | `partial` | `direct-local` | IN: rect/circle/ellipse | `GEO-003` — primitives exist; holes/placement combinations incomplete |
| `GEO-004` | `🌗` | `partial` | `source+tests` | IN: curves/path/polygon/text | `GEO-004` — runtime exists; active snapshots cover subset |
| `GEO-005` | `🌗` | `partial` | `source+tests` | IN: closed shapes/topology | `GEO-005` — holes/joins/corners exist; degenerate/topology parity incomplete |
| `COMP-001` | `🌗` | `partial` | `source+tests` | IN: group hierarchy/transforms | `COMP-001` — group tests/legacy fixtures; active v0.5 coverage limited |
| `COMP-002` | `🌗` | `partial` | `source+tests` | IN: clone/reuse | `COMP-002` — clone exists; active identity/metadata coverage limited |
| `COMP-003` | `🌗` | `partial` | `source+tests` | IN: component params/local derived/exports | `COMP-003` — component tests; nested/export coverage incomplete |
| `PLACE-001` | `🌗` | `partial` | `source+tests` | IN: generic directional placement | `PLACE-001` — placement utility exists; multi-anchor/inside coverage incomplete |
| `PLACE-002` | `✔️` | `implemented` | `direct-local` | IN: on.point | `PLACE-002` — point/anchor placement tests |
| `PLACE-003` | `🌗` | `partial` | `source+tests` | IN: on.path | `PLACE-003` — path placement exists; domain/error coverage incomplete |
| `PLACE-004` | `✔️` | `implemented` | `source+tests` | IN: on.frame | `PLACE-004` — frame placement/tangent tests; consumer parity limited |
| `ANCH-001` | `🌗` | `partial` | `source+tests` | IN: typed named/world anchors | `ANCH-001` — anchor resolver/tests; spec vocabulary broader than fixtures |

### D. Collections, queries, dan constraints

| ID | Result | Implementation | Evidence | Scope decision | Audit trace / gap |
| --- | --- | --- | --- | --- | --- |
| `COLL-001` | `🌗` | `partial` | `source+tests` | IN: repeat modes/identity | `COLL-001` — repeat runtime/tests; all modes not active |
| `COLL-002` | `🌗` | `partial` | `source+tests` | IN: divide/split collections | `COLL-002` — resolvers/tests; result/pick contract incomplete |
| `COLL-003` | `🌗` | `partial` | `direct-local` | IN expected; active boolean boundary limited by decision | `COLL-003` — fixture 15 active boundary; union/xor/broader topology held |
| `COLL-004` | `🌗` | `partial` | `direct-local` | IN: collection access/order/functions | `COLL-004` — count/first/last/index; raw edge errors not uniform |
| `QUERY-001` | `✔️` | `implemented` | `source+tests` | IN: scalar/bbox geometry queries | `QUERY-001` — evaluator/query tests; no generated function report |
| `QUERY-002` | `🌗` | `partial` | `source+tests` | IN: path/transform queries | `QUERY-002` — broad runtime; domain/precision/consumer parity incomplete |
| `CON-001` | `🌗` | `partial` | `source+tests` | IN: post-resolve directional constraints | `CON-001` — constraint implementation exists; active diagnostics center on align |
| `CON-002` | `🌗` | `partial` | `direct-local` | IN: violation payload without geometry mutation | `CON-002` — fixture 14 verifies align; all constraint types not shared |

### E. Presentation dan metadata

| ID | Result | Implementation | Evidence | Scope decision | Audit trace / gap |
| --- | --- | --- | --- | --- | --- |
| `PRES-001` | `🌗` | `partial` | `historical/local` | IN: dimension presentation | `PRES-001` — dimension runtime/legacy tests; active v0.5 coverage thin |
| `PRES-002` | `🌗` | `partial` | `historical/local` | IN: annotation presentation | `PRES-002` — annotation runtime/tests; active/escaping coverage incomplete |
| `PRES-003` | `🌗` | `partial` | `source+tests` | IN: drawing roles/filter/defaults | `PRES-003` — role source/rendering exists; host parity incomplete |
| `PRES-004` | `🌗` | `partial` | `source+tests` | IN: views/sheets composition | `PRES-004` — resolver/CLI/legacy fixture; current v0.5/host evidence incomplete |
| `META-001` | `🌗` | `partial` | `direct-local` | IN: non-geometric metadata | `META-001` — metadata runtime exists; full field/security consumer coverage incomplete |
| `META-002` | `🌗` | `partial` | `direct-local` | IN: presets/inherit; legacy alias bounded | `META-002` — inherit tests/schema; provenance and all merge cases incomplete |

### F. Diagnostics, error model, serialization, compatibility

| ID | Result | Implementation | Evidence | Scope decision | Audit trace / gap |
| --- | --- | --- | --- | --- | --- |
| `DIAG-001` | `🌗` | `partial` | `direct-local` | IN: structured diagnostics by phase | `DIAG-001` — core/fixtures cover main cases; error-code coverage incomplete |
| `DIAG-002` | `⚠️` | `broken` | `direct-local` | IN: stable code/path/payload | `DIAG-002` — raw `Error` paths conflict with structured model |
| `ERR-001` | `🌗` | `partial` | `direct-local` | IN: phase ordering/fail-safe modes | `ERR-001` — tolerant/compile modes and runtime errors; cross-consumer coverage incomplete |
| `SER-001` | `🌗` | `partial` | `direct-local` | IN expected; canonical JSON contract unresolved | `SER-001` — JSON output/snapshots exist; no normative generated shape |
| `SER-002` | `⚠️` | `broken` | `direct-local` | IN layered SVG contract; raw bytes OUT | `SER-002` — renderer works but dimension/annotation escaping defect remains |
| `VER-001` | `✔️` | `implemented` | `direct-local` | IN: explicit/omitted version | `VER-001` — parser/schema/negative fixtures |
| `VER-002` | `✔️` | `implemented` | `direct-local` | IN: active/legacy/regression/future policy | `VER-002` — manifest/parser/compatibility checker |
| `VER-003` | `🌗` | `partial` | `source+tests` | IN limited: documented aliases/fallbacks only | `VER-003` — styles/metaPresets alias exists; provenance not centralized |
| `VER-004` | `✔️` | `implemented` | `direct-local` | IN: fixture promotion/status governance | `VER-004` — manifest policy and conformance enforcement |

## 4. Absence and not-applicable guardrails

The join currently has no `❌` row because the audit found at least a partial
source/runtime realization for every expected ID. This must not be read as
"everything exists”: 35 rows are `🌗`, two are `⚠️`, and several evidence tiers
are not current external verification.

If a future audit proves that an expected ID has no implementation at all, its
row must remain in this table and change to:

```text
Result: ❌
Implementation: absent
Evidence: direct boundary inspection proving absence
Scope decision: unchanged from expected catalog
```

`➖` is reserved for explicit non-applicability only. It is not a placeholder
for missing evidence. Current out-of-scope items—3D, animation/timeline,
statement-level scripting, general constraint solving, mobile delivery, and
publishable Flutter packaging—remain in the audit's scope register rather than
being silently joined as language capabilities.

## 5. Evidence and scope boundaries

- Local results: conformance `260/260`, core `427/427`, language-service `66/66`,
  CLI `9/9`, Playground `93/93`, website check `0 errors/0 warnings/0 hints`,
  Playground build, website build `138 pages`, and Flutter `302` tests. Node
  commands emitted a Node `22.23.2` versus required `>=24` warning.
- Local results are not promoted to canonical CI, registry, public Pages,
  browser E2E, native/device Flutter, or MCP transport/runtime evidence. MCP
  test execution was environment-blocked by Dart/package/host-write failures.
- `docs/MATURATION-MASTER-PLAN.md` establishes source-of-truth and compatibility
  policy; `docs/REPOSITORY-MAP.md` establishes repository ownership and consumer
  boundaries.
- Existing surface audits are trace evidence only. The expected list came from
  the expected catalog before implementation reconciliation.

## 6. Evidence register

The reconciliation is grounded in the required source-of-truth and discovery
evidence; these sources define expectation, ownership, and audit boundaries but
do not override the per-ID findings above:

- [`spec/id/`](../../../spec/id) — normative language contract;
- [`docs/MATURATION-MASTER-PLAN.md`](../../MATURATION-MASTER-PLAN.md) — roadmap,
  compatibility line, and product decisions;
- [`docs/REPOSITORY-MAP.md`](../../REPOSITORY-MAP.md) — ownership and consumer
  boundaries;
- [`docs/capability-map/INVENTORY-PROTOCOL.md`](../INVENTORY-PROTOCOL.md) and
  [`SURFACE-DISCOVERY-LEDGER.md`](../SURFACE-DISCOVERY-LEDGER.md) — discovery,
  evidence, and status rules;
- [`language-specification/expected-capability-catalog.md`](./expected-capability-catalog.md)
  — expected ID set; and
- [`language-specification/implementation-audit.md`](./implementation-audit.md)
  — observed source/test/consumer/runtime findings.
