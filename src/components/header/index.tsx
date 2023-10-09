import React, { FC, useContext, useState, useEffect, useCallback } from 'react';
import Ticker from '@/components/header/ticker';
import { tickerList, WTF_RANDOM } from '@/constants';
import { useAnimationContext, useBizerkContext } from '@/providers/animations';
import { SoundContext } from '@/providers/audio-context';
import { useSiteContext } from '@/providers/sites';
import { WindowSizeContext } from '@/providers/window-size';
import { SiteKeyValidator } from '@/types';
import { useInterval, pickRandom } from '@/utils';
import { HeaderContainer, ContentContainer } from './elements';
import { BetterCall, BizerkContainer, SalName, SalCaption, Bizerk } from './middle';
import { SpinningSal, SpinningSalsContainer } from './spinning';

const HeaderComponent: FC = () => {
    const { siteMap, selectedSite, fullScreen } = useSiteContext();

    const { animateGrid, animateHeaderFooter, setAnimateHeaderFooter, animateBizerk } = useAnimationContext();
    const { bizerkMode, bizerkCounter } = useBizerkContext();
    const site = siteMap[selectedSite];

    const { buffers, loaded } = useContext(SoundContext);

    const { width } = useContext(WindowSizeContext);

    const sw = width ?? 0;

    const stopBizerk = () => {
        buffers.stopAll();
    };

    const startAnimClass = selectedSite === 'wtf' ? 'wtfStart' : 'start';
    const [leftSpinningState, setLeftSpinningState] = useState<string>(`img0 ${startAnimClass} ${selectedSite}`);
    const [rightSpinningState, setRightSpinningState] = useState<string>(`img1 ${startAnimClass} ${selectedSite}`);
    const [betterCallState, setBetterCallSalState] = useState<string>('');
    const [initialState, setInitialState] = useState<string>(selectedSite === 'wtf' ? 'off' : '');
    const [loadAnimationDone, setLoadAnimationStart] = useState<boolean>(false);

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

    const animate = useCallback(
        (pauseAnim: boolean) => {
            if (!pauseAnim) setLoadAnimationStart(false);

            if (selectedSite !== 'wtf') {
                setBetterCallSalState('better-call-anim');
                setLeftSpinningState(`img0 hover ${selectedSite}`);
                setRightSpinningState(`img1 hover ${selectedSite}`);
                setTimeout(() => {
                    setLeftSpinningState(`img0 ${selectedSite}`);
                    setRightSpinningState(`img1 ${selectedSite}`);
                    setBetterCallSalState('');
                    setTimeout(() => {
                        if (!pauseAnim) setLoadAnimationStart(true);
                    }, 2000);
                }, 3000);
            } else {
                setBetterCallSalState('better-call-anim');
                setInitialState('');
                let counter = 0;
                const interval = setInterval(() => {
                    const s1 = pickRandom(siteMap);
                    const s2 = pickRandom(siteMap);
                    setLeftSpinningState(`img0 wtf ${s1.name}`);
                    setRightSpinningState(`img1 wtf ${s2.name}`);
                    setLeftImage(s1.header.spinningSalsLeft);
                    setRightImage(s2.header.spinningSalsRight);
                    setName1(pickRandom(siteMap).header.name1);
                    setName2(pickRandom(siteMap).header.name2);
                    setTitle1(pickRandom(siteMap).header.title1);
                    setTitle2(pickRandom(siteMap).header.title2);
                    const s3 = pickRandom(siteMap);
                    setSiteName(s3.name);
                    setBizerkIcon(s3.header.bizerkIcon);
                    setRingAudio(pickRandom(siteMap).header.ringAudio);
                    counter += 1;
                    if (counter === WTF_RANDOM.limit) {
                        clearInterval(interval);
                        setTimeout(() => {
                            setLeftSpinningState(`img0 ${s1.name}`);
                            setRightSpinningState(`img1 ${s2.name}`);
                            setBetterCallSalState('');
                            setTimeout(() => {
                                if (!pauseAnim) setLoadAnimationStart(true);
                            }, 100);
                        }, 100);
                    }
                }, WTF_RANDOM.interval);
            }
        },
        [selectedSite]
    );

    useEffect(() => {
        if (loaded) {
            animate(false);
            setTickerCounter(0);
        }
    }, [animate, loaded, selectedSite]);

    useEffect(() => {
        if (animateHeaderFooter) {
            // TODO: not all random ring audios are loaded
            buffers.play(ringAudio, false);
            animate(true);
        }
        if (selectedSite === 'wtf') animate(false);
    }, [animate, animateGrid, bizerkCounter, animateHeaderFooter, buffers, site.header.ringAudio]);

    useEffect(() => {
        if (animateBizerk) {
            buffers.play(site.header.spinningSalAudio1, false);
            buffers.play(site.header.spinningSalAudio2, false);
        }
    }, [animate, animateBizerk, buffers, site.header.spinningSalAudio1, site.header.spinningSalAudio2]);

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
                <SpinningSal wrapperStyle="left" imageStyle={leftSpinningState} image={leftImage} />
                <SpinningSal wrapperStyle="right" imageStyle={rightSpinningState} image={rightImage} />
            </SpinningSalsContainer>
            <ContentContainer>
                <Ticker backgroundColor="#F13400" sliderType="top" start={loadAnimationDone} sw={sw} selectedSlide={selectedSlide} />
                <BetterCall
                    className={`${betterCallState} ${bizerkMode !== 'off' ? 'bizerk' : ''}`}
                    onClick={() => {
                        setAnimateHeaderFooter(animateHeaderFooter + 1);
                    }}
                >
                    &ldquo;Better Call Sal!&rdquo;
                </BetterCall>
                <BizerkContainer className={`${initialState} ${bizerkMode !== 'off' ? 'bizerk' : ''}`}>
                    <SalName>{name1}</SalName>
                    <Bizerk name={siteName} bizerkIcon={bizerkIcon} pause={stopBizerk} />
                    <SalName>{name2}</SalName>
                </BizerkContainer>
                <SalCaption className={`${initialState} ${bizerkMode !== 'off' ? 'bizerk' : ''}`}>
                    {title1} {title2}
                </SalCaption>
                <Ticker backgroundColor="#FE0000" sliderType="bottom" start={loadAnimationDone} sw={sw} selectedSlide={selectedSlide} />
            </ContentContainer>
        </HeaderContainer>
    );
};

export default HeaderComponent;
