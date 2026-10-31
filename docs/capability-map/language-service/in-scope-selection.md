# Language-Service bounded in-scope selection

**Date:** 2026-10-30  
**Status:** bounded active selection; selection is not implementation or
completion evidence  
**Task:** `select-and-bound-in-scope-capability-debt--1181746432`  
**Owner boundary:** `relgeo/language-service` owns the editor-intelligence
contract. `relgeo/core` remains the semantic authority; Playground, MCP, and
other hosts remain consumers or adjacent owners where explicitly named below.

## Decision

This tranche selects seven actionable gaps from the expected capability
catalog, the implementation audit/status matrix, and the implementation-gap
backlog. The set is bounded to local language-service contract hardening:
package-contract truth, incomplete-source diagnostics, active vocabulary
drift, geometry-aware and recovery-aware completion, exact editor ranges, and
result identity for stale-response protection.

The selected status symbols were the pre-implementation intake symbols. The
reconciliation now records bounded evidence and promotes only the repaired
package contract to `✔️`; the six remaining selected rows stay `🌗`. No npm publication, registry install,
deployment, browser/public runtime, or deferred MCP/Flutter scope is a
prerequisite for this tranche.

## Evidence and selection inputs

| Input | Role in this selection |
| --- | --- |
| [Expected capability catalog](./expected-capability-catalog.md) | Defines stable expected IDs, owners, normative source paths, and language-service versus host boundaries. |
| [Implementation audit](./implementation-audit.md) and [archived evidence log](./archive/implementation-audit-legacy.md) | Records observed implementation/test paths and evidence limitations. |
| [Status matrix](./status-matrix.md) and [reconciliation](./reconciliation.md) | Supplies the current honest status symbol and separates implementation, evidence, and scope. |
| [Implementation-gap backlog](./implementation-gap-backlog.md) | Supplies candidate task IDs, owner, dependency, scope, and acceptance targets. |
| [`language-service/`](../../../language-service/) | Primary implementation boundary for service, schema, completion, token, and public API checks. |

## Bounded active selection

Each row has one expected capability ID, one backlog candidate, an owner,
source-of-truth path, observed implementation/test path, contract boundary,
and explicit acceptance behavior. Dependencies are sequencing constraints,
not additional scope.

| Selected task / expected ID | Current status | Owner | Source of truth | Observed implementation / test paths | Contract boundary | Explicit acceptance behavior |
| --- | --- | --- | --- | --- | --- | --- |
| `LS-TASK-022` — package/docs API and version repair (`LS-CONS-005`) | `✔️` local / `⚠️` intake | `relgeo/language-service` | [`language-service/README.md`](../../../language-service/README.md); [`language-service/package.json`](../../../language-service/package.json); catalog row `LS-CONS-005` | [`language-service/src/index.ts`](../../../language-service/src/index.ts); [`language-service/src/__tests__/language_service.test.ts`](../../../language-service/src/__tests__/language_service.test.ts); README/package metadata | Public package docs, exports, and compatibility-line metadata must describe the same API and version. This repair does not require publishing. | README matches `0.5.1`, `getSchema()` is implemented, and a focused API/version regression test passes; packed/registry delivery remains unverified. |
| `LS-TASK-001` — tolerant syntax diagnostics (`LS-DIAG-002`) | `🌗` | `relgeo/language-service` + `relgeo/core` | [`spec/id/core/01-overview.md`](../../../spec/id/core/01-overview.md); [`spec/id/core/06-error-model.md`](../../../spec/id/core/06-error-model.md); catalog row `LS-DIAG-002` | [`language-service/src/service.ts`](../../../language-service/src/service.ts) `getDiagnostics`; [`language-service/src/__tests__/language_service.test.ts`](../../../language-service/src/__tests__/language_service.test.ts); core parser/diagnostic boundary | Core owns parsing and semantic truth; language-service owns editor-facing diagnostic aggregation and source projection. Incomplete input must remain editable. | Incomplete YAML/DSL fixtures return stable, actionable diagnostics without dropping the document; service and focused fixture tests pass. |
| `LS-TASK-005` — schema drift checker (`LS-SCHEMA-002`) | `🌗` | `relgeo/language-service` + `relgeo/spec` | [`spec/id/core/02-document-structure.md`](../../../spec/id/core/02-document-structure.md); catalog row `LS-SCHEMA-002`; active spec vocabulary | [`language-service/src/schema.ts`](../../../language-service/src/schema.ts); [`language-service/src/completions.ts`](../../../language-service/src/completions.ts); [`language-service/src/__tests__/language_service.test.ts`](../../../language-service/src/__tests__/language_service.test.ts) | `spec/id` is normative. The language service publishes an editor schema/catalog adapter and must not silently advertise unsupported active vocabulary. | A deterministic drift report covers active sections, object types, fields, parameters, views, sheets, and presentation fields; the fixture baseline is stable. |
| `LS-TASK-007` — semantic geometry completion context (`LS-COMP-002`) | `🌗` | `relgeo/language-service` + `relgeo/core` | [`spec/id/geometry/`](../../../spec/id/geometry/); catalog row `LS-COMP-002`; backlog task `LS-TASK-007` | [`language-service/src/service.ts`](../../../language-service/src/service.ts) `getCompletions`; [`language-service/src/completions.ts`](../../../language-service/src/completions.ts); language-service tests | Language-service owns bounded completion projection; core/spec supply semantic meaning. This is not a general constraint solver or implicit geometry mutation. | Object IDs, anchors, components, repeats, paths, and selectors return bounded context-correct items or documented empty results in focused completion tests. |
| `LS-TASK-008` — partial/error completion suite (`LS-COMP-003`) | `🌗` | `relgeo/language-service` | [`docs/plans/05-public-docs-and-playground-hardening.md`](../../plans/05-public-docs-and-playground-hardening.md); catalog row `LS-COMP-003` | [`language-service/src/service.ts`](../../../language-service/src/service.ts) `tryParseDoc`/`getCompletions`; [`language-service/src/__tests__/language_service.test.ts`](../../../language-service/src/__tests__/language_service.test.ts) | Language-service owns recovery-aware completion results; Playground owns recovery UI and session retention. Parser recovery remains a core boundary. | Typo, missing value, blank indented line, quoted ID, and incomplete geometry fixtures return useful completion without throwing. |
| `LS-TASK-011` — exact ranges across result families (`LS-RANGE-001`) | `🌗` | `relgeo/language-service` | [`docs/plans/11-mcp-agent-integration.md`](../../plans/11-mcp-agent-integration.md); catalog row `LS-RANGE-001` | [`language-service/src/service.ts`](../../../language-service/src/service.ts); [`language-service/src/tokens.ts`](../../../language-service/src/tokens.ts); [`language-service/src/__tests__/language_service.test.ts`](../../../language-service/src/__tests__/language_service.test.ts) | Language-service owns lossless source-location projection. Editor/MCP adapters may encode positions differently but may not invent or discard ranges. | Diagnostics, tokens, completion edits, hover, and semantic metadata expose tested exact ranges for representative multiline and quoted-ID inputs. |
| `LS-TASK-015` — service stale-result identity (`LS-INCR-002`) | `🌗` | `relgeo/language-service` + Playground | [`docs/plans/11-mcp-agent-integration.md`](../../plans/11-mcp-agent-integration.md); catalog row `LS-INCR-002` | [`language-service/src/service.ts`](../../../language-service/src/service.ts); Playground worker/request guard referenced by the audit; [`language-service/src/__tests__/language_service.test.ts`](../../../language-service/src/__tests__/language_service.test.ts) | Language-service returns serializable request/document identity; worker/session owners enforce ordering and reject stale responses. Service does not own persistence, undo, or UI state. | Out-of-order responses are rejected in a service-to-worker integration test; result identity is serializable and monotonic without changing semantic validation. |

## Sequencing and dependency boundary

The suggested implementation order is:

1. `LS-TASK-022` repairs the public contract independently.
2. `LS-TASK-001` and `LS-TASK-005` establish diagnostic and vocabulary
   baselines.
3. `LS-TASK-007` and `LS-TASK-008` close bounded semantic and recovery-aware
   completion behavior, with `LS-TASK-008` consuming the tolerant-parser
   behavior from `LS-TASK-001`.
4. `LS-TASK-011` establishes the range model; `LS-TASK-015` then carries
   request/document identity across the result boundary.

These are implementation-order constraints, not a claim that every row must
share one DTO or one release. The later audit task may refine dependencies
only when a source/test prerequisite is demonstrated.

## Deliberately excluded from active implementation

| Excluded item | Status | Reason |
| --- | --- | --- |
| `LS-TOKEN-001` context-preserving tokenization | `✔️` | The matrix and audit record a working local token surface; token vocabulary synchronization remains verification/maintenance, not selected debt. |
| `LS-DIAG-001`, `LS-DIAG-003`, `LS-VAL-001`, `LS-SCHEMA-001`, `LS-COMP-001`, `LS-DOC-001`, `LS-VERS-001` | `✔️` | These are not actionable gap rows for this tranche; their remaining limitations stay visible in the matrix. |
| `LS-DOC-003`, `LS-REC-002` | `➖` | Host-owned document/session identity and last-valid-preview retention are not language-service implementation work. |
| `LS-CONS-003`, `LS-CONS-004` | `🌗` current; historical selection was `⏸️` | Local MCP discovery and desktop active-document paths now exist; semantic service integration and ChatGPT Desktop write round-trip remain open. |
| All other `🌗`, `❌`, or `⚠️` backlog rows | current symbol in matrix | Visible candidate work, but outside this bounded tranche; they are not silently promoted or reclassified. |
| Node 24, registry, current CI, browser/public runtime, and native-host checks | `?` unverified | Evidence follow-ups only; unavailable environment evidence is not converted into implementation failure or a release prerequisite. |

No `➖` item is treated as active implementation work. The two MCP/desktop rows
were excluded from the 2026-10-30 selection baseline; current partial work and
remaining evidence are captured in the backlog and status matrix.

## Status accounting

| Check | Result |
| --- | ---: |
| Selected capability IDs | 7 |
| Selected `🌗` rows | 6 (`LS-DIAG-002`, `LS-SCHEMA-002`, `LS-COMP-002`, `LS-COMP-003`, `LS-RANGE-001`, `LS-INCR-002`) |
| Selected `❌` rows | 0 |
| Selected `⚠️` rows at intake | 1 (`LS-CONS-005`), now locally repaired |
| Selected `➖` or `⏸️` rows | 0 |
| Selected IDs with owner, source path, boundary, and acceptance behavior | 7/7 |

Changing this record, the backlog, or the matrix is not implementation
evidence. The selected rows now have focused source/test evidence recorded in
the audit; only `LS-CONS-005` is promoted to `✔️`, while the other six remain
partial with their residual gaps visible.
