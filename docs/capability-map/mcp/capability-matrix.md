# RelGeo MCP — Actionable Capability Matrix

**Baseline:** [expected MCP catalog](./expected-capability-catalog.md)
**Observed evidence:** [current implementation audit](./implementation-audit.md)
**Reconciliation:** [expected-versus-observed register](./reconciliation.md)
**Scope:** RelGeo agent authoring and desktop-connected MCP workflow, DSL `0.5.x`
**Matrix date:** 2026-10-30

## Reading this matrix

Each row is one user-meaningful expected capability. `Status` is the project
implementation result; `Evidence state` is independent and records how strong,
local, absent, defective, deferred, or environment-limited the observation is.
Contract, documentation, fixture, or host-boundary evidence is not promoted to
production delivery evidence.

> **Plan 14 freshness note (2026-10-30):** The generic 68-row matrix below
> retains the broader Plan 11 backlog/status join and is not a replacement for
> the current full-spec overlay in
> [implementation-audit.md](./implementation-audit.md). Current local evidence
> covers the bundled 34-file snapshot, deterministic section index and
> adapter, offline Flutter loader, provenance/normativity, and retrieval
> scenarios. The matrix's historical “no snapshot/index” wording must be read
> as pre-implementation context. Live Inspector/Codex Desktop/loopback HTTP is
> still `not-verified`, and the root baseline has not been advanced for these
> uncommitted child changes.

| Status | Meaning |
| --- | --- |
| `✔️` | The stated boundary is implemented with direct evidence. |
| `🌗` | Contract, fixture, or host boundary exists, but the user outcome is incomplete. |
| `❌` | The in-scope implementation/consumer behavior was not found. |
| `⚠️` | A confirmed defect prevents the stated capability from being trusted. |
| `⏸️` | Intentionally roadmap- or decision-gated; the expected row remains. |
| `➖` | Not applicable only where the boundary is explicitly out of scope. |

The matrix contains 68 expected rows: 11 `✔️`, 41 `🌗`, 14 `❌`, 2 `⏸️`, and
0 `⚠️`. Three `🌗` rows have `not-verified` evidence, and `TRAN-04` has
`environment-unavailable` evidence. Source ownership and integration boundaries
come from `mcp/`, `spec/id/`, `core/`, `language-service/`, `renderer-svg/`,
`cli/`, `flutter/`, `docs/MATURATION-MASTER-PLAN.md`, and
`docs/REPOSITORY-MAP.md`.

## Discovery, reference, and examples

| ID | Capability / user outcome | Status | Evidence state | Evidence | Owner | Gap / risk | Dependency | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `DISC-01` | Find RelGeo vocabulary/rules from natural-language intent. | `🌗` | `partial-local` | Current audit §3; `mcp_schema.dart` `FindSyntaxInput/Result`. | MCP adapter + `spec/id` | No query/index executor; agent cannot call discovery. | Spec catalog, adapter. | Implement bounded query resolver and tool fixture. |
| `DISC-02` | Restrict discovery to the requested DSL version. | `🌗` | `partial-local` | Current audit §3; `specVersion` DTO field in `mcp_schema.dart`. | MCP adapter + spec owner | No version selector or mixed-version rejection. | Versioned spec snapshot. | Add version guard and active/legacy/unsupported tests. |
| `REF-01` | List and read normative spec index/rules by `ruleId`. | `🌗` | `partial-local` | Current audit §3; canonical `relgeo://spec/*` parser. | MCP resource resolver + `spec/id` | URI parser exists without content resolver. | Snapshot packaging, adapter. | Implement `resources/list/read` for spec snapshot. |
| `REF-02` | Request one targeted syntax rule without a spec dump. | `🌗` | `partial-local` | Current audit §3; `GetSyntaxRuleInput`, `SyntaxRuleResult`. | MCP tool/resource owner | Typed contract has no execution/documentation source. | Spec resolver, provenance. | Add rule lookup with bounded output and revision guard. |
| `EX-01` | Find or retrieve a relevant explanatory example. | `🌗` | `partial-local` | Current audit §3; example DTOs and URI templates. | MCP adapter + examples owner | No example index, bundle, or lookup. | Versioned examples snapshot. | Add example catalog and retrieval fixture. |
| `EX-02` | Select a small, valid, bounded example for the intent. | `❌` | `verified-absence` | Current audit §3; no selector/bundle/intent fixture found. | MCP authoring owner | No ranking/minimal-example policy implementation. | Example catalog, validation. | Define and implement minimal-example selection. |

## Completion, validation, diagnostics, and workflow

| ID | Capability / user outcome | Status | Evidence state | Evidence | Owner | Gap / risk | Dependency | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `COMP-01` | Receive bounded source completion at a position. | `🌗` | `partial-local` | Current audit §3; completion DTO/schema in `mcp_schema.dart`. | `language-service` + MCP adapter | No `getCompletions` adapter or executor. | Language-service mapping, adapter. | Add representative completion mapping fixtures. |
| `COMP-02` | Distinguish a completion proposal from an applied edit. | `🌗` | `partial-local` | Current audit §3; `completion-proposal` serialization. | Language-service + MCP contract | Proposal semantics are typed but not runtime-produced. | Source range conversion. | Test proposal output and no-mutation behavior through adapter. |
| `VAL-01` | Validate structure, fields, types, and DSL version. | `🌗` | `partial-local` | Current audit §3; `ValidateSourceInput/ValidationResult`. | `core` + MCP adapter | MCP never invokes parser/validator. | Core runtime, version guard. | Connect validation tool to core and map diagnostics. |
| `VAL-02` | Parse, resolve, and semantically validate a proposal. | `❌` | `verified-absence` | Current audit §3; no MCP core execution path. | Core + MCP adapter | Expected pipeline is documented only; semantic validation is unavailable. | Runtime bridge strategy. | Implement parse → validate → resolve adapter path. |
| `VAL-03` | Produce deterministic validation results across hosts. | `🌗` | `not-verified` | Current audit §3; DSL semantic guarantee, no MCP execution evidence. | Core + integration owner | Cross-host MCP result parity cannot be assessed yet. | Working adapter, cross-host runner. | Add same-input cross-host conformance case. |
| `DIAG-01` | Return structured code, severity, message, range, origin, provenance. | `🌗` | `partial-local` | Current audit §3; `RelGeoDiagnostic` fields. | Core/language-service + MCP adapter | Mapping may lose ranges or origin. | Diagnostic conversion, adapter. | Add invalid-fixture mapping tests. |
| `DIAG-02` | Explain a diagnostic code without changing its severity/code. | `❌` | `verified-absence` | Current audit §3; DTO exists, no catalog/resolver. | MCP docs/resource owner | No versioned explanation content. | Diagnostic catalog, spec snapshot. | Implement explanation catalog and resolver. |
| `DIAG-03` | Preserve `input`, `proposal`, and `activeDocument` distinction. | `🌗` | `partial-local` | Current audit §3; `SourceArtifactKind` serialization. | MCP contract + Flutter bridge | No runtime tool enforcement. | Validation adapter, session resolver. | Assert source-kind preservation in adapter tests. |
| `WF-01` | Run discovery → example → completion → validation → explanation → render. | `❌` | `verified-absence` | Current audit §3; Plan 11 sequence only. | MCP orchestration owner | No callable composed workflow. | All read-only tools/resources. | Add workflow smoke gate after individual tools exist. |
| `WF-02` | Use author/debug/explain/review prompts after tools stabilize. | `⏸️` | `verified-scope` | Current audit §3; Plan 11 prompt roadmap. | MCP workflow owner | Prompt schema/runtime intentionally deferred. | Stable tools/resources, safety review. | Define prompt contract in a follow-up scope decision. |

## Rendering

| ID | Capability / user outcome | Status | Evidence state | Evidence | Owner | Gap / risk | Dependency | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `RENDER-01` | Render source/proposal to in-memory SVG without file writes. | `🌗` | `partial-local` | Current audit §3; `RenderSourceInput/RenderResult`, renderer ownership. | Core + `renderer-svg` + MCP adapter | No parse → resolve → SVG executor. | Core/renderer bridge. | Add SVG fixture through the adapter. |
| `RENDER-02` | Render an explicit sheet/view target. | `🌗` | `partial-local` | Current audit §3; optional `sheetId` DTO field. | `renderer-svg` + MCP adapter | Sheet/view selection is not connected. | Resolved scene, renderer options. | Add sheet fixture and target mapping test. |
| `RENDER-03` | Return structured diagnostics for render failure. | `❌` | `verified-absence` | Current audit §3; contract requirement, fixture only echoes. | Core/renderer + MCP adapter | No failure-to-diagnostic mapping; crash/false SVG risk. | Error mapping, adapter. | Add invalid render cases to adapter conformance. |

## Document and session lifecycle

| ID | Capability / user outcome | Status | Evidence state | Evidence | Owner | Gap / risk | Dependency | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `DOC-01` | Read active document identity, source, revision, dirty state, diagnostics. | `✔️` | `verified-local` | Current audit §3; `WorkbenchDocumentSession`, bridge, Flutter test. | Flutter session + bridge | Host boundary exists but is not MCP-exposed. | Resource resolver, server adapter. | Expose snapshot through guarded resource. |
| `DOC-02` | Read active-document resources with session guard. | `❌` | `verified-absence` | Current audit §3; URI parser only, no resolver. | MCP resource + Flutter host | No active resource route/token guard. | Server session, bridge. | Implement guarded `document/active*` resolver. |
| `DOC-03` | Increment revision on source change and reset identity on load. | `✔️` | `verified-local` | Current audit §3; document session source/test. | Flutter document session | Server lifecycle does not consume values. | MCP session adapter. | Add adapter lifecycle integration test. |
| `DOC-04` | Show agent apply as dirty in-memory document. | `✔️` | `verified-local` | Current audit §3; bridge/editor test asserts dirty. | Flutter editor/session | No MCP status surface exposes this state. | Host status UI, server adapter. | Map dirty state into active snapshot/result. |
| `DOC-05` | Start/stop session and revoke access after stop. | `🌗` | `partial-local` | Current audit §3; token store issue/expiry/revoke tests. | Flutter host + MCP session | No server lifecycle owns token store. | Transport adapter, host lifecycle. | Implement server owner with stop/revoke semantics. |
| `DOC-06` | Keep Save/Save As separate from direct agent apply. | `✔️` | `verified-local` | Current audit §3; bridge/file service boundary. | Flutter file/document host | Protocol-level negative path is not yet tested. | MCP mutation adapter. | Add no-save/no-export integration assertion. |

## Edit transactions

| ID | Capability / user outcome | Status | Evidence state | Evidence | Owner | Gap / risk | Dependency | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `EDIT-01` | Review bounded, non-overlapping proposal before apply. | `🌗` | `partial-local` | Current audit §3; `DocumentEditProposal` bounds/summary/rationale. | MCP contract + Flutter host | No proposal review surface or MCP call. | Adapter, desktop review UX. | Define proposal response and review boundary. |
| `EDIT-02` | Apply proposal to the active document through the bridge. | `🌗` | `partial-local` | Current audit §3; `WorkbenchAgentBridge.applyDocumentEdit`. | Flutter bridge + MCP adapter | Bridge exists, but no mutation tool/transport. | Read-write token, adapter decision. | Add explicitly authorized mutation adapter later. |
| `EDIT-03` | Reject stale identity/revision without partial mutation. | `✔️` | `verified-local` | Current audit §3; bridge/session stale-guard tests. | Flutter session/bridge | Live concurrent transport race is untested. | Server adapter, concurrency test. | Add stale replay through protocol fixture. |
| `EDIT-04` | Make each accepted patch one undoable transaction. | `✔️` | `verified-local` | Current audit §3; editor setter and Flutter bridge test. | Flutter editor/session | Full desktop runtime Undo smoke is separate. | Desktop runtime, mutation adapter. | Add runtime smoke once server exists. |
| `EDIT-05` | Distinguish applied, stale, rejected, and failed results. | `🌗` | `partial-local` | Current audit §3; `DocumentEditResult` states. | MCP session + Flutter bridge | Not all states have protocol serialization/coverage. | Mutation adapter, error mapping. | Add state-by-state protocol tests. |

## Resources and provenance

| ID | Capability / user outcome | Status | Evidence state | Evidence | Owner | Gap / risk | Dependency | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `RES-01` | List/read canonical spec, example, diagnostic, and document URIs. | `🌗` | `partial-local` | Current audit §3; URI parser and seven URI templates. | MCP resource layer | No `resources/list/read` implementation. | Snapshot store, session guard. | Implement resolver registry and invalid-URI errors. |
| `RES-02` | Read a versioned diagnostics catalog. | `❌` | `verified-absence` | Current audit §3; URI declared, no content/resolver. | MCP docs owner | Diagnostic explanations cannot be resolved. | Error catalog, spec revision. | Add catalog resource and provenance fixture. |
| `RES-03` | Use bundled syntax/examples offline. | `❌` | `verified-absence` | Current audit §3; no snapshot/bundle manifest. | MCP packaging + spec owner | Offline authoring cannot run from MCP package. | Snapshot build, release packaging. | Define snapshot artifact and offline smoke test. |
| `RES-04` | Use predictable revision/TTL cache fallback. | `❌` | `verified-absence` | Current audit §3; no cache/TTL/fetch implementation. | MCP resource owner | Remote/snapshot mixing could produce wrong semantics. | Snapshot identity, network policy. | Implement pinned cache/fallback policy. |
| `PROV-01` | Preserve source, URL, version, revision, and fetched time in results. | `🌗` | `partial-local` | Current audit §3; provenance DTO serialization/tests. | MCP adapter + spec/docs owners | No result-producing resolver propagates fields. | Resource/tool adapters. | Add provenance assertions to every adapter result. |
| `PROV-02` | Mark spec normative and website/examples explanatory. | `✔️` | `verified-local` | Current audit §3; provenance getter and schema tests. | MCP contract + `spec/id` | Resolver precedence is not runtime-enforced. | Resource resolver. | Enforce precedence in resolver tests. |
| `PROV-03` | Carry rule/example/source chain on a proposal. | `🌗` | `partial-local` | Current audit §3; `SourceProposal.basedOn`. | MCP authoring adapter | No proposal-producing workflow. | Discovery/examples/completion. | Populate and test `basedOn[]` in workflow. |

## Transport and protocol

| ID | Capability / user outcome | Status | Evidence state | Evidence | Owner | Gap / risk | Dependency | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `TRAN-01` | Complete initialize/initialized lifecycle and negotiation. | `🌗` | `partial-local` | Current audit §3; dependency-free fixture handshake. | MCP transport adapter | Fixture is not a production server; SDK unselected. | SDK choice, adapter. | Run candidate SDK against shared fixture. |
| `TRAN-02` | Discover/call typed tools and resources over MCP. | `🌗` | `partial-local` | Current audit §3; fixture wire methods and typed catalog. | MCP protocol adapter | Fixture exposes only `relgeo_fixture_echo`. | Tool/resource resolver. | Wire one real read-only tool/resource end-to-end. |
| `TRAN-03` | Run standalone RelGeo server via stdio. | `🌗` | `partial-local` | Current audit §3; stdio fixture round-trip. | MCP packaging + transport | No `bin/relgeo_mcp.dart` production entrypoint. | SDK adapter, standalone decision. | Implement entrypoint after conformance. |
| `TRAN-04` | Connect desktop server over loopback Streamable HTTP. | `🌗` | `environment-unavailable` | Current audit §3; fixture targets `127.0.0.1`, sandbox denied bind. | MCP transport + Flutter host | Production adapter absent; HTTP proof unavailable here. | Writable runner, SDK conformance. | Run on allowed desktop/CI host. |
| `TRAN-05` | Reject remote host exposure. | `🌗` | `partial-local` | Current audit §3; policy/fixture loopback checks. | MCP transport/security | No production server enforces policy; fixture has no token auth. | Production adapter, auth. | Add remote-bind and auth rejection tests. |
| `TRAN-06` | Swap SDK without changing contract/session/security. | `🌗` | `partial-local` | Current audit §3; protocol-agnostic package and no pinned SDK. | MCP contract + adapter owner | No adapter package exercises boundary. | Candidate SDK conformance. | Keep SDK-neutral until six-item gate passes. |

## Host, bridge, errors, and cancellation

| ID | Capability / user outcome | Status | Evidence state | Evidence | Owner | Gap / risk | Dependency | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `HOST-01` | Keep MCP package pure Dart for standalone and Flutter hosts. | `✔️` | `verified-local` | Current audit §3; `relgeo_mcp.dart` exports pure contracts; analyze pass. | MCP package owner | Contract package is not a complete server. | Adapter packaging. | Preserve boundary in adapter implementation. |
| `HOST-02` | Enable/disable embedded server with app lifecycle. | `❌` | `verified-absence` | Current audit §3; no server service/lifecycle wiring. | Flutter host | Endpoint cannot be started/stopped by desktop user. | Transport adapter, host lifecycle. | Add server supervisor and lifecycle tests. |
| `HOST-03` | Show status, endpoint, clients, permission, copy config, and Stop. | `❌` | `verified-absence` | Current audit §3; no MCP route/menu/status refs. | Flutter UI/host | Required operational surface is absent. | Server supervisor, secure config model. | Add Settings/Tools/MCP Server surface. |
| `HOST-04` | Compose active source/diagnostics/edit through typed bridge. | `✔️` | `verified-local` | Current audit §3; `WorkbenchAgentBridge` and Flutter test. | Flutter bridge + MCP contract | No protocol adapter invokes the bridge. | Server adapter, session guard. | Connect bridge to guarded resources/tools. |
| `HOST-05` | Share document, language-service, core, and renderer context. | `❌` | `verified-absence` | Current audit §3; no MCP composition imports/calls. | Workspace MCP integration | Agent workflow cannot reach integrated consumers. | Runtime bridge strategy. | Define and implement consumer composition boundary. |
| `ERR-01` | Return typed errors for bad schema, bounds, tool, or URI. | `✔️` | `verified-local` | Current audit §4; schema/DTO parity and typed pre-dispatch errors covered by the passing package suite. | MCP contract + adapter | Semantic domain error mapping remains separate. | Client validation drift | Preserve schema and invalid-input regression gate. |
| `ERR-02` | Preserve domain error code/message/range/origin. | `❌` | `verified-absence` | Current audit §3; no core/language-service error mapping. | Core/language-service + MCP adapter | Agent cannot reliably explain/repair failures. | Error mapping, adapter. | Implement domain error conversion. |
| `ERR-03` | Distinguish auth, forbidden, no-session, stale, failed, stopped. | `🌗` | `partial-local` | Current audit §3; session result/token types. | MCP session + transport | No protocol mapping for host/session states. | Server lifecycle, auth middleware. | Define error taxonomy and wire responses. |
| `ERR-04` | Keep failed reads/renders/mutations from partial application. | `🌗` | `partial-local` | Current audit §3; proposal validates before one editor setter. | Flutter bridge + adapter | Transport cancellation/error path absent. | Adapter, cancellation. | Add atomic failure and no-side-effect tests. |
| `CXL-01` | Cancel requests without stale result or mutation. | `❌` | `verified-absence` | Current audit §3; fixture accepts cancellation notification but has no abort registry. | MCP transport + host | Long work cannot be safely aborted. | SDK cancellation, request registry. | Implement cancellation contract and test. |
| `CXL-02` | Stop/revoke/disconnect prevents pending mutation commit. | `🌗` | `not-verified` | Current audit §3; revoke contract exists, server lifecycle absent. | Host lifecycle + MCP session | Safety invariant lacks runtime evidence. | Server supervisor, transport. | Add stop/revoke race test on real adapter. |

## Security boundary

| ID | Capability / user outcome | Status | Evidence state | Evidence | Owner | Gap / risk | Dependency | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `SEC-01` | Keep endpoint disabled until explicitly enabled. | `🌗` | `partial-local` | Current audit §3; `McpSecurityPolicy.enabled=false`. | Flutter host + security contract | No host control applies the policy. | Server supervisor, UI. | Wire enable state to server lifecycle. |
| `SEC-02` | Allow only local loopback clients. | `🌗` | `partial-local` | Current audit §3; policy and fixture enforce `127.0.0.1`. | Transport/security owner | Production transport enforcement absent. | Adapter, HTTP security. | Add production loopback and origin tests. |
| `SEC-03` | Issue opaque per-session tokens with expiry/revoke and no persistence. | `🌗` | `partial-local` | Current audit §3; token store and session tests. | MCP session + Flutter host | No server instance authenticates calls. | Server lifecycle, auth middleware. | Own token store from server start/stop. |
| `SEC-04` | Prevent read-only tokens from invoking mutation. | `🌗` | `partial-local` | Current audit §3; token permission validation/tests. | Transport adapter + session store | Per-call protocol scope check absent. | Mutation adapter, auth middleware. | Enforce scope before bridge invocation. |
| `SEC-05` | Restrict reads/writes to the active session document. | `🌗` | `partial-local` | Current audit §3; bridge identity/revision guards. | Flutter bridge + resource resolver | No active-resource/tool route. | Session resolver, adapter. | Add active-only resource and mutation tests. |
| `SEC-06` | Bound edit count, ranges, replacement/source size, and overlap. | `✔️` | `verified-local` | Current audit §3; `DocumentEditBounds`, session tests. | MCP session contract + Flutter bridge | Enforcement is not yet protocol-exercised. | Mutation adapter. | Preserve bounds through wire schema and test. |
| `SEC-07` | Keep direct apply away from filesystem, Save, export, and autosave. | `🌗` | `partial-local` | Current audit §3; policy/bridge/file-service separation. | Flutter file host + MCP adapter | No real adapter proves negative path. | Mutation adapter, integration tests. | Add protocol-level no-filesystem side-effect test. |
| `SEC-08` | Show operational status without leaking secrets and allow Stop. | `❌` | `verified-absence` | Current audit §3; Plan 11 UI requirement, no surface found. | Flutter MCP settings UI | User cannot inspect/stop MCP safely. | Server supervisor, secure status model. | Implement secret-safe status panel. |

## Delivery and release evidence

| ID | Capability / user outcome | Status | Evidence state | Evidence | Owner | Gap / risk | Dependency | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `DEL-01` | Run standalone package/executable when standalone need is approved. | `⏸️` | `verified-scope` | Current audit §3; private package and Plan 11 roadmap. | MCP/package owner | Entrypoint intentionally deferred; no claim of delivery. | SDK/transport gate, standalone decision. | Revisit after standalone consumer decision. |
| `DEL-02` | Use embedded desktop MCP without Node/npm/runtime two. | `🌗` | `partial-local` | Current audit §3; Flutter path dependency, no Node dependency. | Flutter packaging + MCP | Embedded server itself is absent. | Server adapter, desktop lifecycle. | Add embedded runtime smoke gate. |
| `DEL-03` | Maintain fixture/error/metadata/bind/Inspector conformance evidence. | `🌗` | `not-verified` | Current audit §3; CI/runbook configured, no live adapter/Inspector run. | MCP CI/delivery owner | Configured gate is not a passing delivery proof. | SDK adapter, writable runner. | Execute all six runbook checks and record run. |
| `DEL-04` | Ship desktop artifacts with separate MCP runtime smoke evidence. | `🌗` | `partial-local` | Current audit §3; root desktop artifact CI, no MCP smoke. | Flutter delivery + workspace | Artifact build does not prove MCP usability. | Embedded server, runtime hosts. | Add desktop MCP smoke to delivery gate. |
| `DEL-05` | Trace release candidate to package/spec/SDK/OS/run/date revisions. | `🌗` | `partial-local` | Current audit §3; DTO/root baseline provenance, no MCP artifact record. | Workspace release owner | Revision evidence is incomplete for MCP delivery. | Adapter lock, release artifact. | Add MCP release provenance record. |
| `DEL-06` | Configure endpoint/token and understand permissions/offline/remote limits. | `🌗` | `partial-local` | Current audit §3; README and docs/mcp runbooks only. | MCP docs + Flutter UI owner | Real-server operational setup and UI absent. | Server lifecycle, endpoint/token model. | Document and smoke-test real setup flow. |

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
