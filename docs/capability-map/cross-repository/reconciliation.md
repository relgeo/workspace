# Expected-versus-Observed Cross-Repository Orchestration Reconciliation

> **Historical snapshot retained:** the dated verifier observations and audit join below are historical. The current-head closure overlay supersedes them for all revision-sensitive decisions.

**Status:** reconciliation selesai pada current HEAD; every expected capability has one current disposition

**Tanggal:** 2026-11-14

**Expected source:** [Expected Cross-Repository Orchestration Capability Catalog](./expected-capability-catalog.md)

**Observed source:** [Cross-Repository Orchestration Implementation and Evidence Audit](./implementation-audit.md)

**Status matrix:** [Cross-Repository Orchestration Capability Status Matrix](./status-matrix.md)

**Implementation-gap backlog:** [Cross-Repository Orchestration Implementation Gap Backlog](./implementation-gap-backlog.md)

**Scope:** 39 expected capability IDs pada katalog lintas-repository RelGeo.

**Current closure report:** [Cross-Repository Closure Report](../../evidence/cross-repository-closure-report-2026-11-27.json)

## 0. Current HEAD rebaseline overlay — 2026-11-27

The authoritative current-head reconciliation for the 18 rows that were `🌗`
in the historical reporting matrix is the [Cross-Repository Rebaseline and
Disposition Register](../../evidence/cross-repository-rebaseline-2026-11-27.json)
and its before/after [Cross-Repository Closure Report](../../evidence/cross-repository-closure-report-2026-11-27.json). The register records
the expected ID, observed state, disposition, owner, source-of-truth path,
dependency, evidence locator, tested revision, and claim limit for every row.

The current root is `296f6881896577bc27f711f27285a07f8dc3bac1`. The generated
baseline and local synchronization report now record the matching 12-child
tuple; `check-baseline-synchronization.mjs` passes `101/101` checks and the
strict verifier passes `87` checks. The isolated fresh-checkout report also
passes Node `v24.21.0`, pnpm `10.33.3`, recursive submodule initialization, and
12/12 gitlink alignment. This is local-host evidence using local submodule
mirrors; registry-backed install, provider CI, deployment, and public-runtime
claims remain `⏸️`/not verified at this boundary.

The current cross-surface reconciliation report
[`cross-repository-cross-surface-reconciliation-2026-11-27.json`](../../evidence/cross-repository-cross-surface-reconciliation-2026-11-27.json)
joins all 12 child commits to their root gitlinks and generated baseline
revisions, checks the Flutter-to-MCP and spec consumer references, and validates
the three child-CI dispatch metadata contracts. It reports `25/25` checks,
zero stale pointers, and zero stale contract references. No child source change
was required at this revision, so `gitlinkUpdateRequired=false`; the report
retains the exact current child commit tuple rather than inventing a promotion.

The `⏸️` values mean “held for the named environment, provider, or scope
boundary.” They are assigned dispositions with remediation and claim limits,
not unassigned gaps. The current matrix has 26 `✔️`, 13 `⏸️`, and zero
actionable `🌗`/`❌`/`⚠️`; the original 18 `🌗` symbols remain only in the dated
historical snapshot and closure report's `before` section.

## 1. Cara membaca rekonsiliasi

Rekonsiliasi ini adalah join berdasarkan ID stabil `ORCH-*`. Setiap ID dari
katalog expected muncul tepat satu kali di tabel §3 dan ditelusurkan ke row ID
yang sama pada audit implementation. Expected capability yang belum ada tetap
dipertahankan sebagai `❌`; ketiadaan evidence tidak diubah menjadi scope
`➖`.

Kolom sengaja dipisahkan:

| Kolom | Arti |
| --- | --- |
| `Scope decision` | Keputusan katalog: `IN` atau `IN WITH BOUNDARY`. Ini bukan hasil audit. |
| `Implementation status` | Hasil observasi: `implemented`, `partial`, `absent`, `broken`, `deferred`, atau `not-applicable`. |
| `Evidence status` | Kualitas/keterkinian evidence: `verified-current`, `verified-static`, `partial-current`, `unverified-runtime`, atau status audit lain yang dinyatakan eksplisit. |
| `Reconciliation` | Ringkasan parity implementation-versus-expected; tidak menggantikan dua status di atas. |
| `Audit trace` | Link ke bagian audit dan ID yang menjadi dasar hasil. |

### Reconciliation legend

| Symbol | Rule |
| --- | --- |
| `✔️` | Implementasi terobservasi sebagai `implemented` dan evidence tersedia pada boundary yang dinyatakan audit (`verified-current` atau `verified-static`). |
| `🌗` | Historical partial state; not a current disposition after the 2026-11-27 closure review. |
| `❌` | Implementasi `absent` atau `broken`. Tidak ada selected row yang masih absent after the focused contract evidence. |
| `➖` | Hanya untuk capability yang secara eksplisit `deferred` atau `not-applicable` oleh scope. Tidak ada dari 39 expected ID yang mendapat `➖`. |

`verified-static` tetap dicatat terpisah dari `✔️`: simbol tersebut berarti
implementasi terlihat pada source/config/docs/fixture, bukan bahwa runtime
canonical terbaru sudah dijalankan. Demikian juga `🌗` untuk runtime yang belum
terverifikasi bukan klaim bahwa target implementation rusak.

## 2. Rekonsiliasi summary — current HEAD

| Reconciliation | Count | Meaning |
| --- | ---: | --- |
| `✔️` | 26 | Current implementation/evidence boundary is sufficient for the stated claim. |
| `🌗` | 0 | No current partial disposition remains; historical partials are in the closure report. |
| `❌` | 0 | Tidak ada expected capability yang absent/broken pada boundary audit saat ini. |
| `➖` | 0 | Tidak ada expected ID yang dikeluarkan dari scope. |
| `⏸️` | 13 | Assigned environment/provider/scope boundary with remediation and claim limit. |
| **Total** | **39** | Sama dengan jumlah unique ID pada katalog expected. |

Implementation status dan evidence status pada seluruh join tetap mengikuti audit:

| Implementation status | Count | Evidence status | Count |
| --- | ---: | --- | ---: |
| `implemented` | 39 | `verified-current` | 13 |
| `partial` | 0 | `verified-static` | 21 |
| `absent` | 0 | `partial-current` | 0 |
| `broken` | 0 | `unverified-runtime` | 5 |
| `deferred` | 0 | `deferred-scope` | 0 |
| `not-applicable` | 0 | **Total** | **39** |

### 2.1 Current consumer-boundary checkpoint — 2026-11-14

This checkpoint records the current root orchestration boundary without
promoting unavailable external evidence. Local fixture and conformance results
are separate from CI/public claims, and the reconciliation symbols above remain
unchanged.

| Boundary | Result | Evidence class / limitation |
| --- | --- | --- |
| `pnpm run public-boundary:contract:test` | **PASS** | Local fixture evidence for safe entries and fail-closed unsafe path/content handling. |
| `pnpm run bootstrap:contract:test` | **PASS** | Local bootstrap report and public-boundary consumer contract. |
| `pnpm run orchestration:contract:test` | **PASS** | Local blocker/retry/sync/decision-gate contract evidence. |
| `pnpm run child-ci:contract:test` | **PASS** | Static validated-child-CI synchronization policy; no live provider dispatch. |
| `pnpm run integration:evidence:test` | **PASS** | Local current-revision evidence join and historical-evidence rejection. |
| `pnpm run conformance:fixtures` | **677 passed, 0 failed across 33 fixtures** | Local shared downstream parser/renderer/service/CLI/preview/highlighting path. |
| `node scripts/run-integration-gate.mjs --local --report=/private/tmp/relgeo-consumer-local-boundary.json` | **Exit 2 / environment-unavailable** | Host Node `22.23.2`; runner requires Node `24+` and stops before consumer stages. |
| `node scripts/run-integration-gate.mjs --public --report=/private/tmp/relgeo-consumer-public-boundary.json` | **Exit 2 / environment-unavailable** | Same Node prerequisite; no registry/deployment/public consumer result is inferred. |
| Current CI/public consumer evidence | **NOT VERIFIED** | Historical CI/public records remain scoped to their recorded revisions. |

The current local result is “no regression observed” for the selected root
orchestration consumers. Fresh/isolated package installation, live CI
dispatch, registry, deployed artifact, and public-host checks remain
unverified or deferred until their prerequisites are available.

## 2.2 Current-head disposition join — 2026-11-27

The following overlay is the active disposition for every historical partial
row. Full owner, source-of-truth, dependency, repository/path, evidence,
revision, claim-limit, and closure-task fields are in the [closure report](../../evidence/cross-repository-closure-report-2026-11-27.json).

| ID | Current disposition | Evidence class | Current boundary | Evidence locator |
| --- | --- | --- | --- | --- |
| `ORCH-BOOT-001` | `✔️` | verified-local | Fresh checkout and bootstrap contract pass | closure report row |
| `ORCH-BOOT-002` | `⏸️` | environment-unavailable | Registry-backed frozen install unavailable | closure report row |
| `ORCH-BOOT-003` | `✔️` | verified-local | 12 recursive children match gitlinks | closure report row |
| `ORCH-BOOT-004` | `⏸️` | environment-unavailable | Five canonical artifact roots unavailable | closure report row |
| `ORCH-BASE-001` | `✔️` | verified-local | Generated baseline matches current tuple | closure report row |
| `ORCH-BASE-002` | `✔️` | verified-local | Strict baseline and synchronization pass | closure report row |
| `ORCH-BASE-003` | `⏸️` | environment-unavailable | Canonical Node 24 dependency boundary unavailable | closure report row |
| `ORCH-BASE-004` | `⏸️` | environment-unavailable | Flutter parity boundary unavailable | closure report row |
| `ORCH-GATE-002` | `⏸️` | environment-unavailable | Local package stages blocked by dependencies | closure report row |
| `ORCH-GATE-003` | `⏸️` | environment-unavailable | Registry DNS unavailable | closure report row |
| `ORCH-EVID-002` | `⏸️` | evidence-only | Historical/provider records remain non-canonical | closure report row |
| `ORCH-EVID-003` | `✔️` | verified-local | Current root and child tuple joined | closure report row |
| `ORCH-EVID-004` | `⏸️` | environment-unavailable | Deployment/browser/public artifact join unavailable | closure report row |
| `ORCH-REL-001` | `⏸️` | environment-unavailable | Supported release host unavailable | closure report row |
| `ORCH-REL-004` | `⏸️` | environment-unavailable | Registry and public consumer unavailable | closure report row |
| `ORCH-REL-005` | `⏸️` | scope-held | Live partial release intentionally not created | closure report row |
| `ORCH-OPS-005` | `⏸️` | evidence-only | Provider-side decision enforcement unobserved | closure report row |
| `ORCH-PUB-002` | `⏸️` | environment-unavailable | Public consumer isolation unavailable | closure report row |

## 3. Historical one-to-one expected-versus-observed audit join

The table below is retained as the historical audit snapshot. Its symbols and
observations are not current claims; use §2.2 and the closure report for the
current-head disposition.

| ID | Expected capability | Scope decision | Implementation status | Evidence status | Reconciliation | Audit trace | Gap / next action |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `ORCH-BOOT-001` | Fresh clone bootstrap entrypoint | `IN` | `implemented` | `unverified-environment` | `🌗` | [Audit §4 — ORCH-BOOT-001](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map) | `scripts/bootstrap.mjs` and contract fixture exist; execute the fresh-clone probe on Node 24. |
| `ORCH-BOOT-002` | Pinned toolchain and dependency bootstrap | `IN` | `implemented` | `unverified-environment` | `🌗` | [Audit §4 — ORCH-BOOT-002](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map) | Host reports Node 22.23.2/pnpm 10.33.3 while Node 24+ is declared; verify deterministic bootstrap on the supported toolchain. |
| `ORCH-BOOT-003` | Recursive submodule initialization and synchronization | `IN` | `implemented` | `partial-current` | `🌗` | [Audit §4 — ORCH-BOOT-003](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map) | 12 child worktrees are initialized and clean, but Flutter checkout differs from root gitlink; promote the validated pointer before claiming alignment. |
| `ORCH-BOOT-004` | Public workspace boundary hygiene | `IN` | `partial` | `partial-current` | `🌗` | [Audit §4 — ORCH-BOOT-004](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map) | [`public-boundary-audit-2026-11-14.json`](../../evidence/public-boundary-audit-2026-11-14.json) scans 325 tracked entries, 2 available artifact roots, consumer manifests, and 7 workflows without violations; five candidate artifact roots still require canonical Node 24/CI evidence. |
| `ORCH-BASE-001` | Versioned integration baseline manifest | `IN` | `implemented` | `partial-current` | `🌗` | [Audit §4 — ORCH-BASE-001](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map) | Manifest exists at capture `2026-11-13`, but the current Flutter child checkout is not the root-pinned revision; regenerate after validated sync. |
| `ORCH-BASE-002` | Strict gitlink/checkout/manifest verification | `IN` | `implemented` | `unverified-environment` | `🌗` | [Audit §4 — ORCH-BASE-002](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map) | Failure injection and contract checks pass; 11 child checkouts match current gitlinks, Flutter differs from the root pointer, recursive status has 1 non-clean marker, and the Node 24 strict verifier is unavailable on this host. |
| `ORCH-BASE-003` | DSL/package/consumer compatibility verification | `IN` | `implemented` | `partial-current` | `🌗` | [Audit §4 — ORCH-BASE-003](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map) | Supporting-local compatibility is `301/301` on Node 22.23.2; rerun on Node 24 with the promoted current baseline for canonical evidence. |
| `ORCH-BASE-004` | Shared conformance orchestration | `IN WITH BOUNDARY` | `partial` | `partial-current` | `🌗` | [Audit §4 — ORCH-BASE-004](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map) | Flutter runner is environment-blocked; cross-platform evidence remains incomplete. |
| `ORCH-BASE-005` | Source-of-truth and ownership reconciliation | `IN` | `implemented` | `verified-static` | `✔️` | [Audit §4 — ORCH-BASE-005](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map) | Ownership is documented, but no central machine-readable registry covers every stage. |
| `ORCH-GATE-001` | Dependency graph and deterministic gate order | `IN` | `implemented` | `verified-static` | `✔️` | [Audit §4 — ORCH-GATE-001](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map) | Gate order is declared; rerun current gate on Node 24. |
| `ORCH-GATE-002` | Local workspace package gate | `IN` | `implemented` | `unverified-runtime` | `🌗` | [Audit §4 — ORCH-GATE-002](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map) | Current package gate stopped at the Node prerequisite and needs a supported runtime. |
| `ORCH-GATE-003` | Isolated public-registry gate | `IN` | `implemented` | `unverified-runtime` | `🌗` | [Audit §4 — ORCH-GATE-003](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map) | Verify public registry/network and Node 24 together; no target failure inferred. |
| `ORCH-GATE-004` | Consumer artifact assembly and assertion | `IN` | `implemented` | `verified-static` | `✔️` | [Audit §4 — ORCH-GATE-004](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map) | Repeat website artifact and public-route assertion for the current baseline. |
| `ORCH-GATE-005` | Independent cross-surface gate partitioning | `IN WITH BOUNDARY` | `implemented` | `verified-static` | `✔️` | [Audit §4 — ORCH-GATE-005](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map) | Current canonical job evidence must be refreshed after pointer drift is reconciled. |
| `ORCH-CI-001` | Validated child-CI success dispatch | `IN` | `implemented` | `verified-static` | `✔️` | [Audit §4 — ORCH-CI-001](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map) | Static dispatch design exists; observe a real successful child run later. |
| `ORCH-CI-002` | Dispatch allowlist and payload validation | `IN` | `implemented` | `verified-static` | `✔️` | [Audit §4 — ORCH-CI-002](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map) | Add a workflow-level invalid-payload fixture/probe if provider testing is required. |
| `ORCH-CI-003` | Authoritative child-run revalidation | `IN` | `implemented` | `verified-static` | `✔️` | [Audit §4 — ORCH-CI-003](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map) | Provider API/token execution remains to be observed; static checks are explicit. |
| `ORCH-CI-004` | Exact pointer staging and baseline regeneration | `IN` | `implemented` | `verified-static` | `✔️` | [Audit §4 — ORCH-CI-004](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map) | Reconcile stale pointers through reviewable sync, never blind manifest write. |
| `ORCH-CI-005` | Reviewable synchronization PR and integration dispatch | `IN` | `implemented` | `verified-static` | `✔️` | [Audit §4 — ORCH-CI-005](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map) | Branch protection and PR merge remain provider-side evidence not observed locally. |
| `ORCH-EVID-001` | Machine-readable gate report | `IN` | `implemented` | `verified-static` | `✔️` | [Audit §4 — ORCH-EVID-001](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map) | Current integration report generation needs Node 24 gate completion. |
| `ORCH-EVID-002` | Evidence class separation | `IN` | `implemented` | `partial-current` | `🌗` | [Audit §4 — ORCH-EVID-002](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map) | Refresh canonical evidence after current baseline pointer sync. |
| `ORCH-EVID-003` | Revision-to-evidence traceability | `IN` | `implemented` | `partial-current` | `🌗` | [Audit §4 — ORCH-EVID-003](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map) | Shared evidence envelope is implemented; current baseline drift still requires validated child CI and regeneration. |
| `ORCH-EVID-004` | Canonical artifact and public-smoke reconciliation | `IN WITH BOUNDARY` | `partial` | `unverified-runtime` | `🌗` | [Audit §4 — ORCH-EVID-004](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map) | Join a fresh artifact, deployment URL, and exact source baseline in one evidence record. |
| `ORCH-EVID-005` | Honest environment-unavailable handling | `IN` | `implemented` | `verified-current` | `✔️` | [Audit §4 — ORCH-EVID-005](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map) | Shared blocker/evidence fields now preserve environment-unavailable evidence; extend to refreshed provider/Flutter reports later. |
| `ORCH-REL-001` | Release preflight composition | `IN` | `implemented` | `unverified-environment` | `🌗` | [Audit §4 — ORCH-REL-001](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map) | Current host is Node 22.23.2/pnpm 10.33.3 below the declared Node 24 requirement; supported-toolchain preflight remains unverified. |
| `ORCH-REL-002` | Public tarball and metadata hygiene gate | `IN` | `implemented` | `verified-current` | `✔️` | [Audit §4 — ORCH-REL-002](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map) | Keep constrained-host npm cache isolation documented; no publish was performed. |
| `ORCH-REL-003` | Manual ordered publish with operator stop | `IN` | `implemented` | `verified-static` | `✔️` | [Audit §4 — ORCH-REL-003](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map) | Live publish was intentionally not performed; automation remains future scope. |
| `ORCH-REL-004` | Post-publish registry and consumer verification | `IN` | `implemented` | `unverified-runtime` | `🌗` | [Audit §4 — ORCH-REL-004](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map) | Repeat on a network-available Node 24 host; interrupted probe is not a package failure. |
| `ORCH-REL-005` | Partial-release forward-fix recovery | `IN` | `implemented` | `partial-current` | `🌗` | [Audit §4 — ORCH-REL-005](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map) | Recovery injection passed, but no real partial release was created for runtime evidence. |
| `ORCH-REL-006` | Release decision record and no-op guard | `IN` | `implemented` | `verified-current` | `✔️` | [Audit §4 — ORCH-REL-006](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map) | Two post-decision manual releases remain an automation prerequisite, not a record defect. |
| `ORCH-OPS-001` | Actionable failure ownership | `IN` | `implemented` | `verified-static` | `✔️` | [Audit §4 — ORCH-OPS-001](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map) | Shared report fields and focused fixture are present; rerun full stages on Node 24. |
| `ORCH-OPS-002` | Blocker classification and dependency propagation | `IN` | `implemented` | `verified-static` | `✔️` | [Audit §4 — ORCH-OPS-002](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map) | Shared taxonomy and dependency-impact fields are present; live provider propagation remains follow-up evidence. |
| `ORCH-OPS-003` | Bounded retry and rerun policy | `IN` | `implemented` | `verified-static` | `✔️` | [Audit §4 — ORCH-OPS-003](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map) | Bounded transient retry, retry budget, attempt links, first-failure retention, and deterministic non-retry fixture pass; verify a live transient CI case later. |
| `ORCH-OPS-004` | Cancellation, concurrency, and idempotent replay | `IN` | `implemented` | `verified-static` | `✔️` | [Audit §4 — ORCH-OPS-004](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map) | Add duplicate-dispatch and cancellation-race fixture or document provider-level limits. |
| `ORCH-OPS-005` | Human decision boundary | `IN` | `partial` | `verified-static` | `🌗` | [Audit §4 — ORCH-OPS-005](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map) | Local `evaluateDecisionGate()` and release-preflight enforcement are verified-static; provider-side scope/release enforcement and a current canonical decision record remain unobserved. |
| `ORCH-PUB-001` | Secret and private-path exclusion | `IN` | `implemented` | `verified-current-local` | `✔️` | [Audit §4 — ORCH-PUB-001](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map) | [`public-boundary-audit-2026-11-14.json`](../../evidence/public-boundary-audit-2026-11-14.json) records clean tracked-tree and available-artifact scans; repeat on canonical CI/public artifacts before making a deployment or registry claim. |
| `ORCH-PUB-002` | No sibling-source leakage in public consumers | `IN` | `implemented` | `unverified-runtime` | `🌗` | [Audit §4 — ORCH-PUB-002](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map) | Public gate remains unavailable until Node 24/network/browser prerequisites exist. |
| `ORCH-PUB-003` | Least-privilege CI and credential-free checkout | `IN` | `implemented` | `verified-static` | `✔️` | [Audit §4 — ORCH-PUB-003](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map) | Root workflow policy, child-CI policy, credential-free checkout, bounded timeout/concurrency, and permission assertions pass; provider-side PR/dispatch remains follow-up evidence. |
| `ORCH-PUB-004` | Safe report/artifact retention and provenance | `IN` | `implemented` | `verified-static` | `✔️` | [Audit §4 — ORCH-PUB-004](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map) | Query current uploaded artifact availability; provenance and bounded retention are present. |

## 4. Scope exclusions and `➖` boundaries

No expected ID receives `➖`. The following are explicit scope boundaries from
the catalog and audit, so they must not be mistaken for missing implementation
rows:

| Boundary | Scope result | Reason |
| --- | --- | --- |
| Android/iOS delivery | `➖` deferred/out | Scope decision keeps mobile reopening explicit. |
| Raw SVG byte equality | `➖` deferred/out | Not a current orchestration contract. |
| Automatic npm publish | `➖` deferred/out | Manual publish remains authoritative until the accepted prerequisite is met. |
| Atomic npm rollback | `➖` not applicable | npm recovery is forward-fix, not rollback. |
| Workspace UI/menu/shortcut surface | `➖` not applicable at boundary | The workspace exposes commands and workflows; no separate UI/menu/shortcut is expected here. |

These boundaries do not reduce the 39-row expected set. They explain why an
out-of-scope concern is not joined as an absent capability.

## 5. Audit limitations carried forward

- The reconciliation is evidence-based and current to the audit snapshot; it
  does not promote static source inspection into live provider/runtime proof.
- The Node 22 observation belongs to the 2026-10-30 snapshot; the current host is also Node `22.23.2` with pnpm `10.33.3`, below the declared Node `24+` requirement. Root integration and release/public commands remain `unverified-environment`.
- Flutter SDK cache permission prevented the local Flutter probe; this is an
  environment-unavailable result, not a target parity failure.
- The current Flutter checkout differs from the root pointer and recursive status has one non-clean marker; these facts are preserved and not silently rewritten by this documentation task.
- No live child CI dispatch, provider API revalidation, PR merge, npm publish,
  or public deployment was triggered.
