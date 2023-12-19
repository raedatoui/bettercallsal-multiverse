import art from '../content/content-art.json';
import biz from '../content/content-biz.json';
import fit from '../content/content-fit.json';
import gallery from '../content/content-gallery.json';
import rocks from '../content/content-rocks.json';
import games from '../content/content-games.json';
import world from '../content/content-world.json';
import wtf from '../content/content-wtf.json';
import slugify from '../src/utils/slugify';
import { writeFileSync } from 'fs';
import { join } from 'path';

const content = {
    art,
    biz,
    fit,
    gallery,
    rocks,
    games,
    world,
    wtf,
};

Object.entries(content).forEach(([key, value]) => {
    const items = value.items.map((item) => ({
        ...item,
        slug: slugify(item.name),
    }));

    writeFileSync(join(__dirname, '../', 'content', 'v3', `content-${key}.json`), JSON.stringify({ items }, undefined, 4), {
        flag: 'w',
    });
});
