# RelGeo CLI implementation and evidence audit

> **Audit coverage statement — 2026-11-05.** This audit compares the expected
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
>
> The bounded active implementation selection is recorded in
> [in-scope-selection.md](./in-scope-selection.md). It is planning metadata and
> does not upgrade an implementation status or evidence tier.

## 1. Audit metadata and status model

| Field | Value |
| --- | --- |
| Surface | `relgeo/cli` executable and `@relgeo/cli@0.5.0` package |
| Audit date | 2026-11-05 |
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
| CLI tests | `cli/src/__tests__/cli.test.ts`; `cli/src/__tests__/fixtures/render-options-v05.yaml` | 38 focused cases: version, info/open, init, JSON/SVG/graph compile, stdin/path precedence, empty input, strict UTF-8, config precedence, v0.5 profile/typed-override/unit matrix, strict format/parameter/profile/unit/sheet/view/unknown-option checks, check/profile, nested output, overwrite, write failure, JSON diagnostics, no-color, CI, and stream separation | No watch/rebuild lifecycle, registry install, permission/cross-OS/TTY matrix, or help snapshot |
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
| Compile/options and boundary controls | `cli/src/index.ts`; package docs | `--output`, `--format`, `--unit`, `--profile`, repeatable `--param`, `--sheet`, `--view`, diagnostics, config, color, and overwrite controls. |
| `init` starter workflow | `cli/src/index.ts`; CLI tests | Writes a minimal v0.5 document, creates parents, and refuses existing targets unless forced. |
| `open` inspection workflow | `cli/src/index.ts`; CLI tests | Reuses the metadata inspection path without launching an editor. |
| Config and noninteractive controls | `cli/src/index.ts`; CLI tests | `.relgeo.json`, explicit config, environment/flag precedence, `--no-config`, `NO_COLOR`, and `CI` are implemented. |
| No document watch/rebuild or daemon/JSON-RPC command | Commander output and scope docs | Intentionally held/out of the one-shot contract; package `dev` watch is build watch, not document watch. |

### Direct probes

| Probe | Observed result | Classification |
| --- | --- | --- |
| `relgeo --help` | Lists `info`, `compile`, `check|validate`, `help`; exit `0` | Implemented |
| `relgeo --version` | Prints `0.5.0`; exit `0` | Implemented |
| `relgeo validate --help` | Shows alias and validation options; exit `0` | Implemented |
| `compile -` with valid YAML on stdin | JSON output on stdout; exit `0` | Stdin pipeline implemented and kept separate from diagnostics/progress |
| `init <path>` | Creates starter document; existing target fails safely without force | Implemented |
| `open <file>` | Prints document metadata without launching an editor | Implemented |
| `watch <file>` | Unknown command; exit `1` | Watch absent |
| `compile --config x` | Reads explicit config path; missing config is a deterministic input failure | Config implemented |
| `compile --format not-a-format` | Actionable diagnostic; exit `2` | Unsupported format rejected before dispatch |
| `compile --param broken` | Actionable diagnostic; exit `2` | Malformed parameter token rejected before compilation |

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
| `CLI-INIT-001` | `implemented` | E2 | confirmed | in scope | `init` writes the minimal v0.5 starter document, creates parents, and protects existing targets unless forced. |
| `CLI-OPEN-001` | `implemented` | E2 | confirmed | in scope | `open` reuses metadata inspection without launching an editor and follows the shared input contract. |
| `CLI-IN-001` | `implemented` | E2 | confirmed | in scope | `path.resolve`, `pathExists`, and UTF-8 `readFile` are used by all three commands; tests cover valid/missing files. |
| `CLI-IN-002` | `implemented` | E2 | confirmed | in scope | `-` reads UTF-8 stdin for file-taking commands; valid input emits data on stdout and empty stdin is an input failure. |
| `CLI-IN-003` | `implemented` | E2 | confirmed | in scope | Explicit paths win over unrelated stdin; empty input and invalid UTF-8 fail with source-aware exit `3`. |
| `CLI-INSPECT-001` | `implemented` | E2 | partial | in scope | `info` prints major document sections and is tested; editor-mode parsing intentionally permits inspection of structurally incomplete input. |
| `CLI-VALID-001` | `implemented` | E2/E3 | partial | in scope | `check`/`validate` compiles/resolves without final output; diagnostics and warning semantics are not fully formalized. |
| `CLI-VALID-002` | `implemented` | E1/E2 | confirmed | in scope | Commander alias `validate` maps to `check`; direct help probe passes. |
| `CLI-RENDER-001` | `implemented` | E2/E3 | confirmed | in scope | Compile flow delegates parse/validate/resolve to core and render to renderer; shared fixture CLI output passes. |
| `CLI-RENDER-002` | `implemented` | E2 | confirmed at CLI boundary | in scope | `compile` and `check` cover profile selection, length/numeric/boolean/string overrides, target-unit conversion, combined profile-plus-override behavior, and strict unknown/malformed values; evaluator semantics remain delegated to core/spec. |
| `CLI-RENDER-003` | `implemented` | E2/E3 | confirmed at CLI boundary | in scope | CLI validates sheet existence before resolve/render, maps valid sheet/view selections to SVG, and covers wrong-sheet, unknown-view, format-mismatch, and no-artifact failures; renderer semantics remain delegated. |
| `CLI-OUT-001` | `implemented` | E2/E3 | partial | in scope | Default JSON is parseable and scene fields are asserted; no independently versioned CLI JSON schema. |
| `CLI-OUT-002` | `implemented` | E2/E3 | confirmed | in scope | SVG smoke passes; conformance keeps CLI SVG snapshots as reviewable output checks, while semantic parity is delegated to the renderer comparator rather than raw byte equality. |
| `CLI-OUT-003` | `implemented` | E2 | partial | in scope | Graph output is produced via core and parsed as an array in tests; graph schema has no separate compatibility document. |
| `CLI-OUT-004` | `implemented` | E2 | confirmed | in scope | File output creates nested parents, uses UTF-8 atomic replacement, honors overwrite policy, and maps write failures to exit `5` without a success claim. |
| `CLI-DIAG-001` | `implemented` | E2/E3 | confirmed at CLI boundary | boundary only | CLI transports core codes through human and JSON modes with phase, severity, path, object, and range fields where available; delegated semantics remain in spec/core. |
| `CLI-DIAG-002` | `implemented` | E2/E3 | partial | in scope | Human-readable stderr includes headings, codes, messages, object/path when supplied; color and exact wording vary by environment. |
| `CLI-DIAG-003` | `implemented` | E2 | confirmed | in scope | `--diagnostics json` emits one stable stderr envelope for input, runtime, output, and Commander usage failures; successful data remains on stdout. |
| `CLI-EXIT-001` | `implemented` | E2 | confirmed | in scope | Documented codes distinguish success, usage, input, validation/runtime, and output/write failures; focused tests cover each selected category. |
| `CLI-ERR-001` | `implemented` | E2 | confirmed | in scope | Supported formats are allowlisted before dispatch; unsupported values fail with an actionable diagnostic and cannot fall through to JSON. |
| `CLI-ERR-002` | `implemented` | E2 | confirmed | in scope | Malformed parameters and unknown format/profile/unit/option values fail before compilation; valid string-like overrides remain supported. |
| `CLI-CONFIG-001` | `implemented` | E2 | confirmed | in scope | `.relgeo.json`, explicit config, `RELGEO_CONFIG`, environment, flags, and `--no-config` implement documented precedence and validation. |
| `CLI-CONFIG-002` | `implemented` | E2 | confirmed | in scope | `NO_COLOR`, `RELGEO_NO_COLOR`, `CI`, and `--no-color` control noninteractive styling/progress; `RELGEO_*` supplies defaults. |
| `CLI-AUTO-001` | `implemented` | E2/E3 | confirmed | in scope | Commands run noninteractively and are used by root conformance/integration scripts; current Node 24/canonical CI remains unverified. |
| `CLI-AUTO-002` | `deferred` | E0/E1 | not assessed | held | One-shot CLI intentionally has no document watch/rebuild; `pnpm dev` is package build watch, not document watch. Lifecycle scope is held. |
| `CLI-AUTO-003` | `implemented` | E2 | confirmed at local boundary | in scope | Compile data stays on stdout and progress/diagnostics on stderr; JSON diagnostics, `--no-color`, and `CI` stream behavior are tested. Cross-OS/TTY remains unverified. |
| `CLI-AUTO-004` | `deferred` | E0/E1 | not assessed | held | Catalog holds daemon/JSON-RPC as a future bounded decision; no implementation or approved protocol contract. |
| `CLI-PACK-001` | `implemented` | E1/E2 | partial | in scope | `bin/relgeo.js`, bin metadata, CJS/ESM dist, and local binary run work; fresh registry install not executed. |
| `CLI-PACK-002` | `implemented` | E2 | confirmed | in scope | Current CLI pack checks pass and the tarball has 8 declared public entries; the repository-wide release audit is environment/workspace-limited by one unrelated core version mismatch. |
| `CLI-PACK-003` | `implemented` | E3 | confirmed at CLI rows | in scope | The CLI-specific compatibility rows pass; the current root gate has five unrelated workspace failures in the spec revision pin, core package/baseline version, Playground core range, and Flutter application version, so cross-repo compatibility is not claimed green. |
| `CLI-PACK-004` | `deferred` | E1/E2 | not assessed | evidence-only / deferred boundary | Manual preflight, pack, registry verifier, and forward-fix planner exist; Node 24, registry/public verification, and release-owner recovery evidence remain environment work, not a CLI implementation gap. |
| `CLI-PACK-005` | `implemented` | E3 | confirmed for declared fixtures | in scope | `conformance:fixtures` passes `298/298` across 23 fixtures, including exact CLI SVG and runtime-error status/code assertions; not exhaustive CLI-option coverage. |

### Status roll-up

| Status | Count | IDs / interpretation |
| --- | ---: | --- |
| `implemented` | 32 | Discovery/version, init/open, file and stdin input, inspect, validate, render options, outputs, diagnostics/error handling, config, automation, packaging, compatibility, and fixture participation at bounded scope. |
| `partial` | 0 | No expected CLI capability remains partially implemented at the stated boundary. |
| `broken` | 0 | No selected CLI error path remains a confirmed contract mismatch after strict dispatch and option validation. |
| `absent` | 0 | No expected CLI capability is absent at the one-shot boundary. |
| `deferred` | 3 | `CLI-AUTO-002` watch/rebuild and `CLI-AUTO-004` daemon/JSON-RPC remain held by scope/protocol decisions; `CLI-PACK-004` is an evidence-only release boundary owned by the release/workspace owner. |
| `not-applicable` | 0 expected IDs | UI/editor/parser/Flutter boundaries are reported separately in §4; they are not expected CLI IDs. |
| `unverified` | 0 expected IDs | Unverified is an evidence axis: Node 24, CI/public registry, and cross-OS claims remain unverified even where local implementation is present. |

## 6. Verification executed

| Command/evidence | Result | Evidence meaning |
| --- | --- | --- |
| `node -v && pnpm --version` | Node `22.23.2`, pnpm `10.33.3` | Local runtime only; Node is below required `>=24`. |
| `pnpm test` in `cli/` | PASS — 1 file, 38 tests | Current-checkout direct package suite covering input, init/open, config, v0.5 render-option matrix, output, diagnostics, exits, and stream controls. |
| `pnpm exec tsc --noEmit --target ES2022 --module NodeNext --moduleResolution NodeNext --esModuleInterop --skipLibCheck src/index.ts` in `cli/` | PASS — no diagnostics | Direct TypeScript analyzer check; the package has no standalone `tsconfig.json`, so the effective CLI compiler settings were supplied explicitly. |
| `/opt/homebrew/bin/pnpm build` in `cli/` | PASS — CJS/ESM output | Current-checkout source-to-dist package build. |
| `pnpm run conformance:fixtures` | PASS — `298 passed, 0 failed across 23 fixtures` | Root cross-surface fixture evidence; CLI checks are exact for declared paths. Node 22 emitted an engine warning because canonical Node is >=24. |
| `pnpm run compatibility:check` | WORKSPACE-LIMITED — current run reported `278 passed, 5 failed`; failures are outside the CLI rows (spec revision pin, core package/baseline version, Playground → core dependency range, and Flutter application version) | The CLI-specific matrix/dependency checks passed in the same run, but the root compatibility gate cannot be claimed green for this cross-repo workspace. |
| `pnpm run verify:baseline:strict` | PASS — `85 passed, 0 failed` | Strict baseline confirms gitlink/checkouts and package metadata are internally consistent for the current workspace; it does not override the compatibility matrix mismatches. |
| `pnpm run compatibility:audit` | PASS — `10 passed, 0 warnings, 0 failed` | Compatibility behavior and active/legacy version inventory remain coherent. |
| `pnpm run integration:gate -- --local` | NOT VERIFIED — gate requires Node `>=24`; local runtime is Node `22.23.2` | Integration consumer gate was not executed beyond its runtime preflight; this is an environment limitation, not evidence of a CLI implementation failure. |
| `NPM_CONFIG_CACHE=/private/tmp/relgeo-cli-npm-cache pnpm run release:audit` | ENVIRONMENT/WORKSPACE-LIMITED — `105 passed, 1 failed`; the only failure is the unrelated `core` package-version matrix check | The CLI package checks in the same audit pass; this is not a CLI implementation failure and no publish was attempted. |
| `npm pack --dry-run --json` in `cli/` | PASS — 8 files, `@relgeo/cli@0.5.0` | Direct CLI tarball evidence; listed entries contain only `LICENSE`, `README.md`, `bin/relgeo.js`, `dist/*`, and `package.json`; no credential/cache/log/development-only paths were present. |
| Local tarball + temporary consumer smoke (`npm pack --pack-destination ...`, `npm init -y`, local `npm install`, binary `--version`) | NOT VERIFIED — local pack and consumer initialization succeeded, but dependency installation did not complete in this environment and was stopped after no progress; the installed binary was not claimed as executed | Fresh consumer evidence remains deferred; the attempts used temporary cache/log directories and did not publish or mutate the registry. |
| CLI help/version/alias probes | PASS | Command discovery, version, and `validate` alias behavior. |
| CLI negative probes for stdin/watch/unknown format/malformed param, plus init/open/config boundary probes | PASS for expected observations: stdin succeeds, watch remains absent by scope, and invalid format/parameter values exit `2`; init/open/config behave according to the frozen one-shot contract | Direct evidence for the selected input and strict-validation contracts; watch remains scope-held while init/open/config are implemented. |
| Current-checkout revalidation on 2026-11-05: `pnpm test` in `cli/` | PASS — 1 file, 38 tests | Reconfirms the package evidence, including v0.5 profile/typed overrides/units, CLI sheet validation, valid sheet selection, no-artifact failure, init/open/config, stdin/encoding, output failure, JSON diagnostics, no-color/CI, unknown-option, and overwrite coverage; watch/rebuild and cross-shell/TTY remain out of scope/unverified. |
| Current-checkout boundary probes: built CLI help/version, stdin, init/open, config, unknown format/parameter, JSON usage error, and watch | PASS for expected observations | Reconfirms implemented one-shot behavior and held watch boundary on local Node `22.23.2`, not Node 24/canonical evidence. |
| Default `pnpm run release:audit` | FAIL — the repository npm cache is root-owned and cannot be written; a scoped-cache rerun completed the pack checks but exposed the unrelated `core` version mismatch | Environment/workspace limitation only; no registry mutation or publication was performed. |

## 7. Gaps, risks, and handoff

### Remaining implementation/evidence limits

1. Broaden filesystem permissions, cross-OS, TTY, and installed-package tests.
2. Complete Node >=24, current CI, registry/public-package, and cross-platform
   evidence before making release-parity claims.
3. Keep document watch/rebuild and daemon/JSON-RPC explicitly held until their
   lifecycle/protocol decisions are approved.

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

This audit has been reconciled against the expected catalog, status matrix, and
implementation-gap backlog. Every expected ID has an explicit disposition:
implementation at the CLI boundary, delegated semantic ownership where noted,
or an explicit deferred/evidence-only boundary with an owner and reason.
Future updates should preserve the distinction between implementation status,
evidence tier, parity, scope, and environment availability; no remaining
`🌗`, `❌`, or `⚠️` row is inferred from the current CLI evidence.
