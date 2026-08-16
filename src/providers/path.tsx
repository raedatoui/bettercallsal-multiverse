'use client';

import React, { createContext, FC, useContext, useMemo, useState } from 'react';

interface ProviderProps {
    children: React.JSX.Element;
}

type PathProviderType = {
    prevPath: string;
    setPrevPath: (s: string) => void;
    pathStack: string[];
    setPathStack: (s: string[]) => void;
};

const PathContext = createContext<PathProviderType | undefined>(undefined);

const PathProvider: FC<ProviderProps> = ({ children }) => {
    const [prevPath, setPrevPath] = useState<string>('/');
    const [pathStack, setPathStack] = useState<string[]>([]);
    const providedPath = useMemo<PathProviderType>(
        () => ({
            prevPath,
            setPrevPath,
            pathStack,
            setPathStack,
        }),
        [prevPath]
    );

    return <PathContext.Provider value={providedPath}>{children}</PathContext.Provider>;
};

function usePathContext() {
    const context = useContext(PathContext);
    if (context === undefined) throw new Error('usePathContext must be used within a PathProvider');

    return context;
}

export { PathProvider, PathContext, usePathContext };