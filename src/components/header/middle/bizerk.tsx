import { gsap } from 'gsap';
import React, { FC, useContext, useEffect, useState } from 'react';
import { CDN } from '@/constants';
import { useAnimationContext } from '@/providers/animations';
import { SoundContext } from '@/providers/audio-context';
import { useSiteContext } from '@/providers/sites';
import { SiteKey } from '@/types';
import { bizerkHover } from '@/utils/gsap';
import { BizerImage, BizerkImageContainer } from './elements';

interface Props {
    spinningSalAudio1: string;
    spinningSalAudio2: string;
    ringAudio1: string;
    ringAudio2: string;
    bizerk: {
        icon: string;
        site: SiteKey;
    };
}

const Bizerk: FC<Props> = ({ bizerk, spinningSalAudio1, spinningSalAudio2, ringAudio1, ringAudio2 }) => {
    const { selectedSite } = useSiteContext();

    const { buffers } = useContext(SoundContext);
    const { animateGrid, setAnimateGrid, bizerkMode } = useAnimationContext();
    const [tl, setTl] = useState<gsap.core.Timeline | null>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (selectedSite !== 'wtf') {
                const tl = bizerkHover(selectedSite, animateGrid, setAnimateGrid);
                setTl(tl);
            }
        });
        return () => ctx.revert();
    }, [selectedSite]);

    const play = () => {
        if (tl) {
            tl.restart();
            setAnimateGrid(Math.random()); // extra random to trigger the animation
            buffers.play(ringAudio1, false);
            buffers.play(ringAudio2, false);
            buffers.play(spinningSalAudio1, false);
            buffers.play(spinningSalAudio2, false);
        }
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
        <BizerkImageContainer className={bizerk.site}>
            <BizerImage id="bizerk-icon" src={`${CDN}${bizerk.icon}`} className={bizerk.site} onMouseOver={() => play()} onMouseOut={() => pause()} />
        </BizerkImageContainer>
    );
};

export default Bizerk;
