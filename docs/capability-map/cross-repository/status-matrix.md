# Cross-Repository Orchestration — Capability Status Matrix

**Status:** reporting view; tidak menutup implementation gap

**Tanggal:** 2026-10-30

**Expected catalog:** [Expected Cross-Repository Orchestration Capability Catalog](./expected-capability-catalog.md)

**Implementation audit:** [Cross-Repository Orchestration Implementation and Evidence Audit](./implementation-audit.md)

**Expected-versus-observed join:** [Cross-Repository Orchestration Reconciliation](./reconciliation.md)

**Implementation-gap backlog:** [Cross-Repository Orchestration Implementation Gap Backlog](./implementation-gap-backlog.md)

**Coverage validation and handoff:** [Coverage Validation and Handoff](./coverage-validation-handoff.md)

## Cara membaca

Matrix ini adalah reporting view capability-first. Expected catalog, audit,
reconciliation, dan backlog tetap artefak terpisah. Dokumentasi gap tidak
dihitung sebagai implementasi. `Status`, `Evidence`, dan `Scope` adalah dimensi
yang berbeda.

| Status | Makna |
| --- | --- |
| `✔️` | Implemented pada boundary yang dinyatakan audit; bukan jaminan semua runtime canonical terbaru sudah dijalankan. |
| `🌗` | Partial implementation atau evidence current/runtime belum lengkap. |
| `❌` | Expected capability absent atau broken pada boundary audit. |
| `➖` | Not applicable terhadap scope yang diputuskan; bukan pengganti evidence yang belum diverifikasi. |
| `⏸️` | Sengaja deferred/ditahan oleh keputusan scope atau promotion. |
| `⚠️` | Broken/mismatch terkonfirmasi pada boundary yang diaudit. |

Current count: **20 `✔️` · 18 `🌗` · 1 `❌` · 0 `➖` · 0 `⏸️` · 0 `⚠️`**.
Runtime atau provider evidence yang belum tersedia tetap ditulis pada kolom
Evidence dan tidak otomatis menjadi `❌`.

## Matrix

| ID | Capability | Status | Evidence | Gap | Owner | Dependency | Risk | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [`ORCH-BOOT-001`](./reconciliation.md) | Fresh clone bootstrap entrypoint | `🌗` | `partial-current`: docs/commands; Node 22 cannot enter integration | No single root bootstrap executable | `relgeo/workspace` | Node 24, pnpm, submodules | Fresh clone diverges by operator | Define and run a clean-clone bootstrap probe |
| [`ORCH-BOOT-002`](./reconciliation.md) | Pinned toolchain and dependency bootstrap | `🌗` | `partial-current`: declared Node 24/pnpm; host is Node 22 | Supported-toolchain install not current evidence | `relgeo/workspace` | Node 24 host, frozen lockfile | Gates run on unsupported toolchain | Add prerequisite check and verify on Node 24 |
| [`ORCH-BOOT-003`](./reconciliation.md) | Recursive submodule initialization and synchronization | `✔️` | `verified-current`: 12 submodules initialized and clean | Pointer sync is separately gated | `relgeo/workspace` | Git, child repositories | Stale pointers are mistaken for fresh bootstrap | Keep exact-SHA sync flow |
| [`ORCH-BOOT-004`](./reconciliation.md) | Public workspace boundary hygiene | `🌗` | `verified-static`: public-copy exclusions; full scan incomplete | No complete current scan of every artifact/log | `relgeo/workspace` | Artifact scanner, public tree | Private paths or secrets leak | Run complete artifact/private-path scan |
| [`ORCH-BASE-001`](./reconciliation.md) | Versioned integration baseline manifest | `✔️` | `verified-current`: manifest is read and structurally checked | Three child revisions are stale | `relgeo/workspace` | Validated child CI | Claims inherit stale revisions | Reconcile through reviewable sync |
| [`ORCH-BASE-002`](./reconciliation.md) | Strict gitlink/checkout/manifest verification | `🌗` | `partial-current`: strict mismatch and failure injection observed | Current baseline is not green for 3 child revisions | `relgeo/workspace` | Child CI, current gitlinks | False green baseline | Sync exact commits, rerun strict verifier |
| [`ORCH-BASE-003`](./reconciliation.md) | DSL/package/consumer compatibility verification | `✔️` | `verified-current`: 283/283; Node warning remains | Canonical Node 24 rerun pending | `relgeo/spec` + workspace | Node 24, compatibility matrix | Incompatible contract line | Rerun on declared toolchain |
| [`ORCH-BASE-004`](./reconciliation.md) | Shared conformance orchestration | `🌗` | `partial-current`: 260/260 fixtures; Flutter probe blocked | Cross-platform conformance incomplete | `relgeo/workspace` | Flutter SDK permissions, fixtures | Consumer drift escapes fixtures | Run Flutter conformance on supported host |
| [`ORCH-BASE-005`](./reconciliation.md) | Source-of-truth and ownership reconciliation | `✔️` | `verified-static`: map/plan/release ownership docs | No central machine-readable stage registry | `relgeo/workspace` | Repository map, source owners | Reviewers misassign failures | Maintain ownership map; consider registry later |
| [`ORCH-GATE-001`](./reconciliation.md) | Dependency graph and deterministic gate order | `✔️` | `verified-static`: runner declares order | Current gate stopped before stages | `relgeo/workspace` | Node 24, package graph | Wrong order hides root cause | Execute current gate on Node 24 |
| [`ORCH-GATE-002`](./reconciliation.md) | Local workspace package gate | `🌗` | `unverified-runtime`: package stages exist; Node gate blocked | Current package gate not run | workspace + package owners | Node 24, installs | Package regression lacks current proof | Run local package gate and retain report |
| [`ORCH-GATE-003`](./reconciliation.md) | Isolated public-registry gate | `🌗` | `unverified-runtime`: public runner statically present | Registry/public gate not executed | `relgeo/workspace` | Node 24, registry/network | Local aliases hide publish defects | Run isolated registry gate |
| [`ORCH-GATE-004`](./reconciliation.md) | Consumer artifact assembly and assertion | `✔️` | `verified-static`: Playground/website assembly and assertions | Current public route run pending | workspace + consumer owners | Public gate, artifact build | Artifact route mismatch | Repeat current artifact assertion |
| [`ORCH-GATE-005`](./reconciliation.md) | Independent cross-surface gate partitioning | `✔️` | `verified-static`: separate TS/public/Flutter jobs | Current canonical job evidence stale | `relgeo/workspace` + CI | CI runners, current pointers | Unrelated failures become opaque | Refresh canonical run after sync |
| [`ORCH-CI-001`](./reconciliation.md) | Validated child-CI success dispatch | `✔️` | `verified-static`: child workflows dispatch exact metadata | No live child dispatch observed | Child CI + workspace | GitHub Actions provider | Unvalidated pointer proposal | Observe a successful child run |
| [`ORCH-CI-002`](./reconciliation.md) | Dispatch allowlist and payload validation | `✔️` | `verified-static`: repo/path/SHA/run/workflow checks | No local invalid-payload fixture | `relgeo/workspace` | GitHub event payload | Malicious/invalid dispatch | Add provider-level payload probe |
| [`ORCH-CI-003`](./reconciliation.md) | Authoritative child-run revalidation | `✔️` | `verified-static`: exact SHA/conclusion/workflow checks | Provider API execution not observed | `relgeo/workspace` | GitHub API/token | Payload claim diverges from run | Exercise API-backed validation |
| [`ORCH-CI-004`](./reconciliation.md) | Exact pointer staging and baseline regeneration | `✔️` | `verified-static`: fetch/stage/write/strict flow exists | Current drift awaits sync | `relgeo/workspace` | Validated child run, PR | Blind manifest update | Use reviewable sync branch |
| [`ORCH-CI-005`](./reconciliation.md) | Reviewable synchronization PR and integration dispatch | `✔️` | `verified-static`: PR and Integration dispatch configured | PR merge/branch protection not observed | `relgeo/workspace` | GitHub PR permissions | Pointer lands without normal gate | Verify provider-side merge path |
| [`ORCH-EVID-001`](./reconciliation.md) | Machine-readable gate report | `✔️` | `verified-static`: report fields and retention configured | Current integration report needs Node 24 | `relgeo/workspace` | Node 24, report artifact | Review requires rerun | Produce current report |
| [`ORCH-EVID-002`](./reconciliation.md) | Evidence class separation | `🌗` | `partial-current`: policy separates local/public/CI/manual | Current stale baseline and historical evidence coexist | `relgeo/workspace` | Refreshed canonical run | Historical evidence is over-promoted | Refresh and label evidence classes |
| [`ORCH-EVID-003`](./reconciliation.md) | Revision-to-evidence traceability | `🌗` | `partial-current`: baseline/release records exist; 3 revisions drift | Current claim cannot inherit older evidence silently | `relgeo/workspace` | Child CI, baseline sync | Artifact identity is ambiguous | Regenerate baseline and evidence links |
| [`ORCH-EVID-004`](./reconciliation.md) | Canonical artifact and public-smoke reconciliation | `🌗` | `unverified-runtime`: hooks/artifacts documented | Current artifact, URL, and baseline not joined | workspace + website owner | Public deploy/browser/network | Public claim lacks provenance | Capture one joined post-deploy record |
| [`ORCH-EVID-005`](./reconciliation.md) | Honest environment-unavailable handling | `✔️` | `verified-current`: Node/Flutter/cache blockers classified | No shared JSON blocker schema | `relgeo/workspace` | Report schema | Blocker misreported as target defect | Standardize blocker fields |
| [`ORCH-REL-001`](./reconciliation.md) | Release preflight composition | `🌗` | `unverified-runtime`: composition exists; dirty/Node 22 host | Valid current preflight not run | release owner + workspace | Clean tree, Node 24 | Unsafe release continuation | Run valid preflight on supported tree |
| [`ORCH-REL-002`](./reconciliation.md) | Public tarball and metadata hygiene gate | `✔️` | `verified-current`: release audit 106/106 | Cache isolation is host-specific | package owners + workspace | npm cache, package manifests | Bad artifact reaches registry | Retain pack audit and cache guidance |
| [`ORCH-REL-003`](./reconciliation.md) | Manual ordered publish with operator stop | `✔️` | `verified-static`: ordered manual release flow | Live publish intentionally not run | release owner | Release record, npm auth | Partial release from wrong order | Keep manual stop boundary |
| [`ORCH-REL-004`](./reconciliation.md) | Post-publish registry and consumer verification | `🌗` | `unverified-runtime`: registry probe remained pending | Registry/public consumer evidence missing | release + consumer owners | Node 24, network, registry | Published package unverified | Repeat with network-available host |
| [`ORCH-REL-005`](./reconciliation.md) | Partial-release forward-fix recovery | `🌗` | `partial-current`: injection passed; no real partial release | Runtime recovery scenario unverified | release owner | Release record, newer patch | Unsafe republish or rollback assumption | Run controlled recovery evidence |
| [`ORCH-REL-006`](./reconciliation.md) | Release decision record and no-op guard | `✔️` | `verified-current`: record 35/35 and failure injection | Automation prerequisite remains future | release owner + workspace | Decision record, package order | Unapproved/no-op release | Preserve decision record checks |
| [`ORCH-OPS-001`](./reconciliation.md) | Actionable failure ownership | `🌗` | `partial-current`: labels and messages exist | No shared owner/remediation fields | `relgeo/workspace` + stage owners | Report schema | Generic red status delays recovery | Add structured owner/remediation fields |
| [`ORCH-OPS-002`](./reconciliation.md) | Blocker classification and dependency propagation | `🌗` | `verified-static`: docs/jobs classify boundaries | No unified machine-readable taxonomy | `relgeo/workspace` | Blocker schema, dependency graph | Wrong downstream work is blocked | Define taxonomy and propagation fields |
| [`ORCH-OPS-003`](./reconciliation.md) | Bounded retry and rerun policy | `❌` | `verified-static`: only timeout/concurrency found | No retry count, backoff, classifier, or controller | `relgeo/workspace` + CI | Failure taxonomy, report retention | Retry storms or overwritten evidence | Specify and implement bounded retry policy |
| [`ORCH-OPS-004`](./reconciliation.md) | Cancellation, concurrency, and idempotent replay | `✔️` | `verified-static`: cancellation and duplicate-SHA guard | Replay race test not current | `relgeo/workspace` + CI | Provider workflows | Duplicate dispatch creates false baseline | Add isolated replay fixture |
| [`ORCH-OPS-005`](./reconciliation.md) | Human decision boundary | `🌗` | `verified-static`: decisions documented | No central decision gate/tool enforces policy | `relgeo/workspace` | Maintainer decision records | Scope inferred without approval | Define explicit decision checkpoint |
| [`ORCH-PUB-001`](./reconciliation.md) | Secret and private-path exclusion | `✔️` | `verified-static`: filters and record checks exist | Full artifact scan not run | `relgeo/workspace` | Artifact scanner | Public leakage | Run complete artifact scan |
| [`ORCH-PUB-002`](./reconciliation.md) | No sibling-source leakage in public consumers | `🌗` | `unverified-runtime`: isolated runner exists | Public consumer gate unavailable | workspace + consumer owners | Node 24, registry, browser | Local source masks package defect | Run public consumer gate |
| [`ORCH-PUB-003`](./reconciliation.md) | Least-privilege CI and credential-free checkout | `🌗` | `verified-static`: integration checkout explicit; sync checkout gap | Sync checkout lacks explicit credential persistence policy | `relgeo/workspace` + CI | GitHub permissions | Credential persistence/excess permission | Set `persist-credentials: false`; review action scope |
| [`ORCH-PUB-004`](./reconciliation.md) | Safe report/artifact retention and provenance | `✔️` | `verified-static`: 7-day retention and SHA metadata | Uploaded artifact availability not queried | `relgeo/workspace` + CI | Artifact service | Evidence becomes uncontrolled store | Query current artifact retention/provenance |

## Coverage and handoff

The matrix contains exactly the 39 expected capability IDs. The 19 rows marked
`❌` or `🌗` are represented in the [implementation-gap backlog](./implementation-gap-backlog.md).
The backlog is a candidate plan only: it does not close, promote, or change any
implementation status in this matrix.

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
