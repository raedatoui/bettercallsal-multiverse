import { gsap } from 'gsap';
import React, { FC, useContext, useEffect, useState } from 'react';
import { BizerkContainer, SalName } from '@/components/header/middle/elements';
import { useAnimationContext } from '@/providers/animations';
import { SoundContext } from '@/providers/audio-context';
import { useSiteContext } from '@/providers/sites';
import { SiteKey } from '@/types';
import { animateCounter } from '@/utils';
import Bizerk from './bizerk';

interface Props {
    name1: string;
    name2: string;
    bizerkMode: string;
    bizerkIcon: { icon: string; site: SiteKey };
}

export const BizerkContainerFC: FC<Props> = ({ name1, name2, bizerkIcon }) => {
    const { selectedSite, siteMap } = useSiteContext();
    const site = siteMap[selectedSite];

    const { buffers } = useContext(SoundContext);
    const { animateWtf, setAnimateWtf, bizerkMode } = useAnimationContext();
    const [tl, setTl] = useState<gsap.core.Tween>();

    useEffect(() => {
        const ctx = gsap.context(() => {
            // DOC: bizerk hover -> gsap fast animations
            const tl = animateCounter(3, selectedSite, animateWtf, setAnimateWtf, true);
            setTl(tl);
        });
        return () => ctx.revert();
    }, [selectedSite]);

    const play = () => {
        if (selectedSite === 'wtf') {
            tl?.restart();
            buffers.play(site.header.ringAudio, false);
            buffers.play(site.footer.ringAudio, false);
            buffers.play(site.header.spinningSalAudio1, false);
            buffers.play(site.header.spinningSalAudio2, false);
        }
    };

    const pause = () => {
        // DOC: in bizerk mode, dont stop anything
        if (bizerkMode === 'off') {
            tl?.pause();
            // TODO: should this audio stop or let the accumulated sources play
            buffers.stopAll();
            setAnimateWtf(0);
        }
    };

    return (
        <BizerkContainer
            className={`animatable ${bizerkMode !== 'off' ? 'bizerk' : ''}`}
            onMouseOver={() => {
                if (selectedSite === 'wtf') play();
            }}
            onMouseOut={() => pause()}
        >
            <SalName>{name1}</SalName>
            <Bizerk bizerk={bizerkIcon} />
            <SalName>{name2}</SalName>
        </BizerkContainer>
    );
};
