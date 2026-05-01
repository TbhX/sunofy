/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    webpackBuildMode: 'single-pass',
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        maxChunkSize: 2000000, // 2MB target max chunk size
        cacheGroups: {
          ...config.optimization.splitChunks?.cacheGroups,
          default: false,
          vendors: false,
          commons: {
            name: 'commons',
            chunks: 'all',
            minChunks: 2,
            maxChunkSize: 2000000,
          },
        },
      };
    }
    return config;
  },
};

export default nextConfig;
