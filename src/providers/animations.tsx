import React, { createContext, FC, useMemo, useState } from 'react';

type AnimationProviderType = {
    animateHeaderFooter: number,
    setAnimateHeaderFooter: (a: number) => void,
    spinningSalsCounter: number,
    setSpinningSalsCounter: (a: number) => void,
    spinningSalsGridCounter: number,
    setSpinningSalsGridCounter: (a: number) => void,
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
    setSpinningSalsGridCounter: () => {}
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
        setSpinningSalsGridCounter
    }), [animateHeaderFooter, spinningSalsCounter, spinningSalsGridCounter]);
    return (
        <AnimationContext.Provider value={animationCounters}>
            {children}
        </AnimationContext.Provider>
    );
};

export { AnimationsProvider, AnimationContext };
