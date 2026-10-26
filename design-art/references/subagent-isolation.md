# Subagent Isolation

Use this gate before ImageGen reference generation, redesign generation, remix generation, or high-salience asset generation.

## Discovery Gate

Before generation, the orchestrator must run `tool_search` for multi-agent/subagent tools unless a callable subagent tool is already visible in the active tool list.

Availability means "found through discovery and callable", not "visible in the initial tool list".

If no callable subagent tool is found, stop before generation and report the blocker. Do not call ImageGen from the orchestrator/main chat as a fallback.

## Launch Gate

Brief approval, redesign approval, or "move fast" implementation approval is not subagent launch approval.

Ask one explicit permission question before launching generation subagents. Continue only after the owner clearly approves subagent generation.

## Execution Rules

- Use clean subagents with `fork_context: false` unless a workflow explicitly requires inherited context.
- Give each subagent only the bundle it needs.
- Attach real image inputs as `local_image` items when screenshots, references, crops, or grids are required.
- Do not expose sibling outputs unless the task is explicitly a remix using selected references.
- Do not expose live global skill files as source of truth.
- Save the prompt, inputs, outputs, provenance, and debrief.
- Require each generated output to return a unique, parent-visible artifact path or URL. Text like "image above" is not an artifact.
- Treat identical local paths from different clean subagents as invalid until each artifact is copied or exported to a distinct parent-visible path and verified.
- Before presenting or handing off generated outputs, verify every local artifact path exists from the orchestrator context; if verification is impossible, mark that output unresolved and rerun or stop for owner decision.
- If a late asset need appears, start a new clean asset batch instead of reusing an old subagent context.

## Invalid If

- `tool_search` was skipped before declaring subagents unavailable;
- generation ran in the orchestrator/main chat;
- the subagent read sibling outputs without permission;
- the subagent used parent-chat ImageGen output as production evidence;
- provenance is missing;
- a generated output has no unique parent-visible artifact path or URL;
- two supposed distinct outputs share the same unverified local path;
- final selection or comparison is missing;
- a high-salience asset was manually reconstructed to avoid ImageGen.
