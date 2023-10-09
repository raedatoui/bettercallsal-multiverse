export interface UnityInstance {
    Quit: () => Promise<void>;
    SetFullscreen: () => Promise<void>;
}

type TextFitOptions = {
    alignVert?: boolean;
    alignHoriz?: boolean;
    multiLine?: boolean;
    detectMultiLine?: boolean;
    minFontSize?: number;
    maxFontSize?: number;
    reProcess?: boolean;
    widthOnly?: boolean;
    alignVertWithFlexbox?: boolean;
};

export interface YTPlayer {
    stopVideo: () => void;
    playVideo: () => void;
    destroy: () => void;
    loadVideoById: (v: string) => void;
    cueVideoById: (v: string) => void;
    seekTo: (x: number) => void;
    new: (id: string, options: unknown) => YTPlayer;
}

export interface VimeoPlayer {
    pause: () => void;
    loadVideo: (id: string) => void;
    destroy: () => void;
    on: (event: string, cb: () => void) => void;
    new: (id: string, options: unknown) => VimeoPlayer;
}

class VideoPlayer {
    id: string;
    options: unknown;
    constructor(id: string, options: unknown) {
        this.id = id;
        this.options = options;
    }
}

declare global {
    interface Window {
        createUnityInstance: (canvas: HTMLElement | null, config: unknown, cb: (progress: number) => void) => Promise<UnityInstance>;
        textFit: (el: HTMLElement, options?: TextFitOptions) => void;
        domtoimage: {
            toPng: (el: HTMLElement) => Promise<string>;
            toBlob: (el: HTMLElement) => Promise<Blob>;
        };
        htmlToImage: {
            toPng: (el: HTMLElement) => Promise<string>;
            toBlob: (el: HTMLElement) => Promise<Blob>;
        };

        html2canvas: (el: HTMLElement, options?: unknown) => Promise<HTMLCanvasElement>;

        AudioContext: typeof AudioContext;
        webkitAudioContext: typeof AudioContext;
        onYouTubeIframeAPIReady: () => void;
        gtag: (a: string, b: string, c: { page_location: string; page_title: string }) => void;

        YT: {
            Player: typeof VideoPlayer;
            PlayerState: {
                ENDED: 0;
            };
        };
        Vimeo: {
            Player: typeof VideoPlayer;
        };
    }
}
