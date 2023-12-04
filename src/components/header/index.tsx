import { gsap } from 'gsap';
import React, { FC, useContext, useState, useEffect } from 'react';
import Ticker from '@/components/header/ticker';
import { tickerList } from '@/constants';
import { useAnimationContext } from '@/providers/animations';
import { SoundContext } from '@/providers/audio-context';
import { useSiteContext } from '@/providers/sites';
import { WindowSizeContext } from '@/providers/window-size';
import { SiteKey, SiteKeyValidator } from '@/types';
import { pickRandom, useInterval } from '@/utils';
import { betterCallClick, betterCallClickWtf, loadAnimation, wtfLoadAnimation } from '@/utils/gsap';
import { HeaderContainer, ContentContainer } from './elements';
import { BetterCall, BizerkContainer, SalName, SalCaption, Bizerk } from './middle';
import { SpinningSal, SpinningSalsContainer } from './spinning';

const HeaderComponent: FC = () => {
    const { siteMap, selectedSite, fullScreen } = useSiteContext();

    const site = siteMap[selectedSite];

    const { animateGrid, setAnimateGrid, animateWtf, setAnimateWtf, animateNav, setAnimateNav, bizerkMode } = useAnimationContext();

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
    const [bizerkIcon, setBizerkIcon] = useState<{ icon: string; site: SiteKey }>(site.header.bizerk);
    const [ringAudio, setRingAudio] = useState<string>(site.header.ringAudio);
    const [spinningAudio1, setSpinningAudio1] = useState<string>(site.header.spinningSalAudio1);
    const [spinningAudio2, setSpinningAudio2] = useState<string>(site.header.spinningSalAudio2);

    const [tl, setTl] = useState<gsap.core.Timeline>();

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl =
                selectedSite === 'wtf'
                    ? /* eslint-disable indent, @typescript-eslint/indent */
                      betterCallClickWtf(selectedSite, [
                          [animateGrid, setAnimateGrid],
                          [animateNav, setAnimateNav],
                          [animateWtf, setAnimateWtf],
                      ])
                    : betterCallClick(selectedSite, animateGrid, setAnimateGrid);
            /* eslint-enable indent, @typescript-eslint/indent */
            setTl(tl);
        });
        return () => ctx.revert();
    }, [selectedSite]);

    useEffect(() => {
        // DOC: intro animation, triggered on site changed and buffer loaded
        if (loaded) {
            const timeline =
                selectedSite !== 'wtf'
                    ? loadAnimation()
                    : /* eslint-disable indent, @typescript-eslint/indent */
                      wtfLoadAnimation([
                          [animateGrid, setAnimateGrid],
                          [animateNav, setAnimateNav],
                          [animateWtf, setAnimateWtf],
                      ]);
            /* eslint-enable indent, @typescript-eslint/indent */
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
            setBizerkIcon(site.header.bizerk);
            setRingAudio(site.header.ringAudio);
        }
    }, [selectedSite, site]);

    useEffect(() => {
        if (animateWtf > 0) {
            const s1 = pickRandom(siteMap);
            const s2 = pickRandom(siteMap);
            // setLeftSpinningState(`img0 wtf ${s1.name}`);
            // setRightSpinningState(`img1 wtf ${s2.name}`);
            setLeftImage(s1.header.spinningSalsLeft);
            setRightImage(s2.header.spinningSalsRight);
            setName1(pickRandom(siteMap).header.name1);
            setName2(pickRandom(siteMap).header.name2);
            setTitle1(pickRandom(siteMap).header.title1);
            setTitle2(pickRandom(siteMap).header.title2);
            const s3 = pickRandom(siteMap);
            setBizerkIcon(s3.header.bizerk);
            setRingAudio(pickRandom(siteMap).header.ringAudio);
            setSpinningAudio1(pickRandom(siteMap).header.spinningSalAudio1);
            setSpinningAudio2(pickRandom(siteMap).header.spinningSalAudio2);
        }
    }, [animateWtf]);

    return (
        <HeaderContainer id="main-header" className={fullScreen ? `${selectedSite} off` : `${selectedSite} on`}>
            <SpinningSalsContainer>
                <SpinningSal wrapperStyle="left" imageStyle={`img0 animatable ${selectedSite}`} image={leftImage} audio={spinningAudio1} />
                <SpinningSal wrapperStyle="right" imageStyle={`img1 animatable ${selectedSite}`} image={rightImage} audio={spinningAudio2} />
            </SpinningSalsContainer>
            <ContentContainer>
                <Ticker backgroundColor="#F13400" sliderType="top" start={loadAnimationDone} sw={sw} selectedSlide={selectedSlide} />
                <BetterCall
                    className={`better-call-title ${bizerkMode !== 'off' ? 'bizerk' : ''}`}
                    onClick={() => {
                        tl?.restart();
                        // TODO: ring audio might not be loaded for wtf
                        buffers.play(ringAudio, false);
                    }}
                >
                    &ldquo;Better Call Sal!&rdquo;
                </BetterCall>
                <BizerkContainer className={`animatable ${bizerkMode !== 'off' ? 'bizerk' : ''}`}>
                    <SalName>{name1}</SalName>
                    <Bizerk bizerk={bizerkIcon} />
                    <SalName>{name2}</SalName>
                </BizerkContainer>
                <SalCaption className={`animatable ${bizerkMode !== 'off' ? 'bizerk' : ''}`}>
                    {title1} {title2}
                </SalCaption>
                <Ticker backgroundColor="#FE0000" sliderType="bottom" start={loadAnimationDone} sw={sw} selectedSlide={selectedSlide} />
            </ContentContainer>
        </HeaderContainer>
    );
};

export default HeaderComponent;
