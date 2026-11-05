# Core Runtime implementation audit

**Audit run:** 2026-11-05
**Boundary:** `core/` at submodule `ea74c9e`; workspace root closure checkout
**Compatibility line:** RelGeo DSL `0.5`
**Status:** current local source/evidence audit; not a Node 24, registry, CI,
browser, Flutter-host, or deployment claim

This document is the complete one-to-one audit of the 38 IDs in the [expected
catalog](./expected-capability-catalog.md). The [reconciliation](./reconciliation.md)
and [status matrix](./status-matrix.md) remain the status join; this audit
records what was actually inspected at the current checkout. The [archived
audit](./archive/implementation-audit-legacy.md) is historical and is not used
as current-pointer proof.

## Method and current evidence

The audit compared expected IDs against `core/src`, `core/src/__tests__`, the
fixture manifest and snapshots, the root conformance runner, and the named
consumer boundaries. A source/test hit is evidence only for the behavior it
covers. Missing host evidence is recorded as unverified, not as implementation
absence. Documentation, matrix rows, and backlog rows are not counted as
implementation evidence.

| Check | Result | Boundary / limitation |
| --- | --- | --- |
| `pnpm --dir core test` | **PASS — 49 files, 537 tests** | Fresh local Core source and regression evidence at `ea74c9e`, including public-boundary, aggregation, graph-context, Boolean dependency closure, evaluator taxonomy, closed-shape Boolean operand validation, ellipse-hole normalization, cyclic-clone guard, ellipse/Boolean collection traversal, v0.5 Boolean collection/validation regressions, v0.5 validator semantic-code preservation, projection compatibility rejection, split target validation, static invalid-offset rejection, normative error-catalog/scale/mirror/hole boundaries, inherit type conflict, repeat-along length failures, and turtle path-segment commands. |
| `pnpm --dir core run lint` | **PASS** | TypeScript static check for the current Core checkout. |
| `pnpm --dir core run build` | **PASS** | CJS, ESM, and declaration output; local build only. |
| `pnpm --dir language-service test` | **PASS — 2 files, 90 tests** | Direct consumer diagnostic/editor boundary; browser E2E not implied. |
| `pnpm --dir renderer-svg test` | **PASS — 7 files, 104 tests** | Semantic renderer boundary; raw SVG/host parity not implied. |
| `pnpm --dir cli test` | **PASS — 1 file, 38 tests** | CLI integration boundary; published package not implied. |
| `node scripts/run-conformance-fixtures.mjs` | **PASS — 401/401 across 27 fixtures** | Active, legacy, invalid, runtime, candidate, structured diagnostic, and consumer projections in the local workspace. |
| `if rg -n "throw new Error|throw Error\\(" core/src --glob '*.ts' --glob '!core/src/__tests__/**'; then exit 1; else echo production raw throw inventory clean; fi` | **PASS — production inventory clean** | Evaluator, validator, and resolver production sources use coded internal/structured errors; test-only assertion throws remain observational. Normative emitted-code/catalog agreement is asserted by `closure_contracts.test.ts`. |
| Expected catalog → reconciliation → matrix | **PASS — 38/38 IDs, 38 `✔️`, 0 `🌗`, 0 `❌`, 0 `⚠️`** | Final local closure statuses match the source/test/evidence register; residual external evidence is separately qualified. |

The current Core source includes the Geometry-closure changes: component-local
parameter order/scope, finite placement and collection guards, curve/frame
boundaries, hole-aware measurements, canonical cycle paths, recursive split
lowering, text semantics, custom anchors, repeat identity, and structured
constraint diagnostics. Those changes increase the local evidence to 537 tests
but do not by themselves close source-range, exhaustive taxonomy, consumer
migration, browser, or Flutter-host gaps. The active v0.5 Boolean `multi`
result now has explicit collection-child evidence in fixture 24; v0.4
flattened compatibility remains covered by the Boolean suite.
The invalid fixture tranche now includes fixtures 25–27 for operation-target,
reverse-target, and turtle-forward boundaries; the root runner checks their
structured Core code, parse phase, and semantic path and replays the code
through the language-service and CLI projections.

## Complete 38-ID audit register

Closure class is intentionally separate from the status symbol. The final
status register below uses `closed-local-bounded` for every expected capability;
the original partial/defect state and its implementation evidence are retained
in the closure report and backlog history:

- `closed-local-bounded` means the expected behavior is evidenced at the named
  local boundary; ordinary expansion or external proof remains qualified.
- `implementation-closable` and `contract-drift` are historical baseline
  labels for the work now closed in this checkout.
- `evidence-only/deferred` and `scope` are findings outside the 38 expected
  implementation rows; they are not silently used to turn a gap into `⏸️`.

### A. Input pipeline and semantic model

| ID | Baseline | Source inspected | Test / fixture evidence | Closure decision and next proof |
| --- | --- | --- | --- | --- |
| `CORE-INPUT-001` | `✔️` | `core/src/parser.ts`, version constants | `parser.test.ts`, `reference_fixtures.test.ts`, active/legacy/future conformance fixtures | `closed-local-bounded`; keep omitted-version and version-boundary regressions. |
| `CORE-INPUT-002` | `✔️` | `core/src/parser.ts`, `core/src/types.ts`, `sourceRangeForPath`/path diagnostics | `parser.test.ts`, `diagnostics.test.ts`, language-service tests, invalid fixtures | `closed-local-bounded`; semantic document plus best-effort ranges are the explicit v0.5 boundary; no public AST claim. |
| `CORE-MODEL-001` | `✔️` | `core/src/types.ts`, parser section construction, resolver document model | parser, sheet/view, reference-fixture, and conformance checks | `closed-local-bounded`; add generated spec-to-type drift checking only as maintenance. |
| `CORE-MODEL-002` | `✔️` | `core/src/types.ts` recursive public semantic unions and component/namespace fields | `component.test.ts`, `inherit_resolution.test.ts`, `structured_parameters.test.ts`, `group_anchors.test.ts`, lint/build | `closed-local-bounded`; public model is typed; resolver-internal/generated-schema typing remains maintenance. |
| `CORE-MODEL-003` | `✔️` | scene fields in `types.ts`, resolver context, `units.ts` | `unit_system.test.ts`, `units.test.ts`, frame/placement and conformance fixtures | `closed-local-bounded`; consolidate numeric policy only if the spec promotes it to a single public contract. |

### B. Validation and error recovery

| ID | Baseline | Source inspected | Test / fixture evidence | Closure decision and next proof |
| --- | --- | --- | --- | --- |
| `CORE-VALID-001` | `✔️` | `parser.ts`, `validator.ts` structural/schema branches | `parser.test.ts`, `validation_modes.test.ts`, `path_initial_segments.test.ts`, invalid fixtures | `closed-local-bounded`; raw internal throws are separately routed to taxonomy work, not hidden. |
| `CORE-VALID-002` | `✔️` | `validator.ts`, `evaluator.ts`, parameter/profile handling | `parameter_type_validation.test.ts`, `structured_parameters.test.ts`, `evaluator.test.ts`, unit fixtures | `closed-local-bounded`; retain exhaustive type/function coverage as maintenance. |
| `CORE-VALID-003` | `✔️` | `validator.ts`, `resolver/eval-context.ts`, component export/reference paths | `resolver.test.ts`, `component.test.ts`, `semantic_contract_fixtures.test.ts`, invalid reference fixtures, raw-throw inventory | `closed-local-bounded`; public reference/scope failures preserve code/path/object context. |
| `CORE-VALID-004` | `✔️` | `validator.ts` topology/operation branches, resolver shape checks | `validation_v04_spec.test.ts`, `path_holes.test.ts`, `boolean.test.ts`, repeat/grid negatives, fixtures 25–27 | `closed-local-bounded`; supported v0.5 topology/operation boundary is executable; future combinations are additive scope. |
| `CORE-ERROR-001` | `✔️` | parser editor mode and tolerant resolver behavior | `tolerant_resolver.test.ts`, `validation_modes.test.ts`, `v05-invalid-incomplete-editor`, Flutter invalid-boundary tests | `closed-local-bounded`; recovery is explicit and never claims strict compile/resolve success. |
| `CORE-ERROR-002` | `✔️` | parser/validator/resolver mode boundaries and CLI projection | `diagnostics.test.ts`, `structured_errors.test.ts`, invalid/runtime fixtures, CLI 38 tests, conformance | `closed-local-bounded`; strict phase/code/path projection is executable locally. |

### C. Dependency graph, evaluator, and units

| ID | Baseline | Source inspected | Test / fixture evidence | Closure decision and next proof |
| --- | --- | --- | --- | --- |
| `CORE-GRAPH-001` | `✔️` | `core/src/graph.ts`, expression dependency extraction | `dependency_v03.test.ts`, `group_cycles.test.ts`, resolver/evaluator tests | `closed-local-bounded`; broaden quoted/namespace negatives only as maintenance. |
| `CORE-GRAPH-002` | `✔️` | graph topological ordering and cycle diagnostics | `group_cycles.test.ts`, `dependency_v03.test.ts`, conformance cycle paths | `closed-local-bounded`; local canonical cycle paths are evidenced; host replay remains separate. |
| `CORE-EVAL-001` | `✔️` | `core/src/evaluator.ts`, syntax-only placeholder boundary | `evaluator.test.ts`, focused division-by-zero regression, expression/type tests | `closed-local-bounded`; actual arithmetic errors remain distinct from syntax-only evaluation. |
| `CORE-EVAL-002` | `✔️` | `resolver/values.ts`, resolver phase order, component-local evaluation | `derived_geo_access.test.ts`, `component.test.ts`, `structured_parameters.test.ts`, fixture 16 candidate | `closed-local-bounded`; fixture-16 promotion remains an explicit deferred decision. |
| `CORE-EVAL-003` | `✔️` | evaluator geometry queries, frames, intersections, coordinate conversion | `evaluator.test.ts`, `intersection_engine.test.ts`, `point_on_path.test.ts`, `tangent_normal.test.ts`, `frame_placement.test.ts` | `closed-local-bounded`; retain overload/selector negative coverage. |
| `CORE-UNIT-001` | `✔️` | `core/src/units.ts`, typed unit conversion and scene policy | `units.test.ts`, `unit_system.test.ts`, `parameter_type_validation.test.ts`, fixture 16 | `closed-local-bounded`; cross-consumer promotion of fixture 16 remains deferred. |

### D. Resolver and semantic execution

| ID | Baseline | Source inspected | Test / fixture evidence | Closure decision and next proof |
| --- | --- | --- | --- | --- |
| `CORE-RESOLVE-001` | `✔️` | resolver object dispatcher and primitive/operation handlers | `resolver.test.ts`, `geometry.test.ts`, boolean/path/component tests, active conformance fixtures | `closed-local-bounded`; keep the supported object-combination table current. |
| `CORE-RESOLVE-002` | `✔️` | placement, anchors, transforms, group/clone/component scope | `frame_placement.test.ts`, `smart_placement.test.ts`, `group_anchors.test.ts`, `inherit_resolution.test.ts`, component tests | `closed-local-bounded`; broader consumer parity is not a Core absence. |
| `CORE-RESOLVE-003` | `✔️` | repeat/divide/split/boolean resolvers and result-mode handling | `repeat_divide.test.ts`, `repeat_grid_revisi.test.ts`, `split.test.ts`, `boolean.test.ts`, semantic fixtures 19/20/22/24–27 | `closed-local-bounded`; active v0.5 identity/order/mode and invalid-target boundaries are covered. |
| `CORE-RESOLVE-004` | `✔️` | views, sheets, roles, metadata in resolver output | `sheet_view.test.ts`, reference fixtures, conformance sheet projections | `closed-local-bounded`; SVG styling remains renderer-owned. |
| `CORE-RESOLVE-005` | `✔️` | `core/src/projection.ts`, `projectResolvedScene`/serializer and exports | `projection.test.ts`, CLI/renderer/Flutter tests, replay assertions, conformance snapshots | `closed-local-bounded`; versioned semantic projection is consumed by the tested boundaries. |

### E. Constraints, diagnostics, and failure semantics

| ID | Baseline | Source inspected | Test / fixture evidence | Closure decision and next proof |
| --- | --- | --- | --- | --- |
| `CORE-CONSTRAINT-001` | `✔️` | `resolver/constraints.ts` post-resolve checks | `constraints_diagnostics.test.ts`, evaluator/constraint tests, fixture 14 and fixture 24 | `closed-local-bounded`; general solving remains out of scope. |
| `CORE-CONSTRAINT-002` | `✔️` | `geometry/src/types.ts` violation fields and `core/src/resolver/constraints.ts` emission | `constraints_diagnostics.test.ts`, `v05-runtime-align-violation`, conformance retention/replay, Flutter diagnostic test | `closed-local-bounded`; stable post-resolve schema is covered; new relation kinds are additive fixtures. |
| `CORE-DIAG-001` | `✔️` | `types.ts`, `errors.ts`, `diagnostics.ts`, parser/validator/resolver boundaries | `diagnostics.test.ts`, `structured_errors.test.ts`, semantic-contract/invalid/runtime fixtures, catalog assertion, raw-throw inventory | `closed-local-bounded`; public diagnostics and fallback normalization are stable. |
| `CORE-DIAG-002` | `✔️` | `core/src/diagnostics.ts` and stable sort/dedupe/truncation logic | `diagnostics.test.ts`, strict-equivalence regression, incomplete-editor fixture | `closed-local-bounded`; deterministic aggregation boundary is executable. |
| `CORE-ERROR-003` | `✔️` | `types.ts` code union, `errors.ts` mappings, evaluator/validator/resolver throw sites | `closure_contracts.test.ts` normative catalog assertion; diagnostics/structured-error tests, runtime fixtures, production raw-throw inventory | `closed-local-bounded`; public catalog/type/normalizer agreement is executable and future codes require additive updates. |

### F. Determinism, API, compatibility, and integration

| ID | Baseline | Source inspected | Test / fixture evidence | Closure decision and next proof |
| --- | --- | --- | --- | --- |
| `CORE-DET-001` | `✔️` | graph/resolver ordering and canonical projection helpers | Core replay/projection tests and conformance snapshots | `closed-local-bounded`; Node `>=24`/cross-platform replay remains unverified evidence, not a target failure. |
| `CORE-DET-002` | `✔️` | `projection.ts`, `graph.ts`, collection identity, diagnostic sorting | `projection.test.ts`, `dependency_v03.test.ts`, repeat tests, `diagnostics.test.ts`, conformance comparator | `closed-local-bounded`; v0.5 replay/order/normalization rules are executable; Node 24 replay is external evidence. |
| `CORE-API-001` | `✔️` | `core/src/index.ts`, package exports/types and package manifest | Core build/lint, consumer imports, CLI/language-service/renderer tests | `closed-local-bounded`; generated API contract is a maintenance improvement, not an absent API. |
| `CORE-API-002` | `✔️` | resolved scene/bounds and renderer-neutral projection | projection tests, CLI/renderer/conformance semantic snapshots | `closed-local-bounded`; projection versioning follow-up is tracked under `CORE-RESOLVE-005`. |
| `CORE-COMPAT-001` | `✔️` | parser version policy and active compatibility constants | parser tests, compatibility metadata, active 0.5 conformance fixtures | `closed-local-bounded`; keep schema/policy drift checks current. |
| `CORE-COMPAT-002` | `✔️` | legacy/future version handling in parser and compatibility policy | `validation_v04_spec.test.ts`, legacy fixtures, `v06`/`v10` invalid fixtures | `closed-local-bounded`; historical support remains fixture-bounded. |
| `CORE-COMPAT-003` | `✔️` | Core package metadata, active line, root compatibility declarations | conformance compatibility checks and package/consumer metadata review | `closed-local-bounded`; registry/public artifact evidence is not verified here and is not a Core implementation prerequisite. |
| `CORE-INT-001` | `✔️` | CLI/Core boundary and semantic command projection | `pnpm --dir cli test` (38), CLI fixtures, root conformance | `closed-local-bounded`; published-runtime verification remains external. |
| `CORE-INT-002` | `✔️` | language-service diagnostics and `playground/src/worker.ts` boundary | language-service 90, Playground 107, conformance edit/preview checks, Flutter recovery tests | `closed-local-bounded`; browser E2E/accessibility remain consumer evidence. |
| `CORE-INT-003` | `✔️` | `fixtures/manifest.json` and `scripts/run-conformance-fixtures.mjs` | 401/401 checks across 27 fixtures, including active/legacy/invalid/runtime/candidate classes and structured code/phase/path assertions | `closed-local-bounded`; manifest completeness beyond the declared set is ordinary maintenance. |
| `CORE-INT-004` | `✔️` | Core projection plus renderer/CLI/Markdown/Flutter semantic boundaries | renderer 104, CLI 38, language-service 90, remark/Playground/Flutter tests, root conformance | `closed-local-bounded`; semantic parity is closed locally; raw SVG/UX and host CI remain out of scope. |

## Gap classification and dependency handoff

The 15 historical incomplete rows are retained as traceable candidate tasks:
14 partial rows plus the former taxonomy defect. The current closure register
now resolves all 15 to `closed-local-bounded`; none is dropped or silently
reclassified as `⏸️`. The complete task definitions remain in the
[implementation-gap backlog](./implementation-gap-backlog.md):

| Class | IDs | Decision |
| --- | --- | --- |
| Closed-local-bounded | `CORE-INPUT-002`, `CORE-MODEL-002`, `CORE-VALID-003`, `CORE-VALID-004`, `CORE-ERROR-001`, `CORE-ERROR-002`, `CORE-RESOLVE-003`, `CORE-RESOLVE-005`, `CORE-CONSTRAINT-002`, `CORE-DIAG-001`, `CORE-DIAG-002`, `CORE-DET-002`, `CORE-INT-002`, `CORE-INT-004` | Source/test acceptance is complete at the declared local boundary; residual host evidence is separately qualified. |
| Closed-taxonomy | `CORE-ERROR-003` | Normative catalog assertion, public union, normalizer, runtime fixtures, and raw-throw inventory pass. |
| Evidence-only / deferred findings | Node `>=24`, CI, registry/public artifact, browser E2E, Flutter host; fixture 16 promotion | Record as `?` or `⏸️` outside the 38 implementation rows; no target failure inferred. |
| Scope exclusion | General constraint solver / automatic geometry mutation; raw SVG bytes/style/UX | Keep `➖`/consumer boundary; no implementation task is authorized by the current catalog. |

Dependency order for implementation work is: (1) public error/source-path and
typed-model decisions, (2) validator/recovery/collection/constraint closure,
(3) canonical projection and replay contract, then (4) browser and
cross-consumer parity evidence. The dependency does not make Node 24,
publication, deployment, or Flutter host execution a prerequisite for local
Core work.

## Revision and evidence boundary

- Core submodule revision: `ea74c9e`; the root gitlink is advanced together with
  this closure handoff.
- Core is intentionally dirty in this closure workspace because the audited
  implementation/tests and `closure_contracts.test.ts` are the task changes;
  generated `core/dist/` output used by build/conformance checks is not a
  source change.
- No npm/pub.dev publish, deployment, registry install, CI run, browser E2E,
  or Flutter-host run was used as evidence in this audit.
- The matrix now records **38 `✔️`, 0 `🌗`, 0 `❌`, 0 `⚠️`** at the local
  contract boundary. External host/registry/CI/browser evidence remains
  explicitly qualified and is not treated as an implementation prerequisite.

## Required sources

- [Expected capability catalog](./expected-capability-catalog.md)
- [Status matrix](./status-matrix.md)
- [Expected-versus-observed reconciliation](./reconciliation.md)
- [Implementation-gap backlog](./implementation-gap-backlog.md)
- [`core/`](../../../core)
- [`fixtures/manifest.json`](../../../fixtures/manifest.json)
