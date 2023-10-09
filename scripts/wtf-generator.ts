import { writeFileSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import sitesData from '../content/sites.json';
import {
    RightNav,
    Footer,
    RightNavValidator,
    FooterValidator,
    SiteKeyValidator,
    SiteMap as NextSiteMap,
    Header,
    LeftNav,
    LeftNavItem,
    SiteKey,
    Site,
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
const PrevLeftNavItemValidator = z.object({
    name: z.string(),
    audio: z.string().nullable(),
    video: z.string().nullable(),
    link: z.string().nullable(),
    category: z.string().nullable(),
    quote: z.string().nullable(),
    quoteLink: z.string().nullable(),
});
const PrevLeftNavValidator = z.object({
    image: z.string(),
    text: z.string(),
    video: z.string().nullable(),
    audio: z.string().nullable(),
    items: z.array(PrevLeftNavItemValidator),
});
const PrevSiteValidator = z.object({
    name: SiteKeyValidator,
    contentHeader: z.string(),
    metaTitle: z.string(),
    metaDescription: z.string(),
    metaKeywords: z.string(),
    header: PrevHeaderValidator,
    leftNav: PrevLeftNavValidator,
    rightNav: RightNavValidator,
    footer: FooterValidator,
    gaTag: z.string(),
});

const SiteMapValidator = z.object({
    biz: PrevSiteValidator,
    fit: PrevSiteValidator,
    art: PrevSiteValidator,
    rocks: PrevSiteValidator,
    games: PrevSiteValidator,
    construction: PrevSiteValidator,
    gallery: PrevSiteValidator,
});

type SiteMap = z.infer<typeof SiteMapValidator>;

const PrevSiteKeyValidator = z.enum(['biz', 'rocks', 'fit', 'art', 'games', 'construction', 'gallery']);

type PrevSiteKey = z.infer<typeof PrevSiteKeyValidator>;

const defaultSiteMap = SiteMapValidator.parse(sitesData);

const picker = <T>(l: T[]): T => l[Math.floor(Math.random() * l.length)];

type MedSiteMap = Record<PrevSiteKey, Site>;

const createWtf = (siteMap: SiteMap): NextSiteMap => {
    const contentHeaders: string[] = [];
    const metaTitles: string[] = [];
    const metaDescriptions: string[] = [];
    const metaKeywords: string[] = [];
    const headers: Header[] = [];
    const leftNavs: LeftNav[] = [];
    let leftNavItems: LeftNavItem[] = [];
    const rightNavs: RightNav[] = [];
    const footers: Footer[] = [];

    const updateSiteMap: MedSiteMap = {
        art: {
            ...siteMap.art,
            header: {
                ...siteMap.art.header,
                spinningSalAudio1: siteMap.art.header.spinningSalAudio,
                spinningSalAudio2: siteMap.art.header.spinningSalAudio,
            },
            leftNav: {
                ...siteMap.art.leftNav,
                items: siteMap.art.leftNav.items.map((i) => ({
                    ...i,
                    id: uuidv4(),
                    site: 'art',
                })),
            },
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
                items: siteMap.biz.leftNav.items.map((i) => ({
                    ...i,
                    id: uuidv4(),
                    site: 'biz',
                })),
            },
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
                items: siteMap.construction.leftNav.items.map((i) => ({
                    ...i,
                    id: uuidv4(),
                    site: 'construction',
                })),
            },
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
                items: siteMap.fit.leftNav.items.map((i) => ({
                    ...i,
                    id: uuidv4(),
                    site: 'fit',
                })),
            },
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
                items: siteMap.gallery.leftNav.items.map((i) => ({
                    ...i,
                    id: uuidv4(),
                    site: 'gallery',
                })),
            },
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
                items: siteMap.games.leftNav.items.map((i) => ({
                    ...i,
                    id: uuidv4(),
                    site: 'games',
                })),
            },
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
                items: siteMap.rocks.leftNav.items.map((i) => ({
                    ...i,
                    id: uuidv4(),
                    site: 'rocks',
                })),
            },
        },
    };

    Object.entries(updateSiteMap).forEach(([key, site]) => {
        if (site !== null) {
            contentHeaders.push(site.contentHeader);
            metaTitles.push(site.metaTitle);
            metaDescriptions.push(site.metaDescription);
            metaKeywords.push(site.metaKeywords);
            headers.push(site.header);
            leftNavs.push(site.leftNav);
            leftNavItems = leftNavItems.concat(site.leftNav.items);
            rightNavs.push(site.rightNav);
            footers.push(site.footer);
        }
    });

    const wtf = {
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
            spinningSalAudio1: picker<Header>(headers).spinningSalAudio1,
            spinningSalAudio2: picker<Header>(headers).spinningSalAudio2,
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
        name: SiteKeyValidator.parse('wtf'),
        contentHeader: picker<string>(contentHeaders),
    };

    return {
        ...updateSiteMap,
        wtf,
    };
};

const wtf = createWtf(defaultSiteMap);

writeFileSync(join(__dirname, '../', 'content', 'sites.next.json'), JSON.stringify(wtf, undefined, 4), {
    flag: 'w',
});
