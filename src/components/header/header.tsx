'use client';

import React, { FC, useContext, useState, useEffect, useCallback } from 'react';
import { useSiteContext } from 'src/providers/sites';
import { SoundContext } from 'src/providers/audio-context';
import { useInterval } from 'src/utils';
import { Ticker } from 'src/components/header/ticker';
import { WindowSizeContext } from 'src/providers/window-size';
import { useAnimationContext } from 'src/providers/animations';
import { SiteKeyValidator, tickerList } from 'src/types';
import {
    HeaderContainer,
    ContentContainer,
} from './elements';
import { SpinningSal, SpinningSalsContainer } from './spinning';
import { BetterCall, BizerkContainer, SalName, SalCaption, Bizerk } from './middle';

export const HeaderComponent: FC = () => {
    const { siteMap, selectedSite, fullScreen, bizerkMode } = useSiteContext();
    const { animateHeaderFooter, setAnimateHeaderFooter } = useAnimationContext();

    const site = siteMap[selectedSite];

    const { buffers, loaded } = useContext(SoundContext);

    const { width } = useContext(WindowSizeContext);

    const sw = width ?? 0;

    const stopBizerk = () => {
        if (site)
            buffers.stopAll();
    };

    const [leftSpinningState, setLeftSpinningState] = useState<string>(`img0 start ${selectedSite}`);
    const [rightSpinningState, setRightSpinningState] = useState<string>(`img1 start ${selectedSite}`);
    const [betterCallState, setBetterCallSalState] = useState<string>('');
    const [loadAnimationDone, setLoadAnimationStart] = useState<boolean>(false);
    const [selectedSlide, setSelectedSlide] = useState<number>(SiteKeyValidator.options.indexOf(selectedSite));
    const [tickerCounter, setTickerCounter] = useState<number>(0);

    const animate = useCallback((pauseAnim: boolean, delay: number) => {
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
    }, [selectedSite]);

    useEffect(() => {
        if (loaded) {
            animate(false, 250);
            setTickerCounter(0);
        }
        return () => {};
    }, [animate, loaded, selectedSite]);

    useEffect(() => {
        if (animateHeaderFooter) {
            buffers.play(site.header.ringAudio, false);
            animate(true, 0);
        }
        return () => {};
    }, [animate, animateHeaderFooter, buffers, site.header.ringAudio]);

    let ticketInterval = 5000;
    if (bizerkMode !== 'off') ticketInterval = 2000;
    if (tickerCounter === 0) ticketInterval = 0;
    useInterval(() => {
        if (loadAnimationDone) {
            setTickerCounter(tickerCounter + 1);
            if (selectedSlide === tickerList.length - 1)
                setSelectedSlide(0);
            else setSelectedSlide(selectedSlide + 1);
        }
    }, ticketInterval);

    return (
        <HeaderContainer id="main-header" className={fullScreen ? 'off' : 'on'}>
            <SpinningSalsContainer>
                <SpinningSal
                    wrapperStyle="left"
                    imageStyle={leftSpinningState}
                    image={site.header.spinningSalsLeft}
                />
                <SpinningSal
                    wrapperStyle="right"
                    imageStyle={rightSpinningState}
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
                />
                <BetterCall
                    className={`${betterCallState} ${bizerkMode !== 'off' ? 'bizerk' : ''}`}
                    onClick={() => { setAnimateHeaderFooter(animateHeaderFooter + 1); }}
                >
                    &ldquo;Better Call Sal!&rdquo;
                </BetterCall>
                <BizerkContainer className={bizerkMode !== 'off' ? 'bizerk' : ''}>
                    <SalName>{site.header.name1}</SalName>
                    <Bizerk site={site} pause={stopBizerk} />
                    <SalName>{site.header.name2}</SalName>
                </BizerkContainer>
                <SalCaption className={bizerkMode !== 'off' ? 'bizerk' : ''}>{site.header.title}</SalCaption>
                <Ticker
                    backgroundColor="#FE0000"
                    sliderType="bottom"
                    start={loadAnimationDone}
                    sw={sw}
                    selectedSlide={selectedSlide}
                />
            </ContentContainer>
        </HeaderContainer>
    );
};
