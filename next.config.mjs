/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    unoptimized: true,

    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.falconeyephilmz.com",
        port: "8000",
        pathname: "/assets/**",
      },
    ],
  },
}

export default nextConfig
