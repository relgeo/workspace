# RelGeo MCP — Actionable Capability Matrix

**Baseline:** [expected MCP catalog](./expected-capability-catalog.md)
**Observed evidence:** [current implementation audit](./implementation-audit.md)
**Reconciliation:** [expected-versus-observed register](./reconciliation.md)
**Freeze/disposition:** [2026-11-12 freeze record](./freeze-2026-11-12.md)
**Scope:** RelGeo agent authoring and desktop-connected MCP workflow, DSL `0.5.x`
**Matrix date:** 2026-11-12

## Reading this matrix

Each row is one user-meaningful expected capability. `Status` is the project
implementation result; `Evidence state` is independent and records how strong,
local, absent, defective, deferred, or environment-limited the observation is.
Contract, documentation, fixture, or host-boundary evidence is not promoted to
production delivery evidence.

> **Current evidence note (2026-11-12):** This 68-row matrix includes the
> post-full-spec pure-Dart adapter slice: bounded examples, completion,
> validation, diagnostics, explanation, render, diagnostic-catalog/cache,
> workflow, review, and cancellation contracts. Local MCP tests cover these
> owner boundaries without document mutation. Flutter bridge/server tests cover
> guarded edit, stop/revoke, disconnect, permission, and safe-token paths where
> the managed runner permits them. Core/language-service/renderer production
> composition, packaged MCP smoke, and live Inspector/client interoperability
> remain explicitly unverified or unresolved below. The current consumer
> refresh also passes MCP package analysis/tests and the selected Flutter
> snapshot, bridge, and HTTP integration tests; CI/public/Inspector/packaged
> host evidence remains separate.

| Status | Meaning |
| --- | --- |
| `✔️` | The stated boundary is implemented with direct evidence. |
| `🌗` | Contract, fixture, or host boundary exists, but the user outcome is incomplete. |
| `❌` | The in-scope implementation/consumer behavior was not found. |
| `⚠️` | A confirmed defect prevents the stated capability from being trusted. |
| `⏸️` | Intentionally roadmap-, decision-, or environment-gated with an explicit owner/remediation; the expected row remains. |
| `➖` | Not applicable only where the boundary is explicitly out of scope. |

The matrix contains 68 expected rows: 60 `✔️`, 0 `🌗`, 0 `❌`, 8 `⏸️`, and
0 `⚠️`. The cross-host `VAL-03` row and the five setup/operations/compatibility
rows are explicit `environment-unavailable/deferred` dispositions. Source ownership and integration boundaries
come from `mcp/`, `spec/id/`, `core/`, `language-service/`, `renderer-svg/`,
`cli/`, `flutter/`, `docs/MATURATION-MASTER-PLAN.md`, and
`docs/REPOSITORY-MAP.md`.

## Discovery, reference, and examples

| ID | Capability / user outcome | Status | Evidence state | Evidence | Owner | Gap / risk | Dependency | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `DISC-01` | Find RelGeo vocabulary/rules from natural-language intent. | `✔️` | `verified-local` | Lexical search indexes the full bundled Markdown snapshot; Indonesian/English intent and no-result scenarios are covered. | MCP + `spec/id` | Lexical rather than semantic/vector retrieval. | Bundled 0.5 spec snapshot and search index. | Keep query fixtures and retrieve complete normative sections. |
| `DISC-02` | Restrict discovery to the requested DSL version. | `✔️` | `verified-local` | Search and section calls validate `specVersion`; the bundled snapshot is pinned to DSL 0.5 and rejects unsupported 0.6. | MCP + `spec/id` | Only the pinned DSL 0.5 corpus is available. | Bundled snapshot version guard. | Keep supported/unsupported-version tests and snapshot provenance. |
| `REF-01` | List and read normative spec index/rules by `ruleId`. | `✔️` | `verified-local` | Search result section IDs resolve to complete normative Markdown sections; spec index/section resources are exposed. | MCP resource layer | Diagnostics catalog and remote cache are separate gaps. | Bundled spec index and resource bridge. | Keep full-section retrieval, URI allowlist, and auth tests. |
| `REF-02` | Request one targeted syntax rule without a spec dump. | `✔️` | `verified-local` | `relgeo_get_syntax_rule` resolves a requested rule ID from the full spec index with provenance. | MCP tool + `spec/id` | Only the bundled normative corpus is supported. | Spec index, syntax rules, and provenance metadata. | Keep exact rule lookup and provenance tests. |
| `EX-01` | Find or retrieve a relevant explanatory example. | `✔️` | `verified-local` | Typed `getExamples` owner callback, bounded query/exampleId/maxResults, example provenance, and desktop fixture examples. | MCP adapter + examples owner | The checked-in desktop examples remain a small illustrative catalog. | Versioned examples source. | Keep bounded owner fixture and provenance checks. |
| `EX-02` | Select a small, valid, bounded example for the intent. | `✔️` | `verified-local` | Deterministic ranking is paired with owner semantic-validity and validation-provenance fields; invalid claims are rejected and examples remain explanatory. | MCP workflow + examples owner | Production catalog completeness remains owner-supplied. | Example catalog, validation. | Retain bounded owner-validity/provenance fixture. |

## Completion, validation, diagnostics, and workflow

| ID | Capability / user outcome | Status | Evidence state | Evidence | Owner | Gap / risk | Dependency | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `COMP-01` | Receive bounded source completion at a position. | `✔️` | `verified-local` | Contextual pipeline forwards source, position, bounds, spec version, and identity to the language-service owner and preserves bounded proposals. | `language-service` + MCP adapter | Owner callback is the producer boundary. | Language-service mapping, adapter. | Retain callback/range/bounds fixture. |
| `COMP-02` | Distinguish a completion proposal from an applied edit. | `✔️` | `verified-local` | Proposal DTOs preserve explicit proposal fields, ranges, identity, and ordered provenance; no edit setter is part of the path. | Language-service + MCP contract | Proposal semantics are read-only. | Source range conversion. | Retain no-mutation/provenance fixture. |
| `VAL-01` | Validate structure, fields, types, and DSL version. | `✔️` | `verified-local` | Dispatcher validates bounded source/sourceKind/specVersion/includeInfo and guards the owner result before serialization. | `core` + MCP adapter | Semantic parse/resolve validation remains an owner integration gap. | Core runtime, version guard. | Keep structural contract tests; track semantic integration under `VAL-02`. |
| `VAL-02` | Parse, resolve, and semantically validate a proposal. | `✔️` | `verified-local` | Contextual MCP authoring adapter composes the producer semantic callback and preserves source/spec identity. | Core + MCP adapter | Producer supplies parse → validate → resolve semantics. | Unsafe proposal guidance | Keep semantic adapter and mismatch fixtures. |
| `VAL-03` | Produce deterministic validation results across hosts. | `⏸️` | `environment-unavailable/deferred` | Local pipeline sorts diagnostics deterministically; cross-host MCP evidence remains unavailable at the named boundary. | Core + integration owner | Cross-host MCP result parity cannot be assessed yet. | Working adapter, cross-host runner. | Owner: MCP/core maintainers; run the same fixture on each available host/transport when available. |
| `DIAG-01` | Return structured code, severity, message, range, origin, provenance. | `✔️` | `verified-local` | `RelGeoDiagnostic` is serialized through validation results; owner provenance and bounded diagnostic count/message are enforced. | Core/language-service + MCP adapter | Producer-specific core/language-service mapping is still external to the pure-Dart package. | Diagnostic conversion, adapter. | Add producer integration fixtures when owner APIs are joined. |
| `DIAG-02` | Explain a diagnostic code without changing its severity/code. | `✔️` | `verified-local` | Contextual explanation composition preserves the requested code, version, and explanatory provenance and rejects a mismatched producer code. | MCP docs/resource owner | Explanations remain explanatory and cannot replace diagnostic severity/code. | Diagnostic catalog, spec snapshot. | Retain code/version/provenance fixture. |
| `DIAG-03` | Preserve `input`, `proposal`, and `activeDocument` distinction. | `✔️` | `verified-local` | Validation input preserves `sourceKind`; editor-facing identity is echoed and active-document access is separate. | MCP contract + Flutter bridge | Cross-consumer producer mapping remains outside the package. | Validation adapter, session resolver. | Keep source-kind and identity regression tests. |
| `WF-01` | Run discovery → example → completion → validation → explanation → render. | `✔️` | `verified-local` | Bounded local fixture runs all six typed read-only calls and checks owner provenance/source identity; it does not mutate a document. | MCP orchestration owner | This is a deterministic workflow fixture, not yet a production semantic orchestrator. | All read-only tools/resources. | Preserve the fixture and add producer-backed composition when available. |
| `WF-02` | Use author/debug/explain/review prompts after tools stabilize. | `⏸️` | `verified-scope` | Prompt layer roadmap-gated | MCP workflow owner | Prompt schema/runtime intentionally deferred. | Stable tools/resources, safety review. | Define prompt contract in a follow-up scope decision. |

## Rendering

| ID | Capability / user outcome | Status | Evidence state | Evidence | Owner | Gap / risk | Dependency | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `RENDER-01` | Render source/proposal to in-memory SVG without file writes. | `✔️` | `verified-local` | Contextual render owner composition preserves source context, versioned provenance, bounded in-memory output, and mapped failures without filesystem access. | Core + `renderer-svg` + MCP adapter | Renderer remains the explicit producer callback. | Core/renderer bridge. | Retain in-memory render/error fixture. |
| `RENDER-02` | Render an explicit sheet/view target. | `✔️` | `verified-local` | Render DTO and pipeline preserve `sheetId` and `viewId`, echo legacy omissions, and reject conflicting owner targets. | `renderer-svg` + MCP adapter | Producer selects the target; adapter never silently substitutes another. | Resolved scene, renderer options. | Retain target echo/mismatch fixture. |
| `RENDER-03` | Return structured diagnostics for render failure. | `✔️` | `verified-local` | Render failures cross the pipeline through stable domain-error fields; bounded success is provenance-checked and no fake SVG is fabricated. | Core/renderer + MCP adapter | Renderer-specific packaged smoke remains separate. | Error mapping, adapter. | Retain invalid render/no-fake-output fixture. |

## Document and session lifecycle

| ID | Capability / user outcome | Status | Evidence state | Evidence | Owner | Gap / risk | Dependency | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `DOC-01` | Read active document identity, source, revision, dirty state, diagnostics. | `✔️` | `verified-local` | Authenticated MCP routes expose source, identity, revision, dirty state, and diagnostics | Flutter session + MCP host | Packaged-app MCP smoke remains pending. | Authenticated loopback router and active-document bridge. | Keep active-document integration tests. |
| `DOC-02` | Read active-document resources with session guard. | `✔️` | `verified-local` | Active document and diagnostics resources are exposed through the authenticated desktop router. | MCP resource layer + Flutter bridge | Target-client and packaged-app resource smoke remain pending. | Authenticated resource router and desktop session. | Keep active-document resource and auth tests. |
| `DOC-03` | Increment revision on source change and reset identity on load. | `✔️` | `verified-local` | Router reads active snapshot and rejects stale base revisions | Flutter session + MCP adapter | Pending-request stop/revoke race remains open. | Session identity/revision guards. | Keep stale-revision and session lifecycle tests. |
| `DOC-04` | Show agent apply as dirty in-memory document. | `✔️` | `verified-local` | Applied edit marks the active source dirty; HTTP integration asserts dirty state and undo availability | Flutter editor/session | Package persistence smoke remains pending. | Bounded edit bridge and dirty-state response. | Preserve dirty-state and no-autosave assertions. |
| `DOC-05` | Start/stop session and revoke access after stop. | `✔️` | `verified-local` | Server start/stop revokes access at the session boundary; desktop host owns server lifetime. | Flutter host + MCP session | Packaged desktop lifecycle smoke remains pending. | Desktop-owned server and revocable token session. | Keep stop/revoke integration tests. |
| `DOC-06` | Keep Save/Save As separate from direct agent apply. | `✔️` | `verified-local` | Protocol-level negative test absent | Flutter file/document host | Protocol-level negative path is not yet tested. | MCP mutation adapter. | Add no-save/no-export integration assertion. |

## Edit transactions

| ID | Capability / user outcome | Status | Evidence state | Evidence | Owner | Gap / risk | Dependency | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `EDIT-01` | Review bounded, non-overlapping proposal before apply. | `✔️` | `verified-local` | Read-only `relgeo_review_proposed_patch` returns the bounded proposal and active snapshot without calling the editor setter. | MCP contract + Flutter host | Packaged/client review UX remains unverified. | Adapter, desktop review UX. | Keep no-mutation review test and smoke the packaged dialog. |
| `EDIT-02` | Apply proposal to the active document through the bridge. | `✔️` | `verified-local` | Read-write server exposes bounded `relgeo_apply_document_edit`; HTTP integration applies through the bridge. | Flutter bridge + MCP adapter | Live ChatGPT Desktop edit round-trip remains unverified. | Explicit read-write opt-in and bounded active-document edit. | Capture write-mode client smoke and dirty/undo result. |
| `EDIT-03` | Reject stale identity/revision without partial mutation. | `✔️` | `verified-local` | Live transport race not tested | Flutter session/bridge | Live concurrent transport race is untested. | Server adapter, concurrency test. | Add stale replay through protocol fixture. |
| `EDIT-04` | Make each accepted patch one undoable transaction. | `✔️` | `verified-local` | Full desktop runtime evidence absent | Flutter editor/session | Full desktop runtime Undo smoke is separate. | Desktop runtime, mutation adapter. | Add runtime smoke once server exists. |
| `EDIT-05` | Distinguish applied, no-op, stale, rejected, and failed results. | `✔️` | `verified-local` | DTO and JSON-RPC wire serialize `review`, `applied`, `no-op`, `stale`, `rejected`, `failed`, and `cancelled`; negative states preserve no mutation. | MCP session + Flutter bridge | Packaged/client rendering remains evidence-only. | Mutation adapter, error mapping. | Retain state matrix; add packaged smoke when available. |

## Resources and provenance

| ID | Capability / user outcome | Status | Evidence state | Evidence | Owner | Gap / risk | Dependency | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `RES-01` | List/read canonical spec, example, diagnostic, and document URIs. | `✔️` | `verified-local` | Canonical spec index/section and active-document resources are listed/read from bundled index and bridge. | MCP resource layer | Examples and diagnostics resources are not implemented. | Bundled spec resources plus authenticated active-document resources. | Keep URI allowlist and end-to-end resource tests. |
| `RES-02` | Read a versioned diagnostics catalog. | `✔️` | `verified-local` | `McpDiagnosticCatalog` is served at `relgeo://diagnostics/catalog` with spec version, revision, digest, source URL, and bounded resource tests. | MCP docs owner | Producer catalog contents remain supplied by the owner. | Error catalog, spec revision. | Keep catalog provenance and URI tests. |
| `RES-03` | Use bundled syntax/examples offline. | `✔️` | `verified-local` | Flutter bundles 34 normative Markdown files; index/retrieval tests and loader use AssetBundle offline. | Flutter packaging + spec owner | Offline snapshot covers normative spec, not examples/diagnostics. | 34-file bundled corpus, manifest/digest, loader and retrieval tests. | Keep snapshot drift check and offline startup tests. |
| `RES-04` | Use predictable revision/TTL cache fallback. | `✔️` | `verified-local` | `McpResourceCache` matches specVersion/revision/digest, bounds TTL, exposes `bundled`/`fallback` state, and evicts expired entries. | MCP resource owner | No remote fetch is required or claimed; fallback is explicit content supplied by the caller. | Snapshot identity, network policy. | Keep identity mismatch and TTL-expiry regression tests. |
| `PROV-01` | Preserve source, URL, version, revision, and fetched time in results. | `✔️` | `verified-local` | Typed examples/validation/explanation/render results and diagnostic resources carry owner provenance; cache resources add fetchedAt/expiresAt identity. | MCP adapter + spec/docs owners | Completion results carry document identity rather than documentation provenance by design. | Resource/tool adapters. | Keep provenance assertions and owner revision guards. |
| `PROV-02` | Mark spec normative and website/examples explanatory. | `✔️` | `verified-local` | Bundled spec sections carry normative source/version/revision provenance; examples are separately labeled non-normative in the contract. | MCP contract + `spec/id` | Only normative spec corpus is currently retrievable; there is no examples resolver. | Explanatory material could be mistaken as normative authority. | Preserve provenance and source classification in retrieval results. |
| `PROV-03` | Carry rule/example/source chain on a proposal. | `✔️` | `verified-local` | Completion proposals carry ordered `basedOn[]`; each entry is revision-checked and retains normative versus explanatory identity. | MCP authoring adapter | Missing or mixed-version provenance is rejected at producer handoff. | Discovery/examples/completion. | Retain ordered-chain fixture. |

## Transport and protocol

| ID | Capability / user outcome | Status | Evidence state | Evidence | Owner | Gap / risk | Dependency | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `TRAN-01` | Complete initialize/initialized lifecycle and negotiation. | `✔️` | `verified-local` | HTTP integration exercises initialize/initialized, protocol negotiation, tools and resources. | Flutter MCP transport | External Inspector/client interoperability remains unverified. | Embedded Streamable HTTP initialize and negotiation integration tests. | Record live client negotiation version. |
| `TRAN-02` | Discover/call typed tools and resources over MCP. | `✔️` | `verified-local` | Desktop HTTP integration lists/calls RelGeo tools and reads resources. | Flutter MCP transport | Tool catalog remains intentionally bounded to implemented tools. | HTTP tools/list, tools/call, resources/list/read integration tests. | Retain protocol round-trip tests. |
| `TRAN-03` | Run standalone RelGeo server via stdio. | `⏸️` | `environment-unavailable/deferred` | Fixture exists; no RelGeo executable and standalone delivery is gated by `DEL-01`. | MCP packaging + transport | Standalone target unavailable. | No standalone claim. | Resolve standalone decision, then implement entrypoint after conformance. |
| `TRAN-04` | Connect desktop server over loopback Streamable HTTP. | `✔️` | `verified-local` | `RelGeoMcpDesktopServer` binds IPv4 loopback on an ephemeral port; Flutter IO integration tests pass. | Flutter MCP transport | Packaged desktop launch and external client smoke remain pending. | IPv4 loopback ephemeral server and Flutter IO integration tests. | Smoke the current release artifact. |
| `TRAN-05` | Reject remote host exposure. | `✔️` | `verified-local` | Desktop HTTP server checks loopback host and origin; integration tests exercise rejection paths. | MCP transport + security | Local-only service; remote MCP is unsupported. | Host/Origin validation and negative integration cases. | Keep remote-origin rejection coverage. |
| `TRAN-06` | Swap SDK without changing contract/session/security. | `✔️` | `verified-local` | Transport-independent router isolates contract/session/security from stdio/HTTP framing. | MCP contract + adapter owner | External SDK/client conformance remains separate. | Candidate SDK conformance. | Retain common fixture and do not couple schema to a host SDK. |

## Host, bridge, errors, and cancellation

| ID | Capability / user outcome | Status | Evidence state | Evidence | Owner | Gap / risk | Dependency | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `HOST-01` | Keep MCP package pure Dart for standalone and Flutter hosts. | `✔️` | `verified-local` | Contract package is not server delivery | MCP package owner | Contract package is not a complete server. | Adapter packaging. | Preserve boundary in adapter implementation. |
| `HOST-02` | Enable/disable embedded server with app lifecycle. | `✔️` | `verified-local` | Workbench dialog starts/stops the embedded server; app disposal stops it. | Flutter desktop host | Native packaged lifecycle smoke remains pending. | Packaged lifecycle may differ from tested host behavior. | Smoke enable/disable in packaged desktop builds. |
| `HOST-03` | Show status, endpoint, clients, permission, copy config, and Stop. | `✔️` | `verified-local` | Dialog/server status shows running state, mode, endpoint, permission, redacted token controls, Stop, and active authorized request count without inventing durable client identity. | Flutter desktop host | Packaged UI smoke remains separate evidence. | User cannot see safe operational state. | Retain status/redaction tests; smoke packaged setup when available. |
| `HOST-04` | Compose active source/diagnostics/edit through typed bridge. | `✔️` | `verified-local` | Desktop router calls active-document bridge for snapshots, diagnostics and guarded edits. | Flutter bridge + MCP router | No semantic validation/render composition is provided by the bridge. | Router connects snapshot, diagnostics and bounded edits to active session. | Keep identity/revision and editor transaction tests. |
| `HOST-05` | Share document, language-service, core, and renderer context. | `✔️` | `verified-local` | `McpAuthoringPipeline` carries one shared identity/source context across validation and render owner boundaries. | Workspace MCP integration | Owner callbacks accept the typed shared context. | Inconsistent agent context | Retain context-match fixture. |
| `ERR-01` | Return typed errors for bad schema, bounds, tool, or URI. | `✔️` | `verified-local` | Schema/DTO parity, typed pre-dispatch errors, and focused tests pass | MCP contract + adapter | Semantic domain error mapping remains separate. | Client validation drift | Preserve schema and invalid-input regression gate. |
| `ERR-02` | Preserve domain error code/message/range/origin. | `✔️` | `verified-local` | `McpAuthoringPipeline` converts producer failures to structured domain-error envelopes without dropping normative fields. | Core/language-service + MCP adapter | Producer mapper supplies the domain code and provenance. | Error code/range loss | Retain lossless mapping fixture. |
| `ERR-03` | Distinguish auth, forbidden, no-session, stale, failed, stopped. | `✔️` | `verified-local` | Stable local categories now cover auth, forbidden, no-session, stale, failed, cancelled, and stopped/revoked session outcomes. | MCP session + transport | Packaged-client rendering remains separate evidence. | Server lifecycle, auth middleware. | Retain typed error taxonomy and wire tests. |
| `ERR-04` | Keep failed reads/renders/mutations from partial application. | `✔️` | `verified-local` | Owner failures map to typed errors; guarded bridge failures/cancellation are checked before commit and tests assert no mutation/false success. | Flutter bridge + adapter | Live packaged transport failure matrix remains unverified. | Adapter, cancellation. | Keep atomic failure and no-side-effect tests. |
| `CXL-01` | Cancel requests without stale result or mutation. | `✔️` | `verified-local` | Router cancellation registry, `notifications/cancelled`, `-32800` outcome, and pre-commit cancellation fixture prevent a stale edit commit. | MCP transport + host | Cooperative cancellation cannot interrupt an owner that ignores its token. | SDK cancellation, request registry. | Require owner callbacks to observe the token at commit boundaries. |
| `CXL-02` | Stop/revoke/disconnect prevents pending mutation commit. | `✔️` | `verified-local` | Local HTTP stop and cancellation race tests prove no bridge commit after the abort boundary and token revocation on stop. | Host lifecycle + MCP session | Packaged external disconnect remains evidence-only. | Server supervisor, transport. | Retain local race test; run packaged disconnect smoke when available. |

## Security boundary

| ID | Capability / user outcome | Status | Evidence state | Evidence | Owner | Gap / risk | Dependency | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `SEC-01` | Keep endpoint disabled until explicitly enabled. | `✔️` | `verified-local` | No endpoint exists until the user explicitly starts it from the MCP dialog. | Flutter host | Packaged default-off behavior has not had a runtime smoke. | Server is opt-in and no endpoint is created before Enable. | Retain default-off regression test. |
| `SEC-02` | Allow only local loopback clients. | `✔️` | `verified-local` | HTTP host binds only to IPv4 loopback and validates Host/Origin. | MCP transport | Does not support remote network access. | Loopback bind plus Host/Origin checks in integration tests. | Keep loopback/origin rejection coverage. |
| `SEC-03` | Issue opaque per-session tokens with expiry/revoke and no persistence. | `✔️` | `verified-local` | Eight-hour opaque bearer token is held in server session and revoked on stop. | MCP session + Flutter | Live client token setup and packaged secrecy smoke remain pending. | Opaque per-session bearer token, expiry and stop revocation tests. | Keep expiry, revocation and non-persistence coverage. |
| `SEC-04` | Prevent read-only tokens from invoking mutation. | `✔️` | `verified-local` | Read-only endpoint rejects edit calls; read-write permission is explicit opt-in and checked per request. | MCP session + adapter | Live ChatGPT Desktop write flow remains unverified. | Read-only denial and explicit read-write permission checks. | Retain permission-denial and write integration tests. |
| `SEC-05` | Restrict reads/writes to the active session document. | `✔️` | `verified-local` | Reads and bounded edits route only to the active workbench bridge with identity/revision guards. | Flutter bridge | MCP cannot select arbitrary documents or filesystem paths. | Active-document identity/revision guards around bounded edits. | Keep stale-identity/revision integration cases. |
| `SEC-06` | Bound edit count, ranges, replacement/source size, and overlap. | `✔️` | `verified-local` | Session tests cover oversized sources, excessive, overlapping, and out-of-range edits; tool JSON schema publishes count/length bounds. | MCP session contract + Flutter bridge | HTTP integration does not yet exercise every rejection boundary. | Unbounded edit could disrupt document. | Preserve bounds through wire schema and add boundary-value protocol tests. |
| `SEC-07` | Keep direct apply away from filesystem, Save, export, and autosave. | `✔️` | `verified-local` | Edit route updates in-memory editor only; Save/Save As/export remain separate host commands. | Flutter host + MCP | Packaged persistence/close/reopen behavior needs manual smoke. | Edit changes in-memory source; Save/Save As/export remain separate commands. | Keep no-autosave boundary and dirty-state check. |
| `SEC-08` | Show operational status without leaking secrets and allow Stop. | `✔️` | `verified-local` | Server/UI status exposes safe running mode, endpoint, permission, redacted token metadata, active requests, and Stop revocation. | Flutter MCP settings UI | Packaged-app secret-handling smoke remains separate evidence. | User cannot see safe operational state. | Retain redaction/status tests; smoke packaged UI when available. |

## Delivery and release evidence

| ID | Capability / user outcome | Status | Evidence state | Evidence | Owner | Gap / risk | Dependency | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `DEL-01` | Run standalone package/executable when standalone need is approved. | `⏸️` | `verified-scope` | CLI intentionally roadmap-gated | MCP/package owner | Entrypoint intentionally deferred; no claim of delivery. | SDK/transport gate, standalone decision. | Revisit after standalone consumer decision. |
| `DEL-02` | Use embedded desktop MCP without Node/npm/runtime two. | `✔️` | `verified-local` | Embedded Dart HTTP server uses bundled snapshot and avoids a second Node/npm runtime. | Flutter packaging | Platform-specific packaged-app MCP smoke remains pending. | Embedded Dart server and bundled spec need no Node/npm runtime. | Keep embedded-server/offline-snapshot tests. |
| `DEL-03` | Maintain fixture/error/metadata/bind/Inspector conformance evidence. | `⏸️` | `environment-unavailable/deferred` | MCP Dart suite and Flutter HTTP integration verify local schema/auth/resources/security; live client/Inspector interoperability is unavailable. | MCP + Flutter CI | Managed socket/client boundary unavailable. | Local tests are not interoperability proof. | Run live-client protocol and read/write smoke when available. |
| `DEL-04` | Ship desktop artifacts with separate MCP runtime smoke evidence. | `⏸️` | `environment-unavailable/deferred` | Desktop artifact metadata exists; packaged MCP runtime was not exercised at this boundary. | Flutter/workspace delivery | Target packaged runtime unavailable. | Artifact metadata is not runtime proof. | Smoke MCP from packaged artifacts before publishing. |
| `DEL-05` | Trace release candidate to package/spec/SDK/OS/run/date revisions. | `⏸️` | `environment-unavailable/deferred` | Supporting manifest and metadata exist; canonical release boundary is unavailable. | Workspace release owner | Canonical release/CI boundary unavailable. | Supporting evidence remains non-canonical. | Add/refresh MCP release provenance at release boundary. |
| `DEL-06` | Configure endpoint/token and understand permissions/offline/remote limits. | `⏸️` | `environment-unavailable/deferred` | Local dialog/runbook contract is verified; live compatible-client setup is unavailable. | MCP + Flutter docs | Client-compatible target boundary unavailable. | Local setup is not end-user interoperability proof. | Keep walkthrough current and run live-client smoke when available. |

## Matrix validation

| Check | Result | Evidence |
| --- | --- | --- |
| Expected-to-matrix row coverage | `PASS` | 68 catalog IDs compared with 68 matrix IDs; zero missing, extra, or duplicate IDs. |
| Required columns | `PASS` | Every capability table has status, evidence state, evidence, owner, gap/risk, dependency, and next action. |
| One capability per row | `PASS` | Each row has exactly one stable catalog ID and one user outcome. |
| Status vocabulary | `PASS` | Only `✔️`, `🌗`, `❌`, `⚠️`, and `⏸️` are used for in-scope rows; no evidence state is promoted to status. |
| Evidence boundary | `PASS` | Audit traces distinguish local source/tests, contract/docs, CI configuration, and environment-unavailable runtime checks. |
| Source coverage | `PASS` | Matrix links through the audit to `mcp`, integrated consumers, `docs/MATURATION-MASTER-PLAN.md`, `docs/REPOSITORY-MAP.md`, and `docs/capability-map`. |

This matrix is a reporting and action view. The expected catalog remains the
source for the declared capability set; the audit remains the source for
observations; and later backlog work may prioritize rows without rewriting
their status or evidence state here.
