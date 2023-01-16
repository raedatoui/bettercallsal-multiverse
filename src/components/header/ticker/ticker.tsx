import React, { FC, useContext, useEffect, useState } from 'react';
import { SiteContext } from 'src/providers/site-provider';
import { SiteOrder } from 'src/constants';
import { TickerContainer } from 'src/components/header/elements';
import { Baseline, LowerBanner, SiteUrl } from 'src/components/header/ticker/elements';
import { Site, SiteKey } from 'src/types';
import { Keyframes } from 'styled-components';
import { slideInFromLeft, slideOutFromLeft } from 'src/components/header/animations';

interface Props {
    backgroundColor: string;
    sliderType: 'top' | 'bottom';
    start: boolean;
    sw: number;
    selectedSlide: number;
    tickerCb: (a: boolean) => void;
}

interface SliderProps {
    sliderType: 'top' | 'bottom';
    start: boolean;
    sw: number;
    selectedSlide: number;
    site: Site;
    index: number;
    selectedSite: SiteKey;
    setSelectedSite: (s: SiteKey) => void
}

const sliders = {
    top: SiteUrl,
    bottom: LowerBanner
};

const sliderContent = {
    top: (s: Site | undefined) => `bettercallsal.${s?.name}`,
    bottom: (s: Site | undefined) => (<>{s?.header.lowerBanner}<span>Click Here!!!</span></>)
};

const Slider: FC<SliderProps> = ({ setSelectedSite, selectedSite, selectedSlide, site, index, start, sliderType, sw }) => {
    const [animation, setAnimation] = useState<Keyframes | null>(null);
    const [animationDuration, setAnimationDuration] = useState<number>(2);
    const [translateX, setTranslateX] = useState<number>(sw);
    const [visibility, setVisibility] = useState<string>('hidden');
    const SliderComponent = sliders[sliderType];

    const slideInDuration = 2;
    const slideOutDuration = 3;

    const selected = () => {
        setTranslateX(0);
        setAnimation(null);
        setVisibility('visible');
    };

    const reset = () => {
        setTranslateX(sw);
        setAnimation(null);
        setVisibility('hidden');
    };

    const slideIn = () => {
        setTranslateX(0);
        setAnimation(slideInFromLeft(`${sw}px`));
        setAnimationDuration(slideInDuration);
        setVisibility('visible');
    };

    const slideOut = () => {
        setTranslateX(-sw);
        setAnimation(slideOutFromLeft(`-${sw}px`));
        setVisibility('visible');
        setAnimationDuration(slideOutDuration);
    };

    useEffect(() => {
        if (!start)
            if (SiteOrder[index] === selectedSite)
                selected();
            else
                reset();
        else
        if (selectedSlide === 0 && index === 0)
            slideIn();
        else if (selectedSlide === 0 && index === 5)
            slideOut();
        else if (selectedSlide === index)
            slideIn();
        else if (selectedSlide - 1 === index)
            slideOut();
        else
            reset();

    }, [selectedSlide, selectedSite, start, index]);
    return (
        <SliderComponent
            onClick={(event) => { event.stopPropagation(); setSelectedSite(site.name); }}
            // href="https://bettercallsal.biz"
            animation={animation}
            animationDuration={animationDuration}
            visibility={visibility}
            translateX={translateX}
        >
            { sliderContent[sliderType](site)}
        </SliderComponent>
    );
};

const Ticker: FC<Props> = ({ backgroundColor, sliderType, start, sw, selectedSlide, tickerCb }) => {
    const { siteMap, selectedSite, setSelectedSite } = useContext(SiteContext);
    return (
        <TickerContainer
            background={backgroundColor}
            onMouseEnter={() => tickerCb(true)}
            onMouseLeave={() => tickerCb(false)}
        >
            <Baseline>{`bettercallsal.${siteMap.biz?.name}`}</Baseline>
            <Slider
                start={start}
                selectedSlide={selectedSlide}
                selectedSite={selectedSite}
                setSelectedSite={setSelectedSite}
                site={siteMap.biz}
                sw={sw}
                index={0}
                sliderType={sliderType}
            />
            <Slider
                start={start}
                selectedSlide={selectedSlide}
                selectedSite={selectedSite}
                setSelectedSite={setSelectedSite}
                site={siteMap.fit}
                sw={sw}
                index={1}
                sliderType={sliderType}
            />
            <Slider
                start={start}
                selectedSlide={selectedSlide}
                selectedSite={selectedSite}
                setSelectedSite={setSelectedSite}
                site={siteMap.art}
                sw={sw}
                index={2}
                sliderType={sliderType}
            />
            <Slider
                start={start}
                selectedSlide={selectedSlide}
                selectedSite={selectedSite}
                setSelectedSite={setSelectedSite}
                site={siteMap.rocks}
                sw={sw}
                index={3}
                sliderType={sliderType}
            />
            <Slider
                start={start}
                selectedSlide={selectedSlide}
                selectedSite={selectedSite}
                setSelectedSite={setSelectedSite}
                site={siteMap.games}
                sw={sw}
                index={4}
                sliderType={sliderType}
            />
            <Slider
                start={start}
                selectedSlide={selectedSlide}
                selectedSite={selectedSite}
                setSelectedSite={setSelectedSite}
                site={siteMap.construction}
                sw={sw}
                index={5}
                sliderType={sliderType}
            />
        </TickerContainer>
    );
};

export default Ticker;
