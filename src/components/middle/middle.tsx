import React, { FC, useContext, useEffect, useState } from 'react';
import { SiteContext } from 'src/providers/site-provider';
import {
    Caption, ContentItem, ContentItemTitle, ContentList, MiddleSection, Quote,
} from 'src/components/middle/elements';
import { BaseContentItem } from 'src/types';
import { VideoPlayer } from 'src/components/middle/videoPlayer';
import { shuffleList } from 'src/utils';
import { CDN } from 'src/constants';
import Image from 'next/image';

interface Props { }

export const Middle: FC<Props> = () => {
    const { siteMap, selectedSite, contentMap, loading, contentFilter, selectedContentItem, setSelectedContentItem } = useContext(SiteContext);
    const site = siteMap[selectedSite];
    let contentList = contentMap[selectedSite];
    if (contentFilter !== '' && contentFilter !== 'all')
        contentList = contentMap[selectedSite].filter(i => i.category === contentFilter);
    if (selectedSite === 'art' || selectedSite === 'fit' || selectedSite === 'rocks')
        contentList = shuffleList(contentList);

    const [selectedContent, setSelectedContent] = useState<BaseContentItem | null>();

    useEffect(() => {
        if (selectedSite === 'art' && selectedContent)
            setSelectedContentItem(selectedContent);

    }, [selectedContent, selectedSite, setSelectedContentItem]);

    useEffect(() => {
        if (selectedSite === 'art' && selectedContentItem === null)
            setSelectedContent(null);

    }, [selectedContentItem, selectedSite]);

    const videoClass = selectedContent?.contentId ? 'loaded' : '';

    return (
        <MiddleSection>
            <Caption>{site.contentHeader}</Caption>
            <Quote />
            <ContentList>
                { loading && <div>loading</div> }
                { !loading && contentList.map(i => (
                    <ContentItem key={i.contentId} onClick={() => setSelectedContent(i)}>
                        <Image
                            alt={i.name}
                            src={`/images/${selectedSite}/thumbs/${i.thumb}`}
                            width="480"
                            height="360"
                            layout="responsive"
                        />
                        <ContentItemTitle>
                            { i.name }
                        </ContentItemTitle>
                    </ContentItem>
                ))}
            </ContentList>

            { selectedContent && selectedSite !== 'art' && (
                <VideoPlayer
                    className={videoClass}
                    contentItem={selectedContent}
                    deselect={() => setSelectedContent(null)}
                />
            ) }

        </MiddleSection>
    );
};
