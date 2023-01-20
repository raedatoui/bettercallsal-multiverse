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
import { shuffleList, useInterval, useWindowSize } from 'src/utils';
import Image from 'next/image';
import { UnityGame } from 'src/components/middle/unity';
import Script from 'next/script';
import { CDN } from 'src/constants';
import { AnimationContext } from 'src/providers/animations';
import { ContentSize, Size } from 'src/types';
import {Ecard} from "src/components/middle/e-card";

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

    // these contexts are for causing a shu
    const windowSize = useWindowSize();
    const anim = useContext(AnimationContext);

    if (selectedNavItem !== null && selectedNavItem.category !== 'all' && selectedSite !== 'games')
        contentList = contentMap[selectedSite].filter(i => i.category === selectedNavItem.category);

    if (selectedSite === 'art' || selectedSite === 'fit' || selectedSite === 'rocks' || selectedSite === 'games'
        || (selectedSite === 'biz' && anim.spinningSalsGridCounter !== 0))
        contentList = shuffleList(contentList);

    const [scriptLoaded, setScriptLoaded] = useState<boolean>(false);

    let headerTxt = site.contentHeader;
    if (selectedContentItem === null && selectedNavItem && selectedNavItem.quote)
        headerTxt = selectedNavItem.quote;

    useInterval(() => {
        if (anim.spinningSalsGridCounter === 0)
            contentList = contentMap[selectedSite];
    }, 1000);

    const [imageSize, setImageSize] = useState<ContentSize>({ width: 0, height: 0, left: 0, top: 0 });
    const titleRef = useRef<HTMLHeadingElement>(null);

    const getContentSize = (wWise: Size, desiredSize: Size): ContentSize => {
        let height: number;
        let width: number;
        const offset = (titleRef.current?.getBoundingClientRect().height ?? 0);

        const workingWidth = containerRef.current?.getBoundingClientRect().width ?? 0;
        const workingHeight = (document?.getElementById('content-row')?.getBoundingClientRect().height ?? 0) - offset;

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
        return { width, height, left: (workingWidth - width) / 2, top: (workingHeight - height) / 2 };
    };

    useEffect(() => {
        setImageSize(getContentSize(windowSize, { width: 1920, height: 1080 }));
    }, [windowSize]);

    useEffect(() => {
        if (selectedContentItem) {
            document.body.scrollTo(0, 0);
            document.getElementById('content-row')?.scrollTo(0, 0);
        }
    }, [selectedContentItem]);
    return (
        <MiddleSection
            ref={containerRef}
            cLeft={imageSize.left}
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

            { selectedSite === 'construction'
                && (
                    <Image
                        src="/images/construction/under-construction.png"
                        width={imageSize.width}
                        height={imageSize.height}
                        alt="construction"
                        className="construction"
                    />
                )
            }

            { selectedNavItem?.category === 'e-card' && <Ecard /> }
        </MiddleSection>
    );
};
