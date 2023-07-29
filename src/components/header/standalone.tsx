import React, { FC, useState, useEffect, useContext, useCallback } from 'react';
import { StandaloneFiller, StandaloneHeaderContainer, StandaloneTickerContainer } from '@/components/header/standalone-elements';
import { Baseline } from '@/components/header/ticker/elements';
import { SoundContext } from '@/providers/audio-context';
import { useSiteContext } from '@/providers/sites';
import { ContentContainer } from './elements';
import { SpinningSal, SpinningSalsContainer } from './spinning';

const StandaloneHeaderComponent: FC = () => {
    const { siteMap, selectedSite } = useSiteContext();
    const site = siteMap[selectedSite];

    const { loaded } = useContext(SoundContext);

    const [leftSpinningState, setLeftSpinningState] = useState<string>(`img0 start ${selectedSite}`);
    const [rightSpinningState, setRightSpinningState] = useState<string>(`img1 start ${selectedSite}`);

    const animate = useCallback((pauseAnim: boolean, delay: number) => {
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
    }, [selectedSite]);

    useEffect(() => {
        if (loaded)
            animate(false, 250);

    }, [animate, loaded, selectedSite]);

    return (
        <StandaloneHeaderContainer>
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

export default StandaloneHeaderComponent;
