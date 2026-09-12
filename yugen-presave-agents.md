# AGENTS.md — yugen pre-save site

This file is the repo-level brief for any coding agent (or human) working in this project. Read it before making changes. If a decision here turns out to be wrong, update this file in the same commit that changes the decision — it should never go stale.

**Source of truth for product intent:** `../working-backwards.md` (one level up, in the planning repo). Read that first if you want the *why*; this file is the *how*.

---

## What this is

A single-page, single-purpose pre-save/pre-add landing page for Sam Hall's debut album *yugen*, releasing **25 September 2026**. Lives at `music.scmhall.blog`. This is also the seed of a larger portfolio rebuild (scmhall.blog is replacing hamsall.blog) — but v1 scope is this one page, done well, shipped fast. Do not let "the bigger site" scope-creep into this build.

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

1. **Background:** dark, atmospheric, photographic or textured (deep navy/near-black base). This is the "yugen" mood layer — quiet, spacious, a little mysterious. Not a flat corporate gradient.
2. **Content card:** a light, high-contrast card/panel floats on top of the dark background, containing the cover art, countdown, and CTA(s). This is where legibility and focus live — don't try to make the dark background carry body text.
3. **CTA buttons:** bold, black or near-black, rectangular or pill-shaped, capitalized label (e.g. "PRE-SAVE"). No gradients, no shadows-as-decoration.
4. **Countdown:** segmented (days / hours / mins / secs), each unit clearly labelled underneath the number. Monospace or tabular-numeral treatment so digits don't jitter the layout as they tick.
5. **Multi-platform picker:** when more than one platform is available, render a **stacked list of rows**, each with the platform's logo + name on the left and its own button on the right (per the bottom-right reference image). This is not a segmented control or a dropdown — it's a simple list, dark-mode styled, one row per platform.
6. **User Context**: while accessibility is key, remember people will be using instagram at night, so whilst constrast is important we want the final result to be easy on the eyes. also to match the dark, atmospheric mood.

**Palette:** derived from the actual `yugen` album art, not chosen in the abstract. Once the cover file is in this project's `public/` folder, extract the palette from it directly — dark-blue-leaning tones from the art as the base/background, one accent pulled from the art's warmest/brightest colour for the CTA, checked against WCAG AA contrast before locking. Don't guess a generic "dark blue" independently of the actual image.

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
  title: string; // "yugen"
  artist: string; // "Sam Hall"
  releaseDate: string; // ISO date, 2026-09-25
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

## Components (rough shape — adjust as you build, keep this section current)

- `CoverArtCard` — cover art + countdown + platform list, the whole "card" from the moodboard.
- `Countdown` — a hook (`useCountdown(releaseDate)`) + presentational component. Must handle: page loaded after release date (show "Out now" state, not negative numbers), respect `prefers-reduced-motion` (no animated flip transitions if the user has that set), and not spam screen readers every second — use a single `aria-live="polite"` region that updates at a sane interval (e.g. once a minute, not once a second) rather than reading out every tick.
- `PlatformSaveList` — the stacked row list from the moodboard; each row is a `PlatformSaveRow` (logo, label, button/coming-soon state).
- `EmbeddedSingle` — wraps Spotify's own embed widget for the already-live single (no custom audio player — see working-backwards doc, the differentiator is the page, not the player).

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

## Commands

_To be filled in once the project is scaffolded (package manager, dev/build/lint scripts). Keep this section accurate — an agent picking up this repo cold should be able to get running from this file alone._

## Open questions still tracked in the working-backwards doc

See `../working-backwards.md` for: Spotify URI status, Apple/Amazon eligibility, exact palette hex values, embed-vs-custom-player decision (already leaning embed). Don't duplicate that tracking here — update it there.
