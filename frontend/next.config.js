/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    images: {
      allowFutureImage: true,
      unoptimized: true,
    },
  },
  trailingSlash: true,
  publicRuntimeConfig: {
    API_URL: process.env.API_URL,
  },
};

module.exports = nextConfig;
