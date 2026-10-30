# Geometry implementation audit

This is the canonical audit entry point for the Geometry surface.

The dated evidence log retained from the previous flat layout is
[archive/implementation-audit-legacy.md](./archive/implementation-audit-legacy.md).
The current expected-versus-observed result is maintained in
[reconciliation.md](./reconciliation.md), while the maintainer-facing status
view is [status-matrix.md](./status-matrix.md). The archived log is historical
evidence and must not be read as proof of current CI, registry, deployment, or
runtime status. The bounded implementation selection derived from this audit is
recorded in the [implementation-gap backlog](./implementation-gap-backlog.md#active-bounded-selection--task-select-and-bound-in-scope-capability-debt--1180446927);
selection is not implementation evidence.

## Current audit run — 2026-10-30

This refresh audits the expected catalog against the package boundary and the
available workspace evidence. It does not treat a missing search hit as proof
of absence: status decisions below use executable package tests, source-level
behavior, fixture manifest status, and the ownership/reconciliation records.
The expected catalog status column is synchronized to this audit run: 40 IDs,
10 `✔️`, 30 `🌗`, and 0 `❌`; `not-verified` remains an evidence qualifier.

### Direct package evidence

| Check | Result | Evidence qualification |
| --- | --- | --- |
| `pnpm test` from `geometry/` | PASS — 5 files, 75 tests | Fresh local package behavior; covers intersections, selectors, curve sampling, path modifiers, split, transforms, bbox utilities, and closed-shape normalization. |
| `pnpm lint` from `geometry/` | PASS | Fresh TypeScript static check. |
| `pnpm run build` from `geometry/` | PASS | Fresh TypeScript/tsup package build; no registry or publish claim. |
| `pnpm --filter @relgeo/core test` | PASS — 45 files, 430 tests | Fresh local consumer integration in the current working tree; not a canonical Node-24 run. |
| `pnpm --filter @relgeo/renderer-svg test` | PASS — 6 files, 82 tests | Fresh local renderer integration in the current working tree; browser visual parity remains unverified. |
| `pnpm conformance:fixtures` | PASS — 260/260 across 20 fixtures | Fresh workspace fixture/conformance evidence; active/candidate/error status remains governed by `fixtures/manifest.json`. |
| Package metadata | `@relgeo/geometry@0.5.0`, DSL compatibility line `0.5` | `geometry/package.json`, `geometry/README.md`, and compatibility metadata agree locally. |
| Fixture manifest | 0.5 active fixtures include 10 and 15; 16 is `capability`; 19/20 are runtime-error fixtures | Manifest/expected-artifact review only in this refresh; fixture status is not inferred from package tests. |
| Runtime/platform evidence | Node `v22.23.2`; Node `>=24`, Flutter host, registry, remote CI, browser visual runtime, and cross-platform replay not rerun | `not-verified`, not a target failure and not a reason to relabel a capability `❌`. |

### Status decisions for the active bounded selection

| Capability/finding | Status | Observed implementation/evidence | Remaining boundary or limitation |
| --- | --- | --- | --- |
| `FIX-GEO-PROVENANCE-001` | `✔️` | `geometry/src/intersection.ts` now uses the RelGeo DSL `0.5` compatibility wording, and the unsupported-pair regression test asserts that stale `v0.3` text is absent. | Package-local fix is evidenced; consumer error-message refresh is outside this low-level task. |
| `GEO-QUERY-004` / `GAP-GEO-QUERY-004` | `🌗` | `computeIntersections` has analytic line/circle/arc pairs, path-like dispatch, deterministic sort/deduplication, and selectors; `intersection.test.ts` exercises selector errors, dispatch, ordering, and unsupported types. | Quadratic/cubic and some mixed path-like pairs use sampling; no complete DSL query or cross-consumer pair contract is proven. |
| `GEO-NUM-001` / `GAP-GEO-NUM-001` | `🌗` | Tolerances are implemented in intersection, split, path modifiers, and normalization; tests use tolerant assertions and boundary cases. | Constants are implementation details; no complete public numeric error-bound policy exists. |
| `GEO-NUM-002` / `GAP-GEO-NUM-002` | `🌗` | `normalizeClosedShape` handles rect/circle/polygon/path/boolean inputs, removes near-duplicate/closing points, preserves holes, and applies clone transforms. | No evidence of canonical winding reversal/even-odd normalization across all operations; boolean expansion remains bounded by decision 08. |
| `GEO-NUM-003` / `GAP-GEO-NUM-003` | `🌗` | `GeometryError` and tests cover corner, offset, self-intersection, split, closed-shape, selector, and unsupported-pair failures. | Package error codes are now stable, but the complete cross-consumer diagnostic catalog and document-path mapping remain unfinished. |

### Boundary findings retained from the full catalog audit

- `GEO-BOOLEAN-001/002` remain `🌗`; broader union/xor/non-rectangle topology
  is a separate `⏸️` promotion finding, not active implementation evidence.
- Core-owned queries, collections, placement, constraints, and resolver
  semantics remain consumer ownership boundaries; geometry package types or
  helpers do not prove a complete DSL implementation.
- Fixture 15 is the active bounded boolean/intersection evidence. Fixture 16
  remains a capability candidate, and Flutter/registry/Node-24/remote-CI
  evidence remains `not-verified`.
- The expected catalog still has 40 IDs joined one-to-one by reconciliation;
  the status matrix remains 10 `✔️`, 30 `🌗`, and 0 `❌` rows. `➖` and
  `⏸️` findings remain outside the row join; the selected provenance finding is
  now locally resolved and is no longer an open `⚠️` defect.
