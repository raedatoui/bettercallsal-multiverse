import React, { createContext, FC, useMemo, useState, useEffect } from 'react';

type AnimationProviderType = {
    animateHeaderFooter: number,
    setAnimateHeaderFooter: (a: number) => void,
    spinningSalsCounter: number,
    setSpinningSalsCounter: (a: number) => void,
    spinningSalsGridCounter: number,
    setSpinningSalsGridCounter: (a: number) => void,
    keyPressed: string | null,
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
    keyPressed: null,
});

const AnimationsProvider:FC<ProviderProps> = ({ children }) => {
    const [animateHeaderFooter, setAnimateHeaderFooter] = useState<number>(0);
    const [spinningSalsCounter, setSpinningSalsCounter] = useState<number>(0);
    const [spinningSalsGridCounter, setSpinningSalsGridCounter] = useState<number>(0);
    const [keyPressed, setKeyPressed] = useState<string | null>(null);

    const animationCounters = useMemo<AnimationProviderType>(() => ({
        animateHeaderFooter,
        setAnimateHeaderFooter,
        spinningSalsCounter,
        setSpinningSalsCounter,
        spinningSalsGridCounter,
        setSpinningSalsGridCounter,
        keyPressed,
    }), [animateHeaderFooter, spinningSalsCounter, spinningSalsGridCounter, keyPressed]);

    useEffect(() => {
        const downHandler = (ev:KeyboardEvent) => {
            setKeyPressed(ev.key);
        };

        const upHandler = () => {
            setTimeout(() => {
                setKeyPressed(null);
            }, 100);
        };

        window.addEventListener('keydown', downHandler);
        window.addEventListener('keyup', upHandler);

        return () => {
            window.removeEventListener('keydown', downHandler);
            window.removeEventListener('keyup', upHandler);
        };
    }, []);

    return (
        <AnimationContext.Provider value={animationCounters}>
            {children}
        </AnimationContext.Provider>
    );
};

export { AnimationsProvider, AnimationContext };
