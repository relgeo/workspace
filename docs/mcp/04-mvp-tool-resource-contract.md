# RelGeo MCP MVP Tool dan Resource Contract

Status: contract spike, protocol-agnostic

Dokumen ini menurunkan capability pada Plan 11 menjadi DTO typed yang dapat
dipakai oleh adapter MCP mana pun. Implementasinya berada di
`mcp/lib/src/contract/mcp_schema.dart`; file ini tidak mengimpor Flutter,
widget, HTTP, filesystem, `@relgeo/core`, atau `language-service`.

## 1. Sumber dan boundary

| Concern | Owner | API/source of truth |
| --- | --- | --- |
| Rule, grammar, semantic guarantee, version | `spec` | `spec/id/` — `core/`, `syntax/`, `geometry/`, `presentation/` |
| Parse, validate, resolve | `core` | `core/src/parser.ts`, `core/src/validator.ts`, `core/src/resolver/` |
| Completion dan editor diagnostic | `language-service` | `language-service/src/service.ts`, `completions.ts`, `schema.ts` |
| SVG output | `renderer-svg` | `renderer-svg/src/index.ts` dan `Renderer<string>` |
| Active document, revision, undo, dirty state | RelGeo Desktop bridge | `flutter/lib/src/ui/workbench_document_session.dart`, `flutter/lib/src/mcp/workbench_agent_bridge.dart` |
| MCP wire adapter dan transport | package MCP | `mcp/` — adapter boleh berganti setelah conformance |

`spec/id/` adalah sumber normatif. Website, examples, language-service, core,
dan renderer menjelaskan atau menjalankan kontrak, tetapi tidak boleh mengubah
arti rule. Setiap hasil dokumentasi membawa `source`, `sourceUrl`, `specVersion`,
dan `revision`; pada Dart, empat field itu tersedia langsung pada
`DocumentationResult` dan juga terserialisasi di `provenance`.

## 2. Typed input

Input tidak boleh disamakan dengan source proposal atau hasil validasi.

| Tool | Input DTO | Field utama | Scope |
| --- | --- | --- | --- |
| `relgeo_find_syntax` | `FindSyntaxInput` | `query`, `specVersion`, `maxResults` | read-only |
| `relgeo_get_syntax_rule` | `GetSyntaxRuleInput` | `ruleId`, `specVersion` | read-only |
| `relgeo_get_examples` | `GetExamplesInput` | `query` atau `exampleId`, `specVersion`, `maxResults` | read-only |
| `relgeo_complete_source` | `CompleteSourceInput` | `source`, `position`, `specVersion`, `maxResults` | read-only |
| `relgeo_validate_source` | `ValidateSourceInput` | `source`, `sourceKind`, `specVersion`, `includeInfo` | read-only |
| `relgeo_explain_diagnostic` | `ExplainDiagnosticInput` | `code`, `message?` | read-only |
| `relgeo_render_source` | `RenderSourceInput` | `source`, `format=svg`, `sheetId?`, `specVersion` | read-only |

`sourceKind` membedakan `input`, `proposal`, dan `activeDocument`. Rendering
selalu mengembalikan string SVG in-memory; tidak ada `outputPath`, Save, export,
atau arbitrary filesystem write pada contract MVP.

Input `maxResults` dibatasi oleh DTO sebelum mencapai adapter. Batas ini
mengurangi risiko agent meminta dump spec atau completion tanpa batas.

## 3. Proposal, validation, dan diagnostics

### Source proposal

`SourceProposal` adalah kandidat source yang dihasilkan agent atau tool:

```text
SourceProposal
  kind: proposal
  source
  summary
  rationale?
  basedOn[]: McpProvenance
```

Proposal bukan dokumen aktif dan tidak boleh diterapkan melalui contract tool
MVP ini. Jika kelak diteruskan ke `apply_document_edit`, ia harus dipetakan ke
`DocumentEditProposal` pada session bridge dengan `baseDocumentId`,
`baseRevision`, bounded ranges, dan satu transaksi undoable.

### Validation result

`ValidationResult` mempertahankan source yang divalidasi, `sourceKind`, boolean
`valid`, `specVersion`, diagnostics terstruktur, dan provenance. Ia bukan
`DocumentEditResult` dan tidak mengubah session.

```text
ValidationResult
  source
  sourceKind: input | proposal | activeDocument
  valid
  specVersion
  diagnostics[]: RelGeoDiagnostic
  provenance
```

`RelGeoDiagnostic` memiliki `code`, `message`, `severity`, optional line/
character `TextRange`, `origin`, dan optional provenance. `origin` membedakan
`languageService`, `core`, dan sumber lain; `provenance` tetap menunjuk versi
spec bila rule normatif yang mendasari penjelasan perlu dilacak.

Mapping implementasi:

- `relgeo_validate_source` memakai parser dan `Validator` core untuk kontrak
  parse/semantic validation, lalu memakai bentuk diagnostic yang kompatibel
  dengan `RelGeoLanguageService.getDiagnostics`.
- `relgeo_complete_source` memetakan `RelGeoLanguageService.getCompletions`
  ke `CompletionProposal[]`; item tetap proposal, bukan perubahan source.
- `relgeo_explain_diagnostic` membaca katalog/versioned documentation dan
  mengembalikan `DocumentationResult`, bukan mengganti code atau severity.
- `relgeo_render_source` memetakan `parseRelGeo` → resolve →
  `SVGRenderer.render`; error parse/validation harus dikembalikan sebagai
  diagnostics, bukan disembunyikan.

## 4. Tool catalog typed

`relGeoMvpToolContracts` mengekspor tujuh contract dengan `name`, description,
access scope, DTO input/output, dan JSON Schema input. Semua tool MVP bersifat
`readOnly`. `apply_document_edit` sengaja bukan bagian dari catalog ini karena
memerlukan desktop session bridge, token read-write, dan revision guard.

Output typed yang tersedia:

```text
relgeo_find_syntax        → FindSyntaxResult
relgeo_get_syntax_rule    → SyntaxRuleResult
relgeo_get_examples       → ExamplesResult
relgeo_complete_source    → CompletionResult
relgeo_validate_source    → ValidationResult
relgeo_explain_diagnostic → DiagnosticExplanationResult
relgeo_render_source      → RenderResult
```

`SyntaxRuleResult` dan `DiagnosticExplanationResult` membawa
`DocumentationResult`. `SyntaxMatch`, `ExampleResult`, `ValidationResult`, dan
`RenderResult` membawa provenance agar adapter tidak dapat menghapus identitas
versi secara diam-diam.

## 5. Resource URI

Parser canonical `RelGeoResourceUri` menerima hanya URI berikut:

```text
relgeo://spec/index
relgeo://spec/rules/{ruleId}
relgeo://examples/index
relgeo://examples/{exampleId}
relgeo://diagnostics/catalog
relgeo://document/active
relgeo://document/active/diagnostics
```

URI `document/active*` hanya dapat di-resolve oleh desktop-connected bridge dan
harus tunduk pada token serta active-session guard. Parser URI tidak pernah
mengubah URI menjadi path filesystem. URI lain ditolak sebelum resolver atau
transport dipanggil.

`relgeo://spec/*` harus bersumber dari snapshot `spec/id` yang memiliki
`specVersion` dan `revision`. `relgeo://examples/*` bersifat explanatory.
Website dapat menjadi fallback penjelasan dengan `McpProvenanceSource.website`,
tetapi `isNormative` selalu false; website tidak pernah mengalahkan spec.

## 6. Evidence dan compatibility

Contract ini merujuk langsung ke artefak yang ada:

- Plan dan workflow: `docs/plans/11-mcp-agent-integration.md`;
- source of truth normatif: `spec/id/README.md`,
  `spec/id/core/01-overview.md`, `02-document-structure.md`, dan
  `05-semantic-guarantees.md`;
- parser/validator/resolver: `core/src/index.ts` dan source di `core/src/`;
- completion/diagnostic/schema: `language-service/src/index.ts`,
  `service.ts`, `completions.ts`, dan `schema.ts`;
- rendering: `renderer-svg/src/index.ts`;
- session boundary: `mcp/lib/src/contract/session_bridge.dart` dan
  `flutter/lib/src/mcp/workbench_agent_bridge.dart`.

Pure-Dart tests di `mcp/test/mcp_schema_test.dart` memverifikasi pemisahan
input/proposal/validation/diagnostic, canonical resource URI, tool catalog,
dan aturan bahwa provenance website tidak normative. Adapter protocol tetap
terpisah sehingga conformance SDK/transport dapat dilakukan tanpa mengubah
kontrak domain ini.
