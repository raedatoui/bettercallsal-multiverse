import React, { FC, useContext, useState, useEffect, useCallback } from 'react';
import Ticker from '@/components/header/ticker';
import { tickerList } from '@/constants';
import { useAnimationContext, useBizerkContext } from '@/providers/animations';
import { SoundContext } from '@/providers/audio-context';
import { useSiteContext } from '@/providers/sites';
import { WindowSizeContext } from '@/providers/window-size';
import { SiteKeyValidator } from '@/types';
import { useInterval } from '@/utils';
import {
    HeaderContainer,
    ContentContainer,
} from './elements';
import { BetterCall, BizerkContainer, SalName, SalCaption, Bizerk } from './middle';
import { SpinningSal, SpinningSalsContainer } from './spinning';

const HeaderComponent: FC = () => {
    const { siteMap, selectedSite, fullScreen } = useSiteContext();

    const {
        animateHeaderFooter,
        setAnimateHeaderFooter,
        animateBizerk,
    } = useAnimationContext();
    const { bizerkMode } = useBizerkContext();
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
    const [selectedSlide, setSelectedSlide] = useState<number>(
        // TODO: sites with showBizerk = false removed from tickerList and default to biz, 0
        Object.keys(tickerList).indexOf(selectedSite) === -1 ? 0 : SiteKeyValidator.options.indexOf(selectedSite)
    );
    const [tickerCounter, setTickerCounter] = useState<number>(0);

    const animate = useCallback((pauseAnim: boolean) => {
        // this was the fadein animation
        // setLeftSpinningState(`img0 fadein ${selectedSite}`);
        // setRightSpinningState(`img1 fadein ${selectedSite}`);
        if (!pauseAnim)
            setLoadAnimationStart(false);
        // setTimeout(() => {
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
        // }, delay);
    }, [selectedSite]);

    useEffect(() => {
        if (loaded) {
            animate(false);
            setTickerCounter(0);
        }
        return () => {};
    }, [animate, loaded, selectedSite]);

    useEffect(() => {
        if (animateHeaderFooter) {
            buffers.play(site.header.ringAudio, false);
            animate(true);
        }
        return () => {};
    }, [animate, animateHeaderFooter, buffers, site.header.ringAudio]);

    useEffect(() => {
        if (animateBizerk) {
            buffers.play(site.header.spinningSalAudio1, false);
            buffers.play(site.header.spinningSalAudio2, false);
        }
        return () => {};
    }, [animate, animateBizerk, buffers, site.header.spinningSalAudio1, site.header.spinningSalAudio2]);

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
                <SalCaption className={bizerkMode !== 'off' ? 'bizerk' : ''}>{site.header.title1} {site.header.title2}</SalCaption>
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

export default HeaderComponent;
