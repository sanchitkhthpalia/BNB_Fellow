/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  eslint: {
    ignoreDuringBuilds: true, // optional - helps avoid build fails on lint errors
  },
  typescript: {
    ignoreBuildErrors: true, // optional - avoids blocking build on TS warnings
  },
}

module.exports = nextConfig
