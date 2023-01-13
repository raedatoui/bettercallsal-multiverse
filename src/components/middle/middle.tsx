import React, { FC, useContext, useEffect, useRef, useState } from 'react';
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
import { ContentSize, Size, BaseContentItem, GameContentItem } from 'src/types';
import Script from 'next/script';
import { CDN } from 'src/constants';

interface Props { }

export const Middle: FC<Props> = () => {
    const { siteMap, selectedSite, contentMap, loading, selectedNavItem, selectedContentItem, setSelectedContentItem } = useContext(SiteContext);
    const site = siteMap[selectedSite];
    let contentList = contentMap[selectedSite];
    // let quote = '';
    // if (selectedNavItem !== null && selectedNavItem.category !== 'all') {
    //     contentList = contentMap[selectedSite].filter(i => i.category === selectedNavItem.category);
    //     quote = selectedNavItem.quote ?? '';
    // }

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

    return (

        <MiddleSection ref={containerRef} className="eight columns">
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

            { selectedContentItem && scriptLoaded && (
                <UnityGame
                    width={gamesPosterSize.width}
                    height={gamesPosterSize.height}
                    left={gamesPosterSize.left}
                    game={selectedContentItem as GameContentItem}
                    deselect={() => setSelectedContentItem(null)}
                />
            )}

        </MiddleSection>
    );
};
