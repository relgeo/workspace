# Core Runtime Implementation Gap Backlog

**Tanggal:** 2026-10-30  
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
| `🌗` tasks | 14 |
| `❌` tasks | 0 |
| `⚠️` tasks | 1 |
| Existing audit gap records referenced | `CORE-GAP-001`–`CORE-GAP-007` |

The selected rows are `CORE-TASK-006`, `CORE-TASK-003`, `CORE-TASK-004`,
`CORE-TASK-005`, and `CORE-TASK-012`, covering `CORE-INPUT-002`,
`CORE-DIAG-001`, `CORE-DIAG-002`, `CORE-ERROR-003`, and `CORE-RESOLVE-005`.
Their owner, source-of-truth path, contract boundary, dependency order, and
acceptance behavior are maintained in the selection record; implementation and
verification have moved `CORE-DIAG-002` to `🌗`, while all remaining gaps stay
visible in this register.

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
| `CORE-TASK-005` reconcile runtime error code union | `CORE-ERROR-003` | `⚠️` | P0 | core public error taxonomy + resolver/evaluator throws | core | `RelGeoErrorCode`, resolver/evaluator throw sites | `BOOLEAN_EMPTY_RESULT` is represented and normalized; every emitted actionable code still requires catalog/type-level agreement | Generate/maintain code catalog and add raw-throw normalization regressions |

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

The current local evidence boundary is recorded in the
[implementation audit](./implementation-audit.md): Core 47-file/436-test
coverage, direct language-service/renderer/CLI checks, conformance 260/260, and
compatibility 283/283. No npm/pub.dev publication, production deployment, or
deferred platform host was used as a prerequisite. The root and Core revision
boundaries are also recorded there; no commit was created by this task.

| Remaining gap / limitation | Handoff owner | Dependency | Next actionable evidence |
| --- | --- | --- | --- |
| Source-range AST/semantic representation remains bounded (`CORE-INPUT-002`) | `relgeo/core` + language-service | AST ownership and range/nullability policy | Add supported semantic-path range fixtures and review the public representation. |
| Diagnostic contract and aggregation remain bounded (`CORE-DIAG-001`, `CORE-DIAG-002`) | `relgeo/core` | Error catalog, broader fault matrix, consumer projection policy | Add raw-throw/code catalog regressions and multi-fault/source-range fixtures without changing strict resolution. |
| Runtime taxonomy has confirmed drift risk (`CORE-ERROR-003`) | `relgeo/core` | Exhaustive emitted-code inventory across evaluator/resolver/parser | Generate or maintain the emitted-code/type-union check and normalize remaining public-boundary throws. |
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
