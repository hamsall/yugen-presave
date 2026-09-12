/**
 * Accessibility smoke test: axe-core scan (WCAG2A/AA) + a manual keyboard
 * tab-order check + a reduced-motion check.
 *
 * Usage: start the app first (`npm run dev` or `npm run build && npm run
 * start`), then in another terminal: `npm run a11y`.
 * Optionally override the target with BASE_URL=https://music.scmhall.blog.
 *
 * Known, expected, non-fixable finding: axe flags an `aria-required-children`
 * issue inside the embedded Spotify <iframe>. That's inside Spotify's own
 * hosted widget markup, not ours — we can't fix a third party's DOM. Re-run
 * with `EXCLUDE_IFRAME=1` to scope the scan to our own markup only.
 */
import { chromium } from "playwright";
import { AxeBuilder } from "@axe-core/playwright";

const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";
const excludeIframe = process.env.EXCLUDE_IFRAME === "1";

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await context.newPage();
await page.goto(baseUrl, { waitUntil: "networkidle" });

let builder = new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]);
if (excludeIframe) builder = builder.exclude("iframe");

const results = await builder.analyze();
console.log(`Violations${excludeIframe ? " (own markup only)" : ""}:`, results.violations.length);
for (const v of results.violations) {
  console.log(`\n[${v.impact}] ${v.id}: ${v.help}`);
  for (const node of v.nodes) {
    console.log("  target:", node.target.join(", "));
    console.log("  summary:", node.failureSummary);
  }
}

// Keyboard tab-order check. The embedded Spotify widget owns several tab
// stops of its own (its thumbnail/save/play/more-options controls) before
// focus reaches our own CTA — that's expected, not a bug in our markup.
console.log("\n--- Tab order ---");
for (let i = 0; i < 8; i++) {
  await page.keyboard.press("Tab");
  const info = await page.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return "(none / focus left the document)";
    return `${el.tagName}${el.textContent ? `: "${el.textContent.trim().slice(0, 40)}"` : ""}`;
  });
  console.log(`  Tab ${i + 1}:`, info);
}

// Verify our own CTA actually renders a visible focus-visible ring
// (box-shadow-based, since we replace the native outline).
const cta = page.locator("a", { hasText: "Pre-Save" }).first();
await cta.focus();
const ring = await cta.evaluate((el) => getComputedStyle(el).boxShadow);
console.log("\nCTA focus ring (box-shadow):", ring);
console.log(ring !== "none" ? "OK — focus ring renders." : "FAIL — no visible focus ring.");

// Reduced-motion check: our global CSS should collapse transitions to ~0.
const reducedPage = await browser.newPage();
await reducedPage.emulateMedia({ reducedMotion: "reduce" });
await reducedPage.goto(baseUrl, { waitUntil: "networkidle" });
const transitionDuration = await reducedPage.evaluate(() => {
  const link = document.querySelector("a");
  return link ? getComputedStyle(link).transitionDuration : null;
});
console.log("\nCTA transition-duration under prefers-reduced-motion:", transitionDuration);

await browser.close();
