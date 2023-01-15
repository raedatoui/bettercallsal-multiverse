import React, { FC, useContext, useRef, useState, KeyboardEvent } from 'react';
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
import { SiteKey } from 'src/types';
import Script from 'next/script';
import { CDN, KEYBOARD_SWITCHING } from 'src/constants';

interface Props { }

const keyMap: Record<string, SiteKey> = {
    a: 'art',
    b: 'biz',
    f: 'fit',
    r: 'rocks',
    g: 'games',
    c: 'construction',
};

export const Middle: FC<Props> = () => {
    const {
        siteMap,
        contentMap,
        selectedSite,
        setSelectedSite,
        loading,
        selectedNavItem,
        selectedContentItem,
        setSelectedContentItem
    } = useContext(SiteContext);
    const site = siteMap[selectedSite];
    let contentList = contentMap[selectedSite];

    // this is for constantly re-shuffling the grid on resize :D
    useWindowSize();

    if (selectedNavItem !== null && selectedNavItem.category !== 'all' && selectedSite !== 'games')
        contentList = contentMap[selectedSite].filter(i => i.category === selectedNavItem.category);

    if (selectedSite === 'art' || selectedSite === 'fit' || selectedSite === 'rocks')
        // @ts-ignore
        contentList = shuffleList(contentList);

    const containerRef = useRef<HTMLDivElement>(null);

    const [scriptLoaded, setScriptLoaded] = useState<boolean>(false);

    let headerTxt = site.contentHeader;
    if (selectedContentItem === null && selectedNavItem && selectedNavItem.quote)
        headerTxt = selectedNavItem.quote;

    const handleKeyEvent = (keyEvent: KeyboardEvent<HTMLDivElement>) => {
        if (keyMap[keyEvent.key] !== undefined)
            setSelectedSite(keyMap[keyEvent.key]);
    };

    return (

        <MiddleSection
            ref={containerRef}
            className="eight columns"
            tabIndex={KEYBOARD_SWITCHING ? 0 : undefined}
            onKeyPress={(event) => handleKeyEvent(event)}
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
