# Renderer-SVG implementation-gap backlog

**Tanggal:** 2026-11-05

**Status:** candidate goal/task register with a bounded P0/P1 triage; no row
here counts as implementation
**Source:** [renderer-svg status matrix](./status-matrix.md),
[renderer-svg capability matrix](./capability-matrix.md), and the
[expected catalog](./expected-capability-catalog.md)

The 2026-10-30 implementation refresh records `SVG-FIX-002`, `SVG-FIX-001`,
`SVG-TASK-007`, and `SVG-TASK-009` as locally implemented/fixed at the
renderer boundary. They remain listed as historical candidate/follow-up rows
for traceability. The 2026-11-04 triage below distinguishes the historical
renderer-local evidence queue from consumer/environment evidence and
scope-deferred work. The 2026-11-05 presentation refresh records the source
and regression changes that close the style, dimension, annotation, and shared
serialization boundary at the renderer.

The frozen inventory is the [closure-boundary register](./reconciliation.md#02-frozen-closure-boundary-register--2026-11-05).
It covers all 33 expected renderer IDs, shared renderer mappings `GAP-009` and
`GAP-013`, and the retained downstream consumer row `MD-DIAG-003`. This
backlog is only the action projection: it must not be read as a reduced
capability catalog. A row with no candidate implementation task remains
explicit in the register, including rows that are already implemented,
consumer-owned, evidence-only, `➖`, or `⏸️`.

## Closure verdict — 2026-11-05

The historical candidate inventory began at 9 `🌗`/`❌` implementation tasks.
After the renderer, semantic replay, presentation-safety, and consumer
refreshes, the active closure boundary is `33 ✔️ / 0 🌗 / 0 ❌ / 0 ⚠️`.
`SVG-TASK-008` is recorded as `✔️ implemented-local` for the worker → renderer
→ safe-preview contract; its browser-host run remains a `partial-local`
evidence qualifier because the local preview server could not bind (`EPERM`).
`MD-DIAG-003` remains an explicit downstream Markdown row and is not part of
the renderer-owned closure. Broad boolean expansion stays `⏸️`; parser/resolver
ownership and raw-byte/typography equality stay `➖`.

## Scene and sheet closure refresh — 2026-11-05

`SVG-TASK-001` and `SVG-TASK-005` are now locally closed at the renderer
boundary. Coverage locks default/physical sizing, viewBox,
`preserveAspectRatio`, selected-sheet routing, title blocks, placement/scale,
renderer reuse, and non-mutating resolved-scene input using renderer tests and
fixtures 02/03/09. Browser print/layout, Node `>=24`, and host visual parity
remain evidence-only boundaries and do not reopen these implementation rows.

| Task | Current status | Evidence |
| --- | --- | --- |
| `SVG-TASK-001` / `SVG-SCENE-003` | `✔️ implemented-local` | `pnpm --filter @relgeo/renderer-svg test -- --run`; sizing regression and fixture/conformance coverage |
| `SVG-TASK-005` / `SVG-SHEET-001` | `✔️ implemented-local` | renderer reference fixtures 02/03/09, CLI tests, core sheet suite, and `pnpm run conformance:fixtures` |

## Presentation and safety closure refresh — 2026-11-05

The renderer boundary now closes finite presentation fallback and safe
serialization for text, point, dimension, and annotation output. Regression
coverage includes all supported dimension kinds, target-only annotation
fallback, explicit leader/place placement, multiline order, semantic
projection stability under metadata changes, and hostile text/style/metadata
values. Exact font metrics, browser DOM mounting, Markdown transport, and
public/host parity remain separate consumer or evidence boundaries.

| Task / boundary | Current status | Evidence |
| --- | --- | --- |
| `SVG-TASK-002` / `SVG-STYLE-002` | `✔️ implemented-local` | `renderer-svg/src/utils.ts`, `src/primitives.ts`, security and renderer suites; finite fallback and multiline assertions |
| `SVG-TASK-003` / `SVG-DIM-001` | `✔️ implemented-local` | all dimension-kind renderer tests, semantic projection, presentation-escaping fixture, conformance |
| `SVG-TASK-004` / `SVG-ANNOT-001` | `✔️ implemented-local` | target fallback, leader/place/multiline renderer tests, semantic projection, security suite |
| `GAP-009` / `GAP-013` | `✔️ implemented at renderer boundary` | hostile-input fixture, security/conformance no-executable-markup assertions, semantic invariants |

Backlog ini menurunkan setiap expected capability yang pernah berstatus `🌗`
atau `❌` menjadi satu candidate task terpisah. Seluruh candidate renderer
yang dipilih pada closure refresh kini berstatus historical local closure;
candidate task belum menjadi goal aktif SuClos sampai owner, scope, dependency,
dan execution plan disetujui.
Dokumentasi gap tidak menutup gap implementasi.

The success, failure/edge, compatibility, and evidence boundaries for the
selected rows are frozen in [reconciliation §0 contract and acceptance lock](./reconciliation.md#0-contract-and-acceptance-lock).
The backlog assigns work against that lock; it does not redefine the public
renderer API or semantic schema.

## Implementation refresh — 2026-11-04

The following source and regression changes were made against the selected
queue. Initial status in the triage table is intentionally unchanged; these
are implementation/evidence updates, not blanket closure claims.

| Task / ID | Concrete change | Evidence | Status after refresh / remaining boundary |
| --- | --- | --- | --- |
| `SVG-TASK-001` / `SVG-SCENE-003` | Reset renderer traversal/debug state before both scene and sheet renders; regression covers scene → sheet → scene reuse | `renderer-svg/src/index.ts`; renderer test; CLI and fixture suites | `✔️ implemented-local`: sizing/context and reuse are covered; browser/print host layout remains evidence-only |
| `SVG-TASK-002` / `SVG-STYLE-002` | Validate finite positive `hairlineWidth`; finite fallback for font, arrow, point, opacity, stroke width, and multiline line-height metrics; shared font-size serialization no longer emits invalid numeric values | `renderer-svg/src/index.ts`, `src/primitives.ts`, `src/utils.ts`; renderer/security tests | `✔️ implemented-local`: renderer fallback and safe serialization are closed; exact font metrics and cross-runtime wrapping remain out of scope |
| `SVG-TASK-003` / `SVG-DIM-001` | Dimension arrow/font/offset fallback is bounded for invalid presentation metadata without changing resolved geometry; multiline labels preserve order | `renderer-svg/src/primitives.ts`; renderer semantic/security regression and presentation fixture | `✔️ implemented-local`: supported kinds, semantic placement, and safety are covered; exact font metrics remain renderer-local |
| `SVG-TASK-004` / `SVG-ANNOT-001` | Annotation arrow/font/line-height fallback is bounded; target-only placement is stable; hostile values remain escaped | `renderer-svg/src/primitives.ts`; renderer semantic/security tests and fixtures | `✔️ implemented-local`: target/leader/place/multiline behavior and safety are closed; browser DOM and exact metrics remain external |
| `SVG-TASK-005` / `SVG-SHEET-001` | Sheet rendering no longer inherits stale traversal/debug state when a renderer instance is reused | `renderer-svg/src/index.ts`; renderer sheet regression; CLI/conformance suites | `✔️ implemented-local`: fixture 02/03/09 sheet contract, placement/scale, title block, and non-mutation are covered; host layout remains evidence-only |
| `SVG-TASK-006` / `SVG-DET-001` | Added typed semantic replay comparator with canonical key/number normalization while preserving semantic array order; no raw SVG byte-equality claim added | `renderer-svg/src/semantic.ts`, `src/__tests__/semantic_projection.test.ts`, `scripts/run-renderer-semantic-replay.mjs` | `✔️ implemented-local`: schema/version, bbox, order, identity/kind, topology, endpoints, transforms, and normalized numbers replay across separate local processes; Node >=24/cross-host/Flutter evidence remains separate |
| `SVG-INTEG-002` | Worker → renderer → safe preview contract is implemented; browser preview remains evidence-only | Playground worker/Preview source, current 107-test suite, build, and prior host-bind result | `✔️ implemented-local` / `partial-local` evidence: host permitting preview-server binding is still required |

Refresh evidence: `pnpm --filter @relgeo/renderer-svg test -- --run` (102 passed),
`pnpm --filter @relgeo/renderer-svg build` (pass), `pnpm --filter
@relgeo/cli test` (38 passed), `pnpm run conformance:fixtures` (298 passed),
`git diff --check` (pass), and the scoped renderer compatibility assertion
(pass for `0.5.x`). The workspace-wide `pnpm run compatibility:check` was
partial (280 passed, 3 unrelated core/Playground/Flutter version-drift
failures). These commands ran with Node `22.23.2` even
though the repository requires Node `>=24`, so they are local evidence only.
No generated `dist`, cache, release, or publish artifact is used as tracked
capability evidence.

## P0/P1 implementation-closability triage

**Triage date:** 2026-11-04. The decision below covers every P0/P1 row in the
candidate and confirmed-follow-up tables in this backlog. “Implementation-
closable” means that the named owner can make a source/test change and run a
focused acceptance check from this checkout. It does not mean the capability is
complete, externally verified, or ready for package release. Initial status is
copied from the status matrix/reconciliation and is unchanged by this triage.

The historical open renderer-local evidence queue contained one expected ID:
`SVG-INTEG-002`; the current closure refresh has implemented its local
worker-to-safe-preview contract and retains only the browser-host evidence
qualifier.
`SVG-SCENE-003` and `SVG-SHEET-001` are retained as historical regression
handoffs after local closure. `SVG-ERR-001`, `SVG-INTEG-004`,
`SVG-SHEET-002`, and `SVG-SEC-001` are retained as locally implemented/fixed
regression handoffs, not reopened gaps. `SVG-INTEG-002` is an external
consumer/runtime evidence follow-up because the remaining browser smoke
requires a host that permits preview-server binding. Shared language-specification rows
`GAP-009` and `GAP-013` are mapped to the renderer queue below and listed
explicitly as shared contract rows; the Markdown
diagnostic row `MD-DIAG-003` is not renderer-owned.

| Candidate/follow-up | Expected or shared ID | Priority | Triage decision | Owner | Source of truth | Acceptance test / evidence target | Initial status | External or scope-deferred boundary kept separate |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `SVG-TASK-001` | `SVG-SCENE-003` | `P1` | **Historical local closure; retain regression** | `relgeo/renderer-svg` + CLI/Playground consumers | `spec/id/presentation/25-views-sheets.md`; renderer root sizing in `renderer-svg/src/index.ts`; catalog §2.2 | Default/physical sizing, width/height, viewBox, preserveAspectRatio, and unchanged semantic geometry are covered by renderer tests and fixture/conformance evidence | `✔️ implemented-local` | Browser print/layout policy and host visual parity remain evidence-only |
| `SVG-TASK-002` | `SVG-STYLE-002` | `P0` | **Historical local closure; retain safety regression** | `relgeo/renderer-svg` | `spec/id/presentation/22-dimension.md`; `spec/id/presentation/23-annotation.md`; Decision 08 §11; `renderer-svg/src/escape.ts` | 102 renderer tests cover finite text/style fallback, arrows, multiline, dimension/annotation output, hostile values, and no executable markup; semantic placement remains unchanged | `✔️ implemented-local` | Exact font metrics, line wrapping, and cross-runtime typography are outside the contract |
| `SVG-TASK-003` | `SVG-DIM-001` | `P0` | **Historical local closure; retain dimension regression** | `relgeo/renderer-svg` + `relgeo/core` dimension owner | `spec/id/presentation/22-dimension.md`; `renderer-svg/src/primitives.ts`; presentation-escaping fixture | Linear, radius, diameter, and angular cases assert endpoints/measurements, extension/leader placement, multiline labels, fallback style, escaped values, and unchanged semantic projection | `✔️ implemented-local` | Exhaustive consumer placement and font metrics remain separate evidence |
| `SVG-TASK-004` | `SVG-ANNOT-001` | `P0` | **Historical local closure; retain annotation regression** | `relgeo/renderer-svg` + Playground consumer | `spec/id/presentation/23-annotation.md`; `renderer-svg/src/primitives.ts`; fixtures 02 and 06 | Renderer tests assert target fallback, leader/place, multiline order, hostile label/font/fill escaping, and no executable markup; Playground DOM-boundary evidence remains separate | `✔️ implemented-local` | Browser DOM smoke and exact text metrics remain consumer/runtime evidence |
| `SVG-TASK-005` | `SVG-SHEET-001` | `P1` | **Historical local closure; retain regression** | `relgeo/renderer-svg` + CLI/core | `spec/id/presentation/25-views-sheets.md`; fixtures 02, 03, and 09; `renderer-svg/src/index.ts` | Fixtures 02/03/09 assert page border, selected view placement/scale, title block, sheet size, selected-sheet output, and non-mutated semantic geometry; renderer/CLI/conformance pass | `✔️ implemented-local` | Browser/print visual parity and Node >=24 remain host evidence |
| `SVG-TASK-006` | `SVG-DET-001` | `P1` | **Historical local closure; retain comparator regression** | `relgeo/renderer-svg` + core/parity owners | `spec/id/core/05-semantic-guarantees.md`; `spec/id/geometry/19-collections.md`; `renderer-svg/src/semantic.ts`; manifest `semanticSerialization` | Replay comparator asserts schema/version, bbox, object order, IDs, kinds, topology, endpoints, transforms, and normalized numbers across repeated local processes; `scripts/run-renderer-semantic-replay.mjs` and `pnpm run conformance:fixtures` pass; raw SVG bytes are not compared | `✔️ implemented-local` | Canonical Node >=24 and cross-host/Flutter execution are evidence follow-ups |
| `SVG-TASK-007` | `SVG-ERR-001` | `P0` | **Historical local closure; retain regression** | `relgeo/renderer-svg` + core/CLI | `spec/id/core/06-error-model.md`; `renderer-svg/src/index.ts`; renderer and CLI negative tests | Preserve malformed-option, missing-sheet/view, unsupported-shape, composition-target, and upstream diagnostic tests; no silent fallback may return | `✔️ implemented-local` | Node-24, registry, and public artifact checks do not reopen the local error contract |
| `SVG-TASK-008` | `SVG-INTEG-002` | `P0` | **Local implementation closure; retain browser evidence follow-up** | Playground + renderer consumer owners | `playground/src/worker.ts`; `playground/src/components/Preview.tsx`; `playground/README.md`; fixtures 10 and 14 | Current Playground tests/build cover worker, selection, overlay, and safe preview wiring; on a host that permits binding, run `pnpm --filter relgeo-playground test:e2e`; record `EPERM` as not-verified, not target failure | `✔️ implemented-local` / `partial-local` evidence | Browser/public runtime, accessibility, and preview-server host availability are external evidence |
| `SVG-TASK-009` | `SVG-INTEG-004` | `P1` | **Historical local closure; retain comparator handoff** | `relgeo/renderer-svg` + parity owners | `docs/plans/07-flutter-capability-promotion-and-svg-parity.md` §7; Decisions 07/08; `renderer-svg/src/semantic.ts` | Preserve public typed projection and semantic tests for identity/order/kind, endpoints, topology, normalized geometry, transforms, and tolerance; consumer comparator execution remains separate | `✔️ implemented-local` | Flutter/consumer execution and public package evidence remain unverified |
| `SVG-FIX-001` | `SVG-SHEET-002` | `P0` | **Historical fixed-local; retain regression** | `relgeo/renderer-svg` + core/CLI | `spec/id/presentation/25-views-sheets.md` §25.5; renderer/CLI tests | Unknown `sheetId` and missing view return typed actionable errors; renderer and CLI negative tests prove no fallback or silent skip | `✔️ fixed-local` | Release/public/host verification is separate |
| `SVG-FIX-002` | `SVG-SEC-001` | `P0` | **Historical fixed-local; retain security regression** | `relgeo/renderer-svg` + Playground | `spec/id/presentation/22-dimension.md`, `23-annotation.md`, `26-metadata.md`; `docs/plans/07-flutter-capability-promotion-and-svg-parity.md` §7; `renderer-svg/src/escape.ts` | Renderer security tests and `pnpm run conformance:fixtures` assert hostile text/style/metadata values stay escaped data and never create `<script>` or event-handler markup | `✔️ fixed-local` | Browser DOM insertion, production deployment, and published artifact verification remain external |
| `shared renderer mapping` | `GAP-009` | `P1` | **Historical local closure at renderer boundary; retain shared mapping** | `relgeo/renderer-svg` + `relgeo/core` | `spec/id/presentation/22-dimension.md`, `23-annotation.md`, `26-metadata.md`; language-specification backlog `GAP-009` | Focused presentation-escaping fixture, renderer security tests, CLI tests, and semantic invariants cover dimension/annotation values without changing semantic placement | `✔️ implemented at renderer boundary` | Shared all-host coverage and browser/native evidence remain separate |
| `shared renderer mapping` | `GAP-013` | `P0` | **Historical local closure at renderer boundary; retain shared mapping** | `relgeo/renderer-svg` | `spec/id/presentation/22-dimension.md`, `23-annotation.md`, `24-drawing-roles.md`, `26-metadata.md`; language-specification backlog `GAP-013` | Renderer security/conformance checks reject executable markup from hostile text, style, metadata, and role values while semantic projection remains available | `✔️ implemented at renderer boundary` | Playground/browser DOM, public artifact, and deployment evidence remain external |

The shared source gaps `GAP-009` (dimension/annotation presentation) and
`GAP-013` (safe semantic SVG serialization) are implementation-closable only
at the renderer/core boundary represented by `SVG-TASK-002`–`SVG-TASK-004`; the
renderer mapping is closed while the language-specification row and its
cross-surface acceptance remain separate. `MD-DIAG-003` remains a Markdown/core diagnostic transport gap:
its owner, AST fixture, and strict/tolerant acceptance belong to the Markdown
surface, so no renderer implementation task is created for it.

The remaining `?` findings—browser E2E, Node `>=24`, registry/public artifact,
CI/canonical host, Flutter/native checks—are recorded as evidence follow-ups.
Broad boolean expansion remains `⏸️` under Decision 08. Neither category is a
blocker for the six local implementation-closable renderer rows.

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
| `SVG-SHEET-001` | `renderer-svg` merender page/placement/scale/title block; `core` memiliki views/sheets; CLI memiliki `--sheet/--view` selection | `fixtures/reference/02-mixed-presentational-sheet.yaml`, `03-sheet-title-block.yaml`, `09-multi-sheet-title-block.yaml`; `reference_fixtures.test.ts` | Selected sheet menghasilkan page border, view transform, title block, dan size yang stabil tanpa mutasi model geometry | Required legacy fixtures are audited evidence for this renderer boundary; version-promotion and host visual parity remain separate decisions |
| `SVG-DET-001` | `renderer-svg`/workspace memiliki semantic projection dan typed replay comparator; `core` memiliki canonical scene serialization/replay comparator | `renderer-svg/src/__tests__/semantic_projection.test.ts`; `scripts/run-renderer-semantic-replay.mjs`; `fixtures/manifest.json` `semanticSerialization`; active fixtures 10/15/16 | Bandingkan schema/version, bbox, object order, IDs, kind, topology, endpoints, transforms, dan normalized numbers; raw SVG bytes bukan oracle | Cross-host typography/whitespace/attribute order tidak dibandingkan |
| `SVG-INTEG-002` | Playground `worker.ts` menghubungkan resolve → render; `Preview.tsx` memiliki DOM host/inspection; renderer hanya menyediakan safe SVG | `fixtures/reference/10-v05-relational-baseline.yaml`, `14-v05-runtime-align-violation.yaml`; `playground/src/worker.ts`; `playground/src/components/Preview.tsx` | Valid, runtime-diagnostic, dan selection context mempertahankan semantic projection; DOM boundary menolak executable markup | Browser E2E/public runtime adalah evidence terpisah dan boleh `not verified` |
| `GAP-009` | Shared language-spec mapping; implementation owner `renderer-svg` + `core`, consumer checks di CLI/Markdown/Playground | `renderer-svg/src/__tests__/fixtures/v05-presentation-escaping.yaml`; link ke language-spec backlog `GAP-009` | Dimension/annotation text serta dynamic attributes ter-escape dan semantic placement tetap; renderer boundary is closed, while exhaustive host coverage remains separate | `✔️` at renderer boundary; cross-surface mapping retained |
| `GAP-013` | `renderer-svg` memiliki safe semantic SVG serialization; Markdown/Playground hanya consumer safety boundaries | presentation-escaping fixture; `security.test.ts`; shared no-executable-markup assertions | No `<script>`, event-handler attributes, atau unescaped dynamic XML; semantic projection tetap dapat dibandingkan | `✔️` at renderer boundary; raw byte equality dan deployment bukan prasyarat |
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
| Historical expected `🌗` / `❌` rows at backlog creation | 9 (historical baseline) |
| Candidate implementation tasks retained for traceability | 9 |
| Missing task source IDs | 0 |
| Duplicate task source IDs | 0 |
| Historical `🌗` tasks | 8 |
| Historical `❌` tasks | 1 |
| Confirmed defect follow-ups | 0 open; 2 `✔️ fixed-local` historical rows; separate from candidate count |

## Candidate goal G-SVG-01 — Close presentation, dimensions, and safety

**Owner:** `relgeo/renderer-svg` with core/Playground consumer owners

**Dependency:** resolved dimension/annotation model, style policy, XML escaping, DOM host policy
**Risk:** P0; unsafe or ambiguous presentation can affect every SVG consumer

| Priority | Scope | Candidate task | Expected ID | Source status | Owner | Dependency | Acceptance test / evidence target | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `P1` | scene viewport and export context | `SVG-TASK-001` retain scene dimension/context contract | `SVG-SCENE-003` | `✔️ implemented-local` | renderer-svg + CLI/Playground | units, viewBox, physical mode, host layout | Renderer tests cover width/height, physical units, viewBox, preserveAspectRatio, and unchanged semantic geometry; host layout remains evidence-only. | Retain sizing/context regression. |
| `P0` | SVG presentation serialization and safety | `SVG-TASK-002` close typography and presentation escaping | `SVG-STYLE-002` | `✔️` | renderer-svg | text metrics, style helpers, XML escaping | Text, arrow, multiline, dimension, and annotation attributes are escaped; finite fallbacks prevent invalid numeric serialization. | Retain regression; do not claim cross-runtime font parity. |
| `P0` | dimension projection | `SVG-TASK-003` harden dimension projection | `SVG-DIM-001` | `✔️` | renderer-svg + core | dimension model, bbox, text metrics | Linear/radius/diameter/angular dimensions pass semantic placement, style fallback, multiline, and malicious metadata fixtures without executable markup. | Retain bounded semantic placement and safety fixtures. |
| `P0` | annotation projection and DOM safety | `SVG-TASK-004` harden annotation projection | `SVG-ANNOT-001` | `✔️` | renderer-svg + Playground | annotation model, text metrics, DOM host | Target/leader/place/multiline/fallback annotations pass safe-attribute and semantic placement fixtures in the renderer boundary. | Retain renderer regression; keep browser DOM verification separate. |

## Candidate goal G-SVG-02 — Close sheets, errors, and deterministic output

**Owner:** `relgeo/renderer-svg` with core/CLI

**Dependency:** sheet selector contract, error taxonomy, canonical serializer, Node >=24 environment
**Risk:** P0/P1; incorrect fallback or unstable output affects export and automation

| Priority | Scope | Candidate task | Expected ID | Source status | Owner | Dependency | Acceptance test / evidence target | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `P1` | sheet/view export contract | `SVG-TASK-005` retain sheet/view export contract | `SVG-SHEET-001` | `✔️ implemented-local` | renderer-svg + CLI/core | views/sheets, units, bbox, title block | Fixtures 02/03/09 cover page border, placement/scale, title block, sheet size, selected-sheet SVG, and non-mutating semantic geometry; CLI/conformance pass. | Retain selected-sheet regression; host visual evidence remains separate. |
| `P1` | deterministic serialization and semantic replay | `SVG-TASK-006` prove semantic replay boundary | `SVG-DET-001` | `✔️` | renderer-svg + core/parity | canonical order/serializer, fixtures | Repeated local processes produce equal semantic schema/version, bbox, IDs/order/kinds, topology, endpoints, transforms, and normalized numbers; raw byte equality remains out of scope. | Retain comparator regression; schedule canonical Node >=24/cross-host evidence separately. |
| `P0` | renderer error and fallback boundary | `SVG-TASK-007` complete renderer error contract | `SVG-ERR-001` | `✔️ implemented-local` | renderer-svg + core/CLI | error taxonomy, invalid options, missing views, unsupported shapes | Negative renderer tests cover malformed options, missing view/sheet, unsupported resolved shape, and deterministic error propagation without silent fallback. | Retain as historical candidate; preserve the typed error contract. |

## Candidate goal G-SVG-03 — Publish semantic parity and consumer evidence

**Owner:** `relgeo/renderer-svg` with parity and Playground owners

**Dependency:** semantic projection schema, tolerance policy, shared fixtures, browser E2E host
**Risk:** P1; parity and browser claims remain bounded without these proofs

| Priority | Scope | Candidate task | Expected ID | Source status | Owner | Dependency | Acceptance test / evidence target | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `P0` | Playground browser preview and inspection | `SVG-TASK-008` retain worker-to-DOM preview regression | `SVG-INTEG-002` | `✔️` / `partial-local` evidence | Playground + renderer-svg | worker bundling, DOM host, core/language-service | Current unit/build evidence covers valid, incomplete, runtime-diagnostic, selection, overlay, and safe-SVG paths; browser edit → inspect remains host evidence. | Run browser smoke when a host permits the preview server; current sandbox attempt is `EPERM` and remains not-verified. |
| `P1` | semantic parity projection API | `SVG-TASK-009` expose semantic projection anchors | `SVG-INTEG-004` | `✔️ implemented-local` | renderer-svg + parity owners | semantic schema, tolerance, Flutter/consumer review | Public adapter/projection exposes approved identity, kind, primitive/path topology, endpoints/rings, and geometry tolerance; shared fixtures compare TypeScript and consumer projections without raw SVG byte equality. | Retain as historical candidate; run consumer comparator evidence separately. |

## Confirmed defect follow-ups

These are not counted in the nine `🌗`/`❌` candidate implementation tasks.
Their current status is maintained separately from the candidate count.

| Priority | Scope | Follow-up | Current status | Owner | Dependency | Acceptance test / evidence target | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `P0` | sheet/view error behavior | `SVG-FIX-001` explicit missing sheet/view failure | `✔️ fixed-local` (`SVG-SHEET-002`) | renderer-svg + core/CLI | selector and error contract | Unknown `sheetId` and missing view return stable actionable errors; no model fallback or silent skip; CLI and renderer tests pass. | Retain local regression evidence; no silent fallback may return. |
| `P0` | dynamic SVG attribute escaping | `SVG-FIX-002` complete dynamic SVG escaping | `✔️ fixed-local` (`SVG-SEC-001`) | renderer-svg + Playground | XML encoder, DOM insertion | Current renderer tests (102/102) and shared conformance (298/298) prove hostile fontFamily/fill/metadata values produce escaped text/attributes only; published/canonical/browser evidence remains separate. | Retain local regression evidence; do not treat local status as package-release evidence. |

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
