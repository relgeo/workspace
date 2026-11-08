# Playground implementation-gap backlog

**Tanggal:** 2026-11-07

**Status:** candidate goal/task register; no row here counts as implementation

**Source:** [Playground capability matrix](./capability-matrix.md),
[expected-versus-observed reconciliation](./reconciliation.md)

**Current row-level closure join:** [closure register](./closure-register.md)
is authoritative for the 37 stable catalog IDs, source/evidence boundaries,
and explicit closure dispositions. This backlog remains the candidate-task
history and does not replace that register.

**Selected scope:** [bounded in-scope selection](./in-scope-selection.md)
records the active local/browser tranche. Rows not listed there remain
candidate or verification work and are not active implementation scope.

**Evidence boundary:** `playground/`, `docs/REPOSITORY-MAP.md`,
`docs/MATURATION-MASTER-PLAN.md`, and `docs/capability-map/`. The candidate
rows below are derived from the expected catalog and reconciliation; source,
tests, and runtime evidence remain the acceptance boundary for closing them.

This backlog records the historical candidate tasks for every Playground
capability that previously carried `🌗` or `❌`. The final closure boundary has
no `🌗`, `❌`, or `⚠️` row: `PG-LIFE-002` is locally closed, while
`PG-A11Y-001` and `PG-DELIVERY-001` are explicit `⏸️` host/deployment holds.
`➖` and evidence-only follow-ups are not hidden as implementation work.
Updating this document or the matrix never substitutes for source/test
evidence; the disposition changes here only to mirror the audited boundary.

## Rebaseline checkpoint — 2026-11-07

The fresh audit closes `PG-LIFE-002` at the local implementation boundary;
its delayed bootstrap browser trace is an evidence follow-up. `PG-A11Y-001`
is an explicit `⏸️` host-evidence hold for browser traversal and separately
labeled native AT evidence. `PG-DELIVERY-001` is an explicit hosted-only
`⏸️` hold; its local artifact/provenance boundary is closed. The current local Playground
checkout is `efb7396…`; `pnpm test` (119 tests), `pnpm build`, `pnpm lint`, and
`pnpm audit:ux` pass, while targeted browser execution is environment-limited
by preview-server `EPERM`. No new capability ID is introduced.

## Rules and coverage

- A candidate is not an active SuClos goal until owner, scope, dependency, and
  acceptance evidence are approved.
- Each candidate maps to exactly one expected capability ID.
- `PG-DELIVERY-001` is a verification/delivery-closure task because its
  remaining gap is hosted artifact parity; it still remains a separate task and
  does not claim the local build is the public build.
- `❌` remains absent and `🌗` remains partial until implementation or evidence
  actually changes. Documentation is not implementation evidence.
- A blocked environment affects only the evidence target that needs it; it does
  not erase independent implementation work.

## Active task scope freeze

The active SuClos tranche binds exactly three closure boundaries. This is a
scope and evidence contract; it closes only the local implementation boundary
where evidence exists and never promotes a local result to hosted parity.

| ID | Bound outcome | Required evidence before closure | Explicit non-goal |
| --- | --- | --- | --- |
| `PG-LIFE-002` | Startup distinguishes `loading`, `empty`, `ready`, and `error`; editor, file actions, preview controls, and command shortcuts are gated while bootstrap is `loading`. | Source state model and 119 unit tests close the local implementation; delayed browser trace is recorded as not verified because the preview server cannot bind. | Do not reinterpret resolver `resolving` or storage failure as `empty`; do not change the accepted theme contract. |
| `PG-A11Y-001` | Browser DOM/ARIA semantics expose landmarks, names, roles, selected/expanded/pressed/value states, announcements, focus return/traps, and source/preview navigation. | `playground/scripts/audit-ux-contract.mjs`; DOM/keyboard browser run; focused source/tests; native VoiceOver/TalkBack remains separately labeled as deferred or unverified. | Native AT/device evidence is not silently claimed by static source checks. |
| `PG-DELIVERY-001` | Hosted `/playground/` is traceable to the tested child revision and assembled artifact. | Child revision, clean build output, base route/title/asset manifest comparison, hosted smoke/share run, and explicit environment/host limitation record. | A local Vite build is not public parity; Pages/network unavailability is `environment-limited`, not an implementation failure. |

The existing `system`/`light`/`dark` theme contract is preserved as accepted
task data: initial `system` follows `prefers-color-scheme`, explicit overrides
remain supported, and no new theme decision is opened here.

## Previous evidence checkpoint — 2026-11-04

This section is a superseded historical snapshot retained for auditability; the
2026-11-07 rebaseline above and the final closure report are authoritative for
the current boundary.

| Bound row | Current evidence | Remaining boundary |
| --- | --- | --- |
| `PG-LIFE-002` | Explicit `loading`/`empty`/`ready`/`error` phases, bootstrap gate, storage-error status, 119 unit tests, successful build, and a delayed-startup E2E case | Local implementation is closed; browser execution is unavailable because Playwright preview binding returns `EPERM`; no browser state is claimed. |
| `PG-A11Y-001` | Static UX audit passes; source includes landmarks, semantic states, announcements, focus return/traps, and source/preview navigation; DOM/keyboard E2E cases are discovered | Browser AX/traversal execution and native VoiceOver/TalkBack remain unverified/deferred. |
| `PG-DELIVERY-001` | Local build and assembled website are available; title/base-route and asset comparison were attempted, but the full child-revision/provenance gate does not pass because the checkout differs from the baseline/Pages pin | Public hosted smoke/parity is unavailable; baseline and Pages pin drift (`47fd715…` vs `c7cec4b…`) remains explicitly reported and is not rewritten. |

The available workspace is Node `22.23.2` while the canonical project contract is
Node `>=24`; build/test results are therefore local evidence, not canonical
toolchain parity.

### Previous implementation evidence checkpoint — 2026-11-04

The local implementation tranche made source/test changes without changing the
DSL or package compatibility line:

| ID | Concrete implementation change | Local evidence | Remaining boundary |
| --- | --- | --- | --- |
| `PG-LIFE-002` | Worker responses retain backward-compatible readiness/recovery fields; bootstrap phases and gating remain explicit. | `src/worker.ts`, `src/worker-lifecycle.ts`, `src/types.ts`, `src/__tests__/worker.test.ts`, `src/__tests__/worker-lifecycle.test.ts`, `src/__tests__/playground-status.test.ts`; `pnpm test` | Delayed browser bootstrap trace remains environment-limited. |
| `PG-CANVAS-005` | Viewport reset no longer triggers fit-to-content after setting the deterministic camera baseline. | `src/App.tsx`, `src/__tests__/view-state.test.ts`, `e2e/playground.spec.ts`; `pnpm test`, `pnpm build` | Browser preservation proof remains not verified. |
| `PG-KEY-001` | Command dispatch ignores IME composition and AltGraph text-entry chords. | `src/keyboard-commands.ts`, `src/App.tsx`, `src/__tests__/keyboard-commands.test.ts`; `pnpm test` | Browser focus/reserved-key proof remains not verified. |
| `PG-A11Y-001` | Status announcements are atomic and the UX audit now guards that contract. | `src/components/Navbar.tsx`, `scripts/audit-ux-contract.mjs`; `pnpm audit:ux` | DOM traversal and native AT evidence remain unverified/deferred. |
| `PG-A11Y-002` | Existing reduced-motion, forced-colors, target-size, and non-gesture source contract remains covered by the static audit. | `src/index.css`, `src/styles/tokens.css`, `scripts/audit-ux-contract.mjs`; `pnpm audit:ux` | Physical handset/touch evidence remains deferred-device. |
| `PG-THEME-001` | Existing system/light/dark fallback and storage-safe behavior remains regression-tested; no public contract changed. | `src/theme.ts`, `src/__tests__/theme.test.ts`, `e2e/playground.spec.ts`; `pnpm test`, `pnpm build` | Browser preference/reload proof remains not verified. |

`PG-DELIVERY-001` remains evidence-only: local build and artifact checks do not
claim hosted parity. Generated `dist/` output and provenance files are ignored
and are not part of the tracked implementation change.

The targeted browser command
`pnpm exec playwright test playground.spec.ts -g "exposes the keyboard command
surface and camera-only viewport reset"` was attempted after the reset change;
the preview server could not bind `127.0.0.1:4173` (`EPERM`). This is recorded as
environment-limited browser evidence, not as a failed target implementation.

### Baseline gap coverage before triage

| Check | Result |
| --- | --- |
| Expected gap rows | 0 open implementation gaps; 2 explicit host/deployment holds |
| Candidate tasks | 3 |
| `🌗` candidates | 0 |
| `❌` candidates | 0 |
| Missing source IDs | 0 |
| Duplicate source IDs | 0 |
| Implementation versus verification tasks distinguished | Yes |

## P0/P1 triage — 2026-11-04

This triage reviews all seven requested P0/P1 Playground rows. “Implementation-
closable” means that the Playground owner can change or regression-test the
bounded source/browser contract from this checkout without waiting for an
npm/pub.dev release, production deployment, unavailable host OS, or a new
scope decision. It does not mean the row is complete or externally verified.

There are **six implementation-closable rows**, **one external-evidence-only
row**, and **no whole-row scope-deferred item**. Accessibility device/native
checks and physical handset checks remain scope/evidence sub-boundaries, not
reasons to remove their supported-web rows from the implementation queue.

| ID | Priority | Triage disposition | Owner | Source of truth | Acceptance test / evidence target | Initial status | External or scope-deferred boundary kept separate |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `PG-LIFE-002` | P1 | **Closed locally; browser evidence follow-up** | `relgeo/playground` lifecycle owner | `playground/src/App.tsx`; `playground/src/playground-status.ts`; `playground/src/indexeddb-persistence.ts`; `playground/e2e/playground.spec.ts` | `pnpm test` covers `loading`, `empty`, `ready`, `error`, and gating; delayed-startup browser case remains not verified because the runner cannot bind | `✔️` / local implementation closed | Playwright bind failure is environment-limited; resolver `resolving` and storage failure remain distinct |
| `PG-CANVAS-005` | P1 | **Implementation-closable; queue** | `relgeo/playground` Preview/App owner | `playground/src/App.tsx`; `playground/src/components/Preview.tsx`; `playground/src/view-state.ts`; `playground/src/preview-toolbar.ts`; `playground/src/__tests__/view-state.test.ts`; `playground/e2e/playground.spec.ts` | Unit contract plus reset browser case prove reset changes camera state only and preserves source, file identity, dirty state, selection, and persisted content | `✔️` / implemented + `partial-local` | Browser preservation proof is evidence follow-up; no model/source mutation is implied |
| `PG-KEY-001` | P1 | **Implementation-closable; queue** | `relgeo/playground` UI/accessibility owner | `playground/src/App.tsx`; `playground/src/components/Navbar.tsx`; `playground/src/components/FileWorkspacePicker.tsx`; `playground/src/components/Editor.tsx`; `playground/src/__tests__/keyboard-commands.test.ts`; `playground/e2e/playground.spec.ts` | Command-map unit tests and browser traversal cover file, surface, viewport, diagnostics, drawer/panel, and confirmation actions without hijacking editable-field or browser keys | `✔️` / implemented + `partial-local` | Browser focus and reserved-key conflict evidence remains unverified |
| `PG-A11Y-001` | P1 | **Host-evidence hold** | `relgeo/playground` UI/accessibility owner | `playground/scripts/audit-ux-contract.mjs`; `playground/src/App.tsx`; `playground/src/components/Navbar.tsx`; `playground/src/components/Inspector.tsx`; `playground/src/components/Sidebar.tsx`; `playground/src/components/Editor.tsx`; `playground/e2e/playground.spec.ts` | `pnpm audit:ux` plus source/unit evidence cover landmarks, names, roles, selected/expanded/pressed/value states, live announcements, focus return/traps, and source/preview navigation; DOM/keyboard and native AT require separate hosts | `⏸️` / host evidence hold | Owner `relgeo/playground` UI/accessibility; dependency is a bind-capable browser runner and native AT/device host |
| `PG-A11Y-002` | P1 | **Implementation-closable at supported-browser boundary; queue** | `relgeo/playground` UI/accessibility owner | `playground/src/styles/tokens.css`; `playground/src/index.css`; `playground/src/preview-toolbar.ts`; `playground/scripts/audit-ux-contract.mjs`; `playground/e2e/mobile-playground.spec.ts` | Static UX contract and supported-browser checks cover contrast/focus tolerance, target size, reduced motion, and non-gesture alternatives | `✔️` / implemented + `deferred-device` | Physical handset/touch evidence remains deferred by scope decision |
| `PG-THEME-001` | P1 | **Implementation-closable; queue** | `relgeo/playground` UI/product owner | `playground/src/styles/tokens.css`; `playground/src/index.css`; `playground/src/App.tsx`; `playground/src/theme.ts`; `playground/src/__tests__/theme.test.ts`; `playground/e2e/playground.spec.ts` | Unit and browser checks prove initial `system`, `prefers-color-scheme` behavior, explicit `light`/`dark` overrides, local persistence, and readable surfaces | `✔️` / implemented + `partial-local` | Browser system-preference/reload evidence remains unverified; accepted theme contract is not reopened |
| `PG-DELIVERY-001` | P1 | **External-evidence-only; explicit hosted hold** | `relgeo/playground` + `relgeo/relgeo.github.io` delivery owners | `playground` child revision; `relgeo.github.io` Pages workflow; `playground:artifact:check`; `test:pages-artifact`; `provenance:report` | Local assembled route/title/assets/provenance checks pass; hosted `/playground/` smoke/share and deployed revision remain unverified | `⏸️` / hosted evidence hold | Public Pages access and hosted deployment are external evidence gates; npm/pub.dev release is not required |

The six implementation-closable rows are the actionable local queue. The
delivery row remains visible and owned, but it must not be reported as a local
implementation failure. The detailed seven-row owner/source mapping in
[reconciliation §3](./reconciliation.md#3-task-bound-selection-and-accepted-contracts)
is the cross-document acceptance reference.

| Check | Result |
| --- | ---: |
| Expected gap rows | 0 (`🌗` implementation-result rows); 2 explicit host/deployment holds |
| P0/P1 triage rows reviewed | 7 |
| Implementation-closable triage rows | 6 |
| External-evidence-only triage rows | 1 |
| Candidate tasks | 3 |
| `🌗` candidates | 0 |
| `❌` candidates | 0 |
| Missing source IDs | 0 |
| Duplicate source IDs | 0 |
| Implementation versus verification tasks distinguished | Yes |

## Candidate implementation and evidence tasks

| Candidate task | Expected ID | Source status | Work kind | Owner | Dependency | Acceptance test / evidence target | Risk | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `PG-TASK-002` Complete delayed startup browser evidence | `PG-LIFE-002` | `✔️` local closure | browser evidence follow-up | Playground lifecycle owner | Bind-capable Playwright host; source implementation and unit gate pass | Observe the delayed startup trace and first interactive point; this is evidence follow-up, not an implementation gap | Browser observation remains unavailable in the current sandbox | Run the existing delayed-startup browser case when the preview server can bind |
| `PG-TASK-005` Complete web accessibility host evidence | `PG-A11Y-001` | `⏸️` | browser/native evidence hold | Playground UI/accessibility owner | Bind-capable browser host plus native VoiceOver/TalkBack/device host | Run DOM/keyboard traversal, then record native AT/device evidence separately; do not infer either boundary | Host-specific behavior remains unobserved | Run discovered DOM/keyboard cases, then schedule native AT evidence when scope/hosts open |
| `PG-TASK-007` Complete hosted artifact consistency | `PG-DELIVERY-001` | `⏸️` | hosted evidence hold | Playground + Pages delivery owner | Public Pages access and hosted workflow; local assembly and provenance pass | Compare hosted `/playground/` route/title/assets and deployed revision, then run public smoke/share checks | Deployed artifact can differ from the audited local artifact | Run hosted smoke/parity when public access is available |

### Previous tranche history

The following task labels are retained as prior-tranche history:
`PG-TASK-001` (`PG-THEME-001`), `PG-TASK-003` (`PG-CANVAS-005`),
`PG-TASK-004` (`PG-KEY-001`), and `PG-TASK-006` (`PG-A11Y-002`). Their source,
unit, static UX, and build evidence remains recorded in the [current
implementation audit](./implementation-audit.md). The P0/P1 triage above
reconciles their remaining bounded browser/accessibility acceptance instead of
silently treating historical task labels as proof that every evidence boundary
is closed.

## Dependency and sequencing view

| Candidate | Can proceed after | Why |
| --- | --- | --- |
| `PG-TASK-002` | Bootstrap state inspection already recorded in audit | Independent of theme, shortcut, and delivery work. |
| `PG-TASK-005` | `PG-TASK-004` implementation already present | Focus and command traversal evidence should validate the final keyboard surface. |
| `PG-TASK-007` | Current source revision and any artifact-affecting implementation tasks | Delivery proof must describe the exact build that is hosted and tested; the synchronized local tuple is closed, while hosted revision/parity remains an explicit external limitation. |

## Linked artifacts and handoff

- [Expected capability catalog](./expected-capability-catalog.md)
- [Implementation audit evidence](./implementation-audit.md)
- [Expected-versus-observed reconciliation](./reconciliation.md)
- [Playground capability matrix](./capability-matrix.md)
- [Repository map](../../REPOSITORY-MAP.md)
- [Maturation master plan](../../MATURATION-MASTER-PLAN.md)
- [Playground hardening plan](../../plans/05-public-docs-and-playground-hardening.md)

Downstream implementation work must update source and tests first, then rerun
the audit and reconciliation before changing a matrix status. A task is not
complete because a candidate row was discussed, documented, or assigned.
