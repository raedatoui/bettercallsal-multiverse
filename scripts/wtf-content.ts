import { writeFileSync } from 'fs';
import { join } from 'path';
import art from '../content/content-art.json';
import biz from '../content/content-biz.json';
import fit from '../content/content-fit.json';
import gallery from '../content/content-gallery.json';
import games from '../content/content-games.json';
import rocks from '../content/content-rocks.json';
import world from '../content/content-world.json';

// add site to each item
// const artContent = {
//   items: art.items.map((i) => ({ ...i, site: 'art' })),
// };
// const bizContent = {
//   items: biz.items.map((i) => ({ ...i, site: 'biz' })),
// };
//
// const fitContent = {
//   items: fit.items.map((i) => ({ ...i, site: 'fit' })),
// };
//
// const galleryContent = {
//   items: gallery.items.map((i) => ({ ...i, site: 'gallery' })),
// };
//
// const gamesContent = {
//   items: games.items.map((i) => ({ ...i, site: 'games' })),
// };
//
// const rocksContent = {
//   items: rocks.items.map((i) => ({ ...i, site: 'rocks' })),
// };
//
const mash = {
    items: [...art.items, ...biz.items, ...fit.items, ...gallery.items, ...games.items, ...rocks.items, ...world.items],
};

// writeFileSync(join(__dirname, '../', 'content', 'content-art.json'), JSON.stringify(artContent, undefined, 4), {
//     flag: 'w',
// });
//
// writeFileSync(join(__dirname, '../', 'content', 'content-biz.json'), JSON.stringify(bizContent, undefined, 4), {
//     flag: 'w',
// });
//
// writeFileSync(join(__dirname, '../', 'content', 'content-fit.json'), JSON.stringify(fitContent, undefined, 4), {
//     flag: 'w',
// });
//
// writeFileSync(join(__dirname, '../', 'content', 'content-gallery.json'), JSON.stringify(galleryContent, undefined, 4), {
//     flag: 'w',
// });
//
// writeFileSync(join(__dirname, '../', 'content', 'content-games.json'), JSON.stringify(gamesContent, undefined, 4), {
//     flag: 'w',
// });
//
// writeFileSync(join(__dirname, '../', 'content', 'content-rocks.json'), JSON.stringify(rocksContent, undefined, 4), {
//     flag: 'w',
// });

writeFileSync(join(__dirname, '../', 'content', 'content-wtf.json'), JSON.stringify(mash, undefined, 4), {
    flag: 'w',
});
