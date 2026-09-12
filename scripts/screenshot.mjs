/**
 * Quick visual check: screenshots the page at mobile + desktop viewports.
 *
 * Usage: start the app first (`npm run dev` or `npm run build && npm run
 * start`), then in another terminal: `npm run screenshot`.
 * Optionally override the target with BASE_URL=https://music.scmhall.blog.
 *
 * Output goes to scripts/out-*.png (gitignored — regenerate, don't commit).
 */
import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";
const browser = await chromium.launch();

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
await mobile.goto(baseUrl, { waitUntil: "networkidle" });
await mobile.screenshot({ path: "scripts/out-mobile.png", fullPage: true });

const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
await desktop.goto(baseUrl, { waitUntil: "networkidle" });
await desktop.screenshot({ path: "scripts/out-desktop.png", fullPage: true });

await browser.close();
console.log("Saved scripts/out-mobile.png and scripts/out-desktop.png");
