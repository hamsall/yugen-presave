import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Default (75) for the crisp in-card cover art, 30 for the blurred
    // decorative background layer in app/layout.tsx (low quality is
    // imperceptible once blurred, and keeps mobile-data payload down).
    qualities: [30, 75],
  },
};

export default nextConfig;
