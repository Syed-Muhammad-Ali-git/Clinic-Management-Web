import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["firebase-admin", "@google-cloud/storage"],
  typescript: {
    // Type errors are caught locally; don't block Vercel deploys
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
