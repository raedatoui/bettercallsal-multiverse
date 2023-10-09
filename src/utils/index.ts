import { SiteKey, SiteKeyValidator, SiteMap } from '@/types';
import useFetchData from './fetch';
import useInterval from './interval';
import useWindowSize from './resize';
import shuffleList from './shuffle-list';
import slugify from './slugify';
import useTimeout from './timeout';
import siteMapWtfGenerator from './wtf-client-generator';
export { useInterval };
export { useWindowSize };
export { useTimeout };
export { useFetchData };
export { shuffleList };
export { slugify };
export { findGame, findContent, findCategory } from './find';

const picker = <T>(l: T[]): T => l[Math.floor(Math.random() * l.length)];
export { picker };
export { siteMapWtfGenerator };

export const pickRandom = (siteMap: SiteMap, exclude: SiteKey[] = []) => {
    const options = SiteKeyValidator.options.filter((k) => !exclude.includes(k));
    const r = options[Math.floor(Math.random() * (options.length - 1))];
    return siteMap[r];
};
