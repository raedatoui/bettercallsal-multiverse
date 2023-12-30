import { gsap } from 'gsap';
import React, { FC, useContext, useEffect, useState } from 'react';
import { BizerkContainer, SalName } from '@/components/header/middle/elements';
import { useAnimationContext } from '@/providers/animations';
import { SoundContext } from '@/providers/audio-context';
import { useSiteContext } from '@/providers/sites';
import { SiteKey } from '@/types';
import { animateCounterBizerk } from '@/utils';
import Bizerk from './bizerk';

interface Props {
    name1: string;
    name2: string;
    bizerkMode: string;
    bizerkIcon: { icon: string; site: SiteKey };
    spinningSalAudio1: string;
    spinningSalAudio2: string;
    ringAudio1: string;
    ringAudio2: string;
}

export const BizerkContainerFC: FC<Props> = ({ name1, name2, bizerkIcon, spinningSalAudio1, spinningSalAudio2, ringAudio1, ringAudio2 }) => {
    const { selectedSite } = useSiteContext();

    const { buffers } = useContext(SoundContext);
    const { animateWtf, setAnimateWtf, bizerkMode, setAnimateGrid } = useAnimationContext();
    const [tl, setTl] = useState<gsap.core.Tween | null>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // DOC: bizerk hover -> gsap fast animations
            if (selectedSite === 'wtf') {
                const tl = animateCounterBizerk(animateWtf, setAnimateWtf);
                setTl(tl);
            }
        });
        return () => ctx.revert();
    }, [selectedSite]);

    const play = () => {
        tl?.restart();
        buffers.play(ringAudio1, false);
        buffers.play(ringAudio2, false);
        buffers.play(spinningSalAudio1, false);
        buffers.play(spinningSalAudio2, false);
    };

    const pause = () => {
        // DOC: in bizerk mode, dont stop anything
        if (bizerkMode === 'off' && tl) {
            tl?.pause();
            // TODO: should this audio stop or let the accumulated sources play
            buffers.stopAll();
            setAnimateGrid(0);
            setAnimateWtf(0);
        }
    };

    return (
        <BizerkContainer
            className={`animatable ${bizerkMode !== 'off' ? 'bizerk' : ''}`}
            onMouseOver={() => {
                if (tl) play();
            }}
            onMouseOut={() => pause()}
        >
            <SalName>{name1}</SalName>
            <Bizerk
                bizerk={bizerkIcon}
                spinningSalAudio1={spinningSalAudio1}
                spinningSalAudio2={spinningSalAudio2}
                ringAudio1={ringAudio1}
                ringAudio2={ringAudio2}
            />
            <SalName>{name2}</SalName>
        </BizerkContainer>
    );
};
