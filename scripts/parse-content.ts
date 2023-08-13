import { promises } from 'fs';
import { join } from 'path';
import { BaseContentListValidator } from '../src/types';
import { loadSheet } from './csv';

const run = async () => {
    const rows = await loadSheet('content-biz.csv');
    const contentList = BaseContentListValidator.parse(rows.map(r => ({
        ...r,
        views: r.views === '' ? null : parseInt(r.views.toString(), 10),
    })));
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
