import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
import type { ReactNode } from "react";
import { formatReleaseDate } from "@/lib/formatReleaseDate";
import { releaseConfig } from "@/lib/release";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const pageTitle = `${releaseConfig.title} — ${releaseConfig.artist}`;
const description = `${releaseConfig.artist}'s debut album "${releaseConfig.title}" is out ${formatReleaseDate(
  releaseConfig.releaseDate,
)}. Pre-save it now so it shows up in your library automatically on release day — no account, no email, one tap.`;

export const metadata: Metadata = {
  metadataBase: new URL("https://music.scmhall.blog"),
  title: pageTitle,
  description,
  openGraph: {
    title: pageTitle,
    description,
    url: "/",
    siteName: pageTitle,
    type: "website",
    images: [
      {
        url: releaseConfig.coverArtSrc,
        width: 1024,
        height: 1024,
        alt: releaseConfig.coverArtAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description,
    images: [releaseConfig.coverArtSrc],
  },
};

export const viewport: Viewport = {
  themeColor: "#0a1f28",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="relative min-h-full overflow-x-hidden antialiased">
        {/*
          The atmospheric background: the cover art itself, blurred and
          darkened, rather than a flat corporate gradient — per AGENTS.md's
          moodboard direction. Decorative only, so it's aria-hidden; the
          crisp copy of the same art inside CoverArtCard is the one that
          matters for screen readers / SEO and carries the real alt text.
        */}
        <div aria-hidden="true" className="fixed inset-0 -z-10">
          <Image
            src={releaseConfig.coverArtSrc}
            alt=""
            fill
            quality={30}
            sizes="100vw"
            className="scale-125 object-cover opacity-30 blur-3xl"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink-950/80 via-ink-900/90 to-ink-950" />
        </div>

        {children}
      </body>
    </html>
  );
}
