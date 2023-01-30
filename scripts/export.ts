import { LeftNavNavItem, SiteMapValidator } from 'src/types';
import { convertObjectToCsvString } from './csv';
import sitesData from '../content/sites.json';

export const run = async () => {
    const siteMap = SiteMapValidator.parse(sitesData);
    Object.entries(siteMap).map(([key, site]) => {
        console.log(key);
        console.log(convertObjectToCsvString<LeftNavNavItem>(site.leftNav.items));
        console.log('-------');
        return 1;
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
