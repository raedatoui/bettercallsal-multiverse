import { BaseContentItem, ContentMap, GameContentItem, isGame, LeftNavItem, Site } from '@/types';
import slugify from './slugify';

export const findGame = (list: (BaseContentItem | GameContentItem)[], gameId: string): GameContentItem | null => {
    const l = list.filter((i) => slugify(i.name) === gameId);
    const g: readonly GameContentItem[] = l.filter(isGame);
    return g.length > 0 ? g[0] : null;
};

export const findContent = (list: BaseContentItem[], contentId: string): BaseContentItem | null => {
    const l = list.filter((i) => slugify(i.name) === contentId);
    return l.length > 0 ? l[0] : null;
};

const findAny = (list: (BaseContentItem | GameContentItem)[], contentId: string): BaseContentItem | GameContentItem | null => {
    const l = list.filter((i) => slugify(i.name) === contentId);
    return l.length > 0 ? l[0] : null;
};

export const findCategory = (site: Site, category: string): LeftNavItem | null => {
    const n = site.leftNav.items.filter((i) => i.category === category);
    return n.length > 0 ? n[0] : null;
};

export const findContentFomStore = (map: ContentMap, contentId: string): BaseContentItem | GameContentItem | null => {
    let f: BaseContentItem | GameContentItem | null = null;
    const lists = Object.values(map);
    for (let i = 0; i < lists.length; i += 1) {
        f = findAny(lists[i], contentId);
        if (f) break;
    }
    return f;
};
