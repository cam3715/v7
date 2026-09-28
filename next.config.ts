import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",

  // GitHub Pages repository path
  basePath: process.env.PAGES_BASE_PATH || "",

  // Helps routes like /projects work correctly on static hosting
  trailingSlash: true,

  // Required if you use next/image on a static export
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
