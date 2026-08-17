import { notFound } from 'next/navigation';
import ArtSlider from '@/components/art';
import Unity from '@/components/unity';
import { Video } from '@/components/video';
import { URL_MAP } from '@/constants';
import { readAllContent } from '@/lib/content';

// DOC: one route for video/art/game because URL_MAP already collapses the five content types
//  into those three segments. separate routes would each need their own non-empty param list,
//  and a given site only carries one or two of the types.
export const generateStaticParams = async () => {
    // DOC: every site's slugs, not just the build's — see readAllContent. `display` is a grid
    //  flag, not a routing one: hidden items like /video/office-webcam are still linkable.
    //  wtf re-lists the other sites' pieces, so the same type/slug pair shows up twice.
    const content = await readAllContent();
    const params = new Map(content.map((i) => [`${URL_MAP[i.contentType]}/${i.slug}`, { type: URL_MAP[i.contentType], slug: i.slug }]));

    return [...params.values()];
};

const ContentPage = async ({ params }: { params: Promise<{ type: string; slug: string }> }) => {
    const { type } = await params;

    if (type === 'video') return <Video />;
    if (type === 'art') return <ArtSlider />;
    if (type === 'game') return <Unity />;

    notFound();
};

export default ContentPage;
