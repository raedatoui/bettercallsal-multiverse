import { useEffect, useRef } from 'react';
import { CbFn } from 'src/types';

const useTimeout = (callback: CbFn, delay: number) => {
    const savedCallback = useRef<CbFn>(callback);

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        const tick = () => savedCallback.current();

        const id = setTimeout(tick, delay);
        return () => clearTimeout(id);

    }, [delay]);
};

export default useTimeout;
