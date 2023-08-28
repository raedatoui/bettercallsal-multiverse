import { PlaywrightCrawler, Dataset } from 'crawlee';

// PlaywrightCrawler crawls the web using a headless
// browser controlled by the Playwright library.
const crawler = new PlaywrightCrawler({
    // Use the requestHandler to process each of the crawled pages.
    async requestHandler({ request, page, enqueueLinks, log }) {
        const fittedNav = page.locator('.textFitted');
        page.waitForTimeout(1000);
        const nodes = await fittedNav.all();
        log.info(nodes.length.toString());
        const title = await page.title();
        log.info(`Title of ${request.loadedUrl} is '${title}'`);

        // Save results as JSON to ./storage/datasets/default
        await Dataset.pushData({ title, url: request.loadedUrl });

        // Extract links from the current page
        // and add them to the crawling queue.
        await enqueueLinks();
    },
    // Uncomment this option to see the browser window.
    headless: true,
});

// Add first URL to the queue and start the crawl.
const run = async () => {
    await crawler.run([
        'https://bettercallsal.biz',
        'https://bettercallsal.rocks',
        'https://bettercallsal.fit',
        'https://bettercallsal.art',
        'https://bettercallsal.games',
        'https://bettercallsal.construction',
        'https://bettercallsal.gallery',
        'https://bettercallsal.fans',
    ]);
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
