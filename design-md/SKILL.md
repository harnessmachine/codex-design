---
name: design-md
description: Use when a landing page, site or app is already built and its design should be fixed into a DESIGN.md that other agents follow — "сделай design.md", "зафиксируй дизайн-систему", "standardize the design", "extract design tokens", or after image-to-code / design-art implementation. Measures what the page actually renders, shows font-size, spacing, grid, color and contrast conflicts, gets the owner's decisions, then writes a DESIGN.md in the Google DESIGN.md format and lints it.
---

# design-md

Turns a built frontend into a `DESIGN.md`: the file other agents read before they touch the UI. The file only helps if it describes one coherent system, so conflicts are found and settled **before** it is written.

Talk to the owner in their language. Files in `scripts/`, `templates/`, `references/` sit next to this file (`$SKILL`).

## Flow

```text
1 sources → 2 render & collect → 3 analyze → 4 owner settles conflicts → 5 (optional) fix code → 6 write DESIGN.md → 7 lint → 8 handoff
```

### 1. Sources

- Find an existing `DESIGN.md` / `design.md` (root, `docs/`, `design/`). If one exists, this run is a **refresh**: compare, never silently overwrite.
- Read the declared system: CSS custom properties, Tailwind/theme config, token files, font imports, component variants. Note what is declared but unused and used but undeclared.
- Find how to run the page: dev server, built `dist/`, a static file, or a URL the owner gave. Use only the owner's own project or a URL they confirm is theirs.
- Mark every value you later write as `observed` (rendered), `declared` (in code only), `decided` (owner chose it) or `unknown`. Never invent a value.

### 2. Render and collect

Open each key page in a browser at **375, 768 and 1280px** wide (add 1440 for wide layouts). On each, evaluate `$SKILL/scripts/collect.js` as an expression and save the returned JSON to `.design-md/collect-<page>-<width>.json`. Any browser tool works: Playwright `page.evaluate`, the agent's built-in browser, or devtools. Scroll once to the bottom first so lazy sections render.

`.design-md/` is a scratch folder: add it to `.gitignore` or delete it at the end.

### 3. Analyze

```sh
node $SKILL/scripts/analyze.mjs .design-md/collect-*.json --out .design-md
```

It writes `.design-md/conflicts.md` (for the owner) and `.design-md/inventory.json` (for you). Checks and thresholds: `references/checks.md`. Read the inventory too: it lists every rendered value with counts and where it appears, and the top typography combinations that become tokens.

### 4. Owner settles conflicts — the gate

Show the owner the summary and the conflicts table, grouped: contrast, typography, colors, spacing, radii, grid/containers. Keep it short: value → how often → where → your proposal. For each item the owner picks:

- **объединить** — both values become one token (your proposal or theirs);
- **оставить** — the difference is intentional; record why in DESIGN.md;
- **исправить в коде** — the code is wrong; fix it before the file is written.

Also settle naming of the main roles (primary, surface, text, accent…) when the code does not make it obvious. Ask in one message, with your recommendation per item, so "да" accepts all. **Do not write DESIGN.md while a conflict is open** unless the owner says to record it as an open question.

Contrast failures under WCAG AA are listed first; recommend fixing them, but the owner decides.

### 5. Fix code (only if the owner chose «исправить в коде»)

Change only the values the owner approved, in the token/theme layer first rather than one-off overrides. Re-run steps 2–3 on the same pages and show that the fixed conflicts are gone. If the owner did not ask for fixes, skip this step: the file then records the decided system and the code drift goes to Open questions.

### 6. Write DESIGN.md

Use `templates/DESIGN.md` and the format rules in `references/format.md`:

- YAML front matter with `version: alpha`, `name`, `description`, and tokens: `colors`, `typography`, `rounded`, `spacing`, `components`. Only resolved values; hex for colors, px for sizes, unitless line-height.
- Every token gets a **role**, not just a value: what it is for and where not to use it.
- Components that exist on the page, with their states (`button-primary`, `button-primary-hover`, `-disabled`…), referencing tokens as `{colors.primary}`.
- Sections in the required order: Overview, Colors, Typography, Layout, Elevation & Depth, Shapes, Components, Do's and Don'ts. Then the extra sections `## Provenance` (pages, widths, date, what was observed vs decided) and `## Open questions` (anything the owner left open, code drift not yet fixed).
- Do's and Don'ts come from the decisions in step 4: every «объединить» becomes "use X, not Y", every «оставить» explains the exception.
- Prose is specific: name the visual reference and the posture ("плотный тёмный интерфейс с одним кислотным акцентом"), not adjectives like "modern, clean".

Refresh: keep the owner's prose, update tokens and Provenance, and list what changed in your reply.

### 7. Lint

```sh
npx @google/design.md lint DESIGN.md
```

Fix every error (broken references, duplicate keys, section order). Warnings such as contrast or orphaned tokens either get fixed or explained in Open questions. `orphaned-tokens` means no component references that token: base colors (surface, text, muted, line) are usually used by `page`, `caption`, `divider`-style components — add the real one where it exists on the page instead of deleting the token. If `npx` is unavailable, say the lint was not run.

### 8. Handoff

Tell the owner in a few lines: where the file is, how many tokens, which conflicts were merged, kept or fixed, and what is still open. Offer, without doing it unasked:

- adding one line to `AGENTS.md` / `CLAUDE.md`: "Before changing UI, read DESIGN.md and use its tokens";
- exporting tokens: `npx @google/design.md export --format css-tailwind DESIGN.md` (or `json-tailwind`, `dtcg`).

## Hard rules

- No DESIGN.md before the conflicts are settled or explicitly parked as open questions.
- No invented tokens: a value is rendered, declared, or decided by the owner.
- Do not edit source code unless the owner chose «исправить в коде» for that item.
- Measure the owner's own product. Do not extract a third party's site into the owner's DESIGN.md.
- Keep raw collections out of the final file and out of git.
