# RelGeo language-service implementation audit

> **Audit coverage statement — 2026-10-29.** This evidence log inspects
> language-service source/tests, schema/completion/token data, core integration,
> Playground wiring, package metadata, and shared fixtures. It does not claim
> complete normative vocabulary or editor-host parity; current CI/canonical,
> registry/public, and fresh browser/AT checks remain `not verified` where
> stated. See [inventory protocol](../../INVENTORY-PROTOCOL.md).

Status dokumen: audit baseline, 2026-10-29  
Surface: `language-service/`  
Owner: `relgeo/language-service`  
Package: `@relgeo/language-service@0.5.1`  
Required evidence: `language-service/`, `core/`, `docs/`, `playground/`

## Scope, source, ownership, and limits

The audit covers the shipped TypeScript library boundary: diagnostics,
completion catalogs/context handling, schema export, semantic tokenization,
hover, package metadata, and current Playground wiring. It does not treat the
normative spec as owned by this package; `spec/id/` remains the authority and
`core/` owns parser/validator/resolver behavior.

| Boundary | Owner | Source path | Evidence checked | Verification limit |
| --- | --- | --- | --- | --- |
| Public library API | `relgeo/language-service` | `src/index.ts`, `src/service.ts`, `package.json` | exports, package version, build/test/lint | Fresh registry install not rerun |
| Schema and vocabulary | language-service consumer view | `src/schema.ts`, `src/completions.ts`, `src/tokens.ts` | active version enum, object/field/function/token catalogs | No generated drift checker against every spec/core rule |
| Diagnostics | language-service + `@relgeo/core` | `src/service.ts:123-207`, core parser/validator | error code/path/range mapping and invalid fixture behavior | Runtime post-resolve violations are not returned by `getDiagnostics` |
| Playground editor | `relgeo/playground` | `playground/src/components/Editor.tsx` | CodeMirror linter/completion/hover wiring | Browser smoke/current deployment not run in this audit |
| Shared fixtures | `relgeo/workspace` | `fixtures/manifest.json`, `scripts/run-conformance-fixtures.mjs` | invalid/runtime/active language-service assertions | Declared fixture set is not exhaustive package coverage |
| Documentation/release metadata | workspace + package owner | `docs/REPOSITORY-MAP.md`, `docs/compatibility-matrix.json`, `language-service/README.md` | ownership, version policy, API docs | Historical plan claims are not treated as fresh execution evidence |

## Implementation findings

### Diagnostics

`RelGeoLanguageService.getDiagnostics` parses in `validate` mode, constructs a
core `Validator`, maps the first thrown parser/validation error to a line range,
and returns a `vscode-languageserver-types` diagnostic. It preserves `code` and
uses `relgeo` or `relgeo-parser` as source. This is directly exercised by tests
for syntax errors, missing required fields, invalid expressions, hyphenated IDs,
quoted IDs, and shared invalid fixtures.

The method does not call `resolveGeometry`, so a valid document that later
produces a post-resolve constraint violation is intentionally accepted by this
API. The shared runtime-diagnostic fixture confirms that behavior. The
Playground receives resolved violations separately through its worker result and
inspector. Whether runtime violations should also be editor diagnostics is an
open contract choice, not an inferred implementation failure.

### Schema, completion, tokens, and hover

`RELGEO_SCHEMA` is exported as a JSON-like constant and tests pin active/legacy
version enum values, object metadata, sheet placement exclusivity, repeat
fields, and split fields. Completion catalogs cover root keys, object types,
anchors, placement, metadata, path/boolean/repeat/component/sheet contexts,
geometry/math/collection functions, and intersection selectors. The service
uses source scanning and indentation/context heuristics; it deliberately
returns no object-ID suggestions at the object-ID level.

Tokenization exposes RelGeo-specific line/token kinds used by the highlighting
plugin and shared runner. Hover exists and is wired into Playground, but no
language-service test directly covers it. The README documents a `getSchema()`
method that the class does not implement; consumers must currently import the
`RELGEO_SCHEMA` export. This is a confirmed documentation/API mismatch.

### Playground consumer

`Editor.tsx` instantiates the service and maps diagnostics into CodeMirror lint
entries, completions into CodeMirror options, and hover markdown into a tooltip.
This proves source-level integration. It does not prove a fresh browser bundle,
published package install, or current deployed Playground behavior.

### Version and documentation provenance

The package and compatibility matrix are at `0.5.1`, while the package README
still states `0.5.0`. The mismatch is confirmed by direct source inspection;
historical release documents explain that `core` and language-service moved to
`0.5.1`, but are not substitutes for updating the stale README line.

## Verification executed

| Command | Result | Meaning |
| --- | --- | --- |
| `pnpm --filter @relgeo/language-service test` | PASS — 1 file, 66 tests | Schema, catalogs, tokens, completions, and diagnostics pass |
| `pnpm --filter @relgeo/language-service lint` | PASS | TypeScript source type-checks |
| `pnpm --filter @relgeo/language-service build` | PASS | ESM/CJS and declaration artifacts build |
| `pnpm run conformance:fixtures` | PASS — 260 checks across 20 fixtures | Invalid diagnostics, active/runtime/candidate consumers and token assertions pass |

All commands emitted the repository Node warning: current Node is `22.23.2`
while metadata requires `>=24`. Node >=24, fresh registry install, current
remote CI, and browser/deployment smoke remain **not verified**.

## Conclusion

Language-service is implemented and consumed as an editor-intelligence library,
with strong direct test evidence for diagnostics, schema, completions, and
semantic tokens. The main confirmed gaps are API/documentation mismatch around
`getSchema()` and stale package version text. Hover is wired but under-tested;
runtime post-resolve violations and official LSP transport remain separate
scope/contract decisions.
