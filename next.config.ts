import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow the Anthropic SDK to run in Node.js API routes
  serverExternalPackages: ["@anthropic-ai/sdk"],
};

export default nextConfig;
