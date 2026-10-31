# Language-Service Expected-versus-Observed Reconciliation

> **Coverage statement — 2026-10-30.** Dokumen ini adalah join satu-per-satu
> antara seluruh 33 ID pada katalog expected dan baris observasi pada audit
> implementasi current. Ia tidak menambah capability baru, tidak menghapus
> expected row, dan tidak mengubah capability absent menjadi unverified hanya
> karena evidence delivery belum tersedia.

Tanggal rekonsiliasi: 2026-10-30  
Owner: relgeo/language-service  
Expected source: [language-service expected capability catalog](./expected-capability-catalog.md)  
Observed source: [language-service implementation audit evidence](./implementation-audit.md)
Policy sources: [maturation master plan](../../MATURATION-MASTER-PLAN.md), [compatibility matrix](../../compatibility-matrix.json)

Audit revisions joined in this reconciliation: workspace
`1231dadb5ff6902593cb81665f76699bf0548bbb`, language-service
`39c06dd8505d480672b0953d523f3675a7f30075`, Playground
`59a42ae925cf0c21541bc19ccac39f5061b35439`, and Markdown highlighter
`507ad18fe1b8c91eb3a48e365b5290cd02b049b8`. Local evidence was refreshed with
75 language-service tests, lint, build, 260/260 shared fixtures, 3 Markdown
tests, and 93 Playground tests; Node 24, registry, current CI, browser/public,
and native-host evidence remain separate `not verified` limitations.

Current audit-entry refresh: the language-service, Markdown, and Playground
test commands were rerun locally with results of 75/75, 3/3, and 93/93; the
workspace conformance runner also passes 260/260 checks across 20 fixtures. The
language-service type-check and ESM/CJS/DTS build also pass. The implementation
task repaired the local `getSchema()`/README-version mismatch and added bounded
diagnostic aggregation, schema drift, completion, range, and identity evidence;
the status join below records those bounded changes without closing their
remaining broader gaps.

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
| LS-RANGE-002 | ❌ absent | absent | verified-local | In scope at the language-service result boundary; host source jump does not supply semantic navigation API. | [audit LS-RANGE-002](./archive/implementation-audit-legacy.md#ls-range-002) |
| LS-DOC-001 | ✔️ implemented | implemented | verified-local | In scope; editor-agnostic library boundary is present. | [audit LS-DOC-001](./archive/implementation-audit-legacy.md#ls-doc-001) |
| LS-DOC-002 | 🌗 partial | partial | verified-local | In scope; update-to-analysis flow exists but no explicit service session lifecycle. | [audit LS-DOC-002](./archive/implementation-audit-legacy.md#ls-doc-002) |
| LS-DOC-003 | ➖ not-applicable | not applicable | verified-local at host boundary | Boundary-only; active document identity, dirty state, and session belong to host/MCP/Playground. | [audit LS-DOC-003](./archive/implementation-audit-legacy.md#ls-doc-003) |
| LS-INCR-001 | ❌ absent | absent | verified-local | In scope; no incremental parser, cache, edit-range API, or retained analysis state was found. | [audit LS-INCR-001](./archive/implementation-audit-legacy.md#ls-incr-001) |
| LS-INCR-002 | 🌗 partial | partial | verified-local bounded implementation | Boundary integration; service identity is serializable, while Playground still owns ordering enforcement. | [current audit](./implementation-audit.md#selected-capability-findings) |
| LS-VERS-001 | ✔️ implemented | implemented | verified-local | In scope; active/legacy/future acceptance vocabulary is locally tested. | [audit LS-VERS-001](./archive/implementation-audit-legacy.md#ls-vers-001) |
| LS-VERS-002 | ❌ absent | absent | verified-local | In scope; service results do not carry spec version, revision, source URL, or provenance. | [audit LS-VERS-002](./archive/implementation-audit-legacy.md#ls-vers-002) |
| LS-PROTO-001 | 🌗 partial | partial | verified-local | In scope as typed library protocol; no unified DTO or official LSP server/transport. | [audit LS-PROTO-001](./archive/implementation-audit-legacy.md#ls-proto-001) |
| LS-PROTO-002 | 🌗 partial | partial | verified-local + MCP local runtime | MCP local transport and permission boundary are implemented; semantic DTO round-trip and packaged/cross-host evidence remain open. | [audit LS-PROTO-002](./archive/implementation-audit-legacy.md#ls-proto-002) |
| LS-REC-001 | 🌗 partial | partial | verified-local | In scope for actionable analysis results; host recovery state/action is incomplete. | [audit LS-REC-001](./archive/implementation-audit-legacy.md#ls-rec-001) |
| LS-REC-002 | ➖ not-applicable | not applicable | verified-local at consumer boundary | Boundary-only; retaining last valid preview is a Playground/host responsibility. | [audit LS-REC-002](./archive/implementation-audit-legacy.md#ls-rec-002) |
| LS-REC-003 | 🌗 partial | partial | verified-local | Boundary integration; language and storage/share/runtime error origins are not one canonical taxonomy. | [audit LS-REC-003](./archive/implementation-audit-legacy.md#ls-rec-003) |
| LS-CONS-001 | 🌗 partial | partial | local source/unit verified; browser not verified | In scope as consumer delivery; Playground source/unit path exists, fresh browser/public path is unverified. | [audit LS-CONS-001](./archive/implementation-audit-legacy.md#ls-cons-001) |
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
| Result counts | 9 implemented, 19 partial, 3 absent, 0 broken, 0 deferred, 2 not-applicable |
| Evidence/scope columns present on every row | Yes |
| Audit trace present on every row | Yes |

Mechanical validation performed after the audit refresh confirms that every row
has exactly one allowed reconciliation result, one implementation status, one
evidence status, a scope/owner decision, and an audit trace. The status matrix
matches the reconciliation result for all 33 IDs.

The result-count total is 33. In particular, LS-RANGE-002, LS-INCR-001,
and LS-VERS-002 remain explicit ❌ absent; they are not downgraded to
? unverified. LS-DOC-003 and LS-REC-002 are ➖ only because their catalog
scope decision assigns ownership to the host/consumer boundary.

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

- ❌ LS-RANGE-002 — define semantic navigation/reference locations.
- ❌ LS-INCR-001 — define bounded/incremental analysis behavior.
- ❌ LS-VERS-002 — add version/revision/provenance to result contract.
- ✔️ LS-CONS-005 — local API/version contract repair is verified; retain public-artifact verification as a release-boundary follow-up.
- 🌗 rows remain open partial work even when their local evidence is verified.
- ⏸️ rows remain expected and traceable, but delivery is held by the stated
  MCP/desktop roadmap boundary.

This reconciliation records the bounded implementation evidence and status
changes above. Partial, absent, deferred, host-owned, and delivery-boundary
gaps remain explicit and are not closed by documentation alone.
