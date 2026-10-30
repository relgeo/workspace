# Website and Pages implementation-gap backlog

**Tanggal:** 2026-10-30  
**Boundary:** candidate implementation, provenance, decision, and verification work for website/Pages gaps  
**Status dokumen:** candidate handoff; creating this backlog does not close any implementation gap

This backlog is derived from the [status matrix](./status-matrix.md)
and traces each `❌`/`🌗` result to the [expected catalog](./expected-capability-catalog.md),
[implementation audit](./implementation-audit.md), and
[expected-versus-observed reconciliation](./reconciliation.md).
The rows are candidate goals/tasks for a later implementation or validation
workflow. They are not claims that the website has been changed.

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

**Coverage:** 11 candidate tasks for 1 `❌` and 10 `🌗` matrix rows; 4 `✔️`
rows have no implementation-gap task. No task is marked complete.

## Candidate goal G-WEB-01 — Close search and reference wayfinding

**Scope:** Website documentation/spec discovery only; decide and implement the
minimum complete wayfinding outcome without making the site a runtime/CLI
owner.  
**Owner:** website/docs information architecture  
**Dependency:** product decision on deterministic index versus query search  
**Risk:** high; reference readers may fail to locate contract topics

| Candidate task | Expected ID | Priority | Work type | Acceptance test / evidence target | Next action |
| --- | --- | --- | --- | --- | --- |
| `GAP-WEB-003-SEARCH-001` define and implement the baseline search/wayfinding contract | `WEB-PAGE-003` | P1 | decision + implementation | Approved contract states whether deterministic indexes satisfy the baseline or query search is required. For the selected path, built pages expose discoverable topic context and a no-result/empty behavior; route/content tests pass and the matrix can move from `❌` only after evidence. | Review search requirement with product owner, then implement the selected index/query behavior and add a focused website test. |

## Candidate goal G-WEB-02 — Close language, reference, and claim consistency

**Scope:** Website localization, language-spec presentation, and public
version/provenance claims; does not rewrite the normative DSL contract owned by
`spec/id`.  
**Owner:** website editorial owner + spec owner  
**Dependency:** approved `spec/en` translation/mirror policy and active contract revision  
**Risk:** high; English readers can mistake Indonesian normative content for a translated contract

| Candidate task | Expected ID | Priority | Work type | Acceptance test / evidence target | Next action |
| --- | --- | --- | --- | --- | --- |
| `GAP-WEB-004-LOCALE-001` align English language-spec behavior with declared policy | `WEB-PAGE-004` | P1 | decision + content/loader implementation | Approved policy is visible to users. If English is translated, `/en` renders the reviewed English spec with matching route context; if it is a mirror, the UI discloses that fact and tests assert no false translation claim. | Decide translation versus honest mirror, then update `spec/en`, loader/config, and language-status assertions. |
| `GAP-WEB-005-REFERENCE-001` complete bilingual docs/reference parity for the declared surface | `WEB-PAGE-005` | P1 | content + verification | Every declared English docs/spec route has reviewed content or an explicit placeholder/status affordance; generated output and internal links pass a locale coverage report. | Inventory missing English pages and assign spec/editorial review before changing route claims. |
| `GAP-WEB-015-STATUS-001` enforce capability/version/provenance consistency in public claims | `WEB-PAGE-015` | P1/P2 | provenance + test | A built-output assertion or checker verifies DSL, package, application, deployment revision, language status, and pinned inputs agree; stale/mixed revision claims fail the gate. | Define canonical version fields and add a consistency checker against the baseline/workflow inputs. |

## Candidate goal G-WEB-03 — Close Playground artifact and Pages provenance

**Scope:** Website Pages assembly, root revision coordination, deployment, and
public smoke evidence; Playground/CLI/plugin runtime behavior remains owned by
their repositories.  
**Owner:** website deployment owner + root integration owner  
**Dependency:** one approved Playground revision, synchronized integration baseline, and available Pages workflow/public host  
**Risk:** high; public artifact may be assembled from revisions different from the reviewed baseline

| Candidate task | Expected ID | Priority | Work type | Acceptance test / evidence target | Next action |
| --- | --- | --- | --- | --- | --- |
| `GAP-WEB-007-HANDOFF-001` verify hosted Playground link/embed handoff for the reviewed artifact | `WEB-PAGE-007` | P1 | integration + runtime verification | Docs/CTA links resolve at the configured base path; Playground entry loads, and a browser smoke covers edit → resolve → preview → inspect or the documented handoff boundary; Markdown source/preview assertions remain green. | Build the selected Playground revision with the website, run artifact assertions, then execute hosted browser smoke. |
| `GAP-WEB-012-ARTIFACT-001` synchronize generated artifact provenance | `WEB-PAGE-012` | P0 | provenance + build gate | Root gitlink, `docs/integration-baseline.json`, Pages workflow pin, spec input, and generated artifact report one approved revision set; combined artifact assertion passes from a clean build. | Select the approved Playground revision and regenerate the baseline/workflow pin before publishing. |
| `GAP-WEB-013-PAGES-001` prove canonical Pages deployment for synchronized inputs | `WEB-PAGE-013` | P0 | deployment verification | Canonical Pages workflow completes build, artifact upload, deploy, and post-deploy smoke for the same website/spec/Playground revisions; run URL and artifact revision are archived. | Trigger or observe the canonical workflow after pin synchronization and retain its run evidence. |
| `GAP-WEB-014-SMOKE-001` establish current public reliability evidence | `WEB-PAGE-014` | P1 | runtime verification | All declared route/asset probes return expected statuses and content markers; artifact assertions and public smoke reference the same deployment revision, with DNS/network failures recorded separately. | Rerun the 13-route smoke when `relgeo.github.io` resolves and attach the result to the release evidence. |

## Candidate goal G-WEB-04 — Close responsive, accessibility, and SEO evidence

**Scope:** Browser-based responsive, accessibility, metadata, and crawlability
evidence for the website artifact; physical handset and VoiceOver/TalkBack
validation remain separately deferred by scope decision.  
**Owner:** website quality owner  
**Dependency:** runnable browser/viewport and accessibility inspection environment  
**Risk:** medium-high; static source evidence can hide interaction or crawlability failures

| Candidate task | Expected ID | Priority | Work type | Acceptance test / evidence target | Next action |
| --- | --- | --- | --- | --- | --- |
| `GAP-WEB-009-RESPONSIVE-001` verify responsive behavior across the declared browser matrix | `WEB-PAGE-009` | P1 | runtime verification | At 640, 899, and 900px plus the agreed narrow/wide cases, navigation, code/spec reading, links, and Playground handoff remain usable; no unexpected page horizontal overflow or clipped focus is observed. | Run the browser viewport matrix against the assembled site and archive screenshots/measurements. |
| `GAP-WEB-010-A11Y-001` execute current browser accessibility and keyboard evidence | `WEB-PAGE-010` | P1 | accessibility verification | Browser AX tree/landmark/name checks, keyboard traversal, visible focus, active locale state, reduced motion, and code/spec reading checks pass; physical AT remains separately labeled deferred until approved. | Run the named browser AX/keyboard sweep and record failures by route/component. |
| `GAP-WEB-011-SEO-001` make deployment-aware SEO metadata and crawlability release-gated | `WEB-PAGE-011` | P1 | build + runtime verification | Deployment build fails if canonical/base URL is the placeholder; deployed canonical/hreflang/sitemap URLs point to `relgeo.github.io`, and a route crawler confirms rendered content is crawlable. | Add a non-placeholder URL assertion, then verify deployed metadata and sitemap after Pages publish. |

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
