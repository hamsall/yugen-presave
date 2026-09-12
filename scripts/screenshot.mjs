/**
 * Quick visual check: screenshots the page at mobile + desktop viewports,
 * stress-tests a few narrow widths where flex layouts are most likely to
 * wrap/overflow (this is how the Apple/Amazon "Coming soon" pill overflow
 * bug and the InfoTooltip mobile clipping bug were both first caught), and
 * captures the InfoTooltip in its open state (it only renders on
 * hover/focus/click, so the default screenshots never see it).
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

// Narrow-width sweep: 320 is the smallest common phone viewport (iPhone
// SE-class), 360 is the most common Android width. Both sit below the 390
// "mobile" shot above and are where the platform-row flex layout is under
// the most width pressure.
for (const width of [320, 360]) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 2 });
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.screenshot({ path: `scripts/out-width-${width}.png`, fullPage: true });
}

// InfoTooltip open state, at the 390 mobile width — the tooltip's own
// positioning (right-anchored so it doesn't clip off narrow screens) can
// only be checked while it's actually open.
const tooltipPage = await browser.newPage({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
});
await tooltipPage.goto(baseUrl, { waitUntil: "networkidle" });
await tooltipPage.getByRole("button", { name: /why the exact time/i }).click();
await tooltipPage.screenshot({ path: "scripts/out-tooltip-open.png", fullPage: true });

await browser.close();
console.log(
  "Saved scripts/out-mobile.png, scripts/out-desktop.png, scripts/out-width-{320,360}.png, and scripts/out-tooltip-open.png",
);
