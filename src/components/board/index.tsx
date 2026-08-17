'use client';

import Image from 'next/image';
import { AudioBoard } from '@/components/board/elements';
import { useSiteContext } from '@/providers/sites';
import { SiteKeyValidator } from '@/types';

const AudioExperiment = () => {
    const { siteMap } = useSiteContext();

    return (
        <AudioBoard>
            {SiteKeyValidator.options.map((site) => (
                <Image alt={site} key={site} width={100} height={100} src={siteMap[site].header.spinningSalsLeft} />
            ))}
        </AudioBoard>
    );
};

export default AudioExperiment;
