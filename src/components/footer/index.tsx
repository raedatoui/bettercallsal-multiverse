import Image from 'next/image';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { FooterContainer, LawBreakersContainer, LawBreakersP, LawBreakersSpan } from '@/components/footer/elements';
import { WTF_RANDOM } from '@/constants';
import { useAnimationContext, useBizerkContext } from '@/providers/animations';
import { SoundContext } from '@/providers/audio-context';
import { useSiteContext } from '@/providers/sites';
import { Size } from '@/types';
import { useWindowSize, pickRandom } from '@/utils';

const LawBreakers = () => {
    const { siteMap, selectedSite, fullScreen } = useSiteContext();
    const { animateGrid, animateHeaderFooter, setAnimateHeaderFooter } = useAnimationContext();
    const { bizerkMode, bizerkCounter } = useBizerkContext();
    const site = siteMap[selectedSite];

    const { buffers, loaded } = useContext(SoundContext);

    const windowSize = useWindowSize();
    const [leftIconSize, setLeftIconSize] = useState<Size>({ width: 148, height: 393 });
    const [rightIconSize, setRightIconSize] = useState<Size>({ width: 148, height: 393 });
    const [leftSpinningState, setLeftSpinningState] = useState<string>(`img0 start ${selectedSite}`);
    const [rightSpinningState, setRightSpinningState] = useState<string>(`img1 start ${selectedSite}`);
    const [betterCallState, setBetterCallSalState] = useState<string>(selectedSite === 'wtf' ? 'off' : 'init');
    const [footerText, setFooterText] = useState<string>(site.footer.text);
    const [leftImage, setLeftImage] = useState(site.footer.icon);
    const [rightImage, setRightImage] = useState(site.footer.icon);
    const [ringAudio, setRingAudio] = useState(site.footer.ringAudio);

    const ref = useRef<HTMLParagraphElement>(null);

    const getContentSize = (desiredSize: Size): Size => {
        const height = ref.current?.getBoundingClientRect().height ?? 0;
        const width = (height * desiredSize.width) / desiredSize.height;
        return { width, height };
    };

    const animate = useCallback(
        (delay: number) => {
            if (selectedSite !== 'wtf') {
                setLeftSpinningState(`img0 fadein ${selectedSite}`);
                setRightSpinningState(`img1 fadein ${selectedSite}`);
                setTimeout(() => {
                    setBetterCallSalState('better-call-anim');
                    setLeftSpinningState(`img0 hover ${selectedSite}`);
                    setRightSpinningState(`img1 hover ${selectedSite}`);
                    setTimeout(() => {
                        setLeftSpinningState(`img0 ${selectedSite}`);
                        setRightSpinningState(`img1 ${selectedSite}`);
                        setBetterCallSalState('init');
                    }, 3000);
                }, delay);
            } else {
                let counter = 0;
                const interval = setInterval(() => {
                    const s1 = pickRandom(siteMap);
                    const s2 = pickRandom(siteMap);
                    setBetterCallSalState('wtf');
                    setLeftSpinningState(`img0 bizerk ${s1.name}`);
                    setRightSpinningState(`img1 bizerk ${s2.name}`);
                    setFooterText(pickRandom(siteMap).footer.text);
                    setLeftImage(s1.footer.icon);
                    setRightImage(s2.footer.icon);
                    setRingAudio(pickRandom(siteMap).footer.ringAudio);
                    counter += 1;
                    if (counter === WTF_RANDOM.limit) {
                        clearInterval(interval);
                        setLeftSpinningState(`img0 ${s1.name}`);
                        setRightSpinningState(`img1 ${s2.name}`);
                        setBetterCallSalState('init');
                    }
                }, WTF_RANDOM.interval);
            }
        },
        [selectedSite, siteMap]
    );

    useEffect(() => {
        setLeftIconSize(
            getContentSize({
                width: leftImage.width,
                height: leftImage.height,
            })
        );
        setRightIconSize(
            getContentSize({
                width: rightImage.width,
                height: rightImage.height,
            })
        );
    }, [windowSize, site, leftImage, rightImage]);

    // useEffect(() => {
    //     setMicSize(getContentSize({ width: site.footer.iconWidth, height: site.footer.iconHeight }));
    //     return () => {};
    // }, []);

    useEffect(() => {
        if (loaded) animate(250);
    }, [animate, loaded, selectedSite]);

    useEffect(() => {
        if (animateHeaderFooter) {
            buffers.play(ringAudio, false);
            animate(0);
        }
        if (selectedSite === 'wtf') animate(0);
    }, [animate, animateGrid, bizerkCounter, animateHeaderFooter, buffers, site.footer.ringAudio]);

    useEffect(() => {
        // DOC: reset out of wtf when hot keying
        if (selectedSite !== 'wtf') {
            setFooterText(site.footer.text);
            setLeftImage(site.footer.icon);
            setRightImage(site.footer.icon);
            setRingAudio(site.footer.ringAudio);
        }
    }, [selectedSite, site]);
    return (
        <>
            {selectedSite !== 'gallery' && !fullScreen && (
                <LawBreakersContainer>
                    <LawBreakersP ref={ref} className={`${betterCallState} ${bizerkMode !== 'off' ? 'bizerk' : ''}`}>
                        <Image
                            className={`${leftSpinningState} ${bizerkMode !== 'off' ? 'bizerk' : ''}`}
                            src={leftImage.image}
                            alt="footer-icon"
                            width={leftIconSize.width}
                            height={leftIconSize.height}
                            loading="lazy"
                            style={{
                                maxWidth: '100%',
                                height: 'auto',
                            }}
                        />

                        <LawBreakersSpan
                            onClick={() => {
                                setAnimateHeaderFooter(animateHeaderFooter + 1);
                            }}
                        >
                            {footerText}
                        </LawBreakersSpan>

                        <Image
                            className={`${rightSpinningState} ${bizerkMode !== 'off' ? 'bizerk' : ''}`}
                            src={rightImage.image}
                            alt="footer-icon"
                            width={rightIconSize.width}
                            height={rightIconSize.height}
                            loading="lazy"
                            style={{
                                maxWidth: '100%',
                                height: 'auto',
                            }}
                        />
                    </LawBreakersP>
                </LawBreakersContainer>
            )}
            {selectedSite !== 'gallery' && !fullScreen && (
                <FooterContainer className={bizerkMode !== 'off' ? 'bizerk' : ''}>
                    <h2>
                        <a href="tel:+19173229246">• NOT TOLL FREE (800) CALL-SAL •</a>
                    </h2>
                </FooterContainer>
            )}
        </>
    );
};

export default LawBreakers;
