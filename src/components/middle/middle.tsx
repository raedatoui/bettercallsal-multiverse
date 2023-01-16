import React, { FC, useContext, useRef, useState } from 'react';
import { SiteContext } from 'src/providers/site-provider';
import {
    Caption,
    ContentItem,
    ContentItemTitle,
    ContentList,
    MiddleSection,
} from 'src/components/middle/elements';
import { VideoPlayer } from 'src/components/middle/videoPlayer';
import { shuffleList, useWindowSize } from 'src/utils';
import Image from 'next/image';
import { UnityGame } from 'src/components/middle/unity';
import Script from 'next/script';
import { CDN } from 'src/constants';

interface Props { }

export const Middle: FC<Props> = () => {
    const {
        siteMap,
        contentMap,
        selectedSite,
        loading,
        selectedNavItem,
        selectedContentItem,
        setSelectedContentItem
    } = useContext(SiteContext);
    const site = siteMap[selectedSite];
    let contentList = contentMap[selectedSite];

    const containerRef = useRef<HTMLDivElement>(null);

    // this is for constantly re-shuffling the grid on resize :D
    useWindowSize();

    if (selectedNavItem !== null && selectedNavItem.category !== 'all' && selectedSite !== 'games')
        contentList = contentMap[selectedSite].filter(i => i.category === selectedNavItem.category);

    if (selectedSite === 'art' || selectedSite === 'fit' || selectedSite === 'rocks')
        // @ts-ignore
        contentList = shuffleList(contentList);

    const [scriptLoaded, setScriptLoaded] = useState<boolean>(false);

    let headerTxt = site.contentHeader;
    if (selectedContentItem === null && selectedNavItem && selectedNavItem.quote)
        headerTxt = selectedNavItem.quote;

    return (
        <MiddleSection
            ref={containerRef}
            className="eight columns"
        >
            { selectedContentItem === null && (<Caption>{headerTxt}</Caption>) }

            <ContentList className={selectedContentItem === null ? 'on' : 'off'}>
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

            { selectedContentItem && selectedSite !== 'games' && (
                <VideoPlayer />
            ) }

            { selectedSite === 'games' && (
                <Script
                    src={`${CDN}/unity/export.loader.js`}
                    onLoad={() => setScriptLoaded(true)}
                />
            ) }

            { scriptLoaded && (
                <UnityGame containerRef={containerRef} />
            )}

        </MiddleSection>
    );
};
