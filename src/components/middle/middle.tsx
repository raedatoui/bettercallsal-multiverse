import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import { useSiteContext } from 'src/providers/sites';
import {
    Caption,
    ContentItem,
    ContentItemTitle,
    ContentList,
    MiddleSection,
} from 'src/components/middle/elements';
import {
    DynamicArtSlider,
    DynamicConstruction,
    DynamicEcard,
    DynamicVideoPlayer,
    DynamicUnityGame
} from 'src/components/middle/dynamic';
import { shuffleList, useWindowSize } from 'src/utils';
import Image from 'next/image';

import Script from 'next/script';
import { CDN } from 'src/constants';
import { useAnimationContext } from 'src/providers/animations';
import { BaseContentItem, GameContentItem } from 'src/types';
import { SoundContext } from 'src/providers/audio-context';

interface Props { }

export const Middle: FC<Props> = () => {
    const {
        siteMap,
        contentMap,
        selectedSite,
        loading,
        selectedNavItem,
        selectedContentItem,
        setSelectedContentItem,
        setFullScreen,
        fullScreen,
        bizerkMode
    } = useSiteContext();
    const site = siteMap[selectedSite];
    // these contexts are for causing a shuffle
    const windowSize = useWindowSize();
    const {
        animateHeaderFooter,
        spinningSalsGridCounter,
        bizerkCounter,
    } = useAnimationContext();

    const { buffers } = useContext(SoundContext);

    const [contentList, setContentList] = useState<(BaseContentItem | GameContentItem)[]>(contentMap[selectedSite]);
    const [prevShuffledList, setPrevShuffledList] = useState<(BaseContentItem | GameContentItem)[]>([]);
    const [isArt, setIsArt] = useState<boolean>(false);
    const [showContentList, setShowContentList] = useState<boolean>(true);

    const [scriptLoaded, setScriptLoaded] = useState<boolean>(false);

    let headerTxt = site.contentHeader;
    if (selectedContentItem === null && selectedNavItem && selectedNavItem.quote)
        headerTxt = selectedNavItem.quote;

    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        let list = contentMap[selectedSite];
        if (selectedNavItem !== null
            && selectedNavItem.category !== 'all'
            && selectedNavItem.category !== 'e-card'
            && selectedSite !== 'games'
            && selectedNavItem.category !== 'salutations')
            list = contentMap[selectedSite].filter(i => i.category === selectedNavItem.category);

        if (!isArt) { // TODO why this?
            if ((selectedSite === 'art' || selectedSite === 'fit' || selectedSite === 'rocks' || selectedSite === 'games'
                || (selectedSite === 'biz' && spinningSalsGridCounter !== 0)) && selectedContentItem === null) {
                list = shuffleList(list);
                setPrevShuffledList(list);
            }
            if (selectedNavItem && selectedNavItem.category === 'salutations')
                setPrevShuffledList(list);
        }
        if (bizerkCounter % 2 === 0)
            list = shuffleList(list);
            // setPrevShuffledList(list);

        setContentList(list);
    }, [
        contentMap,
        selectedSite,
        selectedContentItem,
        selectedNavItem,
        spinningSalsGridCounter,
        animateHeaderFooter,
        windowSize,
        isArt,
        bizerkCounter]);

    useEffect(() => {
        let art = false;
        if (selectedContentItem && (selectedContentItem.contentType === 'image' || selectedContentItem.contentType === 'quad'))
            art = true;
        if (selectedNavItem && selectedNavItem.category === 'salutations' && selectedSite === 'art')
            art = true;
        if (selectedSite === 'gallery')
            art = true;
        setIsArt(art);

        if (selectedContentItem === null && selectedNavItem?.category !== 'e-card' && !art)
            setShowContentList(true);
        else
            setShowContentList(false);
    }, [selectedContentItem, selectedNavItem, selectedSite]);

    const isVideo = selectedContentItem && ['video', 'youtube', 'vimeo'].includes(selectedContentItem.contentType);

    const handleSelect = (i: BaseContentItem | GameContentItem) => {
        setSelectedContentItem(i);
        if (document.body.clientWidth < 768)
            setFullScreen(true);
        if (selectedSite === 'art' && site.leftNav.items[0].audio)
            buffers.play(site.leftNav.items[0].audio);
    };

    return (
        <MiddleSection ref={containerRef} className={fullScreen ? `${selectedSite} fullScreen` : selectedSite}>
            { selectedContentItem === null && !isArt && (
                <Caption
                    className={bizerkMode !== 'off' ? 'bizerk' : ''}
                    ref={titleRef}
                >{headerTxt}
                </Caption>
            ) }

            { loading && <div>loading</div> }

            { selectedSite !== 'construction' && selectedSite !== 'gallery' && loading === false && (
                <ContentList
                    id="content-list"
                    className={showContentList ? 'on' : 'off'}
                >
                    { contentList.map(i => (
                        <ContentItem key={i.contentId} onClick={() => handleSelect(i)}>
                            <Image
                                alt={i.name}
                                src={`/images/${selectedSite}/thumbs/${i.thumb}`}
                                width="480"
                                height="360"
                                loading="lazy"
                                sizes="100vw"
                                style={{
                                    width: '100%',
                                    height: 'auto'
                                }}
                            />
                            <ContentItemTitle>
                                { i.name }
                            </ContentItemTitle>
                        </ContentItem>
                    ))}
                </ContentList>
            )}

            { isVideo && (
                <DynamicVideoPlayer />
            ) }

            { isArt && selectedSite !== 'gallery' && (
                <DynamicArtSlider
                    containerRef={containerRef}
                    images={prevShuffledList}
                    start={selectedContentItem ? prevShuffledList.indexOf(selectedContentItem) : 0}
                />
            )}

            { selectedSite === 'games' && (
                <Script
                    src={`${CDN}/unity/game.loader.js`}
                    onLoad={() => setScriptLoaded(true)}
                />
            ) }

            { selectedSite === 'gallery' && (
                <Script
                    src={`${CDN}/unity/gallery.loader.js`}
                    onLoad={() => setScriptLoaded(true)}
                />
            ) }

            { scriptLoaded && (
                <DynamicUnityGame containerRef={containerRef} />
            )}

            { selectedSite === 'construction'
                && <DynamicConstruction titleRef={titleRef} containerRef={containerRef} />}

            { selectedNavItem?.category === 'e-card' && <DynamicEcard /> }
        </MiddleSection>
    );
};
