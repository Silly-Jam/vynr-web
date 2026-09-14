import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/atlas/americas/chile/curico-valley",
        destination: "/atlas/americas/chile/central-valley/curico-valley",
        permanent: true,
      },
      {
        source: "/atlas/americas/chile/limari-valley",
        destination: "/atlas/americas/chile/coquimbo/limari-valley",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/.well-known/apple-app-site-association",
        headers: [
          { key: "Content-Type", value: "application/json" },
        ],
      },
    ];
  },
};

export default nextConfig;
