'use client';

import React, { FC, useEffect, useState } from 'react';
import {
    Caption,
    ContentItem,
    ContentItemTitle,
    ContentList,
    MiddleSection
} from '@/components/middle/elements';
import { useSiteContext } from '@/providers/sites';
import { shuffleList, slugify, useWindowSize } from '@/utils';
import { useAnimationContext, useBizerkContext } from '@/providers/animations';
import { BaseContentItem, GameContentItem } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

interface Props {}

export const List:FC<Props> = () => {
    const {
        siteMap,
        contentMap,
        selectedSite,
        loading,
        selectedNavItem,
        selectedContentItem,
        bizerkMode,
    } = useSiteContext();
    const site = siteMap[selectedSite];
    // these contexts are for causing a shuffle
    const windowSize = useWindowSize();
    const {
        animateHeaderFooter,
        spinningSalsGridCounter,
    } = useAnimationContext();
    const { bizerkCounter } = useBizerkContext();
    const [contentList, setContentList] = useState<(BaseContentItem | GameContentItem)[]>(contentMap[selectedSite]);
    // const [prevShuffledList, setPrevShuffledList] = useState<(BaseContentItem | GameContentItem)[]>([]);
    const [isArt, setIsArt] = useState<boolean>(false);

    let headerTxt = site.contentHeader;
    if (selectedContentItem === null && selectedNavItem && selectedNavItem.quote)
        headerTxt = selectedNavItem.quote;

    useEffect(() => {
        let list = contentMap[selectedSite];
        if (selectedNavItem !== null
            && selectedNavItem.category !== 'all'
            && selectedNavItem.category !== 'e-card'
            && selectedSite !== 'games'
            && selectedNavItem.category !== 'salutations')
            list = contentMap[selectedSite].filter(i => i.category === selectedNavItem.category);

        if (!isArt) // TODO: why this?
            if ((selectedSite === 'art' || selectedSite === 'fit' || selectedSite === 'rocks' || selectedSite === 'games'
                || (selectedSite === 'biz' && spinningSalsGridCounter !== 0)) && selectedContentItem === null)
                list = shuffleList(list);
                // setPrevShuffledList(list);

        // if (selectedNavItem && selectedNavItem.category === 'salutations')
        //     setPrevShuffledList(list);

        if (bizerkCounter % 2 === 0 && bizerkCounter > 0) // biz resets when counter is 0
            list = shuffleList(list);

        setContentList(list);
        return () => {};
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
        return () => {};
    }, [selectedContentItem, selectedNavItem, selectedSite]);

    return (
        <MiddleSection>
            { selectedContentItem === null && !isArt && (
                <Caption
                    className={bizerkMode !== 'off' ? 'bizerk' : ''}
                >{headerTxt}
                </Caption>
            ) }

            { loading && <div>loading</div> }

            { selectedSite !== 'construction' && selectedSite !== 'gallery' && !loading && (
                <ContentList
                    id="content-list"
                >
                    { contentList.map(i => (
                        <ContentItem key={i.contentId}>
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
                                <Link
                                    shallow
                                    href={`/video/${slugify(i.name)}`}
                                >
                                    { i.name }
                                </Link>
                            </ContentItemTitle>
                        </ContentItem>
                    ))}
                </ContentList>
            )}
        </MiddleSection>
    );
};
