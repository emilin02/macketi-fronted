import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'macketi.com',
      },
      {
        protocol: 'https',
        hostname: 'www.macketi.com',
      },
    ],
    minimumCacheTTL: 86400,
  },
  experimental: {
    imgOptTimeoutInSeconds: 30,
  },
};

export default nextConfig;
