# RelGeo CLI Status Matrix

> **Coverage statement — 2026-10-30.** This is the capability-first downstream
> view of all 35 expected CLI IDs. Statuses are taken from the
> [expected-versus-observed reconciliation](./reconciliation.md);
> discovery details remain in the [implementation audit](./implementation-audit.md).
> This matrix manages gaps and evidence; it does not implement any capability.

| Field | Value |
| --- | --- |
| Surface owner | `relgeo/cli` for command, input/output, automation, and package boundary |
| Delegated semantic owners | `spec/`, `@relgeo/core`, and `@relgeo/renderer-svg` |
| Compatibility line | RelGeo DSL `0.5`; package `@relgeo/cli@0.5.0` |
| Policy evidence | [Maturation master plan](../../MATURATION-MASTER-PLAN.md) · [compatibility matrix](../../compatibility-matrix.json) · [npm release guard](../../plans/03-npm-release-guard.md) |
| Status | 35 expected rows joined; matrix is a downstream status view |

## Status and evidence legend

| Status | Meaning |
| --- | --- |
| `✔️` | Implemented on the stated CLI boundary with direct local or conformance evidence. |
| `🌗` | Partial implementation, coverage, result shape, or delivery evidence. |
| `❌` | Expected CLI capability was searched and is absent; it remains an explicit implementation gap. |
| `➖` | Not applicable to CLI because another surface owns the behavior. |
| `⏸️` | Deferred or held by an explicit scope/protocol decision. |
| `⚠️` | Confirmed defect or contract mismatch at the CLI boundary. |
| `?` | Evidence limitation only; it is not an implementation status and never replaces `❌`. |

Evidence is deliberately separate from status. Local tests and fixture gates do
not establish current Node 24, registry, CI, cross-OS, or public-package proof.

## Coverage checkpoint

| Check | Result |
| --- | --- |
| Expected catalog rows | 35 |
| Matrix rows | 35 |
| Missing / duplicate / extra IDs | 0 / 0 / 0 |
| Status counts | 17 `✔️`, 9 `🌗`, 6 `❌`, 2 `⚠️`, 1 `⏸️` held outside the implementation-gap set |
| Implementation-gap candidates | 17: 9 `🌗`, 6 `❌`, 2 `⚠️` |
| Current evidence refresh | Audit §6 records the 2026-10-30 CLI smoke revalidation (9/9) and direct negative probes; Node 24, CI, registry, cross-OS, and TTY evidence remain explicitly unverified |

## Capability-first matrix

| ID / capability | Status | Evidence | Gap / limitation | Owner | Dependency | Risk | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `CLI-DISC-001` Command discovery and command list | `✔️` | Audit §3/§5; Commander root help probe | No cross-version help snapshot | `relgeo/cli` | Commander command contract | M: discoverability drift | Add a help snapshot if release UX becomes contractual |
| `CLI-DISC-002` Contextual help and usage errors | `✔️` | Audit §3/§5; root/subcommand help probes | Wording stability is not snapshot-tested | `relgeo/cli` | Commander error formatting | M: callers may rely on unstable prose | Define stable help/error assertions |
| `CLI-DISC-003` Version and compatibility disclosure | `✔️` | Audit §5; `--version`; package and compatibility matrix | Registry-installed version not rerun | `relgeo/cli` + workspace | package metadata; DSL policy | M: wrong release line can be consumed | Keep version/line check in release gate |
| `CLI-INIT-001` `init` starter document workflow | `❌` | Audit §3/§5; no command/template; negative probe | No starter workflow exists | `relgeo/cli` + spec | starter template and validity contract | P1 onboarding cannot start from CLI | Define minimal template and add `init` command fixture |
| `CLI-OPEN-001` `open`/document selection workflow | `🌗` | Audit §3/§5; existing path arguments, no named `open` | No explicit open semantics or command | `relgeo/cli` | path/stream input contract | P1 user journey is implicit | Decide whether path selection is sufficient or add bounded `open` |
| `CLI-IN-001` File input | `✔️` | Audit §5; path resolution, existence, UTF-8 reads; CLI tests | Cross-platform path matrix not current | `relgeo/cli` | filesystem/input boundary | M: shell behavior can vary | Preserve path/error tests in release gate |
| `CLI-IN-002` Stdin input and pipeline composition | `❌` | Audit §3/§5; `compile -` returns file-not-found | No stdin reader or pipeline protocol | `relgeo/cli` | stdin precedence and encoding rules | P1 CI pipelines need temp files | Define `-` semantics and add pipe tests |
| `CLI-IN-003` Input precedence and encoding rules | `🌗` | Audit §5; UTF-8 path handling only | Path/stdin precedence, empty input, and encoding failures are uncontracted | `relgeo/cli` | stdin support; host filesystem | P1 ambiguous automation input | Add precedence/empty/encoding acceptance matrix |
| `CLI-INSPECT-001` Document inspection/open metadata | `✔️` | Audit §3/§5; `info` source and tests | Editor-mode inspection is not full validation | `relgeo/cli` delegates to core/spec | core editor parser | M: users may confuse inspect and validate | Document the semantic boundary and retain tests |
| `CLI-VALID-001` `validate` document validation | `✔️` | Audit §5; `check`/`validate`, tests, conformance fixtures | Warning/phase semantics are not fully formalized | `relgeo/cli` + core/spec | resolver and diagnostic model | M: CI interpretation can drift | Preserve validation fixture and error-code checks |
| `CLI-VALID-002` `check` compatibility alias | `✔️` | Audit §3/§5; Commander alias and help probe | Alias wording is not versioned | `relgeo/cli` | command compatibility policy | L: script migration ambiguity | Keep alias help and behavior regression-tested |
| `CLI-RENDER-001` Resolve/compile/render workflow | `✔️` | Audit §5; compile pipeline; conformance 260/260 | Published runtime not verified | `relgeo/cli` + core/renderer | parser, resolver, renderer | M: package/runtime drift | Keep CLI compile in shared conformance gate |
| `CLI-RENDER-002` Profile, parameter, and unit selection | `🌗` | Audit §5; options and one override test; fixture coverage | Combination and invalid-option coverage is narrow | `relgeo/cli` + core/spec | evaluator, profiles, units | P1 reproducibility errors | Add profile/param/unit success and failure matrix |
| `CLI-RENDER-003` Sheet/view targeting | `🌗` | Audit §5; `--sheet` and sheet-capable fixtures | Invalid/missing selector behavior lacks direct CLI tests | `relgeo/cli` + renderer | sheet/view semantics | P1 wrong artifact or unclear failure | Add valid/invalid selector tests |
| `CLI-OUT-001` JSON resolved-scene output | `✔️` | Audit §5; JSON test and scene assertions | No independently versioned CLI JSON schema | core + `relgeo/cli` | resolved-scene contract | P1 downstream schema drift | Define compatibility note and representative snapshots |
| `CLI-OUT-002` SVG rendering output | `✔️` | Audit §5; SVG test; exact fixture comparisons | Renderer option breadth is intentionally bounded | renderer + `relgeo/cli` | renderer semantics | M: missing option assumptions | Document exposed option mapping |
| `CLI-OUT-003` Dependency graph output | `✔️` | Audit §5; graph test and parsed output | Graph schema has no separate compatibility document | core + `relgeo/cli` | graph extraction | M: automation relies on implicit shape | Add graph schema note or snapshot |
| `CLI-OUT-004` Stdout versus file output | `🌗` | Audit §5; stdout branch and `fs.outputFile` | Overwrite, permission, encoding, and write failures lack tests | `relgeo/cli` | filesystem permissions | P1 artifact loss or silent write drift | Add temp-directory write/failure tests |
| `CLI-DIAG-001` Structured phase-aware diagnostics | `🌗` | Audit §5; core codes/path/object reach CLI | No phase/severity/location envelope at CLI boundary | `relgeo/cli` + spec/core | shared diagnostic model | P1 automation cannot classify failures | Define transport envelope and serialization tests |
| `CLI-DIAG-002` Human-readable diagnostics | `✔️` | Audit §5; stderr headings/codes/path/object; fixtures | Color and exact prose vary by environment | `relgeo/cli` | core error codes | M: terminal/CI readability drift | Add no-color and representative wording checks |
| `CLI-DIAG-003` Machine-readable diagnostics mode | `❌` | Audit §3/§5; no JSON diagnostics flag/envelope | Automation must scrape human prose | `relgeo/cli` | diagnostic envelope and exit contract | P0/P1 brittle CI integrations | Define `--diagnostics json` contract and fixture tests |
| `CLI-EXIT-001` Exit-code contract | `🌗` | Audit §5; common `0`/`1` probes and tests | Usage/input/validation/write classes are not distinct | `relgeo/cli` | error taxonomy and write boundary | P1 CI cannot route remediation | Publish exit taxonomy and test each class |
| `CLI-ERR-001` Deterministic error handling | `⚠️` | Audit §3/§5; unknown format emits JSON and exits `0` | Unsupported format silently falls through | `relgeo/cli` | format allowlist; Commander validation | P0 caller typo produces false success | Reject unknown format and add regression fixture |
| `CLI-ERR-002` Unknown-option/unknown-format rejection | `⚠️` | Audit §3/§5; malformed `--param` ignored; unknown format accepted | Option/parameter parser accepts invalid values silently | `relgeo/cli` | option schema and typed override parser | P0 automation may render wrong artifact | Validate format, parameter syntax, and selector values |
| `CLI-CONFIG-001` Explicit configuration sources | `❌` | Audit §3/§5; no config loader, schema, precedence, or `--config` | Reusable defaults cannot be declared | `relgeo/cli` | config schema and precedence policy | P1 repeated automation is verbose/inconsistent | Decide config file and precedence contract |
| `CLI-CONFIG-002` Noninteractive/environment configuration | `❌` | Audit §5; no color/prompt/CI switches found | Ambient terminal behavior is not explicitly controllable | `relgeo/cli` | environment contract; diagnostics mode | P1 CI output can be non-deterministic | Define no-color/CI flags and environment behavior |
| `CLI-AUTO-001` Noninteractive automation mode | `✔️` | Audit §5; root scripts and conformance consume commands | Node 24/canonical CI remains unverified | `relgeo/cli` + workspace | shell contract; package runtime | M: local success may not ship | Re-run canonical automation gate |
| `CLI-AUTO-002` Watch/rebuild workflow | `❌` | Audit §3/§5; no document watcher/debounce/lifecycle | No source/config watch command | `relgeo/cli` | watch lifecycle and failure recovery | P2/P1 iterative workflows need wrappers | Define bounded watch contract or record explicit non-goal |
| `CLI-AUTO-003` Stable scripting streams | `🌗` | Audit §5; progress stderr and data stdout on compile | Info/check prose and color mode lack explicit machine contract | `relgeo/cli` | diagnostics/config modes | P1 pipelines may parse noise | Add stream and no-color acceptance tests |
| `CLI-AUTO-004` Optional long-running/JSON-RPC daemon boundary | `⏸️` | Audit §4/§5; no approved protocol or implementation | Held pending separate protocol decision | future CLI/protocol owner | scope decision; daemon security model | P2 premature protocol fragmentation | Keep held; create implementation work only after decision |
| `CLI-PACK-001` Executable package and `relgeo` binary | `✔️` | Audit §5; bin/dist/metadata and local binary run | Fresh registry install not executed | `relgeo/cli` + release owner | Node runtime; npm boundary | M: install path can drift | Run clean-install smoke under Node >=24 |
| `CLI-PACK-002` Reproducible build and tarball boundary | `✔️` | Audit §6; release audit 106/106; tarball 8 files | Default cache attempt was environment-limited; scoped rerun passed | `relgeo/cli` + release guard | package files and release script | M: accidental files in package | Keep pack boundary in release guard |
| `CLI-PACK-003` Compatibility/version policy | `✔️` | Audit §6; compatibility check 283/283; matrix/release order | Registry evidence remains separate | workspace + `relgeo/cli` | compatibility matrix; package metadata | M: cross-package line drift | Keep compatibility check as publish prerequisite |
| `CLI-PACK-004` Release verification and recovery boundary | `🌗` | Audit §5/§6; preflight/pack/registry verifier scripts | Current registry/public and Node 24 proof unverified | release owner + `relgeo/cli` | npm registry; canonical Node | P1 partial publish/recovery failure | Run registry consumer proof and record forward-fix evidence |
| `CLI-PACK-005` Cross-surface conformance consumption | `✔️` | Audit §6; conformance 260/260 across 20 fixtures | Fixture set is declared, not exhaustive CLI option coverage | workspace + `relgeo/cli` | fixture provenance; spec/core semantics | M: untested option regressions | Add fixtures only when capabilities are promoted |

## Scope and evidence findings

These findings preserve the required status vocabulary without turning another
surface's responsibility or an environment limitation into a CLI gap.

| Finding | Status | Evidence | Owner | Dependency | Risk | Next action |
| --- | --- | --- | --- | --- | --- | --- |
| Interactive editor, browser route, UI menu, native shortcut/gesture | `➖` | Reconciliation §4; language-service/Playground ownership | Playground / language-service | host UI contract | M: duplicate CLI scope | Keep out of CLI backlog and link host matrix |
| Independent parser, geometry, or SVG semantic engine | `➖` | Reconciliation §4; CLI delegates to spec/core/renderer | spec / core / renderer | delegated package contracts | M: semantic duplication | Preserve delegation boundary |
| Long-running daemon or JSON-RPC transport | `⏸️` | Reconciliation §3/§4; catalog decision | CLI + protocol owners | human scope decision | P2 fragmented protocol | Resolve scope before implementation |
| Node 24, current CI, registry install, cross-OS/TTY, public package | `?` | Audit §6; local environment limitations | workspace / release owner | canonical environments | P1 false delivery confidence | Schedule independent verification |

## Linked artifacts and handoff

- [Expected CLI capability catalog](./expected-capability-catalog.md)
- [CLI implementation audit](./implementation-audit.md)
- [CLI expected-versus-observed reconciliation](./reconciliation.md)
- [CLI implementation-gap backlog](./implementation-gap-backlog.md)
- [CLI coverage validation and handoff](./coverage-validation-handoff.md)
- [Inventory protocol](../INVENTORY-PROTOCOL.md)
- [Maturation master plan](../../MATURATION-MASTER-PLAN.md)
- [Compatibility matrix](../../compatibility-matrix.json)
- [npm release guard](../../plans/03-npm-release-guard.md)

The [historical CLI capability matrix](./capability-matrix.md) remains
available as prior evidence. It is not the expected-set source for this matrix.
