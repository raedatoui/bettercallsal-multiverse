import React, { FC, useContext, useState, useEffect } from 'react';
import { SiteContext } from 'src/providers/site-provider';
import { SoundContext } from 'src/providers/audio-context';
import { useWindowSize } from 'src/utils/resize';
import { useInterval } from 'src/utils/interval';
import { SiteOrder } from 'src/constants';
import { Ticker } from 'src/components/header/ticker';
import {
    HeaderContainer,
    ContentContainer,
} from './elements';
import { SpinningSal, SpinningSalsContainer } from './spinning';
import { BetterCall, BizerkIcon, BizerImage, BizerkImageContainer, SalName, SalCaption } from './middle';

export const HeaderComponent: FC = () => {
    const { sites, selectedSite } = useContext(SiteContext);
    const site = sites[selectedSite];

    const { buffers, loaded } = useContext(SoundContext);

    const play = () => {
        if (site)
            buffers.play(site.header.spinningSalAudio);
    };

    const pause = () => {
        if (site)
            buffers.pause(site.header.spinningSalAudio);
    };

    const stop = () => {
        if (site)
            buffers.stop(site.header.spinningSalAudio);
    };

    const size = useWindowSize();
    const sw = size.width ?? 0;

    const [leftSpinningState, setLeftSpinningState] = useState<string>(`img0 start ${selectedSite}`);
    const [rightSpinningState, setRightSpinningState] = useState<string>(`img1 start ${selectedSite}`);
    const [betterCallState, setBetterCallSalState] = useState<string>('');
    const [loadAnimationDone, setLoadAnimationStart] = useState<boolean>(false);
    const [selectedSlide, setSelectedSlide] = useState<number>(SiteOrder.indexOf(selectedSite) + 1);
    const [pauseTicker, setPauseTicker] = useState<boolean>(false);

    const animate = (pauseAnim: boolean, delay: number = 250) => {
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
        if (loaded) animate(false);
    }, [loaded, selectedSite]);

    useInterval(() => {
        if (loadAnimationDone && !pauseTicker)
            if (selectedSlide === 5)
                setSelectedSlide(0);
            else setSelectedSlide(selectedSlide + 1);

    }, loadAnimationDone ? 5000 : 0);

    return (
        <HeaderContainer>
            <SpinningSalsContainer>
                <SpinningSal
                    wrapperStyle="left"
                    imageStyle={leftSpinningState}
                    site={site ?? null}
                    play={play}
                    pause={pause}
                    image={site?.header.spinningSalsLeft ?? ''}
                />
                <SpinningSal
                    wrapperStyle="right"
                    imageStyle={rightSpinningState}
                    site={site ?? null}
                    play={play}
                    pause={stop}
                    image={site?.header.spinningSalsRight ?? ''}
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
                    onClick={() => site && buffers.play(site?.header.ringAudio) && animate(true, 0)}
                >
                    &ldquo;Better Call Sal!&rdquo;
                </BetterCall>
                <BizerkIcon>
                    <SalName>{site?.header.name1 ?? ''}</SalName>
                    <BizerkImageContainer className={site?.name ?? ''}>
                        <BizerImage background={site?.header.bizerkIcon ?? ''} className={site?.name ?? ''} />
                    </BizerkImageContainer>
                    <SalName>{site?.header.name2 ?? ''}</SalName>
                </BizerkIcon>
                <SalCaption>{site?.header.title}</SalCaption>
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
