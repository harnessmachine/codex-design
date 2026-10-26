# Reference Director

ImageGen output is a candidate, not a handoff. Design Art must review each generated image before owner selection.

## Reference Input Is Mandatory

Every ImageGen attempt must run in an isolated clean subagent and receive image reference context. This includes first batches, regenerations, direction changes, "more like this" batches, section-first runs, wireframe-skin runs, remixes, and targeted block edits.

- always attach the pinned grid image as invisible structure; grid-only is valid only for the first pure greenfield batch;
- attach `DESIGN.md` summary, design-context seed, approved wireframe, approved previous section, or selected remix reference when available;
- for section-first or stitching runs, attach adjacent/previous section reference when continuity matters;
- if no image reference can be attached, stop and report the blocker instead of asking ImageGen to invent from text alone.

Human prompt language goes to the ImageGen subagent. The orchestrator keeps the contract: viewport, grid, section inventory, component grammar, asset zones, and forbidden unbuildable outputs.

## Score Before Selection

Do not present a generated reference as selectable until it has a `templates/reference-score.md` style verdict:

```text
Buildability: 1-5
Grid consistency: 1-5
Typography readability: 1-5
Component realism: 1-5
Product specificity: 1-5
Visual novelty: 1-5
Implementation difficulty: low | medium | high
Verdict: accept | accept-with-crops | regenerate | switch-mode | reject
Reject reasons:
Recommended handoff mode:
```

Reject or rerun any reference below `3/5` in buildability or typography readability, even if it is visually exciting.

## Regeneration Decision Tree

- `accept`: buildable, readable, coherent, and verified.
- `accept-with-crops`: full-page works as composition map but needs section crops before handoff.
- `regenerate`: concept is good, but grid, text scale, component grammar, or section count needs tightening. Run as a new clean subagent generation.
- `switch-mode: section-first`: full-page is overloaded, scale drifts, or sections exceed five meaningful blocks. Run each generated section through the clean subagent gate.
- `switch-mode: wireframe-skin`: product logic or layout hierarchy is weak; generate structure first, then visual skin. Run each generated artifact through the clean subagent gate.
- `switch-mode: design-system-first`: multiple pages, repeated flows, or component consistency matter more than one image. Run each generated artifact through the clean subagent gate.
- `reject`: poster, moodboard, fake UI, unreadable microtext, impossible DOM/CSS, generic slop, or no verified artifact.

After two failed regenerations in the same mode, switch mode or report a blocker instead of polishing indefinitely.

Owner follow-up phrases such as "перегенерируй в другом направлении", "сделай еще три из этой идеи", "поправь этот блок", "докрути этот экран", or "дай маленький image edit" are not continuations inside the orchestrator. They are new reference-generation launches and must use the same subagent isolation, permission, artifact verification, and scoring gates.

## Handoff Package

After owner selection, hand off a package to the implementation step, not just an image:

- selected full-page composition map;
- section crops and crop manifest for long references;
- prompt, input image references, model/provenance, dimensions;
- `reference-score.md`;
- `reference-package.yaml` with grid, blocks, tokens, DOM/CSS zones, asset zones, risks, deviations;
- optional `visual-anchors.json` for key elements the implementation step should verify.
