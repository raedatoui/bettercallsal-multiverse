import * as React from 'react';
import type { AppProps } from 'next/app';
import { ThemeProvider, DefaultTheme } from 'styled-components';
import { WindowSizeProvider } from 'src/providers/window-size';
import { SiteKeyValidator } from 'src/types';
import { SoundProvider } from '../src/providers/audio-context';
import { SiteProvider } from '../src/providers/site-provider';
import Normalize from '../src/styles/normalize';
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
        <Normalize />
        <Skeleton />
        <GlobalStyle />
        <Fonts />
        <SiteProvider defaultSite={SiteKeyValidator.parse(process.env.selectedSite)}>
            <SoundProvider>
                <WindowSizeProvider>
                    <Component {...pageProps} />
                </WindowSizeProvider>
            </SoundProvider>
        </SiteProvider>
    </ThemeProvider>
);

export default App;
