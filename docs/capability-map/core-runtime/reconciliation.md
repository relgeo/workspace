# Core Runtime Expected-versus-Observed Reconciliation

**Tanggal:** 2026-11-03

**Expected source:** [Expected Core Runtime Capability Catalog](./expected-capability-catalog.md)

**Observed source:** [Current Core Runtime implementation audit](./implementation-audit.md); detailed historical traces remain in the [archived audit log](./archive/implementation-audit-legacy.md)

**Policy sources:** [MATURATION-MASTER-PLAN](../../MATURATION-MASTER-PLAN.md),
[REPOSITORY-MAP](../../REPOSITORY-MAP.md),
[capability inventory protocol](../INVENTORY-PROTOCOL.md),
[compatibility matrix](../../compatibility-matrix.json),
[contract-versioning plan](../../plans/02-contract-versioning.md)

**Status:** join selesai; setiap expected ID memiliki tepat satu row

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
`🌗` karena covered public normalization sudah diverifikasi lokal, sementara
exhaustive emitted-code/type agreement dan remaining internal throw paths belum
terbukti.

## 2. Coverage dan hasil join

| Check | Result |
| --- | --- |
| Expected catalog rows | 38 |
| Reconciliation rows | 38 |
| Missing expected IDs | 0 |
| Extra observed-only IDs in join | 0 |
| Duplicate reconciliation IDs | 0 |
| `✔️ implemented` | 23 |
| `🌗 partial` | 15 |
| `❌ absent` | 0 |
| `⚠️ broken` | 0 |
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
| `CORE-CONSTRAINT-002` | `🌗 partial` | `partial` | `verified-local-bounded`; fixture 14 retains resolved scene and deterministic order, but violation shape lacks full severity/origin/expected-actual contract | `IN`; structured violations remain distinct from exceptions | Audit §4E; `geometry/src/types.ts:311–323`, semantic-contract fixture test |
| `CORE-DIAG-001` | `🌗 partial` | `partial` | `verified-local-bounded` + normalized core/consumer fixture tests; source-range coverage remains bounded | `IN`; stable codes/paths are public contract | Audit §4E; `core/src/errors.ts`, `diagnostics.ts`, parser/validator/resolver boundaries |
| `CORE-DIAG-002` | `🌗 partial` | `partial` | `verified-local-bounded` + aggregation tests | `IN`; core owns deterministic aggregation; broader fault coverage remains | Audit §4E; `core/src/diagnostics.ts`, `core/src/__tests__/diagnostics.test.ts` |
| `CORE-ERROR-003` | `🌗 partial` | `partial` | `verified-local-bounded`; catalog normalization and runtime codes pass covered tests, exhaustive internal inventory remains open | `IN`; distinct actionable error taxonomy is required | Audit §4E; `core/src/types.ts`, `core/src/errors.ts`, evaluator/raw throw sites |

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
| `CORE-INT-003` | `✔️ implemented` | `implemented` | `verified-local` + 23-fixture / 290-check conformance | `IN`; fixture provenance is evidence, not implementation substitute | Audit §4F; `scripts/run-conformance-fixtures.mjs`, `fixtures/manifest.json` |
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
| `CORE-CONSTRAINT-002` | `relgeo/core` + geometry | `06-error-model.md`; constraints spec | `v05-runtime-align-violation` plus focused test asserts path/order, retained scene, and repeat determinism | `🌗 partial-local`; violation type lacks several normative fields; Audit §4E |
| `CORE-DIAG-001` | `relgeo/core` | `06-error-model.md`; catalog §4.1 shared fields | Structured-error/parser/validator/resolver/runtime/constraint tests assert code, message, phase, severity, path/context/range rules | `🌗 verified-local-bounded`; normalization exists, raw/source-range coverage bounded; Audit §4E |
| `CORE-DIAG-002` | `relgeo/core` | `05-semantic-guarantees.md`, `06-error-model.md` | `collectDiagnostics` tests assert phase→range→path→code→message order, dedupe, truncation, repeatability, and strict equivalence | `🌗 verified-local-bounded`; broader fault coverage open; Audit §4E |
| `CORE-ERROR-003` | `relgeo/core` | `06-error-model.md`; fixture IDs 13, 17–20, 22 | Covered emitted-code/type inventory, raw-throw normalization, and runtime fixtures prove distinct actionable codes | `🌗 verified-local-bounded`; remaining internal/non-prefixed throw inventory and published parity stay open; Audit §4E |

Frozen global rules: public diagnostics require `code`, `message`, `phase`, and
`severity`; document-origin failures require a canonical path. Aggregated
diagnostics sort by phase, source position, path, code, message, deduplicate,
then truncate. Collection ordering follows semantic source order and stable
identity. Constraint failures retain the resolved scene and do not mutate
geometry. These rules do not promote any row to `✔️`.

### 3.2 Current local consumer verification

The current workspace verification is local and bounded to the TypeScript
workspace. The following commands passed on 2026-11-03:

| Command | Result | Boundary checked |
| --- | --- | --- |
| `TMPDIR=/private/tmp pnpm --dir core exec vitest run src/__tests__/semantic_contract_fixtures.test.ts` | 1 file / 8 tests passed | Focused reference, constraint, result-mode, empty-collection, and incomplete-source contract assertions |
| `TMPDIR=/private/tmp pnpm conformance:fixtures` | 290 passed / 0 failed across 23 fixtures | Shared fixture manifest and core/language-service/CLI/renderer/remark consumer projections |
| `TMPDIR=/private/tmp pnpm test` | Workspace suites passed: core 450, language-service 75, CLI 23, renderer-svg 88, remark-relgeo 7, remark-relgeo-hl 5, playground 102, geometry 75 | Current TypeScript consumer test surfaces |
| `pnpm --dir core run lint && pnpm run language-spec:check` | Passed; 34 specification documents checked | Core lint and language-spec contract consistency |
| `git diff --check && git -C core diff --check` | Passed | Whitespace integrity for root and Core changes |

The local process used Node `22.23.2`; the repository engine requirement is
Node `>=24`, so this is not canonical toolchain evidence. No new npm release,
registry/public-artifact, current CI, browser E2E, Flutter host, or deployment
claim is made. The earlier SuClos reconnect/network failure is orchestration
evidence only and does not establish target parity or target failure.

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
