# Cross-Repository Orchestration — Implementation Gap Backlog

> Current evidence checkpoint (2026-11-05): candidate tasks below retain the implementation gaps, while the dated 2026-10-30 root-gate evidence is historical. Current root contract/conformance evidence is available (`298/298` fixtures); child gitlinks are observable but child worktrees contain local modifications and 11 of 12 integration-manifest pins are stale. This host has pnpm 10.33.3 but Node 22.23.2, below the declared Node 24+ gate, so full runtime claims remain environment-unavailable.

**Status:** candidate backlog; selected implementation outcomes are recorded here,
but this document does not substitute for source/tests/audit evidence

**Tanggal:** 2026-11-05

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

## Triage P0/P1 — 2026-11-05

Triage ini adalah keputusan intake untuk task `Triage remaining Cross-Repository
Orchestration gaps`. Status pada kolom **status awal** disalin dari status
matrix/reconciliation saat triage; status tersebut bukan klaim bahwa gap sudah
ditutup. `Implementation-closable` berarti perubahan source/workflow/test pada
boundary yang dimiliki workspace dapat dikerjakan dan diverifikasi di checkout
lokal tanpa npm/pub.dev release, production deployment, browser/public smoke,
provider dispatch, writable Flutter host, atau keputusan scope baru.

### Dipilih untuk implementation sekarang

Hanya dua row yang memiliki residual behavior yang dapat ditutup lewat perubahan
lokal. Keduanya memiliki owner, source of truth, dan acceptance test eksplisit;
candidate-task table di bawah tetap menjadi register dependency dan next action.

| Expected ID / candidate | Priority | Status awal | Owner | Source of truth | Acceptance test / evidence target |
| --- | --- | --- | --- | --- | --- |
| `ORCH-BOOT-004` / `GAP-ORCH-001` boundary-scan slice | `P0` | `🌗` partial | `relgeo/workspace` + CI/artifact owners | Catalog row `ORCH-BOOT-004`; `scripts/bootstrap.mjs`; public pack/report boundary in `scripts/run-integration-gate.mjs`; `scripts/test-bootstrap-and-evidence-contract.mjs` | A public-boundary scanner/contract test enumerates the tracked/generated report and artifact surfaces, rejects credentials, `.env` material, absolute/private paths, and unsafe archive entries, and passes a clean fixture without operator-specific paths. |
| `ORCH-OPS-005` / `GAP-ORCH-006` decision-gate slice | `P1` | `🌗` partial | `relgeo/workspace` + stage/release owners | Catalog row `ORCH-OPS-005`; `scripts/orchestration-contract.mjs`; `docs/decisions/07-cross-repo-open-decisions.md`; `docs/plans/03-npm-release-guard.md` | A local gate requires an explicit decision record for scope, release promotion, and deferred-platform changes; missing/pending decisions stop with `decisionRequired`, while an approved decision is auditable in the report. |

### Dipisahkan dari implementation sekarang

Rows berikut tetap P0/P1 dan tetap memiliki owner, source of truth, acceptance
target, dan next action, tetapi residualnya adalah evidence eksternal,
environment-unavailable, atau release/provider observation. Mereka tidak menjadi
blocker untuk dua implementation-closable rows di atas.

| Expected ID / candidate | Priority | Status awal | Classification | Owner / source of truth | Evidence atau next action |
| --- | --- | --- | --- | --- | --- |
| `ORCH-BOOT-001` / `GAP-ORCH-001` | `P0` | `🌗` unverified-environment | **external-evidence** — bootstrap implementation dan contract fixture sudah ada | `relgeo/workspace`; `scripts/bootstrap.mjs`, `scripts/README.md`, catalog/status/reconciliation rows | Jalankan clean-clone probe pada Node 24/pnpm dengan recursive submodules dan frozen install; rekam commands, revisions, dan limitations. |
| `ORCH-BOOT-002` / `GAP-ORCH-001` | `P0` | `🌗` unverified-environment | **external-evidence** — prerequisite toolchain belum tersedia pada host ini | `relgeo/workspace`; `.node-version`, `package.json`, `scripts/bootstrap.mjs`, Integration workflow | Verifikasi deterministic install dan prerequisite report pada Node 24/pnpm; Node 22 lokal bukan target failure. |
| `ORCH-BASE-002` / `GAP-ORCH-002` | `🌗` partial-current | **external-evidence** — strict verifier dan failure injection sudah diimplementasikan; baseline/pointer saat ini perlu sync tervalidasi | `relgeo/workspace` + child CI owners; `scripts/verify-baseline.mjs`, `scripts/test-baseline-failure.mjs`, `docs/integration-baseline.json` | Dapatkan child-CI metadata, gunakan reviewable exact-SHA sync, lalu rerun strict baseline pada clean checkout dan supported toolchain. |
| `ORCH-BASE-004` / `GAP-ORCH-002` | `🌗` partial-current | **external-evidence** — TypeScript fixture orchestration tersedia; Flutter host evidence belum tersedia | `relgeo/workspace` + child owners; `scripts/run-conformance-fixtures.mjs`, `scripts/run-flutter-conformance.mjs`, fixture manifest | Jalankan TypeScript dan Flutter conformance pada baseline yang sama di host dengan Flutter SDK writable; pertahankan fixture status semantics dan limitation fields. |
| `ORCH-GATE-002` / `GAP-ORCH-003` | `🌗` unverified-runtime | **external-evidence** — local runner ada, tetapi host Node 24 gate menghentikan stage | `relgeo/workspace` + package owners; `scripts/run-integration-gate.mjs`, package scripts | Jalankan dependency-order local gate pada Node 24 dan simpan report/artifact dengan owner, command, blocker, dan dependency status. |
| `ORCH-GATE-003` / `GAP-ORCH-003` | `🌗` unverified-runtime | **external-evidence** — public-registry boundary membutuhkan network/registry/browser | `relgeo/workspace` + package/consumer owners; public mode in `scripts/run-integration-gate.mjs` and Integration workflow | Jalankan isolated temporary checkout dari registry tanpa sibling source; validasi install, consumer, artifact, dan failure diagnostics. |
| `ORCH-EVID-002` / `GAP-ORCH-004` | `🌗` partial-current | **external-evidence** — class separation sudah ada; current canonical run belum ada | `relgeo/workspace`; `scripts/orchestration-contract.mjs`, `scripts/join-integration-evidence.mjs` | Capture current local/public/CI/manual/deployment record with explicit evidence class/state; historical record must remain ineligible for current claim. |
| `ORCH-EVID-003` / `GAP-ORCH-004` | `🌗` partial-current | **external-evidence** — envelope sudah mengikat revision/baseline; pointer drift belum direkonsiliasi | `relgeo/workspace` + child CI; `docs/integration-baseline.json`, `scripts/join-integration-evidence.mjs` | Join exact root/child revisions, baseline, toolchain, run, artifact, and limitations after validated pointer sync; reject mismatch rather than promote stale evidence. |
| `ORCH-EVID-004` / `GAP-ORCH-004` | `🌗` unverified-runtime | **external-evidence** — deployment URL, artifact service, and public smoke are outside local implementation boundary | `relgeo/workspace` + website/consumer owners; evidence joiner and deployment/public-smoke contract | Capture one joined post-deploy record containing artifact identity/digest, URL, exact baseline, smoke result, evidence class, and limitations. |
| `ORCH-REL-001` / `GAP-ORCH-005` | `🌗` unverified-environment | **external-evidence** — preflight implementation exists; supported release host unavailable | release owner + `relgeo/workspace`; `scripts/run-release-preflight.mjs`, release guard plan | Run read-only preflight on clean Node 24 tree and prove unsafe state stops before publish; no publish is part of this task. |
| `ORCH-REL-004` / `GAP-ORCH-005` | `🌗` unverified-runtime | **external-evidence** — registry and public consumer verification require network/release environment | release + consumer owners; `scripts/run-release-verify-published.mjs`, release guard plan | Verify ordered published versions and a clean public consumer on a network-capable Node 24 host; interrupted probe remains unverified. |
| `ORCH-REL-005` / `GAP-ORCH-005` | `🌗` partial-current | **external-evidence** — recovery fixture is implemented; no real partial release may be created locally | release owner; `scripts/run-release-recovery-plan.mjs`, `scripts/test-release-record-failure.mjs` | Retain the passing controlled failure-injection evidence; observe a real partial-release forward-fix only in an approved release environment, never by republish/rollback assumption. |
| `ORCH-PUB-002` / `GAP-ORCH-003` | `🌗` unverified-runtime | **external-evidence** — isolated public consumer proof requires registry/network/browser | `relgeo/workspace` + consumer owners; public integration runner and consumer artifact checks | Run public consumer gate with sibling source unavailable and record package/artifact provenance; do not infer public parity from local tests. |

### Triage accounting

| Check | Result |
| --- | ---: |
| Unresolved P0/P1 rows reviewed | 15 (P0: 8, P1: 7) |
| Selected for implementation now | 2 |
| External-evidence / environment-only follow-ups | 13 |
| Selected rows with owner, source of truth, acceptance target, and initial status | 2/2 |
| Reviewed rows with owner, source of truth, acceptance target, and initial status | 15/15 |

Rows already `✔️` (`ORCH-OPS-001`, `ORCH-OPS-002`, `ORCH-OPS-003`, and
`ORCH-PUB-003`) remain closure/regression traceability only; they are not
reopened as duplicate implementation gaps. `➖`/`⏸️` scope boundaries and any
future mobile/raw-SVG/automatic-publish decision remain outside this triage.

This triage does not promote any status symbol. The status matrix and
reconciliation remain authoritative for capability state; this section is the
canonical intake boundary for the next contract and implementation tasks.

## Contract lock and acceptance matrix — 2026-11-05

Kontrak ini diturunkan dari row reconciliation `ORCH-BOOT-004` dan
`ORCH-OPS-005`, lalu dibatasi oleh [compatibility matrix](../../compatibility-matrix.json)
dan [INVENTORY-PROTOCOL](../INVENTORY-PROTOCOL.md). Ini adalah contract
boundary sebelum implementasi; tidak ada perubahan pada DSL, package API,
transport, atau compatibility line publik yang diotorisasi oleh task ini.

### Compatibility and evidence invariants

| Invariant | Contract yang dikunci | Source of truth |
| --- | --- | --- |
| Language/package compatibility | Active DSL tetap `0.5`; public package family tetap `0.5.x`; internal dependency range tetap `^0.5.0`. Patch-compatible work stays on the same line; breaking language-contract work requires the next compatibility line and an explicit decision record. | [`docs/compatibility-matrix.json`](../../compatibility-matrix.json), `spec/id/` |
| Orchestration boundary | Selected changes are root workspace bootstrap/report/decision-gate behavior. They must not move child ownership, add a runtime dependency to `relgeo_mcp`, or turn manual publish/deployment into automatic scope. | `docs/REPOSITORY-MAP.md`, reconciliation scope decisions, compatibility matrix repository boundaries |
| Evidence separation | Local source/fixture evidence does not become CI/canonical/public evidence by implication. Reports retain `evidenceClass`, `evidenceState`, exact revisions, limitations, and the existing schema version. | [`docs/capability-map/INVENTORY-PROTOCOL.md`](../INVENTORY-PROTOCOL.md), `scripts/orchestration-contract.mjs` |
| Status separation | Implementation, evidence, parity, and scope remain separate axes. Environment/provider absence stays `not verified`/`environment-unavailable`, not `❌` or a parity failure. | [`docs/capability-map/INVENTORY-PROTOCOL.md`](../INVENTORY-PROTOCOL.md), reconciliation §1 |

### Selected gap contracts

| Gap / capability | Contract boundary | Success behavior | Failure / edge behavior | Acceptance test and expected evidence |
| --- | --- | --- | --- | --- |
| `GAP-ORCH-001` slice / `ORCH-BOOT-004` | Root public workspace boundary scanner covers generated reports, package/archive entries, and tracked public artifacts. It emits only public-relative paths and preserves the existing bootstrap/evidence envelope; it does not inspect or publish `.local/`, `private/`, credentials, or operator environment dumps. | A clean public-boundary fixture completes with deterministic relative entries; report/artifact metadata contains no absolute path, secret, `.env` material, private directory, archive traversal, `node_modules`, or `.git` entry. The result remains labeled with its actual evidence class/state and exact revision. | Injected credential-like content, `.env`/key material, absolute or parent-traversal path, private/cache directory, or forbidden archive entry fails closed with non-zero status and an actionable owner/remediation diagnostic. It must not emit a success claim or silently strip the unsafe entry. Missing scanner input is `dependency-unavailable`/`environment-unavailable` as appropriate, not a false green result. | Focused clean/negative fixtures are implemented in `scripts/test-public-boundary-contract.mjs`; run `pnpm run public-boundary:contract:test` and `pnpm run bootstrap:contract:test`. Expected evidence: local `E2` fixture result with exact command, root revision, and limitation fields; CI/public scan remains a separate follow-up. |
| `GAP-ORCH-006` slice / `ORCH-OPS-005` | Root orchestration and release-promotion gates reuse the existing blocker taxonomy and report fields. A scope change, contract promotion, deferred-platform reopening, or release automation decision is an explicit maintainer decision boundary; no inferred approval is allowed. | When the required decision is present and approved, the stage may proceed and the report preserves `decisionRequired: false`, `decisionNeeded: false`, dependency status, owner, remediation, and evidence metadata. Ordinary non-decision failures keep their existing classification and bounded retry behavior. | Missing or pending approval stops before promotion with `blockerClass: pending-human-decision`, `retryable: false`, `decisionRequired: true`, and `decisionNeeded: true`; dependent work is `blocked`/`not-run` as applicable. A rejected or stale decision cannot be treated as approval. The gate must not auto-publish, auto-deploy, reopen mobile scope, or change compatibility line. | The approved/pending/rejected/stale fixture is implemented in `scripts/test-orchestration-contract.mjs`; run `pnpm run orchestration:contract:test`. Expected evidence: local `E2` report showing the exact blocker fields and dependency impact; any provider/release observation remains external evidence. |

These acceptance rules are intentionally stricter than a documentation-only
claim but narrower than a public release contract. Implementation may add local
tests or internal helpers, but any new public field, package behavior, DSL
version, or transport behavior must first update its normative source of truth
and compatibility decision before implementation proceeds.

## Frozen schema for the active bootstrap/baseline/evidence tranche

The following fields are the review contract for `ORCH-BOOT-001`,
`ORCH-BOOT-002`, `ORCH-BOOT-004`, `ORCH-BASE-002`, `ORCH-BASE-004`, and
`ORCH-EVID-002`/`003`/`004`:

| Record | Required fields | Rule |
| --- | --- | --- |
| Bootstrap report | `contract`, `outcome`, `requiredToolchain`, `observedToolchain`, `evidence`, `submodules[]`, `steps[]`, `limitations[]` | A fresh clone runs the declared Node/pnpm check, recursive submodule bootstrap, frozen install, and strict baseline report. Submodule state is reported by public relative path and revision only. |
| Baseline snapshot | `schemaVersion`, `contract`, `baselineId`, `baselineName`, `capturedAt`, `rootRevision`, `compatibilityLine`, `toolchain`, `repository`, `evidence`, `submodules[]` | The snapshot is current only when root gitlink and every checked-out child revision were captured together. A changed pointer or checkout makes the older snapshot historical. |
| Evidence envelope | `schemaVersion`, `evidenceClass`, `evidenceState`, `capturedAt`, `workspaceRevision`, `baseline`, `testedRevisions`, `toolchain`, `run`, `artifact`, `command`, `limitations` | `evidenceClass` is never inferred or promoted. A current claim must match exact root/baseline/child revisions; `historical` and `unverified` records remain visible but cannot satisfy a current claim. |

The allowed evidence classes are `local-workspace`, `public-registry`,
`ci-canonical`, `manual`, `public-deployment`, and `baseline-snapshot`.
`evidenceState=current` records the checkout observed at `capturedAt`; it does
not override an environment limitation. Missing Node/pnpm, SDK, network, or
browser capability is `environment-unavailable`/`unverified`, not a target
parity failure. Reports must not contain private paths, credentials, or
machine-specific artifacts.

The implementation surface is [`scripts/bootstrap.mjs`](../../../scripts/bootstrap.mjs),
[`scripts/orchestration-contract.mjs`](../../../scripts/orchestration-contract.mjs),
[`scripts/verify-baseline.mjs`](../../../scripts/verify-baseline.mjs), and
[`docs/integration-baseline.json`](../../integration-baseline.json). This
section freezes the field semantics; it does not claim that the current dirty
checkout or unsupported host has passed the runtime gate.

### Failure ownership and bounded retry fields

All stage failures use the same public-safe diagnostic fields: `owner`,
`repository`, `surface`, `blockerClass`, `remediation`,
`decisionRequired`/`decisionNeeded`, `dependencyImpact`,
`downstreamImpact`, and `dependencyStatus`. A retrying stage additionally
emits `retryPolicy` (`maxAttempts`, `backoffMs`, `attemptsUsed`, `exhausted`),
sanitized `attempts`, stable `attemptLinks`, and immutable `firstFailure`.
Only `transient` failures are retryable; deterministic, dependency,
environment, and pending-human-decision blockers stop immediately. The first
failure remains linked when a later attempt passes, and a new rerun must write
a new evidence/artifact identity rather than overwrite earlier evidence.

These records are diagnostic and cannot promote a failed or environment-
limited gate to a current success claim. Attempt records contain no absolute
temporary path, credential, machine-specific environment dump, or raw process
output.

Integration evidence is joined by
[`scripts/join-integration-evidence.mjs`](../../../scripts/join-integration-evidence.mjs).
The local and public runners record stage command, toolchain, execution
boundary, artifact kind/identity, blocker/limitation, and dependency status;
the joiner adds run and artifact identity and computes
`claim.currentObservationEligible`/`currentClaimEligible`. Historical evidence
is preserved but cannot pass that current-claim check, and revision mismatches
are reported as freshness reasons rather than silently promoted.

## Selected implementation outcomes

The selected tranche has source changes and focused evidence for the following
boundaries. These outcomes do not close grouped backlog goals whose other
capabilities remain unresolved.

| Selected capability | Current status | Evidence | Remaining boundary |
| --- | --- | --- | --- |
| `ORCH-BOOT-004` / `GAP-ORCH-001` | `🌗` (`verified-static`) | `scripts/public-boundary.mjs` is integrated into bootstrap report generation and npm pack inspection; clean/unsafe path and content fixtures pass via `pnpm run public-boundary:contract:test` and `pnpm run bootstrap:contract:test`. | Run the complete artifact/log scan in canonical CI/public evidence; implementation status is not promoted by this local fixture alone. |
| `ORCH-OPS-005` / `GAP-ORCH-006` | `🌗` (`verified-static`) | `evaluateDecisionGate()` centralizes approved/pending/rejected/stale states; release preflight consumes it; `pnpm run orchestration:contract:test` covers approval and fail-closed decision states. | Extend/observe the gate at any provider-side scope/release promotion surface; local source/test evidence does not prove live provider enforcement. |
| `ORCH-OPS-001`, `ORCH-OPS-002` / `GAP-ORCH-006` | `✔️` (`verified-static`) | Shared contract, integration/release/baseline report fields, focused contract test, and structured Node-prerequisite report | `ORCH-OPS-005` live provider propagation and canonical decision observation remain open. |
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
| `P0` | `GAP-ORCH-001` | Make fresh-clone bootstrap and public boundary reproducible | Root bootstrap, submodule, and public-artifact boundary | `ORCH-BOOT-001`, `ORCH-BOOT-002`, `ORCH-BOOT-004` | `relgeo/workspace` | Node 24/pnpm toolchain; recursive submodules; artifact scanner | From a clean clone, bootstrap exits cleanly on declared Node 24/pnpm; strict submodule state is reported; generated reports/artifacts contain no private paths or secrets; probe records commands and limitations | Operator-specific setup or public leakage undermines all downstream evidence | Contract implementation is present; run the clean-clone/canonical artifact scan on a supported host |
| `P0` | `GAP-ORCH-002` | Restore current baseline and cross-surface conformance proof | Root baseline plus validated child-CI and Flutter evidence boundary | `ORCH-BASE-002`, `ORCH-BASE-004` | `relgeo/workspace` + child owners | Validated child CI for current `playground`, `flutter`, `mcp`; Flutter SDK; fixture manifest | Exact child SHA sync updates baseline through reviewable PR; strict baseline passes; TypeScript and Flutter conformance reports name the same baseline and preserve fixture status semantics | Stale pointers or blocked Flutter host produce false parity claims | Reconcile child revisions through the existing validated sync flow, then rerun conformance |
| `P0` | `GAP-ORCH-003` | Execute current local and isolated public integration gates | Root integration runner, package gates, consumer artifacts, and registry boundary | `ORCH-GATE-002`, `ORCH-GATE-003`, `ORCH-PUB-002` | `relgeo/workspace` + package/consumer owners | GAP-ORCH-001; Node 24; registry/network; browser/public consumer services | Local dependency-order gate passes with report; isolated temporary checkout installs from registry without sibling source; public consumer build/test and artifact assertions pass; failures identify stage and command | Local aliases or unsupported runtime hide package/public defects | Run local then public gates on a Node 24/network-capable environment |
| `P1` | `GAP-ORCH-004` | Reconcile current evidence, artifacts, and public smoke | Root evidence schema plus website/deployment handoff | `ORCH-EVID-002`, `ORCH-EVID-003`, `ORCH-EVID-004` | `relgeo/workspace` + website/consumer owners | GAP-ORCH-002/003; exact baseline; deployment URL; artifact service | One machine-readable record joins root/child revisions, toolchain, run, artifact digest/path, deployment URL, public smoke result, evidence class, and limitations; stale evidence is rejected from current claim | Historical or partial evidence is promoted as current | Define joined evidence schema and capture one current canonical record |
| `P1` | `GAP-ORCH-005` | Complete release preflight, registry verification, and forward-fix evidence | Root release orchestration, npm registry verification, and manual recovery boundary | `ORCH-REL-001`, `ORCH-REL-004`, `ORCH-REL-005` | `relgeo/workspace` release owner + package/consumer owners | GAP-ORCH-001/003/004; clean tree; Node 24; npm registry/network; release record | Valid preflight stops before publish on unsafe state; ordered package verification reads registry versions; controlled partial-release fixture proves stop/record/newer forward-fix/no republish; evidence is retained | Release operator can publish unverified or recover by unsafe republish/rollback assumption | Run read-only preflight and registry probe first; then exercise recovery fixture |
| `P1` | `GAP-ORCH-006` | Add structured blocker ownership and explicit decision checkpoints | Root reports, dependency propagation, and maintainer decision boundary | `ORCH-OPS-001`, `ORCH-OPS-002`, `ORCH-OPS-005` | `relgeo/workspace` + stage owners | Shared report schema; dependency graph; maintainer decision record | Every failed stage emits owner, repository/surface, command, blocker class, dependency impact, remediation, and decision-required flag; downstream status identifies blocked vs ready work; scope/release promotion pauses until explicit decision | Generic failures or inferred scope create wrong work and unsafe promotion | Decision gate implementation and focused fixtures pass; observe provider/canonical promotion enforcement later |
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
