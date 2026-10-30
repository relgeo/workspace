# CLI bounded in-scope selection

**Date:** 2026-10-30  
**Task:** `select-and-bound-in-scope-capability-debt--1182174321`  
**Status:** bounded active selection; selection is not implementation or
completion evidence  
**Owner boundary:** `relgeo/cli` owns command orchestration, input/output,
diagnostics transport, exit behavior, scripting streams, and package-boundary
behavior. `spec/`, `@relgeo/core`, and `@relgeo/renderer-svg` remain semantic
owners where explicitly named below.

## Decision

This tranche selects eleven actionable gaps from the expected capability
catalog, implementation audit, status/reconciliation view, and implementation-
gap backlog. It is bounded to one-shot CLI correctness and shell/CI usability:
stdin and input precedence, option and selector validation, file output,
diagnostics, exit codes, and stable scripting streams.

The selection does not require npm publication, registry installation, a Node
24-only environment, a new protocol decision, or a product-scope decision
about named `open`, config, or document watch. Capability status symbols remain
the audited intake values. No selected row is promoted to `✔️` by this record.

## Evidence and selection inputs

| Input | Role in this selection |
| --- | --- |
| [Expected capability catalog](./expected-capability-catalog.md) | Defines stable expected IDs, normative owners, source paths, and CLI versus delegated contract boundaries. |
| [Implementation audit](./implementation-audit.md) | Records observed command/source/test paths, confirmed defects, partial behavior, and environment limits. |
| [Status matrix](./status-matrix.md) and [reconciliation](./reconciliation.md) | Supplies the current honest status symbol and separates implementation, evidence, and scope. |
| [Implementation-gap backlog](./implementation-gap-backlog.md) | Supplies candidate task IDs, priorities, dependencies, owners, and acceptance targets. |
| [`cli/`](../../../cli) | Repository boundary for source, executable behavior, focused tests, and local verification. |

## Bounded active selection

Each row has one expected capability ID, one backlog candidate, an owner,
source-of-truth path, observed implementation/test path, contract boundary,
and explicit acceptance behavior. Dependencies are sequencing constraints, not
additional scope.

| Selected task / expected ID | Current status | Owner | Source of truth | Observed implementation / test paths | Contract boundary | Explicit acceptance behavior |
| --- | --- | --- | --- | --- | --- | --- |
| `CLI-TASK-003` — stdin pipeline input (`CLI-IN-002`) | `❌` | `relgeo/cli` | [`expected-capability-catalog.md`](./expected-capability-catalog.md) (`CLI-IN-002`); [`implementation-audit.md`](./implementation-audit.md) §3/§5; [`implementation-gap-backlog.md`](./implementation-gap-backlog.md) row `CLI-TASK-003` | [`cli/src/index.ts`](../../../cli/src/index.ts); [`cli/src/__tests__/cli.test.ts`](../../../cli/src/__tests__/cli.test.ts) | `-` is the stdin source for file-taking commands; CLI owns acquisition and stream routing, while core owns DSL meaning. | `relgeo compile - --format json` emits only JSON on stdout; empty or invalid stdin exits non-zero with source-aware stderr; ordinary file input remains unchanged. |
| `CLI-TASK-004` — input precedence and encoding (`CLI-IN-003`) | `🌗` | `relgeo/cli` | [`expected-capability-catalog.md`](./expected-capability-catalog.md) (`CLI-IN-003`); [`implementation-audit.md`](./implementation-audit.md) §5; [`implementation-gap-backlog.md`](./implementation-gap-backlog.md) row `CLI-TASK-004` | [`cli/src/index.ts`](../../../cli/src/index.ts); [`cli/src/__tests__/cli.test.ts`](../../../cli/src/__tests__/cli.test.ts) | CLI owns path/stdin precedence, empty-input handling, and UTF-8 reads; host filesystem behavior is an execution dependency. | An explicit path reads that path; `-` reads stdin; empty source and read/encoding failures have deterministic non-zero results and no misleading artifact. |
| `CLI-TASK-005` — profile, parameter, and unit matrix (`CLI-RENDER-002`) | `🌗` | `relgeo/cli` + `@relgeo/core`/`spec` | [`expected-capability-catalog.md`](./expected-capability-catalog.md) (`CLI-RENDER-002`); [`implementation-audit.md`](./implementation-audit.md) §5; [`implementation-gap-backlog.md`](./implementation-gap-backlog.md) row `CLI-TASK-005` | [`cli/src/index.ts`](../../../cli/src/index.ts); [`cli/src/__tests__/cli.test.ts`](../../../cli/src/__tests__/cli.test.ts) | CLI owns option parsing/forwarding; core/spec own profile, parameter type, evaluation, and unit semantics. | Representative `compile` and `check` cases cover profiles, numeric/string/boolean overrides, units, combinations, and unknown names; invalid intent fails non-zero rather than being ignored. |
| `CLI-TASK-006` — sheet/view selector validation (`CLI-RENDER-003`) | `🌗` | `relgeo/cli` + `@relgeo/renderer-svg` | [`expected-capability-catalog.md`](./expected-capability-catalog.md) (`CLI-RENDER-003`); [`implementation-audit.md`](./implementation-audit.md) §5; [`implementation-gap-backlog.md`](./implementation-gap-backlog.md) row `CLI-TASK-006` | [`cli/src/index.ts`](../../../cli/src/index.ts); [`cli/src/__tests__/cli.test.ts`](../../../cli/src/__tests__/cli.test.ts) | CLI owns selector mapping and failure transport; renderer/spec own sheet/view availability and SVG semantics. | A valid SVG selector matches the expected fixture; a missing or invalid selector exits non-zero with a stable diagnostic and produces no misleading artifact. |
| `CLI-TASK-007` — deterministic file output (`CLI-OUT-004`) | `🌗` | `relgeo/cli` | [`expected-capability-catalog.md`](./expected-capability-catalog.md) (`CLI-OUT-004`); [`implementation-audit.md`](./implementation-audit.md) §5; [`implementation-gap-backlog.md`](./implementation-gap-backlog.md) row `CLI-TASK-007` | [`cli/src/index.ts`](../../../cli/src/index.ts); [`cli/src/__tests__/cli.test.ts`](../../../cli/src/__tests__/cli.test.ts) | CLI owns stdout/file routing, parent creation, overwrite behavior, UTF-8 encoding, and write-failure reporting. | stdout contains only requested JSON/SVG/graph; a target file is created or deterministically overwritten, parent directories are created, and write failures exit non-zero without a success claim. |
| `CLI-TASK-008` — phase-aware diagnostic transport (`CLI-DIAG-001`) | `🌗` | `relgeo/cli` + `spec`/`@relgeo/core` | [`expected-capability-catalog.md`](./expected-capability-catalog.md) (`CLI-DIAG-001`); [`implementation-audit.md`](./implementation-audit.md) §5; [`spec/id/core/06-error-model.md`](../../../spec/id/core/06-error-model.md); [`implementation-gap-backlog.md`](./implementation-gap-backlog.md) row `CLI-TASK-008` | [`cli/src/index.ts`](../../../cli/src/index.ts); [`cli/src/__tests__/cli.test.ts`](../../../cli/src/__tests__/cli.test.ts); core diagnostic/error paths cited by the audit | spec/core remain authoritative for codes and semantics; CLI transports phase, severity, location, path, and object fields where available. | Parse, validation, reference, geometry, and post-resolution failures expose a stable envelope with code, phase, severity, message, and available location fields; human output remains readable. |
| `CLI-TASK-009` — machine-readable diagnostics (`CLI-DIAG-003`) | `❌` | `relgeo/cli` | [`expected-capability-catalog.md`](./expected-capability-catalog.md) (`CLI-DIAG-003`); [`implementation-audit.md`](./implementation-audit.md) §3/§5; [`implementation-gap-backlog.md`](./implementation-gap-backlog.md) row `CLI-TASK-009` | [`cli/src/index.ts`](../../../cli/src/index.ts); [`cli/src/__tests__/cli.test.ts`](../../../cli/src/__tests__/cli.test.ts) | CLI owns the machine-diagnostics flag and JSON envelope/stream contract; delegated packages supply semantic error data. | `--diagnostics json` emits a stable JSON diagnostic envelope on stderr for malformed, missing-file, and runtime failures, without color or prose; successful machine output remains on stdout. |
| `CLI-TASK-010` — exit-code taxonomy (`CLI-EXIT-001`) | `🌗` | `relgeo/cli` | [`expected-capability-catalog.md`](./expected-capability-catalog.md) (`CLI-EXIT-001`); [`implementation-audit.md`](./implementation-audit.md) §5; [`implementation-gap-backlog.md`](./implementation-gap-backlog.md) row `CLI-TASK-010` | [`cli/src/index.ts`](../../../cli/src/index.ts); [`cli/src/__tests__/cli.test.ts`](../../../cli/src/__tests__/cli.test.ts) | CLI owns stable numeric categories for success, usage, input, validation/runtime, and output/write failures; core error meaning remains delegated. | The documented taxonomy is stable and tested for unknown command/option, missing/invalid input, semantic failure, and write failure; no category silently returns success. |
| `CLI-TASK-011` — reject unsupported formats (`CLI-ERR-001`) | `⚠️` | `relgeo/cli` | [`expected-capability-catalog.md`](./expected-capability-catalog.md) (`CLI-ERR-001`); [`implementation-audit.md`](./implementation-audit.md) §3/§5; [`implementation-gap-backlog.md`](./implementation-gap-backlog.md) row `CLI-TASK-011` | [`cli/src/index.ts`](../../../cli/src/index.ts); [`cli/src/__tests__/cli.test.ts`](../../../cli/src/__tests__/cli.test.ts) | CLI owns the output-format allowlist and dispatch guard before core/render invocation. | An unsupported `--format` names the invalid value, exits non-zero, writes no artifact, and never falls through to JSON. |
| `CLI-TASK-012` — strict option and parameter validation (`CLI-ERR-002`) | `⚠️` | `relgeo/cli` | [`expected-capability-catalog.md`](./expected-capability-catalog.md) (`CLI-ERR-002`); [`implementation-audit.md`](./implementation-audit.md) §3/§5; [`implementation-gap-backlog.md`](./implementation-gap-backlog.md) row `CLI-TASK-012` | [`cli/src/index.ts`](../../../cli/src/index.ts); [`cli/src/__tests__/cli.test.ts`](../../../cli/src/__tests__/cli.test.ts) | CLI owns syntax/allowlist validation for formats, units, parameter tokens, profiles, sheets, and unknown options; valid string-like parameters remain supported. | Malformed `--param`, unsupported unit/format, unknown profile/sheet, and unknown option each exit non-zero and name the invalid value; no requested intent is silently ignored. |
| `CLI-TASK-016` — stable scripting streams and no-color (`CLI-AUTO-003`) | `🌗` | `relgeo/cli` | [`expected-capability-catalog.md`](./expected-capability-catalog.md) (`CLI-AUTO-003`); [`implementation-audit.md`](./implementation-audit.md) §5; [`implementation-gap-backlog.md`](./implementation-gap-backlog.md) row `CLI-TASK-016` | [`cli/src/index.ts`](../../../cli/src/index.ts); [`cli/src/__tests__/cli.test.ts`](../../../cli/src/__tests__/cli.test.ts) | CLI owns stdout/stderr separation and explicit color/progress controls; it does not alter delegated parse/resolve/render semantics. | JSON/SVG/graph stdout contains only requested data; progress and diagnostics stay on stderr; explicit no-color/CI mode is deterministic for `info`, `check`, and `compile`. |

## Sequencing and dependency boundary

The intended sequence is:

1. `CLI-TASK-011` and `CLI-TASK-012` stop false-success format and option
   handling.
2. `CLI-TASK-003` and `CLI-TASK-004` establish stdin and deterministic source
   selection.
3. `CLI-TASK-008` and `CLI-TASK-009` establish structured diagnostics and
   machine transport; `CLI-TASK-010` then establishes the exit categories.
4. `CLI-TASK-005`, `CLI-TASK-006`, and `CLI-TASK-007` close option/selector and
   file-output behavior.
5. `CLI-TASK-016` records the final stdout/stderr and no-color contract across
   the repaired paths.

These are implementation-order constraints, not extra scope. The exact
dependency graph may be refined by the audit task only when a source/test
prerequisite is demonstrated.

## Deliberately excluded from active implementation

| Excluded item | Status | Reason |
| --- | --- | --- |
| `CLI-TASK-001` / `CLI-INIT-001` | `❌` | Starter-template and overwrite policy are onboarding scope outside this command/I/O correctness tranche. |
| `CLI-TASK-002` / `CLI-OPEN-001` | `🌗` | Named `open` versus existing path selection requires a product decision. |
| `CLI-TASK-013` / `CLI-CONFIG-001` | `❌` | Config schema and precedence require a separate contract decision. |
| `CLI-TASK-014` / `CLI-CONFIG-002` | `❌` | Environment controls partly overlap `CLI-TASK-016`; its concrete flag/precedence contract should follow that work. |
| `CLI-TASK-015` / `CLI-AUTO-002` | `❌` | Watch lifecycle and failure recovery require an explicit product-scope decision and are not needed for one-shot commands. |
| `CLI-TASK-017` / `CLI-PACK-004` | `🌗` | Release registry and canonical-runtime proof are explicitly outside this no-publication goal. |
| `CLI-AUTO-004` daemon/JSON-RPC boundary | `⏸️` | Held for a separate protocol, lifecycle, and security decision; no implementation task is created here. |
| Delegated UI/editor/parser/geometry/SVG semantic work | `➖` | Another surface owns it; CLI changes remain at orchestration and transport boundaries. |
| Node 24, CI, registry, cross-OS/TTY, and public-package checks | `?` | Evidence follow-ups remain visible and are not relabeled as implementation gaps or prerequisites. |

No `➖` or `⏸️` item is treated as active implementation work.

## Status accounting

| Check | Result |
| --- | ---: |
| Selected capability IDs | 11 |
| Selected `🌗` rows | 7 (`CLI-IN-003`, `CLI-RENDER-002`, `CLI-RENDER-003`, `CLI-OUT-004`, `CLI-DIAG-001`, `CLI-EXIT-001`, `CLI-AUTO-003`) |
| Selected `❌` rows | 2 (`CLI-IN-002`, `CLI-DIAG-003`) |
| Selected `⚠️` rows | 2 (`CLI-ERR-001`, `CLI-ERR-002`) |
| Selected `➖` or `⏸️` rows | 0 |
| Selected IDs with owner, source path, boundary, and acceptance behavior | 11/11 |

Changing this record or the backlog is not implementation evidence. Each
selected row requires focused source/test evidence and a fresh audit,
reconciliation, and matrix review before its symbol changes.
