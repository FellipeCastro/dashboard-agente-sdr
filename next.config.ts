import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_PROJECT_NAME: process.env.NEXT_PROJECT_NAME || '',
  },
};

export default nextConfig;
