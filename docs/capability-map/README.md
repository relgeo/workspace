# RelGeo capability maps

Entry point review maintainer untuk capability map RelGeo:

## Struktur

Dokumen fondasi tetap berada di folder ini. Dokumen per-surface berada di
subfolder dengan nama surface; dokumen lama yang masih berguna sebagai bukti
historis berada di `archive/` pada surface terkait. Setiap surface memiliki
satu view status/capability canonical yang ditunjuk di tabel profil di bawah.
Dokumen lain tetap dipisahkan menurut perannya: expected catalog,
implementation audit, reconciliation, gap backlog, dan validation handoff.

```text
docs/capability-map/
├── README.md
├── INVENTORY-PROTOCOL.md
├── RECONCILIATION-REGISTER.md
├── SURFACE-DISCOVERY-LEDGER.md
├── cross-surface/
├── language-specification/
├── geometry/
├── core-runtime/
├── renderer-svg/
├── language-service/
├── cli/
├── markdown-surfaces/
├── playground/
├── website-pages/
├── flutter-workbench/
├── mcp/
└── cross-repository/
```

## Quick scan: status per boundary

Gunakan matrix surface untuk membaca row capability; tabel ini hanya membantu
menemukan boundary utama. Status di sini bukan aggregate release status:
implementation, parity, delivery, dan evidence dapat berbeda pada surface yang
sama.

| Surface | Matrix | Status cepat | Boundary utama / catatan |
| --- | --- | --- | --- |
| Spec | [expected catalog](./language-specification/expected-capability-catalog.md) · [status matrix](./language-specification/status-matrix.md) · [implementation audit](./language-specification/implementation-audit.md) | expected baseline → audit input | `spec/id/` normatif; expected rows are defined before implementation comparison and retain expected-but-missing capabilities. |
| Geometry | [status matrix](./geometry/status-matrix.md) | `✔️` bounded library / `🌗` expansion | Primitive/boolean tested; query expansion dan provenance wording memiliki gap. |
| Core runtime | [status matrix](./core-runtime/status-matrix.md) | `✔️` bounded runtime / `⚠️` error catalog | Parser, resolver, graph, evaluator, diagnostics; error-code typing perlu direkonsiliasi. |
| Renderer-SVG | [capability matrix](./renderer-svg/capability-matrix.md) | `✔️` bounded renderer / `⚠️` escaping | Capability matrix adalah view canonical surface ini; SVG output tested; escaping masih defect terkonfirmasi. |
| Language service | [matrix](./language-service/capability-matrix.md) | `✔️` local API / `🌗` host parity | Diagnostics/schema/completion/token tersedia; LSP runtime dan API docs memiliki gap. |
| CLI | [status matrix](./cli/status-matrix.md) | `✔️` local commands / `⚠️` format edge | `info`, `compile`, `check/validate` tersedia; registry/Node 24 belum diverifikasi. |
| Markdown plugins | [matrix](./markdown-surfaces/capability-matrix.md) | `✔️` bounded transforms / `🌗` fallback | Preview/highlight tersedia; fallback language-service dan registry evidence terbatas. |
| Playground | [capability matrix](./playground/capability-matrix.md) | `🌗` browser IDE / delivery evidence | Core editor/preview/persistence flows are implemented; compact desktop toolbar changes (file actions menu, single-row toolbar, dot-only preview status) are in Playground `c7cec4b`. Hosted smoke and physical-device/accessibility evidence remain separate. |
| Website/Pages | [matrix](./website-pages/capability-matrix.md) | `✔️` static artifact / `🌗` public | Astro/spec/Markdown/SEO shell tersedia; pin, public smoke, dan AT checks belum current. |
| Flutter | [status matrix](./flutter-workbench/status-matrix.md) | `44 ✔️ / 17 🌗 / 0 ❌` pada declared 61-ID workbench boundary | Desktop release workflow `41184693233` produced v1.0.1 draft bundles/checksums for macOS, Linux, and Windows; Flutter CI `41184291670` passed. Target-device launch/MCP smoke and publishing remain pending. |
| MCP | [capability matrix](./mcp/capability-matrix.md) | `32 ✔️ / 24 🌗 / 10 ❌ / 2 ⏸️` | Full v0.5 spec search, desktop loopback HTTP, active-document read, and opt-in bounded edit are implemented locally; ChatGPT Desktop write round-trip and packaged MCP smoke remain unverified. |
| Cross-repository | [status matrix](./cross-repository/status-matrix.md) | baseline manifest stale; integration gate not rerun | All current child checkouts match root gitlinks, but 11 of 12 gitlinks differ from the 2026-10-09 manifest snapshot. Current root integration verification is pending. |

Detail evidence, owner, consumer, gap, dan next action tetap berada di matrix
masing-masing; [reconciliation register](./RECONCILIATION-REGISTER.md) menjelaskan
deduplikasi lintas-surface.

## Protokol kelengkapan dan scope

[Inventory protocol](./INVENTORY-PROTOCOL.md) adalah aturan authoritative untuk
menentukan scope, taxonomy, discovery minimum, legend, evidence tiers, dan
status. Matrix lama, README, roadmap, dan public claim diperlakukan sebagai
input historis untuk discovery—bukan daftar final. Karena itu, capability yang
belum tertulis tidak boleh dianggap tidak ada.

Coverage statement pada setiap matrix/audit selalu menyebut metode audit,
boundary, tanggal, dan bagian yang belum terverifikasi. Status implementasi,
evidence, parity, dan scope adalah dimensi terpisah; evidence lokal, CI/
canonical, dan public tidak boleh dicampur. `not verified` berarti pemeriksaan
belum dilakukan atau tidak dapat direproduksi pada environment yang dibutuhkan,
bukan bukti bahwa implementasi gagal.

Target scope audit mencakup spec, geometry, core runtime, renderer-SVG,
language-service, CLI, Markdown plugins, Playground, website/Pages, Flutter,
MCP, dan cross-repository orchestration. Setiap surface memiliki document set
yang ditunjuk secara eksplisit pada [surface document profiles](#surface-document-profiles)
di bawah; beberapa surface memakai `status-matrix.md`, sementara yang lain
memakai `capability-matrix.md` sebagai view canonical.

[Surface discovery ledger](./SURFACE-DISCOVERY-LEDGER.md) mencatat kategori
discovery minimum yang diperiksa untuk setiap surface—source/API,
test/fixture, consumer/UI/command, platform/security, delivery, dan ownership
/documentation—serta batas evidence yang masih `not verified`. Ledger ini
adalah index audit, bukan katalog capability kedua.

[Capability reconciliation register](./RECONCILIATION-REGISTER.md) adalah view
lintas-surface untuk deduplikasi capability dan status per boundary. Register
ini menjaga owner contract, implementasi, consumer, parity, dan delivery tetap
terpisah; row detail tetap berada pada matrix surface masing-masing.

- [Cross-surface audit synthesis and priorities](./cross-surface/priorities.md) —
  urutan P0/P1/P2 yang diturunkan dari evidence, dependency, risiko, dan nilai
  maintainer/user; bukan pengganti matrix detail.

## Surface document profiles

The canonical maintainer view is listed below. All profiles preserve the same
pipeline—expected catalog → implementation audit → reconciliation → status or
capability view → gap backlog → validation handoff—even when the file name is
different. `not verified` is an evidence qualifier; every canonical view uses
the legend `✔️ 🌗 ❌ ➖ ⏸️ ⚠️`.

| Surface | Expected catalog | Audit | Canonical status/capability view | Deliberate exception |
| --- | --- | --- | --- | --- |
| Language specification | `language-specification/expected-capability-catalog.md` | `language-specification/implementation-audit.md` | `language-specification/status-matrix.md` | Normative contract remains in `spec/id/`; no second capability matrix is maintained. |
| Geometry | `geometry/expected-capability-catalog.md` | `geometry/implementation-audit.md` | `geometry/status-matrix.md` | `geometry/capability-matrix.md` is retained as historical baseline. |
| Core runtime | `core-runtime/expected-capability-catalog.md` | `core-runtime/implementation-audit.md` | `core-runtime/status-matrix.md` | `core-runtime/capability-matrix.md` is retained as historical baseline. |
| Renderer-SVG | `renderer-svg/expected-capability-catalog.md` | `renderer-svg/implementation-audit.md` | `renderer-svg/capability-matrix.md` | This surface uses `capability-matrix.md` as its current view; no duplicate status matrix. |
| Language service | `language-service/expected-capability-catalog.md` | `language-service/implementation-audit.md` | `language-service/status-matrix.md` | `language-service/capability-matrix.md` is retained as historical baseline. |
| CLI | `cli/expected-capability-catalog.md` | `cli/implementation-audit.md` | `cli/status-matrix.md` | `cli/capability-matrix.md` is retained as historical baseline. |
| Markdown surfaces | `markdown-surfaces/expected-capability-catalog.md` | `markdown-surfaces/implementation-audit.md` | `markdown-surfaces/status-matrix.md` | `markdown-surfaces/capability-matrix.md` is retained as historical baseline. |
| Playground | `playground/expected-capability-catalog.md` | `playground/implementation-audit.md` | `playground/capability-matrix.md` | `playground/status-matrix.md` is retained as provenance for the earlier view. |
| Website/Pages | `website-pages/expected-capability-catalog.md` | `website-pages/implementation-audit.md` | `website-pages/status-matrix.md` | `website-pages/capability-matrix.md` is retained as historical baseline. |
| Flutter workbench | `flutter-workbench/expected-capability-catalog.md` | `flutter-workbench/implementation-gap-map.md` | `flutter-workbench/status-matrix.md` | `implementation-audit.md` is a companion evidence summary; the local expected-catalog entry point delegates normative rows to plan 12. |
| MCP | `mcp/expected-capability-catalog.md` | `mcp/implementation-audit.md` | `mcp/capability-matrix.md` | `mcp/status-matrix.md` is a compact secondary status report, not a competing catalog. |
| Cross-repository | `cross-repository/expected-capability-catalog.md` | `cross-repository/implementation-audit.md` | `cross-repository/status-matrix.md` | No root-level capability matrix is duplicated. |

The detailed index below links to these profiles. Historical and archived files
are explicitly labeled so they cannot be mistaken for current evidence.

- [MCP capability matrix](./mcp/capability-matrix.md) — inventory capability,
  status, evidence, gap, risiko, dependency, dan delivery roadmap untuk
  boundary MCP.
- [MCP expected capability catalog](./mcp/expected-capability-catalog.md) —
  expected user outcomes, requirement anchors, scope decisions, and
  owner/source-of-truth rows written before implementation comparison.
- [MCP expected-versus-observed reconciliation](./mcp/reconciliation.md) —
  one-to-one ID join with explicit `✔️`, `🌗`, `⚠️`, `❌`, `⏸️`, and `➖`
  results plus separated implementation/evidence/scope dimensions.
- [MCP actionable capability matrix](./mcp/capability-matrix.md) — one
  user-meaningful row per expected capability with status, evidence, gap/risk,
  owner, dependency, and next action.
- [MCP implementation audit index](./mcp/implementation-audit.md) — catatan
  boundary source/consumer dan hasil pemeriksaan yang menjadi input matrix;
  bukan inventory capability kedua.
- [MCP archived implementation audit](./mcp/archive/implementation-audit-legacy.md) —
  dated evidence retained from the previous flat layout; it is not current CI
  or delivery proof.
- [MCP implementation gap backlog](./mcp/implementation-gap-backlog.md) —
  dependency-ordered follow-up groups derived from confirmed audit gaps.
- [MCP coverage validation and implementation handoff](./mcp/coverage-validation-handoff.md) —
  validates discovery coverage, IDs, links, legends, evidence, scope,
  limitations, unresolved questions, and separate implementation work.
- [Spec capability matrix](./cross-surface/archive/spec-capability-matrix-2026-10-29.md) — matrix kontrak normatif
  DSL dan status realization consumer non-MCP.
- [Expected Language-Specification capability catalog](./language-specification/expected-capability-catalog.md)
  — expected user journeys, target users, workflows/commands, roadmap, scope
  decisions, and normative contract rows defined before implementation audit.
- [Language-Specification expected-versus-observed reconciliation](./language-specification/reconciliation.md)
  — one-to-one join that must retain every expected ID, including absent
  implementation findings.
- [Spec implementation audit](./cross-surface/archive/spec-implementation-audit-2026-10-29.md) — scope, owner,
  source path, direct verification, dan batas evidence audit spec.
- [Geometry status matrix](./geometry/status-matrix.md) — current capability-first
  matrix joined to the expected catalog, with evidence, gaps, ownership,
  dependencies, risks, and next actions.
- [Geometry capability matrix (historical baseline)](./geometry/capability-matrix.md)
  — prior primitive/intersection/boolean/split/transform/bbox inventory retained
  as historical evidence, not the expected catalog source.
- [Geometry implementation audit index](./geometry/implementation-audit.md) —
  canonical entry point; [archived evidence log](./geometry/archive/implementation-audit-legacy.md)
  remains available for prior findings.
- [Geometry expected-versus-observed reconciliation](./geometry/reconciliation.md) —
  one-to-one join of all expected geometry IDs with implementation status,
  evidence status, and scope decision.
- [Geometry implementation-gap backlog](./geometry/implementation-gap-backlog.md) —
  one candidate task per `🌗`/`❌` expected capability plus separate defect and
  verification follow-ups; documentation does not count as implementation.
- [Geometry coverage validation and handoff](./geometry/coverage-validation-handoff.md)
  — final ID/link/legend/evidence/scope/limitation validation and explicit
  implementation handoff; it does not claim the surface is complete.
- [Core runtime capability matrix](./core-runtime/capability-matrix.md) — matrix
  parser, validator, graph, evaluator, resolver, diagnostics, units, dan
  integrasi geometry/renderer.
- [Core runtime expected capability catalog](./core-runtime/expected-capability-catalog.md)
  — expected baseline derived from user journeys, DSL contract, roadmap,
  compatibility policy, consumer workflows, and fixture provenance; it is the
  prerequisite for the implementation audit.
- [Core runtime implementation audit evidence](./core-runtime/implementation-audit.md)
  — ID-by-ID implementation/evidence status, consumer boundaries, verification
  limits, and prioritized gap map derived from the expected catalog.
- [Core runtime expected-versus-observed reconciliation](./core-runtime/reconciliation.md)
  — one-to-one join with separate implementation, evidence, and scope status.
- [Core runtime status matrix](./core-runtime/status-matrix.md) — capability-first
  downstream view with evidence, gap, owner, dependency, risk, and next action.
- [Core runtime implementation-gap backlog](./core-runtime/implementation-gap-backlog.md)
  — one candidate task for every `❌`/`🌗`/`⚠️` expected capability; documentation
  does not count as implementation.
- [Core runtime coverage validation and handoff](./core-runtime/coverage-validation-handoff.md)
  — final ID/link/legend/evidence/scope/limitation validation and separate
  implementation handoff; it does not claim the runtime surface is complete.
- [Core runtime archived implementation audit](./core-runtime/archive/implementation-audit-legacy.md) —
  pipeline runtime, evidence consumer, dan gap error/contract core from the
  previous flat layout.
- [Renderer-SVG capability matrix](./renderer-svg/capability-matrix.md) — matrix
  primitive, semantic SVG, sheets, boolean boundary, security, and consumer use.
- [Renderer-SVG expected capability catalog](./renderer-svg/expected-capability-catalog.md)
  — expected baseline derived from user journeys, DSL contract, roadmap,
  compatibility policy, consumer workflows, decisions, and fixture provenance;
  prerequisite for the implementation audit.
- [Renderer-SVG implementation audit](./renderer-svg/implementation-audit.md) —
  source paths, fixture/consumer evidence, confirmed escaping issue, and limits.
- [Renderer-SVG expected-versus-observed reconciliation](./renderer-svg/reconciliation.md)
  — one-to-one join of all 33 expected IDs with separate implementation,
  evidence, and scope status; absent capability remains explicit as `❌`.
- [Renderer-SVG implementation-gap backlog](./renderer-svg/implementation-gap-backlog.md)
  — nine candidate tasks for the `🌗`/`❌` rows, plus separate confirmed-defect
  and verification follow-ups; documenting a gap does not close it.
- [Renderer-SVG coverage validation and handoff](./renderer-svg/coverage-validation-handoff.md)
  — validates ID/link/legend/evidence/scope coverage, records limitations and
  unresolved questions, and keeps implementation work as separate goals/tasks.
- [Language-service expected capability catalog](./language-service/expected-capability-catalog.md)
  — expected baseline derived from user journeys, target consumers, DSL contract,
  roadmap, protocol, and scope decisions; prerequisite for implementation audit.
- [Language-service capability matrix](./language-service/capability-matrix.md) —
  historical diagnostics, schema, tokens, completions, hover, Playground wiring, and API gaps.
- [Language-service status matrix](./language-service/status-matrix.md) —
  current capability-first view of all 33 expected IDs with status, evidence,
  gap, owner, dependency, risk, and next action.
- [Language-service implementation audit](./language-service/implementation-audit.md) —
  source ownership, core integration, fixture/build evidence, and documentation mismatch.
- [Language-service archived implementation audit](./language-service/archive/implementation-audit-legacy.md)
  — ID-by-ID comparison against the expected catalog, discovery coverage, consumer
  boundaries, verification status, and gap map.
- [Language-service expected-versus-observed reconciliation](./language-service/reconciliation.md)
  — one-to-one join of all 33 expected IDs with separate implementation,
  evidence, and scope status; absent capabilities remain explicit as ❌.
- [Language-service implementation-gap backlog](./language-service/implementation-gap-backlog.md)
  — one candidate task for every 🌗, ❌, and ⚠️ implementation gap, with owner,
  dependency, acceptance evidence, risk, and next action; documentation does
  not count as implementation.
- [Language-service coverage validation and handoff](./language-service/coverage-validation-handoff.md)
  — validates IDs, links, legends, evidence classes, scope decisions,
  limitations, unresolved questions, and separate implementation handoff.
- [CLI expected capability catalog](./cli/expected-capability-catalog.md) — expected
  user outcomes, requirements, scope decisions, and source-of-truth owners before
  implementation audit.
- [CLI implementation audit](./cli/implementation-audit.md) — source/consumer evidence,
  shared fixtures, build/test results, and confirmed unknown-format behavior.
- [CLI expected-versus-observed reconciliation](./cli/reconciliation.md)
  — one-to-one join of all 35 expected IDs with separate implementation,
  evidence, and scope status.
- [CLI status matrix](./cli/status-matrix.md) — capability-first downstream view
  with status, evidence, gap, owner, dependency, risk, and next action.
- [CLI implementation-gap backlog](./cli/implementation-gap-backlog.md) — one
  candidate task for every `🌗`, `❌`, and `⚠️` CLI gap; documentation does not
  count as implementation.
- [CLI coverage validation and handoff](./cli/coverage-validation-handoff.md) —
  validates coverage, IDs, links, legends, evidence classes, scope decisions,
  limitations, unresolved questions, and the separate implementation handoff.
- [CLI capability matrix (historical baseline)](./cli/capability-matrix.md) — prior
  command/output inventory retained as historical evidence, not the expected-set source.
- [Flutter capability matrix](./flutter-workbench/capability-matrix.md) — semantic runtime,
  geometry/SVG projection, workbench, platform boundary, evidence freshness, and
  explicit non-goals.
- [Flutter implementation audit](./flutter-workbench/implementation-audit.md) — source,
  test, fixture, local-platform, historical-CI evidence, and current-pointer
  verification limits.
- [Flutter Workbench expected capability catalog](./flutter-workbench/expected-capability-catalog.md)
  — local entry point for the 61-ID expected catalog; normative rows and scope
  decisions remain defined by plan 12 before implementation audit.
- [Flutter Workbench implementation audit](./flutter-workbench/implementation-gap-map.md)
  — current ID-by-ID source, test, platform, runtime, and evidence audit.
- [Flutter Workbench expected-versus-observed reconciliation](./flutter-workbench/reconciliation.md)
  — one-to-one join with separate implementation, evidence, and scope status.
- [Flutter Workbench status matrix](./flutter-workbench/status-matrix.md) — compact
  capability-first view with status, evidence, gap, owner, dependency, risk,
  and next action.
- [Flutter Workbench implementation-gap backlog](./flutter-workbench/implementation-gap-backlog.md)
  — candidate goals/tasks for every `❌`/`🌗` row; documentation does not count
  as implementation.
- [Flutter Workbench coverage validation and handoff](./flutter-workbench/coverage-validation-handoff.md)
  — validates coverage, IDs, links, legends, evidence classes, scope decisions,
  limitations, unresolved questions, and separate implementation handoff.
- [Markdown surfaces capability matrix](./markdown-surfaces/capability-matrix.md) —
  preview/embed, source highlighting, docs-site consumption, package readiness,
  gaps, and release priorities.
- [Markdown surfaces expected capability catalog](./markdown-surfaces/expected-capability-catalog.md) —
  expected baseline derived from user journeys, DSL contract, roadmap, product
  workflow, and scope decisions; prerequisite for the implementation audit.
- [Markdown surfaces implementation audit](./markdown-surfaces/implementation-audit.md) —
  source paths, tests, language-service/core/spec integration, website evidence,
  and the confirmed highlight fallback mismatch.
- [Markdown surfaces expected-versus-observed reconciliation](./markdown-surfaces/reconciliation.md) —
  one-to-one join of all 38 expected IDs with separate implementation,
  evidence, and scope status; absent capabilities remain explicit as `❌`.
- [Markdown surfaces status matrix](./markdown-surfaces/status-matrix.md) —
  capability-first status, evidence, gap, owner, dependency, risk, and next
  action for every expected Markdown capability.
- [Markdown surfaces implementation-gap backlog](./markdown-surfaces/implementation-gap-backlog.md) —
  one candidate implementation task for every `🌗`, `❌`, and `⚠️` row, with
  separate verification follow-ups for `?` evidence boundaries.
- [Markdown surfaces coverage validation and handoff](./markdown-surfaces/coverage-validation-handoff.md) —
  validates coverage, IDs, links/paths, legends, evidence classes, scope,
  limitations, unresolved questions, and separate implementation handoff;
  it does not claim the Markdown surface is complete.
- [Playground expected capability catalog](./playground/expected-capability-catalog.md)
  — expected baseline derived from user journeys, target users, product
  workflow, file/command model, DSL contract, roadmap, and scope decisions;
  prerequisite for the implementation audit.
- [Playground capability matrix](./playground/capability-matrix.md) — browser IDE,
  editor/runtime, diagnostics, persistence, readiness, E2E, accessibility,
  artifact, and provenance status; it must be reconciled against the expected
  catalog rather than define the initial expected set.
- [Playground implementation audit](./playground/implementation-audit.md) —
  source/test/consumer evidence, dependency boundaries, current verification,
  and environment limits.
- [Playground archived implementation audit](./playground/archive/implementation-audit-legacy.md)
  — audited source, test, UI/command, platform, delivery, accessibility, and
  evidence audit joined to the expected catalog.
- [Playground expected-versus-observed reconciliation](./playground/reconciliation.md)
  — one-to-one join of all 37 expected IDs; absent implementation remains
  explicit as `❌`, with implementation, evidence, and scope status separate.
- [Playground status matrix](./playground/status-matrix.md) — capability-first
  status, evidence, gap, owner, dependency, risk, and next action for all 37
  expected rows.
- [Playground implementation-gap backlog](./playground/implementation-gap-backlog.md)
  — seven separate candidate tasks for every `❌`/`🌗` row; acceptance
  evidence and dependency are explicit, and documentation does not count as
  implementation.
- [Playground coverage validation and handoff](./playground/coverage-validation-handoff.md)
  — validates coverage, IDs, links/paths, legends, evidence classes, scope,
  limitations, unresolved questions, and separate implementation handoff;
  it does not claim the Playground surface is complete.
- [Website and Pages expected capability catalog](./website-pages/expected-capability-catalog.md)
  — expected user outcomes and scope decisions written before implementation
  comparison.
- [Website and Pages implementation audit](./website-pages/implementation-audit.md) —
  source paths, current build/assertion results, Pages assembly boundary, and
  stale/provenance limits.
- [Website and Pages expected-versus-observed reconciliation](./website-pages/reconciliation.md)
  — one-to-one join of all 15 expected IDs with separate implementation,
  evidence, and scope decisions.
- [Website and Pages status matrix](./website-pages/status-matrix.md) — compact
  capability-first status, evidence, gap, owner, dependency, risk, and next
  action view.
- [Website and Pages implementation-gap backlog](./website-pages/implementation-gap-backlog.md)
  — candidate goal/tasks for every `❌`/`🌗` row; documentation does not count
  as implementation.
- [Website and Pages coverage validation and handoff](./website-pages/coverage-validation-handoff.md)
  — validates ID/link/legend/evidence/scope coverage, records limitations and
  unresolved questions, and keeps implementation work as separate goals.
- [Website and Pages archived capability matrix](./website-pages/capability-matrix.md)
  — prior website inventory retained as historical evidence, not the expected
  catalog source.
- [Website and Pages implementation audit](./website-pages/implementation-audit.md) —
  source paths, current build/assertion results, Pages assembly boundary, and
  stale/provenance limits.
- [Cross-repository orchestration archived capability matrix](./cross-repository/archive/legacy-capability-matrix.md) —
  ownership, baseline, fixtures, integration/release gates, synchronization,
  provenance, and current verification status.
- [Cross-repository orchestration archived implementation audit](./cross-repository/archive/legacy-implementation-audit.md) —
  root scripts/workflows, executed checks, current pointer mismatches, and
  external evidence limits.

README ini berfungsi sebagai navigasi dan quick scan boundary. Ia tidak
menyalin seluruh row capability atau menggantikan matrix surface, audit, dan
protocol sebagai source of evidence.

## Validation checkpoint — 2026-10-30

Pemeriksaan read-only terhadap checkout ini menghasilkan:

- 1,276 local Markdown links pada `docs/capability-map/` diperiksa; tidak ada
  unresolved path atau fragment yang ditemukan oleh bounded checker;
- seluruh 12 canonical status/capability views memiliki coverage statement dan
  legend lengkap `✔️`, `🌗`, `❌`, `➖`, `⏸️`, dan `⚠️`;
- `docs/compatibility-matrix.json`, `docs/integration-baseline.json`,
  `docs/flutter-capability-matrix.json`, dan `fixtures/manifest.json` berhasil
  diparse; fixture manifest berisi 20 fixture dan baseline mencatat 12
  submodule;
- audit scope untuk perubahan ini dibatasi pada `docs/capability-map/`;
  perubahan tracked di luar directory tersebut tetap diperlakukan sebagai
  pekerjaan existing dan tidak dimasukkan ke commit capability-map ini; tidak
  ada source implementation yang diubah oleh audit ini.

Remaining limitations tetap eksplisit: pemeriksaan ini tidak membuktikan
Node 24/canonical CI, registry/public Pages, native Flutter/AT hosts, atau MCP
SDK/transport. URL eksternal tidak diuji sebagai bagian dari link checker;
evidence historis dan public claim tetap tidak dipromosikan menjadi current
evidence. Coverage juga tetap relatif terhadap discovery boundary pada
[inventory protocol](./INVENTORY-PROTOCOL.md), sehingga row yang belum ditemukan
tidak boleh dibaca sebagai bukti capability tidak ada.

## Coverage statement untuk directory ini

Audit baseline bertanggal 2026-10-29 menggunakan discovery source, test,
fixture, UI/command wiring, workflow, platform, delivery artifact, dan
cross-repository provenance yang tercantum dalam [inventory protocol](./INVENTORY-PROTOCOL.md).
Directory ini mencakup capability yang ditemukan pada checkout dan evidence
yang dapat ditautkan; ia tidak menyatakan bahwa source, CI/canonical toolchain,
platform native, registry, atau public deployment yang belum dijalankan telah
terverifikasi. Daftar matrix lama tetap diperlakukan sebagai historical input.

## Dokumen authoritative dan evidence

- [Cross-surface audit synthesis and priorities](./cross-surface/priorities.md) —
  priority and dependency view derived from all surface audits.
- [Maturation master plan](../MATURATION-MASTER-PLAN.md) — active compatibility
  line and historical/current evidence boundary.
- [Repository map](../REPOSITORY-MAP.md) — ownership and source-of-truth rules.
- [Cross-repo integration gate plan](../plans/01-cross-repo-integration-gate.md)
  — root runner, fixture, CI, and synchronization evidence.
- [Cross-repo open decisions](../decisions/07-cross-repo-open-decisions.md) and
  [open-work recommendations](../decisions/09-open-work-recommendations.md) —
  held/promotion/release decisions.

- [MCP MVP tool/resource contract](../mcp/04-mvp-tool-resource-contract.md) —
  typed contract dan canonical resource boundary.
- [MCP agent integration plan](../plans/11-mcp-agent-integration.md) — intent,
  mode operasi, transport, host, dan roadmap arsitektur.
- [Session bridge/security contract](../mcp/01-session-bridge-security-contract.md)
  — active document, token, revision guard, dan host mutation boundary.
- [SDK/transport spike](../mcp/02-sdk-transport-spike.md) — fixture,
  transport evidence, dan environment-gated validation.
- [SDK conformance runbook](../mcp/03-sdk-conformance-runbook.md) — gate untuk
  adapter SDK/transport yang belum dipin.

Makna normatif RelGeo tetap bersumber dari `spec/id/`. Matrix merujuk dokumen
di atas sebagai evidence dan reporting view; matrix bukan pengganti contract
atau source of truth komponen.
