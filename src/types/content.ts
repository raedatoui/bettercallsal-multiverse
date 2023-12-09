import { z } from 'zod';
import { SiteKeyValidator } from './site';

export type Size = {
    width: number;
    height: number;
};

export type ContentSize = Size & { left: number; top: number };

// export const ContentItemValidator = z.discriminatedUnion('contentType', [
//     z.object({ contentType: 'youtube', {')
// ]);

export const BaseContentItemValidator = z.object({
    name: z.string(),
    contentId: z.string(),
    contentType: z.string(), // TODO: add an enum on this and build predicates for each type
    thumb: z.string(),
    category: z.string().optional(), // TODO: add an enum on this that matches the nav, but not .biz, hm....
    display: z.boolean().default(true),
    site: SiteKeyValidator,

    description: z.string().optional(),
    caption: z.string().optional(),
    views: z.number().optional().nullable(),
    year: z.number().optional().nullable(),
    width: z.number().optional().nullable(),
    height: z.number().optional().nullable(),
});
export type BaseContentItem = z.infer<typeof BaseContentItemValidator>;
export const BaseContentListValidator = z.array(BaseContentItemValidator);

export const GameContentItemValidator = BaseContentItemValidator.extend({
    dataUrl: z.string(),
    frameworkUrl: z.string(),
    codeUrl: z.string(),
    showBanner: z.boolean(),
});
export type GameContentItem = z.infer<typeof GameContentItemValidator>;
export const GameContentListValidator = z.array(GameContentItemValidator);

export const ContentMapValidator = z.object({
    biz: BaseContentListValidator,
    fit: BaseContentListValidator,
    art: BaseContentListValidator,
    rocks: BaseContentListValidator,
    games: GameContentListValidator,
    construction: BaseContentListValidator,
    gallery: GameContentListValidator,
    wtf: BaseContentListValidator.or(GameContentListValidator),
    world: BaseContentListValidator,
});
export type ContentMap = z.infer<typeof ContentMapValidator>;

export const isGame = (item: BaseContentItem): item is GameContentItem => item.contentType === 'game' || item.contentType === 'gallery';

export const isContent = (item: BaseContentItem | GameContentItem): item is BaseContentItem =>
    item.contentType !== 'game' && item.contentType !== 'gallery';
