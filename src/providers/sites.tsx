import axios from 'axios';
import React, { FC, useMemo, useState, createContext, useEffect, useContext, useCallback } from 'react';
import { CDN } from '@/constants';
import {
    BaseContentItem,
    BaseContentListValidator,
    ContentMap,
    GameContentItem,
    GameContentListValidator,
    SiteKey,
    SiteMap, UnityInstance,
} from '@/types';

type SiteProviderType = {
    siteMap: SiteMap,
    contentMap: ContentMap,
    loading: boolean,
    selectedSite: SiteKey,
    setSelectedSite: (s: SiteKey) => void,
    keyPressed: string | null,
    fullScreen: boolean,
    setFullScreen: (b: boolean) => void,
    unityInstance: UnityInstance | null,
    setUnityInstance: (i: UnityInstance | null) => void,
};

const defaultContentMap = {
    biz: [],
    fit: [],
    art: [],
    rocks: [],
    games: [],
    construction: [],
    gallery: [],
};

const SiteContext = createContext<SiteProviderType | undefined>(undefined);

interface ProviderProps {
    children: JSX.Element;
    defaultSite: SiteKey;
    defaultSiteMap: SiteMap;
    defaultContent: (BaseContentItem | GameContentItem)[]
}

const SitesDataProvider:FC<ProviderProps> = ({ children, defaultSite, defaultContent, defaultSiteMap }) => {
    const [selectedSite, setSelectedSite] = useState<SiteKey>(defaultSite);
    const [contentMap, setContentMap] = useState<ContentMap>({
        ...defaultContentMap,
        [defaultSite]: defaultContent
    });
    const [loading, setLoading] = useState<boolean>(false);

    const [keyPressed, setKeyPressed] = useState<string | null>(null);
    const [fullScreen, setFullScreen] = useState<boolean>(false);
    const [unityInstance, setUnityInstance] = useState<UnityInstance | null>(null);

    const setSite = useCallback((s: SiteKey) => {
        if (s !== selectedSite) {
            setLoading(true);
            setSelectedSite(s);
        }
    }, [selectedSite]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: response } = await axios.get(`${CDN}/content/content-${selectedSite}.json`);
                if (selectedSite === 'games' || selectedSite === 'gallery')
                    setContentMap({
                        ...contentMap,
                        games: GameContentListValidator.parse(response.items)
                    });
                else {
                    const site = defaultSiteMap[selectedSite];
                    const list = BaseContentListValidator.parse(response.items);
                    if (site.leftNav.video)
                        list.push({
                            name: site.leftNav.text,
                            contentId: site.leftNav.video,
                            contentType: 'youtube',
                            thumb: '',
                            category: '',
                            display: false
                        });

                    site.leftNav.items.forEach(i => {
                        if (i.video)
                            list.push({
                                name: i.name,
                                contentId: i.video,
                                contentType: 'youtube',
                                thumb: '',
                                category: '',
                                display: false
                            });
                    });
                    console.log({
                        ...contentMap,
                        [selectedSite]: list
                    });
                    setContentMap({
                        ...contentMap,
                        [selectedSite]: list
                    });
                }
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        };

        if (selectedSite !== 'construction' && contentMap[selectedSite].length === 0)
            fetchData();
        else
            setLoading(false);
        return () => {};
    }, [contentMap, selectedSite, defaultSiteMap]);

    useEffect(() => {
        const downHandler = (ev:KeyboardEvent) => {
            setKeyPressed(ev.key);
        };

        const upHandler = () => {
            setTimeout(() => {
                setKeyPressed(null);
            }, 100);
        };

        window.addEventListener('keydown', downHandler);
        window.addEventListener('keyup', upHandler);

        return () => {
            window.removeEventListener('keydown', downHandler);
            window.removeEventListener('keyup', upHandler);
        };
    });

    const providedSites = useMemo<SiteProviderType>(() => ({
        siteMap: defaultSiteMap,
        selectedSite,
        setSelectedSite: setSite,
        loading,
        contentMap,
        keyPressed,
        fullScreen,
        setFullScreen,
        unityInstance,
        setUnityInstance
    }), [
        defaultSiteMap,
        selectedSite,
        setSite,
        loading,
        contentMap,
        keyPressed,
        fullScreen,
        unityInstance,
    ]);

    return (
        <SiteContext.Provider value={providedSites}>
            {children}
        </SiteContext.Provider>
    );
};

function useSiteContext() {
    const context = useContext(SiteContext);
    if (context === undefined)
        throw new Error('useContext must be used within a SiteProvider');

    return context;
}

export { SitesDataProvider, SiteContext, useSiteContext };
