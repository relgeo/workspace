# RelGeo CLI Status Matrix

> **Coverage statement — 2026-11-05.** This is the capability-first downstream
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
| Bounded selection | [CLI bounded in-scope selection](./in-scope-selection.md): 11 actionable rows; current statuses are reconciled against the latest implementation audit |

## Status and evidence legend

| Status | Meaning |
| --- | --- |
| `✔️` | Implemented on the stated CLI boundary with direct local or conformance evidence. |
| `🌗` | Partial implementation, coverage, result shape, or delivery evidence. |
| `❌` | Expected CLI capability was searched and is absent; it remains an explicit implementation gap. |
| `➖` | Not applicable to CLI because another surface owns the behavior. |
| `⏸️` | Deferred or held by an explicit scope/protocol/evidence decision. |
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
| Status counts | 32 `✔️`, 0 `🌗`, 0 `❌`, 0 `⚠️`, 3 `⏸️` held/deferred |
| Implementation-gap candidates | 0; `CLI-PACK-004` is evidence-only/deferred release proof, while watch and daemon rows remain held by scope |
| P0/P1 triage disposition | `CLI-RENDER-002` and `CLI-RENDER-003` are implementation-closed with source/test/fixture evidence; 13 other P0/P1 rows remain implementation-closed/regression-only; `CLI-PACK-004` is evidence-only (Node 24/registry/CI/release environment) |
| Active implementation tranche | 11 historical intake rows; all are now implementation-closed with source/test/fixture evidence. No `➖` or `⏸️` row is treated as implementation work. |
| Current evidence refresh | Audit §6 records the 2026-11-05 CLI 38/38, typecheck, build, pack-boundary, and conformance 298/298 checks; clean installed-package consumer, Node 24, CI, registry, cross-OS, TTY, and Playground/Pages revision/provenance handoff evidence remain explicitly unverified and are not implementation prerequisites |

## Capability-first matrix

| ID / capability | Status | Evidence | Gap / limitation | Owner | Dependency | Risk | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `CLI-DISC-001` Command discovery and command list | `✔️` | Audit §3/§5; Commander root help probe | No cross-version help snapshot | `relgeo/cli` | Commander command contract | M: discoverability drift | Add a help snapshot if release UX becomes contractual |
| `CLI-DISC-002` Contextual help and usage errors | `✔️` | Audit §3/§5; root/subcommand help probes | Wording stability is not snapshot-tested | `relgeo/cli` | Commander error formatting | M: callers may rely on unstable prose | Define stable help/error assertions |
| `CLI-DISC-003` Version and compatibility disclosure | `✔️` | Audit §5; `--version`; package and compatibility matrix | Registry-installed version not rerun | `relgeo/cli` + workspace | package metadata; DSL policy | M: wrong release line can be consumed | Keep version/line check in release gate |
| `CLI-INIT-001` `init` starter document workflow | `✔️` | Audit §3/§5; starter regression | Minimal v0.5 starter, parent creation, and safe overwrite are implemented | `relgeo/cli` + spec | starter template and validity contract | P1 onboarding regression | Retain init/check regression |
| `CLI-OPEN-001` `open`/document selection workflow | `✔️` | Audit §3/§5; open/info regression | Bounded metadata inspection exists without an editor | `relgeo/cli` | path/stream input contract | M: users may expect an editor | Keep inspection boundary explicit |
| `CLI-IN-001` File input | `✔️` | Audit §5; path resolution, existence, UTF-8 reads; CLI tests | Cross-platform path matrix not current | `relgeo/cli` | filesystem/input boundary | M: shell behavior can vary | Preserve path/error tests in release gate |
| `CLI-IN-002` Stdin input and pipeline composition | `✔️` | Audit §3/§5; stdin and empty-input tests | `-` reads stdin; broader encoding matrix remains bounded | `relgeo/cli` | stdin precedence and encoding rules | P1 CI pipelines need stable stream contract | Expand shell/encoding coverage |
| `CLI-IN-003` Input precedence and encoding rules | `✔️` | Audit §5; precedence/empty/strict UTF-8 tests | Cross-platform filesystem behavior remains separately unverified | `relgeo/cli` | stdin support; host filesystem | P1 ambiguous automation input | Preserve source-aware regressions |
| `CLI-INSPECT-001` Document inspection/open metadata | `✔️` | Audit §3/§5; `info` source and tests | Editor-mode inspection is not full validation | `relgeo/cli` delegates to core/spec | core editor parser | M: users may confuse inspect and validate | Document the semantic boundary and retain tests |
| `CLI-VALID-001` `validate` document validation | `✔️` | Audit §5; `check`/`validate`, tests, conformance fixtures | Warning/phase semantics are not fully formalized | `relgeo/cli` + core/spec | resolver and diagnostic model | M: CI interpretation can drift | Preserve validation fixture and error-code checks |
| `CLI-VALID-002` `check` compatibility alias | `✔️` | Audit §3/§5; Commander alias and help probe | Alias wording is not versioned | `relgeo/cli` | command compatibility policy | L: script migration ambiguity | Keep alias help and behavior regression-tested |
| `CLI-RENDER-001` Resolve/compile/render workflow | `✔️` | Audit §5; compile pipeline; conformance 298/298 | Published runtime not verified | `relgeo/cli` + core/renderer | parser, resolver, renderer | M: package/runtime drift | Keep CLI compile in shared conformance gate |
| `CLI-RENDER-002` Profile, parameter, and unit selection | `✔️` | Audit §5/§6; v0.5 fixture and 38-test option matrix | Delegated evaluator semantics remain owned by core/spec | `relgeo/cli` + core/spec | evaluator, profiles, units | M: future option additions can drift | Retain profile/typed-override/unit regressions |
| `CLI-RENDER-003` Sheet/view targeting | `✔️` | Audit §5/§6; v0.5 fixture, selector tests, typed failures, and no-artifact failure | Renderer output breadth remains separately bounded; selected-sheet SVG continues through the renderer-owned sizing/title-block contract | `relgeo/cli` + renderer | sheet/view semantics | M: future selector additions can drift | Retain valid/invalid selector regressions |
| `CLI-OUT-001` JSON resolved-scene output | `✔️` | Audit §5; JSON test and scene assertions | No independently versioned CLI JSON schema | core + `relgeo/cli` | resolved-scene contract | P1 downstream schema drift | Define compatibility note and representative snapshots |
| `CLI-OUT-002` SVG rendering output | `✔️` | Audit §5; SVG test; exact fixture comparisons; conformance and renderer semantic replay | Renderer option breadth is intentionally bounded; byte snapshots remain reviewable output checks, not cross-host semantic parity | renderer + `relgeo/cli` | renderer semantics | M: missing option assumptions | Document exposed option mapping |
| `CLI-OUT-003` Dependency graph output | `✔️` | Audit §5; graph test and parsed output | Graph schema has no separate compatibility document | core + `relgeo/cli` | graph extraction | M: automation relies on implicit shape | Add graph schema note or snapshot |
| `CLI-OUT-004` Stdout versus file output | `✔️` | Audit §5; nested output, overwrite, UTF-8, success-stream, and write-failure tests | Permission and cross-host filesystem matrices remain limited | `relgeo/cli` | filesystem permissions | P1 artifact loss or silent write drift | Broaden host matrix separately |
| `CLI-DIAG-001` Structured phase-aware diagnostics | `✔️` | Audit §5; core fields and CLI human/JSON envelope tests | Delegated diagnostic semantics remain owned by spec/core | `relgeo/cli` + spec/core | shared diagnostic model | P1 automation needs stable fields | Preserve envelope mapping tests |
| `CLI-DIAG-002` Human-readable diagnostics | `✔️` | Audit §5; stderr headings/codes/path/object; fixtures | Color and exact prose vary by environment | `relgeo/cli` | core error codes | M: terminal/CI readability drift | Add no-color and representative wording checks |
| `CLI-DIAG-003` Machine-readable diagnostics mode | `✔️` | Audit §3/§5; JSON diagnostics for input/runtime/output/usage | Cross-OS/TTY behavior remains unverified | `relgeo/cli` | diagnostic envelope and exit contract | P1 consumers need stable versioning | Preserve envelope versioning and stream tests |
| `CLI-EXIT-001` Exit-code contract | `✔️` | Audit §5; taxonomy and category tests | Cross-shell signal/TTY behavior remains unverified | `relgeo/cli` | error taxonomy and write boundary | P1 CI cannot route remediation if host alters signals | Preserve numeric taxonomy in release tests |
| `CLI-ERR-001` Deterministic error handling | `✔️` | Audit §3/§5; unsupported-format regression exits `2` | Delegated semantic errors remain owned by core | `relgeo/cli` | format allowlist; Commander validation | M: future format additions need allowlist updates | Keep dispatch guard in focused tests |
| `CLI-ERR-002` Unknown-option/unknown-format rejection | `✔️` | Audit §3/§5; strict format/param/profile/unit tests | Full option-combination matrix remains bounded | `relgeo/cli` | option schema and typed override parser | M: automation may render wrong artifact if new options drift | Extend matrix when options are added |
| `CLI-CONFIG-001` Explicit configuration sources | `✔️` | Audit §3/§5; config/env/flag/no-config tests | Cross-platform config path behavior remains unverified | `relgeo/cli` | config schema and precedence policy | P1 repeated automation is verbose/inconsistent | Preserve precedence regression |
| `CLI-CONFIG-002` Noninteractive/environment configuration | `✔️` | Audit §5; no-color/CI/RELGEO_* tests | TTY behavior remains unverified | `relgeo/cli` | environment contract; diagnostics mode | P1 CI output can be non-deterministic | Preserve no-color/CI regressions |
| `CLI-AUTO-001` Noninteractive automation mode | `✔️` | Audit §5; root scripts and conformance consume commands | Node 24/canonical CI remains unverified | `relgeo/cli` + workspace | shell contract; package runtime | M: local success may not ship | Re-run canonical automation gate |
| `CLI-AUTO-002` Watch/rebuild workflow | `⏸️` | Audit §3/§5; scope-held one-shot boundary | No source/config watch command by explicit lifecycle decision | `relgeo/cli` | watch lifecycle and failure recovery | P2/P1 iterative workflows need wrappers | Keep held until bounded watch contract is approved |
| `CLI-AUTO-003` Stable scripting streams | `✔️` | Audit §5; stream separation, JSON diagnostics, no-color, and CI tests | CI/TTY cross-host behavior remains unverified | `relgeo/cli` | diagnostics/config modes | P1 pipelines may parse noise | Retain local stream probes |
| `CLI-AUTO-004` Optional long-running/JSON-RPC daemon boundary | `⏸️` | Audit §4/§5; no approved protocol or implementation | Held pending separate protocol decision | future CLI/protocol owner | scope decision; daemon security model | P2 premature protocol fragmentation | Keep held; create implementation work only after decision |
| `CLI-PACK-001` Executable package and `relgeo` binary | `✔️` | Audit §5; bin/dist/metadata, local binary run, and CLI pack dry-run with 8 files | Fresh registry install and Node >=24 consumer run are not verified | `relgeo/cli` + release owner | Node runtime; npm boundary | M: install path can drift | Run clean-install smoke under Node >=24 |
| `CLI-PACK-002` Reproducible build and tarball boundary | `✔️` | Audit §6; current CLI `npm pack --dry-run --json` and local tarball expose 8 allowlisted files | Repository-wide current release audit has one unrelated core version mismatch; no publish claim | `relgeo/cli` + release guard | package files and release script | M: accidental files in package | Keep pack boundary in release guard |
| `CLI-PACK-003` Compatibility/version policy | `✔️` | Audit §6; compatibility audit 10/10 and CLI-specific matrix rows pass | Full integration gate stops at Node >=24 preflight on this host; registry evidence remains separate | workspace + `relgeo/cli` | compatibility matrix; package metadata | M: cross-package line drift | Keep compatibility check as publish prerequisite |
| `CLI-PACK-004` Release verification and recovery boundary | `⏸️` | Audit §5/§6; preflight/pack/registry verifier scripts | Evidence-only/deferred: current registry/public, Node 24, CI, and recovery proof are unverified | release owner + workspace | npm registry; canonical Node; release records | P1 release evidence boundary, not an implementation gap | Run canonical package verification when the release environment/owner is available; do not publish as part of this goal |
| `CLI-PACK-005` Cross-surface conformance consumption | `✔️` | Audit §6; conformance 298/298 across 23 fixtures | Fixture set is declared, not exhaustive CLI option coverage | workspace + `relgeo/cli` | fixture provenance; spec/core semantics | M: untested option regressions | Add fixtures only when capabilities are promoted |

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

The [CLI capability matrix](./capability-matrix.md) remains available as the
boundary-oriented companion view. It is not the expected-set source for this
matrix.
