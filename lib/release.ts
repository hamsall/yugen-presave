/**
 * Single source of truth for all release-specific data.
 *
 * Nothing platform-specific should be hardcoded in components — when a
 * pending identifier (Spotify URI, Apple Music link, Amazon link) lands,
 * this file is the only thing that should need to change.
 *
 * See AGENTS.md → "Status as of this build" for the provenance of each
 * value below (what's confirmed vs. still pending).
 */

export type Platform = "spotify" | "apple-music" | "amazon-music";

export type PlatformLink = {
  platform: Platform;
  label: string;
  /** null = not yet available. Renders a "Coming soon" state, never hidden. */
  url: string | null;
};

export type ReleaseConfig = {
  /** EP title — "Yūgen" (with the macron on the u; confirmed via the
   *  Spotify for Artists listing, not a stylistic lowercase choice). */
  title: string;
  artist: string;
  /** ISO 8601 timestamp, including explicit UTC offset. */
  releaseDate: string;
  /** Path under /public. */
  coverArtSrc: string;
  coverArtAlt: string;
  existingSingle: {
    title: string;
    /** Spotify's own oEmbed iframe URL for the already-live single. */
    spotifyEmbedUrl: string;
  };
  platforms: PlatformLink[];
};

export const releaseConfig: ReleaseConfig = {
  title: "Yūgen",
  artist: "Sam Hall",
  // 24 Sept 2026, 12:00 GMT+1 — this is the *earliest* release moment,
  // straight from the Spotify for Artists release page (which carries the
  // same "earliest it can go live" caveat we surface via <InfoTooltip> next
  // to the on-page date). Confirmed as correct; the "25 September 2026"
  // used elsewhere in working-backwards.md was the stale value.
  releaseDate: "2026-09-24T12:00:00+01:00",
  coverArtSrc: "/yugen-cover.jpg",
  coverArtAlt: "Cover art for 'Yūgen' by Sam Hall",
  existingSingle: {
    // Confirmed via the Spotify embed itself (rendered title): "Ghost Girl".
    // Not the same track as the "Yūgen"-titled instant-gratification track
    // mentioned in working-backwards.md for the (separate, pending) Apple
    // Music pre-order path — two different songs, don't conflate them.
    title: "Ghost Girl",
    spotifyEmbedUrl: "https://open.spotify.com/embed/track/5Y6S5ckQMKrSpAOMfgBtKR",
  },
  platforms: [
    {
      platform: "spotify",
      label: "Spotify",
      // Resolved for this build: spotify:album:0oDjObLTKHWZuBRAnQ2enA
      url: "https://open.spotify.com/album/0oDjObLTKHWZuBRAnQ2enA",
    },
    {
      platform: "apple-music",
      label: "Apple Music",
      url: null,
    },
    {
      platform: "amazon-music",
      label: "Amazon Music",
      url: null,
    },
  ],
};
