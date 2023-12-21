import { z } from 'zod';
import { SiteKeyValidator } from './site';

export type Size = {
    width: number;
    height: number;
};

export type ContentSize = Size & { left: number; top: number };
export const ContentTypeValidator = z.enum(['game', 'video', 'youtube', 'vimeo', 'image']);
export type ContentType = z.infer<typeof ContentTypeValidator>;

export const BaseContentItemValidator = z.object({
    name: z.string(),
    contentId: z.string(),
    contentType: ContentTypeValidator,
    thumb: z.string(),
    category: z.string().optional(), // TODO: add an enum on this that matches the nav, but not .biz, hm....
    display: z.boolean().default(true),
    site: SiteKeyValidator,
    slug: z.string(),
    description: z.string().optional().nullable(),
    caption: z.string().optional().nullable(),
    views: z.number().optional(),
    year: z.number().optional().nullable(),
    width: z.number().optional().nullable(),
    height: z.number().optional().nullable(),
    desktopOnly: z.boolean().default(false),
});
export type BaseContentItem = z.infer<typeof BaseContentItemValidator>;
export const BaseContentListValidator = z.array(BaseContentItemValidator);

export const GameContentItemValidator = BaseContentItemValidator.extend({
    dataUrl: z.string(),
    frameworkUrl: z.string(),
    codeUrl: z.string(),
    assetsUrl: z.string().nullable(),
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
    world: BaseContentListValidator.or(GameContentListValidator),
});
export type ContentMap = z.infer<typeof ContentMapValidator>;

export const isGame = (item: BaseContentItem): item is GameContentItem => item.contentType === 'game';

export const isContent = (item: BaseContentItem | GameContentItem): item is BaseContentItem => item.contentType !== 'game';
