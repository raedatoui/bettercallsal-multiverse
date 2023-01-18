import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import { LawBreakersContainer, LawBreakersP, LawBreakersSpan } from 'src/components/footer/elements';
import Image from 'next/image';
import { useWindowSize } from 'src/utils';
import { Size } from 'src/types';
import { SiteContext } from 'src/providers/sites';
import { SoundContext } from 'src/providers/audio-context';
import { AnimationContext } from 'src/providers/animations';

interface Props {}

export const LawBreakers: FC<Props> = () => {
    const { siteMap, selectedSite } = useContext(SiteContext);
    const { animateHeaderFooter, setAnimateHeaderFooter } = useContext(AnimationContext);
    const site = siteMap[selectedSite];

    const { buffers, loaded } = useContext(SoundContext);

    const windowSize = useWindowSize();
    const [micSize, setMicSize] = useState<Size>({ width: 148, height: 393 });
    const [leftSpinningState, setLeftSpinningState] = useState<string>(`img0 start ${selectedSite}`);
    const [rightSpinningState, setRightSpinningState] = useState<string>(`img1 start ${selectedSite}`);
    const [betterCallState, setBetterCallSalState] = useState<string>('');

    const ref = useRef<HTMLParagraphElement>(null);

    const getContentSize = (desiredSize: Size): Size => {
        const height = ref.current?.getBoundingClientRect().height ?? 0;
        const width = (height * desiredSize.width) / desiredSize.height;

        return { width, height };
    };

    const animate = (delay: number) => {
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
    };

    const footerClick = () => {
        buffers.play(site.header.ringAudio, false);
        animate(0);
    };

    useEffect(() => {
        setMicSize(getContentSize({ width: site.footer.imageWidth, height: site.footer.imageHeight }));
    }, [windowSize, site]);

    useEffect(() => {
        setMicSize(getContentSize({ width: site.footer.imageWidth, height: site.footer.imageHeight }));
    }, []);

    useEffect(() => {
        if (loaded)
            animate(250);
    }, [loaded, selectedSite]);

    useEffect(() => {
        if (animateHeaderFooter)
            footerClick();
    }, [animateHeaderFooter]);
    return (
        <LawBreakersContainer>
            <LawBreakersP ref={ref} className={betterCallState}>
                <Image
                    className={leftSpinningState}
                    src={site.footer.image}
                    alt="rca-mic"
                    width={micSize.width}
                    height={micSize.height}
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
                    className={rightSpinningState}
                    src={site.footer.image}
                    alt="rca-mic"
                    width={micSize.width}
                    height={micSize.height}
                />
            </LawBreakersP>
        </LawBreakersContainer>
    );
};
