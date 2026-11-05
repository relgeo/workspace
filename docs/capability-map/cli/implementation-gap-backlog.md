# RelGeo CLI Implementation-Gap Backlog

**Tanggal:** 2026-11-04
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
publication or a new protocol decision. The contract-freeze task has now
resolved `open`, config, and one-shot automation behavior at this boundary;
document watch/rebuild remains explicitly held. The rows below retain the
original intake selection metadata, while the current frozen status is recorded
in the contract table that follows.

## Frozen command and configuration contract — 2026-11-03

The active CLI contract is now tested at the package boundary:

| Area | Frozen rule | Evidence |
| --- | --- | --- |
| `init` | `init [path]` writes a valid v0.5 starter as UTF-8; default destination is `relgeo.yaml`; existing files require `--force`/`--overwrite`. | `cli/src/index.ts`; `cli/src/__tests__/cli.test.ts` |
| `open` and input | `open [file]` is inspection without an editor; omitted input may come from config; explicit path wins; `-` alone selects stdin; empty/invalid UTF-8 is exit `3`. | `cli/src/index.ts`; `cli/src/__tests__/cli.test.ts` |
| Config precedence | built-in defaults → `.relgeo.json` or `--config`/`RELGEO_CONFIG` → `RELGEO_*` environment → command flags; `--no-config`/`RELGEO_NO_CONFIG=1` disables config. | `cli/docs/README.md`; `cli/src/__tests__/cli.test.ts` |
| Output | stdout is data only; stderr is progress/diagnostics; output is UTF-8 and atomic; compile overwrites by default, `--no-overwrite` returns exit `5`. | `cli/src/index.ts`; `cli/src/__tests__/cli.test.ts` |
| Noninteractive | `NO_COLOR`, `RELGEO_NO_COLOR`, and truthy `CI` disable styling; CI suppresses progress; JSON diagnostics remain one envelope on stderr. | `cli/src/index.ts`; `cli/src/__tests__/cli.test.ts` |
| Watch/rebuild | Not implemented in the one-shot CLI. It is held pending a separate lifecycle decision for debounce, recovery, shutdown, and streams. Package build `dev` watch is not document watch. | `cli/docs/README.md`; expected capability catalog `CLI-AUTO-002` |

## P0/P1 triage decision — 2026-11-04

This is the current triage of every P0/P1 row in the candidate-task table
below. “Implementation-closable” means the remaining gap can be changed and
tested at the CLI boundary in this workspace. Evidence-only work is retained
as a follow-up and must not be used to claim that the implementation is
missing. Rows already at `✔️` are not reopened as gaps; their acceptance tests
remain regression evidence.

### Implementation-closable gaps selected for the next CLI tranche

| Candidate / expected ID | Priority | Initial status | Owner | Source of truth | Acceptance test | Triage disposition |
| --- | --- | --- | --- | --- | --- | --- |
| `CLI-TASK-005` / `CLI-RENDER-002` profile, parameter, and unit selection | `P1` | `🌗` partial | `relgeo/cli` for option parsing/forwarding; `@relgeo/core` + `spec/` for evaluation and unit semantics | `docs/capability-map/cli/expected-capability-catalog.md` (`CLI-RENDER-002`); `docs/capability-map/cli/status-matrix.md`; `docs/capability-map/cli/reconciliation.md`; `cli/src/index.ts`; `cli/src/__tests__/cli.test.ts` | `compile` and `check` cover profile selection, numeric/string/boolean overrides, target units, valid combinations, and unknown names; invalid intent exits non-zero and is not silently ignored. | **Selected implementation gap.** Expand the option/fixture matrix without duplicating core/spec semantics. |
| `CLI-TASK-006` / `CLI-RENDER-003` sheet/view selector validation | `P1` | `🌗` partial | `relgeo/cli` for selector mapping/failure transport; `@relgeo/renderer-svg` + `spec/` for sheet/view availability and render semantics | `docs/capability-map/cli/expected-capability-catalog.md` (`CLI-RENDER-003`); `docs/capability-map/cli/status-matrix.md`; `docs/capability-map/cli/reconciliation.md`; `cli/src/index.ts`; `cli/src/__tests__/cli.test.ts` | A valid `--sheet`/`--view` SVG selection matches its fixture; missing or invalid selectors exit non-zero with a stable diagnostic and do not emit a misleading artifact. | **Selected implementation gap.** Complete valid/invalid selector coverage at the CLI transport boundary. |

### Remaining P0/P1 rows accounted for but not selected as open gaps

| Priority | Initial status | Rows | Disposition |
| --- | --- | --- | --- |
| `P0` | `✔️` implemented | `CLI-TASK-011` / `CLI-ERR-001`; `CLI-TASK-012` / `CLI-ERR-002` | Implementation-closed. Keep strict-format, strict-option, and strict-parameter regressions; do not create duplicate implementation work. |
| `P1` | `✔️` implemented | `CLI-TASK-001`–`CLI-TASK-004`, `CLI-TASK-007`–`CLI-TASK-010`, `CLI-TASK-013`, `CLI-TASK-014`, `CLI-TASK-016` | Implementation-closed. Preserve their existing owner/source/acceptance records and rerun focused regressions when the selected render-option work changes shared dispatch or streams. |
| `P1` | `🌗` partial | `CLI-TASK-017` / `CLI-PACK-004` | **Evidence-only follow-up, not an implementation gap.** Node >=24, clean registry/staging install, current CI, and partial-publish recovery evidence require the canonical release environment and release owner. No package-publication action is part of this tranche. |

The accounting is therefore `16` P0/P1 candidate rows: `2` selected
implementation gaps, `13` implementation-closed rows retained for regression,
and `1` evidence-only release row. The held `CLI-TASK-015` / `CLI-AUTO-002`
watch lifecycle is P2 and scope-deferred; `CLI-AUTO-004` is also held pending
a separate protocol decision. Neither is an implementation prerequisite for
the selected rows.

The detailed contract lock for the selected rows is recorded in the
[CLI reconciliation](./reconciliation.md#contract-lock-for-selected-render-gaps--2026-11-04).
That record is the acceptance source for implementation: success behavior,
failure/edge behavior, stable diagnostic/exit expectations, and evidence scope
must remain within the existing `0.5.x` command contract.

Post-implementation status: both selected rows now have source, test, and
fixture evidence at the locked CLI boundary. They remain in the backlog as
regression records; no remaining implementation gap is inferred from the
unverified release environment.

| Selection | Candidate task / capability | Capability status | Owner | Source-of-truth paths | Contract boundary | Explicit acceptance behavior |
| --- | --- | --- | --- | --- | --- | --- |
| active | `CLI-TASK-003` / `CLI-IN-002` stdin pipeline input | `✔️` | `relgeo/cli` | `docs/capability-map/cli/expected-capability-catalog.md` (`CLI-IN-002`); `docs/capability-map/cli/implementation-audit.md` (§3/§5); `cli/src/index.ts`; `cli/src/__tests__/cli.test.ts` | `-` is the stdin source for file-taking commands; CLI owns source acquisition and stream routing, while core owns DSL meaning. | `relgeo compile - --format json` emits only JSON on stdout; empty or invalid stdin exits non-zero with source-aware stderr; ordinary file input remains unchanged. Evidence: focused stdin/empty-input/precedence tests. |
| active | `CLI-TASK-004` / `CLI-IN-003` input precedence and encoding | `✔️` | `relgeo/cli` | `docs/capability-map/cli/expected-capability-catalog.md` (`CLI-IN-003`); `docs/capability-map/cli/implementation-audit.md` (§5); `cli/src/index.ts`; `cli/src/__tests__/cli.test.ts` | CLI owns path/stdin precedence, empty-input handling, and UTF-8 source reads; the host filesystem remains an execution dependency. | Explicit paths win over unrelated stdin; `-` reads stdin; empty source and read/encoding failures have deterministic non-zero results and no misleading artifact. Evidence: 36-case package suite. |
| active | `CLI-TASK-005` / `CLI-RENDER-002` profile, parameter, and unit matrix | `✔️` | `relgeo/cli` + `@relgeo/core`/`spec` | `docs/capability-map/cli/expected-capability-catalog.md` (`CLI-RENDER-002`); `docs/capability-map/cli/implementation-audit.md` (§5/§6); `cli/src/index.ts`; `cli/src/__tests__/cli.test.ts`; `cli/src/__tests__/fixtures/render-options-v05.yaml` | CLI owns option parsing and forwarding; core/spec own profile, parameter type, evaluation, and unit semantics. | v0.5 fixture plus `compile` and `check` cover profile selection, numeric/string/boolean overrides, target units, combinations, and strict unknown/malformed values; invalid intent fails non-zero rather than being ignored. |
| active | `CLI-TASK-006` / `CLI-RENDER-003` sheet/view selector validation | `✔️` | `relgeo/cli` + `@relgeo/renderer-svg` | `docs/capability-map/cli/expected-capability-catalog.md` (`CLI-RENDER-003`); `docs/capability-map/cli/implementation-audit.md` (§5/§6); `cli/src/index.ts`; `cli/src/__tests__/cli.test.ts`; `cli/src/__tests__/fixtures/render-options-v05.yaml` | CLI owns selector option mapping, sheet existence validation, and failure transport; renderer/spec own sheet/view availability and SVG semantics. | v0.5 fixture plus valid sheet/view, wrong-sheet, unknown-view, format-mismatch, and no-artifact tests pass with stable diagnostics and exit codes. |
| active | `CLI-TASK-007` / `CLI-OUT-004` deterministic file output | `✔️` | `relgeo/cli` | `docs/capability-map/cli/expected-capability-catalog.md` (`CLI-OUT-004`); `cli/src/index.ts`; `cli/src/__tests__/cli.test.ts` | CLI owns stdout/file routing, parent creation, overwrite behavior, UTF-8 encoding, and write-failure reporting. | stdout contains only the requested JSON/SVG/graph; a target file is created or deterministically overwritten, parent directories are created, and write failures exit non-zero without a success claim or partial-success message. |
| active | `CLI-TASK-008` / `CLI-DIAG-001` structured phase-aware diagnostics | `✔️` | `relgeo/cli` + `spec`/`@relgeo/core` | `docs/capability-map/cli/expected-capability-catalog.md` (`CLI-DIAG-001`); `spec/id/core/06-error-model.md`; `cli/src/index.ts`; `cli/src/__tests__/cli.test.ts` | spec/core remain authoritative for error codes and semantics; CLI owns transport of phase, severity, location, path, and object fields where available. | Parse, validation, reference, geometry, and post-resolution failures expose one stable envelope with code, phase, severity, message, and available path/object/location fields; human output remains readable. |
| active | `CLI-TASK-009` / `CLI-DIAG-003` machine-readable diagnostics | `✔️` | `relgeo/cli` | `docs/capability-map/cli/expected-capability-catalog.md` (`CLI-DIAG-003`); `cli/src/index.ts`; `cli/src/__tests__/cli.test.ts` | CLI owns the machine-diagnostics flag and JSON envelope/stream contract; delegated packages supply semantic error data. | `--diagnostics json` emits a stable JSON diagnostic envelope on stderr for malformed, missing-file, and runtime failures, without color or prose; successful machine output remains on stdout. Evidence: focused missing-file/runtime envelope tests. |
| active | `CLI-TASK-010` / `CLI-EXIT-001` exit-code taxonomy | `✔️` | `relgeo/cli` | `docs/capability-map/cli/expected-capability-catalog.md` (`CLI-EXIT-001`); `docs/capability-map/cli/implementation-audit.md` (§5); `cli/src/index.ts`; `cli/src/__tests__/cli.test.ts` | CLI owns numeric exit categories for success, usage, input, validation/runtime, and output/write failures; core error meaning remains delegated. | The documented taxonomy is stable and tested for each category, including unknown command/option, missing/invalid input, semantic failure, and write failure; no category silently returns success. Evidence: 36-case package suite. |
| active | `CLI-TASK-011` / `CLI-ERR-001` reject unsupported formats | `✔️` | `relgeo/cli` | `docs/capability-map/cli/expected-capability-catalog.md` (`CLI-ERR-001`); `docs/capability-map/cli/implementation-audit.md` (§3/§5); `cli/src/index.ts`; `cli/src/__tests__/cli.test.ts` | CLI owns the output-format allowlist and dispatch guard before core/render invocation. | An unsupported `--format` names the invalid value, exits non-zero, writes no artifact, and never falls through to JSON. Evidence: strict-format regression test. |
| active | `CLI-TASK-012` / `CLI-ERR-002` strict option and parameter validation | `✔️` | `relgeo/cli` | `docs/capability-map/cli/expected-capability-catalog.md` (`CLI-ERR-002`); `docs/capability-map/cli/implementation-audit.md` (§3/§5); `cli/src/index.ts`; `cli/src/__tests__/cli.test.ts` | CLI owns syntax/allowlist validation for formats, units, parameter tokens, profiles, sheets, and unknown options; valid string-like parameter values remain supported. | Malformed `--param`, unsupported unit/format, unknown profile/sheet, and unknown option each exit non-zero and name the invalid value; no requested intent is silently ignored. Evidence: strict option/parameter/profile/unit tests. |
| active | `CLI-TASK-016` / `CLI-AUTO-003` stable scripting streams and no-color mode | `✔️` | `relgeo/cli` | `docs/capability-map/cli/expected-capability-catalog.md` (`CLI-AUTO-003`); `cli/src/index.ts`; `cli/src/__tests__/cli.test.ts` | CLI owns stdout/stderr separation and explicit color/progress controls; it does not alter delegated parse/resolve/render semantics. | JSON/SVG/graph stdout contains only requested data; progress and diagnostics stay on stderr; explicit no-color/CI mode is deterministic for `info`, `check`, and `compile`. |

The following candidate rows remain visible but are outside this tranche:

| Selection | Candidate task / capability | Capability status | Owner | Boundary reason |
| --- | --- | --- | --- | --- |
| contract-frozen | `CLI-TASK-001` / `CLI-INIT-001` starter-document init | `✔️` | `relgeo/cli` + spec | Implemented and tested as a bounded starter workflow. |
| contract-frozen | `CLI-TASK-002` / `CLI-OPEN-001` explicit open workflow | `✔️` | `relgeo/cli` | Implemented as metadata inspection without an editor. |
| contract-frozen | `CLI-TASK-013` / `CLI-CONFIG-001` config file and precedence | `✔️` | `relgeo/cli` | `.relgeo.json`, explicit config, environment, flags, and `--no-config` are frozen and tested. |
| contract-frozen | `CLI-TASK-014` / `CLI-CONFIG-002` noninteractive environment controls | `✔️` | `relgeo/cli` | `NO_COLOR`, `CI`, `RELGEO_*`, and stream behavior are frozen and tested. |
| held | `CLI-TASK-015` / `CLI-AUTO-002` document watch/rebuild | `⏸️` | `relgeo/cli` | Explicitly outside one-shot scope pending a lifecycle decision. |
| not selected | `CLI-TASK-017` / `CLI-PACK-004` release registry and canonical-runtime proof | `🌗` | release owner + `relgeo/cli` | Explicitly excluded by the goal: no npm publication or registry dependency is required for this implementation tranche. |

`➖` boundaries and the held `⏸️` daemon/JSON-RPC row remain outside the
backlog and are not candidates for this tranche. Their statuses are preserved;
selection does not promote them to implementation work.

| Check | Result |
| --- | --- |
| Intake candidate task records | 17 |
| Current non-green task records | 2 (1 partial, 1 held) |
| Current `🌗` tasks | 1 |
| Current `❌` tasks | 0 |
| Current `⚠️` defect tasks | 0 |
| Evidence-backed selected task records | 13 one-shot rows; current evidence is local and Node 24/registry-limited |
| Missing source IDs | 0 |
| Duplicate source IDs | 0 |
| Explicit scope and priority fields | Yes; every candidate row has both |

Priority bands are implementation ordering guidance, not completion status:

- `P0`: false-success behavior is closed by the evidence-backed
  `CLI-TASK-011` and `CLI-TASK-012` records; retain their regression tests.
- `P1`: release-proof evidence gap remains; selected render-option implementation is closed at the locked boundary.
- `P2`: pursue document watch only after its product scope and lifecycle contract
  are explicitly decided (`CLI-TASK-015`).

## Candidate implementation tasks

| Candidate task | Expected ID | Source status | Scope | Priority | Owner | Dependency | Acceptance test / evidence target | Risk | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `CLI-TASK-001` Starter-document init | `CLI-INIT-001` | `✔️` | `implemented` | `P1` | `relgeo/cli` + spec | starter template; active version policy | `relgeo init <path>` creates a minimal valid active-line document; rerunning with an existing path fails safely; `check` consumes the generated file | P1 onboarding cannot start from CLI | Retain starter/overwrite regression |
| `CLI-TASK-002` Explicit open/document selection contract | `CLI-OPEN-001` | `✔️` | `implemented` | `P1` | `relgeo/cli` | path/stdin precedence; user-journey decision | Bounded `open` returns selected metadata without launching an editor and follows the shared input contract | P1 implicit behavior is misread as an open workflow | Retain open/path regression |
| `CLI-TASK-003` Stdin pipeline input | `CLI-IN-002` | `✔️` | `implemented` | `P1` | `relgeo/cli` | stdin marker, empty-input, and precedence rules | A shell pipeline invoking `relgeo compile - --format json` produces only JSON on stdout; empty/invalid stdin fails non-zero with source-aware stderr; file input remains unchanged | P1 shell/CI pipelines require temporary files | Retain focused stdin tests; expand shell matrix later |
| `CLI-TASK-004` Input precedence and encoding behavior | `CLI-IN-003` | `✔️` | `implemented` | `P1` | `relgeo/cli` | `CLI-TASK-003`; filesystem contract | Tests cover path plus stdin, empty path, empty stdin, strict UTF-8 content, and encoding failure with deterministic precedence and exit behavior | P1 automation can process the wrong source | Retain precedence/encoding regressions |
| `CLI-TASK-005` Profile/parameter/unit option matrix | `CLI-RENDER-002` | `✔️` | `implemented` | `P1` | `relgeo/cli` + core/spec | evaluator/profile/unit semantics; v0.5 CLI fixture | v0.5 fixture and package tests cover profile selection, numeric/string/boolean params, target units, combinations, and unknown names for `compile` and `check` | P1 reproducibility and silent fallback | Retain the option matrix as a regression contract |
| `CLI-TASK-006` Sheet/view selector validation | `CLI-RENDER-003` | `✔️` | `implemented` | `P1` | `relgeo/cli` + renderer | sheet/view catalog and renderer error contract; CLI pre-render sheet validation | v0.5 fixture and package tests cover valid `--sheet`/`--view`, missing/invalid selectors, stable diagnostics, and no misleading artifacts | P1 wrong view can be published | Retain selector and no-artifact regressions |
| `CLI-TASK-007` Deterministic file-output behavior | `CLI-OUT-004` | `✔️` | `implemented` | `P1` | `relgeo/cli` | filesystem write boundary; overwrite policy | Temp-directory tests cover stdout, new file, overwrite/no-overwrite, parent creation, UTF-8 output, write failure, and non-zero failure without partial success claim | P1 generated artifacts can be lost or misreported | Retain deterministic output regressions; broaden host matrix separately |
| `CLI-TASK-008` Structured phase-aware diagnostic transport | `CLI-DIAG-001` | `✔️` | `implemented` | `P1` | `relgeo/cli` + spec/core | shared diagnostic envelope; phase/severity/location fields | Parse, validation, runtime, usage, and output failures expose stable code, phase, severity, path/object, and location where available; human output remains readable | P1 automation cannot classify failure phase | Retain envelope and core error-model mapping |
| `CLI-TASK-009` Machine-readable diagnostics mode | `CLI-DIAG-003` | `✔️` | `implemented` | `P1` | `relgeo/cli` | `CLI-TASK-008`; JSON diagnostics contract | `--diagnostics json` emits one stable JSON diagnostic envelope on stderr without color/prose; tests cover input, runtime, output, usage, and successful data-stream separation | P0/P1 consumers must scrape prose | Retain focused envelope matrix |
| `CLI-TASK-010` Exit-code taxonomy | `CLI-EXIT-001` | `✔️` | `implemented` | `P1` | `relgeo/cli` | error taxonomy; write failures; `CLI-TASK-009` | Tests assert distinct documented codes for success, usage, input, validation/runtime, and output/write failures; unknown command/option behavior is included | P1 CI cannot route remediation reliably | Preserve numeric taxonomy in release tests |
| `CLI-TASK-011` Reject unsupported formats without fallback | `CLI-ERR-001` | `✔️` | `implemented` | `P0` | `relgeo/cli` | format allowlist; exit taxonomy | `--format not-a-format` exits non-zero, emits an actionable error, and writes no JSON/SVG artifact; regression test runs with stdout/stderr assertions | P0 typo currently produces false success | Keep allowlist validation regression |
| `CLI-TASK-012` Strict option and parameter validation | `CLI-ERR-002` | `✔️` | `implemented` | `P0` | `relgeo/cli` | typed option schema; `CLI-TASK-010` | Malformed `--param`, unknown profile/unit/sheet, and unknown option fail non-zero and name the invalid value; valid string values remain supported | P0 automation can render with ignored intent | Expand option matrix when new options are added |
| `CLI-TASK-013` Config file and precedence model | `CLI-CONFIG-001` | `✔️` | `implemented` | `P1` | `relgeo/cli` | `.relgeo.json` schema; path/format/unit/profile defaults | A documented config file can set supported defaults; CLI flags override env/config; invalid config fails clearly; `--no-config` makes behavior explicit | P1 repeated automation is verbose and inconsistent | Retain config precedence regression |
| `CLI-TASK-014` Noninteractive environment controls | `CLI-CONFIG-002` | `✔️` | `implemented` | `P1` | `relgeo/cli` | no-color/CI contract; diagnostics mode | CI/no-color environment and flags suppress prompts/color/progress noise; stdout remains machine data and stderr remains diagnostics across commands | P1 terminal ambient state can change scripts | Retain CI/stream regression |
| `CLI-TASK-015` Document watch/rebuild lifecycle | `CLI-AUTO-002` | `⏸️` | `held` | `P2` | `relgeo/cli` | separate watcher/debounce model; failure recovery decision | One-shot CLI explicitly does not watch source/config or keep a rebuild session alive; lifecycle tests await a separate scope decision | P2/P1 iterative workflows need wrappers | Keep held; do not infer watch from package build `dev` |
| `CLI-TASK-016` Stable scripting streams and no-color mode | `CLI-AUTO-003` | `✔️` | `implemented` | `P1` | `relgeo/cli` | `CLI-TASK-009`; no-color/progress policy | For JSON/SVG/graph, stdout contains only requested data; progress/diagnostics go to stderr; explicit no-color/CI mode is tested for `info`, `check`, and `compile` | P1 pipelines may parse human noise | Retain stream snapshots |
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
