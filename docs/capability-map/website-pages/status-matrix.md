# Website and Pages capability status matrix

**Tanggal:** 2026-11-14
**Boundary:** expected website/Pages catalog versus implementation audit evidence  
**Status dokumen:** downstream capability-first view; this document does not implement a gap

This matrix is derived from the [expected catalog](./expected-capability-catalog.md),
[implementation audit](./implementation-audit.md), and
[expected-versus-observed reconciliation](./reconciliation.md).
The [implementation-gap backlog](./implementation-gap-backlog.md) records the
closed local-boundary work and the two explicit hosted-scope holds. The catalog,
audit, reconciliation, matrix, and backlog remain separate artifacts.

## Status and evidence rules

| Status | Meaning |
| --- | --- |
| `✔️` | Expected user outcome is implemented at the audited local boundary. |
| `🌗` | Implementation or evidence is partial; the expected outcome is not fully closed. |
| `❌` | Expected capability was checked and is absent in full; the row remains explicit. |
| `➖` | Not applicable to this owner boundary; not used for a missing capability. |
| `⏸️` | Intentionally held by a product/scope decision; not used to hide an implementation gap. |
| `⚠️` | Confirmed defect, contract mismatch, or provenance inconsistency. |

Evidence is a separate axis: `verified-local`, `observed-local`,
`unverified-public`, `environment-unavailable`, and `deferred-external` are
not status substitutions. A documentation row or a gap row is not evidence
that implementation exists.

**Coverage:** 15 expected IDs, 15 matrix rows, 0 missing, 0 duplicate, 13
`✔️`, 0 `🌗`, 0 `❌`, 0 `➖`, 2 `⏸️`, 0 `⚠️`. `WEB-PAGE-013` and
`WEB-PAGE-014` are explicit hosted-boundary holds; all other rows are closed
at the declared local implementation boundary.

## P0/P1 triage handoff

The final closure-scope decision is recorded in the [bounded selection](./in-scope-selection.md#final-closure-scope-decision--2026-11-14)
and [gap backlog](./implementation-gap-backlog.md#final-closure-overlay--2026-11-14).
Rows `WEB-PAGE-001` through `012` and `WEB-PAGE-015` are closed for their
declared local presentation, browser, metadata, claim, or artifact contract.
`WEB-PAGE-013` requires hosted workflow/deployment evidence and `WEB-PAGE-014`
requires a reachable public host, so those two rows are held explicitly.

This triage does not change the status symbols below. Public deployment,
external crawler/browser evidence, and physical VoiceOver/TalkBack/mobile AT
remain separate boundaries; unavailable or deferred evidence is not converted
into an implementation failure or a local pass.

## Capability-first matrix

| ID | Capability / user outcome | Status | Evidence | Gap / limitation | Owner | Dependency | Risk | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `WEB-PAGE-001` | Route/content discovery across landing, localized, docs, spec, legacy, and Playground handoff routes | `✔️` | `verified-local`; public reachability `unverified-public` | No exhaustive internal-link crawl; public DNS unavailable | website | Astro routes, content collections, Pages base | M | Add generated-route/link crawl; rerun public smoke |
| `WEB-PAGE-002` | Navigation, active location, reading order, language switch, and return paths | `✔️` | `verified-local` selected assertions; broader traversal `observed-local` | Full keyboard traversal is not current evidence | website | `DocsLayout.astro`, docs/spec templates, i18n | M | Run browser keyboard/navigation sweep |
| `WEB-PAGE-003` | Search and wayfinding with query/index context and useful no-result behavior | `✔️` | `verified-local` | Deterministic localized topic index, filtering, live count, and no-result state are the declared local contract; query/server search is outside this scope | website | Docs/reference information architecture; query search remains a future product decision | H | Preserve the deterministic index contract |
| `WEB-PAGE-004` | Indonesian/English route switching with equivalent context and honest language status | `✔️` | `verified-local` | Route context, switcher, and editorial-mirror disclosure are implemented; no false translation or normative-parity claim is made | website + spec | `spec/id`, frozen mirror disclosure, locale loader | H | Preserve the mirror disclosure; translation remains a separate spec decision |
| `WEB-PAGE-005` | Distinct onboarding, docs, use-case, status, and authoritative reference surfaces | `✔️` | `verified-local` | Declared docs/reference routes have usable content or explicit status affordances; authoritative `spec/id` remains distinguishable from English editorial content | website + spec | site/docs collections, active spec source, frozen claim contract | H | Preserve locale-integrity assertions and mirror disclosure |
| `WEB-PAGE-006` | Copyable examples and first successful source → resolve → preview learning path | `✔️` | `verified-local` build assertions | Prose example semantics are not independently executed by website tests | website + child owners | site fixtures, CLI/Playground/plugin behavior | M | Keep rendered markers and add representative executable example checks |
| `WEB-PAGE-007` | Playground links/embed handoff and documented edit → resolve → preview → inspect flow | `✔️` | `verified-local`; fresh pinned Playground/Website/Markdown consumer checks pass | Hosted Playground interaction remains an external evidence follow-up | website + Playground/plugins | Playground build, plugin output, Pages pin, hosted runtime | H | Run public browser smoke when Pages is reachable |
| `WEB-PAGE-008` | Orientation among docs, Playground, CLI, Markdown, spec, and richer workbench surfaces | `✔️` | `observed-local` | Command execution belongs to CLI and is outside website runtime evidence | website + child owners | docs navigation, CLI/Playground/plugin contracts | M | Maintain command-intent assertions and ownership links |
| `WEB-PAGE-009` | Usable responsive layout for navigation, code/spec reading, and handoffs | `✔️` | `verified-local` source/build contract; native Chrome local rendering | The declared local contract covers 640/899/900px breakpoints, containment, and focus styles; physical-device behavior is separate evidence | website + Playground | CSS breakpoints, browser matrix, hosted artifact | M | Preserve the responsive assertions; rerun hosted/device evidence only when available |
| `WEB-PAGE-010` | Keyboard, landmarks, names, focus, state, code semantics, and reduced-motion accessibility | `✔️` | `verified-local` static shell plus native Chrome AX smoke | English/Indonesian docs landmarks, labelled search, active locale, skip-link focus, localized states, and reduced motion are covered; physical AT is a deferred sub-boundary | website + Playground | browser AX tree, keyboard path, AT hosts | H | Preserve browser AX/keyboard assertions; keep physical AT separately deferred |
| `WEB-PAGE-011` | Crawlable metadata, canonical/base-aware URLs, alternates, and sitemap | `✔️` | `verified-local` with deployment env; external crawler separate | Configured builds emit canonical, alternates, sitemap, and crawlable HTML; bare placeholder URL is rejected when the release gate is enabled | website | `RELGEO_DOCS_SITE_URL`, Astro config, Pages URL | H | Preserve fail-closed URL and generated metadata assertions |
| `WEB-PAGE-012` | Reproducible generated artifact with pinned spec/Playground inputs and provenance | `✔️` | `verified-local`; fresh strict Pages provenance and assembled artifact assertions pass | Hosted CI/deployment parity remains separate | website + root | approved child revision, baseline sync, Pages artifact assertion | H | Retain the immutable tuple in the Pages workflow and archive the hosted run when available |
| `WEB-PAGE-013` | GitHub Pages deployment of reviewed artifact at configured base path | `⏸️` | `observed-local` workflow/configuration; CI/deploy `unverified-public` | Workflow/configuration and synchronized inputs are present, but hosted execution is unavailable in this closure boundary | website + root | Pages workflow, pinned inputs, GitHub Actions result | H | Reopen only with a hosted workflow/deployment run; explicit scope hold |
| `WEB-PAGE-014` | Repeatable artifact, route, asset, and public smoke signal after deployment | `⏸️` | local gates pass; public `environment-unavailable` | Smoke stopped at `/` with `fetch failed`; no public defect is inferred, but public reliability cannot be asserted locally | root + website | deployment reachability, smoke script, artifact gate | H | Reopen when the declared public host is reachable; explicit scope hold |
| `WEB-PAGE-015` | Honest capability, contract/package/application/deployment version status | `✔️` | `verified-local` for explicit claims and synchronized local tuple | Separate DSL/package/application/source/deployment fields are explicit; deployment revision remains deliberately unclaimed | website + spec + root | status pages, child versions, frozen tuple, integration baseline | H | Preserve separate fields and provenance markers |

## Decision and handoff notes

- All 15 expected capabilities remain represented; no row is `➖`.
- `WEB-PAGE-013` and `WEB-PAGE-014` are the only whole-row `⏸️` decisions,
  explicitly held for hosted workflow/deployment/public evidence.
- `WEB-PAGE-003` closes the declared deterministic localized index contract;
  query/server search is a separate future product decision, not a hidden
  implementation requirement.
- `WEB-PAGE-004`, `WEB-PAGE-005`, and `WEB-PAGE-015` follow the frozen
  claim/locale/provenance contract: `/en` language-spec routes are an editorial
  mirror, and public version claims use distinct fields and source revisions.
- Public DNS failure, absent current CI results, and deferred device checks are
  evidence limitations. They do not count as implementation passes or failures.
- The current final overlay is 13 `✔️`, 0 `🌗`, and 2 explicit `⏸️` holds:
  `WEB-PAGE-013` and `WEB-PAGE-014`. Hosted interaction, deployment, and
  public smoke are not promoted from local evidence.

## Evidence source index

The matrix is a reporting view, not a replacement for the source artifacts.
Its status and action columns are grounded in the following evidence chain:

| Evidence source | Matrix role |
| --- | --- |
| [`relgeo.github.io`](../../../relgeo.github.io) — Astro routes/content/layouts, Pages workflow, build/artifact assertions, and public smoke script | Website implementation, UI/route/menu, configuration, generated artifact, and runtime observations |
| [`docs/MATURATION-MASTER-PLAN.md`](../../MATURATION-MASTER-PLAN.md) | Product maturation roadmap, public-surface gates, ownership boundaries, and deferred validation decisions |
| [`docs/REPOSITORY-MAP.md`](../../REPOSITORY-MAP.md) | Repository ownership and website-versus-spec/Playground/CLI/plugin responsibility boundaries |
| [Expected catalog](./expected-capability-catalog.md) | User outcomes and scope-first expected capability set |
| [Implementation audit](./implementation-audit.md) | Path-level implementation, test, artifact, and runtime evidence; unavailable environments remain explicitly unverified |
| [Expected-versus-observed reconciliation](./reconciliation.md) | One-to-one status assignment and separate evidence/scope dimensions |

## Source links

- [Expected website/Pages capability catalog](./expected-capability-catalog.md)
- [Website/Pages implementation audit](./implementation-audit.md)
- [Expected-versus-observed reconciliation](./reconciliation.md)
- [Website/Pages implementation-gap backlog](./implementation-gap-backlog.md)
- [Coverage validation and handoff](./coverage-validation-handoff.md)
- [Maturation master plan](../../MATURATION-MASTER-PLAN.md)
- [Repository map](../../REPOSITORY-MAP.md)
