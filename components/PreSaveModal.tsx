"use client";

import { useEffect, useRef } from "react";

type PreSaveModalProps = {
  open: boolean;
  onClose: () => void;
  /** Used as the dialog's accessible name and the iframe's title. */
  title: string;
  embedUrl: string;
  /** Plain link fallback, shown as an escape hatch inside the modal in
   * case the embedded widget doesn't load (e.g. third-party cookies
   * blocked mid-OAuth, ad blockers, etc.). */
  fallbackUrl: string;
};

// Native <dialog>'s modal state traps focus/keyboard but does NOT stop the
// background page from scrolling under mouse wheel/touch drag — that's on
// us. Ref-counted rather than a flat boolean so this stays correct even if
// more than one PreSaveModal instance ever exists on the page at once
// (only Spotify has an embed today, but Apple/Amazon may later).
let scrollLockCount = 0;

function lockBodyScroll() {
  if (scrollLockCount === 0) document.body.style.overflow = "hidden";
  scrollLockCount += 1;
}

function unlockBodyScroll() {
  scrollLockCount = Math.max(0, scrollLockCount - 1);
  if (scrollLockCount === 0) document.body.style.overflow = "";
}

/**
 * In-page modal for a platform's embeddable pre-save widget (currently
 * just CD Baby's Show.co widget for Spotify), so the OAuth hand-off to the
 * streaming service happens without navigating away from the site.
 *
 * Built on the native <dialog> element rather than a hand-rolled overlay:
 * showModal() gives us a real focus trap, Escape-to-close, and a
 * ::backdrop we can style for the glassmorphism blur, all for free and
 * more robustly than reimplementing them would be worth for one modal.
 */
export function PreSaveModal({ open, onClose, title, embedUrl, fallbackUrl }: PreSaveModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      lockBodyScroll();
    } else if (!open && dialog.open) {
      // Let dialog.close() do its thing — the native "close" event below
      // is what actually unlocks scroll and syncs parent state, so this
      // stays correct no matter how the close was triggered.
      dialog.close();
    }
  }, [open]);

  // The native "close" event fires for every way a <dialog> can close —
  // Escape, dialog.close(), form submission — so it's the one place that
  // needs to both release the scroll lock and tell the parent to update
  // its own state. Backdrop/X-button clicks below call dialog.close()
  // directly rather than the onClose prop, so everything funnels through
  // here exactly once per open/close cycle.
  const handleNativeClose = () => {
    unlockBodyScroll();
    onClose();
  };

  // Defensive: if this instance unmounts while still open (not a real
  // path today, but cheap to guard against), don't leave the page
  // permanently unscrollable.
  useEffect(() => {
    const dialog = dialogRef.current;
    return () => {
      if (dialog?.open) unlockBodyScroll();
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-label={title}
      onClose={handleNativeClose}
      onClick={(event) => {
        // A click lands with target === the <dialog> element itself only
        // when it hits the ::backdrop (everything visible inside the
        // panel is wrapped in the div below, so it always catches clicks
        // first). This is the standard "click outside to close" pattern
        // for <dialog>.
        if (event.target === dialogRef.current) dialogRef.current?.close();
      }}
      // m-auto reinstates the browser's own dialog:modal centering trick
      // (position: fixed; inset: 0; margin: auto), which Tailwind's
      // preflight margin reset otherwise clobbers, leaving it pinned to
      // the top-left corner instead of centered.
      className="m-auto w-[300px] max-w-[calc(100vw-1.5rem)] rounded-2xl bg-card p-0 shadow-2xl [&::backdrop]:bg-ink-950/70 [&::backdrop]:backdrop-blur-md"
    >
      <div className="flex items-center justify-between gap-2 px-3 pb-2 pt-3">
        <p className="text-sm font-semibold text-card-ink">{title}</p>
        <button
          type="button"
          onClick={() => dialogRef.current?.close()}
          className="shrink-0 rounded-full p-1.5 text-card-faint transition-colors motion-safe:duration-150 hover:bg-card-muted hover:text-card-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta"
        >
          <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
          </svg>
          <span className="sr-only">Close</span>
        </button>
      </div>

      {/* Only mounted while open, so the widget's own session/state resets
          cleanly each time rather than sitting stale in a hidden iframe. */}
      {open && (
        <iframe
          src={embedUrl}
          title={title}
          width={300}
          height={300}
          className="block"
          allow="storage-access"
        />
      )}

      <p className="px-3 py-2 text-center text-xs text-card-faint">
        Having trouble?{" "}
        <a
          href={fallbackUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-card-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta"
        >
          Open it directly
        </a>
        .
      </p>
    </dialog>
  );
}
