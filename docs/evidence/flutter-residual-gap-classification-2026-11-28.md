# Flutter Workbench residual gap classification

This is the readable classification report for the 17 residual IDs in the
canonical [disposition register](./rebaseline-disposition-register-2026-11-27.json).
It preserves the implementation/evidence observation and classifies the
closure work separately; `⏸️` is not a promotion to `✔️`.

## Current pointer and claim boundary

| Pointer | Revision | Meaning |
| --- | --- | --- |
| Workspace HEAD | `9d68569aabd1dfde17134d6df145333c5d93611f` | Current root revision used by the catalog and baseline manifest. |
| Flutter root gitlink | `52e5bd2385b019cc3b29e453b6e85ef697bdd62d` | Current root baseline pointer recorded in `docs/integration-baseline.json`. |
| Flutter child checkout | `6397c66aa931dc767e0ae505cd89a40cca433564` | Checked-out child; a descendant containing only the workflow MCP-provenance alignment commit. |
| Spec / MCP | `26ff53278d77d916b0e0e6c26ca9ab496232fbc0` / `ad3079bb9658ea44f58ae0a6872a042473e95626` | Current contract tuple. |

The child/root mismatch is recorded as `pending-root-gitlink-update` because
the Codex App Server managed sandbox could not create
`.git/index.lock` (`Operation not permitted`) when `git add flutter` was
attempted. The child commit is therefore current source/workflow evidence,
but is not promoted as the root baseline. This is an evidence-boundary fact,
not a source defect.

## Classification summary

| Closure type | IDs | Count | Interpretation |
| --- | --- | ---: | --- |
| Implementation boundary | `DOC-08`, `IO-01`, `CANVAS-03`, `CANVAS-04`, `CMD-03`, `A11Y-01`, `A11Y-02`, `WINDOW-01` | 8 | Bounded Flutter implementation exists, but the named host, exhaustive-field, or lifecycle evidence is incomplete. |
| Contract / consumer | `IO-02`, `EDIT-04`, `CONTRACT-01`, `CONTRACT-02`, `CONTRACT-03` | 5 | The bounded contract is present; current cross-consumer replay, promotion, or semantic consumer evidence remains unavailable or incomplete. |
| Evidence boundary | `PLAT-01`, `PLAT-02`, `PLAT-03`, `PLAT-04` | 4 | Platform artifact/runtime/provenance claims need target-host or synchronized-root evidence; historical archives are not promoted. |

## Residual gap register

| ID | Disposition / observed status | Type | Owner | Source of truth | Current evidence locator | Concrete closure deliverable | Claim limit |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `DOC-08` | `⏸️` / partial | implementation boundary | `relgeo/flutter` | baseline; MP; W02; D09 | `implementation-gap-map.md#31-document-file-dan-recovery`; `flutter/test/workbench_document_recovery_test.dart` | Run forced-exit/relaunch smoke; record stale/corrupt draft behavior and cleanup. | Local draft tests do not prove OS crash recovery, durability, consent, or relaunch behavior. |
| `IO-01` | `⏸️` / partial | implementation boundary | `relgeo/flutter` | baseline; W02; P10 | `implementation-gap-map.md#31-document-file-dan-recovery`; `flutter/test/workbench_file_service_test.dart` | Run macOS/Linux/Windows Open and Save As picker smoke, including cancel and permission failures. | Injected picker tests do not prove native dialog, permission, or packaged runtime behavior. |
| `IO-02` | `⏸️` / bounded-contract | contract / consumer | `relgeo/flutter + relgeo/core` | baseline; P06; DSL | `implementation-gap-map.md#31-document-file-dan-recovery`; `flutter/test/reference_fixtures_test.dart` | Lock supported filters and add valid/unsupported/malformed import diagnostics. | Bounded `.relgeo`/`.yaml`/`.yml` source path does not claim archive/project import or full cross-consumer parity. |
| `EDIT-04` | `⏸️` / implemented-at-bounded-boundary | contract / consumer | `relgeo/flutter + relgeo/spec + relgeo/core` | `fixtures/diagnostics/flutter-import-contract.json`; `workbench_import_diagnostics.dart`; MCP session bridge | `flutter-diagnostics-contract-parity-2026-11-27.json#/diagnosticContract`; `flutter/test/shared_diagnostic_contract_test.dart` | Re-run current-pointer cross-consumer diagnostics after dependencies are available. | Code-path mapping is proven; native presentation and full cross-consumer vocabulary are not claimed. |
| `CONTRACT-01` | `⏸️` / implemented-at-bounded-boundary | contract / consumer | `relgeo/spec + relgeo/flutter + relgeo/core` | `fixtures/manifest.json`; diagnostic fixture; MCP contract revision | `flutter-cross-surface-promotion-2026-11-27.json#/promotions`; diagnostic parity `#/fixtureConformance` | Re-run current-pointer spec/core/Flutter conformance at an available dependency/toolchain boundary. | Manifest, provenance, and bounded Flutter/MCP contract are synchronized; full DSL parity is not claimed. |
| `CONTRACT-02` | `⏸️` / implemented-at-bounded-boundary | contract / consumer | `relgeo/workspace + relgeo/spec + relgeo/flutter + relgeo/core` | `fixtures/manifest.json`; `check-flutter-diagnostics-contract.mjs` | promotion record `#/promotions`; checker `:48` | Run promoted fixture semantic conformance after package links are restored; preserve fixture 24 exclusion. | Only bounded fixtures 15/16 are promoted; evaluator/topology/collection completeness is not claimed. |
| `CONTRACT-03` | `⏸️` / implemented-at-bounded-boundary | contract / consumer | `relgeo/spec + relgeo/flutter + relgeo/renderer-svg` | fixture manifest SVG schema; Flutter semantic projection; renderer replay script | diagnostic parity `#/semanticSvg`; `flutter/test/shared_v05_conformance_test.dart`; `run-renderer-semantic-replay.mjs` | Restore workspace package links and rerun semantic replay on fixtures 10/15/16; retain raw-presentation exclusion. | Semantic geometry is the contract; raw bytes, style, viewBox, text, metadata, and overlay parity are excluded. |
| `CANVAS-03` | `⏸️` / bounded-implemented | implementation boundary | `relgeo/flutter + relgeo/core` | baseline; P06; P10; DSL | interaction evidence `#/surfaceDisposition/CANVAS-03`; `flutter/test/inspector_panel_test.dart` | Map every supported active object/geometry/constraint field to inspector tabs and fixtures; run native pointer/AT smoke when a host exists. | Current tabs/tests prove the bounded field/selection surface, not exhaustive property/constraint parity or native AT. |
| `CANVAS-04` | `⏸️` / bounded-implemented | implementation boundary | `relgeo/flutter + relgeo/core` | baseline; W02; DSL | interaction evidence `#/surfaceDisposition/CANVAS-04`; `flutter/test/workbench_document_settings_test.dart` | Cover conditional visibility, defaults, derived values, valid edits, rejection, and recompile consistency across consumers. | Parameter UI tests prove bounded Flutter editing/reset, not full evaluator/profile parity. |
| `CMD-03` | `⏸️` / bounded-implemented | implementation boundary | `relgeo/flutter` | baseline; W01; W02 | interaction evidence `#/surfaceDisposition/CMD-03`; context-menu and platform-menu tests | Publish the macOS/Linux/Windows shortcut matrix and run host smoke. | Flutter registry conflict detection and shortcut/menu parity pass; OS modifier mapping and native delivery are not claimed. |
| `A11Y-01` | `⏸️` / bounded-implemented | implementation boundary | `relgeo/flutter` | baseline; P10; W02 | interaction evidence `#/surfaceDisposition/A11Y-01`; keyboard and graph-panel tests | Run deterministic Tab/Enter/Space/arrow/Escape traversal on target hosts. | Flutter focus order and activation are covered; native traversal and AT behavior are not claimed. |
| `A11Y-02` | `⏸️` / bounded-implemented | implementation boundary | `relgeo/flutter` | baseline; P10; W01; W02 | interaction evidence `#/surfaceDisposition/A11Y-02`; viewport and feature-surface tests | Capture current macOS/Linux/Windows accessibility trees and announcements. | Flutter semantics labels/states are covered; VoiceOver/NVDA/AT-SPI/UIA announcements are not claimed. |
| `WINDOW-01` | `⏸️` / bounded-implemented | implementation boundary | `relgeo/flutter + native host runners` | baseline; W02; P10 | interaction evidence `#/surfaceDisposition/WINDOW-01`; window-host and method-channel tests | Run clean/dirty close/quit transcript for save/discard/cancel, callback ordering, and clean exit. | Method-channel/unit tests prove the adapter boundary only; OS window-manager delivery is not claimed. |
| `PLAT-01` | `⏸️` / partial | evidence boundary | `relgeo/flutter + relgeo/workspace` | baseline; P10; MAC; D09 | `implementation-gap-map.md#36-export-dan-platform-delivery`; `docs/integration-baseline.json` | Install/launch a current macOS artifact and record picker/export/MCP/clean-exit transcript with checksum. | Build/archive provenance cannot claim launch, usability, signing, notarization, or install success. |
| `PLAT-02` | `⏸️` / partial | evidence boundary | `relgeo/flutter + relgeo/workspace` | baseline; P10; D09 | `implementation-gap-map.md#36-export-dan-platform-delivery`; `docs/integration-baseline.json` | Extract/launch on the declared Wayland/X11 session and record runtime/picker/input/clean-exit provenance. | Build/archive provenance cannot claim Linux runtime, session, or install success. |
| `PLAT-03` | `⏸️` / partial | evidence boundary | `relgeo/flutter + relgeo/workspace` | baseline; P10; D09 | `implementation-gap-map.md#36-export-dan-platform-delivery`; `docs/integration-baseline.json` | Extract/launch on Windows 11 and record DLL/input/picker/MCP/clean-exit provenance. | Build/archive provenance cannot claim Windows runtime, SmartScreen, signing, or install success. |
| `PLAT-04` | `⏸️` / partial | evidence boundary | `relgeo/workspace` | baseline; MP; P10 | `implementation-gap-map.md#36-export-dan-platform-delivery`; `flutter-platform-provenance-2026-11-28.json`; `docs/integration-baseline.json` | Attach current workflow/artifact checksum, SDK/OS/architecture, and target-runtime results to the synchronized tuple; update the root gitlink when the index boundary permits. | The refreshed tuple and workflow provenance do not prove artifact build, launch, install, signing, or deployment. |

The canonical machine-readable rows remain authoritative. This report is a
classification/readability layer; it does not change the 61-ID catalog or
promote any held row.
