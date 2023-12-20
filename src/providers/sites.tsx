import axios from 'axios';
import React, { FC, useMemo, useState, createContext, useContext, useCallback } from 'react';
import { z } from 'zod';
import { CONTENT_URL } from '@/constants';
import { BaseContentItem, BaseContentItemValidator, ContentMap, GameContentItem, GameContentItemValidator, SiteKey, SiteMap } from '@/types';

type SiteProviderType = {
    siteMap: SiteMap;
    contentMap: ContentMap;
    loading: boolean;
    selectedSite: SiteKey;
    setSelectedSite: (s: SiteKey) => void;
    fullScreen: boolean;
    setFullScreen: (b: boolean) => void;
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
    world: [],
};

const SiteContext = createContext<SiteProviderType | undefined>(undefined);

interface ProviderProps {
    children: JSX.Element;
    defaultSite: SiteKey;
    defaultSiteMap: SiteMap;
    defaultContent: (BaseContentItem | GameContentItem)[];
}

const fetchData = async (siteKey: SiteKey): Promise<(BaseContentItem | GameContentItem)[]> => {
    const list: (BaseContentItem | GameContentItem)[] = [];
    try {
        const { data: response } = await axios.get(`${CONTENT_URL}/content-${siteKey}.json`);

        const items = z.array(z.unknown()).parse(response.items);
        const siteSchema = z.object({
            contentType: z.string(),
        });

        items.forEach((i: unknown) => {
            const { contentType } = siteSchema.parse(i);
            if (contentType === 'game' || contentType === 'gallery') list.push(GameContentItemValidator.parse(i));
            else list.push(BaseContentItemValidator.parse(i));
        });
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

    const setSite = useCallback(
        (s: SiteKey) => {
            if (s !== selectedSite) {
                setLoading(true);
                setSelectedSite(s);
                if (s !== 'construction' && contentMap[s].length === 0)
                    fetchData(s).then((list) => {
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

    const providedSites = useMemo<SiteProviderType>(
        () => ({
            siteMap: defaultSiteMap,
            selectedSite,
            setSelectedSite: setSite,
            loading,
            contentMap,
            fullScreen,
            setFullScreen,
        }),
        [defaultSiteMap, selectedSite, setSite, loading, contentMap, fullScreen]
    );

    return <SiteContext.Provider value={providedSites}>{children}</SiteContext.Provider>;
};

function useSiteContext() {
    const context = useContext(SiteContext);
    if (context === undefined) throw new Error('useContext must be used within a SiteProvider');

    return context;
}

export { SitesDataProvider, SiteContext, useSiteContext };
