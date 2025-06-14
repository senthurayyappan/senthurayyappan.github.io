/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Disable API routes in static export
  rewrites: async () => {
    return []
  },
  // Add trailing slashes for static export
  trailingSlash: true,

  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Add rule for GLSL files
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      use: ['raw-loader']
    });

    // Important: return the modified config
    return config;
  },
};

module.exports = nextConfig; 