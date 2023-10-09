import React, { FC, useContext } from 'react';
import { useAnimationContext, useBizerkContext } from '@/providers/animations';
import { SoundContext } from '@/providers/audio-context';
import { useSiteContext } from '@/providers/sites';
import { SpinningImg, SpinningWrapper } from './elements';

interface Props {
    wrapperStyle: string;
    imageStyle: string;
    image: string;
}

const SpinningSal: FC<Props> = ({ wrapperStyle, imageStyle, image }) => {
    const { selectedSite, siteMap } = useSiteContext();
    const { bizerkMode } = useBizerkContext();
    const { setAnimateGrid } = useAnimationContext();
    const { buffers } = useContext(SoundContext);

    const site = siteMap[selectedSite];
    // TODO: randomize these for wtf
    const audio = wrapperStyle === 'left' ? site.header.spinningSalAudio1 : site.header.spinningSalAudio2;
    const playAndGrid = () => {
        setAnimateGrid(Math.round(Math.random() * 1000));
        if (site) buffers.play(audio, false);
    };

    const pause = () => {
        setAnimateGrid(0);
        if (site)
            if (wrapperStyle === 'left') buffers.pause(audio);
            else buffers.stop(audio);
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
