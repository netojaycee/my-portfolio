import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // /vr was the preview route; the 3D experience is now the landing page.
  async redirects() {
    return [{ source: "/vr", destination: "/", permanent: false }];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
