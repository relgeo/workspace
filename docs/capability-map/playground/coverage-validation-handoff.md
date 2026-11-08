# Playground coverage validation and handoff

**Validation date:** 2026-11-07

**Scope:** Playground expected catalog, implementation audit, reconciliation,
capability matrices, backlog, source/tests, and available local verification.

This is an evidence handoff for the approved local closure boundary. It is not
a claim that the Playground is production-ready, publicly hosted-verified, or
fully device-accessible.

## Current result

The 37 expected capability IDs are represented one-to-one in the current
reconciliation, capability matrix, and status matrix. The implementation audit
joins the full catalog, while the backlog records the three remaining
host/deployment evidence follow-ups:

| Status | Count | Meaning at this checkpoint |
| --- | ---: | --- |
| `✔️ implemented` | 35 | Implemented at the Playground source boundary with the evidence qualification shown in the records; `PG-LIFE-002` is closed locally. |
| `🌗 partial` | 0 | No partial row remains in the approved closure boundary. |
| `❌ absent` | 0 | No selected capability is currently absent at the inspected source boundary. |
| `⏸️ held` | 2 | `PG-A11Y-001` requires browser/native hosts; `PG-DELIVERY-001` requires hosted Pages smoke/parity. |

The status count does not promote unavailable browser, hosted, native AT, or
physical-device evidence to verified status.

## Verification evidence

| Check | Result | Boundary or limitation |
| --- | --- | --- |
| `pnpm test` in `playground/` | PASS — 18 files / 119 tests | Unit tests live in `playground/src/__tests__`; `playground/test` is not present. Bootstrap lifecycle, worker identity/recovery/lifecycle, accessibility helpers, theme, viewport, keyboard, persistence, and consumer contracts are covered. |
| `pnpm build` in `playground/` | PASS | TypeScript and Vite production build completed; only a non-blocking chunk-size warning was emitted. |
| `pnpm audit:ux` in `playground/` | PASS — 13 component files / 4 approved dynamic inline styles | Static UX, ARIA, focus, responsive, reduced-motion, forced-colors, theme, and inline-style contracts pass. |
| `pnpm lint` in `playground/` | PASS | Current Playground source is lint-clean when run independently. |
| `pnpm conformance:fixtures` at workspace root | PASS — 677 assertions across 33 fixtures | Active 0.5 conformance, negative diagnostics, runtime errors, serialization replay, renderer, language-service, highlighting, preview, and CLI consumer checks pass. |
| `pnpm exec playwright test --list` in `playground/` | PASS — 17 tests discovered | Delayed bootstrap, theme, file, viewport, accessibility, mobile, and authoring cases are present in the browser suite. |
| `pnpm exec playwright test` in `playground/` | NOT VERIFIED — environment unavailable | Playwright failed before page creation because the preview server could not bind `127.0.0.1:4173` (`EPERM`). This is not a source or test failure. |
| `pnpm --filter relgeo-docs-site build` in workspace root | PASS | Docs site build completed and generated the local static site used for artifact assembly. |
| `rsync -az --delete playground/dist/ relgeo.github.io/dist/playground/ && (cd relgeo.github.io && pnpm provenance:check && RELGEO_PLAYGROUND_ROOT=../playground RELGEO_SPEC_ROOT=../spec pnpm provenance:pages && pnpm run test:pages-artifact) && pnpm playground:artifact:check` | PASS | Local assembled artifact, route/title/base path, asset manifest/digests, child revisions, Pages workflow pins, and integration baseline agree for Playground `efb7396…`, website `33d7f96…`, spec `26ff532…`, and root `b3d9a4a…`. Hosted public parity remains separate. |
| `pnpm compatibility:check` at workspace root | PASS — 289/289 | Root compatibility rows, package metadata, spec revision, consumer pins, and the synchronized Playground/Pages tuple pass. |
| `pnpm verify:baseline` at workspace root | NOT VERIFIED — dirty worktree | The verifier reports expected dirty child worktrees and existing manifest-vs-gitlink drift; this is a clean-checkout limitation, not a Playground capability failure. |
| `pnpm integration:gate -- --local` at workspace root | NOT VERIFIED — toolchain unavailable | The gate stops before stages because the host is Node `22.23.2` while the gate requires Node `>=24`; no integration result is inferred. |
| Documentation integrity | PASS | The five Playground closure artifacts each contain the same 37 IDs; capability and status matrices each have 37 rows with 0 `🌗`/`❌`/`⚠️` and 2 explicit `⏸️` holds; affected cross-surface rows and `git diff --check` pass. |

## Completed implementation handoff

These rows are implemented locally and remain qualified by their evidence
state in the [reconciliation](./reconciliation.md) and [capability
matrix](./capability-matrix.md):

| Capability | Owner | Evidence | Remaining qualification |
| --- | --- | --- | --- |
| `PG-THEME-001` | `relgeo/playground` UI/product owner | `src/theme.ts`, `main.tsx`, `App.tsx`, `Navbar.tsx`, theme tokens, `theme.test.ts`, UX audit | Browser selector, system preference, and reload assertions await a host where Playwright can bind. |
| `PG-CANVAS-005` | `relgeo/playground` Preview/App owner | Camera-only reset in `view-state.ts`/`App.tsx`, toolbar binding, unit tests, E2E definition | Browser proof that source, file identity, dirty state, and selection remain unchanged is unavailable. |
| `PG-KEY-001` | `relgeo/playground` UI/accessibility owner | Centralized Mod+Alt command map, `KEYBOARD-SHORTCUTS.md`, unit tests, E2E definition | Browser focus and reserved-key conflict behavior remains unverified. |
| `PG-A11Y-002` | `relgeo/playground` UI/accessibility owner | Reduced-motion, forced-colors focus fallback, target sizing, non-gesture controls, UX audit | Physical handset/touch evidence is deferred; source/static evidence is not device proof. |

The accepted theme contract is recorded directly: initial mode is `system`, it
follows browser/OS `prefers-color-scheme`, explicit `light` and `dark` modes
are supported, and browser-local persistence is used where available. No
separate human decision task is required for this contract.

## Remaining actionable handoff

The [implementation-gap backlog](./implementation-gap-backlog.md) retains three
follow-up records for the two host/deployment holds and one local evidence
trace. Each has an owner, evidence target, risk, and next action; none is
silently promoted to browser, native, or hosted verification.

| Candidate | Capability | Owner | Current evidence | Next action |
| --- | --- | --- | --- | --- |
| `PG-TASK-002` | `PG-LIFE-002` startup/loading state | Playground lifecycle owner | `verified-local`; source distinguishes opening/restoring/ready/error, 119 unit tests pass, and browser discovery includes delayed gating; execution is not verified because preview binding returns `EPERM` | Run delayed bootstrap/restore/first-resolve browser checks on a bind-capable host; this is evidence follow-up, not an implementation gap. |
| `PG-TASK-005` | `PG-A11Y-001` web accessibility semantics evidence | Playground UI/accessibility owner | `⏸️ host-unverified`; static UX/ARIA/focus contracts pass, browser traversal and native AT remain unavailable | Run supported-browser AX/keyboard checks, then record native VoiceOver/TalkBack/device evidence separately when hosts are available. |
| `PG-TASK-007` | `PG-DELIVERY-001` hosted artifact consistency | Playground + Pages delivery owner | `⏸️ hosted-unverified`; local route/title/base/manifest/digest/provenance checks pass, hosted parity is unverified | Compare the hosted artifact with the tested revision and run public smoke when Pages is reachable. It is not a prerequisite for local capability closure. |

## Explicitly deferred or unavailable evidence

- Playwright browser evidence is unavailable in this environment because the
  local preview server bind receives `EPERM` before page creation.
- Hosted Pages parity and public smoke are not claimed; they remain the
  separate `PG-DELIVERY-001` follow-up and do not block this local goal.
- Local artifact assembly and strict provenance checks pass for the synchronized
  tuple recorded above. Hosted Pages parity and public smoke remain unverified;
  no release or deployment was performed.
- Native VoiceOver/TalkBack, browser AX-tree traversal, physical handset/touch,
  and platform-specific device evidence remain deferred or unavailable as
  marked. They are not converted into implementation failures.
- No npm publishing, deployment, Ubuntu/Windows runtime, or other deferred OS
  prerequisite is required to validate the scoped local implementation work.

## Evidence index

- [Expected capability catalog](./expected-capability-catalog.md)
- [Current implementation audit](./implementation-audit.md)
- [Expected-versus-observed reconciliation](./reconciliation.md)
- [Playground capability matrix](./capability-matrix.md)
- [Playground status matrix](./status-matrix.md)
- [Implementation-gap backlog](./implementation-gap-backlog.md)
- [`playground/`](../../../playground)
- [`docs/REPOSITORY-MAP.md`](../../REPOSITORY-MAP.md)
- [`docs/MATURATION-MASTER-PLAN.md`](../../MATURATION-MASTER-PLAN.md)
