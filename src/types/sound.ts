import { z } from 'zod';

export const SoundValidator = z.object({
    file: z.string(),
    startedAt: z.number(),
    pausedAt: z.number(),
});

export type Sound = z.infer<typeof SoundValidator> & {
    source: AudioBufferSourceNode | null;
    buffer: AudioBuffer;
    startedAt: number;
    pausedAt: number;
    file: string;
    playing: boolean;
    id: string;
};

export const AudioElementValidator = z.enum(['headerRing', 'spinningLeft', 'spinningRight', 'leftNavAudio', 'leftNavItemAudio', 'footerRing']);
export type AudioElement = z.infer<typeof AudioElementValidator>;

export type PlayAudioFn = (el: AudioElement, filter?: string) => void;
