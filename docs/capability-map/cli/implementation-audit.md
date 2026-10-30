# RelGeo CLI implementation and evidence audit

> **Audit coverage statement — 2026-10-30.** This audit compares the expected
> IDs in [cli/expected-capability-catalog.md](./expected-capability-catalog.md)
> with the current CLI source, executable/package boundary, command/help output,
> tests, shared fixtures, consumer scripts, documentation, release metadata, and
> local runtime probes. It covers command discovery, init/open/validate/render,
> file/stdin input, formats, diagnostics, exit behavior, help/version, config,
> watch/automation, scripting, errors, and packaging. It does not claim a fresh
> Node 24 run, every shell/OS, current CI/public registry parity, or interactive
> UI behavior. A missing implementation is marked `absent` only where the
> expected catalog provides the expectation; missing environment evidence is
> `unverified`, not an implementation failure.

## 1. Audit metadata and status model

| Field | Value |
| --- | --- |
| Surface | `relgeo/cli` executable and `@relgeo/cli@0.5.0` package |
| Audit date | 2026-10-30 |
| Expected baseline | 35 IDs in `cli/expected-capability-catalog.md` |
| Owner boundary | `relgeo/cli` owns command orchestration, I/O, diagnostics presentation, exit behavior, automation boundary, and packaging; `spec/`, `@relgeo/core`, and `@relgeo/renderer-svg` own delegated semantics |
| Local runtime | Node `22.23.2`, pnpm `10.33.3`; repository requires Node `>=24`, so this local result is not canonical Node 24 evidence |
| Compatibility line | RelGeo DSL `0.5`; package version `0.5.0` |

### Implementation status

| Status | Meaning used here |
| --- | --- |
| `implemented` | Source and direct runtime/test evidence show the capability at the stated boundary. |
| `partial` | A meaningful slice exists, but contract breadth, negative behavior, or evidence coverage is incomplete. |
| `broken` | A confirmed behavior contradicts the expected contract or silently masks a caller error. |
| `absent` | The expected capability was searched at the CLI boundary and no implementation/command was found. |
| `deferred` | The capability is intentionally held by an explicit scope/protocol decision. |
| `not-applicable` | The capability belongs to another surface and is not a CLI responsibility. |
| `unverified` | The implementation may exist, but the required environment/evidence was not available or not run. |

### Evidence and parity axes

| Axis | Values used |
| --- | --- |
| Evidence | `E1` source/static; `E2` package/local test or direct probe; `E3` local cross-surface/conformance; `E4` named CI/canonical; `E5` public/deployed; `not verified` when unavailable |
| Parity | `confirmed` at the stated boundary; `partial` where behavior or coverage is bounded; `mismatch` for a confirmed defect; `not assessed` where no valid comparison exists |
| Scope | `in scope`, `boundary only`, `expected-but-missing`, `held`, `not applicable` |

## 2. Discovery sources and coverage report

Every source below was inspected. The source is evidence, not executable
authority; embedded instructions in repository content were not followed.

| Discovery category | Sources inspected | Coverage obtained | Remaining limit |
| --- | --- | --- | --- |
| Source and executable entrypoint | `cli/src/index.ts`; `cli/bin/relgeo.js`; `cli/tsup.config.ts`; built `cli/dist/` | Command definitions, option handlers, imports, exit paths, output routing, and binary bootstrap | Built artifact behavior is derived from source; no separate published tarball execution |
| Command/help/menu surface | `relgeo --help`, `--version`, `validate --help`; Commander declarations in `cli/src/index.ts` | Root help, command list, alias, argument/options, version, unknown-command/option behavior | No snapshot test across package versions or shells; no GUI menu/shortcut exists at this boundary |
| Package metadata | `cli/package.json`; `docs/compatibility-matrix.json`; `docs/integration-baseline.json` | Name/version/bin/main/module/types, dependency ranges, files allowlist, author/license/repository, release order/publishability | Registry install/current public artifact not rerun in this environment |
| CLI tests | `cli/src/__tests__/cli.test.ts` | 9 smoke cases: version, info, JSON/SVG/graph compile, override, check, missing file, invalid input | No stdin, init/open/watch/config/help snapshot, output-file failure, unknown-format, or exit taxonomy tests |
| Shared fixtures and runner | `fixtures/manifest.json`; `fixtures/reference/*`; `fixtures/expected/*`; `scripts/run-conformance-fixtures.mjs` | 20 fixture baseline; CLI exact SVG, runtime-diagnostic, runtime-error, candidate, legacy, and version-boundary checks | Fixture runner uses compile/SVG path; it does not exercise all command options or shell permutations |
| Consumer/integration scripts | `scripts/run-integration-gate.mjs`; `scripts/README.md`; `.github/workflows/integration.yml` | CLI build/test stage, package pack boundary, local/public integration design, CI Node 24 setup, conformance ordering | Current CI/public run for this exact checkout was not initiated |
| Product and ownership docs | `README.md`; `cli/README.md`; `cli/docs/README.md`; website `relgeo.github.io/src/content/docs/{id,en}/cli.md`; `docs/REPOSITORY-MAP.md` | User positioning, target workflows, documented commands/options, non-UI boundary, ownership | Documentation claims are not implementation proof by themselves |
| Roadmap/scope/release docs | `docs/MATURATION-MASTER-PLAN.md`; `docs/plans/03-npm-release-guard.md`; `docs/decisions/07-cross-repo-open-decisions.md`; `docs/decisions/09-open-work-recommendations.md` | CLI priority, cross-repo order, manual publish, pack/audit/registry policy, deferred automation/platform decisions | Historical evidence is labeled historical and not promoted to current runtime proof |
| Normative contract | `spec/id/README.md`; `spec/id/core/02-document-structure.md`; `spec/id/core/06-error-model.md` | Active/default version, document sections, deterministic error codes/phases, post-resolution diagnostics boundary | CLI does not own or independently reimplement the DSL |
| Config/platform/runtime | package scripts, `.node-version`, Node/pnpm probes, filesystem temp paths, environment variables | Node/pnpm requirement, local runtime warning, absence of CLI config/watch service, file/stdout/stderr behavior | Node 24, alternate OS, TTY/color, registry, and installed-package runtime remain not verified |

### Coverage conclusion

The audit covers all required discovery categories: source, tests, command/help,
consumer/fixture, package/release, docs/roadmap, runtime, and delegated contract.
The CLI has no UI/menu/shortcut/route or platform service of its own; that
category is explicitly reported as `not-applicable` in §4 rather than silently
treated as absent. The 35 expected IDs are all mapped below.

## 3. Observed command and runtime surface

### Implemented command surface

| Observed surface | Evidence | Result |
| --- | --- | --- |
| Root `relgeo` | `cli/src/index.ts:22-25`; `relgeo --help` | Name, description, `--version`, `--help`; Commander also exposes `help`. |
| `info <file>` | `cli/src/index.ts:27-111`; CLI test lines 66-76 | Reads UTF-8 file, parses editor mode, prints version, parameters, profiles, presets/styles, components, views, sheets, objects. |
| `compile <file>` | `cli/src/index.ts:113-187`; CLI tests lines 78-114 | Reads file, parses overrides, compiles through core, emits JSON by default, SVG, graph, or a file. |
| `check <file>` / `validate <file>` | `cli/src/index.ts:189-241`; CLI tests lines 116-122 | Alias pair; compiles/resolves and prints success summary without final JSON/SVG output. |
| Compile options | `cli/src/index.ts:117-122`; package docs | `--output`, `--format`, `--unit`, `--profile`, repeatable `--param`, and `--sheet`. |
| No command for `init`, `open`, `watch`, daemon, or config | Commander output and direct negative probes | Unknown command/option errors are returned; no implementation found. |

### Direct probes

| Probe | Observed result | Classification |
| --- | --- | --- |
| `relgeo --help` | Lists `info`, `compile`, `check|validate`, `help`; exit `0` | Implemented |
| `relgeo --version` | Prints `0.5.0`; exit `0` | Implemented |
| `relgeo validate --help` | Shows alias and validation options; exit `0` | Implemented |
| `compile -` with valid YAML on stdin | `File not found: -`; exit `1` | Stdin absent at current boundary |
| `init` | Unknown command; exit `1` | Init absent |
| `open <file>` | Unknown command; exit `1` | Open absent as a named command; path selection exists in other commands |
| `watch <file>` | Unknown command; exit `1` | Watch absent |
| `compile --config x` | Unknown option; exit `1` | Config absent |
| `compile --format not-a-format` | Resolved JSON emitted; exit `0` | Broken: unknown format silently falls through to JSON |
| `compile --param broken` | Resolved JSON emitted; exit `0` | Broken/partial: malformed `key=value` token is silently ignored |

## 4. Boundary and applicability findings

| Category | Status | Evidence and conclusion |
| --- | --- | --- |
| UI/menu/route | `not-applicable` | CLI is a terminal surface. Website docs and Playground routes link to it, but no browser/native UI is owned by `cli/`. |
| Keyboard shortcut/gesture | `not-applicable` | No CLI shortcut or gesture layer; shell/TTY behavior is an environment concern and is not a product shortcut contract. |
| Interactive editor/completion/hover | `not-applicable` | `cli/docs/README.md` and website docs route these needs to Playground/language-service. |
| Parser/geometry/SVG semantic ownership | `not-applicable` as independent CLI implementation | CLI imports `@relgeo/core` and `@relgeo/renderer-svg`; parity is assessed only at the invocation/output boundary. |
| Flutter/mobile service | `not-applicable` | Accepted scope keeps Flutter separate/non-publishable and mobile deferred; CLI has no Flutter runtime dependency. |
| MCP/JSON-RPC host | `deferred` | Catalog records a possible future long-running boundary, but no CLI protocol approval or implementation exists. |

## 5. Expected-to-observed audit

The table compares only against the frozen expected catalog. “Partial” means a
real slice is present but does not satisfy the full expected contract. “Absent”
is based on negative source/command discovery, not merely on a missing test.

| ID | Implementation status | Evidence tier | Parity | Scope | Observed implementation / gap |
| --- | --- | --- | --- | --- | --- |
| `CLI-DISC-001` | `implemented` | E1/E2 | confirmed | in scope | Commander root help exposes commands, aliases, and options; no help snapshot test. |
| `CLI-DISC-002` | `implemented` | E2 | partial | in scope | Root/subcommand help and usage errors work; wording stability is not version-snapshotted. |
| `CLI-DISC-003` | `implemented` | E2/E3 | confirmed | in scope | `--version` prints `0.5.0`; package/docs/matrix declare DSL `0.5`. |
| `CLI-INIT-001` | `absent` | E1/E2 | not assessed | expected-but-missing | No `init` command, template, or starter-document workflow in source/package/docs. |
| `CLI-OPEN-001` | `partial` | E1/E2 | partial | in scope | Existing commands select a file path, but no named `open` workflow or open semantics exists. |
| `CLI-IN-001` | `implemented` | E2 | confirmed | in scope | `path.resolve`, `pathExists`, and UTF-8 `readFile` are used by all three commands; tests cover valid/missing files. |
| `CLI-IN-002` | `absent` | E2 | mismatch | expected-but-missing | `compile -` treats `-` as a literal path and returns file-not-found; no stdin reader. |
| `CLI-IN-003` | `partial` | E1/E2 | partial | in scope | UTF-8 file handling and path resolution exist; path/stdin precedence, empty input, and encoding errors are not contracted. |
| `CLI-INSPECT-001` | `implemented` | E2 | partial | in scope | `info` prints major document sections and is tested; editor-mode parsing intentionally permits inspection of structurally incomplete input. |
| `CLI-VALID-001` | `implemented` | E2/E3 | partial | in scope | `check`/`validate` compiles/resolves without final output; diagnostics and warning semantics are not fully formalized. |
| `CLI-VALID-002` | `implemented` | E1/E2 | confirmed | in scope | Commander alias `validate` maps to `check`; direct help probe passes. |
| `CLI-RENDER-001` | `implemented` | E2/E3 | confirmed | in scope | Compile flow delegates parse/validate/resolve to core and render to renderer; shared fixture CLI output passes. |
| `CLI-RENDER-002` | `partial` | E2/E3 | partial | in scope | Profile, parameter, and unit options are wired; one override test and candidate fixture cover slices, not all combinations/failures. |
| `CLI-RENDER-003` | `partial` | E1/E3 | partial | in scope | `--sheet` is passed to SVG renderer and fixture output covers sheet-capable inputs; invalid/missing sheet behavior lacks direct CLI tests. |
| `CLI-OUT-001` | `implemented` | E2/E3 | partial | in scope | Default JSON is parseable and scene fields are asserted; no independently versioned CLI JSON schema. |
| `CLI-OUT-002` | `implemented` | E2/E3 | confirmed | in scope | SVG smoke passes; conformance compares CLI SVG byte output to shared snapshots for covered fixtures. |
| `CLI-OUT-003` | `implemented` | E2 | partial | in scope | Graph output is produced via core and parsed as an array in tests; graph schema has no separate compatibility document. |
| `CLI-OUT-004` | `partial` | E1 | partial | in scope | `fs.outputFile` and stdout branches exist; overwrite, permission, encoding, and output-file failure behavior are not tested. |
| `CLI-DIAG-001` | `partial` | E1/E3 | partial | boundary only | Core error codes, object/path fields, and runtime-error fixture codes reach CLI; CLI has no phase/severity/location envelope. |
| `CLI-DIAG-002` | `implemented` | E2/E3 | partial | in scope | Human-readable stderr includes headings, codes, messages, object/path when supplied; color and exact wording vary by environment. |
| `CLI-DIAG-003` | `absent` | E1/E2 | not assessed | expected-but-missing | No `--json` diagnostics mode or stable machine-readable error envelope found. |
| `CLI-EXIT-001` | `partial` | E2/E3 | partial | in scope | Success and common failures use exit `0`/`1`; no documented distinctions for usage, input, validation, and write failures. |
| `CLI-ERR-001` | `broken` | E2/E3 | mismatch | in scope | Missing/invalid/runtime errors fail clearly, but unsupported format falls through silently to JSON. |
| `CLI-ERR-002` | `broken` | E2 | mismatch | in scope | Commander rejects unknown commands/options, but unknown format and malformed `--param` do not fail. |
| `CLI-CONFIG-001` | `absent` | E1/E2 | not assessed | expected-but-missing | No config file, config loader, precedence model, or `--config` option found. |
| `CLI-CONFIG-002` | `absent` | E1/E2 | not assessed | expected-but-missing | No documented environment/config switches for color, prompts, or deterministic CI defaults found. |
| `CLI-AUTO-001` | `implemented` | E2/E3 | confirmed | in scope | Commands run noninteractively and are used by root conformance/integration scripts; current Node 24/canonical CI remains unverified. |
| `CLI-AUTO-002` | `absent` | E1/E2 | not assessed | expected-but-missing | No watch command, file watcher, debounce, or rebuild lifecycle found. `pnpm dev` is package build watch, not document watch. |
| `CLI-AUTO-003` | `partial` | E2 | partial | in scope | Compile progress goes to stderr and data to stdout; info/check are human prose and there is no explicit no-color/machine mode. |
| `CLI-AUTO-004` | `deferred` | E0/E1 | not assessed | held | Catalog holds daemon/JSON-RPC as a future bounded decision; no implementation or approved protocol contract. |
| `CLI-PACK-001` | `implemented` | E1/E2 | partial | in scope | `bin/relgeo.js`, bin metadata, CJS/ESM dist, and local binary run work; fresh registry install not executed. |
| `CLI-PACK-002` | `implemented` | E2 | confirmed | in scope | `NPM_CONFIG_CACHE=/private/tmp/relgeo-cli-npm-cache pnpm run release:audit` passes `106/106`; CLI tarball has 8 declared public entries. |
| `CLI-PACK-003` | `implemented` | E3 | confirmed | in scope | `compatibility:check` passes `283/283`; matrix has CLI `0.5.0`, publishable `true`, same-line policy, and release order after renderer. |
| `CLI-PACK-004` | `partial` | E1/E2 | partial | in scope | Manual preflight, pack, registry verifier, and forward-fix planner exist; current registry/public verification and Node 24 run are unverified. |
| `CLI-PACK-005` | `implemented` | E3 | confirmed for declared fixtures | in scope | `conformance:fixtures` passes `260/260` across 20 fixtures, including exact CLI SVG and runtime-error status/code assertions; not exhaustive CLI-option coverage. |

### Status roll-up

| Status | Count | IDs / interpretation |
| --- | ---: | --- |
| `implemented` | 17 | Discovery/version, file input, inspect, validate alias, render, outputs, human errors/automation, packaging, compatibility, and fixture participation at bounded scope. |
| `partial` | 9 | Open/path boundary, input rules, render options, output file, diagnostics, exits, scripting, and package release evidence. |
| `broken` | 2 | `CLI-ERR-001`, `CLI-ERR-002`: silent acceptance/fallback of unknown format and malformed parameter token. |
| `absent` | 6 | `CLI-INIT-001`, `CLI-IN-002`, `CLI-DIAG-003`, `CLI-CONFIG-001`, `CLI-CONFIG-002`, `CLI-AUTO-002`. |
| `deferred` | 1 | `CLI-AUTO-004`, held for a distinct protocol decision. |
| `not-applicable` | 0 expected IDs | UI/editor/parser/Flutter boundaries are reported separately in §4; they are not expected CLI IDs. |
| `unverified` | 0 expected IDs | Unverified is an evidence axis: Node 24, CI/public registry, and cross-OS claims remain unverified even where local implementation is present. |

## 6. Verification executed

| Command/evidence | Result | Evidence meaning |
| --- | --- | --- |
| `node -v && pnpm --version` | Node `22.23.2`, pnpm `10.33.3` | Local runtime only; Node is below required `>=24`. |
| `pnpm --filter @relgeo/cli test` | PASS — 1 file, 9 tests | Direct package smoke suite. |
| `pnpm --filter @relgeo/cli build` | PASS — CJS/ESM output | Source-to-dist package build. |
| `pnpm run conformance:fixtures` | PASS — `260 passed, 0 failed across 20 fixtures` | Root cross-surface fixture evidence; CLI checks are exact for declared paths. |
| `pnpm run compatibility:check` | PASS — `283 passed, 0 failed` | Matrix/package/version/README/dependency/release-order consistency. |
| `NPM_CONFIG_CACHE=/private/tmp/relgeo-cli-npm-cache pnpm run release:audit` | PASS — `106 passed, 0 failed` | Local tarball/package metadata boundary for all seven npm packages, including CLI. |
| `NPM_CONFIG_CACHE=/private/tmp/relgeo-cli-npm-cache npm pack --dry-run --json` in `cli/` | PASS — 8 files, `@relgeo/cli@0.5.0` | Direct CLI tarball evidence; no secret/private material observed in listed entries. |
| CLI help/version/alias probes | PASS | Command discovery, version, and `validate` alias behavior. |
| CLI negative probes for stdin/init/open/watch/config/unknown format/malformed param | Mixed: absent commands/options fail; unknown format and malformed param exit `0` | Direct evidence for absent and broken classifications. |
| Current-checkout revalidation on 2026-10-30: `pnpm test` in `cli/` | PASS — 1 file, 9 tests | Reconfirms the package smoke evidence at the current checkout; this does not expand coverage to stdin, config, watch, help snapshots, output failures, or exit taxonomy. |
| Current-checkout direct probes: `node cli/bin/relgeo.js --help`, `--version`, `compile -`, `init`, `open`, `watch`, `compile --config x`, `compile <file> --format not-a-format`, and `compile <file> --param broken` | PASS for expected observations: absent surfaces exit `1`; unknown format and malformed parameter exit `0` | Reconfirms command/option absence and the two silent-acceptance defects; probes are local Node `22.23.2`, not Node 24/canonical evidence. |
| Default `pnpm run release:audit` | FAIL — all 7 pack stages blocked by npm cache `EPERM` root-owned files | Environment blocker only; rerun with scoped temporary cache passed. |

## 7. Gaps, risks, and handoff

### Confirmed implementation gaps/defects

1. Add a bounded `init` workflow or explicitly remove it from the expected
   product baseline through a scope decision.
2. Define stdin input and precedence with file paths; `-` currently means a
   literal filename.
3. Reject unknown `--format` values and malformed `--param` values with a
   non-zero exit and actionable error.
4. Define machine-readable diagnostics, exit-code taxonomy, and explicit
   stdout/stderr/no-color behavior for scripting.
5. Decide whether `open`, config, and watch are active CLI product promises or
   should remain expected-but-missing roadmap items.

### Evidence gaps, not implementation failures

- Node 24 canonical runtime, current CI for this exact revision, fresh npm
  registry install, and cross-OS/TTY behavior were not verified here.
- Existing historical CI/public evidence in the master plan remains historical;
  it does not upgrade this local audit to E4/E5.
- Shared fixture coverage proves declared fixtures only. It does not prove every
  DSL object, every option combination, every filesystem failure, or all shell
  environments.
- The CLI has no UI/menu/route/shortcut service; those categories are
  `not-applicable`, not missing CLI work.

The next dependent task can reconcile this audit against the expected catalog
and publish the user-facing status matrix. It should preserve the distinction
between implementation status, evidence tier, parity, scope, and environment
availability.
