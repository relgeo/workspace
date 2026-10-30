# Playground implementation-gap backlog

**Tanggal:** 2026-10-30

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
| `PG-TASK-002` Make startup loading state explicit | `PG-LIFE-002` | `🌗` | implementation + browser evidence | Playground lifecycle owner | Bootstrap sequence for IndexedDB, hash/shared draft, examples, and first resolve | First load visibly distinguishes loading from empty, ready, and error; delayed persistence/example fixtures assert status and interaction gating; browser smoke records each transition | P1 users can mistake an empty/loading surface for a ready workspace | Model bootstrap phases, add visible state, and test delayed startup paths |
| `PG-TASK-005` Close web accessibility semantics evidence gaps | `PG-A11Y-001` | `🌗` | implementation verification | Playground UI/accessibility owner | `PG-TASK-004` command/focus map; supported browser/AT matrix | Automated AX/DOM checks and manual keyboard traversal cover landmarks, names, roles, selected/expanded/pressed/value states, focus return/traps, error announcements, and source/preview navigation; native AT result is recorded separately | P1 inaccessible state changes can block authoring and recovery | Run AX and keyboard checks, fix findings, then schedule VoiceOver/TalkBack evidence if scope opens |
| `PG-TASK-007` Prove hosted artifact consistency | `PG-DELIVERY-001` | `🌗` | delivery verification | Playground + Pages delivery owner | Current child revision, Pages build workflow, Node >=24 canonical environment; rerun after implementation tasks that affect artifact | Build from the recorded revision, compare hosted `/playground/` assets/title/base route to the tested artifact, and run public smoke/share checks; archive revision and environment evidence | P1 users may receive an artifact different from the audited local source | Run clean hosted build/smoke when Pages and canonical environment are available |

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
