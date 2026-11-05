# Website and Pages Expected-versus-Observed Reconciliation

**Reconciliation date:** 2026-11-04
**Expected source:** [`website-pages/expected-capability-catalog.md`](./expected-capability-catalog.md)  
**Observed source:** [`website-pages/implementation-audit.md`](./implementation-audit.md)  
**Policy sources:** [`MATURATION-MASTER-PLAN.md`](../../MATURATION-MASTER-PLAN.md), [`REPOSITORY-MAP.md`](../../REPOSITORY-MAP.md), [`05-public-docs-and-playground-hardening.md`](../../plans/05-public-docs-and-playground-hardening.md), [`integration-baseline.json`](../../integration-baseline.json)  
**Owner boundary:** `relgeo.github.io` owns website presentation and Pages delivery; `spec/id` owns normative DSL meaning; Playground, CLI, and Markdown plugins own their runtime behavior.

**Downstream views:** [status matrix](./status-matrix.md) ·
[implementation-gap backlog](./implementation-gap-backlog.md) ·
[coverage validation and handoff](./coverage-validation-handoff.md)

**Current consumer-boundary checkpoint (2026-11-04):** website and Playground
local consumers pass their direct build/test assertions. The current checked-out
website/Playground/spec revisions do not match the recorded baseline and Pages
pins, so strict provenance and assembled-artifact parity remain unverified.

## 1. Reconciliation rule

This document is the explicit one-to-one join between the expected catalog and
the implementation audit. The expected catalog was completed before the audit;
the audit is the only source for observed implementation findings. No row is
removed because implementation is missing or because evidence is unavailable.

The columns intentionally separate three questions:

| Column | Meaning |
| --- | --- |
| `Reconciliation result` | Whether the complete expected user outcome is satisfied at the audited boundary. `❌` means the expected outcome is not present in full; it is not converted to `➖` because evidence or implementation is missing. |
| `Implementation status` | The status reported by the audit: `implemented`, `partial`, `absent`, `broken`, `deferred`, or `not applicable`. |
| `Evidence status` | The strength and environment of evidence: `verified-local`, `observed-local`, `unverified-public`, `environment-unavailable`, or `deferred-external`. |
| `Scope / owner decision` | Whether the capability remains in scope, is an explicit boundary, or requires a product decision. |

`✔️` means the expected outcome is implemented at the local audited boundary;
it does not turn unavailable public evidence into a public pass. `🌗` means
some implementation exists but the expected outcome or its evidence is
incomplete. `❌` is reserved for an expected outcome that is not present in
full. `➖` is reserved for a genuinely not-applicable expected row; none of
these 15 in-scope rows qualify. `⏸️` would mean an intentionally deferred
capability, not a missing one; no whole expected row is deferred.

## 2. Coverage validation

| Join check | Result |
| --- | ---: |
| Expected catalog rows | 15 |
| Reconciliation rows | 15 |
| Expected IDs missing from reconciliation | 0 |
| Observed-only IDs added to reconciliation | 0 |
| Duplicate reconciliation IDs | 0 |
| `✔️` complete at local boundary | 4 |
| `🌗` partial or evidence-boundary result | 11 |
| `❌` expected outcome absent in full | 0 |
| `➖` not applicable | 0 |

`WEB-PAGE-003` is now `🌗`: the selected local baseline implements a
deterministic localized topic index, client-side filtering, live result status,
and an explicit no-result affordance. Query/server search and browser
interaction evidence remain outside the local closure claim.

### Status assignment coverage

Each expected row receives exactly one project status symbol in the
`Reconciliation result` column. Evidence strength is recorded separately and
does not change the symbol.

| Status symbol | Count | Assigned IDs |
| --- | ---: | --- |
| `✔️` | 4 | `WEB-PAGE-001`, `002`, `006`, `008` |
| `🌗` | 11 | `WEB-PAGE-003`, `004`, `005`, `007`, `009`, `010`, `011`, `012`, `013`, `014`, `015` |
| `❌` | 0 | None |
| `➖` | 0 | None; every catalog row is in scope |
| `⏸️` | 0 | None; deferred physical evidence is not a whole-capability deferral |
| `⚠️` | 0 | None; no scoped defect was demonstrated by the audit |

The fresh local checkpoints recorded in audit §5 (website build/check/test,
Playground build/test, provenance reporting, and combined artifact assertions
on 2026-10-30) support the evidence column only. They do not change public,
CI, deployment, or device evidence states.

## 3. Contract lock for selected P0/P1 gaps — 2026-11-04

This register locks the acceptance boundary before implementation work. It is
derived from the expected catalog, the selected rows in the [implementation-gap
backlog](./implementation-gap-backlog.md#p0p1-implementation-closability-triage),
the [compatibility matrix](../../compatibility-matrix.json), and the
[inventory protocol](../INVENTORY-PROTOCOL.md). It does not add a public DSL,
package, or runtime contract.

### Compatibility and ownership guardrails

- The active language contract remains DSL `0.5`; public package compatibility
  remains `0.5.x`, and the website consumer remains `relgeo.github.io` `0.5.0`
  on compatibility line `0.5`.
- `spec/id` remains the normative source for language meaning. The website
  owns presentation, editorial navigation, browser-facing page quality,
  metadata, and Pages artifact assembly; Playground, CLI, and Markdown plugin
  behavior remains owned by those consumers.
- A website acceptance pass is local evidence only. CI/canonical, deployed,
  public, and physical-AT evidence must remain separate and use `not verified`
  or `deferred-external` when unavailable. A breaking language-contract change
  would require the compatibility matrix's next line and a decision record;
  none is introduced by this tranche.

### Locked acceptance register

| ID / owner | Contract boundary and source of truth | Success behavior | Failure / edge behavior | Expected evidence |
| --- | --- | --- | --- | --- |
| `WEB-PAGE-003` — website docs/information architecture | Deterministic localized topic index only; catalog row and `claim-locale-provenance-contract.md`; `relgeo.github.io/src/pages/[lang]/docs/index.astro` | Render topic context and direct route links; filtering updates live result status and exposes a useful no-result state. | Empty, whitespace, or unmatched queries remain explicit no-result states; route links stay local/base-safe. Query/server search and runtime semantic search are not implied. | `relgeo.github.io`: `pnpm build && pnpm test`; built-output assertions for index/filter/status/no-result. Browser interaction remains separately unverified. |
| `WEB-PAGE-004` — website editorial owner + spec owner | Locale presentation and mirror disclosure; `spec/id` remains normative; `src/content.config.ts`, `src/lib/i18n.ts`, and `LanguageStatusNotice.astro` | `/id` and `/en` preserve equivalent route context where available; `/en` clearly identifies the language-spec surface as an editorial mirror and links users to `/id`. | Missing English normative parity must not be rendered or described as a translation; an unsupported/missing locale or content entry must retain an explicit status/route error rather than silently changing semantic source. | `relgeo.github.io`: `pnpm check && pnpm build && pnpm test`; generated route and mirror-disclosure assertions. Translation parity remains a separate reviewed spec decision. |
| `WEB-PAGE-005` — website docs owner + spec/editorial reviewers | Editorial docs/reference route coverage; `relgeo.github.io/src/content/docs/{id,en}/` and localized route templates; normative meaning stays in `spec/id`. | Declared onboarding, capability, use-case, CLI, Playground, Markdown, status, docs, and spec surfaces are reachable, and English editorial content is distinguishable from the authoritative reference. | A missing locale entry or internal target must fail the locale-coverage/link acceptance or expose an explicit status affordance; no route may imply complete bilingual normative parity from a shell alone. | `relgeo.github.io`: `pnpm build && pnpm test` plus locale-coverage/internal-link assertions on generated output. The checker/report is local evidence, not public crawl evidence. |
| `WEB-PAGE-007` — website handoff owner; child runtimes retain behavior ownership | Website discovery/copy, configured base-path links, Markdown `rg`/`relgeo` distinction, and assembled Playground artifact; `playground`/plugins remain behavior sources. | Relevant docs/CTA links resolve under the configured base path; assembled artifact contains the Playground entry and the documented `edit → resolve → preview → inspect` handoff. | Out-of-base/broken links, missing entrypoint, missing artifact markers, or misleading source/preview claims fail the local gate; hosted Playground interaction is not inferred. | Website build + Playground build + assembled `pnpm run test:pages-artifact`; hosted browser smoke is `unverified-public`. |
| `WEB-PAGE-009` — website layout owner; Playground owns workbench layout | Browser responsive contract in `relgeo.github.io/src/styles/site.css` and `assert-built-output.mjs`; physical-device behavior is out of this acceptance boundary. | At 640/899/900px thresholds, content/code columns can shrink, narrow navigation remains usable/contained, and focus styles remain visible without page-level horizontal overflow. | Clipping, accidental wrapping, body-level overflow, or lost focus styles fail the source/build gate; missing viewport runner evidence is `not verified`, not a product failure. | `relgeo.github.io`: `pnpm build && pnpm run test:responsive-accessibility`; named 640/899/900px browser matrix when a stable runner is available. |
| `WEB-PAGE-010` — website accessibility owner; Playground owns workbench controls | Browser accessibility shell in `DocsLayout.astro`, `accessibility.css`, and built assertions; physical VoiceOver/TalkBack/mobile AT is explicitly deferred. | Representative routes expose landmarks, names, active locale/navigation state, keyboard order, visible focus, reduced-motion behavior, and equivalent non-pointer access. | Missing label/landmark/focus/state, unusable keyboard path, or a localized no-result state without announcement fails the browser acceptance; physical-AT absence remains `deferred-external`. | `relgeo.github.io`: `pnpm build && pnpm run test:responsive-accessibility` plus representative browser AX/keyboard checks. No physical-AT pass is inferred. |
| `WEB-PAGE-011` — website/build owner | Deployment-aware static metadata and crawlability in `astro.config.mjs`, `DocsLayout.astro`, and `sitemap.xml.ts`; public URL configuration is the source for emitted origin/base. | With `RELGEO_DOCS_SITE_URL=https://relgeo.github.io`, generated canonical, alternates, sitemap, and rendered HTML use the configured base and remain crawlable. | Public-gate builds fail closed on placeholder/invalid site URL; missing external crawler or search-engine evidence remains `unverified-public`, not a local implementation defect. | `RELGEO_DOCS_SITE_URL=https://relgeo.github.io pnpm build && pnpm test`; generated metadata/sitemap inspection. External crawler remains separate. |
| `WEB-PAGE-012` — website deployment owner + root integration owner | Reproducible local artifact/provenance join across root baseline, website, `spec/id`, Playground, Pages pins, and assembled `dist`; `docs/integration-baseline.json` and provenance/artifact scripts are authoritative. | For one synchronized tuple, provenance reports no mismatches and the assembled artifact contains expected routes/assets and Playground provenance. | Revision drift, missing pinned input, stale provenance, standalone-site artifact without required Playground, or mismatch fails closed; local pass does not claim CI/Pages/public parity. | `relgeo.github.io`: `pnpm provenance:check`; `RELGEO_PLAYGROUND_ROOT=../playground RELGEO_SPEC_ROOT=../spec pnpm provenance:pages`; assembled `pnpm run test:pages-artifact`. |

The acceptance register intentionally keeps the selected rows partial where
their broader outcome depends on external evidence or a separate decision.
Implementation may close only the named local boundary; a new public contract
requires updating its authoritative source first and then revisiting the
catalog, reconciliation, matrix, and backlog together.

## 4. One-to-one reconciliation register

| ID | Reconciliation result | Implementation status | Evidence status | Scope / owner decision | Observed finding and audit trace |
| --- | --- | --- | --- | --- | --- |
| `WEB-PAGE-001` | `✔️` implemented at local route-generation boundary | `implemented` | `verified-local` for generation; `unverified-public` for reachability | In scope; website owns route/content presentation and public route contract | Local build emitted 138 pages for gateway, localized, docs, spec, legacy, and Playground-handoff surfaces. Public probes were blocked by DNS. Audit §4 row `WEB-PAGE-001`; §5 build/test; `relgeo.github.io/src/pages/`. |
| `WEB-PAGE-002` | `✔️` implemented at local navigation boundary | `implemented` | `verified-local` for selected assertions; broader traversal `observed-local` | In scope; website owns global/contextual navigation and location state | Shared layout, active route state, language switcher, docs groups, spec sidebar, and return/CTA links are present. Audit §4 row `WEB-PAGE-002`; `DocsLayout.astro`; localized docs/spec templates. |
| `WEB-PAGE-003` | `🌗` deterministic local baseline implemented; query/server search not claimed | `partial` | `verified-local` | In scope; website owns the deterministic discovery surface, while any query-search expansion remains a product decision | Localized docs indexes expose topic context, route links, client-side filtering, live result status, and no-result behavior. Audit §4/§5 row `WEB-PAGE-003`; `docs/index.astro`; built-output assertions. |
| `WEB-PAGE-004` | `🌗` localization shell exists; English language-spec route is an editorial mirror | `partial` | `verified-local` for route shell and disclosure; content parity incomplete | In scope; website owns localized presentation, `spec/id` remains semantic authority, and full English normative parity is not claimed | `id`/`en` routes, switcher, metadata, and the mirror notice exist; Pages loads `spec/id` for both language routes. Audit §4 row `WEB-PAGE-004`; `src/content.config.ts`; `LanguageStatusNotice.astro`. |
| `WEB-PAGE-005` | `🌗` documentation/reference surface is present but bilingual normative completeness is partial | `partial` | `verified-local` for generated docs and mirror affordance; `observed-local` for content boundary | In scope; website presents docs, `spec` owns normative meaning, and English editorial content must remain distinguishable from it | Onboarding, capability, use-case, CLI, Playground, Markdown, status, docs, and spec routes exist; English language-spec presentation remains an editorial mirror. Audit §4 row `WEB-PAGE-005`; site/docs/spec collections and build assertions. |
| `WEB-PAGE-006` | `✔️` implemented at local learning-example boundary | `implemented` | `verified-local` | In scope; website owns editorial examples; child surfaces own runtime semantics | Getting Started, CLI, Playground, Markdown, capability, and status examples are present and selected rendered markers pass. Audit §4 row `WEB-PAGE-006`; `pnpm test`; site content. |
| `WEB-PAGE-007` | `🌗` links/embed handoff exists; cross-surface runtime proof is incomplete | `partial` | `verified-local` for assembly; `unverified-public` for hosted handoff | In scope; website owns discovery/copy, Playground and plugins own behavior | `/playground/` links, Markdown `rg`/`relgeo` output, and Pages artifact assembly exist. Hosted Playground interaction and current pinned runtime were not publicly verified. Audit §4 row `WEB-PAGE-007`; Pages artifact assertion. |
| `WEB-PAGE-008` | `✔️` implemented as documentation and routing orientation | `implemented` | `observed-local` | In scope; website routes users, CLI/Playground/plugins own execution | Docs orient users to docs, CLI, Playground, Markdown, spec, and Desktop App; CLI page covers the required command intent. Audit §4 row `WEB-PAGE-008`; docs navigation and CLI page. |
| `WEB-PAGE-009` | `🌗` responsive source/build contract passes; complete viewport matrix is unverified | `implemented` | `verified-local` for CSS/build contract; current matrix `unverified` | In scope for browser web; physical handset behavior remains a deferred evidence boundary | Built gate asserts 640/899/900px breakpoints, containment, and narrow navigation; native Chrome rendered the local docs route, but the complete viewport matrix was unavailable on this host. Audit §4 row `WEB-PAGE-009`; `src/styles/site.css`; `assert-built-output.mjs`. |
| `WEB-PAGE-010` | `🌗` accessibility shell and representative AX smoke pass; complete interaction/AT evidence is incomplete | `partial` | `verified-local` for static plus native Chrome AX smoke; `deferred-external` for physical AT | In scope for browser accessibility; VoiceOver/TalkBack/mobile AT are explicitly deferred evidence | Skip link, landmarks, labels, focus, `aria-current`, reduced motion, and localized search states pass. English/Indonesian docs AX smoke verified labelled landmarks and keyboard skip-link focus; full traversal and physical AT remain open. Audit §4 row `WEB-PAGE-010`; `DocsLayout.astro`; accessibility styles/assertions. |
| `WEB-PAGE-011` | `🌗` metadata/sitemap exist; deployment URL correctness depends on configuration | `partial` | `verified-local` with deployment env; external crawl `unverified-public` | In scope; website owns metadata and crawlable static content | Canonical, alternates, descriptions, social metadata, icons, and sitemap are generated. Bare build defaults to `https://example.com`; no external crawler was available. Audit §4 row `WEB-PAGE-011`; `astro.config.mjs`; sitemap output. |
| `WEB-PAGE-012` | `🌗` local artifact assembly contract exists; current provenance parity is not synchronized | `implemented` | `verified-local` for fail-closed gate and direct builds; current artifact parity `unverified` | In scope; website workflow assembles artifact; root coordinates pinned inputs | The current website `1b9bb92f`, spec `f4fecf21`, and Playground `47fd7158` differ from the recorded baseline/Pages references (`6eb2e241`, `b96ba3b2`, `c7cec4b5`). The artifact gate rejects the unsynchronized report. Audit §4–§6; provenance/artifact assertions and integration baseline. |
| `WEB-PAGE-013` | `🌗` Pages workflow exists; current deployment execution/parity is unverified | `implemented` | `observed-local`; current CI/public deployment `unverified-public` | In scope; website owns Pages workflow, root owns revision coordination | Workflow pins Node/pnpm, Playground/spec, builds, uploads, deploys, and smoke-tests; no current workflow run was queried, and the checked-out inputs do not match the workflow pins. Audit §4–§6; `.github/workflows/pages.yml`. |
| `WEB-PAGE-014` | `🌗` release gates exist; public reliability signal is unavailable in this environment | `implemented` | `unverified-public`; `environment-unavailable` | In scope as recurring evidence; root/workflow owns gates, public deployment owns runtime observation | Artifact/built-output assertions pass locally and the smoke script declares 13 routes. The current smoke stopped at `/` after `fetch failed`; a direct curl confirmed HTTP 000/curl exit 6 because `relgeo.github.io` could not resolve. Audit §4–§5; `scripts/smoke-public-site.mjs`. |
| `WEB-PAGE-015` | `🌗` status/version copy is explicit; deployment consistency evidence is incomplete | `partial` | `verified-local` for explicit claims; current provenance synchronization and deployment `unverified-public` | In scope; website editorial surface owns claims, child repos and baseline own facts | Current Capabilities and Language Status distinguish DSL/package/application/source/deployment concepts. The baseline/Pages tuple is explicit, but current child revisions drift from it; CI/deployment/public evidence remains separate. Audit §4 and §6; status pages, claim contract, integration baseline. |

## 5. Gaps that are not status substitutions

These observations must not be used to collapse a missing implementation into a
non-applicable result or to treat unavailable evidence as a product pass:

| Observation | Correct interpretation |
| --- | --- |
| DNS could not resolve `relgeo.github.io` during the public probe | Evidence is `environment-unavailable` / `unverified-public`; it does not make a capability `❌`, and it does not prove public reliability. |
| Physical screen-reader, mobile assistive-technology, and handset evidence was not run | The evidence is `deferred-external` under the documented scope decision; the browser accessibility capability remains in scope. |
| Website does not own CLI, Playground, plugin, or normative spec execution | This is an ownership boundary. The website capability remains reconciled against its routing, presentation, and handoff obligations. |
| Historical frozen source tuple and integration baseline were synchronized | That historical local result does not establish parity for the current checked-out revisions, nor prove a Pages run, deployed artifact, or public-host reliability. |
| `WEB-PAGE-003` has a deterministic index/filter/no-result baseline but no query/server search | The implementation status remains partial: local discovery behavior is evidenced, but the broader query-search outcome and browser interaction evidence are not claimed. |

## 6. Handoff conclusion

The join is complete: all 15 expected catalog IDs have exactly one
reconciliation row, with zero missing, extra, or duplicate IDs. Four expected
outcomes are implemented at the local audited boundary, and eleven are partial
or blocked by a material evidence/provenance boundary. `WEB-PAGE-003` is now
one of those partial rows because its deterministic local baseline is
implemented while query/server search and browser interaction evidence remain
open.

No `➖` result is used: all 15 expected capabilities are in scope. Public DNS,
current Pages execution, revision parity, and physical assistive-technology
checks remain evidence or decision boundaries and are recorded in their own
columns rather than hidden in the implementation result.
