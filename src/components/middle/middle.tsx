import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import { SiteContext } from 'src/providers/site-provider';
import {
    Caption,
    ContentItem,
    ContentItemTitle,
    ContentList,
    GameImageContainer,
    MiddleSection,
    Quote,
} from 'src/components/middle/elements';
import { VideoPlayer } from 'src/components/middle/videoPlayer';
import { shuffleList, useWindowSize } from 'src/utils';
import Image from 'next/image';
import { UnityGame } from 'src/components/middle/unity';
import { ContentSize, Size } from 'src/types';

interface Props { }

export const Middle: FC<Props> = () => {
    const { siteMap, selectedSite, contentMap, loading, selectedNavItem, selectedContentItem, setSelectedContentItem } = useContext(SiteContext);
    const site = siteMap[selectedSite];
    let contentList = contentMap[selectedSite];
    let quote = '';
    if (selectedNavItem !== null && selectedNavItem.category !== 'all') {
        contentList = contentMap[selectedSite].filter(i => i.category === selectedNavItem.category);
        quote = selectedNavItem.quote ?? '';
    }
    if (selectedSite === 'art' || selectedSite === 'fit' || selectedSite === 'rocks')
        contentList = shuffleList(contentList);

    const titleRef = useRef<HTMLHeadingElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [gamesPosterSize, setGamesPosterSize] = useState<ContentSize>({ width: 640, height: 480, left: 0 });
    const [gameLoaded, setGameLoaded] = useState<boolean>(false);
    const [scriptLoaded, setScriptLoaded] = useState<boolean>(false);

    const windowSize = useWindowSize();

    const getContentSize = (wWise: Size, desiredSize: Size): ContentSize => {
        let height: number;
        let width: number;
        const offset = (titleRef.current?.getBoundingClientRect().height ?? 0) + 25; // the 15px padding

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
        let desired = { width: 640, height: 600 };
        if (gameLoaded)
            desired = { width: 960, height: 600 };
        setGamesPosterSize(getContentSize(windowSize, desired));
    }, [windowSize, gameLoaded]);

    // useEffect(() => {
    //     document.body.style.overflowY = selectedContentItem ? 'hidden' : 'auto';
    // }, [selectedContentItem]);
    //
    // useEffect(() => {
    //     document.body.style.overflowY = selectedSite === 'games' ? 'hidden' : 'auto';
    // }, [selectedSite, gameLoaded]);

    const videoClass = selectedContentItem?.contentId ? 'loaded' : '';

    return (
        <MiddleSection ref={containerRef} className="eight columns">
            { selectedContentItem === null && !gameLoaded && (selectedNavItem?.quote ?? null) === null &&
                (<Caption ref={titleRef}>{site.contentHeader}</Caption>) }
            { selectedContentItem === null && !gameLoaded && selectedNavItem?.quote !== null &&
                (<Caption ref={titleRef}>{selectedNavItem?.quote ?? ''}</Caption>) }

            {/* { selectedContentItem === null && !gameLoaded && (<Quote>{quote}</Quote>) } */}
            { selectedContentItem === null && selectedSite !== 'games' && (
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
                    contentItem={selectedContentItem}
                    deselect={() => setSelectedContentItem(null)}
                />
            ) }

            { selectedSite === 'games' && !gameLoaded && (
                <GameImageContainer width={gamesPosterSize.width} height={gamesPosterSize.height}>
                    <Image
                        src="/images/games/SuperSalBros_Title_Blank.png"
                        alt="supersalbros"
                        width={gamesPosterSize.width}
                        height={gamesPosterSize.height}
                    />
                    <Image
                        src="/images/games/SuperSalBros_Title_Card.png"
                        alt="supersalbros"
                        width={gamesPosterSize.width}
                        height={gamesPosterSize.height}
                        className="glowy"
                        onClick={() => setGameLoaded(true)}
                    />
                </GameImageContainer>
            )}

            { gameLoaded && (
                <UnityGame
                    scriptLoaded={scriptLoaded}
                    setScriptLoaded={setScriptLoaded}
                    width={gamesPosterSize.width}
                    height={gamesPosterSize.height}
                    left={gamesPosterSize.left}
                    deselect={() => setGameLoaded(false)}
                />
            )}

        </MiddleSection>
    );
};
