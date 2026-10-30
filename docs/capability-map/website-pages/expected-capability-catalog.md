# Expected Capability Catalog — Website and Pages

**Status:** expected catalog complete; audit, reconciliation, status matrix, and gap backlog published separately  
**Scope:** `relgeo.github.io`, its public documentation and language-spec
presentation surfaces, the hosted Playground handoff/embed, and Pages delivery  
**Catalog date:** 2026-10-30  
**Compatibility context:** RelGeo DSL `0.5`; the website is a presentation layer,
not the normative language owner

## 1. Purpose and ordering rule

This document defines what the website and Pages surface is expected to provide
before implementation comparison. It is derived from user journeys,
public product positioning, documented workflows, navigation/command intent,
roadmap decisions, the DSL source-of-truth boundary, and explicit scope rules.

The catalog was finalized before the implementation audit and is not copied
from source code, an implementation audit, or an old capability matrix. The
`Verification status` field therefore describes the readiness of the
requirement and the planned verification boundary; it does not claim that the
implementation has passed.

The later audit must compare every ID below explicitly and must keep these
states separate:

- **Expected:** the user outcome is required by the product surface.
- **Observed:** implementation evidence exists in the owned surface.
- **Verified:** the observed behavior passed a named check at a named revision.
- **Not verified / environment unavailable:** the behavior was not proven in the
  relevant environment.
- **Deferred by decision:** the requirement is intentionally outside the active
  verification gate, but remains visible as a product boundary.

## 2. Product model, users, and journeys

### Target users

| User | Expected job on the public surface |
| --- | --- |
| Curious visitor | Understand what RelGeo is, why relation-first vector authoring matters, and whether it fits a real need. |
| New author | Follow a short reading path, copy a valid example, and reach a first successful source → resolve → preview result. |
| DSL/reference reader | Find the active language contract, version/support policy, terminology, and the relevant reference chapter without confusing editorial prose with normative rules. |
| Markdown/documentation author | Decide between readable `rg` source and rendered `relgeo` preview/embed, then find the relevant integration guidance. |
| Terminal/automation user | Discover whether the CLI is the right surface and find the documented `info`, `compile`, `check`/`validate`, parameter, profile, and SVG-target workflows. |
| Maintainer/reviewer | Trace public claims to the correct repository, contract line, generated artifact, deployment evidence, and current limitation. |
| Keyboard or assistive-technology user | Traverse the same public information and controls with meaningful landmarks, names, focus, and state announcements. |

### Primary journeys

1. **Discover:** visitor lands on the site, understands the product position,
   sees the main surfaces, and chooses a useful next step.
2. **Learn:** new author follows Getting Started, current capabilities, a
   surface-specific guide, examples, and the active language spec when needed.
3. **Try:** author opens the hosted Playground, edits source, waits for
   `READY`, inspects the result, and has a clear recovery path for invalid
   source or runtime diagnostics.
4. **Reference:** experienced reader uses docs/spec navigation, language
   status, examples, and search/wayfinding to reach a precise answer.
5. **Embed or automate:** author is routed to the `rg`/`relgeo` Markdown
   surfaces or to CLI commands according to the intended output.
6. **Trust the public result:** maintainer can relate the public route to the
   pinned source, generated artifact, Pages deployment, and public smoke
   evidence.

## 3. Source-of-truth and scope decisions

The following decisions bind the catalog:

| Decision | Consequence for this catalog |
| --- | --- |
| `relgeo.github.io` owns the website, docs presentation, language-spec presentation, and Pages deployment surface. | Website/page capabilities are cataloged here; child package internals are not silently treated as website ownership. |
| `spec/id` is the active normative DSL source. | The site may load and present the spec, but must not redefine or manually become the semantic authority. |
| The public product has distinct landing, product/use-case, documentation, language-spec, Playground, and delivery surfaces. | Discovery and navigation must preserve those distinctions instead of collapsing everything into one dashboard-like page. |
| The active contract is DSL `0.5`; package/application versions are separate. | Public copy and status pages must distinguish contract version, package version, and deployment revision. |
| Browser/web accessibility and responsive behavior are active quality requirements. | They are expected capabilities even where physical-device or real screen-reader evidence is deferred. |
| Android/iOS physical QA, TalkBack, iOS VoiceOver, and Safari mobile are deferred without a date. | They remain a documented verification limitation, not an implicit pass and not a reason to invent mobile product scope. |
| The website must assemble a reproducible public artifact from pinned inputs. | Pages deployment, generated output, artifact assertions, and public smoke are part of the product capability boundary. |

### Source coverage register

The expected set is derived from the product intent and declared boundaries
below, not reconstructed from the current route tree or from the historical
website matrix. The final column makes the expected-set coverage auditable
before any implementation status is considered.

| Required source class | Evidence consulted | What it contributes to the expected catalog | Covered IDs |
| --- | --- | --- | --- |
| User journeys and target users | This catalog §2; `docs/MATURATION-MASTER-PLAN.md` public-surface and maturation goals; `docs/plans/05-public-docs-and-playground-hardening.md` surface journeys and quality gates | Discover, learn, try, reference, embed/automate, trust, and accessible traversal outcomes for visitors, authors, readers, automation users, maintainers, and assistive-technology users | `WEB-PAGE-001`–`015` |
| Workflows | `relgeo.github.io/src/content/docs/{id,en}/getting-started.md`, `playground.md`, `markdown-surfaces.md`, `desktop-app.md`; `relgeo.github.io/README.md` local build and reproducible Pages flow; Plan 05 workstreams B–F | The expected reading path, source → resolve → preview → inspect handoff, Markdown source/preview choice, artifact assembly, and deployment/release evidence | `WEB-PAGE-001`, `002`, `005`–`008`, `012`–`014` |
| Menus and commands | `relgeo.github.io/src/layouts/DocsLayout.astro`; `relgeo.github.io/src/pages/[lang]/docs/index.astro`; `relgeo.github.io/src/content/docs/{id,en}/cli.md` and `getting-started.md` | The website must orient users among Home/Why RelGeo/Docs/Language Spec/Playground and the documented `info`, `compile`, `check`/`validate`, parameter/profile, and SVG-target paths; it does not own CLI execution | `WEB-PAGE-001`, `002`, `005`, `007`, `008` |
| Roadmap and maturation | `docs/MATURATION-MASTER-PLAN.md`; `docs/plans/05-public-docs-and-playground-hardening.md` acceptance gates, remaining work, and evidence register | Public-surface quality, generated examples, Pages/public reliability, responsive/accessibility boundaries, and explicit deferred external validation | `WEB-PAGE-006`, `009`–`014` |
| Contracts and source-of-truth rules | `docs/REPOSITORY-MAP.md` ownership table and documentation boundary; `relgeo.github.io/README.md` content role, active DSL `v0.5`, Markdown contracts, and pinned inputs; active `spec/id` boundary | Separates website presentation from normative language meaning, preserves the `rg`/`relgeo` Markdown contract, and requires honest contract/package/deployment version provenance | `WEB-PAGE-004`–`008`, `011`–`015` |
| Scope decisions and non-goals | This catalog §3; Plan 05 physical-device/assistive-technology deferrals and website-versus-Playground/Desktop boundaries; repository map ownership | Keeps browser requirements in scope, keeps physical mobile/AT evidence explicitly deferred, and prevents child runtime behavior or custom hosting from being silently assigned to the website | `WEB-PAGE-007`, `009`, `010`, `013`, `014` |
| Website/Pages product evidence | `relgeo.github.io/src/pages/`, `src/content/`, `src/layouts/`, `src/lib/`, `src/styles/`, `.github/workflows/pages.yml`, `scripts/assert-built-output.mjs`, `scripts/assert-pages-artifact.mjs`, and `scripts/smoke-public-site.mjs` | Confirms the owned surface and the later audit boundary; these files constrain terminology, route families, artifact gates, and deployment observations but do not define the expected set by themselves | `WEB-PAGE-001`–`015` |

### Expectation-first guardrails

The following are intentionally retained as expected capabilities even when
the later implementation audit may find them absent, partial, or unverified:

- `WEB-PAGE-003` requires a complete search/wayfinding outcome, including
  useful query or deterministic-index context and no-result behavior. Existing
  sidebars or links cannot silently downgrade this to “implemented.”
- `WEB-PAGE-004` requires honest bilingual route context and equivalent content
  where promised. A localized shell or an English mirror is not silently
  treated as semantic parity.
- `WEB-PAGE-012`–`014` require reproducible pinned inputs, Pages deployment,
  and current public reliability evidence. A local static build is not a
  substitute for the assembled or deployed outcome.

These guardrails preserve absent capabilities as gaps for the downstream audit;
they are not claims that the current website already provides them.

## 4. Capability catalog

Every row is an expected capability, not an implementation result. The
verification-status column below is a refreshed handoff view of named audit
evidence and remaining boundaries; it does not change the expected outcome or
replace the downstream capability status symbols.

| ID | Expected capability and user outcome | Requirement basis | Scope decision | Owner / source of truth | Verification status |
| --- | --- | --- | --- | --- | --- |
| `WEB-PAGE-001` | **Route and content discovery:** a visitor can identify the site entry point, product/use-case pages, docs home, language-spec home, localized variants, Playground entry, and public delivery endpoints, then reach each from a stable route. | Master Plan §3.1/§4.2; Plan 05 §3 and §5.1; website Getting Started reading path; required Route/content discovery scope. | **In scope.** Include stable public route families and their relationship; do not treat an exhaustive implementation route list as part of this catalog. | Owner: `relgeo.github.io`. Source of truth: website content model and public route contract; normative language content remains `spec/id`. | `verified-local` route generation and selected output assertions; public reachability and exhaustive link crawl remain unverified. |
| `WEB-PAGE-002` | **Navigation and location:** global navigation, localized navigation, docs reading order, language-spec sidebar/section order, active-route state, return paths, and visible Playground handoff let users know where they are and what to read next. | Plan 05 Workstream B/C; website Getting Started; website navigation copy and public-surface decision in Master Plan §3. | **In scope.** Navigation must reflect surface purpose; no requirement to merge docs and spec into one navigation model. | Owner: `relgeo.github.io`. Source of truth: website information architecture and editorial navigation contract. | `verified-local` selected navigation/localization assertions; full keyboard traversal remains unverified. |
| `WEB-PAGE-003` | **Search and wayfinding:** a reference reader can locate a page, concept, example, or spec topic by query or deterministic index/links, with useful empty/no-result and context behavior. | Required search scope; reference-reader journey; Master Plan priority on understandable public surfaces; Plan 05 reading/reference goals. | **In scope as an expected discovery capability.** Exact search technology is not prescribed; a complete deterministic index may satisfy a first baseline if it supports the user outcome. | Owner: `relgeo.github.io`. Source of truth: docs/reference information architecture and search contract. | `verified-local` deterministic localized index/filter/no-result baseline; query/server search and browser interaction remain unverified, so downstream status is `🌗`. |
| `WEB-PAGE-004` | **Localization:** users can switch between Indonesian and English public paths, retain the equivalent page context where available, and understand that `/id` is the active normative home while `/en` is the public English surface being aligned. | Website Language Status; website `id`/`en` public content; Master Plan source-of-truth §2.3; required localization scope. | **In scope.** Support the declared `id` and `en` boundary; do not claim semantic parity for English content that is not aligned. | Owner: `relgeo.github.io` for presentation and copy. Source of truth for semantics: `spec/id`; source of truth for localized editorial content: corresponding website/spec content. | `verified-local` route shell and honest English mirror disclosure; English normative-content parity remains incomplete (`🌗`). |
| `WEB-PAGE-005` | **Documentation and reference surfaces:** users can distinguish onboarding, current capabilities, use cases, surface guides, language status, and authoritative language-spec reference, with reading paths appropriate to each surface. | Plan 05 §3 and Workstream C; website Getting Started, Current Capabilities, CLI, Playground, Desktop App, Language Status; Repository Map documentation ownership. | **In scope.** Docs explain usage and boundaries; the site must not become a parallel semantic rewrite of the spec. | Owner: `relgeo.github.io` for presentation/docs entry points; `spec` for normative language content. | `verified-local` generated docs and explicit English mirror affordance; bilingual reference parity remains partial (`🌗`). |
| `WEB-PAGE-006` | **Examples and learning proof:** a new author can copy examples that preserve readable RelGeo source, understand the intended result, and follow the first successful workflow without relying on undocumented assumptions. | Website Use Cases, Current Capabilities, Getting Started, Markdown Surfaces, and Playground pages; Master Plan Stage 4 rendered documentation examples. | **In scope.** Include examples for onboarding, Markdown, Playground, CLI, and contract orientation; do not expand DSL semantics in this catalog. | Owner: website for editorial examples; `spec`/fixture owners for normative example meaning; Playground/CLI owners for surface-specific commands. | `verified-local` rendered markers and website output assertions; semantic execution of every prose example remains outside the site test. |
| `WEB-PAGE-007` | **Playground links and embed handoff:** users can reach the hosted Playground from relevant pages, understand it as a lightweight browser IDE, and use the documented `edit → resolve → preview → inspect` flow; Markdown readers can choose source (`rg`) or rendered preview/embed (`relgeo`). | Plan 05 §3/§5.2; website Playground and Markdown Surfaces pages; website README planned Markdown contracts; Master Plan Playground boundary. | **In scope.** Website owns discovery and handoff; Playground owns its workbench behavior; Markdown plugins own rendering behavior. | Owner: website for links/copy/embed presentation; `playground` and remark plugin repositories for behavior; `spec/id` for language meaning. | `verified-local` links, Markdown output, child build/test, and assembled artifact; hosted handoff/runtime remains unverified-public. |
| `WEB-PAGE-008` | **Surface and command orientation:** users can choose the appropriate path—docs, Playground, CLI, Markdown, or richer workbench—and find documented command intent (`info`, `compile`, `check`/`validate`, parameters, profiles, SVG target) without mistaking the website for the runtime or CLI. | Website Getting Started, CLI, Current Capabilities, Markdown Surfaces, Desktop App, and Use Cases; Repository Map ownership table; Master Plan dependency flow. | **In scope as documentation and routing.** Website does not need to implement CLI commands or become an interactive terminal. | Owner: website for orientation; `cli`, `remark-relgeo`, `playground`, `flutter`, and `spec` remain owners of their respective behavior/contracts. | `observed-local` orientation evidence; command execution remains owned and verified by child packages. |
| `WEB-PAGE-009` | **Responsive behavior:** content, navigation, code/spec reading, links, and public Playground handoff remain usable across the declared browser viewport baseline without accidental wrapping, clipping, or page-level horizontal overflow. | Plan 05 visual/interaction principles, Workstream B/E, browser matrix, and public-surface goal; required responsive scope. | **In scope for web/PWA and documented browser matrix.** Physical handset gestures and mobile OS behavior remain deferred by decision. | Owner: website for page layout; Playground for embedded/linked workbench layout; source CSS repositories are implementation owners. | CSS/source contract observed locally; current viewport/device runtime remains unverified. |
| `WEB-PAGE-010` | **Accessibility:** public pages expose landmarks, headings, link/button names, visible focus, keyboard order, locale/navigation state, useful code/spec semantics, and reduced-motion behavior; equivalent information is available without pointer-only interaction. | Plan 05 §4, Workstream E, §8.2; Master Plan accessibility limitations; required accessibility scope. | **In scope for browser/web accessibility.** Physical keyboard, VoiceOver/TalkBack, and mobile assistive technology are separate deferred evidence, not silently passed. | Owner: website for pages; Playground for its workbench controls; verification source is the named browser AX/keyboard contract. | `verified-local` static accessibility shell and assertions; browser AX/keyboard plus physical AT remain unverified/deferred. |
| `WEB-PAGE-011` | **SEO and public discoverability:** indexable public pages expose coherent title/description and stable canonical/base-aware URLs; the site publishes a sitemap and does not make important content reachable only through client-side interaction. | Public route/sitemap requirement in Master Plan §4.2 and Plan 05 §5.1/§8.2; website content frontmatter and deployment URL contract. | **In scope.** Minimum SEO is route metadata, stable URLs, sitemap, and crawlable rendered content; social-card optimization is not an active requirement unless separately decided. | Owner: `relgeo.github.io`. Source of truth: page metadata/content contract and public URL configuration. | `verified-local` deployment-configured metadata/sitemap and placeholder-URL gate; external crawler/public verification remains unverified. |
| `WEB-PAGE-012` | **Generated artifact integrity:** the build produces the expected static pages and assets, includes the intended language-spec source and pinned Playground artifact, and preserves provenance/version boundaries so the public result matches the reviewed inputs. | Website README reproducible Pages inputs; Master Plan §4.2 and §5.3; Plan 05 Workstream F; `docs/integration-baseline.json` as pinned revision evidence. | **In scope.** Artifact assembly and assertions are product gates; the catalog does not make the generated output a new normative source. | Owner: `relgeo.github.io` build/workflow; root workspace owns cross-repo orchestration evidence. Source of truth: pinned child revisions plus website build contract. | `verified-local` 138-page build and combined artifact assertions; root/baseline/Pages Playground revisions are mismatched, so parity remains unverified (`🌗`). |
| `WEB-PAGE-013` | **Pages deployment:** a reviewed website artifact can be deployed to GitHub Pages at the public base path with the required docs/spec/Playground routes and assets, using the custom Pages workflow and explicit input pins. | Website README Pages workflow; Master Plan §4.2; Plan 05 Workstream F and acceptance gate; required Pages deployment scope. | **In scope.** Deployment path is public Pages; custom-domain migration or another hosting provider is out of scope for this catalog. | Owner: `relgeo.github.io` deployment workflow; root workspace owns integration/revision coordination. | `observed-local` workflow/build configuration; no current CI/deployment run or synchronized-input proof is available. |
| `WEB-PAGE-014` | **Public reliability:** after deployment, route smoke, asset checks, generated-artifact assertions, and relevant browser smoke provide a repeatable signal that public pages are reachable, internally coherent, and not silently stale. | Master Plan §4.2/§5.3/§8; Plan 05 §8.2, §9, and evidence register; public reliability requirement. | **In scope as recurring release evidence.** A historical pass is not a permanent guarantee; environment failures must remain `not verified` rather than becoming a product defect or false pass. | Owner: root workspace for cross-repo gate; website workflow for page/artifact checks; public deployment for runtime observation. | `verified-local` artifact/built-output gates; current public probe is environment-unavailable due DNS, so public reliability remains unverified. |
| `WEB-PAGE-015` | **Honest capability and version status:** users can tell what is active today, what is supported legacy/regression-only/future, what is a limitation, and which version is DSL contract versus package/application/deployment revision. | Website Current Capabilities and Language Status; Master Plan §2.3–§2.4 and §2.7; contract-versioning plan; `docs/integration-baseline.json`. | **In scope.** Public claims must not overclaim implementation or parity; source/contract authority stays with child repositories and `spec`. | Owner: website editorial surface; `spec` and package owners for contract/version facts; root baseline for reviewed revisions. | `observed-local` explicit status claims; English output and Playground revision drift prevent full consistency verification (`🌗`). |

## 5. Verification handoff

The implementation audit and downstream views preserve the IDs above. The
audit records one explicit observation per ID, and the downstream artifacts
keep implementation, evidence, scope, and candidate work separate:

1. the exact owner/source path inspected;
2. the behavior or artifact observed;
3. the revision, environment, and command/browser scenario used;
4. the resulting state (`observed`, `verified`, `not verified`, or `deferred`);
5. the gap and its priority, without deleting expected capabilities that are
   currently absent.

The downstream artifact chain is:

- [implementation audit](./implementation-audit.md);
- [expected-versus-observed reconciliation](./reconciliation.md);
- [status matrix](./status-matrix.md); and
- [implementation-gap backlog](./implementation-gap-backlog.md); and
- [coverage validation and handoff](./coverage-validation-handoff.md).

The required evidence set for that later comparison is:

- [`docs/MATURATION-MASTER-PLAN.md`](../../MATURATION-MASTER-PLAN.md) — ecosystem
  boundaries, source-of-truth policy, roadmap, and public-surface gates;
- [`docs/REPOSITORY-MAP.md`](../../REPOSITORY-MAP.md) — ownership and repository
  boundary;
- [`docs/plans/05-public-docs-and-playground-hardening.md`](../../plans/05-public-docs-and-playground-hardening.md)
  — website/Playground surface model, quality requirements, and evidence policy;
- [`relgeo.github.io`](../../../relgeo.github.io) — website-owned content and
  deployment application;
- [`docs/integration-baseline.json`](../../integration-baseline.json) — pinned
  revision/package evidence captured on 2026-10-09, not the source of the
  expected list.

## 6. Catalog completion check

- [x] Expected catalog was written before implementation comparison.
- [x] Every capability has an ID.
- [x] Every capability states a user outcome.
- [x] Every capability records requirement basis, scope decision, owner/source
  of truth, and verification status.
- [x] Minimal scope is covered: route/content discovery, navigation, search,
  localization, docs/reference, examples, Playground links/embed, responsive
  behavior, SEO, accessibility, generated artifact, Pages deployment, and
  public reliability.
- [x] Existing code and old capability matrices were not used as the initial
  capability list.
