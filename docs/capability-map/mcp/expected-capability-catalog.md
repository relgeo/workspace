# RelGeo MCP — Expected Product Capability Catalog

**Status:** expected catalog selesai sebelum audit; implementation audit tersedia terpisah  
**Tanggal baseline:** 2026-10-30  
**Owner koordinasi:** `relgeo/workspace`  
**Owner package/protocol:** `relgeo_mcp`  
**Owner desktop host/bridge:** RelGeo Desktop Flutter  
**Compatibility line:** RelGeo DSL `0.5.x`

## 1. Tujuan dan aturan pembacaan

Dokumen ini mendefinisikan kemampuan MCP yang harus tersedia untuk agent
authoring RelGeo dan workflow desktop-connected sebelum dibandingkan dengan
implementasi. Katalog ini diturunkan dari user journey, target pengguna,
workflow produk, tool/resource/prompt contract, roadmap, kontrak DSL, dan
keputusan scope pada sumber yang tercantum di §2.

Kode, test, dan matrix capability lama **bukan sumber daftar awal**. Artefak
tersebut baru boleh dipakai pada audit lanjutan untuk mengisi status
implementasi, evidence, gap, dan follow-up setiap ID. Tidak adanya implementasi
tidak boleh menghapus row expected dari katalog.

`CATALOG-VERIFIED` berarti row memiliki requirement anchor, keputusan scope,
dan owner/source of truth. Ini bukan klaim bahwa kemampuan sudah dibuat,
terhubung ke adapter, lulus conformance, atau usable pada host desktop.

Downstream artifacts are kept separate: [implementation audit](./archive/implementation-audit-legacy.md), [expected-versus-observed reconciliation](./reconciliation.md), [status matrix](./status-matrix.md), and [implementation gap backlog](./implementation-gap-backlog.md).

### 1.1 Target pengguna dan journey

| Kode | Target pengguna | Journey yang harus didukung |
| --- | --- | --- |
| U1 | Author RelGeo baru yang belum hafal syntax | Menyampaikan intent natural-language, menemukan rule dan example yang relevan, membuat source, mendapat completion, memvalidasi, memahami error, lalu melihat render. |
| U2 | Author/reviewer teknis | Memeriksa rule DSL normatif, provenance, diagnostics, source range, dan hasil render tanpa menebak versi atau arti source. |
| U3 | Author desktop yang sedang mengedit | Menghubungkan agent ke dokumen aktif, membaca context/diagnostics, meninjau proposal, menerapkan patch bounded, melihat perubahan, dan Undo bila tidak sesuai. |
| U4 | User/host yang memakai MCP standalone | Menjalankan syntax assistant melalui child process `stdio` tanpa Flutter, Node.js, npm, atau akses filesystem bebas. |
| U5 | Maintainer/operator delivery | Menghidupkan server lokal dengan aman, memantau sesi, menguji protocol/transport, dan merilis artifact dengan provenance yang dapat ditelusuri. |

### 1.2 Source-of-truth legend

| Kode | Source of truth / evidence requirement | Peran dalam katalog |
| --- | --- | --- |
| P11 | `docs/plans/11-mcp-agent-integration.md` | Tujuan MCP, dua mode operasi, tools/resources/prompts, workflow agent, bridge, roadmap, security boundary, dan definition of done. |
| C04 | `docs/mcp/04-mvp-tool-resource-contract.md` | DTO typed, tool catalog, source-kind separation, diagnostics, provenance, dan canonical resource URI. |
| S01 | `docs/mcp/01-session-bridge-security-contract.md` | Active-document snapshot, revision, bounded edit, undo transaction, token, permission, localhost, dan save boundary. |
| T02 | `docs/mcp/02-sdk-transport-spike.md` | Keputusan provisional `stdio`/localhost Streamable HTTP, fixture, SDK neutrality, remote-host rejection, dan offline/environment boundary. |
| T03 | `docs/mcp/03-sdk-conformance-runbook.md` | Acceptance gate adapter: fixture lintas transport, invalid-argument error, protocol metadata, remote bind, dan Inspector. |
| DSL | `spec/id/README.md`, `spec/id/core/01-overview.md`, `02-document-structure.md`, `05-semantic-guarantees.md`, `06-error-model.md`, serta bab `syntax/` | Makna normatif DSL v0.5, pipeline parse→validate→resolve→render, determinisme, tipe, identity, dan error code. |
| F12 | `docs/plans/12-flutter-workbench-capability-baseline.md` dan desktop plans yang dirujuknya | Target desktop/workbench, menu/command/lifecycle, host OS, dan batas delivery; dipakai hanya sebagai requirement context untuk bridge/host. |
| CM | `docs/capability-map/INVENTORY-PROTOCOL.md` dan `docs/capability-map/README.md` | Aturan pemisahan expected catalog dari implementation audit serta klasifikasi evidence; bukan daftar MCP row. |

### 1.3 Integrated consumer and evidence crosswalk

Katalog ini tidak diturunkan hanya dari `mcp/`. MCP memberi boundary contract,
sedangkan consumer berikut menentukan makna kemampuan yang harus dapat
dikomposisikan oleh adapter. Ketiadaan adapter pada salah satu consumer adalah
alasan untuk mempertahankan row expected, bukan alasan untuk menghapusnya.

| Boundary / consumer | Evidence yang dipakai untuk mendefinisikan expectation | Kontribusi ke katalog | Batas yang dijaga |
| --- | --- | --- | --- |
| MCP package | [`mcp/README.md`](../../../mcp/README.md), [`mcp_schema.dart`](../../../mcp/lib/src/contract/mcp_schema.dart), [`session_bridge.dart`](../../../mcp/lib/src/contract/session_bridge.dart), package tests, `mcp/tool/` fixture | Typed inputs/results, source-kind, provenance, canonical resource URI, session/revision/edit contract, token policy, dan transport fixture | Pure Dart; contract tidak otomatis berarti protocol adapter atau production server sudah ada. |
| Normative DSL/spec | [`spec/id/README.md`](../../../spec/id/README.md), `spec/id/core/`, `spec/id/syntax/`, `spec/id/geometry/`, `spec/id/presentation/` | Versioned syntax/reference, semantic guarantees, document model, deterministic validation, and error-code expectations | `spec/id` is normative; website/examples are explanatory and cannot override it. |
| Core runtime | [`core/src/index.ts`](../../../core/src/index.ts), parser/validator/resolver sources and tests | Parse → validate → resolve semantics, structured domain failure, and the shared validation pipeline used by MCP tools | MCP must not invent a second semantic engine or silently turn a failed resolve into success. |
| Language service | [`language-service/src/service.ts`](../../../language-service/src/service.ts), [`completions.ts`](../../../language-service/src/completions.ts), `schema.ts`, package tests | Completion proposals, editor diagnostics, source ranges, and tolerant authoring behavior | Completion remains a proposal; diagnostics preserve code/severity/range and are not implicit edits. |
| SVG renderer | [`renderer-svg/src/index.ts`](../../../renderer-svg/src/index.ts), [`types.ts`](../../../renderer-svg/src/types.ts), renderer tests and fixtures | In-memory SVG render, sheet/view targeting, semantic render failures, and visual authoring outcome | MCP render has no `outputPath`, Save, export, or arbitrary filesystem side effect. |
| CLI consumer | [`cli/src/index.ts`](../../../cli/src/index.ts), [`cli/README.md`](../../../cli/README.md), CLI tests | Existing user-facing `info`, `compile`, `check`/`validate`, format/output, and error conventions; Plan 11 names CLI as a possible MCP host | CLI behavior is a consumer reference and does not imply direct MCP parity or a new CLI command in this catalog. |
| Flutter desktop host | [`flutter/lib/src/mcp/workbench_agent_bridge.dart`](../../../flutter/lib/src/mcp/workbench_agent_bridge.dart), document session/editor controller, [`workbench_commands.dart`](../../../flutter/lib/src/ui/workbench_commands.dart), file service, bridge tests | Active-document identity/revision/dirty state, bounded apply, one undoable transaction, host lifecycle, Save boundary, and desktop command/menu expectations | Flutter owns widgets, file lifecycle, undo/redo, and server lifecycle; `relgeo_mcp` remains transport/UI agnostic. |
| Workspace fixtures and delivery | [`fixtures/manifest.json`](../../../fixtures/manifest.json), `scripts/run-conformance-fixtures.mjs`, MCP child workflow, and [`docs/MATURATION-MASTER-PLAN.md`](../../MATURATION-MASTER-PLAN.md) | Cross-consumer compatibility, reproducible evidence, package/submodule provenance, and the distinction between component tests and delivery/runtime gates | Fixture or CI success is evidence for its boundary only; it does not prove callable MCP runtime delivery. |

### 1.4 Workflow, menu, and command crosswalk

The following surfaces are product requirements used to derive the rows in §3.
They are recorded explicitly so the catalog covers user-visible workflows and
host-owned commands, not only DTO names.

| Surface | Workflow / commands | Expected catalog consequence | Source anchors |
| --- | --- | --- | --- |
| Standalone agent authoring | Intent → `relgeo_find_syntax`/`relgeo_get_examples` → completion/proposal → validation → diagnostics/explanation → SVG render | `DISC-*`, `REF-*`, `EX-*`, `COMP-*`, `VAL-*`, `DIAG-*`, `WF-01`, `RENDER-*` remain expected even without a callable adapter | Plan 11 §§1, 4.1, 5; C04 §§2–4 |
| Readable reference/resources | `tools/list`, `tools/call`, `resources/list`, `resources/read`; canonical `relgeo://spec/*`, `relgeo://examples/*`, `relgeo://diagnostics/catalog` | `RES-*`, `PROV-*`, `TRAN-01`, `TRAN-02`, and version/offline rows remain separate from implementation evidence | Plan 11 §4.2–4.3; C04 §§4–5; T02/T03 |
| Desktop MCP settings | `Settings / Tools / MCP Server`; Enable MCP Server; status; endpoint; Copy agent configuration; connected clients; permission; Stop server | `HOST-02`, `HOST-03`, `SEC-01`, `SEC-08`, `DOC-05`, and `DEL-06` cover the operational workflow | Plan 11 §§7–8; S01; F12 |
| Host document lifecycle | File: New/Open/Recent/Save/Save As/Close/Quit; Edit: Undo/Redo/Copy source; Document: Recompile; File → Export → SVG Model or Sheet/View | `DOC-*`, `EDIT-04`, `DOC-06`, `RENDER-02`, and `SEC-07` explicitly preserve host ownership; MCP direct apply must not bypass these commands | `flutter/lib/src/ui/workbench_commands.dart`, `flutter/lib/src/ui/cad_workbench.dart`, `flutter/lib/src/ui/workbench_file_service.dart`, S01 |
| CLI/automation context | `info`, `compile`, `check`/`validate`, machine-readable output, exit/error behavior | CLI is an integrated consumer context for `DEL-*`/`HOST-05`; any direct CLI MCP exposure remains a future adapter decision | `cli/src/index.ts`, `cli/README.md`, Plan 11 §2.1 |
| Agent desktop edit | Read active document → inspect diagnostics → propose bounded patch → apply with base revision → inspect result → user Undo/Save | `DOC-01`–`DOC-06`, `EDIT-01`–`EDIT-05`, `ERR-03`–`ERR-04`, and `SEC-03`–`SEC-07` are required together but remain separately auditable | Plan 11 §6–7; S01; Flutter bridge |

## 2. Keputusan scope yang mengikat

1. MCP adalah capability lintas-RelGeo. Standalone syntax assistant dan
   desktop-connected assistant sama-sama expected; MCP bukan fitur Flutter
   semata (P11).
2. Tool MVP bersifat read-only dan tidak menulis filesystem. Direct edit adalah
   capability tahap desktop session bridge yang terpisah dengan token
   read-write, revision guard, dan satu transaksi undoable (P11, C04, S01).
3. `relgeo/spec`/`spec/id` adalah sumber normatif. Website, examples, dan
   material explanatory tidak boleh mengubah arti rule atau mengalahkan versi
   spec yang dipin (P11, C04, DSL).
4. Snapshot spec/examples harus versioned dan usable offline. Remote fetch,
   website, dan GitHub hanya fallback/penjelasan setelah revision dan versi
   diperiksa (P11, T02).
5. `stdio` adalah target standalone; Streamable HTTP hanya untuk server desktop
   yang bind ke `127.0.0.1`. Remote HTTP bukan MVP dan belum memiliki keputusan
   deployment/authentication (P11, T02).
6. Package MCP tetap pure Dart dan tidak bergantung pada widget, `BuildContext`,
   Node.js, npm, atau arbitrary filesystem. Flutter menjadi host/lifecycle
   supervisor dan memasang bridge (P11, S01).
7. Save, Save As, export, dan autosave bukan efek samping direct apply. Patch
   hanya mengubah active in-memory document dan pengguna tetap memakai lifecycle
   dokumen desktop untuk menyimpan (P11, S01).
8. Prompts adalah layer workflow setelah tools/resources stabil; prompt tidak
   boleh menjadi satu-satunya tempat aturan syntax disimpan (P11).
9. SDK Dart belum dipilih. Delivery tidak boleh dianggap siap sampai adapter
   yang dipin lulus fixture/conformance gate yang sama pada transport yang
   relevan (T02, T03).
10. Android/iOS dan remote MCP bukan target delivery catalog ini. Desktop
    targets mengikuti scope yang telah disetujui; detail runtime host tetap
    memerlukan evidence tersendiri (F12 dan keputusan scope).

## 3. Expected capability catalog

Status pada kolom terakhir adalah status verifikasi katalog, bukan status
implementasi.

### 3.1 Discovery, syntax/reference, dan examples

| ID | Capability expected | User outcome | Requirement basis | Scope decision | Owner / source of truth | Verifikasi katalog |
| --- | --- | --- | --- | --- | --- | --- |
| DISC-01 | Intent-to-syntax discovery | U1 dapat mencari vocabulary/rule RelGeo dari pertanyaan intent natural-language. | P11 §1, §4.1, §5; `relgeo_find_syntax` pada C04. | In scope untuk standalone dan desktop-connected; read-only dan bounded result. | `relgeo_mcp` orchestration; normatif `spec/id`, explanatory website/examples | CATALOG-VERIFIED |
| DISC-02 | Version-aware discovery | Agent tidak menerima rule dari spec version yang berbeda dari target request. | P11 §4.3; C04 `specVersion`; DSL versioning. | `specVersion` harus menjadi filter/identity; pencampuran versi ditolak. | `relgeo_mcp`; `spec/id` | CATALOG-VERIFIED |
| REF-01 | Spec index and rule retrieval | U1/U2 dapat menelusuri index dan mengambil rule lengkap berdasarkan `ruleId`. | `relgeo://spec/index`, `relgeo://spec/rules/{ruleId}` pada P11/C04. | Normative content dari snapshot spec; website tidak override. | `relgeo_mcp` resource layer; `spec/id` | CATALOG-VERIFIED |
| REF-02 | Syntax rule tool | Agent dapat meminta satu rule terarah tanpa menerima dump spec yang tidak perlu. | `relgeo_get_syntax_rule` pada P11/C04; P11 §11 risiko prompt dump. | Read-only, typed input, versioned output. | `relgeo_mcp`; `spec/id` | CATALOG-VERIFIED |
| EX-01 | Example index and retrieval | U1 dapat menemukan example minimal yang relevan untuk intent/rule. | `relgeo_get_examples`, `relgeo://examples/index`, dan `.../{exampleId}` pada P11/C04. | Examples explanatory; setiap example tetap harus punya provenance/version context. | `relgeo_mcp`; versioned examples bundle | CATALOG-VERIFIED |
| EX-02 | Minimal valid example selection | Agent menerima contoh kecil yang dapat dipahami dan divalidasi, bukan dump seluruh spec. | P11 §4.4, §5, Tahap 2, §11; DSL minimal document. | In scope sebagai retrieval policy; ranking/maximum result harus bounded. | `relgeo_mcp`; `spec/id` + examples catalog | CATALOG-VERIFIED |

### 3.2 Completion, validation, diagnostics, dan authoring workflow

| ID | Capability expected | User outcome | Requirement basis | Scope decision | Owner / source of truth | Verifikasi katalog |
| --- | --- | --- | --- | --- | --- | --- |
| COMP-01 | Source completion | U1/U2 mendapat completion yang relevan pada source dan posisi tertentu. | `relgeo_complete_source`, `CompletionSourceInput`, dan language-service ownership pada C04; P11 Tahap 2. | Read-only proposal; `position` dan `maxResults` bounded; tidak mengubah source. | `language-service` contract; `relgeo_mcp` adapter | CATALOG-VERIFIED |
| COMP-02 | Completion proposal semantics | Agent dapat membedakan item completion dari perubahan source yang telah diterapkan. | C04 source/proposal separation; P11 §4.1. | Completion adalah proposal dengan label/detail/range yang eksplisit, bukan implicit edit. | `language-service`; `relgeo_mcp` DTO contract | CATALOG-VERIFIED |
| VAL-01 | Structural/schema validation | U1/U2 memperoleh hasil valid/tidak valid untuk struktur, tipe, field, dan version DSL. | P11 §4.1; C04 `relgeo_validate_source`; DSL error phases. | Read-only; hasil mempertahankan source yang divalidasi dan `sourceKind`. | `core` validation contract; normatif `spec/id` | CATALOG-VERIFIED |
| VAL-02 | Semantic parse/resolve validation | Agent dapat memastikan proposal diparse, di-resolve, dan memenuhi semantic contract sebelum disarankan. | DSL pipeline Document→Parser→Validator→Resolver→Geometry Runtime→Renderer; P11 workflow. | Core validation wajib dipakai; source proposal bukan active document. | `core`; normatif `spec/id` | CATALOG-VERIFIED |
| VAL-03 | Deterministic validation result | Input yang sama menghasilkan verdict/diagnostics yang konsisten lintas host. | DSL §5 semantic guarantees; P11 definition of done. | Determinisme adalah contract; platform/transport tidak boleh mengubah makna. | `core`; `spec/id/core/05-semantic-guarantees.md` | CATALOG-VERIFIED |
| DIAG-01 | Structured diagnostics | U1/U2 menerima `code`, severity, message, optional source range, origin, dan provenance. | P11 §4.1 acceptance; C04 `RelGeoDiagnostic`; DSL error model. | Diagnostics tidak boleh hanya berupa free-form text; range may be absent jika error tidak punya lokasi. | `language-service` + `core`; `relgeo_mcp` result contract | CATALOG-VERIFIED |
| DIAG-02 | Diagnostic explanation | U2 dapat meminta penjelasan untuk diagnostic code tanpa mengganti code/severity. | `relgeo_explain_diagnostic` dan `DiagnosticExplanationResult` pada P11/C04. | Explanation explanatory; rule normatif tetap dari spec. | `relgeo_mcp`; `spec/id` + docs snapshot | CATALOG-VERIFIED |
| DIAG-03 | Source-kind distinction | Agent dapat membedakan `input`, `proposal`, dan `activeDocument` pada validation/diagnostics. | C04 source-kind rule; P11 §4.1. | Tidak boleh ada implicit promotion dari proposal menjadi active document. | `relgeo_mcp` contract; Flutter bridge untuk active source | CATALOG-VERIFIED |
| WF-01 | Intent authoring workflow | Agent dapat menjalankan urutan discovery→rule/example→completion/proposal→validation→explanation→render. | P11 §5 sequence diagram dan Definition of Done. | Workflow adalah composition capability, bukan satu tool monolitik atau image-generation feature. | `relgeo_mcp` tools/resources; `spec/id`, `core`, `language-service`, renderer | CATALOG-VERIFIED |
| WF-02 | Debug/explain/review workflow prompts | Agent dapat memakai prompt author/debug/explain/review setelah tools stabil. | P11 §4.4 prompt names dan Tahap 2. | Roadmap-gated setelah tools/resources; prompt tidak menyimpan rule eksklusif. | `relgeo_mcp` prompt layer; P11 + normative spec | CATALOG-VERIFIED (roadmap-gated) |

### 3.3 Rendering

| ID | Capability expected | User outcome | Requirement basis | Scope decision | Owner / source of truth | Verifikasi katalog |
| --- | --- | --- | --- | --- | --- | --- |
| RENDER-01 | Source-to-SVG render | U1/U2 dapat melihat konsekuensi visual dari source/proposal tanpa menulis file. | `relgeo_render_source`, `format=svg`, renderer ownership pada C04; P11 §4.1/§6. | In-memory SVG tool; no `outputPath`, Save, export, or arbitrary filesystem write in MVP. | `renderer-svg`; `core` parse/resolve; `relgeo_mcp` adapter | CATALOG-VERIFIED |
| RENDER-02 | Sheet/view-target render | U2 dapat meminta render target `sheetId`/view yang eksplisit bila source memilikinya. | C04 `sheetId?`; DSL views/sheets chapter; P11 render roadmap. | Target optional tetapi tidak boleh mengubah active document atau menyamarkan invalid source. | `renderer-svg`; normative `spec/id/presentation` | CATALOG-VERIFIED |
| RENDER-03 | Render failure as structured result | Parse/validation/render failure dikembalikan sebagai diagnostics/error terstruktur, bukan crash atau SVG palsu. | C04 mapping `relgeo_render_source`; T03 invalid-argument/error gate; DSL error model. | Failed render tidak boleh dianggap successful render. | `relgeo_mcp` adapter + `core`/renderer contracts | CATALOG-VERIFIED |

### 3.4 Document/session lifecycle

| ID | Capability expected | User outcome | Requirement basis | Scope decision | Owner / source of truth | Verifikasi katalog |
| --- | --- | --- | --- | --- | --- | --- |
| DOC-01 | Active document snapshot | U3 dapat membaca source dokumen yang sedang aktif beserta `documentId`, name, optional path, revision, dirty, dan diagnostics. | P11 §6 session contract; C04 active resource; S01 snapshot invariants. | Hanya desktop-connected active session; tidak ada arbitrary open-document lookup. | Flutter `WorkbenchDocumentSession` via `RelGeoAgentBridge`; session contract `relgeo_mcp` | CATALOG-VERIFIED |
| DOC-02 | Active-document resource | Agent dapat membaca `relgeo://document/active` dan `.../diagnostics` dengan session guard. | P11 resources; C04 canonical URI and active guard. | URI hanya resolve pada connected mode dan token yang sah. | Flutter bridge + `relgeo_mcp` resource resolver | CATALOG-VERIFIED |
| DOC-03 | Document identity/revision lifecycle | Perubahan source menaikkan revision; open/create dokumen lain mengganti identity; Save tidak mengubah source revision. | S01 snapshot/revision invariants; P11 §6. | Monotonic revision dan identity guard adalah boundary contract, bukan UI detail. | Flutter document session; `relgeo_mcp` session contract | CATALOG-VERIFIED |
| DOC-04 | Dirty-state visibility | U3 dapat mengetahui bahwa direct apply mengubah in-memory document menjadi dirty. | P11 §2.2, §6, §7; S01 Save/autosave separation. | Direct apply tidak menyimpan file dan dirty state harus tetap milik host. | Flutter session/editor host | CATALOG-VERIFIED |
| DOC-05 | Session start/stop/revocation | U5 dapat memulai dan menghentikan sesi server; setelah stop, token dan active bridge access tidak berlaku. | P11 §7; S01 token lifecycle; UI status in P11 §8. | Session scoped to one local server instance; no persisted token. | Flutter host + `relgeo_mcp` token/session contract | CATALOG-VERIFIED |
| DOC-06 | Explicit Save/Save As boundary | U3 tetap memakai Save/Save As sebagai aksi dokumen terpisah setelah agent edit. | P11 acceptance §10; S01 §5. | MCP direct apply tidak memanggil Save, Save As, export, file picker, atau autosave. | Flutter file/document lifecycle; bridge boundary S01 | CATALOG-VERIFIED |

### 3.5 Edit transactions

| ID | Capability expected | User outcome | Requirement basis | Scope decision | Owner / source of truth | Verifikasi katalog |
| --- | --- | --- | --- | --- | --- | --- |
| EDIT-01 | Bounded edit proposal | U3 dapat meninjau proposal sebagai bounded non-overlapping ranges dengan summary/rationale sebelum diterapkan. | P11 §6; C04 `SourceProposal`; S01 edit bounds. | Proposal bukan active document dan bukan whole-file overwrite. | `relgeo_mcp` session contract; Flutter bridge | CATALOG-VERIFIED |
| EDIT-02 | Desktop `apply_document_edit` | U3 dapat menerapkan proposal ke active document melalui bridge. | P11 §6/§9 Tahap 4; C04 explicitly separates this from read-only MVP; S01. | Desktop-connected only; read-write token and explicit mutation scope required. | Flutter `RelGeoAgentBridge` + `relgeo_mcp` adapter | CATALOG-VERIFIED |
| EDIT-03 | Base document/revision guard | Patch stale atau ditujukan ke identity lain ditolak tanpa perubahan sebagian. | P11 acceptance §10; S01 stale/rejected rules. | No merge, fuzzy match, fallback document, or silent rebase. | Flutter session bridge; `DocumentEditProposal` contract | CATALOG-VERIFIED |
| EDIT-04 | One undoable transaction | Setiap accepted agent patch menjadi satu history entry yang dapat di-Undo/Redo oleh user. | P11 §2.2, §6, §7; S01 one undoable transaction. | One proposal → one editor setter/history entry; not multiple hidden mutations. | Flutter editor controller + session bridge | CATALOG-VERIFIED |
| EDIT-05 | Apply result states | Agent/user dapat membedakan `applied`, `stale`, `rejected`, dan `failed`, termasuk new revision/diagnostics bila ada. | P11 session contract; S01 result contract; C04 result separation. | Error state tidak boleh dilaporkan sebagai applied. | `relgeo_mcp` session DTO + Flutter bridge | CATALOG-VERIFIED |

### 3.6 Resources, snapshot, dan provenance

| ID | Capability expected | User outcome | Requirement basis | Scope decision | Owner / source of truth | Verifikasi katalog |
| --- | --- | --- | --- | --- | --- | --- |
| RES-01 | Canonical resource URI surface | Agent dapat melakukan list/read pada spec, examples, diagnostics, dan active-document resource yang canonical. | P11 §4.2; C04 `RelGeoResourceUri`. | URI di luar template ditolak sebelum resolver/transport; URI tidak menjadi filesystem path. | `relgeo_mcp` resource contract | CATALOG-VERIFIED |
| RES-02 | Diagnostics catalog resource | U2 dapat membaca katalog code/meaning yang dipakai untuk menjelaskan diagnostic. | P11 `relgeo://diagnostics/catalog`; C04 resource list. | Versioned resource; tidak mengganti structured diagnostic result. | `relgeo_mcp`; DSL error model | CATALOG-VERIFIED |
| RES-03 | Versioned bundled snapshot | U1/U4 tetap dapat memakai syntax/examples saat offline atau remote docs unavailable. | P11 §4.3; P11 Tahap 1; T02 offline boundary. | Snapshot ikut release; remote fetch bukan prerequisite. | `relgeo_mcp` packaging; `spec/id` and examples snapshot | CATALOG-VERIFIED |
| RES-04 | Predictable cache/fallback | U2 mendapat fallback yang jelas dengan revision/TTL, bukan campuran resource remote dan snapshot tanpa identity. | P11 §4.3; T02 revision/cache evidence. | Remote explanatory refresh optional; normative spec stays pinned. | `relgeo_mcp` resource/cache layer | CATALOG-VERIFIED |
| PROV-01 | Documentation provenance | Setiap hasil dokumentasi memuat title/content, source, source URL, specVersion, revision/tag, dan fetchedAt bila relevan. | P11 `DocumentationResult`; C04 provenance fields. | Provenance wajib dipertahankan oleh adapter; field tidak boleh dihapus diam-diam. | `relgeo_mcp` DTO; `spec/id`/website/examples source | CATALOG-VERIFIED |
| PROV-02 | Normative/explanatory precedence | U2 dapat mengetahui bahwa `spec` normative, website explanatory, dan example explanatory. | P11 §4.3; C04 `isNormative` rule; DSL source-of-truth. | Website tidak boleh override spec walau lebih baru/lebih mudah dibaca. | `relgeo_mcp` provenance policy; `spec/id` | CATALOG-VERIFIED |
| PROV-03 | Proposal provenance chain | Agent dapat mengetahui rule/example/source yang mendasari proposal melalui `basedOn[]`. | C04 `SourceProposal`; P11 authoring workflow. | Provenance proposal bounded dan tidak mengubah active document. | `relgeo_mcp` contract | CATALOG-VERIFIED |

### 3.7 Transport dan protocol surface

| ID | Capability expected | User outcome | Requirement basis | Scope decision | Owner / source of truth | Verifikasi katalog |
| --- | --- | --- | --- | --- | --- | --- |
| TRAN-01 | MCP initialization/lifecycle | Client dapat initialize, receive negotiated protocol capabilities, dan complete initialized notification sesuai profile yang dipin. | T02 shared fixture; T03 exact sequence. | Adapter must keep protocol semantics transport-independent; exact SDK remains open until gate. | MCP protocol adapter; T02/T03 | CATALOG-VERIFIED (protocol-detail-open) |
| TRAN-02 | Tool/resource discovery over MCP | Client dapat `tools/list`, `tools/call`, `resources/list`, dan `resources/read` dengan typed schemas/results. | P11 tools/resources; C04 catalog; T02/T03 fixture. | Tool schema must expose bounds and resource URI validation. | MCP protocol adapter + `relgeo_mcp` contract | CATALOG-VERIFIED |
| TRAN-03 | Standalone stdio transport | U4 dapat menjalankan server sebagai local child process dengan stdout hanya protocol dan diagnostics/log ke stderr. | P11 §3.1/§9 Tahap 5; T02/T03. | Standalone target; no remote bind or filesystem side effect. | MCP transport adapter; pure-Dart package | CATALOG-VERIFIED |
| TRAN-04 | Desktop Streamable HTTP loopback transport | U3 dapat terhubung ke endpoint local desktop pada `127.0.0.1` dengan required protocol metadata. | P11 §3.1/§9 Tahap 3; T02/T03. | Bind loopback only; current SDK/HTTP implementation still needs conformance evidence. | MCP transport adapter + Flutter host | CATALOG-VERIFIED (protocol-detail-open) |
| TRAN-05 | Remote transport rejection | Operator tidak dapat accidentally expose server on `0.0.0.0` atau arbitrary remote host. | P11 security boundary; T02 remote-host rejection; T03 gate. | Remote MCP explicitly out of MVP. | MCP transport adapter; `McpSecurityPolicy` | CATALOG-VERIFIED |
| TRAN-06 | SDK-neutral adapter boundary | Pergantian kandidat Dart SDK tidak mengubah DTO, source-of-truth, atau session/security contract. | P11 package decision; T02/T03 isolated candidate rule; C04 protocol-agnostic contract. | Do not pin candidate until all conformance checks pass. | `relgeo_mcp` contract + isolated adapter package | CATALOG-VERIFIED |

### 3.8 Host, bridge, dan command surface

| ID | Capability expected | User outcome | Requirement basis | Scope decision | Owner / source of truth | Verifikasi katalog |
| --- | --- | --- | --- | --- | --- | --- |
| HOST-01 | Pure-Dart MCP package boundary | MCP logic dapat dipakai oleh standalone host dan Flutter tanpa widget/UI dependency. | P11 §2.1, §3.2/§3.3; S01 ownership boundary; C04 package boundary. | `relgeo_mcp` tidak mengimpor Flutter, widget, BuildContext, filesystem, core, atau language-service directly in contract package. | `relgeo_mcp`; package boundary docs | CATALOG-VERIFIED |
| HOST-02 | Flutter embedded server lifecycle | U3 dapat Enable/Disable MCP Server; server start/stop mengikuti app lifecycle dan tidak hidup diam-diam. | P11 Tahap 3 and §7/§8; S01 server/token lifecycle. | Disabled by default; Flutter is lifecycle supervisor, not protocol owner. | Flutter host + `relgeo_mcp` server adapter | CATALOG-VERIFIED |
| HOST-03 | MCP status/configuration surface | U3/U5 dapat melihat stopped/starting/running/error, endpoint, connected clients, permission, copy configuration, dan Stop. | P11 §8 UI minimum. | Token tidak ditampilkan permanen di log/source; status surface local-only. | Flutter MCP settings/tools surface; P11 | CATALOG-VERIFIED |
| HOST-04 | Agent bridge composition | Server dapat meminta active source/diagnostics dan submit edit melalui typed bridge tanpa mengetahui widget internals. | P11 §3.3 bridge methods; C04 ownership table; S01 bridge boundary. | Bridge access dibatasi pada active session dan host callbacks. | Flutter `RelGeoAgentBridge`; `relgeo_mcp` interface | CATALOG-VERIFIED |
| HOST-05 | Shared authoring context | Agent dapat mengonsumsi context dari document session, language-service, core, diagnostics, dan renderer melalui satu workflow. | P11 architecture diagram and §3.3; C04 ownership map. | Cross-component wiring adalah host/adapter concern; each owner retains its contract. | Workspace orchestration + MCP adapter | CATALOG-VERIFIED |

### 3.9 Provenance, cancellation, dan error behavior

| ID | Capability expected | User outcome | Requirement basis | Scope decision | Owner / source of truth | Verifikasi katalog |
| --- | --- | --- | --- | --- | --- | --- |
| ERR-01 | Typed input validation errors | Client mendapat protocol/tool error untuk input schema salah, bounds terlampaui, unknown tool, atau invalid URI; proses tidak crash. | C04 typed bounded inputs; T03 acceptance gate item 3; T02 fixture. | Error harus dapat dibedakan dari domain diagnostic; no silent coercion. | MCP adapter + `relgeo_mcp` DTO contract | CATALOG-VERIFIED |
| ERR-02 | Structured domain error mapping | Parse, validation, resolution, geometry, and constraint failures mempertahankan code/message/range/origin sesuai DSL contract. | C04 validation mapping; DSL §6 error model; P11 acceptance. | Error code normative dari spec; explanatory text tidak boleh mengganti code. | `core`/language-service contracts; `spec/id`; MCP result mapping | CATALOG-VERIFIED |
| ERR-03 | Host/session error states | Client dapat membedakan unauthenticated, forbidden scope, no active session, stale, rejected, failed, unavailable, dan stopped server. | P11 §6/§7; S01 token/result contract; HOST rows. | No fallback to another document/server; failure must be explicit. | `relgeo_mcp` session/security contract + Flutter host | CATALOG-VERIFIED |
| ERR-04 | Error-safe partial work | Invalid/failed read or render tidak mengubah active document; failed mutation tidak dilaporkan applied. | C04 read-only MVP; S01 one transaction; T03 invalid args. | Mutation atomic at proposal boundary; no partial source write. | Flutter bridge + MCP adapter | CATALOG-VERIFIED |
| CXL-01 | Request cancellation/abort | Client/host dapat membatalkan request yang sedang berjalan dan menerima canceled outcome tanpa hasil stale yang diterapkan. | Task scope cancellation/errors; MCP lifecycle/transport acceptance boundary T02/T03; S01 atomic edit. | Exact wire error code/profile remains open until SDK conformance; especially required for long render/validation and before mutation commit. | MCP adapter + Flutter bridge; protocol conformance source T03 | CATALOG-VERIFIED (protocol-detail-open) |
| CXL-02 | Disconnect/stop cancellation safety | Stop server, token revocation, atau disconnect tidak meninggalkan background mutation atau live token. | P11 §7; S01 token revocation/server stop; HOST-02. | Stop is a hard boundary for new calls and pending mutation commit. | Flutter host + MCP session/transport adapter | CATALOG-VERIFIED (protocol-detail-open) |

### 3.10 Security boundary

| ID | Capability expected | User outcome | Requirement basis | Scope decision | Owner / source of truth | Verifikasi katalog |
| --- | --- | --- | --- | --- | --- | --- |
| SEC-01 | Disabled-by-default local server | Desktop tidak membuka MCP endpoint sebelum user mengaktifkannya. | P11 §7/§8; S01 policy defaults. | Explicit user enable required. | Flutter host; `McpSecurityPolicy` | CATALOG-VERIFIED |
| SEC-02 | Loopback origin boundary | Hanya client local yang dapat mencapai desktop server. | P11 §7; T02 loopback-only; T03 remote bind gate. | `127.0.0.1` only; remote HTTP out of scope. | MCP transport adapter | CATALOG-VERIFIED |
| SEC-03 | Per-session opaque token | Setiap server session memiliki token acak yang tidak dipersist dan direvoke saat stop/expiry. | P11 §7; S01 token lifecycle. | Token permission is readOnly or readWrite; no token in source/log. | `McpSessionTokenStore`; Flutter host | CATALOG-VERIFIED |
| SEC-04 | Scope enforcement | Read-only token tidak dapat memanggil apply edit; mutation call perlu read-write scope. | P11 §7 flow; S01 scope policy; C04 apply separation. | Authorization checked on every call before bridge invocation. | MCP adapter + `McpSessionTokenStore` | CATALOG-VERIFIED |
| SEC-05 | Active-session-only mutation | Agent tidak dapat membaca atau menulis dokumen yang bukan active session. | P11 §6/§7; C04 active URI guard; S01 boundary. | No document enumeration, arbitrary path, or fallback target. | Flutter bridge + session contract | CATALOG-VERIFIED |
| SEC-06 | Bounded patch and source size | Mutation tidak dapat melakukan whole-file/unbounded write atau overlapping range. | P11 §7; S01 64 edits/16 KiB/64 KiB/1 MiB bounds. | Bounds are contract validation, not advisory UI limits. | `relgeo_mcp` session contract + bridge | CATALOG-VERIFIED |
| SEC-07 | Filesystem/save isolation | MCP direct apply tidak dapat menulis arbitrary filesystem, Save, Save As, export, atau autosave. | P11 §7/acceptance; S01 §5; C04 render no outputPath. | Explicit file lifecycle remains outside direct apply. | Flutter file service boundary + MCP bridge | CATALOG-VERIFIED |
| SEC-08 | Local operational visibility | User dapat melihat connection/tool status dan mematikan server kapan saja tanpa membocorkan secret. | P11 §7/§8. | Audit/status metadata may exist; token value must not be permanently logged. | Flutter MCP status surface | CATALOG-VERIFIED |

### 3.11 Delivery readiness dan release evidence

| ID | Capability expected | User outcome | Requirement basis | Scope decision | Owner / source of truth | Verifikasi katalog |
| --- | --- | --- | --- | --- | --- | --- |
| DEL-01 | Standalone package/executable readiness | U4 dapat menjalankan standalone mode dengan package yang sama; executable dibuat hanya jika kebutuhan standalone nyata. | P11 §3.2, Tahap 5, risk table; T02 stdio. | Package target private/non-publishable until conformance; CLI command is optional follow-up. | `relgeo_mcp` package; workspace orchestration | CATALOG-VERIFIED (roadmap-gated) |
| DEL-02 | Desktop runtime dependency readiness | U3 tidak perlu memasang Node.js/npm atau runtime kedua untuk memakai embedded MCP. | P11 §3.2, acceptance §10, Tahap 1. | Dart/Flutter embedded runtime; Inspector/Node hanya developer validation. | Flutter packaging + `relgeo_mcp`; P11/T02 | CATALOG-VERIFIED |
| DEL-03 | SDK/transport conformance evidence | Maintainer memiliki evidence fixture, error, protocol metadata, remote-bind rejection, dan Inspector untuk adapter yang dipin. | T03 six-item acceptance gate; T02 evidence matrix. | No SDK lock or production-ready claim before all required checks. | MCP adapter task; T03 | CATALOG-VERIFIED |
| DEL-04 | Desktop artifact and runtime readiness | U5 memperoleh artifact macOS/Linux/Windows dengan build, provenance, and target-runtime smoke evidence yang dipisahkan. | F12 desktop delivery/smoke scope; P11 §9 Tahap 6; delivery decisions. | Build artifact alone is not runtime usability; Android/iOS out of scope. | Flutter desktop delivery + workspace CI | CATALOG-VERIFIED |
| DEL-05 | Version/revision provenance for delivery | Setiap release candidate dapat dilacak ke workspace/package/spec revision, SDK, OS/architecture, run, dan tanggal. | P11 docs/provenance; T02 toolchain baseline; F12 provenance requirements. | Historical evidence tidak diwariskan sebagai current status. | `relgeo/workspace` release evidence + MCP/Flutter docs | CATALOG-VERIFIED |
| DEL-06 | Setup and operational documentation | U3/U4/U5 dapat mengonfigurasi endpoint/token, memahami permission, dan mengetahui offline/remote limitations. | P11 §3.3, §8, §10; T02/T03 runbooks; `mcp/README.md`. | Documentation is delivery prerequisite, not substitute for conformance/runtime evidence. | `relgeo_mcp` README + workspace docs | CATALOG-VERIFIED |

## 4. Catalog handoff ke implementation audit

Katalog ini selesai sebagai expected baseline. Audit berikutnya harus membuat
satu baris evidence untuk setiap ID di §3 tanpa menghapus capability yang belum
terlihat di kode. Minimum field audit:

`implementation status`, `verification status`, `evidence location/revision`,
`observed behavior`, `gap`, `severity`, `dependency`, dan `follow-up owner`.

Audit harus menjaga pemisahan berikut:

- contract vs adapter/host delivery;
- local evidence vs CI/public/runtime evidence;
- implementation failure vs environment unavailable;
- normative spec vs explanatory website/examples;
- direct apply vs Save/export/filesystem lifecycle;
- cancellation protocol detail yang masih open vs capability expected yang
  tetap wajib dipertahankan.

Perubahan terhadap daftar expected hanya boleh dilakukan melalui keputusan scope
baru dan versi katalog berikutnya. Matrix lama, implementasi saat ini, atau
hasil audit tidak boleh mengubah katalog secara diam-diam.

## 5. Catalog completeness proof

The catalog contains **68 expected capability rows** across 18 stable prefixes:

| Prefix | Rows | Coverage |
| --- | ---: | --- |
| `DISC`, `REF`, `EX` | 6 | Intent discovery, normative reference, examples |
| `COMP`, `VAL`, `DIAG`, `WF` | 12 | Completion, validation, diagnostics, and composed authoring workflows |
| `RENDER` | 3 | In-memory SVG and render failure behavior |
| `DOC`, `EDIT` | 11 | Active-document lifecycle and bounded desktop edits |
| `RES`, `PROV` | 7 | Resources, snapshots, cache/fallback, and provenance |
| `TRAN` | 6 | Protocol lifecycle, tools/resources, stdio, loopback HTTP, and SDK boundary |
| `HOST` | 5 | Pure-Dart boundary, host lifecycle/status, bridge, and shared context |
| `ERR`, `CXL` | 6 | Typed/domain/host errors and cancellation safety |
| `SEC` | 8 | Local enablement, token/scope, active-session, bounded patch, and file isolation |
| `DEL` | 6 | Standalone, desktop, conformance, artifact, provenance, and setup readiness |

Coverage against the required discovery dimensions is explicit:

- target users and journeys are U1–U5 in §1.1;
- workflows, menus, and commands are cross-walked in §1.4;
- roadmap and delivery decisions come from P11, F12, T02/T03, and the master
  plan listed in §1.2;
- integrated consumers and their contract contributions are listed in §1.3;
- normative and integration contracts are listed in §1.2 and §1.3; and
- scope decisions and non-goals, including remote HTTP, Android/iOS, arbitrary
  filesystem writes, Save/Save As bypass, and prompt/mutation sequencing, are
  explicit in §2.

Rows intentionally retained as expected-but-not-yet-delivered include the
production adapter, active-resource resolver, prompt layer, loopback runtime,
desktop MCP settings surface, cancellation semantics, bundled snapshots/cache,
and delivery gates. Their absence is part of the expected baseline and is not
silently converted into scope exclusion.
