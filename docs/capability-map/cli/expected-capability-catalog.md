# Expected RelGeo CLI capability catalog

> **Catalog status — 2026-10-30.** This remains the expected capability baseline
> for the CLI; its initial rows were derived from
> user journeys, target users, product workflow, documented command/menu
> expectations, roadmap and scope decisions, the active DSL contract, and the
> release/package contract. Existing CLI code, the old capability matrix, and
> the old implementation audit were not sources for the expected set. Current
> verification symbols below are refreshed from the follow-up audit and remain
> separate from the frozen scope decisions.

## 1. Boundary and decision record

| Field | Decision |
| --- | --- |
| Surface | `relgeo/cli`, published as `@relgeo/cli`, and its shell/CI entry point `relgeo` |
| Active language line | RelGeo DSL `0.5`; omitted document `version` defaults to the active implementation line |
| Primary users | RelGeo authors working from a terminal; CI/release maintainers; script and automation integrators; package consumers |
| Primary outcome | Move a RelGeo document through discover/open → inspect → validate → resolve/render → consume or publish an artifact without requiring the browser UI |
| CLI ownership | Command orchestration, input/output boundary, diagnostics presentation, exit behavior, packaging, and automation contract |
| Delegated ownership | DSL meaning and parse/resolve semantics belong to `spec/` and `@relgeo/core`; SVG semantics belong to `@relgeo/renderer-svg`; interactive authoring belongs to Playground/language-service |
| Evidence state in this document | Current local verification symbols are recorded per row below; the catalog still records the expected set, while audit/reconciliation remain the detailed evidence sources |

### Scope decisions

1. `init` and `open` are expected onboarding/workflow capabilities. `open` means
   selecting and inspecting an existing document at the CLI boundary; it does
   not mean launching an interactive editor.
2. File input and stdin input are separate capabilities. A file path is the
   minimum documented path; stdin is expected for Unix pipelines and CI even if
   it is not yet an active command contract.
3. `validate` is the user-facing validation verb; `check` may remain a
   compatibility alias. Validation must be able to run without emitting a
   render artifact.
4. `render` is the user-facing outcome. The command naming may be `render` or
   `compile` if the contract documents the mapping; the expected behavior is
   resolved output, not a second parser or geometry engine.
5. JSON, SVG, and dependency graph are distinct output contracts. Unknown
   formats must fail rather than silently selecting a default.
6. Diagnostics, exit codes, stdout/stderr separation, and machine-readable
   scripting behavior are part of the CLI contract, not incidental formatting.
7. Config, watch, and daemon/JSON-RPC behavior are cataloged as expected
   automation capabilities but remain separate from the current lightweight
   shell/CI baseline until a bounded contract is approved.
8. npm publication remains manual. Packaging must be reproducible and auditable
   without making the CLI release process an automatic publish transaction.

## 2. Requirement and source-of-truth register

| Ref | Requirement basis | What it contributes |
| --- | --- | --- |
| `REQ-JOURNEY` | `README.md`; `cli/README.md`; `cli/docs/README.md`; website CLI entry page | Terminal users need validation, compilation/rendering, inspection, and shell/CI use without opening the browser UI. |
| `REQ-COMMANDS` | `cli/README.md` §Commands/§Options; `cli/docs/README.md` §4–§5; active CLI entry-surface wording | The expected command vocabulary includes discovery/help, inspection, validation, compile/render, aliases, format/unit/profile/parameter/sheet selection, and output routing; future `init`/`open` rows are retained when required by the journey and scope decisions. |
| `REQ-SURFACE` | `docs/MATURATION-MASTER-PLAN.md` §2.3, §3, §4, §5; `docs/REPOSITORY-MAP.md` | CLI is a package-owned command surface in the cross-repo dependency chain; spec and runtime ownership remain separate. |
| `REQ-ROADMAP` | `docs/MATURATION-MASTER-PLAN.md` §1, §3–§5, §7; `docs/plans/03-npm-release-guard.md`; `docs/plans/04-shared-conformance-fixtures.md` | The roadmap makes package compatibility/release, shared CLI fixtures, integration gates, manual publication, and recovery part of the product baseline while keeping automation and future expansion explicitly bounded. |
| `REQ-SCOPE` | `docs/REPOSITORY-MAP.md` capability-inventory boundary and ownership rules; `cli/docs/README.md` §6; master-plan public-surface boundaries | CLI owns command orchestration, terminal I/O, diagnostics transport, exit behavior, packaging, and automation; parser/geometry/editor/mobile/daemon responsibilities remain delegated, excluded, or held as recorded below. |
| `REQ-INVENTORY` | `docs/capability-map/INVENTORY-PROTOCOL.md`; `docs/capability-map/SURFACE-DISCOVERY-LEDGER.md`; `docs/capability-map/README.md` | The catalog is frozen before implementation audit, uses a declared CLI discovery boundary, keeps expected/implementation/evidence/scope axes separate, and retains absent capabilities rather than dropping them. |
| `REQ-DSL` | `spec/id/README.md`; `spec/id/core/02-document-structure.md`; `spec/id/core/06-error-model.md` | CLI must accept the active DSL document shape, active/default version, deterministic diagnostics, and defined error codes. |
| `REQ-RELEASE` | `docs/plans/03-npm-release-guard.md` §2–§4; `docs/compatibility-matrix.json` | Package, binary, compatibility line, tarball boundary, dependency order, registry verification, and manual publish/recovery behavior are release requirements. |
| `REQ-CONFORMANCE` | `docs/MATURATION-MASTER-PLAN.md` §4 and §7; `docs/plans/03-npm-release-guard.md` | CLI output and error behavior must be consumable by shared fixture/conformance and integration gates. |
| `REQ-TASK-SCOPE` | Active task brief: command discovery, init/open/validate/render, stdin/file input, output formats, diagnostics, exit codes, help/version, config, watch/automation, scripting, errors, packaging | Required minimum catalog coverage, including expected capabilities that may not yet be implemented. |

The owner/source-of-truth column in the catalog is normative for ownership. A
row can cite a consumer or release gate as its expectation source without
making that consumer the semantic owner.

## 3. User journeys and target outcomes

| Journey | Target user | Expected outcome |
| --- | --- | --- |
| Discover and install | New author or package consumer | Find the CLI, see available commands/options, identify the active DSL/package version, and invoke a stable binary. |
| Start or open work | Author | Create a valid starter document or select an existing document from a path/stdin for inspection and processing. |
| Validate before sharing | Author, CI maintainer | Receive deterministic diagnostics, warnings, and a non-zero result when the document cannot be accepted. |
| Render/compile an artifact | Author, script integrator | Resolve the document with profile/parameter/unit choices and emit JSON, SVG, or graph to stdout or a file. |
| Automate repeated checks | CI/release maintainer | Run non-interactively with stable streams, exit codes, errors, and no browser/session dependency. |
| Script downstream tooling | Integrator | Pipe input/output, detect failure mechanically, and consume a documented machine-readable result. |
| Package and release | Package/release maintainer | Build, test, pack, verify, and publish the public CLI package in dependency order with recoverable manual release steps. |

## 4. Expected capability catalog

Status vocabulary for this catalog:

- `EXPECTED-IN` — part of the expected CLI baseline;
- `EXPECTED-BOUNDARY` — expected at this surface but delegated to another
  owner;
- `EXPECTED-BUT-MISSING` — explicitly expected and must be checked even if no
  implementation is known;
- `HELD-BY-SCOPE` — recorded for completeness but not an active promise until
  a new bounded decision exists.

The `Status verifikasi` column uses the shared current-result symbols: `✔️`
implemented, `🌗` partial, `❌` absent, and `⏸️` held/deferred. Detailed evidence,
parity, and environment limits remain in the audit and reconciliation.

| ID | Capability | User outcome | Dasar requirement | Scope decision | Owner / source of truth | Status verifikasi |
| --- | --- | --- | --- | --- | --- | --- |
| `CLI-DISC-001` | Command discovery and command list | User can discover the CLI, its commands, aliases, and option groups from the terminal. | `REQ-JOURNEY`, `REQ-COMMANDS`, `REQ-TASK-SCOPE` | `EXPECTED-IN` | `relgeo/cli`; command contract and package docs | `✔️` |
| `CLI-DISC-002` | Contextual help and usage errors | User gets actionable usage/help text for the root command, each command, missing arguments, and invalid options. | `REQ-JOURNEY`, `REQ-COMMANDS`, `REQ-TASK-SCOPE` | `EXPECTED-IN` | `relgeo/cli`; CLI command contract | `✔️` |
| `CLI-DISC-003` | Version and compatibility disclosure | User can identify CLI/package version and active DSL compatibility line before running work. | `REQ-DSL`, `REQ-RELEASE`, `REQ-TASK-SCOPE` | `EXPECTED-IN` | `relgeo/cli` package metadata; `spec/` owns DSL line; compatibility matrix governs cross-repo line | `✔️` |
| `CLI-INIT-001` | `init` starter document workflow | New author can create a minimal valid RelGeo document with the active version and a safe starter shape. | `REQ-JOURNEY`, `REQ-COMMANDS`, `REQ-TASK-SCOPE` | `EXPECTED-BUT-MISSING` | `relgeo/cli`; starter template contract must be documented; `spec/` owns validity | `❌` |
| `CLI-OPEN-001` | `open`/document selection workflow | User can select an existing document for CLI processing without launching an editor. | `REQ-JOURNEY`, `REQ-COMMANDS`, `REQ-SCOPE`, `REQ-TASK-SCOPE` | `EXPECTED-IN` | `relgeo/cli`; path/stream input contract | `🌗` |
| `CLI-IN-001` | File input | User can pass a RelGeo source file by path from any working directory and receive path-aware failures. | `REQ-JOURNEY`, `REQ-DSL` | `EXPECTED-IN` | `relgeo/cli`; filesystem/input contract | `✔️` |
| `CLI-IN-002` | Stdin input and pipeline composition | User can pipe RelGeo source into the CLI and combine it with shell tools or CI without a temporary file. | `REQ-TASK-SCOPE`, `REQ-JOURNEY` | `EXPECTED-BUT-MISSING` | `relgeo/cli`; stdin protocol and precedence rules | `✔️` |
| `CLI-IN-003` | Input precedence and encoding rules | User gets deterministic behavior when path, stdin, empty input, or unsupported encoding is supplied. | `REQ-TASK-SCOPE`, `REQ-CONFORMANCE` | `EXPECTED-IN` | `relgeo/cli`; input contract; host filesystem is an execution dependency | `🌗` |
| `CLI-INSPECT-001` | Document inspection/open metadata | User can inspect version, parameters, profiles, presets, components, views/sheets, and object structure before rendering. | `REQ-JOURNEY`, `REQ-DSL` | `EXPECTED-IN` | `relgeo/cli` delegates document semantics to `spec/` and `@relgeo/core` | `✔️` |
| `CLI-VALID-001` | `validate` document validation | User can validate and resolve a document without producing a final render artifact. | `REQ-JOURNEY`, `REQ-COMMANDS`, `REQ-DSL`, `REQ-TASK-SCOPE` | `EXPECTED-IN` | `relgeo/cli` orchestration; `spec/` + `@relgeo/core` semantic contract | `✔️` |
| `CLI-VALID-002` | `check` compatibility alias or explicit command mapping | Existing scripts can use `check` while documentation clearly maps it to validation semantics. | `REQ-JOURNEY`, `REQ-COMMANDS`, `REQ-CONFORMANCE` | `EXPECTED-IN` | `relgeo/cli`; command compatibility policy | `✔️` |
| `CLI-RENDER-001` | Resolve/compile/render workflow | User can parse, validate, resolve, and produce a requested artifact in one deterministic command flow. | `REQ-JOURNEY`, `REQ-COMMANDS`, `REQ-DSL`, `REQ-SURFACE` | `EXPECTED-IN` | `relgeo/cli` orchestration; `@relgeo/core` and renderer owners retain semantics | `✔️` |
| `CLI-RENDER-002` | Profile, parameter, and unit selection | User can select a profile and override parameters/target units reproducibly for a render or validation run. | `REQ-JOURNEY`, `REQ-COMMANDS`, `REQ-DSL`, `REQ-CONFORMANCE` | `EXPECTED-IN` | `relgeo/cli` option contract; `spec/` + `@relgeo/core` type/evaluation contract | `🌗` |
| `CLI-RENDER-003` | Sheet/view targeting | User can select the intended sheet/view for an output format that supports it, with a clear error when the selector is invalid. | `REQ-JOURNEY`, `REQ-COMMANDS`, `REQ-DSL` | `EXPECTED-IN` | `relgeo/cli` option mapping; `spec/` and `@relgeo/renderer-svg` own sheet/render semantics | `🌗` |
| `CLI-OUT-001` | JSON resolved-scene output | Scripts and downstream tools can consume resolved geometry as JSON with a documented compatibility boundary. | `REQ-JOURNEY`, `REQ-DSL`, `REQ-CONFORMANCE` | `EXPECTED-IN` | `@relgeo/core` semantic scene; CLI owns serialization boundary; fixture output is evidence, not sole authority | `✔️` |
| `CLI-OUT-002` | SVG rendering output | Users can export the resolved scene to SVG for files, previews, and downstream publishing. | `REQ-JOURNEY`, `REQ-SURFACE`, `REQ-CONFORMANCE` | `EXPECTED-IN` | `@relgeo/renderer-svg` owns SVG semantics; `relgeo/cli` owns invocation/output boundary | `✔️` |
| `CLI-OUT-003` | Dependency graph output | Users can inspect dependency relationships as a machine-consumable graph for debugging and automation. | `REQ-JOURNEY`, `REQ-CONFORMANCE` | `EXPECTED-IN` | `@relgeo/core` owns graph semantics; CLI owns format/transport | `✔️` |
| `CLI-OUT-004` | Stdout versus file output | User can choose pipe-friendly stdout or an explicit output path, with deterministic write/overwrite/error behavior. | `REQ-JOURNEY`, `REQ-TASK-SCOPE`, `REQ-CONFORMANCE` | `EXPECTED-IN` | `relgeo/cli`; filesystem/output contract | `🌗` |
| `CLI-DIAG-001` | Structured phase-aware diagnostics | User can distinguish parse, structural validation, reference/expression, geometry, and post-resolution constraint diagnostics, with code and location when available. | `REQ-DSL`, `REQ-TASK-SCOPE` | `EXPECTED-IN` | `spec/id/core/06-error-model.md` owns codes/semantics; CLI owns presentation/transport | `🌗` |
| `CLI-DIAG-002` | Human-readable diagnostics | Terminal users receive concise actionable messages that identify the source, phase, code, path/object, and remediation context where possible. | `REQ-JOURNEY`, `REQ-DSL` | `EXPECTED-IN` | `relgeo/cli` presentation; error code meaning remains in `spec/`/`@relgeo/core` | `✔️` |
| `CLI-DIAG-003` | Machine-readable diagnostics mode | Automation can consume diagnostics without scraping colored prose, including stable fields for code, message, path/object, and severity. | `REQ-TASK-SCOPE`, `REQ-CONFORMANCE` | `EXPECTED-BUT-MISSING` | `relgeo/cli`; JSON diagnostic envelope requires an explicit CLI contract | `🌗` |
| `CLI-EXIT-001` | Exit-code contract | Success, validation failure, input failure, usage failure, and operational/write failure are distinguishable to shell/CI callers. | `REQ-TASK-SCOPE`, `REQ-JOURNEY` | `EXPECTED-IN` | `relgeo/cli`; exit-code contract | `✔️` |
| `CLI-ERR-001` | Deterministic error handling | Missing files, malformed input, unknown references, invalid options, unsupported formats, and render failures fail clearly without silent fallback. | `REQ-DSL`, `REQ-TASK-SCOPE`, `REQ-CONFORMANCE` | `EXPECTED-IN` | `relgeo/cli` boundary; semantic codes from `spec/`/`@relgeo/core`/renderer | `✔️` |
| `CLI-ERR-002` | Unknown-option/unknown-format rejection | Typos in commands, options, formats, profiles, sheets, or parameters fail non-zero and identify the invalid value. | `REQ-TASK-SCOPE`, `REQ-CONFORMANCE` | `EXPECTED-IN` | `relgeo/cli`; command and format allowlist contract | `✔️` |
| `CLI-CONFIG-001` | Explicit configuration sources | User can set reusable defaults for input/output, format, unit, profile, diagnostics, and color behavior with documented precedence. | `REQ-TASK-SCOPE`, `REQ-JOURNEY` | `EXPECTED-BUT-MISSING` | `relgeo/cli`; config schema/precedence contract | `❌` |
| `CLI-CONFIG-002` | Noninteractive/environment configuration | CI can disable color/prompts and set configuration through documented environment/flags without ambient user state changing results. | `REQ-TASK-SCOPE`, `REQ-CONFORMANCE` | `EXPECTED-IN` | `relgeo/cli`; automation environment contract | `❌` |
| `CLI-AUTO-001` | Noninteractive automation mode | CLI runs deterministically in shell/CI with no browser, editor, prompt, or persistent session dependency. | `REQ-JOURNEY`, `REQ-SURFACE`, `REQ-TASK-SCOPE` | `EXPECTED-IN` | `relgeo/cli`; root integration/release gates consume it | `✔️` |
| `CLI-AUTO-002` | Watch/rebuild workflow | User can watch source/config dependencies and revalidate or rerender on changes with controlled failure/recovery behavior. | `REQ-TASK-SCOPE`, `REQ-JOURNEY` | `EXPECTED-BUT-MISSING` | `relgeo/cli`; watch lifecycle and debounce contract | `❌` |
| `CLI-AUTO-003` | Stable scripting streams | stdout contains requested data only, stderr contains progress/diagnostics, and color/progress noise is controllable. | `REQ-TASK-SCOPE`, `REQ-JOURNEY` | `EXPECTED-IN` | `relgeo/cli`; shell integration contract | `🌗` |
| `CLI-AUTO-004` | Optional long-running/JSON-RPC daemon boundary | A future agent/automation host can use a bounded long-running protocol if the product approves it. | `REQ-TASK-SCOPE`, `REQ-SURFACE` | `HELD-BY-SCOPE` | New CLI protocol decision; do not infer from MCP or implement implicitly | `⏸️` |
| `CLI-PACK-001` | Executable package and `relgeo` binary | Package consumer can install `@relgeo/cli` and invoke the declared `relgeo` binary from a clean environment. | `REQ-RELEASE`, `REQ-JOURNEY` | `EXPECTED-IN` | `relgeo/cli/package.json`; npm package boundary | `✔️` |
| `CLI-PACK-002` | Reproducible build and declared tarball boundary | Maintainer can build the CLI and pack only declared public files plus required metadata/docs/license. | `REQ-RELEASE` | `EXPECTED-IN` | `docs/plans/03-npm-release-guard.md`; package manifest and release guard | `✔️` |
| `CLI-PACK-003` | Compatibility/version policy | CLI package version, dependency ranges, DSL line, and breaking-change behavior remain aligned with the cross-repo matrix. | `REQ-RELEASE`, `REQ-SURFACE`, `REQ-DSL` | `EXPECTED-IN` | `docs/compatibility-matrix.json`; `spec/`; package manifest | `✔️` |
| `CLI-PACK-004` | Release verification and recovery boundary | Release operator can test, pack, verify registry consumers, stop safely, and use forward-fix records after a partial publish. | `REQ-RELEASE` | `EXPECTED-IN` | `docs/plans/03-npm-release-guard.md`; workspace release scripts/records | `🌗` |
| `CLI-PACK-005` | Cross-surface conformance consumption | CLI participates in shared fixture/integration gates with exact output/error assertions without becoming the owner of DSL semantics. | `REQ-CONFORMANCE`, `REQ-SURFACE` | `EXPECTED-IN` | `fixtures/` runner and workspace integration gate; `spec/` remains semantic authority | `✔️` |

## 5. Expected non-goals and explicit boundaries

| Capability not owned by CLI | Decision |
| --- | --- |
| Interactive editor, completion, hover, and browser authoring | Use Playground/language-service; CLI only provides terminal workflows. |
| Independent parser, resolver, geometry engine, or SVG semantic implementation | Delegate to `spec/`, `@relgeo/core`, and `@relgeo/renderer-svg`; CLI must not fork semantics. |
| Flutter workbench or mobile delivery | Flutter remains a separate non-publishable workbench; Android/iOS are deferred by accepted scope decision and are not CLI dependencies. |
| Automatic npm publish or rollback transaction | Publish stays manual; recovery is stop, record, and forward-fix. |
| Unbounded daemon/MCP protocol | Held until a distinct protocol/host decision defines transport, lifecycle, security, and compatibility. |

## 6. Catalog freeze and audit handoff

This catalog is the expected baseline to review before implementation comparison.
The follow-up audit may add evidence, implementation status, parity, and gaps,
but may not delete an expected row merely because the current code or old matrix
does not contain it. Any change to the expected set requires an explicit scope
decision and a dated catalog revision.

Audit handoff order:

1. review/approve IDs and scope decisions in this document;
2. inspect `cli/`, package metadata, tests, fixtures, consumers, and release
   scripts against each ID;
3. record implementation, evidence tier, parity, and gap separately;
4. update the CLI matrix/audit only after this expected catalog is accepted.
