# RelGeo CLI Implementation-Gap Backlog

**Tanggal:** 2026-10-30
**Status:** candidate goal/task register; no row here counts as implementation
**Source:** [CLI status matrix](./status-matrix.md) and
[expected-versus-observed reconciliation](./reconciliation.md)

This backlog turns every CLI capability with status `🌗`, `❌`, or `⚠️` into a
separate candidate implementation task. `⏸️`, `➖`, and `?` remain scope or
evidence follow-ups rather than hidden implementation gaps. Editing this
backlog or the matrix never closes a gap; the status changes only after source,
tests, and a new evidence audit demonstrate the result.

## Rules and coverage

- A candidate task is not an active SuClos goal until owner, scope, and dependency are approved.
- Each candidate has exactly one expected capability ID, an explicit scope, priority, owner, dependency, acceptance evidence target, risk, and next action.
- `❌` remains absent on the expected CLI boundary; it must not be converted to `➖` because delivery evidence is difficult.
- `⚠️` is a confirmed defect or contract mismatch and needs a regression test even when part of the capability already exists.
- Acceptance evidence should include the relevant CLI command, fixture or test, exit/stream behavior, and the canonical environment limitation where applicable.

| Check | Result |
| --- | --- |
| Expected gap rows | 17 |
| Candidate implementation tasks | 17 |
| `🌗` tasks | 9 |
| `❌` tasks | 6 |
| `⚠️` defect tasks | 2 |
| Missing source IDs | 0 |
| Duplicate source IDs | 0 |
| Explicit scope and priority fields | Yes; every candidate row has both |

Priority bands are implementation ordering guidance, not completion status:

- `P0`: prevent false-success behavior first (`CLI-TASK-011`, `CLI-TASK-012`).
- `P1`: close input, diagnostics, output, configuration, automation, onboarding,
  and release-proof gaps after the correctness defects are bounded.
- `P2`: pursue document watch only after its product scope and lifecycle contract
  are explicitly decided (`CLI-TASK-015`).

## Candidate implementation tasks

| Candidate task | Expected ID | Source status | Scope | Priority | Owner | Dependency | Acceptance test / evidence target | Risk | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `CLI-TASK-001` Starter-document init | `CLI-INIT-001` | `❌` | `expected-but-missing` | `P1` | `relgeo/cli` + spec | starter template; active version policy | `relgeo init <path>` creates a minimal valid active-line document; rerunning with an existing path fails safely; `check` and `compile` consume the generated file | P1 onboarding cannot start from CLI | Define template fields and overwrite policy |
| `CLI-TASK-002` Explicit open/document selection contract | `CLI-OPEN-001` | `🌗` | `in scope` | `P1` | `relgeo/cli` | path/stdin precedence; user-journey decision | Either document path selection is promoted as the documented `open` workflow with tests, or a bounded `open` command returns the selected metadata and clear errors | P1 implicit behavior is misread as an open workflow | Decide path-only versus named `open` semantics |
| `CLI-TASK-003` Stdin pipeline input | `CLI-IN-002` | `❌` | `expected-but-missing` | `P1` | `relgeo/cli` | stdin marker, empty-input, and precedence rules | A shell pipeline invoking `relgeo compile - --format json` produces only JSON on stdout; empty/invalid stdin fails non-zero with source-aware stderr; file input remains unchanged | P1 shell/CI pipelines require temporary files | Define `-` semantics and add CLI pipe fixtures |
| `CLI-TASK-004` Input precedence and encoding behavior | `CLI-IN-003` | `🌗` | `in scope` | `P1` | `relgeo/cli` | `CLI-TASK-003`; filesystem contract | Tests cover path plus stdin, empty path, empty stdin, UTF-8 content, and read/encoding failure with deterministic precedence and exit behavior | P1 automation can process the wrong source | Write the precedence table before implementation |
| `CLI-TASK-005` Profile/parameter/unit option matrix | `CLI-RENDER-002` | `🌗` | `in scope` | `P1` | `relgeo/cli` + core/spec | evaluator/profile/unit semantics; fixture 16 policy | Representative success and failure tests cover profile selection, numeric/string/boolean params, target units, combinations, and unknown names for `compile` and `check` | P1 reproducibility and silent fallback | Expand fixtures and reject unsupported combinations |
| `CLI-TASK-006` Sheet/view selector validation | `CLI-RENDER-003` | `🌗` | `in scope` | `P1` | `relgeo/cli` + renderer | sheet/view catalog and renderer error contract | Valid `--sheet` output matches fixture; missing/invalid selector exits non-zero with a stable diagnostic and does not emit a misleading artifact | P1 wrong view can be published | Add selector-negative fixtures and assertions |
| `CLI-TASK-007` Deterministic file-output behavior | `CLI-OUT-004` | `🌗` | `in scope` | `P1` | `relgeo/cli` | filesystem write boundary; overwrite policy | Temp-directory tests cover stdout, new file, overwrite, parent creation, permission/write failure, UTF-8 output, and non-zero failure without partial success claim | P1 generated artifacts can be lost or misreported | Define overwrite and atomicity semantics |
| `CLI-TASK-008` Structured phase-aware diagnostic transport | `CLI-DIAG-001` | `🌗` | `boundary only` | `P1` | `relgeo/cli` + spec/core | shared diagnostic envelope; phase/severity/location fields | Parse, validation, reference, geometry, and post-resolve fixture failures expose stable code, phase, severity, path/object, and location where available; human output remains readable | P1 automation cannot classify failure phase | Draft envelope and serialization snapshots |
| `CLI-TASK-009` Machine-readable diagnostics mode | `CLI-DIAG-003` | `❌` | `expected-but-missing` | `P1` | `relgeo/cli` | `CLI-TASK-008`; JSON diagnostics contract | A documented flag emits one stable JSON diagnostic envelope on stderr or selected output, never color/prose; tests cover valid, malformed, missing-file, and runtime failures | P0/P1 consumers must scrape prose | Choose flag/name and stream contract |
| `CLI-TASK-010` Exit-code taxonomy | `CLI-EXIT-001` | `🌗` | `in scope` | `P1` | `relgeo/cli` | error taxonomy; write failures; `CLI-TASK-009` | Tests assert distinct documented codes for success, usage, input, validation/runtime, and output/write failures; unknown command/option behavior is included | P1 CI cannot route remediation reliably | Publish numeric taxonomy and compatibility policy |
| `CLI-TASK-011` Reject unsupported formats without fallback | `CLI-ERR-001` | `⚠️` | `in scope` | `P0` | `relgeo/cli` | format allowlist; exit taxonomy | `--format not-a-format` exits non-zero, emits an actionable error, and writes no JSON/SVG artifact; regression test runs with stdout/stderr assertions | P0 typo currently produces false success | Add allowlist validation before compile dispatch |
| `CLI-TASK-012` Strict option and parameter validation | `CLI-ERR-002` | `⚠️` | `in scope` | `P0` | `relgeo/cli` | typed option schema; `CLI-TASK-010` | Malformed `--param`, unknown profile/unit/sheet, and unknown option fail non-zero and name the invalid value; valid string values remain supported | P0 automation can render with ignored intent | Make override parsing return typed validation errors |
| `CLI-TASK-013` Config file and precedence model | `CLI-CONFIG-001` | `❌` | `expected-but-missing` | `P1` | `relgeo/cli` | config schema; path/format/unit/profile defaults | A documented config file can set supported defaults; CLI flags override env/config; invalid config fails clearly; `--no-config` or equivalent makes behavior explicit | P1 repeated automation is verbose and inconsistent | Decide file name, schema, and precedence |
| `CLI-TASK-014` Noninteractive environment controls | `CLI-CONFIG-002` | `❌` | `expected-but-missing` | `P1` | `relgeo/cli` | no-color/CI contract; diagnostics mode | CI/no-color environment and flags suppress prompts/color/progress noise; stdout remains machine data and stderr remains diagnostics across commands | P1 terminal ambient state can change scripts | Define environment variables and precedence |
| `CLI-TASK-015` Document watch/rebuild lifecycle | `CLI-AUTO-002` | `❌` | `expected-but-missing` | `P2` | `relgeo/cli` | watcher/debounce model; failure recovery | A bounded watch command observes source/config changes, reruns validation/render, reports failures without terminating the session, and shuts down cleanly; lifecycle tests cover rapid changes | P2/P1 iterative workflows need wrappers | Decide whether watch is in product scope and select watcher boundary |
| `CLI-TASK-016` Stable scripting streams and no-color mode | `CLI-AUTO-003` | `🌗` | `in scope` | `P1` | `relgeo/cli` | `CLI-TASK-009`; no-color/progress policy | For JSON/SVG/graph, stdout contains only requested data; progress/diagnostics go to stderr; explicit no-color mode is tested for `info`, `check`, and `compile` | P1 pipelines may parse human noise | Add stream snapshots and CI-mode probes |
| `CLI-TASK-017` Release registry and canonical-runtime proof | `CLI-PACK-004` | `🌗` | `in scope` | `P1` | release owner + `relgeo/cli` | Node >=24; registry access; release guard | Clean packed/install consumer smoke runs under Node >=24, current release guard, and a registry or staging package; partial-publish recovery/forward-fix evidence is recorded without claiming publish success | P1 release confidence is local-only | Run the canonical package verification when environment is available |

## Scope and evidence follow-ups

These are intentionally not candidate implementation tasks:

| Follow-up | Status | Owner | Acceptance evidence | Next action |
| --- | --- | --- | --- | --- |
| Interactive editor, browser route, UI menu, and native shortcut | `➖` | Playground / language-service | Host matrix covers its own UI/route behavior | Keep outside CLI backlog; do not duplicate editor scope |
| Independent parser, geometry, and SVG semantic implementation | `➖` | spec / core / renderer | Delegated package tests and conformance remain semantic evidence | Preserve CLI orchestration ownership |
| Long-running daemon/JSON-RPC protocol | `⏸️` | CLI + protocol owners | Explicit human scope decision and bounded security/protocol contract | Do not create implementation task until held scope is resolved |
| Node 24, current CI, registry/public package, cross-OS/TTY | `?` | workspace / release owner | Canonical environment execution record | Schedule verification independently from implementation tasks |

## Handoff rules

1. Candidate tasks require explicit owner, dependency, scope, and acceptance evidence before becoming implementation work.
2. A task is complete only after source/tests change and the CLI audit, reconciliation, matrix, and relevant release/conformance evidence are rerun.
3. If implementation changes the command or protocol boundary, update the expected catalog and reconciliation explicitly before changing status.
4. Documentation of a gap is not implementation evidence. `❌` and `⚠️` cannot be hidden as `➖`, and `⏸️` cannot be treated as complete.

## Linked artifacts

- [Expected CLI capability catalog](./expected-capability-catalog.md)
- [CLI implementation audit](./implementation-audit.md)
- [CLI expected-versus-observed reconciliation](./reconciliation.md)
- [CLI status matrix](./status-matrix.md)
- [CLI coverage validation and handoff](./coverage-validation-handoff.md)
- [Maturation master plan](../../MATURATION-MASTER-PLAN.md)
- [Compatibility matrix](../../compatibility-matrix.json)
- [npm release guard](../../plans/03-npm-release-guard.md)
