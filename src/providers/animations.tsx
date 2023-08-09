import React, { createContext, FC, useMemo, useState, useEffect, useContext } from 'react';
import { BizerkMode } from '@/types';

type AnimationProviderType = {
    animateHeaderFooter: number,
    setAnimateHeaderFooter: (a: number) => void,
    animateGrid: number,
    setAnimateGrid: (a: number) => void,
    animateBizerk: number,
    setAnimateBizerk: (a: number) => void,
};

type BizerProviderType = {
    bizerkMode: BizerkMode,
    setBizerkMode: (a: BizerkMode) => void,
    bizerkCounter: number,
    setBizerkCounter: (a: number) => void,
};

interface ProviderProps {
    children: JSX.Element;
}

const AnimationContext = createContext<AnimationProviderType>({
    animateHeaderFooter: 0,
    setAnimateHeaderFooter: () => {},
    animateGrid: 0,
    setAnimateGrid: () => {},
    animateBizerk: 0,
    setAnimateBizerk: () => {},
});

const BizerContext = createContext<BizerProviderType>({
    bizerkCounter: 0,
    setBizerkCounter: () => {},
    bizerkMode: 'off',
    setBizerkMode: () => {},
});

const AnimationsProvider:FC<ProviderProps> = ({ children }) => {
    const [animateHeaderFooter, setAnimateHeaderFooter] = useState<number>(0);
    const [animateGrid, setAnimateGrid] = useState<number>(0);
    const [animateBizerk, setAnimateBizerk] = useState<number>(0);

    const animationCounters = useMemo<AnimationProviderType>(() => ({
        animateHeaderFooter,
        setAnimateHeaderFooter,
        animateGrid,
        setAnimateGrid,
        animateBizerk,
        setAnimateBizerk
    }), [animateHeaderFooter, animateGrid, animateBizerk]);

    return (
        <AnimationContext.Provider value={animationCounters}>
            {children}
        </AnimationContext.Provider>
    );
};

const BizerkProvider:FC<ProviderProps> = ({ children }) => {
    const [bizerkMode, setBizerkMode] = useState<BizerkMode>('off');
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
        bizerkMode,
        setBizerkMode
    }), [bizerkCounter, bizerkMode]);
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
