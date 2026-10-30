# Playground bounded in-scope selection

**Date:** 2026-10-30  
**Task:** `bound-playground-scope-and-accepted-contracts--0832112674`  
**Status:** bounded active selection; this record is not implementation or
completion evidence  
**Owner boundary:** `relgeo/playground` owns the browser IDE workflow,
presentation, persistence interaction, and web accessibility surface. `spec/`,
core, language-service, and renderer packages remain semantic owners where the
selected contract crosses those boundaries.

## Decision

This tranche selects six actionable Playground capability gaps from the
expected catalog, implementation audit/reconciliation, status matrix, and
implementation-gap backlog. It is bounded to local/browser authoring work:
explicit startup state, theme preference, camera-only viewport reset, keyboard
commands, and web accessibility/tolerance evidence.

The selection has no deployment, Pages, package-publication, or release
prerequisite. `PG-DELIVERY-001` remains a separate hosted-artifact
verification follow-up and is not active implementation in this tranche. The
selection preserves the audited status symbols; no row is promoted to `✔️` by
this document.

## Evidence and selection inputs

| Input | Role in this selection |
| --- | --- |
| [Expected capability catalog](./expected-capability-catalog.md) | Defines stable capability IDs, expected user outcomes, owners, and scope boundaries. |
| [Implementation audit](./implementation-audit.md) and [archived evidence log](./archive/implementation-audit-legacy.md) | Records observed implementation paths, partial/absent findings, and evidence limits. |
| [Reconciliation](./reconciliation.md) and [status matrix](./status-matrix.md) | Supplies the current honest status symbol and separates implementation from evidence availability. |
| [Implementation-gap backlog](./implementation-gap-backlog.md) | Supplies the candidate task IDs, owners, dependencies, and acceptance targets. |
| [`playground/`](../../../playground/) | Source, focused tests, UX contract audit, and browser E2E boundary for the selected work. |

## Bounded active selection

Each row maps one backlog candidate to one expected capability. The source of
truth includes the expected row, the observed audit/reconciliation record, and
the backlog candidate. Dependencies are sequencing constraints, not additional
scope.

| Selected task / expected ID | Current status | Owner | Source of truth | Observed implementation / test paths | Contract boundary | Explicit acceptance behavior |
| --- | --- | --- | --- | --- | --- | --- |
| `PG-TASK-001` — theme preference (`PG-THEME-001`) | `❌` | `relgeo/playground` UI/product owner | [Catalog `PG-THEME-001`](./expected-capability-catalog.md); [reconciliation row](./reconciliation.md); [backlog row](./implementation-gap-backlog.md) | [`playground/src/styles/tokens.css`](../../../playground/src/styles/tokens.css); [`playground/src/index.css`](../../../playground/src/index.css); [`playground/src/App.tsx`](../../../playground/src/App.tsx); [`playground/src/__tests__/`](../../../playground/src/__tests__/) | Playground owns the user-visible mode control, token application, and browser-local preference. The accepted contract is initial `system` following browser/OS `prefers-color-scheme`, with explicit `light`/`dark` overrides and browser-local persistence where available; DSL/render semantics do not change. | A keyboard-reachable theme control applies the accepted system/light/dark contract to editor, canvas, controls, diagnostics, focus, and status; the preference survives reload where storage is available; contrast/focus checks and unit/browser tests pass. |
| `PG-TASK-002` — explicit startup/loading state (`PG-LIFE-002`) | `🌗` | `relgeo/playground` lifecycle owner | [Catalog `PG-LIFE-002`](./expected-capability-catalog.md); [reconciliation row](./reconciliation.md); [backlog row](./implementation-gap-backlog.md) | [`playground/src/App.tsx`](../../../playground/src/App.tsx); [`playground/src/playground-status.ts`](../../../playground/src/playground-status.ts); [`playground/src/indexeddb-persistence.ts`](../../../playground/src/indexeddb-persistence.ts); [`playground/e2e/playground.spec.ts`](../../../playground/e2e/playground.spec.ts) | Playground owns visible bootstrap phases and interaction gating. IndexedDB, shared-hash parsing, examples, and worker resolve remain inputs; loading must not be represented as an unexplained empty workspace. | First load visibly distinguishes bootstrap, restore, resolving, ready, and failure; delayed persistence/example fixtures prove the status and gating transitions; browser smoke records the transitions without losing source or focus. |
| `PG-TASK-003` — camera-only reset viewport (`PG-CANVAS-005`) | `🌗` | `relgeo/playground` Preview/App owner | [Catalog `PG-CANVAS-005`](./expected-capability-catalog.md); [reconciliation row](./reconciliation.md); [backlog row](./implementation-gap-backlog.md) | [`playground/src/App.tsx`](../../../playground/src/App.tsx); [`playground/src/components/Preview.tsx`](../../../playground/src/components/Preview.tsx); [`playground/src/view-state.ts`](../../../playground/src/view-state.ts); [`playground/src/preview-toolbar.ts`](../../../playground/src/preview-toolbar.ts); [`playground/src/__tests__/preview-toolbar.test.ts`](../../../playground/src/__tests__/preview-toolbar.test.ts) | The command changes screen camera state only. It must remain separate from source reset, file identity, dirty state, selection policy, and persistence; resolved geometry remains delegated to core/renderer. | A dedicated Reset viewport action restores deterministic zoom/pan/fit without changing source, active file, dirty state, selection, or persisted content; focused unit and browser tests prove the separation. |
| `PG-TASK-004` — keyboard command map (`PG-KEY-001`) | `🌗` | `relgeo/playground` UI/accessibility owner | [Catalog `PG-KEY-001`](./expected-capability-catalog.md); [reconciliation row](./reconciliation.md); [backlog row](./implementation-gap-backlog.md) | [`playground/src/App.tsx`](../../../playground/src/App.tsx); [`playground/src/components/Navbar.tsx`](../../../playground/src/components/Navbar.tsx); [`playground/src/components/FileWorkspacePicker.tsx`](../../../playground/src/components/FileWorkspacePicker.tsx); [`playground/src/components/Editor.tsx`](../../../playground/src/components/Editor.tsx); [`playground/src/components/ConfirmDialog.tsx`](../../../playground/src/components/ConfirmDialog.tsx); [`playground/e2e/playground.spec.ts`](../../../playground/e2e/playground.spec.ts) | Playground owns command naming, dispatcher, focus rules, and browser-reserved-key conflict handling. Native editor editing keys and delegated DSL semantics are not replaced. | Document and implement keyboard access for new/open/save/save-as/import/export, surface switch, fit/reset viewport, diagnostics, drawer/panel, and confirmation; E2E covers editable-field safety, focus return, conflicts, and status announcements. |
| `PG-TASK-005` — web accessibility semantics (`PG-A11Y-001`) | `🌗` | `relgeo/playground` UI/accessibility owner | [Catalog `PG-A11Y-001`](./expected-capability-catalog.md); [reconciliation row](./reconciliation.md); [backlog row](./implementation-gap-backlog.md) | [`playground/scripts/audit-ux-contract.mjs`](../../../playground/scripts/audit-ux-contract.mjs); [`playground/src/App.tsx`](../../../playground/src/App.tsx); [`playground/src/components/Navbar.tsx`](../../../playground/src/components/Navbar.tsx); [`playground/src/components/Inspector.tsx`](../../../playground/src/components/Inspector.tsx); [`playground/src/components/Sidebar.tsx`](../../../playground/src/components/Sidebar.tsx); [`playground/src/components/Editor.tsx`](../../../playground/src/components/Editor.tsx) | Playground owns DOM/ARIA semantics, focus-visible behavior, focus trap/return, live announcements, and source/preview navigation. Native VoiceOver/TalkBack/device evidence remains a separately labeled follow-up and is not inferred here. | Supported-browser AX/DOM checks and manual keyboard traversal cover landmarks, names, roles, selected/expanded/pressed/value states, focus return/traps, error announcements, and source/preview navigation; native AT evidence is recorded separately. |
| `PG-TASK-006` — preference and input tolerance evidence (`PG-A11Y-002`) | `🌗` | `relgeo/playground` UI/accessibility owner | [Catalog `PG-A11Y-002`](./expected-capability-catalog.md); [reconciliation row](./reconciliation.md); [backlog row](./implementation-gap-backlog.md) | [`playground/src/styles/tokens.css`](../../../playground/src/styles/tokens.css); [`playground/src/index.css`](../../../playground/src/index.css); [`playground/src/preview-toolbar.ts`](../../../playground/src/preview-toolbar.ts); [`playground/scripts/audit-ux-contract.mjs`](../../../playground/scripts/audit-ux-contract.mjs); [`playground/e2e/mobile-playground.spec.ts`](../../../playground/e2e/mobile-playground.spec.ts) | Playground owns web contrast/focus/target-size, reduced-motion, and non-gesture alternatives at supported breakpoints. Physical handset/touch validation remains evidence-deferred under the catalog scope decision. | Contrast/focus, minimum target-size, reduced-motion, and non-gesture action checks pass at supported browser breakpoints; browser tests prove key actions do not require a gesture; physical/device results are labeled deferred or verified rather than inferred. |

## Sequencing and dependency boundary

1. `PG-TASK-002` can proceed independently and establishes the bootstrap
   state contract.
2. Implement `PG-TASK-001` against the accepted system/light/dark theme
   contract recorded in the catalog; no separate decision task is needed.
3. Define and implement `PG-TASK-003`; its camera-only command is a prerequisite
   for the viewport binding in `PG-TASK-004`.
4. Complete `PG-TASK-004`, then use its command/focus map for `PG-TASK-005`.
5. Run `PG-TASK-006` after the theme token contract is available; its device
   evidence remains separately classified.

These dependencies do not include Pages, deployment, npm publication, or
canonical-runtime evidence. A missing browser/device environment limits only
the evidence target that requires it.

## Deliberately excluded from active implementation

| Excluded item | Status | Reason |
| --- | --- | --- |
| `PG-TASK-007` / `PG-DELIVERY-001` | `🌗` | Hosted `/playground/` artifact parity and public smoke are release/delivery verification; they are explicitly outside this no-release-dependency tranche. |
| `PG-FILE-001`–`PG-FILE-007`, `PG-PERSIST-001`–`PG-PERSIST-003`, `PG-DIAG-001`–`PG-DIAG-002`, and other `✔️` rows | `✔️` | The audit records these capabilities implemented locally. They are not active debt merely because browser/public evidence may need a later rerun. |
| Any `➖` capability | `➖` | Deliberately outside the Playground responsibility or acceptance target; no boundary work is converted into implementation debt. |
| Any `⏸️` capability or held decision | `⏸️` | Deferred/held scope remains deferred; no implementation task is inferred. |

No `➖` or `⏸️` item is treated as active implementation work.

## Status accounting

| Check | Result |
| --- | ---: |
| Selected backlog tasks | 6 |
| Selected capability IDs | 6 |
| Selected `🌗` rows | 5 (`PG-LIFE-002`, `PG-CANVAS-005`, `PG-KEY-001`, `PG-A11Y-001`, `PG-A11Y-002`) |
| Selected `❌` rows | 1 (`PG-THEME-001`) |
| Selected `⚠️` rows | 0 |
| Selected `➖` or `⏸️` rows | 0 |
| Selected IDs with owner, source path, boundary, and acceptance behavior | 6/6 |

Changing this record or the backlog is not implementation evidence. Each
selected row requires focused source/test evidence and a fresh audit,
reconciliation, and status-matrix review before its symbol changes.
