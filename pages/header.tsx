/* eslint-disable max-len */
import React, { FC } from 'react';
import Head from 'next/head';
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
import { MainContainer } from 'src/components/main';
import { StandaloneHeaderComponent } from 'src/components/header';
import { defaultSiteMap } from 'src/constants';
import { LawBreakers } from 'src/components/footer';

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
    const selectedSite = SiteKeyValidator.parse(process.env.selectedSite);
    const site = defaultSiteMap[selectedSite];

    return (
        <>
            <Head>
                <title>{site.metaTitle}</title>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="keywords" content={site.metaKeywords} />
                <meta name="description" content={site.metaDescription} />
                <meta name="theme-color" content="#eae41f" />
            </Head>
            <SitesDataProvider defaultSite={defaultSite} defaultContent={defaultContent} defaultSiteMap={defaultSiteMap}>
                <WindowSizeProvider>
                    <AnimationsProvider>
                        <SoundProvider>
                            <MainContainer>
                                <StandaloneHeaderComponent />
                                <LawBreakers />
                            </MainContainer>
                        </SoundProvider>
                    </AnimationsProvider>
                </WindowSizeProvider>
            </SitesDataProvider>
        </>
    );
};

export default Home;
