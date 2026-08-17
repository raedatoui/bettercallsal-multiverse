'use client';

import type React from 'react';
import { createContext, type FC } from 'react';
import type { Size } from '@/types';
import { useWindowSize } from '@/utils';

const WindowSizeContext = createContext<Size>({
    width: 0,
    height: 0,
});

interface ProviderProps {
    children: React.ReactNode;
}
const WindowSizeProvider: FC<ProviderProps> = ({ children }) => {
    const windowSize = useWindowSize();
    return <WindowSizeContext.Provider value={windowSize}>{children}</WindowSizeContext.Provider>;
};

export { WindowSizeContext, WindowSizeProvider };
