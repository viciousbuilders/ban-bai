import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      ...["card-table", "ban-bai"].map((app) => ({
        source: "/:path*",
        has: [{ type: "host" as const, value: `${app}\\.vietbrosinaus\\.com` }],
        destination: `https://${app}.viciousbuilders.com/:path*`,
        permanent: true,
      })),
    ];
  },
};

export default nextConfig;
