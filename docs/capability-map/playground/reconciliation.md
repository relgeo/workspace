# Playground expected-versus-observed reconciliation

> **Coverage statement — 2026-10-30.** This document is a one-to-one join of
> the 37 expected capability IDs in the Playground catalog with the 37 rows in
> the current Playground implementation audit. It does not add observed-only
> capabilities, remove expected rows, or convert an absent implementation into
> `➖` merely because browser or public evidence is limited.

| Field | Value |
| --- | --- |
| Expected source | [Playground expected capability catalog](./expected-capability-catalog.md) |
| Observed source | [Playground implementation audit](./archive/implementation-audit-legacy.md) |
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

- `❌ absent` is an implementation result, not an evidence failure. It is used
  below for `PG-THEME-001` because source, controls, and preference handling
  were searched and no user-visible theme capability was found.
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
| Result counts | 30 implemented, 6 partial, 1 absent, 0 broken, 0 deferred, 0 not applicable |
| Implementation, evidence, and scope columns present | Yes, on every row |
| Audit trace present | Yes, every row points to the matching audit ID and evidence section |
| Required evidence sources represented | Yes: `playground` surface, `docs/REPOSITORY-MAP.md`, `docs/MATURATION-MASTER-PLAN.md`, and `docs/capability-map` |

## 3. One-to-one reconciliation register

| ID | Expected capability / user outcome | Result | Implementation status | Evidence status | Scope / owner decision | Audit trace |
| --- | --- | --- | --- | --- | --- | --- |
| `PG-LIFE-001` | Open a usable browser Playground session from the public entrypoint | `✔️ implemented` | `implemented` | `verified-local` | `in scope`; Playground entry and delivery boundary | Audit §3 `PG-LIFE-001`; `index.html`, Vite base, build |
| `PG-LIFE-002` | Show loading/startup state for app, workspace, example, and resolver | `🌗 partial` | `partial` | `partial-local` | `in scope`; Playground owns lifecycle presentation | Audit §3 `PG-LIFE-002`; Suspense, resolve status, persistence feedback |
| `PG-LIFE-003` | Show editing, resolving, ready/inspecting, and exporting lifecycle transitions | `✔️ implemented` | `implemented` | `verified-local` | `in scope`; Playground lifecycle UI | Audit §3 `PG-LIFE-003`; `playground-status.ts`, saving feedback, view state |
| `PG-LIFE-004` | Give distinct failure and recovery states for resolve, storage, share, clipboard, and export | `✔️ implemented` | `implemented` | `verified-local` | `in scope`; Playground recovery UI | Audit §3 `PG-LIFE-004`; worker/storage/share errors and recovery actions |
| `PG-EDIT-001` | Read and edit RelGeo source while retaining editor interaction state | `✔️ implemented` | `implemented` | `verified-local` | `in scope`; Playground editor; DSL remains delegated | Audit §3 `PG-EDIT-001`; CodeMirror, YAML, linter, completion, hover |
| `PG-DSL-001` | Resolve against the normative RelGeo DSL v0.5 contract | `✔️ implemented` | `implemented` | `parity-unverified` | `boundary only`; `spec/id/` owns semantics, Playground consumes them | Audit §3 `PG-DSL-001`; worker parser/resolver/graph/renderer calls |
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
| `PG-CANVAS-001` | See live visual projection of resolved source in the preview canvas | `✔️ implemented` | `implemented` | `verified-local` | `in scope`; renderer/core retain delegated semantics | Audit §3 `PG-CANVAS-001`; worker SVG and Preview surfaces |
| `PG-CANVAS-002` | Zoom the screen viewport with understandable bounded controls | `✔️ implemented` | `implemented` | `verified-local` | `in scope`; screen camera, not model mutation | Audit §3 `PG-CANVAS-002`; toolbar, clamped state, Ctrl/Meta+wheel |
| `PG-CANVAS-003` | Pan with pointer/touch and have a non-gesture alternative | `✔️ implemented` | `implemented` | `deferred-device` | `in scope`; physical touch evidence deferred by scope decision | Audit §3 `PG-CANVAS-003`; pointer/pinch handlers and gesture tests |
| `PG-CANVAS-004` | Fit or recenter the scene after resolve, resize, or sheet change | `✔️ implemented` | `implemented` | `verified-local` | `in scope`; camera contract | Audit §3 `PG-CANVAS-004`; fit/recenter and `ResizeObserver` |
| `PG-CANVAS-005` | Reset camera/zoom deterministically without changing source or file | `🌗 partial` | `partial` | `partial-local` | `in scope`; dedicated viewport action remains a gap | Audit §3 `PG-CANVAS-005`; Reset source also resets camera, no camera-only command |
| `PG-CANVAS-006` | Select sheet/view and switch Both, Source, Preview, Model, or Physical surfaces | `✔️ implemented` | `implemented` | `verified-local` | `in scope`; no print-workbench parity claim | Audit §3 `PG-CANVAS-006`; sheet, surface, and layout controls |
| `PG-SELECT-001` | Select object/anchor and keep related context focused | `✔️ implemented` | `implemented` | `verified-local` | `in scope`; stable DSL identity delegated to spec | Audit §3 `PG-SELECT-001`; Preview anchors, Inspector selection, related navigation |
| `PG-INSPECT-001` | Inspect geometry, metadata, parameters, layers, values, and BOM | `✔️ implemented` | `implemented` | `verified-local` | `in scope`; contextual inspector | Audit §3 `PG-INSPECT-001`; Resolved, Values, BOM and filters |
| `PG-INSPECT-002` | Filter, focus, select, and navigate the dependency graph | `✔️ implemented` | `implemented` | `verified-local` | `in scope`; graph zoom/minimap optional, not expected baseline | Audit §3 `PG-INSPECT-002`; GraphViewer focus/filter/roving navigation |
| `PG-THEME-001` | Use a readable user-visible theme across editor, canvas, controls, and diagnostics | `❌ absent` | `absent` | `verified-absence` | `expected-but-missing`; Playground owns theme control and preference | Audit §3 `PG-THEME-001`; static tokens only, no theme control or preference |
| `PG-RESP-001` | Use the layout on desktop, tablet, and handset without inaccessible overflow | `✔️ implemented` | `implemented` | `deferred-device` | `in scope`; physical handset validation deferred | Audit §3 `PG-RESP-001`; breakpoints, drawer, surface switcher, split modes |
| `PG-KEY-001` | Run primary actions through keyboard and documented command surface | `🌗 partial` | `partial` | `partial-local` | `in scope`; shortcut map is incomplete | Audit §3 `PG-KEY-001`; native controls, Escape, graph/resizer keys, no file shortcut map |
| `PG-A11Y-001` | Expose landmarks, names, states, focus management, announcements, and navigation to AT | `🌗 partial` | `partial` | `deferred-device` | `in scope`; native AT evidence deferred/follow-up | Audit §3 `PG-A11Y-001`; ARIA, live status, traps, skip links; no native session |
| `PG-A11Y-002` | Provide reduced motion, focus/contrast tolerance, target usability, and non-gesture actions | `🌗 partial` | `partial` | `deferred-device` | `in scope`; device/visual verification remains follow-up | Audit §3 `PG-A11Y-002`; reduced motion, focus and keyboard alternatives |
| `PG-SHARE-001` | Share source through URL/hash with feedback, clipboard fallback, and size guard | `✔️ implemented` | `implemented` | `verified-local` | `in scope`; no account/cloud collaboration | Audit §3 `PG-SHARE-001`; Base64URL, length guard, history and clipboard |
| `PG-SHARE-002` | Keep shared source transient until explicit Save as, with distinct recovery states | `✔️ implemented` | `implemented` | `verified-local` | `in scope`; no silent local overwrite | Audit §3 `PG-SHARE-002`; Shared draft, Save as, invalid/oversized hash paths |
| `PG-DELIVERY-001` | Serve the tested build consistently at hosted `/playground/` | `🌗 partial` | `partial` | `environment-limited` | `in scope`; delivery guardrail spans Playground and Pages | Audit §3 `PG-DELIVERY-001`; local Vite build/base pass, public parity unverified |

## 4. Findings and handoff

### Implementation gaps retained as explicit `❌` or `🌗`

| Result | IDs | Finding |
| --- | --- | --- |
| `❌ absent` | `PG-THEME-001` | No theme control, mode preference, dark/system selector, or theme persistence was found. |
| `🌗 partial` | `PG-KEY-001` | Keyboard navigation exists, but no explicit app-wide shortcut map covers primary file actions and viewport reset. |
| `🌗 partial` | `PG-CANVAS-005` | Reset source resets camera as a side effect; a dedicated camera-only reset is absent. |
| `🌗 partial` | `PG-LIFE-002` | Startup loading is represented by fallback/status paths, not one complete explicit bootstrap state. |
| `🌗 partial` | `PG-A11Y-001`, `PG-A11Y-002` | Web semantics and tolerance mechanisms exist, but native AT/device and current browser evidence remain incomplete. |
| `🌗 partial` | `PG-DELIVERY-001` | Local artifact is verified; hosted Pages parity and smoke are not current-verified. |

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
