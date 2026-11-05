# RelGeo language-service capability matrix

> **Coverage statement — 2026-11-04.** This matrix covers the language-service
> API and its core/Playground consumer boundary using source modules, tests,
> schema/completion/token data, package metadata, shared fixtures, and docs
> wiring. It inventories diagnostics, schema, tokens, completion, hover, and
> version vocabulary; it does not claim parity for every normative function or
> editor host. Current CI/canonical, registry/public, and fresh browser/AT
> checks remain `not verified` where stated; a missing row is not evidence of
> absence.
> See [inventory protocol](../INVENTORY-PROTOCOL.md) for status axes and evidence tiers.

Status dokumen: reconciliation refresh, 2026-11-04
Surface: `language-service/`  
Owner: `relgeo/language-service`  
Package: `@relgeo/language-service@0.5.1`  
Compatibility line: `0.5.x`  
Evidence log: [language-service/archive/implementation-audit-legacy.md](./archive/implementation-audit-legacy.md)

## Status legend

| Status | Arti audit | Tidak berarti |
| --- | --- | --- |
| `✔️` | Capability tersedia pada language-service boundary dan punya evidence langsung. | Semua editor, schema edge case, atau runtime diagnostic sudah parity. |
| `🌗` | Implementasi/evidence tersedia sebagian atau coverage/consumer contract masih terbatas. | Capability selesai end-to-end. |
| `❌` | Capability yang seharusnya tersedia pada boundary ini sudah diperiksa dan belum ada. | Consumer lain otomatis gagal. |
| `➖` | Capability bukan tanggung jawab language-service atau sengaja di luar scope. | Pekerjaan yang tertunda. |
| `⏸️` | Capability ditahan oleh keputusan/promotion/dependency. | Capability tidak bisa diimplementasikan. |
| `⚠️` | Mismatch atau masalah terkonfirmasi pada source/docs/consumer boundary. | Evidence yang belum diverifikasi. |

`not verified` adalah state evidence, bukan simbol. Status capability tetap
berbasis source/test/fixture yang ada dan batas verifikasi ditulis eksplisit.

## Capability matrix

| Capability | Status | Evidence | Gap / limitation | Consumer | Dependency | Next action |
| --- | --- | --- | --- | --- | --- | --- |
| Public package/export surface: `RelGeoLanguageService`, schema, completions, tokens | `✔️` | `language-service/src/index.ts:1-4`; `package.json`; package build | Fresh registry install tidak dijalankan pada audit ini | Playground, remark-relgeo-hl, editor integrations | `@relgeo/core` peer dependency | Re-run registry boundary under Node >=24 |
| Parse/validation diagnostics with LSP-compatible range, code, source, severity | `✔️` | `service.ts:123-207`; focused service suite 90/90; shared conformance 298/298 | Diagnostics are line-oriented and emit `Error` severity; warning/info policy is not represented | Playground editor, future editor adapters, conformance runner | core parser/Validator, `vscode-languageserver-types` | Add shared diagnostic catalog and severity policy if consumers need it |
| Diagnostics for invalid YAML, version, references, constraints, and schema fields | `✔️` | `service.ts:158-207`; invalid fixtures 11–13 and 17–18; conformance checks | One thrown validation/parser error is converted per call; exhaustive multi-error collection is not proven | language-service, Playground, CLI indirectly | core validation/error model | Add multi-error fixture only if editor contract requires aggregation |
| Runtime/post-resolve violation diagnostics | `🌗` | `service.ts` calls `parseRelGeo(..., validate)` and `Validator.validate`, but not `resolveGeometry`; fixture 14 expects language service to accept the structurally valid runtime violation | Runtime `ConstraintViolation` is represented by core/Playground resolved data, not returned by `getDiagnostics` | Playground inspector, core, renderer | resolver constraint processing and diagnostic mapping | Decide whether runtime violations belong in this API; add a separate method/fixture if yes |
| JSON Schema export for document/object/parameter/view/sheet/presentation vocabulary | `✔️` | `src/schema.ts:1-590`; tests for version, metadata, sheet placement, repeat, split | Schema is a constant export; no schema validator runner checks every branch against parser | editors, schema-aware YAML tooling | spec/core field vocabulary | Add schema-vs-spec/core drift checker |
| Documented `langService.getSchema()` method | `✔️` | `src/service.ts`, README, and focused API/version test expose the method consistently | Packed/registry artifact verification remains outside this audit | editor integrators | public API/docs alignment | Retain public artifact check at release boundary |
| Context-aware completion for root, object types, fields, placement, metadata, geometry functions | `✔️` | `completions.ts:3-517`; `service.ts:287-552`; focused service suite 90/90 | Completion is heuristic/indent-based rather than a full YAML AST/LSP completion engine | Playground CodeMirror, editor integrations | completion catalogs, core/spec vocabulary | Keep representative context fixtures and document heuristic boundary |
| Object/reference/anchor completion for quoted IDs, components, repeats, path contexts | `✔️` | tests for punctuation-heavy IDs, component exports, indexed repeats, `point.on.path`, `along.target` | Object ID-level suggestions intentionally return empty (`service.ts:523-525`) | Playground, editor | source scanning and parsed editor document | Add bounded ID completion if consumer demand requires it |
| Semantic tokenization with geometry/presentation/layout/function/unit categories | `✔️` | `tokens.ts:10-543`; token classification test; conformance token checks | Token spans are custom RelGeo lines, not standard LSP semantic-token integer arrays | remark-relgeo-hl, Playground syntax surface | completion vocabulary, tolerant source tokenizer | Keep token kind vocabulary synchronized with spec |
| Hover for object type/resolved value/anchors/scalars | `🌗` | `service.ts:217-281`; direct hover/range and incomplete-source tests; Playground `Editor.tsx:65-89` wires hover | Complete keyword/type/enum documentation provenance and broader incomplete/quoted-ID coverage remain open | Playground, editor | core editor-mode resolver | Expand hover coverage for valid/incomplete/quoted IDs and document support boundary |
| Playground editor integration: diagnostics, completion, hover | `🌗` | `playground/src/components/Editor.tsx`; typed request helpers carry document/version/request identity; `npm test && npm run lint && npm run build` passes (106 tests) | Source wiring and production bundle build are verified; browser/E2E/public execution was not run in this audit | Playground users | CodeMirror, language-service dist, browser bundle | Re-run browser smoke and record current build/commit |
| Typed result identity and stale-result boundary | `🌗` | `language-service/src/protocol.ts`, `src/__tests__/protocol.test.ts`; Playground adapter helpers; MCP identity echo test | Service guard is exact; worker/host ordering and every semantic producer remain consumer-owned/open | Playground, MCP, editor adapters | document identity, version, request ID, source revision | Add an end-to-end worker assertion before broad adapter rollout |
| Minimal semantic navigation | `🌗` | `RelGeoLanguageService.analyzeNavigation()` and protocol test return object definition/reference locations with document ID and UTF-16 ranges | One object-reference relation is covered; Playground source-jump action and broader semantic index are not | future editor actions, Playground | core semantic identity and host navigation action | Wire one source-jump consumer |
| Bounded re-analysis strategy | `🌗` | `language-service/src/analysis.ts`; protocol test records changed range, line budget, inspected lines/code units, and full-document fallback reason | Core dependency semantics require whole-document inspection today; this is measured fallback, not incremental parsing | language-service, worker | core semantic dependency/index contract | Replace fallback only after core exposes safe dependency-bounded analysis |
| Active-spec vocabulary drift check | `🌗` | `node scripts/check-language-service-schema-drift.mjs` reports zero root/object differences against `spec/id` v0.5 | Checker covers active root/object catalogs; generated all-spec field/parameter comparison remains open | language-service, spec | active `spec/id` snapshot | Connect generated all-spec vocabulary evidence |
| MCP editor result adapter | `🌗` | `mcp/lib/src/contract/mcp_schema.dart`, `local_dispatch.dart`; 34 Dart tests cover identity serialization/echo and legacy JSON compatibility | Core-backed language-service producer wiring and packaged/cross-host verification remain open | MCP tools, agent hosts | typed result/provenance contract | Wire core-backed semantic producer separately |
| Normative language ownership and package semantics | `➖` | `docs/REPOSITORY-MAP.md:9-16,51-74`; `spec/id/` ownership; README relationship with core | Language-service mirrors/consumes vocabulary; it is not the normative source | spec, core, all editor consumers | spec revision and compatibility matrix | Keep schema/completions as generated/checked consumer views |
| Formatting, refactoring, rename, incremental parsing, collaborative editing | `➖` | `language-service/README.md:399-430` explicitly lists these outside current scope | These are not missing implementation bugs for the current editor-intelligence boundary; minimal navigation is tracked separately above | future IDE/LSP | future product contract | Do not represent as current capability until a consumer/contract is approved |
| Official LSP server/transport | `❌` | No LSP server entrypoint in package files; README roadmap lists “LSP server resmi” as future | Library exposes types/methods but not a process/transport server | future VS Code/LSP host | host protocol and lifecycle decision | Keep as future surface; add only with explicit server contract |
| Package version/docs consistency | `✔️` | `package.json`, README, and compatibility metadata agree on `0.5.1`; focused API/version test passes | Packed/registry/public artifact verification remains outside this audit | npm users, docs readers, release gate | release/version policy | Retain public artifact check at release boundary |
| Language-service build/test/lint and consumer evidence | `✔️` | language-service `npm test && npm run lint && npm run build` (90 tests); Playground same command (106 tests); Markdown consumers 9 + 6 tests; CLI 36 tests; schema drift and local conformance pass | Browser/public/registry/current CI remain not verified; current MCP Dart rerun is environment-unavailable because Flutter attempted a denied engine-stamp update | root integration, Playground, MCP | dist artifacts, core package, fixture runner | Re-run canonical Node >=24, browser smoke, and Dart analyzer in an environment with writable telemetry/config |

## Priority order

1. Decide whether `getDiagnostics` remains structural/validation-only or gains a
   separate post-resolve violation API.
2. Add direct hover tests and extend the active-spec drift checker to generated
   field/parameter evidence.
3. Wire the minimal navigation result to a Playground source-jump action and
   add an end-to-end worker stale-result assertion.
4. Keep official LSP, formatting, refactoring, rename, and incremental parsing
   outside the current contract until a consumer owner/core index contract is assigned.
