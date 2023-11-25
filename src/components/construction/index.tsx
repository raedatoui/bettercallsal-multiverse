import Image from 'next/image';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useAnimationContext } from '@/providers/animations';
import { useSiteContext } from '@/providers/sites';
import { Caption } from '@/styles/sharedstyles';
import { ContentSize, Size } from '@/types';
import { useWindowSize } from '@/utils';

// TODO: do this for other images that rely on the parent props for margins
const ConstructionImage = styled(Image)<{ left: number; top: number }>`
    margin-left: ${(props) => `${props.left}px`};
    margin-top: ${(props) => `${props.top}px`};
`;

const Construction = () => {
    const { siteMap, selectedSite } = useSiteContext();
    const site = siteMap[selectedSite];

    const { bizerkMode } = useAnimationContext();

    const [imageSize, setImageSize] = useState<ContentSize>({
        width: 0,
        height: 0,
        left: 0,
        top: 0,
    });

    const windowSize = useWindowSize();

    const titleRef = useRef<HTMLHeadingElement>(null);

    const getContentSize = useCallback(
        (desiredSize: Size): ContentSize => {
            let height: number;
            let width: number;
            const offset = titleRef.current?.getBoundingClientRect().height ?? 0;

            const workingWidth = document?.getElementById('middle')?.getBoundingClientRect().width ?? 0;
            const workingHeight = (document?.getElementById('content-row')?.getBoundingClientRect().height ?? 0) - offset;

            if (workingWidth > workingHeight) {
                height = workingHeight;
                width = (height * desiredSize.width) / desiredSize.height;
            } else {
                width = workingWidth;
                height = (width * desiredSize.height) / desiredSize.width;
            }
            if (width > workingWidth) {
                width = workingWidth;
                height = (width * desiredSize.height) / desiredSize.width;
            }
            let top = (workingHeight - height) / 2;
            if (workingWidth < 768) top = 0;
            return { width, height, left: (workingWidth - width) / 2, top };
        },
        [titleRef]
    );

    useEffect(() => {
        setImageSize(getContentSize({ width: 1610, height: 968 }));
    }, [getContentSize, windowSize]);

    const headerTxt = site.contentHeader;
    return (
        <>
            <Caption ref={titleRef} className={bizerkMode !== 'off' ? 'bizerk' : ''}>
                {headerTxt}
            </Caption>
            <ConstructionImage
                src="/images/construction/under-construction.png"
                width={imageSize.width}
                height={imageSize.height}
                left={imageSize.left}
                top={imageSize.top}
                alt="construction"
                className="construction"
                loading="eager"
            />
        </>
    );
};

export default Construction;
