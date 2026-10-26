# Checks

What `analyze.mjs` looks for, and the thresholds it uses. Thresholds are working defaults, not standards; say so when the owner questions one.

| Area | Conflict | Rule |
| --- | --- | --- |
| Contrast | text below WCAG AA | 4.5:1 for normal text, 3:1 for large text (≥24px, or ≥18.66px at weight 700+). Computed against the composited background. Logos and disabled controls are exempt — check before reporting. |
| Typography | too many sizes | more than 10 distinct rendered font sizes |
| Typography | near-duplicate sizes | within one viewport: 1px apart below 24px, 2px apart above (15 vs 16, 30 vs 32). Different sizes of one element across viewports are a responsive scale, not a conflict |
| Typography | fractional sizes | 15.2px, 17.6px — usually rem/clamp leftovers |
| Typography | line height | body text (≤20px) below 1.3 or above 2.0; headings (≥32px) above 1.5 |
| Typography | families / weights | more than 3 families or 4 weights |
| Color | near-duplicates | CIEDE2000 ΔE < 2 between two used colors (#111111 vs #121212); stepped surface layers usually sit just above it |
| Color | too many | more than 16 distinct text, background and border colors |
| Spacing | off grid | margin, padding, gap above 2px not a multiple of the grid (`--grid`, default 4) |
| Spacing | near-duplicates | only with `--grid 1`; otherwise they show up as off-grid values |
| Radius | near-duplicates / off grid | same rules; 999px+ counts as `full` |
| Shadow | too many | more than 4 distinct shadows |
| Layout | containers / breakpoints | listed, not judged: show them, ask whether each max-width and breakpoint is intentional |

Not checked automatically, look yourself:

- the same component styled two ways on different pages (two button heights, two card paddings);
- declared tokens never rendered, and rendered values with no token;
- grid columns and gutters that differ between sections at the same width;
- hover, focus and disabled states (collect only sees the resting state).
