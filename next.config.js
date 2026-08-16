/** @type {import('next').NextConfig} */

const env = require('./next.config.env.json');

// DOC: the default loader can't run under `output: 'export'`, so local images go unoptimized.
const images = env.localImages === 'true' ? { unoptimized: true } : { loader: 'custom', loaderFile: './image-loader.js' };

const nextConfig = {
    output: 'export',
    images,
    env,
    reactStrictMode: true,
    compiler: {
        styledComponents: true,
    },
};

module.exports = nextConfig;
