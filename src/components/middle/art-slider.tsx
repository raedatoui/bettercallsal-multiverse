import React, { FC, useState, useEffect, useContext, RefObject } from 'react';
import Image from 'next/image';
import { BaseContentItem, ContentSize, Size } from 'src/types';
import { ButtonBar, ImageContainer, StopButton } from 'src/components/middle/elements';
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';
import { useSiteContext } from 'src/providers/sites';
import { useWindowSize } from 'src/utils';
import { DALI } from 'src/constants';
import { AnimationContext } from 'src/providers/animations';

interface Props {
    containerRef: RefObject<HTMLDivElement>;
    images: BaseContentItem[];
    start: number
}

export const ArtSlider:FC<Props> = ({ start, containerRef, images }) => {
    const { setSelectedContentItem, setSelectedNavItem } = useSiteContext();
    const { keyPressed } = useContext(AnimationContext);
    const windowSize = useWindowSize();

    const [sizes, setSizes] = useState<ContentSize[]>([]);

    const [currentSlide, setCurrentSlide] = useState(start);

    const [sliderRef, sliderInstance] = useKeenSlider<HTMLDivElement>({
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
            // setSliderInstance(slider);
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

    useEffect(() => {
        setSizes(
            images.map(({ width, height }) => getContentSize({ width: width ?? 1, height: height ?? 1 }))
        );
    }, [windowSize]);

    useEffect(() => {
        if (sliderInstance.current) {
            if (keyPressed === 'ArrowRight')
                sliderInstance.current.next();
            if (keyPressed === 'ArrowLeft')
                sliderInstance.current.prev();
        }
    }, [keyPressed, sliderInstance]);

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
                        width={sizes[idx]?.width ?? 0}
                        height={sizes[idx]?.height ?? 0}
                        loading="lazy"
                    />
                </div>
            ))}

            <ButtonBar>
                <StopButton onClick={() => { setSelectedContentItem(null); setSelectedNavItem(null); }}>back</StopButton>
            </ButtonBar>
        </ImageContainer>
    );
};
