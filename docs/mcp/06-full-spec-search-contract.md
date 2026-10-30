# Full-Spec Search and Section Retrieval Contract

**Status:** frozen contract boundary for Plan 14
**Implementation boundary:** pure Dart `mcp/`; no Flutter, filesystem, HTTP, or semantic-engine dependency
**DSL line:** RelGeo `0.5.x`

This document freezes the data contract used by the snapshot, index, and
adapter tasks. The source of truth remains `spec/id/`; the contract only
carries an immutable snapshot into the MCP boundary. Runtime support is
conditional: the adapter advertises retrieval only when the host has supplied
the pinned snapshot/index.

## 1. Tools and compatibility

The contract-only catalog in
[`mcp_schema.dart`](../../mcp/lib/src/contract/mcp_schema.dart) defines:

| Tool | Input | Output | Bounds/behavior |
| --- | --- | --- | --- |
| `relgeo_search_spec` | `SearchSpecInput` | `SearchSpecResult` | `query` 1–512 characters; `maxResults` 1–32, default 8; empty results are successful with `matches: []` and `noResults: true` |
| `relgeo_get_spec_section` | `GetSpecSectionInput` | `GetSpecSectionResult` | requires one stable `sectionId`; unknown IDs are an explicit adapter `not found` error, never a fabricated section |

Both tools are read-only. `relgeo_find_syntax` is recorded as the compatibility
alias for search and, when the index is loaded, routes to the same
corpus-backed implementation. A host without the snapshot must not advertise
the new tools; direct calls return an explicit unavailable-snapshot error.

## 2. Stable section identity

`SpecSectionId` serializes as:

`<relative-path-under-spec/id>#<stable-anchor>`

Examples are `geometry/14-geometry-objects.md#143-rect` and
`syntax/08-parameters.md#8-parameters`.

Rules:

- path is POSIX-style, relative to `spec/id/`, ends in `.md`, and cannot begin with `/`, `./`, `../`, or contain backslashes;
- anchor is non-empty, has no path separator, `#`, or whitespace;
- anchor is generated deterministically from the Markdown heading normalization used by the snapshot builder;
- the ID does not include snapshot revision or digest, so the same source heading can be compared across snapshots;
- `relativePath` and `anchor` are returned separately alongside `sectionId`.

`resources/templates/list` advertises the resource form
`relgeo://spec/sections/{sectionId}`. The `sectionId` is percent-encoded as one
URI segment when constructing a concrete URI, for example
`relgeo://spec/sections/geometry%2F14-geometry-objects.md%23143-rect`.
`resources/list` contains only concrete resources such as
`relgeo://spec/index`; it does not list the URI template as if it were a
readable resource. URI parsing validates the decoded ID before any resource
provider is called.

## 3. Snapshot and provenance

`SpecSnapshotMetadata` is required on search and section results:

| Field | Meaning |
| --- | --- |
| `specVersion` | DSL compatibility line represented by the snapshot, currently `0.5` |
| `revision` | source revision/tag identity selected by snapshot sync |
| `digest` | digest of the deterministic snapshot manifest/content |
| `digestAlgorithm` | currently `sha256` |
| `sourceUrl` | root source URL for `spec/id/` |
| `fileCount` | number of Markdown files included in the snapshot |

Each section/match carries `SpecProvenance` with the section source URL,
version, revision, digest, and `SpecDocumentStatus`. Status is one of
`normative`, `informative`, or `implementation-note`.

`isNormative` is derived only from `status == normative`. This is deliberately
different from generic `McpProvenance.isNormative`: an informative Markdown
index can still have `source: spec` while remaining non-normative.

## 4. Search result shape

Each `SearchSpecMatch` contains `sectionId`, `relativePath`, `anchor`, `title`,
top-down `parentHeadings`, a bounded relevant `snippet`, a non-negative
deterministic `score`, and `provenance`.

`SearchSpecResult` preserves the original query, ordered matches, and snapshot
metadata. Search ordering is later defined by the index implementation as
descending score, then stable `relativePath`, then stable `sectionId`.

No-result behavior is a normal successful result:

```json
{
  "query": "unmatched",
  "matches": [],
  "noResults": true,
  "snapshot": { "specVersion": "0.5", "revision": "…", "digest": "…" }
}
```

## 5. Complete section shape

`GetSpecSectionResult.section` returns the complete source section, including
the matched heading and all Markdown content up to—but not including—the next
heading of the same or higher level. It contains the same section identity,
title, parent headings, source Markdown content, and provenance fields exposed
by search.

The adapter must return the same section ID, provenance revision, and digest
that the search result exposed. A missing section ID is an explicit not-found
error and cannot fall back to the first section or to a hardcoded rule.

## 6. Fixture query catalog

`relGeoSpecSearchFixtures` in the Dart contract provides the first deterministic
query catalog for later index tests:

| Fixture | Query | Required coverage |
| --- | --- | --- |
| `box` | `kotak rect rectangle` | geometry object and placement |
| `parameters-and-constants` | `parameters constants` | two syntax chapters with separate provenance |
| `point-on-path` | `point on path placement` | placement and anchors |
| `presentation` | `dimension annotation views sheets` | presentation chapter coverage |
| `no-result` | `zzzz-no-relgeo-section-999` | honest empty result |

Later tests may assert additional relevant results, but must preserve these
minimum expected IDs and statuses and must verify that examples are not
promoted to normative sections.

## 7. Boundary and non-goals

The contract does not read repository paths, calculate digests, parse Markdown,
rank terms, fetch remote documentation, edit documents, validate source, or
create images. Snapshot sync owns bytes and digest; the runtime index owns
heading parsing and ranking; Flutter owns asset loading; the MCP adapter owns
wire validation and routing. Plan 13 catalog changes, npm/pub.dev release,
remote MCP, and production deployment are not prerequisites for this contract.
