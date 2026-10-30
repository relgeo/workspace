# Playground implementation audit

This is the canonical audit entry point for the Playground surface.

The dated evidence log retained from the previous flat layout is
[archive/implementation-audit-legacy.md](./archive/implementation-audit-legacy.md).
The current expected-versus-observed result is maintained in
[reconciliation.md](./reconciliation.md), while the maintainer-facing status
view is [status-matrix.md](./status-matrix.md). The archived log is historical
evidence and must not be read as proof of current CI, registry, deployment, or
runtime status.

## Current audit checkpoint — 2026-10-30

The current checkout was audited against all 37 expected catalog IDs using the
Playground source, focused tests, UX contract script, production build, and
available browser evidence. The one-to-one implementation findings remain in
[reconciliation.md](./reconciliation.md); the bounded active implementation
selection is recorded in [in-scope-selection.md](./in-scope-selection.md).

## Task-bound gap selection

The active local/browser tranche is bounded to the six non-delivery gaps below.
This is a scope handoff, not a claim that any row is complete. The owner for
all six rows is `relgeo/playground`; delegated DSL, geometry, and renderer
semantics remain owned by their respective packages.

| ID | Source paths | Acceptance behavior for downstream work |
| --- | --- | --- |
| `PG-THEME-001` | `playground/src/styles/tokens.css`; `playground/src/index.css`; `playground/src/App.tsx`; `playground/src/__tests__/` | Initial mode is `system` and follows `prefers-color-scheme`; explicit `light` and `dark` overrides work; browser-local persistence is used where available; editor, canvas, controls, diagnostics, focus, and status remain readable. |
| `PG-LIFE-002` | `playground/src/App.tsx`; `playground/src/playground-status.ts`; `playground/src/indexeddb-persistence.ts`; `playground/e2e/playground.spec.ts` | Startup visibly distinguishes bootstrap/restore/resolving/ready/failure and gates interaction without losing source or focus. |
| `PG-CANVAS-005` | `playground/src/App.tsx`; `playground/src/components/Preview.tsx`; `playground/src/view-state.ts`; `playground/src/preview-toolbar.ts`; `playground/src/__tests__/` | A dedicated viewport reset changes camera state only; source, file identity, dirty state, selection, and persisted content remain unchanged. |
| `PG-KEY-001` | `playground/src/App.tsx`; `playground/src/components/Navbar.tsx`; `playground/src/components/FileWorkspacePicker.tsx`; `playground/src/components/Editor.tsx`; `playground/e2e/playground.spec.ts` | Primary file, surface, viewport, diagnostics, drawer/panel, and confirmation actions have documented keyboard access with editable-field and browser-key safety. |
| `PG-A11Y-001` | `playground/scripts/audit-ux-contract.mjs`; `playground/src/App.tsx`; `playground/src/components/Navbar.tsx`; `playground/src/components/Inspector.tsx`; `playground/src/components/Sidebar.tsx`; `playground/src/components/Editor.tsx` | Supported-browser DOM/ARIA and keyboard checks cover landmarks, names, states, announcements, focus return/traps, and source/preview navigation; native AT evidence remains separately labeled. |
| `PG-A11Y-002` | `playground/src/styles/tokens.css`; `playground/src/index.css`; `playground/src/preview-toolbar.ts`; `playground/scripts/audit-ux-contract.mjs`; `playground/e2e/mobile-playground.spec.ts` | Contrast/focus, target size, reduced motion, and non-gesture alternatives pass at supported browser breakpoints; physical-device evidence is deferred or verified explicitly. |

`PG-DELIVERY-001` is intentionally excluded from this implementation tranche:
hosted `/playground/` parity is a delivery verification follow-up and does not
block local capability work. No separate human decision is pending for the
theme contract; its accepted behavior is recorded in the catalog and above.

## Selected capability findings

The following findings are based on the current `playground/src` and
`playground/e2e` checkout, the focused tests under `playground/src/__tests__`,
and the static UX contract audit. `playground/test` is not present; it is not
treated as a failed implementation because the repository's unit-test path is
`playground/src/__tests__`. The source evidence is from Playground submodule
revision `59a42ae` plus uncommitted working-tree changes in the listed source,
test, E2E, and UX-audit files; it is not evidence of a committed or hosted
artifact.

| ID | Implementation finding | Source/test evidence | Evidence status | Limitation or interpretation |
| --- | --- | --- | --- | --- |
| `PG-THEME-001` | **Implemented locally; browser verification pending.** The Playground initializes `system`, follows `prefers-color-scheme`, exposes explicit light/dark overrides, and persists the selection in browser-local storage when available. | `src/theme.ts`; `src/main.tsx`; `src/App.tsx`; `src/components/Navbar.tsx`; `src/styles/tokens.css`; `src/__tests__/theme.test.ts`; `e2e/playground.spec.ts` | `partial-local` | Unit and static source evidence cover the contract; the browser assertion remains unavailable because the Playwright preview server could not bind. |
| `PG-LIFE-002` | **Partial.** `bootstrapPhase` distinguishes opening/restoring/ready/error, and status metadata exposes `LOADING`; first resolve and browser-visible transition coverage are not fully observed. | `src/App.tsx`; `src/playground-status.ts`; `src/__tests__/playground-status.test.ts`; `e2e/playground.spec.ts` | `partial-local` | E2E could not start because the preview server bind was denied; browser behavior remains environment-limited. |
| `PG-CANVAS-005` | **Implemented locally; browser verification pending.** A dedicated camera-only reset sets the zoom/pan baseline and requests fit without changing source; browser proof of file/dirty/selection preservation is unavailable. | `src/view-state.ts`; `src/App.tsx`; `src/components/Navbar.tsx`; `src/components/Preview.tsx`; `src/__tests__/view-state.test.ts`; `e2e/playground.spec.ts` | `partial-local` | Unit/source evidence confirms the separation; E2E is not verified. |
| `PG-KEY-001` | **Implemented locally; browser verification pending.** A centralized Mod+Alt command map covers file, viewport, diagnostics, sidebar, and surface actions with editable-field safety. | `src/keyboard-commands.ts`; `src/__tests__/keyboard-commands.test.ts`; `docs/KEYBOARD-SHORTCUTS.md`; `src/App.tsx`; `e2e/playground.spec.ts` | `partial-local` | Browser execution is environment-limited; native/browser-reserved-key behavior is not promoted beyond source/unit evidence. |
| `PG-A11Y-001` | **Partial.** Landmarks, labels, ARIA states, live diagnostics, focus return/traps, and source/preview navigation are implemented and pass the static contract audit; native AT traversal is not verified. | `scripts/audit-ux-contract.mjs`; `src/App.tsx`; `src/components/Navbar.tsx`; `src/components/Inspector.tsx`; `src/components/Sidebar.tsx`; `src/components/Editor.tsx` | `partial-local` | VoiceOver/TalkBack and device/browser AX evidence remain deferred-device, not absent implementation. |
| `PG-A11Y-002` | **Implemented locally; device verification pending.** Reduced-motion, focus/forced-colors fallback, minimum targets, and non-gesture controls are present and pass the static audit. | `src/index.css`; `src/styles/tokens.css`; `src/preview-toolbar.ts`; `scripts/audit-ux-contract.mjs`; `e2e/mobile-playground.spec.ts` | `deferred-device` | Physical handset/touch evidence remains deferred; static/source evidence does not prove device parity. |

| Evidence | Result | Interpretation |
| --- | --- | --- |
| `pnpm test` in `playground/` | PASS — 17 files / 102 tests | Unit, worker, persistence, preview, helper, theme, keyboard-command, and viewport contracts are green. Tests live under `src/__tests__`; no `playground/test` directory exists. |
| `pnpm build` in `playground/` | PASS — TypeScript and Vite production build | The local production artifact is buildable; Vite emitted only a chunk-size warning, not a build failure. This is not hosted parity evidence. |
| `pnpm run audit:ux` in `playground/` | PASS — 13 component files / 4 approved dynamic inline styles | Static UX, ARIA, focus, responsive, reduced-motion, forced-colors, and inline-style contract checks pass. |
| `pnpm run lint` in `playground/` | PASS | Current Playground source is lint-clean. |
| `pnpm test:e2e` in `playground/` | NOT VERIFIED — environment unavailable | The Playwright preview server failed before page creation while binding `127.0.0.1:4173` with `EPERM`; this does not establish a Playground implementation failure. |

The selected implementation now has local source/test evidence for the system,
light, and dark theme contract (`theme.ts`, `theme.test.ts`, and the theme
selector in `Navbar.tsx`), an explicit bootstrap phase (`App.tsx` and
`playground-status.ts`), a camera-only viewport reset (`view-state.ts`, `App.tsx`,
and `view-state.test.ts`), the centralized keyboard command map
(`keyboard-commands.ts` and `keyboard-commands.test.ts`), and web
input-tolerance additions (minimum file-action targets and forced-colors focus
fallback in `index.css`). Browser assertions for these paths are present in
`playground/e2e/playground.spec.ts`, but remain not verified until the Playwright
server can bind successfully.

The accepted theme contract is fixed for the implementation task: initial
`system` mode follows `prefers-color-scheme`, explicit `light` and `dark`
overrides are supported, and browser-local persistence is used where available.

### Current status interpretation

The catalog/reconciliation now records `34` implemented (`✔️`), `3` partial
(`🌗`), and `0` absent (`❌`). The remaining active debt is limited to
`PG-LIFE-002`, `PG-A11Y-001`, and `PG-DELIVERY-001`; `PG-DELIVERY-001` remains
a hosted-artifact verification follow-up and is not a release prerequisite for
this goal.

The audit does not promote browser E2E, current CI, public Pages parity,
native VoiceOver/TalkBack, or physical handset evidence to verified status.
Rows for file interaction, diagnostics, persistence, share, preview, and
inspection remain implemented at the Playground boundary where the
reconciliation says `✔️`; missing fresh browser evidence is reported as an
evidence limitation, not converted into implementation absence. `➖` and
`⏸️` scope is not treated as active implementation work.
