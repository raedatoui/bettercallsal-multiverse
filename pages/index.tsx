/* eslint-disable max-len */
import React, { FC } from 'react';
import Head from 'next/head';
import { LeftNav } from 'src/components/left-nav';
import { RightNav } from 'src/components/right-nav';
import { Middle } from 'src/components/middle';
import Script from 'next/script';
import { LawBreakers } from 'src/components/footer';
import { SitesDataProvider } from 'src/providers/sites';
import { AnimationsProvider } from 'src/providers/animations';
import { SoundProvider } from 'src/providers/audio-context';
import { WindowSizeProvider } from 'src/providers/window-size';
import {
    BaseContentItem,
    BaseContentListValidator,
    GameContentItem,
    GameContentListValidator,
    SiteKey,
    SiteKeyValidator
} from 'src/types';
import { GetStaticPropsResult } from 'next';
import { Row } from 'src/styles/sharedstyles';
import { MainContainer } from 'src/components/main';
import { HeaderComponent } from 'src/components/header';
import { defaultSiteMap } from 'src/constants';

interface PageProps {
    defaultSite: SiteKey,
    defaultContent: (BaseContentItem | GameContentItem)[]
}

export async function getStaticProps(): Promise<GetStaticPropsResult<PageProps>> {
    const defaultSite = SiteKeyValidator.parse(process.env.selectedSite);
    let defaultContent: (BaseContentItem | GameContentItem)[] = [];
    if (defaultSite !== 'construction') {
        const list = await import(`../content/content-${defaultSite}.json`);

        if (defaultSite === 'games' || defaultSite === 'gallery')
            defaultContent = GameContentListValidator.parse(list.items);
        else
            defaultContent = BaseContentListValidator.parse(list.items);
    }
    return {
        props: {
            defaultSite,
            defaultContent
        },
    };
}

const Home:FC<PageProps> = ({ defaultSite, defaultContent }) => {
    const selectedSite = SiteKeyValidator.parse(process.env.selectedSite);
    const site = defaultSiteMap[selectedSite];

    return (
        <>
            <Head>
                <title>{site?.metaTitle}</title>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="keywords" content={site?.metaKeywords} />
                <meta name="description" content={site?.metaDescription} />
                <meta name="theme-color" content="#F13400" />
                {/* <link rel="apple-touch-icon" sizes="57x57" href="https://storage.googleapis.com/www.bettercallsal.biz/favicons/apple-icon-57x57.png" /> */}
                {/* <link rel="apple-touch-icon" sizes="60x60" href="https://storage.googleapis.com/www.bettercallsal.biz/favicons/apple-icon-60x60.png" /> */}
                {/* <link rel="apple-touch-icon" sizes="72x72" href="https://storage.googleapis.com/www.bettercallsal.biz/favicons/apple-icon-72x72.png" /> */}
                {/* <link rel="apple-touch-icon" sizes="76x76" href="https://storage.googleapis.com/www.bettercallsal.biz/favicons/apple-icon-76x76.png" /> */}
                {/* <link rel="apple-touch-icon" sizes="114x114" href="https://storage.googleapis.com/www.bettercallsal.biz/favicons/apple-icon-114x114.png" /> */}
                {/* <link rel="apple-touch-icon" sizes="120x120" href="https://storage.googleapis.com/www.bettercallsal.biz/favicons/apple-icon-120x120.png" /> */}
                {/* <link rel="apple-touch-icon" sizes="144x144" href="https://storage.googleapis.com/www.bettercallsal.biz/favicons/apple-icon-144x144.png" /> */}
                {/* <link rel="apple-touch-icon" sizes="152x152" href="https://storage.googleapis.com/www.bettercallsal.biz/favicons/apple-icon-152x152.png" /> */}
                {/* <link rel="apple-touch-icon" sizes="180x180" href="https://storage.googleapis.com/www.bettercallsal.biz/favicons/apple-icon-180x180.png" /> */}
                {/* <link rel="icon" type="image/png" sizes="192x192" href="https://storage.googleapis.com/www.bettercallsal.biz/favicons/android-icon-192x192.png" /> */}
                {/* <link rel="icon" type="image/png" sizes="32x32" href="https://storage.googleapis.com/www.bettercallsal.biz/favicons/favicon-32x32.png" /> */}
                {/* <link rel="icon" type="image/png" sizes="96x96" href="https://storage.googleapis.com/www.bettercallsal.biz/favicons/favicon-96x96.png" /> */}
                {/* <link rel="icon" type="image/png" sizes="16x16" href="https://storage.googleapis.com/www.bettercallsal.biz/favicons/favicon-16x16.png" /> */}
                {/* <link rel="manifest" href="https://storage.googleapis.com/www.bettercallsal.biz/favicons/manifest.json" /> */}
                {/* <meta name="msapplication-TileColor" content="#FD0000" /> */}
                {/* <meta name="msapplication-TileImage" content="https://storage.googleapis.com/www.bettercallsal.biz/favicons/ms-icon-144x144.png" /> */}
                {/* <meta name="theme-color" content="#FD0000" /> */}
                {/* <meta property="og:url" content="https://bettercallsal.biz" /> */}
                {/* <meta property="og:type" content="website" /> */}
                {/* <meta property="og:title" content="Better Call Sal" /> */}
                {/* <meta property="og:description" content="Better Call Sal For All Your Audio Needs" /> */}
                {/* <meta property="og:image" content="https://storage.googleapis.com/www.bettercallsal.biz/images/og.png" /> */}
            </Head>
            <SitesDataProvider defaultSite={defaultSite} defaultContent={defaultContent} defaultSiteMap={defaultSiteMap}>
                <SoundProvider>
                    <WindowSizeProvider>
                        <AnimationsProvider>
                            <MainContainer>
                                <Script
                                    id="youtube-iframe"
                                    src="https://www.youtube.com/iframe_api"
                                />
                                <Script
                                    id="vimeo-player"
                                    src="https://player.vimeo.com/api/player.js"
                                />
                                <HeaderComponent />
                                <Row id="content-row">
                                    { defaultSite !== 'gallery' && <LeftNav /> }
                                    <Middle />
                                    { defaultSite !== 'gallery' && <RightNav /> }
                                </Row>
                                {/* eslint-disable-next-line react/jsx-no-useless-fragment */}
                                <>
                                    { defaultSite !== 'gallery' && <LawBreakers /> }
                                </>
                                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" id="text-effect">
                                    <defs>
                                        <filter id="squiggly-0">
                                            <feTurbulence id="turbulence" baseFrequency="0.02" numOctaves="3" result="noise" seed="0" />
                                            <feDisplacementMap id="displacement" in="SourceGraphic" in2="noise" scale="6" />
                                        </filter>
                                        <filter id="squiggly-1">
                                            <feTurbulence id="turbulence" baseFrequency="0.02" numOctaves="3" result="noise" seed="1" />
                                            <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" />
                                        </filter>

                                        <filter id="squiggly-2">
                                            <feTurbulence id="turbulence" baseFrequency="0.02" numOctaves="3" result="noise" seed="2" />
                                            <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" />
                                        </filter>
                                        <filter id="squiggly-3">
                                            <feTurbulence id="turbulence" baseFrequency="0.02" numOctaves="3" result="noise" seed="3" />
                                            <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" />
                                        </filter>

                                        <filter id="squiggly-4">
                                            <feTurbulence id="turbulence" baseFrequency="0.02" numOctaves="3" result="noise" seed="4" />
                                            <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" />
                                        </filter>
                                    </defs>
                                </svg>
                            </MainContainer>
                        </AnimationsProvider>
                    </WindowSizeProvider>
                </SoundProvider>
            </SitesDataProvider>
        </>
    );
};

export default Home;
