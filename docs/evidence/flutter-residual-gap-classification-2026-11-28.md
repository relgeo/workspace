# Flutter Workbench residual gap classification

This is the readable classification report for the 17 residual IDs in the
canonical [disposition register](./rebaseline-disposition-register-2026-11-27.json).
It preserves the historical implementation/evidence observation and classifies
the current closure boundary separately; `⏸️` is not a promotion to `✔️`.
At the current synchronized tuple, all 17 rows have source/contract evidence;
their remaining work is external verification only. No row has an actionable
implementation or contract/consumer change remaining.

## Current pointer and claim boundary

| Pointer | Revision | Meaning |
| --- | --- | --- |
| Workspace HEAD | `492c19a875196140fd4a5f86e760153706704e9c` | Current root revision used by the catalog and baseline manifest. |
| Flutter root gitlink | `c93b0432e12f5ae11d34212d4da467aceaf8ca34` | Current root baseline pointer recorded in `docs/integration-baseline.json`. |
| Flutter child checkout | `c93b0432e12f5ae11d34212d4da467aceaf8ca34` | Checked-out child; equal to the committed root gitlink. |
| Spec / MCP | `26ff53278d77d916b0e0e6c26ca9ab496232fbc0` / `ad3079bb9658ea44f58ae0a6872a042473e95626` | Current contract tuple. |

The child/root tuple is synchronized at the current root commit. Target-host,
native-runtime, and dependency/toolchain checks remain separate evidence
boundaries; they are not implementation or contract backlog items.

## Classification summary

| Historical gap class | IDs | Count | Current closure classification |
| --- | --- | ---: | --- |
| Implementation boundary | `DOC-08`, `IO-01`, `CANVAS-03`, `CANVAS-04`, `CMD-03`, `A11Y-01`, `A11Y-02`, `WINDOW-01` | 8 | External-evidence-only hold: bounded source implementation is present; only host/AT/lifecycle verification is unavailable. |
| Contract / consumer | `IO-02`, `EDIT-04`, `CONTRACT-01`, `CONTRACT-02`, `CONTRACT-03` | 5 | External-evidence-only hold: bounded contract/consumer mapping is present; only dependency/toolchain replay is unavailable. |
| Evidence boundary | `PLAT-01`, `PLAT-02`, `PLAT-03`, `PLAT-04` | 4 | External-evidence-only hold: target host/artifact/runtime evidence is unavailable; no source change is pending. |

**Actionability decision:** `actionableImplementationGap=0`,
`actionableContractConsumerGap=0`, and `externalEvidenceOnlyHolds=17`.
The deliverables below are verification runs owned by unavailable hosts,
toolchains, or providers; they are not requests for additional source,
contract, or consumer implementation.

## Residual gap register

| ID | Disposition / observed status | Historical gap class | Owner | Source of truth | Current evidence locator | External verification deliverable (no source change) | Claim limit |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `DOC-08` | `⏸️` / partial | implementation boundary | `relgeo/flutter` | baseline; MP; W02; D09 | `implementation-gap-map.md#31-document-file-dan-recovery`; `flutter/test/workbench_document_recovery_test.dart` | Run forced-exit/relaunch smoke; record stale/corrupt draft behavior and cleanup. | Local draft tests do not prove OS crash recovery, durability, consent, or relaunch behavior. |
| `IO-01` | `⏸️` / partial | implementation boundary | `relgeo/flutter` | baseline; W02; P10 | `implementation-gap-map.md#31-document-file-dan-recovery`; `flutter/test/workbench_file_service_test.dart` | Run macOS/Linux/Windows Open and Save As picker smoke, including cancel and permission failures. | Injected picker tests do not prove native dialog, permission, or packaged runtime behavior. |
| `IO-02` | `⏸️` / bounded-contract | contract / consumer | `relgeo/flutter + relgeo/core` | baseline; P06; DSL | `implementation-gap-map.md#31-document-file-dan-recovery`; `flutter/test/reference_fixtures_test.dart` | Lock supported filters and add valid/unsupported/malformed import diagnostics. | Bounded `.relgeo`/`.yaml`/`.yml` source path does not claim archive/project import or full cross-consumer parity. |
| `EDIT-04` | `⏸️` / implemented-at-bounded-boundary | contract / consumer | `relgeo/flutter + relgeo/spec + relgeo/core` | `fixtures/diagnostics/flutter-import-contract.json`; `workbench_import_diagnostics.dart`; MCP session bridge | `flutter-diagnostics-contract-parity-2026-11-27.json#/diagnosticContract`; `flutter/test/shared_diagnostic_contract_test.dart` | Re-run current-pointer cross-consumer diagnostics after dependencies are available. | Code-path mapping is proven; native presentation and full cross-consumer vocabulary are not claimed. |
| `CONTRACT-01` | `⏸️` / implemented-at-bounded-boundary | contract / consumer | `relgeo/spec + relgeo/flutter + relgeo/core` | `fixtures/manifest.json`; diagnostic fixture; MCP contract revision | `flutter-cross-surface-promotion-2026-11-27.json#/promotions`; diagnostic parity `#/fixtureConformance` | Re-run current-pointer spec/core/Flutter conformance at an available dependency/toolchain boundary. | Manifest, provenance, and bounded Flutter/MCP contract are synchronized; full DSL parity is not claimed. |
| `CONTRACT-02` | `⏸️` / implemented-at-bounded-boundary | contract / consumer | `relgeo/workspace + relgeo/spec + relgeo/flutter + relgeo/core` | `fixtures/manifest.json`; `check-flutter-diagnostics-contract.mjs` | promotion record `#/promotions`; checker `:48` | Run promoted fixture semantic conformance after package links are restored; preserve fixture 24 exclusion. | Only bounded fixtures 15/16 are promoted; evaluator/topology/collection completeness is not claimed. |
| `CONTRACT-03` | `⏸️` / implemented-at-bounded-boundary | contract / consumer | `relgeo/spec + relgeo/flutter + relgeo/renderer-svg` | fixture manifest SVG schema; Flutter semantic projection; renderer replay script | diagnostic parity `#/semanticSvg`; `flutter/test/shared_v05_conformance_test.dart`; `run-renderer-semantic-replay.mjs` | Restore workspace package links and rerun semantic replay on fixtures 10/15/16; retain raw-presentation exclusion. | Semantic geometry is the contract; raw bytes, style, viewBox, text, metadata, and overlay parity are excluded. |
| `CANVAS-03` | `⏸️` / bounded-implemented | implementation boundary | `relgeo/flutter + relgeo/core` | baseline; P06; P10; DSL | interaction evidence `#/surfaceDisposition/CANVAS-03`; `flutter/test/inspector_panel_test.dart`; `flutter/test/workbench_scene_graph_panel_test.dart` | Run native pointer/AT smoke against the already recorded inspector/selection field inventory when a target host exists; no source mapping remains pending. | Current tabs, field fixtures, and selection tests prove the bounded field surface; exhaustive property/constraint parity and native AT remain unverified. |
| `CANVAS-04` | `⏸️` / bounded-implemented | implementation boundary | `relgeo/flutter + relgeo/core` | baseline; W02; DSL | interaction evidence `#/surfaceDisposition/CANVAS-04`; `flutter/test/workbench_document_settings_test.dart`; `flutter/test/workbench_feature_surface_test.dart` | Run the existing bounded parameter/profile fixtures at a current dependency/toolchain boundary and record the result; no new editor implementation or cross-consumer case is pending. | Conditional visibility, defaults, derived values, rejection, and recompile behavior are covered at the Flutter boundary; full evaluator/profile parity remains unverified. |
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
promote any held row. Its historical gap-class labels must not be read as a
current actionable queue: all 17 held rows are explicitly external-evidence
holds at the current tuple.
