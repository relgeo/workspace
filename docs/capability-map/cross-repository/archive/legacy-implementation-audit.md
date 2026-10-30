# Cross-repository orchestration implementation audit

> **Audit coverage statement — 2026-10-29.** This evidence log inspects
> `.gitmodules`, `REPOSITORY-MAP.md`, manifests/baselines, shared fixtures,
> root scripts, child workflows, synchronization, release plans, and available
> local evidence. It does not claim current child CI, registry, network, or
> public deployment parity; those remain `not verified` where stated. See
> [inventory protocol](../../INVENTORY-PROTOCOL.md); missing rows are not proof of
> absent orchestration.

## Audit metadata

| Field | Value |
|---|---|
| Surface | `relgeo/workspace` orchestration across all RelGeo submodules and consumers |
| Audit date | 2026-10-29 |
| Owner boundary | Workspace owns submodule pointers, shared fixtures, manifests, gates, reports, and synchronization workflow; each child repository owns its implementation and child CI. |
| Source paths | `.gitmodules`, `docs/REPOSITORY-MAP.md`, `docs/integration-baseline.json`, `docs/compatibility-matrix.json`, `fixtures/manifest.json`, `scripts/`, `.github/workflows/`, `docs/plans/01-cross-repo-integration-gate.md` |
| Intended consumers | Maintainers of spec, TypeScript packages, Flutter, Playground, website, MCP, CI, and release operations |
| Verification boundary | Root scripts and local checkout were inspected and selected read-only checks were executed. Current GitHub Actions, npm registry, public Pages, child CI dispatches, and a Node 24 full integration run were not re-executed in this audit. |

## Ownership and dependency graph

`.gitmodules` registers 12 child repositories. `docs/REPOSITORY-MAP.md` assigns
ownership to each child and keeps `docs/` and `scripts/` under
`relgeo/workspace`. The documented dependency order is spec → geometry → core →
renderer/language-service → Markdown/CLI → Playground/website, with Flutter and
MCP as separately gated consumers. The graph is an orchestration order, not
proof that every package imports every predecessor.

The source-of-truth rule is implemented and explicit: child changes happen in
the child repository; the root records a gitlink only after the child baseline
is verified. Shared fixtures remain workspace-owned and are not published as a
new package surface.

## Implementation findings

| Area | Actual implementation inspected | Evidence | Boundary / finding |
|---|---|---|---|
| Submodule ownership | `.gitmodules` maps all 12 paths to `relgeo/*` repositories and tracks `main`. | `.gitmodules`; `docs/REPOSITORY-MAP.md` | Ownership and path boundaries are explicit. Child source is not owned by the root. |
| Source-of-truth policy | Repository map requires child-repository edits and root pointer updates only after verification. | `docs/REPOSITORY-MAP.md` | Documented governance rule; enforcement is through review/workflow, not a filesystem lock. |
| Baseline manifest | Machine-readable snapshot records revision and package metadata for all 12 submodules. | `docs/integration-baseline.json`; `scripts/verify-baseline.mjs` | Manifest is structurally complete, but three revisions are stale relative to current gitlinks. |
| Strict baseline verifier | Verifies registration, manifest↔gitlink, checkout↔gitlink, clean child worktrees, package metadata, license, and compatibility line. | `scripts/verify-baseline.mjs`; current JSON run | Implemented and diagnostic. Current run failed only the three stale manifest revisions: `playground`, `flutter`, `mcp`. |
| Baseline failure injection | Mutates a temporary manifest and requires an actionable revision mismatch. | `scripts/test-baseline-failure.mjs`; current run PASS | Negative-path guard is directly verified. It does not repair the real manifest. |
| Compatibility contract | Checker compares matrix, baseline, package metadata, READMEs, internal dependency ranges, release order, Flutter matrix, and source paths. | `docs/compatibility-matrix.json`; `scripts/check-compatibility.mjs` | Current run PASS `283/283`; this does not imply all pinned child revisions are current. |
| Shared fixture authority | Manifest defines active, legacy, invalid, runtime-diagnostic, runtime-error, and capability statuses, with workspace as canonical owner. | `fixtures/manifest.json`; `scripts/run-conformance-fixtures.mjs` | Fixture taxonomy separates promoted contract coverage from candidates. |
| Shared conformance | Root runner exercises parse/resolve, SVG, language service, highlighting, Markdown preview, CLI, diagnostics, and runtime errors. | `scripts/run-conformance-fixtures.mjs`; current run PASS `260/260` across 20 fixtures | Strong cross-surface evidence for this local checkout; not a substitute for child CI or public-registry testing. |
| Local integration gate | Runs strict baseline, failure injection, frozen install, package/consumer stages, Pages artifact assembly, and shared conformance. | `scripts/run-integration-gate.mjs`; `scripts/README.md` | Implemented, but current execution is not verified: it exits before stages because local Node is `22.23.2` and the gate requires Node 24+. |
| Public-registry gate | Copies packages/consumers to temporary checkouts, installs from npm, pins `@relgeo/*` to baseline versions, runs pack hygiene, and assembles Playground into website. | `scripts/run-integration-gate.mjs`; `scripts/README.md` | Implemented. Current registry/network execution was not run; no current public-registry result is claimed. |
| CI orchestration | Separate `verify`, `public`, `flutter`, `flutter-macos`, `flutter-linux`, and `flutter-windows` jobs use explicit Node/pnpm/Flutter versions, timeouts, concurrency, reports, and read-only checkout. | `.github/workflows/integration.yml` | Workflow contract is present. Historical run references in plan 01 were not independently revalidated during this audit. |
| Validated child synchronization | Dispatch workflow allowlists `flutter`, `playground`, `mcp`; verifies exact SHA, repository, branch, workflow, run conclusion, then opens a PR and reruns Integration. | `.github/workflows/sync-validated-submodule-after-ci.yml` | Strong anti-drift design. Current dispatch/API path was not exercised. |
| Release decision record | Machine-readable release record validator checks contract, package plan, consumer state, evidence, and release order. | `scripts/check-release-record.mjs`; current run PASS `35/35` for `0.5.0` | Record validation is green; it does not prove a new release or current baseline is ready. |
| Release preflight | Combines clean root, strict baseline, compatibility, completed release record, tarball audit, and local integration. | `scripts/run-release-preflight.mjs`; `scripts/README.md` | Implemented as a fail-fast gate. Current preflight was not run because the audit workspace contains untracked artifacts and the baseline is stale. |
| Failure/deferred handling | Scripts emit stage-level pass/fail, JSON reports, explicit skipped/not-run states, and fixture statuses for candidates and expected failures. | `scripts/`, `fixtures/manifest.json`, plan 01 | Operational handling exists; a failed prerequisite only gates dependent stages. |
| Promotion policy | Candidate fixture 16 remains `capability`; fixture 15 is active. Release/promotion is separated from baseline conformance. | `fixtures/manifest.json`; `docs/compatibility-matrix.json`; plan 01 | Candidate promotion is intentionally held for a decision/evidence boundary, not silently treated as active support. |
| Direct child mutation by root | No root script edits child source; public gate uses temporary copies and sync uses a PR. | `scripts/run-integration-gate.mjs`; sync workflow | Deliberately not needed; child implementation remains outside root ownership. |

## Current checkout versus recorded baseline

| Path | Current gitlink / checkout | Manifest revision | Result |
|---|---|---|---|
| `playground` | `59a42ae925cf0c21541bc19ccac39f5061b35439` | `c0de7b0eec38a436f52893404fa420051e3d34e6` | mismatch; clean checkout |
| `flutter` | `b21eceb258070133f32fd822b6fd23a4f21b0bbf` | `f39a913708e28625125ee8b64ccb350250db1d5d` | mismatch; clean checkout |
| `mcp` | `e225919e8d35f88f968c7ac75c748055447c2c38` | `48821c47f211fcce29013355803aa271e63a7b47` | mismatch; clean checkout |
| all other submodules | current pointer equals manifest | current pointer equals manifest | pass in strict verifier |

This is a provenance inconsistency, not evidence that the child implementations
are broken. The safe remediation is to validate the exact child SHAs and update
the root gitlinks plus baseline through the synchronization workflow or an
equivalent reviewed PR. `--write` must not be used merely to hide an unverified
child revision.

## Executed verification

| Check | Result | Interpretation |
|---|---|---|
| `node scripts/verify-baseline.mjs --strict --json` | FAIL: 3 manifest revision mismatches | Baseline guard correctly detects stale `playground`, `flutter`, and `mcp` entries; all child worktrees were clean. |
| `node scripts/test-baseline-failure.mjs` | PASS | Failure injection remains actionable. |
| `node scripts/check-compatibility.mjs --json` | PASS `283/283` | Matrix and package/consumer contract are internally coherent. |
| `node scripts/run-conformance-fixtures.mjs` | PASS `260/260`, 20 fixtures | Shared local fixture behavior is verified across the available TypeScript surfaces. |
| `node scripts/run-integration-gate.mjs --local` | NOT VERIFIED / environment unavailable | Gate requires Node 24; current process is Node 22.23.2 and exits before package stages. |
| `node scripts/check-release-record.mjs --json` | PASS `35/35` | Historical `0.5.0` release record is structurally valid. |
| Current GitHub Actions / npm registry / public deployment | NOT VERIFIED | No network or external CI execution was performed in this audit. |

## Audit limits

- Historical plan and CI URLs are evidence of intended or prior execution, not
  fresh current-run proof; they are cited as historical only.
- Local conformance passing does not verify Node 24, frozen installs, npm pack
  boundaries, isolated public consumers, browser E2E, Flutter desktop builds,
  or current Pages deployment.
- The current root contains untracked audit artifacts under
  `docs/capability-map/`; release preflight's clean-tree requirement therefore
  was not used as a current pass/fail claim.
