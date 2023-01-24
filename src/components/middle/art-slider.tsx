import React, { FC, useState, useEffect, useContext, RefObject } from 'react';
import Image from 'next/image';
import { BaseContentItem, ContentSize, Size } from 'src/types';
import { ButtonBar, ImageContainer, StopButton } from 'src/components/middle/elements';
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';
import { SiteContext } from 'src/providers/sites';
import { useWindowSize } from 'src/utils';
import styled from 'styled-components';
import { NavButton } from 'src/styles/sharedstyles';
import { DALI } from 'src/constants';

interface Props {
    containerRef: RefObject<HTMLDivElement>;
    images: BaseContentItem[];
    start: number
}

const SlideItem = styled(NavButton)`
  position: absolute;
  padding: 4px 6px;
  top: calc(50% - 32px);
  &.left {
    left: 5px;
  }

  &.right {
    right: 5px;
  }
`;

export const ArtSlider:FC<Props> = ({ start, containerRef, images }) => {
    const { siteMap, setSelectedContentItem } = useContext(SiteContext);
    const windowSize = useWindowSize();

    const [loaded, setLoaded] = useState<boolean[]>([]);
    const [sizes, setSizes] = useState<ContentSize[]>([]);

    const [currentSlide, setCurrentSlide] = useState(start);

    const [sliderRef] = useKeenSlider<HTMLDivElement>({
        animationEnded(s) {
            setCurrentSlide(s.track.details.rel);
        },
        loop: true,
        initial: currentSlide,
        mode: 'snap',
        renderMode: 'performance',
        defaultAnimation: { duration: 1000, easing: (t: number) => 1 - (1 - t) ** 5 }
    }, [
        (slider) => {
            let timeout: ReturnType<typeof setTimeout>;
            let mouseOver = false;
            function clearNextTimeout() {
                clearTimeout(timeout);
            }
            function nextTimeout() {
                clearTimeout(timeout);
                if (mouseOver) return;
                timeout = setTimeout(() => {
                    slider.next();
                }, 4000);
            }
            slider.on('created', () => {
                slider.container.addEventListener('mouseover', () => {
                    mouseOver = true;
                    clearNextTimeout();
                });
                slider.container.addEventListener('mouseout', () => {
                    mouseOver = false;
                    nextTimeout();
                });
                nextTimeout();
            });
            slider.on('dragStarted', clearNextTimeout);
            slider.on('animationEnded', nextTimeout);
            slider.on('updated', nextTimeout);
        },
    ]);

    const getContentSize = (desiredSize: Size): ContentSize => {
        let height: number;
        let width: number;

        const workingWidth = containerRef.current?.getBoundingClientRect().width ?? 0;
        const workingHeight = (document?.getElementById('content-row')?.getBoundingClientRect().height ?? 0);

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

        return { width, height, left: (workingWidth - width) / 2, top: (workingHeight - height) / 2 };
    };

    useEffect(
        () => {
            const newLoaded = [...loaded];
            newLoaded[currentSlide] = true;
            setLoaded(newLoaded);
        },
        [currentSlide]
    );

    useEffect(() => {
        setSizes(
            images.map(({ width, height }) => getContentSize({ width: width ?? 1, height: height ?? 1 }))
        );
    }, [windowSize]);

    return (
        <ImageContainer
            ref={sliderRef}
            className="keen-slider"
        >
            {images.map((art, idx) => (
                <div key={art.name} className="keen-slider__slide lazy__slide">
                    <Image
                        src={`/images/art/${art.contentId}`}
                        placeholder="blur"
                        blurDataURL={DALI}
                        alt={art.name}
                        width={sizes[idx]?.width ?? siteMap.art.footer.imageWidth}
                        height={sizes[idx]?.height ?? siteMap.art.footer.imageHeight}
                        loading="lazy"
                    />
                </div>
            ))}

            <ButtonBar>
                <StopButton onClick={() => setSelectedContentItem(null)}>BACK</StopButton>
            </ButtonBar>
        </ImageContainer>
    );
};
