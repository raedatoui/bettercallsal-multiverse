import { SiteKey, SiteMapValidator } from '@/types';
import sitesData from '../content/sites.next.json';

export const CDN = process.env.cdnUrl;

export const SPOTIFY_ENABLED = process.env.spotifyEnabled;

export const EXTERNAL_LINK = true;

// eslint-disable-next-line max-len
export const DALI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

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

export const URL_MAP: Record<SiteKey, string> = {
    biz: 'video',
    games: 'game',
    rocks: 'video',
    fit: 'video',
    art: 'art',
    construction: '',
    gallery: '',
    wtf: '',
};

export const WTF_RANDOM = {
    limit: 50,
    interval: 25,
};
