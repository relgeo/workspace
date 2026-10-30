# RelGeo MCP — current implementation and evidence audit

**Audit date:** 2026-10-30

**Compatibility line:** RelGeo DSL `0.5.x`

**Audit role:** current evidence entry point for the 68-row expected catalog
**Status rule:** implementation status and evidence status are separate. A
fixture, contract, documentation statement, or CI definition is not promoted
to end-to-end MCP delivery without a directly matching runtime observation.

> **Current-checkout handoff (2026-10-30):** The 68-row register below was
> recorded against earlier workspace/MCP revisions. Its full-spec rows and
> host-absence claims are historical context, not current runtime evidence.
> The current Plan 14 implementation is recorded in the
> [full-spec plan](../../plans/14-mcp-full-spec-search.md) and
> [conformance runbook](../../mcp/03-sdk-conformance-runbook.md): the pure-Dart
> index/adapter, checked-in Flutter asset bundle, desktop loader, and
> deterministic retrieval tests are present. The live Inspector/Codex Desktop
> and loopback HTTP rows remain environment-gated. The current implementation
> is local supporting evidence only; `docs/integration-baseline.json` still
> points at canonical child commits from its 2026-10-09 snapshot and must not
> be silently rewritten to represent this uncommitted work.

### Current Plan 14 overlay

| Capability | Current implementation/evidence | Status boundary | Canonicality |
| --- | --- | --- | --- |
| Full snapshot and drift identity | `flutter/assets/relgeo_spec/v0.5/manifest.json`, 34 Markdown files, source revision `b96ba3b...`, corpus digest, and `spec:snapshot:check` | Verified locally | Supporting local; not in the pinned baseline commit |
| Search and complete-section retrieval | `SpecSectionIndex`, `relgeo_search_spec`, `relgeo_get_spec_section`, bounded snippets, stable IDs, and resources | Verified locally | Supporting local; MCP package child commit is not refreshed in baseline |
| Flutter offline host bridge | `RelGeoSpecSnapshotLoader` and `RelGeoMcpDesktopServer.start` load only the bundled AssetBundle | Verified by Flutter tests/analyzer | Supporting local; desktop artifact/CI smoke is not claimed |
| Normativity and provenance | Spec sections carry source/path/anchor/version/revision/digest; examples remain `source: example` and non-normative | Verified by adapter and Flutter tests | Supporting local |
| Retrieval quality scenarios | Indonesian/English intent, ambiguity, no-result, presentation, full-section, and offline fixtures pass | Deterministic local tests pass | Supporting local |
| Inspector/Codex Desktop/loopback HTTP | No live managed-runner proof; runbook records socket/Inspector limits | Not verified / environment-gated | Not canonical evidence |

The historical one-row-per-ID register remains useful for the broader Plan 11
backlog, but it must not overwrite this Plan 14 overlay or claim that local
supporting evidence is canonical CI/public evidence.

The [expected capability catalog](./expected-capability-catalog.md) remains
the expected baseline. The [reconciliation](./reconciliation.md) and [status
matrix](./status-matrix.md) contain the one-row-per-ID result. The prior dated
log is retained as [historical audit evidence](./archive/implementation-audit-legacy.md),
not as proof of current CI, deployment, or runtime state.

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
| Workspace root revision | `1cfa86553d7adb18179c6b3e1a33618a179b1414` | `git rev-parse HEAD` during this audit |
| MCP checkout | `e225919e8d35f88f968c7ac75c748055447c2c38` | `git -C mcp rev-parse HEAD` |
| Flutter checkout | `b21eceb258070133f32fd822b6fd23a4f21b0bbf` | `git -C flutter rev-parse HEAD` |
| Expected catalog → reconciliation | `68/68` | [reconciliation](./reconciliation.md) coverage |
| Expected catalog → status matrix | `68/68` | [status matrix](./status-matrix.md) rows |
| Current capability status | `11 ✔️`, `41 🌗`, `14 ❌`, `0 ⚠️`, `2 ⏸️`, `0 ➖` | status matrix count; evidence state remains separate |
| Rows with not-verified evidence | `VAL-03`, `CXL-02`, `DEL-03` | status matrix evidence column; all remain `🌗` |
| Environment-unavailable evidence | `TRAN-04` local HTTP bind | status matrix/reconciliation; loopback socket permission is unavailable here |

The bounded active tranche is recorded in the [MCP in-scope selection](./in-scope-selection.md).
It selects 20 rows; the remaining active backlog rows stay visible and are not
implicitly promoted, removed, or treated as completed.

## 3. Observed implementation boundaries

| Boundary | Directly observed | Honest result and limitation |
| --- | --- | --- |
| Pure-Dart package | [`mcp/pubspec.yaml`](../../../mcp/pubspec.yaml) is private/non-publishable and has no MCP SDK, HTTP, JSON-RPC, Flutter, or filesystem dependency. [`relgeo_mcp.dart`](../../../mcp/lib/relgeo_mcp.dart) exports the contract, session, typed dispatcher, resource store, and JSON-RPC router. | `HOST-01` is `✔️` at the package boundary. The reusable adapter is now implemented without claiming a production MCP server, executable, or release artifact. |
| Typed tool contract | [`mcp_schema.dart`](../../../mcp/lib/src/contract/mcp_schema.dart) defines seven read-only tool DTOs, bounded inputs, structured results, diagnostics, completion proposals, provenance, and `relGeoMvpToolContracts`. [`local_dispatch.dart`](../../../mcp/lib/src/adapter/local_dispatch.dart) validates raw arguments and invokes typed owner callbacks. | The wire dispatch boundary is present; semantic owner callbacks are injected and still need `spec/id`, `core`, `language-service`, and renderer composition. `DISC-*`, `VAL-01`, `DIAG-01`, and semantic rows remain `🌗`. |
| Resource URI contract | `RelGeoResourceUri` accepts the declared spec, examples, diagnostics, and active-document forms, rejects unsupported schemes/path-like forms, and never resolves a filesystem path. `RelGeoMcpResourceStore` lists canonical templates and reads caller-pinned static resources or the active bridge. | Resolver boundary is implemented and tested by focused source, but no packaged snapshot/catalog is present; `REF-01`/`RES-01`/`DOC-02` remain `🌗`, `RES-02`/`RES-03` remain `❌`, and active-document delivery still needs host/session authorization wiring. |
| Session/edit/security contract | [`session_bridge.dart`](../../../mcp/lib/src/contract/session_bridge.dart) contains active snapshots, diagnostics, bounded non-overlapping edits, identity/revision guards, result states, in-memory token scope/expiry/revocation, loopback policy, and no-filesystem-write/no-autosave defaults. `McpServerSession` now owns explicit start/stop and token authorization at the pure-Dart boundary. | Session lifecycle and scope enforcement are locally modeled, but the JSON-RPC router is not yet coupled to a token-bearing host supervisor; host lifecycle, per-request auth, and mutation routes remain incomplete. |
| Protocol adapter and fixture | [`local_dispatch.dart`](../../../mcp/lib/src/adapter/local_dispatch.dart) implements transport-independent initialize/initialized, tools/list/call, resources/list/read, typed errors, and seven-tool discovery. [`protocol_fixture.dart`](../../../mcp/tool/protocol_fixture.dart) and [`mcp_fixture_server.dart`](../../../mcp/tool/mcp_fixture_server.dart) remain dependency-free stdio/loopback harnesses. | The reusable router proves the selected wire contract at source level; the fixture still exposes `relgeo_fixture_echo` and one provenance resource, and no production socket/stdio host or semantic owner wiring is claimed. |
| Transport conformance harness | [`run_transport_conformance.dart`](../../../mcp/tool/run_transport_conformance.dart) drives stdio and loopback HTTP; the fixture rejects non-loopback hosts and checks protocol/origin headers. | `TRAN-01`/`TRAN-02`/`TRAN-03`/`TRAN-05` remain `🌗`. HTTP bind and SDK/Inspector evidence are not verified in this environment; no candidate SDK is pinned. |
| Flutter bridge | [`workbench_agent_bridge.dart`](../../../flutter/lib/src/mcp/workbench_agent_bridge.dart) reads the active snapshot/diagnostics, validates stale/rejected edits, calls the editor setter once, preserves revision/dirty behavior, and returns failed on divergence. | `DOC-01`, `DOC-03`, `DOC-04`, `EDIT-03`, `EDIT-04`, and `HOST-04` are verified at the host/bridge boundary. No MCP transport-to-bridge dispatch was found. |
| Flutter document lifecycle | [`workbench_document_session.dart`](../../../flutter/lib/src/ui/workbench_document_session.dart) owns identity, source, saved baseline, dirty state, revision, load, save, and guarded source updates. | Host lifecycle is real, but no MCP server start/stop supervisor, active-resource route, status/config UI, or token lifecycle integration was found; `DOC-02`, `DOC-05`, and `HOST-02` remain incomplete. |
| Save/file boundary | [`workbench_file_service.dart`](../../../flutter/lib/src/ui/workbench_file_service.dart) owns Save/Save As; the bridge applies in-memory source through the editor and does not call the file service. | Save isolation is implemented at the host boundary (`DOC-06`/`SEC-07` evidence), but a protocol-level negative test is still required before full MCP exposure is claimed. |
| Consumer semantics | `core`, `language-service`, `renderer-svg`, and `spec/id` contain real parser/validation/completion/render/normative-source capabilities at their own boundaries. | These consumers do not prove MCP exposure. No adapter path was found that maps their results into callable MCP tools/resources. |
| CI and delivery | [`mcp-ci.yml`](../../../mcp/.github/workflows/mcp-ci.yml) defines Dart dependency install, format, analyze, unit tests, and protocol conformance; workspace CI runs Flutter conformance and desktop artifact jobs. | CI configuration is present, but no current MCP-specific run/Inspector result or embedded server artifact/runtime smoke evidence is available locally. `DEL-03` is `🌗`/`not-verified`; `DEL-04`/`DEL-05` remain partial. |

## 4. Contract defect closure evidence

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

## 5. Direct validation evidence

| Command or inspection | Result | What it proves / does not prove |
| --- | --- | --- |
| `flutter test test/workbench_agent_bridge_test.dart` from `flutter/` | **PASS — 2 tests** | Host bridge revision guard, one-setter edit behavior, and document identity reset pass. It does not prove MCP transport or server delivery. |
| `dart format --output=none --set-exit-if-changed lib test tool` with analytics suppressed | **PASS — 12 files, 0 changed** | MCP source and test formatting are clean. |
| `dart analyze` with analytics suppressed | **PASS — No issues found!** | Contract, session, adapter, tool, and fixture sources analyze cleanly. |
| `dart test` with analytics suppressed | **PASS — 18 tests** | Schema, dispatcher, JSON-RPC router, resources, session/security, and protocol fixture tests pass locally. |
| `dart run tool/run_transport_conformance.dart` with analytics suppressed | **STDIO PASS; HTTP NOT VERIFIED** | Stdio fixture conformance passed. Loopback HTTP could not bind `127.0.0.1` because the managed environment denied socket creation; the wrapper required interruption after reporting that limitation. |
| Source/fixture/CI inspection | **PASS as bounded inspection** | Confirms the contract, fixture, host bridge, CI definitions, and explicit absence of production adapter paths at the inspected boundaries. It is not runtime proof. |

The current run confirms dependency-free stdio fixture success and records the
loopback HTTP sandbox denial. Remote-bind rejection remains covered by the
fixture/policy tests; no live SDK/Inspector run is claimed.

## 6. Capability conclusions and handoff

1. The strongest current implementation is the pure-Dart contract/session
   slice, the dependency-free protocol fixture, and the Flutter active-document
   bridge.
2. The decisive missing boundary is semantic owner wiring and a runtime
   entrypoint that connect the typed MCP adapter to `spec/id`, `core`,
   `language-service`, `renderer-svg`, and the Flutter bridge.
3. `✔️` rows are limited to the boundary actually tested; they do not imply
   end-to-end MCP usability. `🌗` rows retain partial contract/fixture/host
   evidence, and `❌` rows retain verified-absence findings from the owner map.
4. `WF-02` and `DEL-01` remain `⏸️`; Android/iOS, remote deployment, and
   arbitrary host command invocation remain `➖` scope findings. Neither is
   active implementation work.
5. The remaining implementation tasks are the selected partial/absent rows in
   the [in-scope selection](./in-scope-selection.md), sequenced with the
   [implementation-gap backlog](./implementation-gap-backlog.md). `ERR-01` is
   complete only at the verified contract/adapter boundary; all other open
   rows retain their owners, dependencies, and next actions. Re-run this audit
   after source changes and preserve `not-verified` and
   `environment-unavailable` evidence until the missing runtime boundary is
   directly exercised.
