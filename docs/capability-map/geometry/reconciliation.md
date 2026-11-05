# Geometry Expected-versus-Observed Reconciliation

**Tanggal:** 2026-11-05

**Expected source:** [Expected Geometry Capability Catalog](./expected-capability-catalog.md)

**Observed source:** [Geometry implementation audit evidence](./implementation-audit.md)

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
kolom terpisah. Result `⏸️ deferred` hanya dipakai untuk keputusan scope atau
evidence gate yang ditulis eksplisit; ia tidak mengubah missing implementation
menjadi green.

| Status evidence | Arti |
| --- | --- |
| `local-pass` | Command atau test dijalankan pada checkout ini. |
| `fixture-pass` | Shared fixture atau expected snapshot lulus pada boundary yang diuji. |
| `source-only` | Symbol/path ditemukan tanpa proof behavior yang cukup pada boundary terkait. |
| `not-verified` | Pemeriksaan tertahan oleh environment, SDK, CI, registry, atau platform yang tidak tersedia. |

**Hasil absence check:** 40/40 expected rows memiliki minimal satu observed
implementation atau consumer boundary pada audit. Jadi jumlah row `❌ absent`
saat ini adalah **0**. Snapshot sebelum closure adalah 17 `✔️` dan 23 `🌗`;
setelah source/test/fixture closure menjadi 35 `✔️` dan 5 `⏸️`. Lima hold
tersebut adalah dua keputusan scope boolean dan tiga evidence/host gates yang
tetap `not-verified` pada boundary yang tidak tersedia; bukan implementasi
yang dipromosikan lewat dokumentasi.

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
| `✔️ implemented` | 35 |
| `🌗 partial` | 0 |
| `❌ absent` | 0 |
| `⏸️ deferred/held` | 5; two scope-held and three evidence-held |
| `⚠️ broken`, `➖ not-applicable` as row result | 0 |

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

## 2.1 Triage handoff — task `triage-remaining-geometry-gaps--9052928134`

Reconciliation awal mengesahkan 23 row `🌗 partial`; implementation dan
verification pass berikutnya menutup 18 row lokal dan mengubah lima row
non-green menjadi hold eksplisit. Detail owner, source of truth, acceptance
test, dan evidence ada di [implementation-gap
backlog](./implementation-gap-backlog.md#complete-40-id-closure-route-register).

| Jalur tindak lanjut | Jumlah | IDs |
| --- | ---: | --- |
| Implemented from initial partial set | 18 | `GEO-OBJ-001`, `GEO-PRIM-003/004/005`, `GEO-MEASURE-002/004`, `GEO-XFORM-002`, `GEO-PLACE-001/002`, `GEO-ANCH-002`, `GEO-COLL-001..005`, `GEO-QUERY-001/002`, `GEO-CONSTRAINT-001` |
| External-evidence-only | 3 | `GEO-DET-001`, `GEO-PARITY-001/002` |
| Scope-deferred | 2 | `GEO-BOOLEAN-001/002` broader topology/promotion |

`GEO-MEASURE-002` ditutup pada bounded TypeScript/core unit contract;
kebutuhan Flutter parity tetap menjadi evidence follow-up terpisah. Dua
boolean rows tetap `⏸️ scope-held`, sedangkan tiga cross-surface rows tetap
`⏸️ evidence-held` karena host/runtime evidence belum tersedia. Total akhir
adalah 35 bounded implementations dan 5 explicit holds.

## 2.2 Contract lock handoff — task `lock-geometry-contracts-and-acceptance--9052928134`

The [locked contract and acceptance matrix](./implementation-gap-backlog.md#locked-contract-and-acceptance-matrix--task-lock-geometry-contracts-and-acceptance--9052928134)
is the acceptance source for the next implementation task. It applies these
authoritative boundaries:

| Authority | Applied rule |
| --- | --- |
| [`docs/compatibility-matrix.json`](../../compatibility-matrix.json) | Active compatibility line is `0.5`, public package family is `0.5.x`, normative path is `spec/id`, and breaking changes require a decision record. |
| [`docs/capability-map/INVENTORY-PROTOCOL.md`](../INVENTORY-PROTOCOL.md) | Each row keeps contract, implementation, tests/fixtures, consumer, delivery, ownership, evidence tier, parity, and scope distinct; unavailable host evidence remains `not verified`. |
| [`spec/id/`](../../../spec/id) and the geometry rows below | Normative semantics remain the source of truth; core/geometry/renderer/Flutter own only their stated implementation or evidence boundary. |

No public contract change is authorized by the lock task. The acceptance
matrix requires a success case, failure/edge case, and expected evidence for
all 22 triaged rows, while external-evidence-only and scope-deferred rows stay
qualified rather than becoming implementation blockers.

## 2.3 Complete closure classification

The reconciliation join is 40 rows, and this closure classification is also a
40-row one-to-one register. It makes the next proof explicit without changing
the implementation result, evidence qualifier, or scope decision above.

| ID | Closure route | Success / failure boundary to verify | Closure owner and evidence |
| --- | --- | --- | --- |
| `GEO-OBJ-001` | bounded implementation | Identity resolves once; duplicate, unknown reference, and cycle paths are stable | core + geometry; graph fixtures and projection replay |
| `GEO-PRIM-001` | bounded implementation | Point/line construction and invalid input remain typed and deterministic | geometry + core; fixtures 10/15 |
| `GEO-PRIM-002` | bounded implementation | Rect/circle/ellipse and ClosedShape/holes remain normalized | geometry + core; fixtures 10/15 |
| `GEO-PRIM-003` | bounded implementation | Curve endpoints/length/intersections pass; degenerate control data rejects | geometry + core; curve tests and shared fixture |
| `GEO-PRIM-004` | bounded implementation | Open/closed chains, holes, text labels project semantically; malformed paths reject | core + renderer-svg; semantic fixture |
| `GEO-PRIM-005` | bounded implementation | Component/clone scope and exports remain isolated; collisions reject | core; scope fixtures and replay |
| `GEO-MEASURE-001` | bounded implementation | Typed dimensions accept valid values and reject incompatible uses | spec + core; type negative tests |
| `GEO-MEASURE-002` | bounded implementation | Supported unit literals normalize equivalently; malformed/wrong-context values reject | spec + core; fixture 16 and evaluator tests |
| `GEO-MEASURE-003` | bounded implementation | Expressions remain deterministic, side-effect free, and type-safe | core; evaluator tests |
| `GEO-MEASURE-004` | bounded implementation | Defaults/derived values follow dependency order; cycles/scope leaks reject | core + spec; parameter fixtures |
| `GEO-MEASURE-005` | bounded implementation | Validation preserves stable code and document path by failure class | core + spec; fixtures 11–13/17–18 |
| `GEO-XFORM-001` | bounded implementation | Ordered transforms preserve result identity and origin rules | geometry + core; transform tests |
| `GEO-XFORM-002` | bounded implementation | Chained operations and split preserve identity/order; invalid finite values reject | core + geometry; operation/split fixture |
| `GEO-PLACE-001` | bounded implementation | Anchor/offset/inside/margin placement succeeds or emits explicit conflict errors | core; placement matrix |
| `GEO-PLACE-002` | bounded implementation | point/path/frame placement shares frame semantics; domain/degenerate cases reject | core + geometry; frame fixture |
| `GEO-ANCH-001` | bounded implementation | Standard anchors retain stable type and coordinate semantics | spec + core; fixture 10 |
| `GEO-ANCH-002` | bounded implementation | Custom/result anchors remain addressable and serializable | core + geometry; anchor/renderer fixture |
| `GEO-COLL-001` | bounded implementation | All repeat modes produce ordered members and stable context | core; five-mode fixture |
| `GEO-COLL-002` | bounded implementation | Along policies/offsets/endpoints are deterministic; conflicting policies reject | core + spec; open/closed edge fixtures |
| `GEO-COLL-003` | bounded implementation | Pitch/gap and over-constraint policy is explicit and stable | core; grid fixtures |
| `GEO-COLL-004` | bounded implementation | Divide/split selectors, count, order, and identity are stable | core + geometry; collection snapshots |
| `GEO-COLL-005` | bounded implementation | Repeated evaluation preserves collection order and IDs | core; replay harness |
| `GEO-QUERY-001` | bounded implementation | Measurement queries return finite typed values; unsupported targets reject | core + spec; query matrix |
| `GEO-QUERY-002` | bounded implementation | Path/vector queries honor `[0,1]` and degenerate rules | core + geometry; curve query fixture |
| `GEO-QUERY-003` | bounded implementation | v0.5 spatial-query overloads retain typed target boundaries | core + spec; evaluator tests |
| `GEO-QUERY-004` | bounded implementation | Supported pairs/selectors/order/errors are deterministic | geometry + core; contract fixture and fixture 15 |
| `GEO-QUERY-005` | bounded implementation | `frameAt`/`tAtLength` remain stable read-only traversal surfaces | core + geometry; frame tests |
| `GEO-CONSTRAINT-001` | bounded implementation | Four relation kinds validate or report stable violations, including degeneracy | core + spec; relation matrix |
| `GEO-CONSTRAINT-002` | bounded implementation | Post-resolve violation keeps scene and stable code/path; no solver | core + spec; fixture 14 |
| `GEO-BOOLEAN-001` | scope-held | Fixture 15 intersect/subtract is active; union/xor/topology needs promotion decision | geometry + core; fixture 15 and decision record |
| `GEO-BOOLEAN-002` | scope-held | Empty/multipart/single/multi errors remain explicit; no silent coercion | core + geometry; fixtures 15/19/20 |
| `GEO-NUM-001` | bounded implementation | Operation-specific tolerance boundaries remain stable; no universal epsilon claim | geometry + spec; tolerance tests |
| `GEO-NUM-002` | bounded implementation | Supported winding/holes normalization is canonical and stable | geometry + core; normalization tests and fixture 15 |
| `GEO-NUM-003` | bounded implementation | Selected invalid inputs expose stable codes and caller paths | geometry + core; negative tests |
| `GEO-DET-001` | evidence-held | Repeated process and named Node 24/Flutter/host runs match scenes/diagnostics | core + parity; replay evidence |
| `GEO-DET-002` | bounded implementation | Local canonical replay preserves IDs/order/anchors/paths | core + spec; projection/CLI replay |
| `GEO-SER-001` | bounded implementation | Versioned semantic projection preserves identity, geometry, collections, diagnostics | core + CLI; projection and snapshots |
| `GEO-SER-002` | bounded implementation | Numeric/order/undefined serialization rules are canonical | spec + core; manifest and CLI/projection tests |
| `GEO-PARITY-001` | evidence-held | Reviewed fixtures match TypeScript/Flutter semantically | core + Flutter; shared comparator and host |
| `GEO-PARITY-002` | evidence-held | SVG semantic tree/geometry/anchors match; presentation bytes are excluded | renderer-svg + Flutter; semantic comparator |

This register freezes closure boundaries without claiming that an unavailable
host or deferred boolean promotion has passed. A future `❌` or `⚠️` result must
reuse the same ID and row, never narrow the expected set.

## 3. One-to-one reconciliation register

### A. Object model dan primitives

| ID | Reconciliation result | Status implementasi | Status evidence | Scope / owner decision | Audit trace |
| --- | --- | --- | --- | --- | --- |
| `GEO-OBJ-001` | `✔️ implemented` | `implemented` | `local-pass` + `fixture-pass` | IN WITH BOUNDARY; identity/duplicate/cycle/order behavior is closed on TypeScript/core surfaces; cross-runtime replay is separate | Audit §3A; graph/parser tests; core 507 tests |
| `GEO-PRIM-001` | `✔️ implemented` | `implemented` | `local-pass` + `fixture-pass` | IN; geometry primitives resolved by core and consumed by renderer | Audit §3A `GEO-PRIM-001`; fixture 10/15 |
| `GEO-PRIM-002` | `✔️ implemented` | `implemented` | `local-pass` + `fixture-pass` | IN; rect/circle/ellipse active on bounded consumer paths | Audit §3A `GEO-PRIM-002`; fixture 10/15/16 |
| `GEO-PRIM-003` | `✔️ implemented` | `implemented` | `local-pass` + `fixture-pass` | IN WITH BOUNDARY; curve construction/length/endpoints/supported intersections and degeneracy are closed locally | Audit §3A; geometry/core curve tests |
| `GEO-PRIM-004` | `✔️ implemented` | `implemented` | `local-pass` + `fixture-pass` | IN WITH BOUNDARY; path/holes/text semantic projection is closed on core/renderer fixtures; cross-surface expansion is separate | Audit §3A; renderer semantic tests; fixtures 10/15/24 |
| `GEO-PRIM-005` | `✔️ implemented` | `implemented` | `local-pass` + `fixture-pass` | IN WITH BOUNDARY; group/clone/component scope and identity are closed on core/fixture surfaces | Audit §3A; component/clone/reference tests |

### B. Dimensions, units, dan evaluator

| ID | Reconciliation result | Status implementasi | Status evidence | Scope / owner decision | Audit trace |
| --- | --- | --- | --- | --- | --- |
| `GEO-MEASURE-001` | `✔️ implemented` | `implemented` | `local-pass` | IN; type/evaluator contract is core/spec-owned | Audit §3B `GEO-MEASURE-001`; `spec/id/syntax/07-type-system.md` |
| `GEO-MEASURE-002` | `✔️ implemented` | `implemented` | `local-pass` + `fixture-pass` | IN WITH BOUNDARY; TypeScript/core unit literals, conversion, target units, and invalid literals are closed; Flutter parity is separate | Audit §3B; fixture 16; core 507 tests |
| `GEO-MEASURE-003` | `✔️ implemented` | `implemented` | `local-pass` | IN; expression evaluator is core-owned and tested | Audit §3B `GEO-MEASURE-003`; `core/src/evaluator.ts` |
| `GEO-MEASURE-004` | `✔️ implemented` | `implemented` | `local-pass` + `fixture-pass` | IN WITH BOUNDARY; defaults, derived ordering/cycles, and component-local scope are closed on core fixtures | Audit §3B; derived/component tests; fixture 16 |
| `GEO-MEASURE-005` | `✔️ implemented` | `implemented` | `fixture-pass` | IN; validator and negative fixture diagnostics are active | Audit §3B `GEO-MEASURE-005`; fixtures 11–13/17–18 |

### C. Transforms, placement, dan anchors

| ID | Reconciliation result | Status implementasi | Status evidence | Scope / owner decision | Audit trace |
| --- | --- | --- | --- | --- | --- |
| `GEO-XFORM-001` | `✔️ implemented` | `implemented` | `local-pass` + `fixture-pass` | IN; transform pipeline is shared low-level/core behavior | Audit §3C `GEO-XFORM-001`; `geometry/src/transforms.ts` |
| `GEO-XFORM-002` | `✔️ implemented` | `implemented` | `local-pass` + `fixture-pass` | IN WITH BOUNDARY; operation ordering, recursive split lowering, identity, and finite-value errors are closed | Audit §3C; operation/split tests; core 507 tests |
| `GEO-PLACE-001` | `✔️ implemented` | `implemented` | `local-pass` + `fixture-pass` | IN WITH BOUNDARY; anchor/offset/inside/margin and conflict diagnostics are closed on core fixtures | Audit §3C; placement tests; core 507 tests |
| `GEO-PLACE-002` | `✔️ implemented` | `implemented` | `local-pass` + `fixture-pass` | IN WITH BOUNDARY; point/path/frame endpoint, tangent/normal, orientation, and invalid domain behavior are closed | Audit §3C; frame placement tests; core 507 tests |
| `GEO-ANCH-001` | `✔️ implemented` | `implemented` | `local-pass` + `fixture-pass` | IN; standard anchors appear in active relational baseline | Audit §3C `GEO-ANCH-001`; fixture 10 |
| `GEO-ANCH-002` | `✔️ implemented` | `implemented` | `local-pass` + `fixture-pass` | IN WITH BOUNDARY; custom and operation-result anchors resolve and remain addressable on core/fixture surfaces | Audit §3C; custom-anchor/clone/sheet tests |

### D. Collections

| ID | Reconciliation result | Status implementasi | Status evidence | Scope / owner decision | Audit trace |
| --- | --- | --- | --- | --- | --- |
| `GEO-COLL-001` | `✔️ implemented` | `implemented` | `local-pass` + `fixture-pass` | IN WITH BOUNDARY; five repeat modes, order, child identity, and context are closed on core/fixture surfaces | Audit §3D; repeat tests; fixture 24 |
| `GEO-COLL-002` | `✔️ implemented` | `implemented` | `local-pass` + `fixture-pass` | IN WITH BOUNDARY; along distribution, offsets, endpoints, frame context, and invalid policies are closed locally | Audit §3D; repeat-along/frame tests; fixture 24 |
| `GEO-COLL-003` | `✔️ implemented` | `implemented` | `local-pass` + `fixture-pass` | IN WITH BOUNDARY; grid pitch/gap, auto-layout, exclusivity, and negative validation are closed locally | Audit §3D; grid tests; fixture 24 |
| `GEO-COLL-004` | `✔️ implemented` | `implemented` | `local-pass` + `fixture-pass` | IN WITH BOUNDARY; divide/split order, count, selectors, first/last, and identity are closed locally | Audit §3D; divide/split tests; fixture 24 |
| `GEO-COLL-005` | `✔️ implemented` | `implemented` | `local-pass` + `fixture-pass` | IN WITH BOUNDARY; same-input collection order/IDs replay deterministically; cross-runtime is separate evidence | Audit §3D; projection tests; four-process replay |

### E. Queries dan intersections

| ID | Reconciliation result | Status implementasi | Status evidence | Scope / owner decision | Audit trace |
| --- | --- | --- | --- | --- | --- |
| `GEO-QUERY-001` | `✔️ implemented` | `implemented` | `local-pass` + `fixture-pass` | IN WITH BOUNDARY; supported distance/length/perimeter/area/bbox/extents including holes/boolean results are closed locally | Audit §3E; evaluator/boolean tests; fixture 24 |
| `GEO-QUERY-002` | `✔️ implemented` | `implemented` | `local-pass` + `fixture-pass` | IN WITH BOUNDARY; endpoint/domain, curve sampling, tangent/normal, degenerate, and invalid-target behavior are closed locally | Audit §3E; tangent/frame/query tests |
| `GEO-QUERY-003` | `✔️ implemented` | `implemented` | `local-pass` | IN WITH BOUNDARY; v0.5 overload boundaries are tested | Audit §3E `GEO-QUERY-003`; evaluator tests |
| `GEO-QUERY-004` | `✔️ implemented` | `implemented` | `local-pass` + `fixture-pass` | IN WITH BOUNDARY; supported pair/selector matrix, deterministic ordering, and invalid/empty/multiple errors are frozen; sampled broader pairs remain outside promotion | Audit §3E `GEO-QUERY-004`; geometry contract fixture/intersection tests; conformance 345/345 |
| `GEO-QUERY-005` | `✔️ implemented` | `implemented` | `local-pass` | IN; core frame/length parameter queries directly tested | Audit §3E `GEO-QUERY-005`; `frame_placement.test.ts` |

### F. Constraints

| ID | Reconciliation result | Status implementasi | Status evidence | Scope / owner decision | Audit trace |
| --- | --- | --- | --- | --- | --- |
| `GEO-CONSTRAINT-001` | `✔️ implemented` | `implemented` | `local-pass` + `fixture-pass` | IN WITH BOUNDARY; valid/invalid equal, parallel, perpendicular, tangent, and degenerate diagnostics are closed on core/fixtures | Audit §3F; constraint tests; fixtures 14/24 |
| `GEO-CONSTRAINT-002` | `✔️ implemented` | `implemented` | `fixture-pass` | IN WITH BOUNDARY; post-resolve violation, no general solver | Audit §3F `GEO-CONSTRAINT-002`; fixture 14 |

### G. Boolean operations

| ID | Reconciliation result | Status implementasi | Status evidence | Scope / owner decision | Audit trace |
| --- | --- | --- | --- | --- | --- |
| `GEO-BOOLEAN-001` | `⏸️ held` | `scope-held` | `local-pass` + `fixture-pass` | Approved rectangle/holes union/xor/intersect/subtract boundary is executable; non-rectangle topology promotion requires a decision | Audit §3G; geometry/core boolean tests; fixtures 15/24 |
| `GEO-BOOLEAN-002` | `⏸️ held` | `scope-held` | `local-pass` + `fixture-pass` | Approved holes, empty, multipart, and single/multi errors are explicit; broader topology/result-mode expansion requires a decision | Audit §3G; boolean tests; fixtures 15/19/20/24 |

### H. Numerical robustness dan deterministic behavior

| ID | Reconciliation result | Status implementasi | Status evidence | Scope / owner decision | Audit trace |
| --- | --- | --- | --- | --- | --- |
| `GEO-NUM-001` | `✔️ implemented` | `implemented` | `local-pass` + `fixture-pass` | IN WITH BOUNDARY; low-level tolerance policy and boundary tests are frozen; no universal DSL epsilon claim | Audit §3H `GEO-NUM-001`; intersection/path/split tests; geometry lint/test/build |
| `GEO-NUM-002` | `✔️ implemented` | `implemented` | `local-pass` + `fixture-pass` | IN WITH BOUNDARY; supported rings normalize winding/holes; broader boolean topology remains deferred | Audit §3H `GEO-NUM-002`; `normalizeClosedShape.ts`; boolean tests; fixture 15 |
| `GEO-NUM-003` | `✔️ implemented` | `implemented` | `local-pass` + `fixture-pass` | IN WITH BOUNDARY; selected low-level invalid branches expose stable package codes; core maps public paths | Audit §3H `GEO-NUM-003`; error tests; fixtures 19/20 |
| `GEO-DET-001` | `⏸️ held` | `evidence-held` | `local-pass` + `fixture-pass` + `not-verified` | Local repeated-process determinism is verified; Node 24, full Flutter wrapper, and cross-platform replay are environment-bound | Audit §3H; four-process replay; integration gate qualifier |
| `GEO-DET-002` | `✔️ implemented` | `implemented` | `local-pass` + `fixture-pass` | IN WITH BOUNDARY; stable local identity/order/path replay comparator is active; cross-runtime replay remains separate | Audit §3H `GEO-DET-002`; `core/src/projection.ts`; core/CLI tests; conformance 345/345 |

### I. Serialization dan semantic parity

| ID | Reconciliation result | Status implementasi | Status evidence | Scope / owner decision | Audit trace |
| --- | --- | --- | --- | --- | --- |
| `GEO-SER-001` | `✔️ implemented` | `implemented` | `local-pass` + `fixture-pass` | IN WITH BOUNDARY; versioned canonical projection is consumed by core/CLI; Flutter parity remains unverified | Audit §3I `GEO-SER-001`; `core/src/projection.ts`; `cli/src/index.ts`; CLI tests |
| `GEO-SER-002` | `✔️ implemented` | `implemented` | `local-pass` + `fixture-pass` | IN WITH BOUNDARY; numeric/order/undefined rules and replay comparator are executable locally; cross-version/host proof remains unverified | Audit §3I `GEO-SER-002`; manifest; projection/CLI tests; conformance 345/345 |
| `GEO-PARITY-001` | `⏸️ held` | `evidence-held` | `fixture-pass` + `not-verified` | Flutter fixtures 10/14/15/16 pass directly; fixture 24 and full wrapper remain environment/contract-bound | Audit §3I; Flutter focused test; wrapper qualifier |
| `GEO-PARITY-002` | `⏸️ held` | `evidence-held` | `fixture-pass` + `not-verified` | TypeScript semantic SVG schema/tolerance/order and fixtures 15/16 Flutter assertions pass; fixture 24 Flutter projection/full host surface remain unverified; raw bytes excluded | Audit §3I; renderer comparator/replay; Flutter focused test |

## 4. Scope findings kept separate from capability results

These findings must not be joined into an expected capability row as if they
were implementation absence:

| Finding | Scope/evidence status | Reconciliation handling |
| --- | --- | --- |
| Stale `v0.3` provenance/error wording | `✔️ resolved locally` | The package wording and unsupported-pair message now use the DSL `0.5` boundary; regression coverage remains in the geometry test suite. |
| Broader boolean union/xor/non-rectangle topology | `⏸️ deferred` | `GEO-BOOLEAN-001/002` are now explicit `⏸️` scope holds; no expected row is removed or merged. |
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

### 4.2 Consumer boundary verification — 2026-11-04

The downstream verification task reran the affected package and consumer
boundaries from the current shared workspace. Evidence classes remain
separate: package/consumer commands are `local-workspace`, the shared fixture
runner is `fixture-pass`, and the canonical integration runner was
`environment-unavailable` before consumer stages because the host has Node
22.23.2 while the integration contract requires Node 24+.

| Boundary / command | Result | Evidence class and limitation |
| --- | --- | --- |
| `pnpm test && pnpm lint && pnpm build` from `geometry/` | PASS — 5 files, 93 tests | `local-workspace`; low-level package, tolerance/intersection/boolean, lint, and build evidence. |
| `pnpm test && pnpm lint && pnpm build` from `core/` | PASS — 48 files, 507 tests | `local-workspace`; resolver, query, collection, placement, constraints, deterministic projection, and build evidence. |
| `pnpm test && pnpm build` from `renderer-svg/` | PASS — 7 files, 104 tests | `local-workspace`; semantic SVG projection and build evidence. |
| `pnpm test && pnpm build` from `cli/` | PASS — 38 tests | `local-workspace`; downstream validation/compile and repeated-process serialization boundary. |
| `pnpm run build && pnpm run test` from `playground/` | PASS — 104 tests and fresh Vite build | `local-workspace`; browser consumer build/provenance generated locally, but no browser E2E or public deployment claim. |
| `pnpm run build && pnpm run check && pnpm run test` from `relgeo.github.io/` | PASS — 138 pages, 0 Astro diagnostics, built-output assertions pass | `local-workspace`; website consumer renders and validates locally, without deployment/public-route evidence. |
| `pnpm run conformance:fixtures` from workspace root | PASS — 345/345 across 24 fixtures | `fixture-pass`; shared workspace surfaces, not Flutter/native or public registry evidence. |
| `pnpm run integration:gate -- --local --report=.local/geometry-consumer-integration-local.json` | BLOCKED — exit 2 before consumer stages | `environment-unavailable`; report classifies the declared Node 24 prerequisite as blocked with no human decision required. |
| `pnpm run playground:artifact:check` after local Playground→website assembly | QUALIFIED — failed baseline child-revision assertion | `local-workspace`; assembled files exist, but current Playground `c7cec4b…` differs from baseline pin `47fd715…`; no artifact/public claim is promoted. |
| Public registry / CI / Flutter consumer boundary | NOT VERIFIED | No current public or native-host claim is made; historical CI/public records in `docs/plans/01-cross-repo-integration-gate.md` remain historical and do not bind this dirty working tree. |

The local package, renderer, CLI, and fixture checks show no consumer failure
within the tested TypeScript workspace boundary. They do not promote the
external parity rows (`GEO-DET-001`, `GEO-PARITY-001/002`) or the deferred
boolean topology rows, and they do not override the Node 24/Flutter/public
environment limitation.

## 5. Downstream handoff

Published downstream views:

1. [Geometry status matrix](./status-matrix.md) has one row per `GEO-*`
   ID and keeps implementation, evidence, scope, owner, dependency, risk, and
   next action visible;
2. [Geometry implementation-gap backlog](./implementation-gap-backlog.md)
   retains the historical `🌗`/`❌` candidate routes and current maintenance,
   deferred `⏸️`, ownership `➖`, and `not-verified` evidence follow-ups
   separately;
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
