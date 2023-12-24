import Script from 'next/script';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import ArtSlider from '@/components/art';
import Ecard from '@/components/e-cards';
import LawBreakers from '@/components/footer';
import ParticleSystem from '@/components/glfx';
import HeaderComponent from '@/components/header';
import { ClientList } from '@/components/list';
import ClientLayout from '@/components/main/client-layout';
import ServerLayout from '@/components/main/server-layout';
import Unity from '@/components/unity';
import { Video } from '@/components/video';
import { CDN } from '@/constants';
import { useAnimationContext } from '@/providers/animations';
import { SoundContext } from '@/providers/audio-context';
import { PathProvider } from '@/providers/path';
import { useSiteContext } from '@/providers/sites';
import { Main } from '@/styles/sharedstyles';
import { Router, SiteKey, SiteKeyValidator } from '@/types';
import { findCategory, findContentFomStore, picker, animateCounterBizerk } from '@/utils';

const MainContainerInner = () => {
    const { selectedSite, fullScreen, contentMap, siteMap } = useSiteContext();
    const site = siteMap[selectedSite];
    const { setBizerkMode, animateGrid, setAnimateGrid, animateNav, setAnimateNav } = useAnimationContext();
    const { buffers } = useContext(SoundContext);

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

    const createRouter = (): Router =>
        createBrowserRouter([
            {
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
                        element: <div>OOPS</div>,
                    },
                ],
            },
        ]);

    const cur = selectedSite === 'wtf' ? picker<SiteKey>(SiteKeyValidator.options.filter((s) => s !== 'wtf')) : selectedSite;
    const cursor = `${CDN}/images/${cur}/cursor.webp`;

    const [router, setRouter] = useState<Router | null>(null);
    const [scriptLoaded, setScriptLoaded] = useState<boolean>(false);
    const [screenCapture, setScreeCapture] = useState<string | null>(null);

    const mainRef = useRef<HTMLDivElement | null>(null);
    const particleRef = useRef<HTMLDivElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        // DOC: bizerk click
        const target = event.target as HTMLElement;
        if (mainRef.current && screenCapture === null && scriptLoaded && (selectedSite === 'construction' || target.id === 'bizerk-icon'))
            window.htmlToImage
                .toPng(mainRef.current)
                .then((dataUrl) => {
                    setScreeCapture(dataUrl);
                    setBizerkMode('on');
                    animateCounterBizerk(animateGrid, setAnimateGrid);
                    animateCounterBizerk(animateNav, setAnimateNav);
                    if (buffers.analyzer && particleRef.current)
                        // eslint-disable-next-line no-new
                        new ParticleSystem(dataUrl, particleRef.current, buffers.analyzer);
                })
                .catch((error) => {
                    console.error('oops, something went wrong!', error);
                });
    };

    useEffect(() => {
        if (typeof window !== 'undefined') setRouter(createRouter());
    }, [contentMap, selectedSite]);

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
                <Main onClick={handleClick} id="main" ref={mainRef} className={`${selectedSite} ${fullScreen ? 'fullScreen' : ''}`}>
                    <HeaderComponent />
                    {router ? <RouterProvider router={router} /> : <ServerLayout selectedSite={selectedSite} fullScreen={fullScreen} />}

                    {selectedSite !== 'gallery' && <LawBreakers />}
                </Main>
            </PathProvider>

            <div id="particles" ref={particleRef} />
        </>
    );
};

// const MainContainer = React.memo(MainContainerInner);

export default MainContainerInner;
