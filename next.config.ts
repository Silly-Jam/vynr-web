import type { NextConfig } from "next";

import { assertPublicationEpochs, publicationDigest } from './lib/publication';

assertPublicationEpochs();

const nextConfig: NextConfig = {
  // Next embeds this value in the route bundle from this build's exact inputs.
  env: { VYNR_PUBLICATION_DIGEST: publicationDigest() },
  async redirects() {
    return [
      {
        source: "/atlas/europe/italy/trentino-alto-adige/st-magdalener-classico",
        destination: "/atlas/europe/italy/trentino-alto-adige/alto-adige/st-magdalener-classico",
        permanent: true,
      },
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
