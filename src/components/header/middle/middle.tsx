import React, { FC, useEffect, useRef, useState } from 'react';
import { BizerImage, BizerkImageContainer } from 'src/components/header/middle/elements';
import { Site } from 'src/types';
import { useAnimationContext } from 'src/providers/animations';
import { CDN } from 'src/constants';
import { useSiteContext } from 'src/providers/sites';

interface Props {
    site: Site;
    pause: () => void;
}

export const Bizerk:FC<Props> = ({ site, pause }) => {
    const { setBizerkMode } = useSiteContext();
    const {
        animateHeaderFooter,
        setAnimateHeaderFooter,
        spinningSalsCounter,
        setSpinningSalsCounter,
        setSpinningSalsGridCounter,
    } = useAnimationContext();

    const [playing, setPlaying] = useState<boolean>(false);

    const bizerkAnim = () => {
        setAnimateHeaderFooter(animateHeaderFooter + 1);
        setSpinningSalsCounter(spinningSalsCounter + 1);
    };

    const bizerkStop = () => {
        setPlaying(false);
        pause();
        setTimeout(() => {
            if (!playing && site.name === 'biz')
                setSpinningSalsGridCounter(0);
        }, 1500);
    };

    const bizerkRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const element = bizerkRef.current;
        element?.addEventListener('mouseenter', bizerkAnim);
        element?.addEventListener('mouseleave', bizerkStop);
        element?.addEventListener('click', bizerkAnim);

        return () => {
            element?.removeEventListener('mouseenter', bizerkAnim);
            element?.removeEventListener('mouseleave', bizerkStop);
            element?.removeEventListener('click', bizerkAnim);
            setPlaying(false);
        };
    }, [animateHeaderFooter]);

    return (
        <BizerkImageContainer onClick={bizerkAnim} className={site.name} onDoubleClick={() => setBizerkMode('doubleClick')}>
            { site.header.bizerkIconType === 'image'
                && (
                    <BizerImage
                        ref={bizerkRef}
                        src={`${CDN}${site.header.bizerkIcon}`}
                        background={site.header.bizerkIcon}
                        className={site.name}
                    />
                )}
        </BizerkImageContainer>
    );
};
