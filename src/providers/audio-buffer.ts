import { CDN } from 'src/constants';
import { Site, SoundMap } from '../types';

class AudioBuffers {
    private readonly soundMap: SoundMap;
    private loadCount: number;
    private listCount: number;
    private selectedSite: Site | null = null;
    private context: AudioContext | null = null;
    private analyzer: AnalyserNode | null = null;
    public loaded: boolean;
    public contextLoaded: boolean;

    constructor() {
        this.soundMap = {};
        this.loadCount = 0;
        this.listCount = 0;
        this.loaded = false;
        this.contextLoaded = false;
    }

    public async updateSite(site: Site) {
        if (this.selectedSite !== site && typeof window !== 'undefined') {
            this.selectedSite = site;
            this.loaded = false;
            this.stopAll();
            await this.loadSounds();
        }
    }

    public createContext() {
        if (!this.context) {
            this.context = new AudioContext();
            this.analyzer = this.context.createAnalyser();
            this.analyzer.fftSize = 1024;
            this.contextLoaded = true;
        }
    }

    public play(sound: string, loop: boolean = true): AudioBufferSourceNode | null {
        if (this.loaded) {
            const obj = this.soundMap[sound];
            if (obj && this.context && this.analyzer) {
                const source = this.context.createBufferSource();
                source.buffer = obj.buffer;
                source.connect(this.analyzer);
                source.loop = loop;
                this.analyzer.connect(this.context.destination);
                obj.source = source;
                source.start(0, obj.pausedAt);
                obj.startedAt = this.context.currentTime - obj.pausedAt;

                return source;
            }
        }
        return null;
    }

    public stop(sound: string) {
        const obj = this.soundMap[sound];
        if (obj && obj.source) {
            obj.source.disconnect();
            obj.source.stop(0);
            obj.startedAt = 0;
            obj.pausedAt = 0;
        }
    }

    public pause(sound: string) {
        if (this.loaded) {
            const obj = this.soundMap[sound];
            if (obj && this.context && this.analyzer) {
                if (!obj.source) {
                    console.warn('cant pause source!');
                    return;
                }
                let elapsed = this.context.currentTime - obj.startedAt;
                this.stop(sound);
                if (elapsed > obj.buffer.duration)
                    elapsed = 0;
                obj.pausedAt = elapsed;
            }
        }
    }

    private async loadSounds() {
        this.loaded = false;
        if (this.selectedSite) {
            const isNotNull = <T>(x: T): x is NonNullable<T> => !!x;
            const navSounds = this.selectedSite.leftNav.items.map(i => i.audio).filter(isNotNull);
            const sounds = [
                this.selectedSite.header.ringAudio,
                this.selectedSite.header.spinningSalAudio,
                ...navSounds
            ];
            if (this.selectedSite.leftNav.audio)
                sounds.push(this.selectedSite.leftNav.audio);
            const existing = Object.keys(this.soundMap);
            const newSounds = sounds.filter(s => !existing.includes(s));
            await Promise.all(newSounds.map(async (k) => this.loadBuffer(k)));
            this.loaded = true;
        }
    }

    private async loadBuffer(sound: string) {
        const request = new XMLHttpRequest();
        request.responseType = 'arraybuffer';
        // request.async = false;
        request.onload = () => {
            // Asynchronously decode the audio file data in request.response
            this.context?.decodeAudioData(
                request.response,
                buffer => {
                    if (!buffer) {
                        console.error(`error decoding file data: ${sound}`);
                        return;
                    }

                    this.soundMap[sound] = {
                        file: sound,
                        startedAt: 0,
                        pausedAt: 0,
                        buffer,
                        source: null
                    };
                },
                error => {
                    console.error('decodeAudioData error', error);
                }
            );
        };
        request.onerror = () => {
            console.error('BufferLoader: XHR error');
        };
        request.open('GET', `${CDN}${sound}`, true);
        request.send();
    }

    stopAll() {
        Object.keys(this.soundMap).forEach(s => this.stop(s));
    }
}

export default AudioBuffers;
