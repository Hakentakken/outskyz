import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /**
     * Image optimisation is enabled.
     *
     * It was previously `unoptimized: true`, which served every image as its
     * raw original: full-resolution Unsplash JPEGs at ~1800px plus multi-MB
     * local files, with no AVIF/WebP, no responsive `sizes` and no blur
     * placeholder. That dominated page weight — Lighthouse measured ~6 MB of
     * images on the home page.
     *
     * `formats` negotiates AVIF first, falling back to WebP.
     * `deviceSizes` covers the breakpoints this site actually uses.
     */
    formats: ["image/avif", "image/webp"],
    // Keep Next's default deviceSizes/imageSizes: narrowing them makes common
    // widths (750, 828, 1080, 1200) unrequestable, which silently breaks the
    // `sizes` hints on our own components.
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

  /**
   * Long-lived caching for fingerprinted static assets. Everything under
   * /_next/static is content-hashed, so it is safe to cache immutably.
   */
  async headers() {
    return [
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:path*.(svg|ico|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800, stale-while-revalidate",
          },
        ],
      },
    ];
  },

  /**
   * Revalidate server-rendered routes occasionally. Static pages are generated
   * at build time; dynamic ones (e.g. the admin panel) should not cache stale
   * auth-dependent output for long.
   */
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
};

export default nextConfig;
