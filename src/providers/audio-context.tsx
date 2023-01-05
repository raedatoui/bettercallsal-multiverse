import React, { createContext, FC, useContext, useMemo, useEffect, useState } from 'react';
import { SiteContext } from './site-provider';
import AudioBuffers from './audio-buffer';

type SoundProviderType = {
    buffers: AudioBuffers,
    loaded: boolean
};

const buffers = new AudioBuffers();

const SoundContext = createContext<SoundProviderType>({ buffers, loaded: false });

interface ProviderProps {
    children: JSX.Element;
}
const SoundProvider:FC<ProviderProps> = ({ children }) => {
    const { siteMap, selectedSite } = useContext(SiteContext);
    const site = siteMap[selectedSite];
    const [loaded, setLoaded] = useState<boolean>(false);

    const audioBuffers = useMemo<SoundProviderType>(() => {
        if (site)
            buffers.updateSite(site).then(() => {});
        return { buffers, loaded };
    }, [site, loaded]);

    useEffect(() => {
        setLoaded(buffers.loaded);
    }, []);

    useEffect(() => {
        buffers.createContext();
        if (site)
            buffers.updateSite(site).then(() => {});
    }, [site]);

    return (
        <SoundContext.Provider value={audioBuffers}>
            { children }
        </SoundContext.Provider>
    );
};

export { SoundProvider, SoundContext };
