import Link from 'next/link';
import Script from 'next/script';
import React, { useContext, useEffect, useRef, useState } from 'react';
import LawBreakers from '@/components/footer';
import ParticleSystem from '@/components/glfx';
import HeaderComponent from '@/components/header';
import { LeftNavButton1, LeftNavButton1Wrapper, LeftNavItemCuck1, LeftNavMenu1 } from '@/components/left-nav/elements';
import { CDN } from '@/constants';
import { useBizerkContext } from '@/providers/animations';
import { SoundContext } from '@/providers/audio-context';
import { PathProvider } from '@/providers/path';
import { useSiteContext } from '@/providers/sites';
import { Main, Row1 } from '@/styles/sharedstyles';
import { SiteKeyValidator } from '@/types';


const extraLinks = {
    Instagram: 'https://instagram.com/bettercallsal.biz',
    Facebook: 'https://www.facebook.com/people/Better-Call-Sal/61551198371709/',
    TikTok: 'https://www.tiktok.com/@bettercallsal.biz',
    IMDb: 'https://www.imdb.com/name/nm5500398/',
    Github: 'https://github.com/raedatoui/bettercallsal-multiverse',
    // Harjo: 'https://www.allhailharjo.com',
    // 'Nature Creeps Beneath': 'https://www.naturecreepsbeneath.com',
};

const MainContainerInner = () => {
    const { selectedSite, fullScreen } = useSiteContext();
    const { bizerkMode, setBizerkMode } = useBizerkContext();
    const { buffers } = useContext(SoundContext);

    const cursor = `${CDN}/images/${selectedSite}/cursor.webp`;

    const [scriptLoaded, setScriptLoaded] = useState<boolean>(false);
    const [screenCapture, setScreeCapture] = useState<string | null>(null);

    const mainRef = useRef<HTMLDivElement | null>(null);
    const particleRef = useRef<HTMLDivElement | null>(null);

    const handleClick = () => {
        if (mainRef.current && screenCapture === null && scriptLoaded && selectedSite === 'construction')
            window.htmlToImage
                .toPng(mainRef.current)
                .then((dataUrl) => {
                    setScreeCapture(dataUrl);
                    setBizerkMode('construction');
                    if (buffers.analyzer && particleRef.current)
                        // eslint-disable-next-line no-new
                        new ParticleSystem(dataUrl, particleRef.current, buffers.analyzer);
                })
                .catch((error) => {
                    console.error('oops, something went wrong!', error);
                });
    };

    // this is for starting bizerk mode
    useEffect(() => {
        if (mainRef.current && screenCapture === null && bizerkMode === 'doubleClick')
            window.htmlToImage
                .toPng(mainRef.current)
                .then((dataUrl) => {
                    setScreeCapture(dataUrl);
                    if (buffers.analyzer && particleRef.current)
                        // eslint-disable-next-line no-new
                        new ParticleSystem(dataUrl, particleRef.current, buffers.analyzer);
                })
                .catch((error) => {
                    console.error('oops, something went wrong!', error);
                });
    }, [bizerkMode, buffers.analyzer, screenCapture]);

    return (
        <>
            <style jsx global>
                {`
                    body {
                        cursor: url('${cursor}'), auto;
                    }
                `}
            </style>

            <Script src="/scripts/html-to-image.js" onReady={() => setScriptLoaded(true)} />
            <PathProvider>
                <Main onClick={handleClick} id="main" ref={mainRef} className={fullScreen ? 'fullScreen' : ''}>
                    <HeaderComponent />
                    <Row1 id="content-row">
                        <LeftNavMenu1>
                            {SiteKeyValidator.options
                                .filter((s) => s !== 'gallery')
                                .map((s) => (
                                    <LeftNavButton1Wrapper key={s}>
                                        <LeftNavButton1>
                                            <Link href={`https://bettercallsal.${s}`} rel="noreferrer">
                                                <LeftNavItemCuck1>{s}</LeftNavItemCuck1>
                                            </Link>
                                        </LeftNavButton1>
                                    </LeftNavButton1Wrapper>
                                ))}

                            {Object.entries(extraLinks).map(([k, v]) => (
                                <LeftNavButton1Wrapper key={v}>
                                    <LeftNavButton1>
                                        <Link href={v} rel="noreferrer">
                                            <LeftNavItemCuck1>{k}</LeftNavItemCuck1>
                                        </Link>
                                    </LeftNavButton1>
                                </LeftNavButton1Wrapper>
                            ))}
                        </LeftNavMenu1>
                    </Row1>
                    <LawBreakers />
                </Main>
            </PathProvider>

            <div id="particles" ref={particleRef} />
        </>
    );
};

// const MainContainer = React.memo(MainContainerInner);

export default MainContainerInner;
