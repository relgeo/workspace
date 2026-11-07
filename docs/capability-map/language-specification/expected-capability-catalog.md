# Expected Language-Specification Capability Catalog

**Status:** expected baseline frozen; audit implementasi tersedia sebagai artefak downstream
**Compatibility line:** RelGeo DSL `0.5`
**Owner keputusan:** Agus Made
**Owner katalog:** `relgeo/workspace`
**Normative source utama:** `relgeo/spec`, khususnya `spec/id/`
**Rekonsiliasi evidence terakhir:** 2026-11-06; status expected tetap `PENDING-AUDIT`

Artefak turunan yang menjaga pemisahan expected-versus-observed:

- [implementation audit](./implementation-audit.md)
- [expected-versus-observed reconciliation](./reconciliation.md)
- [status matrix](./status-matrix.md)
- [implementation-gap backlog](./implementation-gap-backlog.md)
- [closure report](./closure-report.md)

## 1. Tujuan dan aturan baca

Dokumen ini adalah katalog **expected capability** untuk kontrak bahasa RelGeo.
Daftar ini disusun dari kebutuhan pengguna, workflow produk, surface command,
roadmap/scope decision, dan kontrak normatif `spec/` sebelum membandingkannya
dengan kode atau matrix capability lama.

Katalog ini bukan laporan bahwa capability telah diimplementasikan. Kolom
`Status verifikasi` tetap sengaja bernilai `PENDING-AUDIT` sebagai penanda bahwa
expected catalog bukan observed-status matrix, termasuk setelah audit berjalan.
Status implementation/evidence yang sudah diamati dicatat terpisah dalam audit,
reconciliation, status matrix, dan backlog; audit tidak boleh menghapus
capability yang belum ada dari katalog expected.

Setiap row memiliki ID stabil dan enam atribut yang diperlukan untuk audit:
outcome pengguna, dasar requirement, keputusan scope, owner/source of truth, dan
status verifikasi.

### Audit handoff saat ini

Audit terhadap seluruh 53 ID telah dilakukan dan join satu-ke-satu tersedia di
[`reconciliation.md`](./reconciliation.md). Expected rows tetap `PENDING-AUDIT`
secara sengaja; observed status saat ini berada di
[`status-matrix.md`](./status-matrix.md): **53 `✔️` · 0 `🌗` · 0 `❌` · 0
`➖` · 0 `⏸️` · 0 `⚠️`** on the audited local boundary.

Bounded implementation tranche yang aktif telah menutup delapan row presentation,
metadata, dan serialization melalui fixture 33. Local verification tercatat di
[`implementation-audit.md`](./implementation-audit.md), termasuk package tests,
consumer tests/builds, vocabulary check, dan conformance `677/677` pada 33
fixture. Ini tidak
mengubah expected ownership: `spec/id/` tetap normative source of truth, dan
Node 24 CI, public/browser/native-host evidence, publishing, serta deployment
tetap bukan prerequisite.

Refresh lokal 2026-11-06 menambahkan verifikasi snapshot Flutter yang diturunkan
langsung dari `spec/id` (`35` dokumen, digest cocok), tetapi tidak mengubah
expected rows atau observed status. Root suite dan conformance tetap evidence
lokal; Node 24 integration, Flutter/MCP runtime, dan canonical clean-checkout/CI
tetap dipisahkan sebagai `not verified`.

Triage lanjutan pada 2026-11-04 mencatat seluruh P0/P1 implementation-closable
rows—termasuk `LANG-002`, `DOC-003`, `DECL-001`, `DECL-004`, dan `TYPE-001`—di
[implementation-gap backlog](./implementation-gap-backlog.md#p0p1-implementation-closability-triage).
Triage tersebut adalah handoff pekerjaan, bukan perubahan pada expected status
`PENDING-AUDIT` dan bukan klaim bahwa bounded tranche sudah bertambah.

### 1.1 Evidence boundary used to build the expected catalog

Katalog ini sengaja dibangun dari expectation sources berikut. `spec/id/` adalah
source of truth semantik; dokumen workspace menetapkan boundary, roadmap, dan
keputusan scope; capability-map menetapkan metode discovery dan pemisahan
expected-versus-observed. Tidak ada row yang dihapus hanya karena source,
test, consumer, atau evidence implementasinya belum ditemukan.

| Evidence class | Yang ditetapkan untuk katalog | Evidence yang dipakai |
| --- | --- | --- |
| Normative contract | Struktur dokumen, tipe, evaluasi, geometry, presentation, diagnostics, dan compatibility line | [`spec/id/README.md`](../../../spec/id/README.md), seluruh bab `spec/id/core/`, `syntax/`, `geometry/`, dan `presentation/` |
| Surface and ownership | `spec` sebagai pemilik kontrak; CLI, Markdown, Playground, website, Flutter, dan MCP sebagai consumer/boundary | [`docs/REPOSITORY-MAP.md`](../../REPOSITORY-MAP.md), terutama tabel ownership, capability inventory boundary, dan boundary MCP/Flutter |
| User journeys and target users | Markdown embedding, technical drawing, parametric drafting, human/machine review, serta author/editor, reviewer, shell/CI, workbench, dan tooling/agent users | [`relgeo.github.io/src/content/site/en/use-cases.md`](../../../relgeo.github.io/src/content/site/en/use-cases.md), [`why-relgeo.md`](../../../relgeo.github.io/src/content/site/en/why-relgeo.md), [`playground/docs/UX-UI-AUDIT-AND-PLAN.md`](../../../playground/docs/UX-UI-AUDIT-AND-PLAN.md) |
| Workflow and commands | Parse → validate → resolve → inspect → serialize/render; CLI `info`, `compile`, `check`/`validate`, output formats, profile/parameter/unit/sheet options; browser authoring flow | [`cli/docs/README.md`](../../../cli/docs/README.md), [`cli/README.md`](../../../cli/README.md), Playground UX audit, and §3 below |
| Roadmap and product scope | Compatibility line, staged conformance, public docs/Playground hardening, and agent-assisted authoring boundaries | [`docs/MATURATION-MASTER-PLAN.md`](../../MATURATION-MASTER-PLAN.md), especially §§2–7; [`docs/plans/11-mcp-agent-integration.md`](../../plans/11-mcp-agent-integration.md) |
| Scope decisions and inventory method | 2D boundary, no general solver, deferred mobile/package delivery, candidate promotion rules, and evidence/status vocabulary | [`docs/decisions/07-cross-repo-open-decisions.md`](../../decisions/07-cross-repo-open-decisions.md), [`INVENTORY-PROTOCOL.md`](../INVENTORY-PROTOCOL.md), [`SURFACE-DISCOVERY-LEDGER.md`](../SURFACE-DISCOVERY-LEDGER.md) |

### 1.2 Surface boundary

The catalog covers the language contract as consumed through these surfaces; it
does not reassign semantic ownership to those consumers.

| Surface | Expected role in this catalog | Boundary decision |
| --- | --- | --- |
| `spec` | Normative document, syntax, semantic, geometry, presentation, error, and version contract | In scope and authoritative |
| Markdown plugins / website | Embed or present source and rendered drawing | Consumer expectation; presentation is not a replacement for `spec` |
| CLI / shell / CI | Inspect, validate, resolve, graph, JSON, SVG, profile, parameter, unit, and sheet workflows | Consumer boundary; command behavior is not the language source of truth |
| Playground / Flutter workbench | Edit, preview, inspect, graph, diagnose, persist/share/export, and agent-assisted authoring workflows | Consumer boundary; UI/platform delivery is not required to define the language catalog |
| MCP / agent integration | Rule-aware read/modify workflows over document/session contracts | Separate protocol/host boundary; it must consume the language contract |

### 1.3 Active vocabulary catalog and drift boundary

Untuk `LANG-002`, `DOC-003`, `TYPE-001`, `TYPE-002`, dan `VER-003`, katalog
aktif yang dapat dibaca mesin adalah
[`normative-vocabulary-catalog.json`](./normative-vocabulary-catalog.json).
Katalog itu adalah **checked projection**, bukan source of truth kedua: `spec/id`
tetap menentukan makna dan urutan vocabulary. File JSON mengunci daftar dan
urutan berikut agar drift dapat dideteksi secara deterministik:

Catalog ID: `relgeo-language-vocabulary-v0.5` (version `1`).

| Vocabulary surface | Isi katalog aktif | Status kontrak |
| --- | --- | --- |
| Root fields | `version`, `scene`, `parameters`, `constants`, `derived`, `profiles`, `metaPresets`, `components`, `objects`, `constraints`, `views`, `sheets`, `meta` | Normative; urutan mengikuti root example pada `spec/id/core/02-document-structure.md` |
| Scalar types | `length`, `number`, `angle`, `percent`, `boolean`, `string` | Normative; heading `7.1` pada `spec/id/syntax/07-type-system.md` |
| Structured types | `point`, `vector`, `array`, `object`, `frame2d`, `bbox2d`, `collection`, `path-ref` | Normative; heading `7.2` pada `spec/id/syntax/07-type-system.md` |
| Compatibility aliases | `styles` → `metaPresets`, `style` → `metaPreset` | Terbatas pada compatibility; provenance wajib berasal dari `spec/id/presentation/26-metadata.md` |
| Document labels | `Normative`, `Informative`, `Informative Index` | Normative editorial classification; label lain bukan status aktif |

Klasifikasi artefaknya sengaja dipisahkan:

1. **Normative**: chapter DSL di `spec/id/core/`, `syntax/`, `geometry/`, dan
   `presentation/` dengan label `Status dokumen: \`Normative\``.
2. **Informative**: index, editorial guide, appendix, expected catalog, dan
   backlog; dokumen ini menjelaskan atau mengaudit kontrak dan tidak boleh
   menambah vocabulary baru.
3. **Generated**: tidak ada generated artifact yang menjadi source of truth
   pada scope ini. Parser, core types, schema, dan completions adalah projection
   yang dimiliki owner implementasi dan wajib mengikuti katalog.
4. **Checked**: JSON catalog serta
   [`scripts/check-language-spec-vocabulary.mjs`](../../../scripts/check-language-spec-vocabulary.mjs)
   diperiksa oleh `pnpm run language-spec:check`. Missing normative entry,
   missing consumer entry, alias tanpa provenance, dan status mismatch adalah
   failure; extra consumer vocabulary hanya report-only sampai ada keputusan
   semantik.

Perubahan pada vocabulary harus dilakukan di `spec/id` terlebih dahulu, lalu
katalog checked projection dan consumer projections diperbarui dalam perubahan
yang sama. Expected rows di bawah tetap `PENDING-AUDIT`; kelulusan drift check
tidak sama dengan klaim implementasi atau parity lintas consumer.

### 1.4 Expected-but-not-yet-observed capabilities are retained

`PENDING-AUDIT` means “expected catalog row whose observed implementation status
is reported downstream”; it does not mean implemented, absent, or approved by a
consumer. This keeps capabilities that are not currently proven or may be absent
from code in the expected baseline. Examples deliberately retained here are:

- `SER-001` canonical resolved-scene JSON policy, whose field/number/identity
  contract is still an explicit contract gap;
- `SER-002` layered SVG semantic output contract, while raw SVG byte equality is
  explicitly out of scope;
- `COLL-003` the full boolean family, with active compatibility limited by the
  accepted fixture/operand boundary;
- `EVAL-002` evaluator/unit normalization, including candidate evidence that is
  not automatically active; and
- `VER-004` fixture status and promotion provenance as part of compatibility
  governance.

These rows are expected because the normative spec, consumer workflows, roadmap,
or approved scope decisions require them—not because an implementation audit has
already found them. The downstream audit must preserve every ID and report an
explicit gap when implementation is absent.

## 2. Dasar requirement dan target pengguna

| Kode dasar | Requirement yang diturunkan | Sumber evidence |
| --- | --- | --- |
| `R-AUTHOR` | Author dapat menulis intent relasional yang tetap readable oleh manusia dan mesin, lalu mengubah parameter tanpa kehilangan makna. | `relgeo.github.io/src/content/site/en/why-relgeo.md`, `relgeo.github.io/src/content/site/en/use-cases.md`, `spec/id/core/01-overview.md` |
| `R-DRAWING` | Pengguna technical drawing dapat membuat geometri 2D parametrik, relasi placement, query, constraint, dimensi, dan anotasi yang deterministic. | `relgeo.github.io/src/content/site/en/use-cases.md`, `spec/id/geometry/`, `spec/id/presentation/` |
| `R-MARKDOWN` | Author Markdown dapat menyimpan source dan menampilkan drawing/preview tanpa ekspor manual sebagai gambar. | `relgeo.github.io/src/content/site/en/use-cases.md`, `docs/MATURATION-MASTER-PLAN.md` §3.1–3.2 |
| `R-SHELL` | Pengguna shell/CI dapat inspect, validate, resolve, dan compile ke JSON, SVG, atau graph, termasuk memilih profile, parameter, unit, dan sheet. | `cli/README.md`, `cli/docs/README.md` |
| `R-WORKBENCH` | Pengguna browser/desktop dapat memilih contoh, edit source, resolve, melihat preview, inspect object/graph/diagnostic, lalu share/export. | `playground/docs/UX-UI-AUDIT-AND-PLAN.md` §1 dan §4, `docs/REPOSITORY-MAP.md` |
| `R-CONTRACT` | Semua consumer mengikuti satu kontrak bahasa, version gate, error behavior, dan compatibility line yang dimiliki spec. | `docs/MATURATION-MASTER-PLAN.md` §2.3–2.4, `docs/REPOSITORY-MAP.md`, `fixtures/manifest.json` |
| `R-AGENT` | Integrasi editor/agent dapat membaca dan memodifikasi document session melalui kontrak terpisah tanpa menjadikan Flutter atau filesystem sebagai pemilik bahasa. | `docs/REPOSITORY-MAP.md` §Boundary MCP dan Flutter, `docs/plans/11-mcp-agent-integration.md` |

Target pengguna expected catalog: author Markdown, technical drawing author,
parametric designer, reviewer/auditor, shell/CI integrator, browser/desktop
workbench user, serta integrator tooling/agent. Surface tersebut adalah cara
mengkonsumsi kontrak; bukan source of truth makna bahasa.

## 3. Workflow produk yang menjadi cakupan

```mermaid
flowchart LR
  author["Author / editor / agent"] --> source["RelGeo YAML source"]
  source --> parse["Parse + validate"]
  parse --> resolve["Resolve dependency graph"]
  resolve --> inspect["Inspect values, graph, diagnostics"]
  resolve --> json["Serialize resolved scene JSON"]
  resolve --> render["Render SVG / views / sheets"]
  render --> embed["Markdown / Playground / website"]
  json --> shell["CLI / CI / downstream tooling"]
  render --> export["File / share / export"]
```

Menu/command expectations yang mempengaruhi bahasa adalah `info`, `compile`,
`check`/`validate`, output `json`/`svg`/`graph`, `--profile`, `--param`,
`--unit`, dan `--sheet`. Playground menambah editor, preview, inspector, graph,
diagnostics, persistence/share, dan export. Menu tersebut tidak membuat
capability bahasa baru; ia menetapkan outcome yang harus dapat dilayani oleh
kontrak.

## 4. Katalog expected

### A. Authoring language dan document structure

| ID | Capability | User outcome | Dasar requirement | Scope decision | Owner / source of truth | Status verifikasi |
| --- | --- | --- | --- | --- | --- | --- |
| `LANG-001` | Text-first YAML authoring yang human-readable dan machine-processable | Author dapat review, version-control, dan memproses drawing sebagai source | `R-AUTHOR`, `R-MARKDOWN` | **IN**; relation-first, bukan format binary atau imperative script | `relgeo/spec`; `spec/id/core/01-overview.md` | `PENDING-AUDIT` |
| `LANG-002` | Relational/deterministic authoring semantics | Perubahan input menghasilkan geometry dari relasi yang sama secara repeatable | `R-AUTHOR`, `R-DRAWING` | **IN**; no general constraint solver dan no control-flow language | `relgeo/spec`; `spec/id/core/01-overview.md`, `05-semantic-guarantees.md` | `PENDING-AUDIT` |
| `DOC-001` | Root document dengan section `version`, `scene`, `parameters`, `constants`, `derived`, `profiles`, `metaPresets`, `components`, `objects`, `constraints`, `views`, `sheets`, `meta` | Author dapat menyusun dokumen dari input sampai presentasi dalam bentuk yang dikenal | `R-AUTHOR`, `R-CONTRACT` | **IN**; semua section optional kecuali aturan field masing-masing | `relgeo/spec`; `spec/id/core/02-document-structure.md` | `PENDING-AUDIT` |
| `DOC-002` | Scene configuration: unit, origin, orientation, autoSize, padding | Author dapat mengontrol coordinate space dan viewport behavior | `R-DRAWING`, `R-WORKBENCH` | **IN**; 2D world space, explicit unit normalization | `relgeo/spec`; `spec/id/core/03-scene.md` | `PENDING-AUDIT` |
| `DOC-003` | Source comments, examples, dan editorially stable vocabulary | Author/reviewer dapat memahami intent tanpa membaca runtime code | `R-AUTHOR`, `R-CONTRACT` | **IN** sebagai authoring quality; syntax tetap YAML-compatible | `relgeo/spec`; `spec/id/editorial-guide.md`, spec README | `PENDING-AUDIT` |

### B. Declarations, types, expressions, dan evaluation

| ID | Capability | User outcome | Dasar requirement | Scope decision | Owner / source of truth | Status verifikasi |
| --- | --- | --- | --- | --- | --- | --- |
| `DECL-001` | Typed `parameters` dengan default, optional shorthand, object/array properties | User dapat mengubah input drawing dengan batas tipe yang jelas | `R-AUTHOR`, `R-DRAWING`, `R-SHELL` | **IN**; `parameters` adalah input contract, berbeda dari component `params` | `relgeo/spec`; `spec/id/syntax/08-parameters.md` | `PENDING-AUDIT` |
| `DECL-002` | Immutable `constants`, termasuk structured dan array constants | Author dapat menyimpan nilai tetap dan reusable maps/patterns | `R-AUTHOR`, `R-DRAWING` | **IN**; dievaluasi sebelum `derived` dan objects, tidak dioverride profile | `relgeo/spec`; `spec/id/syntax/09-constants.md` | `PENDING-AUDIT` |
| `DECL-003` | Read-only `derived` values dengan type inference dan local component scope | User dapat memberi nama pada kalkulasi/query tanpa duplikasi dan circular dependency | `R-AUTHOR`, `R-DRAWING` | **IN**; global dan local derived, bukan assignment mutable | `relgeo/spec`; `spec/id/syntax/10-derived.md` | `PENDING-AUDIT` |
| `DECL-004` | `profiles` sebagai preset override parameters | User dapat membuat varian drawing tanpa mengubah structure | `R-DRAWING`, `R-SHELL`, `R-WORKBENCH` | **IN**; tidak boleh override constants atau menjadi styling reuse | `relgeo/spec`; `spec/id/syntax/11-profiles.md` | `PENDING-AUDIT` |
| `TYPE-001` | Scalar types: `length`, `number`, `angle`, `percent`, `boolean`, `string` | Author mendapat coercion dan validation yang dapat diprediksi | `R-AUTHOR`, `R-CONTRACT` | **IN**; unit-bearing dan unitless values dibedakan | `relgeo/spec`; `spec/id/syntax/07-type-system.md` | `PENDING-AUDIT` |
| `TYPE-002` | Structured types: `point`, `vector`, `array`, `object`, `frame2d`, `bbox2d`, `collection`, `path-ref` | Query dan composition dapat dipakai sebagai input typed, bukan hanya scalar | `R-DRAWING`, `R-SHELL` | **IN** untuk 2D; typed runtime, read-only derived fields | `relgeo/spec`; `spec/id/syntax/07-type-system.md` | `PENDING-AUDIT` |
| `EXPR-001` | Arithmetic expressions dan precedence | Author dapat menghitung ukuran/offset/proporsi dari input | `R-AUTHOR`, `R-DRAWING` | **IN**; evaluasi deterministic, no arbitrary scripting | `relgeo/spec`; `spec/id/syntax/12-expressions.md` | `PENDING-AUDIT` |
| `EXPR-002` | Comparison, logical operators, dan ternary expression | Author dapat memilih nilai terhitung sederhana tanpa control-flow language | `R-AUTHOR`, `R-DRAWING` | **IN** pada expression subset; `if/loop` sebagai statement **OUT** | `relgeo/spec`; `spec/id/syntax/12-expressions.md` | `PENDING-AUDIT` |
| `EXPR-003` | Symbol, property, index, dan object/anchor references | Author dapat menghubungkan declarations, geometry, dan collections | `R-AUTHOR`, `R-DRAWING` | **IN**; unknown/circular reference harus diagnosable | `relgeo/spec`; `spec/id/syntax/12-expressions.md`, `spec/id/core/04-evaluation-order.md` | `PENDING-AUDIT` |
| `EVAL-001` | Dependency graph dan topological evaluation order | Hasil resolve stabil dan dapat dijelaskan melalui graph | `R-CONTRACT`, `R-SHELL`, `R-WORKBENCH` | **IN**; dependency graph adalah source of truth, bukan object order incidental | `relgeo/spec`; `spec/id/core/04-evaluation-order.md`, `05-semantic-guarantees.md` | `PENDING-AUDIT` |
| `EVAL-002` | Unit normalization dan typed coercion baseline | `10mm`, `1cm`, dan angka default scene menghasilkan nilai yang konsisten | `R-DRAWING`, `R-SHELL` | **IN**; target unit output boleh dipilih surface, tidak mengubah source meaning | `relgeo/spec`; `spec/id/core/03-scene.md`, `spec/id/syntax/07-type-system.md` | `PENDING-AUDIT` |

### C. Geometry, presentation objects, composition, dan placement

| ID | Capability | User outcome | Dasar requirement | Scope decision | Owner / source of truth | Status verifikasi |
| --- | --- | --- | --- | --- | --- | --- |
| `OBJ-001` | Object model dengan stable identity, common fields, categories, dan dependency edges | Author dapat merujuk object dan tooling dapat melacak hubungan | `R-AUTHOR`, `R-WORKBENCH`, `R-CONTRACT` | **IN**; identity bukan positional array index | `relgeo/spec`; `spec/id/geometry/13-object-model.md` | `PENDING-AUDIT` |
| `GEO-001` | Point: absolute, relative, expression, intersection | User dapat membangun datum dan relasi titik | `R-DRAWING` | **IN** 2D; tidak memperkenalkan 3D coordinate system | `relgeo/spec`; `spec/id/geometry/14-geometry-objects.md` | `PENDING-AUDIT` |
| `GEO-002` | Line dengan from-to, direction-length, tangent modes dan anchors | User dapat membuat garis dari relasi yang bermakna | `R-DRAWING` | **IN**; directional construction, bukan solver arbitrer | `relgeo/spec`; `spec/id/geometry/14-geometry-objects.md` | `PENDING-AUDIT` |
| `GEO-003` | Rect, circle, ellipse dengan size/radius, placement, properties, anchors, dan holes | User dapat membuat primitive technical drawing yang reusable | `R-DRAWING` | **IN**; closed-shape semantics tetap 2D | `relgeo/spec`; `spec/id/geometry/14-geometry-objects.md` | `PENDING-AUDIT` |
| `GEO-004` | Arc, quadratic, cubic/bezier, path, polygon, dan text | User dapat menggambar curve, outline, dan label dalam satu bahasa | `R-DRAWING`, `R-MARKDOWN` | **IN** pada 2D presentation/geometry surface | `relgeo/spec`; `spec/id/geometry/14-geometry-objects.md` | `PENDING-AUDIT` |
| `GEO-005` | Closed-shape surface: holes, close/join rules, corner processing | Outline manufaktur dan drawing dapat mempertahankan topology yang diinginkan | `R-DRAWING` | **IN** dengan validation; topology/degenerate behavior harus eksplisit | `relgeo/spec`; `spec/id/geometry/14-geometry-objects.md` | `PENDING-AUDIT` |
| `COMP-001` | Group dan hierarchical composition | User dapat mengorganisasi geometry dan memindahkan sub-tree sebagai unit | `R-DRAWING`, `R-WORKBENCH` | **IN**; pre-transform internal vs post-transform world anchors dipisahkan | `relgeo/spec`; `spec/id/geometry/15-composition-objects.md`, `03-scene.md` | `PENDING-AUDIT` |
| `COMP-002` | Clone/reuse object dengan transform dan metadata behavior | User dapat memakai ulang geometry tanpa copy-paste source | `R-AUTHOR`, `R-DRAWING` | **IN**; clone bukan mutable shared state | `relgeo/spec`; `spec/id/geometry/15-composition-objects.md` | `PENDING-AUDIT` |
| `COMP-003` | Component template, `parameters`/`params`, local derived, exports | User dapat membangun reusable parametric component | `R-DRAWING`, `R-AUTHOR` | **IN**; scoped symbols, explicit instance inputs, no hidden global state | `relgeo/spec`; `spec/id/geometry/15-composition-objects.md`, `spec/id/syntax/08-10*.md` | `PENDING-AUDIT` |
| `PLACE-001` | Generic `place` dengan scalar, point, anchor, multi-anchor, inside, offset | User dapat menempatkan object relatif terhadap geometry lain | `R-DRAWING` | **IN**; directional placement, tidak memecahkan persamaan umum | `relgeo/spec`; `spec/id/geometry/17-placement.md` | `PENDING-AUDIT` |
| `PLACE-002` | `on.point` placement | Object dapat ditempel ke titik/anchor tertentu | `R-DRAWING` | **IN** | `relgeo/spec`; `spec/id/geometry/17-placement.md` | `PENDING-AUDIT` |
| `PLACE-003` | `on.path` placement dengan `t`, anchor, offset/orientation | Object dapat ditempatkan sepanjang path secara parametrik | `R-DRAWING` | **IN**; path parameterization harus deterministic | `relgeo/spec`; `spec/id/geometry/17-placement.md` | `PENDING-AUDIT` |
| `PLACE-004` | `on.frame` placement menggunakan point/orientation frame | Object dapat mengikuti posisi dan orientasi lokal path | `R-DRAWING` | **IN**; memakai `frame2d`, tetap 2D | `relgeo/spec`; `spec/id/geometry/17-placement.md`, `07-type-system.md` | `PENDING-AUDIT` |
| `ANCH-001` | Named point/scalar anchors dan post-transform world access | User dapat mereferensikan center, start/end, length, area, dan anchor geometry lain | `R-AUTHOR`, `R-DRAWING` | **IN**; anchor contract harus typed dan read-only | `relgeo/spec`; `spec/id/geometry/14-geometry-objects.md`, `18-anchors.md` | `PENDING-AUDIT` |

### D. Collections, queries, dan constraints

| ID | Capability | User outcome | Dasar requirement | Scope decision | Owner / source of truth | Status verifikasi |
| --- | --- | --- | --- | --- | --- | --- |
| `COLL-001` | Repeat: linear/along/each/grid/polar dengan repeat context dan identity | User dapat membuat pola geometry tanpa menyalin object | `R-DRAWING`, `R-AUTHOR` | **IN**; repeat output adalah collection dengan identity deterministic | `relgeo/spec`; `spec/id/geometry/16-collection-objects.md` | `PENDING-AUDIT` |
| `COLL-002` | Divide/split dan collection result | User dapat memecah geometry dan memilih/inspect hasil | `R-DRAWING`, `R-WORKBENCH` | **IN**; result shape dan pick behavior harus eksplisit | `relgeo/spec`; `spec/id/geometry/16-collection-objects.md` | `PENDING-AUDIT` |
| `COLL-003` | Boolean geometry: `union`, `subtract`, `intersect`, `xor` dengan result mode | User dapat membentuk geometry dari operasi boolean | `R-DRAWING`, `R-CONTRACT` | **IN expected**; active 0.5 boundary wajib dibatasi sesuai decision—tidak menganggap semua operand/topology aktif | `relgeo/spec` + scope decisions; `spec/id/geometry/16-collection-objects.md`, `docs/decisions/07-cross-repo-open-decisions.md` | `PENDING-AUDIT` |
| `COLL-004` | Collection access, ordering, `count`, `first`, `last`, dan collection references | User dapat menginspeksi dan menghubungkan hasil repeat/split/boolean | `R-DRAWING`, `R-SHELL` | **IN**; deterministic ordering, no implicit mutation | `relgeo/spec`; `spec/id/geometry/19-collections.md`, `07-type-system.md` | `PENDING-AUDIT` |
| `QUERY-001` | Geometry queries: distance, length, perimeter, bbox, extrema, midpoint, area | User dapat menurunkan ukuran dan relasi dari geometry | `R-DRAWING`, `R-AUTHOR` | **IN**; typed query results dan world-space semantics | `relgeo/spec`; `spec/id/geometry/20-geometry-queries.md` | `PENDING-AUDIT` |
| `QUERY-002` | Path/transform queries: polar, angleBetween, pointAt, tangentAt, normalAt, closestPoint, project, reflect, toWorld/toLocal, intersection, frameAt, tAtLength | User dapat mengonstruksi placement dan derived geometry dari path behavior | `R-DRAWING` | **IN** sebagai query surface; domain/error behavior wajib eksplisit | `relgeo/spec`; `spec/id/geometry/20-geometry-queries.md` | `PENDING-AUDIT` |
| `CON-001` | Directional constraints: equal, parallel, perpendicular, tangent | Reviewer dapat memvalidasi hubungan tanpa solver yang memutasi geometry | `R-DRAWING`, `R-CONTRACT` | **IN** sebagai post-resolve validation; no general constraint solver | `relgeo/spec`; `spec/id/geometry/21-constraints.md`, `spec/id/core/05-semantic-guarantees.md` | `PENDING-AUDIT` |
| `CON-002` | Constraint evaluation and violation payload | User mendapat diagnostic yang menunjuk constraint/path dan objek terkait | `R-WORKBENCH`, `R-SHELL`, `R-CONTRACT` | **IN**; resolver tidak mengubah geometry untuk memaksa pass | `relgeo/spec`; `spec/id/geometry/21-constraints.md`, `spec/id/core/06-error-model.md` | `PENDING-AUDIT` |

### E. Presentation objects dan metadata

| ID | Capability | User outcome | Dasar requirement | Scope decision | Owner / source of truth | Status verifikasi |
| --- | --- | --- | --- | --- | --- | --- |
| `PRES-001` | Dimension objects: linear, radius, diameter, angular, custom label | Technical drawing dapat menampilkan ukuran yang terbaca dan terkait geometry | `R-DRAWING` | **IN** sebagai presentation layer; tidak mengubah model geometry | `relgeo/spec`; `spec/id/presentation/22-dimension.md` | `PENDING-AUDIT` |
| `PRES-002` | Annotation objects: basic dan leader | Author dapat menambahkan explanatory text/leader ke drawing | `R-DRAWING`, `R-MARKDOWN` | **IN** sebagai presentation layer | `relgeo/spec`; `spec/id/presentation/23-annotation.md` | `PENDING-AUDIT` |
| `PRES-003` | Drawing roles, visibility, role filters, default palette/dash/stroke behavior | Output dapat membedakan final, construction, guide, dimension, annotation, dan role lain secara konsisten | `R-DRAWING`, `R-WORKBENCH` | **IN**; renderer override tidak mengubah semantic role | `relgeo/spec`; `spec/id/presentation/24-drawing-roles.md` | `PENDING-AUDIT` |
| `PRES-004` | Views, sheets, sheet sizes/orientation, view filtering, view placement, title block behavior | User dapat membuat layout drawing tanpa mengubah model geometry | `R-DRAWING`, `R-SHELL`, `R-WORKBENCH` | **IN**; pure composition/render layer, read-only terhadap model | `relgeo/spec`; `spec/id/presentation/25-views-sheets.md` | `PENDING-AUDIT` |
| `META-001` | Object metadata dan document metadata | Renderer/tooling dapat membawa intent, label, material, title, author, dan business metadata tanpa mengubah geometry | `R-DRAWING`, `R-CONTRACT` | **IN**; metadata non-authoritative terhadap geometry/dependency graph | `relgeo/spec`; `spec/id/presentation/26-metadata.md` | `PENDING-AUDIT` |
| `META-002` | `metaPresets`, `metaPreset`, dan ordered `meta.inherit` merge | Author dapat reuse style/metadata dengan override yang deterministic | `R-AUTHOR`, `R-DRAWING` | **IN**; legacy `styles/style` hanya compatibility alias bila diterima | `relgeo/spec`; `spec/id/presentation/26-metadata.md` | `PENDING-AUDIT` |

### F. Diagnostics, error model, serialization, dan compatibility behavior

| ID | Capability | User outcome | Dasar requirement | Scope decision | Owner / source of truth | Status verifikasi |
| --- | --- | --- | --- | --- | --- | --- |
| `DIAG-001` | Parse, validation, resolution, geometry, component, collection, hole, dan post-resolution constraint diagnostics | Editor/CLI dapat menjelaskan kesalahan pada fase dan lokasi yang tepat | `R-WORKBENCH`, `R-SHELL`, `R-CONTRACT` | **IN**; diagnostics structured dan actionable, bukan hanya thrown string | `relgeo/spec`; `spec/id/core/06-error-model.md` | `PENDING-AUDIT` |
| `DIAG-002` | Error path, code/category, message, source location, dan involved object payload | User dapat menavigasi error dari source ke object/constraint | `R-WORKBENCH`, `R-SHELL` | **IN**; vocabulary harus stabil lintas consumer | `relgeo/spec`; `spec/id/core/06-error-model.md`, fixture invalid/runtime diagnostics | `PENDING-AUDIT` |
| `ERR-001` | Error phase ordering dan fail-safe behavior | Invalid source tidak menghasilkan resolved geometry yang menyesatkan; valid preview terakhir dapat dipertahankan oleh host | `R-WORKBENCH`, `R-CONTRACT` | **IN**; runtime error vs runtime diagnostic dibedakan | `relgeo/spec`; `spec/id/core/04-evaluation-order.md`, `06-error-model.md`, `fixtures/manifest.json` | `PENDING-AUDIT` |
| `SER-001` | Canonical resolved-scene serialization ke JSON | CLI/CI/agent dapat inspect, diff, cache, dan consume hasil resolve | `R-SHELL`, `R-AGENT`, `R-CONTRACT` | **IN expected**; canonical field/number/identity/error policy perlu menjadi kontrak normatif eksplisit | `relgeo/spec` sebagai semantic owner; CLI output docs dan fixture expected JSON sebagai evidence format | `PENDING-AUDIT — contract gap dicatat, belum di-audit` |
| `SER-002` | SVG serialization/render contract untuk resolved geometry, metadata, views, dan sheets | User dapat embed/export output yang aman dan deterministic | `R-MARKDOWN`, `R-SHELL`, `R-WORKBENCH` | **IN** sebagai output contract berlapis; semantic geometry inti, raw byte equality **OUT** | `relgeo/spec` untuk meaning + `renderer-svg` untuk renderer contract; expected SVG fixtures | `PENDING-AUDIT — presentation policy dipisahkan dari language semantics` |
| `VER-001` | Explicit document DSL version dan default ketika version omitted | Tooling dapat memilih grammar/semantics yang tepat | `R-CONTRACT`, `R-SHELL` | **IN**; active `0.5`, omitted defaults to active implementation line | `relgeo/spec`; `spec/id/core/02-document-structure.md`, `fixtures/manifest.json` | `PENDING-AUDIT` |
| `VER-002` | Compatibility acceptance: active `0.5`, supported legacy `0.4`, regression-only older versions, unsupported future rejection | Existing documents tetap dapat diproses sesuai policy dan future syntax ditolak jelas | `R-CONTRACT`, `R-SHELL` | **IN**; policy harus explicit, bukan silent downgrade | `relgeo/spec` + workspace compatibility policy; `fixtures/manifest.json` | `PENDING-AUDIT` |
| `VER-003` | Backward-compatible aliases/fallbacks dan provenance | Legacy input dapat dipertahankan tanpa mengubah meaning active contract | `R-CONTRACT`, `R-AUTHOR` | **IN terbatas**; alias hanya jika dicatat, tested, dan tidak memperluas semantics | `relgeo/spec` + decision/fixture records; `spec/id/presentation/26-metadata.md` | `PENDING-AUDIT` |
| `VER-004` | Active/candidate/legacy/invalid/runtime-error fixture status sebagai contract promotion boundary | Maintainer dapat membedakan expected language scope dari evidence consumer yang sudah aktif | `R-CONTRACT` | **IN** sebagai compatibility/conformance governance; candidate tidak otomatis menjadi active | `fixtures/manifest.json`, `docs/decisions/07-cross-repo-open-decisions.md` | `PENDING-AUDIT` |

### 4.1 Closure boundary dan acceptance contract

Boundary ini dibekukan pada **53 capability ID** di atas. ID dipilih dari
user journey, target pengguna, workflow DSL, roadmap, keputusan scope, dan
chapter normatif `spec/id/`; status implementation tidak mempengaruhi seleksi.
Karena itu, `🌗`, `⚠️`, `not verified`, candidate fixture, atau host yang belum
tersedia tidak boleh dipakai untuk menghapus, menggabungkan, atau memindahkan
ID ke luar katalog. `GAP-*` dan `CORE-*` adalah work-item/contract anchors,
bukan capability ID tambahan.

Setiap ID wajib memiliki outcome pada tabel katalog, owner/source of truth,
consumer boundary, dan acceptance yang dapat diverifikasi. Tabel berikut adalah
kontrak penerimaan expected; ia bukan klaim bahwa seluruh acceptance sudah lulus.
`Consumer` menyebut boundary yang harus mengonsumsi kontrak, sedangkan
`Acceptance terukur` menyebut assertion minimum yang harus dapat dibuktikan oleh
fixture, test, atau conformance check.

| ID | Consumer boundary | Acceptance terukur |
| --- | --- | --- |
| LANG-001 | parser, CLI, Markdown, Playground, language service | Fixture YAML valid diparse dan round-trip source identity tetap stabil pada semua consumer yang tersedia. |
| LANG-002 | core resolver, CLI, language service, Playground, MCP | Dua resolve atas source dan input identik menghasilkan graph, identity, ordering, dan nilai semantic identik; solver/control-flow tidak diperkenalkan. |
| DOC-001 | parser, schema, CLI, language service | Root-field fixture menerima tepat section yang dispesifikasikan dan menolak field/shape invalid dengan diagnostic terstruktur. |
| DOC-002 | core scene, renderer, CLI, Playground, Markdown | Fixture unit/origin/orientation/autoSize/padding menghasilkan coordinate space dan viewport yang sama pada resolve dan render semantic. |
| DOC-003 | spec docs, website, language service, authoring UX | Semua chapter `spec/id` memiliki status dokumen yang valid dan contoh vocabulary yang dirujuk tidak menambah field DSL tanpa perubahan normatif. |
| DECL-001 | core evaluator, CLI, language service, Playground, Flutter | Fixture parameter default, shorthand, object, dan array menghasilkan type/value yang diharapkan; input missing/invalid mengembalikan code/path stabil. |
| DECL-002 | core evaluator, CLI, language service | Fixture override terhadap constant gagal dan constant structured/array tetap immutable setelah profile serta derived evaluation. |
| DECL-003 | core evaluator, graph inspector, language service, Playground | Global/local derived fixture resolve tanpa mutation; cycle atau unknown dependency menghasilkan diagnostic phase/path yang stabil. |
| DECL-004 | core evaluator, CLI, Playground, Flutter | Profile fixture mengubah parameter yang diizinkan saja; constants dan structure tetap identik, dengan hasil yang repeatable. |
| TYPE-001 | core types, evaluator, schema, language service, CLI, Flutter | Setiap scalar type memiliki valid/invalid fixture dan coercion/unit result yang cocok dengan `spec/id/syntax/07-type-system.md`. |
| TYPE-002 | core types, evaluator, language service, CLI, renderer | Setiap structured type memiliki fixture value dan rejection boundary; type name, shape, dan read-only semantics cocok lintas projection. |
| EXPR-001 | parser, evaluator, language service, CLI | Precedence fixture menghasilkan nilai referensi yang sama dan unsupported expression tidak lolos parse/validate. |
| EXPR-002 | parser, evaluator, language service, CLI | Comparison/logical/ternary fixture lulus; statement-level `if` dan loop fixture ditolak sebagai out-of-scope. |
| EXPR-003 | parser, graph, evaluator, language service, MCP | Symbol/property/index/anchor fixtures resolve ke target yang benar; unknown dan circular reference menunjuk path stabil. |
| EVAL-001 | graph, resolver, CLI, Playground, MCP | Dependency graph fixture menghasilkan satu topological order deterministik dan cycle fixture gagal tanpa partial success palsu. |
| EVAL-002 | units, evaluator, CLI, language service, Flutter | Fixture `10mm`/`1cm` dan unitless context menghasilkan normalized value yang sama dengan scene unit serta diagnostic untuk coercion invalid. |
| OBJ-001 | core object model, renderer, CLI, language service, MCP | Object fixture mempertahankan stable ID, category, common fields, dan dependency edges tanpa identity berbasis array index. |
| GEO-001 | core geometry, renderer, CLI, Playground, Flutter | Point mode fixture mencakup absolute/relative/expression/intersection dan menghasilkan typed point atau diagnostic yang ditentukan. |
| GEO-002 | core geometry, renderer, CLI, Playground | Line mode fixture mencakup from-to/direction-length/tangent dan memeriksa anchors serta invalid direction secara deterministik. |
| GEO-003 | core geometry, renderer, CLI, Markdown, Playground | Rect/circle/ellipse fixture memeriksa size/radius, placement, properties, anchors, dan hole semantics pada resolved projection. |
| GEO-004 | core geometry, renderer, CLI, Markdown, Playground | Arc/quad/cubic/path/polygon/text fixture menghasilkan semantic geometry/text yang sesuai; unsupported variant ditolak terukur. |
| GEO-005 | geometry topology, core, renderer, CLI | Closed-shape fixture memeriksa holes, close/join, corner, degenerate, dan invalid-topology outcomes tanpa auto-repair tersirat. |
| COMP-001 | core composition, renderer, CLI, Playground, Flutter | Group fixture mempertahankan hierarchy dan membedakan local pre-transform dari world post-transform anchors. |
| COMP-002 | core resolver, renderer, CLI, language service | Clone fixture membuktikan reuse tidak berbagi mutable state serta identity, transform, dan metadata tetap sesuai contract. |
| COMP-003 | core components, evaluator, language service, Playground, MCP | Component fixture membuktikan scoped params/local derived/exports dan menolak scope leakage pada nested instance. |
| PLACE-001 | core placement, renderer, CLI, Playground | Placement matrix fixture mencakup scalar/point/anchor/multi-anchor/inside/offset dan setiap unsupported combination menghasilkan diagnostic. |
| PLACE-002 | core placement, renderer, CLI, Playground | `on.point` fixture menempatkan object pada point/anchor yang tepat dan mempertahankan identity. |
| PLACE-003 | core placement, geometry queries, renderer, CLI | `on.path` fixture memeriksa `t`, anchor, offset, orientation, serta out-of-domain path parameter. |
| PLACE-004 | core placement, geometry, renderer, Playground | `on.frame` fixture memeriksa point dan orientation `frame2d` dalam 2D tanpa mengubah source geometry. |
| ANCH-001 | core anchors, evaluator, language service, renderer, CLI | Named/world anchor fixture memeriksa typed read-only values sebelum dan sesudah transform, termasuk missing-anchor diagnostic. |
| COLL-001 | core collections, geometry, renderer, CLI, Playground | Repeat fixture memeriksa setiap active mode, deterministic child identity, ordering, dan repeat context. |
| COLL-002 | core collections, geometry, CLI, Playground | Divide/split fixture memeriksa result shape, collection identity, pick/index behavior, dan invalid split input. |
| COLL-003 | geometry boolean, core, renderer, CLI | Active boolean fixture hanya mengklaim approved v0.5 boundary; union/xor, multipart, degenerate, dan unsupported operands memiliki explicit result/diagnostic. |
| COLL-004 | core evaluator, language service, CLI, Playground | Collection fixture memeriksa ordering, count/first/last/index, empty behavior, dan no implicit mutation. |
| QUERY-001 | core evaluator, geometry, CLI, language service, Playground | Query fixture memeriksa distance/length/perimeter/bbox/extrema/midpoint/area dengan typed result dan tolerance yang terdokumentasi. |
| QUERY-002 | geometry queries, placement, renderer, CLI, Playground | Path/transform fixture memeriksa domain, tolerance, canonical intersection ordering, and `toWorld`/`toLocal` result type. |
| CON-001 | core constraints, geometry, CLI, language service, Playground | Equal/parallel/perpendicular/tangent fixtures run after resolve and emit the documented validation result without mutation. |
| CON-002 | core diagnostics, CLI, language service, MCP, Playground | Violation fixture includes constraint path, involved objects, expected/actual, and unchanged resolved geometry before/after validation. |
| PRES-001 | core presentation, renderer, CLI, Markdown, Playground | Dimension-kind fixture preserves semantic value, label, identity, role, and placement through semantic SVG/JSON projection. |
| PRES-002 | core presentation, renderer, CLI, Markdown, Playground | Annotation/leader fixture preserves text and placement while hostile text is escaped and executable markup is absent. |
| PRES-003 | spec roles, renderer, CLI, Markdown, Playground | Role fixture checks final/construction/guide/dimension/annotation visibility and default style behavior without changing role meaning. |
| PRES-004 | core sheets/views, renderer, CLI, Markdown, Playground, Flutter | View/sheet fixture checks size, orientation, filter, placement, and title-block semantics without mutating model geometry. |
| META-001 | core metadata, renderer, CLI, Markdown, Playground, MCP | Metadata fixture proves labels/business fields survive projection while geometry/dependency graph remains byte-independent of metadata values. |
| META-002 | core metadata, schema, language service, CLI, Markdown | Ordered inherit/preset fixture checks merge precedence and bounded `styles/style` alias provenance. |
| DIAG-001 | core, language service, CLI, Playground, MCP, Flutter | One fixture per diagnostic phase produces structured code, phase, severity, message, and known path/range fields in deterministic order. |
| DIAG-002 | core, language service, CLI, Playground, MCP, Flutter | Public boundary inspection finds no raw `Error`/stack; code, path, category, message, source range, and involved-object payload are stable. |
| ERR-001 | parser, core resolver, CLI, language service, Playground | Invalid source fails at the originating phase, strict compile emits no output, and editor mode retains only an explicitly valid last preview. |
| SER-001 | core projection, CLI, CI, MCP, language service | Resolved-scene JSON fixture matches schema/version, field order, identity order, number normalization, and error policy exactly. |
| SER-002 | renderer, CLI, Markdown, website, Playground, Flutter | Semantic SVG fixture preserves geometry/role/identity/placement and rejects executable markup; byte-identical SVG is not required. |
| VER-001 | parser, core, CLI, language service, fixtures | Explicit and omitted version fixtures select active `0.5`; future version fixture fails with the registered version diagnostic. |
| VER-002 | core, CLI, language service, all consumer adapters | Active/legacy/regression/future fixture statuses produce the declared compatibility result with no silent downgrade. |
| VER-003 | parser, schema, language service, core metadata, CLI | Each accepted alias has normative provenance, canonical replacement, positive fixture, and negative unknown-alias behavior. |
| VER-004 | fixture manifest, conformance runner, CI, all consumers | Every fixture has one declared status and promotion checks prevent candidate evidence from being reported as active. |

The acceptance rows above are frozen alongside the ID set. A future change to
consumer boundary or acceptance must update the normative source/fixture and
this catalog in the same change; editing the matrix alone is insufficient.

## 5. Scope exclusions dan batas yang tidak boleh tersirat

Item berikut sengaja tidak menjadi capability expected pada line ini:

- 3D geometry;
- animation atau timeline;
- scripting, statement-level `if`, dan loop sebagai bahasa;
- general-purpose/bidirectional constraint solver;
- raw SVG byte equality sebagai language contract;
- mobile Android/iOS workbench delivery sebagai exit gate; keputusan tersebut
  deferred tanpa tanggal, bukan alasan menghapus capability bahasa 2D;
- publishable Flutter/Dart package atau desktop distribution contract.

Boolean `union`/`xor`, operand non-rectangle, degenerate input, multipart policy,
dan evaluator/unit promotion tetap tercatat sebagai expected surface bila disebut
oleh spec, tetapi active compatibility claim harus mengikuti boundary decision dan
status fixture. `fixtures/manifest.json` adalah provenance status, bukan daftar
awal capability.

## 6. Fixture provenance untuk verifikasi berikutnya

Fixture dipakai setelah katalog ini disepakati untuk menguji subset capability,
bukan untuk menciptakan daftar expected:

| Fixture evidence | Capability yang dapat dipetakan saat audit |
| --- | --- |
| `10-v05-relational-baseline` (`active`) | document structure, declarations, relations, primitive objects, metadata/presentation baseline, resolved JSON/SVG, cross-surface consumption |
| `14-v05-runtime-align-violation` (`runtime-diagnostic`) | constraints, post-resolution diagnostics, error path/payload |
| `15-v05-boolean-intersection-candidate` (`active` pada boundary terbatas) | line intersection dan rectangle boolean boundary yang disetujui; bukan semua boolean/topology |
| `16-v05-evaluator-units-candidate` (`capability`) | evaluator, parameters, derived placement, unit conversion; candidate evidence, bukan active promotion |
| `11–13`, `17–18` (`invalid`) | required field, YAML parse, unknown reference, unsupported future version |
| `19–20` (`runtime-error`) | boolean empty/multipart resolution error boundaries |
| `30-v05-metadata-inherit-alias` (`active`) | nested metadata preset inheritance, `styles`/`style` compatibility aliases, resolved JSON/SVG, language-service, Markdown, Playground, and CLI propagation |

## 7. Invariants setelah audit handoff

Katalog dan downstream audit tetap konsisten jika:

1. ID, scope exclusions, dan unresolved contract gaps tetap dipertahankan;
2. audit/reconciliation mempertahankan matrix per capability dengan status implementasi, evidence,
   parity, dan verification terpisah;
3. audit tidak mengubah owner/source of truth dari `relgeo/spec` hanya karena
   implementasi consumer saat ini berbeda;
4. serialization contract (`SER-001`, `SER-002`) mendapat keputusan eksplisit
   sebelum downstream observed status dipromosikan menjadi verified/partial/not
   verified; expected rows tetap `PENDING-AUDIT`.

### Source register wajib

- [`docs/MATURATION-MASTER-PLAN.md`](../../MATURATION-MASTER-PLAN.md)
- [`docs/REPOSITORY-MAP.md`](../../REPOSITORY-MAP.md)
- [`docs/capability-map/INVENTORY-PROTOCOL.md`](../INVENTORY-PROTOCOL.md)
- [`docs/capability-map/SURFACE-DISCOVERY-LEDGER.md`](../SURFACE-DISCOVERY-LEDGER.md)
- [`docs/decisions/07-cross-repo-open-decisions.md`](../../decisions/07-cross-repo-open-decisions.md)
- [`spec/`](../../../spec)
- [`fixtures/manifest.json`](../../../fixtures/manifest.json)
