import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  // Pin the project root (a stray package-lock.json in C:\Users\user confuses Next)
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
