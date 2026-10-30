# Website and Pages bounded in-scope selection

**Date:** 2026-10-30  
**Task:** `select-and-bound-in-scope-capability-debt--1183688132`  
**Status:** bounded active selection; selection is not implementation or
completion evidence  
**Owner boundary:** `relgeo.github.io` owns website presentation, editorial
navigation, browser-facing accessibility, metadata, and Pages artifact
assembly. `spec/id` owns normative DSL meaning; `spec/en`, Playground,
Markdown plugins, CLI, and the public Pages host remain explicit collaborators
or separate verification owners where named below.

## Decision

This tranche selects six actionable gaps from the expected capability catalog,
implementation audit, status/reconciliation view, and implementation-gap
backlog. It is bounded to website-local discovery, language/reference
coverage, browser accessibility evidence, deployment-aware metadata, and local
artifact provenance. The selection can be implemented or verified without a
production deployment change.

The selection does not include the already-green navigation/orientation rows
(`WEB-PAGE-002` and `WEB-PAGE-008`) as new debt. It also does not turn public
DNS, a GitHub Actions run, a hosted Playground smoke, or an approved child
revision into an assumed prerequisite. Those boundaries remain explicit in the
excluded-work table below. Capability symbols are preserved from the current
status matrix; this record does not promote any row to `✔️`.

## Evidence and selection inputs

| Input | Role in this selection |
| --- | --- |
| [Expected capability catalog](./expected-capability-catalog.md) | Defines the expected user outcomes, owner/source-of-truth paths, and website-versus-spec/child-surface boundaries. |
| [Implementation audit](./implementation-audit.md) | Records the observed route, content, layout, test, artifact, and environment evidence used to identify actionable gaps. |
| [Status matrix](./status-matrix.md) and [reconciliation](./reconciliation.md) | Supplies the current honest status symbol and keeps implementation, evidence, and scope dimensions separate. |
| [Implementation-gap backlog](./implementation-gap-backlog.md) | Supplies the candidate task IDs, owners, dependencies, work types, and acceptance/evidence targets. |
| [`relgeo.github.io/`](../../../relgeo.github.io/) | Website source, content, layout, Astro configuration, build assertions, Pages workflow, and public-smoke boundary. |

## Bounded active selection

Each row has one expected capability ID, one backlog candidate, an owner,
source-of-truth path, observed implementation/test paths, contract boundary,
and explicit acceptance behavior. Dependencies are sequencing constraints, not
additional scope.

| Selected task / expected ID | Current status | Owner | Source of truth | Observed implementation / test paths | Contract boundary | Explicit acceptance behavior |
| --- | --- | --- | --- | --- | --- | --- |
| `GAP-WEB-003-SEARCH-001` — search and reference wayfinding (`WEB-PAGE-003`) | `🌗` | Website docs/information-architecture owner | [`expected-capability-catalog.md`](./expected-capability-catalog.md) (`WEB-PAGE-003`); [`implementation-audit.md`](./implementation-audit.md) §4–§7; [`implementation-gap-backlog.md`](./implementation-gap-backlog.md) `GAP-WEB-003-SEARCH-001` | [`relgeo.github.io/src/pages/[lang]/docs/index.astro`](../../../relgeo.github.io/src/pages/%5Blang%5D/docs/index.astro); [`relgeo.github.io/src/pages/[lang]/docs/language-spec/index.astro`](../../../relgeo.github.io/src/pages/%5Blang%5D/docs/language-spec/index.astro); [`relgeo.github.io/src/layouts/DocsLayout.astro`](../../../relgeo.github.io/src/layouts/DocsLayout.astro); [`relgeo.github.io/scripts/assert-built-output.mjs`](../../../relgeo.github.io/scripts/assert-built-output.mjs) | Website owns discovery context, deterministic index/filter UI, route links, and no-result behavior. It does not redefine spec semantics or implement CLI/runtime search. | The selected local contract is a deterministic localized topic index with client-side filtering, live result status, and explicit no-result behavior; focused built-output assertions pass. Query/server search and browser interaction remain visible follow-up boundaries, so status is `🌗`. |
| `GAP-WEB-004-LOCALE-001` — honest bilingual language behavior (`WEB-PAGE-004`) | `🌗` | Website editorial owner with `spec` owner | [`expected-capability-catalog.md`](./expected-capability-catalog.md) (`WEB-PAGE-004`); [`implementation-audit.md`](./implementation-audit.md) §4–§6; [`relgeo.github.io/src/content/docs/id/language-status.md`](../../../relgeo.github.io/src/content/docs/id/language-status.md); [`spec/en/README.md`](../../../spec/en/README.md) | [`relgeo.github.io/src/content.config.ts`](../../../relgeo.github.io/src/content.config.ts); [`relgeo.github.io/src/lib/i18n.ts`](../../../relgeo.github.io/src/lib/i18n.ts); [`relgeo.github.io/src/pages/[lang]/docs/language-spec/[...slug].astro`](../../../relgeo.github.io/src/pages/%5Blang%5D/docs/language-spec/%5B...slug%5D.astro); [`relgeo.github.io/.github/workflows/pages.yml`](../../../relgeo.github.io/.github/workflows/pages.yml) | Website presents locale/status claims; `spec/id` remains normative. A translated `spec/en` and an honest mirror are different product contracts and must not be conflated. | An approved translation/mirror policy is visible to users; either `/en` renders reviewed English normative content with matching route context, or the UI explicitly discloses the Indonesian mirror and tests reject any false translation claim. |
| `GAP-WEB-005-REFERENCE-001` — bilingual docs/reference coverage (`WEB-PAGE-005`) | `🌗` | Website docs owner with spec/editorial reviewers | [`expected-capability-catalog.md`](./expected-capability-catalog.md) (`WEB-PAGE-005`); [`implementation-audit.md`](./implementation-audit.md) §2–§4; [`implementation-gap-backlog.md`](./implementation-gap-backlog.md) `GAP-WEB-005-REFERENCE-001` | [`relgeo.github.io/src/content/docs/id/`](../../../relgeo.github.io/src/content/docs/id/); [`relgeo.github.io/src/content/docs/en/`](../../../relgeo.github.io/src/content/docs/en/); [`relgeo.github.io/src/pages/[lang]/docs/[...slug].astro`](../../../relgeo.github.io/src/pages/%5Blang%5D/docs/%5B...slug%5D.astro); [`relgeo.github.io/src/pages/[lang]/docs/index.astro`](../../../relgeo.github.io/src/pages/%5Blang%5D/docs/index.astro) | Website owns editorial docs routes and reading paths. Normative language meaning and translation content remain with the corresponding spec owner; missing content cannot be disguised as parity by a route shell. | Every declared English docs/spec route has reviewed content or an explicit status/placeholder affordance; locale coverage and internal-link checks pass on generated output, with no route claiming complete parity when content is absent. |
| `GAP-WEB-010-A11Y-001` — browser accessibility and keyboard evidence (`WEB-PAGE-010`) | `🌗` | Website quality/accessibility owner; Playground is responsible for its own workbench controls | [`expected-capability-catalog.md`](./expected-capability-catalog.md) (`WEB-PAGE-010`); [`implementation-audit.md`](./implementation-audit.md) §3–§5; [`implementation-gap-backlog.md`](./implementation-gap-backlog.md) `GAP-WEB-010-A11Y-001` | [`relgeo.github.io/src/layouts/DocsLayout.astro`](../../../relgeo.github.io/src/layouts/DocsLayout.astro); [`relgeo.github.io/src/styles/accessibility.css`](../../../relgeo.github.io/src/styles/accessibility.css); [`relgeo.github.io/scripts/assert-built-output.mjs`](../../../relgeo.github.io/scripts/assert-built-output.mjs) | Website owns page landmarks, names, focus, keyboard order, locale/navigation state, code/spec semantics, and reduced-motion behavior. Physical VoiceOver/TalkBack, mobile AT, and Playground internals remain separate evidence/owner boundaries. | Browser AX/DOM and keyboard checks cover landmarks, names, active locale, visible focus, reading order, reduced motion, and non-pointer access on representative routes; failures are recorded by route/component and no physical-AT pass is inferred. |
| `GAP-WEB-011-SEO-001` — deployment-aware metadata and crawlability (`WEB-PAGE-011`) | `🌗` | `relgeo.github.io` website/build owner | [`expected-capability-catalog.md`](./expected-capability-catalog.md) (`WEB-PAGE-011`); [`implementation-audit.md`](./implementation-audit.md) §4–§7; [`relgeo.github.io/astro.config.mjs`](../../../relgeo.github.io/astro.config.mjs); [`relgeo.github.io/src/pages/sitemap.xml.ts`](../../../relgeo.github.io/src/pages/sitemap.xml.ts) | [`relgeo.github.io/src/layouts/DocsLayout.astro`](../../../relgeo.github.io/src/layouts/DocsLayout.astro); [`relgeo.github.io/src/pages/sitemap.xml.ts`](../../../relgeo.github.io/src/pages/sitemap.xml.ts); [`relgeo.github.io/scripts/assert-built-output.mjs`](../../../relgeo.github.io/scripts/assert-built-output.mjs) | Website owns static metadata, canonical/hreflang/base URL generation, sitemap, and crawlable rendered content. Social-card enhancement and external crawler infrastructure are outside this tranche. | A deployment build fails on placeholder/invalid site URL; generated canonical, alternate, and sitemap URLs use `relgeo.github.io` and the configured base path; a local route/content check proves important content is crawlable. |
| `GAP-WEB-012-ARTIFACT-001` — local generated-artifact provenance (`WEB-PAGE-012`) | `🌗` | Website deployment owner with root integration owner | [`expected-capability-catalog.md`](./expected-capability-catalog.md) (`WEB-PAGE-012`); [`implementation-audit.md`](./implementation-audit.md) §4–§7; [`docs/integration-baseline.json`](../../integration-baseline.json); [`implementation-gap-backlog.md`](./implementation-gap-backlog.md) `GAP-WEB-012-ARTIFACT-001` | [`relgeo.github.io/scripts/assert-pages-artifact.mjs`](../../../relgeo.github.io/scripts/assert-pages-artifact.mjs); [`relgeo.github.io/scripts/assert-built-output.mjs`](../../../relgeo.github.io/scripts/assert-built-output.mjs); [`relgeo.github.io/.github/workflows/pages.yml`](../../../relgeo.github.io/.github/workflows/pages.yml); root `playground` gitlink | Website assembles and asserts the static artifact; root coordinates child revisions. Playground behavior, spec semantics, and deployment execution are not reimplemented here. | For one explicitly approved local input set, root gitlink, integration baseline, Pages pin, spec input, and generated artifact report the same revisions; clean local build plus combined artifact assertion passes. No deployment or public smoke result is claimed. |

## Sequencing and dependency boundary

1. Establish the search/wayfinding and locale/reference decisions before
   changing route or content claims (`GAP-WEB-003`, `004`, `005`).
2. Run the accessibility and SEO checks against the resulting local artifact
   (`GAP-WEB-010`, `011`).
3. Reconcile and assert local artifact provenance (`GAP-WEB-012`) using an
   approved revision set; this is a local gate, not a publish step.

These are sequencing constraints, not extra scope. The selected work does not
require a production deployment, a GitHub Actions run, public DNS, hosted
Playground interaction, registry publication, or physical assistive technology.

## Deliberately excluded from active implementation

| Excluded item | Status | Reason |
| --- | --- | --- |
| `GAP-WEB-007-HANDOFF-001` / `WEB-PAGE-007` | `🌗` | Hosted Playground interaction and current pinned-runtime smoke cross the public/child-runtime boundary; local links and artifact assertions remain evidence inputs, not a hosted pass. |
| `GAP-WEB-009-RESPONSIVE-001` / `WEB-PAGE-009` | `🌗` | Current viewport-matrix evidence is a separate browser-verification tranche and is not needed to bound the selected documentation, accessibility, SEO, and artifact contracts. |
| `GAP-WEB-013-PAGES-001` / `WEB-PAGE-013` | `🌗` | Canonical Pages deployment verification requires a workflow run and deployment result; no release change is authorized by this task. |
| `GAP-WEB-014-SMOKE-001` / `WEB-PAGE-014` | `🌗` | Public route/asset smoke is environment- and deployment-dependent; the audit correctly records DNS failure as unavailable evidence. |
| `GAP-WEB-015-STATUS-001` / `WEB-PAGE-015` | `🌗` | Public claim consistency follows the locale decision and artifact pin reconciliation; it remains a visible follow-up rather than a second provenance implementation in this tranche. |
| `WEB-PAGE-002` and `WEB-PAGE-008` | `✔️` | Navigation/orientation are already locally implemented; no active debt is inferred from broader evidence that still needs later verification. |
| Physical VoiceOver/TalkBack/mobile AT evidence under `WEB-PAGE-010` | deferred external evidence | The whole capability remains `🌗`; this sub-boundary is explicitly deferred and is not converted into `⏸️` or active implementation. |
| Any `➖` or `⏸️` capability | `➖` / `⏸️` | No such website row exists in the current matrix; if one is introduced by a later scope decision, it must remain outside active implementation. |

No `➖` or `⏸️` item is treated as active implementation work.

## Status accounting

| Check | Result |
| --- | ---: |
| Selected capability IDs | 6 |
| Selected `❌` rows | 0 |
| Selected `🌗` rows | 6 (`WEB-PAGE-003`, `004`, `005`, `010`, `011`, `012`) |
| Selected `⚠️` rows | 0 |
| Selected `➖` or `⏸️` rows | 0 |
| Selected IDs with owner, source path, boundary, and acceptance behavior | 6/6 |

The symbols above are the current status-matrix intake values, not completion
claims. Changing this record or the backlog is not implementation evidence; each
selected row requires focused source/content/test evidence and a fresh audit,
reconciliation, and status-matrix review before its symbol changes.
