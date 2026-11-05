# Core Runtime Coverage Validation and Handoff

**Tanggal:** 2026-11-05
**Boundary:** core runtime capability baseline and gap map  
**Validation status:** coverage artifacts pass validation with explicit implementation and evidence limitations  
**Important:** this handoff does not claim that the core surface is complete or
that all capabilities are implemented.

## 1. Validation scope

Validation mencakup pasangan artifact berikut dan source boundary yang menjadi
dasarnya:

| Artifact / source | Validation role | Result |
| --- | --- | --- |
| [Expected catalog](./expected-capability-catalog.md) | Expected key set and user/requirement/scope/owner provenance | PASS — 38 unique expected IDs |
| [Current implementation audit evidence](./implementation-audit.md) and [archived detailed log](./archive/implementation-audit-legacy.md) | Discovery report, current source/test/consumer evidence, status vocabulary, limitations | PASS — all 38 expected IDs present; 7 `CORE-GAP-*` records are separate gap IDs |
| [Expected-versus-observed reconciliation](./reconciliation.md) | One-to-one join and separated implementation/evidence/scope dimensions | PASS — 38 rows, no missing/extra/duplicate |
| [Status matrix](./status-matrix.md) | Capability-first downstream status and action view | PASS — 38 rows, required decision columns present |
| [Implementation-gap backlog](./implementation-gap-backlog.md) | Candidate work handoff for non-complete capabilities | PASS — 15 tasks for 15 non-complete expected IDs |
| [`core/` source and tests](../../../core) plus the audit's local execution record | Implementation, tests, public exports, and runtime evidence | PASS — current execution records 49 test files/537 tests, rebuilt Core output, and explicit local run limits |
| [Repository map](../../REPOSITORY-MAP.md) | Ownership and repository boundary | PASS — `core/` is mapped to `relgeo/core`; consumers remain separate |
| [Capability inventory protocol](../INVENTORY-PROTOCOL.md) | Discovery categories, status/evidence axes, and expected-but-missing policy | PASS — applied to catalog, audit, reconciliation, matrix, and backlog |
| [Maturation master plan](../../MATURATION-MASTER-PLAN.md) | Roadmap, fixture, canonical-evidence, and scope context | PASS — current claims are qualified against historical/canonical freshness |
| [Compatibility matrix](../../compatibility-matrix.json) and [contract-versioning plan](../../plans/02-contract-versioning.md) | DSL line, legacy/future policy, package and consumer compatibility | PASS — active `0.5`, legacy `0.4`, regression `0.1–0.3`, future rejection retained |
| [Fixture manifest](../../../fixtures/manifest.json) | Active, legacy, invalid, runtime, and capability provenance | PASS — fixture status is retained; candidate fixture 16 is not silently promoted |

## 1.1 Current execution evidence — 2026-11-05

The following commands were executed against the current working tree. They
are local E1–E3 evidence only; they do not replace Node `>=24`, remote CI,
registry/public-artifact, browser, or Flutter-host evidence.

| Command | Result | Boundary checked |
| --- | --- | --- |
| `pnpm --dir core exec vitest run src/__tests__/parser.test.ts src/__tests__/resolver.test.ts src/__tests__/evaluator.test.ts src/__tests__/diagnostics.test.ts src/__tests__/structured_errors.test.ts src/__tests__/projection.test.ts src/__tests__/semantic_contract_fixtures.test.ts src/__tests__/constraints_diagnostics.test.ts src/__tests__/tolerant_resolver.test.ts src/__tests__/component.test.ts src/__tests__/repeat_divide.test.ts src/__tests__/split.test.ts src/__tests__/path_holes.test.ts src/__tests__/boolean.test.ts` | **PASS — 14 files, 175 tests** | Parser, resolver, evaluator, diagnostics, semantic projection, recovery, component/model, collection/result modes, holes, booleans, and constraint negatives. |
| `pnpm --dir core test -- --run` | **PASS — 49 files, 537 tests** | Full Core regression suite, including all focused behavior and existing compatibility regressions. |
| `node scripts/run-conformance-fixtures.mjs` | **PASS — 401 passed, 0 failed across 27 fixtures** | Shared active/legacy/invalid/runtime-diagnostic/runtime-error/capability fixtures, semantic snapshots, runtime error codes, structured invalid code/phase/path assertions, CLI, language-service, renderer, Markdown, and highlighting projections. |
| `pnpm run spec:snapshot:sync` followed by `pnpm run spec:snapshot:check` | **PASS — 35 Markdown files, digest `sha256:f194e9ca245723687ebd9c21be839fb576bf9f02f6bdb207a8d92ab581b1f250`** | Flutter's checked-in v0.5 spec projection now includes the closure-contract source and matches `spec/id`. |
| `pnpm --dir geometry run build && pnpm --dir core run lint && pnpm --dir core run build` | **PASS** | Geometry and Core declarations/build artifacts compile locally; generated output is verification-only and is not tracked. |
| `node --input-type=module -e 'import{readFileSync as r}from"node:fs";const d=["implementation-audit.md","implementation-gap-backlog.md","reconciliation.md","status-matrix.md"].map(f=>r("docs/capability-map/core-runtime/"+f,"utf8"));const v=JSON.parse(r("fixtures/expected/14-v05-runtime-align-violation.json","utf8"));if(d.some(x=>!x.includes("CORE-CONSTRAINT-002"))||!d[0].includes("401/401")||!d[1].includes("537 passed")||v.violations?.[0]?.origin!=="constraint")throw Error("coverage evidence mismatch");console.log("Core coverage evidence and constraint fixture synchronized")'` | **PASS** | Current audit/backlog/reconciliation/matrix entries and runtime violation fixture contain synchronized implementation evidence. |
| `pnpm run compatibility:check` | **PASS — 283 passed, 0 failed** | Active `0.5` line, pinned spec revision, Core `0.5.2` package metadata, Playground `^0.5.0` dependency range, and Flutter `1.0.1+1` application metadata are synchronized. |
| `pnpm test` in `language-service` | **PASS — 2 files, 90 tests** | Language-service parser, diagnostic, semantic-token, and structured-error projections remain compatible with the current Core contract. |
| `pnpm test` in `cli` | **PASS — 1 file, 38 tests** | CLI parser, diagnostics, invalid-input rejection, and output projection remain compatible with the current Core contract. |
| `pnpm test` in `remark-relgeo` | **PASS — 16 tests** | Markdown preview, tolerant/strict diagnostics, deterministic transforms, and package boundary remain compatible. |
| `pnpm test` in `remark-relgeo-hl` | **PASS — 10 Vitest tests + 1 package-boundary test** | Highlighting and distribution boundary remain compatible. |
| `pnpm test` in `playground` | **PASS — 17 files, 107 tests** | Playground consumer integration and current Core dependency usage remain green locally. |
| `flutter test` in `flutter` | **PASS — 327 tests** | Flutter semantic projection, diagnostics, shared fixtures, graph/evaluator behavior, rendering contracts, and UI integration remain green locally. |
| `flutter test test/spec_snapshot_loader_test.dart test/reference_fixtures_test.dart test/invalid_fixture_boundary_test.dart` | **PASS — 17 tests** | Post-sync Flutter snapshot loading, shared fixture replay, and invalid-input boundary behavior remain green. |
| `node scripts/run-integration-gate.mjs --local` | **NOT VERIFIED — exit 2** | The gate stopped before integration stages because the current runtime is Node `22.23.2`; the declared prerequisite is Node `>=24`. |
| `pnpm run verify:baseline:strict` | **LIMITATION — 79 passed, 6 failed** | Baseline provenance is not clean for this in-progress closure: spec/Core/geometry/renderer worktrees contain expected uncommitted closure changes, and the manifest revision differs from the current Core and Geometry gitlinks. |

The compatibility policy remains the active DSL line `0.5`; local tests do not
constitute a release or registry-install claim. The current Core Runtime matrix
is `38 ✔️`, `0 🌗`, `0 ❌`, and `0 ⚠️` within the declared local closure
boundary.

## 2. Mechanical coverage checks

| Check | Result | Interpretation |
| --- | --- | --- |
| Expected catalog IDs | 38 unique | Complete key set for this core catalog; not a claim of full DSL scope beyond the catalog. |
| Audit expected-ID coverage | 38/38 | Audit includes all expected IDs; its seven additional `CORE-GAP-*` rows are gap records, not expected capabilities. |
| Reconciliation rows | 38/38 | Exactly one join result per expected ID. |
| Status matrix rows | 38/38 | Exactly one capability-first matrix row per expected ID. |
| Backlog source IDs | 15/15 historical closure IDs | Every previously incomplete expected row has one traceable closure record; current actionable count is zero. |
| Missing/extra/duplicate IDs | 0 / 0 / 0 | Across catalog → reconciliation → matrix; backlog has no missing or extra source ID. |
| Required source/doc paths | 21/21 exist | Core source, tests, consumer call sites, fixture manifest, repository map, master plan, compatibility, and plan paths checked. |
| Local Markdown links | 138 checked across seven core artifacts | Missing local targets: 0. |
| `git diff --check` | PASS | No whitespace errors in the changed documentation. |

The audit's count of 45 unique `CORE-*` identifiers is therefore not a
coverage mismatch: it is 38 expected IDs plus seven named `CORE-GAP-*` records.

## Capability-category coverage

Every declared category in the expected catalog has a corresponding audit
section and one-to-one reconciliation/matrix coverage. The counts sum to all
38 expected IDs; `CORE-GAP-*` records remain separate findings.

| Catalog category | Expected IDs | Audit/reconciliation coverage |
| --- | ---: | --- |
| A. Input pipeline and AST/semantic model | 5 | Audit §4A; reconciliation §3A; matrix rows `CORE-INPUT-*` and `CORE-MODEL-*` |
| B. Validation and error recovery | 6 | Audit §4B; reconciliation §3B; matrix rows `CORE-VALID-*` and `CORE-ERROR-001/002` |
| C. Dependency graph, evaluator, and units | 6 | Audit §4C; reconciliation §3C; matrix rows `CORE-GRAPH-*`, `CORE-EVAL-*`, and `CORE-UNIT-001` |
| D. Resolver and semantic execution | 5 | Audit §4D; reconciliation §3D; matrix rows `CORE-RESOLVE-*` |
| E. Constraints, diagnostics, and failure semantics | 5 | Audit §4E; reconciliation §3E; matrix rows `CORE-CONSTRAINT-*`, `CORE-DIAG-*`, and `CORE-ERROR-003` |
| F. Determinism, public API, compatibility, and integration | 11 | Audit §4F; reconciliation §3F; matrix rows `CORE-DET-*`, `CORE-API-*`, `CORE-COMPAT-*`, and `CORE-INT-*` |
| **Total** | **38** | **38/38 expected IDs** |

## 3. Legend, evidence class, and scope validation

### Status legend

The reconciliation and status matrix define all required result symbols:

| Symbol | Validated meaning |
| --- | --- |
| `✔️` | Implemented at the audited boundary with direct evidence; bounded, not exhaustive. |
| `🌗` | Partial implementation, coverage, or consumer parity. |
| `❌` | Expected and in scope, but implementation for the stated behavior was not found. |
| `➖` | Not applicable to core ownership; never a substitute for absence. |
| `⏸️` | Deferred promotion or expansion by scope/dependency decision. |
| `⚠️` | Confirmed defect or contract drift. |
| `?` | Evidence not verified; not an absence claim. |

Matrix row result counts are 38 `✔️`, 0 `🌗`, 0 `❌`, and 0 `⚠️`. `➖`,
`⏸️`, and `?` are retained only in explicit scope/evidence findings and do not
represent an actionable incomplete Core row.

### Evidence class

The audit defines the following evidence classes:

| Class | Meaning | Current use |
| --- | --- | --- |
| `E1` | Source/static inspection | Core source, types, exports, package metadata, consumer call sites. |
| `E2` | Local unit or fixture test | Current Core 49-file/537-test suite and shared fixture assertions. |
| `E3` | Local cross-surface/integration test | CLI, language-service, renderer, conformance, compatibility checks. |
| `E4` | Named CI/canonical evidence | Historical/current canonical records are referenced only with revision/date qualification. |
| `E5` | Public/registry evidence | Not inferred from local build; must be tied to a named artifact/run. |

This validation confirms that the current audit produced `E1`–`E3` evidence,
including direct local language-service (90 tests), CLI (38 tests), remark
consumer checks, Playground (107 tests), and Flutter (327 tests). The current
Core run adds 49 test files/537 tests, and the shared fixture run adds 401
conformance assertions across 27 fixtures.
The 2026-11-05 execution adds current Core evidence of 14 focused test files /
175 tests, 49 full-suite files / 537 tests, and 27 shared fixtures with 401
conformance assertions passing.
`E4`/`E5` are not promoted merely because the local commands passed. The
master plan records older canonical and registry evidence, including a named
canonical run and published package verification; those records remain
revision/date-specific and are not a fresh proof for every current checkout
claim.

## 4. Scope decisions and limitations

Validated scope decisions:

- `IN` capabilities remain core expected responsibilities.
- `IN WITH BOUNDARY` capabilities retain bounded behavior, such as editor
  recovery, boolean/result modes, semantic projection, and consumer parity.
- General constraint solving/automatic geometry mutation is `➖ not-applicable`;
  core reports post-resolve violations instead.
- Fixture 16 evaluator/unit cross-consumer promotion is `⏸️ deferred`; local
  evaluator/unit behavior is not silently upgraded to active parity.
- Core-owned UI routes, shortcuts, native services, and accessibility surfaces
  are `➖ not-applicable`; their consumer boundaries remain audited separately.

Limitations that remain open:

1. Current local verification used Node `22.23.2`, while package metadata
   requests Node `>=24`.
2. Current remote CI, a fresh registry install, and current public artifact
   verification were not rerun. The local compatibility check now passes after
   synchronizing the matrix with the current pinned spec/package/consumer
   metadata; the strict baseline check remains limited by the expected dirty
   closure worktrees and stale child gitlink manifest entries.
3. Current browser E2E and Flutter host verification are not substituted by
   TypeScript local tests.
4. 27 shared fixtures and 537 core tests are declared-surface evidence, not
   exhaustive coverage of every DSL combination, error path, tolerance, or
   consumer.
5. The implementation backlog is reconciled for the local closure boundary;
   remaining entries are maintenance, evidence-boundary, or explicit scope
   decisions rather than untracked implementation gaps.

## 5. Unresolved questions requiring human/product decisions

| Question | Affected IDs | Why it remains unresolved | Required decision/evidence |
| --- | --- | --- | --- |
| Does core own a public AST/source-range model, or only a semantic document model? | `CORE-INPUT-002`, `CORE-MODEL-002` | The local closure intentionally exposes a semantic document model with best-effort ranges; parser/language-service retain syntax ownership. | Any future public AST ownership change requires a new contract decision. |
| Does deterministic multi-diagnostic aggregation belong in core or language-service? | `CORE-DIAG-002` | Core owns the bounded ordering/truncation policy recorded in `collectDiagnostics`; broader fault coverage is maintenance. | Keep the core contract stable; add cases without reopening the status row. |
| What are the consumer rendering semantics for constraint violation metadata? | `CORE-CONSTRAINT-002`, `CORE-DIAG-001` | Core emits stable `severity`, `origin`, `expected`, and `actual` fields; consumer rendering remains consumer-owned. | Add comparator evidence when a consumer changes its presentation schema. |
| What is the canonical resolved-scene serialization/versioning contract? | `CORE-RESOLVE-005`, `CORE-DET-002`, `CORE-API-002` | Core exposes the versioned projection and serializer; downstream migration remains consumer maintenance. | Review the projection contract before any schema revision. |
| Should fixture 16 become active cross-consumer contract? | `CORE-EVAL-002`, `CORE-UNIT-001`, `CORE-INT-004` | Local core/CLI evidence exists, but manifest and Flutter posture remain explicitly held as a candidate. | Human promotion decision plus shared consumer snapshots. |
| Which current checkout/revision should be the canonical release evidence target? | `CORE-DET-001`, `CORE-COMPAT-003`, `CORE-INT-003` | Master plan contains named historical canonical/registry evidence; this turn did not rerun it. | Select target revision and run Node `>=24`, registry, CI, browser, and Flutter evidence. |

## 6. Implementation handoff

Implementation work is intentionally separate from this validation artifact.
The [implementation-gap backlog](./implementation-gap-backlog.md)
contains 15 candidate tasks:

- `G-CORE-01`: public diagnostics and failure contracts;
- `G-CORE-02`: semantic model, recovery, and validation coverage; and
- `G-CORE-03`: deterministic semantic projection and consumer parity.

Priority examples are `CORE-TASK-003`–`CORE-TASK-005` for error/diagnostic
contract closure and `CORE-TASK-012`–`CORE-TASK-015` for
serialization/replay/consumer evidence. Selected implementation changes and
focused tests now exist; remaining status promotion still requires the next
matrix re-audit and broader consumer/source-range evidence. Editing this
handoff, matrix, or backlog alone is not implementation evidence.

## 7. Final validation statement

The core runtime **coverage map and handoff are structurally validated** for
the 38-ID catalog and the inspected source/evidence boundary. The local Core
closure surface is **complete within its declared boundary**: the matrix has no
actionable partial, absent, or broken rows. Canonical/public evidence limits,
consumer-owned rendering, and external environment gates remain explicit
maintenance or deferred evidence work; they do not silently reopen Core gaps.

Primary references:

- [Repository map](../../REPOSITORY-MAP.md)
- [Maturation master plan](../../MATURATION-MASTER-PLAN.md)
- [Expected catalog](./expected-capability-catalog.md)
- [Current implementation audit](./implementation-audit.md)
- [Archived detailed audit log](./archive/implementation-audit-legacy.md)
- [Reconciliation](./reconciliation.md)
- [Status matrix](./status-matrix.md)
- [Gap backlog](./implementation-gap-backlog.md)
