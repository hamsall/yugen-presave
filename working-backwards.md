# Working Backwards: "yugen" pre-save landing page

**Format:** Amazon-style PR/FAQ. Write the press release first, as if the thing already shipped and worked — then stress-test it with questions. If the press release is boring or vague, the product idea is too; fix the idea, not the prose.

**Status:** Draft for discussion — nothing built yet. This is the artefact we argue with before writing code.

---

## PRESS RELEASE

### A one-tap way to make sure you don't miss "yugen" the moment it drops

**LONDON — September 25, 2026** (This will be earlier in other places as the song rolls out across the world.) — Today, singer-songwriter Sam Hall (scmhall.blog) released *yugen*, his debut album, and launched a companion page — [music.scmhall.blog] — that lets listeners lock in the release before it exists. No new account is needed: each button on the page simply hands off to a streaming service the listener already has — Spotify, and Apple Music where eligible — so the only requirement is already being a user of one of those.

Most independent artists ask fans to "remember to check back" — a request that quietly fails almost every time. A fan hears a song they like, means to follow up, and by the time they think of it again the release-week moment has passed and the algorithm has moved on. The new page removes the remembering entirely: a tap on the Spotify button pre-saves the album straight into a fan's Spotify library; a tap on the Apple Music button pre-adds it there instead. Either way, on release day it simply appears, already theirs, no further action needed.

"I didn't want to ask people to do work to support something they already liked," said Hall. "588 people already listen to the first single every month. The only thing standing between them and the album was a chore — remembering. So I made the chore easy."

The page itself is deliberately spare: the cover art, the "yugen" name, a countdown to release day, the existing single playable on the spot, and one button for each of the available pre save options. No email capture, no popups, no merch upsell — because every extra ask is a chance for someone who already wanted to say yes to leave instead.

Early listener Jess K. put it simply: "I clicked one thing on my phone and forgot about it. Then on Friday the album was just... there. That's it, that's the whole feature, and it's more than most artists manage."

The page is live now at music.scmhall.blog.

---



## EXTERNAL FAQ (the listener's questions)

**What actually happens when I click "pre-save"?**
Tap the button for whichever service you already use. Spotify's button pre-saves the album straight to your Spotify library; Apple Music's button (if it's live in time) pre-adds it there instead. Either way, the album shows up on release day automatically. You don't have to come back, remember, or do anything else.

**Why are there multiple buttons instead of just one?**
Because pre-save/pre-add is a feature each streaming service runs on its own account system — there's no single action that reaches into Spotify and Apple Music at once. You only ever need the one button matching your own service; the others are just there for people who use something different from you.

**Do I need to make an account or give you my email?**
No. Pre-save works through your existing Spotify/Apple login. Nothing is collected, nothing is emailed.

**What if I don't use Spotify or Apple Music?**
The page still works as a normal landing page — cover art, release date, a way to hear the existing single, and links out to whatever platform you do use once it's live. You're not locked out, you just don't get the automatic part.

**Will this spam me or post on my behalf?**
No posting, no notifications beyond what Spotify/Apple's own pre-save feature does natively. This page doesn't ask for any permission beyond the platform's built-in save action.

**Why should I bother, I'll probably see it anyway?**
Maybe — but "probably" is exactly the gap this closes. Algorithmic surfacing (Release Radar, autoplay) is driven by early-day engagement; pre-saving is also literally how you personally guarantee you don't rely on that "probably."

---



## INTERNAL FAQ (the build questions)

**Who, precisely, is the customer for this page?**
Two real segments, ranked by who the page should be optimised for first:

1. **The existing warm base** — 588 monthly listeners, 64 monthly *active* listeners, 4 super listeners on the single. Small, but real: people who already chose to keep listening. This is who gets a direct, personal nudge (DM/story/post), and the page needs to reward them instantly — cover art + countdown + "yes, this is real, here's the button."
2. **Cold/new arrivals during release week** — someone who taps a shared link or an Instagram story and has never heard of Sam Hall. The page has ~3 seconds to answer: whose music, what's it called, does it sound like something I'd like, when does it land, how do I not miss it. This segment needs the embedded single more than the countdown — they need to *hear* before they'll commit.

**What is the actual problem we're solving, in one sentence?**
Listeners who already want to say yes lose the moment between "I like this" and "release day" because remembering is friction, and friction has a near-100% attrition rate. The page's only job is to convert an in-the-moment "yes" into a guaranteed future action, with zero remembered effort required from the listener.

**What does the page explicitly NOT need to do (v1 scope)?**

- No email/mailing list capture — adds a decision point (asks for personal info) exactly where the goal is minimum friction. Revisit post-release if there's a real reason to build a mailing relationship.
- No merch, no tour dates, no "about the artist" essay — every additional module competes for the 3-second window with the one thing that matters (the button).
- No CMS or multi-page nav — this is one route, not the start of the full portfolio rebuild. That happens after.
- No account system, no analytics dashboard beyond whatever Spotify/Vercel give for free.

**What does success look like, concretely?**
Primary metric: pre-save count by release day, specifically among the existing 588/64/4 — a direct, trackable "did the warm base actually convert" number, checkable by DM/story reply follow-ups since there's no formal tracking pixel.
Secondary/soft signal: day-one stream concentration (Spotify for Artists dashboard) — a spike on Sept 24/25 specifically, vs. a flat trickle, is the sign the release-week push (including this page) worked, per Spotify's own "early concentration triggers algorithmic pickup" mechanic.
This is explicitly not a vanity-metrics project — 4 super listeners converting is a real, countable win at this scale, not a failure because the number is small.

**What's the critical dependency risk, and what's the fallback?**
Spotify pre-save requires the release delivered to Spotify and a valid URI from Spotify for Artists → confirm this today (see action list from earlier).

Apple Music pre-add is a separate, stricter path per CD Baby's own rules: sign up for iTunes Pre-Order inside the CD Baby submission flow, select one **"instant gratification" track** (a song fans can hear immediately, ahead of the rest of the album), and the release date must fall at least 7 days after the pre-order signup (CD Baby recommends 30 days total lead time). At ~15 days out this is tight but not automatically disqualifying — the honest test is whether the iTunes Pre-Order option actually appeared during CD Baby setup; if it didn't, it's not eligible for this release, full stop. Check, don't assume.

Amazon Music pre-order rides on the same iTunes-style eligibility window per CD Baby, so if Apple qualifies, Amazon is close to a free extra button — low priority for this audience, but worth toggling on if it's sitting right there in the dashboard.

Fallback if any platform's identifier isn't ready in time to build against: ship the page with the countdown + embedded single + a "link coming soon" state for that one button specifically, and wire it in the moment the identifier lands. Don't let the whole page wait on the slowest platform; let each button wait on its own dependency.

**What are the design tenets for this specific page (not the whole future site)?**

1. **One decision — pick your platform, then one tap.** Every element on the page should serve that decision, not distract from it. Multiple buttons isn't the same as multiple decisions: each fan only ever looks at the one button matching the service they already use.
2. **Trustworthy at a glance for strangers.** A cold visitor needs proof-of-real (real cover art, real embedded audio) before they'll tap anything.
3. **Zero-effort follow-through.** The entire value proposition is "you don't have to remember" — the copy should say this directly, not imply it.
4. **Dark blue, accessible, calm** — matches the "yugen" mood; not competing visually with the countdown/CTA.
5. **Fast.** A release-week link shared on mobile has to load instantly on a phone on data, not wifi.

**How does this page relate to the bigger portfolio redesign?**
This route ships first, alone, in the new stack (Next.js/TypeScript/Tailwind on scmhall.blog), as both the real marketing deliverable and the flagship "built agentically, fast, in a stack I was still learning" case study. The rest of the site (nav, bio, migrated case studies) is explicitly out of scope for this document and gets its own working-backwards pass once this ships.

**What's the one thing that would make this a failure even if it looks fine?**
Shipping something generically pretty that a cold visitor can't parse in 3 seconds, or that makes the warm base's "yes" take more than one tap. Polish is not the goal here; conversion of an already-willing listener is.


**EP or Album?**
Let's call this an EP, since an EP is just a short album but it's good to be specific.
---



## Open questions to resolve before build starts

1. Spotify URI / delivery status — checked 10 Sept, will check daily until 15th when email will be sent.
2. ~~Exact final "yugen" cover art file, for real (not placeholder)~~ — **Done (10 Sept)**
3. ~~Moodboard/palette specifics beyond "dark blue, accessible" — you mentioned sending this separately.~~ **Done (10 Sept)** - specific colours are based on album art
4. ~~Do we want the existing single embedded via Spotify's own embed widget (fastest, zero custom audio-player build) or a custom player (slower, more "look what I built" signal)? Recommend the embed widget for v1 given the timeline — the differentiator here is the *page*, not reinventing an audio player.~~ **Done (10 Sept)** - embed widget
5. ~~Check the CD Baby dashboard for delivery status.~~ **Done (10 Sept):** delivered to all platforms as of 9 Sept.
   - Spotify for Artists not yet showing the release/URI — normal at 1 day post-delivery, re-check in 2-3 days.
   - Apple Music: CD Baby says they're creating an **Apple Music for Artists account** — this is a different thing from iTunes Pre-Order eligibility on the release itself. **Action:** ask CD Baby support directly whether iTunes Pre-Order was enabled for this release, rather than waiting on the account-creation process to resolve.
6. ~~If Apple pre-add turns out to be eligible, which track is the "instant gratification" track? Needs picking then, not at build time.~~ **Done (10 Sept):** The instant gratification track is Yugen, the first song from the EP.
7. ~~**Working assumption for the build starting now:** Spotify URI and Apple pre-add status are both still pending. Build the page with both buttons as "coming soon" states and the existing single embedded live (no dependency there) — wire in real links the moment each identifier confirms. Don't block the build on either.~~ **Done (10 Sept)** - Yes, build with coming soon states and embedded live and wire in once available

