import type { ComponentType } from "react";
import type { PlatformLink } from "@/lib/release";
import { AmazonMusicIcon } from "./icons/AmazonMusicIcon";
import { AppleMusicIcon } from "./icons/AppleMusicIcon";
import { SpotifyIcon } from "./icons/SpotifyIcon";

const ICONS: Record<PlatformLink["platform"], ComponentType<{ className?: string }>> = {
  spotify: SpotifyIcon,
  "apple-music": AppleMusicIcon,
  "amazon-music": AmazonMusicIcon,
};

type PlatformSaveRowProps = {
  link: PlatformLink;
  isReleased: boolean;
};

export function PlatformSaveRow({ link, isReleased }: PlatformSaveRowProps) {
  const Icon = ICONS[link.platform];
  const ctaLabel = isReleased ? "Listen" : "Pre-Save";

  return (
    // overflow-hidden is a deliberate backstop: without it, if the label
    // ever wraps to two lines under width pressure, the button/pill can
    // render a pixel or two past the rounded corners instead of being
    // clipped to them.
    <li className="flex items-center justify-between gap-1.5 overflow-hidden rounded-xl bg-card-muted px-3 py-3 sm:gap-3 sm:px-4">
      <span className="flex min-w-0 items-center gap-1.5 text-card-ink sm:gap-3">
        <Icon className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" />
        <span className="truncate whitespace-nowrap text-sm font-medium sm:text-base">
          {link.label}
        </span>
      </span>

      {link.url ? (
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-full bg-cta px-3 py-2 text-xs font-semibold uppercase tracking-normal text-white transition-colors motion-safe:duration-150 hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-2 focus-visible:ring-offset-card-muted sm:px-5 sm:text-sm sm:tracking-wide"
        >
          {ctaLabel}
          <span className="sr-only"> {link.label}</span>
        </a>
      ) : (
        <span className="shrink-0 rounded-full border border-card-faint/50 px-3 py-2 text-xs font-semibold uppercase tracking-normal text-card-faint sm:px-5 sm:text-sm sm:tracking-wide">
          Coming soon
        </span>
      )}
    </li>
  );
}
