import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images-na.ssl-images-amazon.com" },
      { protocol: "https", hostname: "i.ebayimg.com" },
      { protocol: "https", hostname: "i.etsystatic.com" },
      { protocol: "https", hostname: "images.footballfanatics.com" },
      { protocol: "https", hostname: "m.media-amazon.com" },
      { protocol: "https", hostname: "**.fbsbx.com" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    // Commerce routes retired 2026-07-17 (utility-hub strategy: monetize after
    // traffic exists). Temporary 307s so the routes can come back cleanly.
    return [
      { source: "/shop", destination: "/", permanent: false },
      { source: "/gear", destination: "/", permanent: false },
      { source: "/gear/:path*", destination: "/", permanent: false },
      { source: "/product/:path*", destination: "/", permanent: false },
      { source: "/category/:path*", destination: "/", permanent: false },
      { source: "/gift-guides", destination: "/", permanent: false },
      { source: "/gift-guides/:path*", destination: "/", permanent: false },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
