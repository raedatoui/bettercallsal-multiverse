import React, { FC } from 'react';
import { CDN } from '@/constants';
import { useAnimationContext } from '@/providers/animations';
import { useSiteContext } from '@/providers/sites';
import { Site } from '@/types';
import { BizerImage, BizerkImageContainer } from './elements';

interface Props {
    site: Site;
    pause: () => void;
}

const Bizerk:FC<Props> = ({ site, pause }) => {
    const { setBizerkMode, bizerkMode } = useSiteContext();
    const {
        animateHeaderFooter,
        setAnimateHeaderFooter,
        setSpinningSalsGridCounter,
    } = useAnimationContext();

    const bizerkAnim = () => {
        setAnimateHeaderFooter(animateHeaderFooter + 1);
        setSpinningSalsGridCounter(Math.round(Math.random() * 1000));
    };

    const bizerkStop = () => {
        if (bizerkMode === 'off') {
            pause();
            setSpinningSalsGridCounter(0);
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

export default Bizerk;
