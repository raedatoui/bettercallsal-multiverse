import { promises } from 'fs';
import { join } from 'path';
import { HeaderValidator, Header, Site, SiteValidator } from '../src/types';
import { CsvRow, parseCsv } from './csv';

export const loadSheet = async (sheet: string): Promise<CsvRow[]> => {
    const csvData = await promises.readFile(join(__dirname, '../', 'public', sheet), 'utf-8');
    return parseCsv(csvData);
};

export const loadHeaders = async (): Promise<Header[]> => {
    const rows = await loadSheet('header.csv');
    return rows.map(r => HeaderValidator.parse(r));
};

export const loadSites = async (): Promise<Record<string, Site>> => {
    const rows = await loadSheet('sites.csv');
    console.log(rows);
    const headers = await loadHeaders();
    const sites = rows.map(r => SiteValidator.parse({
        name: r.site,
        header: headers.filter(h => h.key === r.site)[0]
    })).reduce((acc, v) => ({
        ...acc,
        [v.name]: v
    }), {});
    console.log(JSON.stringify(sites));
    return sites;
};
