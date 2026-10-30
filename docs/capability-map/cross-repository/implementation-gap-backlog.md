# Cross-Repository Orchestration — Implementation Gap Backlog

**Status:** candidate backlog; selected implementation outcomes are recorded here,
but this document does not substitute for source/tests/audit evidence

**Tanggal:** 2026-10-30

**Expected source:** [Expected Cross-Repository Orchestration Capability Catalog](./expected-capability-catalog.md)

**Implementation audit:** [Cross-Repository Orchestration Implementation and Evidence Audit](./implementation-audit.md)

**Status matrix:** [Cross-Repository Orchestration Capability Status Matrix](./status-matrix.md)

**Expected-versus-observed join:** [Cross-Repository Orchestration Reconciliation](./reconciliation.md)

**Coverage validation and handoff:** [Coverage Validation and Handoff](./coverage-validation-handoff.md)

**Bounded selection:** [Cross-Repository Orchestration bounded in-scope selection](./in-scope-selection.md)

## Rules

This is a planning/reporting artifact, not implementation. A candidate becomes
done only after source/workflow changes, tests, and the stated evidence target
pass. Every unresolved current `🌗` capability is represented below; selected
rows that are now `✔️` remain in their candidate groups as closure traceability.
Missing runtime, provider, host, or network services remain evidence limitations
and do not count as an implementation fix.

`Dependency` is a real prerequisite, not a priority ranking. `Acceptance test /
evidence target` names the proof required before a future status review; it does
not assert that the proof exists now.

Documentation, matrix entries, and audit prose alone never close a backlog item
or upgrade its capability status; closure requires the stated source/workflow
change plus tests and verification evidence.

The [bounded selection](./in-scope-selection.md) activated seven capability
rows for the current tranche. The remaining candidate rows stay visible for
future sequencing, but are not active implementation here. Status symbols are
owned by the status matrix/reconciliation and are not changed by selection.

Priority is urgency and risk, not execution order: `P0` blocks trustworthy
bootstrap/baseline/gate evidence; `P1` closes high-risk evidence, release,
security, and operational-control gaps. Dependencies still determine the safe
execution order.

## Selected implementation outcomes

The selected tranche has source changes and focused evidence for the following
boundaries. These outcomes do not close grouped backlog goals whose other
capabilities remain unresolved.

| Selected capability | Current status | Evidence | Remaining boundary |
| --- | --- | --- | --- |
| `ORCH-OPS-001`, `ORCH-OPS-002` / `GAP-ORCH-006` | `✔️` (`verified-static`) | Shared contract, integration/release/baseline report fields, focused contract test, and structured Node-prerequisite report | `ORCH-OPS-005` decision enforcement and live provider propagation remain open. |
| `ORCH-OPS-003` / `GAP-ORCH-007` | `✔️` (`verified-static`) | Shared transient classifier, two-attempt bounded retry/backoff, preserved attempts, deterministic/environment non-retry assertions | Live transient CI/provider observation remains open. |
| `ORCH-PUB-003` / `GAP-ORCH-008` | `✔️` (`verified-static`) | Sync workflow `persist-credentials: false`, declared write boundary, and focused workflow policy assertions | Provider-side sync PR/dispatch observation remains open. |
| `ORCH-EVID-002` / `GAP-ORCH-004` | `🌗` (`partial-current`) | Shared evidence envelope separates evidence classes; focused contract and blocked integration report preserve limitations | Current canonical run after baseline reconciliation remains open. |
| `ORCH-EVID-003` / `GAP-ORCH-004` | `🌗` (`partial-current`) | Schema-versioned evidence envelope and exact baseline/toolchain/limitation fields in reports | Three stale manifest revisions and current artifact/public-smoke join remain open. |
| `ORCH-BASE-002` / `GAP-ORCH-002` | `🌗` (`partial-current`) | Strict verifier and failure-injection evidence preserved; current JSON identifies stale revisions and dirty child worktrees | Validated child-CI synchronization and clean baseline remain open. |

The other candidate rows below remain visible because their environment,
provider, public-registry, release, or deferred-platform evidence is not a
prerequisite for this implementation tranche.

## Candidate goals/tasks

| Priority | ID | Candidate goal/task | Scope | Capability IDs | Owner | Dependency | Acceptance test / evidence target | Risk | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `P0` | `GAP-ORCH-001` | Make fresh-clone bootstrap and public boundary reproducible | Root bootstrap, submodule, and public-artifact boundary | `ORCH-BOOT-001`, `ORCH-BOOT-002`, `ORCH-BOOT-004` | `relgeo/workspace` | Node 24/pnpm toolchain; recursive submodules; artifact scanner | From a clean clone, bootstrap exits cleanly on declared Node 24/pnpm; strict submodule state is reported; generated reports/artifacts contain no private paths or secrets; probe records commands and limitations | Operator-specific setup or public leakage undermines all downstream evidence | Define bootstrap contract and run clean-clone matrix on a supported host |
| `P0` | `GAP-ORCH-002` | Restore current baseline and cross-surface conformance proof | Root baseline plus validated child-CI and Flutter evidence boundary | `ORCH-BASE-002`, `ORCH-BASE-004` | `relgeo/workspace` + child owners | Validated child CI for current `playground`, `flutter`, `mcp`; Flutter SDK; fixture manifest | Exact child SHA sync updates baseline through reviewable PR; strict baseline passes; TypeScript and Flutter conformance reports name the same baseline and preserve fixture status semantics | Stale pointers or blocked Flutter host produce false parity claims | Reconcile child revisions through the existing validated sync flow, then rerun conformance |
| `P0` | `GAP-ORCH-003` | Execute current local and isolated public integration gates | Root integration runner, package gates, consumer artifacts, and registry boundary | `ORCH-GATE-002`, `ORCH-GATE-003`, `ORCH-PUB-002` | `relgeo/workspace` + package/consumer owners | GAP-ORCH-001; Node 24; registry/network; browser/public consumer services | Local dependency-order gate passes with report; isolated temporary checkout installs from registry without sibling source; public consumer build/test and artifact assertions pass; failures identify stage and command | Local aliases or unsupported runtime hide package/public defects | Run local then public gates on a Node 24/network-capable environment |
| `P1` | `GAP-ORCH-004` | Reconcile current evidence, artifacts, and public smoke | Root evidence schema plus website/deployment handoff | `ORCH-EVID-002`, `ORCH-EVID-003`, `ORCH-EVID-004` | `relgeo/workspace` + website/consumer owners | GAP-ORCH-002/003; exact baseline; deployment URL; artifact service | One machine-readable record joins root/child revisions, toolchain, run, artifact digest/path, deployment URL, public smoke result, evidence class, and limitations; stale evidence is rejected from current claim | Historical or partial evidence is promoted as current | Define joined evidence schema and capture one current canonical record |
| `P1` | `GAP-ORCH-005` | Complete release preflight, registry verification, and forward-fix evidence | Root release orchestration, npm registry verification, and manual recovery boundary | `ORCH-REL-001`, `ORCH-REL-004`, `ORCH-REL-005` | `relgeo/workspace` release owner + package/consumer owners | GAP-ORCH-001/003/004; clean tree; Node 24; npm registry/network; release record | Valid preflight stops before publish on unsafe state; ordered package verification reads registry versions; controlled partial-release fixture proves stop/record/newer forward-fix/no republish; evidence is retained | Release operator can publish unverified or recover by unsafe republish/rollback assumption | Run read-only preflight and registry probe first; then exercise recovery fixture |
| `P1` | `GAP-ORCH-006` | Add structured blocker ownership and explicit decision checkpoints | Root reports, dependency propagation, and maintainer decision boundary | `ORCH-OPS-001`, `ORCH-OPS-002`, `ORCH-OPS-005` | `relgeo/workspace` + stage owners | Shared report schema; dependency graph; maintainer decision record | Every failed stage emits owner, repository/surface, command, blocker class, dependency impact, remediation, and decision-required flag; downstream status identifies blocked vs ready work; scope/release promotion pauses until explicit decision | Generic failures or inferred scope create wrong work and unsafe promotion | Shared blocker/report fields and fixture coverage now pass; central human-decision enforcement remains open |
| `P1` | `GAP-ORCH-007` | Implement bounded retry and evidence-preserving rerun policy | Root/CI retry controller and durable report retention | `ORCH-OPS-003` | `relgeo/workspace` + CI owners | GAP-ORCH-006 blocker taxonomy; retry budget; durable report/artifact retention | Transient classifier permits at most the configured attempts with bounded backoff; deterministic contract failures do not auto-retry; first failure and all attempts remain linked; rerun is idempotent and reports environment-unavailable distinctly | Retry storm, hidden deterministic failure, or overwritten evidence | Source and focused fixture now pass; verify attempt retention in supported CI |
| `P1` | `GAP-ORCH-008` | Close sync-workflow credential persistence and permission boundary | Root sync workflow checkout, token handling, and GitHub Actions permissions | `ORCH-PUB-003` | `relgeo/workspace` + CI owners | GitHub workflow permission review; PR/dispatch behavior | Sync checkout explicitly disables credential persistence where appropriate; workflow permissions are minimal for PR/dispatch; a static policy check prevents regression; real sync PR remains reviewable | Persisted credentials or excess write scope expands public CI risk | Static policy now passes; review a provider-side sync PR/dispatch later |

## Coverage check

| Check | Result |
| --- | --- |
| Matrix unresolved `🌗` capability rows | 15 |
| Backlog capability IDs covered (including selected closure trace) | 19 |
| Capability IDs missing from backlog | 0 |
| Backlog-only capability IDs | 0 |
| Candidate rows | 8 |
| Priority distribution | 3 `P0`, 5 `P1` |
| Implementation claimed closed by this document | No; closure evidence is recorded in the audit/reconciliation, while grouped goals remain open where any member capability is unresolved |

No absent capability remains in the current matrix. `ORCH-OPS-003` is promoted
to `✔️` only because its source implementation and focused fixture evidence are
recorded; grouped candidate goals do not promote their remaining `🌗` members.

Coverage limitations and unresolved questions are maintained in the [coverage
validation and handoff](./coverage-validation-handoff.md).

## Evidence and ownership sources

- Workspace root `relgeo/workspace` — root scripts, workflows, manifests, and
  child-repository boundary that own the candidate implementation work.
- [Maturation master plan](../../MATURATION-MASTER-PLAN.md) — roadmap priority,
  exit gates, evidence rules, and accepted deferrals.
- [Repository map](../../REPOSITORY-MAP.md) — owner and source-of-truth boundary
  for workspace, child repositories, consumers, and CI.
- [Expected catalog](./expected-capability-catalog.md),
  [implementation audit](./implementation-audit.md),
  and [status matrix](./status-matrix.md) — the
  requirement, observation, and status inputs from which this backlog is
  derived.
