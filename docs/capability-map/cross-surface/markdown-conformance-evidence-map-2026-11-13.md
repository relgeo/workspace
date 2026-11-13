# Markdown conformance cross-surface evidence map — 2026-11-13

This map records the revision set and evidence handoff used to reconcile the
Markdown catalog across plugins, language-service, renderer, and Website/Pages.
It is local evidence only; it does not claim registry, deployment, or physical
accessibility reach.

## Revision set

| Surface | Revision observed | Working-tree state |
| --- | --- | --- |
| Workspace orchestration | `fcc7b34` | dirty; conformance runner and capability records changed in this task |
| `remark-relgeo` | `59385a0` | dirty; package implementation/test changes are part of the active worktree |
| `remark-relgeo-hl` | `6d109a9` | dirty; package implementation/test changes are part of the active worktree |
| `renderer-svg` | `07f4b1e` | dirty; renderer metadata escaping and snapshot-compatible output changes are part of the active worktree |
| `language-service` | `962d17a` | dirty or shared-worktree state; language-service evidence is consumed observationally |
| `relgeo.github.io` | `c5ca17f` | dirty; consumer wiring and generated-output evidence are part of the active worktree |

## Shared contract handoff

| Contract family | Source evidence | Consumer evidence | Reconciled rows |
| --- | --- | --- | --- |
| Fence/diagnostic/fallback | plugin package tests, language-service fallback fixtures, root conformance | Website source and generated fixtures | `MD-FENCE-*`, `MD-HL-*`, `MD-DIAG-*`, `MD-ERR-001` |
| Preview/safety/accessibility | renderer safety tests, preview contract validator, root conformance | Website wrapper/asset assertions | `MD-PREVIEW-*`, `MD-ASSET-*`, `MD-A11Y-001` |
| Generic host/order | `scripts/validate-markdown-generic-host.mjs` | generic unified output and host contract | `MD-SSR-001`, `MD-SSR-003` |
| Package boundary | `scripts/validate-markdown-package-boundary.mjs` | fresh temporary consumer imports packed artifacts | `MD-SSR-004` |
| Website/Pages | `relgeo.github.io/scripts/validate-markdown-consumer.mjs` | EN/ID output, provenance, assembled artifact | `MD-WEB-001`–`004` |

## Evidence revision

The 2026-11-13 refresh supersedes stale 2026-11-04 reconciliation claims for
generic host, packed consumer, and preview naming. Remaining partial rows are
listed once in the Markdown status matrix and each has one backlog task or
explicit external disposition. The canonical report is
[`conformance-report-2026-11-13.md`](../markdown-surfaces/conformance-report-2026-11-13.md).

