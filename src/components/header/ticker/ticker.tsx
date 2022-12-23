import React, { FC, useContext } from 'react';
import { SiteContext } from 'src/providers/site-provider';
import { SiteOrder } from 'src/constants';
import { TickerContainer } from 'src/components/header/elements';
import { LowerBanner, SiteUrl } from 'src/components/header/ticker/elements';
import { Site } from 'src/types';

interface Props {
    backgroundColor: string;
    sliderType: 'top' | 'bottom';
    start: boolean;
    sw: number;
    selectedSlide: number;
    tickerCb: (a: boolean) => void;
}

const sliders = {
    top: SiteUrl,
    bottom: LowerBanner
};

const sliderContent = {
    top: (s: Site | undefined) => `bettercallsal.${s?.name}`,
    bottom: (s: Site | undefined) => (<>{s?.header.lowerBannerTxt}<span>Click Here!!!</span></>)
};

const Ticker: FC<Props> = ({ backgroundColor, sliderType, start, sw, selectedSlide, tickerCb }) => {
    const { sites, selectedSite } = useContext(SiteContext);
    const Slider = sliders[sliderType];

    const getClasses = (index: number): string => {
        if (!start)
            if (SiteOrder[index] === selectedSite) return 'item initial';
            else return 'item';

        if (selectedSlide === index)
            return 'item slideIn';
        if (selectedSlide === 0 && index === 5)
            return 'item slideOut';
        if (selectedSlide - 1 === index)
            return 'item slideOut';
        return 'item';
    };
    return (
        <TickerContainer
            background={backgroundColor}
            onMouseEnter={() => tickerCb(true)}
            onMouseLeave={() => tickerCb(false)}
        >
            <Slider sw={sw} className="baseline">{`bettercallsal.${sites.biz?.name}`}</Slider>
            <Slider
                // onClick={() => setSelectedSite?.('biz')}
                href="https://bettercallsal.biz"
                sw={sw}
                className={getClasses(0)}
            >
                { sliderContent[sliderType](sites.biz)}
            </Slider>
            <Slider
                // onClick={() => setSelectedSite?.('fit')}
                href="https://bettercallsal.fit"
                sw={sw}
                className={getClasses(1)}
            >
                { sliderContent[sliderType](sites.fit)}
            </Slider>
            <Slider
                // onClick={() => setSelectedSite?.('art')}
                href="https://bettercallsal.art"
                sw={sw}
                className={getClasses(2)}
            >
                { sliderContent[sliderType](sites.art)}
            </Slider>
            <Slider
                // onClick={() => setSelectedSite?.('rocks')}
                href="https://bettercallsal.rocks"
                sw={sw}
                className={getClasses(3)}
            >
                { sliderContent[sliderType](sites.rocks)}
            </Slider>
            <Slider
                // onClick={() => setSelectedSite?.('games')}
                href="https://bettercallsal.games"
                sw={sw}
                className={getClasses(4)}
            >
                { sliderContent[sliderType](sites.games)}
            </Slider>
            <Slider
                // onClick={() => setSelectedSite?.('construction')}
                href="https://bettercallsal.construction"
                sw={sw}
                className={getClasses(5)}
            >
                { sliderContent[sliderType](sites.construction)}
            </Slider>
        </TickerContainer>
    );
};

export default Ticker;
