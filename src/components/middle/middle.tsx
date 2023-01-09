import React, { FC, useContext, useEffect } from 'react';
import { SiteContext } from 'src/providers/site-provider';
import {
    Caption, ContentItem, ContentItemTitle, ContentList, MiddleSection, Quote,
} from 'src/components/middle/elements';
import { VideoPlayer } from 'src/components/middle/videoPlayer';
import { shuffleList } from 'src/utils';
import Image from 'next/image';

interface Props { }

export const Middle: FC<Props> = () => {
    const { siteMap, selectedSite, contentMap, loading, contentFilter, selectedContentItem, setSelectedContentItem } = useContext(SiteContext);
    const site = siteMap[selectedSite];
    let contentList = contentMap[selectedSite];
    let quote = '';
    if (contentFilter !== '' && contentFilter !== 'all') {
        contentList = contentMap[selectedSite].filter(i => i.category === contentFilter);
        quote = site.leftNav.items.filter(i => i.category === contentFilter)[0].quote ?? '';
    }
    if (selectedSite === 'art' || selectedSite === 'fit' || selectedSite === 'rocks')
        contentList = shuffleList(contentList);

    // const [selectedContent, setSelectedContent] = useState<BaseContentItem | null>();

    // useEffect(() => {
    //     // this check was to enable the fullscreen viewer
    //     // but we need to mark globally that content is selected
    //     // if (selectedSite === 'art' && selectedContent)
    //     if (selectedContent)
    //         setSelectedContentItem(selectedContent);
    //
    // }, [selectedContent, setSelectedContentItem]);
    //
    // useEffect(() => {
    //     if (selectedSite === 'art' && selectedContentItem === null)
    //         setSelectedContent(null);
    //
    // }, [selectedContentItem, selectedSite]);

    useEffect(() => {
        document.body.style.overflowY = selectedContentItem ? 'hidden' : 'auto';
    }, [selectedContentItem]);

    const videoClass = selectedContentItem?.contentId ? 'loaded' : '';

    return (
        <MiddleSection>
            <Caption>{site.contentHeader}</Caption>
            <Quote>{quote}</Quote>
            <ContentList>
                { loading && <div>loading</div> }
                { !loading && contentList.map(i => (
                    <ContentItem key={i.contentId} onClick={() => setSelectedContentItem(i)}>
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

            { selectedContentItem && (
                <VideoPlayer
                    className={videoClass}
                    contentItem={selectedContentItem}
                    deselect={() => setSelectedContentItem(null)}
                />
            ) }

        </MiddleSection>
    );
};
