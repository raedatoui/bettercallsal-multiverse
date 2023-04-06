import React, { FC, useContext, useEffect, useRef } from 'react';
import { useAnimationContext } from 'src/providers/animations';
import { useSiteContext } from 'src/providers/sites';
import { SoundContext } from 'src/providers/audio-context';
import { SpinningImg, SpinningWrapper } from './elements';

interface Props {
    wrapperStyle: string;
    imageStyle: string;
    image: string;
}

const SpinningSal: FC<Props> = ({ wrapperStyle, imageStyle, image }) => {
    const { selectedSite, siteMap } = useSiteContext();
    const { spinningSalsCounter, setSpinningSalsGridCounter, bizerkOn } = useAnimationContext();
    const { buffers } = useContext(SoundContext);

    const ref = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const site = siteMap[selectedSite];

    const playAndGrid = () => {
        setSpinningSalsGridCounter(Math.round(Math.random() * 1000));
        if (site)
            buffers.play(site.header.spinningSalAudio, false);
    };

    const pause = () => {
        setSpinningSalsGridCounter(0);
        if (site)
            if (wrapperStyle === 'left')
                buffers.pause(site.header.spinningSalAudio);
            else buffers.stop(site.header.spinningSalAudio);
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
    }, [ref.current, selectedSite]);

    // fix this warning breaks the animation
    useEffect(() => {
        if (spinningSalsCounter !== 0)
            playAndGrid();
    }, [spinningSalsCounter]);

    return (
        <SpinningWrapper className={wrapperStyle} ref={wrapperRef}>
            <SpinningImg ref={ref} className={`${imageStyle} ${bizerkOn ? ' bizerk' : ''}`} image={image} />
        </SpinningWrapper>
    );
};

export default SpinningSal;
