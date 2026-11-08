# Playground row-level closure register

**Rebaseline:** 2026-11-07  
**Surface:** `playground/` browser IDE and hosted `/playground/` artifact  
**Catalog authority:** [expected capability catalog](./expected-capability-catalog.md)  
**Status authority:** [status matrix](./status-matrix.md)

This is the row-level closure join for the 37 IDs in the expected catalog. It
does not create, merge, remove, or promote capabilities. `Implementation
disposition` describes what is present at the owned boundary; `Evidence
boundary` describes what was actually checked; `Closure disposition` states
what remains before the row can be treated as closed for this audit.

The current source boundary is the checked-out Playground child revision
`c263920146a7ba28fe76561df25d1174b289663b`. Local commands passed on Node
`22.23.2` even though the repository contract is Node `>=24`; those results are
local evidence, not canonical toolchain parity. The browser E2E runner could
list 17 tests but could not bind its preview server (`EPERM` on
`127.0.0.1:4173`), so browser execution is not inferred from test discovery.

## Closure rules

- `✔️` means the Playground implementation boundary is present with the
  bounded evidence stated here; it does not imply hosted, native-AT, or
  physical-device proof.
- No expected row is `🌗`, `❌`, or `⚠️` in the final approved closure
  boundary. `PG-LIFE-002` is locally closed with browser observation retained
  as evidence-only follow-up.
- `⏸️` is used for `PG-A11Y-001` because supported-browser traversal and
  native AT/device evidence require unavailable hosts, and for
  `PG-DELIVERY-001` because only hosted Pages execution/public smoke remains.
  Both holds have owners, dependencies, and explicit follow-up evidence below.
- `deferred-device` and delegated DSL semantics are explicit sub-boundaries,
  not missing rows. Native assistive-technology/device evidence is held as an
  explicit `⏸️` sub-boundary below; that hold does not create or replace an
  expected capability row.
- Historical artifact mismatch and revision/pin drift remain preserved in the
  archived audit trail; the current synchronized tuple is recorded under
  `PG-DELIVERY-001` below and does not justify a second delivery row.

## Register

| ID | Status | Implementation disposition | Source boundary | Evidence boundary | Closure disposition |
| --- | :---: | --- | --- | --- | --- |
| `PG-LIFE-001` | `✔️` | Entry page and Vite `/playground/` base are implemented. | `playground/index.html`; `playground/vite.config.ts` | `pnpm build`; local title/base inspection | Local implementation closed; hosted route remains part of `PG-DELIVERY-001`. |
| `PG-LIFE-002` | `✔️` | Explicit `opening`/`restoring`/`empty`/`ready`/`error` bootstrap phases, storage-error `ERROR` status, and interaction gate are implemented. | `playground/src/App.tsx`; `playground/src/playground-status.ts`; `playground/src/indexeddb-persistence.ts`; `playground/src/worker-lifecycle.ts` | 119 unit tests cover phases/gating/error and worker lifecycle; delayed-bootstrap E2E test is discovered, while execution is not verified because preview binding returns `EPERM` | Local implementation closed. Run the delayed bootstrap browser trace on a bind-capable host as evidence follow-up; do not infer browser behavior from discovery. |
| `PG-LIFE-003` | `✔️` | Editing, resolving, ready/error, and persistence feedback are distinct in the UI state model. | `playground/src/playground-status.ts`; `playground/src/App.tsx` | `pnpm test`; local source audit | Local lifecycle implementation closed; browser presentation remains ordinary follow-up evidence. |
| `PG-LIFE-004` | `✔️` | Resolve, storage, share, clipboard, export, and restore paths have distinct feedback/recovery actions. | `playground/src/App.tsx`; `playground/src/worker.ts`; `playground/src/indexeddb-persistence.ts` | `pnpm test`; source audit of error handlers and recovery controls | Local failure/recovery boundary closed; browser/platform presentation is not claimed. |
| `PG-EDIT-001` | `✔️` | CodeMirror source editing with YAML/language-service interaction is present. | `playground/src/components/Editor.tsx`; `playground/src/App.tsx` | `pnpm test`; `pnpm build`; UX audit | Local editor implementation closed; fresh browser cursor/selection evidence remains follow-up. |
| `PG-DSL-001` | `✔️` | Playground consumes parser/resolver/graph/renderer output on the DSL v0.5 line. | `playground/src/worker.ts`; `playground/src/types.ts`; `spec/id/` | worker tests and local build; delegated conformance boundary recorded | Playground consumer boundary closed; grammar/semantic closure remains delegated to `spec/id/`, core, language-service, and renderer. |
| `PG-DIAG-001` | `✔️` | Typed diagnostics are surfaced in the Inspector with code/message/location context. | `playground/src/diagnostic-code.ts`; `playground/src/components/Inspector.tsx`; `playground/src/worker.ts` | `pnpm test`; UX audit; local diagnostic fixtures | Local diagnostic presentation closed; exhaustive delegated vocabulary is not claimed. |
| `PG-DIAG-002` | `✔️` | First-error navigation, source jump, last-successful preview, reset, and recovery hints are implemented. | `playground/src/inspector-helpers.ts`; `playground/src/App.tsx`; `playground/src/playground-status.ts` | `pnpm test`; E2E definitions; UX audit | Local recovery implementation closed; browser recovery sequence remains follow-up. |
| `PG-FILE-001` | `✔️` | New local document creation normalizes names and assigns a valid starter source. | `playground/src/App.tsx`; `playground/src/persistence.ts`; `playground/src/components/FileWorkspacePicker.tsx` | `pnpm test`; local source audit | Local create boundary closed; browser activation/reload remains follow-up. |
| `PG-FILE-002` | `✔️` | My Files, shared draft, and read-only Examples can be selected with identity/source mapping. | `playground/src/components/FileWorkspacePicker.tsx`; `playground/src/examples.ts`; `playground/src/App.tsx` | `pnpm test`; local source audit | Local open boundary closed; browser identity/reload evidence remains follow-up. |
| `PG-FILE-003` | `✔️` | Debounced local autosave exposes saving/saved/error feedback. | `playground/src/App.tsx`; `playground/src/indexeddb-persistence.ts`; `playground/src/playground-status.ts` | `pnpm test`; persistence source audit | Local save boundary closed; browser timing/focus evidence remains follow-up. |
| `PG-FILE-004` | `✔️` | Save as creates a new local document without replacing Example/shared origin. | `playground/src/App.tsx`; `playground/src/persistence.ts`; `playground/src/components/ConfirmDialog.tsx` | `pnpm test`; E2E definition; source audit | Local copy-safety boundary closed; browser collision/origin proof remains follow-up. |
| `PG-FILE-005` | `✔️` | YAML/YML import validates extension, size, name, content, and collisions before creating a document. | `playground/src/App.tsx`; `playground/src/components/FileWorkspacePicker.tsx`; `playground/src/persistence.ts` | `pnpm test`; local import handler audit | Local import boundary closed; native picker/browser observation remains follow-up. |
| `PG-FILE-006` | `✔️` | Active source downloads as sanitized YAML with success/failure feedback, including resolve-error states. | `playground/src/App.tsx` download handler | `pnpm test`; source audit; E2E definition | Local source export boundary closed; browser download observation remains follow-up. |
| `PG-FILE-007` | `✔️` | Rename/delete confirmation and Save as copy flow protect My Files identity. | `playground/src/App.tsx`; `playground/src/components/FileWorkspacePicker.tsx`; `playground/src/components/ConfirmDialog.tsx` | `pnpm test`; UX audit; E2E definition | Local file-management boundary closed; browser post-delete/collision proof remains follow-up. |
| `PG-EXAMPLE-001` | `✔️` | Bundled Examples are catalogued and exposed as read-only source choices. | `playground/src/examples.ts`; `playground/src/components/FileWorkspacePicker.tsx`; `playground/src/assets/examples/` | `pnpm test`; `pnpm build`; local source audit | Local Examples boundary closed; browser discoverability remains follow-up. |
| `PG-EXAMPLE-002` | `✔️` | Example edits remain separate from the origin and can transition through Save as. | `playground/src/App.tsx`; `playground/src/persistence.ts`; `originExampleKey` handling | `pnpm test`; source audit | Local Example safety boundary closed; browser non-overwrite proof remains follow-up. |
| `PG-PERSIST-001` | `✔️` | Versioned IndexedDB workspace restores documents, metadata, active identity, and content. | `playground/src/indexeddb-persistence.ts`; `playground/src/persistence.ts`; `playground/src/App.tsx` | `pnpm test`; local schema/read-back audit; E2E definition | Local durable persistence boundary closed; private-mode/quota/reload browser matrix remains follow-up. |
| `PG-PERSIST-002` | `✔️` | Dirty, saving, saved-local, and save-error states are distinct and preserve the in-memory session on failure. | `playground/src/App.tsx`; `playground/src/playground-status.ts`; `playground/src/indexeddb-persistence.ts` | `pnpm test`; persistence error fixtures; UX audit | Local persistence-status boundary closed; delayed browser storage evidence remains follow-up. |
| `PG-PERSIST-003` | `✔️` | Versioned JSON backup/restore has size, parse, confirmation, replacement, and recovery guards. | `playground/src/persistence.ts`; `playground/src/App.tsx` | `pnpm test`; E2E definition; local source audit | Local backup/restore boundary closed; browser file interaction remains follow-up. |
| `PG-CANVAS-001` | `✔️` | Resolved worker output is presented as a live model/physical preview. | `playground/src/worker.ts`; `playground/src/components/Preview.tsx`; `playground/src/playground-display-state.ts` | `pnpm test`; `pnpm build`; renderer safety/conformance boundary | Local preview consumer boundary closed; visual browser assertion remains follow-up. |
| `PG-CANVAS-002` | `✔️` | Bounded zoom controls and keyboard/pointer zoom update camera state. | `playground/src/preview-toolbar.ts`; `playground/src/preview-geometry.ts`; `playground/src/components/Preview.tsx` | `pnpm test`; source audit | Local zoom boundary closed; browser control/gesture observation remains follow-up. |
| `PG-CANVAS-003` | `✔️` | Pointer/pinch pan exists with toolbar/non-gesture alternatives. | `playground/src/preview-gestures.ts`; `playground/src/components/Preview.tsx`; `playground/src/preview-toolbar.ts` | `pnpm test`; UX audit; mobile E2E definition | Supported-browser implementation closed; physical touch/device evidence is `deferred-device`. |
| `PG-CANVAS-004` | `✔️` | Fit/recenter responds to scene bounds, resize, and sheet changes. | `playground/src/preview-geometry.ts`; `playground/src/components/Preview.tsx`; `playground/src/App.tsx` | `pnpm test`; source audit | Local camera-fit boundary closed; resize browser sequence remains follow-up. |
| `PG-CANVAS-005` | `✔️` | Dedicated reset restores deterministic camera state without source/file mutation or fit overwrite. | `playground/src/view-state.ts`; `playground/src/App.tsx`; `playground/src/preview-toolbar.ts` | `pnpm test`; E2E definition; source audit | Local camera-only implementation closed; browser preservation trace remains follow-up. |
| `PG-CANVAS-006` | `✔️` | Sheet/view plus Both/Source/Preview and Model/Physical surface selection is implemented. | `playground/src/App.tsx`; `playground/src/components/Navbar.tsx`; `playground/src/components/Preview.tsx`; `playground/src/view-state.ts` | `pnpm test`; local source audit | Local surface-selection boundary closed; print-workbench parity remains outside scope. |
| `PG-SELECT-001` | `✔️` | Preview anchors and Inspector/graph context share stable selected-object state. | `playground/src/components/Preview.tsx`; `playground/src/components/Inspector.tsx`; `playground/src/inspector-helpers.ts` | `pnpm test`; source audit | Local selection boundary closed; browser pointer/keyboard sync remains follow-up. |
| `PG-INSPECT-001` | `✔️` | Inspector exposes resolved objects, values, BOM, layers, parameters, and related context. | `playground/src/components/Inspector.tsx`; `playground/src/components/Sidebar/` | `pnpm test`; `pnpm build`; local source audit | Local inspector boundary closed; rare payload/browser visual coverage remains follow-up. |
| `PG-INSPECT-002` | `✔️` | Graph filtering, focus, selection, and keyboard navigation are implemented. | `playground/src/components/GraphViewer.tsx`; `playground/src/graph-navigation.ts` | `pnpm test`; UX audit; source audit | Local graph-navigation boundary closed; optional zoom/minimap is outside catalog scope. |
| `PG-THEME-001` | `✔️` | `system`, `light`, and `dark` modes apply tokens and persist safely in browser-local storage. | `playground/src/theme.ts`; `playground/src/App.tsx`; `playground/src/components/Navbar.tsx`; `playground/src/styles/tokens.css` | `pnpm test`; `pnpm build`; E2E definitions; UX audit | Local theme boundary closed; browser preference/reload execution remains follow-up and contract is unchanged. |
| `PG-RESP-001` | `✔️` | Responsive drawer/surface layout and supported narrow-layout controls are present. | `playground/src/index.css`; `playground/src/components/Navbar.tsx`; `playground/src/components/Sidebar.tsx`; `playground/e2e/mobile-playground.spec.ts` | `pnpm test`; UX audit; mobile E2E discovery; reviewed desktop evidence | Supported-browser source boundary closed; hosted viewport and physical handset evidence remain separate. |
| `PG-KEY-001` | `✔️` | Centralized documented command map covers primary actions and protects IME/AltGraph/editor text entry. | `playground/src/keyboard-commands.ts`; `playground/src/App.tsx`; `playground/docs/KEYBOARD-SHORTCUTS.md` | `pnpm test`; E2E definitions; UX audit | Local command surface closed; browser focus/reserved-key execution remains follow-up. |
| `PG-A11Y-001` | `⏸️` | Web landmarks, names, roles, states, announcements, skip navigation, drawer/dialog focus handling are implemented. | `playground/scripts/audit-ux-contract.mjs`; `playground/src/App.tsx`; `playground/src/components/{Navbar,Inspector,Sidebar,Editor,ConfirmDialog}.tsx` | `pnpm audit:ux`; `pnpm test`; E2E list; targeted DOM/recovery E2E not verified because preview binding returns `EPERM`; native AT/device host unavailable | Explicit host-evidence hold owned by `relgeo/playground` UI/accessibility. Dependency: bind-capable browser runner plus native AT/device host. Run DOM/keyboard sweep, then record VoiceOver/TalkBack/device evidence; do not infer either from static checks. |
| `PG-A11Y-002` | `✔️` | Reduced motion, forced-colors focus fallback, target sizing, and non-gesture alternatives are present. | `playground/src/index.css`; `playground/src/styles/tokens.css`; `playground/src/preview-toolbar.ts` | `pnpm audit:ux`; `pnpm test`; mobile E2E definition | Supported-browser implementation closed; physical handset/touch validation is `deferred-device`. |
| `PG-SHARE-001` | `✔️` | URL/hash share has size guard, copy feedback, and clipboard fallback. | `playground/src/share-code.ts`; `playground/src/clipboard.ts`; `playground/src/App.tsx` | `pnpm test`; local share source audit | Local share boundary closed; public URL/permission smoke remains follow-up. |
| `PG-SHARE-002` | `✔️` | Shared hashes open as transient drafts and require explicit Save as; invalid/oversized states remain distinct. | `playground/src/share-code.ts`; `playground/src/App.tsx`; `playground/src/persistence.ts` | `pnpm test`; E2E definition; source audit | Local transient-share safety closed; browser reload/no-overwrite trace remains follow-up. |
| `PG-DELIVERY-001` | `⏸️` | Local Playground build and Pages assembly are synchronized to the tested tuple; route, title, base path, asset manifest, file digests, and input provenance are fail-closed. | `playground/package.json`; `playground/vite.config.ts`; `playground/scripts/write-build-provenance.mjs`; `relgeo.github.io/.github/workflows/pages.yml`; artifact/provenance scripts | Playground build, website build, strict workspace provenance, strict Pages-input provenance, and `pnpm run test:pages-artifact` pass. Tuple: Playground `efb7396…`, website `33d7f96…`, spec `26ff532…`; hosted smoke was not run. | Explicit hosted-only hold owned by Playground + Pages delivery; rerun canonical Pages workflow and public smoke/share checks, then archive deployed revision evidence. No npm/pub.dev or production deployment is an implementation dependency. |

## Boundary follow-up register

| ID | Classification | Evidence-backed finding | Owner / next boundary |
| --- | --- | --- | --- |
| `PG-LIFE-002` | Implemented source; browser evidence open | Source model and unit gating pass, but the current E2E suite has no observed delayed-bootstrap trace and the runner cannot bind. | `relgeo/playground`; run delayed IndexedDB/bootstrap browser trace when a bind-capable runner is available. |
| `PG-A11Y-001` | Implemented web semantics; browser/native evidence open | Static UX audit and unit/source checks pass; DOM/keyboard execution is not verified and native AT is not inferred. | `relgeo/playground` accessibility owner; run supported-browser traversal, then label VoiceOver/TalkBack separately. |
| `PG-DELIVERY-001` | Hosted delivery explicitly held (`⏸️`) | Local artifact/provenance closure passes for Playground `efb7396…`, website `33d7f96…`, and spec `26ff532…`; hosted route/deployed revision/public smoke are not verified. | Playground + Pages owners; run the synchronized Pages workflow and `smoke-public-site.mjs`, then attach deployed URL and artifact revision evidence. |

## Separate accessibility evidence sub-boundary

| Sub-boundary (not an expected catalog row) | Status | Owner | Evidence boundary | Decision / reason |
| --- | :---: | --- | --- | --- |
| Native VoiceOver/TalkBack and physical-device accessibility tree for `PG-A11Y-001` | `⏸️` | `relgeo/playground` UI/accessibility owner | No native AT/device host is available in this execution environment; supported-browser DOM/keyboard evidence remains a separate boundary. | Hold native/device proof until an appropriate host is available; do not promote or infer it from source, static audit, or Playwright test discovery. |

No additional capability ID was discovered. The delivery revision/provenance
and hosted smoke limitation are evidence findings for `PG-DELIVERY-001`, while
missing delayed/browser accessibility traces are explicit host evidence
boundaries for `PG-LIFE-002` and `PG-A11Y-001`. The expected catalog,
capability matrix, and status matrix each contain exactly 37 unique capability
IDs with one row per ID; the final result is 35 `✔️`, 0 `🌗`, 0 `❌`, 0 `⚠️`,
and 2 explicit `⏸️` holds.
