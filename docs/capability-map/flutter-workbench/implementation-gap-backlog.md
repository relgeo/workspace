# Flutter Workbench — Implementation Gap Backlog

**Status:** frozen delivery contract; implementation gaps remain open until their
own validation evidence passes
**Date:** 2026-11-03

**Expected source:** [`expected-capability-catalog.md`](./expected-capability-catalog.md) (canonical baseline: [`12-flutter-workbench-capability-baseline.md`](../../plans/12-flutter-workbench-capability-baseline.md))
**Audit source:** [`flutter-workbench/implementation-gap-map.md`](./implementation-gap-map.md)  
**Status matrix:** [`flutter-workbench/status-matrix.md`](./status-matrix.md)  
**Join source:** [`flutter-workbench/reconciliation.md`](./reconciliation.md)  
**Scope context:** [`06-flutter-alignment.md`](../../plans/06-flutter-alignment.md)

> **Current delivery checkpoint — 2026-10-31:** Flutter `60ec76042b369659e4d048b2a53ea3a66a384de3` passed CI run `41184291670`; release run `41184693233` produced unpublished v1.0.1 macOS universal, Linux x64, and Windows x64 bundles with checksums/provenance. These artifacts close the build/upload portion of the platform work, not target-host launch, native picker/export, MCP packaged smoke, signing/notarization, or installation evidence. The source/test details below are from the 2026-10-30 `b21eceb` audit and remain historical unless explicitly linked to the current CI/release run.

## Evidence and scope boundary

| Source | Backlog use |
| --- | --- |
| `flutter@60ec76042b369659e4d048b2a53ea3a66a384de3` | Current root gitlink/release-workflow pointer; current CI and draft artifact evidence is summarized above. |
| `flutter@b21eceb258070133f32fd822b6fd23a4f21b0bbf` | Historical detailed source/test/platform audit dated 2026-10-30; not the current release pointer. |
| [`docs/MATURATION-MASTER-PLAN.md`](../../MATURATION-MASTER-PLAN.md) | Roadmap, compatibility line, desktop delivery gates, and evidence provenance rules. |
| [`docs/REPOSITORY-MAP.md`](../../REPOSITORY-MAP.md) | Ownership boundary for `relgeo/flutter` and `relgeo/workspace`. |
| [`docs/capability-map/INVENTORY-PROTOCOL.md`](../INVENTORY-PROTOCOL.md) and related capability-map artifacts | Expected-but-missing rule, evidence separation, scope handling, and coverage validation. |

Priority is product impact, not execution order: `P0` is an absent
user-facing capability with material authoring/data-loss impact; `P1` is a
partial contract, integration, accessibility, or delivery capability that
needs implementation and/or stronger evidence. Native host or CI unavailability
does not lower an implementation priority and does not count as a fix.

## Frozen authoring contract — 2026-11-03

This section freezes the behavior boundary for `GAP-FW-001` through
`GAP-FW-006`. It is an executable contract for the Flutter boundary, not a
claim that native host evidence is complete. Behavior, local test evidence,
and host evidence remain separate so a missing desktop runtime cannot silently
become either a pass or an implementation failure.

| Gap | Frozen behavior at the Flutter boundary | Local executable evidence | Host/evidence boundary |
| --- | --- | --- | --- |
| `GAP-FW-001` | New/Open/Close/Quit are destructive actions guarded by dirty state. Open picker cancellation has no discard prompt and no document mutation. Save writes the active identity when present; Save As and untitled Save use the host destination boundary. Successful local load/save/new/close clears the recovery record; host lifecycle callbacks remain host-owned and do not claim completion without a result. Dirty editor changes persist one best-effort recovery draft; startup offers `RESTORE` or `DISCARD`. | Lifecycle/file-service tests in `widget_test.dart`; `workbench_file_service_test.dart`; `workbench_document_recovery_test.dart`; recovery restore widget test. | Native picker appearance, permissions, forced process termination, and real relaunch remain `not verified` on this host. |
| `GAP-FW-002` | Active import accepts YAML/RelGeo source through the file service. YAML parse failures and resolver/compiler failures remain distinct and are projected to stable bounded codes `relgeo.yaml.parse` and `relgeo.compile`; full path/phase parity belongs to the cross-consumer promotion gap. | `workbench_import_diagnostics_test.dart`; invalid fixture tests; active fixture/diagnostic widget tests. | Current-pointer cross-consumer promotion and full diagnostic path/phase parity are not claimed by Flutter-local tests. |
| `GAP-FW-003` | Inspector and parameter surfaces consume the active compiled document/selection state. Parameter/profile edits recompile the active source; exhaustive evaluator/profile parity is outside this freeze. | Existing inspector, parameter, document-controller, and widget contract tests. | Full DSL/evaluator parity remains the dependent implementation task. |
| `GAP-FW-004` | Scene graph, canvas hit-testing, and inspector share stable selected-object identity. Empty-canvas hits clear selection; hidden roles are excluded. | Existing scene-graph, selection, viewport, and inspector widget tests. | Physical pointer/keyboard and native accessibility announcement remain host evidence. |
| `GAP-FW-005` | Commands route through the shared registry; focus/activation and dirty close/quit guards are host-neutral contracts. Native menu/window adapters are optional host implementations. | Existing command, keyboard, semantics, window-policy, and window-host tests. | Per-OS shortcut mapping, VoiceOver/screen-reader tree, and native close/quit event evidence remain `not verified`. |
| `GAP-FW-006` | Artifact provenance records source pointer, workflow/artifact identity, platform/architecture, checksum, and verification result as separate observations. Build success does not imply install/launch/MCP/picker/export success. | Current local analyzer/test/build commands and the provenance notes below. | Ubuntu/Windows hosts, signed distribution, and target-host launch/install smoke are unavailable here and remain explicitly open. |

The active implementation additionally freezes numeric parameter metadata (type,
label, bounds, and step) at the document-settings boundary, rejects unknown or
non-finite overrides, and keeps inspector detail rows aligned with resolved
quadratic/cubic/boolean/clone/collection objects. Regression coverage is in
`flutter/test/workbench_document_settings_test.dart`,
`flutter/test/workbench_document_controller_test.dart`,
`flutter/test/widget_test.dart`, and `flutter/test/inspector_panel_test.dart`.
This is local target evidence; native host accessibility and window evidence
remain separate.

### Current verification handoff — 2026-11-03

Current root `2ff198d` and Flutter child `60ec760` have passing local evidence:
`flutter analyze --no-pub`, the full Flutter suite (324 tests), and the focused
shared fixture/invalid boundary/SVG contract suite (45 tests). Canonical fixture
staging copied 23 fixtures. The required conformance runner was also invoked,
but stopped before analyzer/test because the managed Flutter SDK could not write
`flutter/bin/cache/engine.stamp`; the macOS debug build was blocked by the same
environment limitation. No claim is made for macOS launch, picker, export,
accessibility, Linux/Windows runtime, or install behavior. This handoff keeps
target test closure separate from unavailable host evidence.

### Contract invariants

- A failed Open or Save preserves the editor source, document identity, and
  dirty state; the user receives an operation-specific error surface.
- A picker cancellation is a no-op. Dirty confirmation runs only after a
  document has been selected or when a destructive lifecycle action is about
  to replace/close the active document.
- Recovery is best effort and single-draft: missing, empty, or unreadable
  storage is ignored; `RESTORE` loads the draft and consumes it; `DISCARD`
  consumes it without changing the active document.
- The Flutter import adapter exposes bounded MCP diagnostics only. It does not
  derive a source path, phase, or evaluator parity claim from exception text.
- Native picker, assistive technology, window-manager, target-host, signing,
  and distribution results must be recorded as separate evidence classes.

## Implementation tranche evidence — 2026-10-30

The Flutter boundary now contains a focused implementation for `DOC-08`,
`CANVAS-05`, and `VIEW-05`:

- `DOC-08`: best-effort dirty-draft persistence and startup RESTORE/DISCARD
  flow in `flutter/lib/src/ui/workbench_document_recovery.dart` and
  `flutter/lib/src/ui/cad_workbench.dart`, covered by
  `flutter/test/workbench_document_recovery_test.dart`.
- `CANVAS-05`: resolved-scene dependency graph model/panel and the View-panel
  command in `flutter/lib/src/ui/workbench_scene_graph.dart`,
  `workbench_scene_graph_panel.dart`, and `cad_workbench.dart`, covered by
  `flutter/test/workbench_scene_graph_test.dart` and
  `workbench_scene_graph_panel_test.dart`.
- `VIEW-05`: visible-object hit-testing and shared canvas/graph/inspector
  selection in `workbench_scene_graph.dart`, `workbench_viewport_panel.dart`,
  `canvas_painter.dart`, and inspector wiring, covered by the graph/selection
  tests.

The historical local verification result is `flutter analyze --no-pub` passing with no
issues; the 2026-10-30 `flutter test --no-pub --reporter compact` run passed 307 tests.
This evidence is boundary-scoped: native restart, pointer, accessibility, and
window-host behavior remain unverified. The grouped goals below stay visible
until their remaining acceptance behavior is satisfied; this section does not
promote the status matrix or close native-host work.

## Rules

This is a planning/reporting artifact, not implementation. A candidate becomes
done only after source changes, tests, and the stated evidence target pass.
The rows below cover every current `❌` and `🌗` capability in the status
matrix. A missing runtime, host, or CI service is an evidence limitation and
must not be reported as an implementation fix.

`Owner` identifies the implementation boundary. `Dependency` is a real
prerequisite, not a priority ranking. Acceptance targets deliberately include
both tests and the evidence needed to promote a capability beyond local source
coverage.

## P0/P1 triage disposition — 2026-11-04

This is the canonical triage for the remaining Flutter Workbench rows. A row is
`implementation-closable` when its Flutter/source/contract behavior can be
implemented and accepted with source-level, fixture, or consumer-contract
tests available in the workspace. Native dialogs, forced process termination,
assistive technology, target-host launch, and release infrastructure remain
separate evidence gates; their absence is recorded as `unverified`, not as a
failed implementation.

The initial status below is the status at triage time and does not promote a
row in the status matrix. `🌗 partial` remains the matrix status until the
acceptance target and its evidence pass.

### Selected implementation-closable rows

| ID | Priority | Disposition | Owner | Source of truth | Acceptance test / evidence target | Initial status |
| --- | --- | --- | --- | --- | --- | --- |
| `DOC-08` | `P0` | Implement recovery contract; host relaunch is a separate gate | `relgeo/flutter` | `W02`, `MP`, [frozen contract](#frozen-authoring-contract--2026-11-03) | Recovery store tests cover dirty-draft write, missing/empty/corrupt input, `RESTORE`, `DISCARD`, and cleanup after successful lifecycle; host forced-exit/relaunch is recorded separately | `🌗 partial` |
| `IO-01` | `P1` | Implement adapter/cancellation/identity boundary; native picker is evidence-only | `relgeo/flutter` | `W02`, `P10`, [GAP-FW-001](#candidate-goalstasks) | Injected picker tests prove Open/Save As routing, cancellation no-op, selected identity, and failure preservation; macOS/Linux/Windows dialog smoke remains unverified | `🌗 partial` |
| `IO-02` | `P1` | Implement active RelGeo/YAML import and bounded diagnostics | `relgeo/flutter` + `relgeo/core` | `P06`, `DSL`, `P10`, [GAP-FW-001](#candidate-goalstasks) | Active `.relgeo`/`.yaml`/`.yml` fixtures cover valid import, parse failure, compile failure, and stable diagnostic codes; archive/project import is out of scope | `🌗 partial` |
| `EDIT-04` | `P1` | Complete structured diagnostic projection | `relgeo/flutter` + `relgeo/core` | `P06`, `P10`, `DSL`, [GAP-FW-002](#candidate-goalstasks) | Fixture assertions cover code, type, message, path, phase, severity, and object context at the Flutter boundary without deriving fields from exception text | `🌗 partial` |
| `CONTRACT-01` | `P1` | Reconcile the active DSL `0.5.x` contract on the current pointer | `relgeo/spec` + `relgeo/flutter` | `MP`, `P06`, `DSL`, [GAP-FW-002](#candidate-goalstasks) | Current-pointer shared fixtures pass in spec/core/Flutter consumers with the same expected compile status and diagnostic projection; historical runs do not count | `🌗 partial` |
| `CONTRACT-02` | `P1` | Promote only the active semantic geometry boundary | `relgeo/spec` + `relgeo/flutter` + `relgeo/core` | `P06`, `P07`, `DSL`, [GAP-FW-002](#candidate-goalstasks) | Promoted geometry fixtures assert resolved identity/order/geometry and bounded diagnostics across the current consumers; candidate evaluator/topology surfaces remain excluded until promoted | `🌗 partial` |
| `CONTRACT-03` | `P1` | Close semantic SVG comparator coverage; retain presentation exclusions | `relgeo/spec` + `relgeo/flutter` + `relgeo/renderer-svg` | `P07`, `D09`, `DSL`, [GAP-FW-002](#candidate-goalstasks) | Semantic SVG fixtures compare identity, primitive/path geometry, subpaths, endpoints, rings, and tolerance; raw bytes, styles, metadata, and presentation parity remain non-goals | `🌗 partial` |
| `CANVAS-03` | `P1` | Complete active inspector field inventory and projection | `relgeo/flutter` + `relgeo/core` | `P06`, `P10`, `DSL`, [GAP-FW-003](#candidate-goalstasks) | Inventory fixtures map expected resolved object/geometry/constraint fields to inspector tabs and assert stable values for representative objects | `🌗 partial` |
| `CANVAS-04` | `P1` | Complete bounded parameter/profile editing parity | `relgeo/flutter` + `relgeo/core` | `W02`, `DSL`, [GAP-FW-003](#candidate-goalstasks) | Conditional panel, default/profile/derived values, valid edits, unknown/non-finite rejection, and recompile/preview consistency pass in Flutter/core fixtures | `🌗 partial` |
| `CMD-03` | `P1` | Lock host-neutral shortcut registry/map; OS mapping is evidence-only | `relgeo/flutter` | `W01`, `W02`, [GAP-FW-005](#candidate-goalstasks) | Command tests assert discoverable labels, enabled state, no duplicate/conflicting bindings in the declared map, and keyboard activation; per-OS smoke remains unverified | `🌗 partial` |
| `A11Y-01` | `P1` | Complete Flutter focus/traversal contract; native traversal is evidence-only | `relgeo/flutter` | `P10`, `W02`, [GAP-FW-005](#candidate-goalstasks) | Widget/semantics tests cover Tab, Enter, Space, arrows, Escape, focus order, activation, and non-trapping panels; native traversal remains unverified | `🌗 partial` |
| `A11Y-02` | `P1` | Complete semantic labels/values/states at the Flutter boundary | `relgeo/flutter` | `P10`, `W01`, `W02`, [GAP-FW-005](#candidate-goalstasks) | Semantics assertions cover role, label, value, checked/focus state, panels, theme, filters, selection, and diagnostics; VoiceOver/NVDA/AT trees remain unverified | `🌗 partial` |
| `WINDOW-01` | `P1` | Complete host-neutral lifecycle bridge/dirty-guard contract | `relgeo/flutter` | `W02`, `P10`, [GAP-FW-005](#candidate-goalstasks) | Lifecycle tests cover clean close, dirty save/discard/cancel, quit, callback ordering, and no mutation on cancellation; native window-manager events remain unverified | `🌗 partial` |

### Evidence-only or already implemented at boundary

These rows remain visible because their remaining proof needs a host or current
artifact, not because the local Flutter implementation should be restarted.

| ID | Priority | Disposition | Owner | Source of truth | Acceptance test / evidence target | Initial status |
| --- | --- | --- | --- | --- | --- | --- |
| `CANVAS-05` | `P0` | Flutter graph boundary implemented; native AT and richer relationship evidence only | `relgeo/flutter` | `P06`, `P10`, `DSL`, [GAP-FW-004](#candidate-goalstasks) | Keep graph identity/panel regressions; add native accessibility and promoted relationship smoke when host is available | `✔️` at Flutter boundary; evidence open |
| `VIEW-05` | `P0` | Flutter selection boundary implemented; physical pointer/keyboard evidence only | `relgeo/flutter` | `W01`, `W02`, [GAP-FW-004](#candidate-goalstasks) | Keep shared selection/empty-canvas regressions; run physical pointer and keyboard selection smoke on a target host | `✔️` at Flutter boundary; evidence open |
| `PLAT-01` | `P1` | Target-host artifact launch/runtime evidence | `relgeo/flutter` + `relgeo/workspace` | `P10`, `MAC`, `D09` | Install/launch current macOS artifact and record picker/export/MCP/clean-exit results with checksum and source pointer | `🌗 partial` |
| `PLAT-02` | `P1` | Target-host artifact launch/runtime evidence | `relgeo/flutter` + `relgeo/workspace` | `P10`, `D09` | Install/launch current Ubuntu/Linux artifact across declared session boundary and record runtime results with provenance | `🌗 partial` |
| `PLAT-03` | `P1` | Target-host artifact launch/runtime evidence | `relgeo/flutter` + `relgeo/workspace` | `P10`, `D09` | Extract/launch current Windows artifact and record DLL/input/picker/MCP/clean-exit results; signing is separate | `🌗 partial` |
| `PLAT-04` | `P1` | Refresh and join artifact provenance | `relgeo/workspace` | `MP`, `P10`, [HYGIENE-FW-001](#non-feature-hygiene-follow-ups) | Current root baseline, Flutter pointer, workflow/run, platform, architecture, checksum, and verification result join without stale revision claims | `🌗 partial` |

### Explicitly excluded from this implementation tranche

Mobile delivery/AT, custom title-bar implementation, raw SVG byte/presentation
parity, pub.dev publication, signing/notarization, store distribution,
production deployment, and unavailable target-host smoke are `deferred`,
`not applicable`, or `unverified` evidence boundaries. They retain a next
action where relevant and are not prerequisites for the source-level work
listed above.

## Contract and acceptance lock — 2026-11-04

This section freezes the acceptance boundary for every selected P0/P1 row. It
documents the existing public behavior and does not change the public DSL or
package contract. The [compatibility matrix](../../compatibility-matrix.json)
remains authoritative: active line `0.5`, public package line `0.5.x`, omitted
version defaults to `0.5`, and a breaking language-contract change requires a
next compatibility line and decision record. The [inventory protocol](../INVENTORY-PROTOCOL.md)
requires implementation, evidence, parity, and scope to remain separate; the
evidence column below therefore names host/CI/public work that cannot be
inferred from local tests.

Source aliases `MP`, `P06`, `P07`, `P10`, `W01`, `W02`, `DSL`, `D09`, and `MAC`
resolve to the source-of-truth legend in the [expected baseline](../../plans/12-flutter-workbench-capability-baseline.md#12-source-of-truth-legend).
Owner and initial status remain in the triage tables above.

| Acceptance ID | Capability | Source of truth | Success behavior | Failure / edge behavior | Expected evidence |
| --- | --- | --- | --- | --- | --- |
| `FW-A01` | `DOC-08` | `W02`, `MP`, frozen authoring contract | Dirty edits produce one best-effort draft; startup offers `RESTORE` or `DISCARD`; successful New/Open/Save/Close clears the draft. | Missing, empty, or unreadable storage does not crash or mutate the active document; stale-draft handling is explicit before promotion and must not silently replace the active document; restore failure is surfaced without claiming recovery. | Recovery-store unit/widget tests; forced-exit and real relaunch remain host evidence. |
| `FW-A02` | `IO-01` | `W02`, `P10` | Open and Save As delegate through the file-picker boundary and apply the selected identity/path. | Picker cancellation is a no-op; read/write/permission failure preserves source, identity, and dirty state; native dialog behavior is not inferred. | Injected file-service/picker tests; macOS/Linux/Windows picker smoke when hosts exist. |
| `FW-A03` | `IO-02` | `P06`, `DSL`, `P10` | `.relgeo`, `.yaml`, and `.yml` inputs enter the active document/import path and compile against the active `0.5.x` boundary. | YAML parse failure maps to `relgeo.yaml.parse`; resolver/compiler failure maps to `relgeo.compile`; unsupported archive/project formats are not silently accepted. | Valid/invalid import fixtures and diagnostic assertions; current-pointer cross-consumer promotion is separate. |
| `FW-A04` | `EDIT-04` | `P06`, `P10`, `DSL` | User-facing diagnostics retain bounded code/type, message, path, phase, severity, and object context where the active contract provides them. | Unknown fields remain nullable/bounded; exception text is never parsed into an invented path/phase/object claim; invalid compile preserves the last valid preview. | Flutter invalid-boundary/diagnostic tests plus shared fixture projections; full vocabulary parity remains partial until promoted. |
| `FW-A05` | `CONTRACT-01` | `MP`, `P06`, `DSL`, compatibility matrix | Current-pointer Flutter/core/spec fixtures agree on active `0.5` compile status and bounded diagnostic projection. | Omitted version defaults to `0.5`; legacy `0.4` remains supported as declared; `0.1`–`0.3` are regression-only; future unsupported versions use `UNSUPPORTED_SPEC_VERSION`. | Current-pointer shared conformance run with exact revisions; historical evidence cannot promote the row. |
| `FW-A06` | `CONTRACT-02` | `P06`, `P07`, `DSL` | Promoted semantic geometry fixtures preserve resolved identity, ordering, supported geometry, and bounded diagnostics across current consumers. | Unsupported evaluator/topology/degenerate surfaces remain explicit candidate or diagnostic outcomes; no full-spec parity is inferred from a passing bounded fixture. | Core/Flutter/renderer fixture and semantic projection comparators at the same pointer. |
| `FW-A07` | `CONTRACT-03` | `P07`, `D09`, `DSL` | Semantic SVG comparison preserves object identity, primitive/path geometry, subpaths, endpoints, rings, and declared tolerance. | Raw bytes, whitespace, attribute order, styles, metadata, text metrics, viewBox policy, and overlays remain excluded unless a new decision promotes them. | Semantic SVG fixtures/comparator and renderer consumer tests; presentation evidence remains separate. |
| `FW-A08` | `CANVAS-03` | `P06`, `P10`, `DSL` | Inspector tabs expose the active selection's supported object, geometry, value, constraint, and diagnostic fields with stable values. | No selection or unknown/unavailable fields render a bounded empty state; inspector must not fabricate values or mutate the document while inspecting. | Field-inventory fixtures plus inspector/controller/widget tests for representative resolved objects. |
| `FW-A09` | `CANVAS-04` | `W02`, `DSL` | Parameters panel is conditional; valid parameter/profile edits update document settings, compile result, and preview consistently. | Empty parameter set hides the panel without layout failure; unknown, non-finite, or out-of-range overrides are rejected without partial mutation; reset restores declared defaults. | Parameter/profile/controller/widget fixtures in Flutter and matching core contract cases. |
| `FW-A10` | `CMD-03` | `W01`, `W02` | Shared command registry exposes stable labels, enabled/checked state, and keyboard activation for the declared shortcut map. | Duplicate/conflicting bindings are rejected by contract; unsupported platform modifier differences are recorded rather than silently remapped. | Command/shortcut registry tests and declared-map audit; OS shortcut smoke is external evidence. |
| `FW-A11` | `A11Y-01` | `P10`, `W02` | Required controls are reachable and activatable with Tab, Enter, Space, arrows, and Escape in the declared context. | Disabled or decorative elements are not actionable; focus does not trap in a panel; cancellation leaves focus and document state coherent. | Widget focus/semantics tests; native traversal on macOS/Linux/Windows remains unverified. |
| `FW-A12` | `A11Y-02` | `P10`, `W01`, `W02` | Semantics expose role, label, value, checked/focus state, panel, theme, filter, selection, and diagnostic state for user-facing controls. | Dynamic state updates the semantics tree; hidden/decorative content is not exposed as an actionable control; native AT announcements are not inferred. | Flutter semantics tests and current native AX/AT tree capture when available. |
| `FW-A13` | `WINDOW-01` | `W02`, `P10` | Clean close/quit exits; dirty close/quit invokes save/discard/cancel and follows the shared lifecycle guard. | Cancel preserves source, identity, dirty state, and recovery record; callback ordering is deterministic; host callback failure does not claim clean exit. | Lifecycle/window-host tests; native window-manager close/quit smoke is external evidence. |
| `FW-A14` | `CANVAS-05` | `P06`, `P10`, `DSL` | Graph panel renders stable dependency identities for the active resolved document and shares selection with canvas/inspector. | Empty or unsupported relationship projection is bounded and does not invent edges; richer semantics and native AT are not inferred. | Graph model/panel tests; native accessibility and promoted relationship smoke remain open. |
| `FW-A15` | `VIEW-05` | `W01`, `W02` | Visible-object hit testing selects one shared object identity across canvas, graph, inspector, and overlays; empty canvas clears selection. | Hidden roles are excluded; unsupported/richer geometric hit behavior remains outside this boundary; pointer evidence is not inferred from widget tests. | Selection/scene-graph/viewport widget tests; physical pointer and keyboard host smoke remain open. |
| `FW-A16` | `PLAT-01` | `P10`, `MAC`, `D09` | Current macOS artifact installs/launches and records window, picker, export, MCP, and clean-exit results with checksum/provenance. | Launch, dependency, picker, or MCP failure is recorded as target-host evidence, not silently converted into a source parity claim; signing is separate. | Current artifact host transcript and provenance record. |
| `FW-A17` | `PLAT-02` | `P10`, `D09` | Current Linux artifact extracts/launches on declared Wayland/X11 session and records runtime/picker/input/clean-exit results. | Missing host/session/dependency is `not verified`; it is not a target implementation failure; distribution packaging remains separate. | Ubuntu/Linux host transcript, artifact checksum, and source/workflow pointer. |
| `FW-A18` | `PLAT-03` | `P10`, `D09` | Current Windows artifact extracts/launches with `.exe`, DLL, and data, and records input/picker/MCP/clean-exit results. | Missing host, DLL, SmartScreen, or runtime evidence is recorded as unverified; signing/installer work is out of scope here. | Windows 11 host transcript, artifact checksum, and source/workflow pointer. |
| `FW-A19` | `PLAT-04` | `MP`, `P10`, compatibility matrix | Provenance joins current root baseline, Flutter pointer, workflow/run, SDK, OS/architecture, checksum, and verification result. | Stale or mismatched baseline is rejected from a current promotion; a checksum/build record alone cannot claim install or runtime success. | Machine-readable provenance record and current-pointer baseline/CI evidence. |

### Contract-change guard

No row above changes the public DSL/API contract. Any future change that alters
accepted syntax, diagnostic meaning, semantic projection, or cross-consumer
behavior must update the normative source first, classify the change as
`none`, `patch-compatible`, or `breaking` in `docs/compatibility-matrix.json`,
and attach the required decision record before implementation promotion. UI,
host, test, and evidence-only changes may proceed within this locked boundary
when they preserve the stated semantics.

## Implementation refresh — 2026-11-05

The first source-level acceptance slices are now implemented and tested:

- `CANVAS-04`: parameter metadata exposes `accepts`; the document controller
  filters unknown, non-finite, invalid-bound, and out-of-range overrides before
  they can trigger recompilation. This is a bounded editor contract, not full
  evaluator/profile parity.
- `IO-02`: recent-path import rejects extensions outside `.relgeo`, `.yaml`,
  and `.yml` without reading or mutating the active document. Native picker and
  cross-consumer diagnostic promotion remain separate evidence.
- `EDIT-04` / `CONTRACT-01`: Flutter constraint violations now preserve the
  Core/Geometry metadata fields `severity`, `origin`, `expected`, and `actual`;
  the active constraint tolerance is aligned to `0.001`. The diagnostic unit
  test and current-pointer shared v0.5 fixture both pass without deriving
  fields from exception text.

The matrix status remains `🌗 partial` for these rows. Source and focused tests
changed, so this is implementation evidence rather than a documentation-only
status update. Native host evidence, full diagnostic vocabulary, and broader
cross-consumer promotion remain open. No generated, cache, release, or publish
artifact is part of the change.

## Consumer-boundary verification refresh — 2026-11-05

The selected source changes were checked against available downstream package
boundaries: Flutter focused Workbench tests passed `135`, Core passed `489`,
Geometry passed `91`, and the MCP contract package passed `42`. The complete
Flutter suite reached `326` passing tests and one existing HTTP MCP transport
failure at `test/mcp_server_io_test.dart:134`; this does not invalidate the
focused Workbench evidence and is retained as a separate boundary issue.

The remaining handoff is unchanged: `GAP-FW-001` through `GAP-FW-005` retain
source/host/contract next actions, while `GAP-FW-006` remains artifact
provenance and target-host evidence. No npm/pub.dev publication, production
deployment, signing, or unavailable-host action is treated as a prerequisite.

## Candidate goals/tasks

| ID | Priority | Candidate goal/task | Capability IDs | Scope | Owner | Dependency | Acceptance test / evidence target | Risk | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `GAP-FW-001` | `P0` | Complete document recovery and native file/import workflow | `DOC-08`, `IO-01`, `IO-02` | In-scope desktop authoring lifecycle, native picker boundary, and active RelGeo/YAML import; no archive/project import implied | `relgeo/flutter` + `relgeo/core` | Document serialization contract; platform runners; active import fixtures | Crash/forced-close restore returns the last safe document; autosave/session cleanup is covered; macOS/Linux/Windows open/save/save-as picker smoke passes; active valid/invalid YAML/RelGeo fixtures produce stable diagnostics | Data loss or misleading preview on unsupported input | DOC-08 dirty-draft restore is implemented locally; add forced-exit/relaunch and native picker smoke, then expand import diagnostics |
| `GAP-FW-002` | `P1` | Expand diagnostics and current DSL/SVG contract promotion | `EDIT-04`, `CONTRACT-01`, `CONTRACT-02`, `CONTRACT-03` | In-scope active DSL/semantic SVG boundary; raw SVG bytes and non-promoted evaluator/presentation parity remain excluded | `relgeo/flutter` + `relgeo/spec` + `relgeo/core` + `relgeo/renderer-svg` | Shared fixture governance; current checkout/CI; diagnostic model | Every promoted fixture has expected compile status, code, path, phase, and semantic SVG snapshot; Flutter/core/renderer conformance passes on the current pointer; presentation exclusions remain explicit | False parity claim or unrepairable authoring errors | Publish diagnostic code/path matrix and rerun cross-consumer conformance on current commits |
| `GAP-FW-003` | `P1` | Complete inspector and parameter/value parity | `CANVAS-03`, `CANVAS-04` | In-scope inspector and conditional parameter surfaces; does not promote the full evaluator/profile surface | `relgeo/flutter` + `relgeo/core` | Active document model; parameter/profile contract; selection model decision | Inspector field inventory maps expected model fields; editing a parameter updates compile/preview consistently; profile/default/derived-value fixtures pass in Flutter and core | Users see or edit values that do not match compiled output | Inventory missing inspector fields and choose the minimum active parameter fixture set |
| `GAP-FW-004` | `P0` | Harden user-facing graph and object selection/hit-testing | `CANVAS-05`, `VIEW-05` | In-scope user-facing dependency graph and object targeting; core graph ordering alone is not completion evidence | `relgeo/flutter` | Scene graph projection; viewport transform; inspector/command targeting | Graph panel renders dependencies for an active document; pointer and keyboard hit-testing select the same object; selection updates inspector/overlays and has semantics labels; no selection on empty canvas | Core graph/selection boundary is implemented locally; host pointer/keyboard/AT and richer relationship cases remain | Keep local graph/selection regressions; add keyboard, empty-canvas, physical pointer, and native semantics smoke |
| `GAP-FW-005` | `P1` | Close desktop keyboard, accessibility, and window lifecycle evidence | `CMD-03`, `A11Y-01`, `A11Y-02`, `WINDOW-01` | In-scope desktop keyboard/AT/lifecycle behavior; native host verification is required and cannot be inferred from widget tests | `relgeo/flutter` + native host runners | Shared command registry; native menu/window bridge; target desktop hosts | Per-OS shortcut matrix has no conflicts; keyboard traversal reaches and activates required controls; VoiceOver/screen-reader tree exposes role/label/state; close/quit dirty guard and clean exit pass on desktop | Keyboard-only, AT, or quit workflows fail despite Flutter unit tests passing | Turn the existing command/focus/window contracts into macOS/Linux/Windows smoke scripts |
| `GAP-FW-006` | `P1` | Verify target-host operation of the generated desktop releases | `PLAT-01`, `PLAT-02`, `PLAT-03`, `PLAT-04` | In-scope desktop artifact provenance and install/runtime evidence; signed distribution and store publishing remain out of scope | `relgeo/flutter` + `relgeo/workspace` + macOS/Linux/Windows hosts | Draft artifacts from release run `41184693233`; target OS hosts; native file/export smoke | Install and launch each current artifact; record OS/architecture, workflow run, checksum, launch result, native picker/export smoke, and MCP packaged-server smoke where available; retain current root baseline provenance | Build success is mistaken for a working end-user installation | Download and smoke-test draft v1.0.1 on target hosts, prioritizing Windows; record results before publishing |

## Coverage check

| Check | Result |
| --- | --- |
| Matrix `❌`/`🌗` capability rows | 17 |
| Backlog capability IDs covered | 17 active rows plus 2 retained implementation-tranche rows (`CANVAS-05`, `VIEW-05`) |
| Capability IDs missing from backlog | 0 |
| Backlog-only capability IDs | 0 |
| Candidate rows | 6 |
| Implementation claimed closed by this document | No; boundary status is recorded by the reconciled matrix, while remaining grouped work stays open |

## Non-feature hygiene follow-ups

These items are intentionally kept outside the capability backlog. They improve
test/provenance documentation but do not implement, promote, or close a
capability and must not change any matrix status.

| ID | Priority | Hygiene item | Evidence target | Capability effect |
| --- | --- | --- | --- |
| `HYGIENE-FW-001` | `P2` | Refresh `docs/integration-baseline.json` or run canonical CI for the current Flutter pointer | Baseline revision equals the claimed child checkout, or a named current CI run is attached | None; does not close `PLAT-*` by itself |
| `HYGIENE-FW-002` | `P2` | Declare the `golden` tag in `dart_test.yaml` or remove the tag | A future current-pointer test run has no undeclared-tag warning; historical 2026-10-30 run emitted this non-failing warning | None; test configuration hygiene only |
| `HYGIENE-FW-003` | `P2` | Keep historical and current evidence provenance separate | Future reports name exact workspace/Flutter pointers and environment | None; provenance clarity only |

`DOC-08` remains a `🌗` partial capability because forced-exit/native storage
evidence is open. `CANVAS-05` and `VIEW-05` are `✔️` at the Flutter boundary,
with host pointer/accessibility and richer contract follow-up still visible.
The backlog groups related work into candidate tasks for planning; grouping does
not erase remaining `🌗`, deferred, or environment-unavailable work.

## Evidence handoff and reproducibility

The historical local implementation/evidence snapshot was taken with workspace `HEAD`
`1cfa86553d7adb18179c6b3e1a33618a179b1414` and Flutter child `HEAD`
`b21eceb258070133f32fd822b6fd23a4f21b0bbf`. The current source/release pointer
is `60ec76042b369659e4d048b2a53ea3a66a384de3`; current CI and release evidence
are linked in the checkpoint above. The local commands listed below describe
the historical checkout only.

> The root documentation workspace has since advanced to `7d02e4c`; its current
> submodule checkout cleanliness is recorded in the cross-repository audit.
> Do not interpret the old dirty-worktree note below as current state.

From `flutter/`, the reproducible results are:

- `flutter analyze --no-pub`: pass, no issues.
- The focused recovery/graph/selection, file-service, invalid/reference
  fixture, shared v0.5 conformance, and SVG contract command: 54 tests passed.
- `flutter test --no-pub --reporter compact`: 307 tests passed, with only the
  existing undeclared `golden` tag warning.
- `flutter build web --no-pub`: not verified because the SDK could not write
  `engine.stamp`; this is an environment limitation, not a target defect.

No npm/pub.dev publication, production deployment, signed distribution, or
deferred platform host was required. Remaining work is handed off by candidate
goal: `GAP-FW-001` owns recovery/picker/import follow-up, `GAP-FW-002` owns
cross-consumer diagnostics/contract promotion, `GAP-FW-003` owns inspector and
parameter parity, `GAP-FW-004` owns graph/selection host and richer interaction
follow-up, `GAP-FW-005` owns native keyboard/accessibility/window smoke, and
`GAP-FW-006` owns current-pointer platform provenance. Their owners,
dependencies, acceptance targets, and next actions remain in the candidate
table above; none is silently treated as complete by this handoff.
