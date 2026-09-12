import type { CountdownSnapshot } from "@/lib/useCountdown";

type CountdownUnit = {
  key: keyof Pick<CountdownSnapshot, "days" | "hours" | "minutes" | "seconds">;
  label: string;
};

const UNITS: CountdownUnit[] = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Mins" },
  { key: "seconds", label: "Secs" },
];

type CountdownProps = {
  snapshot: CountdownSnapshot | null;
  announcement: string;
  title: string;
};

/**
 * Purely presentational — see lib/useCountdown.ts for the ticking logic.
 *
 * The visible digit grid is `aria-hidden`: the single `aria-live="polite"`
 * region below is the whole screen-reader-facing countdown experience, so
 * there's exactly one thing being announced, on a sane cadence, never once
 * per second.
 */
export function Countdown({ snapshot, announcement, title }: CountdownProps) {
  const isReleased = snapshot?.isReleased ?? false;

  return (
    <div role="group" aria-label={`Countdown to ${title} release`} className="w-full">
      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>

      {isReleased ? (
        <p className="text-center text-lg font-semibold tracking-wide text-card-ink">
          Out now — go listen.
        </p>
      ) : (
        <div aria-hidden="true" className="grid grid-cols-4 gap-2 sm:gap-3">
          {UNITS.map(({ key, label }) => (
            <div
              key={key}
              className="flex flex-col items-center rounded-lg bg-card-muted py-2 sm:py-3"
            >
              <span className="font-mono text-xl font-semibold tabular-nums text-card-ink sm:text-2xl">
                {(snapshot?.[key] ?? 0).toString().padStart(2, "0")}
              </span>
              <span className="mt-1 text-[10px] font-medium uppercase tracking-wide text-card-faint sm:text-xs">
                {label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
