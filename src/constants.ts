import { ContentType, SiteMapValidator } from '@/types';
import sitesData from '../content/sites.next.json';

export const CDN = process.env.cdnUrl;

export const CONTENT_URL = process.env.contentUrl;

export const SPOTIFY_ENABLED = process.env.spotifyEnabled;

export const defaultSiteMap = SiteMapValidator.parse(sitesData);

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
