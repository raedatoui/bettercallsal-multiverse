import { writeFileSync } from 'fs';
import { join } from 'path';
import { generateUUID as uuidv4 } from 'three/src/math/MathUtils';
import { z } from 'zod';
import sitesData from '../content/sites.json';
import {
    LeftNav,
    RightNav,
    Footer,
    LeftNavNavItem,
    LeftNavValidator,
    RightNavValidator,
    FooterValidator,
    SiteKeyValidator,
    SiteMap as NextSiteMap,
} from '../src/types';
import shuffleList from '../src/utils/shuffle-list';

// these types do not include WTF, chicken or egg
const PrevHeaderValidator = z.object({
    spinningSalsLeft: z.string(),
    spinningSalsRight: z.string(),
    spinningSalAudio: z.string(),
    bizerkIcon: z.string(),
    ringAudio: z.string(),
    name1: z.string(),
    name2: z.string(),
    title1: z.string(),
    title2: z.string(),
    lowerBanner: z.string(),
    showTicker: z.boolean(),
});
const SiteValidator = z.object({
    name: SiteKeyValidator,
    contentHeader: z.string(),
    metaTitle: z.string(),
    metaDescription: z.string(),
    metaKeywords: z.string(),
    header: PrevHeaderValidator,
    leftNav: LeftNavValidator,
    rightNav: RightNavValidator,
    footer: FooterValidator,
    gaTag: z.string(),
});

type Header = z.infer<typeof PrevHeaderValidator>;

const SiteMapValidator = z.object({
    biz: SiteValidator,
    fit: SiteValidator,
    art: SiteValidator,
    rocks: SiteValidator,
    games: SiteValidator,
    construction: SiteValidator,
    gallery: SiteValidator,
});

type SiteMap = z.infer<typeof SiteMapValidator>;

const defaultSiteMap = SiteMapValidator.parse(sitesData);

const picker = <T>(l: T[]): T => l[Math.floor(Math.random() * l.length)];

const createWtf = (siteMap: SiteMap): NextSiteMap => {
    const contentHeaders: string[] = [];
    const metaTitles: string[] = [];
    const metaDescriptions: string[] = [];
    const metaKeywords: string[] = [];
    const headers: Header[] = [];
    const leftNavs: LeftNav[] = [];
    let leftNavItems: LeftNavNavItem[] = [];
    const rightNavs: RightNav[] = [];
    const footers: Footer[] = [];

    Object.entries(siteMap).forEach(([key, site]) => {
        if (key !== 'wtf' && site !== null) {
            contentHeaders.push(site.contentHeader);
            metaTitles.push(site.metaTitle);
            metaDescriptions.push(site.metaDescription);
            metaKeywords.push(site.metaKeywords);
            headers.push(site.header);
            leftNavs.push(site.leftNav);
            leftNavItems = leftNavItems.concat(site.leftNav.items.map(i => ({ ...i, id: uuidv4() })));
            rightNavs.push(site.rightNav);
            footers.push(site.footer);
        }
    });

    return {
        art: {
            ...siteMap.art,
            header: {
                ...siteMap.art.header,
                spinningSalAudio1: siteMap.art.header.spinningSalAudio,
                spinningSalAudio2: siteMap.art.header.spinningSalAudio,
            },
            leftNav: {
                ...siteMap.art.leftNav,
                items: siteMap.art.leftNav.items.map(i => ({ ...i, id: uuidv4() })),
            }
        },
        biz: {
            ...siteMap.biz,
            header: {
                ...siteMap.biz.header,
                spinningSalAudio1: siteMap.biz.header.spinningSalAudio,
                spinningSalAudio2: siteMap.biz.header.spinningSalAudio,
            },
            leftNav: {
                ...siteMap.biz.leftNav,
                items: siteMap.biz.leftNav.items.map(i => ({ ...i, id: uuidv4() })),
            }
        },
        construction: {
            ...siteMap.construction,
            header: {
                ...siteMap.construction.header,
                spinningSalAudio1: siteMap.construction.header.spinningSalAudio,
                spinningSalAudio2: siteMap.construction.header.spinningSalAudio,
            },
            leftNav: {
                ...siteMap.construction.leftNav,
                items: siteMap.construction.leftNav.items.map(i => ({ ...i, id: uuidv4() })),
            }
        },
        fit: {
            ...siteMap.fit,
            header: {
                ...siteMap.fit.header,
                spinningSalAudio1: siteMap.fit.header.spinningSalAudio,
                spinningSalAudio2: siteMap.fit.header.spinningSalAudio,
            },
            leftNav: {
                ...siteMap.fit.leftNav,
                items: siteMap.fit.leftNav.items.map(i => ({ ...i, id: uuidv4() })),
            }
        },
        gallery: {
            ...siteMap.gallery,
            header: {
                ...siteMap.gallery.header,
                spinningSalAudio1: siteMap.gallery.header.spinningSalAudio,
                spinningSalAudio2: siteMap.gallery.header.spinningSalAudio,
            },
            leftNav: {
                ...siteMap.gallery.leftNav,
                items: siteMap.gallery.leftNav.items.map(i => ({ ...i, id: uuidv4() })),
            }
        },
        games: {
            ...siteMap.games,
            header: {
                ...siteMap.games.header,
                spinningSalAudio1: siteMap.games.header.spinningSalAudio,
                spinningSalAudio2: siteMap.games.header.spinningSalAudio,
            },
            leftNav: {
                ...siteMap.games.leftNav,
                items: siteMap.games.leftNav.items.map(i => ({ ...i, id: uuidv4() })),
            }
        },
        rocks: {
            ...siteMap.rocks,
            header: {
                ...siteMap.rocks.header,
                spinningSalAudio1: siteMap.rocks.header.spinningSalAudio,
                spinningSalAudio2: siteMap.rocks.header.spinningSalAudio,
            },
            leftNav: {
                ...siteMap.rocks.leftNav,
                items: siteMap.rocks.leftNav.items.map(i => ({ ...i, id: uuidv4() })),
            }
        },
        wtf: {
            footer: {
                text: picker<Footer>(footers).text,
                icon: picker<Footer>(footers).icon,
                ringAudio: picker<Footer>(footers).ringAudio,
            },
            gaTag: '',
            header: {
                showTicker: false,
                name1: picker<Header>(headers).name1,
                name2: picker<Header>(headers).name2,
                spinningSalAudio1: picker<Header>(headers).spinningSalAudio,
                spinningSalAudio2: picker<Header>(headers).spinningSalAudio,
                spinningSalsRight: picker<Header>(headers).spinningSalsRight,
                spinningSalsLeft: picker<Header>(headers).spinningSalsLeft,
                bizerkIcon: picker<Header>(headers).bizerkIcon,
                ringAudio: picker<Header>(headers).ringAudio,
                title1: picker<Header>(headers).title1,
                title2: picker<Header>(headers).title2,
                lowerBanner: picker<Header>(headers).lowerBanner,
            },
            leftNav: {
                image: picker<LeftNav>(leftNavs).image,
                text: picker<LeftNav>(leftNavs).text,
                video: picker<LeftNav>(leftNavs).video,
                audio: picker<LeftNav>(leftNavs).audio,
                items: shuffleList(leftNavItems),
            },
            metaDescription: picker<string>(metaDescriptions),
            metaKeywords: picker<string>(metaKeywords),
            metaTitle: picker<string>(metaTitles),
            rightNav: picker<RightNav>(rightNavs),
            name: 'wtf',
            contentHeader: picker<string>(contentHeaders)
        }
    };
};

const wtf = createWtf(defaultSiteMap);

writeFileSync(join(__dirname, '../', 'content', 'sites.next.json'), JSON.stringify(wtf, undefined, 4), {
    flag: 'w',
});
