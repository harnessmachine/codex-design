// design-md collector. Evaluate this whole file as an expression in the rendered page
// (browser tool "evaluate", Playwright page.evaluate, or the devtools console).
// It returns a JSON string with the computed styles the page actually renders.
// Read-only: it changes nothing on the page and sends nothing anywhere.
(() => {
  const MAX = 5000;
  const visible = (el, cs) => {
    if (cs.display === "none" || cs.visibility === "hidden" || Number(cs.opacity) === 0) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };
  const sel = (el) => {
    const part = (e) => e.tagName.toLowerCase() + (e.id ? "#" + e.id : "") +
      (typeof e.className === "string" && e.className.trim() ? "." + e.className.trim().split(/\s+/).slice(0, 2).join(".") : "");
    return (el.parentElement && el.parentElement !== document.body ? part(el.parentElement) + " > " : "") + part(el);
  };
  const ownText = (el) => [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join(" ").replace(/\s+/g, " ").trim();
  const parseRGBA = (s) => {
    const m = String(s).match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(/[\s,/]+/).filter(Boolean).map(Number);
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  };
  // Effective background: composite translucent layers up the ancestor chain onto white.
  const bgOf = (el) => {
    const layers = [];
    for (let e = el; e; e = e.parentElement) {
      const c = parseRGBA(getComputedStyle(e).backgroundColor);
      if (c && c.a > 0) { layers.push(c); if (c.a >= 1) break; }
    }
    let out = { r: 255, g: 255, b: 255 };
    for (const c of layers.reverse()) out = { r: c.r * c.a + out.r * (1 - c.a), g: c.g * c.a + out.g * (1 - c.a), b: c.b * c.a + out.b * (1 - c.a) };
    return `rgb(${Math.round(out.r)}, ${Math.round(out.g)}, ${Math.round(out.b)})`;
  };

  const text = [], box = [];
  const els = [...document.querySelectorAll("body *")].filter((el) => !/^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE|SVG|PATH|BR)$/i.test(el.tagName)).slice(0, MAX);
  for (const el of els) {
    const cs = getComputedStyle(el);
    if (!visible(el, cs)) continue;
    const s = sel(el);
    const t = ownText(el);
    if (t) text.push({
      sel: s, sample: t.slice(0, 40), tag: el.tagName.toLowerCase(),
      fontFamily: cs.fontFamily.split(",")[0].replace(/["']/g, "").trim(),
      fontSize: cs.fontSize, fontWeight: cs.fontWeight, lineHeight: cs.lineHeight, letterSpacing: cs.letterSpacing,
      textTransform: cs.textTransform, color: cs.color, background: bgOf(el),
    });
    const b = { sel: s };
    for (const k of ["marginTop", "marginRight", "marginBottom", "marginLeft", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft", "rowGap", "columnGap"]) b[k] = cs[k];
    b.radius = cs.borderTopLeftRadius;
    if (parseFloat(cs.borderTopWidth) > 0 && cs.borderTopStyle !== "none") b.borderColor = cs.borderTopColor;
    const bg = parseRGBA(cs.backgroundColor); if (bg && bg.a > 0) b.background = cs.backgroundColor;
    if (cs.boxShadow && cs.boxShadow !== "none") b.shadow = cs.boxShadow;
    if (cs.position !== "static" && cs.zIndex !== "auto") b.zIndex = cs.zIndex;
    if (cs.maxWidth && cs.maxWidth !== "none" && cs.maxWidth.endsWith("px")) b.maxWidth = cs.maxWidth;
    if (cs.display.includes("grid") && cs.gridTemplateColumns !== "none") b.gridColumns = cs.gridTemplateColumns.split(" ").length;
    box.push(b);
  }

  // Breakpoints and custom properties from same-origin stylesheets (cross-origin ones are skipped).
  const media = new Set(), vars = {};
  const walk = (rules) => {
    for (const r of rules) {
      if (r.media && r.conditionText) media.add(r.conditionText);
      if (r.selectorText && /(^|,)\s*(:root|html)\b/.test(r.selectorText)) {
        for (const p of r.style) if (p.startsWith("--")) vars[p] = r.style.getPropertyValue(p).trim();
      }
      if (r.cssRules) walk(r.cssRules);
    }
  };
  for (const sh of document.styleSheets) { try { walk(sh.cssRules); } catch { /* cross-origin */ } }

  return JSON.stringify({
    url: location.href, viewport: { width: innerWidth, height: innerHeight }, collected: new Date().toISOString(),
    truncated: document.querySelectorAll("body *").length > MAX, text, box, media: [...media], vars,
  });
})()
