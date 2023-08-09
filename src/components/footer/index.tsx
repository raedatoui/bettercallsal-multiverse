import Image from 'next/image';
import React, { FC, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { FooterContainer, LawBreakersContainer, LawBreakersP, LawBreakersSpan } from '@/components/footer/elements';
import { useAnimationContext, useBizerkContext } from '@/providers/animations';
import { SoundContext } from '@/providers/audio-context';
import { useSiteContext } from '@/providers/sites';
import { Size } from '@/types';
import { useWindowSize } from '@/utils';

interface Props {}

const LawBreakers: FC<Props> = () => {
    const { siteMap, selectedSite, fullScreen } = useSiteContext();
    const { animateHeaderFooter, setAnimateHeaderFooter } = useAnimationContext();
    const { bizerkMode } = useBizerkContext();
    const site = siteMap[selectedSite];

    const { buffers, loaded } = useContext(SoundContext);

    const windowSize = useWindowSize();
    const [micSize, setMicSize] = useState<Size>({ width: 148, height: 393 });
    const [leftSpinningState, setLeftSpinningState] = useState<string>(`img0 start ${selectedSite}`);
    const [rightSpinningState, setRightSpinningState] = useState<string>(`img1 start ${selectedSite}`);
    const [betterCallState, setBetterCallSalState] = useState<string>('');

    const ref = useRef<HTMLParagraphElement>(null);
    const video1Ref = useRef<HTMLVideoElement>(null);
    const video2Ref = useRef<HTMLVideoElement>(null);
    const getContentSize = (desiredSize: Size): Size => {
        const height = ref.current?.getBoundingClientRect().height ?? 0;
        const width = (height * desiredSize.width) / desiredSize.height;

        return { width, height };
    };

    const animate = useCallback((delay: number) => {
        setLeftSpinningState(`img0 fadein ${selectedSite}`);
        setRightSpinningState(`img1 fadein ${selectedSite}`);
        setTimeout(() => {
            setBetterCallSalState('better-call-anim');
            setLeftSpinningState(`img0 hover ${selectedSite}`);
            setRightSpinningState(`img1 hover ${selectedSite}`);
            setTimeout(() => {
                setLeftSpinningState(`img0 ${selectedSite}`);
                setRightSpinningState(`img1 ${selectedSite}`);
                setBetterCallSalState('init');
            }, 3000);
        }, delay);
    }, [selectedSite]);

    useEffect(() => {
        setMicSize(getContentSize({ width: site.footer.iconWidth, height: site.footer.iconHeight }));
        return () => {};
    }, [windowSize, site]);

    // useEffect(() => {
    //     setMicSize(getContentSize({ width: site.footer.iconWidth, height: site.footer.iconHeight }));
    //     return () => {};
    // }, []);

    useEffect(() => {
        if (loaded)
            animate(250);
        return () => {};
    }, [animate, loaded, selectedSite]);

    useEffect(() => {
        if (animateHeaderFooter) {
            buffers.play(site.header.ringAudio, false);
            animate(0);
        }
        return () => {};
    }, [animate, animateHeaderFooter, buffers, site.header.ringAudio]);

    useEffect(() => {
        if (site.footer.iconType === 'video') {
            video1Ref.current?.load();
            video2Ref.current?.load();
        }
        return () => {};
    }, [site.footer.icon, site.footer.iconType]);
    return (
        <>
            { selectedSite !== 'gallery' && !fullScreen && (
                <LawBreakersContainer>
                    <LawBreakersP ref={ref} className={`${betterCallState} ${bizerkMode !== 'off' ? 'bizerk' : ''}`}>
                        { site.footer.iconType === 'image'
    && (
        <Image
            className={`${leftSpinningState} ${bizerkMode !== 'off' ? 'bizerk' : ''}`}
            src={site.footer.icon}
            alt="rca-mic"
            width={micSize.width}
            height={micSize.height}
            loading="lazy"
            style={{
                maxWidth: '100%',
                height: 'auto'
            }}
        />
    )}
                        <LawBreakersSpan
                            onClick={() => {
                                // footerClick();
                                setAnimateHeaderFooter(animateHeaderFooter + 1);
                            }}
                        >
                            {site.footer.text}
                        </LawBreakersSpan>
                        { site.footer.iconType === 'image'
    && (
        <Image
            className={`${rightSpinningState} ${bizerkMode !== 'off' ? 'bizerk' : ''}`}
            src={site.footer.icon}
            alt="rca-mic"
            width={micSize.width}
            height={micSize.height}
            loading="lazy"
            style={{
                maxWidth: '100%',
                height: 'auto'
            }}
        />
    )}
                    </LawBreakersP>
                </LawBreakersContainer>
            ) }
            { selectedSite !== 'gallery' && !fullScreen && (
                <FooterContainer className={bizerkMode !== 'off' ? 'bizerk' : ''}>
                    <h2><a href="tel:+19173229246">• NOT TOLL FREE (800) CALL-SAL •</a></h2>
                </FooterContainer>
            ) }
        </>
    );
};

export default LawBreakers;
