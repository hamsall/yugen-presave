"use client";

import type { PlatformLink } from "@/lib/release";
import { useCountdown } from "@/lib/useCountdown";
import { Countdown } from "./Countdown";
import { PlatformSaveList } from "./PlatformSaveList";

type CountdownAndPlatformsProps = {
  releaseDate: string;
  title: string;
  platforms: PlatformLink[];
};

/**
 * The one client-side island on the page: owns the ticking countdown state
 * and derives `isReleased` from it, so the platform buttons can relabel
 * from "Pre-Save" to "Listen" the moment release day arrives — without
 * that transition ever being baked into the static build.
 */
export function CountdownAndPlatforms({ releaseDate, title, platforms }: CountdownAndPlatformsProps) {
  const { snapshot, announcement } = useCountdown(releaseDate, title);
  const isReleased = snapshot?.isReleased ?? false;

  return (
    <>
      <Countdown snapshot={snapshot} announcement={announcement} title={title} />
      <div className="mt-6">
        <PlatformSaveList platforms={platforms} isReleased={isReleased} />
      </div>
    </>
  );
}
