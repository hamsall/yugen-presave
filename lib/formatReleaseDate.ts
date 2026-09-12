/**
 * Formats the release date consistently regardless of the server/browser's
 * local timezone, anchored to Europe/London (matching the "LONDON —"
 * dateline in working-backwards.md's press release). Used both in on-page
 * copy and in page metadata, so the two never drift apart.
 */
export function formatReleaseDate(releaseDateIso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/London",
  }).format(new Date(releaseDateIso));
}
