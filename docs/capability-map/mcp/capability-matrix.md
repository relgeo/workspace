# RelGeo MCP — Actionable Capability Matrix

**Baseline:** [expected MCP catalog](./expected-capability-catalog.md)
**Observed evidence:** [current implementation audit](./implementation-audit.md)
**Reconciliation:** [expected-versus-observed register](./reconciliation.md)
**Scope:** RelGeo agent authoring and desktop-connected MCP workflow, DSL `0.5.x`
**Matrix date:** 2026-10-31

## Reading this matrix

Each row is one user-meaningful expected capability. `Status` is the project
implementation result; `Evidence state` is independent and records how strong,
local, absent, defective, deferred, or environment-limited the observation is.
Contract, documentation, fixture, or host-boundary evidence is not promoted to
production delivery evidence.

> **Current evidence note (2026-10-31):** This 68-row matrix is synchronized to
> MCP `b4561c0` and Flutter `60ec760`, including full-spec retrieval, embedded
> loopback HTTP, active-document access, and permission-gated editing. Local
> MCP/Flutter tests and Flutter CI `41184291670` cover those boundaries. The
> user has observed ChatGPT Desktop read-only spec/document calls; live edit
> interoperability and packaged MCP smoke remain unverified. The root
> integration manifest still reflects its 2026-10-09 child pins.

| Status | Meaning |
| --- | --- |
| `✔️` | The stated boundary is implemented with direct evidence. |
| `🌗` | Contract, fixture, or host boundary exists, but the user outcome is incomplete. |
| `❌` | The in-scope implementation/consumer behavior was not found. |
| `⚠️` | A confirmed defect prevents the stated capability from being trusted. |
| `⏸️` | Intentionally roadmap- or decision-gated; the expected row remains. |
| `➖` | Not applicable only where the boundary is explicitly out of scope. |

The matrix contains 68 expected rows: 32 `✔️`, 24 `🌗`, 10 `❌`, 2 `⏸️`, and
0 `⚠️`. Three `🌗` rows have `not-verified` evidence; no current row is marked
`environment-unavailable`. Source ownership and integration boundaries
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
| `EX-01` | Find or retrieve a relevant explanatory example. | `🌗` | `partial-local` | No examples resolver/bundle | MCP adapter + examples owner | No example index, bundle, or lookup. | Versioned examples snapshot. | Add example catalog and retrieval fixture. |
| `EX-02` | Select a small, valid, bounded example for the intent. | `❌` | `verified-absence` | No ranking, minimal-example policy, or fixture | MCP authoring owner | No ranking/minimal-example policy implementation. | Example catalog, validation. | Define and implement minimal-example selection. |

## Completion, validation, diagnostics, and workflow

| ID | Capability / user outcome | Status | Evidence state | Evidence | Owner | Gap / risk | Dependency | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `COMP-01` | Receive bounded source completion at a position. | `🌗` | `partial-local` | No language-service adapter | `language-service` + MCP adapter | No `getCompletions` adapter or executor. | Language-service mapping, adapter. | Add representative completion mapping fixtures. |
| `COMP-02` | Distinguish a completion proposal from an applied edit. | `🌗` | `partial-local` | No runtime proposal generation/handoff | Language-service + MCP contract | Proposal semantics are typed but not runtime-produced. | Source range conversion. | Test proposal output and no-mutation behavior through adapter. |
| `VAL-01` | Validate structure, fields, types, and DSL version. | `🌗` | `partial-local` | DTO exists; parser/validator not invoked | `core` + MCP adapter | MCP never invokes parser/validator. | Core runtime, version guard. | Connect validation tool to core and map diagnostics. |
| `VAL-02` | Parse, resolve, and semantically validate a proposal. | `❌` | `verified-absence` | No MCP parse→validate→resolve path | Core + MCP adapter | Expected pipeline is documented only; semantic validation is unavailable. | Runtime bridge strategy. | Implement parse → validate → resolve adapter path. |
| `VAL-03` | Produce deterministic validation results across hosts. | `🌗` | `not-verified` | Cross-host MCP evidence unavailable | Core + integration owner | Cross-host MCP result parity cannot be assessed yet. | Working adapter, cross-host runner. | Add same-input cross-host conformance case. |
| `DIAG-01` | Return structured code, severity, message, range, origin, provenance. | `🌗` | `partial-local` | No core/language-service mapping | Core/language-service + MCP adapter | Mapping may lose ranges or origin. | Diagnostic conversion, adapter. | Add invalid-fixture mapping tests. |
| `DIAG-02` | Explain a diagnostic code without changing its severity/code. | `❌` | `verified-absence` | No explanation catalog/resolver | MCP docs/resource owner | No versioned explanation content. | Diagnostic catalog, spec snapshot. | Implement explanation catalog and resolver. |
| `DIAG-03` | Preserve `input`, `proposal`, and `activeDocument` distinction. | `🌗` | `partial-local` | DTO only; runtime enforcement absent | MCP contract + Flutter bridge | No runtime tool enforcement. | Validation adapter, session resolver. | Assert source-kind preservation in adapter tests. |
| `WF-01` | Run discovery → example → completion → validation → explanation → render. | `❌` | `verified-absence` | No callable composition layer | MCP orchestration owner | No callable composed workflow. | All read-only tools/resources. | Add workflow smoke gate after individual tools exist. |
| `WF-02` | Use author/debug/explain/review prompts after tools stabilize. | `⏸️` | `verified-scope` | Prompt layer roadmap-gated | MCP workflow owner | Prompt schema/runtime intentionally deferred. | Stable tools/resources, safety review. | Define prompt contract in a follow-up scope decision. |

## Rendering

| ID | Capability / user outcome | Status | Evidence state | Evidence | Owner | Gap / risk | Dependency | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `RENDER-01` | Render source/proposal to in-memory SVG without file writes. | `🌗` | `partial-local` | No core→renderer executor | Core + `renderer-svg` + MCP adapter | No parse → resolve → SVG executor. | Core/renderer bridge. | Add SVG fixture through the adapter. |
| `RENDER-02` | Render an explicit sheet/view target. | `🌗` | `partial-local` | `sheetId` DTO only; no selector | `renderer-svg` + MCP adapter | Sheet/view selection is not connected. | Resolved scene, renderer options. | Add sheet fixture and target mapping test. |
| `RENDER-03` | Return structured diagnostics for render failure. | `❌` | `verified-absence` | No parse/render error mapping | Core/renderer + MCP adapter | No failure-to-diagnostic mapping; crash/false SVG risk. | Error mapping, adapter. | Add invalid render cases to adapter conformance. |

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
| `EDIT-01` | Review bounded, non-overlapping proposal before apply. | `🌗` | `partial-local` | Proposal DTO, no review/call producer | MCP contract + Flutter host | No proposal review surface or MCP call. | Adapter, desktop review UX. | Define proposal response and review boundary. |
| `EDIT-02` | Apply proposal to the active document through the bridge. | `✔️` | `verified-local` | Read-write server exposes bounded `relgeo_apply_document_edit`; HTTP integration applies through the bridge. | Flutter bridge + MCP adapter | Live ChatGPT Desktop edit round-trip remains unverified. | Explicit read-write opt-in and bounded active-document edit. | Capture write-mode client smoke and dirty/undo result. |
| `EDIT-03` | Reject stale identity/revision without partial mutation. | `✔️` | `verified-local` | Live transport race not tested | Flutter session/bridge | Live concurrent transport race is untested. | Server adapter, concurrency test. | Add stale replay through protocol fixture. |
| `EDIT-04` | Make each accepted patch one undoable transaction. | `✔️` | `verified-local` | Full desktop runtime evidence absent | Flutter editor/session | Full desktop runtime Undo smoke is separate. | Desktop runtime, mutation adapter. | Add runtime smoke once server exists. |
| `EDIT-05` | Distinguish applied, stale, rejected, and failed results. | `🌗` | `partial-local` | DTO exists; all protocol states not mapped | MCP session + Flutter bridge | Not all states have protocol serialization/coverage. | Mutation adapter, error mapping. | Add state-by-state protocol tests. |

## Resources and provenance

| ID | Capability / user outcome | Status | Evidence state | Evidence | Owner | Gap / risk | Dependency | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `RES-01` | List/read canonical spec, example, diagnostic, and document URIs. | `✔️` | `verified-local` | Canonical spec index/section and active-document resources are listed/read from bundled index and bridge. | MCP resource layer | Examples and diagnostics resources are not implemented. | Bundled spec resources plus authenticated active-document resources. | Keep URI allowlist and end-to-end resource tests. |
| `RES-02` | Read a versioned diagnostics catalog. | `❌` | `verified-absence` | URI declared; no content/resolver | MCP docs owner | Diagnostic explanations cannot be resolved. | Error catalog, spec revision. | Add catalog resource and provenance fixture. |
| `RES-03` | Use bundled syntax/examples offline. | `✔️` | `verified-local` | Flutter bundles 34 normative Markdown files; index/retrieval tests and loader use AssetBundle offline. | Flutter packaging + spec owner | Offline snapshot covers normative spec, not examples/diagnostics. | 34-file bundled corpus, manifest/digest, loader and retrieval tests. | Keep snapshot drift check and offline startup tests. |
| `RES-04` | Use predictable revision/TTL cache fallback. | `❌` | `verified-absence` | No TTL/revision fallback layer | MCP resource owner | Remote/snapshot mixing could produce wrong semantics. | Snapshot identity, network policy. | Implement pinned cache/fallback policy. |
| `PROV-01` | Preserve source, URL, version, revision, and fetched time in results. | `🌗` | `partial-local` | DTO exists; adapter does not produce results | MCP adapter + spec/docs owners | No result-producing resolver propagates fields. | Resource/tool adapters. | Add provenance assertions to every adapter result. |
| `PROV-02` | Mark spec normative and website/examples explanatory. | `✔️` | `verified-local` | Bundled spec sections carry normative source/version/revision provenance; examples are separately labeled non-normative in the contract. | MCP contract + `spec/id` | Only normative spec corpus is currently retrievable; there is no examples resolver. | Explanatory material could be mistaken as normative authority. | Preserve provenance and source classification in retrieval results. |
| `PROV-03` | Carry rule/example/source chain on a proposal. | `🌗` | `partial-local` | `basedOn[]` exists; producer absent | MCP authoring adapter | No proposal-producing workflow. | Discovery/examples/completion. | Populate and test `basedOn[]` in workflow. |

## Transport and protocol

| ID | Capability / user outcome | Status | Evidence state | Evidence | Owner | Gap / risk | Dependency | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `TRAN-01` | Complete initialize/initialized lifecycle and negotiation. | `✔️` | `verified-local` | HTTP integration exercises initialize/initialized, protocol negotiation, tools and resources. | Flutter MCP transport | External Inspector/client interoperability remains unverified. | Embedded Streamable HTTP initialize and negotiation integration tests. | Record live client negotiation version. |
| `TRAN-02` | Discover/call typed tools and resources over MCP. | `✔️` | `verified-local` | Desktop HTTP integration lists/calls RelGeo tools and reads resources. | Flutter MCP transport | Tool catalog remains intentionally bounded to implemented tools. | HTTP tools/list, tools/call, resources/list/read integration tests. | Retain protocol round-trip tests. |
| `TRAN-03` | Run standalone RelGeo server via stdio. | `🌗` | `partial-local` | Fixture exists; no RelGeo executable | MCP packaging + transport | No `bin/relgeo_mcp.dart` production entrypoint. | SDK adapter, standalone decision. | Implement entrypoint after conformance. |
| `TRAN-04` | Connect desktop server over loopback Streamable HTTP. | `✔️` | `verified-local` | `RelGeoMcpDesktopServer` binds IPv4 loopback on an ephemeral port; Flutter IO integration tests pass. | Flutter MCP transport | Packaged desktop launch and external client smoke remain pending. | IPv4 loopback ephemeral server and Flutter IO integration tests. | Smoke the current release artifact. |
| `TRAN-05` | Reject remote host exposure. | `✔️` | `verified-local` | Desktop HTTP server checks loopback host and origin; integration tests exercise rejection paths. | MCP transport + security | Local-only service; remote MCP is unsupported. | Host/Origin validation and negative integration cases. | Keep remote-origin rejection coverage. |
| `TRAN-06` | Swap SDK without changing contract/session/security. | `🌗` | `partial-local` | No adapter package to exercise boundary | MCP contract + adapter owner | No adapter package exercises boundary. | Candidate SDK conformance. | Keep SDK-neutral until six-item gate passes. |

## Host, bridge, errors, and cancellation

| ID | Capability / user outcome | Status | Evidence state | Evidence | Owner | Gap / risk | Dependency | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `HOST-01` | Keep MCP package pure Dart for standalone and Flutter hosts. | `✔️` | `verified-local` | Contract package is not server delivery | MCP package owner | Contract package is not a complete server. | Adapter packaging. | Preserve boundary in adapter implementation. |
| `HOST-02` | Enable/disable embedded server with app lifecycle. | `✔️` | `verified-local` | Workbench dialog starts/stops the embedded server; app disposal stops it. | Flutter desktop host | Native packaged lifecycle smoke remains pending. | Packaged lifecycle may differ from tested host behavior. | Smoke enable/disable in packaged desktop builds. |
| `HOST-03` | Show status, endpoint, clients, permission, copy config, and Stop. | `🌗` | `partial-local` | Dialog shows running state, mode, endpoint, temporary token/copy config, and Enable/Disable. | Flutter desktop host | Connected-client count/status is not exposed; native UX smoke pending. | User cannot see which client is connected. | Capture packaged setup and stop flow; decide whether client status belongs in scope. |
| `HOST-04` | Compose active source/diagnostics/edit through typed bridge. | `✔️` | `verified-local` | Desktop router calls active-document bridge for snapshots, diagnostics and guarded edits. | Flutter bridge + MCP router | No semantic validation/render composition is provided by the bridge. | Router connects snapshot, diagnostics and bounded edits to active session. | Keep identity/revision and editor transaction tests. |
| `HOST-05` | Share document, language-service, core, and renderer context. | `❌` | `verified-absence` | No composition across core/LS/renderer | Workspace MCP integration | Agent workflow cannot reach integrated consumers. | Runtime bridge strategy. | Define and implement consumer composition boundary. |
| `ERR-01` | Return typed errors for bad schema, bounds, tool, or URI. | `✔️` | `verified-local` | Schema/DTO parity, typed pre-dispatch errors, and focused tests pass | MCP contract + adapter | Semantic domain error mapping remains separate. | Client validation drift | Preserve schema and invalid-input regression gate. |
| `ERR-02` | Preserve domain error code/message/range/origin. | `❌` | `verified-absence` | No core/LS error adapter | Core/language-service + MCP adapter | Agent cannot reliably explain/repair failures. | Error mapping, adapter. | Implement domain error conversion. |
| `ERR-03` | Distinguish auth, forbidden, no-session, stale, failed, stopped. | `🌗` | `partial-local` | Session DTOs exist; protocol states absent | MCP session + transport | No protocol mapping for host/session states. | Server lifecycle, auth middleware. | Define error taxonomy and wire responses. |
| `ERR-04` | Keep failed reads/renders/mutations from partial application. | `🌗` | `partial-local` | Bridge validation/failed divergence only | Flutter bridge + adapter | Transport cancellation/error path absent. | Adapter, cancellation. | Add atomic failure and no-side-effect tests. |
| `CXL-01` | Cancel requests without stale result or mutation. | `❌` | `verified-absence` | No request registry/abort outcome | MCP transport + host | Long work cannot be safely aborted. | SDK cancellation, request registry. | Implement cancellation contract and test. |
| `CXL-02` | Stop/revoke/disconnect prevents pending mutation commit. | `🌗` | `not-verified` | Revoke policy exists; no live lifecycle | Host lifecycle + MCP session | Safety invariant lacks runtime evidence. | Server supervisor, transport. | Add stop/revoke race test on real adapter. |

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
| `SEC-08` | Show operational status without leaking secrets and allow Stop. | `🌗` | `partial-local` | Dialog reports running mode, endpoint, temporary token/copy config, and Disable; connected-client status is absent. | Flutter MCP settings UI | Packaged-app secret-handling and connected-client visibility remain open. | User cannot see which clients are connected. | Smoke dialog in packaged app; decide whether connected-client status is in scope. |

## Delivery and release evidence

| ID | Capability / user outcome | Status | Evidence state | Evidence | Owner | Gap / risk | Dependency | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `DEL-01` | Run standalone package/executable when standalone need is approved. | `⏸️` | `verified-scope` | CLI intentionally roadmap-gated | MCP/package owner | Entrypoint intentionally deferred; no claim of delivery. | SDK/transport gate, standalone decision. | Revisit after standalone consumer decision. |
| `DEL-02` | Use embedded desktop MCP without Node/npm/runtime two. | `✔️` | `verified-local` | Embedded Dart HTTP server uses bundled snapshot and avoids a second Node/npm runtime. | Flutter packaging | Platform-specific packaged-app MCP smoke remains pending. | Embedded Dart server and bundled spec need no Node/npm runtime. | Keep embedded-server/offline-snapshot tests. |
| `DEL-03` | Maintain fixture/error/metadata/bind/Inspector conformance evidence. | `🌗` | `not-verified` | MCP Dart suite and Flutter HTTP integration verify schema, auth, resources, edits, stale guards and loopback behavior. | MCP + Flutter CI | Live ChatGPT Desktop/Inspector interoperability is not yet evidenced. | Dart and Flutter integration suites cover local transport/security/tool paths. | Run live-client protocol and read/write smoke. |
| `DEL-04` | Ship desktop artifacts with separate MCP runtime smoke evidence. | `🌗` | `not-verified` | Desktop v1.0.1 draft contains all three OS bundles and provenance/checksums. | Flutter/workspace delivery | Release v1.0.1 is a draft; MCP-specific packaged runtime was not exercised. | Three OS bundles and checksums exist in workflow run `41184693233`. | Smoke MCP from packaged artifacts before publishing. |
| `DEL-05` | Trace release candidate to package/spec/SDK/OS/run/date revisions. | `🌗` | `partial-local` | Release manifest and per-platform metadata identify Flutter source, OS/architecture, workflow and checksums. | Workspace release owner | Revision evidence is incomplete for MCP delivery. | Adapter lock, release artifact. | Add MCP release provenance record. |
| `DEL-06` | Configure endpoint/token and understand permissions/offline/remote limits. | `🌗` | `partial-local` | Desktop dialog exposes URL/token/copy-config; `flutter/docs/mcp-local-testing.md` documents ChatGPT Desktop setup. | MCP + Flutter docs | Protocol/client compatibility remains a manual setup consideration. | Desktop dialog and `flutter/docs/mcp-local-testing.md` explain configuration. | Keep setup walkthrough current with live-client smoke. |

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
