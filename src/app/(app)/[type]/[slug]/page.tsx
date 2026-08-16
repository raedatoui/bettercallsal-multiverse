import { notFound } from 'next/navigation';
import ArtSlider from '@/components/art';
import Unity from '@/components/unity';
import { Video } from '@/components/video';
import { URL_MAP } from '@/constants';
import { buildSite, readSiteContent } from '@/lib/content';

// DOC: one route for video/art/game because URL_MAP already collapses the five content types
//  into those three segments. separate routes would each need their own non-empty param list,
//  and a given site only carries one or two of the types.
export const generateStaticParams = async () => {
    const content = await readSiteContent(buildSite());
    const params = content.filter((i) => i.display).map((i) => ({ type: URL_MAP[i.contentType], slug: i.slug }));

    // DOC: output: export rejects an empty list. construction ships no content at all, so it
    //  gets a single placeholder that 404s.
    return params.length > 0 ? params : [{ type: 'video', slug: 'none' }];
};

const ContentPage = async ({ params }: { params: Promise<{ type: string; slug: string }> }) => {
    const { type } = await params;

    if (type === 'video') return <Video />;
    if (type === 'art') return <ArtSlider />;
    if (type === 'game') return <Unity />;

    notFound();
};

export default ContentPage;
