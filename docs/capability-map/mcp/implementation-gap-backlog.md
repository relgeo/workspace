# RelGeo MCP — Prioritized Implementation-Gap Backlog

**Status:** candidate implementation backlog for unresolved rows; `ERR-01` is
retained as a completed regression gate, while no remaining candidate task is
marked complete by this document.

This backlog converts the current MCP reconciliation into scoped candidate
work. It is intentionally downstream of the [expected capability
catalog](./expected-capability-catalog.md), [implementation
audit](./implementation-audit.md), [reconciliation
register](./reconciliation.md), and [actionable capability
matrix](./capability-matrix.md). The audit covers `mcp/` plus integrated
consumers in `spec/id/`, `core/`, `language-service/`, `renderer-svg/`,
`cli/`, and `flutter/`, with requirements traced to
`docs/MATURATION-MASTER-PLAN.md` and `docs/REPOSITORY-MAP.md`.

Documentation, matrices, runbooks, and this backlog are evidence and planning
artifacts. They do not implement a tool, resolver, server, UI, host service,
or consumer integration, and none of them closes a capability gap.

## Prioritization rules

- `P0` establishes the safe contract, read-only execution, resource, and
  transport foundations needed before desktop mutation or workflow work.
- `P1` connects the desktop host, guarded document mutation, cancellation, and
  composed authoring workflow after those foundations exist.
- `P2` proves delivery on target hosts and records release/runtime evidence.
- The `Expected IDs` column assigns each active gap row one primary candidate
  task. A task may have a dependency on another task, but dependency is not
  evidence that the dependent capability is already implemented.
- `🌗` means partial, `❌` means absent, and `⚠️` means a confirmed defect.
  Evidence state remains separate; for example, `TRAN-04` is `🌗` with
  `environment-unavailable` evidence, not a transport failure.

## Candidate implementation tasks

| Priority | Candidate task | Scope / intended outcome | Expected IDs | Owner | Dependency | Verification expectation |
| --- | --- | --- | --- | --- | --- | --- |
| P0 | `MCP-T01` Repair typed schemas and invalid-argument boundary | Correct exported input schemas and enforce bounds/version fields before any client can invoke a real tool. | `ERR-01`, `DISC-02`, `COMP-01`, `RENDER-01` | MCP contract and adapter | None; preserve existing DTO/session contracts. | Schema-to-DTO conformance; invalid schema, missing field, wrong version, and out-of-bounds calls return typed protocol errors without process crash. |
| P0 | `MCP-T02` Implement read-only tool adapter and dispatch | Expose the seven RelGeo read-only tools and invoke `spec/id`, `core`, and `language-service` owners through typed executors. | `TRAN-01`, `TRAN-02`, `DISC-01`, `REF-02`, `EX-01`, `VAL-01`, `DIAG-01` | MCP package plus `spec/id`, `core`, `language-service` owners | `MCP-T01`; stable owner APIs. | `tools/list` exposes the approved catalog; `tools/call` returns bounded discovery, rule, example, completion, validation, and diagnostic results with no filesystem mutation. |
| P0 | `MCP-T03` Connect semantic validation, diagnostics, rendering, and provenance | Run parse → resolve → validate and renderer paths, map failures to diagnostics, and preserve versioned provenance across integrated consumers. | `VAL-02`, `VAL-03`, `DIAG-02`, `RENDER-03`, `PROV-01` | MCP adapter plus `core`, `language-service`, `renderer-svg`, and `spec/id` | `MCP-T02`; canonical fixtures and revision identity. | Shared fixtures prove valid/invalid source, deterministic verdicts where cross-host evidence is available, diagnostic explanation, render failure mapping, and provenance fields; no documentation-only pass is accepted. |
| P0 | `MCP-T04` Implement canonical resource resolver and offline snapshot | Serve canonical spec, example, diagnostic, and document URI resources from a versioned bounded store with explicit cache/fallback policy. | `REF-01`, `RES-01`, `RES-02`, `RES-03`, `RES-04` | MCP resource layer plus `spec/id` and packaging owners | `MCP-T01`; versioned snapshot and network/cache decision. | `resources/list/read` serves allowed URIs offline, rejects unknown/path-like URIs, returns pinned revision/provenance, and exercises TTL/fallback behavior. |
| P0 | `MCP-T05` Complete production transport and conformance gate | Turn the fixture protocol into a RelGeo adapter supporting stdio and loopback Streamable HTTP with metadata, origin, bind, and shutdown policy. | `TRAN-03`, `TRAN-04`, `TRAN-05`, `TRAN-06`, `DEL-03` | MCP adapter and transport owner | `MCP-T01`, `MCP-T02`; writable desktop/CI socket for HTTP evidence. | The same server passes stdio, loopback HTTP, protocol-header, origin, error, remote-bind, clean-stop, and Inspector checks; environment-denied socket bind is recorded as unavailable rather than as a target failure. |
| P1 | `MCP-T06` Embed server and expose lifecycle/status/security controls | Add desktop enable/disable, endpoint, client/permission status, copy-config, stop/revoke, and secret-safe operational surfaces; keep the endpoint disabled by default. | `HOST-02`, `HOST-03`, `DOC-05`, `SEC-01`, `SEC-02`, `SEC-03`, `SEC-04`, `SEC-08`, `DEL-02`, `DEL-06` | Flutter host plus MCP adapter and platform-service owners | `MCP-T05`; host lifecycle and secure configuration model. | Flutter tests cover start/stop/revoke, loopback-only access, scoped expiring tokens, read-only versus mutation permissions, clean app shutdown, secret-free status, and setup/config flow. |
| P1 | `MCP-T07` Connect active resources and guarded mutation | Expose the active document through a session guard and invoke the existing `WorkbenchAgentBridge` only through an explicitly authorized mutation boundary. | `DOC-02`, `EDIT-01`, `EDIT-02`, `EDIT-05`, `ERR-03`, `ERR-04`, `SEC-05`, `SEC-07` | Flutter bridge/editor plus MCP adapter | `MCP-T02`, `MCP-T06`; existing session identity/revision and file-service boundaries. | Protocol fixtures and Flutter integration tests cover review-before-apply, applied/stale/rejected/failed outcomes, active-document identity, atomic failure, and proof that direct apply does not call Save, export, filesystem, or autosave. |
| P1 | `MCP-T08` Add cancellation and disconnect-safe transactions | Abort pending work and prevent a stopped, revoked, or disconnected request from committing a mutation or reporting a false success. | `CXL-01`, `CXL-02` | MCP transport plus Flutter bridge/session | `MCP-T05`, `MCP-T07`; request registry and server stop hooks. | Cancellation, stop/revoke, disconnect, and race tests show no stale result, edit commit, token reuse, or `applied` response after abort. |
| P1 | `MCP-T09` Compose bounded authoring/debug workflow | Compose discovery → example → completion → validation → explanation → render, and attach the rule/example/source chain to proposals without moving normative rules into prompts. | `EX-02`, `WF-01`, `PROV-03` | MCP workflow owner plus integrated consumers | `MCP-T02`, `MCP-T03`, `MCP-T04`; stable read-only tools/resources. | End-to-end workflow fixtures select bounded valid examples, preserve `basedOn[]`, validate proposals, render without file writes, and exercise a failure path at each stage. |
| P1 | `MCP-T10` Complete cross-consumer proposal and error mappings | Preserve completion proposal semantics, source kind, sheet/view selection, shared document/service/core/renderer context, and domain error fields across the adapter boundary. | `COMP-02`, `DIAG-03`, `RENDER-02`, `HOST-05`, `ERR-02` | MCP adapter plus `language-service`, `core`, `renderer-svg`, and Flutter owners | `MCP-T02`, `MCP-T03`, `MCP-T07`; stable schemas. | Representative fixtures preserve ranges, origin, source kind, sheet target, error code/message, and shared context; completion remains a proposal and never silently mutates the document. |
| P2 | `MCP-T11` Produce desktop artifact and runtime smoke evidence | Add MCP-specific smoke coverage to desktop delivery and record artifact, package, SDK, OS, architecture, endpoint, security, clean-stop, and limitation evidence. | `DEL-04`, `DEL-05` | Flutter/workspace delivery owners | `MCP-T05`, `MCP-T06`; target hosts available. | macOS/Linux/Windows or explicitly scoped target runs identify exact revisions and prove embedded startup, read-only call, security boundary, stop, and artifact traceability. |

## Coverage proof

The active backlog covers every reconciled row whose implementation status is
not `implemented` or `deferred`. Each row is assigned to exactly one primary
task above; task dependencies do not change that assignment.

| Check | Result | Evidence |
| --- | --- | --- |
| Active source gap rows | `55` | `41 🌗` partial + `14 ❌` absent + `0 ⚠️` broken from the reconciliation and matrix. |
| Active gap rows assigned to a primary task | `55/55` | The 11 task groups above contain each active expected ID exactly once; `ERR-01` is retained as a completed regression gate, not an active gap. |
| Missing active IDs | `0` | Compare the task ID union with matrix rows whose status is `🌗`, `❌`, or `⚠️`. |
| Duplicate primary assignments | `0` | No active expected ID appears in more than one `Expected IDs` cell. |
| Documentation counted as implementation | `0` | Docs, plans, matrices, runbooks, and this backlog are explicitly evidence/planning only. |
| Deferred rows handled separately | `2` | `WF-02` and `DEL-01` remain roadmap/decision-gated follow-ups and are not silently promoted to active implementation. |

## Decision-gated follow-ups

These rows are retained in the expected catalog and reconciliation, but they do
not become active implementation work until the scope decision is made:

| ID | Current result | Decision needed | Evidence boundary |
| --- | --- | --- | --- |
| `WF-02` | `⏸️` deferred | Approve the author/debug/explain/review prompt contract after tools/resources stabilize. | Plan 11 roadmap; prompt documentation is not a prompt runtime. |
| `DEL-01` | `⏸️` deferred | Decide whether standalone package/executable delivery is required in the current product boundary. | Private package and roadmap evidence; no standalone delivery claim. |

## Preserved foundations and non-gaps

The backlog reuses rather than replaces the evidence-backed foundations:

- pure-Dart MCP DTO and provenance boundaries;
- bounded edit proposals, identity/revision guards, and token value model;
- loopback policy and the Flutter `WorkbenchAgentBridge`;
- separate Flutter file/save services and existing editor undo behavior.

Their presence is not treated as end-to-end MCP delivery. Conversely, the
implemented rows `DOC-01`, `DOC-03`, `DOC-04`, `DOC-06`, `PROV-02`, `HOST-01`,
`HOST-04`, and the other `✔️` rows are not duplicated as gap tasks merely
because a downstream adapter or runtime proof remains to be built; those
remaining boundaries are captured by the partial rows assigned above.
