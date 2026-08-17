'use client';

import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import Script from 'next/script';
import { useContext, useEffect, useState } from 'react';
import { LeftAdd1, LeftAdd2, LeftContent, LeftNavContainer, LeftNavMenu } from '@/components/left-nav/elements';
import { useAnimationContext } from '@/providers/animations';
import { SoundContext } from '@/providers/audio-context';
import { useSiteContext } from '@/providers/sites';
import { WindowSizeContext } from '@/providers/window-size';
import type { LeftNavItem } from '@/types';
import { pickRandom, shuffleList } from '@/utils';
import NavButton from './button';

export const ClientLeftNav = () => {
    const router = useRouter();
    const pathname = usePathname();

    const { siteMap, selectedSite, fullScreen } = useSiteContext();
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

        if (c.path && c.path !== pathname) router.push(c.path);
    };

    const handleImageClick = () => {
        // DOC: dont play if we are in a game
        if (site.leftNav.audio) {
            if (pathname.startsWith('/game')) return;
            handleAudio(site.leftNav.audio);
        }
        if (site.leftNav.path) router.push(site.leftNav.path);
    };

    // DOC: only shuffle nav list on animate nav
    useEffect(() => {
        if (animateNav > 0) setNavItems(shuffleList(site.leftNav.items));
    }, [animateNav, site]);

    // DOC: randomize entire nav on animate wtf
    useEffect(() => {
        if (animateWtf > 0) {
            setLeftNavImage(pickRandom(siteMap).leftNav.image);
            setLeftNavText(pickRandom(siteMap).leftNav.text);
            // setNavItems(site.leftNav.items.sort((a, b) => a.name.localeCompare(b.name)));
            setNavItems(shuffleList(site.leftNav.items).slice(0, Math.floor(Math.random() * 3) + 5));
        }
    }, [animateWtf, site]);

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
                                <NavButton key={i.id} navItem={i} callBack={handleNav} width={width} fullScreen={fullScreen} />
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
