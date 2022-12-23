import React, { FC, useEffect, useRef } from 'react';
import { Site } from 'src/types';
import { SpinningImg, SpinningWrapper } from './elements';

interface Props {
    wrapperStyle: string;
    imageStyle: string;

    site: Site | null;

    play: () => void;

    pause: () => void;

    image: string;
}
const SpinningSal: FC<Props> = ({ wrapperStyle, imageStyle, site, play, pause, image }) => {
    const ref = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = ref.current;
        element?.addEventListener('mouseenter', play);
        element?.addEventListener('mouseleave', pause);
        element?.addEventListener('click', play);
        return () => {
            element?.removeEventListener('mouseenter', play);
            element?.removeEventListener('mouseleave', pause);
            element?.removeEventListener('click', play);

        };

    }, [site]);

    return (
        <SpinningWrapper className={wrapperStyle} ref={wrapperRef}>
            <SpinningImg ref={ref} className={imageStyle} image={image} />
        </SpinningWrapper>
    );
};

export default SpinningSal;
