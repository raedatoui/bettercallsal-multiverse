import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import { SiteContext } from 'src/providers/sites';
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
import { AnimationContext } from 'src/providers/animations';
import { BaseContentItem, GameContentItem } from 'src/types';
import { Ecard } from 'src/components/middle/e-card';
import { ArtSlider } from 'src/components/middle/art-slider';
import { Construction } from 'src/components/middle/construction';

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
        setSelectedNavItem,
    } = useContext(SiteContext);
    const site = siteMap[selectedSite];

    // these contexts are for causing a shuffle
    const windowSize = useWindowSize();
    const anim = useContext(AnimationContext);

    const [contentList, setContentList] = useState<(BaseContentItem | GameContentItem)[]>([]);
    const [prevShuffledList, setPrevShuffledList] = useState<(BaseContentItem | GameContentItem)[]>([]);
    const [isArt, setIsArt] = useState<boolean>(false);

    const [scriptLoaded, setScriptLoaded] = useState<boolean>(false);

    let headerTxt = site.contentHeader;
    if (selectedContentItem === null && selectedNavItem && selectedNavItem.quote)
        headerTxt = selectedNavItem.quote;

    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        if (selectedContentItem) {
            document.body.scrollTo(0, 0);
            document.getElementById('content-row')?.scrollTo(0, 0);
        }
    }, [selectedContentItem]);

    useEffect(
        () => {

            let list = contentMap[selectedSite];
            if (selectedNavItem !== null
                && selectedNavItem.category !== 'all'
                && selectedSite !== 'games'
                && selectedNavItem.category !== 'salutations')
                list = contentMap[selectedSite].filter(i => i.category === selectedNavItem.category);

            if (!isArt) {
                if ((selectedSite === 'art' || selectedSite === 'fit' || selectedSite === 'rocks' || selectedSite === 'games'
                    || (selectedSite === 'biz' && anim.spinningSalsGridCounter !== 0)) && selectedContentItem === null) {
                    list = shuffleList(list);
                    setPrevShuffledList(list);
                }
                if (selectedNavItem && selectedNavItem.category === 'salutations')
                    setPrevShuffledList(list);
            }

            setContentList(list);
        },
        [contentMap, selectedSite, selectedContentItem, selectedNavItem, anim.spinningSalsGridCounter, windowSize, isArt]
    );

    useEffect(() => {
        let art = false;
        if (selectedContentItem && (selectedContentItem.contentType === 'image' || selectedContentItem.contentType === 'quad'))
            art = true;
        if (selectedNavItem && selectedNavItem.category === 'salutations')
            art = true;
        setIsArt(art);
    }, [prevShuffledList, selectedContentItem, selectedNavItem]);
    const isVideo = selectedContentItem && ['video', 'youtube', 'vimeo'].includes(selectedContentItem.contentType);

    return (
        <MiddleSection ref={containerRef}>
            { selectedContentItem === null && !isArt && (<Caption ref={titleRef}>{headerTxt}</Caption>) }

            <ContentList className={selectedContentItem === null && !isArt ? 'on' : 'off'}>
                { loading && <div>loading</div> }
                { !loading && contentList.map(i => (
                    <ContentItem key={i.contentId} onClick={() => setSelectedContentItem(i)}>
                        <Image
                            alt={i.name}
                            src={`/images/${selectedSite}/thumbs/${i.thumb}`}
                            width="480"
                            height="360"
                            loading="lazy"
                            layout="responsive"
                        />
                        <ContentItemTitle>
                            { i.name }
                        </ContentItemTitle>
                    </ContentItem>
                ))}
            </ContentList>

            { isVideo && (
                <VideoPlayer />
            ) }

            { isArt && (
                <ArtSlider
                    containerRef={containerRef}
                    images={prevShuffledList}
                    start={selectedContentItem ? prevShuffledList.indexOf(selectedContentItem) : 0}
                />
            )}

            { selectedSite === 'games' && (
                <Script
                    src={`${CDN}/unity/export.loader.js`}
                    onLoad={() => setScriptLoaded(true)}
                />
            ) }

            { scriptLoaded && (
                <UnityGame containerRef={containerRef} />
            )}

            { selectedSite === 'construction'
                && <Construction titleRef={titleRef} containerRef={containerRef} />}

            { selectedNavItem?.category === 'e-card' && <Ecard /> }
        </MiddleSection>
    );
};
