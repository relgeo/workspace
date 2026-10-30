# RelGeo capability inventory protocol

Status: protocol for the 2026-10-29 baseline audit  
Owner: `relgeo/workspace`  
Applies to: every capability matrix and implementation audit in this directory

## Purpose and completeness rule

Capability maps are evidence-backed inventories, not a list of features that
happened to be documented previously. The older matrices, plans, README files,
and public claims are historical inputs to discovery; they are not the final
scope and they cannot prove that an undocumented capability is absent.

An inventory is complete only relative to the discovery boundary stated in its
coverage statement. A missing row means “not discovered or not yet assessed”,
unless the matrix records an explicit expected-but-missing claim with its
expectation source. Every matrix and audit must therefore state:

1. audit date;
2. surface and ownership boundary;
3. discovery method and minimum sources inspected;
4. what the rows cover and what they intentionally do not cover; and
5. sources or environments that remain `not verified`.

The protocol is a reporting rule. It does not replace a component's source of
truth, API contract, release policy, or human promotion decision.

## Audit scope and minimum discovery checklist

The following surfaces are in scope for the baseline inventory. For each row,
inspect all applicable source, tests/fixtures, consumer, workflow, and delivery
evidence before assigning an implementation status.

| Surface | Minimum discovery sources | Required boundary questions |
| --- | --- | --- |
| Spec | `spec/id/README.md`, normative chapters under `spec/id/core/`, `syntax/`, `geometry/`, `presentation/`, appendix, `spec/en/` | What is normative, what is informative, what is the active compatibility line, and which consumer behavior is actually mapped? |
| Geometry | `geometry/src/`, package manifest/README, unit tests, geometry consumers in `core/` and `renderer-svg/`, shared fixtures | Which primitives, curves, intersections, transforms, boolean operations, tolerances, and errors are implemented and consumed? |
| Core runtime | `core/src/`, package manifest/README, unit/integration tests, resolver/graph/evaluator diagnostics, shared fixtures and build scripts | Which parse, validate, resolve, graph, evaluator, units, and error behaviors are active versus candidate or under-covered? |
| Renderer-SVG | `renderer-svg/src/`, package manifest/README, renderer tests, SVG fixtures/security tests, core/CLI/Markdown/Playground consumers | Which scene objects, presentation semantics, sheets, escaping, metadata, and browser insertion paths are verified? |
| Language service | `language-service/src/`, tests, schema/completion/token data, core integration, Playground wiring, package/build workflows | Which diagnostics, schema, tokens, completion, hover, and version vocabulary are real, and where is parity only inferred? |
| CLI | `cli/src/`, `bin/`, package/README/docs, CLI tests, shared conformance runner, package/build/release scripts | Which commands, formats, exit/error behavior, filesystem behavior, and package boundaries are proven? |
| Markdown plugins | `remark-relgeo/`, `remark-relgeo-hl/`, tests, package manifests, language-service/core/spec inputs, website/Astro integration | Which preview/embed and highlighting paths are implemented, and which DSL features are intentionally outside plugin scope? |
| Playground | `playground/src/`, tests/E2E, UX/accessibility audit, worker/persistence/import/export code, package/build workflow | Which browser editor, rendering, diagnostics, persistence, recovery, accessibility, and artifact paths are verified? |
| Website/Pages | website source/content/templates, Astro config, Markdown integration, spec ingestion, Pages workflow, artifact assertions, public smoke scripts | What is presentation versus normative ownership, and which local build, assembled artifact, CI, and public deployment claims are current? |
| Flutter | `flutter/lib/`, `flutter/test/`, fixtures, platform adapters, document/editor/workbench/rendering/persistence/accessibility/release workflows, capability JSON | Is each document lifecycle, editor/workbench, rendering, persistence, platform, accessibility, and delivery capability implemented, partial, held, or not verified? |
| MCP | `mcp/` contract/tools/transport, tests/fixtures, protocol plans, Flutter bridge, CI and SDK/Inspector evidence | What is a pure-Dart contract versus an adapter/host delivery capability, and which transport/security/resource paths are not verified? |
| Cross-repository orchestration | `.gitmodules`, `docs/REPOSITORY-MAP.md`, manifests/baselines, root scripts, workflows, release/integration plans, child CI/public evidence | Which ownership, pointer, fixture, dependency, synchronization, release, and provenance claims are current at the exact revision? |

Minimum discovery categories for every surface are:

- contract and normative intent;
- implementation/source and public API;
- tests, fixtures, snapshots, and negative cases;
- UI, command, worker, host, or consumer wiring;
- platform, persistence, accessibility, security, and runtime boundaries where relevant;
- build, CI/canonical, package, release, deployment, and public artifact evidence; and
- provenance, ownership, synchronization, and cross-repository orchestration.

If a category is not applicable, record `➖`/out of scope and the reason. Do not
silently skip it.

## Capability taxonomy

Rows should use one primary family so that different surfaces can be compared
without making metadata dominate the matrix:

| Family | Includes |
| --- | --- |
| Contract | Normative syntax, schema, compatibility, API, protocol, and error contract |
| Semantic runtime | Parsing, validation, graph, evaluation, units, resolution, diagnostics |
| Geometry/rendering | Primitives, curves, transforms, intersections, boolean results, SVG/visual projection |
| Authoring and UX | Editor, workbench, inspector, commands, completion, hover, interaction, recovery |
| Persistence and interchange | File I/O, import/export, backup, share links, serialization, local storage |
| Integration and protocol | Package consumers, plugins, MCP tools/resources, host bridges, cross-surface wiring |
| Platform and accessibility | Browser/mobile/desktop behavior, keyboard/AT, native lifecycle, security boundary |
| Delivery and operations | Build, CI, registry/package, Pages/public artifact, release gate, provenance |

One capability may have multiple consumers, but it gets one owner boundary and
one primary family. Split a row when implementation, evidence, or parity differs
materially; do not hide those differences in a vague “supported” label.

## Four status axes

The symbol in a matrix is a compact implementation summary only. The other
dimensions must remain explicit in the evidence and limitation text.

For the compact seven-column matrices, the `Owner`/`Source of truth` metadata
near the top applies to every row unless the row's evidence names a different
owner boundary (for example, a CLI row delegating semantics to `core`). The
row still must name its evidence, consumer, gap/dependency, and next action;
the metadata inheritance avoids repeating the same owner string in every row
without hiding ownership transfers.

| Axis | Allowed interpretation | What it answers |
| --- | --- | --- |
| Implementation | `✔️` present; `🌗` partial; `❌` expected and absent at the audited boundary; `⏸️` held; `➖` not applicable/out of scope; `⚠️` confirmed mismatch or defect | Does the capability exist in the inspected implementation boundary? |
| Evidence | `E0` claim/docs only; `E1` source/static; `E2` local test/fixture; `E3` local cross-surface; `E4` CI/canonical; `E5` public/deployed; `not verified` when the relevant check was not run or cannot be reproduced | What directly supports the claim, and where? |
| Parity | `confirmed`, `partial`, `mismatch`, or `not assessed` | Does behavior match the contract, reference, or sibling consumer at the stated boundary? |
| Scope | `in scope`, `boundary only`, `expected-but-missing`, `held`, or `not applicable` | Is this a capability this surface is supposed to provide? |

`⚠️` is reserved for a confirmed mismatch or defect. It is not a substitute
for `not verified`. `❌` requires an expectation source; lack of a row or lack
of a test alone is not evidence of absence.

## Evidence tiers and environment separation

Evidence is append-only by location and revision. A stronger tier does not
retroactively upgrade a weaker tier from another environment.

- **Local**: source inspection, local tests, local fixture/conformance, or a
  locally built artifact at the recorded checkout. Useful for implementation
  evidence; not proof of CI, registry, or public parity.
- **CI/canonical**: a named CI run or canonical toolchain/environment, with
  revision, command, and result. Historical CI is historical, not current.
- **Public**: registry artifact, deployed Pages/host artifact, or public smoke,
  with URL/version/revision and date. A local build never becomes public
  evidence by implication.
- **Historical/expected**: preserved plan, old run, README claim, or roadmap.
  It is context only until reproduced at the current pointer.

Each matrix must keep local, CI/canonical, and public claims in separate rows or
clearly separate evidence clauses. Never write “verified” without naming the
environment and revision. If a required environment is unavailable, write
`not verified` and describe the blocker; do not convert environment absence into
an implementation failure or parity failure.

## Expected-but-missing and held capabilities

Use `expected-but-missing` only when the expectation is traceable to one of:

- a normative spec requirement;
- a documented public/API/protocol contract;
- an acceptance criterion or approved plan;
- a consumer/workflow that explicitly requires the capability; or
- a release/integration gate that names it.

Record the expectation source, audited boundary, and negative evidence. Use
`⏸️` when implementation is deliberately held for a promotion, dependency,
decision, or missing canonical evidence. Use `➖` when the capability is not a
responsibility of the surface. A capability that was not searched is neither
`❌` nor `➖`; it is outside the discovered inventory and must be called out in
the coverage limits.

## Coverage statement template

Place a short statement near the top of every matrix and audit, using this
shape:

> **Coverage statement — YYYY-MM-DD.** This document covers `<surface/boundary>`
> by inspecting `<source + test/fixture + consumer/workflow + delivery sources>`.
> It inventories `<included capability families>` at `<revision/toolchain>`.
> It does not claim coverage of `<explicit exclusions>`; `<CI/canonical/public/
> platform sources>` remain `not verified` where stated. A missing row is not
> evidence that the capability does not exist.

The statement may be shorter when the metadata table already supplies the same
facts, but the date, method, boundary, and unverified limits must remain visible.

## Review checklist

Before treating a matrix as ready for review, confirm:

- all twelve surfaces above are linked from the README and have a matrix/audit pair;
- the surface's minimum discovery sources were inspected or marked unavailable;
- every row has an implementation symbol, evidence location/tier, scope, and limitation;
- parity is not inferred from implementation status alone;
- local, CI/canonical, public, and historical evidence are labeled separately;
- `❌`, `⏸️`, and `➖` each have the correct expectation/decision/boundary reason;
- every matrix and audit has a dated coverage statement; and
- current conclusions do not silently promote stale baseline or public claims.
