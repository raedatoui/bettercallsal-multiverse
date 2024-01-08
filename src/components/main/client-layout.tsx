import Script from 'next/script';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { createBrowserRouter, Outlet, redirect, RouteObject, RouterProvider, useLocation, useNavigate } from 'react-router-dom';
import ArtSlider from '@/components/art';
import Construction from '@/components/construction';
import Ecard from '@/components/e-cards';
import { LawBreakers } from '@/components/footer';
import ParticleSystem from '@/components/glfx';
import HeaderComponent from '@/components/header';
import { ClientLeftNav } from '@/components/left-nav';
import { ClientList } from '@/components/list';
import RightNav from '@/components/right-nav';
import Unity from '@/components/unity';
import { Video, Youtube } from '@/components/video';
import { config } from '@/constants';
import { useAnimationContext } from '@/providers/animations';
import { SoundContext } from '@/providers/audio-context';
import { PathProvider, usePathContext } from '@/providers/path';
import { useSiteContext } from '@/providers/sites';
import { AudioBoard, Main, MiddleSection, Row } from '@/styles/sharedstyles';
import { BaseContentItem, SiteKey } from '@/types';
import { findCategory, findContentFomStore } from '@/utils';
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

const homeComponent = (site: SiteKey, visible: boolean, list: BaseContentItem[]) => {
    if (site === 'construction') return <Construction />;
    if (site === 'world') {
        if (visible) return <Youtube contentItem={list[0]} />;
        return <div></div>;
    }
    if (site === 'gallery') return <Unity />;
    // DOC: the canvas cant be part of the component if we want to manage unityInstance and call Quit on it.
    // instead of the nav and this component listen to location changes and cleanup accordingly,
    // the clean is encapsulated in the unity component, but since cleanup is running when the component is unmounted,
    // the Quit crashed unity. maybe use portals here. whatever. a single canvas placeholder is actually better.
    return <ClientList visible={visible} />;
};

const ClientLayout = () => {
    const { selectedSite, siteMap, setSelectedSite, setFullScreen, fullScreen, contentMap } = useSiteContext();
    const { prevPath, setPrevPath } = usePathContext();
    const { buffers } = useContext(SoundContext);
    const navigate = useNavigate();
    const path = useLocation().pathname;
    const location = useLocation();
    const [keyPressed, setKeyPressed] = useState<string | null>(null);
    const [hotKeyMode, setHotKeyMode] = useState<boolean>(true);

    const [aTween, setATween] = useState<gsap.core.Tween>();

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
    }, [fullScreen, keyPressed, navigate, selectedSite, setFullScreen, setSelectedSite]);

    useEffect(() => {
        if (selectedSite === 'biz' && prevPath !== '/' && location.pathname === '/') {
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

        if (location.pathname !== '/' && document.body.clientWidth < 768 && !location.pathname.startsWith('/category/')) setFullScreen(true);
        else if (document.body.clientWidth < 768) setFullScreen(false);

        setPrevPath(location.pathname);
    }, [location, prevPath, selectedSite, setFullScreen, setPrevPath]);

    return (
        <>
            <HeaderComponent />
            <Row id="content-row" className={path === '/audio' ? 'audio' : ''}>
                {selectedSite !== 'gallery' && <ClientLeftNav />}
                <MiddleSection id="middle" className={fullScreen ? `${selectedSite} fullScreen` : selectedSite}>
                    <canvas id="unity-canvas" />
                    {homeComponent(selectedSite, location.pathname === '/', contentMap[selectedSite])}
                    <Outlet />
                </MiddleSection>
                {selectedSite !== 'gallery' && <RightNav />}
            </Row>
            {selectedSite !== 'gallery' && <LawBreakers />}
        </>
    );
};

const ClientLayoutWrapper = () => {
    const { selectedSite, fullScreen, contentMap, siteMap } = useSiteContext();
    const site = siteMap[selectedSite];

    const [scriptLoaded, setScriptLoaded] = useState<boolean>(false);
    const [screenCapture, setScreeCapture] = useState<string | null>(null);

    const { setBizerkMode, animateGrid, setAnimateGrid, animateNav, setAnimateNav } = useAnimationContext();
    const { buffers } = useContext(SoundContext);

    const mainRef = useRef<HTMLDivElement | null>(null);
    const particleRef = useRef<HTMLDivElement | null>(null);

    const trackContent = (url: string, seg: string) => {
        const pathName = url.split(window.location.origin)[1];
        const contentId = pathName.split(`/${seg}/`)[1];
        const content = findContentFomStore(contentMap, contentId);
        if (content)
            window.gtag?.('event', 'page_view', {
                page_title: content?.name,
                page_location: pathName,
            });
    };

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        // DOC: bizerk click
        // TODO: MOVE THIS CLICK OUT OF HERE?!
        const target = event.target as HTMLElement;
        if (mainRef.current && screenCapture === null && scriptLoaded && (selectedSite === 'construction' || target.id === 'bizerk-icon'))
            window.htmlToImage
                .toPng(mainRef.current)
                .then((dataUrl) => {
                    setScreeCapture(dataUrl);
                    setBizerkMode('on');
                    animateCounterBizerk(animateGrid, setAnimateGrid, false);
                    animateCounterBizerk(animateNav, setAnimateNav, false);
                    if (buffers.analyzer && particleRef.current)
                        // eslint-disable-next-line no-new
                        new ParticleSystem(dataUrl, particleRef.current, buffers.analyzer);
                })
                .catch((error) => {
                    console.error('oops, something went wrong!', error);
                });
    };

    const route: RouteObject = {
        path: '/',
        element: <ClientLayout />,
        children: [
            {
                path: 'e-cards',
                element: <Ecard />,
                loader: () => {
                    window.gtag?.('event', 'page_view', {
                        page_title: 'E-Cards',
                        page_location: '/e-cards',
                    });
                    return true;
                },
            },
            {
                path: 'game/:gameId',
                element: <Unity />,
                loader: ({ request }) => {
                    trackContent(request.url, 'game');
                    return true;
                },
            },
            {
                path: 'video/:videoId',
                element: <Video />,
                loader: ({ request }) => {
                    trackContent(request.url, 'video');
                    return true;
                },
            },
            {
                path: 'art/:artId',
                element: <ArtSlider />,
                loader: ({ request }) => {
                    trackContent(request.url, 'art');
                    return true;
                },
            },
            {
                path: 'category/:category',
                element: <ClientList visible />,
                loader: ({ request }) => {
                    const pathName = request.url.split(window.location.origin)[1];
                    const categoryId = pathName.split('/category/')[1];
                    const category = findCategory(site, categoryId);
                    if (category)
                        window.gtag?.('event', 'page_view', {
                            page_title: category.name,
                            page_location: pathName,
                        });
                    return true;
                },
            },
            {
                path: '*',
                element: <div></div>,
                loader: () => {
                    return redirect('/', 301);
                },
            },
        ],
    };
    if (config.experiments)
        route.children?.push({
            path: 'audio',
            element: <AudioBoard />,
        });

    const router = createBrowserRouter([route]);

    return (
        <PathProvider>
            <Main id="main" ref={mainRef} className={`${selectedSite} ${fullScreen ? 'fullScreen' : ''}`} onClick={handleClick}>
                <Script src="/scripts/html-to-image.js" onReady={() => setScriptLoaded(true)} />
                <RouterProvider router={router} />
                <div id="particles" ref={particleRef} />
            </Main>
        </PathProvider>
    );
};

export default ClientLayoutWrapper;
