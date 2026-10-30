# RelGeo CLI Implementation-Gap Backlog

**Tanggal:** 2026-10-30
**Status:** candidate goal/task register with a bounded active tranche; no row
here counts as implementation
**Source:** [CLI status matrix](./status-matrix.md) and
[expected-versus-observed reconciliation](./reconciliation.md); the detailed
[bounded selection record](./in-scope-selection.md) is the selection source of
truth

This backlog turns every CLI capability with status `🌗`, `❌`, or `⚠️` into a
separate candidate implementation task. `⏸️`, `➖`, and `?` remain scope or
evidence follow-ups rather than hidden implementation gaps. Editing this
backlog or the matrix never closes a gap; the status changes only after source,
tests, and a new evidence audit demonstrate the result. The current matrix is
the status authority; this register retains the original task records and
records post-implementation status for selected rows.

## Rules and coverage

- A candidate task is not an active SuClos goal until owner, scope, and dependency are approved.
- Each candidate has exactly one expected capability ID, an explicit scope, priority, owner, dependency, acceptance evidence target, risk, and next action.
- `❌` remains absent on the expected CLI boundary; it must not be converted to `➖` because delivery evidence is difficult.
- `⚠️` is a confirmed defect or contract mismatch and needs a regression test even when part of the capability already exists.
- Acceptance evidence should include the relevant CLI command, fixture or test, exit/stream behavior, and the canonical environment limitation where applicable.

## Bounded active implementation tranche

The active tranche is deliberately limited to eleven rows that can be
implemented and verified at the `relgeo/cli` repository boundary without npm
publication, a new protocol decision, or a product-scope decision about
`open`, config, or watch. The capability status below is unchanged from the
intake selection at task start; current completion is recorded by the audit,
reconciliation, and status matrix. `Selection: active` is planning metadata,
not a completion claim.

| Selection | Candidate task / capability | Capability status | Owner | Source-of-truth paths | Contract boundary | Explicit acceptance behavior |
| --- | --- | --- | --- | --- | --- | --- |
| active | `CLI-TASK-003` / `CLI-IN-002` stdin pipeline input | `✔️` | `relgeo/cli` | `docs/capability-map/cli/expected-capability-catalog.md` (`CLI-IN-002`); `docs/capability-map/cli/implementation-audit.md` (§3/§5); `cli/src/index.ts`; `cli/src/__tests__/cli.test.ts` | `-` is the stdin source for file-taking commands; CLI owns source acquisition and stream routing, while core owns DSL meaning. | `relgeo compile - --format json` emits only JSON on stdout; empty or invalid stdin exits non-zero with source-aware stderr; ordinary file input remains unchanged. Evidence: focused stdin/empty-input/precedence tests. |
| active | `CLI-TASK-004` / `CLI-IN-003` input precedence and encoding | `🌗` | `relgeo/cli` | `docs/capability-map/cli/expected-capability-catalog.md` (`CLI-IN-003`); `docs/capability-map/cli/implementation-audit.md` (§5); `cli/src/index.ts`; `cli/src/__tests__/cli.test.ts` | CLI owns path/stdin precedence, empty-input handling, and UTF-8 source reads; the host filesystem remains an execution dependency. | An explicit path reads that path; `-` reads stdin; empty source and read/encoding failures have deterministic non-zero results and no misleading artifact. |
| active | `CLI-TASK-005` / `CLI-RENDER-002` profile, parameter, and unit matrix | `🌗` | `relgeo/cli` + `@relgeo/core`/`spec` | `docs/capability-map/cli/expected-capability-catalog.md` (`CLI-RENDER-002`); `docs/capability-map/cli/implementation-audit.md` (§5); `cli/src/index.ts`; `cli/src/__tests__/cli.test.ts` | CLI owns option parsing and forwarding; core/spec own profile, parameter type, evaluation, and unit semantics. | Representative `compile` and `check` cases cover profile selection, numeric/string/boolean overrides, units, combinations, and unknown names; invalid intent fails non-zero rather than being ignored. |
| active | `CLI-TASK-006` / `CLI-RENDER-003` sheet/view selector validation | `🌗` | `relgeo/cli` + `@relgeo/renderer-svg` | `docs/capability-map/cli/expected-capability-catalog.md` (`CLI-RENDER-003`); `docs/capability-map/cli/implementation-audit.md` (§5); `cli/src/index.ts`; `cli/src/__tests__/cli.test.ts` | CLI owns selector option mapping and failure transport; renderer/spec own sheet/view availability and SVG semantics. | A valid SVG selector matches the expected fixture; a missing or invalid selector exits non-zero with a stable diagnostic and produces no misleading artifact. |
| active | `CLI-TASK-007` / `CLI-OUT-004` deterministic file output | `🌗` | `relgeo/cli` | `docs/capability-map/cli/expected-capability-catalog.md` (`CLI-OUT-004`); `docs/capability-map/cli/implementation-audit.md` (§5); `cli/src/index.ts`; `cli/src/__tests__/cli.test.ts` | CLI owns stdout/file routing, parent creation, overwrite behavior, UTF-8 encoding, and write-failure reporting. | stdout contains only the requested JSON/SVG/graph; a target file is created or deterministically overwritten, parent directories are created, and write failures exit non-zero without a success claim or partial-success message. |
| active | `CLI-TASK-008` / `CLI-DIAG-001` structured phase-aware diagnostics | `🌗` | `relgeo/cli` + `spec`/`@relgeo/core` | `docs/capability-map/cli/expected-capability-catalog.md` (`CLI-DIAG-001`); `docs/capability-map/cli/implementation-audit.md` (§5); `spec/id/core/06-error-model.md`; `cli/src/index.ts`; `cli/src/__tests__/cli.test.ts` | spec/core remain authoritative for error codes and semantics; CLI owns transport of phase, severity, location, path, and object fields where available. | Parse, validation, reference, geometry, and post-resolution failures expose one stable envelope with code, phase, severity, message, and available path/object/location fields; human output remains readable. |
| active | `CLI-TASK-009` / `CLI-DIAG-003` machine-readable diagnostics | `🌗` | `relgeo/cli` | `docs/capability-map/cli/expected-capability-catalog.md` (`CLI-DIAG-003`); `docs/capability-map/cli/implementation-audit.md` (§3/§5); `cli/src/index.ts`; `cli/src/__tests__/cli.test.ts` | CLI owns the machine-diagnostics flag and JSON envelope/stream contract; delegated packages supply semantic error data. | `--diagnostics json` emits a stable JSON diagnostic envelope on stderr for malformed, missing-file, and runtime failures, without color or prose; successful machine output remains on stdout. Evidence: focused missing-file/runtime envelope tests. |
| active | `CLI-TASK-010` / `CLI-EXIT-001` exit-code taxonomy | `✔️` | `relgeo/cli` | `docs/capability-map/cli/expected-capability-catalog.md` (`CLI-EXIT-001`); `docs/capability-map/cli/implementation-audit.md` (§5); `cli/src/index.ts`; `cli/src/__tests__/cli.test.ts` | CLI owns numeric exit categories for success, usage, input, validation/runtime, and output/write failures; core error meaning remains delegated. | The documented taxonomy is stable and tested for each category, including unknown command/option, missing/invalid input, semantic failure, and write failure; no category silently returns success. Evidence: 23-case package suite. |
| active | `CLI-TASK-011` / `CLI-ERR-001` reject unsupported formats | `✔️` | `relgeo/cli` | `docs/capability-map/cli/expected-capability-catalog.md` (`CLI-ERR-001`); `docs/capability-map/cli/implementation-audit.md` (§3/§5); `cli/src/index.ts`; `cli/src/__tests__/cli.test.ts` | CLI owns the output-format allowlist and dispatch guard before core/render invocation. | An unsupported `--format` names the invalid value, exits non-zero, writes no artifact, and never falls through to JSON. Evidence: strict-format regression test. |
| active | `CLI-TASK-012` / `CLI-ERR-002` strict option and parameter validation | `✔️` | `relgeo/cli` | `docs/capability-map/cli/expected-capability-catalog.md` (`CLI-ERR-002`); `docs/capability-map/cli/implementation-audit.md` (§3/§5); `cli/src/index.ts`; `cli/src/__tests__/cli.test.ts` | CLI owns syntax/allowlist validation for formats, units, parameter tokens, profiles, sheets, and unknown options; valid string-like parameter values remain supported. | Malformed `--param`, unsupported unit/format, unknown profile/sheet, and unknown option each exit non-zero and name the invalid value; no requested intent is silently ignored. Evidence: strict option/parameter/profile/unit tests. |
| active | `CLI-TASK-016` / `CLI-AUTO-003` stable scripting streams and no-color mode | `🌗` | `relgeo/cli` | `docs/capability-map/cli/expected-capability-catalog.md` (`CLI-AUTO-003`); `docs/capability-map/cli/implementation-audit.md` (§5); `cli/src/index.ts`; `cli/src/__tests__/cli.test.ts` | CLI owns stdout/stderr separation and explicit color/progress controls; it does not alter delegated parse/resolve/render semantics. | JSON/SVG/graph stdout contains only requested data; progress and diagnostics stay on stderr; explicit no-color/CI mode is deterministic for `info`, `check`, and `compile`. |

The following candidate rows remain visible but are outside this tranche:

| Selection | Candidate task / capability | Capability status | Owner | Boundary reason |
| --- | --- | --- | --- | --- |
| not selected | `CLI-TASK-001` / `CLI-INIT-001` starter-document init | `❌` | `relgeo/cli` + spec | Onboarding/template policy is broader than the selected command/I/O correctness tranche. |
| not selected | `CLI-TASK-002` / `CLI-OPEN-001` explicit open workflow | `🌗` | `relgeo/cli` | Requires a product decision on named `open` semantics versus existing path selection. |
| not selected | `CLI-TASK-013` / `CLI-CONFIG-001` config file and precedence | `❌` | `relgeo/cli` | Requires a config schema and precedence decision; not needed for repository-local input/output correctness. |
| not selected | `CLI-TASK-014` / `CLI-CONFIG-002` noninteractive environment controls | `❌` | `relgeo/cli` | Partly overlaps the selected stream/no-color contract and should follow its concrete flag/stream decision. |
| not selected | `CLI-TASK-015` / `CLI-AUTO-002` document watch/rebuild | `❌` | `relgeo/cli` | Requires an explicit lifecycle/scope decision and is not needed for one-shot CLI workflows. |
| not selected | `CLI-TASK-017` / `CLI-PACK-004` release registry and canonical-runtime proof | `🌗` | release owner + `relgeo/cli` | Explicitly excluded by the goal: no npm publication or registry dependency is required for this implementation tranche. |

`➖` boundaries and the held `⏸️` daemon/JSON-RPC row remain outside the
backlog and are not candidates for this tranche. Their statuses are preserved;
selection does not promote them to implementation work.

| Check | Result |
| --- | --- |
| Intake candidate task records | 17 |
| Current non-green task records | 13 |
| Current `🌗` tasks | 9 |
| Current `❌` tasks | 4 |
| Current `⚠️` defect tasks | 0 |
| Evidence-backed selected task records | 4 (`CLI-TASK-003`, `CLI-TASK-010`, `CLI-TASK-011`, `CLI-TASK-012`) |
| Missing source IDs | 0 |
| Duplicate source IDs | 0 |
| Explicit scope and priority fields | Yes; every candidate row has both |

Priority bands are implementation ordering guidance, not completion status:

- `P0`: false-success behavior is closed by the evidence-backed
  `CLI-TASK-011` and `CLI-TASK-012` records; retain their regression tests.
- `P1`: remaining input, diagnostics, output, configuration, automation,
  onboarding, render-option, and release-proof gaps.
- `P2`: pursue document watch only after its product scope and lifecycle contract
  are explicitly decided (`CLI-TASK-015`).

## Candidate implementation tasks

| Candidate task | Expected ID | Source status | Scope | Priority | Owner | Dependency | Acceptance test / evidence target | Risk | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `CLI-TASK-001` Starter-document init | `CLI-INIT-001` | `❌` | `expected-but-missing` | `P1` | `relgeo/cli` + spec | starter template; active version policy | `relgeo init <path>` creates a minimal valid active-line document; rerunning with an existing path fails safely; `check` and `compile` consume the generated file | P1 onboarding cannot start from CLI | Define template fields and overwrite policy |
| `CLI-TASK-002` Explicit open/document selection contract | `CLI-OPEN-001` | `🌗` | `in scope` | `P1` | `relgeo/cli` | path/stdin precedence; user-journey decision | Either document path selection is promoted as the documented `open` workflow with tests, or a bounded `open` command returns the selected metadata and clear errors | P1 implicit behavior is misread as an open workflow | Decide path-only versus named `open` semantics |
| `CLI-TASK-003` Stdin pipeline input | `CLI-IN-002` | `✔️` | `implemented` | `P1` | `relgeo/cli` | stdin marker, empty-input, and precedence rules | A shell pipeline invoking `relgeo compile - --format json` produces only JSON on stdout; empty/invalid stdin fails non-zero with source-aware stderr; file input remains unchanged | P1 shell/CI pipelines require temporary files | Retain focused stdin tests; expand shell matrix later |
| `CLI-TASK-004` Input precedence and encoding behavior | `CLI-IN-003` | `🌗` | `in scope` | `P1` | `relgeo/cli` | `CLI-TASK-003`; filesystem contract | Tests cover path plus stdin, empty path, empty stdin, UTF-8 content, and read/encoding failure with deterministic precedence and exit behavior | P1 automation can process the wrong source | Write the precedence table before implementation |
| `CLI-TASK-005` Profile/parameter/unit option matrix | `CLI-RENDER-002` | `🌗` | `in scope` | `P1` | `relgeo/cli` + core/spec | evaluator/profile/unit semantics; fixture 16 policy | Representative success and failure tests cover profile selection, numeric/string/boolean params, target units, combinations, and unknown names for `compile` and `check` | P1 reproducibility and silent fallback | Expand fixtures and reject unsupported combinations |
| `CLI-TASK-006` Sheet/view selector validation | `CLI-RENDER-003` | `🌗` | `in scope` | `P1` | `relgeo/cli` + renderer | sheet/view catalog and renderer error contract | Valid `--sheet` output matches fixture; missing/invalid selector exits non-zero with a stable diagnostic and does not emit a misleading artifact | P1 wrong view can be published | Add selector-negative fixtures and assertions |
| `CLI-TASK-007` Deterministic file-output behavior | `CLI-OUT-004` | `🌗` | `in scope` | `P1` | `relgeo/cli` | filesystem write boundary; overwrite policy | Temp-directory tests cover stdout, new file, overwrite, parent creation, permission/write failure, UTF-8 output, and non-zero failure without partial success claim | P1 generated artifacts can be lost or misreported | Define overwrite and atomicity semantics |
| `CLI-TASK-008` Structured phase-aware diagnostic transport | `CLI-DIAG-001` | `🌗` | `boundary only` | `P1` | `relgeo/cli` + spec/core | shared diagnostic envelope; phase/severity/location fields | Parse, validation, reference, geometry, and post-resolve fixture failures expose stable code, phase, severity, path/object, and location where available; human output remains readable | P1 automation cannot classify failure phase | Draft envelope and serialization snapshots |
| `CLI-TASK-009` Machine-readable diagnostics mode | `CLI-DIAG-003` | `🌗` | `partial` | `P1` | `relgeo/cli` | `CLI-TASK-008`; JSON diagnostics contract | A documented flag emits one stable JSON diagnostic envelope on stderr or selected output, never color/prose; tests cover valid, malformed, missing-file, and runtime failures | P0/P1 consumers must scrape prose | Expand the focused envelope matrix |
| `CLI-TASK-010` Exit-code taxonomy | `CLI-EXIT-001` | `✔️` | `implemented` | `P1` | `relgeo/cli` | error taxonomy; write failures; `CLI-TASK-009` | Tests assert distinct documented codes for success, usage, input, validation/runtime, and output/write failures; unknown command/option behavior is included | P1 CI cannot route remediation reliably | Preserve numeric taxonomy in release tests |
| `CLI-TASK-011` Reject unsupported formats without fallback | `CLI-ERR-001` | `✔️` | `implemented` | `P0` | `relgeo/cli` | format allowlist; exit taxonomy | `--format not-a-format` exits non-zero, emits an actionable error, and writes no JSON/SVG artifact; regression test runs with stdout/stderr assertions | P0 typo currently produces false success | Keep allowlist validation regression |
| `CLI-TASK-012` Strict option and parameter validation | `CLI-ERR-002` | `✔️` | `implemented` | `P0` | `relgeo/cli` | typed option schema; `CLI-TASK-010` | Malformed `--param`, unknown profile/unit/sheet, and unknown option fail non-zero and name the invalid value; valid string values remain supported | P0 automation can render with ignored intent | Expand option matrix when new options are added |
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
