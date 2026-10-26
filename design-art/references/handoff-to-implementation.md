# Prototype To Implementation Handoff

Use this after the owner selects or approves a prototype reference.

## Required

- selected reference image;
- prompt and provenance;
- grid reference used;
- reference dimensions;
- target viewport;
- page story map;
- `DESIGN.md` path or design-context seed;
- `reference-score.md` verdict;
- validity notes;
- selected full-page composition map;
- top-to-bottom block crop package for any long grid-conditioned reference;
- crop manifest with crop order, pixel bounds, source image, and intended implementation role;
- optional `visual-anchors.json`;
- known accepted deviations;
- implementation intent.

## Block Crop Gate

Before handing a selected prototype reference to the implementation step, crop long grid-conditioned references into implementation-scale blocks from the top of the page to the bottom.

A crop package is required when the selected reference uses the pinned long-page grid, is taller than the intended first viewport, or would force the implementation step to infer block details from one oversized image.

The crop package must:

- cover the selected reference from top to bottom with no missing page regions;
- preserve vertical order in filenames, for example `crop-01-hero.png`, `crop-02-capabilities.png`;
- use natural page sections or implementation blocks, not arbitrary tiny fragments;
- include enough overlap or context for adjacent blocks when a section boundary is ambiguous;
- record source image, crop bounds, dimensions, block name, and intended implementation role;
- include the full selected reference as the composition map, but never as the only implementation input for a long page.

## Do Not

- start implementation before owner selection;
- drop existing `DESIGN.md` or design-context seed from handoff;
- hand off a long grid-conditioned reference as only one full-page image;
- treat one first-viewport crop as complete coverage for a long page;
- treat rejected variants as implementation inputs;
- give the implementation step a poster-like reference without adaptation notes;
- hide uncertainty about unreadable text, impossible layers, or unclear asset zones.
