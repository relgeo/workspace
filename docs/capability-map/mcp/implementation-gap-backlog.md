# RelGeo MCP — Residual capability backlog

**Freeze:** 2026-11-12 — [canonical freeze/disposition record](./freeze-2026-11-12.md)

This backlog is the residual view of the 68-row MCP catalog. It is downstream
of the [status matrix](./status-matrix.md), [reconciliation](./reconciliation.md),
and [implementation evidence register](./implementation-evidence-register.md).
It does not implement or promote a capability. A row appears here because its
remaining boundary needs evidence or an explicit scope decision, not because a
local test failure has been converted into a target defect.

The completed local closures for `DIAG-02` (diagnostic explanation) and
`PROV-03` (proposal provenance chain) remain represented in the row-level
register and matrix; they are not residual backlog items because their named
adapter boundaries are already verified-local.

## Current disposition

| Lane | IDs | Count | Meaning |
| --- | --- | ---: | --- |
| Verified local boundary | All `✔️` rows in the matrix | 60 | Direct source/test/local-host evidence for the named boundary only. |
| Cross-host evidence-bound residual | `VAL-03` | 1 | Local deterministic evidence exists; closure requires the named cross-host/transport boundary. |
| Environment-deferred residual | `VAL-03`, `TRAN-03`, `DEL-03`, `DEL-04`, `DEL-05`, `DEL-06` | 6 | Local contract evidence exists; the named cross-host, standalone, client, packaged, release, or live setup boundary is unavailable and has explicit remediation. |
| Scope-deferred | `WF-02`, `DEL-01` | 2 | Requires a product/roadmap decision; not an implementation failure. |
| Absent or confirmed defect | none | 0 | No row is cosmetically reclassified as absent or defective. |

## Evidence-bound residuals

Each residual row has one owner, one evidence boundary, and one next action.
The `status / evidence` values are copied from the synchronized matrix and
reconciliation; they are not inferred from backlog priority.

| Priority | ID | Status / evidence | Owner | Boundary still open | Required next action | Promotion evidence |
| --- | --- | --- | --- | --- | --- | --- |
| P1 | `VAL-03` | `⏸️ / environment-unavailable-deferred` | MCP + core maintainers | Cross-host/transport deterministic parity | Run the same diagnostic-order fixture on each available host/transport when available. | Exact fixture output at each host/transport; no cross-host claim before that boundary. |
| P1 | `TRAN-03` | `⏸️ / environment-unavailable-deferred` | MCP transport owner | Callable standalone RelGeo stdio executable | Resolve the standalone decision; if accepted, add the entrypoint and run stdio conformance. | Executable invocation and conformance output at the standalone boundary. |
| P1 | `DEL-03` | `⏸️ / environment-unavailable-deferred` | MCP transport/conformance owner | External client/Inspector interoperability | Run initialize, protocol negotiation, tools/resources, invalid request, and bind/security checks with an available client. | Client/Inspector transcript tied to the frozen revisions. |
| P1 | `DEL-04` | `⏸️ / environment-unavailable-deferred` | Flutter/workspace delivery owner | Packaged desktop MCP runtime | Launch an actual supported artifact; record start, authenticated call, permission/security, and clean stop. | Packaged artifact smoke record tied to artifact and revisions. |
| P1 | `DEL-05` | `⏸️ / environment-unavailable-deferred` | Workspace release owner | Complete MCP release provenance | Join root/MCP/Flutter/spec revisions, artifact, OS/architecture, run, date, and checksums. | Canonical release provenance record; supporting manual evidence stays non-canonical. |
| P1 | `DEL-06` | `⏸️ / environment-unavailable-deferred` | Flutter host + MCP docs owner | Live setup/operations/client flow | Smoke endpoint, token, permission, and limitation disclosure with a compatible client. | Setup transcript and client result at the target boundary. |

## Scope-deferred rows

| ID | Status / evidence | Decision owner | Decision required | Handling while deferred |
| --- | --- | --- | --- | --- |
| `WF-02` | `⏸️ / verified-scope` | MCP workflow/product owner | Approve the author/debug/explain/review prompt contract. | Keep prompt layer out of the normative rule store and do not block other rows. |
| `DEL-01` | `⏸️ / verified-scope` | MCP package/workspace owner | Decide whether standalone package/executable delivery is required. | Do not claim standalone delivery; `TRAN-03` remains evidence-bound. |

## Boundary rules

- `verified-local` proves only the exact repository source, fixture, or local
  consumer boundary named in the evidence register.
- `not-verified` and `environment-unavailable` are evidence states, not
  implementation successes or target defects.
- A managed Codex App Server socket denial is not evidence that the user's
  local host or target runtime is unavailable. Re-run only in a boundary that
  actually provides the missing socket/client/packaged host.
- Supporting maintainer-terminal evidence may be linked to a revision and
  artifact, but must remain marked `canonicalCiEvidence=false` and cannot
  promote managed-sandbox, CI, packaged-runtime, or interoperability claims.
- The expected catalog remains immutable for this freeze: every residual ID
  remains present exactly once in catalog, reconciliation, matrix, and register.

## Reconciliation checks

| Check | Frozen result |
| --- | --- |
| Catalog IDs | 68 unique expected IDs |
| Reconciliation IDs | 68 unique; exact catalog join |
| Status matrix IDs | 68 unique; exact catalog join |
| Evidence register IDs | 68 unique; exact catalog join |
| Cross-host evidence-bound IDs | 1, with one owner and one remediation |
| Environment-deferred IDs | 6, each with one owner and one remediation |
| Scope-deferred IDs | 2, explicitly recorded as `verified-scope` |
| Cosmetic status changes | 0 |

The implementation audit remains the source for detailed observations. This
backlog is the action/disposition surface, not a replacement for command
output or native SuClos validation records.
