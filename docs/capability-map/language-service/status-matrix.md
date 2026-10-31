# Language-Service Status Matrix

> **Coverage statement — 2026-10-30.** Matrix ini adalah view capability-first
> dari seluruh 33 expected ID. Status berasal dari
> [expected-versus-observed reconciliation](./reconciliation.md);
> detail discovery dan source evidence tetap berada di
> [implementation audit evidence](./implementation-audit.md), with the archived
> audit retained for historical rows. Current MCP host/runtime deltas are
> checkpointed in LS-CONS-003/004; language-service semantic adapter coverage
> remains partial.
> Matrix ini tidak menggantikan katalog expected, audit, atau backlog gap. Setiap baris adalah satu capability yang bermakna bagi pengguna; kolom audit trace menunjuk ke bukti implementasi yang tepat.

Owner surface: relgeo/language-service  
Compatibility line: RelGeo DSL 0.5 / package 0.5.1  
Policy evidence: [maturation master plan](../../MATURATION-MASTER-PLAN.md) · [compatibility matrix](../../compatibility-matrix.json)

## Status and evidence legend

| Status | Meaning |
| --- | --- |
| ✔️ | Implemented on the stated boundary with direct evidence. |
| 🌗 | Partial implementation, coverage, result shape, or consumer contract. |
| ❌ | Expected capability absent on the stated implementation boundary. |
| ➖ | Not applicable to this boundary because the catalog assigns it to a host/consumer owner. |
| ⏸️ | Deferred or held by an explicit roadmap/dependency decision. |
| ⚠️ | Confirmed mismatch or broken contract at the source/docs/consumer boundary. |

Evidence status is separate from capability status. Local tests passing does
not establish registry, current CI, browser, public, or native-host evidence.

## Capability-first matrix

| ID / capability | Status | Evidence | Gap / limitation | Owner | Dependency | Risk | Next action | Audit trace |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| LS-DIAG-001 Structured diagnostic envelope | ✔️ | service diagnostic fields; local service tests; MCP DTO mapping | Origin/provenance is not in the service result | language-service | core error model; typed diagnostic types | P1 consumer interpretation drift | Define shared origin/provenance extension if protocol requires it | [audit](./archive/implementation-audit-legacy.md#ls-diag-001) |
| LS-DIAG-002 Syntax diagnostics for incomplete source | 🌗 | bounded core diagnostic aggregation; 75 service tests; 260 conformance checks | Independent diagnostics are preserved, but broad incomplete-source recovery remains partial | language-service + core | parser recovery and error ordering | P1 poor edit-time recovery | Expand incomplete-input matrix and aggregation policy | [audit](./implementation-audit.md#selected-capability-findings) |
| LS-DIAG-003 Semantic/reference diagnostics | ✔️ | core Validator; fixtures/tests for references and expressions | Full error-catalog parity is not proven | core + language-service | core semantic codes; spec error model | P1 code drift | Compare emitted codes with normative catalog | [audit](./archive/implementation-audit-legacy.md#ls-diag-003) |
| LS-DIAG-004 Post-resolve geometry/constraint diagnostics | 🌗 | core/Playground fixture 14 and inspector path; getDiagnostics does not resolve geometry | Runtime violations are not returned by the structural service API | core + language-service | resolver and violation DTO decision | P1 runtime failures can be disconnected from editor diagnostics | Decide API boundary; add method and fixture if in scope | [audit](./archive/implementation-audit-legacy.md#ls-diag-004) |
| LS-VAL-001 Structural and typed validation | ✔️ | validator path; invalid fixtures 11–13 and 17–18 | Exhaustive schema/spec drift check is missing | core + language-service | spec document structure; validator | P1 vocabulary drift | Add schema-versus-spec drift check | [audit](./archive/implementation-audit-legacy.md#ls-val-001) |
| LS-VAL-002 Core-backed semantic validation boundary | 🌗 | service and Playground worker use core parse/resolve validation | Service result can be consumed before full resolve; boundary is not one API | core + consumer owners | resolve contract; worker lifecycle | P1 inconsistent validity claims | Define explicit validate-only versus resolve-ready result | [audit](./archive/implementation-audit-legacy.md#ls-val-002) |
| LS-SCHEMA-001 Versioned JSON Schema export | ✔️ | schema export, index export, version tests, local build | Published package boundary not verified | language-service | spec version policy; package exports | P1 published artifact mismatch | Verify packed/published schema under canonical environment | [audit](./archive/implementation-audit-legacy.md#ls-schema-001) |
| LS-SCHEMA-002 Active typed geometry vocabulary coverage | 🌗 | bounded schema drift checker; clean and mutation tests | Generated all-spec coverage proof remains open | language-service + spec | spec chapters; core types | P1 editor accepts/omits valid fields incorrectly | Connect checker to generated active-spec vocabulary evidence | [audit](./implementation-audit.md#selected-capability-findings) |
| LS-TOKEN-001 Context-preserving tokenization | ✔️ | token source; Markdown tests; root conformance token checks | Custom line/token model is not standard LSP semantic-token encoding | language-service | tolerant lexer; token vocabulary | P2 adapter conversion cost | Document token DTO and keep vocabulary synchronized | [audit](./archive/implementation-audit-legacy.md#ls-token-001) |
| LS-COMP-001 Structural/context-aware completion | ✔️ | completion catalogs; service methods; root/service tests | Heuristic indentation/source scan is not full AST completion | language-service | schema and source context | P1 edge-context suggestions | Preserve representative context fixtures | [audit](./archive/implementation-audit-legacy.md#ls-comp-001) |
| LS-COMP-002 Geometry-aware semantic completion | 🌗 | bounded object-reference/object-context items with replacement ranges | Full AST/semantic-index context remains open | language-service + core | semantic index; object identity | P1 missing high-value suggestions | Extend semantic-context coverage only with an agreed index contract | [audit](./implementation-audit.md#selected-capability-findings) |
| LS-COMP-003 Completion under partial/error state | 🌗 | blank-line, quoted-ID, incomplete-expression, and `typ:` typo tests | Selected recovery contexts pass; all parser-error shapes remain open | language-service | tolerant parser; recovery behavior | P1 editing dead ends | Add fixtures for remaining supported partial contexts | [audit](./implementation-audit.md#selected-capability-findings) |
| LS-HOVER-001 Syntax and field documentation hover | 🌗 | service hover path; Playground tooltip wiring | No direct hover tests or complete syntax/field documentation catalog | language-service | documentation source/provenance | P1 misleading or empty help | Add valid/incomplete/field/enum hover tests | [audit](./archive/implementation-audit-legacy.md#ls-hover-001) |
| LS-HOVER-002 Semantic metadata and inspection result | 🌗 | getHover resolve path; Playground inspector; MCP metadata DTO | Result metadata lacks complete provenance and bounded semantic shape | language-service + core | resolved object metadata; provenance DTO | P1 consumers overclaim semantic certainty | Define metadata/provenance result schema and snapshots | [audit](./archive/implementation-audit-legacy.md#ls-hover-002) |
| LS-RANGE-001 Exact ranges for editor results | 🌗 | diagnostic/token/completion/hover range tests | Metadata and semantic-reference range coverage remains open | language-service | source-location policy; editor positions | P1 inaccurate highlight/replacement | Extend range contract to metadata and semantic-reference results | [audit](./implementation-audit.md#selected-capability-findings) |
| LS-RANGE-002 Source-to-semantic navigation | ❌ | Audit found no navigation/definition/reference-location API; host source jump only | Semantic navigation is absent at language-service boundary | language-service + host | source identity/range contract | P1 editor cannot reliably jump from semantic result | Define navigation DTO and implement one reference/definition path | [audit](./archive/implementation-audit-legacy.md#ls-range-002) |
| LS-DOC-001 Editor-agnostic document analysis API | ✔️ | plain input/output service; UI-independent exports; local build | No official LSP server is implied by this library API | language-service | typed public exports; core | P1 integration assumptions | Preserve editor-agnostic API and add contract smoke test | [audit](./archive/implementation-audit-legacy.md#ls-doc-001) |
| LS-DOC-002 Document update lifecycle | 🌗 | Playground editor/worker update-to-analysis flow | Service is stateless; no explicit document/session lifecycle API | language-service + Playground | document identity/version decision | P1 stale or disconnected results | Define request lifecycle DTO before session implementation | [audit](./archive/implementation-audit-legacy.md#ls-doc-002) |
| LS-DOC-003 Document/session identity and dirty state | ➖ | Identity is in Playground persistence/App and MCP/Flutter DTOs | Host-owned by catalog decision; not internal service work | Playground/MCP/Flutter | host session model | P1 only if adapters lack consistent DTO | Keep host contract linked and test adapter boundary | [audit](./archive/implementation-audit-legacy.md#ls-doc-003) |
| LS-INCR-001 Incremental or bounded re-analysis | ❌ | No cache, edit-range API, incremental parser, or retained state found | Service reparses/scans on each call | language-service + host worker | performance target; document edit model | P1 responsiveness on larger documents | Choose bounded strategy and add edit-sequence benchmark/test | [audit](./archive/implementation-audit-legacy.md#ls-incr-001) |
| LS-INCR-002 Stale-result suppression and ordering | 🌗 | serializable service protocol/document/version/request identity plus Playground stale guard | Playground still owns ordering enforcement; full service-to-worker assertion remains open | language-service + Playground | document version/request identity | P1 old result can cross API boundary | Add service-to-worker integration assertion before adapter rollout | [audit](./implementation-audit.md#selected-capability-findings) |
| LS-VERS-001 Version acceptance vocabulary | ✔️ | schema enum; core policy; fixtures 17–18; conformance | Output provenance is not attached to the accepted version | spec + language-service | compatibility policy; version parser | P1 inconsistent migration messaging | Keep active/legacy/future regression fixtures | [audit](./archive/implementation-audit-legacy.md#ls-vers-001) |
| LS-VERS-002 Version/revision/provenance on results | ❌ | No specVersion, revision, sourceUrl, or provenance in service result types | MCP documentation DTO is not wired into service results | language-service + protocol owners | provenance policy; result DTO | P1 evidence and docs cannot be traced | Define minimal provenance fields and add serialization tests | [audit](./archive/implementation-audit-legacy.md#ls-vers-002) |
| LS-PROTO-001 Typed editor result protocol | 🌗 | LSP-compatible Diagnostic/CompletionItem/Hover types and exports | No unified DTO for all result families; no official server/transport | language-service | result/range/provenance decisions | P1 adapter duplication and shape drift | Publish versioned unified read-only result contract | [audit](./archive/implementation-audit-legacy.md#ls-proto-001) |
| LS-PROTO-002 Safe serialization and capability boundaries | 🌗 | Serializable service methods; MCP local Streamable HTTP and permission boundary are implemented | Cross-package semantic DTO round-trip and packaged/cross-host transport evidence remain open | language-service + MCP | MCP security contract; typed DTO | P1 unsafe or lossy integration | Add serialization/property tests for semantic adapter before expanding tool scope | [audit](./archive/implementation-audit-legacy.md#ls-proto-002) |
| LS-REC-001 Actionable recovery for invalid/partial source | 🌗 | editor fallback, diagnostics/completion fallback, host restore-last-successful flow | No complete recovery action/state taxonomy in service result | language-service + Playground | error phase and recovery DTO | P1 editor loses useful context during errors | Define recovery states and test invalid-to-valid edit sequence | [audit](./archive/implementation-audit-legacy.md#ls-rec-001) |
| LS-REC-002 Preserve last valid consumer state | ➖ | Playground stores last successful render/code and retains snapshot on worker error | Host/UI responsibility by catalog decision | Playground/host | preview state and worker lifecycle | P1 preview regression if host contract is missed | Keep host acceptance test separate from service backlog | [audit](./archive/implementation-audit-legacy.md#ls-rec-002) |
| LS-REC-003 Distinguish parser, validation, runtime, and storage errors | 🌗 | parser/validator codes and Playground storage/share messages inspected | No canonical origin taxonomy across service and host | spec/core + consumer owners | error origin vocabulary | P1 users cannot choose correct recovery action | Define cross-boundary error-origin mapping | [audit](./archive/implementation-audit-legacy.md#ls-rec-003) |
| LS-CONS-001 Playground editor integration | 🌗 | Editor wires diagnostics/completion/hover; Playground tests 93 pass | Browser/public execution not verified | Playground + language-service | browser bundle; worker lifecycle | P1 local wiring may diverge from shipped path | Run current browser smoke and record artifact revision | [audit](./archive/implementation-audit-legacy.md#ls-cons-001) |
| LS-CONS-002 Markdown consumer integration | 🌗 | remark-relgeo-hl tests 3/3; root conformance highlighting passes | Service failure path lacks source-preserving fallback | remark-relgeo-hl | token DTO; plugin error handling | P1 docs build can fail on malformed input/service error | Add try/catch fallback and failure-injection test | [audit](./archive/implementation-audit-legacy.md#ls-cons-002) |
| LS-CONS-003 MCP semantic language-service integration | 🌗 | MCP full-spec search, resources, and active-document tools are callable; Flutter hosts loopback Streamable HTTP | Core-backed semantic validation, diagnostics mapping, completion, and rendering are not wired through MCP | MCP + language-service + core | semantic result/provenance DTOs and MCP tool contract | Agents cannot yet validate or author through the full semantic pipeline | Define the smallest read-only semantic adapter and add MCP/core fixtures | [audit](./archive/implementation-audit-legacy.md#ls-cons-003) |
| LS-CONS-004 Desktop active-document integration | 🌗 | Flutter-hosted MCP reads active source/revision/dirty state and supports opt-in bounded edit with stale guard and undo | Live ChatGPT Desktop write round-trip and language-service session API remain unverified/not implemented | Flutter/MCP + language-service | host session, stale guard, and semantic service contract | Desktop agent edits may not pass through semantic validation | Verify client write interoperability; keep semantic service integration as separate work | [audit](./archive/implementation-audit-legacy.md#ls-cons-004) |
| LS-CONS-005 Package/docs compatibility provenance | ✔️ | README `0.5.1`, implemented `getSchema()`, API/version regression test | Local source/API contract is repaired; packed/registry/public delivery remains unverified | language-service owner | release/version policy; API decision | P0 consumers follow invalid public contract | Retain closed local evidence; verify packed/public artifact in release environment | [audit](./implementation-audit.md#selected-capability-findings) |

## Verification boundaries

- Local service tests, lint, build, shared fixtures, Markdown tests, and
  Playground unit tests were run in the current audit; their results are
  linked from the [implementation audit](./implementation-audit.md).
- Node 22 was used locally while the repository asks for Node 24 or newer.
  Registry install, current CI, public Playground, browser E2E, and native
  accessibility remain evidence limitations, not automatic implementation
  failures.
- The [implementation-gap backlog](./implementation-gap-backlog.md)
  contains one candidate task for every partial, absent, and confirmed broken
  expected capability. Editing either document does not close a gap.

## Linked artifacts

- [Expected catalog](./expected-capability-catalog.md)
- [Implementation audit](./implementation-audit.md)
- [Historical implementation audit](./archive/implementation-audit-legacy.md)
- [Expected-versus-observed reconciliation](./reconciliation.md)
- [Implementation-gap backlog](./implementation-gap-backlog.md)
- [Historical capability matrix](./capability-matrix.md)
- [Maturation master plan](../../MATURATION-MASTER-PLAN.md)
- [Compatibility matrix](../../compatibility-matrix.json)
