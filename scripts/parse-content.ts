import { BaseContentListValidator } from '../src/types';
import { loadSheet } from './csv';

const run = async () => {
    const rows = await loadSheet('content-biz.csv');
    const contentList = BaseContentListValidator.parse(rows.map(r => ({
        ...r,
        views: r.views === '' ? null : parseInt(r.views.toString(), 10),
        // year: r.year === '' ? null : parseInt(r.year.toString(), 10),
        // width: r.width === '' ? null : parseInt(r.width.toString(), 10),
        // height: r.height === '' ? null : parseInt(r.height.toString(), 10),
    })));
    console.log(JSON.stringify(contentList));
    return contentList;
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
