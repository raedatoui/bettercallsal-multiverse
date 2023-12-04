import React, { FC, useContext } from 'react';
import { useAnimationContext } from '@/providers/animations';
import { SoundContext } from '@/providers/audio-context';
import { useSiteContext } from '@/providers/sites';
import { SpinningImg, SpinningWrapper } from './elements';

interface Props {
    wrapperStyle: string;
    imageStyle: string;
    image: string;
    audio: string;
}

const SpinningSal: FC<Props> = ({ wrapperStyle, imageStyle, image, audio }) => {
    const { selectedSite, siteMap } = useSiteContext();
    const { setAnimateGrid, setAnimateWtf, bizerkMode } = useAnimationContext();
    const { buffers } = useContext(SoundContext);

    const site = siteMap[selectedSite];
    const play = () => {
        if (selectedSite === 'wtf') setAnimateWtf(Math.round(Math.random() * 1000));
        else setAnimateGrid(Math.round(Math.random() * 1000));
        buffers.play(audio, false);
    };

    const pause = () => {
        setAnimateGrid(0);
        if (site)
            if (wrapperStyle === 'left') buffers.pause(audio);
            else buffers.stop(audio);
    };

    const onClick = () => {
        play();
        setTimeout(() => pause(), 50);
    };

    return (
        <SpinningWrapper className={wrapperStyle}>
            <SpinningImg
                onClick={() => onClick()}
                onMouseOver={() => play()}
                onMouseOut={() => pause()}
                className={`${bizerkMode !== 'off' ? ' bizerk' : ''} spinner ${imageStyle} `}
                image={image}
            />
        </SpinningWrapper>
    );
};

export default SpinningSal;
