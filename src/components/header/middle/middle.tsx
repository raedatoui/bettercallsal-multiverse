import React, { FC } from 'react';
import { CDN } from '@/constants';
import { useAnimationContext, useBizerkContext } from '@/providers/animations';
import { BizerImage, BizerkImageContainer } from './elements';

interface Props {
    name: string;
    bizerkIcon: string;
    pause: () => void;
}

const Bizerk: FC<Props> = ({ name, bizerkIcon, pause }) => {
    const { setBizerkMode, bizerkMode } = useBizerkContext();
    const { animateHeaderFooter, setAnimateHeaderFooter, setAnimateGrid, setAnimateBizerk } = useAnimationContext();

    const bizerkAnim = () => {
        setAnimateHeaderFooter(animateHeaderFooter + 1);
        setAnimateGrid(Math.round(Math.random() * 1000));
        setAnimateBizerk(Math.round(Math.random() * 1000));
    };

    const bizerkStop = () => {
        if (bizerkMode === 'off') {
            pause();
            setAnimateGrid(0);
        }
    };

    return (
        <BizerkImageContainer onClick={() => setBizerkMode('doubleClick')} className={name}>
            <BizerImage
                src={`${CDN}${bizerkIcon}`}
                background={bizerkIcon}
                className={name}
                onMouseEnter={() => bizerkAnim()}
                onMouseLeave={() => bizerkStop()}
            />
        </BizerkImageContainer>
    );
};

export default Bizerk;
