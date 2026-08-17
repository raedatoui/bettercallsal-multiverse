'use client';

import { type SiteKey, SiteKeyValidator, type SiteMap } from '@/types';
import useFetchData from './fetch';
import useInterval from './interval';
import useWindowSize from './resize';
import shuffleList from './shuffle-list';
import slugify from './slugify';
import useTimeout from './timeout';

export { findCategory, findContent, findContentFomStore, findGame } from './find';
export {
    // animateCounter,
    animateCounterBizerk,
    betterCallClick,
    betterCallClickWtf,
    bizerkHover,
    loadAnimation,
    wtfLoadAnimation,
} from './gsap';
export { shuffleList, slugify, useFetchData, useInterval, useTimeout, useWindowSize };

const picker = <T>(l: T[]): T => l[Math.floor(Math.random() * l.length)];

export { picker };

export const pickRandom = (siteMap: SiteMap, exclude: SiteKey[] = []) => {
    const options = SiteKeyValidator.options.filter((k) => !exclude.includes(k));
    const r = options[Math.floor(Math.random() * options.length)];
    return siteMap[r];
};
