import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  async redirects() {
    return [
      {
        source: "/Topics",
        destination: "/topics",
        permanent: true,
      },
      {
        source: "/Topics/:path*",
        destination: "/topics/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
