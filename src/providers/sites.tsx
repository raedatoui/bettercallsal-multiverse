import axios from 'axios';
import React, { FC, useMemo, useState, createContext, useContext, useCallback } from 'react';
import { CONTENT_URL } from '@/constants';
import {
    BaseContentItem,
    BaseContentListValidator,
    ContentMap,
    GameContentItem,
    GameContentListValidator,
    SiteKey,
    SiteMap,
    UnityInstance,
} from '@/types';

type SiteProviderType = {
    siteMap: SiteMap;
    contentMap: ContentMap;
    loading: boolean;
    selectedSite: SiteKey;
    setSelectedSite: (s: SiteKey) => void;
    fullScreen: boolean;
    setFullScreen: (b: boolean) => void;
    unityInstance: UnityInstance | null;
    setUnityInstance: (i: UnityInstance | null) => void;
};

const defaultContentMap = {
    biz: [],
    fit: [],
    art: [],
    rocks: [],
    games: [],
    construction: [],
    gallery: [],
    wtf: [],
};

const SiteContext = createContext<SiteProviderType | undefined>(undefined);

interface ProviderProps {
    children: JSX.Element;
    defaultSite: SiteKey;
    defaultSiteMap: SiteMap;
    defaultContent: (BaseContentItem | GameContentItem)[];
}

const fetchData = async (siteKey: SiteKey): Promise<(BaseContentItem | GameContentItem)[]> => {
    let list;
    try {
        console.log(`${CONTENT_URL}/content/content-${siteKey}.json`);
        const { data: response } = await axios.get(`${CONTENT_URL}/content/content-${siteKey}.json`);
        if (siteKey === 'games' || siteKey === 'gallery') list = GameContentListValidator.parse(response.items);
        else list = BaseContentListValidator.parse(response.items);
        return list;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const SitesDataProvider: FC<ProviderProps> = ({ children, defaultSite, defaultContent, defaultSiteMap }) => {
    const [selectedSite, setSelectedSite] = useState<SiteKey>(defaultSite);
    const [contentMap, setContentMap] = useState<ContentMap>({
        ...defaultContentMap,
        [defaultSite]: defaultContent,
    });

    const [loading, setLoading] = useState<boolean>(false);

    const [fullScreen, setFullScreen] = useState<boolean>(false);
    const [unityInstance, setUnityInstance] = useState<UnityInstance | null>(null);

    const setSite = useCallback(
        (s: SiteKey) => {
            if (s !== selectedSite) {
                setLoading(true);
                setSelectedSite(s);
                if (s !== 'construction' && contentMap[s].length === 0)
                    fetchData(s).then((list) => {
                        const site = defaultSiteMap[s];
                        if (site?.leftNav.video)
                            list?.push({
                                name: site.leftNav.text,
                                contentId: site.leftNav.video,
                                contentType: 'youtube',
                                thumb: '',
                                category: '',
                                display: false,
                                site: selectedSite,
                            } as BaseContentItem);

                        site?.leftNav.items.forEach((i) => {
                            if (i.video)
                                list?.push({
                                    name: i.name,
                                    contentId: i.video,
                                    contentType: 'youtube',
                                    thumb: '',
                                    category: '',
                                    display: false,
                                    site: selectedSite,
                                });
                        });

                        setContentMap({
                            ...contentMap,
                            [s]: list,
                        });

                        setLoading(false);
                    });
                else setLoading(false);
            }
        },
        [contentMap, defaultSiteMap, selectedSite]
    );

    // TODO: how to randomize on load without violating hydration?
    // useEffect(() => {
    //     if (selectedSite === 'wtf') setSiteMap(siteMapWtfGenerator(defaultSiteMap));
    // }, [defaultSiteMap, selectedSite]);

    const providedSites = useMemo<SiteProviderType>(
        () => ({
            siteMap: defaultSiteMap,
            selectedSite,
            setSelectedSite: setSite,
            loading,
            contentMap,
            fullScreen,
            setFullScreen,
            unityInstance,
            setUnityInstance,
        }),
        [defaultSiteMap, selectedSite, setSite, loading, contentMap, fullScreen, unityInstance]
    );

    return <SiteContext.Provider value={providedSites}>{children}</SiteContext.Provider>;
};

function useSiteContext() {
    const context = useContext(SiteContext);
    if (context === undefined) throw new Error('useContext must be used within a SiteProvider');

    return context;
}

export { SitesDataProvider, SiteContext, useSiteContext };
