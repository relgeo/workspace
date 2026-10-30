# Cross-repository orchestration capability matrix

> **Coverage statement — 2026-10-29.** This matrix covers workspace ownership,
> submodule pointers, manifests/baselines, fixtures, dependency/release order,
> root scripts, child workflows, synchronization, and public delivery gates.
> Discovery used `REPOSITORY-MAP.md`, `.gitmodules`, source manifests, scripts,
> workflows, plans, and available local evidence. It does not claim current
> child CI, registry, network, or public deployment parity; those remain `not
> verified` where stated. A missing row is not evidence of absence.
> See [inventory protocol](../../INVENTORY-PROTOCOL.md) for status axes and evidence tiers.

## Matrix metadata

| Field | Value |
|---|---|
| Surface | `relgeo/workspace` cross-repository orchestration |
| Audit owner | `relgeo/workspace` for orchestration; child owners retain implementation ownership |
| Audit date | 2026-10-29 |
| Source of truth | `.gitmodules`, `docs/REPOSITORY-MAP.md`, baseline/compatibility/fixture manifests, `scripts/`, `.github/workflows/`, plan 01 |
| Verification boundary | Local root checks were run where possible. Node 24 integration, npm registry, GitHub API/Actions, child CI dispatch, and public deployment were not verified in this environment. |

## Status legend

| Status | Meaning |
|---|---|
| ✔️ | Implemented and directly evidenced for the bounded capability. |
| 🌗 | Implemented and partly evidenced; one or more execution boundaries remain unverified. |
| ❌ | Expected capability is absent at the audited boundary. |
| ➖ | Deliberately outside workspace responsibility or not needed for this surface. |
| ⏸️ | Intentionally held pending an explicit decision, promotion, or external evidence. |
| ⚠️ | Confirmed mismatch, stale provenance, or an actionable orchestration problem. |

`Not verified` is an evidence qualifier, not a separate status symbol. It is
used whenever a check was not executed or requires Node 24, network, CI, or a
fresh public artifact.

## Capability matrix

| Capability | Status | Evidence | Gap / limitation | Consumer | Dependency | Next action |
|---|---:|---|---|---|---|---|
| Register every child repository and owner boundary | ✔️ | `.gitmodules`; `docs/REPOSITORY-MAP.md` | Root does not own child source changes. | All submodules and maintainers | Git submodules | Keep map synchronized when adding/removing a surface. |
| Define a dependency/release order | ✔️ | `docs/compatibility-matrix.json` `releaseOrder`; plan 01 graph | Order is policy and validation order, not an automatically resolved full graph. | TS packages, Playground, website | Spec and package metadata | Keep order reviewable when a dependency changes. |
| Maintain machine-readable baseline revisions | ⚠️ | `docs/integration-baseline.json`; `verify-baseline --strict` failed 3 entries | `playground`, `flutter`, and `mcp` manifest revisions lag current gitlinks. | CI, release, synchronization workflow | Exact child SHA and reviewed PR | Validate child CI, update gitlinks and baseline together, then rerun strict gate. |
| Detect gitlink/checkout/manifest drift | ✔️ | `scripts/verify-baseline.mjs`; current run identified all 3 mismatches | Current checkout is not baseline-clean until stale entries are reconciled. | Root maintainers and CI | Git metadata | Treat strict failure as a release blocker for dependent gates. |
| Reject a mutated baseline revision | ✔️ | `scripts/test-baseline-failure.mjs` PASS | Negative-path test does not repair real drift. | CI maintainers | Temporary manifest | Keep failure injection in the root gate. |
| Enforce compatibility line and package metadata | ✔️ | `scripts/check-compatibility.mjs --json` PASS `283/283` | Internal coherence does not prove registry/public runtime. | Package consumers and release | Package JSON, READMEs, baseline, Flutter matrix | Rerun after every pointer, version, or dependency change. |
| Run shared fixture conformance across surfaces | ✔️ | `fixtures/manifest.json`; `run-conformance-fixtures.mjs` PASS `260/260` across 20 fixtures | Current run used local checkout/toolchain; Node 24 canonical environment not verified. | Core, renderer, language service, Markdown, CLI | Installed local package outputs and fixture snapshots | Repeat under Node 24 in integration CI. |
| Preserve active/legacy/invalid/runtime/candidate fixture semantics | ✔️ | Fixture status policy and 20-entry manifest | Candidate capabilities are evidence, not active contract support. | All fixture consumers | Promotion decision and snapshots | Promote only with an explicit decision and downstream evidence. |
| Execute local workspace integration gate | 🌗 | `scripts/run-integration-gate.mjs`; documented local mode | Current run stopped before stages because Node `22.23.2` is below required Node 24; full current local result not verified. | Workspace CI and maintainers | Node 24, pnpm 10.33.3, initialized submodules | Run `pnpm run integration:gate -- --local` on Node 24 after baseline sync. |
| Execute isolated public-registry gate | 🌗 | Public mode copies temporary consumers, pins registry versions, runs pack checks | Current npm/network execution not verified. | Published package consumers | npm registry, Node 24, pnpm, package availability | Run public gate after local gate and record JSON artifact. |
| Assemble Playground into website Pages artifact | 🌗 | Runner copies Playground `dist`; website workflow has same assembly step | Standalone website build cannot prove combined artifact; current combined gate not rerun. | `relgeo.github.io` Pages artifact | Playground build and website artifact assertion | Run combined gate and inspect artifact report. |
| Run package/consumer CI with separate Flutter jobs | ✔️ | `.github/workflows/integration.yml` defines `verify`, `public`, Flutter platform jobs | Current workflow run is not freshly verified here. | GitHub Actions maintainers | Node/pnpm/Flutter setup actions and child pointers | Re-run on synchronized baseline and retain reports. |
| Synchronize validated child CI into root | ✔️ | `.github/workflows/sync-validated-submodule-after-ci.yml` | Current repository-dispatch/API path not exercised. | Flutter, Playground, MCP, workspace | Child successful `push/main` run, exact SHA, GitHub API permissions | Validate a real dispatch or retain as not verified until next child CI. |
| Uniform validated-child synchronization for every submodule | ❌ | Sync workflow allowlist contains only `flutter`, `playground`, and `mcp`. | Package/spec/website submodules do not use the same child-dispatch synchronization path; root Integration remains the broader guard. | All child repositories | Child CI event contracts and workflow allowlist | Decide whether package/spec child CI should emit the same validated event or remain root-gated. |
| Keep root changes reviewable through a synchronization PR | ✔️ | Sync workflow stages exact SHA, regenerates baseline, opens PR, dispatches Integration | Requires GitHub token/branch protection and external workflow execution. | Workspace `main` | GitHub Actions permissions and protection rules | Confirm secrets/protection in repository settings. |
| Validate release decision record | ✔️ | `scripts/check-release-record.mjs --json` PASS `35/35` for `0.5.0` | Validates historical record, not a new release. | Release maintainers | Compatibility matrix and release JSON | Re-run for each release record. |
| Run release preflight as one fail-fast gate | 🌗 | `scripts/run-release-preflight.mjs` composes clean tree, baseline, compatibility, record, tarball, integration | Current preflight intentionally not claimed: audit artifacts make root dirty and baseline is stale. | Release pipeline | Clean root, Node 24, registry/package gates | Run from a clean reviewed checkout after synchronization. |
| Record pack hygiene and public package boundary | 🌗 | Public runner implements `npm pack --dry-run --json` checks | Current public package execution not verified. | Published TS packages | npm pack and package manifests | Run public gate and retain report. |
| Handle expected failures and deferred capabilities explicitly | ✔️ | Fixture statuses, stage reports, release partial policy, plan 01 | Evidence states still need human review when a historical claim conflicts with current pointers. | Maintainers and reviewers | Reports and decision records | Keep `not verified`, `⚠️`, and `⏸️` visible in release summaries. |
| Root directly modifies child implementations | ➖ | Ownership map and temporary-copy/public-gate design | Deliberately outside root responsibility. | Child repositories | Child owner workflow | Make changes in the owning child repository. |
| Current public CI/registry/Pages deployment is verified | ⏸️ | Historical references exist in plan 01, but no current external run was queried | Fresh evidence is required before marking current orchestration fully green. | Public users and release maintainers | GitHub Actions, npm, Pages | Run current Node 24 local/public/CI and public smoke sequence. |

## Priority and dependency order

1. Reconcile `playground`, `flutter`, and `mcp` pointers against validated child
   CI and regenerate `docs/integration-baseline.json` through a reviewed PR.
2. Re-run strict baseline, compatibility, shared conformance, and the full local
   gate on Node 24/pnpm 10.33.3.
3. Run the isolated public-registry gate, including package pack boundaries and
   combined Playground/Pages artifact assembly.
4. Re-run CI synchronization and retain the Integration/Flutter reports and
   artifacts for the exact root revision.
5. Run public website smoke after deployment; only then promote current
   orchestration statuses from partial/held to verified.
