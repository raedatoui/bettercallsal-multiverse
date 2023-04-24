import React, { FC } from 'react';
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
    const { setBizerkMode, bizerkMode } = useSiteContext();
    const {
        animateHeaderFooter,
        setAnimateHeaderFooter,
        spinningSalsCounter,
        setSpinningSalsCounter,
        setSpinningSalsGridCounter,
    } = useAnimationContext();

    const bizerkAnim = () => {
        setAnimateHeaderFooter(animateHeaderFooter + 1);
        setSpinningSalsCounter(spinningSalsCounter + 1);
    };

    const bizerkStop = () => {
        if (bizerkMode === 'off') {
            pause();
            setTimeout(() => {
                if (site.name === 'biz')
                    setSpinningSalsGridCounter(0);
            }, 1500);
        }
    };

    return (
        <BizerkImageContainer
            onClick={() => setBizerkMode('doubleClick')}
            className={site.name}
        >
            { site.header.bizerkIconType === 'image'
                && (
                    <BizerImage
                        src={`${CDN}${site.header.bizerkIcon}`}
                        background={site.header.bizerkIcon}
                        className={site.name}
                        onMouseEnter={() => bizerkAnim()}
                        onMouseLeave={() => bizerkStop()}
                    />
                )}
        </BizerkImageContainer>
    );
};
