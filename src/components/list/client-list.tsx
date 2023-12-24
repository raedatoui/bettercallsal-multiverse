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
                repeat: window.devicePixelRatio,
                duration: 0.01,
                onComplete: () => {
                    if (ref && ref.current)
                        makeLightTween();
                },
            });
    };

    const makeTween = (target: HTMLElement) => {
        gsap.to(target, {
            x: random(-animOffset, animOffset),
            y: random(-animOffset, animOffset),
            overwrite: true,
            repeat: 3 * window.devicePixelRatio > 1 ? 3 : 1,
            duration: 0.03,
            onComplete: () => {
                // if (window.devicePixelRatio > 1)
                buffers.stop(siteMap[i.site].header.spinningSalAudio1);
                makeTween(target);
            },
            onStart: () => {
                buffers.play(siteMap[i.site].header.spinningSalAudio1, false, true);
            },
            // onRepeat: (t) => {
            //     t.vars.x = random(-animOffset, animOffset);
            //     t.vars.y = random(-animOffset, animOffset);
            //
            //     // DOC: without a counter and locked at 3 is A version
            //     // DOC: with a counter and valye of 3 for repeat and counter max is B version
            //     // counter += 1;
            //     // if (counter === 3)
            //     //     buffers.stop(siteMap[i.site].header.spinningSalAudio1);
            //
            //
            //     // if (counter % Math.floor(Math.random()* 3) === 0)
            //     //     buffers.play(siteMap[i.site].header.spinningSalAudio1, false);
            //     // else
            //     //     buffers.stop(siteMap[i.site].header.spinningSalAudio1);
            // },
        });
        // g.vars.onRepeatParams = [g];
        // g.play();
    };

    useEffect(() => {
        if (animateWtf > 0) makeLightTween();
        else {
            gsap.killTweensOf(ref.current);
            gsap.to(ref.current, { x: 0, y: 0, duration: 0 });
        }
        return () => {
            if (ref && ref.current) {
                gsap.killTweensOf(ref.current);
                gsap.to(ref.current, { x: 0, y: 0, duration: 0 });
            }
        }
    }, [animateWtf, ref.current]);

    return (
        <RouterLink
            onClick={onClick}
            key={i.contentId}
            to={`/${URL_MAP[i.contentType]}/${i.slug}`}
            id={i.slug}
            className="grid-item"
            onMouseOver={(event) => {
                if (selectedSite === 'wtf')
                    // buffers.play(siteMap[i.site].header.spinningSalAudio1, false);
                    makeTween(event.currentTarget);
            }}
            onMouseOut={(event) => {
                if (selectedSite === 'wtf') {
                    buffers.stop(siteMap[i.site].header.spinningSalAudio1);
                    gsap.killTweensOf(event.currentTarget);
                    gsap.to(event.currentTarget, { x: 0, y: 0, duration: 0 });
                }
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
            if (cat &&  cat.quote) headerTxt = cat.quote;
        }
        return headerTxt;
    };

    const [contentList, setContentList] = useState<(BaseContentItem | GameContentItem)[]>(defaultList);
    const [headerText, setHeaderText] = useState<string>(getHeaderText());

    useEffect(() => {

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
