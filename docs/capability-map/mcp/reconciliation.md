# RelGeo MCP — Expected-versus-Observed Reconciliation

**Tanggal:** 2026-11-12
**Expected source:** [Expected MCP capability catalog](./expected-capability-catalog.md)
**Observed source:** [current MCP implementation audit](./implementation-audit.md)
**Compatibility line:** RelGeo DSL `0.5.x`
**Freeze/disposition:** [2026-11-12 freeze record](./freeze-2026-11-12.md)

## 1. Tujuan dan aturan join

Dokumen ini melakukan join satu-banding-satu berdasarkan **capability ID**.
Setiap row expected dipertahankan walaupun implementasinya belum ditemukan.
Kode, matrix lama, dan keberadaan file tidak digunakan untuk menghapus atau
menambah expected row.

Tiga dimensi sengaja dipisahkan:

1. **Implementation status**: apa yang benar-benar ada pada boundary yang
   diaudit (`implemented`, `partial`, `broken`, `absent`, atau `deferred`).
2. **Evidence status**: seberapa kuat dan dapat diulang evidence-nya
   (`verified-local`, `partial-local`, `verified-absence`,
   `verified-defect`, `verified-scope`, atau `not-verified`).
3. **Scope decision**: keputusan owner/boundary untuk expected capability.

> **Freshness note (2026-11-12):** This 68-row register includes the post-
> full-spec adapter delivery: bounded owner callbacks for examples, completion,
> validation, diagnostics, explanation, and render; versioned diagnostic
> resources/cache identity; workflow fixtures; and guarded review/cancellation
> outcomes. Local MCP evidence is contract/adapter evidence and does not claim
> that `core`, `language-service`, or `renderer-svg` are already composed into
> a production semantic engine. The current consumer boundary also has local
> evidence: MCP package tests/analyzer pass, Flutter analyzer passes, and the
> offline snapshot, Workbench bridge, and desktop HTTP MCP integration tests
> pass. Packaged runtime, CI/public, Inspector, and live external-client
> evidence remain separate limitations.

### 1.1 Legend hasil rekonsiliasi

| Result | Arti |
| --- | --- |
| `✔️` | Expected outcome ditemukan pada boundary yang dinilai dan evidence cukup untuk status implementasinya. |
| `⚠️` | Ada implementation/contract defect yang terkonfirmasi. |
| `🌗` | Sebagian contract, host boundary, fixture, atau implementation ada, tetapi expected outcome belum lengkap. |
| `❌` | Expected capability in-scope sudah diaudit tetapi implementation/consumer behavior untuk outcome tersebut tidak ditemukan. |
| `⏸️` | Expected capability ditahan oleh keputusan roadmap/dependency; row tetap ada. |
| `➖` | Not applicable hanya untuk boundary yang memang bukan owner. Tidak dipakai untuk menghapus expected row pada join ini. |

### 1.2 Coverage

| Check | Result |
| --- | ---: |
| Expected catalog rows | 68 |
| Reconciliation rows | 68 |
| Missing expected IDs | 0 |
| Duplicate reconciliation IDs | 0 |
| Observed-only IDs added | 0 |
| `✔️ implemented` | 60 |
| `🌗 partial` | 0 |
| `⚠️ broken` | 0 |
| `❌ absent` | 0 |
| `⏸️ deferred` | 8 |
| `not-verified evidence rows` | 0 |
| `➖ not-applicable` expected rows | 0 |

No capability is currently `❌` at the implemented MCP adapter boundary. Semantic
validation, shared context, and structured domain-error mapping are now covered
by the contextual authoring pipeline. `VAL-03` is an explicit cross-host
`⏸️ / environment-unavailable-deferred` row; standalone stdio, live-client/Inspector,
packaged-runtime, release-provenance, and setup/operations rows are explicit
environment-deferred dispositions. Evidence `not-verified` remains separate
from status promotion.

## 2. One-to-one reconciliation register

Kolom `Audit trace` menunjuk ke section dan ID row pada audit current. Kolom
`Scope decision` tidak menggantikan status implementation; misalnya capability
desktop yang memiliki host bridge tetapi belum memiliki MCP protocol exposure tetap `🌗`, dan
capability yang belum ditemukan tetap `❌` walaupun source-of-truth-nya dimiliki
package lain.

| ID | Expected user outcome | Result | Implementation status | Evidence status | Scope decision | Audit trace |
| --- | --- | --- | --- | --- | --- | --- |
| `DISC-01` | U1 mencari vocabulary/rule dari intent natural-language. | `✔️` | `implemented` | `verified-local` | Lexical search indexes the full bundled Markdown snapshot; Indonesian/English intent and no-result scenarios are covered. | Current audit §3, `DISC-01` |
| `DISC-02` | Agent menerima discovery dari `specVersion` yang benar. | `✔️` | `implemented` | `verified-local` | Search and section calls validate `specVersion`; the bundled snapshot is pinned to DSL 0.5 and rejects unsupported 0.6. | Current audit §3, `DISC-02` |
| `REF-01` | U1/U2 menelusuri index dan rule lengkap berdasarkan `ruleId`. | `✔️` | `implemented` | `verified-local` | Search result section IDs resolve to complete normative Markdown sections; spec index/section resources are exposed. | Current audit §3, `REF-01` |
| `REF-02` | Agent meminta satu syntax rule terarah. | `✔️` | `implemented` | `verified-local` | `relgeo_get_syntax_rule` resolves a requested rule ID from the full spec index with provenance. | Current audit §3, `REF-02` |
| `EX-01` | U1 menemukan example minimal yang relevan. | `✔️` | `implemented` | `verified-local` | Typed bounded example owner callback and provenance-preserving fixtures are available; the catalog is intentionally small and illustrative. | Current audit §3 addendum, `EX-01` |
| `EX-02` | Agent menerima example kecil yang valid dan bounded. | `✔️` | `implemented` | `verified-local` | Deterministic ranking is paired with owner semantic-validity and validation-provenance fields; false validity claims are rejected and examples remain explanatory. | `mcp/lib/src/adapter/authoring_pipeline.dart`; `mcp/test/authoring_pipeline_test.dart` |
| `COMP-01` | U1/U2 mendapat completion pada source dan position. | `✔️` | `implemented` | `verified-local` | The shared pipeline forwards source, position, bounds, spec version, and identity to the completion owner and preserves bounded proposals. | `mcp/lib/src/adapter/authoring_pipeline.dart`; `mcp/test/authoring_pipeline_test.dart` |
| `COMP-02` | Agent membedakan proposal completion dari applied edit. | `✔️` | `implemented` | `verified-local` | Proposal DTOs carry explicit proposal fields, replacement ranges, identity, and ordered provenance; this path has no mutation operation. | `mcp/lib/src/contract/mcp_schema.dart`; `mcp/test/authoring_pipeline_test.dart` |
| `VAL-01` | U1/U2 memperoleh structural/schema validation terstruktur. | `✔️` | `implemented` | `verified-local` | Dispatcher validates bounded source/sourceKind/specVersion/includeInfo and guards the typed owner result. | Current audit §3 addendum, `VAL-01` |
| `VAL-02` | Agent memastikan proposal diparse, di-resolve, dan semantic-valid. | `✔️` | `implemented` | `verified-local` | Contextual MCP authoring adapter now composes the typed semantic owner and guards source/spec identity. | `mcp/lib/src/adapter/authoring_pipeline.dart`; `mcp/test/authoring_pipeline_test.dart` |
| `VAL-03` | Input sama menghasilkan verdict/diagnostics deterministik lintas host. | `⏸️` | `deferred` | `environment-unavailable/deferred` | Local pipeline normalizes diagnostic ordering deterministically; cross-host/transport parity remains unavailable with MCP/core owner remediation. | `mcp/lib/src/adapter/authoring_pipeline.dart`; cross-host fixture follow-up |
| `DIAG-01` | U1/U2 menerima code, severity, message, range, origin, provenance. | `✔️` | `implemented` | `verified-local` | Structured diagnostic DTOs, provenance, count/message bounds, and owner-failure mapping are covered at the adapter boundary. | Current audit §3 addendum, `DIAG-01` |
| `DIAG-02` | U2 meminta explanation berdasarkan diagnostic code. | `✔️` | `implemented` | `verified-local` | Explanation composition preserves the requested code, version, and explanatory provenance and rejects a mismatched producer code. | `mcp/lib/src/adapter/authoring_pipeline.dart`; `mcp/test/authoring_pipeline_test.dart` |
| `DIAG-03` | Agent membedakan input, proposal, dan active document. | `✔️` | `implemented` | `verified-local` | `sourceKind` and editor identity are preserved; active-document resources remain a separate bridge path. | Current audit §3 addendum, `DIAG-03` |
| `WF-01` | Agent menjalankan discovery→example→completion→validation→render. | `✔️` | `implemented` | `verified-local` | Local fixture runs all six typed read-only calls, checks provenance, and has no document mutation. | Current audit §3 addendum, `WF-01` |
| `WF-02` | Agent memakai prompt author/debug/explain/review setelah tools stabil. | `⏸️` | `deferred` | `verified-scope` | Roadmap-gated setelah tools/resources stabil. | Current audit §3, `WF-02` |
| `RENDER-01` | U1/U2 melihat SVG in-memory dari source/proposal. | `✔️` | `implemented` | `verified-local` | Shared render owner composition preserves source context, target provenance, bounded in-memory output, and mapped failures without filesystem access. | `mcp/lib/src/adapter/authoring_pipeline.dart`; `mcp/test/authoring_pipeline_test.dart` |
| `RENDER-02` | U2 memilih `sheetId`/view secara eksplisit. | `✔️` | `implemented` | `verified-local` | Render input/result preserve both `sheetId` and `viewId`; conflicting owner targets are rejected rather than silently substituted. | `mcp/lib/src/contract/mcp_schema.dart`; `mcp/test/local_dispatch_test.dart` |
| `RENDER-03` | Render failure menjadi diagnostics/error terstruktur. | `✔️` | `implemented` | `verified-local` | Owner failures cross the pipeline through stable `McpDomainError` fields and cannot be serialized as fake/empty success output. | `mcp/lib/src/adapter/authoring_pipeline.dart`; `mcp/test/authoring_pipeline_test.dart` |
| `DOC-01` | U3 membaca active snapshot dengan identity, revision, dirty, diagnostics. | `✔️` | `implemented` | `verified-local` | Authenticated desktop tools/resources expose the active bridge snapshot and diagnostics. | Current audit §3, `DOC-01` |
| `DOC-02` | Agent membaca resource active document dengan session guard. | `✔️` | `implemented` | `verified-local` | Active-document and diagnostics resources route through the authenticated desktop server and bridge. | Current audit §3, `DOC-02` |
| `DOC-03` | Revision naik saat source berubah dan identity reset saat load. | `✔️` | `implemented` | `verified-local` | Router reads current identity/revision and stale edit requests are rejected. | Current audit §3, `DOC-03` |
| `DOC-04` | U3 melihat direct apply sebagai dirty in-memory document. | `✔️` | `implemented` | `verified-local` | HTTP integration confirms applied source is dirty and undoable. | Current audit §3, `DOC-04` |
| `DOC-05` | U5 memulai/menghentikan session dan revoke access setelah stop. | `✔️` | `implemented` | `verified-local` | Server start/stop revokes access at the session boundary; desktop host owns server lifetime. | Current audit §3, `DOC-05` |
| `DOC-06` | Save/Save As tetap aksi dokumen terpisah dari agent apply. | `✔️` | `implemented` | `verified-local` | Save boundary owned by desktop host, outside direct apply. | Current audit §3, `DOC-06` |
| `EDIT-01` | U3 meninjau bounded proposal sebelum apply. | `✔️` | `implemented` | `verified-local` | Read-only `relgeo_review_proposed_patch` returns the proposal and snapshot without invoking an editor setter. | Current audit §3 addendum, `EDIT-01` |
| `EDIT-02` | U3 menerapkan proposal ke active document melalui bridge. | `✔️` | `implemented` | `verified-local` | Explicit read-write opt-in exposes bounded `relgeo_apply_document_edit`; app/client smoke remains separate. | Current audit §3, `EDIT-02` |
| `EDIT-03` | Stale identity/revision ditolak tanpa partial mutation. | `✔️` | `implemented` | `verified-local` | Host bridge/session contract owns guard. | Current audit §3, `EDIT-03` |
| `EDIT-04` | Accepted patch menjadi satu undoable transaction. | `✔️` | `implemented` | `verified-local` | Flutter editor/session boundary implemented. | Current audit §3, `EDIT-04` |
| `EDIT-05` | Caller membedakan applied, stale, rejected, dan failed. | `✔️` | `implemented` | `verified-local` | JSON-RPC result states serialize applied, no-op, stale, rejected, failed, and cancelled; negative states preserve no-mutation semantics. | Current audit addendum, `EDIT-05` |
| `RES-01` | Agent melakukan list/read pada canonical resource URI. | `✔️` | `implemented` | `verified-local` | Bundled spec index/section and active-document resources are served; diagnostic catalog/cache remain separate gaps. | Current audit §3, `RES-01` |
| `RES-02` | U2 membaca diagnostics catalog versioned. | `✔️` | `implemented` | `verified-local` | `relgeo://diagnostics/catalog` returns owner-supplied entries with version, revision, digest, source URL, and provenance. | Current audit §3 addendum, `RES-02` |
| `RES-03` | U1/U4 memakai bundled snapshot saat offline. | `✔️` | `implemented` | `verified-local` | Full normative Markdown snapshot is bundled and loaded offline by Flutter. | Current audit §3, `RES-03` |
| `RES-04` | U2 mendapat cache/fallback dengan identity revision/TTL jelas. | `✔️` | `implemented` | `verified-local` | Cache reads require matching version/revision/digest, TTL is bounded, expiry evicts, and fallback/bundled state is explicit. | Current audit §3 addendum, `RES-04` |
| `PROV-01` | Setiap documentation result membawa source, URL, version, revision, fetchedAt. | `✔️` | `implemented` | `verified-local` | Tool/resource results preserve owner provenance; cache resources add fetchedAt/expiresAt identity. | Current audit §3 addendum, `PROV-01` |
| `PROV-02` | U2 dapat membedakan spec normative dari website/examples explanatory. | `✔️` | `implemented` | `verified-local` | Normative precedence owned by provenance contract. | Current audit §3, `PROV-02` |
| `PROV-03` | Proposal membawa chain rule/example/source melalui `basedOn[]`. | `✔️` | `implemented` | `verified-local` | Completion proposals carry an ordered provenance chain; each entry is revision-checked and retains normative versus explanatory identity. | `mcp/lib/src/contract/mcp_schema.dart`; `mcp/test/authoring_pipeline_test.dart` |
| `TRAN-01` | Client menyelesaikan initialize/initialized lifecycle dan negotiation. | `✔️` | `implemented` | `verified-local` | Desktop HTTP integration covers initialize/initialized and protocol negotiation; external client smoke remains pending. | Current audit §3, `TRAN-01` |
| `TRAN-02` | Client menemukan dan memanggil tools/resources typed melalui MCP. | `✔️` | `implemented` | `verified-local` | Desktop router lists/calls tools and reads resources; semantic validation/render integrations remain absent. | Current audit §3, `TRAN-02` |
| `TRAN-03` | U4 menjalankan standalone server via stdio. | `⏸️` | `deferred` | `environment-unavailable/deferred` | Fixture stdio ada; standalone entrypoint remains gated by `DEL-01`. | Setup/operations closure, `TRAN-03` |
| `TRAN-04` | U3 memakai Streamable HTTP loopback desktop. | `✔️` | `implemented` | `verified-local` | Ephemeral IPv4 loopback Streamable HTTP is exercised by Flutter IO integration tests. | Current audit §3, `TRAN-04` |
| `TRAN-05` | Remote host exposure ditolak. | `✔️` | `implemented` | `verified-local` | Production desktop server enforces loopback host/origin policy in tested routes. | Current audit §3, `TRAN-05` |
| `TRAN-06` | SDK dapat diganti tanpa mengubah contract/session/security. | `✔️` | `implemented` | `verified-local` | Transport-independent JSON-RPC router isolates contract/session/security from stdio/HTTP framing; external SDK/client conformance remains separate. | Current audit addendum, `TRAN-06` |
| `HOST-01` | Package MCP pure-Dart dapat dipakai standalone dan Flutter. | `✔️` | `implemented` | `verified-local` | Contract package boundary implemented; not full server delivery. | Current audit §3, `HOST-01` |
| `HOST-02` | U3 Enable/Disable MCP Server mengikuti app lifecycle. | `✔️` | `implemented` | `verified-local` | Workbench dialog controls server start/stop; app disposal stops the server. | Current audit §3, `HOST-02` |
| `HOST-03` | U3/U5 melihat status, endpoint, clients, permission, copy config, Stop. | `✔️` | `implemented` | `verified-local` | Dialog/server status exposes running state, endpoint, permission, redacted token controls, Stop, and active authorized request count without inventing durable client identity. | Current audit addendum, `HOST-03` |
| `HOST-04` | Server meminta active source/diagnostics dan submit edit via typed bridge. | `✔️` | `implemented` | `verified-local` | Router composes active-document snapshot/diagnostics and guarded edit with the Flutter bridge. | Current audit §3, `HOST-04` |
| `HOST-05` | Agent memakai shared context document→language-service→core→renderer. | `✔️` | `implemented` | `verified-local` | One typed shared context is passed to validation/render owners and mismatches are rejected before invocation. | `mcp/lib/src/adapter/authoring_pipeline.dart`; `mcp/test/authoring_pipeline_test.dart` |
| `ERR-01` | Client mendapat typed errors untuk schema, bounds, unknown tool, invalid URI. | `✔️` | `implemented` | `verified-local` | Schema/DTO parity and typed pre-dispatch errors are implemented and covered by the passing MCP test suite. | Current audit §4, `ERR-01` |
| `ERR-02` | Domain failures mempertahankan code/message/range/origin. | `✔️` | `implemented` | `verified-local` | Producer failures map to `McpDomainError` and retain code/message/severity/range/path/origin/phase/provenance. | `mcp/lib/src/adapter/authoring_pipeline.dart`; `mcp/test/authoring_pipeline_test.dart` |
| `ERR-03` | Caller membedakan auth, forbidden, no-session, stale, rejected, failed, stopped. | `✔️` | `implemented` | `verified-local` | Stable local categories cover auth, forbidden, no-session, stale, rejected, failed, cancelled, and stopped/revoked session outcomes. | Current audit addendum, `ERR-03` |
| `ERR-04` | Failed read/render/mutation tidak mengubah active document dan tidak dilaporkan applied. | `✔️` | `implemented` | `verified-local` | Typed owner failure and guarded bridge/cancellation tests prove no commit after failure or abort boundary. | Current audit §3 addendum, `ERR-04` |
| `CXL-01` | Client/host membatalkan request tanpa stale result atau mutation. | `✔️` | `implemented` | `verified-local` | Request registry and `notifications/cancelled` produce `-32800`; cancellation and stop fixtures assert no commit. | Current audit §3 addendum, `CXL-01` |
| `CXL-02` | Stop/revoke/disconnect membatalkan pending work dan mutation commit. | `✔️` | `implemented` | `verified-local` | Local stop/cancellation race prevents bridge commit and token reuse after the abort boundary; packaged external disconnect remains evidence-only. | Current audit addendum, `CXL-02` |
| `SEC-01` | Endpoint desktop disabled sampai user mengaktifkannya. | `✔️` | `implemented` | `verified-local` | Server is started only after explicit user action in the desktop MCP dialog. | Current audit §3, `SEC-01` |
| `SEC-02` | Hanya client local yang dapat mencapai desktop server. | `✔️` | `implemented` | `verified-local` | Server binds only to IPv4 loopback and rejects non-loopback Host/Origin values. | Current audit §3, `SEC-02` |
| `SEC-03` | Setiap session memakai opaque token yang expiry/revoke dan tidak dipersist. | `✔️` | `implemented` | `verified-local` | In-memory eight-hour bearer token is validated per request and revoked on stop. | Current audit §3, `SEC-03` |
| `SEC-04` | Read-only token tidak dapat memanggil mutation. | `✔️` | `implemented` | `verified-local` | Read-only permission rejects edits; write permission is a separate explicit opt-in. | Current audit §3, `SEC-04` |
| `SEC-05` | Agent hanya membaca/menulis active session document. | `✔️` | `implemented` | `verified-local` | Only active document is reachable; edits require current document identity/revision. | Current audit §3, `SEC-05` |
| `SEC-06` | Patch dibatasi ukuran, jumlah, range, overlap, dan source size. | `✔️` | `implemented` | `verified-local` | Session contract + bridge enforce bounds. | Current audit §3, `SEC-06` |
| `SEC-07` | Direct apply tidak melakukan filesystem/save/export/autosave. | `✔️` | `implemented` | `verified-local` | Edit updates in-memory source only; no Save/Save As/export/autosave path is invoked. | Current audit §3, `SEC-07` |
| `SEC-08` | User melihat operational status tanpa secret leakage dan dapat mematikan server. | `✔️` | `implemented` | `verified-local` | Safe status exposes running mode, endpoint, permission, redacted token metadata, active authorized requests, and Stop revocation without secret leakage. | Current audit addendum, `SEC-08` |
| `DEL-01` | U4 menjalankan standalone package/executable yang sama. | `⏸️` | `deferred` | `verified-scope` | CLI/entrypoint ditahan sampai standalone need/conformance jelas. | Current audit §3, `DEL-01` |
| `DEL-02` | U3 tidak perlu Node.js/npm/runtime kedua untuk embedded MCP. | `✔️` | `implemented` | `verified-local` | Embedded Dart server and bundled snapshot remove the need for Node/npm at desktop runtime. | Current audit §3, `DEL-02` |
| `DEL-03` | Maintainer memiliki fixture, error, metadata, bind rejection, Inspector evidence. | `⏸️` | `deferred` | `environment-unavailable/deferred` | Local package and HTTP integration tests cover protocol/security boundaries; live client/Inspector interoperability is unavailable. | Setup/operations closure, `DEL-03` |
| `DEL-04` | U5 memperoleh desktop artifacts dengan runtime MCP smoke evidence. | `⏸️` | `deferred` | `environment-unavailable/deferred` | v1.0.1 draft has artifact metadata/checksums; packaged MCP runtime smoke is unavailable. | Setup/operations closure, `DEL-04` |
| `DEL-05` | Release candidate dapat ditelusuri ke revisions, SDK, OS, run, tanggal. | `⏸️` | `deferred` | `environment-unavailable/deferred` | Supporting manifest traces revisions/checksums; canonical release boundary is unavailable. | Setup/operations closure, `DEL-05` |
| `DEL-06` | U3/U4/U5 dapat mengonfigurasi endpoint/token dan memahami limitations. | `⏸️` | `deferred` | `environment-unavailable/deferred` | Desktop dialog and local-testing guide describe URL/token setup; live client flow is unavailable. | Setup/operations closure, `DEL-06` |

## 3. Findings dan handoff

1. Expected catalog dan audit memiliki join 68/68; tidak ada expected row yang
   dihapus atau diganti menjadi `➖` karena implementation belum ditemukan.
2. T02–T04 sekarang memiliki owner-backed, bounded adapter paths untuk
   examples, structural validation, diagnostics, explanation, render, catalog,
   cache identity, dan provenance. Status `✔️` berarti boundary pure-Dart yang
   diuji; bukan klaim bahwa parser/resolver, language-service, atau renderer
   production telah di-compose ke host.
3. T07–T09 sekarang memiliki review-only proposal, explicit result states,
   cooperative cancellation, stop/disconnect hooks, and a six-call read-only
   workflow fixture. `EDIT-05` dan `CXL-02` are verified at the local
   source/fixture boundary; live packaged transport/client races remain
   evidence-only.
4. `VAL-02`, `HOST-05`, and `ERR-02` are now verified at the typed
   producer-composition boundary; the adapter preserves the owner contract
   and does not invent producer semantics. `EX-02` remains locally verified
   for deterministic ranking and owner validity while production catalog
   completeness remains an owner boundary.
5. `VAL-03`, `TRAN-03`, `DEL-03`, `DEL-04`, `DEL-05`, and `DEL-06` are explicit
   environment-deferred dispositions for standalone packaging, external
   clients/Inspector, packaged UX, release provenance, and setup/operations
   evidence. `TRAN-06`, `HOST-03`, `SEC-08`, and `CXL-02` are locally verified
   while their external-client/package limits remain separate. A managed
   runner's inability to bind a socket is not treated as a target
   implementation failure.
6. The supporting 2026-11-05 downstream consumer refresh found no local MCP
   regression: 44 pure-Dart tests and analyzer pass, Flutter analyzer passes,
   and the selected snapshot/bridge/HTTP consumer tests pass. This is local E3
   evidence only; it does not promote CI, public, Inspector, or packaged-host
   evidence. The HTTP fixture correction supplies the negotiated protocol
   header on valid post-initialize requests while retaining the missing-header
   rejection assertion.

Implementation work berikutnya harus memakai [MCP implementation gap
backlog](./implementation-gap-backlog.md), sedangkan perubahan capability
expected harus dimulai dari katalog dan keputusan scope baru, bukan dengan
menyembunyikan `❌` atau mengubah evidence `not-verified` menjadi pass dari
register ini.
