import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import { BizerImage, BizerkImageContainer } from 'src/components/header/middle/elements';
import { Site } from 'src/types';
import { AnimationContext } from 'src/providers/animations';
import { useInterval, useTimeout } from 'src/utils';

interface Props {
    site: Site;
    pause: () => void;
}

export const Bizerk:FC<Props> = ({ site, pause }) => {
    const {
        animateHeaderFooter,
        setAnimateHeaderFooter,
        spinningSalsCounter,
        setSpinningSalsCounter,
        setSpinningSalsGridCounter
    } = useContext(AnimationContext);

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
        }, 3000);

    };

    const bizerkRef = useRef<HTMLDivElement>(null);

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
        <BizerkImageContainer onClick={bizerkAnim} className={site.name}>
            <BizerImage ref={bizerkRef} background={site.header.bizerkIcon} className={site.name} />
        </BizerkImageContainer>
    );
};
