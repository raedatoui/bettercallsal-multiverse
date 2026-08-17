import { notFound } from 'next/navigation';
import AudioExperiment from '@/components/board';
import { config } from '@/constants';

// DOC: gated the same way the react-router child route was — off unless
//  next.config.env.json sets experiments to "true".
const AudioPage = () => {
    if (!config.experiments) notFound();
    return <AudioExperiment />;
};

export default AudioPage;
