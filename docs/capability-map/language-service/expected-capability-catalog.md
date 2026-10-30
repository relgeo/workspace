# Expected Language-Service Capability Catalog

Status: expected baseline dibekukan sebelum audit; implementation audit tersedia terpisah  
Tanggal penyusunan: 2026-10-30  
Owner katalog: `relgeo/workspace`  
Owner capability utama: `relgeo/language-service`  
Compatibility target: RelGeo DSL `0.5`

## Tujuan dan aturan pembacaan

Dokumen ini adalah katalog **yang seharusnya tersedia** bagi authoring surface
RelGeo. Ia sengaja dibuat sebelum audit `language-service/src/`, test, atau
matrix capability lama. Katalog ini menetapkan ekspektasi produk dan kontrak;
ia belum menyatakan bahwa capability tersebut sudah diimplementasikan,
terverifikasi, atau tersedia pada setiap consumer.

Setiap row memiliki:

- ID stabil untuk rekonsiliasi satu-per-satu pada audit berikutnya;
- outcome yang terlihat oleh pengguna atau consumer;
- dasar requirement yang dapat ditelusuri;
- keputusan scope untuk membedakan kewajiban language service dari kewajiban
  host/editor;
- owner dan source of truth; serta
- status verifikasi yang secara eksplisit menahan audit implementasi.

Katalog ini adalah baseline **expected**, bukan daftar API yang kebetulan sudah
ada. Karena itu, capability yang belum ada di package, host, atau consumer tetap
dipertahankan sebagai row expected dan tidak boleh dihapus hanya karena audit
nanti menemukan `absent`, `partial`, atau `not verified`.

## Target users dan user journeys

Target user yang menjadi alasan language-service diperlukan adalah:

| User | Kebutuhan utama | Surface yang disentuh |
| --- | --- | --- |
| `U1` — DSL author / designer | Menulis dan memperbaiki dokumen RelGeo tanpa harus menghafal seluruh geometry vocabulary. | Playground source editor, editor embedding, desktop workbench |
| `U2` — editor or product integrator | Memasang intelligence RelGeo pada CodeMirror, Monaco, VS Code, atau editor custom tanpa mengikatnya ke UI tertentu. | `@relgeo/language-service` public package |
| `U3` — Playground user | Mengikuti loop edit → resolve → preview → inspect dan pulih ketika source invalid. | `relgeo/playground` browser IDE |
| `U4` — desktop/workbench user | Membaca diagnostics/context dari active document dan meninjau edit yang aman tanpa kehilangan dirty state atau undo boundary. | Flutter workbench melalui MCP/bridge |
| `U5` — agent/automation integrator | Meminta syntax, completion, validation, dan diagnostic explanation dalam bentuk typed yang dapat diproses. | MCP standalone atau desktop-connected |
| `U6` — maintainer/package consumer | Mengetahui compatibility line, provenance, dan batas capability ketika merilis atau meng-embed package. | npm package, spec, repository map, release workflow |

Journey yang harus tetap bisa dilayani oleh katalog ini:

| Journey | Langkah yang diharapkan | Expected outcome | ID utama |
| --- | --- | --- | --- |
| `J1` — authoring dasar | `U1` membuka source → mengetik struktur/object → meminta completion → melihat token/diagnostic. | Editor memberi bantuan kontekstual tanpa mengubah source secara diam-diam. | `LS-SCHEMA-*`, `LS-TOKEN-001`, `LS-COMP-001`, `LS-DIAG-001..002`, `LS-RANGE-001` |
| `J2` — geometry-aware authoring | `U1` memilih anchor/reference/query → memeriksa semantic meaning → memperbaiki constraint/reference error. | Saran dan diagnosis mengikuti geometry contract dan memiliki lokasi yang bisa ditindaklanjuti. | `LS-COMP-002..003`, `LS-DIAG-003..004`, `LS-HOVER-*`, `LS-VAL-*` |
| `J3` — invalid-source recovery | `U3` membuat source invalid/partial → tetap melihat error yang terpisah → mengedit kembali → preview valid terakhir tetap dikelola host. | Dokumen tidak hilang, error actionable, dan recovery tidak memerlukan restart session. | `LS-REC-*`, `LS-DIAG-002`, `LS-DOC-002`, `LS-INCR-*` |
| `J4` — embedded editor | `U2` mengirim source + cursor/context → menerima schema/diagnostic/token/completion/hover result. | Package dapat dipakai lintas editor dan tidak mengambil alih preference atau UI. | `LS-DOC-001`, `LS-PROTO-*`, `LS-SCHEMA-*`, `LS-RANGE-001` |
| `J5` — agent authoring | `U5` mencari rule/example → melengkapi atau mengusulkan source → memvalidasi → menjelaskan diagnostic. | Agent memperoleh output typed, provenance-aware, dan aman untuk diteruskan ke host. | `LS-CONS-003`, `LS-VERS-002`, `LS-PROTO-*`, `LS-RANGE-001`, `LS-VAL-002` |
| `J6` — active-document desktop | `U4` membaca document identity/revision/diagnostics → meninjau bounded edit → host menolak stale patch atau menerapkan satu undoable transaction. | Language service memasok analysis; session, revision guard, undo, dan Save tetap pada host. | `LS-DOC-003`, `LS-INCR-002`, `LS-CONS-004`, `LS-PROTO-002` |

## Surface workflow dan menu/command inventory

Workflow dan menu di bawah ini adalah input requirement, bukan klaim bahwa
language-service memiliki UI atau command router sendiri. Tanda `boundary`
menunjukkan capability yang harus dapat diintegrasikan tetapi dimiliki host.

| Surface | Workflow/menu/command yang menjadi expectation | Language-service obligation | Boundary owner |
| --- | --- | --- | --- |
| Editor embedding | `type/edit`, `request completion`, `hover/inspect`, `show diagnostics`, `highlight tokens`, `jump to source` | Menyediakan result terstruktur, context-aware, dan source-ranged. | Editor host untuk key binding, popup, focus, dan navigation |
| Playground | `Source` / `Preview` / `Both`; `Inspector`, `Graph`, `Values`, `Errors`; edit → resolve → preview → inspect | Menyediakan analysis, completion, token, metadata, dan diagnostic projection yang membedakan source valid/invalid. | `relgeo/playground` untuk tabs, worker, preview retention, selection, dan recovery UI |
| Markdown | Fenced RelGeo source → syntax highlighting | Menyediakan token vocabulary/ranges yang selaras dengan active contract; tidak menyediakan full editor. | `relgeo/remark-relgeo-hl` |
| MCP standalone | `relgeo_find_syntax`, `relgeo_get_syntax_rule`, `relgeo_get_examples`, `relgeo_complete_source`, `relgeo_validate_source`, `relgeo_explain_diagnostic`, optional `relgeo_render_source` | Menjadi provider completion/validation/diagnostic data dan provenance; tidak menulis filesystem. | `relgeo/mcp` untuk tool/resource/transport |
| MCP desktop-connected | `get_active_document`, `getDiagnostics`, `apply_document_edit`; active document read and bounded patch review | Menyediakan analysis result, ranges, identity/version data yang dapat dijaga terhadap stale request. | Flutter/MCP session bridge untuk token, revision guard, undo/redo, dirty state, Save |
| Package delivery | `npm install @relgeo/language-service`; import public entrypoint; compatibility check | Menjaga editor contract dan provenance pada DSL line yang benar; tidak mendiamkan spec drift. | `relgeo/workspace` release policy dan package owner |

The following are deliberately **not** language-service commands: Save, Save
As, Export, Share, Reset, filesystem write, autosave, Undo/Redo, MCP transport,
and editor preference settings. They remain visible in the workflow inventory
so an audit can prove the boundary instead of silently treating them as absent
package features.

### Sumber enumerasi awal

Daftar awal diturunkan dari requirement dan keputusan berikut, bukan dari kode
atau matrix lama:

| Sumber | Dipakai untuk |
| --- | --- |
| [`docs/MATURATION-MASTER-PLAN.md`](../../MATURATION-MASTER-PLAN.md) §2.3–2.7, §3.1–3.2, §4.4–6 | source-of-truth `spec`, ownership layer, language-service role, dependency ke Playground/Markdown, compatibility line, roadmap priorities, dan aturan pemisahan implementasi/verifikasi/keputusan |
| [`docs/REPOSITORY-MAP.md`](../../REPOSITORY-MAP.md) §1, `Capability inventory boundary`, `Boundary MCP dan Flutter`, `Paket npm Publik`, `Ownership Dokumentasi` | repository/package ownership, consumer boundaries, public package identity, command/menu ownership, dan rule bahwa matrix bukan source of truth |
| [`language-service/README.md`](../../../language-service/README.md) `Features`, `Editor Agnostic`, `Current Scope`, `Roadmap` | user-facing package promise, current editor-intelligence boundary, explicit future capabilities, and non-goals retained as expected rows |
| [`language-service/package.json`](../../../language-service/package.json) `exports`, scripts, peer dependency | public package entrypoint and compatibility integration context; not used to reduce the expected set |
| [`language-service/src/`](../../../language-service/src) and [`language-service/src/__tests__/language_service.test.ts`](../../../language-service/src/__tests__/language_service.test.ts) | package/test surface consulted after requirement discovery to name observable adapters and preserve audit targets; implementation evidence is deferred to the downstream audit |
| [`spec/id/README.md`](../../../spec/id/README.md), [`spec/id/core/01-overview.md`](../../../spec/id/core/01-overview.md), [`spec/id/core/02-document-structure.md`](../../../spec/id/core/02-document-structure.md), [`spec/id/core/06-error-model.md`](../../../spec/id/core/06-error-model.md) | struktur dokumen, typed/deterministic pipeline, validation phases, error vocabulary, source location, dan version default |
| [`docs/plans/05-public-docs-and-playground-hardening.md`](../../plans/05-public-docs-and-playground-hardening.md) §3–5, §6.D | target user journey `edit → resolve → preview → inspect`, source editor, diagnostics/recovery, source jump, dan consumer boundary Playground |
| [`playground/docs/README.md`](../../../playground/docs/README.md), [`playground/docs/LOCAL-FILE-WORKSPACE-PLAN.md`](../../../playground/docs/LOCAL-FILE-WORKSPACE-PLAN.md) §2–7 | lightweight browser IDE, file/document lifecycle, dirty/save/reload semantics, dan keputusan persistence yang tidak boleh dibebankan ke language service |
| [`docs/plans/11-mcp-agent-integration.md`](../../plans/11-mcp-agent-integration.md) §2, §4–6, §8–10 | standalone/desktop-connected workflow, typed tools/resources, structured diagnostics, source ranges, revision guard, dan active-document protocol |
| [`docs/capability-map/README.md`](../README.md), [`docs/capability-map/INVENTORY-PROTOCOL.md`](../INVENTORY-PROTOCOL.md), dan historical [`language-service/capability-matrix.md`](./capability-matrix.md) | discovery categories, expected-before-audit rule, separate implementation/evidence/scope dimensions, and downstream handoff shape; historical matrix is not allowed to delete expected rows |
| Keputusan scope pada master plan, repository map, dan plan Playground/MCP | language service editor-agnostic; tidak memiliki source of truth normatif, storage, filesystem write, autosave, transport, command router, atau preference UI |

`docs/compatibility-matrix.json` dibaca **setelah** enumerasi sebagai evidence
policy untuk compatibility line, version acceptance, package/consumer boundary,
dan release order. Ia bukan sumber daftar awal. `docs/capability-map/*` dan
implementasi `language-service/` tidak dipakai untuk menghapus requirement dari
enumerasi. Keduanya dipakai untuk menentukan cara audit downstream harus
merekonsiliasi expected IDs dengan implementation, evidence, dan scope.

### Roadmap and contract decisions that shape the catalog

| Decision/source | Catalog consequence |
| --- | --- |
| Active DSL compatibility line is `0.5.x`; `spec` owns normative meaning; package can move by patch only when the contract remains compatible. | Keep version acceptance/provenance and package compatibility as expected capabilities; do not treat a local schema as the authority. |
| Master-plan dependency flow is `spec → core → language-service → Playground/remark-relgeo-hl`; `language-service` is the intelligence layer. | Expect core-backed validation and editor projections, while keeping parse/resolve and rendering owned by their repositories. |
| Playground roadmap prioritizes edit → resolve → preview → inspect, diagnostics/recovery, source jump, and bounded UI state. | Keep recovery, ranges, navigation, and consumer integration rows even when the package does not own preview/UI state. |
| MCP roadmap first targets syntax discovery, completion, validation, diagnostic explanation, provenance, and active-document safety; remote transport and arbitrary filesystem writes are out of MVP scope. | Keep typed/provenance/range/boundary rows; explicitly exclude remote access and filesystem mutation. |
| `language-service/README.md` roadmap names hover, graph inspection, inline preview, symbol navigation/rename, incremental diagnostics, and official LSP as future direction. | Retain these as expected product outcomes where they serve the journeys, but mark them requirement-confirmed and implementation-audit-pending rather than present. |
| `docs/REPOSITORY-MAP.md` assigns source, core, language-service, Playground, MCP, Flutter, and Markdown ownership separately. | Keep parser/resolve, UI, session, transport, and rendering as explicit boundaries; do not collapse them into a language-service implementation claim. |

### Provenance key for every expected row

The rows below use the following requirement families: `U` target users,
`J` journeys, `W` workflow/menu inventory, `R` roadmap, `C` normative or
protocol contract, and `S` scope/boundary decision. Every row is backed by at
least one contract/scope source and one product/workflow source; rows that are
future or boundary capabilities remain expected even when no implementation is
presupposed.

| Row family | Primary provenance families |
| --- | --- |
| Diagnostics and validation | `U1/U3/U5`, `J1/J2/J3/J5`, `W` editor/Playground/MCP, `C` spec error model + core pipeline, `S` projection boundary |
| Schema and tokenization | `U1/U2/U3`, `J1/J4`, `W` editor/Markdown, `R` package/editor roadmap, `C` document structure, `S` editor-agnostic boundary |
| Completion | `U1/U2/U5`, `J1/J2/J4/J5`, `W` editor/Playground/MCP, `R` completion-oriented package promise, `C` geometry vocabulary, `S` no general solver |
| Hover, ranges, navigation | `U1/U2/U3/U5`, `J2/J4/J5/J6`, `W` hover/inspect/source jump, `R` hover/navigation roadmap, `C` source locations/provenance, `S` host-owned UI |
| Document/protocol/version/recovery | `U3/U4/U5/U6`, `J3/J5/J6`, `W` update/active-document/apply flow, `R` MCP and Playground roadmap, `C` compatibility/session contracts, `S` no autosave/filesystem/transport ownership |
| Consumer and delivery integration | `U2/U3/U4/U5/U6`, `J4/J5/J6`, `W` Playground/Markdown/MCP/package commands, `R` master-plan dependency/release order, `C` repository map/package line, `S` repository ownership |

## Keputusan scope katalog

### In scope

Language service diharapkan menyediakan intelligence yang dapat dipakai oleh
editor atau protocol adapter: validation/diagnostics, schema, tokenization,
completion, hover/metadata, source ranges, version policy, dan kontrak request /
response yang aman untuk update dokumen.

### Boundary only

Parser/resolver dan semantic truth tetap milik `spec/id` dan `@relgeo/core`;
language service memproyeksikan hasilnya ke authoring contract. Worker scheduling,
local persistence, UI panel, preview retention, undo/redo, Save/Export, MCP
transport, dan filesystem adalah tanggung jawab consumer/host. Capability yang
menentukan data atau adapter boundary tetap dicatat agar integrasinya dapat
diuji, tetapi tidak dianggap sebagai implementasi internal language service.

### Out of scope untuk katalog ini

- general-purpose constraint solver;
- 3D, animation/timeline, scripting/control flow;
- arbitrary filesystem mutation atau autosave dari language service;
- editor-specific preference system;
- remote MCP transport atau remote document access;
- membuat feature baru Playground hanya demi menambah jumlah capability.

## Katalog expected

Status pada kolom terakhir berlaku untuk seluruh row: requirement telah
dikonfirmasi dari sumber di atas; **audit implementasi belum dimulai**.

| ID | Capability expected | User outcome | Dasar requirement | Scope decision | Owner / source of truth | Status verifikasi |
| --- | --- | --- | --- | --- | --- | --- |
| `LS-DIAG-001` | Structured diagnostic envelope | Editor/agent menerima `severity`, `code`, pesan, dan lokasi yang dapat ditampilkan atau diproses tanpa parsing text bebas. | Spec error model §6.1–6.7; MCP plan §4.1 dan §10. | In scope; vocabulary semantic berasal dari spec/core, projection dimiliki language service. | `relgeo/language-service`; normatif `spec/id/core/06-error-model.md`, semantic owner `relgeo/core`. | Requirement confirmed; implementation audit pending |
| `LS-DIAG-002` | Syntax/parse diagnostics untuk source tidak lengkap | Saat user sedang mengetik YAML/DSL yang belum selesai, editor memberi error yang actionable dan tetap dapat melanjutkan editing. | Spec pipeline parser → validator; Playground edit/resolve/recovery flow §5.2 dan §6.D; MCP authoring loop §5. | In scope sebagai editor-facing projection; parser tetap boundary `core`. | `relgeo/language-service` + `relgeo/core`; `spec/id/core/01-overview.md`. | Requirement confirmed; implementation audit pending |
| `LS-DIAG-003` | Semantic/reference diagnostics | User mendapat diagnosis untuk unknown reference, circular dependency, invalid expression, component/export, dan masalah relasi yang dapat dijelaskan dengan code stabil. | `spec/id/core/06-error-model.md` §6.1, §6.4; language-service consumer goal pada master plan §3.1. | In scope; language service tidak menciptakan semantic truth baru. | `relgeo/core` untuk semantics; `relgeo/language-service` untuk editor contract; `spec/id/core/06-error-model.md`. | Requirement confirmed; implementation audit pending |
| `LS-DIAG-004` | Geometry/constraint diagnostics pasca-resolve | Preview tetap dapat menjelaskan constraint violation atau geometry failure tanpa mengubah geometri secara diam-diam. | Spec error model §6.2–6.6; Playground runtime diagnostic dan Errors inspector pada plan 05 §5.2/§6.D. | In scope sebagai diagnostics projection; resolved scene/constraint evaluation milik core. | `relgeo/core` + `relgeo/language-service`; `spec/id/core/06-error-model.md`. | Requirement confirmed; implementation audit pending |
| `LS-VAL-001` | Structural and typed validation | User mendapat umpan balik untuk root sections, field wajib, unknown field, enum, tipe, dan bentuk nilai sebelum resolve. | Spec document structure §2.1–2.3; error model §6.5 dan validation phases §6.7. | In scope; tidak menggantikan validator runtime. | `spec/id/core/02-document-structure.md`, `spec/id/core/06-error-model.md`; adapter `relgeo/language-service`. | Requirement confirmed; implementation audit pending |
| `LS-VAL-002` | Core-backed semantic validation boundary | Source proposal dari editor, Playground, atau agent harus melewati validation/resolve yang sama sebelum diperlakukan valid. | Spec pipeline §1.3; MCP plan §2, §5, §10; master plan source-of-truth rule §2.3. | In scope sebagai integration contract; core adalah authority semantic. | `relgeo/core` dan `spec/id`; language service/MCP/Playground adalah consumers. | Requirement confirmed; implementation audit pending |
| `LS-SCHEMA-001` | Versioned JSON Schema untuk struktur DSL | YAML-aware editor dapat memberi field/type completion dan structural validation dari schema yang versioned. | Language-service package contract; spec document structure; master plan layer role §3.1. | In scope; schema tidak boleh mengalahkan rule normatif spec. | `relgeo/language-service` untuk published schema; normatif `spec/id`. | Requirement confirmed; implementation audit pending |
| `LS-SCHEMA-002` | Schema coverage untuk typed geometry vocabulary | Editor mengenali section, object type, geometry fields, parameters, anchors, placement, constraints, views/sheets, dan metadata yang termasuk contract aktif. | `spec/id/README.md` chapter map; `spec/id/core/02-document-structure.md`; spec summary. | In scope untuk active contract; unsupported domain/feature tidak boleh diiklankan sebagai available. | `spec/id` sebagai contract; `relgeo/language-service` sebagai schema adapter. | Requirement confirmed; implementation audit pending |
| `LS-TOKEN-001` | Context-preserving tokenization | Source editor/highlighter dapat membedakan token RelGeo/YAML dengan range yang konsisten meskipun source sedang invalid. | Master plan layer role language-service §3.1; Playground editor surface; Markdown highlighting consumer boundary §3.2. | In scope untuk lexical/editor projection; bukan semantic validation. | `relgeo/language-service`; consumer `playground` dan `remark-relgeo-hl`. | Requirement confirmed; implementation audit pending |
| `LS-COMP-001` | Structural/context-aware completion | Saat cursor berada pada root/section/object/field, editor menyarankan key dan value yang valid untuk konteks tersebut. | Language-service product contract; Playground loop `edit → resolve`; spec document structure. | In scope; editor UI rendering tetap milik host. | `relgeo/language-service`; normative `spec/id/core/02-document-structure.md` dan chapter terkait. | Requirement confirmed; implementation audit pending |
| `LS-COMP-002` | Geometry-aware semantic completion | User/agent mendapat saran anchor, query, placement, transform, path, tangent/intersection, dan reference yang sesuai semantic context. | `spec/id` geometry chapters; MCP plan §4.1 tools dan §5 authoring workflow; target product authoring pada spec overview. | In scope bila suggestion dapat diturunkan dari contract/source context; bukan general solver. | `relgeo/language-service` dengan semantic data dari `relgeo/core`; `spec/id/geometry/`. | Requirement confirmed; implementation audit pending |
| `LS-COMP-003` | Completion under partial/error state | Completion tetap berguna setelah typo atau source belum lengkap, sehingga user dapat pulih tanpa restart document session. | Playground recovery principle §4.9, state flow §6.D; MCP validation-as-loop §5. | In scope sebagai behavior contract; error recovery UI tetap host boundary. | `relgeo/language-service`; consumer `playground`. | Requirement confirmed; implementation audit pending |
| `LS-HOVER-001` | Hover documentation untuk syntax dan field | User dapat memahami keyword, field, type, enum, atau reference tanpa meninggalkan editor. | Playground README architecture identifies hover intelligence; MCP `get_syntax_rule`/resources §4; spec README reading path. | In scope; explanatory text tidak boleh mengubah makna spec. | `relgeo/language-service`; normative `spec/id`, explanatory source dapat website/examples dengan provenance. | Requirement confirmed; implementation audit pending |
| `LS-HOVER-002` | Semantic metadata/inspection result | Hover atau metadata query dapat menjelaskan tipe, nilai/hasil yang diketahui, reference target, dan provenance version tanpa mengklaim lebih dari evidence. | Spec typed/deterministic/dependency-ordered principles; Playground inspector/graph workflow; MCP active-document result §6. | In scope sebagai metadata contract; full inspector UI dan graph visualization boundary consumer. | `relgeo/language-service` untuk projection; `relgeo/core` untuk semantic result; `spec/id` untuk meaning. | Requirement confirmed; implementation audit pending |
| `LS-RANGE-001` | Exact source ranges pada seluruh editor result | Diagnostic, token, completion, hover, dan semantic reference menunjuk line/character atau offset yang dapat dipakai editor untuk highlight dan replacement. | MCP plan §4.1, §9 acceptance; source ranges pada `DocumentEditProposal`; Playground source jump. | In scope; format adapter boleh berbeda, tetapi mapping harus lossless pada boundary yang dipilih. | `relgeo/language-service`; protocol adapter `relgeo/mcp`; consumer `playground`. | Requirement confirmed; implementation audit pending |
| `LS-RANGE-002` | Source-to-semantic navigation | User dapat berpindah dari error/inspector/graph/reference kembali ke source location yang relevan. | Playground plan §6.D selection, related depth, graph, values, dan source jump; structured diagnostics. | Boundary integration: language service menyediakan location identity; host menyediakan navigation action. | `relgeo/language-service` + `playground`; semantic source path berasal `core`. | Requirement confirmed; implementation audit pending |
| `LS-DOC-001` | Editor-agnostic document analysis API | CodeMirror, Monaco, VS Code extension, custom Playground, atau host lain dapat mengirim source + cursor/context dan menerima result tanpa dependency pada UI tertentu. | Language-service README positioning; master plan package role; Playground lightweight browser IDE versus Flutter workbench boundary. | In scope; tidak mengikat preference atau component UI tertentu. | `relgeo/language-service`; package API/README, normative meaning `spec/id`. | Requirement confirmed; implementation audit pending |
| `LS-DOC-002` | Document update lifecycle | Setiap perubahan source dapat diproses sebagai urutan document update → analysis → result untuk mendukung loop `edit → resolve → preview → inspect`. | Plan 05 §3, §6.D; Playground docs §1 dan §7; spec pipeline. | In scope sebagai request lifecycle; storage/save/preview state tetap host-owned. | `relgeo/language-service` untuk analysis; `playground`/Flutter untuk session lifecycle. | Requirement confirmed; implementation audit pending |
| `LS-DOC-003` | Explicit result identity untuk document/session | Host dapat membedakan source aktif, document identity, dirty state, dan diagnostic result yang dikembalikan untuk document tersebut. | MCP `ActiveDocumentSnapshot` §6; Playground local document model §5; editor-agnostic boundary. | Boundary integration: contract wajib didukung saat host memerlukan session; local persistence bukan language-service responsibility. | `relgeo/mcp` untuk session DTO; `playground`/Flutter host; language service consumes source snapshot. | Requirement confirmed; implementation audit pending |
| `LS-INCR-001` | Incremental or bounded re-analysis behavior | Editing tetap responsif pada perubahan kecil dan tidak memaksa host memulai ulang seluruh authoring surface setiap keystroke. | Playground interaction/recovery baseline §4 dan §6.D; local autosave rule yang melarang gangguan cursor/selection §5.4; user journey edit loop. | In scope sebagai performance/behavior expectation; algorithm incremental tertentu belum dipilih. | `relgeo/language-service` + host worker; `playground` consumer. | Requirement confirmed; implementation audit pending |
| `LS-INCR-002` | Stale-result suppression and ordering | Hasil analysis lama tidak boleh menimpa hasil source terbaru ketika worker/request selesai tidak berurutan. | MCP base revision/stale guard §6; Playground worker sequencing and recovery boundary; document update lifecycle. | Boundary integration: language-service result harus membawa identity/version yang dapat dijaga host. | `relgeo/language-service` contract + `playground` worker / Flutter session adapter. | Requirement confirmed; implementation audit pending |
| `LS-VERS-001` | Active/legacy/future version acceptance vocabulary | Editor dapat menangani omitted version sebagai active default, supported legacy, regression-only, dan unsupported future dengan pesan/code yang konsisten. | `spec/id/core/01-overview.md` §1.3; spec README active v0.5; compatibility policy in master plan §2.4; compatibility matrix read-after-enumeration. | In scope sebagai language contract; migration policy lebih luas daripada editor. | `spec/id` + master plan/compatibility policy; language service schema/diagnostics adapter. | Requirement confirmed; implementation audit pending |
| `LS-VERS-002` | Version/provenance on editor and protocol results | Consumer dapat mengetahui contract/spec version dan revision/provenance yang menjadi dasar rule atau documentation result. | MCP resources/tools §4.2–4.3 dan §10; spec provenance rules; release compatibility policy. | In scope untuk result/documentation provenance; registry/deployment evidence bukan language-service behavior. | `spec/id` provenance; `relgeo/language-service` result metadata; `relgeo/mcp` protocol adapter. | Requirement confirmed; implementation audit pending |
| `LS-PROTO-001` | Typed editor result protocol | Request/response untuk diagnostics, validation, schema, tokens, completion, hover, ranges, dan metadata memiliki bentuk terstruktur yang dapat diadaptasi lintas editor. | Language-service editor-agnostic position; MCP typed tools §4.1; master plan consistency across layers. | In scope; tidak berarti language service harus menjadi LSP server penuh. | `relgeo/language-service` package API; protocol-specific adapter `relgeo/mcp`/host. | Requirement confirmed; implementation audit pending |
| `LS-PROTO-002` | Safe serialization and capability boundaries | Result dapat dipindahkan melalui worker/MCP tanpa menyelundupkan filesystem write, arbitrary remote access, atau UI state sebagai semantic source. | MCP tool contract §4.1; MCP security/direct-apply boundary §6–7; Playground source-only persistence rules. | Boundary only but required for integration; language service menghasilkan data, bukan side effect. | `relgeo/mcp`/host security contract; language service owns serializable analysis DTO. | Requirement confirmed; implementation audit pending |
| `LS-REC-001` | Actionable recovery for invalid/partial source | User selalu mendapat jalur untuk memperbaiki source; error tidak membuat editor atau analysis loop kehilangan dokumen. | Plan 05 §4.9 dan §6.D; MCP validation loop §5; spec deterministic error model. | In scope untuk result quality; preview retention and UI affordance adalah host. | `relgeo/language-service` + `playground`; semantics `relgeo/core`. | Requirement confirmed; implementation audit pending |
| `LS-REC-002` | Preserve last valid consumer state during invalid update | Saat source baru invalid, Playground dapat tetap menampilkan preview valid terakhir sambil menunjukkan Errors dan memberi kesempatan edit/pulih. | Plan 05 §6.D secara eksplisit menetapkan invalid source mempertahankan preview valid terakhir. | Boundary only: language service wajib membuat invalid result distinguishable; retention dilakukan Playground/host. | `playground` owner behavior; `relgeo/language-service` diagnostics contract; `relgeo/core` result. | Requirement confirmed; implementation audit pending |
| `LS-REC-003` | Distinguish parser, validation, runtime, and storage/recovery errors | User tidak menerima satu pesan “error” yang mencampur masalah source dengan IndexedDB, share URL, atau runtime environment. | Spec error phases §6.7; Playground local-file plan §6, §7.7; plan 05 recovery states. | Boundary integration: language service owns source/semantic classes; storage/share errors remain host-owned. | `spec/id`/ `core` for language errors; `playground` for storage/share; shared result taxonomy documented by owners. | Requirement confirmed; implementation audit pending |
| `LS-CONS-001` | Playground editor integration | Browser IDE dapat menghubungkan editor, language-service, core, worker, diagnostics, completion, hover/token output, dan preview dalam loop authoring utama. | Master plan dependency flow §3.2; Playground docs §1, §7–8; plan 05 §3 and §6.D. | In scope as consumer integration; catalog tidak mengaudit source wiring di row ini. | Consumer owner `relgeo/playground`; service owner `relgeo/language-service`; semantic owner `relgeo/core`. | Requirement confirmed; implementation audit pending |
| `LS-CONS-002` | Markdown/source-highlighting integration | Fenced RelGeo source pada Markdown dapat memakai tokenization/highlighting yang selaras dengan language-service tanpa mengklaim full semantic editor. | Master plan §3.1–3.2 lists `remark-relgeo-hl`; discovery boundary for Markdown consumer; editor-agnostic token contract. | In scope as consumer boundary; preview/embed dan HTML rendering bukan capability language service. | Consumer `relgeo/remark-relgeo-hl`; service token owner `relgeo/language-service`; contract `spec/id`. | Requirement confirmed; implementation audit pending |
| `LS-CONS-003` | MCP standalone syntax assistant integration | Agent dapat menemukan syntax/examples, melengkapi source, memvalidasi, dan menjelaskan diagnostic dengan structured output, range, code, dan provenance. | MCP plan §2.2, §4.1–4.3, §5, §10; active spec source-of-truth rule. | In scope as protocol consumer; MCP transport/tool execution remains `relgeo/mcp` boundary. | `relgeo/mcp` protocol owner; language-service/core/spec provide underlying capability. | Requirement confirmed; implementation audit pending |
| `LS-CONS-004` | Desktop active-document integration boundary | Workbench dapat membaca source/diagnostics/version dari active document dan mengirim bounded edit proposal yang dapat ditolak jika stale. | MCP plan §6, §8–10; Flutter host bridge boundary in compatibility matrix/master plan. | Boundary only: session, revision guard, undo/redo, Save, and UI belong to host/MCP; service supplies analysis results. | Host `relgeo/flutter` + protocol `relgeo/mcp`; language-service is analysis provider. | Requirement confirmed; implementation audit pending |
| `LS-CONS-005` | Package and compatibility-line consumer contract | Public consumers dapat menginstal dan memakai language-service pada DSL line yang sama tanpa diam-diam mengikuti spec berbeda. | Master plan §2.3–2.4 and §4; compatibility matrix policy and release order, consulted after enumeration. | In scope as delivery/integration contract; publishing automation is outside this catalog. | `relgeo/workspace` compatibility policy; package owner `relgeo/language-service`; normative `spec/id`. | Requirement confirmed; implementation audit pending |

## Ringkasan coverage

Katalog ini mencakup seluruh scope minimum yang diminta dan membedakan tiga
jenis tanggung jawab:

| Area | ID |
| --- | --- |
| Diagnostics | `LS-DIAG-001`–`004` |
| Validation | `LS-VAL-001`–`002` |
| Schema | `LS-SCHEMA-001`–`002` |
| Tokenization | `LS-TOKEN-001` |
| Completion | `LS-COMP-001`–`003` |
| Hover/metadata | `LS-HOVER-001`–`002` |
| Source ranges/navigation | `LS-RANGE-001`–`002` |
| Document lifecycle | `LS-DOC-001`–`003` |
| Incremental behavior | `LS-INCR-001`–`002` |
| Versioning/provenance | `LS-VERS-001`–`002` |
| Editor protocol | `LS-PROTO-001`–`002` |
| Error recovery | `LS-REC-001`–`003` |
| Consumer integration | `LS-CONS-001`–`005` |

Tidak ada row yang diberi status implementation `present`, `partial`, atau
`absent` di dokumen ini. Status tersebut baru boleh diberikan pada audit
berikutnya setelah setiap ID dibandingkan dengan source, tests/fixtures,
consumer wiring, dan delivery evidence secara eksplisit.

## Handoff ke audit implementasi

Audit berikutnya harus mempertahankan ID dan menambahkan sekurang-kurangnya:

1. source/API path yang benar-benar ditemukan;
2. test, fixture, atau negative case;
3. consumer/UI/worker/protocol wiring;
4. implementation status, evidence tier, parity, dan scope status secara
   terpisah;
5. gap, dependency, dan next action; serta
6. batas environment yang `not verified`, tanpa mengubahnya menjadi failure.

Urutan ini menjaga katalog expected tetap menjadi baseline observasional dan
mencegah implementasi yang kebetulan ada—atau matrix lama—menghapus capability
yang memang dibutuhkan user journey dan kontrak produk.
