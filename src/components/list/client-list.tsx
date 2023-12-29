import { gsap } from 'gsap';
import Image from 'next/image';
import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import { URL_MAP } from '@/constants';
import { useAnimationContext } from '@/providers/animations';
import { SoundContext } from '@/providers/audio-context';
import { useSiteContext } from '@/providers/sites';
import { Caption, ContentItem, ContentItemTitle, ContentList } from '@/styles/sharedstyles';
import { BaseContentItem, GameContentItem, VisibleProps } from '@/types';
import { shuffleList, useWindowSize, findCategory, pickRandom } from '@/utils';

interface AnimateProps {
    i: BaseContentItem | GameContentItem;
    onClick: () => void;
}

const random = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
const animOffset = 150;

const AnimatableGridItem: FC<AnimateProps> = ({ i, onClick }) => {
    const ref = useRef<HTMLAnchorElement | null>(null);
    const { buffers } = useContext(SoundContext);
    const { siteMap, selectedSite } = useSiteContext();
    const { animateWtf } = useAnimationContext();

    const makeLightTween = () => {
        if (ref && ref.current)
            gsap.to(ref.current, {
                x: random(-animOffset, animOffset),
                y: random(-animOffset, animOffset),
                repeat: 1,
                duration: 0.02,
            });
    };

    const makeTween = () => {
        if (ref && ref.current) gsap.killTweensOf(ref.current);
        gsap.to(ref.current, {
            x: random(-animOffset, animOffset),
            y: random(-animOffset, animOffset),
            overwrite: true,
            repeat: 3 * window.devicePixelRatio > 1 ? 3 : 1,
            duration: 0.03,
            onComplete: () => {
                // if (window.devicePixelRatio > 1)
                // TODO: bug on exit
                buffers.stop(siteMap[i.site].header.spinningSalAudio1);
                if (ref.current) makeTween();
            },
            onStart: () => {
                buffers.play(siteMap[i.site].header.spinningSalAudio1, false, true);
            },
        });
    };

    useEffect(() => {
        if (animateWtf > 0) makeLightTween();
        else {
            gsap.killTweensOf(ref.current);
            gsap.to(ref.current, { x: 0, y: 0, duration: 0 });
        }
    }, [animateWtf, ref.current]);

    return (
        <RouterLink
            onClick={onClick}
            key={i.contentId}
            to={`/${URL_MAP[i.contentType]}/${i.slug}`}
            id={i.slug}
            className="grid-item"
            onMouseOver={() => {
                if (selectedSite === 'wtf' && ref && ref.current)
                    // buffers.play(siteMap[i.site].header.spinningSalAudio1, false);
                    makeTween();
            }}
            onMouseOut={(event) => {
                buffers.stop(siteMap[i.site].header.spinningSalAudio1);
                gsap.killTweensOf(event.currentTarget);
                gsap.to(event.currentTarget, { x: 0, y: 0, duration: 0 });
            }}
            ref={ref}
        >
            <ContentItem>
                <Image
                    alt={i.name}
                    src={`/images/${i.site}/thumbs/${i.thumb}`}
                    width="480"
                    height="360"
                    loading="eager"
                    sizes="100vw"
                    style={{
                        width: '100%',
                        height: 'auto',
                    }}
                />
                {i.desktopOnly && (
                    <div className="ribbon">
                        <span>DESKTOP ONLY</span>
                    </div>
                )}
                <ContentItemTitle>{i.name}</ContentItemTitle>
            </ContentItem>
        </RouterLink>
    );
};

export const ClientList: FC<VisibleProps> = ({ visible }) => {
    const { category } = useParams<{ category: string }>();
    const navigate = useNavigate();

    const { siteMap, contentMap, selectedSite, loading } = useSiteContext();
    const site = siteMap[selectedSite];
    const { animateGrid, animateWtf } = useAnimationContext();

    const { buffers } = useContext(SoundContext);

    const windowSize = useWindowSize();

    const getHeaderText = () => {
        let headerTxt = site.contentHeader;
        if (category !== undefined && category !== 'all') {
            const cat = findCategory(site, category);
            if (cat && cat.quote) headerTxt = cat.quote;
        }
        return headerTxt;
    };

    const getList = () => contentMap[selectedSite].filter((i) => i.display).filter((i) => i.category === category || category === undefined);

    const [contentList, setContentList] = useState<(BaseContentItem | GameContentItem)[]>(getList());
    const [headerText, setHeaderText] = useState<string>(getHeaderText());

    // DOC: this is for switching selected site
    useEffect(() => {
        if (selectedSite !== 'wtf') {
            setHeaderText(getHeaderText());
            setContentList(getList());
        }
    }, [contentMap, selectedSite, category]);

    // DOC: windowSize shuffles the list for non .biz
    useEffect(() => {
        let list = getList();
        if (selectedSite !== 'biz') list = shuffleList(list);
        setContentList(list);
    }, [windowSize, selectedSite]);

    // DOC: shuffle list based on spinning counter, animateGrid = 0 resets list order for biz
    useEffect(() => {
        let list = getList();
        if (animateGrid > 0) list = shuffleList(list);
        if (animateGrid === 0 && selectedSite !== 'biz') list = shuffleList(list);
        setContentList(list);
    }, [animateGrid, selectedSite]);

    // DOC: this is for wtf, animate
    useEffect(() => {
        if (animateWtf > 0) {
            setHeaderText(pickRandom(siteMap).contentHeader);
            setContentList(shuffleList(getList()));
        } else if (animateWtf === 0 && selectedSite !== 'wtf') {
            setHeaderText(getHeaderText());
            setContentList(getList());
        }
    }, [animateWtf, selectedSite]);

    useEffect(() => {
        setContentList(getList());
        setHeaderText(getHeaderText());
    }, [category]);

    // DOC: when loading category, that doesnt exist on current site, go to home
    if (category !== undefined && category !== 'all') {
        const categories = getList().map((i) => i.category);
        if (!categories.includes(category)) {
            navigate('/', { replace: true });
            history.pushState({}, '', '/');
            return <div></div>;
        }
    }

    return (
        <>
            <Caption className={`animatable ${visible ? '' : 'off'}`}>{headerText}</Caption>

            {!loading && selectedSite !== 'construction' && selectedSite !== 'gallery' && (
                <ContentList id="content-list" className={`animatable ${visible ? '' : 'off'}`}>
                    {contentList?.map((i) => (
                        <AnimatableGridItem
                            i={i}
                            key={i.contentId}
                            onClick={() => {
                                // DOC: this stops all audio when loading content from the list
                                // and loads the pavane audio for art
                                buffers.stopAll();
                                if (selectedSite === 'art') buffers.play('/audio/art/pavane.mp3', true);
                            }}
                        />
                    ))}
                </ContentList>
            )}
        </>
    );
};
