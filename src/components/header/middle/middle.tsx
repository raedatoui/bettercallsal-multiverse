import React, { FC, useContext, useEffect, useRef } from 'react';
import { BizerImage, BizerkImageContainer } from 'src/components/header/middle/elements';
import { Site } from 'src/types';
import { AnimationContext } from 'src/providers/animations';

interface Props {
    site: Site
}

export const Bizerk:FC<Props> = ({ site }) => {
    const { animateHeaderFooter, setAnimateHeaderFooter, spinningSalsCounter, setSpinningSalsCounter } = useContext(AnimationContext);
    const bizerkAnim = () => {
        setAnimateHeaderFooter(animateHeaderFooter + 1);
        setSpinningSalsCounter(spinningSalsCounter + 1);
    };

    const bizerkRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = bizerkRef.current;
        element?.addEventListener('mouseenter', bizerkAnim);
        element?.addEventListener('mouseleave', bizerkAnim);
        element?.addEventListener('click', bizerkAnim);
        return () => {
            element?.removeEventListener('mouseenter', bizerkAnim);
            element?.removeEventListener('mouseleave', bizerkAnim);
            element?.removeEventListener('click', bizerkAnim);
        };
    }, [animateHeaderFooter]);
    return (
        <BizerkImageContainer onClick={bizerkAnim} className={site.name}>
            <BizerImage ref={bizerkRef} background={site.header.bizerkIcon} className={site.name} />
        </BizerkImageContainer>
    );
};
