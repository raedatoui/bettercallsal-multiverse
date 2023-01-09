/** @type {import('next').NextConfig} */

const nextConfig = {
  // images: {
  //   loader: 'custom',
  //   loaderFile: './image-loader.js',
  // },
  env: {
    selectedSite: 'fit',
    cdn_url: '',
  },
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
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

    return config;
  },
}

module.exports = nextConfig
