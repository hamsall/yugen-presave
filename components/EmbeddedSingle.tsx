type EmbeddedSingleProps = {
  title: string;
  spotifyEmbedUrl: string;
};

/**
 * Wraps Spotify's own embed widget for the already-live single.
 * No custom audio player — see working-backwards.md: the differentiator
 * here is the page, not reinventing an audio player.
 */
export function EmbeddedSingle({ title, spotifyEmbedUrl }: EmbeddedSingleProps) {
  return (
    <div>
      <p className="mb-2 text-center text-xs font-medium uppercase tracking-wide text-card-faint">
        Hear &ldquo;{title}&rdquo; now
      </p>
      <iframe
        title={`Spotify player: ${title}`}
        src={spotifyEmbedUrl}
        width="100%"
        height={152}
        style={{ borderRadius: 12 }}
        frameBorder={0}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      />
    </div>
  );
}
