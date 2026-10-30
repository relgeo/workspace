# Markdown Surfaces Status Matrix

> **Coverage statement — 2026-10-30.** This is the capability-first downstream
> view of all 38 expected Markdown plugin capabilities. Rows and statuses come
> from the [expected-versus-observed reconciliation](./reconciliation.md);
> discovery detail remains in the [implementation audit](./implementation-audit.md).
> This matrix does not replace the expected catalog, audit, reconciliation, or
> implementation backlog.

Owner surface: `remark-relgeo` + `remark-relgeo-hl` and the official website consumer
Compatibility line: RelGeo DSL `0.5.x` / package line `0.5.0`
Policy evidence: [maturation master plan](../../MATURATION-MASTER-PLAN.md) · [compatibility matrix](../../compatibility-matrix.json)

## Status and evidence legend

| Status | Meaning |
| --- | --- |
| `✔️` | Implemented on the audited boundary with direct evidence. |
| `🌗` | Partial implementation, contract, consumer coverage, or local evidence. |
| `❌` | Expected capability absent on the stated implementation boundary. |
| `➖` | Not applicable to the current plugin boundary by an explicit scope decision. |
| `⏸️` | Deferred or held by an explicit roadmap/dependency decision. |
| `⚠️` | Confirmed broken behavior or contract mismatch. |
| Evidence note | Unverified external boundary is recorded in the separate evidence column; it is not an implementation status. |

Evidence is a separate axis. `verified-local` means direct package, fixture, or
consumer checks ran; `partial-local` means only part of the expected contract
was exercised; `unverified-external` means registry, generic-host, or deployed
evidence was not run; `deferred-external` is reserved for accepted physical
accessibility validation. Editing this matrix never closes an implementation gap.

## Capability-first matrix

| ID / capability | Status | Evidence | Gap / limitation | Owner | Dependency | Risk | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `MD-FENCE-001` Recognize RelGeo fences and aliases | 🌗 | partial-local | `relgeo` and `rg` are split between packages; no shared alias contract | both plugins | naming policy; spec terminology | P1 fences render as plain text or wrong surface | Decide exact alias set and add matrix test |
| `MD-FENCE-002` Preserve source, whitespace, metadata, and boundaries | 🌗 | partial-local | Full remark/rehype source-preservation path is not directly tested | both plugins | unified mdast/hast contract | P1 source fallback or copy behavior can drift | Add real pipeline fixtures for metadata and whitespace |
| `MD-FENCE-003` Handle mixed/multiple blocks deterministically | 🌗 | partial-local | No dedicated multi-block ordering/isolation test | both plugins | visitor isolation; deterministic build | P1 one block can affect another | Add mixed-language and repeated-block fixtures |
| `MD-PREVIEW-001` Render valid fences as previews | ✔️ | verified-local | Only current mdast/HTML consumer path is directly exercised | remark-relgeo | core; renderer-SVG | P1 host-specific integration drift | Add one generic host smoke fixture |
| `MD-PREVIEW-002` Default model preview with explicit sheet/view path | 🌗 | partial-local | Profile/sheet/unit pass through; view selection and full presentation contract are absent | remark-relgeo | presentation spec; renderer sheet API | P1 output may not match author-selected view | Define supported preview options and tests |
| `MD-PREVIEW-003` Reuse canonical semantics | ✔️ | verified-local | Cross-version/registry parity is not independently verified | core + renderer-SVG boundary | compileRelGeo; renderToSVG | P1 Markdown can diverge from CLI/Playground | Add cross-consumer parity fixture |
| `MD-PREVIEW-004` Preserve surrounding Markdown structure | 🌗 | verified-local | Official site leaves `pre > div` around preview output | remark-relgeo + website | rehype unwrap contract | P1 invalid/undesirable structure and a11y impact | Align wrapper class/rehype unwrapping and assert HTML |
| `MD-HL-001` Highlight RelGeo source | ✔️ | verified-local | Token completeness follows language-service coverage | remark-relgeo-hl | language-service token API | P1 vocabulary drift | Keep token fixtures tied to spec vocabulary |
| `MD-HL-002` Preserve readable invalid source without crash | ⚠️ | verified-local | Injected language-service throw aborts transform; fallback promise is broken | remark-relgeo-hl | service error handling | P0 docs build can fail on service failure | Add catch, source-preserving fallback, and failure test |
| `MD-HL-003` Stable token classes, whitespace, and line breaks | ✔️ | verified-local | Class/token rename compatibility is not versioned | remark-relgeo-hl + website CSS | token DTO; CSS contract | P1 styling/copy regressions | Add output snapshot and class compatibility policy |
| `MD-HL-004` Isolate highlighting from semantic resolution | 🌗 | partial-local | Service failure is not isolated; no independent fallback mode | remark-relgeo-hl + language-service | lexical contract; tolerant tokenization | P1 invalid source loses highlighting/build stability | Define bounded lexical fallback and test it |
| `MD-DIAG-001` Structured diagnostic code/severity/location | ❌ | verified-local | Neither plugin emits a structured diagnostic envelope | plugin + spec/core | error model; block context DTO | P1 failures cannot be traced/actioned | Define block-scoped diagnostic DTO and serialization tests |
| `MD-DIAG-002` Actionable diagnostics with readable fallback | 🌗 | partial-local | Preview text is plain; highlighter failure aborts | remark-relgeo + website | diagnostic DTO; host presentation | P1 reader/build owner lacks recovery context | Add structured fallback payload and host assertion |
| `MD-DIAG-003` Preserve valid preview with non-fatal diagnostics | ❌ | verified-local | No path returns preview plus runtime diagnostic | remark-relgeo + core | runtime diagnostic API | P1 useful preview disappears on warning | Define tolerant runtime result and fixture |
| `MD-DIAG-004` Separate tolerant and strict policy | ❌ | verified-local | No policy option or documented default exists | remark-relgeo | error policy; build gate | P1 build behavior is implicit | Add explicit policy option and strict/tolerant tests |
| `MD-OPT-001` Document option schema/defaults/immutability | 🌗 | partial-local | Options exist but invalid/unknown values are not diagnosed exhaustively | each package | public API docs; compatibility policy | P1 integrators rely on undocumented behavior | Publish option table and invalid-option tests |
| `MD-OPT-002` Pass version/profile/view/sheet selection | 🌗 | partial-local | No plugin version/view option; future version becomes generic placeholder | remark-relgeo | spec version; presentation APIs | P1 wrong preset or unclear migration path | Decide supported option surface and test unsupported versions |
| `MD-OPT-003` Configure controlled output and classes | 🌗 | partial-local | No asset/base strategy; custom SVG hook is trusted | both plugins | asset policy; sanitizer boundary | P1 unsafe or non-portable output | Define safe output hook and asset policy |
| `MD-OPT-004` Configure diagnostic/fallback policy | ❌ | verified-local | Caller cannot select fallback versus hard failure | remark-relgeo | diagnostic policy; build owner | P1 CI and docs behavior cannot be chosen | Implement explicit fallback policy option |
| `MD-SSR-001` SSR/static-safe execution | 🌗 | partial-local; generic host unverified | Astro static build passes; generic unified/SSR hosts were not run | both plugins | Node runtime; unified ordering | P1 alternate host fails unexpectedly | Add standalone SSR and non-Astro fixture |
| `MD-SSR-002` Deterministic output | ✔️ | verified-local | All options/hosts are not covered | both plugins | canonical fixtures; stable renderer | P1 cache/snapshot drift | Extend determinism fixture across options |
| `MD-SSR-003` Documented unified ordering contract | 🌗 | unverified-external | Astro ordering works; standalone pipeline contract was not run | package + website | remark-rehype ordering | P1 consumers place plugins incorrectly | Run generic pipeline smoke and document order |
| `MD-SSR-004` Reproducible package exports/types | 🌗 | unverified-external | Local ESM/CJS/types build passes; fresh registry consumer not verified | both package owners | pack/install; release metadata | P0 published consumer cannot install/use API | Run clean pack/install temporary consumer |
| `MD-ASSET-001` Deterministic inline/asset URL policy | 🌗 | verified-local | Fixed data URI is not configurable for alternate asset strategies | remark-relgeo + website | Pages base/asset policy | P1 large or alternate-host output is inflexible | Decide inline versus configurable asset contract |
| `MD-ASSET-002` No implicit filesystem/network dependency | ✔️ | verified-local | Caller custom hook remains explicit trust boundary | both plugins | caller hook contract | P1 hidden build nondeterminism if boundary expands | Keep default path pure and add regression assertion |
| `MD-ASSET-003` Safe escaping/sanitization | 🌗 | partial-local | Normal AST path escapes; custom raw SVG has no sanitizer/URL policy | both plugins + host | renderer output; sanitizer policy | P0 untrusted custom output can inject markup | Define trusted-hook boundary or sanitize output |
| `MD-A11Y-001` Accessible preview naming/wrapper | 🌗 | partial-local | Alt exists; no SVG title/desc/figure semantics and wrapper is not clean | remark-relgeo + website | renderer metadata; HTML contract | P1 assistive technology lacks context | Define accessible wrapper and assert generated semantics |
| `MD-A11Y-002` Accessible source/error/fallback | 🌗 | partial-local; physical AT deferred | Visible fallback and CSS checks exist; no full non-color/ARIA contract | both plugins + website | token semantics; AT validation | P1 errors/tokens may rely on color or untested semantics | Add semantic markup assertions; schedule physical AT |
| `MD-A11Y-003` No focus trap in static embed | ➖ | not-applicable | Current output has no controls or focus management | website/host if controls appear | separate interactive-host scope | P2 future controls may inherit no contract | Keep out of plugin backlog; scope future controls separately |
| `MD-ERR-001` Contextual malformed/unsupported handling | 🌗 | verified-local | Preview catches; highlighter service failure and block location context are missing | both plugins | error model; source locations | P0 one failure can break docs build | Implement shared contextual failure boundary |
| `MD-ERR-002` Active/legacy/future version policy | 🌗 | verified-local | Message is visible but no stable plugin diagnostic category/code | remark-relgeo + spec/core | compatibility matrix; error codes | P1 migration/build messaging drifts | Map version errors to stable projection |
| `MD-ERR-003` Safe runtime/render failure mapping | 🌗 | partial-local | Placeholder is safe; errors untyped, raw hook trusted, non-fatal mapping absent | remark-relgeo + core/renderer | runtime diagnostics; sanitizer | P1 failures lose actionable context | Add typed failure projection and safety tests |
| `MD-WEB-001` Website consumes correct Markdown surfaces | ✔️ | verified-local | Official Astro consumer passes; other hosts not verified | website + package owners | Astro integration; docs routes | P1 generic host guidance may diverge | Keep example pipeline and add alternate-host note |
| `MD-WEB-002` Pages artifact carries tested output | ✔️ | verified-local | Local artifact assertions pass; deployed smoke not current | website/delivery | build assembly; artifact assertions | P1 public artifact can diverge from local | Run fresh deployed smoke when URL is available |
| `MD-WEB-003` Explicit provenance/version in content | 🌗 | partial-local | Normative separation and 0.5 line exist; clean registry parity/provenance field absent | website + spec/package owners | compatibility metadata; release process | P1 site can overclaim package state | Add provenance/version assertion to content build |
| `MD-WEB-004` Localized/public technical readability | 🌗 | partial-local; public/physical deferred | EN/ID/local CSS passes; deployed/mobile/AT evidence absent | website owner | route/base; accessibility QA | P1 public readers see route or readability regressions | Run public smoke and scheduled mobile/AT checks |
| `MD-REL-001` Independent package API/docs | 🌗 | partial-local | Metadata/README/exports exist; docs omit full options/errors and highlighter test depth is low | each package owner | release docs; clean consumer | P1 adopters follow incomplete contract | Complete public API docs and package smoke |
| `MD-REL-002` Compatibility-line/release-order conformance | 🌗 | unverified-external | Metadata/matrix declare 0.5.0 and order; registry parity not verified | release/package owners | registry; synchronized release metadata | P0 published packages can drift | Run clean registry/install parity check |

## Summary and handoff

| Matrix state | Count | Interpretation |
| --- | ---: | --- |
| `✔️` | 8 | Implemented on the audited boundary. |
| `🌗` | 24 | Partial implementation or contract/evidence coverage. |
| `⚠️` | 1 | Confirmed highlighter fallback defect. |
| `❌` | 4 | Structured diagnostics/runtime policy capabilities absent. |
| `➖` | 1 | Static embed has no plugin-owned interaction controls. |
| `⏸️` | 0 | No expected row is currently held by a scope decision. |
| Evidence-only partial rows | 2 | `MD-SSR-003` and `MD-REL-002` remain `unverified-external` in the separate evidence column. |

The [implementation-gap backlog](./implementation-gap-backlog.md)
contains one candidate task for each implementation gap among the `🌗`, `❌`,
and `⚠️` rows. The two `🌗` rows whose remaining issue is external evidence
only have separate verification follow-ups. Updating this matrix or backlog is
documentation only and does not count as implementation.

## Linked artifacts

- [Expected capability catalog](./expected-capability-catalog.md)
- [Implementation audit](./implementation-audit.md)
- [Expected-versus-observed reconciliation](./reconciliation.md)
- [Implementation-gap backlog](./implementation-gap-backlog.md)
- [Historical capability matrix](./capability-matrix.md)
- [Maturation master plan](../../MATURATION-MASTER-PLAN.md)
- [Compatibility matrix](../../compatibility-matrix.json)
