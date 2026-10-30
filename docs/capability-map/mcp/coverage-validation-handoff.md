# RelGeo MCP — Coverage Validation and Implementation Handoff

**Date:** 2026-10-30
**Validation target:** MCP agent authoring and desktop-connected workflow
**Validation status:** declared coverage joined; implementation remains
incomplete and separately handed off

## 1. Validation conclusion

The declared MCP baseline is traceable end to end: 68 expected catalog IDs,
68 current-audit rows, 68 reconciliation rows, and 68 rows in the current
[actionable capability matrix](./capability-matrix.md) join with zero missing,
extra, or duplicate IDs. This proves coverage of the declared baseline and the
reviewed evidence boundary. It does not prove that MCP tools, resources,
transports, host UI, SDK adapter, or desktop runtime are delivered.

The strongest observed slices are the pure-Dart contract/session boundary, the
Flutter active-document bridge, and the dependency-free protocol fixture. The
production tool/resource executor, versioned resource snapshot, SDK adapter,
embedded server lifecycle, MCP settings/status surface, and end-to-end
consumer wiring remain implementation work.

## 2. Required source-category coverage

The following source categories are the declared audit surface. Each was
reviewed directly or through the bounded evidence inventory in the [current
implementation audit](./archive/implementation-audit-legacy.md) §2–§3. A reviewed
category can still have unavailable runtime evidence; that limitation is not
silently converted into either implementation or failure.

| Source category | Paths/evidence reviewed | Coverage result | Remaining limitation |
| --- | --- | --- | --- |
| Expected product baseline | `docs/capability-map/mcp/expected-capability-catalog.md` | All 68 expected IDs and their requirement/scope/owner anchors were used as the audit join key. | Expected state is not implementation evidence. |
| Product journeys, target users, workflows, menus, roadmap | `docs/plans/11-mcp-agent-integration.md`, catalog §§1–2 and workflow/menu crosswalk | Standalone, desktop-connected, read-only authoring, guarded mutation, prompts, security, delivery, and defer decisions are represented in the catalog. | Roadmap intent does not prove a runtime path. |
| MCP source and package metadata | `mcp/README.md`, `mcp/pubspec.yaml`, `mcp/lib/relgeo_mcp.dart`, `mcp/lib/src/contract/mcp_schema.dart`, `mcp/lib/src/contract/session_bridge.dart`, `mcp/bin/verify_session_bridge.dart` | Pure-Dart exports, DTOs, schemas, URI parser, provenance, session/edit/security values, and verifier were inspected. | No production tool executor, resource resolver, SDK adapter, or standalone RelGeo server was found. |
| Tools, resources, and protocol wire behavior | `mcp/tool/mcp_fixture_server.dart`, `mcp/tool/protocol_fixture.dart`, `mcp/tool/protocol_conformance.dart`, `mcp/tool/run_transport_conformance.dart` | Fixture initialize/list/call/resource/loopback/error paths and the declared seven tools/seven URI templates were reviewed. | Fixture behavior is not production adapter delivery; HTTP bind was unavailable locally. |
| Integrated consumers | `spec/id/`, `core/src/`, `language-service/src/`, `renderer-svg/src/`, `cli/src/`, `flutter/lib/src/mcp/`, and relevant tests | Ownership, contract boundaries, and missing MCP imports/calls were inspected. | Shared consumer implementations are not evidence that MCP invokes them. |
| Flutter document/session/editor bridge | `flutter/lib/src/mcp/`, document session, editor controller, file service, window host, `flutter/lib/relgeo_flutter.dart` | Active snapshot, revision/identity, bounded apply, dirty state, undo boundary, token model, and public bridge export were checked. | No MCP server lifecycle, resource route, mutation transport, or settings/status UI is wired. |
| UI/routes/menus/commands | `flutter/lib/src/ui/workbench_commands.dart`, menu/platform menu/context-menu files, repository-wide MCP search | Existing command/menu surfaces were searched for MCP enable/status/copy-config/stop paths. | Required MCP operational route and command surface were not found. |
| Configuration and platform services | `mcp/pubspec.yaml`, `flutter/pubspec.yaml`, `flutter/lib/src/ui/workbench_file_service.dart`, window-host/platform-channel files, CI workflow files | Path dependency, package boundary, file/save separation, host services, and CI configuration were inspected. | Configuration is not a passing runtime gate; no MCP platform-service wiring exists. |
| Tests and fixtures | `mcp/test/*.dart`, `flutter/test/workbench_agent_bridge_test.dart`, `mcp/bin/verify_session_bridge.dart` | Targeted bridge tests, Flutter non-golden suite, analyzer, direct Dart analyzer, verifier, and package test limitations were recorded. | MCP package test startup was dependency/network-gated; no production adapter test exists. |
| Runtime and environment evidence | Direct bundled Dart commands, Flutter test/analyze runs, transport conformance attempts | Positive local bridge/analyzer/verifier evidence and HTTP/socket limitations are recorded in audit §3. | No live SDK/Inspector run, current CI run, cross-host determinism run, or desktop MCP runtime proof. |
| Requirements and operational documentation | `docs/MATURATION-MASTER-PLAN.md`, `docs/REPOSITORY-MAP.md`, `docs/capability-map/README.md`, `docs/capability-map/INVENTORY-PROTOCOL.md`, `docs/mcp/01-04`, `docs/plans/01-cross-repo-integration-gate.md`, `mcp/README.md` | Ownership, evidence discipline, contract, security, transport, conformance, and delivery requirements were checked. | Documentation confirms requirements and limitations; it does not close implementation gaps. |

No declared source category above was omitted. “Reviewed” means the named
boundary was inspected and its evidence state recorded; it does not mean every
future host, SDK, platform, public deployment, remote transport, or CI run was
exhaustively exercised.

## 3. Capability-category coverage

The catalog has 11 stable capability categories. Each maps to an ID range in
the current audit (§4.1–§4.11), reconciliation, matrix, and backlog. Counts
sum to the complete 68-row catalog.

| Catalog category | Expected rows | Audit section | Coverage result | Principal open boundary |
| --- | ---: | --- | --- | --- |
| Discovery, syntax/reference, examples | 6 | §4.1 | 6/6 audited and joined | No query/index executor or bounded example selector. |
| Completion, validation, diagnostics, workflow | 10 | §4.2 | 10/10 audited and joined | No callable composition; prompts remain deferred. |
| Rendering | 3 | §4.3 | 3/3 audited and joined | No core → resolve → renderer MCP executor or failure mapping. |
| Document/session lifecycle | 6 | §4.4 | 6/6 audited and joined | Host bridge exists; MCP resource/session exposure is incomplete. |
| Edit transactions | 5 | §4.5 | 5/5 audited and joined | No protocol mutation/review path; host guards are local. |
| Resources, snapshot, provenance | 7 | §4.6 | 7/7 audited and joined | No production resolver, bundled snapshot, or cache/fallback layer. |
| Transport and protocol surface | 6 | §4.7 | 6/6 audited and joined | Fixture exists; production SDK/stdio/HTTP adapter is absent. |
| Host, bridge, command surface | 5 | §4.8 | 5/5 audited and joined | No embedded server supervisor or MCP status/config UI. |
| Error behavior and cancellation | 6 | §4.9 | 6/6 audited and joined | Schema defect, domain mapping, cancellation, and stop-race evidence remain open. |
| Security boundary | 8 | §4.10 | 8/8 audited and joined | Policy/token values exist; per-call transport enforcement is incomplete. |
| Delivery readiness and release evidence | 6 | §4.11 | 6/6 audited and joined | No MCP-specific desktop artifact/runtime evidence or live conformance record. |
| **Total** | **68** | **§4.1–§4.11** | **68/68** | **Coverage is bounded to the declared catalog.** |

## 4. Join and artifact coverage proof

| Check | Result | Evidence |
| --- | --- | --- |
| Catalog → current audit | `PASS: 68/68` | Zero missing, extra, or duplicate IDs; audit §2.2 and §4.1–§4.11. |
| Catalog → reconciliation | `PASS: 68/68` | One row per expected ID; `mcp/reconciliation.md` §1–§2. |
| Reconciliation → actionable matrix | `PASS: 68/68` | Matrix contains 68 user-meaningful rows with required action columns. |
| Active gap → backlog | `PASS: 56/56` | 40 `🌗` + 15 `❌` + 1 `⚠️` assigned once to `MCP-T01`–`MCP-T11`; see backlog coverage proof. |
| Deferred rows retained | `PASS: 2` | `WF-02` and `DEL-01` remain `⏸️` decision-gated follow-ups, not silently removed. |
| Implemented rows retained | `PASS: 10` | `✔️` rows remain in reconciliation and matrix; they are not counted as active gap tasks. |
| Required status vocabulary | `PASS` | Matrix uses only `✔️`, `🌗`, `❌`, `⚠️`, and `⏸️` for in-scope rows; evidence state is separate. |
| Documentation-only boundary | `PASS` | Catalog, audit, matrix, backlog, runbooks, and this handoff are explicitly not implementation evidence. |
| Required context links | `PASS` | MCP, integrated consumers, `docs/MATURATION-MASTER-PLAN.md`, `docs/REPOSITORY-MAP.md`, and `docs/capability-map` are linked or named above. |

## 5. Current result and evidence limitations

The current matrix distribution is 10 `✔️`, 40 `🌗`, 15 `❌`, 1 `⚠️`, and 2
`⏸️`. Evidence state remains independent: 3 rows are `not-verified`, one
transport row is `environment-unavailable`, and the remaining local/absence/
defect/scope states are recorded in the audit and matrix.

The following limitations are unresolved evidence boundaries, not claims that
the target implementation passed or failed beyond what was observed:

1. Local loopback HTTP binding was denied by the managed environment, so
   `TRAN-04` remains partial with environment-unavailable evidence.
2. No live MCP SDK adapter or Inspector run was available; `DEL-03` remains
   partial with not-verified evidence.
3. Cross-host deterministic validation and stop/disconnect cancellation need a
   real adapter/server lifecycle; `VAL-03` and `CXL-02` remain not verified.
4. The MCP package test command was dependency/network-gated, while direct
   bundled Dart analysis and the session verifier passed. These are separate
   evidence states.
5. CI configuration and historical integration pointers are not current
   passing runs; they do not establish release/runtime delivery.
6. Flutter full non-golden and bridge tests prove the tested host boundary,
   not production MCP server usability.

## 6. Unresolved questions

These questions do not block this documentation handoff, but they must be
answered or delegated before the affected implementation work can be called
complete.

| ID | Question | Affected candidate work | Why it matters |
| --- | --- | --- | --- |
| `Q-MCP-01` | Which Dart SDK/adapter is approved after the shared conformance gate? | `MCP-T02`, `MCP-T05` | Determines lifecycle, errors, cancellation, and packaging without changing domain contracts. |
| `Q-MCP-02` | Is standalone executable mode required for the next release? | Deferred `DEL-01`; `MCP-T05` transport evidence | Avoids premature CLI packaging while preserving the expected row. |
| `Q-MCP-03` | Where are versioned spec/examples/diagnostic snapshots packaged and refreshed? | `MCP-T03`, `MCP-T04`, `MCP-T09` | Prevents mixed revisions and makes offline behavior reproducible. |
| `Q-MCP-04` | Which permitted CI/desktop host will provide Streamable HTTP and Inspector evidence? | `MCP-T05`, `MCP-T06`, `MCP-T11` | Managed local socket denial is not transport verification. |
| `Q-MCP-05` | What user-confirmation policy governs `readWrite` direct edit in the desktop UI? | `MCP-T06`, `MCP-T07`, `MCP-T08` | Establishes authorization, cancellation, and one-undoable-transaction behavior. |
| `Q-MCP-06` | Is a root end-to-end MCP gate required before desktop artifact release? | `MCP-T05`, `MCP-T11` | Separates child contract CI from agent → adapter → Flutter usability. |

## 7. Implementation handoff

The following work is explicitly **not completed by this validation**:

- repair schema/DTO parity and add adapter-level invalid-argument tests;
- implement real tool/resource adapters and connect `spec/id`, `core`,
  `language-service`, `renderer-svg`, provenance, and versioned snapshots;
- complete stdio/loopback transport conformance and SDK evidence;
- embed server lifecycle/status/security UI in Flutter;
- wire active-document resources, guarded mutation, and cancellation;
- add bounded workflow composition and proposal provenance;
- produce desktop artifact/runtime smoke evidence;
- resolve the standalone mode decision before promoting `DEL-01`.

These are candidate tasks `MCP-T01`–`MCP-T11` in the [implementation-gap
backlog](./implementation-gap-backlog.md). They require separate goals/tasks
and direct implementation validation. Updating this handoff, matrix, audit,
catalog, or backlog must never be counted as closing one of those gaps.

## 8. Revalidation rule and artifact index

After an implementation change, rerun the sequence:

`expected catalog → implementation audit → reconciliation → actionable matrix → gap backlog → this handoff`

Preserve unresolved and environment-unavailable evidence. Do not promote docs,
fixtures, contracts, or CI configuration into runtime claims. Do not mark a
candidate task complete until its acceptance evidence is directly available.

| Artifact | Role |
| --- | --- |
| [Expected MCP catalog](./expected-capability-catalog.md) | Declared 68-row expected baseline. |
| [Implementation audit evidence](./archive/implementation-audit-legacy.md) | Source, tests, UI/workflows, configuration, consumers, docs, and runtime evidence. |
| [Expected/observed reconciliation](./reconciliation.md) | One-to-one implementation/evidence/scope join. |
| [Actionable capability matrix](./capability-matrix.md) | One user-meaningful capability per row with status and action fields. |
| [Prioritized gap backlog](./implementation-gap-backlog.md) | 11 candidate implementation tasks covering 56 active gaps. |
| [`docs/MATURATION-MASTER-PLAN.md`](../../MATURATION-MASTER-PLAN.md) | Product maturation and delivery context. |
| [`docs/REPOSITORY-MAP.md`](../../REPOSITORY-MAP.md) | Repository ownership and MCP/Flutter boundary. |
