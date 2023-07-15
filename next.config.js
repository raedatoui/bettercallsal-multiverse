/** @type {import('next').NextConfig} */

const env = require('./next.config.env.json');

const images = env.localImages ? { loader: 'default' } : { loader: 'custom', loaderFile: './image-loader.js' };

const nextConfig = {
  images,
  env,
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  experimental: {
    appDir: true,
  },
  output: 'export',
  webpack(config, options) {
    const { isServer } = options;
    config.module.rules.push({
      test: /\.(ogg|mp3|wav|mpe?g|mov)$/i,
      exclude: config.exclude,
      use: [
        {
          loader: require.resolve('url-loader'),
          options: {
            limit: config.inlineImageLimit,
            fallback: require.resolve('file-loader'),
            publicPath: `${config.assetPrefix}/_next/static/images/`,
            outputPath: `${isServer ? '../' : ''}static/images/`,
            name: '[name]-[hash].[ext]',
            esModule: config.esModule || false,
          },
        },
      ],
    });
    config.experiments = { ...config.experiments, topLevelAwait: true };
    return config;
  }
}

module.exports = nextConfig
