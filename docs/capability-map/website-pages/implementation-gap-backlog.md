# Website and Pages implementation-gap backlog

**Tanggal:** 2026-11-03
**Boundary:** candidate implementation, provenance, decision, and verification work for website/Pages gaps  
**Status dokumen:** candidate follow-up handoff; local implementation evidence is recorded, but creating or updating this backlog does not close any implementation gap

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

**Coverage:** 11 candidate tasks for 0 `❌` and 11 `🌗` matrix rows; 4 `✔️`
rows have no implementation-gap task. No task is marked complete.

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
| `GAP-WEB-015-STATUS-001` enforce capability/version/provenance consistency in public claims | `WEB-PAGE-015` | P1/P2 | provenance + test | Public claims use separate DSL/package/application/source/deployment fields and the frozen tuple `website=6eb2e241…`, `spec=b96ba3b2…`, `playground=c7cec4b5…`. The root baseline, Pages pins, and assembled-artifact gate now synchronize this tuple locally. | Retain the gate and update claims only when the corresponding CI, deployment, or public evidence is available; do not collapse those evidence boundaries into the local pass. |

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
| `GAP-WEB-012-ARTIFACT-001` synchronize generated artifact provenance | `WEB-PAGE-012` | P0 | provenance + build gate | The local 138-page build, provenance report, and combined artifact assertion pass for the synchronized website/spec/Playground tuple; the strict gate fails closed if the root baseline, child checkout, workflow pin, or assembled artifact drifts. | Retain the synchronized tuple in CI and archive the Pages run before publishing; do not infer public deployment parity from the local artifact pass. |
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
