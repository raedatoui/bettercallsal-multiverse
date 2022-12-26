import React, { FC, useMemo, useState, createContext } from 'react';
import { SiteKey, SiteMap, SiteMapValidator } from '../types';
import sitesData from '../../public/content/sites.json';

type SiteProviderType = {
    sites: SiteMap,
    selectedSite: SiteKey,
    setSelectedSite: (s: SiteKey) => void
};

const siteMap = SiteMapValidator.parse(sitesData);
const SiteContext = createContext<SiteProviderType>({
    sites: siteMap,
    selectedSite: 'games',
    setSelectedSite: () => {}
});

interface ProviderProps {
    children: JSX.Element;
    defaultSite: SiteKey;
}

const SiteProvider:FC<ProviderProps> = ({ children, defaultSite }) => {
    const [selectedSite, setSelectedSite] = useState<SiteKey>(defaultSite);

    const providedSites = useMemo<SiteProviderType>(() => ({
        sites: siteMap,
        selectedSite,
        setSelectedSite
    }), [selectedSite]);

    return (
        <SiteContext.Provider value={providedSites}>
            {children}
        </SiteContext.Provider>
    );
};

export { SiteProvider, SiteContext };
