# RelGeo MCP — Prioritized Implementation-Gap Backlog

**Status:** current candidate backlog for unresolved rows, triaged against the 2026-11-05 reconciliation and synchronized status matrix; completed boundaries are removed from the active implementation assignment.

**Triage checkpoint:** 2026-11-05. The register below is the acceptance source
for deciding whether a P0/P1 row is implementation-closable, evidence-only, or
scope-deferred. The status matrix and reconciliation are synchronized at this
checkpoint; historical alignment rows are retained separately and are not
promoted by documentation alone.

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
| `MCP-T02` | `local-boundary` | Examples, structural validation, structured diagnostics, and provenance-preserving owner callbacks are covered by dispatcher fixtures. | `EX-02` deterministic ranking/minimal-source selection is now covered locally; semantic validity and no semantic core invocation are still explicit limitations. |
| `MCP-T03` | `partial` | Typed explanation/render paths, owner-failure mapping, diagnostic bounds, and provenance guards pass locally. | `VAL-02`, `VAL-03`, `DIAG-02`, and `RENDER-03` still need producer composition or cross-host evidence. |
| `MCP-T04` | `local-boundary` | Versioned diagnostic catalog resource and revision/digest/TTL cache identity pass resource tests. | No remote fetch is required; only explicit caller-supplied bundled/fallback content is supported. |
| `MCP-T05` | `partial` | Dependency-free stdio fixture and loopback/remote-bind guards pass. | No standalone RelGeo executable, SDK selection, or Inspector/client smoke is claimed. |
| `MCP-T06` | `partial` | Flutter permission/token/endpoint/Stop behavior is implemented; token is hidden by default. | Connected-client visibility and packaged UX remain open. |
| `MCP-T07` | `partial` | Review-only proposal, guarded result states, stale/rejected/failed handling, and no-save boundary are tested. | Live client state rendering and packaged persistence smoke remain open. |
| `MCP-T08` | `partial` | Request cancellation registry, stop/disconnect hooks, `-32800`, and no-commit race fixtures pass locally. | A real packaged transport race and owners that ignore cancellation are not verified. |
| `MCP-T09` | `partial` | Six-call discovery→example→completion→validation→explanation→render fixture preserves provenance and does not mutate. | No production semantic orchestrator or `basedOn[]` proposal producer is wired. |
| `MCP-T10` | `open` | DTO fields and identity echo are preserved at the adapter boundary. | Shared core/language-service/renderer context and producer error-field mapping remain open. |

## P0/P1 triage register (2026-11-05)

This register is the row-level triage required before implementation starts.
`Initial status` is copied from the synchronized status matrix (`status /
evidence`). `Implementation-closable` means that the owner
can change code or a local adapter and prove the result with a bounded local
acceptance test. `Evidence-only` means the target boundary may already be
implemented or the remaining proof needs an external client, packaged host,
release artifact, or unavailable environment. `Scope-deferred` requires a
product decision and is not an implementation blocker.

### Implementation-closable P0/P1 rows

| Priority | ID | Initial status | Classification / task | Owner | Source of truth | Acceptance test | Initial action |
| --- | --- | --- | --- | --- | --- | --- | --- |
| P0 | `EX-02` | `🌗 / verified-local` | Implementation-closable for remaining owner validity/catalog; local ranking is closed; `MCP-T09` | MCP workflow + examples owner | P11 §4.4–§5; C04 examples contract; DSL minimal-document rules | Given an intent/rule and bounded `maxResults`, return only small valid examples, preserve explanatory provenance, and reject over-limit output. | Keep ranking fixture; connect owner validity and production examples catalog. |
| P0 | `COMP-01` | `🌗 / partial-local` | Implementation-closable; `MCP-T10` | `language-service` + MCP adapter | C04 completion DTO; `language-service/src/completions.ts` and service contract | A bounded source/position request reaches the completion producer and returns ranged, bounded proposals without changing source. | Wire producer callback and range mapping. |
| P0 | `COMP-02` | `🌗 / partial-local` | Implementation-closable; `MCP-T10` | `language-service` + MCP adapter | C04 proposal/source-kind separation; language-service completion types | The wire result labels completion as a proposal, preserves detail/range/origin, and proves no editor setter is called. | Add proposal handoff fixture. |
| P0 | `VAL-02` | `❌ / verified-absence` | Implementation-closable; `MCP-T03` | MCP adapter + `core` | DSL parse → validate → resolve pipeline; `core/src/index.ts`; C04 validation result | Valid and invalid sources exercise the owner pipeline; invalid input returns structured diagnostics and neither promotes nor mutates a proposal. | Connect the typed core pipeline. |
| P0 | `DIAG-02` | `🌗 / partial-local` | Implementation-closable for producer resolver/catalog completion; `MCP-T03` | MCP + `spec/id` diagnostic catalog owner | C04 diagnostic explanation contract; DSL error model; versioned catalog resource | A known diagnostic code resolves to an explanation while retaining code/severity/range/provenance; unknown or wrong-version codes fail typed. | Connect producer catalog codes and retain version guard. |
| P0 | `RENDER-01` | `🌗 / partial-local` | Implementation-closable; `MCP-T03` | MCP adapter + `core` + `renderer-svg` | C04 render contract; `core` resolver; `renderer-svg/src/index.ts` | A valid source/proposal produces bounded in-memory SVG with source/version provenance and no filesystem call. | Connect core-to-renderer executor. |
| P0 | `RENDER-02` | `🌗 / partial-local` | Implementation-closable; `MCP-T10` | MCP adapter + `renderer-svg` | C04 `sheetId`/view target; `spec/id/presentation` | A valid explicit sheet/view target selects only that target; missing or unknown targets return a typed result/error. | Add bounded target selector fixture. |
| P0 | `RENDER-03` | `🌗 / partial-local` | Implementation-closable for producer error mapping; `MCP-T03` | MCP adapter + `core` + `renderer-svg` | C04 render failure mapping; DSL error model; T03 invalid-render gate | Parse/resolve/render failure returns structured error/diagnostics, never a fabricated SVG, crash, or file write. | Add invalid-render mapping fixture once renderer error fields are exposed. |
| P0 | `HOST-05` | `❌ / verified-absence` | Implementation-closable; `MCP-T10` | MCP adapter + language-service/core/renderer owners | P11 §5–§6; C04 provenance/context fields; Flutter bridge context contract | One request carries the same document identity/source context through language service, core, and renderer; mismatched identity is rejected. | Build shared-context composition fixture. |
| P0 | `ERR-02` | `❌ / verified-absence` | Implementation-closable; `MCP-T10` | MCP adapter + `core` + language service | C04 diagnostic/error DTO; DSL error codes/ranges/origin | Producer domain failures serialize code, message, range, phase/origin, and provenance without raw exceptions or field loss. | Add representative core/LS error mappings. |
| P1 | `HOST-03` | `🌗 / partial-local` | Implementation-closable for current status surface; connected-client count remains evidence/scope guarded; `MCP-T06` | Flutter host | P11 §7–§8; S01 permission/session contract; F12 workbench commands | Dialog/server status reports running state, endpoint, permission, and safe config actions; token is redacted by default and Stop revokes access. | Add status/secret regression test; do not invent client telemetry. |
| P1 | `EDIT-05` | `🌗 / partial-local` | Implementation-closable; `MCP-T07` | Flutter bridge/editor + MCP adapter | S01 bounded edit/undo contract; C04 apply result DTO | Wire serialization distinguishes `applied`, `stale`, `rejected`, and `failed`; each negative state leaves the document unchanged. | Add protocol state matrix and atomicity tests. |
| P1 | `PROV-03` | `🌗 / partial-local` | Implementation-closable; `MCP-T09` | MCP workflow + completion/examples owners | C04 `basedOn[]`; P11 workflow sequence; normative/explanatory precedence | A proposal includes the rule/example/source chain and source identity; missing provenance cannot be silently promoted to authoritative guidance. | Populate producer-backed provenance fixture. |
| P1 | `ERR-03` | `🌗 / partial-local` | Implementation-closable; `MCP-T07` | MCP session + Flutter host | S01 session lifecycle; T03 protocol error gate | Caller can distinguish auth, forbidden, no-session, stale, rejected, failed, and stopped outcomes with stable typed codes. | Map session/bridge errors before producer invocation. |
| P1 | `SEC-08` | `🌗 / partial-local` | Implementation-closable for secret-safe visibility; connected-client audit is evidence/scope guarded; `MCP-T06` | Flutter host + MCP security owner | P11 §7–§8; S01 token policy; F12 settings surface | Operational status and permission are visible without exposing token material permanently; Disable/Stop revokes the session and no secret is logged. | Add redaction and stop/revoke UI tests. |
| P1 | `CXL-02` | `🌗 / not-verified` | Implementation-closable locally; packaged race remains evidence-only; `MCP-T08` | MCP transport + Flutter bridge/session | S01 revoke boundary; T03 cancellation gate; transport/session hooks | A pending request stopped/revoked/disconnected before commit returns cancellation/stopped and cannot mutate or report success. | Keep cooperative local race test separate from live-client proof. |

### Evidence-only, alignment-only, or environment-bound rows

These rows remain visible in triage but are not assigned a new code task in
this checkpoint. They require reconciliation, a current client/Inspector,
packaged artifacts, a release run, or a target host. They must remain
`not-verified`/`partial` until that evidence exists.

| Priority / lane | ID | Initial status | Classification | Owner / source of truth | Acceptance evidence / next action |
| --- | --- | --- | --- | --- | --- |
| P0 alignment | `EX-01` | `✔️ / verified-local` | Local owner callback/provenance boundary is aligned; no new implementation task | MCP + examples; C04 examples contract | Retain the bounded owner fixture; semantic catalog quality remains an owner limitation, not a matrix mismatch. |
| P0 alignment | `RES-02` | `✔️ / verified-local` | Versioned diagnostics catalog boundary is aligned; no new implementation task | MCP resource layer + `spec/id`; C04 canonical URI | Keep content, version, revision, digest, and provenance assertions in the resource tests. |
| P0 alignment | `RES-04` | `✔️ / verified-local` | Cache identity/TTL boundary is aligned; no new implementation task | MCP resource/cache layer; T02/T03 cache identity | Keep matching revision/digest, bounded TTL expiry, and explicit bundled/fallback identity tests. |
| P0 alignment | `PROV-01` | `✔️ / verified-local` | Provenance boundary is aligned; no new implementation task | MCP + spec/examples; C04 provenance | Keep source, URL, version, revision, fetchedAt/expiresAt assertions. |
| P0 alignment | `VAL-01`, `DIAG-01`, `DIAG-03` | `✔️ / verified-local` | Owner-boundary fixtures are aligned; no new implementation task | MCP/core/language-service; C04 typed result and source-kind contracts | Preserve structural, diagnostic, source-kind, and identity guards; do not treat them as producer composition. |
| P1 alignment | `WF-01`, `EDIT-01`, `DOC-06`, `ERR-04`, `CXL-01` | `✔️ / verified-local` | Local closure is aligned; no new implementation task | P11 workflow/edit boundaries; S01 session/undo; C04 result errors | Keep local fixtures and retain packaged/client limitations separately. |
| P1 evidence | `VAL-03` | `🌗 / not-verified` | Cross-host evidence, not a local implementation defect | `core` + MCP; DSL deterministic guarantees; T03 | Run the same fixture on each available host/transport; report unavailable hosts as not verified. |
| P1 evidence | `TRAN-03` | `🌗 / partial-local` | Standalone executable/runtime delivery evidence | MCP transport; T02 stdio and T03 conformance | Add/verify the standalone entrypoint only after the standalone decision; keep fixture evidence separate from executable readiness. |
| P1 evidence | `TRAN-06` | `🌗 / partial-local` | SDK selection and conformance evidence | MCP transport; T02/T03 SDK-neutral boundary | Record the pinned adapter/SDK and run the common fixture; no SDK choice is inferred from the contract alone. |
| P1 evidence | `DEL-03` | `🌗 / not-verified` | External client/Inspector evidence | MCP CI/adapter; T03 conformance runbook | Run current-client/Inspector negotiation and record protocol version; local tests do not close this row. |
| P1 evidence | `DEL-04` | `🌗 / not-verified` | Packaged host/runtime evidence | Flutter/workspace delivery; F12 | Launch the MCP-enabled packaged artifact on an available target and record clean start, call, security boundary, and stop. Missing target OS is environment-unavailable. |
| P1 evidence | `DEL-05` | `🌗 / partial-local` | Release provenance assembly | Workspace delivery + MCP/Flutter release metadata | Join MCP commit, bundled spec digest, OS/architecture, run, and checksum into the release candidate manifest. |
| P1 evidence | `DEL-06` | `🌗 / partial-local` | Live setup/client evidence | MCP + Flutter docs; P11 §8; T03 | Keep the setup guide current, then smoke endpoint/token/permission configuration with a compatible client. |

### Scope-deferred rows

| ID | Initial status | Decision needed | Owner / source of truth | Handling |
| --- | --- | --- | --- | --- |
| `WF-02` | `⏸️ / verified-scope` | Approve the author/debug/explain/review prompt contract after tools/resources stabilize. | MCP workflow; P11 roadmap | Keep deferred; prompts cannot become a hidden normative rule store. |
| `DEL-01` | `⏸️ / verified-scope` | Decide whether standalone package/executable delivery is required in the current product boundary. | MCP package/workspace; P11 §3.2/T02 | Keep deferred; do not block desktop-connected implementation work. |

The register deliberately separates implementation from evidence. A missing
client, SDK decision, release run, or host OS is not recorded as a target
implementation failure; it remains a next-action evidence boundary.

## Contract and acceptance lock (2026-11-05)

This lock is the prerequisite for implementation work on the 16
implementation-closable rows above. It records the behavior to preserve at the
MCP boundary; it does not change a public DTO, URI, tool name, or compatibility
line.

### Frozen compatibility and ownership rules

| Rule | Locked behavior | Source of truth / evidence |
| --- | --- | --- |
| Compatibility line | RelGeo DSL remains `0.5.x`; active spec is `0.5`; omitted version defaults to `0.5`; future versions are rejected with `UNSUPPORTED_SPEC_VERSION`. | `docs/compatibility-matrix.json` (`compatibilityLine`, `versionAcceptance`); `spec/id/`; reconciliation header. |
| Normative meaning | `spec/id/` owns syntax, semantic guarantees, version meaning, and error semantics. Examples/website/language-service output cannot override normative rules. | `docs/mcp/04-mvp-tool-resource-contract.md` §1/§3; `docs/capability-map/INVENTORY-PROTOCOL.md`; catalog source-of-truth legend. |
| Adapter boundary | `relgeo_mcp` validates bounds, preserves provenance/source kind, normalizes errors, and delegates semantic work to owner callbacks; it is not a second core/language-service/renderer engine. | `mcp/README.md`; `docs/mcp/04-mvp-tool-resource-contract.md`; reconciliation freshness note. |
| Side effects | Read tools/resources are read-only. Direct edit is explicit read-write, active-session-only, revision-guarded, one-undoable, in-memory only; no Save, export, arbitrary filesystem write, autosave, or remote MCP. | `docs/compatibility-matrix.json` `repositoryBoundaries.mcp`; `docs/mcp/01-session-bridge-security-contract.md`; INVENTORY-PROTOCOL MCP boundary. |
| Transport | Contract remains SDK-neutral. Standalone stdio, loopback HTTP, and Inspector are separate evidence surfaces; no SDK is pinned until the six conformance checks pass. | `mcp/README.md`; `docs/mcp/02-sdk-transport-spike.md`; `docs/mcp/03-sdk-conformance-runbook.md`. |
| Contract change policy | This task makes no public contract change. Any future breaking DTO/tool/URI change requires a compatibility decision record and coordinated move to the next line (for example `0.6.x`). | `docs/compatibility-matrix.json` `policy.bumpPolicy` and `releaseDecision`; INVENTORY-PROTOCOL review checklist. |

### Success, failure/edge, and evidence lock for implementation rows

| ID | Success behavior | Failure / edge behavior | Evidence expected |
| --- | --- | --- | --- |
| `EX-02` | Bounded query returns ranked, minimal valid examples with explanatory provenance and `sourceKind=example`. | `maxResults`/payload bounds reject oversized requests; no match returns an explicit empty result; examples never become normative. | `mcp/test/local_dispatch_test.dart` example-selection fixture plus owner validation/provenance assertions. |
| `COMP-01` | A `source`, position, version, and bound reach the language-service owner and return bounded completion items with ranges. | Invalid position/version or over-limit request returns typed invalid-argument; producer failure is normalized; source is unchanged. | Completion adapter fixture in `mcp/test/local_dispatch_test.dart`; language-service completion test at its owner boundary. |
| `COMP-02` | Completion output is an explicit proposal carrying item detail/range/origin and request identity. | Proposal cannot be interpreted as applied source; no editor setter or active-document mutation occurs; missing proposal fields fail typed. | Proposal/no-mutation assertion in MCP dispatch fixture and bridge negative-path test. |
| `VAL-02` | Valid source completes the owner parse → validate → resolve path and returns a `ValidationResult` with preserved source/version/provenance. | Parse/resolve/semantic failure returns structured diagnostics; wrong version/source kind is rejected; proposal is not promoted or mutated. | Producer-backed validation fixture in `mcp/test/local_dispatch_test.dart` plus core parser/validator/resolver evidence. |
| `DIAG-02` | Known diagnostic code and version return an explanation while preserving code/severity/range/origin/provenance. | Unknown code, wrong version, or missing catalog content returns typed failure; explanation cannot replace the diagnostic code/severity. | Diagnostic catalog/explanation fixture and version-mismatch assertion in `mcp/test/local_dispatch_test.dart`. |
| `RENDER-01` | Valid source/proposal produces bounded in-memory SVG with target and provenance. | Invalid source or owner failure returns structured failure; no SVG is fabricated and no filesystem/output path is used. | Render adapter fixture plus renderer owner result/error mapping; no-write assertion. |
| `RENDER-02` | Explicit `sheetId`/view selects the requested target and echoes it in the result. | Missing/unknown target returns typed error or explicit target absence; another sheet/view is never silently selected. | Sheet/view selector fixture using renderer presentation fixtures. |
| `RENDER-03` | Renderer/core failures become stable MCP diagnostics/error results. | Crash, raw exception, success-with-empty/fake-SVG, or file write is a failure of the acceptance test. | Invalid-render matrix in MCP dispatch tests and renderer error-field mapping evidence. |
| `HOST-05` | The same active/proposal document identity and source context is preserved across MCP → language-service → core → renderer. | Identity/version/context mismatch is rejected before commit or render; no consumer silently substitutes another document. | Cross-consumer composition fixture; identity echo and mismatch assertions across owner callbacks. |
| `ERR-02` | Domain failure serializes stable code, message, range/path where supplied, phase/origin, and provenance. | Raw exception, lost range/code/origin, or a failed operation reported as success fails acceptance. | Representative core and language-service error mapping fixtures with field-by-field assertions. |
| `HOST-03` | Host status exposes running state, endpoint, permission, and safe configuration actions. | Token is redacted by default; Stop/Disable revokes access; connected-client count is not invented outside approved scope. | `flutter/test/mcp_server_io_test.dart` and status/dialog tests; packaged UI remains separate evidence. |
| `EDIT-05` | Apply result serializes `applied`, `stale`, `rejected`, and `failed` distinctly, with the current revision/identity where applicable. | Stale/invalid/owner failure leaves source unchanged and cannot report `applied`; no partial edit or save side effect. | `mcp/test/session_bridge_test.dart`, `mcp/test/local_dispatch_test.dart`, and Flutter bridge integration assertions. |
| `PROV-03` | Proposal carries ordered `basedOn[]` chain for rule/example/source and preserves normative vs explanatory provenance. | Missing or mixed-version provenance is rejected or explicitly incomplete; prompt text cannot become authoritative source. | Workflow fixture assertions for `basedOn[]`, source identity, version, and `isNormative`. |
| `ERR-03` | Caller receives stable distinctions for auth, forbidden, no-session, stale, rejected, failed, and stopped. | Missing/ambiguous mapping or an unauthorized bridge call fails; stopped/revoked calls cannot return a successful mutation. | Session/HTTP error matrix in Flutter MCP server tests plus local dispatch error assertions. |
| `SEC-08` | User sees safe operational state and can disable/stop the server without secret leakage. | Token is not persisted/logged/permanently displayed; status must not expose raw credentials; Stop revokes all session access. | Security policy/session tests and Flutter status/dialog redaction tests; packaged secret handling remains separately marked. |
| `CXL-02` | Cancellation/stop/revoke/disconnect before commit returns cancellation/stopped and prevents mutation. | A stale success, commit after abort boundary, or token reuse after stop fails acceptance; owner callbacks must observe cancellation at commit. | Local cancellation/stop race fixtures in `mcp/test/local_dispatch_test.dart`; packaged external disconnect remains not verified. |

### Evidence-only contract rows

The following selected rows have a locked acceptance boundary but no local
implementation task in this phase. Their evidence must not be upgraded from
`not-verified`/`partial` until the named external condition is met.

| IDs | Locked evidence condition | Failure/edge interpretation | Source of truth |
| --- | --- | --- | --- |
| `EX-01`, `RES-02`, `RES-04`, `PROV-01` | Re-run the expected→audit→reconciliation join and verify the bounded local fixtures at the recorded revision. | Matrix/reconciliation drift is an alignment issue, not permission to invent implementation or silently promote status. | `docs/capability-map/mcp/reconciliation.md`; INVENTORY-PROTOCOL evidence rules. |
| `VAL-03` | Run deterministic fixture on each available host/transport. | Missing host/transport is `not-verified`, not target parity failure. | DSL semantic guarantees; INVENTORY-PROTOCOL local vs CI/canonical separation. |
| `TRAN-03`, `TRAN-06`, `DEL-03` | Pass shared stdio/HTTP/invalid-argument/metadata/remote-bind/Inspector conformance gate and record SDK/version. | No SDK or Inspector evidence means adapter remains SDK-neutral and delivery remains partial. | `docs/mcp/02-sdk-transport-spike.md`; `docs/mcp/03-sdk-conformance-runbook.md`; compatibility matrix Dart package policy. |
| `DEL-04`, `DEL-05`, `DEL-06` | Run packaged-host smoke or assemble release provenance/client setup evidence on an available target. | Missing target OS, release run, or client is environment-unavailable/evidence-pending, not implementation failure. | `docs/compatibility-matrix.json`; F12 delivery sources; INVENTORY-PROTOCOL evidence tiers. |
| `WF-02`, `DEL-01` | Obtain the explicit product/scope decision before adding prompt runtime or standalone executable work. | Decision absent keeps row deferred; it must not block implementation-closable rows. | Reconciliation scope decision; P11 roadmap; compatibility matrix release policy. |

## Candidate implementation tasks

| Priority | Candidate task | Scope / intended outcome | Expected IDs | Owner | Dependency | Verification expectation |
| --- | --- | --- | --- | --- | --- | --- |
| P0 / closed overlay | `MCP-T01` Complete remaining version/schema edges | Bounded schema/version foundation is locally closed; remaining producer integration is assigned below. | `—` (closed locally) | MCP contract and adapter | Current contract baseline | Preserve bounds, unsupported-version, and no-dispatch regression tests. |
| P0 | `MCP-T02` Implement remaining read-only executors | Add bounded examples retrieval, structural validation, and structured diagnostics through owner APIs. | `—` (closed locally; `EX-02` remains with T09) | MCP plus examples/core/language-service owners | Stable owner APIs and version policy. | Local owner-boundary fixtures pass; semantic producer integration remains explicit. |
| P0 | `MCP-T03` Connect semantic validation, diagnostics, rendering, and provenance | Run parse → resolve → validate and renderer paths, map failures to diagnostics, and preserve versioned provenance across integrated consumers. | `VAL-02`, `DIAG-02`, `RENDER-01`, `RENDER-03` | MCP adapter plus `core`, `language-service`, `renderer-svg`, and `spec/id` | `MCP-T02`; canonical fixtures and revision identity. | Shared fixtures prove producer-backed valid/invalid source, diagnostic explanation, and render failure mapping. |
| P0 | `MCP-T04` Complete remaining diagnostics resources and cache policy | Add versioned diagnostic resources and explicit cache/fallback identity; retain the already-working bundled full-spec snapshot and active-document resources. | `—` (closed locally; monitor owner content) | MCP resource layer plus spec/docs owners | Diagnostic catalog source and cache policy decision. | Local catalog/cache identity is closed; no remote fallback or producer catalog completeness is claimed. |
| P1 / evidence | `MCP-T05` Complete standalone and external-client conformance | Retain embedded HTTP server and record standalone/SDK/client evidence only after required decisions. | `TRAN-03`, `TRAN-06`, `DEL-03` | MCP adapter and transport owner | Standalone decision and permitted client/Inspector host | Keep local fixtures green; record external evidence separately from target implementation. |
| P1 | `MCP-T06` Complete operational status and permission UX | Add or explicitly defer connected-client status and finish user-facing review of permission, endpoint, token, Stop, and secret display. | `HOST-03`, `SEC-08`, `DEL-06` | Flutter host plus MCP security/docs owners | Existing opt-in dialog/server; product decision on connected-client visibility. | Desktop dialog accurately reports running state, permission, endpoint, and safe token/config actions; user setup flow is smoke-tested. |
| P1 | `MCP-T07` Complete edit review and result-state guarantees | Preserve current guarded edit tool and add remaining review/failed-state behavior plus persistence-boundary regression evidence. | `EDIT-05`, `ERR-03` | Flutter bridge/editor plus MCP adapter | Current read-write opt-in, identity/revision guards, and undo transaction. | Protocol tests cover review intent, applied/stale/rejected/failed outcomes and atomic failure; no Save/export/autosave side effect. |
| P1 | `MCP-T08` Add cancellation and disconnect-safe transactions | Abort pending work and prevent a stopped, revoked, or disconnected request from committing a mutation or reporting a false success. | `CXL-02` | MCP transport plus Flutter bridge/session | Current server stop hooks; request registry and cancellation semantics. | Local cancellation/stop fixtures pass; real server/client disconnect race remains open. |
| P1 | `MCP-T09` Compose bounded authoring/debug workflow | Compose discovery → example → completion → validation → explanation → render, and attach the rule/example/source chain to proposals without moving normative rules into prompts. | `EX-02`, `PROV-03` | MCP workflow owner plus integrated consumers | `MCP-T02`, `MCP-T03`, `MCP-T04`; stable read-only tools/resources. | Deterministic local example ranking is closed with a fixture; semantic validity, production examples, and proposal `basedOn[]` producer remain open. |
| P1 | `MCP-T10` Complete cross-consumer proposal and error mappings | Preserve completion proposal semantics, source kind, sheet/view selection, shared document/service/core/renderer context, and domain error fields across the adapter boundary. | `COMP-02`, `RENDER-02`, `HOST-05`, `ERR-02` | MCP adapter plus `language-service`, `core`, `renderer-svg`, and Flutter owners | `MCP-T02`, `MCP-T03`, `MCP-T07`; stable schemas. | Representative fixtures must preserve ranges, origin, source kind, sheet target, error code/message, and shared context; completion never silently mutates. |
| P2 | `MCP-T11` Produce desktop artifact and runtime smoke evidence | Add MCP-specific smoke coverage to desktop delivery and record artifact, package, SDK, OS, architecture, endpoint, security, clean-stop, and limitation evidence. | `DEL-04`, `DEL-05` | Flutter/workspace delivery owners | `MCP-T05`, `MCP-T06`; target hosts available. | macOS/Linux/Windows or explicitly scoped target runs prove embedded startup, read-only call, security boundary, stop, and artifact traceability. |

## Coverage proof

The active backlog covers every reconciled row whose implementation status is
not `implemented` or `deferred`. Each row is assigned to exactly one primary
task above; task dependencies do not change that assignment.

| Check | Result | Evidence |
| --- | --- | --- |
| Implementation-closable P0/P1 rows | `16` | Every row has an owner, source of truth, acceptance test, initial status, and candidate task in the triage register. |
| Evidence-only/environment-bound P0/P1 rows | `7` | `VAL-03`, `TRAN-03`, `TRAN-06`, `DEL-03`, `DEL-04`, `DEL-05`, and `DEL-06` retain explicit external-host, SDK, release, or client evidence boundaries; these are not target failures. |
| Historical alignment rows | `12` | Previously stale matrix rows are now synchronized with reconciliation and retained as audit trail only; they have no implementation assignment. |
| Scope-deferred rows | `2` | `WF-02` and `DEL-01` remain roadmap/decision-gated follow-ups. |
| Duplicate primary assignments | `0` | Each implementation-closable row has one primary candidate task; evidence/alignment rows have no new code task. |
| Documentation counted as implementation | `0` | Docs, plans, matrices, runbooks, and this backlog are explicitly evidence/planning only. |

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
