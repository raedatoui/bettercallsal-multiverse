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
    const [iconSize, setIconSize] = useState<Size>({ width: 148, height: 393 });
    const [leftSpinningState, setLeftSpinningState] = useState<string>(`img0 start ${selectedSite}`);
    const [rightSpinningState, setRightSpinningState] = useState<string>(`img1 start ${selectedSite}`);
    const [betterCallState, setBetterCallSalState] = useState<string>('');

    const ref = useRef<HTMLParagraphElement>(null);

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
        setIconSize(getContentSize({ width: site.footer.icon.width, height: site.footer.icon.height }));
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
            console.log('animateHeaderFooter', site.footer.ringAudio);
            buffers.play(site.footer.ringAudio, false);
            animate(0);
        }
        return () => {};
    }, [animate, animateHeaderFooter, buffers, site.footer.ringAudio]);

    return (
        <>
            { selectedSite !== 'gallery' && !fullScreen && (
                <LawBreakersContainer>
                    <LawBreakersP ref={ref} className={`${betterCallState} ${bizerkMode !== 'off' ? 'bizerk' : ''}`}>

                        <Image
                            className={`${leftSpinningState} ${bizerkMode !== 'off' ? 'bizerk' : ''}`}
                            src={site.footer.icon.image}
                            alt="rca-mic"
                            width={iconSize.width}
                            height={iconSize.height}
                            loading="lazy"
                            style={{
                                maxWidth: '100%',
                                height: 'auto'
                            }}
                        />

                        <LawBreakersSpan
                            onClick={() => {
                                // footerClick();
                                setAnimateHeaderFooter(animateHeaderFooter + 1);
                            }}
                        >
                            {site.footer.text}
                        </LawBreakersSpan>

                        <Image
                            className={`${rightSpinningState} ${bizerkMode !== 'off' ? 'bizerk' : ''}`}
                            src={site.footer.icon.image}
                            alt="rca-mic"
                            width={iconSize.width}
                            height={iconSize.height}
                            loading="lazy"
                            style={{
                                maxWidth: '100%',
                                height: 'auto'
                            }}
                        />

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
