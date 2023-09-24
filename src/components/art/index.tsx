import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';
import Image from 'next/image';
import React, { FC, useState, useEffect, useCallback, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DALI } from '@/constants';
import { SoundContext } from '@/providers/audio-context';
import { useSiteContext } from '@/providers/sites';
import { ButtonBar, ImageContainer, StopButton } from '@/styles/sharedstyles';
import { ContentSize, isContent, Size } from '@/types';
import { findContent, useWindowSize } from '@/utils';

interface Props {}

const ArtSlider:FC<Props> = () => {
    const { artId } = useParams<{ artId: string }>();
    const navigate = useNavigate();

    const { keyPressed } = useSiteContext();
    const {
        contentMap,
        selectedSite,
    } = useSiteContext();
    const images = contentMap[selectedSite].filter(isContent);
    const artImage = findContent(images, artId ?? '');
    const start = artImage ? images.indexOf(artImage) : 0;
    const windowSize = useWindowSize();
    const { buffers } = useContext(SoundContext);

    const [sizes, setSizes] = useState<ContentSize[]>([]);

    const [currentSlide, setCurrentSlide] = useState(start); // start

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

    const getContentSize = useCallback((desiredSize: Size, containerSize: Size): ContentSize => {
        let height: number;
        let width: number;

        if (containerSize.width > containerSize.height) {
            height = containerSize.height;
            width = (height * desiredSize.width) / desiredSize.height;
        } else {
            width = containerSize.width;
            height = (width * desiredSize.height) / desiredSize.width;
        }
        if (width > containerSize.width) {
            width = containerSize.width;
            height = (width * desiredSize.height) / desiredSize.width;
        }

        return { width, height, left: (containerSize.width - width) / 2, top: (containerSize.height - height) / 2 };
    }, []);

    useEffect(() => {
        const workingWidth = document?.getElementById('middle')?.getBoundingClientRect().width ?? 0;
        const workingHeight = document?.getElementById('content-row')?.getBoundingClientRect().height ?? 0;

        setSizes(
            images.map(({ width, height }) =>
                getContentSize(
                    { width: width ?? 1, height: height ?? 1 },
                    { width: workingWidth, height: workingHeight }
                ))
        );
        return () => {};
    }, [getContentSize, windowSize]); // dont add images as a dep!

    useEffect(() => {
        if (sliderInstance.current) {
            if (keyPressed === 'ArrowRight')
                sliderInstance.current.next();
            if (keyPressed === 'ArrowLeft')
                sliderInstance.current.prev();
        }
        return () => {};
    }, [keyPressed, sliderInstance]);

    if (artId && !artImage)
        navigate('/');

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
                        style={{
                            maxWidth: '100%',
                            height: 'auto'
                        }}
                    />
                </div>
            ))}

            <ButtonBar>
                <StopButton onClick={() => {
                    // TODO: this stops the pavane just like salutations
                    buffers.stop('/audio/art/pavane.mp3');
                    navigate(-1);
                }}
                >[x]
                </StopButton>
            </ButtonBar>
        </ImageContainer>
    );
};

export default ArtSlider;