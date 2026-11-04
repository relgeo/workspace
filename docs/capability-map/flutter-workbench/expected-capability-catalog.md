# Flutter Workbench — Expected Capability Catalog

This path is the capability-map entry point required by the Flutter Workbench
audit. The complete, requirement-first catalog is maintained at
[`docs/plans/12-flutter-workbench-capability-baseline.md`](../../plans/12-flutter-workbench-capability-baseline.md).

The baseline is the single source of truth for the 61 expected capability IDs,
their user outcomes, owners, source-of-truth documents, and scope decisions.
This entry point intentionally does not duplicate the catalog rows. Current
implementation status is synchronized in the audit/reconciliation artifacts
below and is summarized here so the expected catalog cannot be mistaken for a
completion claim.

## Current synchronized status — 2026-11-03

| Status | Count | Reconciliation meaning |
|---|---:|---|
| `✔️` | 44 | Implemented at the audited Flutter boundary with local evidence; native-host qualifiers remain in the row. |
| `🌗` | 17 | Partial implementation, contract coverage, or environment-dependent evidence remains. |
| `❌` | 0 | No expected user-facing capability is currently classified as absent at the audited boundary. |
| `➖` | 0 | No out-of-scope row is treated as active implementation in this matrix. |
| `⏸️` | 0 | No held/deferred row is treated as active implementation in this matrix. |
| `⚠️` | 0 | No confirmed broken/mismatched capability. |

The three recently implemented boundaries are `DOC-08` (now `🌗` because
forced-exit/native storage evidence remains open), `CANVAS-05` (`✔️` at the
Flutter boundary), and `VIEW-05` (`✔️` at the Flutter boundary). This does not
claim native desktop, assistive-technology, or physical-pointer verification.
The canonical baseline and all unresolved/deferred scope rows remain intact.

Related evidence:

- [Implementation audit](./implementation-audit.md)
- [Implementation gap backlog](./implementation-gap-backlog.md)
- [Status matrix](./status-matrix.md)
- [Reconciliation](./reconciliation.md)
- [Bounded in-scope selection](./in-scope-selection.md)

For this task, the selected IDs are joined against the baseline catalog and
the current audited status symbols in the reconciliation. `✔️` rows are not
active debt; `➖` and `⏸️` rows are scope decisions and are not implementation
work.

## Frozen desktop authoring boundary

The implementation-gap backlog contains the frozen behavior contract for
`GAP-FW-001` through `GAP-FW-006`. It defines the observable semantics for
New/Open/Save/Save As, dirty-state guarding, best-effort autosave/recovery,
native picker delegation, bounded active-import diagnostics,
selection/inspector ownership, keyboard/accessibility/window lifecycle, and
artifact provenance. The expected catalog remains normative for capability
identity; freezing the contract does not promote any `🌗` row to `✔️` by
itself.

The boundary rule is: Flutter source and widget/unit tests can verify the
host-neutral contract, while native picker, forced relaunch, OS shortcut,
assistive technology, window-manager, Ubuntu/Windows runtime, signing, and
distribution claims require their own host evidence. Unavailable hosts are
reported as `not verified`, never as an inferred pass or a target defect.
