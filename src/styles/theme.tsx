'use client';

import React, { FC } from 'react';
import { DefaultTheme, ThemeProvider } from 'styled-components';

const theme: DefaultTheme = {
    colors: {
        primary: '#eae41f',
        secondary: '#0070f3',
    },
};

interface Props {
    children: React.ReactNode;
}

const Theme:FC<Props> = ({ children }) => (
    <ThemeProvider theme={theme}>
        {children}
    </ThemeProvider>
);

export default Theme;
