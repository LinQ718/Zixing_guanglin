import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Workers compatibility
  images: {
    unoptimized: true,
  },
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;

