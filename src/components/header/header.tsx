import React, { FC, useContext, useState, useEffect } from 'react';
import { SiteContext } from 'src/providers/sites';
import { SoundContext } from 'src/providers/audio-context';
import { useInterval } from 'src/utils';
import { SiteOrder } from 'src/constants';
import { Ticker } from 'src/components/header/ticker';
import { WindowSizeContext } from 'src/providers/window-size';
import { AnimationContext } from 'src/providers/animations';
import {
    HeaderContainer,
    ContentContainer,
} from './elements';
import { SpinningSal, SpinningSalsContainer } from './spinning';
import { BetterCall, BizerkIcon, SalName, SalCaption, Bizerk } from './middle';

export const HeaderComponent: FC = () => {
    const { siteMap, selectedSite } = useContext(SiteContext);
    const { animateHeaderFooter, setAnimateHeaderFooter } = useContext(AnimationContext);
    const site = siteMap[selectedSite];

    const { buffers, loaded } = useContext(SoundContext);

    const { width } = useContext(WindowSizeContext);

    const sw = width ?? 0;

    const play = () => {
        if (site)
            buffers.play(site.header.spinningSalAudio, false);
    };

    const pause = () => {
        if (site)
            buffers.pause(site.header.spinningSalAudio);
    };

    const stop = () => {
        if (site)
            buffers.stop(site.header.spinningSalAudio);
    };

    const [leftSpinningState, setLeftSpinningState] = useState<string>(`img0 start ${selectedSite}`);
    const [rightSpinningState, setRightSpinningState] = useState<string>(`img1 start ${selectedSite}`);
    const [betterCallState, setBetterCallSalState] = useState<string>('');
    const [loadAnimationDone, setLoadAnimationStart] = useState<boolean>(false);
    const [selectedSlide, setSelectedSlide] = useState<number>(SiteOrder.indexOf(selectedSite));
    const [pauseTicker, setPauseTicker] = useState<boolean>(false);
    const [tickerCounter, setTickerCounter] = useState<number>(0);

    const animate = (pauseAnim: boolean, delay: number) => {
        setLeftSpinningState(`img0 fadein ${selectedSite}`);
        setRightSpinningState(`img1 fadein ${selectedSite}`);
        if (!pauseAnim)
            setLoadAnimationStart(false);
        setTimeout(() => {
            setBetterCallSalState('better-call-anim');
            setLeftSpinningState(`img0 hover ${selectedSite}`);
            setRightSpinningState(`img1 hover ${selectedSite}`);
            setTimeout(() => {
                setLeftSpinningState(`img0 ${selectedSite}`);
                setRightSpinningState(`img1 ${selectedSite}`);
                setBetterCallSalState('');
                setTimeout(() => {
                    if (!pauseAnim)
                        setLoadAnimationStart(true);
                }, 2000);
            }, 3000);
        }, delay);
    };

    useEffect(() => {
        if (loaded) {
            animate(false, 250);
            setTickerCounter(0);
        }
    }, [loaded, selectedSite]);

    const headerClick = () => {
        buffers.play(site.header.ringAudio, false);
        animate(true, 0);
    };

    useEffect(() => {
        if (animateHeaderFooter)
            headerClick();
    }, [animateHeaderFooter]);

    useInterval(() => {
        if (loadAnimationDone && !pauseTicker) {
            setTickerCounter(tickerCounter + 1);
            if (selectedSlide === 5)
                setSelectedSlide(0);
            else setSelectedSlide(selectedSlide + 1);
        }
    }, tickerCounter === 0 ? 0 : 5000);

    return (
        <HeaderContainer>
            <SpinningSalsContainer>
                <SpinningSal
                    wrapperStyle="left"
                    imageStyle={leftSpinningState}
                    play={play}
                    pause={pause}
                    image={site.header.spinningSalsLeft}
                />
                <SpinningSal
                    wrapperStyle="right"
                    imageStyle={rightSpinningState}
                    play={play}
                    pause={stop}
                    image={site.header.spinningSalsRight}
                />
            </SpinningSalsContainer>
            <ContentContainer>
                <Ticker
                    backgroundColor="#F13400"
                    sliderType="top"
                    start={loadAnimationDone}
                    sw={sw}
                    selectedSlide={selectedSlide}
                    tickerCb={setPauseTicker}
                />
                <BetterCall
                    className={betterCallState}
                    onClick={() => { setAnimateHeaderFooter(animateHeaderFooter + 1); }}
                >
                    &ldquo;Better Call Sal!&rdquo;
                </BetterCall>
                <BizerkIcon>
                    <SalName>{site.header.name1}</SalName>
                    <Bizerk site={site} />
                    <SalName>{site.header.name2}</SalName>
                </BizerkIcon>
                <SalCaption>{site.header.title}</SalCaption>
                <Ticker
                    backgroundColor="#FE0000"
                    sliderType="bottom"
                    start={loadAnimationDone}
                    sw={sw}
                    selectedSlide={selectedSlide}
                    tickerCb={setPauseTicker}
                />
            </ContentContainer>
        </HeaderContainer>
    );
};
