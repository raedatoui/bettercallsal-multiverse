import React, { FC, useEffect, useState, useCallback } from 'react';
import { Keyframes } from 'styled-components';
import { TickerContainer } from '@/components/header/elements';
import { Baseline, LowerBanner, SiteUrl } from '@/components/header/ticker/elements';
import { defaultSiteMap } from '@/constants';
import { useAnimationContext } from '@/providers/animations';
import { useSiteContext } from '@/providers/sites';
import { Site, SiteKey, BizerkMode } from '@/types';
import { slideInFromLeft, slideOutFromLeft, squigglySlideInFromLeft, squigglySlideOutFromLeft, squigglyText } from '@/utils/animations';

interface Props {
    backgroundColor: string;
    sliderType: 'top' | 'bottom';
    start: boolean;
    sw: number;
    selectedSlide: number;
}

const map = {
    biz: defaultSiteMap.biz,
    rocks: defaultSiteMap.rocks,
    fit: defaultSiteMap.fit,
    art: defaultSiteMap.art,
    games: defaultSiteMap.games,
    construction: defaultSiteMap.construction,
};

interface SliderProps {
    sliderType: 'top' | 'bottom';
    start: boolean;
    sw: number;
    selectedSlide: number;
    site: Site | null;
    siteKey: string;
    index: number;
    selectedSite: SiteKey;
    bizerkMode: BizerkMode;
    listLength: number;
}

const sliders = {
    top: SiteUrl,
    bottom: LowerBanner,
};

const sliderContent = {
    top: (s: Site | undefined) => `bettercallsal.${s?.name}`,
    bottom: (s: Site | undefined) => (
        <>
            {s?.header.lowerBanner}
            <span>Click Here!!!</span>
        </>
    ),
};

const Slider: FC<SliderProps> = ({ selectedSite, selectedSlide, site, siteKey, index, start, sliderType, sw, bizerkMode, listLength }) => {
    const [animation, setAnimation] = useState<Keyframes | null>(null);
    const [animationDuration, setAnimationDuration] = useState<string>('2s');
    const [translateX, setTranslateX] = useState<number>(sw);
    const [visibility, setVisibility] = useState<string>('hidden');
    const SliderComponent = sliders[sliderType];

    const slideInDuration = 2;
    const slideOutDuration = 3;

    const selected = useCallback(() => {
        const bizerkOn = bizerkMode !== 'off';
        setTranslateX(0);
        setAnimation(bizerkOn ? squigglyText : null);
        setAnimationDuration(bizerkOn ? '5s linear infinite' : '');
        setVisibility('visible');
    }, [bizerkMode]);

    const reset = useCallback(() => {
        const bizerkOn = bizerkMode !== 'off';
        setTranslateX(sw);
        setAnimation(bizerkOn ? squigglyText : null);
        setAnimationDuration(bizerkOn ? '5s linear infinite' : '');
        setVisibility('hidden');
    }, [bizerkMode, sw]);

    const slideIn = useCallback(() => {
        const bizerkOn = bizerkMode !== 'off';
        setTranslateX(0);
        setAnimation(bizerkOn ? squigglySlideInFromLeft(`${sw}px`) : slideInFromLeft(`${sw}px`));
        setAnimationDuration(`${slideInDuration}s`);
        setVisibility('visible');
    }, [bizerkMode, sw]);

    const slideOut = useCallback(() => {
        const bizerkOn = bizerkMode !== 'off';
        setTranslateX(-sw);
        setAnimation(bizerkOn ? squigglySlideOutFromLeft(`-${sw}px`) : slideOutFromLeft(`-${sw}px`));
        setVisibility('visible');
        setAnimationDuration(`${slideOutDuration}s`);
    }, [bizerkMode, sw]);

    useEffect(() => {
        if (!start)
            if (siteKey === selectedSite) selected();
            else reset();
        else if (selectedSlide === 0 && index === 0) slideIn();
        else if (selectedSlide === 0 && index === listLength - 1) slideOut();
        else if (selectedSlide === index) slideIn();
        else if (selectedSlide - 1 === index) slideOut();
        else reset();
    }, [selectedSlide, selectedSite, start, index, selected, reset, slideIn, slideOut]);

    return (
        <SliderComponent
            href={`https://bettercallsal.${site?.name}`}
            animation={animation}
            animationDuration={animationDuration}
            visibility={visibility}
            translateX={translateX}
        >
            {sliderContent[sliderType](site || undefined)}
        </SliderComponent>
    );
};

const Ticker: FC<Props> = ({ backgroundColor, sliderType, start, sw, selectedSlide }) => {
    const { siteMap, selectedSite } = useSiteContext();
    const { bizerkMode } = useAnimationContext();

    const k = Object.entries(map);
    let initialSite = selectedSite;

    if (Object.keys(map).indexOf(selectedSite) !== -1) {
        let f = k[0][0];
        do {
            const s = k.shift();
            if (s) k.push(s);
            f = k[0][0];
        } while (f !== selectedSite);
    } else initialSite = 'biz'; // DOC: invisible tickers default to biz

    return (
        <TickerContainer background={backgroundColor}>
            <Baseline>{`bettercallsal.${siteMap.biz?.name}`}</Baseline>
            {k.map(([s, site], i) => (
                <Slider
                    key={s}
                    start={start}
                    selectedSlide={selectedSlide}
                    selectedSite={initialSite}
                    site={site}
                    sw={sw}
                    siteKey={s}
                    index={i}
                    sliderType={sliderType}
                    bizerkMode={bizerkMode}
                    listLength={k.length}
                />
            ))}
        </TickerContainer>
    );
};

export default Ticker;
