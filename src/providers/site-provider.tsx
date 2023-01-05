import React, { FC, useMemo, useState, createContext, useEffect } from 'react';
import axios from 'axios';
import { CDN } from 'src/constants';
import {
    BaseContentItem,
    BaseContentListValidator,
    ContentMap,
    SiteKey,
    SiteMap,
    SiteMapValidator
} from '../types';
import sitesData from '../../public/content/sites.json';

type SiteProviderType = {
    siteMap: SiteMap,
    selectedSite: SiteKey,
    setSelectedSite: (s: SiteKey) => void,
    contentMap: ContentMap,
    loading: boolean,
    contentFilter: string,
    setContentFilter: (c: string) => void,
    selectedContentItem: BaseContentItem | null,
    setSelectedContentItem: (i: BaseContentItem | null) => void,
};

const siteMap = SiteMapValidator.parse(sitesData);
const defaultContentMap = {
    biz: [],
    fit: [],
    art: [],
    rocks: [],
    games: [],
    construction: [],
};

const SiteContext = createContext<SiteProviderType>({
    siteMap,
    selectedSite: 'biz',
    setSelectedSite: () => {},
    contentMap: defaultContentMap,
    loading: true,
    contentFilter: '',
    setContentFilter: () => {},
    selectedContentItem: null,
    setSelectedContentItem: () => {},
});

interface ProviderProps {
    children: JSX.Element;
    defaultSite: SiteKey;
}

const SiteProvider:FC<ProviderProps> = ({ children, defaultSite }) => {
    const [selectedSite, setSelectedSite] = useState<SiteKey>(defaultSite);
    const [contentMap, setContentMap] = useState<ContentMap>(defaultContentMap);
    const [loading, setLoading] = useState<boolean>(true);
    const [contentFilter, setContentFilter] = useState<string>('');
    const [selectedContentItem, setSelectedContentItem] = useState<BaseContentItem | null>(null);

    const setSite = (s: SiteKey) => {
        setContentFilter('');
        setSelectedSite(s);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: response } = await axios.get(`${CDN}/content/content-${selectedSite}.json`);
                const parsed = BaseContentListValidator.parse(response);

                setContentMap({
                    ...contentMap,
                    [selectedSite]: parsed
                });
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        };
        if (contentMap[selectedSite].length === 0) {
            setLoading(true);
            fetchData();
        } else
            setLoading(false);

    }, [contentMap, selectedSite]);

    const providedSites = useMemo<SiteProviderType>(() => ({
        siteMap,
        selectedSite,
        setSelectedSite: setSite,
        loading,
        contentMap,
        contentFilter,
        setContentFilter,
        selectedContentItem,
        setSelectedContentItem,
    }), [selectedSite, loading, contentMap, contentFilter, selectedContentItem]);

    return (
        <SiteContext.Provider value={providedSites}>
            {children}
        </SiteContext.Provider>
    );
};

export { SiteProvider, SiteContext };
