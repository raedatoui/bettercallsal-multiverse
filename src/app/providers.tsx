'use client';

import React, { FC } from 'react';
import { DefaultTheme, ThemeProvider } from 'styled-components';
import { defaultSiteMap } from '@/constants';
import { AnimationsProvider } from '@/providers/animations';
import { SoundProvider } from '@/providers/audio-context';
import { PathProvider } from '@/providers/path';
import { SitesDataProvider } from '@/providers/sites';
import { WindowSizeProvider } from '@/providers/window-size';
import Fonts from '@/styles/fonts';
import { GlobalStyle } from '@/styles/globalstyles';
import Skeleton from '@/styles/skeleton';
import { BaseContentItem, GameContentItem, SiteKey } from '@/types';

const theme: DefaultTheme = {
    colors: {
        primary: '#eae41f',
        secondary: '#0070f3',
    },
};

interface Props {
    defaultSite: SiteKey;
    defaultContent: (BaseContentItem | GameContentItem)[];
    children: React.ReactNode;
}

// DOC: the stack index/linktree/privacy each duplicated in the pages router. mounting it once
//  in the root layout is what lets client state survive navigation between routes.
const Providers: FC<Props> = ({ defaultSite, defaultContent, children }) => (
    <ThemeProvider theme={theme}>
        <Skeleton />
        <GlobalStyle />
        <Fonts />
        <SitesDataProvider defaultSite={defaultSite} defaultContent={defaultContent} defaultSiteMap={defaultSiteMap}>
            <AnimationsProvider>
                <SoundProvider>
                    <WindowSizeProvider>
                        <PathProvider>
                            <>{children}</>
                        </PathProvider>
                    </WindowSizeProvider>
                </SoundProvider>
            </AnimationsProvider>
        </SitesDataProvider>
    </ThemeProvider>
);

export default Providers;
