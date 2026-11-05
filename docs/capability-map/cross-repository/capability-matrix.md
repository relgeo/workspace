# Cross-Repository Orchestration Capability Matrix

**Status:** compatibility entry point; the canonical reporting view is
[`status-matrix.md`](./status-matrix.md)

**As of:** 2026-11-05

This file exists for consumers that expect the generic `capability-matrix.md`
entry point. It does not duplicate the 39-row matrix. The canonical
expected-versus-observed join remains [`reconciliation.md`](./reconciliation.md),
and the implementation backlog remains [`implementation-gap-backlog.md`](./implementation-gap-backlog.md).

## Current orchestration security and evidence slice

| Capability | Current evidence | Owner | Limitation / next action |
| --- | --- | --- | --- |
| `ORCH-OPS-001` / `ORCH-OPS-002` | `verified-static`: failed stages expose owner, repository, surface, blocker class, remediation, decision flags, dependency/downstream impact, and status | `relgeo/workspace` + stage owners | Verify provider-side propagation on a supported CI run |
| `ORCH-OPS-003` | `verified-static`: transient retry is bounded; attempts, links, retry budget, and first failure are retained | `relgeo/workspace` + CI owners | Observe one live transient CI retry |
| `ORCH-OPS-005` | `verified-static`: `evaluateDecisionGate()` is consumed by release preflight and fails closed for pending/rejected/stale decisions | `relgeo/workspace` + stage/release owners | Observe provider-side scope/release enforcement and a current canonical decision record |
| `ORCH-PUB-003` | `verified-static`: integration is read-only; sync uses `contents: write`, `pull-requests: write`, `actions: read`, and credential-free checkout | `relgeo/workspace` CI | Provider-side PR/dispatch observation remains pending |
| `ORCH-BOOT-001` / `ORCH-BOOT-002` | `unverified-environment`: bootstrap contract and Node/pnpm prerequisite are present; this host is Node 22.23.2 while Node 24+ is required | `relgeo/workspace` | Rerun fresh-clone bootstrap on Node 24/pnpm 10.33.3 |
| `ORCH-BASE-002` / `ORCH-EVID-002` / `ORCH-EVID-003` | `partial-current`: structured blocked report preserves environment classification and current-versus-historical rules | `relgeo/workspace` | Reconcile stale baseline pins through validated child-CI sync, then capture canonical evidence |

## Policy probes

The static policy check is [`scripts/test-workflow-security-policy.mjs`](../../../scripts/test-workflow-security-policy.mjs).
It verifies that every root workflow has bounded timeout/concurrency, every
checkout disables credential persistence, integration has read-only contents
permission, and the sync workflow requests no Actions write permission.

An unsupported host or unavailable registry/browser is recorded as
`environment-unavailable`/`unverified`; it cannot be promoted to a target
defect and cannot make historical evidence current.
