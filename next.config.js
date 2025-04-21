/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Your existing config might be here
  basePath: process.env.NODE_ENV === 'production' ? '/senthurayyappan.github.io' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/senthurayyappan.github.io/' : '',
  images: {
    unoptimized: true,
  },

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