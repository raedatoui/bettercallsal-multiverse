/* eslint-disable max-len */
import fsPromises from 'fs/promises';
import path from 'path';
import { GetStaticPropsResult } from 'next';
import Head from 'next/head';
import React, { FC } from 'react';
import LawBreakers from '@/components/footer';
import { StandaloneHeaderComponent } from '@/components/header';
import MainContainer from '@/components/main';
import { defaultSiteMap } from '@/constants';
import { AnimationsProvider } from '@/providers/animations';
import { SoundProvider } from '@/providers/audio-context';
import { SitesDataProvider } from '@/providers/sites';
import { WindowSizeProvider } from '@/providers/window-size';
import Fonts from '@/styles/fonts';
import GlobalStyle from '@/styles/globalstyles';
import Skeleton from '@/styles/skeleton';
import {
    BaseContentItem,
    BaseContentListValidator,
    GameContentItem,
    GameContentListValidator,
    SiteKey,
    SiteKeyValidator
} from '@/types';

interface PageProps {
    defaultSite: SiteKey,
    defaultContent: (BaseContentItem | GameContentItem)[]
}

export async function getStaticProps(): Promise<GetStaticPropsResult<PageProps>> {
    const defaultSite = SiteKeyValidator.parse(process.env.selectedSite);
    let defaultContent: (BaseContentItem | GameContentItem)[] = [];
    if (defaultSite !== 'construction') {
        const filePath = path.join(process.cwd(), `content/content-${defaultSite}.json`);
        const jsonData = await fsPromises.readFile(filePath);
        const list = JSON.parse(jsonData.toString());
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
                <title>{site?.metaTitle}</title>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="keywords" content={site?.metaKeywords} />
                <meta name="description" content={site?.metaDescription} />
                <meta name="theme-color" content="#eae41f" />
            </Head>
            <Skeleton />
            <GlobalStyle />
            <Fonts />
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
