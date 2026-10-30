# Website and Pages coverage validation and handoff

**Tanggal validasi:** 2026-10-30  
**Scope:** expected catalog → implementation audit → reconciliation → status matrix → implementation-gap backlog  
**Required context:** [`docs/REPOSITORY-MAP.md`](../../REPOSITORY-MAP.md), [`docs/MATURATION-MASTER-PLAN.md`](../../MATURATION-MASTER-PLAN.md)

## 1. Hasil validasi

Artefak website/Pages siap untuk review manusia sebagai baseline, evidence map,
selected local implementation evidence, dan implementation handoff. Validasi ini **tidak** menyatakan website,
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
  next action;
- audit §5 memiliki fresh local checkpoint pada 2026-10-30: website build
  menghasilkan 138 halaman, `pnpm check` bersih, `pnpm test` lulus, Playground
  build/test lulus (16 file, 99 test), dan combined Pages artifact assertion
  lulus;
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
| [Website bounded in-scope selection](./in-scope-selection.md) | Bounded intake for the next implementation tranche | 6 selected rows with owner, source path, contract boundary, and acceptance behavior; no `➖` or `⏸️` row selected |
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
| Limitations stated | PASS | English spec placeholder/parity, absent query search, revision drift, no current CI/deployment result, DNS failure, no fresh viewport/AX run, and deferred physical AT are recorded. |
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
| Honest capability/version/provenance status | `WEB-PAGE-015` | Audit §4 and §6: status pages, DSL/package/application distinctions, spec output, and revision drift |

## 4. Discovery coverage boundary

The audit covers the declared website/Pages boundary:

1. `relgeo.github.io/src/pages/`, layouts, libraries, content configuration,
   localized route templates, legacy redirects, and sitemap generation;
2. site/docs Markdown collections, active `spec/id` input, and `spec/en`
   placeholder/content boundary;
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

## 5. Unresolved questions for human decision

These questions must not be silently resolved by changing a status symbol or by
calling documentation implementation:

| ID | Question | Affected capabilities / artefacts |
| --- | --- | --- |
| `Q-WEB-001` | Apakah deterministic docs/spec index cukup sebagai search baseline, atau harus ada query search, index, dan no-result behavior? | `WEB-PAGE-003`, `GAP-WEB-003-SEARCH-001` |
| `Q-WEB-002` | Apakah `/en` akan menjadi translation penuh atau honest mirror dari `spec/id` dengan disclosure yang lebih kuat? | `WEB-PAGE-004`, `005`, `015`; `GAP-WEB-004-LOCALE-001` |
| `Q-WEB-003` | Revision Playground mana yang approved untuk menyelaraskan root gitlink, integration baseline, dan Pages workflow pin? | `WEB-PAGE-007`, `012`, `013`, `014`; `GAP-WEB-012-ARTIFACT-001` |
| `Q-WEB-004` | Kapan current canonical Pages workflow, deployed URL, dan public smoke dapat dijalankan pada host yang reachable? | `WEB-PAGE-001`, `007`, `011`–`014`; `GAP-WEB-013-PAGES-001`, `GAP-WEB-014-SMOKE-001` |
| `Q-WEB-005` | Browser viewport/AX/keyboard evidence mana yang diwajibkan sekarang, dan kapan physical VoiceOver/TalkBack/mobile Safari dibuka kembali? | `WEB-PAGE-009`, `010`; `GAP-WEB-009-RESPONSIVE-001`, `GAP-WEB-010-A11Y-001` |
| `Q-WEB-006` | Apakah deployment URL placeholder harus menjadi hard build failure dan seberapa luas crawler internal-link/SEO gate-nya? | `WEB-PAGE-001`, `011`; `WEB-PAGE-001` route-crawl follow-up and `GAP-WEB-011-SEO-001` |
| `Q-WEB-007` | Field version/provenance mana yang menjadi canonical input untuk public capability/status claims? | `WEB-PAGE-015`; `GAP-WEB-015-STATUS-001` |

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

The selected tranche has produced source/config changes and named executable
local evidence for `WEB-PAGE-003`, `004`, `005`, `010`, `011`, and `012`.
The 11 candidate tasks remain visible because partial rows still require the
follow-up evidence or decisions named by their acceptance boundaries. No task
is promoted to complete, and this handoff does not claim the website/Pages
surface is complete.

## 7. Evidence boundary and remaining-gap handoff

### Changed repository boundary

Evidence was recorded from the current uncommitted worktree. The root
workspace is at `1cfa86553d7adb18179c6b3e1a33618a179b1414`; the website child is
at `5c4576ec83ff7d4beebcbc1553c716711b91db68`; the Playground child is at
`59a42ae925cf0c21541bc19ccac39f5061b35439`; and the spec child is at
`b96ba3b23de202227eade06614635ef6717df516`. No commit was created for this
handoff, and unrelated pre-existing worktree changes were preserved.

### Reproducible evidence boundary

- Website: `pnpm check`, deployment-configured `pnpm build`, `pnpm test`, and
  `pnpm run test:pages-artifact` after assembling the current Playground
  `dist/`.
- Playground: `pnpm build` and `pnpm test` (16 test files, 99 tests).
- Provenance: `pnpm provenance:report` records the three Playground revision
  mismatches; `pnpm provenance:check` intentionally fails until an approved
  revision set is selected.
- Root integration: `node scripts/run-integration-gate.mjs --local` was
  environment-unavailable at its Node 24 preflight because the environment has
  Node 22.23.2.

### Explicit non-prerequisites

No npm or pub.dev publication, production Pages deployment, GitHub Actions run,
public host availability, custom/deferred platform host, or physical
assistive-technology session was used as a prerequisite for the local evidence.
The DNS failure, revision drift, Node-version preflight, browser runtime gaps,
and physical AT deferral remain visible in the audit and backlog.

### Handoff order

1. Choose the approved Playground revision and synchronize the root pointer,
   integration baseline, and Pages workflow pin.
2. Resolve the English translation-versus-mirror decision and complete any
   required reference content.
3. Run the browser viewport/AX/keyboard checks, then rerun the configured Pages
   workflow and 13-route public smoke when the host is reachable.

## 8. Required evidence index

- [`docs/REPOSITORY-MAP.md`](../../REPOSITORY-MAP.md)
- [`docs/MATURATION-MASTER-PLAN.md`](../../MATURATION-MASTER-PLAN.md)
- [`docs/plans/05-public-docs-and-playground-hardening.md`](../../plans/05-public-docs-and-playground-hardening.md)
- [`docs/integration-baseline.json`](../../integration-baseline.json)
- [`relgeo.github.io`](../../../relgeo.github.io)
- [Inventory protocol](../INVENTORY-PROTOCOL.md)
- [Surface discovery ledger](../SURFACE-DISCOVERY-LEDGER.md)
