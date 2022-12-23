import { useRef, useEffect } from 'react';
import { CbFn } from '../types';

export const useInterval = (callback: CbFn, delay: number) => {
    const savedCallback = useRef<CbFn>();

    useEffect(() => {
        savedCallback.current = callback;
    });

    useEffect(() => {
        const tick = () => savedCallback.current?.();

        const id = setInterval(tick, delay);
        return () => clearInterval(id);
    }, [delay]);
};
