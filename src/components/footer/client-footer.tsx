'use client';

import { gsap } from 'gsap';
import Image from 'next/image';
import Link from 'next/link';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { FooterContainer, LawBreakersContainer, LawBreakersP, LawBreakersSpan } from '@/components/footer/elements';
import { config } from '@/constants';
import { useAnimationContext } from '@/providers/animations';
import { SoundContext } from '@/providers/audio-context';
import { useSiteContext } from '@/providers/sites';
import { Size } from '@/types';
import { pickRandom, useWindowSize } from '@/utils';
import { betterCallClick, betterCallClickWtf } from '@/utils/gsap';

export const LawBreakers = () => {
    // const path = useLocation().pathname === '/' ? '' : useLocation().pathname;
    const { siteMap, selectedSite, fullScreen } = useSiteContext();
    const site = siteMap[selectedSite];

    const { animateGrid, setAnimateGrid, animateWtf, setAnimateWtf, bizerkMode } = useAnimationContext();
    const { buffers } = useContext(SoundContext);

    const windowSize = useWindowSize();
    // DOC: seed from the icon's own ratio so the first paint isn't oversized before the measure below
    const initialSize: Size = { width: (60 * site.footer.icon.width) / site.footer.icon.height, height: 60 };
    const [leftIconSize, setLeftIconSize] = useState<Size>(initialSize);
    const [rightIconSize, setRightIconSize] = useState<Size>(initialSize);

    const [footerText, setFooterText] = useState<string>(site.footer.text);
    const [leftImage, setLeftImage] = useState(site.footer.icon);
    const [rightImage, setRightImage] = useState(site.footer.icon);

    const [ringAudio, setRingAudio] = useState(site.footer.ringAudio);

    const ref = useRef<HTMLParagraphElement>(null);

    // DOC: render the icon off `site` so its class lands with the site change. The load animation
    // samples the img's transform in the effect phase, before an effect-driven swap would apply, and
    // would otherwise hold the previous site's scale for the whole tween. wtf keeps its random state.
    const leftIcon = selectedSite === 'wtf' ? leftImage : site.footer.icon;
    const rightIcon = selectedSite === 'wtf' ? rightImage : site.footer.icon;

    const [tl, setTl] = useState<gsap.core.Timeline>();

    const getContentSize = (desiredSize: Size): Size => {
        const height = ref.current?.getBoundingClientRect().height ?? 0;
        const width = (height * desiredSize.width) / desiredSize.height;
        return { width, height };
    };

    useEffect(() => {
        const ctx = gsap.context(() => {
            let tl = betterCallClick(selectedSite, animateGrid, setAnimateGrid);
            if (selectedSite === 'wtf') tl = betterCallClickWtf(animateWtf, setAnimateWtf);
            setTl(tl);
        });

        setFooterText(site.footer.text);
        setLeftImage(site.footer.icon);
        setRightImage(site.footer.icon);
        setRingAudio(site.footer.ringAudio);

        // DOC: adjust size on hot key, off the incoming icon — leftImage/rightImage are still the old site's here
        setLeftIconSize(
            getContentSize({
                width: site.footer.icon.width,
                height: site.footer.icon.height,
            })
        );
        setRightIconSize(
            getContentSize({
                width: site.footer.icon.width,
                height: site.footer.icon.height,
            })
        );
        return () => ctx.revert();
    }, [selectedSite, site]);

    useEffect(() => {
        setLeftIconSize(
            getContentSize({
                width: leftImage.width,
                height: leftImage.height,
            })
        );
        setRightIconSize(
            getContentSize({
                width: rightImage.width,
                height: rightImage.height,
            })
        );
    }, [windowSize, site, leftImage]);

    useEffect(() => {
        if (selectedSite === 'wtf') {
            setFooterText(pickRandom(siteMap).footer.text);
            setLeftImage(pickRandom(siteMap).footer.icon);
            setRightImage(pickRandom(siteMap).footer.icon);
            setRingAudio(pickRandom(siteMap).footer.ringAudio);
        }
    }, [animateWtf, selectedSite]);
    //<RouterLink to={`${path}/audio`}>

    const renderImage = (img: React.JSX.Element) => {
        if (config.experiments) return <Link href="/audio">{img}</Link>;
        return img;
    };

    return (
        <>
            {!fullScreen && (
                <LawBreakersContainer>
                    <LawBreakersP ref={ref} className={`better-call-title animatable ${bizerkMode !== 'off' ? 'bizerk' : ''}`}>
                        {renderImage(
                            <Image
                                className={`spinner img0 ${leftIcon.site} ${bizerkMode !== 'off' ? 'bizerk' : ''}`}
                                src={leftIcon.image}
                                alt="footer-icon"
                                width={leftIconSize.width}
                                height={leftIconSize.height}
                                loading="lazy"
                                style={{
                                    height: '100%',
                                }}
                            />
                        )}

                        <LawBreakersSpan
                            onClick={() => {
                                tl?.restart();
                                buffers.play(ringAudio, false);
                            }}
                        >
                            {footerText}
                        </LawBreakersSpan>

                        {renderImage(
                            <Image
                                className={`spinner img1 ${rightIcon.site} ${bizerkMode !== 'off' ? 'bizerk' : ''}`}
                                src={rightIcon.image}
                                alt="footer-icon"
                                width={rightIconSize.width}
                                height={rightIconSize.height}
                                loading="lazy"
                                style={{
                                    height: '100%',
                                }}
                            />
                        )}
                    </LawBreakersP>
                </LawBreakersContainer>
            )}
            {!fullScreen && (
                <FooterContainer className={bizerkMode !== 'off' ? 'bizerk' : ''}>
                    <h2>
                        <a href="tel:+19173229246">• NOT TOLL FREE (800) CALL-SAL •</a>
                    </h2>
                </FooterContainer>
            )}
        </>
    );
};
