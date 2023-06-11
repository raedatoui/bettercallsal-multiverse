import React, { FC, useMemo, useState, createContext, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { CDN } from 'src/constants';
import {
    BaseContentItem,
    BaseContentListValidator,
    BizerkMode,
    ContentMap,
    GameContentItem,
    GameContentListValidator,
    LeftNavNavItem,
    SiteKey,
    SiteMap,
} from '../types';

type SiteProviderType = {
    siteMap: SiteMap,
    contentMap: ContentMap,
    loading: boolean,
    selectedSite: SiteKey,
    setSelectedSite: (s: SiteKey) => void,
    selectedNavItem: LeftNavNavItem | null,
    setSelectedNavItem: (l: LeftNavNavItem | null) => void,
    selectedContentItem: BaseContentItem | GameContentItem | null,
    setSelectedContentItem: (i: BaseContentItem | GameContentItem | null) => void,
    fullScreen: boolean,
    setFullScreen: (b: boolean) => void,
    bizerkMode: BizerkMode,
    setBizerkMode: (a: BizerkMode) => void,
    keyPressed: string | null,
    artAudioPlaying: boolean,
    setArtAudioPlaying: (b: boolean) => void,
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
    const [selectedNavItem, setSelectedNavItem] = useState<LeftNavNavItem | null>(null);
    const [selectedContentItem, setSelectedContentItem] = useState<BaseContentItem | GameContentItem | null>(null);

    const [contentRowScroll, setContentRowScroll] = useState<number>(0);
    const [fullScreen, setFullScreen] = useState<boolean>(false);
    const [bizerkMode, setBizerkMode] = useState<BizerkMode>('off');
    const [keyPressed, setKeyPressed] = useState<string | null>(null);
    const [artAudioPlaying, setArtAudioPlaying] = useState<boolean>(false);

    const setSite = useCallback((s: SiteKey) => {
        if (s !== selectedSite) {
            setSelectedNavItem(null);
            setSelectedContentItem(null);
            setLoading(true);
            setSelectedSite(s);
        }
    }, [selectedSite]);

    const setContentItem = useCallback((c: BaseContentItem | GameContentItem | null) => {
        // TODO this kind of sucks and useEffect sucks balls for this.
        const contentRow = document.getElementById('content-row');
        const contentList = document.getElementById('content-list');
        const header = document.getElementById('main-header');

        if (contentList && contentRow && header)
            if (c === null) {
                if (selectedSite === 'biz')
                    setTimeout(() => {
                        contentRow.scrollTo({
                            top: contentRowScroll,
                            behavior: 'auto'
                        });
                        document.body.scrollTo({
                            top: contentRowScroll,
                            behavior: 'auto'
                        });
                    }, 50);

            } else {
                let s = 0;
                const cl = contentList.getBoundingClientRect().top;
                const co = contentRow.getBoundingClientRect().top;
                const h = header.getBoundingClientRect().height;
                const delta = Math.abs(co - h);

                if (delta < 5)
                    if (cl > 0)
                        s += co - cl - 53; // TODO height of caption
                    else s += Math.abs(cl - co - 53);

                else
                if (cl > 0)
                    s += co - cl - 53;
                else s += Math.abs(cl - 53 - h);

                setContentRowScroll(s);

                document.body.scrollTo(0, 0);
                document.getElementById('content-row')?.scrollTo(0, 0);
            }

        setSelectedContentItem(c);
        if (c === null)
            setFullScreen(false);
    }, [contentRowScroll, selectedSite]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: response } = await axios.get(`${CDN}/content/content-${selectedSite}.json`);
                if (selectedSite === 'games')
                    setContentMap({
                        ...contentMap,
                        games: GameContentListValidator.parse(response.items)
                    });
                else if (selectedSite === 'gallery')
                    setContentMap({
                        ...contentMap,
                        gallery: GameContentListValidator.parse(response.items)
                    });
                else
                    setContentMap({
                        ...contentMap,
                        [selectedSite]: BaseContentListValidator.parse(response.items)
                    });
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
    }, [contentMap, selectedSite]);

    useEffect(() => {
        if (selectedSite === 'games' && selectedNavItem !== null) {
            const selectedGame = contentMap.games.filter(g => g.contentId === selectedNavItem.category);
            if (selectedGame.length)
                setSelectedContentItem(selectedGame[0]);
        }
    }, [contentMap.games, selectedNavItem, selectedSite]);

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
        selectedNavItem,
        setSelectedNavItem,
        selectedContentItem,
        setSelectedContentItem: setContentItem,
        setFullScreen,
        fullScreen,
        bizerkMode,
        setBizerkMode,
        keyPressed,
        artAudioPlaying,
        setArtAudioPlaying
    }), [
        bizerkMode,
        defaultSiteMap,
        selectedSite,
        setSite,
        loading,
        contentMap,
        selectedNavItem,
        selectedContentItem,
        setContentItem,
        keyPressed,
        fullScreen,
        artAudioPlaying
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
