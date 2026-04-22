import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname),
  images: {
    remotePatterns: [{ protocol: "https", hostname: "img.clerk.com" }],
  },
};

export default nextConfig;
