# Expected Markdown-Surfaces Capability Catalog

**Status:** expected baseline untuk review maintainer; implementation comparison separate
**Tanggal penyusunan:** 2026-10-30
**Owner katalog:** `relgeo/workspace`
**Owner capability utama:** `relgeo/remark-relgeo` dan `relgeo/remark-relgeo-hl`
**Compatibility target:** RelGeo DSL `0.5`

## Tujuan dan aturan pembacaan

Dokumen ini menetapkan kemampuan yang **seharusnya tersedia** pada Markdown
integration surface RelGeo, termasuk capability yang belum pernah dibuat. Ia
disusun dari user journey, target consumer, workflow produk, kontrak DSL,
roadmap, dan keputusan scope. Dokumen ini bukan audit source, bukan bukti
implementasi, dan bukan pengganti matrix status.

Setiap row memiliki ID stabil untuk rekonsiliasi tahap berikutnya, user outcome,
dasar requirement, keputusan scope, owner/source of truth, dan status verifikasi.
`Requirement confirmed; implementation comparison separate` berarti requirement
sudah memiliki dasar yang dapat ditelusuri. Source, test, consumer, dan runtime
evidence boleh dipakai pada audit downstream, tetapi tidak boleh menghapus atau
menyusutkan expected set pada dokumen ini.

## Sumber enumerasi awal

Daftar capability di bawah diturunkan dari sumber berikut, **bukan dari kode,
matrix capability lama, atau hasil audit sebelumnya**:

| Sumber | Peran dalam enumerasi |
| --- | --- |
| [`docs/MATURATION-MASTER-PLAN.md`](../../MATURATION-MASTER-PLAN.md) §2.3–2.7, §3.1–3.2, §4.3–4.5 | source-of-truth hierarchy, ownership `remark`/website/Playground, dependency flow, active compatibility line, shared fixtures, dan aturan pemisahan implementasi dari verifikasi |
| [`docs/plans/05-public-docs-and-playground-hardening.md`](../../plans/05-public-docs-and-playground-hardening.md) §3–5, §6.D–F, §8–11 | public-surface journey, `source → resolve → preview → diagnostic`, recovery, accessibility, Pages artifact, dan batas website/Playground |
| [`playground/docs/README.md`](../../../playground/docs/README.md), [`playground/docs/UX-UI-AUDIT-AND-PLAN.md`](../../../playground/docs/UX-UI-AUDIT-AND-PLAN.md) | target user dan consumer workflow: author source, live preview, inspect, share/export; Playground tetap lightweight browser IDE |
| [`spec/id/README.md`](../../../spec/id/README.md), [`spec/id/core/01-overview.md`](../../../spec/id/core/01-overview.md), [`spec/id/core/02-document-structure.md`](../../../spec/id/core/02-document-structure.md), [`spec/id/core/06-error-model.md`](../../../spec/id/core/06-error-model.md) | parser → validator → resolver → renderer, deterministic typed DSL, document shape, version default, structured error vocabulary, dan source location expectation |
| [`spec/id/presentation/25-views-sheets.md`](../../../spec/id/presentation/25-views-sheets.md), [`spec/id/presentation/26-metadata.md`](../../../spec/id/presentation/26-metadata.md), [`spec/id/syntax/11-profiles.md`](../../../spec/id/syntax/11-profiles.md) | expected presentation inputs untuk model preview, view/sheet selection, metadata, dan profile selection |
| [`relgeo.github.io/docs/VISUAL-DESIGN-RULES.md`](../../../relgeo.github.io/docs/VISUAL-DESIGN-RULES.md), [`relgeo.github.io/docs/VISUAL-REDESIGN-AUDIT-AND-PLAN.md`](../../../relgeo.github.io/docs/VISUAL-REDESIGN-AUDIT-AND-PLAN.md) | website integration boundary, technical/readability surface, static landing versus interactive docs/Playground, build and public artifact expectations |
| [`docs/compatibility-matrix.json`](../../compatibility-matrix.json) | dibaca setelah enumerasi untuk mengikat compatibility line, package boundary, version policy, dan release order; **bukan sumber daftar capability awal** |
| [`remark-relgeo/README.md`](../../../remark-relgeo/README.md), [`remark-relgeo/DEVELOPMENT-PLAN.md`](../../../remark-relgeo/DEVELOPMENT-PLAN.md), [`remark-relgeo-hl/README.md`](../../../remark-relgeo-hl/README.md), dan [`remark-relgeo-hl/DEVELOPMENT-PLAN.md`](../../../remark-relgeo-hl/DEVELOPMENT-PLAN.md) | package contract, target maturity, boundary, public usage, output shape, and roadmap inputs; source implementation and tests remain audit evidence, not the sole basis for enumerating expected capabilities |

## Surface workflow and command inventory

Markdown plugins do not expose a product menu. Their command surface is the
documented integration workflow used by authors, maintainers, and CI:

| Actor / target user | Workflow or command | Expected product outcome | Catalog rows driven | Source |
| --- | --- | --- | --- | --- |
| Documentation author / site maintainer | Register `remarkRelgeo` in a unified/remark pipeline and write a `relgeo` fenced block | A valid block becomes a preview/embed while unrelated Markdown remains intact; a failed block has a safe, contextual fallback | `MD-FENCE-*`, `MD-PREVIEW-*`, `MD-ERR-*` | [`remark-relgeo/README.md`](../../../remark-relgeo/README.md), [`remark-relgeo/DEVELOPMENT-PLAN.md`](../../../remark-relgeo/DEVELOPMENT-PLAN.md) §§1–7 |
| Documentation author / reader | Register `remarkRelgeoHl` and write an `rg` fenced block | Source remains a copyable, line-preserving `pre > code` surface with stable token metadata, including when semantic highlighting is unavailable | `MD-FENCE-002`, `MD-HL-*`, `MD-A11Y-002` | [`remark-relgeo-hl/README.md`](../../../remark-relgeo-hl/README.md), [`remark-relgeo-hl/DEVELOPMENT-PLAN.md`](../../../remark-relgeo-hl/DEVELOPMENT-PLAN.md) §§1–7 |
| Package consumer | Run the package `build`, `lint`, and `test` commands from a clean package checkout | Public exports, types, output contract, and regression behavior are reproducible without depending on website or Playground source | `MD-SSR-002`–`MD-SSR-004`, `MD-REL-001`–`MD-REL-002` | `remark-relgeo/package.json`, `remark-relgeo-hl/package.json`, both package READMEs |
| Website / Pages maintainer | Build the public Markdown documentation and inspect the generated artifact | The same preview/highlight contract works in the static/SSR consumer, with public routes, assets, provenance, and readable fallback output | `MD-SSR-*`, `MD-ASSET-*`, `MD-WEB-*`, `MD-A11Y-*` | [`docs/MATURATION-MASTER-PLAN.md`](../../MATURATION-MASTER-PLAN.md) §§2.3–2.5, 3.1–3.2, 4.3–5; [`docs/REPOSITORY-MAP.md`](../../REPOSITORY-MAP.md) |
| Maintainer / CI owner | Compare output for the same source/options and run shared Markdown fixtures or integration gates | Drift, hidden environment dependence, and accidental package/consumer contract changes are visible before release | `MD-FENCE-003`, `MD-SSR-001`–`MD-SSR-004`, `MD-REL-002` | [`docs/MATURATION-MASTER-PLAN.md`](../../MATURATION-MASTER-PLAN.md) §§2.3–2.5, 4.4, 5; [`docs/capability-map/INVENTORY-PROTOCOL.md`](../INVENTORY-PROTOCOL.md) |

## Target user dan journey

Katalog ini mengasumsikan dua journey yang sama-sama harus dipertahankan:

1. **Documentation author:** menulis fenced RelGeo di Markdown, menjalankan
   unified/remark saat build, lalu menerbitkan source yang dapat dibaca dan
   preview yang aman.
2. **Reader/maintainer:** membuka halaman statis atau SSR, melihat preview,
   memahami source/highlighting, dan memperoleh error yang dapat ditindaklanjuti
   tanpa halaman atau build menjadi rusak secara misterius.

Journey pendukungnya adalah authoring loop Playground: `edit → resolve → preview
→ inspect → share/export`. Markdown plugins mengonsumsi hasil dan kontrak dari
layer lain; mereka tidak menjadi pemilik editor, persistence, inspector, atau
normative DSL.

## Keputusan scope katalog

### In scope

- fenced-code discovery dan preservation pada Markdown AST;
- preview/embed RelGeo yang deterministik dan dapat dipakai pada build/SSR;
- syntax highlighting untuk source RelGeo;
- options, version/profile/view/sheet pass-through, diagnostic/error policy;
- safe HTML/SVG dan asset behavior;
- accessibility baseline untuk source, preview, dan error output;
- website/Pages consumption, artifact, provenance, dan public package boundary.

### Boundary only

Parser, validator, resolver, geometry runtime, SVG renderer, language-service
diagnostic vocabulary, dan DSL semantics tetap dimiliki layer masing-masing.
`remark-relgeo` wajib memakai hasil/kontrak canonical itu, tetapi tidak boleh
membuat semantic engine kedua. Website memiliki assembly, copy, route, dan
delivery evidence; Playground memiliki editor, persistence, inspector, dan
interactive recovery.

### Out of scope untuk katalog ini

- perubahan grammar atau semantics DSL;
- general-purpose CAD/print workbench dan arbitrary interaction di dalam embed;
- inline RelGeo syntax di luar fenced block;
- remote fetch atau filesystem write sebagai side effect default plugin;
- mobile-device, VoiceOver/TalkBack, atau platform QA yang sudah ditunda oleh
  keputusan scope; dan
- byte-for-byte SVG equality sebagai contract.

## Katalog expected

| ID | Capability expected | User outcome | Dasar requirement | Scope decision | Owner / source of truth | Status verifikasi |
| --- | --- | --- | --- | --- | --- | --- |
| `MD-FENCE-001` | Recognize RelGeo fenced blocks and aliases | Author dapat menulis fence RelGeo yang dikenali tanpa memengaruhi fence bahasa lain. | Terminology policy mencatat fence `rg` dan `relgeo`; Markdown surface pada master plan §3.1. | In scope; exact alias set harus dikunci sebelum audit, non-RelGeo fence wajib dilewati. | `remark-relgeo` + `remark-relgeo-hl`; source-of-truth naming di package docs/website terminology, semantics di `spec/id`. | Requirement confirmed; implementation audit pending |
| `MD-FENCE-002` | Preserve source, whitespace, info string, and block boundaries | Source tetap dapat dibaca, di-highlight, dipakai sebagai fallback, dan tidak mengubah Markdown di sekitar block. | Human-readable DSL dan editor journey pada spec §1.2; source-first principle pada Playground UX plan. | In scope untuk AST/text preservation; Markdown parser tetap milik unified/remark. | `remark-relgeo`/`remark-relgeo-hl`; upstream Markdown AST contract. | Requirement confirmed; implementation audit pending |
| `MD-FENCE-003` | Handle multiple and mixed Markdown blocks deterministically | Satu halaman dengan banyak RelGeo/non-RelGeo block menghasilkan urutan output yang stabil. | Deterministic DSL principle; website static build dan public artifact requirement pada plan 05 §5/§8. | In scope; block isolation wajib, tidak ada global mutable state antar-block. | Kedua plugin; build contract `relgeo.github.io`. | Requirement confirmed; implementation audit pending |
| `MD-PREVIEW-001` | Render valid RelGeo fence as an embeddable preview | Reader melihat preview geometri yang dihasilkan dari source RelGeo di halaman Markdown. | Master plan §3.1–3.2 menempatkan `remark-relgeo` sebagai preview/embed; spec pipeline parser → renderer. | In scope; output harus cocok dengan host Markdown/HTML dan memakai canonical runtime. | `remark-relgeo`; semantics `spec/id`, runtime `core`, rendering `renderer-svg`. | Requirement confirmed; implementation audit pending |
| `MD-PREVIEW-002` | Keep model preview as default, with explicit view/sheet path | Preview default membantu authoring/inspection; view/sheet dipilih secara eksplisit bila dibutuhkan. | `playground/docs/README.md` §4–5; normative views/sheets §25. | In scope sebagai presentation policy; bukan komitmen membangun print workbench. | `remark-relgeo`; `spec/id/presentation/25-views-sheets.md`. | Requirement confirmed; implementation audit pending |
| `MD-PREVIEW-003` | Reuse canonical parse/validate/resolve/render semantics | Output Markdown tidak berbeda diam-diam dari Playground, CLI, atau renderer resmi. | Master plan source-of-truth §2.3 dan dependency flow §3.2; spec evaluation model. | Boundary integration wajib; plugin tidak memiliki semantic implementation kedua. | `remark-relgeo`; semantic owner `core`/`spec/id`, renderer owner `renderer-svg`. | Requirement confirmed; implementation audit pending |
| `MD-PREVIEW-004` | Preserve surrounding Markdown structure | Heading, paragraph, list, link, and adjacent Markdown tetap valid setelah transform. | Website docs sebagai reading surface; plan 05 §3 dan §6.C. | In scope; transform hanya pada target node dan tidak mengambil alih seluruh document renderer. | `remark-relgeo`; upstream mdast/hast contract dan website build. | Requirement confirmed; implementation audit pending |
| `MD-HL-001` | Highlight RelGeo source in fenced code | Reader dapat memahami keyword, field, value, dan struktur RelGeo dari code fence. | Master plan §3.1–3.2 menempatkan `remark-relgeo-hl` sebagai source highlighting; spec human-readable/typed principle. | In scope untuk lexical/source projection; bukan semantic resolver atau editor UI. | `remark-relgeo-hl`; lexical vocabulary mengikuti `spec/id` dan language-service boundary. | Requirement confirmed; implementation audit pending |
| `MD-HL-002` | Preserve readable highlighting for partial or invalid source | Source yang sedang ditulis atau invalid tetap tampil sebagai text yang aman, tidak hilang atau membuat build crash. | Plan 05 §4.9, §6.D, §8; error recovery principle. | In scope; fallback plain text adalah minimum, semantic recovery bukan tanggung jawab highlighter. | `remark-relgeo-hl`; error semantics `spec/id/core/06-error-model.md`. | Requirement confirmed; implementation audit pending |
| `MD-HL-003` | Stable token output, whitespace, line breaks, and classes | CSS website dapat memberi style konsisten tanpa merusak line numbering, copy, atau wrapping. | Website technical-surface rules; accessible/readable code surface pada plan 05 §4 dan visual rules. | In scope; exact class/token schema perlu dikunci sebagai package contract. | `remark-relgeo-hl`; website CSS is consumer, package README is API documentation. | Requirement confirmed; implementation audit pending |
| `MD-HL-004` | Highlighting is isolated from semantic resolution | Highlighting cepat dan dapat dipakai saat source belum valid tanpa mengklaim preview berhasil. | Separation of language-service tokenization and core semantics; plan 05 source/resolve boundary. | In scope; no geometry/runtime dependency is required merely to color source. | `remark-relgeo-hl`; lexical contract `language-service`/`spec/id`, not `core` output. | Requirement confirmed; implementation audit pending |
| `MD-DIAG-001` | Structured diagnostics with code, severity, message, and location | Author/reader mendapat error yang dapat ditelusuri ke block dan lokasi source. | Normative error model §6.1–6.7; plan 05 runtime diagnostic and Errors surface. | Boundary integration; vocabulary berasal dari spec/core, Markdown plugin memetakan context block. | `remark-relgeo` + `remark-relgeo-hl`; normative `spec/id/core/06-error-model.md`. | Requirement confirmed; implementation audit pending |
| `MD-DIAG-002` | Render actionable source/build diagnostics | Error menjelaskan block yang gagal dan memberi source/fallback yang masih bisa dibaca. | Plan 05 §4.9, §6.D, §8.2; reader recovery journey. | In scope; exact visual UI belongs to website/host, plugin owns safe diagnostic payload. | `remark-relgeo`; website/host owns presentation, spec/core owns semantic code. | Requirement confirmed; implementation audit pending |
| `MD-DIAG-003` | Preserve valid preview when diagnostics are non-fatal | Diagnostic pasca-resolve tidak otomatis menghapus preview yang masih valid. | Plan 05 §6.D dan §8.2: runtime diagnostic tampil di Errors tanpa menghilangkan preview valid; spec §6.6. | In scope as tolerant-mode contract; host may choose strict mode explicitly. | `remark-relgeo`; runtime diagnostics `core`, rendering `renderer-svg`. | Requirement confirmed; implementation audit pending |
| `MD-DIAG-004` | Separate tolerant and strict failure policy | Build owner dapat memilih warning/fallback atau hard failure tanpa perilaku implisit. | Spec §6.6 strict-mode note; release/build gates pada plan 05 §5.3, §8. | In scope sebagai option/policy boundary; default harus terdokumentasi dan deterministic. | `remark-relgeo`; policy owner package/website build, diagnostic vocabulary `spec/core`. | Requirement confirmed; implementation audit pending |
| `MD-OPT-001` | Documented option schema, defaults, and immutability | Integrator tahu option yang tersedia, default-nya, dan dapat memakai satu plugin instance lintas file dengan aman. | Package/public API boundary pada master plan §2.3–2.4; deterministic build principle. | In scope; exact option names are a decision/API detail, bukan inferensi dari implementation audit. | Masing-masing package untuk API; compatibility policy di `docs/compatibility-matrix.json`. | Requirement confirmed; implementation audit pending |
| `MD-OPT-002` | Pass through DSL version, profile, view, and sheet selection | Integrator dapat memilih contract/version atau presentation preset tanpa mengubah source secara diam-diam. | Spec overview version default; profiles §11; views/sheets §25; compatibility line 0.5. | In scope bila didukung canonical runtime; unsupported/future version harus tetap explicit error. | `remark-relgeo`; spec source of truth dan compatibility matrix policy. | Requirement confirmed; implementation audit pending |
| `MD-OPT-003` | Configure output/presentation and code-class behavior | Website dapat menyesuaikan wrapper, renderer presentation, asset/base behavior, atau highlighter classes secara terbatas. | Website visual/technical surface rules; plan 05 artifact and integration boundary. | In scope as controlled public API; no arbitrary HTML/renderer escape hatch that bypasses safety. | Package owners; consumer contract `relgeo.github.io`. | Requirement confirmed; implementation audit pending |
| `MD-OPT-004` | Configure diagnostic and fallback policy | Build pipeline dapat menetapkan bagaimana invalid/unsupported input dipublikasikan. | Error model, strict-mode note, and public build gate. | In scope; policy must not change semantic meaning or conceal diagnostics. | `remark-relgeo`; spec/core diagnostics and website build owner. | Requirement confirmed; implementation audit pending |
| `MD-SSR-001` | SSR and static-build safe execution | Plugin dapat dipakai pada unified/remark saat build tanpa mengharuskan `window`, DOM, browser storage, atau user interaction. | Website Astro static build and Pages assembly in plan 05 §5.1/§5.3; Playground is separate browser consumer. | In scope; browser-only behavior belongs to Playground, not package transform. | Both packages; website build contract `relgeo.github.io`. | Requirement confirmed; implementation audit pending |
| `MD-SSR-002` | Deterministic output for identical source and options | Rebuild menghasilkan HTML/SVG/highlight yang stabil dan dapat dibandingkan di CI. | Spec deterministic principle; integration/conformance and artifact assertions in master plan/plan 05. | In scope; timestamps, random IDs, and environment paths must not leak into output by default. | Both packages; canonical fixtures owned by workspace/consumer. | Requirement confirmed; implementation audit pending |
| `MD-SSR-003` | Compatible unified/remark pipeline contract | Integrator dapat menempatkan plugin pada pipeline Markdown yang terdokumentasi, termasuk ordering terhadap highlight/HTML plugins. | Markdown integration role in master plan §3.2; website docs build boundary. | In scope; exact plugin ordering must be documented and tested in package/website consumer. | Package owners; upstream `unified`/`remark` contract and website consumer. | Requirement confirmed; implementation audit pending |
| `MD-SSR-004` | Reproducible public package build/export surface | Fresh consumer dapat meng-install package dan memakai documented exports/types tanpa workspace-relative dependency. | Compatibility matrix package boundary/release order; master plan reproducible fresh-clone principle. | In scope for delivery readiness; package remains independent from website source tree. | `remark-relgeo`/`remark-relgeo-hl`; `docs/compatibility-matrix.json`. | Requirement confirmed; implementation audit pending |
| `MD-ASSET-001` | Deterministic inline/asset URL policy | Preview dan highlighter tampil benar di local build, Pages subpath, dan SSR tanpa path yang hanya valid di checkout developer. | Plan 05 §5.1 Pages artifact assembly; website build and public route requirements. | In scope; inline SVG or explicit public-base policy must be chosen and documented. | `remark-relgeo` + website build owner; asset contract in package API. | Requirement confirmed; implementation audit pending |
| `MD-ASSET-002` | No implicit filesystem or network dependency | Build tidak membaca path lokal arbitrer atau melakukan fetch remote untuk membuat preview default. | Public-surface boundary in master plan §2.2; static reproducible build policy. | In scope as safety/reproducibility boundary; explicit caller-provided asset resolver may be a later option. | Both packages; website/CI environment is consumer evidence. | Requirement confirmed; implementation audit pending |
| `MD-ASSET-003` | Safe escaping/sanitization of generated HTML, SVG, and URLs | Source/metadata tidak dapat menyuntikkan script, unsafe URL, atau markup keluar dari boundary output. | Public repository safety §2.2; renderer/website technical surface and public build rules. | In scope; plugin must preserve security boundary even when source is invalid or metadata is user-controlled. | `remark-relgeo`/`remark-relgeo-hl`; semantic metadata `spec/id/presentation/26-metadata.md`, host sanitizer policy. | Requirement confirmed; implementation audit pending |
| `MD-A11Y-001` | Accessible preview wrapper and SVG naming | Reader dengan assistive technology mendapat nama/role/context yang menjelaskan preview atau statusnya. | Plan 05 §4.7, §8.2; visual rules §10; public Playground/website accessibility contract. | In scope for generated output; exact wrapper semantics should be chosen with website consumer, not hidden in CSS. | `remark-relgeo` + `relgeo.github.io`; SVG semantics/metadata from renderer/spec. | Requirement confirmed; implementation audit pending |
| `MD-A11Y-002` | Accessible source, error, and fallback content | Preview failure tetap menyediakan source/error yang dapat dibaca; highlighter tidak bergantung pada warna saja. | Plan 05 keyboard/AX/Errors requirements; visual rules §10. | In scope; physical mobile/VoiceOver evidence is separate and currently deferred, not a reason to omit the contract. | Both packages for output structure; website CSS/host for final presentation. | Requirement confirmed; implementation audit pending |
| `MD-A11Y-003` | No accidental focus trap or interaction requirement in static embed | Embed non-interaktif tidak memaksa tab stop; jika future controls ditambahkan, label/state contract harus explicit. | Plan 05 §4.7 and §8; Playground focus-trap rules apply to interactive host, not static Markdown. | Boundary only for current packages; interactive controls remain out of scope unless separately decided. | `remark-relgeo` output contract; website/host owns interactive behavior. | Requirement confirmed; implementation audit pending |
| `MD-ERR-001` | Contextual malformed-input and unsupported-fence handling | Satu block rusak tidak membuat seluruh document/build gagal tanpa context; non-RelGeo fence tetap aman. | Spec error phases and error vocabulary; mixed Markdown journey; build recovery rules. | In scope; strict mode may fail deliberately, but error must remain contextual and deterministic. | Both packages; `spec/id/core/06-error-model.md`, unified/website build policy. | Requirement confirmed; implementation audit pending |
| `MD-ERR-002` | Version-policy errors for active, legacy, and future DSL | Reader/build owner dapat membedakan default active, supported legacy, regression-only, dan unsupported future input. | Master plan §2.4; compatibility matrix version acceptance and `UNSUPPORTED_SPEC_VERSION` policy. | In scope as pass-through/projection; migration is not performed silently by Markdown plugin. | `remark-relgeo`; `spec/id` + `docs/compatibility-matrix.json`. | Requirement confirmed; implementation audit pending |
| `MD-ERR-003` | Safe mapping of runtime/render failures | Resolver/renderer failure menjadi output yang dapat dibaca dan tidak meninggalkan partial unsafe markup. | Spec §6.2–6.6; public artifact and runtime diagnostic acceptance in plan 05 §8.2. | In scope; plugin does not invent new semantic error codes. | `remark-relgeo`; `core`/`renderer-svg` owners, website output consumer. | Requirement confirmed; implementation audit pending |
| `MD-WEB-001` | Website documentation consumption | Website docs/spec examples dapat memakai highlighting dan preview pada surface yang tepat, sementara landing tetap editorial/static. | Plan 05 §3, §6.C; visual rules §1 and §9; master plan website boundary. | In scope for integration; landing hero is not a required live renderer/highlighter surface. | `relgeo.github.io` integration; packages own transform APIs. | Requirement confirmed; implementation audit pending |
| `MD-WEB-002` | Pages artifact carries verified Markdown output | Build artifact yang dipublish memuat output plugin yang sama dengan yang diuji, dengan route/public smoke coverage. | Plan 05 §5.1, §5.3, §8.2, §11; artifact assertion requirement. | In scope for consumer/delivery evidence; not a package-internal deployment feature. | `relgeo.github.io`; package outputs are dependencies, root/workspace owns cross-repo gate. | Requirement confirmed; implementation audit pending |
| `MD-WEB-003` | Spec provenance and package version remain explicit | Website tidak menggandakan makna normatif atau mengiklankan capability/plugin version yang tidak sesuai line 0.5.x. | Master plan §2.3–2.4; spec README provenance; terminology/visual docs. | In scope for integration copy/provenance; website is not normative source. | `spec/id` and compatibility matrix; website consumes; packages expose provenance as documented. | Requirement confirmed; implementation audit pending |
| `MD-WEB-004` | Public route, localization, and technical readability compatibility | Output Markdown tetap dapat dibaca pada localized docs, responsive technical surface, and public route/subpath. | Plan 05 §3, §5.1, §8; visual rules §9–10; website build output. | In scope for consumer contract; physical mobile QA remains deferred per accepted decision. | `relgeo.github.io`; package HTML/SVG contract is upstream input. | Requirement confirmed; implementation audit pending |
| `MD-REL-001` | Independent public package API and documentation | Developer dapat memasang kedua package, membaca README/examples, dan memahami ordering/options/errors tanpa source workspace. | Master plan package boundaries, README ownership, reproducible fresh clone principle. | In scope; no implicit dependency on Playground or website source. | Each package repository; release policy `docs/compatibility-matrix.json`. | Requirement confirmed; implementation audit pending |
| `MD-REL-002` | Compatibility-line and release-order conformance | Kedua package menyatakan dan mengikuti DSL `0.5.x` serta release order yang sama dengan ecosystem. | `docs/compatibility-matrix.json` package entries, version policy, release order; master plan §2.4. | In scope for integration/release contract; publish action itself remains outside this catalog. | `docs/compatibility-matrix.json`; package metadata/README are evidence targets. | Requirement confirmed; implementation audit pending |

## Expected catalog invariants

Tahap audit berikutnya harus mempertahankan invariants ini:

1. Satu ID expected dipetakan ke satu row observed/reconciliation; capability
   yang tidak ditemukan tetap dicatat sebagai gap, bukan dihapus dari katalog.
2. `implementation status`, `verification status`, dan `scope decision` adalah
   tiga sumbu terpisah. Documentation-only tidak sama dengan implementation.
3. Error/diagnostic output harus dibedakan dari environment-unavailable evidence;
   kegagalan host build atau browser tidak otomatis menjadi defect package.
4. `remark-relgeo` dan `remark-relgeo-hl` boleh memiliki owner berbeda, tetapi
   tidak boleh membentuk semantic contract yang bertentangan dengan `spec/id`,
   `core`, `renderer-svg`, atau language-service.
5. Browser/website evidence mengonfirmasi consumer integration, bukan otomatis
   membuktikan seluruh public package API.

## Open decisions before implementation audit

Row berikut sengaja menetapkan expectation tanpa mengarang detail API yang belum
diputuskan. Maintainer perlu mengunci pilihan ini sebelum audit ID-by-ID:

| Decision | Pilihan yang perlu dikunci | Dampak |
| --- | --- | --- |
| Fence aliases | alias resmi `relgeo`, `rg`, atau subset yang jelas | `MD-FENCE-001`, syntax coverage, docs examples |
| Preview output | inline SVG, wrapper HTML + SVG, atau asset reference | `MD-PREVIEW-001`, `MD-ASSET-001`, `MD-A11Y-001` |
| Error default | tolerant fallback atau strict build failure | `MD-DIAG-004`, `MD-ERR-001`, website CI |
| Option surface | names/defaults untuk version/profile/view/sheet, renderer, classes, asset base | seluruh `MD-OPT-*` dan reproducibility |
| Diagnostic transport | HTML-visible diagnostic, thrown error, structured node, atau kombinasi | `MD-DIAG-001/002`, SSR/build contract |
| Accessibility semantics | exact wrapper role/name/title/desc/fallback convention | `MD-A11Y-001/002` dan website integration |

Keputusan di atas tidak menghalangi katalog ini; ia mencegah audit berikutnya
menyamakan bentuk API saat ini dengan expected product contract tanpa review.

## Handoff ke audit implementasi

Katalog ini selesai sebagai prerequisite. Task audit berikutnya boleh membaca
`remark-relgeo/`, `remark-relgeo-hl/`, their tests/package metadata, existing
Markdown capability matrix, dan website consumer setelah ID di atas dipertahankan
atau diubah melalui keputusan maintainer. Audit wajib menghasilkan evidence
implementasi, evidence verification, dan gap per ID; ia tidak boleh menghapus
expected capability hanya karena belum ada source.
