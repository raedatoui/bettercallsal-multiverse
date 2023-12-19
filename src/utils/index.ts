import { SiteKey, SiteKeyValidator, SiteMap } from '@/types';
import useFetchData from './fetch';
import useInterval from './interval';
import useWindowSize from './resize';
import shuffleList from './shuffle-list';
import slugify from './slugify';
import useTimeout from './timeout';

export { useInterval };
export { useWindowSize };
export { useTimeout };
export { useFetchData };
export { shuffleList };
export { slugify };
export { findGame, findContent, findCategory, findContentFomStore } from './find';
export {
    animateCounter,
    animateCounterBizerk,
    animateHeaderFooterSpinners,
    bizerkHover,
    loadAnimation,
    wtfLoadAnimation,
    colorizeFooterHeaderTitles,
    betterCallClick,
    betterCallClickWtf,
} from './gsap';

const picker = <T>(l: T[]): T => l[Math.floor(Math.random() * l.length)];
export { picker };

export const pickRandom = (siteMap: SiteMap, exclude: SiteKey[] = []) => {
    const options = SiteKeyValidator.options.filter((k) => !exclude.includes(k));
    const r = options[Math.floor(Math.random() * options.length)];
    return siteMap[r];
};
