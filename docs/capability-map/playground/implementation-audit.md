> **Compact desktop UI checkpoint — 2026-10-31:** Current Playground pointer `c7cec4b505f290beccac911ef97786c8f6b0a534` includes the compact file-actions Menu (`8d669f4`), one-row toolbar (`e497d63`), and dot-only preview status with tooltip (`c7cec4b`), following the width/breakpoint work in `f5418e6`. The user reviewed the desktop-width rendering and confirmed the latest layout is good. The 1280 px screenshot and this review support the desktop presentation; hosted Pages parity, a fresh Playwright viewport matrix, and physical handset/AT evidence remain separate and are not claimed here.

# Playground implementation audit

## Delivery provenance update — 2026-11-07

The locally actionable `PG-DELIVERY-001` boundary is now synchronized and
verified. The Playground build emits explicit base-path, title, asset-manifest,
asset-digest, and file-digest provenance. The Pages assertion compares that
manifest with the assembled `/playground/` entrypoint and joins it to strict
workspace and Pages-input provenance.

The verified local tuple is Playground `c263920146a7ba28fe76561df25d1174b289663b`,
website `c5ca17f06476fd2beeb4a48e971265a0e57495c7`, and spec
`26ff53278d77d916b0e0e6c26ca9ab496232fbc0`. Hosted Pages execution, deployed
revision, and public smoke/share remain an explicit `⏸️` delivery hold owned by
the Pages/Playground delivery owners; local parity is not hosted parity.

This is the canonical audit entry point for the Playground surface.

The dated evidence log retained from the previous flat layout is
[archive/implementation-audit-legacy.md](./archive/implementation-audit-legacy.md).
The current expected-versus-observed result is maintained in
[reconciliation.md](./reconciliation.md), while the maintainer-facing status
view is [status-matrix.md](./status-matrix.md). The archived log is historical
evidence and must not be read as proof of current CI, registry, deployment, or
runtime status.

## Current audit checkpoint — 2026-11-07

The current checkout (`playground` child revision
`c263920146a7ba28fe76561df25d1174b289663b`) was audited against all 37 expected catalog IDs using the
Playground source, focused tests, UX contract script, production build, and
available browser evidence. The one-to-one implementation findings remain in
[reconciliation.md](./reconciliation.md); the bounded active implementation
selection is recorded in [in-scope-selection.md](./in-scope-selection.md).
The row-level source/evidence/closure join is recorded in
[closure-register.md](./closure-register.md).

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
revision `c263920146a7ba28fe76561df25d1174b289663b`; the generated build is
local evidence and is not evidence of a hosted artifact.

| ID | Implementation finding | Source/test evidence | Evidence status | Limitation or interpretation |
| --- | --- | --- | --- | --- |
| `PG-THEME-001` | **Implemented locally; browser verification pending.** The Playground initializes `system`, follows `prefers-color-scheme`, exposes explicit light/dark overrides, and persists the selection in browser-local storage when available. | `src/theme.ts`; `src/main.tsx`; `src/App.tsx`; `src/components/Navbar.tsx`; `src/styles/tokens.css`; `src/__tests__/theme.test.ts`; `e2e/playground.spec.ts` | `partial-local` | Unit and static source evidence cover the contract; the browser assertion remains unavailable because the Playwright preview server could not bind. |
| `PG-LIFE-002` | **Implemented locally; browser observation held separately.** `bootstrapPhase` distinguishes opening/restoring/empty/ready/error, bootstrap storage failure is surfaced as `ERROR`, status metadata exposes `LOADING`, and bootstrap interaction is gated. A delayed-bootstrap browser test asserts the loading gate and first interactive transition, but cannot execute in this environment. | `src/App.tsx`; `src/playground-status.ts`; `src/indexeddb-persistence.ts`; `src/__tests__/playground-status.test.ts`; `e2e/playground.spec.ts` | `verified-local` | The targeted E2E could not start because the preview server bind was denied; this is an explicit browser evidence follow-up, not an open source gap. |
| `PG-CANVAS-005` | **Implemented locally; browser verification pending.** A dedicated camera-only reset sets the zoom/pan baseline without requesting fit-to-content, so the fit effect cannot overwrite the deterministic reset; browser proof of file/dirty/selection preservation is unavailable. | `src/view-state.ts`; `src/App.tsx`; `src/components/Navbar.tsx`; `src/components/Preview.tsx`; `src/__tests__/view-state.test.ts`; `e2e/playground.spec.ts` | `partial-local` | Unit/source evidence confirms the separation; E2E is not verified. |
| `PG-KEY-001` | **Implemented locally; browser verification pending.** A centralized Mod+Alt command map covers file, viewport, diagnostics, sidebar, and surface actions; IME composition and AltGraph text-entry chords are explicitly excluded from command handling. | `src/keyboard-commands.ts`; `src/__tests__/keyboard-commands.test.ts`; `docs/KEYBOARD-SHORTCUTS.md`; `src/App.tsx`; `e2e/playground.spec.ts` | `partial-local` | Browser execution is environment-limited; native/browser-reserved-key behavior is not promoted beyond source/unit evidence. |
| `PG-A11Y-001` | **Implemented web semantics; host evidence held.** Landmarks, labels, ARIA states, atomic live status/diagnostics, focus return/traps, and source/preview navigation are implemented and pass the static contract audit; supported-browser traversal cannot execute here and native AT is separately held. | `scripts/audit-ux-contract.mjs`; `src/App.tsx`; `src/components/Navbar.tsx`; `src/components/Inspector.tsx`; `src/components/Sidebar.tsx`; `src/components/Editor.tsx`; `e2e/playground.spec.ts`; `e2e/mobile-playground.spec.ts` | `verified-local; host-unverified` | `⏸️` hold owned by the Playground UI/accessibility owner: the browser runner cannot bind and no native AT/device host is available. These evidence boundaries are not inferred from source or test discovery. |
| `PG-A11Y-002` | **Implemented locally; device verification pending.** Reduced-motion, focus/forced-colors fallback, minimum targets, and non-gesture controls are present and pass the static audit. | `src/index.css`; `src/styles/tokens.css`; `src/preview-toolbar.ts`; `scripts/audit-ux-contract.mjs`; `e2e/mobile-playground.spec.ts` | `deferred-device` | Physical handset/touch evidence remains deferred; static/source evidence does not prove device parity. |

| Evidence | Result | Interpretation |
| --- | --- | --- |
| `pnpm test` in `playground/` | PASS — 18 files / 119 tests | Unit, worker, lifecycle, persistence, preview, helper, theme, bootstrap, keyboard-command, viewport, and worker-contract tests are green. Tests live under `src/__tests__`; no `playground/test` directory exists. |
| `pnpm build` in `playground/` | PASS — TypeScript and Vite production build | The local production artifact is buildable; Vite emitted only a chunk-size warning, not a build failure. This is not hosted parity evidence. |
| `pnpm audit:ux` in `playground/` | PASS — 13 component files / 4 approved dynamic inline styles | Static UX, ARIA, atomic status announcements, focus, responsive, reduced-motion, forced-colors, and inline-style contract checks pass. |
| `pnpm lint` in `playground/` | PASS | Current Playground source is lint-clean. |
| `pnpm exec playwright test --list` in `playground/` | PASS — 17 tests discovered | Startup, delayed bootstrap gating, accessibility, keyboard/focus, theme, persistence, and mobile cases are present in the E2E surface. |
| `pnpm exec playwright test playground.spec.ts -g "gates the workspace while bootstrap is loading"` in `playground/` | NOT VERIFIED — environment unavailable | The Playwright preview server failed before page creation while binding `127.0.0.1:4173` with `EPERM`; this does not establish a Playground implementation failure. |
| `pnpm run test:pages-artifact` in `relgeo.github.io/` | PASS — 3 Playground asset references checked | Assembled artifact assertion passes for the synchronized local tuple and checks route/title/base-path/manifest/digests; hosted parity remains separate. |
| `pnpm provenance:check` and `pnpm provenance:pages` in `relgeo.github.io/` | PASS — synchronized local tuple | Workspace baseline and Pages-input provenance both report no mismatches for Playground `efb7396…`, website `33d7f96…`, and spec `26ff532…`. |

### Implementation delta — 2026-11-07 rebaseline

The selected implementation now has local source/test evidence for the system,
light, and dark theme contract (`theme.ts`, `theme.test.ts`, and the theme
selector in `Navbar.tsx`), an explicit bootstrap phase (`App.tsx` and
`playground-status.ts`), a camera-only viewport reset (`view-state.ts`, `App.tsx`,
and `view-state.test.ts`) that no longer triggers fit-to-content, the centralized
keyboard command map with IME/AltGraph safety (`keyboard-commands.ts`,
`keyboard-commands.test.ts`, and `App.tsx`), and web input-tolerance additions
(atomic status announcements, minimum file-action targets, and forced-colors
focus fallback). Browser assertions for these paths are present in
`playground/e2e/playground.spec.ts`, but remain not verified until the Playwright
server can bind successfully. The worker readiness/recovery fields and tests
remain backward-compatible additions to the worker response contract. The new
`src/worker-lifecycle.ts` controller owns worker creation, supersession
cancellation, timeout termination, error/message-error recovery, and disposal;
its focused suite proves stale responses cannot update the consumer after a
worker replacement.

The accepted theme contract is fixed for the implementation task: initial
`system` mode follows `prefers-color-scheme`, explicit `light` and `dark`
overrides are supported, and browser-local persistence is used where available.

### Current status interpretation

The final catalog/reconciliation records `35` implemented (`✔️`), `0` partial,
`0` absent (`❌`), and `2` explicit holds (`⏸️`): `PG-A11Y-001` for
browser/native-host evidence and `PG-DELIVERY-001` for hosted Pages parity.
`PG-LIFE-002` is closed at the local implementation boundary; its delayed
browser trace remains an evidence follow-up because the runner cannot bind.
Browser traversal, native AT, hosted smoke, and public parity remain explicitly
unverified/held and are not inferred from source or test discovery.

The audit does not promote browser E2E, current CI, public Pages parity,
native VoiceOver/TalkBack, or physical handset evidence to verified status.
Rows for file interaction, diagnostics, persistence, share, preview, and
inspection remain implemented at the Playground boundary where the
reconciliation says `✔️`; missing fresh browser evidence is reported as an
evidence limitation, not converted into implementation absence. `➖` and
`⏸️` scope is not treated as active implementation work.
