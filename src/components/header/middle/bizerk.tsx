import { gsap } from 'gsap';
import React, { FC, useContext, useEffect, useState } from 'react';
import { CDN } from '@/constants';
import { useAnimationContext } from '@/providers/animations';
import { SoundContext } from '@/providers/audio-context';
import { useSiteContext } from '@/providers/sites';
import { bizerkHover } from '@/utils/gsap';
import { BizerImage, BizerkImageContainer } from './elements';

interface Props {
    name: string;
    bizerkIcon: string;
}

const Bizerk: FC<Props> = ({ name, bizerkIcon }) => {
    const { selectedSite, siteMap } = useSiteContext();
    const site = siteMap[selectedSite];

    const { buffers } = useContext(SoundContext);
    const { animateGrid, setAnimateGrid, bizerkMode } = useAnimationContext();
    const [tl, setTl] = useState<gsap.core.Timeline>();

    useEffect(() => {
        const ctx = gsap.context(() => {
            // DOC: bizerk hover -> gsap fast animations
            const tl = bizerkHover(selectedSite, animateGrid, setAnimateGrid);
            setTl(tl);
        });
        return () => ctx.revert();
    }, [selectedSite]);

    const playAndGrid = () => {
        setAnimateGrid(Math.round(Math.random() * 1000));
        tl?.restart();
        buffers.play(site.header.ringAudio, false);
        buffers.play(site.footer.ringAudio, false);
        buffers.play(site.header.spinningSalAudio1, false);
        buffers.play(site.header.spinningSalAudio2, false);
    };

    const pause = () => {
        // DOC: in bizerk mode, dont stop anything
        if (bizerkMode === 'off') {
            // TODO: should this audio stop or let the accumulated sources play
            buffers.stopAll();
            setAnimateGrid(0);
        }
    };

    return (
        <BizerkImageContainer className={name}>
            <BizerImage
                id="bizerk-icon"
                src={`${CDN}${bizerkIcon}`}
                background={bizerkIcon}
                className={name}
                onMouseOver={() => playAndGrid()}
                onMouseOut={() => pause()}
            />
        </BizerkImageContainer>
    );
};

export default Bizerk;
