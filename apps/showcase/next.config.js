/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@zenith/shared'],
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
