# Surface discovery ledger

Status: baseline audit, 2026-10-29  
Owner: `relgeo/workspace` for the inventory view; implementation owners remain
the repositories in the ownership column.

## Purpose and reading rule

This ledger records the minimum discovery pass behind each capability
matrix/audit pair. It is an index of inspected boundaries, not a second
capability matrix and not a claim that every listed source has been exercised
at runtime. A path in the ledger proves that the category was searched; the
paired audit and matrix state what was actually found and what remains
`not verified`.

The old matrices, plans, README claims, and historical CI results were used as
leads only. They do not define the final inventory. A category marked `N/A`
is explicitly outside that surface's responsibility; a category marked
`not verified` means the source or environment could not be reproduced in this
baseline, not that the implementation is absent.

## Discovery categories

| Code | Category | Minimum question |
| --- | --- | --- |
| `S` | Source and public API | What source modules, exports, schema, commands, or protocol DTOs exist? |
| `T` | Tests and fixtures | Which unit, integration, negative, snapshot, or shared-fixture evidence exists? |
| `C` | Consumer/UI/command wiring | Which package consumer, editor, worker, menu, command, or host bridge invokes it? |
| `P` | Platform/security/runtime boundary | Which browser, desktop, filesystem, accessibility, transport, or security boundary applies? |
| `D` | Delivery and operations | Which package, build, CI, Pages, registry, release, or deployment path exists? |
| `O` | Ownership and documentation | Which spec, plan, manifest, repository map, pointer, or provenance record governs it? |

## Per-surface completeness ledger

`Inspected evidence` identifies the minimum source set used for the current
inventory. `Result boundary` prevents implementation, consumer integration,
and delivery from being collapsed into one claim. `Current limit` is the
explicit part that remains historical, environment-gated, or unverified.

| Surface / owner boundary | Inspected evidence (`S` + `T`) | Consumer / platform (`C` + `P`) | Delivery / ownership (`D` + `O`) | Result boundary and current limit | Matrix / audit |
| --- | --- | --- | --- | --- | --- |
| **Spec** — `relgeo/spec`; normative language contract | `spec/id/` README, core, syntax, geometry, presentation, appendix; `spec/en/`; no spec-local executable suite found; consumer fixtures/conformance are observational | Core parser/validator, language-service catalogs, CLI, plugins, Playground, Flutter, and MCP consume/project it; native UI is N/A | `.gitmodules`, repository map, website ingestion, plans, and spec README/index labels | Normative intent is separate from consumer realization. Index-label mismatch and translation placeholder remain explicit; consumer parity is not implied. | [Status matrix](./language-specification/status-matrix.md) / [audit index](./language-specification/implementation-audit.md) |
| **Geometry** — `relgeo/geometry`; analytic library and npm API | `geometry/src/` exports/types, intersection/split/path-modifier/boolean modules; package manifest/README; `src/__tests__/`; shared fixture 15 and core/renderer consumers | Core resolver and renderer-SVG call it; CLI/Markdown/Playground consume higher layers; no UI/host responsibility; tolerance/topology are runtime boundaries | `package.json`, lockfile, package build/test, root compatibility/conformance, fixture manifest, repository map | Library API/runtime behavior is separate from package publication and consumer parity. Browser/registry/public execution is not verified by local tests. | [Geometry status matrix](./geometry/status-matrix.md) / [audit index](./geometry/implementation-audit.md) |
| **Core runtime** — `relgeo/core`; parser, validator, resolver, graph, evaluator | `core/src/` parser, validator, graph, evaluator, resolver, exports/package; `src/__tests__/`; fixtures 10–20 | CLI, language-service, renderer-SVG, Markdown, Playground, Flutter projections, and conformance runner; filesystem/UI/platform are outside core; diagnostics and deterministic resolution are runtime boundaries | Package build/test and root conformance/compatibility/release scripts; core README, spec chapters, fixture manifest, plans | Core tests do not prove every consumer or fixture promotion. Candidate evaluator/units and incomplete error-code coverage remain marked. | [Core status matrix](./core-runtime/status-matrix.md) / [audit index](./core-runtime/implementation-audit.md) |
| **Renderer-SVG** — `relgeo/renderer-svg`; resolved-scene to SVG library | `renderer-svg/src/` index, primitives, types, escaping, exports/package; renderer reference/semantic/security/distribution tests; expected SVG fixtures | Core and CLI invoke it; Markdown, Playground, website, and Flutter use SVG/projection boundaries; XML escaping and browser insertion are distinct security/runtime concerns | Package build/test, shared conformance, package/release checks; renderer README, spec presentation, expected fixture output | Renderer source/tests do not prove every host insertion path or public artifact. Confirmed security mismatch stays separate from unverified browser evidence. | [Renderer matrix](./renderer-svg/capability-matrix.md) / [audit](./renderer-svg/implementation-audit.md) |
| **Language service** — `relgeo/language-service`; diagnostics and authoring intelligence | `src/service.ts`, schema, completions, tokens, exports/package; language-service test; invalid/token/highlight fixture checks | Playground editor/worker, Markdown highlighter, website docs, and future Flutter/MCP authoring; ranges, tolerant editor mode, worker sequencing are host/runtime concerns | Package build/test and root compatibility/conformance; README, spec vocabulary, fixture manifest, MCP contract, plans | Schema/completion/diagnostics are not automatically spec parity or MCP delivery. Catalog drift and host-runtime limits remain visible. | [Language-service status matrix](./language-service/status-matrix.md) / [audit index](./language-service/implementation-audit.md) |
| **CLI** — `relgeo/cli`; executable and package boundary | `cli/src/index.ts`, `bin/relgeo.js`, package/README/docs; CLI tests; shared conformance CLI checks; commands `info`, `compile`, `check`/`validate` | Shell users, CI scripts, root conformance, package consumers; filesystem output, exit status, stderr/error shape, Node runtime, and format allowlist are CLI boundaries | Package/build scripts, compatibility/release/public gate definitions; CLI docs, repository map, fixture manifest, plans | Command implementation is separate from registry/all-shell proof. Unknown-format behavior is a confirmed mismatch; Node 24/public package checks remain unverified. | [CLI matrix](./cli/capability-matrix.md) / [audit](./cli/implementation-audit.md) |
| **Markdown plugins** — `remark-relgeo` and `remark-relgeo-hl`; preview/highlight packages | Plugin source, exports, manifests/README; plugin-local tests; exact shared preview/highlight checks | Unified/Markdown docs and website/Astro; HTML/SVG insertion and fallback/error rendering are host/security boundaries; general editor/diagnostics UI is N/A | Package build/test and website integration; plugin READMEs, website config, language-service/core/spec inputs, fixture manifest | Preview and highlight are separate capabilities. Highlight tokens do not prove semantic resolution, and website build does not prove registry consumer parity. | [Markdown matrix](./markdown-surfaces/capability-matrix.md) / [audit](./markdown-surfaces/implementation-audit.md) |
| **Playground** — `relgeo/playground`; browser authoring consumer | React/Vite source, editor/preview/inspector/graph components, worker, persistence/share/import helpers, package manifest; `src/__tests__/`; shared fixtures | Browser editor, toolbar/commands, inspector, graph viewer, diagnostics, examples, worker sequencing; storage, clipboard, keyboard/focus/accessibility, worker lifecycle, URL/share are separate boundaries | `.github/workflows/playground-ci.yml`, build artifact, Pages assembly, package scripts; README/docs, UX/local-file plans, fixture manifest | Browser implementation/local tests are separate from current public deployment and Pages evidence. E2E/public/AT checks are not uniformly current. | [Playground capability matrix](./playground/capability-matrix.md) / [audit index](./playground/implementation-audit.md) |
| **Website/Pages** — `relgeo/relgeo.github.io`; presentation/deployment artifact | Astro layouts/pages/content loader, spec ingestion, i18n, Markdown config, sitemap, package manifest; build/artifact assertions and generated output | Docs routes, localized shell, spec presentation, Markdown preview/highlight, Playground assembly; accessibility, canonical/SEO, link integrity, deployed HTTP are distinct | `.github/workflows/pages.yml`, build/dist, Pages assembly, public smoke; website docs, repository map, spec source, plans, baseline | Static build is not public deployment. English placeholder, stale pins, browser/AT, and public smoke limits are separate. | [Website matrix](./website-pages/capability-matrix.md) / [audit](./website-pages/implementation-audit.md) |
| **Flutter** — `relgeo/flutter`; native workbench consumer | `flutter/lib/`, document/editor/workbench/rendering/persistence/platform/MCP bridge, `pubspec.yaml`; `flutter/test/`, fixtures/capability JSON, local notes, plans/CI | Menus, commands, editor, viewport, inspector, diagnostics, document lifecycle, recent/dirty/recovery; native lifecycle, keyboard/accessibility, host OS, distribution are explicit | `.github/workflows/`, local macOS verification, release notes; Flutter plans, capability JSON, repository map, fixture manifest | Source/UI/test evidence is separate from host/OS and current CI/public delivery. Missing host evidence is `not verified`, not `❌`. | [Flutter matrix](./flutter-workbench/status-matrix.md) / [audit](./flutter-workbench/implementation-gap-map.md) |
| **MCP** — `relgeo/mcp`; pure-Dart contract, adapters, resources, host bridge | `mcp/lib/relgeo_mcp.dart`, contract/session bridge, schema/transport paths, `pubspec.yaml`; schema/protocol/session tests and bridge tests | Typed tools/resources, active-document bridge, future agent/desktop consumers; token/revision/session guard, transport/SDK, host bridge, filesystem isolation, and security are separate | `mcp/.github/workflows/mcp-ci.yml`, `bin/verify_session_bridge.dart`, SDK/Inspector/HTTP gates; MCP README, four plans/contracts, Flutter bridge, spec/core/language-service ownership | Matrix includes MVP and beyond-MVP authoring, resource, session, transport, host, security, and delivery rows. Contract/source/tests do not imply callable runtime or public transport. | [MCP capability matrix](./mcp/capability-matrix.md) / [audit index](./mcp/implementation-audit.md) |
| **Cross-repository orchestration** — `relgeo/workspace`; pointers, fixtures, gates, provenance | `.gitmodules`, repository map, compatibility/integration baselines, root scripts, workflows; fixture manifest, conformance runner, baseline/release/compatibility negative tests | Root integration, child pointers, synchronization PR, package/Pages/Flutter/MCP consumers; exact SHA, child CI, registry, API, public deployment, provenance are boundaries | `.github/workflows/integration.yml`, sync workflow, root release/integration scripts; plans 01/04/05/10/11, baseline/decision docs | Orchestration status is not child implementation status. Pointer drift, Node 24/canonical, CI/API, registry, and public checks remain independently labeled. | [Cross-repository status matrix](./cross-repository/status-matrix.md) / [audit index](./cross-repository/implementation-audit.md) |

## Review checklist

- Each in-scope surface has one matrix and one implementation audit; this
  ledger only proves discovery categories and directs the reader to them.
- `S`, `T`, `C`, `P`, `D`, and `O` are discovery categories, not evidence
  tiers. Claims still name `E0`–`E5`, revision, environment, and parity state.
- `N/A` is used only when a category is outside ownership; missing runtime,
  host, CI, registry, or public access is `not verified`.
- A source/test/fixture hit never promotes a capability to public delivery,
  consumer parity, or MCP exposure without a separate adapter or deployment
  check.
- Expected-but-missing rows retain their expectation source; undocumented or
  unsearched capabilities remain outside the discovered inventory rather than
  being called absent.
