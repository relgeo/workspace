# Website and Pages Implementation Audit

**Audit date:** 2026-10-30  
**Baseline:** [`website-pages/expected-capability-catalog.md`](./expected-capability-catalog.md)  
**Surface:** `relgeo.github.io` Astro site, generated documentation/spec pages,
Playground Pages assembly, and GitHub Pages delivery  
**Audit status:** local implementation evidence collected; public deployment
verification remains unverified because DNS/network access was unavailable

## 1. Audit boundary and status vocabulary

This audit compares every expected capability ID against the implementation
catalog and evidence discovered in the website repository and its declared
upstream inputs. It does not promote historical CI or public-smoke claims into
current verification.

Status meanings used below:

| Status | Meaning in this audit |
| --- | --- |
| `implemented` | The relevant source/config/workflow exists and the local behavior or artifact was observed. |
| `partial` | A meaningful part exists, but an expected sub-capability or boundary is absent/incomplete. |
| `absent` | No implementation or evidence was found for the expected capability. |
| `broken` | The implementation exists but a scoped check demonstrates a defect. No capability is classified `broken` solely from missing external access. |
| `deferred` | Explicitly postponed by a scope decision; not an implementation failure. |
| `not applicable` | The expected capability is outside the applicable surface; none of the catalog IDs are marked this way. |
| `unverified` | The implementation may exist, but the relevant environment, public deployment, or evidence was not available. |

Verification states are kept separate from implementation status:

- `verified-local`: a named local command or built-artifact assertion passed;
- `observed-local`: source/output was inspected but no dedicated behavior gate
  proves the complete outcome;
- `unverified-public`: the public URL or deployment was not reachable in this
  environment;
- `environment-unavailable`: the check was attempted and blocked by DNS or
  another execution boundary;
- `deferred-external`: physical device or assistive-technology evidence is
  intentionally outside the active gate.

## 2. Discovery log and coverage report

### Sources inspected

| Discovery class required by the task | Sources inspected | Coverage result |
| --- | --- | --- |
| Website source/routes | `relgeo.github.io/src/pages/`, `src/layouts/`, `src/lib/`, `src/content.config.ts` | Covered route entrypoints, localized dynamic pages, legacy redirects, layout shell, collection loading, URL helpers, and sitemap generation. |
| Content/docs/reference | `relgeo.github.io/src/content/site/{id,en}/`, `src/content/docs/{id,en}/`, loaded `spec/id/`, `spec/en/README.md` | Covered 8 site Markdown files, 14 docs Markdown files, 34 active Indonesian spec files, and 1 English placeholder file. |
| Navigation/UI/menu | `DocsLayout.astro`, localized docs index, localized spec index/leaf templates, landing pages, `i18n.ts` | Covered global nav, active route, language switcher, docs groups, spec sidebar, reading path, article index, CTA links, and legacy-route redirects. |
| Commands/workflows | website `package.json`, `README.md`, docs CLI/Getting Started pages, `.github/workflows/pages.yml` | Covered build/check/test commands, documented CLI orientation, Playground build, Pages inputs, artifact copy, deploy, and smoke step. |
| Generated artifact | `dist/` after build, `assert-built-output.mjs`, `assert-pages-artifact.mjs`, `sitemap.xml` | Covered 138 local HTML pages, 84 sitemap URLs, metadata/route assertions, Markdown preview output, and combined Playground artifact assertions. |
| Responsive/accessibility | `src/styles/site.css`, `src/styles/accessibility.css`, `DocsLayout.astro`, built-output assertions, Plan 05 | Covered CSS breakpoints, overflow containment, focus treatment, skip link, landmarks, language/navigation state, and reduced motion. No fresh screen-reader/device run was available. |
| Public runtime | `scripts/smoke-public-site.mjs`, direct `curl` probes against 13 declared routes | Script and route list covered; all current probes were blocked by DNS resolution failure (`HTTP 000`, curl exit 6). |
| Governance/source of truth | `docs/MATURATION-MASTER-PLAN.md`, `docs/REPOSITORY-MAP.md`, Plan 05, `docs/integration-baseline.json` | Covered ownership, spec authority, public-surface scope, Pages gate, deferred QA, and pinned revision evidence. |

### Inventory counts observed locally

| Item | Count / observation |
| --- | --- |
| Website route source files | 13 files under `relgeo.github.io/src/pages/`. |
| Site content files | 8 Markdown files across Indonesian and English. |
| Documentation content files | 14 Markdown files across Indonesian and English. |
| Active spec input | 34 Markdown files under `spec/id/`. |
| English spec input | 1 placeholder README under `spec/en/`; it is not the loaded build source. |
| Static HTML output | 138 pages from the website build. |
| Sitemap output | 84 `<loc>` entries in the local generated sitemap. |
| Playground artifact | Built locally from root submodule `playground@59a42ae`; three referenced asset paths were checked by the Pages assertion. |

## 3. Source, test, UI, route, config, runtime, fixture, and docs coverage

| Evidence type | Concrete evidence | Finding |
| --- | --- | --- |
| Source / component | `src/content.config.ts`, `src/lib/content.ts`, `src/lib/i18n.ts`, `DocsLayout.astro`, localized page templates | Three Astro collections are schema-loaded; stable IDs and localized href helpers drive static routes; the shared layout owns metadata, nav, language switcher, skip link, and main landmark. |
| UI / menu | `DocsLayout.astro` `navItems`, `languageLinks`; docs index `docsGroups`; spec templates `spec-sidebar`; landing `landing-cta-links` | Global and contextual navigation are implemented. Search controls are not present. |
| Shortcut / route | `src/pages/[lang]/index.astro`, `[slug].astro`, `docs/[...slug].astro`, `docs/language-spec/[...slug].astro`, legacy route files | Localized routes and leaf pages are statically generated; old unlocalized docs/spec/product routes redirect to the Indonesian surface. |
| Config / platform service | `astro.config.mjs`, `RELGEO_DOCS_SITE_URL`, `RELGEO_DOCS_BASE`, `RELGEO_SPEC_PATH`, Pages workflow | Static output and spec/plugin inputs are configurable; deployment workflow pins external inputs and uses GitHub Pages actions. |
| Test / fixture | `scripts/assert-built-output.mjs`, `assert-pages-artifact.mjs`, `smoke-public-site.mjs`, Markdown `rg` and `relgeo` examples | Local build and built-output assertions pass; standalone Pages assertion correctly rejects an unassembled artifact; assembled local artifact passes. Public smoke was unavailable. |
| Runtime | Local `astro build`, generated HTML, generated sitemap, local Playground bundle | Local static behavior is verified at the build boundary. Hosted runtime is not verified in this environment. |
| Documentation | Website README, docs pages, visual rules/audit, master plan, repository map, Plan 05, integration baseline | Public role, non-goals, source authority, version policy, deployment path, and limitations are documented. |

## 4. Capability comparison against the expected catalog

| ID | Implementation finding | Status | Verification / gap |
| --- | --- | --- | --- |
| `WEB-PAGE-001` | Static route families exist for gateway `/`, localized `/id/` and `/en/`, localized product pages, docs, language-spec pages, legacy routes, sitemap, assets, and Playground handoff. The local build emitted 138 pages. | `implemented` | `verified-local` for generation and selected built routes via `pnpm test`; `unverified-public` for reachability. Full route/link crawl is not implemented as a dedicated checker. |
| `WEB-PAGE-002` | Shared layout provides global nav, active route state, language switcher, docs index groups/reading path, docs leaf sidebar/next reading, spec sidebar/current section, article index, and CTA links. | `implemented` | `verified-local` for selected active-navigation/localization assertions; broader keyboard traversal and all-link behavior remain `observed-local`. |
| `WEB-PAGE-003` | Docs/spec indexes and sidebars provide deterministic wayfinding, but no search input, query handling, search index, or empty/no-result behavior was found in `src`, `public`, or scripts. | `partial` | Query search is absent; deterministic index/links are present. The expected capability is therefore not fully satisfied. |
| `WEB-PAGE-004` | `id` and `en` route shells, localized copy, `hreflang`, language switcher, and parallel editorial content exist. The language-spec loader defaults to `../spec/id`, and Pages explicitly uses `.ci/spec/id` for both language routes; `spec/en/README.md` is only a placeholder. | `partial` | `verified-local` for localized route shell; English normative-content parity is absent. Built English spec contains Indonesian markers such as `Tujuan` and `Cara Membaca`, and the English placeholder itself is not rendered as the source. |
| `WEB-PAGE-005` | Onboarding, current capabilities, use cases, CLI, Playground, desktop boundary, Markdown surfaces, language status, docs index, and active spec index/leaf routes are implemented. | `partial` | `verified-local` for 138-page generation and docs assertions. The English language-spec presentation is materially incomplete, so the full bilingual reference outcome is partial. |
| `WEB-PAGE-006` | Website content contains onboarding, CLI, Playground, Markdown `rg`/`relgeo`, capability, and status examples. Built-output assertions verify both Markdown surfaces and Getting Started markers. | `implemented` | `verified-local` with `pnpm test`; semantic correctness of every prose example is not independently validated by the website package. |
| `WEB-PAGE-007` | Docs link to `/playground/`; Markdown plugins are registered and built `rg` highlighting plus `relgeo` preview output. Pages workflow builds and copies the Playground artifact. | `partial` | `verified-local` for Markdown output and assembled artifact. Website does not own the Playground interaction itself; deployed handoff and current pinned-runtime behavior are `unverified-public`. |
| `WEB-PAGE-008` | Docs index and Getting Started route users among docs, CLI, Playground, Markdown, spec, and Desktop App; CLI page documents `info`, `compile`, `check`/`validate`, parameters, profiles, and SVG output. | `implemented` | `observed-local`; website routing/copy is covered, while command execution belongs to `cli` and is outside this repository audit. |
| `WEB-PAGE-009` | CSS contains responsive flex/grid breakpoints at 640/899/900px, `clamp()` typography, horizontal containment for code/spec surfaces, and `overflow-x: clip` on the page body. | `implemented` | `unverified` for runtime viewport behavior in this audit: no fresh browser viewport matrix or physical-device run was executed. Plan 05 records historical/emulated evidence, not a new current pass. |
| `WEB-PAGE-010` | Shared shell includes skip link, `main#main-content`, labeled navs, `aria-current`, visible focus, reduced-motion CSS, and accessible page/section labels. Built assertions check skip link, active language, focus CSS, and reduced motion. | `partial` | `verified-local` for static shell assertions; browser AX, keyboard sweep, physical keyboard, screen reader, and mobile assistive technology are not freshly verified. Physical AT remains `deferred-external` by decision. |
| `WEB-PAGE-011` | Page layout emits description, canonical, `hreflang`, x-default, Open Graph, Twitter, favicon/touch icon, and sitemap metadata. | `partial` | `verified-local` when `RELGEO_DOCS_SITE_URL=https://relgeo.github.io` is set; bare `pnpm build` falls back to `https://example.com` through `astro.config.mjs`, so deployment configuration is required for correct public URLs. No external crawler validation was available. |
| `WEB-PAGE-012` | Astro produces static output; workflow pins Playground/spec, builds both, copies `playground/dist` into `dist/playground`, and `assert-pages-artifact.mjs` validates routes, local Playground references, runtime markers, assets, and sitemap. | `implemented` | `verified-local` after building root Playground `59a42ae` and assembling `dist/playground` (3 asset references checked). The assembled local input is not the workflow’s pinned Playground SHA, so revision parity is `unverified`. |
| `WEB-PAGE-013` | Custom Pages workflow has separate build/deploy jobs, explicit Playground/spec SHAs, Node 24/pnpm 10.33.3, Pages artifact upload, and deployment environment. | `implemented` | `observed-local`; no current GitHub Actions run or deployment result was queried. Root baseline has Playground `59a42ae`, `docs/integration-baseline.json` has `c0de7b0`, and Pages workflow pins `09ac1cb`; these are not one synchronized revision set. |
| `WEB-PAGE-014` | Public smoke script declares 13 routes/assets and retries each URL; artifact and built-output assertions provide local release gates. | `implemented` | `unverified-public / environment-unavailable`: direct probes for all 13 declared routes returned `HTTP 000` with curl exit 6 (`Could not resolve host: relgeo.github.io`). No public failure is inferred from this environment limitation. |
| `WEB-PAGE-015` | Current Capabilities and Language Status pages distinguish DSL v0.5, package/application versions, supported v0.4, regression-only v0.1–0.3, future/unknown versions, normative `id`, English editorial surface, and Playground/Desktop boundaries. | `partial` | `observed-local`; copy is explicit and non-overclaiming in the inspected pages, but English spec output and unsynchronized revisions prevent a full claim/version consistency pass. |

### Status summary

| Status | IDs |
| --- | --- |
| `implemented` | `WEB-PAGE-001`, `002`, `006`, `008`, `009`, `012`, `013`, `014` |
| `partial` | `WEB-PAGE-003`, `004`, `005`, `007`, `010`, `011`, `015` |
| `absent` | None as a whole capability; query-search sub-capability in `WEB-PAGE-003` is absent. |
| `broken` | None demonstrated by the scoped local checks. |
| `deferred` | Physical keyboard, VoiceOver/TalkBack, mobile assistive technology, and mobile Safari evidence under `WEB-PAGE-010`; this is an explicit scope decision. |
| `not applicable` | None; all catalog IDs are in scope for this surface. |
| `unverified` | Public reachability/deployment parity and current external runtime evidence across `WEB-PAGE-001`, `007`, `009`, `011`, `012`, `013`, `014`, `015`. |

## 5. Verification record

| Command / probe | Result | What it proves |
| --- | --- | --- |
| `node -v && pnpm -v` in website | Node `22.23.2`, pnpm `10.33.3` | Local environment; Pages workflow uses Node 24, so local pass is not canonical CI parity. |
| **Fresh 2026-10-30:** `RELGEO_DOCS_SITE_URL=https://relgeo.github.io RELGEO_DOCS_BASE=/ pnpm build` | PASS; 138 pages | Current checkout generates the declared static route surface with the deployment URL and base path. |
| **Fresh 2026-10-30:** `pnpm check` | PASS; 0 errors, 0 warnings, 0 hints | Current Astro/content/type diagnostics are clean. |
| **Fresh 2026-10-30:** `pnpm test` | PASS; `Docs-site built-output assertions passed.` | Current built output satisfies the selected route, metadata, Markdown, localized navigation, accessibility-shell, stylesheet, and preview-error assertions. |
| `pnpm run test:pages-artifact` after standalone website build | FAIL at missing `dist/playground/index.html` | Confirms the website build alone is not the complete Pages artifact. This is an assembly boundary, not a broken assertion. |
| `playground: pnpm build`, copy `playground/dist` into `relgeo.github.io/dist/playground`, then `pnpm run test:pages-artifact` | PASS; 3 Playground assets checked | Local combined artifact satisfies Pages assertion at root Playground `59a42ae`. |
| Direct `curl` probes for the 13 routes in `smoke-public-site.mjs` | All `HTTP 000`, curl exit 6, DNS resolution failure | Current public runtime is `unverified / environment unavailable`; not a product defect verdict. |
| **Fresh 2026-10-30:** source/output spot checks against `relgeo.github.io/src/` and `dist/en/docs/language-spec/index.html` | No search input/index/no-result implementation found; built English spec contains `Tujuan` and `Cara Membaca` headings | Preserves `WEB-PAGE-003`’s missing query-search sub-capability and `WEB-PAGE-004`’s incomplete English normative-content parity as implementation gaps, not environment failures. |

Historical evidence in Plan 05 and the Master Plan is retained as historical
context only. It does not replace the current public probe, current pinned
revision parity, or current CI result.

## 6. Revision and ownership observations

- Website child HEAD is `5c4576ec83ff7d4beebcbc1553c716711b91db68`, matching the
  website entry in `docs/integration-baseline.json`.
- Root `playground` gitlink is `59a42ae925cf0c21541bc19ccac39f5061b35439`.
- `docs/integration-baseline.json` records Playground `c0de7b0eec38a436f52893404fa420051e3d34e6`.
- Website Pages workflow pins Playground `09ac1cb2773fd9a7046b703b72c8494ade8e315b`.
- Spec gitlink and baseline both point to `b96ba3b23de202227eade06614635ef6717df516`,
  while Pages also pins that same spec SHA.
- Per `docs/REPOSITORY-MAP.md` and the Master Plan, the website owns
  presentation/deployment; `spec` owns normative language meaning; Playground,
  Markdown plugins, and CLI own their runtime behavior.

The Playground mismatch is evidence of revision drift between three sources,
not proof that any one revision is defective. It blocks a claim of synchronized
Pages parity until the pins/baseline/root pointer are reconciled by the owning
workflow.

## 7. Gap map and next validation boundary

| Priority | Gap | Affected IDs | Evidence needed to close it |
| --- | --- | --- | --- |
| P0 | Reconcile root Playground pointer, baseline JSON, and website Pages pin. | `012`, `013`, `014` | Approved child revision, regenerated baseline, Pages build, artifact assertion, and deployment/public smoke for the same revision set. |
| P1 | Make English language-spec presentation genuinely English or explicitly keep it as an intentional mirror with stronger user-facing disclosure. | `004`, `005`, `015` | Normative/content decision plus built output showing correct language content and route metadata. |
| P1 | Decide whether deterministic indexes are sufficient or implement query search. | `003` | Product decision and, if required, search UI/index/no-result behavior plus route/content tests. |
| P1 | Run current browser viewport/keyboard/AX checks against the website itself. | `009`, `010`, `011` | Named browser/toolchain, viewport matrix, AX/keyboard results, and refreshed artifact evidence. |
| P1 | Re-run deployed public smoke after the relevant Pages deployment is reachable. | `001`, `007`, `011`, `012`, `013`, `014`, `015` | 13 route responses, final deployment URL, artifact revision, console/browser result, and current workflow run. |
| P2 | Add a full internal-link/content-route crawler beyond selected built-output assertions. | `001`, `002`, `005`, `006` | Crawl report mapping every generated internal href to an output route, with intentional external/legacy exceptions. |

## 8. Audit completion check

- [x] Expected catalog IDs were preserved and compared one by one.
- [x] Discovery sources and coverage are recorded.
- [x] Source, test, UI/menu, shortcut/route, config/platform, runtime, fixture,
  and docs evidence are represented.
- [x] Implemented, partial, absent, broken, deferred, not-applicable, and
  unverified statuses are kept distinct; no unsupported broken claim was made.
- [x] Local build/check/assertion evidence is recorded with environment scope.
- [x] Public DNS failure is recorded as environment unavailable, not as target
  parity failure.
- [x] Remaining gaps have explicit evidence needed for the next validation task.

## 9. Downstream artifacts

- [Expected website/Pages capability catalog](./expected-capability-catalog.md)
- [Expected-versus-observed reconciliation](./reconciliation.md)
- [Website/Pages status matrix](./status-matrix.md)
- [Website/Pages implementation-gap backlog](./implementation-gap-backlog.md)
- [Website/Pages coverage validation and handoff](./coverage-validation-handoff.md)
