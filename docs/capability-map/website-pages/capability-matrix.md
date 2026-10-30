# Website and Pages capability matrix

> **Coverage statement — 2026-10-29.** This matrix covers the Astro website,
> normative-spec ingestion, Markdown integration, localized presentation,
> Playground assembly, Pages workflow, and public-smoke boundary using website
> source/content/config, build/check/assertion scripts, child inputs, and
> deployment workflow evidence. It does not make the site owner of the spec or
> claim a fresh deployed/public crawl. Current CI/canonical and public Pages
> verification remain `not verified` where stated; a missing row is not
> evidence of absence.
> See [inventory protocol](../INVENTORY-PROTOCOL.md) for status axes and evidence tiers.

## Matrix metadata

| Field | Value |
|---|---|
| Surface | relgeo.github.io public documentation website and GitHub Pages artifact |
| Audit owner | Website repository + workspace/spec/plugin/Playground integration owners |
| Audit date | 2026-10-29 |
| Source of truth | Astro source/content, spec loader, Markdown plugin config, Pages workflow, build/artifact/smoke scripts, plan 05 |
| Evidence freshness | Current static build/check/assertion evidence is available. Current public deployment, network smoke, browser/AT validation, and synchronized Playground pin are not verified. |

## Status legend

| Status | Meaning |
|---|---|
| ✔️ | Implemented and directly evidenced for the bounded website capability. |
| 🌗 | Implemented, but runtime, breadth, localization, or deployment evidence is partial. |
| ❌ | Expected capability is absent at the current website boundary. |
| ➖ | Deliberately outside website responsibility or current release target. |
| ⏸️ | Deferred or held pending editorial, host, or product decision. |
| ⚠️ | Confirmed defect, mismatch, or evidence/provenance inconsistency. |

not verified is an evidence state for checks not executed in the current
environment; it is not a status symbol.

## Capability inventory

| Capability | Status | Evidence | Gap / limitation | Consumer | Dependency | Next action |
|---|---:|---|---|---|---|---|
| Astro static documentation build | ✔️ | Current build passes and emits 138 pages; package scripts and content collections | Static build does not prove deployed response behavior | Public readers | Astro 5; Node/pnpm workflow | Keep build/check as required website gate |
| Localized id/en route shell | ✔️ | Localized pages, i18n.ts, language switcher, canonical/alternate links, built-output assertions | Text parity is not guaranteed by route-shell parity | Indonesian and English readers | Content entries; Astro routes | Maintain route assertions and translated content review |
| Normative spec presentation | ✔️ | languageSpec loader reads spec/id directly; 84 sitemap URLs include spec routes; 138-page build | Website is a presentation layer and does not validate all semantics | Implementers needing active contract | spec/id; content loader | Keep source path/pin explicit in CI |
| English normative spec translation | ❌ | spec/en/README.md explicitly says Placeholder; en route renders id source with lang=en | English route metadata/shell exists, but full English spec content is absent | English readers needing contract details | spec/en translation work | Keep public limitation explicit; translate/promote only after spec review |
| Non-normative docs navigation and onboarding | ✔️ | Docs index/routes, Current Capabilities, Language Status, Getting Started, CLI, Playground, Desktop, Markdown pages | Prose claims are not executable capability proof | New users and authors | Website content; component matrices | Link claims to audited matrices where appropriate |
| Markdown source/highlight surface | ✔️ | remark plugins configured; current built-output assertions detect rg token markup | Plugin fallback/registry parity is owned by Markdown surface and remains partial there | Docs readers and authors | remark-relgeo-hl; language-service | Keep website assertion and fix upstream fallback gap |
| Markdown preview/embed surface | ✔️ | remark plugin configured; current assertions detect relgeo preview image and no source exposure | Preview behavior inherits plugin/core/renderer limits | Docs readers | remark-relgeo; core; renderer-svg | Keep artifact assertion and bounded preview contract |
| Playground link and public route | ✔️ | DocsLayout/nav, docs content, built route checks, Pages workflow artifact path | Current public response not fetched in this audit | Website users | Playground artifact and Pages deployment | Re-run public smoke after current deployment |
| Playground assembled Pages artifact | 🌗 | Pages workflow builds/copies Playground; preassembled artifact assertions pass | Standalone site build does not contain playground; current root/workflow pins differ | Public docs readers | Playground build; Pages workflow | Synchronize pin, build both inputs, then run combined artifact gate |
| SEO metadata and canonical routes | ✔️ | DocsLayout canonical/hreflang/OG/Twitter; built-output assertions | No external crawler or search-console verification | Search/social consumers | Configured Astro site URL/base | Add canonical/link crawler if SEO is release-critical |
| Sitemap generation | ✔️ | sitemap.xml.ts; current build 84 loc entries; assertion covers root and localized routes | No deployed HTTP or search-engine ingestion evidence | Crawlers and navigation tools | Astro site URL; content collections | Verify deployed sitemap after Pages publish |
| Accessibility static contract | 🌗 | Skip link, landmarks, labels, focus/reduced motion CSS, active states; assertions pass | No fresh screen-reader/keyboard browser session; no full WCAG audit | Keyboard/AT users | Browser/AT runtime | Run current browser accessibility and manual AT review |
| Link/route integrity across all generated pages | 🌗 | Selected route assertions, generated route inventory, sitemap | No exhaustive internal-link crawl; Markdown source relative links are not all checked after rewrite | All readers | Astro routes/content links | Add static internal-link crawler before release if required |
| Pages reproducible input pins | ⚠️ | Workflow pins Playground 09ac1cb and spec b96ba3b; root Playground pointer is 59a42ae and baseline JSON is c0de7b0 | Three evidence sources do not identify the same Playground revision | Release/integration owners | GitHub Actions checkout and baseline sync | Refresh workflow pin and integration baseline after validating current Playground |
| Public deployed site smoke | 🌗 | smoke-public-site.mjs checks 12 route/assets; plan 05 records historical READY/public smoke | Current network/deployment run not executed here | Public deployment consumers | GitHub Pages URL/network | Run after deploy and archive status for current revision |
| Custom domain or non-Pages hosting | ➖ | README and workflow target GitHub Pages; site/base env vars are configurability hooks | No current requirement/evidence for another host | None in current target | Separate deployment decision | Do not infer support from configurable site/base variables |
| Website as normative language source | ➖ | DocsLayout footer and docs index say language spec remains contract source; loader consumes spec | Website intentionally does not own semantic authority | Implementers and maintainers | spec repository | Preserve source-of-truth boundary |
| Manual VoiceOver/TalkBack/Safari-mobile validation | ⏸️ | Plan 05 explicitly defers these validations; static checks and historical browser evidence only | Requires external devices/assistive technology and separate QA decision | Mobile/AT users | Device/browser hosts | Reopen when product/release scope requires it |
| Package publication as npm website SDK | ➖ | relgeo.github.io package.json has private true; README describes deployment app | Website is not a reusable published runtime package | None in current boundary | Deployment repository | Keep release focus on Pages artifact |

## Priority and dependency order

1. **P0 — synchronize deployment inputs:** reconcile current Playground pointer,
   docs/integration-baseline.json, and Pages workflow pin before calling public
   artifact evidence current.
2. **P0 — preserve spec truth:** keep the direct spec/id loader and document the
   English placeholder; do not present the en route as translated normative text.
3. **P1 — run combined Pages gate:** build validated Playground and site inputs,
   copy the Playground artifact, run test:pages-artifact, deploy, and run the
   12-route public smoke.
4. **P1 — close web accessibility/link evidence:** execute browser/AT checks and
   an exhaustive generated internal-link crawl if those are release criteria.
5. **P2 — improve editorial parity:** translate spec/en only through the spec
   owner/review path; website should continue to render rather than fork it.

## Conclusion

The website is a functioning static presentation layer with direct normative
spec ingestion, localized navigation, Markdown plugin integration, SEO shell,
sitemap, and a reproducible Pages workflow. The strongest current evidence is a
fresh 138-page build, built-output assertions, and Astro check. The English spec
is not translated, the Playground artifact exists only after workflow assembly,
and current public/deployment evidence is not fresh. Those boundaries are
explicit in the matrix rather than being counted as full website capability.
