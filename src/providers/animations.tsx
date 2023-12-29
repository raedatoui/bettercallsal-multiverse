import React, { createContext, FC, useMemo, useState, useContext, Dispatch, SetStateAction, useEffect } from 'react';
import { useSiteContext } from '@/providers/sites';
import { BizerkMode } from '@/types';

type AnimationProviderType = {
    animateGrid: number;
    setAnimateGrid: Dispatch<SetStateAction<number>>;
    animateNav: number;
    setAnimateNav: Dispatch<SetStateAction<number>>;
    bizerkMode: BizerkMode;
    setBizerkMode: (a: BizerkMode) => void;
    animateWtf: number;
    setAnimateWtf: Dispatch<SetStateAction<number>>;
};

interface ProviderProps {
    children: JSX.Element;
}

const AnimationContext = createContext<AnimationProviderType>({
    animateGrid: 0,
    setAnimateGrid: () => null,
    animateNav: 0,
    setAnimateNav: () => null,
    bizerkMode: 'off',
    setBizerkMode: () => null,
    animateWtf: 0,
    setAnimateWtf: () => null,
});

const AnimationsProvider: FC<ProviderProps> = ({ children }) => {
    const { selectedSite } = useSiteContext();

    const [animateGrid, setAnimateGrid] = useState<number>(0);
    const [animateNav, setAnimateNav] = useState<number>(0);
    const [animateWtf, setAnimateWtf] = useState<number>(0);

    const [bizerkMode, setBizerkMode] = useState<BizerkMode>('off');

    useEffect(() => {
        // DOC: kill all animations when site changes.
        setAnimateWtf(0);
        setAnimateGrid(0);
        setAnimateNav(0);
    }, [selectedSite]);

    const animationCounters = useMemo<AnimationProviderType>(
        () => ({
            animateGrid,
            setAnimateGrid,
            animateNav,
            setAnimateNav,
            animateWtf,
            setAnimateWtf,
            bizerkMode,
            setBizerkMode,
        }),
        [animateGrid, animateWtf, animateNav, bizerkMode]
    );

    return <AnimationContext.Provider value={animationCounters}>{children}</AnimationContext.Provider>;
};

function useAnimationContext() {
    const context = useContext(AnimationContext);
    if (context === undefined) throw new Error('useAnimationContext must be used within a AnimationProvider');

    return context;
}

export { AnimationsProvider, useAnimationContext };
