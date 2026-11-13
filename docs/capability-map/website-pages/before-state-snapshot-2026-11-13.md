# Website/Pages baseline before snapshot — 2026-11-13

This snapshot was written before changing the Website/Pages catalog, status
matrix, backlog, or reconciliation. It is the before-state required by the
closure-boundary task; later documents must not retroactively reinterpret it.

## Frozen checkout and document state

| Boundary | Observed revision/state |
| --- | --- |
| Root workspace | `84c1243` (`chore: synchronize Markdown surface closure evidence`); root worktree clean |
| Website `relgeo.github.io` | `19e967c3988ff6508b7cd4169571c8b3b7d909c2`; child worktree clean |
| Playground | `23fd02c0ba99e40d3973c0482a6177d065f8fa3e`; child worktree clean |
| Normative spec | `26ff53278d77d916b0e0e6c26ca9ab496232fbc0`; child worktree clean |
| Expected catalog | 15 `WEB-PAGE-*` rows |
| Status matrix | 15 rows: 6 `✔️`, 9 `🌗`, 0 `❌`, 0 `➖`, 0 `⏸️`, 0 `⚠️` |
| Reconciliation | 15 rows and a 6/9 status table, but its closing text still says 4 implemented / 11 partial |

The four required artifacts were present before this snapshot, but their
timestamps and claims were not one coherent baseline: catalog `2026-10-30`,
backlog `2026-11-04`, reconciliation `2026-11-07`, and matrix `2026-11-13`.

## Audit observations before rebaseline

| Surface | Before-state observation | Classification |
| --- | --- | --- |
| Website routes/build | `RELGEO_DOCS_SITE_URL=https://relgeo.github.io RELGEO_DOCS_BASE=/ pnpm build` passed and emitted 141 pages. | Local implementation evidence |
| Website assertions | `pnpm test`, `pnpm run test:responsive-accessibility`, and `pnpm run test:content-integrity` passed. | Local test evidence |
| Astro diagnostics | `pnpm check` terminated with Node 22.23.2 heap exhaustion after content/type generation. | Evidence gap at Codex App Server managed sandbox; not a target defect |
| Workspace provenance | `pnpm provenance:check` failed: website `19e967c…` differs from baseline `c5ca17f…`; Playground `23fd02c…` differs from Pages pin `c263920…`. | Provenance/integration gap |
| Pages-input provenance | `RELGEO_PLAYGROUND_ROOT=../playground RELGEO_SPEC_ROOT=../spec pnpm provenance:pages` failed only on the Playground pin mismatch. | Evidence/integration gap; spec pin matched |
| Pages workflow | Workflow pins Playground `c263920146a7ba28fe76561df25d1174b289663b`, spec `26ff53278d77d916b0e0e6c26ca9ab496232fbc0`, Node 24, and pnpm 10.33.3. | Configuration observed; deployment not executed |
| Content/routes | Source route templates cover localized landing/site/docs/spec routes, legacy redirects, sitemap, and `/playground/` handoff. The build generated 141 HTML pages and one sitemap. | Local implementation evidence |
| Content parity | The content-integrity gate passed locale parity, frontmatter, generated routes, and internal links; `/en` language-spec remains an editorial mirror of `spec/id`. | Local evidence plus explicit scope boundary |
| Menu/command orientation | Shared layout and docs index expose Home/Docs/Playground/Language Spec paths; CLI content documents `info`, `compile`, `check`/`validate`, parameters/profiles, and SVG output. | Observed local evidence |
| Public smoke/deployment | No current Pages run or deployed smoke result was available in this baseline capture. | Evidence gap; target/deployment boundary |

## Baseline interpretation

The expected set was not reduced. Every catalog row remains in scope. Before
the after-state is written, the reconciliation must explicitly label each row
as an implementation gap, evidence gap, or scope decision where applicable,
and must remove the 4/11 versus 6/9 contradiction without claiming that local
builds prove Pages deployment or public runtime behavior.
