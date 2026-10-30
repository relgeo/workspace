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
| Public `relgeo` binary and `@relgeo/cli@0.5.0` package boundary | `✔️` | `cli/bin/relgeo.js:1-3`; `cli/package.json`; `cli/src/index.ts:22-25` | Fresh registry install and published binary not rerun | shell users, CI, scripts | Node runtime, core, renderer | Run registry/package smoke under Node >=24 |
| Version/help command surface | `✔️` | Commander setup `cli/src/index.ts:22-25`; CLI test version `9/9` | Help text is Commander-generated; no snapshot across versions | shell users | commander | Add help snapshot if CLI UX is release-critical |
| `info <file>` document inspection | `✔️` | `index.ts:27-111`; CLI test checks version, parameters, profiles, presets, objects | Uses core editor mode, so it can inspect structurally incomplete input rather than validate it | terminal onboarding/debugging | core parser/editor mode | Keep `info` and `check` semantics distinct in docs |
| `compile <file>` to resolved JSON | `✔️` | `index.ts:113-187`; CLI test JSON parse/object assertion; fixture snapshots | JSON schema/version of output is resolved-scene contract, not separately versioned by CLI | scripts, CI, downstream tooling | core compile pipeline | Pin representative JSON snapshot per compatibility line |
| `compile -f svg` and `--sheet` | `✔️` | `index.ts:152-155`; renderer integration; CLI test SVG; conformance exact SVG | Renderer option subset is CLI-owned only through `sheet`; other renderer options are not exposed | shell export, Markdown/preview pipelines | core + renderer-svg | Document intentionally bounded option mapping |
| `compile -f graph` dependency graph | `✔️` | `index.ts:155-159`; CLI test parses array/object IDs | Graph output has no separately versioned schema or semantic snapshot beyond tests | debugging, CI inspection | core graph extractor | Add graph output schema note if consumed programmatically |
| `check` / `validate` no-output validation workflow | `✔️` | `index.ts:189-241`; CLI tests valid/invalid/missing file; conformance runtime errors | `validate` is an alias; runtime errors are core resolution errors surfaced on stderr | CI gates, shell users | core compile/resolve, exit status | Preserve stable exit/error-code behavior |
| Profiles, parameter overrides, target units | `🌗` | `index.ts:118-150,194-217`; CLI override test; fixture 16 explicit `cliUnit` | Tests cover string-like override; all profile/unit combinations and error cases are not active snapshots | parameterized shell builds | core evaluator/units | Add matrix of profile/unit/override errors before promotion claims |
| File output with `-o/--output` | `🌗` | `index.ts:163-167`; docs and conformance use stdout | Source uses `fs.outputFile`, but package tests do not verify overwrite/path/encoding failure behavior | shell/CI artifacts | filesystem permissions and host path | Add safe temp-file tests and document overwrite semantics |
| Structured error reporting and non-zero exit | `✔️` | `index.ts:170-185,229-240`; CLI tests missing/invalid input; conformance runtime errors | Error text has human-readable formatting; machine-readable stderr schema is not formalized | CI, scripts, users | core error code/path/object metadata | Define stable stderr/JSON error mode if automation needs it |
| Format allowlist (`json`, `svg`, `graph`) | `⚠️` | docs `cli/README.md:133-139` advertises three formats; source `index.ts:152-161` falls through to JSON for any other string; manual `--format not-a-format` produced JSON and exit 0 | Typo/unknown format is silently accepted as JSON, masking caller errors | shell/CI automation | Commander option parsing | Reject unknown format with non-zero exit and add regression test |
| Deterministic shared-fixture output | `✔️` | `scripts/run-conformance-fixtures.mjs:343-348`; fixture 10/14/15/16/19/20 CLI checks; conformance `260/260` | Exact snapshots cover declared fixture set only | root integration, Markdown, release gate | built core/renderer artifacts | Maintain CLI snapshot checks as contract evidence |
| Source parsing/resolution ownership | `➖` | `index.ts:5-6`; `docs/REPOSITORY-MAP.md:10-15`; CLI delegates to core/renderer | CLI is orchestration surface, not alternate parser/geometry implementation | core, renderer | package dependency line | Keep ownership split explicit |
| Editor diagnostics, completion, hover, schema authoring | `➖` | CLI docs boundary says use core/language-service/Playground for other needs | CLI does not provide interactive editor intelligence | shell users | language-service/Playground | Do not duplicate editor surface in CLI without a consumer |
| Official watch/daemon/JSON-RPC server mode | `❌` | Package files and Commander commands expose only `info`, `compile`, `check/validate`; no server/watch command | Not part of current documented CLI contract | future tooling/MCP adapters | explicit runtime/server contract | Keep absent until a bounded command contract is approved |
| Package build/test/current toolchain verification | `🌗` | CLI test `9/9`; `pnpm --filter @relgeo/cli build` PASS; package scripts | Local Node `22.23.2` is below required `>=24`; registry/current CI not rerun | npm users, release automation | Node/pnpm, dist artifacts | Re-run canonical Node >=24 registry/public package gate |

## Priority order

1. Reject unknown `--format` values rather than silently emitting JSON.
2. Add tests for file output failures/overwrite semantics and machine-readable
   error expectations if CLI automation depends on them.
3. Keep CLI option/fixture coverage aligned with core unit/profile promotion.
4. Re-run package registry and shell smoke under Node >=24 before release claims.
