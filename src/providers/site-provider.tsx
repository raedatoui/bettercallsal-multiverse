import React, { FC, useMemo, useState, createContext, useEffect } from 'react';
import axios from 'axios';
import {
    ArtContentListValidator,
    BaseContentListValidator,
    BizContentListValidator,
    ContentMap,
    FitContentListValidator,
    RocksContentListValidator,
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

    const setSite = (s: SiteKey) => {
        setLoading(true);
        setContentFilter('');
        setSelectedSite(s);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: response } = await axios.get(`/content/content-${selectedSite}.json`);
                let parsed;
                switch (selectedSite) {
                /* eslint-disable indent */
                    case 'biz':
                        parsed = BizContentListValidator.parse(response);
                        break;

                    case 'fit':
                        parsed = FitContentListValidator.parse(response);
                        console.log(parsed);
                        break;

                    case 'art':
                        parsed = ArtContentListValidator.parse(response);
                        break;

                    case 'rocks':
                        parsed = RocksContentListValidator.parse(response);
                        break;

                    default:
                        parsed = BaseContentListValidator.parse(response);
                        break;
                    /* eslint-disable indent */
                }
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
    }), [contentMap, loading, selectedSite, contentFilter]);

    return (
        <SiteContext.Provider value={providedSites}>
            {children}
        </SiteContext.Provider>
    );
};

export { SiteProvider, SiteContext };
