# Renderer-SVG implementation-gap backlog

**Tanggal:** 2026-10-30

**Status:** candidate goal/task register; no row here counts as implementation
**Source:** [renderer-svg capability matrix](./capability-matrix.md)

Backlog ini menurunkan setiap expected capability berstatus `🌗` atau `❌`
menjadi satu candidate task terpisah. Candidate task belum menjadi goal aktif
SuClos sampai owner, scope, dependency, dan execution plan disetujui.
Dokumentasi gap tidak menutup gap implementasi.

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
| Expected `🌗` / `❌` rows | 9 |
| Candidate implementation tasks | 9 |
| Missing task source IDs | 0 |
| Duplicate task source IDs | 0 |
| `🌗` tasks | 8 |
| `❌` tasks | 1 |
| Confirmed `⚠️` follow-ups | 2, separate from candidate count |

## Candidate goal G-SVG-01 — Close presentation, dimensions, and safety

**Owner:** `relgeo/renderer-svg` with core/Playground consumer owners

**Dependency:** resolved dimension/annotation model, style policy, XML escaping, DOM host policy
**Risk:** P0; unsafe or ambiguous presentation can affect every SVG consumer

| Priority | Scope | Candidate task | Expected ID | Source status | Owner | Dependency | Acceptance test / evidence target | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `P1` | scene viewport and export context | `SVG-TASK-001` define scene dimension/context contract | `SVG-SCENE-003` | `🌗` | renderer-svg + CLI/Playground | units, viewBox, physical mode, host layout | Matrix covers width/height, physical units, preserveAspectRatio, print/browser contexts; semantic geometry remains unchanged in renderer tests and one consumer fixture. | Inventory current options and write the context matrix. |
| `P0` | SVG presentation serialization and safety | `SVG-TASK-002` close typography and presentation escaping | `SVG-STYLE-002` | `🌗` | renderer-svg | text metrics, style helpers, XML escaping | Text, arrow, multiline, dimension, and annotation attributes are escaped; malicious font/fill values cannot create markup; style regression suite passes. | Centralize dynamic attribute encoding and add hostile-value tests. |
| `P0` | dimension projection | `SVG-TASK-003` harden dimension projection | `SVG-DIM-001` | `🌗` | renderer-svg + core | dimension model, bbox, text metrics | Linear/radius/diameter/angular dimensions pass semantic placement, style fallback, and malicious metadata fixtures without executable markup. | Add dimension-specific security and semantic fixtures. |
| `P0` | annotation projection and DOM safety | `SVG-TASK-004` harden annotation projection | `SVG-ANNOT-001` | `🌗` | renderer-svg + Playground | annotation model, text metrics, DOM host | Target/leader/place/multiline/fallback annotations pass safe-attribute and semantic placement fixtures in renderer and Playground boundaries. | Add malicious annotation metadata regression before browser smoke. |

## Candidate goal G-SVG-02 — Close sheets, errors, and deterministic output

**Owner:** `relgeo/renderer-svg` with core/CLI

**Dependency:** sheet selector contract, error taxonomy, canonical serializer, Node >=24 environment
**Risk:** P0/P1; incorrect fallback or unstable output affects export and automation

| Priority | Scope | Candidate task | Expected ID | Source status | Owner | Dependency | Acceptance test / evidence target | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `P1` | sheet/view export contract | `SVG-TASK-005` promote an active v0.5 sheet contract | `SVG-SHEET-001` | `🌗` | renderer-svg + CLI/core | views/sheets, units, bbox, title block | Active v0.5 fixture covers page border, placement/scale, title block, standard/custom size, and selected-sheet SVG with stable assertions. | Convert the legacy sheet path into one active fixture. |
| `P1` | deterministic serialization and semantic replay | `SVG-TASK-006` prove cross-host deterministic rendering | `SVG-DET-001` | `🌗` | renderer-svg + core/parity | canonical order/serializer, Node >=24, fixtures | Repeated processes under canonical Node and an approved consumer produce equal semantic IDs/order/numbers and stable diagnostics; raw byte equality remains out of scope. | Define comparator fields and schedule canonical runtime run. |
| `P0` | renderer error and fallback boundary | `SVG-TASK-007` complete renderer error contract | `SVG-ERR-001` | `🌗` | renderer-svg + core/CLI | error taxonomy, invalid options, missing views, unsupported shapes | Negative renderer tests cover malformed options, missing view/sheet, unsupported resolved shape, and deterministic error propagation without silent fallback. | Inventory current throw/fallback branches and assign codes. |

## Candidate goal G-SVG-03 — Publish semantic parity and consumer evidence

**Owner:** `relgeo/renderer-svg` with parity and Playground owners

**Dependency:** semantic projection schema, tolerance policy, shared fixtures, browser E2E host
**Risk:** P1; parity and browser claims remain bounded without these proofs

| Priority | Scope | Candidate task | Expected ID | Source status | Owner | Dependency | Acceptance test / evidence target | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `P0` | Playground browser preview and inspection | `SVG-TASK-008` verify worker-to-DOM preview boundary | `SVG-INTEG-002` | `🌗` | Playground + renderer-svg | worker bundling, DOM host, core/language-service | Browser edit → resolve → render → inspect passes for valid, incomplete, and runtime-error fixtures; safe SVG insertion and diagnostics are observed under canonical runtime. | Run browser smoke after security fixes and record revision/date. |
| `P1` | semantic parity projection API | `SVG-TASK-009` expose semantic projection anchors | `SVG-INTEG-004` | `❌` | renderer-svg + parity owners | semantic schema, tolerance, Flutter/consumer review | Public adapter/projection exposes approved identity, kind, primitive/path topology, endpoints/rings, and geometry tolerance; shared fixtures compare TypeScript and consumer projections without raw SVG byte equality. | Draft the smallest versioned projection API and fixture contract. |

## Confirmed defect follow-ups

These are not counted in the nine `🌗`/`❌` candidate implementation tasks, but
they must be resolved before the affected matrix rows can become `✔️`.

| Priority | Scope | Follow-up | Current status | Owner | Dependency | Acceptance test / evidence target | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `P0` | sheet/view error behavior | `SVG-FIX-001` explicit missing sheet/view failure | `⚠️` (`SVG-SHEET-002`) | renderer-svg + core/CLI | selector and error contract | Unknown `sheetId` and missing view return stable actionable errors; no model fallback or silent skip; CLI and renderer tests pass. | Patch fallback branch and add direct regression. |
| `P0` | dynamic SVG attribute escaping | `SVG-FIX-002` complete dynamic SVG escaping | `⚠️` (`SVG-SEC-001`) | renderer-svg + Playground | XML encoder, DOM insertion | Hostile fontFamily/fill/metadata values produce escaped text/attributes only; no executable element/attribute reaches DOM; security and conformance tests pass. | Patch all dynamic attribute call sites and rerun conformance. |

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
