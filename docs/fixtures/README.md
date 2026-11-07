# Language specification consumer fixtures

This directory documents the canonical fixture handoff for the active RelGeo
DSL `0.5` contract. Fixture source remains owned by the workspace at
[`fixtures/manifest.json`](../../fixtures/manifest.json); this document records
which consumers are affected by the current normative closure and which local
test is responsible for each boundary.

The normative changes in this closure are:

- [`spec/id/syntax/11-profiles.md`](../../spec/id/syntax/11-profiles.md): a
  profile may override only a declared parameter. Unknown keys, including
  constants, use `UNKNOWN_FIELD` at `profiles.<profile>.<key>`; typed mismatch
  uses `TYPE_MISMATCH`.
- [`spec/id/core/07-closure-contracts.md`](../../spec/id/core/07-closure-contracts.md):
  renderer semantic projection and replay failures use typed, stable boundary
  codes and preserve the failing semantic path; raw SVG bytes remain outside
  parity.

## Consumer handoff

| Surface | Changed capability | Contract impact | Evidence target |
| --- | --- | --- | --- |
| Core | `DECL-004`, `DIAG-001`, `DIAG-002`, `ERR-001` | Existing validator/diagnostic mapping is exercised by fixture 28; profile rules are checked before resolve. | [`core/src/validator.ts`](../../core/src/validator.ts), [`core/src/__tests__/parameter_type_validation.test.ts`](../../core/src/__tests__/parameter_type_validation.test.ts), `pnpm test` in `core` |
| Geometry | `SER-002` boundary only | No geometry field or topology contract changes; resolved geometry is passed through the renderer semantic adapter. | [`geometry/src/types.ts`](../../geometry/src/types.ts), geometry contract tests, `pnpm test` in `geometry` |
| Language Service | `DIAG-001`, `DIAG-002` | Preserves Core `UNKNOWN_FIELD`/`TYPE_MISMATCH` code and profile path in diagnostics. | [`language-service/src/service.ts`](../../language-service/src/service.ts), fixture 28, language-service tests |
| CLI | `DECL-004`, `DIAG-001` | Compile rejects invalid profile fixtures and exposes the structured code; `--profile` remains a selection option only. | [`cli/src/index.ts`](../../cli/src/index.ts), fixture 28, CLI tests |
| Markdown preview | `DIAG-001`, `SER-002` | Preview remains tolerant by default and serializes normalized diagnostics; semantic SVG bytes are not treated as parity. | [`remark-relgeo/src/index.ts`](../../remark-relgeo/src/index.ts), remark-relgeo tests |
| Markdown highlighting | `DIAG-001` | Highlight fallback keeps source-preserving behavior and does not invent a new profile or renderer code. | [`remark-relgeo-hl/src/index.ts`](../../remark-relgeo-hl/src/index.ts), remark-relgeo-hl tests |
| Playground | `CORE-INT-002`, `SER-002` | Worker continues to delegate profile selection/diagnostics to Core and renderer; semantic replay is consumer-owned. | [`playground/src/worker.ts`](../../playground/src/worker.ts), worker tests |
| Flutter | `CORE-INT-004`, `DECL-004` | Bundled `spec/id` snapshot is regenerated from the changed normative source; profile UI continues to apply declared parameter keys only. | [`flutter/assets/relgeo_spec/v0.5/`](../../flutter/assets/relgeo_spec/v0.5/), `pnpm run spec:snapshot:check`, Flutter snapshot/fixture tests |
| MCP | `DIAG-001` | MCP remains a bounded diagnostic/resource adapter; it does not redefine Core codes or semantic SVG errors. | [`mcp/lib/src/contract/mcp_schema.dart`](../../mcp/lib/src/contract/mcp_schema.dart), MCP schema/local-dispatch tests |
| Website | `DOC-003`, `SER-002` | Website remains explanatory/informative and does not become a second normative source; no generated semantic-byte contract is added. | [`relgeo.github.io/src/content/docs/`](../../relgeo.github.io/src/content/docs/), website build/check |
| Orchestration | `VER-003`, `SER-002` | Compatibility matrix, fixture manifest, snapshot digest, and conformance runner remain the join points for downstream evidence. | [`docs/compatibility-matrix.json`](../compatibility-matrix.json), [`scripts/run-conformance-fixtures.mjs`](../../scripts/run-conformance-fixtures.mjs), compatibility/conformance checks |

## Canonical fixture

[`v05-invalid-profile-override`](../../fixtures/reference/28-v05-invalid-profile-override.yaml)
is intentionally invalid. It attempts to override constant `gap` from
`profiles.compact`. The manifest requires `UNKNOWN_FIELD` at
`profiles.compact.gap`; the conformance runner verifies the same diagnostic
through Core, language service, and CLI. This fixture does not promote the
candidate evaluator/unit fixture 16.

The semantic SVG error codes are registered in both the compatibility matrix
and fixture manifest:

- `INVALID_SEMANTIC_PROJECTION`
- `INVALID_SEMANTIC_REPLAY`

They belong to the renderer adapter boundary and do not replace Core's
`INVALID_RESOLVED_SCENE` or `INVALID_SEMANTIC_SNAPSHOT` codes.
