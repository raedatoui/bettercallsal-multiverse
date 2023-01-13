import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import { LeftAdd1, LeftAdd2, LeftContent, LeftNavButton, LeftNavContainer, LeftNavMenu } from 'src/components/left-nav/elements';
import { LeftNavNavItem } from 'src/types';
import { WindowSizeContext } from 'src/providers/window-size';
import { SiteContext } from 'src/providers/site-provider';
import { SoundContext } from 'src/providers/audio-context';
import Image from 'next/image';

interface ButtonProps {
    navItem: LeftNavNavItem;
    audioCb: (a: string) => void;
    navItemCb: (l: LeftNavNavItem) => void;
    width: number;
    prevWidth: number;
}
const NavButton: FC<ButtonProps> = ({ navItem, audioCb, navItemCb, width, prevWidth }) => {

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current) {
            const elem = ref.current;
            if (prevWidth > width)
                while (elem.scrollWidth > elem.offsetWidth || elem.scrollHeight > elem.offsetHeight) {
                    const currentFontSize = getComputedStyle(elem, null).getPropertyValue('font-size');
                    const elNewFontSize = `${parseInt(currentFontSize.slice(0, -2), 10) - 2}px`;
                    elem.style.fontSize = elNewFontSize;
                }
            // else
            //     while (elem.scrollWidth <= elem.offsetWidth && elem.scrollHeight < elem.offsetHeight) {
            //         const currentFontSize = getComputedStyle(elem, null).getPropertyValue('font-size');
            //         const elNewFontSize = `${parseInt(currentFontSize.slice(0, -2), 10) + 1}px`;
            //         elem.style.fontSize = elNewFontSize;
            //     }
        }
    }, [width, ref]);

    const handleClick = () => {
        // TODO move providers here and remove callback functions. do too many provider subscriber slow things down?
        if (navItem.audio)
            audioCb(navItem.audio);
        if (navItem.category && navItem.category !== '')
            navItemCb(navItem);

    };

    return (
        <LeftNavButton
            ref={ref}
            onClick={handleClick}
        >{ navItem.name }
        </LeftNavButton>
    );
};

interface Props {

}

export const LeftNav: FC<Props> = () => {
    const { siteMap, selectedSite, setSelectedNavItem, selectedContentItem } = useContext(SiteContext);
    const site = siteMap[selectedSite];

    const { buffers, loaded } = useContext(SoundContext);

    const [audioPlaying, setAudioPlaying] = useState<string | null>(null);

    const { width } = useContext(WindowSizeContext);
    const [prevWidth, setPrevWith] = useState<number>(width);

    const handleAudio = (a: string) => {
        if (loaded)
            if (!audioPlaying) {
                buffers.play(a);
                setAudioPlaying(a);
            } else
            if (a === audioPlaying) {
                buffers.stop(a);
                setAudioPlaying(null);
            } else {
                buffers.stop(audioPlaying);
                buffers.play(a);
                setAudioPlaying(a);
            }
    };

    const handleImageClick = () => {
        if (site.leftNav.audio)
            handleAudio(site.leftNav.audio);
    };

    useEffect(() => {
        if (selectedContentItem && audioPlaying) {
            buffers.stop(audioPlaying);
            setAudioPlaying(null);
        }
    }, [selectedContentItem, audioPlaying]);

    useEffect(() => {
        setPrevWith(width);
    }, [width]);

    return (
        <LeftNavContainer className="two columns">
            <LeftNavMenu>
                { site.leftNav.items.map(i => (
                    <NavButton
                        key={i.name}
                        navItem={i}
                        audioCb={handleAudio}
                        navItemCb={setSelectedNavItem}
                        width={width}
                        prevWidth={prevWidth}
                    />
                )) }
            </LeftNavMenu>
            <LeftAdd1>
                <LeftAdd2>
                    <LeftContent>
                        <Image
                            src={site.leftNav.image}
                            alt={site.leftNav.text}
                            fill
                            onClick={() => handleImageClick()}
                        />
                    </LeftContent>
                    <span>{site.leftNav.text}</span>
                </LeftAdd2>
            </LeftAdd1>
        </LeftNavContainer>
    );
};
