# RelGeo MCP — Prioritized Implementation-Gap Backlog

**Status:** current candidate backlog for unresolved rows, synchronized to the 2026-10-31 MCP matrix; completed boundaries are removed from the active ID assignment.

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

- `P0` completes remaining semantic read tools, validation mappings, diagnostics, and resource gaps.
- `P1` completes remaining host status, review/result semantics, cancellation, and composed authoring workflow.
- `P2` proves delivery on target hosts and records release/runtime evidence.
- The `Expected IDs` column assigns each active gap row one primary candidate
  task. A task may have a dependency on another task, but dependency is not
  evidence that the dependent capability is already implemented.
- `🌗` means partial, `❌` means absent, and `⚠️` means a confirmed defect.
  Evidence state remains separate; for example, `DEL-03` remains `🌗` with `not-verified` live-client evidence; this is not proof of a target failure.

## Candidate implementation tasks

| Priority | Candidate task | Scope / intended outcome | Expected IDs | Owner | Dependency | Verification expectation |
| --- | --- | --- | --- | --- | --- | --- |
| P0 | `MCP-T01` Complete remaining version/schema edges | Keep bounded completion/render schemas and version-specific behavior aligned with the current catalog. | `COMP-01`, `RENDER-01` | MCP contract and adapter | Current contract baseline; core/renderer integration remains separate. | Focused schema-to-contract checks cover bounds, unsupported inputs, and no unintended domain dispatch. |
| P0 | `MCP-T02` Implement remaining read-only executors | Add bounded examples retrieval, structural validation, and structured diagnostics through owner APIs. | `EX-01`, `VAL-01`, `DIAG-01` | MCP plus examples/core/language-service owners | Stable owner APIs and version policy. | Tools return bounded owner-backed results with provenance and no document mutation. |
| P0 | `MCP-T03` Connect semantic validation, diagnostics, rendering, and provenance | Run parse → resolve → validate and renderer paths, map failures to diagnostics, and preserve versioned provenance across integrated consumers. | `VAL-02`, `VAL-03`, `DIAG-02`, `RENDER-03`, `PROV-01` | MCP adapter plus `core`, `language-service`, `renderer-svg`, and `spec/id` | `MCP-T02`; canonical fixtures and revision identity. | Shared fixtures prove valid/invalid source, deterministic verdicts where cross-host evidence is available, diagnostic explanation, render failure mapping, and provenance fields. |
| P0 | `MCP-T04` Complete remaining diagnostics resources and cache policy | Add versioned diagnostic resources and explicit cache/fallback identity; retain the already-working bundled full-spec snapshot and active-document resources. | `RES-02`, `RES-04` | MCP resource layer plus spec/docs owners | Diagnostic catalog source and cache policy decision. | Diagnostic resources resolve with provenance; any cache fallback is revision/TTL bounded. |
| P0 | `MCP-T05` Complete standalone and external-client conformance | Retain the embedded HTTP server; decide standalone stdio delivery and verify a current MCP client/Inspector against the supported protocol versions. | `TRAN-03`, `TRAN-06`, `DEL-03` | MCP adapter and transport owner | Standalone decision for stdio; permitted host for live Inspector/client smoke. | Fixture and desktop HTTP tests stay green; standalone/client protocol behavior is directly exercised and recorded. |
| P1 | `MCP-T06` Complete operational status and permission UX | Add or explicitly defer connected-client status and finish user-facing review of permission, endpoint, token, Stop, and secret display. | `HOST-03`, `SEC-08`, `DEL-06` | Flutter host plus MCP security/docs owners | Existing opt-in dialog/server; product decision on connected-client visibility. | Desktop dialog accurately reports running state, permission, endpoint, and safe token/config actions; user setup flow is smoke-tested. |
| P1 | `MCP-T07` Complete edit review and result-state guarantees | Preserve current guarded edit tool and add remaining review/failed-state behavior plus persistence-boundary regression evidence. | `EDIT-01`, `EDIT-05`, `ERR-03`, `ERR-04` | Flutter bridge/editor plus MCP adapter | Current read-write opt-in, identity/revision guards, and undo transaction. | Protocol tests cover review intent, applied/stale/rejected/failed outcomes and atomic failure; no Save/export/autosave side effect. |
| P1 | `MCP-T08` Add cancellation and disconnect-safe transactions | Abort pending work and prevent a stopped, revoked, or disconnected request from committing a mutation or reporting a false success. | `CXL-01`, `CXL-02` | MCP transport plus Flutter bridge/session | Current server stop hooks; request registry and cancellation semantics. | Cancellation, stop/revoke, disconnect, and race tests show no stale result or edit commit after abort. |
| P1 | `MCP-T09` Compose bounded authoring/debug workflow | Compose discovery → example → completion → validation → explanation → render, and attach the rule/example/source chain to proposals without moving normative rules into prompts. | `EX-02`, `WF-01`, `PROV-03` | MCP workflow owner plus integrated consumers | `MCP-T02`, `MCP-T03`, `MCP-T04`; stable read-only tools/resources. | End-to-end workflow fixtures select bounded valid examples, preserve `basedOn[]`, validate proposals, render without file writes, and exercise failure paths. |
| P1 | `MCP-T10` Complete cross-consumer proposal and error mappings | Preserve completion proposal semantics, source kind, sheet/view selection, shared document/service/core/renderer context, and domain error fields across the adapter boundary. | `COMP-02`, `DIAG-03`, `RENDER-02`, `HOST-05`, `ERR-02` | MCP adapter plus `language-service`, `core`, `renderer-svg`, and Flutter owners | `MCP-T02`, `MCP-T03`, `MCP-T07`; stable schemas. | Representative fixtures preserve ranges, origin, source kind, sheet target, error code/message, and shared context; completion never silently mutates. |
| P2 | `MCP-T11` Produce desktop artifact and runtime smoke evidence | Add MCP-specific smoke coverage to desktop delivery and record artifact, package, SDK, OS, architecture, endpoint, security, clean-stop, and limitation evidence. | `DEL-04`, `DEL-05` | Flutter/workspace delivery owners | `MCP-T05`, `MCP-T06`; target hosts available. | macOS/Linux/Windows or explicitly scoped target runs prove embedded startup, read-only call, security boundary, stop, and artifact traceability. |

## Coverage proof

The active backlog covers every reconciled row whose implementation status is
not `implemented` or `deferred`. Each row is assigned to exactly one primary
task above; task dependencies do not change that assignment.

| Check | Result | Evidence |
| --- | --- | --- |
| Active source gap rows | `34` | `24 🌗` partial + `10 ❌` absent + `0 ⚠️` broken from the reconciliation and matrix. |
| Active gap rows assigned to a primary task | `34/34` | The 11 task groups above contain each active expected ID exactly once; `ERR-01` is retained as a completed regression gate, not an active gap. |
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
