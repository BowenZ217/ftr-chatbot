import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    images: {
      domains: ['upload.wikimedia.org'], // Add the allowed domain here
    },
};

export default nextConfig;
