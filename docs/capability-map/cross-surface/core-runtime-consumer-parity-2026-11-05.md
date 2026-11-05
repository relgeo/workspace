# Core Runtime downstream consumer parity audit — 2026-11-05

## Decision

The current Core Runtime closure changes do not require source changes in the
downstream consumers audited here. The Core projection schema remains
`relgeo.resolved-scene` version `1`, while the changed semantic boundary is
carried by the existing structured diagnostic fields (`code`, `phase`, `path`,
`objectId`, and `range`) and by Core validation of operation targets. Consumers
already preserve or intentionally bound those fields; none had a stale
operation-target enum or a hard-coded diagnostic catalog that needed a patch.

This is an evidence-backed no-source-change decision, not a status-only
promotion. Core remains the owner of semantic behavior. Consumer repositories
remain owners of their presentation, protocol, and platform projections.

## Surface audit

| Surface | Contract boundary checked | Evidence | Decision |
|---|---|---|---|
| `language-service/` | `collectDiagnostics` fields are mapped to editor diagnostics; `code`, `phase`, path/object identity, and bounded ranges are preserved. | `pnpm test` — 2 files, 90 tests passed. Existing tests cover diagnostic codes, ranges, validation/readiness, schema drift, completions, and protocol projection. | No source change. The new Core codes are passed through as strings; no consumer catalog update is required. |
| `cli/` | Core diagnostics are normalized through `toDiagnostic`; JSON and human output retain code, phase, path, object identity, and range. | `pnpm test` — 1 file, 38 tests passed. Existing tests cover structured envelopes, resolver/runtime codes, format boundaries, and output failures. | No source change. CLI does not duplicate the Core operation-target matrix. |
| `remark-relgeo/` | Markdown preview consumes compile/render output and preserves structured preview/runtime diagnostics without reinterpreting Core semantics. | `pnpm test` — 16 tests passed. Tests cover runtime constraint diagnostics, strict/tolerant behavior, invalid preview metadata, render failures, and safe output. | No source change. Core semantic diagnostics remain presentation input. |
| `remark-relgeo-hl/` | Highlighting uses the language-service token projection and has a source-preserving failure boundary. | `pnpm test` — 1 Vitest file with 10 tests plus 1 package-boundary test passed (11 total). | No source change. This surface is independent of Core resolver target compatibility. |
| `playground/` | Worker and document controller consume Core parse/resolve results, preserve the last valid preview, and expose diagnostic code without inventing a new semantic contract. | `pnpm test` — 17 files, 107 tests passed. | No source change. Worker diagnostic projection is compatible with the current Core structured errors. |
| `flutter/` | Dart workbench uses the bounded semantic scene and diagnostic projections; it does not infer Core phase/path from exception text. | `flutter test` — 327 tests passed. This includes resolver, evaluator, invalid-fixture, constraint-diagnostic, projection, and shared-reference fixture coverage. | No source change. Current Flutter parity boundary is unchanged; evaluator/unit candidate status remains explicit. |
| `mcp/` | MCP DTOs preserve diagnostic `code`, `phase`, ranges, provenance, and bounded JSON projections; semantic execution remains injected through the owner bridge. | Fresh `dart test` was not runnable: the configured Dart binary is Flutter-bundled and attempted to write `/Users/agusmade/development/flutter/bin/cache/engine.stamp`, which the sandbox rejected. Static source audit plus existing `mcp/test/` contract coverage confirms the boundary. | No source change. Fresh MCP execution is environment-unavailable; packaged/desktop host verification remains separately deferred. |

## Core deltas reviewed

- `INVALID_OPERATION_TARGET` and `INVALID_REVERSE_TARGET` are Core-owned
  validation codes. No audited consumer switches on a closed list that would
  reject these codes.
- Evaluator syntax validation now reports the validation phase through the
  existing diagnostic contract; language-service and CLI already forward the
  phase rather than deriving it from message text.
- Turtle/relative-line and other resolver failures use structured Core
  diagnostics. Markdown, Playground, Flutter, and MCP consume bounded
  projections and do not need to reproduce resolver internals.
- The resolved-scene schema and version are unchanged, so no serializer or
  consumer schema migration is required.

## Verification boundary

The commands above are local package checks. They do not claim Node 24
canonical integration, public deployment, ChatGPT Desktop write round-trip,
or packaged MCP host parity. Those remain separate evidence lanes and are not
prerequisites for this consumer source audit.
