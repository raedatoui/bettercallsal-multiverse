import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LeftAdd1,
    LeftAdd2,
    LeftContent,
    LeftNavButton,
    LeftNavContainer,
    LeftNavMenu,
    LeftNavItemCuck
} from '@/components/left-nav/elements';
import { useBizerkContext } from '@/providers/animations';
import { SoundContext } from '@/providers/audio-context';
import { useSiteContext } from '@/providers/sites';
import { WindowSizeContext } from '@/providers/window-size';
import { LeftNavNavItem } from '@/types';
import { shuffleList, slugify } from '@/utils';

interface ButtonProps {
    navItem: LeftNavNavItem;
    audioCb: (a: string) => void;
    navItemCb: (l: LeftNavNavItem) => void;
    videoCb: (v: LeftNavNavItem) => void;
    width: number;
    fullScreen: boolean;
}

const NavButton: FC<ButtonProps> = ({ navItem, audioCb, navItemCb, videoCb, width, fullScreen }) => {
    const ref = useRef<HTMLDivElement>(null);

    const scaleText = () => {
        if (window.textFit && ref.current && !fullScreen)
            window.textFit(ref.current, { alignVert: true, alignHoriz: false, detectMultiLine: false, widthOnly: false, maxFontSize: 34 });
    };

    useEffect(() => {
        scaleText();
        return () => {};
    }, [width, ref]);

    useEffect(() => {
        scaleText();
        return () => {};
    });

    const handleClick = () => {
        // TODO move providers here and remove callback functions. do too many provider subscriber slow things down?
        if (navItem.audio)
            audioCb(navItem.audio);
        if (navItem.category)
            navItemCb(navItem);
        if (navItem.video)
            videoCb(navItem);
    };

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

export const ClientLeftNav: FC<Props> = () => {
    const navigate = useNavigate();

    const {
        siteMap,
        selectedSite,
        fullScreen,
        unityInstance,
        setUnityInstance
    } = useSiteContext();

    const site = siteMap[selectedSite];

    const { bizerkCounter, bizerkMode } = useBizerkContext();
    const { buffers, loaded } = useContext(SoundContext);
    const { width } = useContext(WindowSizeContext);

    const [audioPlaying, setAudioPlaying] = useState<string | null>(null);

    const clonedNavItems = bizerkCounter > 1 && bizerkMode !== 'off' ? shuffleList(site.leftNav.items) : site.leftNav.items;

    const handleAudio = (a: string) => {
        // TODO: if art is playing, and click on any nav, stop pavane
        if (selectedSite === 'art')
            buffers.stop('/audio/art/pavane.mp3');
        if (loaded)
            if (!audioPlaying) {
                buffers.play(a, false);
                setAudioPlaying(a);
            } else if (a === audioPlaying) {
                buffers.stop(a);
                setAudioPlaying(null);
            } else {
                buffers.stop(audioPlaying);
                buffers.play(a, false);
                setAudioPlaying(a);
            }

    };

    const handleCategory = (l: LeftNavNavItem) => {
        // TODO: if unity is playing, and click on any nav, stop unity
        if (unityInstance && l.category === 'all') {
            buffers.stop('/audio/games/take-five.mp3');
            unityInstance.Quit()
                .then(() => {
                    setUnityInstance(null);
                    navigate('/');
                });
            return;
        }
        // TODO: if all is clicked, navigate home
        if (l.category === '' || l.category === 'all')
            navigate('/');
        else if (l.category === 'games')
            navigate(`/game/${slugify(l.name)}`); // nav names slugs to match content slugs
        else {
            const u = l.category === 'e-cards' ? '/e-cards' : `/category/${l.category}`;
            navigate(u);
        }
    };

    const handleVideo = (l: LeftNavNavItem) => {
        // TODO: this stops all audio when playing VIDEO content from left nav
        // for art content: audio is stopped by list
        // for games content: audio is allowed
        buffers.stopAll();
        navigate(`/video/${slugify(l.name)}`);
    };

    const handleImageClick = () => {
        // DOC suppress audio sal man
        if (site.leftNav.audio && selectedSite !== 'games')
            handleAudio(site.leftNav.audio);
        if (site.leftNav.video)
            navigate(`/video/${slugify(site.leftNav.text)}`);
    };

    return (
        <>
            <Script
                id="text-fit"
                src="/scripts/textfit.js"
            />

            <LeftNavContainer className={fullScreen ? 'off' : 'on'}>
                { selectedSite !== 'gallery' && (
                    <>
                        <LeftNavMenu>
                            { clonedNavItems.filter(i => i.category !== 'load').map(i => (
                                <NavButton
                                    key={i.name}
                                    navItem={i}
                                    audioCb={handleAudio}
                                    navItemCb={handleCategory}
                                    videoCb={handleVideo}
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
                    </>
                ) }
            </LeftNavContainer>
        </>
    );
};

export const ServerLeftNav: FC<Props> = () => {
    const {
        siteMap,
        selectedSite,
        fullScreen
    } = useSiteContext();

    const site = siteMap[selectedSite];

    const { width } = useContext(WindowSizeContext);
    const clonedNavItems = site.leftNav.items;

    return (
        <>
            <Script
                id="text-fit"
                src="/scripts/textfit.js"
            />
            <LeftNavContainer className={fullScreen ? 'off' : 'on'}>
                { selectedSite !== 'gallery' && (
                    <>
                        <LeftNavMenu>
                            { clonedNavItems.map(i => (
                                <NavButton
                                    key={i.name}
                                    navItem={i}
                                    audioCb={() => {}}
                                    navItemCb={(l: LeftNavNavItem) => l}
                                    videoCb={(l: LeftNavNavItem) => l}
                                    width={width}
                                    fullScreen={fullScreen}
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
                                        sizes="100vw"
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
                    </>
                ) }
            </LeftNavContainer>
        </>
    );
};
