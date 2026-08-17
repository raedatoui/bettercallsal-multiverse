import path from 'node:path';

// biome-ignore lint/correctness/noUnusedFunctionParameters: next/image passes width and quality; every src maps to one fixed GCS webp, so both are ignored on purpose
export default function myImageLoader({ src, width, quality }) {
    const f = path.parse(src);
    let ext = path.extname(src);
    if (ext !== '.webm' && ext !== '.gif') ext = '.webp';
    return `https://storage.googleapis.com/bcs-assets${f.dir}/${f.name}${ext}`;
}
