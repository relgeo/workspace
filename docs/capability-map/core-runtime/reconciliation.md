# Core Runtime Expected-versus-Observed Reconciliation

**Tanggal:** 2026-11-04

**Expected source:** [Expected Core Runtime Capability Catalog](./expected-capability-catalog.md)

**Observed source:** [Current Core Runtime implementation audit](./implementation-audit.md); detailed historical traces remain in the [archived audit log](./archive/implementation-audit-legacy.md)

**Policy sources:** [MATURATION-MASTER-PLAN](../../MATURATION-MASTER-PLAN.md),
[REPOSITORY-MAP](../../REPOSITORY-MAP.md),
[capability inventory protocol](../INVENTORY-PROTOCOL.md),
[compatibility matrix](../../compatibility-matrix.json),
[contract-versioning plan](../../plans/02-contract-versioning.md)

**Status:** join selesai; setiap expected ID memiliki tepat satu row

## 0. P0/P1 implementation-closability triage handoff

Triage pada 2026-11-04 memilih seluruh empat belas row P0/P1 yang dapat
dikerjakan pada boundary implementation lokal: `CORE-INPUT-002`,
`CORE-MODEL-002`, `CORE-VALID-003`, `CORE-VALID-004`, `CORE-ERROR-001`,
`CORE-ERROR-002`, `CORE-RESOLVE-003`, `CORE-RESOLVE-005`,
`CORE-CONSTRAINT-002`, `CORE-DIAG-001`, `CORE-DIAG-002`, `CORE-ERROR-003`,
`CORE-DET-002`, dan `CORE-INT-002`. Definisi, owner, normative source of truth,
acceptance target, dan initial status ada di
[backlog triage table](./implementation-gap-backlog.md#p0p1-implementation-closability-triage).

“Implementation-closable” berarti owner dapat membuat perubahan dan
menjalankan focused acceptance check dari checkout ini; itu bukan klaim bahwa
capability sudah selesai atau evidence eksternal sudah tersedia. Node `>=24`,
registry/public artifact, current CI, browser E2E, Flutter host, dan fixture-16
promotion tetap dipisahkan sebagai `? unverified`/`⏸️ deferred`. General
constraint solving dan automatic geometry mutation tetap `➖ not-applicable`.

## 1. Aturan rekonsiliasi

Dokumen ini melakukan join satu-ke-satu berdasarkan **ID capability**. Nama,
urutan tabel, keberadaan file, dan hasil discovery-only tidak dapat membuat,
menghapus, atau mengganti expected ID.

Tiga dimensi tetap terpisah:

1. **Status implementasi** — apa yang ditemukan pada boundary `core`.
2. **Status evidence** — seberapa jauh behavior dapat dijalankan atau
   direproduksi pada boundary yang diperiksa.
3. **Keputusan scope** — apakah capability memang dimiliki core, dibatasi,
   ditunda promosinya, atau berada pada consumer lain.

### Reconciliation result

| Result | Arti |
| --- | --- |
| `✔️ implemented` | Implementasi ditemukan dan evidence lokal yang relevan tersedia; bukan klaim parity penuh. |
| `🌗 partial` | Subset behavior tersedia, tetapi contract dimension, coverage, atau consumer parity belum lengkap. |
| `⚠️ broken` | Defect atau drift contract terkonfirmasi pada capability. |
| `❌ absent` | Capability expected dan in-scope, tetapi implementation boundary untuk behavior yang dinyatakan tidak ditemukan. Row wajib dipertahankan. |
| `? unverified` | Evidence yang diperlukan belum dapat dijalankan atau direproduksi; tidak boleh disimpulkan absent. |
| `⏸️ deferred` | Promosi atau perluasan capability sengaja ditahan oleh keputusan proyek. Dicatat sebagai scope/evidence finding, bukan penghapus expected row. |
| `➖ not-applicable` | Bukan tanggung jawab core pada scope yang disepakati. Dicatat terpisah, bukan dipakai untuk capability yang sekadar belum ditemukan. |

Aturan penting: `❌` berarti absence implementation pada expected boundary; ia
berbeda dari `?` (evidence belum tersedia), `⏸️` (ditunda), dan `➖`
(not-applicable). Pada current join `CORE-DIAG-002` adalah `🌗` karena core
memiliki bounded `collectDiagnostics` aggregation; `CORE-ERROR-003` kini
`⚠️` karena covered public normalization belum menghilangkan drift pada
emitted-code/type agreement dan remaining internal throw paths.

## 2. Coverage dan hasil join

| Check | Result |
| --- | --- |
| Expected catalog rows | 38 |
| Reconciliation rows | 38 |
| Missing expected IDs | 0 |
| Extra observed-only IDs in join | 0 |
| Duplicate reconciliation IDs | 0 |
| `✔️ implemented` | 23 |
| `🌗 partial` | 14 |
| `❌ absent` | 0 |
| `⚠️ broken` | 1 |
| `? unverified` as row result | 0; limitations remain in evidence columns and findings |
| `⏸️ deferred` / `➖ not-applicable` as row result | 0; kept separate from expected implementation rows |

The 38 expected IDs are the complete key set from the catalog. `CORE-GAP-*`
items in the audit are gap records, not additional capability rows.

Evidence authority for this join is the current audit and its discovery report,
with normative and provenance context from the master plan, compatibility
matrix, contract-versioning plan, repository map, capability inventory protocol,
DSL spec, and fixture manifest. Historical
matrices are not used to add or remove expected IDs.

Required source boundary for this reconciliation:

| Source | Reconciliation role |
| --- | --- |
| [`core/`](../../../core) | Implementation boundary referenced by the audit; no consumer implementation is silently merged into core status. |
| [`docs/MATURATION-MASTER-PLAN.md`](../../MATURATION-MASTER-PLAN.md) | Roadmap, compatibility, evidence-tier, and scope decisions. |
| [`docs/REPOSITORY-MAP.md`](../../REPOSITORY-MAP.md) | Repository ownership and consumer/core boundary. |
| [`docs/capability-map/`](..) | Expected catalog, audit, status legend, and evidence policy used for the join. |

## 3. One-to-one reconciliation register

### A. Input pipeline and semantic model

| ID | Reconciliation result | Status implementasi | Status evidence | Scope / owner decision | Audit trace |
| --- | --- | --- | --- | --- | --- |
| `CORE-INPUT-001` | `✔️ implemented` | `implemented` | `verified-local` + parser tests | `IN`; source ingestion is core-owned and version-aware | Audit §4A; `core/src/parser.ts:144–267` |
| `CORE-INPUT-002` | `🌗 partial` | `partial` | `partial-local`; no public source-range AST | `IN`; structured parse is core-owned, source-location depth remains bounded | Audit §4A; `core/src/parser.ts`, `core/src/types.ts` |
| `CORE-MODEL-001` | `✔️ implemented` | `implemented` | `verified-local` + parser/section tests | `IN`; normative document sections remain semantically distinct | Audit §4A; `core/src/types.ts:576–590` |
| `CORE-MODEL-002` | `🌗 partial` | `partial` | `partial-local`; broad `any`/error union remains | `IN`; identity, namespaces, and scope are core contract | Audit §4A; `core/src/types.ts:15–90,492–518,645–651` |
| `CORE-MODEL-003` | `✔️ implemented` | `implemented` | `verified-local` + unit/resolver tests | `IN`; scene policy controls resolution context | Audit §4A; `core/src/types.ts:15–24`, `core/src/resolver/index.ts:46–87` |

### B. Validation and error recovery

| ID | Reconciliation result | Status implementasi | Status evidence | Scope / owner decision | Audit trace |
| --- | --- | --- | --- | --- | --- |
| `CORE-VALID-001` | `✔️ implemented` | `implemented` | `verified-local` + parser/validator tests | `IN`; invalid structure cannot be silently reinterpreted | Audit §4B; `core/src/parser.ts`, `core/src/validator.ts:94–129` |
| `CORE-VALID-002` | `✔️ implemented` | `implemented` | `verified-local` + evaluator/parameter tests | `IN`; typed value and expression validation is core-owned | Audit §4B; `core/src/validator.ts`, `core/src/evaluator.ts` |
| `CORE-VALID-003` | `🌗 partial` | `partial` | `verified-local-bounded`; public reference failures normalize, broader raw internal paths remain | `IN`; reference and dependency legality are core-owned | Audit §4B; `core/src/validator.ts`, `core/src/resolver/eval-context.ts`, semantic-contract fixture test |
| `CORE-VALID-004` | `🌗 partial` | `partial` | `partial-local`; combination coverage bounded | `IN`; topology and degenerate-input checks remain required | Audit §4B; `core/src/validator.ts:650–1430` |
| `CORE-ERROR-001` | `🌗 partial` | `partial` | `verified-local` for bounded tolerant cases | `IN WITH BOUNDARY`; recovery must not imply compile success | Audit §4B; `core/src/parser.ts:99–104`, `tolerant_resolver.test.ts` |
| `CORE-ERROR-002` | `🌗 partial` | `partial` | `verified-local-bounded` + invalid fixture/conformance and CLI projection | `IN`; strict compile/check must preserve failure phase | Audit §4B; `core/src/resolver/index.ts`, `cli/src/index.ts` |

### C. Dependency graph, evaluator, and units

| ID | Reconciliation result | Status implementasi | Status evidence | Scope / owner decision | Audit trace |
| --- | --- | --- | --- | --- | --- |
| `CORE-GRAPH-001` | `✔️ implemented` | `implemented` | `verified-local` + dependency tests | `IN`; all geometry-affecting relations must be discoverable | Audit §4C; `core/src/graph.ts:15–220,650–730` |
| `CORE-GRAPH-002` | `✔️ implemented` | `implemented` | `verified-local` + cycle/conformance tests | `IN`; cycles are structured errors, never auto-broken | Audit §4C; `core/src/graph.ts:802–975` |
| `CORE-EVAL-001` | `✔️ implemented` | `implemented` | verified by focused regression at `31347e4`; current-pointer rerun not independently available | `IN`; syntax-only expression evaluation uses a non-zero placeholder, while actual evaluated division errors retain their meaning | Audit §4C; `core/src/evaluator.ts:42–394` |
| `CORE-EVAL-002` | `✔️ implemented` | `implemented` | `verified-local` + derived/fixture tests | `IN`; phase order and component-local scope are preserved | Audit §4C; `core/src/resolver/values.ts`, `core/src/resolver/index.ts:89–114` |
| `CORE-EVAL-003` | `✔️ implemented` | `implemented` | `verified-local` + query/frame tests | `IN`; ambiguous results require selector or structured failure | Audit §4C; `core/src/evaluator.ts:540–765,900–1555` |
| `CORE-UNIT-001` | `✔️ implemented` | `implemented` | `verified-local` + unit tests/conformance | `IN WITH BOUNDARY`; fixture 16 promotion remains deferred | Audit §4C; `core/src/units.ts`, fixture `v05-evaluator-units-candidate` |

### D. Resolver and semantic execution

| ID | Reconciliation result | Status implementasi | Status evidence | Scope / owner decision | Audit trace |
| --- | --- | --- | --- | --- | --- |
| `CORE-RESOLVE-001` | `✔️ implemented` | `implemented` | `verified-local` + resolver/fixture tests | `IN`; supported object semantics are core-resolved | Audit §4D; `core/src/resolver/objects.ts:80–138` |
| `CORE-RESOLVE-002` | `✔️ implemented` | `implemented` | `verified-local` + placement/anchor tests | `IN`; placement and world/local semantics are core-owned | Audit §4D; `core/src/resolver/index.ts:50–87`, `primitives/utils.ts` |
| `CORE-RESOLVE-003` | `🌗 partial` | `partial` | `verified-local-bounded` + fixtures 19/20/22 and semantic-contract tests | `IN WITH BOUNDARY`; repeat/boolean/empty-collection topology coverage remains bounded | Audit §4D; `core/src/resolver/primitives/{repeat,divide,operation,shapes}.ts` |
| `CORE-RESOLVE-004` | `✔️ implemented` | `implemented` | `verified-local` + sheet/view/reference fixtures | `IN WITH BOUNDARY`; SVG styling stays renderer-owned | Audit §4D; `core/src/resolver/index.ts:174–327` |
| `CORE-RESOLVE-005` | `🌗 partial` | `partial` | `verified-local` for versioned projection; consumer migration remains open | `IN`; semantic projection is core-owned, renderer formatting remains separate | Audit §4D; `core/src/projection.ts`, `core/src/resolver/index.ts` |

### E. Constraints, diagnostics, and failure semantics

| ID | Reconciliation result | Status implementasi | Status evidence | Scope / owner decision | Audit trace |
| --- | --- | --- | --- | --- | --- |
| `CORE-CONSTRAINT-001` | `✔️ implemented` | `implemented` | `verified-local` + constraint fixture | `IN WITH BOUNDARY`; post-resolve validation, not general solving | Audit §4E; `core/src/resolver/constraints.ts:43–186` |
| `CORE-CONSTRAINT-002` | `🌗 partial` | `partial` | `verified-local-bounded`; fixture 14 and focused tests now prove severity/origin/expected-actual fields, while broader relation/topology coverage remains open | `IN`; structured violations remain distinct from exceptions | Audit §4E; `geometry/src/types.ts:311–328`, `core/src/resolver/constraints.ts`, semantic-contract fixture test |
| `CORE-DIAG-001` | `🌗 partial` | `partial` | `verified-local-bounded` + normalized core/consumer fixture tests; source-range coverage remains bounded | `IN`; stable codes/paths are public contract | Audit §4E; `core/src/errors.ts`, `diagnostics.ts`, parser/validator/resolver boundaries |
| `CORE-DIAG-002` | `🌗 partial` | `partial` | `verified-local-bounded` + aggregation tests | `IN`; core owns deterministic aggregation; broader fault coverage remains | Audit §4E; `core/src/diagnostics.ts`, `core/src/__tests__/diagnostics.test.ts` |
| `CORE-ERROR-003` | `⚠️ broken` | `broken` | `verified-local-bounded`; registered mappings now cover additional raw evaluator/resolver phrases, but evaluator raw throws and emitted-code/spec/type agreement remain open | `IN`; distinct actionable error taxonomy is required | Audit §4E; `core/src/types.ts`, `core/src/errors.ts`, evaluator/raw throw sites |

### F. Determinism, public API, compatibility, and integration

| ID | Reconciliation result | Status implementasi | Status evidence | Scope / owner decision | Audit trace |
| --- | --- | --- | --- | --- | --- |
| `CORE-DET-001` | `✔️ implemented` | `implemented` | `verified-local-bounded`; canonical Node 24 unverified | `IN`; determinism is a core guarantee | Audit §4F; `core/src/resolver/index.ts:132–143`, graph/resolver tests |
| `CORE-DET-002` | `🌗 partial` | `partial` | `partial-local`; numeric/diagnostic ordering is distributed | `IN`; stable identity/order/tolerance policy is required | Audit §4F; `core/src/graph.ts:802–845`, constraints `EPSILON` |
| `CORE-API-001` | `✔️ implemented` | `implemented` | `verified-local` + build/consumer imports | `IN`; public API is narrower than internals | Audit §4F; `core/src/index.ts`, `core/package.json` |
| `CORE-API-002` | `✔️ implemented` | `implemented` | `verified-local` + renderer/CLI/consumer tests | `IN`; renderer formatting is outside core ownership | Audit §4F; `core/src/index.ts`, renderer/CLI call sites |
| `CORE-COMPAT-001` | `✔️ implemented` | `implemented` | `verified-local` + parser/conformance/compatibility | `IN`; active DSL line is explicit | Audit §4F; `core/src/parser.ts:5–32`, compatibility matrix |
| `CORE-COMPAT-002` | `✔️ implemented` | `implemented` | `verified-local` + legacy/future fixture tests | `IN WITH BOUNDARY`; legacy support does not reinterpret future syntax | Audit §4F; parser constants and fixture manifest |
| `CORE-COMPAT-003` | `✔️ implemented` | `implemented` | `verified-local` + compatibility check; registry unverified | `IN`; DSL compatibility line is separate from package version | Audit §4F; compatibility matrix/package metadata |
| `CORE-INT-001` | `✔️ implemented` | `implemented` | `verified-local` + CLI tests/conformance | `IN WITH BOUNDARY`; CLI owns flags/filesystem, core owns semantics | Audit §4F; `cli/src/index.ts:22–241` |
| `CORE-INT-002` | `🌗 partial` | `partial` | `partial-local` + language-service/worker tests; browser E2E unverified | `IN WITH BOUNDARY`; UI/worker/accessibility remain consumer-owned | Audit §4F; language-service and `playground/src/worker.ts` |
| `CORE-INT-003` | `✔️ implemented` | `implemented` | `verified-local` + 23-fixture / 298-check conformance | `IN`; fixture provenance is evidence, not implementation substitute | Audit §4F; `scripts/run-conformance-fixtures.mjs`, `fixtures/manifest.json` |
| `CORE-INT-004` | `🌗 partial` | `partial` | `partial-local`; TypeScript consumers pass, Flutter CI unverified | `IN WITH BOUNDARY`; semantic parity only, not raw SVG/UX parity | Audit §4F; renderer/CLI/Markdown/Flutter boundary evidence |

### 3.1 Frozen diagnostic and semantic contract join

The seven IDs below are the frozen scope for the current diagnostic/error and
semantic-result audit. The complete code/phase/object/path/ordering contract is
normatively indexed in [expected catalog §4.1](./expected-capability-catalog.md#41-frozen-diagnostic-and-semantic-contract-scope)
and operationally tracked in the [gap backlog frozen tranche](./implementation-gap-backlog.md#frozen-diagnosticsemantic-contract-tranche).
This join records the traceability tuple required for each gap: owner, source
of truth, executable acceptance evidence, and current evidence status.

| ID | Owner | Source of truth | Acceptance evidence | Status / trace |
| --- | --- | --- | --- | --- |
| `CORE-VALID-003` | `relgeo/core` | `spec/id/core/06-error-model.md`; composition/placement/query specs | Unknown reference, private export, invalid target/query, and dependency negatives assert stable code/path/object context | `🌗 verified-local-bounded`; public normalization covered, raw internal paths remain; Audit §4B |
| `CORE-ERROR-002` | `relgeo/core` + CLI | `spec/id/core/06-error-model.md`; `cli/README.md` | Strict parse/validate/resolve/runtime/constraint fixtures preserve phase and CLI consumes core code | `🌗 verified-local-bounded`; release/host evidence not included; Audit §4B |
| `CORE-RESOLVE-003` | `relgeo/core` + geometry | collection-object and collection specs; `05-semantic-guarantees.md` | Fixtures 19/20/22 plus semantic-contract tests assert identity, ordering, empty/multipart mode failures, and editor fallback | `🌗 verified-local-bounded`; broader topology matrix remains open; Audit §4D |
| `CORE-CONSTRAINT-002` | `relgeo/core` + geometry | `06-error-model.md`; constraints spec | `v05-runtime-align-violation` plus focused test asserts path/order, retained scene, and repeat determinism | `🌗 partial-local`; fields are present locally, while relation/topology and consumer coverage remain open; Audit §4E |
| `CORE-DIAG-001` | `relgeo/core` | `06-error-model.md`; catalog §4.1 shared fields | Structured-error/parser/validator/resolver/runtime/constraint tests assert code, message, phase, severity, path/context/range rules | `🌗 verified-local-bounded`; normalization exists, raw/source-range coverage bounded; Audit §4E |
| `CORE-DIAG-002` | `relgeo/core` | `05-semantic-guarantees.md`, `06-error-model.md` | `collectDiagnostics` tests assert phase→range→path→code→message order, dedupe, truncation, repeatability, and strict equivalence | `🌗 verified-local-bounded`; broader fault coverage open; Audit §4E |
| `CORE-ERROR-003` | `relgeo/core` | `06-error-model.md`; fixture IDs 13, 17–20, 22 | Covered emitted-code/type inventory, raw-throw normalization, and runtime fixtures prove distinct actionable codes | `⚠️ broken`; `BOOLEAN_EMPTY_RESULT` is normalized, but remaining internal/non-prefixed throw inventory and emitted-code/spec/type agreement stay open; Audit §4E |

Frozen global rules: public diagnostics require `code`, `message`, `phase`, and
`severity`; document-origin failures require a canonical path. Aggregated
diagnostics sort by phase, source position, path, code, message, deduplicate,
then truncate. Collection ordering follows semantic source order and stable
identity. Constraint failures retain the resolved scene and do not mutate
geometry. These rules do not promote any row to `✔️`.

### 3.2 Selected-gap contract and acceptance lock

This is the pre-implementation contract lock for all fourteen selected rows in
§0. It is derived from the normative `spec/id/` sources named per row, the
active compatibility policy in [`docs/compatibility-matrix.json`](../../compatibility-matrix.json),
and the evidence/scope rules in
[`INVENTORY-PROTOCOL.md`](../INVENTORY-PROTOCOL.md). The matrix status remains
the initial status; this register defines what must be demonstrated before a
future re-audit can change it.

Compatibility invariant for every row: active DSL line is `0.5`, omitted
version defaults to `0.5`, supported legacy is `0.4`, `0.1`–`0.3` remain
regression-only, and unsupported future/unknown versions fail with
`UNSUPPORTED_SPEC_VERSION`. Package changes stay on `0.5.x` for compatible
work; a breaking public contract requires a decision record and the next
compatibility line (for example `0.6.x`). No implementation change may invent
a new public field, code, phase, result mode, or serialization rule without a
corresponding normative source-of-truth update and acceptance fixture.

| ID / owner | Success behavior | Failure / edge behavior | Acceptance evidence | Normative source of truth |
| --- | --- | --- | --- | --- |
| `CORE-INPUT-002` — `relgeo/core` + language-service | Valid active-line YAML becomes a structured document representation; source range is retained when available and parse success is not resolve success. | Invalid YAML or incomplete editor input returns bounded parse diagnostics; missing ranges remain explicit and must not erase semantic paths. | `core/src/__tests__/parser.test.ts`, `diagnostics.test.ts`, language-service range tests; local parser/diagnostic test command. | `spec/id/core/01-overview.md`; `spec/id/core/06-error-model.md` |
| `CORE-MODEL-002` — `relgeo/core` + `relgeo/spec` | Typed values, stable user identities, namespaces, collections, references, and component-local scope remain addressable through the public semantic model. | Type mismatch, private-scope access, unknown identity, or invalid collection shape yields a structured failure; public contract does not fall back to broad untyped JSON. | `core/src/__tests__/component.test.ts`, `structured_parameters.test.ts`, resolver/type checks, and public declaration inspection. | `spec/id/syntax/07-type-system.md`; `spec/id/geometry/13-object-model.md`, `15-composition-objects.md` |
| `CORE-VALID-003` — `relgeo/core` | Known references, exports, placement targets, query inputs, and dependency edges validate with stable path/object context. | Unknown references, private exports, invalid placement/query targets, and illegal dependencies return actionable codes at the originating path; no implicit repair. | `core/src/__tests__/semantic_contract_fixtures.test.ts`, `component.test.ts`, validator/reference negatives, and raw-throw inventory. | `spec/id/core/06-error-model.md`; `spec/id/geometry/15-composition-objects.md`, `17-placement.md`, `20-geometry-queries.md` |
| `CORE-VALID-004` — `relgeo/core` + geometry | Valid closed paths, supported operation modes, dimensions, offsets, repeats, and annotations pass validation without changing semantic intent. | Open/degenerate paths, invalid holes, unsupported modes, invalid dimensions/offsets, and topology violations fail before corrupting scene output with stable diagnostics. | `path_holes.test.ts`, `boolean.test.ts`, `repeat_divide.test.ts`, `split.test.ts`, validator negatives, and negative fixture matrix. | `spec/id/geometry/14-geometry-objects.md`, `16-collection-objects.md`, `21-constraints.md` |
| `CORE-ERROR-001` — `relgeo/core` + Playground | Tolerant editor mode returns bounded partial diagnostics/recovery and keeps stable editable identities while the source is incomplete. | Unsupported recovery remains explicit; tolerant output never claims strict compile/resolve success and never silently mutates source meaning. | `core/src/__tests__/tolerant_resolver.test.ts`, `semantic_contract_fixtures.test.ts`, `diagnostics.test.ts`; browser recovery evidence is separately labeled. | `spec/id/core/05-semantic-guarantees.md`; `spec/id/core/06-error-model.md`; `playground/README.md` |
| `CORE-ERROR-002` — `relgeo/core` + CLI | Strict parse, validate, resolve, runtime, and constraint failures retain distinct phases/codes and CLI projection remains deterministic. | Compile/check does not recover silently; unsupported version, missing field, reference, cycle, runtime, and constraint failures preserve their phase and exit policy. | `validation_modes.test.ts`, `structured_errors.test.ts`, semantic fixtures, CLI tests, and shared conformance failure cases. | `spec/id/core/06-error-model.md`; `cli/README.md`; `fixtures/manifest.json` |
| `CORE-RESOLVE-003` — `relgeo/core` + geometry | Repeat/divide/split/boolean results preserve declared identity, semantic order, holes/topology boundaries, and explicit single/multi result modes. | Empty or multipart `single` outcomes, invalid collection access, and invalid operation modes return distinct actionable runtime errors; no automatic topology repair. | `repeat_divide.test.ts`, `split.test.ts`, `boolean.test.ts`, semantic-contract tests, and runtime fixtures 15/19/20/22. | `spec/id/geometry/16-collection-objects.md`, `19-collections.md`; `spec/id/core/05-semantic-guarantees.md` |
| `CORE-RESOLVE-005` — `relgeo/core` + geometry | Versioned semantic projection exposes schema metadata, canonical keys/order/numbers, typed objects, bounds, values, violations, views, and sheets. | Missing/unstable fields, order, or numeric normalization fails the projection comparator; consumers may not redefine core semantics or silently drop contract fields. | `core/src/__tests__/projection.test.ts`, CLI/renderer comparator tests, and projection/conformance fixtures. | `core/README.md`; `spec/id/core/05-semantic-guarantees.md`; fixture resolved-scene expectations |
| `CORE-CONSTRAINT-002` — `relgeo/core` + geometry | Post-resolve violations retain the resolved scene and expose stable constraint path, involved objects, severity, origin, expected/actual context, and declaration order. | Invalid relations produce `CONSTRAINT_VIOLATION` results without geometry mutation; general solving and automatic repair remain out of scope. | `constraints_diagnostics.test.ts`, `semantic_contract_fixtures.test.ts`, and `v05-runtime-align-violation` valid/invalid fixtures. | `spec/id/core/06-error-model.md`; `spec/id/geometry/21-constraints.md` |
| `CORE-DIAG-001` — `relgeo/core` | Every public diagnostic has required `code`, non-empty `message`, `phase`, `severity`, and applicable path/object/dependency/range context. | Raw internal failures are normalized at the public boundary with a documented fallback and retained context; no consumer invents semantic codes. | `structured_errors.test.ts`, `diagnostics.test.ts`, parser/validator/resolver/runtime/constraint fixtures, and emitted-code/raw-throw inventory. | `spec/id/core/06-error-model.md`; expected catalog §4.1 shared fields |
| `CORE-DIAG-002` — `relgeo/core` | `collectDiagnostics` returns a deterministic, deduplicated, bounded list ordered by phase, range, path, code, and message without changing strict semantics. | Parse remains parse-only; `maxDiagnostics` truncates after ordering; independent faults may aggregate, but strict compile/resolve remains fail-fast. | `core/src/__tests__/diagnostics.test.ts` repeated-run, ordering, dedupe, truncation, and strict-equivalence cases. | `spec/id/core/05-semantic-guarantees.md`; `spec/id/core/06-error-model.md` |
| `CORE-ERROR-003` — `relgeo/core` | Actionable no-intersection, multiple-intersection, cycle, invalid offset/path, boolean, and unsupported-version causes retain distinct public semantics. | Every emitted actionable code is represented in the public union or normalized by documented fallback; uncatalogued evaluator/resolver throws cannot cross the public boundary. | Emitted-code/type-union inventory, `structured_errors.test.ts`, evaluator/resolver regressions, and runtime fixtures 13/17–20/22. | `spec/id/core/06-error-model.md`; `fixtures/manifest.json` |
| `CORE-DET-002` — `relgeo/core` + `relgeo/spec` | Repeated runs preserve stable IDs, dependency/collection order, normalized numbers, tolerance decisions, and diagnostic paths. | Any order/numeric/path drift is a contract failure to be isolated by replay comparator; Node 24 and cross-platform runs remain separate evidence. | `projection.test.ts`, graph tests, diagnostic ordering tests, and canonical replay comparator. | `spec/id/core/04-evaluation-order.md`; `spec/id/core/05-semantic-guarantees.md` |
| `CORE-INT-002` — `relgeo/core` + language-service + Playground | Local edit → diagnostic → resolve boundary passes for valid, incomplete, and runtime-error sources while preserving Core semantics. | Incomplete/runtime-error input never becomes false preview/compile success; browser E2E, accessibility, and host sequencing are reported as consumer evidence. | Language-service/worker tests, shared conformance, and browser E2E when available; local and external evidence remain separate tiers. | `core/README.md`; `playground/README.md`; `spec/id/core/06-error-model.md` |

Acceptance evidence is classified using the inventory protocol: local source and
tests are `E1`/`E2`, local cross-surface runs are `E3`, and unavailable CI,
public, browser, or native-host runs remain `not verified` rather than changing
the implementation result. A row can move status only after the stated success
and failure/edge behavior is tested and the matrix/reconciliation are re-audited.

### 3.3 Historical local consumer verification — 2026-11-03

This earlier workspace verification is retained for traceability. It is
superseded by the fresh 2026-11-04 consumer checkpoint in §3.4; its lower test
and fixture counts must not be read as the current result.

| Command | Result | Boundary checked |
| --- | --- | --- |
| `TMPDIR=/private/tmp pnpm --dir core exec vitest run src/__tests__/semantic_contract_fixtures.test.ts` | 1 file / 8 tests passed | Focused reference, constraint, result-mode, empty-collection, and incomplete-source contract assertions |
| `pnpm --dir core exec vitest run src/__tests__/component.test.ts src/__tests__/diagnostics.test.ts src/__tests__/projection.test.ts src/__tests__/semantic_contract_fixtures.test.ts src/__tests__/tolerant_resolver.test.ts` | 5 files / 34 tests passed | Selected-gap acceptance evidence for typed model, diagnostics, projection, semantic failure modes, and bounded recovery |
| `TMPDIR=/private/tmp pnpm conformance:fixtures` | 290 passed / 0 failed across 23 fixtures | Shared fixture manifest and core/language-service/CLI/renderer/remark consumer projections |
| `TMPDIR=/private/tmp pnpm test` | Workspace suites passed: core 450, language-service 75, CLI 23, renderer-svg 88, remark-relgeo 7, remark-relgeo-hl 5, playground 102, geometry 75 | Current TypeScript consumer test surfaces |
| `pnpm --dir core run lint && pnpm run language-spec:check` | Passed; 34 specification documents checked | Core lint and language-spec contract consistency |
| `pnpm run compatibility:check` | **FAIL — 280 passed / 3 failed** | Active DSL line and `0.5.x` policy checks pass; current metadata drift remains: Core manifest `0.5.2` vs matrix `0.5.1`, Playground Core dependency `^0.5.2` vs matrix lower bound `^0.5.0`, and Flutter application `1.0.1+1` vs matrix `1.0.0+1`. This is recorded as metadata follow-up, not a semantic contract change. |
| `git diff --check && git -C core diff --check` | Passed | Whitespace integrity for root and Core changes |

The local process used Node `22.23.2`; the repository engine requirement is
Node `>=24`, so this is not canonical toolchain evidence. No new npm release,
registry/public-artifact, current CI, browser E2E, Flutter host, or deployment
claim is made. The earlier SuClos reconnect/network failure is orchestration
evidence only and does not establish target parity or target failure.

### 3.4 Consumer and integration-boundary checkpoint — 2026-11-04

These fresh local consumer commands ran against the current Core workspace
boundary and passed. They are local E3 evidence, not CI or public-package
evidence:

| Command | Result | Consumer boundary |
| --- | --- | --- |
| `pnpm --dir language-service test` | **PASS — 2 files, 82 tests** | Language-service diagnostics and editor consumer of Core. |
| `pnpm --dir renderer-svg test && pnpm --dir renderer-svg run test:dist` | **PASS — 92 tests plus 1 distribution-boundary test** | SVG renderer semantic projection and built Core/renderer package boundary. |
| `pnpm --dir cli test` | **PASS — 36 tests** | CLI parse/resolve/error projection consumer. |
| `pnpm --dir remark-relgeo test` | **PASS — 9 tests** | Markdown preview consumer, including runtime constraint diagnostics. |
| `pnpm --dir remark-relgeo-hl test` | **PASS — 6 tests** | Syntax-highlighting consumer boundary. |
| `pnpm --dir core run build && pnpm --dir renderer-svg run build && pnpm --dir language-service run build && pnpm --dir cli run build` | **PASS** | Rebuilt Core and direct TypeScript consumer artifacts locally from the current workspace. Generated `dist/` output is verification-only. |
| `pnpm --dir renderer-svg run test:dist` | **PASS — 1 distribution-boundary test** | Renderer consumes the rebuilt package boundary rather than only source modules. |
| `node scripts/run-conformance-fixtures.mjs` | **PASS — 298 passed, 0 failed across 23 fixtures** | Cross-surface Core, CLI, language-service, renderer, remark, snapshot, and runtime-error projections. |
| `pnpm run integration:gate -- --local` | **NOT RUN — exit 2 before stages** | Gate requires Node `>=24`; host provided Node `22.23.2`. This is environment-unavailable evidence, not a consumer parity failure. |

The integration-gate design and public/local separation remain governed by
[Sub-plan 01 — Cross-repo Integration Gate](../../plans/01-cross-repo-integration-gate.md).
The last recorded canonical CI/public evidence in that plan is historical for
an earlier pointer; it is not promoted as current evidence for this checkout.

## 4. Scope and evidence findings kept separate

These findings do not replace any of the 38 rows above:

| Finding | Status | Reconciliation handling |
| --- | --- | --- |
| General constraint solver / automatic geometry mutation | `➖ not-applicable` | Explicit product non-goal; keep `CORE-CONSTRAINT-001` as post-resolve validation. |
| Fixture 16 evaluator/unit promotion to active cross-consumer contract | `⏸️ deferred` | Keep `CORE-UNIT-001`, `CORE-EVAL-002`, and `CORE-INT-004` at their observed status; do not convert to `➖`. |
| Current Node `>=24`, registry/public package, current CI, browser E2E, and Flutter host evidence | `? unverified` | Qualify evidence only; do not convert an implementation row to `❌` without a boundary absence finding. |
| Core-owned UI route, shortcut, native service, or accessibility surface | `➖ not-applicable` | Consumer boundaries were audited, but these are not core responsibilities. |
| Raw SVG/style/viewBox, browser worker sequencing, editor UX/accessibility, or Flutter host behavior | `➖ not-applicable` for core contract; `? unverified` for host evidence | Consumers may project the frozen contract, but host/rendering behavior is not core diagnostic or semantic-result ownership. |
| New geometry algorithms, general constraint solving, or automatic geometry mutation | `➖ not-applicable` | This tranche freezes acceptance/evidence boundaries; geometry implementation closure is a separate core+geometry task. |

## 5. Downstream handoff

The current audit's `CORE-GAP-001`–`CORE-GAP-007` records are downstream gap
items, not extra expected IDs. Priority follow-up is:

1. `CORE-GAP-001` — reconcile public error codes and raw exception paths;
2. `CORE-GAP-002` — decide and implement deterministic diagnostic aggregation;
3. `CORE-GAP-003` — decide AST/source-location and stronger semantic typing;
4. `CORE-GAP-005` — formalize canonical resolved-scene serialization;
5. `CORE-GAP-006` — make an explicit promotion decision for fixture 16;
6. `CORE-GAP-007` — refresh Node `>=24`, registry, CI, browser, and Flutter
   evidence before release-level parity claims.

Primary evidence:

- [Expected catalog](./expected-capability-catalog.md)
- [Current implementation audit evidence](./implementation-audit.md)
- [Archived detailed audit log](./archive/implementation-audit-legacy.md)
- [MATURATION-MASTER-PLAN](../../MATURATION-MASTER-PLAN.md)
- [compatibility matrix](../../compatibility-matrix.json)
- [contract-versioning plan](../../plans/02-contract-versioning.md)
- [fixture manifest](../../../fixtures/manifest.json)
