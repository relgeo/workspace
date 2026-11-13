# Generic Markdown host contract

**Scope:** local Node SSR/static execution for the supported unified pipeline
**Verification:** `node scripts/validate-markdown-generic-host.mjs`
**Date:** 2026-11-13

The supported generic host order is explicit:

```text
remark-parse
  → remark-relgeo-hl
  → remark-relgeo
  → remark-rehype
  → host preview normalization
  → rehype-stringify
```

`remark-relgeo-hl` owns `rg` source projection and `remark-relgeo` owns
`relgeo` preview projection. Both plugins run while the tree is mdast. The
host must run its rehype normalization after `remark-rehype`: a generated
preview or preview-error wrapper may arrive inside the parser's `pre` shell,
so the host replaces that shell with the marked preview wrapper. This is an
explicit generic-host adapter contract, not an Astro-only implicit behavior.

The host contract also defines these boundaries:

- Non-target fences remain ordinary Markdown code blocks.
- A malformed preview block remains block-scoped and becomes a visible
  diagnostic placeholder under the default tolerant policy.
- Valid highlight and preview blocks preserve their surrounding paragraphs and
  deterministic order.
- The transform executes in Node without `window`, `document`, filesystem
  reads, or network fetches; preview assets use the package's inline data URI
  policy.
- Browser interaction, deployed-host smoke, registry installation, and
  physical assistive-technology checks are separate boundaries and are not
  inferred from this local harness.

The fixture intentionally exercises one no-op `js` fence, one `rg` fence, one
malformed `relgeo` fence, and one valid `relgeo` fence twice. It asserts output
ordering, block isolation, deterministic repeatability, and absence of browser
globals, and the relative order of highlight output before preview output.
