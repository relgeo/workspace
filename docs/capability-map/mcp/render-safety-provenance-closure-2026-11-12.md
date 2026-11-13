# MCP render safety and provenance closure — 2026-11-12

This task-specific record covers the contextual render adapter boundary. It
does not promote renderer implementation, packaged runtime, or external-client
interoperability beyond the tested MCP contract.

## Implementation mapping

| Boundary | Source | Regression test | Fixture |
| --- | --- | --- | --- |
| Context mismatch is rejected before owner invocation and mapped structurally | `mcp/lib/src/adapter/authoring_pipeline.dart` | `mcp/test/authoring_pipeline_test.dart` — `render boundary rejects a mismatched context before owner call` | `fixtures/mcp/render-safety-provenance-cases.json` — `render-context-mismatch` |
| Owner cannot return another sheet/view target | `mcp/lib/src/adapter/authoring_pipeline.dart` | `mcp/test/authoring_pipeline_test.dart` — `render target mismatch is rejected before serialization` | `fixtures/mcp/render-safety-provenance-cases.json` — `render-target-ownership` |
| Render evidence carries target, context identity, and provenance revision | `mcp/lib/src/contract/mcp_schema.dart`; `mcp/lib/src/adapter/authoring_pipeline.dart` | `mcp/test/authoring_pipeline_test.dart` — `render echoes target, context identity, and provenance` | `fixtures/mcp/render-safety-provenance-cases.json` — `render-evidence-identity` |
| Empty or untraceable output is rejected | `mcp/lib/src/adapter/authoring_pipeline.dart` | `mcp/test/authoring_pipeline_test.dart` — `render rejects empty or untraceable owner output as structured failure` | `fixtures/mcp/render-safety-provenance-cases.json` — `render-output-safety` |

## Execution and validation record

| Command | Boundary | Result |
| --- | --- | --- |
| `node scripts/check-mcp-render-safety-closure.mjs --evidence-id=suclos-mcp-render-safety-2026-11-12-r1` | SuClos local repository validator | PASS — context/target/identity/provenance/output-safety guards, four named tests, and four fixture cases verified; marker `suclos-mcp-render-safety-2026-11-12-r1` |
| `dart test test/authoring_pipeline_test.dart -n "render"` | MCP contextual render unit tests | 4 tests passed |

The standard Dart wrapper remains environment-unavailable at the managed
boundary when it attempts to write Flutter SDK state outside the workspace.
