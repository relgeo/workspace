# RelGeo CLI capability matrix

> **Coverage statement — 2026-10-29.** This matrix covers `cli/` commands and
> package boundary using Commander source, binary/package metadata, CLI tests,
> shared conformance fixtures, docs, and build/release scripts. It inventories
> command, format, filesystem, error, and automation behavior; it does not
> claim every shell/OS or registry-install permutation. Node 24 canonical,
> current CI, registry, and public package checks remain `not verified` where
> stated; a missing row is not evidence of absence.
> See [inventory protocol](../INVENTORY-PROTOCOL.md) for status axes and evidence tiers.

Status dokumen: audit baseline, 2026-10-29  
Surface: `cli/`  
Owner: `relgeo/cli`  
Package: `@relgeo/cli@0.5.0`  
Compatibility line: `0.5.x`  
Evidence log: [cli/implementation-audit.md](./implementation-audit.md)

## Status legend

| Status | Arti audit | Tidak berarti |
| --- | --- | --- |
| `✔️` | Capability tersedia pada CLI boundary dan punya evidence langsung. | Semua shell/platform/registry environments sudah parity. |
| `🌗` | Implementasi/evidence tersedia sebagian atau output/package verification masih terbatas. | Capability selesai end-to-end. |
| `❌` | Capability yang seharusnya ada pada CLI boundary sudah diperiksa dan belum ada. | Core atau library consumer otomatis gagal. |
| `➖` | Capability bukan tanggung jawab CLI atau sengaja di luar scope. | Pekerjaan yang tertunda. |
| `⏸️` | Capability ditahan oleh keputusan/promotion/dependency. | Capability tidak bisa diimplementasikan. |
| `⚠️` | Mismatch atau masalah terkonfirmasi pada source/consumer boundary. | Evidence yang belum diverifikasi. |

`not verified` adalah state evidence, bukan simbol. Matrix menuliskan apakah
evidence berasal dari source, package test, conformance, atau hanya dokumentasi.

## Capability matrix

| Capability | Status | Evidence | Gap / limitation | Consumer | Dependency | Next action |
| --- | --- | --- | --- | --- | --- | --- |
| Public `relgeo` binary and `@relgeo/cli@0.5.0` package boundary | `🌗` | `cli/bin/relgeo.js`; `cli/package.json`; local build/test | Fresh registry install, published binary, and Node >=24 consumer run are not verified | shell users, CI, scripts | Node runtime, core, renderer | Run registry/package smoke under Node >=24 |
| Version/help command surface | `✔️` | Commander setup `cli/src/index.ts`; `pnpm test` 36/36; `--version` and help probes | Help text is Commander-generated; no cross-version snapshot | shell users | commander | Add help snapshot if CLI UX is release-critical |
| `info <file>` document inspection | `✔️` | `index.ts:27-111`; CLI test checks version, parameters, profiles, presets, objects | Uses core editor mode, so it can inspect structurally incomplete input rather than validate it | terminal onboarding/debugging | core parser/editor mode | Keep `info` and `check` semantics distinct in docs |
| File, stdin, precedence, and strict UTF-8 input | `✔️` | `cli/src/index.ts`; tests for `-`, explicit-path precedence, empty input, and invalid UTF-8 | Host filesystem and cross-platform stream behavior remain environment-dependent | shell users, CI | Node streams/filesystem | Retain source-aware input regressions |
| `compile <file>` to resolved JSON | `✔️` | `index.ts`; canonical-output tests; conformance fixture checks | JSON schema/version of output is resolved-scene contract, not separately versioned by CLI | scripts, CI, downstream tooling | core compile pipeline | Pin representative JSON snapshot per compatibility line |
| `compile -f svg` with `--sheet` / `--view` | `🌗` | `index.ts`; SVG/view tests; conformance exact SVG | Selector behavior is covered for representative fixtures, not every renderer/view combination | shell export, Markdown/preview pipelines | core + renderer-svg | Expand selector matrix when renderer contract grows |
| `compile -f graph` dependency graph | `✔️` | `index.ts:155-159`; CLI test parses array/object IDs | Graph output has no separately versioned schema or semantic snapshot beyond tests | debugging, CI inspection | core graph extractor | Add graph output schema note if consumed programmatically |
| `check` / `validate` no-output validation workflow | `✔️` | `index.ts:189-241`; CLI tests valid/invalid/missing file; conformance runtime errors | `validate` is an alias; runtime errors are core resolution errors surfaced on stderr | CI gates, shell users | core compile/resolve, exit status | Preserve stable exit/error-code behavior |
| Profiles, parameter overrides, target units | `🌗` | `index.ts:118-150,194-217`; CLI override test; fixture 16 explicit `cliUnit` | Tests cover string-like override; all profile/unit combinations and error cases are not active snapshots | parameterized shell builds | core evaluator/units | Add matrix of profile/unit/override errors before promotion claims |
| File output with `-o/--output` | `✔️` | `index.ts`; tests for nested parent creation, overwrite/no-overwrite, UTF-8, and write failure | Permission/host filesystem matrix remains limited; atomicity is local filesystem evidence | shell/CI artifacts | filesystem permissions and host path | Retain deterministic output tests; expand host matrix separately |
| Config precedence and noninteractive controls | `✔️` | `index.ts`; config/env/flag/no-config, `NO_COLOR`, and `CI` tests | Cross-shell/TTY and Node >=24 behavior remain unverified | CI, scripts, users | process env, filesystem config | Preserve one-shot contract; do not infer watch behavior |
| Structured phase-aware diagnostics and exit taxonomy | `✔️` | `index.ts`; human/JSON envelope tests for parse, runtime, usage, and output failures; core error model | Core/spec remain authoritative for delegated diagnostic semantics and post-resolution constraint reporting | CI, scripts, users | core error code/path/object metadata | Maintain versioned envelope fields and exit codes |
| Machine-readable streams and format allowlist | `✔️` | `index.ts`; tests for stdout/stderr separation, JSON diagnostics, CI/no-color, and unknown format | Cross-OS/TTY stream behavior remains unverified | shell/CI automation | Commander option parsing | Keep data-only stdout and diagnostics/progress on stderr |
| Deterministic shared-fixture output | `✔️` | `scripts/run-conformance-fixtures.mjs`; conformance `298/298` across 23 fixtures | Exact snapshots cover declared fixture set only | root integration, Markdown, release gate | built core/renderer artifacts | Maintain CLI snapshot checks as contract evidence |
| Source parsing/resolution ownership | `➖` | `index.ts:5-6`; `docs/REPOSITORY-MAP.md:10-15`; CLI delegates to core/renderer | CLI is orchestration surface, not alternate parser/geometry implementation | core, renderer | package dependency line | Keep ownership split explicit |
| Editor diagnostics, completion, hover, schema authoring | `➖` | CLI docs boundary says use core/language-service/Playground for other needs | CLI does not provide interactive editor intelligence | shell users | language-service/Playground | Do not duplicate editor surface in CLI without a consumer |
| Official watch/daemon/JSON-RPC server mode | `⏸️` | Expected catalog marks watch as held; package commands intentionally remain one-shot | No watch/rebuild lifecycle is implemented until debounce, recovery, shutdown, and stream scope is approved | future tooling/MCP adapters | explicit runtime/server contract | Keep held and visible; do not promote package `dev` watch to document watch |
| Package build/test/current toolchain verification | `🌗` | CLI `pnpm test` 36/36, tsc, build, and root conformance `298/298` pass | Local Node `22.23.2` is below required `>=24`; registry/current CI/cross-OS not rerun | npm users, release automation | Node/pnpm, dist artifacts | Re-run canonical Node >=24 registry/public package gate |

## Priority order

1. Expand profile/unit/selector and host filesystem matrices before broad parity claims.
2. Re-run package registry and shell smoke under Node >=24 before release claims.
3. Keep watch/rebuild held as a separate lifecycle decision; it is not a CLI gap
   to close in this one-shot tranche.
