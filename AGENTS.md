# AGENTS.md — Yūgen pre-save site

This file is the repo-level brief for any coding agent (or human) working in this project. Read it before making changes. If a decision here turns out to be wrong, update this file in the same commit that changes the decision — it should never go stale.

**Source of truth for product intent:** `./working-backwards.md` (same repo root). Read that first if you want the *why*; this file is the *how*.

---

## What this is

A single-page, single-purpose pre-save/pre-add landing page for Sam Hall's debut EP *Yūgen*, releasing **24 September 2026**. Lives at `music.scmhall.blog`. This is also the seed of a larger portfolio rebuild (scmhall.blog is replacing hamsall.blog) — but v1 scope is this one page, done well, shipped fast. Do not let "the bigger site" scope-creep into this build.

**The one thing this page has to do:** let a listener who already wants to say yes commit to hearing the album on day one, in one tap, on whichever platform they already use — with zero remembered follow-up required. Every design and engineering decision should be checked against that sentence.

---

## Stack

- **Next.js** (App Router), **TypeScript** (strict mode — this project exists partly to close a real skills gap, don't undermine that by loosening strictness for convenience)
- **Tailwind CSS** for styling
- **Vercel** for hosting/deploy
- Minimal dependencies. Reach for a library only when hand-rolling it would cost real time or accessibility correctness (e.g. do write a custom countdown hook; don't hand-roll date-math edge cases badly — use a small, well-tested date utility if the manual version gets hairy).

## Non-negotiables (from the working-backwards doc — don't relitigate these mid-build)

- No email capture, no merch, no multi-page nav, no CMS, no account system. One route. One job.
- Every pre-save/pre-add identifier (Spotify URI, Apple Music link, Amazon link) may be **unknown at build time**. The page must ship and look complete with any subset of these missing — see "Handling pending platform links" below.
- Accessible by default, not as a pass at the end: real contrast ratios, keyboard nav, semantic HTML, screen-reader-sane countdown (see Accessibility section).
- Fast on mobile data — this page will be shared as a link in Instagram/DM traffic during release week, often on patchy connections.
- **Git workflow is itself a deliverable.** This repo should be public on GitHub from the first commit, with real, descriptive commit messages (not "wip", not squashed into one mega-commit) — closing the "Git as a visible workflow" gap is one of the explicit reasons this project exists. The developer has used git for years but never explicitly captured it in his portfolios so here is a chance to demonstrate best practice. Commit in small, logical chunks as you build.

---

## Visual direction (from moodboard, 10 Sept)

Reference images showed three consistent moves — follow this pattern, don't reinvent it:

1. **Background:** dark, atmospheric, photographic or textured (deep navy/near-black base). This is the "yūgen" mood layer — quiet, spacious, a little mysterious. Not a flat corporate gradient.
2. **Content card:** a light, high-contrast card/panel floats on top of the dark background, containing the cover art, countdown, and CTA(s). This is where legibility and focus live — don't try to make the dark background carry body text.
3. **CTA buttons:** bold, black or near-black, rectangular or pill-shaped, capitalized label (e.g. "PRE-SAVE"). No gradients, no shadows-as-decoration.
4. **Countdown:** segmented (days / hours / mins / secs), each unit clearly labelled underneath the number. Monospace or tabular-numeral treatment so digits don't jitter the layout as they tick.
5. **Multi-platform picker:** when more than one platform is available, render a **stacked list of rows**, each with the platform's logo + name on the left and its own button on the right (per the bottom-right reference image). This is not a segmented control or a dropdown — it's a simple list, dark-mode styled, one row per platform.
6. **User Context**: while accessibility is key, remember people will be using instagram at night, so whilst constrast is important we want the final result to be easy on the eyes. also to match the dark, atmospheric mood.

**Palette:** derived from the actual `Yūgen` EP art, not chosen in the abstract. Once the cover file is in this project's `public/` folder, extract the palette from it directly — dark-blue-leaning tones from the art as the base/background, one accent pulled from the art's warmest/brightest colour for the CTA, checked against WCAG AA contrast before locking. Don't guess a generic "dark blue" independently of the actual image.

**Until the cover art is in the repo:** use a sensible dark-navy placeholder scale in Tailwind config so the build isn't blocked. Keep all colours in `tailwind.config` / CSS variables, never hardcoded in components, so swapping in the real art-derived palette later is a config-only change.

---

## Content model

Keep all release-specific data in one typed config file (e.g. `lib/release.ts`), not scattered through components:

```ts
type PlatformLink = {
  platform: "spotify" | "apple-music" | "amazon-music";
  label: string;
  url: string | null; // null = not yet available, render "coming soon" state
};

type ReleaseConfig = {
  title: string; // "Yūgen"
  artist: string; // "Sam Hall"
  releaseDate: string; // ISO date, 2026-09-24
  coverArtSrc: string;
  existingSingle: {
    title: string;
    spotifyEmbedUrl: string; // already live, no pending dependency
  };
  platforms: PlatformLink[];
};
```

This means: when the Spotify URI or Apple pre-add link finally lands, it's a one-line data change, not a component change.

## Handling pending platform links (important — will be true for most of this build)

- A `PlatformLink` with `url: null` renders its row in a visibly **disabled/pending state** (e.g. "Coming soon" instead of "Pre-Save", greyed but still legible, not hidden). Don't hide rows for platforms we intend to support — showing "coming soon" honestly reflects real status per our own design tenets (trustworthy at a glance).
- Never block the whole page on a missing identifier. The countdown, cover art, and embedded single must all render regardless of platform-link status.
- Start with **Spotify only** as the realistic v1 (see working-backwards doc's dependency-risk notes); Apple/Amazon rows can exist in the data model now with `url: null` and get filled in if/when CD Baby confirms eligibility.

---

## Components (as built)

- `CoverArtCard` — server component; the whole floating "card" from the moodboard (cover art, title, embedded single, countdown + platform list, microcopy). Renders content order identity → sound → when → how-to-not-miss-it, per the working-backwards FAQ's own scan sequence for cold visitors.
- `lib/useCountdown.ts` — the ticking hook. `Countdown` (`components/Countdown.tsx`) is its purely presentational counterpart, taking `{ snapshot, announcement, title }` as props — no hook inside it. Handles: page loaded after release date (shows "Out now", not negative numbers); the visible digit grid is `aria-hidden`, with a single `aria-live="polite"` region as the *entire* screen-reader-facing countdown experience, updated once a minute (or on the release-day transition), never once a second.
- `CountdownAndPlatforms` — the one client-side island on the page (`"use client"`). Owns `useCountdown`, renders `Countdown`, and derives `isReleased` to pass down to `PlatformSaveList` so buttons relabel "Pre-Save" → "Listen" the moment release day arrives — computed at each pageview, never baked into the static build.
- `PlatformSaveList` — the stacked row list from the moodboard; each row is a `PlatformSaveRow` (icon, label, button/"Coming soon" state — the latter is a plain non-focusable `<span>`, not a fake disabled button).
- `EmbeddedSingle` — wraps Spotify's own embed widget for the already-live single ("Ghost Girl" — confirmed via the widget's own rendered title, distinct from the "Yūgen"-titled instant-gratification track discussed for Apple's pre-order path). No custom audio player, per working-backwards.md.
- `InfoTooltip` — small reusable "i" disclosure (click/tap/hover/focus, Escape to close) for caveats that don't belong in the main copy. Currently used once, next to the release-date caption, to explain that the countdown targets the *earliest* release moment (per Spotify for Artists' own release page, which carries the same caveat) — so it hitting zero doesn't mean something's broken if the EP isn't live for a given listener yet.
- `components/icons/*` — small hand-rolled monoline SVGs (Spotify/Apple Music/Amazon Music), not official brand assets. Each row also has a visible text label, so recognizability doesn't depend on the icon alone.

---

## Accessibility checklist (check before calling anything "done")

- Contrast ratios meet WCAG AA at minimum, given the dark background + light card design — verify the *card* content, not just body-on-dark text.
- All interactive elements reachable and operable by keyboard, visible focus states (don't strip default focus rings without replacing them).
- Countdown doesn't trap or spam screen readers (see above).
- Respects `prefers-reduced-motion`.
- Real semantic HTML (buttons are `<button>` or proper links `<a>`, not `<div onClick>`).

## Performance checklist

- Images (cover art) via `next/image`, properly sized, no unoptimized multi-MB PNGs.
- Prefer static generation for this page — there's no per-user dynamic data.
- Keep JS bundle minimal — this is a one-route site, it should feel instant on mobile data.

---

## Explicitly out of scope for this repo's v1 (revisit later, don't build now)

- Mailing list / email capture
- Merch, tour dates, "about the artist" content
- Multi-page navigation, CMS-backed content
- Analytics beyond whatever Vercel/Spotify give for free
- The rest of the scmhall.blog portfolio rebuild (separate working-backwards pass, separate scope)

---

## Open questions still tracked in the working-backwards doc

See `./working-backwards.md` for: Spotify URI status, Apple/Amazon eligibility, exact palette hex values, embed-vs-custom-player decision (already leaning embed). Don't duplicate that tracking here — update it there.

## Status as of this build (12 Sept 2026)

- **Title:** it's **Yūgen** (capital Y, macron on the u), not "yugen" — confirmed via the Spotify for Artists listing. Not a stylistic lowercase choice; earlier drafts of this doc and the code had it wrong. `lib/release.ts` is the only place the display title should ever be hardcoded.
- **Release type:** it's an **EP**, not an album — confirmed via the Spotify for Artists "EP" tag (working-backwards.md's own half-finished "EP or Album?" note agrees). Spotify's URI/URL scheme still uses the literal string `album` for EPs too (`spotify:album:...`, `/album/...`) — that's Spotify's resource-type naming, not a mislabel on our part, so it's left as-is in `lib/release.ts`.
- **Spotify EP pre-save:** resolved. URI `spotify:album:0oDjObLTKHWZuBRAnQ2enA` → linked as `https://open.spotify.com/album/0oDjObLTKHWZuBRAnQ2enA`. Spotify renders its own native pre-save prompt on that page for scheduled-but-undelivered releases, so no OAuth/backend integration was needed or built (would have violated "no account system").
- **Apple Music / Amazon Music:** still pending — both render "Coming soon" per the pending-link pattern below.
- **Existing single embed:** wired to `https://open.spotify.com/embed/track/5Y6S5ckQMKrSpAOMfgBtKR` — confirmed as **"Ghost Girl"** via the widget's own rendered title (not "Yūgen"; that's the separate instant-gratification track name discussed for Apple's pre-order path).
- **Release date/time:** **2026-09-24T12:00:00+01:00**, confirmed correct — this is the *earliest* release moment per Spotify for Artists' own release page (which shows the same "earliest it can go live" caveat we now surface on-page via `InfoTooltip`). The "25 September 2026" previously used elsewhere in this doc and in working-backwards.md's press release was the stale value.
- **Cover art:** real art is in (`public/yugen-cover.jpg` — filename kept as-is, it's a technical path, not display text), palette below is derived from it, not placeholder.

## Palette (derived from `public/yugen-cover.jpg`, WCAG-checked)

Defined as CSS variables in `app/globals.css` under `@theme` (Tailwind v4 is CSS-config-first — there is no `tailwind.config.ts` in this project). The cover art itself is a desaturated, cool-toned photograph (blossom branches, dusk light) — median-cut quantization of the full image mostly returns greys, but sampling the most-saturated pixels turns up real dark teal/navy tones in the shadows (~hue 195–220°) and warm gold tones in the dawn-light highlights (~hue 28–40°). Both scales below are built from those actual sampled pixels, not guessed independently:

- `ink-*` — dark navy/teal background scale (base `#0a1f28`–`#040d12`), from the shadow tones.
- `card` / `card-muted` / `card-ink` / `card-subtle` / `card-faint` — the light floating card and its text tones, from the cream/off-white highlight tones (kept off-pure-white per the "easy on the eyes at night" brief).
- `accent` / `accent-bright` / `accent-deep` — warm gold from the dawn-light highlights. **Not** used as the CTA fill (moodboard is explicit that CTAs are black/near-black) — used instead for the eyebrow label on the dark background and decorative touches, where contrast against `ink-*` is 10:1+.
- `cta` — near-black button fill (`#14171a`), matches moodboard exactly, ~18:1 contrast with white label text.

All pairings actually used for text were checked against WCAG AA (≥4.5:1 for body-size text) with a script before being locked in — see commit message for the specific ratios if you need to re-derive.

## Commands

- `npm install` — install dependencies.
- `npm run dev` — local dev server at `localhost:3000`.
- `npm run build` — production build (static export of the single route).
- `npm run start` — serve the production build locally.
- `npm run lint` — ESLint (flat config, Next core-web-vitals + TypeScript rules).
- `npm run screenshot` — Playwright: screenshots the running app at mobile (390) + desktop (1440) viewports, a narrow-width sweep (320/360, where flex layouts are under the most pressure — this is how the platform-row "Coming soon" pill overflow and the InfoTooltip mobile clipping bugs were both first caught), and the `InfoTooltip` in its open state, to `scripts/out-*.png` (gitignored, regenerate as needed). Start the app first; override target with `BASE_URL`.
- `npm run a11y` — Playwright + axe-core: WCAG2A/AA scan, keyboard tab-order dump, focus-ring check, and a `prefers-reduced-motion` check against the running app. Start the app first; override target with `BASE_URL`. One expected, non-fixable finding: an `aria-required-children` violation *inside* the embedded Spotify `<iframe>` — that's Spotify's own widget markup, not ours (re-run with `EXCLUDE_IFRAME=1` to scope to our own code, which passes clean).

Deploy: push to the connected GitHub repo, Vercel builds `main` automatically. Domain `music.scmhall.blog` is configured at the Vercel project level, not in code.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
