import Image from 'next/image';
import React, { FC, useContext, useEffect, useState } from 'react';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import { URL_MAP } from '@/constants';
import { useAnimationContext } from '@/providers/animations';
import { SoundContext } from '@/providers/audio-context';
import { useSiteContext } from '@/providers/sites';
import { Caption, ContentItem, ContentItemTitle, ContentList } from '@/styles/sharedstyles';
import { BaseContentItem, GameContentItem, VisibleProps } from '@/types';
import { shuffleList, slugify, useWindowSize, findCategory, pickRandom } from '@/utils';

export const ClientList: FC<VisibleProps> = ({ visible }) => {
    const { category } = useParams<{ category: string }>();
    const navigate = useNavigate();

    const { siteMap, contentMap, selectedSite, loading } = useSiteContext();
    const site = siteMap[selectedSite];
    const { animateGrid, animateWtf } = useAnimationContext();

    const { buffers } = useContext(SoundContext);

    const defaultList = contentMap[selectedSite].filter((i) => i.display).filter((i) => i.category === category || category === undefined);
    // TODO: why is this not filtering
    // if (defaultList.length !== 135) console.log('FUCCCCCK');
    const categories = defaultList.map((i) => i.category);

    // DOC: these contexts are for causing a shuffle
    const windowSize = useWindowSize();

    const getHeaderText = () => {
        let headerTxt = site.contentHeader;
        if (category !== undefined && category !== 'all') {
            const cat = findCategory(site, category);
            if (cat && cat.quote) headerTxt = cat.quote;
        }
        return headerTxt;
    };

    const [contentList, setContentList] = useState<(BaseContentItem | GameContentItem)[]>(defaultList);
    const [headerText, setHeaderText] = useState<string>(getHeaderText());

    useEffect(() => {
        let list = contentMap[selectedSite];
        // DOC: shuffle list based on spinning counter, or on re-render for all sites but biz, animateGrid=0 resets for biz
        if (animateGrid > 0 || selectedSite !== 'biz') list = shuffleList(list);

        setContentList(list);
    }, [contentMap, selectedSite, animateGrid, windowSize]);

    useEffect(() => {
        if (animateWtf > 0) {
            setHeaderText(pickRandom(siteMap).contentHeader);
            setContentList(shuffleList(contentMap[selectedSite]));
        }
    }, [animateWtf, siteMap]);

    useEffect(() => {
        if (selectedSite === 'wtf') setHeaderText(pickRandom(siteMap).contentHeader);
    }, [windowSize, selectedSite, siteMap]);

    useEffect(() => {
        setHeaderText(getHeaderText());
    }, [site, category]);

    // DOC: when category is not found, redirect to home
    if (category !== undefined && !categories.includes(category)) {
        navigate('/');
        return <div />;
    }

    const finalList = contentList.filter((i) => i.display).filter((i) => i.category === category || category === undefined);

    return (
        <>
            <Caption className={`animatable ${visible ? '' : 'off'}`}>{headerText}</Caption>

            {!loading && selectedSite !== 'construction' && selectedSite !== 'gallery' && (
                <ContentList id="content-list" className={`animatable ${visible ? '' : 'off'}`}>
                    {finalList.map((i) => (
                        <RouterLink
                            onClick={() => {
                                // DOC: this stops all audio when loading content from the list
                                // and loads the pavane audio for art
                                buffers.stopAll();
                                if (selectedSite === 'art') buffers.play('/audio/art/pavane.mp3', true);
                            }}
                            key={i.contentId}
                            to={`/${URL_MAP[i.site]}/${slugify(i.name)}`}
                            id={slugify(i.name)}
                        >
                            <ContentItem>
                                <Image
                                    alt={i.name}
                                    src={`/images/${i.site}/thumbs/${i.thumb}`}
                                    width="480"
                                    height="360"
                                    loading="lazy"
                                    sizes="100vw"
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                    }}
                                />
                                <ContentItemTitle>{i.name}</ContentItemTitle>
                            </ContentItem>
                        </RouterLink>
                    ))}
                </ContentList>
            )}
        </>
    );
};
