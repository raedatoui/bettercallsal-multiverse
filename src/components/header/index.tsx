import { gsap } from 'gsap';
import React, { FC, useContext, useState, useEffect } from 'react';
import Ticker from '@/components/header/ticker';
import { tickerList } from '@/constants';
import { useAnimationContext } from '@/providers/animations';
import { SoundContext } from '@/providers/audio-context';
import { useSiteContext } from '@/providers/sites';
import { WindowSizeContext } from '@/providers/window-size';
import { SiteKeyValidator } from '@/types';
import { useInterval } from '@/utils';
import { betterCallClick, loadAnimation } from '@/utils/gsap';
import { HeaderContainer, ContentContainer } from './elements';
import { BetterCall, BizerkContainer, SalName, SalCaption, Bizerk } from './middle';
import { SpinningSal, SpinningSalsContainer } from './spinning';

const HeaderComponent: FC = () => {
    const { siteMap, selectedSite, fullScreen } = useSiteContext();

    const site = siteMap[selectedSite];

    const { animateGrid, setAnimateGrid, bizerkMode } = useAnimationContext();

    const { buffers, loaded } = useContext(SoundContext);

    const { width } = useContext(WindowSizeContext);

    const sw = width ?? 0;

    const [loadAnimationDone, setLoadAnimationDone] = useState<boolean>(false);

    const [selectedSlide, setSelectedSlide] = useState<number>(
        // DOC: sites with showTicker = false removed from tickerList and default to biz, 0
        Object.keys(tickerList).indexOf(selectedSite) === -1 ? 0 : SiteKeyValidator.options.indexOf(selectedSite)
    );
    const [tickerCounter, setTickerCounter] = useState<number>(0);

    const [leftImage, setLeftImage] = useState<string>(site.header.spinningSalsLeft);
    const [rightImage, setRightImage] = useState<string>(site.header.spinningSalsRight);

    const [name1, setName1] = useState<string>(site.header.name1);
    const [name2, setName2] = useState<string>(site.header.name2);
    const [title1, setTitle1] = useState<string>(site.header.title1);
    const [title2, setTitle2] = useState<string>(site.header.title2);
    const [siteName, setSiteName] = useState<string>(site.name);
    const [bizerkIcon, setBizerkIcon] = useState<string>(site.header.bizerkIcon);
    const [ringAudio, setRingAudio] = useState<string>(site.header.ringAudio);

    const [tl, setTl] = useState<gsap.core.Timeline>();

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = betterCallClick(selectedSite, animateGrid, setAnimateGrid);
            setTl(tl);
        });
        return () => ctx.revert();
    }, [selectedSite]);

    useEffect(() => {
        // DOC: intro animation, triggered on site changed and buffer loaded
        if (loaded) {
            const timeline = loadAnimation();
            timeline.play().then(() => {
                setLoadAnimationDone(true);
            });
            setTickerCounter(0);
        }
    }, [loaded, selectedSite]);

    let ticketInterval = 5000;
    if (bizerkMode !== 'off') ticketInterval = 2000;
    if (tickerCounter === 0) ticketInterval = 0;
    useInterval(() => {
        if (loadAnimationDone) {
            setTickerCounter(tickerCounter + 1);
            if (selectedSlide === tickerList.length - 1) setSelectedSlide(0);
            else setSelectedSlide(selectedSlide + 1);
        }
    }, ticketInterval);

    useEffect(() => {
        // DOC: reset out of wtf when hot keying
        if (selectedSite !== 'wtf') {
            setLeftImage(site.header.spinningSalsLeft);
            setRightImage(site.header.spinningSalsRight);
            setName1(site.header.name1);
            setName2(site.header.name2);
            setTitle1(site.header.title1);
            setTitle2(site.header.title2);
            setSiteName(site.name);
            setBizerkIcon(site.header.bizerkIcon);
            setRingAudio(site.header.ringAudio);
        }
    }, [selectedSite, site]);

    return (
        <HeaderContainer id="main-header" className={fullScreen ? `${selectedSite} off` : `${selectedSite} on`}>
            <SpinningSalsContainer>
                <SpinningSal wrapperStyle="left" imageStyle={`img0 ${selectedSite}`} image={leftImage} />
                <SpinningSal wrapperStyle="right" imageStyle={`img1 ${selectedSite}`} image={rightImage} />
            </SpinningSalsContainer>
            <ContentContainer>
                <Ticker backgroundColor="#F13400" sliderType="top" start={loadAnimationDone} sw={sw} selectedSlide={selectedSlide} />
                <BetterCall
                    className={`better-call-title ${bizerkMode !== 'off' ? 'bizerk' : ''}`}
                    onClick={() => {
                        tl?.restart();
                        buffers.play(ringAudio, false);
                    }}
                >
                    &ldquo;Better Call Sal!&rdquo;
                </BetterCall>
                <BizerkContainer className={`${bizerkMode !== 'off' ? 'bizerk' : ''}`}>
                    <SalName>{name1}</SalName>
                    <Bizerk name={siteName} bizerkIcon={bizerkIcon} />
                    <SalName>{name2}</SalName>
                </BizerkContainer>
                <SalCaption className={`${bizerkMode !== 'off' ? 'bizerk' : ''}`}>
                    {title1} {title2}
                </SalCaption>
                <Ticker backgroundColor="#FE0000" sliderType="bottom" start={loadAnimationDone} sw={sw} selectedSlide={selectedSlide} />
            </ContentContainer>
        </HeaderContainer>
    );
};

export default HeaderComponent;
