import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import { LawBreakersContainer, LawBreakersP } from 'src/components/law-breakers/elements';
import Image from 'next/image';
import { useWindowSize } from 'src/utils';
import { Size } from 'src/types';
import { SiteContext } from 'src/providers/site-provider';

interface Props {}

export const LawBreakers: FC<Props> = () => {
    const { siteMap, selectedSite } = useContext(SiteContext);
    const site = siteMap[selectedSite];

    const windowSize = useWindowSize();
    const [micSize, setMicSize] = useState<Size>({ width: 148, height: 393 });

    const ref = useRef<HTMLParagraphElement>(null);

    const getContentSize = (desiredSize: Size): Size => {
        const height = ref.current?.getBoundingClientRect().height ?? 0;
        const width = (height * desiredSize.width) / desiredSize.height;

        return { width, height };
    };

    useEffect(() => {
        setMicSize(getContentSize({ width: site.footer.imageWidth, height: site.footer.imageHeight }));
    }, [windowSize, site]);

    useEffect(() => {
        setMicSize(getContentSize({ width: site.footer.imageWidth, height: site.footer.imageHeight }));
    }, []);

    return (
        <LawBreakersContainer>
            <LawBreakersP ref={ref}>
                <Image src={site.footer.image} alt="rca-mic" width={micSize.width} height={micSize.height} />
                <span>{site.footer.text}</span>
                <Image src={site.footer.image} alt="rca-mic" width={micSize.width} height={micSize.height} className="flipped" />
            </LawBreakersP>
        </LawBreakersContainer>
    );
};
