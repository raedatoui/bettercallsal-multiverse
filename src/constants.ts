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
/*
  @media only screen and (max-width: 567px) {
    height: 120px;
    width: 129px;
  }

  @media only screen and (max-width : 668px) and (min-width : 568px) {
    height: 114px !important;
    width: 122.55px !important;
  }

  @media only screen and (max-width : 1020px) and (min-width : 669px) {
    height: 191px;
    width: 205px;
  }

  @media only screen and (max-width : 1260px) and (min-width : 1021px) {
 */
export const breakPoints = {
    lg2: { min: 1024, max: 1260 },
    lg1: { min: 669, max: 1023 },
    md: { min: 568, max: 668 },
    sm: { max: 567 }
};
