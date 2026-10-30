# MCP implementation audit evidence

> **Audit coverage statement — 2026-10-29.** This evidence log inspects the
> pure-Dart MCP contract, tools/resources, transport/SDK candidates, Flutter
> host bridge, fixtures/tests, protocol plans, and CI boundary. It separates
> implemented contract from adapter and delivery intent; Inspector, HTTP, SDK,
> and end-to-end host parity remain `not verified` where stated. See [inventory
> protocol](../../INVENTORY-PROTOCOL.md); unlisted behavior is not thereby absent.

Status: audit evidence log, 2026-10-29

Dokumen ini mencatat apa yang benar-benar terlihat pada checkout workspace
RelGeo dan boundary konsumennya. Ini bukan inventory capability kedua dan bukan
source of truth kontrak; [matrix utama](../capability-matrix.md) tetap menjadi
reporting view tunggal. Plan, roadmap, komentar, dan README diperlakukan
sebagai intent/evidence pendukung, bukan bukti runtime dengan sendirinya.

## Snapshot pemeriksaan

- Workspace root: `/Users/agusmade/projects/relgeo-workspace`
- Root revision: `1231dadb5ff6902593cb81665f76699bf0548bbb`
- Topologi yang terlihat: root Git dengan 12 gitlink/submodule; `mcp`,
  `flutter`, `core`, `language-service`, `renderer-svg`, `cli`, dan `spec`
  checkout pada pointer saat pemeriksaan.
- Required paths (`mcp/`, `flutter/`, `core/`, `language-service/`,
  `renderer-svg/`, `cli/`, `spec/`, `fixtures/`, `docs/mcp/`, dan
  `docs/plans/11-mcp-agent-integration.md`): ada pada filesystem.
- Working tree root sudah berubah sebelum audit (`docs/capability-map/` adalah
  path untracked); tidak ada perubahan pada submodule source yang diperlukan
  untuk audit ini.

## Temuan per boundary

| Boundary | Yang benar-benar ada | Kondisi audit | Evidence utama | Gap/batas yang tidak boleh disimpulkan |
| --- | --- | --- | --- | --- |
| `mcp/` package | Pure-Dart package `relgeo_mcp`, private/non-publishable; hanya dependency dev `lints` dan `test`; mengekspor contract/session schema. | Partial | `mcp/pubspec.yaml:1-12`, `mcp/README.md:1-24`, `mcp/lib/relgeo_mcp.dart:1-4` | Tidak ada dependency SDK MCP, HTTP, JSON-RPC adapter production, atau executable server production di package metadata/source yang diaudit. |
| Typed tools | DTO input/output, provenance, bounded fields, dan 7 read-only contracts (`find_syntax`, `get_syntax_rule`, `get_examples`, `complete_source`, `validate_source`, `explain_diagnostic`, `render_source`). | Present at contract boundary | `mcp/lib/src/contract/mcp_schema.dart:1-4,74-96,230-255,373-426,576-722`; `mcp/test/mcp_schema_test.dart:12-122` | Catalog/schema bukan bukti tool dapat dipanggil oleh MCP client; tidak ditemukan execution/dispatch mapping ke core, language-service, spec snapshot, atau renderer. |
| Typed resources | Canonical parser untuk spec, examples, diagnostics, active document, dan active diagnostics; parser menolak scheme/query/path yang tidak didukung dan tidak mengubah URI menjadi path filesystem. | Present at contract boundary | `mcp/lib/src/contract/mcp_schema.dart:428-542,714-722`; `mcp/test/mcp_schema_test.dart:68-110` | Tidak ada resource resolver/list-read production atau snapshot bundling yang mengisi URI tersebut. |
| Session/edit/security contract | Active snapshot, diagnostics, bounded non-overlapping edit, document/revision guard, result states, in-memory token scope/expiry/revoke, localhost/no-filesystem-write/no-autosave defaults. | Present as pure-Dart contract | `mcp/lib/src/contract/session_bridge.dart:98-120,142-253,255-326,328-395,403-436`; `mcp/test/session_bridge_test.dart:15-137` | Contract tidak membuka transport dan tidak menjamin adapter akan menegakkan token sebelum dispatch; `apply_document_edit` belum masuk catalog read-only. |
| Protocol fixture | Fixture JSON-RPC/MCP dengan `initialize`, `tools/list`, `tools/call`, `resources/list`, `resources/read`; child-process stdio dan loopback Streamable HTTP harness. | Partial; fixture-only | `mcp/tool/protocol_fixture.dart:1-136`, `mcp/tool/mcp_fixture_server.dart:1-115`, `mcp/tool/run_transport_conformance.dart:1-135` | Fixture hanya `relgeo_fixture_echo` dan satu provenance resource; bukan tujuh tool RelGeo dan bukan production server. |
| Transport/SDK | Stdio fixture pass pernah direkam; HTTP harness membatasi bind ke `127.0.0.1`; candidate `dart_mcp`/`mcp_dart` belum masuk dependency graph. | Stdio fixture observed; HTTP/SDK not verified here | `docs/mcp/02-sdk-transport-spike.md:17-42,44-93,136-149`; `docs/mcp/03-sdk-conformance-runbook.md:1-67` | Current managed shell tidak dapat menjalankan wrapper Dart karena Flutter cache/telemetry di luar workspace read-only; tidak boleh dipromosikan sebagai product failure. HTTP, Inspector, dan SDK adapter tetap pending/environment-gated. |
| `flutter/` package boundary | Flutter app memiliki path dependency `../mcp` dan mengekspor bridge; document session memodelkan source, saved baseline, dirty state, identity, dan revision. | Present as host dependency/session | `flutter/pubspec.yaml:30-42`, `flutter/lib/relgeo_flutter.dart:17-22`, `flutter/lib/src/ui/workbench_document_session.dart:8-98` | Tidak terlihat server start/stop, MCP endpoint lifecycle, token issuance UI, endpoint display, atau Streamable HTTP wiring di Flutter source yang diaudit. |
| Flutter bridge | `WorkbenchAgentBridge` mengimplementasikan `RelGeoAgentBridge`, reads active snapshot/diagnostics, validates stale/rejected patches, calls editor setter once, preserves dirty/revision, and returns failed on divergence. | Present and tested | `flutter/lib/src/mcp/workbench_agent_bridge.dart:1-64`; `flutter/test/workbench_agent_bridge_test.dart:8-56` | Ini host adapter, bukan MCP transport/JSON-RPC server. MCP-to-bridge dispatch belum terlihat. |
| `core/` | Public parse, validate, resolve/compile pipeline; active spec line `0.5`, supported legacy `0.4`, regression-only `0.1-0.3`, unsupported versions rejected. | Present consumer capability | `core/src/index.ts:1-8`, `core/src/parser.ts:1-35,94-148`, `core/src/validator.ts:80-116`, `core/src/resolver/index.ts:26-34` | Core tests/exports membuktikan engine capability, bukan MCP exposure or output mapping. |
| `language-service/` | `RelGeoLanguageService` exposes diagnostics and completions, using core parse/validate/resolve; schema/completion/token modules are exported. | Present consumer capability | `language-service/src/index.ts:1-4`, `language-service/src/service.ts:1-6,126-205,287-553`, `language-service/src/__tests__/language_service.test.ts` | No MCP adapter call path or DTO mapping was found; diagnostic/completion parity through MCP remains not verified. |
| `renderer-svg/` | `SVGRenderer implements Renderer<string>` and `renderToSVG(scene, options)` returns in-memory SVG. | Present consumer capability | `renderer-svg/src/index.ts:9-14,352-358`, `renderer-svg/src/types.ts:19-20`, `renderer-svg/src/__tests__/` | No MCP source-to-parse-to-resolve-to-render adapter; renderer availability does not make `relgeo_render_source` callable. |
| `cli/` | Existing Node CLI commands `info`, `compile`, `check`/`validate`; compile uses core and optionally renderer SVG, writes only when explicitly passed `--output`. | Present consumer capability; MCP absent | `cli/src/index.ts:1-6,22-25,113-187,189-243`, `cli/package.json:1-82`, `cli/src/__tests__/cli.test.ts` | No `mcp`/`serve` command or MCP protocol bridge was found in CLI source/package metadata. |
| `spec/` | Maintained normative RelGeo documentation tree with core/syntax/geometry/presentation chapters and provenance rules. | Present normative source | `spec/id/README.md:1-18,120-180`, `docs/mcp/04-mvp-tool-resource-contract.md:10-25,150-168` | No MCP resource snapshot/resolver/bundling implementation was found; plan claims are not runtime evidence. |
| `fixtures/` | Workspace fixture manifest defines compatibility line `0.5`, fixture statuses, expected outputs, and consumer surfaces including core, renderer, language-service, CLI, Flutter. | Present cross-consumer evidence | `fixtures/manifest.json:1-26,28-117,120-207`, `fixtures/reference/`, `fixtures/expected/`, package reference-fixture tests | These are RelGeo engine/consumer fixtures, not MCP tool/resource integration fixtures. The MCP protocol fixture is separate under `mcp/tool/`. |
| MCP docs | Contract, session/security boundary, SDK/transport spike, and conformance runbook are maintained and path-linked. | Present as design/evidence docs | `docs/mcp/01-session-bridge-security-contract.md:9-105`, `docs/mcp/02-sdk-transport-spike.md:1-149`, `docs/mcp/03-sdk-conformance-runbook.md:1-67`, `docs/mcp/04-mvp-tool-resource-contract.md:1-168` | Docs distinguish pending adapter/resource resolver from typed contract; they do not activate runtime. |
| Plan 11 | Defines standalone vs desktop-connected modes, stdio vs localhost HTTP intent, host boundary, seven MVP tools/resources, authoring workflow, and staged unchecked tasks. | Present as intent/roadmap | `docs/plans/11-mcp-agent-integration.md:27-160,163-275,300-410,411-542` | Checked plan items are not proof of delivery; explicit unchecked items include adapter dispatch, resource snapshots, Flutter server UI/lifecycle, Inspector, standalone executable, and end-to-end acceptance. |
| Workflow/host | Child `mcp` CI runs format/analyze/unit tests/protocol conformance and dispatches validated submodule pointer; workspace sync recognizes `mcp`; root integration runs Flutter/package gates. | Present CI boundary; no production delivery gate | `mcp/.github/workflows/mcp-ci.yml:1-83`, `.github/workflows/sync-validated-submodule-after-ci.yml:68-83`, `.github/workflows/integration.yml:16-55`, `scripts/run-flutter-conformance.mjs:1-86` | CI validates package/fixture and Flutter app separately; no root end-to-end MCP client → adapter → consumer gate was found. |

## Direct validation evidence

The following commands were run during this audit. Results are scoped to the
boundary named by the command.

| Command | Result | What it proves |
| --- | --- | --- |
| `pnpm --filter @relgeo/core test` | PASS — 44 files, 427 tests | Core implementation/tests are executable in this checkout. |
| `pnpm --filter @relgeo/language-service test` | PASS — 1 file, 66 tests | Language-service implementation/tests are executable in this checkout. |
| `pnpm --filter @relgeo/renderer-svg test` | PASS — 6 files, 79 tests | Renderer implementation/tests are executable in this checkout. |
| `pnpm --filter @relgeo/cli test` | PASS — 1 file, 9 tests | Existing CLI consumer/tests are executable in this checkout. |
| `flutter test test/workbench_agent_bridge_test.dart` from `flutter/` | PASS — 2 tests | Flutter bridge mutation/session behavior is executable and observed. |
| `dart analyze`, `dart test`, and `dart run tool/run_transport_conformance.dart --stdio-only` from `mcp/` | NOT VERIFIED in this managed shell | Dart wrapper attempted to write `/Users/agusmade/development/flutter/bin/cache/engine.stamp`; direct SDK analysis then lacked resolved `package:test` in the current package config. This is environment/dependency availability evidence, not a product failure. |
| Required path existence check | PASS | All required audit paths exist. |

Prior package/fixture evidence remains recorded in
`docs/mcp/02-sdk-transport-spike.md:72-90,136-149`: stdio fixture PASS,
localhost HTTP environment-gated, remote bind rejected, SDK adapter pending,
Inspector environment-gated, and Flutter toolchain baseline recorded. The
current audit keeps those claims bounded to the referenced prior run and does
not relabel them as a fresh local rerun.

## Boundary conclusions for the capability matrix

1. The strongest available MCP implementation is the pure-Dart contract/session
   slice plus a dependency-free protocol fixture.
2. Core, language-service, renderer, CLI, spec, fixtures, and Flutter bridge
   are real consumer/source capabilities with direct source and test evidence;
   none is by itself evidence that a production MCP tool is exposed.
3. The decisive missing boundary is the MCP adapter/resource resolver and its
   runtime entrypoint. This blocks claims of production tool/resource
   invocation and delivery readiness.
4. Active-document mutation is implemented only behind the Flutter bridge and
   remains outside the read-only tool catalog; transport authentication and
   lifecycle enforcement are still adapter responsibilities.
5. The next inventory/status task can now assign matrix symbols independently
   for contract, implementation, evidence, parity, transport-readiness, and
   delivery-readiness without treating roadmap text as implementation evidence.
