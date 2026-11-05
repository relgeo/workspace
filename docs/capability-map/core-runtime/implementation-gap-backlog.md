# Core Runtime Implementation Gap Backlog

**Tanggal:** 2026-11-05
**Status:** reconciled closure register; candidate task rows are retained as
historical traceability, while final capability status is authoritative in the
[closure report](./closure-report-2026-11-05.md) and status matrix.
**Source:** [core runtime status matrix](./status-matrix.md),
[repository map](../../REPOSITORY-MAP.md), and
[capability inventory protocol](../INVENTORY-PROTOCOL.md)

The normative contract freeze for every candidate is
[`spec/id/core/07-closure-contracts.md`](../../../spec/id/core/07-closure-contracts.md).
Candidate rows below retain their detailed source-of-truth references, while
the closure chapter supplies the common input/output, diagnostic, edge-case,
and compatibility expectations used for implementation acceptance.

The 2026-11-04 P0/P1 triage and the separate P2 consumer candidate are retained
as historical work selection. The 2026-11-05 re-audit closes all 15 candidate
IDs at the declared local Core/consumer contract boundary; external evidence
and fixture-16 promotion remain explicit findings, not hidden implementation
gaps.

Backlog ini originally lowered each expected capability berstatus `🌗`, `❌`,
atau `⚠️` menjadi satu candidate task terpisah. Those rows now serve as the
traceable implementation history; final status/evidence is not inferred from a
backlog label.

## Current implementation execution update — 2026-11-05

The Geometry-closure revision advanced the Core submodule to `ea74c9e` and
added source/test coverage across component scope, collection guards, curves,
placement, measurements, cycle paths, text, anchors, repeat identity, and
constraint diagnostics. The current register records the resulting local
closure; residual consumer, topology, and host limitations are explicit
maintenance or scope boundaries.

| Task / ID | Implementation evidence added | Verification | Current status / next action |
| --- | --- | --- | --- |
| `CORE-TASK-011` / `CORE-CONSTRAINT-002` | `geometry/src/types.ts` and `core/src/resolver/constraints.ts` emit stable `severity`, `origin`, `expected`, and `actual` fields; fixture 14 records the contract. | `core/src/__tests__/constraints_diagnostics.test.ts`; `node scripts/run-conformance-fixtures.mjs` → `401 passed, 0 failed across 27 fixtures`. | `✔️ closed-local-bounded`; new relation kinds are additive fixtures. |
| `CORE-TASK-003` / `CORE-DIAG-001` | `core/src/errors.ts` normalizes raw evaluator/resolver phrases to registered catalog codes and preserves boundary context; `collectDiagnostics` now probes independent runtime failures through dependency closures, graph dependencies include Boolean base/tools/shapes, and production evaluator/validator/resolver sources no longer throw raw `Error` instances. | `core/src/__tests__/diagnostics.test.ts`, `structured_errors.test.ts`, `dependency_v03.test.ts`, `evaluator.test.ts`; raw-throw inventory; `pnpm --dir core run lint`; Core suite → `537 passed`; invalid fixture runner now asserts declared code/phase/path. | `✔️ closed-local-bounded`; normative catalog assertion and source-range contract are executable. |
| `CORE-TASK-005` / `CORE-ERROR-003` | Path-parameter failure no longer emits unregistered `INVALID_T_PARAMETER`; validator expression failures preserve normalized semantic codes; evaluator internals now use a coded internal error that keeps `resolve` versus `validate` phase selection at the public boundary, and turtle failures use structured `ResolveError` codes. | `core/src/evaluator.ts`, `validator.ts`, `resolver/primitives/shapes.ts`; `diagnostics.test.ts`, `structured_errors.test.ts`, `closure_contracts.test.ts`; production raw-throw inventory; Core suite passes. | `✔️ closed-local-bounded`; normative catalog/type/normalizer agreement is executable. |

### Public-boundary implementation tranche — 2026-11-05

The current Core implementation now carries concrete source/test changes for
the following boundaries. These entries are closure evidence for the declared
local contract; broader topology, consumer, and inventory work is additive
maintenance unless a scope decision promotes it.

| Gap | Source change | Regression evidence | Boundary still open |
| --- | --- | --- | --- |
| `CORE-INPUT-002`, `CORE-DIAG-001` | `core/src/parser.ts` exports `sourceRangeForPath`; semantic `ParseError` failures retain a best-effort range when YAML marks are unavailable. | `diagnostics.test.ts` asserts a range for a missing required field; full Core suite passes. | AST ownership and nested source-range precision remain out of scope for this tranche. |
| `CORE-CONSTRAINT-002`, `CORE-DIAG-002` | `RelGeoDiagnostic` preserves constraint type, origin, expected, and actual values; aggregation projects the structured violation metadata. | `diagnostics.test.ts` asserts the align violation payload and stable code/phase. | Broader relation/topology matrix and downstream comparators remain open. |
| `CORE-ERROR-003`, `CORE-VALID-003`, `CORE-RESOLVE-003` | Collection argument failures, unknown object dispatch, and boolean operand lookup now throw registered structured errors with object/path context. Boolean perimeter uses the registered path-length code. Evaluator internals are now coded and normalized at the caller-selected phase. | `diagnostics.test.ts`, `structured_errors.test.ts`, `evaluator.test.ts`, boolean/collection suites; production raw-throw inventory; full Core suite passes. | Emitted-code/spec agreement, source-range depth, and consumer-specific rendering remain open. |
| `CORE-RESOLVE-003`, `CORE-DET-002` | Active v0.5 Boolean `result.mode: multi` now resolves to an ordered `collection` with deterministic `id[index]` Boolean children; v0.4 keeps the flattened compatibility shape. | `boolean.test.ts`; fixture 24 resolved-scene/SVG snapshots; `node scripts/run-conformance-fixtures.mjs` → `401 passed, 0 failed across 27 fixtures`. | Broader intersection/topology combinations and cross-consumer collection queries remain open. |
| `CORE-VALID-004`, `CORE-RESOLVE-003` | Boolean structural validation now rejects unsupported operations, invalid `result.mode`, and missing operation-specific operands with stable path/code diagnostics before topology resolution. | `boolean.test.ts` asserts `INVALID_VALUE` at `objects.invalid.result.mode`; Core lint passes. | Full topology/degenerate matrix and cross-surface diagnostic projection remain open. |
| `CORE-VALID-004`, `CORE-RESOLVE-003` | Boolean references now validate the closed-shape boundary (including recursive clones, while excluding v0.5 multi collections); geometry `INVALID_CLOSED_SHAPE` codes are preserved when direct resolution bypasses validator mode. Divide/repeat closed traversal now includes ellipses and resolved booleans. Split validation now rejects statically known non-path/closed targets while allowing transform chains. | `boolean.test.ts` asserts operand path/type diagnostics and geometry-code preservation; `repeat_divide.test.ts` asserts ellipse/boolean endpoint policy and deterministic child IDs; `split.test.ts` covers target boundary. | Broader holes/offset/self-intersection and cross-consumer topology evidence remain open. |
| `CORE-VALID-004` | Geometry `normalizeClosedShape` now supports resolved ellipses, including rotation, finite/positive radii, deterministic 64-point rings, and ellipse holes; the Core validator accepts inline ellipse holes; direct Geometry normalization now rejects outside/crossing holes and overlapping/nested holes with the shared topology codes. | `geometry/src/__tests__/boolean.test.ts` and Core `path_holes.test.ts` cover rotated/degenerate ellipse normalization, sampled hole area, and negative hole-topology cases. | Broader topology/degenerate combinations and cross-surface parity remain open. |
| `CORE-RESOLVE-005`, `CORE-DET-002` | Invalid canonical replay snapshots use distinct `INVALID_SEMANTIC_SNAPSHOT`; non-finite projection values use `CoreError` with the runtime taxonomy instead of untyped throws; projection replay now rejects incompatible schema versions and compatibility lines before comparison. | `projection.test.ts` asserts normalized snapshot failure and incompatible-line rejection; canonical replay tests remain green. | Cross-process/cross-consumer parity is still evidence-only. |
| `CORE-ERROR-003`, `CORE-DIAG-001` | Evaluator normalization now distinguishes arithmetic/relational/unary/index type failures as `TYPE_MISMATCH` instead of falling through to generic expression errors. | `diagnostics.test.ts` covers the catalog mappings; Core lint passes. | Exhaustive source inventory and consumer-specific rendering remain open. |
| `CORE-DIAG-002` | `aggregateDiagnostics` provides a public normalization/ordering/dedupe/truncation boundary for independent adapter failures without changing strict resolver fail-fast behavior. | `diagnostics.test.ts` asserts stable ordering, dedupe, and max truncation. | `collectDiagnostics` still has a bounded validator/resolver scope; broader fault-pass aggregation remains open. |
| `CORE-VALID-003`, `CORE-DET-002` | Graph cycle failures now retain canonical `objects.<id>` path plus deterministic `dependencyChain` while preserving the human-readable cycle message. | `dependency_v03.test.ts` asserts code, path, and chain for repeated cycle inputs. | Cross-surface dependency visualization and wider graph replay remain open. |
| `CORE-MODEL-002` | Public document model replaces remaining declared `any` extension slots with recursive semantic values and explicit parameter/constant/hole aliases. | Core lint/build and all 537 Core tests pass. | Resolver internals and generated consumer schemas still need separate typing work. |
| `CORE-VALID-004` / `CORE-ERROR-003` | Core validation now rejects statically supplied path offset distances that are negative or non-finite with `INVALID_OFFSET` at `objects.<id>.offset.distance`, before resolver/geometry execution; zero remains valid. | `core/src/__tests__/structured_errors.test.ts`; full Core suite → `537 passed`, lint/build pass. | Dynamic expression results, offset self-intersection, and broader topology combinations remain resolver/geometry inventory work. |
| `CORE-ERROR-003` / `CORE-VALID-004` | The public catalog now includes every normative error-model code, while implemented scale, mirror, and hole boundaries emit `INVALID_SCALE_FACTOR`, `INVALID_MIRROR_AXIS`, and `INVALID_HOLE_SHAPE`; runtime scale expressions are rejected before transform application. | `core/src/__tests__/structured_errors.test.ts`, `closure_contracts.test.ts`; full Core suite → `537 passed`, lint/build pass. | Reserved operation code still requires an owning implementation; inherit type conflict, repeat-along length failure, and turtle codes are now emitted with context. |
| `CORE-ERROR-003` / `CORE-VALID-003` / `CORE-RESOLVE-003` | Structured inherit now rejects incompatible value kinds across inherited sources with `INHERIT_TYPE_CONFLICT` and `inherit.<key>` context; repeat-along path-length failures now normalize to `REPEAT_ALONG_LENGTH_FAILED` with repeat object context. | `core/src/resolver/inherit.ts`, `core/src/resolver/primitives/repeat.ts`; `inherit_resolution.test.ts`, `structured_errors.test.ts`; full Core suite → `537 passed`. | Geometry-operation target compatibility is now explicit for affine targets and reverse/split boundaries in `spec/id/geometry/15-composition-objects.md`, `validator.ts`, and `operation.ts`; broader topology/consumer parity remains open. |
| `CORE-ERROR-003` / `CORE-VALID-004` / `CORE-RESOLVE-003` | v0.5 path-segment turtle commands now support enum/angle direction, chained turn, and positive forward distances with deterministic y-down coordinates; validator/resolver emit `TURTLE_HEADING_UNAVAILABLE`, `INVALID_TURTLE_FORWARD`, and `INVALID_TURTLE_TURN` with segment paths. | `core/src/types.ts`, `validator.ts`, `resolver/primitives/shapes.ts`; `path_initial_segments.test.ts`; fixture 27 and runner assert `INVALID_TURTLE_FORWARD` with parse phase/path; full Core suite → `537 passed`. | `✔️ closed-local-bounded`; affine/reverse/split operation-target compatibility is covered; future mixed-topology cases are additive. |

## Final closure register — 2026-11-05

All 15 candidate tasks are now closed at the local contract boundary. This is
the reconciliation result, not a documentation-only promotion: the source and
regression evidence is listed in the [closure report](./closure-report-2026-11-05.md).

| Closure class | IDs | Result |
| --- | --- | --- |
| `closed-local-bounded` | `CORE-INPUT-002`, `CORE-MODEL-002`, `CORE-VALID-003`, `CORE-VALID-004`, `CORE-ERROR-001`, `CORE-ERROR-002`, `CORE-RESOLVE-003`, `CORE-RESOLVE-005`, `CORE-CONSTRAINT-002`, `CORE-DIAG-001`, `CORE-DIAG-002`, `CORE-DET-002`, `CORE-INT-002`, `CORE-INT-004` | Source, regression, fixture, and consumer evidence is present; each row is `✔️` in the final matrix. |
| `closed-taxonomy` | `CORE-ERROR-003` | Normative spec-code membership, public union, normalization, structured-error tests, runtime fixtures, and raw-throw inventory are aligned; future codes require additive updates. |
| `scope/deferred` | Fixture 16 promotion; Node 24/CI/registry/browser/Flutter-host evidence; general constraint solver | Explicitly retained outside expected Core implementation rows; see closure report scope decisions. |

Local `dist/` outputs used to run the conformance command are generated/cache
artifacts and are not part of the tracked implementation handoff. The current
local evidence boundary is Core `49 files/537 tests`, language-service `90`
tests, renderer `104` tests, CLI `38` tests, and conformance `401/401` across
27 fixtures.

The invalid-fixture tranche now includes canonical operation-target, reverse-
target, and turtle-forward boundaries (`v05-invalid-operation-target`,
`v05-invalid-reverse-target`, and `v05-invalid-turtle-forward`). The runner
checks their Core code, phase, and path, then replays the same expected code
through the language-service and CLI projections. These fixtures remain
`invalid`; they do not promote a capability status.

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
| Expected non-complete capability rows | 0 |
| Candidate implementation tasks | 15 completed closure records |
| Missing task source IDs | 0 |
| Duplicate task source IDs | 0 |
| `🌗` tasks | 0 |
| `❌` tasks | 0 |
| `⚠️` tasks | 0 |
| Existing audit gap records referenced | `CORE-GAP-001`–`CORE-GAP-007` |

The P0/P1 selected set and the separate P2 `CORE-INT-004` task are now
completed closure records. Owners, source-of-truth paths, contract boundaries,
dependency order, and acceptance behavior remain auditable in this backlog and
reconciliation §3.2; final status is `✔️` for all 38 expected rows. The earlier
five-row selection is historical context only. `CORE-ERROR-003` is no longer a
current contract drift because the normative catalog assertion and raw-boundary
inventory now pass.

## Historical P0/P1 implementation-closability triage

**Triage date:** 2026-11-04. **Historical decision:** select every P0/P1 candidate that
can be progressed against a local implementation boundary and a focused
acceptance test from the current checkout. “Implementation-closable” was the
queueing criterion; the final status is now recorded in the closure register
above. Initial status below is retained as historical baseline provenance.

The selected set is fourteen IDs: `CORE-INPUT-002`, `CORE-MODEL-002`,
`CORE-VALID-003`, `CORE-VALID-004`, `CORE-ERROR-001`, `CORE-ERROR-002`,
`CORE-RESOLVE-003`, `CORE-RESOLVE-005`, `CORE-CONSTRAINT-002`,
`CORE-DIAG-001`, `CORE-DIAG-002`, `CORE-ERROR-003`, `CORE-DET-002`, and
`CORE-INT-002`. Owners, normative source-of-truth paths, acceptance targets,
and initial status are recorded below so that implementation work cannot be
promoted from documentation alone.

| Candidate task | Expected ID | Priority | Triage decision | Owner | Normative source of truth | Acceptance test / evidence target | Initial status (historical baseline) | External or scope-deferred boundary kept separate |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `CORE-TASK-006` | `CORE-INPUT-002` | `P1` | Implementation-closable; queue | `relgeo/core` + language-service | `spec/id/core/01-overview.md`; `spec/id/core/06-error-model.md` | `core/src/__tests__/parser.test.ts`, `core/src/__tests__/diagnostics.test.ts`, and language-service range tests document parse representation and source-range/nullability behavior | `🌗 partial` | AST ownership depth and browser/host range evidence remain a contract/evidence follow-up |
| `CORE-TASK-007` | `CORE-MODEL-002` | `P1` | Implementation-closable; queue | `relgeo/core` + `relgeo/spec` | `spec/id/syntax/07-type-system.md`; `spec/id/geometry/13-object-model.md`, `15-composition-objects.md` | `core/src/__tests__/component.test.ts`, `structured_parameters.test.ts`, resolver/type checks, and compile-time public-type coverage assert typed values, identity, namespaces, collections, and component scope | `🌗 partial` | Consumer-specific schema generation and public-package evidence are separate |
| `CORE-TASK-001` | `CORE-VALID-003` | `P1` | Implementation-closable; queue | `relgeo/core` | `spec/id/core/06-error-model.md`; `spec/id/geometry/15-composition-objects.md`, `17-placement.md`, `20-geometry-queries.md` | `core/src/__tests__/semantic_contract_fixtures.test.ts`, `component.test.ts`, and validator/reference negatives assert stable code, path, object context, and namespace behavior | `🌗 partial` | Broader internal raw-throw inventory and consumer projection remain follow-up evidence |
| `CORE-TASK-008` | `CORE-VALID-004` | `P1` | Implementation-closable; queue | `relgeo/core` + geometry | `spec/id/geometry/14-geometry-objects.md`, `16-collection-objects.md`, `21-constraints.md` | Extend `path_holes.test.ts`, `boolean.test.ts`, `repeat_divide.test.ts`, `split.test.ts`, and validator negatives into a closure/degenerate/operation-mode matrix with stable diagnostics | `🌗 partial` | Expanded boolean/topology algorithms and cross-consumer parity remain separate work |
| `CORE-TASK-009` | `CORE-ERROR-001` | `P1` | Implementation-closable at the Core boundary; queue | `relgeo/core` + Playground | `spec/id/core/05-semantic-guarantees.md`; `spec/id/core/06-error-model.md`; `playground/README.md` | `core/src/__tests__/tolerant_resolver.test.ts`, `semantic_contract_fixtures.test.ts`, and `diagnostics.test.ts` assert bounded recovery, ordered diagnostics, and no compile/resolve success claim | `🌗 partial` | Playground/browser sequencing and accessibility evidence remain consumer-owned and unverified |
| `CORE-TASK-002` | `CORE-ERROR-002` | `P1` | Implementation-closable; queue | `relgeo/core` + CLI | `spec/id/core/06-error-model.md`; `cli/README.md` | Strict parser/validator/resolver/runtime/constraint fixtures plus CLI tests preserve phase, code, path, and exit projection without silent recovery | `🌗 partial` | Node 24, registry, and deployment evidence are not prerequisites for the local contract |
| `CORE-TASK-010` | `CORE-RESOLVE-003` | `P1` | Implementation-closable; queue | `relgeo/core` + geometry | `spec/id/geometry/16-collection-objects.md`, `19-collections.md`; `spec/id/core/05-semantic-guarantees.md` | `repeat_divide.test.ts`, `split.test.ts`, `boolean.test.ts`, and runtime fixtures assert stable identity/order, single/multi/empty/multipart result modes, and explicit errors | `🌗 partial` | New geometry algorithms and wider topology promotion remain separate |
| `CORE-TASK-012` | `CORE-RESOLVE-005` | `P1` | Implementation-closable at Core boundary; queue | `relgeo/core` + geometry | `core/README.md`; `spec/id/core/05-semantic-guarantees.md`; catalog §4.1 | `core/src/__tests__/projection.test.ts` plus CLI/renderer consumer comparator tests assert version, fields, keys, ordering, numbers, bounds, values, violations, views, and sheets | `🌗 partial` | Consumer migration, browser/Flutter host evidence, and public artifact verification remain external |
| `CORE-TASK-011` | `CORE-CONSTRAINT-002` | `P1` | Implementation-closable; queue | `relgeo/core` + geometry | `spec/id/core/06-error-model.md`; `spec/id/geometry/21-constraints.md` | `constraints_diagnostics.test.ts`, `semantic_contract_fixtures.test.ts`, and `v05-runtime-align-violation` assert path, involved objects, severity, origin, expected/actual, retained scene, and declaration order | `🌗 partial` | General constraint solving/automatic mutation remains `➖ not-applicable` |
| `CORE-TASK-003` | `CORE-DIAG-001` | `P0` | Implementation-closable; start first | `relgeo/core` | `spec/id/core/06-error-model.md`; catalog §4.1 shared fields | `structured_errors.test.ts`, `diagnostics.test.ts`, parser/validator/resolver/runtime/constraint fixtures, and a raw-throw inventory assert required code/message/phase/severity/path/context rules | `🌗 partial` | Source-range depth and published/host evidence remain bounded follow-ups |
| `CORE-TASK-004` | `CORE-DIAG-002` | `P1` | Implementation-closable; queue behind diagnostic contract | `relgeo/core` | `spec/id/core/05-semantic-guarantees.md`; `spec/id/core/06-error-model.md` | `core/src/__tests__/diagnostics.test.ts` asserts independent-fault aggregation, phase/range/path/code/message ordering, dedupe, truncation, repeatability, and strict semantic equivalence | `🌗 partial` | Broader fault classes and consumer reformatting evidence remain separate |
| `CORE-TASK-005` | `CORE-ERROR-003` | `P0` | Implementation-closable; start first | `relgeo/core` | `spec/id/core/06-error-model.md`; runtime fixtures 13, 17–20, 22 | Emitted-code/type-union inventory, `structured_errors.test.ts`, evaluator/resolver regressions, and runtime fixtures assert distinct actionable codes and no raw public throw | `⚠️ broken` | npm publication, registry install, and canonical host evidence are external; no new solver scope is implied |
| `CORE-TASK-013` | `CORE-DET-002` | `P1` | Implementation-closable; queue | `relgeo/core` + `relgeo/spec` | `spec/id/core/04-evaluation-order.md`; `spec/id/core/05-semantic-guarantees.md` | `projection.test.ts`, graph tests, diagnostic ordering tests, and a replay comparator assert stable IDs, dependency/collection order, numeric normalization, tolerance, and diagnostic paths | `🌗 partial` | Node 24/cross-platform replay is evidence-only and remains unverified |
| `CORE-TASK-014` | `CORE-INT-002` | `P1` | Core slice implementation-closable; consumer verification separate | `relgeo/core` + language-service + Playground | `core/README.md`; `playground/README.md`; `spec/id/core/06-error-model.md` | Language-service/worker tests and conformance assert edit → diagnostic → resolve boundary for valid, incomplete, and runtime-error inputs; browser E2E is recorded separately | `🌗 partial` | Browser E2E, accessibility, and host runtime are consumer evidence, not a Core implementation blocker |

Not selected as separate implementation tasks are only the evidence-only or
scope-deferred findings: fixture-16 promotion affecting
`CORE-EVAL-002`/`CORE-UNIT-001`/`CORE-INT-004`,
Node `>=24`/CI/registry/public-artifact/browser/Flutter-host runs, and the
general constraint solver or automatic geometry mutation. These remain
explicitly recorded as `? unverified`, `⏸️ deferred`, or `➖ not-applicable`;
they do not erase the `CORE-INT-004` parity task.

## Historical frozen diagnostic/semantic contract tranche

The detailed diagnostic/semantic audit slice below contains seven IDs within
the historical fourteen-row implementation selection; it is a focused audit
record, not an active queue. The earlier bounded implementation selection is
historical context:
`CORE-VALID-003`, `CORE-ERROR-002`, `CORE-RESOLVE-003`,
`CORE-CONSTRAINT-002`, `CORE-DIAG-001`, `CORE-DIAG-002`, and
`CORE-ERROR-003`. The detailed code/phase/object/path/ordering contract is
frozen in [expected catalog §4.1](./expected-capability-catalog.md#41-frozen-diagnostic-and-semantic-contract-scope).
This backlog records the ownership and evidence handoff so that a gap cannot
be promoted from documentation alone.

| Expected ID | Owner | Normative source of truth | Observed source / acceptance evidence | Status evidence |
| --- | --- | --- | --- | --- |
| `CORE-VALID-003` | `relgeo/core` | `spec/id/core/06-error-model.md`; geometry refs/scope specs | `core/src/validator.ts`, `core/src/resolver/eval-context.ts`; unknown-reference/private-export/placement/query/dependency negatives assert code/path/object context | `✔️ closed-local-bounded`; public reference failures normalize; source-range depth remains bounded |
| `CORE-ERROR-002` | `relgeo/core` + CLI | `spec/id/core/06-error-model.md`; `cli/README.md` | `core/src/parser.ts`, `validator.ts`, resolver boundary, CLI tests, invalid/runtime fixtures; strict phase distinction and CLI projection | `✔️ closed-local-bounded`; raw-path and canonical-host work are external evidence boundaries |
| `CORE-RESOLVE-003` | `relgeo/core` + geometry | `spec/id/geometry/16-collection-objects.md`, `19-collections.md`; core semantic guarantees | repeat/divide/split/boolean resolver tests plus fixtures 15/19/20/22/24; v0.5 Boolean multi returns ordered collection children while v0.4 compatibility remains covered | `✔️ closed-local-bounded`; broader topology coverage is additive maintenance |
| `CORE-CONSTRAINT-002` | `relgeo/core` + geometry | `spec/id/core/06-error-model.md`, `spec/id/geometry/21-constraints.md` | `core/src/resolver/constraints.ts`, `geometry/src/types.ts`, `v05-runtime-align-violation`; focused test asserts violation schema/order/resolved-scene retention | `✔️ closed-local-bounded`; relation/topology expansion and consumer coverage are additive maintenance |
| `CORE-DIAG-001` | `relgeo/core` | `spec/id/core/06-error-model.md`; catalog §4.1 shared fields | `core/src/types.ts`, `errors.ts`, `diagnostics.ts`, structured-error/fixture tests; public failures normalize or document nullable context | `✔️ closed-local-bounded`; production raw-throw inventory is clean, source-range coverage remains bounded |
| `CORE-DIAG-002` | `relgeo/core` (consumer projection consulted) | `spec/id/core/05-semantic-guarantees.md`, `06-error-model.md` | `core/src/diagnostics.ts`, `core/src/__tests__/diagnostics.test.ts`; deterministic phase/range/path/code/message order, dedupe, truncation, strict equivalence | `✔️ closed-local-bounded`; broader fault classes are additive maintenance |
| `CORE-ERROR-003` | `relgeo/core` | `spec/id/core/06-error-model.md`; fixtures 13, 17–20, 22 | `core/src/types.ts`, `errors.ts`, evaluator/resolver throw sites; coded internal errors, structured boundaries, and raw-throw regression inventory pass focused/runtime tests | `✔️ closed-local-bounded`; emitted-code/spec/type agreement is executable; consumer parity remains external evidence |

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
| New geometry algorithms or expanded boolean/topology engine behavior | Core + geometry implementation work | The closure covers the declared boundary; future algorithm expansion remains a separate implementation scope. |

## Candidate goal G-CORE-01 — Close public diagnostics and failure contracts

**Owner:** `relgeo/core`  
**Dependency:** error taxonomy, source paths, resolver/evaluator throw sites  
**Risk:** P0/P1; consumers cannot reliably act on unstable or missing codes

| Candidate task | Expected ID | Source status | Priority | Scope | Owner | Dependency | Acceptance test / evidence target | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `CORE-TASK-001` normalize reference and scope failures | `CORE-VALID-003` | `✔️` | P1 | core diagnostic boundary + language-service projection | core | graph, resolver context, diagnostic normalizer | Unknown reference, private component export, invalid placement/query, and dependency failures return stable code/path/object context in core and language-service tests | Maintain reference/scope regressions |
| `CORE-TASK-002` normalize strict compile/check failures | `CORE-ERROR-002` | `✔️` | P1 | core strict modes + CLI error mapping | core + CLI | public error taxonomy, CLI mapping | Parse, validation, resolution, runtime, and constraint failures remain phase-distinct with stable exit/diagnostic output | Maintain strict-mode table and CLI assertions |
| `CORE-TASK-003` publish complete diagnostic object contract | `CORE-DIAG-001` | `✔️` | P0 | core public diagnostic contract | core | error catalog, source path/range policy | Every public diagnostic has stable code, message, severity, path/context, and origin phase or an explicit nullable rule | Maintain catalog and boundary tests |
| `CORE-TASK-004` add deterministic multi-diagnostic aggregation | `CORE-DIAG-002` | `✔️` | P1 | core aggregation contract + language-service projection | core (language-service projection consulted) | ordering, truncation, primary-failure policy | One invalid document with multiple independent faults returns an ordered, stable diagnostic list without changing semantic outcome; ownership decision is documented | Maintain bounded aggregation and add faults additively |
| `CORE-TASK-005` reconcile runtime error code union | `CORE-ERROR-003` | `✔️` | P0 | core public error taxonomy + resolver/evaluator throws | core | `RelGeoErrorCode`, `spec/id/core/06-error-model.md`, resolver/evaluator throw sites | Normative error-model codes, public union, normalization, structured fixtures, and raw-boundary inventory agree | Maintain the emitted-code catalog assertion |

Related audit records: `CORE-GAP-001`, `CORE-GAP-002`.

## Candidate goal G-CORE-02 — Strengthen semantic model, recovery, and coverage

**Owner:** `relgeo/core` with `relgeo/spec`  
**Dependency:** AST/source-location decision, typed semantic model, fixture policy  
**Risk:** P1; incomplete contracts make downstream parity and debugging ambiguous

| Candidate task | Expected ID | Source status | Priority | Scope | Owner | Dependency | Acceptance test / evidence target | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `CORE-TASK-006` define parse representation and source-location boundary | `CORE-INPUT-002` | `✔️` | P1 | core parse contract + language-service range projection | core + language-service | parser marks, semantic-only public boundary | Syntax errors and semantic paths can be traced through a documented public representation; source-range behavior has executable parser/diagnostic tests | Maintain semantic/range boundary; no public AST promotion |
| `CORE-TASK-007` strengthen typed semantic model | `CORE-MODEL-002` | `✔️` | P1 | core public semantic types + spec alignment | core + spec | type system, object identity, component namespaces | Public types cover value/object/collection/component scope; compile-time and runtime tests pass | Maintain additive public typing |
| `CORE-TASK-008` expand topology and degenerate-input validation | `CORE-VALID-004` | `✔️` | P1 | core validator + geometry negative fixtures | core + geometry | path/boolean topology, tolerance | Invalid closure, holes, offsets, repeats, operations, dimensions, and annotations produce stable expected diagnostics across the active negative fixtures | Add fixtures only for newly promoted v0.5 behavior |
| `CORE-TASK-009` document and test bounded editor recovery | `CORE-ERROR-001` | `✔️` | P1 | core tolerant parser/resolver boundary + Playground verification | core + Playground | editor mode, tolerant resolver, UI diagnostic loop | Supported incomplete-source cases preserve editable diagnostics and never report compile/resolve success; unsupported recovery is explicit | Maintain bounded recovery tests |
| `CORE-TASK-010` complete collection/result-mode contract | `CORE-RESOLVE-003` | `✔️` | P1 | core collection resolver + geometry topology | core + geometry | repeat/divide/split/boolean identity, topology | Repeat/divide/split/boolean single/multi/empty/multipart cases preserve stable identity/order and return explicit mode errors | Maintain active v0.5 result-mode matrix |
| `CORE-TASK-011` complete structured constraint violations | `CORE-CONSTRAINT-002` | `✔️` | P1 | core violation schema + geometry projection | core + geometry | violation schema, severity/origin policy | Violations expose stable type/path/involved objects, expected/actual context, severity, and origin; valid/invalid fixtures cover the active relations | Add relation fixtures only when scope expands |

Related audit records: `CORE-GAP-003`, `CORE-GAP-004`.

## Candidate goal G-CORE-03 — Close deterministic semantic projection and consumer parity

**Owner:** `relgeo/core` with consumer owners  
**Dependency:** canonical serialization/order contract, shared fixtures, consumer hosts  
**Risk:** P1/P2; downstream rendering and parity claims remain bounded until proof exists

| Candidate task | Expected ID | Source status | Priority | Scope | Owner | Dependency | Acceptance test / evidence target | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `CORE-TASK-012` publish canonical resolved-scene projection | `CORE-RESOLVE-005` | `✔️` | P1 | core semantic projection + geometry consumer schema | core + geometry | `ResolvedScene`, serializer schema, numeric policy | Versioned projection specifies fields, identity, ordering, numeric normalization, values, bounds, violations, views, and sheets; CLI/renderer/Flutter consumers consume it | Maintain versioned projection and comparator fixtures |
| `CORE-TASK-013` define stable replay/order/tolerance contract | `CORE-DET-002` | `✔️` | P1 | core determinism contract + spec semantics | core + spec | graph, collections, diagnostics, serializer | Repeated local replay preserves IDs, dependency/collection order, numeric outputs, and diagnostic paths | Maintain canonical replay comparator; Node 24 is external evidence |
| `CORE-TASK-014` verify edit-to-preview consumer integration | `CORE-INT-002` | `✔️` | P1 | core boundary + language-service/Playground flow | core + language-service + Playground | worker sequencing, diagnostic contract | Local language-service/Playground/Flutter/conformance flow passes for valid, incomplete, and runtime-error documents without changing Core semantics | Browser E2E/accessibility remain consumer evidence |
| `CORE-TASK-015` refresh cross-consumer semantic parity evidence | `CORE-INT-004` | `✔️` | P2 | core semantic boundary + Flutter/renderer/Markdown consumers | core + Flutter/renderer/Markdown owners | shared fixtures, semantic comparator | Selected fixtures compare semantic objects, paths, diagnostics, ordering, and projection across TypeScript/Flutter; raw SVG bytes remain out of scope | Maintain semantic comparator fixtures; host CI remains external |

Related audit records: `CORE-GAP-005`, `CORE-GAP-006`, `CORE-GAP-007`.

## Evidence handoff for remaining gaps

The current local evidence boundary is recorded in this backlog and the
[reconciliation](./reconciliation.md): Core 49-file/537-test coverage,
direct language-service/renderer/CLI checks, conformance 401/401 across 27
fixtures, and the focused semantic-contract suite. No npm/pub.dev publication,
production deployment, canonical Node >=24 run, or deferred platform host was
used as a prerequisite. The root and Core revision boundaries remain recorded
in the implementation audit; no commit was created by this task.

| Remaining gap / limitation | Handoff owner | Dependency | Next actionable evidence |
| --- | --- | --- | --- |
| Source-range semantic representation is intentionally bounded (`CORE-INPUT-002`) | `relgeo/core` + language-service | Semantic-only Core boundary; richer editor ranges remain consumer-owned | Maintain supported semantic-path range fixtures; no public AST promotion in v0.5. |
| Diagnostic contract and aggregation maintenance (`CORE-DIAG-001`, `CORE-DIAG-002`) | `relgeo/core` | Error catalog and additive fault coverage | Maintain emitted-code/source-range inventory and consumer fixtures without changing strict resolution. |
| Runtime taxonomy maintenance (`CORE-ERROR-003`) | `relgeo/core` | Normative catalog, public union, normalizer | Keep the catalog/type-union check and consumer boundary regressions; production raw-throw inventory is clean. |
| Canonical projection maintenance (`CORE-RESOLVE-005`) | `relgeo/core` + geometry/consumer owners | Versioned comparator and additive migration | Keep projection field/order/number comparators across CLI, renderer, and Flutter consumers. |
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

1. The 2026-11-05 closure register is backed by source/test evidence listed
   above; later changes must add source/test evidence, not labels alone.
2. A future candidate task can move to implementation only after owner/dependency
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
