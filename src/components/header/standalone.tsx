import React, { FC, useState, useEffect, useContext } from 'react';
import { useSiteContext } from 'src/providers/sites';
import { StandaloneFiller, StandaloneHeaderContainer, StandaloneTickerContainer } from 'src/components/header/standalone-elements';
import { Baseline } from 'src/components/header/ticker/elements';
import { SoundContext } from 'src/providers/audio-context';
import { ContentContainer } from './elements';
import { SpinningSal, SpinningSalsContainer } from './spinning';

export const StandaloneHeaderComponent: FC = () => {
    const { siteMap, selectedSite } = useSiteContext();
    const site = siteMap[selectedSite];

    const { buffers, loaded } = useContext(SoundContext);

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

    const animate = (pauseAnim: boolean, delay: number) => {
        setLeftSpinningState(`img0 fadein ${selectedSite}`);
        setRightSpinningState(`img1 fadein ${selectedSite}`);

        setTimeout(() => {

            setLeftSpinningState(`img0 hover ${selectedSite}`);
            setRightSpinningState(`img1 hover ${selectedSite}`);
            setTimeout(() => {
                setLeftSpinningState(`img0 ${selectedSite}`);
                setRightSpinningState(`img1 ${selectedSite}`);
            }, 3000);
        }, delay);
    };

    useEffect(() => {
        if (loaded)
            animate(false, 250);

    }, [loaded, selectedSite]);

    return (
        <StandaloneHeaderContainer>
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
                <StandaloneTickerContainer
                    background="#F13400"
                    onMouseEnter={() => {}}
                    onMouseLeave={() => {}}
                >
                    <Baseline>{`bettercallsal.${siteMap.biz?.name}`}</Baseline>
                </StandaloneTickerContainer>
                <StandaloneFiller />
                <StandaloneTickerContainer
                    background="#FE0000"
                    onMouseEnter={() => {}}
                    onMouseLeave={() => {}}
                >
                    <Baseline>{`bettercallsal.${siteMap.biz?.name}`}</Baseline>
                </StandaloneTickerContainer>

            </ContentContainer>
        </StandaloneHeaderContainer>
    );
};
