/* eslint-disable max-len */
import React, { FC, useContext } from 'react';
import Head from 'next/head';
import { LeftNav } from 'src/components/left-nav';
import { RightNav } from 'src/components/right-nav';
import { Middle } from 'src/components/middle';
import Script from 'next/script';
import { LawBreakers } from 'src/components/footer';
import { SiteContext, SitesDataProvider } from 'src/providers/sites';
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

interface PageProps {
    defaultSite: SiteKey,
    defaultContent: (BaseContentItem | GameContentItem)[]
}

export async function getStaticProps(): Promise<GetStaticPropsResult<PageProps>> {
    const defaultSite = SiteKeyValidator.parse(process.env.selectedSite);
    let defaultContent: (BaseContentItem | GameContentItem)[] = [];
    if (defaultSite !== 'construction') {
        const list = await import(`../content/content-${defaultSite}.json`);
        if (defaultSite === 'games')
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
    const { siteMap, selectedSite } = useContext(SiteContext);
    const site = siteMap[selectedSite];
    return (
        <>
            <Head>
                <title>{site.metaTitle}</title>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="keywords" content={site.metaKeywords} />
                <meta name="description" content={site.metaDescription} />
                <meta name="theme-color" content="#eae41f" />
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
            <SitesDataProvider defaultSite={defaultSite} defaultContent={defaultContent}>
                <AnimationsProvider>
                    <SoundProvider>
                        <WindowSizeProvider>
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
                                    <LeftNav />
                                    <Middle />
                                    <RightNav />
                                </Row>
                                <LawBreakers />
                            </MainContainer>
                        </WindowSizeProvider>
                    </SoundProvider>
                </AnimationsProvider>
            </SitesDataProvider>
        </>
    );
};

export default Home;
