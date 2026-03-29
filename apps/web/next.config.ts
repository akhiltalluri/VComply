import path from "path";
import type { NextConfig } from "next";

/** Next.js config — add images.remotePatterns, rewrites to API, etc. as needed */
const nextConfig: NextConfig = {
  // Monorepo: trace files from repo root (avoids picking a parent lockfile as root)
  outputFileTracingRoot: path.join(__dirname, "../.."),
  devIndicators: false,
  async rewrites() {
    const backendUrl = (process.env.BACKEND_API_URL ?? "http://localhost:8001").replace(/\/$/, "");

    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
