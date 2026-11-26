# Reviewed Cross-Repository Orchestration Catalog Boundary

**Review date:** 2026-11-14

**Canonical expected source:** [expected-capability-catalog.md](./expected-capability-catalog.md)

**Canonical implementation/status sources:** [implementation-audit.md](./implementation-audit.md), [reconciliation.md](./reconciliation.md), and [status-matrix.md](./status-matrix.md)

**Backlog source:** [implementation-gap-backlog.md](./implementation-gap-backlog.md)

**Boundary:** 39 `ORCH-*` capabilities across bootstrap, baseline/conformance,
integration gates, child-CI synchronization, evidence, release/recovery,
operations, and public-artifact hygiene. This projection freezes the reviewed
join; it does not close implementation gaps or rewrite child gitlinks.

## Review outcome

The expected catalog, implementation audit, reconciliation, status matrix, and
backlog have the same 39-ID expected set. The backlog carries 19 IDs: the 18
current `🌗` rows plus one selected/closed row retained as traceability; no
expected capability is missing from the audit or status matrix, and no backlog
row is outside the expected set. Current status is **21 `✔️` · 18 `🌗` ·
0 `❌` · 0 `➖` · 0 `⏸️` · 0 `⚠️`**.

Evidence is intentionally scoped. The reviewed checkout is root
`63b28c4ebde79a9b7d83faa182fca06387272143`, with 12 initialized child
worktrees; 11 match current gitlinks and Flutter is clean but checked out at
`3a9f7766f168b0077057fbedb571c3d4c8432bf2` while the root pointer is
`dc630bf19397ec20fff37ffa52f9f8e7e32b0f89`. `docs/integration-baseline.json`
was captured on `2026-11-13` and remains unpromoted because that Flutter
pointer differs. Node `22.23.2` is below the
declared Node `>=24` minimum, so strict/full integration evidence is not
promoted. Local contract and fixture evidence remains separate from CI,
provider, registry, public, Flutter-host, and deployment evidence.

## One-to-one reviewed join

| ID | Requirement ID(s) | Owner repository | Source of truth | Status | Evidence locator |
| --- | --- | --- | --- | --- | --- |
| `ORCH-BOOT-001` | `R-JOURNEY`, `R-BASELINE` | `relgeo/workspace` | `scripts/bootstrap.mjs`, `scripts/README.md` | `🌗` | [matrix](./status-matrix.md#matrix), [audit](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map) |
| `ORCH-BOOT-002` | `R-JOURNEY`, `R-GATE` | `relgeo/workspace` | `package.json`, `.node-version`, `scripts/README.md` | `🌗` | [matrix](./status-matrix.md#matrix), [audit](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map) |
| `ORCH-BOOT-003` | `R-BOUNDARY`, `R-BASELINE` | `relgeo/workspace` | `.gitmodules`, recursive checkout workflow | `🌗` | [recursive status](./coverage-validation-handoff.md#23-reproducible-evidence-and-changed-boundary), [matrix](./status-matrix.md#matrix) |
| `ORCH-BOOT-004` | `R-BOUNDARY`, `R-PUBLIC` | `relgeo/workspace` | `scripts/public-boundary.mjs`, `scripts/bootstrap.mjs` | `🌗` | [audit](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map), [matrix](./status-matrix.md#matrix) |
| `ORCH-BASE-001` | `R-BASELINE`, `R-EVIDENCE` | `relgeo/workspace` | `docs/integration-baseline.json` | `🌗` | [baseline join](./implementation-audit.md#3-observed-operational-evidence), [matrix](./status-matrix.md#matrix) |
| `ORCH-BASE-002` | `R-BASELINE`, `R-OPS` | `relgeo/workspace` | `scripts/verify-baseline.mjs`, `scripts/test-baseline-failure.mjs` | `🌗` | [OBS-19](./implementation-audit.md#3-observed-operational-evidence), [matrix](./status-matrix.md#matrix) |
| `ORCH-BASE-003` | `R-DSL`, `R-BASELINE` | `relgeo/spec` + workspace | `spec/id/`, `docs/compatibility-matrix.json`, compatibility checker | `🌗` | [audit](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map), [matrix](./status-matrix.md#matrix) |
| `ORCH-BASE-004` | `R-CONFORMANCE`, `R-GATE` | `relgeo/workspace` + Flutter | `fixtures/manifest.json`, conformance runners | `🌗` | [fixture evidence](./implementation-audit.md#3-observed-operational-evidence), [matrix](./status-matrix.md#matrix) |
| `ORCH-BASE-005` | `R-BOUNDARY`, `R-EVIDENCE` | `relgeo/workspace` | `docs/REPOSITORY-MAP.md`, ownership plans | `✔️` | [source inventory](./implementation-audit.md#21-source-inventory-diperiksa), [matrix](./status-matrix.md#matrix) |
| `ORCH-GATE-001` | `R-GATE`, `R-BASELINE` | `relgeo/workspace` | `scripts/run-integration-gate.mjs`, integration plan | `✔️` | [audit](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map), [matrix](./status-matrix.md#matrix) |
| `ORCH-GATE-002` | `R-GATE`, `R-DSL` | workspace + package owners | local integration gate and package scripts | `🌗` | [matrix](./status-matrix.md#matrix), [reconciliation](./reconciliation.md#3-one-to-one-expected-versus-observed-join) |
| `ORCH-GATE-003` | `R-GATE`, `R-PUBLIC` | `relgeo/workspace` | public integration runner and integration plan | `🌗` | [matrix](./status-matrix.md#matrix), [reconciliation](./reconciliation.md#3-one-to-one-expected-versus-observed-join) |
| `ORCH-GATE-004` | `R-GATE`, `R-PUBLIC` | workspace + website/Playground owners | consumer artifact assertions and integration workflow | `✔️` | [audit](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map), [matrix](./status-matrix.md#matrix) |
| `ORCH-GATE-005` | `R-GATE`, `R-SCOPE` | `relgeo/workspace` | `.github/workflows/integration.yml` | `✔️` | [workflow inventory](./implementation-audit.md#21-source-inventory-diperiksa), [matrix](./status-matrix.md#matrix) |
| `ORCH-CI-001` | `R-CI-DISPATCH`, `R-EVIDENCE` | child CI + `relgeo/workspace` | child workflows and sync workflow | `✔️` | [audit](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map), [matrix](./status-matrix.md#matrix) |
| `ORCH-CI-002` | `R-CI-DISPATCH`, `R-PUBLIC` | `relgeo/workspace` | sync workflow allowlist/payload validation | `✔️` | [child-CI contract](./implementation-audit.md#3-observed-operational-evidence), [matrix](./status-matrix.md#matrix) |
| `ORCH-CI-003` | `R-CI-DISPATCH`, `R-EVIDENCE` | `relgeo/workspace` | authoritative child-run checks in sync workflow | `✔️` | [audit](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map), [matrix](./status-matrix.md#matrix) |
| `ORCH-CI-004` | `R-CI-DISPATCH`, `R-BASELINE` | `relgeo/workspace` | sync workflow and `verify-baseline.mjs` | `✔️` | [OBS-19](./implementation-audit.md#3-observed-operational-evidence), [matrix](./status-matrix.md#matrix) |
| `ORCH-CI-005` | `R-CI-DISPATCH`, `R-GATE` | `relgeo/workspace` | sync workflow PR and Integration dispatch | `✔️` | [workflow inventory](./implementation-audit.md#21-source-inventory-diperiksa), [matrix](./status-matrix.md#matrix) |
| `ORCH-EVID-001` | `R-EVIDENCE`, `R-GATE` | `relgeo/workspace` | orchestration contract and gate reports | `✔️` | [audit](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map), [matrix](./status-matrix.md#matrix) |
| `ORCH-EVID-002` | `R-EVIDENCE` | `relgeo/workspace` | `scripts/orchestration-contract.mjs` | `🌗` | [evidence checkpoint](./reconciliation.md#21-current-consumer-boundary-checkpoint--2026-11-14), [matrix](./status-matrix.md#matrix) |
| `ORCH-EVID-003` | `R-BASELINE`, `R-EVIDENCE` | workspace + child CI | baseline and joined integration evidence | `🌗` | [OBS-19](./implementation-audit.md#3-observed-operational-evidence), [matrix](./status-matrix.md#matrix) |
| `ORCH-EVID-004` | `R-GATE`, `R-EVIDENCE`, `R-PUBLIC` | website owner + workspace | artifact/public-smoke handoff | `🌗` | [reconciliation](./reconciliation.md#3-one-to-one-expected-versus-observed-join), [matrix](./status-matrix.md#matrix) |
| `ORCH-EVID-005` | `R-EVIDENCE`, `R-OPS` | `relgeo/workspace` | blocker/evidence envelope and handoff | `✔️` | [OBS-19](./implementation-audit.md#3-observed-operational-evidence), [matrix](./status-matrix.md#matrix) |
| `ORCH-REL-001` | `R-RELEASE`, `R-EVIDENCE` | `relgeo/workspace` | `scripts/run-release-preflight.mjs` | `🌗` | [audit](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map), [matrix](./status-matrix.md#matrix) |
| `ORCH-REL-002` | `R-RELEASE`, `R-PUBLIC` | package owners + workspace | release audit and pack boundary | `✔️` | [release evidence](./implementation-audit.md#3-observed-operational-evidence), [matrix](./status-matrix.md#matrix) |
| `ORCH-REL-003` | `R-RELEASE`, `R-RECOVERY` | release owner | manual ordered release flow | `✔️` | [audit](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map), [matrix](./status-matrix.md#matrix) |
| `ORCH-REL-004` | `R-RELEASE`, `R-GATE`, `R-EVIDENCE` | workspace + package/consumer owners | published verification runner | `🌗` | [reconciliation](./reconciliation.md#3-one-to-one-expected-versus-observed-join), [matrix](./status-matrix.md#matrix) |
| `ORCH-REL-005` | `R-RECOVERY`, `R-RELEASE` | release owner | `scripts/plan-release-recovery.mjs` | `🌗` | [recovery evidence](./implementation-audit.md#3-observed-operational-evidence), [matrix](./status-matrix.md#matrix) |
| `ORCH-REL-006` | `R-RELEASE`, `R-DSL`, `R-SCOPE` | `relgeo/workspace` | release decision record/checker | `✔️` | [audit](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map), [matrix](./status-matrix.md#matrix) |
| `ORCH-OPS-001` | `R-GATE`, `R-OPS` | workspace + stage owners | report owner/remediation fields | `✔️` | [contract evidence](./implementation-audit.md#3-observed-operational-evidence), [matrix](./status-matrix.md#matrix) |
| `ORCH-OPS-002` | `R-OPS`, `R-EVIDENCE` | `relgeo/workspace` | blocker taxonomy and dependency impact | `✔️` | [OBS-19](./implementation-audit.md#3-observed-operational-evidence), [matrix](./status-matrix.md#matrix) |
| `ORCH-OPS-003` | `R-OPS`, `R-EVIDENCE` | workspace + CI owners | retry classifier, budget, and retained attempts | `✔️` | [contract evidence](./implementation-audit.md#3-observed-operational-evidence), [matrix](./status-matrix.md#matrix) |
| `ORCH-OPS-004` | `R-OPS`, `R-CI-DISPATCH` | workspace + CI owners | root workflows and concurrency guards | `✔️` | [workflow inventory](./implementation-audit.md#21-source-inventory-diperiksa), [matrix](./status-matrix.md#matrix) |
| `ORCH-OPS-005` | `R-SCOPE`, `R-RELEASE`, `R-EVIDENCE` | `relgeo/workspace` | `evaluateDecisionGate()` and decision records | `🌗` | [decision contract](./implementation-audit.md#3-observed-operational-evidence), [matrix](./status-matrix.md#matrix) |
| `ORCH-PUB-001` | `R-PUBLIC` | `relgeo/workspace` | public-boundary scanner and pack filters | `✔️` | [public boundary evidence](./implementation-audit.md#3-observed-operational-evidence), [matrix](./status-matrix.md#matrix) |
| `ORCH-PUB-002` | `R-PUBLIC`, `R-GATE` | workspace + consumer owners | isolated public integration runner | `🌗` | [reconciliation](./reconciliation.md#3-one-to-one-expected-versus-observed-join), [matrix](./status-matrix.md#matrix) |
| `ORCH-PUB-003` | `R-PUBLIC`, `R-CI-DISPATCH` | `relgeo/workspace` + CI | root/sync workflow permissions and checkout policy | `✔️` | [child-CI contract](./implementation-audit.md#3-observed-operational-evidence), [matrix](./status-matrix.md#matrix) |
| `ORCH-PUB-004` | `R-PUBLIC`, `R-EVIDENCE` | `relgeo/workspace` + CI | workflow artifact retention and provenance | `✔️` | [workflow inventory](./implementation-audit.md#21-source-inventory-diperiksa), [matrix](./status-matrix.md#matrix) |

## Reconciliation rules

- The canonical expected catalog owns the 39 IDs, capability names, requirement
  references, scope decisions, and normative owner/source boundary.
- The audit owns implementation and evidence observations; the reconciliation
  owns the one-to-one join; the status matrix owns the reporting symbols; and
  the backlog owns actionable candidate sequencing.
- A local pass, historical record, provider report, or environment-unavailable
  result cannot be promoted into a different evidence class by this projection.
- Baseline repair remains a validated child-CI sync/PR operation. This review
  records the current Flutter checkout/pointer mismatch and does not mutate `docs/integration-baseline.json`
  or any submodule pointer.
