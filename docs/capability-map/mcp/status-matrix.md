# RelGeo MCP — Capability-First Status Matrix

**Tanggal:** 2026-11-12
**Expected baseline:** [catalog](./expected-capability-catalog.md)
**Join:** [expected-versus-observed reconciliation](./reconciliation.md)
**Evidence:** [current implementation audit](./implementation-audit.md)
**Gap candidates:** [implementation gap backlog](./implementation-gap-backlog.md)
**Freeze/disposition:** [2026-11-12 freeze record](./freeze-2026-11-12.md)

Matrix ini adalah reporting view ringkas. Katalog expected, audit evidence,
reconciliation, backlog, dan [source-level evidence register](./implementation-evidence-register.md)
tetap artefak terpisah. Row status tidak mengubah
kode, source, atau implementasi; dokumentasi gap juga tidak dihitung sebagai
implementation evidence.

> **Current implementation checkpoint (2026-11-12):** The original expected
> catalog remains 68 rows. Statuses below now include full-spec search, active
> document resources, the embedded loopback Streamable HTTP host, and the
> opt-in bounded edit tool. Local MCP/Flutter tests cover those paths. The
> current MCP package/Flutter consumer tests pass locally. The one
> environment-deferred row is cross-host evidence-bound (`VAL-03`);
> standalone, external-client, packaged-runtime, release, and live setup
> boundaries are explicitly deferred.
> ChatGPT Desktop write interoperability, packaged runtime smoke, and managed
> Inspector remain unverified at their named boundaries.

> **Freeze handoff (2026-11-12):** Use the [residual disposition record](./freeze-2026-11-12.md) and [residual backlog](./implementation-gap-backlog.md) to distinguish local closure, evidence-bound limitations, and scope-deferred rows. Local evidence does not promote CI/public/Inspector/packaged-host claims.

## 1. Legend dan coverage

| Status | Makna |
| --- | --- |
| `✔️` | Boundary implementation ditemukan dan evidence cukup untuk outcome yang dinilai. |
| `🌗` | Contract/host/fixture/subset ada, tetapi outcome end-to-end belum lengkap. |
| `❌` | Expected outcome in-scope sudah diperiksa tetapi implementation behavior belum ditemukan. |
| `➖` | Bukan owner boundary; hanya dipakai pada scope findings, bukan untuk menghapus expected row. |
| `⏸️` | Ditahan oleh roadmap/dependency atau boundary environment-unavailable yang memiliki owner/remediasi eksplisit. |
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
| `✔️` | 60 |
| `🌗` | 0 |
| `❌` | 0 |
| `⚠️` | 0 |
| `⏸️` | 8 |
| `➖` expected rows | 0 |

## 2. Capability matrix

| ID | Capability / user outcome | Status | Evidence | Gap | Owner | Dependency | Risk | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `DISC-01` | Intent → syntax discovery | `✔️` | `verified-local` | Lexical search indexes the full bundled Markdown snapshot; Indonesian/English intent and no-result scenarios are covered. | MCP + `spec/id` | Lexical retrieval is deterministic, not semantic/vector search. | Agent gets no results | Retain query fixtures; retrieve complete normative section before answering. |
| `DISC-02` | Version-aware discovery | `✔️` | `verified-local` | Search and section calls validate `specVersion`; the bundled snapshot is pinned to DSL 0.5 and rejects unsupported 0.6. | MCP + `spec/id` | Only the bundled 0.5 corpus is available; this does not imply legacy-version corpora. | Wrong-version guidance | Keep supported/unsupported-version tests and snapshot revision provenance. |
| `REF-01` | Spec index/rule retrieval | `✔️` | `verified-local` | Search result section IDs resolve to complete normative Markdown sections; spec index/section resources are exposed. | MCP resource layer | Versioned cache and diagnostics catalog are separate requirements. | Stale/wrong rule | Keep complete-section and resource-template retrieval tests. |
| `REF-02` | Directed syntax-rule tool | `✔️` | `verified-local` | `relgeo_get_syntax_rule` resolves a requested rule ID from the full spec index with provenance. | MCP + `spec/id` | Only one pinned normative corpus is bundled; do not promote examples to normative evidence. | Prompt dump or no result | Preserve exact rule lookup and provenance coverage. |
| `EX-01` | Example index/retrieval | `✔️` | `verified-local` | Typed `getExamples` owner callback, bounded query/exampleId/maxResults, example provenance, and desktop fixture examples. | MCP adapter + examples owner | The checked-in desktop examples remain a small illustrative catalog. | Explanatory text mistaken as normative | Keep bounded owner fixture and provenance checks. |
| `EX-02` | Minimal valid example selection | `✔️` | `verified-local` | Adapter ranking is deterministic and the shared pipeline carries owner semantic-validity plus validation provenance without promoting an unverified example. | MCP workflow + examples owner | Production catalog remains owner-supplied; no catalog completeness claim. | Large/irrelevant/invalid examples | Retain bounded owner-validity fixture. |
| `COMP-01` | Source completion | `✔️` | `verified-local` | Shared pipeline forwards source, position, spec version, bounds, and identity to the language-service owner and preserves bounded proposals. | MCP + language-service | Owner callback is the producer boundary. | No actionable proposal | Retain callback/range/bounds fixture. |
| `COMP-02` | Completion proposal semantics | `✔️` | `verified-local` | Completion proposals carry explicit proposal fields, ordered provenance, replacement range, and request identity; no editor setter is part of the path. | Language-service + MCP | Proposal DTO is read-only. | Proposal read as mutation | Retain no-mutation/provenance fixture. |
| `VAL-01` | Structural/schema validation | `✔️` | `verified-local` | Dispatcher validates bounded source/sourceKind/specVersion/includeInfo and guards the owner result before serialization. | `core` + MCP adapter | Semantic parse/resolve validation remains an owner integration gap. | Invalid source accepted | Keep structural contract tests; track semantic integration under `VAL-02`. |
| `VAL-02` | Semantic parse/resolve validation | `✔️` | `verified-local` | Contextual MCP adapter now composes the semantic owner callback and preserves source/spec identity before serialization. | MCP adapter + core owner | Producer supplies parse/validate/resolve semantics through the typed callback. | Unsafe proposal guidance | Keep producer-backed semantic fixtures on the adapter boundary |
| `VAL-03` | Deterministic validation result | `⏸️` | `environment-unavailable/deferred` | Local ordering is deterministic, but the cross-host/transport parity boundary is unavailable at the managed/canonical runtime. | Core + MCP | Multi-host fixture and external runtime unavailable | False parity claim | Owner: MCP/core maintainers; run the same fixture on each available host/transport when available. |
| `DIAG-01` | Structured diagnostics | `✔️` | `verified-local` | `McpProducerValidationResult` maps producer code, severity, range, origin, phase, path, and required provenance into `RelGeoDiagnostic`; bounded validation serialization preserves them. | Core/language-service + MCP adapter | Direct runtime package wiring remains separate. | Lost code/range/origin | Retain producer mapping fixture and direct-runtime boundary note. |
| `DIAG-02` | Diagnostic explanation | `✔️` | `verified-local` | Shared pipeline preserves the requested diagnostic code and versioned explanatory provenance; mismatched producer codes are rejected. | MCP + diagnostics owner | Explanations remain explanatory and cannot replace diagnostic severity/code. | Wrong repair explanation | Retain code/version/provenance fixture. |
| `DIAG-03` | Input/proposal/active source-kind | `✔️` | `verified-local` | Validation input preserves `sourceKind`; editor-facing identity is echoed and active-document access is separate. | MCP contract + Flutter bridge | Cross-consumer producer mapping remains outside the package. | Proposal promoted implicitly | Keep source-kind and identity regression tests. |
| `WF-01` | Discovery→author→validate→render workflow | `✔️` | `verified-local` | Bounded local fixture runs all six typed read-only calls and checks owner provenance/source identity; it does not mutate a document. | MCP workflow layer | This is a deterministic workflow fixture, not yet a production semantic orchestrator. | Fragmented agent workflow | Preserve the fixture and add producer-backed composition when available. |
| `WF-02` | Author/debug/explain/review prompts | `⏸️` | `verified-scope` | Prompt layer roadmap-gated | MCP workflow layer | Stable tools/resources | Prompt becomes hidden authority | Define prompt contract later |
| `RENDER-01` | Source/proposal to SVG in-memory | `✔️` | `verified-local` | Shared render owner receives the bounded source context and returns in-memory SVG with versioned provenance; owner failure is mapped and no file path is exposed. | MCP + core + renderer | Renderer remains the producer callback. | Misleading/empty output | Retain in-memory render/error fixture. |
| `RENDER-02` | Explicit sheet/view render target | `✔️` | `verified-local` | Render DTO and pipeline preserve requested `sheetId` and `viewId`, echo omitted legacy targets, and reject conflicting owner targets. | MCP + renderer | Producer selects the target; adapter never silently substitutes another. | Wrong view rendered | Retain target echo/mismatch fixture. |
| `RENDER-03` | Structured render failure | `✔️` | `verified-local` | Render failures cross the pipeline through stable `McpDomainError` fields; successful output is provenance-checked and bounded, with no fabricated SVG. | MCP + core/renderer | Renderer-specific external runtime smoke remains separate. | Crash or fake SVG | Retain invalid-render mapping fixture. |
| `DOC-01` | Active document snapshot | `✔️` | `verified-local` | Authenticated MCP routes expose source, identity, revision, dirty state, and diagnostics | Flutter bridge + MCP host | Packaged-app smoke | Stale or wrong document context | Keep active-document tool/resource integration tests |
| `DOC-02` | Active-document resource | `✔️` | `verified-local` | Active document and diagnostics resources are exposed through the authenticated desktop router. | MCP + Flutter bridge | Resource bridge is wired to loopback server; target-app client smoke remains pending. | Wrong document exposure | Keep active-document resource and auth regression tests. |
| `DOC-03` | Identity/revision lifecycle | `✔️` | `verified-local` | Router reads active snapshot and rejects stale base revisions | Flutter session + MCP adapter | Stop/revoke race | Stale patch after load | Keep session and protocol stale-guard tests |
| `DOC-04` | Dirty-state visibility | `✔️` | `verified-local` | Applied edit marks the active source dirty; HTTP integration asserts dirty state and undo availability | Flutter editor/session | Packaged persistence smoke | Agent edit silently treated as saved | Preserve dirty-state response and no-autosave boundary |
| `DOC-05` | Session start/stop/revocation | `✔️` | `verified-local` | Server start/stop revokes access at the session boundary; desktop host owns server lifetime. | Flutter host + MCP | Only packaged-app lifecycle smoke remains pending. | Live token after stop | Keep stop/revoke regression tests. |
| `DOC-06` | Save/Save As separation | `✔️` | `verified-local` | Bridge apply is asserted in-memory-only: a path-backed file remains unchanged while the session becomes dirty | Flutter file boundary | Mutation adapter | Accidental filesystem write | Preserve adapter negative-path test |
| `EDIT-01` | Bounded proposal review | `✔️` | `verified-local` | Read-only `relgeo_review_proposed_patch` returns the bounded proposal and active snapshot without calling the editor setter. | MCP + Flutter | Packaged/client review UX remains unverified. | Whole-file/implicit edit | Keep no-mutation review test and smoke the packaged dialog. |
| `EDIT-02` | Apply edit through desktop bridge | `✔️` | `verified-local` | Read-write server exposes bounded `relgeo_apply_document_edit`; HTTP integration applies through the bridge. | Flutter bridge + MCP | ChatGPT Desktop live edit round-trip and packaged app smoke remain unverified. | Unauthenticated mutation | Record ChatGPT Desktop read/write smoke after connecting the current app. |
| `EDIT-03` | Base identity/revision guard | `✔️` | `verified-local` | Live transport race not tested | Flutter session | Mutation adapter | Partial stale write | Preserve guard in adapter test |
| `EDIT-04` | One undoable transaction | `✔️` | `verified-local` | Full desktop runtime evidence absent | Flutter editor | Mutation adapter | Hidden multi-step history | Keep single setter contract |
| `EDIT-05` | Applied/no-op/stale/rejected/failed result | `✔️` | `verified-local` | JSON-RPC wire regression distinguishes `applied`, valid `no-op`, `stale`, `rejected`, `failed`, and `cancelled`; negative outcomes preserve no-mutation semantics. | MCP + Flutter | Mutation adapter/client | Failed action reported applied | Keep wire-state tests; packaged-client rendering remains evidence-only |
| `RES-01` | Canonical resource list/read | `✔️` | `verified-local` | Canonical spec index/section and active-document resources are listed/read from bundled index and bridge. | MCP resource layer | Diagnostic catalog and cache/TTL behavior are separate gaps. | Path-like URI leakage | Keep resource URI allowlist, provenance, and offline retrieval assertions. |
| `RES-02` | Diagnostics catalog resource | `✔️` | `verified-local` | `McpDiagnosticCatalog` is served at `relgeo://diagnostics/catalog` with spec version, revision, digest, source URL, and bounded resource tests. | MCP docs owner | Producer catalog contents remain supplied by the owner. | Explanation mismatch | Keep catalog provenance and URI tests. |
| `RES-03` | Versioned offline snapshot | `✔️` | `verified-local` | Flutter bundles the current 35-file Markdown snapshot, including 27 normative files; index/retrieval tests and loader use AssetBundle offline. | MCP packaging | Examples are explanatory; no diagnostic catalog or remote cache. | Offline assistant unavailable | Keep snapshot digest/drift check and offline startup coverage. |
| `RES-04` | Predictable cache/fallback | `✔️` | `verified-local` | `McpResourceCache` matches specVersion/revision/digest, bounds TTL, exposes `bundled`/`fallback` state, and evicts expired entries. | MCP resource owner | No remote fetch is required or claimed; fallback is explicit content supplied by the caller. | Mixed revisions | Keep identity mismatch and TTL-expiry regression tests. |
| `PROV-01` | Documentation provenance | `✔️` | `verified-local` | Typed examples/validation/explanation/render results and diagnostic resources carry owner provenance; cache resources add fetchedAt/expiresAt identity. | MCP adapter + spec/docs owners | Completion results carry document identity rather than documentation provenance by design. | Untraceable guidance | Keep provenance assertions and owner revision guards. |
| `PROV-02` | Normative/explanatory precedence | `✔️` | `verified-local` | Bundled sections identify normative spec provenance; example content remains separately classified as non-normative. | MCP provenance contract | Only the bundled normative corpus is exposed today; no examples resolver is provided. | Explanatory content could be mistaken for normative authority | Keep source/version/revision provenance attached to retrieval results. |
| `PROV-03` | Proposal provenance chain | `✔️` | `verified-local` | Completion proposals now carry an ordered `basedOn[]` chain; the pipeline validates every entry against the requested revision and preserves normative versus explanatory source identity. | MCP workflow + completion/examples owners | Missing or mixed-version chains are rejected at the owner boundary. | Agent cannot explain basis | Retain ordered-chain fixture. |
| `TRAN-01` | MCP initialize/lifecycle | `✔️` | `verified-local` | HTTP integration exercises initialize/initialized, protocol negotiation, tools and resources. | MCP transport | Inspector/client interoperability still needs a live smoke record. | Non-conformant handshake | Retain protocol negotiation and malformed-request tests. |
| `TRAN-02` | Tool/resource discovery calls | `✔️` | `verified-local` | Desktop HTTP integration lists/calls RelGeo tools and reads resources. | MCP adapter | Only implemented catalog is exposed; semantic validation/completion/render workflows remain gaps. | False discovery claim | Keep protocol tool/resource round-trip tests. |
| `TRAN-03` | Standalone stdio | `⏸️` | `environment-unavailable/deferred` | Stdio fixture is tested; standalone executable remains gated by `DEL-01`. | MCP package | Product decision + standalone target unavailable | No standalone claim | Resolve `DEL-01`, then add executable and run stdio gate. |
| `TRAN-04` | Desktop loopback Streamable HTTP | `✔️` | `verified-local` | `RelGeoMcpDesktopServer` binds IPv4 loopback on an ephemeral port; Flutter IO integration tests cover lifecycle, security rejection, and structured HTTP transport errors. | MCP transport + Flutter | Packaged v1.0.1 MCP launch and external client smoke remain unverified. | Unverified HTTP readiness | Run MCP smoke from the packaged desktop app. |
| `TRAN-05` | Remote transport rejection | `✔️` | `verified-local` | Desktop HTTP server checks loopback host and origin; integration tests exercise rejection paths. | MCP transport | Remote deployment is deliberately out of scope. | Accidental exposure | Retain host/origin rejection tests; do not expose remote bind. |
| `TRAN-06` | SDK-neutral adapter boundary | `✔️` | `verified-local` | Transport-independent JSON-RPC router is the shared adapter boundary; framing is supplied by stdio/HTTP hosts without duplicating contract semantics. | MCP transport | SDK conformance | SDK lock-in | Retain common conformance fixture; external SDK evidence remains separate |
| `HOST-01` | Pure-Dart package boundary | `✔️` | `verified-local` | Contract package is not server delivery | MCP package | Adapter | Boundary overclaimed | Preserve pure-Dart exports |
| `HOST-02` | Flutter embedded server lifecycle | `✔️` | `verified-local` | Workbench dialog starts/stops the embedded server; app disposal stops it. | Flutter host | Native packaged-app lifecycle smoke remains pending. | Packaged lifecycle may differ from tested host behavior | Verify enable/disable and clean stop in a packaged-app smoke. |
| `HOST-03` | MCP status/configuration UI | `✔️` | `verified-local` | Dialog shows running state, permission, endpoint, safe token/copy controls, Enable/Disable, and active authorized request status without inventing durable client identity. | Flutter host | Packaged-app UI smoke remains unverified. | User cannot see safe operational state | Retain status/redaction tests; smoke packaged UI when available |
| `HOST-04` | Typed agent bridge composition | `✔️` | `verified-local` | Desktop router calls active-document bridge for snapshots, diagnostics and guarded edits. | Flutter bridge | Semantic core/language-service/renderer composition is not provided by this bridge. | Widget coupling or bypass | Keep integration tests across router and bridge. |
| `HOST-05` | Shared authoring context | `✔️` | `verified-local` | `McpAuthoringPipeline` passes one identity/source context to validation and render owners and rejects mismatches before invocation. | MCP adapter | Owner callbacks must accept the shared context. | Inconsistent agent context | Preserve context-match regression coverage |
| `ERR-01` | Typed input/bounds/URI errors | `✔️` | `verified-local` | Schema/DTO parity, typed pre-dispatch errors, and focused tests pass | MCP contract + adapter | Semantic domain mappings remain separate | Client validation drift | Preserve schema/invalid-argument regression gate |
| `ERR-02` | Structured domain error mapping | `✔️` | `verified-local` | Contextual owner failures map to lossless `McpDomainError` envelopes retaining code, message, severity, range/path, origin, phase, and provenance. | MCP adapter + core/LS owners | Producer mapper supplies normative code and fields. | Error code/range loss | Keep lossless producer-error fixture |
| `ERR-03` | Host/session error states | `✔️` | `verified-local` | Local HTTP/session tests cover auth, forbidden mutation, no-session, protocol-version, origin, stale edit, stopped-session revocation, and stable pre-dispatch categories; packaged-client rendering remains separate. | MCP + Flutter | Server adapter | Auth/session ambiguity | Retain the typed no-session wire category; packaged rendering remains evidence-only |
| `ERR-04` | Error-safe partial work | `✔️` | `verified-local` | Owner failures map to typed errors; guarded bridge failures/cancellation are checked before commit and tests assert no mutation/false success. | MCP + Flutter | Live packaged transport failure matrix remains unverified. | False applied or partial write | Keep atomic failure and no-side-effect tests. |
| `CXL-01` | Request cancellation/abort | `✔️` | `verified-local` | Router cancellation registry, `notifications/cancelled`, `-32800` outcome, and pre-commit cancellation fixture prevent a stale edit commit. | MCP transport + host | Cooperative cancellation cannot interrupt an owner that ignores its token. | Long call/mutation cannot stop | Require owner callbacks to observe the token at commit boundaries. |
| `CXL-02` | Stop/disconnect cancellation safety | `✔️` | `verified-local` | HTTP server stop and request cancellation regressions cancel in-flight bridge work before mutation commit; packaged external disconnect remains unverified. | MCP transport + Flutter | Embedded server | Pending mutation/token leak | Keep local stop-race test; packaged-client disconnect remains evidence-only |
| `SEC-01` | Disabled-by-default server | `✔️` | `verified-local` | No endpoint exists until the user explicitly starts it from the MCP dialog. | Flutter host | The dialog is opt-in; packaged app and native lifecycle smoke remain pending. | Unexpected endpoint | Keep disabled-by-default behavior. |
| `SEC-02` | Loopback-only boundary | `✔️` | `verified-local` | HTTP host binds only to IPv4 loopback and validates Host/Origin. | MCP transport | This is local desktop protection, not remote MCP support. | Remote exposure | Retain loopback and origin rejection tests. |
| `SEC-03` | Opaque per-session token | `✔️` | `verified-local` | Eight-hour opaque bearer token is held in server session and revoked on stop. | MCP session + Flutter | Token/client interaction has not been exercised through a published desktop package. | Token bypass/leak | Keep expiry, stop-revocation, and non-persistence tests. |
| `SEC-04` | Read/write scope enforcement | `✔️` | `verified-local` | Read-only endpoint rejects edit calls; read-write permission is explicit opt-in and checked per request. | MCP session + adapter | Live ChatGPT Desktop write round-trip remains pending. | Read-only token mutates | Retain HTTP permission-denial and read-write edit tests. |
| `SEC-05` | Active-session-only mutation | `✔️` | `verified-local` | Reads and bounded edits route only to the active workbench bridge with identity/revision guards. | Flutter bridge | No document selection or arbitrary filesystem path is exposed to MCP. | Wrong document target | Keep stale-identity/revision integration cases. |
| `SEC-06` | Bounded patch/source size | `✔️` | `verified-local` | Edit bounds reject oversized sources, excessive/overlapping/out-of-range edits in session tests; JSON schema advertises count/length bounds. | MCP session + Flutter | HTTP integration does not yet exercise every rejection boundary. | DoS/whole-file write | Keep bounds at session/bridge and cover boundary values through the wire. |
| `SEC-07` | Filesystem/save isolation | `✔️` | `verified-local` | Edit route updates in-memory editor only; Save/Save As/export remain separate host commands. | Flutter host + MCP | Packaged-app persistence and close/reopen behavior require manual smoke. | Arbitrary write/autosave | Keep no-autosave contract and inspect dirty-state behavior. |
| `SEC-08` | Secret-safe operational visibility | `✔️` | `verified-local` | Dialog and server status expose running mode, endpoint, permission, redacted token metadata, and active-request count without logging or permanently displaying bearer material. | Flutter host | Packaged secret-handling smoke remains unverified. | Secret leakage or false client telemetry | Retain redaction/stop tests; smoke packaged UI when available |
| `DEL-01` | Standalone executable readiness | `⏸️` | `verified-scope` | CLI intentionally roadmap-gated | MCP package | Product decision + conformance | Premature packaging | Decide standalone need after gate |
| `DEL-02` | Desktop runtime dependency readiness | `✔️` | `verified-local` | Embedded Dart HTTP server uses bundled snapshot and avoids a second Node/npm runtime. | Flutter packaging | Platform-specific packaged-app smoke remains pending. | Runtime claim without server | Keep app-owned server lifecycle and offline snapshot tests. |
| `DEL-03` | SDK/transport conformance evidence | `⏸️` | `environment-unavailable/deferred` | Local MCP/Flutter protocol and security tests are verified; external client/Inspector negotiation is unavailable at this boundary. | MCP CI/adapter | Managed socket/client boundary unavailable. | Do not promote local tests to interoperability | Run current-client interoperability smoke and capture protocol version when available. |
| `DEL-04` | Desktop artifact/runtime MCP smoke | `⏸️` | `environment-unavailable/deferred` | Artifact metadata exists; packaged MCP launch/call/security/stop is unavailable at this boundary. | Flutter/workspace CI | Target packaged runtime unavailable. | Do not claim artifact usability | Launch supported packaged artifacts and record MCP smoke. |
| `DEL-05` | Delivery revision provenance | `⏸️` | `environment-unavailable/deferred` | Supporting revision/artifact metadata exists; canonical release boundary is not available in this task. | Workspace delivery | Canonical release/CI boundary unavailable. | Supporting evidence remains non-canonical | Join MCP/Flutter/spec revisions and checksums at release boundary. |
| `DEL-06` | Setup/operations documentation | `⏸️` | `environment-unavailable/deferred` | Local endpoint/token/permission contract and walkthrough are verified; live compatible-client flow is unavailable. | MCP + Flutter docs | Client-compatible target boundary unavailable. | Local setup is not end-user interoperability proof | Run setup walkthrough with a compatible client when available. |

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
  preserve `⏸️`/`➖` scope and environment dispositions until the named boundary
  is available.
