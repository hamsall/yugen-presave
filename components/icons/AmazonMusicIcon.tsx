export function AmazonMusicIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="10.5" r="8" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10.3 7.3v6.4l5.1-3.2-5.1-3.2Z" fill="currentColor" />
      <path
        d="M6 19c3.6 2.1 8.4 2.1 12 0"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M17 18.4l1.4.6-.4 1.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
