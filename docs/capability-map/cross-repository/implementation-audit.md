# Cross-Repository Orchestration Implementation and Evidence Audit

**Status:** audit evidence diterbitkan; gap map per `ORCH-*` tersedia

**Tanggal audit:** 2026-10-30

**Expected catalog:** [Cross-Repository Orchestration Expected Capability Catalog](./expected-capability-catalog.md)

**Reconciliation:** [Expected-versus-Observed Cross-Repository Orchestration Reconciliation](./reconciliation.md)

**Status matrix:** [Cross-Repository Orchestration Capability Status Matrix](./status-matrix.md)

**Implementation-gap backlog:** [Cross-Repository Orchestration Implementation Gap Backlog](./implementation-gap-backlog.md)

**Bounded selection:** [Cross-Repository Orchestration bounded in-scope selection](./in-scope-selection.md)

**Audit boundary:** root workspace, 12 submodule registrations/checkouts,
root/child GitHub Actions workflows, manifests, package/consumer command
surfaces, integration/conformance/release scripts, docs, fixtures, dan
observed read-only execution pada checkout saat ini.

## 1. Cara membaca hasil

Audit ini memakai 39 ID dari expected catalog tanpa menambah, menghapus, atau
mengganti expected row. `implementation status` menjawab apakah behavior,
policy, workflow, atau documentation boundary ditemukan. `verification status`
menjawab apakah evidence yang tepat tersedia pada revision/environment yang
diaudit.

Status implementation:

| Status | Arti |
| --- | --- |
| `implemented` | Behavior/policy/workflow ditemukan pada source dan/atau observasi yang relevan. Tidak otomatis berarti current baseline hijau. |
| `partial` | Sebagian boundary ada, tetapi ada gap operasional, missing sub-boundary, stale evidence, atau scope yang belum tertutup. |
| `broken` | Behavior yang diwajibkan memiliki failure reproducible pada target boundary, bukan sekadar service/environment unavailable. |
| `absent` | Tidak ditemukan implementation/policy yang memenuhi expected capability. |
| `deferred` | Secara eksplisit ditunda oleh accepted scope decision. |
| `not-applicable` | Tidak berlaku pada boundary ini dan dibuktikan oleh scope decision. |

Verification status:

| Status | Arti |
| --- | --- |
| `verified-current` | Observasi read-only pada checkout/environment saat audit lulus. |
| `verified-static` | Source/config/docs/fixture ditemukan dan konsisten, tetapi runtime current tidak dijalankan atau bukan syarat capability. |
| `partial-current` | Sebagian observasi lulus dan sebagian gagal/stale. |
| `unverified-environment` | Tidak dapat diverifikasi karena Node/SDK/network/cache/host service; tidak dihitung sebagai target failure. |
| `unverified-runtime` | Implementation terlihat, tetapi runtime/CI/public evidence yang diwajibkan belum tersedia pada scope yang sama. |
| `deferred-scope` | Status mengikuti accepted deferral, bukan failure. |

Tidak ada row `not-applicable` dalam 39 expected IDs: seluruh katalog memang
berada dalam boundary orchestration. Scope yang memang deferred/out dicatat pada
§7 agar tidak disalahartikan sebagai gap implementation aktif.

## 2. Discovery sources dan coverage report

### 2.1 Source inventory diperiksa

| Category | Sources inspected | Coverage result |
| --- | --- | --- |
| Expected baseline | `docs/capability-map/cross-repository/expected-capability-catalog.md` | 39/39 expected IDs joined one-to-one di §5. |
| Master/ownership docs | `docs/MATURATION-MASTER-PLAN.md`, `docs/REPOSITORY-MAP.md` | Boundary, status vocabulary, priority, owner, public-surface rule, dan evidence class tercakup. |
| Integration/release plans | `docs/plans/01-cross-repo-integration-gate.md`, `docs/plans/02-contract-versioning.md`, `docs/plans/03-npm-release-guard.md`, `docs/plans/09-approved-decisions-execution-plan.md` | Bootstrap, dependency graph, local/public gate, dispatch sync, release/recovery, dan accepted scope tercakup. |
| Scope decisions | `docs/decisions/07-cross-repo-open-decisions.md` | Manual npm, forward-fix, Flutter posture, mobile deferral, dan raw-SVG non-goal tercakup. |
| Repository config | `.gitmodules`, root `package.json`, root `pnpm-lock.yaml`, 9 child `package.json`, child lockfiles yang tersedia | 12 submodule registrations, package/consumer commands, engine/package-manager pins, dan lockfile boundary tercakup. |
| Baseline/compatibility manifests | `docs/integration-baseline.json`, `docs/compatibility-matrix.json` | Baseline 12 entries, contract line, release order, package family, non-Node consumer, and policy fields inspected. Matrix dipakai pada audit, bukan sebagai expected-set source. |
| Fixture/conformance | `fixtures/manifest.json`, `fixtures/reference/`, `fixtures/expected/`, `scripts/run-conformance-fixtures.mjs`, `scripts/stage-flutter-fixtures.mjs` | 20 fixture definitions, status policy, expected snapshots, invalid/runtime boundaries, dan cross-surface runner tercakup. |
| Tests and failure-injection | Root `scripts/test-baseline-failure.mjs`, `scripts/test-release-record-failure.mjs`; child suites under `core/src/__tests__/`, `geometry/src/__tests__/`, `renderer-svg/src/__tests__/`, `language-service/src/__tests__/`, `cli/src/__tests__/`, `remark-relgeo/test/`, `remark-relgeo-hl/src/__tests__/`, `playground/src/__tests__/`, `playground/e2e/`, `flutter/test/`, and `mcp/test/` | Direct package, consumer, Flutter, MCP, and failure-injection test surfaces were inventoried. Website has no dedicated test directory in this checkout; its artifact assertion remains the documented verification boundary. |
| Root scripts | `scripts/README.md` dan seluruh 16 script executable (`verify-baseline`, compatibility, conformance, integration, release, recovery, failure injection) | Command surface, exit behavior, report behavior, pack hygiene, recovery policy, dan blocker paths tercakup. |
| CI workflows | `.github/workflows/integration.yml`, `.github/workflows/sync-validated-submodule-after-ci.yml`, child workflows pada `flutter`, `playground`, `mcp` | Root jobs, dispatch payload, exact-run validation, pointer staging, PR flow, toolchain, permissions, timeout/concurrency, and child notifications tercakup. |
| Source/test/runtime surface | Package scripts, runner stage declarations, fixture runner assertions, release validators, and observed commands in §3 | Package lint/build/test/pack, consumer commands, conformance, baseline, release checks, and environment blockers tercakup. |
| UI/menu/shortcut/route | Workspace tidak memiliki UI/menu/shortcut sendiri; downstream Playground/website command/route checks dibaca dari integration plan, package scripts, and public smoke evidence | `not-applicable` untuk workspace UI/shortcut; route/artifact behavior tetap dicakup sebagai consumer gate (`ORCH-GATE-004`, `ORCH-EVID-004`). |
| Config/platform/service | GitHub Actions, npm registry, Node/pnpm, Flutter SDK, Playwright, `WORKSPACE_DISPATCH_TOKEN`, `SUBMODULE_CI_VERIFY_TOKEN`, and platform runners | Pin/permission/service dependency dicatat; current local Node/Flutter/npm cache blockers diuji dan dicatat. |

### 2.2 Coverage conclusion

The requested discovery categories are represented in this audit inventory and
static source coverage exists for all 39 expected IDs. This is bounded coverage
of the enumerated orchestration surfaces, not an exhaustive claim about all
RelGeo product surfaces or all provider/runtime states. Runtime coverage is
mixed by design: the current checkout can verify
compatibility/conformance/release-record behavior, but the integration gate
refuses the local Node version before running stages; Flutter and registry probes
are environment-limited. Historical CI claims are retained as historical
evidence and are not promoted to current checkout evidence. See the [coverage
validation and handoff](./coverage-validation-handoff.md)
for the explicit open boundaries and unresolved questions.

## 3. Observed operational evidence

The following observations were executed or inspected on the current checkout.
Commands were read-only except for temporary files/cache paths outside the
repository where the command itself requires them. No publish, push, deployment,
submodule checkout, or manifest write was performed.

| Ref | Observation | Result | Interpretation |
| --- | --- | --- | --- |
| `OBS-01` | `git rev-parse HEAD`, `git status --short`, `git submodule status --recursive` | Root `1cfa86553d7adb18179c6b3e1a33618a179b1414`; 12 submodules initialized and each checkout matches its current root gitlink. Eleven child working trees are dirty (`relgeo.github.io`, `playground`, `core`, `geometry`, `language-service`, `renderer-svg`, `cli`, `remark-relgeo`, `remark-relgeo-hl`, `flutter`, `mcp`); only `spec` is clean. | Bootstrap checkout exists, but this checkout cannot claim a clean baseline; root and child worktree changes remain outside the audit's implementation ownership. |
| `OBS-02` | `node scripts/verify-baseline.mjs --strict --json` | **Failed 14 checks:** 3 manifest revision mismatches (`playground`, `flutter`, `mcp`) plus 11 dirty child working trees; all checkout-to-gitlink checks passed. | Verifier detects both stale baseline metadata and dirty checkout state; current baseline is not reconciled/clean. |
| `OBS-03` | `node scripts/test-baseline-failure.mjs` | Passed: mutated revision produced actionable mismatch. | Baseline failure injection is implemented and verified. |
| `OBS-04` | `pnpm run compatibility:check -- --json` | Passed `283`, failed `0`; pnpm warned current Node `22.23.2` is below declared `>=24`. | Compatibility rules are working; environment is below gate prerequisite. |
| `OBS-05` | `pnpm run conformance:fixtures` | Passed `260`, failed `0`, across 20 fixtures. | Root TypeScript/CLI/consumer fixture orchestration is current-green; this is not Flutter runtime evidence. |
| `OBS-06` | `node scripts/run-integration-gate.mjs --local --report=/private/tmp/relgeo-orchestration-audit-integration.json` | Exited `2` before stages: requires Node 24+, found `22.23.2`. | Local integration runtime is unverified in this environment; no package failure inferred. |
| `OBS-07` | `node scripts/run-flutter-conformance.mjs --exclude-tags=golden` | `[BLOCKED]` Flutter probe failed writing SDK `engine.stamp` outside workspace (`Operation not permitted`). | Flutter environment unavailable; target Flutter parity not marked broken. |
| `OBS-08` | `pnpm run release:record:check -- --json` | Passed `35`, failed `0` for `docs/releases/0.5.0.json`. | Completed release record schema/policy is verified. |
| `OBS-09` | `pnpm run release:record:failure` | Passed unsafe forward-fix, reordered package plan, and read-only recovery planner injection. | Recovery guard behavior is verified without creating a real partial release. |
| `OBS-10` | `NPM_CONFIG_CACHE=/private/tmp/relgeo-npm-cache pnpm run release:audit -- --json` | Passed `106`, failed `0` for 7 packages. | Tarball/metadata audit verified after isolating the known root-owned npm cache. |
| `OBS-11` | `NPM_CONFIG_CACHE=/private/tmp/relgeo-npm-cache pnpm run release:verify-published -- --json` | No registry result within observation window; command was interrupted after it remained pending. | Registry verification is `unverified-runtime`, not a publish or package failure. |
| `OBS-12` | Child workflow/source inspection | Flutter, Playground, and MCP workflows notify workspace only after successful main CI; root validates exact SHA/run/workflow and opens a sync PR. | Dispatch design is statically implemented; live dispatch/PR was not triggered. |
| `OBS-13` | 2026-10-30 read-only refresh: `node --version`, `node scripts/verify-baseline.mjs --strict --json`, `pnpm run compatibility:check -- --json`, `pnpm run conformance:fixtures` | Node `22.23.2` / pnpm `10.33.3`; strict baseline reports 14 failures (the same 3 stale manifest revisions plus 11 dirty child checkouts); compatibility passes `283/283`; conformance passes `260/260` across 20 fixtures. | Refresh confirms the current checkout snapshot. The Node 24 prerequisite, stale manifest, and dirty worktree findings remain environment/current-state evidence; no target parity failure is inferred. |
| `OBS-14` | `node scripts/test-orchestration-contract.mjs`; `node scripts/run-integration-gate.mjs --local --report=/private/tmp/relgeo-orchestration-contract-integration.json` | Focused contract test passed. The integration runner emitted `integration-gate-v1` JSON with `local-workspace` evidence, root revision, baseline, toolchain, owner/remediation/dependency fields, one `environment-unavailable` Node prerequisite result, and exit `2`. | Shared report taxonomy, bounded retry, evidence envelope, and sync-workflow credential policy are statically/fixture verified; full integration stages remain unverified on this Node 22 host. |
| `OBS-15` | `pnpm run orchestration:contract:test`; `pnpm run compatibility:check -- --json`; `pnpm run conformance:fixtures`; `node scripts/test-baseline-failure.mjs`; `pnpm run release:record:check -- --json`; `pnpm run release:record:failure` | All focused checks passed: orchestration contract, compatibility `283/283`, conformance `260/260` across 20 fixtures, baseline failure injection, release record `35/35`, and release failure injection. | Selected implementation behavior has local/fixture evidence without requiring publishing or deployment. |
| `OBS-16` | `node scripts/run-flutter-conformance.mjs --exclude-tags=golden`; `node scripts/run-integration-gate.mjs --local --report=/private/tmp/relgeo-focused-integration.json` | Flutter probe exited `2` with SDK `engine.stamp` `Operation not permitted`; integration gate exited `2` before stages because host Node is `22.23.2` and the repository requires Node `24+`. Both reports are classified as environment-unavailable/not verified. | Missing host/toolchain capability blocks only dependent verification; it is not evidence of target implementation failure. |

### 3.1 Current baseline drift

The committed baseline records these revisions:

| Path | Manifest revision | Current gitlink/checkout | Current state |
| --- | --- | --- | --- |
| `playground` | `c0de7b0eec38a436f52893404fa420051e3d34e6` | `59a42ae925cf0c21541bc19ccac39f5061b35439` | stale baseline |
| `flutter` | `f39a913708e28625125ee8b64ccb350250db1d5d` | `b21eceb258070133f32fd822b6fd23a4f21b0bbf` | stale baseline |
| `mcp` | `48821c47f211fcce29013355803aa271e63a7b47` | `e225919e8d35f88f968c7ac75c748055447c2c38` | stale baseline |

The strict verifier reports these mismatches while confirming that each checkout
matches its current root gitlink. It also rejects the eleven dirty child checkouts
listed in `OBS-01`; the baseline is therefore neither revision-current nor
clean in this working tree. The safe next action is an explicit validated-child-
CI sync flow on a clean checkout, not a blind `--write` manifest update.

## 4. Expected-versus-observed implementation gap map

Evidence shorthand: `S` = static source/config/docs, `F` = fixture/test,
`C` = current command observation, `H` = historical/canonical evidence,
`E` = environment unavailable or not verified.

| ID | Implementation status | Verification status | Source / test / command / runtime evidence | Gap, limitation, or next action |
| --- | --- | --- | --- | --- |
| `ORCH-BOOT-001` | `partial` | `partial-current` | `S`: `scripts/README.md`, Integration Plan §10, root package scripts describe prerequisites and gate entrypoints. `C`: current local runtime cannot enter integration because Node 22. | No single root bootstrap executable initializes toolchain + submodules; document/execute a fresh-clone probe on Node 24. |
| `ORCH-BOOT-002` | `partial` | `partial-current` | `S`: root `package.json` pins Node `>=24`, pnpm `10.33.3`; workflows pin Node 24/pnpm. `C`: pnpm warns current Node is `22.23.2`; frozen install was not accepted as current gate evidence. | Current host does not meet declared toolchain. Add/verify a deterministic bootstrap check or run on Node 24. |
| `ORCH-BOOT-003` | `implemented` | `verified-static` | `S`: `.gitmodules` registers 12 paths; root workflow uses recursive checkout. `C`: all 12 submodules are initialized and current checkouts equal their gitlinks; `OBS-01` records eleven dirty child working trees. | Recursive checkout/synchronization behavior is present, but this working tree cannot provide clean-baseline evidence; child pointer synchronization is separately covered by CI IDs below. |
| `ORCH-BOOT-004` | `partial` | `verified-static` | `S`: Master Plan public-surface rule; integration public copy excludes `.git`, `node_modules`, build/cache/private directories; reports avoid private paths. | No complete current secret scan of every artifact/log was performed. Keep public tree scan as audit follow-up. |
| `ORCH-BASE-001` | `implemented` | `verified-current` | `S`: `docs/integration-baseline.json` has 12 entries, compatibility `0.5`, package metadata and revisions; `verify-baseline.mjs` reads it. | Manifest is structurally present but stale for three current pointers; reconcile only after validated child CI. |
| `ORCH-BASE-002` | `implemented` | `partial-current` | `C`: strict verifier produced 14 failures: three targeted revision mismatches and eleven dirty child checkouts; `OBS-03` failure injection passed. `S`: verifier checks registration, gitlink, checkout, clean state, package name/version/license. | Operational baseline is not green until the three pointers are updated through reviewable sync and the child checkouts are clean. |
| `ORCH-BASE-003` | `implemented` | `verified-current` | `C`: compatibility check `283/283`; `S`: `docs/compatibility-matrix.json`, `spec/id`, `scripts/check-compatibility.mjs`, package README/metadata checks. | Runtime command still warns about unsupported local Node; rerun on Node 24 for canonical evidence. |
| `ORCH-BASE-004` | `partial` | `partial-current` | `C`: conformance `260/260` across 20 fixtures; `F`: active/legacy/invalid/runtime-error/candidate status policy in `fixtures/manifest.json`; `S`: Flutter runner exists. | Current Flutter runner is blocked by SDK cache permission; fixture result is not cross-platform verification. |
| `ORCH-BASE-005` | `implemented` | `verified-static` | `S`: `docs/REPOSITORY-MAP.md`, Master Plan §2.1–§2.3, workflow summaries, and release records assign spec/child/workspace ownership. | No central machine-readable ownership registry for every operational stage; audit relies on documented source-of-truth paths. |
| `ORCH-GATE-001` | `implemented` | `verified-static` | `S`: `scripts/run-integration-gate.mjs` declares baseline → failure injection → install → package dependency order → consumers → conformance; Integration Plan §3/Stage C. | Current gate cannot execute past Node prerequisite; rerun under Node 24. |
| `ORCH-GATE-002` | `implemented` | `unverified-runtime` | `S`: seven package stage groups and package scripts cover lint/build/test/test:dist; package manifests expose commands. `H`: historical local/CI gate claims in plan docs. | Current package gate was not executed because runner exits on Node 22. Fresh current run needed. |
| `ORCH-GATE-003` | `implemented` | `unverified-runtime` | `S`: public runner copies packages to temp, installs from `registry.npmjs.org`, pins baseline `@relgeo/*` versions, and runs package checks. | Current public gate not executed; registry/network and Node 24 availability must be verified together. |
| `ORCH-GATE-004` | `implemented` | `verified-static` | `S`: runner assembles Playground `dist` into website `dist/playground`; website script `test:pages-artifact` is in package surface; Integration Plan Stage D. `H`: public route smoke is documented historically. | Current website artifact assertion/public route run not repeated in this environment. |
| `ORCH-GATE-005` | `implemented` | `verified-static` | `S`: root workflow has separate `verify`, `public`, `flutter`, `flutter-macos`, `flutter-linux`, `flutter-windows` jobs; Flutter is not a TS package dependency. | Current job-level CI evidence belongs to historical runs; current root pointer drift needs a new canonical run. |
| `ORCH-CI-001` | `implemented` | `verified-static` | `S`: child `flutter`, `playground`, and `mcp` workflows dispatch `submodule_ci_succeeded` after successful main CI with SHA/run/path/workflow payload. | No live child CI dispatch was observed in this audit. Validate with a real successful child run later. |
| `ORCH-CI-002` | `implemented` | `verified-static` | `S`: sync workflow allowlists `flutter`, `playground`, `mcp`, checks 40-char SHA, numeric run ID, repository/path/workflow values, and accepts legacy Flutter event only as transition. | Payload validation is not covered by a current local failure-injection test; add workflow-level fixture/probe if needed. |
| `ORCH-CI-003` | `implemented` | `verified-static` | `S`: GitHub API rechecks `head_sha`, conclusion, `push/main`, workflow path, and source repository before staging. | Requires GitHub Actions API/token/runtime for verification; not invoked locally. |
| `ORCH-CI-004` | `implemented` | `verified-static` | `S`: sync workflow fetches exact SHA, checks detached child, stages gitlink, runs `verify-baseline.mjs --write`, strict baseline, and compatibility. | Current drift is evidence that reconciliation has not happened for these pointers; do not use blind manifest write. |
| `ORCH-CI-005` | `implemented` | `verified-static` | `S`: sync workflow creates one PR per child and dispatches root Integration on the sync branch; root `main` is not directly written. | Branch protection/PR merge was not observed in this local audit. |
| `ORCH-EVID-001` | `implemented` | `verified-static` | `S`: integration report now includes schema/contract, mode, revision, baseline, compatibility, stage, command, duration, exit code, evidence envelope, and attempt history; CI uploads reports with bounded retention. | Report generation requires Node 24 gate completion for current integration evidence. |
| `ORCH-EVID-002` | `implemented` | `partial-current` | `S`: Master Plan §2.7 and Repository Map separate implementation/evidence/parity/scope; audit docs distinguish local/public/CI/manual. `C`: current baseline stale while historical evidence remains. | Reconciliation is policy/documented, but current evidence set needs refreshed canonical run after pointer sync. |
| `ORCH-EVID-003` | `implemented` | `partial-current` | `S`: baseline stores child revisions; integration/release reports now share a schema-versioned evidence envelope with root revision, baseline, compatibility line, toolchain, limitations, and per-result metadata. `C`: three manifest revisions do not match current gitlinks. | The traceability contract is implemented, but current claims remain partial until validated child-CI pointers and a current integration run are joined. |
| `ORCH-EVID-004` | `partial` | `unverified-runtime` | `S`: website artifact assembly, Playwright/public smoke hooks, CI artifacts, and historical route evidence exist. `E`: current public/registry and browser runtime not re-run here. | Join current artifact, deployment URL, and exact baseline in one fresh evidence record. |
| `ORCH-EVID-005` | `implemented` | `verified-current` | `C`: Node gate emits explicit prerequisite exit `2`; Flutter emits `[BLOCKED]` for SDK cache permission; tarball audit initial EPERM was isolated by changing temp npm cache. `S/F`: shared JSON blocker/evidence contract distinguishes unavailable from defect and preserves dependency status. | Provider-side and Flutter runtime reports should adopt the same contract as their owning runners are refreshed. |
| `ORCH-REL-001` | `implemented` | `unverified-runtime` | `S`: `scripts/run-release-preflight.mjs` composes clean-tree, strict baseline, compatibility, record, release audit, and local gate; it never publishes. | Current tree is intentionally dirty from workspace changes and current Node is below requirement; preflight not run as a valid release probe. |
| `ORCH-REL-002` | `implemented` | `verified-current` | `C`: release audit passed `106/106` for 7 packages using `/private/tmp` npm cache; `S`: `npm pack --dry-run --json` allowlist rejects traversal, `.git`, `node_modules`, private/secret paths. | Keep npm cache isolation documented for constrained hosts; no package publish performed. |
| `ORCH-REL-003` | `implemented` | `verified-static` | `S`: `scripts/run-manual-npm-release-cycle.sh` requires release records, clean tree, auth, prechecks, ordered package args, explicit `--publish`; Release Guard keeps publish manual. | Live publish was intentionally not performed. Automation/OIDC remains future scope. |
| `ORCH-REL-004` | `implemented` | `unverified-runtime` | `S`: `scripts/verify-published-packages.mjs` uses `npm view`; manual cycle runs registry verification and public integration after publish. `OBS-11`: registry probe did not complete in observation window. | Need a network-available Node 24 run; no conclusion about registry/package state from the interrupted probe. |
| `ORCH-REL-005` | `implemented` | `partial-current` | `C`: release failure injection passed unsafe forward-fix and read-only recovery planning; `S`: planner requires partial record, last published, first failed, newer forward-fix, and no republish. | No real partial release was created; transaction/recovery runtime remains intentionally unverified/deferred. |
| `ORCH-REL-006` | `implemented` | `verified-current` | `C`: release record check `35/35`; failure injection covers reordered package plan and unsafe forward-fix. `S`: records carry approval/status/evidence and no-op policy. | Two post-decision manual releases remain a future acceptance prerequisite for automation, not a current record defect. |
| `ORCH-OPS-001` | `implemented` | `verified-static` | `S/F`: `scripts/orchestration-contract.mjs` defines stable owner/remediation/dependency fields; integration, release-preflight, and baseline reports use them; `OBS-14` fixture test passes. `C`: the Node prerequisite report names the blocked integration surface and remediation. | Full stage execution remains unavailable on Node 22; rerun the same contract on the declared Node 24 host. |
| `ORCH-OPS-002` | `implemented` | `verified-static` | `S/F`: shared blocker taxonomy covers target defect, transient, dependency unavailable, environment unavailable, and pending human decision; reports preserve dependency impact and decision-required fields; `OBS-14` proves environment-unavailable remains non-defect. | Provider/CI runtime propagation remains unobserved; retain this as a live dispatch follow-up, not a missing local contract. |
| `ORCH-OPS-003` | `implemented` | `verified-static` | `S/F`: `runWithBoundedAttemptsSync` retries only classified transient failures, caps attempts at two with bounded backoff, preserves attempt history, and does not retry deterministic/environment failures; integration and release runners are wired to it; `OBS-14` passes. | A live transient provider failure was not induced locally; verify retained attempt reports in a supported CI run. |
| `ORCH-OPS-004` | `implemented` | `verified-static` | `S`: both workflows cancel superseded runs; sync workflow sets `changed=false` when root already points at SHA; temporary roots are cleaned by integration runner. | No current replay test for duplicate dispatch/cancel race; add an isolated workflow fixture or document provider-level limit. |
| `ORCH-OPS-005` | `partial` | `verified-static` | `S`: Decision 07/09 and Release Guard explicitly require maintainer decisions for promotion, mobile scope, automation, and partial release. | Policy is documented but not enforced by a central decision gate/tool; a human review remains required. |
| `ORCH-PUB-001` | `implemented` | `verified-static` | `S`: integration pack filter rejects absolute/traversal/private/secret paths; release record rejects operator absolute paths and credential-like fields; workflows use summaries/artifacts. | Full artifact-by-artifact secret scan was not run; retain as follow-up evidence. |
| `ORCH-PUB-002` | `implemented` | `unverified-runtime` | `S`: public runner copies repositories to temporary roots without sibling source, `node_modules`, build outputs, or `.local`; registry install is explicit. | Current public gate is unavailable until Node 24/network/browser prerequisites are available. |
| `ORCH-PUB-003` | `implemented` | `verified-static` | `S/F`: sync checkout explicitly sets `persist-credentials: false`; workflow retains only the documented `contents`, `pull-requests`, and `actions` write boundary; `OBS-14` static policy assertions pass. | Provider-side sync PR/dispatch behavior remains unobserved; review the live workflow with the existing exact-SHA validation. |
| `ORCH-PUB-004` | `implemented` | `verified-static` | `S`: root artifacts use 7-day retention, summaries include SHA/compatibility/toolchain, child workflows include run/SHA metadata. | Current uploaded artifact availability was not queried; provenance design is present. |

## 5. Status summary

| Implementation status | Count | Main interpretation |
| --- | ---: | --- |
| `implemented` | 33 | Static orchestration, validation, report, release guard, hygiene, blocker taxonomy, bounded retry, and evidence-envelope behavior exists. |
| `partial` | 6 | Current baseline drift, missing cross-surface runtime evidence, policy-only handling, or security/config gap. |
| `absent` | 0 | All selected implementation boundaries now have source/test evidence; current or provider runtime gaps remain separate evidence statuses. |
| `broken` | 0 | No target behavior was marked broken solely from environment failures. |
| `deferred` | 0 | Deferred scope items are outside the 39 IDs and listed in §7. |
| `not-applicable` | 0 | All 39 IDs are in-scope orchestration capabilities. |

| Verification status | Count | Main interpretation |
| --- | ---: | --- |
| `verified-current` | 5 | Current read-only command/static checks passed at the declared boundary. |
| `verified-static` | 21 | Source/config/docs/fixture behavior is present; current runtime or provider execution is not required/available. |
| `partial-current` | 7 | Some current evidence passes while drift/staleness or incomplete scope remains. |
| `unverified-environment` | 0 | Environment blockers are attached to `unverified-runtime` or `partial-current` rows with explicit evidence. |
| `unverified-runtime` | 6 | Integration, public registry, Flutter, or live release runtime was not available/current. |
| `deferred-scope` | 0 | Deferred items are outside the expected ID set. |

## 6. Priority gap backlog

| Priority | Gap | Affected IDs | Evidence/action needed |
| --- | --- | --- | --- |
| P0 | Current baseline is stale for three clean submodule checkouts. | `ORCH-BASE-001`, `002`, `ORCH-EVID-003`, `ORCH-CI-004` | Validate successful child CI SHA/run for `playground`, `flutter`, `mcp`; use sync PR; regenerate manifest; rerun strict/compatibility/Integration. |
| P0 | Current host is below Node requirement and cannot enter integration gate. | `ORCH-BOOT-002`, `ORCH-GATE-001`–`005`, `ORCH-REL-001` | Run on Node `24.21.0`/pnpm `10.33.3`; preserve this Node 22 observation as environment-unavailable. |
| P1 | Live/provider evidence for the new blocker and retry contract is not current. | `ORCH-OPS-001`–`003` | Run the existing contract on Node 24 and retain a supported CI transient attempt report; no new local implementation is required. |
| P1 | Provider-side sync PR/dispatch behavior remains unobserved. | `ORCH-PUB-003` | Review one validated sync workflow run under the explicit credential and permission policy. |
| P1 | Current Flutter SDK cannot write its cache outside workspace. | `ORCH-BASE-004`, `ORCH-GATE-005`, `ORCH-EVID-004` | Use an approved writable Flutter SDK/cache or CI; rerun Flutter conformance and desktop jobs at current pointers. |
| P2 | Public registry verification and deployment/public smoke are not current. | `ORCH-GATE-003`, `ORCH-EVID-004`, `ORCH-REL-004`, `ORCH-PUB-002` | Run with Node 24, network, registry, browser, and named deployment revision; record limitations if unavailable. |
| P2 | Full artifact secret scan and duplicate-dispatch replay test are not current evidence. | `ORCH-BOOT-004`, `ORCH-OPS-004`, `ORCH-PUB-001` | Add bounded scans/fixtures or capture equivalent CI evidence without exposing private data. |

## 7. Deferred and not-applicable scope boundaries

These are not missing rows from the orchestration catalog:

| Item | Status | Evidence/decision |
| --- | --- | --- |
| Android/iOS delivery and mobile assistive technology | `deferred` | Decision 07/09: deferred without date and not an active exit gate. |
| Raw SVG byte-for-byte equality/full presentation parity | `not-applicable` to current active contract | Decision 07: semantic parity is the accepted boundary; raw equality is a non-goal. |
| Fully automatic npm publish/atomic rollback | `deferred` | Release Guard and Decision 09: manual publish + forward-fix now; OIDC/protected environment only after two additional real manual releases. |
| Workspace UI menu/shortcut | `not-applicable` | Workspace orchestration is script/CI operated; downstream Playground/website UI is audited by their own surface catalogs. |

## 8. Audit limitations and handoff

- Historical CI URLs and counts in the master/integration plans were treated as
  historical evidence. They were not re-used as proof for the current stale
  submodule pointers.
- No GitHub API dispatch, PR creation, npm publish, deployment, or submodule
  pointer mutation was executed.
- The release registry verifier was interrupted after no response within the
  observation window. It must be rerun in a network-available environment.
- The current local Node and Flutter SDK restrictions are environment evidence;
  they do not prove target package, Flutter, or public-registry parity failed.
- The next reconciliation task should join all 39 `ORCH-*` IDs to refreshed
  evidence after the P0 baseline/toolchain blockers are resolved. It should not
  rewrite the expected catalog based only on current implementation gaps.

## 9. Source inventory

- `docs/MATURATION-MASTER-PLAN.md`
- `docs/REPOSITORY-MAP.md`
- `docs/plans/01-cross-repo-integration-gate.md`
- `docs/plans/02-contract-versioning.md`
- `docs/plans/03-npm-release-guard.md`
- `docs/plans/09-approved-decisions-execution-plan.md`
- `docs/decisions/07-cross-repo-open-decisions.md`
- `.gitmodules`
- `package.json`, `pnpm-lock.yaml`, child `package.json` files, and available child lockfiles
- `docs/integration-baseline.json`
- `docs/compatibility-matrix.json`
- `fixtures/manifest.json`, `fixtures/reference/`, `fixtures/expected/`
- `scripts/README.md` and all root scripts under `scripts/`
- `.github/workflows/integration.yml`
- `.github/workflows/sync-validated-submodule-after-ci.yml`
- `flutter/.github/workflows/flutter-ci.yml`
- `playground/.github/workflows/playground-ci.yml`
- `mcp/.github/workflows/mcp-ci.yml`
