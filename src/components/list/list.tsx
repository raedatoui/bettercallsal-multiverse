import Image from 'next/image';
import Link from 'next/link';
import React, { FC, useEffect, useState, } from 'react';
import {
    Link as RouterLink,
    useParams,
    useNavigate
} from 'react-router-dom';
import { useAnimationContext, useBizerkContext } from '@/providers/animations';
import { useSiteContext } from '@/providers/sites';
import {
    Caption,
    ContentItem,
    ContentItemTitle,
    ContentList,
} from '@/styles/sharedstyles';
import { BaseContentItem, GameContentItem, SiteKey, VisibleProps } from '@/types';
import { shuffleList, slugify, useWindowSize, findCategory } from '@/utils';

const URL_MAP: Record<SiteKey, string> = {
    biz: 'video',
    games: 'game',
    rocks: 'video',
    fit: 'video',
    art: 'art',
    construction: '',
    gallery: ''
};

const ClientList:FC<VisibleProps> = ({ visible }) => {
    const { category } = useParams<{ category: string }>();
    const navigate = useNavigate();

    const {
        siteMap,
        contentMap,
        selectedSite,
    } = useSiteContext();
    const site = siteMap[selectedSite];
    const { bizerkMode } = useBizerkContext();

    const defaultList = contentMap[selectedSite]
        .filter(i => i.display)
        .filter(i => i.category === category || category === undefined);
    const categories = defaultList.map(i => i.category);

    // these contexts are for causing a shuffle
    const windowSize = useWindowSize();
    const {
        animateHeaderFooter,
        animateGrid,
    } = useAnimationContext();
    const { bizerkCounter } = useBizerkContext();

    const [contentList, setContentList] = useState<(BaseContentItem | GameContentItem)[]>(defaultList);

    useEffect(() => {
        let list = contentMap[selectedSite];

        // shuffle list based on spinning counter, or on re-render for all sites but biz
        if (animateGrid > 0 || bizerkCounter > 0 || selectedSite !== 'biz')
            list = shuffleList(list);

        setContentList(list);
        return () => {};
    }, [
        contentMap,
        selectedSite,
        animateGrid,
        animateHeaderFooter,
        windowSize,
        bizerkCounter]);

    if (category !== undefined && !categories.includes(category)) {
        navigate('/');
        return <div />;
    }

    let headerTxt = site.contentHeader;
    if (category !== undefined && category !== 'all') {
        const cat = findCategory(site, category);
        if (cat && cat.quote)
            headerTxt = cat.quote;
    }
    let cc = bizerkMode !== 'off' ? 'bizerk' : '';
    if (!visible) cc += ' off';

    return (
        <>
            <Caption className={cc}>
                {headerTxt}
            </Caption>

            { selectedSite !== 'construction' && selectedSite !== 'gallery' && (
                <ContentList
                    id="content-list"
                    className={visible ? '' : 'off'}
                >
                    { contentList
                        .filter(i => i.display)
                        .filter(i => i.category === category || category === undefined)
                        .map(i => (
                            <RouterLink
                                key={i.contentId}
                                to={`/${URL_MAP[selectedSite]}/${slugify(i.name)}`}
                                id={slugify(i.name)}
                            >
                                <ContentItem>
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
                            </RouterLink>
                        ))}
                </ContentList>
            )}
        </>
    );
};

const ServerList = () => {
    const {
        siteMap,
        contentMap,
        selectedSite,
    } = useSiteContext();
    const site = siteMap[selectedSite];

    const [contentList, setContentList] = useState<(BaseContentItem | GameContentItem)[]>(contentMap[selectedSite]);

    const headerTxt = site.contentHeader;

    useEffect(() => {
        let list = contentMap[selectedSite];
        if (selectedSite !== 'biz')
            list = shuffleList(list);

        setContentList(list);
        return () => {};
    }, [
        contentMap,
        selectedSite]);

    return (
        <>
            <Caption>{headerTxt}</Caption>

            <ContentList id="content-list">
                { contentList
                    .filter(i => i.display)
                    .map(i => (
                        <Link
                            key={i.contentId}
                            href={`/${URL_MAP[selectedSite]}/${slugify(i.name)}`}
                            id={slugify(i.name)}
                        >
                            <ContentItem>
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
                        </Link>
                    ))}
            </ContentList>
        </>
    );
};

export { ClientList, ServerList };
