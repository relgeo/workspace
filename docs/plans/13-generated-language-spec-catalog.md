# Sub-Rencana 13 — Generated Language Spec Catalog

**Status:** ditunda; bukan prasyarat implementasi pencarian penuh spec MCP. Katalog generator dan integrasi konsumennya belum diimplementasikan.  
**Repository coordinator:** `relgeo/workspace`  
**Normative source owner:** `relgeo/spec` (`spec/id/`)  
**Consumers:** `relgeo/language-service`, `relgeo/mcp`, and RelGeo Desktop through MCP  
**Initial compatibility line:** RelGeo DSL `0.5.x`

## 1. Goal

Maintain RelGeo language knowledge in one place and make it usable by both
people and software:

```text
Normative Markdown in spec/id/
              ↓ deterministic generator
Versioned generated JSON catalog
          ↙                 ↘
Language Service             MCP
```

The Markdown spec remains the only manually maintained source for language
rules. The generated JSON catalog is the canonical machine-readable artifact.
Language Service and MCP may expose different views and capabilities, but they
must derive those views from the same catalog instead of keeping separate
handwritten vocabularies or rule summaries.

The existing structural JSON Schema remains a distinct concern: it validates
document shape. The generated catalog provides rule content, identifiers,
examples, and provenance. Where the Markdown defines structured fields and
values, generation may also produce or feed schema/completion data, but the
generator must not infer semantics from ambiguous prose.

## 2. Current baseline

- `spec/id/` is identified as the active normative RelGeo DSL v0.5 source.
- `language-service/src/schema.ts` contains a handwritten JSON Schema.
- `language-service/src/completions.ts` contains handwritten completion
  catalogs.
- `language-service/src/schema-drift.ts` compares those catalogs with a
  manually maintained active-vocabulary snapshot.
- MCP currently has a handwritten desktop syntax entry for `geometry.rect`.

These are useful current implementation artifacts, but they do not yet form a
generated, complete, shared spec catalog. The rect-only MCP entry is a known
coverage limitation and should be replaced by catalog-backed search and lookup.

## 3. Source and generated artifact boundaries

### 3.1 Authoritative source

`spec/id/` remains the authoritative source for active language rules. Each
chapter's `Normative`/`Informative` status controls whether its content can
enter the normative-rule index. Informative material and examples can still be
included as separately classified supporting content.

The editorial convention should make extraction stable:

- preserve existing numbered chapter and section headings;
- assign durable rule IDs explicitly where heading-derived IDs are not stable
  enough;
- use consistent section labels for syntax, fields, semantics, rules, and
  examples;
- label code fences by role (for example `normative syntax`, `illustrative
  example`, or `counterexample`) when role cannot safely be inferred;
- make property/value tables machine-readable through a defined table shape or
  explicit metadata rather than guessing from arbitrary prose.

The convention should add the smallest amount of authoring markup needed for
reliable generation while keeping Markdown readable in an editor and on the
website.

### 3.2 Generated catalog

Store the generated JSON in the `relgeo/spec` repository, alongside the source
Markdown, under a versioned path. Proposed layout:

```text
spec/
├── id/                         # normative Markdown source
└── generated/
    └── v0.5/
        └── catalog.json       # generated; do not edit by hand
```

The implementation spike may refine the catalog schema, but should keep the
artifact under `spec/generated/` and retain a DSL-versioned directory. This
makes the owner and generated status clear while allowing a future DSL line to
have its own catalog.

At minimum, catalog metadata should include:

- catalog schema version and RelGeo DSL version;
- source revision or deterministic digest identifying the Markdown input used
  to generate the catalog;
- stable rule ID, title, summary, and normative status;
- source file, section number, heading/anchor, and repository-relative URL;
- extracted Markdown content without semantic paraphrasing;
- structured fields, accepted values, and constraints when the source marks
  them in an extractable form;
- examples with their role and source location;
- aliases/search terms only when explicitly declared in the source.

Generation must be deterministic: stable ordering, stable serialization,
normalized line endings, and no current timestamps or machine-specific paths.
The generator must fail on malformed or ambiguous marked-up constructs rather
than silently omitting normative material.

## 4. Consumer responsibilities

### 4.1 Language Service

Language Service consumes the generated catalog for rule documentation,
context-aware field/type descriptions, and stable vocabulary where represented
in structured spec metadata. It keeps editor-specific behavior (completion
ranking, cursor context, diagnostics presentation) in the package, but should
not redefine the language contract in a parallel catalog.

The structural JSON Schema is migrated in an evidence-led way. First compare
its current coverage to the catalog and core parser/validator behavior. Then
generate the overlapping vocabulary/constraints from structured catalog data
where feasible. Any schema rule that cannot be derived from spec metadata must
be identified as an explicit implementation/schema concern, not silently
treated as normative source text.

### 4.2 MCP

MCP consumes the catalog to provide:

- `relgeo_find_syntax`: search all indexed normative rules;
- `relgeo_get_syntax_rule`: return the complete selected rule and provenance;
- resources for the catalog index and individual rules;
- supporting examples, clearly labeled as illustrative rather than normative.

Search matching and result formatting may be MCP-specific. Rule content, IDs,
version, and source links must come from generated catalog data. No rule list,
summary, alias, or sample may be copied into MCP by hand when it belongs to the
spec catalog.

### 4.3 Distribution across repositories

The spec repository owns and versions the generated artifact. Workspace
integration must make the artifact available to both consumer builds. Each
consumer may bundle the catalog into its release/package for runtime use, but
bundled copies are generated build/package inputs and must be verifiably tied
to a catalog version or digest; they are not separately editable sources.

Implementation must select and document a delivery mechanism that works for
both the published Language Service package and the Flutter-embedded Dart MCP
package. Options to evaluate include a versioned `@relgeo/spec-catalog`
package, workspace-generated package assets, or checked-in generated consumer
artifacts refreshed by the integration workflow. Choose one mechanism after a
small packaging spike; do not mix mechanisms across consumers without a clear
reason.

## 5. Implementation phases

### Phase 0 — Audit and extraction spike

1. Inventory normative chapters and headings under `spec/id/`.
2. Compare heading patterns, tables, code fences, and current language-service
   schema/completions against the Markdown.
3. Identify structures that can be extracted reliably and ambiguous areas
   requiring explicit editorial markers.
4. Prototype generation for representative core, geometry, and presentation
   rules, including `rect`, to validate the catalog shape and stable IDs.

**Exit criteria:** agreed catalog schema, extraction conventions, packaging
options, and a documented list of content that requires source cleanup.

### Phase 1 — Editorial convention and deterministic generator

1. Update the spec editorial guide with the machine-indexable Markdown rules.
2. Implement a generator owned by the spec/workspace boundary.
3. Generate the complete active v0.5 catalog from normative Markdown.
4. Add generator validation for missing IDs, duplicate IDs, invalid source
   references, unsupported marked constructs, and missing normative sections.
5. Check in the generated catalog and provide a `generate` and `check` command.

**Exit criteria:** repeated generation yields byte-identical JSON; all active
normative chapters are represented or explicitly excluded with rationale.

### Phase 2 — Language Service migration

1. Load the generated catalog through the selected package/build mechanism.
2. Replace handwritten rule documentation and overlapping vocabulary with
   catalog-backed data.
3. Preserve editor-specific ranking and interaction behavior in Language
   Service.
4. Reconcile `RELGEO_SCHEMA`, completion catalogs, and parser/core behavior;
   migrate only fields that are explicitly represented in generated data.
5. Replace the hard-coded vocabulary drift snapshot where generated coverage
   permits it.

**Exit criteria:** Language Service can return source-linked normative
documentation, and its published package contains the catalog version it was
built against.

### Phase 3 — MCP migration

1. Replace `_rectSyntaxMatch` and `_rectSyntaxDocumentation` with generated
   catalog search/lookup.
2. Index all supported normative rules; preserve rule IDs, version, and source
   links from the catalog.
3. Keep examples separately classified and sourced; do not present examples as
   the answer when the user asks for the governing spec.
4. Update capability descriptions and desktop MCP guidance to report actual
   catalog coverage and its limitations.
5. Ensure MCP runtime works from its bundled artifact without requiring users
   to install the workspace or access repository files.

**Exit criteria:** MCP can find and return rules beyond `rect`, distinguishes
normative rules from examples, and identifies the exact spec version/source in
each result.

### Phase 4 — CI, releases, and drift prevention

1. Add a workspace gate that checks generated output is current.
2. Verify Language Service and MCP build inputs reference the same catalog
   version/digest.
3. Run consumer validation against representative rules and examples.
4. Document the spec-first change workflow and release order.
5. Make catalog version compatibility visible in package metadata or generated
   build metadata.

**Exit criteria:** stale generated consumer data fails the integration gate;
updating a rule requires editing Markdown and regenerating, not manually editing
consumer copies.

## 6. Validation and acceptance criteria

- Every active normative chapter is indexed, or has an explicit exclusion
  rationale.
- Every returned rule includes stable ID, spec version, source file/section,
  and source URL or resolvable source reference.
- Normative content and illustrative examples are separately classified.
- Generated output is deterministic and has no unreviewed hand edits.
- Language Service and MCP consume the same generated catalog version/digest.
- MCP syntax lookup is no longer limited to a manually entered `rect` rule.
- The generated artifact can be bundled into consumer releases without
  requiring runtime access to the workspace or GitHub.
- Changes to Markdown conventions are documented in `spec/id/editorial-guide.md`.
- CI reports missing, duplicate, or stale generated entries with actionable
  paths and IDs.

## 7. Non-goals and safeguards

- Do not rewrite or auto-summarize normative prose into new meanings.
- Do not treat every code fence as a normative grammar definition.
- Do not make examples the source of language rules.
- Do not force JSON Schema to represent semantic constraints it cannot express.
- Do not make Language Service or MCP maintain private copies of rule text.
- Do not change DSL semantics merely to fit the generator; revise the spec
  convention first and review semantic changes separately.

## 8. Open decisions for the implementation spike

1. Should durable rule IDs be explicit in Markdown, or derived from current
   section numbers with redirects/aliases when sections move?
2. Should generated JSON be published as a small versioned package, or be
   bundled into the Language Service and MCP packages by workspace generation?
3. Which spec tables and code-fence labels are sufficiently consistent for
   automatic extraction today, and which need editorial cleanup first?
4. Which parts of `RELGEO_SCHEMA` can safely be generated from spec metadata,
   and which should stay implementation-owned?

These decisions belong to Phase 0 and should be resolved before broad consumer
migration.
