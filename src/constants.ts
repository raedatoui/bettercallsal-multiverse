import { SiteMapValidator } from 'src/types';
import sitesData from '../content/sites.json';

export const SiteOrder: readonly string [] = [
    'biz', 'fit', 'art', 'rocks', 'games', 'construction'
];

export const CDN = process.env.cdnUrl;

export const SPOTIFY_ENABLED = process.env.spotifyEnabled;

export const EXTERNAL_LINK = true;

// eslint-disable-next-line max-len
export const DALI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

export const defaultSiteMap = SiteMapValidator.parse(sitesData);

export const breakPoints = {
    lg2: { min: 768, max: 1260 },
    lg1: { min: 700, max: 767 },
    lg1a: { min: 700, max: 800 },
    md: { min: 568, max: 699 },
    sm: { max: 567 }
};

export const headerBreakPoints = {
    lg2: { min: 1024, max: 1260 },
    lg1: { min: 700, max: 1023 },
    lg1a: { min: 700, max: 800 },
    md: { min: 568, max: 699 },
    sm: { max: 567 }
};
