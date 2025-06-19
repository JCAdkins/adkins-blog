import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["www.lvvr.com"],
  },
};

export default nextConfig;
