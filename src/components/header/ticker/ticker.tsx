import React, { FC, useEffect, useState, MouseEvent, useCallback } from 'react';
import { useSiteContext } from 'src/providers/sites';
import { EXTERNAL_LINK } from 'src/constants';
import { TickerContainer } from 'src/components/header/elements';
import { Baseline, LowerBanner, SiteUrl } from 'src/components/header/ticker/elements';
import { Site, SiteKey, SiteKeyValidator, BizerkMode } from 'src/types';
import { Keyframes } from 'styled-components';
import { slideInFromLeft, slideOutFromLeft, squigglySlideInFromLeft, squigglySlideOutFromLeft, squigglyText } from 'src/utils/animations';

interface Props {
    backgroundColor: string;
    sliderType: 'top' | 'bottom';
    start: boolean;
    sw: number;
    selectedSlide: number;
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
    bizerkMode: BizerkMode;
}

const sliders = {
    top: SiteUrl,
    bottom: LowerBanner
};

const sliderContent = {
    top: (s: Site | undefined) => `bettercallsal.${s?.name}`,
    bottom: (s: Site | undefined) => (<>{s?.header.lowerBanner}<span>Click Here!!!</span></>)
};

const Slider: FC<SliderProps> = (
    {
        setSelectedSite,
        selectedSite,
        selectedSlide,
        site,
        index,
        start,
        sliderType,
        sw,
        bizerkMode
    }
) => {
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
            if (SiteKeyValidator.options[index] === selectedSite)
                selected();
            else
                reset();
        else
        if (selectedSlide === 0 && index === 0)
            slideIn();
        else if (selectedSlide === 0 && index === 6)
            slideOut();
        else if (selectedSlide === index)
            slideIn();
        else if (selectedSlide - 1 === index)
            slideOut();
        else
            reset();
    }, [selectedSlide, selectedSite, start, index, selected, reset, slideIn, slideOut]);

    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
        if (!EXTERNAL_LINK) {
            event.stopPropagation();
            setSelectedSite(site.name);
        }
    };

    // console.log(animation, animationDuration);
    return (
        <SliderComponent
            onClick={handleClick}
            href={`https://bettercallsal.${site.name}`}
            animation={animation}
            animationDuration={animationDuration}
            visibility={visibility}
            translateX={translateX}
        >
            { sliderContent[sliderType](site)}
        </SliderComponent>
    );
};

const Ticker: FC<Props> = ({ backgroundColor, sliderType, start, sw, selectedSlide }) => {
    const { siteMap, selectedSite, setSelectedSite, bizerkMode } = useSiteContext();
    return (
        <TickerContainer
            background={backgroundColor}
            // onMouseEnter={() => tickerCb(true)}
            // onMouseLeave={() => tickerCb(false)}
        >
            <Baseline>{`bettercallsal.${siteMap.biz?.name}`}</Baseline>
            { SiteKeyValidator.options.map((s, i) => (
                <Slider
                    key={s}
                    start={start}
                    selectedSlide={selectedSlide}
                    selectedSite={selectedSite}
                    setSelectedSite={setSelectedSite}
                    site={siteMap[s]}
                    sw={sw}
                    index={i}
                    sliderType={sliderType}
                    bizerkMode={bizerkMode}
                />
            ))}
        </TickerContainer>
    );
};

export default Ticker;
