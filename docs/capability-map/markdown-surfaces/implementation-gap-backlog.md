# Markdown Surfaces Implementation-Gap Backlog

**Date:** 2026-11-04
**Status:** candidate goal/task register; selected rows may record `✔️` only
after focused implementation and fresh audit evidence; the register itself is
not completion evidence
**Sources:** [status matrix](./status-matrix.md) and [expected-versus-observed reconciliation](./reconciliation.md)

This backlog turns every expected capability with an implementation gap into
one candidate implementation task: all `❌`/`⚠️` rows and the `🌗` rows whose
audit identifies missing implementation or contract behavior. The task
descriptions are not active SuClos goals until owner, scope, dependency, and
acceptance evidence are approved. The two `🌗` rows whose remaining issue is
external evidence only are verification follow-ups, not implementation gaps.

## Boundary freeze — cross-surface owner dan fixture map (2026-11-03)

This map freezes which package owns each boundary and which fixture is the
semantic handoff. Markdown does not reimplement scene resolution or SVG
serialization. `MD-DIAG-003` is closed by the tolerant runtime-warning fixture
and package regression tests recorded below.

| ID | Owner boundary | Fixture anchor | Stable acceptance assertion |
| --- | --- | --- | --- |
| `SVG-SCENE-003` | `renderer-svg` owns sizing/context; `remark-relgeo` only passes documented options | `fixtures/reference/10-v05-relational-baseline.yaml` and renderer context tests | Markdown preview may change presentation context, never semantic object geometry; output remains safe SVG |
| `SVG-STYLE-002` | `renderer-svg` owns typography fallback/XML escaping; Markdown/website own wrapper/asset presentation | renderer presentation-escaping fixture and `security.test.ts` | Font/fill/text values are escaped before data URI/HTML transport; no executable markup |
| `SVG-DIM-001` | renderer projects dimensions; core/spec own meaning; Markdown reuses canonical render | shared fixture 02 and renderer dimension tests | Dimension label/leader semantics survive Markdown embedding; semantic projection, not byte snapshot, is compared |
| `SVG-ANNOT-001` | renderer projects annotations; Markdown/website do not parse or redraw leaders | shared fixture 02 and renderer annotation tests | Annotation target/leader/multiline output remains safe and semantically stable |
| `SVG-SHEET-001` | renderer/core own sheet/view composition; Markdown option parsing only selects supported sheet/view | shared fixtures 02/03/09 and CLI selection tests | Supported selection is explicit; missing sheet/view is a typed contextual failure, not silent model fallback |
| `SVG-DET-001` | workspace/core own canonical replay comparison; Markdown must be deterministic for same source/options | active fixture 10 JSON + manifest semantic serialization | Repeated Markdown transforms preserve semantic IDs/order/numbers; raw SVG byte equality is out of scope |
| `SVG-INTEG-002` | Playground owns worker-to-DOM; Markdown owns SSR/AST host integration; renderer owns safe SVG | fixture 10 and runtime fixture 14; worker/Preview sources | Consumer boundaries stay separate: browser E2E is not inferred from static Markdown success |
| `GAP-009` | renderer-svg + core implement presentation safety; Markdown verifies transport | presentation-escaping fixture; language-spec backlog `GAP-009` | Escaped dimension/annotation content survives Markdown serialization without changing semantic placement |
| `GAP-013` | renderer-svg owns safe semantic SVG serialization; Markdown/website own host sanitization policy | presentation-escaping fixture and renderer security tests | `<script>`, event-handler attributes, unsafe partial SVG, and unsafe URL forms never reach rendered host output |
| `MD-DIAG-003` | `remark-relgeo` owns tolerant node/diagnostic transport; core owns runtime warning; website owns visual presentation | `fixtures/reference/14-v05-runtime-align-violation.yaml` + `remark-relgeo/test/remark-relgeo.test.mjs` | Valid preview remains present with structured warning/severity/location; strict mode is explicit; closed by the runtime-warning regression |

Cross-surface safety invariant: a Markdown transform may carry SVG as a data
URI or host-approved wrapper only after the renderer output passes the safe-SVG
boundary. Diagnostics are data, not executable HTML, and source/fallback text
must remain readable when preview rendering is unavailable.

## Coverage rules

- One implementation candidate maps to one expected capability ID.
- `❌` remains absent; it is not changed to `➖` because implementation or
  delivery is difficult.
- `⚠️` is a confirmed defect or contract mismatch, not absence.
- `➖` and `⏸️` are scope/roadmap states and do not create implementation tasks.
- A candidate is complete only after source/test changes and a fresh audit or
  reconciliation update. Editing this backlog never closes a gap.

| Check | Result |
| --- | ---: |
| Expected implementation-gap rows | 27 |
| Candidate implementation tasks | 27 |
| `✔️` tasks with fresh local evidence | 15 |
| `🌗` tasks | 12 |
| `❌` tasks | 0 |
| `⚠️` tasks | 0 |
| Missing source IDs | 0 |
| Duplicate source IDs | 0 |

## Triage — P0/P1 implementation closure (2026-11-04)

This tranche separates changes that can be implemented and tested inside the
workspace from claims that require an external host or release boundary. A row
is **selected** only when its owner can change package/docs/test behavior and
prove the acceptance assertion without registry publication, production
deployment, or physical accessibility infrastructure. `Initial status` is the
observed status before this triage; it is not completion evidence.

| ID | Priority | Triage disposition | Owner | Source of truth | Acceptance test / evidence target | Initial status | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `MD-FENCE-001` | P1 | **Implemented — verified-local** | `remark-relgeo` + `remark-relgeo-hl` owners | Package READMEs/terminology plus `spec/id` naming policy | Alias matrix proves package defaults (`relgeo`/`rg`), explicit overrides, unrelated fences, and non-target isolation | `implemented / verified-local` | Keep alias matrix regression |
| `MD-FENCE-002` | P1 | **Implemented — verified-local** | Both plugin owners | Unified mdast/hast code-node contract and both plugin transforms | Focused AST tests preserve source, whitespace/metadata, position, fallback text, and adjacent nodes | `implemented / verified-local` | Keep source-preservation regression |
| `MD-FENCE-003` | P1 | **Implemented — verified-local** | Both plugin owners | Deterministic transform contract in the maturation plan and plugin visitors | Two identical runs over mixed and repeated blocks preserve order, isolate failures, and leave non-RelGeo blocks unchanged | `implemented / verified-local` | Keep multi-block conformance regression |
| `MD-PREVIEW-002` | P1 | **Implemented — verified-local** | `remark-relgeo` + renderer owner | `spec/id/presentation/25-views-sheets.md`, renderer sheet API, and `remark-relgeo` option API | Default model output, explicit sheet/profile/unit behavior, canonical sheet/view definitions, invalid metadata, and strict failure are tested | `implemented / verified-local` | Keep presentation projection regression |
| `MD-HL-004` | P1 | **Implemented — verified-local** | `remark-relgeo-hl` + language-service owner | Language-service lexical token contract and highlighter package API | Invalid/incomplete source remains readable without renderer/core; explicit service opt-out and service failure have bounded fallback | `implemented / verified-local` | Keep lexical fallback regression |
| `MD-DIAG-003` | P1 | **Closed — already implemented** | `remark-relgeo` + core owners | Core runtime diagnostic contract, fixture 14, and package regression tests | Tolerant mode retains valid preview with structured `RUNTIME_CONSTRAINT_VIOLATION`; strict mode fails explicitly | `implemented / verified-local` | No implementation action; retain regression evidence |
| `MD-OPT-001` | P1 | **Implemented — verified-local** | Each package owner | Package README/types plus `docs/compatibility-matrix.json` | Public option table, defaults, immutability, unknown-key behavior, and invalid-value diagnostics match runtime tests | `implemented / verified-local` | Keep option validation and reuse regressions |
| `MD-SSR-003` | P1 | **External verification — not an implementation blocker** | Package + website owners | Documented unified/remark ordering contract and generic-host fixture | A clean standalone remark-parse → plugin → remark-rehype → rehype-stringify run proves ordering on an alternate host | `partial / unverified-external` | Keep as `MD-VERIFY-001`; run when a generic host is available |
| `MD-SSR-004` | P0 | **Selected — implementation-closable; local pack verified** | Both package owners | Package `package.json` exports/types, package READMEs, and compatibility matrix | Local `npm pack` plus package-boundary tests pass; fresh temporary consumer must resolve documented ESM/CJS/types without workspace-relative dependencies | `partial / unverified-external` | Retry clean consumer when npm resolver is available; registry publication remains separate evidence |

The selected set was seven rows: `MD-FENCE-001`, `MD-FENCE-002`,
`MD-FENCE-003`, `MD-PREVIEW-002`, `MD-HL-004`, `MD-OPT-001`, and
`MD-SSR-004`. Six now have fresh local implementation evidence;
`MD-SSR-004` remains partial pending a clean temporary consumer. `MD-DIAG-003`
is retained for traceability but is not an open gap. `MD-SSR-003` is retained as
an external verification follow-up. The
release/registry-only `MD-REL-002` and deployed/public or physical AT checks
remain evidence/deferred work and are not silently promoted into implementation
tasks by this triage.

## Contract and acceptance lock — selected tranche (2026-11-04)

This is the pre-implementation contract for the seven selected rows. The
normative compatibility boundary is RelGeo DSL `0.5`, package line `0.5.x`,
with package versions and release order governed by
[`docs/compatibility-matrix.json`](../../compatibility-matrix.json). No row
introduces DSL semantics, a standalone Markdown renderer, or an unrecorded
public option. The contract uses the inventory protocol's separation of
implementation, evidence, parity, and scope; external or public evidence is
never inferred from a local pass.

| ID | Locked success behavior | Locked failure / edge behavior | Expected evidence | Normative source of truth |
| --- | --- | --- | --- | --- |
| `MD-FENCE-001` | Keep package defaults documented and stable: `remark-relgeo` targets `relgeo`, `remark-relgeo-hl` targets `rg`; an explicit non-empty `fence` option may select one supported identifier; only the matching plugin transforms the node. | Unknown, empty, or non-target fence identifiers remain untouched; `relgeo` and `rg` in one document are independently isolated by the package-specific default/explicit fence contract. | Alias matrix covering both defaults, explicit overrides, unrelated fences, and mixed-fence AST output. | Package READMEs and development plans; `spec/id` terminology; expected catalog naming row; [`INVENTORY-PROTOCOL.md`](../INVENTORY-PROTOCOL.md) Markdown boundary. |
| `MD-FENCE-002` | A matching code node preserves source bytes, info metadata, positions when present, and surrounding node order; highlighter fallback keeps the original source copyable. | Empty source, CRLF/trailing newline, unknown metadata, missing position, and adjacent non-target nodes do not cause source loss or document-wide mutation. | Real remark parse → plugin → rehype fixture with deep AST/HTML assertions for value, metadata, whitespace, positions, and neighbors. | Unified mdast/hast contract; both plugin transforms; expected catalog preservation row; inventory protocol test/fixture requirements. |
| `MD-FENCE-003` | Repeated transforms with identical source/options produce the same ordered semantic AST projection; every target block is isolated and non-RelGeo blocks retain their order/content. | A malformed target block, duplicate target block, or mixed-language block cannot change another block's output; no global mutable state may leak between plugin invocations. | Two-run mixed-block fixture with normalized AST comparison plus per-block failure-isolation assertions. | Maturation-plan deterministic-build rule; plugin visitor boundary; website build contract; inventory protocol evidence/parity axes. |
| `MD-PREVIEW-002` | Default preview remains the canonical model preview with `padding=0`; `profile`, `sheet`, and `unit` metadata pass through explicitly, and `sheet` selects the renderer's canonical `sheetId`. Views are selected only through the DSL sheet/view definitions. | Missing/unknown sheet or invalid presentation metadata yields the existing contextual diagnostic and tolerant placeholder; strict mode throws. No standalone plugin `view` option is added to the `0.5.x` contract. | Model and sheet fixtures assert default output, metadata pass-through, selected sheet output, missing-sheet tolerant output, and strict failure. | [`spec/id/presentation/25-views-sheets.md`](../../../spec/id/presentation/25-views-sheets.md); renderer `RenderOptions`; `remark-relgeo` README/source; compatibility matrix `0.5` policy. |
| `MD-HL-004` | Highlighting operates on source/lexical token projection only; when the token service is available it emits semantic spans, while the independent fallback emits readable `pre > code` source without requiring core or renderer. | Invalid/incomplete source never claims preview success; token-service absence/throw produces source-preserving fallback and diagnostic, while `failurePolicy: 'strict'` remains the explicit throw path. | Tests inject missing/throwing service and invalid source, assert no core/renderer dependency, preserved lines/text, bounded diagnostic, and strict behavior. | `remark-relgeo-hl/DEVELOPMENT-PLAN.md` source-first and no-renderer boundary; highlighter README/source; language-service lexical contract; inventory protocol package/consumer boundary. |
| `MD-OPT-001` | The documented option set, defaults, and instance reuse are stable: preview `{ fence: 'relgeo', classPrefix: 'relgeo-preview', failurePolicy: 'tolerant' }`; highlighter `{ fence: 'rg', classPrefix: 'relgeo-hl', failurePolicy: 'tolerant' }`; optional hooks/services remain caller-supplied. Reusing one plugin instance does not mutate its configuration. | Invalid known values (`failurePolicy`, empty fence/class prefix, or malformed injected hook/service) fail deterministically at configuration; unknown keys are ignored and never forwarded to core/renderer. Content failures still follow tolerant/strict policy and existing diagnostic DTOs. | README/type option tables, runtime validation tests, unknown-key tests, default assertions, and two-document same-instance regression. | Package `src/index.ts` option interfaces/defaults; package READMEs; compatibility matrix same-line/patch policy; expected catalog option row. |
| `MD-SSR-004` | A local packed `0.5.x` package consumed from a fresh temporary project resolves documented ESM, CJS, and TypeScript exports for both Markdown plugins without workspace-relative dependencies. | Missing `dist`, broken `exports`/`types`, or workspace-relative dependency causes the clean consumer check to fail with actionable evidence; registry publication/install parity remains a separate `MD-REL-002` external check. | Package build/lint/tests, `npm pack`, temporary consumer import/type smoke, and package manifest inspection at the recorded checkout. | Both package `package.json` export/type/file lists; package READMEs; compatibility matrix package boundary, version policy, and release order; inventory protocol delivery evidence separation. |

These assertions are acceptance contracts, not implementation evidence. Any
implementation that changes a public option name, default, diagnostic shape,
fence mapping, or compatibility line must update the applicable source of truth
and reconciliation record before the implementation is promoted.

## Priority and scope register

Priority is explicit (`P0` blocks safe/public use, `P1` closes an important
contract or consumer gap, `P2` is a bounded hardening item). Scope identifies
the implementation boundary; the candidate task table below supplies the owner,
dependency, acceptance evidence, risk, and next action for the same task ID.

| Candidate task | Priority | Scope |
| --- | --- | --- |
| `MD-TASK-001` | P1 | Shared fence naming and detection contract |
| `MD-TASK-002` | P1 | AST source, metadata, whitespace, and boundary preservation |
| `MD-TASK-003` | P1 | Multi-block and mixed-language transform isolation |
| `MD-TASK-004` | P1 | Preview defaults plus supported sheet/view/profile projection |
| `MD-TASK-005` | P1 | Preview AST/HTML wrapper and surrounding Markdown structure |
| `MD-TASK-006` | P0 | Source-preserving highlighter failure boundary |
| `MD-TASK-007` | P1 | Highlighter-only lexical fallback independent of preview/runtime |
| `MD-TASK-008` | P1 | Shared block-scoped diagnostic shape and serialization |
| `MD-TASK-009` | P1 | Preview/highlight fallback payload and host presentation |
| `MD-TASK-010` | P1 | Preserve preview while projecting runtime warnings |
| `MD-TASK-011` | P1 | Caller-selectable build failure and fallback policy |
| `MD-TASK-012` | P1 | Public option names, defaults, validation, and instance reuse |
| `MD-TASK-013` | P1 | DSL/presentation option projection and future-version errors |
| `MD-TASK-014` | P0 | Bounded output customization, asset strategy, and hook trust boundary |
| `MD-TASK-015` | P1 | Explicit caller policy for warning/fallback versus hard failure |
| `MD-TASK-016` | P1 | Generic non-browser unified/SSR execution boundary |
| `MD-TASK-017` | P1 | Inline/alternate preview asset delivery and base URL behavior |
| `MD-TASK-018` | P0 | HTML/SVG/URL safety across source, metadata, and custom output |
| `MD-TASK-019` | P1 | Preview naming, role, description, and valid wrapper semantics |
| `MD-TASK-020` | P1 | Non-color source, error, fallback, and token semantics |
| `MD-TASK-021` | P0 | Per-block malformed-input and service-failure isolation |
| `MD-TASK-022` | P1 | Active/legacy/future version error projection |
| `MD-TASK-023` | P1 | Safe typed projection of core/renderer failures |
| `MD-TASK-024` | P1 | Website package/spec provenance and compatibility-line assertions |
| `MD-TASK-025` | P1 | Localized routes, public artifact, responsive readability, and AT evidence |
| `MD-TASK-026` | P1 | Standalone package docs, examples, and external consumer smoke |
| `MD-TASK-027` | P0 | Fresh package export, type, pack/install, and workspace-independence boundary |

## Candidate implementation tasks

| Candidate task | Expected ID | Source status | Owner | Dependency | Acceptance test / evidence target | Risk | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `MD-TASK-001` shared fence alias contract | `MD-FENCE-001` | ✔️ | both plugin owners | terminology/spec naming | Package defaults remain `relgeo` for preview and `rg` for highlighting; explicit supported overrides, unrelated fences, and mixed-fence isolation pass alias matrix tests | P1 wrong fence surface | Closed with package-level matrix tests |
| `MD-TASK-002` source/metadata preservation fixtures | `MD-FENCE-002` | ✔️ | both plugin owners | unified mdast/hast contract | Focused AST fixtures preserve info, whitespace, source, position, fallback, and adjacent nodes | P1 source loss/copy regression | Closed with preservation regression |
| `MD-TASK-003` mixed-block determinism | `MD-FENCE-003` | ✔️ | both plugin owners | visitor isolation; deterministic build | Repeated mixed RelGeo/non-RelGeo blocks preserve order and isolated output across two builds | P1 cross-block contamination | Closed with multi-block conformance fixture |
| `MD-TASK-004` preview presentation option contract | `MD-PREVIEW-002` | ✔️ | remark-relgeo + renderer owner | views/sheets/profile spec | Tests prove default model output, explicit sheet/profile/unit behavior, canonical view selection through sheet definitions, and typed missing-sheet failure | P1 author selects a view that is ignored | Closed with presentation projection and fixtures |
| `MD-TASK-005` clean preview wrapper integration | `MD-PREVIEW-004` | ✔️ | remark-relgeo + website | rehype unwrap helper | Built HTML has the intended wrapper without `pre > div`; surrounding Markdown assertions pass | P1 structural/a11y defect | Closed with Astro unwrap fix and built-output assertion |
| `MD-TASK-006` highlighter service-failure fallback | `MD-HL-002` | ✔️ | remark-relgeo-hl + language-service | token service error boundary | Injected token-service failure returns original source/safe code block and transform succeeds | P0 docs build crash | Closed with fallback and failure-injection test |
| `MD-TASK-007` lexical fallback isolation | `MD-HL-004` | ✔️ | remark-relgeo-hl + language-service | lexical token contract | Invalid/incomplete source remains readable without renderer/core resolution; independent fallback has no semantic-success claim; service failure has bounded fallback | P1 highlighter depends on semantic service availability | Closed with source-preserving lexical fallback and fixture |
| `MD-TASK-008` structured Markdown diagnostic DTO | `MD-DIAG-001` | ✔️ | both plugins + spec/core | error model; block location | Output exposes stable code, severity, message, and source/block location with serialization tests | P1 failures not traceable | Closed with plugin diagnostic payload tests |
| `MD-TASK-009` actionable diagnostic fallback | `MD-DIAG-002` | ✔️ | remark-relgeo + website | diagnostic DTO; host UI | Invalid preview produces structured payload plus readable source/fallback and website assertion | P1 reader cannot recover | Closed with fallback projection and host assertions |
| `MD-TASK-010` non-fatal preview diagnostics | `MD-DIAG-003` | ✔️ | remark-relgeo + core | runtime diagnostics API | Runtime warning fixture returns valid preview plus diagnostic without dropping output | P1 useful preview disappears | Closed with `RUNTIME_CONSTRAINT_VIOLATION`, retained preview image, and strict/tolerant regression tests |
| `MD-TASK-011` strict/tolerant policy option | `MD-DIAG-004` | ✔️ | remark-relgeo + build owner | error policy; build gate | Strict mode fails deterministically; tolerant mode emits fallback/diagnostic; defaults documented | P1 implicit build behavior | Closed with `failurePolicy` option and tests |
| `MD-TASK-012` option schema and invalid-value validation | `MD-OPT-001` | ✔️ | both package owners | public API docs; compatibility policy | README/types/defaults match runtime; invalid known values fail deterministically; unknown keys are ignored and not forwarded; same instance is reusable | P1 undocumented integration drift | Closed with option docs, validation, and reuse tests |
| `MD-TASK-013` version/view/profile pass-through | `MD-OPT-002` | 🌗 | remark-relgeo + spec/core | version/presentation APIs | Supported version/profile/view/sheet combinations are explicit; future version has stable error projection | P1 wrong preset/migration messaging | Decide supported option surface |
| `MD-TASK-014` safe output and asset configuration | `MD-OPT-003` | 🌗 | both package owners + website | asset policy; sanitizer boundary | Class/output customization is bounded, asset/base strategy is explicit, and custom hook safety is tested | P0 unsafe/non-portable output | Extend the bounded custom-hook rejection into the agreed sanitizer/asset policy |
| `MD-TASK-015` caller-selected fallback policy | `MD-OPT-004` | ✔️ | remark-relgeo | diagnostic policy; build owner | `failurePolicy` selects tolerant fallback or strict failure and focused tests prove both paths | P1 CI policy cannot be chosen | Closed by the shared `MD-TASK-011` policy implementation; keep regression coverage |
| `MD-TASK-016` standalone SSR pipeline | `MD-SSR-001` | 🌗 | both package owners | Node runtime; unified ordering | Generic non-Astro unified/SSR fixture runs without browser globals and records output | P1 alternate host failure | Add standalone pipeline test |
| `MD-TASK-017` configurable asset URL mode | `MD-ASSET-001` | 🌗 | remark-relgeo + website | Pages/base policy | Inline/default and any selected alternate asset mode produce correct local and Pages output | P1 large/alternate-host preview issue | Decide asset strategy and test |
| `MD-TASK-018` generated-output sanitization policy | `MD-ASSET-003` | 🌗 | both plugins + renderer/host | SVG sanitizer; URL policy | Malicious source/meta/custom output cannot escape the chosen HTML/SVG boundary; security fixtures pass | P0 executable markup injection | Extend the verified rejection fixtures into a general SVG sanitizer and URL policy |
| `MD-TASK-019` accessible preview semantics | `MD-A11Y-001` | 🌗 | remark-relgeo + website | renderer metadata; HTML contract | Generated preview has agreed role/name/description/wrapper semantics and no invalid nesting | P1 AT lacks preview context | Define semantics and assert HTML |
| `MD-TASK-020` accessible source/error semantics | `MD-A11Y-002` | 🌗 | both plugins + website | token semantics; AT plan | Source, tokens, errors, and fallback retain non-color meaning and semantic labels; automated assertions pass | P1 color-only/unclear errors | Add ARIA/semantic markup tests; schedule AT |
| `MD-TASK-021` contextual error boundary | `MD-ERR-001` | ✔️ | both plugins | error model; source locations | One bad block yields contextual safe output while other blocks remain usable; highlighter service failure is contained | P0 whole docs build failure | Closed with per-block fallback and isolation tests |
| `MD-TASK-022` stable version error projection | `MD-ERR-002` | 🌗 | remark-relgeo + spec/core | compatibility matrix; error codes | Active/legacy/future cases expose stable category/code and preserve source context | P1 migration messaging drift | Add projection tests |
| `MD-TASK-023` typed runtime/render failure mapping | `MD-ERR-003` | 🌗 | remark-relgeo + core/renderer | runtime diagnostics; sanitizer | Render failure has typed safe fallback, no partial unsafe markup, and actionable evidence | P1 opaque failure/debugging | Extend typed adapter projection to the core error taxonomy and non-fatal runtime diagnostics |
| `MD-TASK-024` website provenance/version assertions | `MD-WEB-003` | ✔️ | website + spec/package owners | compatibility metadata; release process | Build fails or reports when site provenance/version line disagrees with package/matrix | P1 site overclaims capability | Closed with plugin markers and localized build assertions |
| `MD-TASK-025` public route/readability evidence | `MD-WEB-004` | 🌗 | website owner | route/base; accessibility QA | EN/ID routes, public smoke, responsive technical surface, and scheduled AT checks are recorded | P1 public readers see regressions | Run public smoke; schedule mobile/AT |
| `MD-TASK-026` independent package documentation and smoke | `MD-REL-001` | 🌗 | each package owner | release docs; clean consumer | Fresh consumer follows README ordering/options/errors; package smoke and docs checks pass | P1 adopters use incomplete API | Complete docs and temporary consumer |
| `MD-TASK-027` reproducible package export surface | `MD-SSR-004` | 🌗 | both package owners | pack/install; release metadata | Local packed fresh consumer resolves ESM/CJS/types for both plugins without workspace-relative dependencies; registry parity remains separate | P0 published consumer cannot install/use API | Run clean pack/install temporary consumer and add regression |

## External verification follow-ups

These are not implementation-gap tasks; new evidence can upgrade the separate
`unverified-external` evidence state without changing the implementation result
unless the observed implementation also changes.

| Follow-up | Source ID | Priority | Scope | Owner | Dependency | Acceptance evidence | Risk | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `MD-VERIFY-001` generic unified/remark ordering smoke | `MD-SSR-003` | P1 | Alternate unified/remark/rehype host verification | package + website owners | standalone pipeline fixture | Fresh remark-parse → plugin ordering → remark-rehype/rehype-stringify run with documented order | P1 alternate hosts integrate incorrectly | Run and record clean-host result |
| `MD-VERIFY-002` clean registry/release parity | `MD-REL-002` | P0 | Published package/version/release-order verification | release/package owners | registry access; synchronized metadata | Clean pack/install or registry consumer proves version line and release order | P0 published packages drift | Run canonical release smoke |

## Handoff rules

1. Candidate tasks become implementation work only after owner, dependency,
   scope, and acceptance evidence are approved. A `✔️` row records a locally
   evidenced implementation closure, while the row remains in this register
   for traceability until the next backlog reconciliation.
2. Source changes and tests are required before a task can be marked complete;
   changing this backlog or matrix is not implementation evidence.
3. If implementation changes a boundary, update the expected catalog and
   reconciliation explicitly before changing status.
4. `➖` and `⏸️` must not be used to hide an absent capability.

## Source links

- [Expected capability catalog](./expected-capability-catalog.md)
- [Implementation audit](./implementation-audit.md)
- [Expected-versus-observed reconciliation](./reconciliation.md)
- [Status matrix](./status-matrix.md)
- [Historical capability matrix](./capability-matrix.md)
- [Maturation master plan](../../MATURATION-MASTER-PLAN.md)
- [Compatibility matrix](../../compatibility-matrix.json)
