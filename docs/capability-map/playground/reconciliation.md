# Playground expected-versus-observed reconciliation

> **Coverage statement — 2026-11-03.** This document is a one-to-one join of
> the 37 expected capability IDs in the Playground catalog with the 37 rows in
> the current Playground implementation audit. It does not add observed-only
> capabilities, remove expected rows, or convert an absent implementation into
> `➖` merely because browser or public evidence is limited.

| Field | Value |
| --- | --- |
| Expected source | [Playground expected capability catalog](./expected-capability-catalog.md) |
| Observed source | [Playground implementation audit](./implementation-audit.md) |
| Policy and product sources | [Repository map](../../REPOSITORY-MAP.md); [Maturation master plan](../../MATURATION-MASTER-PLAN.md); [Playground hardening plan](../../plans/05-public-docs-and-playground-hardening.md); [inventory protocol](../INVENTORY-PROTOCOL.md) |
| Surface owner | `relgeo/playground` owns browser IDE workflow and presentation; `spec/id/`, core, language-service, and renderer packages retain delegated semantics |
| Join status | Complete; every expected ID has exactly one reconciliation row and one audit trace |

## 1. Reconciliation rules

| Dimension | Allowed values | Meaning |
| --- | --- | --- |
| Reconciliation result | `✔️`, `🌗`, `❌`, `⚠️`, `⏸️`, `➖` | Compact implementation result. `❌` is required for an expected capability verified absent from the Playground implementation. |
| Implementation status | `implemented`, `partial`, `broken`, `absent`, `deferred`, `not applicable` | What exists at the Playground boundary, independent of browser/public evidence strength. |
| Evidence status | `verified-local`, `partial-local`, `verified-absence`, `environment-limited`, `parity-unverified`, `deferred-device` | How the observation was established and which verification boundary remains. |
| Scope decision | `in scope`, `boundary only`, `expected-but-missing`, `held`, `not applicable` | Whether Playground owns the behavior, delegates its semantics, or deliberately excludes it. |

Important distinctions:

- `❌ absent` is an implementation result, not an evidence failure. No selected
  capability is currently absent at the Playground source boundary; browser and
  device limitations remain in the evidence dimension below.
- `environment-limited` and `deferred-device` qualify evidence only. They do
  not turn an implemented capability into `❌`, and they do not hide an absent
  capability.
- `➖ not applicable` is reserved for behavior explicitly outside Playground
  ownership, such as cloud collaboration or graph zoom/minimap. No expected
  catalog row is silently converted to `➖`.
- No `⚠️ broken` or `⏸️ deferred` implementation result is claimed in this
  join. Physical mobile and native assistive-technology work is deferred as
  evidence/scope follow-up, while the web capability rows remain expected.

## 2. Coverage validation

| Check | Result |
| --- | --- |
| Expected catalog rows | 37 |
| Reconciliation rows | 37 |
| Expected IDs missing from reconciliation | 0 |
| Observed-only IDs added to reconciliation | 0 |
| Duplicate reconciliation IDs | 0 |
| Result counts | 34 implemented, 3 partial, 0 absent, 0 broken, 0 deferred, 0 not applicable |
| Implementation, evidence, and scope columns present | Yes, on every row |
| Audit trace present | Yes, every row points to the matching audit ID and evidence section |
| Required evidence sources represented | Yes: `playground` surface, `docs/REPOSITORY-MAP.md`, `docs/MATURATION-MASTER-PLAN.md`, and `docs/capability-map` |

### 2.1 Validation checkpoint — 2026-11-03

| Command / check | Result and interpretation |
| --- | --- |
| `pnpm test` in `playground/` | Pass; 17 files and 104 tests. Covers bootstrap phases/gating, theme helpers, and the existing source/unit contract. |
| `pnpm build` in `playground/` | Pass; type-check and Vite build completed. Build provenance records child revision `c7cec4b505f290beccac911ef97786c8f6b0a534`. |
| `pnpm audit:ux` in `playground/` | Pass; 13 component files and 4 approved dynamic inline styles. |
| `pnpm exec playwright test --list` in `playground/` | Pass; 16 browser tests discovered, including the startup/accessibility and system-theme cases. |
| `pnpm exec playwright test playground.spec.ts -g "exposes named landmarks\|applies the browser system preference"` | Not verified; Playwright could not start its preview server because binding `127.0.0.1:4173` returned `EPERM` before page creation. This is environment-limited, not a target failure. |
| `pnpm run playground:artifact:check` at workspace root | Pass; source and assembled entrypoints/files match, child revision matches the Pages workflow pin, and the baseline revision is reported without being rewritten. |
| `pnpm run test:pages-artifact` in `relgeo.github.io/` | Pass; fresh assembled Pages artifact has valid title, route references, provenance/digests, runtime markers, and local assets. |
| `pnpm provenance:report` in `relgeo.github.io/` | Pass as a report; it records known drift between baseline `c0de7b0e…` and current/workflow Playground `c7cec4b…`. Strict parity is not claimed. |

The canonical workspace declares Node `>=24`; these checks ran under the
available Node `22.23.2`, so Node-version parity remains environment-limited.

## 3. Task-bound selection and accepted contracts

The 2026-11-04 P0/P1 triage selects seven relevant rows from the expected
catalog and this audit. The table is the explicit owner/source/acceptance
boundary for the downstream implementation and verification tasks. Six rows
are implementation-closable at the bounded Playground source/browser surface;
`PG-DELIVERY-001` is an external-evidence-only delivery follow-up. All selected
rows are owned at the browser-IDE boundary by `relgeo/playground`; DSL, core,
language-service, and renderer packages remain semantic owners where referenced.

No whole-row scope-deferred item is selected. Native AT, physical handset, and
hosted/public checks remain separately labeled evidence or scope boundaries.
Selection does not change any result, implementation status, or evidence
status below.

| ID | Owner | Source paths | Acceptance behavior |
| --- | --- | --- | --- |
| `PG-THEME-001` | `relgeo/playground` UI/product owner | `playground/src/styles/tokens.css`; `playground/src/index.css`; `playground/src/App.tsx`; `playground/src/__tests__/` | Initial mode is `system` following browser/OS `prefers-color-scheme`; explicit `light` and `dark` overrides work; browser-local persistence is used where available; all Playground surfaces remain readable. |
| `PG-LIFE-002` | `relgeo/playground` lifecycle owner | `playground/src/App.tsx`; `playground/src/playground-status.ts`; `playground/src/indexeddb-persistence.ts`; `playground/e2e/playground.spec.ts` | Bootstrap, restore, resolving, ready, and failure states are visibly distinct and do not lose source or focus. |
| `PG-CANVAS-005` | `relgeo/playground` Preview/App owner | `playground/src/App.tsx`; `playground/src/components/Preview.tsx`; `playground/src/view-state.ts`; `playground/src/preview-toolbar.ts`; `playground/src/__tests__/` | A dedicated viewport reset changes camera state only and leaves source, file identity, dirty state, selection, and persisted content unchanged. |
| `PG-KEY-001` | `relgeo/playground` UI/accessibility owner | `playground/src/App.tsx`; `playground/src/components/Navbar.tsx`; `playground/src/components/FileWorkspacePicker.tsx`; `playground/src/components/Editor.tsx`; `playground/e2e/playground.spec.ts` | Primary file, surface, viewport, diagnostics, drawer/panel, and confirmation actions have documented keyboard access with editable-field and browser-key safety. |
| `PG-A11Y-001` | `relgeo/playground` UI/accessibility owner | `playground/scripts/audit-ux-contract.mjs`; `playground/src/App.tsx`; `playground/src/components/Navbar.tsx`; `playground/src/components/Inspector.tsx`; `playground/src/components/Sidebar.tsx`; `playground/src/components/Editor.tsx` | Supported-browser DOM/ARIA and keyboard checks cover landmarks, names, states, announcements, focus return/traps, and source/preview navigation; native AT evidence stays separately labeled. |
| `PG-A11Y-002` | `relgeo/playground` UI/accessibility owner | `playground/src/styles/tokens.css`; `playground/src/index.css`; `playground/src/preview-toolbar.ts`; `playground/scripts/audit-ux-contract.mjs`; `playground/e2e/mobile-playground.spec.ts` | Contrast/focus, target size, reduced motion, and non-gesture alternatives pass at supported browser breakpoints; physical-device evidence is deferred or verified explicitly. |

`PG-DELIVERY-001` is bound in the active tranche as a delivery verification
follow-up, but it remains independent from local capability implementation. Its
closure requires a child-revision/build/hosted-artifact trace; a local build
alone cannot close it. The theme contract above is accepted task data; it does
not open a separate human decision.

### 3.1 Contract and acceptance lock — 2026-11-04

This lock freezes the acceptance boundary before implementation changes. The
Playground is a consumer/presentation surface: it must continue to consume the
RelGeo DSL `0.5.x` contract, while normative language meaning remains owned by
`spec/id/`. The compatibility authority is
[`docs/compatibility-matrix.json`](../../compatibility-matrix.json): active
contract `0.5`, public package line `0.5.x`, omitted document version defaults
to `0.5`, and breaking language changes require a decision record and the next
compatibility line. No row below authorizes a public DSL, package, or protocol
contract change.

Evidence labels follow [`INVENTORY-PROTOCOL.md`](../INVENTORY-PROTOCOL.md):
`E1` source/static, `E2` local tests/fixtures, `E3` local cross-surface or
artifact checks, and `E5` public/deployed evidence. Missing browser, native,
canonical, or public environments remain `not verified`/`environment-limited`;
they do not become implementation failures.

| ID | Success behavior | Failure / edge behavior | Expected evidence before status change |
| --- | --- | --- | --- |
| `PG-LIFE-002` | Bootstrap visibly progresses through `loading`, then `empty` when no local files exist or `ready` when the workspace/example is usable; editor, file actions, preview controls, and shortcuts become interactive only after bootstrap. Resolver `resolving` remains a separate lifecycle. | Delayed IndexedDB/bootstrap must not look like `empty`; storage-open/quota failure is `error`, not an empty workspace; parser/resolve errors remain distinct; source and focus are not discarded during recovery. | `E1` `App.tsx`/`playground-status.ts` state model; `E2` `playground-status.test.ts` all phases and gating; `E3` delayed browser startup trace in `playground/e2e/playground.spec.ts`. If preview binding remains `EPERM`, browser evidence is `not verified`. |
| `PG-CANVAS-005` | Reset viewport returns the camera to the deterministic baseline and changes camera state only; source, active file identity, dirty state, selection, and persisted content remain unchanged. Repeated reset is idempotent. | Reset during resolve, with no scene, or after resize must not mutate source/document state, trigger an unintended save, or clear selection; invalid camera values fall back to the baseline. | `E1` `view-state.ts`, `preview-toolbar.ts`, `App.tsx`; `E2` `view-state.test.ts`; `E3` browser command/reset flow in `playground/e2e/playground.spec.ts`, with preservation assertions. |
| `PG-KEY-001` | Documented command bindings and accessible controls reach primary file, surface, viewport, diagnostics, drawer/panel, and confirmation actions; commands preserve focus semantics and work alongside menus. | In editor/text-entry focus, printable input and browser-reserved keys are not hijacked; Escape closes the relevant dialog/drawer and returns focus; unknown or unavailable commands are safe no-ops. | `E1` `keyboard-commands.ts`/command map and UI controls; `E2` `keyboard-commands.test.ts`; `E3` keyboard traversal in `playground/e2e/playground.spec.ts`. Browser execution remains `not verified` when the runner cannot bind. |
| `PG-A11Y-001` | Supported-browser DOM exposes named landmarks, roles, selected/expanded/pressed/value states, live status/error announcements, focus return/traps, and source↔preview navigation. | Missing names/states, stale live announcements, focus loss after menu/dialog actions, or broken source/preview jumps fail acceptance; native VoiceOver/TalkBack/AX behavior is never inferred from static checks. | `E1` `audit-ux-contract.mjs` and component source; `E2` focused accessibility/unit checks; `E3` DOM/keyboard browser traversal. Native AT/device evidence remains separately `deferred` or `not verified`. |
| `PG-A11Y-002` | Supported browser breakpoints provide readable contrast/focus treatment, usable target sizes, reduced-motion behavior, and non-gesture alternatives for primary actions. | `prefers-reduced-motion` removes nonessential transitions; forced-colors/focus remains perceivable; narrow supported layouts do not hide controls; physical handset/touch behavior is not claimed without device evidence. | `E1` tokens/CSS/toolbar and UX audit; `E2` static contract checks; `E3` supported-breakpoint/mobile browser checks when available. Physical handset evidence remains `deferred-device`. |
| `PG-THEME-001` | First load uses `system` and follows `prefers-color-scheme`; explicit `light` and `dark` overrides apply to editor, canvas, controls, and diagnostics and persist browser-locally when storage is available. | Invalid/missing stored preference falls back to `system`; storage failure does not block the Playground; changing theme does not alter source, camera, selection, or file identity; all surfaces remain readable. | `E1` `theme.ts`, tokens, and App wiring; `E2` `theme.test.ts`; `E3` browser system-preference, override, and reload checks in `playground/e2e/playground.spec.ts`. |
| `PG-DELIVERY-001` | Hosted `/playground/` serves the exact tested child revision and assembled artifact; route, title, runtime assets, provenance, and share flow match the traceable build tuple. | Revision/pointer drift, missing/stale assets, wrong route/title, or hosted smoke failure keeps delivery partial; inaccessible Pages/network or unavailable Node `>=24` is recorded as `environment-limited`, not as a local implementation defect. | `E3` `playground:artifact:check`, `test:pages-artifact`, and provenance reports for the assembled artifact; `E4` canonical build provenance when available; `E5` hosted route/title/assets and public smoke/share run. |

The lock is intentionally narrower than a release or deployment gate. Local
source/test evidence can change the implementation finding, but only the
corresponding browser, native, canonical, or hosted evidence can change its
separate evidence axis. A future contract change must update the normative
source and compatibility decision first; this Playground lock cannot authorize
one implicitly.

### 3.2 Active evidence contract

| ID | State/evidence boundary frozen for the active task |
| --- | --- |
| `PG-LIFE-002` | `loading`, `empty`, `ready`, and `error` must be visibly distinct. Bootstrap interaction is blocked during `loading`; `resolving`, parser failure, and storage failure remain separately observable. Evidence: source state model, unit tests, and a delayed browser startup trace. |
| `PG-A11Y-001` | Browser semantics and keyboard/focus behavior are checked through the static UX audit plus DOM/browser traversal. Native VoiceOver/TalkBack/device evidence remains explicitly `deferred` or `unverified` and is not inferred. |
| `PG-DELIVERY-001` | Delivery is proven only by a traceable child revision, clean assembled build, hosted route/title/assets comparison, and hosted smoke/share result. Pages/network or canonical-environment limits are recorded as `environment-limited`. |

The existing `system`/`light`/`dark` theme contract is preserved and is not a
new decision surface.

## 4. One-to-one reconciliation register

| ID | Expected capability / user outcome | Result | Implementation status | Evidence status | Scope / owner decision | Audit trace |
| --- | --- | --- | --- | --- | --- | --- |
| `PG-LIFE-001` | Open a usable browser Playground session from the public entrypoint | `✔️ implemented` | `implemented` | `verified-local` | `in scope`; Playground entry and delivery boundary | Audit §3 `PG-LIFE-001`; `index.html`, Vite base, build |
| `PG-LIFE-002` | Show loading/startup state for app, workspace, example, and resolver | `🌗 partial` | `implemented` | `partial-local` | `in scope`; Playground owns lifecycle presentation | `App.tsx`/`playground-status.ts` explicit `loading`/`empty`/`ready`/`error` phases, unit gating tests, and E2E definition; delayed browser trace remains unavailable |
| `PG-LIFE-003` | Show editing, resolving, ready/inspecting, and exporting lifecycle transitions | `✔️ implemented` | `implemented` | `verified-local` | `in scope`; Playground lifecycle UI | Audit §3 `PG-LIFE-003`; `playground-status.ts`, saving feedback, view state |
| `PG-LIFE-004` | Give distinct failure and recovery states for resolve, storage, share, clipboard, and export | `✔️ implemented` | `implemented` | `verified-local` | `in scope`; Playground recovery UI | Audit §3 `PG-LIFE-004`; worker/storage/share errors and recovery actions |
| `PG-EDIT-001` | Read and edit RelGeo source while retaining editor interaction state | `✔️ implemented` | `implemented` | `verified-local` | `in scope`; Playground editor; DSL remains delegated | Audit §3 `PG-EDIT-001`; CodeMirror, YAML, linter, completion, hover |
| `PG-DSL-001` | Resolve against the normative RelGeo DSL v0.5 contract | `✔️ implemented` | `implemented` | `parity-unverified` | `boundary only`; `spec/id/` owns semantics, Playground consumes them | Audit §3 `PG-DSL-001`; worker parser/resolver/graph/renderer calls, shared conformance, and renderer semantic replay boundary |
| `PG-DIAG-001` | Read actionable syntax, semantic, and runtime diagnostics | `✔️ implemented` | `implemented` | `verified-local` | `in scope`; UI owns presentation, core/language-service own semantics | Audit §3 `PG-DIAG-001`; typed worker errors and Inspector Errors |
| `PG-DIAG-002` | Navigate to errors and recover a valid preview without hiding the active error | `✔️ implemented` | `implemented` | `verified-local` | `in scope`; Playground recovery workflow | Audit §3 `PG-DIAG-002`; first-error/source jump, restore, reset |
| `PG-FILE-001` | Create a safe-named local file with valid starter source | `✔️ implemented` | `implemented` | `verified-local` | `in scope`; My Files active document | Audit §3 `PG-FILE-001`; New handler creates `Untitled` local document |
| `PG-FILE-002` | Open My Files or a read-only Example with correct identity and source | `✔️ implemented` | `implemented` | `verified-local` | `in scope`; Playground file picker | Audit §3 `PG-FILE-002`; My Files, Shared draft, Examples picker |
| `PG-FILE-003` | Save changes to the active My File and expose save completion | `✔️ implemented` | `implemented` | `verified-local` | `in scope`; local autosave, no server save | Audit §3 `PG-FILE-003`; debounced IndexedDB autosave and status |
| `PG-FILE-004` | Save as a private copy without overwriting Example or transient origin | `✔️ implemented` | `implemented` | `verified-local` | `in scope`; explicit copy safety boundary | Audit §3 `PG-FILE-004`; Save as creates a new local document |
| `PG-FILE-005` | Import validated YAML/YML as a new local document | `✔️ implemented` | `implemented` | `verified-local` | `in scope`; file exchange owned by Playground | Audit §3 `PG-FILE-005`; extension, size, name, text and collision validation |
| `PG-FILE-006` | Download active source as YAML with success/failure feedback | `✔️ implemented` | `implemented` | `verified-local` | `in scope`; source export; raw SVG is separate extra UI | Audit §3 `PG-FILE-006`; sanitized `.yaml` Blob download |
| `PG-FILE-007` | Rename, duplicate through copy flow, and delete My Files safely | `✔️ implemented` | `implemented` | `verified-local` | `in scope`; Examples cannot be mutated | Audit §3 `PG-FILE-007`; rename/delete confirmation and Save as copy flow |
| `PG-EXAMPLE-001` | Find and open built-in read-only Examples | `✔️ implemented` | `implemented` | `verified-local` | `in scope`; Examples catalog and identity | Audit §3 `PG-EXAMPLE-001`; `examples.ts` and picker entries |
| `PG-EXAMPLE-002` | Edit an Example without overwriting it and use Save as My File | `✔️ implemented` | `implemented` | `verified-local` | `in scope`; origin metadata may be retained | Audit §3 `PG-EXAMPLE-002`; separate Example source and `originExampleKey` |
| `PG-PERSIST-001` | Restore active file, documents, content, metadata, and identity after reload | `✔️ implemented` | `implemented` | `verified-local` | `in scope`; IndexedDB canonical store, not cloud | Audit §3 `PG-PERSIST-001`; schema v1 repository and active restore |
| `PG-PERSIST-002` | Distinguish dirty, saving, saved-local, and save-error states | `✔️ implemented` | `implemented` | `verified-local` | `in scope`; memory fallback where possible | Audit §3 `PG-PERSIST-002`; queued writes and persistence feedback |
| `PG-PERSIST-003` | Backup and restore a versioned JSON workspace safely | `✔️ implemented` | `implemented` | `verified-local` | `in scope`; portability/recovery, no credentials | Audit §3 `PG-PERSIST-003`; size guard, parse, confirmation, replacement |
| `PG-CANVAS-001` | See live visual projection of resolved source in the preview canvas | `✔️ implemented` | `implemented` | `verified-local` | `in scope`; renderer/core retain delegated semantics | Audit §3 `PG-CANVAS-001`; worker SVG and Preview surfaces, 107 tests, and safe renderer SVG boundary |
| `PG-CANVAS-002` | Zoom the screen viewport with understandable bounded controls | `✔️ implemented` | `implemented` | `verified-local` | `in scope`; screen camera, not model mutation | Audit §3 `PG-CANVAS-002`; toolbar, clamped state, Ctrl/Meta+wheel |
| `PG-CANVAS-003` | Pan with pointer/touch and have a non-gesture alternative | `✔️ implemented` | `implemented` | `deferred-device` | `in scope`; physical touch evidence deferred by scope decision | Audit §3 `PG-CANVAS-003`; pointer/pinch handlers and gesture tests |
| `PG-CANVAS-004` | Fit or recenter the scene after resolve, resize, or sheet change | `✔️ implemented` | `implemented` | `verified-local` | `in scope`; camera contract | Audit §3 `PG-CANVAS-004`; fit/recenter and `ResizeObserver` |
| `PG-CANVAS-005` | Reset camera/zoom deterministically without changing source or file | `✔️ implemented` | `implemented` | `partial-local` | `in scope`; dedicated viewport action is implemented, browser preservation proof pending | Audit §3 `PG-CANVAS-005`; camera-only reset, unit coverage, and toolbar binding |
| `PG-CANVAS-006` | Select sheet/view and switch Both, Source, Preview, Model, or Physical surfaces | `✔️ implemented` | `implemented` | `verified-local` | `in scope`; no print-workbench parity claim | Audit §3 `PG-CANVAS-006`; sheet, surface, and layout controls |
| `PG-SELECT-001` | Select object/anchor and keep related context focused | `✔️ implemented` | `implemented` | `verified-local` | `in scope`; stable DSL identity delegated to spec | Audit §3 `PG-SELECT-001`; Preview anchors, Inspector selection, related navigation |
| `PG-INSPECT-001` | Inspect geometry, metadata, parameters, layers, values, and BOM | `✔️ implemented` | `implemented` | `verified-local` | `in scope`; contextual inspector | Audit §3 `PG-INSPECT-001`; Resolved, Values, BOM and filters |
| `PG-INSPECT-002` | Filter, focus, select, and navigate the dependency graph | `✔️ implemented` | `implemented` | `verified-local` | `in scope`; graph zoom/minimap optional, not expected baseline | Audit §3 `PG-INSPECT-002`; GraphViewer focus/filter/roving navigation |
| `PG-THEME-001` | Use a readable user-visible theme across editor, canvas, controls, and diagnostics | `✔️ implemented` | `implemented` | `partial-local` | `in scope`; Playground owns theme control and preference | Audit §3 `PG-THEME-001`; system/light/dark mode, local persistence, tokens, and unit/E2E definitions |
| `PG-RESP-001` | Use the layout on desktop, tablet, and handset without inaccessible overflow | `✔️ implemented` | `implemented` | `deferred-device` | `in scope`; physical handset validation deferred | Audit §3 `PG-RESP-001`; breakpoints, drawer, surface switcher, split modes |
| `PG-KEY-001` | Run primary actions through keyboard and documented command surface | `✔️ implemented` | `implemented` | `partial-local` | `in scope`; documented command map is implemented, browser focus proof pending | Audit §3 `PG-KEY-001`; Mod+Alt dispatcher, documentation, unit tests, and E2E definition |
| `PG-A11Y-001` | Expose landmarks, names, states, focus management, announcements, and navigation to AT | `🌗 partial` | `implemented` | `partial-local` | `in scope`; web semantics are implemented, browser/native AT evidence pending | ARIA/live status/focus code, UX audit, and discovered DOM/keyboard E2E coverage; browser execution is blocked by `EPERM`, native AT remains separate |
| `PG-A11Y-002` | Provide reduced motion, focus/contrast tolerance, target usability, and non-gesture actions | `✔️ implemented` | `implemented` | `deferred-device` | `in scope`; source/static UX contract is implemented, physical evidence pending | Audit §3 `PG-A11Y-002`; reduced motion, forced-colors fallback, targets, and non-gesture alternatives |
| `PG-SHARE-001` | Share source through URL/hash with feedback, clipboard fallback, and size guard | `✔️ implemented` | `implemented` | `verified-local` | `in scope`; no account/cloud collaboration | Audit §3 `PG-SHARE-001`; Base64URL, length guard, history and clipboard |
| `PG-SHARE-002` | Keep shared source transient until explicit Save as, with distinct recovery states | `✔️ implemented` | `implemented` | `verified-local` | `in scope`; no silent local overwrite | Audit §3 `PG-SHARE-002`; Shared draft, Save as, invalid/oversized hash paths |
| `PG-DELIVERY-001` | Serve the tested build consistently at hosted `/playground/` | `🌗 partial` | `implemented` | `environment-limited` | `in scope`; delivery guardrail spans Playground and Pages | Local assembled artifact and route/title/assets/digest comparison were prepared, but provenance assertions reject current child/baseline/Pages pin drift; hosted public parity/smoke remains unverified |

## 5. Findings and handoff

### Implementation gaps retained as explicit `🌗`

| Result | IDs | Finding |
| --- | --- | --- |
| `🌗 partial` | `PG-LIFE-002` | Explicit source phases and interaction gating are implemented and unit-tested; the delayed browser startup trace remains unavailable because the preview server cannot bind. |
| `🌗 partial` | `PG-A11Y-001` | Landmarks, names, states, announcements, focus return, and source/preview navigation are implemented and statically audited; browser traversal and native AT evidence remain incomplete. |
| `🌗 partial` | `PG-DELIVERY-001` | Local assembled artifact is available and its content comparison was attempted; current revision/file-digest gate remains unverified because baseline/Pages pins still reference `c7cec4b…` while the checkout uses `47fd715…`; hosted Pages parity and public smoke are not current-verified. |

### Evidence and scope limitations

The current Playwright server could not bind `127.0.0.1:4173` because of
`EPERM` before page creation. This is recorded as environment-limited evidence,
not `broken` implementation. Public hosted smoke, Node >=24 canonical execution,
native VoiceOver/TalkBack, and physical mobile touch remain unverified or
deferred according to the audit and scope decisions.

Cloud/account persistence, real-time collaboration, folder hierarchy,
print-workbench parity, and graph zoom/minimap remain `not applicable` to this
expected Playground boundary; they are not missing expected rows.

The reconciliation is complete and ready to feed a status matrix or gap
backlog. Any downstream work must preserve this one-to-one join and keep
implementation, evidence, and scope as separate dimensions.
