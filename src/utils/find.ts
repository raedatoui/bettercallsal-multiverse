import { BaseContentItem, GameContentItem, isGame, LeftNavNavItem, Site } from '@/types';
import slugify from './slugify';

export const findGame = (list: (BaseContentItem | GameContentItem)[], gameId: string): GameContentItem | null => {
    const l = list.filter(i => slugify(i.name) === gameId);
    const g: readonly GameContentItem[] = l.filter(isGame);
    return g.length > 0 ? g[0] : null;
};

export const findContent = (list: BaseContentItem[], videoId: string): BaseContentItem | null => {
    const l = list.filter(i => slugify(i.name) === videoId);
    return l.length > 0 ? l[0] : null;
};

export const findCategory = (site:Site, category: string): LeftNavNavItem | null => {
    const n = site.leftNav.items.filter(i => i.category === category);
    return n.length > 0 ? n[0] : null;
};
