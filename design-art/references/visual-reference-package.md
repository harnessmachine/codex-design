# Visual Reference Package

Use this package shape whenever a generated or redesigned reference is handed to implementation.

## Required

- accepted reference image path;
- prompt used;
- provenance notes;
- reference dimensions;
- intended browser viewport;
- grid reference path if used;
- `DESIGN.md` path or design-context source if used;
- design-context seed or `not available`;
- validity notes;
- `reference-score.md` verdict for generated/prototype references;
- top-to-bottom block crops for long generated/prototype references;
- crop manifest with order, bounds, dimensions, source image, and block role;
- full-page composition map for long references;
- optional `visual-anchors.json` for key elements to verify;
- image-like zone inventory and expected decomposition mode for complex assets;
- icon source decision if icons are visible in the reference;
- selection or rejection rationale;
- owner decision;
- next workflow target.

## Crop Package Gate

For long generated/prototype references, the full image is a composition map. It is not enough for implementation handoff.

Before implementation handoff, provide a crop package that covers the accepted reference from top to bottom in page order. Use section or block-sized crops that the implementation step can implement directly, and record crop bounds and roles in a manifest.

## Validity First

Select references in this order:

1. production-page validity;
2. buildability;
3. grid, type, and component clarity;
4. product coherence;
5. creative value;
6. downstream implementation result.

The best reference is not the prettiest image. It is the image that gives implementation the strongest buildable direction.
