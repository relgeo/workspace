# Website claim, locale, and provenance contract

**Status:** frozen local contract for the website/Pages handoff  
**Date:** 2026-11-03  
**Scope:** `WEB-PAGE-003`, `WEB-PAGE-004`, `WEB-PAGE-005`, and `WEB-PAGE-015`

This document freezes the public claims that the website may make at the
current RelGeo DSL `0.5` boundary. It is a contract for presentation and
provenance; it does not move normative ownership from `spec/id`, and it does
not close deployment or public-host evidence gaps.

## 1. Frozen discovery and reference behavior

The active website baseline for `WEB-PAGE-003` is a deterministic, localized
docs/spec topic index:

- `/id/docs/` and `/en/docs/` expose the same route families in the active
  locale;
- the index contains orientation pages, usage surfaces, language-status
  context, and top-level language-spec sections;
- client-side filtering is labeled as wayfinding, reports the visible count,
  preserves direct route links, and exposes an explicit localized no-result
  state; and
- query/server search is not part of this frozen claim. The website must not
  describe the baseline as full-site search or imply server-side indexing.

This deterministic index is sufficient for the current local wayfinding
baseline. Any later query/server search is a separate product change and must
add its own implementation and evidence contract.

## 2. Frozen locale and normative-source disclosure

`spec/id` is the only normative language source at this boundary. The website
loads and presents that source; it must not rewrite its semantics.

The `/en/docs/language-spec/` route family is an **editorial mirror** of the
active Indonesian normative source, not a completed English translation. The
same source may therefore be rendered under an English route for stable
wayfinding, but that route must visibly disclose all of the following:

1. English presentation is an editorial mirror.
2. English is not a translated normative contract yet.
3. The Indonesian language-spec route is the active contract reference.
4. Full English normative parity is not claimed.

The disclosure applies to the English language-spec index and every generated
English language-spec chapter. English onboarding and product documentation
may be editorially translated, but it must not be used to imply that the
English language-spec mirror has normative authority.

The disclosure can be retired only after a separately reviewed English spec
translation is complete for the declared surface, is checked against the same
normative revision, and its public claim is changed deliberately. Until then,
any ambiguous wording such as “English language spec” must be read as a route
label, not as a parity claim.

## 3. Canonical public claim fields

Public status pages and build/provenance reports use separate fields. They must
not collapse a DSL contract version, package version, source revision, and
deployment revision into one generic “version”.

| Field | Frozen value or source | Meaning |
| --- | --- | --- |
| `dslContractVersion` | `0.5` from `docs/compatibility-matrix.json` | Active language-contract line; semantic authority is `spec/id`. |
| `websitePackageVersion` | `0.5.0` from `relgeo.github.io/package.json` | Website deployment application version; not a DSL release. |
| `playgroundPackageVersion` | `0.4.0` from `playground/package.json` | Playground application version; not a DSL release. |
| `normativeSpecPath` | `spec/id` | Source tree that owns active language meaning. |
| `websiteRevision` | `c5ca17f06476fd2beeb4a48e971265a0e57495c7` | Website commit selected for this synchronized local handoff. |
| `specRevision` | `26ff53278d77d916b0e0e6c26ca9ab496232fbc0` | Normative spec commit selected for this synchronized local handoff. |
| `playgroundRevision` | `c263920146a7ba28fe76561df25d1174b289663b` | Playground commit selected for this synchronized local handoff and Pages pin. |
| `deploymentRevision` | Set only by the Pages run that built/deployed the tuple above | A deployment/run identity; never inferred from a package version. |

The exact frozen source tuple is therefore:

```text
website  = c5ca17f06476fd2beeb4a48e971265a0e57495c7
spec     = 26ff53278d77d916b0e0e6c26ca9ab496232fbc0
playground = c263920146a7ba28fe76561df25d1174b289663b
```

The current checkout has the selected website, spec, and Playground commit
identities, the Pages workflow pins the selected spec and Playground revisions,
and `docs/integration-baseline.json` records the same frozen tuple. Local
provenance and assembled-artifact gates therefore prove synchronization for
this revision set. Deployment, CI-run, and public-host evidence remain separate
claims and must not be inferred from the local gate.

## 4. ID-to-contract binding

| ID | Binding in this contract | Must not be claimed |
| --- | --- | --- |
| `WEB-PAGE-003` | Deterministic localized topic index, filtering, live count, direct links, and no-result behavior. | Full query/server search or public search reliability without browser/host evidence. |
| `WEB-PAGE-004` | Stable `id`/`en` route context with the English editorial-mirror disclosure. | Full English normative translation or semantic parity. |
| `WEB-PAGE-005` | Distinct onboarding/docs/reference surfaces, with `spec/id` identified as authoritative and `/en` reference marked as a mirror. | Bilingual normative-reference completeness. |
| `WEB-PAGE-015` | Separate DSL/package/application/deployment fields plus the exact source tuple above. | A single generic version claim, synchronized artifact, or deployed status before its evidence exists. |

## 5. Evidence boundary

This contract is implementation-ready and intentionally does not claim that
all evidence is complete. Local built-output assertions verify the index
markers, mirror disclosure, metadata shell, route generation, and synchronized
assembled artifact for the frozen tuple. Missing CI, deployment, or public-host
evidence is “not verified / environment unavailable”, not a reason to change
the locale or claim contract.
