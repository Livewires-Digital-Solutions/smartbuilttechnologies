#!/usr/bin/env node
/**
 * Review screenshots at the three breakpoints in PLAN.md §10 (360 / 768 / 1440).
 * Uses the locally installed Chrome or Edge, so no browser download is needed.
 *
 * Usage: node scripts/shoot.mjs <outDir> [baseUrl] [path ...]
 *   e.g. node scripts/shoot.mjs ./shots http://localhost:3100 / /kit
 * Flags: --widths=360,1440  --viewport (above-the-fold only)  --wait=1200
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const args = process.argv.slice(2);
const flags = Object.fromEntries(args.filter((a) => a.startsWith("--")).map((a) => a.slice(2).split("=")));
const [outDir = "shots", base = "http://localhost:3100", ...paths] = args.filter((a) => !a.startsWith("--"));
const widths = (flags.widths ?? "360,768,1440").split(",").map(Number);
const wait = Number(flags.wait ?? 1200);

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch({ channel: process.env.PW_CHANNEL ?? "chrome" });
const errors = [];

for (const route of paths.length ? paths : ["/"]) {
  for (const width of widths) {
    const page = await browser.newPage({ viewport: { width, height: width < 768 ? 800 : 900 }, deviceScaleFactor: 1 });
    page.on("pageerror", (e) => errors.push(`${route} @${width}: ${e.message}`));
    page.on("console", (m) => m.type() === "error" && errors.push(`${route} @${width}: console: ${m.text()}`));
    await page.goto(base + route, { waitUntil: "networkidle" });
    await page.waitForTimeout(wait);
    const name = `${route === "/" ? "home" : route.replace(/^\//, "").replace(/\//g, "_")}-${width}.png`;
    await page.screenshot({ path: path.join(outDir, name), fullPage: !("viewport" in flags) });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (overflow > 0) errors.push(`${route} @${width}: horizontal overflow of ${overflow}px`);
    console.log(`✓ ${name}`);
    await page.close();
  }
}

await browser.close();
if (errors.length) {
  console.log("\nIssues:\n" + errors.map((e) => `  ✗ ${e}`).join("\n"));
  process.exitCode = 1;
}
