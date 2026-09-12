"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type CountdownSnapshot = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isReleased: boolean;
};

function computeSnapshot(releaseTimeMs: number, nowMs: number): CountdownSnapshot {
  const diffMs = Math.max(releaseTimeMs - nowMs, 0);
  const isReleased = diffMs <= 0;
  const totalSeconds = Math.floor(diffMs / 1000);

  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    isReleased,
  };
}

function pluralize(value: number, unit: string): string {
  return `${value} ${unit}${value === 1 ? "" : "s"}`;
}

function formatAnnouncement(snapshot: CountdownSnapshot, title: string): string {
  if (snapshot.isReleased) {
    return `${title} is out now.`;
  }

  const parts: string[] = [];
  if (snapshot.days > 0) parts.push(pluralize(snapshot.days, "day"));
  if (snapshot.days > 0 || snapshot.hours > 0) parts.push(pluralize(snapshot.hours, "hour"));
  parts.push(pluralize(snapshot.minutes, "minute"));

  return `${parts.join(", ")} until ${title} is released.`;
}

/**
 * Tracks time remaining until `releaseDateIso`.
 *
 * Deliberately client-only and mount-gated: `snapshot` starts `null` so the
 * server-rendered/static HTML never bakes in a "current" countdown value
 * (this page is statically generated and may be served, unchanged, for
 * weeks — the countdown has to be computed at each pageview, not at build
 * time). This also sidesteps hydration mismatches, since the first client
 * render before effects run matches the server's `null` branch exactly.
 *
 * The `announcement` string only changes once per minute (or on the
 * released/not-released transition), for a single `aria-live="polite"`
 * region — screen readers get a periodic update, not a read-out every tick.
 */
export function useCountdown(releaseDateIso: string, title: string) {
  const releaseTimeMs = useMemo(() => new Date(releaseDateIso).getTime(), [releaseDateIso]);
  const [snapshot, setSnapshot] = useState<CountdownSnapshot | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const lastBucketRef = useRef<string | null>(null);

  useEffect(() => {
    function tick() {
      const next = computeSnapshot(releaseTimeMs, Date.now());
      setSnapshot(next);

      const bucket = next.isReleased ? "released" : `${next.days}-${next.hours}-${next.minutes}`;
      if (bucket !== lastBucketRef.current) {
        lastBucketRef.current = bucket;
        setAnnouncement(formatAnnouncement(next, title));
      }
    }

    tick();

    if (Date.now() >= releaseTimeMs) {
      return;
    }

    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [releaseTimeMs, title]);

  return { snapshot, announcement };
}
