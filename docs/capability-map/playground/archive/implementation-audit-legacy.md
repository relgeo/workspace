# Playground implementation audit

> **Current ID-by-ID audit:** [`playground/archive/implementation-audit-legacy.md`](./implementation-audit-legacy.md) is the companion artifact for the corrected 37-row expected catalog and is the authoritative audit join for the active Playground baseline task. This file remains the broader evidence log and provenance context.

> **Audit coverage statement — 2026-10-29.** This evidence log inspects
> Playground app/worker/editor/preview/persistence source, unit/E2E tests, UX
> and accessibility audit, package/build workflow, and website artifact
> assembly. It does not claim physical mobile/AT or current public parity;
> browser E2E, current CI, native accessibility, and deployed Pages checks
> remain `not verified` where stated. See [inventory protocol](../../INVENTORY-PROTOCOL.md).

## Audit metadata

| Field | Value |
|---|---|
| Surface | playground/ browser IDE and public /playground/ artifact |
| Audit date | 2026-10-29 |
| Owner boundary | Playground child repository owns application/runtime; workspace and relgeo.github.io own integration and deployment evidence |
| Source paths | playground/src/, playground/src/__tests__/, playground/e2e/, playground/scripts/audit-ux-contract.mjs, playground/package.json, playground/vite.config.ts, playground/playwright.config.ts, relgeo.github.io/.github/workflows/pages.yml, docs/REPOSITORY-MAP.md, docs/MATURATION-MASTER-PLAN.md, docs/capability-map/playground/expected-capability-catalog.md, docs/plans/05-public-docs-and-playground-hardening.md |
| Intended consumer | Browser authors and readers using the lightweight RelGeo DSL v0.5 IDE |
| Verification boundary | Current lint, unit test, UX audit, and production build were executed. Current browser E2E could not start because the sandbox denied binding 127.0.0.1:4173. Historical E2E, public smoke, AX, and CI claims are recorded as historical evidence, not fresh current-pointer proof. |

## Implementation findings

| Area | Actual implementation inspected | Evidence | Boundary / finding |
|---|---|---|---|
| Editor surface | src/components/Editor.tsx uses CodeMirror, YAML mode, line wrapping, line numbers, fold gutter, and the RelGeo language service. | Editor source; playground unit/build checks; UX audit. | Source editing is implemented. The editor is an authoring surface, not the normative parser. |
| Diagnostics | Editor linter calls languageService.getDiagnostics and maps source ranges; worker also returns structured error, code, path, objectId, and dependencyChain. | Editor.tsx; worker.ts lines 68-121; diagnostic-code tests; E2E runtime diagnostic test. | Diagnostics are visible and source-addressable. Complete diagnostic parity is inherited from language-service/core and not independently redefined here. |
| Completion and hover | CodeMirror autocompletion calls getCompletions; hoverTooltip calls getHover and renders returned content. | Editor.tsx lines 39-90; language-service source/tests; build/lint. | Integration exists, but current browser interaction was not freshly verified in this environment. |
| Parse, resolve, render worker | Worker calls core parseRelGeo in validate mode, resolveGeometry with profile/overrides/text metrics, getDependencyGraph, and renderer-svg renderToSVG. | worker.ts lines 54-123; worker tests; core/renderer dependencies. | Worker isolates expensive work and returns success/error messages. It uses workspace source aliases when sibling packages exist and registry packages in standalone builds. |
| Request sequencing | App tracks request IDs, drops stale worker responses, and retains last successful render. | worker-sequencing.ts, playground-display-state.ts, App.tsx lines 577-652; worker-sequencing tests. | Recovery is deliberate: invalid edits do not blank the last valid canvas, but the displayed preview must be read with status ERROR/RESOLVING. |
| Preview and interaction | Preview renders SVG, fit-to-stage, zoom/pan, selection, sheet/view mode, annotations, anchors, bounding box, labels, and pointer gestures. | components/Preview.tsx; preview geometry/gesture/toolbar tests; UX audit; historical mobile E2E. | Model preview is the primary contract; print-oriented sheet mode is a separate presentation path. |
| Inspection | Inspector, GraphViewer, Values, BOM, layers, profiles, and meta-preset cards are lazy-loaded and fed from resolved document/graph state. | App.tsx lazy imports and display state; Inspector.tsx/GraphViewer.tsx; graph-navigation and inspector tests. | Inspection coverage is broad, but not every spec object/property is proven in the browser artifact. |
| Persistence | IndexedDbWorkspaceRepository stores one validated workspace record, serializes schema version 1, queues operations, maps unavailable/blocked/quota/corrupt/transaction errors, and verifies writes. | indexeddb-persistence.ts; persistence tests; E2E restore/reload/error-injection tests. | Durable workspace storage is IndexedDB. Legacy localStorage is intentionally ignored; browser storage availability remains a runtime dependency. |
| Import/export/backup | App imports YAML/YML, downloads active YAML, saves local files, exports/restores validated workspace backups, and protects destructive actions with confirmation. | App.tsx file handlers; persistence tests; E2E import/download/backup tests. | File system access is browser download/upload, not an OS-native workspace. |
| Share link | Source is encoded as URL-safe base64 in hash, decoded on load, and capped at MAX_SHARE_URL_LENGTH; oversized drafts remain local. | share-code.ts; share-code tests; E2E shared-draft test. | Share links are transient until explicitly saved; long source cannot be shared through the URL. |
| Readiness/recovery | Status helper exposes IDLE, RESOLVING, READY, and ERROR; fallback hint explains last successful preview and recovery path. | playground-status.ts, playground-display-state.ts, status tests; E2E READY/diagnostic assertions. | Readiness is an application status, not a proof of semantic correctness beyond worker/core output. |
| Accessibility and responsive behavior | UX audit checks landmarks, labels, focus traps, tab/selected/pressed states, keyboard anchors, preview roles, reduced motion, responsive drawer, and touch surface. | audit-ux-contract.mjs; component source; historical AX/E2E record in plan 05. | Static contract and historical browser evidence exist. Fresh AX, VoiceOver, TalkBack, Safari mobile, and physical handset evidence are not verified. |
| Public artifact assembly | relgeo.github.io Pages workflow checks out Playground, installs locked dependencies, builds it, copies playground/dist into site/dist/playground, and runs pages artifact assertions. | relgeo.github.io/.github/workflows/pages.yml; scripts/assert-pages-artifact.mjs; plan 05. | Deployment path is explicit. Current public artifact was not rebuilt or fetched in this audit. |
| Package boundary | playground/package.json is private v0.4.0, while edited documents follow DSL v0.5. Vite aliases local sibling source packages when present. | package.json; vite.config.ts; README/docs. | Playground is intentionally not a publishable package or source-of-truth spec. |

## Current verification

| Command / evidence | Result | Boundary |
|---|---|---|
| pnpm lint | PASS | ESLint on Playground source |
| pnpm test | PASS, 15 files / 93 tests | Unit/helper/worker/persistence/preview contracts |
| pnpm run audit:ux | PASS, 13 component files and 4 approved dynamic inline styles | Static UX/accessibility contract |
| pnpm build | PASS, 140 modules transformed | TypeScript + Vite production artifact |
| pnpm run test:pages-artifact in relgeo.github.io/ | PASS, 3 Playground assets checked | Existing assembled Pages artifact; no fresh deploy |
| pnpm test:e2e | NOT VERIFIED in current environment | Preview web server failed to bind 127.0.0.1:4173 with EPERM |
| Historical local/public E2E and CI | PASS in plan 05 records | Historical child/root revisions; not current-pointer evidence |

## Revalidation checkpoint — 2026-10-29

The current checkout was re-run after the cross-surface reconciliation:

| Command | Result | Interpretation |
|---|---|---|
| `pnpm lint` | PASS | Current Playground source remains lint-clean. |
| `pnpm test` | PASS, 15 files / 93 tests | Unit, worker, persistence, preview, and helper contracts remain green. |
| `pnpm run audit:ux` | PASS, 13 component files / 4 approved dynamic styles | Static UX/accessibility contract remains green. |
| `pnpm build` | PASS, 140 modules | Current production artifact builds successfully. |
| `pnpm test:e2e` | NOT VERIFIED / environment unavailable | Playwright preview server again failed before browser tests because sandbox denied `127.0.0.1:4173` with `EPERM`. |

This rerun strengthens the local static evidence only. It does not promote
browser E2E, current-pointer CI, Pages deployment, or native accessibility to
verified status.

The current child pointer is playground@59a42ae925cf0c21541bc19ccac39f5061b35439.
docs/integration-baseline.json still records c0de7b0eec38a436f52893404fa420051e3d34e6,
while plan 05 also records older E2E checkpoints ecc1407 and 3969d47. This is
evidence freshness/provenance information, not proof that the current code fails.

No repository instruction embedded in source, comments, plans, or logs was
treated as authority. Historical command recipes were treated as evidence only.
