import React, { FC, useContext, useState } from 'react';
import { SiteContext } from 'src/providers/site-provider';
import {
    Caption, ContentItem, ContentItemTitle, ContentList, MiddleSection, Quote
} from 'src/components/middle/elements';
import { BizContentItem, BaseContentItem } from 'src/types';
import { VideoPlayer } from 'src/components/middle/videoPlayer';
import { shuffleList } from 'src/utils';

interface Props { }

export const Middle: FC<Props> = () => {
    const { siteMap, selectedSite, contentMap, loading, contentFilter } = useContext(SiteContext);
    const site = siteMap[selectedSite];
    let contentList = contentMap[selectedSite];
    if (contentFilter !== '' && contentFilter !== 'all')
        contentList = contentMap[selectedSite].filter(i => i.category === contentFilter);
    if (selectedSite === 'art' || selectedSite === 'fit' || selectedSite === 'rocks')
        contentList = shuffleList(contentList);

    const [selectedContent, setSelectedContent] = useState<BaseContentItem | null>();

    const videoClass = selectedContent?.contentId ? 'loaded' : '';

    return (
        <MiddleSection>
            <Caption>{site.contentHeader}</Caption>
            <Quote />
            <ContentList>
                { loading && <div>loading</div> }
                { !loading && contentList.map(i => (
                    <ContentItem key={i.contentId} onClick={() => setSelectedContent(i)}>
                        <img alt={i.name} src={`/images/${selectedSite}/thumbs/${i.thumb}`} />
                        <ContentItemTitle>
                            { i.name }
                        </ContentItemTitle>
                    </ContentItem>
                ))}
            </ContentList>
            <VideoPlayer
                className={videoClass}
                contentItem={selectedContent as BizContentItem}
                deselect={() => setSelectedContent(null)}
            />
        </MiddleSection>
    );
};
