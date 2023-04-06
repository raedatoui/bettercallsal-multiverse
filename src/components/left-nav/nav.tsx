import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import { LeftAdd1, LeftAdd2, LeftContent, LeftNavButton, LeftNavContainer, LeftNavMenu, LeftNavItemCuck } from 'src/components/left-nav/elements';
import { BaseContentItem, LeftNavNavItem } from 'src/types';
import { WindowSizeContext } from 'src/providers/window-size';
import { useSiteContext } from 'src/providers/sites';
import { SoundContext } from 'src/providers/audio-context';
import Image from 'next/image';
import Script from 'next/script';
import { AnimationContext } from 'src/providers/animations';
import { shuffleList } from 'src/utils';

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

    const scaleText = () => {
        if (window.textFit && ref.current && !fullScreen)
            window.textFit(ref.current, { alignVert: true, alignHoriz: false, detectMultiLine: false, widthOnly: false, maxFontSize: 34 });
    };

    useEffect(() => {
        scaleText();
    }, [width, ref]);

    useEffect(() => {
        scaleText();
    }, []);

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
    }, [clicked]);

    return (
        <LeftNavButton
            onClick={handleClick}
        >
            <LeftNavItemCuck
                ref={ref}
                dangerouslySetInnerHTML={{
                    __html: navItem.name
                }}
            />

        </LeftNavButton>
    );
};

interface Props {}

export const LeftNav: FC<Props> = () => {
    const { siteMap, selectedSite, setSelectedNavItem, selectedContentItem, setSelectedContentItem, fullScreen } = useSiteContext();
    const site = siteMap[selectedSite];

    const { buffers, loaded } = useContext(SoundContext);

    const [audioPlaying, setAudioPlaying] = useState<string | null>(null);

    const { width } = useContext(WindowSizeContext);
    const { bizerkCounter, bizerkOn } = useContext(AnimationContext);
    const [scriptLoaded, setScriptLoaded] = useState<boolean>(false);
    const [navItems, setNavItems] = useState<LeftNavNavItem[]>(site.leftNav.items);
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
    }, [selectedContentItem, audioPlaying, selectedSite]);

    useEffect(() => {
        if (bizerkCounter > 1)
            setNavItems(shuffleList(site.leftNav.items));
        else
            setNavItems(site.leftNav.items);
    }, [bizerkCounter, site.leftNav.items]);

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
                        { navItems.map(i => (
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
                    <LeftAdd1 className={bizerkOn ? 'bizerk' : ''}>
                        <LeftAdd2 className={bizerkOn ? 'bizerk' : ''}>
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
