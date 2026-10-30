# Website and Pages capability status matrix

**Tanggal:** 2026-10-30  
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
extra; 4 `✔️`, 10 `🌗`, 1 `❌`, 0 `➖`, 0 `⏸️`, 0 `⚠️`.

## Capability-first matrix

| ID | Capability / user outcome | Status | Evidence | Gap / limitation | Owner | Dependency | Risk | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `WEB-PAGE-001` | Route/content discovery across landing, localized, docs, spec, legacy, and Playground handoff routes | `✔️` | `verified-local`; public reachability `unverified-public` | No exhaustive internal-link crawl; public DNS unavailable | website | Astro routes, content collections, Pages base | M | Add generated-route/link crawl; rerun public smoke |
| `WEB-PAGE-002` | Navigation, active location, reading order, language switch, and return paths | `✔️` | `verified-local` selected assertions; broader traversal `observed-local` | Full keyboard traversal is not current evidence | website | `DocsLayout.astro`, docs/spec templates, i18n | M | Run browser keyboard/navigation sweep |
| `WEB-PAGE-003` | Search and wayfinding with query/index context and useful no-result behavior | `❌` | `observed-local` | Indexes/sidebars exist, but no query search, search index, or no-result behavior | website | Product decision; docs/reference information architecture | H | Decide deterministic-index baseline versus query search; implement chosen contract |
| `WEB-PAGE-004` | Indonesian/English route switching with equivalent context and honest language status | `🌗` | `verified-local` shell; content parity incomplete | English spec route loads Indonesian source and English source is placeholder | website + spec | `spec/id`, `spec/en` content decision, locale loader | H | Decide translation/mirror policy; build and assert aligned English output |
| `WEB-PAGE-005` | Distinct onboarding, docs, use-case, status, and authoritative reference surfaces | `🌗` | `verified-local` generated docs; `observed-local` content boundary | English language-spec reference is materially incomplete | website + spec | site/docs collections, active spec source | H | Close English reference decision and add content parity checks |
| `WEB-PAGE-006` | Copyable examples and first successful source → resolve → preview learning path | `✔️` | `verified-local` build assertions | Prose example semantics are not independently executed by website tests | website + child owners | site fixtures, CLI/Playground/plugin behavior | M | Keep rendered markers and add representative executable example checks |
| `WEB-PAGE-007` | Playground links/embed handoff and documented edit → resolve → preview → inspect flow | `🌗` | `verified-local` artifact assembly; hosted handoff `unverified-public` | Website handoff exists; current hosted Playground runtime/pin not proven | website + Playground/plugins | Playground build, plugin output, Pages assembly | H | Build pinned Playground, run artifact gate, then public browser smoke |
| `WEB-PAGE-008` | Orientation among docs, Playground, CLI, Markdown, spec, and richer workbench surfaces | `✔️` | `observed-local` | Command execution belongs to CLI and is outside website runtime evidence | website + child owners | docs navigation, CLI/Playground/plugin contracts | M | Maintain command-intent assertions and ownership links |
| `WEB-PAGE-009` | Usable responsive layout for navigation, code/spec reading, and handoffs | `🌗` | `unverified` current viewport runtime | CSS contract exists, but no fresh viewport/device matrix was run | website + Playground | CSS breakpoints, browser matrix, hosted artifact | M | Run current 640/899/900px browser matrix and capture overflow/focus evidence |
| `WEB-PAGE-010` | Keyboard, landmarks, names, focus, state, code semantics, and reduced-motion accessibility | `🌗` | `verified-local` static shell; physical AT `deferred-external` | AX/keyboard browser sweep and screen-reader/device evidence incomplete | website + Playground | browser AX tree, keyboard path, AT hosts | H | Run browser AX/keyboard audit; separately reopen physical AT decision |
| `WEB-PAGE-011` | Crawlable metadata, canonical/base-aware URLs, alternates, and sitemap | `🌗` | `verified-local` with deployment env; crawler `unverified-public` | Bare build defaults to `https://example.com`; no external crawler evidence | website | `RELGEO_DOCS_SITE_URL`, Astro config, Pages URL | H | Make deployment URL assertion mandatory and verify deployed sitemap/canonicals |
| `WEB-PAGE-012` | Reproducible generated artifact with pinned spec/Playground inputs and provenance | `🌗` | `verified-local` assembled artifact; revision parity `unverified` | Root pointer, baseline, and Pages Playground pins differ | website + root | approved child revision, baseline sync, Pages artifact assertion | H | Reconcile pins, regenerate baseline, rebuild combined artifact |
| `WEB-PAGE-013` | GitHub Pages deployment of reviewed artifact at configured base path | `🌗` | `observed-local`; current CI/deploy `unverified-public` | Workflow exists, but current run and synchronized inputs are not evidenced | website + root | Pages workflow, pinned inputs, GitHub Actions result | H | Run canonical workflow for one synchronized revision set |
| `WEB-PAGE-014` | Repeatable artifact, route, asset, and public smoke signal after deployment | `🌗` | local gates pass; public `environment-unavailable` | DNS blocked all 13 public probes; current reliability remains unverified | root + website | deployment reachability, smoke script, artifact gate | H | Re-run 13-route smoke and archive result for deployed artifact |
| `WEB-PAGE-015` | Honest capability, contract/package/application/deployment version status | `🌗` | `observed-local` | English spec output and revision drift prevent full consistency claim | website + spec + root | status pages, child versions, integration baseline | H | Add version/provenance consistency assertions and update claims after pin sync |

## Decision and handoff notes

- All 15 expected capabilities are in scope; no row is changed to `➖` because
  evidence or implementation is missing.
- No whole row is `⏸️` or `⚠️`; physical AT is a deferred evidence boundary,
  while revision drift is recorded as a gap/risk and not promoted to a defect
  without a scoped failing contract.
- `WEB-PAGE-003` stays `❌` because deterministic links do not provide the
  complete expected search/wayfinding outcome.
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
