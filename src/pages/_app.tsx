import type { AppProps } from 'next/app';
import * as React from 'react';

const App = ({ Component, pageProps }: AppProps) =>
    <Component {...pageProps} />;

export default App;
