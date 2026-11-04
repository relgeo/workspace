# Renderer-SVG implementation-gap backlog

**Tanggal:** 2026-10-30

**Status:** candidate goal/task register; no row here counts as implementation
**Source:** [renderer-svg capability matrix](./capability-matrix.md)

The 2026-10-30 implementation refresh records `SVG-FIX-002`, `SVG-FIX-001`,
`SVG-TASK-007`, and `SVG-TASK-009` as locally implemented/fixed at the
renderer boundary. They remain listed as historical candidate/follow-up rows
for traceability; the remaining selected `🌗` work is typography, dimension,
and annotation evidence/contract coverage.

Backlog ini menurunkan setiap expected capability berstatus `🌗` atau `❌`
menjadi satu candidate task terpisah. Candidate task belum menjadi goal aktif
SuClos sampai owner, scope, dependency, dan execution plan disetujui.
Dokumentasi gap tidak menutup gap implementasi.

## Boundary freeze — owner dan fixture map (2026-11-03)

Bagian ini membekukan boundary yang dipakai task lanjutan. `Fixture anchor`
adalah sumber fixture atau regression test yang menjadi oracle semantik; ia
tidak otomatis berarti capability sudah terverifikasi pada semua host.

| ID | Owner boundary | Fixture anchor stabil | Assertion semantik dan safety | Batas klaim |
| --- | --- | --- | --- | --- |
| `SVG-SCENE-003` | `renderer-svg` memiliki root width/height, viewBox, `preserveAspectRatio`, dan `physicalMode`; `core` memiliki unit/bbox; CLI/Playground hanya memilih context | `fixtures/reference/10-v05-relational-baseline.yaml`; `renderer-svg/src/__tests__/renderer.test.ts` physical-mode/origin cases | Model context default, physical mm, dan scene transform mempertahankan object identity/geometry; SVG tidak memuat executable markup | Layout browser/print final tetap milik host |
| `SVG-STYLE-002` | `renderer-svg` memiliki fallback typography/arrow dan XML serialization; `spec/id/presentation` memiliki field meaning | `renderer-svg/src/__tests__/fixtures/v05-presentation-escaping.yaml`; `renderer-svg/src/__tests__/security.test.ts` | Fallback font/size/baseline stabil; text dan dynamic style attributes ter-escape; tidak ada `<script>` atau event-handler attribute | Exact font metrics dan cross-runtime wrapping bukan parity contract |
| `SVG-DIM-001` | `renderer-svg` memproyeksikan dimension geometry; `core` memasok resolved points; `spec/id/presentation/22-dimension.md` normatif | `fixtures/reference/02-mixed-presentational-sheet.yaml`; presentation-escaping fixture; `renderer-svg/src/__tests__/renderer.test.ts` dimension cases | Linear/radius/diameter/angular kind, label, extension/leader, dan fallback placement dibandingkan secara semantik; hostile label/style tetap text/attribute | Tidak mengubah geometry resolver atau menjanjikan pixel equality |
| `SVG-ANNOT-001` | `renderer-svg` memproyeksikan target/leader/place/multiline; `core` memasok resolved target; Playground hanya menampilkan | `fixtures/reference/02-mixed-presentational-sheet.yaml`; presentation-escaping fixture; renderer annotation cases | Leader/target, multiline order, fallback placement, dan escaped text/style stabil; output bebas executable markup | Exact text metrics tetap renderer-local |
| `SVG-SHEET-001` | `renderer-svg` merender page/placement/scale/title block; `core` memiliki views/sheets; CLI memiliki `--sheet/--view` selection | `fixtures/reference/02-mixed-presentational-sheet.yaml`, `03-sheet-title-block.yaml`, `09-multi-sheet-title-block.yaml`; `reference_fixtures.test.ts` | Selected sheet menghasilkan page border, view transform, title block, dan size yang stabil tanpa mutasi model geometry | Legacy fixture evidence tidak dipromosikan menjadi active support tanpa audit |
| `SVG-DET-001` | `renderer-svg`/workspace memiliki semantic projection; `core` memiliki canonical scene serialization/replay comparator | `renderer-svg/src/__tests__/semantic_projection.test.ts`; `fixtures/manifest.json` `semanticSerialization`; active fixture 10 JSON | Bandingkan schema/version, bbox, object order, IDs, kind, topology, endpoints, dan normalized numbers; raw SVG bytes bukan oracle | Cross-host typography/whitespace/attribute order tidak dibandingkan |
| `SVG-INTEG-002` | Playground `worker.ts` menghubungkan resolve → render; `Preview.tsx` memiliki DOM host/inspection; renderer hanya menyediakan safe SVG | `fixtures/reference/10-v05-relational-baseline.yaml`, `14-v05-runtime-align-violation.yaml`; `playground/src/worker.ts`; `playground/src/components/Preview.tsx` | Valid, runtime-diagnostic, dan selection context mempertahankan semantic projection; DOM boundary menolak executable markup | Browser E2E/public runtime adalah evidence terpisah dan boleh `not verified` |
| `GAP-009` | Shared language-spec gap; implementation owner `renderer-svg` + `core`, consumer checks di CLI/Markdown/Playground | `renderer-svg/src/__tests__/fixtures/v05-presentation-escaping.yaml`; link ke language-spec backlog `GAP-009` | Dimension/annotation text serta dynamic attributes ter-escape dan semantic placement tetap; semua dimension kind/host belum diklaim exhaustive | Row sumber tetap `🌗`; cross-surface map tidak menutup gap sendiri |
| `GAP-013` | `renderer-svg` memiliki safe semantic SVG serialization; Markdown/Playground hanya consumer safety boundaries | presentation-escaping fixture; `security.test.ts`; shared no-executable-markup assertions | No `<script>`, event-handler attributes, atau unescaped dynamic XML; semantic projection tetap dapat dibandingkan | Raw byte equality dan deployment bukan prasyarat |
| `MD-DIAG-003` | `remark-relgeo` memiliki tolerant AST diagnostic transport; `core` memiliki runtime diagnostic; renderer hanya menghasilkan preview; website memiliki presentation | Target fixture `fixtures/reference/14-v05-runtime-align-violation.yaml` + expected SVG/scene; Markdown preview AST fixture pada follow-up task | Tolerant output mempertahankan preview valid dan menambahkan structured warning/location; strict mode tetap explicit; tidak ada partial unsafe markup | Saat freeze ini row masih `❌`; target fixture bukan bukti implementasi |

Shared safety invariant untuk seluruh anchor di atas: setiap output SVG yang
diterima consumer harus valid sebagai satu dokumen `<svg>...</svg>`, semua
source-controlled/user-controlled text masuk melalui XML escaping, dan
`/<script\\b/i` serta `/\\son[a-z]+\\s*=/i` tidak boleh menemukan executable
markup. Semantic fixtures membandingkan projection terstruktur, bukan raw SVG.

## Aturan backlog

- `Candidate goal` mengelompokkan pekerjaan menurut dependency dan owner; bukan
  komitmen delivery.
- `Candidate task` mempertahankan satu expected ID, owner, dependency, risk,
  acceptance test/evidence target, dan next action.
- `❌` berarti absent implementation pada expected boundary dan harus tetap
  eksplisit; tidak boleh dipetakan menjadi `➖` karena evidence sulit.
- `⚠️` defect dan `?` verification follow-up dicatat terpisah dari `🌗`/`❌`
  implementation candidates.
- Acceptance test/evidence target adalah pekerjaan yang masih harus diperoleh,
  bukan evidence bahwa task sudah selesai.

## Coverage

| Check | Result |
| --- | --- |
| Historical expected `🌗` / `❌` rows at backlog creation | 9 |
| Candidate implementation tasks retained for traceability | 9 |
| Missing task source IDs | 0 |
| Duplicate task source IDs | 0 |
| `🌗` tasks | 8 |
| `❌` tasks | 1 |
| Confirmed defect follow-ups | 0 open; 2 `✔️ fixed-local` historical rows; separate from candidate count |

## Candidate goal G-SVG-01 — Close presentation, dimensions, and safety

**Owner:** `relgeo/renderer-svg` with core/Playground consumer owners

**Dependency:** resolved dimension/annotation model, style policy, XML escaping, DOM host policy
**Risk:** P0; unsafe or ambiguous presentation can affect every SVG consumer

| Priority | Scope | Candidate task | Expected ID | Source status | Owner | Dependency | Acceptance test / evidence target | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `P1` | scene viewport and export context | `SVG-TASK-001` define scene dimension/context contract | `SVG-SCENE-003` | `🌗` | renderer-svg + CLI/Playground | units, viewBox, physical mode, host layout | Matrix covers width/height, physical units, preserveAspectRatio, print/browser contexts; semantic geometry remains unchanged in renderer tests and one consumer fixture. | Inventory current options and write the context matrix. |
| `P0` | SVG presentation serialization and safety | `SVG-TASK-002` close typography and presentation escaping | `SVG-STYLE-002` | `🌗` | renderer-svg | text metrics, style helpers, XML escaping | Text, arrow, multiline, dimension, and annotation attributes are escaped; malicious font/fill values cannot create markup; style regression suite passes. | Add bounded typography/placement assertions while preserving the passing escape regressions; do not claim cross-runtime font parity. |
| `P0` | dimension projection | `SVG-TASK-003` harden dimension projection | `SVG-DIM-001` | `🌗` | renderer-svg + core | dimension model, bbox, text metrics | Linear/radius/diameter/angular dimensions pass semantic placement, style fallback, and malicious metadata fixtures without executable markup. | Add bounded semantic placement assertions for supported dimension kinds; preserve safety fixtures. |
| `P0` | annotation projection and DOM safety | `SVG-TASK-004` harden annotation projection | `SVG-ANNOT-001` | `🌗` | renderer-svg + Playground | annotation model, text metrics, DOM host | Target/leader/place/multiline/fallback annotations pass safe-attribute and semantic placement fixtures in renderer and Playground boundaries. | Add bounded placement/consumer assertions; keep browser DOM verification separate. |

## Candidate goal G-SVG-02 — Close sheets, errors, and deterministic output

**Owner:** `relgeo/renderer-svg` with core/CLI

**Dependency:** sheet selector contract, error taxonomy, canonical serializer, Node >=24 environment
**Risk:** P0/P1; incorrect fallback or unstable output affects export and automation

| Priority | Scope | Candidate task | Expected ID | Source status | Owner | Dependency | Acceptance test / evidence target | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `P1` | sheet/view export contract | `SVG-TASK-005` promote an active v0.5 sheet contract | `SVG-SHEET-001` | `🌗` | renderer-svg + CLI/core | views/sheets, units, bbox, title block | Active v0.5 fixture covers page border, placement/scale, title block, standard/custom size, and selected-sheet SVG with stable assertions. | Convert the legacy sheet path into one active fixture. |
| `P1` | deterministic serialization and semantic replay | `SVG-TASK-006` prove cross-host deterministic rendering | `SVG-DET-001` | `🌗` | renderer-svg + core/parity | canonical order/serializer, Node >=24, fixtures | Repeated processes under canonical Node and an approved consumer produce equal semantic IDs/order/numbers and stable diagnostics; raw byte equality remains out of scope. | Define comparator fields and schedule canonical runtime run. |
| `P0` | renderer error and fallback boundary | `SVG-TASK-007` complete renderer error contract | `SVG-ERR-001` | `✔️ implemented-local` | renderer-svg + core/CLI | error taxonomy, invalid options, missing views, unsupported shapes | Negative renderer tests cover malformed options, missing view/sheet, unsupported resolved shape, and deterministic error propagation without silent fallback. | Retain as historical candidate; preserve the typed error contract. |

## Candidate goal G-SVG-03 — Publish semantic parity and consumer evidence

**Owner:** `relgeo/renderer-svg` with parity and Playground owners

**Dependency:** semantic projection schema, tolerance policy, shared fixtures, browser E2E host
**Risk:** P1; parity and browser claims remain bounded without these proofs

| Priority | Scope | Candidate task | Expected ID | Source status | Owner | Dependency | Acceptance test / evidence target | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `P0` | Playground browser preview and inspection | `SVG-TASK-008` verify worker-to-DOM preview boundary | `SVG-INTEG-002` | `🌗` | Playground + renderer-svg | worker bundling, DOM host, core/language-service | Browser edit → resolve → render → inspect passes for valid, incomplete, and runtime-error fixtures; safe SVG insertion and diagnostics are observed under canonical runtime. | Run browser smoke when a host permits the preview server; current sandbox attempt is `EPERM` and remains not-verified. |
| `P1` | semantic parity projection API | `SVG-TASK-009` expose semantic projection anchors | `SVG-INTEG-004` | `✔️ implemented-local` | renderer-svg + parity owners | semantic schema, tolerance, Flutter/consumer review | Public adapter/projection exposes approved identity, kind, primitive/path topology, endpoints/rings, and geometry tolerance; shared fixtures compare TypeScript and consumer projections without raw SVG byte equality. | Retain as historical candidate; run consumer comparator evidence separately. |

## Confirmed defect follow-ups

These are not counted in the nine `🌗`/`❌` candidate implementation tasks.
Their current status is maintained separately from the candidate count.

| Priority | Scope | Follow-up | Current status | Owner | Dependency | Acceptance test / evidence target | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `P0` | sheet/view error behavior | `SVG-FIX-001` explicit missing sheet/view failure | `✔️ fixed-local` (`SVG-SHEET-002`) | renderer-svg + core/CLI | selector and error contract | Unknown `sheetId` and missing view return stable actionable errors; no model fallback or silent skip; CLI and renderer tests pass. | Retain local regression evidence; no silent fallback may return. |
| `P0` | dynamic SVG attribute escaping | `SVG-FIX-002` complete dynamic SVG escaping | `✔️ fixed-local` (`SVG-SEC-001`) | renderer-svg + Playground | XML encoder, DOM insertion | Current renderer tests (88/88) and shared conformance (260/260) prove hostile fontFamily/fill/metadata values produce escaped text/attributes only; published/canonical/browser evidence remains separate. | Retain local regression evidence; do not treat local status as package-release evidence. |

## Scope and verification follow-ups

| Finding | Status | Owner | Acceptance evidence | Next action |
| --- | --- | --- | --- | --- |
| Broad boolean union/xor, non-rectangle operands, topology expansion | `⏸️` deferred | workspace + core/geometry/Flutter | Promotion decision plus shared fixtures before matrix scope changes | Keep outside implementation backlog until promoted. |
| Parser, validation, resolve, geometry solving inside renderer | `➖` not applicable | core/spec | Ownership remains explicit in catalog and matrix | Do not create renderer implementation task. |
| Browser E2E, Node >=24, registry/public, CI/canonical, Flutter/native checks | `?` not verified | workspace + consumer owners | Fresh canonical runs and public artifact evidence | Schedule verification separately from implementation. |

## Handoff rules

1. Creating this backlog does not close any implementation gap.
2. A candidate task becomes implementation work only after owner/dependency
   approval and an executable acceptance test are identified.
3. A task is complete only after the matrix and audit are re-evaluated from
   implementation/evidence; editing this document is not closure evidence.
4. If a future audit adds an absent expected ID, preserve that ID, add `❌` to
   the matrix, and add exactly one candidate task here.

## Source links

- [Expected capability catalog](./expected-capability-catalog.md)
- [Implementation audit](./implementation-audit.md)
- [Reconciliation register](./reconciliation.md)
- [Capability matrix](./capability-matrix.md)
- [Maturation master plan](../../MATURATION-MASTER-PLAN.md)
- [Compatibility matrix](../../compatibility-matrix.json)
- [Flutter capability promotion and SVG parity](../../plans/07-flutter-capability-promotion-and-svg-parity.md)
- [Fixture manifest](../../../fixtures/manifest.json)
