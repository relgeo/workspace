# Core Runtime Closure Report — 2026-11-05

**Boundary:** Core Runtime v0.5 local contract closure at the current workspace
checkout. This report is an evidence join, not a release, registry, CI, browser,
or host-runtime claim.

**Decision:** The 15 rows that were previously `🌗` or `⚠️` are closed as
`✔️` at their declared Core/consumer contract boundary. Residual Node 24,
browser, CI, registry, and host-platform evidence is recorded as a limitation
only; it does not reopen an implementation gap. No expected Core ID is silently
dropped or moved to `⏸️`.

## Evidence baseline

- Core: `core/src/` and `core/src/__tests__/`; `pnpm test` → 49 files / 537
  tests; `pnpm run lint`; `pnpm run build`.
- Shared conformance: `node scripts/run-conformance-fixtures.mjs` → 401/401
  assertions across 27 fixtures.
- Consumers: language-service 90 tests, CLI 38, remark-relgeo 16,
  remark-relgeo-hl 10 Vitest + 1 package-boundary, Playground 107, Flutter
  327; post-snapshot Flutter checks 17 tests.
- Compatibility: `pnpm run compatibility:check` → 283/283; the matrix now
  reflects the pinned spec revision, Core `0.5.2`, Playground `^0.5.0`, and
  Flutter `1.0.1+1`.
- Spec projection: `pnpm run spec:snapshot:check` → 35 Markdown files and the
  current digest; `core/07-closure-contracts.md` is included.
- Error taxonomy: `closure_contracts.test.ts` mechanically checks that every
  normative error-model code is present in `REL_GEO_ERROR_CODES`; the
  production raw-throw inventory is clean.

## Capability-by-capability closure

| ID | Final status | Source / owner | Test or evidence | Residual limitation / next owner |
| --- | --- | --- | --- | --- |
| `CORE-INPUT-001` | `✔️` | `core/src/parser.ts` | parser tests; active/legacy conformance | Node 24/release proof → workspace owner |
| `CORE-INPUT-002` | `✔️` | `core/src/parser.ts`, `core/src/types.ts` | source-range and diagnostic tests; language-service tests | Public boundary is semantic document + best-effort ranges, not a public AST → core/spec maintenance |
| `CORE-MODEL-001` | `✔️` | `core/src/types.ts`, parser/resolver | parser, section, sheet, and fixture tests | Generated spec/type drift check remains maintenance → spec owner |
| `CORE-MODEL-002` | `✔️` | `core/src/types.ts`, component/inherit model | recursive semantic-value typing; Core lint/build and 537 tests | Resolver-internal/generated-schema typing is maintenance, not a public contract gap → core owner |
| `CORE-MODEL-003` | `✔️` | `core/src/resolver/`, `core/src/units.ts` | unit, frame, placement, and conformance tests | Numeric policy consolidation remains maintenance → core owner |
| `CORE-VALID-001` | `✔️` | `core/src/parser.ts`, `validator.ts` | parser/validator and invalid-fixture tests | Additional raw internal paths are covered by taxonomy inventory → core owner |
| `CORE-VALID-002` | `✔️` | `core/src/validator.ts`, `evaluator.ts` | parameter, profile, evaluator, and unit tests | Exhaustive function matrix remains maintenance → core/spec owner |
| `CORE-VALID-003` | `✔️` | `core/src/validator.ts`, resolver context/graph | reference, component, cycle, and semantic-contract fixtures | Cross-surface dependency visualization is consumer work → consumer owners |
| `CORE-VALID-004` | `✔️` | `core/src/validator.ts`, geometry boundary | Boolean/path/hole/repeat/split tests; fixtures 25–27 | Unlisted future topology combinations are outside the active v0.5 contract → core/geometry owner |
| `CORE-ERROR-001` | `✔️` | tolerant parser/resolver boundary | tolerant resolver, incomplete-editor fixture, Flutter invalid-boundary tests | Recovery remains explicitly bounded and never implies strict success → core/Playground owners |
| `CORE-ERROR-002` | `✔️` | parser/validator/resolver modes; CLI | structured-errors, invalid/runtime fixtures, CLI 38 tests, conformance | Published-runtime evidence is external, not a Core prerequisite → CLI/workspace owner |
| `CORE-GRAPH-001` | `✔️` | `core/src/graph.ts` | dependency and Boolean dependency tests | Broader quoted/namespace negatives are maintenance → core owner |
| `CORE-GRAPH-002` | `✔️` | `core/src/graph.ts` | cycle tests and canonical dependency paths | Cross-platform replay requires Node 24 → workspace owner |
| `CORE-EVAL-001` | `✔️` | `core/src/evaluator.ts` | evaluator/type and arithmetic regressions | Syntax-only placeholder semantics remain documented → core owner |
| `CORE-EVAL-002` | `✔️` | resolver value/phase pipeline | derived/component/parameter tests and fixture 16 replay | Fixture 16 remains a candidate promotion, explicitly not a required capability status → core/Flutter owners |
| `CORE-EVAL-003` | `✔️` | evaluator geometry queries/frames | query, intersection, frame, tangent, and conversion tests | Additional selector overloads are maintenance → core/geometry owner |
| `CORE-UNIT-001` | `✔️` | `core/src/units.ts` | unit tests and conformance | Fixture 16 cross-consumer promotion remains deferred by scope decision → core/Flutter owners |
| `CORE-RESOLVE-001` | `✔️` | resolver dispatcher/primitives | resolver, geometry, component, and active fixtures | Supported object-combination table remains maintenance → core owner |
| `CORE-RESOLVE-002` | `✔️` | placement/anchor/transform resolvers | frame, smart-placement, anchor, inherit, and component tests | Additional consumer parity is evidence expansion → consumer owners |
| `CORE-RESOLVE-003` | `✔️` | repeat/divide/split/Boolean resolvers | fixtures 19/20/22/24, 25–27; Core suite and conformance | Broader mixed-topology cases are outside the active v0.5 closure boundary → core/geometry owner |
| `CORE-RESOLVE-004` | `✔️` | view/sheet/role resolver output | sheet/view/reference fixtures and consumer conformance | SVG styling remains renderer-owned → renderer owner |
| `CORE-RESOLVE-005` | `✔️` | `core/src/projection.ts` | projection/replay tests, CLI/renderer comparators, conformance | External host replay remains evidence-only → workspace/consumer owners |
| `CORE-CONSTRAINT-001` | `✔️` | `core/src/resolver/constraints.ts` | relation diagnostics and runtime-align fixture | General automatic solving is explicit `➖` scope, not a gap → product/spec owner |
| `CORE-CONSTRAINT-002` | `✔️` | Core constraint emission + geometry diagnostic types | constraint tests, fixture 14, conformance, Flutter diagnostic test | New relation kinds require additive fixtures → core/geometry owner |
| `CORE-DIAG-001` | `✔️` | `core/src/errors.ts`, `diagnostics.ts` | structured errors, source paths/ranges, invalid/runtime fixtures, code catalog test | Deep nested source ranges remain bounded by contract → core/language-service owner |
| `CORE-DIAG-002` | `✔️` | `core/src/diagnostics.ts` | aggregation ordering, dedupe, truncation, strict-equivalence tests | Broader adapter fault classes are additive maintenance → core owner |
| `CORE-ERROR-003` | `✔️` | `core/src/types.ts`, `errors.ts`, evaluator/resolver boundaries | normative catalog assertion, structured-error tests, runtime fixtures, raw-throw inventory | New codes require catalog/type/normalizer/fixture updates; no current taxonomy drift remains → core owner |
| `CORE-DET-001` | `✔️` | graph/resolver/projection ordering | Core replay/projection tests and conformance | Node 24/cross-platform proof remains external → workspace owner |
| `CORE-DET-002` | `✔️` | projection, graph, collections, diagnostics | projection, cycle, collection, diagnostics tests and conformance | Host-process replay is evidence-only → workspace owner |
| `CORE-API-001` | `✔️` | `core/src/index.ts`, package exports | Core build/lint and consumer imports | Generated API docs remain maintenance → core owner |
| `CORE-API-002` | `✔️` | renderer-neutral scene/bounds projection | projection, CLI, renderer, and semantic snapshot tests | Projection evolution is versioned and additive → core/geometry owner |
| `CORE-COMPAT-001` | `✔️` | parser/version policy and matrix | compatibility check 283/283; active conformance | Consumer schema drift check remains maintenance → workspace/spec owner |
| `CORE-COMPAT-002` | `✔️` | parser legacy/future handling | v0.4, v0.6, v1.0 and invalid fixture tests | Historical support remains fixture-bounded → core/spec owner |
| `CORE-COMPAT-003` | `✔️` | package metadata and compatibility matrix | compatibility check 283/283; package/consumer metadata | Registry/public artifact verification is intentionally not required → workspace owner |
| `CORE-INT-001` | `✔️` | Core/CLI boundary | CLI 38 tests and conformance | Published CLI runtime proof remains external → CLI owner |
| `CORE-INT-002` | `✔️` | language-service + Playground worker boundary | language-service 90, Playground 107, conformance, Flutter recovery checks | Browser E2E/accessibility/host sequencing remain consumer evidence → Playground owner |
| `CORE-INT-003` | `✔️` | `fixtures/manifest.json`, conformance runner | 401/401 across 27 active/legacy/invalid/runtime/capability fixtures | Manifest is declared-surface evidence, not exhaustive DSL coverage → workspace owner |
| `CORE-INT-004` | `✔️` | Core projection + TS/Markdown/Flutter boundaries | renderer/CLI/language-service/remark/Playground/Flutter tests and conformance | Raw SVG bytes, UX, and host CI remain out of semantic scope → consumer owners |

## Explicit scope decisions and residual findings

1. The public parser boundary is a structured semantic document with
   best-effort source ranges. A public AST/source-range ownership model is not
   part of the v0.5 Core contract; language-service may expose richer editor
   ranges without changing Core semantics.
2. Fixture 16 (`v05-evaluator-units-candidate`) remains a candidate promotion
   and is not silently promoted into the active cross-consumer contract. Its
   local Core behavior is already covered; promotion requires a separate
   shared Flutter/consumer snapshot decision.
3. General constraint solving/automatic geometry mutation remains `➖`
   not-applicable. Core validates post-resolve constraints and retains the
   resolved scene; it does not repair geometry.
4. Node `>=24`, remote CI, registry/npm publication, browser E2E, Flutter host
   execution, and deployment are evidence/deployment boundaries, not
   prerequisites for this local Core closure.

## Authoritative handoff links

- [Status matrix](./status-matrix.md)
- [Implementation audit](./implementation-audit.md)
- [Reconciliation](./reconciliation.md)
- [Implementation-gap backlog](./implementation-gap-backlog.md)
- [Coverage validation handoff](./coverage-validation-handoff.md)
- [Cross-surface consumer parity record](../cross-surface/core-runtime-consumer-parity-2026-11-05.md)
- [Compatibility matrix](../../compatibility-matrix.json)
- [Repository map](../../REPOSITORY-MAP.md)
- [Master maturation plan](../../MATURATION-MASTER-PLAN.md)
