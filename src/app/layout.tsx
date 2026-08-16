import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import React from 'react';
import { defaultSiteMap } from '@/constants';
import { buildSite, readSiteContent } from '@/lib/content';
import Providers from './providers';
import StyledRegistry from './styled-registry';

const key = buildSite();
const site = defaultSiteMap[key];
const cdn = process.env.cdnUrl;

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    themeColor: '#F13400',
};

export const metadata: Metadata = {
    title: site.metaTitle,
    description: site.metaDescription,
    keywords: site.metaKeywords,
    manifest: `${cdn}/favicons/${key}/manifest.webmanifest`,
    appleWebApp: {
        title: key,
    },
    icons: {
        icon: [
            { url: `${cdn}/favicons/${key}/192x192.jpg`, sizes: '192x192', type: 'image/jpg' },
            { url: `${cdn}/favicons/${key}/96x96.jpg`, sizes: '96x96', type: 'image/jpg' },
            { url: `${cdn}/favicons/${key}/32x32.jpg`, sizes: '32x32', type: 'image/jpg' },
        ],
        apple: [
            { url: `${cdn}/favicons/${key}/72x72.jpg`, sizes: '72x72' },
            { url: `${cdn}/favicons/${key}/144x144.jpg`, sizes: '144x144' },
            { url: `${cdn}/favicons/${key}/256x256.jpg`, sizes: '256x256' },
            { url: `${cdn}/favicons/${key}/512x512.jpg`, sizes: '512x512' },
        ],
    },
    openGraph: {
        url: `https://bettercallsal.${key}`,
        type: 'website',
        title: 'Better Call Sal',
        description: site.metaDescription,
        images: [`${cdn}/favicons/${key}/512x512.jpg`],
    },
    other: {
        'msapplication-TileColor': '#F13400',
        'msapplication-TileImage': `${cdn}/favicons/${key}/144x144.jpg`,
    },
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
    const defaultContent = await readSiteContent(key);

    return (
        <html lang="en">
            <body>
                <StyledRegistry>
                    <Providers defaultSite={key} defaultContent={defaultContent}>
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
                        {children}
                    </Providers>
                </StyledRegistry>

                <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${site.gaTag}`} />
                {process.env.gtagEnabled === 'true' && (
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
                )}
            </body>
        </html>
    );
};

export default RootLayout;
