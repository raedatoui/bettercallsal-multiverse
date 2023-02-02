import { SiteMapValidator } from 'src/types';
import sitesData from '../content/sites.json';

export const SiteOrder: readonly string [] = [
    'biz', 'fit', 'art', 'rocks', 'games', 'construction'
];

export const CDN = process.env.cdn_url;

export const EXTERNAL_LINK = true;

// eslint-disable-next-line max-len
export const DALI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

export const defaultSiteMap = SiteMapValidator.parse(sitesData);
