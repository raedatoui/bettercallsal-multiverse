/** @type {import('next').NextConfig} */

const fileEnv = require('./next.config.env.json');

// DOC: deploy.sh passes each site's overrides as real env vars so the tracked JSON is never
// rewritten. Only keys already in the JSON are read, so an unrelated shell variable can't
// leak into the bundle; edit the JSON to change what `pnpm dev` picks up.
const env = Object.fromEntries(Object.entries(fileEnv).map(([key, value]) => [key, process.env[key] ?? value]));

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
