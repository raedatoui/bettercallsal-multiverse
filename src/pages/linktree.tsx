/* eslint-disable max-len */
import fsPromises from 'fs/promises';
import path from 'path';
import { GetStaticPropsResult } from 'next';
import Head from 'next/head';
import Script from 'next/script';
import React, { FC } from 'react';
import { DefaultTheme, ThemeProvider } from 'styled-components';
import MainContainer from '@/components/main/linktree-index';
import { defaultSiteMap } from '@/constants';
import { AnimationsProvider, BizerkProvider } from '@/providers/animations';
import { SoundProvider } from '@/providers/audio-context';
import { SitesDataProvider } from '@/providers/sites';
import { WindowSizeProvider } from '@/providers/window-size';
import Fonts from '@/styles/fonts';
import { GlobalStyle } from '@/styles/globalstyles';
import Skeleton from '@/styles/skeleton';
import { BaseContentItem, BaseContentListValidator, GameContentItem, GameContentListValidator, SiteKey, SiteKeyValidator, } from '@/types';

interface PageProps {
    defaultSite: SiteKey,
    defaultContent: (BaseContentItem | GameContentItem)[],
}

const theme: DefaultTheme = {
    colors: {
        primary: '#eae41f',
        secondary: '#0070f3',
    },
};

export async function getStaticProps(): Promise<GetStaticPropsResult<PageProps>> {
    const defaultSite = SiteKeyValidator.parse(process.env.selectedSite);
    let defaultContent: (BaseContentItem | GameContentItem)[] = [];
    if (defaultSite !== 'construction') {
        const filePath = path.join(process.cwd(), `content/content-${defaultSite}.json`);
        const jsonData = await fsPromises.readFile(filePath);
        const list = JSON.parse(jsonData.toString());
        if (defaultSite === 'games' || defaultSite === 'gallery')
            defaultContent = GameContentListValidator.parse(list.items);
        else
            defaultContent = BaseContentListValidator.parse(list.items);
    }
    const site = defaultSiteMap[defaultSite];
    if (site.leftNav.video)
        defaultContent.push({
            name: site.leftNav.text,
            contentId: site.leftNav.video,
            contentType: 'youtube',
            thumb: '',
            category: '',
            display: false
        });

    site.leftNav.items.forEach(i => {
        if (i.video)
            defaultContent.push({
                name: i.name,
                contentId: i.video,
                contentType: 'youtube',
                thumb: '',
                category: '',
                display: false
            });
    });

    return {
        props: {
            defaultSite,
            defaultContent,
        },
    };
}

const Home:FC<PageProps> = ({ defaultSite, defaultContent }) => {
    const site = defaultSiteMap[defaultSite];
    return (
        <>
            <Head>
                <title>{site?.metaTitle}</title>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="keywords" content={site.metaKeywords} />
                <meta name="description" content={site.metaDescription} />
                <meta name="theme-color" content="#F13400" />
                <link rel="manifest" href={`${process.env.cdnUrl}/favicons/${process.env.selectedSite}/manifest.webmanifest`} />

                <link rel="apple-touch-icon" sizes="72x72" href={`${process.env.cdnUrl}/favicons/${process.env.selectedSite}/72x72.jpg`} />
                <link rel="apple-touch-icon" sizes="144x144" href={`${process.env.cdnUrl}/favicons/${process.env.selectedSite}/144x144.jpg`} />
                <link rel="apple-touch-icon" sizes="256x256" href={`${process.env.cdnUrl}/favicons/${process.env.selectedSite}/256x256.jpg`} />
                <link rel="apple-touch-icon" sizes="512x512" href={`${process.env.cdnUrl}/favicons/${process.env.selectedSite}/512x512.jpg`} />
                <meta name="apple-mobile-web-app-title" content={process.env.selectedSite} />

                <link rel="icon" type="image/jpg" sizes="192x192" href={`${process.env.cdnUrl}/favicons/${process.env.selectedSite}/192x192.jpg`} />
                <link rel="icon" type="image/jpg" sizes="96x96" href={`${process.env.cdnUrl}/favicons/${process.env.selectedSite}/96x96.jpg`} />
                <link rel="icon" type="image/jpg" sizes="32x32" href={`${process.env.cdnUrl}/favicons/${process.env.selectedSite}/32x32.jpg`} />

                <meta name="msapplication-TileColor" content="#F13400" />
                <meta name="msapplication-TileImage" content={`${process.env.cdnUrl}/favicons/${process.env.selectedSite}/144x144.jpg`} />

                <meta property="og:url" content={`https://bettercallsal.${process.env.selectedSite}`} />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Better Call Sal" />
                <meta property="og:description" content={site.metaDescription} />
                <meta property="og:image" content={`${process.env.cdnUrl}/favicons/${process.env.selectedSite}/512x512.jpg`} />
            </Head>

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
            <ThemeProvider theme={theme}>
                <Skeleton />
                <GlobalStyle />
                <Fonts />
                <SitesDataProvider defaultSite={defaultSite} defaultContent={defaultContent} defaultSiteMap={defaultSiteMap}>
                    <BizerkProvider>
                        <SoundProvider>
                            <WindowSizeProvider>
                                <AnimationsProvider>
                                    <MainContainer />
                                </AnimationsProvider>
                            </WindowSizeProvider>
                        </SoundProvider>
                    </BizerkProvider>
                </SitesDataProvider>
            </ThemeProvider>

            <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${site.gaTag}`} />
            { process.env.gtagEnabled && (
                <Script
                    id="google-analytics"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `
                      window.dataLayer = window.dataLayer || [];
                      function gtag(){dataLayer.push(arguments);}
                      gtag('js', new Date());
                      gtag('config', '${site.gaTag}', {
                      page_path: window.location.pathname,
                      });
                    `,
                    }}
                />
            ) }
        </>
    );
};

export default Home;
