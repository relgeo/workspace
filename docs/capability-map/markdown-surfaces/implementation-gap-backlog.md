# Markdown Surfaces Implementation-Gap Backlog

**Date:** 2026-10-30
**Status:** candidate goal/task register; no row here counts as implementation
**Sources:** [status matrix](./status-matrix.md) and [expected-versus-observed reconciliation](./reconciliation.md)

This backlog turns every expected capability with an implementation gap into
one candidate implementation task: all `❌`/`⚠️` rows and the `🌗` rows whose
audit identifies missing implementation or contract behavior. The task
descriptions are not active SuClos goals until owner, scope, dependency, and
acceptance evidence are approved. The two `🌗` rows whose remaining issue is
external evidence only are verification follow-ups, not implementation gaps.

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
| `🌗` tasks | 22 |
| `❌` tasks | 4 |
| `⚠️` tasks | 1 |
| Missing source IDs | 0 |
| Duplicate source IDs | 0 |

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
| `MD-TASK-001` shared fence alias contract | `MD-FENCE-001` | 🌗 | both plugin owners | terminology/spec naming | Both plugins accept the agreed aliases, skip non-RelGeo fences, and pass alias matrix tests | P1 wrong fence surface | Decide alias set and add tests |
| `MD-TASK-002` source/metadata preservation fixtures | `MD-FENCE-002` | 🌗 | both plugin owners | unified mdast/hast contract | Real remark/rehype fixtures preserve info, whitespace, source fallback, and adjacent nodes | P1 source loss/copy regression | Add pipeline fixture suite |
| `MD-TASK-003` mixed-block determinism | `MD-FENCE-003` | 🌗 | both plugin owners | visitor isolation; deterministic build | Repeated mixed RelGeo/non-RelGeo blocks preserve order and isolated output across two builds | P1 cross-block contamination | Add multi-block conformance fixture |
| `MD-TASK-004` preview presentation option contract | `MD-PREVIEW-002` | 🌗 | remark-relgeo + renderer owner | views/sheets/profile spec | Tests prove default model output and explicit supported sheet/view/profile behavior | P1 author selects a view that is ignored | Define option schema and fixtures |
| `MD-TASK-005` clean preview wrapper integration | `MD-PREVIEW-004` | 🌗 | remark-relgeo + website | rehype unwrap helper | Built HTML has the intended wrapper without `pre > div`; surrounding Markdown assertions pass | P1 structural/a11y defect | Align output class and unwrap rule |
| `MD-TASK-006` highlighter service-failure fallback | `MD-HL-002` | ⚠️ | remark-relgeo-hl + language-service | token service error boundary | Injected token-service failure returns original source/safe code block and transform succeeds | P0 docs build crash | Add catch and failure-injection test |
| `MD-TASK-007` lexical fallback isolation | `MD-HL-004` | 🌗 | remark-relgeo-hl + language-service | lexical token contract | Invalid/incomplete source remains readable without renderer/core resolution; service failure has bounded fallback | P1 highlighter depends on semantic service availability | Define fallback mode and fixture |
| `MD-TASK-008` structured Markdown diagnostic DTO | `MD-DIAG-001` | ❌ | both plugins + spec/core | error model; block location | Output exposes stable code, severity, message, and source/block location with serialization tests | P1 failures not traceable | Draft DTO and owner mapping |
| `MD-TASK-009` actionable diagnostic fallback | `MD-DIAG-002` | 🌗 | remark-relgeo + website | diagnostic DTO; host UI | Invalid preview produces structured payload plus readable source/fallback and website assertion | P1 reader cannot recover | Implement projection and host fixture |
| `MD-TASK-010` non-fatal preview diagnostics | `MD-DIAG-003` | ❌ | remark-relgeo + core | runtime diagnostics API | Runtime warning fixture returns valid preview plus diagnostic without dropping output | P1 useful preview disappears | Define tolerant result shape |
| `MD-TASK-011` strict/tolerant policy option | `MD-DIAG-004` | ❌ | remark-relgeo + build owner | error policy; build gate | Strict mode fails deterministically; tolerant mode emits fallback/diagnostic; defaults documented | P1 implicit build behavior | Implement policy option and tests |
| `MD-TASK-012` option schema and invalid-value validation | `MD-OPT-001` | 🌗 | both package owners | public API docs; compatibility policy | README/types/defaults match runtime; unknown and invalid options have tested behavior | P1 undocumented integration drift | Publish option table and tests |
| `MD-TASK-013` version/view/profile pass-through | `MD-OPT-002` | 🌗 | remark-relgeo + spec/core | version/presentation APIs | Supported version/profile/view/sheet combinations are explicit; future version has stable error projection | P1 wrong preset/migration messaging | Decide supported option surface |
| `MD-TASK-014` safe output and asset configuration | `MD-OPT-003` | 🌗 | both package owners + website | asset policy; sanitizer boundary | Class/output customization is bounded, asset/base strategy is explicit, and custom hook safety is tested | P0 unsafe/non-portable output | Define trusted hook or sanitize |
| `MD-TASK-015` caller-selected fallback policy | `MD-OPT-004` | ❌ | remark-relgeo | diagnostic policy; build owner | Caller can select fallback/warning or hard failure and tests prove both paths | P1 CI policy cannot be chosen | Add explicit option and docs |
| `MD-TASK-016` standalone SSR pipeline | `MD-SSR-001` | 🌗 | both package owners | Node runtime; unified ordering | Generic non-Astro unified/SSR fixture runs without browser globals and records output | P1 alternate host failure | Add standalone pipeline test |
| `MD-TASK-017` configurable asset URL mode | `MD-ASSET-001` | 🌗 | remark-relgeo + website | Pages/base policy | Inline/default and any selected alternate asset mode produce correct local and Pages output | P1 large/alternate-host preview issue | Decide asset strategy and test |
| `MD-TASK-018` generated-output sanitization policy | `MD-ASSET-003` | 🌗 | both plugins + renderer/host | SVG sanitizer; URL policy | Malicious source/meta/custom output cannot escape the chosen HTML/SVG boundary; security fixtures pass | P0 executable markup injection | Define trust boundary and tests |
| `MD-TASK-019` accessible preview semantics | `MD-A11Y-001` | 🌗 | remark-relgeo + website | renderer metadata; HTML contract | Generated preview has agreed role/name/description/wrapper semantics and no invalid nesting | P1 AT lacks preview context | Define semantics and assert HTML |
| `MD-TASK-020` accessible source/error semantics | `MD-A11Y-002` | 🌗 | both plugins + website | token semantics; AT plan | Source, tokens, errors, and fallback retain non-color meaning and semantic labels; automated assertions pass | P1 color-only/unclear errors | Add ARIA/semantic markup tests; schedule AT |
| `MD-TASK-021` contextual error boundary | `MD-ERR-001` | 🌗 | both plugins | error model; source locations | One bad block yields contextual safe output while other blocks remain usable; highlighter service failure is contained | P0 whole docs build failure | Implement shared failure boundary |
| `MD-TASK-022` stable version error projection | `MD-ERR-002` | 🌗 | remark-relgeo + spec/core | compatibility matrix; error codes | Active/legacy/future cases expose stable category/code and preserve source context | P1 migration messaging drift | Add projection tests |
| `MD-TASK-023` typed runtime/render failure mapping | `MD-ERR-003` | 🌗 | remark-relgeo + core/renderer | runtime diagnostics; sanitizer | Render failure has typed safe fallback, no partial unsafe markup, and actionable evidence | P1 opaque failure/debugging | Add typed failure projection |
| `MD-TASK-024` website provenance/version assertions | `MD-WEB-003` | 🌗 | website + spec/package owners | compatibility metadata; release process | Build fails or reports when site provenance/version line disagrees with package/matrix | P1 site overclaims capability | Add content/build assertion |
| `MD-TASK-025` public route/readability evidence | `MD-WEB-004` | 🌗 | website owner | route/base; accessibility QA | EN/ID routes, public smoke, responsive technical surface, and scheduled AT checks are recorded | P1 public readers see regressions | Run public smoke; schedule mobile/AT |
| `MD-TASK-026` independent package documentation and smoke | `MD-REL-001` | 🌗 | each package owner | release docs; clean consumer | Fresh consumer follows README ordering/options/errors; package smoke and docs checks pass | P1 adopters use incomplete API | Complete docs and temporary consumer |
| `MD-TASK-027` reproducible package export surface | `MD-SSR-004` | 🌗 | both package owners | pack/install; release metadata | Fresh consumer resolves ESM/CJS/types and follows documented exports without workspace-relative dependencies | P0 published consumer cannot install/use API | Run clean pack/install temporary consumer and add regression |

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
   scope, and acceptance evidence are approved.
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
