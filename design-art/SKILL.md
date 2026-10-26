---
name: design-art
description: Use when a product, landing page, website, hero, campaign page, portfolio, product page, or frontend concept needs premium section-by-section visual references before implementation. Also the next step after a design-grill session: turns its design doc into the first visual reference.
---

# Design Art

Design Art creates the visual-reference package for new frontend concepts. It generates section references and a mechanical full-page assembly. It does not implement code.

Supporting files live next to this file: `references/`, `templates/`, `assets/grids/`.

## Core Contract

The output is an implementation-ready visual package:

- separate horizontal image per section;
- one mechanically stitched full-page preview;
- section order and roles;
- style lock;
- assumptions and must-avoid notes;
- handoff notes for the implementation step (for example image-to-code) and for any asset generation.

Do not create one tall generated poster as the only source of truth. Section images are the source of truth; the full-page assembly is for rhythm and review.

## Start From A Design Doc

If the project has a design doc from a `design-grill` session (`docs/*-design.md`) or its prototype (`docs/*-visual.html`), read them first. Treat their locked decisions, section order and terms as already-answered brief items, and ask only about what they leave open: usually visual direction, color, typography and imagery.

## Brief Gate

Ask one high-impact question per turn when needed. Do not dump a questionnaire. See `references/briefing-flow.md`.

Cover enough of:

- product/offer;
- audience;
- surface type;
- primary job of the page;
- message and conversion goal;
- section count and section roles;
- must show / must avoid;
- brand status and existing design context;
- desired visual direction;
- color and density posture;
- implementation constraints;
- confidence and unknowns.

If the owner delegates taste, recommend a direction, name the tradeoff, and ask for approval before generation.

## Style Direction Menu

Before ImageGen, offer 3-5 practical directions unless the owner already chose one or gave a reference image.

Each option should include:

- short name;
- why it fits;
- what changes visually;
- density, palette, typography, media, hero architecture, section system;
- what it deliberately avoids.

Do not hide the style decision inside internal reasoning. Do not generate until the owner chooses, approves the recommendation, or explicitly delegates.

When the owner brings a reference image or wants to combine variants, use `references/remix-flow.md`.

## Style Lock

Convert the approved direction into a style lock:

- theme paradigm;
- background character;
- typography character;
- hero architecture;
- section system;
- signature component set;
- palette posture;
- image/media posture;
- CTA family;
- forbidden style moves.

Every section prompt must use this same style lock. If a section drifts outside it, regenerate that section.

## Section Generation

Follow `references/imagegen-reference-generation.md`, `references/subagent-isolation.md` and `references/grid-reference.md`. Generate one image per section:

- same target width/device class;
- clear section footprint;
- implementation-friendly layout;
- real visual content, not placeholder boxes;
- readable UI text where text is part of live UI;
- no contact sheets;
- no multi-variant boards as final references;
- no accidental neighboring sections inside a section image.

Score every candidate with `references/reference-director.md` (template: `templates/reference-score.md`) before the owner selects.

For dashboards and operational tools, keep density useful and component logic clear. For marketing/editorial pages, visual richness is welcome, but hierarchy and implementation clarity still matter.

## Full-Page Assembly

After section images are accepted:

1. collect section image files in order;
2. align widths by resizing or padding only when needed;
3. stack vertically;
4. save full-page assembly;
5. do not use ImageGen, inpainting, new prompts, overlays, transitions, or decorative generated pixels for assembly.

The assembly is equivalent to stitching screenshots.

## Local Image Discovery

Before generation, create a marker:

```bash
mkdir -p .codex/design-art
touch .codex/design-art/imagegen-start.marker
```

After generation, search:

```bash
find "${CODEX_HOME:-$HOME/.codex}/generated_images" "$PWD/.codex/generated_images" \
  -type f \( -name '*.png' -o -name '*.jpg' -o -name '*.jpeg' -o -name '*.webp' \) \
  -newer .codex/design-art/imagegen-start.marker \
  -print 2>/dev/null | sort
```

Use discovered paths as the package record. If ordering is ambiguous, ask the owner rather than pretending assembly is impossible.

## Handoff

Hand off, following `references/visual-reference-package.md` and `references/handoff-to-implementation.md`:

- section images;
- full-page assembly;
- style lock;
- story map;
- section roles;
- generated image paths;
- asset opportunities (cutouts, backgrounds, icons) for a separate asset-generation step;
- implementation notes for the implementation step;
- unresolved owner decisions.

## Hard Gates

- Do not implement frontend.
- Do not generate reusable insertable assets here when the task belongs to a separate asset-generation step.
- Do not use a full-page assembly as the source for section detail.
- Do not present a section package as final if section order, paths, or style lock are missing.
- Do not produce generic AI-purple, beige luxury, decorative orb, card-grid slop unless deliberately approved.

## Supporting Files

- `references/` — briefing, generation, scoring, remix, isolation, handoff and `DESIGN.md` rules;
- `templates/` — prototype brief, reference score, validity check, crop manifest;
- `assets/grids/` — pinned desktop grids attached as invisible structure.
