# DESIGN.md format

Follows the open DESIGN.md format by Google Labs (`google-labs-code/design.md`, version `alpha`). Check `npx @google/design.md spec` for the current text if anything here looks outdated.

## Two parts

- **Tokens** — YAML front matter between two `---` lines (or fenced `yaml` blocks inside sections). Tokens are the normative values.
- **Prose** — `##` sections explaining how and when to apply them. Agents follow prose for anything a token does not cover, so it carries the decisions.

Each top-level key (`colors`, `typography`…) may be defined only once in the whole file.

## Token schema

```yaml
version: alpha
name: <string>
description: <string>
colors:        { <name>: "<css color>" }          # hex recommended; at least `primary`
typography:    { <name>: { fontFamily, fontSize, fontWeight, lineHeight, letterSpacing } }
rounded:       { <level>: <px|em|rem> }            # none, sm, md, lg, xl, full
spacing:       { <level>: <px|em|rem|number> }     # xs, sm, md, lg, xl, gutter, margin
components:    { <component>: { <property>: <value | {ref}> } }
omitted:       [ <section> | { section, reason } ] # sections intentionally absent
```

- Dimensions: number with `px`, `em` or `rem`. `lineHeight` may be unitless (preferred).
- References: `{colors.primary}`, `{rounded.md}`; inside `components` composite references like `{typography.label-md}` are allowed.
- Component properties: `backgroundColor`, `textColor`, `typography`, `rounded`, `padding`, `size`, `height`, `width`. Others are accepted with a warning.
- States are separate keys with a shared prefix: `button-primary`, `button-primary-hover`, `button-primary-disabled`.
- Common names (optional): colors `primary, secondary, tertiary, neutral, surface, on-surface, error`; typography `headline-display, headline-lg, headline-md, body-lg, body-md, body-sm, label-lg, label-md, label-sm`.

## Section order

1. Overview (or "Brand & Style")
2. Colors
3. Typography
4. Layout (or "Layout & Spacing")
5. Elevation & Depth
6. Shapes
7. Components
8. Do's and Don'ts

Sections may be omitted; those present keep this order. Unknown sections (this skill adds `## Provenance` and `## Open questions`) are preserved by consumers and go after the standard ones. Duplicate headings are an error.

## Lint

`npx @google/design.md lint DESIGN.md` — JSON output, exit code 1 on errors. Rules include broken references, missing primary color, missing typography, orphaned tokens, section order, unknown keys and WCAG contrast of component color pairs. `diff` compares two versions; `export` writes Tailwind or DTCG tokens.

## What makes it followable

- Roles over values: say what each color and type level is for, and where not to use it.
- One concrete visual reference beats a list of adjectives.
- Explicit don'ts, taken from real decisions ("don't use 15px; body is 16px").
- Component states written out, so agents do not invent hover and disabled styles.
- Short: tokens plus a few sentences per section. Long essays get skimmed.
