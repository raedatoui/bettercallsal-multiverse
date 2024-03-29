import React, { createContext, FC, useMemo, useEffect, useState } from 'react';
import { useAnimationContext } from '@/providers/animations';
import { AudioElement, AudioElementValidator, isNotNull, Site } from '@/types';
import AudioBuffers from './audio-buffer';
import { useSiteContext } from './sites';

type SoundProviderType = {
    buffers: AudioBuffers;
    loaded: boolean;
    play: (audioElement: AudioElement, filter?: string) => void;
    stop: (audioElement: AudioElement, filter?: string) => void;
    pause: (audioElement: AudioElement, filter?: string) => void;
    stopAll: () => void;
};

const buffers = new AudioBuffers();

const SoundContext = createContext<SoundProviderType>({
    buffers,
    loaded: false,
    play: () => null,
    stop: () => null,
    pause: () => null,
    stopAll: () => null,
});

interface ProviderProps {
    children: JSX.Element;
}

const getSiteSoundFiles = (site: Site): string[] => {
    const navSounds = site.leftNav.items.map((i) => i.audio).filter(isNotNull);
    const sounds = [site.header.ringAudio, site.header.spinningSalAudio1, site.header.spinningSalAudio2, site.footer.ringAudio, ...navSounds];
    if (site.leftNav.audio) sounds.push(site.leftNav.audio);
    return sounds;
};

const getSiteSoundMap = (site: Site): Record<string, string> => {
    const map: Record<string, string> = {
        [AudioElementValidator.enum.headerRing]: site.header.ringAudio,
        [AudioElementValidator.enum.footerRing]: site.footer.ringAudio,
        [AudioElementValidator.enum.spinningRight]: site.header.spinningSalAudio1,
        [AudioElementValidator.enum.spinningLeft]: site.header.spinningSalAudio2,
    };
    if (site.leftNav.audio) map[AudioElementValidator.enum.leftNavAudio] = site.leftNav.audio;
    site.leftNav.items.forEach((i) => {
        if (i.audio) map[`${AudioElementValidator.enum.leftNavItemAudio}-${i.name}`] = i.audio;
    });
    return map;
};

const SoundProvider: FC<ProviderProps> = ({ children }) => {
    const { siteMap, selectedSite } = useSiteContext();
    const site = siteMap[selectedSite];
    const [loaded, setLoaded] = useState<boolean>(false);
    const { bizerkMode } = useAnimationContext();

    const play = (audioElement: AudioElement, filter?: string) => {
        const k = `${audioElement}${filter ? `-${filter}` : ''}`;
        buffers.playFromMap(k, false);
    };

    const stop = (audioElement: AudioElement, filter?: string) => {
        const k = `${audioElement}${filter ? `-${filter}` : ''}`;
        buffers.stop(k);
    };

    const pause = (audioElement: AudioElement, filter?: string) => {
        const k = `${audioElement}${filter ? `-${filter}` : ''}`;
        buffers.pause(k);
    };

    const audioBuffers = useMemo<SoundProviderType>(
        () => ({
            buffers,
            loaded,
            play,
            stop,
            pause,
            stopAll: buffers.stopAll,
        }),
        [loaded]
    );

    useEffect(() => {
        buffers.createContext();
        const loadSounds = async () => {
            await buffers.loadSounds(getSiteSoundFiles(site));
            buffers.mapBuffers(getSiteSoundMap(site));
        };
        loadSounds().then(() => setLoaded(buffers.loaded));
    }, [site]);

    useEffect(() => {
        if (bizerkMode !== 'off') buffers.bizerk(selectedSite);
    }, [bizerkMode, selectedSite]);

    return <SoundContext.Provider value={audioBuffers}>{children}</SoundContext.Provider>;
};

export { SoundProvider, SoundContext };
