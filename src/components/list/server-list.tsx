import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { URL_MAP } from '@/constants';
import { useSiteContext } from '@/providers/sites';
import { Caption, ContentItem, ContentItemTitle, ContentList } from '@/styles/sharedstyles';
import { BaseContentItem, GameContentItem } from '@/types';
import { shuffleList, slugify } from '@/utils';

export const ServerList = () => {
    const { siteMap, contentMap, selectedSite } = useSiteContext();
    const site = siteMap[selectedSite];

    const [contentList, setContentList] = useState<(BaseContentItem | GameContentItem)[]>(contentMap[selectedSite]);

    const headerTxt = site.contentHeader;

    useEffect(() => {
        let list = contentMap[selectedSite];
        if (selectedSite !== 'biz') list = shuffleList(list);
        setContentList(list);
    }, [contentMap, selectedSite]);

    return (
        <>
            <Caption className="off wtf">{headerTxt}</Caption>

            <ContentList id="content-list" className={selectedSite}>
                {contentList
                    .filter((i) => i.display)
                    .map((i) => (
                        <Link key={i.contentId} href={`/${URL_MAP[i.contentType]}/${i.slug}`} id={i.slug}>
                            <ContentItem>
                                <Image
                                    alt={i.name}
                                    src={`/images/${i.site}/thumbs/${i.thumb}`}
                                    width="480"
                                    height="360"
                                    loading="lazy"
                                    sizes="100vw"
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                    }}
                                />
                                <ContentItemTitle>{i.name}</ContentItemTitle>
                            </ContentItem>
                        </Link>
                    ))}
            </ContentList>
        </>
    );
};
