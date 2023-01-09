export default function myImageLoader({ src, width, quality }) {
    return `https://storage.googleapis.com/bcs-assets${src}?w=${width}&q=${quality || 75}`
}
