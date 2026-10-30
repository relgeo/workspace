# Cross-Repository Orchestration bounded in-scope selection

**Date:** 2026-10-30
**Task:** `select-and-bound-in-scope-capability-debt--1185036423`
**Status:** bounded selection record; implementation outcomes are tracked in
the audit, reconciliation, matrix, and backlog
**Owner boundary:** `relgeo/workspace` owns root orchestration scripts,
manifests, reports, and GitHub Actions policy. Child repositories own their
source and CI runs; this selection does not move that ownership into the
workspace.

## Decision

This tranche selects seven actionable capabilities from the expected catalog,
implementation audit, status/reconciliation view, and implementation-gap
backlog. It is bounded to current baseline/evidence integrity and operational
control: strict baseline truth, revision-to-evidence traceability, actionable
blockers, bounded reruns, and the sync workflow's credential boundary.

The existing validated child-CI dispatch and exact-SHA synchronization flow is
an input contract and validation dependency, not new implementation scope,
because its capability rows are currently `✔️`. Integration and public-gate
rows that are only waiting for Node 24, registry, browser, Flutter, or provider
availability remain evidence follow-ups rather than implementation work in
this tranche. No npm release, production deployment, or deferred platform
smoke is a prerequisite.

The status symbols below are the selection-time snapshot. They are not
implementation evidence and are not authoritative after implementation review;
the current matrix/reconciliation owns subsequent status changes. `➖` and
`⏸️` items are explicitly excluded from active implementation.

## Evidence and selection inputs

| Input | Role in this selection |
| --- | --- |
| [Expected capability catalog](./expected-capability-catalog.md) | Defines the stable expected IDs, normative owners, source paths, and contract boundaries. |
| [Implementation audit](./implementation-audit.md) | Records the observed scripts/workflows, current baseline drift, partial boundaries, and the absent retry policy. |
| [Status matrix](./status-matrix.md) and [reconciliation](./reconciliation.md) | Supplies the honest `✔️`/`🌗`/`❌` status symbol and keeps implementation, evidence, and scope distinct. |
| [Implementation-gap backlog](./implementation-gap-backlog.md) | Supplies candidate task IDs, ownership, dependencies, and acceptance targets. |
| [`docs/integration-baseline.json`](../../integration-baseline.json), [`scripts/`](../../../scripts), and [`.github/workflows/`](../../../.github/workflows) | Concrete baseline, report, runner, and CI contract surfaces inspected for this selection. |

## Bounded active selection

Each row maps one expected capability to one backlog candidate. Every selected
item has an owner, source-of-truth path, observed implementation/test path,
contract boundary, and explicit acceptance behavior. Dependencies are
sequencing constraints, not additional scope.

| Selection / backlog task | Current status | Owner | Source of truth | Observed implementation / test paths | Contract boundary | Explicit acceptance behavior |
| --- | --- | --- | --- | --- | --- | --- |
| `ORCH-BASE-002` — strict baseline truth / `GAP-ORCH-002` | `🌗` | `relgeo/workspace` + validated child-CI owners | [Catalog row](./expected-capability-catalog.md) (`ORCH-BASE-002`); [audit row](./implementation-audit.md) (`ORCH-BASE-002`); [backlog row](./implementation-gap-backlog.md) (`GAP-ORCH-002`); [`docs/integration-baseline.json`](../../integration-baseline.json) | [`scripts/verify-baseline.mjs`](../../../scripts/verify-baseline.mjs); [`scripts/test-baseline-failure.mjs`](../../../scripts/test-baseline-failure.mjs); [`scripts/README.md`](../../../scripts/README.md); current gitlink/submodule status | The root baseline must match registered gitlinks, checked-out child revisions, package metadata, compatibility line, and clean-state rules. Diagnostic inspection may be non-mutating; baseline repair must use validated child CI and a reviewable sync path. | For every stale child pointer, authoritative child-run metadata is recorded; the sync path stages the exact SHA; manifest and gitlink agree; strict baseline, compatibility, and the dependent integration gate produce a current report. Deliberate mismatch still fails with a targeted diagnostic. |
| `ORCH-EVID-002` — evidence class separation / `GAP-ORCH-004` | `🌗` | `relgeo/workspace` evidence owner + stage owners | [Catalog row](./expected-capability-catalog.md) (`ORCH-EVID-002`); [audit row](./implementation-audit.md) (`ORCH-EVID-002`); [backlog row](./implementation-gap-backlog.md) (`GAP-ORCH-004`); `docs/MATURATION-MASTER-PLAN.md` §2.7 | [`scripts/run-integration-gate.mjs`](../../../scripts/run-integration-gate.mjs); [`scripts/run-release-preflight.mjs`](../../../scripts/run-release-preflight.mjs); integration and sync workflow summaries | Local, public-registry, canonical CI, manual, and deployment evidence remain separate claims. A report may cite another class but cannot silently promote it to current canonical evidence. | A machine-readable report labels evidence class, tested revision/baseline, command, result, and limitation; a stale or historical record is rejected or visibly marked when used for a current claim. |
| `ORCH-EVID-003` — revision-to-evidence traceability / `GAP-ORCH-004` | `🌗` | `relgeo/workspace` + child CI owners | [Catalog row](./expected-capability-catalog.md) (`ORCH-EVID-003`); [audit row](./implementation-audit.md) (`ORCH-EVID-003`); [backlog row](./implementation-gap-backlog.md) (`GAP-ORCH-004`); [`docs/integration-baseline.json`](../../integration-baseline.json) | [`scripts/run-integration-gate.mjs`](../../../scripts/run-integration-gate.mjs); [`scripts/verify-baseline.mjs`](../../../scripts/verify-baseline.mjs); [`sync-validated-submodule-after-ci.yml`](../../../.github/workflows/sync-validated-submodule-after-ci.yml) | A claim is bound to the exact root revision, child revisions, compatibility line, toolchain, run, artifact, and limitation actually tested. Newer pointers cannot inherit older evidence. | One current report joins the exact root/child revisions to run identifiers, toolchain, artifact/report identity, evidence class, and limitations; strict verification rejects a mismatched baseline instead of producing a current claim. |
| `ORCH-OPS-001` — actionable failure ownership / `GAP-ORCH-006` | `🌗` | `relgeo/workspace` + each stage owner | [Catalog row](./expected-capability-catalog.md) (`ORCH-OPS-001`); [audit row](./implementation-audit.md) (`ORCH-OPS-001`); [backlog row](./implementation-gap-backlog.md) (`GAP-ORCH-006`); Integration Plan §5.3/§8 | [`scripts/run-integration-gate.mjs`](../../../scripts/run-integration-gate.mjs); [`scripts/run-release-preflight.mjs`](../../../scripts/run-release-preflight.mjs); [`scripts/verify-baseline.mjs`](../../../scripts/verify-baseline.mjs) | Every failed stage names the owning repository/surface, command, failure reason, evidence boundary, and remediation owner. A generic non-zero result is not sufficient for downstream orchestration. | Failure reports contain stable owner, repository/surface, stage, command, blocker class, dependency impact, remediation, and decision-required fields; failure-injection fixtures assert the fields without exposing private paths. |
| `ORCH-OPS-002` — blocker classification and dependency propagation / `GAP-ORCH-006` | `🌗` | `relgeo/workspace` + stage owners | [Catalog row](./expected-capability-catalog.md) (`ORCH-OPS-002`); [audit row](./implementation-audit.md) (`ORCH-OPS-002`); [backlog row](./implementation-gap-backlog.md) (`GAP-ORCH-006`); `docs/MATURATION-MASTER-PLAN.md` §2.7 | [`scripts/run-integration-gate.mjs`](../../../scripts/run-integration-gate.mjs); [`scripts/run-flutter-conformance.mjs`](../../../scripts/run-flutter-conformance.mjs); [`scripts/plan-release-recovery.mjs`](../../../scripts/plan-release-recovery.mjs); integration workflow job partitioning | The system distinguishes target defect, missing dependency/service, environment unavailable, and pending human decision. Only dependent work is blocked; an unavailable provider does not become a target parity failure. | Reports and handoff docs use one documented blocker taxonomy and declare downstream impact (`blocked`, `ready`, or `not-run`) plus remediation/decision requirements; environment-unavailable fixtures remain non-defect evidence. |
| `ORCH-OPS-003` — bounded retry and evidence-preserving rerun / `GAP-ORCH-007` | `❌` | `relgeo/workspace` + CI owners | [Catalog row](./expected-capability-catalog.md) (`ORCH-OPS-003`); [audit row](./implementation-audit.md) (`ORCH-OPS-003`); [backlog row](./implementation-gap-backlog.md) (`GAP-ORCH-007`); Integration Plan §8 | [`scripts/run-integration-gate.mjs`](../../../scripts/run-integration-gate.mjs); [`scripts/README.md`](../../../scripts/README.md); `.github/workflows/integration.yml` timeout/concurrency settings | Retry applies only to classified transient/environment failures, has a finite attempt budget and bounded backoff, and preserves the original failure. Deterministic contract failures require remediation and must not be hidden by retry. | A policy and fixture prove max attempts, classifier, backoff, idempotent rerun, linked attempt reports, and distinct environment-unavailable status; first and subsequent reports remain available and no infinite retry path exists. |
| `ORCH-PUB-003` — least-privilege sync checkout / `GAP-ORCH-008` | `🌗` | `relgeo/workspace` CI owner | [Catalog row](./expected-capability-catalog.md) (`ORCH-PUB-003`); [audit row](./implementation-audit.md) (`ORCH-PUB-003`); [backlog row](./implementation-gap-backlog.md) (`GAP-ORCH-008`); sync workflow permissions | [`sync-validated-submodule-after-ci.yml`](../../../.github/workflows/sync-validated-submodule-after-ci.yml); [`integration.yml`](../../../.github/workflows/integration.yml) | CI checkout is credential-free by default; write permissions exist only for the sync workflow's narrowly required PR/dispatch boundary. The child-run token and checkout credential lifecycle must be explicit. | Sync checkout explicitly declares credential persistence behavior; a static workflow check proves the intended permissions and checkout policy; exact-SHA sync and reviewable PR creation still work under the minimum required permissions. |

## Sequencing and dependency boundary

The intended sequence is:

1. `ORCH-OPS-001` and `ORCH-OPS-002` define the shared failure and blocker
   fields needed by retry and evidence reports.
2. `ORCH-OPS-003` implements bounded rerun behavior against that taxonomy.
3. `ORCH-BASE-002` uses the existing validated child-CI dispatch contract to
   restore a truthful baseline; it does not replace or weaken that flow.
4. `ORCH-EVID-002` and `ORCH-EVID-003` join the refreshed baseline to clearly
   classified current evidence.
5. `ORCH-PUB-003` is an independent CI-hardening item and may be validated in
   parallel, subject to provider-side workflow review.

No candidate outside these seven IDs was active implementation in this tranche.

## Implementation follow-up

The implementation task added focused source/test evidence for the selected
operational and workflow boundaries. Current authoritative statuses are:

| Capability | Current status | Evidence boundary |
| --- | --- | --- |
| `ORCH-BASE-002` | `🌗` | Strict baseline still reports stale manifest revisions and dirty child worktrees. |
| `ORCH-EVID-002` | `🌗` | Shared envelope is present, but current baseline/evidence refresh remains pending. |
| `ORCH-EVID-003` | `🌗` | Exact revision/baseline fields are emitted, but current pointers still drift. |
| `ORCH-OPS-001` | `✔️` | Shared owner/remediation/dependency fields and focused fixture pass. |
| `ORCH-OPS-002` | `✔️` | Shared blocker taxonomy and environment-unavailable distinction pass. |
| `ORCH-OPS-003` | `✔️` | Bounded transient retry/backoff and evidence-preserving fixture pass. |
| `ORCH-PUB-003` | `✔️` | Sync checkout credential policy and permission assertions pass. |

These promotions do not promote unrelated environment/provider/deployment or
deferred-scope work.

## Deliberately excluded from active implementation

| Excluded item | Status / treatment | Reason |
| --- | --- | --- |
| `ORCH-BASE-001`, `ORCH-CI-001`–`ORCH-CI-005`, `ORCH-EVID-001`, `ORCH-OPS-004`, and other `✔️` rows | `✔️` prerequisite/evidence surface | Existing behavior is not an actionable `❌`/`🌗`/`⚠️` gap. It may be exercised to validate the selected work but is not reimplemented here. |
| `ORCH-BOOT-001`/`002`/`004`, `ORCH-GATE-002`/`003`, `ORCH-PUB-002`, `ORCH-REL-001`/`004`/`005` | `🌗` evidence follow-up only | Current findings are primarily Node 24, registry, browser, deployment, or other environment/provider limits; they are not prerequisites for this documentation/contract tranche. |
| `ORCH-EVID-004`, `ORCH-REL-*`, public deployment and public smoke | `🌗` excluded | Release and deployment evidence are intentionally release-independent follow-ups and must not gate this selection. |
| Android/iOS, raw SVG byte equality, automatic npm publish, atomic npm rollback, workspace UI/menu/shortcut | `➖` or `⏸️` scope boundary | Catalog and accepted decisions keep these out/deferred; no active implementation task is created. |

No `➖` or `⏸️` item is treated as active implementation work.

## Status accounting

| Check | Result |
| --- | ---: |
| Selected capability IDs | 7 |
| Selected `🌗` rows | 6 (`ORCH-BASE-002`, `ORCH-EVID-002`, `ORCH-EVID-003`, `ORCH-OPS-001`, `ORCH-OPS-002`, `ORCH-PUB-003`) |
| Selected `❌` rows | 1 (`ORCH-OPS-003`) |
| Selected `⚠️` rows | 0 |
| Selected `➖` or `⏸️` rows | 0 |
| Selected IDs with owner, source path, boundary, and acceptance behavior | 7/7 |

Changing this record or the backlog is not implementation evidence. The
source/workflow changes, focused test, and evidence described above are now
recorded in the implementation audit and reconciliation; remaining current,
provider, release, and deferred-scope limitations stay visible there.
