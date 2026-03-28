import path from "path";
import type { NextConfig } from "next";

/** Next.js config — add images.remotePatterns, rewrites to API, etc. as needed */
const nextConfig: NextConfig = {
  // Monorepo: trace files from repo root (avoids picking a parent lockfile as root)
  outputFileTracingRoot: path.join(__dirname, "../.."),
};

export default nextConfig;
