/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  reactStrictMode: true,
  transpilePackages: ['@senthur/sa-ui'],
  
  images: {
    unoptimized: true,
    formats: ['image/webp', 'image/avif'],
  },
  
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Add rule for GLSL files
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      use: ['raw-loader']
    });

    // Optimize bundle size.
    //
    // `cacheGroups` here replaces Next's own splitChunks config wholesale, which also
    // governs how CSS is grouped. The `vendor` group matches node_modules, so sa-ui's
    // stylesheet gets pulled into a separate chunk from globals.css -- and once that
    // happens the two stylesheets can be emitted in either order. When they flip,
    // sa-ui starts overriding globals.css instead of the reverse and every page
    // shifts. It stayed hidden while the dependency graph happened to produce one
    // chunk; adding dependencies tipped it over.
    //
    // Keeping the JS grouping but forcing CSS into a single chunk restores a
    // deterministic cascade without giving up the vendor/common split.
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          styles: {
            name: 'styles',
            type: 'css/mini-extract',
            chunks: 'all',
            enforce: true,
            priority: 100,
          },
          // `chunks: 'initial'` rather than 'all'. A fixed `name` collapses every
          // matching module into ONE chunk, so with 'all' a dependency that is only
          // ever reached through a dynamic import still gets hoisted into the chunk
          // every page loads -- which put Recharts on the critical path of the blog.
          // Limiting the group to initial chunks lets lazily imported vendor code
          // keep its own async chunk, while statically imported vendor code is still
          // shared exactly as before.
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'initial',
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            enforce: true,
          },
        },
      };
    }

    // Important: return the modified config
    return config;
  },
};

module.exports = nextConfig;
