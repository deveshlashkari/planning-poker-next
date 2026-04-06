import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prevent Next.js from bundling firebase-admin — it must run as a native
  // Node.js module on the server (Vercel serverless functions).
  serverExternalPackages: ["firebase-admin"],
};

export default nextConfig;
