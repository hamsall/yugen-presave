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
    <li className="flex items-center justify-between gap-3 rounded-xl bg-card-muted px-4 py-3">
      <span className="flex items-center gap-3 text-card-ink">
        <Icon className="h-6 w-6 shrink-0" />
        <span className="text-sm font-medium sm:text-base">{link.label}</span>
      </span>

      {link.url ? (
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-full bg-cta px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white transition-colors motion-safe:duration-150 hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-2 focus-visible:ring-offset-card-muted sm:text-sm"
        >
          {ctaLabel}
          <span className="sr-only"> {link.label}</span>
        </a>
      ) : (
        <span className="shrink-0 rounded-full border border-card-faint/50 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-card-faint sm:text-sm">
          Coming soon
        </span>
      )}
    </li>
  );
}
