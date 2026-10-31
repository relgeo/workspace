# RelGeo MCP — bounded in-scope capability selection

**Date:** 2026-10-30 (selection baseline)
**Task:** `select-and-bound-in-scope-capability-debt--1184640051`
**Status:** bounded active selection; this record is not implementation or
completion evidence
**Owner boundary:** `relgeo_mcp` owns the typed MCP contract, adapter
dispatch, resource URI boundary, and transport-facing error mapping. `spec/`,
`core/`, `language-service/`, `renderer-svg/`, and Flutter remain semantic or
host owners where explicitly named below.

## Current implementation overlay — 2026-10-31

This 20-row selection is a dated work-selection record, not the current
implementation ledger. Full-spec lookup, version checks, loopback HTTP, active
document reads, app lifecycle, permission-gated edits, and related security
rows have since been implemented at the boundaries shown in the current
[status matrix](./status-matrix.md). Their acceptance evidence is recorded in
the current [implementation audit](./implementation-audit.md). The selection
below is retained to show what was chosen; use the matrix for current status.

## Decision

This tranche selects 20 actionable capability rows from the complete expected
catalog, the implementation audit, the reconciliation/status view, and the
implementation-gap backlog. It is bounded to a local, no-release-dependency
foundation slice:

1. repair the typed schema and invalid-argument boundary;
2. expose the seven read-only tools through a real typed dispatch boundary;
3. resolve canonical spec/example/diagnostic resources from a versioned
   offline store;
4. exercise the protocol through local stdio and enforce remote-bind
   rejection; and
5. connect only the session, active-document, lifecycle, and per-call scope
   controls needed to make that foundation safe in a desktop host.

The selection does not require pub.dev publication, npm publication, remote
deployment, a new standalone executable decision, or desktop artifact
release. A local transport adapter may be tested without promoting
`DEL-01` to active work. No selected row is promoted to `✔️` by this record.

## Evidence and selection inputs

| Input | Role in this selection |
| --- | --- |
| [Expected capability catalog](./expected-capability-catalog.md) | Stable expected IDs, owners, requirement anchors, and contract boundaries. |
| [Implementation audit entry point](./implementation-audit.md) and [archived evidence log](./archive/implementation-audit-legacy.md) | Observed source/test paths, partial boundaries, confirmed defect, and environment limits. |
| [Reconciliation](./reconciliation.md) and [status matrix](./status-matrix.md) | Current honest implementation symbol, evidence state, owner, and gap. |
| [Implementation-gap backlog](./implementation-gap-backlog.md) | Candidate task IDs, dependencies, owners, and verification expectations. |
| [`mcp/`](../../../mcp) | Pure-Dart contract/session source, protocol fixture, and focused tests that define the implementation boundary. |
| [Plan 11](../../plans/11-mcp-agent-integration.md) | Standalone versus desktop-connected modes, read-only MVP, host boundary, security rules, and delivery constraints. |

## Bounded active selection

Each selected row has one expected ID, an audited status symbol, an owner, a
source-of-truth path, an observed implementation/test path, a contract
boundary, and explicit acceptance behavior. Dependencies are sequencing
constraints, not additional scope.

| Selected backlog task / expected ID | Status at selection baseline (2026-10-30) | Owner | Source of truth | Observed implementation / test paths | Contract boundary | Explicit acceptance behavior |
| --- | --- | --- | --- | --- | --- | --- |
| `MCP-T01` — `ERR-01` typed input/bounds/URI errors | `✔️` | `relgeo_mcp` contract + adapter | [`expected-capability-catalog.md`](./expected-capability-catalog.md) `ERR-01`; [`reconciliation.md`](./reconciliation.md) `ERR-01`; backlog `MCP-T01` | [`mcp_schema.dart`](../../../mcp/lib/src/contract/mcp_schema.dart); [`local_dispatch.dart`](../../../mcp/lib/src/adapter/local_dispatch.dart); [`mcp_schema_test.dart`](../../../mcp/test/mcp_schema_test.dart); [`local_dispatch_test.dart`](../../../mcp/test/local_dispatch_test.dart); [current audit](./implementation-audit.md) §4 | Protocol validation owns schema, required fields, enum/range bounds, unknown tool, and invalid canonical URI handling before domain dispatch. | Repaired schemas and typed dispatcher reject malformed, missing, out-of-bounds, unknown-tool, and invalid-URI calls without process crash or domain invocation; the full local MCP test suite passes. |
| `MCP-T01` — `DISC-02` version-aware discovery | `🌗` | `relgeo_mcp` adapter + `spec/id` | Catalog `DISC-02`; reconciliation `DISC-02`; backlog `MCP-T01` | `FindSyntaxInput`, `GetSyntaxRuleInput`, and `GetExamplesInput` in [`mcp_schema.dart`](../../../mcp/lib/src/contract/mcp_schema.dart); schema tests | The requested `specVersion` is an identity/filter at the adapter boundary; normative content remains owned by `spec/id`. | A mismatched or unsupported version is rejected deterministically, and a successful result carries only the requested version in its provenance. |
| `MCP-T02` — `TRAN-01` MCP initialization/lifecycle | `🌗` | `relgeo_mcp` protocol adapter | Catalog `TRAN-01`; reconciliation `TRAN-01`; backlog `MCP-T02` | [`local_dispatch.dart`](../../../mcp/lib/src/adapter/local_dispatch.dart); [`local_dispatch_test.dart`](../../../mcp/test/local_dispatch_test.dart); fixture conformance files | Adapter owns initialize/initialized sequencing and negotiated capabilities; DTO/tool semantics remain transport-independent. | A local client completes the pinned initialize sequence, receives the declared capabilities, and rejects calls made before initialization with a protocol error; focused package tests remain pending dependency availability. |
| `MCP-T02` — `TRAN-02` tool/resource discovery calls | `🌗` | `relgeo_mcp` adapter | Catalog `TRAN-02`; reconciliation `TRAN-02`; backlog `MCP-T02` | [`local_dispatch.dart`](../../../mcp/lib/src/adapter/local_dispatch.dart); [`local_dispatch_test.dart`](../../../mcp/test/local_dispatch_test.dart); seven typed contracts in [`mcp_schema.dart`](../../../mcp/lib/src/contract/mcp_schema.dart) | MCP wire discovery maps exactly to the approved typed tool/resource catalog; semantic owner callbacks remain explicit injection points. | `tools/list` exposes the seven read-only RelGeo tools and `resources/list` exposes only canonical templates; `tools/call` and `resources/read` dispatch through typed validation. |
| `MCP-T02` — `DISC-01` intent-to-syntax discovery | `🌗` | `relgeo_mcp` orchestration + `spec/id` | Catalog `DISC-01`; reconciliation `DISC-01`; backlog `MCP-T02` | [`FindSyntaxInput`/`FindSyntaxResult`](../../../mcp/lib/src/contract/mcp_schema.dart); no executor found in audit | Adapter owns bounded query/result orchestration; `spec/id` owns rule meaning and revision. | A bounded query returns zero or more ranked `SyntaxMatch` values with stable rule IDs, max-result enforcement, requested version, and provenance; no full-spec dump or filesystem lookup occurs. |
| `MCP-T02` — `REF-02` directed syntax-rule tool | `🌗` | `relgeo_mcp` adapter + `spec/id` | Catalog `REF-02`; reconciliation `REF-02`; backlog `MCP-T02` | [`GetSyntaxRuleInput`/`SyntaxRuleResult`](../../../mcp/lib/src/contract/mcp_schema.dart); no executor found in audit | One `ruleId` resolves to normative documentation for one pinned version; website/explanation content cannot replace the spec result. | A valid rule ID returns `DocumentationResult` with normative provenance; an unknown or wrong-version rule returns a typed not-found/version error. |
| `MCP-T02` — `EX-01` example index/retrieval | `🌗` | `relgeo_mcp` adapter + versioned examples owner | Catalog `EX-01`; reconciliation `EX-01`; backlog `MCP-T02` | [`GetExamplesInput`/`ExamplesResult`](../../../mcp/lib/src/contract/mcp_schema.dart); no examples resolver found in audit | Examples are explanatory, version-tagged, bounded, and distinct from normative spec resources. | Query and ID retrieval return only bounded `ExampleResult` values with example provenance; unknown IDs and unsupported versions fail explicitly. |
| `MCP-T02` — `VAL-01` structural/schema validation | `🌗` | `relgeo_mcp` adapter + `core` | Catalog `VAL-01`; reconciliation `VAL-01`; backlog `MCP-T02` | [`ValidateSourceInput`/`ValidationResult`](../../../mcp/lib/src/contract/mcp_schema.dart); core parse/validation source cited by audit | Adapter preserves source, `sourceKind`, version, and diagnostics while `core` remains the semantic owner. | A valid and invalid source both produce structured `ValidationResult`; invalid input is not reported as success, and proposals are never promoted to `activeDocument`. |
| `MCP-T02` — `DIAG-01` structured diagnostics | `🌗` | `relgeo_mcp` adapter + `core`/`language-service` | Catalog `DIAG-01`; reconciliation `DIAG-01`; backlog `MCP-T02` | [`RelGeoDiagnostic`](../../../mcp/lib/src/contract/mcp_schema.dart); `DocumentDiagnostic` in [`session_bridge.dart`](../../../mcp/lib/src/contract/session_bridge.dart); no adapter mapping found in audit | Diagnostic code, severity, message, optional range, origin, and provenance survive the adapter; free-form text is not the contract. | Representative parser and language-service diagnostics round-trip with code, severity, range/nullability, origin, and provenance intact. |
| `MCP-T04` — `REF-01` canonical spec resource | `🌗` | `relgeo_mcp` resource layer + `spec/id` | Catalog `REF-01`; reconciliation `REF-01`; backlog `MCP-T04` | [`RelGeoResourceUri`](../../../mcp/lib/src/contract/mcp_schema.dart); URI parser tests in [`mcp_schema_test.dart`](../../../mcp/test/mcp_schema_test.dart) | Resource URI parsing is separate from resource content resolution; spec content is pinned to the normative snapshot. | `relgeo://spec/index` and `relgeo://spec/rules/{ruleId}` list/read offline with revision/provenance; path-like, query-bearing, and unknown URIs are rejected before lookup. |
| `MCP-T04` — `RES-01` canonical resource list/read | `🌗` | `relgeo_mcp` resource layer | Catalog `RES-01`; reconciliation `RES-01`; backlog `MCP-T04` | [`RelGeoMcpResourceStore`](../../../mcp/lib/src/adapter/local_dispatch.dart); [`relGeoMvpResourceUris`](../../../mcp/lib/src/contract/mcp_schema.dart); [`local_dispatch_test.dart`](../../../mcp/test/local_dispatch_test.dart) | Only the seven declared URI forms are valid; a URI is never converted into an arbitrary filesystem path. | `resources/list` and `resources/read` agree on the canonical templates and return typed resource contents or typed not-found/session errors without filesystem traversal; static snapshot packaging remains separate. |
| `MCP-T04` — `RES-02` diagnostics catalog resource | `❌` | `relgeo_mcp` resource layer + `spec/id` error model | Catalog `RES-02`; reconciliation `RES-02`; backlog `MCP-T04` | `relgeo://diagnostics/catalog` declaration in [`mcp_schema.dart`](../../../mcp/lib/src/contract/mcp_schema.dart); no catalog/resolver found in audit | Diagnostic explanations consume a versioned catalog; the catalog cannot change the diagnostic code or severity emitted by `core`. | The canonical resource returns a versioned code/meaning catalog offline, and an unknown diagnostic code is reported as not found rather than fabricated. |
| `MCP-T04` — `RES-03` versioned bundled snapshot | `❌` | `relgeo_mcp` packaging + `spec/id` and examples owners | Catalog `RES-03`; reconciliation `RES-03`; backlog `MCP-T04` | [`mcp/pubspec.yaml`](../../../mcp/pubspec.yaml); [`mcp/README.md`](../../../mcp/README.md); audit package/resource findings | Snapshot packaging is local and version-pinned; remote fetch is optional and never a prerequisite for the syntax assistant. | A clean offline run serves the pinned spec, examples, and diagnostic resources with revision identity and fails clearly if a requested snapshot is unavailable. |
| `MCP-T05` — `TRAN-03` local stdio transport | `🌗` | `relgeo_mcp` transport adapter | Catalog `TRAN-03`; reconciliation `TRAN-03`; backlog `MCP-T05` | [`run_transport_conformance.dart`](../../../mcp/tool/run_transport_conformance.dart); [`mcp_fixture_server.dart`](../../../mcp/tool/mcp_fixture_server.dart); audit transport finding | Stdio owns framing and stdout/stderr separation; it does not decide domain semantics or standalone product packaging. | A local child-process harness carries initialize, list, call, and read messages with protocol-only stdout and diagnostics on stderr; this does not claim `DEL-01` executable readiness. |
| `MCP-T05` — `TRAN-05` remote transport rejection | `🌗` | `relgeo_mcp` transport + `McpSecurityPolicy` | Catalog `TRAN-05`; reconciliation `TRAN-05`; backlog `MCP-T05` | [`McpSecurityPolicy`](../../../mcp/lib/src/contract/session_bridge.dart); loopback bind code in [`run_transport_conformance.dart`](../../../mcp/tool/run_transport_conformance.dart) | Bind/origin validation is a transport security boundary; remote deployment and authentication remain outside this tranche. | Requests to bind or advertise a non-loopback endpoint are rejected before serving; the rejection is observable as a typed configuration/protocol error. |
| `MCP-T06` — `DOC-02` active-document resource | `🌗` | Flutter session/bridge + `relgeo_mcp` resource adapter | Catalog `DOC-02`; reconciliation `DOC-02`; backlog `MCP-T07` | `ActiveDocumentSnapshot` and `RelGeoAgentBridge` in [`session_bridge.dart`](../../../mcp/lib/src/contract/session_bridge.dart); `RelGeoMcpResourceStore` in [`local_dispatch.dart`](../../../mcp/lib/src/adapter/local_dispatch.dart); focused resource tests; host lifecycle/auth route remains absent | Only the current connected session may resolve `relgeo://document/active` and its diagnostics; no document enumeration or arbitrary path access. | With an authenticated connected session, active source/identity/revision/dirty/diagnostics are returned; without a session or after revocation, the resource fails explicitly and exposes no fallback document. |
| `MCP-T06` — `DOC-05` session start/stop/revocation | `🌗` | Flutter host lifecycle + `McpSessionTokenStore` | Catalog `DOC-05`; reconciliation `DOC-05`; backlog `MCP-T06` | [`McpSessionTokenStore`](../../../mcp/lib/src/contract/session_bridge.dart); [`session_bridge_test.dart`](../../../mcp/test/session_bridge_test.dart); audit host-lifecycle finding | One local server instance owns its token/session lifetime; stop revokes access and does not persist token values. | Start creates a scoped session, stop/revoke makes all subsequent resource/tool calls fail, expired tokens are rejected, and no token value is emitted in status/log output. |
| `MCP-T06` — `SEC-03` opaque per-session token | `🌗` | `relgeo_mcp` session contract + Flutter host | Catalog `SEC-03`; reconciliation `SEC-03`; backlog `MCP-T06` | [`McpSessionToken`](../../../mcp/lib/src/contract/session_bridge.dart); token tests in [`session_bridge_test.dart`](../../../mcp/test/session_bridge_test.dart) | Tokens are opaque, scoped, expiring, revocable, and checked per session; token issuance is not a document or filesystem concern. | A fresh session receives a non-persisted token with the requested permission; wrong, expired, revoked, or cross-session tokens cannot authorize a call. |
| `MCP-T06` — `SEC-04` read/write scope enforcement | `🌗` | `relgeo_mcp` adapter + `McpSessionTokenStore` | Catalog `SEC-04`; reconciliation `SEC-04`; backlog `MCP-T06` | Permission enum/store in [`session_bridge.dart`](../../../mcp/lib/src/contract/session_bridge.dart); no per-call adapter enforcement found in audit | Authorization is checked before bridge invocation on every call; read-only access cannot reach mutation routes. | A read-only token can call selected read paths but receives forbidden for any write path; a read-write token still remains subject to active-session and revision guards. |
| `MCP-T06` — `HOST-02` embedded server lifecycle | `❌` | Flutter host + `relgeo_mcp` server adapter | Catalog `HOST-02`; reconciliation `HOST-02`; backlog `MCP-T06` | Flutter MCP dependency/bridge paths cited by audit; no server supervisor or start/stop surface found | Flutter owns enable/disable and app lifecycle; MCP remains widget-agnostic and disabled by default. | Server start is explicit, stop is clean and revokes the session, app shutdown leaves no live endpoint, and repeated start/stop does not leak tokens or background calls. |

## Deliberately excluded from active implementation

| Excluded item | Status / reason |
| --- | --- |
| `WF-02` prompt layer | `⏸️` decision-gated. Prompts wait until tools/resources have a stable contract and cannot become a hidden syntax authority. |
| `DEL-01` standalone executable/package readiness | `⏸️` decision-gated. Local stdio adapter evidence above does not decide whether a product executable is required. |
| `➖` Android/iOS delivery, remote HTTP deployment/authentication, arbitrary Flutter command invocation | Explicitly outside the current desktop-connected boundary; these are not expected-row substitutions. |
| `MCP-T03` semantic parse/resolve/render failure mapping, beyond the selected structural validation/diagnostic contract | Candidate backlog work remains visible but is deferred until the selected dispatch/resource boundaries exist. |
| `MCP-T07` mutation/apply/edit review, `MCP-T08` cancellation races, and `MCP-T09` composed workflow | Require the selected session/transport foundation plus additional mutation, request-registry, and workflow decisions; no active implementation task is created here. |
| `MCP-T10` cross-consumer proposal/error mapping and `MCP-T11` desktop artifact/runtime evidence | Deferred to a later integration/delivery tranche; no pub.dev, npm, remote deployment, or release artifact is a prerequisite for this selection. |
| `VAL-03`, `CXL-02`, and `DEL-03` rows shown as `🌗`/`not-verified` in the status matrix | Their partial capability status is preserved, but this tranche does not activate work whose first acceptance step is unavailable cross-host/SDK evidence. They remain backlog candidates, not silently promoted or removed. |

No `➖` or `⏸️` item is treated as active implementation work.

## Status accounting

| Check | Result |
| --- | ---: |
| Selected capability IDs | 20 |
| Selected `✔️` rows | 1 (`ERR-01`) |
| Selected `🌗` rows | 16 (`DISC-01`, `DISC-02`, `REF-01`, `REF-02`, `EX-01`, `VAL-01`, `DIAG-01`, `TRAN-01`, `TRAN-02`, `TRAN-03`, `TRAN-05`, `RES-01`, `DOC-02`, `DOC-05`, `SEC-03`, `SEC-04`) |
| Selected `❌` rows | 3 (`RES-02`, `RES-03`, `HOST-02`) |
| Selected `⚠️` rows | 0 |
| Selected `➖` or `⏸️` rows | 0 |
| Selected IDs with owner, source path, boundary, and acceptance behavior | 20/20 |

The selected set contains 20 rows, with 1 `✔️`, 16 `🌗`, and 3 `❌`. Status
symbols are intake values from the reconciliation/status view; this document
does not promote any capability.

Changing this record or the backlog is not implementation evidence. After the
selected work changes source behavior, rerun the expected catalog → audit →
reconciliation → status matrix → backlog join and preserve
`environment-unavailable`/`not-verified` evidence.
