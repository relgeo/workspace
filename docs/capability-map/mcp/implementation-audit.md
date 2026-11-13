# RelGeo MCP — current implementation and evidence audit

**Audit date:** 2026-11-12

**Compatibility line:** RelGeo DSL `0.5.x`

**Audit role:** current evidence entry point for the 68-row expected catalog
**Freeze/disposition:** [2026-11-12 freeze record](./freeze-2026-11-12.md)
**Status rule:** implementation status and evidence status are separate. A
fixture, contract, documentation statement, or CI definition is not promoted
to end-to-end MCP delivery without a directly matching runtime observation.

> **Current implementation overlay (2026-11-08):** The original audit tables
> below remain historical observations; the addendum in §3.1 is the current
> source for post-full-spec T01–T10 delivery. Local MCP tests now cover bounded
> owner callbacks, provenance/diagnostic/cache identity, workflow, review, and
> cancellation/no-commit boundaries. Flutter bridge/server changes cover
> guarded edits, permission UX, stop, and disconnect hooks. Semantic producer
> composition, packaged MCP smoke, and live external-client/Inspector proof
> remain unverified or unresolved and are not promoted by local fixtures.

## 0. Frozen current-checkout baseline — 2026-11-12

This section is the authoritative audit snapshot for this task. Older dated
paragraphs below are retained as history and must not override these facts.

| Surface | Observed current state | Boundary / honest gap |
| --- | --- | --- |
| Expected catalog | 68 unique IDs across discovery/reference/examples, completion/validation/diagnostics/workflow, rendering, document/edit, resources/provenance, transport, host/bridge, errors/cancellation, security, and delivery | The catalog remains expected capability, not implementation proof. `reconciliation.md` and `status-matrix.md` retain one row per ID. |
| Checkout identity | Workspace `47c8b526dcf67197d0e5546a310b68dafcdf97fc`; MCP `824b46eccabd77da37bb37fa72b1c4a0e019442f`; Flutter `1b894663778af002675e253049c8a793c5cea8b9` | Evidence is local to these checkouts; no public release or remote deployment is inferred. |
| Normative snapshot | `spec/id` contains 35 Markdown files, 27 marked `Status dokumen: \`Normative\``; Flutter manifest contains 35 files, DSL `0.5`, revision `26ff53278d77d916b0e0e6c26ca9ab496232fbc0`, digest `sha256:407bbf...` | Snapshot is pinned and offline. It is not semantic validation, completion, or renderer composition. |
| Pure-Dart MCP package | `mcp/lib/src/contract/`, `adapter/local_dispatch.dart`, and `spec/spec_index.dart` provide typed DTOs, source/provenance guards, lexical full-spec index, canonical resources, owner callbacks, cache/catalog identity, session/security, edit result states, and cancellation registry | Package intentionally does not own `core`, `language-service`, `renderer-svg`, Flutter widgets, filesystem access, or socket transport. |
| Full-spec retrieval | `SpecSectionIndex`, `relgeo_search_spec`, `relgeo_get_spec_section`, compatibility `relgeo_find_syntax`, section resource template, snapshot loader, and Flutter asset wiring are present | Retrieval is bounded lexical search over the pinned snapshot; no claim of semantic authoring or external-client interoperability. |
| Session/document/edit | `ActiveDocumentSnapshot`, monotonic revision guard, bounded non-overlapping patches, review/apply results, cancellation boundary, token scope/expiry/revocation, Flutter bridge, one editor transaction, dirty/no-autosave behavior are present | Stop/disconnect race and packaged-client write round-trip remain unverified; Save/Save As/export stay host-owned. |
| Transport/host | Flutter IO server binds IPv4 loopback, checks Host/Origin, bearer token, protocol metadata, and app lifecycle; package stdio fixture and remote-bind guard exist | Standalone product executable is paused; full HTTP fixture and packaged artifact/client smoke are environment or delivery evidence, not inferred from source presence. |
| Semantic composition | Typed callbacks plus `McpAuthoringPipeline.fromProducers` compose producer validation/completion DTOs, shared identity context, diagnostic fields, proposal provenance, render owners, and lossless domain-error mapping | Direct runtime wiring to `core`/`language-service`/`renderer-svg`, semantic example validity, and packaged execution remain owner/runtime boundaries. |
| Explicit scope holds | `WF-02` and `DEL-01` are `⏸️`; remote deployment, Android/iOS, and arbitrary UI command invocation are `➖` non-goals | These decisions do not delete any expected desktop capability row. |

The joined status retained by the current matrix is `60 ✔️`, `0 🌗`, `0 ❌`,
`0 ⚠️`, `8 ⏸️`, `0 ➖`. The status count is not a substitute for the
row-level evidence below; local pass evidence is limited to the commands in
§5, while missing cross-host/package evidence remains `not-verified` or
`environment-unavailable`.

### Current Plan 14 overlay

| Capability | Current implementation/evidence | Status boundary | Canonicality |
| --- | --- | --- | --- |
| Full snapshot and drift identity | `flutter/assets/relgeo_spec/v0.5/manifest.json`, 35 Markdown files, source revision `26ff532...`, corpus digest `sha256:407bbf...`, and loader/drift tests | Verified locally | Snapshot is in current Flutter child commit; release/runtime smoke is not claimed |
| Search and complete-section retrieval | `SpecSectionIndex`, `relgeo_search_spec`, `relgeo_get_spec_section`, bounded snippets, stable IDs, and resources | Verified locally | Lexical retrieval over the pinned DSL 0.5 snapshot; semantic authoring remains separate |
| Flutter offline host bridge | `RelGeoSpecSnapshotLoader` and `RelGeoMcpDesktopServer.start` load only the bundled AssetBundle | Verified by Flutter tests/analyzer | Supporting local; desktop artifact/CI smoke is not claimed |
| Normativity and provenance | Spec sections carry source/path/anchor/version/revision/digest; examples remain `source: example` and non-normative | Verified by adapter and Flutter tests | Supporting local |
| Retrieval quality scenarios | Indonesian/English intent, ambiguity, no-result, presentation, full-section, and offline fixtures pass | Deterministic local tests pass | Supporting local |
| Inspector/Codex Desktop/loopback HTTP | Local Flutter IO tests exercise loopback HTTP; user has observed ChatGPT Desktop read-only spec/document calls; write round-trip and Inspector compatibility remain unverified | Read-only client behavior user-observed; current write flow not verified | Local integration and user observation, not canonical cross-host evidence |

The historical one-row-per-ID register remains useful for the broader Plan 11
backlog, but it must not overwrite this Plan 14 overlay or claim that local
supporting evidence is canonical CI/public evidence.

The [expected capability catalog](./expected-capability-catalog.md) remains
the expected baseline. The [reconciliation](./reconciliation.md) and
[actionable capability matrix](./capability-matrix.md) contain the one-row-
per-ID result. The prior dated
log is retained as [historical audit evidence](./archive/implementation-audit-legacy.md),
not as proof of current CI, deployment, or runtime state.

The source-level row register is [implementation evidence register](./implementation-evidence-register.md).
It is the audit's per-capability evidence surface: every expected ID has one
explicit status, owner/source of truth, inspected source path (or a recorded
absence), test/fixture evidence, dependency or environment boundary, and next
action. Consumer package tests are retained as observational evidence and are
not promoted to MCP integration proof without a composed adapter path.

## 1. Audit scope and method

The audit inspected the pure-Dart `mcp/` package, its tests and transport
fixtures, the Flutter bridge/session and host lifecycle surfaces, relevant
consumer packages, MCP design/conformance documents, and available CI
configuration. Findings were assigned only where the inspected boundary could
support the claim:

- `✔️` means the audited boundary has direct implementation and sufficient
  evidence for that outcome;
- `🌗` means a contract, fixture, host subset, or consumer exists but the
  expected MCP outcome is not complete;
- `❌` means the in-scope outcome was checked against its owner boundary and
  implementation was not found;
- `⚠️` means a concrete defect or contract mismatch was observed;
- `⏸️` remains a deliberate roadmap/scope hold; it is not active work;
- `➖` is reserved for non-owner scope findings and is not used to remove an
  expected row.

Absence findings below are based on the catalog owner map, source paths,
tests, host boundaries, and the existing reconciliation—not on a single failed
text search. Missing services, dependencies, or permissions are recorded as
`not-verified` or `environment-unavailable`, not as target implementation
failures.

## 2. Snapshot and coverage

| Observation | Result | Evidence |
| --- | --- | --- |
| Workspace root revision at previous audit | `1cfa86553d7adb18179c6b3e1a33618a179b1414` | Historical 2026-10-30 audit snapshot |
| Current workspace root revision | `47c8b526dcf67197d0e5546a310b68dafcdf97fc` | Current checkout identity; worktree is dirty and no clean-baseline claim is made |
| Current MCP checkout | `824b46eccabd77da37bb37fa72b1c4a0e019442f` | Current `mcp/` submodule checkout |
| Current Flutter checkout | `1b894663778af002675e253049c8a793c5cea8b9` | Current `flutter/` submodule checkout |
| Expected catalog → reconciliation | `68/68` | [reconciliation](./reconciliation.md) coverage |
| Expected catalog → capability matrix | `68/68` | [capability matrix](./capability-matrix.md) rows |
| Current capability status | `60 ✔️`, `0 🌗`, `0 ❌`, `0 ⚠️`, `8 ⏸️`, `0 ➖` | Current capability matrix count; evidence state remains separate |
| Residual evidence-bound rows | `VAL-03`, `TRAN-03`, `DEL-03`, `DEL-04`, `DEL-05`, `DEL-06` | No live cross-host, standalone, packaged-runtime, release-provenance, or Inspector proof is promoted |
| Environment-unavailable evidence | Managed runner denied localhost socket bind for the full dependency-free Streamable HTTP fixture; the current Codex App Server managed sandbox also rejects Flutter's `engine.stamp` update before the selected consumer suite starts | This is environment-unavailable evidence, not a target failure; stdio, remote-bind guard, analyzer, pure-Dart tests, and prior supporting Flutter consumer evidence remain bounded to their named boundaries |

The bounded active tranche is recorded in the [MCP in-scope selection](./in-scope-selection.md).
It selects 20 rows; the remaining active backlog rows stay visible and are not
implicitly promoted, removed, or treated as completed.

### 2.1 Required evidence surface inventory — 2026-11-08

The following inventory is the concrete audit boundary for this task. A
directory being present proves only that the source surface was available for
inspection; the finding and evidence-quality columns preserve what was and was
not verified at that boundary.

| Required surface | Observed checkout evidence | Positive finding | Expected-not-found or environment limit | Evidence quality |
| --- | --- | --- | --- | --- |
| `mcp/lib/` | Dart contract/adapter files including `mcp/lib/src/contract/mcp_schema.dart`, `mcp/lib/src/contract/session_bridge.dart`, `mcp/lib/src/adapter/local_dispatch.dart`, and `mcp/lib/src/spec/spec_index.dart` | Typed DTOs, producer diagnostic/completion mappings, bounded dispatcher, full-spec index/resources, session/security and cancellation contracts are present. | Pure-Dart package does not contain the semantic `core`/Language Service/renderer runtimes or socket transport; direct runtime wiring remains separate. | `verified-local` for contract/adapter and producer mapping boundaries. |
| `mcp/test/` | 5 Dart test files including schema, session, local dispatch, spec index, and protocol fixture tests | Contract, retrieval, owner-callback bounds, provenance/cache, workflow, session/edit, and protocol fixture cases are directly inspected. | No external-client/Inspector interoperability or packaged runtime proof. | `verified-local` for listed tests; cross-host `not-verified`. |
| `mcp/tool/` | 4 Dart tools including `protocol_fixture.dart`, `protocol_conformance.dart`, and `run_transport_conformance.dart` | Stdio framing and remote-bind guard are available as executable fixtures. | Full loopback HTTP fixture cannot bind in the managed runner; standalone product executable remains held. | `partial-local`; HTTP `environment-unavailable`, standalone `⏸️`. |
| `flutter/lib/` | 90 Dart files; MCP paths include `mcp_server.dart`, `mcp_server_io.dart`, `workbench_agent_bridge.dart`, and `spec_snapshot_loader.dart` | Embedded loopback host, bearer/session lifecycle, active-document bridge, bounded edit, dirty/undo, and offline snapshot wiring are present. | Packaged-app lifecycle, external-client write round-trip, and connected-client status are not verified. | `verified-local` for selected host boundary; packaged runtime `not-verified`. |
| `flutter/test/` | 88 Dart test files; selected MCP tests include `mcp_server_io_test.dart` and `workbench_agent_bridge_test.dart` | Auth, protocol metadata, origin guard, permission, stale revision, dirty state, undo, bridge, and snapshot tests are present. | Test execution is local consumer evidence, not packaged artifact or ChatGPT Desktop proof. | `verified-local` for selected tests; packaged runtime `not-verified`. |
| `language-service/` | 20 files including `language-service/src/service.ts`, `language-service/src/completions.ts`, and `language-service/src/analysis.ts` | Completion and analysis producer contracts exist; `McpProducerCompletionResult` maps proposal fields and required `basedOn` provenance into MCP. | Direct package-to-package runtime wiring remains outside this Dart checkout. | Consumer source and MCP mapping `verified-local`; runtime composition separate. |
| `core/` | 94 files including `core/src/parser.ts`, `core/src/validator.ts`, `core/src/resolver/`, and `core/src/diagnostics.ts` | Parser, validator, resolver, geometry, and diagnostic owners exist; `McpProducerValidationResult` maps code/range/origin/phase/path/provenance into MCP. | Direct package-to-package runtime wiring remains outside this Dart checkout. | Consumer source and MCP mapping `verified-local`; runtime composition separate. |
| `spec/` | 38 files including `spec/id/` normative chapters and versioned language material | Normative DSL source, semantic guarantees, document model, and error model are available as source of truth. | Snapshot/retrieval does not prove semantic MCP validation, completion, or rendering. | Normative source `verified-local`; runtime use remains separately audited. |
| `fixtures/` | 56 files including `fixtures/manifest.json` and `fixtures/mcp/session-transaction-cases.json` | Shared fixture inventory and MCP session/transaction cases are available for reproducible boundary checks. | Fixtures do not prove external-client interoperability, release packaging, or unavailable host platforms. | `partial-local`; delivery/runtime `not-verified`. |

### 2.2 Audit dimension coverage

The audit also checked the required cross-cutting paths rather than treating
the directory inventory as sufficient:

| Dimension | Concrete inspected boundary | Current finding | Evidence limit |
| --- | --- | --- | --- |
| Transport | `mcp/tool/run_transport_conformance.dart`, `mcp/tool/protocol_fixture.dart`, `flutter/lib/src/mcp/mcp_server_io.dart`, `flutter/test/mcp_server_io_test.dart` | Stdio/remote-bind fixtures and local loopback host checks exist. | Managed-runner socket denial and live Inspector/client interoperability remain `environment-unavailable`/`not-verified`. |
| Sessions | `mcp/lib/src/contract/session_bridge.dart`, `mcp/test/session_bridge_test.dart`, `flutter/lib/src/mcp/mcp_server_io.dart` | Token scope, expiry/revocation, active session, and cancellation boundaries are present. | Packaged disconnect race is not verified. |
| Documents | `flutter/lib/src/ui/workbench_document_session.dart`, `flutter/lib/src/mcp/workbench_agent_bridge.dart`, `flutter/test/workbench_agent_bridge_test.dart` | Active identity, revision, dirty state, diagnostics, and reload/close guards are present. | Manual packaged close/reopen smoke is not verified. |
| Transactions | `flutter/lib/src/ui/workbench_editor_controller.dart`, `mcp/lib/src/contract/session_bridge.dart`, `fixtures/mcp/session-transaction-cases.json` | Bounded patch, stale rejection, one undoable setter, no-op, failure, and no-commit cancellation cases are represented. | Live external-client mutation race is not verified. |
| Security | `flutter/lib/src/mcp/mcp_server_io.dart`, `mcp/lib/src/contract/session_bridge.dart`, `flutter/test/mcp_server_io_test.dart` | Disabled-by-default, loopback/origin, bearer token, permission, active-session, and patch bounds are checked. | Packaged secret-handling and client-count UX are not verified. |
| Failure paths | `mcp/lib/src/adapter/local_dispatch.dart`, `mcp/lib/src/adapter/authoring_pipeline.dart`, `mcp/test/local_dispatch_test.dart`, `mcp/test/authoring_pipeline_test.dart`, `flutter/test/mcp_server_io_test.dart` | Invalid args, owner failure, stale/rejected, cancelled, stopped, no-fake-success, and producer diagnostic field mapping paths are recorded. | Direct live producer runtime wiring remains separate; typed MCP mapping is verified locally. |

## 3. Current implementation boundaries — 2026-11-08

| Boundary | Current implementation and direct evidence | Remaining boundary |
| --- | --- | --- |
| Full normative spec retrieval | MCP `824b46e` indexes the bundled v0.5 Markdown snapshot; `relgeo_search_spec`, `relgeo_get_spec_section`, `relgeo_get_syntax_rule`, and spec resources return bounded results with section provenance. Flutter loads the checked-in 35-file bundle offline. | Search is lexical and limited to the pinned DSL 0.5 corpus. This is not semantic validation, completion, or rendering. |
| Active document read | Desktop router exposes active source/identity/revision/dirty state and diagnostics through the authenticated bridge; Flutter HTTP tests cover tools and resources. | Direct interoperability with current ChatGPT Desktop and packaged release smoke remain unverified. |
| Embedded transport/lifecycle | Flutter owns `RelGeoMcpDesktopServer`, binds ephemeral IPv4 loopback, validates host/origin, authenticates an in-memory eight-hour bearer token, applies a bounded body/router timeout with cancellation before commit, and closes/revokes on stop. Workbench dialog is opt-in and exposes running state, endpoint, permission, temporary token, copy-config, Enable, and Disable. | Connected-client count/status is not exposed. Packaged-app behavior on each OS is not verified. |
| Permission-gated edit | Read-only mode omits/rejects `relgeo_apply_document_edit`; read-write is an explicit dialog choice. The tool applies bounded patches only to the active document with identity/revision checks and one undoable editor transaction. HTTP integration covers denied, stale, applied, dirty, and undo behavior. | A live ChatGPT Desktop edit round-trip and packaged app smoke remain pending. `EDIT-01`, `EDIT-05`, and cancellation/race coverage remain partial. |
| Save/file boundary | Apply changes the in-memory editor; Save, Save As, export, and autosave are separate host actions. | Manual packaged-app persistence/close/reopen smoke remains pending. |
| Tool composition boundary | The pure-Dart dispatcher adapts bounded owner callbacks for examples, completion, validation, diagnostics, explanation, and render; `McpAuthoringPipeline.fromProducers` maps producer diagnostic fields and required completion provenance; local tests compose a six-call read-only workflow without mutation. | Direct `core`/`language-service`/`renderer-svg` runtime wiring, semantic example validity, and packaged execution remain separate boundaries. |
| Release/delivery | Flutter CI `41184291670` and release workflow `41184693233` passed; draft v1.0.1 has macOS universal, Linux x64, and Windows x64 bundles with checksums/provenance. | Draft is unpublished; no MCP-specific packaged runtime/client smoke or live Inspector proof is recorded. Root baseline manifest remains captured 2026-10-09. |

### 3.1 Post-full-spec delivery addendum — 2026-11-03

| Surface | Current evidence | Boundary that remains explicit |
| --- | --- | --- |
| Bounded read-only executors | `RelGeoMcpToolDispatcher` validates inputs, invokes typed owner callbacks, bounds examples/diagnostics/documentation/SVG, preserves source kind and provenance, and maps owner failures to typed errors. | The package does not import or implement the semantic producers. |
| Diagnostic resource/cache | `McpDiagnosticCatalog` serves `relgeo://diagnostics/catalog`; `McpResourceCache` checks version/revision/digest, enforces TTL, evicts expired entries, and exposes bundled/cache/fallback state. | No remote retrieval or silent cross-revision fallback is supported. |
| Workflow fixture | `mcp/test/local_dispatch_test.dart` runs discovery → example → completion → validation → explanation → render and checks provenance. | This is a bounded fixture, not a production orchestration service or prompt runtime. |
| Review/edit outcomes | Review is read-only; result DTOs include review/applied/no-op/stale/rejected/failed/cancelled; Flutter bridge guards revision and editor transaction, rejects closed sessions, and invalidates proposals across reload. | Packaged client rendering and live write interoperability are not verified. |
| Cancellation/stop/disconnect | Router registry and `notifications/cancelled` return `-32800`; Flutter stop cancels pending requests and decoded disconnects cancel request IDs; race fixtures assert no commit. | Cooperative cancellation depends on owner callbacks observing the token; packaged transport race evidence is absent. |

The addendum is the current evidence for the post-full-spec rows. It does not
rewrite the historical absence statements below; the joined current result is
the [capability matrix](./capability-matrix.md) and
[reconciliation](./reconciliation.md).

### 3.2 Targeted implementation delta — 2026-11-05

| Capability | Implementation change and evidence | Current boundary |
| --- | --- | --- |
| `EX-02` minimal example selection | `mcp/lib/src/adapter/local_dispatch.dart` ranks owner examples by query relevance, then source size, title, and ID; `mcp/test/local_dispatch_test.dart` proves relevant minimal examples precede irrelevant/longer results and preserves provenance/bounds. | Local bounded selection is implemented; semantic validity and a production examples catalog remain owner responsibilities. |
| `COMP-01` source completion bounds | Dispatcher rejects owner completion results above the requested `maxResults` and rejects oversized label/insert/documentation payloads. | Adapter boundary is guarded; a live language-service producer is not wired here. |
| `COMP-02` proposal semantics and identity | Dispatcher rejects empty proposal fields and mismatched returned document/request identity while preserving the existing proposal-only JSON shape and no-mutation path. | Proposal semantics are locally guarded; producer handoff/editor integration remains separate. |

### 3.3 Contract/DTO compatibility delta — 2026-11-08

| Boundary | Implementation change and evidence | Current boundary |
| --- | --- | --- |
| Render target identity | `RenderResult.sheetId` is additive. The dispatcher echoes a requested `sheetId` when a legacy owner omits it and rejects a conflicting owner target as `owner-contract`. `mcp/test/local_dispatch_test.dart` covers both paths. | Target identity is protected at the MCP boundary; Core/renderer sheet selection is still an owner integration gap. |
| Proposal provenance | `SourceProposal.validateForRequest` rejects empty required fields, mixed-version provenance, and missing normative basis when requested. `McpProducerCompletionProposal` requires and maps ordered `basedOn[]` provenance; authoring pipeline tests cover producer population. | DTO and producer mapping provenance are safe to hand off; direct language-service runtime wiring remains separate. |
| Shared compatibility fixture | `fixtures/mcp/contract-boundary-cases.json` records render echo/mismatch, proposal version mismatch, and future-version diagnostic expectations. `pnpm run compatibility:check` validates its schema and four unique cases. | Fixture proves the contract boundary only; it does not claim semantic producer composition, remote deployment, or packaged-client interoperability. |
| Cross-surface adapter contract | `McpValidationTarget`, `McpSharedAuthoringContext`, `McpDomainError`, `McpTransportContract`, and redacted `McpServerStatus` preserve validation intent, identity, domain error fields, transport policy, and host status. `mcp/test/mcp_schema_test.dart` covers these boundaries; `fixtures/mcp/cross-surface-contract-cases.json` records the shared cases. | These are typed adapter boundaries; Core/Language Service/renderer execution, external client interoperability, and packaged runtime remain separate evidence. |
| Contextual authoring pipeline | `McpAuthoringPipeline.fromProducers` composes producer validation/completion results with one `McpSharedAuthoringContext`, maps diagnostic fields and completion provenance, rejects source/spec identity drift, and maps producer failures to `McpAuthoringFailure`/`McpDomainError`. `mcp/test/authoring_pipeline_test.dart` covers the producer mapping and lossless domain boundary. | This closes the local MCP producer-mapping boundary; direct runtime wiring and packaged runtime remain separate evidence. |

Evidence command for this delta: `cd mcp && dart --suppress-analytics test`
(48 tests passed); `dart analyze` also reported
no issues in the same checkout.

## 4. Historical contract defect closure evidence (2026-10-30)

The selected `ERR-01` repair is now present in the exported schemas and typed
dispatcher. The earlier observed mismatches were:

- `relgeo_get_examples` has the `anyOf` required-field rule but does not
  advertise the DTO’s `query`, `exampleId`, `specVersion`, or `maxResults`
  properties and bounds;
- `relgeo_complete_source` omits the DTO’s `specVersion` property; and
- `relgeo_render_source` omits the DTO’s `specVersion` property.

The schemas now advertise the DTO fields and bounds, all tool objects reject
unknown properties, and the dispatcher returns typed `-32602`/`-32601` errors
before invoking an owner. The focused regression tests and full MCP package
suite pass locally, so `ERR-01` is now `✔️`/`verified-local` at the contract
and adapter boundary. This remains separate from semantic domain mappings or
production socket/host delivery.

## 5. Current validation and delivery evidence

| Evidence | Result | What it proves / does not prove |
| --- | --- | --- |
| MCP package tests/analyzer | **PASS — 48 Dart tests; analyzer reports no issues** | Schema, spec index/retrieval, bounded owner dispatch, render-target/provenance compatibility, resources/cache, workflow, session/security, cancellation, and edit contracts. Command used the direct Dart SDK binary because the Flutter wrapper attempted a read-only `engine.stamp` update; this does not prove external client or packaged-app behavior. |
| Flutter selected consumer tests | **PASS — 9 tests** | `flutter test test/spec_snapshot_loader_test.dart test/workbench_agent_bridge_test.dart test/mcp_server_io_test.dart` covers offline retrieval, guarded review/apply/failure behavior, bearer auth, protocol metadata, origin guard, permission, stale revision, dirty state, and undo. |
| Snapshot validator | **PASS** | `bash docs/mcp/validate-full-spec-baseline.sh` checks the current 35-file/27-normative inventory, retrieval tools, section resource template, and bundled manifest. |
| Stdio/remote-bind fixture | **PASS** | `dart run tool/run_transport_conformance.dart --stdio-only` passes stdio and remote-bind guard. |
| Full Streamable HTTP fixture | **INCONCLUSIVE / environment unavailable** | The same harness passes stdio and remote-bind, then cannot create `127.0.0.1:0` because the managed runner denies socket bind; this is not a target implementation failure. |
| Release workflow `41184693233` | **PASS; draft v1.0.1** | Three desktop archives and SHA-256 checksums verified; draft is not published and runtime usability is not established. |
| ChatGPT Desktop live mutation | **Not verified** | Read-only MCP/spec and document calls have prior user-observed success; the new edit-permission path still needs an explicit end-to-end smoke. |
| Root integration baseline | **Stale** | `docs/integration-baseline.json` still records 2026-10-09 child revisions and does not claim current full-workspace CI. |

## 6. Capability conclusions and handoff

1. Full-spec retrieval, active-document reads, the embedded desktop loopback
   server, and explicitly authorized bounded edits are now implemented and
   locally tested at their declared boundaries.
2. These changes do not provide direct producer-owned semantic parse/resolve implementation,
   renderer composition, semantic example validity, or a production authoring
   orchestrator. Producer completion/diagnostic field mapping and provenance
   are implemented and tested at the local MCP adapter boundary; direct runtime
   wiring remains separately bounded.
3. The current joined status is `60 ✔️`, `0 🌗`, `0 ❌`, `0 ⚠️`, and `8 ⏸️`.
   The expected catalog remains 68 rows; no expected capability was deleted.
4. `VAL-03`, `TRAN-03`, and `DEL-03`–`DEL-06` retain explicit
   `environment-unavailable/deferred` evidence. Client-level write
   interoperability, packaged-app MCP smoke, and current root baseline
   synchronization remain open.
5. Follow-up implementation work is defined by the current
   [capability matrix](./capability-matrix.md), [reconciliation](./reconciliation.md),
   and [gap backlog](./implementation-gap-backlog.md). Expected capabilities
   remain unchanged in the catalog.
