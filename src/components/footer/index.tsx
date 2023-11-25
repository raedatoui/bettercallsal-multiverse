import { gsap } from 'gsap';
import Image from 'next/image';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { FooterContainer, LawBreakersContainer, LawBreakersP, LawBreakersSpan } from '@/components/footer/elements';
import { useAnimationContext } from '@/providers/animations';
import { SoundContext } from '@/providers/audio-context';
import { useSiteContext } from '@/providers/sites';
import { Size } from '@/types';
import { useWindowSize } from '@/utils';
import { betterCallClick } from '@/utils/gsap';

const LawBreakers = () => {
    const { siteMap, selectedSite, fullScreen } = useSiteContext();
    const site = siteMap[selectedSite];

    const { animateGrid, setAnimateGrid, bizerkMode } = useAnimationContext();
    const { buffers } = useContext(SoundContext);

    const windowSize = useWindowSize();
    const [leftIconSize, setLeftIconSize] = useState<Size>({ width: 148, height: 393 });
    const [rightIconSize, setRightIconSize] = useState<Size>({ width: 148, height: 393 });

    const [footerText, setFooterText] = useState<string>(site.footer.text);
    const [leftImage, setLeftImage] = useState(site.footer.icon);
    const [rightImage, setRightImage] = useState(site.footer.icon);
    const [ringAudio, setRingAudio] = useState(site.footer.ringAudio);

    const ref = useRef<HTMLParagraphElement>(null);

    const [tl, setTl] = useState<gsap.core.Timeline>();

    const getContentSize = (desiredSize: Size): Size => {
        const height = ref.current?.getBoundingClientRect().height ?? 0;
        const width = (height * desiredSize.width) / desiredSize.height;
        return { width, height };
    };

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = betterCallClick(selectedSite, animateGrid, setAnimateGrid);
            setTl(tl);
        });
        return () => ctx.revert();
    }, [selectedSite]);

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
    }, [windowSize, site, leftImage, rightImage]);

    useEffect(() => {
        // DOC: adjust size on hot key
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
    }, [selectedSite]);

    useEffect(() => {
        // DOC: reset out of wtf when hot keying
        if (selectedSite !== 'wtf') {
            setFooterText(site.footer.text);
            setLeftImage(site.footer.icon);
            setRightImage(site.footer.icon);
            setRingAudio(site.footer.ringAudio);
        }
    }, [selectedSite, site]);

    return (
        <>
            {selectedSite !== 'gallery' && !fullScreen && (
                <LawBreakersContainer>
                    <LawBreakersP ref={ref} className={`better-call-title ${bizerkMode !== 'off' ? 'bizerk' : ''}`}>
                        <Image
                            className={`spinner img0 ${selectedSite} ${bizerkMode !== 'off' ? 'bizerk' : ''}`}
                            src={leftImage.image}
                            alt="footer-icon"
                            width={leftIconSize.width}
                            height={leftIconSize.height}
                            loading="lazy"
                            style={{
                                maxWidth: '100%',
                                height: 'auto',
                            }}
                        />

                        <LawBreakersSpan
                            onClick={() => {
                                tl?.restart();
                                buffers.play(ringAudio, false);
                            }}
                        >
                            {footerText}
                        </LawBreakersSpan>

                        <Image
                            className={`spinner img1 ${selectedSite} ${bizerkMode !== 'off' ? 'bizerk' : ''}`}
                            src={rightImage.image}
                            alt="footer-icon"
                            width={rightIconSize.width}
                            height={rightIconSize.height}
                            loading="lazy"
                            style={{
                                maxWidth: '100%',
                                height: 'auto',
                            }}
                        />
                    </LawBreakersP>
                </LawBreakersContainer>
            )}
            {selectedSite !== 'gallery' && !fullScreen && (
                <FooterContainer className={bizerkMode !== 'off' ? 'bizerk' : ''}>
                    <h2>
                        <a href="tel:+19173229246">• NOT TOLL FREE (800) CALL-SAL •</a>
                    </h2>
                </FooterContainer>
            )}
        </>
    );
};

export default LawBreakers;
