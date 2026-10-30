# Core Runtime Coverage Validation and Handoff

**Tanggal:** 2026-10-30  
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
| [Implementation audit evidence](./archive/implementation-audit-legacy.md) | Discovery report, source/test/consumer evidence, status vocabulary, limitations | PASS — all 38 expected IDs present; 7 `CORE-GAP-*` records are separate gap IDs |
| [Expected-versus-observed reconciliation](./reconciliation.md) | One-to-one join and separated implementation/evidence/scope dimensions | PASS — 38 rows, no missing/extra/duplicate |
| [Status matrix](./status-matrix.md) | Capability-first downstream status and action view | PASS — 38 rows, required decision columns present |
| [Implementation-gap backlog](./implementation-gap-backlog.md) | Candidate work handoff for non-complete capabilities | PASS — 15 tasks for 15 non-complete expected IDs |
| [`core/` source and tests](../../../core) plus the audit's local execution record | Implementation, tests, public exports, and runtime evidence | PASS — source/test/consumer evidence is linked in audit §§3.2–3.3; current local run limits are retained |
| [Repository map](../../REPOSITORY-MAP.md) | Ownership and repository boundary | PASS — `core/` is mapped to `relgeo/core`; consumers remain separate |
| [Capability inventory protocol](../INVENTORY-PROTOCOL.md) | Discovery categories, status/evidence axes, and expected-but-missing policy | PASS — applied to catalog, audit, reconciliation, matrix, and backlog |
| [Maturation master plan](../../MATURATION-MASTER-PLAN.md) | Roadmap, fixture, canonical-evidence, and scope context | PASS — current claims are qualified against historical/canonical freshness |
| [Compatibility matrix](../../compatibility-matrix.json) and [contract-versioning plan](../../plans/02-contract-versioning.md) | DSL line, legacy/future policy, package and consumer compatibility | PASS — active `0.5`, legacy `0.4`, regression `0.1–0.3`, future rejection retained |
| [Fixture manifest](../../../fixtures/manifest.json) | Active, legacy, invalid, runtime, and capability provenance | PASS — fixture status is retained; candidate fixture 16 is not silently promoted |

## 2. Mechanical coverage checks

| Check | Result | Interpretation |
| --- | --- | --- |
| Expected catalog IDs | 38 unique | Complete key set for this core catalog; not a claim of full DSL scope beyond the catalog. |
| Audit expected-ID coverage | 38/38 | Audit includes all expected IDs; its seven additional `CORE-GAP-*` rows are gap records, not expected capabilities. |
| Reconciliation rows | 38/38 | Exactly one join result per expected ID. |
| Status matrix rows | 38/38 | Exactly one capability-first matrix row per expected ID. |
| Backlog source IDs | 15/15 non-complete IDs | Every `🌗`, `❌`, and `⚠️` expected row has one candidate task. |
| Missing/extra/duplicate IDs | 0 / 0 / 0 | Across catalog → reconciliation → matrix; backlog has no missing or extra source ID. |
| Required source/doc paths | 21/21 exist | Core source, tests, consumer call sites, fixture manifest, repository map, master plan, compatibility, and plan paths checked. |
| Local Markdown links | 125 checked across six core artifacts | Missing local targets: 0. |
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

Matrix row result counts are 23 `✔️`, 13 `🌗`, 1 `❌`, and 1 `⚠️`. `➖`,
`⏸️`, and `?` are retained in explicit scope/evidence findings, so they do not
erase an expected implementation row.

### Evidence class

The audit defines the following evidence classes:

| Class | Meaning | Current use |
| --- | --- | --- |
| `E1` | Source/static inspection | Core source, types, exports, package metadata, consumer call sites. |
| `E2` | Local unit or fixture test | Core 44-file/427-test suite and shared fixture assertions. |
| `E3` | Local cross-surface/integration test | CLI, language-service, renderer, conformance, compatibility checks. |
| `E4` | Named CI/canonical evidence | Historical/current canonical records are referenced only with revision/date qualification. |
| `E5` | Public/registry evidence | Not inferred from local build; must be tied to a named artifact/run. |

This validation confirms that the current audit produced `E1`–`E3` evidence.
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
   verification were not rerun in this validation turn.
3. Current browser E2E and Flutter host verification are not substituted by
   TypeScript local tests.
4. 20 shared fixtures and 427 core tests are declared-surface evidence, not
   exhaustive coverage of every DSL combination, error path, tolerance, or
   consumer.
5. A passing documentation/coverage check does not close any implementation
   gap; the backlog remains candidate work.

## 5. Unresolved questions requiring human/product decisions

| Question | Affected IDs | Why it remains unresolved | Required decision/evidence |
| --- | --- | --- | --- |
| Does core own a public AST/source-range model, or only a semantic document model? | `CORE-INPUT-002`, `CORE-MODEL-002` | Parser and language-service currently divide syntax/source-location responsibility. | Choose ownership and specify public type/path contract. |
| Does deterministic multi-diagnostic aggregation belong in core or language-service? | `CORE-DIAG-002` | No core aggregation API was found; consumers can surface first failure. | Choose owner, ordering, truncation, and primary-failure rules; add executable test. |
| What are severity and origin semantics for constraint violations? | `CORE-CONSTRAINT-002`, `CORE-DIAG-001` | Current violation shape lacks stable severity/origin fields. | Approve schema and consumer rendering contract. |
| What is the canonical resolved-scene serialization/versioning contract? | `CORE-RESOLVE-005`, `CORE-DET-002`, `CORE-API-002` | Consumers use `ResolvedScene`, but canonical field/order/numeric rules are not formalized. | Approve semantic projection schema and snapshot comparator. |
| Should fixture 16 become active cross-consumer contract? | `CORE-EVAL-002`, `CORE-UNIT-001`, `CORE-INT-004` | Local core/CLI evidence exists, but manifest and Flutter posture remain candidate/partial. | Human promotion decision plus shared consumer snapshots. |
| Which current checkout/revision should be the canonical release evidence target? | `CORE-DET-001`, `CORE-COMPAT-003`, `CORE-INT-003` | Master plan contains named historical canonical/registry evidence; this turn did not rerun it. | Select target revision and run Node `>=24`, registry, CI, browser, and Flutter evidence. |

## 6. Implementation handoff

Implementation work is intentionally separate from this validation artifact.
The [implementation-gap backlog](./implementation-gap-backlog.md)
contains 15 candidate tasks:

- `G-CORE-01`: public diagnostics and failure contracts;
- `G-CORE-02`: semantic model, recovery, and validation coverage; and
- `G-CORE-03`: deterministic semantic projection and consumer parity.

Priority examples are `CORE-TASK-003`–`CORE-TASK-005` for error/diagnostic
contract closure, `CORE-TASK-004` for the explicit `❌` aggregation absence,
and `CORE-TASK-012`–`CORE-TASK-015` for serialization/replay/consumer
evidence. Assigning or completing those tasks requires implementation changes,
tests, and a fresh audit; editing this handoff, matrix, or backlog is not
implementation evidence.

## 7. Final validation statement

The core runtime **coverage map and handoff are structurally validated** for
the 38-ID catalog and the inspected source/evidence boundary. The core runtime
surface is **not declared complete**: the matrix still contains partial,
absent, and broken capabilities, and canonical/public evidence limitations are
explicitly unresolved. Further implementation must proceed as separate goals
from the candidate backlog, with status re-audited after each accepted change.

Primary references:

- [Repository map](../../REPOSITORY-MAP.md)
- [Maturation master plan](../../MATURATION-MASTER-PLAN.md)
- [Expected catalog](./expected-capability-catalog.md)
- [Implementation audit](./archive/implementation-audit-legacy.md)
- [Reconciliation](./reconciliation.md)
- [Status matrix](./status-matrix.md)
- [Gap backlog](./implementation-gap-backlog.md)
