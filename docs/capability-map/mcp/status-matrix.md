# RelGeo MCP — Capability-First Status Matrix

**Tanggal:** 2026-10-30  
**Expected baseline:** [catalog](./expected-capability-catalog.md)  
**Join:** [expected-versus-observed reconciliation](./reconciliation.md)  
**Evidence:** [current implementation audit](./implementation-audit.md)
**Gap candidates:** [implementation gap backlog](./implementation-gap-backlog.md)

Matrix ini adalah reporting view ringkas. Katalog expected, audit evidence,
reconciliation, dan backlog tetap artefak terpisah. Row status tidak mengubah
kode, source, atau implementasi; dokumentasi gap juga tidak dihitung sebagai
implementation evidence.

> **Current Plan 14 overlay (2026-10-30):** The historical 68-row counts below
> were generated before full-spec retrieval was implemented. For the current
> checkout, use the [implementation-audit handoff](./implementation-audit.md)
> and [Plan 14 conformance evidence](../../../docs/mcp/03-sdk-conformance-runbook.md).
> They record local supporting evidence for the snapshot, index, adapter,
> Flutter loader, provenance, and deterministic query scenarios. Live
> Inspector/Codex Desktop/loopback HTTP remains `not-verified`; no row here
> promotes that local evidence to canonical CI/public evidence.

## 1. Legend dan coverage

| Status | Makna |
| --- | --- |
| `✔️` | Boundary implementation ditemukan dan evidence cukup untuk outcome yang dinilai. |
| `🌗` | Contract/host/fixture/subset ada, tetapi outcome end-to-end belum lengkap. |
| `❌` | Expected outcome in-scope sudah diperiksa tetapi implementation behavior belum ditemukan. |
| `➖` | Bukan owner boundary; hanya dipakai pada scope findings, bukan untuk menghapus expected row. |
| `⏸️` | Sengaja ditahan oleh roadmap/dependency/keputusan scope. |
| `⚠️` | Defect atau mismatch terkonfirmasi pada artifact yang dinilai. |

| Dimension | Rule |
| --- | --- |
| Evidence | `verified-local` berarti source/test/runtime lokal langsung; `partial-local` berarti hanya sebagian boundary; `verified-absence` berarti boundary sudah dicari; `verified-defect` berarti mismatch terkonfirmasi; `not-verified` berarti environment/adapter belum cukup. |
| Gap | Menjelaskan outcome yang masih hilang atau boundary yang belum tersambung. `none at audited boundary` tidak berarti MCP end-to-end delivered. |
| Owner | Package/host/source-of-truth yang harus mengubah implementation, bukan sekadar penulis dokumentasi. |
| Dependency | Prerequisite nyata untuk task implementasi; tidak mengubah expected scope. |

| Count | Value |
| --- | ---: |
| Expected capability rows | 68 |
| `✔️` | 11 |
| `🌗` | 41 |
| `❌` | 14 |
| `⚠️` | 0 |
| `⏸️` | 2 |
| `➖` expected rows | 0 |

## 2. Capability matrix

| ID | Capability / user outcome | Status | Evidence | Gap | Owner | Dependency | Risk | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `DISC-01` | Intent → syntax discovery | `🌗` | `partial-local` | Contract only; no query/index executor | MCP + `spec/id` | Adapter; spec snapshot | Agent gets no results | Implement bounded index resolver and tool fixture |
| `DISC-02` | Version-aware discovery | `🌗` | `partial-local` | No version resolver or mixed-version rejection | MCP + `spec/id` | Snapshot identity | Wrong-version guidance | Add version filter and negative fixture |
| `REF-01` | Spec index/rule retrieval | `🌗` | `partial-local` | Typed resource read exists; pinned spec content is not packaged | MCP resource layer | Snapshot packaging | Stale/wrong rule | Add canonical snapshot-backed resolver |
| `REF-02` | Directed syntax-rule tool | `🌗` | `partial-local` | DTO/contract without executor | MCP + `spec/id` | Real adapter | Prompt dump or no result | Wire `relgeo_get_syntax_rule` |
| `EX-01` | Example index/retrieval | `🌗` | `partial-local` | No examples resolver/bundle | MCP + examples source | Versioned examples | Explanatory text mistaken as normative | Add bounded examples resolver |
| `EX-02` | Minimal valid example selection | `❌` | `verified-absence` | No ranking, minimal-example policy, or fixture | MCP workflow layer | Tools/resources | Large/irrelevant examples | Add bounded selection fixtures |
| `COMP-01` | Source completion | `🌗` | `partial-local` | No language-service adapter | MCP + language-service | Adapter boundary | No actionable proposal | Map completion service and ranges |
| `COMP-02` | Completion proposal semantics | `🌗` | `partial-local` | No runtime proposal generation/handoff | Language-service + MCP | COMP-01 adapter | Proposal read as mutation | Add proposal mapping fixture |
| `VAL-01` | Structural/schema validation | `🌗` | `partial-local` | DTO exists; parser/validator not invoked | MCP + core | Real adapter | Invalid source accepted | Add schema/validation tool fixture |
| `VAL-02` | Semantic parse/resolve validation | `❌` | `verified-absence` | No MCP parse→validate→resolve path | MCP + core | Real adapter | Unsafe proposal guidance | Connect core pipeline |
| `VAL-03` | Deterministic validation result | `🌗` | `not-verified` | Cross-host MCP evidence unavailable | Core + MCP | Adapter and multi-host fixture | False parity claim | Run deterministic cross-host fixture |
| `DIAG-01` | Structured diagnostics | `🌗` | `partial-local` | No core/language-service mapping | Language-service + MCP | VAL-01 | Lost code/range/origin | Add diagnostic conversion fixture |
| `DIAG-02` | Diagnostic explanation | `❌` | `verified-absence` | No explanation catalog/resolver | MCP + `spec/id` | Versioned catalog | Wrong repair explanation | Implement explanation resource/tool |
| `DIAG-03` | Input/proposal/active source-kind | `🌗` | `partial-local` | DTO only; runtime enforcement absent | MCP + Flutter bridge | Validation adapter | Proposal promoted implicitly | Add source-kind enforcement tests |
| `WF-01` | Discovery→author→validate→render workflow | `❌` | `verified-absence` | No callable composition layer | MCP workflow layer | Tools/resources | Fragmented agent workflow | Add end-to-end workflow fixture |
| `WF-02` | Author/debug/explain/review prompts | `⏸️` | `verified-scope` | Prompt layer roadmap-gated | MCP workflow layer | Stable tools/resources | Prompt becomes hidden authority | Define prompt contract later |
| `RENDER-01` | Source/proposal to SVG in-memory | `🌗` | `partial-local` | No core→renderer executor | MCP + core + renderer | VAL-02 | Misleading/empty output | Add SVG adapter fixture |
| `RENDER-02` | Explicit sheet/view render target | `🌗` | `partial-local` | `sheetId` DTO only; no selector | MCP + renderer | Render adapter | Wrong view rendered | Map bounded sheet selection |
| `RENDER-03` | Structured render failure | `❌` | `verified-absence` | No parse/render error mapping | MCP + core/renderer | Render adapter | Crash or fake SVG | Add invalid-render error fixture |
| `DOC-01` | Active document snapshot | `✔️` | `verified-local` | MCP resource/transport exposure absent | Flutter bridge | Server adapter | Host boundary mistaken for MCP delivery | Reuse bridge in resource adapter |
| `DOC-02` | Active-document resource | `🌗` | `partial-local` | Typed active-document/diagnostics route added; host auth/session wiring absent | MCP + Flutter bridge | Embedded server | Wrong document exposure | Couple route to authenticated host lifecycle |
| `DOC-03` | Identity/revision lifecycle | `✔️` | `verified-local` | No server consumer yet | Flutter session | Adapter | Revision ignored by agent | Feed revision into adapter tests |
| `DOC-04` | Dirty-state visibility | `✔️` | `verified-local` | No MCP status/context surface | Flutter session | Host lifecycle | User cannot see unsaved agent change | Expose read-only active context |
| `DOC-05` | Session start/stop/revocation | `🌗` | `partial-local` | Token store exists; server lifecycle absent | Flutter host + MCP | Transport adapter | Live token after stop | Tie store to server lifecycle |
| `DOC-06` | Save/Save As separation | `✔️` | `verified-local` | Protocol-level negative test absent | Flutter file boundary | Mutation adapter | Accidental filesystem write | Add adapter negative-path test |
| `EDIT-01` | Bounded proposal review | `🌗` | `partial-local` | Proposal DTO, no review/call producer | MCP + Flutter | Mutation adapter | Whole-file/implicit edit | Add proposal review fixture/surface |
| `EDIT-02` | Apply edit through desktop bridge | `🌗` | `partial-local` | Bridge exists; MCP mutation route absent | Flutter bridge + MCP | Embedded server | Unauthenticated mutation | Add scoped mutation adapter |
| `EDIT-03` | Base identity/revision guard | `✔️` | `verified-local` | Live transport race not tested | Flutter session | Mutation adapter | Partial stale write | Preserve guard in adapter test |
| `EDIT-04` | One undoable transaction | `✔️` | `verified-local` | Full desktop runtime evidence absent | Flutter editor | Mutation adapter | Hidden multi-step history | Keep single setter contract |
| `EDIT-05` | Applied/stale/rejected/failed result | `🌗` | `partial-local` | DTO exists; all protocol states not mapped | MCP + Flutter | Mutation adapter | Failed action reported applied | Add state serialization tests |
| `RES-01` | Canonical resource list/read | `🌗` | `partial-local` | Typed resource store/router added; snapshot contents remain caller-provided | MCP resource layer | Snapshot packaging | Path-like URI leakage | Add pinned snapshot/catalog |
| `RES-02` | Diagnostics catalog resource | `❌` | `verified-absence` | URI declared; no content/resolver | MCP + `spec/id` | Catalog source | Explanation mismatch | Add versioned catalog resource |
| `RES-03` | Versioned offline snapshot | `❌` | `verified-absence` | No bundled spec/examples store | MCP packaging | Snapshot decision | Offline assistant unavailable | Package pinned snapshot |
| `RES-04` | Predictable cache/fallback | `❌` | `verified-absence` | No TTL/revision fallback layer | MCP resource layer | Snapshot packaging | Mixed revisions | Add cache identity policy/tests |
| `PROV-01` | Documentation provenance | `🌗` | `partial-local` | DTO exists; adapter does not produce results | MCP + spec/examples | Resource resolver | Untraceable guidance | Preserve provenance in adapter fixtures |
| `PROV-02` | Normative/explanatory precedence | `✔️` | `verified-local` | Resolver enforcement still absent | MCP provenance contract | Resource resolver | Website overrides spec | Carry policy into resolver tests |
| `PROV-03` | Proposal provenance chain | `🌗` | `partial-local` | `basedOn[]` exists; producer absent | MCP workflow layer | Completion/example adapters | Agent cannot explain basis | Populate chain in proposal fixture |
| `TRAN-01` | MCP initialize/lifecycle | `🌗` | `partial-local` | Transport-independent router added; host framing/runtime remains absent | MCP transport | SDK selection | Non-conformant handshake | Run adapter through permitted transport gate |
| `TRAN-02` | Tool/resource discovery calls | `🌗` | `partial-local` | Router exposes seven typed tools and canonical resources; semantic owner wiring remains injected | MCP adapter | Tool/resource resolvers | False discovery claim | Compose real owner executors |
| `TRAN-03` | Standalone stdio | `🌗` | `partial-local` | Fixture exists; no RelGeo executable | MCP package | Adapter + conformance | No standalone use | Add executable after gate |
| `TRAN-04` | Desktop loopback Streamable HTTP | `🌗` | `environment-unavailable` | Fixture only; socket bind unavailable locally | MCP transport + Flutter | Writable CI/host | Unverified HTTP readiness | Run on permitted CI/desktop host |
| `TRAN-05` | Remote transport rejection | `🌗` | `partial-local` | Policy/fixture only; no production server | MCP transport | Production adapter | Accidental exposure | Enforce bind/origin in adapter |
| `TRAN-06` | SDK-neutral adapter boundary | `🌗` | `partial-local` | No adapter package to exercise boundary | MCP transport | SDK conformance | SDK lock-in | Isolate candidate and run gate |
| `HOST-01` | Pure-Dart package boundary | `✔️` | `verified-local` | Contract package is not server delivery | MCP package | Adapter | Boundary overclaimed | Preserve pure-Dart exports |
| `HOST-02` | Flutter embedded server lifecycle | `❌` | `verified-absence` | No start/stop/lifecycle supervisor | Flutter host | Transport adapter | Server silently unavailable/live | Implement disabled-by-default service |
| `HOST-03` | MCP status/configuration UI | `❌` | `verified-absence` | No route/status/config surface | Flutter host | Embedded server | User cannot control endpoint | Add settings/status surface |
| `HOST-04` | Typed agent bridge composition | `✔️` | `verified-local` | Transport does not consume bridge | Flutter bridge | MCP adapter | Widget coupling or bypass | Keep bridge as adapter boundary |
| `HOST-05` | Shared authoring context | `❌` | `verified-absence` | No composition across core/LS/renderer | MCP adapter | Real tool/resource adapter | Inconsistent agent context | Add context composition fixture |
| `ERR-01` | Typed input/bounds/URI errors | `✔️` | `verified-local` | Schema/DTO parity, typed pre-dispatch errors, and focused tests pass | MCP contract + adapter | Semantic domain mappings remain separate | Client validation drift | Preserve schema/invalid-argument regression gate |
| `ERR-02` | Structured domain error mapping | `❌` | `verified-absence` | No core/LS error adapter | MCP + core/LS | Real adapter | Error code/range loss | Add domain error mapping fixtures |
| `ERR-03` | Host/session error states | `🌗` | `partial-local` | Session DTOs exist; protocol states absent | MCP + Flutter | Server adapter | Auth/session ambiguity | Map errors before bridge call |
| `ERR-04` | Error-safe partial work | `🌗` | `partial-local` | Bridge validation/failed divergence only | MCP + Flutter | Mutation + cancellation | False applied or partial write | Add atomic adapter tests |
| `CXL-01` | Request cancellation/abort | `❌` | `verified-absence` | No request registry/abort outcome | MCP transport | Real adapter | Long call/mutation cannot stop | Add cancellation fixture |
| `CXL-02` | Stop/disconnect cancellation safety | `🌗` | `not-verified` | Revoke policy exists; no live lifecycle | MCP transport + Flutter | Embedded server | Pending mutation/token leak | Verify stop/disconnect sequence |
| `SEC-01` | Disabled-by-default server | `🌗` | `partial-local` | Policy default exists; host control absent | Flutter host | Embedded lifecycle | Unexpected endpoint | Add default-off lifecycle test |
| `SEC-02` | Loopback-only boundary | `🌗` | `partial-local` | Fixture/policy enforce; production absent | MCP transport | Production server | Remote exposure | Add bind/origin gate |
| `SEC-03` | Opaque per-session token | `🌗` | `partial-local` | Token store tested; auth wiring absent | MCP session + Flutter | Server lifecycle | Token bypass/leak | Authenticate every request |
| `SEC-04` | Read/write scope enforcement | `🌗` | `partial-local` | Token scope tested; adapter check absent | MCP session + adapter | Mutation route | Read-only token mutates | Add authorization tests |
| `SEC-05` | Active-session-only mutation | `🌗` | `partial-local` | Bridge guard exists; route absent | Flutter bridge | Resource/mutation adapter | Wrong document target | Enforce active identity per call |
| `SEC-06` | Bounded patch/source size | `✔️` | `verified-local` | Transport enforcement not exercised | MCP session + Flutter | Mutation adapter | DoS/whole-file write | Retain limits at protocol boundary |
| `SEC-07` | Filesystem/save isolation | `🌗` | `partial-local` | Policy/bridge separation; adapter absent | Flutter host + MCP | Mutation/render adapter | Arbitrary write/autosave | Add negative protocol tests |
| `SEC-08` | Secret-safe operational visibility | `❌` | `verified-absence` | No status/log surface | Flutter host | Embedded lifecycle | User cannot stop/audit safely | Add secret-safe status panel |
| `DEL-01` | Standalone executable readiness | `⏸️` | `verified-scope` | CLI intentionally roadmap-gated | MCP package | Product decision + conformance | Premature packaging | Decide standalone need after gate |
| `DEL-02` | Desktop runtime dependency readiness | `🌗` | `partial-local` | Path dependency exists; embedded server absent | Flutter packaging | Host lifecycle | Runtime claim without server | Add embedded runtime smoke |
| `DEL-03` | SDK/transport conformance evidence | `🌗` | `not-verified` | CI config exists; no current live adapter run | MCP CI/adapter | SDK + permitted CI | Release without conformance | Run full gate and Inspector |
| `DEL-04` | Desktop artifact/runtime MCP smoke | `🌗` | `partial-local` | Desktop artifact CI, no MCP smoke | Flutter/workspace CI | Embedded server | Artifact not usable | Add per-OS MCP smoke evidence |
| `DEL-05` | Delivery revision provenance | `🌗` | `partial-local` | DTO/CI pointers; no MCP artifact record | Workspace delivery | Embedded runtime | Untraceable release | Record package/SDK/OS/run provenance |
| `DEL-06` | Setup/operations documentation | `🌗` | `partial-local` | Contract/runbook docs; real server config absent | MCP + Flutter docs | Server lifecycle | Operator misconfiguration | Document endpoint/token/status flow |

## 3. Scope findings (not expected-row substitutions)

| Status | Boundary finding | Decision |
| --- | --- | --- |
| `➖` | Android/iOS MCP delivery | Not applicable to this desktop-connected delivery baseline; do not use this to remove desktop expected rows. |
| `➖` | Remote HTTP deployment/authentication | Explicitly outside MVP; `TRAN-05` remains an expected rejection capability and is assessed separately. |
| `➖` | Arbitrary Flutter UI command invocation by agent | Host command surface remains UI-owned; only approved typed bridge operations may be exposed later. |

## 4. Handoff rules

- Implementers should start from the candidate groups in the [gap backlog](./implementation-gap-backlog.md), not from this reporting view alone.
- A documentation update, matrix update, or passing fixture does not change a
  `❌`/`🌗` row to `✔️`; source/runtime/evidence must change first.
- Re-run the expected catalog → audit → reconciliation → matrix join after an
  implementation change. Preserve `?` for unavailable environment evidence and
  preserve `⏸️`/`➖` scope decisions until explicitly changed.
