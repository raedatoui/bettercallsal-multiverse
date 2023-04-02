import React, { createContext, FC, useMemo, useState, useEffect, useContext } from 'react';

type AnimationProviderType = {
    animateHeaderFooter: number,
    setAnimateHeaderFooter: (a: number) => void,
    spinningSalsCounter: number,
    setSpinningSalsCounter: (a: number) => void,
    spinningSalsGridCounter: number,
    setSpinningSalsGridCounter: (a: number) => void,
    keyPressed: string | null,
    bizerkOn: boolean,
    setBizerkOn: (a: boolean) => void,
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
    keyPressed: null,
    bizerkOn: false,
    setBizerkOn: () => {},
    bizerkCounter: 0,
    setBizerkCounter: () => {}
});

const AnimationsProvider:FC<ProviderProps> = ({ children }) => {
    const [animateHeaderFooter, setAnimateHeaderFooter] = useState<number>(0);
    const [spinningSalsCounter, setSpinningSalsCounter] = useState<number>(0);
    const [spinningSalsGridCounter, setSpinningSalsGridCounter] = useState<number>(0);
    const [keyPressed, setKeyPressed] = useState<string | null>(null);
    const [bizerkOn, setBizerkOn] = useState<boolean>(false);
    const [bizerkCounter, setBizerkCounter] = useState<number>(0);

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
        keyPressed,
        bizerkCounter,
        setBizerkCounter,
        bizerkOn,
        setBizerkOn
    }), [animateHeaderFooter, spinningSalsCounter, spinningSalsGridCounter, keyPressed, bizerkCounter]);

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
