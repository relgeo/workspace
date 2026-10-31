# Expected Cross-Repository Orchestration Capability Catalog

**Status:** expected catalog selesai; implementation audit diterbitkan

**Tanggal katalog:** 2026-10-30

**Compatibility line:** RelGeo DSL `0.5`

**Owner keputusan dan katalog:** `relgeo/workspace`

**Audit:** [Cross-Repository Orchestration Implementation and Evidence Audit](./implementation-audit.md)

**Reconciliation:** [Expected-versus-Observed Cross-Repository Orchestration Reconciliation](./reconciliation.md)

**Status matrix:** [Cross-Repository Orchestration Capability Status Matrix](./status-matrix.md)

**Implementation-gap backlog:** [Cross-Repository Orchestration Implementation Gap Backlog](./implementation-gap-backlog.md)

**Bounded selection:** [Cross-Repository Orchestration bounded in-scope selection](./in-scope-selection.md)

**Boundary:** bootstrap, baseline, dependency orchestration, integration gates,
cross-repository CI synchronization, evidence reconciliation, release/recovery,
blocker/retry handling, dan public artifact hygiene untuk ekosistem RelGeo.

## 1. Tujuan dan aturan baca

Dokumen ini menetapkan kemampuan yang **seharusnya tersedia** agar maintainer,
kontributor repository anak, operator release, CI, dan consumer publik dapat
menjalankan RelGeo sebagai satu ekosistem lintas-repository. Capability tetap
dicatat walaupun belum pernah diimplementasikan atau belum memiliki evidence.

Katalog ini adalah input untuk audit berikutnya. Setiap row memiliki:

- ID stabil;
- user outcome;
- dasar requirement;
- keputusan scope;
- owner/source of truth; dan
- status verifikasi katalog.

`CATALOG-VERIFIED` berarti row telah diturunkan dan dicek terhadap requirement
documenter yang dirujuk. Itu **bukan** klaim bahwa implementasi tersedia,
workflow lulus, atau evidence runtime sudah ada. Audit implementation wajib
menggunakan ID yang sama dan menambahkan status implementation/evidence secara
terpisah.

Aturan sumber daftar awal:

1. daftar ini diturunkan dari user journey, target pengguna, workflow produk,
   command/workflow surface, roadmap, kontrak DSL, dan keputusan scope;
2. `docs/MATURATION-MASTER-PLAN.md`, `docs/REPOSITORY-MAP.md`, sub-rencana
   integration/release, workflow CI, `scripts/README.md`, dan `spec/id/README.md`
   adalah dasar requirement yang dibaca sebelum penyusunan row;
3. kode, report runtime, status matrix, implementation audit, dan matrix lama
   bukan sumber daftar expected awal. Artefak tersebut baru boleh dipakai pada
   audit downstream setelah katalog ini direview.

## 2. Target pengguna dan expected journey

| Target pengguna | Outcome operasional yang diharapkan |
| --- | --- |
| Maintainer/orchestrator | Dapat melihat baseline, dependency, gate, evidence, blocker, dan next action secara konsisten. |
| Kontributor repository anak | Dapat mengirim hasil CI yang dapat diverifikasi dan disinkronkan tanpa mengubah root `main` secara diam-diam. |
| Operator release | Dapat menjalankan preflight, publish berurutan, verifikasi registry, dan recovery forward-fix dengan jejak keputusan yang jelas. |
| Consumer/integrator publik | Mendapat package dan artifact yang dibangun dari dependency publik, compatibility line, dan revision yang dapat ditelusuri. |
| CI/workflow | Dapat menjalankan gate reproducible, mengirim event tervalidasi, menyimpan report aman, dan berhenti pada failure yang actionable. |

Journey lintas-repository yang menjadi sumber expected set:

```mermaid
flowchart LR
  clone["fresh clone"] --> bootstrap["bootstrap toolchain + submodules"]
  bootstrap --> baseline["baseline / compatibility / conformance"]
  baseline --> graph["dependency graph + ordered gates"]
  graph --> local["local workspace gate"]
  local --> public["isolated public-registry gate"]
  public --> ci["canonical CI + child dispatch"]
  ci --> reconcile["reconcile evidence + baseline"]
  reconcile --> release["release preflight / publish / verify"]
  release --> recover{ "failure?" }
  recover -- "yes" --> recovery["classify blocker + forward-fix / rerun"]
  recover -- "no" --> artifact["public artifact and evidence hygiene"]
  recovery --> artifact
```

### 2.1 Command dan workflow surface yang membentuk boundary

| Surface | Expected product outcome | Requirement source |
| --- | --- | --- |
| `pnpm install --frozen-lockfile` | Workspace dependency dapat dipulihkan secara deterministik. | `scripts/README.md`; Integration Plan §10 |
| `node scripts/verify-baseline.mjs --strict` dan failure injection | Gitlink, checkout, manifest, package metadata, dan clean state dapat diverifikasi serta mismatch dapat dibuktikan gagal. | `scripts/README.md`; Integration Plan Stage B |
| `pnpm run compatibility:check` | DSL/package/consumer compatibility line tetap satu dan mismatch berhenti sebelum gate. | Contract Versioning Plan §2–§4; Integration workflow |
| `pnpm run conformance:fixtures` / `pnpm run flutter:conformance` | Shared contract diuji pada consumer yang relevan dengan status fixture yang jelas. | `scripts/README.md`; Master Plan Tahap 4/6 |
| `pnpm run integration:gate -- --local` | Gate workspace menjalankan package dan consumer dalam dependency order. | Integration Plan §5.1–§5.4 |
| `pnpm run integration:public` | Consumer diuji dari temporary checkout dan registry tanpa sibling source. | Integration Plan §2.3, Stage C–D |
| `Integration` workflow | Local, public, Flutter, desktop, report artifact, timeout, dan concurrency dijalankan pada CI canonical. | `.github/workflows/integration.yml` |
| `repository_dispatch` / `workflow_dispatch` sync | Child CI yang sukses mengusulkan pointer submodule yang exact dan dapat direview. | `sync-validated-submodule-after-ci.yml`; Integration Plan §5.6 |
| `pnpm run release:preflight`, `release:audit`, `release:verify-published` | Candidate release diperiksa sebelum dan sesudah publish manual. | Release Guard §3–§5; `scripts/README.md` |
| `pnpm run release:recovery:plan` | Partial release menghasilkan boundary forward-fix yang read-only dan tidak mengulang versi gagal. | Release Guard §3.4, §6 |

## 3. Requirement register

| Code | Requirement / decision | Source of truth |
| --- | --- | --- |
| `R-JOURNEY` | RelGeo harus dapat dipulihkan dari fresh clone, diuji sebagai dependency graph publik, lalu dirilis/direkonsiliasi dengan evidence. | `docs/MATURATION-MASTER-PLAN.md` §2.5, Tahap 1, §8; Integration Plan §1 |
| `R-BOUNDARY` | `relgeo/workspace` adalah root orkestrasi publik; child repository mempertahankan source dan ownership masing-masing. | `docs/MATURATION-MASTER-PLAN.md` §2.1–§2.3; `docs/REPOSITORY-MAP.md` |
| `R-DSL` | RelGeo DSL `0.5` memiliki source normatif di `spec/id`; perubahan contract harus dipisahkan dari package/app version. | `spec/id/README.md`; Contract Versioning Plan §1–§2 |
| `R-BASELINE` | Revision spec, gitlink, checkout, package metadata, compatibility line, dan clean state harus membentuk baseline yang reproducible. | Integration Plan Stage B; `scripts/README.md` |
| `R-CONFORMANCE` | Shared fixture membedakan active, legacy, invalid, diagnostic/error, dan candidate evidence; candidate tidak otomatis menjadi active contract. | `scripts/README.md`; Master Plan Tahap 4; Decision 07/09 |
| `R-GATE` | Local dan public integration gate harus memakai entrypoint terdokumentasi, dependency order, failure exit code, dan report actionable. | Integration Plan §2, §5, §9 |
| `R-CI-DISPATCH` | Child CI hanya boleh memicu sinkronisasi untuk repository/path/workflow/SHA/run yang allowlisted dan tervalidasi. | Integration Plan §5.6; `.github/workflows/sync-validated-submodule-after-ci.yml` |
| `R-EVIDENCE` | Implementation, verification, decision, scope, local/public/canonical evidence, dan limitation harus dipisahkan; evidence tidak boleh dipromosikan diam-diam. | Master Plan §2.7; `docs/REPOSITORY-MAP.md` capability boundary |
| `R-RELEASE` | Release npm manual berjalan dalam dependency order, memakai preflight/tarball audit, registry verification, dan public integration. | Release Guard §2–§3; Contract Versioning Plan §2.3 |
| `R-RECOVERY` | npm partial release bukan transaksi rollback; recovery memakai stop, record, forward-fix versi baru, dan verifikasi ulang. | Release Guard §2, §3.4, §6; Decision 07 §7 |
| `R-OPS` | Failure harus actionable; blocker environment/dependency/decision harus dibedakan dari target defect; retry/rerun harus bounded dan tidak menghapus evidence. | Master Plan §2.5, §2.7, §8; Integration Plan §8; workflow timeout/concurrency |
| `R-PUBLIC` | Public tree, tarball, report, artifact, dan workflow tidak boleh membocorkan credential, private path, source sibling, atau data operator. | Master Plan §2.2; `scripts/README.md`; Integration workflow permissions |
| `R-SCOPE` | Desktop/web/CLI adalah scope aktif; Flutter non-publishable; Android/iOS dan raw SVG byte equality ditunda/non-goal. | Decision 07; Decision 09; `docs/REPOSITORY-MAP.md` |

## 4. Scope decisions

- **IN:** fresh clone/bootstrap, recursive submodule lifecycle, baseline and
  compatibility verification, shared conformance, package/consumer gates,
  local/public separation, child CI dispatch, exact-SHA sync, evidence
  reconciliation, release preflight/manual publish verification, partial-release
  forward-fix, blocker classification, bounded retry policy, and public artifact
  hygiene.
- **IN WITH BOUNDARY:** Flutter and desktop jobs are coordinated evidence
  surfaces, not npm package dependencies; public smoke is post-deploy evidence;
  release automation remains manual until the accepted two-release prerequisite
  is met; recovery is planning/forward-fix, not rollback.
- **OUT:** monorepo conversion, deleting submodules, production deployment from
  local commands, automatic npm publish, atomic npm rollback, private operator
  data in tracked tree, Android/iOS delivery until scope is reopened, and raw
  SVG byte equality.
- **STATUS RULE:** `CATALOG-VERIFIED` validates the expected row only.
  Implementation status, evidence status, parity status, environment
  availability, and decision status must be added by a later audit without
  deleting or rewriting expected IDs.

## 4.1 Current audit join for the selected tranche

The catalog remains normative: the table below is a non-normative pointer to
the current audit/reconciliation for the seven selected capability boundaries.
It records the verified implementation status, evidence class, owner/source
boundary, dependency, and next action without changing the expected rows.

| ID | Current status | Evidence | Owner / source boundary | Dependency | Remaining gap / next action |
| --- | --- | --- | --- | --- | --- |
| `ORCH-BASE-002` | `🌗` / `partial-current` | Historical 2026-10-30 verifier: 3 stale pins and 11 dirty checkouts. Current overlay: 11 of 12 manifest pins are stale; all child checkouts are clean and match gitlinks. | `relgeo/workspace`; [`scripts/verify-baseline.mjs`](../../../scripts/verify-baseline.mjs), [`docs/integration-baseline.json`](../../integration-baseline.json) | Validated child CI, clean child checkouts | Reconcile exact child SHAs through the sync PR, then rerun strict baseline and integration. |
| `ORCH-EVID-002` | `🌗` / `partial-current` | Shared evidence envelope separates local/public/manual classes; current baseline remains stale | `relgeo/workspace`; [`scripts/orchestration-contract.mjs`](../../../scripts/orchestration-contract.mjs) and gate/preflight reports | Refreshed baseline and Node 24 integration host | Produce a current canonical run and retain class/limitation labels. |
| `ORCH-EVID-003` | `🌗` / `partial-current` | Reports bind root revision, baseline, compatibility line, toolchain, limitations, and child baseline entries | `relgeo/workspace` + child CI; integration/release report scripts | Validated child CI, artifact/report retention | Join current child revisions to one canonical evidence record. |
| `ORCH-OPS-001` | `✔️` / `verified-static` | Owner/remediation/dependency fields and focused contract test pass | `relgeo/workspace` + stage owners; integration, release-preflight, and baseline scripts | Node 24 for full stage execution | Rerun the report contract with a supported integration stage. |
| `ORCH-OPS-002` | `✔️` / `verified-static` | Shared blocker taxonomy and dependency status distinguish blocked environment evidence from target defects | `relgeo/workspace`; [`scripts/orchestration-contract.mjs`](../../../scripts/orchestration-contract.mjs) | Live provider/child-run propagation | Exercise provider-backed propagation when available. |
| `ORCH-OPS-003` | `✔️` / `verified-static` | Bounded transient retry/backoff, deterministic non-retry, and attempt retention pass focused tests | `relgeo/workspace` + CI; integration and release-preflight runners | Supported CI transient failure and durable report retention | Verify a live transient attempt history in CI. |
| `ORCH-PUB-003` | `✔️` / `verified-static` | Sync checkout explicitly disables credential persistence; permission policy assertion passes | `relgeo/workspace` CI; `.github/workflows/sync-validated-submodule-after-ci.yml` | GitHub Actions PR/dispatch provider | Review one live exact-SHA sync PR/dispatch. |

All other expected capabilities retain their status and evidence in the
[status matrix](./status-matrix.md), [implementation audit](./implementation-audit.md),
and [reconciliation](./reconciliation.md). `➖` and `⏸️` scope boundaries remain
excluded from active implementation.

## 5. Expected capability catalog

All rows below are expected capabilities. No row below is an implementation
finding.

### 5.1 Catalog coverage proof

The expected set contains **39 unique `ORCH-*` IDs** across eight declared
orchestration surfaces. The count is a completeness check for this catalog,
not a claim that the capabilities are implemented:

| Surface | ID prefix | Expected rows |
| --- | --- | ---: |
| Fresh clone, bootstrap, and repository boundary | `ORCH-BOOT-*` | 4 |
| Baseline, compatibility, and conformance | `ORCH-BASE-*` | 5 |
| Dependency orchestration and integration gates | `ORCH-GATE-*` | 5 |
| Cross-repository CI dispatch and baseline sync | `ORCH-CI-*` | 5 |
| Evidence reconciliation and status truthfulness | `ORCH-EVID-*` | 5 |
| Release, recovery, and dependency publication | `ORCH-REL-*` | 6 |
| Blocker, retry, and operational control | `ORCH-OPS-*` | 5 |
| Public artifact and credential hygiene | `ORCH-PUB-*` | 4 |
| **Total** |  | **39** |

The source categories are all represented before implementation comparison:

| Required source category | Where it shapes the catalog |
| --- | --- |
| Surface user journeys | §2 journey from fresh clone through public artifact/evidence hygiene |
| Target users | §2 target-user table for maintainers, child-repository contributors, release operators, public consumers, and CI/workflows |
| Workflows and commands | §2.1 command/workflow surface, including bootstrap, baseline, integration, dispatch, release, and recovery entrypoints |
| Roadmap | Master Plan stages and exit gates listed in the evidence index |
| Contracts | DSL compatibility line, shared fixture semantics, package/release boundary, and evidence/report contracts in §3 |
| Scope decisions | §4 and the decision records listed in §7, including deferred mobile/raw-SVG work and manual publish/forward-fix boundaries |
| Workspace/repository ownership | `relgeo/workspace` root boundary, `docs/REPOSITORY-MAP.md`, and child-owner references in each row |

Expected rows are intentionally retained even when the later audit finds no
implementation, only partial evidence, or an environment blocker. Examples
include a deterministic fresh-clone bootstrap (`ORCH-BOOT-001`), bounded retry
and rerun control (`ORCH-OPS-003`), and joined artifact/public-smoke provenance
(`ORCH-EVID-004`). These examples demonstrate expected-but-missing capacity;
they are not implementation findings in this document and must be classified
only by the downstream audit.

### A. Fresh clone, bootstrap, and repository boundary

| ID | Capability expected | User outcome | Dasar requirement | Scope decision | Owner / source of truth | Status verifikasi |
| --- | --- | --- | --- | --- | --- | --- |
| `ORCH-BOOT-001` | Fresh clone bootstrap entrypoint | Maintainer can turn a clean clone into a usable workspace using short, deterministic instructions. | `R-JOURNEY`, `R-BASELINE` | **IN**; must be runnable without operator-specific paths or private files. | `relgeo/workspace`; `scripts/README.md`, Master Plan §8 | `CATALOG-VERIFIED` |
| `ORCH-BOOT-002` | Pinned toolchain and dependency bootstrap | Operator gets the declared Node/pnpm/toolchain and frozen dependency install before gates run. | `R-JOURNEY`, `R-GATE` | **IN**; missing prerequisite is a named blocker, not silent fallback. | `relgeo/workspace`; `scripts/README.md`, Integration workflow | `CATALOG-VERIFIED` |
| `ORCH-BOOT-003` | Recursive submodule initialization and synchronization | All declared child repositories are present at the workspace checkout boundary. | `R-BOUNDARY`, `R-BASELINE` | **IN**; workspace owns gitlinks/pointers, child source remains child-owned. | `relgeo/workspace`; `docs/REPOSITORY-MAP.md`, Integration Plan §2.1 | `CATALOG-VERIFIED` |
| `ORCH-BOOT-004` | Public workspace boundary hygiene | A fresh checkout contains only public orchestration material needed to reproduce gates. | `R-BOUNDARY`, `R-PUBLIC` | **IN**; private/operator logs and caches stay outside tracked/public surfaces. | `relgeo/workspace`; Master Plan §2.2, `scripts/README.md` | `CATALOG-VERIFIED` |

### B. Baseline, compatibility, and conformance

| ID | Capability expected | User outcome | Dasar requirement | Scope decision | Owner / source of truth | Status verifikasi |
| --- | --- | --- | --- | --- | --- | --- |
| `ORCH-BASE-001` | Versioned integration baseline manifest | Maintainer can identify the exact workspace, spec, child revisions, package versions, and consumer revisions under test. | `R-BASELINE`, `R-EVIDENCE` | **IN**; snapshot is explicit and reviewable, not an inferred branch state. | `relgeo/workspace`; `docs/integration-baseline.json`, Integration Plan §5.2 | `CATALOG-VERIFIED` |
| `ORCH-BASE-002` | Strict gitlink/checkout/manifest verification | Drift, dirty child checkout, missing submodule, or mismatched revision fails with a targeted diagnostic. | `R-BASELINE`, `R-OPS` | **IN**; strict mode rejects mismatch; diagnostic mode may inspect without mutation. | `relgeo/workspace`; `scripts/README.md`, Integration Plan Stage B | `CATALOG-VERIFIED` |
| `ORCH-BASE-003` | DSL/package/consumer compatibility verification | A contract change cannot silently mix incompatible DSL, package, peer, or consumer lines. | `R-DSL`, `R-BASELINE` | **IN**; active line is `0.5`; breaking change needs an explicit decision record. | `relgeo/spec` + `relgeo/workspace`; `spec/id/README.md`, Contract Versioning Plan §2 | `CATALOG-VERIFIED` |
| `ORCH-BASE-004` | Shared conformance orchestration | One fixture contract can be exercised across relevant TypeScript, CLI, Flutter, and consumer surfaces with status semantics preserved. | `R-CONFORMANCE`, `R-GATE` | **IN WITH BOUNDARY**; candidate evidence cannot promote a contract by itself. | `relgeo/workspace`; `scripts/README.md`, Master Plan Tahap 4/6 | `CATALOG-VERIFIED` |
| `ORCH-BASE-005` | Source-of-truth and ownership reconciliation | A reviewer can tell whether a fact belongs to spec, child implementation, workspace evidence, workflow, or decision record. | `R-BOUNDARY`, `R-EVIDENCE` | **IN**; orchestration docs do not replace normative spec or child repository ownership. | `relgeo/workspace`; `docs/REPOSITORY-MAP.md`, Master Plan §2.3 | `CATALOG-VERIFIED` |

### C. Dependency orchestration and integration gates

| ID | Capability expected | User outcome | Dasar requirement | Scope decision | Owner / source of truth | Status verifikasi |
| --- | --- | --- | --- | --- | --- | --- |
| `ORCH-GATE-001` | Dependency graph and deterministic gate order | Operator knows why a stage runs, which upstream result it needs, and which repository owns a failure. | `R-GATE`, `R-BASELINE` | **IN**; graph describes validation order and must not hide dependency cycles. | `relgeo/workspace`; Integration Plan §3, Stage C | `CATALOG-VERIFIED` |
| `ORCH-GATE-002` | Local workspace package gate | Package lint/test/build/pack-boundary checks run in the declared dependency order from workspace checkout. | `R-GATE`, `R-DSL` | **IN**; local workspace links are allowed only in local mode. | `relgeo/workspace` + package owners; Integration Plan Stage C | `CATALOG-VERIFIED` |
| `ORCH-GATE-003` | Isolated public-registry gate | Consumer install/build/test runs without sibling source or hidden local aliases and uses the pinned public package line. | `R-GATE`, `R-PUBLIC` | **IN**; public mode uses temporary checkout and registry dependencies. | `relgeo/workspace`; Integration Plan §2.3, `scripts/README.md` | `CATALOG-VERIFIED` |
| `ORCH-GATE-004` | Consumer artifact assembly and assertion | Playground and website artifacts are assembled in the same boundary expected by deployment and checked for required routes/files. | `R-GATE`, `R-PUBLIC` | **IN**; artifact assembly is evidence, not deployment authorization. | `relgeo/workspace` + website/Playground owners; Integration Plan Stage D | `CATALOG-VERIFIED` |
| `ORCH-GATE-005` | Independent cross-surface gate partitioning | TypeScript/package, Flutter, desktop, and public-registry failures remain separately diagnosable without making unrelated runtime dependencies. | `R-GATE`, `R-SCOPE` | **IN WITH BOUNDARY**; Flutter is coordinated but not a TypeScript runtime prerequisite. | `relgeo/workspace`; Integration workflow, Integration Plan §7 | `CATALOG-VERIFIED` |

### D. Cross-repository CI dispatch and baseline sync

| ID | Capability expected | User outcome | Dasar requirement | Scope decision | Owner / source of truth | Status verifikasi |
| --- | --- | --- | --- | --- | --- | --- |
| `ORCH-CI-001` | Validated child-CI success dispatch | A successful child `main` CI can request root synchronization with repository, path, SHA, run ID, and workflow metadata. | `R-CI-DISPATCH`, `R-EVIDENCE` | **IN**; dispatch is an evidence handoff, not an unconditional pointer update. | Child repository CI + `relgeo/workspace`; Integration Plan §5.6 | `CATALOG-VERIFIED` |
| `ORCH-CI-002` | Dispatch allowlist and payload validation | Unsupported repository/path/workflow/SHA/run payload is rejected before it can affect baseline state. | `R-CI-DISPATCH`, `R-PUBLIC` | **IN**; allowlist is explicit for `flutter`, `playground`, and `mcp` boundaries. | `relgeo/workspace`; `sync-validated-submodule-after-ci.yml` | `CATALOG-VERIFIED` |
| `ORCH-CI-003` | Authoritative child-run revalidation | Root verifies exact `head_sha`, repository, branch, event, workflow path, and successful conclusion through the CI provider. | `R-CI-DISPATCH`, `R-EVIDENCE` | **IN**; payload claims are untrusted until matched to the authoritative run. | `relgeo/workspace`; `sync-validated-submodule-after-ci.yml` | `CATALOG-VERIFIED` |
| `ORCH-CI-004` | Exact pointer staging and baseline regeneration | Root stages the exact validated child commit, regenerates baseline, and reruns strict/compatibility checks before proposing a change. | `R-CI-DISPATCH`, `R-BASELINE` | **IN**; root `main` is not written directly by the sync workflow. | `relgeo/workspace`; Integration Plan §5.6, sync workflow | `CATALOG-VERIFIED` |
| `ORCH-CI-005` | Reviewable synchronization PR and integration dispatch | Each accepted child update is reviewable as a PR and is followed by the normal root Integration workflow. | `R-CI-DISPATCH`, `R-GATE` | **IN**; branch protection and normal Integration remain authoritative for merge. | `relgeo/workspace`; `sync-validated-submodule-after-ci.yml` | `CATALOG-VERIFIED` |

### E. Evidence reconciliation and status truthfulness

| ID | Capability expected | User outcome | Dasar requirement | Scope decision | Owner / source of truth | Status verifikasi |
| --- | --- | --- | --- | --- | --- | --- |
| `ORCH-EVID-001` | Machine-readable gate report | Reviewer can inspect mode, revision, compatibility line, stage, command, duration, pass/fail, and failure reason without rerunning everything. | `R-EVIDENCE`, `R-GATE` | **IN**; report excludes absolute operator paths and private environment. | `relgeo/workspace`; Integration Plan §5.3, `scripts/README.md` | `CATALOG-VERIFIED` |
| `ORCH-EVID-002` | Evidence class separation | Local, public-registry, CI/canonical, manual, and public-deployment evidence retain their scope and are not promoted into one another. | `R-EVIDENCE` | **IN**; evidence class is part of the claim, not optional metadata. | `relgeo/workspace`; Master Plan §2.7, `docs/REPOSITORY-MAP.md` | `CATALOG-VERIFIED` |
| `ORCH-EVID-003` | Revision-to-evidence traceability | Every release or baseline claim identifies the exact root/child revisions, toolchain, run, artifact, and limitation that were actually tested. | `R-BASELINE`, `R-EVIDENCE` | **IN**; a newer pointer cannot inherit older CI evidence silently. | `relgeo/workspace`; Master Plan §0/§2.7, Integration Plan §5.2 | `CATALOG-VERIFIED` |
| `ORCH-EVID-004` | Canonical artifact and public-smoke reconciliation | Built artifact, deployment route, public URL, and source baseline can be joined to the same evidence boundary. | `R-GATE`, `R-EVIDENCE`, `R-PUBLIC` | **IN WITH BOUNDARY**; public smoke is post-deploy evidence and may be environment-unavailable. | Website owner + `relgeo/workspace`; Integration Plan Stage D, Master Plan §8 | `CATALOG-VERIFIED` |
| `ORCH-EVID-005` | Honest environment-unavailable handling | Missing network, browser, SDK, disk, or host capability is recorded as unavailable/not verified rather than mislabeled as target parity failure. | `R-EVIDENCE`, `R-OPS` | **IN**; limitation must preserve next action and dependency impact. | `relgeo/workspace`; Master Plan §2.7, Integration Plan §8 | `CATALOG-VERIFIED` |

### F. Release, recovery, and dependency publication

| ID | Capability expected | User outcome | Dasar requirement | Scope decision | Owner / source of truth | Status verifikasi |
| --- | --- | --- | --- | --- | --- | --- |
| `ORCH-REL-001` | Release preflight composition | Release owner receives one read-only decision boundary covering clean tree, baseline, compatibility, release record, tarball audit, and local gate. | `R-RELEASE`, `R-EVIDENCE` | **IN**; preflight never publishes and stops before unsafe continuation. | `relgeo/workspace`; Release Guard §4–§6, `scripts/README.md` | `CATALOG-VERIFIED` |
| `ORCH-REL-002` | Public tarball and metadata hygiene gate | Only intended public files, metadata, license, and dependency declarations enter a package artifact. | `R-RELEASE`, `R-PUBLIC` | **IN**; `npm pack --dry-run` is a boundary, not a substitute for tests. | Package owners + `relgeo/workspace`; Release Guard §2, `scripts/README.md` | `CATALOG-VERIFIED` |
| `ORCH-REL-003` | Manual ordered publish with operator stop | Maintainer publishes one package at a time in dependency order and can stop safely after any failure. | `R-RELEASE`, `R-RECOVERY` | **IN**; npm publish remains manual until accepted automation prerequisites are met. | `relgeo/workspace` release owner; Release Guard §2–§3, Decision 09 | `CATALOG-VERIFIED` |
| `ORCH-REL-004` | Post-publish registry and consumer verification | Published versions are checked from the registry and exercised by a clean public consumer before baseline update. | `R-RELEASE`, `R-GATE`, `R-EVIDENCE` | **IN**; registry evidence does not imply public deployment evidence. | `relgeo/workspace` + package/consumer owners; Release Guard §3.3 | `CATALOG-VERIFIED` |
| `ORCH-REL-005` | Partial-release forward-fix recovery | If a later package fails, operator records last published/first failed state, never republishes the failed version, and resumes with a newer compatible patch. | `R-RECOVERY`, `R-RELEASE` | **IN**; recovery is forward-fix, not deletion or atomic rollback. | `relgeo/workspace` release owner; Release Guard §3.4/§6, Decision 07 §7 | `CATALOG-VERIFIED` |
| `ORCH-REL-006` | Release decision record and no-op guard | Release scope, contract classification, rationale, approval, package order, evidence, and intentional deferral are reviewable before final claims. | `R-RELEASE`, `R-DSL`, `R-SCOPE` | **IN**; no-op release is not a substitute for a real package change. | `relgeo/workspace`; Release Guard §2–§4, Decision 09 | `CATALOG-VERIFIED` |

### G. Blocker, retry, and operational control

| ID | Capability expected | User outcome | Dasar requirement | Scope decision | Owner / source of truth | Status verifikasi |
| --- | --- | --- | --- | --- | --- | --- |
| `ORCH-OPS-001` | Actionable failure ownership | A failed stage names the repository/surface, command, reason, evidence boundary, and remediation owner. | `R-GATE`, `R-OPS` | **IN**; generic red status without next action is insufficient. | `relgeo/workspace` + stage owner; Integration Plan §5.3, §8 | `CATALOG-VERIFIED` |
| `ORCH-OPS-002` | Blocker classification and dependency propagation | Operator can distinguish target defect, missing service/dependency, environment unavailable, and pending human decision, and knows which downstream tasks are blocked. | `R-OPS`, `R-EVIDENCE` | **IN**; environment unavailable is not target parity failure and only dependent work is blocked. | `relgeo/workspace`; Master Plan §2.7, Integration Plan §8 | `CATALOG-VERIFIED` |
| `ORCH-OPS-003` | Bounded retry and rerun policy | Transient/environment failures may be retried with a bounded attempt and preserved reports; deterministic contract failures require remediation before rerun. | `R-OPS`, `R-EVIDENCE` | **IN**; no blind infinite retry or evidence overwrite. | `relgeo/workspace`; workflow timeouts/concurrency, Integration Plan §8 | `CATALOG-VERIFIED` |
| `ORCH-OPS-004` | Cancellation, concurrency, and idempotent replay | Superseded runs are cancelled, duplicate sync for an already-pointed SHA is harmless, and replay does not create a false new baseline. | `R-OPS`, `R-CI-DISPATCH` | **IN**; cancellation must not erase the retained audit trail. | `relgeo/workspace`; both GitHub workflows, Integration Plan §5.6 | `CATALOG-VERIFIED` |
| `ORCH-OPS-005` | Human decision boundary | Scope changes, release automation, mobile reopening, and contract promotion stop for explicit maintainer decision instead of inferred approval. | `R-SCOPE`, `R-RELEASE`, `R-EVIDENCE` | **IN**; accepted deferral is a state, not an unowned failure. | `relgeo/workspace`; Decision 07/09, Master Plan §2.5 | `CATALOG-VERIFIED` |

### H. Public artifact and credential hygiene

| ID | Capability expected | User outcome | Dasar requirement | Scope decision | Owner / source of truth | Status verifikasi |
| --- | --- | --- | --- | --- | --- | --- |
| `ORCH-PUB-001` | Secret and private-path exclusion | Public reports, tarballs, logs, and artifacts do not contain credentials, `.env` material, absolute operator paths, or private directories. | `R-PUBLIC` | **IN**; rejection is a hard gate for public mode/release evidence. | `relgeo/workspace`; Master Plan §2.2, `scripts/README.md` | `CATALOG-VERIFIED` |
| `ORCH-PUB-002` | No sibling-source leakage in public consumers | Public consumer validation proves packages work from registry/artifact boundaries, not from local sibling source. | `R-PUBLIC`, `R-GATE` | **IN**; relative source dependency is a public integration failure. | `relgeo/workspace` + consumer owners; Integration Plan §2.3/Stage D | `CATALOG-VERIFIED` |
| `ORCH-PUB-003` | Least-privilege CI and credential-free checkout | CI reads and verifies by default, does not persist Git credentials, and only uses narrowly scoped dispatch/PR permissions where required. | `R-PUBLIC`, `R-CI-DISPATCH` | **IN**; workflow permissions must match the mutation boundary. | `relgeo/workspace`; `.github/workflows/integration.yml`, sync workflow | `CATALOG-VERIFIED` |
| `ORCH-PUB-004` | Safe report/artifact retention and provenance | Uploaded reports/artifacts have bounded retention and enough provenance to be useful without becoming an uncontrolled data store. | `R-PUBLIC`, `R-EVIDENCE` | **IN**; retention is limited and evidence remains linked to revision/run. | `relgeo/workspace`; Integration workflow summaries/artifact settings | `CATALOG-VERIFIED` |

## 6. Audit handoff

Implementation audit may begin only after review of this catalog. The audit must
preserve every `ORCH-*` ID and add, at minimum:

| Audit field | Meaning |
| --- | --- |
| `implementation status` | `present`, `partial`, `absent`, `broken`, or `deferred` at the declared boundary. |
| `verification status` | Evidence class, revision/run, command, and whether the environment was available. |
| `observed behavior` | What was actually inspected or executed; do not restate requirement text as evidence. |
| `gap / limitation` | Missing behavior, scope boundary, stale evidence, or environment blocker. |
| `owner / next action` | Repository/role responsible for remediation or evidence refresh. |

An audit must not remove a capability because no code or test was found. If a
requirement changes, record a new scope decision and update the expected catalog
before changing the expected set. A failed reference or unavailable environment
must remain observational evidence and must not be converted into a target
parity failure without a valid target observation.

## 7. Evidence index used for catalog construction

- `relgeo/workspace` workspace root — root `package.json`, `.gitmodules`,
  `scripts/`, `.github/workflows/`, and `docs/` establish the orchestration
  surface and its public repository boundary.
- `docs/MATURATION-MASTER-PLAN.md` — ecosystem boundary, priorities, stage
  acceptance, status vocabulary, evidence rules, and definition of done.
- `docs/REPOSITORY-MAP.md` — repository ownership, public boundary, MCP/Flutter
  posture, package family, and documentation ownership.
- `docs/plans/01-cross-repo-integration-gate.md` — fresh checkout, baseline,
  dependency order, local/public gate, CI workflow, dispatch synchronization,
  failure handling, and exit gate.
- `docs/plans/03-npm-release-guard.md` — release preflight, tarball boundary,
  manual ordered publish, registry verification, partial-release recovery, and
  intentionally deferred automation.
- `.github/workflows/integration.yml` — CI jobs, toolchain, permissions,
  timeout/concurrency, reports, local/public separation, and Flutter/desktop
  boundaries.
- `.github/workflows/sync-validated-submodule-after-ci.yml` — dispatch payload
  validation, exact child-run verification, pointer staging, baseline refresh,
  synchronization PR, and Integration dispatch.
- `scripts/README.md` — bootstrap prerequisites, baseline/conformance commands,
  local/public mode semantics, release commands, report safety, and recovery
  planner boundary.
- `spec/id/README.md` and `docs/plans/02-contract-versioning.md` — normative
  DSL ownership, active `0.5` contract, and contract/package/consumer separation.
- `docs/decisions/07-cross-repo-open-decisions.md` and
  `docs/plans/09-approved-decisions-execution-plan.md` — accepted scope for
  promotion, platform posture, manual npm release, forward-fix, and deferred
  mobile/raw-SVG work.

The following are intentionally **not** used as the initial expected-set source:
implementation source, workflow execution output, prior capability matrices,
implementation audits, reconciliations, and gap backlogs. They are downstream
inputs for the next task only.
