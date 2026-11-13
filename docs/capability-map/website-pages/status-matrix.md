# Website and Pages capability status matrix

**Tanggal:** 2026-11-13
**Boundary:** expected website/Pages catalog versus implementation audit evidence  
**Status dokumen:** downstream capability-first view; this document does not implement a gap

This matrix is derived from the [expected catalog](./expected-capability-catalog.md),
[implementation audit](./implementation-audit.md), and
[expected-versus-observed reconciliation](./reconciliation.md).
The [implementation-gap backlog](./implementation-gap-backlog.md)
contains candidate work for every `❌` and `🌗` row. The catalog, audit,
reconciliation, matrix, and backlog remain separate artifacts.

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

**Coverage:** 15 expected IDs, 15 matrix rows, 0 missing, 0 duplicate, 0
extra; 6 `✔️`, 9 `🌗`, 0 `❌`, 0 `➖`, 0 `⏸️`, 0 `⚠️`. `WEB-PAGE-007` is
closed at the local website/assembled-handoff boundary; hosted interaction
remains explicitly unverified.

## P0/P1 triage handoff

The implementation-closability decision is recorded in the [gap backlog](./implementation-gap-backlog.md#p0p1-implementation-closability-triage).
At the 2026-11-04 triage, eight P0/P1 rows are selected for local
implementation or fail-closed build/contract work: `WEB-PAGE-003`, `004`,
`005`, `007`, `009`, `010`, `011`, and `012`. Three remaining P0/P1 rows are
retained as evidence-only follow-ups: `WEB-PAGE-013` requires a GitHub Actions
and Pages run, `WEB-PAGE-014` requires reachable public probes, and the P1
portion of `WEB-PAGE-015` requires deployment/CI provenance evidence. Their
owners, source-of-truth paths, acceptance tests, and initial statuses are
defined in the linked table.

This triage does not change the status symbols below. Public deployment,
external crawler/browser evidence, and physical VoiceOver/TalkBack/mobile AT
remain separate boundaries; unavailable or deferred evidence is not converted
into an implementation failure or a local pass.

## Capability-first matrix

| ID | Capability / user outcome | Status | Evidence | Gap / limitation | Owner | Dependency | Risk | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `WEB-PAGE-001` | Route/content discovery across landing, localized, docs, spec, legacy, and Playground handoff routes | `✔️` | `verified-local`; public reachability `unverified-public` | No exhaustive internal-link crawl; public DNS unavailable | website | Astro routes, content collections, Pages base | M | Add generated-route/link crawl; rerun public smoke |
| `WEB-PAGE-002` | Navigation, active location, reading order, language switch, and return paths | `✔️` | `verified-local` selected assertions; broader traversal `observed-local` | Full keyboard traversal is not current evidence | website | `DocsLayout.astro`, docs/spec templates, i18n | M | Run browser keyboard/navigation sweep |
| `WEB-PAGE-003` | Search and wayfinding with query/index context and useful no-result behavior | `🌗` | `verified-local` | Deterministic localized topic index, filtering, live count, and no-result state are implemented; query/server search and browser sweep remain open | website | Docs/reference information architecture; product decision if query search is required | H | Re-audit the deterministic-index baseline in a browser; keep query search as a separate decision unless the product contract requires it |
| `WEB-PAGE-004` | Indonesian/English route switching with equivalent context and honest language status | `🌗` | `verified-local` shell; content parity incomplete | English spec route is an editorial mirror of `spec/id`; full English normative parity is not claimed | website + spec | `spec/id`, frozen mirror disclosure, locale loader | H | Preserve the mirror disclosure; add translation only through a separately reviewed parity change |
| `WEB-PAGE-005` | Distinct onboarding, docs, use-case, status, and authoritative reference surfaces | `🌗` | `verified-local` generated docs; `observed-local` content boundary | English language-spec reference remains a mirror, not a complete bilingual normative reference | website + spec | site/docs collections, active spec source, frozen claim contract | H | Review missing English reference content and add parity checks without changing the mirror claim |
| `WEB-PAGE-006` | Copyable examples and first successful source → resolve → preview learning path | `✔️` | `verified-local` build assertions | Prose example semantics are not independently executed by website tests | website + child owners | site fixtures, CLI/Playground/plugin behavior | M | Keep rendered markers and add representative executable example checks |
| `WEB-PAGE-007` | Playground links/embed handoff and documented edit → resolve → preview → inspect flow | `✔️` | `verified-local` artifact assembly; fresh pinned Playground/Website/Markdown consumer checks pass; hosted handoff `unverified-public` | Website handoff and synchronized local artifact are proven; hosted Playground interaction remains an external evidence follow-up | website + Playground/plugins | Playground build, plugin output, Pages assembly | H | Run public browser smoke against the recorded artifact revision when Pages is reachable; do not reopen the local handoff |
| `WEB-PAGE-008` | Orientation among docs, Playground, CLI, Markdown, spec, and richer workbench surfaces | `✔️` | `observed-local` | Command execution belongs to CLI and is outside website runtime evidence | website + child owners | docs navigation, CLI/Playground/plugin contracts | M | Maintain command-intent assertions and ownership links |
| `WEB-PAGE-009` | Usable responsive layout for navigation, code/spec reading, and handoffs | `🌗` | `verified-local` source/build contract; current viewport matrix `unverified` | Built gate covers 640/899/900px breakpoints, containment, and focus styles; native Chrome rendered the local docs route, but the full matrix was unavailable on this host | website + Playground | CSS breakpoints, browser matrix, hosted artifact | M | Run current 640/899/900px browser matrix and capture overflow/focus evidence when a stable runner is available |
| `WEB-PAGE-010` | Keyboard, landmarks, names, focus, state, code semantics, and reduced-motion accessibility | `🌗` | `verified-local` static shell plus native Chrome AX smoke; physical AT `deferred-external` | English/Indonesian docs landmarks, labelled search, active locale, skip-link focus, and localized no-result state were observed; full route traversal and physical AT remain incomplete | website + Playground | browser AX tree, keyboard path, AT hosts | H | Extend browser AX/keyboard audit across the full route matrix; separately reopen physical AT decision |
| `WEB-PAGE-011` | Crawlable metadata, canonical/base-aware URLs, alternates, and sitemap | `🌗` | `verified-local` with deployment env; crawler `unverified-public` | Bare build defaults to `https://example.com`; no external crawler evidence | website | `RELGEO_DOCS_SITE_URL`, Astro config, Pages URL | H | Verify deployed canonical/hreflang/sitemap URLs and run a route/content crawler when Pages is reachable |
| `WEB-PAGE-012` | Reproducible generated artifact with pinned spec/Playground inputs and provenance | `✔️` | `verified-local`; fresh strict Pages provenance and assembled artifact assertions pass | Local artifact contains the Pages-pinned Playground revision, `/playground/` base path, title, manifest, and digests; CI/deployed parity remains a separate boundary | website + root | approved child revision, baseline sync, Pages artifact assertion | H | Preserve the synchronized tuple; attach CI/deployed evidence when the Pages workflow runs |
| `WEB-PAGE-013` | GitHub Pages deployment of reviewed artifact at configured base path | `🌗` | `observed-local`; synchronized inputs verified locally, current CI/deploy `unverified-public` | Workflow pins the synchronized Playground/spec tuple, but no GitHub Actions/Pages deployment run is evidenced | website + root | Pages workflow, pinned inputs, GitHub Actions result | H | Run canonical workflow for the recorded tuple and archive its result |
| `WEB-PAGE-014` | Repeatable artifact, route, asset, and public smoke signal after deployment | `🌗` | local gates pass; public `environment-unavailable` | DNS blocked all 13 public probes; current reliability remains unverified | root + website | deployment reachability, smoke script, artifact gate | H | Re-run 13-route smoke and archive result for deployed artifact |
| `WEB-PAGE-015` | Honest capability, contract/package/application/deployment version status | `🌗` | `verified-local` for explicit claims and synchronized local tuple; provenance/deployment `unverified-public` | Frozen fields and current tuple are explicit; deployed revision remains a separate claim | website + spec + root | status pages, child versions, frozen tuple, integration baseline | H | Preserve separate fields and attach CI/deployment evidence when available |

## Decision and handoff notes

- All 15 expected capabilities are in scope; no row is changed to `➖` because
  evidence or implementation is missing.
- No whole row is `⏸️` or `⚠️`; physical AT is a deferred evidence boundary,
  while incomplete runtime/deployment evidence is recorded as a gap/risk and
  not promoted to a defect without a scoped failing contract.
- `WEB-PAGE-003` is now `🌗`: the selected local baseline is a deterministic
  localized topic index with client-side filtering and explicit no-result
  behavior. Query/server search is not claimed, so the capability is not
  promoted to `✔️`.
- `WEB-PAGE-004`, `WEB-PAGE-005`, and `WEB-PAGE-015` follow the frozen
  claim/locale/provenance contract: `/en` language-spec routes are an editorial
  mirror, and public version claims use distinct fields and source revisions.
- Public DNS failure, absent current CI results, and deferred device checks are
  evidence limitations. They do not count as implementation passes or failures.

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
