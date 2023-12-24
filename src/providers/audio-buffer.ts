import { generateUUID } from 'three/src/math/MathUtils';
import { CDN } from '@/constants';
import { AudioElementValidator, SiteKey, Sound } from '@/types';

const copyBuffer = (buffer: AudioBuffer, context: AudioContext): AudioBuffer => {
    const copy = context.createBuffer(buffer.numberOfChannels, buffer.length, buffer.sampleRate);
    for (let channel = 0; channel < buffer.numberOfChannels; channel++) copy?.getChannelData(channel).set(buffer.getChannelData(channel), 0);
    return copy;
};

// TODO: next ideas for audio map
// const audioMapValidator = z.map(z.string().uuid(), SoundValidator);
// type AudioMap = z.infer<typeof audioMapValidator>;

class AudioBuffers {
    private readonly soundMap: Record<string, Sound>;
    private context: AudioContext | null = null;
    public analyzer: AnalyserNode | null = null;
    public loaded: boolean;
    public contextLoaded: boolean;
    public audioMap: Record<string, Sound>;
    private allSounds: AudioBufferSourceNode[] = [];
    private gainNode: GainNode | null = null;

    constructor() {
        this.soundMap = {};
        this.loaded = false;
        this.contextLoaded = false;
        this.audioMap = {};
    }

    public async loadSounds(files: string[]) {
        if (typeof window !== 'undefined') {
            this.loaded = false;
            this.stopAll();
            const existing = Object.keys(this.soundMap);
            const newSounds = files.filter((s) => !existing.includes(s));
            await Promise.all(newSounds.map((s) => this.loadBuffer(s)));
            this.loaded = true;
        }
    }

    public mapBuffers(map: Record<string, string>) {
        const memo: Record<string, boolean> = {};

        Object.entries(map).forEach(([k, v]) => {
            const sound = this.soundMap[v];
            if (!memo[k]) {
                this.audioMap[k] = sound;
                memo[k] = true;
            } else if (this.context)
                this.audioMap[k] = {
                    ...sound,
                    buffer: copyBuffer(sound.buffer, this.context),
                };
        });
    }

    public createContext() {
        if (!this.context) {
            this.context = new (window.AudioContext || window.webkitAudioContext)();

            this.contextLoaded = true;
            this.gainNode = this.context.createGain();
            this.gainNode.connect(this.context.destination);
            this.gainNode.gain.value = 0.5;

            this.analyzer = this.context.createAnalyser();
            this.analyzer.fftSize = 1024;
            this.analyzer.connect(this.gainNode);
        }
    }

    public playFromMap(sound: string, loop = true): AudioBufferSourceNode | null {
        if (this.loaded) {
            const obj = this.audioMap[sound];
            return this.playSound(obj, loop);
        }
        return null;
    }

    public async play(sound: string, loop = true, randomStart = false): Promise<AudioBufferSourceNode | null> {
        if (this.loaded) {
            let obj = this.soundMap[sound];
            if (!obj) await this.loadBuffer(sound);
            obj = this.soundMap[sound];
            return this.playSound(obj, loop, randomStart);
        }
        return null;
    }

    private playSound(sound: Sound, loop = true, randomStart = false): AudioBufferSourceNode | null {
        // DOC: assigns a new buffer to the sound object
        if (sound && this.context && this.analyzer && this.gainNode) {
            const source = this.context.createBufferSource();
            source.buffer = sound.buffer;
            source.connect(this.analyzer);
            source.loop = loop;
            // eslint-disable-next-line no-param-reassign
            sound.source = source;

            source.connect(this.gainNode);
            // DOC: offset used to be sound.pausedAt

            source.start(0, randomStart ? Math.random() * source.buffer.duration : sound.pausedAt);
            // eslint-disable-next-line no-param-reassign
            sound.startedAt = this.context.currentTime - sound.pausedAt;
            this.allSounds.push(source);
            return source;
        }
        return null;
    }

    public stop(sound: string) {
        // DOC: this stops the currently held buffer by the sound object
        //  allowing the spinning hover effect
        const obj = this.soundMap[sound];
        if (obj && obj.source) {
            obj.source.disconnect();
            obj.source.stop(0);
            obj.startedAt = 0;
            obj.pausedAt = 0;
        }
    }

    public pause(sound: string) {
        // DOC: this pause the currently held buffer by the sound object,
        //  allowing the spinning hover effect
        if (this.loaded) {
            const obj = this.soundMap[sound];
            if (obj && this.context && this.analyzer) {
                if (!obj.source) {
                    console.warn('cant pause source!');
                    return;
                }
                let elapsed = this.context.currentTime - obj.startedAt;
                this.stop(sound);
                if (elapsed > obj.buffer.duration) elapsed = 0;
                obj.pausedAt = elapsed;
            }
        }
    }

    private async loadBuffer(sound: string) {
        const audioRequest = new Request(`${CDN}${sound}`);
        const xhr = await fetch(audioRequest);
        const buffer = await xhr.arrayBuffer();
        if (this.context) {
            const decoded = await this.context.decodeAudioData(buffer);
            this.soundMap[sound] = {
                file: sound,
                startedAt: 0,
                pausedAt: 0,
                buffer: decoded,
                source: null,
                playing: false,
                id: generateUUID(),
            };
        }
    }

    stopAll() {
        this.allSounds.forEach((s) => {
            s.disconnect();
            s.stop(0);
        });
        // Object.keys(this.soundMap).forEach((s) => this.stop(s));
    }

    public bizerk(site: SiteKey) {
        const playbackSounds: Sound[] = [];
        const keys = Object.keys(this.audioMap);
        if (this.context) {
            keys.forEach((key) => {
                const sound = this.audioMap[key];
                playbackSounds.push(sound);
                if (this.context && site !== 'fit') {
                    if (key === AudioElementValidator.enum.spinningLeft)
                        playbackSounds.push({
                            ...sound,
                            buffer: copyBuffer(sound.buffer, this.context),
                            id: generateUUID(),
                        });
                    if (key === AudioElementValidator.enum.spinningRight)
                        playbackSounds.push({
                            ...sound,
                            buffer: copyBuffer(sound.buffer, this.context),
                            id: generateUUID(),
                        });
                    if (key === AudioElementValidator.enum.footerRing)
                        playbackSounds.push({
                            ...sound,
                            buffer: copyBuffer(sound.buffer, this.context),
                            id: generateUUID(),
                        });
                    if (key === AudioElementValidator.enum.headerRing)
                        playbackSounds.push({
                            ...sound,
                            buffer: copyBuffer(sound.buffer, this.context),
                            id: generateUUID(),
                        });
                }
            });

            const playNext = (sound: Sound) => {
                const source = this.playSound(sound, false);
                if (!source) return;
                source.onended = () => {
                    const delay = Math.random() * 500;
                    setTimeout(() => playNext(sound), delay);
                };
            };

            playbackSounds.forEach((sound, i) => {
                setTimeout(() => playNext(sound), i * 500);
            });
        }
    }
}

export default AudioBuffers;
