# RelGeo CLI expected-versus-observed reconciliation

> **Coverage statement — 2026-11-04.** This document is a one-to-one join of
> the 35 expected capability IDs in the CLI catalog with the observed rows in
> the CLI implementation audit. It does not add observed-only capabilities,
> remove expected rows, or convert an absent implementation into `➖` merely
> because delivery evidence is limited. Implementation, evidence, and scope
> remain separate dimensions.

| Field | Value |
| --- | --- |
| Expected source | [Expected CLI capability catalog](./expected-capability-catalog.md) |
| Observed source | [CLI implementation and evidence audit](./implementation-audit.md) |
| Policy sources | [Maturation master plan](../../MATURATION-MASTER-PLAN.md); [compatibility matrix](../../compatibility-matrix.json); [inventory protocol](../INVENTORY-PROTOCOL.md) |
| Surface owner | `relgeo/cli` for command/I/O/automation/package boundary; `spec/`, `@relgeo/core`, and `@relgeo/renderer-svg` retain delegated semantics |
| Status | Join complete; every expected ID has exactly one reconciliation row |
| Bounded selection | [CLI bounded in-scope selection](./in-scope-selection.md); selection is separate from reconciliation status and evidence |

## 1. Reconciliation rules

| Dimension | Allowed values | Meaning |
| --- | --- | --- |
| Reconciliation result | `✔️`, `🌗`, `⚠️`, `❌`, `⏸️`, `➖` | Compact result of joining expected scope with observed implementation. |
| Implementation status | `implemented`, `partial`, `broken`, `absent`, `deferred`, `not applicable` | What exists at the CLI boundary, independent of test strength. |
| Evidence status | `verified-local`, `local-conformance`, `partial-local`, `mismatch-confirmed`, `verified-absence`, `scope-held`, `environment-limited` | How the observation was established and what remains unverified. |
| Scope decision | `in scope`, `expected-but-missing`, `boundary only`, `held`, `not applicable` | Whether CLI is expected to own the behavior. |

Important distinction:

- `❌ absent` means the expected CLI implementation was searched and not found;
  it remains an explicit gap even if CI, registry, or cross-OS evidence is not
  available.
- `? unverified` is an evidence limitation, not a replacement for `❌`. In this
  join it appears in the findings section because no expected row is converted
  to an unverified implementation result.
- `➖ not-applicable` is reserved for capabilities owned by another surface or
  explicitly outside CLI responsibility. It is not used for `init`, stdin,
  config, watch, or machine diagnostics.
- `⏸️ deferred` records a held protocol boundary while preserving the expected
  row and its traceability.

## 2. Coverage validation

| Check | Result |
| --- | --- |
| Expected catalog rows | 35 |
| Reconciliation rows | 35 |
| Expected IDs missing from reconciliation | 0 |
| Observed-only IDs added to reconciliation | 0 |
| Duplicate reconciliation IDs | 0 |
| Result counts | 32 implemented, 1 partial, 0 broken, 0 absent, 2 deferred |
| Implementation/evidence/scope columns present on every row | Yes |
| Audit trace present on every row | Yes; each trace points to the corresponding audit ID and evidence section |
| Current evidence refresh | Yes; audit §6 records the 2026-11-04 CLI revalidation (38/38), typecheck, build, CLI pack boundary (8 files), conformance (298/298), and consumer checks; Node 24/CI/registry/cross-OS evidence remains separate and unverified |

## Contract lock for selected render gaps — 2026-11-04

This lock records the existing CLI boundary before implementation work. It does
not add a command or option, change diagnostic/exit-code meaning, or move the
package off the `0.5.x` compatibility line. CLI orchestration remains owned by
`relgeo/cli`; document evaluation and units remain owned by `spec/id/` and
`@relgeo/core`; sheet/view and SVG semantics remain owned by
`@relgeo/renderer-svg`. The compatibility line and release rules are taken
from [`docs/compatibility-matrix.json`](../../compatibility-matrix.json), while
the evidence separation follows the
[`INVENTORY-PROTOCOL.md`](../INVENTORY-PROTOCOL.md).

| Gap | Locked boundary and success behavior | Failure / edge behavior | Acceptance evidence expected | Normative / source-of-truth record |
| --- | --- | --- | --- | --- |
| `CLI-RENDER-002` profile, parameter, and unit selection | `compile <file>` and `check <file>`/`validate <file>` accept `--profile <name>`, repeatable `--param <key=value>`, and `--unit <unit>`. Supported target units remain `px`, `mm`, `cm`, `m`, and `in`; explicit parameter overrides are forwarded together with the selected profile. `compile` emits the requested resolved artifact; `check` resolves and reports success without a final artifact. | Malformed or empty parameter tokens fail with `INVALID_PARAMETER_OVERRIDE` and exit `2`; unknown parameters fail with `UNKNOWN_PARAMETER` and exit `2`; unknown profiles fail with `UNKNOWN_PROFILE` and exit `2`; unsupported units fail with `UNKNOWN_UNIT` and exit `2`. Values remain typed by the existing CLI parser: `true`/`false`, numeric literals, or non-empty strings. No invalid intent may be silently ignored. | `cli/src/__tests__/cli.test.ts`: string-like override, combined profile/override/unit, malformed/unknown parameter, unknown profile/unit, and check/profile cases; `fixtures/reference/16-v05-evaluator-units-candidate.yaml`; manifest `cliContractCoverage.renderOptions`; `pnpm test` in `cli/`. | Expected rows `CLI-RENDER-002` in the catalog and status matrix; `cli/src/index.ts` option/validation boundary; `cli/docs/README.md` option list; semantic authority `spec/id/` + `@relgeo/core`; compatibility line `0.5` and package policy `0.5.x`. |
| `CLI-RENDER-003` sheet/view targeting | `compile <file> --format svg` accepts `--sheet <id>` and `--view <id>`. A valid sheet selects that SVG sheet; a valid view selects its placement, auto-selecting the only matching sheet when unambiguous. Output is SVG only and contains the selected sheet/view projection. | `--sheet`/`--view` with a non-SVG format fails with `SHEET_FORMAT_MISMATCH`/`VIEW_FORMAT_MISMATCH` and exit `2`; unknown views fail with `UNKNOWN_VIEW` and exit `2`; an unknown selected sheet fails with `MISSING_SHEET` and exit `4`; a view on the wrong sheet fails with `VIEW_NOT_ON_SHEET` and exit `4`; an ambiguous view without `--sheet` fails with `VIEW_REQUIRES_SHEET` and exit `2`. Failures occur before output-file success is reported and must not leave a misleading artifact. | `cli/src/__tests__/cli.test.ts`: valid view selection, unknown sheet, unknown view, wrong-sheet, and non-SVG selector cases; manifest `cliContractCoverage.renderOptions`; `fixtures/reference/09-multi-sheet-title-block.yaml` for selector coverage; exact SVG/conformance checks via `pnpm test` in `cli/` and the shared fixture runner. | Expected row `CLI-RENDER-003` in the catalog and status matrix; `cli/src/index.ts` selector validation/selection boundary; `cli/docs/README.md` SVG option contract; semantic/render authority `spec/id/` + `@relgeo/renderer-svg`; compatibility line `0.5` and package policy `0.5.x`. |

The shared fixture manifest is evidence scope, not a replacement for the
normative spec or renderer contract. In particular, the selector fixture is
declared as supported legacy coverage; expanding it to an active 0.5 fixture
requires the fixture status/promotion rules to be updated separately. Local
tests do not claim Node 24, CI, registry, public-package, or cross-OS/TTY
evidence.

## 3. One-to-one reconciliation register

### A. Discovery, input, and inspection

| ID | Reconciliation result | Implementation status | Evidence status | Scope / owner decision | Audit trace |
| --- | --- | --- | --- | --- | --- |
| `CLI-DISC-001` | `✔️ implemented` | `implemented` | `verified-local` | `in scope`; CLI command contract | Audit §3/§5 `CLI-DISC-001`; `cli/src/index.ts:22-25`; help probe |
| `CLI-DISC-002` | `✔️ implemented` | `implemented` | `partial-local` | `in scope`; CLI owns help/usage wording | Audit §3/§5 `CLI-DISC-002`; root and subcommand help probes; no snapshots |
| `CLI-DISC-003` | `✔️ implemented` | `implemented` | `verified-local` | `in scope`; package/matrix version contract | Audit §5 `CLI-DISC-003`; `--version`; `cli/package.json`; compatibility matrix |
| `CLI-INIT-001` | `✔️ implemented` | `implemented` | `verified-local` | `in scope`; CLI owns starter workflow | Audit §3/§5 `CLI-INIT-001`; starter template, safe overwrite, and check regression |
| `CLI-OPEN-001` | `✔️ implemented` | `implemented` | `verified-local` | `in scope`; named metadata inspection workflow | Audit §3/§5 `CLI-OPEN-001`; `open` command and inspection regression |
| `CLI-IN-001` | `✔️ implemented` | `implemented` | `verified-local` | `in scope`; CLI filesystem input | Audit §5 `CLI-IN-001`; `cli/src/index.ts:33-39,125-131,198-204`; file tests |
| `CLI-IN-002` | `✔️ implemented` | `implemented` | `verified-local` | `in scope`; CLI owns stdin protocol | Audit §3/§5 `CLI-IN-002`; stdin, precedence, and empty-input tests |
| `CLI-IN-003` | `✔️ implemented` | `implemented` | `verified-local` | `in scope`; deterministic path/stdin and encoding contract | Audit §5 `CLI-IN-003`; explicit-path precedence, empty input, and strict UTF-8 regressions |
| `CLI-INSPECT-001` | `✔️ implemented` | `implemented` | `partial-local` | `in scope`; CLI delegates document semantics to core/spec | Audit §3/§5 `CLI-INSPECT-001`; `info` source/tests; editor-mode limitation |

### B. Validation, rendering, and output

| ID | Reconciliation result | Implementation status | Evidence status | Scope / owner decision | Audit trace |
| --- | --- | --- | --- | --- | --- |
| `CLI-VALID-001` | `✔️ implemented` | `implemented` | `local-conformance` | `in scope`; CLI orchestration, core/spec semantics | Audit §5 `CLI-VALID-001`; `check`/`validate`; CLI tests and runtime fixtures |
| `CLI-VALID-002` | `✔️ implemented` | `implemented` | `verified-local` | `in scope`; alias compatibility owned by CLI | Audit §3/§5 `CLI-VALID-002`; Commander alias and `validate --help` |
| `CLI-RENDER-001` | `✔️ implemented` | `implemented` | `local-conformance` | `in scope`; core/renderer remain semantic owners | Audit §5 `CLI-RENDER-001`; compile pipeline; conformance 298/298 |
| `CLI-RENDER-002` | `✔️ implemented` | `implemented` | `verified-local` | `in scope`; CLI option matrix closed at the documented boundary; core/spec retain semantics | Audit §5/§6 `CLI-RENDER-002`; v0.5 fixture, compile/check profile-plus-override/unit matrix, strict failures |
| `CLI-RENDER-003` | `✔️ implemented` | `implemented` | `verified-local` | `in scope`; CLI selector mapping and failure transport closed; renderer retains SVG semantics | Audit §5/§6 `CLI-RENDER-003`; CLI sheet validation, valid sheet/view, wrong-sheet/unknown-view/format mismatch, and no-artifact tests |
| `CLI-OUT-001` | `✔️ implemented` | `implemented` | `partial-local` | `in scope`; core scene semantics, CLI serialization boundary | Audit §5 `CLI-OUT-001`; JSON test; no separate CLI schema |
| `CLI-OUT-002` | `✔️ implemented` | `implemented` | `local-conformance` | `in scope`; renderer owns SVG semantics | Audit §5 `CLI-OUT-002`; SVG test and exact fixture comparisons |
| `CLI-OUT-003` | `✔️ implemented` | `implemented` | `partial-local` | `in scope`; core owns graph semantics | Audit §5 `CLI-OUT-003`; graph test; no separately versioned graph schema |
| `CLI-OUT-004` | `✔️ implemented` | `implemented` | `verified-local` | `in scope`; CLI owns stdout/file behavior | Audit §5 `CLI-OUT-004`; nested output, overwrite, UTF-8, success-stream, and write-failure tests |

### C. Diagnostics, exits, and errors

| ID | Reconciliation result | Implementation status | Evidence status | Scope / owner decision | Audit trace |
| --- | --- | --- | --- | --- | --- |
| `CLI-DIAG-001` | `✔️ implemented` | `implemented` | `local-conformance` | `boundary only`; codes/semantics come from spec/core, CLI transport is bounded | Audit §5 `CLI-DIAG-001`; phase/severity/location envelope tests and core error-model mapping |
| `CLI-DIAG-002` | `✔️ implemented` | `implemented` | `local-conformance` | `in scope`; CLI owns human presentation | Audit §5 `CLI-DIAG-002`; stderr headings/codes/object/path; runtime fixtures |
| `CLI-DIAG-003` | `✔️ implemented` | `implemented` | `verified-local` | `in scope`; CLI machine diagnostics contract | Audit §5 `CLI-DIAG-003`; JSON stderr envelope tests for input/runtime/usage/output failures |
| `CLI-EXIT-001` | `✔️ implemented` | `implemented` | `verified-local` | `in scope`; CLI owns numeric exit taxonomy | Audit §5 `CLI-EXIT-001`; usage/input/validation/output category tests |
| `CLI-ERR-001` | `✔️ implemented` | `implemented` | `verified-local` | `in scope`; error boundary must reject unsupported formats | Audit §3/§5 `CLI-ERR-001`; unknown format exits `2` without fallback |
| `CLI-ERR-002` | `✔️ implemented` | `implemented` | `verified-local` | `in scope`; CLI option/format/parameter validation | Audit §3/§5 `CLI-ERR-002`; strict format/param/profile/unit tests |

### D. Configuration, automation, and scripting

| ID | Reconciliation result | Implementation status | Evidence status | Scope / owner decision | Audit trace |
| --- | --- | --- | --- | --- | --- |
| `CLI-CONFIG-001` | `✔️ implemented` | `implemented` | `verified-local` | `in scope`; CLI config schema/precedence | Audit §3/§5 `CLI-CONFIG-001`; `.relgeo.json`, explicit config, env, flags, and `--no-config` tests |
| `CLI-CONFIG-002` | `✔️ implemented` | `implemented` | `verified-local` | `in scope`; CLI automation environment contract | Audit §5 `CLI-CONFIG-002`; `NO_COLOR`, `CI`, `RELGEO_*`, and stream regressions |
| `CLI-AUTO-001` | `✔️ implemented` | `implemented` | `local-conformance` | `in scope`; root scripts consume noninteractive CLI | Audit §5 `CLI-AUTO-001`; conformance/integration usage; Node24/CI limited |
| `CLI-AUTO-002` | `⏸️ deferred` | `deferred` | `scope-held` | `held`; separate document-watch lifecycle decision required | Audit §4/§5 `CLI-AUTO-002`; one-shot CLI explicitly excludes watch/rebuild |
| `CLI-AUTO-003` | `✔️ implemented` | `implemented` | `verified-local` | `in scope`; stream separation and no-color contract | Audit §5 `CLI-AUTO-003`; stdout/stderr, JSON mode, no-color, and CI tests |
| `CLI-AUTO-004` | `⏸️ deferred` | `deferred` | `scope-held` | `held`; future daemon/JSON-RPC requires a separate protocol decision | Audit §4/§5 `CLI-AUTO-004`; no approved protocol or implementation |

### E. Packaging, compatibility, and cross-surface delivery

| ID | Reconciliation result | Implementation status | Evidence status | Scope / owner decision | Audit trace |
| --- | --- | --- | --- | --- | --- |
| `CLI-PACK-001` | `✔️ implemented` | `implemented` | `environment-limited` | `in scope`; npm binary/package boundary | Audit §5 `CLI-PACK-001`; binary/dist/package metadata; registry install unverified |
| `CLI-PACK-002` | `✔️ implemented` | `implemented` | `verified-local` | `in scope`; release guard owns tarball boundary | Audit §6 `CLI-PACK-002`; prior scoped release audit 106/106; current CLI pack boundary 8 files; consumer refresh §5 |
| `CLI-PACK-003` | `✔️ implemented` | `implemented` | `environment-limited` | `in scope`; CLI package/version compatibility; root cross-repo gate remains outside CLI | Audit §6 `CLI-PACK-003`; CLI-specific compatibility rows pass; root gate has unrelated core/playground/Flutter failures |
| `CLI-PACK-004` | `🌗 partial` | `partial` | `environment-limited` | `in scope`; manual release/recovery exists, current registry proof absent | Audit §5/§6 `CLI-PACK-004`; release scripts; Node24/public registry unverified |
| `CLI-PACK-005` | `✔️ implemented` | `implemented` | `local-conformance` | `in scope`; workspace owns fixture orchestration, spec owns semantics | Audit §6 `CLI-PACK-005`; conformance 298/298, exact CLI output/error checks |

## 4. Scope and evidence findings kept separate

These findings qualify the join but do not replace any of its 35 expected rows.

| Finding | Dimension | Reconciliation treatment |
| --- | --- | --- |
| CLI UI menu, browser route, native shortcut/gesture, and interactive editor | Scope | `➖ not-applicable`; website/Playground/language-service own those surfaces. No expected CLI ID is changed to `➖`. |
| Independent parser, resolver, geometry, or SVG semantic implementation | Scope | `➖ not-applicable` as a CLI-owned implementation; CLI rows remain assessed at invocation/output boundary. |
| Flutter/mobile runtime service | Scope | `➖ not-applicable`; accepted project scope keeps Flutter separate and mobile deferred. |
| Node 24, current CI, fresh registry install, cross-OS/TTY behavior | Evidence | `? unverified` limitation only; no locally observed implementation row is converted into `❌` or promoted to E4/E5. |
| Default release audit with repository npm cache | Evidence/environment | `? unverified` for that attempt because npm cache permissions caused `EPERM`; scoped temporary cache rerun passed and is the valid local pack evidence. |
| Historical master-plan and CI/public claims | Evidence freshness | Historical context only; they do not upgrade current local evidence. |

## 5. Consumer and integration boundary refresh — 2026-11-04

This refresh checks the selected CLI rows at the downstream boundaries that are
available in the current checkout. It separates local package/conformance
evidence from canonical CI and public-registry evidence; no historical CI or
public result is reused as current-pointer proof.

| Boundary | Result | Evidence class and limitation |
| --- | --- | --- |
| CLI package tarball | PASS — `npm pack --dry-run --json` reports `@relgeo/cli@0.5.0` with 8 files: `LICENSE`, `README.md`, `bin/relgeo.js`, four `dist/*` files, and `package.json` | Local E2 package boundary; no publish or registry install claim |
| Shared downstream fixture consumers | PASS — `pnpm run conformance:fixtures` reports 298 passed, 0 failed across 23 fixtures, including exact CLI SVG/error output and semantic serialization/provenance assertions | Local E3 cross-surface/conformance evidence |
| Current full local integration gate | ENVIRONMENT UNAVAILABLE — `pnpm run integration:gate -- --local` exits 2 before stages because the host provides Node 22.23.2 and the runner requires Node 24+ | Not a consumer parity failure; package/consumer stages did not execute through this runner |
| Repository-wide release audit | ENVIRONMENT/WORKSPACE-LIMITED — `pnpm run release:audit` records 63 passed and 8 failed; failures include npm cache `EPERM`/log-write errors and a separate core version mismatch outside the selected CLI rows | Not used as a CLI consumer failure; the scoped CLI pack result above is the applicable local artifact evidence |
| Canonical CI and public registry | Not rerun for this working tree | Historical records in [`docs/plans/01-cross-repo-integration-gate.md`](../../plans/01-cross-repo-integration-gate.md) remain revision-bound; current CI/public evidence is unverified |

Conclusion for the selected CLI boundary: no local downstream consumer
regression was observed. The implementation and fixture changes remain
compatible with the active `0.5.x` package shape, while the unavailable Node
24, CI, registry, and cross-OS environments remain explicitly deferred.

## 6. Handoff

The reconciliation records the source/test/fixture implementation closure for
the two selected render-option rows and still does not claim Node 24, registry,
CI, or cross-OS parity. The remaining partial row is release verification,
while watch/rebuild and daemon/JSON-RPC remain explicitly held by scope.
