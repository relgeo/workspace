# RelGeo MCP — Prioritized Implementation-Gap Backlog

**Status:** current candidate backlog for unresolved rows, synchronized to the 2026-11-03 MCP matrix; completed boundaries are removed from the active ID assignment.

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

## Post-full-spec contract freeze (MCP-T01–MCP-T10)

The completed full-spec snapshot/retrieval foundation is the bounded
prerequisite for the next ten tasks. It closes the local `DISC-*`/`REF-*`
retrieval boundary only; it does not promote examples, validation, diagnostics,
rendering, transport, or workflow rows to implemented status. The following
edges are frozen so each task can be implemented independently without moving
normative semantics into the MCP adapter:

| Task | Owner-backed boundary | Frozen input/output edge | Side-effect boundary and exit evidence |
| --- | --- | --- | --- |
| `MCP-T01` | `mcp` contract/dispatcher owns wire schema; `spec/id` owns version meaning. | DSL `0.5` is the supported line; typed bounds, unknown-field rejection, and explicit unsupported-version errors are required for completion/render inputs and results. | No domain dispatch on invalid input. Schema tests must cover bounds and version rejection. |
| `MCP-T02` | Examples, `core`, and `language-service` remain the producers; MCP only adapts their typed results. | Examples, structural validation, and diagnostics retain `sourceKind`, stable fields, and bounded result counts/content. | Read-only calls cannot invoke document mutation. Owner-backed fixtures must prove provenance is preserved. |
| `MCP-T03` | `core` owns parse/resolve/semantic validation; `language-service` owns editor diagnostics; `renderer-svg` owns in-memory projection. | Diagnostics retain phase/code/severity/path/message/range/origin where the producer supplies them; render results retain target and provenance. | Invalid validation/render is a structured failure, never a crash or fabricated SVG, and never writes a file. |
| `MCP-T04` | MCP resource/cache layer owns identity handling; `spec/id` and diagnostic catalog owners own content. | Resource results identify spec version plus revision/digest; fallback identity and TTL are explicit and never mix versions silently. | Remote fetch is optional. Offline snapshot remains authoritative for normative content. |
| `MCP-T05` | Transport adapter owns protocol framing; pure-Dart contract remains SDK-neutral. | Initialize/list/call/read behavior is transport-independent; stdio and loopback HTTP are separate evidence surfaces. | No remote bind. External-client/Inspector evidence is runtime evidence, not a replacement for local contract tests. |
| `MCP-T06` | Flutter owns lifecycle, permission, endpoint, token, and connected-client UX. | Host status and permission state are explicit and safe to display; the MCP package exposes no widget or `BuildContext` dependency. | Disabled/read-only is the default. Token material is not logged or permanently displayed. |
| `MCP-T07` | Flutter bridge/editor owns review and undo; MCP owns bounded proposal/result DTOs. | `input`, `proposal`, and `activeDocument` remain distinct; apply outcomes are `applied`, `stale`, `rejected`, or `failed`. | Apply is an explicit read-write path only, guarded by identity/revision and one undo transaction; no Save/export/autosave. |
| `MCP-T08` | Transport/session and Flutter bridge jointly own cancellation and disconnect safety. | A canceled/stopped request has an explicit outcome and cannot yield a stale success after the abort boundary. | No pending mutation may commit after stop, revoke, disconnect, or cancellation. Race tests are required. |
| `MCP-T09` | Workflow composition belongs to the MCP workflow owner; rules remain in `spec/id` and producer owners. | Discovery → example → completion → validation → explanation → render preserves `basedOn[]` and source identity. | Prompts cannot be the sole rule store; the composed workflow remains bounded and read-only until an explicit edit step. |
| `MCP-T10` | `language-service`, `core`, `renderer-svg`, Flutter bridge, and MCP adapter retain their own fields. | Ranges, origin, source kind, sheet/view target, error code/message, and shared document identity survive the adapter boundary. | Completion/proposals never silently mutate. Cross-consumer fixtures must prove field preservation and error mapping. |

These are contract edges, not completion claims. A task is ready for status
promotion only when its owner-backed implementation and the listed evidence
exist; documentation, a reference test, or the full-spec snapshot alone is
insufficient.

## Delivery overlay after T01–T10

The following overlay records what the current checkout actually closes. A
`local-boundary` state means the pure-Dart adapter/fixture is implemented and
tested; it does not claim that an external semantic producer or packaged MCP
client is available. `open` rows remain assigned below.

| Task | Current state | Evidence boundary | Remaining limitation |
| --- | --- | --- | --- |
| `MCP-T01` | `local-boundary` | Schema/version guards, bounded source/position/format inputs, and typed owner dispatch pass in `mcp/test`. | Completion/render output limits and producer integration remain separate. |
| `MCP-T02` | `local-boundary` | Examples, structural validation, structured diagnostics, and provenance-preserving owner callbacks are covered by dispatcher fixtures. | `EX-02` ranking/minimal-example policy is still open; no semantic core invocation is inferred. |
| `MCP-T03` | `partial` | Typed explanation/render paths, owner-failure mapping, diagnostic bounds, and provenance guards pass locally. | `VAL-02`, `VAL-03`, `DIAG-02`, and `RENDER-03` still need producer composition or cross-host evidence. |
| `MCP-T04` | `local-boundary` | Versioned diagnostic catalog resource and revision/digest/TTL cache identity pass resource tests. | No remote fetch is required; only explicit caller-supplied bundled/fallback content is supported. |
| `MCP-T05` | `partial` | Dependency-free stdio fixture and loopback/remote-bind guards pass. | No standalone RelGeo executable, SDK selection, or Inspector/client smoke is claimed. |
| `MCP-T06` | `partial` | Flutter permission/token/endpoint/Stop behavior is implemented; token is hidden by default. | Connected-client visibility and packaged UX remain open. |
| `MCP-T07` | `partial` | Review-only proposal, guarded result states, stale/rejected/failed handling, and no-save boundary are tested. | Live client state rendering and packaged persistence smoke remain open. |
| `MCP-T08` | `partial` | Request cancellation registry, stop/disconnect hooks, `-32800`, and no-commit race fixtures pass locally. | A real packaged transport race and owners that ignore cancellation are not verified. |
| `MCP-T09` | `partial` | Six-call discovery→example→completion→validation→explanation→render fixture preserves provenance and does not mutate. | No production semantic orchestrator or `basedOn[]` proposal producer is wired. |
| `MCP-T10` | `open` | DTO fields and identity echo are preserved at the adapter boundary. | Shared core/language-service/renderer context and producer error-field mapping remain open. |

## Candidate implementation tasks

| Priority | Candidate task | Scope / intended outcome | Expected IDs | Owner | Dependency | Verification expectation |
| --- | --- | --- | --- | --- | --- | --- |
| P0 | `MCP-T01` Complete remaining version/schema edges | Keep bounded completion/render schemas and version-specific behavior aligned with the current catalog. | `COMP-01`, `RENDER-01` | MCP contract and adapter | Current contract baseline; core/renderer integration remains separate. | Focused schema-to-contract checks cover bounds, unsupported inputs, and no unintended domain dispatch. |
| P0 | `MCP-T02` Implement remaining read-only executors | Add bounded examples retrieval, structural validation, and structured diagnostics through owner APIs. | `—` (closed locally; `EX-02` remains with T09) | MCP plus examples/core/language-service owners | Stable owner APIs and version policy. | Local owner-boundary fixtures pass; semantic producer integration remains explicit. |
| P0 | `MCP-T03` Connect semantic validation, diagnostics, rendering, and provenance | Run parse → resolve → validate and renderer paths, map failures to diagnostics, and preserve versioned provenance across integrated consumers. | `VAL-02`, `VAL-03`, `DIAG-02`, `RENDER-03` | MCP adapter plus `core`, `language-service`, `renderer-svg`, and `spec/id` | `MCP-T02`; canonical fixtures and revision identity. | Shared fixtures must prove producer-backed valid/invalid source, deterministic verdicts where cross-host evidence is available, diagnostic explanation, and render failure mapping. |
| P0 | `MCP-T04` Complete remaining diagnostics resources and cache policy | Add versioned diagnostic resources and explicit cache/fallback identity; retain the already-working bundled full-spec snapshot and active-document resources. | `—` (closed locally; monitor owner content) | MCP resource layer plus spec/docs owners | Diagnostic catalog source and cache policy decision. | Local catalog/cache identity is closed; no remote fallback or producer catalog completeness is claimed. |
| P0 | `MCP-T05` Complete standalone and external-client conformance | Retain the embedded HTTP server; decide standalone stdio delivery and verify a current MCP client/Inspector against the supported protocol versions. | `TRAN-03`, `TRAN-06`, `DEL-03` | MCP adapter and transport owner | Standalone decision for stdio; permitted host for live Inspector/client smoke. | Fixture and desktop HTTP tests stay green; standalone/client protocol behavior is directly exercised and recorded. |
| P1 | `MCP-T06` Complete operational status and permission UX | Add or explicitly defer connected-client status and finish user-facing review of permission, endpoint, token, Stop, and secret display. | `HOST-03`, `SEC-08`, `DEL-06` | Flutter host plus MCP security/docs owners | Existing opt-in dialog/server; product decision on connected-client visibility. | Desktop dialog accurately reports running state, permission, endpoint, and safe token/config actions; user setup flow is smoke-tested. |
| P1 | `MCP-T07` Complete edit review and result-state guarantees | Preserve current guarded edit tool and add remaining review/failed-state behavior plus persistence-boundary regression evidence. | `EDIT-05`, `ERR-03` | Flutter bridge/editor plus MCP adapter | Current read-write opt-in, identity/revision guards, and undo transaction. | Protocol tests cover review intent, applied/stale/rejected/failed outcomes and atomic failure; no Save/export/autosave side effect. |
| P1 | `MCP-T08` Add cancellation and disconnect-safe transactions | Abort pending work and prevent a stopped, revoked, or disconnected request from committing a mutation or reporting a false success. | `CXL-02` | MCP transport plus Flutter bridge/session | Current server stop hooks; request registry and cancellation semantics. | Local cancellation/stop fixtures pass; real server/client disconnect race remains open. |
| P1 | `MCP-T09` Compose bounded authoring/debug workflow | Compose discovery → example → completion → validation → explanation → render, and attach the rule/example/source chain to proposals without moving normative rules into prompts. | `EX-02`, `PROV-03` | MCP workflow owner plus integrated consumers | `MCP-T02`, `MCP-T03`, `MCP-T04`; stable read-only tools/resources. | Fixture is closed; ranked example selection and proposal `basedOn[]` producer remain open. |
| P1 | `MCP-T10` Complete cross-consumer proposal and error mappings | Preserve completion proposal semantics, source kind, sheet/view selection, shared document/service/core/renderer context, and domain error fields across the adapter boundary. | `COMP-02`, `RENDER-02`, `HOST-05`, `ERR-02` | MCP adapter plus `language-service`, `core`, `renderer-svg`, and Flutter owners | `MCP-T02`, `MCP-T03`, `MCP-T07`; stable schemas. | Representative fixtures must preserve ranges, origin, source kind, sheet target, error code/message, and shared context; completion never silently mutates. |
| P2 | `MCP-T11` Produce desktop artifact and runtime smoke evidence | Add MCP-specific smoke coverage to desktop delivery and record artifact, package, SDK, OS, architecture, endpoint, security, clean-stop, and limitation evidence. | `DEL-04`, `DEL-05` | Flutter/workspace delivery owners | `MCP-T05`, `MCP-T06`; target hosts available. | macOS/Linux/Windows or explicitly scoped target runs prove embedded startup, read-only call, security boundary, stop, and artifact traceability. |

## Coverage proof

The active backlog covers every reconciled row whose implementation status is
not `implemented` or `deferred`. Each row is assigned to exactly one primary
task above; task dependencies do not change that assignment.

| Check | Result | Evidence |
| --- | --- | --- |
| Active source gap rows | `23` | `19 🌗` partial + `4 ❌` absent + `0 ⚠️` broken from the reconciliation and matrix. |
| Active gap rows assigned to a primary task | `23/23` | The task groups above contain each active expected ID exactly once; completed T02/T04 boundaries are retained as closed overlays, not active gaps. |
| Missing active IDs | `0` | Compare the task ID union, including T11 delivery rows, with matrix rows whose status is `🌗`, `❌`, or `⚠️`. |
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
