# Markdown Surfaces Coverage Validation and Handoff

**Validation date:** 2026-10-30
**Status:** validation checkpoint selesai; Markdown surface belum dinyatakan lengkap
**Boundary:** `remark-relgeo` preview/embed, `remark-relgeo-hl` source highlighting, dan official Astro consumer

Dokumen ini memvalidasi coverage, keterlacakan, legend, evidence class, scope,
limitation, dan handoff untuk capability baseline Markdown. Ini bukan bukti
bahwa gap implementasi sudah tertutup.

## 1. Validation result

| Check | Result | Evidence / interpretation |
| --- | --- | --- |
| Expected capability IDs | PASS | 38 unique IDs pada [expected catalog](./expected-capability-catalog.md), disusun sebelum audit implementasi. |
| Audit ID coverage | PASS | 38 current audit rows; seluruh expected ID memiliki disposition, termasuk `absent`, `broken`, dan `unverified`. |
| Reconciliation join | PASS | 38 rows; tidak ada expected ID yang hilang, duplicate, atau observed-only. |
| Status matrix coverage | PASS | 38 capability-first rows; IDs dan status cocok dengan reconciliation. |
| Gap backlog derivation | PASS | 27 unique candidate implementation tasks for implementation-gap rows; each has an explicit priority/scope register entry, and 2 evidence-only `🌗` rows have separate verification follow-ups. |
| Required status legend | PASS | Matrix memuat `✔️`, `🌗`, `❌`, `➖`, `⏸️`, dan `⚠️`; unverified external evidence is kept in the separate evidence column. |
| Evidence classes | PASS | `verified-local`, `partial-local`, `unverified-external`, `not-applicable`, dan deferred physical validation dipisahkan dari implementation status. |
| Scope decisions | PASS | `in scope`, `boundary only`, dan `not applicable` dicatat per row; `➖` hanya dipakai untuk `MD-A11Y-003`. |
| Local links and paths | PASS | Catalog, audit, reconciliation, matrix, backlog, repository map, master plan, compatibility matrix, package paths, fixture paths, dan website paths resolve in the workspace. |
| Required source evidence | PASS | [Repository map](../../REPOSITORY-MAP.md), [maturation master plan](../../MATURATION-MASTER-PLAN.md), and `docs/capability-map/` are present and referenced. |
| Completeness claim guard | PASS | Documents state that the surface is bounded/not complete and do not promote local evidence to registry, public, browser, or native proof. |

The validation was performed with read-only ID/path checks over the artifact
set. A passing coverage check means the declared discovery and expected rows
are traceable; it does not mean every behavior in those sources is implemented.

## 2. Required trace chain

The maintained trace is:

`expected catalog ID → audit ID row → reconciliation result → status matrix row → backlog task (when implementation gap)`

The chain is complete for all 38 expected IDs. The two external-boundary rows
`MD-SSR-003` and `MD-REL-002` are `🌗 partial` implementation results with
`unverified-external` evidence and therefore route to `MD-VERIFY-001` and
`MD-VERIFY-002`, not to an invented verification claim. `MD-A11Y-003` is
`➖ not applicable` because the current plugin output has no interactive
controls; it does not hide a missing static accessibility capability.

## 3. Discovery coverage report

The current audit records these discovery categories and their boundaries:

| Discovery category | Sources inspected | Coverage interpretation |
| --- | --- | --- |
| Source/API | `remark-relgeo/src/index.ts`; `remark-relgeo-hl/src/index.ts`; `remark-relgeo-hl/src/render.ts`; package exports/types | Entrypoints, options, AST transforms, preview rendering, token rendering, and exported helper are inspected. |
| Package config/build | `remark-relgeo/package.json`, `remark-relgeo-hl/package.json`, `tsconfig.json`, README, development plans, generated `dist/` | Scripts, exports, dependencies, package metadata, and build boundary are inspected. |
| Unit/package tests | `remark-relgeo/test/remark-relgeo.test.mjs`; `remark-relgeo-hl/src/__tests__/remark_relgeo_hl.test.ts` | Preview 7/7 and highlighter 5/5 local tests pass; test count is not treated as full expected-ID coverage. |
| Shared fixtures | `fixtures/manifest.json`, `fixtures/expected/`, `scripts/run-conformance-fixtures.mjs` | Active, invalid, runtime-diagnostic, and candidate fixture paths are inspected; 260/260 selected conformance checks pass. |
| Remark/rehype integration | `relgeo.github.io/astro.config.mjs`; Markdown config; `unwrapCustomCodeBlocks()` | Official Astro ordering and static build are inspected; generic non-Astro pipeline remains unverified. |
| Website content/routes | `relgeo.github.io/src/content/docs/{en,id}/markdown-surfaces.md`, related docs links/routes, built-output assertions | English/Indonesian examples, route links, and local generated output are covered. |
| Styling/accessibility | `relgeo.github.io/src/styles/site.css`, `src/styles/accessibility.css`, generated HTML | CSS/accessibility shell and alt text are inspected; physical screen-reader/mobile validation remains deferred. |
| Artifact/delivery | `.github/workflows/pages.yml`, website build/assertion scripts, Playground artifact copy, Pages artifact checks | Local website/Pages artifact assembly passes; deployed public smoke and clean registry consumer parity are unverified. |
| UI/menu/command/shortcut | Plugin packages and website routes/scripts | No plugin-owned UI, menu, shortcut, or command exists; this category is not applicable to plugin internals. |
| Config/platform/service | Plugin options; Astro env/base configuration; core, renderer, and language-service runtime calls | Node/static Astro path is verified locally; generic SSR, registry service resolution, and physical hosts remain bounded. |
| Normative/docs/roadmap | `docs/MATURATION-MASTER-PLAN.md`, `docs/compatibility-matrix.json`, plan 05, package READMEs/development plans, spec error/version/presentation chapters | Requirement ownership and scope decisions are inspected; expected IDs come from the preceding catalog, not from code or the old matrix. |
| Repository ownership | `docs/REPOSITORY-MAP.md` and package directory boundaries | Workspace, website, spec, core, renderer, language-service, and both Markdown package owners are traceable. |

### Capability-family coverage proof

The expected catalog declares these capability families through its stable ID
prefixes. Each family is present in the audit disposition and reconciliation;
the status matrix then carries the same rows into the actionable handoff.

| Capability family | Expected IDs | Count | Coverage evidence | Boundary result |
| --- | --- | ---: | --- | --- |
| Fence discovery and Markdown block handling | `MD-FENCE-001`–`003` | 3 | Plugin AST visitors, package tests, and reconciliation rows | Reviewed; mixed-block and shared-alias gaps remain explicit. |
| Preview/embed projection | `MD-PREVIEW-001`–`004` | 4 | `remark-relgeo` source/tests, core/renderer delegation, Astro output | Reviewed; wrapper/presentation contract is partial. |
| Source highlighting | `MD-HL-001`–`004` | 4 | `remark-relgeo-hl` source/tests/render helper, language-service, site assertions | Reviewed; tolerant service-failure fallback is implemented, while independent lexical fallback remains partial. |
| Diagnostics and failure policy | `MD-DIAG-001`–`004` | 4 | Preview/highlighter fallback probes, error-model/spec inputs, audit dispositions | Reviewed; structured diagnostics and tolerant/strict policy are implemented, while non-fatal runtime diagnostics remain absent. |
| Options and pass-through | `MD-OPT-001`–`004` | 4 | Package option interfaces/meta parser, READMEs, compatibility/presentation docs | Reviewed; validation and caller policy gaps remain. |
| SSR, determinism, and package exports | `MD-SSR-001`–`004` | 4 | Package lint/build, shared fixtures, Astro build, external-boundary dispositions | Reviewed; generic-host and fresh-consumer evidence remain unverified. |
| Assets and output safety | `MD-ASSET-001`–`003` | 3 | Data-URI output, AST escaping/helper, artifact assertions, trust-boundary audit | Reviewed; configurable assets and raw-hook safety remain partial. |
| Accessibility and static interaction boundary | `MD-A11Y-001`–`003` | 3 | Generated alt text, site CSS/shell, route assertions, deferred physical AT record | Reviewed; `MD-A11Y-003` is boundary-only, not a hidden gap. |
| Error/version projection | `MD-ERR-001`–`003` | 3 | Invalid/version fixtures, preview/highlighter fallback probes, spec/compatibility policy | Reviewed; typed adapter/contextual projection is bounded, while version taxonomy and non-fatal runtime mapping remain partial/absent. |
| Website/Pages consumption | `MD-WEB-001`–`004` | 4 | Astro config/content/routes, 138-page build, built-output assertions, artifact handoff | Reviewed; deployed/public and physical readability evidence remain limited. |
| Public package and release readiness | `MD-REL-001`–`002` | 2 | Package manifests/README, repository map, compatibility matrix, release follow-up | Reviewed; registry parity remains unverified. |
| **Total** | **All expected IDs** | **38** | **Catalog → audit → reconciliation → matrix trace** | **Coverage is bounded; completeness is not claimed.** |

The audit therefore covers the required discovery surface, while explicitly
retaining host, release, and physical-validation limits.

## 4. ID, legend, evidence, and scope checks

Implementation, evidence, and scope are separate axes across all linked docs:

- implementation status is observed in the audit, reconciliation, and matrix;
- evidence status is qualified independently and does not promote local Node or
  Astro output into canonical Node, registry, public, or native evidence;
- `❌` remains explicit for `MD-DIAG-003`, the non-fatal runtime-diagnostic path
  that was outside this implementation tranche;
- `🌗` remains explicit for `MD-ASSET-003`, where bounded unsafe-output
  rejection is verified but a general sanitizer/URL policy is still open;
- no current selected row is `⚠️`; the former highlighter service-failure
  defect is covered by the tolerant fallback and strict typed-error paths;
- `➖` is reserved for the current non-interactive-control boundary;
- `⏸️` is available in the legend but no expected row is currently deferred by
  a product scope decision;
- `unverified-external` is an evidence state for external boundaries, never a
  replacement for an implementation status or an absent implementation finding.

## 5. Limitations and evidence boundaries

| Limitation | Status | Consequence |
| --- | --- | --- |
| Generic SSR/non-Astro unified pipeline | unverified | Astro success does not prove every Markdown host ordering or rehype contract. |
| Clean npm pack/install/registry consumer | unverified | Local package exports are not a public release or registry parity claim. |
| Deployed public-site smoke | unverified | Local Pages artifact assertions do not prove the deployed URL. |
| Physical mobile, VoiceOver, TalkBack, and Safari touch validation | deferred | CSS/HTML assertions do not replace physical assistive-technology evidence. |
| Highlighter service failure | bounded fallback implemented | Tolerant mode preserves source in `pre > code` with a diagnostic; strict mode remains an explicit typed failure. Independent lexical fallback is still partial. |
| Preview website wrapper | implemented locally | The rehype helper unwraps the generated preview wrapper, and built-output assertions reject `pre > div` for the audited consumer. |
| Structured diagnostics and strict/tolerant policy | implemented locally | Both plugins expose serialized code/severity/phase/location diagnostics and documented tolerant defaults with strict typed errors. Non-fatal runtime diagnostics remain absent. |
| Custom SVG hook trust boundary | partial | Normal AST/text paths are escaped and bounded unsafe tags/handlers/URLs are rejected; a general sanitizer and URL policy remain open. |

These limitations are not converted into `❌` unless a target implementation
observation supports absence; conversely, confirmed `❌` and `⚠️` findings stay
explicit.

## 6. Unresolved questions

1. What exact shared fence alias set should `remark-relgeo` and
   `remark-relgeo-hl` guarantee, and should `rg`/`relgeo` remain intentionally
   separate defaults?
2. Should preview expose a view option, and which profile/sheet/unit metadata
   combinations are part of the stable public package contract?
3. What structured diagnostic DTO (code, severity, message, block/source
   location) should the plugins project from spec/core error vocabulary?
4. Should strict/tolerant behavior be a plugin option, a website build policy,
   or both, and what is the documented default?
5. Should the preview wrapper be corrected in the plugin, the website rehype
   helper, or a jointly versioned integration contract?
6. What canonical Node >=24, registry, public deployment, browser, and native
   accessibility runs are required before the corresponding evidence classes
   can be upgraded?

These questions are scope/product decisions or verification planning items;
they do not authorize silently changing the expected catalog or implementation
status.

## 7. Implementation handoff

Implementation work must be created as separate goals/tasks from the validated
documentation set:

- use [the Markdown implementation-gap backlog](./implementation-gap-backlog.md)
  for the 27 candidate implementation tasks covering every `🌗`, `❌`, and
  `⚠️` row;
- run `MD-VERIFY-001` for generic unified ordering and `MD-VERIFY-002` for
  clean package/registry parity as separate evidence follow-ups;
- after source/test changes, rerun the implementation audit and the
  ID-based reconciliation before promoting a matrix status;
- do not mark a candidate complete by editing the catalog, audit, matrix,
  backlog, or this handoff document;
- preserve the explicit boundary that the plugin surface is not a full semantic
  IDE, not a website deployment proof, and not a physical accessibility proof.

Current conclusion: the declared Markdown discovery boundary and all expected
capability rows are mapped and traceable, but the Markdown surface is **not
complete**, **not fully externally verified**, and **not closed for
implementation**.

## 8. Reproducible evidence and changed boundary

### Verification commands and results

These commands were rerun against the current working tree on 2026-10-30:

| Command | Result | Boundary proven |
| --- | --- | --- |
| `npm run lint && npm run build && npm test` in `remark-relgeo/` | PASS; 7/7 tests | Preview transform, typed tolerant/strict failures, unsafe-output rejection, package types, and ESM/CJS output. |
| `npm run lint && npm run build && npm test` in `remark-relgeo-hl/` | PASS; 5/5 tests | Token output, source-preserving service-failure fallback, strict typed failure, package types, and ESM/CJS output. |
| `npm run conformance:fixtures` at workspace root | PASS; 260/260 across 20 fixtures | Shared parser/core/renderer/language-service and Markdown preview/highlight projections. |
| `npm run check && npm run build && npm test` in `relgeo.github.io/` | PASS; 0 diagnostics, 138 pages, built-output assertions pass | Official Astro Markdown consumer, wrapper structure, provenance markers, localized routes, and preview source non-exposure. |
| `npm run build` in `playground/` | PASS; Vite production build | Playground asset assembly input; Vite emitted a non-blocking large-chunk warning. |
| `rsync -az playground/dist/ relgeo.github.io/dist/playground/` then `npm run test:pages-artifact` in `relgeo.github.io/` | PASS; 3 assets checked | Local Pages artifact assembly and Playground asset presence. |
| `git diff --check` at root and in each changed child repository | PASS | No whitespace errors in the inspected changes. |

The shell emitted the known non-blocking `LC_ALL=C.UTF-8` locale warning. The
workspace uses Node `v22.23.2`; the documented full integration gate targets
Node `24.21.0`, so that gate remains environment-unverified rather than a target
failure.

### Changed repository and commit boundary

This handoff describes an **uncommitted working-tree change**, not a release or
commit. No files were staged, no commit was created, and no push was performed.
The relevant implementation/evidence boundary is:

| Repository boundary | Changed paths in this tranche | Ownership |
| --- | --- | --- |
| `remark-relgeo/` | `src/index.ts`, `test/remark-relgeo.test.mjs`, `README.md` | Preview/embed transform, diagnostics, policy, and output-safety adapter. |
| `remark-relgeo-hl/` | `src/index.ts`, `src/__tests__/remark_relgeo_hl.test.ts`, `README.md` | Source highlighting, service-failure fallback, diagnostics, and policy adapter. |
| `relgeo.github.io/` | `astro.config.mjs`, `scripts/assert-built-output.mjs` | Official Astro wrapper assembly and provenance/consumer assertions. |
| Workspace/docs | `fixtures/manifest.json`, `docs/capability-map/markdown-surfaces/` | Shared digest evidence and catalog/audit/reconciliation/backlog/handoff records. |

The root checkout also contains unrelated pre-existing changes in other
capability-map surfaces and child repositories. They were preserved and are
not part of this Markdown handoff. The child repository status is intentionally
reported separately because the root records those repositories as gitlinks.

## 9. Remaining-gap handoff

| Gap | Current status | Owner/source boundary | Next action | Evidence prerequisite |
| --- | --- | --- | --- | --- |
| Non-fatal runtime diagnostics preserving a valid preview (`MD-DIAG-003`) | `❌ absent` | `remark-relgeo` adapter plus `core` runtime-diagnostic API; `MD-TASK-010` | Define a tolerant result shape that carries preview and runtime diagnostics, then add a shared fixture and host assertion. | Target implementation and focused runtime-diagnostic fixture; no release required. |
| General generated-output sanitizer/URL policy (`MD-ASSET-003`) | `🌗 partial` | Both plugin output boundaries plus renderer/host policy; `MD-TASK-018` | Extend the current rejection fixtures into an explicit sanitizer and URL allow/deny policy; retain the bounded tests as regressions. | Security-focused local tests and consumer output assertions. |
| Independent lexical fallback (`MD-HL-004`) | `🌗 partial` | `remark-relgeo-hl` plus language-service lexical contract; `MD-TASK-007` | Add a language-service-independent lexical fallback and fixture; keep the current service-failure fallback. | Package tests and a source-only fixture. |
| Option validation/asset strategy/accessibility semantics | `🌗 partial` | Package owners and official website; `MD-TASK-012`, `014`, `017`, `019`, `020` | Define the public option and semantic contracts before implementation; do not infer them from current output alone. | Maintainer/product decision followed by focused tests. |
| Generic host, registry, deployment, and physical AT evidence | `unverified`/`deferred` | Website/release/accessibility owners; `MD-VERIFY-001`, `MD-VERIFY-002`, `MD-TASK-025`–`027` | Run only when the external host, registry, Node 24 gate, or physical device scope is explicitly available. | External access or accepted physical-validation scope; not required for this goal. |

No npm/pub.dev publication, production deployment, registry install, external
service, or deferred platform host was used as a prerequisite for the local
implementation or verification result.

## Source links

- [Repository map](../../REPOSITORY-MAP.md)
- [Maturation master plan](../../MATURATION-MASTER-PLAN.md)
- [Expected capability catalog](./expected-capability-catalog.md)
- [Implementation audit](./implementation-audit.md)
- [Expected-versus-observed reconciliation](./reconciliation.md)
- [Status matrix](./status-matrix.md)
- [Implementation-gap backlog](./implementation-gap-backlog.md)
- [Compatibility matrix](../../compatibility-matrix.json)
- [Surface discovery ledger](../SURFACE-DISCOVERY-LEDGER.md)
