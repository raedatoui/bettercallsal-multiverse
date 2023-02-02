import React, { FC, useMemo, useState, createContext, useEffect } from 'react';
import axios from 'axios';
import { CDN } from 'src/constants';
import {
    BaseContentItem,
    BaseContentListValidator,
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
};

const defaultContentMap = {
    biz: [],
    fit: [],
    art: [],
    rocks: [],
    games: [],
    construction: [],
};

const SiteContext = createContext<SiteProviderType | undefined>(undefined);

// {
//     siteMap: defaultSiteMap,
//         selectedSite: SiteKeyValidator.parse(process.env.selectedSite),
//     setSelectedSite: () => {},
//     contentMap: defaultContentMap,
//     loading: true,
//     selectedNavItem: null,
//     setSelectedNavItem: () => {},
//     selectedContentItem: null,
//     setSelectedContentItem: () => {}
// }

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

    const setSite = (s: SiteKey) => {
        setSelectedNavItem(null);
        setSelectedContentItem(null);
        setSelectedSite(s);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: response } = await axios.get(`${CDN}/content/content-${selectedSite}.json`);

                if (selectedSite === 'games')
                    setContentMap({
                        ...contentMap,
                        games: GameContentListValidator.parse(response.items)
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

        if (selectedSite !== 'construction' && contentMap[selectedSite].length === 0) {
            setLoading(true);
            fetchData();
        } else
            setLoading(false);

    }, [contentMap, selectedSite]);

    useEffect(() => {
        if (selectedSite === 'games' && selectedNavItem !== null) {
            const selectedGame = contentMap.games.filter(g => g.contentId === selectedNavItem.category);
            if (selectedGame.length)
                setSelectedContentItem(selectedGame[0]);
        }
    }, [selectedNavItem, selectedSite]);

    const providedSites = useMemo<SiteProviderType>(() => ({
        siteMap: defaultSiteMap,
        selectedSite,
        setSelectedSite: setSite,
        loading,
        contentMap,
        selectedNavItem,
        setSelectedNavItem,
        selectedContentItem,
        setSelectedContentItem,
    }), [selectedSite, loading, contentMap, selectedNavItem, selectedContentItem]);

    return (
        <SiteContext.Provider value={providedSites}>
            {children}
        </SiteContext.Provider>
    );
};

function useSiteContext() {
    const context = React.useContext(SiteContext);
    if (context === undefined)
        throw new Error('useCount must be used within a SiteProvider');

    return context;
}

export { SitesDataProvider, SiteContext, useSiteContext };
