# Markdown closure boundary freeze

**Date:** 2026-11-13  
**Task:** `freeze-markdown-closure-boundary-and-rebaseline-the-complete-expected-catalog--3417556758`  
**Owner:** `relgeo/workspace` with the named package and consumer owners  
**Status:** audit/rebaseline complete; no implementation status promoted

Machine validation for this freeze is defined in
[`scripts/validate-markdown-closure-freeze.mjs`](../../../scripts/validate-markdown-closure-freeze.mjs).

This record freezes the expected Markdown capability boundary before the next
implementation task. Repository content and command output are evidence only;
the normative contract remains in `spec/id` and the compatibility matrix.

## Frozen boundary

The scope contains the complete 38-ID expected catalog for the two Markdown
plugins and their required cross-surface contracts:

- `remark-relgeo`: preview/embed transformation, canonical core/renderer
  delegation, diagnostic/fallback policy, and safe output projection.
- `remark-relgeo-hl`: source-preserving highlighting, token projection, and
  language-service failure containment.
- `language-service`: semantic token and diagnostic vocabulary consumed by the
  highlighter; it is not reimplemented by Markdown.
- `renderer-svg`: semantic SVG serialization and escaping authority; Markdown
  verifies transport safety and does not redraw geometry.
- `relgeo.github.io`: Astro/static Markdown assembly, localized docs, Pages
  artifact, provenance assertions, and host presentation.
- Package boundaries: build, types, ESM/CJS exports, pack/install evidence, and
  documented ordering/options/error contracts.

The frozen expected IDs are the 11 families listed in the [cross-surface impact
register](./cross-surface-impact-register.md): `MD-FENCE-*`,
`MD-PREVIEW-*`, `MD-HL-*`, `MD-DIAG-*`, `MD-OPT-*`, `MD-SSR-*`, `MD-ASSET-*`,
`MD-A11Y-*`, `MD-ERR-*`, `MD-WEB-*`, and `MD-REL-*`. The catalog contains 38
unique expected IDs, one row per capability.

## Source, test, fixture, package, and consumer inventory

| Evidence area | Inventory | What it proves / does not prove |
| --- | --- | --- |
| Plugin source | `remark-relgeo/src/index.ts`; `remark-relgeo-hl/src/index.ts`; `remark-relgeo-hl/src/render.ts` | Adapter implementation, AST projection, escaping, and failure boundaries; not generic-host or registry parity |
| Language-service boundary | `language-service/src/protocol.ts`, `src/service.ts`, and `src/__tests__/` | Token/diagnostic semantics and service behavior; highlighter must preserve source when this boundary fails |
| Renderer boundary | `renderer-svg/src/escape.ts`, `semantic.ts`, `index.ts`, `primitives.ts`, and security/semantic tests | Safe SVG and semantic replay; raw SVG byte equality is not the parity contract |
| Package tests | `remark-relgeo/test/*.test.mjs`; `remark-relgeo-hl/src/__tests__/`; `remark-relgeo-hl/test/package-boundary.test.mjs` | Direct package regressions and packed-boundary assertions; not public registry installation |
| Shared fixtures | `fixtures/manifest.json`, `fixtures/reference/`, `fixtures/expected/`, `scripts/run-conformance-fixtures.mjs` | Root-owned cross-surface conformance and declared fixture status; candidates are not silently promoted |
| Package metadata | both plugin `package.json`, `tsconfig.json`, README, LICENSE, generated `dist/` | Declared exports, types, files, scripts, dependency boundary, and package docs |
| Website/Pages consumer | `relgeo.github.io/astro.config.mjs`, localized Markdown content, `scripts/assert-built-output.mjs`, `assert-pages-artifact.mjs`, `.github/workflows/pages.yml` | Official Astro/static consumer and assembled artifact; not deployed-host or physical AT evidence |
| Normative source | `spec/id/core/06-error-model.md`, `spec/id/presentation/25-views-sheets.md`, `26-metadata.md`, `docs/compatibility-matrix.json` | Semantic error/version/presentation authority and compatibility line; plugins cannot invent a competing taxonomy |

The [implementation audit](./implementation-audit.md) records the detailed
source/test observations and evidence boundaries. This inventory is the
cross-surface join required for the current task, not a replacement for those
records.

## Final green-surface disposition — 2026-11-13

The final audit records 27 `✔️`, 10 explicit `⏸️` scope holds, 1 explicit
`➖` not-applicable boundary, and 0 `🌗`/`❌`/`⚠️` rows. The ten holds are not
cosmetic removals: each is listed with owner, non-blocking rationale, and reopen
condition in the [final closure report](./final-green-surface-closure-report-2026-11-13.md).

The closure report is the final goal-level decision record. It preserves the
distinction between locally implemented behavior and excluded registry,
deployment, product-contract, and physical accessibility work.

## Before-state status and closure join

The exact pre-freeze inputs are preserved in the [before-state
snapshot](./before-state-snapshot-2026-11-13.md). The matrix had 38 rows:
23 `✔️`, 14 `🌗`, 0 `❌`, 0 `⚠️`, 1 `➖`, and 0 `⏸️`.

| Capability ID | Current status | Owner | Source path | Evidence requirement | Next closure task/disposition |
| --- | --- | --- | --- | --- | --- |
| `MD-OPT-002` | `🌗` | `remark-relgeo` + spec/core | `remark-relgeo/src/index.ts`; presentation spec; compatibility matrix | Explicit supported version/profile/view/sheet projection and stable future-version error | `MD-TASK-013` |
| `MD-OPT-003` | `🌗` | both plugins + website | both plugin sources; renderer safety; website consumer | Controlled output/asset policy and custom-hook safety | `MD-TASK-014` |
| `MD-SSR-001` | `🌗` | both plugins + website | package sources; `relgeo.github.io/astro.config.mjs` | Standalone non-browser unified/SSR execution | `MD-TASK-016` |
| `MD-SSR-003` | `🌗` | package + website owners | Astro ordering; package docs | Generic remark → rehype ordering fixture | `MD-VERIFY-001` — external verification, not implementation blocker |
| `MD-SSR-004` | `🌗` | both package owners | both package manifests, `dist/`, package-boundary tests | Fresh packed ESM/CJS/types consumer without workspace-relative dependencies | `MD-TASK-027` |
| `MD-ASSET-001` | `🌗` | `remark-relgeo` + website | preview output; Astro/Pages assembly | Deterministic inline/alternate base URL policy | `MD-TASK-017` |
| `MD-ASSET-003` | `🌗` | both plugins + renderer/host | preview/highlighter output; renderer security tests | Source/meta/custom output cannot cross HTML/SVG/URL boundary unsafely | `MD-TASK-018` |
| `MD-A11Y-001` | `🌗` | `remark-relgeo` + website | preview output; renderer metadata; website CSS | Preview role/name/description and valid wrapper semantics | `MD-TASK-019` |
| `MD-A11Y-002` | `🌗` | both plugins + website | highlighter render; website accessibility assertions | Non-color source/error/fallback semantics | `MD-TASK-020` |
| `MD-ERR-002` | `🌗` | `remark-relgeo` + spec/core | core error model; compatibility matrix | Active/legacy/future version category and source context | `MD-TASK-022` |
| `MD-ERR-003` | `🌗` | `remark-relgeo` + core/renderer | preview failure mapping; renderer safety | Typed safe runtime/render failure projection | `MD-TASK-023` |
| `MD-WEB-004` | `🌗` | website owner | localized docs, Astro routes, Pages scripts | Route/subpath/readability plus separately classified public/AT evidence | `MD-TASK-025` |
| `MD-REL-001` | `🌗` | each package owner | package READMEs/manifests/exports | Independent docs/options/errors and external consumer smoke | `MD-TASK-026` |
| `MD-REL-002` | `🌗` | release/package owners | compatibility matrix and package metadata | Published/version/release-order parity | `MD-VERIFY-002` — external registry/release verification |

The table maps every current `🌗`, `❌`, and `⚠️` row. There were no `❌` or
`⚠️` rows at freeze, so no missing row is hidden behind a cosmetic status
change. `MD-A11Y-003` remains the sole explicit `➖` boundary decision because
the current static plugin output has no plugin-owned controls or focus
management.

## Disposition rules for the next tasks

1. A documentation edit, catalog join, or evidence reclassification does not
   change implementation status.
2. `MD-TASK-*` items are implementation work; `MD-VERIFY-001` and
   `MD-VERIFY-002` are external verification follow-ups and remain separate.
3. npm publish, registry release, deployment production, and host OS access are
   not dependencies for implementing the local package/consumer gaps. If an
   unavailable boundary is checked later, report it as unavailable or
   unverified at that named boundary.
4. Physical mobile/assistive-technology validation remains separately
   classified; it cannot be used to claim a package defect or silently close a
   contract row.
5. Any new capability ID or status row must first be reconciled one-to-one with
   the expected catalog, owner, source path, evidence requirement, and backlog
   disposition.

## Linked evidence

- [Expected capability catalog](./expected-capability-catalog.md)
- [Implementation audit](./implementation-audit.md)
- [Status matrix](./status-matrix.md)
- [Reconciliation](./reconciliation.md)
- [Implementation-gap backlog](./implementation-gap-backlog.md)
- [Before-state snapshot](./before-state-snapshot-2026-11-13.md)
- [Cross-surface impact register](./cross-surface-impact-register.md)
