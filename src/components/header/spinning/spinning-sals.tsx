import React, { FC, useContext, useEffect, useRef } from 'react';
import { AnimationContext } from 'src/providers/animations';
import { SpinningImg, SpinningWrapper } from './elements';

interface Props {
    wrapperStyle: string;
    imageStyle: string;
    play: () => void;
    pause: () => void;
    image: string;
}

const SpinningSal: FC<Props> = ({ wrapperStyle, imageStyle, play, pause, image }) => {
    const { spinningSalsCounter, setSpinningSalsGridCounter } = useContext(AnimationContext);

    const ref = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const playAndGrid = () => {
        setSpinningSalsGridCounter(Math.round(Math.random() * 1000));
        play();
    };

    useEffect(() => {
        const element = ref.current;
        element?.addEventListener('mouseenter', playAndGrid);
        element?.addEventListener('mouseleave', pause);
        element?.addEventListener('click', playAndGrid);
        return () => {
            element?.removeEventListener('mouseenter', playAndGrid);
            element?.removeEventListener('mouseleave', pause);
            element?.removeEventListener('click', playAndGrid);
        };
    });

    useEffect(() => {
        if (spinningSalsCounter !== 0)
            playAndGrid();
    }, [spinningSalsCounter]);

    return (
        <SpinningWrapper className={wrapperStyle} ref={wrapperRef}>
            <SpinningImg ref={ref} className={imageStyle} image={image} />
        </SpinningWrapper>
    );
};

export default SpinningSal;
