# Language-Service Expected-versus-Observed Reconciliation

> **Coverage statement — 2026-11-07.** Dokumen ini adalah join satu-per-satu
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
91 language-service tests with lint/build, 298/298 shared conformance
assertions, 9 remark-relgeo tests, 6 remark-relgeo-hl tests, 112 Playground
tests with lint/build, and 36 CLI tests. MCP's earlier 34-test local snapshot
remains historical support evidence; the current Dart rerun was environment
unavailable. Node 24, registry, current CI, browser/public, and native-host
evidence remain separate `not verified` limitations.

The P0/P1 implementation intake is recorded in the
[implementation-gap backlog triage](./implementation-gap-backlog.md#triage-p0p1--2026-11-04).
It is an execution classification only; the reconciliation result,
implementation status, evidence status, and scope decision below remain the
authority for capability state.

Current audit-entry refresh: language-service and Playground test/lint/build
commands were rerun locally with results of 91/91 and 112/112; Markdown
consumers pass 9/9 and 6/6, CLI passes 36/36, the workspace conformance runner
passes 298/298 assertions across 23 fixtures, and the active-spec drift checker
reports zero root/object differences. The implementation task repaired the local
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
| Language Service package | PASS — 91 tests, lint, and CJS/ESM/DTS build | verified-local; Node 22 checkout, while repository metadata requests Node 24+ |
| Playground worker/consumer | PASS — 112 tests, lint, production build, and build provenance | local consumer evidence; browser/public route not verified |
| Markdown consumers | PASS — remark-relgeo 9 tests/build and remark-relgeo-hl 6 tests/build | local consumer evidence; registry/public install not verified |
| CLI consumer | PASS — 36 tests | local consumer evidence |
| Shared conformance | PASS — 298/298 assertions across 23 fixtures | local conformance; does not prove MCP semantic adapter parity |
| Package artifact | PASS — `npm pack --dry-run --json` reports 9 files for `@relgeo/language-service@0.5.1` | local artifact shape; publish/registry boundary not verified |
| Cross-repo integration runner | ENVIRONMENT UNAVAILABLE — `node scripts/run-integration-gate.mjs --local` exits 2 before stages because Node 22.23.2 is below the declared Node 24 minimum | limitation only; not a parity failure |

Canonical CI, public registry, browser/public Playground, native Flutter, and
live-client evidence remain separate. The local consumer passes do not change
the reconciliation status of partial rows such as LS-CONS-002 through
LS-CONS-004, nor do they close the remaining semantic MCP or host-boundary
gaps.

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
| LS-DIAG-002 | 🌗 partial | partial | verified-local bounded implementation | In scope; independent diagnostic aggregation is covered, broad incomplete-input recovery remains open. | [current audit](./implementation-audit.md#selected-capability-findings) |
| LS-DIAG-003 | ✔️ implemented | implemented | verified-local | In scope; semantic truth remains core/spec-owned. | [audit LS-DIAG-003](./archive/implementation-audit-legacy.md#ls-diag-003) |
| LS-DIAG-004 | 🌗 partial | partial | verified-local | In scope as projection; post-resolve runtime path remains separate from getDiagnostics. | [audit LS-DIAG-004](./archive/implementation-audit-legacy.md#ls-diag-004) |
| LS-VAL-001 | ✔️ implemented | implemented | verified-local | In scope; core validator is the semantic authority. | [audit LS-VAL-001](./archive/implementation-audit-legacy.md#ls-val-001) |
| LS-VAL-002 | 🌗 partial | partial | verified-local | In scope as shared validation boundary; service does not itself run full resolve. | [audit LS-VAL-002](./archive/implementation-audit-legacy.md#ls-val-002) |
| LS-SCHEMA-001 | ✔️ implemented | implemented | verified-local | In scope; published schema export is locally verified. | [audit LS-SCHEMA-001](./archive/implementation-audit-legacy.md#ls-schema-001) |
| LS-SCHEMA-002 | 🌗 partial | partial | verified-local bounded implementation | In scope; deterministic active-vocabulary drift checking is covered, generated all-spec comparison remains open. | [current audit](./implementation-audit.md#selected-capability-findings) |
| LS-TOKEN-001 | ✔️ implemented | implemented | verified-local | In scope; custom token model is available to consumers. | [audit LS-TOKEN-001](./archive/implementation-audit-legacy.md#ls-token-001) |
| LS-COMP-001 | ✔️ implemented | implemented | verified-local | In scope; context completion is exposed through the service API. | [audit LS-COMP-001](./archive/implementation-audit-legacy.md#ls-comp-001) |
| LS-COMP-002 | 🌗 partial | partial | verified-local bounded implementation | In scope; object-reference/context completion is covered, full AST/semantic-index context remains open. | [current audit](./implementation-audit.md#selected-capability-findings) |
| LS-COMP-003 | 🌗 partial | partial | verified-local bounded implementation | In scope; selected partial/error contexts are covered, all parser-error shapes remain open. | [current audit](./implementation-audit.md#selected-capability-findings) |
| LS-HOVER-001 | 🌗 partial | partial | verified-local | In scope; hover exists but syntax/documentation catalog coverage is incomplete. | [audit LS-HOVER-001](./archive/implementation-audit-legacy.md#ls-hover-001) |
| LS-HOVER-002 | 🌗 partial | partial | verified-local | In scope; metadata lacks complete provenance and semantic inspection shape. | [audit LS-HOVER-002](./archive/implementation-audit-legacy.md#ls-hover-002) |
| LS-RANGE-001 | 🌗 partial | partial | verified-local bounded implementation | In scope; diagnostic/token/completion/hover ranges are covered, metadata/semantic-reference ranges remain open. | [current audit](./implementation-audit.md#selected-capability-findings) |
| LS-RANGE-002 | 🌗 partial | partial | verified-local bounded implementation | `analyzeNavigation()` supplies one object definition/reference relation with stable document identity and exact UTF-16 ranges; host source-jump action remains open. | [current audit](./implementation-audit.md#selected-capability-findings) |
| LS-DOC-001 | ✔️ implemented | implemented | verified-local | In scope; editor-agnostic library boundary is present. | [audit LS-DOC-001](./archive/implementation-audit-legacy.md#ls-doc-001) |
| LS-DOC-002 | 🌗 partial | partial | verified-local | In scope; update-to-analysis flow exists but no explicit service session lifecycle. | [audit LS-DOC-002](./archive/implementation-audit-legacy.md#ls-doc-002) |
| LS-DOC-003 | ➖ not-applicable | not applicable | verified-local at host boundary | Boundary-only; active document identity, dirty state, and session belong to host/MCP/Playground. | [audit LS-DOC-003](./archive/implementation-audit-legacy.md#ls-doc-003) |
| LS-INCR-001 | 🌗 partial | partial | verified-local bounded implementation | Local edits produce a measured changed range/line budget, while analysis explicitly reports a full-document semantic fallback because core dependencies are not incremental. | [current audit](./implementation-audit.md#selected-capability-findings) |
| LS-INCR-002 | ✔️ implemented | implemented | verified-local bounded implementation | Service identity and exact Playground worker ordering guard are covered by serialization and wrong-identity fixtures; browser/public delivery remains separate. | [current audit](./implementation-audit.md#selected-capability-findings) |
| LS-VERS-001 | ✔️ implemented | implemented | verified-local | In scope; active/legacy/future acceptance vocabulary is locally tested. | [audit LS-VERS-001](./archive/implementation-audit-legacy.md#ls-vers-001) |
| LS-VERS-002 | 🌗 partial | partial | verified-local contract evidence | Shared result envelope now carries protocol/spec version and optional source revision/provenance; remaining producers/consumer integration still require closure. | [protocol contract](./protocol-contract.md) |
| LS-PROTO-001 | 🌗 partial | partial | verified-local | Unified DTO envelope and family adapters are frozen; no official LSP server/transport and not every producer is implemented. | [protocol contract](./protocol-contract.md) |
| LS-PROTO-002 | 🌗 partial | partial | verified-local + MCP local runtime | MCP local transport and permission boundary are implemented; semantic DTO round-trip and packaged/cross-host evidence remain open. | [audit LS-PROTO-002](./archive/implementation-audit-legacy.md#ls-proto-002) |
| LS-REC-001 | ✔️ implemented | implemented | verified-local | Invalid/partial/recovered/stable states are propagated through the worker analysis envelope; browser presentation and host-owned preview retention remain separate. | [current audit](./implementation-audit.md#selected-capability-findings) |
| LS-REC-002 | ➖ not-applicable | not applicable | verified-local at consumer boundary | Boundary-only; retaining last valid preview is a Playground/host responsibility. | [audit LS-REC-002](./archive/implementation-audit-legacy.md#ls-rec-002) |
| LS-REC-003 | 🌗 partial | partial | verified-local | Boundary integration; language and storage/share/runtime error origins are not one canonical taxonomy. | [audit LS-REC-003](./archive/implementation-audit-legacy.md#ls-rec-003) |
| LS-CONS-001 | ✔️ implemented | implemented | verified-local; browser/public not verified | In scope as local consumer delivery; exact editor/worker identity and analysis-envelope paths are tested. Browser/public execution remains an external evidence follow-up, not an open source gap. | [current audit](./implementation-audit.md#selected-capability-findings) |
| LS-CONS-002 | 🌗 partial | partial | local verified; public/registry not verified | In scope as Markdown consumer; normal path works, failure-preserving fallback is incomplete. | [audit LS-CONS-002](./archive/implementation-audit-legacy.md#ls-cons-002) |
| LS-CONS-003 | 🌗 partial | partial | MCP local runtime; semantic integration incomplete | Full-spec lookup/resources are callable; core-backed validation, completion, diagnostics mapping, and rendering are not integrated. | [current audit](./implementation-audit.md#selected-capability-findings) |
| LS-CONS-004 | 🌗 partial | partial | local Flutter/MCP integration; live client not verified | Active source/revision/dirty state and guarded edit are supported; ChatGPT Desktop write round-trip and language-service session API remain open. | [current audit](./implementation-audit.md#selected-capability-findings) |
| LS-CONS-005 | ✔️ implemented | implemented | verified-local; registry/current CI not verified | In scope; README/package/API compatibility is repaired locally, with public artifact delivery still unverified. | [current audit](./implementation-audit.md#selected-capability-findings) |

## Coverage validation

| Check | Result |
| --- | --- |
| Expected catalog rows | 33 |
| Reconciliation rows | 33 |
| Expected IDs missing from reconciliation | 0 |
| Observed-only IDs added to reconciliation | 0 |
| Duplicate reconciliation IDs | 0 |
| Result counts | 10 implemented, 21 partial, 0 absent, 0 broken, 0 deferred, 2 not-applicable |
| Evidence/scope columns present on every row | Yes |
| Audit trace present on every row | Yes |

Mechanical validation performed after the audit refresh confirms that every row
has exactly one allowed reconciliation result, one implementation status, one
evidence status, a scope/owner decision, and an audit trace. The status matrix
matches the reconciliation result for all 33 IDs.

The result-count total is 33. LS-RANGE-002 and LS-INCR-001 are explicit 🌗
bounded rows; they are not promoted to complete because host navigation and
core incremental dependency semantics remain open. LS-VERS-002 is partial at
the protocol boundary because the vocabulary is implemented, while remaining
producer and consumer coverage is still open. LS-DOC-003 and LS-REC-002 are ➖
only because their catalog scope decision assigns ownership to the
host/consumer boundary.

## Findings kept separate from implementation status

| Finding | Dimension affected | Reconciliation treatment |
| --- | --- | --- |
| Node 22 was used while the root engine asks for Node 24 or newer; registry, current CI, public Playground, and native accessibility were not run. | Evidence | Limitation on evidence only; it does not convert a locally observed ❌ into ?, and it does not prove delivery parity. |
| Active-document identity, dirty state, and last-valid preview retention are host-owned; MCP/desktop integration is now partial while semantic-service/client evidence remains open. | Scope | ➖ for LS-DOC-003 and LS-REC-002; `🌗` for LS-CONS-003 and LS-CONS-004. |
| Runtime post-resolve diagnostics are available on core/Playground paths but are not part of getDiagnostics. | Implementation versus contract decision | LS-DIAG-004 stays 🌗 partial; adding or keeping a separate runtime-diagnostic API is a maintainer decision. |
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
