import path from 'path';

export default function myImageLoader({ src, width, quality }) {
    const f = path.parse(src);
    let ext = path.extname(src);
    if (ext !== '.webm' && ext !== '.gif')
        ext = '.webp';
    return `https://storage.googleapis.com/bcs-assets${f.dir}/${f.name}${ext}`
}
