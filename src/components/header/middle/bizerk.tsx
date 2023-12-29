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
    bizerk: {
        icon: string;
        site: SiteKey;
    };
}

const Bizerk: FC<Props> = ({ bizerk }) => {
    const { selectedSite, siteMap } = useSiteContext();
    const site = siteMap[selectedSite];

    const { buffers } = useContext(SoundContext);
    const { animateGrid, setAnimateGrid, animateWtf, setAnimateWtf, bizerkMode } = useAnimationContext();
    const [tl, setTl] = useState<gsap.core.Timeline | null>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // DOC: bizerk hover -> gsap fast animations
            if (selectedSite !== 'wtf') {
                const tl = bizerkHover(selectedSite, animateGrid, setAnimateGrid);
                setTl(tl);
            }
        });
        return () => ctx.revert();
    }, [selectedSite]);

    const play = () => {
        // if (selectedSite === 'wtf') setAnimateWtf(Math.round(Math.random() * 1000));
        // else setAnimateGrid(Math.round(Math.random() * 1000));
        // TODO: drill site props in
        if (tl) {
            console.log('restart');
            tl.restart();
            buffers.play(site.header.ringAudio, false);
            buffers.play(site.footer.ringAudio, false);
            buffers.play(site.header.spinningSalAudio1, false);
            buffers.play(site.header.spinningSalAudio2, false);
        }
    };

    const pause = () => {
        // DOC: in bizerk mode, dont stop anything
        if (bizerkMode === 'off') {
            // TODO: should this audio stop or let the accumulated sources play
            buffers.stopAll();
            setAnimateGrid(0);
            setAnimateWtf(0);
        }
    };

    return (
        <BizerkImageContainer className={bizerk.site}>
            <BizerImage id="bizerk-icon" src={`${CDN}${bizerk.icon}`} className={bizerk.site} onMouseOver={() => play()} onMouseOut={() => pause()} />
        </BizerkImageContainer>
    );
};

export default Bizerk;
