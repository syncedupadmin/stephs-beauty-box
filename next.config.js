/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow placeholder images during development
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

module.exports = nextConfig;
