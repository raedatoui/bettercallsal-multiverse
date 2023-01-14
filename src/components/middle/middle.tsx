import React, { FC, useContext, useEffect, useRef, useState, KeyboardEvent } from 'react';
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
import { ContentSize, Size, BaseContentItem, GameContentItem, SiteKey } from 'src/types';
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

    // let quote = '';
    if (selectedNavItem !== null && selectedNavItem.category !== 'all' && selectedSite !== 'games')
        contentList = contentMap[selectedSite].filter(i => i.category === selectedNavItem.category);
        // quote = selectedNavItem.quote ?? '';

    if (selectedSite === 'art' || selectedSite === 'fit' || selectedSite === 'rocks')
        // @ts-ignore
        contentList = shuffleList(contentList);

    const titleRef = useRef<HTMLHeadingElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [gamesPosterSize, setGamesPosterSize] = useState<ContentSize>({ width: 640, height: 480, left: 0 });
    const [scriptLoaded, setScriptLoaded] = useState<boolean>(false);

    const windowSize = useWindowSize();

    const getContentSize = (wWise: Size, desiredSize: Size): ContentSize => {
        let height: number;
        let width: number;
        const offset = (titleRef.current?.getBoundingClientRect().height ?? 0) + 40; // the 15px padding

        const workingWidth = containerRef.current?.getBoundingClientRect().width ?? 0;
        const workingHeight = wWise.height - (document?.getElementsByTagName('header')[0]?.getBoundingClientRect().height ?? 0) - offset;

        if (workingWidth > workingHeight) {
            height = workingHeight;
            width = (height * desiredSize.width) / desiredSize.height;
        } else {
            width = workingWidth;
            height = (width * desiredSize.height) / desiredSize.width;
        }
        if (width > workingWidth) {
            width = workingWidth;
            height = (width * desiredSize.height) / desiredSize.width;
        }

        return { width, height, left: (workingWidth - width) / 2 };
    };

    useEffect(() => {
        if (selectedContentItem && selectedSite === 'games')
            setGamesPosterSize(getContentSize(windowSize, { width: 1000, height: 600 }));
    }, [windowSize, selectedContentItem]);

    // useEffect(() => {
    //     document.body.style.overflowY = selectedContentItem ? 'hidden' : 'auto';
    // }, [selectedContentItem]);
    //
    // useEffect(() => {
    //     document.body.style.overflowY = selectedSite === 'games' ? 'hidden' : 'auto';
    // }, [selectedSite, gameLoaded]);

    const videoClass = selectedContentItem?.contentId ? 'loaded' : '';
    let headerTxt = site.contentHeader;
    if (selectedContentItem === null && selectedNavItem && selectedNavItem.quote)
        headerTxt = selectedNavItem.quote;

    const handleKeyEvent = (keyEvent: KeyboardEvent<HTMLDivElement>) => {
        if (keyMap[keyEvent.key] !== undefined)
            setSelectedSite(keyMap[keyEvent.key]);
    };

    const handleImageSlide = (inc: number) => {
        if (selectedContentItem && selectedSite === 'art') {
            // @ts-ignore
            let idx = contentMap[selectedSite].indexOf(selectedContentItem as BaseContentItem);
            idx += inc;
            if (idx === contentMap[selectedSite].length)
                idx = 0;
            if (idx === -1)
                idx = contentMap[selectedSite].length - 1;
            setSelectedContentItem(contentMap[selectedSite][idx]);
        }
    };

    return (

        <MiddleSection
            ref={containerRef}
            className="eight columns"
            tabIndex={KEYBOARD_SWITCHING ? 0 : undefined}
            onKeyPress={(event) => handleKeyEvent(event)}
        >
            { selectedContentItem === null && (<Caption ref={titleRef}>{headerTxt}</Caption>) }

            {/* { selectedContentItem === null && !gameLoaded && (<Quote>{quote}</Quote>) } */}
            { selectedContentItem === null && (
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
            ) }

            { selectedContentItem && selectedSite !== 'games' && (
                <VideoPlayer
                    className={videoClass}
                    contentItem={selectedContentItem as BaseContentItem}
                    handleImageSlide={handleImageSlide}
                    deselect={() => setSelectedContentItem(null)}
                />
            ) }

            { selectedSite === 'games' && (
                <Script
                    src={`${CDN}/unity/export.loader.js`}
                    onLoad={() => setScriptLoaded(true)}
                />
            ) }

            {/* { selectedSite === 'games' && !gameLoaded && ( */}
            {/*     <GameImageContainer width={gamesPosterSize.width} height={gamesPosterSize.height}> */}
            {/*         <Image */}
            {/*             src="/images/games/SuperSalBros_Title_Blank.png" */}
            {/*             alt="supersalbros" */}
            {/*             width={gamesPosterSize.width} */}
            {/*             height={gamesPosterSize.height} */}
            {/*         /> */}
            {/*         <Image */}
            {/*             src="/images/games/SuperSalBros_Title_Card.png" */}
            {/*             alt="supersalbros" */}
            {/*             width={gamesPosterSize.width} */}
            {/*             height={gamesPosterSize.height} */}
            {/*             className="glowy" */}
            {/*             onClick={() => setGameLoaded(true)} */}
            {/*         /> */}
            {/*     </GameImageContainer> */}
            {/* )} */}

            { scriptLoaded && selectedSite === 'games' && (
                <UnityGame
                    width={gamesPosterSize.width}
                    height={gamesPosterSize.height}
                    left={gamesPosterSize.left}
                    game={selectedSite === 'games' ? (selectedContentItem as GameContentItem) : null}
                    deselect={() => setSelectedContentItem(null)}
                />
            )}

        </MiddleSection>
    );
};
