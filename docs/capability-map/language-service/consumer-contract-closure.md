# Language Service consumer contract closure

Audit date: 2026-11-07  
Contract: Language Service protocol 0.2, RelGeo spec 0.5, UTF-16 ranges  
Authority: language-service/src/protocol.ts for editor DTOs; spec/id and core for semantic meaning

This is the executable cross-surface boundary record for the additive result
envelope and document lifecycle changes. It distinguishes a consumer that
actually imports Language Service from a consumer that only consumes Core or
the shared DSL fixtures.

| Surface / owner | Affected path | Propagation result | Evidence |
| --- | --- | --- | --- |
| Language Service / package owner | language-service/src/protocol.ts, document.ts, service.ts, test/*.json | Owns the frozen envelope, lifecycle guards, ranges, diagnostics, provenance, schema, and token result families. | npm test, npm run lint, npm run build; lifecycle and editor-intelligence fixtures. |
| Playground / consumer owner | playground/src/types.ts, worker.ts, worker-lifecycle.ts, src/__tests__/ | Carries document/version/request identity, readiness/recovery, analysis, provenance, stale-result suppression, cancellation, timeout, restart, and malformed-message boundaries. | pnpm test, pnpm lint, pnpm build; worker-lifecycle.test.ts and worker.test.ts; browser E2E remains host-unavailable when preview binding is denied. |
| remark-relgeo-hl / Markdown owner | remark-relgeo-hl/src/index.ts, render.ts, tests | Consumes the stable getSemanticTokens(source) projection and preserves token ranges. It does not reconstruct or discard the result envelope because the plugin boundary is source highlighting, not a protocol transport. | npm test, npm run lint, npm run build; tolerant/strict service-failure tests. |
| remark-relgeo / Markdown owner | remark-relgeo/src/index.ts, tests | No direct Language Service import. It consumes Core/renderer preview results and therefore requires no protocol DTO change. | Package test/build plus shared fixture conformance. |
| CLI / CLI owner | cli/src/index.ts, tests | No direct Language Service dependency. CLI remains a Core diagnostic/renderer consumer; shared invalid/runtime fixture assertions keep its diagnostic projection aligned. | CLI test/build plus scripts/run-conformance-fixtures.mjs. |
| MCP / MCP owner | mcp/lib/src/contract/mcp_schema.dart, adapter/local_dispatch.dart, tests | Mirrors protocol 0.2, UTF-16, identity, source revision, provenance, readiness/recovery, and guards returned identity/provenance before exposing semantic results. | Direct Dart SDK test with --suppress-analytics passes 45 tests; Flutter wrapper telemetry/engine-stamp writes remain host-limited. |
| spec/ and core/ / semantic owners | spec/id/, core/src/diagnostics.ts | No semantic language contract changed. Core remains the source of diagnostic phase/code/path/origin fields; the Language Service envelope is an adapter projection. | Core tests and shared conformance; no speculative spec/core edit was required. |
| Canonical fixtures / workspace owner | fixtures/expected/language-service-protocol.v0.5.json, language-service/test/*.json, fixtures/manifest.json | Adds a protocol-envelope fixture without pretending it is a DSL document fixture. Shared DSL fixtures remain authoritative for Core/CLI/Markdown/Playground semantics. | scripts/check-language-service-consumer-contract.mjs and shared conformance runner. |
| Website / delivery owner | relgeo.github.io/src/, relgeo.github.io/dist/playground | No direct Language Service import; it consumes the built Playground artifact. Protocol propagation is therefore verified at the Playground build boundary and only assembled into the website artifact. | Website check/build/test and Pages artifact/provenance checks; hosted public parity remains external evidence. |

## Dependency boundary

Node consumer manifests use package-version ranges, not relative sibling
dependencies. The Playground Vite alias to sibling source is a deliberate
workspace build/test alias and is not a package dependency; standalone
packaging still resolves the declared @relgeo/* packages. Flutter's path
dependency to ../mcp is the approved desktop embedding boundary, not a Node
consumer shortcut and not a Language Service dependency.

The checker in scripts/check-language-service-consumer-contract.mjs is the
single mechanical assertion for these statements. It fails if a direct
consumer loses a required protocol field, if MCP guards disappear, if Markdown
token range handling regresses, or if a Node consumer introduces an
unauthorized relative package dependency.
