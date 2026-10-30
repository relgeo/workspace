# Website and Pages Expected-versus-Observed Reconciliation

**Reconciliation date:** 2026-10-30  
**Expected source:** [`website-pages/expected-capability-catalog.md`](./expected-capability-catalog.md)  
**Observed source:** [`website-pages/implementation-audit.md`](./implementation-audit.md)  
**Policy sources:** [`MATURATION-MASTER-PLAN.md`](../../MATURATION-MASTER-PLAN.md), [`REPOSITORY-MAP.md`](../../REPOSITORY-MAP.md), [`05-public-docs-and-playground-hardening.md`](../../plans/05-public-docs-and-playground-hardening.md), [`integration-baseline.json`](../../integration-baseline.json)  
**Owner boundary:** `relgeo.github.io` owns website presentation and Pages delivery; `spec/id` owns normative DSL meaning; Playground, CLI, and Markdown plugins own their runtime behavior.

**Downstream views:** [status matrix](./status-matrix.md) ·
[implementation-gap backlog](./implementation-gap-backlog.md) ·
[coverage validation and handoff](./coverage-validation-handoff.md)

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

## 3. One-to-one reconciliation register

| ID | Reconciliation result | Implementation status | Evidence status | Scope / owner decision | Observed finding and audit trace |
| --- | --- | --- | --- | --- | --- |
| `WEB-PAGE-001` | `✔️` implemented at local route-generation boundary | `implemented` | `verified-local` for generation; `unverified-public` for reachability | In scope; website owns route/content presentation and public route contract | Local build emitted 138 pages for gateway, localized, docs, spec, legacy, and Playground-handoff surfaces. Public probes were blocked by DNS. Audit §4 row `WEB-PAGE-001`; §5 build/test; `relgeo.github.io/src/pages/`. |
| `WEB-PAGE-002` | `✔️` implemented at local navigation boundary | `implemented` | `verified-local` for selected assertions; broader traversal `observed-local` | In scope; website owns global/contextual navigation and location state | Shared layout, active route state, language switcher, docs groups, spec sidebar, and return/CTA links are present. Audit §4 row `WEB-PAGE-002`; `DocsLayout.astro`; localized docs/spec templates. |
| `WEB-PAGE-003` | `🌗` deterministic local baseline implemented; query/server search not claimed | `partial` | `verified-local` | In scope; website owns the deterministic discovery surface, while any query-search expansion remains a product decision | Localized docs indexes expose topic context, route links, client-side filtering, live result status, and no-result behavior. Audit §4/§5 row `WEB-PAGE-003`; `docs/index.astro`; built-output assertions. |
| `WEB-PAGE-004` | `🌗` localization shell exists, language-spec parity incomplete | `partial` | `verified-local` for route shell; content parity incomplete | In scope; website owns localized presentation, `spec/id` remains semantic authority | `id`/`en` routes, switcher, and metadata exist, but Pages loads `spec/id` for both and `spec/en/README.md` is a placeholder. Audit §4 row `WEB-PAGE-004`; `src/content.config.ts`; Pages workflow; `spec/en/README.md`. |
| `WEB-PAGE-005` | `🌗` documentation/reference surface is present but bilingual completeness is partial | `partial` | `verified-local` for generated docs; `observed-local` for content boundary | In scope; website presents docs, `spec` owns normative meaning | Onboarding, capability, use-case, CLI, Playground, Markdown, status, docs, and spec routes exist; English language-spec presentation is incomplete. Audit §4 row `WEB-PAGE-005`; site/docs/spec collections and build assertions. |
| `WEB-PAGE-006` | `✔️` implemented at local learning-example boundary | `implemented` | `verified-local` | In scope; website owns editorial examples; child surfaces own runtime semantics | Getting Started, CLI, Playground, Markdown, capability, and status examples are present and selected rendered markers pass. Audit §4 row `WEB-PAGE-006`; `pnpm test`; site content. |
| `WEB-PAGE-007` | `🌗` links/embed handoff exists; cross-surface runtime proof is incomplete | `partial` | `verified-local` for assembly; `unverified-public` for hosted handoff | In scope; website owns discovery/copy, Playground and plugins own behavior | `/playground/` links, Markdown `rg`/`relgeo` output, and Pages artifact assembly exist. Hosted Playground interaction and current pinned runtime were not publicly verified. Audit §4 row `WEB-PAGE-007`; Pages artifact assertion. |
| `WEB-PAGE-008` | `✔️` implemented as documentation and routing orientation | `implemented` | `observed-local` | In scope; website routes users, CLI/Playground/plugins own execution | Docs orient users to docs, CLI, Playground, Markdown, spec, and Desktop App; CLI page covers the required command intent. Audit §4 row `WEB-PAGE-008`; docs navigation and CLI page. |
| `WEB-PAGE-009` | `🌗` responsive source contract exists; current runtime matrix is not proven | `implemented` | `unverified` | In scope for browser web; physical handset behavior remains a deferred evidence boundary | CSS has 640/899/900px breakpoints, `clamp()` typography, containment, and body overflow control, but no fresh viewport/device run was available. Audit §4 row `WEB-PAGE-009`; `src/styles/site.css`; Plan 05 boundary. |
| `WEB-PAGE-010` | `🌗` accessibility shell is present; complete interaction/AT evidence is incomplete | `partial` | `verified-local` for static assertions; `deferred-external` for physical AT | In scope for browser accessibility; VoiceOver/TalkBack/mobile AT are explicitly deferred evidence | Skip link, landmarks, labels, focus, `aria-current`, reduced motion, and static assertions exist. Browser AX/keyboard sweep and physical AT were not freshly verified. Audit §4 row `WEB-PAGE-010`; `DocsLayout.astro`; accessibility styles/assertions. |
| `WEB-PAGE-011` | `🌗` metadata/sitemap exist; deployment URL correctness depends on configuration | `partial` | `verified-local` with deployment env; external crawl `unverified-public` | In scope; website owns metadata and crawlable static content | Canonical, alternates, descriptions, social metadata, icons, and sitemap are generated. Bare build defaults to `https://example.com`; no external crawler was available. Audit §4 row `WEB-PAGE-011`; `astro.config.mjs`; sitemap output. |
| `WEB-PAGE-012` | `🌗` local artifact assembly passes; provenance/revision parity remains open | `implemented` | `verified-local` for assembled local artifact; revision parity `unverified` | In scope; website workflow assembles artifact; root coordinates pinned inputs | Website build plus local Playground copy passed `test:pages-artifact`, but local Playground `59a42ae` differs from the Pages pin `09ac1cb` and baseline `c0de7b0`. Audit §4–§6; artifact assertions and integration baseline. |
| `WEB-PAGE-013` | `🌗` Pages workflow exists; current deployment execution/parity is unverified | `implemented` | `observed-local`; current CI/public deployment `unverified-public` | In scope; website owns Pages workflow, root owns revision coordination | Workflow pins Node/pnpm, Playground/spec, builds, uploads, deploys, and smoke-tests; no current workflow result was queried and revisions are unsynchronized. Audit §4–§6; `.github/workflows/pages.yml`. |
| `WEB-PAGE-014` | `🌗` release gates exist; public reliability signal is unavailable in this environment | `implemented` | `unverified-public`; `environment-unavailable` | In scope as recurring evidence; root/workflow owns gates, public deployment owns runtime observation | Artifact/built-output assertions pass locally and the smoke script declares 13 routes, but all direct probes returned HTTP 000/curl exit 6 because `relgeo.github.io` could not resolve. Audit §4–§5; `scripts/smoke-public-site.mjs`. |
| `WEB-PAGE-015` | `🌗` status/version copy is explicit; consistency is incomplete across language/revision boundaries | `partial` | `observed-local` | In scope; website editorial surface owns claims, child repos and baseline own facts | Current Capabilities and Language Status distinguish DSL/package/application/deployment concepts, but English spec output and revision drift prevent a full consistency claim. Audit §4 and §6; status pages, spec output, integration baseline. |

## 4. Gaps that are not status substitutions

These observations must not be used to collapse a missing implementation into a
non-applicable result or to treat unavailable evidence as a product pass:

| Observation | Correct interpretation |
| --- | --- |
| DNS could not resolve `relgeo.github.io` during the public probe | Evidence is `environment-unavailable` / `unverified-public`; it does not make a capability `❌`, and it does not prove public reliability. |
| Physical screen-reader, mobile assistive-technology, and handset evidence was not run | The evidence is `deferred-external` under the documented scope decision; the browser accessibility capability remains in scope. |
| Website does not own CLI, Playground, plugin, or normative spec execution | This is an ownership boundary. The website capability remains reconciled against its routing, presentation, and handoff obligations. |
| Root Playground pointer, integration baseline, and Pages workflow pin differ | This is a provenance/revision-parity gap affecting artifact and deployment confidence, not proof that one child revision is broken. |
| `WEB-PAGE-003` has a deterministic index/filter/no-result baseline but no query/server search | The implementation status remains partial: local discovery behavior is evidenced, but the broader query-search outcome and browser interaction evidence are not claimed. |

## 5. Handoff conclusion

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
