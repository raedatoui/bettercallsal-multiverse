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
        setSelectedContentItem
    } = useContext(SiteContext);
    const site = siteMap[selectedSite];

    // these contexts are for causing a shuffle
    const windowSize = useWindowSize();
    const anim = useContext(AnimationContext);

    const [contentList, setContentList] = useState<(BaseContentItem | GameContentItem)[]>([]);
    const [prevShuffledList, setPrevShuffledList] = useState<(BaseContentItem | GameContentItem)[]>([]);

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

            if (selectedNavItem !== null && selectedNavItem.category !== 'all' && selectedSite !== 'games')
                list = contentMap[selectedSite].filter(i => i.category === selectedNavItem.category);

            if ((selectedSite === 'art' || selectedSite === 'fit' || selectedSite === 'rocks' || selectedSite === 'games'
                || (selectedSite === 'biz' && anim.spinningSalsGridCounter !== 0)) && selectedContentItem === null) {
                list = shuffleList(list);
                setPrevShuffledList(list);
            }
            setContentList(list);
        },
        [contentMap, selectedSite, selectedContentItem, selectedNavItem, anim, windowSize]
    );
    return (
        <MiddleSection
            ref={containerRef}
        >
            { selectedContentItem === null && (<Caption ref={titleRef}>{headerTxt}</Caption>) }

            <ContentList className={selectedContentItem === null ? 'on' : 'off'}>
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

            { selectedContentItem && ['video', 'youtube', 'vimeo'].includes(selectedContentItem.contentType) && (
                <VideoPlayer />
            ) }

            { selectedContentItem && (selectedContentItem.contentType === 'image' || selectedContentItem.contentType === 'quad') && (
                <ArtSlider
                    containerRef={containerRef}
                    images={prevShuffledList}
                    start={prevShuffledList.indexOf(selectedContentItem)}
                />
            )}

            { selectedSite === 'games' && (
                <Script
                    src={`${CDN}/unity/webgl.loader.js`}
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
