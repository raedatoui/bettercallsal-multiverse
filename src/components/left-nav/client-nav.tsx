import Image from 'next/image';
import Script from 'next/script';
import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LeftAdd1, LeftAdd2, LeftContent, LeftNavContainer, LeftNavMenu } from '@/components/left-nav/elements';
import { useAnimationContext } from '@/providers/animations';
import { SoundContext } from '@/providers/audio-context';
import { useSiteContext } from '@/providers/sites';
import { WindowSizeContext } from '@/providers/window-size';
import { LeftNavItem } from '@/types';
import { pickRandom, shuffleList } from '@/utils';
import NavButton from './button';

export const ClientLeftNav = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { siteMap, selectedSite, fullScreen, unityInstance, setUnityInstance } = useSiteContext();
    const site = siteMap[selectedSite];

    const { bizerkMode, animateNav, animateWtf } = useAnimationContext();
    const { buffers, loaded } = useContext(SoundContext);
    const { width } = useContext(WindowSizeContext);

    const [audioPlaying, setAudioPlaying] = useState<string | null>(null);

    const [leftNavImage, setLeftNavImage] = useState<string>(site.leftNav.image);
    const [leftNavText, setLeftNavText] = useState<string>(site.leftNav.text);
    const [navItems, setNavItems] = useState<LeftNavItem[]>(site.leftNav.items);

    const handleAudio = (a: string) => {
        // DOC: if anything is playing, and click on any nav, stop it
        buffers.stopAll();
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
    const handleNav = (c: LeftNavItem) => {
        if (c.audio) handleAudio(c.audio);

        if (c.path) {
            if (unityInstance) {
                unityInstance.Quit().then(() => {
                    setUnityInstance(null);
                    if (c.path) navigate(c.path);
                });
                return;
            }
            navigate(c.path);
        }
    };

    // const handleCategory = (l: LeftNavItem) => {
    //     // DOC: if unity is playing, and click on any nav, stop unity
    //     // DOC: almost every category has audio, so the audioCb will handle it.
    //     if (unityInstance && l.category === 'all') {
    //         unityInstance.Quit().then(() => {
    //             setUnityInstance(null);
    //             navigate('/');
    //         });
    //         return;
    //     }
    //     // DOC: if all is clicked, navigate home
    //     if (l.category === '' || l.category === 'all') navigate('/');
    //     // nav names slugs to match content slugs
    //     else {
    //         const u = l.category === 'e-cards' ? '/e-cards' : `/category/${l.category}`;
    //         navigate(u);
    //     }
    // };

    // const handleContent = (l: LeftNavItem) => {
    //
    // };
    //
    // const handleVideo = (l: LeftNavItem) => {
    //     // DOC: this stops all audio when playing VIDEO content from left nav
    //     // for art content: audio is stopped by list
    //     // for games content: audio is allowed
    //     // buffers.stopAll();
    //     navigate(`/video/${slugify(l.name)}`);
    // };

    const handleImageClick = () => {
        // DOC: dont play if we are in a game
        if (site.leftNav.audio) {
            if (location.pathname.startsWith('/game')) return;
            handleAudio(site.leftNav.audio);
        }
        if (site.leftNav.path) navigate(site.leftNav.path);
    };

    useEffect(() => {
        if (animateNav > 0 || animateWtf > 0) {
            const l = shuffleList(site.leftNav.items).slice(0, 7);
            setLeftNavImage(pickRandom(siteMap).leftNav.image);
            setLeftNavText(pickRandom(siteMap).leftNav.text);

            // if (selectedSite === 'wtf') l = l.slice(0, 7);
            setNavItems(l);
        }
    }, [animateNav, animateWtf, site]);

    useEffect(() => {
        setNavItems(site.leftNav.items);
        setLeftNavImage(site.leftNav.image);
        setLeftNavText(site.leftNav.text);
    }, [site]);

    return (
        <>
            <Script id="text-fit" src="/scripts/textfit.js" />

            <LeftNavContainer className={`animatable ${fullScreen ? 'off' : 'on'}`}>
                {selectedSite !== 'gallery' && (
                    <>
                        <LeftNavMenu>
                            {navItems.map((i) => (
                                <NavButton
                                    key={i.id}
                                    navItem={i}
                                    callBack={handleNav}
                                    // audioCb={handleAudio}
                                    // navItemCb={handleCategory}
                                    // videoCb={handleVideo}
                                    // contentCb={handleContent}
                                    width={width}
                                    fullScreen={fullScreen}
                                />
                            ))}
                        </LeftNavMenu>
                        <LeftAdd1 className={bizerkMode !== 'off' ? 'bizerk' : ''}>
                            <LeftAdd2 className={bizerkMode !== 'off' ? 'bizerk' : ''}>
                                <LeftContent>
                                    <Image
                                        src={leftNavImage}
                                        alt={leftNavText}
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
                                        __html: leftNavText,
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
