'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';
import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import Construction from '@/components/construction';
import { LawBreakers } from '@/components/footer';
import ParticleSystem from '@/components/glfx';
import HeaderComponent from '@/components/header';
import { ClientLeftNav } from '@/components/left-nav';
import { ClientList } from '@/components/list';
import RightNav from '@/components/right-nav';
import Unity from '@/components/unity';
import { Youtube } from '@/components/video';
import { useAnimationContext } from '@/providers/animations';
import { SoundContext } from '@/providers/audio-context';
import { usePathContext } from '@/providers/path';
import { useSiteContext } from '@/providers/sites';
import { Main, MiddleSection, Row } from '@/styles/sharedstyles';
import { BaseContentItem, SiteKey } from '@/types';
import { animateCounterBizerk, audioTween } from '@/utils/gsap';

const keyMap: Record<string, SiteKey> = {
    a: 'art',
    b: 'biz',
    f: 'fit',
    r: 'rocks',
    g: 'games',
    c: 'construction',
    y: 'gallery',
    w: 'world',
    t: 'wtf',
};

// DOC: the canvas cant be part of the component if we want to manage unityInstance and call Quit on it.
// instead of the nav and this component listen to location changes and cleanup accordingly,
// the clean is encapsulated in the unity component, but since cleanup is running when the component is unmounted,
// the Quit crashed unity. maybe use portals here. whatever. a single canvas placeholder is actually better.
const homeComponent = (site: SiteKey, visible: boolean, list: BaseContentItem[]) => {
    if (site === 'construction') return <Construction />;
    if (site === 'world') {
        if (visible) return <Youtube contentItem={list[0]} />;
        return <div></div>;
    }
    if (site === 'gallery') return <Unity />;
    return <ClientList visible={visible} />;
};

// DOC: the persistent chrome. route content renders into MiddleSection alongside the list, the
//  way <Outlet /> used to, so the grid stays mounted behind an open video.
const Shell: FC<{ children: React.ReactNode }> = ({ children }) => {
    const { selectedSite, siteMap, setSelectedSite, setFullScreen, fullScreen, contentMap } = useSiteContext();
    const { prevPath, setPrevPath, pathStack, setPathStack } = usePathContext();
    const { setBizerkMode, animateGrid, setAnimateGrid, animateNav, setAnimateNav } = useAnimationContext();
    const { buffers } = useContext(SoundContext);

    const pathname = usePathname();
    const site = siteMap[selectedSite];

    const [keyPressed, setKeyPressed] = useState<string | null>(null);
    const [hotKeyMode, setHotKeyMode] = useState<boolean>(true);
    const [aTween, setATween] = useState<gsap.core.Tween>();
    const [scriptLoaded, setScriptLoaded] = useState<boolean>(false);
    const [screenCapture, setScreeCapture] = useState<string | null>(null);

    const mainRef = useRef<HTMLDivElement | null>(null);
    const particleRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const downHandler = (ev: KeyboardEvent) => {
            setKeyPressed(ev.key);
        };

        const upHandler = () => {
            setTimeout(() => {
                setKeyPressed(null);
            }, 100);
        };

        window.addEventListener('keydown', downHandler);
        window.addEventListener('keyup', upHandler);

        return () => {
            window.removeEventListener('keydown', downHandler);
            window.removeEventListener('keyup', upHandler);
        };
    });

    useEffect(() => {
        if (keyPressed === 'Escape' && fullScreen) setFullScreen(false);
        if (keyPressed === ' ') setHotKeyMode(!hotKeyMode);
        if (keyPressed && keyMap[keyPressed] !== undefined)
            if (hotKeyMode) {
                setSelectedSite(keyMap[keyPressed]);
                setFullScreen(false);
                window.scrollTo(0, 0);
                document.body.scrollTo(0, 0);
                document.getElementById('content-row')?.scrollTo(0, 0);
                return;
            } else {
                let tween = aTween;
                if (aTween?.isActive()) {
                    buffers.stopAll();
                    aTween.kill();
                }
                tween = audioTween(buffers, siteMap[keyMap[keyPressed]]);
                setATween(tween);
                tween.play();
            }
    }, [fullScreen, keyPressed, selectedSite, setFullScreen, setSelectedSite]);

    useEffect(() => {
        if (selectedSite === 'biz' && prevPath !== '/' && pathname === '/') {
            const videoId = prevPath.split('/video/')[1];
            const elm = document.getElementById(videoId);
            if (elm)
                setTimeout(() => {
                    elm.scrollIntoView({
                        block: 'center',
                        inline: 'nearest',
                    });
                }, 100);
        } else {
            window.scrollTo(0, 0);
            document.body.scrollTo(0, 0);
            document.getElementById('content-row')?.scrollTo(0, 0);
        }

        if (pathname !== '/' && document.body.clientWidth < 768 && !pathname.startsWith('/category/')) setFullScreen(true);
        else if (document.body.clientWidth < 768) setFullScreen(false);

        if (prevPath !== pathname) setPrevPath(pathname);

        if (pathStack.length > 1) {
            const lastPath = pathStack[pathStack.length - 1];
            if (lastPath !== pathname) setPathStack([...pathStack, pathname]);
        } else setPathStack([...pathStack, pathname]);
    }, [pathname, prevPath, pathStack, selectedSite, setFullScreen, setPrevPath]);

    // DOC: replaces the per-route gtag calls the react-router loaders used to make.
    useEffect(() => {
        window.gtag?.('event', 'page_view', { page_location: pathname, page_title: document.title });
    }, [pathname]);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        // DOC: bizerk click
        const target = event.target as HTMLElement;
        if (mainRef.current && screenCapture === null && scriptLoaded && (selectedSite === 'construction' || target.id === 'bizerk-icon'))
            window.htmlToImage
                .toPng(mainRef.current)
                .then((dataUrl) => {
                    setScreeCapture(dataUrl);
                    setBizerkMode('on');
                    animateCounterBizerk(animateGrid, setAnimateGrid, false);
                    animateCounterBizerk(animateNav, setAnimateNav, false);
                    if (buffers.analyzer && particleRef.current) new ParticleSystem(dataUrl, particleRef.current, buffers.analyzer);
                })
                .catch((error) => {
                    console.error('oops, something went wrong!', error);
                });
    };

    return (
        <Main id="main" ref={mainRef} className={`${selectedSite} ${fullScreen ? 'fullScreen' : ''}`} onClick={handleClick}>
            <Script src="/scripts/html-to-image.js" onReady={() => setScriptLoaded(true)} />
            <HeaderComponent />
            <Row id="content-row" className={pathname === '/audio' ? 'audio' : ''}>
                {selectedSite !== 'gallery' && <ClientLeftNav />}
                <MiddleSection id="middle" className={fullScreen ? `${selectedSite} fullScreen` : selectedSite}>
                    <canvas id="unity-canvas" />
                    {homeComponent(selectedSite, pathname === '/', contentMap[selectedSite])}
                    {children}
                </MiddleSection>
                {selectedSite !== 'gallery' && <RightNav />}
            </Row>
            {selectedSite !== 'gallery' && <LawBreakers />}
            <div id="particles" ref={particleRef} />
        </Main>
    );
};

export default Shell;
