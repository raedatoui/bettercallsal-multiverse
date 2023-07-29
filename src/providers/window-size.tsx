import React, { createContext, FC } from 'react';
import { Size } from '@/types';
import { useWindowSize } from '@/utils';

const WindowSizeContext = createContext<Size>({
    width: 0,
    height: 0
});

interface ProviderProps {
    children: JSX.Element;
}
const WindowSizeProvider:FC<ProviderProps> = ({ children }) => {
    const windowSize = useWindowSize();
    return (
        <WindowSizeContext.Provider value={windowSize}>
            { children }
        </WindowSizeContext.Provider>
    );
};

export { WindowSizeProvider, WindowSizeContext };
