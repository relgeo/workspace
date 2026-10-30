# RelGeo language-service capability matrix

> **Coverage statement — 2026-10-29.** This matrix covers the language-service
> API and its core/Playground consumer boundary using source modules, tests,
> schema/completion/token data, package metadata, shared fixtures, and docs
> wiring. It inventories diagnostics, schema, tokens, completion, hover, and
> version vocabulary; it does not claim parity for every normative function or
> editor host. Current CI/canonical, registry/public, and fresh browser/AT
> checks remain `not verified` where stated; a missing row is not evidence of
> absence.
> See [inventory protocol](../INVENTORY-PROTOCOL.md) for status axes and evidence tiers.

Status dokumen: audit baseline, 2026-10-29  
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
| Parse/validation diagnostics with LSP-compatible range, code, source, severity | `✔️` | `service.ts:123-207`; tests for syntax, missing fields, invalid expressions, path mapping; 66/66 | Diagnostics are line-oriented and emit `Error` severity; warning/info policy is not represented | Playground editor, future editor adapters, conformance runner | core parser/Validator, `vscode-languageserver-types` | Add shared diagnostic catalog and severity policy if consumers need it |
| Diagnostics for invalid YAML, version, references, constraints, and schema fields | `✔️` | `service.ts:158-207`; invalid fixtures 11–13 and 17–18; conformance checks | One thrown validation/parser error is converted per call; exhaustive multi-error collection is not proven | language-service, Playground, CLI indirectly | core validation/error model | Add multi-error fixture only if editor contract requires aggregation |
| Runtime/post-resolve violation diagnostics | `🌗` | `service.ts` calls `parseRelGeo(..., validate)` and `Validator.validate`, but not `resolveGeometry`; fixture 14 expects language service to accept the structurally valid runtime violation | Runtime `ConstraintViolation` is represented by core/Playground resolved data, not returned by `getDiagnostics` | Playground inspector, core, renderer | resolver constraint processing and diagnostic mapping | Decide whether runtime violations belong in this API; add a separate method/fixture if yes |
| JSON Schema export for document/object/parameter/view/sheet/presentation vocabulary | `✔️` | `src/schema.ts:1-590`; tests for version, metadata, sheet placement, repeat, split | Schema is a constant export; no schema validator runner checks every branch against parser | editors, schema-aware YAML tooling | spec/core field vocabulary | Add schema-vs-spec/core drift checker |
| Documented `langService.getSchema()` method | `⚠️` | README `language-service/README.md:327-334` documents method; `src/service.ts` has no `getSchema()` method; `RELGEO_SCHEMA` is exported separately | Consumer following README gets a missing method; source and docs disagree | editor integrators | public API/docs alignment | Either add method or correct README and add API test |
| Context-aware completion for root, object types, fields, placement, metadata, geometry functions | `✔️` | `completions.ts:3-517`; `service.ts:287-552`; 66/66 tests | Completion is heuristic/indent-based rather than a full YAML AST/LSP completion engine | Playground CodeMirror, editor integrations | completion catalogs, core/spec vocabulary | Keep representative context fixtures and document heuristic boundary |
| Object/reference/anchor completion for quoted IDs, components, repeats, path contexts | `✔️` | tests for punctuation-heavy IDs, component exports, indexed repeats, `point.on.path`, `along.target` | Object ID-level suggestions intentionally return empty (`service.ts:523-525`) | Playground, editor | source scanning and parsed editor document | Add bounded ID completion if consumer demand requires it |
| Semantic tokenization with geometry/presentation/layout/function/unit categories | `✔️` | `tokens.ts:10-543`; token classification test; conformance token checks | Token spans are custom RelGeo lines, not standard LSP semantic-token integer arrays | remark-relgeo-hl, Playground syntax surface | completion vocabulary, tolerant source tokenizer | Keep token kind vocabulary synchronized with spec |
| Hover for object type/resolved value/anchors/scalars | `🌗` | `service.ts:217-281`; Playground `Editor.tsx:65-89` wires hover | No direct language-service hover tests; only selected object/property shapes resolve and malformed/incomplete docs fall back to null | Playground, editor | core editor-mode resolver | Add hover tests for valid/incomplete/quoted IDs and document support boundary |
| Playground editor integration: diagnostics, completion, hover | `🌗` | `playground/src/components/Editor.tsx:1-89,107-120`; package dependency | Source wiring exists; current browser/E2E execution was not run in this audit | Playground users | CodeMirror, language-service dist, browser bundle | Re-run browser smoke and record current build/commit |
| Normative language ownership and package semantics | `➖` | `docs/REPOSITORY-MAP.md:9-16,51-74`; `spec/id/` ownership; README relationship with core | Language-service mirrors/consumes vocabulary; it is not the normative source | spec, core, all editor consumers | spec revision and compatibility matrix | Keep schema/completions as generated/checked consumer views |
| Formatting, refactoring, rename, semantic navigation, incremental parsing, collaborative editing | `➖` | `language-service/README.md:399-430` explicitly lists these outside current scope | These are not missing implementation bugs for the current editor-intelligence boundary | future IDE/LSP | future product contract | Do not represent as current capability until a consumer/contract is approved |
| Official LSP server/transport | `❌` | No LSP server entrypoint in package files; README roadmap lists “LSP server resmi” as future | Library exposes types/methods but not a process/transport server | future VS Code/LSP host | host protocol and lifecycle decision | Keep as future surface; add only with explicit server contract |
| Package version/docs consistency | `⚠️` | `package.json:3` and `docs/compatibility-matrix.json:100-105` say `0.5.1`; `README.md:7` still says `0.5.0` | Stale package metadata can mislead consumers about patch release provenance | npm users, docs readers, release gate | release/version policy | Update README version and add compatibility metadata check |
| Language-service build/test/lint and shared fixture evidence | `✔️` | test `66/66`; lint PASS; build PASS; conformance `260/260`; fixtures 10, 11–20 | Local toolchain is Node `22.23.2` while repository requires `>=24`; registry/current remote CI not rerun | root integration, Playground, remark plugin | dist artifacts, core package, fixture runner | Re-run canonical Node >=24 and registry/public gate |

## Priority order

1. Resolve the documented `getSchema()` API mismatch and stale `0.5.0` README
   version before claiming documentation/API parity.
2. Decide whether `getDiagnostics` remains structural/validation-only or gains a
   separate post-resolve violation API.
3. Add direct hover tests and schema-vs-core/spec drift checks.
4. Keep official LSP, formatting, refactoring, rename, and incremental parsing
   outside the current contract until a consumer owner is assigned.
