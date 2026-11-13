# Website and Pages implementation-gap backlog

**Tanggal:** 2026-11-04
**Boundary:** candidate implementation, provenance, decision, and verification work for website/Pages gaps  
**Status dokumen:** historical candidate handoff plus the final closure overlay
below; local implementation evidence and explicit hosted holds are separated
from unresolved future work

This backlog is derived from the [status matrix](./status-matrix.md)
and traces each `❌`/`🌗` result to the [expected catalog](./expected-capability-catalog.md),
[implementation audit](./implementation-audit.md), and
[expected-versus-observed reconciliation](./reconciliation.md).
The rows are candidate goals/tasks for implementation or follow-up validation.
Selected rows may already have local source changes and evidence, but remain
open until their stated acceptance boundary is fully satisfied. No row below is
silently removed because a local check passed.

## Backlog rules

1. Every matrix row with `❌` or `🌗` has exactly one candidate task below.
2. A task may be implementation, product decision, provenance, or verification
   work; its work type is explicit so evidence work is not mistaken for code.
3. Each task has an owner, dependency, risk, acceptance test/evidence target,
   and next action.
4. The expected ID remains unchanged across catalog, audit, reconciliation,
   matrix, and backlog. A documentation row does not close its gap.
5. `➖` is never used for missing implementation. `⏸️` is used only when an
   explicit decision holds work; current gaps remain actionable candidates.

**Historical candidate coverage:** 9 candidate tasks were opened for the
previous 0 `❌` and 9 `🌗` matrix rows. The current status contract is recorded
in the final closure overlay below; historical candidate symbols are retained
only to preserve the before/after trail.

## Final closure overlay — 2026-11-14

The final audit closes the actionable local implementation boundary for
`WEB-PAGE-003`, `004`, `005`, `009`, `010`, `011`, and `015` using the existing
source changes and named regression/build assertions. Together with the six
rows already closed locally (`001`, `002`, `006`, `007`, `008`, `012`), the
current matrix is **13 `✔️`, 0 `🌗`, 0 `❌`, 0 `⚠️`**.

`GAP-WEB-013-PAGES-001` and `GAP-WEB-014-SMOKE-001` remain visible as explicit
`⏸️` whole-row scope holds, not open implementation gaps: hosted GitHub
Actions/Pages execution and public DNS/network reachability are unavailable at
this boundary. They must be reopened when those environments are available.
Physical assistive technology remains a deferred evidence sub-boundary under
`WEB-PAGE-010`, while the browser-verifiable implementation is closed.

| Current closure state | IDs | Evidence boundary |
| --- | --- | --- |
| `✔️` local implementation | `001`, `002`, `003`, `004`, `005`, `006`, `007`, `008`, `009`, `010`, `011`, `012`, `015` | Website build/test, content-integrity, responsive/accessibility, metadata, Markdown, provenance, artifact, and conformance gates |
| `⏸️` explicit hosted scope hold | `013`, `014` | GitHub Actions/Pages deployment and reachable public smoke are not available |

## P0/P1 implementation-closability triage — 2026-11-13

This is the current triage of every P0/P1 candidate row below, including the
P1 portion of `WEB-PAGE-015`. **Implementation-closable** means the remaining
work can be changed and tested at the website/workspace boundary without
requiring a production deployment, a GitHub Actions run, public DNS, or
physical assistive-technology hosts. It does not mean that the whole
capability is already `✔️`; local implementation and external evidence remain
separate dimensions.

Rows marked **selected** are the implementation tranche for this checkout.
Rows marked **evidence-only** remain in the backlog so their external boundary
is explicit, but they must not be treated as proof of a missing local
implementation. The initial status is the status-matrix symbol at triage time.

### Implementation-closable gaps selected for the website tranche

| Candidate / expected ID | Priority | Initial status | Owner | Source of truth | Acceptance test | Triage disposition |
| --- | --- | --- | --- | --- | --- | --- |
| `GAP-WEB-003-SEARCH-001` / `WEB-PAGE-003` | `P1` | `🌗` partial | `relgeo.github.io` docs/information-architecture owner | [`expected-capability-catalog.md`](./expected-capability-catalog.md) row `WEB-PAGE-003`; [`claim-locale-provenance-contract.md`](./claim-locale-provenance-contract.md); `relgeo.github.io/src/pages/[lang]/docs/index.astro`; `relgeo.github.io/scripts/assert-built-output.mjs` | `pnpm build && pnpm test` from `relgeo.github.io` must assert the localized topic index, direct links, live result status, filtering, and explicit no-result state. Query/server search and browser interaction are separate follow-ups. | **Selected implementation gap.** Keep the deterministic local baseline; do not silently expand the contract to query/server search. |
| `GAP-WEB-004-LOCALE-001` / `WEB-PAGE-004` | `P1` | `🌗` partial | Website editorial owner with `spec` owner | Catalog row `WEB-PAGE-004`; [`claim-locale-provenance-contract.md`](./claim-locale-provenance-contract.md); `relgeo.github.io/src/content.config.ts`; `relgeo.github.io/src/lib/i18n.ts`; `spec/id/` | `pnpm check && pnpm build && pnpm test` must prove `/id` and `/en` retain route context and the English language-spec surface explicitly identifies itself as an editorial mirror of normative `spec/id`. | **Selected implementation gap.** Content/loader changes are local; English normative parity remains a separately reviewed spec/content decision. |
| `GAP-WEB-005-REFERENCE-001` / `WEB-PAGE-005` | `P1` | `🌗` partial | `relgeo.github.io` docs owner with spec/editorial reviewers | Catalog row `WEB-PAGE-005`; `relgeo.github.io/src/content/docs/{id,en}/`; localized docs/spec route templates; [`implementation-audit.md`](./implementation-audit.md) §2–§4 | `pnpm build && pnpm test` (including `pnpm run test:content-integrity`) must show reviewed content or an explicit status affordance for every declared English docs/spec route, with locale parity and internal-link checks, without claiming bilingual normative parity. | **Selected implementation gap.** The local integrity gate is implemented; English normative parity remains partial and owned by the spec/editorial review path. |
| `GAP-WEB-009-RESPONSIVE-001` / `WEB-PAGE-009` | `P1` | `🌗` partial | Website layout owner; Playground owns workbench layout | Catalog row `WEB-PAGE-009`; `relgeo.github.io/src/styles/site.css`; `relgeo.github.io/scripts/assert-built-output.mjs`; Plan 05 browser matrix | `pnpm build && pnpm run test:responsive-accessibility` must keep 640/899/900px breakpoints, shrinkable article/code columns, narrow-navigation containment, and focus styles green; a browser viewport matrix is recorded separately when a stable runner exists. | **Selected implementation gap.** Local CSS/build contract is in scope; physical-device behavior and unavailable browser-runner evidence are not inferred. |
| `GAP-WEB-010-A11Y-001` / `WEB-PAGE-010` | `P1` | `🌗` partial | Website accessibility owner; Playground owns workbench controls | Catalog row `WEB-PAGE-010`; `relgeo.github.io/src/layouts/DocsLayout.astro`; `relgeo.github.io/src/styles/accessibility.css`; `relgeo.github.io/scripts/assert-built-output.mjs` | `pnpm build && pnpm run test:responsive-accessibility` plus representative browser AX/keyboard checks must cover landmarks, names, active locale, visible focus, reading order, reduced motion, and non-pointer access. | **Selected implementation gap.** Browser accessibility is active; physical VoiceOver/TalkBack/mobile AT is explicitly scope-deferred evidence. |
| `GAP-WEB-011-SEO-001` / `WEB-PAGE-011` | `P1` | `🌗` partial | `relgeo.github.io` website/build owner | Catalog row `WEB-PAGE-011`; `relgeo.github.io/astro.config.mjs`; `relgeo.github.io/src/pages/sitemap.xml.ts`; `relgeo.github.io/src/layouts/DocsLayout.astro` | `RELGEO_DOCS_REQUIRE_PUBLIC_URL=1 RELGEO_DOCS_SITE_URL=https://relgeo.github.io pnpm build && pnpm test` plus the negative placeholder-URL gate must emit base-aware canonical, hreflang, and sitemap URLs with crawlable HTML. External crawler verification remains separate. | **Selected implementation gap.** Deployment-aware local metadata and the fail-closed URL gate are implementation work; public crawler evidence is not. |

### Remaining P0/P1 rows accounted for but not selected as local implementation gaps

| Candidate / expected ID | Priority | Initial status | Owner | Source of truth | Acceptance test / evidence target | Triage disposition |
| --- | --- | --- | --- | --- | --- | --- |
| `GAP-WEB-013-PAGES-001` / `WEB-PAGE-013` | `P0` | `🌗` partial | Website deployment owner + root integration owner | `relgeo.github.io/.github/workflows/pages.yml`; [`docs/integration-baseline.json`](../../integration-baseline.json); Pages artifact contract | Canonical GitHub Actions workflow must complete build, upload, deploy, and post-deploy smoke for one synchronized tuple, with run URL and artifact revision archived. | **Evidence-only.** Workflow implementation exists locally; execution/parity requires GitHub Actions and Pages state. |
| `GAP-WEB-014-SMOKE-001` / `WEB-PAGE-014` | `P1` | `🌗` partial | Root release owner + website workflow owner | `relgeo.github.io/scripts/smoke-public-site.mjs`; Pages deployment URL; artifact assertions | The 13 declared route/asset probes must return expected statuses/content markers for the same deployed revision as the artifact assertion; DNS/network failures remain environment-unavailable. | **Evidence-only.** Public reachability and reliability cannot be closed from this checkout. |
| `GAP-WEB-015-STATUS-001` / `WEB-PAGE-015` | `P1/P2` | `🌗` partial | Website editorial owner + spec/package/root owners | [`claim-locale-provenance-contract.md`](./claim-locale-provenance-contract.md); status pages; child revisions; [`docs/integration-baseline.json`](../../integration-baseline.json) | Compare public DSL/package/application/source/deployment fields against the synchronized tuple and current deployment evidence; never collapse them into one generic version claim. | **Evidence-only follow-up.** Local claim/provenance implementation is present; deployment/CI evidence remains external. |

### Triage accounting

| Check | Result |
| --- | ---: |
| P0/P1 candidate rows reviewed | 9 |
| Selected implementation-closable rows | 6 (`WEB-PAGE-003`, `004`, `005`, `009`, `010`, `011`) |
| Evidence-only rows retained | 3 (`WEB-PAGE-013`, `014`, `015`) |
| Whole rows scope-deferred | 0 |
| Selected rows with owner, source of truth, acceptance test, and initial status | 6/6 |

## Closed local-boundary records — 2026-11-13

| Candidate | Closure evidence | Boundary still open |
| --- | --- | --- |
| `GAP-WEB-007-HANDOFF-001` / `WEB-PAGE-007` | Workflow-pinned Playground build, website build/test, Markdown consumer assertions, and assembled Pages artifact checks pass. | Hosted Playground interaction and public smoke. |
| `GAP-WEB-012-ARTIFACT-001` / `WEB-PAGE-012` | `provenance:pages`, `test:pages-artifact`, and `playground:artifact:check` pass with Playground `23fd02c…`, spec `26ff532…`, and matching baseline/workflow pins. | Hosted CI/deployment parity and public smoke. |

The physical VoiceOver/TalkBack/mobile AT boundary under `WEB-PAGE-010` is
scope-deferred evidence, not a whole-row deferral and not a local
implementation prerequisite. No status symbol changes as a result of this
triage. The locked success, failure/edge, and evidence contract for the eight
selected rows is recorded in the [reconciliation contract lock](./reconciliation.md#contract-lock-for-selected-p0p1-gaps--2026-11-04).

## Candidate goal G-WEB-01 — Close search and reference wayfinding

**Scope:** Website documentation/spec discovery only; decide and implement the
minimum complete wayfinding outcome without making the site a runtime/CLI
owner.  
**Owner:** website/docs information architecture  
**Dependency:** frozen claim/locale/provenance contract; query/server search remains a separate product decision
**Risk:** high; reference readers may fail to locate contract topics

| Candidate task | Expected ID | Priority | Work type | Acceptance test / evidence target | Next action |
| --- | --- | --- | --- | --- | --- |
| `GAP-WEB-003-SEARCH-001` define and implement the baseline search/wayfinding contract | `WEB-PAGE-003` | P1 | decision + implementation | The frozen baseline is a deterministic localized topic index with client-side filtering, direct route links, live result status, and an explicit no-result state; built-output assertions pass. It does not claim query/server search or public search reliability. | Re-audit the deterministic index in a browser; open a separate product change only if query/server search is later required. |

## Candidate goal G-WEB-02 — Close language, reference, and claim consistency

**Scope:** Website localization, language-spec presentation, and public
version/provenance claims; does not rewrite the normative DSL contract owned by
`spec/id`.  
**Owner:** website editorial owner + spec owner  
**Dependency:** frozen `spec/en` editorial-mirror policy and active contract revision
**Risk:** high; English readers can mistake Indonesian normative content for a translated contract

| Candidate task | Expected ID | Priority | Work type | Acceptance test / evidence target | Next action |
| --- | --- | --- | --- | --- | --- |
| `GAP-WEB-004-LOCALE-001` align English language-spec behavior with declared policy | `WEB-PAGE-004` | P1 | decision + content/loader implementation | The current local presentation must say that `/en` is an editorial mirror of `spec/id`, not a translated normative contract, link to the Indonesian language spec, and avoid any full-parity implication; built-output assertions pass. | Preserve the frozen disclosure; only replace it after a separately reviewed `spec/en` translation proves parity for the declared surface. |
| `GAP-WEB-005-REFERENCE-001` complete bilingual docs/reference parity for the declared surface | `WEB-PAGE-005` | P1 | content + verification | Generated English docs/spec routes have usable content or an explicit status affordance, while the authoritative `spec/id` source and English editorial mirror remain distinguishable. Full bilingual normative reference parity remains partial. | Inventory and review missing English reference content, then add locale-coverage/internal-link checks before changing the `🌗` status. |
| `GAP-WEB-015-STATUS-001` enforce capability/version/provenance consistency in public claims | `WEB-PAGE-015` | P1/P2 | provenance + test | Public claims use separate DSL/package/application/source/deployment fields; current local tuple is website `6c3954c…`, spec `26ff532…`, and Playground `23fd02c…`, with the latter two matching Pages pins. Deployment revision remains separate. | Retain the gate and update deployment fields only when corresponding CI/deployment/public evidence is available. |

## Candidate goal G-WEB-03 — Close Pages deployment and public smoke evidence

**Scope:** Website Pages assembly, root revision coordination, deployment, and
public smoke evidence; Playground/CLI/plugin runtime behavior remains owned by
their repositories.  
**Owner:** website deployment owner + root integration owner  
**Dependency:** one approved Playground revision, synchronized integration baseline, and available Pages workflow/public host  
**Risk:** high; public artifact may be assembled from revisions different from the reviewed baseline

| Candidate task | Expected ID | Priority | Work type | Acceptance test / evidence target | Next action |
| --- | --- | --- | --- | --- | --- |
| `GAP-WEB-013-PAGES-001` prove canonical Pages deployment for synchronized inputs | `WEB-PAGE-013` | P0 | deployment verification | Canonical Pages workflow completes build, artifact upload, deploy, and post-deploy smoke for the same website/spec/Playground revisions; run URL and artifact revision are archived. | Trigger or observe the canonical workflow after pin synchronization and retain its run evidence. |
| `GAP-WEB-014-SMOKE-001` establish current public reliability evidence | `WEB-PAGE-014` | P1 | runtime verification | All declared route/asset probes return expected statuses and content markers; artifact assertions and public smoke reference the same deployment revision, with DNS/network failures recorded separately. The 2026-11-03 attempt stopped at `/` after `fetch failed`, and direct curl recorded DNS resolution failure, so no public defect is inferred. | Rerun the 13-route smoke when `relgeo.github.io` resolves and attach the result to the release evidence. |

## Candidate goal G-WEB-04 — Close responsive, accessibility, and SEO evidence

**Scope:** Browser-based responsive, accessibility, metadata, and crawlability
evidence for the website artifact; physical handset and VoiceOver/TalkBack
validation remain separately deferred by scope decision.  
**Owner:** website quality owner  
**Dependency:** runnable browser/viewport and accessibility inspection environment  
**Risk:** medium-high; static source evidence can hide interaction or crawlability failures

| Candidate task | Expected ID | Priority | Work type | Acceptance test / evidence target | Next action |
| --- | --- | --- | --- | --- | --- |
| `GAP-WEB-009-RESPONSIVE-001` verify responsive behavior across the declared browser matrix | `WEB-PAGE-009` | P1 | runtime verification | The built-output gate now asserts 640/899/900px breakpoint CSS, shrinkable article columns, scrollable narrow navigation, focus styles, and all generated route shells. A native Chrome local smoke rendered the docs route; the complete 640/899/900 viewport matrix remains unverified because the headless browser aborted on this host. | Run the exact browser viewport matrix against the assembled site when a stable browser runner is available and archive screenshots/measurements. |
| `GAP-WEB-010-A11Y-001` execute current browser accessibility and keyboard evidence | `WEB-PAGE-010` | P1 | accessibility verification | Built-output assertions cover landmarks, labels, active locale, focus treatment, reduced motion, and localized search states. Native Chrome AX smoke verified the English/Indonesian docs landmarks, skip-link focus, and no-result/filtered states; physical AT remains separate. | Extend the browser AX/keyboard sweep across the full route matrix when the browser runner is stable; keep physical AT separately deferred. |
| `GAP-WEB-011-SEO-001` make deployment-aware SEO metadata and crawlability release-gated | `WEB-PAGE-011` | P1 | build + runtime verification | Deployment builds reject `https://example.com` when the public-site gate is enabled; configured local output emits canonical/hreflang/sitemap URLs and crawlable HTML. External crawler/public verification remains open. | Verify deployed metadata and sitemap after Pages publish, then run a route/content crawler against the reachable artifact. |

## Candidate ordering and explicit non-closure

1. **P0:** `GAP-WEB-012-ARTIFACT-001` and `GAP-WEB-013-PAGES-001` because
   provenance is a prerequisite for reliable public evidence.
2. **P1:** `GAP-WEB-003-SEARCH-001`, `GAP-WEB-004-LOCALE-001`, and
   `GAP-WEB-005-REFERENCE-001` because they affect discoverability and contract
   comprehension.
3. **P1:** `GAP-WEB-007-HANDOFF-001`, `GAP-WEB-014-SMOKE-001`,
   `GAP-WEB-009-RESPONSIVE-001`, `GAP-WEB-010-A11Y-001`, and
   `GAP-WEB-011-SEO-001` for current user-facing release evidence.
4. **P1/P2:** `GAP-WEB-015-STATUS-001` after the revision/version source fields
   are synchronized.

Creating this backlog does not change any matrix status, does not make public
deployment evidence available, and does not count documentation as an
implementation. A task can close only after its acceptance evidence is
produced and the corresponding capability row is deliberately re-audited.

## Evidence and ownership sources

| Source | Backlog role |
| --- | --- |
| [`relgeo.github.io`](../../../relgeo.github.io) — routes/content, layouts, Pages workflow, artifact assertions, and public smoke | Identifies the website-owned implementation boundary and the concrete build/deployment evidence each task must produce |
| [`docs/MATURATION-MASTER-PLAN.md`](../../MATURATION-MASTER-PLAN.md) | Supplies roadmap, public-surface gates, release/evidence expectations, and deferred external-validation boundaries |
| [`docs/REPOSITORY-MAP.md`](../../REPOSITORY-MAP.md) | Defines ownership and prevents website backlog tasks from silently claiming CLI, Playground, plugin, or normative spec implementation |
| [Expected catalog](./expected-capability-catalog.md) and [reconciliation](./reconciliation.md) | Define the expected IDs, observed gaps, status symbols, and evidence states that the backlog is allowed to address |
| [Implementation audit](./implementation-audit.md) and [status matrix](./status-matrix.md) | Provide path-level findings, risks, dependencies, and the non-green rows covered by candidate tasks |

## Source links

- [Expected website/Pages capability catalog](./expected-capability-catalog.md)
- [Website/Pages implementation audit](./implementation-audit.md)
- [Expected-versus-observed reconciliation](./reconciliation.md)
- [Website/Pages status matrix](./status-matrix.md)
- [Coverage validation and handoff](./coverage-validation-handoff.md)
- [Maturation master plan](../../MATURATION-MASTER-PLAN.md)
- [Repository map](../../REPOSITORY-MAP.md)
