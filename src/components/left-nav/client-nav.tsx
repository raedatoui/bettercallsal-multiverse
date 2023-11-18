import Image from 'next/image';
import Script from 'next/script';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LeftAdd1, LeftAdd2, LeftContent, LeftNavContainer, LeftNavMenu } from '@/components/left-nav/elements';
import { WTF_RANDOM } from '@/constants';
import { useAnimationContext, useBizerkContext } from '@/providers/animations';
import { SoundContext } from '@/providers/audio-context';
import { useSiteContext } from '@/providers/sites';
import { WindowSizeContext } from '@/providers/window-size';
import { LeftNavItem, Site } from '@/types';
import { pickRandom, shuffleList, slugify } from '@/utils';
import NavButton from './button';

export const ClientLeftNav = () => {
    const navigate = useNavigate();

    const { siteMap, selectedSite, fullScreen, unityInstance, setUnityInstance } = useSiteContext();
    const site = siteMap[selectedSite];

    const { animateGrid, animateHeaderFooter } = useAnimationContext();
    const { bizerkCounter, bizerkMode } = useBizerkContext();
    const { buffers, loaded } = useContext(SoundContext);
    const { width } = useContext(WindowSizeContext);

    const [audioPlaying, setAudioPlaying] = useState<string | null>(null);
    const [initialState, setInitialState] = useState<string>(selectedSite === 'wtf' ? 'off' : '');
    const [leftNav, setLeftNav] = useState<Site>(site);

    const [navItems, setNavItems] = useState<LeftNavItem[]>(site.leftNav.items);

    const handleAudio = (a: string) => {
        // DOC: if art is playing, and click on any nav, stop pavane
        if (selectedSite === 'art') buffers.stop('/audio/art/pavane.mp3');
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

    const handleCategory = (l: LeftNavItem) => {
        // DOC: if unity is playing, and click on any nav, stop unity, stop sal-man audio
        if (unityInstance && l.category === 'all') {
            buffers.stop('/audio/games/take-five.mp3');
            unityInstance.Quit().then(() => {
                setUnityInstance(null);
                navigate('/');
            });
            return;
        }
        // DOC: if all is clicked, navigate home
        if (l.category === '' || l.category === 'all') navigate('/');
        else if (l.category === 'games') navigate(`/game/${slugify(l.name)}`);
        // nav names slugs to match content slugs
        else {
            const u = l.category === 'e-cards' ? '/e-cards' : `/category/${l.category}`;
            navigate(u);
        }
    };

    const handleVideo = (l: LeftNavItem) => {
        // DOC: this stops all audio when playing VIDEO content from left nav
        // for art content: audio is stopped by list
        // for games content: audio is allowed
        buffers.stopAll();
        navigate(`/video/${slugify(l.name)}`);
    };

    const handleImageClick = () => {
        // DOC: suppress audio sal man
        if (site.leftNav.audio && selectedSite !== 'games') handleAudio(site.leftNav.audio);
        if (site.leftNav.video) navigate(`/video/${slugify(site.leftNav.text)}`);
    };

    const animate = useCallback(() => {
        let counter = 0;
        setInitialState('');
        const interval = setInterval(() => {
            setNavItems(shuffleList(navItems).slice(0, 6));
            setLeftNav(pickRandom(siteMap, [leftNav.name]));

            counter += 1;
            if (counter === WTF_RANDOM.limit) clearInterval(interval);
        }, WTF_RANDOM.interval);
    }, [navItems]);

    useEffect(() => {
        // DOC: bizerk shuffle
        if (bizerkCounter > 1 && bizerkMode !== 'off') {
            setNavItems(shuffleList(site.leftNav.items));
            // DOC: shuffle left nav items on bizerk hover if wtf is selected
            if (selectedSite === 'wtf') setLeftNav(pickRandom(siteMap));
            return;
        }
        // if ((animateGrid > 0 || bizerkCounter > 0 ) && selectedSite === 'wtf') {
        //     setLeftNav(pickRandom(siteMap).leftNav);
        //     return;
        // }

        // DOC: wtf load anim
        if (selectedSite === 'wtf' && loaded) animate();
    }, [selectedSite, animateGrid, animateHeaderFooter, bizerkMode, bizerkCounter, loaded, site.leftNav.items]);

    useEffect(() => {
        setNavItems(site.leftNav.items);
        setLeftNav(site);
    }, [site]);

    return (
        <>
            <Script id="text-fit" src="/scripts/textfit.js" />

            <LeftNavContainer className={fullScreen ? 'off' : 'on'}>
                {selectedSite !== 'gallery' && (
                    <>
                        <LeftNavMenu>
                            {navItems
                                .filter((i) => i.category !== 'load')
                                .map((i) => (
                                    <NavButton
                                        className={initialState}
                                        key={i.id}
                                        navItem={i}
                                        audioCb={handleAudio}
                                        navItemCb={handleCategory}
                                        videoCb={handleVideo}
                                        width={width}
                                        fullScreen={fullScreen}
                                    />
                                ))}
                        </LeftNavMenu>
                        <LeftAdd1 className={bizerkMode !== 'off' ? 'bizerk' : ''}>
                            <LeftAdd2 className={bizerkMode !== 'off' ? 'bizerk' : ''}>
                                <LeftContent>
                                    <Image
                                        src={leftNav.leftNav.image}
                                        alt={leftNav.leftNav.text}
                                        fill
                                        sizes="100vw"
                                        onClick={() => handleImageClick()}
                                        style={{
                                            maxWidth: '100%',
                                        }}
                                    />
                                </LeftContent>
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: leftNav.leftNav.text,
                                    }}
                                />
                            </LeftAdd2>
                        </LeftAdd1>
                    </>
                )}
            </LeftNavContainer>
        </>
    );
};
