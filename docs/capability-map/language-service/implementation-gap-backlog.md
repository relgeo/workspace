# Language-Service Implementation-Gap Backlog

**Tanggal:** 2026-10-31
**Status:** candidate goal/task register; no row here counts as implementation  
**Source:** [language-service status matrix](./status-matrix.md) and
[expected-versus-observed reconciliation](./reconciliation.md)

The current bounded implementation subset is recorded in
[in-scope-selection.md](./in-scope-selection.md). Rows not listed there remain
visible candidate work, not active implementation for this tranche. Selected
rows remain here after implementation so their residual gap and evidence are
not lost.
Local implementation evidence for selected rows is recorded in
[implementation-audit.md](./implementation-audit.md); status promotion remains
the responsibility of the reconciliation task, which has now joined the local
evidence below.

Backlog ini menurunkan setiap expected capability berstatus 🌗, ❌, atau ⚠️
menjadi satu candidate task. Status evidence dan keputusan scope tetap
terpisah. Dokumentasi matrix/backlog tidak menutup gap implementasi; status
baru berubah setelah implementation evidence diaudit ulang.

Priority is explicit below and follows the matrix risk level: P0 is a confirmed
public-contract defect, P1 is a release-relevant capability gap, and P2 is a
lower-risk follow-up. Scope states the implementation boundary for the task;
the acceptance column states the evidence required to close it. The
LS-CONS-005 row is contract repair, not a new feature: changing README text
alone does not count as implementation evidence.

## Aturan dan coverage

- Candidate task bukan goal aktif SuClos sampai owner, scope, dan dependency disetujui.
- Setiap task memiliki satu expected ID, owner, dependency, acceptance test/evidence target, risk, dan next action.
- ❌ berarti absent pada expected boundary; tidak boleh diubah menjadi ➖ karena delivery atau evidence sulit.
- ⚠️ berarti defect atau contract drift yang terkonfirmasi, bukan absence.
- ➖ dan ⏸️ tetap ada di matrix sebagai scope/roadmap state, tetapi bukan implementation-gap task pada backlog ini.

| Check | Result |
| --- | --- |
| Tracked rows | 23 |
| Open candidate tasks | 22 |
| Locally closed rows retained for evidence | 1 (`LS-TASK-022`) |
| Open-task priority | P1: 22 |
| Open 🌗 tasks | 19 |
| Open ❌ tasks | 3 |
| Open ⚠️ tasks | 0 |
| Missing source IDs | 0 |
| Duplicate task source IDs | 0 |

## Candidate tasks

| Candidate task | Expected ID | Source status | Priority | Scope | Owner | Dependency | Acceptance test / evidence target | Risk | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| LS-TASK-001 tolerant syntax diagnostics | LS-DIAG-002 | 🌗 | P1 | language-service/core diagnostic aggregation for incomplete source | language-service + core | parser recovery; diagnostic ordering | Bounded aggregation now preserves independent diagnostics and passes focused service/conformance tests; broad incomplete-source recovery remains open | P1 edit-time recovery is noisy or incomplete | Expand the incomplete-source matrix and choose a broader aggregation policy |
| LS-TASK-002 post-resolve diagnostic contract | LS-DIAG-004 | 🌗 | P1 | boundary between structural diagnostics and post-resolve constraint results | core + language-service | resolver violation DTO; API boundary decision | A runtime constraint fixture either returns a documented language-service result or is explicitly covered by a separate runtime-diagnostics API | P1 runtime failures remain disconnected from editor results | Decide structural-only versus separate post-resolve method |
| LS-TASK-003 Playground browser integration | LS-CONS-001 | 🌗 | P1 | Playground browser bundle, worker, and editor consumer path | Playground + language-service | browser bundle; worker lifecycle; current artifact | Browser edit → diagnostics/completion/hover → worker result smoke passes on the current build and records artifact revision | P1 local wiring may diverge from shipped path | Run current browser smoke and record route/build evidence |
| LS-TASK-004 validation readiness result | LS-VAL-002 | 🌗 | P1 | validate-only versus resolve-ready result semantics | language-service + Playground | validate-only versus resolve-ready semantics | A request/result test distinguishes structurally valid, semantically validated, and resolved-ready states without changing core semantics | P1 consumers treat partial validation as preview-safe | Draft result state vocabulary and worker contract |
| LS-TASK-005 schema drift checker | LS-SCHEMA-002 | 🌗 | P1 | generated comparison of active spec vocabulary and editor catalogs | language-service + spec | active spec vocabulary; core type catalog | Bounded checker reports active root/object/field/parameter/view/sheet/presentation drift and clean/mutation tests pass; generated all-spec comparison remains open | P1 editor schema diverges silently from DSL | Connect the checker to generated active-spec vocabulary evidence |
| LS-TASK-007 semantic geometry completion context | LS-COMP-002 | 🌗 | P1 | bounded semantic completion context for object identity and geometry | language-service + core | semantic index; object identity | Bounded object-reference and object-context completion returns typed items with replacement ranges; full AST/semantic-index coverage remains open | P1 high-value semantic suggestions missing | Extend semantic-context coverage only with an agreed index contract |
| LS-TASK-008 partial/error completion suite | LS-COMP-003 | 🌗 | P1 | recovery-aware completion behavior and partial-context fixtures | language-service | tolerant parser; recovery context | Focused tests cover blank lines, quoted IDs, incomplete expressions, and `typ:` typo recovery without throwing; all parser-error shapes remain open | P1 users cannot recover after a typo | Add fixtures for the remaining supported partial contexts |
| LS-TASK-009 syntax and field hover contract | LS-HOVER-001 | 🌗 | P1 | syntax, field, type, enum, and incomplete-source hover content | language-service + docs owner | syntax catalog; documentation provenance | Direct service tests cover keyword, field, type, enum, valid document, incomplete document, and quoted-ID hover with stable content/range | P1 hover is empty or misleading | Define minimum hover content and source provenance |
| LS-TASK-010 semantic metadata provenance | LS-HOVER-002 | 🌗 | P1 | bounded semantic metadata and provenance result DTO | language-service + core | resolved metadata; provenance DTO | Metadata snapshot includes bounded type/value/reference information and explicit spec/revision provenance where available | P1 consumers overclaim derived values | Draft metadata DTO and add serialization snapshots |
| LS-TASK-011 exact ranges across result families | LS-RANGE-001 | 🌗 | P1 | source ranges across diagnostics, tokens, completion, hover, and metadata | language-service | source-location policy; position encoding | Diagnostics use core ranges; tokens, completion edits, and hover carry tested ranges; metadata/semantic-reference range coverage remains open | P1 highlights/replacements target wrong source | Extend the range contract to metadata and semantic-reference results |
| LS-TASK-012 semantic navigation result | LS-RANGE-002 | ❌ | P1 | minimal definition/reference navigation DTO and one host consumer | language-service + host | exact ranges; reference identity; host action contract | A definition/reference/navigation request returns stable source location for one supported semantic relation and Playground can consume it | P1 users cannot jump from semantic result to source | Define minimal navigation DTO and owner boundary |
| LS-TASK-013 document lifecycle request contract | LS-DOC-002 | 🌗 | P1 | stateless document update, analysis, identity, and ordering contract | language-service + Playground | document identity; request/result states | Edit sequence test proves update → analysis → consumer result ordering and distinguishes document/session identity from source text | P1 results can be attached to wrong document | Draft stateless request lifecycle DTO |
| LS-TASK-014 incremental or bounded analysis | LS-INCR-001 | ❌ | P1 | bounded re-analysis strategy, benchmark, and edit-sequence behavior | language-service + host worker | performance target; edit-range model; parser capabilities | Benchmark/edit-sequence test shows bounded work for a local edit or documents a selected bounded fallback with measured target | P1 responsiveness degrades with document size | Choose incremental, cache, or explicit bounded strategy |
| LS-TASK-015 service stale-result identity | LS-INCR-002 | 🌗 | P1 | request/document identity fields and stale-result enforcement | language-service + Playground | document revision/request ID; serialization | `analyzeDocument()` returns serializable protocol/document/version/request identity and mismatch helpers pass; Playground still owns ordering enforcement | P1 stale analysis can overwrite audited source | Add the service-to-worker integration assertion before adapter rollout |
| LS-TASK-016 result version and provenance | LS-VERS-002 | ❌ | P1 | spec version, source revision, and provenance fields on results | language-service + protocol owners | compatibility policy; source/revision provenance | Every editor/protocol result carries the agreed contract/spec version and optional source revision/provenance; JSON round trip is stable | P1 evidence cannot be traced across consumers | Define minimal required versus optional provenance fields |
| LS-TASK-017 unified typed editor protocol | LS-PROTO-001 | 🌗 | P1 | versioned read-only unified result DTO or explicit typed adapters | language-service | ranges, provenance, result state decisions | Diagnostics, validation, schema, token, completion, hover, and metadata share a versioned serializable DTO or explicit adapters with type tests | P1 each consumer invents incompatible shapes | Publish read-only protocol draft from existing types |
| LS-TASK-018 safe protocol serialization | LS-PROTO-002 | 🌗 | P1 | safe serialization and side-effect boundary tests | language-service + MCP | MCP security boundary; DTO schema | Serialization/property tests prove results contain no filesystem/network/UI side effects and preserve ranges/codes across worker/MCP boundary | P1 adapter can lose safety or data fidelity | Add fixture-based serialization tests before runtime adapter |
| LS-TASK-019 actionable recovery states | LS-REC-001 | 🌗 | P1 | invalid-to-valid recovery state and sequence contract | language-service + Playground | error-origin taxonomy; invalid-to-valid sequence | Invalid, partial, and recovered source sequence preserves diagnostics/completion and returns explicit recovery state without false success | P1 editor loop loses document or recovery context | Define recovery state enum and add sequence test |
| LS-TASK-020 cross-boundary error origins | LS-REC-003 | 🌗 | P1 | canonical parser, validation, runtime, and storage error-origin mapping | spec/core + consumer owners | parser/validation/runtime/storage origin vocabulary | Same scenario is classified consistently across service, worker, storage, share, and runtime paths; host-owned errors stay distinguishable | P1 user chooses wrong recovery action | Map existing codes/messages to canonical origin classes |
| LS-TASK-021 Markdown failure fallback | LS-CONS-002 | 🌗 | P1 | remark plugin source-preserving failure fallback | remark-relgeo-hl + language-service | token service error handling; source-preserving renderer | Injected language-service failure returns original fenced source or safe fallback and does not fail the Markdown transform; test passes | P1 docs build breaks on malformed/service failure input | Add try/catch fallback and failure-injection test |
| LS-TASK-022 package/docs API and version repair | LS-CONS-005 | ✔️ | P0 | public API/version contract repair with source or documentation regression test | language-service owner | API decision for getSchema; release metadata policy | README matches `0.5.1`, `getSchema()` is implemented, and the API/version regression test passes locally | Public consumers still need packed/registry verification | Retain as closed local evidence; verify packed/public artifact in the release environment |
| LS-TASK-023 MCP semantic analysis integration | LS-CONS-003 | 🌗 | P1 | core-backed validation/diagnostic mapping; MCP owns tool/transport semantics | MCP + language-service + core | typed semantic result/provenance DTOs; current MCP tool contract | Core-backed validation and diagnostic mapping have representative MCP/core fixtures; completion/render are either separately scoped or explicitly deferred | Agents cannot validate or explain a proposal against current RelGeo semantics | Define the minimal read-only semantic DTO and add adapter fixtures |
| LS-TASK-024 Desktop active-document write interoperability | LS-CONS-004 | 🌗 | P1 | verify existing Flutter-hosted bounded edit end to end; host/session/undo ownership stays in MCP/Flutter | MCP + Flutter + language-service | ChatGPT Desktop client; draft package on supported desktop hosts | Desktop edit round-trip proves revision guard, dirty state, and undo; packaged MCP startup and shutdown are smoke-tested per target OS | Users may trust an edit that did not apply to the intended active revision | Verify the live client round-trip and packaged-server smoke, prioritizing Windows |

## Scope and evidence follow-ups

These rows are intentionally not implementation tasks:

| Follow-up | Status | Owner | Acceptance evidence | Next action |
| --- | --- | --- | --- | --- |
| Active document identity, dirty state, and session storage | ➖ not-applicable | Playground/MCP/Flutter | Host DTO and lifecycle tests cover identity/dirty/revision without moving storage into language-service | Keep linked to host matrix; do not add service state by assumption |
| Last valid preview retention | ➖ not-applicable | Playground/host | Invalid update keeps last successful preview while Errors is shown | Maintain consumer acceptance test separately |
| MCP semantic analysis adapter and desktop verification | 🌗 partial | MCP/Flutter + language-service + core | Existing local MCP runtime and host bridge; semantic DTO contract and live desktop client | Define and test core-backed validation/diagnostics/completion integration; verify guarded edit round-trip separately |
| Node 24, registry, current CI, browser/public, native AT | ? unverified | workspace and consumer owners | Fresh canonical environment evidence | Schedule verification independently from gap implementation |

## Evidence handoff

The current implementation and verification handoff is recorded in the
[current implementation audit](./implementation-audit.md#reproducible-evidence-and-handoff--2026-10-30).
Local evidence is reproducible at the package and workspace boundaries and is
not contingent on npm/pub.dev publication, production deployment, registry
installation, or the MCP/Flutter host; local MCP host paths are now implemented while semantic integration remains open. The backlog remains the
authoritative handoff for residual work: selected rows with bounded local
evidence retain their residual `🌗` status, `LS-CONS-005` is retained as closed
local evidence, and unresolved `❌`, host-owned `➖`, and any historically deferred selection is visibly tracked as partial where current implementation evidence now exists.

The checkout anchors at handoff are workspace root
`1cfa86553d7adb18179c6b3e1a33618a179b1414`, language-service
`39c06dd8505d480672b0953d523f3675a7f30075`, Playground
`59a42ae925cf0c21541bc19ccac39f5061b35439`, and Markdown highlighter
`507ad18fe1b8c91eb3a48e365b5290cd02b049b8`. The first three boundaries have
working-tree changes; the Markdown highlighter was clean. These are review
anchors, not claims that the changes have been committed or released.

## Handoff rules

1. A candidate task becomes implementation work only after owner, dependency,
   scope, and acceptance evidence are approved.
2. A task is complete only after source/tests are changed and the status
   matrix plus audit are re-run. Editing this backlog is never completion
   evidence.
3. If implementation changes a capability boundary, update the expected
   catalog or scope decision explicitly before changing the status.
4. ➖ and ⏸️ must not be used to hide an absent language-service capability.

## Source links

- [Language-service package/source](../../../language-service/README.md)
- [Repository map](../../REPOSITORY-MAP.md)
- [Expected catalog](./expected-capability-catalog.md)
- [Implementation audit evidence](./implementation-audit.md)
- [Expected-versus-observed reconciliation](./reconciliation.md)
- [Status matrix](./status-matrix.md)
- [Maturation master plan](../../MATURATION-MASTER-PLAN.md)
- [Compatibility matrix](../../compatibility-matrix.json)
