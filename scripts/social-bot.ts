import contentArt from '../content/content-art.json';
import contentBiz from '../content/content-biz.json';
import contentFit from '../content/content-fit.json';
import contentGames from '../content/content-games.json';
import contentRocks from '../content/content-rocks.json';
import { BaseContentItem, BaseContentListValidator, GameContentItem, GameContentListValidator, SiteKey } from '../src/types';
import slugify from '../src/utils/slugify';

const URL = 'https://bettercallsal.';

const mapContentToUrls = (map: Record<string, string>, site: SiteKey, contentList: (BaseContentItem | GameContentItem)[]) =>
    contentList.map(i => `${map[site]}${slugify(i.name)}`);

const run = async () => {
    const segMap = {
        biz: 'video',
        rocks: 'video',
        fit: 'video',
        art: 'art',
        games: 'game'
    };

    const urlMap = Object.entries(segMap).reduce((acc, [site, seg]) => ({
        ...acc,
        [site]: `${URL}${site}/${seg}/`
    }), {});

    const contentMap = {
        art: mapContentToUrls(urlMap, 'art', BaseContentListValidator.parse(contentArt.items)),
        biz: mapContentToUrls(urlMap, 'biz', BaseContentListValidator.parse(contentBiz.items)),
        fit: mapContentToUrls(urlMap, 'fit', BaseContentListValidator.parse(contentFit.items)),
        rocks: mapContentToUrls(urlMap, 'rocks', BaseContentListValidator.parse(contentRocks.items)),
        games: mapContentToUrls(urlMap, 'games', GameContentListValidator.parse(contentGames.items)),
    };
    console.log(contentMap);
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
