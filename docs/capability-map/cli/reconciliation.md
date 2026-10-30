# RelGeo CLI expected-versus-observed reconciliation

> **Coverage statement — 2026-10-30.** This document is a one-to-one join of
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
| Result counts | 17 implemented, 9 partial, 2 broken, 6 absent, 1 deferred |
| Implementation/evidence/scope columns present on every row | Yes |
| Audit trace present on every row | Yes; each trace points to the corresponding audit ID and evidence section |
| Current evidence refresh | Yes; audit §6 records the 2026-10-30 CLI smoke revalidation (9/9) and direct negative probes; Node 24/CI/registry/cross-OS evidence remains separate and unverified |

## 3. One-to-one reconciliation register

### A. Discovery, input, and inspection

| ID | Reconciliation result | Implementation status | Evidence status | Scope / owner decision | Audit trace |
| --- | --- | --- | --- | --- | --- |
| `CLI-DISC-001` | `✔️ implemented` | `implemented` | `verified-local` | `in scope`; CLI command contract | Audit §3/§5 `CLI-DISC-001`; `cli/src/index.ts:22-25`; help probe |
| `CLI-DISC-002` | `✔️ implemented` | `implemented` | `partial-local` | `in scope`; CLI owns help/usage wording | Audit §3/§5 `CLI-DISC-002`; root and subcommand help probes; no snapshots |
| `CLI-DISC-003` | `✔️ implemented` | `implemented` | `verified-local` | `in scope`; package/matrix version contract | Audit §5 `CLI-DISC-003`; `--version`; `cli/package.json`; compatibility matrix |
| `CLI-INIT-001` | `❌ absent` | `absent` | `verified-absence` | `expected-but-missing`; CLI owns starter workflow | Audit §3/§5 `CLI-INIT-001`; no `init` command/template found; negative probe |
| `CLI-OPEN-001` | `🌗 partial` | `partial` | `partial-local` | `in scope`; named open workflow remains a CLI gap | Audit §3/§5 `CLI-OPEN-001`; path arguments exist, no `open` command |
| `CLI-IN-001` | `✔️ implemented` | `implemented` | `verified-local` | `in scope`; CLI filesystem input | Audit §5 `CLI-IN-001`; `cli/src/index.ts:33-39,125-131,198-204`; file tests |
| `CLI-IN-002` | `❌ absent` | `absent` | `verified-absence` | `expected-but-missing`; CLI owns stdin protocol | Audit §3/§5 `CLI-IN-002`; `compile -` returns file-not-found |
| `CLI-IN-003` | `🌗 partial` | `partial` | `partial-local` | `in scope`; input precedence/encoding contract incomplete | Audit §5 `CLI-IN-003`; UTF-8/path source exists, stdin/empty precedence absent |
| `CLI-INSPECT-001` | `✔️ implemented` | `implemented` | `partial-local` | `in scope`; CLI delegates document semantics to core/spec | Audit §3/§5 `CLI-INSPECT-001`; `info` source/tests; editor-mode limitation |

### B. Validation, rendering, and output

| ID | Reconciliation result | Implementation status | Evidence status | Scope / owner decision | Audit trace |
| --- | --- | --- | --- | --- | --- |
| `CLI-VALID-001` | `✔️ implemented` | `implemented` | `local-conformance` | `in scope`; CLI orchestration, core/spec semantics | Audit §5 `CLI-VALID-001`; `check`/`validate`; CLI tests and runtime fixtures |
| `CLI-VALID-002` | `✔️ implemented` | `implemented` | `verified-local` | `in scope`; alias compatibility owned by CLI | Audit §3/§5 `CLI-VALID-002`; Commander alias and `validate --help` |
| `CLI-RENDER-001` | `✔️ implemented` | `implemented` | `local-conformance` | `in scope`; core/renderer remain semantic owners | Audit §5 `CLI-RENDER-001`; compile pipeline; conformance 260/260 |
| `CLI-RENDER-002` | `🌗 partial` | `partial` | `partial-local` | `in scope`; option breadth and negative cases incomplete | Audit §5 `CLI-RENDER-002`; profile/param/unit options; limited tests/fixture |
| `CLI-RENDER-003` | `🌗 partial` | `partial` | `partial-local` | `in scope`; sheet/view mapping bounded to renderer path | Audit §5 `CLI-RENDER-003`; `--sheet`; no direct invalid-selector test |
| `CLI-OUT-001` | `✔️ implemented` | `implemented` | `partial-local` | `in scope`; core scene semantics, CLI serialization boundary | Audit §5 `CLI-OUT-001`; JSON test; no separate CLI schema |
| `CLI-OUT-002` | `✔️ implemented` | `implemented` | `local-conformance` | `in scope`; renderer owns SVG semantics | Audit §5 `CLI-OUT-002`; SVG test and exact fixture comparisons |
| `CLI-OUT-003` | `✔️ implemented` | `implemented` | `partial-local` | `in scope`; core owns graph semantics | Audit §5 `CLI-OUT-003`; graph test; no separately versioned graph schema |
| `CLI-OUT-004` | `🌗 partial` | `partial` | `partial-local` | `in scope`; CLI owns stdout/file behavior | Audit §5 `CLI-OUT-004`; `fs.outputFile` source; no failure/overwrite tests |

### C. Diagnostics, exits, and errors

| ID | Reconciliation result | Implementation status | Evidence status | Scope / owner decision | Audit trace |
| --- | --- | --- | --- | --- | --- |
| `CLI-DIAG-001` | `🌗 partial` | `partial` | `local-conformance` | `boundary only`; codes/semantics come from spec/core, CLI transport is incomplete | Audit §5 `CLI-DIAG-001`; core error codes reach CLI, no phase/severity envelope |
| `CLI-DIAG-002` | `✔️ implemented` | `implemented` | `local-conformance` | `in scope`; CLI owns human presentation | Audit §5 `CLI-DIAG-002`; stderr headings/codes/object/path; runtime fixtures |
| `CLI-DIAG-003` | `❌ absent` | `absent` | `verified-absence` | `expected-but-missing`; CLI machine diagnostics contract | Audit §5 `CLI-DIAG-003`; no JSON diagnostics mode/envelope found |
| `CLI-EXIT-001` | `🌗 partial` | `partial` | `partial-local` | `in scope`; CLI exit taxonomy incomplete | Audit §5 `CLI-EXIT-001`; common `0`/`1` behavior only, no documented classes |
| `CLI-ERR-001` | `⚠️ broken` | `broken` | `mismatch-confirmed` | `in scope`; error boundary must reject unsupported formats | Audit §3/§5 `CLI-ERR-001`; unknown format emits JSON and exits `0` |
| `CLI-ERR-002` | `⚠️ broken` | `broken` | `mismatch-confirmed` | `in scope`; CLI option/format/parameter validation | Audit §3/§5 `CLI-ERR-002`; malformed param ignored, unknown format accepted |

### D. Configuration, automation, and scripting

| ID | Reconciliation result | Implementation status | Evidence status | Scope / owner decision | Audit trace |
| --- | --- | --- | --- | --- | --- |
| `CLI-CONFIG-001` | `❌ absent` | `absent` | `verified-absence` | `expected-but-missing`; CLI config schema/precedence | Audit §3/§5 `CLI-CONFIG-001`; no config loader/option/source found |
| `CLI-CONFIG-002` | `❌ absent` | `absent` | `verified-absence` | `expected-but-missing`; CLI automation environment contract | Audit §5 `CLI-CONFIG-002`; no documented color/prompt/CI config switches |
| `CLI-AUTO-001` | `✔️ implemented` | `implemented` | `local-conformance` | `in scope`; root scripts consume noninteractive CLI | Audit §5 `CLI-AUTO-001`; conformance/integration usage; Node24/CI limited |
| `CLI-AUTO-002` | `❌ absent` | `absent` | `verified-absence` | `expected-but-missing`; CLI document watch lifecycle | Audit §3/§5 `CLI-AUTO-002`; no watch command/watcher/debounce found |
| `CLI-AUTO-003` | `🌗 partial` | `partial` | `partial-local` | `in scope`; stream separation exists only on compile path | Audit §5 `CLI-AUTO-003`; progress stderr/data stdout; no explicit no-color/machine mode |
| `CLI-AUTO-004` | `⏸️ deferred` | `deferred` | `scope-held` | `held`; future daemon/JSON-RPC requires a separate protocol decision | Audit §4/§5 `CLI-AUTO-004`; no approved protocol or implementation |

### E. Packaging, compatibility, and cross-surface delivery

| ID | Reconciliation result | Implementation status | Evidence status | Scope / owner decision | Audit trace |
| --- | --- | --- | --- | --- | --- |
| `CLI-PACK-001` | `✔️ implemented` | `implemented` | `environment-limited` | `in scope`; npm binary/package boundary | Audit §5 `CLI-PACK-001`; binary/dist/package metadata; registry install unverified |
| `CLI-PACK-002` | `✔️ implemented` | `implemented` | `verified-local` | `in scope`; release guard owns tarball boundary | Audit §6 `CLI-PACK-002`; release audit 106/106; CLI pack 8 files |
| `CLI-PACK-003` | `✔️ implemented` | `implemented` | `local-conformance` | `in scope`; matrix/spec/package compatibility | Audit §6 `CLI-PACK-003`; compatibility check 283/283; matrix/release order |
| `CLI-PACK-004` | `🌗 partial` | `partial` | `environment-limited` | `in scope`; manual release/recovery exists, current registry proof absent | Audit §5/§6 `CLI-PACK-004`; release scripts; Node24/public registry unverified |
| `CLI-PACK-005` | `✔️ implemented` | `implemented` | `local-conformance` | `in scope`; workspace owns fixture orchestration, spec owns semantics | Audit §6 `CLI-PACK-005`; conformance 260/260, exact CLI output/error checks |

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

## 5. Handoff

The reconciliation is documentation-only and does not claim to fix the gaps.
The next task can publish a user-facing status matrix and implementation gap
list using this register as the canonical expected-versus-observed join. It must
retain the six explicit `❌` rows, the two `⚠️` defects, the one `⏸️` held row,
and the separate evidence/scope findings.
