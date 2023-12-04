import { gsap } from 'gsap';
import { Dispatch, SetStateAction } from 'react';
import { SiteKey } from '@/types';

type P = (v: number) => number;
type S = (v: number | P) => void;

const FAST = 0.1;
const DEFAULT = 3;

export const bizerkHover = (selectedSite: SiteKey, counter?: number, setter?: Dispatch<SetStateAction<number>>): gsap.core.Timeline => {
    const tl = gsap.timeline({
        paused: true,
        onComplete: () => {
            if (selectedSite === 'biz' && setter) setter(0);
        },
    });
    tl.add(animateHeaderFooterSpinners(true));
    tl.add(colorizeFooterHeaderTitles(FAST), '<');
    if (counter !== undefined && setter !== undefined) tl.add(animateCounter(FAST, selectedSite, counter, setter), '<');
    return tl;
};

export const loadAnimation = () => {
    const tl = gsap.timeline({
        paused: true,
    });
    tl.add(animateHeaderFooterSpinners(false));
    tl.add(colorizeFooterHeaderTitles(DEFAULT), '<');
    return tl;
};

export const betterCallClick = (selectedSite: SiteKey, counter: number, setter: Dispatch<SetStateAction<number>>) => {
    const tl = gsap.timeline({
        paused: true,
        onStart: () => {
            setter?.(0);
        },
    });
    tl.add(animateHeaderFooterSpinners(false));
    tl.add(colorizeFooterHeaderTitles(DEFAULT), '<');

    if (counter !== undefined && setter !== undefined)
        tl.add(animateCounter(DEFAULT - (selectedSite === 'biz' ? 0.8 : 0), selectedSite, counter, setter), '<');
    return tl;
};

export const animateHeaderFooterSpinners = (fast: boolean) => {
    return gsap.fromTo(
        '.spinner',
        { rotateY: 0 },
        {
            rotateY: (index) => (index % 0 ? -3600 : 3600),
            duration: fast ? FAST : DEFAULT,
            ease: 'power2.out',
            clearProps: 'all',
        }
    );
};

export const colorizeFooterHeaderTitles = (duration: number) => {
    const from = {
        color: 'rgb(255, 255, 255)',
        textShadow:
            'rgb(241, 52, 0) -2px -2px 0px, rgb(241, 52, 0) -2px -1px 0px, rgb(241, 52, 0) -2px 0px 0px,' +
            'rgb(241, 52, 0) -2px 1px 0px, rgb(241, 52, 0) -2px 2px 0px, rgb(241, 52, 0) -1px -2px 0px,' +
            'rgb(241, 52, 0) -1px -1px 0px, rgb(241, 52, 0) -1px 0px 0px, rgb(241, 52, 0) -1px 1px 0px,' +
            'rgb(241, 52, 0) -1px 2px 0px, rgb(241, 52, 0) 0px -2px 0px, rgb(241, 52, 0) 0px -1px 0px,' +
            'rgb(241, 52, 0) 0px 0px 0px, rgb(241, 52, 0) 0px 1px 0px, rgb(241, 52, 0) 0px 2px 0px,' +
            'rgb(241, 52, 0) 1px -2px 0px, rgb(241, 52, 0) 1px -1px 0px, rgb(241, 52, 0) 1px 0px 0px,' +
            'rgb(241, 52, 0) 1px 1px 0px, rgb(241, 52, 0) 1px 2px 0px, rgb(241, 52, 0) 2px -2px 0px,' +
            'rgb(241, 52, 0) 2px -1px 0px, rgb(241, 52, 0) 2px 0px 0px, rgb(241, 52, 0) 2px 1px 0px,' +
            'rgb(255, 255, 255) 2px 2px 0px',
    };

    const setter = gsap.quickSetter('.better-call-title ', 'css');
    setter(from);
    return gsap.fromTo('.better-call-title ', from, {
        color: (index) => (index === 0 ? 'rgb(53, 53, 33)' : 'rgb(214, 29, 0)'),
        textShadow:
            'rgb(255, 255, 255) -2px -2px 0px, rgb(255, 255, 255) -2px -1px 0px, rgb(255, 255, 255) -2px 0px 0px,' +
            'rgb(255, 255, 255) -2px 1px 0px, rgb(255, 255, 255) -2px 2px 0px, rgb(255, 255, 255) -1px -2px 0px,' +
            'rgb(255, 255, 255) -1px -1px 0px, rgb(255, 255, 255) -1px 0px 0px, rgb(255, 255, 255) -1px 1px 0px,' +
            'rgb(255, 255, 255) -1px 2px 0px, rgb(255, 255, 255) 0px -2px 0px, rgb(255, 255, 255) 0px -1px 0px,' +
            'rgb(255, 255, 255) 0px 0px 0px, rgb(255, 255, 255) 0px 1px 0px, rgb(255, 255, 255) 0px 2px 0px,' +
            'rgb(255, 255, 255) 1px -2px 0px, rgb(255, 255, 255) 1px -1px 0px, rgb(255, 255, 255) 1px 0px 0px,' +
            'rgb(255, 255, 255) 1px 1px 0px, rgb(255, 255, 255) 1px 2px 0px, rgb(255, 255, 255) 2px -2px 0px,' +
            'rgb(255, 255, 255) 2px -1px 0px, rgb(255, 255, 255) 2px 0px 0px, rgb(255, 255, 255) 2px 1px 0px,' +
            'rgb(255, 255, 255) 2px 2px 0px',
        duration: duration,
        clearProps: 'all',
        ease: 'sine.out',
    });
};

export const animateCounter = (duration: number, selectedSite: SiteKey | null, counter: number, setter: S) => {
    const house = {
        getAttribute: (key: string) => counter,
        setAttribute: (qualifiedName: string, value: number) => {
            setter((prev: number) => {
                if (value - prev > 0.25) return value;
                return prev;
            });
        },
    };

    return gsap.to(house, {
        attr: { counter: counter + 10 },
        duration: duration,
        ease: 'power2.out',
        onComplete: () => {
            if (selectedSite === 'biz' && setter) setter(0);
        },
    });
};

export const animateCounterBizerk = (counter: number, setter: S) => {
    const house = {
        getAttribute: (key: string) => counter,
        setAttribute: (qualifiedName: string, value: number) => {
            setter(value);
        },
    };

    return gsap.to(house, {
        attr: { counter: counter + 10 },
        duration: FAST,
        ease: 'power2.out',
        repeat: -1,
    });
};

export const wtfLoadAnimation = (entries: Entry[]) => {
    const tl = gsap.timeline({
        paused: true,
        onComplete: () => {
            document.getElementById('main')?.classList.remove('wtf');
        },
    });
    tl.add(
        gsap.to('.animatable', {
            opacity: 1,
            ease: 'power2.out',
            duration: 0.1,
        })
    );
    const r = gsap.fromTo(
        '.spinner',
        { rotateY: 0 },
        {
            rotateY: (index) => (index % 0 ? -3600 : 3600),
            duration: 3,
            ease: 'power2.out',
            opacity: 1,
            clearProps: 'all',
        }
    );
    tl.add(r, '<');
    tl.add(colorizeFooterHeaderTitles(3), '<');
    entries.forEach((entry) => {
        tl.add(animateCounter(DEFAULT, null, entry[0], entry[1]), '<');
    });
    return tl;
};

type Entry = [number, Dispatch<SetStateAction<number>>];

export const betterCallClickWtf = (selectedSite: SiteKey, entries: Entry[]) => {
    const tl = gsap.timeline({
        paused: true,
        onStart: () => {
            entries.forEach((entry) => entry[1](0));
        },
    });
    tl.add(animateHeaderFooterSpinners(false));
    tl.add(colorizeFooterHeaderTitles(DEFAULT), '<');

    entries.forEach((entry) => {
        tl.add(animateCounter(DEFAULT, selectedSite, entry[0], entry[1]), '<');
    });
    return tl;
};
