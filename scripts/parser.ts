import { promises } from 'fs';
import { join } from 'path';
import {
    SiteValidator,
    Site,
    SiteKey,
    SiteMapValidator,
    BaseContentItem,
    BaseContentListValidator,
    LeftNavNavItem,
} from '../src/types';
import { convertObjectToCsvString, CsvRow, parseCsv } from './csv';
import sitesData from '../content/sites.json';

const loadSheet = async (sheet: string): Promise<CsvRow[]> => {
    const csvData = await promises.readFile(join(__dirname, '../', 'public', 'content', sheet), 'utf-8');
    return parseCsv(csvData);
};

type RowWithNav = CsvRow & {
    items: CsvRow[];
};

export const loadSites = async (): Promise<Record<SiteKey, Site>> => {
    const rows = await loadSheet('site-structure.csv');
    const rowsWithNav: RowWithNav[] = await Promise.all(
        rows
            .map(async r => ({
                ...r,
                items: await loadSheet(`nav-${r.key}.csv`)
            }))
    );

    const sites = SiteMapValidator.parse(
        rowsWithNav
            .map(r => SiteValidator.parse({
                name: r.key,
                contentHeader: r.contentHeaderTxt,
                metaTitle: r.metaTitle,
                metaDescription: r.metaDescription,
                metaKeywords: r.metaKeywords,
                header: {
                    spinningSalsLeft: `/images/${r.key}/${r.spinningSalsLeft}`,
                    spinningSalsRight: `/images/${r.key}/${r.spinningSalsRight}`,
                    spinningSalAudio: `/audio/${r.key}/${r.spinningSalAudio}`,
                    bizerkIcon: `/images/${r.key}/${r.bizerkIcon}`,
                    ringAudio: `/audio/${r.key}/${r.ringAudio}`,
                    name1: r.name1,
                    name2: r.name2,
                    title: r.title,
                    lowerBanner: r.lowerBannerTxt,
                },
                leftNav: {
                    image: `/images/${r.key}/${r.leftImage}`,
                    text: r.leftImageText,
                    video: r.leftImageVideo === '' ? null : r.leftImageVideo,
                    audio: r.leftImageAudio === '' ? null : `audio/${r.key}/${r.leftImageAudio}`,
                    items: r.items.map(i => ({
                        name: i.name,
                        audio: i.audio === '' ? null : `/audio/${r.key}/${i.audio}`,
                        video: i.video === '' ? null : i.video,
                        link: i.audio === '' ? null : i.link,
                        category: i.category === '' ? null : i.category,
                        quote: i.quote === '' ? null : i.quote,
                        quoteLink: i.quoteLink === '' ? null : i.quoteLink,
                    })),
                },
                rightNav: {
                    type: r.rightType,
                    objectId: r.rightLink,
                },
                footer: {
                    text: r.footerText,
                    image: `/images/${r.key}/${r.footerImage}`,
                    imageWidth: parseInt(r.footerImageWidth.toString(), 10),
                    imageHeight: parseInt(r.footerImageHeight.toString(), 10),
                    ringAudio: `/audio/${r.key}/${r.footerAudio}`,
                },
            }))
            .reduce((acc, v) => ({
                ...acc,
                [v.name]: v
            }), {})
    );

    console.log(JSON.stringify(sites));
    return sites;
};

export const loadContent = async (site: SiteKey): Promise<BaseContentItem[]> => {
    const rows = await loadSheet(`content-${site}.csv`);
    const contentList = BaseContentListValidator.parse(rows.map(r => ({
        ...r,
        views: r.views === '' ? null : r.views,
        year: r.year === '' ? null : parseInt(r.year.toString(), 10),
        width: r.width === '' ? null : parseInt(r.width.toString(), 10),
        height: r.height === '' ? null : parseInt(r.height.toString(), 10),
    })));
    console.log(JSON.stringify(contentList));
    return contentList;
};

export const convertNavToJson = async () => {
    const siteMap = SiteMapValidator.parse(sitesData);
    Object.entries(siteMap).map(([key, site]) => {
        console.log(key);
        console.log(convertObjectToCsvString<LeftNavNavItem>(site.leftNav.items));
        console.log('-------');
        return 1;
    });
};
