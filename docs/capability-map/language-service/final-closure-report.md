# Language Service final closure report

Date: 2026-11-08  
Scope: local Language Service contract and verified Core, CLI, Markdown,
Playground, and MCP typed-consumer boundaries.

This report is a closure-scope decision, not a release or deployment claim.
The expected catalog remains authoritative and all 33 IDs remain represented.

## Before / after

| Status | Before | After | Meaning |
| --- | ---: | ---: | --- |
| `✔️` implemented | 18 | 22 | Direct source and regression/consumer evidence exists. |
| `🌗` partial | 12 | 0 | Every former partial is either closed locally or explicitly held/host-owned. |
| `❌` absent | 0 | 0 | No capability was hidden or relabeled as evidence-only. |
| `⚠️` broken | 0 | 0 | No declared local contract mismatch remains. |
| `⏸️` deferred | 1 | 8 | Named dependency, roadmap, or unavailable host boundary. |
| `➖` not applicable | 2 | 3 | Catalog assigns ownership to a host consumer. |

## Per-ID closure evidence

Every row has an implementation source, verification evidence, owner, and
remaining limitation or explicit scope decision. The status matrix remains the
canonical full-width view; this table is the final audit index.

| ID | Status | Implementation source | Verification / evidence | Owner and remaining decision |
| --- | --- | --- | --- | --- |
| LS-DIAG-001 | ✔️ | `language-service/src/service.ts`, `core/src/diagnostics.ts` | Service/Core tests; MCP DTO mapping | Language-service owns projection; Core owns semantic meaning. |
| LS-DIAG-002 | ⏸️ | `language-service/src/service.ts` | 102 service tests; 677 conformance assertions | Hold broad incomplete-source recovery for the Core parser recovery contract. |
| LS-DIAG-003 | ✔️ | `core/src/diagnostics.ts`, `language-service/src/service.ts` | Invalid/reference fixtures and service tests | Core remains semantic authority. |
| LS-DIAG-004 | ✔️ | `language-service/src/service.ts` | Post-resolve diagnostic tests with phase, severity, range, and provenance | Host runtime presentation remains consumer-owned. |
| LS-VAL-001 | ✔️ | `core/src/validation.ts`, `language-service/src/service.ts` | Validator and invalid-fixture tests | Core owns validation semantics. |
| LS-VAL-002 | ✔️ | `language-service/src/service.ts`, `language-service/src/protocol.ts`, `playground/src/worker.ts` | Structural/semantic/resolve-ready target tests and worker readiness tests | Explicit readiness contract closes the local boundary. |
| LS-SCHEMA-001 | ✔️ | `language-service/src/schema.ts`, `language-service/src/index.ts` | Schema/API/version tests and build | Registry publication remains separate evidence. |
| LS-SCHEMA-002 | ✔️ | `language-service/src/schema-drift.ts`, `scripts/check-language-service-schema-drift.mjs` | Normative-spec drift checker and mutation test | Spec remains vocabulary authority. |
| LS-TOKEN-001 | ✔️ | `language-service/src/tokens.ts`, `remark-relgeo-hl/src/` | Markdown tests and root conformance | Custom token DTO is documented; LSP encoding is not claimed. |
| LS-COMP-001 | ✔️ | `language-service/src/completions.ts`, `language-service/src/service.ts` | Completion catalog/service tests | Heuristic bounded completion is the declared contract. |
| LS-COMP-002 | ⏸️ | `language-service/src/completions.ts`, `language-service/src/service.ts` | Object-reference/context completion tests | Full AST/semantic-index suggestions await a Core index contract. |
| LS-COMP-003 | ⏸️ | `language-service/src/service.ts` | Partial/error completion fixtures | Exhaustive parser-error coverage is held at the parser boundary. |
| LS-HOVER-001 | ✔️ | `language-service/src/service.ts`, `language-service/src/completions.ts` | Syntax/type/enum/incomplete-source hover tests | Unknown symbols intentionally return no result. |
| LS-HOVER-002 | ✔️ | `language-service/src/service.ts`, `language-service/src/protocol.ts` | Bounded metadata/provenance/range tests | Geometry values remain Core-owned. |
| LS-RANGE-001 | ✔️ | `language-service/src/protocol.ts`, `language-service/src/service.ts` | UTF-16 range tests across all result families | Host rendering cannot discard ranges. |
| LS-RANGE-002 | ➖ | `language-service/src/service.ts`, `language-service/src/protocol.ts` | Navigation definition/reference tests | Source-jump action is explicitly Playground host scope. |
| LS-DOC-001 | ✔️ | `language-service/src/index.ts`, `language-service/src/service.ts` | Public API smoke, lint, and build | No LSP server is implied. |
| LS-DOC-002 | ✔️ | `language-service/src/document.ts`, `language-service/src/protocol.ts` | Lifecycle/version/publication tests | Host persistence remains outside the service. |
| LS-DOC-003 | ➖ | `playground/src/persistence.ts`, `mcp/lib/src/contract/` | Host identity/dirty/revision tests | Catalog assigns session storage to hosts. |
| LS-INCR-001 | ⏸️ | `language-service/src/analysis.ts`, `language-service/src/document.ts` | Ranged edit and measured fallback tests | Semantic incrementality awaits a Core dependency/index contract. |
| LS-INCR-002 | ✔️ | `language-service/src/protocol.ts`, `playground/src/worker-lifecycle.ts` | Stale identity, cancellation, restart, and ordering tests | Browser/public execution is evidence-only follow-up. |
| LS-VERS-001 | ✔️ | `language-service/src/protocol.ts`, `core/src/` | Active/legacy/future version fixtures | Compatibility policy remains normative. |
| LS-VERS-002 | ✔️ | `language-service/src/protocol.ts`, `playground/src/worker.ts`, `mcp/lib/src/contract/`, `fixtures/expected/language-service-protocol.v0.5.json` | 120-check consumer audit, fixture, and direct adapter tests | Registry/native delivery remains outside local closure. |
| LS-PROTO-001 | ✔️ | `language-service/src/protocol.ts` | Typed result-family and lifecycle tests | Official LSP transport is out of scope. |
| LS-PROTO-002 | ⏸️ | `language-service/src/protocol.ts`, `mcp/lib/src/adapter/local_dispatch.dart` | TypeScript JSON tests, fixture, 45 direct Dart tests | Semantic MCP adapter and packaged cross-host transport await a separate contract. |
| LS-REC-001 | ✔️ | `language-service/src/protocol.ts`, `playground/src/worker.ts` | Invalid/partial/recovered/stable worker fixtures | Last-valid preview is host-owned. |
| LS-REC-002 | ➖ | `playground/src/playground-display-state.ts` | Last-valid snapshot tests | Catalog assigns this UI state to Playground/host. |
| LS-REC-003 | ⏸️ | `core/src/diagnostics.ts`, `playground/src/`, `mcp/lib/src/` | Existing phase/origin fields and consumer checks | Canonical storage/runtime taxonomy awaits spec/core/host decision. |
| LS-CONS-001 | ✔️ | `playground/src/worker.ts`, `playground/src/worker-lifecycle.ts`, `playground/src/components/Editor.tsx` | 119 Playground tests, lint, build, provenance | Browser bind/public delivery remains unavailable evidence. |
| LS-CONS-002 | ✔️ | `remark-relgeo-hl/src/index.ts`, `remark-relgeo-hl/src/render.ts` | 10 Vitest + package-boundary test; 18 remark-relgeo tests; conformance | Tolerant/strict source-preserving fallback is implemented. |
| LS-CONS-003 | ⏸️ | `mcp/lib/src/adapter/local_dispatch.dart`, `mcp/lib/src/contract/mcp_schema.dart` | 45 direct Dart tests and typed protocol checker | Full Core-backed semantic MCP adapter is separate held scope. |
| LS-CONS-004 | ⏸️ | `mcp/lib/src/contract/session_bridge.dart`, `mcp/lib/src/adapter/local_dispatch.dart` | Local active-document/guarded-edit tests | Live Desktop client and packaged native host are unavailable here. |
| LS-CONS-005 | ✔️ | `language-service/README.md`, `language-service/src/index.ts`, `language-service/package.json` | API/version regression, local build, package boundary | Registry/public artifact remains release evidence. |

## Verification record

- `npm run language-service:consumer:check`: 120 assertions passed.
- `node scripts/run-conformance-fixtures.mjs`: 677 assertions passed across
  33 fixtures.
- Language Service, CLI, Core, Markdown, Playground, and direct MCP test/build
  commands passed as recorded in the [implementation audit](./implementation-audit.md#consumer-verification-handoff--2026-11-07).
- Required workspace gate outcomes are recorded in the [workspace gate
  evidence](./implementation-audit.md#workspace-gate-evidence--2026-11-08):
  compatibility and 677-fixture conformance passed; strict baseline remained
  blocked by the intentional dirty submodule worktrees; local/public
  integration were environment-unavailable before stages on Node 22.23.2.
- Playground browser E2E was attempted but is `environment unavailable` because
  the host denied binding `127.0.0.1:4173` with `EPERM` before page creation.

No npm/pub.dev publish, production deployment, registry install, or unavailable
host OS is a prerequisite for this declared local closure.
