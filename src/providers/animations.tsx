import React, { createContext, FC, useMemo, useState, useContext, Dispatch, SetStateAction } from "react";
import { BizerkMode } from '@/types';

type AnimationProviderType = {
    animateGrid: number;
    setAnimateGrid: Dispatch<SetStateAction<number>>;
    animateNav: number;
    setAnimateNav: Dispatch<SetStateAction<number>>;
    bizerkMode: BizerkMode;
    setBizerkMode: (a: BizerkMode) => void;
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
});

const AnimationsProvider: FC<ProviderProps> = ({ children }) => {
    const [animateGrid, setAnimateGrid] = useState<number>(0);
    const [animateNav, setAnimateNav] = useState<number>(0);
    const [bizerkMode, setBizerkMode] = useState<BizerkMode>('off');

    const animationCounters = useMemo<AnimationProviderType>(
        () => ({
            animateGrid,
            setAnimateGrid,
            animateNav,
            setAnimateNav,
            bizerkMode,
            setBizerkMode,
        }),
        [animateGrid, animateNav, bizerkMode]
    );

    return <AnimationContext.Provider value={animationCounters}>{children}</AnimationContext.Provider>;
};

function useAnimationContext() {
    const context = useContext(AnimationContext);
    if (context === undefined) throw new Error('useAnimationContext must be used within a AnimationProvider');

    return context;
}

export { AnimationsProvider, useAnimationContext };
