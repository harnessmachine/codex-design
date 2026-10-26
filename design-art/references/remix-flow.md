# Prototype Remix Flow

Use this when the owner wants to combine generated variants.

## Separate Pipeline

A mix choice is not implementation. It is a new reference-generation step.

Every remix follow-up is also reference generation. `another remix`, `generate three from this direction`, and `targeted block edit` must re-enter this same generation gate before any ImageGen call.

Clarify only what is missing:

- base reference: which image provides the main structure and style;
- donor reference: which image contributes a block, mood, or detail;
- transfer scope: exactly what should move;
- preserve scope: what must stay fixed.

## Generation

Use `references/subagent-isolation.md` before generation.

Ask explicit permission to launch a remix ImageGen subagent. If no callable subagent route exists, stop and return the remix prompt package instead of generating in the orchestrator/main chat.

Run remix generation in a clean ImageGen subagent. Attach only the selected base, donor references, grid, remix brief, and approved design-context seed when one exists.

For `generate three from this direction`, route to `imagegen-reference-generation.md` as a new standard batch seeded by the accepted remix or direction. For `targeted block edit`, launch a clean ImageGen subagent with only the selected reference, target crop/block, edit brief, grid, and approved design-context seed. Do not treat a block edit as a chat-local image edit.

## Output

- `references/remix-01.png`;
- prompt used;
- input references;
- provenance;
- validity notes;
- owner-facing next choices.

After remix, offer: accept, another remix through the clean subagent gate, generate three from this direction through the clean subagent gate, return to original variants, or targeted block edit through the clean subagent gate.
