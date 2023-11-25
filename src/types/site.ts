import { z } from 'zod';

export const SiteKeyValidator = z.enum(['biz', 'rocks', 'fit', 'art', 'games', 'construction', 'gallery', 'wtf']);
export type SiteKey = z.infer<typeof SiteKeyValidator>;

export const HeaderValidator = z.object({
    spinningSalsLeft: z.string(),
    spinningSalsRight: z.string(),
    spinningSalAudio1: z.string(),
    spinningSalAudio2: z.string(),
    bizerkIcon: z.string(),
    ringAudio: z.string(),
    name1: z.string(),
    name2: z.string(),
    title1: z.string(),
    title2: z.string(),
    lowerBanner: z.string(),
    showTicker: z.boolean(),
});
export type Header = z.infer<typeof HeaderValidator>;

export const LeftNavItemValidator = z.object({
    name: z.string(),
    audio: z.string().nullable(),
    video: z.string().nullable(),
    link: z.string().nullable(),
    category: z.string().nullable(),
    quote: z.string().nullable(),
    quoteLink: z.string().nullable(),
    id: z.string().uuid().optional(),
    site: SiteKeyValidator,
});
export type LeftNavItem = z.infer<typeof LeftNavItemValidator>;

export const LeftNavValidator = z.object({
    image: z.string(),
    text: z.string(),
    video: z.string().nullable(),
    audio: z.string().nullable(),
    items: z.array(LeftNavItemValidator),
});
export type LeftNav = z.infer<typeof LeftNavValidator>;

export const RightNavValidator = z.object({
    type: z.enum(['image', 'spotify']),
    objectId: z.string(),
});
export type RightNav = z.infer<typeof RightNavValidator>;

export const FooterValidator = z.object({
    text: z.string(),
    icon: z.object({
        image: z.string(),
        width: z.number(),
        height: z.number(),
    }),
    ringAudio: z.string(),
});
export type Footer = z.infer<typeof FooterValidator>;

export const SiteValidator = z.object({
    name: SiteKeyValidator,
    contentHeader: z.string(),
    metaTitle: z.string(),
    metaDescription: z.string(),
    metaKeywords: z.string(),
    header: HeaderValidator,
    leftNav: LeftNavValidator,
    rightNav: RightNavValidator,
    footer: FooterValidator,
    gaTag: z.string(),
});
export type Site = z.infer<typeof SiteValidator>;

export const SiteMapValidator = z.object({
    biz: SiteValidator,
    fit: SiteValidator,
    art: SiteValidator,
    rocks: SiteValidator,
    games: SiteValidator,
    construction: SiteValidator,
    gallery: SiteValidator,
    wtf: SiteValidator,
});
export type SiteMap = Record<SiteKey, Site>;

export const BizerkModeValidator = z.enum(['off', 'on']);
export type BizerkMode = z.infer<typeof BizerkModeValidator>;
