#!/usr/bin/env node
// Optional runner: renders pages with the project's own Playwright and runs collect.js on each.
//
//   node collect-playwright.mjs <url> [more urls…] [--widths 375,768,1280] [--out .design-md]
//
// Run it from the project folder: Playwright is resolved from that project's node_modules.
// Without Playwright, open the pages in any browser tool and evaluate collect.js instead.
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); if (i < 0) return d; const v = args[i + 1]; args.splice(i, 2); return v; };
const OUT = opt("--out", ".design-md");
const WIDTHS = opt("--widths", "375,768,1280").split(",").map(Number);
if (!args.length) { console.error("usage: node collect-playwright.mjs <url> [...] [--widths 375,768,1280] [--out dir]"); process.exit(2); }

let chromium;
try { ({ chromium } = createRequire(path.join(process.cwd(), "package.json"))("playwright")); }
catch { console.error("Playwright not found in this project. Use a browser tool with collect.js instead."); process.exit(3); }

const collector = fs.readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), "collect.js"), "utf8");
const slug = (u) => u.replace(/^https?:\/\//, "").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").slice(0, 60) || "page";
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const written = [];
try {
  for (const url of args) for (const width of WIDTHS) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += innerHeight) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); } scrollTo(0, 0); });
    const json = await page.evaluate(collector);
    const file = path.join(OUT, `collect-${slug(url)}-${width}.json`);
    fs.writeFileSync(file, json);
    written.push(file);
    await page.close();
  }
} finally { await browser.close(); }
console.log(JSON.stringify({ ok: true, files: written }));
