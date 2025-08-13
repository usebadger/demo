import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "demo.usebadger.dev",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "demo-git-feat-showcase-jackmellis-projects.vercel.app",
      },
    ],
  },
};

export default nextConfig;
