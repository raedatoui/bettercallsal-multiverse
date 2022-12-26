import React, { FC, useContext, useEffect, useState } from 'react';
import { SiteContext } from 'src/providers/site-provider';
import { SiteOrder } from 'src/constants';
import { TickerContainer } from 'src/components/header/elements';
import { LowerBanner, SiteUrl, SlidingItem } from 'src/components/header/ticker/elements';
import { Site, SiteKey } from 'src/types';

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
    const [sliderClass, setSliderClass] = useState<string>('item');
    const SliderComponent = sliders[sliderType];

    useEffect(() => {
        if (!start)
            if (SiteOrder[index] === selectedSite) setSliderClass('item initial visible');
            else setSliderClass('item');

        else
        if (selectedSlide === 0 && index === 0)
            setSliderClass('item slideIn visible');
        else if (selectedSlide === 0 && index === 5)
            setSliderClass('item slideOut visible');
        else if (selectedSlide === index)
            setSliderClass('item slideIn visible');
        else if (selectedSlide - 1 === index)
            setSliderClass('item slideOut visible');
        else
            setSliderClass('item');

    }, [selectedSlide, selectedSite]);
    return (
        <SliderComponent
            onClick={(event) => { event.stopPropagation(); setSelectedSite(site.name); }}
            // href="https://bettercallsal.biz"
            sw={sw}
            className={sliderClass}
        >
            { sliderContent[sliderType](site)}
        </SliderComponent>
    );
};

const Ticker: FC<Props> = ({ backgroundColor, sliderType, start, sw, selectedSlide, tickerCb }) => {
    const { sites, selectedSite, setSelectedSite } = useContext(SiteContext);
    return (
        <TickerContainer
            background={backgroundColor}
            onMouseEnter={() => tickerCb(true)}
            onMouseLeave={() => tickerCb(false)}
        >
            <SlidingItem sw={sw} className="baseline">{`bettercallsal.${sites.biz?.name}`}</SlidingItem>
            <Slider
                start={start}
                selectedSlide={selectedSlide}
                selectedSite={selectedSite}
                setSelectedSite={setSelectedSite}
                site={sites.biz}
                sw={sw}
                index={0}
                sliderType={sliderType}
            />
            <Slider
                start={start}
                selectedSlide={selectedSlide}
                selectedSite={selectedSite}
                setSelectedSite={setSelectedSite}
                site={sites.fit}
                sw={sw}
                index={1}
                sliderType={sliderType}
            />
            <Slider
                start={start}
                selectedSlide={selectedSlide}
                selectedSite={selectedSite}
                setSelectedSite={setSelectedSite}
                site={sites.art}
                sw={sw}
                index={2}
                sliderType={sliderType}
            />
            <Slider
                start={start}
                selectedSlide={selectedSlide}
                selectedSite={selectedSite}
                setSelectedSite={setSelectedSite}
                site={sites.rocks}
                sw={sw}
                index={3}
                sliderType={sliderType}
            />
            <Slider
                start={start}
                selectedSlide={selectedSlide}
                selectedSite={selectedSite}
                setSelectedSite={setSelectedSite}
                site={sites.games}
                sw={sw}
                index={4}
                sliderType={sliderType}
            />
            <Slider
                start={start}
                selectedSlide={selectedSlide}
                selectedSite={selectedSite}
                setSelectedSite={setSelectedSite}
                site={sites.construction}
                sw={sw}
                index={5}
                sliderType={sliderType}
            />
        </TickerContainer>
    );
};

export default Ticker;
