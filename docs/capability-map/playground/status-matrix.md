# Playground status matrix

> **Coverage statement — 2026-11-07.** This is the capability-first status
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
| Audit date | 2026-11-07 |
| Evidence freshness | Current Playground checkout with explicit bootstrap storage-error handling, worker lifecycle recovery, and delayed-bootstrap E2E coverage: 18 test files / 119 unit tests, production build, lint, UX contract audit, and 17 discovered E2E tests pass/list successfully; targeted browser execution, hosted Pages parity, and native device evidence remain separately held and explicitly not verified |

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

### Separate accessibility evidence hold

This is an evidence sub-boundary, not an additional capability row. Native
VoiceOver/TalkBack and physical-device accessibility-tree evidence for
`PG-A11Y-001` is explicitly `⏸️` because this execution environment has no
appropriate native AT/device host. It is owned by the Playground
UI/accessibility owner and must not be inferred from static source checks,
Playwright test discovery, or the supported-browser DOM contract.

## Final closure boundary — 2026-11-07

The final approved Playground boundary has 37 one-to-one rows: 35 local
implementation closures and two explicit host/deployment holds. `PG-LIFE-002`
is green at the source/unit boundary because all four bootstrap states and
interaction gating are implemented and tested. `PG-A11Y-001` is held as a
host-dependent evidence boundary because the supported-browser runner cannot
bind (`EPERM`) and no native AT/device host is available; its web semantics
remain implemented and statically audited. `PG-DELIVERY-001` remains held only
for hosted Pages smoke/parity. Neither hold is an absent or broken Playground
implementation, and no browser, native, or hosted pass is inferred.

| Closure result | Count | IDs | Explicit boundary |
| --- | ---: | --- | --- |
| `✔️` | 35 | All rows except `PG-A11Y-001` and `PG-DELIVERY-001` | Local source, unit/static, and bounded consumer evidence |
| `⏸️` | 2 | `PG-A11Y-001`, `PG-DELIVERY-001` | Browser/native AT or hosted Pages host required; owner and follow-up are recorded below |
| `🌗` / `❌` / `⚠️` | 0 | — | No partial, absent, or broken row remains in the approved closure boundary |

## P0/P1 triage handoff — 2026-11-04 (historical intake)

The seven requested P0/P1 rows are reviewed as a single triage set. No current
row is `P0`: the matrix has no confirmed `⚠️` or `❌` Playground result, so the
selected risks are ranked P1. Six rows have a local implementation or test
boundary that can be advanced without npm/pub.dev release or production
deployment. `PG-DELIVERY-001` is an explicit hosted-only hold because its local
artifact/provenance boundary is closed and only hosted parity/public smoke
remains.

The backlog and closure register preserve the row-level triage classification,
owner, source of truth, acceptance test, and next action for that historical
intake. The final capability-first table below is the sole status-matrix row
for each expected ID; the historical intake is not duplicated as a second set
of capability rows.

## Capability-first matrix

| ID | Capability | Status | Evidence | Gap / limitation | Owner | Dependency | Risk | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `PG-LIFE-001` | Open usable Playground session | `✔️` | Local `index.html`, Vite base, build | Hosted route/smoke unverified | Playground + Pages delivery | Vite base and hosted artifact | Public entry can diverge from tested build | Run current hosted smoke and compare artifact revision |
| `PG-LIFE-002` | Loading/startup state | `✔️` | Explicit `opening`/`restoring`/`empty`/`ready`/`error` phase model, bootstrap storage errors surfaced as `ERROR`, 119 unit tests, and delayed-bootstrap E2E coverage | Local implementation and gating are verified; delayed browser trace is explicitly not verified because the Playwright preview server cannot bind (`EPERM`) | Playground lifecycle owner | React bootstrap, IndexedDB, examples | Browser-only observation remains unavailable | Run delayed bootstrap test on a bind-capable host; this is evidence follow-up, not an open implementation gap |
| `PG-LIFE-003` | Product lifecycle state | `✔️` | Stable fixed-width status dot; ready/error text is available as tooltip without shifting toolbar controls | Export is action feedback, not a separately named state | Playground | Worker, persistence, view state | Transition meaning can be inferred inconsistently | Keep lifecycle assertions in browser smoke |
| `PG-LIFE-004` | Failure and recovery state | `✔️` | Worker/storage/share/clipboard paths and recovery controls | Native/platform presentation unverified | Playground | Worker, IndexedDB, URL, clipboard | Users may not recover consistently across browsers | Run browser failure-path evidence |
| `PG-EDIT-001` | RelGeo source editor | `✔️` | CodeMirror, YAML, linter, completion, hover; local tests/build | Fresh browser cursor/selection proof unavailable | Playground editor | CodeMirror and language-service | Authoring confidence may exceed current browser evidence | Retain browser editor smoke |
| `PG-DSL-001` | Resolve against DSL v0.5 | `✔️` | Worker parser/resolver/graph/renderer wiring, worker tests, and shared semantic replay/conformance | Full semantic parity is delegated and not re-audited here; renderer owns the typed semantic projection and safe SVG serialization | Playground consumer | `spec/id/`, core, renderer, language-service | Consumer can drift from normative DSL | Maintain cross-package conformance fixtures |
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
| `PG-CANVAS-001` | Live canvas/preview | `✔️` | Worker SVG and Preview model/physical surfaces; 109 Playground tests, shared conformance, and renderer safety boundary pass | Visual browser assertion unavailable; DOM insertion remains dependent on the renderer-produced SVG contract | Playground consumer | Core, renderer, worker | Render drift can evade source tests | Re-run visual/interaction smoke |
| `PG-CANVAS-002` | Zoom viewport | `✔️` | Toolbar, clamped zoom, Ctrl/Meta+wheel | Browser control/gesture unverified | Playground Preview | Pointer/wheel events and camera state | Zoom can become inaccessible or mutate model | Add browser zoom boundary assertions |
| `PG-CANVAS-003` | Pan viewport | `✔️` | Pointer capture, pinch/pan handlers, gesture tests | Physical touch evidence deferred | Playground Preview | Pointer events and touch contract | Device gesture behavior may differ | Keep device validation as separate held follow-up |
| `PG-CANVAS-004` | Fit/recenter | `✔️` | Camera computation and `ResizeObserver` | Resize sequence unverified in browser | Playground Preview | SVG bounds, container resize | Scene can remain off-screen after layout change | Add resize/fit browser assertion |
| `PG-CANVAS-005` | Dedicated reset viewport | `✔️` | Camera-only reset source, unit coverage, and toolbar binding | Browser proof of source/file/selection preservation unavailable | Playground Preview/App | Camera state and command map | Camera behavior can regress without browser assertion | Re-run camera-only reset browser assertion when the server can bind |
| `PG-CANVAS-006` | Sheet/view/surface selection | `✔️` | Sheet, Model/Physical, Both/Source/Preview and layout controls | Print-workbench parity intentionally excluded | Playground | View state and Preview | Surface semantics can be confused | Keep model/physical labels explicit |
| `PG-SELECT-001` | Object/anchor selection | `✔️` | Preview anchors, Inspector selection, related navigation | Pointer/keyboard browser flow unverified | Playground UI | Stable DSL object identity | Context can lose selection after resolve | Add selection/re-resolve smoke |
| `PG-INSPECT-001` | Inspector | `✔️` | Resolved, Values, BOM, filters and source jump | Completeness depends on resolved payload | Playground Inspector | Resolved scene and editor | Rare object types may lack context | Expand representative inspector fixtures |
| `PG-INSPECT-002` | Dependency graph navigation | `✔️` | Filter/focus, selectable nodes, roving keyboard navigation | Graph zoom/minimap optional, not a gap | Playground GraphViewer | Dependency graph payload | Large graphs can be hard to navigate | Keep focused graph fixtures and keyboard tests |
| `PG-THEME-001` | User-visible theme | `✔️` | `theme.ts`, theme selector, token variants, and unit tests | Browser selector/system preference/reload assertion unavailable | Playground product/UI owner | CSS tokens and browser-local storage | Browser-specific preference behavior remains unobserved | Re-run theme browser assertions when the server can bind |
| `PG-RESP-001` | Responsive layout | `✔️` | `f5418e6` responsive desktop layout; `8d669f4` file-actions Menu; `e497d63` one-row toolbar; `c7cec4b` stable dot-only preview status and tooltip; user-reviewed desktop screenshot | The current view was reviewed at desktop width; automated viewport matrix, hosted parity, and handset are not verified | Playground UI | CSS, Navbar, Sidebar, Preview | Narrow layouts can hide primary actions | Keep desktop toolbar on one row at supported widths; verify hosted/browser and handset separately |
| `PG-KEY-001` | Keyboard command surface | `✔️` | Centralized Mod+Alt command map, documentation, and unit tests | Browser focus/conflict behavior unavailable | Playground UI owner | CodeMirror/browser focus and dialog semantics | Reserved-key conflicts remain unobserved | Re-run shortcut and focus browser assertions when the server can bind |
| `PG-A11Y-001` | Accessibility semantics | `⏸️` | ARIA, landmarks, live status, focus traps, skip links, expanded DOM/keyboard/recovery assertions, static UX audit | Local web semantics are implemented and statically audited; supported-browser traversal and native AT/device evidence are not verified because required hosts are unavailable | Playground UI + accessibility owner | Bind-capable browser runner; native VoiceOver/TalkBack/device host | Host-specific accessibility behavior remains unobserved | Run the discovered DOM/keyboard sweep, then record native AT/device evidence separately; retain this explicit hold until those hosts are available |
| `PG-A11Y-002` | Accessibility preferences/input tolerance | `✔️` | Reduced motion, forced-colors focus fallback, target sizing, keyboard alternatives, UX audit | Physical handset/touch evidence deferred | Playground UI + accessibility owner | Design tokens, CSS media, device QA | Device-specific tolerance remains unobserved | Record supported-browser contrast/target review and device result when available |
| `PG-SHARE-001` | URL/share source | `✔️` | Base64URL, 180000 guard, history, clipboard fallback | Public URL/permission behavior unverified | Playground | URL hash and clipboard APIs | Share may be too large or fail silently | Run deployed share-link smoke |
| `PG-SHARE-002` | Transient-share safety | `✔️` | Shared draft, explicit Save as, invalid/oversized hash feedback | Browser reload/share flow unverified | Playground | Hash parser and file model | Shared source could overwrite local work | Add browser reload and no-overwrite assertions |
| `PG-DELIVERY-001` | Public artifact consistency | `⏸️` | Local assembled artifact passes route/title/base-path/asset-manifest/digest assertions; synchronized tuple is Playground `efb7396…`, website `33d7f96…`, spec `26ff532…`, root baseline `b3d9a4a…` | Hosted Pages deployment revision and public smoke/share are not available in this environment; this is an explicit delivery hold, not a local artifact defect | Playground + Pages delivery owner | GitHub Pages workflow and public host | Deployed artifact can still diverge from the locally assembled artifact | Pages owner reruns workflow and `smoke-public-site.mjs`, then records deployed URL/revision evidence |

## Summary and handoff

| Status | Count | Interpretation |
| --- | ---: | --- |
| `✔️ implemented` | 35 | Bounded implementation exists; evidence qualifications remain in-row. |
| `🌗 partial` | 0 | No partial row remains in the approved closure boundary. |
| `❌ absent` | 0 | No selected Playground capability is currently absent at the source boundary. |
| `⚠️ broken` | 0 | No confirmed broken Playground behavior in this audit. |
| `⏸️ deferred` | 2 | `PG-A11Y-001` is held for browser/native host evidence; `PG-DELIVERY-001` is held at the hosted Pages boundary. |
| `➖ not applicable` | 0 expected rows | Cloud collaboration, folders, print-workbench parity, and graph zoom/minimap remain outside this expected boundary. |

The matrix is a downstream status view. Any implementation change must update
the expected catalog, audit, reconciliation, and this matrix explicitly when
the capability boundary or evidence changes.

The complete one-row-per-ID source/evidence/closure join is maintained in the
[row-level closure register](./closure-register.md). It records all 37 expected
IDs, with 35 `✔️` rows and explicit `⏸️` holds for `PG-A11Y-001` and
`PG-DELIVERY-001`.

Linked artifacts:

- [Expected catalog](./expected-capability-catalog.md)
- [Implementation audit](./implementation-audit.md)
- [Expected-versus-observed reconciliation](./reconciliation.md)
- [Implementation-gap backlog](./implementation-gap-backlog.md)
- [Maturation master plan](../../MATURATION-MASTER-PLAN.md)
- [Playground hardening plan](../../plans/05-public-docs-and-playground-hardening.md)
