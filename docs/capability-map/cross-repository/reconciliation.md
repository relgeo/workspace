# Expected-versus-Observed Cross-Repository Orchestration Reconciliation

**Status:** reconciliation selesai; setiap expected capability memiliki tepat satu hasil

**Tanggal:** 2026-10-30

**Expected source:** [Expected Cross-Repository Orchestration Capability Catalog](./expected-capability-catalog.md)

**Observed source:** [Cross-Repository Orchestration Implementation and Evidence Audit](./implementation-audit.md)

**Status matrix:** [Cross-Repository Orchestration Capability Status Matrix](./status-matrix.md)

**Implementation-gap backlog:** [Cross-Repository Orchestration Implementation Gap Backlog](./implementation-gap-backlog.md)

**Scope:** 39 expected capability IDs pada katalog lintas-repository RelGeo.

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
| `🌗` | Implementasi `partial`, atau implementation ada tetapi evidence saat ini `partial-current`/`unverified-runtime`. |
| `❌` | Implementasi `absent` atau `broken`. Tidak ada selected row yang masih absent after the focused contract evidence. |
| `➖` | Hanya untuk capability yang secara eksplisit `deferred` atau `not-applicable` oleh scope. Tidak ada dari 39 expected ID yang mendapat `➖`. |

`verified-static` tetap dicatat terpisah dari `✔️`: simbol tersebut berarti
implementasi terlihat pada source/config/docs/fixture, bukan bahwa runtime
canonical terbaru sudah dijalankan. Demikian juga `🌗` untuk runtime yang belum
terverifikasi bukan klaim bahwa target implementation rusak.

## 2. Rekonsiliasi summary

| Reconciliation | Count | Meaning |
| --- | ---: | --- |
| `✔️` | 24 | Implemented dengan evidence current atau static yang tersedia. |
| `🌗` | 15 | Partial implementation atau evidence runtime/current belum lengkap. |
| `❌` | 0 | Tidak ada expected capability yang absent/broken pada boundary audit saat ini. |
| `➖` | 0 | Tidak ada expected ID yang dikeluarkan dari scope. |
| **Total** | **39** | Sama dengan jumlah unique ID pada katalog expected. |

Implementation status dan evidence status pada seluruh join tetap mengikuti audit:

| Implementation status | Count | Evidence status | Count |
| --- | ---: | --- | ---: |
| `implemented` | 33 | `verified-current` | 5 |
| `partial` | 6 | `verified-static` | 21 |
| `absent` | 0 | `partial-current` | 7 |
| `broken` | 0 | `unverified-runtime` | 6 |
| `deferred` | 0 | `deferred-scope` | 0 |
| `not-applicable` | 0 | **Total** | **39** |

## 3. One-to-one expected-versus-observed join

| ID | Expected capability | Scope decision | Implementation status | Evidence status | Reconciliation | Audit trace | Gap / next action |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `ORCH-BOOT-001` | Fresh clone bootstrap entrypoint | `IN` | `partial` | `partial-current` | `🌗` | [Audit §4 — ORCH-BOOT-001](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map) | No single root bootstrap executable; document and execute fresh-clone probe on Node 24. |
| `ORCH-BOOT-002` | Pinned toolchain and dependency bootstrap | `IN` | `partial` | `partial-current` | `🌗` | [Audit §4 — ORCH-BOOT-002](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map) | Current host is Node 22 while declared requirement is Node 24; verify deterministic bootstrap on supported toolchain. |
| `ORCH-BOOT-003` | Recursive submodule initialization and synchronization | `IN` | `implemented` | `verified-static` | `✔️` | [Audit §4 — ORCH-BOOT-003](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map) | Recursive checkout and gitlink alignment are present; current dirty child worktrees prevent current clean-baseline evidence. Keep child pointer synchronization under the validated CI sync flow. |
| `ORCH-BOOT-004` | Public workspace boundary hygiene | `IN` | `partial` | `verified-static` | `🌗` | [Audit §4 — ORCH-BOOT-004](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map) | Run a complete current secret/private-path scan across generated artifacts and logs. |
| `ORCH-BASE-001` | Versioned integration baseline manifest | `IN` | `implemented` | `verified-current` | `✔️` | [Audit §4 — ORCH-BASE-001](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map) | Manifest exists; reconcile its three stale child revisions only after validated child CI. |
| `ORCH-BASE-002` | Strict gitlink/checkout/manifest verification | `IN` | `implemented` | `partial-current` | `🌗` | [Audit §4 — ORCH-BASE-002](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map) | Strict verifier and failure injection work, but current baseline is not green for three child revisions. |
| `ORCH-BASE-003` | DSL/package/consumer compatibility verification | `IN` | `implemented` | `verified-current` | `✔️` | [Audit §4 — ORCH-BASE-003](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map) | Rerun canonical compatibility evidence on Node 24; current command emitted a Node warning. |
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
| `ORCH-REL-001` | Release preflight composition | `IN` | `implemented` | `unverified-runtime` | `🌗` | [Audit §4 — ORCH-REL-001](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map) | Dirty workspace and Node 22 prevented a valid current preflight probe. |
| `ORCH-REL-002` | Public tarball and metadata hygiene gate | `IN` | `implemented` | `verified-current` | `✔️` | [Audit §4 — ORCH-REL-002](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map) | Keep constrained-host npm cache isolation documented; no publish was performed. |
| `ORCH-REL-003` | Manual ordered publish with operator stop | `IN` | `implemented` | `verified-static` | `✔️` | [Audit §4 — ORCH-REL-003](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map) | Live publish was intentionally not performed; automation remains future scope. |
| `ORCH-REL-004` | Post-publish registry and consumer verification | `IN` | `implemented` | `unverified-runtime` | `🌗` | [Audit §4 — ORCH-REL-004](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map) | Repeat on a network-available Node 24 host; interrupted probe is not a package failure. |
| `ORCH-REL-005` | Partial-release forward-fix recovery | `IN` | `implemented` | `partial-current` | `🌗` | [Audit §4 — ORCH-REL-005](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map) | Recovery injection passed, but no real partial release was created for runtime evidence. |
| `ORCH-REL-006` | Release decision record and no-op guard | `IN` | `implemented` | `verified-current` | `✔️` | [Audit §4 — ORCH-REL-006](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map) | Two post-decision manual releases remain an automation prerequisite, not a record defect. |
| `ORCH-OPS-001` | Actionable failure ownership | `IN` | `implemented` | `verified-static` | `✔️` | [Audit §4 — ORCH-OPS-001](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map) | Shared report fields and focused fixture are present; rerun full stages on Node 24. |
| `ORCH-OPS-002` | Blocker classification and dependency propagation | `IN` | `implemented` | `verified-static` | `✔️` | [Audit §4 — ORCH-OPS-002](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map) | Shared taxonomy and dependency-impact fields are present; live provider propagation remains follow-up evidence. |
| `ORCH-OPS-003` | Bounded retry and rerun policy | `IN` | `implemented` | `verified-static` | `✔️` | [Audit §4 — ORCH-OPS-003](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map) | Bounded transient retry and attempt retention fixture pass; verify a live transient CI case later. |
| `ORCH-OPS-004` | Cancellation, concurrency, and idempotent replay | `IN` | `implemented` | `verified-static` | `✔️` | [Audit §4 — ORCH-OPS-004](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map) | Add duplicate-dispatch and cancellation-race fixture or document provider-level limits. |
| `ORCH-OPS-005` | Human decision boundary | `IN` | `partial` | `verified-static` | `🌗` | [Audit §4 — ORCH-OPS-005](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map) | Policy is documented but not enforced by a central decision gate/tool. |
| `ORCH-PUB-001` | Secret and private-path exclusion | `IN` | `implemented` | `verified-static` | `✔️` | [Audit §4 — ORCH-PUB-001](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map) | Run a complete artifact-by-artifact secret scan as follow-up evidence. |
| `ORCH-PUB-002` | No sibling-source leakage in public consumers | `IN` | `implemented` | `unverified-runtime` | `🌗` | [Audit §4 — ORCH-PUB-002](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map) | Public gate remains unavailable until Node 24/network/browser prerequisites exist. |
| `ORCH-PUB-003` | Least-privilege CI and credential-free checkout | `IN` | `implemented` | `verified-static` | `✔️` | [Audit §4 — ORCH-PUB-003](./implementation-audit.md#4-expected-versus-observed-implementation-gap-map) | Sync checkout policy and permission assertions pass; provider-side PR/dispatch remains follow-up evidence. |
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
- Node 22 is below the repository-declared Node 24 requirement, so integration
  and some release/public commands remain `unverified-runtime`.
- Flutter SDK cache permission prevented the local Flutter probe; this is an
  environment-unavailable result, not a target parity failure.
- The three stale manifest revisions are preserved as current drift and are not
  silently rewritten by this documentation task.
- No live child CI dispatch, provider API revalidation, PR merge, npm publish,
  or public deployment was triggered.
