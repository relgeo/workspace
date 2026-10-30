# Core Runtime bounded in-scope selection

**Date:** 2026-10-30
**Status:** bounded active selection; selection is not implementation or
completion evidence
**Owner boundary:** `relgeo/core` owns the semantic runtime contract. The
language-service, CLI, renderer, Playground, and Flutter remain consumers or
adjacent owners where explicitly named below.

## Decision

This tranche selects five actionable capabilities from the expected catalog,
the audited reconciliation/status matrix, and the implementation-gap backlog.
They form one bounded contract-hardening sequence: establish parser/source
context, normalize public diagnostics and runtime codes, add deterministic
aggregation, and define the resolved-scene projection consumed downstream.

The selection did not broaden scope. After implementation, status symbols are
re-audited honestly: bounded aggregation moved `CORE-DIAG-002` from `❌` to
`🌗`; no selected row is promoted to `✔️` because source-range coverage,
taxonomy exhaustiveness, and consumer migration remain incomplete. No registry
release, package publish, or deployment is a prerequisite for this tranche.

## Evidence and selection inputs

| Input | Role in this selection |
| --- | --- |
| [Expected capability catalog](./expected-capability-catalog.md) | Defines the stable expected IDs, core ownership, normative source paths, and contract boundaries. |
| [Implementation audit entry point](./implementation-audit.md) and [archived evidence log](./archive/implementation-audit-legacy.md) | Records observed source paths, tests, known raw-error/taxonomy drift, and evidence limits. |
| [Status matrix](./status-matrix.md) and [reconciliation](./reconciliation.md) | Supplies the current honest status symbol and the one-to-one capability finding. |
| [Implementation-gap backlog](./implementation-gap-backlog.md) | Supplies the candidate task, owner, dependency, and acceptance target for each selected ID. |
| [`core/`](../../../core) | Implementation boundary to inspect and change; consumer source is not silently counted as core implementation. |

## Bounded active selection

Each row has one expected capability ID, one backlog candidate, an owner,
source-of-truth path, observed implementation path, contract boundary, and
explicit acceptance behavior. Dependencies are sequencing constraints, not
additional scope.

| Selection / backlog task | Current status | Owner | Source of truth | Observed implementation / test paths | Contract boundary | Explicit acceptance behavior |
| --- | --- | --- | --- | --- | --- | --- |
| `CORE-TASK-006` — parse representation and source-location boundary (`CORE-INPUT-002`) | `🌗` | `relgeo/core` + language-service | [`spec/id/core/01-overview.md`](../../../spec/id/core/01-overview.md); [`spec/id/core/06-error-model.md`](../../../spec/id/core/06-error-model.md); catalog row `CORE-INPUT-002` | `core/src/parser.ts`; `core/src/types.ts`; `core/src/__tests__/parser.test.ts`; language-service range projection tests referenced by the audit | Core owns the structured parse/semantic boundary; source ranges may be projected to language-service, but parse success must not imply resolve success. | Document the public representation and range/nullability rule; add parser/diagnostic tests proving syntax paths and semantic paths remain traceable for supported inputs and incomplete editor inputs. |
| `CORE-TASK-003` — complete diagnostic object contract (`CORE-DIAG-001`) | `🌗` | `relgeo/core` | [`spec/id/core/06-error-model.md`](../../../spec/id/core/06-error-model.md); catalog row `CORE-DIAG-001`; fixture diagnostic expectations in [`fixtures/manifest.json`](../../../fixtures/manifest.json) | `core/src/types.ts` (`RelGeoError`/`RelGeoErrorCode`); `core/src/errors.ts`; `core/src/validator.ts`; `core/src/resolver/types.ts`; `core/src/__tests__/structured_errors.test.ts` | Public parser/validator/resolver diagnostics expose stable code, message, severity policy, path/context, and origin phase; CLI/language-service mappings consume this contract rather than inventing codes. | Every public diagnostic has the required fields or an explicit nullable rule; focused parse, validation, resolution, runtime, and constraint fixtures assert code/path/context/origin stability. |
| `CORE-TASK-004` — deterministic multi-diagnostic aggregation (`CORE-DIAG-002`) | `🌗` | `relgeo/core` (language-service is consulted for projection) | [`spec/id/core/06-error-model.md`](../../../spec/id/core/06-error-model.md); catalog row `CORE-DIAG-002`; reconciliation row `CORE-DIAG-002` | `core/src/diagnostics.ts` exports `collectDiagnostics`; focused tests cover parse and independent local validation faults while strict resolver behavior remains unchanged | Core owns the ordered diagnostic-list contract; language-service may project it. Truncation and primary-failure rules are explicit in the bounded API and must not change strict compile/resolve semantics. | Keep the stable list contract and expand fault coverage/source mapping before any `✔️` promotion. |
| `CORE-TASK-005` — reconcile runtime error code union (`CORE-ERROR-003`) | `⚠️` | `relgeo/core` | [`spec/id/core/06-error-model.md`](../../../spec/id/core/06-error-model.md); catalog row `CORE-ERROR-003`; runtime expectations in [`fixtures/manifest.json`](../../../fixtures/manifest.json) | `core/src/types.ts` (`RelGeoErrorCode`); `core/src/errors.ts`; `core/src/evaluator.ts`; `core/src/resolver/types.ts`; `core/src/resolver/primitives/shapes.ts`; `core/src/__tests__/validation_v04_spec.test.ts` | All actionable codes emitted by parser, validator, evaluator, and resolver must be represented by the public error taxonomy or normalized to a documented fallback; raw `Error` must not cross a public core boundary. | `BOOLEAN_EMPTY_RESULT` and every emitted actionable code are represented in the public union; runtime fixtures, type-level checks, and focused evaluator/resolver tests agree; uncategorized throws are normalized with path/object context. |
| `CORE-TASK-012` — canonical resolved-scene projection (`CORE-RESOLVE-005`) | `🌗` | `relgeo/core` + geometry | [`core/README.md`](../../../core/README.md); [`spec/id/core/05-semantic-guarantees.md`](../../../spec/id/core/05-semantic-guarantees.md); catalog row `CORE-RESOLVE-005` | `core/src/resolver/index.ts`; `core/src/projection.ts`; `core/src/types.ts`; `core/src/index.ts`; projection tests; resolved-scene consumers in `renderer-svg` and CLI | Core owns a typed, renderer-neutral `ResolvedScene`; renderer styling and raw SVG bytes remain outside this boundary. The versioned projection now defines schema metadata, explicit order, canonical keys/numbers, bounds, values, violations, views, and sheets. | Keep the versioned projection stable and add consumer migration/comparator evidence before any `✔️` promotion. |

## Dependencies and exclusions

The intended sequence is `CORE-TASK-006` → `CORE-TASK-003` →
`CORE-TASK-004`/`CORE-TASK-005` → `CORE-TASK-012`. The aggregation owner
decision is the only unresolved boundary decision in the selected set; it must
be recorded before implementation is treated as complete.

The remaining backlog candidates are visible candidate work, not active
implementation in this tranche. In particular, `CORE-TASK-007`/`008`/`009`,
`CORE-TASK-010`/`011`, `CORE-TASK-013`/`014`/`015`, and all other non-selected
rows are excluded from the active set. The following are explicitly excluded
from implementation:

No `CORE-EVAL-*` capability is selected: the matrix currently marks the
evaluator capability rows `✔️`. Evaluator throw-site normalization is included
only as an observed implementation path for `CORE-ERROR-003`; it does not
relabel a complete evaluator capability as a gap.

- `➖` general constraint solving/automatic geometry mutation: this remains a
  product non-goal; post-resolve violation reporting stays in scope.
- `⏸️` fixture 16 evaluator/unit promotion: this requires a human promotion
  decision and shared consumer snapshots; local evaluator/unit behavior is not
  silently promoted.
- `?` Node `>=24`, registry, current CI, browser E2E, and Flutter-host proof:
  these are evidence follow-ups, not reasons to relabel an implementation gap
  or prerequisites for this local contract tranche.

## Status accounting

| Check | Result |
| --- | ---: |
| Selected capability IDs | 5 |
| Selected `🌗` rows | 4 (`CORE-INPUT-002`, `CORE-DIAG-001`, `CORE-DIAG-002`, `CORE-RESOLVE-005`) |
| Selected `❌` rows | 0 |
| Selected `⚠️` rows | 1 (`CORE-ERROR-003`) |
| Selected `➖` or `⏸️` rows | 0 |
| Selected IDs with owner, source path, boundary, and acceptance behavior | 5/5 |

Changing this record, the backlog, or the matrix is not implementation
evidence. Each selected row requires the source/test/runtime evidence stated
above and a fresh status-matrix re-audit before its symbol changes.
