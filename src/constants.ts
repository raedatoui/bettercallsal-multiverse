import { ConfigValidator, ContentType, SiteKeyValidator, SiteMapValidator } from '@/types';
import sitesData from '../content/sites.next.json';

export const defaultSiteMap = SiteMapValidator.parse(sitesData);

export const config = ConfigValidator.parse({
    selectedSite: SiteKeyValidator.parse(process.env.selectedSite),
    cdnUrl: process.env.cdnUrl,
    contentUrl: process.env.contentUrl,
    spotifyEnabled: process.env.spotifyEnabled === 'true',
    localImages: process.env.spotifyEnabled === 'true',
    gtagEnabled: process.env.gtagEnabled === 'true',
    experiments: process.env.experiments === 'true',
});

export const tickerList = Object.entries(defaultSiteMap).filter(([, v]) => v?.header.showTicker);

export const breakPoints = {
    lg2: { min: 768, max: 1260 },
    lg1: { min: 700, max: 767 },
    lg1a: { min: 700, max: 800 },
    md: { min: 568, max: 699 },
    sm: { max: 567 },
};

export const headerBreakPoints = {
    lg2: { min: 1024, max: 1260 },
    lg1: { min: 700, max: 1023 },
    lg1a: { min: 700, max: 800 },
    md: { min: 568, max: 699 },
    sm: { max: 567 },
};

export const URL_MAP: Record<ContentType, string> = {
    video: 'video',
    youtube: 'video',
    vimeo: 'video',
    game: 'game',
    image: 'art',
};
