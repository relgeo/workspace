# Website and Pages coverage validation and handoff

**Tanggal validasi:** 2026-11-04
**Scope:** expected catalog → implementation audit → reconciliation → status matrix → implementation-gap backlog  
**Required context:** [`docs/REPOSITORY-MAP.md`](../../REPOSITORY-MAP.md), [`docs/MATURATION-MASTER-PLAN.md`](../../MATURATION-MASTER-PLAN.md)

## 1. Hasil validasi

Artefak website/Pages siap untuk review manusia sebagai baseline, evidence map,
current P0/P1 implementation-closability triage, dan implementation handoff. Validasi ini **tidak** menyatakan website,
Playground handoff, Pages deployment, public runtime, responsive behavior,
accessibility, atau English reference surface lengkap.

Klaim yang aman:

- expected catalog memiliki **15 capability ID** yang disusun sebelum audit;
- implementation audit membandingkan **15/15 ID** dengan source, content,
  route/UI, command/workflow, generated artifact, runtime, fixture, dan docs
  evidence pada boundary yang diperiksa;
- reconciliation dan status matrix memiliki **15/15 row** tanpa missing,
  extra, atau duplicate ID;
- status matrix mempertahankan **4 `✔️`, 11 `🌗`, 0 `❌`, 0 `➖`, 0 `⏸️`,
  dan 0 `⚠️`**;
- backlog memiliki **11 candidate task** untuk tepat seluruh 0 `❌` dan 11
  `🌗` row, dengan owner/dependency, acceptance test atau evidence target, dan
  next action; triage P0/P1 memilih 8 row untuk pekerjaan implementation/local
  contract dan memisahkan 3 row sebagai evidence-only;
- audit §5 memiliki historical local checkpoint pada 2026-10-30; current
  verification checkpoint pada 2026-11-04 menghasilkan website build 138
  halaman, `pnpm check` bersih, website `pnpm test` lulus, explicit
  SEO/accessibility and content-integrity assertions lulus, serta Playground
  build/test lulus (17 file, 107 test);
- current provenance and assembled Pages artifact gates fail closed because
  the checked-out website/Playground/spec revisions do not match the recorded
  baseline and Pages pins; public smoke is environment-unavailable because the
  configured public host did not become reachable;
- documentation and matrix updates do not close a gap by themselves; selected
  source/config changes are only credited where the audit records focused
  local evidence, and local evidence is not promoted to current CI, public, or
  device evidence.

## 2. Rantai artefak

| Artefak | Fungsi | Hasil validasi |
| --- | --- | --- |
| [Expected catalog](./expected-capability-catalog.md) | Daftar expected dari user journey, target pengguna, workflow, DSL/source-of-truth, roadmap, dan scope decision sebelum audit | 15 unique IDs; seluruh row memiliki outcome, requirement basis, scope, owner/source of truth, dan verification status awal |
| [Implementation audit](./implementation-audit.md) | Observed source/content/route/UI/command/config/runtime/fixture/docs evidence | Discovery coverage tercatat; 15/15 expected IDs dibandingkan; public and device limits explicit |
| [Reconciliation](./reconciliation.md) | One-to-one expected-versus-observed join dengan implementation/evidence/scope terpisah | 15/15 rows; missing/extra/duplicate = 0 |
| [Status matrix](./status-matrix.md) | Capability-first compact view dengan status, evidence, gap, owner, dependency, risk, dan next action | 15 rows; full status legend; 4 `✔️`, 11 `🌗`, 0 `❌` |
| [Implementation-gap backlog](./implementation-gap-backlog.md) | Candidate goals/tasks untuk gap implementasi, decision, provenance, dan verification | 11 tasks cover exactly all `❌`/`🌗` IDs; no task is marked complete |
| [Website bounded in-scope selection](./in-scope-selection.md) | Historical 2026-10-30 intake record | 6 historical selected rows; superseded for current P0/P1 selection by the backlog triage |
| [P0/P1 backlog triage](./implementation-gap-backlog.md#p0p1-implementation-closability-triage) | Current implementation-closability and evidence boundary | 11 P0/P1 rows reviewed; 8 selected local rows and 3 evidence-only rows, each selected row with owner/source/acceptance/initial status |
| [Historical website matrix](./capability-matrix.md) | Prior inventory retained as historical evidence | Tidak digunakan sebagai source expected set; status matrix baru adalah downstream view dari catalog/audit/reconciliation |

## 3. Checklist coverage dan integrity

| Check | Result | Evidence / interpretation |
| --- | --- | --- |
| Coverage report exists | PASS | Audit §2 mencatat website routes/source, content/docs/reference, navigation/UI/menu, commands/workflows, generated artifact, responsive/accessibility, public runtime, dan governance/source-of-truth. |
| Required discovery categories recorded | PASS | Audit §3 memisahkan source/component, UI/menu, shortcut/route, config/platform, test/fixture, runtime, dan documentation evidence. |
| Expected IDs represented | PASS | Catalog, reconciliation, dan status matrix masing-masing memiliki 15 unique `WEB-PAGE-*` ID. |
| One reconciliation per expected ID | PASS | 15 expected = 15 reconciled; missing/extra/duplicate = 0. |
| Matrix is capability-first | PASS | Row keyed by expected capability ID and user outcome, bukan source file atau test module. |
| Full status legend | PASS | Matrix menjelaskan `✔️`, `🌗`, `❌`, `➖`, `⏸️`, dan `⚠️`; evidence state dipisahkan dari status symbol. |
| Evidence classes separated | PASS | Audit/matrix membedakan `verified-local`, `observed-local`, `unverified-public`, `environment-unavailable`, dan `deferred-external`; local evidence tidak dipromosikan diam-diam. |
| Scope decisions preserved | PASS | Semua 15 row in scope; ownership boundaries, physical AT deferral, and website-versus-child-runtime ownership remain explicit rather than being converted to `➖`. |
| Limitations stated | PASS | English spec placeholder/parity, absent query search, no current CI/deployment result, DNS failure, incomplete viewport matrix, representative native Chrome AX smoke, and deferred physical AT are recorded. |
| Unresolved questions recorded | PASS | §5 lists search baseline, English policy, pin synchronization, public/CI evidence, browser/AT evidence, SEO URL gating, and internal-link crawl questions. |
| Gap backlog coverage | PASS | 11 candidate tasks cover all 11 non-green rows; each task has work type and acceptance evidence. |
| Required paths resolve | PASS | `docs/capability-map`, `docs/REPOSITORY-MAP.md`, and `docs/MATURATION-MASTER-PLAN.md` are linked/readable; website/source and plan evidence are linked by the audit/catalog. |
| Implementation closure claims | PASS | Matrix/backlog explicitly state that documentation does not implement or close a gap. |

### Declared capability-category coverage

The following categories are the categories declared by the expected catalog;
they are not a claim of complete coverage of every possible website feature.
Each category is represented by one or more expected IDs and has a matching
implementation-audit observation.

| Declared capability category | Expected IDs | Audit coverage |
| --- | --- | --- |
| Route/content discovery and navigation/location | `WEB-PAGE-001`, `WEB-PAGE-002` | Audit §2–§4: route templates, localized paths, layout navigation, active state, sidebars, and handoff links |
| Search and reference wayfinding | `WEB-PAGE-003` | Audit §4/§5: deterministic localized topic index, filtering, live status, and no-result behavior implemented locally; query/server search and browser interaction remain unverified/not claimed |
| Localization and documentation/reference surfaces | `WEB-PAGE-004`, `WEB-PAGE-005` | Audit §2 and §4: `id`/`en` content, language-spec loader, docs collections, and English placeholder/parity boundary |
| Examples and learning proof | `WEB-PAGE-006` | Audit §2–§5: Getting Started, CLI, Playground, Markdown examples and built-output assertions |
| Playground/Markdown handoff and surface/command orientation | `WEB-PAGE-007`, `WEB-PAGE-008` | Audit §2–§4: CTA links, Markdown fences, docs groups, CLI orientation, and child-owner boundary |
| Responsive behavior, accessibility, and SEO/discoverability | `WEB-PAGE-009`, `WEB-PAGE-010`, `WEB-PAGE-011` | Audit §2–§5: CSS/accessibility contracts, static assertions, metadata, canonical URLs, sitemap, and deferred/unverified runtime evidence |
| Generated artifact, Pages deployment, and public reliability | `WEB-PAGE-012`, `WEB-PAGE-013`, `WEB-PAGE-014` | Audit §2, §4–§7: build/artifact assertions, workflow pins/deploy steps, 13-route smoke definition, and DNS-limited public result |
| Honest capability/version/provenance status | `WEB-PAGE-015` | Audit §4 and §6: status pages, DSL/package/application distinctions, spec output, and synchronized local provenance |

## 4. Discovery coverage boundary

The audit covers the declared website/Pages boundary:

1. `relgeo.github.io/src/pages/`, layouts, libraries, content configuration,
   localized route templates, legacy redirects, and sitemap generation;
2. site/docs Markdown collections, active `spec/id` input, and the explicit
   English editorial-mirror disclosure;
3. global navigation, docs groups, language switcher, spec sidebar, active
   route state, CTA/Playground links, and article reading paths;
4. website package scripts, Astro config, Markdown plugin registration,
   CLI-oriented docs, Pages workflow, pinned child inputs, and deployment
   steps;
5. local generated HTML, metadata, sitemap, Markdown preview/highlighting,
   assembled Playground artifact, built-output assertions, Pages artifact
   assertions, and public smoke route list;
6. responsive/accessibility source contracts: breakpoints, overflow/focus,
   skip link, landmarks, labels, active state, and reduced motion;
7. public runtime probes for the declared routes, recorded as environment
   unavailable when DNS resolution failed rather than as a target defect;
8. `docs/MATURATION-MASTER-PLAN.md`, `docs/REPOSITORY-MAP.md`, Plan 05, and
   `docs/integration-baseline.json` for ownership, source-of-truth, roadmap,
   deferred QA, and pinned revision context.

This is a bounded coverage report, not proof that every browser, device,
deployment run, child revision, crawler, or external host has been executed.
Expected capabilities remain visible even where implementation is absent or
evidence is unavailable.

## 5. Remaining verification questions

These are remaining verification or follow-up questions, not a license to
silently change a status symbol or call documentation implementation. The
claim, locale, and revision choices for `WEB-PAGE-003/004/005/015` are frozen
in [`claim-locale-provenance-contract.md`](./claim-locale-provenance-contract.md).

| ID | Question | Affected capabilities / artefacts |
| --- | --- | --- |
| `Q-WEB-001` | Kapan browser evidence untuk deterministic docs/spec index dijalankan; query/server search tetap di luar baseline kecuali ada product change? | `WEB-PAGE-003`, `GAP-WEB-003-SEARCH-001` |
| `Q-WEB-002` | Kapan English reference content dapat direview untuk parity tanpa menghapus editorial-mirror disclosure? | `WEB-PAGE-004`, `005`, `015`; `GAP-WEB-004-LOCALE-001` |
| `Q-WEB-003` | Kapan current checked-out tuple direkonsiliasi ke integration baseline dan Pages pins (`website 6eb2e24`, `spec b96ba3b2`, `Playground c7cec4b5`) sebelum artifact dipromosikan? | `WEB-PAGE-007`, `012`, `013`, `014`; `GAP-WEB-012-ARTIFACT-001` |
| `Q-WEB-004` | Kapan current canonical Pages workflow, deployed URL, dan public smoke dapat dijalankan pada host yang reachable? | `WEB-PAGE-001`, `007`, `011`–`014`; `GAP-WEB-013-PAGES-001`, `GAP-WEB-014-SMOKE-001` |
| `Q-WEB-005` | Browser viewport/AX/keyboard evidence mana yang diwajibkan sekarang, dan kapan physical VoiceOver/TalkBack/mobile Safari dibuka kembali? | `WEB-PAGE-009`, `010`; `GAP-WEB-009-RESPONSIVE-001`, `GAP-WEB-010-A11Y-001` |
| `Q-WEB-006` | Apakah deployment URL placeholder harus menjadi hard build failure dan seberapa luas crawler internal-link/SEO gate-nya? | `WEB-PAGE-001`, `011`; `WEB-PAGE-001` route-crawl follow-up and `GAP-WEB-011-SEO-001` |
| `Q-WEB-007` | Kapan frozen DSL/package/application/source/deployment fields dipublikasikan dari synchronized artifact evidence? | `WEB-PAGE-015`; `GAP-WEB-015-STATUS-001` |

## 6. Implementation handoff

Implementation work remains a separate goal/task concern. The published
backlog proposes, but does not start or complete, these workstreams:

1. **`G-WEB-01`** close search and reference wayfinding (`WEB-PAGE-003`);
2. **`G-WEB-02`** close English locale/reference parity and claim consistency
   (`WEB-PAGE-004`, `005`, `015`);
3. **`G-WEB-03`** close Playground handoff, artifact provenance, Pages
   deployment, and public smoke (`WEB-PAGE-007`, `012`, `013`, `014`);
4. **`G-WEB-04`** close responsive, browser accessibility, and SEO evidence
   (`WEB-PAGE-009`, `010`, `011`).

The earlier selected tranche produced source/config changes and named executable
local evidence for `WEB-PAGE-003`, `004`, `005`, `010`, `011`, and `012`.
The current P0/P1 triage expands the implementation handoff to include the
local handoff and responsive contracts for `WEB-PAGE-007` and `WEB-PAGE-009`,
while retaining `WEB-PAGE-013`, `014`, and `015` as evidence-only follow-ups.
The 11 candidate tasks remain visible because partial rows still require the
follow-up evidence or decisions named by their acceptance boundaries. No task
is promoted to complete, and this handoff does not claim the website/Pages
surface is complete.

## 7. Evidence boundary and remaining-gap handoff

### Changed repository boundary

Evidence was refreshed from the current uncommitted worktree. The observed
child revisions are website
`1b9bb92f18b1f6d187b6ccdfd8995aaf8cecc4ef`, Playground
`47fd71583f4950467f63d56ad67feb24526ccb5a`, and spec
`f4fecf2153ad2d960f36eda96a6a593d5aed30b7`. The recorded baseline/Pages
references remain website `6eb2e241b76a5f226644300f5cbe9814c342cd08`,
Playground `c7cec4b505f290beccac911ef97786c8f6b0a534`, and spec
`b96ba3b23de202227eade06614635ef6717df516`. No child checkout was reset, no
baseline or workflow pin was changed, and unrelated pre-existing worktree
changes were preserved. This revision mismatch is why the strict provenance
and assembled Pages artifact gates are not claimed as passing.

### Reproducible evidence boundary

- Website: configured `pnpm build` produced 138 pages; `pnpm check`, `pnpm
  test`, `pnpm run test:responsive-accessibility`, and `pnpm
  run test:content-integrity` passed. The strict `pnpm provenance:check` and
  `RELGEO_PLAYGROUND_ROOT=../playground RELGEO_SPEC_ROOT=../spec pnpm
  provenance:pages` commands fail closed on the revision mismatches above.
- Playground: `pnpm build` and `pnpm test` passed (17 test files, 107 tests).
- Artifact/public boundary: the Playground `dist/` was assembled into the
  website output, but `pnpm run test:pages-artifact` correctly rejects the
  unsynchronized Pages provenance report. `RELGEO_PUBLIC_SITE_URL=https://relgeo.github.io
  node scripts/smoke-public-site.mjs` was attempted and could not reach the
  public host (`fetch failed`); no public smoke pass is claimed.
- Provenance: the non-strict Pages report was generated for diagnostics only;
  it records `synchronized: false` and must not be treated as release evidence.
- Root integration: `node scripts/run-integration-gate.mjs --local` was
  environment-unavailable at its Node 24 preflight because the environment has
  Node 22.23.2.

### Explicit non-prerequisites

No npm or pub.dev publication, production Pages deployment, GitHub Actions run,
public host availability, custom/deferred platform host, or physical
assistive-technology session was used as a prerequisite for the local evidence.
The DNS failure, Node-version preflight, incomplete viewport matrix, browser
runner limitation, and physical AT deferral remain visible in the audit and
backlog.

### Handoff order

1. Synchronize the frozen source tuple with the integration baseline and
   assembled artifact.
2. Review any missing English reference content while preserving the
   editorial-mirror disclosure until translation parity is proven.
3. Complete the browser viewport/AX/keyboard matrix when a stable runner is
   available, then rerun the configured Pages workflow and 13-route public
   smoke when the host is reachable.

## 8. Required evidence index

- [`docs/REPOSITORY-MAP.md`](../../REPOSITORY-MAP.md)
- [`docs/MATURATION-MASTER-PLAN.md`](../../MATURATION-MASTER-PLAN.md)
- [`docs/plans/05-public-docs-and-playground-hardening.md`](../../plans/05-public-docs-and-playground-hardening.md)
- [`docs/integration-baseline.json`](../../integration-baseline.json)
- [`relgeo.github.io`](../../../relgeo.github.io)
- [Inventory protocol](../INVENTORY-PROTOCOL.md)
- [Surface discovery ledger](../SURFACE-DISCOVERY-LEDGER.md)
