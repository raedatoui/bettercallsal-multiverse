import React, { FC, useContext } from 'react';
import { useAnimationContext } from '@/providers/animations';
import { SoundContext } from '@/providers/audio-context';
import { useSiteContext } from '@/providers/sites';
import { SpinningImg, SpinningWrapper } from './elements';

interface Props {
    wrapperStyle: string;
    imageStyle: string;
    image: string;
}

const SpinningSal: FC<Props> = ({ wrapperStyle, imageStyle, image }) => {
    const { selectedSite, siteMap, bizerkMode } = useSiteContext();
    const { setSpinningSalsGridCounter } = useAnimationContext();
    const { buffers } = useContext(SoundContext);

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

    const onClick = () => {
        playAndGrid();
        setTimeout(() => pause(), 50);
    };

    return (
        <SpinningWrapper className={wrapperStyle}>
            <SpinningImg
                onClick={() => onClick()}
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
