# Playground coverage validation and handoff

**Validation date:** 2026-11-04

**Scope:** Playground expected catalog, implementation audit, reconciliation,
capability matrices, backlog, source/tests, and available local verification.

This is an evidence handoff, not a claim that the Playground is complete,
production-ready, publicly verified, or fully device-accessible.

## Current result

The 37 expected capability IDs are represented one-to-one in the current
reconciliation, capability matrix, and status matrix. The implementation audit
is intentionally scoped to the six local/browser implementation rows, while
the backlog records the selected rows and their follow-up tasks:

| Status | Count | Meaning at this checkpoint |
| --- | ---: | --- |
| `✔️ implemented` | 34 | Implemented at the Playground source boundary with the evidence qualification shown in the records. |
| `🌗 partial` | 3 | `PG-LIFE-002`, `PG-A11Y-001`, and `PG-DELIVERY-001` retain incomplete behavior or verification boundaries. |
| `❌ absent` | 0 | No selected capability is currently absent at the inspected source boundary. |

The status count does not promote unavailable browser, hosted, native AT, or
physical-device evidence to verified status.

## Verification evidence

| Check | Result | Boundary or limitation |
| --- | --- | --- |
| `pnpm test` in `playground/` | PASS — 17 files / 107 tests | Unit tests live in `playground/src/__tests__`; `playground/test` is not present. Theme, viewport, keyboard, persistence, worker, and existing helper contracts are covered. |
| `pnpm exec vitest run src/__tests__/worker.test.ts src/__tests__/keyboard-commands.test.ts src/__tests__/view-state.test.ts src/__tests__/playground-status.test.ts src/__tests__/persistence.test.ts src/__tests__/theme.test.ts` in `playground/` | PASS — 6 files / 50 tests | Focused lifecycle, worker negative/recovery, viewport, persistence, keyboard, and theme contracts pass. |
| `pnpm build` in `playground/` | PASS | TypeScript and Vite production build completed; only a non-blocking chunk-size warning was emitted. |
| `pnpm audit:ux` in `playground/` | PASS — 13 component files / 4 approved dynamic inline styles | Static UX, ARIA, focus, responsive, reduced-motion, forced-colors, theme, and inline-style contracts pass. |
| `pnpm lint` in `playground/` | PASS | Current Playground source is lint-clean when run independently. |
| `pnpm conformance:fixtures` at workspace root | PASS — 298 assertions across 23 fixtures | Active 0.5 conformance, negative diagnostics, runtime errors, serialization replay, renderer, language-service, highlighting, preview, and CLI consumer checks pass. |
| `pnpm test:e2e` in `playground/` | NOT VERIFIED — environment unavailable | Playwright failed before page creation because the preview server could not bind `127.0.0.1:4173` (`EPERM`). This is not a source or test failure. |
| `pnpm --filter relgeo-docs-site build` in workspace root | PASS | Docs site build completed and generated the local static site used for artifact assembly. |
| `pnpm run provenance:pages` in `relgeo.github.io/` | NOT VERIFIED — pin drift | The checked-out Playground `47fd715…` differs from the Pages workflow pin `c7cec4b…`; the checked-out `spec` also differs from its Pages pin. This is delivery/release evidence, not a local Playground source failure. |
| `pnpm run playground:artifact:check` at workspace root | NOT VERIFIED — baseline drift | Source and assembled artifact were assembled, but the checker rejected the child revision because the integration baseline still pins `c7cec4b…`, not the current local `47fd715…`. |
| `pnpm run test:pages-artifact` in `relgeo.github.io/` | NOT VERIFIED — provenance mismatch | Route/assets were assembled, but the Pages assertion correctly rejected unsynchronized input provenance caused by the pin drift above. |
| Documentation integrity | PASS | Reconciliation, capability matrix, and status matrix each contain the same 37 IDs; the implementation audit contains the six active local/browser rows; selected backlog IDs and follow-up tasks are present; `git diff --check` passes. |

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

The [implementation-gap backlog](./implementation-gap-backlog.md) contains
exactly the three remaining candidate rows. Each has an owner, evidence target,
risk, and next action; none is silently marked complete.

| Candidate | Capability | Owner | Current evidence | Next action |
| --- | --- | --- | --- | --- |
| `PG-TASK-002` | `PG-LIFE-002` startup/loading state | Playground lifecycle owner | `partial-local`; source distinguishes opening/restoring/ready/error, but browser transition and interaction-gating behavior are not observed | Run delayed bootstrap/restore/first-resolve browser checks and refine the visible state if needed. |
| `PG-TASK-005` | `PG-A11Y-001` web accessibility semantics evidence | Playground UI/accessibility owner | `partial-local`; static UX/ARIA/focus contracts pass, browser traversal and native AT remain unavailable | Run supported-browser AX/keyboard checks; record native VoiceOver/TalkBack separately if that scope opens. |
| `PG-TASK-007` | `PG-DELIVERY-001` hosted artifact consistency | Playground + Pages delivery owner | `environment-limited`; local build and `/playground/` base pass, hosted parity is unverified | If delivery verification is separately authorized, compare the hosted artifact with the tested revision and run public smoke. It is not a prerequisite for local capability closure. |

## Explicitly deferred or unavailable evidence

- Playwright browser evidence is unavailable in this environment because the
  local preview server bind receives `EPERM` before page creation.
- Hosted Pages parity and public smoke are not claimed; they remain the
  separate `PG-DELIVERY-001` follow-up and do not block this local goal.
- Local artifact assembly was performed, but provenance checks remain
  unverified because the current checkout differs from the immutable Pages and
  integration-baseline pins (`playground` `47fd715…` vs `c7cec4b…`; `spec`
  also has pin drift). No release or deployment was performed.
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
