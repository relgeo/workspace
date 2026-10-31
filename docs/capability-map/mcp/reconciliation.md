# RelGeo MCP — Expected-versus-Observed Reconciliation

**Tanggal:** 2026-10-31
**Expected source:** [Expected MCP capability catalog](./expected-capability-catalog.md)
**Observed source:** [current MCP implementation audit](./implementation-audit.md)
**Compatibility line:** RelGeo DSL `0.5.x`

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

> **Freshness note (2026-10-31):** This 68-row register now includes full-spec
> retrieval, desktop loopback HTTP, active-document resources, and the
> permission-gated edit tool in MCP `b4561c0` and Flutter `60ec760`. Local
> MCP/Flutter tests and Flutter CI run `41184291670` support those rows. The
> root integration manifest remains captured at 2026-10-09; desktop v1.0.1 is
> still a draft and client write interoperability is not verified.

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
| `✔️ implemented` | 32 |
| `🌗 partial` | 24 |
| `⚠️ broken` | 0 |
| `❌ absent` | 10 |
| `⏸️ deferred` | 2 |
| `not-verified evidence rows` | 3 |
| `➖ not-applicable` expected rows | 0 |

`❌` tetap eksplisit untuk capability yang belum ada, termasuk semantic
validation/completion/render executors, diagnostic catalog/cache, standalone
stdio, workflow composition, dan beberapa detail operational status. Evidence
`not-verified` tetap terpisah untuk live-client/cross-host proof.

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
| `EX-01` | U1 menemukan example minimal yang relevan. | `🌗` | `partial` | `partial-local` | In scope; examples bundle/resolver belum ada. | Current audit §3, `EX-01` |
| `EX-02` | Agent menerima example kecil yang valid dan bounded. | `❌` | `absent` | `verified-absence` | In scope; retrieval/ranking policy belum diimplementasikan. | Current audit §3, `EX-02` |
| `COMP-01` | U1/U2 mendapat completion pada source dan position. | `🌗` | `partial` | `partial-local` | In scope; language-service adapter belum ada. | Current audit §3, `COMP-01` |
| `COMP-02` | Agent membedakan proposal completion dari applied edit. | `🌗` | `partial` | `partial-local` | In scope; DTO ada, runtime proposal belum ada. | Current audit §3, `COMP-02` |
| `VAL-01` | U1/U2 memperoleh structural/schema validation terstruktur. | `🌗` | `partial` | `partial-local` | In scope; core validation belum dipanggil MCP. | Current audit §3, `VAL-01` |
| `VAL-02` | Agent memastikan proposal diparse, di-resolve, dan semantic-valid. | `❌` | `absent` | `verified-absence` | In scope; core parse/validate/resolve adapter belum ada. | Current audit §3, `VAL-02` |
| `VAL-03` | Input sama menghasilkan verdict/diagnostics deterministik lintas host. | `🌗` | `partial` | `not-verified` | In scope; determinism contract ada, cross-host MCP evidence belum ada. | Current audit §3, `VAL-03` |
| `DIAG-01` | U1/U2 menerima code, severity, message, range, origin, provenance. | `🌗` | `partial` | `partial-local` | In scope; mapping core/language-service belum ada. | Current audit §3, `DIAG-01` |
| `DIAG-02` | U2 meminta explanation berdasarkan diagnostic code. | `❌` | `absent` | `verified-absence` | In scope; explanation resolver/catalog belum ada. | Current audit §3, `DIAG-02` |
| `DIAG-03` | Agent membedakan input, proposal, dan active document. | `🌗` | `partial` | `partial-local` | In scope; DTO ada, enforcement runtime belum ada. | Current audit §3, `DIAG-03` |
| `WF-01` | Agent menjalankan discovery→example→completion→validation→render. | `❌` | `absent` | `verified-absence` | In scope; workflow composition belum callable. | Current audit §3, `WF-01` |
| `WF-02` | Agent memakai prompt author/debug/explain/review setelah tools stabil. | `⏸️` | `deferred` | `verified-scope` | Roadmap-gated setelah tools/resources stabil. | Current audit §3, `WF-02` |
| `RENDER-01` | U1/U2 melihat SVG in-memory dari source/proposal. | `🌗` | `partial` | `partial-local` | In scope; core→renderer adapter belum ada. | Current audit §3, `RENDER-01` |
| `RENDER-02` | U2 memilih `sheetId`/view secara eksplisit. | `🌗` | `partial` | `partial-local` | In scope; sheet/view resolver belum terhubung. | Current audit §3, `RENDER-02` |
| `RENDER-03` | Render failure menjadi diagnostics/error terstruktur. | `❌` | `absent` | `verified-absence` | In scope; failure mapping belum ada. | Current audit §3, `RENDER-03` |
| `DOC-01` | U3 membaca active snapshot dengan identity, revision, dirty, diagnostics. | `✔️` | `implemented` | `verified-local` | Authenticated desktop tools/resources expose the active bridge snapshot and diagnostics. | Current audit §3, `DOC-01` |
| `DOC-02` | Agent membaca resource active document dengan session guard. | `✔️` | `implemented` | `verified-local` | Active-document and diagnostics resources route through the authenticated desktop server and bridge. | Current audit §3, `DOC-02` |
| `DOC-03` | Revision naik saat source berubah dan identity reset saat load. | `✔️` | `implemented` | `verified-local` | Router reads current identity/revision and stale edit requests are rejected. | Current audit §3, `DOC-03` |
| `DOC-04` | U3 melihat direct apply sebagai dirty in-memory document. | `✔️` | `implemented` | `verified-local` | HTTP integration confirms applied source is dirty and undoable. | Current audit §3, `DOC-04` |
| `DOC-05` | U5 memulai/menghentikan session dan revoke access setelah stop. | `✔️` | `implemented` | `verified-local` | Server start/stop revokes access at the session boundary; desktop host owns server lifetime. | Current audit §3, `DOC-05` |
| `DOC-06` | Save/Save As tetap aksi dokumen terpisah dari agent apply. | `✔️` | `implemented` | `verified-local` | Save boundary owned by desktop host, outside direct apply. | Current audit §3, `DOC-06` |
| `EDIT-01` | U3 meninjau bounded proposal sebelum apply. | `🌗` | `partial` | `partial-local` | Session contract ada; review surface/protocol call belum ada. | Current audit §3, `EDIT-01` |
| `EDIT-02` | U3 menerapkan proposal ke active document melalui bridge. | `✔️` | `implemented` | `verified-local` | Explicit read-write opt-in exposes bounded `relgeo_apply_document_edit`; app/client smoke remains separate. | Current audit §3, `EDIT-02` |
| `EDIT-03` | Stale identity/revision ditolak tanpa partial mutation. | `✔️` | `implemented` | `verified-local` | Host bridge/session contract owns guard. | Current audit §3, `EDIT-03` |
| `EDIT-04` | Accepted patch menjadi satu undoable transaction. | `✔️` | `implemented` | `verified-local` | Flutter editor/session boundary implemented. | Current audit §3, `EDIT-04` |
| `EDIT-05` | Caller membedakan applied, stale, rejected, dan failed. | `🌗` | `partial` | `partial-local` | DTO states ada; protocol serialization/coverage belum lengkap. | Current audit §3, `EDIT-05` |
| `RES-01` | Agent melakukan list/read pada canonical resource URI. | `✔️` | `implemented` | `verified-local` | Bundled spec index/section and active-document resources are served; diagnostic catalog/cache remain separate gaps. | Current audit §3, `RES-01` |
| `RES-02` | U2 membaca diagnostics catalog versioned. | `❌` | `absent` | `verified-absence` | In scope; catalog content/resolver belum ada. | Current audit §3, `RES-02` |
| `RES-03` | U1/U4 memakai bundled snapshot saat offline. | `✔️` | `implemented` | `verified-local` | Full normative Markdown snapshot is bundled and loaded offline by Flutter. | Current audit §3, `RES-03` |
| `RES-04` | U2 mendapat cache/fallback dengan identity revision/TTL jelas. | `❌` | `absent` | `verified-absence` | In scope; cache/fallback layer belum ada. | Current audit §3, `RES-04` |
| `PROV-01` | Setiap documentation result membawa source, URL, version, revision, fetchedAt. | `🌗` | `partial` | `partial-local` | In scope; DTO ada, result-producing adapter belum ada. | Current audit §3, `PROV-01` |
| `PROV-02` | U2 dapat membedakan spec normative dari website/examples explanatory. | `✔️` | `implemented` | `verified-local` | Normative precedence owned by provenance contract. | Current audit §3, `PROV-02` |
| `PROV-03` | Proposal membawa chain rule/example/source melalui `basedOn[]`. | `🌗` | `partial` | `partial-local` | In scope; proposal producer belum ada. | Current audit §3, `PROV-03` |
| `TRAN-01` | Client menyelesaikan initialize/initialized lifecycle dan negotiation. | `✔️` | `implemented` | `verified-local` | Desktop HTTP integration covers initialize/initialized and protocol negotiation; external client smoke remains pending. | Current audit §3, `TRAN-01` |
| `TRAN-02` | Client menemukan dan memanggil tools/resources typed melalui MCP. | `✔️` | `implemented` | `verified-local` | Desktop router lists/calls tools and reads resources; semantic validation/render integrations remain absent. | Current audit §3, `TRAN-02` |
| `TRAN-03` | U4 menjalankan standalone server via stdio. | `🌗` | `partial` | `partial-local` | Fixture stdio ada; standalone RelGeo entrypoint belum ada. | Current audit §3, `TRAN-03` |
| `TRAN-04` | U3 memakai Streamable HTTP loopback desktop. | `✔️` | `implemented` | `verified-local` | Ephemeral IPv4 loopback Streamable HTTP is exercised by Flutter IO integration tests. | Current audit §3, `TRAN-04` |
| `TRAN-05` | Remote host exposure ditolak. | `✔️` | `implemented` | `verified-local` | Production desktop server enforces loopback host/origin policy in tested routes. | Current audit §3, `TRAN-05` |
| `TRAN-06` | SDK dapat diganti tanpa mengubah contract/session/security. | `🌗` | `partial` | `partial-local` | Contract boundary ada; adapter package belum ada. | Current audit §3, `TRAN-06` |
| `HOST-01` | Package MCP pure-Dart dapat dipakai standalone dan Flutter. | `✔️` | `implemented` | `verified-local` | Contract package boundary implemented; not full server delivery. | Current audit §3, `HOST-01` |
| `HOST-02` | U3 Enable/Disable MCP Server mengikuti app lifecycle. | `✔️` | `implemented` | `verified-local` | Workbench dialog controls server start/stop; app disposal stops the server. | Current audit §3, `HOST-02` |
| `HOST-03` | U3/U5 melihat status, endpoint, clients, permission, copy config, Stop. | `🌗` | `partial` | `partial-local` | Dialog exposes permission, endpoint, temporary token, copy-config, Enable and Disable; connected-client status is not implemented/verified. | Current audit §3, `HOST-03` |
| `HOST-04` | Server meminta active source/diagnostics dan submit edit via typed bridge. | `✔️` | `implemented` | `verified-local` | Router composes active-document snapshot/diagnostics and guarded edit with the Flutter bridge. | Current audit §3, `HOST-04` |
| `HOST-05` | Agent memakai shared context document→language-service→core→renderer. | `❌` | `absent` | `verified-absence` | In scope as composition; no MCP wiring found. | Current audit §3, `HOST-05` |
| `ERR-01` | Client mendapat typed errors untuk schema, bounds, unknown tool, invalid URI. | `✔️` | `implemented` | `verified-local` | Schema/DTO parity and typed pre-dispatch errors are implemented and covered by the passing MCP test suite. | Current audit §4, `ERR-01` |
| `ERR-02` | Domain failures mempertahankan code/message/range/origin. | `❌` | `absent` | `verified-absence` | In scope; core/language-service error mapping belum ada. | Current audit §3, `ERR-02` |
| `ERR-03` | Caller membedakan auth, forbidden, no-session, stale, rejected, failed, stopped. | `🌗` | `partial` | `partial-local` | Session contract exists; protocol mapping belum ada. | Current audit §3, `ERR-03` |
| `ERR-04` | Failed read/render/mutation tidak mengubah active document dan tidak dilaporkan applied. | `🌗` | `partial` | `partial-local` | Bridge atomicity ada; transport/error path belum ada. | Current audit §3, `ERR-04` |
| `CXL-01` | Client/host membatalkan request tanpa stale result atau mutation. | `❌` | `absent` | `verified-absence` | In scope; request registry/abort semantics belum ada. | Current audit §3, `CXL-01` |
| `CXL-02` | Stop/revoke/disconnect membatalkan pending work dan mutation commit. | `🌗` | `partial` | `not-verified` | In scope; revoke contract ada, real server lifecycle belum ada. | Current audit §3, `CXL-02` |
| `SEC-01` | Endpoint desktop disabled sampai user mengaktifkannya. | `✔️` | `implemented` | `verified-local` | Server is started only after explicit user action in the desktop MCP dialog. | Current audit §3, `SEC-01` |
| `SEC-02` | Hanya client local yang dapat mencapai desktop server. | `✔️` | `implemented` | `verified-local` | Server binds only to IPv4 loopback and rejects non-loopback Host/Origin values. | Current audit §3, `SEC-02` |
| `SEC-03` | Setiap session memakai opaque token yang expiry/revoke dan tidak dipersist. | `✔️` | `implemented` | `verified-local` | In-memory eight-hour bearer token is validated per request and revoked on stop. | Current audit §3, `SEC-03` |
| `SEC-04` | Read-only token tidak dapat memanggil mutation. | `✔️` | `implemented` | `verified-local` | Read-only permission rejects edits; write permission is a separate explicit opt-in. | Current audit §3, `SEC-04` |
| `SEC-05` | Agent hanya membaca/menulis active session document. | `✔️` | `implemented` | `verified-local` | Only active document is reachable; edits require current document identity/revision. | Current audit §3, `SEC-05` |
| `SEC-06` | Patch dibatasi ukuran, jumlah, range, overlap, dan source size. | `✔️` | `implemented` | `verified-local` | Session contract + bridge enforce bounds. | Current audit §3, `SEC-06` |
| `SEC-07` | Direct apply tidak melakukan filesystem/save/export/autosave. | `✔️` | `implemented` | `verified-local` | Edit updates in-memory source only; no Save/Save As/export/autosave path is invoked. | Current audit §3, `SEC-07` |
| `SEC-08` | User melihat operational status tanpa secret leakage dan dapat mematikan server. | `🌗` | `partial` | `partial-local` | Dialog shows running state, mode, endpoint, temporary token/copy config and Disable; connected-client status is absent. | Current audit §3, `SEC-08` |
| `DEL-01` | U4 menjalankan standalone package/executable yang sama. | `⏸️` | `deferred` | `verified-scope` | CLI/entrypoint ditahan sampai standalone need/conformance jelas. | Current audit §3, `DEL-01` |
| `DEL-02` | U3 tidak perlu Node.js/npm/runtime kedua untuk embedded MCP. | `✔️` | `implemented` | `verified-local` | Embedded Dart server and bundled snapshot remove the need for Node/npm at desktop runtime. | Current audit §3, `DEL-02` |
| `DEL-03` | Maintainer memiliki fixture, error, metadata, bind rejection, Inspector evidence. | `🌗` | `partial` | `not-verified` | Local package and HTTP integration tests cover protocol/security boundaries; live client/Inspector interoperability remains not verified. | Current audit §3, `DEL-03` |
| `DEL-04` | U5 memperoleh desktop artifacts dengan runtime MCP smoke evidence. | `🌗` | `partial` | `not-verified` | v1.0.1 draft has three verified artifacts/checksums; packaged MCP runtime smoke is still open. | Current audit §3, `DEL-04` |
| `DEL-05` | Release candidate dapat ditelusuri ke revisions, SDK, OS, run, tanggal. | `🌗` | `partial` | `partial-local` | Release manifest traces Flutter/OS/workflow/checksums; MCP snapshot/commit trace is not yet joined. | Current audit §3, `DEL-05` |
| `DEL-06` | U3/U4/U5 dapat mengonfigurasi endpoint/token dan memahami limitations. | `🌗` | `partial` | `partial-local` | Desktop dialog and local-testing guide describe URL/token setup; live end-user client flow remains pending. | Current audit §3, `DEL-06` |

## 3. Findings dan handoff

1. Expected catalog dan audit memiliki join 68/68; tidak ada expected row yang
   dihapus atau diganti menjadi `➖` karena implementation belum ditemukan.
2. Strongest observed implementation adalah pure-Dart contract/session slice,
   Flutter active-document bridge, dan dependency-free protocol fixture. Itu
   belum sama dengan production MCP server/tool/resource delivery.
3. `ERR-01` schema/DTO parity repair and typed pre-dispatch validation are
   present; focused test execution remains pending the unavailable package
   dependency, so the row stays `🌗` rather than becoming `✔️`.
4. `TRAN-04` memiliki evidence environment-unavailable untuk local socket bind;
   hasil itu tidak mengubah status menjadi product failure.
5. `DOC-01`, `DOC-03`, `DOC-04`, `DOC-06`, `EDIT-03`, `EDIT-04`, `HOST-01`,
   `HOST-04`, `PROV-02`, dan `SEC-06` adalah implementation yang terverifikasi
   pada boundary yang dinilai, bukan klaim end-to-end MCP exposure.

Implementation work berikutnya harus memakai [MCP implementation gap
backlog](./implementation-gap-backlog.md), sedangkan perubahan capability
expected harus dimulai dari katalog dan keputusan scope baru, bukan dengan
menyembunyikan `❌` atau mengubah evidence `not-verified` menjadi pass dari
register ini.
