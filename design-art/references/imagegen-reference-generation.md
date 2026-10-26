# ImageGen Reference Generation

Generate production-page references, not posters.

## Standard Batch

- Generate three distinct variants for the approved brief.
- Use `references/subagent-isolation.md` before generation.
- Use clean ImageGen subagents only. A clean orchestrator/main-chat ImageGen context is not valid.
- Brief approval is not subagent launch approval; ask explicit permission before spawning generation subagents.
- Attach the pinned grid reference.
- Attach the approved `DESIGN.md` summary or design-context seed when one exists.
- Use human visual language, not a long technical rule dump.
- Save prompt, inputs, outputs, provenance, dimensions, and validity notes.
- Require each variant to have a unique, parent-visible artifact path or URL before it counts as generated.
- Do not present a variant whose only artifact reference is "image above", a missing path, or a local path that collides with another clean subagent output.
- Verify local artifact paths from the orchestrator context before presenting variants; unresolved variants must be rerun or explicitly reported as failed, not silently treated as usable.
- Score every candidate with `references/reference-director.md` before owner selection.
- Stop after presenting variants. Do not implement yet.

## Follow-up Batch Gate

Use this same standard batch for owner follow-ups that request more visual references from an existing direction: "generate three from this", "try another direction", "regenerate", "more premium", "less SaaS", or equivalent.

- Reconfirm the generation seed: accepted reference, remix, section crop, wireframe, or design-context seed.
- Ask explicit permission to launch the clean subagent batch again.
- Attach only the minimal approved seed context needed for the follow-up.
- Score each returned candidate before owner selection.
- Do not use orchestrator/main-chat ImageGen for a follow-up just because the first batch already happened.

## Prompt Shape

```text
Create a production-grade web page reference for [product/page].
Use the attached grid only as invisible structure for scale, margins, columns, and page rhythm.
Use the attached DESIGN.md summary or design-context seed as visual-system guidance when present.
Design a real website/app screen that could be implemented with HTML/CSS/components.
Make text readable, sections clear, and repeated components consistent.
Avoid poster composition, collage, contact sheet, tiny microtext, impossible overlapping layers, or compressed artboard layout.
```

Add product-specific substance from the approved brief. Do not hardcode benchmark-specific content into the harness.

## Output Gate

Reject, rerun, or report failed if the artifact:

- has no unique parent-visible image path or URL;
- cannot be verified from the orchestrator context;
- shares the same unverified local path as another supposed variant;
- only exists as a debrief, markdown description, or "image above" reference.

Reject or rerun if the image reads as:

- poster;
- moodboard;
- decorative artboard;
- contact sheet;
- tiny unreadable dashboard;
- impossible layout trick;
- generic SaaS placeholder with no product logic.
