# Full-spec index runtime

The pure-Dart MCP package now provides `SpecSectionIndex` as the runtime
boundary between a host-loaded snapshot and MCP operations. The package never
opens a repository path or Flutter asset; the host supplies
`SpecMarkdownDocument` values plus `SpecSnapshotMetadata`.

The index:

- parses ATX Markdown headings while ignoring headings inside fenced code;
- derives stable anchors from normalized heading titles and preserves relative
  paths, parent headings, document status, source URL, revision, and digest;
- returns complete section content until the next heading of the same or
  higher level;
- ranks title, path, parent-heading, phrase, and body matches with bounded
  snippets and deterministic path/section-ID tie-breaks;
- exposes descriptor-only index JSON and complete section JSON for the two
  `relgeo://spec/...` resources;
- rejects sections larger than the package response bound rather than
  producing an unbounded MCP payload.

`RelGeoMcpToolDispatcher` and `RelGeoMcpResourceStore` accept an optional
`SpecSectionIndex`. When present they advertise and serve
`relgeo_search_spec`, `relgeo_get_spec_section`, the compatibility alias
`relgeo_find_syntax`, `relgeo://spec/index`, and section resource URIs. The
legacy desktop fallback no longer fabricates a normative `rect` rule when no
snapshot is loaded; the next host/asset bridge supplies the index.

The behavior is covered by `mcp/test/spec_index_test.dart` and the full
`mcp/test/` suite. Flutter and the desktop host remain responsible for loading
the bundled snapshot and constructing the index.
