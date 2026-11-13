# MCP residual implementation audit — 2026-11-12

This is the task-specific audit for [the frozen residual catalog](./freeze-2026-11-12.md).
It audits the six residual IDs one-to-one against source, tests/fixtures, and
supporting evidence. A row is not considered closed because this document says
so: each row retains an explicit open boundary and a promotion condition.

## Baseline and method

| Field | Value |
| --- | --- |
| Workspace root | `47c8b526dcf67197d0e5546a310b68dafcdf97fc` |
| MCP child | `824b46eccabd77da37bb37fa72b1c4a0e019442f` |
| Flutter child | `1b894663778af002675e253049c8a793c5cea8b9` |
| Frozen residual set | `VAL-03`, `TRAN-03`, `DEL-03`, `DEL-04`, `DEL-05`, `DEL-06` |
| Audit rule | Source and test/fixture paths must exist; supporting evidence must identify its boundary; no row may be marked closed by documentation alone. |

## One-to-one residual mapping

| ID | Current status / evidence | Closure lane | Owner | Source / implementation paths | Test / fixture paths | Supporting evidence paths | Decision / implementation finding | Required closure evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `VAL-03` | `⏸️ / environment-unavailable-deferred` | environment-deferred | MCP + core maintainers | `mcp/lib/src/adapter/authoring_pipeline.dart`; `core/src/diagnostics.ts`; `spec/id/core/05-semantic-guarantees.md` | `mcp/test/authoring_pipeline_test.dart`; `fixtures/mcp/cross-surface-contract-cases.json` | `docs/capability-map/mcp/implementation-evidence-register.md`; `docs/evidence/README.md` | Local diagnostic ordering is implemented and tested; cross-host/transport parity is unavailable at the managed/canonical boundary. No code defect is inferred. | Run the same deterministic fixture on each available host/transport when available; until then retain the environment-deferred disposition. |
| `TRAN-03` | `⏸️ / environment-unavailable-deferred` | decision-deferred | MCP transport owner | `mcp/tool/protocol_fixture.dart`; `mcp/tool/run_transport_conformance.dart`; `mcp/pubspec.yaml` | `mcp/test/protocol_fixture_test.dart`; `mcp/test/local_dispatch_test.dart` | `docs/mcp/03-sdk-conformance-runbook.md`; `docs/capability-map/mcp/freeze-2026-11-12.md` | Stdio fixture and framing exist, but no callable standalone RelGeo executable is present. Delivery is dependent on the explicit `DEL-01` standalone decision. | If approved, add the executable and run the shared stdio/conformance gate; until then retain the environment-deferred disposition. |
| `DEL-03` | `⏸️ / environment-unavailable-deferred` | environment-deferred | MCP transport/conformance owner | `mcp/tool/run_transport_conformance.dart`; `flutter/lib/src/mcp/mcp_server_io.dart`; `mcp/lib/src/adapter/local_dispatch.dart` | `mcp/test/protocol_fixture_test.dart`; `flutter/test/mcp_server_io_test.dart` | `docs/mcp/03-sdk-conformance-runbook.md`; `docs/evidence/mcp-packaged-artifact-provenance.json`; `.internal/mcp-external-runtime-evidence-20261111T035454Z.log` | Local protocol/security checks exist, but Inspector/client interoperability is unavailable at the managed boundary; no target defect is inferred. | Record initialize/negotiation, tools/resources, invalid request, and security results from an available external client/Inspector boundary, tied to the frozen revisions. |
| `DEL-04` | `⏸️ / environment-unavailable-deferred` | environment-deferred | Flutter/workspace delivery owner | `flutter/lib/src/mcp/mcp_server_io.dart`; `.github/workflows/integration.yml`; `flutter/build/macos/Build/Products/Release/RelGeo.app` | `flutter/test/mcp_server_io_test.dart`; `flutter/test/workbench_agent_bridge_test.dart` | `docs/evidence/mcp-packaged-artifact-provenance.json`; `docs/evidence/README.md` | A macOS artifact and local host tests exist, but packaged MCP runtime launch/smoke is unavailable at this executor boundary. | Launch the actual packaged artifact on a supported target and record start, authenticated call, permission/security, and clean stop. |
| `DEL-05` | `⏸️ / environment-unavailable-deferred` | environment-deferred | Workspace release owner | `docs/evidence/mcp-packaged-artifact-provenance.json`; `flutter/assets/relgeo_spec/v0.5/manifest.json`; `.github/workflows/integration.yml` | `scripts/check-mcp-implementation-audit.mjs`; `flutter/test/spec_snapshot_loader_test.dart` | `.internal/mcp-external-runtime-evidence-20261111T035454Z.log`; `docs/evidence/README.md` | Supporting provenance joins artifact, revisions, snapshot, and manual PASS markers, but the canonical release boundary is unavailable. | Produce a canonical release record joining root/MCP/Flutter/spec revisions, artifact, OS/architecture, run, date, and checksums. |
| `DEL-06` | `⏸️ / environment-unavailable-deferred` | environment-deferred | Flutter host + MCP documentation owner | `flutter/lib/src/mcp/mcp_server.dart`; `flutter/lib/src/mcp/mcp_server_io.dart`; `mcp/README.md` | `flutter/test/mcp_server_io_test.dart`; `flutter/test/workbench_agent_bridge_test.dart` | `docs/mcp/03-sdk-conformance-runbook.md`; `flutter/docs/mcp-local-testing.md`; `docs/evidence/README.md` | Local endpoint/token/permission setup is documented and source-backed; live compatible-client setup and limitation disclosure are unavailable at this boundary. | Run setup/operations smoke with a compatible client and record endpoint, token, permission, and limitation behavior. |

## Closeable versus deferred disposition

| Lane | IDs | Disposition |
| --- | --- | --- |
| Environment-deferred until boundary is available | `VAL-03`, `DEL-03`, `DEL-04`, `DEL-05`, `DEL-06` | Local evidence is retained, but cross-host, client, packaged-runtime, release, and live setup claims remain deferred until the named boundary is available. |
| Decision-deferred | `TRAN-03` | Standalone executable work is blocked by the explicit `DEL-01` product decision; the existing stdio fixture remains observational evidence. |

The two scope-deferred IDs from the freeze, `WF-02` and `DEL-01`, are not
residual implementation rows and are not silently counted as closed here.

## Execution and validation record

The following record is produced by the task-specific audit command, not by a
generic project validator or a progress report. The command checks every row's
ID, current status, owner, source path, test/fixture path, supporting evidence
path, frozen baseline, and non-closed disposition.

| Command | Boundary | Result |
| --- | --- | --- |
| `node scripts/check-mcp-residual-audit.mjs --evidence-id=suclos-mcp-residual-audit-2026-11-12-r3` | SuClos local validator / repository audit artifact | **PASS** — execution marker `suclos-mcp-residual-audit-2026-11-12-r3`; six mappings, all source/test/evidence paths, baseline, and deferred boundaries recorded. |

No row is promoted by this record alone. The command reported all six mappings
and all referenced paths as present; the residual statuses remain as listed
until their external evidence conditions are met.
