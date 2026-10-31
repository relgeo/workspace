# RelGeo cross-surface audit synthesis and priorities

> **Coverage statement — 2026-10-31 review of the 2026-10-29 synthesis.** This summary covers the 12 surface
> matrix/audit pairs and the cross-surface reconciliation register using
> source, tests/fixtures, consumer wiring, workflows, platform boundaries, and
> provenance evidence. It is a priority/dependency view, not a replacement for
> matrix rows. Current host, CI/canonical, registry, and public checks remain
> `not verified` where stated; a missing priority is not evidence that a
> capability is absent.

> **Current-state overlay — 2026-10-31:** The MCP adapter/loopback HTTP server, offline full-spec search, active-document read, and permission-gated bounded edit are implemented and locally tested; ChatGPT Desktop write round-trip and packaged MCP smoke remain unverified. Flutter CI `41184291670` passed at `60ec760`, and release run `41184693233` produced unpublished v1.0.1 macOS universal/Linux x64/Windows x64 draft bundles. The root manifest is stale for 11 of 12 child pointers; current child checkouts are clean, while the Node/pnpm root gate was not available in this shell. Playground toolbar compaction is implemented at `c7cec4b`; hosted browser/public artifact parity remains separate. The rows below are an older priority synthesis unless refreshed by this overlay or linked current surface evidence.

## Scope and method

This synthesis covers the 12 audited surfaces in the capability inventory:
spec, geometry, core, renderer-SVG, language-service, CLI, Markdown plugins,
Playground, website/Pages, Flutter, MCP, and workspace orchestration. MCP is
kept as a distinct protocol/host/delivery boundary; its contract is not merged
with Flutter UI or TypeScript runtime implementation.

The order below is derived from the completed implementation audits, not from
the historical roadmap alone:

1. audit actual source, tests, fixtures, consumers, and workflow boundaries;
2. identify the capability that should exist at that boundary;
3. assign status from direct evidence and mark unverified evidence explicitly;
4. rank by dependency, risk of misleading public claims, maintainer/user value,
   and reversibility of the next action.

## Authoritative anchors

- [Maturation master plan](../../MATURATION-MASTER-PLAN.md) — compatibility line,
  historical/current evidence boundary, and existing stage decisions.
- [Repository map](../../REPOSITORY-MAP.md) — ownership and source-of-truth rules.
- [Cross-repo integration gate plan](../../plans/01-cross-repo-integration-gate.md)
  — runner, CI, fixture, and synchronization design.
- [Cross-repo open decisions](../../decisions/07-cross-repo-open-decisions.md) —
  decisions still requiring explicit maintainer treatment.
- [Open-work recommendations](../../decisions/09-open-work-recommendations.md) —
  accepted/held promotion, Flutter, and release recommendations.
- [Capability reconciliation register](../RECONCILIATION-REGISTER.md) —
  cross-surface deduplication and boundary-specific status decisions.

The individual surface pairs remain the detailed evidence view; this document
only synthesizes their priorities and dependency order.

### Evidence precedence

The 2026-10-29 surface matrices and implementation audits are the baseline inventory inputs; the 2026-10-31 current-state overlay above identifies later deltas. The fixture manifest and integration baseline remain separate provenance inputs. The [maturation master
plan](../../MATURATION-MASTER-PLAN.md), [decision record 07](../../decisions/07-cross-repo-open-decisions.md),
and [recommendation record 09](../../decisions/09-open-work-recommendations.md)
remain authoritative for recorded scope decisions and historical context, but
their older canonical/public run references are not current-pointer evidence
unless the exact revision and environment match this audit. This is why a
previously green gate can coexist with a current `not verified`, `⚠️`, or
`⏸️` status.

## Evidence posture

| Evidence class | Current finding | Consequence |
|---|---|---|
| Contract and local implementation | Strong for the bounded DSL 0.5 path: package tests, shared fixtures, and compatibility checks are present. | Feature expansion can be evaluated against explicit contract rows rather than API names. |
| Cross-surface local conformance | `260/260` across 20 fixtures; compatibility `283/283`; baseline failure injection and release-record validation pass. | Local semantic evidence is useful, but does not replace Node 24, registry, child-CI, or public deployment evidence. |
| Baseline provenance | Current child worktrees are clean and match root gitlinks, but 11 of 12 manifest pins differ from the 2026-10-09 snapshot. | Current root integration/public claims remain limited until pointers and manifest are reconciled. |
| Canonical integration runtime | Full local gate stops under Node `22.23.2`; runner requires Node 24+. | A Node 24 rerun is a prerequisite for release-grade cross-surface conclusions. |
| Public/CI evidence | Flutter CI and draft release runs are current-pointer evidence; root integration, registry verification, Playground/Pages browser smoke, and public artifact parity were not rerun in this review. | Preserve per-surface and per-host evidence boundaries; a Flutter workflow does not establish the website/browser path. |
| MCP contract versus delivery | Offline spec lookup, resource resolution, embedded loopback Streamable HTTP, active-document access, and opt-in bounded edit are locally implemented/tested. ChatGPT Desktop read-only behavior is user-observed; write round-trip and packaged target-host smoke are not verified. | Separate callable local runtime from semantic language-service integrations and packaged/cross-host delivery. |

## Priority matrix

| Priority | Work item | Audited evidence / affected surfaces | Dependency | Risk if deferred | Maintainer/user value | Next action |
|---|---|---|---|---|---|---|
| P0 | Reconcile submodule pointers and baseline provenance | Current child worktrees are clean and match all 12 root gitlinks; 11/12 manifest pins differ from the 2026-10-09 snapshot. Website also has a separate Playground Pages pin. | Validated child CI and reviewed root synchronization PR | Every downstream CI/release/public result can refer to the wrong source revision. | Restores reproducibility and makes later evidence attributable. | Update the baseline to exact validated SHAs through the synchronization workflow, then rerun strict verification. |
| P0 | Run the canonical Node 24 integration sequence | The 2026-10-30 local run stopped before stages on Node 22; Node/pnpm were unavailable in the 2026-10-31 review shell. Root integration/public evidence is not current. | P0 provenance; Node 24; pnpm 10.33.3 | Package, consumer, pack, browser, and Pages gaps remain conflated with environment gaps. | Highest-value release confidence for maintainers and users. | Run strict baseline → local gate → public-registry gate → current CI; retain JSON reports. |
| P0 | Fix renderer metadata/dimension escaping | Renderer audit confirms a security/output escaping issue in metadata-driven values. | Renderer source owner; regression fixtures | Malformed or unsafe SVG output can reach CLI, Markdown, Playground, and website consumers. | Protects every SVG-producing surface. | Patch in `renderer-svg`, add regression tests, rerun renderer and shared fixtures. |
| P0 | Make Markdown highlighting resilient and test it | `remark-relgeo-hl` has no package tests and confirmed synthetic language-service failure can abort transform despite fallback documentation. | Language-service API boundary; independent of core implementation changes | Broken highlighting can break docs builds or leave authors without source-preserving output. | Improves docs reliability with a small, reversible package-local change. | Add source-preserving fallback and tests for fence isolation, whitespace, token spans, escaping, and service failure. |
| P0 | Repair core error-code/type contract drift | Core audit identifies mismatch between documented error catalog and raw evaluator/resolver errors, including boolean paths. | Spec error model; language-service/CLI mappings | Consumers cannot reliably classify or explain failures; diagnostics diverge across surfaces. | Stabilizes automation, diagnostics, and support. | Define the canonical error map, cover it with fixtures, and update downstream mappings. |
| P1 | Add a spec-to-consumer drift check | Spec matrix finds duplicated version/section/object/anchor/expression/error knowledge; no generated catalog exists. | Spec ownership; parser, validator, language-service schemas | Normative changes can silently leave parser/schema/completion consumers stale. | Reduces future cross-surface audit cost and contract regressions. | Start with version, top-level sections, object types, anchors, expressions, and error codes. |
| P1 | Resolve language-service API/documentation mismatch | `getSchema()` and stale README version are confirmed mismatches; diagnostics remain structural/validation-bound. | Core error map and spec drift check | Editor integrations may rely on an API or diagnostic guarantee that is not real. | Improves editor/tooling trust without broadening scope. | Align API/docs, then decide whether post-resolve violations need a separate method. |
| P1 | Verify MCP write interoperability and packaged desktop runtime | MCP local tool/resource/spec-search, loopback transport, active-document read, and permission-gated edit are implemented and locally tested. ChatGPT Desktop read-only use was observed; write round-trip and packaged host smoke remain open. | Live ChatGPT Desktop, current release draft, target OS hosts | Users cannot rely on edits or packaged setup until exercised end to end. | Turns the local feature into a reviewable user workflow without overclaiming semantic tool breadth. | Verify edit/revision/undo round-trip in ChatGPT Desktop and smoke-test packaged MCP on macOS/Linux/Windows, prioritizing Windows. |
| P1 | Keep evaluator/units candidate boundary explicit | Fixture 16 passes snapshots but remains `capability`; spec/core/Flutter matrices agree promotion is not automatic. | Core semantics, Flutter parity, decision record | Passing candidate output could be mistaken for active 0.5 support. | Prevents overclaiming while preserving a concrete promotion path. | Decide signed literals, units, defaults, parameters, and non-numeric strings; promote only with synchronized evidence. |
| P1 | Refresh Playground and Pages artifact evidence | Playground browser run is environment-blocked; website artifact requires Playground assembly; pointers/pins are stale. | P0 provenance and Node 24 gate | Public docs may ship an artifact different from the audited Playground. | Directly affects public authoring/onboarding. | Build current Playground and site together, run Pages artifact assertion, current browser E2E, and public smoke. |
| P1 | Fix CLI unknown-format behavior and file-output coverage | CLI silently falls through to JSON for unknown `--format`; output failure/overwrite semantics lack tests. | Core/renderer output contract | Automation typos can succeed with the wrong artifact. | Low-cost reliability improvement for scripts and CI users. | Reject unknown formats non-zero; add temporary-file and machine-readable error tests. |
| P1 | Clarify spec index labels and presentation parity | Spec matrix confirms indexes are labeled informative while linked chapters are normative; presentation evidence is stronger in legacy fixtures than active 0.5. | Spec owner; website direct source loading | Readers and tooling may misunderstand authority or overestimate active presentation coverage. | Improves contract comprehension without duplicating source. | Normalize index wording; add active v0.5 presentation/diagnostic fixtures where a consumer exists. |
| P2 | Define geometry query/precision expansion policy | Geometry is implemented, but sampled paths, supported pairs, degeneracy, and high-level query ownership remain bounded/partial. | Core ownership decision; consumer demand | Future expansion can become incompatible or duplicated across geometry/core. | Enables deliberate feature growth after baseline stability. | Document supported pairs/tolerance and add cross-surface fixtures only for a named consumer. |
| P2 | Expand Playground completion/hover and inspector evidence | Components and APIs exist; fresh browser interaction and uncommon object coverage are not verified. | Current browser gate; language-service API alignment | Editor UX regressions may escape unit/build checks. | Improves authoring productivity after release confidence is restored. | Add current-pointer browser assertions for completion/hover and representative object families. |
| P2 | Accessibility and physical-device validation | Static/AX/emulation evidence exists, but VoiceOver/TalkBack/Safari mobile and physical devices are explicitly deferred. | Separate device/AT decision and hosts | Accessibility confidence remains limited, but this does not block the current desktop/browser contract. | Valuable for broader public adoption; intentionally not a hidden support claim. | Reopen only with explicit product/release scope and device evidence. |
| P2 | Translate English spec through spec ownership | Website English route exists, but `spec/en` is a placeholder and currently renders the Indonesian source under an English shell. | Spec editorial owner and review | English readers may assume translated normative content. | Improves international usability after source truth remains stable. | Translate/review in `spec`; keep website as renderer, not fork. |
| P2 | Decide whether validated-child sync should cover every submodule | Orchestration sync workflow currently allowlists Flutter, Playground, and MCP; package/spec child CI uses root integration instead. | Child workflow event contracts and maintainer preference | Provenance refresh remains less automatic for package/spec/website changes. | Could reduce drift, but broadening workflow adds operational complexity. | Record a decision; do not expand allowlist without a tested event contract. |

## Execution ownership and workstream lanes

The priority table above is the rationale view. This register makes execution
ownership and work type explicit for every priority so an unavailable host or
external service does not accidentally become a dependency for implementation
work that can proceed independently.

| Priority / work item | Workstream lane | Owner | Real dependency | Main risk | Actionable next step |
|---|---|---|---|---|---|
| P0 — Reconcile submodule pointers and baseline provenance | Evidence / provenance | `relgeo/workspace` + validated child CI owners | Exact child SHAs, reviewed sync PR, child CI result | Downstream evidence may describe the wrong checkout | Current child checkouts are clean, but 11/12 manifest pins are stale; update the manifest through the validated synchronization workflow, then rerun strict verification |
| P0 — Run canonical Node 24 integration sequence | Evidence / CI / release gate | `relgeo/workspace` integration owner | P0 provenance, Node 24, pnpm 10.33.3, initialized submodules | Environment gaps remain confused with product gaps | Run local, public-registry, and current CI stages; archive JSON reports |
| P0 — Fix renderer metadata/dimension escaping | Implementation / security | `relgeo/renderer-svg` | Renderer source owner and regression fixtures only | Unsafe or malformed SVG reaches multiple consumers | Patch escaping, add focused regressions, rerun renderer and shared fixtures |
| P0 — Make Markdown highlighting resilient and test it | Implementation / package reliability | `relgeo/remark-relgeo-hl` with `relgeo/language-service` | Language-service API behavior; no Node 24/public gate required to start | Docs transforms can fail on service/fallback errors | Implement source-preserving fallback and package tests for fences, spans, escaping, and service failure |
| P0 — Repair core error-code/type contract drift | Implementation / contract | `relgeo/core` with language-service/CLI consumers | Spec error model and downstream mapping review | Consumers cannot classify or explain runtime failures consistently | Define canonical error map, add fixtures, update mappings |
| P1 — Add a spec-to-consumer drift check | Implementation / contract tooling | `relgeo/spec` + `relgeo/core` + `relgeo/language-service` | Agreement on generated/checkable vocabulary | Normative edits silently leave consumers stale | Start with version, sections, objects, anchors, expressions, and error codes |
| P1 — Resolve language-service API/documentation mismatch | Implementation / public API docs | `relgeo/language-service` | API owner decision; core error map is related but not a prerequisite for `getSchema()` fix | Editors rely on missing or stale API claims | Align README/API and add an API regression test |
| P1 — Complete MCP semantic and end-user verification | Implementation / protocol delivery | `relgeo/mcp` + Flutter host owner + ChatGPT Desktop operator | Current local adapter, spec snapshot, target desktop, live client | Local capability is mistaken for reliable user setup or broad language-service support | Verify ChatGPT Desktop write round-trip and packaged MCP smoke; prioritize Windows; keep semantic validation/completion/render gaps explicit |
| P1 — Keep evaluator/units candidate boundary explicit | Decision / contract promotion | Maintainer + `relgeo/core` + Flutter owner | Signed contract decision, fixture 16, synchronized semantic evidence | Passing candidate snapshots are over-promoted to active support | Record decision; keep fixture 16 `capability` until promotion criteria pass |
| P1 — Refresh Playground and Pages artifact evidence | Evidence / browser / deployment | `relgeo/playground` + `relgeo/relgeo.github.io` + workspace | P0 provenance and Node 24 gate; browser/public host access | Public docs ship a different or stale Playground artifact | Build both inputs, run artifact assertion, browser E2E, and public smoke |
| P1 — Fix CLI unknown-format behavior and file-output coverage | Implementation / CLI reliability | `relgeo/cli` | Core/renderer output contract; local temp filesystem is sufficient to start | Automation typos succeed with the wrong artifact | Reject unknown formats and add file-output/error-path tests |
| P1 — Clarify spec index labels and presentation parity | Contract/docs + evidence | `relgeo/spec` with website owner | Spec editorial review; active presentation fixture decision | Readers misclassify authority or legacy coverage as active parity | Normalize index labels and classify/add active presentation fixtures |
| P2 — Define geometry query/precision expansion policy | Decision / implementation scope | `relgeo/geometry` + `relgeo/core` | Named consumer demand and tolerance/ownership decision | Duplicate or incompatible query semantics emerge | Document supported pairs/tolerance; add fixtures only for an approved consumer |
| P2 — Expand Playground completion/hover and inspector evidence | Evidence / browser UX | `relgeo/playground` + `relgeo/language-service` | Current browser gate and API alignment; unit tests can proceed independently | UX regressions escape static tests | Add current-pointer browser assertions for representative object families |
| P2 — Accessibility and physical-device validation | Platform / accessibility evidence | Flutter/platform QA owner + website/Playground owners | Supported device/AT hosts and explicit release scope | Accessibility support is overstated or remains unmeasured | Run keyboard/VoiceOver/browser/AT scenarios only when the host decision is approved |
| P2 — Translate English spec through spec ownership | Contract/docs | `relgeo/spec` editorial owner | Translation review; website change is downstream only | English route is mistaken for translated normative content | Translate/review in `spec`; keep website as renderer |
| P2 — Decide whether validated-child sync covers every submodule | Decision / orchestration policy | `relgeo/workspace` maintainer + child CI owners | Event contracts and maintainer decision; no implementation task depends on it | Broad workflow allowlist adds operational complexity or provenance noise | Record decision; expand allowlist only after a tested event contract |

### Independence rule

The execution lanes are deliberately separate:

- renderer escaping, Markdown fallback, core error mapping, CLI validation,
  language-service docs/API, and spec labeling can begin in their owning
  repositories without Node 24, public registry, Flutter hosts, or MCP SDK
  access;
- baseline synchronization and Node 24 integration are evidence prerequisites
  for release/public claims, not prerequisites for those independent fixes;
- Playground/Pages current evidence depends on synchronized pointers and a
  runnable browser/build host, but does not block core or renderer
  implementation;
- Flutter host/AT/distribution evidence remains deferred/host-gated and does
  not block TypeScript contract or package work;
- MCP adapter work depends on its own contract/security/runtime decisions, not
  on completing unrelated Playground or Flutter UI work, except where the
  selected host bridge is explicitly part of the adapter acceptance.

## Roadmap by execution wave

The waves express dependency order, not a requirement to finish every row in a
wave before starting independent work. A wave can contain parallel lanes when
its listed prerequisite is satisfied.

| Wave | Scope and owner | Entry dependency | Exit evidence / decision |
|---|---|---|---|
| **A — independent implementation hardening** | `renderer-svg` escaping, `remark-relgeo-hl` fallback, core error map, CLI format/output behavior, language-service API/docs, and spec index labeling | Existing source/test boundaries; no external host required | Child tests and focused regression fixtures pass; matrix rows update from confirmed mismatch to the resulting status. |
| **B — provenance and canonical evidence** | Workspace baseline synchronization and Node 24 integration/public/CI sequence; `relgeo/workspace` owns orchestration, child owners validate SHAs | Exact child CI SHAs, reviewed gitlinks, Node 24/pnpm 10.33.3, network/registry access | Strict baseline, local integration, public package, and current CI reports identify the same root revision. |
| **C — contract and promotion decisions** | Spec drift check, evaluator/unit candidate decision, bounded geometry expansion policy, and MCP semantic-tool contract; respective spec/core/geometry/MCP owners | Wave A contract fixes; for promotion, fixture and semantic evidence; for MCP, semantic DTO/security and host verification | Decision records, fixture status, generated/drift report, semantic adapter fixtures, desktop/package smoke, and matrix status change together. |
| **D — consumer and public evidence** | Playground/Pages artifact, browser E2E, current public smoke, Flutter host/keyboard/AT evidence; Playground, website, Flutter, and QA owners | Wave B provenance and runnable browser/desktop/AT hosts | Combined artifact assertion, current browser/public smoke, and host evidence are recorded for the same revision. |
| **E — held/optional expansion** | English translation, broad geometry queries/precision, all-submodule sync policy, mobile/physical-device validation | Explicit maintainer/product decision and named consumer value | Scope decision exists before implementation or external-host work is scheduled; held items do not block Waves A–D. |

## Dependency ordering

```text
P0 provenance sync
  └─> P0 Node 24 local/public/CI gate
        ├─> P1 current Playground + Pages artifact evidence
        └─> P1 release/public claim refresh

P0 renderer escaping ──> shared SVG/Markdown/CLI/Playground conformance
P0 core error map ────> language-service diagnostics ──> CLI/Markdown explanations
P1 spec drift check ──> language-service/schema + active fixture expansion
P1 evaluator decision ─> Flutter promotion and broader semantic parity claims
MCP local adapter/spec search ──> Desktop write round-trip + packaged host smoke ──> Agent/Desktop delivery gate
```

The branches marked P0 renderer and P0 core error map are independent of the
environment-blocked integration gate and can proceed in their owning child
repositories. They must not be made dependent on a failed reference or remote
run; the gate is needed to validate the assembled result, not to justify the
target implementation.

## Deliberate non-goals and held work

- General constraint solving remains outside the current DSL contract.
- Raw byte-for-byte Flutter SVG parity is not required; semantic geometry is
  the active parity boundary.
- Mobile physical runtime, native assistive technology, desktop signing, and
  public Dart package publication remain explicitly deferred or outside scope.
- Website is not the normative language source; `spec/id/` remains authoritative.
- MCP delivery remains a separate protocol/host branch. Its root pointer affects
  baseline provenance, while semantic-tool coverage and cross-host/packaged verification require their
  own contract, security, and consumer evidence.

## Review checkpoints

1. After P0 provenance sync: strict baseline must pass and all current pointers
   must be named by the new baseline.
2. After P0 implementation fixes: child tests and shared fixtures must pass;
   no source claim should be promoted solely from a README or API name.
3. Before public/release claims: Node 24 local and public gates, combined Pages
   artifact assertion, and current public smoke must be recorded for the same
   root revision.
4. Before candidate promotion: decision record, active fixture status, and
   downstream matrices must change together.
