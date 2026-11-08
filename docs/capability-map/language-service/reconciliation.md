# Language-Service Expected-versus-Observed Reconciliation

> **Coverage statement — 2026-11-08.** Dokumen ini adalah join satu-per-satu
> antara seluruh 33 ID pada katalog expected dan baris observasi pada audit
> implementasi current. Ia tidak menambah capability baru, tidak menghapus
> expected row, dan tidak mengubah capability absent menjadi unverified hanya
> karena evidence delivery belum tersedia.

Tanggal rekonsiliasi: 2026-11-07
Owner: relgeo/language-service  
Expected source: [language-service expected capability catalog](./expected-capability-catalog.md)  
Observed source: [language-service implementation audit evidence](./implementation-audit.md)
Policy sources: [maturation master plan](../../MATURATION-MASTER-PLAN.md), [compatibility matrix](../../compatibility-matrix.json)

Audit revisions joined in this reconciliation: workspace evidence capture
`b3d9a4a798cdf63af1ec86b45a05edef7c133a86`, language-service
`ae23ede99b59498a72b5838c06be6a26cf5ece82`, Playground
`c263920146a7ba28fe76561df25d1174b289663b`, and Markdown highlighter
`6d109a96a265f64b8934e13e4d9e1e1ae1e8b028`. Current local evidence includes
102 language-service tests with lint/build, 677/677 shared conformance
assertions across 33 fixtures, 18 remark-relgeo tests, 10 remark-relgeo-hl
Vitest tests plus one package-boundary test, 119 Playground tests with
lint/build, and 40 CLI tests. Direct Dart MCP verification passes 45 tests
with analytics suppressed. Node 24, registry, current CI, browser/public, and native-host
evidence remain separate `not verified` limitations.

The P0/P1 implementation intake is recorded in the
[implementation-gap backlog triage](./implementation-gap-backlog.md#triage-p0p1--2026-11-04).
It is an execution classification only; the reconciliation result,
implementation status, evidence status, and scope decision below remain the
authority for capability state.

Current audit-entry refresh: language-service and Playground test/lint/build
commands were rerun locally with results of 102/102 and 119/119; Markdown
consumers pass 18/18 and 10/10 plus one package-boundary test, CLI passes 40/40,
the workspace conformance runner passes 677/677 assertions across 33 fixtures,
and the consumer contract checker passes 120 assertions. The implementation task repaired the local
`getSchema()`/README-version mismatch and added bounded diagnostic aggregation,
schema drift, completion, range, identity, navigation, and measured analysis
fallback evidence; the status join below records those bounded changes without
closing their remaining broader gaps.

Protocol vocabulary refresh: `language-service/src/protocol.ts` now freezes
protocol `0.2`, DSL/spec `0.5` metadata, UTF-16 half-open ranges, explicit
validation readiness, document/version/request identity, optional source
revision/provenance, typed DTOs for diagnostics/validation/completion/hover/
metadata/navigation/analysis, and the exact stale-result guard. This is a
contract and local serialization evidence; it does not promote absent
navigation or host-owned session storage to implemented. The Playground worker
now also carries the frozen analysis envelope and exact identity guard; this
closes the local `LS-INCR-002` and `LS-REC-001` adapter boundaries while
`LS-CONS-001` is closed at the local Playground consumer boundary; browser and
public evidence remain separate follow-up boundaries.

## Consumer-boundary verification refresh — 2026-11-07

The current downstream checks preserve the separation between implementation,
local consumer evidence, and external delivery evidence:

| Boundary | Result | Evidence class / limitation |
| --- | --- | --- |
| Language Service package | PASS — 102 tests, lint, and CJS/ESM/DTS build | verified-local; Node 22 checkout, while repository metadata requests Node 24+ |
| Playground worker/consumer | PASS — 119 tests, lint, production build, and build provenance | local consumer evidence; browser/public route not verified |
| Markdown consumers | PASS — remark-relgeo 18 tests/build and remark-relgeo-hl 10 Vitest plus package-boundary test/build | local consumer evidence; registry/public install not verified |
| CLI consumer | PASS — 40 tests and build | local consumer evidence |
| MCP direct contract | PASS — 45 direct Dart tests with analytics suppressed | Flutter wrapper/native host remains environment-limited |
| Shared conformance | PASS — 677/677 assertions across 33 fixtures | local conformance; does not prove held MCP semantic adapter parity |
| Package artifact | PASS — `npm pack --dry-run --json` reports 9 files for `@relgeo/language-service@0.5.1` | local artifact shape; publish/registry boundary not verified |
| Cross-repo integration runner | ENVIRONMENT UNAVAILABLE — `node scripts/run-integration-gate.mjs --local` exits 2 before stages because Node 22.23.2 is below the declared Node 24 minimum | limitation only; not a parity failure |

The current required workspace gate capture is also recorded in the
[implementation audit](./implementation-audit.md#workspace-gate-evidence--2026-11-08):
`pnpm run verify:baseline:strict` exited 1 because the implementation
submodules are intentionally dirty, `pnpm run compatibility:check` exited 0,
`pnpm run conformance:fixtures` exited 0 with 677 assertions across 33
fixtures, and both local/public integration commands exited 2 before stages
because the host is Node 22.23.2 while the contract requires Node 24+.

Canonical CI, public registry, browser/public Playground, native Flutter, and
live-client evidence remain separate. The local consumer passes close the
declared local boundary, but do not claim registry/public delivery, browser
E2E, native-host interoperability, or the held semantic MCP and parser/index
follow-ups.

## Aturan rekonsiliasi

Setiap expected ID wajib muncul tepat satu kali pada tabel hasil. Audit trace
menunjuk baris ID yang menjadi evidence observed. Status pada tiga kolom berikut
tidak boleh digabung:

| Dimensi | Arti |
| --- | --- |
| Reconciliation result | Hasil join yang mudah dipindai: ✔️, 🌗, ⚠️, ❌, ⏸️, atau ➖. |
| Implementation status | Keberadaan capability pada boundary pemiliknya: implemented, partial, absent, broken, deferred, atau not applicable. |
| Evidence status | Kekuatan pemeriksaan: verified-local, local consumer evidence, contract-only, mismatch-confirmed, atau limitation seperti browser/registry not verified. |
| Scope decision | Apakah capability in scope, boundary-only, held/deferred, atau dimiliki host/consumer lain. |

Makna penting:

- ❌ absent berarti capability expected pada boundary yang dipilih tidak
  ditemukan dalam implementasi. Status ini tetap eksplisit meskipun tests,
  registry, atau browser evidence belum tersedia.
- ? unverified hanya dipakai untuk evidence yang belum dapat diperiksa; ia
  bukan pengganti ❌.
- ➖ not-applicable hanya dipakai ketika katalog memang menetapkan owner
  capability pada host/consumer lain. Ini bukan cara untuk menyamarkan
  capability language-service yang absent.
- ⏸️ deferred berarti keputusan roadmap menahan delivery pada boundary itu;
  expected row tetap dipertahankan.

## Rekonsiliasi 33 expected IDs

| ID | Reconciliation result | Implementation status | Evidence status | Scope / owner decision | Audit trace |
| --- | --- | --- | --- | --- | --- |
| LS-DIAG-001 | ✔️ implemented | implemented | verified-local | In scope; language-service projects core diagnostic envelope. | [audit LS-DIAG-001](./archive/implementation-audit-legacy.md#ls-diag-001) |
| LS-DIAG-002 | ⏸️ deferred | deferred | verified-local bounded implementation; core dependency decision | Bounded diagnostic aggregation is closed; broad incomplete-input recovery is held until core parser recovery is normative. | [current audit](./implementation-audit.md#final-green-surface-audit--2026-11-08) |
| LS-DIAG-003 | ✔️ implemented | implemented | verified-local | In scope; semantic truth remains core/spec-owned. | [audit LS-DIAG-003](./archive/implementation-audit-legacy.md#ls-diag-003) |
| LS-DIAG-004 | ✔️ implemented | implemented | verified-local | Semantic opt-in projects core post-resolve constraint diagnostics with phase, severity, range fallback, and provenance; host presentation remains separate. | [audit LS-DIAG-004](./implementation-audit.md#selected-capability-findings) |
| LS-VAL-001 | ✔️ implemented | implemented | verified-local | In scope; core validator is the semantic authority. | [audit LS-VAL-001](./archive/implementation-audit-legacy.md#ls-val-001) |
| LS-VAL-002 | ✔️ implemented | implemented | verified-local | Explicit structural/semantic/resolve-ready validation targets and no-overclaim tests close the local boundary; core remains semantic authority. | [current audit](./implementation-audit.md#final-green-surface-audit--2026-11-08) |
| LS-SCHEMA-001 | ✔️ implemented | implemented | verified-local | In scope; published schema export is locally verified. | [audit LS-SCHEMA-001](./archive/implementation-audit-legacy.md#ls-schema-001) |
| LS-SCHEMA-002 | ✔️ implemented | implemented | verified-local | Generated checker derives active root/object/field vocabulary from normative spec files; editor-only compatibility aliases remain explicit. | [current audit](./implementation-audit.md#selected-capability-findings) |
| LS-TOKEN-001 | ✔️ implemented | implemented | verified-local | In scope; custom token model is available to consumers. | [audit LS-TOKEN-001](./archive/implementation-audit-legacy.md#ls-token-001) |
| LS-COMP-001 | ✔️ implemented | implemented | verified-local | In scope; context completion is exposed through the service API. | [audit LS-COMP-001](./archive/implementation-audit-legacy.md#ls-comp-001) |
| LS-COMP-002 | ⏸️ deferred | deferred | verified-local bounded implementation; core dependency decision | Bounded object-reference/context completion is closed; full AST/semantic-index completion is held until core supplies an index contract. | [current audit](./implementation-audit.md#final-green-surface-audit--2026-11-08) |
| LS-COMP-003 | ⏸️ deferred | deferred | verified-local bounded implementation; parser dependency decision | Supported partial contexts are closed; exhaustive parser-error completion is held at the parser recovery boundary. | [current audit](./implementation-audit.md#final-green-surface-audit--2026-11-08) |
| LS-HOVER-001 | ✔️ implemented | implemented | verified-local | Bounded syntax/type/enum/object and incomplete-source hover explanations are tested; unknown symbols return no-result. | [audit LS-HOVER-001](./implementation-audit.md#selected-capability-findings) |
| LS-HOVER-002 | ✔️ implemented | implemented | verified-local | Bounded metadata/provenance, exact ranges, target identity, and incomplete-source behavior are tested; resolved geometry values remain core-owned. | [current audit](./implementation-audit.md#final-green-surface-audit--2026-11-08) |
| LS-RANGE-001 | ✔️ implemented | implemented | verified-local | Diagnostic/token/completion/hover/metadata/navigation ranges and malformed-range normalization are tested in UTF-16 half-open form. | [current audit](./implementation-audit.md#selected-capability-findings) |
| LS-RANGE-002 | ➖ not-applicable | not applicable | verified-local at service boundary | Navigation result is implemented and tested; source-jump UI is explicitly host-owned and tracked in the Playground matrix. | [current audit](./implementation-audit.md#final-green-surface-audit--2026-11-08) |
| LS-DOC-001 | ✔️ implemented | implemented | verified-local | In scope; editor-agnostic library boundary is present. | [audit LS-DOC-001](./archive/implementation-audit-legacy.md#ls-doc-001) |
| LS-DOC-002 | ✔️ implemented | implemented | verified-local | In scope; `LanguageServiceDocumentManager` closes package lifecycle while host persistence remains separate. | [current audit](./implementation-audit.md#full-expected-id-coverage-report--2026-11-07) |
| LS-DOC-003 | ➖ not-applicable | not applicable | verified-local at host boundary | Boundary-only; active document identity, dirty state, and session belong to host/MCP/Playground. | [audit LS-DOC-003](./archive/implementation-audit-legacy.md#ls-doc-003) |
| LS-INCR-001 | ⏸️ deferred | deferred | verified-local bounded synchronization; dependency unavailable | Ranged document synchronization is implemented; semantic dependency-bounded analysis is held until core exposes a stable dependency/index contract. | [current audit](./implementation-audit.md#full-expected-id-coverage-report--2026-11-07) |
| LS-INCR-002 | ✔️ implemented | implemented | verified-local bounded implementation | Service identity and exact Playground worker ordering guard are covered by serialization and wrong-identity fixtures; browser/public delivery remains separate. | [current audit](./implementation-audit.md#selected-capability-findings) |
| LS-VERS-001 | ✔️ implemented | implemented | verified-local | In scope; active/legacy/future acceptance vocabulary is locally tested. | [audit LS-VERS-001](./archive/implementation-audit-legacy.md#ls-vers-001) |
| LS-VERS-002 | ✔️ implemented | implemented | verified-local cross-surface contract evidence | Protocol, Playground, MCP, canonical fixture, and consumer checker close local version/revision/provenance propagation; public/native delivery remains separate evidence. | [current audit](./implementation-audit.md#final-green-surface-audit--2026-11-08) |
| LS-PROTO-001 | ✔️ implemented | implemented | verified-local | Typed result families now include schema/tokens plus lifecycle responses; official LSP server/transport remains out of scope. | [protocol contract](./protocol-contract.md) |
| LS-PROTO-002 | ⏸️ deferred | deferred | verified-local safe serialization; MCP adapter decision | Local JSON/DTO identity and provenance safety is closed; semantic MCP adapter and packaged/cross-host transport are held as separate scope. | [current audit](./implementation-audit.md#final-green-surface-audit--2026-11-08) |
| LS-REC-001 | ✔️ implemented | implemented | verified-local | Invalid/partial/recovered/stable states are propagated through the worker analysis envelope; browser presentation and host-owned preview retention remain separate. | [current audit](./implementation-audit.md#selected-capability-findings) |
| LS-REC-002 | ➖ not-applicable | not applicable | verified-local at consumer boundary | Boundary-only; retaining last valid preview is a Playground/host responsibility. | [audit LS-REC-002](./archive/implementation-audit-legacy.md#ls-rec-002) |
| LS-REC-003 | ⏸️ deferred | deferred | verified-local boundary evidence; normative decision pending | Existing phase/origin fields are preserved; one cross-surface taxonomy is held until spec/core/host owners approve it. | [current audit](./implementation-audit.md#final-green-surface-audit--2026-11-08) |
| LS-CONS-001 | ✔️ implemented | implemented | verified-local; browser/public not verified | In scope as local consumer delivery; exact editor/worker identity and analysis-envelope paths are tested. Browser/public execution remains an external evidence follow-up, not an open source gap. | [current audit](./implementation-audit.md#selected-capability-findings) |
| LS-CONS-002 | ✔️ implemented | implemented | verified-local consumer evidence | Markdown normal path and injected service-failure fallback are deterministic and tested under tolerant/strict policy; registry/public delivery remains separate. | [current audit](./implementation-audit.md#final-green-surface-audit--2026-11-08) |
| LS-CONS-003 | ⏸️ deferred | deferred | verified-local MCP contract; adapter scope decision | Typed MCP validation/identity/provenance boundary is closed; full core-backed semantic producer is held for an explicit MCP adapter tranche. | [current audit](./implementation-audit.md#final-green-surface-audit--2026-11-08) |
| LS-CONS-004 | ⏸️ deferred | deferred | verified-local host DTO; native/client unavailable | Active-document read/guarded edit contract is locally covered; live Desktop client and packaged native host are outside this local closure boundary. | [current audit](./implementation-audit.md#final-green-surface-audit--2026-11-08) |
| LS-CONS-005 | ✔️ implemented | implemented | verified-local; registry/current CI not verified | In scope; README/package/API compatibility is repaired locally, with public artifact delivery still unverified. | [current audit](./implementation-audit.md#selected-capability-findings) |

## Coverage validation

| Check | Result |
| --- | --- |
| Expected catalog rows | 33 |
| Reconciliation rows | 33 |
| Expected IDs missing from reconciliation | 0 |
| Observed-only IDs added to reconciliation | 0 |
| Duplicate reconciliation IDs | 0 |
| Result counts | 22 implemented, 0 partial, 0 absent, 0 broken, 8 deferred, 3 not-applicable |
| Evidence/scope columns present on every row | Yes |
| Audit trace present on every row | Yes |

Mechanical validation performed after the audit refresh confirms that every row
has exactly one allowed reconciliation result, one implementation status, one
evidence status, a scope/owner decision, and an audit trace. The status matrix
matches the reconciliation result for all 33 IDs.

The result-count total is 33: 22 implemented, 0 partial, 0 absent, 0 broken,
8 explicitly deferred, and 3 host-boundary rows. Deferred rows retain their
expected IDs and candidate tasks; they are held by a named parser/core/MCP/
desktop decision rather than relabeled as implemented. LS-RANGE-002 is ➖
because the service navigation result is implemented while the source-jump UI
belongs to the host. LS-DOC-003 and LS-REC-002 remain ➖ because their catalog
scope assigns ownership to the host/consumer boundary.

## Findings kept separate from implementation status

| Finding | Dimension affected | Reconciliation treatment |
| --- | --- | --- |
| Node 22 was used while the root engine asks for Node 24 or newer; registry, current CI, public Playground, and native accessibility were not run. | Evidence | Limitation on evidence only; it does not convert a locally observed ❌ into ?, and it does not prove delivery parity. |
| Active-document identity, dirty state, and last-valid preview retention are host-owned; MCP/desktop integration is now partial while semantic-service/client evidence remains open. | Scope | ➖ for LS-DOC-003 and LS-REC-002; `🌗` for LS-CONS-003 and LS-CONS-004. |
| Runtime post-resolve diagnostics are available through the language-service semantic opt-in and core/Playground paths. | Implementation versus contract decision | LS-DIAG-004 is locally implemented; host runtime presentation remains a consumer boundary. |
| Markdown normal highlighting passes, but service-failure source-preserving fallback is not implemented. | Consumer implementation | LS-CONS-002 stays 🌗 partial; normal-path tests do not close the failure-path gap. |
| README/package/API compatibility was repaired locally: README is `0.5.1`, `getSchema()` is implemented, and the regression test passes. | Contract/documentation integrity | LS-CONS-005 is ✔️ at the local source boundary; packed/registry/public delivery remains not verified. |

## Handoff

True implementation gaps that require implementation or product decisions:

- 🌗 LS-RANGE-002 — host source-jump consumption remains open after the minimal service navigation path.
- 🌗 LS-INCR-001 — replace the measured full-document semantic fallback only after core exposes incremental dependency semantics.
- 🌗 LS-VERS-002 — carry the frozen version/revision/provenance envelope through every remaining producer and consumer adapter.
- ✔️ LS-CONS-005 — local API/version contract repair is verified; retain public-artifact verification as a release-boundary follow-up.
- 🌗 rows remain open partial work even when their local evidence is verified.
- ⏸️ rows remain expected and traceable, but delivery is held by the stated
  MCP/desktop roadmap boundary.

This reconciliation records the bounded implementation evidence and status
changes above. Partial, absent, deferred, host-owned, and delivery-boundary
gaps remain explicit and are not closed by documentation alone.
