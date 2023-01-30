import { CsvRow, loadSheet } from 'scripts/csv';
import { Site, SiteKey, SiteMapValidator, SiteValidator } from '../src/types';

type RowWithNav = CsvRow & {
    items: CsvRow[];
};

const loadSites = async (): Promise<Record<SiteKey, Site>> => {
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

const run = async () => {
    await loadSites();
};

run()
    .then(() => {
        process.exit();
    })
    .catch((err) => {
        console.log(err);
        console.log(JSON.stringify(err));
        process.exit();
    });
