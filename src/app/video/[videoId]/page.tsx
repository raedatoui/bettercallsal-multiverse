import React from 'react';
import { VideoWrapper } from '@/components/middle';
import path from 'path';
import fsPromises from 'fs/promises';
import {
    BaseContentItem,
    BaseContentListValidator,
    GameContentItem,
    GameContentListValidator,
    SiteKeyValidator
} from '@/types';
import { slugify } from '@/utils/slugify';

export async function generateStaticParams() {
    const defaultSite = SiteKeyValidator.parse(process.env.selectedSite);
    const filePath = path.join(process.cwd(), `content/content-${defaultSite}.json`);
    const jsonData = await fsPromises.readFile(filePath);
    const list = JSON.parse(jsonData.toString());
    let content: (BaseContentItem | GameContentItem)[] = [];
    if (defaultSite === 'games' || defaultSite === 'gallery')
        content = GameContentListValidator.parse(list.items);
    else
        content = BaseContentListValidator.parse(list.items);
    return content.map((item) => ({ videoId: slugify(item.name) }));
}

const Video = ({ params }: { params: { videoId: string } }) => (
    <VideoWrapper videoId={params.videoId} />
);

export default Video;
