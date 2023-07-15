import React from 'react';
import Script from 'next/script';
import path from 'path';
import fsPromises from 'fs/promises';
import {
    BaseContentItem, BaseContentListValidator, GameContentItem, GameContentListValidator,
    SiteKeyValidator
} from '@/types';
import { defaultSiteMap } from '@/constants';
import { SitesDataProvider } from '@/providers/sites';
import GlobalStyle from '@/styles/globalstyles';
import Fonts from '@/styles/fonts';
import Skeleton from '@/styles/skeleton';
import Theme from '@/styles/theme';
import { SoundProvider } from '@/providers/audio-context';
import { WindowSizeProvider } from '@/providers/window-size';
import { MainContainer } from '@/components/main';
import { AnimationsProvider, BizerkProvider } from '@/providers/animations';
import { HeaderComponent } from '@/components/header';
import { Row } from '@/styles/sharedstyles';
import { LeftNav } from '@/components/left-nav';
import { RightNav } from '@/components/right-nav';
import { LawBreakers } from '@/components/footer';

const defaultSite = SiteKeyValidator.parse(process.env.selectedSite);
const site = defaultSiteMap[defaultSite];
let content: (BaseContentItem | GameContentItem)[] = [];
if (defaultSite !== 'construction') {
    const filePath = path.join(process.cwd(), `content/content-${defaultSite}.json`);
    const jsonData = await fsPromises.readFile(filePath);
    const list = JSON.parse(jsonData.toString());
    if (defaultSite === 'games' || defaultSite === 'gallery')
        content = GameContentListValidator.parse(list.items);
    else
        content = BaseContentListValidator.parse(list.items);
}

export const metadata = {
    title: site.metaTitle,
    description: site.metaDescription,
};

// eslint-disable-next-line react/function-component-definition
export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <head>
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
                <Skeleton />
                <GlobalStyle />
                <Fonts />
            </head>
            <body>
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
                <Theme>
                    <SitesDataProvider defaultSite={defaultSite} defaultContent={content} defaultSiteMap={defaultSiteMap}>
                        <SoundProvider>
                            <WindowSizeProvider>
                                <MainContainer>
                                    <AnimationsProvider>
                                        <BizerkProvider>
                                            <>
                                                <HeaderComponent />
                                                <Row id="content-row">
                                                    { defaultSite !== 'gallery' && <LeftNav /> }
                                                    {children}
                                                    { defaultSite !== 'gallery' && <RightNav /> }
                                                </Row>
                                                { defaultSite !== 'gallery' && <LawBreakers /> }
                                            </>
                                        </BizerkProvider>
                                    </AnimationsProvider>
                                </MainContainer>
                            </WindowSizeProvider>
                        </SoundProvider>
                    </SitesDataProvider>
                </Theme>

                { process.env.gtagEnabled && (
                    <Script
                        strategy="afterInteractive"
                        src={`https://www.googletagmanager.com/gtag/js?id=${site.gaTag}`}
                    />
                )}

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
            </body>
        </html>
    );
}
