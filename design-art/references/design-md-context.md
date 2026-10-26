# DESIGN.md Context

Use `DESIGN.md` as durable design memory for target projects.

## What It Is

`DESIGN.md` is an agent-readable design-system contract: tokens plus rationale for colors, typography, spacing, shape, components, density, accessibility, and do/don't rules.

It is not a moodboard, brand essay, or one-run artifact. It is a repo-level source of truth for future UI work after the owner accepts it.

## Discovery Gate

When a workflow has a target repo or existing product, search for `DESIGN.md` before generating or implementing UI.

Look in:

- target repo root;
- `docs/`, `design/`, or project convention paths;
- owner-provided style references or design-system docs.

Record:

- found path or `not found`;
- whether it is source of truth, draft, or reference-only;
- relevant tokens and rules;
- conflicts with screenshots, generated references, implementation, or owner request.

If an existing target project has no reliable `DESIGN.md`, stale `DESIGN.md`, or no recent audit/readiness context, use or recommend a design audit of the existing project before visual implementation, redesign generation, or motion work unless the owner explicitly chooses a fast fallback.

## Use Rules

- Use `DESIGN.md` before inventing colors, type scales, radii, spacing, components, or density.
- Treat exact token values as stronger than vague visual preference.
- Treat markdown rationale as guidance for when tokens apply.
- If a selected visual reference conflicts clearly with `DESIGN.md`, stop and ask the owner whether to preserve `DESIGN.md`, follow the reference, or update the durable design contract.
- Do not silently override `DESIGN.md` because a generated reference looks better.
- Do not copy a third-party style reference as `DESIGN.md`; adapt system logic to the target product.

## Creation Gate

Create or update target-project `DESIGN.md` only after explicit owner approval. A design audit of the existing project is the preferred preflight path for creating or refreshing `DESIGN.md` before implementation.

Ask after the owner accepts the first implemented page or an accepted redesign changes durable visual rules.

If approved, derive `DESIGN.md` from observed implementation and evidence. Do not add speculative tokens, placeholder values, or third-party style values that were not accepted in the target project.

For existing projects, derive `DESIGN.md` from verified repo evidence first: dependencies, imports, components, tokens, globals, routes, screenshots, and representative UI. Treat stale docs as advisory until checked against code.

Before committing or handing off a created/updated `DESIGN.md`, scan it for template defaults, placeholders, unresolved token references, and speculative values. Block handoff until they are replaced with observed owner-approved values or explicitly marked unknown.

- accepted page screenshot and final comparison;
- CSS variables, Tailwind/theme config, component classes, and actual browser styles;
- color sampling and contrast notes;
- typography, spacing, radius, shadow, icon, component, density, and layout decisions;
- accepted deviations and forbidden patterns.

## Conflict Gate

Implementation and redesign steps must ask the owner before continuing when:

- `DESIGN.md` primary colors, type, radius, spacing, or component rules conflict with the selected reference;
- first implementation drifted clearly away from `DESIGN.md`;
- owner request implies changing durable style rules rather than a one-off page exception;
- a redesign would make existing screenshots and `DESIGN.md` disagree.

Owner choices should be explicit:

- preserve `DESIGN.md` and adapt the page;
- accept a one-off deviation for this page only;
- update `DESIGN.md` as the new durable design contract.

## Recommended Shape

```md
---
name: Project Design System
version: alpha
colors:
  primary: "#<observed-hex>"
typography:
  body-md:
    fontFamily: "<observed-font>"
    fontSize: "<observed-size>"
    fontWeight: "<observed-weight>"
    lineHeight: "<observed-line-height>"
spacing:
  md: "<observed-spacing>"
rounded:
  card: "<observed-radius>"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
---

## Overview

Short product tone and density.

## Colors

Token roles and constraints.

## Typography

Type scale and usage.

## Layout

Grid, spacing rhythm, page density.

## Components

Buttons, cards, nav, forms, tables, states.

## Do's and Don'ts

- Do use tokens before one-off values.
- Don't introduce new visual systems without owner approval.
```
