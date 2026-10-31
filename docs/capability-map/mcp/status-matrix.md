# RelGeo MCP — Capability-First Status Matrix

**Tanggal:** 2026-10-31
**Expected baseline:** [catalog](./expected-capability-catalog.md)
**Join:** [expected-versus-observed reconciliation](./reconciliation.md)
**Evidence:** [current implementation audit](./implementation-audit.md)
**Gap candidates:** [implementation gap backlog](./implementation-gap-backlog.md)

Matrix ini adalah reporting view ringkas. Katalog expected, audit evidence,
reconciliation, dan backlog tetap artefak terpisah. Row status tidak mengubah
kode, source, atau implementasi; dokumentasi gap juga tidak dihitung sebagai
implementation evidence.

> **Current implementation checkpoint (2026-10-31):** The original expected
> catalog remains 68 rows. Statuses below now include full-spec search, active
> document resources, the embedded loopback Streamable HTTP host, and the
> opt-in bounded edit tool. Local MCP/Flutter tests cover those paths. The
> ChatGPT Desktop edit round-trip and packaged v1.0.1 MCP smoke remain pending;
> the root integration baseline still reflects its older 2026-10-09 child pins.

## 1. Legend dan coverage

| Status | Makna |
| --- | --- |
| `✔️` | Boundary implementation ditemukan dan evidence cukup untuk outcome yang dinilai. |
| `🌗` | Contract/host/fixture/subset ada, tetapi outcome end-to-end belum lengkap. |
| `❌` | Expected outcome in-scope sudah diperiksa tetapi implementation behavior belum ditemukan. |
| `➖` | Bukan owner boundary; hanya dipakai pada scope findings, bukan untuk menghapus expected row. |
| `⏸️` | Sengaja ditahan oleh roadmap/dependency/keputusan scope. |
| `⚠️` | Defect atau mismatch terkonfirmasi pada artifact yang dinilai. |

| Dimension | Rule |
| --- | --- |
| Evidence | `verified-local` berarti source/test/runtime lokal langsung; `partial-local` berarti hanya sebagian boundary; `verified-absence` berarti boundary sudah dicari; `verified-defect` berarti mismatch terkonfirmasi; `not-verified` berarti environment/adapter belum cukup. |
| Gap | Menjelaskan outcome yang masih hilang atau boundary yang belum tersambung. `none at audited boundary` tidak berarti MCP end-to-end delivered. |
| Owner | Package/host/source-of-truth yang harus mengubah implementation, bukan sekadar penulis dokumentasi. |
| Dependency | Prerequisite nyata untuk task implementasi; tidak mengubah expected scope. |

| Count | Value |
| --- | ---: |
| Expected capability rows | 68 |
| `✔️` | 32 |
| `🌗` | 24 |
| `❌` | 10 |
| `⚠️` | 0 |
| `⏸️` | 2 |
| `➖` expected rows | 0 |

## 2. Capability matrix

| ID | Capability / user outcome | Status | Evidence | Gap | Owner | Dependency | Risk | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `DISC-01` | Intent → syntax discovery | `✔️` | `verified-local` | Lexical search indexes the full bundled Markdown snapshot; Indonesian/English intent and no-result scenarios are covered. | MCP + `spec/id` | Lexical retrieval is deterministic, not semantic/vector search. | Agent gets no results | Retain query fixtures; retrieve complete normative section before answering. |
| `DISC-02` | Version-aware discovery | `✔️` | `verified-local` | Search and section calls validate `specVersion`; the bundled snapshot is pinned to DSL 0.5 and rejects unsupported 0.6. | MCP + `spec/id` | Only the bundled 0.5 corpus is available; this does not imply legacy-version corpora. | Wrong-version guidance | Keep supported/unsupported-version tests and snapshot revision provenance. |
| `REF-01` | Spec index/rule retrieval | `✔️` | `verified-local` | Search result section IDs resolve to complete normative Markdown sections; spec index/section resources are exposed. | MCP resource layer | Versioned cache and diagnostics catalog are separate requirements. | Stale/wrong rule | Keep complete-section and resource-template retrieval tests. |
| `REF-02` | Directed syntax-rule tool | `✔️` | `verified-local` | `relgeo_get_syntax_rule` resolves a requested rule ID from the full spec index with provenance. | MCP + `spec/id` | Only one pinned normative corpus is bundled; do not promote examples to normative evidence. | Prompt dump or no result | Preserve exact rule lookup and provenance coverage. |
| `EX-01` | Example index/retrieval | `🌗` | `partial-local` | No examples resolver/bundle | MCP + examples source | Versioned examples | Explanatory text mistaken as normative | Add bounded examples resolver |
| `EX-02` | Minimal valid example selection | `❌` | `verified-absence` | No ranking, minimal-example policy, or fixture | MCP workflow layer | Tools/resources | Large/irrelevant examples | Add bounded selection fixtures |
| `COMP-01` | Source completion | `🌗` | `partial-local` | No language-service adapter | MCP + language-service | Adapter boundary | No actionable proposal | Map completion service and ranges |
| `COMP-02` | Completion proposal semantics | `🌗` | `partial-local` | No runtime proposal generation/handoff | Language-service + MCP | COMP-01 adapter | Proposal read as mutation | Add proposal mapping fixture |
| `VAL-01` | Structural/schema validation | `🌗` | `partial-local` | DTO exists; parser/validator not invoked | MCP + core | Real adapter | Invalid source accepted | Add schema/validation tool fixture |
| `VAL-02` | Semantic parse/resolve validation | `❌` | `verified-absence` | No MCP parse→validate→resolve path | MCP + core | Real adapter | Unsafe proposal guidance | Connect core pipeline |
| `VAL-03` | Deterministic validation result | `🌗` | `not-verified` | Cross-host MCP evidence unavailable | Core + MCP | Adapter and multi-host fixture | False parity claim | Run deterministic cross-host fixture |
| `DIAG-01` | Structured diagnostics | `🌗` | `partial-local` | No core/language-service mapping | Language-service + MCP | VAL-01 | Lost code/range/origin | Add diagnostic conversion fixture |
| `DIAG-02` | Diagnostic explanation | `❌` | `verified-absence` | No explanation catalog/resolver | MCP + `spec/id` | Versioned catalog | Wrong repair explanation | Implement explanation resource/tool |
| `DIAG-03` | Input/proposal/active source-kind | `🌗` | `partial-local` | DTO only; runtime enforcement absent | MCP + Flutter bridge | Validation adapter | Proposal promoted implicitly | Add source-kind enforcement tests |
| `WF-01` | Discovery→author→validate→render workflow | `❌` | `verified-absence` | No callable composition layer | MCP workflow layer | Tools/resources | Fragmented agent workflow | Add end-to-end workflow fixture |
| `WF-02` | Author/debug/explain/review prompts | `⏸️` | `verified-scope` | Prompt layer roadmap-gated | MCP workflow layer | Stable tools/resources | Prompt becomes hidden authority | Define prompt contract later |
| `RENDER-01` | Source/proposal to SVG in-memory | `🌗` | `partial-local` | No core→renderer executor | MCP + core + renderer | VAL-02 | Misleading/empty output | Add SVG adapter fixture |
| `RENDER-02` | Explicit sheet/view render target | `🌗` | `partial-local` | `sheetId` DTO only; no selector | MCP + renderer | Render adapter | Wrong view rendered | Map bounded sheet selection |
| `RENDER-03` | Structured render failure | `❌` | `verified-absence` | No parse/render error mapping | MCP + core/renderer | Render adapter | Crash or fake SVG | Add invalid-render error fixture |
| `DOC-01` | Active document snapshot | `✔️` | `verified-local` | Authenticated MCP routes expose source, identity, revision, dirty state, and diagnostics | Flutter bridge + MCP host | Packaged-app smoke | Stale or wrong document context | Keep active-document tool/resource integration tests |
| `DOC-02` | Active-document resource | `✔️` | `verified-local` | Active document and diagnostics resources are exposed through the authenticated desktop router. | MCP + Flutter bridge | Resource bridge is wired to loopback server; target-app client smoke remains pending. | Wrong document exposure | Keep active-document resource and auth regression tests. |
| `DOC-03` | Identity/revision lifecycle | `✔️` | `verified-local` | Router reads active snapshot and rejects stale base revisions | Flutter session + MCP adapter | Stop/revoke race | Stale patch after load | Keep session and protocol stale-guard tests |
| `DOC-04` | Dirty-state visibility | `✔️` | `verified-local` | Applied edit marks the active source dirty; HTTP integration asserts dirty state and undo availability | Flutter editor/session | Packaged persistence smoke | Agent edit silently treated as saved | Preserve dirty-state response and no-autosave boundary |
| `DOC-05` | Session start/stop/revocation | `✔️` | `verified-local` | Server start/stop revokes access at the session boundary; desktop host owns server lifetime. | Flutter host + MCP | Only packaged-app lifecycle smoke remains pending. | Live token after stop | Keep stop/revoke regression tests. |
| `DOC-06` | Save/Save As separation | `✔️` | `verified-local` | Protocol-level negative test absent | Flutter file boundary | Mutation adapter | Accidental filesystem write | Add adapter negative-path test |
| `EDIT-01` | Bounded proposal review | `🌗` | `partial-local` | Proposal DTO, no review/call producer | MCP + Flutter | Mutation adapter | Whole-file/implicit edit | Add proposal review fixture/surface |
| `EDIT-02` | Apply edit through desktop bridge | `✔️` | `verified-local` | Read-write server exposes bounded `relgeo_apply_document_edit`; HTTP integration applies through the bridge. | Flutter bridge + MCP | ChatGPT Desktop live edit round-trip and packaged app smoke remain unverified. | Unauthenticated mutation | Record ChatGPT Desktop read/write smoke after connecting the current app. |
| `EDIT-03` | Base identity/revision guard | `✔️` | `verified-local` | Live transport race not tested | Flutter session | Mutation adapter | Partial stale write | Preserve guard in adapter test |
| `EDIT-04` | One undoable transaction | `✔️` | `verified-local` | Full desktop runtime evidence absent | Flutter editor | Mutation adapter | Hidden multi-step history | Keep single setter contract |
| `EDIT-05` | Applied/stale/rejected/failed result | `🌗` | `partial-local` | DTO exists; all protocol states not mapped | MCP + Flutter | Mutation adapter | Failed action reported applied | Add state serialization tests |
| `RES-01` | Canonical resource list/read | `✔️` | `verified-local` | Canonical spec index/section and active-document resources are listed/read from bundled index and bridge. | MCP resource layer | Diagnostic catalog and cache/TTL behavior are separate gaps. | Path-like URI leakage | Keep resource URI allowlist, provenance, and offline retrieval assertions. |
| `RES-02` | Diagnostics catalog resource | `❌` | `verified-absence` | URI declared; no content/resolver | MCP + `spec/id` | Catalog source | Explanation mismatch | Add versioned catalog resource |
| `RES-03` | Versioned offline snapshot | `✔️` | `verified-local` | Flutter bundles 34 normative Markdown files; index/retrieval tests and loader use AssetBundle offline. | MCP packaging | Examples are explanatory; no diagnostic catalog or remote cache. | Offline assistant unavailable | Keep snapshot digest/drift check and offline startup coverage. |
| `RES-04` | Predictable cache/fallback | `❌` | `verified-absence` | No TTL/revision fallback layer | MCP resource layer | Snapshot packaging | Mixed revisions | Add cache identity policy/tests |
| `PROV-01` | Documentation provenance | `🌗` | `partial-local` | DTO exists; adapter does not produce results | MCP + spec/examples | Resource resolver | Untraceable guidance | Preserve provenance in adapter fixtures |
| `PROV-02` | Normative/explanatory precedence | `✔️` | `verified-local` | Bundled sections identify normative spec provenance; example content remains separately classified as non-normative. | MCP provenance contract | Only the bundled normative corpus is exposed today; no examples resolver is provided. | Explanatory content could be mistaken for normative authority | Keep source/version/revision provenance attached to retrieval results. |
| `PROV-03` | Proposal provenance chain | `🌗` | `partial-local` | `basedOn[]` exists; producer absent | MCP workflow layer | Completion/example adapters | Agent cannot explain basis | Populate chain in proposal fixture |
| `TRAN-01` | MCP initialize/lifecycle | `✔️` | `verified-local` | HTTP integration exercises initialize/initialized, protocol negotiation, tools and resources. | MCP transport | Inspector/client interoperability still needs a live smoke record. | Non-conformant handshake | Retain protocol negotiation and malformed-request tests. |
| `TRAN-02` | Tool/resource discovery calls | `✔️` | `verified-local` | Desktop HTTP integration lists/calls RelGeo tools and reads resources. | MCP adapter | Only implemented catalog is exposed; semantic validation/completion/render workflows remain gaps. | False discovery claim | Keep protocol tool/resource round-trip tests. |
| `TRAN-03` | Standalone stdio | `🌗` | `partial-local` | Fixture exists; no RelGeo executable | MCP package | Adapter + conformance | No standalone use | Add executable after gate |
| `TRAN-04` | Desktop loopback Streamable HTTP | `✔️` | `verified-local` | `RelGeoMcpDesktopServer` binds IPv4 loopback on an ephemeral port; Flutter IO integration tests pass. | MCP transport + Flutter | Packaged v1.0.1 MCP launch and external client smoke remain unverified. | Unverified HTTP readiness | Run MCP smoke from the packaged desktop app. |
| `TRAN-05` | Remote transport rejection | `✔️` | `verified-local` | Desktop HTTP server checks loopback host and origin; integration tests exercise rejection paths. | MCP transport | Remote deployment is deliberately out of scope. | Accidental exposure | Retain host/origin rejection tests; do not expose remote bind. |
| `TRAN-06` | SDK-neutral adapter boundary | `🌗` | `partial-local` | No adapter package to exercise boundary | MCP transport | SDK conformance | SDK lock-in | Isolate candidate and run gate |
| `HOST-01` | Pure-Dart package boundary | `✔️` | `verified-local` | Contract package is not server delivery | MCP package | Adapter | Boundary overclaimed | Preserve pure-Dart exports |
| `HOST-02` | Flutter embedded server lifecycle | `✔️` | `verified-local` | Workbench dialog starts/stops the embedded server; app disposal stops it. | Flutter host | Native packaged-app lifecycle smoke remains pending. | Packaged lifecycle may differ from tested host behavior | Verify enable/disable and clean stop in a packaged-app smoke. |
| `HOST-03` | MCP status/configuration UI | `🌗` | `partial-local` | Dialog shows running state, permission, endpoint, temporary token/copy config, and Enable/Disable. | Flutter host | Connected-client count/status and packaged-app UI smoke are not verified. | User cannot see which client is connected | Smoke the dialog in a packaged app; decide whether client status belongs in scope. |
| `HOST-04` | Typed agent bridge composition | `✔️` | `verified-local` | Desktop router calls active-document bridge for snapshots, diagnostics and guarded edits. | Flutter bridge | Semantic core/language-service/renderer composition is not provided by this bridge. | Widget coupling or bypass | Keep integration tests across router and bridge. |
| `HOST-05` | Shared authoring context | `❌` | `verified-absence` | No composition across core/LS/renderer | MCP adapter | Real tool/resource adapter | Inconsistent agent context | Add context composition fixture |
| `ERR-01` | Typed input/bounds/URI errors | `✔️` | `verified-local` | Schema/DTO parity, typed pre-dispatch errors, and focused tests pass | MCP contract + adapter | Semantic domain mappings remain separate | Client validation drift | Preserve schema/invalid-argument regression gate |
| `ERR-02` | Structured domain error mapping | `❌` | `verified-absence` | No core/LS error adapter | MCP + core/LS | Real adapter | Error code/range loss | Add domain error mapping fixtures |
| `ERR-03` | Host/session error states | `🌗` | `partial-local` | Session DTOs exist; protocol states absent | MCP + Flutter | Server adapter | Auth/session ambiguity | Map errors before bridge call |
| `ERR-04` | Error-safe partial work | `🌗` | `partial-local` | Bridge validation/failed divergence only | MCP + Flutter | Mutation + cancellation | False applied or partial write | Add atomic adapter tests |
| `CXL-01` | Request cancellation/abort | `❌` | `verified-absence` | No request registry/abort outcome | MCP transport | Real adapter | Long call/mutation cannot stop | Add cancellation fixture |
| `CXL-02` | Stop/disconnect cancellation safety | `🌗` | `not-verified` | Server stop revokes tokens/closes listener; a pending-request stop race has not been exercised. | MCP transport + Flutter | Embedded server | Pending mutation/token leak | Verify stop/disconnect sequence |
| `SEC-01` | Disabled-by-default server | `✔️` | `verified-local` | No endpoint exists until the user explicitly starts it from the MCP dialog. | Flutter host | The dialog is opt-in; packaged app and native lifecycle smoke remain pending. | Unexpected endpoint | Keep disabled-by-default behavior. |
| `SEC-02` | Loopback-only boundary | `✔️` | `verified-local` | HTTP host binds only to IPv4 loopback and validates Host/Origin. | MCP transport | This is local desktop protection, not remote MCP support. | Remote exposure | Retain loopback and origin rejection tests. |
| `SEC-03` | Opaque per-session token | `✔️` | `verified-local` | Eight-hour opaque bearer token is held in server session and revoked on stop. | MCP session + Flutter | Token/client interaction has not been exercised through a published desktop package. | Token bypass/leak | Keep expiry, stop-revocation, and non-persistence tests. |
| `SEC-04` | Read/write scope enforcement | `✔️` | `verified-local` | Read-only endpoint rejects edit calls; read-write permission is explicit opt-in and checked per request. | MCP session + adapter | Live ChatGPT Desktop write round-trip remains pending. | Read-only token mutates | Retain HTTP permission-denial and read-write edit tests. |
| `SEC-05` | Active-session-only mutation | `✔️` | `verified-local` | Reads and bounded edits route only to the active workbench bridge with identity/revision guards. | Flutter bridge | No document selection or arbitrary filesystem path is exposed to MCP. | Wrong document target | Keep stale-identity/revision integration cases. |
| `SEC-06` | Bounded patch/source size | `✔️` | `verified-local` | Edit bounds reject oversized sources, excessive/overlapping/out-of-range edits in session tests; JSON schema advertises count/length bounds. | MCP session + Flutter | HTTP integration does not yet exercise every rejection boundary. | DoS/whole-file write | Keep bounds at session/bridge and cover boundary values through the wire. |
| `SEC-07` | Filesystem/save isolation | `✔️` | `verified-local` | Edit route updates in-memory editor only; Save/Save As/export remain separate host commands. | Flutter host + MCP | Packaged-app persistence and close/reopen behavior require manual smoke. | Arbitrary write/autosave | Keep no-autosave contract and inspect dirty-state behavior. |
| `SEC-08` | Secret-safe operational visibility | `🌗` | `partial-local` | Dialog shows running state, permission mode, endpoint, temporary token/copy config, and Disable; no connected-client count/status | Flutter host | Connected-client visibility and packaged secret-handling smoke remain open | Users cannot see client connectivity or audit individual calls | Add secret-safe connected-client visibility only if product scope requires it; smoke current dialog |
| `DEL-01` | Standalone executable readiness | `⏸️` | `verified-scope` | CLI intentionally roadmap-gated | MCP package | Product decision + conformance | Premature packaging | Decide standalone need after gate |
| `DEL-02` | Desktop runtime dependency readiness | `✔️` | `verified-local` | Embedded Dart HTTP server uses bundled snapshot and avoids a second Node/npm runtime. | Flutter packaging | Platform-specific packaged-app smoke remains pending. | Runtime claim without server | Keep app-owned server lifecycle and offline snapshot tests. |
| `DEL-03` | SDK/transport conformance evidence | `🌗` | `not-verified` | MCP Dart suite and Flutter HTTP integration verify schema, auth, resources, edits, stale guards and loopback behavior. | MCP CI/adapter | No current ChatGPT Desktop live run; Inspector negotiation depends on client protocol version. | Release without conformance | Run current-client interoperability smoke and capture protocol version. |
| `DEL-04` | Desktop artifact/runtime MCP smoke | `🌗` | `not-verified` | Desktop v1.0.1 draft contains all three OS bundles and provenance/checksums. | Flutter/workspace CI | No MCP-specific packaged-app launch/client smoke is recorded. | Artifact not usable | Add MCP smoke from macOS/Linux/Windows packaged artifacts. |
| `DEL-05` | Delivery revision provenance | `🌗` | `partial-local` | Release manifest and per-platform metadata identify Flutter source, OS/architecture, workflow and checksums. | Workspace delivery | MCP package/snapshot digest is not joined into one release evidence record. | Untraceable release | Record MCP commit and bundled spec digest with release candidate. |
| `DEL-06` | Setup/operations documentation | `🌗` | `partial-local` | Desktop dialog exposes URL/token/copy-config; `flutter/docs/mcp-local-testing.md` documents ChatGPT Desktop setup. | MCP + Flutter docs | End-to-end setup still depends on running desktop server and client-compatible protocol version. | Operator misconfiguration | Retain setup walkthrough and live client smoke. |

## 3. Scope findings (not expected-row substitutions)

| Status | Boundary finding | Decision |
| --- | --- | --- |
| `➖` | Android/iOS MCP delivery | Not applicable to this desktop-connected delivery baseline; do not use this to remove desktop expected rows. |
| `➖` | Remote HTTP deployment/authentication | Explicitly outside MVP; `TRAN-05` remains an expected rejection capability and is assessed separately. |
| `➖` | Arbitrary Flutter UI command invocation by agent | Host command surface remains UI-owned; only approved typed bridge operations may be exposed later. |

## 4. Handoff rules

- Implementers should start from the candidate groups in the [gap backlog](./implementation-gap-backlog.md), not from this reporting view alone.
- A documentation update, matrix update, or passing fixture does not change a
  `❌`/`🌗` row to `✔️`; source/runtime/evidence must change first.
- Re-run the expected catalog → audit → reconciliation → matrix join after an
  implementation change. Preserve `?` for unavailable environment evidence and
  preserve `⏸️`/`➖` scope decisions until explicitly changed.
