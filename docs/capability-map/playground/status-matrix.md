# Playground status matrix

> **Coverage statement — 2026-10-30.** This is the capability-first status
> view for all 37 rows in the Playground expected catalog. It is derived from
> the [implementation audit](./implementation-audit.md) and
> [expected-versus-observed reconciliation](./reconciliation.md);
> it is not a replacement catalog and does not turn documentation into
> implementation.

## Matrix metadata

| Field | Value |
| --- | --- |
| Surface | `relgeo/playground` browser IDE and `/playground/` delivery artifact |
| Matrix owner | Playground product owner; delegated DSL semantics remain with `spec/id/`, core, language-service, and renderer packages |
| Source of truth | Expected catalog → implementation audit → reconciliation; required plans remain requirement and scope sources |
| Audit date | 2026-10-30 |
| Evidence freshness | Local source, tests, UX audit, and build are current for the inspected checkout; browser E2E/public/native device evidence is environment-limited or deferred as marked |

## Status and evidence legend

| Status | Meaning |
| --- | --- |
| `✔️` | Expected capability is implemented at the Playground boundary with the bounded evidence stated in the row. |
| `🌗` | Some implementation exists, but an expected behavior, coverage boundary, or delivery evidence remains incomplete. |
| `❌` | Expected capability is absent at this surface boundary; it remains an explicit gap. |
| `➖` | Deliberately outside Playground responsibility or acceptance target; not used to hide an expected row. |
| `⏸️` | Deferred or held pending a separate product, host, device, or release decision. |
| `⚠️` | Confirmed defect or provenance inconsistency. No current Playground capability row is classified this way. |

`unverified`, `environment-limited`, and `deferred-device` are evidence states,
not substitutes for implementation status. The current Playwright bind failure
is therefore not represented as `⚠️`.

## Capability-first matrix

| ID | Capability | Status | Evidence | Gap / limitation | Owner | Dependency | Risk | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `PG-LIFE-001` | Open usable Playground session | `✔️` | Local `index.html`, Vite base, build | Hosted route/smoke unverified | Playground + Pages delivery | Vite base and hosted artifact | Public entry can diverge from tested build | Run current hosted smoke and compare artifact revision |
| `PG-LIFE-002` | Loading/startup state | `🌗` | Suspense, resolve status, persistence feedback | No complete explicit bootstrap state for every phase | Playground | React bootstrap, IndexedDB, examples | Empty-looking first load can be misread as ready | Verify first-load timing and add explicit state if needed |
| `PG-LIFE-003` | Product lifecycle state | `✔️` | Status helper, resolving/ready/error, save feedback | Export is action feedback, not a separately named state | Playground | Worker, persistence, view state | Transition meaning can be inferred inconsistently | Keep lifecycle assertions in browser smoke |
| `PG-LIFE-004` | Failure and recovery state | `✔️` | Worker/storage/share/clipboard paths and recovery controls | Native/platform presentation unverified | Playground | Worker, IndexedDB, URL, clipboard | Users may not recover consistently across browsers | Run browser failure-path evidence |
| `PG-EDIT-001` | RelGeo source editor | `✔️` | CodeMirror, YAML, linter, completion, hover; local tests/build | Fresh browser cursor/selection proof unavailable | Playground editor | CodeMirror and language-service | Authoring confidence may exceed current browser evidence | Retain browser editor smoke |
| `PG-DSL-001` | Resolve against DSL v0.5 | `✔️` | Worker parser/resolver/graph/renderer wiring and worker tests | Full semantic parity is delegated and not re-audited here | Playground consumer | `spec/id/`, core, renderer, language-service | Consumer can drift from normative DSL | Maintain cross-package conformance fixtures |
| `PG-DIAG-001` | Actionable diagnostics | `✔️` | Typed worker errors and Inspector Errors; diagnostic tests | Full vocabulary remains delegated | Playground UI | Core/language-service/spec | Missing delegated error cases can surface late | Add representative consumer fixtures as DSL expands |
| `PG-DIAG-002` | Error navigation and valid-preview recovery | `✔️` | First-error/source jump, restore-last-successful, reset | Current browser recovery sequence unverified | Playground | Editor, worker, Preview, status | Stale preview may be misread without browser assertion | Run error-to-recovery E2E when harness is available |
| `PG-FILE-001` | Create file | `✔️` | New handler and local document model | Browser activation unverified | Playground | IndexedDB and starter example | Starter identity can regress | Keep create-and-reload test |
| `PG-FILE-002` | Open file or Example | `✔️` | Picker, My Files, Shared draft, Examples | Browser activation/reload unverified | Playground | Workspace repository and examples | Wrong source/identity can be loaded | Add current browser open assertions |
| `PG-FILE-003` | Save active file | `✔️` | Debounced IndexedDB autosave and status | No explicit Save button by design | Playground | IndexedDB operation queue | User may expect a manual save command | Keep autosave status visible and tested |
| `PG-FILE-004` | Save as | `✔️` | New local document from Example/transient source | Browser collision prompt unverified | Playground | Name normalization and IndexedDB | Origin could be overwritten if flow regresses | Assert copy identity and origin safety |
| `PG-FILE-005` | Import YAML/YML | `✔️` | Extension/size/name/text validation and local creation | File picker browser path unverified | Playground | File API and IndexedDB | Invalid or oversized input can disrupt workflow | Keep negative file fixtures and browser smoke |
| `PG-FILE-006` | Export/download source | `✔️` | Sanitized YAML Blob download; error state remains exportable | Browser download assertion unverified | Playground | Blob/download API | Misleading filename or missing source export | Add current download assertion |
| `PG-FILE-007` | Rename, duplicate, delete | `✔️` | Rename/delete confirmation and Save as copy flow | No distinct Duplicate command | Playground | Name uniqueness, confirmation, repository | Delete or copy could select wrong active file | Preserve safe post-delete/copy tests |
| `PG-EXAMPLE-001` | Examples catalog | `✔️` | `examples.ts` and picker entries | Public discoverability unverified | Playground | Bundled example fixtures | Example identity can regress silently | Assert representative example opening |
| `PG-EXAMPLE-002` | Example-to-file transition | `✔️` | Separate Example source, Save as, origin metadata | Provenance is not a separate panel | Playground | File model and Save as | Built-in source could be mutated accidentally | Keep read-only and Save as assertions |
| `PG-PERSIST-001` | Durable local persistence | `✔️` | IndexedDB schema v1, active restore, read-back verification | Private-mode/quota/reload browser matrix unverified | Playground | Browser IndexedDB | Data loss or browser-specific failure | Run supported-browser persistence matrix |
| `PG-PERSIST-002` | Persistence lifecycle status | `✔️` | Dirty/autosave/saved/error feedback and queued writes | Timing/focus preservation unverified in browser | Playground | Persistence queue and status UI | False saved state can hide loss | Add delayed/quota browser assertions |
| `PG-PERSIST-003` | Workspace backup/restore | `✔️` | Versioned JSON, 5 MB guard, parse/confirm/replace | File interaction unverified in browser | Playground | File API and persistence schema | Replacement can destroy local workspace | Preserve confirmation and malformed-backup tests |
| `PG-CANVAS-001` | Live canvas/preview | `✔️` | Worker SVG and Preview model/physical surfaces | Visual browser assertion unavailable | Playground consumer | Core, renderer, worker | Render drift can evade source tests | Re-run visual/interaction smoke |
| `PG-CANVAS-002` | Zoom viewport | `✔️` | Toolbar, clamped zoom, Ctrl/Meta+wheel | Browser control/gesture unverified | Playground Preview | Pointer/wheel events and camera state | Zoom can become inaccessible or mutate model | Add browser zoom boundary assertions |
| `PG-CANVAS-003` | Pan viewport | `✔️` | Pointer capture, pinch/pan handlers, gesture tests | Physical touch evidence deferred | Playground Preview | Pointer events and touch contract | Device gesture behavior may differ | Keep device validation as separate held follow-up |
| `PG-CANVAS-004` | Fit/recenter | `✔️` | Camera computation and `ResizeObserver` | Resize sequence unverified in browser | Playground Preview | SVG bounds, container resize | Scene can remain off-screen after layout change | Add resize/fit browser assertion |
| `PG-CANVAS-005` | Dedicated reset viewport | `✔️` | Camera-only reset source, unit coverage, and toolbar binding | Browser proof of source/file/selection preservation unavailable | Playground Preview/App | Camera state and command map | Camera behavior can regress without browser assertion | Re-run camera-only reset browser assertion when the server can bind |
| `PG-CANVAS-006` | Sheet/view/surface selection | `✔️` | Sheet, Model/Physical, Both/Source/Preview and layout controls | Print-workbench parity intentionally excluded | Playground | View state and Preview | Surface semantics can be confused | Keep model/physical labels explicit |
| `PG-SELECT-001` | Object/anchor selection | `✔️` | Preview anchors, Inspector selection, related navigation | Pointer/keyboard browser flow unverified | Playground UI | Stable DSL object identity | Context can lose selection after resolve | Add selection/re-resolve smoke |
| `PG-INSPECT-001` | Inspector | `✔️` | Resolved, Values, BOM, filters and source jump | Completeness depends on resolved payload | Playground Inspector | Resolved scene and editor | Rare object types may lack context | Expand representative inspector fixtures |
| `PG-INSPECT-002` | Dependency graph navigation | `✔️` | Filter/focus, selectable nodes, roving keyboard navigation | Graph zoom/minimap optional, not a gap | Playground GraphViewer | Dependency graph payload | Large graphs can be hard to navigate | Keep focused graph fixtures and keyboard tests |
| `PG-THEME-001` | User-visible theme | `✔️` | `theme.ts`, theme selector, token variants, and unit tests | Browser selector/system preference/reload assertion unavailable | Playground product/UI owner | CSS tokens and browser-local storage | Browser-specific preference behavior remains unobserved | Re-run theme browser assertions when the server can bind |
| `PG-RESP-001` | Responsive layout | `✔️` | Breakpoints, drawer, surface switcher, split modes | Current browser emulation and handset unverified | Playground UI | CSS, Sidebar, Preview | Narrow layouts can hide primary actions | Run desktop/tablet/handset browser matrix |
| `PG-KEY-001` | Keyboard command surface | `✔️` | Centralized Mod+Alt command map, documentation, and unit tests | Browser focus/conflict behavior unavailable | Playground UI owner | CodeMirror/browser focus and dialog semantics | Reserved-key conflicts remain unobserved | Re-run shortcut and focus browser assertions when the server can bind |
| `PG-A11Y-001` | Accessibility semantics | `🌗` | ARIA, landmarks, live status, focus traps, skip links, static UX audit | Browser traversal and native AT/AX-tree unverified | Playground UI + accessibility owner | DOM semantics and device/browser AT | Users may encounter inaccessible state changes | Run AX/manual AT checks and fix findings |
| `PG-A11Y-002` | Accessibility preferences/input tolerance | `✔️` | Reduced motion, forced-colors focus fallback, target sizing, keyboard alternatives, UX audit | Physical handset/touch evidence deferred | Playground UI + accessibility owner | Design tokens, CSS media, device QA | Device-specific tolerance remains unobserved | Record supported-browser contrast/target review and device result when available |
| `PG-SHARE-001` | URL/share source | `✔️` | Base64URL, 180000 guard, history, clipboard fallback | Public URL/permission behavior unverified | Playground | URL hash and clipboard APIs | Share may be too large or fail silently | Run deployed share-link smoke |
| `PG-SHARE-002` | Transient-share safety | `✔️` | Shared draft, explicit Save as, invalid/oversized hash feedback | Browser reload/share flow unverified | Playground | Hash parser and file model | Shared source could overwrite local work | Add browser reload and no-overwrite assertions |
| `PG-DELIVERY-001` | Public artifact consistency | `🌗` | Local Vite artifact and `/playground/` base build pass | Hosted Pages parity and smoke unverified | Playground + Pages delivery owner | Pages workflow and current child pointer | Public artifact can differ from audited source | Rebuild hosted artifact and archive current smoke evidence |

## Summary and handoff

| Status | Count | Interpretation |
| --- | ---: | --- |
| `✔️ implemented` | 34 | Bounded implementation exists; evidence qualifications remain in-row. |
| `🌗 partial` | 3 | Startup, native/browser accessibility evidence, and hosted delivery remain incomplete. |
| `❌ absent` | 0 | No selected Playground capability is currently absent at the source boundary. |
| `⚠️ broken` | 0 | No confirmed broken Playground behavior in this audit. |
| `⏸️ deferred` | 0 | Physical/native follow-ups are evidence/scope limitations, not silently treated as implementation rows. |
| `➖ not applicable` | 0 expected rows | Cloud collaboration, folders, print-workbench parity, and graph zoom/minimap remain outside this expected boundary. |

The matrix is a downstream status view. Any implementation change must update
the expected catalog, audit, reconciliation, and this matrix explicitly when
the capability boundary or evidence changes.

Linked artifacts:

- [Expected catalog](./expected-capability-catalog.md)
- [Implementation audit](./implementation-audit.md)
- [Expected-versus-observed reconciliation](./reconciliation.md)
- [Implementation-gap backlog](./implementation-gap-backlog.md)
- [Maturation master plan](../../MATURATION-MASTER-PLAN.md)
- [Playground hardening plan](../../plans/05-public-docs-and-playground-hardening.md)
