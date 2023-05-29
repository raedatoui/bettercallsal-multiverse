import React, { FC, useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
    LeftAdd1,
    LeftAdd2,
    LeftContent,
    LeftNavButton,
    LeftNavContainer,
    LeftNavMenu,
    LeftNavItemCuck
} from 'src/components/left-nav/elements';
import { BaseContentItem, LeftNavNavItem } from 'src/types';
import { WindowSizeContext } from 'src/providers/window-size';
import { useSiteContext } from 'src/providers/sites';
import { SoundContext } from 'src/providers/audio-context';
import Image from 'next/image';
import Script from 'next/script';
import { useAnimationContext } from 'src/providers/animations';
import { shuffleList } from 'src/utils';
import Link from 'next/link';

interface ButtonProps {
    navItem: LeftNavNavItem;
    audioCb: (a: string) => void;
    navItemCb: (l: LeftNavNavItem) => void;
    videoCb: (c: BaseContentItem) => void;
    width: number;
    fullScreen: boolean;
}
const NavButton: FC<ButtonProps> = ({ navItem, audioCb, navItemCb, videoCb, width, fullScreen }) => {
    const [clicked, setClicked] = useState<boolean>(false);
    const ref = useRef<HTMLDivElement>(null);

    const scaleText = useCallback(() => {
        if (window.textFit && ref.current && !fullScreen)
            window.textFit(ref.current, { alignVert: true, alignHoriz: false, detectMultiLine: false, widthOnly: false, maxFontSize: 34 });
    }, [fullScreen]);

    useEffect(() => {
        scaleText();
        return () => {};
    }, [width, ref, scaleText]);

    useEffect(() => {
        scaleText();
        return () => {};
    });

    const handleClick = () => {
        setClicked(true);
        // TODO move providers here and remove callback functions. do too many provider subscriber slow things down?
        if (navItem.audio)
            audioCb(navItem.audio);
        if (navItem.category && navItem.category !== '')
            navItemCb(navItem);
        if (navItem.video)
            videoCb({
                name: navItem.name,
                contentId: navItem.video,
                contentType: 'youtube',
                thumb: '',
                category: ''
            });
    };

    useEffect(() => {
        if (clicked) {
            setTimeout(() => {
                document.body.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                document.getElementById('content-row')?.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }, 50);

            setClicked(false);
        }
        return () => {};
    }, [clicked]);

    return (
        <LeftNavButton
            onClick={handleClick}
        >
            { !navItem.link && (
                <LeftNavItemCuck
                    ref={ref}
                    dangerouslySetInnerHTML={{
                        __html: navItem.name
                    }}
                />
            ) }
            { navItem.link && (
                <LeftNavItemCuck ref={ref}>
                    <Link
                        href={navItem.link}
                        target="_blank"
                        rel="noreferrer"
                        dangerouslySetInnerHTML={{
                            __html: navItem.name
                        }}
                    />
                </LeftNavItemCuck>
            ) }

        </LeftNavButton>
    );
};

interface Props {}

export const LeftNav: FC<Props> = () => {
    const {
        siteMap,
        selectedSite,
        setSelectedNavItem,
        selectedContentItem,
        setSelectedContentItem,
        fullScreen,
        bizerkMode
    } = useSiteContext();
    const site = siteMap[selectedSite];
    const { bizerkCounter } = useAnimationContext();
    const { buffers, loaded } = useContext(SoundContext);
    const { width } = useContext(WindowSizeContext);

    const [audioPlaying, setAudioPlaying] = useState<string | null>(null);

    const [scriptLoaded, setScriptLoaded] = useState<boolean>(false);

    const clonedNavItems = bizerkCounter > 1 && bizerkMode !== 'off' ? shuffleList(site.leftNav.items) : site.leftNav.items;

    const handleAudio = (a: string) => {
        if (loaded)
            if (!audioPlaying) {
                buffers.play(a, false);
                setAudioPlaying(a);
            } else
            if (a === audioPlaying) {
                buffers.stop(a);
                setAudioPlaying(null);
            } else {
                buffers.stop(audioPlaying);
                buffers.play(a, false);
                setAudioPlaying(a);
            }
    };

    const handleImageClick = () => {
        if (site.leftNav.audio)
            handleAudio(site.leftNav.audio);
        if (site.leftNav.video)
            setSelectedContentItem(
                {
                    name: site.leftNav.text,
                    contentId: site.leftNav.video,
                    contentType: 'youtube',
                    thumb: '',
                    category: ''
                }
            );
    };

    useEffect(() => {
        if (selectedContentItem && audioPlaying && selectedSite !== 'art' && selectedSite !== 'games') {
            buffers.stop(audioPlaying);
            setAudioPlaying(null);
        }
        return () => {};
    }, [selectedContentItem, audioPlaying, selectedSite, buffers]);

    return (
        <>
            <Script
                id="text-fit"
                src="/scripts/textfit.js"
                onLoad={() => setScriptLoaded(true)}
            />
            { scriptLoaded && selectedSite !== 'gallery' && (
                <LeftNavContainer className={fullScreen ? 'off' : 'on'}>
                    <LeftNavMenu>
                        { clonedNavItems.map(i => (
                            <NavButton
                                key={i.name}
                                navItem={i}
                                audioCb={handleAudio}
                                navItemCb={setSelectedNavItem}
                                videoCb={setSelectedContentItem}
                                width={width}
                                fullScreen={fullScreen}
                            />
                        )) }
                    </LeftNavMenu>
                    <LeftAdd1 className={bizerkMode !== 'off' ? 'bizerk' : ''}>
                        <LeftAdd2 className={bizerkMode !== 'off' ? 'bizerk' : ''}>
                            <LeftContent>
                                <Image
                                    src={site.leftNav.image}
                                    alt={site.leftNav.text}
                                    fill
                                    sizes="100vw"
                                    onClick={() => handleImageClick()}
                                    style={{
                                        maxWidth: '100%',
                                    }}
                                />
                            </LeftContent>
                            <span dangerouslySetInnerHTML={{
                                __html: site.leftNav.text
                            }}
                            />
                        </LeftAdd2>
                    </LeftAdd1>
                </LeftNavContainer>
            ) }
        </>
    );
};
