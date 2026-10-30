# Playground coverage validation and handoff

**Tanggal validasi:** 2026-10-30

**Scope:** expected catalog → implementation audit → reconciliation → capability
matrix → implementation-gap backlog

**Required context:** [`docs/REPOSITORY-MAP.md`](../../REPOSITORY-MAP.md),
[`docs/MATURATION-MASTER-PLAN.md`](../../MATURATION-MASTER-PLAN.md), dan
[`docs/plans/05-public-docs-and-playground-hardening.md`](../../plans/05-public-docs-and-playground-hardening.md).
The implementation boundary is [`playground/`](../../../playground), and the
capability-map protocol/artifacts are under [`docs/capability-map/`](..).

## 1. Hasil validasi

Artefak baseline Playground siap untuk review manusia sebagai documentation and
evidence map. Validasi ini **tidak** menyatakan Playground lengkap, production
ready, publicly verified, atau device-accessible secara menyeluruh. Current
browser E2E, hosted Pages parity, Node >=24 canonical execution, native AT, dan
physical handset evidence tetap terbatas atau deferred seperti dinyatakan di
bawah.

Klaim yang aman:

- expected catalog memiliki **37 capability ID** yang ditulis sebelum audit,
  berdasarkan user journey, target pengguna, workflow produk, menu/command,
  DSL contract, roadmap/plan, dan keputusan scope;
- implementation audit memetakan **37/37 ID** ke source, UI/command, runtime,
  storage/file API, test, build, accessibility, dan docs evidence pada boundary
  yang diperiksa;
- reconciliation dan capability matrix masing-masing memiliki **37 row** tanpa
  missing, extra, atau duplicate ID;
- capability matrix mempertahankan **30 `✔️`, 6 `🌗`, dan 1 `❌`**. Tidak ada
  expected row yang disamarkan sebagai `➖`; `➖`, `⏸️`, dan `⚠️` tetap hadir
  dalam legend dan scope/evidence policy;
- backlog memiliki **7 candidate task** yang sama persis dengan seluruh row
  `🌗`/`❌`, masing-masing dengan owner, dependency, acceptance evidence, risk,
  dan next action;
- dokumentasi, reconciliation, matrix, dan backlog tidak menutup gap
  implementasi atau mempromosikan local evidence menjadi canonical/public/native
  evidence.

Dokumen ini adalah coverage and handoff evidence, bukan implementasi feature;
menambah atau mengubah Markdown tidak mengubah status capability.

## 2. Rantai artefak

| Artefak | Fungsi | Hasil validasi |
| --- | --- | --- |
| [Expected capability catalog](./expected-capability-catalog.md) | Daftar expected sebelum audit, dengan user outcome, requirement basis, scope, owner, dan verification placeholder | 37 unique IDs; minimum scope checklist tersedia; source daftar bukan kode/matrix lama |
| [Implementation audit evidence](./archive/implementation-audit-legacy.md) | Discovery ledger dan observed source/test/UI/command/runtime/config/platform/docs evidence | 37/37 expected IDs diaudit; route, editor, canvas, controls, menus, shortcuts, storage/file API, loading/error, build, tests, accessibility, dan docs tercakup |
| [Expected-versus-observed reconciliation](./reconciliation.md) | Join satu-ke-satu expected dengan observed implementation | 37/37 row; missing/extra/duplicate = 0; implementation/evidence/scope dipisahkan |
| [Playground capability matrix](./capability-matrix.md) | Current human-readable reporting view, one capability per row | 37 row; status, evidence, gap, owner, dependency, risk, dan next action lengkap; legend penuh |
| [Implementation-gap backlog](./implementation-gap-backlog.md) | Candidate goal/task register untuk gap | 7/7 `🌗`/`❌` rows memiliki candidate task; acceptance evidence dan dependency eksplisit |
| [Legacy status matrix](./status-matrix.md) | Earlier inventory retained for provenance | Tidak dipakai sebagai current status source; current status view berada di `playground/capability-matrix.md` |

## 3. Checklist coverage dan integrity

| Check | Result | Evidence / interpretation |
| --- | --- | --- |
| Coverage report exists | PASS | Audit §1 discovery ledger dan §2 route/menu/command/platform inventory; handoff ini menutup coverage report dan limitation. |
| Required discovery source categories recorded | PASS | Audit mencatat requirements/docs, source/UI, runtime/platform, storage/file APIs, tests/fixtures, accessibility, config/build, delivery, dan ownership. |
| Required evidence paths resolve | PASS | `docs/capability-map`, `docs/REPOSITORY-MAP.md`, `docs/MATURATION-MASTER-PLAN.md`, dan `docs/plans/05-public-docs-and-playground-hardening.md` tersedia dan direferensikan. |
| Expected IDs represented | PASS | Catalog, audit, reconciliation, dan capability matrix masing-masing tervalidasi 37 unique IDs. |
| One reconciliation per expected ID | PASS | Expected = reconciliation = 37; missing/extra/duplicate = 0. |
| Matrix capability-first | PASS | Row keyed by `PG-*` capability ID, bukan by module, test file, atau source discovery order; current artifact is `playground/capability-matrix.md`. |
| Full status legend | PASS | Matrix menjelaskan `✔️`, `🌗`, `❌`, `➖`, `⏸️`, dan `⚠️`; evidence states `unverified`, `environment-limited`, dan `deferred-device` dibedakan. |
| Evidence class separated | PASS | Audit/reconciliation memisahkan local/source evidence dari browser/public/native limitations; environment failure tidak diubah menjadi broken. |
| Scope decisions preserved | PASS | Catalog dan reconciliation mempertahankan `in scope`, `boundary only`, `expected-but-missing`, `not applicable`, dan device/deferred boundaries. |
| Limitations stated | PASS | Node 22 versus package Node >=24, Playwright bind `EPERM`, public Pages, native AT, physical mobile, and delegated DSL parity limits are recorded. |
| Unresolved questions recorded | PASS | §5 below lists product, command, camera, bootstrap, runtime, delivery, device, and version-alignment questions. |
| Gap handoff separated from implementation | PASS | Backlog identifies candidate tasks only; source changes/tests/new audit are required before any status promotion. |
| No completeness claim | PASS | This handoff explicitly says the surface is not complete or fully verified. |

## 3A. Declared source-category coverage

The catalog declared these requirement and evidence categories before the
implementation audit. Each category has a reviewed path and a concrete result;
none is inferred only from the audited source tree.

| Declared source category | Evidence reviewed | Coverage result |
| --- | --- | --- |
| Surface boundary and ownership | [`playground/`](../../../playground), [`docs/REPOSITORY-MAP.md`](../../REPOSITORY-MAP.md), catalog §1 / S1a | Playground is treated as the browser-IDE owner; delegated DSL/package semantics remain boundary-only. |
| Target users and user journeys | `playground/docs/README.md`, `playground/docs/UX-UI-AUDIT-AND-PLAN.md`, Plan 05; catalog §2 | First-time learner, RelGeo author, and reviewer/maintainer journeys J1–J8 are represented in the 37-row expected set. |
| Product workflows | `playground/docs/LOCAL-FILE-WORKSPACE-PLAN.md`, `playground/docs/README.md`, [`docs/MATURATION-MASTER-PLAN.md`](../../MATURATION-MASTER-PLAN.md); catalog §1.1/§2 | Authoring, local files, viewport, inspect, share, and recovery workflows are represented and audited. |
| Menus, commands, and keyboard surface | Catalog §1.2 C01–C07, audit §2 route/menu/command inventory, `playground/src/components/Navbar.tsx`, `FileWorkspacePicker.tsx`, `GraphViewer.tsx` | Expected actions are compared to observed controls; the missing shortcut map and camera-only reset remain explicit gaps. |
| Roadmap and maturation expectations | [`docs/MATURATION-MASTER-PLAN.md`](../../MATURATION-MASTER-PLAN.md), Plan 05, [`docs/decisions/07-cross-repo-open-decisions.md`](../../decisions/07-cross-repo-open-decisions.md) | Public delivery, accessibility, responsive, desktop/web, and deferred mobile/native-AT boundaries are preserved. |
| Normative and product contracts | `spec/id/README.md`, `spec/id/core/`, `spec/id/syntax/`, `spec/id/geometry/`, `spec/id/presentation/`, Playground file/camera plans | DSL ownership, file/persistence semantics, share safety, and viewport meaning are separated from presentation implementation. |
| Verification, delivery, and reporting protocol | `playground/package.json`, `vite.config.ts`, `playwright.config.ts`, [`docs/capability-map/INVENTORY-PROTOCOL.md`](../INVENTORY-PROTOCOL.md), catalog/audit/reconciliation/matrix/backlog | Local tests/build/lint/UX audit, browser/public/device limitations, status legend, and handoff rules are recorded. |

## 3B. Declared capability-category coverage

The expected catalog contains seven capability families. The family counts below
sum to all 37 expected IDs; the audit and reconciliation retain every ID even
when implementation is absent or evidence is limited.

| Capability family | Expected IDs | Count | Reviewed evidence boundary |
| --- | --- | ---: | --- |
| Authoring and UX | `PG-LIFE-*`, `PG-EDIT-001`, `PG-DIAG-002`, `PG-EXAMPLE-*`, `PG-CANVAS-006`, `PG-SELECT-001`, `PG-INSPECT-*` | 12 | Audit §2–§3: entry/lifecycle, editor, recovery, examples, surfaces, selection, inspector, and graph. |
| Contract | `PG-DSL-001` | 1 | Audit §3 `PG-DSL-001`: worker consumer path; full DSL parity remains owned by `spec/id/` and is not overclaimed here. |
| Semantic runtime | `PG-DIAG-001` | 1 | Audit §3 `PG-DIAG-001`: typed worker diagnostics and Inspector Errors; core/language-service remain delegated owners. |
| Persistence and interchange | `PG-FILE-*`, `PG-PERSIST-*`, `PG-SHARE-*` | 12 | Audit §2–§3: IndexedDB, autosave, backup/restore, YAML import/download, URL hash, clipboard, and recovery. |
| Geometry/rendering | `PG-CANVAS-001`–`PG-CANVAS-005` | 5 | Audit §2–§3: worker/SVG preview, zoom, pan, fit/recenter, and camera-only reset distinction. |
| Platform and accessibility | `PG-THEME-001`, `PG-RESP-001`, `PG-KEY-001`, `PG-A11Y-001`, `PG-A11Y-002` | 5 | Audit §2–§3: tokens, responsive layout, keyboard, ARIA/focus/reduced-motion; native/device evidence is deferred or unavailable. |
| Delivery and operations | `PG-DELIVERY-001` | 1 | Audit §1/§3 and local build: Vite artifact/base path verified locally; hosted Pages parity remains unverified. |

**Category coverage result:** 7/7 families reviewed; 37/37 expected IDs
represented in the current audit, reconciliation, and capability matrix. This
is bounded category coverage, not exhaustive coverage of every browser,
device, DSL combination, storage mode, public revision, or assistive
technology.

## 4. Discovery coverage boundary

The declared audit boundary covers:

1. product and scope sources: `README.md`, `docs/REPOSITORY-MAP.md`,
   `docs/MATURATION-MASTER-PLAN.md`, plan 05, Playground docs, DSL/spec
   contract, and the cross-repository/mobile decision;
2. application entry and lifecycle: `index.html`, Vite base, `App.tsx`, worker,
   status/view state, hash bootstrap, reset and recovery paths;
3. user-facing source and interaction UI: editor, preview/canvas, navbar,
   workspace picker, sidebar, inspector, graph, dialogs, lazy cards, menus,
   controls, responsive surfaces, and ARIA/focus handlers;
4. persistence and interchange: IndexedDB repository/schema, autosave, local
   file model, YAML import/download, JSON backup/restore, Blob/File APIs,
   clipboard, URL hash, size/extension/name/quota and recovery paths;
5. tests and fixtures: 15 Vitest files with 93 passing tests, 11 desktop E2E
   definitions, 1 mobile E2E definition, worker/gesture/diagnostic/persistence/
   share/view-state helpers, and historical plan evidence;
6. configuration and delivery: package scripts, Node/pnpm requirement, Vite,
   Playwright web server, production `dist/` build, UX audit script, and hosted
   `/playground/` delivery boundary;
7. accessibility and device boundary: semantic web implementation, keyboard,
   reduced motion, focus, responsive emulation, native AT and physical device
   decisions separately recorded as current, unverified, or deferred.

This is a coverage report for the declared Playground boundary. It is not a
claim that every browser, device, public revision, DSL combination, storage
mode, or assistive technology has been executed.

## 5. Unresolved questions

These questions remain open and must not be silently resolved by changing a
status symbol or by treating a backlog row as implemented:

| ID | Question | Affected capability / artefact |
| --- | --- | --- |
| `Q-PG-001` | Theme mode apa yang disepakati: light/dark/system, default apa, dan apakah preference disimpan per browser origin? | `PG-THEME-001`, capability matrix, design tokens |
| `Q-PG-002` | Shortcut bindings primary apa yang menjadi public contract, dan bagaimana konflik dengan browser/CodeMirror diselesaikan? | `PG-KEY-001`, `PG-A11Y-001`, command map |
| `Q-PG-003` | Apakah Reset viewport harus camera-only, dan apakah selection/sheet/print mode ikut dipertahankan? | `PG-CANVAS-005`, Preview/App state |
| `Q-PG-004` | Fase bootstrap mana yang harus terlihat dan kapan editor/preview boleh menjadi interactive? | `PG-LIFE-002`, IndexedDB/hash/example startup |
| `Q-PG-005` | Environment/host mana yang menyediakan Playwright browser run tanpa bind restriction dan Node >=24 canonical execution? | All browser evidence; `PG-DELIVERY-001` |
| `Q-PG-006` | Revision dan workflow apa yang menjadi proof-of-record untuk hosted Pages artifact parity? | `PG-LIFE-001`, `PG-DELIVERY-001`, README delivery links |
| `Q-PG-007` | Kapan native VoiceOver/TalkBack, AX tree, Safari mobile, dan physical handset QA dibuka kembali dari deferred scope? | `PG-RESP-001`, `PG-CANVAS-003`, `PG-A11Y-001/002` |
| `Q-PG-008` | Apakah metadata `playground/package.json` version `0.4.0` perlu disejajarkan dengan DSL v0.5.x compatibility line? | Provenance review; bukan capability status otomatis |

Current Playwright browser execution is explicitly limited: the local web
server failed to bind `127.0.0.1:4173` with `EPERM` before page creation. This
remains an environment limitation, not proof of a product failure.

## 6. Implementation handoff

Implementation work remains a separate goal/task concern. The backlog proposes
these seven candidate tasks; none is started or complete by this validation:

1. `PG-TASK-001` — decide and implement user-visible theme preference;
2. `PG-TASK-002` — make startup loading state explicit;
3. `PG-TASK-003` — add camera-only reset viewport;
4. `PG-TASK-004` — define and implement the keyboard shortcut map;
5. `PG-TASK-005` — close web accessibility semantics evidence gaps;
6. `PG-TASK-006` — close preference/input-tolerance evidence gaps;
7. `PG-TASK-007` — prove hosted artifact consistency.

Each candidate remains subject to its owner, dependency, acceptance target, and
environment limitation. Work must produce source changes and executable tests or
canonical evidence, followed by a fresh audit/reconciliation/matrix update,
before any `🌗` or `❌` status can change. This handoff does not create, start,
or mark an implementation goal complete.

## 7. Required evidence index

- [`playground/`](../../../playground)
- [`docs/REPOSITORY-MAP.md`](../../REPOSITORY-MAP.md)
- [`docs/MATURATION-MASTER-PLAN.md`](../../MATURATION-MASTER-PLAN.md)
- [`docs/plans/05-public-docs-and-playground-hardening.md`](../../plans/05-public-docs-and-playground-hardening.md)
- [`INVENTORY-PROTOCOL.md`](../INVENTORY-PROTOCOL.md)
- [`SURFACE-DISCOVERY-LEDGER.md`](../SURFACE-DISCOVERY-LEDGER.md)
- [`playground/expected-capability-catalog.md`](./expected-capability-catalog.md)
- [`playground/archive/implementation-audit-legacy.md`](./archive/implementation-audit-legacy.md)
- [`playground/reconciliation.md`](./reconciliation.md)
- [`playground/capability-matrix.md`](./capability-matrix.md)
- [`playground/status-matrix.md`](./status-matrix.md) (legacy provenance only)
- [`playground/implementation-gap-backlog.md`](./implementation-gap-backlog.md)
