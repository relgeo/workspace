# Playground implementation-gap backlog

**Tanggal:** 2026-11-03

**Status:** candidate goal/task register; no row here counts as implementation

**Source:** [Playground capability matrix](./capability-matrix.md),
[expected-versus-observed reconciliation](./reconciliation.md)

**Selected scope:** [bounded in-scope selection](./in-scope-selection.md)
records the active local/browser tranche. Rows not listed there remain
candidate or verification work and are not active implementation scope.

**Evidence boundary:** `playground/`, `docs/REPOSITORY-MAP.md`,
`docs/MATURATION-MASTER-PLAN.md`, and `docs/capability-map/`. The candidate
rows below are derived from the expected catalog and reconciliation; source,
tests, and runtime evidence remain the acceptance boundary for closing them.

This backlog turns every Playground capability with status `🌗` or `❌` into a
separate candidate task. `➖`, `⏸️`, and evidence-only follow-ups are not hidden
as implementation work. Updating this document or the matrix never closes a
gap; status changes only after source, tests, and a new evidence audit
demonstrate the result.

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

The active SuClos task binds exactly three partial rows. This is a scope and
evidence contract; it does not close a row or promote a local result to hosted
parity.

| ID | Bound outcome | Required evidence before closure | Explicit non-goal |
| --- | --- | --- | --- |
| `PG-LIFE-002` | Startup distinguishes `loading`, `empty`, `ready`, and `error`; editor, file actions, preview controls, and command shortcuts are gated while bootstrap is `loading`. | Source state model in `playground/`; unit tests for all four states and gating; browser trace with delayed IndexedDB/bootstrap showing the four visible states and the first interactive point. | Do not reinterpret resolver `resolving` or storage failure as `empty`; do not change the accepted theme contract. |
| `PG-A11Y-001` | Browser DOM/ARIA semantics expose landmarks, names, roles, selected/expanded/pressed/value states, announcements, focus return/traps, and source/preview navigation. | `playground/scripts/audit-ux-contract.mjs`; DOM/keyboard browser run; focused source/tests; native VoiceOver/TalkBack remains separately labeled as deferred or unverified. | Native AT/device evidence is not silently claimed by static source checks. |
| `PG-DELIVERY-001` | Hosted `/playground/` is traceable to the tested child revision and assembled artifact. | Child revision, clean build output, base route/title/asset manifest comparison, hosted smoke/share run, and explicit environment/host limitation record. | A local Vite build is not public parity; Pages/network unavailability is `environment-limited`, not an implementation failure. |

The existing `system`/`light`/`dark` theme contract is preserved as accepted
task data: initial `system` follows `prefers-color-scheme`, explicit overrides
remain supported, and no new theme decision is opened here.

## Latest evidence checkpoint — 2026-11-03

| Bound row | Current evidence | Remaining boundary |
| --- | --- | --- |
| `PG-LIFE-002` | Explicit `loading`/`empty`/`ready`/`error` phases, bootstrap gate, unit coverage, successful build, and a discovered delayed-startup E2E case | Browser execution is unavailable because Playwright preview binding returns `EPERM`; no browser state is claimed. |
| `PG-A11Y-001` | Static UX audit passes; source includes landmarks, semantic states, announcements, focus return/traps, and source/preview navigation; DOM/keyboard E2E cases are discovered | Browser AX/traversal execution and native VoiceOver/TalkBack remain unverified/deferred. |
| `PG-DELIVERY-001` | Fresh local build and assembled website pass child-revision, title/base-route, asset, provenance, and all-file digest assertions | Public hosted smoke/parity is unavailable; baseline snapshot remains older than the current Pages pin and is reported, not rewritten. |

The available workspace is Node `22.23.2` while the canonical project contract is
Node `>=24`; build/test results are therefore local evidence, not canonical
toolchain parity.

| Check | Result |
| --- | --- |
| Expected gap rows | 3 |
| Candidate tasks | 3 |
| `🌗` candidates | 3 |
| `❌` candidates | 0 |
| Missing source IDs | 0 |
| Duplicate source IDs | 0 |
| Implementation versus verification tasks distinguished | Yes |

## Candidate implementation and evidence tasks

| Candidate task | Expected ID | Source status | Work kind | Owner | Dependency | Acceptance test / evidence target | Risk | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `PG-TASK-002` Complete startup browser evidence | `PG-LIFE-002` | `🌗` | browser evidence follow-up | Playground lifecycle owner | Playwright-capable host; source implementation and unit gate already pass | Delayed bootstrap run visibly distinguishes `loading → empty/ready` and `error`, with interaction blocked only during bootstrap; record the first interactive point | P1 startup ambiguity can still be missed without a browser trace | Run the existing delayed-startup browser case when the preview server can bind |
| `PG-TASK-005` Complete web accessibility evidence | `PG-A11Y-001` | `🌗` | browser/native evidence follow-up | Playground UI/accessibility owner | Playwright-capable host; native VoiceOver/TalkBack host for separate evidence | Browser AX/DOM and keyboard traversal cover landmarks, names, roles, selected/expanded/pressed/value states, focus return/traps, error announcements, and source/preview navigation; native AT remains separately recorded | P1 inaccessible state changes can block authoring and recovery | Run discovered DOM/keyboard cases, then schedule native AT evidence if scope opens |
| `PG-TASK-007` Complete hosted artifact consistency | `PG-DELIVERY-001` | `🌗` | hosted evidence follow-up | Playground + Pages delivery owner | Public Pages access and Node >=24 canonical environment; local artifact assertions already pass | Compare hosted `/playground/` route/title/assets and deployed revision to the tested artifact, then run public smoke/share checks; retain baseline drift as an explicit finding | P1 users may receive an artifact different from the audited local source | Run hosted smoke/parity when public access and canonical toolchain are available |

### Closed candidate rows

The following candidate rows are retained as history and are no longer open
backlog gaps: `PG-TASK-001` (`PG-THEME-001`), `PG-TASK-003`
(`PG-CANVAS-005`), `PG-TASK-004` (`PG-KEY-001`), and `PG-TASK-006`
(`PG-A11Y-002`). Their source, unit, static UX, and build evidence is recorded
in the [current implementation audit](./implementation-audit.md); browser or
physical-device checks remain explicitly qualified there.

## Dependency and sequencing view

| Candidate | Can proceed after | Why |
| --- | --- | --- |
| `PG-TASK-002` | Bootstrap state inspection already recorded in audit | Independent of theme, shortcut, and delivery work. |
| `PG-TASK-005` | `PG-TASK-004` implementation already present | Focus and command traversal evidence should validate the final keyboard surface. |
| `PG-TASK-007` | Current source revision and any artifact-affecting implementation tasks | Delivery proof must describe the exact build that is hosted and tested. |

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
