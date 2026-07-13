import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactCompiler: false,
  turbopack: {
    root: path.resolve(__dirname)
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.ebayimg.com" },
      { protocol: "https", hostname: "cdn11.bigcommerce.com" },
      { protocol: "https", hostname: "cdn.dribbble.com" },
      { protocol: "https", hostname: "encrypted-tbn0.gstatic.com" },
      { protocol: "https", hostname: "m.media-amazon.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "image.tmdb.org" },
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "images.ctfassets.net" },
      { protocol: "https", hostname: "flagcdn.com" },
    ],
  },
  allowedDevOrigins: ['10.25.33.129', '192.168.88.165'], // Test ip origins
};

export default nextConfig;
