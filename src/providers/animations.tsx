import React, { createContext, FC, useMemo, useState, useEffect, useContext } from 'react';
import { useSiteContext } from 'src/providers/sites';

type AnimationProviderType = {
    animateHeaderFooter: number,
    setAnimateHeaderFooter: (a: number) => void,
    spinningSalsCounter: number,
    setSpinningSalsCounter: (a: number) => void,
    spinningSalsGridCounter: number,
    setSpinningSalsGridCounter: (a: number) => void,
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
    bizerkCounter: 0,
    setBizerkCounter: () => {}
});

const AnimationsProvider:FC<ProviderProps> = ({ children }) => {
    const { bizerkOn } = useSiteContext();

    const [animateHeaderFooter, setAnimateHeaderFooter] = useState<number>(0);
    const [spinningSalsCounter, setSpinningSalsCounter] = useState<number>(0);
    const [spinningSalsGridCounter, setSpinningSalsGridCounter] = useState<number>(0);
    const [bizerkCounter, setBizerkCounter] = useState<number>(0);

    useEffect(() => {
        if (bizerkOn)
            setInterval(() => {
                setBizerkCounter((prevCounter) => prevCounter + 1);
            }, 25);
    }, [bizerkOn]);

    const animationCounters = useMemo<AnimationProviderType>(() => ({
        animateHeaderFooter,
        setAnimateHeaderFooter,
        spinningSalsCounter,
        setSpinningSalsCounter,
        spinningSalsGridCounter,
        setSpinningSalsGridCounter,
        bizerkCounter,
        setBizerkCounter,
    }), [animateHeaderFooter, spinningSalsCounter, spinningSalsGridCounter, bizerkCounter]);

    return (
        <AnimationContext.Provider value={animationCounters}>
            {children}
        </AnimationContext.Provider>
    );
};

function useAnimationContext() {
    const context = useContext(AnimationContext);
    if (context === undefined)
        throw new Error('useAnimationContext must be used within a AnimationProvider');

    return context;
}

export { AnimationsProvider, AnimationContext, useAnimationContext };
