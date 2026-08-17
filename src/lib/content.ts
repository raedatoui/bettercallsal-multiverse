import fsPromises from 'fs/promises';
import path from 'path';
import { z } from 'zod';
import { BaseContentItem, BaseContentItemValidator, GameContentItem, GameContentItemValidator, SiteKey, SiteKeyValidator } from '@/types';

// DOC: the site a build targets is fixed by next.config.env.json, so every server component
//  reads the same key. see scripts/config.ts, which rewrites it per deploy target.
export const buildSite = (): SiteKey => SiteKeyValidator.parse(process.env.selectedSite);

// DOC: parses per item rather than per site so wtf, which mashes every site's content
//  together, keeps its game entries typed as games.
export const readSiteContent = async (site: SiteKey): Promise<(BaseContentItem | GameContentItem)[]> => {
    if (site === 'construction') return [];

    const filePath = path.join(process.cwd(), `content/content-${site}.json`);
    const jsonData = await fsPromises.readFile(filePath);
    const list = JSON.parse(jsonData.toString());
    const items = z.array(z.unknown()).parse(list.items);

    return items.map((i) => {
        const { contentType } = z.object({ contentType: z.string() }).parse(i);
        if (contentType === 'game') return GameContentItemValidator.parse(i);
        return BaseContentItemValidator.parse(i);
    });
};

// DOC: a hotkey swaps the rendered site without a rebuild, so every build has to carry routes
//  for every site's slugs and categories, not just its own. under output: export a param that
//  isn't in generateStaticParams has no html to serve, and next dev throws outright on it.
export const readAllContent = async (): Promise<(BaseContentItem | GameContentItem)[]> => {
    const lists = await Promise.all(SiteKeyValidator.options.map(readSiteContent));
    return lists.flat();
};

// DOC: only the build's own site can be pre-rendered. content for the other eight is fetched
//  from GCS at runtime when you hotkey across, so those slugs fall through to the firebase
//  `**` rewrite and boot the client at home.
export const buildSiteSlugs = async (contentTypes: string[]): Promise<{ slug: string }[]> => {
    const content = await readSiteContent(buildSite());
    return content.filter((i) => contentTypes.includes(i.contentType)).map((i) => ({ slug: i.slug }));
};
