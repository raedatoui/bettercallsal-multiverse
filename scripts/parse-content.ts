import { promises } from 'node:fs';
import { join } from 'node:path';
import { z } from 'zod';
import { BaseContentListValidator } from '../src/types';
import slugify from '../src/utils/slugify';
import { loadSheet } from './csv';

const run = async () => {
    const rows = await loadSheet('content-biz.csv');
    const contentList = BaseContentListValidator.parse(
        rows.map((r) => ({
            ...r,
            site: 'biz',
            views: r.views === '' ? null : Number.parseInt(r.views.toString(), 10),
            slug: slugify(z.string().parse(r.name)),
        }))
    );
    const content = JSON.stringify({ items: contentList }, null, 2);
    await promises.writeFile(join(__dirname, '../', 'content', 'content-biz.json'), content);
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
