# MCP diagnostics and provenance closure — 2026-11-12

This task-specific closure record covers the actionable diagnostics,
completion identity, provenance, and lossless error-boundary work in the MCP
authoring pipeline. It does not promote cross-host, packaged-runtime, or
external-client evidence.

The setup/operations residual audit is a separate boundary disposition. Its
standalone, cross-host, Inspector/client, packaged-runtime, release, and live
setup rows are explicitly environment-deferred; they are not actionable
diagnostics or provenance implementation gaps for this task. The actionable
producer mapping gaps are closed below at the local MCP adapter boundary.

## Implementation mapping

| Contract boundary | Source | Regression test | Fixture |
| --- | --- | --- | --- |
| Validation result identity must match the shared document context | `mcp/lib/src/adapter/authoring_pipeline.dart` | `mcp/test/authoring_pipeline_test.dart` — `semantic validation rejects an owner identity from another document` | `fixtures/mcp/diagnostics-provenance-cases.json` — `validation-identity-guard` |
| Individual diagnostics must not cross spec revisions | `mcp/lib/src/adapter/authoring_pipeline.dart` | `mcp/test/authoring_pipeline_test.dart` — `semantic validation rejects diagnostics from another spec revision` | `fixtures/mcp/diagnostics-provenance-cases.json` — `diagnostic-provenance-guard` |
| Completion must echo shared identity for legacy input | `mcp/lib/src/adapter/authoring_pipeline.dart` | `mcp/test/authoring_pipeline_test.dart` — `completion echoes shared identity when the legacy input omits it` | `fixtures/mcp/diagnostics-provenance-cases.json` — `completion-context-identity-echo` |
| Validation diagnostics have deterministic ordering | `mcp/lib/src/adapter/authoring_pipeline.dart` | `mcp/test/authoring_pipeline_test.dart` — `validation diagnostics are returned in a stable order` | `fixtures/mcp/diagnostics-provenance-cases.json` — `diagnostic-order-normalization` |
| Producer diagnostic fields map losslessly into MCP diagnostics | `mcp/lib/src/contract/mcp_schema.dart`; `mcp/lib/src/adapter/authoring_pipeline.dart` | `mcp/test/authoring_pipeline_test.dart` — `producer validation maps diagnostic fields and provenance losslessly` | `fixtures/mcp/diagnostics-provenance-cases.json` — `producer-diagnostic-field-mapping` |
| Producer completion proposals populate provenance | `mcp/lib/src/contract/mcp_schema.dart`; `mcp/lib/src/adapter/authoring_pipeline.dart` | `mcp/test/authoring_pipeline_test.dart` — `producer completion mapping populates proposal provenance` | `fixtures/mcp/diagnostics-provenance-cases.json` — `producer-completion-provenance-mapping` |

## Execution and validation record

The task-specific validator checks the source guards, named regression tests,
and fixture cases. Package tests are run separately through the Dart test
runner snapshot because the managed wrapper cannot write Flutter telemetry
state outside the workspace.

| Command | Boundary | Result |
| --- | --- | --- |
| `node scripts/check-mcp-diagnostics-provenance-closure.mjs --evidence-id=suclos-mcp-diagnostics-provenance-2026-11-12-r3` | SuClos local repository validator | PASS — producer diagnostic field mapping, producer completion provenance, identity guards, deterministic ordering, named tests, and six fixture cases verified; marker `suclos-mcp-diagnostics-provenance-2026-11-12-r3`, scope `diagnostics-completion-provenance` |
| `dart test test/authoring_pipeline_test.dart -n "producer validation maps|producer completion mapping|semantic validation rejects|completion echoes shared identity"` | MCP focused producer/identity regression tests | 6 tests passed |
| `dart test test/authoring_pipeline_test.dart` | MCP authoring pipeline unit tests | 14 tests passed |
| `dart test` | MCP package unit/protocol tests | 68 tests passed |

The ordinary `dart test` wrapper is environment-unavailable in the managed
boundary because it attempts to write
`/Users/agusmade/development/flutter/bin/cache/engine.stamp`; this is not
treated as an implementation failure.
