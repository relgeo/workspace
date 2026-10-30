# Language Specification Coverage Validation and Handoff

**Tanggal validasi:** 2026-10-30
**Scope:** expected catalog → implementation audit → reconciliation → status matrix → implementation-gap backlog
**Required context:** [`spec/id/`](../../../spec/id), [`docs/REPOSITORY-MAP.md`](../../REPOSITORY-MAP.md), [`docs/MATURATION-MASTER-PLAN.md`](../../MATURATION-MASTER-PLAN.md), [`capability-map/INVENTORY-PROTOCOL.md`](../INVENTORY-PROTOCOL.md)

## 1. Handoff result

Dokumentasi language-specification baseline siap untuk review manusia. Validasi
ini **tidak** menyatakan surface implementasi lengkap. Klaim yang aman adalah:

- expected catalog memiliki 53 capability ID;
- audit membandingkan 53/53 ID terhadap observed source/test/fixture/consumer
  evidence;
- status matrix mempertahankan 16 `✔️`, 35 `🌗`, dan 2 `⚠️`;
- tidak ada current `❌` karena audit menemukan sebagian realization untuk semua
  expected ID, tetapi ketiadaan generated machine-readable normative catalog
  tetap dicatat sebagai structural absence;
- 37 non-green capability diturunkan menjadi 13 candidate implementation
  workstreams;
- current local consumer evidence includes Playground `93/93` tests and build,
  website Astro check/build (`138` pages), and Flutter `302` tests; this is not
  canonical CI/public/browser/native-host evidence. MCP tests remain
  environment-unavailable because Dart package resolution and host writes are
  blocked.

Implementation work belum dimulai oleh handoff ini. Candidate backlog harus
menjadi goal/task implementasi terpisah dan hanya boleh dipromosikan setelah
source change, test, fixture/conformance, dan evidence target-nya lulus.

## 2. Artefact chain

| Artefact | Fungsi | Validation |
| --- | --- | --- |
| [Expected catalog](./expected-capability-catalog.md) | Daftar expected dari user/workflow/scope/spec sebelum audit | 53 unique IDs; scope exclusions dan source register ada |
| [Implementation audit](./implementation-audit.md) | Observed source/runtime/test/fixture/consumer evidence | Discovery coverage dan per-ID evidence tercatat |
| [Reconciliation](./reconciliation.md) | One-to-one expected-versus-observed join | 53/53 rows, no missing/extra/duplicate |
| [Status matrix](./status-matrix.md) | Capability-first compact reporting view | 53 rows, complete status legend, gap/owner/dependency/risk/next action |
| [Gap backlog](./implementation-gap-backlog.md) | Candidate implementation goals/tasks | 13 workstreams cover exactly 37 `🌗`/`⚠️` IDs; documentation does not close gaps |

## 3. Validation checklist

| Check | Result | Evidence |
| --- | --- | --- |
| Coverage report exists | PASS | Audit §3 lists normative, repository, parser, runtime, geometry, renderer, language-service, CLI, Markdown, UI, website, Flutter/MCP, fixture, runner, decision sources |
| All expected IDs represented | PASS | Catalog/matrix/reconciliation each contain 53 unique IDs |
| One reconciliation per expected ID | PASS | Reconciliation check: 53 expected, 53 reconciled, no missing/extra/duplicate |
| Matrix is capability-first | PASS | Matrix rows keyed by expected capability ID, not repository or implementation module |
| Full legend present | PASS | Matrix/reconciliation define `✔️ 🌗 ❌ ➖ ⏸️ ⚠️` and distinguish `not verified` |
| Evidence classes separated | PASS | Audit distinguishes `direct-local`, `source+tests`, `historical/local`, `not verified`; current Playground/website/Flutter local evidence is separated from browser E2E, canonical/public/native-host evidence, and MCP transport/runtime |
| Scope decisions preserved | PASS | Expected catalog scope/exclusions and matrix scope columns retain 2D/no-solver/mobile/Flutter decisions |
| Limitations stated | PASS | Audit §3–§4, reconciliation §5, and this handoff record Node, CI, registry, browser, Flutter, MCP, and presentation limits |
| Gap backlog coverage | PASS | 13 candidate workstreams cover 37/37 non-green IDs; acceptance evidence is required per workstream |
| Required source paths | PASS | `docs/capability-map`, `docs/REPOSITORY-MAP.md`, and `docs/MATURATION-MASTER-PLAN.md` present and linked |
| Implementation closure claims | PASS | Backlog explicitly prohibits documentation-only closure claims |

## 4. Discovery coverage boundary

The audit inspected the minimum discovery boundary required by the inventory
protocol and repository map:

1. normative `spec/id/` chapters and spec index;
2. parser/validator/types, graph/evaluator/units, resolver primitives and
   diagnostics;
3. geometry and SVG renderer source/test boundaries;
4. language-service schema, tokens, completion, diagnostics, and tests;
5. CLI commands, flags, outputs, and tests;
6. Markdown preview/highlighting consumers;
7. Playground editor/worker/preview/inspector/graph/diagnostics/share/export
   assumptions;
8. website spec route and Playground presentation boundary;
9. Flutter workbench and MCP contract/host boundary;
10. fixture manifest, references, expected JSON/SVG/highlight outputs, and
    conformance/compatibility runners;
11. master plan, repository map, inventory protocol, surface ledger, and
    cross-repo decisions.

This is a bounded audit, not proof that every host, deployment, platform, or
syntax combination has been executed. A missing current environment result is
`not verified`, not `❌`.

## 5. Coverage proof

### 5.1 Declared source categories

The audit's declared discovery set contains 18 categories. Each category has a
corresponding row in the audit's [discovery coverage report](./implementation-audit.md#3-discovery-coverage-report);
the result column records what was reviewed and the boundary column records
what was not proven.

| Source category | Review result | Evidence boundary |
| --- | --- | --- |
| Normative contract | Reviewed `spec/id` chapters and index | Machine-readable catalog and editorial labels remain gaps |
| Repository/ownership | Reviewed master plan and repository map | Current child CI/deployment is not proven |
| Expected baseline | Reviewed 53-ID expected catalog | Catalog is not implementation evidence |
| Parser-facing contract | Reviewed parser, validator, and types | Vocabulary is not generated |
| Runtime resolver | Reviewed graph, evaluator, units, resolver, and diagnostics | Some raw errors/combinations lack focused fixtures |
| Geometry runtime | Reviewed geometry source and tests | DSL mapping is not proven by library tests alone |
| SVG serialization | Reviewed renderer source and tests | Browser insertion and escaping defect remain limited |
| Language authoring intelligence | Reviewed schema, completion, token, diagnostic source/tests | Consumer catalogs are not generated |
| CLI/menu/command | Reviewed CLI source, docs, flags, and tests | Registry/package smoke was not run |
| Markdown surfaces | Reviewed preview/embed/highlighting packages and tests | Not a full semantic IDE proof |
| Browser UI/workbench | Reviewed Playground source, UX audit, tests, and manifest surfaces | Browser E2E/public host/real AT are not verified |
| Website/routes | Reviewed language-spec routes, docs shell, and content paths | Deployment artifact is not verified |
| Desktop/agent consumer | Reviewed Flutter, MCP, and agent integration boundaries | Native/device/MCP transport evidence is not verified |
| Fixtures and expected outputs | Reviewed manifest, references, expected JSON/SVG/highlight outputs | Declared cases do not cover every syntax combination |
| Conformance runner | Reviewed fixture and compatibility runners | Local artifacts are not fresh CI/public proof |
| Configuration/package boundary | Reviewed workspace, package, toolchain, and CI declarations | Configuration does not prove execution |
| Platform services/host adapters | Reviewed worker/storage/share, routes, Flutter host, and MCP seams | Host/transport/public deployment evidence is separate |
| Decision/scope | Reviewed cross-repo decisions and plans | Decisions do not expand active scope automatically |

### 5.2 Capability-category coverage

The expected catalog declares six capability categories. Their complete ID
counts are independently checkable against the catalog and the per-capability
sections of the audit/reconciliation.

| Catalog category | Capability IDs | Count | Review result |
| --- | --- | ---: | --- |
| A. Authoring language and document structure | `LANG-*`, `DOC-*` | 5 | All 5 audited and reconciled |
| B. Declarations, types, expressions, evaluation | `DECL-*`, `TYPE-*`, `EXPR-*`, `EVAL-*` | 11 | All 11 audited and reconciled |
| C. Geometry, presentation objects, composition, placement, anchors | `OBJ-*`, `GEO-*`, `COMP-*`, `PLACE-*`, `ANCH-*` | 14 | All 14 audited and reconciled |
| D. Collections, queries, constraints | `COLL-*`, `QUERY-*`, `CON-*` | 8 | All 8 audited and reconciled |
| E. Presentation objects and metadata | `PRES-*`, `META-*` | 6 | All 6 audited and reconciled |
| F. Diagnostics, errors, serialization, compatibility | `DIAG-*`, `ERR-*`, `SER-*`, `VER-*` | 9 | All 9 audited and reconciled |
| **Total** | **all expected IDs** | **53** | **53/53; no missing, extra, or duplicate reconciliation row** |

Coverage proof means every declared category was inspected and every expected
ID received an explicit implementation/evidence result. It does not mean every
combination, host, deployment, or platform runtime was executed.

## 6. Unresolved questions for human decision

These questions remain open and must not be silently resolved by implementation:

| ID | Question | Affected artefacts / capabilities |
| --- | --- | --- |
| `Q-001` | Apakah canonical resolved-scene JSON (`SER-001`) adalah normative language contract atau consumer serialization contract? | `SER-001`, CLI, core, fixtures |
| `Q-002` | Property SVG mana yang masuk semantic contract (`SER-002`) dan mana yang tetap renderer presentation policy? | `SER-002`, `PRES-001/002/003/004`, renderer, Flutter |
| `Q-003` | Apakah fixture 16 evaluator/unit dipromosikan menjadi active 0.5 contract, dan dengan evidence consumer/platform apa? | `DECL-001`, `DECL-004`, `TYPE-001/002`, `EVAL-002` |
| `Q-004` | Error-code/path/message/involved-object vocabulary final apa yang harus diwajibkan lintas core, language-service, CLI, Playground, Flutter, dan MCP? | `DIAG-001/002`, `ERR-001`, `CON-002` |
| `Q-005` | Apakah generated catalog/drift checker menjadi source-derived tooling artifact atau perubahan formal pada spec repository? | `LANG-002`, `DOC-001/003`, `TYPE-001/002`, `VER-003` |
| `Q-006` | Capability presentation/collections mana yang masuk active 0.5 fixture set versus tetap legacy/candidate? | `COLL-*`, `PRES-*`, `META-*`, `COMP-*` |
| `Q-007` | Evidence kapan boleh dipromosikan dari local ke canonical/public/native-host, terutama pada Node `>=24`, browser, Flutter, dan MCP transport? | all evidence tiers; no status auto-promotion |

## 7. Implementation handoff

Implementation candidates are owned by the separate backlog, in dependency order:

1. vocabulary/drift contract (`GAP-001`);
2. declarations/evaluator/unit promotion (`GAP-002`);
3. geometry/topology (`GAP-003`);
4. composition (`GAP-004`);
5. placement/anchors (`GAP-005`);
6. collections/boolean (`GAP-006`);
7. path/query tolerance (`GAP-007`);
8. constraints (`GAP-008`);
9. dimension/annotation escaping (`GAP-009`);
10. roles/views/metadata (`GAP-010`);
11. diagnostic/error normalization (`GAP-011`);
12. canonical JSON serialization (`GAP-012`, after `Q-001`);
13. safe semantic SVG serialization (`GAP-013`, after `Q-002`).

The handoff is complete only as a documentation/validation deliverable. It does
not create or start these implementation goals, does not change any capability
status, and does not convert local evidence into release evidence.
