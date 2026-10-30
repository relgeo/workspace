# RelGeo MCP — Expected-versus-Observed Reconciliation

**Tanggal:** 2026-10-30  
**Expected source:** [Expected MCP capability catalog](./expected-capability-catalog.md)  
**Observed source:** [MCP implementation audit evidence](./archive/implementation-audit-legacy.md)  
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
| `✔️ implemented` | 10 |
| `🌗 partial` | 40 |
| `⚠️ broken` | 1 |
| `❌ absent` | 15 |
| `⏸️ deferred` | 2 |
| `not-verified evidence rows` | 3 |
| `➖ not-applicable` expected rows | 0 |

`❌` tetap eksplisit untuk capability yang belum ada, termasuk tool executor,
resource resolver, server lifecycle, workflow composition, dan operational
surface. Evidence `not-verified` tetap terpisah pada rows yang memiliki
contract/fixture intent tetapi belum memiliki runtime or cross-host proof.

## 2. One-to-one reconciliation register

Kolom `Audit trace` menunjuk ke section dan ID row pada audit current. Kolom
`Scope decision` tidak menggantikan status implementation; misalnya capability
desktop yang memiliki bridge tetapi belum memiliki MCP adapter tetap `🌗`, dan
capability yang belum ditemukan tetap `❌` walaupun source-of-truth-nya dimiliki
package lain.

| ID | Expected user outcome | Result | Implementation status | Evidence status | Scope decision | Audit trace |
| --- | --- | --- | --- | --- | --- | --- |
| `DISC-01` | U1 mencari vocabulary/rule dari intent natural-language. | `🌗` | `partial` | `partial-local` | In scope; MCP orchestration + `spec/id`. | Audit §4.1, `DISC-01` |
| `DISC-02` | Agent menerima discovery dari `specVersion` yang benar. | `🌗` | `partial` | `partial-local` | In scope; version filter/resolver belum ada. | Audit §4.1, `DISC-02` |
| `REF-01` | U1/U2 menelusuri index dan rule lengkap berdasarkan `ruleId`. | `🌗` | `partial` | `partial-local` | In scope; resource layer + normative spec. | Audit §4.1, `REF-01` |
| `REF-02` | Agent meminta satu syntax rule terarah. | `🌗` | `partial` | `partial-local` | In scope; typed tool contract, executor belum ada. | Audit §4.1, `REF-02` |
| `EX-01` | U1 menemukan example minimal yang relevan. | `🌗` | `partial` | `partial-local` | In scope; examples bundle/resolver belum ada. | Audit §4.1, `EX-01` |
| `EX-02` | Agent menerima example kecil yang valid dan bounded. | `❌` | `absent` | `verified-absence` | In scope; retrieval/ranking policy belum diimplementasikan. | Audit §4.1, `EX-02` |
| `COMP-01` | U1/U2 mendapat completion pada source dan position. | `🌗` | `partial` | `partial-local` | In scope; language-service adapter belum ada. | Audit §4.2, `COMP-01` |
| `COMP-02` | Agent membedakan proposal completion dari applied edit. | `🌗` | `partial` | `partial-local` | In scope; DTO ada, runtime proposal belum ada. | Audit §4.2, `COMP-02` |
| `VAL-01` | U1/U2 memperoleh structural/schema validation terstruktur. | `🌗` | `partial` | `partial-local` | In scope; core validation belum dipanggil MCP. | Audit §4.2, `VAL-01` |
| `VAL-02` | Agent memastikan proposal diparse, di-resolve, dan semantic-valid. | `❌` | `absent` | `verified-absence` | In scope; core parse/validate/resolve adapter belum ada. | Audit §4.2, `VAL-02` |
| `VAL-03` | Input sama menghasilkan verdict/diagnostics deterministik lintas host. | `🌗` | `partial` | `not-verified` | In scope; determinism contract ada, cross-host MCP evidence belum ada. | Audit §4.2, `VAL-03` |
| `DIAG-01` | U1/U2 menerima code, severity, message, range, origin, provenance. | `🌗` | `partial` | `partial-local` | In scope; mapping core/language-service belum ada. | Audit §4.2, `DIAG-01` |
| `DIAG-02` | U2 meminta explanation berdasarkan diagnostic code. | `❌` | `absent` | `verified-absence` | In scope; explanation resolver/catalog belum ada. | Audit §4.2, `DIAG-02` |
| `DIAG-03` | Agent membedakan input, proposal, dan active document. | `🌗` | `partial` | `partial-local` | In scope; DTO ada, enforcement runtime belum ada. | Audit §4.2, `DIAG-03` |
| `WF-01` | Agent menjalankan discovery→example→completion→validation→render. | `❌` | `absent` | `verified-absence` | In scope; workflow composition belum callable. | Audit §4.2, `WF-01` |
| `WF-02` | Agent memakai prompt author/debug/explain/review setelah tools stabil. | `⏸️` | `deferred` | `verified-scope` | Roadmap-gated setelah tools/resources stabil. | Audit §4.2, `WF-02` |
| `RENDER-01` | U1/U2 melihat SVG in-memory dari source/proposal. | `🌗` | `partial` | `partial-local` | In scope; core→renderer adapter belum ada. | Audit §4.3, `RENDER-01` |
| `RENDER-02` | U2 memilih `sheetId`/view secara eksplisit. | `🌗` | `partial` | `partial-local` | In scope; sheet/view resolver belum terhubung. | Audit §4.3, `RENDER-02` |
| `RENDER-03` | Render failure menjadi diagnostics/error terstruktur. | `❌` | `absent` | `verified-absence` | In scope; failure mapping belum ada. | Audit §4.3, `RENDER-03` |
| `DOC-01` | U3 membaca active snapshot dengan identity, revision, dirty, diagnostics. | `✔️` | `implemented` | `verified-local` | Host bridge boundary implemented; MCP exposure belum ada. | Audit §4.4, `DOC-01` |
| `DOC-02` | Agent membaca resource active document dengan session guard. | `❌` | `absent` | `verified-absence` | In scope untuk desktop-connected; resource resolver belum ada. | Audit §4.4, `DOC-02` |
| `DOC-03` | Revision naik saat source berubah dan identity reset saat load. | `✔️` | `implemented` | `verified-local` | Host session owns lifecycle; adapter consumer belum ada. | Audit §4.4, `DOC-03` |
| `DOC-04` | U3 melihat direct apply sebagai dirty in-memory document. | `✔️` | `implemented` | `verified-local` | Host/editor owns dirty state; MCP status surface belum ada. | Audit §4.4, `DOC-04` |
| `DOC-05` | U5 memulai/menghentikan session dan revoke access setelah stop. | `🌗` | `partial` | `partial-local` | Token contract ada; server lifecycle belum ada. | Audit §4.4, `DOC-05` |
| `DOC-06` | Save/Save As tetap aksi dokumen terpisah dari agent apply. | `✔️` | `implemented` | `verified-local` | Save boundary owned by desktop host, outside direct apply. | Audit §4.4, `DOC-06` |
| `EDIT-01` | U3 meninjau bounded proposal sebelum apply. | `🌗` | `partial` | `partial-local` | Session contract ada; review surface/protocol call belum ada. | Audit §4.5, `EDIT-01` |
| `EDIT-02` | U3 menerapkan proposal ke active document melalui bridge. | `🌗` | `partial` | `partial-local` | Desktop stage; bridge ada, MCP mutation adapter belum ada. | Audit §4.5, `EDIT-02` |
| `EDIT-03` | Stale identity/revision ditolak tanpa partial mutation. | `✔️` | `implemented` | `verified-local` | Host bridge/session contract owns guard. | Audit §4.5, `EDIT-03` |
| `EDIT-04` | Accepted patch menjadi satu undoable transaction. | `✔️` | `implemented` | `verified-local` | Flutter editor/session boundary implemented. | Audit §4.5, `EDIT-04` |
| `EDIT-05` | Caller membedakan applied, stale, rejected, dan failed. | `🌗` | `partial` | `partial-local` | DTO states ada; protocol serialization/coverage belum lengkap. | Audit §4.5, `EDIT-05` |
| `RES-01` | Agent melakukan list/read pada canonical resource URI. | `🌗` | `partial` | `partial-local` | URI contract ada; production resolver belum ada. | Audit §4.6, `RES-01` |
| `RES-02` | U2 membaca diagnostics catalog versioned. | `❌` | `absent` | `verified-absence` | In scope; catalog content/resolver belum ada. | Audit §4.6, `RES-02` |
| `RES-03` | U1/U4 memakai bundled snapshot saat offline. | `❌` | `absent` | `verified-absence` | In scope; packaged spec/examples snapshot belum ada. | Audit §4.6, `RES-03` |
| `RES-04` | U2 mendapat cache/fallback dengan identity revision/TTL jelas. | `❌` | `absent` | `verified-absence` | In scope; cache/fallback layer belum ada. | Audit §4.6, `RES-04` |
| `PROV-01` | Setiap documentation result membawa source, URL, version, revision, fetchedAt. | `🌗` | `partial` | `partial-local` | In scope; DTO ada, result-producing adapter belum ada. | Audit §4.7, `PROV-01` |
| `PROV-02` | U2 dapat membedakan spec normative dari website/examples explanatory. | `✔️` | `implemented` | `verified-local` | Normative precedence owned by provenance contract. | Audit §4.7, `PROV-02` |
| `PROV-03` | Proposal membawa chain rule/example/source melalui `basedOn[]`. | `🌗` | `partial` | `partial-local` | In scope; proposal producer belum ada. | Audit §4.7, `PROV-03` |
| `TRAN-01` | Client menyelesaikan initialize/initialized lifecycle dan negotiation. | `🌗` | `partial` | `partial-local` | Fixture boundary only; SDK adapter belum dipilih. | Audit §4.8, `TRAN-01` |
| `TRAN-02` | Client menemukan dan memanggil tools/resources typed melalui MCP. | `🌗` | `partial` | `partial-local` | Fixture wire surface ada; RelGeo dispatch belum ada. | Audit §4.8, `TRAN-02` |
| `TRAN-03` | U4 menjalankan standalone server via stdio. | `🌗` | `partial` | `partial-local` | Fixture stdio ada; standalone RelGeo entrypoint belum ada. | Audit §4.8, `TRAN-03` |
| `TRAN-04` | U3 memakai Streamable HTTP loopback desktop. | `🌗` | `partial` | `environment-unavailable` | Production adapter pending; local socket bind unavailable. | Audit §4.8, `TRAN-04` |
| `TRAN-05` | Remote host exposure ditolak. | `🌗` | `partial` | `partial-local` | Policy/fixture boundary ada; production transport belum ada. | Audit §4.8, `TRAN-05` |
| `TRAN-06` | SDK dapat diganti tanpa mengubah contract/session/security. | `🌗` | `partial` | `partial-local` | Contract boundary ada; adapter package belum ada. | Audit §4.8, `TRAN-06` |
| `HOST-01` | Package MCP pure-Dart dapat dipakai standalone dan Flutter. | `✔️` | `implemented` | `verified-local` | Contract package boundary implemented; not full server delivery. | Audit §4.9, `HOST-01` |
| `HOST-02` | U3 Enable/Disable MCP Server mengikuti app lifecycle. | `❌` | `absent` | `verified-absence` | In scope desktop host; lifecycle supervisor belum ada. | Audit §4.9, `HOST-02` |
| `HOST-03` | U3/U5 melihat status, endpoint, clients, permission, copy config, Stop. | `❌` | `absent` | `verified-absence` | In scope desktop operational UI; route/surface belum ada. | Audit §4.9, `HOST-03` |
| `HOST-04` | Server meminta active source/diagnostics dan submit edit via typed bridge. | `✔️` | `implemented` | `verified-local` | Flutter bridge composition implemented; protocol adapter belum ada. | Audit §4.9, `HOST-04` |
| `HOST-05` | Agent memakai shared context document→language-service→core→renderer. | `❌` | `absent` | `verified-absence` | In scope as composition; no MCP wiring found. | Audit §4.9, `HOST-05` |
| `ERR-01` | Client mendapat typed errors untuk schema, bounds, unknown tool, invalid URI. | `⚠️` | `broken` | `verified-defect` | In scope; JSON schema/DTO parity must be repaired. | Audit §4.10, `ERR-01` |
| `ERR-02` | Domain failures mempertahankan code/message/range/origin. | `❌` | `absent` | `verified-absence` | In scope; core/language-service error mapping belum ada. | Audit §4.10, `ERR-02` |
| `ERR-03` | Caller membedakan auth, forbidden, no-session, stale, rejected, failed, stopped. | `🌗` | `partial` | `partial-local` | Session contract exists; protocol mapping belum ada. | Audit §4.10, `ERR-03` |
| `ERR-04` | Failed read/render/mutation tidak mengubah active document dan tidak dilaporkan applied. | `🌗` | `partial` | `partial-local` | Bridge atomicity ada; transport/error path belum ada. | Audit §4.10, `ERR-04` |
| `CXL-01` | Client/host membatalkan request tanpa stale result atau mutation. | `❌` | `absent` | `verified-absence` | In scope; request registry/abort semantics belum ada. | Audit §4.10, `CXL-01` |
| `CXL-02` | Stop/revoke/disconnect membatalkan pending work dan mutation commit. | `🌗` | `partial` | `not-verified` | In scope; revoke contract ada, real server lifecycle belum ada. | Audit §4.10, `CXL-02` |
| `SEC-01` | Endpoint desktop disabled sampai user mengaktifkannya. | `🌗` | `partial` | `partial-local` | Policy default ada; host enable control belum ada. | Audit §4.11, `SEC-01` |
| `SEC-02` | Hanya client local yang dapat mencapai desktop server. | `🌗` | `partial` | `partial-local` | Loopback policy/fixture ada; production transport belum ada. | Audit §4.11, `SEC-02` |
| `SEC-03` | Setiap session memakai opaque token yang expiry/revoke dan tidak dipersist. | `🌗` | `partial` | `partial-local` | Token store implemented; server authentication wiring belum ada. | Audit §4.11, `SEC-03` |
| `SEC-04` | Read-only token tidak dapat memanggil mutation. | `🌗` | `partial` | `partial-local` | Token scope contract/test ada; per-call adapter check belum ada. | Audit §4.11, `SEC-04` |
| `SEC-05` | Agent hanya membaca/menulis active session document. | `🌗` | `partial` | `partial-local` | Bridge/revision guard ada; active resource route belum ada. | Audit §4.11, `SEC-05` |
| `SEC-06` | Patch dibatasi ukuran, jumlah, range, overlap, dan source size. | `✔️` | `implemented` | `verified-local` | Session contract + bridge enforce bounds. | Audit §4.11, `SEC-06` |
| `SEC-07` | Direct apply tidak melakukan filesystem/save/export/autosave. | `🌗` | `partial` | `partial-local` | Host policy/boundary ada; real protocol adapter belum ada. | Audit §4.11, `SEC-07` |
| `SEC-08` | User melihat operational status tanpa secret leakage dan dapat mematikan server. | `❌` | `absent` | `verified-absence` | In scope desktop operational surface; UI belum ada. | Audit §4.11, `SEC-08` |
| `DEL-01` | U4 menjalankan standalone package/executable yang sama. | `⏸️` | `deferred` | `verified-scope` | CLI/entrypoint ditahan sampai standalone need/conformance jelas. | Audit §4.11, `DEL-01` |
| `DEL-02` | U3 tidak perlu Node.js/npm/runtime kedua untuk embedded MCP. | `🌗` | `partial` | `partial-local` | Dart path dependency ada; embedded server belum ada. | Audit §4.11, `DEL-02` |
| `DEL-03` | Maintainer memiliki fixture, error, metadata, bind rejection, Inspector evidence. | `🌗` | `partial` | `not-verified` | Delivery gate in scope; no live CI/adapter/Inspector evidence. | Audit §4.11, `DEL-03` |
| `DEL-04` | U5 memperoleh desktop artifacts dengan runtime MCP smoke evidence. | `🌗` | `partial` | `partial-local` | Desktop artifact CI ada; MCP runtime smoke belum ada. | Audit §4.11, `DEL-04` |
| `DEL-05` | Release candidate dapat ditelusuri ke revisions, SDK, OS, run, tanggal. | `🌗` | `partial` | `partial-local` | Provenance fields/CI summaries ada; MCP release evidence belum ada. | Audit §4.11, `DEL-05` |
| `DEL-06` | U3/U4/U5 dapat mengonfigurasi endpoint/token dan memahami limitations. | `🌗` | `partial` | `partial-local` | Docs/fixture runbook ada; real-server operations belum ada. | Audit §4.11, `DEL-06` |

## 3. Findings dan handoff

1. Expected catalog dan audit memiliki join 68/68; tidak ada expected row yang
   dihapus atau diganti menjadi `➖` karena implementation belum ditemukan.
2. Strongest observed implementation adalah pure-Dart contract/session slice,
   Flutter active-document bridge, dan dependency-free protocol fixture. Itu
   belum sama dengan production MCP server/tool/resource delivery.
3. `ERR-01` adalah defect terkonfirmasi yang perlu diperbaiki sebelum schema
   dianggap trusted: beberapa properties DTO tidak tercermin pada JSON schema.
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
