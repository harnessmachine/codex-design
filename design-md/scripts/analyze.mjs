#!/usr/bin/env node
// design-md analyzer. Plain Node, no dependencies.
//
//   node analyze.mjs <collect.json> [more.json …] [--out <dir>] [--grid 4]
//
// Reads one or more outputs of collect.js (one per viewport or page), finds conflicts in the
// rendered design system and writes <dir>/conflicts.md (for the owner) and <dir>/inventory.json
// (for the agent). Nothing is changed in the project.
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); if (i < 0) return d; const v = args[i + 1]; args.splice(i, 2); return v; };
const OUT = opt("--out", ".design-md");
const GRID = Number(opt("--grid", "4"));
if (!args.length) { console.error("usage: node analyze.mjs <collect.json> [...] [--out dir] [--grid 4]"); process.exit(2); }

const runs = args.map((f) => { const raw = JSON.parse(fs.readFileSync(f, "utf8")); return typeof raw === "string" ? JSON.parse(raw) : raw; });
const px = (v) => { const n = parseFloat(v); return Number.isFinite(n) && String(v).trim().endsWith("px") ? Math.round(n * 100) / 100 : null; };

// ---- colors ----
const parse = (s) => {
  const m = String(s).match(/rgba?\(([^)]+)\)/); if (!m) return null;
  const p = m[1].split(/[\s,/]+/).filter(Boolean).map(Number);
  return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
};
const hex = (c) => "#" + [c.r, c.g, c.b].map((x) => Math.round(x).toString(16).padStart(2, "0")).join("") + (c.a < 1 ? Math.round(c.a * 255).toString(16).padStart(2, "0") : "");
const lin = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
const lum = (c) => 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);
const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const lab = (c) => {
  let [x, y, z] = [lin(c.r), lin(c.g), lin(c.b)];
  [x, y, z] = [(x * 0.4124 + y * 0.3576 + z * 0.1805) / 0.95047, x * 0.2126 + y * 0.7152 + z * 0.0722, (x * 0.0193 + y * 0.1192 + z * 0.9505) / 1.08883];
  const f = (t) => (t > 216 / 24389 ? Math.cbrt(t) : (24389 / 27 * t + 16) / 116);
  return [116 * f(y) - 16, 500 * (f(x) - f(y)), 200 * (f(y) - f(z))];
};
// CIEDE2000
const dE = (c1, c2) => {
  const [L1, a1, b1] = lab(c1), [L2, a2, b2] = lab(c2), rad = Math.PI / 180, deg = 180 / Math.PI;
  const C1 = Math.hypot(a1, b1), C2 = Math.hypot(a2, b2), Cb = (C1 + C2) / 2;
  const G = 0.5 * (1 - Math.sqrt(Cb ** 7 / (Cb ** 7 + 25 ** 7)));
  const a1p = a1 * (1 + G), a2p = a2 * (1 + G), C1p = Math.hypot(a1p, b1), C2p = Math.hypot(a2p, b2);
  const h = (b, a) => { const v = Math.atan2(b, a) * deg; return v < 0 ? v + 360 : v; };
  const h1 = h(b1, a1p), h2 = h(b2, a2p);
  const dL = L2 - L1, dC = C2p - C1p;
  let dh = C1p * C2p === 0 ? 0 : h2 - h1; if (dh > 180) dh -= 360; else if (dh < -180) dh += 360;
  const dH = 2 * Math.sqrt(C1p * C2p) * Math.sin((dh / 2) * rad);
  const Lb = (L1 + L2) / 2, Cbp = (C1p + C2p) / 2;
  let Hb = h1 + h2; if (C1p * C2p !== 0) Hb = Math.abs(h1 - h2) > 180 ? (h1 + h2 + 360) / 2 : (h1 + h2) / 2;
  const T = 1 - 0.17 * Math.cos((Hb - 30) * rad) + 0.24 * Math.cos(2 * Hb * rad) + 0.32 * Math.cos((3 * Hb + 6) * rad) - 0.2 * Math.cos((4 * Hb - 63) * rad);
  const SL = 1 + (0.015 * (Lb - 50) ** 2) / Math.sqrt(20 + (Lb - 50) ** 2), SC = 1 + 0.045 * Cbp, SH = 1 + 0.015 * Cbp * T;
  const RT = -2 * Math.sqrt(Cbp ** 7 / (Cbp ** 7 + 25 ** 7)) * Math.sin(60 * Math.exp(-(((Hb - 275) / 25) ** 2)) * rad);
  return Math.sqrt((dL / SL) ** 2 + (dC / SC) ** 2 + (dH / SH) ** 2 + RT * (dC / SC) * (dH / SH));
};

// ---- tally helpers ----
const tally = () => new Map();
const add = (m, key, where) => { if (key == null) return; const e = m.get(key) || { n: 0, where: new Set() }; e.n++; if (e.where.size < 4) e.where.add(where); m.set(key, e); };
const sorted = (m) => [...m.entries()].sort((a, b) => b[1].n - a[1].n);
const whereOf = (e) => [...e.where].map((w) => "`" + w + "`").join(", ");

const fontSize = tally(), family = tally(), weight = tally(), combos = tally(), lhIssues = [];
const textColor = tally(), bgColor = tally(), borderColor = tally(), spacing = tally(), radius = tally(), shadow = tally(), zIndex = tally(), maxWidth = tally();
const contrastFails = new Map(), media = new Set(), vars = {}, viewports = [], sizePerRun = [];
for (const run of runs) {
  viewports.push(`${run.viewport.width}px — ${run.url}`);
  for (const m of run.media || []) media.add(m);
  Object.assign(vars, run.vars || {});
  const runSizes = tally(); sizePerRun.push(runSizes);
  for (const t of run.text) {
    const fs_ = px(t.fontSize), lh = px(t.lineHeight);
    add(fontSize, fs_, t.sel); add(runSizes, fs_, t.sel); add(family, t.fontFamily, t.sel); add(weight, t.fontWeight, t.sel);
    add(combos, `${t.fontFamily} · ${fs_}px · ${t.fontWeight} · ${lh ? Math.round((lh / fs_) * 100) / 100 : "normal"}`, t.sel);
    if (fs_ && lh) {
      const r = lh / fs_;
      if (fs_ <= 20 && (r < 1.3 || r > 2)) lhIssues.push({ sel: t.sel, sample: t.sample, fs: fs_, ratio: Math.round(r * 100) / 100, why: r < 1.3 ? "тесно для основного текста" : "слишком разрежено" });
      if (fs_ >= 32 && r > 1.5) lhIssues.push({ sel: t.sel, sample: t.sample, fs: fs_, ratio: Math.round(r * 100) / 100, why: "крупный заголовок с большим интервалом" });
    }
    const fg = parse(t.color), bg = parse(t.background);
    if (fg) add(textColor, hex(fg), t.sel);
    if (fg && bg && fg.a >= 1) {
      const ratio = contrast(fg, bg), large = fs_ >= 24 || (fs_ >= 18.66 && Number(t.fontWeight) >= 700), need = large ? 3 : 4.5;
      if (ratio < need) {
        const k = `${hex(fg)} на ${hex(bg)}`;
        const e = contrastFails.get(k) || { ratio: Math.round(ratio * 100) / 100, need, n: 0, where: new Set(), sample: t.sample };
        e.n++; if (e.where.size < 3) e.where.add(t.sel); contrastFails.set(k, e);
      }
    }
  }
  for (const b of run.box) {
    for (const k of ["marginTop", "marginRight", "marginBottom", "marginLeft", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft", "rowGap", "columnGap"]) {
      const v = px(b[k]); if (v && v > 0) add(spacing, Math.abs(v), b.sel);
    }
    const r = px(b.radius); if (r && r > 0) add(radius, r >= 999 ? 9999 : r, b.sel);
    if (b.background) { const c = parse(b.background); if (c) add(bgColor, hex(c), b.sel); }
    if (b.borderColor) { const c = parse(b.borderColor); if (c) add(borderColor, hex(c), b.sel); }
    if (b.shadow) add(shadow, b.shadow, b.sel);
    if (b.zIndex) add(zIndex, b.zIndex, b.sel);
    if (b.maxWidth) add(maxWidth, px(b.maxWidth), b.sel);
  }
}

// ---- conflict finders ----
const nearPairs = (m, tol) => {
  const keys = [...m.keys()].filter((k) => typeof k === "number").sort((a, b) => a - b), out = [];
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1], b = keys[i], t = typeof tol === "function" ? tol(a) : tol;
    if (b - a > 0 && b - a <= t) { const keep = m.get(a).n >= m.get(b).n ? a : b; out.push({ a, b, keep, na: m.get(a).n, nb: m.get(b).n }); }
  }
  return out;
};
const nearColors = (m) => {
  const keys = [...m.keys()], out = [];
  for (let i = 0; i < keys.length; i++) for (let j = i + 1; j < keys.length; j++) {
    const A = keys[i], B = keys[j];
    if (A.length !== B.length) continue; // compare opaque with opaque, translucent with translucent
    const d = dE(parse(`rgb(${parseInt(A.slice(1, 3), 16)},${parseInt(A.slice(3, 5), 16)},${parseInt(A.slice(5, 7), 16)})`), parse(`rgb(${parseInt(B.slice(1, 3), 16)},${parseInt(B.slice(3, 5), 16)},${parseInt(B.slice(5, 7), 16)})`));
    if (d < 2) { const keep = m.get(A).n >= m.get(B).n ? A : B; out.push({ a: A, b: B, keep, d: Math.round(d * 10) / 10, na: m.get(A).n, nb: m.get(B).n }); }
  }
  return out;
};
const offGrid = (m) => sorted(m).filter(([v]) => typeof v === "number" && v > 2 && v !== 9999 && v % GRID !== 0)
  .map(([v, e]) => ({ v, n: e.n, where: e.where, to: Math.round(v / GRID) * GRID || GRID }));

// Near-duplicate sizes are looked for inside one viewport: 47px on desktop and 29px on mobile is a responsive scale, not a conflict.
const sizeDupes = [...new Map(sizePerRun.flatMap((m) => nearPairs(m, (v) => (v < 24 ? 1 : 2))).map((p) => [p.a + "/" + p.b, p])).values()];
// With a grid of 2px or more, near-duplicates are already reported as off-grid values.
const spaceDupes = GRID > 1 ? [] : nearPairs(spacing, (v) => (v < 16 ? 1 : 2));
const radiusDupes = GRID > 1 ? [] : nearPairs(radius, (v) => (v < 12 ? 1 : 2));
const spaceOff = offGrid(spacing), radiusOff = offGrid(radius), sizeOff = sorted(fontSize).filter(([v]) => v % 1 !== 0).map(([v, e]) => ({ v, n: e.n, where: e.where, to: Math.round(v) }));
const allColors = tally();
for (const m of [textColor, bgColor, borderColor]) for (const [k, e] of m) { const x = allColors.get(k) || { n: 0, where: new Set() }; x.n += e.n; for (const w of e.where) if (x.where.size < 4) x.where.add(w); allColors.set(k, x); }
const colorDupes = nearColors(allColors);

// ---- report ----
const L = [];
const row = (...c) => L.push("| " + c.join(" | ") + " |");
const LIMITS = { fontSize: 10, family: 3, weight: 4, colors: 16, radius: 5, shadow: 4 };
const count = (label, m, limit) => `${label}: **${m.size}**${limit && m.size > limit ? ` — больше ${limit}, стоит сократить` : ""}`;

L.push("# Конфликты дизайн-системы", "");
L.push("Собрано со страниц:", ...viewports.map((v) => "- " + v), "");
L.push("## Сводка", "");
L.push("- " + count("Размеров шрифта", fontSize, LIMITS.fontSize));
L.push("- " + count("Шрифтов", family, LIMITS.family) + " — " + sorted(family).map(([k]) => k).join(", "));
L.push("- " + count("Начертаний", weight, LIMITS.weight) + " — " + sorted(weight).map(([k]) => k).join(", "));
L.push("- " + count("Цветов (текст, фон, рамки)", allColors, LIMITS.colors));
L.push("- " + count("Отступов", spacing) + `, сетка ${GRID}px`);
L.push("- " + count("Радиусов", radius, LIMITS.radius));
L.push("- " + count("Теней", shadow, LIMITS.shadow));
L.push("- Ширины контейнеров: " + (sorted(maxWidth).map(([k]) => k + "px").join(", ") || "—"));
L.push("- Брейкпоинты: " + ([...media].join("; ") || "— (не найдены в своих стилях)"));
L.push("");

let n = 0;
const block = (title, items, head, line) => {
  if (!items.length) return;
  L.push(`## ${title}`, "", "| # | " + head.join(" | ") + " | Решение |", "|" + " --- |".repeat(head.length + 2));
  for (const it of items) { n++; row(n, ...line(it), "объединить / оставить / исправить в коде"); }
  L.push("");
};
block("Контраст ниже WCAG AA", [...contrastFails.entries()].sort((a, b) => a[1].ratio - b[1].ratio), ["Пара", "Контраст", "Нужно", "Где", "Пример"],
  ([k, e]) => [k, e.ratio + ":1", e.need + ":1", [...e.where].map((w) => "`" + w + "`").join(", "), "«" + e.sample + "»"]);
block("Почти одинаковые размеры шрифта", sizeDupes, ["Значения", "Использований", "Предлагаю"], (p) => [`${p.a}px и ${p.b}px`, `${p.na} и ${p.nb}`, `${p.keep}px`]);
block("Дробные размеры шрифта", sizeOff, ["Значение", "Использований", "Где", "Предлагаю"], (p) => [`${p.v}px`, p.n, whereOf(p), `${p.to}px`]);
block("Межстрочный интервал", lhIssues.slice(0, 15), ["Где", "Размер", "Интервал", "Почему"], (p) => ["`" + p.sel + "`", p.fs + "px", p.ratio, p.why]);
block("Почти одинаковые цвета", colorDupes, ["Цвета", "Разница ΔE", "Использований", "Предлагаю"], (p) => [`${p.a} и ${p.b}`, p.d, `${p.na} и ${p.nb}`, p.keep]);
block(`Отступы вне сетки ${GRID}px`, spaceOff.slice(0, 20), ["Значение", "Использований", "Где", "Предлагаю"], (p) => [`${p.v}px`, p.n, whereOf(p), `${p.to}px`]);
block("Почти одинаковые отступы", spaceDupes, ["Значения", "Использований", "Предлагаю"], (p) => [`${p.a}px и ${p.b}px`, `${p.na} и ${p.nb}`, `${p.keep}px`]);
block("Радиусы", [...radiusDupes.map((p) => ({ ...p, kind: "близкие" })), ...radiusOff.map((p) => ({ ...p, kind: "вне сетки" }))], ["Значения", "Тип", "Предлагаю"],
  (p) => [p.kind === "близкие" ? `${p.a}px и ${p.b}px` : `${p.v}px`, p.kind, `${p.kind === "близкие" ? p.keep : p.to}px`]);

if (!n) L.push("Конфликтов не найдено.", "");
L.push("## Кандидаты в токены типографики", "", "| Шрифт · размер · начертание · интервал | Использований | Где |", "| --- | --- | --- |");
for (const [k, e] of sorted(combos).slice(0, 14)) row(k, e.n, whereOf(e));
L.push("", "Решения по каждому пункту записываются до создания DESIGN.md.", "");

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, "conflicts.md"), L.join("\n"));
const plain = (m) => sorted(m).map(([k, e]) => ({ value: k, count: e.n, where: [...e.where] }));
fs.writeFileSync(path.join(OUT, "inventory.json"), JSON.stringify({
  viewports, grid: GRID, fontSize: plain(fontSize), fontFamily: plain(family), fontWeight: plain(weight), typography: plain(combos),
  textColor: plain(textColor), backgroundColor: plain(bgColor), borderColor: plain(borderColor), spacing: plain(spacing),
  radius: plain(radius), shadow: plain(shadow), zIndex: plain(zIndex), maxWidth: plain(maxWidth), breakpoints: [...media], cssVariables: vars,
  conflicts: { contrast: [...contrastFails].map(([k, e]) => ({ pair: k, ratio: e.ratio, need: e.need, count: e.n })), fontSize: sizeDupes, fractionalFontSize: sizeOff.map(({ where, ...r }) => r), lineHeight: lhIssues, color: colorDupes, spacingOffGrid: spaceOff.map(({ where, ...r }) => r), spacing: spaceDupes, radius: radiusDupes, radiusOffGrid: radiusOff.map(({ where, ...r }) => r) },
}, null, 2));
console.log(JSON.stringify({ ok: true, conflicts: n, report: path.join(OUT, "conflicts.md"), inventory: path.join(OUT, "inventory.json") }));
