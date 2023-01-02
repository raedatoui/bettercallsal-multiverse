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
    lowerBanner: z.string(),
});

export type Header = z.infer<typeof HeaderValidator>;

export const LeftNavItemValidator = z.object({
    name: z.string(),
    audio: z.string().nullable(),
    video: z.string().nullable(),
    link: z.string().nullable(),
    category: z.string().nullable(),
});

export type LeftNavNavItem = z.infer<typeof LeftNavItemValidator>;

export const SiteKeyValidator = z.enum(['biz', 'fit', 'art', 'rocks', 'games', 'construction']);

export type SiteKey = z.infer<typeof SiteKeyValidator>;

export const SiteValidator = z.object({
    name: SiteKeyValidator,
    header: HeaderValidator,
    contentHeader: z.string(),
    leftNav: z.object({
        image: z.string(),
        text: z.string(),
        video: z.string().nullable(),
        items: z.array(LeftNavItemValidator),
    }),
    rightNav: z.object({
        type: z.enum(['image', 'spotify']),
        objectId: z.string(),
    }),
    footer: z.object({
        text: z.string(),
        image: z.string(),
        ringAudio: z.string(),
    }),
});

export type Site = z.infer<typeof SiteValidator>;

export const SiteMapValidator = z.object({
    biz: SiteValidator,
    fit: SiteValidator,
    art: SiteValidator,
    rocks: SiteValidator,
    games: SiteValidator,
    construction: SiteValidator,
});

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

export type Size = {
    width: number | undefined;
    height: number | undefined;
};

export const BaseContentItemValidator = z.object({
    name: z.string(),
    contentId: z.string(),
    contentType: z.string(), // TODO: add an enum on this
    thumb: z.string(),
    category: z.string(), // TODO: add an enum on this that matches the nav, but not .biz, hm....
    description: z.string(),
    caption: z.string()
});

export type BaseContentItem = z.infer<typeof BaseContentItemValidator>;
export const BizContentItemValidator = BaseContentItemValidator.extend({
    views: z.number()
});
export const BizContentListValidator = z.array(BizContentItemValidator);
export const BaseContentListValidator = z.array(BaseContentItemValidator);

export type BizContentItem = z.infer<typeof BizContentItemValidator>;

export const RocksContentItemValidator = BaseContentItemValidator.extend({
    views: z.number()
});
export const RocksContentListValidator = z.array(RocksContentItemValidator);

export type RocksContentItem = z.infer<typeof RocksContentItemValidator>;

export const FitContentItemValidator = BaseContentItemValidator.extend({
    time: z.string()
});
export const FitContentListValidator = z.array(FitContentItemValidator);

export type FitContentItem = z.infer<typeof FitContentItemValidator>;

export const ArtContentItemValidator = BaseContentItemValidator.extend({
    year: z.number().optional()
});

export const ArtContentListValidator = z.array(ArtContentItemValidator);

export type ArtContentItem = z.infer<typeof ArtContentItemValidator>;

export const ContentMapValidator = z.object({
    biz: BizContentListValidator,
    fit: FitContentListValidator,
    art: ArtContentListValidator,
    rocks: RocksContentListValidator,
    games: BaseContentListValidator,
    construction: BaseContentListValidator,
});

export type ContentMap = z.infer<typeof ContentMapValidator>;
