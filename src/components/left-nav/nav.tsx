import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import { LeftAdd1, LeftAdd2, LeftContent, LeftNavButton, LeftNavContainer, LeftNavMenu } from 'src/components/left-nav/elements';
import { LeftNavNavItem } from 'src/types';
import { WindowSizeContext } from 'src/providers/window-size';
import { useSiteContext } from 'src/providers/sites';
import { SoundContext } from 'src/providers/audio-context';
import Image from 'next/image';
import Script from 'next/script';

interface ButtonProps {
    navItem: LeftNavNavItem;
    audioCb: (a: string) => void;
    navItemCb: (l: LeftNavNavItem) => void;
    width: number;
}
const NavButton: FC<ButtonProps> = ({ navItem, audioCb, navItemCb, width }) => {

    const ref = useRef<HTMLDivElement>(null);

    const scaleText = () => {
        if (window.textFit && ref.current)
            window.textFit(ref.current);
    };

    useEffect(() => {
        scaleText();
    }, [width, ref]);

    useEffect(() => {
        scaleText();
    }, []);

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

interface Props {}

export const LeftNav: FC<Props> = () => {
    const { siteMap, selectedSite, setSelectedNavItem, selectedContentItem } = useSiteContext();
    const site = siteMap[selectedSite];

    const { buffers, loaded } = useContext(SoundContext);

    const [audioPlaying, setAudioPlaying] = useState<string | null>(null);

    const { width } = useContext(WindowSizeContext);
    const [scriptLoaded, setScriptLoaded] = useState<boolean>(false);

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
        if (selectedContentItem && audioPlaying && selectedSite !== 'art' && selectedSite !== 'games') {
            buffers.stop(audioPlaying);
            setAudioPlaying(null);
        }
    }, [selectedContentItem, audioPlaying, selectedSite]);

    return (
        <>
            <Script
                id="text-fit"
                src="/textfit.js"
                onLoad={() => setScriptLoaded(true)}
            />
            { scriptLoaded && (
                <LeftNavContainer>
                    <LeftNavMenu>
                        { site.leftNav.items.map(i => (
                            <NavButton
                                key={i.name}
                                navItem={i}
                                audioCb={handleAudio}
                                navItemCb={setSelectedNavItem}
                                width={width}
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
            ) }
        </>

    );
};
