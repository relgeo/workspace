# Core Runtime Implementation Gap Backlog

**Tanggal:** 2026-11-03
**Status:** candidate goal/task register with a bounded active selection; no row in this document counts as implementation
**Source:** [core runtime status matrix](./status-matrix.md),
[repository map](../../REPOSITORY-MAP.md), and
[capability inventory protocol](../INVENTORY-PROTOCOL.md)

The bounded active selection for the next execution tranche is recorded in
[core-runtime/in-scope-selection.md](./in-scope-selection.md). It selects five
existing candidate tasks; all other rows remain candidate work only.

Backlog ini menurunkan setiap expected capability berstatus `🌗`, `❌`, atau
`⚠️` menjadi **satu candidate task terpisah**. Status evidence dan keputusan
scope tidak diubah menjadi implementation claim. Candidate task belum menjadi
goal aktif SuClos sampai owner dan scope disetujui.

## Aturan backlog

- `Candidate goal` mengelompokkan pekerjaan menurut dependency; bukan komitmen
  delivery.
- `Candidate task` memiliki satu expected ID, owner, dependency, acceptance
  test/evidence target, dan next action.
- `❌` tetap berarti absent implementation pada expected boundary; tidak boleh
  diubah menjadi `➖` karena evidence sulit atau scope consumer belum tersedia.
- `⚠️` adalah defect/contract drift yang perlu diperbaiki, bukan absence.
- `⏸️`, `➖`, dan `?` dicatat sebagai scope/evidence follow-up terpisah dan
  tidak dihitung sebagai implementation gap task.
- A documentation-only change (README, roadmap, matrix, or backlog text) never
  satisfies an implementation task. Closure requires the stated source/test,
  runtime, or consumer evidence target and a fresh matrix re-audit.

## Coverage

| Check | Result |
| --- | --- |
| Expected non-complete capability rows | 15 |
| Candidate implementation tasks | 15 |
| Missing task source IDs | 0 |
| Duplicate task source IDs | 0 |
| `🌗` tasks | 15 |
| `❌` tasks | 0 |
| `⚠️` tasks | 0 |
| Existing audit gap records referenced | `CORE-GAP-001`–`CORE-GAP-007` |

The selected rows are `CORE-TASK-006`, `CORE-TASK-003`, `CORE-TASK-004`,
`CORE-TASK-005`, and `CORE-TASK-012`, covering `CORE-INPUT-002`,
`CORE-DIAG-001`, `CORE-DIAG-002`, `CORE-ERROR-003`, and `CORE-RESOLVE-005`.
Their owner, source-of-truth path, contract boundary, dependency order, and
acceptance behavior are maintained in the selection record; implementation and
verification have moved `CORE-DIAG-002` to `🌗`, while all remaining gaps stay
visible in this register.

## Frozen diagnostic/semantic contract tranche

The active audit scope for this task is seven IDs, including four candidate
rows outside the older bounded implementation selection:
`CORE-VALID-003`, `CORE-ERROR-002`, `CORE-RESOLVE-003`,
`CORE-CONSTRAINT-002`, `CORE-DIAG-001`, `CORE-DIAG-002`, and
`CORE-ERROR-003`. The detailed code/phase/object/path/ordering contract is
frozen in [expected catalog §4.1](./expected-capability-catalog.md#41-frozen-diagnostic-and-semantic-contract-scope).
This backlog records the ownership and evidence handoff so that a gap cannot
be promoted from documentation alone.

| Expected ID | Owner | Normative source of truth | Observed source / acceptance evidence | Status evidence |
| --- | --- | --- | --- | --- |
| `CORE-VALID-003` | `relgeo/core` | `spec/id/core/06-error-model.md`; geometry refs/scope specs | `core/src/validator.ts`, `core/src/resolver/eval-context.ts`; unknown-reference/private-export/placement/query/dependency negatives assert code/path/object context | `🌗 verified-local-bounded`; public reference failures normalize, broader raw internal paths remain |
| `CORE-ERROR-002` | `relgeo/core` + CLI | `spec/id/core/06-error-model.md`; `cli/README.md` | `core/src/parser.ts`, `validator.ts`, resolver boundary, CLI tests, invalid/runtime fixtures; strict phase distinction and CLI projection | `🌗 verified-local-bounded`; raw-path and canonical-host follow-up remain |
| `CORE-RESOLVE-003` | `relgeo/core` + geometry | `spec/id/geometry/16-collection-objects.md`, `19-collections.md`; core semantic guarantees | repeat/divide/split/boolean resolver tests plus fixtures 15/19/20/22; identity/order/result-mode/empty-collection assertions | `🌗 verified-local-bounded`; broader topology coverage remains |
| `CORE-CONSTRAINT-002` | `relgeo/core` + geometry | `spec/id/core/06-error-model.md`, `spec/id/geometry/21-constraints.md` | `core/src/resolver/constraints.ts`, `geometry/src/types.ts`, `v05-runtime-align-violation`; focused test asserts violation schema/order/resolved-scene retention | `🌗 partial-local`; severity/origin/expected-actual remain incomplete |
| `CORE-DIAG-001` | `relgeo/core` | `spec/id/core/06-error-model.md`; catalog §4.1 shared fields | `core/src/types.ts`, `errors.ts`, `diagnostics.ts`, structured-error/fixture tests; public failures normalize or document nullable context | `🌗 verified-local-bounded`; raw-throw/source-range coverage remains bounded |
| `CORE-DIAG-002` | `relgeo/core` (consumer projection consulted) | `spec/id/core/05-semantic-guarantees.md`, `06-error-model.md` | `core/src/diagnostics.ts`, `core/src/__tests__/diagnostics.test.ts`; deterministic phase/range/path/code/message order, dedupe, truncation, strict equivalence | `🌗 verified-local-bounded`; broader fault classes open |
| `CORE-ERROR-003` | `relgeo/core` | `spec/id/core/06-error-model.md`; fixtures 13, 17–20, 22 | `core/src/types.ts`, `errors.ts`, evaluator/resolver throw sites; covered emitted-code/type catalog and raw-throw normalization pass focused/runtime tests | `🌗 verified-local-bounded`; remaining internal/non-prefixed throw inventory and published parity are open |

### Fixture tranche evidence

The fixture tranche for this task keeps the normative semantics in the Core
specification and records only observable outcomes. The fixture manifest is the
cross-surface inventory; the focused Core test is the acceptance owner for
strict/editor and repeated-run assertions.

| Fixture scope | Owner | Normative source of truth | Acceptance test | Status evidence |
| --- | --- | --- | --- | --- |
| Reference failure with semantic path (`v05-invalid-reference-path`) | `relgeo/core` | `spec/id/core/06-error-model.md` §6.1, §6.7 | `core/src/__tests__/semantic_contract_fixtures.test.ts` asserts registered code, parse phase, severity, and `objects.marker.at[0]` path | `verified-local`; strict parse remains fail-fast |
| Post-resolve constraint retention (`v05-runtime-align-violation`) | `relgeo/core` + geometry | `spec/id/core/06-error-model.md` §6.6; `spec/id/core/04-evaluation-order.md` §4.3 | Focused fixture test and conformance runner assert violation path/order, unchanged resolved objects, and repeat determinism | `verified-local-bounded`; violation schema remains intentionally partial |
| Boolean empty/multipart result modes (`v05-runtime-empty-boolean`, `v05-runtime-multipart-boolean`) | `relgeo/core` + geometry | `spec/id/core/05-semantic-guarantees.md` §5.1–§5.6; `spec/id/core/06-error-model.md` §6.2 | Focused fixture test and conformance runner assert distinct strict runtime codes and stable repeated diagnostics | `verified-local-bounded`; no automatic geometry repair |
| Empty collection access (`v05-runtime-empty-collection`) | `relgeo/core` | `spec/id/core/04-evaluation-order.md` §4.1; `spec/id/core/06-error-model.md` §6.8 | Focused fixture test asserts `INVALID_COLLECTION_ACCESS` in compile mode and empty collection identity/fallback in editor mode | `verified-local-bounded`; editor fallback is not compile success |
| Incomplete-source recovery and aggregation (`v05-invalid-incomplete-editor`) | `relgeo/core` | `spec/id/core/05-semantic-guarantees.md` §5.1–§5.3; `spec/id/core/06-error-model.md` §6.7 | Focused fixture test asserts two ordered local diagnostics, stable object IDs/paths, editor zero-size recovery, and strict `MISSING_REQUIRED_FIELD` | `verified-local-bounded`; unsupported recovery remains explicit |

### Shared frozen rules

- Public diagnostics require `code`, non-empty `message`, `phase`, and
  `severity`; document-origin failures require a canonical `path` even when a
  source `range` is unavailable.
- Aggregated diagnostics sort by phase, source-range start, path, code, then
  message; dedupe and `maxDiagnostics` truncation happen after sorting. Strict
  compile/resolve remains fail-fast.
- Collection results preserve user-declared identity and semantic order:
  repeat/divide/split use stable indexed identities, boolean `single` returns
  one shape, and boolean `multi` returns an ordered collection. Empty or
  multipart single-result outcomes are explicit runtime errors.
- Constraint failures retain the resolved scene and are reported under
  `CONSTRAINT_VIOLATION`; automatic geometry mutation/general solving is not
  part of this tranche.

### Explicit exclusions

| Excluded behavior | Boundary / status | Reason it is not a gap in this tranche |
| --- | --- | --- |
| General constraint solving or automatic geometry mutation | `➖ not-applicable`; core/spec product boundary | Normative spec requires post-resolve validation only. |
| Raw SVG bytes, style/viewBox, renderer UX, editor accessibility, browser worker sequencing | Renderer/Playground/language-service owners | Consumers may project diagnostics and semantic results but cannot redefine core codes, paths, phases, or ordering. |
| Flutter host execution, Node `>=24`, registry/npm publication, CI, deployment, and native host services | `? unverified`; workspace/consumer owners | Evidence follow-ups are not prerequisites for freezing the local core contract. |
| New geometry algorithms or expanded boolean/topology engine behavior | Core + geometry implementation work | This task freezes acceptance boundaries and evidence; it does not close the implementation gaps. |

## Candidate goal G-CORE-01 — Close public diagnostics and failure contracts

**Owner:** `relgeo/core`  
**Dependency:** error taxonomy, source paths, resolver/evaluator throw sites  
**Risk:** P0/P1; consumers cannot reliably act on unstable or missing codes

| Candidate task | Expected ID | Source status | Priority | Scope | Owner | Dependency | Acceptance test / evidence target | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `CORE-TASK-001` normalize reference and scope failures | `CORE-VALID-003` | `🌗` | P1 | core diagnostic boundary + language-service projection | core | graph, resolver context, diagnostic normalizer | Unknown reference, private component export, invalid placement/query, and dependency failures return stable code/path/object context in core and language-service tests | Inventory raw reference throws and define expected codes |
| `CORE-TASK-002` normalize strict compile/check failures | `CORE-ERROR-002` | `🌗` | P1 | core strict modes + CLI error mapping | core + CLI | public error taxonomy, CLI mapping | Parse, validation, resolution, runtime, and constraint failures remain phase-distinct with stable exit/diagnostic output | Add strict-mode failure table and CLI assertions |
| `CORE-TASK-003` publish complete diagnostic object contract | `CORE-DIAG-001` | `🌗` | P0 | core public diagnostic contract | core | error catalog, source path/range policy | Every public diagnostic has stable code, message, severity, path/context, and origin phase or an explicit nullable rule | Draft catalog from emitted codes and exception classes |
| `CORE-TASK-004` add deterministic multi-diagnostic aggregation | `CORE-DIAG-002` | `🌗` | P1 | core aggregation contract + language-service projection | core (language-service projection consulted) | ordering, truncation, primary-failure policy | One invalid document with multiple independent faults returns an ordered, stable diagnostic list without changing semantic outcome; ownership decision is documented | Expand the bounded `collectDiagnostics` API to broader faults/source mappings before promotion |
| `CORE-TASK-005` reconcile runtime error code union | `CORE-ERROR-003` | `🌗` | P0 | core public error taxonomy + resolver/evaluator throws | core | `RelGeoErrorCode`, resolver/evaluator throw sites | `BOOLEAN_EMPTY_RESULT` is represented and normalized; every emitted actionable code still requires catalog/type-level agreement | Maintain the emitted-code inventory and normalize remaining internal/public-boundary raw throws |

Related audit records: `CORE-GAP-001`, `CORE-GAP-002`.

## Candidate goal G-CORE-02 — Strengthen semantic model, recovery, and coverage

**Owner:** `relgeo/core` with `relgeo/spec`  
**Dependency:** AST/source-location decision, typed semantic model, fixture policy  
**Risk:** P1; incomplete contracts make downstream parity and debugging ambiguous

| Candidate task | Expected ID | Source status | Priority | Scope | Owner | Dependency | Acceptance test / evidence target | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `CORE-TASK-006` define parse representation and source-location boundary | `CORE-INPUT-002` | `🌗` | P1 | core parse contract + language-service range projection | core + language-service | parser marks, AST ownership decision | Syntax errors and semantic paths can be traced through a documented public representation; source-range behavior has executable parser/diagnostic tests | Decide whether core owns AST/ranges or exposes a semantic-only contract |
| `CORE-TASK-007` strengthen typed semantic model | `CORE-MODEL-002` | `🌗` | P1 | core public semantic types + spec alignment | core + spec | type system, object identity, component namespaces | Public types cover value/object/collection/component scope without broad `any` for the declared contract; compile-time and runtime tests pass | Inventory broad fields and propose compatible type replacements |
| `CORE-TASK-008` expand topology and degenerate-input validation | `CORE-VALID-004` | `🌗` | P1 | core validator + geometry negative fixtures | core + geometry | path/boolean topology, tolerance | Invalid closure, holes, offsets, repeats, operations, dimensions, and annotations produce stable expected diagnostics across negative fixtures | Build negative-case catalog from validator branches |
| `CORE-TASK-009` document and test bounded editor recovery | `CORE-ERROR-001` | `🌗` | P2 | core tolerant parser/resolver boundary + Playground verification | core + Playground | editor mode, tolerant resolver, UI diagnostic loop | Supported incomplete-source cases preserve editable diagnostics and never report compile/resolve success; unsupported recovery is explicit | Enumerate tolerant parser/resolver cases and add boundary tests |
| `CORE-TASK-010` complete collection/result-mode contract | `CORE-RESOLVE-003` | `🌗` | P1 | core collection resolver + geometry topology | core + geometry | repeat/divide/split/boolean identity, topology | Repeat/divide/split/boolean single/multi/empty/multipart cases preserve stable identity/order and return explicit mode errors | Separate active fixture 15 from promotion candidates and add matrix |
| `CORE-TASK-011` complete structured constraint violations | `CORE-CONSTRAINT-002` | `🌗` | P1 | core violation schema + geometry projection | core + geometry | violation schema, severity/origin policy | Violations expose stable type/path/involved objects, expected/actual context, severity, and origin; valid/invalid fixtures cover each relation | Extend `ConstraintViolation` contract and snapshots |

Related audit records: `CORE-GAP-003`, `CORE-GAP-004`.

## Candidate goal G-CORE-03 — Close deterministic semantic projection and consumer parity

**Owner:** `relgeo/core` with consumer owners  
**Dependency:** canonical serialization/order contract, shared fixtures, consumer hosts  
**Risk:** P1/P2; downstream rendering and parity claims remain bounded until proof exists

| Candidate task | Expected ID | Source status | Priority | Scope | Owner | Dependency | Acceptance test / evidence target | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `CORE-TASK-012` publish canonical resolved-scene projection | `CORE-RESOLVE-005` | `🌗` | P1 | core semantic projection + geometry consumer schema | core + geometry | `ResolvedScene`, serializer schema, numeric policy | A versioned semantic projection specifies fields, identity, ordering, numeric normalization, values, bounds, violations, views, and sheets; CLI/renderer consumers consume it | Keep `projectResolvedScene`/`serializeResolvedScene` stable and add consumer migration/comparator evidence |
| `CORE-TASK-013` define stable replay/order/tolerance contract | `CORE-DET-002` | `🌗` | P1 | core determinism contract + spec semantics | core + spec | graph, collections, diagnostics, serializer | Two repeated processes and supported runtimes produce identical IDs, dependency/collection order, numeric outputs, and diagnostic paths | Add canonical replay comparator and tolerance assertions |
| `CORE-TASK-014` verify edit-to-preview consumer integration | `CORE-INT-002` | `🌗` | P1 | core boundary + language-service/Playground browser flow | core + language-service + Playground | worker sequencing, browser E2E, diagnostic contract | Browser edit → diagnostic → resolve → preview → inspect flow passes for valid, incomplete, and runtime-error documents without changing core semantics | Run current browser E2E and record consumer-only findings separately |
| `CORE-TASK-015` refresh cross-consumer semantic parity evidence | `CORE-INT-004` | `🌗` | P2 | core semantic boundary + Flutter/renderer/Markdown consumers | core + Flutter/renderer/Markdown owners | shared fixtures, Flutter SDK/host, semantic comparator | Selected fixtures compare semantic objects, paths, diagnostics, ordering, and SVG projection across TypeScript/Flutter; raw SVG bytes remain out of scope | Re-run Flutter/canonical consumer verification and review fixture 16 promotion |

Related audit records: `CORE-GAP-005`, `CORE-GAP-006`, `CORE-GAP-007`.

## Evidence handoff for remaining gaps

The current local evidence boundary is recorded in this backlog and the
[reconciliation](./reconciliation.md): Core 48-file/450-test coverage,
direct language-service/renderer/CLI checks, conformance 290/290 across 23
fixtures, and the focused semantic-contract suite. No npm/pub.dev publication,
production deployment, canonical Node >=24 run, or deferred platform host was
used as a prerequisite. The root and Core revision boundaries remain recorded
in the implementation audit; no commit was created by this task.

| Remaining gap / limitation | Handoff owner | Dependency | Next actionable evidence |
| --- | --- | --- | --- |
| Source-range AST/semantic representation remains bounded (`CORE-INPUT-002`) | `relgeo/core` + language-service | AST ownership and range/nullability policy | Add supported semantic-path range fixtures and review the public representation. |
| Diagnostic contract and aggregation remain bounded (`CORE-DIAG-001`, `CORE-DIAG-002`) | `relgeo/core` | Error catalog, broader fault matrix, consumer projection policy | Extend the local raw-throw/code inventory and source-range fixtures without changing strict resolution. |
| Runtime taxonomy still needs exhaustive closure (`CORE-ERROR-003`) | `relgeo/core` | Exhaustive emitted-code inventory across evaluator/resolver/parser | Maintain the emitted-code/type-union check and normalize remaining internal/public-boundary throws. |
| Canonical projection is available but not required by consumers (`CORE-RESOLVE-005`) | `relgeo/core` + geometry/consumer owners | Comparator and consumer migration decision | Compare projection fields/order/numbers across CLI and renderer consumers before promotion. |
| Node `>=24`, current CI, browser, Flutter, registry/public artifact evidence | Workspace + consumer owners | Environment availability and canonical revision selection | Run the named host/CI/public-artifact checks when available; do not infer absence locally. |
| Fixture 16 evaluator/unit promotion | Workspace + Core + Flutter | Human decision and shared canonical snapshots | Keep `⏸️` until promotion is explicitly approved. |
| General constraint solver/automatic mutation | Core/spec | Product scope decision | Keep `➖`; no implementation work is authorized by this backlog. |

## Scope and evidence follow-ups (not implementation tasks)

| Follow-up | Status | Owner | Acceptance evidence | Next action |
| --- | --- | --- | --- | --- |
| General constraint solver / automatic mutation | `➖ not-applicable` | core/spec | Explicit non-goal remains in scope decision and tests assert post-resolve reporting only | Do not create implementation task unless product scope changes |
| Fixture 16 evaluator/unit promotion | `⏸️ deferred` | workspace + core + Flutter | Human decision plus shared canonical snapshots before active promotion | Keep candidate status; do not count as fixed by this backlog |
| Node `>=24`, registry, current CI, browser E2E, Flutter host | `? unverified` | workspace/consumer owners | Fresh canonical runs and public artifact evidence | Schedule verification separately from implementation tasks |

## Handoff rules

1. Creating this backlog does not close any implementation gap.
2. A candidate task can move to implementation only after owner/dependency
   approval and an executable acceptance test is identified.
3. A task is complete only when the matrix status is re-audited from
   implementation/evidence; editing this document is not evidence of closure.
4. If a future audit finds a new absent capability, preserve its expected ID,
   add `❌` to the matrix, and add one candidate task here; never use `➖` to
   hide absence.

## Source links

- [Core runtime status matrix](./status-matrix.md)
- [Bounded in-scope selection](./in-scope-selection.md)
- [Expected core runtime catalog](./expected-capability-catalog.md)
- [Current implementation audit evidence](./implementation-audit.md)
- [Archived detailed audit log](./archive/implementation-audit-legacy.md)
- [Expected-versus-observed reconciliation](./reconciliation.md)
- [Coverage validation and handoff](./coverage-validation-handoff.md)
- [Maturation master plan](../../MATURATION-MASTER-PLAN.md)
- [Repository map](../../REPOSITORY-MAP.md)
- [Capability inventory protocol](../INVENTORY-PROTOCOL.md)
- [Compatibility matrix](../../compatibility-matrix.json)
- [Contract-versioning plan](../../plans/02-contract-versioning.md)
- [Fixture manifest](../../../fixtures/manifest.json)
