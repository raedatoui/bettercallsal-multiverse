import { promises, writeFileSync } from 'fs';
import { join } from 'path';
import { z } from 'zod';

const envValidator = z.object({
    selectedSite: z.string(),
    cdn_url: z.string()
});

const run = async () => {
    const args = process.argv;
    if (args.length < 1) {
        console.error('Not enough arguments.');
        console.log('Run using cmd: ts-node src/deploy.ts [site]');
        process.exit(1);
    }
    const site = args[2];

    const config = await promises.readFile(join(__dirname, '../', 'next.config.env.json'), 'utf-8');
    const env = envValidator.parse(JSON.parse(config));
    env.selectedSite = site;
    writeFileSync(join(__dirname, '../', 'next.config.env.json'), JSON.stringify(env), {
        flag: 'w',
    });
};

run()
    .then(() => {
        process.exit();
    })
    .catch((err) => {
        console.log(err);
        console.log(JSON.stringify(err));
        process.exit();
    });