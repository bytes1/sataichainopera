import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.fallback = { crypto: false }; // Disable crypto fallback
    return config;
  },
};

export default nextConfig;
