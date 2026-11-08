# Sub-rencana Tahap 1 — Cross-repo Integration Gate

**Status implementasi:** Selesai. **Status evidence:** GitHub Actions run [37832260326](https://github.com/relgeo/workspace/actions/runs/37832260326) pada root `328c869` adalah run lintas-repo canonical terbaru; seluruh enam job sukses dan lima artifact tersedia. `Integration #151` dipertahankan sebagai historical predecessor. Promotion capability tetap merupakan langkah terpisah.
**Induk:** ../MATURATION-MASTER-PLAN.md  
**Tanggal:** 2026-09-15  
**Owner koordinasi:** relgeo/workspace  
**Scope:** workspace, package TypeScript publik, Playground, website, dan bukti integrasinya

## 0. Checkpoint evidence — 2026-10-08

Workspace HEAD `d3ec2b0430f12bd95f2be312fa7438b6d97757d6` memakai Node `24.21.0`
dan pnpm `10.33.3`. Baseline strict lulus `81/81`, compatibility lulus
`283/283`, dan conformance lulus `253/253` across 20 fixtures. Manifest sekarang
identik dengan seluruh gitlink checkout, termasuk `playground@ecc1407` dan
`flutter@edc9488`.

Local runner pertama menghasilkan `33/36` stage lulus. Tiga stage yang gagal adalah
purge install tanpa TTY, pembuatan cache Playwright yang ditolak environment, dan
bind server E2E `127.0.0.1:4173` yang ditolak sandbox. Rerun current setelah
dependency tidak dapat dipulihkan menghasilkan `6/35` pada
`.local/integration-local-current.json`; angka tersebut juga bukan local gate penuh.
Artefak replay Node `24.21.0` di `.local/integration-local-node24-recovery.json`
mencatat `33/36`: seluruh package/consumer dan shared conformance lulus; tiga stage
yang gagal adalah frozen install, Playwright Chromium, dan Playground E2E karena
batas environment.
Probe public-registry current menghasilkan `2/11` pada
`.local/integration-public-current.json` karena DNS `registry.npmjs.org` tidak
tersedia. Evidence CI lintas-repo yang tetap valid adalah `Integration #151` pada
`workspace@21ee21b`, pada pointer sebelum `flutter@edc9488`; tidak ada klaim CI baru
untuk pointer terbaru.
Transcript manual `.internal/tmp-test.txt` kemudian menjalankan command local dan
public yang sama pada Node `24.21.0`/pnpm `10.33.3` dengan browser fallback system
Chrome: local `35/35` dan public `50/50` lulus. Transcript tersebut juga mencatat
`flutter:conformance` lulus analyze dan 300 test. Ini evidence manual workspace,
terpisah dari evidence CI canonical `Integration #151`.

### 0.1 Canonical refresh — 2026-10-09

Checkpoint executor di atas kemudian digantikan oleh GitHub Actions run
[37832260326](https://github.com/relgeo/workspace/actions/runs/37832260326)
pada root `328c869` (Flutter `ea8e754`). Keenam job (`verify`, `public`,
`flutter`, `flutter-macos`, `flutter-linux`, dan `flutter-windows`) lulus dan
lima artifact tersedia. Run ini adalah evidence canonical aktif untuk baseline
tersebut; `Integration #151` dan report lokal tetap dipertahankan sebagai
historical/supporting evidence.

### 0.2 Core Runtime consumer checkpoint — 2026-11-04

The current Core Runtime execution verified local downstream boundaries through
the Core dist/conformance path and direct consumer suites: language-service
`82` tests, renderer-svg `92` tests plus `1` distribution-boundary test, CLI
`38` tests, remark-relgeo `9` tests, remark-relgeo-hl `6` tests, and shared
conformance `298/298` assertions. Core, renderer-svg, language-service, and CLI
were also rebuilt locally; the renderer distribution-boundary test passed. The
CLI package dry-run exposes 8 allowlisted files. These are local E3 observations
for the current working tree, not a fresh-clone or public-package claim.

The command `pnpm run integration:gate -- --local` was also attempted on this
host and exited `2` before any stage because the runner requires Node `>=24`
while the host provides Node `22.23.2`. This is explicitly environment
unavailable; it does not establish consumer parity failure. The canonical CI
run at the top of this document remains historical evidence for its recorded
revision and is not silently reused as current-pointer evidence.

### 0.3 Renderer-SVG consumer boundary refresh — 2026-11-04

The current uncommitted renderer worktree was checked against the downstream
boundaries relevant to SVG output. These are local observations and do not
replace the canonical CI/public evidence recorded for its historical revision.

| Boundary | Result | Classification / limitation |
| --- | --- | --- |
| `renderer-svg` unit, negative, semantic, security, sheet, and dist tests | PASS — 95 renderer tests and 1 dist-boundary test | Local package evidence |
| `renderer-svg` pack boundary | PASS — 9 files from `npm pack --dry-run --json` | Local artifact shape; no registry/public install claim |
| CLI | PASS — 38 tests | Local downstream consumer evidence |
| Markdown consumers | PASS — remark-relgeo 9 tests; remark-relgeo-hl 6 tests | Local preview/highlighting evidence |
| Playground | PASS — 104 unit tests and production build | Browser E2E not verified: preview server bind returned `EPERM` on `127.0.0.1:4173` |
| Shared fixtures | PASS — 298/298 across 23 fixtures | Local conformance and semantic serialization/provenance evidence |
| Website | PASS — Astro check 0 diagnostics, 138 pages built, built-output assertions passed | Local artifact only; deployed/public smoke not rerun |
| `pnpm run integration:gate -- --local` | ENVIRONMENT UNAVAILABLE — exit 2 before stages | Host Node `22.23.2`; runner requires Node `>=24`; not a consumer parity failure |

No selected local downstream consumer showed a regression. Public registry,
fresh isolated install, canonical CI, browser, and native/Flutter evidence stay
separate and are not inferred from these local results.

### 0.4 Language Service consumer-boundary refresh — 2026-11-04

The current Language Service tranche was checked against its direct downstream
consumers and package boundary. These are local E3 observations for the current
working tree; they do not promote partial capability rows or substitute for CI
and public evidence.

| Boundary | Result | Classification / limitation |
| --- | --- | --- |
| Language Service package | PASS — 90 tests; lint and CJS/ESM/DTS build pass | Local package evidence |
| Playground worker/consumer | PASS — 106 tests; lint and production build/provenance pass | Local consumer evidence; browser E2E/public route not rerun |
| Markdown consumers | PASS — remark-relgeo 9 tests/build; remark-relgeo-hl 6 tests/build | Local consumer evidence; registry/public install not verified |
| CLI | PASS — 38 tests | Local downstream consumer evidence |
| Shared conformance | PASS — 298/298 assertions across 23 fixtures | Local CLI/service boundary; MCP semantic adapter parity remains open |
| Language Service package artifact | PASS — `npm pack --dry-run --json` exposes 9 files for `@relgeo/language-service@0.5.1` | Local tarball shape only; no publish or registry install claim |
| Full cross-repo gate | ENVIRONMENT UNAVAILABLE — `node scripts/run-integration-gate.mjs --local` exits 2 before stages because host Node is 22.23.2 and runner requires Node 24+ | Not a consumer parity failure |

The canonical CI/public records at the top of this document remain evidence for
their recorded revisions only. No current CI, public registry, native Flutter,
or live-host result is inferred from these local checks.

### 0.5 Markdown Plugins consumer-boundary refresh — 2026-11-04

The current Markdown Plugins tranche was checked against its downstream
consumer boundaries. These are local observations for the current working
tree; they do not replace CI, registry, deployment, or public evidence for a
different revision.

| Boundary | Result | Classification / limitation |
| --- | --- | --- |

| `remark-relgeo` package consumer suite | PASS — 16/16 tests | Local package evidence covering fence mapping, AST/provenance preservation, preview metadata, failure policy, options, safety, and exports. |
| `remark-relgeo-hl` package consumer suite | PASS — 10 Vitest + 1 Node package-boundary test | Local package evidence covering source-preserving fallback, strict behavior, options, and ESM/CJS/types exports. |
| Shared Markdown/conformance consumer path | PASS — 298/298 across 23 fixtures | Local real parser/core/renderer/language-service pipeline with negative/runtime fixtures, semantic serialization replay, preview, and highlighting digest checks. |
| Official Astro website consumer | PASS — 0 diagnostics, 138 pages, built-output assertions pass | Local downstream artifact evidence; no deployed/public URL claim. |
| `npm pack` for both Markdown packages | PASS | Local 0.5.0 tarball shape contains only manifest, README, LICENSE, and dist ESM/CJS/types; fresh temporary npm consumer install remains unverified because the resolver hung. |
| `pnpm run integration:gate -- --local` | ENVIRONMENT UNAVAILABLE — exit 2 before stages | Host Node is 22.23.2 while the cross-repo runner requires Node 24+; this is not a consumer parity failure. |
| Public registry/install and deployed smoke | NOT RUN / external boundary | No network/release/deployment claim is inferred from local package or website evidence. |

No selected local downstream consumer showed a regression. The required
evidence split is therefore: package/conformance/Astro results are local,
historical CI/public results remain scoped to their recorded revisions, and
registry/deployed/browser-host checks remain unverified or deferred.

### 0.6a Core Runtime canonical fixture refresh — 2026-11-05

The current Core closure fixture tranche expanded the root manifest from 24 to
27 entries. The new invalid fixtures cover operation-target compatibility,
reverse-target compatibility, and turtle-forward validation. The conformance
runner now enforces declared Core diagnostic `code`, `phase`, and `path` for
invalid fixtures and replays CLI/language-service code preservation where those
surfaces are listed. This is a local workspace evidence update, not a status
promotion or a public/CI claim.

The resulting one-to-one Core Runtime closure mapping is maintained in the
[Core Runtime closure report](../capability-map/core-runtime/closure-report-2026-11-05.md)
and [Core Runtime handoff](../capability-map/core-runtime/coverage-validation-handoff.md);
the local `401/401` fixture result is evidence for that boundary only.

| Boundary | Result | Classification / limitation |
| --- | --- | --- |
| Shared Core/consumer fixtures | PASS — `401/401` checks across 27 fixtures | Includes semantic serialization/replay, numeric/unit candidate output, ordering/determinism, invalid/runtime diagnostics, CLI, language-service, Markdown, renderer, and highlighting projections. |
| Structured invalid diagnostic assertions | PASS — fixtures 13, 21, 23, 25–27 assert code/phase/path; CLI replay is asserted for fixtures 25–27 | Core remains the semantic owner; consumer outputs are projection evidence. |
| Presentation parity | Bounded — SVG snapshots remain reviewable outputs, while semantic replay/tolerance remains the parity contract | Raw SVG byte equality is not used as the sole parity proof. |

### 0.6 Playground consumer-boundary refresh — 2026-11-04

The current Playground working tree was checked at the consumer boundaries it
owns: the worker consumes the 0.5 contract and package graph, and the website
assembles the Playground build under `/playground/`. These are local E3
observations for the current checkout, not fresh-clone, CI, registry, or public
deployment evidence.

| Boundary | Result | Classification / limitation |
| --- | --- | --- |
| Playground full unit regression | PASS — 17 files / 107 tests | Local consumer/source evidence |
| Focused Playground lifecycle, worker negative/recovery, viewport, persistence, keyboard, and theme suite | PASS — 6 files / 50 tests | Local boundary evidence |
| Playground lint, UX audit, and production build | PASS | Local source/build evidence; browser E2E remains unavailable because preview bind returns `EPERM` |
| Shared 0.5 conformance consumer path | PASS — 298/298 across 23 fixtures | Local parser/core/renderer/language-service/highlighting/preview/CLI serialization and negative-path evidence |
| Astro website `check`, build, and built-output assertions | PASS — 0 diagnostics and built-output assertions pass | Local downstream website consumer evidence; no public URL claim |
| Pages artifact assembly | ASSEMBLED LOCALLY | Source and website Playground files were assembled for comparison; no deployment performed |
| `provenance:check`, `provenance:pages`, `playground:artifact:check`, and `test:pages-artifact` | NOT VERIFIED — revision/pin drift | Current Playground `47fd715…` differs from baseline/Pages pin `c7cec4b…`; current `spec` also differs from its pin. This is an external delivery boundary mismatch, not a local consumer regression. |

No local downstream consumer showed a functional regression in this refresh.
Browser E2E, immutable-pin alignment, hosted smoke, and public artifact parity
remain separately unverified.

### 0.7 Website and Pages consumer-boundary refresh — 2026-11-04

The current Website and Pages task reran the direct downstream consumer
boundaries from the uncommitted worktree. These results are local E3 evidence;
they do not reuse the historical CI/public records at the top of this plan.

| Boundary | Result | Classification / limitation |
| --- | --- | --- |
| Website Astro consumer | PASS — `pnpm check` returned 0 errors, 0 warnings, 0 hints; configured `pnpm build` produced 138 pages; `pnpm test` and responsive/accessibility assertions passed | Local website consumer/build evidence; no deployed/public claim |
| Playground consumer | PASS — `pnpm build` and `pnpm test` passed; 17 test files and 107 tests | Local downstream consumer evidence; Vite emitted a non-failing chunk-size warning |
| Website content integrity | PASS — aggregate test and content-integrity assertions passed | Local locale/frontmatter/generated-route/internal-link evidence |
| Pages artifact assembly | ASSEMBLED LOCALLY — current `playground/dist` copied under `relgeo.github.io/dist/playground` | No deployment performed; artifact promotion remains provenance-gated |
| Strict provenance | FAIL CLOSED — current website `1b9bb92f`, Playground `47fd7158`, and spec `f4fecf21` differ from baseline/Pages references | Revision-sync boundary; not a direct consumer regression and no checkout reset was performed |
| `pnpm run test:pages-artifact` | FAIL CLOSED — `Pages inputs must be synchronized` | Correct rejection of an artifact with `synchronized: false` provenance |
| `pnpm run integration:gate -- --local` | ENVIRONMENT UNAVAILABLE — exit 2 before stages | Host Node `22.23.2`; cross-repo runner requires Node `>=24`; not a consumer parity failure |
| CI, Pages deployment, and public smoke | NOT VERIFIED / external boundary | No current workflow run or reachable public host was used as local consumer evidence |

The current direct consumer result is therefore “no local downstream consumer
regression observed,” with artifact promotion and cross-repo/hosted parity
remaining explicitly unverified.

### 0.8 Flutter Workbench consumer-boundary refresh — 2026-11-05

The current Flutter child checkout was checked against the direct consumers of
the changed diagnostic/parameter/import boundary. These are local observations
for the current working tree, not fresh-clone, CI, public-registry, or target-
host evidence.

| Boundary | Result | Classification / limitation |
| --- | --- | --- |
| Flutter focused Workbench regression/conformance set | PASS — 135 tests | Local Flutter consumer/source evidence covering recovery, file operations, negative import/diagnostic cases, current v0.5 semantic fixtures, inspector/graph/selection, lifecycle/window policy, keyboard/semantics, viewport, SVG export, and editor behavior. |
| Flutter analyzer | PASS — no issues | Local analyzer evidence at `flutter@9816b477`; no build or host-runtime claim. |
| Core Runtime consumer | PASS — 489 tests | Local Core package consumer evidence; it does not promote Flutter/native parity or a public package install. |
| Geometry consumer | PASS — 91 tests | Local Geometry package consumer evidence for the shared type/contract boundary. |
| MCP contract package | PASS — 44 tests | Local protocol/schema/dispatch consumer evidence; desktop HTTP transport is a separate Flutter integration boundary. |
| Flutter full suite historical checkpoint | RECORDED — 326 passed, 1 failed | Earlier checkpoint before the MCP fixture correction; retained for traceability and not used as the current consumer verdict. |
| Flutter MCP consumer boundary suite | PASS — 10 tests | Local offline snapshot, Workbench bridge, and desktop HTTP MCP integration tests pass; valid post-initialize requests include the negotiated protocol header while the missing-header rejection remains covered. |
| Target host/runtime and packaged desktop artifact | NOT VERIFIED | `flutter devices` could not run because the managed SDK could not write `flutter/bin/cache/engine.stamp`; no macOS/Linux/Windows launch or picker claim is inferred. |

The local result is therefore “no regression observed in the selected direct
consumers.” The historical full-suite failure above is retained as a record of
the earlier checkpoint; the current MCP consumer boundary is green after the
fixture supplied the required post-initialize protocol header. Target-host
runtime, current CI, public registry/install, deployment, and release-artifact
promotion remain separate evidence classes.

### 0.9 MCP protocol consumer-boundary refresh — 2026-11-05

The current MCP package and its Flutter path consumer were checked at the
protocol boundary affected by the selected MCP implementation. These are local
E3 observations for the current working tree. They do not imply a public
package install, fresh-clone parity, CI rerun, Inspector interoperability, or
packaged desktop smoke.

| Boundary | Result | Classification / limitation |
| --- | --- | --- |
| MCP pure-Dart package | PASS — 44 tests; analyzer reports no issues | Local package evidence for contracts, dispatch, provenance, negative paths, bounds, ranking, session, and cancellation. |
| Flutter MCP path dependency | PASS — Flutter analyzer reports no issues | Local consumer compiles against `relgeo_mcp` through the declared `../mcp` path dependency. |
| Offline snapshot projection | PASS — 6 tests | Local Flutter asset-bundle consumer evidence for the pinned 34-file snapshot, path safety, no-results, section bounds, and provenance. |
| Workbench bridge projection | PASS — 3 tests | Local identity/revision guard and undoable edit consumer evidence. |
| Desktop MCP HTTP projection | PASS — 1 test | Local loopback consumer evidence for auth, protocol metadata, origin guard, read-only denial, stale revision, applied edit, dirty state, and undo. |
| CI, public registry/install, Inspector/client, packaged target host | NOT VERIFIED / external boundary | No current public/CI/Inspector/packaged-host result is inferred from local passes. |

No selected local MCP consumer showed a current regression. The HTTP fixture
still explicitly rejects a missing `MCP-Protocol-Version` after initialization;
valid follow-up requests now provide that negotiated header. This is a test
fixture correction, not a relaxation of the server boundary.

### 0.10 Root orchestration boundary refresh — 2026-11-05

The current root-only orchestration changes were checked at their direct
consumer and evidence boundaries. These are local E3 observations; they do not
replace child-package, CI, registry, deployment, or public-host evidence.

| Boundary | Result | Classification / limitation |
| --- | --- | --- |
| Public-boundary contract | PASS — `pnpm run public-boundary:contract:test` | Local fixture evidence that clean entries pass and unsafe paths/content fail closed. |
| Bootstrap/evidence consumer | PASS — `pnpm run bootstrap:contract:test` | Local report-schema and public-boundary integration evidence. |
| Orchestration decision/retry consumer | PASS — `pnpm run orchestration:contract:test` | Local contract evidence for blocker taxonomy, bounded retry, sync checkout, and decision-gate behavior. |
| Child-CI synchronization policy consumer | PASS — `pnpm run child-ci:contract:test` | Static workflow/metadata boundary evidence; no provider dispatch or synchronization PR was performed. |
| Evidence reconciliation consumer | PASS — `pnpm run integration:evidence:test` | Current-revision joins are accepted and historical evidence is rejected for promotion. |
| Shared downstream conformance path | PASS — `pnpm run conformance:fixtures` (`298` passed, `0` failed across `23` fixtures) | Local parser/core/renderer/language-service/CLI/preview/highlighting serialization and negative-path evidence. |
| Local integration gate | ENVIRONMENT UNAVAILABLE — exit `2` before stages | Node `22.23.2` is below the declared `>=24` prerequisite; no consumer parity failure is inferred. |
| Public integration gate | ENVIRONMENT UNAVAILABLE — exit `2` before stages | Same Node prerequisite; no registry, deployment, or public consumer claim is made. |
| Current CI / public host | NOT VERIFIED | Historical CI/public records remain scoped to their recorded revisions and are not reused as current-pointer evidence. |

No selected local consumer boundary showed a regression from the root
orchestration changes. Consumer, CI, and public evidence remain explicitly
separate; a supported Node 24 checkout is required before promoting the full
integration gate.

### 0.11 Language Service closure gate capture — 2026-11-08

The Language Service closure work reran the required workspace gates from the
current checkout. These results supersede neither the baseline snapshot nor
historical CI records; they are a current local execution record with the
working-tree and toolchain boundaries preserved:

| Exact command | Result | Boundary |
| --- | --- | --- |
| `pnpm run verify:baseline:strict` | NOT PASS — exit `1`; 83 passed, 2 failed | The strict check found the expected uncommitted implementation changes in `playground` and `language-service`; no cleanup or reset was performed. |
| `pnpm run compatibility:check` | PASS — exit `0` | Current compatibility matrix and package/capability metadata. |
| `pnpm run conformance:fixtures` | PASS — exit `0`; 677 assertions across 33 fixtures | Canonical local parser/core/renderer/language-service/CLI/Markdown/preview/highlighting path. |
| `pnpm run integration:gate -- --local` | ENVIRONMENT UNAVAILABLE — exit `2` before stages | Host Node `22.23.2`; runner requires Node `>=24`. |
| `pnpm run integration:public` | ENVIRONMENT UNAVAILABLE — exit `2` before stages | Same Node prerequisite; registry/deployment/public-host behavior is not claimed. |

The baseline metadata in `docs/integration-baseline.json` declares Node
`>=24` and remains the provenance reference. Compatibility and conformance
are independently passing local evidence; the strict and integration outcomes
are intentionally not promoted to green.

## 1. Tujuan

Membuat satu gate yang dapat dijalankan dari checkout bersih untuk membuktikan bahwa repository-repository RelGeo bekerja sebagai satu dependency graph publik.

Gate ini tidak menggantikan test detail pada repository anak. Gate ini memeriksa bahwa:

- checkout dan submodule berada pada baseline yang diketahui;
- package dibangun dan diuji menurut dependency order;
- consumer memakai dependency publik yang benar;
- Playground dapat dibangun tanpa path source lokal;
- website dapat mengambil baseline consumer yang benar;
- hasilnya dapat dibaca manusia dan gagal secara tegas ketika ada mismatch.

## 2. Batasan dan prinsip

### 2.1 Yang termasuk

- bootstrap submodule;
- verifikasi Git commit dan branch/tag baseline;
- pemeriksaan package name, version, license, dan dependency line;
- install dengan lockfile;
- build, lint, test, dan pack boundary untuk package yang relevan;
- build Playground;
- build dan artifact assertion website;
- public smoke test website setelah deployment bila dijalankan pada mode release;
- laporan ringkas yang menyebut tahap gagal dan cara memperbaikinya.

### 2.2 Yang tidak termasuk

- menggabungkan semua repository menjadi monorepo;
- menghapus submodule;
- memasukkan source repository sibling ke tarball publik;
- menjalankan deployment production dari command lokal;
- menggantikan test suite detail milik setiap repository;
- membuat release npm otomatis sebelum release guard disepakati;
- menjadikan Flutter prasyarat untuk gate TypeScript tahap pertama.

### 2.3 Local development versus public integration

Local development boleh memakai cara yang nyaman untuk iterasi, termasuk dependency lokal bila diperlukan dan terdokumentasi. Namun mode public integration harus membangun consumer berdasarkan package, commit, tag, atau artifact yang eksplisit. Tidak boleh ada relative import ke folder sibling yang hanya ada di komputer operator.

## 3. Dependency graph

~~~mermaid
flowchart TD
  workspace["workspace: orchestration"] --> spec["spec: language contract"]
  spec --> geometry["geometry: 2D math"]
  geometry --> core["core: parse and resolve"]
  core --> rendererSvg["renderer-svg: SVG renderer"]
  core --> languageService["language-service: diagnostics and completions"]
  core --> cli["cli: command-line surface"]
  rendererSvg --> playground["playground: browser IDE"]
  languageService --> playground
  rendererSvg --> remarkRelgeo["remark-relgeo: Markdown preview"]
  languageService --> remarkHl["remark-relgeo-hl: source highlighting"]
  remarkRelgeo --> website["relgeo.github.io: public docs"]
  remarkHl --> website
  spec --> website
  playground --> website
~~~

Graph ini menunjukkan urutan validasi, bukan berarti semua package harus saling mengimpor source. Dependency aktual harus dibaca dari package metadata dan lockfile.

## 3.1 Status implementasi versus evidence

| Stage | Implementasi | Evidence yang masih diperlukan |
| --- | --- | --- |
| A — Inventory | Selesai | tidak ada blocker desain |
| B — Baseline | Selesai: manifest, strict verifier, compatibility check, failure injection, dan fresh checkout | tidak ada blocker runtime; regenerasi berikutnya tetap menjadi maintenance |
| C — Packages | Selesai: local/public runner, dependency pinning, pack boundary; local dan public gate lulus | tidak ada blocker pada runtime gate |
| D — Consumers | Selesai: isolated consumer checkout, Pages artifact assembly, dan public smoke; local dan public gate lulus | tidak ada blocker runtime |
| E — CI | Selesai: workflow, report artifact, manual dispatch, timeout, concurrency, read-only checkout, run terbaru hijau, dan failure lama tereproduksi lokal | tidak ada blocker runtime |

## 4. Kondisi awal yang perlu dikunci

Baseline saat sub-rencana dibuat:

| Area | Bukti awal | Cara verifikasi |
| --- | --- | --- |
| Workspace | submodule aktif dan clean | git submodule status, git status |
| Spec | repository spec tersedia | submodule revision dan spec README |
| Packages | package line 0.5.0 | package.json dan registry metadata |
| Playground | build/test/lint/audit UX sudah pernah lulus | package scripts dan CI/local evidence |
| Website | custom Pages workflow aktif | workflow, build, artifact assertions |
| Public routes | smoke script tersedia | website smoke script dan workflow output |

Sebelum implementasi runner, status aktual harus dibaca ulang. Jangan meng-hardcode commit lama tanpa alasan release yang terdokumentasi.

## 5. Bentuk deliverable

### 5.1 Runner

Tambahkan runner portable di repository workspace, disarankan:

~~~text
scripts/run-integration-gate.mjs
~~~

Runner harus:

- dijalankan dari root workspace atau menemukan root berdasarkan lokasi script;
- menggunakan Node yang tersedia dan memberi pesan jika versi tidak cukup;
- tidak bergantung pada shell-specific syntax;
- menerima mode yang jelas, minimal --local dan --report;
- tidak menulis ke repository anak kecuali command build memang melakukannya ke direktori ignored;
- mengembalikan exit code non-zero ketika satu stage wajib gagal;
- menampilkan stage, command, durasi, dan ringkasan hasil;
- tidak mencetak token, environment privat, atau isi file privat.

### 5.2 Manifest baseline

Simpan manifest publik yang menjawab baseline apa yang sedang diuji. Lokasi dan format final diputuskan saat implementasi, tetapi harus memuat minimal:

~~~yaml
compatibilityLine: 0.5
spec:
  path: spec
  revision: <git-commit>
packages:
  - name: "@relgeo/geometry"
    path: geometry
    version: 0.5.0
    revision: <git-commit>
...
consumers:
  - name: playground
    path: playground
    revision: <git-commit>
  - name: website
    path: relgeo.github.io
    revision: <git-commit>
~~~

Nilai <git-commit> harus berasal dari checkout aktual dan tidak boleh ditebak. Jika manifest dipakai sebagai release evidence, perubahan manifest harus melalui review biasa.

### 5.3 Laporan

Runner menghasilkan laporan terminal yang cukup untuk diagnosis dan, bila dibutuhkan, file report ignored atau artifact CI. Laporan publik tidak boleh memuat absolute path komputer operator.

Setiap gate juga dapat menghasilkan joined machine-readable evidence:

~~~text
node scripts/join-integration-evidence.mjs \
  --report=.local/integration-gate.json \
  --output=.local/integration-gate-joined-evidence.json \
  --evidence-class=ci-canonical \
  --evidence-state=current \
  --run-id="$GITHUB_RUN_ID" \
  --run-url="$GITHUB_SERVER_URL/$GITHUB_REPOSITORY/actions/runs/$GITHUB_RUN_ID" \
  --artifact-id=relgeo-integration-gate-report \
  --artifact-path=.local/integration-gate.json
~~~

Joined evidence binds root/child revisions, baseline, toolchain, stage command,
execution boundary (`workspace` or `temporary-checkout`), artifact identity,
run identity, evidence class, and limitations. A historical record is retained
for audit but `claim.currentClaimEligible` is false; a current claim is also
ineligible when the gate failed or the supplied root, baseline, or child
revision does not match. `currentObservationEligible` remains available to
distinguish a current failure from historical evidence.
The Integration workflow emits this joined record for both local and public
jobs and uploads it with the source gate report.

### 5.4 Blocker ownership and bounded retry record

Every failed stage is attributable through `owner`, `repository`, and
`surface`. Its classification includes `blockerClass`, `remediation`,
`decisionRequired`/`decisionNeeded`, `dependencyImpact`,
`downstreamImpact`, and `dependencyStatus`. Retryable work is limited to the
shared transient classifier. The stage records the effective `retryPolicy`
(`maxAttempts`, `backoffMs`, `attemptsUsed`, `exhausted`), every sanitized
attempt, and `attemptLinks`; `firstFailure` is retained even when a later
attempt passes. A deterministic, dependency, environment, or human-decision
blocker consumes no automatic retry budget. These fields are diagnostic
evidence, not permission to promote a failed or environment-limited gate.

The report contains only public-safe command names and metadata. Attempt links
must not embed temporary absolute paths, credentials, environment dumps, or
raw process output. A rerun creates a new report/artifact identity and does
not overwrite the first-failure evidence from the previous run.

Format minimal:

~~~text
RelGeo integration gate
baseline: <workspace commit>
compatibility: 0.5

[PASS] submodule baseline
[PASS] package metadata
[PASS] geometry: lint, test, build
[FAIL] core: test
      reason: ...
[SKIP] public smoke test
summary: 1 failed, 3 passed, 1 skipped
~~~

### 5.4 Evidence inventory Stage A — 2026-09-15

Inventory awal dibaca dari package metadata, lockfile, submodule status, dan isi ignore rule. Semua submodule berada pada branch main dan working tree clean saat inventory dilakukan.

| Repository | Package manager | Lockfile | Command utama | Catatan |
| --- | --- | --- | --- | --- |
| geometry | pnpm 10.33.3 | pnpm-lock.yaml | lint, test, build | baseline lengkap |
| core | pnpm 10.33.3 | belum ada | lint, test, build | dependency runtime ke geometry; dev dependency ke renderer-svg |
| renderer-svg | pnpm 10.33.3 | belum ada | lint, test, test:dist, build | dependency runtime ke geometry; dev dependency ke core |
| language-service | belum dideklarasikan | belum ada | lint, test, build | peer dependency ke core |
| remark-relgeo-hl | belum dideklarasikan | belum ada | lint, test, build | peer dependency ke language-service |
| remark-relgeo | belum dideklarasikan | belum ada | lint, test, build | runtime dependency ke core dan renderer-svg |
| cli | pnpm 10.33.3 | belum ada | test, build | runtime dependency ke core dan renderer-svg |
| playground | pnpm 10.33.3 | pnpm-lock.yaml | lint, test, audit:ux, build, test:e2e | package private; consumer browser |
| relgeo.github.io | belum dideklarasikan | pnpm-lock.yaml | check, build, test, test:pages-artifact | consumer Astro dan Pages |
| flutter | Flutter/Dart | pubspec.lock | ditentukan oleh pubspec | gate terpisah pada Tahap 6 |
| spec | Git/documentation | tidak relevan | tidak ada package command | source contract; perlu validator khusus bila dibutuhkan |

Temuan yang memengaruhi desain runner:

1. package manager dan lockfile belum seragam pada seluruh package; runner tidak boleh mengasumsikan semua repository memiliki lockfile sendiri;
2. website dan Playground memiliki lockfile sendiri, sedangkan package library mengandalkan registry dependency resolution;
3. core dan renderer-svg memiliki cycle pada dev dependency; cycle ini harus dicatat dan tidak boleh diselesaikan dengan relative source import tersembunyi;
4. package manager yang belum dideklarasikan perlu diputuskan apakah akan distandardisasi sebelum CI gate final;
5. command release seperti pack dry-run tetap menjadi gate terpisah dari lint, test, dan build.

## 6. Stage implementasi

### Stage A — Inventory dan command contract

**Output:** tabel command nyata untuk setiap repository.

Checklist:

- [x] baca package.json atau README pemilik;
- [x] catat package manager dan lockfile;
- [x] catat command install, lint, test, build, pack;
- [x] catat dependency upstream/downstream;
- [x] catat bahwa dist/build output memakai ignore rule pada repository yang memiliki output build;
- [x] catat prerequisite seperti npm authentication atau browser; gate install publik tidak memerlukan auth/browser, sedangkan publish dan smoke release tetap memerlukannya;
- [x] bedakan command wajib dari command opsional pada inventory awal.

Acceptance:

- [x] tidak ada command gate yang dibuat berdasarkan asumsi; command awal berasal dari metadata repository;
- [x] setiap stage pada sub-rencana memiliki owner koordinasi workspace atau owner repository consumer;
- [x] cycle dependency dicatat sebagai fakta dan tidak disembunyikan.

### Stage B — Baseline manifest dan submodule verification

**Output:** manifest baseline dan helper verifikasi.

Checklist:

- [x] baca root commit workspace;
- [x] baca commit setiap submodule;
- [x] baca branch/tag yang tersedia;
- [x] baca package name/version untuk setiap package;
- [x] pastikan package version sesuai compatibility line;
- [x] fail jika submodule belum di-initialize atau working tree kotor pada mode strict;
- [x] sediakan mode read-only untuk diagnosis lokal.

Acceptance:

- [x] manifest baseline publik disimpan dan memiliki revision setiap submodule;
- [x] verifikasi tidak membutuhkan akses GitHub API;
- [x] verifier membandingkan gitlink, checkout aktual, dan manifest;
- [x] helper untuk regenerasi manifest dengan opsi `--write` tersedia;
- [x] regenerasi manifest berhasil dijalankan pada runtime Node;
- [x] helper failure injection untuk pointer yang berubah tersedia dan dijalankan sebagai gate.

### Stage C — Package gate dalam dependency order

Urutan awal:

~~~mermaid
flowchart LR
  geometry["geometry"] --> core["core"]
  core --> rendererSvg["renderer-svg"]
  core --> languageService["language-service"]
  rendererSvg --> remarkRelgeo["remark-relgeo"]
  languageService --> remarkHl["remark-relgeo-hl"]
  core --> cli["cli"]
  rendererSvg --> cli
~~~

Checklist:

- [x] runner mendefinisikan geometry: lint, test, build;
- [x] runner mendefinisikan core: lint, test, build;
- [x] runner mendefinisikan renderer-svg: lint, test, build, test:dist;
- [x] runner mendefinisikan language-service: lint, test, build;
- [x] runner mendefinisikan remark-relgeo-hl: lint, test, build;
- [x] runner mendefinisikan remark-relgeo: lint, test, build;
- [x] runner mendefinisikan cli: test, build;
- [x] catat dependency peer yang membutuhkan package registry (`language-service` → `core`, `remark-relgeo-hl` → `language-service`);
- [x] runner public mendefinisikan `npm pack --dry-run` sebagai boundary release, bukan pengganti test.
- [x] runner public memeriksa daftar file pack dan menolak path traversal, path absolute, secret, serta direktori lokal.

Evidence runtime: baseline manifest konsisten dengan `.gitmodules`; checkpoint
terbaru pada workspace clean lulus strict `81/81`, compatibility `283/283`, dan
conformance `253/253`. Transcript manual terbaru mencatat local `35/35` dan
public-registry `50/50` lulus dengan Node `24.21.0`/pnpm `10.33.3`; artefak executor
`33/36`, `6/35`, dan `2/11` tetap menjadi diagnostic history. CI terbaru yang
tercatat tetap `Integration #151` dan dipertahankan tanpa dipindahkan ke pointer
`edc9488`.

Acceptance:

- [x] setiap package lulus command gate dari root workspace;
- [x] runner public menyalin package ke temporary checkout tanpa sibling source dan meng-install dari npm registry;
- [x] runner public mem-pin dependency `@relgeo/*` ke versi baseline manifest pada temporary checkout;
- [x] package consumer lulus terhadap package registry publik;
- [x] failure runner menyebut package dan command yang gagal.

### Stage D — Consumer gate

Checklist:

- [x] runner mendefinisikan install dan lint/test/audit UX/build Playground;
- [x] lint, test, audit UX, dan build Playground lulus pada execution terbaru;
- [x] worker Playground terverifikasi memakai package yang terinstall;
- [x] runner public menyalin Playground dan website tanpa sibling source, sehingga alias lokal tidak dapat aktif;
- [x] runner merakit hasil build Playground ke `website/dist/playground` sebelum `test:pages-artifact`, seperti workflow Pages;
- [x] package consumer lulus tanpa workspace link ke source sibling;
- [x] runner mendefinisikan install dan check/build/test/artifact assertion website;
- [x] website check/build/test/artifact assertion lulus pada execution terbaru;
- [x] public smoke test dijalankan setelah deployment yang berhasil.

Evidence public runtime (2026-09-15): `node relgeo.github.io/scripts/smoke-public-site.mjs` terhadap `https://relgeo.github.io` menghasilkan HTTP 200 untuk seluruh 14 route, termasuk `/playground/`, `/sitemap.xml`, `/favicon.svg`, dan `/apple-touch-icon.png`.

Acceptance:

- [x] Playground berhasil tanpa hack path lokal;
- [x] website berhasil tanpa mem-build source sibling secara implisit;
- [x] output website memuat docs/spec/playground route yang diharapkan.

### Stage E — CI integration job

Workflow CI menjalankan runner setelah kontrak Stage A–D tersedia. Evidence
canonical terbaru adalah run `37832260326` pada root `328c869`; job `flutter`,
`flutter-macos`, `flutter-linux`, `flutter-windows`, `verify`, dan `public`
sukses. `Integration #151` dan pointer `edc9488` tetap dicatat sebagai sejarah
sebelumnya. Baseline workflow juga membawa browser smoke Playground
deployment-aware melalui `PLAYWRIGHT_BASE_URL` serta guard release-record
sebelum integration gate.

Checklist:

- [x] workspace menjadi pemilik workflow integration;
- [x] gunakan Node 24 dan pnpm version yang eksplisit;
- [x] gunakan cache pnpm dengan root lockfile;
- [x] workflow mengonfigurasi artifact report ketika gate gagal atau selesai;
- [x] permission workflow minimal;
- [x] workflow tidak mengubah atau publish repository;
- [x] workflow menampilkan workspace revision dan compatibility line sebagai job summary;
- [x] workflow memiliki job public-registry terpisah dari local-workspace job;
- [x] workflow menyediakan `workflow_dispatch`, timeout per job, dan concurrency cancellation;
- [x] checkout CI tidak menyimpan credential Git dan report artifact memiliki retensi terbatas;
- [x] workflow terbaru menjalankan gate sampai selesai.

### 5.6 Sinkronisasi submodule tervalidasi lintas repository

Workflow CI standalone pada `relgeo/flutter`, `relgeo/playground`, dan
`relgeo/mcp` mengirim `repository_dispatch` bertipe
`submodule_ci_succeeded` hanya setelah quality gate repository tersebut lulus
di branch `main`. Payload membawa nama submodule, repository, SHA, run ID, dan
workflow path. Root
`.github/workflows/sync-validated-submodule-after-ci.yml` memetakan payload ke
allowlist path yang tetap (`flutter`, `playground`, `mcp`), memverifikasi ulang
run melalui GitHub API, mencocokkan `head_sha`, repository, branch, conclusion,
dan workflow path, lalu mengambil commit child yang persis sama.

Setelah verifikasi, workflow root meregenerasi
`docs/integration-baseline.json`, menjalankan strict baseline dan compatibility,
lalu membuka satu PR sinkronisasi per submodule. Root `main` tidak ditulis
langsung oleh workflow ini; PR tersebut harus melewati workflow `Integration`
biasa. Event lama `flutter_ci_succeeded` masih diterima sebagai kompatibilitas
transisi, tetapi workflow Flutter baru memakai payload generik yang sama dengan
Playground dan MCP.

Pengaturan yang tetap membutuhkan operator:

1. buat secret `WORKSPACE_DISPATCH_TOKEN` pada `relgeo/flutter`,
   `relgeo/playground`, dan `relgeo/mcp`, masing-masing dengan izin minimum
   `Contents: write` hanya untuk `relgeo/workspace` (GitHub App token lebih baik
   untuk jangka panjang; fine-grained PAT dapat dipakai sebagai bootstrap);
2. bila repository kelak private atau API lintas-repo tidak dapat dibaca oleh
   token default, tambahkan `SUBMODULE_CI_VERIFY_TOKEN` pada `relgeo/workspace`
   dengan izin Actions read terhadap repository child terkait;
3. pastikan branch protection mewajibkan job `Integration` pada PR otomatis.
   Workflow sinkronisasi juga mengirim `workflow_dispatch` ke `Integration`
   pada branch PR secara eksplisit, karena event yang berasal dari
   `GITHUB_TOKEN` dapat ditahan untuk mencegah loop.

Dispatch atau workflow manual yang membawa SHA berbeda dari `head_sha`, run
yang bukan `push` ke `main`, run yang belum `success`, repository/path yang
tidak sesuai allowlist, atau workflow path yang salah akan ditolak. Ini menjaga
manifest tetap menjadi snapshot reproducible, bukan pointer ke branch child yang
bergerak.

Acceptance:

- [x] local dan CI menjalankan entrypoint yang sama atau perbedaan dijelaskan;
- [x] failure CI tertentu dapat direproduksi secara lokal;
- [x] workflow tidak bergantung pada branch atau path yang hanya ada di mesin operator;
- [x] Flutter, Playground, dan MCP menggunakan event dispatch generik dengan SHA tervalidasi;
- [x] root hanya mengusulkan pointer/manifest melalui PR sinkronisasi.

## 7. Keputusan implementasi yang sudah ditutup

Daftar ini dulu berupa pertanyaan desain. Implementasi Stage A–E dan bukti
runner menutupnya dengan aturan berikut; ini bukan lagi approval terbuka.

| Pertanyaan awal | Keputusan yang dipakai | Status |
| --- | --- | --- |
| Registry publik atau workspace link? | Local gate boleh memakai workspace checkout sesuai mode; public gate memakai registry, lockfile, dan temporary checkout tanpa source sibling. | Selesai |
| Strict baseline memeriksa apa? | Memeriksa gitlink/checkout/manifest dan menolak perubahan checkout yang tidak bersih pada mode strict. | Selesai |
| Kapan `npm pack --dry-run` dijalankan? | Pada release candidate/public release gate, bukan sebagai pengganti lint/test/build setiap perubahan. | Selesai |
| Kapan public smoke dijalankan? | Built artifact diperiksa lokal; public URL smoke dijalankan pascadeploy. | Selesai |
| Manifest committed atau digenerate? | Release baseline committed; diagnosis dapat menggunakan mode read-only/generate tanpa mengubah baseline otomatis. | Selesai |
| Gate Flutter digabung ke Node? | Flutter jobs terpisah di workflow orkestrasi; kegagalannya tetap terlaporkan terpisah dari dependency execution Node, tanpa menjadi runtime dependency package TS. | Selesai |

## 8. Risiko dan mitigasi

| Risiko | Dampak | Mitigasi |
| --- | --- | --- |
| package registry belum berisi versi yang dibutuhkan | consumer gagal install | fail fast dengan pesan publish order dan versi |
| lockfile berbeda dari package.json | CI reproducibility rusak | frozen install sebagai default |
| cycle dependency dev | install/build membingungkan | catat cycle; jangan menyelesaikannya dengan source path tersembunyi |
| local relative path tersisa | build publik hanya lulus di satu mesin | grep/audit import dan clean checkout build |
| build menulis file tracked | working tree kotor setelah gate | gunakan dist ignored atau verifikasi lalu bersihkan dengan aman |
| workflow terlalu besar | diagnosis lambat | stage log dan job summary |
| baseline berubah diam-diam | hasil tidak dapat dibandingkan | manifest revision dan commit/tag eksplisit |

## 9. Exit gate Tahap 1

Tahap 1 hanya boleh ditandai selesai jika:

- [x] runner documented tersedia dari root workspace;
- [x] runner berhasil dari fresh checkout lokal;
- [x] semua package wajib lulus dalam dependency order pada checkout kerja lokal;
- [x] Playground lulus tanpa relative source dependency;
- [x] website lulus build dan artifact assertions pada checkout kerja lokal;
- [x] runner menghasilkan report yang menyebut workspace revision, baseline revision setiap submodule, compatibility line, dan versi package;
- [x] minimal satu CI workflow menjalankan gate atau subset yang setara;
- [x] failure injection sederhana terbukti menghasilkan failure yang jelas pada verifier;
- [x] dokumentasi root menjelaskan cara menjalankan gate;
- [x] master plan diperbarui dengan commit implementasi dan bukti runtime local/public/fresh-checkout/CI yang tersedia; public smoke dan reproduksi failure CI tertentu tetap terbuka.

## 10. Rencana eksekusi berikutnya

Implementasi runner sudah tersedia dan telah lulus pada local, public-registry, fresh-checkout, CI, serta public smoke. Failure CI lama juga sudah direproduksi pada checkout bersih dengan environment CI yang sama; Tahap 1 selesai dan pekerjaan berikutnya kembali ke urutan master plan.

Prasyarat runtime:

- Node.js 24 atau lebih baru;
- pnpm 10.33.3;
- checkout workspace dengan seluruh submodule ter-initialize;
- akses network ke npm registry untuk mode public;
- tidak ada perubahan tracked pada submodule ketika memakai mode strict.

Urutan kerja konkret:

1. jalankan `pnpm install --frozen-lockfile` dari root workspace;
2. jalankan `node scripts/verify-baseline.mjs --strict`;
3. jalankan `pnpm run verify:baseline:failure` dan pastikan mismatch revision ditolak;
4. jalankan `pnpm run integration:gate -- --local --report=.local/integration-local.json`;
5. setelah mode local lulus, jalankan `pnpm run integration:public -- --report=.local/integration-public.json`;
6. review report untuk package, Playground, website, dan artifact yang gagal; perbaiki di repository pemiliknya;
7. push workflow workspace, jalankan `Integration` melalui push, pull request, atau `workflow_dispatch`, lalu simpan URL run dan artifact report; **selesai**, `Integration #91` lulus;
8. setelah Pages deployment berhasil, jalankan public smoke test dan catat URL, commit website, serta baseline spec/Playground; **selesai**, 14 route pada `https://relgeo.github.io` mendapat HTTP 200;
9. pilih satu failure CI yang representatif, simpan log ringkasnya, lalu reproduksi dengan failure injection/local command; **selesai**, checkout `fe94149` menghasilkan 30 lulus dan 3 gagal pada package yang sama seperti CI;
10. setelah evidence reproduksi failure tersedia atau diputuskan tidak diperlukan untuk baseline, centang exit gate dan update master plan; **selesai**.

Mode public sengaja menguji versi registry yang dipin ke manifest, sedangkan mode local menguji workspace links. Keduanya diperlukan karena lulusnya satu mode tidak membuktikan mode lainnya.

## 11. Log perubahan sub-rencana

| Tanggal | Perubahan | Status |
| --- | --- | --- |
| 2026-09-15 | Sub-rencana Tahap 1 dibuat berdasarkan dependency graph dan kondisi baseline saat ini | siap untuk Stage A |
| 2026-09-15 | Inventory command, lockfile, package manager, dependency, dan clean status selesai | Stage A read-only selesai; package-manager standardization masih terbuka, sedangkan prerequisite auth/browser sudah dibedakan dari gate |
| 2026-09-15 | Manifest baseline dan verifier read-only ditambahkan | Stage B implementasi selesai; runtime regeneration masih terbuka |
| 2026-09-15 | Local-workspace integration runner dan workflow report ditambahkan | command Stage C/D terhubung; runtime evidence, registry mode, dan CI run masih terbuka |
| 2026-09-15 | Runner public-registry ditambahkan dengan temporary checkout dan pack dry-run | implementasi public mode selesai; runtime npm/CI evidence masih terbuka |
| 2026-09-15 | Failure injection verifier ditambahkan; peer dependency registry boundary dicatat | implementasi guard selesai; runtime gate dan CI evidence masih terbuka |
| 2026-09-15 | Runner diperketat dengan Node 24 check dan perakitan artifact Playground sebelum Pages assertion | implementasi fresh-checkout path lebih dekat dengan workflow Pages; runtime evidence masih terbuka |
| 2026-09-15 | Commit `cb98092` mem-pin versi registry pada temporary public gate | drift patch dependency ditutup secara desain; eksekusi npm/CI masih terbuka |
| 2026-09-15 | Workflow integration ditambah manual dispatch, timeout, dan concurrency cancellation | rerun manual dan proteksi terhadap run menumpuk tersedia; CI execution evidence masih terbuka |
| 2026-09-15 | Checkout CI dibuat read-only dan report artifact diberi retensi 7 hari; instruksi execution evidence diperbarui | hardening implementasi selesai; seluruh bukti runtime masih menunggu eksekusi |
| 2026-09-15 | Public pack boundary membaca output JSON dan menolak material lokal/secret/path traversal | implementasi tarball hygiene selesai; pack runtime masih menunggu CI/npm execution |
| 2026-09-15 | Pack boundary diperluas untuk seluruh file `.env.*`; pin registry dibatasi ke package `@relgeo/*` | hardening static selesai; runtime pack dan public gate masih terbuka |
| 2026-09-15 | Status matrix implementasi-versus-evidence ditambahkan dan master plan diselaraskan | pekerjaan implementasi terpetakan; runtime evidence tetap terbuka |
| 2026-09-15 | Node 24.21.0 dan pnpm 10.33.3 dipakai untuk strict verifier, failure injection, dan local integration gate | strict verifier serta failure injection lulus; local gate 33/33 lulus |
| 2026-09-15 | Public gate pertama menemukan fixture workspace, import sibling, dan urutan build/test yang belum checkout-safe; runner dan test boundary diperbaiki | diagnosis selesai; perubahan renderer-svg dan runner perlu masuk baseline |
| 2026-09-15 | Public-registry gate final dijalankan pada Node 24.21.0/pnpm 10.33.3 dengan package `@relgeo/*` dipin ke manifest | 48/48 stage lulus, termasuk Playground, website, Pages artifact assertion, dan pack boundary |
| 2026-09-15 | Fresh checkout probe dari commit workspace `a65c542` berhasil mengambil 10 submodule lalu berhenti karena commit `renderer-svg@3b66780` belum tersedia pada remote GitHub | blocker diselesaikan dengan push submodule renderer-svg dan root pointer |
| 2026-09-15 | Fresh checkout dari GitHub `workspace@8d54163` diinisialisasi dengan seluruh 11 submodule dan menjalankan strict verifier serta local integration gate | fresh-checkout lulus; strict verifier 81 checks dan integration gate 33/33 lulus |
| 2026-09-15 | Workflow GitHub `Integration #87` pada commit `04960d3` diverifikasi selesai sukses | CI integration gate lulus; public smoke dan reproduksi failure CI tertentu masih terbuka |
| 2026-09-15 | Public smoke test dijalankan terhadap `https://relgeo.github.io` | 14/14 route HTTP 200; public smoke lulus; hanya reproduksi failure CI tertentu yang tersisa |
| 2026-09-15 | Failure run `#85` direproduksi dari checkout bersih `fe94149` dengan `CI=1` | gate lama menghasilkan 30 passed dan 3 failed pada `renderer-svg`, `remark-relgeo`, dan `cli`; akar masalah urutan test sebelum build serta import dist lokal; failure dapat direproduksi dan sudah tertutup oleh baseline baru |
| 2026-09-16 | Local integration gate diperluas dengan automated browser smoke Playground | gate memasang Chromium sesuai environment, menjalankan `test:e2e` setelah build, dan menjaga unit test terpisah dari folder `e2e`; CI pascapush masih diperlukan |
| 2026-09-16 | Baseline revision website, Playground, dan Flutter disegarkan setelah submodule dipush | strict verifier lulus `81/81`; integration gate lokal pada workspace clean lulus `36/36`, termasuk package, E2E, website, Pages artifact, dan conformance `204/204` |
| 2026-09-16 | Official Playground E2E dibuat deployment-aware | `playwright.config.ts` menerima `PLAYWRIGHT_BASE_URL`, `goto('./')` aman untuk base path `/playground/`, dan command yang sama lulus lokal `2/2` serta terhadap `https://relgeo.github.io/playground/` `2/2`; perubahan dipush sebagai `playground@143acf6` |
| 2026-09-16 | CI memverifikasi baseline Playground deployment-aware | root pointer `playground@143acf6` tercatat pada `workspace@9e77d33`; local integration gate lulus `36/36` dan GitHub `Integration #94` sukses pada job `flutter`, `verify`, dan `public` |
| 2026-09-18 | CI memverifikasi release record completed dan Flutter macOS pada baseline terbaru | `Integration #129` pada `workspace@aea1188` sukses pada job `verify`, `flutter`, `flutter-macos`, dan `public`; release record `0.5.0`/`0.5.1`, failure-injection release guard, conformance, serta dua browser smoke tetap lulus |
| 2026-09-18 | Pin Node lokal ditambahkan dan diverifikasi pada CI | root `workspace@321c7b2` memiliki `.node-version` `24.21.0`; `Integration #132` sukses pada job `verify`, `flutter`, `flutter-macos`, dan `public` dengan durasi 3m58s |
| 2026-09-23 | CI lintas-repo terakhir yang tercatat sukses | `Integration #151` pada `workspace@21ee21b` sukses untuk job `flutter`, `flutter-linux`, `flutter-macos`, `flutter-windows`, `verify`, dan `public`; pointer setelahnya belum mendapat CI refresh |
| 2026-10-08 | Baseline HEAD direkonsiliasi tanpa memperluas klaim CI | workspace `d3ec2b0`, strict `81/81`, compatibility `283/283`, conformance `253/253`; transcript manual `.internal/tmp-test.txt` mencatat local `35/35` dan public `50/50`; artefak executor `33/36`, `6/35`, dan `2/11` dipertahankan sebagai diagnostic history; `Integration #151` tetap evidence CI historis untuk pointer sebelum `flutter@edc9488` |
| 2026-10-09 | MCP dipindahkan ke submodule resmi dan Flutter standalone CI diperbaiki | root memiliki `mcp@6fd5cb2`; Flutter CI child commit `804afba` meng-checkout `relgeo/mcp` sebagai sibling `../mcp` sebelum locked dependency install; root gitlink update dan canonical CI rerun masih perlu dilakukan |
