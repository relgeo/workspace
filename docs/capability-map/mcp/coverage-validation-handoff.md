# RelGeo MCP — Coverage Validation and Implementation Handoff

**Date:** 2026-10-31
**Validation target:** MCP agent authoring and desktop-connected workflow
**Validation status:** 68 expected rows are joined to current MCP/Flutter
implementation evidence; full-spec retrieval, desktop loopback HTTP, and
opt-in document editing are implemented. Live edit interoperability and
packaged-app MCP smoke remain unverified.

> **Current-checkout handoff (2026-10-31):** MCP `b4561c0` and Flutter
> `60ec760` provide full-spec retrieval, bundled offline corpus, loopback
> HTTP, active-document tools/resources, lifecycle controls, and permission-
> gated bounded edits. MCP/Flutter integration tests cover those paths; Flutter
> CI `41184291670` passed, and `41184693233` produced an unpublished v1.0.1
> release draft. ChatGPT Desktop edit interoperability, live Inspector
> compatibility, and packaged-app MCP smoke remain unverified. The root
> integration manifest still contains 2026-10-09 child revisions.

## 1. Validation conclusion

The declared MCP baseline is traceable end to end: 68 expected catalog IDs,
68 current-audit rows, 68 reconciliation rows, and 68 rows in the current
[actionable capability matrix](./capability-matrix.md) join with zero missing,
extra, or duplicate IDs. This proves coverage of the declared baseline and the reviewed evidence
boundary. Runtime delivery is asserted only for the specific tested MCP/Flutter
paths; live client interoperability and packaged-app smoke remain separate
evidence gates.

The strongest observed slices are the bundled 34-file spec snapshot and
retrieval tools, authenticated desktop loopback server, active-document
resources, permission-gated edit transaction, Flutter operational dialog, and
the release artifact pipeline. Semantic validation/rendering, completion,
diagnostic catalog, cancellation races, live edit interoperability, and
packaged-app MCP smoke remain open.

## 2. Required source-category coverage

The following source categories are the declared audit surface. Each was
reviewed directly or through the bounded evidence inventory in the [current
implementation audit](./implementation-audit.md) §2–§3. A reviewed
category can still have unavailable runtime evidence; that limitation is not
silently converted into either implementation or failure.

| Source category | Paths/evidence reviewed | Coverage result | Remaining limitation |
| --- | --- | --- | --- |
| Expected product baseline | `docs/capability-map/mcp/expected-capability-catalog.md` | All 68 expected IDs and their requirement/scope/owner anchors were used as the audit join key. | Expected state is not implementation evidence. |
| Product journeys, target users, workflows, menus, roadmap | `docs/plans/11-mcp-agent-integration.md`, catalog §§1–2 and workflow/menu crosswalk | Standalone, desktop-connected, read-only authoring, guarded mutation, prompts, security, delivery, and defer decisions are represented in the catalog. | Roadmap intent does not prove a runtime path. |
| MCP source and package metadata | `mcp/README.md`, `mcp/pubspec.yaml`, `mcp/lib/src/`, `flutter/lib/src/mcp/`, bundled spec assets | Pure-Dart contracts/index/dispatcher plus Flutter HTTP server, offline loader, bridge, and permission-gated edit route were inspected. | Semantic validation/completion/render composition, standalone stdio server, and full workflow remain absent. |
| Tools, resources, and protocol wire behavior | `mcp/lib/src/adapter/local_dispatch.dart`, `flutter/lib/src/mcp/mcp_server_io.dart`, `flutter/test/mcp_server_io_test.dart` | Full-spec search/section retrieval, active document, edit tool, initialize, resources, loopback, auth, stale and applied edit paths are covered by integration tests. | External Inspector/client protocol interoperability and packaged application smoke remain unverified. |
| Integrated consumers | `spec/id/`, `core/src/`, `language-service/src/`, `renderer-svg/src/`, `cli/src/`, `flutter/lib/src/mcp/`, and relevant tests | Ownership, contract boundaries, and missing MCP imports/calls were inspected. | Shared consumer implementations are not evidence that MCP invokes them. |
| Flutter document/session/editor bridge | `flutter/lib/src/mcp/`, `flutter/lib/src/ui/cad_workbench.dart`, document session, editor controller, file service | Active snapshot, revision/identity, bounded apply, dirty state, undo, token scope, server lifecycle, dialog configuration, and save isolation are covered by source/tests. | Connected-client status and packaged-app interaction remain unverified. |
| UI/routes/menus/commands | `flutter/lib/src/ui/cad_workbench.dart`, Workbench command/menu and MCP dialog | Workbench MCP dialog exposes permission selection, endpoint/token, copy configuration, Enable and Disable. | Native dialog smoke and connected-client count/status remain open. |
| Configuration and platform services | `mcp/pubspec.yaml`, `flutter/pubspec.yaml`, `flutter/lib/src/mcp/`, `flutter/lib/src/ui/cad_workbench.dart`, window-host/platform-channel files, CI workflow files | Path dependency, embedded server host, file/save separation, host lifecycle, and CI configuration were inspected. | Packaged app/client configuration still needs manual smoke. |
| Tests and fixtures | `mcp/test/*.dart`, `flutter/test/mcp_server_io_test.dart`, Flutter CI | 32 MCP Dart tests and Flutter HTTP integration tests cover retrieval, loopback, auth scopes, resource/tool calls, stale/applied edits, dirty state and undo; Flutter CI passed on `60ec760`. | Live ChatGPT Desktop edit and release-bundle MCP smoke are not verified. |
| Runtime and environment evidence | MCP Dart suite, Flutter HTTP integration suite, Flutter CI/release runs | Current source tests, CI `41184291670`, and draft release workflow `41184693233` are recorded in audit §5. | Live client/Inspector, cross-host validation, and packaged MCP runtime proof remain open. |
| Requirements and operational documentation | `docs/MATURATION-MASTER-PLAN.md`, `docs/REPOSITORY-MAP.md`, `docs/capability-map/README.md`, `docs/capability-map/INVENTORY-PROTOCOL.md`, `docs/mcp/01-04`, `docs/plans/01-cross-repo-integration-gate.md`, `mcp/README.md` | Ownership, evidence discipline, contract, security, transport, conformance, and delivery requirements were checked. | Documentation confirms requirements and limitations; it does not close implementation gaps. |

No declared source category above was omitted. “Reviewed” means the named
boundary was inspected and its evidence state recorded; it does not mean every
future host, SDK, platform, public deployment, remote transport, or CI run was
exhaustively exercised.

## 3. Capability-category coverage

The catalog has 11 stable capability categories. Each maps to an ID range in
the reconciliation, status matrix, and backlog; the current audit §3–§6
records the observed boundary evidence and status conclusions. Counts sum to
the complete 68-row catalog.

| Catalog category | Expected rows | Audit section | Coverage result | Principal open boundary |
| --- | ---: | --- | --- | --- |
| Discovery, syntax/reference, examples | 6 | §3–§6 + reconciliation | 6/6 audited and joined | Full-spec search is implemented; examples remain bounded/basic and need richer selector coverage. |
| Completion, validation, diagnostics, workflow | 10 | §3–§6 + reconciliation | 10/10 audited and joined | No callable composition; prompts remain deferred. |
| Rendering | 3 | §3–§6 + reconciliation | 3/3 audited and joined | No core → resolve → renderer MCP executor or failure mapping. |
| Document/session lifecycle | 6 | §3–§6 + reconciliation | 6/6 audited and joined | Packaged-app lifecycle smoke and pending-request race remain open. |
| Edit transactions | 5 | §3–§6 + reconciliation | 5/5 audited and joined | Edit is protocol-exposed under opt-in permission; review UI/result failure and live client smoke remain open. |
| Resources, snapshot, provenance | 7 | §3–§6 + reconciliation | 7/7 audited and joined | Full-spec/offline and active-document resources exist; diagnostics catalog and cache/fallback policy remain open. |
| Transport and protocol surface | 6 | §3–§6 + reconciliation | 6/6 audited and joined | Embedded loopback HTTP exists; standalone stdio and external client/Inspector proof remain open. |
| Host, bridge, command surface | 5 | §3–§6 + reconciliation | 5/5 audited and joined | Embedded lifecycle/config UI exists; connected-client status and packaged UI smoke remain open. |
| Error behavior and cancellation | 6 | §3–§6 + reconciliation | 6/6 audited and joined | Domain mapping, cancellation, and stop-race evidence remain open; schema validation is verified locally at the adapter boundary. |
| Security boundary | 8 | §3–§6 + reconciliation | 8/8 audited and joined | Loopback, bearer auth, read/write permission, active-session guard, and edit bounds are tested; packaged smoke remains separate. |
| Delivery readiness and release evidence | 6 | §3–§6 + reconciliation | 6/6 audited and joined | v1.0.1 artifacts/checksums exist as an unpublished draft; MCP-specific packaged runtime smoke remains open. |
| **Total** | **68** | **§3–§6 + row join** | **68/68** | **Coverage is bounded to the declared catalog.** |

## 4. Join and artifact coverage proof

| Check | Result | Evidence |
| --- | --- | --- |
| Catalog → current audit | `PASS: 68/68` | Zero missing, extra, or duplicate IDs; audit §2 snapshot/coverage plus the reconciliation and matrix row join. |
| Catalog → reconciliation | `PASS: 68/68` | One row per expected ID; `mcp/reconciliation.md` §1–§2. |
| Reconciliation → actionable matrix | `PASS: 68/68` | Matrix contains 68 user-meaningful rows with required action columns. |
| Active gap → backlog | `PASS: 34/34` | 24 `🌗` + 10 `❌` + 0 `⚠️` assigned once to `MCP-T01`–`MCP-T11`. |
| Deferred rows retained | `PASS: 2` | `WF-02` and `DEL-01` remain `⏸️` decision-gated follow-ups, not silently removed. |
| Implemented rows retained | `PASS: 32` | `✔️` rows remain in reconciliation and matrix; they are not counted as active gap tasks. |
| Required status vocabulary | `PASS` | Matrix uses only `✔️`, `🌗`, `❌`, `⚠️`, and `⏸️` for in-scope rows; evidence state is separate. |
| Documentation-only boundary | `PASS` | Catalog, audit, matrix, backlog, runbooks, and this handoff are explicitly not implementation evidence. |
| Required context links | `PASS` | MCP, integrated consumers, `docs/MATURATION-MASTER-PLAN.md`, `docs/REPOSITORY-MAP.md`, and `docs/capability-map` are linked or named above. |

## 5. Current result and evidence limitations

The current matrix distribution is 32 `✔️`, 24 `🌗`, 10 `❌`, 0 `⚠️`, and 2
`⏸️`. Evidence state remains independent: three rows are `not-verified`; no
current row is marked `environment-unavailable`. Local, absence, and scope
evidence are recorded separately in the audit and matrix.

The following limitations remain open and are not inferred failures:

1. No current ChatGPT Desktop write-permission round-trip has been captured;
   `EDIT-02` is implementation-verified locally, while live client evidence is
   not verified.
2. No live Inspector run against the current server has been recorded;
   `DEL-03` remains `not-verified` for client interoperability.
3. Cross-host deterministic validation and cancellation/stop race evidence are
   missing; `VAL-03` and `CXL-02` remain `not-verified`.
4. Flutter CI `41184291670` built/tests all three platforms, and release workflow
   `41184693233` created v1.0.1 draft artifacts with verified checksums. Runtime
   MCP smoke from those packaged apps has not been done.
5. `docs/integration-baseline.json` still has its 2026-10-09 child pointers;
   current child commits are not covered by a refreshed root integration run.

## 6. Unresolved questions

These questions do not block this documentation handoff, but they must be
answered or delegated before the affected implementation work can be called
complete.

| ID | Question | Affected candidate work | Why it matters |
| --- | --- | --- | --- |
| `Q-MCP-01` | Which Dart SDK/adapter is approved after the shared conformance gate? | `MCP-T02`, `MCP-T05` | Determines lifecycle, errors, cancellation, and packaging without changing domain contracts. |
| `Q-MCP-02` | Is standalone executable mode required for the next release? | Deferred `DEL-01`; `MCP-T05` transport evidence | Avoids premature CLI packaging while preserving the expected row. |
| `Q-MCP-03` | Where are versioned spec/examples/diagnostic snapshots packaged and refreshed? | `MCP-T03`, `MCP-T04`, `MCP-T09` | Prevents mixed revisions and makes offline behavior reproducible. |
| `Q-MCP-04` | Which live MCP Inspector/client host will provide protocol interoperability evidence? | `MCP-T05`, `MCP-T06`, `MCP-T11` | Current HTTP tests cover loopback transport; a live Inspector/client host is needed for client interoperability evidence. |
| `Q-MCP-05` | Which manual smoke should close the explicit `readWrite` opt-in and user-request-only edit policy? | `MCP-T06`, `MCP-T07`, `MCP-T08` | Confirms the shipped opt-in and per-request behavior from the actual desktop client. |
| `Q-MCP-06` | Is a root end-to-end MCP gate required before desktop artifact release? | `MCP-T05`, `MCP-T11` | Separates child contract CI from agent → adapter → Flutter usability. |

## 7. Implementation handoff

The current implementation and verified boundaries must be preserved. The
remaining implementation/evidence work is:

- finish semantic validation, completion, diagnostic explanation, and renderer
  adapters (`MCP-T02`, `MCP-T03`, `MCP-T10`);
- add diagnostics catalog and cache/fallback policy (`MCP-T04`);
- decide standalone stdio and record current Inspector/client compatibility
  (`MCP-T05`);
- decide whether connected-client status is required and verify the permission
  dialog from the packaged app (`MCP-T06`);
- finish review/failure-state and cancellation/race guarantees (`MCP-T07`,
  `MCP-T08`);
- compose the bounded authoring workflow and provenance chain (`MCP-T09`);
- smoke-test MCP from desktop release artifacts and join release provenance
  (`MCP-T11`).

These are candidate tasks in the [implementation-gap
backlog](./implementation-gap-backlog.md). The expected catalog remains the
stable requirement set; updating evidence documents does not change that scope.

## 8. Revalidation rule and artifact index

After an implementation change, rerun the sequence:

`expected catalog → implementation audit → reconciliation → actionable matrix → gap backlog → this handoff`

Preserve unresolved and environment-unavailable evidence. Do not promote docs,
fixtures, contracts, or CI configuration into runtime claims. Do not mark a
candidate task complete until its acceptance evidence is directly available.

| Artifact | Role |
| --- | --- |
| [Expected MCP catalog](./expected-capability-catalog.md) | Declared 68-row expected baseline. |
| [Current implementation audit](./implementation-audit.md) | Source, tests, UI/workflows, configuration, consumers, docs, and runtime evidence. |
| [Expected/observed reconciliation](./reconciliation.md) | One-to-one implementation/evidence/scope join. |
| [Actionable capability matrix](./capability-matrix.md) | One user-meaningful capability per row with status and action fields. |
| [Prioritized gap backlog](./implementation-gap-backlog.md) | 11 candidate implementation tasks covering 34 active gaps. |
| [`docs/MATURATION-MASTER-PLAN.md`](../../MATURATION-MASTER-PLAN.md) | Product maturation and delivery context. |
| [`docs/REPOSITORY-MAP.md`](../../REPOSITORY-MAP.md) | Repository ownership and MCP/Flutter boundary. |

## 9. Current revision and evidence provenance

| Boundary | Current value |
| --- | --- |
| Workspace root | `7d02e4c` documentation follow-up; integration baseline still captured `2026-10-09` |
| MCP child | `b4561c08f7b41fd5630c76138a26ce6717ae9b33` |
| Flutter child | `60ec76042b369659e4d048b2a53ea3a66a384de3` |
| Flutter quality/build CI | [run `41184291670`](https://github.com/relgeo/flutter/actions/runs/41184291670), success |
| Desktop release workflow | [run `41184693233`](https://github.com/relgeo/flutter/actions/runs/41184693233), draft v1.0.1 |
| MCP test evidence | 32 Dart tests plus Flutter loopback HTTP integration coverage, recorded in current audit |
| Human client evidence | Read-only MCP/spec usage observed in ChatGPT Desktop; new write/edit flow still pending |

The current source, tests, and artifact claims are child-revision scoped. They do
not update the root baseline manifest or establish that the draft release is
published or runtime-usable on each target OS.
