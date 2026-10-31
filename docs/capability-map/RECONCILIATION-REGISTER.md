# Capability reconciliation register

**Coverage statement — 2026-10-31 review of the 2026-10-29 register.** Register ini merekonsiliasi matrix dan
implementation audit untuk 12 surface dengan `docs/flutter-capability-matrix.json`,
`fixtures/manifest.json`, dan `docs/integration-baseline.json`. Discovery
mencakup contract/spec, source/API, test/fixture, consumer/UI/command,
platform/security, workflow/delivery, dan ownership/provenance. Register ini
menyatukan capability yang sama lintas consumer tanpa menggantikan row-level
evidence pada matrix surface. Current CI, registry, public Pages, host/OS, dan
MCP SDK/transport hanya disebut verified bila evidence-nya menunjuk ke
environment dan revision yang sesuai; selain itu tetap `not verified`.

> **Freshness overlay — 2026-10-31:** Cross-surface rows below are a synthesis,
> not a wholesale rerun of every package. Current deltas are incorporated for
> the MCP search/desktop/edit path, Flutter desktop release artifacts, Playground
> toolbar, core evaluator fix, and root submodule/baseline state. Each row points
> to its surface audit for exact evidence and limitations; unmentioned rows retain
> their own dated evidence and must not be read as freshly reverified.

## How reconciliation works

The surface matrix remains the status authority for a capability at its own
boundary. This register adds the cross-surface view needed to avoid counting
the same behavior as several independent implementations or treating a
consumer projection as the contract owner.

1. Group rows by behavior and contract, not by repeated package names.
2. Keep the normative owner, implementation owner, consumer, and delivery
   owner distinct when they differ.
3. Report status per boundary. A passing source test does not promote a host,
   public, or MCP-delivery boundary.
4. Treat `fixtures/manifest.json` status as evidence scope: `active`,
   `supported-legacy`, `invalid`, `runtime-diagnostic`, `runtime-error`, and
   `capability` are not interchangeable implementation statuses.
5. Treat the boolean flags in `docs/flutter-capability-matrix.json` as
   declared evidence observations. The file's `evidenceStatus`, support level,
   active-contract rule, and root-pointer freshness determine the conclusion.
6. Use `❌` only where the capability is expected at that boundary and the
   discovery pass found no implementation. Use `➖` for an intentional boundary
   exclusion, `⏸️` for a held decision, and `not verified` for unavailable or
   stale execution evidence.

## Cross-surface status register

`Status by boundary` is intentionally not one aggregate green/red status. The
first item is the contract/source owner, followed by important consumer and
delivery boundaries. The linked surface rows remain the detailed evidence,
owner, consumer, gap, and next-action records.

| Canonical capability cluster | Owner / source of truth | Status by boundary | Direct evidence and coverage | Consumers | Gap / next action |
| --- | --- | --- | --- | --- | --- |
| DSL compatibility line, version gating, and document shape | `spec/id/`; parser/version policy in `core` | Contract `✔️`; core local `✔️`; language-service/CLI/plugin consumers `🌗` for duplicated vocabulary; public `not verified` | Spec chapters, `core/src/parser.ts`, fixtures 10–13/17/18, fixture manifest, local conformance `260/260` | Core, language-service, CLI, Markdown, Playground, Flutter, MCP | No generated contract catalog. Add drift checks for versions, sections, objects, anchors, expressions, and error codes. |
| Parse, validate, and structured diagnostics | `core` implementation; error meaning from `spec/id/core/06-error-model.md` | Core/language-service local `✔️`; CLI/Markdown/Playground `🌗` consumer breadth; Flutter `🌗`; MCP exposes spec lookup and active-document diagnostics, but semantic validation/error mapping is still `❌`/`🌗` | Parser/validator source, core tests, invalid/runtime fixtures 11–14/17–20, language-service tests, Flutter diagnostics tests | All authoring and command consumers | Error-code catalog drift is `⚠️` in core. Normalize emitted codes and add cross-consumer mapping fixtures. |
| Dependency graph, resolution, evaluator, units, and candidate promotion | `core/src/graph.ts`, resolver/evaluator/units; active contract decision in fixture manifest | Graph/resolution local `✔️` for bounded fixtures; evaluator syntax-only division-by-zero regression is fixed in `31347e4`; broader evaluator/units promotion remains `🌗`/`⏸️` candidate; Flutter semantic projection `🌗`; public `not verified` | Core tests, fixture 10 active, fixture 16 `capability`, Flutter JSON evidence flags and active-contract policy | Core, CLI, language-service, renderer, Flutter | Do not promote fixture 16 from passing snapshots alone. Decide signed literals, units, defaults, parameters, and promotion evidence. |
| Primitive geometry, intersections, tolerance, and topology | `geometry` library API; semantic ownership split with core resolver | Geometry/core/renderer local `✔️` for tested bounded paths; Flutter fixture 15 `verified` in declared evidence but current-pointer freshness remains limited; broader geometry `🌗` | Geometry tests, core geometry tests, fixture 15 active, Flutter JSON geometry/boolean entries, plan 07 | Core, renderer, CLI, Flutter, semantic fixture runner | Circle/arc, degenerate, multipart, union/xor, and broader query expansion are outside the active bounded contract. Add only with named consumer and fixtures. |
| Boolean intersection/subtraction and runtime empty/multipart errors | Geometry boolean engine; core owns DSL resolution/error semantics | Geometry/renderer/core local `✔️` on fixture 15 and runtime-error fixtures; Flutter `✔️` only for declared bounded semantic projection; full product parity `🌗` | `geometry/src/boolean/`, core boolean tests, fixtures 15/19/20, expected JSON/SVG, Flutter matrix | Core, renderer, CLI, Flutter | `BOOLEAN_EMPTY_RESULT`/multipart typing is part of core contract drift. Complete error catalog and preserve intentional runtime-error boundaries. |
| Resolved scene to SVG, sheets, metadata, and security | `renderer-svg`; resolved-scene contract from core | Renderer local `✔️` for bounded render tests; security/output `⚠️` for incomplete escaping coverage; Markdown/CLI `✔️`/`🌗`; Flutter `🌗`; public `not verified` | Renderer tests 79/79 and security tests, expected SVG fixtures, CLI/Markdown conformance, Flutter SVG semantic projection | CLI, Markdown, Playground, website, Flutter | Fix dimension/annotation escaping and add regressions. Raw byte parity and host insertion are separate concerns. |
| Language authoring: schema, tokens, completion, hover, diagnostics | `language-service`; syntax meaning remains `spec/id/` | Local language-service source/tests `✔️`; Playground/browser `🌗`; Markdown highlight `✔️` with fallback limitation; MCP full-spec search/rule retrieval `✔️` but completion/semantic validation/error mapping remain unresolved; Flutter authoring not full parity | `language-service/src/`, 66 local tests, fixture highlight/invalid checks, Playground editor/worker, MCP schema | Playground, Markdown, website, future Flutter/MCP agent | Fix documented `getSchema()` mismatch and version drift; add spec-to-schema check and MCP mapping fixtures before delivery claims. |
| CLI inspect/compile/check and output formats | `cli/src/index.ts`; core/renderer own semantics | CLI local `✔️` for tested commands; unknown format `⚠️`; package/registry/public `not verified` | CLI tests, `bin/relgeo.js`, fixture conformance, package metadata, manual unknown-format evidence | Shell users, CI, root gates, downstream scripts | Reject unknown format, add output-file failure/overwrite tests, and run Node 24 registry/package smoke. |
| Markdown preview and syntax highlighting | Plugin packages; core/language-service/spec remain semantic owners | Plugin local/shared fixture `✔️`; highlight fallback edge `⚠️`/partial; website local build `✔️`; registry/public `not verified` | Plugin source/tests, fixture 10 preview/highlight snapshots, website config/assertions, language-service dependency | Website/docs Markdown readers and authors | Preserve source on language-service failure, test fence isolation/escaping, and keep plugin scope distinct from editor diagnostics. |
| Playground browser editor, preview, inspector, graph, persistence, and share | `relgeo/playground`; core/language-service/renderer are dependency owners | Source/unit `✔️`; browser/E2E `🌗`; Pages/public `not verified`; full DSL parity `❌` at the explicitly expected complete-parity boundary | `playground/src/`, worker/persistence tests, UX/E2E scripts, fixture manifest, Pages assembly workflow | Browser authors, website artifact consumers | Current-pointer browser and combined Pages artifact need rerun. `❌` applies only to the explicitly claimed full-parity boundary, not to the bounded editor itself. |
| Website documentation, normative spec presentation, and Pages artifact | Website owns presentation; `spec/id/` owns normative text | Static local build/assertions `✔️`; combined artifact/public Pages `🌗`/not verified; input pins `⚠️` | Astro source/content loader, build/artifact assertions, Pages workflow, public smoke script, baseline and plan 05 | Public readers, Playground link/artifact consumers | Reconcile Playground/spec pins, build combined artifact, run public smoke and browser/AT checks. English spec remains placeholder. |
| Flutter document lifecycle: New, Open, Save, Save As, recent, dirty guard, error/recovery | Flutter workbench/file service; core/spec own document semantics | Source + UI + test `✔️`; best-effort restart recovery is implemented; host picker/filesystem/window lifecycle and forced-exit recovery remain `not verified` | `flutter/lib/` workbench/file service/session, widget/service tests, Flutter matrix rows, plans 06/10 | Desktop workbench authors | Execute current host smoke. Keep crash/restart recovery distinct from failed-open/save recovery; do not infer native behavior from injected tests. |
| Flutter editor/workbench: editor, undo/redo, viewport/canvas, inspector, diagnostics, import/export, preferences, commands/accessibility | Flutter workbench; language-service/core/renderer are dependency owners | Source/UI/test `✔️` or `🌗` per row; host/AT/GPU/gesture `not verified`; delivery `⏸️` | Flutter matrix granular rows, `flutter/test/`, capability JSON, local verification note and plans | Desktop authors and assistive-tech users | Re-run native keyboard, picker, canvas resize/gesture, AX tree, and persistence evidence on supported hosts. |
| Flutter semantic geometry/SVG projection | Flutter projection; TypeScript expected snapshots and fixture manifest define comparison | Fixture 15 bounded geometry/boolean `verified` in declared JSON evidence; fixture 16 evaluator `🌗`/candidate; full DSL parity `❌` at complete-parity boundary | `docs/flutter-capability-matrix.json`, fixtures 15/16, semantic/SVG projection tests, plan 07 | Flutter workbench and conformance runner | Refresh current-pointer CI/baseline before using historical `ci=true` as current release proof; promote candidates explicitly. |
| MCP typed contract, tools/resources, session/document bridge | `relgeo/mcp` contract/session docs; spec/core/language-service remain semantic owners | Full-spec search/resources, embedded Flutter loopback HTTP, active-document reads, and opt-in bounded edit are locally verified; ChatGPT Desktop write round-trip/packaged smoke are not verified; semantic validation/completion/render integration remain open | MCP schema/protocol/session tests, `mcp/lib/`, Flutter bridge, plans 01–04/11, MCP matrix beyond-MVP sections | Future Agent/Desktop consumers; Flutter host bridge | Finish semantic validation/completion/render integration, verify ChatGPT Desktop edit interoperability, and smoke-test packaged MCP on target desktops. Current local adapter/transport is callable; do not read old pre-implementation notes as current absence. |
| Shared fixture semantics and conformance orchestration | `relgeo/workspace`; fixture manifest is evidence authority, not product implementation | Manifest/runner/local package conformance `✔️` (`260/260`); candidate promotion `⏸️`; canonical/public `not verified` | `fixtures/manifest.json`, reference/expected trees, `scripts/run-conformance-fixtures.mjs`, package audits | Core, renderer, language-service, CLI, Markdown, Playground, Flutter | Add MCP adapter fixtures after adapter exists; repeat under Node 24 and synchronized child revisions. |
| Cross-repository pointers, baseline, release gates, and provenance | `relgeo/workspace`; child repositories retain implementation ownership | Repository registration `✔️`; current baseline `⚠️` (11 of 12 child pins differ from current clean gitlinks; `spec` matches); CI/registry/public `not verified`/`⏸️` | `.gitmodules`, `docs/REPOSITORY-MAP.md`, `docs/integration-baseline.json`, root workflows/scripts, cross-repository audit | All surfaces and release maintainers | Synchronize exact child SHAs and baseline, then rerun strict baseline, Node 24 integration, public package, Pages, and child-CI gates. |

## Explicitly separated capability rows found during reconciliation

These were split out because a single historical “workbench”, “editor”,
“Flutter support”, or “MCP MVP” row would hide materially different evidence.
Their detailed status remains in the linked surface matrix.

| Newly explicit capability | Why it must remain separate | Evidence anchor |
| --- | --- | --- |
| Flutter New / Open / Save / Save As | Different file-service, identity, dirty-guard, and host-picker paths; one operation can pass while another is unverified. | `flutter-workbench/capability-matrix.md`, `cad_workbench.dart`, `workbench_file_service.dart`, widget/service tests |
| Flutter recent documents, dirty/discard guard, and error/recovery | Persistence and failure semantics differ from ordinary file I/O; restart recovery is a separate product decision. | Flutter matrix and `workbench_recent_documents.dart`, `workbench_document_session.dart`, widget tests |
| Flutter editor, undo/redo, viewport/canvas, inspector, diagnostics | Each has a distinct controller/widget/test boundary and different host limitations. | Flutter matrix, `flutter/lib/`, `flutter/test/` |
| Flutter import/export, preferences, menu/shortcut, accessibility, native lifecycle, delivery | Injected tests do not prove filesystem, OS key mapping, AT tree, signing, or distribution. | Flutter matrix, `pubspec.yaml`, workflows, local verification note, plans |
| MCP contract vs resource/session vs adapter/transport vs packaging/delivery | Local MCP runtime is callable and tested; this alone does not prove packaged or public transport delivery. | MCP matrix sections and `mcp/archive/implementation-audit-legacy.md` |
| CLI format allowlist and file output | Compile implementation can be present while unknown-format and filesystem-failure behavior remain unsafe/untested. | CLI matrix and `cli/src/index.ts` tests |
| Spec contract vs generated catalog | Markdown normative chapters, parser fields, validator anchors, and language-service schema are separate realizations without a generated catalog. | Spec/core/language-service matrices and audits |
| Fixture active vs capability candidate vs runtime error | Passing candidate snapshots are evidence, not active support; expected runtime errors are not missing implementations. | `fixtures/manifest.json`, expected artifacts, cross-repository matrix |

## Reconciliation conclusion

No capability is marked absent merely because it was missing from a historical
matrix or roadmap. The current `❌` rows are boundary-specific: for example,
CLI watch/server mode, renderer source parsing, the geometry package's
high-level query exports, the Playground's explicitly claimed full DSL parity,
generated normative catalog, and MCP semantic-adapter parity / packaged cross-host delivery. Each has an
expectation source and negative evidence in its surface matrix.

The remaining uncertainty is evidence freshness and host/delivery access, not
an undocumented inference of absence. Human validation should review the
status decisions and next actions, while environment-gated reruns update the
evidence axis without silently changing implementation or scope status.
