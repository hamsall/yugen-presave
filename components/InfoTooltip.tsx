"use client";

import { useId, useState, type ReactNode } from "react";

type InfoTooltipProps = {
  /** Accessible name for the trigger button, e.g. "Why might this change?" */
  label: string;
  children: ReactNode;
};

/**
 * A small "i" disclosure next to a piece of copy that needs a caveat
 * without cluttering the main text. Works for every input method:
 *
 * - Mouse: shows on hover (`group-hover`).
 * - Keyboard: shows on focus (`group-focus-within`) and closes on Escape.
 * - Touch: shows on tap (the `open` state toggle) — hover alone doesn't
 *   fire reliably on touchscreens, which is most of this page's traffic.
 *
 * The description is duplicated: a permanently-in-the-tree `sr-only` copy
 * (so screen readers get it via aria-describedby regardless of the sighted
 * open/closed state, since `hidden` content is pulled from the a11y tree)
 * and a purely decorative, aria-hidden visual popover for sighted users.
 */
export function InfoTooltip({ label, children }: InfoTooltipProps) {
  const [open, setOpen] = useState(false);
  const descriptionId = useId();

  return (
    <span className="group relative inline-flex">
      <button
        type="button"
        aria-expanded={open}
        aria-describedby={descriptionId}
        onClick={() => setOpen((value) => !value)}
        onBlur={() => setOpen(false)}
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false);
        }}
        className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-card-faint/60 text-[10px] font-semibold leading-none text-card-faint transition-colors motion-safe:duration-150 hover:border-card-faint hover:text-card-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-1 focus-visible:ring-offset-card"
      >
        <span aria-hidden="true">i</span>
        <span className="sr-only">{label}</span>
      </button>

      <span id={descriptionId} className="sr-only">
        {children}
      </span>

      {/*
        Right-aligned to the trigger rather than centered under it: the
        trigger typically sits well right-of-center in its row (e.g. right
        after a date string), so a centered fixed-width box clips off the
        right edge on narrow phones. Anchoring the right edges and letting
        it grow leftward, plus a viewport-relative max-width as a backstop,
        keeps it on-screen at any width.
      */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute right-0 top-full z-20 mt-2 w-56 max-w-[calc(100vw-2rem)] rounded-lg bg-card-ink px-3 py-2 text-left text-xs font-normal leading-snug normal-case tracking-normal text-card shadow-xl ${
          open ? "block" : "hidden group-hover:block group-focus-within:block"
        }`}
      >
        {children}
      </span>
    </span>
  );
}
