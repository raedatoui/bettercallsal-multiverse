import { defaultSiteMap } from '@/constants';
import { Footer, Header, LeftNav, LeftNavItem, RightNav, SiteMap } from '@/types';
import { picker, shuffleList } from '@/utils/index';

const contentHeaders: string[] = [];
const metaTitles: string[] = [];
const metaDescriptions: string[] = [];
const metaKeywords: string[] = [];
const headers: Header[] = [];
const leftNavs: LeftNav[] = [];
let leftNavItems: LeftNavItem[] = [];
const rightNavs: RightNav[] = [];
const footers: Footer[] = [];

Object.entries(defaultSiteMap).forEach(([key, site]) => {
    if (key !== 'wtf' && site !== null) {
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

const siteMapWtfGenerator = (siteMap: SiteMap): SiteMap => {
    return {
        ...siteMap,
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
                spinningSalAudio1: picker<Header>(headers).spinningSalAudio1,
                spinningSalAudio2: picker<Header>(headers).spinningSalAudio2,
                spinningSalsRight: picker<Header>(headers).spinningSalsRight,
                spinningSalsLeft: picker<Header>(headers).spinningSalsLeft,
                bizerk: picker<Header>(headers).bizerk,
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
            contentHeader: picker<string>(contentHeaders),
        },
    };
};

export default siteMapWtfGenerator;
