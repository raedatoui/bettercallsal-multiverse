import { gsap } from 'gsap';
import { Dispatch, SetStateAction } from 'react';
import AudioBuffers from '@/providers/audio-buffer';
import { Site, SiteKey } from '@/types';

type P = (v: number) => number;
type S = (v: number | P) => void;

const FAST = 0.1;
const DEFAULT = 3;

const animateHeaderFooterSpinners = (duration: number) => {
    return gsap.fromTo(
        '.spinner',
        { rotateY: 0 },
        {
            rotateY: (index) => (index % 0 ? -3600 : 3600),
            duration,
            ease: 'power2.out',
            clearProps: 'all',
        }
    );
};

const colorizeFooterHeaderTitles = (duration: number) => {
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

const animateCounter = (duration: number, counter: number, setter: S, paused: boolean, reset: boolean, ease = 'power2.out') => {
    const house = {
        getAttribute: (key: string) => counter,
        setAttribute: (qualifiedName: string, value: number) => {
            setter((prev: number) => {
                let a = prev;
                if (value - prev > 0.005) a = value;
                return a;
            });
        },
    };

    return gsap.to(house, {
        attr: { counter: counter + 1 },
        duration: duration,
        ease: ease,
        onComplete: () => {
            if (reset && setter) setter(0);
        },
        paused,
    });
};

export const animateCounterBizerk = (counter: number, setter: S, paused = true) => {
    const house = {
        getAttribute: (key: string) => counter,
        setAttribute: (qualifiedName: string, value: number) => {
            setter(value);
        },
    };

    return gsap.to(house, {
        attr: { counter: counter + 1 },
        duration: FAST,
        ease: 'power2.out',
        repeat: -1,
        paused,
    });
};

export const loadAnimation = () => {
    const tl = gsap.timeline({
        paused: true,
    });
    tl.add(animateHeaderFooterSpinners(DEFAULT));
    tl.add(colorizeFooterHeaderTitles(DEFAULT), '<');
    return tl;
};

export const wtfLoadAnimation = (counter: number, setter: Dispatch<SetStateAction<number>>) => {
    document.getElementById('main')?.classList.remove('wtf');

    const tl = gsap.timeline({
        paused: true,
        onComplete: () => {
            document.getElementById('main')?.classList.remove('wtf');
        },
    });
    // tl.add(
    //     gsap.to('.animatable', {
    //         opacity: 1,
    //         ease: 'power2.out',
    //         duration: 0.1,
    //     })
    // );
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
    tl.add(animateCounter(DEFAULT, counter, setter, false, true, 'linear'), '<');
    return tl;
};

export const bizerkHover = (selectedSite: SiteKey, counter: number, setter: Dispatch<SetStateAction<number>>): gsap.core.Timeline => {
    const tl = gsap.timeline({
        paused: true,
        onComplete: () => {
            if (selectedSite === 'biz') setter(0);
        },
    });
    tl.add(animateHeaderFooterSpinners(FAST));
    tl.add(colorizeFooterHeaderTitles(FAST), '<');
    tl.add(animateCounter(FAST, counter, setter, false, selectedSite === 'biz'), '<');
    return tl;
};

export const betterCallClick = (selectedSite: SiteKey, counter: number, setter: Dispatch<SetStateAction<number>>) => {
    const tl = gsap.timeline({
        paused: true,
        onStart: () => {
            setter(0);
        },
    });
    tl.add(animateHeaderFooterSpinners(DEFAULT));
    tl.add(colorizeFooterHeaderTitles(DEFAULT), '<');
    tl.add(animateCounter(DEFAULT - (selectedSite === 'biz' ? 0.8 : 0), counter, setter, false, selectedSite === 'biz'), '<');
    return tl;
};

export const betterCallClickWtf = (counter: number, setter: Dispatch<SetStateAction<number>>) => {
    const tl = gsap.timeline({
        paused: true,
        onStart: () => {
            setter(0);
        },
    });
    tl.add(animateHeaderFooterSpinners(DEFAULT));
    tl.add(colorizeFooterHeaderTitles(DEFAULT), '<');
    tl.add(animateCounter(DEFAULT, counter, setter, false, true, 'linear'), '<');

    return tl;
};

export const audioTween = (buffers: AudioBuffers, site: Site) => {
    let counter1 = 0;
    let counter2 = 0;
    // let interval: typeof Timeout;

    const copy = {
        counter1,
        counter2,
    };
    const house = {
        getAttribute: (key: string) => key, //copy[key],
        setAttribute: (qualifiedName: string, value: number) => {
            counter1 = value;
            // if (value - counter1 > 0.02) {
            //     console.log('counter');
            //     if (interval) {
            //         clearTimeout(interval);
            //         buffers.stopAll();
            //     }
            //     buffers.play(site.header.ringAudio, false);
            //     buffers.play(site.footer.ringAudio, false);
            //     buffers.play(site.header.spinningSalAudio1, false);
            //     buffers.play(site.header.spinningSalAudio2, false);
            //     counter1 = value;
            //
            //     interval = setTimeout(() => {
            //         buffers.stop(site.header.ringAudio);
            //         buffers.stop(site.footer.ringAudio);
            //         buffers.stop(site.header.spinningSalAudio1);
            //         buffers.stop(site.header.spinningSalAudio2);
            //         counter2 = value;
            //     }, 1000);
            // }
        },
    };

    const tween = gsap.to(house, {
        attr: { counter1: counter1 + 1 },
        duration: 0.1,
        onRepeat: (self: gsap.core.Tween) => {
            if (counter2++ % 2 === 0) {
                buffers.play(site.header.ringAudio, false);
                buffers.play(site.footer.ringAudio, false);
                buffers.play(site.header.spinningSalAudio1, false);
                buffers.play(site.header.spinningSalAudio2, false);
            } else buffers.stopAll();

            if (counter2 % 10 === 0) self.timeScale(self.timeScale() + 0.25);
        },
        repeat: 200,
        paused: true,
    });
    tween.vars.onRepeatParams = [tween];
    return tween;
};
