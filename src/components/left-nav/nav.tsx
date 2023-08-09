import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import React, { FC, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
    const location = useLocation();
    const navigate = useNavigate();

    const {
        siteMap,
        selectedSite,
        setArtAudioPlaying,
        artAudioPlaying,
        fullScreen
    } = useSiteContext();

    const site = siteMap[selectedSite];

    const { bizerkCounter, bizerkMode } = useBizerkContext();
    const { buffers, loaded } = useContext(SoundContext);
    const { width } = useContext(WindowSizeContext);

    const [audioPlaying, setAudioPlaying] = useState<string | null>(null);

    const clonedNavItems = bizerkCounter > 1 && bizerkMode !== 'off' ? shuffleList(site.leftNav.items) : site.leftNav.items;

    const handleAudio = (a: string) => {
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
        setArtAudioPlaying(false);
    };

    const handleImageClick = () => {
        if (site.leftNav.audio)
            handleAudio(site.leftNav.audio);
        if (site.leftNav.video)
            navigate(`/video/${slugify(site.leftNav.text)}`);
    };

    useEffect(() => {
        if (location.pathname !== '/' && !location.pathname.startsWith('/category')) {
            if (audioPlaying)
                buffers.stop(audioPlaying);
            setAudioPlaying(null);
        }
        return () => {};
    }, [audioPlaying, buffers, location]);

    useEffect(() => {
        if (artAudioPlaying) {
            if (audioPlaying) buffers.stop(audioPlaying);
            buffers.play('/audio/art/pavane.mp3', false);
            setAudioPlaying('/audio/art/pavane.mp3');
        }
    }, [artAudioPlaying, buffers, audioPlaying]);

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
                                    audioCb={handleAudio}
                                    navItemCb={(l: LeftNavNavItem) => {
                                        if (l.category === '' || l.category === 'all')
                                            navigate('/');
                                        else if (l.category === 'games')
                                            navigate(`/game/${slugify(l.name)}`); // nav names slugs to match content slugs
                                        else {
                                            const u = l.category === 'e-cards' ? '/e-cards' : `/category/${l.category}`;
                                            navigate(u);
                                        }
                                    }}
                                    videoCb={(l: LeftNavNavItem) => {
                                        navigate(`/video/${slugify(l.name)}`);
                                    }}
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
    );
};
