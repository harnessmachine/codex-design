---
name: design-cro
description: Use when a landing page, product page, pricing page, sign-up page or form should convert better — "проверь лендинг", "почему не конвертит", "CRO", "page review", "усилить призыв к действию", or right after a design-grill session to check the page structure before anything is drawn. Works on a block outline, a design doc, a prototype, a screenshot or a live page; returns prioritized fixes, copy options and test ideas.
---

# design-cro

Checks whether a page leads the visitor to one action, and says what to change first. Talk to the owner in their language; keep the report short and concrete.

## Two modes

- **Structure mode** — before visuals exist. Input: a block outline, a `design-grill` doc (`docs/*-design.md`) or its prototype. Check order, message and the path to the action; skip anything about pixels.
- **Page mode** — a built page, prototype, screenshot or URL of the owner's own product. Check everything below, including visual hierarchy and friction.

## Context first

Find, or ask in one message if missing:

- what the page sells or asks for, and to whom;
- the **one** action that counts as success (sign up, buy, book, apply, subscribe);
- where visitors come from (ad, post, search, a friend's link) and what they already know;
- the page type: home, landing, product, pricing, sign-up, article.

A page without a single named action is the first finding.

## Checks, in order of impact

1. **Clarity in five seconds.** From the first screen alone: what is it, who is it for, why it matters. The headline states an outcome for a specific person, not a category label.
2. **Offer and value.** The concrete result, the time or effort it saves, what makes it different from the obvious alternative. Specific beats impressive.
3. **The action.** One primary call to action, visible without scrolling, repeated after each persuasive block. The button says what happens next ("Записаться на поток"), not "Отправить". Secondary actions are visibly secondary.
4. **Order of the story.** Problem or desire → offer → how it works → proof → objections → action. Each block earns the next scroll; anything that answers no visitor question is a candidate to cut.
5. **Proof next to promises.** Results, numbers, names, faces, logos, screenshots of the real product — placed beside the claim they support. Vague praise and stock photos weaken trust.
6. **Objections answered.** Price, time, "will it work for me", "what if I can't", risk and refunds. Answer them where they arise, not only in an FAQ at the bottom.
7. **Friction.** Fields that are not needed now, unclear next step after the click, surprise costs, required accounts, slow or jumpy loading, small tap targets, walls of text on mobile.
8. **Visual hierarchy** (page mode). The eye lands on the headline, then the action. One accent color reserved for actions. Contrast readable. Nothing competes with the primary button.

## Page-type notes

- **Landing from an ad or post** — match the message that brought the visitor; remove navigation that leads away.
- **Pricing** — one recommended plan, differences in plain words, what happens after payment, refund terms near the button.
- **Sign-up and forms** — fewest fields that make the next step possible; say why each sensitive field is asked; inline validation; the button names the result; a clear "what happens next" after submit.
- **Product page** — the product in use, not only in isolation; the main objection answered above the fold.
- **Home** — route each kind of visitor to their path in one screen; do not try to sell everything at once.

## Output

```markdown
## Главное
<one or two sentences: the biggest reason the page underperforms>

## Быстрые правки (минуты)
- <change> — <why it matters>

## Сильные изменения (часы)
- <change> — <expected effect>

## Что протестировать
- <hypothesis: change → metric>

## Варианты текста
- Заголовок: <2–3 options>
- Кнопка: <2–3 options>
```

Every item names the block it touches. In structure mode, return the corrected block order as a list the owner can paste back into the design doc.

## Rules

- Recommendations, not edits: change files only when the owner asks.
- Do not invent proof, numbers or testimonials; mark what the owner must supply as `{{нужно: …}}`.
- No dark patterns: fake scarcity, hidden costs, confirm-shaming, pre-checked consent.
- Review only the owner's own pages, or a competitor's page only for learning, never to copy its text.
- Name the expected effect as a hypothesis to test, not a promised uplift.
