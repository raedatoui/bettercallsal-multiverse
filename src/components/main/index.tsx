import Script from 'next/script';
import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ArtSlider from '@/components/art';
import Construction from '@/components/construction';
import Ecard from '@/components/e-cards';
import LawBreakers from '@/components/footer';
import GalleryLanding from '@/components/gallery';
import ParticleSystem from '@/components/glfx';
import HeaderComponent from '@/components/header';
import { ServerLeftNav } from '@/components/left-nav';
import { ClientList, ServerList } from '@/components/list';
import Layout from '@/components/main/layout';
import RightNav from '@/components/right-nav';
import Unity from '@/components/unity';
import Video from '@/components/video';
import { CDN } from '@/constants';
import { useBizerkContext } from '@/providers/animations';
import { SoundContext } from '@/providers/audio-context';
import { PathProvider } from '@/providers/path';
import { useSiteContext } from '@/providers/sites';
import { Main, MiddleSection, Row } from '@/styles/sharedstyles';
import { Router, SiteKey } from '@/types';
import { findCategory, findContentFomStore } from '@/utils/find';

interface Props {}

const homeComponent = (site: SiteKey) => {
    if (site === 'construction')
        return <Construction />;
    if (site === 'gallery')
        return <GalleryLanding />;
    return <ServerList />;
};

const RouterLessRow: FC<{ selectedSite: SiteKey, fullScreen: boolean }> = ({ selectedSite, fullScreen }) => (
    <Row id="content-row" suppressHydrationWarning>
        { selectedSite !== 'gallery' && <ServerLeftNav /> }
        <MiddleSection id="middle" className={fullScreen ? `${selectedSite} fullScreen` : selectedSite}>
            { homeComponent(selectedSite) }
        </MiddleSection>
        { selectedSite !== 'gallery' && <RightNav /> }
    </Row>
);

const MainContainerInner: FC<Props> = () => {
    const { selectedSite, fullScreen, contentMap, siteMap } = useSiteContext();
    const site = siteMap[selectedSite];
    const { bizerkMode, setBizerkMode } = useBizerkContext();
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

    const createRouter = (): Router => createBrowserRouter([
        {
            path: '/',
            element: <Layout />,
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
                    }
                },
                {
                    path: 'game/:gameId',
                    element: <Unity visible />,
                    loader: ({ request }) => {
                        trackContent(request.url, 'game');
                        return true;
                    }
                },
                {
                    path: 'video/:videoId',
                    element: <Video />,
                    loader: ({ request }) => {
                        trackContent(request.url, 'video');
                        return true;
                    }
                },
                {
                    path: 'art/:artId',
                    element: <ArtSlider />,
                    loader: ({ request }) => {
                        trackContent(request.url, 'art');
                        return true;
                    }
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
                    }
                },
            ]
        }
    ]);

    const cursor = `${CDN}/images/${selectedSite}/cursor.webp`;

    const [scriptLoaded, setScriptLoaded] = useState<boolean>(false);
    const [screenCapture, setScreeCapture] = useState<string | null >(null);

    const mainRef = useRef<HTMLDivElement | null>(null);
    const particleRef = useRef<HTMLDivElement | null>(null);

    const handleClick = () => {
        if (mainRef.current && screenCapture === null && scriptLoaded && selectedSite === 'construction')
            window.htmlToImage.toPng(mainRef.current)
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
            window.htmlToImage.toPng(mainRef.current)
                .then((dataUrl) => {
                    setScreeCapture(dataUrl);
                    if (buffers.analyzer && particleRef.current)
                        // eslint-disable-next-line no-new
                        new ParticleSystem(dataUrl, particleRef.current, buffers.analyzer);

                })
                .catch((error) => {
                    console.error('oops, something went wrong!', error);
                });
        return () => {};
    }, [bizerkMode, buffers.analyzer, screenCapture]);

    const [router, setRouter] = useState<Router | null>(null);
    useEffect(() => {
        if (typeof window !== 'undefined')
            setRouter(createRouter());
    }, [contentMap, selectedSite]);

    return (
        <>
            <style jsx global>{`
                body {
                  cursor: url("${cursor}"), auto;
                }
              `}
            </style>

            <Script
                src="/scripts/html-to-image.js"
                onReady={() =>
                    setScriptLoaded(true)}
            />
            <PathProvider>
                <Main
                    onClick={handleClick}
                    id="main"
                    ref={mainRef}
                    className={fullScreen ? 'fullScreen' : ''}
                >
                    <HeaderComponent />
                    { router ? <RouterProvider router={router} /> : <RouterLessRow selectedSite={selectedSite} fullScreen={fullScreen} /> }

                    { selectedSite !== 'gallery' && <LawBreakers /> }
                </Main>
            </PathProvider>

            <div id="particles" ref={particleRef} />
        </>
    );
};

// const MainContainer = React.memo(MainContainerInner);

export default MainContainerInner;
