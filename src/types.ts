import { createBrowserRouter } from 'react-router-dom';
import { z } from 'zod';

export const HeaderValidator = z.object({
    spinningSalsLeft: z.string(),
    spinningSalsRight: z.string(),
    spinningSalAudio: z.string(),
    bizerkIcon: z.string(),
    bizerkIconType: z.enum(['image', 'video']),
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
    quote: z.string().nullable(),
    quoteLink: z.string().nullable(),
});

export type LeftNavNavItem = z.infer<typeof LeftNavItemValidator>;

export const SiteKeyValidator = z.enum(['biz', 'rocks', 'fit', 'art', 'games', 'construction', 'gallery']);

export const tickerList = SiteKeyValidator.options.filter(s => s !== 'gallery');

export type SiteKey = z.infer<typeof SiteKeyValidator>;

export const SiteValidator = z.object({
    name: SiteKeyValidator,
    contentHeader: z.string(),
    metaTitle: z.string(),
    metaDescription: z.string(),
    metaKeywords: z.string(),
    header: HeaderValidator,
    leftNav: z.object({
        image: z.string(),
        text: z.string(),
        video: z.string().nullable(),
        audio: z.string().nullable(),
        items: z.array(LeftNavItemValidator),
    }),
    rightNav: z.object({
        type: z.enum(['image', 'spotify']),
        objectId: z.string(),
    }),
    footer: z.object({
        text: z.string(),
        icon: z.string(),
        iconType: z.enum(['image', 'video']),
        iconWidth: z.number(),
        iconHeight: z.number(),
        ringAudio: z.string(),
    }),
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
});

export type SiteMap = Record<SiteKey, Site>;

export const SoundValidator = z.object({
    file: z.string(),
    startedAt: z.number(),
    pausedAt: z.number(),
});

export type Sound = z.infer<typeof SoundValidator> & {
    source: AudioBufferSourceNode | null,
    buffer: AudioBuffer,
    startedAt: number,
    pausedAt: number,
    file: string,
    playing: boolean,
    id: string,
};

export type CbFn = () => void;

export type Size = {
    width: number;
    height: number;
};

export const BaseContentItemValidator = z.object({
    name: z.string(),
    contentId: z.string(),
    contentType: z.string(), // TODO: add an enum on this and build predicates for each type
    thumb: z.string(),
    category: z.string(), // TODO: add an enum on this that matches the nav, but not .biz, hm....

    description: z.string().optional(),
    caption: z.string().optional(),
    views: z.number().optional().nullable(),
    year: z.number().optional().nullable(),
    width: z.number().optional().nullable(),
    height: z.number().optional().nullable(),
    display: z.boolean().default(true),
});

export type BaseContentItem = z.infer<typeof BaseContentItemValidator>;
export const BaseContentListValidator = z.array(BaseContentItemValidator);

export const GameContentItemValidator = BaseContentItemValidator.extend({
    dataUrl: z.string(),
    frameworkUrl: z.string(),
    codeUrl: z.string(),
    streamingAssetsUrl: z.string(),
    companyName: z.string(),
    productName: z.string(),
    productVersion: z.string(),
    showBanner: z.boolean(),
    devicePixelRatio: z.number(),
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
});

export type ContentMap = z.infer<typeof ContentMapValidator>;

export type ContentSize = Size & { left: number, top: number };

export interface UnityInstance {
    Quit: () => Promise<void>;
    SetFullscreen: () => Promise<void>;
}

type TextFitOptions = {
    alignVert?: boolean,
    alignHoriz?: boolean,
    multiLine?: boolean,
    detectMultiLine?: boolean,
    minFontSize?: number,
    maxFontSize?: number,
    reProcess?: boolean,
    widthOnly?: boolean,
    alignVertWithFlexbox?: boolean
};

declare global {
    interface Window {
        createUnityInstance: (canvas: HTMLElement | null, config: Object, cb: (progress: number) => void) => Promise<UnityInstance>;
        textFit: (el: HTMLElement, options?: TextFitOptions) => void;
        domtoimage: {
            toPng: (el: HTMLElement) => Promise<string>;
            toBlob: (el: HTMLElement) => Promise<Blob>;
        };
        htmlToImage: {
            toPng: (el: HTMLElement) => Promise<string>;
            toBlob: (el: HTMLElement) => Promise<Blob>;
        };

        html2canvas: (el: HTMLElement, options?: Object) => Promise<HTMLCanvasElement>;

        AudioContext: typeof AudioContext;
        webkitAudioContext: typeof AudioContext;
        onYouTubeIframeAPIReady: () => void;
    }
}

export const BizerkModeValidator = z.enum(['off', 'doubleClick', 'construction']);

export type BizerkMode = z.infer<typeof BizerkModeValidator>;

export const AudioElementValidator = z.enum([
    'headerRing',
    'spinningLeft',
    'spinningRight',
    'leftNavAudio',
    'leftNavItemAudio',
    'footerRing']);
export type AudioElement = z.infer<typeof AudioElementValidator>;

export type PlayAudioFn = (el:AudioElement, filter?: string) => void;

export const isNotNull = <T>(x: T): x is NonNullable<T> => !!x;

export interface VideoContentItem {
    video: string;
}

export const isGame = (item: BaseContentItem): item is GameContentItem => item.contentType === 'game' || item.contentType === 'gallery';

export const isContent = (item: BaseContentItem | GameContentItem): item is BaseContentItem =>
    item.contentType !== 'game' && item.contentType !== 'gallery';

export type Router = ReturnType<typeof createBrowserRouter>;

export type VisibleProps = {
    visible: boolean;
};
