/* eslint-disable no-await-in-loop */
import path from 'path';
import { faker } from '@faker-js/faker';
import mariadb from 'mariadb';
import { z } from 'zod';
import contentArt from '../content/content-art.json';
import contentBiz from '../content/content-biz.json';
import contentFit from '../content/content-fit.json';
import contentGames from '../content/content-games.json';
import contentRocks from '../content/content-rocks.json';
import { BaseContentItem, BaseContentListValidator, GameContentItem, GameContentListValidator, SiteKey, SiteKeyValidator } from '../src/types';
import slugify from '../src/utils/slugify';

const URL = 'https://bettercallsal.';
const IMAGE_URL = 'https://storage.googleapis.com/bcs-assets/images/';

const segMap: Record<SiteKey, string> = {
    biz: 'video',
    rocks: 'video',
    fit: 'video',
    art: 'art',
    games: 'game',
    gallery: 'gallery',
    construction: 'construction',
    wtf: 'wtf',
    world: 'world',
};

type Row = {
    id: number;
    domain: string;
    thumb: string;
    slug: string;
    queued: number;
    variation: number;
    description: string;
};

const Post = z.object({
    id: z.number(),
    domain: SiteKeyValidator,
    slug: z.string(),
    thumb: z.string(),
    variations: z.array(
        z.object({
            description: z.string(),
            variation: z.number(),
            queued: z.number(),
        })
    ),
});

type PostType = z.infer<typeof Post>;

const pickRandomPost = (arr: PostType[], queue: PostType[]) => {
    const random = arr[Math.floor(Math.random() * arr.length)];
    const lastPick = queue.length > 0 ? queue[queue.length - 1] : null;

    queue.push(random);
    return random;
};

const transformImage = (src: string) => {
    const f = path.parse(src);
    let ext = path.extname(src);
    if (ext !== '.webm' && ext !== '.gif') ext = '.webp';
    return `${f.name}${ext}`;
};

const mapContentToUrls = (map: Record<string, string>, site: SiteKey, contentList: (BaseContentItem | GameContentItem)[]) =>
    contentList.map((i) => ({
        slug: `${map[site]}${slugify(i.name)}`,
        thumb: i.thumb,
        description: faker.lorem.paragraphs(5),
    }));

const generateContentMap = () => {
    const urlMap = Object.keys(segMap).reduce(
        (acc, site) => ({
            ...acc,
            [site]: '', // `${URL}${site}/${seg}/`
        }),
        {}
    );

    return {
        art: mapContentToUrls(urlMap, 'art', BaseContentListValidator.parse(contentArt.items)),
        biz: mapContentToUrls(urlMap, 'biz', BaseContentListValidator.parse(contentBiz.items)),
        fit: mapContentToUrls(urlMap, 'fit', BaseContentListValidator.parse(contentFit.items)),
        rocks: mapContentToUrls(urlMap, 'rocks', BaseContentListValidator.parse(contentRocks.items)),
        games: mapContentToUrls(urlMap, 'games', GameContentListValidator.parse(contentGames.items)),
    };
};

const seedDatabase = async (conn: mariadb.Connection, contentMap: ReturnType<typeof generateContentMap>) => {
    await conn.query('DROP TABLE `post_desc`');

    await conn.query('DROP TABLE `posts`');

    await conn.query('DROP TABLE `current_set`');

    await conn.query(
        'CREATE TABLE `posts` (' +
            '`id` int(11) unsigned NOT NULL AUTO_INCREMENT,' +
            '`domain` varchar(15) NOT NULL,' +
            '`slug` varchar(255) NOT NULL,' +
            '`thumb` varchar(255) DEFAULT NULL,' +
            '  PRIMARY KEY (`id`)' +
            ') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;'
    );

    await conn.query(
        'CREATE TABLE `post_desc` (' +
            '`id` int(11) unsigned NOT NULL AUTO_INCREMENT,' +
            '`post_id` int(11) unsigned NOT NULL,' +
            '`variation` tinyint(4) unsigned NOT NULL,' +
            '`queued` tinyint(1) NOT NULL,' +
            '`description` text NOT NULL,' +
            'PRIMARY KEY (`id`), ' +
            'KEY `post_id` (`post_id`),' +
            'CONSTRAINT `post_desc_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE' +
            ') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;'
    );

    await conn.query(
        'CREATE TABLE `current_set` (' +
            '`id` int(11) unsigned NOT NULL AUTO_INCREMENT,' +
            '`variation` int(11) NOT NULL,' +
            'PRIMARY KEY (`id`)' +
            ') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;'
    );

    const values = Object.entries(contentMap)
        .map(([site, entries]) => entries.map((entry) => [site, entry.slug, transformImage(entry.thumb)]))
        .flat(1);

    await conn.batch('INSERT INTO posts (domain, slug, thumb) VALUES(?, ?, ?)', values);
    await conn.commit();

    const rows = await conn.query('SELECT id FROM posts');
    const descValues = rows
        .map((row: { id: number }) => [
            [row.id, 0, 1, faker.lorem.paragraphs(5)],
            [row.id, 1, 1, faker.lorem.paragraphs(5)],
            [row.id, 2, 1, faker.lorem.paragraphs(5)],
            [row.id, 3, 1, faker.lorem.paragraphs(5)],
        ])
        .flat(1);

    await conn.batch('INSERT INTO post_desc (post_id, variation, queued, description) VALUES(?, ?, ?, ?)', descValues);
    await conn.commit();

    await conn.query('INSERT INTO current_set (variation) VALUES(0)');
};

const postCountInVariation = async (conn: mariadb.Connection, variation: number) => {
    const res = await conn.query<{ count: number }[]>({
        sql: `
    SELECT 
        COUNT(*) as count
    FROM 
        post_desc pd
    WHERE pd.variation = ${variation} AND pd.queued = 1;
    `,
        bigIntAsNumber: true,
    });
    return res[0].count;
};

const selectPosts = async (conn: mariadb.Connection, variation: number) => {
    const rows = await conn.query<Row[]>(`
    SELECT 
        p.id, p.domain, p.slug, p.thumb, pd.queued, pd.description, pd.variation
    FROM 
        post_desc pd
    INNER JOIN 
        posts p ON p.id = pd.post_id
    WHERE pd.queued = 1
    AND pd.variation = ${variation}
    ORDER BY 
        p.id;
    `);
    // await conn.commit();

    const fmt = rows.map((row) => {
        const domain = SiteKeyValidator.parse(row.domain);
        return {
            id: z.number().parse(row.id),
            domain,
            slug: z
                .string()
                .transform((v) => `${URL}${domain}/${segMap[domain]}/${v}`)
                .parse(row.slug),
            thumb: z
                .string()
                .transform((v) => `${IMAGE_URL}${domain}/thumbs/${v}`)
                .parse(row.thumb),
            queued: z.number().parse(row.queued),
            variation: z.number().parse(row.variation),
            description: z.string().parse(row.description),
        };
    });
    const map: Record<number, PostType> = {};
    fmt.reduce((acc, entry) => {
        const { id, domain, slug, thumb, description, variation, queued } = entry;
        const currentVariations = acc[id]?.variations || [];
        const updatedVariations = [...currentVariations, { description, variation, queued }];

        acc[id] = {
            id,
            domain,
            slug,
            thumb,
            variations: updatedVariations.sort((a, b) => a.variation - b.variation),
        };
        return acc;
    }, map);
    return Array.from(Object.values(map));
};

const run = async () => {
    const args = process.argv.slice(2); // Slice the first two values: executable path and script path
    let command: 'seed' | 'pick' | null = null;

    // Loop through the arguments to find --command
    for (let i = 0; i < args.length; i++)
        if (args[i] === '--command' || args[i] === '-c') {
            const potentialCommand = args[i + 1];
            if (potentialCommand && potentialCommand.trim() !== '' && (potentialCommand === 'seed' || potentialCommand === 'pick'))
                command = potentialCommand;

            break;
        }

    if (command) {
        console.log(`Executing: ${command}`);
        const conn = await mariadb.createConnection({
            host: '127.0.01',
            user: 'root',
            password: 'root',
            port: 3306,
        });
        await conn.query('USE `bcs-social`');
        if (command === 'seed') await seedDatabase(conn, generateContentMap());

        if (command === 'pick') {
            const queue: PostType[] = [];
            let hasQueued = true;
            const res = await conn.query<{ id: number; variation: number }[]>('SELECT * from current_set;');
            let { variation } = res[0];
            do {
                const posts = await selectPosts(conn, variation);
                if (posts.length === 0) {
                    hasQueued = false;
                    break;
                }
                const post = pickRandomPost(posts, queue);
                const postVariation = post.variations[0].variation;
                console.log(`Picked: ${post.domain} - ${post.slug} - ${postVariation}`);
                await conn.query('UPDATE post_desc SET queued = 0 WHERE post_id = ? AND variation = ?', [post.id, postVariation]);
                await conn.commit();

                const count = await postCountInVariation(conn, variation);
                if (count === 0) {
                    variation += 1;
                    console.log(`Bucket: moving to ${variation}`);
                    console.log('------');
                    await conn.query(`UPDATE current_set SET variation = ${variation};`);
                    await conn.commit();
                }
            } while (hasQueued);
        }
    } else {
        console.error("Error: The --command argument is required and must be either 'seed' or 'pick'.");
        process.exit(1);
    }
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
