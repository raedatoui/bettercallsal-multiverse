import { ConfigValidator, type ContentType, type SiteKey, SiteKeyValidator, SiteMapValidator } from '@/types';
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

// DOC: the hotkeys that swap the rendered site. `as const satisfies` keeps the literal keys — so
//  isHotKey can narrow a raw KeyboardEvent.key — while still checking every value is a real SiteKey.
export const keyMap = {
    a: 'art',
    b: 'biz',
    f: 'fit',
    r: 'rocks',
    g: 'games',
    c: 'construction',
    y: 'gallery',
    w: 'world',
    t: 'wtf',
} as const satisfies Record<string, SiteKey>;

export type HotKey = keyof typeof keyMap;

export const isHotKey = (key: string): key is HotKey => key in keyMap;
