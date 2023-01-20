import * as React from 'react';
import type { AppProps } from 'next/app';
import { ThemeProvider, DefaultTheme } from 'styled-components';
import { WindowSizeProvider } from 'src/providers/window-size';
import { SiteKeyValidator } from 'src/types';
import { SitesDataProvider } from 'src/providers/sites';
import { AnimationsProvider } from 'src/providers/animations';
import { SoundProvider } from '../src/providers/audio-context';
import Skeleton from '../src/styles/skeleton';
import Fonts from '../src/styles/fonts';
import GlobalStyle from '../src/styles/globalstyles';

const theme: DefaultTheme = {
    colors: {
        primary: '#eae41f',
        secondary: '#0070f3',
    },
};

const App = ({ Component, pageProps }: AppProps) => (
    <ThemeProvider theme={theme}>
        <Skeleton />
        <GlobalStyle />
        <Fonts />
        <SitesDataProvider defaultSite={SiteKeyValidator.parse(process.env.selectedSite)}>
            <AnimationsProvider>
                <SoundProvider>
                    <WindowSizeProvider>
                        <Component {...pageProps} />
                    </WindowSizeProvider>
                </SoundProvider>
            </AnimationsProvider>
        </SitesDataProvider>
    </ThemeProvider>
);

export default App;
