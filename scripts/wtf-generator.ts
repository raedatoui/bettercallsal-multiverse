import { writeFileSync } from 'fs';
import { join } from 'path';
import sitesData from '../content/sites.next.json';
import {
    RightNav,
    Footer,
    SiteKeyValidator,
    SiteMapValidator,
    SiteMap,
    Header,
    LeftNav,
    LeftNavItem,
} from '../src/types';
import shuffleList from '../src/utils/shuffle-list';

const defaultSiteMap = SiteMapValidator.parse(sitesData);

const picker = <T>(l: T[]): T => l[Math.floor(Math.random() * l.length)];


const createWtf = (siteMap: SiteMap): SiteMap => {
    const contentHeaders: string[] = [];
    const footers: Footer[] = [];
    const headers: Header[] = [];
    const leftNavs: LeftNav[] = [];
    const metaDescriptions: string[] = [];
    const metaKeywords: string[] = [];
    const metaTitles: string[] = [];
    let leftNavItems: LeftNavItem[] = [];
    const rightNavs: RightNav[] = [];


    Object.entries(siteMap).forEach(([key, site]) => {
        if (site !== null && key !== 'wtf') {
            console.log(key);
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
        contentHeader: picker<string>(contentHeaders),
        footer: {
            text: picker<Footer>(footers).text,
            icon: picker<Footer>(footers).icon,
            ringAudio: picker<Footer>(footers).ringAudio,
        },
        gaTag: 'G-DMT1EKGNWP',
        header: {
            bizerk: picker<Header>(headers).bizerk,
            lowerBanner: picker<Header>(headers).lowerBanner,
            name1: picker<Header>(headers).name1,
            name2: picker<Header>(headers).name2,
            ringAudio: picker<Header>(headers).ringAudio,
            showTicker: false,
            spinningSalAudio1: picker<Header>(headers).spinningSalAudio1,
            spinningSalAudio2: picker<Header>(headers).spinningSalAudio2,
            spinningSalsLeft: picker<Header>(headers).spinningSalsLeft,
            spinningSalsRight: picker<Header>(headers).spinningSalsRight,
            title1: picker<Header>(headers).title1,
            title2: picker<Header>(headers).title2,
        },
        leftNav: {
            audio: picker<LeftNav>(leftNavs).audio,
            image: picker<LeftNav>(leftNavs).image,
            items: shuffleList(leftNavItems),
            text: picker<LeftNav>(leftNavs).text,
            video: picker<LeftNav>(leftNavs).video,
        },
        metaDescription: picker<string>(metaDescriptions),
        metaKeywords: picker<string>(metaKeywords),
        metaTitle: picker<string>(metaTitles),
        name: SiteKeyValidator.parse('wtf'),
        rightNav: picker<RightNav>(rightNavs),
    };

    return {
        ...siteMap,
        wtf,
    };
};

const wtf = createWtf(defaultSiteMap);

writeFileSync(join(__dirname, '../', 'content', 'sites.next.json'), JSON.stringify(wtf, undefined, 4), {
    flag: 'w',
});
