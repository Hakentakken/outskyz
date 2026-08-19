import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Remote editorial assets are served directly by Unsplash. This avoids stale
    // optimizer entries when a curated image is replaced.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "unsplash.com",
        pathname: "/photos/**",
      },
    ],
  },
};

export default nextConfig;
