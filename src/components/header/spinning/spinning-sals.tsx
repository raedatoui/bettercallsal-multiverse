import React, { FC, useCallback, useContext, useEffect } from 'react';
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
    const { selectedSite, siteMap, bizerkMode } = useSiteContext();
    const { spinningSalsCounter, setSpinningSalsGridCounter } = useAnimationContext();
    const { buffers } = useContext(SoundContext);

    const site = siteMap[selectedSite];

    const playAndGrid = useCallback(() => {
        setSpinningSalsGridCounter(Math.round(Math.random() * 1000));
        if (site)
            buffers.play(site.header.spinningSalAudio, false);
    }, [buffers, setSpinningSalsGridCounter, site]);

    const pause = () => {
        setSpinningSalsGridCounter(0);
        if (site)
            if (wrapperStyle === 'left')
                buffers.pause(site.header.spinningSalAudio);
            else buffers.stop(site.header.spinningSalAudio);
    };

    useEffect(() => {
        if (spinningSalsCounter !== 0)
            playAndGrid();
        return () => {};
    }, [playAndGrid, spinningSalsCounter]);

    return (
        <SpinningWrapper className={wrapperStyle}>
            <SpinningImg
                onClick={() => playAndGrid()}
                // onMouseEnter={() => playAndGrid()}
                onMouseOver={() => playAndGrid()}
                // onMouseLeave={() => pause()}
                onMouseOut={() => pause()}
                className={`${imageStyle} ${bizerkMode !== 'off' ? ' bizerk' : ''}`}
                image={image}
            />
        </SpinningWrapper>
    );
};

export default SpinningSal;
