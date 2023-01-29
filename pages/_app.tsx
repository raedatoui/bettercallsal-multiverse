import * as React from 'react';
import type { AppProps } from 'next/app';
import { ThemeProvider, DefaultTheme } from 'styled-components';
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
        <Component {...pageProps} />
    </ThemeProvider>
);

export default App;
