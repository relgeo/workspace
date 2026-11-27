# Cross-Repository Orchestration — Capability Status Matrix

**Status:** current-head disposition view; historical candidate observations are retained below

**Tanggal:** 2026-11-27

**Expected catalog:** [Expected Cross-Repository Orchestration Capability Catalog](./expected-capability-catalog.md)

**Reviewed freeze projection:** [expected-catalog.md](./expected-catalog.md)

**Implementation audit:** [Cross-Repository Orchestration Implementation and Evidence Audit](./implementation-audit.md)

**Expected-versus-observed join:** [Cross-Repository Orchestration Reconciliation](./reconciliation.md)

**Implementation-gap backlog:** [Cross-Repository Orchestration Implementation Gap Backlog](./implementation-gap-backlog.md)

**Coverage validation and handoff:** [Coverage Validation and Handoff](./coverage-validation-handoff.md)

**Current HEAD rebaseline:** [Cross-Repository Rebaseline and Disposition Register](../../evidence/cross-repository-rebaseline-2026-11-27.json)

**Current closure report:** [Cross-Repository Closure Report](../../evidence/cross-repository-closure-report-2026-11-27.json)

The current matrix reconciles all 39 capabilities at root revision
`296f6881896577bc27f711f27285a07f8dc3bac1`. The closure report records the
before/after transition for all 18 historical `🌗` rows: five are locally
verified as `✔️`, and thirteen are explicitly `⏸️` for named external-evidence
or scope boundaries. No actionable `🌗`, `❌`, or `⚠️` remains. Historical
candidate observations and the original 18 partial statuses are preserved in
the dated rebaseline and closure artifacts.

## Cara membaca

Matrix ini adalah reporting view capability-first. Expected catalog, audit,
reconciliation, dan backlog tetap artefak terpisah. Dokumentasi gap tidak
dihitung sebagai implementasi. `Status`, `Evidence`, dan `Scope` adalah dimensi
yang berbeda.

| Status | Makna |
| --- | --- |
| `✔️` | Implemented pada boundary yang dinyatakan audit; bukan jaminan semua runtime canonical terbaru sudah dijalankan. |
| `🌗` | Historical partial status only; it is not a current status in this matrix. |
| `❌` | Expected capability absent atau broken pada boundary audit. |
| `➖` | Not applicable terhadap scope yang diputuskan; bukan pengganti evidence yang belum diverifikasi. |
| `⏸️` | Sengaja deferred/ditahan oleh keputusan scope atau promotion. |
| `⚠️` | Broken/mismatch terkonfirmasi pada boundary yang diaudit. |

Current count: **26 `✔️` · 0 `🌗` · 0 `❌` · 0 `➖` · 13 `⏸️` · 0 `⚠️`**.
The 13 `⏸️` rows name their owner, source of truth, dependency, evidence
locator, tested revision, claim limit, and concrete remediation in the [closure
report](../../evidence/cross-repository-closure-report-2026-11-27.json).

## Matrix

| ID | Capability | Status | Evidence | Gap | Owner | Dependency | Risk | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [`ORCH-BOOT-001`](./reconciliation.md) | Fresh clone bootstrap entrypoint | `✔️` | Current local fresh-checkout report: Node v24.21.0, pnpm 10.33.3, recursive bootstrap, and contract fixture pass | Canonical CI/provider execution remains outside this claim | `relgeo/workspace` | Node 24, pnpm, submodules | Fresh clone diverges by operator | Re-run on canonical CI when available |
| [`ORCH-BOOT-002`](./reconciliation.md) | Pinned toolchain and dependency bootstrap | `⏸️` | Exact Node/pnpm contract is present; registry-backed frozen install is unavailable at the managed dependency boundary | No implementation defect; install evidence is environment-unavailable | `relgeo/workspace` | Node 24 host, frozen lockfile, registry | Gates run without declared toolchain | Re-run frozen install with registry access |
| [`ORCH-BOOT-003`](./reconciliation.md) | Recursive submodule initialization and synchronization | `✔️` | Current fresh-checkout report initializes all 12 children and matches every checkout to its root gitlink | Provider synchronization and canonical CI are not claimed | `relgeo/workspace` | Git, child repositories, clean-clone probe | Stale/dirty pointers are mistaken for fresh bootstrap | Retain exact-SHA synchronization check |
| [`ORCH-BOOT-004`](./reconciliation.md) | Public workspace boundary hygiene | `⏸️` | Local boundary audit and negative fixtures pass; five declared artifact roots are unavailable | Canonical CI/public artifact scan is environment-unavailable | `relgeo/workspace + CI/artifact owners` | Artifact roots, Node 24, scan inputs | Private paths or secrets leak | Scan all declared roots on canonical CI |
| [`ORCH-BASE-001`](./reconciliation.md) | Versioned integration baseline manifest | `✔️` | Generated manifest records current root and 12-child tuple; synchronization passes 101/101 | No validated child-CI or provider-artifact claim | `relgeo/workspace` | Exact child gitlinks, validated child CI | Claims inherit stale revisions | Regenerate only through synchronization path |
| [`ORCH-BASE-002`](./reconciliation.md) | Strict gitlink/checkout/manifest verification | `✔️` | Strict verifier passes 87 checks and synchronization passes 101/101 at current root | Provider CI, registry, and public-runtime behavior are not claimed | `relgeo/workspace` | Current baseline, clean checkout, toolchain | False green baseline | Retain strict verifier in integration gate |
| [`ORCH-BASE-003`](./reconciliation.md) | DSL/package/consumer compatibility verification | `⏸️` | Compatibility command passes locally, but canonical Node 24 dependency execution is unavailable | Evidence boundary only; no contract regression is claimed | `relgeo/spec + relgeo/workspace` | Current tuple, Node 24 canonical toolchain | Incompatible contract line | Re-run with canonical dependency boundary |
| [`ORCH-BASE-004`](./reconciliation.md) | Shared conformance orchestration | `⏸️` | TypeScript fixtures pass; same-baseline Flutter conformance is unavailable in this execution boundary | Flutter parity remains unverified, not failed | `relgeo/workspace + child owners` | Fixtures, Flutter SDK/cache, Node 24 run | Consumer drift escapes fixtures | Run Flutter conformance on supported host |
| [`ORCH-BASE-005`](./reconciliation.md) | Source-of-truth and ownership reconciliation | `✔️` | `verified-static`: map/plan/release ownership docs | No central machine-readable stage registry | `relgeo/workspace` | Repository map, source owners | Reviewers misassign failures | Maintain ownership map; consider registry later |
| [`ORCH-GATE-001`](./reconciliation.md) | Dependency graph and deterministic gate order | `✔️` | `verified-static`: runner declares order | Current gate stopped before stages | `relgeo/workspace` | Node 24, package graph | Wrong order hides root cause | Execute current gate on Node 24 |
| [`ORCH-GATE-002`](./reconciliation.md) | Local workspace package gate | `⏸️` | Local report records 30 environment-unavailable blocked stages after the runner classified missing dependencies | No package regression is claimed | workspace + package owners | Node 24, installs | Package regression lacks current proof | Re-run with installable Node 24 dependency state |
| [`ORCH-GATE-003`](./reconciliation.md) | Isolated public-registry gate | `⏸️` | Public report reaches the gate but registry DNS is unavailable at the remote-provider boundary | No registry/public consumer claim is made | `relgeo/workspace` | Node 24, registry/network | Local aliases hide publish defects | Re-run with registry/network access |
| [`ORCH-GATE-004`](./reconciliation.md) | Consumer artifact assembly and assertion | `✔️` | `verified-static`: Playground/website assembly and assertions | Current public route run pending | workspace + consumer owners | Public gate, artifact build | Artifact route mismatch | Repeat current artifact assertion |
| [`ORCH-GATE-005`](./reconciliation.md) | Independent cross-surface gate partitioning | `✔️` | `verified-static`: separate TS/public/Flutter jobs | Current canonical job evidence stale | `relgeo/workspace` + CI | CI runners, current pointers | Unrelated failures become opaque | Refresh canonical run after sync |
| [`ORCH-CI-001`](./reconciliation.md) | Validated child-CI success dispatch | `✔️` | `verified-static`: child workflows dispatch exact metadata | No live child dispatch observed | Child CI + workspace | GitHub Actions provider | Unvalidated pointer proposal | Observe a successful child run |
| [`ORCH-CI-002`](./reconciliation.md) | Dispatch allowlist and payload validation | `✔️` | `verified-static`: repo/path/SHA/run/workflow checks | No local invalid-payload fixture | `relgeo/workspace` | GitHub event payload | Malicious/invalid dispatch | Add provider-level payload probe |
| [`ORCH-CI-003`](./reconciliation.md) | Authoritative child-run revalidation | `✔️` | `verified-static`: exact SHA/conclusion/workflow checks | Provider API execution not observed | `relgeo/workspace` | GitHub API/token | Payload claim diverges from run | Exercise API-backed validation |
| [`ORCH-CI-004`](./reconciliation.md) | Exact pointer staging and baseline regeneration | `✔️` | `verified-static`: fetch/stage/write/strict flow exists | Current drift awaits sync | `relgeo/workspace` | Validated child run, PR | Blind manifest update | Use reviewable sync branch |
| [`ORCH-CI-005`](./reconciliation.md) | Reviewable synchronization PR and integration dispatch | `✔️` | `verified-static`: PR and Integration dispatch configured | PR merge/branch protection not observed | `relgeo/workspace` | GitHub PR permissions | Pointer lands without normal gate | Verify provider-side merge path |
| [`ORCH-EVID-001`](./reconciliation.md) | Machine-readable gate report | `✔️` | `verified-static`: report fields and retention configured | Current integration report needs Node 24 | `relgeo/workspace` | Node 24, report artifact | Review requires rerun | Produce current report |
| [`ORCH-EVID-002`](./reconciliation.md) | Evidence class separation | `⏸️` | Evidence class/limitation contract and fixtures pass; historical/provider records remain explicitly non-canonical | Evidence-only hold, not an implementation defect | `relgeo/workspace` | Current baseline, canonical run, evidence envelope | Historical evidence is over-promoted | Capture a current canonical record |
| [`ORCH-EVID-003`](./reconciliation.md) | Revision-to-evidence traceability | `✔️` | Current baseline and reports carry the same root revision and 12-child tuple; cross-surface check passes 25/25 | External artifact/deployment provenance remains outside this claim | `relgeo/workspace + child CI owners` | Regenerated baseline, child metadata | Artifact identity is ambiguous | Retain exact-revision join checks |
| [`ORCH-EVID-004`](./reconciliation.md) | Canonical artifact and public-smoke reconciliation | `⏸️` | Join contract is implemented, but current artifact/deployment/browser evidence is unavailable | No deployment or public-runtime claim is made | workspace + website owner | Artifact digest, URL, public smoke/browser | Public claim lacks provenance | Capture joined post-deploy record |
| [`ORCH-EVID-005`](./reconciliation.md) | Honest environment-unavailable handling | `✔️` | `verified-current`: Node/Flutter/cache blockers classified; shared report taxonomy added | Provider/Flutter owners still need to adopt the contract | `relgeo/workspace` | Report schema | Blocker misreported as target defect | Extend the contract to refreshed provider/Flutter reports |
| [`ORCH-REL-001`](./reconciliation.md) | Release preflight composition | `⏸️` | Read-only preflight exists; required Node 24 release boundary is unavailable | No publish was attempted and no current preflight is claimed | release owner + workspace | Clean tree, Node 24, baseline, release record | Unsafe release continuation | Run on supported release host |
| [`ORCH-REL-002`](./reconciliation.md) | Public tarball and metadata hygiene gate | `✔️` | `verified-current`: release audit 106/106 | Cache isolation is host-specific | package owners + workspace | npm cache, package manifests | Bad artifact reaches registry | Retain pack audit and cache guidance |
| [`ORCH-REL-003`](./reconciliation.md) | Manual ordered publish with operator stop | `✔️` | `verified-static`: ordered manual release flow | Live publish intentionally not run | release owner | Release record, npm auth | Partial release from wrong order | Keep manual stop boundary |
| [`ORCH-REL-004`](./reconciliation.md) | Post-publish registry and consumer verification | `⏸️` | Published-package verification is outside the current registry/network boundary | No registry version or public consumer result is asserted | release + consumer owners | Node 24, network, registry | Published package unverified | Re-run on network-capable host |
| [`ORCH-REL-005`](./reconciliation.md) | Partial-release forward-fix recovery | `⏸️` | Recovery fixture passes; live partial release is intentionally not created | Scope-held; fixture evidence is not live registry evidence | release owner | Release record, newer patch | Unsafe republish or rollback assumption | Observe only in approved release environment |
| [`ORCH-REL-006`](./reconciliation.md) | Release decision record and no-op guard | `✔️` | `verified-current`: record 35/35 and failure injection | Automation prerequisite remains future | release owner + workspace | Decision record, package order | Unapproved/no-op release | Preserve decision record checks |
| [`ORCH-OPS-001`](./reconciliation.md) | Actionable failure ownership | `✔️` | `verified-static`: shared owner/remediation/dependency fields plus focused contract fixture | Full stage runtime still awaits Node 24 | `relgeo/workspace` + stage owners | Report schema | Generic red status delays recovery | Rerun the same report contract on Node 24 |
| [`ORCH-OPS-002`](./reconciliation.md) | Blocker classification and dependency propagation | `✔️` | `verified-static`: shared blocker taxonomy and dependency-impact fields; environment blocker fixture passes | Live provider propagation remains unobserved | `relgeo/workspace` | Blocker schema, dependency graph | Wrong downstream work is blocked | Exercise provider-backed propagation later |
| [`ORCH-OPS-003`](./reconciliation.md) | Bounded retry and rerun policy | `✔️` | `verified-static`: bounded transient retry, backoff, classifier, and attempt retention fixture passes | No live transient provider failure was induced | `relgeo/workspace` + CI | Failure taxonomy, report retention | Retry storms or overwritten evidence | Verify attempt retention in supported CI |
| [`ORCH-OPS-004`](./reconciliation.md) | Cancellation, concurrency, and idempotent replay | `✔️` | `verified-static`: cancellation and duplicate-SHA guard | Replay race test not current | `relgeo/workspace` + CI | Provider workflows | Duplicate dispatch creates false baseline | Add isolated replay fixture |
| [`ORCH-OPS-005`](./reconciliation.md) | Human decision boundary | `⏸️` | Local approved/pending/rejected/stale decision handling is contract-tested and fail-closed | Provider-side promotion enforcement remains unobserved | `relgeo/workspace + stage/release owners` | Maintainer decision records, provider promotion | Scope inferred without approval | Observe provider enforcement; preserve local fail-closed gate |
| [`ORCH-PUB-001`](./reconciliation.md) | Secret and private-path exclusion | `✔️` | `verified-current-local`: the public-boundary audit covers tracked paths/content and 2 available artifact roots; unsafe fixtures fail closed | Five candidate artifact roots were unavailable; no deployed/public artifact claim is made | `relgeo/workspace` | Artifact scanner | Public leakage | Repeat against canonical CI/public artifacts and retain the same report schema |
| [`ORCH-PUB-002`](./reconciliation.md) | No sibling-source leakage in public consumers | `⏸️` | Isolated runner and boundary fixtures exist; public consumer gate is unavailable at registry/network boundary | Local tests do not prove registry-installed consumer isolation | workspace + consumer owners | Node 24, registry, browser | Local source masks package defect | Run public consumer gate with sibling source absent |
| [`ORCH-PUB-003`](./reconciliation.md) | Least-privilege CI and credential-free checkout | `✔️` | `verified-static`: sync checkout explicitly disables credential persistence; focused workflow policy fixture passes | Provider-side PR/dispatch behavior remains unobserved | `relgeo/workspace` + CI | GitHub permissions | Credential persistence/excess permission | Review live sync PR/dispatch under exact-SHA validation |
| [`ORCH-PUB-004`](./reconciliation.md) | Safe report/artifact retention and provenance | `✔️` | `verified-static`: 7-day retention and SHA metadata | Uploaded artifact availability not queried | `relgeo/workspace` + CI | Artifact service | Evidence becomes uncontrolled store | Query current artifact retention/provenance |

## Coverage and handoff

The matrix contains exactly the 39 expected capability IDs. The 18 historical
`🌗` candidates are represented in the [implementation-gap
backlog](./implementation-gap-backlog.md) and closure report; the active matrix
has no unresolved partial, failed, or warning row. Backlog entries remain
historical traceability and do not change status by themselves.

Coverage limits, unresolved questions, and implementation handoff conditions are
recorded in the [coverage validation and handoff](./coverage-validation-handoff.md).

## Evidence and ownership sources

| Source | Matrix role |
| --- | --- |
| Workspace root `relgeo/workspace` — root `package.json`, `.gitmodules`, `scripts/`, `.github/workflows/`, and `docs/` | Defines the orchestration commands, submodule boundary, CI configuration, reports, and root-owned evidence. |
| [Maturation master plan](../../MATURATION-MASTER-PLAN.md) | Supplies roadmap stages, exit gates, evidence vocabulary, public-surface rules, and deferred scope. |
| [Repository map](../../REPOSITORY-MAP.md) | Defines child-repository ownership, source-of-truth boundaries, and workspace versus consumer responsibility. |
| [Expected capability catalog](./expected-capability-catalog.md) | Defines the 39 expected capabilities before implementation comparison. |
| [Implementation and evidence audit](./implementation-audit.md) | Supplies concrete source, test, workflow, command, configuration, platform, documentation, and runtime observations. |
| [Expected-versus-observed reconciliation](./reconciliation.md) | Provides the one-to-one ID join and keeps implementation status, evidence status, and scope distinct. |
