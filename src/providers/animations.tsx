'use client';

import React, { createContext, FC, useMemo, useState, useEffect, useContext } from 'react';
import { useSiteContext } from 'src/providers/sites';

type AnimationProviderType = {
    animateHeaderFooter: number,
    setAnimateHeaderFooter: (a: number) => void,
    spinningSalsCounter: number,
    setSpinningSalsCounter: (a: number) => void,
    spinningSalsGridCounter: number,
    setSpinningSalsGridCounter: (a: number) => void,
};

type BizerProviderType = {
    bizerkCounter: number,
    setBizerkCounter: (a: number) => void,
};

interface ProviderProps {
    children: JSX.Element;
}

const AnimationContext = createContext<AnimationProviderType>({
    animateHeaderFooter: 0,
    setAnimateHeaderFooter: () => {},
    spinningSalsCounter: 0,
    setSpinningSalsCounter: () => {},
    spinningSalsGridCounter: 0,
    setSpinningSalsGridCounter: () => {},
});

const BizerContext = createContext<BizerProviderType>({
    bizerkCounter: 0,
    setBizerkCounter: () => {}
});

const AnimationsProvider:FC<ProviderProps> = ({ children }) => {
    const [animateHeaderFooter, setAnimateHeaderFooter] = useState<number>(0);
    const [spinningSalsCounter, setSpinningSalsCounter] = useState<number>(0);
    const [spinningSalsGridCounter, setSpinningSalsGridCounter] = useState<number>(0);

    const animationCounters = useMemo<AnimationProviderType>(() => ({
        animateHeaderFooter,
        setAnimateHeaderFooter,
        spinningSalsCounter,
        setSpinningSalsCounter,
        spinningSalsGridCounter,
        setSpinningSalsGridCounter,
    }), [animateHeaderFooter, spinningSalsCounter, spinningSalsGridCounter]);

    return (
        <AnimationContext.Provider value={animationCounters}>
            {children}
        </AnimationContext.Provider>
    );
};
const BizerkProvider:FC<ProviderProps> = ({ children }) => {
    const { bizerkMode } = useSiteContext();

    const [bizerkCounter, setBizerkCounter] = useState<number>(0);
    useEffect(() => {
        if (bizerkMode !== 'off')
            setInterval(() => {
                setBizerkCounter((prevCounter) => prevCounter + 1);
            }, 100);
    }, [bizerkMode]);

    const animationCounters = useMemo<BizerProviderType>(() => ({
        bizerkCounter,
        setBizerkCounter,
    }), [bizerkCounter]);
    return (
        <BizerContext.Provider value={animationCounters}>
            {children}
        </BizerContext.Provider>
    );
};

function useAnimationContext() {
    const context = useContext(AnimationContext);
    if (context === undefined)
        throw new Error('useAnimationContext must be used within a AnimationProvider');

    return context;
}

function useBizerkContext() {
    const context = useContext(BizerContext);
    if (context === undefined)
        throw new Error('useBizerkContext must be used within a BizerkProvider');

    return context;
}

export { AnimationsProvider, AnimationContext, BizerkProvider, BizerContext, useAnimationContext, useBizerkContext };
