import { z } from 'zod';

export const SiteKeyValidator = z.enum(['biz', 'rocks', 'fit', 'art', 'games', 'construction', 'gallery', 'wtf', 'world']);
export type SiteKey = z.infer<typeof SiteKeyValidator>;

export const HeaderValidator = z.object({
    bizerk: z.object({
        icon: z.string(),
        site: SiteKeyValidator,
    }),
    lowerBanner: z.string(),
    name1: z.string(),
    name2: z.string(),
    ringAudio: z.string(),
    showTicker: z.boolean(),
    spinningSalAudio1: z.string(),
    spinningSalAudio2: z.string(),
    spinningSalsLeft: z.string(),
    spinningSalsRight: z.string(),
    title1: z.string(),
    title2: z.string(),
});
export type Header = z.infer<typeof HeaderValidator>;

export const LeftNavItemValidator = z.object({
    audio: z.string().nullable(),
    path: z.string().nullable(),
    id: z.string().uuid().optional(),
    link: z.string().nullable(),
    name: z.string(),
    quote: z.string().nullable(),
    quoteLink: z.string().nullable(),
    site: SiteKeyValidator,
});
export type LeftNavItem = z.infer<typeof LeftNavItemValidator>;

export const LeftNavValidator = z.object({
    audio: z.string().nullable(),
    image: z.string(),
    items: z.array(LeftNavItemValidator),
    text: z.string(),
    path: z.string().nullable(),
});
export type LeftNav = z.infer<typeof LeftNavValidator>;

export const RightNavValidator = z.object({
    type: z.enum(['image', 'spotify']),
    objectId: z.string(),
});
export type RightNav = z.infer<typeof RightNavValidator>;

export const FooterValidator = z.object({
    icon: z.object({
        image: z.string(),
        width: z.number(),
        height: z.number(),
        site: SiteKeyValidator,
    }),
    ringAudio: z.string(),
    text: z.string(),
});
export type Footer = z.infer<typeof FooterValidator>;

export const SiteValidator = z.object({
    contentHeader: z.string(),
    footer: FooterValidator,
    gaTag: z.string(),
    header: HeaderValidator,
    leftNav: LeftNavValidator,
    metaDescription: z.string(),
    metaKeywords: z.string(),
    metaTitle: z.string(),
    name: SiteKeyValidator,
    rightNav: RightNavValidator,
});
export type Site = z.infer<typeof SiteValidator>;

export const SiteMapValidator = z.object({
    art: SiteValidator,
    biz: SiteValidator,
    construction: SiteValidator,
    fit: SiteValidator,
    gallery: SiteValidator,
    games: SiteValidator,
    rocks: SiteValidator,
    world: SiteValidator,
    wtf: SiteValidator,
});

export type SiteMap = Record<SiteKey, Site>;

export const BizerkModeValidator = z.enum(['off', 'on']);
export type BizerkMode = z.infer<typeof BizerkModeValidator>;
