import Image from "next/image";
import { formatReleaseDate } from "@/lib/formatReleaseDate";
import { releaseConfig } from "@/lib/release";
import { CountdownAndPlatforms } from "./CountdownAndPlatforms";
import { EmbeddedSingle } from "./EmbeddedSingle";
import { InfoTooltip } from "./InfoTooltip";

/**
 * The whole floating light card from the moodboard: cover art, countdown,
 * embedded single, and the platform picker. Server-rendered except for the
 * <CountdownAndPlatforms> island, which needs the client for the ticking
 * clock and the release-day relabel.
 */
export function CoverArtCard() {
  const { title, artist, releaseDate, coverArtSrc, coverArtAlt, existingSingle, platforms } =
    releaseConfig;

  return (
    <section
      aria-labelledby="release-title"
      className="w-full max-w-sm rounded-3xl bg-card p-5 shadow-2xl shadow-black/50 sm:max-w-md sm:p-7"
    >
      <div className="overflow-hidden rounded-2xl bg-card-muted">
        <Image
          src={coverArtSrc}
          alt={coverArtAlt}
          width={1024}
          height={1024}
          priority
          sizes="(min-width: 640px) 420px, 90vw"
          className="h-auto w-full object-cover"
        />
      </div>

      <div className="mt-5 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-card-faint">{artist}</p>
        <h1 id="release-title" className="mt-1 text-3xl font-semibold tracking-tight text-card-ink">
          {title}
        </h1>
        <p className="mt-1 flex items-center justify-center gap-1.5 text-sm font-medium text-accent-deep">
          <span>Available {formatReleaseDate(releaseDate)}</span>
          <InfoTooltip label="Why the exact time might shift">
            This is the earliest {title} can go live anywhere — Spotify&rsquo;s own release page
            carries the same caveat. If the countdown hits zero and it&rsquo;s not showing up for
            you yet, it&rsquo;s on its way and should be there very soon.
          </InfoTooltip>
        </p>
      </div>

      {/*
        Order follows the working-backwards FAQ's own scan sequence for a
        cold visitor: identity (above) -> sound -> when -> how to not miss
        it. A stranger needs proof-of-real (the embed) before a countdown
        or a button means anything to them.
      */}

      <div className="mt-6">
        <CountdownAndPlatforms releaseDate={releaseDate} title={title} platforms={platforms} />
      </div>

      <p className="mt-6 text-center text-xs leading-relaxed text-card-faint">
        One tap and it&rsquo;s done — {title} shows up automatically in your library on release day.
        Nothing to remember.
      </p>
      
      <div className="mt-5">
        <EmbeddedSingle title={existingSingle.title} spotifyEmbedUrl={existingSingle.spotifyEmbedUrl} />
      </div>
    </section>
  );
}
