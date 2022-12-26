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

    public createContext() {
        if (!this.context) {
            this.context = new AudioContext();
            this.analyzer = this.context.createAnalyser();
            this.analyzer.fftSize = 1024;
            this.contextLoaded = true;
        }
    }
    public play(sound: string): AudioBufferSourceNode | null {
        if (this.loaded) {
            const obj = this.soundMap[sound];
            if (obj && this.context && this.analyzer) {
                const source = this.context.createBufferSource();
                source.buffer = obj.buffer;
                source.connect(this.analyzer);
                this.analyzer.connect(this.context.destination);
                source.start(0, obj.pausedAt);
                obj.startedAt = this.context.currentTime - obj.pausedAt;
                obj.source = source;
                return source;
            }
        }
        return null;
    }
    public stop(sound: string) {
        const obj = this.soundMap[sound];
        if (obj) {
            if (!obj.source) {
                console.warn('cant stop source!');
                return;
            }
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

    public async updateSite(site: Site) {
        if (this.selectedSite !== site && typeof window !== 'undefined') {
            this.selectedSite = site;
            this.loaded = false;
            await this.loadSounds();
        }
    }

    private async loadSounds() {
        this.loaded = false;
        if (this.selectedSite) {
            const isNotNull = <T>(x: T): x is NonNullable<T> => !!x;
            const navSounds = this.selectedSite.leftNav.items.map(i => i.audio).filter(isNotNull);
            console.log(navSounds);
            const sounds = [
                this.selectedSite.header.ringAudio,
                this.selectedSite.header.spinningSalAudio,
                ...navSounds
            ];
            await Promise.all(sounds.map(async (k) => this.loadBuffer(k)));
            this.loaded = true;
        }
    }
    //     this.soundList = {
    //         airhorn: {
    //             url: '/audio/airhorn.wav',
    //             source: '',
    //             buffer: null,
    //             startedAt: 0,
    //             pausedAt: 0,
    //         },
    //         phoneRing: {
    //             url: '/audio/phone-ring.wav',
    //             source: null,
    //             buffer: null,
    //             startedAt: 0,
    //             pausedAt: 0,
    //         },
    //         salutations: {
    //             url: '/audio/salutations.wav',
    //             source: null,
    //             buffer: null,
    //             startedAt: 0,
    //             pausedAt: 0,
    //         },
    //         bettercallquick: {
    //             url: '/audio/bettercallquick.wav',
    //             source: null,
    //             buffer: null,
    //             startedAt: 0,
    //             pausedAt: 0,
    //         },
    //         truck: {
    //             url: '/audio/hard-horn.mp3',
    //             source: '',
    //             buffer: null,
    //             startedAt: 0,
    //             pausedAt: 0,
    //         },
    //         hardRing: {
    //             url: '/audio/hard-ring.mp3',
    //             source: '',
    //             buffer: null,
    //             startedAt: 0,
    //             pausedAt: 0,
    //         },
    //     };
    // }
    //
    // load() {
    //     const keys = Object.keys(this.soundList);
    //     this.listCount = keys.length;
    //     keys.forEach(key => {
    //         this.loadBuffer(key, this.soundList[key]);
    //     });
    // }
    //
    async loadBuffer(sound: string) {
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
                    // if (sound === 'airhorn')
                    //     this.soundList.airhorn2 = {
                    //         source: '',
                    //         buffer: utils.clone(buffer),
                    //         startedAt: 0,
                    //         pausedAt: 0,
                    //     };
                    //
                    // if (sound === 'truck')
                    //     this.soundList.truck2 = {
                    //         source: '',
                    //         buffer: utils.clone(buffer),
                    //         startedAt: 0,
                    //         pausedAt: 0,
                    //     };

                },
                error => {
                    console.error('decodeAudioData error', error);
                }
            );
        };
        request.onerror = () => {
            console.error('BufferLoader: XHR error');
        };
        request.open('GET', sound, true);
        request.send();
    }
    //
    // updateBuffers(buffers) {
    //     this.buffers = buffers;
    // }
    //
    // getBuffers() {
    //     return this.buffers;
    // }
    //
    //

    //

}

export default AudioBuffers;
