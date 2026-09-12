import { CoverArtCard } from "@/components/CoverArtCard";
import { releaseConfig } from "@/lib/release";

export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-4 py-12 sm:py-16">
      <p className="text-center text-xs font-semibold uppercase tracking-[0.35em] text-accent-bright">
        Pre-save the EP
      </p>
      <CoverArtCard />
      <p className="max-w-sm text-center text-xs text-mist">
        {releaseConfig.artist} · {releaseConfig.title}
      </p>
    </main>
  );
}
