import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  sassOptions: {
    additionalData: `@use "@/shared/styles/variables" as *;
@use "@/shared/styles/mixins" as *;`,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'front-school.minio.ktsdev.ru',
      },
    ],
  },
};

export default nextConfig;