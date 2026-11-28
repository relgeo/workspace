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

## Current synchronized status — 2026-11-28

| Status | Count | Reconciliation meaning |
|---|---:|---|
| `✔️` | 44 | Implemented at the audited Flutter boundary with local evidence; native-host qualifiers remain in the row. |
| `⏸️` | 17 | Explicitly held at the current boundary: implementation/evidence or shared-contract work remains, with owner, remediation, revision, dependency, evidence locator, and claim limit in the disposition register. |
| `❌` | 0 | No expected user-facing capability is currently classified as absent at the audited boundary. |
| `➖` | 0 | No out-of-scope row is treated as active implementation in this matrix. |
| `⚠️` | 0 | No confirmed broken/mismatched capability. |

The current-head rebaseline keeps `DOC-08`, `IO-01`, `IO-02`, `EDIT-04`,
`CONTRACT-01..03`, `CANVAS-03..04`, `CMD-03`, `A11Y-01..02`, `WINDOW-01`, and
`PLAT-01..04` as explicit `⏸️` dispositions. The diagnostic/contract subset
has bounded implementation evidence, while its deferred cross-consumer or
host boundaries remain explicit rather than being promoted. This closes the
stale `🌗` rows as tracked decisions, not as unproven implementation claims. The canonical
machine-readable join is [`rebaseline-disposition-register-2026-11-27.json`](../../evidence/rebaseline-disposition-register-2026-11-27.json); the readable residual classification is [`flutter-residual-gap-classification-2026-11-28.md`](../../evidence/flutter-residual-gap-classification-2026-11-28.md).

Current root/submodule provenance and the active Flutter contract snapshot are
recorded in that register and [`docs/integration-baseline.json`](../../integration-baseline.json).
This does not claim native desktop, assistive-technology, physical-pointer,
packaged-runtime, signing, or deployment verification.

Related evidence:

- [Implementation audit](./implementation-audit.md)
- [Implementation gap backlog](./implementation-gap-backlog.md)
- [Status matrix](./status-matrix.md)
- [Reconciliation](./reconciliation.md)
- [Bounded in-scope selection](./in-scope-selection.md)

The current P0/P1 triage is maintained in the [canonical implementation-gap
backlog](./implementation-gap-backlog.md#p0p1-triage-disposition--2026-11-04).
It does not alter this expected catalog: source/contract work, external host
evidence, and deferred/not-applicable scope are recorded as separate
dispositions.

For this task, the selected IDs are joined against the baseline catalog and
the current audited status symbols in the reconciliation. `✔️` rows are not
active debt; `➖` and `⏸️` rows are explicit scope/environment/contract
dispositions and are not untracked implementation work.

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
