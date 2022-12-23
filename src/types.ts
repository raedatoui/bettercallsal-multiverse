import { z } from 'zod';

export const HeaderValidator = z.object({
    spinningSalsLeft: z.string(),
    spinningSalsRight: z.string(),
    spinningSalAudio: z.string(),
    bizerkIcon: z.string(),
    ringAudio: z.string(),
    name1: z.string(),
    name2: z.string(),
    title: z.string(),
    lowerBannerTxt: z.string(),
    contentHeaderTxt: z.string(),
    key: z.string(), // for csv parsing
});

export type Header = z.infer<typeof HeaderValidator>;

export const SiteValidator = z.object({
    name: z.string(),
    header: HeaderValidator
});

export type Site = z.infer<typeof SiteValidator>;

export const OrderedSites = ['biz', 'fit', 'art', 'rocks', 'games', 'construction'];
export const SiteKeyValidator = z.enum(['biz', 'fit', 'art', 'rocks', 'games', 'construction']);

export type SiteKey = z.infer<typeof SiteKeyValidator>;

export const SiteMapValidator = z.record(
    SiteKeyValidator,
    SiteValidator
);

export type SiteMap = z.infer<typeof SiteMapValidator>;

export const SoundValidator = z.object({
    file: z.string(),
    startedAt: z.number(),
    pausedAt: z.number(),
});

export type Sound = z.infer<typeof SoundValidator> & {
    source: AudioBufferSourceNode | null,
    buffer: AudioBuffer,
};

export type SoundMap = Record<string, Sound>;

export type CbFn = () => void;
