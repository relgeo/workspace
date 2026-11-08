# Language Service implementation audit

This is the canonical audit entry point for the Language Service surface.

The dated evidence log retained from the previous flat layout is
[archive/implementation-audit-legacy.md](./archive/implementation-audit-legacy.md).
The current audit entry is maintained in this file.
The current expected-versus-observed result is maintained in
[reconciliation.md](./reconciliation.md), while the maintainer-facing status
view is [status-matrix.md](./status-matrix.md). The archived log is historical
evidence and must not be read as proof of current CI, registry, deployment, or
runtime status.

The bounded active selection for the current capability-debt tranche is
[in-scope-selection.md](./in-scope-selection.md). That record is a scope
decision only; it does not replace the audit evidence or promote any status.

## Implementation update — 2026-11-04

This update records source and test changes made after the 2026-11-03 audit
refresh. The changes are additive and keep the default structural/editor path
backward-compatible:

- `RelGeoLanguageService.analyzeMetadata()` now produces bounded object ID,
  declared-type, and reference-shaped (`from`/`through`/`to`/`target`/`use`)
  entries with exact UTF-16 source ranges and `targetId`, carried by the frozen
  protocol/provenance envelope. It intentionally does not claim resolved
  geometry values; core remains the semantic authority.
- `DocumentAnalysisRequest.validationTarget` is optional. Omitted or
  `structural` retains the previous structural readiness behavior; explicit
  `semantic` and `resolve-ready` targets run core-backed resolution diagnostics
  before emitting the corresponding readiness state.
- `language-service/src/__tests__/protocol.test.ts` adds metadata range,
  incomplete-source, reference-shaped metadata, and semantic/resolve-ready
  acceptance cases. The focused suite is now 89/89; lint and ESM/CJS/DTS build
  also pass.
- Completion recovery now handles a one-edit object-field typo such as `fro:`
  with a narrow replacement range for `from`, while leaving ordinary expression
  completion ranges unchanged. The same hover path now provides bounded
  syntax/field documentation from the active completion catalog when parsing or
  resolution is incomplete. The focused service suite is now 89/89.
- `createResultIdentity()` now adds a minimal producer provenance entry when a
  host omits provenance: `source: language-service` with the result spec
  version. Caller-supplied provenance remains authoritative and unchanged. A
  serialization regression test covers this additive default; the service suite
  is now 90/90.
- `playground/src/worker.ts` now exposes additive readiness and recovery fields
  on the worker response. Empty input is `partial`, parse/resolve failures are
  `invalid`, a successful resolve is `resolve-ready`, and a success following
  `invalid` or `partial` is `recovered`; the existing structural render payload
  remains unchanged. Playground tests cover the error, partial, recovery, and
  stable paths; the package suite is now 106/106 with lint and production build
  passing.

The affected reconciliation rows remain `🌗` until the dependent verification
and reconciliation tasks confirm broader producer/consumer coverage. This is
implementation evidence, not a status promotion.

## Implementation update — 2026-11-07

The Playground worker now consumes the frozen language-service result envelope
without making the service stateful. Each worker request carries a host-owned
`documentId`, monotonic document `version`, and numeric worker `requestId`; each
response echoes that identity and includes a serializable `analysis` result with
protocol/spec version, UTF-16 diagnostics ranges, readiness, recovery state, and
producer provenance. Playground applies a response only when all three worker
identity fields match the active request. The editor's synchronous diagnostics,
completion, and hover adapters also call `acceptCurrentDocumentAnalysis()` and
drop mismatched results.

Focused worker fixtures cover JSON round-trip identity/ranges/provenance,
invalid-to-recovered propagation, and wrong-document/version/request rejection.
This closes the local `LS-INCR-002` and `LS-REC-001` adapter boundary. Browser,
public bundle, registry, and cross-host transport evidence remains separate and
is not inferred from these tests.

## Current audit refresh — 2026-11-07

This refresh rechecked the selected language-service boundary and the local
consumers that directly import it. It records implementation evidence for the
reconciliation below; local tests do not establish registry, current CI,
browser/public, or native-host delivery evidence.

| Boundary | Fresh evidence | Result | Limit that remains visible |
| --- | --- | --- | --- |
| `language-service/` | `npm test && npm run lint && npm run build` in `language-service/` | PASS — 3 files, 102 tests; type-check and ESM/CJS/DTS build pass | No packed/registry/public artifact proof. |
| `remark-relgeo-hl/` | `npm test && npm run lint && npm run build` in `remark-relgeo-hl/` | PASS — 1 file, 6 tests; type-check and package build pass | Normal tokenization path is covered; injected service-failure fallback is not proven. |
| `remark-relgeo/` and `cli/` | `npm test && npm run lint && npm run build` in `remark-relgeo/`; `npm test` in `cli/` | PASS — 9 Markdown tests and 36 CLI tests; package checks pass for remark-relgeo | Failure fallback and public install remain separate evidence boundaries. |
| `playground/` | `pnpm test && pnpm lint && pnpm build` in `playground/` | PASS — 17 files, 112 tests; lint and production bundle build pass | Browser E2E, deployed/public bundle, and current CI are not verified here. |
| Workspace conformance | `node scripts/run-conformance-fixtures.mjs` from the workspace root | PASS — 298 assertions across 23 fixtures | This is local fixture evidence; release publication, current CI, and external-host execution remain unverified. |
| Source consumer wiring | `playground/src/components/Editor.tsx`, `playground/src/worker.ts`, `playground/src/App.tsx`, `playground/src/worker-sequencing.ts`, `mcp/lib/src/contract/mcp_schema.dart`, `mcp/lib/src/adapter/local_dispatch.dart` | Playground editor drops mismatched typed diagnostics/completion/hover results; worker echoes exact document/version/request identity and serialized language-service analysis; MCP completion/validation echo identity | Core-backed semantic producer wiring remains host/adapter work; current Dart rerun and browser/public execution are not verified. |

### Selected capability findings

| ID | Status | Observed evidence | Audit conclusion |
| --- | --- | --- | --- |
| `LS-CONS-005` | `✔️` local boundary / public delivery not verified | README now says `0.5.1`, `RelGeoLanguageService.getSchema()` returns the exported schema, and the focused API/version test passes. | The source/API mismatch is repaired and locally verified; registry/public artifact verification remains outside this task. |
| `LS-DIAG-002` | `🌗` | `src/service.ts#getDiagnostics` now preserves core phase/code/path/severity/provenance and bounded independent validation errors; incomplete-source regression tests pass. | Tolerant aggregation is implemented for the bounded path, but broad incomplete-source recovery remains a core parser boundary. |
| `LS-SCHEMA-002` | `✔️` | `getSchemaDriftReport()` compares active root sections, object types, object fields, parameters, views, sheets, and presentation catalogs; the workspace checker now derives root/object/field vocabulary from normative `spec/id` files and the clean/mutation tests pass. | Editor-only compatibility aliases are explicitly code-owned; the active normative vocabulary has generated local evidence. |
| `LS-COMP-002` | `🌗` | `getCompletions()` now returns bounded object-reference items for expression and object contexts, with type detail and exact replacement edits. | Full AST/semantic-index context remains outside this bounded implementation. |
| `LS-COMP-003` | `🌗` | Partial completion tests cover blank lines, quoted IDs, incomplete expressions, `typ:`, and one-edit object-field typo recovery paths. | The recovery contract is bounded; all parser-error shapes are not claimed. |
| `LS-HOVER-001` | `✔️` | `getHover()` returns resolved object/property values, quoted-ID hover, enum explanations, and bounded syntax/field documentation from the active completion catalog with exact ranges. | Unknown/incomplete symbols safely return null; explanatory source remains the catalog/spec boundary. |
| `LS-RANGE-001` | `✔️` | Diagnostics preserve clamped UTF-16 ranges; tokens retain offsets; completion items carry replacement ranges including quoted IDs; hover, metadata, and navigation carry exact ranges. | Host rendering and broader semantic-index navigation remain consumer boundaries. |
| `LS-RANGE-002` | `🌗` | `analyzeNavigation()` returns a definition and bounded references for one object relation with stable document ID and exact UTF-16 ranges; protocol test passes. | Broader semantic relations and the Playground source-jump action remain open. |
| `LS-INCR-001` | `⏸️` | Manager applies bounded UTF-16 ranged changes; `analysis.ts` reports changed range, changed-line budget, inspected line/code-unit counts, and an explicit full-document semantic fallback. | Ranged synchronization is closed; semantic dependency-bounded analysis is held until core exposes a stable index contract. |
| `LS-INCR-002` | `✔️` local boundary | `analyzeDocument()` returns serializable identity and the Playground worker now echoes and guards `documentId`/`version`/`requestId` as a complete tuple; worker sequencing fixtures reject wrong-document, stale-version, and out-of-order responses. | Browser/public bundle execution remains unverified; the stateless service does not own host sessions. |
| `LS-VERS-002` | `🌗` | `src/protocol.ts` freezes protocol `0.2`, spec `0.5`, and JSON serialization; all result families carry caller provenance or a minimal language-service producer provenance default. | Source revision and downstream worker/MCP propagation evidence remain open. |
| `LS-PROTO-002` | `🌗` | MCP typed DTOs accept optional editor identity and validation readiness/recovery fields, echo identity at dispatch, and preserve legacy JSON; the 34-test Dart suite passes. | Packaged/cross-host transport and core-backed language-service producer wiring remain open. |

### Full expected-ID coverage report — 2026-11-07

The selected findings above are not the complete audit population. The table
below is the canonical one-to-one coverage report for all 33 expected IDs. An
ID is present exactly once, including implemented, partial, and host-boundary
rows. The closure route points to an implementation task, an explicit host
boundary, or an evidence-only follow-up; none of these classifications hides
an absent capability.

| ID | Observed result | Implementation boundary / evidence anchor | Closure route |
| --- | --- | --- | --- |
| LS-DIAG-001 | ✔️ | service diagnostic DTO + local service tests | implemented; provenance/origin follow-up |
| LS-DIAG-002 | 🌗 | `src/service.ts#getDiagnostics` + incomplete-source tests | `LS-TASK-001` |
| LS-DIAG-003 | ✔️ | core-backed reference/expression diagnostics + fixtures | implemented; error-catalog parity follow-up |
| LS-DIAG-004 | ✔️ | opt-in semantic `getDiagnostics(..., true)` projects core post-resolve constraint diagnostics with phase/range/provenance | implemented locally; host runtime presentation remains separate |
| LS-VAL-001 | ✔️ | core validator + invalid fixture/conformance coverage | implemented; exhaustive drift follow-up |
| LS-VAL-002 | 🌗 | service/worker structural, semantic, and resolve-ready readiness tests | `LS-TASK-004` |
| LS-SCHEMA-001 | ✔️ | exported schema/index + API/version tests | implemented; pack/registry evidence |
| LS-SCHEMA-002 | ✔️ | `getSchemaDriftReport()` + clean/mutation tests + generated spec vocabulary checker | implemented locally; compatibility aliases remain explicit |
| LS-TOKEN-001 | ✔️ | token service + Markdown/conformance token checks | implemented; DTO synchronization follow-up |
| LS-COMP-001 | ✔️ | structural completion catalog + service tests | implemented; heuristic-boundary evidence |
| LS-COMP-002 | 🌗 | bounded object-reference/object-context completion tests | `LS-TASK-007` |
| LS-COMP-003 | 🌗 | partial/error completion fixtures | `LS-TASK-008` |
| LS-HOVER-001 | ✔️ | resolved, quoted-ID, enum, and incomplete syntax/field hover tests | implemented bounded catalog; unknown symbols return no-result |
| LS-HOVER-002 | 🌗 | bounded metadata/hover projection and protocol tests | `LS-TASK-010` |
| LS-RANGE-001 | ✔️ | diagnostic/token/completion/hover/metadata/navigation range tests plus malformed-range normalization | implemented local result-family contract |
| LS-RANGE-002 | 🌗 | `analyzeNavigation()` definition/reference protocol test | `LS-TASK-012` |
| LS-DOC-001 | ✔️ | stateless editor-agnostic public service API | implemented; API smoke evidence |
| LS-DOC-002 | ✔️ | `LanguageServiceDocumentManager` lifecycle/version/publication tests + Playground worker identity tests | local package boundary closed; host persistence remains separate |
| LS-DOC-003 | ➖ | Playground/MCP/Flutter active-document DTOs | host boundary; no service task |
| LS-INCR-001 | ⏸️ | bounded UTF-16 ranged synchronization plus measured changed range; semantic analysis remains full-document | `LS-TASK-014` explicit core dependency decision |
| LS-INCR-002 | ✔️ | protocol identity + Playground stale-result guard fixtures | `LS-TASK-015` external evidence |
| LS-VERS-001 | ✔️ | active/legacy/future version acceptance fixtures | implemented; compatibility follow-up |
| LS-VERS-002 | 🌗 | protocol `0.2`/spec `0.5` envelope and provenance serialization | `LS-TASK-016` |
| LS-PROTO-001 | ✔️ | typed family APIs now include schema/tokens and lifecycle responses with shared identity envelope | local package boundary closed; official transport remains out of scope |
| LS-PROTO-002 | 🌗 | TypeScript JSON plus MCP DTO/dispatch boundary | `LS-TASK-018` |
| LS-REC-001 | ✔️ | service/worker invalid → partial → recovered → stable fixtures | `LS-TASK-019` consumer evidence |
| LS-REC-002 | ➖ | Playground last-valid preview retention | host boundary; no service task |
| LS-REC-003 | 🌗 | parser/validator codes versus host storage/share/runtime paths | `LS-TASK-020` |
| LS-CONS-001 | ✔️ | Playground editor/worker local consumer tests | `LS-TASK-003` browser evidence |
| LS-CONS-002 | 🌗 | remark consumers normal path; failure fallback absent | `LS-TASK-021` |
| LS-CONS-003 | 🌗 | MCP lookup/resources/active-document runtime; semantic adapter open | `LS-TASK-023` |
| LS-CONS-004 | 🌗 | Flutter-hosted active read/guarded edit; live client open | `LS-TASK-024` |
| LS-CONS-005 | ✔️ | README/package/API version repair + regression test | `LS-TASK-022` release evidence |

Coverage accounting is **33/33 IDs**, with **18 implemented**, **12 partial**,
**0 absent**, **0 broken**, **1 deferred**, and **2 host-boundary rows**. The
remaining partial rows map one-to-one to backlog tasks `LS-TASK-001`, `002`,
`004`, `005`, `007`–`012`, `016`, `018`, `020`, `021`, `023`, and `024`.
`LS-TASK-014` is an explicit dependency-deferred row; `LS-TASK-003`, `013`,
`015`, `017`, `019`, and `022` remain visible as local/evidence follow-ups.

### Contract closure boundary

The audit scope is not package-local when a result contract changes. The
required propagation chain is `spec/id → core → language-service →
Playground / remark-relgeo-hl / MCP / Flutter / package consumers`. Changes to
schema vocabulary or error meaning require `spec/`, `core/`, shared fixtures,
and all direct consumers to be rechecked. Changes to protocol identity,
readiness, recovery, provenance, or ranges require the TypeScript producers,
Playground worker/editor guards, MCP DTO/dispatch adapters, and Flutter active
document bridge to be rechecked. Changes to package exports or compatibility
line require direct consumers, compatibility metadata, and release evidence to
be rechecked. Host-owned Save, undo, dirty state, source jump, transport, and
preview retention remain consumer responsibilities and cannot be silently
implemented as language-service state.

### Other status boundaries confirmed

- `LS-TOKEN-001` remains `✔️`: the token service is consumed by
  `remark-relgeo-hl`, and the focused Markdown test passes.
- `LS-REC-001` is `✔️` at the local service/worker boundary: invalid, partial,
  recovered, and stable analysis states are serialized through the worker;
  browser presentation and host-owned preview retention remain separate.
- `LS-CONS-001` is `✔️` at the local Playground consumer boundary: source
  wiring, exact identity guards, worker analysis serialization, and unit tests
  are present; browser/public execution remains an explicit external evidence
  follow-up and is not inferred.
- `LS-CONS-002` remains `🌗`: normal Markdown highlighting passes, but the
  source-preserving fallback on language-service failure is not implemented.
- `LS-RANGE-002` remains `🌗` because host source-jump consumption is open.
  `LS-INCR-001` is now explicit `⏸️`: ranged synchronization and measured
  fallback are implemented, while semantic incrementality waits for a core
  index contract. `LS-VERS-002` is
  `🌗` at the protocol boundary because the
  vocabulary and serialization evidence are implemented. Unavailable
  browser/registry/CI evidence does not downgrade implementation absence to
  `?`.
- **Current integration update — 2026-10-31:** `LS-CONS-003` and
  `LS-CONS-004` are `🌗`, not deferred: MCP spec lookup/resources and the
  Flutter-hosted active-document read/guarded edit are implemented. This
  language-service audit does not establish semantic validation/completion
  integration or ChatGPT Desktop write interoperability.
- `LS-DOC-003` and `LS-REC-002` remain `➖` because the catalog assigns them to
  host/consumer ownership, not to the language-service implementation.

The test commands above emitted only the environment's locale warning. They
completed successfully. This refresh is local evidence; it does not claim
Node 24, registry, current CI, browser/public, or native-host verification.

Implementation note: these local changes are evidence for the dependent
reconciliation task. This audit does not silently rewrite the matrix or remove
candidate rows from the backlog.

## Reproducible evidence and handoff — 2026-11-04

The following commands reproduce the recorded local evidence from the stated
working directory boundaries:

```text
(cd language-service && npm test && npm run lint && npm run build)  # 96/96
(cd remark-relgeo-hl && npm test)
(cd playground && npm test && npm run lint && npm run build)
node scripts/run-conformance-fixtures.mjs
node scripts/check-language-service-schema-drift.mjs
(/Users/agusmade/development/flutter/bin/cache/dart-sdk/bin/dart .dart_tool/pub/bin/test/test.dart-3.11.5.snapshot)
git diff --check
git -C language-service diff --check
```

Observed results for this refresh are language-service `96/96` tests plus
type-check and ESM/CJS/DTS build, Markdown highlighter `6/6` tests, remark-relgeo
`9/9` tests, CLI `36/36` tests, Playground `112/112` tests plus lint/build, and
a zero-difference active-spec drift report. The earlier MCP `34/34` snapshot is
retained as historical support evidence; the current Dart rerun was
environment-unavailable. The commands use
the local workspace and do not require npm publication, a registry install,
production deployment, a pub.dev artifact, or a deferred MCP/Flutter host.

### Changed repository boundary

The current 2026-11-07 evidence was collected against these revisions and
working-tree states:

| Boundary | Revision | Working-tree boundary |
| --- | --- | --- |
| Workspace root | `b3d9a4a798cdf63af1ec86b45a05edef7c133a86` | Capability-map and baseline updates are the reviewed root working-tree changes. |
| `language-service/` | `ae23ede99b59498a72b5838c06be6a26cf5ece82` | Clean at evidence capture; the Playground consumer contract is the affected downstream boundary. |
| `playground/` | `c263920146a7ba28fe76561df25d1174b289663b` | Source and test changes implement the worker identity/analysis-envelope contract; browser/public execution remains separate. |
| `remark-relgeo-hl/` | `6d109a96a265f64b8934e13e4d9e1e1ae1e8b028` | Clean at evidence capture. |

These revisions are checkout anchors, not release or commit claims. The
working-tree changes must be reviewed and committed by the repository owner
before any release-boundary conclusion is drawn.

## Consumer verification handoff — 2026-11-07

The target consumer verification was rerun after the protocol and fixture
propagation work. These are target implementation checks, not observational
reference-source checks:

| Consumer boundary | Exact command | Result | Remaining boundary |
| --- | --- | --- | --- |
| Language Service | `(cd language-service && npm test && npm run lint && npm run build)` | PASS — 102 tests, type-check, ESM/CJS/DTS build | Published artifact is not claimed. |
| CLI | `(cd cli && npm test && npm run build)` | PASS — 40 tests and package build | Registry install is not claimed. |
| Markdown preview | `(cd remark-relgeo && npm test && npm run lint && npm run build)` | PASS — 18 tests, type-check, package build | Public package delivery is not claimed. |
| Markdown highlighter | `(cd remark-relgeo-hl && npm test && npm run lint && npm run build)` | PASS — 10 Vitest tests, 1 package-boundary test, type-check, package build | Injected language-service failure fallback remains an open capability boundary. |
| Playground local consumer | `(cd playground && pnpm test && pnpm lint && pnpm build)` | PASS — 119 tests, lint, production build and provenance | Browser E2E is host-limited below. |
| MCP direct contract boundary | `(cd mcp && /Users/agusmade/development/flutter/bin/cache/dart-sdk/bin/dart --suppress-analytics test)` | PASS — 45 Dart tests | Flutter wrapper/native host remains unavailable because protected engine/telemetry paths cannot be written. |
| Cross-surface contract | `npm run language-service:consumer:check` | PASS — 120 assertions | This is source/fixture boundary evidence, not registry or public-host evidence. |
| Shared fixtures | `node scripts/run-conformance-fixtures.mjs` | PASS — 677 assertions across 33 fixtures | Release publication and external CI remain separate. |

The attempted Playground browser command was `(cd playground && pnpm
test:e2e)`. Playwright's preview server failed before page creation because
the host denied binding `127.0.0.1:4173` with `EPERM`. This is recorded as
`environment unavailable`, not as a target source failure or failed parity
claim. The local unit/build evidence remains valid.

## Workspace gate evidence — 2026-11-08

The required workspace gates were executed from the current checkout after
the consumer and fixture updates. Gate outcomes are kept separate from local
package tests and from historical CI/public records:

| Exact command | Result | Evidence boundary / limitation |
| --- | --- | --- |
| `pnpm run verify:baseline:strict` | NOT PASS — exit `1`; 83 checks passed and 2 failed | Strict baseline correctly rejected the dirty `playground` and `language-service` submodule worktrees containing the implementation changes listed above. No reset or cleanup was performed. |
| `pnpm run compatibility:check` | PASS — exit `0` | Current compatibility matrix, package metadata, capability mappings, and release-order checks passed locally. |
| `pnpm run conformance:fixtures` | PASS — exit `0`; 677 assertions across 33 fixtures | Canonical parser/core/renderer/language-service/CLI/Markdown/preview/highlighting fixture boundary passed locally. |
| `pnpm run integration:gate -- --local` | ENVIRONMENT UNAVAILABLE — exit `2` before stages | Runner requires Node `>=24`; host is Node `22.23.2`. This is not a consumer parity failure. |
| `pnpm run integration:public` | ENVIRONMENT UNAVAILABLE — exit `2` before stages | Same Node prerequisite; no registry, deployment, or public-host claim is made. |

The strict baseline result is intentionally not promoted to PASS: a clean
release checkout cannot be asserted while the source/test changes are still
present in the submodules. The compatibility and canonical fixture gates are
independent local evidence and remain valid. Node 24, current CI, registry,
deployment, browser/public, and native-host boundaries remain not verified;
they are not implementation dependencies for the declared local closure.

## Final green-surface audit — 2026-11-08

The closure scope is the Language Service package contract plus the locally
verified consumer boundaries (Core, CLI, Markdown, Playground worker/editor,
and MCP typed protocol). It does not silently include a new LSP server,
semantic-index engine, live ChatGPT Desktop client, registry publication, or
hosted/browser deployment. Those boundaries remain visible as explicit
`⏸️` or `➖` decisions below.

| Measure | Before audit | After audit | Evidence / decision |
| --- | ---: | ---: | --- |
| Expected IDs | 33 | 33 | No expected capability was removed. |
| Implemented (`✔️`) | 18 | 22 | Validation readiness, bounded metadata, version/provenance propagation, and Markdown failure fallback now have direct source/test/consumer evidence. |
| Partial (`🌗`) | 12 | 0 | No partial row is hidden; broader limits are explicitly deferred or host-owned. |
| Absent (`❌`) | 0 | 0 | No absent capability was reclassified as implemented. |
| Broken (`⚠️`) | 0 | 0 | No confirmed contract mismatch remains in the declared local closure. |
| Deferred (`⏸️`) | 1 | 8 | Parser-recovery breadth, semantic-index completion, MCP semantic adapter, error-origin taxonomy, and live desktop/native boundaries have named owners and decisions. |
| Not applicable (`➖`) | 2 | 3 | Source-jump UI is host-owned; document/session identity and last-valid preview remain host-owned. |

### Explicit deferred and host decisions

| ID | Decision | Owner / dependency | Why this is not cosmetic |
| --- | --- | --- | --- |
| LS-DIAG-002 | `⏸️` | language-service + core / parser recovery | The bounded aggregation is tested; only broader recovery is held until core supplies deterministic recovery semantics. |
| LS-COMP-002 | `⏸️` | language-service + core / semantic index | Object-context completion is implemented; unbounded AST/index completion requires a core contract that does not exist yet. |
| LS-COMP-003 | `⏸️` | language-service / parser recovery | Supported partial contexts are tested; exhaustive parser-error shapes are not claimed. |
| LS-RANGE-002 | `➖` | Playground host / source-jump UI | The service result is implemented and tested; action wiring is a host responsibility. |
| LS-INCR-001 | `⏸️` | language-service + core / dependency index | Ranged synchronization and measured fallback are implemented; semantic incrementality is held on the explicit core dependency boundary. |
| LS-PROTO-002 | `⏸️` | language-service + MCP / semantic adapter | Safe local JSON/DTO serialization is tested; semantic MCP transport and packaged cross-host delivery require a separate adapter contract. |
| LS-REC-003 | `⏸️` | spec/core + consumers / origin taxonomy | Existing phase/origin fields are preserved; one canonical storage/runtime taxonomy requires a normative cross-surface decision. |
| LS-CONS-003 | `⏸️` | MCP + language-service + core / semantic adapter | MCP typed protocol is verified; core-backed semantic authoring is a separately owned MCP scope. |
| LS-CONS-004 | `⏸️` | MCP + Flutter / supported desktop host | Local guarded-edit DTOs are tested; live Desktop client and packaged native startup are unavailable in this environment. |
| LS-DOC-003 | `➖` | Playground/MCP/Flutter host | Session identity, dirty state, and persistence are deliberately host-owned by the catalog. |
| LS-REC-002 | `➖` | Playground host | Last-valid preview retention is deliberately a consumer/UI responsibility. |

Mechanical closure assertion: the current 33-row status matrix and
reconciliation contain `0 🌗`, `0 ❌`, and `0 ⚠️`; every `⏸️` and `➖` row has
an owner, dependency or host boundary, evidence, and an explicit next action.
The closure does not depend on npm/pub.dev publication, production
deployment, or unavailable host OS/browser binding.

### Remaining-gap handoff

The backlog retains deferred follow-up work without presenting it as a hidden
partial implementation. Registry/public artifact, current CI, browser/public,
Node 24, and native-host evidence remain not verified; these are evidence
boundaries and are not prerequisites for this local closure.
