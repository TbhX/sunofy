/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudflare Pages compatibility
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
